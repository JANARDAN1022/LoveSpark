import { useLocation } from "react-router-dom";
import NavBar from "./Components/Layouts/NavBar/NavBar";
import { useAppSelector } from "./Hooks";


const ShowNav = ()=> {
  const {loading} = useAppSelector((state)=>state.user)
  const location = useLocation();
  const Location = location.pathname;
  const hideNav =  Location === "/CompleteProfile" || Location==="/MainPage" || Location==='/VideoCall' || Location==='/StripeSuccess' || Location==='/StripeFail';

  if (hideNav || loading) {
    return null; // Return null to hide the navbar
  } 
  return (
  <>
  <NavBar />
  </>
  )
};

export default ShowNav;
