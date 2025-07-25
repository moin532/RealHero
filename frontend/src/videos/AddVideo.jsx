import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiTrash } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { FaRegImage, FaVideo } from "react-icons/fa";
import Cookies from "js-cookie";

const AddVideo = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    if (images.length > 0) {
      const previews = images.map((img) => URL.createObjectURL(img));
      setImagePreviews(previews);

      // Clean up on unmount
      return () => previews.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [images]);

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoPreview(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [video]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleUpload = async () => {
    if (images.length === 0 && !video) {
      alert("Please select at least one image or a video.");
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));
    if (video) formData.append("video", video);

    formData.append("caption", caption);
    formData.append("location", location);
    formData.append("emergency", emergency);

    const token = JSON.parse(Cookies.get("Token"));

    try {
      setUploading(true);
      const res = await axios.post(
        "  http://localhost:4000/api/v1/video/new",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `${token}`,
          },
        }
      );
      alert("Uploaded successfully!");
      setImages([]);
      setImagePreviews([]);
      setVideo(null);
      setVideoPreview(null);
      setCaption("");
      setLocation("");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Add Video
      </h2>

      <textarea
        rows="3"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        className="w-full p-3 mb-3 border rounded-lg text-sm"
      />

      <div className="flex items-center gap-2 mb-4">
        <MdLocationOn className="text-xl text-red-500" />
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your current location"
          className="w-full p-2 border rounded-lg text-sm"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-red-600">
          Emergency Mode
        </span>
        <button
          onClick={() => setEmergency(!emergency)}
          className={`w-12 h-6 rounded-full mb-8 flex items-center p-1 transition duration-300 ease-in-out ${
            emergency ? "bg-red-600" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full shadow-md transform duration-300 ${
              emergency ? "translate-x-6" : ""
            }`}
          ></div>
        </button>
      </div>

      <label className="block mb-3 text-sm font-medium text-gray-700">
        <FaRegImage className="inline mr-1" />
        Select Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="block w-full mt-2"
        />
      </label>

      <div className="flex flex-wrap gap-3 mb-4">
        {imagePreviews.map((src, i) => (
          <div key={i} className="relative">
            <img
              src={src}
              alt={`preview ${i}`}
              className="w-20 h-20 object-cover rounded-lg border shadow-sm"
            />
            <button
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
            >
              <FiTrash />
            </button>
          </div>
        ))}
      </div>

      <label className="block mb-3 text-sm font-medium text-gray-700">
        <FaVideo className="inline mr-1" />
        Select Video
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="block w-full mt-2"
        />
      </label>

      {videoPreview && (
        <div className="relative mb-4">
          <video
            controls
            src={videoPreview}
            className="w-full max-h-64 rounded-xl shadow"
          />
          <button
            onClick={removeVideo}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            <FiTrash />
          </button>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-3 mb-44 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
      >
        <FiUpload />
        {uploading ? "Uploading..." : "Upload Product"}
      </button>
    </div>
  );
};

export default AddVideo;
