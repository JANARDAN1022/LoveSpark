import {useContext, useState} from 'react';
import {TbSwipe} from 'react-icons/tb';
import {BiMessageDetail,BiLogOut} from 'react-icons/bi';
import {IoMdSettings} from 'react-icons/io';
import {AiOutlineHeart,AiTwotoneHeart} from 'react-icons/ai';
import { MainPageContext } from '../../../Context/MainPageContext';
import { useAppDispatch, useAppSelector } from '../../../Hooks';
import { LogoutUser } from '../../../Actions/userAction';
import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { LoginContext } from '../../../Context/LoginContext';

interface ResponsiveBarProps {
  setMainPageLoading:React.Dispatch<React.SetStateAction<boolean>>,
  MainPageLoading:boolean
}

const ResponsiveBar = ({setMainPageLoading,MainPageLoading}:ResponsiveBarProps) => {
  const {setActiveTab,setShowComponent,setMatchedId,ShowComponent} = useContext(MainPageContext);
  const {user,loading} = useAppSelector((state)=>state.user);
  const {setLoggedOut} = useContext(LoginContext);
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();

  const HandleLogout = async()=>{
    if(user && !loading){
      setMainPageLoading(true);
   const response = await dispatch(LogoutUser());
   const result = unwrapResult(response);
   if(result?.success){
    setLoggedOut(true);
    Navigate('/');  
    setShowComponent('Swipe');
   }
  }
  }

  return (
    <div className='flex justify-around items-center  h-[100%] w-[100%] bg-gradient-to-r from-pink-500 to-rose-500'>
     <TbSwipe onClick={()=>{
        setShowComponent('Swipe')
      }} size={30} className={`cursor-pointer ${ShowComponent==='Swipe'?'text-white':'text-[rgba(255,255,255,0.5)]'} transition-all ease-in-out hover:text-white`}/>  
     <img
         onClick={()=>{
          setShowComponent('Profile')
          setMatchedId('');
          }}
            className={`${ShowComponent==='Profile'?'border-2 border-white':''} h-[45px] w-[45px] object-cover  ml-5 rounded-full cursor-pointer hover:border hover:border-pink-200`}
            src={user?.ProfileUrl}
            alt="Date"
          />
          <div className='relative flex'>
     {
          ShowComponent==='Matches'?
         <AiTwotoneHeart size={30} className={`text-white`}/>
         :   
     <AiOutlineHeart size={30} onClick={()=>{
      setShowComponent('Matches')
    }} className={`z-20 ${ShowComponent==='Matches'?'text-white':'text-[rgba(255,255,255,0.5)]'} transition-all ease-in-out hover:text-white cursor-pointer`}/>
          }
    <BiMessageDetail size={30} onClick={()=>{
      setShowComponent('Matches');
      }} 
      className={`cursor-pointer absolute left-5 rotate-[30deg] top-1 ${ShowComponent==='Matches'?'text-white':'text-[rgba(255,255,255,0.5)]'} transition-all ease-in-out hover:text-white`}
      /> 
     
          </div>
     <IoMdSettings size={30} onClick={()=>{
      setShowComponent('Settings')
      }} className={`${ShowComponent==='Settings'?'text-white':'text-[rgba(255,255,255,0.5)]'}  transition-all ease-in-out hover:text-white cursor-pointer`}/>
     <BiLogOut onClick={HandleLogout} size={30} className={`text-[rgba(255,255,255,0.5)] transition-all ease-in-out hover:text-white cursor-pointer`}/>
    </div>
  )
}

export default ResponsiveBar