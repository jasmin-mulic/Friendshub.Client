import { useEffect, useState } from "react";
import noProfilePic from "../../assets/noProfilePic.jpg";
import { AnimatePresence, motion } from "motion/react";
import UsersApi from "../../Services/Api/UsersApi";
import { ImCross } from "react-icons/im";
import { div } from "motion/react-client";
const FollowerModal = ({ onCancel }) => {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const response = await UsersApi.getFollowers();
        if (response.status == 200) {
          console.log(response.data.followers);
          setFollowers(response.data.followers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getFollowers();
    console.log("rendering");
  }, []);

  const removeFollower = async (followeeId) => {
    try {
      const response = await UsersApi.removeFollower(followeeId)
      if(response.data == 200)
      {
        const filteredList = followers.filter((followee) => followee.userId != followeeId);
        setFollowers(filteredList);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="bg-gray-800 text-white p-2 rounded-2xl shadow-2xl w-[500px] min-h-[200px] max-h-[400px] text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          
        >
          {followers.map((followee) => (
            <div
              className="w-full flex items-center justify-between gap-2 p-2"
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
                onClick={ () => removeFollower(followee.userId)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-center gap-4"></div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FollowerModal;
