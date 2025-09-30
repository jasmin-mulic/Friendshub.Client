import { useState } from "react";
import postsApi from "../Services/Api/PostApi";
import { useEffect } from "react";
import { BsFillPlusSquareFill } from "react-icons/bs";

import { FcAddImage } from "react-icons/fc";
import Post from "./Post";
const Feed = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [feedPosts, setFeedPosts] = useState([]);
  const [file, setFIle] = useState(null)
  const [content, setContent] = useState("");
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postFeedResponse = await postsApi.get("get-feed-posts");

        if (postFeedResponse.status == 200) {
          setFeedPosts(postFeedResponse.data.items);
          console.log(postFeedResponse.data);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    getPosts();
  }, []);
  const handleContentChange = (e) =>{
    setContent(e.target.value)
  }
  return (
    <div>
      <div className="relative pb-7 flex flex-col mt-15 md:mt-0">
        <textarea
          name="content"
          id="content"
          onChange={handleContentChange}
          className="bg-white/90 rounded-2xl w-full text-black/80 p-5 border-2 border-blue-400"
          placeholder="What is on your mind"
        ></textarea>
        <div className="flex justify-between pt-3 cursor-pointe">
          <div className="flex gap-2 hover:bg-white/20 p-2 rounded-md">
            <FcAddImage className="text-2xl" />
            <span className="text-md">Photo/Photos</span>
          </div>
          <div className="flex gap-2 hover:bg-green-500/20 p-2 cursor-pointer rounded-md justify-center items-center">
            <span className="text-md">Add</span>

            <BsFillPlusSquareFill />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 mt-15  overflow-y-scroll scrollbar-hide h-[calc(100vh-150px)] pb-10">
        {feedPosts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
