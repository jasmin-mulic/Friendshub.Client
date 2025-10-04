import { BiDislike } from "react-icons/bi";
export default function Dislike() {
  return (
    <div className="flex gap-2 items-center border-1 px-4 py-1 rounded-md hover:bg-red-400/70 cursor-pointer w-fit">
      <BiDislike /> Dislike
    </div>
  );
};
