import { useState } from "react";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import UsersApi from "../Services/Api/UsersApi";
import Navbar from "../Components/Navbar";

export default function EditProfile() {
  const { username: currentUsername, profileImgUrl, setUserData } = useUserDataStore();
  const [username, setUsername] = useState(currentUsername);
  const [profileImg, setProfileImg] = useState(profileImgUrl || defaultProfileImg);
  const [preview, setPreview] = useState(profileImg);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (profileImg instanceof File) formData.append("profileImg", profileImg);

      const response = await UsersApi.updateProfile(formData);
      if (response.status === 200) {
        setUserData(response.data);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white overflow-y-hidden bg-gray-800/20 ">
        <Navbar className="absolute" />
    <div className="min-h-screen flex bg-gray-900/20 p-4 flex-col justify-center items-center ">
      <div className="bg-gray-800/30   border-gray-700/50 backdrop-blur-md rounded-2xl p-6 w-full max-w-md text-gray-200 ">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mx-auto">
          {/* Profilna slika */}
          <div className="flex flex-col items-center">
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-600"
            />
            <label className="cursor-pointer text-cyan-400 hover:underline">
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Username */}
          <div className="flex flex-col">
            <label className="text-gray-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
              placeholder="Enter your username"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg py-2 mt-2 transition-colors"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
