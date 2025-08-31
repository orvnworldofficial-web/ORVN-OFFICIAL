// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ToastProvider } from "./components/ToastProvider"; // ✅ custom ORVN Toast
import ChatbotWidget from "./components/ChatbotWidget"; // ✅ new chatbot widget

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <div className="bg-secondary text-accent font-sans min-h-screen flex flex-col">
          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="relative z-10 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>

          {/* Chatbot Widget (always visible on every page) */}
          <ChatbotWidget />

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
