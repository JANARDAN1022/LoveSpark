import { useState, useRef, useEffect,useContext,useCallback } from "react";
import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { Country } from "country-state-city";
import { useAppDispatch } from "../../Hooks";
import { UpdateUser } from "../../Actions/userAction";
import { useAppSelector } from "../../Hooks";
import {ref,uploadBytes,getDownloadURL} from 'firebase/storage';
import { storage } from "../../firebase";
import {v4} from 'uuid';
import { MainPageContext } from "../../Context/MainPageContext";
import axios from "axios";
//import ImageCompressor from "image-compressor";
//import { LazyLoadImage } from "react-lazy-load-image-component";

export default function Example() {
  const [ProfilePic, setProfilePic] = useState<any | null>(null);
  const [CoverPic, setCoverPic] = useState<any | null>(null);
  const {setUsers} = useContext(MainPageContext);
 
 const [PersonalInfo, setPersonalInfo] = useState({
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
  const [interests, setinterests] = useState<string[]>([]);
  const [Error,setError]=useState('');
  const MaleRef = useRef<HTMLInputElement>(null);
  const FemaleRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const Navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);
  const Id = user?._id;
 

  const Status = user?.ProfileStatus && user?.ProfileStatus;
  
  const AllUsers = useCallback(async () => {
    if(Id){
    const route = `http://localhost:5000/api/Users/All/${Id}`;
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
    setPersonalInfo({ ...PersonalInfo, Gender: "Male" });
  };

  const HandleFemaleGender = () => {
    if (MaleRef.current !== null) {
      MaleRef.current.checked = false;
      setPersonalInfo({ ...PersonalInfo, Gender: "Female" });
    }
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
    if (interests.includes(Interest)) {
      setinterests(interests.filter((INT) => INT !== Interest));
    } else if (interests.length === 4) {
      setinterests([...interests]);
    } else {
      setinterests([...interests, Interest]);
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
  
  
  const HandleSave = (e: any) => {
    e.preventDefault();
    const isEmpty = Object.values(PersonalInfo).some((value, index) => {
      if (index === Object.keys(PersonalInfo).indexOf("LastName")) {
        return false; // Skip the LastName field
      }
      return value === "";
    });
    
    if (isEmpty) {
      setError('Please Provide All Required Fields');
      setTimeout(() => {
        setError('');
      }, 3000);
    } else if (Id && !isEmpty && ProfilePic !== null && CoverPic !== null && interests.length >= 2) {
      const profileRef = ref(storage, `ProfilePics/${ProfilePic.name + v4() + user.FirstName}`);
      const CoverRef = ref(storage, `CoverPics/${CoverPic.name + v4() + `123#` + user.FirstName}`);
  
      // Upload the profile picture and cover picture to Firebase Storage
      Promise.all([uploadBytes(profileRef, ProfilePic), uploadBytes(CoverRef, CoverPic)])
        .then((snapshots) => {
          // Get the download URLs for both images
          const [profileSnapshot, coverSnapshot] = snapshots;
          return Promise.all([getDownloadURL(profileSnapshot.ref), getDownloadURL(coverSnapshot.ref)]);
        })
        .then((urls) => {
          const [profileUrl, coverUrl] = urls;
  
          // Update the User object with the correct ProfileUrl and CoverUrl
          const updatedUser = {
            ...PersonalInfo,
            interests,
            ProfileUrl: profileUrl,
            CoverUrl: coverUrl,
          };
  
          // Dispatch the updated User object to update the user's profile in the database
          dispatch(UpdateUser({ id: Id, data: updatedUser }));
  
          // Navigate to the MainPage after the dispatch is complete
          Navigate("/MainPage");
        })
        .catch((error) => {
          console.error("Error uploading images:", error);
        });
    }
  };
  return (
    <form className="flex flex-col items-center  justify-center  bg-gradient-to-r from-pink-600 to-rose-400">
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
            <div className="sm:col-span-4">
              <label
                htmlFor="Firstname"
                className="block text-sm md:text-2xl  font-medium leading-6 text-white"
              >
                FirstName
              </label>
              <div className="mt-2">
                <div className="flex rounded-[5px]  sm:max-w-md">
                  <input
                    type="text"
                    name="username"
                    id="Firstname"
                    autoComplete="username"
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-600 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-[rgba(255,255,255,0.7)]  sm:text-sm sm:leading-6"
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
                    className="block outline-none border-2 border-pink-400 rounded-[3px] focus:border-pink-600 flex-1 bg-transparent py-1.5 pl-1 md:pl-5 text-white placeholder:text-[rgba(255,255,255,0.7)]  sm:text-sm sm:leading-6"
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
                  id="about"
                  name="about"
                  rows={6}
                  className="block border-2 border-pink-500 focus:border-pink-700 pl-5 outline-none w-full rounded-md overflow-hidden resize-none max-h-[300px] py-1.5 text-pink-500  placeholder:text-pink-500  sm:text-sm md:text-[18px] sm:leading-6"
                  defaultValue={""}
                  placeholder="example:-  your Hobbies/ What You Do For Fun / What are You Looking For......."
                  onChange={(e) =>
                    setPersonalInfo({ ...PersonalInfo, bio: e.target.value })
                  }
                />
              </div>
              <p className="mt-3 text-sm md:text-[16px] leading-6 text-[rgba(255,255,255,0.7)]">
                Write a few sentences about yourself.
              </p>
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

        <div className="pb-12">
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
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  onChange={(e) =>
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
                    })
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

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="city"
                className="block text-sm font-medium leading-6 text-white"
              >
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
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
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="region"
                className="block text-sm font-medium leading-6 text-white"
              >
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-[rgba(255,255,255,0.7)] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setPersonalInfo({
                      ...PersonalInfo,
                      Location: [
                        { ...PersonalInfo.Location[0], State: e.target.value },
                      ],
                    })
                  }
                />
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
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-pink-500 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-[rgba(255,255,255,0.7)] focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) =>
                    setPersonalInfo({
                      ...PersonalInfo,
                      pincode: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 items-center">
            <h3 className="text-white font-bold">Your Age:</h3>
            <input type="number"  onChange={(e)=>setPersonalInfo({...PersonalInfo,age:e.target.value.toString()})} className="w-[60px] pl-4 outline-none text-pink-500 h-[30px] rounded-[5px]"/>
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
                  className="h-8 w-32 rounded-[5px] border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2"
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
                        placeholder="ex:- Straight or Lesbian Or Bi or...."
                        className="h-6 sm:h-8 w-52 placeholder:text-[12px] pl-2 md:w-64 rounded-[5px] border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2 md:pl-3"
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
                        placeholder="ex:-Student/SoftwareDev/....."
                        className="h-6 sm:h-8 w-52 placeholder:text-[14px] pl-2 md:w-56 rounded-[5px] border-pink-500 border-2 text-pink-600 outline-none md:text-base md:p-2 md:pl-3"
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

      <div className="mt-3 flex flex-col items-center gap-3 ml-[50%] mb-[50px]">
        <button
          type="submit"
          className="rounded-md w-[120px]  md:w-[170px] bg-pink-600 px-3 py-2 text-sm md:text-lg font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
          onClick={HandleSave}
        >
          Save
        </button>  
       <span className={`${Error!==''?'':'hidden'} text-red-700 font-bold`}>{Error}*</span>
       </div>
    </form>
  );
}
