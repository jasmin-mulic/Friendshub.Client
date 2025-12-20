import Api from "./Api";

const PostsApi = 
{
  myPosts : (page) => Api.get(`posts?page=${page}`),
  addPost : (postData) =>Api.post(`/posts`, postData),
  getFeedPosts : (page) => Api.get(`posts/feed?page=${page}`),
  likePost : (postId) => Api.post(`/posts/${postId}/likes`),
  addComment : (postId, comment) => Api.post(`/posts/${postId}/comments`, comment),
  deletePost : (postId) => Api.delete(`/posts/${postId}`),
  likeComment : (commentId) => Api.post(`/posts/comments/${commentId}/likes`),
  deleteComment : (commentId) => Api.delete(`/posts/comment/${commentId}`)
}
export default PostsApi