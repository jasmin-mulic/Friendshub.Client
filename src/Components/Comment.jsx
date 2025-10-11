import noProfileImage from "../assets/noProfilePic.jpg";
import { dateToText } from "../Helpers";
const Comment = ({ comment }) => {
  console.log(comment)
  return (
    <div className="flex items-start gap-3 w-full p-3 bg-gray-700/50 rounded-xl border border-gray-600/40 mb-2">
      <img
        className="w-10 h-10 rounded-full object-cover border border-cyan-600"
        src={comment.userProfileImageDto || noProfileImage}
        alt={comment.username}
      />

      <div className="flex flex-col flex-1 gap-2">
        <span className="font-semibold text-gray-100">{comment.username}</span>
        <p className="text-gray-200 mt-1">{comment.content}</p>
        {comment.commentImageUrl && <img  src={comment.commentImageUrl} className="w-3/4 xl:w-50"/>}
        <span className="text-gray-400 text-xs mt-1">
          {dateToText(comment.commentedAt)}
        </span>
        <p>Like</p>
      </div>
    </div>
  );
};

export default Comment;
