import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Conversation from '../models/conversation.js';
import {
  isAdmin,
  isAuth,
  isSellerOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from '../utils.js';

const conversationRouter = express.Router();



conversationRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
      const newConversation = new Conversation({
        members:[req.body.senderId,req.body.receiveId]
        
        
      });
      const saveConversation = await newConversation.save();
      res
        .status(201)
        .send({ message: 'tạo mới cuộc trò chuyện',  });
    }
  })
);

conversationRouter.get(
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



conversationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Conversation.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);



export default conversationRouter;
