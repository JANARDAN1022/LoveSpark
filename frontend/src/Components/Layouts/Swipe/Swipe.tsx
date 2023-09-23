import React, { useState, useEffect, useRef, useMemo, useCallback,useContext } from 'react';
import TinderCard from '../../TinderCard/TinderCard';
import axios from 'axios';
import { useAppSelector } from '../../../Hooks';
import { User } from '../../../Types/UserTypes';
import { MainPageContext } from '../../../Context/MainPageContext';
import { motion } from 'framer-motion';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import {GiCancel} from 'react-icons/gi';
import {FaUndo} from 'react-icons/fa';
import {BsCheckCircle} from 'react-icons/bs';
import {MdSwipeLeft,MdSwipeRight} from 'react-icons/md';

const Swipe = () => {
  const { user,loading } = useAppSelector((state) => state.user);
  const {setReFetchMatches,ReFetchUsers,ShowComponent} = useContext(MainPageContext);
  const [users, setUsers] = useState<User[]>([]);
  const [LoadingCards,setLoadingCards]=useState(false);
  const [LoadingSwipe,setLoadingSwipe]=useState(false);
  const [SwipeLoading,setSwipeLoading]=useState(true);
  const [SwipeAnimation,setSwipeAnimation]=useState(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef<number>(currentIndex);
  const childRefs = useMemo<any>(() => Array(users.length).fill(0).map(() => React.createRef()), [users.length]);
  


  const fetchAllUsers = useCallback(async () => {
    if (user?._id) {
      const route = `https://love-spark.vercel.app/api/Users/All/${user._id}`;
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };

      try {
        setLoadingCards(true);
        const { data } = await axios.get<any>(route, config);
        setUsers(data.users);
        setLoadingCards(false);
      } catch (error) {
        console.log(error);
        setLoadingCards(false);
      }
    }
  }, [user]);

  const AddSwipe = useCallback(
    async (ID: string, Dir: string) => {
      const Route = `https://love-spark.vercel.app/api/Swipe/AddSwipe`;
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      try {
        setLoadingSwipe(true);
       await axios.post<any>(Route, { userId: user?._id, SwipedId: ID, direction: Dir }, config);
       setReFetchMatches(true);
       setTimeout(() => {
        setReFetchMatches(false);
       }, 1000);
       setLoadingSwipe(false);
      } catch (error) {
        console.log(error);
        setLoadingSwipe(false);
      }
    },[user,setReFetchMatches]);
  

  useEffect(() => {
    fetchAllUsers();
    if(ShowComponent==='Swipe'){
    const body = document.body;
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'hidden';
    }
  }, [fetchAllUsers,ReFetchUsers,ShowComponent]);


  useEffect(() => {
    if (users.length > 0) {
      setCurrentIndex(users.length - 1);
      currentIndexRef.current = users.length - 1;
    }
  }, [users]);

  const updateCurrentIndex = (val: number) => {
    currentIndexRef.current = val;
    setCurrentIndex(val);
  };

  const canGoBack = currentIndexRef.current < users.length - 1;
  const canSwipe = currentIndexRef.current >= 0;
  const debounce = <T extends any[]>(func: (...args: T) => void, delay: number) => {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: T) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), delay);
    };
  };
  
  
  const outOfFrame = useMemo(
    ()=>
    debounce((name: string, dir?: string, index?: number) => {
      if (dir && index !== undefined) {
        // Handle the swipe event only if it's the current card being swiped
        AddSwipe(users[index]._id, dir);
        console.log(name + `${dir}`);
      }
    }, 300), // Adjust the delay (in milliseconds) as per your requirement
    [users, AddSwipe]
  );
  
  
  


  const swiped = (nameToDelete: string, index: number, direction: string) => {
    setLastDirection(direction);
    // Update the current index with the current swiped card's index
    updateCurrentIndex(index - 1);
    // Call the outOfFrame function here and pass the required parameters
    outOfFrame(nameToDelete, direction, index);
  };
  
  

 

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndexRef.current >= 0 && currentIndexRef.current < users.length) {
      const swipedUser = users[currentIndexRef.current]._id; // Get the user ID of the current card 
      await childRefs[currentIndexRef.current].current.swipe(dir);
      AddSwipe(swipedUser,dir);
    }
  };

  const goBack = async () => {
    if (canGoBack) {
      const newIndex = currentIndexRef.current + 1;
      updateCurrentIndex(newIndex);
      await childRefs[newIndex]?.current?.restoreCard();
    }
  };

  useEffect(() => {
    const backgroundUrl = users.map((user)=>user.CoverUrl);
    const tempImage = new Image();
  
    tempImage.onload = () => {
      setSwipeLoading(false);
    };
  
    tempImage.src = backgroundUrl[0];
  }, [users]);

  const HandlePayment = async()=>{
    if(user?.role!=='Premium'){
    try {
     setLoadingSwipe(true);
      const Route = `https://love-spark.vercel.app/create-checkout-session`
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      const {data} =  await axios.post(Route,config);
      window.location = data.url
      setLoadingSwipe(false);
    } catch (error) {
      console.log(error);
      setLoadingSwipe(false);
    }
  }else{
    return;
  }
  }

  return (
    <div className='SwipeCard flex justify-center h-[100%] relative  bg-gradient-to-r from-pink-500 to-rose-500 '>
      <div className=' flex flex-col justify-center gap-5 relative'>
        {loading || LoadingCards || SwipeLoading?
        <Skeleton animation='wave' variant='rectangular'  height={500}  className='w-[350px] md:ml-36 rounded-[10px]'/>
        :
        <div className='select-none CARD-DIV flex justify-center min-[1441px]:w-[400px] min-[1441px]:h-[600px]  w-[98vw] sm:w-[350px] h-[500px] md:ml-2 sm:mr-20 md:mr-0'>
          {users.length > 0 &&
            users.map((character, index) => (
              <TinderCard
                ref={childRefs[index]}
                className='swipe'
                key={character._id}
                onSwipe={(dir) => swiped(character.FirstName,index,dir)}
                onCardLeftScreen={() => outOfFrame(character.FirstName,lastDirection,index)}
                preventSwipe={['down', 'up']}
              >
                <div style={{ backgroundImage: `url(${character.CoverUrl})` }} className='card  relative flex min-[1441px]:w-[400px] min-[1441px]:h-[600px] sm:w-[350px] w-auto h-[500px] sm:ml-20'>
                  <div className='flex flex-col self-end gap-5 cursor-default'>
                    <div className='flex gap-5 items-center'>
                      <span className='text-white md:text-xl lg:text-2xl ml-5 '>{character.FirstName}</span>
                      <span className='text-white md:text-base lg:text-lg mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-[35px] flex justify-center h-[35px]'>
                        {character.age}
                      </span>
                      <span className='text-white  md:text-sm lg:text-base mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-max p-1 pl-2 pr-2 flex justify-center h-[35px]'>
                        {character.occupation}
                      </span>
                    </div>
                    <div className='flex gap-2 items-center flex-wrap ml-5'>
                      {character.interests.map((Interest) => (
                        <span
                          key={Interest}
                          className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white md:text-xs lg:text-sm p-1 rounded-[5px]`}
                        >
                          {Interest}
                        </span>
                      ))}
                    </div>
                    <span className={`text-xs lg:text-sm font-bold p-2 text-white bg-[rgba(236,72,153,0.2)] min-[1441px]:w-[400px]  w-[100vw] sm:w-[350px]  rounded-bl-[18px] rounded-br-[18px] `}>{character.bio}</span>
                  </div>
                </div>
              </TinderCard>
            ))}
        </div>
        }
        <div className={`${loading || LoadingCards || SwipeLoading?'hidden':''}  flex CardButtons absolute min-[1441px]:left-0  min-[768px]:top-28 min-[1441px]:top-16 min-[1441px]:gap-[100px]  top-4 left-10 sm:left-[45px] md:left-[-20px]   justify-center gap-[200px] sm:gap-[92px] text-pink-400  items-center mt-2 md:ml-20`}>
         <GiCancel 
            className={`${loading || LoadingCards || SwipeLoading || LoadingSwipe?'cursor-none':'cursor-pointer hover:text-red-600'} w-14 h-14  text-red-400`}
            onClick={() => 
              {
                if(!loading && !LoadingCards && !SwipeLoading && !LoadingSwipe){
                  swipe('left')
                }
              }
            }
          />
          <FaUndo
          className={`${loading || LoadingCards || SwipeLoading || LoadingSwipe?'cursor-none':'hover:text-yellow-400 cursor-pointer'} w-10 h-10 text-yellow-500 `} 
          onClick={()=>{
            if(!loading && !LoadingCards && !SwipeLoading && !LoadingSwipe){  
              if(user?.role==='Premium'){
              goBack();
              }else{
                HandlePayment();
              }
          }
        }
      }
          />
         <BsCheckCircle
         className={`${loading || LoadingCards || SwipeLoading || LoadingSwipe?'cursor-none':'hover:text-blue-600 cursor-pointer'} w-12 h-12 text-blue-400`}  
         onClick={() => {
         if(!loading && !LoadingCards && !SwipeLoading && !LoadingSwipe){
          swipe('right')
         }
        }}
          />
     </div>
      </div>
      <motion.div onAnimationComplete={()=>setSwipeAnimation(false)}  animate={{x:[-10,0,-10,0]}} transition={{duration:1.5,repeat:1,ease:'easeInOut'}} className={`absolute left-[20%] top-[40%] ${!SwipeAnimation || loading || LoadingCards?'hidden':''}`}>
        <MdSwipeLeft  className='h-20 w-20 text-white'/>
       <span className='text-white text-2xl opacity-[0.6]'>Swipe Left</span>
       </motion.div>
       <motion.div  onAnimationComplete={()=>setSwipeAnimation(false)} animate={{x:[10,0,10,0]}}  transition={{duration:1.5,repeat:1,ease:'easeInOut'}} className={`absolute right-[10%] top-[40%] ${!SwipeAnimation || loading || LoadingCards?'hidden':''}`}> 
        <MdSwipeRight  className='h-20 w-20 text-white'/>
        <span className='text-white text-2xl opacity-[0.6]'>Swipe Right</span>
      </motion.div>
    </div>
  );
};

export default Swipe;
