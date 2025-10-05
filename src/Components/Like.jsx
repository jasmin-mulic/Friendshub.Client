import { BiLike } from "react-icons/bi";
export default function Like() {
  return (
    <div className="flex gap-2 items-center border-1 px-4 py-1 rounded-md  hover:bg-blue-400/70 cursor-pointer w-fit">
      <BiLike /> Like
    </div>
  );
};
