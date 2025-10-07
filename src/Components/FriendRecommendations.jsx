import { useState } from "react";
import noProfileImage from "../assets/noProfilePic.jpg";
import UsersApi from "../Services/Api/UsersApi";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";

const FriendRecommendations = ({data, handleFollowChange}) => {
  console.log(data)
  const [recommendationsList, setRecommendationsList] = useState(data);
  const [removingId, setRemovingId] = useState(null);
  const {setFollowingCount} = useUserDataStore();
  
  const followUser = async (id) => {
    try {
      const response = await UsersApi.followUser(id);
      if(response.status == 200)
      {
        console.log(response.data);
        setFollowingCount(1)
      }
    } catch (error) {
      alert("Check the console, there was an error");
    }
    setRemovingId(id);

    setTimeout(() => {
      setRecommendationsList((prev) => prev.filter((r) => r.id !== id));
      setRemovingId(null);
    }, 600);
  };
const handleFollow = (id) =>{
  handleFollowChange(id);
  followUser(id);
}
  return (
    <div className="text-white w-full flex justify-start  gap-4 bg-gray-900/30 rounded-2xl shadow-lg p-2">
      {recommendationsList.length > 0 && (
        recommendationsList.map((r) => (
          <div
            key={r.id}
            className={`flex items-center justify-between border border-gray-700 rounded-xl p-3 transition-all duration-500 w-fit flex-col gap-3 ${
              removingId === r.id
                ? "opacity-0 translate-x-10"
                : "opacity-100 translate-x-0"
            }`}
          >
            <div className="flex justify flex-col w-30 rounded-md items-center gap-3 h-40">
              <img
                src={
                  r.profileImageUrl
                    ? r.profileImageUrl
                    : noProfileImage
                }
                className="rounded-md object-cover border border-gray-600 w-full h-30"
                alt={r.username}
              />
              <span className="font-medium">{r.username}</span>
            </div>
            <button
              onClick={() => handleFollow(r.id)}
              className="bg-cyan-700 hover:bg-cyan-600 px-4 w-full flex gap-2 justify-center items-center py-1 rounded-lg text-sm font-medium shadow transition"
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
