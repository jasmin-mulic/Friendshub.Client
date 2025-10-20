import { useState, useEffect } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg";
import { AiFillLike } from "react-icons/ai";
import Like from "./Like";
import PostsApi from "../Services/Api/PostsApi";
import { getUserIdFromStorage } from "../Helpers";
import { Link } from "react-router-dom";
import { dateToText } from "../Helpers";
import { FaCommentDots } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import "../index.css";
import DeletePostModal from "./Modals/DeletePostModal";
import { useFeedStore } from "../Services/Stores/useFeedStore";
export default function Post({ postId, onClick}) {

  const post = useFeedStore((state) => state.posts.find((post) => post.postId == postId))
  const [userId] = useState(getUserIdFromStorage());
  const [showDelete, setShowDelete] = useState(false);
  const deletePost = useFeedStore((state) => state.deletePost)
  const [postLikeCount, setPostLikeCount] = useState(post.likes?.count);
  const [postCommentCount, setPostCommentCount] = useState(post.comments?.length)
  const [isLiked, setIsLiked] = useState(post.likes?.users.some((like) => like.userId == userId));

  useEffect(() =>{
    setPostCommentCount(post.comments ? post.comments.length : 0)
  },[post.comments])
  const likePost = async (postId) => {
    try {
      const response = await PostsApi.likePost(postId);
      if (response.status === 200) {
        console.log(response.data)
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

  const handleDelete = async (postId) => {
    setShowDelete(false)
    try {
      const response = await PostsApi.deletePost(postId);
      if (response.status == 200)
      {
        console.log("post deleted from db")
        deletePost(postId);
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-full shadow-md rounded-2xl  bg-gray-800/20 mb-6 p-5 relative">

      {userId == post.userId && (
        <div className="absolute p-2 right-5 top-5 rounded-xl bg-red-500 hover:bg-red-700" onClick={() => setShowDelete(true)}>
          <FaTrashAlt size={20} />
        </div>
      )}

      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.profileImgUrl || defaultProfilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <Link to={`/${post.userId}`} className="font-semibold text-sm">{post.username}</Link>
          <p className="text-gray-400 text-sm">{dateToText(post.postedAt)}</p>
        </div>
      </div>
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

      {post.postImagesUrl?.length > 0 && (
        <div className="flex flex-wrap gap-3 px-3 mb-4 justify-center items-center md:justify-start">
          {post.postImagesUrl.map((img, i) => (
            <div
              key={i}
              className=" w-full md:w-60 md:h-60 mt-4 rounded-xl overflow-hidden bg-gray-800/50  items-center justify-center flex flex-wrap gap-3 px-3 mb-3 will-change-transform"
            >
              <img
                src={img}
                loading="lazy"
                alt={`post-img-${i}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
        </div>
      )}


      <div className="flex gap-5 items-center mb-2">
        <div className="flex gap-2 items-center">
          <AiFillLike
            className="text-blue-500 bg-white rounded-full p-1"
            size={25}
          />
          <span className="text-gray-200 font-medium">{postLikeCount}</span>
        </div>
      </div>
      <div className="flex gap-4 mb-3">
        <div onClick={() => likePost(post.postId)}>
          <Like isLiked={isLiked} />
        </div>
        <div
          className="flex gap-2 px-2 rounded-md items-center cursor-pointer hover:bg-gray-600/50 transition"
          onClick={onClick}
        >
          <FaCommentDots /> <span>{postCommentCount}</span>
        </div>
      </div>
      <DeletePostModal
        show={showDelete}
        onConfirm={() => handleDelete(post.postId)}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
