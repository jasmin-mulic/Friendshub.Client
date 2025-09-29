import  { useState } from 'react'
import postsApi from '../Services/Api/PostApi'
import { useEffect } from 'react'
import Post from "./Post"
const Feed = () => {

    const [pageNumber, setPageNumber] = useState(1);
    const [feedPosts, setFeedPosts] = useState([])
    useEffect(() =>{
      const getPosts = async() =>{
        try {
          const postFeedResponse = await postsApi.get("get-feed-posts");

          if(postFeedResponse.status == 200)
          {
              setFeedPosts(postFeedResponse.data.items)
            console.log(postFeedResponse.data)
          }
        } catch (error) {
            console.log(error.response)
        }
      }
      getPosts();
    },[])
    return (
        <div className="flex flex-col gap-6 mt-6  overflow-y-scroll scrollbar-hide h-[calc(100vh-150px)] pb-10">
          <h2 className="text-xl font-semibold text-cyan-400">
            Welcome back 👋
          </h2>
          <p className="text-gray-300">
            Explore your feed, find new friends and stay connected!
          </p>
            {feedPosts.map((post) => <Post key={post.postId} post ={post} />)}
        </div>
  )
}

export default Feed
