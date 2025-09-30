import { useState } from "react";

import PostsApi from "../Services/Api/PostsApi";
import { useEffect } from "react";
import { BsFillPlusSquareFill } from "react-icons/bs";

import { FcAddImage } from "react-icons/fc";
import Post from "./Post";
const Feed = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [feedPosts, setFeedPosts] = useState([]);
  const [file, setFIle] = useState(null)
  const [content, setContent] = useState("");


    const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // napravi preview URL-ove
    const urls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setPreviews(urls);
  };
  
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postFeedResponse = await PostsApi.getFeedPosts();

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
    <div>
      {/* sakriven input */}
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* label kao dugme sa ikonicom */}
      <label
        htmlFor="fileInput"
        className="p-2 rounded-xl hover:bg-gray-200 cursor-pointer inline-flex items-center"
      >
        <FcAddImage className="w-6 h-6 text-gray-700" />
        <span className="ml-2 text-sm text-gray-600">Dodaj slike</span>
      </label>

      {/* preview sekcija */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {previews.map((file, i) => (
          <div key={i} className="relative">
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-24 object-cover rounded-lg shadow"
            />
          </div>
        ))}
      </div>
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
