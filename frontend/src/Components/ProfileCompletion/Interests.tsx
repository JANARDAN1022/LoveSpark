import type React from "react";
import { motion } from "framer-motion";

interface InterestsProps {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
}

const interestOptions = [
  "Music",
  "Sports and Fitness",
  "Travel and Adventure",
  "Food and Cooking",
  "Arts and Culture",
  "Outdoor Activities",
  "Technology and Gaming",
  "Books and Literature",
];

const Interests: React.FC<InterestsProps> = ({ interests, setInterests }) => {
  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else if (interests.length < 4) {
      setInterests([...interests, interest]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Your Interests</h2>
      <p className="text-sm text-pink-200">Choose 2-4 interests</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {interestOptions.map((interest) => (
          <motion.button
            type="button"
            key={interest}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm ${
              interests.includes(interest)
                ? "bg-pink-500 text-white"
                : "bg-white bg-opacity-20 text-white"
            }`}
            onClick={() => toggleInterest(interest)}
          >
            {interest}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
};

export default Interests;
