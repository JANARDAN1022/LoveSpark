import { useLocation } from "react-router-dom";
import NavBar from "./Components/Layouts/NavBar/NavBar";
import { useAppSelector } from "./Hooks";
import { useContext } from "react";
import { LoginContext } from "./Context/LoginContext";


const ShowNav = ()=> {
  const {loading} = useAppSelector((state)=>state.user);
  const {ImageLoading} = useContext(LoginContext);
  const location = useLocation();
  const Location = location.pathname;
  const hideNav =  Location === "/CompleteProfile" || Location==="/MainPage" || Location==='/VideoCall' || Location==='/StripeSuccess' || Location==='/StripeFail';

  if (hideNav || loading || ImageLoading) {
    return null; // Return null to hide the navbar
  } 
  return (
  <>
  <NavBar />
  </>
  )
};

export default ShowNav;
