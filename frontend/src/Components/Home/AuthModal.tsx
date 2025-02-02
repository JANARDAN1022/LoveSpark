import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../Hooks/useAuth";
import { Toaster } from "react-hot-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
}) => {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const { login, signup, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
    console.log(initialMode, "mode");
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      setLoading(true);
      if (mode === "login") {
        await login(email, password);
      } else {
        const confirmPassword = formData.get("confirmPassword") as string;
        await signup(email, password, confirmPassword);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence>
      <Toaster />
      {isOpen && initialMode && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-lg p-8 w-full max-w-md relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-300"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-bold mb-6 text-white text-center">
              {mode === "login" ? "Welcome Back" : "Join LoveSpark"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  disabled={loading}
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <input
                  disabled={loading}
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              {mode === "signup" && (
                <div>
                  <input
                    disabled={loading}
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                    className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              )}
              <motion.button
                type="submit"
                disabled={loading}
                className={`${
                  loading ? "animate-pulse" : ""
                } w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {mode === "login"
                  ? !loading
                    ? "Log In"
                    : "Loggin In..."
                  : !loading
                  ? "Sign Up"
                  : "Signing In..."}
              </motion.button>
            </form>
            <div className="mt-6">
              <motion.button
                disabled={loading}
                onClick={loginWithGoogle}
                className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGoogle className="mr-2" /> Continue with Google
              </motion.button>
            </div>
            <p className="mt-6 text-center text-gray-400">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                disabled={loading}
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="ml-2 text-pink-500 hover:text-pink-400 transition-colors duration-300"
              >
                {mode === "login" ? "Sign Up" : "Log In"}
              </button>
            </p>
            <GlowingBackground />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const GlowingBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 opacity-20 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-tl from-blue-500 to-purple-500 opacity-20 blur-3xl" />
    </div>
  );
};

export default AuthModal;
