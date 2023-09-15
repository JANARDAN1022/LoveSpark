import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import LeftBar from "../Layouts/LeftBar/LeftBar";
import Chat from "../Layouts/Chat/Chat";
import Profile from "../Layouts/Profile/Profile";
import Swipe from '../Layouts/Swipe/Swipe';
import EditProfile from "../Layouts/EditProfile/EditProfile";
import {useContext,useState} from 'react';
import { MainPageContext } from '../../Context/MainPageContext';
import { useAppSelector } from "../../Hooks";
import {io} from 'socket.io-client';
import {MessagesData} from '../../Types/UserTypes';
import { LoginContext } from "../../Context/LoginContext";
import Skeleton from "@mui/material/Skeleton/Skeleton";





export const socket = io('http://localhost:8800');
 
const MainPage = () => {
  const {ShowComponent,setSender} = useContext(MainPageContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const [OnlineUsers,setOnlineUsers]=useState<any>(null);
  const [Messages,setMessages]=useState<MessagesData[]>([]);
  const [unReadMessages,setunReadMessages]=useState<number>(0);
  const {setLoggedOut} = useContext(LoginContext);
  const [MainPageLoading,setMainPageLoading]=useState(false);
 const Navigate = useNavigate();

useEffect(()=>{
  if(user?.Blocked===true){
    Navigate('/');
  }
},[user,Navigate])


  useEffect(() => {
    socket.emit('user-connected', user?._id);
    socket.on('get-users',(users)=>{
      setOnlineUsers(users);
    });
    const body = document.body;
    body.style.overflowX = 'hidden';
  }, [user?._id]);



useEffect(() => {
  socket.on("receive-message", (data: MessagesData) => {
     setSender((Sender)=>[...Sender,data.sender]);
    setMessages((prevMessages) => [...prevMessages, data]); 
    if(ShowComponent!=='Chat'){
      setunReadMessages((prev)=>prev + 1);
    }   
  });
  // eslint-disable-next-line
}, [setMessages]);

  useEffect(()=>{
    if(!loading){
        if(user){
             if(user.ProfileStatus && user.ProfileStatus!=="Complete"){
                  Navigate('/CompleteProfile');
             }
        }else{
          Navigate('/');
        }
      }
  },[Navigate,user,loading]);

  useEffect(()=>{
 setLoggedOut(false);
  },[setLoggedOut]);

  
  return (
    <div className={`SwipeCard flex overflow-scroll  scrollbar relative flex-shrink`}>
      <div className="md:flex-[1] md:block hidden">
          <LeftBar setMainPageLoading={setMainPageLoading} MainPageLoading={MainPageLoading} unReadMessages={unReadMessages} onlineUsers={OnlineUsers} setunReadMessages={setunReadMessages}/>
     </div>
    {
    MainPageLoading?
    <Skeleton animation='wave'
    className="bg-gradient-to-r from-pink-600 to-rose-400"
    variant="rectangular"
    height='100vh'
    width='80%'
    />
    :
    <div className="flex-[3] bg-pink-100 h-[745px] flex-shrink">
    {ShowComponent==='Chat'?
    <Chat socket={socket} Messages={Messages} setMessages={setMessages}/>
    :ShowComponent==='Profile'?
    <Profile />
    :ShowComponent==='EditInfo'?
    <EditProfile />
    :
    <Swipe />
  }
    </div>
}
    </div>

  )
}

export default MainPage