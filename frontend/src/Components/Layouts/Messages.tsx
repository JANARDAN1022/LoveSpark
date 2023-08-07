import {useCallback, useContext,useEffect,useState} from 'react'
import { MainPageContext } from '../../Context/MainPageContext';
import { useAppSelector } from '../../Hooks';
import axios from 'axios';
import {MdDelete} from 'react-icons/md';
import {BiBlock} from 'react-icons/bi';
import { Chat } from '../../Types/UserTypes';

interface MessageProps {
  unReadMessages:number
}

const Messages = ({unReadMessages}:MessageProps) => {
    const {setShowComponent,setChatUser,ChatUser,setChangeTab} = useContext(MainPageContext);
    const {user} = useAppSelector((state)=>state.user);
    const [Chats,setChats]=useState<Chat[] | null>(null);
    //To Handle Tooltips for Delete Icon and the Block Icon using ID thus initial value is string :''
    const [Tooltip,setTooltip]=useState({
      delete:'',
      block:'',
    });
    //TO Fetch/Update Chats when delete or block is clicked 
    const [Clicked,setClicked]=useState({
      DELETE:false,
      BLOCK:false,
    });
    const id = user?._id;

    const FetchChats = useCallback(async()=>{
      if(id){
    const Route = `http://localhost:5000/api/chat/conversations/${id}`;
    const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    const {data} = await axios.get<any>(Route,config);
    setChats(data.conversations);
      }
     },[id]);

   
   
     useEffect(()=>{
      if(id){
      FetchChats();
      }
     },[id,FetchChats,ChatUser,Clicked]);

  

//Filtering the Chats to display only those which are not current user from the participants of Chats
const filteredParticipant = Chats && Chats.map((chat) => {
  const participants = chat.participants.filter(
    (participant) => participant.FirstName !== user?.FirstName
  );
  return { ...chat, participants };
}).sort();


//Handle Click on Img or Name of the Chats User and set him as the ChatUser in Chat.tsx|Chat component
const HandleMessageClick = async(ChatId:string)=>{
  const Route = `http://localhost:5000/api/chat/Single/${user?._id}/${ChatId}`;
  const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
  const {data} = await axios.get<any>(Route,config);
 setChatUser(data.chat);
 setShowComponent('Chat');
}

const HandleDeleteChat = async(ChatID:string) => {
  const Route = `http://localhost:5000/api/chat/Delete/${ChatID}`;
  const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
  await axios.delete(Route,config);
  setClicked({...Clicked,DELETE:true});
  if(ChatUser?._id===ChatID){
    setChatUser(null);
    setShowComponent('Swipe');
    setChangeTab(false);
  }
}


  return (
    <div className={`scrollbar flex flex-col  gap-5 overflow-x-hidden overflow-y-scroll h-full z-20 bg-pink-50 `}>
      {filteredParticipant && filteredParticipant.length>0?filteredParticipant.map((data)=>(
        <div key={data._id} className={`flex justify-between relative cursor-pointer ${ChatUser?._id===data._id?'bg-[#f6d2e7] hover:bg-[#f6d2e7]':'hover:bg-pink-100'} p-5 items-center `}>
          <div className='flex relative  gap-6 items-center' onClick={()=>HandleMessageClick(data._id)}>
        <img src={data.participants[0].ProfileUrl} alt='URL' className='h-[45px] w-[45px] rounded-full hover:border border-pink-500' />
        <span className='text-[20px] text-pink-500'>{data.participants[0].FirstName}</span>
        <span className={` absolute top-[-10px] right-[65px] bg-gradient-to-r from-pink-500 to-rose-500 items-center text-white rounded-full flex justify-center w-[25px] h-[25px]`}>1</span>
        </div>
        <div className='flex gap-5 mr-1'>
        <MdDelete onClick={()=>HandleDeleteChat(data._id)} size={25} onMouseEnter={()=>setTooltip({...Tooltip,delete:data.participants[0]._id})} onMouseLeave={()=>setTooltip({...Tooltip,delete:''})} className='text-red-400  cursor-pointer hover:text-red-500 transition-all' />
        <BiBlock size={25} onMouseEnter={()=>setTooltip({...Tooltip,block:data.participants[0]._id})} onMouseLeave={()=>setTooltip({...Tooltip,block:''})} className='text-red-400  cursor-pointer hover:text-red-500 transition-all' />
        </div>
        <span className={`${Tooltip.delete===data.participants[0]._id?'':'hidden'} absolute top-2 right-1 text-sm text-red-400 `}>Delete  Conversation</span>
        <span className={`${Tooltip.block===data.participants[0]._id?'':'hidden'} absolute top-2 right-1 text-sm text-red-400 `}>Block user</span>
        </div>
      ))
      :
      <div className='flex justify-center items-center h-[400px]'>
        <div className='flex flex-col gap-3 items-center'>
        <img onClick={()=>setShowComponent('Profile')} src={user?.ProfileUrl} alt='ProfilePic' className='cursor-pointer hover:border-pink-400 border-2 border-pink-500 w-[120px] h-[120px] rounded-full' />
        <span className='text-pink-500 font-bold'>No Messages Yet</span>
        <span className='text-pink-500 font-bold'>Find Your Spark And Start Messaging</span>
        </div>
        </div>
      }
        </div>
  )
}

export default Messages