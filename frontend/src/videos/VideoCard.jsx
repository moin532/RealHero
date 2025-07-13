import React, { forwardRef, useState, useEffect, useRef } from "react";
import {
  FaHeart,
  FaCommentDots,
  FaShareAlt,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaPaperPlane,
  FaTrash,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";

const VideoCard = forwardRef(({ video }, ref) => {
  const [likes, setLikes] = useState(video.likes);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Ref for comment section to detect clicks outside
  const commentSectionRef = useRef(null);

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
        `http://localhost:4000/api/v1/toggle/like/${id}`,
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

  // Get current user from token
  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        const tokenData = JSON.parse(token);
        setCurrentUser(tokenData);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Load comments when comments section is opened
  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  // Handle clicks outside comment section
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showComments &&
        commentSectionRef.current &&
        !commentSectionRef.current.contains(event.target)
      ) {
        // Check if the click is not on the comment button itself
        const commentButton = event.target.closest("[data-comment-button]");
        if (!commentButton) {
          setShowComments(false);
        }
      }
    };

    // Add event listener when comments are shown
    if (showComments) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showComments]);

  const loadComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/v1/video/${video._id}/comments`
      );
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const token = Cookies.get("Token")
      ? JSON.parse(Cookies.get("Token"))
      : null;
    if (!token) {
      alert("Please login to comment");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/video/${video._id}/comment`,
        { comment: newComment },
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        setNewComment("");
        // Reload comments to get the updated list
        await loadComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert(error.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = Cookies.get("Token")
      ? JSON.parse(Cookies.get("Token"))
      : null;
    if (!token) {
      alert("Please login to delete comments");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:4000/api/v1/video/${video._id}/comment/${commentId}`,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        // Reload comments to get the updated list
        await loadComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleShare = (platform) => {
    alert(`Sharing to ${platform}: ${video.video.url}`);
  };

  console.log(`http://localhost:4000${video.video.url}`);

  return (
    <div className="relative w-full h-screen flex justify-center items-center bg-black">
      <video
        ref={ref}
        src={`http://localhost:4000${video?.video?.url}`}
        className="w-full h-full object-cover"
        playsInline
        loop
        controls
        onError={(e) => {
          console.error("Video error:", e);
        }}
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
          data-comment-button
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
        <div
          ref={commentSectionRef}
          className="absolute bottom-0 left-0 w-full bg-black bg-opacity-90 text-white max-h-[50%] overflow-y-auto rounded-t-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 space-y-3">
            <h3 className="text-lg font-bold mb-4">
              Comments ({comments.length})
            </h3>
            {comments?.length > 0 ? (
              comments?.map((comment, idx) => (
                <div
                  key={comment._id || idx}
                  className="flex justify-between items-start space-x-2"
                >
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold text-blue-400">
                        {comment.name || comment.user?.name || "Anonymous"}
                      </span>
                      <span className="text-gray-300 ml-2">
                        {comment.comment}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {/* Show delete button only for comment author */}
                  {currentUser && comment.user === currentUser.id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-400 hover:text-red-300 text-sm p-1"
                      title="Delete comment"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No comments yet.</p>
            )}
          </div>

          {/* Comment Input - Fixed positioning */}
          <div className="w-full p-4 border-t border-gray-600 bg-gray-900 sticky bottom-50  mb-56">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !loading) {
                    handleCommentSubmit();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleCommentSubmit}
                disabled={loading || !newComment.trim()}
                className="text-blue-400 text-xl p-2 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaPaperPlane />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default VideoCard;
