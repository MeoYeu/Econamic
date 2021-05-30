import express, { json } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import uploadRouter from "./routers/uploadRouter.js";
import { createRequire } from "module";
import Product from "./models/productModel.js";
import tinhThanhRouter from "./routers/tinhThanhRouter.js";
import quanhuyenRouter from "./routers/quanhuyenRouter.js";
import Message from "./models/messages.js";
import conversationRouter from "./routers/conversationRouter.js";
import Converesation from "./models/conversation.js";
import messageRouter from "./routers/messageRouter.js";
import Conversation from "./models/conversation.js";

const require = createRequire(import.meta.url);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/amazona", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
app.use("/api/uploads", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/tinhthanh", tinhThanhRouter);
app.use("/api/quanhuyen", quanhuyenRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/message", messageRouter);
app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

app.get("/", (req, res) => {
  res.send("server đang chạy");
});
app.get("/api/config/google", (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || "");
});
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use(express.static(path.join(__dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
const httpServer = require("http").createServer(app);
const options = {};

let users = [];
let chatUsers = [];
const io = require("socket.io")(httpServer, options);
io.on("connection", (socket) => {
  socket.on("createComment", async (msg) => {
    const { comment, productId, name, rating } = msg;

    const product = await Product.findById(productId);
    const review = {
      name: name,
      rating: rating,
      comment: comment,
    };
    // console.log("truow",comment);

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;

    const updatedProduct = await product.save();
    console.log("msg.productId", updatedProduct);
    io.emit("sendCommentToClient", updatedProduct);
  });
  //chat
  const addUser = (userId, socketId) => {
    !chatUsers.some((user) => user.userId === userId) &&
      chatUsers.push({ userId, socketId });
  };
  const getUser = (userId) => {
    return chatUsers.find((user) => user.userId === userId);
  };


  socket.on("home", async (data) => {
    console.log("1 đứa kết nối", data);
    chatUsers.push({
      id: socket.id,
      userId: data._id,
    });
  });

  socket.on("getmsg", async (data) => {
    const product = await Product.findById(data.productId).populate("seller");

    const usersell = chatUsers.find(
      (x) => x.userId === product.seller._id.toString()
    );

    const conver = await Converesation.find({
      members: { $in: [product.seller._id, data.userInfo._id] },
    });
    socket.broadcast.to([usersell.id]).emit("sendmsg", {
      msg: data.msg,
      receive: product.seller._id,
      sender: data.userInfo,
    });
    if (conver.length === 0) {
      console.log("rỗng");
      const newConversation = new Conversation({
        members: [data.userInfo._id, product.seller._id.toString()],
      });
      const saveConversation = await newConversation.save();
      if (saveConversation) {
        const converId = await Converesation.find({
          members: { $in: [product.seller._id, data.userInfo._id] },
        });
        console.log("converId", converId[0]._id);
        const mes = new Message({
          text: data.msg,
          sender: data.userInfo._id,
          conversationId: converId[0]._id,
        });

        const message = await mes.save();
        if (message) {
          console.log("đã lưu", message);
        }
      }
    } else {
      const converId = await Converesation.find({
        members: { $in: [product.seller._id, data.userInfo._id] },
      });
      const mes = new Message({
        text: data.msg,
        sender: data.userInfo._id,
        conversationId: converId[0]._id,
      });
      const message = await mes.save();
    }
  });
  socket.on("guilai", async (data) => {
    const converId = await Converesation.find({
      members: { $in: [data.userInfo, data.userReceive] },
    });
    
    const t = getUser(data.userReceive);

    socket.to(t?.id).emit("guinua", data);
    if (converId.length === 0) {
    } else {
      const mes = new Message({
        text: data.msg,
        sender: data.userInfo,
        conversationId: converId[0]._id,
      });
    }
  });

});
httpServer.listen(port);


