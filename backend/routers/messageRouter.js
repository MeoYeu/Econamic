import express from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../models/messages.js";
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from "../utils.js";

const messageRouter = express.Router();

messageRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    try {
      const newMessage = new Message(req.body);

      const mess = await newMessage.save();
      if (mess) {
        res.status(200).send(mess);
      }
    } catch (error) {
      res.status(401).send({ message: "lỗi", error });
    }
  })
);

messageRouter.get(
  "/:id",

  expressAsyncHandler(async (req, res) => {
    try {
      const message = await Message.find({
        conversationId: req.params.id,
      });
      res.status(200).json(message);
    } catch (error) {
      res.status(401).send({ message: "lỗi", error });
    }
  })
);
messageRouter.get(
  "/",

  expressAsyncHandler(async (req, res) => {
    const conversation = await Message.find({});

    if (conversation) {
      res.status(200).send(conversation);
    } else {
      res.status(404).send({ message: "không tìm thấy kết quả" });
    }
  })
);

export default messageRouter;
