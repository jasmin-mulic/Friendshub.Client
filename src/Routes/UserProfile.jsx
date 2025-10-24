import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersApi from "../Services/Api/UsersApi";
import Feed from "../Components/Feed";
import Navbar from "../Components/Navbar";
import defaultProfileImg from "../assets/noProfilePic.jpg";
import { useAuthStore } from "../Services/Stores/AuthStore";
import { useUserDataStore } from "../Services/Stores/UserDataStore";
import { useFeedStore } from "../Services/Stores/FeedStore";
const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const { username } = useParams();
  const storeUsername = useUserDataStore((state) => state.username)
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  const resetFeed = useFeedStore((state) => state.resetFeedStore)
  const setPosts = useFeedStore((state) =>state.setPosts)
    const posts = useFeedStore((state) =>state.posts)


  useEffect(() =>{
    if(storeUsername == username)
      navigate("/me")
  }, [])

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      try {
        const response = await UsersApi.userProfile(username);
        if (response.status === 200)
          {
            resetFeed();
            setUserData(response.data)
            setPosts(response.data.posts);
            console.log(response.data.posts)
          }
            
            
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [username]);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  return (
    <div className="flex flex-col min-h-screen text-white w-full bg-gray-800/20">
      <div className="flex flex-col xl:flex-row gap-8 w-full xl:w-4/5 mx-auto py-8 px-4 xl:px-0 bg-gray-900/20">
        <div className="hidden lg:flex flex-col w-full xl:w-1/5 text-gray-300 ">
          <div className="bg-gray-800/30 rounded-xl p-5 shadow-lg backdrop-blur-sm  border-cyan-500/10">
            <div className="flex flex-col items-center text-center">
              <img
                src={userData.profileImageUrl || defaultProfileImg}
                alt="Profile"
                className="w-30 h-30 rounded-full border border-gray-700 object-cover"
              />
              <h3 className="mt-3 text-lg font-semibold text-gray-100">
                {userData.username}
              </h3>
              <div className="flex gap-6 mt-2 text-sm text-gray-400">
                <p>
                  <span className="text-gray-200 font-semibold">
                    {userData.followersCount}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="text-gray-200 font-semibold">
                    {userData.followingCount}
                  </span>{" "}
                  following
                </p>
              </div>
              {userData.privateAccount && (
                <p className="text-red-400 text-xs mt-2">
                  This account is private
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Glavni sadržaj – postovi korisnika */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <Navbar />
          <div className="bg-gray-800/20 rounded-lg p-4 text-gray-300">
            <h2 className="font-semibold text-lg">
              {userData.username}'s Posts
            </h2>
          </div>

          {userData.posts && userData.posts.length > 0 ? (
            <Feed posts={userData.posts} hideLoadMore />
          ) : (
            <div className="text-center text-gray-400 mt-6">
              This user hasn’t posted anything yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
