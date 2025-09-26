import { useEffect, useState } from "react";
import userApi from "../Services/UserApi";
import noProfileImage from "../assets/noProfilePic.jpg";
import { useAuthStore } from "../Services/AuthStore";
const FriendRecommendations = () => {
  const [recommendationsList, setRecommendationsList] = useState([]);
  const [removingId, setRemovingId] = useState(null);
  const logout = useAuthStore.getState((state) => state.logout)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await userApi.get("follow-recommendations");
        if (response.status === 200) setRecommendationsList(response.data);
      } catch (error) {
        if(error.response.status == 401)
            logout();
      }
    };
    fetchRecommendations();
  }, []);

  const followUser = async (id) => {
    try {
      await userApi.post("/follow-user?foloweeId=" + id);
    } catch (error) {
      alert("Check the console, there was an error");
      console.log(error);
    }
    setRemovingId(id);

    setTimeout(() => {
      setRecommendationsList((prev) => prev.filter((r) => r.id !== id));
      setRemovingId(null);
    }, 600);
  };

  return (
    <div className="text-white w-full 2xl:w-96 flex flex-col gap-4 bg-gray-900/50 rounded-2xl shadow-lg p-6">
      <h2 className="text-lg font-semibold text-cyan-400">
        Friend Recommendations
      </h2>
      {recommendationsList.length > 0 ? (
        recommendationsList.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between border border-gray-700 rounded-xl p-3 transition-all duration-500 ${
              removingId === r.id
                ? "opacity-0 translate-x-10"
                : "opacity-100 translate-x-0"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  r.profileImageUrl
                    ? "https://localhost:44326/" + r.profileImageUrl
                    : noProfileImage
                }
                className="w-12 h-12 rounded-full object-cover border border-gray-600"
                alt={r.username}
              />
              <span className="font-medium">{r.username}</span>
            </div>
            <button
              onClick={() => followUser(r.id)}
              className="bg-cyan-700 hover:bg-cyan-600 px-4 py-1 rounded-lg text-sm font-medium shadow transition"
            >
              Follow
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">No friends to show.</p>
      )}
    </div>
  );
};

export default FriendRecommendations;
