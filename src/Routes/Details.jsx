import { useEffect, useState } from "react";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import UsersApi from "../Services/Api/UsersApi";
import Navbar from "../Components/Navbar";
import { useForm, Controller } from "react-hook-form";
import AnimatedToggle from "../Components/AnimatedToggle";
import { useNavigate } from "react-router-dom";
import { getUserIdFromStorage } from "../Helpers";

export default function EditProfile() {

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: null,
    emailAddress: null,
    profileImageUrl: null,
    privateAccount: null
  })
  const [preview, setPreview] = useState(userData.profileImageUrl || defaultProfileImg);
  const navigate = useNavigate();
  const userId = getUserIdFromStorage()
  const loadUserData = async () => {
    try {
      const res = await UsersApi.myData()
      if (res.status == 200) {

        const userDetails = res.data;
        setUserData(userDetails)
        reset({
          username: userDetails.username,
          emailAddress: userDetails.emailAddress,
          privateAccount: userDetails.privateAccount,
          profileImageUrl: userDetails.profileImageUrl
        })
        setPreview(userDetails.profileImageUrl)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    loadUserData();
  }, [])

  const { control, register, handleSubmit, formState, reset } = useForm({
    defaultValues: {
      username: userData.username,
      emailAddress: userData.emailAddress,
      privateAccount: userData.privateAccount,
      profileImageUrl: userData.profileImageUrl,
    },
  });
  const { errors } = formState;

  const onSubmit = async (data) => {
    
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("emailAddress", data.emailAddress);
    formData.append("privateAccount", data.privateAccount);
    if (data.profileImg) 
      formData.append("profileImageUrl", data.profileImageUrl);
    
    try {
      const updateResponse = await UsersApi.updateUserInfo(userId, formData)
      console.log(updateResponse.status)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="text-white overflow-y-hidden bg-gray-800/20 h-full ">
      <Navbar className="absolute" />
      <div className="min-h-screen flex bg-gray-900/20 p-4 flex-col justify-center items-center ">
        <div className="bg-gray-800/30 border-gray-700/50 backdrop-blur-md rounded-2xl p-6 w-full max-w-md text-gray-200 ">
          <h2 className="text-2xl font-semibold mb-6 text-white text-center">
            Edit Profile
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mx-auto"
          >
            <div className="flex flex-col items-center">
              <img
                src={preview}
                className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-gray-600"
              />

              <Controller
                name="profileImageUrl"
                control={control}
                render={({ field }) => (
                  <label className="cursor-pointer text-cyan-400 hover:underline">
                    Change Profile Picture
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        field.onChange(file || null);
                        if (file) setPreview(URL.createObjectURL(file));
                      }}
                    />
                  </label>
                )}
              />
            </div>

            <div className="flex flex-col h-20">
              <label className="text-gray-400 mb-1">Username</label>
              <input
                type="text"
                {...register("username", { required: "Enter your username" })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
                placeholder="Enter your username"
              />
              {errors.username && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="flex flex-col h-20">
              <label className="text-gray-400 mb-1">Email address</label>
              <input
                name="emailAddress"
                type="email"
                {...register("emailAddress", {
                  required: "Email je obavezan",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address."
                  }
                })}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400"
                placeholder="Enter your email"
              />
              <span className="text-red-400 text-sm mt-1">
                {errors.emailAddress?.message}
              </span>
            </div>

            {/* PRIVATE ACCOUNT TOGGLE */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-300 font-medium">Private account</span>
              <Controller
                name="privateAccount"
                control={control}
                render={({ field }) => (
                  <AnimatedToggle
                    isChecked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
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
