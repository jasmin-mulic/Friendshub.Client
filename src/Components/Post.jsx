import { useState, useEffect } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg";
import { AiFillLike } from "react-icons/ai";
import Like from "./Like";
import PostsApi from "../Services/Api/PostsApi";
import { getUserIdFromStorage } from "../Helpers";
import { dateToText } from "../Helpers";
import { FaCommentDots } from "react-icons/fa6";
import "../index.css";
import PostDetails from "./PostDetails";
export default function Post({ post }) {
  const [showFull, setShowFull] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userId] = useState(getUserIdFromStorage());
  const [postLikeCount, setPostLikeCount] = useState();
  const [showCommentArea, setShowCommentArea] = useState(false);
  useEffect(() => {
    setPostLikeCount(post.likes?.count);
    if (userId && post.likes?.users) {
      setIsLiked(post.likes.users.some((x) => x.userId === userId));
    }
  }, [userId, post.likes?.count]);

  const likePost = async (postId) => {
    try {
      const response = await PostsApi.likePost(postId);
      if (response.status === 200) {
        if (response.data === "Post liked.") {
          setPostLikeCount((prev) => prev + 1);
          setIsLiked(true);
        } else {
          setIsLiked(false);
          setPostLikeCount((prev) => prev - 1);
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div className="w-full shadow-md rounded-2xl  bg-gray-500/20 mb-6 p-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userProfileImage || defaultProfilePic}
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
        <p className="text-gray-100 mb-3 text-sm">
          {showFull || post.content.length < 200
            ? post.content
            : post.content.substring(0, 200) + "..."}
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

      <div className="flex gap-5 items-center mb-2">
        <div className="flex gap-2 items-center">
          <AiFillLike className="text-blue-500 bg-white rounded-full p-1" size={25} />
          <span className="text-gray-200 font-medium">{postLikeCount}</span>
        </div>
      </div>
      <div className="flex gap-4 mb-3">
        <div onClick={() => likePost(post.postId)}>
          <Like isLiked={isLiked} />
        </div>
        <div
          className="flex gap-2 px-2 rounded-md items-center cursor-pointer hover:bg-gray-600/50 transition"
          onClick={() => setShowCommentArea(!showCommentArea)}
        >
          <FaCommentDots /> <span>{post.comments.length}</span>
        </div>
      </div>
      {showCommentArea == true && <PostDetails post = {post} setShowCommentArea = {setShowCommentArea}  />}
    </div>
  );
}
