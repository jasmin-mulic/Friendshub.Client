import PostsApi from "../Services/Api/PostsApi";
import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";

import Post from "./Post";
import AddPost from "./AddPost";

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      try {
        const postFeedResponse = await PostsApi.getFeedPosts();

        if (postFeedResponse.status == 200) {
          setFeedPosts(postFeedResponse.data.items);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    getPosts();
  }, []);

  return (
    <div>
      <div className="relative pb-7 flex flex-col  md:mt-0">
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
