import { useState,useContext,useCallback,useEffect } from 'react';
import Matches from './Matches';
import Messages from "../Layouts/Messages";
import { MainPageContext } from '../../Context/MainPageContext';
import {IoMdSettings} from 'react-icons/io';
import {BiLogOut} from 'react-icons/bi';
import AccountSettings from './AccountSettings';
import { useAppSelector,useAppDispatch } from '../../Hooks';
import { LogoutUser} from '../../Actions/userAction';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';



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
  }]
}

const LeftBar = ({unReadMessages,setunReadMessages,onlineUsers}:LeftBarProps) => {
  const [activeTab, setActiveTab] = useState('matches');
  const [Tooltip,setTooltip]=useState({
    Settings:false,
    Logout: false
  });
  const [ShowReport,setShowReport]=useState({
    show: false,
    for:'Messages'
  });
  const [indicatorPosition, setIndicatorPosition] = useState(0);
  const {setShowComponent,ShowComponent,ChangeTab,setChangeTab,setMatchedId,ReFetchMatches,setReFetchUsers} = useContext(MainPageContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const Navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [matches,setmatches]=useState<Matched[]>([]);


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

 console.log(matches);


  const HandleLogout = async()=>{
    if(user && !loading){
   const response = await dispatch(LogoutUser());
   const result = unwrapResult(response);
   if(result?.success){
    Navigate('/');  
    setShowComponent('Swipe');
   }
  }
  }
  
  const HandleDeleteMatches = async(id:string)=>{
    try {
      const Route = `https://love-spark.vercel.app/api/Matches/Delete/${id}`
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      await axios.delete(Route,config);
      FetchMatches();
      setReFetchUsers(true);
      setTimeout(() => {
        setReFetchUsers(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  const handleTabChange = (tab:string, position:number) => {
    setActiveTab(tab);
    setIndicatorPosition(position);
  };

  useEffect(()=>{
    if(ShowComponent==='Chat' || ChangeTab===true){
      setActiveTab('messages');
      handleTabChange('messages', 1.2)
    }else{
      handleTabChange('matches', 0)
    }
  },[ShowComponent,ChangeTab]);

 

  return (
    <div className="h-full  md:w-[280px] lg:w-[392px] flex flex-col border-2 border-pink-500 fixed left-0 top-0 z-20">
      <div className={`${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':''} flex justify-between bg-gradient-to-r from-pink-500 to-rose-500 h-[90px] relative`}>
        <div className="flex justify-center items-center gap-5">
          <img
         onClick={()=>{
          setShowComponent('Profile')
          setMatchedId('');
          }}
            className="h-[45px] w-[45px]  ml-5 rounded-full cursor-pointer hover:border hover:border-pink-200"
            src={user?.ProfileUrl}
            alt="Date"
          />
          <span onClick={()=>{
            setShowComponent('Profile')
            setMatchedId('');
            }} className='text-[rgba(255,255,255,0.8)] transition-all duration-200 hover:text-white font-bold cursor-pointer'>My Profile</span>
        </div>
        <div className="flex justify-center gap-5 mr-5 items-center">
          <IoMdSettings onClick={()=>setActiveTab('Settings')} size={25} className='text-white cursor-pointer' onMouseEnter={()=>setTooltip({...Tooltip,Settings:true})} onMouseLeave={()=>setTooltip({...Tooltip,Settings:false})}/>
         <BiLogOut onClick={HandleLogout} onMouseEnter={()=>setTooltip({...Tooltip,Logout:true})} onMouseLeave={()=>setTooltip({...Tooltip,Logout:false})} size={30} className='text-[rgba(255,255,255,0.7)] hover:text-white cursor-pointer'/>
        <span className={`${Tooltip.Settings===true?'':'hidden'} absolute bottom-0 right-6 text-sm text-white`}>Account Settings</span>
        <span className={`${Tooltip.Logout===true?'':'hidden'} absolute bottom-1 right-2 text-sm text-white`}>Log Out</span>
        </div>
      </div>

      <div className={`flex flex-col ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':''}`}>
        <div  className="relative h-16 shadow-md flex gap-20 pt-5 pl-5 bg-gray-100 font-bold">
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
          <span
            className={`
            ${ShowReport.show && ShowReport.for==='Messages'?'blur-sm cursor-none':'cursor-pointer'}
            ${
              activeTab === 'messages' ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={() => handleTabChange('messages', 1.2)}
          >
            Messages
          </span>
          <div
            className="absolute  bottom-0 left-3 h-1 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300"
            style={{ width: '30%', transform: `translateX(${indicatorPosition * 100}%)` }}
          />
          <div className={`${matches.length<1?'hidden':''} flex justify-center text-white   h-7 w-7 rounded-full absolute left-24 top-3 bg-gradient-to-r from-pink-500 to-rose-500`}>
            <span className='mt-[2px]'>{matches.length}</span>
          </div>

          <div className={`flex ${unReadMessages>0?'':'hidden'} justify-center text-white   h-7 w-7 rounded-full absolute right-[120px] bg-gradient-to-r from-pink-500 to-rose-500 top-3`}>
            <span className='mt-[2px]'>{unReadMessages}</span>
          </div>
        </div>
      </div>
        
        {activeTab==='messages'?
        <Messages ShowReport={ShowReport} onlineUsers={onlineUsers} setShowReport={setShowReport}  unReadMessages={unReadMessages}/>
        :activeTab==='Settings'?
        <AccountSettings />
         :
        <Matches matches={matches} HandleDelete={HandleDeleteMatches}/>
      }
           
    </div>
  );
};

export default LeftBar;
