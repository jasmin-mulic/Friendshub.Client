import { p } from "motion/react-client";
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

toggleLikeComment: (postId, commentId, userId, likeObj) =>
  set((state) => ({
    posts: state.posts.map((p) =>
      p.postId === postId
        ? {
            ...p,
            comments: p.comments.map((c) =>
              c.commentId === commentId
                ? {
                    ...c,
                    commentLikes: (c.commentLikes || []).some((l) => l.userId === userId)
                      ? c.commentLikes.filter((l) => l.userId !== userId)
                      : [...(c.commentLikes || []), likeObj],
                  }
                : c
            ),
          }
        : p
    ),
  })),
deleteComment: (postId, commentId) =>
  set((state) => ({
    posts: state.posts.map((p) =>
      p.postId === postId
        ? {
            ...p,
            comments: p.comments.filter((c) => c.commentId !== commentId),
          }
        : p
    ),
  })),
}));
