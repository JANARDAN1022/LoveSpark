import type React from "react";
import { useState, useRef, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { unwrapResult } from "@reduxjs/toolkit";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PersonalInfoType } from "../../Types/UserTypes";
import { MainPageContext } from "../../Context/MainPageContext";
import { useAppDispatch, useAppSelector } from "../../Hooks";
import { storage } from "../../firebase";
import { UpdateUser } from "../../Actions/userAction";
import PersonalInfo from "../ProfileCompletion/PersonalInfo";
import PhotoUpload from "../ProfileCompletion/PhotoUpload";
import LocationInfo from "../ProfileCompletion/LocationInfo";
import GenderSexuality from "../ProfileCompletion/GenderSexuality";
import Interests from "../ProfileCompletion/Interests";

const ProfileCompletion: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoType>({
    FirstName: "",
    LastName: "",
    bio: "",
    Location: [{ country: "", State: "", city: "" }],
    pincode: "",
    Gender: "",
    sexuality: "",
    occupation: "",
    age: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUsers } = useContext(MainPageContext);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  const firstNameRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);
  const stateRef = useRef<HTMLSelectElement>(null);
  const cityRef = useRef<HTMLSelectElement>(null);
  const postalRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const sexualityRef = useRef<HTMLInputElement>(null);
  const occupationRef = useRef<HTMLInputElement>(null);

  const Status = user?.ProfileStatus && user?.ProfileStatus;

  useEffect(() => {
    const body = document.body;
    body.style.overflowY = "scroll";
    body.style.overflowX = "hidden";
    AllUsers();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      if (Status && Status === "Complete") {
        navigate("/MainPage");
      }
    } else {
      navigate("/");
    }
  }, [user]);

  const AllUsers = async () => {
    if (user?._id) {
      const route = `https://love-spark.vercel.app/api/Users/All/${user._id}`;
      const config = {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      };
      try {
        const { data } = await axios.get<any>(route, config);
        setUsers(data.users);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("cilciked,info:-", personalInfo, profilePic, coverPic);
    const scrollToAndFocus = (
      fieldRef: React.RefObject<HTMLElement> | null,
      focusRef?: React.RefObject<HTMLElement> | null
    ) => {
      if (fieldRef && fieldRef.current) {
        fieldRef.current.scrollIntoView({ behavior: "smooth" });
        if (focusRef && focusRef.current) {
          focusRef.current.focus({ preventScroll: true });
        }
      }
    };
    if (
      user &&
      user._id &&
      profilePic !== null &&
      coverPic !== null &&
      interests.length >= 2
    ) {
      const profileRef = ref(
        storage,
        `ProfilePics/${profilePic.name + user._id + user.FirstName}`
      );
      const CoverRef = ref(
        storage,
        `CoverPics/${coverPic.name + user._id + `123#` + user.FirstName}`
      );

      try {
        setLoading(true);
        // Upload the profile picture and cover picture to Firebase Storage
        const snapshots = await Promise.all([
          uploadBytes(profileRef, profilePic),
          uploadBytes(CoverRef, coverPic),
        ]);
        // Get the download URLs for both images
        const [profileSnapshot, coverSnapshot] = snapshots;
        const urls = await Promise.all([
          getDownloadURL(profileSnapshot.ref),
          getDownloadURL(coverSnapshot.ref),
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
        const response = await dispatch(
          UpdateUser({ id: user._id, data: updatedUser })
        );
        const result = unwrapResult(response); // Unwrap the result to get the action payload

        if (result?.success) {
          setLoading(false);
          navigate("/MainPage");
        } else {
          setLoading(false);
          setError("Save Failed Try Again");
        }
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    } else if (!personalInfo.FirstName) {
      scrollToAndFocus(firstNameRef);
    } else if (!personalInfo.bio) {
      scrollToAndFocus(firstNameRef, bioRef);
    } else if (!personalInfo.Location[0].country) {
      scrollToAndFocus(countryRef);
    } else if (!personalInfo.Location[0].State) {
      scrollToAndFocus(stateRef);
    } else if (!personalInfo.Location[0].city) {
      scrollToAndFocus(cityRef);
    } else if (!personalInfo.pincode) {
      scrollToAndFocus(postalRef);
    } else if (!personalInfo.age) {
      scrollToAndFocus(ageRef);
    } else if (!personalInfo.sexuality) {
      scrollToAndFocus(sexualityRef);
    } else if (!personalInfo.occupation) {
      scrollToAndFocus(occupationRef);
    } else if (profilePic === null || coverPic === null) {
      setError("Please Provide Both Required Photos");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (!personalInfo.Gender || personalInfo.Gender === "") {
      setError("Please Provide Your Gender");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (interests.length < 2) {
      setError("Please Provide Atleast Two Interests");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else {
      console.log(
        "here:-",
        user?._id,
        profilePic,
        coverPic,
        interests.length >= 2
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-600 text-white p-8"
    >
      <h1 className="text-4xl font-bold text-center mb-10">
        Complete Your Profile
      </h1>
      <form className="max-w-3xl mx-auto space-y-12">
        <PersonalInfo
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          firstNameRef={firstNameRef}
          bioRef={bioRef}
        />
        <PhotoUpload
          profilePic={profilePic}
          setProfilePic={setProfilePic}
          coverPic={coverPic}
          setCoverPic={setCoverPic}
        />
        <LocationInfo
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          countryRef={countryRef}
          stateRef={stateRef}
          cityRef={cityRef}
          postalRef={postalRef}
        />
        <GenderSexuality
          personalInfo={personalInfo}
          setPersonalInfo={setPersonalInfo}
          ageRef={ageRef}
          sexualityRef={sexualityRef}
          occupationRef={occupationRef}
        />
        <Interests interests={interests} setInterests={setInterests} />
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-pink-500 rounded-full text-white font-semibold shadow-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </motion.button>
        </div>
        {error && <p className="text-red-400 text-center">{error}</p>}
      </form>
    </motion.div>
  );
};

export default ProfileCompletion;
