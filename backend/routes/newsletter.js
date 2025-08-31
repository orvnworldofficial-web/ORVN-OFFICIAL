// routes/newsletter.js
import express from "express";
import Subscriber from "../models/Subscriber.js";
import { sendComplimentaryEmail } from "../utils/mailer.js"; // ✅ updated import

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if exists
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Already subscribed" });
    }

    // Save new subscriber
    const sub = new Subscriber({ email });
    await sub.save();

    // Send branded welcome email
    await sendComplimentaryEmail(email); // ✅ updated call

    return res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
