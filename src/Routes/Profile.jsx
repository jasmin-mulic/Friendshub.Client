import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import PostsApi from "../Services/Api/PostsApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import AuthApi from "../Services/Api/AuthApi";
import { useNavigate, Link } from "react-router-dom";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import Feed from "../Components/Feed";
import "../../src/index.css";
import { LogOut, Home as HomeIcon, Edit3 } from "lucide-react";
import FollowersModal from "../Components/Modals/FollowersModal";
import FollowingsModal from "../Components/Modals/FollowingsModal";
export default function Profile() {
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
  const [feedPosts, setFeedPosts] = useState([]);
  const [feedPage, setFeedPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    try {
      const profileDataInfo = await UsersApi.myData();
      if (profileDataInfo.status === 200) setUserData(profileDataInfo.data);
      else {
        authLogOut();
        resetUserData();
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getMyPosts = async (page) => {
    try {
      const postFeedResponse = await PostsApi.getMyPosts(page);
      if (postFeedResponse.status === 200) {
        setTotalCount(postFeedResponse.data.totalCount);
        return postFeedResponse.data;
      }
    } catch (error) {
      storeLogout();
      navigate("login");
      console.log(error);
    }
  };

  const nextPage = async () => {
    const data = await getMyPosts(feedPage + 1);
    if (data.totalCount === feedPosts.length) return;

    const newData = [...feedPosts, ...data.items];
    setFeedPosts(newData);
    if (newData.length <= data.totalCount) setFeedPage((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getMyPosts(feedPage);
      setFeedPosts(data.items);
    };
    fetchPosts();
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
      localStorage.removeItem("token");
      storeLogout();
      resetUserData();
      navigate("login");
    } finally {
      setLoading(false);
    }
  };

  const showFollowers = () =>{
    setShowFollowersModal(!showFollowersModal)
  }

  const showFollowings = () =>{
    setShowFollowingsModal(!showFollowingsModal);
  }
 const toggleFollowers = () => setShowFollowersModal((prev) => !prev);
  const toggleFollowings = () => setShowFollowingsModal((prev) => !prev);

  return (
    <div className="flex flex-col z-10 min-h-screen text-white">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-3 bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            <HomeIcon size={20} /> Home
          </Link>
          <Link
            to="/me"
            className="flex items-center gap-2 hover:text-cyan-400 transition"
          >
            Profile
          </Link>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg shadow transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Glavni layout */}
      <div className="flex gap-8 w-full xl:w-4/5 2xl:w-3/5 mx-auto py-8">
        {/* Lijevi sidebar (profil info) */}
        <div className="w-1/4 hidden lg:flex flex-col items-center p-4 bg-gray-800/20 rounded-2xl shadow-lg backdrop-blur-sm gap-4">
          <img
            className="rounded-full w-24 h-24 border-2 border-cyan-600 shadow-lg"
            src={profileImgUrl || defaultProfileImg}
            alt="Profile"
          />
          <p className="font-bold text-lg">{username}</p>

          <div className="flex flex-col text-md text-gray-300 gap-1 text-center">
            <span
              onClick={toggleFollowers}
              className="hover:text-blue-400 cursor-pointer"
            >
              Followers: {followersCount}
            </span>
            <span
              onClick={toggleFollowings}
              className="hover:text-blue-400 cursor-pointer"
            >
              Following: {followingCount}
            </span>
            <span>Posts: {postCount}</span>
          </div>

          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2 mt-3 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg shadow transition-all"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

        {/* Sredina (feed postova korisnika) */}
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2">
            My Posts
          </h2>

          <Feed
            loadMorePosts={nextPage}
            feedPosts={feedPosts}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* Modali */}
      {showFollowersModal && (
        <FollowersModal onCancel={toggleFollowers} />
      )}
      {showFollowingsModal && (
        <FollowingsModal onCancel={toggleFollowings} />
      )}
      {showEditProfile && (
        <EditProfileModal onClose={() => setShowEditProfile(false)} />
      )}

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
