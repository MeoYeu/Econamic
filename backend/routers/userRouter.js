import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import data from "../data.js";
import User from "../models/userModel.js";
import {
  generateToken,
  generateToken_pass,
  isAdmin,
  isAuth,
  isAuthResetPass,
} from "../utils.js";
import * as nodemailer from "nodemailer";

const userRouter = express.Router();
userRouter.get(
  "/top-sellers",
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ "seller.rating": -1 })
      .limit(3);
    res.send(topSellers);
  })
);

userRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    // await User.remove({});
    const createdUsers = await Uzser.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      userName: req.body.userName,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      logo: req.body.logo,
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      userName: createdUser.userName,
      name: createdUser.name,
      email: createdUser.email,
      isAdmin: createdUser.isAdmin,
      isSeller: user.isSeller,
      logo: createdUser.logo,
      token: generateToken(createdUser),
    });
  })
);
var code = Math.random(1 * 100);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
userRouter.get(
  "/email/:email",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "Email Not Found" });
    }
  })
);

userRouter.put(
  "/resetpassword",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    if (user) {
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();

      res.send({
        // _id: updatedUser._id,
        // name: updatedUser.name,
        // email: updatedUser.email,
        // isAdmin: updatedUser.isAdmin,
        // isSeller: user.isSeller,
        // token: generateToken(updatedUser),
      });
    }
  })
);
//send email

userRouter.post(
  "/send_email/email/:email",
  expressAsyncHandler(async (req, res) => {
    
    const user = await User.findOne({ email:req.params.email });
  
    if (user) {
    
      const token = generateToken_pass(user._id);

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "amazona.hotro@gmail.com",
          pass: "Sau20091991",
        },
      });

      var mailOptions = {
        from: "amazona.hotro@gmail.com",
        to: "Sauhuuit@gmail.com",
        subject: "yêu cầu reset mật khẩu",
        html: `
     <p>bạn đã yêu cầu reset mật khẩu</p>
     <h5>Click vào đây <a href='http://localhost:3000/reset?token=${token}'>Link</a></h5>
     `,
      };
      transporter.sendMail(mailOptions, function (erro, info) {
        if (erro) {
          res.status(401).send({ message: "gửi không thành công" });
        } else {
          res.status(200).send({ message: "gửi thành công" });
        }
      });
      
    }
    
     else
     {
      res.status(401).send({ message: "email không đúng " });
     }
    
    
    
    
  })
);
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          logo:user.logo,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/new-pass",
  isAuthResetPass,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.json("lỗi");
    }
    user.password = bcrypt.hashSync(req.body.password, 8);
    user.save().then((saveduser) => {
      res.status(200).json("thành công");
    });
  })
);
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (user.isSeller) {
        user.seller.name = req.body.sellerName || user.seller.name;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === "admin@example.com") {
        res.status(400).send({ message: "Can Not Delete Admin User" });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: "User Deleted", user: deleteUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      user.seller.logo = req.body.logo;
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default userRouter;
