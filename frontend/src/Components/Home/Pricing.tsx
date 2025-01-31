import React from "react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    price: "Free",
    features: ["Create a profile", "Browse matches", "Send likes"],
    image:
      "https://img.freepik.com/free-vector/woman-using-dating-app-smartphone_74855-7862.jpg?w=740&t=st=1684786818~exp=1684787418~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    name: "Premium",
    price: "$9.99/mo",
    features: [
      "All Basic features",
      "See who likes you",
      "Advanced filters",
      "Boost your profile",
    ],
    image:
      "https://img.freepik.com/free-vector/couple-using-dating-app_74855-7863.jpg?w=740&t=st=1684786851~exp=1684787451~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
  {
    name: "VIP",
    price: "$19.99/mo",
    features: [
      "All Premium features",
      "Priority customer support",
      "Profile consultation",
      "Read receipts",
    ],
    image:
      "https://img.freepik.com/free-vector/couple-love-concept-illustration_114360-1307.jpg?w=740&t=st=1684786884~exp=1684787484~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e",
  },
];

const Pricing: React.FC = () => {
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
          Choose Your Perfect Plan
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-filter backdrop-blur-lg relative z-10 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-pink-500 mb-4">
                  {plan.name}
                </h3>
                <p className="text-4xl font-bold mb-6">{plan.price}</p>
                <img
                  src={plan.image || "/placeholder.svg"}
                  alt={plan.name}
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
                <ul className="mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  className="bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-pink-600 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
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
  return null; // Replace with actual implementation if needed
};

const FloatingHearts: React.FC = () => {
  return null; // Replace with actual implementation if needed
};

export default Pricing;
