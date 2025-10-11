import Api from "./Api";

const PostsApi = {
  myPosts : (page) => Api.get(`Posts/my-posts/page/${page}`),
  addPost : (postData) =>Api.post("Posts/add-post", postData),
  getFeedPosts : (page) => Api.get(`/Posts/get-feed-posts/page/${page}`),
  likePost : (postId) => Api.post(`/Posts/like?postId=${postId}`),
  getMyPosts : (page) => Api.get(`/Posts/my-posts/page/${page}`),
  addComment : (postId, comment) => Api.post(`/Posts/add-comment/${postId}`, comment),
  deletePost : (postId) => Api.delete(`/Posts/delete-post?postId=${postId}`),
  likeComment : (commentId) => Api.post(`/Posts/like-comment/${commentId}`)
}
export default PostsApi