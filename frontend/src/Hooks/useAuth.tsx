import { useState, useCallback } from "react";
import { useAppDispatch } from "../Hooks";
import { LoginUser, RegisterUser } from "../Actions/userAction";

export const useAuth = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(LoginUser({ email, password })).unwrap();
        setShowLogin(false);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    [dispatch]
  );

  const signup = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      if (password !== confirmPassword) {
        console.error("Passwords do not match");
        return;
      }
      try {
        await dispatch(
          RegisterUser({ email, password, confirmPassword })
        ).unwrap();
        setShowSignUp(false);
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
