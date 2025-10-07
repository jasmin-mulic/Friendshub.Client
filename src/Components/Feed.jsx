
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
    <div className="min-h-full relative">
      <div className="flex flex-col gap-5 overflow-y-scroll h-[calc(100vh)] scrollbar-hide">
        {posts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
            {posts.length > 10 && <button className=" px-4 mx-auto py-1 text-xl bg-green-600" onClick={loadMorePosts}>Load more posts</button> }
    </div>
  );
};

export default Feed;
