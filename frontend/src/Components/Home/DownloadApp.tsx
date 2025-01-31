import type React from "react";
import { motion } from "framer-motion";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const DownloadApp: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            className="lg:w-1/2 mb-12 lg:mb-0 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get the LoveSpark App
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-md mx-auto lg:mx-0">
              Find love on the go. Download our app now and start your journey
              to meaningful connections!
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <AppStoreButton store="apple" />
              <AppStoreButton store="google" />
            </div>
          </motion.div>
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://img.freepik.com/free-vector/hand-holding-mobile-phone-with-love-dating-app-man-woman-profile-screen-flat-vector-illustration-online-communication-relationship_74855-24643.jpg?w=740&t=st=1684786967~exp=1684787567~hmac=0a5e3f4a8e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e3e"
              alt="LoveSpark App"
              className="mx-auto rounded-lg shadow-2xl max-w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
      <GlowingBackground />
    </section>
  );
};

interface AppStoreButtonProps {
  store: "apple" | "google";
}

const AppStoreButton: React.FC<AppStoreButtonProps> = ({ store }) => (
  <motion.button
    className={`flex items-center justify-center w-full sm:w-auto px-6 py-3 rounded-full text-base font-semibold transition-colors duration-300 ${
      store === "apple" ? "bg-black text-white" : "bg-white text-black"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {store === "apple" ? (
      <FaApple className="mr-2" />
    ) : (
      <FaGooglePlay className="mr-2" />
    )}
    {store === "apple" ? "App Store" : "Google Play"}
  </motion.button>
);

const GlowingBackground: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient
              id="glow"
              cx="50%"
              cy="50%"
              r="75%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="rgba(255, 100, 100, 0.2)" />
              <stop offset="100%" stopColor="rgba(255, 100, 100, 0)" />
            </radialGradient>
          </defs>
          <circle cx="50%" cy="50%" r="75%" fill="url(#glow)" />
        </svg>
      </div>
    </>
  );
};

export default DownloadApp;
