import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiTrash } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import { FaRegImage, FaVideo } from "react-icons/fa";
import Cookies from "js-cookie";

const AddVideo = () => {
  const [images, setImages] = useState([]);
  const [base64Images, setBase64Images] = useState([]);
  const [video, setVideo] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [emergency, setEmergency] = useState(false);

  const [videoPreview, setVideoPreview] = useState(null);

  console.log(emergency, "ghhghg");
  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoPreview(url);

      return () => URL.revokeObjectURL(url); // Clean up
    }
  }, [video]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const base64Promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(base64Promises)
      .then((base64Array) => setBase64Images(base64Array))
      .catch((err) => console.error("Image conversion error:", err));
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    const updatedBase64 = [...base64Images];
    updatedImages.splice(index, 1);
    updatedBase64.splice(index, 1);
    setImages(updatedImages);
    setBase64Images(updatedBase64);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleUpload = async () => {
    if (!video || !images) {
      alert("Please  upload a images or video.");
      return;
    }

    console.log(emergency);
    const payload = {
      images: base64Images,
      caption,
      location,
      emergency,
      video,
    };

    console.log(payload);

    const token = JSON.parse(Cookies.get("Token"));

    const uploadRequest = async (finalPayload) => {
      try {
        setUploading(true);
        const res = await axios.post(
          "https://real-hero-vkna.vercel.app/api/v1/video/new",
          finalPayload,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `${token}`,
            },
          }
        );
        alert("Uploaded successfully!");
        console.log(res.data);
        // Reset form
        setImages([]);
        setBase64Images([]);
        setVideo(null);
        setCaption("");
        setLocation("");
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed.");
      } finally {
        setUploading(false);
      }
    };

    if (video) {
      const reader = new FileReader();
      reader.onloadend = () => {
        payload.video = reader.result;
        uploadRequest(payload);
      };
      reader.readAsDataURL(video);
    } else {
      uploadRequest(payload);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20 bg-white shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Add Video
      </h2>

      {/* Caption */}
      <textarea
        rows="3"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        className="w-full p-3 mb-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MdLocationOn className="text-xl text-red-500" />
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your current location"
          className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
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
          className="block w-full mt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
        />
      </label>

      {/* Image Preview */}
      <div className="flex flex-wrap gap-3 mb-4">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={videoPreview}
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

      {emergency && (
        <div className="animate-ping absolute   top-28 left-54 w-4 h-4 bg-red-500 rounded-full"></div>
      )}

      <label className="block mb-3 text-sm font-medium text-gray-700">
        <FaVideo className="inline mr-1" />
        Select Video
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          className="block w-full mt-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
        />
      </label>

      {/* Video Preview */}
      {video && (
        <div className="relative mb-4">
          <video
            controls
            src={URL.createObjectURL(video)}
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
      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="w-full py-3  mb-44 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200 flex items-center justify-center gap-2"
      >
        <FiUpload />
        {uploading ? "Uploading..." : "Upload Product"}
      </button>
    </div>
  );
};

export default AddVideo;
