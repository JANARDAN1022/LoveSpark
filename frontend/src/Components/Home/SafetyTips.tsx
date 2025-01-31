import React from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaUserCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const safetyTips = [
  {
    icon: FaShieldAlt,
    tip: "Protect your personal information",
    image:
      "https://img.freepik.com/free-vector/data-protection-law-illustration-concept_114360-971.jpg?w=740&t=st=1684786620~exp=1684787220~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    icon: FaUserCheck,
    tip: "Meet in public places for the first few dates",
    image:
      "https://img.freepik.com/free-vector/people-cafe-flat-vector-illustration_74855-6263.jpg?w=740&t=st=1684786657~exp=1684787257~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    icon: FaMapMarkerAlt,
    tip: "Share your location with a trusted friend",
    image:
      "https://img.freepik.com/free-vector/location-sharing-concept-illustration_114360-5941.jpg?w=740&t=st=1684786688~exp=1684787288~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    icon: FaPhoneAlt,
    tip: "Keep emergency contacts handy",
    image:
      "https://img.freepik.com/free-vector/emergency-call-concept-illustration_114360-7615.jpg?w=740&t=st=1684786721~exp=1684787321~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
];

const SafetyTips: React.FC = () => {
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
          Stay Safe While Dating
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safetyTips.map((tip, index) => (
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
                  <tip.icon />
                </motion.div>
                <p className="text-gray-300 mb-6">{tip.tip}</p>
                <img
                  src={tip.image || "/placeholder.svg"}
                  alt={tip.tip}
                  className="w-full h-40 object-cover rounded-lg"
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
  return <div className="absolute inset-0 bg-pink-500/10 blur-2xl"></div>;
};

const FloatingShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" fill="pink" fillOpacity="0.1" />
      </svg>
    </div>
  );
};

export default SafetyTips;
