import { useEffect, useState } from "react";
import Post from "./Post";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import PostDetailsModal from "./Modals/PostDetailsModal";
import { useFeedStore } from "../Services/Stores/useFeedStore";

const Feed = ({ loadMorePosts, feedPosts, totalCount }) => {

const { posts, setPosts, deletePost, selectPost, selectedPost, clearSelectedPost } = useFeedStore();


  useEffect(() => {
    if (feedPosts && feedPosts.length > 0) {
      setPosts(feedPosts);
    }
  }, [feedPosts]);

  return (
    <div className="flex flex-col gap-5 overflow-y-auto max-h-[70vh] scrollbar-hide px-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          (<Post 
          key={post.postId} 
          postId={post.postId} 
          deletePost={deletePost} 
          onClick= {() => selectPost(post)}
          />)
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
    {selectedPost && (<PostDetailsModal postId={selectedPost.postId} onClose={clearSelectedPost} />)}
    </div>
  );
};

export default Feed;
