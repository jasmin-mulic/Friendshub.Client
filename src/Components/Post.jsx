import { useState, useEffect } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg";
import { AiFillLike } from "react-icons/ai";
import Like from "./Like";
import Dislike from "./Dislike";
import PostsApi from "../Services/Api/PostsApi";
import { getUserIdFromStorage } from "../Helpers";
import { dateToText } from "../Helpers";

export default function Post({ post }) {
  const [showFull, setShowFull] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState(getUserIdFromStorage())
  const [postLikeCount, setPostLikeCount] = useState()
  useEffect(() => {
    setPostLikeCount(post.likes?.count)
    if (userId && post.likes?.users) {
      setIsLiked(post.likes.users.some((x) => x.userId === userId));
    }
  }, [userId, post.likes?.count]);

  const likePost = async (postId) => {
    try {
      const response = await PostsApi.likePost(postId);
      if(response.status == 200)
      {
      if (response.data == "Post liked.")
       {
         setPostLikeCount((prev) => prev + 1)
         setIsLiked(true);
      }
      else
      {
        setIsLiked(false);
         setPostLikeCount((prev) => prev - 1)
      }
    }
    } catch (error) {
      console.log(error.response);
    }
  };
  return (
    <div className="w-full bg-transparent shadow-md rounded-2xl p-4 border-1">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userProfileImage || defaultProfilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{post.username}</p>
          <p className="text-gray-500 text-sm">
            {dateToText(post.postedAt)}
          </p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-white-800 mb-3 text-sm">
          {showFull || post.content.length < 200
            ? post.content
            : post.content.substring(0, 200) + "..."}
          {post.content.length > 200 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-blue-500 ml-2 text-sm"
            >
              {showFull ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {/* Images */}
      {post.postImagesUrl?.length > 0 && (
        <div className="flex flex-col md:flex-row gap-3">
          {post.postImagesUrl.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`post-img-${i}`}
              className="xl:max-w-1/2 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* Likes */}
      <div className="flex gap-5 p-2 flex-col items-start">
        <div className="flex gap-2 items-center">
          <AiFillLike
            className="text-blue-500 bg-white rounded-full p-1"
            size={25}
          />
          {postLikeCount}
        </div>
      </div>

      <div onClick={() => likePost(post.postId)}>
        {isLiked == true ? <Dislike /> : <Like />}
      </div>
    </div>
  );
}
