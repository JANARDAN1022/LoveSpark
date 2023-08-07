import{useContext,useState,useRef} from 'react'
import {RxCross1} from 'react-icons/rx';
import { MainPageContext } from '../../Context/MainPageContext';
import Slider from './ImgSlider';
//import IMG from '../../Assets/pexels.jpeg';
import {BiSolidEdit} from 'react-icons/bi';
//import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import {Country} from 'country-state-city';
import { useAppSelector } from '../../Hooks';


const EditProfile = () => {

    const {setShowComponent} = useContext(MainPageContext);
    const {user} = useAppSelector((state)=>state.user);
  //  const [selectedProfilePhoto, setselectedProfilePhoto] = useState(null);
   // const [selectedCoverPhoto, setselectedCoverPhoto] = useState(null);
   const INTERESTS = user?.interests?user?.interests:[];
    const [Interests,setInterests]=useState<string[]>(INTERESTS);
    const [PersonalInfo,setPersonalInfo] = useState({
      Email:'',
      Country:'',
      Address:'',
      City:'',
      State:'',
      PostalCode:'',
      Gender:'',
      Sexuality:'',
      Occupation:'',
      age:'',
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
     
     setPersonalInfo({...PersonalInfo,Gender:e.target.value})
   };

   const HandleProfileEdit = ()=>{
    if(ProfileFileInputRef.current){
      ProfileFileInputRef.current.click();
    }
   }

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
 
   /*const handlePhotoChange = (event:any)=> {
     const file = event.target.files[0];
     setselectedProfilePhoto(file);
 
     // You can also perform additional processing or upload the file to the server here
   };
   const handleCoverChange = (event:any)=> {
     const file = event.target.files[0];
     setselectedCoverPhoto(file);
 
     // You can also perform additional processing or upload the file to the server here
   };
 */
   const HandleSave = (e:any)=>{
     e.preventDefault();
   }
  return (
    <div className='relative  flex flex-col h-full w-[1140.5px]'>
      <div>
    <Slider />
    </div>
    <div className='absolute left-[42%] top-[50%] '>
    <img src={user?.ProfileUrl} alt='IMG' className='w-[170px] h-[170px] rounded-full object-cover'/>
    <BiSolidEdit onMouseEnter={()=> setTooltip({...Tooltip,DP:true})} onMouseLeave={()=> setTooltip({...Tooltip,DP:false})} size={30} onClick={HandleProfileEdit} className='text-white absolute right-0 top-5 cursor-pointer'/>
    <input type="file" accept="image/*" style={{ display: "none" }} ref={ProfileFileInputRef} />
    </div>
    <RxCross1 onMouseEnter={()=> setTooltip({...Tooltip,Cancel:true})} onMouseLeave={()=> setTooltip({...Tooltip,Cancel:false})} size={40} onClick={()=>setShowComponent('Swipe')} className='text-white absolute right-10 top-10 cursor-pointer'/>
    <BiSolidEdit onMouseEnter={()=> setTooltip({...Tooltip,Edit:true})} onMouseLeave={()=> setTooltip({...Tooltip,Edit:false})} size={30} onClick={HandleCoverEdit} className='text-white absolute left-10 top-10 cursor-pointer'/>
    <input type="file" accept="image/*" style={{ display: "none" }} ref={CoverFileInputRef} />
    <span className={`${Tooltip.Edit===true?'':'hidden'} text-white absolute left-5 top-3`}>Edit Cover Photos</span>
    <span className={`${Tooltip.Cancel===true?'':'hidden'} text-white absolute right-5 top-20`}>Go Back Swiping</span>
    <span className={`${Tooltip.DP===true?'':'hidden'} text-white absolute left-[57.5%] top-[52%]`}>Edit Profile Photo</span>

    <form className='flex flex-col items-center  justify-center bg-gradient-to-r from-pink-500 to-rose-500'>
      <div className="space-y-12 p-10  lg:w-[1000px] flex flex-col">
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
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-600 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-white placeholder:text-base  sm:text-sm sm:leading-6"
                    placeholder={user?.FirstName}
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
                  placeholder={user?.bio}
                />
              </div>
             </div>

           {/* <div className={`absolute top-[50%] left-[30%] border-2 border-white col-span-full ${EditPhoto.ProfilePic===true?'':'hidden'}  bg-gradient-to-r from-pink-500 to-rose-500 w-[400px] h-[400px]`}>
  <label htmlFor="photo" className="block text-sm md:text-2xl md:mb-5 font-medium leading-6 text-white">
    Photo
  </label>
  <div className="mt-2 flex items-center gap-x-10">
  {selectedProfilePhoto ? (
          <img
            src={URL.createObjectURL(selectedProfilePhoto)}
            alt="selectedProfilePhoto"
            className="h-12 w-12 md:w-32 md:h-32 rounded-full object-cover"
          />
        ) : (
          <UserCircleIcon className="h-12 w-12 md:w-32 md:h-32 text-white" aria-hidden="true" />
        )}
    <div className="flex items-center gap-x-3">
      <input
        type="file"
        id="photo"
        accept="image/*" // Specify the accepted file types if needed
        className="hidden" // Hide the input element visually
        onChange={handlePhotoChange}
      />
      <label
        htmlFor="photo"
        className="rounded-md md:w-[150px] md:text-center bg-white px-2.5 py-1.5 text-sm md:text-lg font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
      >
        Change
      </label>
    </div>
  </div>
        </div> */}

{/*
            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm md:text-2xl font-medium leading-6 text-white">
                Cover photo
              </label>
              <span className='text-white text-sm'>(This Image is What Other User Will Swipe Left or Right)</span>
              <div className="mt-2 ml-[20%] md:w-[500px] h-[600px] flex justify-center items-center rounded-lg border border-dashed border-pink-500 py-5">
                <div className="flex flex-col items-center">
                {selectedCoverPhoto ? (
          <img
            src={URL.createObjectURL(selectedCoverPhoto)}
            alt="selectedProfilePhoto"
            className="CardImg"
          />
        ) : (
          <PhotoIcon className="h-12 w-12 md:w-52 md:h-52 text-white" aria-hidden="true" />
        )}
                </div>
          </div>
          
          <div className="justify-center items-center  mt-4 flex text-sm leading-6   text-white">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer p-2 pl-3 pr-3  rounded-md bg-pink-100 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-white"
                    >
                      <span >Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleCoverChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                    <p className="ml-5 text-xs leading-5 text-white">PNG, JPG, GIF up to 10MB</p>
                  </div>
              </div> */}
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
                />
              </div>
            </div>
          </div>
        </div>

          
        <div className="flex gap-5 items-center">
            <h3 className="text-white font-bold">Update Your Age:</h3>
            <input type="number" placeholder={user?.age}  onChange={(e)=>setPersonalInfo({...PersonalInfo,age:e.target.value.toString()})} className="w-[60px] placeholder:text-pink-500 placeholder:font-bold pl-4 outline-none text-pink-500 h-[30px] rounded-[5px]"/>
          </div>


        <div className="">
          <h2 className="text-base md:ml-10 md:text-xl md:mb-5 font-semibold leading-7 text-white">Change Your Gender</h2>
         <div className='flex md:gap-20 md:ml-10'>
         <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="Male"
                      name="Male"
                      type="checkbox"
                      defaultChecked={user?.Gender && user?.Gender==='Male'?true:false}
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

                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="Female"
                      name="Female"
                      type="checkbox"
                      defaultChecked={user?.Gender && user?.Gender==='Female'?true:false}
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
                    <label htmlFor="Customgender" className="font-medium text-white">
                     Prefer To Write Your Gender Instead ? :
                    </label>
                </div>
                  <div className="flex h-6 items-center">
                    <input
                      id="Customgender"
                      name="Customgender"
                      type="text"
                      placeholder={user?.Gender && user?.Gender!=='Male' && user?.Gender!=='Female'?user?.Gender:''}
                      className="placeholder:font-bold h-8 w-32 rounded-[5px] border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2"
                     onChange={HandleCustomGender}
                   />
                  </div>
                </div>
          </div>

          <div className="mt-12 space-y-10">
            <fieldset className='flex justify-between'>
              <div>
              <legend className="text-sm md:text-xl md:ml-10  font-semibold leading-6 text-white">Change Your Sexuality</legend>
              <div className="mt-6 space-y-6">
              <div className="relative flex gap-x-3">
                <div className="text-sm md:text-base leading-6">
                    <label htmlFor="Sexuality" className="font-medium text-white">
                      People Your Attracted To :
                    </label>
                </div>
                  <div className="flex h-6 items-center">
                    <input
                      id="Sexuality"
                      name="sexuality"
                      type="text"
                      placeholder={user?.sexuality}
                      className="h-8 w-32 md:w-64 rounded-[5px] placeholder:font-bold border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2 md:pl-3"
                    />
                  </div>
                </div>
              </div>
              </div>
              <div>
              <legend className="text-sm md:text-xl md:ml-10  font-semibold leading-6 text-white">Occupation</legend>
              <div className="mt-6 space-y-6">
              <div className="relative flex gap-x-3">
                <div className="text-sm md:text-base leading-6">
                    <label htmlFor="Occupation" className="font-medium text-white">
                      Your Current Work State :
                    </label>
                </div>
                  <div className="flex h-6 items-center">
                    <input
                      id="Occupation"
                      name="Occupation"
                      type="text"
                      placeholder={user?.occupation}
                      className="h-8 w-32 md:w-56 rounded-[5px] placeholder:font-bold border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2 md:pl-3"
                    />
                  </div>
                </div>
              </div>
              </div>
              
            </fieldset>

            <fieldset className='flex flex-col '>
              <legend className="text-sm md:text-center md:text-2xl font-semibold leading-6 text-white">Change Your Interests</legend>
              <p className="mt-1 text-sm leading-6 text-white md:text-center">Choose Atleast Two Interest And Upto Four</p>
             <div className='grid grid-cols-4 gap-10 mt-5 md:mt-10'>
              <span onClick={()=>HandleInterests("Music")} className={`hover:border-pink-500 ${Interests.includes("Music")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Music</span>
              <span onClick={()=>HandleInterests("Sports and Fitness")} className={` hover:border-pink-500 ${Interests.includes("Sports and Fitness")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Sports and Fitness</span>
              <span  onClick={()=>HandleInterests("Travel and Adventure")} className={` hover:border-pink-500 ${Interests.includes("Travel and Adventure")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Travel and Adventure</span>
              <span onClick={()=>HandleInterests("Food and Cooking")} className={` hover:border-pink-500 ${Interests.includes("Food and Cooking")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Food and Cooking</span>
              <span onClick={()=>HandleInterests("Arts and Culture")} className={` hover:border-pink-500 ${Interests.includes("Arts and Culture")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Arts and Culture</span>
              <span onClick={()=>HandleInterests("Outdoor Activities")} className={` hover:border-pink-500 ${Interests.includes("Outdoor Activities")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Outdoor Activities</span>
              <span onClick={()=>HandleInterests("Technology and Gaming")} className={` hover:border-pink-500 ${Interests.includes("Technology and Gaming")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Technology and Gaming</span>
              <span onClick={()=>HandleInterests("Books and Literature")} className={` hover:border-pink-500 ${Interests.includes("Books and Literature")?'bg-gradient-to-r from-pink-700 to-rose-200 text-white':'border-2 border-pink-300 bg-transparent text-white'} hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] cursor-pointer  hover:text-white md:p-3 flex justify-center`}>Books and Literature</span>
            </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-3 flex  ml-[50%] mb-[50px]">
        <button
          type="submit"
          className="rounded-md md:w-[170px] bg-gradient-to-r hover:from-pink-600 hover:to-rose-200 transition-all duration-200 from-pink-600 to-rose-300 px-3 py-2 text-sm md:text-lg font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          onClick={HandleSave}
        >
          Save
        </button>
      </div>
    </form>






    </div>

  )
}

export default EditProfile