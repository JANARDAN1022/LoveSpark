import { useState, useCallback } from "react";
import { useAppDispatch } from "../Hooks";
import { LoginUser, RegisterUser } from "../Actions/userAction";
import { toast, Toaster } from "react-hot-toast";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await dispatch(LoginUser({ email, password }));
        const result = unwrapResult(response);
        if (result?.success) {
          setShowLogin(false);
          navigate("/CompleteProfile");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match", {
          className: "Toast",
        });
        return;
      }
      try {
        const response = await dispatch(
          RegisterUser({ email, password, confirmPassword })
        );
        const result = unwrapResult(response);
        if (result?.success) {
          setShowSignUp(false);
          navigate("/CompleteProfile");
        }
      } catch (error) {
        console.error("Signup failed:", error);
      }
    },
    [dispatch]
  );

  const loginWithGoogle = useCallback(() => {
    window.open("https://love-spark.vercel.app/auth/google", "_self");
  }, []);

  return {
    showLogin,
    setShowLogin,
    showSignUp,
    setShowSignUp,
    login,
    signup,
    loginWithGoogle,
  };
};
