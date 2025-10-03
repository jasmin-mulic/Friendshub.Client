import { useState } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg"
import { BiLike } from "react-icons/bi";
import PostsApi from "../Services/Api/PostsApi";

export default function Post({ post }) {
  const [showFull, setShowFull] = useState(false);

  const  likePost = async (postId) => {
    try {
      const response = await PostsApi.likePost(postId)        
    } catch (error) {
        console.log(error.response)
    }
  }
  return (
    <div className="w-full bg-transparent shadow-md rounded-2xl p-4 mb-6">
      {/* Header: profilna slika + user info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userProfileImage || defaultProfilePic}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm">{post.username}</p>
          <p className="text-gray-500 text-sm">
            {new Date(post.postedAt).toLocaleString()}
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
      {post.postImagesUrl && post.postImagesUrl.length > 0 && (
        <div className="flex flex-col  md:flex-row gap-3">
          {post.postImagesUrl.map((img, i) => (
            <img
            key={i}
            src={img}
            alt={`post-img-${i}`}
            className="xl:max-w-1/2 w-full items-center justify-center rounded-lg object-cover"
            />
          ))}
        </div>
      )}
      <div className="flex gap-2 items-center bg-white/50 p-2"><BiLike className="cursor-pointer text-blue-700" size={25} onClick={() => likePost(post.postId)} /> {post.likes.count}</div>
    </div>
  );
}
