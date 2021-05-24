import mongoose from 'mongoose';

const tinhthanhSchema = new mongoose.Schema(
  {
    matinh:{type:String,require:true},
    tentinh:{type:String,require:true},
    is_deleted: {type: Boolean, default: false, select: false}
  },
  {
    timestamps: true,
  }
);
const TinhThanh = mongoose.model('TinhThanh', tinhthanhSchema);
export default TinhThanh;
