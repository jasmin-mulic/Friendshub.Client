import noProfileImage from "../assets/noProfilePic.jpg";
import { dateToText, getUserIdFromStorage } from "../Helpers";
import { BiLike } from "react-icons/bi";
import PostsApi from "../Services/Api/PostsApi";
import { useEffect, useState } from "react";
import { useFeedStore } from "../Services/Stores/useFeedStore";
import { FaTrashAlt } from "react-icons/fa";

const Comment = ({ commentId, postId, handleDelete }) => {

  const post = useFeedStore((state) => state.posts.find((p) => p.postId == postId));
  const userId = getUserIdFromStorage()
  const comment = post.comments.find((c) => c.commentId == commentId);
  const toggleLikeComment = useFeedStore((state) => state.toggleLikeComment)
  const [liked, setLiked] = useState(null);
  const isMyComment= comment.userId == userId
  const deleteComment = useFeedStore((state) => state.deleteComment)
useEffect(() => {
  setLiked(comment.commentLikes?.some((like) => like.userId === userId))
}, [comment.commentLikes, userId, postId]);

  const handleLikeComment = async (id) => {
    try {
      const res = await PostsApi.likeComment(id);

      if (res.status === 200) {
        toggleLikeComment(postId, commentId, userId, res.data.user);
        console.log(res.data)
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isLikedButton = "bg-blue-500/50";
  const isNotLikedButton = "bg-gray-500/50 hover:bg-blue-500/50";

  return (
    <div className="flex items-start gap-3 w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/40 mb-2 relative">
      { isMyComment == true && <FaTrashAlt onClick={handleDelete} size={20} color="red" className="absolute right-2 top-2" />}
      <img
        className="w-10 h-10 rounded-full object-cover border border-cyan-600"
        src={comment.userProfileImageUrl ?? noProfileImage}
        alt={comment.username}
      />
      <div className="flex flex-col flex-1 gap-2">
        <span className="font-semibold text-gray-100">{comment.username}</span>
        {comment.content && <p className="text-gray-200 mt-1">{comment.content}</p>}
        {comment.commentImageUrl && <img src={comment.commentImageUrl} className="w-3/4 xl:w-50" />}
        <span className="text-gray-400 text-xs mt-1">{dateToText(comment.commentedAt)}</span>

        <div
          onClick={() => handleLikeComment(comment.commentId)}
          className={`text-sm flex gap-2 items-center justify-between ${
            liked == true ? isLikedButton : isNotLikedButton
          } w-fit px-2 py-1 rounded-md cursor-pointer`}
        >
          <BiLike />
          <span>Like {comment.commentLikes.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
