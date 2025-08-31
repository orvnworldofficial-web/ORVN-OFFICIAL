import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
  FaUsers,
  FaLightbulb,
  FaRocket,
} from "react-icons/fa";
import { socialLinks } from "../config/socialLinks";
import { useToast } from "../components/ToastProvider";

const About: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [headerText, setHeaderText] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Typewriter effect
  useEffect(() => {
    const fullText = "ORVN: Oracle Renaissance Vision Network";
    let index = 0;
    const interval = setInterval(() => {
      setHeaderText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 140);
    return () => clearInterval(interval);
  }, []);

  // Three.js floating background
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

    const elements: THREE.Mesh[] = [];

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
      elements.push(mesh);
      scene.add(mesh);
    }

    for (let i = 0; i < 3; i++) {
      const rocketGeo = new THREE.ConeGeometry(0.1, 0.4, 12);
      const rocketMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x3a0088,
        emissiveIntensity: 0.8,
      });
      const rocket = new THREE.Mesh(rocketGeo, rocketMat);
      rocket.position.set(
        (Math.random() - 0.5) * 8,
        -2 + Math.random() * 2,
        (Math.random() - 0.5) * 6
      );
      elements.push(rocket);
      scene.add(rocket);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0x9b59b6, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    camera.position.z = 7;

    const animate = () => {
      requestAnimationFrame(animate);

      elements.forEach((el, i) => {
        el.rotation.x += 0.002 + i * 0.0003;
        el.rotation.y += 0.003 + i * 0.0003;

        const time = Date.now() * 0.001;
        el.position.y += Math.sin(time + i) * 0.001;
        el.position.x += Math.cos(time + i * 1.1) * 0.001;
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

  // Newsletter subscribe
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
    <div id="about" className="bg-secondary text-accent font-sans min-h-screen flex flex-col items-center relative overflow-hidden">
      {/* Background */}
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/80 via-secondary/60 to-secondary/90 z-10" />

      {/* Hero */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center px-6 pt-32 pb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-heading font-bold drop-shadow-lg mb-6">{headerText}</h1>
        <p className="text-neutral text-lg md:text-xl max-w-3xl">
          We turn messy data into smart decisions, automated workflows, and powerful brands.
        </p>
      </motion.div>

      {/* About ORVN */}
      <section className="w-full py-20 px-6 z-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">About ORVN</h2>
          <p className="text-neutral max-w-3xl mx-auto leading-relaxed">
            At <span className="font-semibold">Oracle Renaissance Vision Network (ORVN)</span>, we believe Africa’s next big transformation will be driven by <span className="text-highlight">data, AI, and branding</span>.
            <br /><br />
            We exist to close three gaps:  
            <br />⚡ The gap between raw data and real business decisions  
            <br />⚡ The gap between talent and opportunity  
            <br />⚡ The gap between great products and powerful positioning  
          </p>
        </div>
      </section>

      {/* Services (Clickable Cards) */}
      <section className="w-full py-20 px-6 z-20">
        <motion.h2 className="text-4xl font-heading font-bold text-center mb-12">Our Services</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Data Insights",
              desc: "We turn your raw data into simple insights and predictions you can act on.",
            },
            {
              title: "AI-Powered Automation",
              desc: "Systems that run on autopilot so your team can focus on real growth.",
            },
            {
              title: "Custom AI Solutions",
              desc: "AI tools built for your exact needs: chatbots, fraud detection, recommendations.",
            },
            {
              title: "Branding Powered by Data",
              desc: "Shape your brand story, design, and positioning with insights.",
            },
            {
              title: "Unified Platforms",
              desc: "Dashboards + Marketplace + Analytics + Automation — in one ecosystem.",
            },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-surface rounded-3xl shadow-glow text-center cursor-pointer"
            >
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-neutral">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section className="w-full py-20 px-6 z-20 bg-surface/40">
        <motion.h2 className="text-4xl font-heading font-bold text-center mb-12">Our Ecosystem</motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-surface rounded-3xl shadow-glow text-center block cursor-pointer"
          >
            <h3 className="text-3xl font-semibold mb-4 text-primary">EARN</h3>
            <p className="text-neutral">Our upcoming SaaS platform and automation tools for growth.</p>
          </motion.a>
          <motion.a
            href="https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c"
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-surface rounded-3xl shadow-glow text-center block cursor-pointer"
          >
            <h3 className="text-3xl font-semibold mb-4 text-highlight">HOOB</h3>
            <p className="text-neutral">A thriving WhatsApp community for creators, freelancers, and young professionals.</p>
          </motion.a>
        </div>
      </section>

      {/* Our Motto */}
      <section className="w-full py-16 px-6 text-center z-20">
  <motion.h2
    className="text-4xl font-heading font-bold mb-6"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    Our Motto
  </motion.h2>

  {/* Final Calculator Effect */}
  <div className="flex justify-center items-center text-5xl font-bold font-mono mb-8">
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      1
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      &nbsp;+&nbsp;
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.5 }}
    >
      1
    </motion.span>
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
    >
      &nbsp;=&nbsp;
    </motion.span>

    {/* Directly show "3 ✨" */}
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1.5, 1], opacity: 1 }}
      transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
      className="text-highlight"
    >
      3 ✨
    </motion.span>
  </div>

  {/* Extra tagline */}
  <motion.p
    className="text-neutral max-w-3xl mx-auto text-lg leading-relaxed"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ delay: 3, duration: 0.8 }}
  >
    Normally, in math, <strong>1 + 1 = 2</strong>. But at ORVN, we see things differently.
    When two people come together with <span className="text-primary">vision, passion, and innovation</span>, 
    the result isn’t just the sum of their efforts — it’s synergy.
    <br />
    <br />
    <span className="font-semibold text-highlight">
      That’s why for us, 1 + 1 doesn’t equal 2… it equals 3. Together, we will do great things 🚀💜
    </span>
  </motion.p>
