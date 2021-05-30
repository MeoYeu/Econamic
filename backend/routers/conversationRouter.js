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
  
  expressAsyncHandler(async (req, res) => {
    
      const newConversation = new Conversation({
        members:[req.body.senderId,req.body.receiveId]
      });
      const saveConversation = await newConversation.save();
      
    if(saveConversation)
    {
      res.status(200).send({message:"thêm mới thành công"});
    }else{
      res.status(401).send({message:"không dc"});
    }
  })
);

conversationRouter.get(
  '/:id',
  
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
conversationRouter.get(
  '/members/',
  
  expressAsyncHandler(async (req, res) => {
    const conversation = await Conversation.find({
        members:{$in:[req.body.senderId,req.body.receiveId]}
    });
    if (conversation) {
      res.send(conversation);
    } else {
      res.status(404).send({ message: 'không tìm thấy kết quả' });
    }
  })
);
conversationRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const users = await Conversation.find({});
    res.send(users);
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
