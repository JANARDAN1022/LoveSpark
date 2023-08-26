import {useCallback, useContext, useEffect,useState,useRef} from 'react'
import { MainPageContext } from '../../../Context/MainPageContext';
import {RxCross1} from 'react-icons/rx';
import {FcVideoCall} from 'react-icons/fc';
import { useAppSelector } from '../../../Hooks';
import axios from 'axios';
import InputEmoji from 'react-input-emoji';
import {BsSendFill} from 'react-icons/bs';
import { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { MessagesData } from '../../../Types/UserTypes';
import { useNavigate } from 'react-router-dom';




interface ChatProps {
  socket:Socket,
  Messages:MessagesData[] | null,
  setMessages:React.Dispatch<React.SetStateAction<MessagesData[]>>
}

const Chat = ({socket,Messages,setMessages}:ChatProps) => {
    const {setShowComponent,ShowComponent,ChatUser,setChangeTab,setMatchedId,setChatUser}=useContext(MainPageContext);
    const [SendMessage,setSendMessage]=useState('');
    const {user} = useAppSelector((state)=>state.user);
    const Navigate = useNavigate();
    //constants for each Information of ChatUser:
    
    //participants of ChatUser:-
    const FilterParticipants = ChatUser?.participants ?? [];
    
    //Filtering participants to include only thos which are not users:
    const NonCurrentUserParticipants = FilterParticipants.filter((P) => P._id !== user?._id);
    const Participant = NonCurrentUserParticipants?.[0];

    //Non-user Participants Info:
    const UserName = Participant?.FirstName;
    const ProfilePic = Participant?.ProfileUrl;
    const CoverPic = Participant?.CoverUrl;
    const Bio = Participant?.bio;
    const Interests = Participant?.interests;
    const Occupation = Participant?.occupation;
    const ID = Participant?._id?Participant?._id:'';
    //To scroll Down Messages on visit
    const scroll = useRef<HTMLDivElement>(null);
    

    const Fetchmessages = useCallback(async()=>{
      if(ChatUser?._id){
      try {
      const Route=`https://love-spark.vercel.app/api/Messages/${ChatUser?._id}`;
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const {data} = await axios.get<any>(Route,config);
     setMessages(data.ChatMessages);
      } catch (error) {
        console.log(error);
      }
    }
    },[ChatUser?._id,setMessages]);

    
    useEffect(()=>{
       Fetchmessages();
    },[Fetchmessages,ChatUser]);

    
useEffect(()=>{
  if(ShowComponent==='Chat'){
    scroll.current?.scrollIntoView(); 
  }
},[ShowComponent,Messages]);



const HandleVideoCall = ()=>{
  
const data = {
  calledId:ID,
  UserName:user?.FirstName,
  UserId:user?._id,
  VideoCall:true,
}
  socket.emit('call-user',(data));
  Navigate(`/VideoCall`)   
  window.location.reload(); 
}
    
  
    

    const HandleInputChange = (SendMessage:string)=>{
     setSendMessage(SendMessage);
    }

    const handleOnEnter = async(message:string) => {
      if (message.trim() !== ''){
        const Data = {
          receiverUserId:Participant._id,
          content: message,
          chat:ChatUser?._id,
          sender:user?._id,
        };
        socket.emit('send-message', Data);
        try {
          const Route = `https://love-spark.vercel.app/api/Messages/Send`;
          const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
          const {data} =  await axios.post<any>(Route,{chatId:ChatUser?._id,sender:user?._id,content:SendMessage},config);
          setMessages((prev)=>[...prev,data.message]);
          setSendMessage('');
        } catch (error) {
          console.log(error)
        }
      }
    };

    function getTimeAgo(createdAt: string): string {
      const now = new Date();
      const sentTime = new Date(createdAt);
    
      const timeDiffInMinutes: number = Math.floor((now.getTime() - sentTime.getTime()) / (1000 * 60));
    
      if (timeDiffInMinutes < 1) {
        return "now";
      } else if (timeDiffInMinutes < 60) {
        return timeDiffInMinutes + " minute" + (timeDiffInMinutes > 1 ? "s" : "") + " ago";
      } else if (timeDiffInMinutes < 1440) {
        const hoursAgo: number = Math.floor(timeDiffInMinutes / 60);
        return hoursAgo + " hour" + (hoursAgo > 1 ? "s" : "") + " ago";
      } else if (timeDiffInMinutes < 2880) {
        return "yesterday";
      } else {
        const days: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[sentTime.getDay()];
      }
    }

    
    
    

    return (
    <div className='flex w-[1130.5px] h-[742px]'>
      
      <div className='flex-1 flex flex-col'>
        <nav className='flex justify-between relative h-[100px] w-full p-2 border-2 border-red-700'>
        <RxCross1 size={30} className='text-pink-600 absolute right-5 cursor-pointer' 
        onClick={()=>
          {
      setShowComponent('Swipe')
      setChangeTab(false);
      setChatUser(null);
      }} />
        <div className='flex gap-5 ml-10 items-center' >
         <img onClick={()=>{
          setMatchedId(ID!==''?ID:'')
          setShowComponent('Profile');
          }} src={ProfilePic} alt='img' className='cursor-pointer w-[60px] h-[60px] rounded-full' />
         <span onClick={()=>{
          setMatchedId(ID!==''?ID:'')
          setShowComponent('Profile');
          }} className='text-pink-500 text-2xl' >{UserName}</span>

        </div>
        <div onClick={(HandleVideoCall)} className='flex flex-col  mt-1 mr-20 items-center'>
          <FcVideoCall  size={35} className='text-pink-500 cursor-pointer' />
          <span className='text-pink-500 font-bold cursor-pointer'>Start A Room</span>
        </div>
        </nav>
        <div  className='flex relative flex-col gap-5 border-2 border-r-red-700 h-[580px] overflow-x-hidden overflow-y-scroll scrollbar'>
          {Messages && Messages.map((message)=>(
        <div key={message._id} ref={scroll} className={`flex gap-2 items-center ${message.sender===user?._id?'justify-end mr-5':'justify-start ml-5'} mt-5 mb-3`}>
        <img  onClick={()=>{
          setMatchedId(message.sender===user?._id?user?._id:ID)
          setShowComponent('Profile');
          }} src={message.sender===user?._id?user?.ProfileUrl:ProfilePic} alt='profilePic' className='cursor-pointer hover:border hover:border-white w-[40px] h-[40px] rounded-full'/>
       <div className='p-2 rounded-[5px] flex flex-col bg-gradient-to-r from-pink-500 to-rose-500 relative max-w-[200px]'>
  <span className='text-base max-w-[180px] text-white top-10 rounded-[5px] break-words'>
    {message.content}
  </span>
  <span className='text-[rgba(255,255,255,0.8)] text-xs text-end'>
    {getTimeAgo(message.createdAt ? message.createdAt : '')}
  </span>
</div>
        </div>    
      ))}
        </div> 
        <div className='flex items-center gap-2 flex-wrap w-[670px]'>
          <div className='w-[600px] ml-4'>
            <InputEmoji 
            value={SendMessage}
            onChange={HandleInputChange}
            placeholder="Type a message"
            cleanOnEnter
            onEnter={handleOnEnter}
            />
            
            </div>
        <BsSendFill onClick={()=>handleOnEnter(SendMessage)} size={26}  className='text-pink-400  rotate-12 cursor-pointer hover:text-pink-500' />
         </div>
         </div>
   
    <div className='p-2 flex  bg-gradient-to-r from-pink-500 to-rose-500 h-[744px]'>
     <div className='flex Profile border-2 border-white w-[450px] h-[600px]' style={{ backgroundImage: `url(${CoverPic})` }}>
      <div className='flex flex-col justify-end mb-2 gap-5'>  
       <div className='flex gap-5 items-center ml-5'>
      <span className=' text-white text-4xl '>{UserName}</span>
      <span className=' text-white text-xl mt-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-[35px] flex justify-center h-[35px]'>22</span>
      <span className='text-white text-lg mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-max p-1 pl-2 pr-2 flex justify-center h-[35px]'>{Occupation}</span>
      </div>
      <div className='flex gap-2 items-center flex-wrap ml-5'>
        {Interests && Interests.map((Interest)=>(
        <span key={uuidv4()} className={`text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base p-1 rounded-[5px]`}>{Interest}</span>
        ))
        }
        </div>
      <span className={`text-base font-bold p-3 text-white bg-[rgba(236,72,153,0.1)]`}>{Bio}</span>
     </div>
     </div>
    </div>
    </div>
  )
}

export default Chat