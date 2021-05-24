import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Message from '../models/messages.js';
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from '../utils.js';

const messageRouter = express.Router();



messageRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
   
      const newMessage = new Message(req.body);
      const saveConversation = await newMessage.save();
      if(saveConversation)
      {
          res.status(200).send(saveConversation)
      }else
      {
        res.status(500)
        .send({ message: 'tin nhắn chưa được lưu',  });

      }
        
  })
);

messageRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const conversation = await Conversation.find({
        members:{$in:[req.params.id]}
    });
    if (conversation) {
      res.send(conversation);
    } else {
      res.status(404).send({ message: 'không tìm thấy kết quả' });
    }
  })
);







export default messageRouter;
