import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import appstore from "../../Assets/appstore.png";
import PlayStore from "../../Assets/PlayStore.png";
import { CgProfile } from "react-icons/cg";
import { MdSwipeLeft, MdSwipeRight } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import FinalDate from "../../Assets/FinalDate.png";
import { LoginContext } from "../../Context/LoginContext";
import { useAppDispatch, useAppSelector } from "../../Hooks";
import { RegisterUser, LoginUser } from "../../Actions/userAction";
import { unwrapResult } from "@reduxjs/toolkit";
import { Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import BGimage from '../../Assets/wepik.png';

const Home = () => {
  const { ShowLogin, setshowLogin, ShowSignUp,ImageLoading,setImageLoading, setShowSignUp, scroll } = useContext(LoginContext);
  const { setLoggedOut } = useContext(LoginContext);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loginEmail, setloginEmail] = useState("");
  const [loginpassword, setloginpassword] = useState("");
  const [Confirmpassword, setConfirmpassword] = useState("");
  const [Error, setError] = useState("");
  const [LOADING, setLOADING] = useState(false);
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();

  const EmailRef = useRef<HTMLInputElement>(null);
  const PassRef = useRef<HTMLInputElement>(null);
  const ConfirmPassRef = useRef<HTMLInputElement>(null);
  const loginEmailRef = useRef<HTMLInputElement>(null);
  const loginPassRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Hide the scrollbar on the home page
    const body = document.body;
    body.classList.add("hide-scrollbar");
    if (ShowLogin || ShowSignUp || scroll) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      body.style.overflow = "hidden";
    }

    return () => {
      // Restore the scrollbar on component unmount
      body.classList.remove("hide-scrollbar");
      body.style.overflow = "";
    };
  }, [ShowLogin, ShowSignUp, scroll]);

  const { loading, isAuthenticated, user, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (!loading && user && isAuthenticated && error !== "Please login") {
      if (user?.ProfileStatus && user.ProfileStatus === "Complete") {
        Navigate("/MainPage");
      } else {
        Navigate("/CompleteProfile");
      }
    } else {
      Navigate("/");
    }
  }, [Navigate, loading, user, error, isAuthenticated]);

  useEffect(() => {
    const backgroundUrl = BGimage;
    const tempImage = new Image();

    tempImage.onload = () => {
      setImageLoading(false);
    };

    tempImage.src = backgroundUrl;
  }, [setImageLoading]);


  const HandleGoogleLogin = () => {
    window.open("https://love-spark.vercel.app/auth/google", "_self");
  };
  const HandleCreateAC = () => {
    setShowSignUp(true);
    setshowLogin(false);
  };

  const HandleLogin = async (e: any) => {
    e.preventDefault();

    if (loginEmail === "" || loginpassword === "") {
      if (loginEmail === "") {
        if (loginEmailRef.current) {
          loginEmailRef.current?.focus();
        }
        setError("Email Cannot Be Empty");
      } else {
        if (loginPassRef.current) {
          loginPassRef.current?.focus();
        }
        setError("Password Cannot Be Empty");
      }
    } else if (
      loginEmail.split("@").length < 2 ||
      loginEmail.split("@")[1].split(".").length < 2
    ) {
      if (loginEmailRef.current) {
        loginEmailRef.current?.focus();
      }
      setError("Please Enter a Valid Email");
    } else if (loginpassword.length < 6) {
      if (loginPassRef.current) {
        loginPassRef.current?.focus();
      }
      setError("Password cannot be less than 6");
    } else {
      try {
        setLOADING(true);
        const response = await dispatch(
          LoginUser({ email: loginEmail, password: loginpassword })
        );
        const result = unwrapResult(response); // Unwrap the result to get the action payload

        if (result?.success) {
          setLoggedOut(false);
          setloginEmail("");
          setloginpassword("");
          setLOADING(false);
          Navigate("/CompleteProfile");
          setshowLogin(false);
        } else {
          if (loginEmailRef.current) {
            loginEmailRef.current?.focus();
          }
          setError("Invalid Email or Password");
          setLOADING(false);
          setloginEmail("");
          setloginpassword("");
        }
      } catch (error) {
        // Handle any errors that might occur during the dispatch
        console.error("Login failed:", error);
      }
    }

    setTimeout(() => {
      setError("");
    }, 3000);
  };
  const HandleSignup = async (e: any) => {
    e.preventDefault();
    if (
      email !== "" &&
      password !== "" &&
      Confirmpassword !== "" &&
      Error === "" &&
      Confirmpassword === password
    ) {
      setLOADING(true);
      const response = await dispatch(
        RegisterUser({
          email: email,
          password: password,
          confirmPassword: Confirmpassword,
        })
      );
      const result = unwrapResult(response); // Unwrap the result to get the action payload

      if (result?.success) {
        setLoggedOut(false);
        setLOADING(false);
        setemail("");
        setpassword("");
        setConfirmpassword("");
        setShowSignUp(false);
        Navigate("/CompleteProfile");
      } else {
        setemail("");
        setpassword("");
        setLOADING(false);
        setConfirmpassword("");
        if (EmailRef.current !== null) {
          EmailRef.current.focus();
        }
      }
    } else if (password !== Confirmpassword) {
      if (ConfirmPassRef.current !== null) {
        ConfirmPassRef.current.focus();
      }
      setError("Password Do Not Match");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (email === "") {
      if (EmailRef.current !== null) {
        EmailRef.current.focus();
      }
      setError("Email Cannot Be Empty");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (password === "") {
      if (PassRef.current !== null) {
        PassRef.current.focus();
      }
      setError("Password Cannot Be Empty");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (Confirmpassword === "") {
      if (ConfirmPassRef.current !== null) {
        ConfirmPassRef.current.focus();
      }
      setError("ConfirmPassword Cannot Be Empty");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if (email !== "" && password !== "" && Error !== "") {
      if (EmailRef.current !== null) {
        EmailRef.current.focus();
      }
      setError("Invalid Email or Password");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else if ((email === "" && password === "") || Error !== "") {
      if (EmailRef.current !== null) {
        EmailRef.current.focus();
      }
      setError("Fields Cannot Be Empty");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (loading || ImageLoading ) && !LOADING ? (
    <Skeleton
    data-testid="skeleton"
      width="100vw"
      height="100vh"
      className="bg-gradient-to-r from-pink-600 to-rose-400"
      variant="rectangular"
      animation="wave"
    />
  ) : (
    <div
    data-testid="content" className={`Background bg-no-repeat flex flex-col gap-[172px]  bg-[url('./Assets/wepik.png')]  relative`}
    >
      <div>
        <div
          className={`${
            ShowLogin || ShowSignUp ? "" : "hidden"
          } absolute top-10 right-0 left-0 m-auto `}
        >
          <section className="bg-transparent ">
            <div className="flex  flex-col items-center justify-center  md:h-screen lg:py-0">
              <div className="sm:w-full  relative bg-pink-200 z-50 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <RxCross1
                  size={30}
                  onClick={() => {
                    if (ShowSignUp) {
                      setShowSignUp(false);
                    } else {
                      setshowLogin(false);
                    }
                  }}
                  className={`${
                    LOADING ? "hidden" : ""
                  } absolute top-5 cursor-pointer right-5`}
                />
                <div className="p-6 space-y-4 md:space-y-6  sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-pink-900 md:text-2xl dark:text-white">
                    {ShowSignUp
                      ? "Create your account"
                      : `Sign in to your account`}
                  </h1>
                  <form className="space-y-4 md:space-y-6" action="#">
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-pink-900 dark:text-white"
                      >
                        Your email
                      </label>
                      <input
                        disabled={LOADING}
                        ref={ShowSignUp ? EmailRef : loginEmailRef}
                        value={ShowSignUp ? email : loginEmail}
                        onChange={(e) => {
                          if (ShowSignUp) {
                            setemail(e.target.value);
                          } else {
                            setloginEmail(e.target.value);
                          }
                        }}
                        type="email"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-pink-600 outline-pink-700 text-pink-600 sm:text-sm rounded-lg  block w-full p-2.5 "
                        placeholder="LoveSparks@gmail.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-pink-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        disabled={LOADING}
                        ref={ShowSignUp ? PassRef : loginPassRef}
                        value={ShowSignUp ? password : loginpassword}
                        onChange={(e) => {
                          if (ShowSignUp) {
                            setpassword(e.target.value);
                          } else {
                            setloginpassword(e.target.value);
                          }
                        }}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-pink-600 outline-pink-700 text-pink-600 sm:text-sm rounded-lg  block w-full p-2.5 "
                      />
                    </div>

                    <div className={`${ShowSignUp ? "" : "hidden"}`}>
                      <label
                        htmlFor="Confirmpassword"
                        className="block mb-2 text-sm font-medium text-pink-900 dark:text-white"
                      >
                        Confirm Password
                      </label>
                      <input
                        disabled={LOADING}
                        ref={ConfirmPassRef}
                        onChange={(e) => setConfirmpassword(e.target.value)}
                        type="password"
                        name="Confirmpassword"
                        id="Confirmpassword"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            disabled={LOADING}
                            id="remember"
                            aria-describedby="remember"
                            type="checkbox"
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label
                            htmlFor="remember"
                            className="text-pink-700 dark:text-gray-300"
                          >
                            Remember me
                          </label>
                        </div>
                      </div>
                      <a
                        href="/"
                        className={`${
                          LOADING ? "hidden" : ""
                        } text-sm font-medium text-pink-900 hover:underline dark:text-primary-500`}
                      >
                        Forgot password?
                      </a>
                    </div>

                    <span className={`text-center  text-sm text-red-600`}>
                      {Error ? `${Error}*` : ""}
                    </span>
                    <div className="relative flex items-center">
                      <button
                        disabled={LOADING}
                        onClick={ShowSignUp ? HandleSignup : HandleLogin}
                        className={`${
                          LOADING ? "cursor-none" : "cursor-pointer"
                        } w-full text-pink-200 ${
                          LOADING
                            ? "bg-pink-700"
                            : "bg-pink-500 hover:bg-pink-700"
                        } focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                      >
                        {ShowSignUp ? "Sign Up" : `Sign in`}
                      </button>
                      <div
                        className={`${
                          LOADING ? "cursor-none" : "hidden"
                        } absolute right-5`}
                      >
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                      </div>
                    </div>
                    <p
                      className={`${
                        LOADING ? "hidden" : ""
                      } text-sm font-medium cursor-pointer hover:underline text-pink-900`}
                      onClick={(e: any) => {
                        e.preventDefault();
                        if (ShowSignUp) {
                          setShowSignUp(false);
                          setshowLogin(true);
                        } else {
                          setShowSignUp(true);
                          setshowLogin(false);
                        }
                      }}
                    >
                      {ShowSignUp
                        ? "Already have an account ?"
                        : `Dont have an account yet?`}{" "}
                      <a
                        href="/"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        {ShowSignUp ? "Sign in" : `Sign up`}
                      </a>
                    </p>
                    <span className="flex justify-center text-xl text-center text-pink-900">
                      OR
                    </span>

                    <div className="flex  p-2 w-[410px]">
                      <button
                        type="button"
                        disabled={LOADING}
                        className={`${
                          LOADING ? "cursor-none" : ""
                        } text-white ${
                          LOADING
                            ? "bg-[#3b5998]/90"
                            : "bg-[#3b5998] hover:bg-[#3b5998]/90"
                        } focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 mr-2 mb-2`}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 8 19"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Continue With Facebook
                      </button>
                      <button
                        onClick={HandleGoogleLogin}
                        disabled={LOADING}
                        type="button"
                        className={`${
                          LOADING ? "cursor-none" : ""
                        } text-white ${
                          LOADING
                            ? "bg-[#4285F4]/90"
                            : "bg-[#4285F4] hover:bg-[#4285F4]/90"
                        } focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-2 py-2.5  text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2`}
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 18 19"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Continue With Google
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-center items-center mt-[80px]">
        <div className=" text-center font-bold p-20 w-max  h-max flex flex-col gap-10 items-center">
          <span className="text-white  text-2xl sm:text-3xl md:text-5xl lg:text-6xl lg:p-5  font-extrabold">
            Find Your Love Spark
          </span>
          <button
            onClick={HandleCreateAC}
            className="w-[200px] h-[50px] bg-gradient-to-r from-[#fbd3e9] to-[#bb377d] hover:bg-gradient-to-r hover:from-[#bb377d] hover:to-[#fbd3e9]   rounded-[20px] text-pink-100 hover:text-pink-600 z-10"
          >
            Create Account
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-pink-100 shadow-[0_0px_10px_5px_rgba(255,192,203,1)]">
        <span className="text-center text-pink-500 text-sm sm:text-lg md:text-3xl mt-2 sm:mt-5 md:mt-10">
          How LoveSpark Works
        </span>
        <div className="flex h-auto justify-center gap-8  pl-2 pr-2 sm:gap-12 sm:pt-10 sm:pr-10 sm:pl-10  md:gap-20 md:pt-16 md:pl-20 md:pr-20 items-center">
          <div className=" w-[300px] h-[250px] md:w-[500px] flex flex-col rounded-[10px] md:h-[400px] ">
            <motion.div
              whileInView={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              className="flex justify-center p-3 lg:p-5"
            >
              <CgProfile className="text-pink-500 text-[20px] sm:text-[30px] md:text-[40px] lg:text-[50px]" />
            </motion.div>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.3 }}
              className="text-pink-500 text-center  text-[10.5px]  sm:text-xs font-bold md:text-sm lg:text-xl"
            >
              Create Your Account And Complete Your Profile
            </motion.span>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.2 }}
              className="text-pink-500 text-center   md:mt-5 lg:mt-10 text-[8.5px] sm:text-[10px] mt-2 lg:text-[13.5px] md:text-[12px]"
            >
              Creating an account is the first exciting step towards finding
              your perfect match. Simply sign up and provide some basic
              information to create your dating profile. Customize your profile
              by adding photos, writing a captivating bio, and sharing your
              interests and preferences. The more details you provide, the
              better chances you have of attracting compatible matches.
            </motion.span>
          </div>

          <div className="w-[300px] h-[250px] md:w-[500px] flex flex-col rounded-[10px] md:h-[400px] gap-2 ">
            <div className="flex flex-col justify-center items-center p-2  lg:p-5 gap-2">
              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                className="flex gap-5"
              >
                <MdSwipeLeft className="text-pink-500 sm:text-[30px] md:text-[40px] lg:text-[50px]" />
                <MdSwipeRight className="text-pink-500  sm:text-[30px] md:text-[40px] lg:text-[50px]" />
              </motion.div>

              <motion.div
                whileInView={{ scale: 1 }}
                initial={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                className="flex gap-20 items-center"
              >
                <RxCross1 className="text-pink-500 text-[10px] sm:text-[12px] md:text-[14px] lg;text-[20px]" />
                <AiOutlineCheck className="text-pink-500 text-[10px] sm:text-[12px] md;text-[14px] lg:text-[20px]" />
              </motion.div>
            </div>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.6 }}
              className="text-pink-500 text-center  text-[10.5px]  sm:text-xs font-bold md:text-sm lg:text-xl"
            >
              Create Your Account And Complete Your Profile
            </motion.span>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.5 }}
              className="text-pink-500 text-center sm:text-[10px]  md:mt-5 lg:mt-10 text-[8.5px] lg:text-[13.5px] md:text-[12px]"
            >
              Once your profile is set up, it's time to start swiping! Explore a
              diverse community of potential matches by swiping right if you're
              interested and left if you're not. Our intelligent matching
              algorithm takes into account your preferences and suggests
              profiles that align with your interests. When both users swipe
              right, it's a match! This opens up the possibility of connecting
              and getting to know each other better.
            </motion.span>
          </div>

          <div className="w-[300px] h-[250px] md:w-[500px]  flex flex-col rounded-[10px] md:h-[400px]">
            <motion.div
              whileInView={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.7 }}
              className="flex justify-center p-2 lg:p-4"
            >
              <img
                src={FinalDate}
                alt="FinalDate"
                className="w-[20px] h-[20px] sm:w-[40px] sm:h-[40px] lg:w-[60px] lg:h-[60px] md:w-[50px] md:h-[50px]"
              />
            </motion.div>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.8 }}
              className="text-pink-500 text-center  text-[10.5px]  sm:text-xs font-bold md:text-sm lg:text-xl"
            >
              Create Your Account And Complete Your Profile
            </motion.span>
            <motion.span
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -100, opacity: 0 }}
              transition={{ type: "tween", duration: 1, delay: 0.7 }}
              className="text-pink-500 text-center sm:text-[10px]  md:mt-5 lg:mt-10 text-[8.5px] lg:text-[13.5px] md:text-[12px] mt-2"
            >
              Now that you've found someone who shares a mutual interest, it's
              time to dive deeper and explore the connection. Engage in
              meaningful conversations through our secure chat platform to
              discover common ground and build a rapport. If you feel a stronger
              connection, you can take it a step further and schedule a call to
              have a more personal and direct conversation. This stage allows
              you to truly get to know each other and see if the sparks fly.
            </motion.span>
          </div>
        </div>

        <footer className="text-pink body-font bg-transparent">
          <div className="container px-5 py-24 mx-auto flex md:items-center lg:items-start sm:flex-row md:flex-nowrap flex-wrap flex-col">
            <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
              <a
                href="/"
                className="flex title-font font-medium items-center md:justify-start justify-center text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-8 h-8 sm:w-10 sm:h-10 text-pink p-2 bg-pink-500 rounded-full"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span className="ml-3 text-sm sm:text-xl text-pink-500">
                  LoveSpark
                </span>
              </a>
              <p className="mt-2 text-xs sm:text-sm text-pink-500">
                Find Your Love-Spark Through Us
              </p>
            </div>
            <div className="sm:flex-grow flex  sm:flex-nowrap md:flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
              <div className="lg:w-1/4 md:w-1/2 w-full px-2 sm:px-4">
                <h2 className="title-font font-medium text-pink-900 tracking-widest text-[8.5px] sm:text-sm mb-3">
                  CATEGORIES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      First Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Second Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      Third Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Fourth Link
                    </a>
                  </li>
                </nav>
              </div>
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-pink-900 tracking-widest text-[8.5px] sm:text-sm mb-3">
                  CATEGORIES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      First Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Second Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      Third Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Fourth Link
                    </a>
                  </li>
                </nav>
              </div>
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-pink-900 tracking-widest text-[8.5px] sm:text-sm mb-3">
                  CATEGORIES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      First Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Second Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      Third Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Fourth Link
                    </a>
                  </li>
                </nav>
              </div>
              <div className="lg:w-1/4 md:w-1/2 w-full px-4">
                <h2 className="title-font font-medium text-pink-900 tracking-widest text-[8.5px] sm:text-sm mb-3">
                  CATEGORIES
                </h2>
                <nav className="list-none mb-10">
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      First Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Second Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-xs sm:text-base"
                    >
                      Third Link
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-pink-600 hover:text-pink-800 text-[10px] sm:text-base"
                    >
                      Fourth Link
                    </a>
                  </li>
                </nav>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-transparent ">
            <div className="flex items-center md:ml-10">
              <span className="font-bold text-pink-700 text-lg md:text-2xl">
                Get The App!
              </span>
              <img
                src={appstore}
                alt="Appstore"
                className="w-[140px]  h-[90px] md:w-[300px] md:h-[120px] cursor-pointer"
              />
              <img
                src={PlayStore}
                alt="PlayStore"
                className="w-[100px] h-[70px] md:w-[220px] md:h-[95px] cursor-pointer"
              />
            </div>
            <hr className="border-b-2 border-b-pink-400 w-full" />
            <span className="md:ml-5  text-pink-500  md:p-5 text-xs md:text-base lg:text-lg">
              Single people, listen up: If youre looking for love, want to start
              dating, or just keep it casual, you need to be on LoveSpark, its
              the place to be to meet your next best match. Lets be real, the
              dating landscape looks very different today, as most people are
              meeting online. With LoveSpark, the worlds most popular free
              dating app, you have millions of other single people at your
              fingertips and they're all ready to meet someone like you. Whether
              youre straight or in the LGBTQIA community, LoveSparks here to
              bring you all the sparks. There really is something for everyone
              on LoveSpark. Want to get into a relationship? You got it. Trying
              to find some new friends? Say no more. New kid on campus and
              looking to make the most of your college experience? LoveSpark Us
              got you covered. LoveSpark isnt your average dating site — its the
              most diverse dating app, where adults of all backgrounds and
              experiences are invited to make connections, memories, and
              everything in between.
            </span>
          </div>
          <hr className="border-b-2 border-b-pink-400 mt-5" />
          <div className="bg-transparent">
            <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row">
              <p className="text-pink-500 text-sm text-center sm:text-left">
                © 2020 LoveSpark —
                <a
                  href="https://twitter.com/knyttneve"
                  rel="noopener noreferrer"
                  className="text-pink-600 ml-1"
                  target="_blank"
                >
                  @knyttneve
                </a>
              </p>
              <span className="inline-flex sm:ml-auto sm:mt-0 mt-2 justify-center sm:justify-start">
                <a href="/" className="text-pink-500">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a href="/" className="ml-3 text-pink-500">
                  <svg
                    fill="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                </a>
                <a href="/" className="ml-3 text-pink-500">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <rect width={20} height={20} x={2} y={2} rx={5} ry={5} />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" />
                  </svg>
                </a>
                <a href="/" className="ml-3 text-pink-500">
                  <svg
                    fill="currentColor"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={0}
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="none"
                      d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                    />
                    <circle cx={4} cy={4} r={2} stroke="none" />
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
