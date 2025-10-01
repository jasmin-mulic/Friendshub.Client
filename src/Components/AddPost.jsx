import React, { useState } from "react";
import noProfileImg from "../assets/noProfilePic.jpg";
import { useUserDataStore } from "../Services/Stores/useUserDataStore";
import { FcAddImage } from "react-icons/fc";
import { ImCross } from "react-icons/im";

const AddPost = () => {
  const { displayUsername, profileImgUrl } = useUserDataStore();
  const [previews, setPreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState(null);
  const [content, setContent] = useState();
  const [errorMessage, setErrorMessage] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    console.log(files);

    // napravi preview URL-ove
    const urls = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...urls]);
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };
  const addPost = async () => {
    if (content == null && imageFiles == null)
      setErrorMessage("Please add an image or content.");
    try {
    } catch (error) {}
  };
  return (
    <div
    style={{display: showForm != true ?  "none" : "block"}} 
    className="absolute top-0 bottom-0 left-0 right-0 bg-gray-300/30 mx-auto flex justify-center items-center"
    >
      <div className="w-full sm:w-180 h-140 border rounded-2xl bg-white p-3 flex flex-col relative mx-auto mt-10">
        <div>
          <input onClick={() => setShowForm(!showForm)} id="triggerForm"  style={{ display: "none" }} />
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
            className="p-2 rounded-xl hover:bg-gray-200 cursor-pointer inline-flex items-center"
          >
            <FcAddImage className="w-6 h-6 text-gray-700" />
            <span className="ml-2 text-sm text-gray-600">Add photos</span>
          </label>
        </div>

        {/* preview sekcija */}
        {
          <div className="mt-4 flex gap-3">
            {previews.map((file, i) => (
              <div key={i} className="relative">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-30 h-24 object-cover rounded-lg shadow"
                />
              </div>
            ))}
          </div>
        }
        <button
          onClick={addPost}
          className="absolute bottom-5 9 mx-auto bg-green-600 left-2 right-2 rounded-md text-xl text-white py-1"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default AddPost;
