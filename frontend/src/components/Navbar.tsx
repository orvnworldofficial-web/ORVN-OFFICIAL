import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Map of display names to routes
  const links: { name: string; path: string }[] = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Track scroll for logo shrink
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-glow"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <motion.img
            src="https://ik.imagekit.io/y71swiiapj/WhatsApp%20Image%202025-08-25%20at%2016.20.16_aecde493.jpg?updatedAt=1756675060080"
            alt="ORVN Logo"
            className="object-contain"
            srcSet="
              https://ik.imagekit.io/y71swiiapj/WhatsApp%20Image%202025-08-25%20at%2016.20.16_aecde493.jpg?tr=w-64 64w,
              https://ik.imagekit.io/y71swiiapj/WhatsApp%20Image%202025-08-25%20at%2016.20.16_aecde493.jpg?tr=w-128 128w,
              https://ik.imagekit.io/y71swiiapj/WhatsApp%20Image%202025-08-25%20at%2016.20.16_aecde493.jpg?tr=w-256 256w
            "
            sizes="(max-width: 768px) 48px, 64px"
            animate={{ height: scrolled ? 36 : 48 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-neutral font-medium">
          {links.map((link) => (
            <li key={link.name} className="relative group">
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `transition-base ${isActive ? "text-highlight font-semibold" : ""}`
                }
              >
                {link.name}
              </NavLink>
              <motion.div
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-highlight"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="hidden md:flex gap-4">
          <motion.button
            className="px-5 py-2 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base"
          >
            Join ORVN
          </motion.button>
          <motion.button
            className="px-5 py-2 bg-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base"
          >
            Contact ORVN
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-accent"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:hidden bg-surface/95 backdrop-blur-sm px-6 pb-6 flex flex-col gap-4 font-medium"
        >
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block hover:text-highlight transition-base ${isActive ? "text-highlight font-semibold" : ""}`
                }
                onClick={() => setIsOpen(false)} // close menu on click
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="flex gap-3 mt-2">
            <motion.button className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base">
              Join ORVN
            </motion.button>
            <motion.button className="flex-1 px-4 py-2 bg-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base">
              Contact
            </motion.button>
          </li>
        </motion.ul>
      )}
    </motion.nav>
  );
};

export default Navbar;
