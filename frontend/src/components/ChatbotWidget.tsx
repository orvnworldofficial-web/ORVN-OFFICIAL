// src/components/ChatbotWidget.tsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageCircle, X as XIcon } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { socialLinks } from "../config/socialLinks";

interface Message {
  text: string;
  from: "user" | "bot" | "system";
}

// Removed SUGGESTED_QUESTIONS since it was unused

const ChatbotWidget: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    setMessages([
      { text: "👋 Hey! I’m ORVI, your smart ORVN AI assistant.", from: "bot" },
      {
        text:
          "Ask me about ORVN, our mission, services, campuses, or how to join. " +
          "You can use the suggested questions below to get started. 💜",
        from: "bot",
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isThinking]);

  const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    setInput("");
    addMessage({ text, from: "user" });
    setIsThinking(true);
    setIsTyping(true);

    const API_URL = import.meta.env.VITE_API_URL?.toString() || "http://localhost:5000";
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();

      await new Promise((r) => setTimeout(r, 300));
      addMessage({ text: data.reply ?? "I’m here to help! 💜", from: "bot" });

      if (Math.random() > 0.6) {
        addMessage({
          text: "💡 Tip: Try “What is ORVN’s Automated Growth System?”",
          from: "system",
        });
      }
    } catch (err) {
      console.error(err);
      showToast("⚠️ Chatbot is currently unavailable.", "error");
      addMessage({
        text: "Hmm… I couldn’t reach my brain right now. Please try again later.",
        from: "system",
      });
    } finally {
      setIsThinking(false);
      setTimeout(() => setIsTyping(false), 200);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-highlight text-white p-4 rounded-full shadow-lg transition"
        aria-label="Open ORVI Chat"
      >
        {open ? <XIcon size={22} /> : <MessageCircle size={22} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-20 right-6 w-[95%] max-w-sm md:max-w-md 
                       bg-[#140b29]/95 backdrop-blur-md rounded-2xl shadow-2xl 
                       border border-white/10 flex flex-col overflow-hidden z-50"
          >
            <div className="px-4 py-3 bg-[#3a0088] text-white font-semibold flex items-center justify-between">
              ORVI — ORVN AI Assistant
              {isThinking && <Sparkles size={16} className="ml-2 animate-pulse" />}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={`${msg.from}-${idx}`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.25 }}
                    className={`px-3 py-2 rounded-xl max-w-[80%] text-sm shadow-md ${
                      msg.from === "user"
                        ? "bg-primary text-white self-end ml-auto"
                        : msg.from === "bot"
                        ? "bg-[#3a0088] text-white/95 self-start"
                        : "bg-[#9b59b6] text-white/95 self-start italic"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-[#3a0088] text-white px-3 py-2 rounded-xl max-w-[50%] self-start flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-150" />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce delay-300" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={scrollRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 p-3 border-t border-white/10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 rounded-xl bg-white text-black text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-highlight text-white px-4 rounded-xl transition"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="flex justify-center gap-4 py-2 bg-[#140b29]/90">
              {socialLinks.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-white">
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
