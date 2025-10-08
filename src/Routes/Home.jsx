import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import PostsApi from "../Services/Api/PostsApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services//Api/AuthApi";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import Feed from "../Components/Feed";
import "../../src/index.css";
import AddPost from "../Components/AddPost";
import { Link } from "react-router-dom";
import { LogOut, Home as HomeIcon, User } from "lucide-react";

export default function Home() {
  const {
    username,
    postCount,
    profileImgUrl,
    followersCount,
    followingCount,
    setUserData,
    resetUserData,
  } = useUserDataStore();

  const authLogOut = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [recommendationList, setRecommendationList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const navigate = useNavigate();
  const storeLogout = useAuthStore.getState().logout;

  const pushNewPost =(newPost) =>{
    alert("Pushing new post")
    setFeedPosts((prev) => [newPost, ...prev])
  }
  const nextPage = async () =>{

        const data = await getPosts(feedPage + 1)
        if(data.totalCount === feedPosts.length)
          alert("That's all.")
        else{

          const newData = [...feedPosts ];
          console.log(data)
          newData.push(...data.items);
          setFeedPosts(newData)
          if(newData.length <= data.totalCount)
            setFeedPage((prev) => prev +1)
        }
  }

  const getPosts = async (page) => {
    try {
      const postFeedResponse = await PostsApi.getFeedPosts(page);

      if (postFeedResponse.status == 200) {
        return postFeedResponse.data
      }
    } catch (error) {
      storeLogout();
      navigate("login");
      console.log(error);
    }
  };
  const fetchRecommendations = async () => {
    try {
      const response = await UsersApi.followRecommendations();
      if (response.status === 200)
        {
        } setRecommendationList(response.data || []);
        
      } catch (error) {
        console.log(error);
      }
    };
    
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPosts = async() =>{
      const data = await getPosts(feedPage);
      setFeedPosts(data.items)
    }
    fetchPosts()
    fetchRecommendations()
    getData();
  }, []);


  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthApi.logout();
      if (response.status === 200) {
        storeLogout();
        resetUserData();
        navigate("login");
      }
    } catch (error) {
      localStorage.removeItem("token")
      storeLogout();
      resetUserData();
      navigate("login");
    } finally {
      setLoading(false);
    }
  };

  const func = (id) => {
    let filteredList = recommendationList.filter((x) => x.id != id);
    setRecommendationList(filteredList);
  };
 return (
    <div className="flex flex-col min-h-screen bg-gray-900/60 text-white">

      <nav className="flex justify-between items-center px-6 py-3 bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <HomeIcon size={20} /> Home
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <User size={20} /> Profile
          </Link>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      <div className="flex flex-col 2xl:flex-row gap-8 w-full xl:w-4/5 2xl:w-3/5 mx-auto py-8">
        <div className="flex-1 text-white p-6 flex flex-col gap-6 rounded-2xl shadow-lg bg-gray-800/20 backdrop-blur-sm relative">
          {/* Profile Info */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                className="cursor-pointer rounded-full w-14 h-14 border-2 border-cyan-600 shadow"
                src={profileImgUrl ? profileImgUrl : defaultProfileImg}
                alt="Profile"
              />
              <div>
                <p className="font-bold text-gray-100">{username}</p>
                <div className="flex gap-4 text-sm text-gray-300 mt-1">
                  <span>Followers: {followersCount}</span>
                  <span>Following: {followingCount}</span>
                  <span>Posts: {postCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Add post trigger */}
          <div
            className="text-gray-300 bg-gray-700/40 rounded-md h-15 xl:h-20 px-3 py-4 hover:bg-gray-700/60 cursor-pointer transition relative"
            onClick={() => setShowAddForm(true)}
          >
            <p>Share something...</p>
          </div>

          {/* Feed */}
          <Feed loadMorePosts={nextPage} posts={feedPosts} />
        </div>

        <div className="w-full 2xl:w-1/3">
          {recommendationList.length > 0 && (
            <FriendRecommendations
              recommendationList={recommendationList}
              handleFollow={func}
            />
          )}
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Add post modal */}
      {showAddForm && (
        <AddPost
          setClose={() => setShowAddForm(false)}
          pushNewPost={pushNewPost}
        />
      )}
    </div>
  );
}