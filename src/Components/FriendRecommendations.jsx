import { useEffect, useState } from "react";
import noProfileImage from "../assets/noProfilePic.jpg";
import UsersApi from "../Services/Api/UsersApi";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";

const FriendRecommendations = ({ recommendationList, handleFollow }) => {
  const [removingId, setRemovingId] = useState(null);
  const { setFollowingCount } = useUserDataStore();
  const [recommendationsList, setRecommendationsList] = useState([]);

  useEffect(() => {
    setRecommendationsList(recommendationList || []);
  }, [recommendationList]);

  const followUser = async (id) => {
    try {
      const response = await UsersApi.followUser(id);
      if (response.status === 200) {
        console.log(response.data.message)
        
      }
    } catch (error) {
      console.error(error);
      alert("Check the console, there was an error");
    }

    setRemovingId(id);

    setTimeout(() => {
      setRecommendationsList((prev) => prev.filter((r) => r.id !== id));
      setRemovingId(null);
    }, 600);
  };

  const handleFollowClick = (id) => {
    handleFollow(id);
    followUser(id);
  };

  return (
    <div className="text-white bg-gray-800/40 rounded-2xl shadow-lg p-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-2 text-gray-200">
        People you may know
      </h2>

      {recommendationsList?.length === 0 ? (
        <p className="text-sm text-gray-400">No recommendations right now.</p>
      ) : (
        recommendationsList.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between border border-gray-600/30 rounded-xl p-3 bg-gray-700/40 hover:bg-gray-700/60 transition-all duration-500 ${
              removingId === r.id
                ? "opacity-0 translate-x-10"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* lijeva strana */}
            <div className="flex items-center gap-3">
              <img
                src={r.profileImageUrl || noProfileImage}
                className="rounded-full object-cover border border-gray-600 w-10 h-10"
                alt={r.username}
              />
              <span className="font-medium text-gray-100">{r.username}</span>
            </div>

            {/* dugme */}
            <button
              onClick={() => handleFollowClick(r.id)}
              className="bg-cyan-700 hover:bg-cyan-600 px-4 py-1 rounded-lg text-sm font-medium shadow transition-all duration-200"
            >
              Follow
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FriendRecommendations;
