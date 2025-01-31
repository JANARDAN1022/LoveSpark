import React from "react";
import { motion } from "framer-motion";

const successStories = [
  {
    names: "Emma & James",
    story:
      "Met on LoveSpark and got married within a year. They bonded over their love for hiking and travel.",
    image:
      "https://img.freepik.com/free-vector/happy-couple-love-man-woman-romantic-relationship_107791-8038.jpg?w=740&t=st=1684786434~exp=1684787034~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    names: "Michael & Sarah",
    story:
      "Found each other through our AI matching system. They're now proud parents of twins!",
    image:
      "https://img.freepik.com/free-vector/happy-family-with-child-spending-time-together_74855-5254.jpg?w=740&t=st=1684786479~exp=1684787079~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    names: "Olivia & Ethan",
    story:
      "Connected over their shared passion for cooking. They now run a successful catering business together.",
    image:
      "https://img.freepik.com/free-vector/hand-drawn-couple-cooking-together-illustration_23-2148843893.jpg?w=740&t=st=1684786520~exp=1684787120~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
];

const SuccessStories: React.FC = () => {
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
          Love Stories That Began Here
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-filter backdrop-blur-lg relative z-10 h-full">
                <img
                  src={story.image || "/placeholder.svg"}
                  alt={story.names}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-2xl font-semibold text-pink-500 mb-2">
                  {story.names}
                </h3>
                <p className="text-gray-300">{story.story}</p>
              </div>
              <GlowingBackground />
            </motion.div>
          ))}
        </div>
      </div>
      <FloatingHearts />
    </section>
  );
};

const GlowingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-20"></div>
  );
};

const FloatingHearts: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <svg
        className="w-64 h-64 animate-float"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="100" cy="100" r="80" fill="rgba(255, 100, 100, 0.2)" />
        <circle cx="100" cy="100" r="60" fill="rgba(255, 100, 100, 0.1)" />
        <circle cx="100" cy="100" r="40" fill="rgba(255, 100, 100, 0.05)" />
      </svg>
    </div>
  );
};

export default SuccessStories;
