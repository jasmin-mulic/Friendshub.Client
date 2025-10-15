import noProfileImage from "../assets/noProfilePic.jpg";
import { dateToText, getUserIdFromStorage } from "../Helpers";
import { BiLike } from "react-icons/bi";
import PostsApi from "../Services/Api/PostsApi";
import { useEffect, useState } from "react";

const Comment = ({ comment, addCommentLike, removeCommentLike, isLiked }) => {
  const [liked, setLiked] = useState(isLiked)
  useState(() => {
    
  }, []);

  const likeComment = async (id) => {
    try {
      const likeResponse = await PostsApi.likeComment(id);
      console.log(likeResponse.data)
      if (likeResponse.status == 200 && likeResponse.data.message == "disliked") {
        removeCommentLike(likeResponse.data.user.userId, id)
        setLiked(false)
        console.log("UserId nakon dislajka => " + likeResponse.data.user.userId)
      }
      else 
        {
          setLiked(true)
          addCommentLike(likeResponse.data.user.userId, id)
                  console.log("UserId nakon lajka => " + likeResponse.data.user.userId)

      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const isLikedButton = "bg-blue-500/50";
  const isNotLikedButton = "bg-gray-500/50 hover:bg-blue-500/50";
  return (
    <div className="flex items-start gap-3 w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/40 mb-2">
      <img
        className="w-10 h-10 rounded-full object-cover border border-cyan-600"
        src={comment.userProfileImageUrl == null ? noProfileImage : comment.userProfileImageUrl}
        alt={comment.username}
      />

      <div className="flex flex-col flex-1 gap-2">
        <span className="font-semibold text-gray-100">{comment.username}</span>
        {comment.content != "" && (
          <p className="text-gray-200 mt-1">{comment.content}</p>
        )}
        {comment.commentImageUrl != null && (
          <img src={comment.commentImageUrl} className="w-3/4 xl:w-50" />
        )}
        <span className="text-gray-400 text-xs mt-1">
          {dateToText(comment.commentedAt)}
        </span>
        <div
          onClick={() => likeComment(comment.commentId)}
          className={`text-sm flex gap-2 items-center justify-between ${liked == true ? isLikedButton : isNotLikedButton} w-fit px-2 py-1 rounded-md cursor-pointer`}
        >
          <BiLike />
          <span>Like</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
