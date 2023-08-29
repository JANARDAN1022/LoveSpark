import { useState, useRef, useEffect,useContext,useCallback } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Country,State,City} from "country-state-city";
import { useAppDispatch } from "../../Hooks";
import { UpdateUser } from "../../Actions/userAction";
import { useAppSelector } from "../../Hooks";
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { storage } from "../../firebase";
//import {v4} from 'uuid';
import { MainPageContext } from "../../Context/MainPageContext";
import { unwrapResult } from '@reduxjs/toolkit';
import axios from "axios";
import { PersonalInfoType } from "../../Types/UserTypes";

export default function Example() {
  const [ProfilePic, setProfilePic] = useState<any | null>(null);
  const [CoverPic, setCoverPic] = useState<any | null>(null);
  const [LOADING,setLOADING]=useState(false);
  const {setUsers} = useContext(MainPageContext);

  
 
 const [PersonalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    FirstName: "",
    LastName: "",
    bio: "",
    Location: [
      {
        country: "",
        State: "",
        city: "",
      },
    ],
    pincode: "",
    Gender: "",
    sexuality: "",
    occupation: "",
    age:'',
  });
  const [CountryCode,setCountryCode] = useState(''); 
  const [StateCode,setStateCode]=useState('');
  const MaxBioLength = 300;
  const [interests, setinterests] = useState<string[]>([]);
  const [Error,setError]=useState('');
  const FirstNameRef = useRef<HTMLDivElement>(null);
  const FirstNameInputRef = useRef<HTMLInputElement>(null);
  const MaleRef = useRef<HTMLInputElement>(null);
  const FemaleRef = useRef<HTMLInputElement>(null);
  const BioRef = useRef<HTMLTextAreaElement>(null);
  const PersonalInfoRef = useRef<HTMLDivElement>(null);
  const StateRef = useRef<HTMLSelectElement>(null);
  const CityRef =  useRef<HTMLSelectElement>(null);
  const PostalRef =  useRef<HTMLInputElement>(null);
  const AgeRef =  useRef<HTMLInputElement>(null);
  const SexuailtyRef =  useRef<HTMLInputElement>(null);
  const OccupationRef =  useRef<HTMLInputElement>(null);
  const CountryRef = useRef<HTMLSelectElement>(null);
  const CustomGenderRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const Id = user?._id;
 

  const Status = user?.ProfileStatus && user?.ProfileStatus;
  
  const AllUsers = useCallback(async () => {
    if(Id){
    const route = `https://love-spark.vercel.app/api/Users/All/${Id}`;
    const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
  
    try {
      const { data } = await axios.get<any>(route, config);
      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  }
  }, [Id,setUsers]);

  useEffect(() => {
    const body = document.body;
    body.style.overflowY = 'scroll';
    body.style.overflowX='hidden';
    AllUsers();
    if (Status && Status === "Complete") {
      Navigate("/MainPage");
    }
  }, [Navigate, Status,AllUsers]);

  

  const HandleMaleGender = () => {
    if (FemaleRef.current !== null) {
      FemaleRef.current.checked = false;
    }
    if (CustomGenderRef.current !== null) {
      CustomGenderRef.current.value = ""
    }
    setPersonalInfo({ ...PersonalInfo, Gender: "Male" });
  };

  const HandleFemaleGender = () => {
    if (MaleRef.current !== null) {
      MaleRef.current.checked = false;
      
    if (CustomGenderRef.current !== null) {
      CustomGenderRef.current.value = ""
    }
    }
    setPersonalInfo({ ...PersonalInfo, Gender: "Female" });
    
  };

  const HandleCustomGender = (e: any) => {
    if (MaleRef.current !== null) {
      MaleRef.current.checked = false;
    }
    if (FemaleRef.current !== null) {
      FemaleRef.current.checked = false;
    }

    setPersonalInfo({ ...PersonalInfo, Gender: e.target.value });
  };

  const HandleInterests = (Interest: string) => {
    if(!LOADING){
    if (interests.includes(Interest)) {
      setinterests(interests.filter((INT) => INT !== Interest));
    } else if (interests.length === 4) {
      setinterests([...interests]);
    } else {
      setinterests([...interests, Interest]);
    }
  }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
     setProfilePic(file);
  };
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
setCoverPic(file);
  };
  
  
    const HandleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    
      const scrollToAndFocus = (fieldRef: React.RefObject<HTMLElement> | null, focusRef?: React.RefObject<HTMLElement> | null) => {
        if (fieldRef && fieldRef.current) {
          fieldRef.current.scrollIntoView({ behavior: 'smooth' });
          if (focusRef && focusRef.current) {
            focusRef.current.focus({ preventScroll: true });
          }
        }
      };
      if(Id && ProfilePic !== null && CoverPic !== null && interests.length >= 2) {
        const profileRef = ref(storage, `ProfilePics/${ProfilePic.name + user._id + user.FirstName}`);
        const CoverRef = ref(storage, `CoverPics/${CoverPic.name + user._id + `123#` + user.FirstName}`);
    
        try {
          setLOADING(true);
          // Upload the profile picture and cover picture to Firebase Storage
          const snapshots = await Promise.all([
            uploadBytes(profileRef, ProfilePic),
            uploadBytes(CoverRef, CoverPic)
          ]);
          // Get the download URLs for both images
          const [profileSnapshot, coverSnapshot] = snapshots;
          const urls = await Promise.all([
            getDownloadURL(profileSnapshot.ref),
            getDownloadURL(coverSnapshot.ref)
          ]);
    
          const [profileUrl, coverUrl] = urls;
    
          // Update the User object with the correct ProfileUrl and CoverUrl
          const updatedUser = {
            ...PersonalInfo,
            interests,
            ProfileUrl: profileUrl,
            CoverUrl: coverUrl,
          };
    
          // Dispatch the updated User object to update the user's profile in the database
          const response = await dispatch(UpdateUser({ id: Id, data: updatedUser }));
          const result = unwrapResult(response); // Unwrap the result to get the action payload
    
          if (result?.success) {
            setLOADING(false);
            Navigate("/MainPage");
          }else{
            setLOADING(false);
            setError('Save Failed Try Again');
          }
        } catch (error) {
          console.error("Error uploading images:", error);
        }
      }else if (!PersonalInfo.FirstName) {
        scrollToAndFocus(FirstNameRef, FirstNameInputRef);
      } 
      else if (!PersonalInfo.bio) {
        scrollToAndFocus(FirstNameRef,BioRef);
      } else if(!PersonalInfo.Location[0].country){
        scrollToAndFocus(PersonalInfoRef,CountryRef); 
      } 
      else if (!PersonalInfo.Location[0].State) {
        scrollToAndFocus(PersonalInfoRef,StateRef);
      } 
      else if (!PersonalInfo.Location[0].city) {
        scrollToAndFocus(PersonalInfoRef,CityRef);
      } 
      else if (!PersonalInfo.pincode) {
        scrollToAndFocus(PersonalInfoRef,PostalRef);
      } 
      else if (!PersonalInfo.age) {
        scrollToAndFocus(PersonalInfoRef,AgeRef);
      }
       else if (!PersonalInfo.sexuality) {
        scrollToAndFocus(PersonalInfoRef,SexuailtyRef);
      }
       else if (!PersonalInfo.occupation) {
        scrollToAndFocus(PersonalInfoRef,OccupationRef);
      }
       else if (ProfilePic === null || CoverPic === null) {
        setError('Please Provide Both Required Photos');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
       else if (!PersonalInfo.Gender || PersonalInfo.Gender==='') {
        setError('Please Provide Your Gender');
        setTimeout(() => {
          setError('');
        }, 3000);
      }
       else if(interests.length < 2) {
        setError('Please Provide Atleast Two Interests');
        setTimeout(() => {
          setError('');
        }, 3000);
      } 
  };

  useEffect(()=>{
 if(LOADING){
  const body = document.body;
  body.style.overflow = 'hidden';
 }
  },[LOADING]);
  
  return (
    <form className={`flex flex-col items-center  justify-center  bg-gradient-to-r from-pink-600 to-rose-400`}>
      <div className="space-y-12 p-10  lg:w-[1000px] flex flex-col">
        <span className="text-3xl text-white  border-b-2 self-center border-pink-300 p-2 rounded-[5px]">
          Complete Your Profile
        </span>
        <div className="pb-12">
          <h2 className="text-base md:text-2xl border-b border-b-pink-300 font-semibold leading-7 text-white">
            Profile
          </h2>
          <p className="mt-1 text-sm md:text-lg leading-6 text-[rgba(255,255,255,0.7)]">
            This information will be displayed publicly so be careful what you
            share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4" ref={FirstNameRef}>
              <label
                htmlFor="Firstname"
                className="block text-sm md:text-2xl  font-medium leading-6 text-white"
              >
                FirstName
              </label>
              <div className="mt-2" >
                <div className="flex rounded-[5px]  sm:max-w-md">
                  <input
                  ref={FirstNameInputRef}
                    type="text"
                    name="username"
                    id="Firstname"
                    autoComplete="username"
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-700 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-[rgba(255,255,255,0.7)]  sm:text-sm sm:leading-6"
                    placeholder="ex:- John"
                    onChange={(e) =>
                      setPersonalInfo({
                        ...PersonalInfo,
                        FirstName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <label
                htmlFor="Lastname"
                className="block mt-10 text-sm md:text-2xl  font-medium leading-6 text-white"
              >
                LastName
              </label>
              <div className="mt-2">
                <div className="flex rounded-[5px]  sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="Lastname"
                    autoComplete="username"
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-700 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-[rgba(255,255,255,0.7)]  sm:text-sm sm:leading-6"
                    placeholder="ex:- John"
                    onChange={(e) =>
                      setPersonalInfo({
                        ...PersonalInfo,
                        LastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="about"
                className="block text-sm md:text-2xl  font-medium leading-6 text-white"
              >
                About
              </label>
              <div className="mt-2">
                <textarea
                ref={BioRef}
                  id="about"
                  name="about"
                  rows={4}
                  className="block border-2 border-pink-500 focus:border-pink-700 pl-5  outline-none w-full rounded-md overflow-hidden resize-none max-h-[300px] py-1.5 text-pink-500  placeholder:text-pink-500  sm:text-sm md:text-[19px] sm:leading-6"
                  defaultValue={""}
                  placeholder="your Hobbies/ What You Do For Fun / What are You Looking For......."
                  onChange={(e) =>{
                    const AboutInfo = e.target.value;
                    const Length = AboutInfo.trim().length;
                    console.log(Length);
                    if(Length<=MaxBioLength){
                    setPersonalInfo({ ...PersonalInfo, bio: e.target.value })
                    }
                  }
                
                }
                maxLength={MaxBioLength}
                />
              </div>
              <div className="flex justify-between items-center">
              <p className="mt-3 text-sm md:text-[16px] leading-6 text-[rgba(255,255,255,0.7)]">
                Write a few sentences about yourself.
              </p>
              <p className={`mt-3 text-sm md:text-[16px] leading-6 font-bold text-[rgba(255,255,255,0.7)]`}>
              Characters left: {MaxBioLength - PersonalInfo.bio.length}
              </p>
              
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="photo"
                className="block text-sm md:text-2xl md:mb-5 font-medium leading-6 text-white"
              >
                Profile Photo
              </label>
              <div className="mt-2 flex items-center gap-x-10">
              
                  {ProfilePic ? (
               
                       <img
                      src={URL.createObjectURL(ProfilePic)}
                      alt="ProfilePic"
                      className="h-12 w-12 md:w-[170px] md:h-[170px] rounded-full object-cover"
                    />
                   
                    ): (
                    <UserCircleIcon
                      className="h-12 w-12 md:w-[170px] md:h-[170px] text-pink-300"
                      aria-hidden="true"
                    />
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
                    className="rounded-md md:w-[150px] md:text-center bg-white px-2.5 py-1.5 text-sm md:text-lg font-semibold text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer"
                  >
                    Change
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm md:text-2xl font-medium leading-6 text-white"
              >
                Cover photo
              </label>
              <span className="text-[rgba(255,255,255,0.7)] text-sm">
                (This Image is What Other User Will Swipe Left or Right)
              </span>
              <div className="mt-2 ml-[20%] md:w-[450px] h-[600px] flex justify-center items-center rounded-lg border border-dashed border-white  py-5">
                <div className="flex flex-col items-center">
                  {CoverPic ? (
                    <img src={URL.createObjectURL(CoverPic)} alt="ProfilePic" className="CardImg" />
                  ) : (
                    <PhotoIcon
                      className="h-12 w-12 md:w-52 md:h-52 text-white"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              <div className="justify-center items-center  mt-4 flex text-sm leading-6   text-pink-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer p-2 pl-3 pr-3  rounded-md bg-pink-100 font-semibold text-pink-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-pink-600 focus-within:ring-offset-2 hover:text-pink-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverChange}
                  />
                </label>
                <p className="pl-1 text-[rgba(255,255,255,0.7)]">
                  or drag and drop
                </p>
                <p className="pl-2  text-sm  text-[rgba(255,255,255,0.7)]">
                  PNG, JPEG,JPG
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pb-12" ref={PersonalInfoRef}>
          <h2 className="text-base md:text-2xl pb-2 border-b-pink-300 border-b-2 font-semibold leading-7 text-white">
            Personal Information
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-white"
              >
                Country
              </label>
              <div className="mt-2">
                <select
                ref={CountryRef}
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) =>{
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        {
                          ...PersonalInfo.Location[0],
                          country:
                            Country.getCountryByCode(e.target.value)?.name ||
                            "",
                        },
                      ],
                    });
                    setCountryCode(e.target.value);
                  }
                  }
                >
                  <option value=" ">Select Country</option>
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

            <div className={`sm:col-span-2 sm:col-start-1`}>
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-white"
              >
                State / Province
              </label>
              <div className="mt-2">
                <select
                ref={StateRef}
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-[rgba(255,255,255,0.7)] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>{
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0],State:State.getStateByCodeAndCountry(e.target.value,CountryCode)?State.getStateByCodeAndCountry(e.target.value,CountryCode)?.name:""},
                      ],
                    });
                    setStateCode(e.target.value);
                  }
                  }
                >
                  <option value=" ">Select State</option>
                  {State && CountryCode!=='' &&
                    State.getStatesOfCountry(CountryCode).map((state) => (
                      <option
                        key={`STATE_${state.isoCode}`}
                        value={state.isoCode}
                      >
                        {state.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className={`${StateCode==='' || PersonalInfo.Location[0].State===''?'hidden':''} sm:col-span-2`}>
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-white"
              >
                City
              </label>
              <div className={`mt-2`}>
                <select
                ref={CityRef}
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-[rgba(255,255,255,0.7)] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], city: e.target.value },
                      ],
                    })
                  }
                >
                  <option value=" ">Select City</option>
                  {City && StateCode!=='' && 
                    City.getCitiesOfState(CountryCode,StateCode).map((city) => (
                      <option
                        key={`STATE_City_${city.name}`}
                        value={city.name}
                      >
                        {city.name}
                      </option>
                    ))}

                </select>
              </div>
            </div>

           

            <div className="sm:col-span-2">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium leading-6 text-white"
              >
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                ref={PostalRef}
                  type="number"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-[rgba(255,255,255,0.7)] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setPersonalInfo({
                      ...PersonalInfo,
                      pincode: e.target.value.toString(),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`flex gap-5 items-center`}>
            <h3 className="text-white font-bold">Your Age:</h3>
            <input ref={AgeRef} type="number" disabled={LOADING}  onChange={(e)=>{
               if (!LOADING) {
              setPersonalInfo({...PersonalInfo,age:e.target.value.toString()})
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
                  className="h-4 w-4 md:h-6 md:w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onClick={HandleMaleGender}
                  ref={MaleRef}
                />
              </div>
              <div className="text-sm  md:text-[20px] leading-6">
                <label htmlFor="Male" className="font-bold text-base  text-white">
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
                  className="h-4 w-4 md:h-6 md:w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  onClick={HandleFemaleGender}
                  ref={FemaleRef}
                />
              </div>
              <div className="text-sm  md:text-[20px] leading-6">
                <label htmlFor="Female" className="font-bold text-base  text-white">
                  Female
                </label>
              </div>
            </div>

            <div className="relative flex gap-x-3">
              <div className="text-sm md:text-base leading-6">
                <label
                  htmlFor="Customgender"
                  className="font-bold text-base text-white"
                >
                  Write Your Gender Instead :
                </label>
              </div>
              <div className="flex h-6 items-center">
                <input
                ref={CustomGenderRef}
                  id="Customgender"
                  name="Customgender"
                  type="text"
                  disabled={LOADING}
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
                        className="text-base mr-2 font-bold text-white"
                      >
                        write Your Sexuality :
                      </label>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                      ref={SexuailtyRef}
                        id="Sexuality"
                        name="sexuality"
                        type="text"
                        disabled={LOADING}
                        placeholder=" Straight / Lesbian / Bi-Sexual ...."
                        className={`h-6 sm:h-8 w-52 placeholder:text-[12px] pl-2 md:w-64 rounded-[5px] border-pink-500 border-2 ${LOADING?'text-white':'text-pink-600'} outline-none md:text-base md:p-2 md:pl-3`}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...PersonalInfo,
                            sexuality: e.target.value,
                          })
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
                  <div className="relative   lg:flex-row md:flex-col md:gap-5 lg:gap-0 items-center flex gap-x-3">
                    <div className="text-xs sm:text-sm md:text-base leading-6">
                      <label
                        htmlFor="Occupation"
                        className="text-white text-base mr-2 font-bold"
                      >
                        Your Current Work State :
                      </label>
                    </div>
                    <div className="flex h-6 items-center">
                      <input
                      ref={OccupationRef}
                        id="Occupation"
                        name="Occupation"
                        type="text"
                        placeholder="ex:-Student/SoftwareDev/....."
                        disabled={LOADING}
                        className={`h-6 sm:h-8 w-52 placeholder:text-[14px] pl-2 md:w-56 rounded-[5px] border-pink-500 border-2 ${LOADING?'text-white':'text-pink-600'} outline-none md:text-base md:p-2 md:pl-3`}
                        onChange={(e) =>
                          setPersonalInfo({
                            ...PersonalInfo,
                            occupation: e.target.value,
                          })
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
                    interests.includes("Music")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Music
                </span>
                <span
                  onClick={() => HandleInterests("Sports and Fitness")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Sports and Fitness")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Sports and Fitness
                </span>
                <span
                  onClick={() => HandleInterests("Travel and Adventure")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Travel and Adventure")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Travel and Adventure
                </span>
                <span
                  onClick={() => HandleInterests("Food and Cooking")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Food and Cooking")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Food and Cooking
                </span>
                <span
                  onClick={() => HandleInterests("Arts and Culture")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Arts and Culture")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Arts and Culture
                </span>
                <span
                  onClick={() => HandleInterests("Outdoor Activities")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Outdoor Activities")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Outdoor Activities
                </span>
                <span
                  onClick={() => HandleInterests("Technology and Gaming")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Technology and Gaming")
                      ? "bg-gradient-to-r from-pink-700 to-rose-200 text-white"
                      : "border-2 border-pink-300 bg-transparent text-white"
                  } hover:bg-gradient-to-r from-pink-700 to-rose-200  rounded-[5px] items-center p-2 cursor-pointer  hover:text-white md:p-3 flex justify-center`}
                >
                  Technology and Gaming
                </span>
                <span
                  onClick={() => HandleInterests("Books and Literature")}
                  className={` hover:border-pink-500 ${
                    interests.includes("Books and Literature")
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

      <div className="mt-3 relative flex flex-col items-center gap-3 ml-[50%] mb-[50px]">
        <button
          type="submit"
          className="rounded-md w-[120px]  md:w-[170px] bg-pink-600 px-3 py-2 text-sm md:text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          onClick={HandleSave}
        >
          Save
        </button>  
       <span className={`${Error!==''?'':'hidden'} text-red-700 font-bold`}>{Error}*</span>
       <div className={`${LOADING?'cursor-none':'hidden'} absolute right-0 top-1`}>
                   <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-pink-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                   </svg>
                     </div>
       </div>
    </form>
  );
}
