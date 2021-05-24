import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import TinhThanh from '../models/tinhthanh.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';

const tinhThanhRouter = express.Router();

tinhThanhRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const tinhthanh = await TinhThanh.find({})
      .sort({ "matinh": 1 })
      
    res.send(tinhthanh);
  })
);



tinhThanhRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const tinhthanh = await TinhThanh.findById(req.params.id).populate(
      
    );
    if (tinhthanh) {
      res.send(tinhthanh);
    } else {
      res.status(404).send({ message: 'tỉnh thành không được tìm thấy' });
    }
  })
);

tinhThanhRouter.post(
  '/',
  
  expressAsyncHandler(async (req, res) => {
    const tinhthanh = new TinhThanh({
      _id: req.body._id,
      tentinh: req.body.tentinh
    
    });
    const createdProduct = await tinhthanh.save();
    res.send({ message: 'đã thêm mới' });
  })
);




export default tinhThanhRouter;
