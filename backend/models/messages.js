import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    text:{type:String,require:true},
    sender:{type:String,require:true},
    conversationId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model('Message', messageSchema);
export default Message;
