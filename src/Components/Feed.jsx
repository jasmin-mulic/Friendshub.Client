import { useEffect, useState } from "react";
import Post from "./Post";

const Feed = ({ loadMorePosts, feedPosts, totalCount }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (feedPosts && feedPosts.length > 0) {
      setPosts(feedPosts);
    }
  }, [feedPosts]);

  const deletePost = (postId) => {
    setPosts((prev) => prev.filter((post) => post.postId !== postId));
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-[70vh] scrollbar-hide px-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post key={post.postId} post={post} deletePost={deletePost} />
        ))
      ) : (
        <p className="text-center text-gray-400">No posts to show.</p>
      )}

      {posts && posts.length < totalCount && (
        <button
          onClick={loadMorePosts}
          className="border-1 w-fit mx-auto py-2 px-4 rounded-xl bg-transparent hover:bg-gray-200/30"
        >
          Load More posts
        </button>
      )}
    </div>
  );
};

export default Feed;
