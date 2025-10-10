import React, { useState } from "react";
import noProfileImg from "../assets/noProfilePic.jpg";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import { FcAddImage } from "react-icons/fc";
import { ImCross } from "react-icons/im";
import { FaTrash } from "react-icons/fa";
import PostsApi from "../Services/Api/PostsApi";
const AddPost = ({ setClose, pushNewPost }) => {
  const { displayUsername, profileImgUrl } = useUserDataStore();
  const [previews, setPreviews] = useState([]);
  const [postData, setPostData] = useState({ Content: "", ImagePaths: [] });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPostData((prev) => ({ ...prev, ImagePaths: files }));

    const urls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews(urls);
  };

  const removeImage = (name) => {
    setPreviews(previews.filter((f) => f.name !== name));
    setPostData((prev) => ({
      ...prev,
      ImagePaths: prev.ImagePaths.filter((f) => f.name !== name),
    }));
  };

  const handleContentChange = (e) => {
    setPostData((prev) => ({ ...prev, Content: e.target.value }));
  };

  const addPost = async () => {
    if (!postData.Content && postData.ImagePaths.length === 0) {
      setErrorMessage("Please add text or an image before posting.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("Content", postData.Content);
    postData.ImagePaths.forEach((file) => formData.append("ImagePaths", file));

    try {
      const response = await PostsApi.addPost(formData);
      if (response.status === 200) {
        const newPost = response.data;
        pushNewPost(response.data);
        newPost.postImagesUrl.forEach(postImg => {
          
          console.log(postImg)
        });
        setClose();
      }
    } catch (error) {
      setErrorMessage(error.response?.data || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full sm:w-[500px] bg-gray-800/90 rounded-2xl shadow-2xl text-white p-6 relative flex flex-col gap-5 border border-gray-700/40">
        <button
          onClick={setClose}
          className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 rounded-full transition"
        >
          <ImCross size={14} />
        </button>

        <h2 className="text-xl font-semibold text-center border-b border-gray-600 pb-3">
          Create Post
        </h2>

        <div className="flex items-center gap-3 mt-2">
          <img
            src={profileImgUrl || noProfileImg}
            alt="profile"
            className="w-12 h-12 rounded-full object-cover border border-cyan-600"
          />
          <span className="font-medium text-gray-100">{displayUsername}</span>
        </div>

        <textarea
          placeholder="What's on your mind?"
          className="w-full h-28 bg-gray-900/40 text-gray-100 border border-gray-700 rounded-xl p-3 resize-none focus:outline-none focus:border-cyan-600"
          value={postData.Content}
          onChange={handleContentChange}
        />

        {errorMessage && (
          <p className="text-sm text-red-400 -mt-3">{errorMessage}</p>
        )}

        {/* Image upload */}
        <div>
          <input
            type="file"
            id="fileInput"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 bg-gray-700/60 rounded-lg hover:bg-gray-700 cursor-pointer transition"
          >
            <FcAddImage size={20} /> Add photos
          </label>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {previews.map((file) => (
              <div
                key={file.name}
                className="relative group w-28 h-28 rounded-lg overflow-hidden"
              >
                <img
                  src={file.url}
                  alt={file.name}
                  className="object-cover w-full h-full rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeImage(file.name)}
                  className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={addPost}
          disabled={isSubmitting}
          className={`mt-3 bg-cyan-700 hover:bg-cyan-600 text-white py-2 rounded-xl font-medium transition ${
            isSubmitting && "opacity-60 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
};

export default AddPost;
