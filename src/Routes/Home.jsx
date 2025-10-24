import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/Stores/AuthStore";
import UsersApi from "../Services/Api/UsersApi";
import PostsApi from "../Services/Api/PostsApi";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import { useNavigate, Link } from "react-router-dom";
import { useUserDataStore } from "../Services/Stores/UserDataStore";
import FriendRecommendations from "../Components/FriendRecommendations";
import Feed from "../Components/Feed";
import AddPost from "../Components/AddPost";
import "../../src/index.css";
import Navbar from "../Components/Navbar";
import { useFeedStore } from "../Services/Stores/FeedStore";
export default function Home() {
  const {
    username,
    profileImgUrl,
    followersCount,
    setUserData,
    resetUserData,
  } = useUserDataStore();

  const authLogOut = useAuthStore((state) => state.logout);
  const storeLogout = useAuthStore.getState().logout;
  const [loading, setLoading] = useState(false);
  const [recommendationList, setRecommendationList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const addPost = useFeedStore((state) => state.addPost)
  const navigate = useNavigate();
  const setPosts = useFeedStore((state) => state.setPosts)
  const feedPosts = useFeedStore((state) => state.posts)
  const loadMorePosts = useFeedStore((state) => state.loadMorePosts)
  const pushNewPost = (newPost) => {
    addPost(newPost)
  };

  const nextPage = async () => {
    const data = await getPosts(feedPage + 1);

    if (data.totalCount === feedPosts.length) return;

    const newData = data.items;

    loadMorePosts(newData);
    if (newData.length <= data.totalCount)
      setFeedPage((prev) => prev + 1);
  };

  const getPosts = async (page) => {
    setLoading(true);
    try {
      const postFeedResponse = await PostsApi.getFeedPosts(page);
      if (postFeedResponse.status === 200) {
        console.log(postFeedResponse.data)
        setTotalCount(postFeedResponse.data.totalCount);
        return postFeedResponse.data;
      }
    } catch (error) {
      storeLogout();
      navigate("login");
    }
    finally {
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

  const getUserInfo = async () => {
    setLoading(true);
    try {
      const profileDataInfo = await UsersApi.myData();
      console.log(profileDataInfo.data)
      if (profileDataInfo.status === 200) setUserData(profileDataInfo.data);
      else {
        authLogOut();
        resetUserData();
      }
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
      if (data)
        {
          setPosts(data.items)
        }
          
    };
    fetchPosts();
    fetchRecommendations();
    getUserInfo();
  }, []);

  return (
    <div className="flex flex-col min-h-screen text-white w-full bg-gray-800/20">

      <div className="flex flex-col xl:flex-row gap-8 w-full xl:w-4/5 mx-auto py-8 px-4 xl:px-0 bg-gray-900/20">

        <div className="hidden lg:flex flex-col w-full xl:w-1/5 text-gray-300">
          <div className="bg-gray-800/30 rounded-xl p-5  shadow-lg backdrop-blur-sm border border-gray-700/40">
            <div className="flex flex-col items-center text-center">
              <img
                src={profileImgUrl || defaultProfileImg}
                alt="Profile"
                className="w-20 h-20 rounded-full border border-gray-700"
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-100">{username}</h3>
              <p className="text-sm text-gray-400">{followersCount} followers</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5 w-full ">
              <Navbar />
          <div
            className="bg-gray-700/40 rounded-lg p-4 text-gray-300 hover:bg-gray-700/60 cursor-pointer transition"
            onClick={() => setShowAddForm(true)}
          >
            <p className="font-medium">Share something...</p>
          </div>

          <Feed loadMorePosts={nextPage} totalCount={totalCount} />
        </div>


        <div className="hidden 2xl:block w-full xl:w-1/5">
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
