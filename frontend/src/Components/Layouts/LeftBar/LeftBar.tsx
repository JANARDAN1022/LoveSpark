import { useState,useContext,useCallback,useEffect } from 'react';
import Matches from '../Matches/Matches';
import Messages from "../Messages/Messages";
import { MainPageContext } from '../../../Context/MainPageContext';
import {IoMdSettings} from 'react-icons/io';
import {BiLogOut} from 'react-icons/bi';
import AccountSettings from '../AccountSettings/AccountSettings';
import { useAppSelector,useAppDispatch } from '../../../Hooks';
import { LogoutUser} from '../../../Actions/userAction';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';
import { LoginContext } from '../../../Context/LoginContext';
import { Skeleton } from '@mui/material';



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

interface LeftBarProps {
  unReadMessages:number,
  setunReadMessages: React.Dispatch<React.SetStateAction<number>>,
  onlineUsers:[{
    socKetId:string,
    unreadMessages:number,
    userId:string,
  }],
  setMainPageLoading:React.Dispatch<React.SetStateAction<boolean>>,
  MainPageLoading:boolean
}

const LeftBar = ({unReadMessages,setunReadMessages,onlineUsers,setMainPageLoading,MainPageLoading}:LeftBarProps) => {
  const [Tooltip,setTooltip]=useState({
    Settings:false,
    Logout: false
  });
  const [ShowReport,setShowReport]=useState({
    show: false,
    for:'Messages'
  });
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const {activeTab, setActiveTab, setShowComponent,ShowComponent,ChangeTab,setChangeTab,setMatchedId,ReFetchMatches,setReFetchUsers} = useContext(MainPageContext);
  const {setLoggedOut} = useContext(LoginContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const Navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [matches,setmatches]=useState<Matched[]>([]);
  const [LOADING,setLOADING]=useState({
    matchesLoading :false,
    LogoutLoading:false,
  });


  const ID = user?._id;



const FetchMatches = useCallback( async()=>{
  if(ID){
  const Route = `https://love-spark.vercel.app/api/Matches/All/${ID}`;
  const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
  const {data} = await axios.get<any>(Route,config);
  setmatches(data.Matches);
  }
},[ID]);

  useEffect(()=>{
  FetchMatches()
 },[FetchMatches,ReFetchMatches]);




 
  
  const HandleDeleteMatches = async(id:string)=>{
    try {
      setLOADING({...LOADING,matchesLoading:true});
      const Route = `https://love-spark.vercel.app/api/Matches/Delete/${id}`
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      await axios.delete(Route,config);
      setLOADING({...LOADING,matchesLoading:false});
      FetchMatches();
      setReFetchUsers(true);
      setTimeout(() => {
        setReFetchUsers(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabChange = useCallback((tab:string, position:number) => {
    setActiveTab(tab);
    setIndicatorPosition(position);
  },[setActiveTab,setIndicatorPosition]);

  useEffect(()=>{
    if(ShowComponent==='Chat' || ChangeTab===true){
      setActiveTab('messages');
      handleTabChange('messages', 1.2)
    }else{
      handleTabChange('matches', 0)
    }
  },[ShowComponent,ChangeTab,handleTabChange,setActiveTab]);

  const HandleLogout = async()=>{
    if(user && !loading){
      setLOADING({...LOADING,LogoutLoading:true});
      setMainPageLoading(true);
      handleTabChange('matches', 0)
   const response = await dispatch(LogoutUser());
   const result = unwrapResult(response);
   if(result?.success){
    setLoggedOut(true);
    setLOADING({...LOADING,LogoutLoading:false});
    Navigate('/');  
    setShowComponent('Swipe');
   }
  }
  }

  return (
    <div className={`h-[525px] md:h-full ${ShowComponent==='Matches'?'w-[100%]':'w-[100%] md:w-[280px] lg:w-[392px]'} flex flex-col border-2 border-pink-500 fixed left-0 top-0 z-20`}>
      <div className={`${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':''} hidden  md:flex justify-between bg-gradient-to-r from-pink-500 to-rose-500 h-[90px] relative`}>
        <div className="flex justify-center items-center gap-5">
          {loading || LOADING.LogoutLoading?
          <Skeleton animation='wave' width={45} height={45} variant='circular' sx={{bgcolor:'pink'}} className='ml-5 mt-1'/>
          :
          <img
         onClick={()=>{
          setShowComponent('Profile')
          setMatchedId('');
          }}
            className="h-[45px] w-[45px] object-cover  ml-5 rounded-full cursor-pointer hover:border hover:border-pink-200"
            src={user?.ProfileUrl}
            alt="Date"
          />
        }
        {loading || LOADING.LogoutLoading?
        <Skeleton width={80} height={40} animation='wave' />
        :       
          <span onClick={()=>{
            setShowComponent('Profile')
            setMatchedId('');
            }} className='text-[rgba(255,255,255,0.8)] transition-all duration-200 hover:text-white font-bold cursor-pointer'>
              My Profile
            </span>
            }
         </div>
        <div className="flex justify-center gap-5 mr-5 items-center">
          {!LOADING.LogoutLoading?
          <IoMdSettings onClick={()=>setActiveTab('Settings')} size={25} className='text-white cursor-pointer' onMouseEnter={()=>setTooltip({...Tooltip,Settings:true})} onMouseLeave={()=>setTooltip({...Tooltip,Settings:false})}/>
        :
        null  
        }
          {loading?
         <Skeleton variant='rectangular'  animation='wave' height={30} width={25} />
         :
         <BiLogOut onClick={HandleLogout} onMouseEnter={()=>setTooltip({...Tooltip,Logout:true})} onMouseLeave={()=>setTooltip({...Tooltip,Logout:false})} size={30} className={`text-[rgba(255,255,255,0.7)] hover:text-white ${LOADING.LogoutLoading?'cursor-none':'cursor-pointer'}`}/>
        }
        <span className={`${Tooltip.Settings===true?'':'hidden'} absolute bottom-0 right-6 text-sm text-white`}>Account Settings</span>
        <span className={`${Tooltip.Logout===true && !LOADING.LogoutLoading?'':'hidden'} absolute bottom-1 right-2 text-sm text-white`}>Log Out</span>
                    <div className={`${LOADING.LogoutLoading?'':'hidden'} absolute top-0 right-3  text-white`}>
                   <svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                   </svg>
                     </div>
        </div>
      </div>

      <div className={`border md:border-none flex flex-col ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':''}`}>
        <div  className="relative h-16 shadow-md max-[320px]:gap-28 min-[351px]:gap-44 min-[401px]:gap-52 min-[466px]:gap-64  min-[520px]:gap-72 min-[571px]:gap-80 min-[620px]:gap-96 min-[680px]:gap-[450px] min-[680px]:pl-10 gap-32 flex md:gap-20 lg:gap-36 pt-5 min-[766px]:pl-5 pl-5 bg-gray-100 font-bold">
          {
            MainPageLoading?
            <Skeleton animation='wave' className='rounded-[5px]' variant='rectangular' width='100px' height='20px' />
            :
          <span
            className={`
            ${ShowReport.show && ShowReport.for==='Messages'?'b lur-sm cursor-none':'cursor-pointer'}
            ${
              activeTab === 'matches' ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={() =>{
              setChangeTab(false);
              if(ChangeTab===false){
               handleTabChange('matches', 0)}
            }
              }
          >
            Matches
          </span>
}
           {
            MainPageLoading?
            <Skeleton animation='wave' className='rounded-[5px]' variant='rectangular' width='100px' height='20px' />
            :
          <span
            className={`
            ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':'cursor-pointer'}
            ${
              activeTab === 'messages' ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('messages', 1.7)}
          >
            Messages
          </span>
           }
          <div
            className="absolute  bottom-0 left-3 h-1 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
            style={{ width: '30%', transform: `translateX(${indicatorPosition * 100}%)` }}
          />
          <div className={`${matches.length<1 || MainPageLoading?'hidden':''} flex justify-center text-white   h-7 w-7 rounded-full absolute left-24 top-3 bg-gradient-to-r from-pink-500 to-rose-500`}>
            <span className='mt-[2px]'>{matches.length}</span>
          </div>

          <div className={`flex ${unReadMessages>0 && !MainPageLoading?'':'hidden'} justify-center text-white   h-7 w-7 rounded-full absolute right-[120px] bg-gradient-to-r from-pink-500 to-rose-500 top-3`}>
            <span className='mt-[2px]'>{unReadMessages}</span>
          </div>
        </div>
      </div>
        
        {activeTab==='messages'?
        <Messages ShowReport={ShowReport} onlineUsers={onlineUsers} setShowReport={setShowReport}  unReadMessages={unReadMessages}/>
        :activeTab==='Settings'?
        <AccountSettings />
         :
        <Matches MainPageLoading={MainPageLoading} matches={matches} MatchLoading={LOADING.matchesLoading} HandleDelete={HandleDeleteMatches}/>
      }
           
    </div>
  );
};

export default LeftBar;
