import React from "react";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaComments,
  FaShieldAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

const features = [
  {
    icon: FaHeart,
    title: "Smart Matching",
    description: "Our AI-powered algorithm finds your perfect match",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/couple-match-4438985-3726252.png",
  },
  {
    icon: FaComments,
    title: "Icebreakers",
    description: "Start conversations easily with our suggested topics",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/online-chat-4438968-3726235.png",
  },
  {
    icon: FaShieldAlt,
    title: "Safe & Secure",
    description: "Your privacy and safety are our top priorities",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/data-security-4462615-3763961.png",
  },
  {
    icon: FaGlobeAmericas,
    title: "Global Community",
    description: "Connect with people from around the world",
    image:
      "https://cdni.iconscout.com/illustration/premium/thumb/global-communication-4438980-3726247.png",
  },
];

const Features: React.FC = () => {
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
          Why Choose LoveSpark
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
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
                  <feature.icon />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 mb-6">{feature.description}</p>
                <img
                  src={feature.image || "/placeholder.svg"}
                  alt={feature.title}
                  className="w-full h-40 object-contain"
                />
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
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
};

const FloatingShapes: React.FC = () => {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 w-48 h-48 bg-pink-500 rounded-full opacity-20"
        style={{ filter: "blur(50px)" }}
        animate={{
          x: [-20, 20, -20],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500 rounded-full opacity-20"
        style={{ filter: "blur(50px)" }}
        animate={{
          x: [20, -20, 20],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </>
  );
};

export default Features;
