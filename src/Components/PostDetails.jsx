import React, { useState } from "react";
import defaultProfilePic from "../assets/noProfilePic.jpg";
import { dateToText } from "../Helpers";
import { ImCross } from "react-icons/im";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import Comment from "./Comment";
import "../index.css";

const PostDetails = ({ post }) => {
  const username = useUserDataStore((state) => state.username);
  const profileImgUrl = useUserDataStore((state) => state.profileImgUrl);
  console.log(username);
  console.log(profileImgUrl);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4 h-vh">
      <div className="w-full sm:w-[500px] bg-gray-800/90 rounded-2xl shadow-2xl text-white p-6 relative flex flex-col gap-5 border scrollbar-hide overflow-y-scroll h-full border-gray-700/40">
        <button className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition">
          <ImCross size={14} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <img
            src={profileImgUrl == null ? defaultProfilePic : profileImgUrl}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{post.username}</p>
            <p className="text-gray-400 text-sm">{dateToText(post.postedAt)}</p>
          </div>
        </div>
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
        <div className="mt-4 flex flex-col gap-3">
          <div className="mt-4 flex flex-col gap-3">
            {/* Lista komentara */}
            {post.comments.map((comment) => (
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
                placeholder={`Comment as ${username}`}
                className="flex-1 bg-gray-800/60 text-gray-100 placeholder-gray-400 px-4 py-2 rounded-xl border border-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
              />
              <button className="bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1 rounded-xl font-medium transition">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
