import React, { useState, useEffect, useRef, useMemo, useCallback,useContext } from 'react';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import { useAppSelector } from '../../Hooks';
import { User } from '../../Types/UserTypes';
import { MainPageContext } from '../../Context/MainPageContext';

const Swipe = () => {
  const { user } = useAppSelector((state) => state.user);
  const {setReFetchMatches,ReFetchUsers} = useContext(MainPageContext);
  const [users, setUsers] = useState<User[]>([]);
  //const [DATA,setDATA]=useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  const currentIndexRef = useRef<number>(currentIndex);
  const childRefs = useMemo<any>(() => Array(users.length).fill(0).map(() => React.createRef()), [users.length]);
  //const isRestoringCardRef = useRef<boolean>(false);



  const fetchAllUsers = useCallback(async () => {
    if (user?._id) {
      const route = `https://love-spark.vercel.app/api/Users/All/${user._id}`;
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };

      try {
        const { data } = await axios.get<any>(route, config);
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const AddSwipe = useCallback(
    async (ID: string, Dir: string) => {
      const Route = `https://love-spark.vercel.app/api/Swipe/AddSwipe`;
      const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
      try {
       await axios.post<any>(Route, { userId: user?._id, SwipedId: ID, direction: Dir }, config);
       setReFetchMatches(true);
       setTimeout(() => {
        setReFetchMatches(false);
       }, 1000);
      } catch (error) {
        console.log(error);
      }
    },[user,setReFetchMatches]);
  

  useEffect(() => {
    fetchAllUsers();
    const body = document.body;
    body.style.overflow = 'hidden';
  }, [fetchAllUsers,ReFetchUsers]);

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

  return (
    <div className='SwipeCard flex justify-center h-[743px] w-[1140.5px] bg-gradient-to-r from-pink-500 to-rose-500 hide-scrollbar'>
      <div className='swiper-container flex flex-col justify-center'>
        <div className='cardContainer'>
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
                <div style={{ backgroundImage: `url(${character.CoverUrl})` }} className='card relative flex'>
                  <div className='flex flex-col self-end gap-5 cursor-default'>
                    <div className='flex gap-5 items-center'>
                      <span className='text-white text-4xl ml-5'>{character.FirstName}</span>
                      <span className='text-white text-xl mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-[35px] flex justify-center h-[35px]'>
                        {character.age}
                      </span>
                      <span className='text-white text-lg mt-2 items-center bg-gradient-to-r from-pink-500 to-rose-500 rounded-full w-max p-1 pl-2 pr-2 flex justify-center h-[35px]'>
                        {character.occupation}
                      </span>
                    </div>
                    <div className='flex gap-2 items-center flex-wrap ml-5'>
                      {character.interests.map((Interest) => (
                        <span
                          key={Interest}
                          className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white text-base p-1 rounded-[5px]`}
                        >
                          {Interest}
                        </span>
                      ))}
                    </div>
                    <span className={`text-base font-bold p-2 text-white bg-[rgba(236,72,153,0.2)] rounded-bl-[18px] rounded-br-[18px] `}>{character.bio}</span>
                  </div>
                </div>
              </TinderCard>
            ))}
        </div>
        <div className='p-2'>
          {lastDirection ? (
            <h2 className='infoText text-white text-center text-xl'>
              You swiped {lastDirection}
            </h2>
          ) : (
            <h2 className='infoText text-white text-center text-xl'>Swipe Left Or Right</h2>
          )}
        </div>
        <div className='flex justify-center text-pink-400 gap-10 mt-2'>
          <button
            className='bg-white w-[100px] h-[30px] rounded-[5px]'
            onClick={() => swipe('left')}
            disabled={!canSwipe}
          >
            Left
          </button>
          <button
            className='bg-white w-[200px] h-[30px] rounded-[5px]'
            onClick={goBack}
            disabled={!canGoBack}
          >
            Undo Last Swipe
          </button>
          <button
            className='bg-white w-[100px] h-[30px] rounded-[5px]'
            onClick={() => swipe('right')}
            disabled={!canSwipe}
          >
            Right
          </button>
        </div>
      </div>
    </div>
  );
};

export default Swipe;
