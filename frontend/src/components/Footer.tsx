import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useToast } from "./ToastProvider"; 
import { socialLinks } from "../config/socialLinks";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      showToast("Please enter a valid email 📧", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/newsletter/subscribe`,
        { email }
      );

      if (res.status === 200) {
        showToast("🎉 You’ve joined ORVN! Check your inbox 💜", "success");
        setEmail("");
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        showToast("⚡ You’re already subscribed!", "warning");
      } else {
        showToast("⚠️ Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0a001a] text-white py-10 px-6 mt-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-fuchsia-900/30 blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-purple-400">ORVN</h2>
          <p className="mt-2 text-sm text-gray-300">
            Automating growth through AI, Data & Branding. 💡 1+1=3 — We will do great things!
          </p>

          {/* Social Links (all from socialLinks.tsx) */}
          <div className="flex space-x-4 mt-4">
            {socialLinks.map((s, i) => (
              <motion.a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.3, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-3 rounded-full transition group"
                style={{ color: s.color }}
              >
                {s.icon}
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition blur-md"
                  style={{ backgroundColor: s.color }}
                />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Join Our Newsletter 💜</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="px-4 py-2 rounded-lg text-black flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe 🚀"}
            </button>
          </form>
        </div>

        {/* Links Section */}
        <div className="flex flex-col space-y-2 text-gray-300 text-sm">
          <a href="/about" className="hover:text-purple-400">About Us</a>
          <a href="/contact" className="hover:text-purple-400">Contact</a>
          <a href="/privacy" className="hover:text-purple-400">Privacy Policy</a>
          <a href="/terms" className="hover:text-purple-400">Terms & Conditions</a>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative mt-10 text-center text-gray-400 text-xs">
        © {new Date().getFullYear()} ORVN. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
