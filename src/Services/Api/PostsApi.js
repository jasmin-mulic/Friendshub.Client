import Api from "./Api";

const PostsApi = {
  myPosts : () => Api.get("Posts/my-posts"),
  addPost : () =>Api.post("Posts/add-post"),
  getFeedPosts : () => Api.get("/Posts/get-feed-posts")
}
export default PostsApi