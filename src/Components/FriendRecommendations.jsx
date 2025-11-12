import { useEffect, useState } from "react";
import noProfileImage from "../assets/noProfilePic.jpg";
import UsersApi from "../Services/Api/UsersApi";

const FriendRecommendations = () => {
  const [removingId, setRemovingId] = useState(null);
  const [recommendationList, setRecommendationList] = useState([]);
  const [recommendationPage, setRecommendationpage] = useState(1);

  const followUser = async (id) => {
    try {
      const response = await UsersApi.toggleFollow(id);
      if (response.status === 200) {
        console.log(response.data)
        setRecommendationList((prev) => prev.filter((r) => r.userId !== id));
      }
    } catch (error) {
      console.error(error);
      alert("Check the console, there was an error");
    }
  }

      const fetchRecommendations = async () => {
    try {
      const response = await UsersApi.followRecommendations(recommendationPage);
      console.log(response)
      if (response.status === 200) setRecommendationList(response.data.items);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() =>{
    fetchRecommendations()
  },[])
  

  return (
    <div className="text-white bg-gray-800/40 rounded-2xl shadow-lg p-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold mb-2 text-gray-200">
        People you may know
      </h2>

      {recommendationList?.length === 0 ? (
        <p className="text-sm text-gray-400">No recommendations right now.</p>
      ) : (
        recommendationList.map((r) => (
          <div
            key={r.userId}
            className={`flex items-center justify-between border border-gray-600/30 rounded-xl p-3 bg-gray-700/40 hover:bg-gray-700/60 transition-all duration-500 ${
              removingId === r.userId
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
              onClick={() => followUser(r.userId)}
              className="bg-cyan-700 hover:bg-cyan-600 px-4 py-1 rounded-lg text-sm font-medium shadow transition-all duration-200"
            >
              Follow
              {r.id}
            </button>
          </div>
        ))
      )}
     { recommendationList?.length > 10 &&  <button className="border-1 w-fit px-4 rounded-md py-2 mx-auto">Load more</button>}
    </div>
  );
};

export default FriendRecommendations;
