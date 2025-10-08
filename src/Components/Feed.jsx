
import { useEffect } from "react";
import Post from "./Post";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
const Feed = ({loadMorePosts, posts}) => {

useEffect(() =>{
},[])
  return (
<div className="flex flex-col gap-5 overflow-y-auto max-h-[70vh] scrollbar-hide">
  {posts.map((post) => (
    <Post key={post.postId} post={post} />
  ))}
  <button onClick={loadMorePosts} className="border-1 w-fit mx-auto py-2 px-4 rounded-xl bg-transparent hover:bg-gray-200/30">Load More posts</button>
</div>

  );
};

export default Feed;
