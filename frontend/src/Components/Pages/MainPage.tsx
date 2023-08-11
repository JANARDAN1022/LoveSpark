import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import LeftBar from "../Layouts/LeftBar";
import Chat from "../Layouts/Chat";
import Profile from "../Layouts/Profile";
import Swipe from '../Layouts/Swipe';
import EditProfile from "../Layouts/EditProfile";
import {useContext,useState} from 'react';
import { MainPageContext } from '../../Context/MainPageContext';
import { useAppSelector } from "../../Hooks";
import {io} from 'socket.io-client';
import {MessagesData} from '../../Types/UserTypes';




export const socket = io('https://abalone-balanced-flyaway.glitch.me',{
  extraHeaders:{
    "User-agent":"Google Chrome"
  }
});
 
const MainPage = () => {
  const {ShowComponent,setSender} = useContext(MainPageContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const [OnlineUsers,setOnlineUsers]=useState<any>(null);
  const [Messages,setMessages]=useState<MessagesData[]>([]);
  const [unReadMessages,setunReadMessages]=useState<number>(0);
 const Navigate = useNavigate();




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
  },[Navigate,user]);

  
  return (
    <div className={`flex overflow-scroll scrollbar relative`}>
      <div className="flex-[1]">
      <LeftBar unReadMessages={unReadMessages} onlineUsers={OnlineUsers} setunReadMessages={setunReadMessages}/>
    </div>
    <div className="flex-[3] bg-pink-100 h-[745px]">
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
    </div>

  )
}

export default MainPage