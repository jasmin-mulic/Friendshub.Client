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
import PostDetailsModal from "./Modals/PostDetailsModal";
import DeletePostModal from "./Modals/DeletePostModal";

export default function Post({ post: initialPost, deletePost }) {
  const [showFull, setShowFull] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userId] = useState(getUserIdFromStorage());
  const [postLikeCount, setPostLikeCount] = useState();
  const [post, setPost] = useState(initialPost);
  const [showCommentArea, setShowCommentArea] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const addCommentToPost = (newComment) => {
    console.log("novi komentar -> " + {newComment})
    setPost((prev) => ({
      ...prev,
      comments: [newComment,...prev.comments],
    }));
  };
  
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

  const handleDelete = async (postId) =>{
    setShowDelete(false)
    try {
        const response = await PostsApi.deletePost(postId);
        if(response.status == 200)
          deletePost(postId);
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className="w-full shadow-md rounded-2xl  bg-gray-500/20 mb-6 p-5 relative">

      {userId == post.userId && (
        <div className="absolute p-2 right-3 top-3 rounded-xl bg-red-500 hover:bg-red-700" onClick={() => setShowDelete(true)}>
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
          <Link to={post.username} className="font-semibold text-sm">{post.username}</Link>
          <p className="text-gray-400 text-sm">{dateToText(post.postedAt)}</p>
        </div>
      </div>

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

      {post.postImagesUrl?.length > 0 && (
        <div className="flex flex-row md:flex-row gap-3 px-3 mb-3 flex-wrap">
          {post.postImagesUrl.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`post-img-${i}`}
              className=" w-3/7 md:w-60 md:h-60 rounded-xl object-cover"
            />
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
          onClick={() => setShowCommentArea(!showCommentArea)}
        >
          <FaCommentDots /> <span>{post.comments.length}</span>
        </div>
      </div>
      {showCommentArea == true && (
        <PostDetailsModal
          post={post}
          setShowCommentArea={setShowCommentArea}
          addCommentToPost={addCommentToPost}
        />
      )}
            <DeletePostModal
        show={showDelete}
        onConfirm={() => handleDelete(post.postId)}
        onCancel={() => setShowDelete(false)}
      />
  </div>
  );
}
