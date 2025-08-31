import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { FaRobot, FaChartLine, FaRocket, FaUsers, FaLightbulb } from "react-icons/fa";
import { useToast } from "../components/ToastProvider"; 
import { FaMessage } from "react-icons/fa6";

const Home: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [orvnText, setOrvnText] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast(); // ✅ useToast hook

  // Slower Typewriter effect
  useEffect(() => {
    const fullText = "Oracle Renaissance Vision Network";
    let index = 0;
    const interval = setInterval(() => {
      setOrvnText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  // Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Central rocket
    const rocket = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 1, 32),
      new THREE.MeshStandardMaterial({
        color: 0x3a0088,
        emissive: 0x9b59b6,
        emissiveIntensity: 0.7,
      })
    );
    rocket.rotation.x = Math.PI;
    scene.add(rocket);

    // Floating orbs
    const orbs: THREE.Mesh[] = [];
    for (let i = 0; i < 12; i++) {
      const geo = new THREE.SphereGeometry(Math.random() * 0.15 + 0.05, 16, 16);
      const mat = new THREE.MeshStandardMaterial({
        color: Math.random() > 0.5 ? 0x3a0088 : 0x9b59b6,
        emissive: 0x9b59b6,
        emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 8
      );
      orbs.push(mesh);
      scene.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0x9b59b6, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    camera.position.z = 7;

    // Animate scene
    const animate = () => {
      requestAnimationFrame(animate);

      rocket.rotation.y += 0.01;
      rocket.position.y = Math.sin(Date.now() * 0.002) * 0.3;

      orbs.forEach((orb, idx) => {
        orb.rotation.x += 0.002 + idx * 0.0003;
        orb.rotation.y += 0.003 + idx * 0.0003;
        const time = Date.now() * 0.001;
        orb.position.y += Math.sin(time + idx) * 0.001;
        orb.position.x += Math.cos(time + idx * 1.1) * 0.001;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  // Newsletter subscribe handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      showToast("Please enter a valid email 📧", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.status === 200) {
        showToast("🎉 You’ve joined ORVN! Check your inbox 💜", "success");
        setEmail("");
      } else if (res.status === 409) {
        showToast("⚡ You’re already subscribed!", "warning");
      } else {
        showToast(data.message || "Something went wrong. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("⚠️ Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary text-accent font-sans min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90 z-10" />

      {/* Floating side icons */}
      <div className="absolute top-1/3 left-4 flex flex-col gap-8 z-20">
        <FaRobot className="text-primary text-4xl animate-bounce" />
        <FaChartLine className="text-accent text-4xl animate-pulse" />
        <FaRocket className="text-highlight text-4xl animate-bounce" />
      </div>
      <div className="absolute top-1/3 right-4 flex flex-col gap-8 z-20">
        <FaUsers className="text-primary text-4xl animate-pulse" />
        <FaLightbulb className="text-highlight text-4xl animate-bounce" />
      </div>

      {/* Hero Section */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-6 text-center px-6 pt-32 pb-16"
        initial="hidden"
        animate="visible"
        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
      >
        <h1 className="text-5xl md:text-7xl font-heading font-bold drop-shadow-lg">
          <span className="text-primary">ORVN:</span>{" "}
          <span className="text-accent">{orvnText}</span>
        </h1>
        <p className="text-neutral text-lg md:text-2xl max-w-2xl drop-shadow-md mt-4">
          Harnessing <span className="text-primary font-semibold">Data</span>,{" "}
          <span className="text-highlight font-semibold">AI</span>, and{" "}
          <span className="text-accent font-semibold">Branding</span> to automate growth
          for businesses, creators, and freelancers.
        </p>
        <div className="flex gap-6 mt-6">
          <motion.button  className="px-6 py-3 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-transform duration-300 flex items-center gap-2" >
            <a href="https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c" target="_blank"> <FaRocket /> Join ORVN</a>
          </motion.button>
          <motion.button className="px-6 py-3 bg-gradient-to-r from-highlight to-primary text-secondary rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-transform duration-300 flex items-center gap-2">
           <a href="https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c" target="_blank"> <FaMessage /> Contact Us</a>
          </motion.button>
        </div>
      </motion.div>

      {/* About ORVN */}
      <motion.section
        className="w-full py-24 px-6 flex flex-col items-center text-center relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-heading font-bold mb-6">About ORVN</h2>
        <p className="text-neutral max-w-3xl mb-8">
          ORVN is a futuristic platform leveraging AI, data analytics, and branding strategies to deliver automated growth for businesses, creators, and freelancers. We focus on measurable results, intelligent solutions, and forward-thinking digital strategies.
        </p>
      </motion.section>

      {/* Services Section */}
      <motion.section
        className="w-full py-24 px-6 flex flex-col items-center text-center relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-heading font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
          {[
            { icon: FaRobot, title: "AI Automation", text: "Intelligent AI solutions that streamline workflows, improve efficiency, and provide predictive insights." },
            { icon: FaChartLine, title: "Data Analytics", text: "Transform raw data into actionable strategies to accelerate business growth and optimize performance." },
            { icon: FaRocket, title: "Branding & Marketing", text: "Futuristic branding and marketing strategies designed to amplify reach and drive meaningful engagement." },
          ].map(({ icon: Icon, title, text }) => (
            <motion.div
              key={title}
              className="flex flex-col items-center gap-4 p-6 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <Icon className="text-primary text-6xl" />
              <h3 className="text-2xl font-semibold">{title}</h3>
              <p className="text-neutral text-center">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Launch Campuses */}
      <motion.section
        className="w-full py-24 px-6 flex flex-col items-center text-center relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-heading font-bold mb-6">Our Launch Campuses</h2>
        <p className="text-neutral max-w-3xl mb-12">
          ORVN is not just a platform — we are a brand, a movement, and a community. Our systems speak for results and values. Join the revolution in your campus.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {["OAU", "UI", "Uniosun"].map((campus) => (
            <motion.div
              key={campus}
              className="flex flex-col items-center p-6 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
            >
              <h3 className="text-2xl font-semibold mb-4 text-accent">{campus}</h3>
              <p className="text-neutral mb-6">
                Be part of our {campus} community and get early access to ORVN insights, updates, and tools.
              </p>
              <a
                href={`https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c${campus}`}
                className="px-6 py-3 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-transform duration-300"
              >
                Join Community
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter Section */}
       <motion.section
        className="w-full py-32 px-6 flex flex-col items-center text-center z-20 relative bg-gradient-to-r from-primary to-highlight rounded-t-3xl shadow-inner"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-heading font-bold mb-6 text-white">Subscribe to our Newsletter 💌</h2>
        <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
          Stay updated with the latest from <span className="font-bold">ORVN</span>.  
          Be part of our movement <span className="text-yellow-300 font-semibold">1 + 1 = 3 ✨</span>
        </p>
        <motion.form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-xl mx-auto w-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-2xl text-black shadow-lg focus:outline-none focus:ring-4 focus:ring-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:bg-gray-800 transition-transform transform hover:scale-105 shadow-xl disabled:opacity-50"
          >
            {loading ? "Subscribing..." : "Subscribe 🚀"}
          </button>
        </motion.form>
      </motion.section>
    </div>
  );
};

export default Home;
