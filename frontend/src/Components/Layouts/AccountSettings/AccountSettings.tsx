import {useContext, useState} from 'react';
import { MainPageContext } from '../../../Context/MainPageContext';
import axios from 'axios';
import { useAppSelector } from '../../../Hooks';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../../Context/LoginContext';

const AccountSettings = () => {
  const {setShowComponent} = useContext(MainPageContext);
  const {user} = useAppSelector((state)=>state.user);
  const {setLoggedOut} = useContext(LoginContext);
  const Navigate = useNavigate();
  const [ShowLoading,setShowLoading]=useState({
    Stripe:false,
    Delete:false
  });

  const HandlePayment = async()=>{
    if(user?.role!=='Premium'){
    try {
      setShowLoading({Stripe:true,Delete:false});
      const Route = `https://love-spark.vercel.app/create-checkout-session`
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const {data} =  await axios.post(Route,config);
      window.location = data.url
      setShowLoading({Stripe:false,Delete:false});
    } catch (error) {
      console.log(error);
      setShowLoading({Stripe:false,Delete:false});
    }
  }else{
    return;
  }
  }

const HandleDeleteAccount = async()=>{
  try {
    setShowLoading({Stripe:false,Delete:true});
    setLoggedOut(true);
   const Route = `https://love-spark.vercel.app/api/Users/${user?._id}`;
   const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
    await axios.delete(Route,config);
    setShowLoading({Stripe:false,Delete:false});
    Navigate('/');
  } catch (error) {
    console.log(error);
    setShowLoading({Stripe:false,Delete:false});
  }
}

  return (
    <div className='flex flex-col bg-gray-200  w-full h-full  overflow-scroll overflow-x-hidden scrollbar'>
      


      <div className={`${user?.role==='user'?'':'hidden'} flex flex-col gap-10 relative justify-center items-center bg-gray-200 h-[300px]`}>
      <div onClick={HandlePayment} className='border gap-2 p-5 cursor-pointer shadow-md shadow-yellow-500 mt-2 flex flex-col justify-center items-center w-[330px]   rounded-[5px] bg-white'>
      <div className='flex gap-2 items-center text-yellow-500 font-bold'>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-8 h-8 text-white p-2 bg-yellow-500 rounded-full" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span>LoveSpark</span>
      <span className='text-white bg-yellow-500 p-1 font-semibold text-sm rounded-[5px]'>Premium</span>
      </div>
      <div className='flex  text-yellow-500 font-bold'>
      <span className='text-xs'>(Buy Premium To Use Premium Features)</span>
      </div>
      </div>
      <div  data-testid="loading-stripe" className={`${ShowLoading.Stripe?'':'hidden'} absolute right-5`}>
    <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
</div>
      </div>
      <div className='flex flex-col bg-white'>
        <div className='bg-gray-200'>
          <span className={`${user?.role==='user'?'':'hidden'}  ml-5`}>Account Settings</span>
        </div>
        <div onClick={()=>setShowComponent('EditInfo')} className='flex justify-center text-pink-600  cursor-pointer border-b  border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span onClick={()=>setShowComponent('EditInfo')}>Edit Your Profile</span>
      </div>
      <div className='flex justify-center text-pink-600 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Privacy Settings</span>
      </div>
       <div className='flex justify-center text-pink-600 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Location Settings</span>
      </div>
      <div className='flex justify-center text-pink-600 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Discovery Preferences</span>
      </div>
      <div className='flex justify-center text-pink-600 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Notification Settings</span>
      </div>
      <div onClick={HandleDeleteAccount} className='flex relative justify-center text-red-500 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Delete Your Account</span>
        <div data-testid="loading-DeleteAccount" className={`${ShowLoading.Delete?'':'hidden'} absolute text-pink-500 w-[372px] animate-pulse bottom-0 left-0 bg-red-500 h-1 rounded-[8px]`}></div>
      </div>
      </div>
   
    </div>
  )
}

export default AccountSettings;