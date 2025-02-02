import type React from "react";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

interface PhotoUploadProps {
  profilePic: File | null;
  setProfilePic: React.Dispatch<React.SetStateAction<File | null>>;
  coverPic: File | null;
  setCoverPic: React.Dispatch<React.SetStateAction<File | null>>;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  profilePic,
  setProfilePic,
  coverPic,
  setCoverPic,
}) => {
  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPhoto: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Profile Photos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <p>Profile Picture</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-full h-40 bg-white bg-opacity-20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() =>
              document.getElementById("profile-pic-input")?.click()
            }
          >
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic) || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera size={40} />
            )}
          </motion.div>
          <input
            id="profile-pic-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoChange(e, setProfilePic)}
          />
        </div>
        <div className="space-y-2">
          <p>Cover Photo</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-full h-40 bg-white bg-opacity-20 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
            onClick={() => document.getElementById("cover-pic-input")?.click()}
          >
            {coverPic ? (
              <img
                src={URL.createObjectURL(coverPic) || "/placeholder.svg"}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaCamera size={40} />
            )}
          </motion.div>
          <input
            id="cover-pic-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handlePhotoChange(e, setCoverPic)}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default PhotoUpload;
