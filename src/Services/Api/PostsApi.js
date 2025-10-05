import Api from "./Api";

const PostsApi = {
  myPosts : (page) => Api.get(`Posts/my-posts/page/${page}`),
  addPost : (postData) =>Api.post("Posts/add-post", postData),
  getFeedPosts : (page) => Api.get(`/Posts/get-feed-posts/page/${page}`),
  likePost : (postId) => Api.post(`/Posts/like?postId=${postId}`)

}
export default PostsApi