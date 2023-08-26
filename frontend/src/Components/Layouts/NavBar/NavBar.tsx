import {useState,useEffect,useContext} from 'react';
import { LoginContext } from '../../../Context/LoginContext';
import { useAppSelector,useAppDispatch } from '../../../Hooks';
import { LogoutUser} from '../../../Actions/userAction';
import { motion } from 'framer-motion'; 

const NavBar = () => {
  const {setshowLogin,setShowSignUp,setscroll}=useContext(LoginContext);
  const [ChangeColor,setChangeColor]=useState(false);
  const {isAuthenticated,loading} = useAppSelector((state)=>state.user);
  const dispatch = useAppDispatch();

  const ChangeNavColor = () => {
      if(window.scrollY>=220){
      setChangeColor(true)
    }else{
      setChangeColor(false)
    }
  }

  useEffect(()=>{
    ChangeNavColor();
    window.addEventListener('scroll',ChangeNavColor);
  },[])

  const HandleLoginClick = ()=>{

    if(!isAuthenticated && !loading){
    setshowLogin(true);
    setShowSignUp(false);
    setscroll(true);
    setTimeout(() => {
      setscroll(false);
    }, 1000);
  }else{
    dispatch(LogoutUser());
  }
  }
  
  return (
    <header data-testid="navbar-component" className={`text-gray-600 body-font ${ChangeColor?'fixed top-0 z-20 bg-pink-400 bg-opacity-[0.2]':'fixed'} sm:fixed top-0 w-full z-10`}>
    <div className="container  sm:justify-between  mx-auto flex flex-wrap p-5 flex-col sm:flex-row  items-center">
      <motion.a initial={{scale:0}} animate={{scale:1}} transition={{ease:'easeInOut'}} href='/' className="flex title-font font-medium items-center text-gray-900 mb-4 sm:mb-0">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className=" md:w-10 md:h-10 w-8 h-8 text-white p-2 bg-pink-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
        <span className="ml-3  sm:text-[14px] md:text-xl text-pink-400">LoveSpark</span>
      </motion.a>
      <nav className={`md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400	flex flex-wrap items-center  sm:text-[14px] md:text-base justify-center ${ChangeColor?'text-pink-600 font-bold':'text-pink-300'} `}>
        <motion.a initial={{scale:0}} animate={{scale:1}} transition={{ease:'easeInOut',delay:0.2}} href='/' className="mr-3 md:mr-5 hover:text-pink-500">First Link</motion.a>
        <motion.a initial={{scale:0}} animate={{scale:1}} transition={{ease:'easeInOut',delay:0.3}} href='/' className="mr-3 md:mr-5 hover:text-pink-500">Second Link</motion.a>
        <motion.a initial={{scale:0}} animate={{scale:1}} transition={{ease:'easeInOut',delay:0.4}} href='/' className="mr-3 md:mr-5 hover:text-pink-500">Third Link</motion.a>
        <motion.a initial={{scale:0}} animate={{scale:1}} transition={{ease:'easeInOut',delay:0.5}} href='/' className="mr-3 md:mr-5 hover:text-pink-500">Fourth Link</motion.a>
      </nav>
      <button data-testid='Nav LoginBTn' onClick={HandleLoginClick} className="inline-flex items-center bg-pink-400 border-2 border-pink-500 text-pink-100 py-1 px-3 lg:px-5 focus:outline-none hover:bg-pink-500 rounded-[10px] sm:text-[14px] md:text-[18px] mt-4 sm:mt-0 lg:mr-14">
          {!loading && !isAuthenticated?'Log In':'Log Out'}
        <motion.svg  
        animate={{x:5}} 
        transition={{
          repeat: 5,
          repeatType: "reverse",
          duration: 2,
          type:'spring',
          stiffness:200}} initial={{x:0}} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 ml-1" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </button>
    </div>
  </header>
  )
}

export default NavBar