</section>



      {/* Pillars Section */}
      <section className="w-full py-24 px-6 flex flex-col items-center text-center z-20">
        <motion.h2
          className="text-4xl font-heading font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Pillars
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl">
          <motion.div className="flex flex-col items-center gap-4 p-8 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300">
            <FaUsers className="text-primary text-6xl" />
            <h3 className="text-2xl font-semibold">Community</h3>
            <p className="text-neutral text-center">
              Thriving campus & online communities fostering collaboration,
              learning, and growth.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center gap-4 p-8 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300">
            <FaLightbulb className="text-primary text-6xl" />
            <h3 className="text-2xl font-semibold">Innovation</h3>
            <p className="text-neutral text-center">
              AI tools, creative projects, and forward-thinking strategies to
              ideate and scale.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center gap-4 p-8 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300">
            <FaRocket className="text-primary text-6xl" />
            <h3 className="text-2xl font-semibold">Growth</h3>
            <p className="text-neutral text-center">
              Mentorship, actionable insights, and systems that accelerate
              personal & professional development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Launch Campuses */}
      <section className="w-full py-24 px-6 flex flex-col items-center text-center relative z-20">
        <motion.h2
          className="text-4xl font-heading font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Launch Campuses
        </motion.h2>
        <motion.p
          className="text-neutral max-w-3xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          ORVN is more than a platform — we are a brand, a movement, and a
          community. Our systems speak for results and values. Join the revolution
          in your campus.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          {[
            { name: "OAU", link: "https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c" },
            { name: "UI", link: "https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c" },
            { name: "Uniosun", link: "https://chat.whatsapp.com/Et0EHRx0XtQBtU4ATiZSES?mode=ems_copy_c" },
          ].map((campus) => (
            <motion.div
              key={campus.name}
              className="flex flex-col items-center p-6 bg-surface rounded-3xl shadow-glow hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-accent">
                {campus.name}
              </h3>
              <p className="text-neutral mb-6">
                Be part of our {campus.name} community and get early access to
                ORVN insights, updates, and tools.
              </p>
              <a
                href={campus.link}
                className="px-6 py-3 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-transform duration-300"
              >
                Join Community
              </a>
            </motion.div>
          ))}
        </div>
      </section>

     {/* 
      <section id="team" className="w-full py-24 px-6 z-20">
        <h2 className="text-4xl font-heading font-bold text-center mb-12">
          Meet the Team
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {Array.from({ length: 6 }).map((_, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -8 }}
              className="bg-surface rounded-3xl shadow-glow p-8 text-center"
            >
              <div className="w-32 h-32 bg-neutral/40 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Full Name</h3>
              <p className="text-neutral/80">Role / Position</p>

              <div className="flex justify-center gap-5 mt-5">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <FaInstagram className="w-6 h-6 text-accent hover:text-[#E1306C] transition" />
                </a>
                <a
                  href="#"
                  aria-label="TikTok"
                  className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <FaTiktok className="w-6 h-6 text-accent hover:text-white transition" />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="p-2 rounded-xl bg-secondary/60 hover:bg-secondary transition transform hover:-translate-y-0.5 hover:scale-105"
                >
                  <FaLinkedin className="w-6 h-6 text-accent hover:text-[#0A66C2] transition" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>*/}

      {/* Follow ORVN on socials (contrasting background, spaced & large) */}
      <section
        id="socials"
        className="w-full py-20 px-6 z-20 bg-surface border-t border-primary/20"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
            Follow ORVN on Socials
          </h2>
          <p className="text-neutral max-w-2xl mx-auto mb-8">
            Plug into the movement. Highlights, releases, campus tours & behind-the-scenes.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {socialLinks.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                
                className="group"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary/80 backdrop-blur flex items-center justify-center shadow-glow transition transform group-hover:scale-110">
                  <s.icon.type
                    {...s.icon.props}
                    className="w-8 h-8 text-accent transition"
                    style={{ color: s.color }}
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Newsletter */}
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

export default About;
