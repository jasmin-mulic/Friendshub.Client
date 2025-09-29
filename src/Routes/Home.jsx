import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import usersApi from "../Services/Api/UserApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services//Api/AuthApi";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";
import { useUserDataStore } from "../Services/Stores/useUserDataStore ";
import Feed from "../Components/Feed";
import "../../src/index.css"

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
  const [posts, setPosts] = useState([])
  const[recommendationsList, setRecommendationsList] = useState([])
  const navigate = useNavigate();

    useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await usersApi.get("follow-recommendations");
        if (response.status === 200) 
          setRecommendationsList(response.data);
      } catch (error) {
        console.log(error.response)
      }
    };
    fetchRecommendations();
  }, []);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const profileDataInfo = await usersApi.get("me");
        
        if (profileDataInfo.status === 200) {
          setUserData(profileDataInfo.data);
          
        } else {
          authLogOut();
          resetUserData();
        }
      } catch (err) {
          console.log("Me api -> ", error.response)
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [setUserData, authLogOut, navigate, resetUserData]);

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
  const func = (id) =>{
    let filteredList = recommendationsList.filter((x) => x.id != id)
    setRecommendationsList(filteredList)
  }
  return (
    <div className="flex flex-col-reverse 2xl:flex-row gap-8 sm:w-3/4 mx-auto w-full h-s overflow-hidden ">
      {recommendationsList.length > 0 && <FriendRecommendations data = {recommendationsList} handleFollowChange = {func} />}
      <div className="min-h-screen flex-1 text-white p-6 flex flex-col gap-6  rounded-2xl 2xl:w-3/4 shadow-lg relative bg-gray-500/10 ">
        <div className="flex justify-around items-evenly border-b border-gray-700 pb-4 gap-2 flex-col">
          <div className="flex justify-start items-start  flex-col md:flex-row ">
            <div className="p-2 flex flex-col gap-3 items-center w-full md:w-1/6">
            <img
              className="cursor-pointer rounded-full w-15 h-15 border-2 border-cyan-600 shadow"
              src={profileImgUrl ? profileImgUrl : defaultProfileImg}
              alt="Profile"
            />
            <h1 className="text-md font-bold">{displayUsername}</h1>

            </div>
          <div className="flex text-xl ps-4 justify-center md:justify-start gap-10 items-center rounded-2xl h-18 mt-5 md:w-2/4 w-full">
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
    <Feed />

      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
