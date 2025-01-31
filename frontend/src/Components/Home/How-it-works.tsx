import type React from "react";
import { motion } from "framer-motion";
import { FaUserCircle, FaHeart, FaComments } from "react-icons/fa";

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: FaUserCircle,
      title: "Create Your Profile",
      description:
        "Sign up and showcase your unique personality with our intuitive profile builder.",
    },
    {
      icon: FaHeart,
      title: "Find Your Match",
      description:
        "Our AI-powered algorithm suggests compatible matches based on your preferences.",
    },
    {
      icon: FaComments,
      title: "Start a Conversation",
      description:
        "Break the ice with our smart conversation starters and get to know your matches.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          How LoveSpark Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-filter backdrop-blur-lg relative z-10 h-full">
                <motion.div
                  className="text-5xl text-pink-500 mb-6"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    delay: index * 0.2 + 0.5,
                  }}
                  viewport={{ once: true }}
                >
                  <step.icon />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
              <GlowingBackground />
            </motion.div>
          ))}
        </div>
      </div>
      <FloatingShapes />
    </section>
  );
};

const GlowingBackground: React.FC = () => {
  return (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg filter blur-xl opacity-20"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  );
};

const FloatingShapes: React.FC = () => {
  const shapes = [
    { type: "circle", size: 20, color: "pink" },
    { type: "square", size: 15, color: "purple" },
    { type: "triangle", size: 25, color: "pink" },
    { type: "circle", size: 30, color: "purple" },
    { type: "square", size: 18, color: "pink" },
  ];

  return (
    <>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{
            width: shape.size,
            height: shape.size,
            borderRadius:
              shape.type === "circle"
                ? "50%"
                : shape.type === "square"
                ? "0%"
                : "0%",
            background:
              shape.color === "pink"
                ? "rgba(236, 72, 153, 0.3)"
                : "rgba(147, 51, 234, 0.3)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 50 - 25, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </>
  );
};

export default HowItWorks;
