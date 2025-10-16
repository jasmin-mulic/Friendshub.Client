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
  set((state) => {
    const postIndex = state.posts.findIndex((p) => p.postId === postId);
    if (postIndex === -1) return state;

    const post = state.posts[postIndex];
    const commentIndex = post.comments.findIndex((c) => c.commentId === commentId);
    if (commentIndex === -1) return state;

    const comment = post.comments[commentIndex];
    const likes = comment.commentLikes || [];
    const liked = likes.some((l) => l.userId === userId);

    // kreiramo novi niz lajkova samo ako ima promjene
    const newLikes = liked
      ? likes.filter((l) => l.userId !== userId)
      : [...likes, likeObj];

    // ako se ništa nije promijenilo, ne diramo state
    if (liked && likes.length === newLikes.length) return state;

    const newComment = { ...comment, commentLikes: newLikes };
    const newComments = [...post.comments];
    newComments[commentIndex] = newComment;

    const newPost = { ...post, comments: newComments };
    const newPosts = [...state.posts];
    newPosts[postIndex] = newPost;

    return { posts: newPosts };
  }),

}));
