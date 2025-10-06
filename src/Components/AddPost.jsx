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
  const [postData, setPostData] = useState({
    Content: "",
    ImagePaths: [],
  });
  const [errorMessage, setErrorMessage] = useState(null);
  
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPostData((prev) => ({
      ...prev,
      ImagePaths: files,
    }));
    
    const urls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...urls]);
  };

  const removeImage = (name) => {
    console.log(name)
    console.log(postData.ImagePaths);
    const previewsFiltered = previews.filter((file) => file.name != name);
    const imagePaths = postData.ImagePaths.filter((file) => file.name != name)
    setPreviews(previewsFiltered);
    setPostData((prev) => ({
      ...prev,
      ImagePaths : imagePaths
    }))
  };
  const handleContentChange = (e) => {
    setPostData((prev) => ({
      ...prev,
      Content: e.target.value,
    }));
  };
  const addPost = async () => {
    if (postData.Content == "" && postData.ImagePaths.length == 0)
      setErrorMessage("Please add an image or content.");
    else {

      setErrorMessage(null)
      const formData = new FormData();
      formData.append("Content", postData.Content)
      postData.ImagePaths.forEach(element => {
        formData.append("ImagePaths", element)
      });

      try {
        const response = await PostsApi.addPost(formData);
        if(response.status == 200)
        {
          pushNewPost(response.data)
          setClose()
        }
      } catch (error) {
        setErrorMessage(error.response);
        
      }
    }
  };
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 bg-gray-300/30 mx-auto flex justify-center items-center">
      <div className="w-full sm:w-180 min-h-140  rounded-2xl bg-gray-900 text-white p-5 flex flex-col justify-between relative mx-auto h-fit">
        <div>
          <input
            onClick={setClose}
            id="triggerForm"
            style={{ display: "none" }}
            className="text-white"
          />
          <label htmlFor="triggerForm">
            <ImCross className="bg-red-500 text-white text-xl p-1 w-5 absolute right-2 cursor-pointer" />
          </label>
        </div>

        <h2 className="text-xl text-center mt-2 border-b border-gray-500/50 pb-3">
          Create post
        </h2>

        <div className="flex items-center gap-2 mt-4">
          <img
            className="w-15 h-15 rounded-full object-cover"
            src={profileImgUrl ? profileImgUrl : noProfileImg}
            alt="profile"
          />
          <span>{displayUsername}</span>
        </div>
        <div className="mt-4">
          <textarea
            placeholder="Post something interesting :)"
            name="content"
            className="text-xl w-full h-32 p-2 text-gray-600 border border-gray-300 rounded-lg resize-none"
            onChange={handleContentChange}
          />
          <div className="h-2">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
          <label
            htmlFor="fileInput"
            className="p-2 rounded-xl hover:bg-gray-800 cursor-pointer inline-flex items-center"
          >
            <FcAddImage className="w-6 h-6 text-gray-700" />
            <span className="ml-2 text-sm text-white">Add photos</span>
          </label>
        </div>

        {/* preview sekcija */}
        {
          <div className="mt-4 flex gap-3 flex-wrap h-fit justify-start">
            {previews.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-30 h-30 object-cover rounded-lg shadow"
                />

                {/* ikonica za brisanje */}
                <button
                  type="button"
                  onClick={() => removeImage(file.name)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={30} className="bg-red-500/20" />
                </button>
              </div>
            ))}
          </div>
        }
        <button
          onClick={addPost}
          className="bg-green-600 mt-2 rounded-md text-xl text-white py-1"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default AddPost;
