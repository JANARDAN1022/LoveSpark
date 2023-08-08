import {useContext, useState,useEffect, useCallback,useRef} from 'react'
import { MainPageContext } from '../../Context/MainPageContext'
import {RxCross1} from 'react-icons/rx';
import {MdReportProblem} from 'react-icons/md';
import { useAppSelector } from '../../Hooks';
import axios from 'axios';
import { User } from '../../Types/UserTypes';

interface Data {
  Success:boolean,
  user:User
}

const Profile = () => {
    const {setShowComponent,MatchedId,setMatchedId,ShowComponent} = useContext(MainPageContext);
    const [Tooltip,setTooltip]=useState({
      Swipe:false,
      Report:false
    });
    const {user} = useAppSelector((state)=>state.user);
    const [MatchedUser,setMatchedUser]=useState<User | null>(null);
    const [ShowReport,setShowReport]=useState(false);
    const [Reason,setReason]=useState('');
    const TextRef = useRef<HTMLTextAreaElement>(null);
    const Bio = user?.bio;
    const coverUrl = user?.CoverUrl;

    const FetchMatchedUser = useCallback(async()=>{
      if(MatchedId!==''){
      try {
        const Route = `https://love-spark.vercel.app/api/Users/${MatchedId}`;
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const {data} = await axios.get<Data>(Route,config);
        setMatchedUser(data.user);
      } catch (error) {
       console.log(error); 
      }
    }
  },[MatchedId]);

useEffect(()=>{
  if(MatchedId!==''){
    FetchMatchedUser();
  }else{
    setMatchedUser(null);
  }
},[FetchMatchedUser,MatchedUser,MatchedId]);

const HandleReportSubmit = async(ID:string)=>{
  if(ID){
    if(Reason!==''){
      try {
        const Route = `https://love-spark.vercel.app/api/Reports/AddReport`;
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const {data} =  await  axios.post(Route,{UserID:user?._id,ReportedUserID:ID,Reason:Reason},config);     
       if(data){       
        setShowReport(false); 
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

useEffect(()=>{
  if(ShowComponent!=='Profile'){
setShowReport(false);
  }
},[ShowComponent]);

useEffect(()=>{
  if(ShowReport){
    if(TextRef.current){
      TextRef.current.focus();
    }
  }
},[ShowReport]);

    
  return (
   MatchedId!=='' && MatchedUser!==null?
   <div  className={`flex justify-center items-center relative w-[1140.5px] h-[742px] bg-pink-600`}>
    <div  className={`absolute z-20 justify-center items-center gap-5 right-0 left-0 m-auto flex flex-col bg-white ${ShowReport?'':'hidden'} w-[400px] h-[300px] rounded-[10px]`}>
    <RxCross1 className='text-pink-500  cursor-pointer ml-[88%]' size={25} onClick={()=>{
      setShowReport(false)
      setReason('');
      }} />
    <div className='flex flex-col gap-2'>
    <div className='flex flex-col gap-1 justify-center items-center'>
     <span className='text-pink-500 font-bold'>Reason For Reporting :</span>
     <span className='text-pink-500 text-sm'>(Brief Detail)</span>
    </div>
    <textarea value={Reason} onChange={(e)=>setReason(e.target.value)} ref={TextRef} className='pl-3 text-white border-2 border-pink-800 bg-pink-400 w-[300px] h-[100px] rounded-[5px]' />
    </div>
    <button onClick={()=>HandleReportSubmit(MatchedUser._id)} className='bg-pink-500 rounded-[10px] cursor-pointer w-[150px] h-[30px] flex justify-center items-center text-white'>Report {MatchedUser.FirstName}</button>
    </div>
    <RxCross1 onMouseEnter={()=>setTooltip({...Tooltip,Swipe:true})} onMouseLeave={()=>setTooltip({...Tooltip,Swipe:false})} className={`${ShowReport?'blur-sm':''} text-white absolute top-10 cursor-pointer right-[25%]`} size={40} onClick={()=>{setShowComponent('Swipe'); setMatchedId(''); setMatchedUser(null);}} />
    <span className={`${Tooltip.Swipe===true?'':'hidden'} text-base absolute right-[14%] top-12 text-white`} >Go Back Swiping</span>
    <div style={{ backgroundImage:`url(${MatchedUser.CoverUrl})`}} className={`${ShowReport?'blur-sm':''} Profile flex  relative h-[600px] w-[450px] rounded-[5px] shadow-2xl border border-white`}>
    <MdReportProblem onClick={()=>setShowReport(true)} size={38} onMouseEnter={()=>setTooltip({...Tooltip,Report:true})} onMouseLeave={()=>setTooltip({...Tooltip,Report:false})} className='absolute right-5 top-5 text-[rgba(255,255,255,0.8)] hover:text-white transition-all duration-100 ease-in-out  cursor-pointer'/>
     <span className={`text-white ${Tooltip.Report?'':'hidden'} absolute right-16 top-5`}>Report {MatchedUser.FirstName}</span>
     <div className='flex flex-col self-end  gap-5  cursor-default'>
      <div className='flex gap-5 items-center'>
      <span className='text-white text-4xl ml-5'>{MatchedUser?.FirstName}</span>
      <span className='text-white text-xl mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-[35px] flex justify-center h-[35px]'>{MatchedUser?.age}</span>
      <span className='text-white text-lg mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-max p-1 pl-2 pr-2 flex justify-center h-[35px]'>{MatchedUser?.occupation}</span>
      </div>
      <div className='flex gap-2 items-center flex-wrap ml-5'>
        {MatchedUser?.interests.map((Interest)=>(
          <span key={Interest} className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base p-1 rounded-[5px]`}>{Interest}</span>
        ))
        }
        </div>
      <span className={` text-base font-bold p-2 text-white bg-[rgba(236,72,153,0.1)]`}>{MatchedUser.bio}</span>
   </div>
    </div>
    </div>
   :
    <div  className={`flex justify-center items-center relative w-[1140.5px] h-[742px] bg-pink-600`}>
    <RxCross1 onMouseEnter={()=>setTooltip({...Tooltip,Swipe:true})} onMouseLeave={()=>setTooltip({...Tooltip,Swipe:false})} className='text-white absolute top-10 cursor-pointer right-[25%]' size={40} onClick={()=>setShowComponent('Swipe')} />
    <span className={`${Tooltip.Swipe===true?'':'hidden'} text-base absolute right-[14%] top-12 text-white`} >Go Back Swiping</span>
    <div style={{ backgroundImage:`url(${coverUrl})`}} className='Profile flex  relative h-[600px] w-[450px] rounded-[5px] shadow-2xl border border-white'>
       <span onClick={()=>setShowComponent('EditInfo')} className='absolute text-[rgba(255,255,255,0.7)] right-5 top-3 hover:text-white text-xl cursor-pointer'>Edit</span>
     
     <div className='flex flex-col self-end  gap-5  cursor-default'>
      <div className='flex gap-5 items-center'>
      <span className='text-white text-4xl ml-5'>{user?.FirstName}</span>
      <span className='text-white text-xl mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-[35px] flex justify-center h-[35px]'>{user?.age}</span>
      <span className='text-white text-lg mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-max p-1 pl-2 pr-2 flex justify-center h-[35px]'>{user?.occupation}</span>
      </div>
      <div className='flex gap-2 items-center flex-wrap ml-5'>
        {user?.interests.map((Interest)=>(
          <span className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base p-1 rounded-[5px]`}>{Interest}</span>
        ))
        }
        </div>
      <span className={` text-base font-bold p-2 text-white bg-[rgba(236,72,153,0.1)]`}>{Bio}</span>
   </div>
    </div>
    </div>
  )
}

export default Profile