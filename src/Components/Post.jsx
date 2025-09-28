import { useState } from "react";

export default function Post({ post }) {
  const [showFull, setShowFull] = useState(false);

  return (
    <div className="max-w-xl w-full bg-white shadow-md rounded-2xl p-4 mb-6">
      {/* Header: profilna slika + user info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={post.userProfileImage || "/default-profile.png"}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.username}</p>
          <p className="text-gray-500 text-sm">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="text-gray-800 mb-3">
          {showFull || post.content.length < 200
            ? post.content
            : post.content.substring(0, 200) + "..."}
          {post.content.length > 200 && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-blue-500 ml-2 text-sm"
            >
              {showFull ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {post.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`post-img-${i}`}
              className="w-full rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
