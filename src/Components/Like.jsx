import { BiLike } from "react-icons/bi";

export default function Like({isLiked}) {

  const liked = "flex gap-2 items-center px-4 py-1 rounded-md bg-blue-500/50 cursor-pointer w-fit"
  const notLiked = "flex gap-2 items-center px-4 py-1 rounded-md hover:bg-gray-400/70 cursor-pointer w-fit"
  return (
    <div className={isLiked == true ? liked : notLiked}>
      <BiLike /> Like
    </div>
  );
};
