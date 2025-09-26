import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/AuthStore";
import userApi from "../Services/UserApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services/AuthApi";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";
import { useUserDataStore } from "../Services/useUserDataStore ";

export default function Home() {
  const {
    displayUsername,
    profileImgUrl,
    followersCount,
    followingCount,
    setUserData,
    resetUserData,
  } = useUserDataStore();

  const authLogOut = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await userApi.get("me");

        if (response.status === 200) {
          console.log(response.data)
          setUserData(response.data);
        } else {
          authLogOut();
          resetUserData();
        }
      } catch (err) {
        if (err.response?.status === 401) {
          authLogOut();
          resetUserData();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setUserData, authLogOut, navigate, resetUserData]);
  console.log(profileImgUrl)

  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthApi.post("logout");
      if (response.status === 200) {
        authLogOut();
        resetUserData();
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col 2xl:flex-row gap-8 sm:w-3/4 mx-auto w-full">
      <div className="min-h-screen flex-1 text-white p-6 flex flex-col gap-6 bg-gray-900/60 rounded-2xl 2xl:w-3/4 shadow-lg relative">
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 gap-2 flex-col">
          <div className="flex items-center gap-3 w-full">
            <img
              className="cursor-pointer rounded-full w-20 h-20 border-2 border-cyan-600 shadow"
              src={!setLoading && profileImgUrl ? profileImgUrl : defaultProfileImg}
              alt="Profile"
            />
            <h1 className="text-2xl font-bold">{displayUsername}</h1>
          </div>

          <div className="flex text-xl mt-2 w-full xl:w-3/5 justify-evenly items-center border-1 rounded-2xl">
            <div className="flex justify-center items-center flex-col">
              <p>Followers</p>
              <p>{followersCount}</p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <p>Following</p>
              <p>{followingCount}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="text-md bg-red-500 hover:bg-red-700 px-5 py-2 rounded-xl shadow transition-all absolute right-6 top-8"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col gap-6 mt-6">
          <h2 className="text-xl font-semibold text-cyan-400">
            Welcome back 👋
          </h2>
          <p className="text-gray-300">
            Explore your feed, find new friends and stay connected!
          </p>
        </div>
      </div>

      {/* Friend recommendations */}
      <FriendRecommendations />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
