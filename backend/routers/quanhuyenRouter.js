import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Quanhuyen from '../models/quanhuyen.js';
import TinhThanh from '../models/tinhthanh.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const quanhuyenRouter = express.Router();

quanhuyenRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const quanhuyen = await Quanhuyen.findOne({tenqh:req.params.id});
    if (quanhuyen) {
      res.send(quanhuyen);
    } else {
      res.status(404).send({ message: 'quận huyện không được tìm thấy' });
    }
  })
);


quanhuyenRouter.post(
  '/',
  
  expressAsyncHandler(async (req, res) => {
      
      const tinhthanh=await TinhThanh.find({tentinh:req.body.tentinh});

       if(tinhthanh)
       {
        const quanhuyen = new Quanhuyen({
            maqh: req.body.maqh,
            tenqh: req.body.tenqh,
            tinhthanh_id:tinhthanh[0]._id
          
          });
          const createdProduct = await quanhuyen.save();
            res.send({ message: 'đã thêm mới' });
       }
          
      
    
  })
);




export default quanhuyenRouter;
