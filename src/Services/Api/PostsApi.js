import Api from "./Api";

const PostsApi = {
  myPosts : () => Api.get("Posts/my-posts"),
  addPost : (postData) =>Api.post("Posts/add-post", postData),
  getFeedPosts : () => Api.get("/Posts/get-feed-posts"),
  likePost : (postId) => Api.post(`/Posts/like?postId=${postId}`)

}
export default PostsApi