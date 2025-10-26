import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import PostsApi from "../Services/Api/PostsApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useUserDataStore } from "../Services/Stores/UserDataStore";
import Feed from "../Components/Feed";
import "../../src/index.css";
import { Edit3 } from "lucide-react";
import FollowersModal from "../Components/Modals/FollowersModal";
import FollowingsModal from "../Components/Modals/FollowingsModal";
import { MdDelete } from "react-icons/md";
import Navbar from "../Components/Navbar";
import DeleteAccountModal from "../Components/Modals/DeleteAccountModal";
import { useFeedStore } from "../Services/Stores/FeedStore";
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
  const [feedPage, setFeedPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const
  {
    posts,
    setPosts,
    resetFeedStore,
  } = useFeedStore();
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
        resetFeedStore()
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
      if (data) setPosts(data.items);
    };
    fetchPosts();
    getData();
  }, []);

  const toggleFollowers = () => setShowFollowersModal((prev) => !prev);
  const toggleFollowings = () => setShowFollowingsModal((prev) => !prev);

  return (
    <div className="flex flex-col min-h-screen text-white w-full bg-gray-800/20">
      <div className="flex flex-col xl:flex-row gap-8 w-full xl:w-4/5 mx-auto py-8 px-4 xl:px-0 bg-gray-900/20">
        <div className="hidden lg:flex flex-col w-full xl:w-1/5 text-gray-300 ">
          <div className="bg-gray-800/30 rounded-xl p-5 shadow-lg backdrop-blur-sm  border-cyan-500/10">
            <div className="flex flex-col items-center text-center">
              <img
                src={profileImgUrl || defaultProfileImg}
                alt="Profile"
                className="w-30 h-30 rounded-full border border-gray-700"
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-100">{username}</h3>

              <div className="flex flex-col gap-1 text-gray-400 mt-2">
                <span
                  onClick={toggleFollowers}
                  className="hover:text-cyan-400 cursor-pointer"
                >
                  Followers: {followersCount}
                </span>
                <span
                  onClick={toggleFollowings}
                  className="hover:text-cyan-400 cursor-pointer"
                >
                  Following: {followingCount}
                </span>
                <span>Posts: {postCount}</span>
              </div>

              <Link
                to={"/details"}
                className="flex items-center justify-center gap-2 mt-4 bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg shadow transition-all"
              >
                <Edit3 size={16} /> Edit Profile
              </Link>

              <button
                onClick={() => setShowDeleteAccount(true)}
                className="flex items-center justify-center gap-2 mt-3 text-red-400 hover:text-red-500 transition"
              >
                <MdDelete size={18} /> Delete account
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 w-full ">
          <Navbar />
          <h2 className="text-xl font-semibold text-gray-100 border-b border-gray-700 pb-2 mt-5">
            My Posts
          </h2>
          <Feed
            loadMorePosts={nextPage}
            feedPosts={posts}
            totalCount={totalCount}
          />
        </div>
      </div>

      {/* Modals */}
      {showFollowersModal && <FollowersModal onCancel={toggleFollowers} />}
      {showFollowingsModal && <FollowingsModal onCancel={toggleFollowings} />}

      {/* Loader */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {showDeleteAccount == true  && <DeleteAccountModal loading={loading} show={showDeleteAccount} onCancel={() => setShowDeleteAccount(false)}  />}
    </div>
  );
}
