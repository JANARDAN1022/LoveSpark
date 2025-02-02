import type React from "react";
import { motion } from "framer-motion";
import type { PersonalInfoType } from "../../Types/UserTypes";

interface GenderSexualityProps {
  personalInfo: PersonalInfoType;
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType>>;
  ageRef: React.RefObject<HTMLInputElement>;
  sexualityRef: React.RefObject<HTMLInputElement>;
  occupationRef: React.RefObject<HTMLInputElement>;
}

const GenderSexuality: React.FC<GenderSexualityProps> = ({
  personalInfo,
  setPersonalInfo,
  ageRef,
  sexualityRef,
  occupationRef,
}) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Gender & Sexuality</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p>Gender</p>
          <div className="flex space-x-4">
            {["Male", "Female", "Other"].map((gender) => (
              <motion.button
                type="button"
                key={gender}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full ${
                  personalInfo.Gender === gender
                    ? "bg-pink-500"
                    : "bg-white bg-opacity-20"
                }`}
                onClick={() =>
                  setPersonalInfo({ ...personalInfo, Gender: gender })
                }
              >
                {gender}
              </motion.button>
            ))}
          </div>
        </div>
        <input
          ref={sexualityRef}
          type="text"
          placeholder="Sexuality"
          value={personalInfo.sexuality}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, sexuality: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          ref={occupationRef}
          type="text"
          placeholder="Occupation"
          value={personalInfo.occupation}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, occupation: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          ref={ageRef}
          type="number"
          placeholder="Age"
          value={personalInfo.age}
          onChange={(e) =>
            setPersonalInfo({ ...personalInfo, age: e.target.value })
          }
          className="bg-white bg-opacity-20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
    </motion.section>
  );
};

export default GenderSexuality;
