import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // unique user session
  role: { type: String, enum: ["user", "orvi"], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("ChatMessage", ChatMessageSchema);
