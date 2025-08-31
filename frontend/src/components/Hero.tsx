import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";

const Hero: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

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

    // Create a glowing orb
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3a0088, // primary purple
      emissive: 0x9b59b6, // glowing accent
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2,
    });
    const orb = new THREE.Mesh(geometry, material);
    scene.add(orb);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const pointLight = new THREE.PointLight(0x9b59b6, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(ambientLight, pointLight);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      orb.rotation.y += 0.005;
      orb.rotation.x += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative bg-secondary min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0" />

      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/50 to-secondary/90 z-10"></div>

      {/* Hero Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-accent drop-shadow-lg">
          ORVN: Automated Growth Systems
        </h1>
        <p className="text-neutral text-lg md:text-2xl max-w-2xl drop-shadow-md">
          Turn data, AI, and branding into actionable results for businesses, creators, and freelancers.
        </p>

        <div className="flex gap-6 mt-6">
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-primary to-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base"
          >
            Join ORVN
          </motion.button>
          <motion.button
            className="px-6 py-3 bg-highlight text-accent rounded-2xl shadow-glow animate-pulse hover:scale-105 transition-base"
          >
            Contact Us
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
