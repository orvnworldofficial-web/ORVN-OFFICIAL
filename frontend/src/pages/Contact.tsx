import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Send, Sparkles, ArrowDown } from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { socialLinks } from "../config/socialLinks";

/**
 * Suggested quick prompts for users to click.
 */
const SUGGESTED_QUESTIONS = [
  "What is ORVN?",
  "Tell me about your services",
  "How can I join ORVN?",
  "What campuses are available?",
  "How do I subscribe to the newsletter?",
];

type Sender = "user" | "bot" | "system";

interface Message {
  id: string;
  text: string;
  from: Sender;
  ts: number; // timestamp (ms)
}

/** small util for classNames */
function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Format a short time like 14:03 */
function timeLabel(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Reduced-motion check (for subtle animation tuning) */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!m.matches);
    update();
    m.addEventListener?.("change", update);
    return () => m.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/**
 * Contact page:
 * - Hero is always visible
 * - Chat sits below hero
 * - Three.js animated background
 * - Typing & Thinking indicators
 * - Better contrast, accessibility, and robust cleanup
 * - FIX: allow full-page vertical scroll and never clip content
 * - FIX: background never intercepts pointer events
 * - FIX: background resizes with page height via ResizeObserver
 */
const Contact: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatting, setChatting] = useState(false); // first interaction
  const [isThinking, setIsThinking] = useState(false); // waiting for server (network)
  const [isTyping, setIsTyping] = useState(false); // visual typing dots
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const reducedMotion = usePrefersReducedMotion();

  const { showToast } = useToast();

  // ========= 3D BACKGROUND ====================================================
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / Math.max(1, mountRef.current.clientHeight),
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const cubes: THREE.Mesh[] = [];
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];

    for (let i = 0; i < 20; i++) {
      const geometry = new THREE.BoxGeometry(
        Math.random() * 0.5 + 0.1,
        Math.random() * 0.5 + 0.1,
        Math.random() * 0.5 + 0.1
      );
      const material = new THREE.MeshStandardMaterial({
        color: 0x3a0088,
        emissive: 0x9b59b6,
        emissiveIntensity: 0.4,
        metalness: 0.1,
        roughness: 0.6,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      cubes.push(cube);
      materials.push(material);
      geometries.push(geometry);
      scene.add(cube);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    const pointLight = new THREE.PointLight(0x9b59b6, 1.2, 120);
    pointLight.position.set(10, 10, 10);
    scene.add(ambientLight, pointLight);

    camera.position.z = 15;

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      cubes.forEach((cube, idx) => {
        if (!reducedMotion) {
          cube.rotation.x += 0.001 + idx * 0.0002;
          cube.rotation.y += 0.002 + idx * 0.0002;
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    // Resize on window size change
    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / Math.max(1, clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Resize when container height changes (chat grows, hero etc.)
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(mountRef.current);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      ro.disconnect();
      cubes.forEach((c) => scene.remove(c));
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [reducedMotion]);

  // ========= INITIAL BOT MESSAGES ============================================
  useEffect(() => {
    const now = Date.now();
    const intro: Message[] = [
      { id: `m-${now}-a`, text: "👋 Hey! I’m ORVI, your smart ORVN AI assistant.", from: "bot", ts: now },
      {
        id: `m-${now}-b`,
        text:
          "Ask me about ORVN, our mission, services, campuses, or how to join. " +
          "You can use the suggested questions above to get started. 💜",
        from: "bot",
        ts: now + 1,
      },
    ];
    setMessages(intro);
  }, []);

  // ========= AUTO-SCROLL TO LATEST ===========================================
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isThinking]);

  // Track page scroll position (to show “scroll to bottom” when user scrolls up)
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        document.documentElement.scrollHeight - window.scrollY - window.innerHeight < 64;
      setShowScrollToBottom(!nearBottom);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  const addMessage = (msg: Omit<Message, "id" | "ts">) =>
    setMessages((prev) => [
      ...prev,
      { ...msg, id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ts: Date.now() },
    ]);

  // ========= SEND HANDLER =====================================================
  const API_URL = useMemo(
    () => (import.meta.env.VITE_API_URL?.toString() || "http://localhost:5000"),
    []
  );

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;

    setChatting(true);
    setInput("");

    // User message
    addMessage({ text, from: "user" });

    // Show "thinking" status in header + typing bubbles in chat
    setIsThinking(true);
    setIsTyping(true);

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 30000); // timeout 30s

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || "Server error");
      }

      const data = await res.json();

      // Simulate a tiny delay so the typing dots feel natural (optional)
      if (!reducedMotion) {
        await new Promise((r) => setTimeout(r, 250));
      }

      addMessage({ text: data.reply ?? "I’m here to help! 💜", from: "bot" });

      // Occasional system tip
      if (Math.random() > 0.6) {
        addMessage({
          text:
            "💡 Tip: Try “What is ORVN’s Automated Growth System?” or “How do I join a campus community?”",
          from: "system",
        });
      }
    } catch (err: unknown) {
      console.error(err);
      showToast("⚠️ Chatbot is currently unavailable.", "error");
      addMessage({
        text:
          "Hmm… I couldn’t reach my brain right now. Please try again in a moment.",
        from: "system",
      });
    } finally {
      setIsThinking(false);
      // Keep the typing bubble on just a moment longer so it fades smoothly
      setTimeout(() => setIsTyping(false), reducedMotion ? 0 : 200);
    }
  };

  // Submit on Enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-secondary text-accent min-h-screen flex flex-col relative">
      {/* 3D Background */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none select-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90 z-10 pointer-events-none" />

      {/* HERO (ALWAYS VISIBLE) */}
      <motion.section
        aria-label="Contact ORVN Assistant"
        className="relative z-20 flex flex-col items-center text-center pt-28 md:pt-32 px-6 pb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.8 }}
      >
        <h1 className="text-5xl md:text-6xl font-bold text-accent drop-shadow-lg mb-4">
          👋 Hey, I’m ORVI!
        </h1>

        <p className="text-base sm:text-lg md:text-xl max-w-3xl text-neutral/90 drop-shadow mb-6">
          I’m ORVN’s AI assistant. I can provide information about ORVN, answer your
          questions, and guide you to our resources. 💜
        </p>

        {/* Suggested chips */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.5 }}
          aria-label="Suggested questions"
        >
          {SUGGESTED_QUESTIONS.map((q) => (
            <motion.button
              key={q}
              onClick={() => {
                setInput(q);
                handleSend(q);
              }}
              whileHover={reducedMotion ? {} : { scale: 1.04 }}
              whileTap={reducedMotion ? {} : { scale: 0.96 }}
              className="bg-[#3a0088] hover:bg-[#9b59b6] text-white/95 text-sm md:text-base px-3 md:px-4 py-2 rounded-2xl shadow-glow transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={`Ask: ${q}`}
              type="button"
            >
              {q}
            </motion.button>
          ))}
        </motion.div>

        {/* Status bar (thinking indicator) */}
        <div
          className="mt-2 flex items-center gap-2 text-sm text-white/90"
          aria-live="polite"
        >
          {isThinking ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              <span className="flex items-center gap-1">
                ORVI is thinking <Sparkles size={14} />
              </span>
            </>
          ) : (
            <>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span>Online</span>
            </>
          )}
        </div>
      </motion.section>

      {/* CHAT SECTION (BELOW HERO) */}
      <section
        className="flex flex-col z-20 relative w-full max-w-3xl mx-auto px-4 pb-8"
        aria-label="Chat with ORVI"
      >
        {/* Chat header tools */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-white/80 text-sm">
            {messages.length} {messages.length === 1 ? "message" : "messages"}
          </div>
        </div>

        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="mb-4 space-y-3 px-4 py-3 bg-[#140b29]/80 backdrop-blur-md rounded-2xl shadow-inner border border-white/5"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, _idx) => (
              <motion.div
                key={msg.id}
                role="text"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: reducedMotion ? 0 : 0.25 }}
                className={cx(
                  "px-4 py-3 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed shadow-md relative",
                  msg.from === "user"
                    ? "bg-primary text-white self-end ml-auto"
                    : msg.from === "bot"
                    ? "bg-[#3a0088] text-white/95 self-start"
                    : "bg-[#9b59b6] text-white/95 self-start italic"
                )}
              >
                {msg.text}
                <span
                  className={cx(
                    "absolute -bottom-5 text-[10px] opacity-80",
                    msg.from === "user" ? "right-1 text-white/80" : "left-1 text-white/80"
                  )}
                  aria-hidden="true"
                >
                  {timeLabel(msg.ts)}
                </span>
              </motion.div>
            ))}

            {/* Typing bubble (bot) */}
            {isTyping && (
              <motion.div
                key="typing-bubble"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.2 }}
                className="bg-[#3t8] text-white px-4 py-3 rounded-2xl max-w-[50%] self-start flex items-center gap-2 shadow-md"
                aria-label="ORVI is typing"
              >
                <span className="sr-only">ORVI is typing</span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce [animation-delay:0ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce [animation-delay:150ms]" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/90 animate-bounce [animation-delay:300ms]" />
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Scroll-to-bottom helper */}
        <AnimatePresence>
          {showScrollToBottom && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={scrollToBottom}
              className="self-end mb-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-white/10 hover:bg-white/20 text-white/95 transition"
              aria-label="Scroll to latest messages"
            >
              <ArrowDown size={16} />
              New messages
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input Bar */}
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0 : 0.15 }}
          aria-label="Send a message"
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <input
            id="chat-input"
            type="text"
            placeholder="Type your message…"
            className="flex-1 px-4 py-3 rounded-2xl bg-white text-black placeholder-black/50 focus:outline-none focus:ring-4 focus:ring-[#9b59b6]/40 shadow-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-describedby="chat-hint"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-highlight text-white px-5 md:px-6 py-3 rounded-2xl shadow-glow font-semibold transition-transform transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 inline-flex items-center gap-2"
            aria-label="Send message"
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </motion.form>
        <p id="chat-hint" className="sr-only">
          Press Enter to send.
        </p>

        {/* Social Links */}
        <div className="flex justify-center gap-4 mt-6 text-white">
          {socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#3a0088] hover:bg-[#9b59b6] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label={`Open ${s.name} in new tab`}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Helper note for first-time users */}
        {!chatting && (
          <motion.div
            className="mt-6 text-center text-sm text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Start a conversation above, or tap a suggested question to begin.
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Contact;
