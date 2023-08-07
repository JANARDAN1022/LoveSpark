import {useContext} from 'react';
import { MainPageContext } from '../../Context/MainPageContext';

const AccountSettings = () => {
  const {setShowComponent} = useContext(MainPageContext);
  return (
    <div className='flex flex-col bg-gray-200  w-full h-full  overflow-scroll overflow-x-hidden scrollbar'>
      <div className='flex flex-col gap-10  justify-center items-center bg-gray-200 h-[300px]'>
      <div className='border gap-2 p-5 cursor-pointer shadow-md shadow-yellow-500 mt-2 flex flex-col justify-center items-center w-[330px]   rounded-[5px] bg-white'>
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
      </div>
      <div className='flex flex-col bg-white'>
        <div className='bg-gray-200'>
          <span className='ml-5'>Account Settings</span>
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
      <div className='flex justify-center text-red-500 cursor-pointer border-b border-[rgba(0,0,0,0.5)]  hover:bg-gray-200 p-5'>
        <span>Delete Your Account</span>
      </div>
      </div>
   
    </div>
  )
}

export default AccountSettings;