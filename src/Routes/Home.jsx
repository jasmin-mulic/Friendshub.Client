import { useEffect, useState } from "react";
import { useAuthStore } from "../Services/AuthStore";
import userApi from "../Services/UserApi";
import AuthApi from "../Services/AuthApi";
import noProfileImg from "../../public/noProfilePic.jpg";
import { useNavigate } from "react-router-dom";
import FriendRecommendations from "../Components/FriendRecommendations";

export default function Home() {
  const [displayUsername, setDisplayUsername] = useState("");
  const [profileImgUrl, setProfileImgUrl] = useState("");
  const authLogOut = useAuthStore((state) => state.logout);
  const authLogIn = useAuthStore((state) => state.login)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await userApi.get("me");
        if (response.status === 200) {
          setDisplayUsername(response.data.displayUsername);
          setProfileImgUrl(response.data.profileImgUrl);
        }
      } catch (err) {
        if (err.status === 401) navigate("/login");
      }
    };
    getData();
  }, []);
useEffect(() =>{
  var token = localStorage.getItem("token");
  if(token)
    authLogIn(token);

})
  const logout = async () => {
    setLoading(true);
    try {
      const response = await AuthApi.post("logout");
      if(response.status == 200)
      {
        authLogOut();
        navigate("/login")
      }
    } catch (error) {
        console.log(error.response)
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col 2xl:flex-row gap-8 w-full 2xl:w-3/4 mx-auto p-6">
      {/* Profile section */}
      <div className="min-h-screen flex-1 text-white p-6 flex flex-col gap-6 bg-gray-900/50 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center border-b border-gray-700 pb-4">
          <div className="flex items-center gap-4">
            <img
              className="cursor-pointer rounded-full w-20 h-20 object-cover border-2 border-cyan-600 shadow"
              src={profileImgUrl ? profileImgUrl : noProfileImg}
              alt="Profile"
            />
            <h1 className="text-2xl font-bold">{displayUsername}</h1>
          </div>
          <button
            onClick={logout}
            className="text-md bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl shadow transition-all"
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
