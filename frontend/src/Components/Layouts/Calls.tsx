//import { useEffect } from "react";
//import { useParams,useLocation} from "react-router-dom"
//import AudioCalls from "./AudioCalls";
import VideoCall from "./VideoCall";
//import {socket} from '../Pages/MainPage';
//import { useAppSelector } from "../../Hooks";

/*interface Data {
    callerId:string,
    calledId:string
    UserName:string,
    UserId:string,
}*/

const Calls = () => {
   // const {user} = useAppSelector((state)=>state.user);
//    const { callerId, calledId } = useParams<{ callerId: string; calledId: string; videocall:string }>();




  return (
  <VideoCall />
    )
}

export default Calls