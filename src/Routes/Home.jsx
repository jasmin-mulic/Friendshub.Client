import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import userApi from "../Services/Api/UserApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services//Api/AuthApi";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";
import { useUserDataStore } from "../Services/Stores/useUserDataStore ";
import Post from "../Components/Post";

export default function Home() {
  const {
    displayUsername,
    postCount,
    profileImgUrl,
    followersCount,
    followingCount,
    setUserData,
    resetUserData,
  } = useUserDataStore();

  const authLogOut = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() =>{
    const getPosts = async() =>{
      try {
        const postResponse = await userApi.get("my-posts");
        console.log(postResponse.data)
      } catch (error) {
          console.log(error.response.data)
      }
    }
    getPosts();
  },[])
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const myDataResponse = await userApi.get("me");

        if (myDataResponse.status === 200) {
          console.log(myDataResponse.data)
          setUserData(myDataResponse.data);
          
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
      <div className="min-h-screen flex-1 text-white p-6 flex flex-col gap-6  rounded-2xl 2xl:w-3/4 shadow-lg relative bg-blue-200/5">
        <div className="flex justify-around items-evenly border-b border-gray-700 pb-4 gap-2 flex-col ">
          <div className="flex justify-center gap-3 w-full">
            <div className="w-50 flex flex-col gap-2 items-center">
            <img
              className="cursor-pointer rounded-full w-20 h-20 border-2 border-cyan-600 shadow"
              src={profileImgUrl ? profileImgUrl : defaultProfileImg}
              alt="Profile"
            />
            <h1 className="text-2xl font-bold">{displayUsername}</h1>

            </div>
          <div className="flex text-xl w-full justify-center gap-10 items-center border-1 rounded-2xl h-18 mt-5 border-blue-400/50">
            <div className="flex justify-center items-center flex-col">
              <p>Followers</p>
              <p>{followersCount}</p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <p>Following</p>
              <p>{followingCount}</p>
            </div>
                        <div className="flex justify-center items-center flex-col">
              <p>Posts</p>
              <p>{postCount}</p>
            </div>
          </div>

          </div>

          <button
            onClick={logout}
            className="text-md bg-red-500 hover:bg-red-700 px-5 py-2 rounded-xl shadow transition-all absolute right-6 top-12"
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
