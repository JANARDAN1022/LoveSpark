import { useContext, useState } from 'react';
import {AiFillMessage} from 'react-icons/ai';
import { useAppSelector } from '../../Hooks';
import axios from 'axios';
import { MainPageContext } from '../../Context/MainPageContext';
import {RxCross1} from 'react-icons/rx';

interface Matched {
  _id:string,
  swipedUser:{
  _id:string,
  ProfileUrl:string,
  FirstName:string,
  LastName:string | ''
  },
  user:{
    _id:string,
    ProfileUrl:string,
    FirstName:string,
    LastName:string | ''
  },
}

interface ChatData {
  chat:{
  createdAt:string,
  participants:string[],
  _id:string,
  }
}

interface MatchesProp {
  matches:Matched[]
  HandleDelete:any
}


const Matches = ({matches,HandleDelete}:MatchesProp) => {
  const {setShowComponent,setChatUser,setChangeTab,setMatchedId} = useContext(MainPageContext);
  const {user} = useAppSelector((state)=>state.user);
  const [HoverdId,setHoverdId]=useState('');

const HandleSendMessage = async(ID:string)=>{
 const Route = `https://love-spark.vercel.app/api/chat/`;
 const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
 const {data} = await axios.post<ChatData>(Route,{participants:[user?._id,ID]},config);
 if(data){
 const ChatID = data.chat._id;
 const route = `https://love-spark.vercel.app/api/chat/Single/${user?._id}/${ChatID}`;
  const Data = await axios.get<any>(route,config);
  setChatUser(Data.data.chat);
 setShowComponent('Chat');
 setChangeTab(true);
 }
}



  return (
    <div className='flex  scrollbar flex-col gap-5 bg-pink-50 overflow-x-hidden overflow-y-scroll h-full z-50'>
      {matches.length>0?
       matches.map((data)=>(
        <div key={data.swipedUser._id===user?._id?data.user._id:data.swipedUser._id} className='flex justify-between relative p-5 hover:bg-pink-100 cursor-pointer items-center'>
          <div onClick={()=>{
            setMatchedId(data.swipedUser?._id===user?._id?data.user._id:data.swipedUser._id);
            setShowComponent('Profile');
            }}  className='flex gap-10 items-center'>
          <img  src={data.swipedUser.ProfileUrl===user?.ProfileUrl?data.user.ProfileUrl:data.user.ProfileUrl===user?.ProfileUrl?data.swipedUser.ProfileUrl:''} alt='URL' className='h-[45px] w-[45px] rounded-full hover:border border-pink-500'/>
          <span  className='text-[20px] text-pink-500'>{data.swipedUser.FirstName===user?.FirstName?data.user.FirstName:data.user.FirstName===user?.FirstName?data.swipedUser.FirstName:''}</span>
          </div>
           <div className='flex items-center gap-3 '>
             <AiFillMessage onClick={()=>HandleSendMessage(data.swipedUser._id===user?._id?data.user._id:data.swipedUser._id)} size={30} className='text-pink-400 mr-3 cursor-pointer hover:text-pink-500 transition-all'/>
            <RxCross1 onClick={()=>HandleDelete(data._id)} onMouseEnter={()=>setHoverdId(data.swipedUser._id===user?._id?data.user._id:data.swipedUser._id)} onMouseLeave={()=>setHoverdId('')} size={20} className='text-red-400 hover:text-red-600'/>
            <span className={`absolute text-red-500 top-[5px] text-sm right-[3px] ${HoverdId===(data.swipedUser._id===user?._id?data.user._id:data.swipedUser._id)?'':'hidden'}`} >Remove Match</span>
            </div>
        </div>
      )):
      <div className='flex justify-center  items-center self-center h-[500px]'>
         <div className='flex flex-col items-center'>
          <div className='flex justify-center'>
            <img src={user?.ProfileUrl} alt='ProfilePic' className='w-[120px] h-[120px] rounded-full'/>
          </div>
          <div className='flex flex-col items-center'>
              <span className='text-pink-500 text-lg'>No Matches Yet {user?.FirstName}</span>
              <span className='text-pink-500 text-lg w-[290px]'>Find Your Love Spark Keep Swiping</span>
         </div>
         </div>
      </div>
    }

    </div>
  )
}

export default Matches