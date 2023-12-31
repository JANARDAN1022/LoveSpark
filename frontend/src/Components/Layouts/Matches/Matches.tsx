import { useContext, useState } from 'react';
import {AiFillMessage} from 'react-icons/ai';
import { useAppSelector } from '../../../Hooks';
import axios from 'axios';
import { MainPageContext } from '../../../Context/MainPageContext';
import {RxCross1} from 'react-icons/rx';
import {Skeleton} from '@mui/material';
import {motion} from 'framer-motion';
import HeartAnimation from '../../FloatingHearts';



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
  HandleDelete:any,
  MatchLoading:boolean,
  MainPageLoading:boolean
}


const Matches = ({matches,HandleDelete,MatchLoading,MainPageLoading}:MatchesProp) => {
  const {setShowComponent,setChatUser,setChangeTab,setMatchedId} = useContext(MainPageContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const [HoverdId,setHoverdId]=useState('');
  const [ImgClick,setImgClick]=useState(false);

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
        <div key={data.swipedUser?._id===user?._id?data.user?._id:data.swipedUser._id} className='flex  justify-between relative p-5 hover:bg-pink-100 cursor-pointer items-center'>
          <div onClick={()=>{
            setMatchedId(data.swipedUser?._id===user?._id?data.user._id:data.swipedUser._id);
            setShowComponent('Profile');
            }}  className='flex gap-10 items-center'>
                {MainPageLoading?
             <Skeleton animation='wave' width={45} height={45} variant='circular' sx={{bgcolor:'pink'}} className=''/>
             :
          <img  src={data.swipedUser?.ProfileUrl===user?.ProfileUrl?data.user?.ProfileUrl:data.user?.ProfileUrl===user?.ProfileUrl?data.swipedUser?.ProfileUrl:''} alt='URL' className='h-[45px] w-[45px] object-cover rounded-full hover:border border-pink-500'/>
                }
                  {MainPageLoading?
             <Skeleton animation='wave' width={100} height={25}  variant='rectangular' sx={{bgcolor:'pink'}} className='rounded-[5px]'/>
             :
          <span  className='text-[20px] text-pink-500'>{data.swipedUser?.FirstName===user?.FirstName?data.user?.FirstName:data.user?.FirstName===user?.FirstName?data.swipedUser?.FirstName:''}</span>
                  }
          </div>
          {MainPageLoading?
             <Skeleton animation='wave' width={65} height={25} variant='rectangular' sx={{bgcolor:'pink'}} className='rounded-[5px]'/>
             :
           <div className='flex items-center gap-3 '>
             <AiFillMessage onClick={()=>HandleSendMessage(data.swipedUser?._id===user?._id?data.user?._id:data.swipedUser._id)} size={30} className='text-pink-400 mr-3 cursor-pointer hover:text-pink-500 transition-all'/>
            <RxCross1 onClick={()=>HandleDelete(data._id)} onMouseEnter={()=>setHoverdId(data.swipedUser?._id===user?._id?data.user?._id:data.swipedUser._id)} 
              onMouseLeave={()=>setHoverdId('')} size={20} className='text-red-400 hover:text-red-600'/>
            <span className={`absolute text-red-500 top-[5px] text-sm right-[3px] ${HoverdId===(data.swipedUser?._id===user?._id?data.user?._id:data.swipedUser._id)?'':'hidden'}`} >Remove Match</span>
           <div className={`${MatchLoading && HoverdId!==''?'':'hidden'} absolute text-pink-500 w-[372px] animate-pulse bottom-0 left-0 bg-red-500 h-1 rounded-[8px]`}></div>
           </div>
}
        </div>
      )):
      <div className='flex overflow-hidden relative justify-center  items-center self-center h-[500px]'>
         <div className='z-20 flex flex-col items-center gap-2'>
          <div className='flex justify-center'>
            {loading?
             <Skeleton animation='wave' width={120} height={120} variant='circular' sx={{bgcolor:'pink'}} className=''/>
             :
            <motion.img onClick={()=>setImgClick(!ImgClick)} animate={{rotate:ImgClick?360:0}} transition={{type:'spring',stiffness:90}} src={user?.ProfileUrl} alt='ProfilePic' className='w-[120px] h-[120px] object-cover rounded-full'/>
            }
            </div>
          <div className='flex flex-col items-center'>
              <span className='text-pink-500 md:text-sm lg:text-lg'>No Matches Yet {user?.FirstName}</span>
              <span className='text-pink-500 md:text-sm lg:text-lg md:text-center w-[290px]'>Find Your Love Spark Keep Swiping</span>
         </div>
         </div>
         {!loading &&
        <div className='absolute top-[-180px]'>
          <HeartAnimation />
        </div>
          }
      </div>
    }

    </div>
  )
}

export default Matches