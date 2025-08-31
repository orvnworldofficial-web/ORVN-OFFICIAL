import express from "express";
import ChatMessage from "../models/ChatMessage.js";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ORVI personality prompt
const ORVI_SYSTEM_PROMPT = `
You are ORVI 🤖, ORVN’s friendly chatbot. 
- Always stay casual, warm, and engaging (like a smart friend). 
- You ONLY talk about ORVN: its mission, roles , services, community, and launch campuses and anything u can link back to ORVN. 
- If asked something unrelated, politely steer back to ORVN while keeping the conversation natural. 
- Respond to greetings, jokes, or casual talk in a fun but professional way. Use emojis naturally, not excessively.
- Sometimes encourage users with follow-ups (e.g., “Want me to tell you about our roles?”).
- If user speaks in another language, reply in that language where possible but keep focus on ORVN. 
- Avoid over-emphasizing social media. Mention socials only *sometimes* when it feels relevant.
`;

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ message: "Message is required" });

    const sessId = sessionId || uuidv4();

    // Save user message
    await ChatMessage.create({ sessionId: sessId, role: "user", message });

    // Fetch last 10 messages for context
    const previous = await ChatMessage.find({ sessionId: sessId })
      .sort({ timestamp: 1 })
      .limit(10);

    const chatHistory = previous.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.message
    }));

    // Full conversation with system prompt
    const messages = [
      { role: "system", content: ORVI_SYSTEM_PROMPT },
      ...chatHistory,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.8, // slightly higher for more natural flow
      max_tokens: 500
    });

    const orviReply = completion.choices[0].message.content;

    // Save ORVI message
    await ChatMessage.create({ sessionId: sessId, role: "orvi", message: orviReply });

    res.json({ sessionId: sessId, reply: orviReply });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
