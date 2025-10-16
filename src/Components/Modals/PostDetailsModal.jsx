import { useEffect, useState } from "react";
import defaultProfilePic from "../../assets/noProfilePic.jpg";
import { dateToText } from "../../Helpers";
import { ImCross } from "react-icons/im";
import { useUserDataStore } from "../../Services/Stores/useUserDataStore";
import Comment from "../Comment";
import { MdAddAPhoto } from "react-icons/md";
import "../../index.css";
import { FaLocationArrow } from "react-icons/fa";
import PostsApi from "../../Services/Api/PostsApi";
import { useFeedStore } from "../../Services/Stores/useFeedStore";
import { AnimatePresence, motion } from "motion/react";
const PostDetailsModal = ({ postId, onClose }) => {

  const post = useFeedStore((state) => state.posts.find((post) => post.postId == postId))

  const username = useUserDataStore((state) => state.username);
  const profileImgUrl = useUserDataStore((state) => state.profileImgUrl);
  const [newComment, setNewComment] = useState({ Content: null, Image: null, });
  const addCommentToPost = useFeedStore((state) => state.addCommentToPost)
  const deleteComment = useFeedStore((state) => state.deleteComment)
  const [showFull, setShowFull] = useState(false)

  useEffect(() => {
  }, [])
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewComment((prev) => ({
        ...prev,
        Image: file,
      }));
    }
  };

  const handleContentChange = (e) => {
    setNewComment((prev) => ({
      ...prev,
      Content: e.target.value,
    }));
  };

  const isSubmitDisabled = !newComment.Content?.trim() && !newComment.Image;

  const addComment = async () => {
    try {
      const formData = new FormData();
      if (newComment.Content)
        formData.append("Content", newComment.Content)
      if (newComment.Image)
        formData.append("Image", newComment.Image)
      const response = await PostsApi.addComment(post.postId, formData)
      if (response.status == 200) {
        console.log(response.data)
        const newComment = response.data
        addCommentToPost(post.postId, newComment)
        onClose()
      }
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      const res = await PostsApi.deleteComment(id);
      if(res.status == 200) deleteComment(id);
    } catch (error) {
      console.log(error)
      
    }
    deleteComment(postId, id)
  }
  return (
    <AnimatePresence>
      {post && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/10 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose} // klik na overlay zatvara modal
        >
          <motion.div
            className="w-full sm:w-[600px] max-h-[80vh] overflow-y-auto scrollbar-hide bg-gray-800/90 rounded-2xl text-white p-6 relative flex flex-col gap-5 border border-gray-700/40"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
            >
              <ImCross size={14} />
            </button>

            {/* Header: Profile + Timestamp */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profileImgUrl || defaultProfilePic}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm">{post.username}</p>
                <p className="text-gray-400 text-sm">{dateToText(post.postedAt)}</p>
              </div>
            </div>

            {/* Post content */}
            {post.content && (
              <p className="text-gray-100 mb-3 text-sm">
                {post.content.length > 200 && !showFull
                  ? post.content.substring(0, 200) + "..."
                  : post.content}
                {post.content.length > 200 && (
                  <button
                    onClick={() => setShowFull(!showFull)}
                    className="text-cyan-400 ml-2 text-sm hover:underline"
                  >
                    {showFull ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
            )}

            {/* Post images */}
            {post.postImagesUrl?.length > 0 && (
              <div className="flex md:flex-row min-h-50 gap-3 mb-3 overflow-x-auto scrollbar-hide">
                {post.postImagesUrl.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`post-img-${i}`}
                    className="w-full xl:w-1/3 rounded-xl object-cover"
                  />
                ))}
              </div>
            )}


            <div className="mt-4 flex flex-col gap-3">
                {post.comments?.map((comment) => (
                  <Comment
                    commentId={comment.commentId}
                    key={comment.commentId}
                    postId={postId}
                    handleDelete={() => handleDeleteComment(comment.commentId)}
                  />
                ))}


              {/* Add comment input */}
              <div className="flex gap-3 items-center bg-gray-700/50 p-2 rounded-xl border border-gray-600/30">
                <img
                  src={profileImgUrl || defaultProfilePic}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover border border-cyan-600"
                />
                <input
                  type="text"
                  name="Content"
                  onChange={handleContentChange}
                  placeholder={`Comment as ${username}`}
                  className="flex-1 bg-gray-800/60 text-gray-100 placeholder-gray-400 px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                />
                <div>
                  <input
                    id="image"
                    name="image"
                    onChange={handleFileChange}
                    accept="image/*"
                    type="file"
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image">
                    <MdAddAPhoto size={25} className="cursor-pointer" />
                  </label>
                </div>
                <button
                  onClick={addComment}
                  disabled={isSubmitDisabled}
                  className={`px-3 py-1 rounded-md transition flex items-center justify-center 
                    ${isSubmitDisabled
                      ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                      : "bg-cyan-700 hover:bg-cyan-600 text-white"}`}
                >
                  <FaLocationArrow size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default PostDetailsModal