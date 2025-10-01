import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services//Api/AuthApi";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";
import { useUserDataStore } from "../Services/Stores/useUserDataStore ";
import Feed from "../Components/Feed";
import AddPost from "../Components/AddPost";
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
  const[recommendationsList, setRecommendationsList] = useState([])
  const navigate = useNavigate();

    useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await UsersApi.followRecommendations();
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
        const profileDataInfo = await UsersApi.myData();
        
        if (profileDataInfo.status === 200) {
          setUserData(profileDataInfo.data);
          
        } else {
          authLogOut();
          resetUserData();
        }
      } catch (err) {
          console.log("Me api -> ", err.response)
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
    <div className="flex flex-col-reverse 2xl:flex-row gap-8 sm:w-3/5 mx-auto w-full h-s overflow-hidden ">
      {recommendationsList.length > 0 && <FriendRecommendations data = {recommendationsList} handleFollowChange = {func} />}
      <div className="min-h-screen flex-1 text-white p-6 flex flex-col gap-6  rounded-2xl 2xl:w-3/4 shadow-lg relative bg-gray-500/10">
        <div className="flex justify-around items-evenly border-gray-700 gap-2 flex-col">
          <div className="flex justify-start items-start  flex-col md:flex-row  h-20 ">
            <div className="p-2 flex flex-col gap-3 items-center w-full md:w-1/6">
            <img
              className="cursor-pointer rounded-full w-10 h-10 border-2 border-cyan-600 shadow"
              src={profileImgUrl ? profileImgUrl : defaultProfileImg}
              alt="Profile"
            />
            <span className="text-sm font-bold">{displayUsername}</span>

            </div>
          <div className="flex text-xl justify-center md:justify-start gap-10 items-center rounded-2xl mt-5 md:w-2/4 w-full">
            <div className="flex justify-center items-center flex-col">
              <p className="text-sm">Followers</p>
              <p className="text-sm">{followersCount}</p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <p className="text-sm">Following</p>
              <p className="text-sm">{followingCount}</p>
            </div>
                        <div className="flex justify-center items-center flex-col">
              <p className="text-sm">Posts</p>
              <p className="text-sm">{postCount}</p>
            </div>
          </div>
          </div>

          <button
            onClick={logout}
            className="text-md bg-red-500 hover:bg-red-700 px-3 py-1  rounded-xl shadow transition-all absolute text-sm right-6 top-12"
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
      <AddPost />
    </div>
  );
}
