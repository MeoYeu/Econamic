import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String },
    sender: { type: String,require:true },
    conversationId: { type: String,require:true },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
