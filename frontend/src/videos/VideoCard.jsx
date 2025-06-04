import React, { forwardRef, useState } from "react";
import {
  FaHeart,
  FaCommentDots,
  FaShareAlt,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaPaperPlane,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
const VideoCard = forwardRef(({ video }, ref) => {
  const [likes, setLikes] = useState(video.likes);
  const [comments, setComments] = useState(video.comments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleLike = async (id) => {
    const token = Cookies.get("Token")
      ? JSON.parse(Cookies.get("Token"))
      : null;

    if (!token) {
      alert("Please login to like this video");
      return;
    }

    try {
      const response = await axios.put(
        `https://lipu.w4u.in/mlm/api/v1/toggle/like/${id}`,
        {},
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      console.log("Like response:", response.data);
      // Optionally refresh video state here
    } catch (error) {
      console.error(
        "Error toggling like:",
        error.response?.data || error.message
      );
    }
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments([...comments, { user: "You", comment: newComment }]);
      setNewComment("");
    }
  };

  const handleShare = (platform) => {
    alert(`Sharing to ${platform}: ${video.video.url}`);
  };

  console.log(`https://lipu.w4u.in/mlm${video.video.url}`);

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      <video
        ref={ref}
        src={`https://lipu.w4u.in/mlm${video?.video?.url}`} // ✅ Correct
        className="w-full h-full object-cover"
        playsInline
        loop
        controls
      />

      {/* Actions */}
      <div className="absolute bottom-16  mb-28 right-5 flex flex-col gap-5 text-white text-2xl">
        {/* Like */}
        <button
          onClick={() => {
            handleLike(video._id);
          }}
          className="flex flex-col items-center hover:text-red-500 transition"
        >
          <FaHeart />
          <span className="text-sm">{video?.likes}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex flex-col items-center hover:text-blue-400 transition"
        >
          <FaCommentDots />
          <span className="text-sm">{video?.reviews.length}</span>
        </button>

        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex flex-col items-center hover:text-green-400 transition"
          >
            <FaShareAlt />
          </button>

          {/* Share Options */}
          {showShareOptions && (
            <div className="absolute right-10 bottom-0 flex flex-col gap-2 bg-black bg-opacity-70 p-2 rounded">
              <button
                onClick={() => handleShare("Instagram")}
                className="hover:text-pink-500"
              >
                <FaInstagram />
              </button>
              <button
                onClick={() => handleShare("Facebook")}
                className="hover:text-blue-500"
              >
                <FaFacebook />
              </button>
              <button
                onClick={() => handleShare("YouTube")}
                className="hover:text-red-600"
              >
                <FaYoutube />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <div className="absolute bottom-10 left-0 w-full bg-black bg-opacity-80 text-white max-h-[40%] overflow-y-auto rounded-t-xl">
          <div className="p-3 space-y-2">
            <h3 className="text-lg font-bold  mb-12">Comments</h3>
            {comments?.length > 0 ? (
              comments?.map((cmt, idx) => (
                <p key={idx}>
                  <span className="font-semibold">{cmt.user}:</span>{" "}
                  {cmt.comment}
                </p>
              ))
            ) : (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}
          </div>

          {/* Comment Input */}
          <div className="w-full p-3  mb-16 flex items-center gap-2 border-t border-gray-600 bg-gray-900">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-800 text-white p-2 rounded outline-none"
            />
            <button
              onClick={handleCommentSubmit}
              className="text-blue-400 text-xl"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoCard;
