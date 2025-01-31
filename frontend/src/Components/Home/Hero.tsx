import type React from "react";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface HeroProps {
  onCreateAccount: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCreateAccount }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden py-20 px-4"
    >
      <div className="container mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, delay: 0.2 },
            },
          }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 relative inline-block">
            <span className="relative z-10">Find Your</span>
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-3 bg-pink-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
          </h1>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Love Spark
          </motion.h1>
          <motion.p
            className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            Ignite meaningful connections in our vibrant community of
            like-minded individuals.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <button
              onClick={onCreateAccount}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-lg font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition duration-300 shadow-lg transform hover:scale-105"
            >
              Start Your Love Journey
            </button>
          </motion.div>
        </motion.div>
      </div>
      <GlowingOrbs />
      <FloatingHearts />
    </section>
  );
};

const GlowingOrbs: React.FC = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full mix-blend-screen filter blur-xl"
          style={{
            background: `radial-gradient(circle, rgba(255,0,255,0.8) 0%, rgba(255,0,255,0) 70%)`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.9, 0.7],
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

const FloatingHearts: React.FC = () => {
  return (
    <>
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute text-pink-500 opacity-50"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
          }}
          animate={{
            y: [0, -100],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
};

export default Hero;
