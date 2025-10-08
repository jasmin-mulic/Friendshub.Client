import  { useEffect, useState } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg";
import { dateToText } from "../Helpers";
import { ImCross } from "react-icons/im";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import Comment from "./Comment";
import { MdAddAPhoto } from "react-icons/md";
import "../index.css";
import { FaLocationArrow } from "react-icons/fa";
import PostsApi from "../Services/Api/PostsApi";
const PostDetails = ({ post, setShowCommentArea }) => {
  const username = useUserDataStore((state) => state.username);
  const profileImgUrl = useUserDataStore((state) => state.profileImgUrl);
  const [newComment, setNewComment] = useState({ Content: null, Image: null, });

  const closeCommentArea = () =>{
    setShowCommentArea()
  }
  const handleFileChange = (e) => {
  const file = e.target.files[0];
  setNewComment((prev) => ({
    ...prev,
    Image: file,
  }));
};

const handleContentChange = (e) => {
  setNewComment((prev) => ({
    ...prev,
    Content: e.target.value,
  }));    
};

const isSubmitDisabled = !newComment.Content?.trim() && !newComment.Image;

const addComment = async () =>{
  try {
    const formData = new FormData();
    formData.append("Content", newComment.Content)
    formData.append("Image", newComment.Image)
    const response = await PostsApi.addComment(post.postId, formData)
    if(response.status == 200)
      setShowCommentArea()
  } catch (error) {
    console.log(error.response)
    
  }
}

  return (
    <div className="fixed inset-1 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
      <div className="scrollbar-hide w-full sm:w-[600px] max-h-[90vh] overflow-y-auto bg-gray-800/90 rounded-2xl text-white p-6 relative flex flex-col gap-5 border border-gray-700/40">
        <button
          onClick={closeCommentArea}
          className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
        >
          <ImCross size={14} />
        </button>

        {/* Header */}
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

        {/* Content */}
        {post.content && (
          <p className="text-gray-100 mb-3 text-sm">{post.content}</p>
        )}

        {/* Images */}
        {post.postImagesUrl?.length > 0 && (
          <div className="flex flex-col md:flex-row gap-3 px-3 mb-3">
            {post.postImagesUrl.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`post-img-${i}`}
                className="w-full md:w-1/2 rounded-xl object-cover"
              />
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="mt-4 flex flex-col gap-3">
          {post.comments?.map((comment) => (
            <Comment comment={comment} key={comment.commentId} />
          ))}
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
      </div>
    </div>
  );
};

export default PostDetails;
