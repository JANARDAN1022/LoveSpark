import { useLocation } from "react-router-dom";
import NavBar from "./Components/Layouts/NavBar";


const ShowNav = ()=> {
  const location = useLocation();
  const Location = location.pathname;
  const hideNav =  Location === "/CompleteProfile" || Location==="/MainPage" || Location==='/VideoCall';

  if (hideNav) {
    return null; // Return null to hide the navbar
  } 
  return (
  <>
  <NavBar />
  </>
  )
};

export default ShowNav;
