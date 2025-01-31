import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogin, onSignUp }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarVariants = {
    hidden: { y: -100 },
    visible: {
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, x: "100%" },
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="text-2xl font-bold text-pink-500"
          whileHover={{ scale: 1.05 }}
        >
          LoveSpark
        </motion.div>
        <div className="hidden md:flex space-x-4">
          <NavButton onClick={onLogin}>Log In</NavButton>
          <NavButton onClick={onSignUp} primary>
            Sign Up
          </NavButton>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-gray-900 bg-opacity-95 backdrop-blur-md"
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <NavButton onClick={onLogin}>Log In</NavButton>
              <NavButton onClick={onSignUp} primary>
                Sign Up
              </NavButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

interface NavButtonProps {
  onClick: () => void;
  primary?: boolean;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  primary,
  children,
}) => (
  <motion.button
    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
      primary
        ? "bg-pink-600 text-white hover:bg-pink-700"
        : "text-white hover:text-pink-500"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
  >
    {children}
  </motion.button>
);

export default Navbar;
