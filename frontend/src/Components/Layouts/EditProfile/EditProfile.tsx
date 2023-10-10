import{useContext,useState,useRef,useEffect} from 'react'
import {RxCross1} from 'react-icons/rx';
import { MainPageContext } from '../../../Context/MainPageContext';
import Slider from '../imgSlider/ImgSlider';
import {BiSolidEdit} from 'react-icons/bi';
import {Country} from 'country-state-city';
import { useAppSelector } from '../../../Hooks';
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { storage } from "../../../firebase";
//import {v4} from 'uuid';
import { useAppDispatch } from '../../../Hooks';
//import { useNavigate } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { UpdateUser } from '../../../Actions/userAction';

const EditProfile = () => {
    const [ProfilePic, setProfilePic] = useState<any | null>(null);
    const [CoverPic, setCoverPic] = useState<any | null>(null);
    const {setShowComponent} = useContext(MainPageContext);
    const {user} = useAppSelector((state)=>state.user);
   const INTERESTS = user?.interests?user?.interests:[];
    const [Interests,setInterests]=useState<string[]>(INTERESTS);
    const [Error,setError]=useState('');
    const [LOADING,setLOADING]=useState(false);
    const [email,setemail]=useState(user?.email);
    const [PersonalInfo, setPersonalInfo] = useState({
      FirstName: user?.FirstName,
      LastName: user?.LastName,
      bio: user?.bio,
      Location: [
        {
          country: user?.Location[0].country,
          State: user?.Location[0].State,
          city: user?.Location[0].city,
        },
      ],
      pincode: user?.pincode,
      Gender: user?.Gender,
      sexuality: user?.sexuality,
      occupation: user?.occupation,
      age:user?.age,
    });
    const [Tooltip,setTooltip]=useState({
    Edit:false,
    Cancel:false,
    DP:false,
   });
  const MaleRef = useRef<HTMLInputElement>(null);
  const FemaleRef = useRef<HTMLInputElement>(null);
  const ProfileFileInputRef = useRef<HTMLInputElement>(null);
  const CoverFileInputRef = useRef<HTMLInputElement>(null);
  const location = user?.Location;
  const country = location?.map((L)=>L.country)[0];
  const state = location?.map((L)=>L.State)[0];
  const city = location?.map((L)=>L.city)[0];
  const dispatch = useAppDispatch();
 // const Navigate = useNavigate();
  const Id = user?._id;
 
   const HandleMaleGender = ()=>{
     if(FemaleRef.current!==null){
       FemaleRef.current.checked=false;
     }
     setPersonalInfo({...PersonalInfo,Gender:'Male'});
   };
 
   const HandleFemaleGender =()=>{
     if(MaleRef.current!==null){
       MaleRef.current.checked=false;
       setPersonalInfo({...PersonalInfo,Gender:'Female'})
       }
      };
 
   const HandleCustomGender = (e:any)=>{
     if(MaleRef.current!==null){
     MaleRef.current.checked=false;
     }
      if( FemaleRef.current!==null){
       FemaleRef.current.checked=false;
     }
     if(e.target.value.length>=1){
     setPersonalInfo({...PersonalInfo,Gender:e.target.value})
     }else{
      setPersonalInfo({...PersonalInfo,Gender:user?.Gender}) 
     }
   };

   const HandleProfileEdit = ()=>{
    if(ProfileFileInputRef.current){
      ProfileFileInputRef.current.click();
    }
   }
const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
     setProfilePic(file);
  };
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
setCoverPic(file);
  };


   const HandleCoverEdit = ()=>{
    if(CoverFileInputRef.current){
      CoverFileInputRef.current.click();
    }
   }
 
   const HandleInterests = (Interest:string)=>{
     if(Interests.includes(Interest)){
       setInterests(Interests.filter((INT)=>INT!== Interest));
     }else if(Interests.length===4){
       setInterests([...Interests]);
     }else{
       setInterests([...Interests,Interest]);
     }
   }
 
   const HandleSave = async(e:any)=>{
     e.preventDefault();
     const isEmpty = Object.values(PersonalInfo).some((value)=>value!=='');
     // Check if the values in the array have changed
const interestsChanged = Interests.some((interest, index) => interest !== Interests[index]);
const InterestlengthChange = Interests.length!==user?.interests.length;

     if(isEmpty || ProfilePic!==null || CoverPic!==null || interestsChanged || InterestlengthChange){
      try {
        setLOADING(true);
  
  let profileUrl = user?.ProfileUrl; // Keep the current profile URL if not uploading
  let coverUrl = user?.CoverUrl; // Keep the current cover URL if not uploading
  
  if (ProfilePic) {
    const profileRef = ref(storage, `ProfilePics/${ProfilePic.name + user?._id + user?.FirstName}`);
    const [profileSnapshot] =  await Promise.all([uploadBytes(profileRef, ProfilePic)]);
    profileUrl = profileSnapshot ? await getDownloadURL(profileSnapshot.ref) : '';
           
  }
  
  if (CoverPic) {
    const coverRef = ref(storage, `CoverPics/${CoverPic.name + user?._id + `123#` + user?.FirstName}`);
    const [coverSnapshot] = await Promise.all([uploadBytes(coverRef, CoverPic)]);
    coverUrl = coverSnapshot? await getDownloadURL(coverSnapshot.ref):'';
  }

  // Update the User object with the correct ProfileUrl and CoverUrl
  const updatedUser = {
    ...PersonalInfo,
    interests:Interests,
    ProfileUrl: profileUrl,
    CoverUrl: coverUrl,
    email
  };
  if(Id){
        // Dispatch the updated User object to update the user's profile in the database
        const response = await dispatch(UpdateUser({ id: Id, data: updatedUser }));
        const result = unwrapResult(response); // Unwrap the result to get the action payload
  
        if (result?.success) {
          setLOADING(false);
          window.scrollTo({top:0,behavior:'smooth'});
        }else{
          setLOADING(false);
          setError('Save Failed Try Again');
        }
      }
      }catch(error){
        console.log(error);
      }
     }else{
      setError('Please Update Atleast one Field');
      setTimeout(() => {
        setError('');
      }, 3000);
     }
   }

   useEffect(()=>{
    if(LOADING){
     const body = document.body;
     body.style.overflow = 'hidden';
    }
     },[LOADING]);
  
  return (
    <div className='relative  flex flex-col h-[100%] w-[100%]'>
        {
        CoverPic===null || CoverPic===''?
    <Slider />
    :
    <div className='slideshowdivIMG'>
    <div className='slideshowdiv'>
    <img src={URL.createObjectURL(CoverPic)} alt='Slider'/>
    </div>
  </div>    
  }
    <div className='absolute  left-[25%] min-[394px]:left-[28%] min-[465px]:left-[32%] min-[613px]:left-[37%] lg:left-[42%] top-[15%] lg:top-[50%]'>
    {ProfilePic===null?
    <img src={user?.ProfileUrl} alt='IMG' className='w-[170px] h-[170px] rounded-full object-cover'/>
  :  
  <img src={URL.createObjectURL(ProfilePic)} alt='IMG' className='w-[170px] h-[170px] rounded-full object-cover'/>
  }
    <BiSolidEdit onMouseEnter={()=> setTooltip({...Tooltip,DP:true})} onMouseLeave={()=> setTooltip({...Tooltip,DP:false})} size={30} onClick={HandleProfileEdit} className='text-white shadow-pink-500 shadow-lg absolute right-0 top-5 cursor-pointer'/>
    <input onChange={handlePhotoChange} type="file" accept="image/*" style={{ display: "none" }} ref={ProfileFileInputRef} />
    </div>
    <RxCross1 onMouseEnter={()=> setTooltip({...Tooltip,Cancel:true})} onMouseLeave={()=> setTooltip({...Tooltip,Cancel:false})} size={40} onClick={()=>setShowComponent('Swipe')} className='text-white absolute right-10 top-10 cursor-pointer'/>
    <BiSolidEdit onMouseEnter={()=> setTooltip({...Tooltip,Edit:true})} onMouseLeave={()=> setTooltip({...Tooltip,Edit:false})} size={30} onClick={HandleCoverEdit} className='text-white shadow-pink-500 shadow-lg absolute left-10 min-[768px]:left-28 min-[845px]:left-20 min-[1024px]:left-44 min-[1075px]:left-32 min-[1256px]:left-20 min-[1413px]:left-10 top-10 cursor-pointer'/>
    <input onChange={handleCoverChange} type="file" accept="image/*" style={{ display: "none" }} ref={CoverFileInputRef} />
    <span className={`${Tooltip.Edit===true?'':'hidden'} text-white absolute left-5 top-3`}>Edit Cover Photos</span>
    <span className={`${Tooltip.Cancel===true?'':'hidden'} text-white absolute right-5 top-20`}>Go Back Swiping</span>
    <span className={`${Tooltip.DP===true?'':'hidden'} text-white absolute left-[57.5%] top-[52%]`}>Edit Profile Photo</span>

    <form className='flex flex-col items-center  justify-center bg-gradient-to-r from-pink-500 to-rose-500'>
      <div className="space-y-12  min-[893px]:pl-20 min-[1024px]:pl-36 min-[1089px]:pl-32 min-[1269px]:pl-20 min-[1421px]:pl-10 p-10   w-[100%] flex flex-col">
        <span className='text-3xl text-white  border-b-2 self-center border-pink-300 p-2 rounded-[5px] mt-20'>Edit Your Profile</span>
        <div className="pb-12">
          <h2 className="text-base md:text-2xl border-b border-b-pink-300 font-semibold leading-7 text-white">Profile</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="Firstname" className="block text-sm md:text-2xl  font-medium leading-6 text-white">
                Edit Your FirstName
              </label>
              <div className="mt-2">
                <div className="flex rounded-[5px]  sm:max-w-md">
                    <input
                    type="text"
                    name="username"
                    id="Firstname"
                    autoComplete="username"
                    onChange={(e)=>{
                     if(e.target.value.length>=1){
                      setPersonalInfo({...PersonalInfo,FirstName:e.target.value})
                     }else{
                      setPersonalInfo({...PersonalInfo,FirstName:user?.FirstName});
                     }
                    }
                    }
                      
                      className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-600 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-white placeholder:text-base  sm:text-sm sm:leading-6"
                    placeholder={user?.FirstName}
                    value={PersonalInfo.FirstName}
                  />
                </div>
              </div>
              <label htmlFor="Lastname" className="block mt-10 text-sm md:text-2xl  font-medium leading-6 text-white">
               Edit Your LastName
              </label>
              <div className="mt-2">
                <div className="flex rounded-[5px]  sm:max-w-md">
                    <input
                    type="text"
                    name="username"
                    id="Lastname"
                    autoComplete="username"
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-600 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-white  sm:text-sm sm:leading-6"
                    placeholder={user?.LastName?user.LastName:'Provide Your LastName'}
                    onChange={(e)=>{
                      if(e.target.value.length>=1){
                      setPersonalInfo({...PersonalInfo,LastName:e.target.value})
                    }else{
                      setPersonalInfo({...PersonalInfo,LastName:user?.LastName})
                    }
                  }
                }
                    value={PersonalInfo.LastName}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm md:text-2xl  font-medium leading-6 text-white">
              Edit Your About Me
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block border-2 border-pink-500 focus:border-pink-700 pl-5 outline-none w-full rounded-md overflow-hidden resize-none max-h-[300px] py-1.5 text-pink-500  placeholder:text-pink-500  sm:text-sm md:text-[18px] sm:leading-6"
                  defaultValue={''}
                  value={PersonalInfo.bio}
                  onChange={(e)=>{
                    if(e.target.value.length>=1){
                    setPersonalInfo({...PersonalInfo,bio:e.target.value})
                  }else{
                    setPersonalInfo({...PersonalInfo,bio:user?.bio})  
                  }
                }
              }
                  placeholder={user?.bio}
                />
              </div>
             </div>

            </div>
        </div>

        <div className="pb-12">
          <h2 className="text-base md:text-2xl pb-2 border-b-pink-300 border-b-2 font-semibold leading-7 text-white">Personal Information</h2>
          <p className="mt-1 text-sm leading-6 text-white">Use a permanent address where you can receive mail.</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Edit Your Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-pink-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-pink-500 placeholder:font-bold focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder={user?.email}
                  value={email}
                  onChange={(e)=>{
                    if(e.target.value.length>=1){
                    setemail(e.target.value)
                    }else{
                      setemail(user?.email);
                    }
                  }
                }
               />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
              Edit Your Country
              </label>
              <div className="mt-2">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-pink  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) =>{
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        {
                          ...PersonalInfo.Location[0],
                          country:
                            Country.getCountryByCode(e.target.value)?.name ||
                            user?.Location[0].country,
                        },
                      ],
                    })
                  }
                  }
               >
                  <option value={country} className='text-pink-600'>{country}</option>
                {Country &&
                  Country.getAllCountries().map((countries) => (
                    <option
                      key={`STATE_${countries.isoCode}`}
                      value={countries.isoCode}
                    >
                      {countries.name}
                    </option>
                     ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-white">
              Edit Your City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  placeholder={city}
                  className=" pl-2 block w-full rounded-md border-0 py-1.5 text-pink-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-pink-500 placeholder:font-bold focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>{
                    if(e.target.value.length>=1){
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], city: e.target.value },
                      ],
                    })
                  }else{
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], city: user?.Location[0].city },
                      ],
                    })
                  }
                  }
                  }
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-white">
              Edit Your State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  placeholder={state}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-pink-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-pink-500 placeholder:font-bold focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    {
                   if(e.target.value.length>=1){
                      setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], State: e.target.value },
                      ],
                    })
                  }else{
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], State: user?.Location[0].State },
                      ],
                    })
                  }
                  }
                  }
               />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-white">
              Edit Your ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  placeholder={user?.pincode}
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-pink-600 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-pink-500 placeholder:font-bold focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>{
                   if(e.target.value.length>=1){
                    setPersonalInfo({...PersonalInfo, pincode: e.target.value,})
                  }else{
                    setPersonalInfo({...PersonalInfo,pincode:user?.pincode});
                  }
                  }
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`flex gap-5 items-center`}>
            <h3 className="text-white font-bold">Your Age:</h3>
            <input placeholder={user?.age} type="number" disabled={LOADING}  onChange={(e)=>{
               if (!LOADING) {
                if(e.target.value.length>=1){
              setPersonalInfo({...PersonalInfo,age:e.target.value.toString()})
                }else{
                  setPersonalInfo({...PersonalInfo,age:user?.age})   
                }  
            }  
            }} className={`${LOADING?'cursor-not-allowed':''} w-[60px] pl-4 outline-none ${LOADING?'text-white':'text-pink-500'} h-[30px] rounded-[5px]`}/>
          </div>

        <div className="">
          <h2 className="text-base md:ml-10 md:text-xl md:mb-5 font-semibold leading-7 text-white">
            Gender
          </h2>
          <div className="flex gap-5 mt-2 md:gap-20 flex-col md:flex-row md:ml-10">
            <div className="relative flex  gap-x-3">
              <div className="flex h-6 items-center">
                <input
                  id="Male"
                  name="Male"
                  type="checkbox"
                  disabled={LOADING}
                  defaultChecked={user?.Gender && user.Gender==='Male'?true:false}
                  className="h-4 w-4 md:h-6 md:w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onClick={HandleMaleGender}
                  ref={MaleRef}
                />
              </div>
              <div className="text-sm  md:text-[20px] leading-6">
                <label htmlFor="Male" className="font-medium  text-white">
                  Male
                </label>
              </div>
            </div>

            <div className="relative flex  gap-x-3">
              <div className="flex h-6  items-center">
                <input
                  id="Female"
                  name="Female"
                  type="checkbox"
                  disabled={LOADING}
                  defaultChecked={user?.Gender && user.Gender==='Female'?true:false}
                  className="h-4 w-4 md:h-6 md:w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onClick={HandleFemaleGender}
                  ref={FemaleRef}
                />
              </div>
              <div className="text-sm  md:text-[20px] leading-6">
                <label htmlFor="Female" className="font-medium  text-white">
                  Female
                </label>
              </div>
            </div>

            <div className="relative flex gap-x-3">
              <div className="text-sm md:text-base leading-6">
                <label
                  htmlFor="Customgender"
                  className="font-medium text-white"
                >
                  Write Your Gender Instead :
                </label>
              </div>
              <div className="flex h-6 items-center">
                <input
                  id="Customgender"
                  name="Customgender"
                  type="text"
                  disabled={LOADING}
                  placeholder={user?.Gender!=='Male' && user?.Gender!=='Female'?user?.Gender:''}
                  className={`h-8 w-32 rounded-[5px] border-pink-500 border-2 ${LOADING?'text-white':'text-pink-600'} outline-none md:text-base md:p-2`}
                  onChange={HandleCustomGender}
                />
              </div>
            </div>
          </div>

         

          <div className="mt-12 space-y-10">
            <fieldset className="flex flex-col md:flex-row justify-between">
              <div>
                <legend className="text-sm md:text-xl md:ml-10  font-semibold leading-6 text-white">
                  Sexuality
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative lg:flex-row md:flex-col md:gap-5 lg:gap-0 items-center flex gap-x-3">
                    <div className="text-xs sm:text-sm md:text-base sm:leading-6">
                      <label
                        htmlFor="Sexuality"
                        className="font-medium text-white"
                      >
                        write Your Sexuality :
                      </label>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                        id="Sexuality"
                        name="sexuality"
                        type="text"
                        disabled={LOADING}
                        placeholder={user?.sexuality}
                        className={`h-6 sm:h-8 w-52 placeholder:text-[12px] pl-2 md:w-64 rounded-[5px] border-pink-500 border-2 ${LOADING?'text-white':'text-pink-600'} outline-none md:text-base md:p-2 md:pl-3`}
                        onChange={(e) =>{
                          if(e.target.value.length>=1){
                          setPersonalInfo({
                            ...PersonalInfo,
                            sexuality: e.target.value,
                          })
                          }else{
                            setPersonalInfo({
                              ...PersonalInfo,
                              sexuality: user?.sexuality,
                            })
                          }
                        }
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <legend className="text-sm mt-5 sm:mt-10 md:mt-0 md:text-xl md:ml-10  font-semibold leading-6 text-white">
                  Occupation
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative  lg:flex-row md:flex-col md:gap-5 lg:gap-0 items-center flex gap-x-3">
                    <div className="text-xs sm:text-sm md:text-base leading-6">
                      <label
                        htmlFor="Occupation"
                        className="font-medium text-white"
                      >
                        Your Current Work State :
                      </label>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                        id="Occupation"
                        name="Occupation"
                        type="text"
                        placeholder={user?.occupation}
                        disabled={LOADING}
                        className={`h-6 sm:h-8 w-52 placeholder:text-[14px] pl-2 md:w-56 rounded-[5px] border-pink-500 border-2 ${LOADING?'text-white':'text-pink-600'} outline-none md:text-base md:p-2 md:pl-3`}
                        onChange={(e) =>{
                          if(e.target.value.length>=1){
                          setPersonalInfo({
                            ...PersonalInfo,
                            occupation: e.target.value,
                          })
                          }else{
                            setPersonalInfo({
                              ...PersonalInfo,
                              occupation: e.target.value,
                            })
                          }
                        }
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset className="flex flex-col ">
              <legend className="text-sm md:text-center md:text-2xl font-semibold leading-6 text-white">
                Your Interests
              </legend>
              <p className="mt-1 text-sm leading-6 text-[rgba(255,255,255,0.7)] md:text-center">
                Choose Atleast Two Interest And Upto Four
              </p>
              <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 sm:gap-10 text-center mt-5 md:mt-10">
                <span
                  onClick={() => HandleInterests("Music")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Music")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Music
                </span>
                <span
                  onClick={() => HandleInterests("Sports and Fitness")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Sports and Fitness")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Sports and Fitness
                </span>
                <span
                  onClick={() => HandleInterests("Travel and Adventure")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Travel and Adventure")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Travel and Adventure
                </span>
                <span
                  onClick={() => HandleInterests("Food and Cooking")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Food and Cooking")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Food and Cooking
                </span>
                <span
                  onClick={() => HandleInterests("Arts and Culture")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Arts and Culture")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Arts and Culture
                </span>
                <span
                  onClick={() => HandleInterests("Outdoor Activities")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Outdoor Activities")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Outdoor Activities
                </span>
                <span
                  onClick={() => HandleInterests("Technology and Gaming")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Technology and Gaming")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Technology and Gaming
                </span>
                <span
                  onClick={() => HandleInterests("Books and Literature")}
                  className={` hover:border-pink-500 ${
                    Interests.includes("Books and Literature")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Books and Literature
                </span>
              </div>
            </fieldset>
          </div>
        </div>
      </div>


      <div className="mt-3 relative items-center gap-2  ml-[50%] mb-[50px]">
        <button
          type="submit"
          className="rounded-md md:w-[170px] bg-gradient-to-r hover:from-pink-600 hover:to-rose-200 transition-all duration-200 from-pink-600 to-rose-300 px-3 py-2 text-sm md:text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          onClick={HandleSave}
        >
          Save
        </button>
        <span className={`${Error!==''?'':'hidden'} absolute left-[-250px] text-red-700 font-bold`}>{Error}*</span>
        <div className={`${LOADING?'cursor-none':'hidden'} absolute right-0 top-1`}>
                   <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                   </svg>
                     </div>
      </div>
    </form>






    </div>

  )
}

export default EditProfile