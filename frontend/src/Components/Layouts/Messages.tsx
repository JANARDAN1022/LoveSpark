import {useCallback, useContext,useEffect,useRef,useState} from 'react'
import { MainPageContext } from '../../Context/MainPageContext';
import { useAppSelector } from '../../Hooks';
import axios from 'axios';
import {MdDelete} from 'react-icons/md';
import {BiBlock} from 'react-icons/bi';
import { Chat } from '../../Types/UserTypes';
import {RxCross1} from 'react-icons/rx';

interface MessageProps {
  unReadMessages:number,
  ShowReport:{
    show: boolean,
    for:string
  },
  setShowReport: React.Dispatch<React.SetStateAction<{
    show: boolean;
    for: string;
}>>,
onlineUsers:[{
  socKetId:string,
  unreadMessages:number,
  userId:string,
}]
}

const Messages = ({unReadMessages,ShowReport,setShowReport,onlineUsers}:MessageProps) => {
    const {setShowComponent,setChatUser,ChatUser,setChangeTab} = useContext(MainPageContext);
    const {user} = useAppSelector((state)=>state.user);
    const [Chats,setChats]=useState<Chat[] | null>(null);
    const [Reason,setReason]=useState('');
    const [ReportInfo,setReportInfo]=useState({
      ID:'',
      FirstName:''
    })
    const TextRef = useRef<HTMLTextAreaElement>(null);
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
    const Route = `https://love-spark.vercel.app/api/chat/conversations/${id}`;
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
  const Route = `https://love-spark.vercel.app/api/chat/Single/${user?._id}/${ChatId}`;
  const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
  const {data} = await axios.get<any>(Route,config);
 setChatUser(data.chat);
 setShowComponent('Chat');
}

const HandleDeleteChat = async(ChatID:string) => {
  const Route = `https://love-spark.vercel.app/api/chat/Delete/${ChatID}`;
  const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
  await axios.delete(Route,config);
  setClicked({...Clicked,DELETE:true});
  if(ChatUser?._id===ChatID){
    setChatUser(null);
    setShowComponent('Swipe');
    setChangeTab(false);
  }
}

const HandleReportSubmit = async(ID:string)=>{
  if(ID){
    if(Reason!==''){
      try {
        const Route = `https://love-spark.vercel.app/api/Reports/AddReport`;
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const {data} =  await  axios.post(Route,{UserID:user?._id,ReportedUserID:ID,Reason:Reason},config);     
       if(data){       
        setShowReport({...ShowReport,show:false}); 
       }
      } catch (error) {
        
      }
    }else{
      if(TextRef.current){
        TextRef.current.focus();
      }
    }
  }
}

const OnlineIds = onlineUsers.map((User)=>User.userId);

  return (
    <div className={`scrollbar flex flex-col  gap-5 overflow-x-hidden overflow-y-scroll h-full z-20 bg-pink-50 `}>
      <div  className={`absolute z-20 justify-center items-center gap-5 left-2 shadow-md border-2 top-[250px] flex flex-col bg-white ${ShowReport.show && ShowReport.for==='Messages'?'':'hidden'} w-[350px] h-[300px] rounded-[10px]`}>
    <RxCross1 className='text-pink-500  cursor-pointer ml-[88%]' size={25} onClick={()=>{
      setShowReport({...ShowReport,show:false});
      setReason('');
      }} />
    <div className='flex flex-col gap-2'>
    <div className='flex flex-col gap-1 justify-center items-center'>
     <span className='text-pink-500 font-bold'>Reason For Reporting :</span>
     <span className='text-pink-500 text-sm'>(Brief Detail)</span>
    </div>
    <textarea value={Reason} onChange={(e)=>setReason(e.target.value)} ref={TextRef} className='pl-3 text-white border-2 border-pink-800 bg-pink-400 w-[300px] h-[100px] rounded-[5px]' />
    </div>
    <button onClick={()=>HandleReportSubmit(ReportInfo.ID)} className='bg-pink-500 rounded-[10px] cursor-pointer w-[150px] h-[30px] flex justify-center items-center text-white'>Report {ReportInfo.FirstName}</button>
    </div>
      {filteredParticipant && filteredParticipant.length>0?filteredParticipant.map((data)=>(
        <div key={data._id} className={`${ShowReport.show?'blur-sm':''} flex justify-between relative  ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':'cursor-pointer'}
        ${ChatUser?._id===data._id?'bg-[#f6d2e7] hover:bg-[#f6d2e7]':'hover:bg-pink-100'} p-5 items-center `}>
          
          <span className={`${OnlineIds.includes(data.participants[0]._id)?'':'hidden'} z-20 bg-green-500 top-2 left-12 w-[20px] h-[20px] rounded-full absolute`}></span>
          <div className='flex relative  gap-6 items-center' onClick={()=>HandleMessageClick(data._id)}>
        <img src={data.participants[0].ProfileUrl} alt='URL' className='h-[45px] w-[45px] rounded-full hover:border border-pink-500' />
        <span className='text-[20px] text-pink-500'>{data.participants[0].FirstName}</span>
        </div>
        <div className='flex gap-5 mr-1'>
        <MdDelete onClick={()=>HandleDeleteChat(data._id)} size={25} onMouseEnter={()=>setTooltip({...Tooltip,delete:data.participants[0]._id})} onMouseLeave={()=>setTooltip({...Tooltip,delete:''})} className={` ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':'cursor-pointer'}
            text-red-400  cursor-pointer hover:text-red-500 transition-all`}/>
        <BiBlock onClick={()=>{
          setReportInfo({ID:data.participants[0]._id,FirstName:data.participants[0].FirstName});
          setShowReport({...ShowReport,show:true});
        }} size={25} onMouseEnter={()=>setTooltip({...Tooltip,block:data.participants[0]._id})} onMouseLeave={()=>setTooltip({...Tooltip,block:''})} className={`text-red-400   ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':'cursor-pointer'}
        hover:text-red-500 transition-all`} />
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