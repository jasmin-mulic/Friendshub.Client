import { useEffect, useState } from "react";
import noProfilePic from "../../assets/noProfilePic.jpg";
import { AnimatePresence, motion } from "motion/react";
import UsersApi from "../../Services/Api/UsersApi";
import { ImCross } from "react-icons/im";
import { useUserDataStore } from "../../Services/Stores/UserDataStore";
const FollowingsModal = ({ onCancel }) => {

  const [followings, setFollowers] = useState([]);
  const setFollowingCount = useUserDataStore((state) => state.setFollowingCount)

  useEffect(() => {
    const getFollowings = async () => {
      try {
        const response = await UsersApi.getFollowings();
        if (response.status == 200) {
          setFollowers(response.data.followings);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFollowings();
    console.log("rendering");
  }, []);

  const removeFromFollowing = async (followeeId) => {
    try {
      const response = await UsersApi.toggleFollow(followeeId)
      if(response.status == 200)
      {
        const filteredList = followings.filter((followee) => followee.userId != followeeId);
        setFollowers(filteredList);
        console.log(response.data)
        setFollowingCount(-1)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center  bg-black/10 backdrop-blur-md z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => e.defaultPrevented}
        
      >
        <motion.div
          className="bg-gray-800 text-white p-5 rounded-2xl shadow-2xl w-[500px] h-auto  max-h-[400px] text-center relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          
        >
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
        >
          <ImCross size={10} />
        </button>
          {followings.length > 0 ? followings.map((followee) => (
            <div
              className="w-full flex items-center justify-between gap-2 p-2 mt-2"
              key={followee.userId}
            >
              <div className="flex items-center gap-2">
                <img
                  src={
                    followee.profileImageUrl == null
                      ? noProfilePic
                      : followee.profileImageUrl
                  }
                  className="w-10 h-10 rounded-full"
                />
                <p>{followee.username}</p>
              </div>
              <button
                className="bg-cyan-700 hover:bg-cyan-600 px-4 py-1 rounded-lg text-sm font-medium shadow transition-all duration-200"
                onClick={ () => removeFromFollowing(followee.userId)}
              >
                Unfollow
              </button>
            </div>
          )) : <div>
            <p className="text-cyan-400 text-md">You don't follow anyone 😒</p>
            </div>}
          <div className="flex justify-center gap-4"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowingsModal;
