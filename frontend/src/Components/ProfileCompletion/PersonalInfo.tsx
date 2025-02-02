import type React from "react";
import { motion } from "framer-motion";
import type { PersonalInfoType } from "../../Types/UserTypes";

interface PersonalInfoProps {
  personalInfo: PersonalInfoType;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType>>;
  firstNameRef: React.RefObject<HTMLInputElement>;
  bioRef: React.RefObject<HTMLTextAreaElement>;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  personalInfo,
  setPersonalInfo,
  firstNameRef,
  bioRef,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          ref={firstNameRef}
          type="text"
          placeholder="First Name"
          value={personalInfo.FirstName}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, FirstName: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={personalInfo.LastName}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, LastName: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <textarea
        ref={bioRef}
        placeholder="About you"
        value={personalInfo.bio}
        onChange={(e) =>
          setPersonalInfo({ ...personalInfo, bio: e.target.value })
        }
        className="w-full bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 h-32"
      />
    </motion.section>
  );
};

export default PersonalInfo;
