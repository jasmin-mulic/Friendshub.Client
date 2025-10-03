
import { useEffect, useState } from "react";
import Post from "./Post";
const Feed = ({posts}) => {


  return (
    <div className="min-h-full ">
      <div className="relative pb-7 flex flex-col  md:mt-0">
      </div>
      <div className="flex flex-col gap-6 overflow-y-scroll h-[calc(100vh-250px)] scrollbar-hide">
        {posts.map((post) => (
          <Post key={post.postId} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
