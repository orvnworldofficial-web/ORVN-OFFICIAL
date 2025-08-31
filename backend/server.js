// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import newsletterRouter from "./routes/newsletter.js";
import chatRouter from "./routes/chat.js"; // ✅ ORVI chat

dotenv.config();
const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ JSON parsing
app.use(express.json());

// ✅ Routes
app.use("/api/newsletter", newsletterRouter);
app.use("/api/chat", chatRouter); // ✅ Chat route

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true // ✅ replaces sslValidate: false
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
