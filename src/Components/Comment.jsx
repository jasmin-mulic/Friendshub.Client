import noProfileImage from "../assets/noProfilePic.jpg"
import { dateToText } from "../Helpers"
const Comments = (prop) => {
  console.log(prop)
  return (
    <div className="flex items-start flex-col border-1 rounded-md p-2 bg-gray-300 text-black w-full">
      <div className="flex items-center gap-2">
        <img className="w-10 rounded-full h-10" src={prop.comment.userProfileImageDto == "" ? noProfileImage : prop.userProfileImageDto } />
        <span className="font-bold">{prop.comment.username}</span>
      </div>
      <div className="mt-2 flex flex-col rounded-md w-full flex-wrap text-wrap">
        <p className="ps-10">{prop.comment.content}</p>
        <p className="text-gray-400 ps-10">
        {dateToText(prop.comment.commentedAt)}

        </p>
      </div>
    </div>
  )
}
export default Comments
