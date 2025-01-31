import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah M.",
    text: "I found my soulmate on LoveSpark! The matching algorithm is incredible.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "John D.",
    text: "The icebreakers feature made starting conversations so much easier.",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    name: "Emily R.",
    text: "I feel safe using LoveSpark. Their security measures are top-notch.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const Testimonials: React.FC = () => {
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
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
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
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-pink-500">
                  {testimonial.name}
                </p>
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
    <div className="absolute inset-0 bg-pink-500 opacity-20 blur-2xl"></div>
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
            repeat: Infinity,
            ease: "easeOut",
          }}
        >
          ❤️
        </motion.div>
      ))}
    </>
  );
};

export default Testimonials;
