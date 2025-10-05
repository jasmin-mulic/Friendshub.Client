
import { useEffect } from "react";
import Post from "./Post";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
const Feed = ({posts, loadMore}) => {
const userId = useUserDataStore.getState((state) => state.userId)

const loadMorePosts = () =>{
  loadMore();
}
useEffect(() =>{
},[])
  return (
    <div className="min-h-full bg-gray-500/20 ">
      <div className="relative flex flex-col  md:mt-0">
      </div>
      <div className="flex flex-col gap-3 overflow-y-scroll h-[calc(100vh-250px)] scrollbar-hide">
        {posts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
              <button className="px-4 py-1 text-xl bg-green-600" onClick={loadMorePosts}>Load more posts</button>
      </div>
    </div>
  );
};

export default Feed;
