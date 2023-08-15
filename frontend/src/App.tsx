import {useEffect,useState,useContext} from 'react';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './Components/Pages/Home';
import NotFound from './Components/Pages/NotFound';
//import NavBar from  "./Components/Layouts/NavBar";
import ShowNav from './ShowNav';
import MainPage from './Components/Pages/MainPage';
import CompleteProfile from './Components/Pages/CompleteProfile';
import axios from 'axios';
import { Loaduser } from './Actions/userAction';
import { useAppDispatch} from './Hooks';
import Success from './Components/Pages/Payment/Stripe/Success';
import Fail from './Components/Pages/Payment/Stripe/Fail';
//import Calls from './Components/Layouts/Calls';
import VideoCall from './Components/Layouts/VideoCall';
import { LoginContext } from './Context/LoginContext';
//import Footer from './Components/Layouts/Footer';

const App = () => {
  const [User,setUser]=useState(null);
  const dispatch = useAppDispatch();
  const {LoggedOut} = useContext(LoginContext);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('https://love-spark.vercel.app/auth/login/success', {
          withCredentials: true, // include credentials in the request
        });
        
        if (response.status === 200) {
          const resObject = response.data;
          setUser(resObject.user);
        } else {
          throw new Error("Authentication has failed");
        }
      } catch (err) {
        console.log(err);
      }
    };

    console.log(User);
    
    getUser();
    
  }, []);


  useEffect(()=>{
    if(!LoggedOut){
    dispatch(Loaduser());
    }
},[dispatch,LoggedOut]);

 
  


  return (
    <Router>
      <ShowNav />
     <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<NotFound />} />
      <Route path='/MainPage' element={<MainPage />} />
      <Route path='/CompleteProfile' element={<CompleteProfile />} />
      <Route path='/VideoCall' element={<VideoCall />} />
      <Route path='/StripeSuccess' element={<Success />} />
      <Route path='/StripeFail' element={<Fail />} />
     </Routes>
    </Router>
  )
}

export default App;