import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userName:{type:String,require:true},
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default:true, required: true },
    logo:{type:String},
    isLogged:{type:Boolean,default:false},
    resetToken: { type:String ,require:false},
    expire:{type:Date},
    seller: {
      name: String,
      logo: {type:String,},
      description: String,
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
export default User;
