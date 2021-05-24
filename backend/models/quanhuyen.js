import mongoose from 'mongoose';

const quanhuyenSchema = new mongoose.Schema(
  {
    maqh:{type:String,require:true},
    tenqh:{type:String,require:true},
    is_deleted: {type: Boolean, default: false, select: false},
    tinhthanh_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'TinhThanh'
      },
  },
  {
    timestamps: true,
  }
);
const Quanhuyen = mongoose.model('Quanhuyen', quanhuyenSchema);
export default Quanhuyen;
