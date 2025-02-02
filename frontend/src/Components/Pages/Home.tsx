import type React from "react";
import Hero from "../Home/Hero";
import HowItWorks from "../Home/How-it-works";
import Footer from "../Home/Footer";
import AuthModal from "../Home/AuthModal";
import { useAuth } from "../../Hooks/useAuth";
import Navbar from "../Home/Navbar";
import { useEffect, useState } from "react";
import BGimage from "../../Assets/wepik.png";
import Features from "../Home/Features";
import Testimonials from "../Home/Testimonials";
import DownloadApp from "../Home/DownloadApp";
import { Skeleton } from "@mui/material";
import SuccessStories from "../Home/SuccessStories";
import SafetyTips from "../Home/SafetyTips";
import Pricing from "../Home/Pricing";

const Home: React.FC = () => {
  const { showLogin, showSignUp, setShowLogin, setShowSignUp } = useAuth();
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = BGimage;
    img.onload = () => setImageLoading(false);
  }, []);

  useEffect(() => {
    console.log(showLogin, showSignUp, "sign");
  }, [showLogin, showSignUp]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white relative">
      {imageLoading ? (
        <Skeleton
          data-testid="skeleton"
          width="100vw"
          height="100vh"
          className="bg-gradient-to-r from-pink-600 to-rose-400"
          variant="rectangular"
          animation="wave"
        />
      ) : (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${BGimage})` }}
          ></div>
          <div className="relative z-10">
            <Navbar
              onLogin={() => setShowLogin(true)}
              onSignUp={() => setShowSignUp(true)}
            />
            <Hero onCreateAccount={() => setShowSignUp(true)} />
            <HowItWorks />
            <Features />
            <Testimonials />
            <SuccessStories />
            <SafetyTips />
            <Pricing />
            <DownloadApp />
            <Footer />
            <AuthModal
              isOpen={showLogin || showSignUp}
              onClose={() => {
                setShowLogin(false);
                setShowSignUp(false);
              }}
              initialMode={showLogin ? "login" : "signup"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
