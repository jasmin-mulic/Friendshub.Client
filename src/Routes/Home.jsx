import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import PostsApi from "../Services/Api/PostsApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services//Api/AuthApi";
import { useNavigate, Link } from "react-router-dom";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import FriendRecommendations from "../Components/FriendRecommendations";
import Feed from "../Components/Feed";
import AddPost from "../Components/AddPost";
import { LogOut, Home as HomeIcon, User } from "lucide-react";
import "../../src/index.css";

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
  const storeLogout = useAuthStore.getState().logout;
  const [loading, setLoading] = useState(false);
  const [recommendationList, setRecommendationList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const navigate = useNavigate();

  const pushNewPost = (newPost) => {
    setFeedPosts((prev) => [newPost, ...prev]);
  };

  const nextPage = async () => {
    const data = await getPosts(feedPage + 1);
    if (data.totalCount === feedPosts.length) return;
    const newData = [...feedPosts, ...data.items];
    setFeedPosts(newData);
    if (newData.length <= data.totalCount) setFeedPage((prev) => prev + 1);
  };

  const getPosts = async (page) => {
    setLoading(true);
    try {
      const postFeedResponse = await PostsApi.getFeedPosts(page);
      if (postFeedResponse.status === 200) {
        setTotalCount(postFeedResponse.data.totalCount);
        return postFeedResponse.data;
      }
    } catch (error) {
      storeLogout();
      navigate("login");
    }
    finally{
      setLoading(false)
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await UsersApi.followRecommendations();
      if (response.status === 200) setRecommendationList(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const profileDataInfo = await UsersApi.myData();
      if (profileDataInfo.status === 200) setUserData(profileDataInfo.data);
      else {
        authLogOut();
        resetUserData();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthApi.logout();
      if (response.status === 200) {
        storeLogout();
        resetUserData();
        navigate("login");
      }
    } catch {
      localStorage.removeItem("token");
      storeLogout();
      resetUserData();
      navigate("login");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowRemove = (id) => {
    setRecommendationList((prev) => prev.filter((x) => x.id !== id));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(feedPage);
      if (data) setFeedPosts(data.items);
    };
    fetchPosts();
    fetchRecommendations();
    getData();
  }, []);

  return (
    <div className="flex flex-col z-10 min-h-screen text-white backdrop-blur-md">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3 bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 hover:text-cyan-400 transition">
            <HomeIcon size={20} /> Home
          </Link>
          <Link to="/me" className="flex items-center gap-2 hover:text-cyan-400 transition">
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

      <div className="flex gap-8 w-full md:w-4/5  mx-auto py-8">
        <div className="hidden lg:flex flex-col w-1/4 h-fit text-gray-300">
          <div className="bg-gray-800/30 rounded-xl p-5 shadow backdrop-blur-md border border-gray-700/40">
            <div className="flex flex-col items-center text-center">
              <img
                src={profileImgUrl || defaultProfileImg}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-gray-700"
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-100">{username}</h3>
              <p className="text-sm text-gray-400">{followersCount} followers</p>
            </div>
            <div className="mt-5 text-sm space-y-2 text-center">
              <ul className="space-y-1">
                <Link to="/me" className="hover:text-cyan-400 cursor-pointer">
                  My Profile
                </Link>
                <li className="hover:text-cyan-400 cursor-pointer">Saved</li>
                <li className="hover:text-cyan-400 cursor-pointer">Settings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Center panel (Feed + AddPost) */}
        <div className="flex-1 flex flex-col gap-6">
          <div
            className="bg-gray-700/40 rounded-lg p-4 text-gray-300 hover:bg-gray-700/60 cursor-pointer transition"
            onClick={() => setShowAddForm(true)}
          >
            <p className="font-medium">Share something...</p>
          </div>

          <Feed loadMorePosts={nextPage} feedPosts={feedPosts} totalCount={totalCount} />
        </div>

        {/* Right panel (recommendations) */}
        <div className="hidden xl:block w-1/5">
          <FriendRecommendations
            recommendationList={recommendationList}
            handleFollow={handleFollowRemove}
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Add Post modal */}
      {showAddForm && (
        <AddPost setClose={() => setShowAddForm(false)} pushNewPost={pushNewPost} />
      )}
    </div>
  );
}
