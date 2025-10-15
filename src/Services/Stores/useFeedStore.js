import { create } from "zustand";

export const useFeedStore = create((set) => ({
  posts: [],
  selectedPost: null,

  setPosts: (posts) => set({ posts }),

  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  deletePost: (postId) =>
    set((state) => ({

      posts: state.posts.filter((p) => p.postId !== postId),
    })),

  selectPost: (post) => set({ selectedPost: post }),

  clearSelectedPost: () => set({ selectedPost: null }),

  loadMorePosts: (newPosts) => set((state) => ({ posts: [...state.posts, ...newPosts] })),

  addCommentToPost: (postId, comment) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              comments: [...(post.comments || []), comment],
            }
          : post
      ),
    })),
}));
