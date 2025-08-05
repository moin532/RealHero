import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../../redux/action/UserAction";
import { useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiLogOut,
  FiPlus,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { FaPlusCircle } from "react-icons/fa";
import axios from "axios";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useSelector((state) => state.User);


  console.log(user)
  const myuser = user?.user?.[0] || {};
  const myVideos = user?.myVideos || [];

  useEffect(() => {
    dispatch(loadUserAction());
  }, [dispatch]);

  const Handlelogout = () => {
    Cookies.remove("Token");
    navigate("/login");
    window.alert("Logout success");
    window.location.reload();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    designation: "Driver",
    mobile: "",
    dlNo: "",
    policeStation: "",
    city: "",
    state: "",
    bloodGroup: "",
    dob: "",
    cardNo: "",
    issueDate: "",
    expiryDate: "",
    memberAddress: "",
    photo: null,
  });

  // Function to generate 5-digit card number
  const generateCardNumber = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Function to get expiry date (current date + 1 year)
  const getExpiryDate = () => {
    const today = new Date();
    const expiryDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    return expiryDate.toISOString().split('T')[0];
  };

  // Function to check if card is valid
  const isCardValid = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return today <= expiry;
  };

  // Function to get remaining validity days
  const getRemainingDays = (expiryDate) => {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Function to initialize form with auto-generated card details
  const initializeFormWithCardDetails = () => {
    setFormData(prev => ({
      ...prev,
      cardNo: generateCardNumber(),
      issueDate: getCurrentDate(),
      expiryDate: getExpiryDate(),
    }));
  };

  // Function to check if card already exists by mobile number
  const checkExistingCard = async (mobile) => {
    if (!mobile) return null;
    
    const token = Cookies.get("Token");
    if (!token) return null;
    
    try {
      const res = await axios.get(
        `https://api.realhero.in/api/driver-id/mobile/${mobile}`,
        {
          headers: { authorization: token },
        }
      );
      if (res.data.success && res.data.card) {
        return res.data.card;
      }
    } catch (err) {
      // No card found
    }
    return null;
  };
  const [cardPreview, setCardPreview] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [cardId, setCardId] = useState("");
  const [showBack, setShowBack] = useState(false);
  const [isCheckingCard, setIsCheckingCard] = useState(false);

  const handleNavigate = () => {
    navigate("/salah");
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeletingVideoId(videoId);
      const token = Cookies.get("Token")
        

      if (!token) {
        alert("Please login to delete videos");
        return;
      }

      const response = await axios.delete(
        `https://api.realhero.in/api/v1/admin/product/${videoId}`,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      if (response.data.success) {
        const updatedVideos = myVideos.filter((video) => video._id !== videoId);

        dispatch({
          type: "UPDATE_USER_VIDEOS",
          payload: {
            ...user,
            myVideos: updatedVideos,
          },
        });

        dispatch(loadUserAction());
        alert("Video deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert(error.response?.data?.message || "Failed to delete video");
    } finally {
      setIsDeleting(false);
      setDeletingVideoId(null);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that card details are generated
    if (!formData.cardNo || !formData.issueDate || !formData.expiryDate) {
      alert("Card details not generated. Please try again.");
      return;
    }
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    const token = Cookies.get("Token");
    const userId = myuser?._id;
    if (userId) {
      data.append("userId", userId);
    }
    try {
      const res = await axios.post(
        "https://api.realhero.in/api/driver-id/apply",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: token,
          },
        }
      );
      if (res.data.success) {
        setCardPreview(res.data.card);
        setQrValue(
          window.location.origin + "/driver-id/" + res.data.card.cardNo
        );
        setCardId(res.data.card._id);
        setIsModalOpen(false); // Close modal after successful submission
      }
    } catch (err) {
      alert("Failed to apply: " + err.message);
    }
  };

  useEffect(() => {
    const fetchIdCard = async () => {
          const token = Cookies.get("Token");
      const userId = myuser?._id;
      const userMobile = myuser?.number || user?.user?.number;
      
      if (!userId || !token) return;
      
      try {
        // First try to fetch by userId
        const res = await axios.get(
          `https://api.realhero.in/api/driver-id/user/${userId}`,
          {
            headers: { authorization: token },
          }
        );
        if (res.data.success && res.data.card) {
          setCardPreview(res.data.card);
          setQrValue(
            window.location.origin + "/driver-id/" + res.data.card.cardNo
          );
          setCardId(res.data.card._id);
          return;
        }
      } catch (err) {
        // No card found by userId, try mobile number
      }
      
      // If no card found by userId, try by mobile number
      if (userMobile) {
        try {
          const res = await axios.get(
            `https://api.realhero.in/api/driver-id/mobile/${userMobile}`,
            {
              headers: { authorization: token },
            }
          );
          if (res.data.success && res.data.card) {
            setCardPreview(res.data.card);
            setQrValue(
              window.location.origin + "/driver-id/" + res.data.card.cardNo
            );
            setCardId(res.data.card._id);
          }
        } catch (err) {
          // No card found by mobile number either
        }
      }
    };
    fetchIdCard();
    // Only run when user is loaded
  }, [myuser?._id, user?.user?.number]);

  const handleDownload = async () => {
    const cardDiv = document.getElementById("driver-id-card-preview");
    if (!cardDiv) return;
    // Wait for all images and QR canvases inside the card to load
    const images = cardDiv.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = img.onerror = resolve;
        });
      })
    );
    // Wait for QRCode canvas to render
    const qrCanvas = cardDiv.querySelector("canvas");
    if (qrCanvas && !qrCanvas.toDataURL) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
    // Now render to canvas
    const canvas = await html2canvas(cardDiv, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "driver-id-card.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={myuser?.profile?.url || "/profile.png"}
                  alt="profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                  <FiEdit className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 pb-8 px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user && user[0]?.name || user?.user?.name}
                </h2>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiPhone className="mr-3" />
                    <span>{myuser?.number ||  user?.user?.number}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-3" />
                    <span>Joined {myuser?.createdAt?.slice(0, 10)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-md">
                  <FiEdit />
                  Update Profile
                </button>

                <button
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md"
                  onClick={() => {
                    setIsModalOpen(true);
                    setSelectedOption("");
                  }}
                >
                  <FiPlus />
                  More Options
                </button>
                {!cardPreview ? (
                  <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-full transition-colors shadow-md ${
                      isCheckingCard 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-cyan-500 text-white hover:bg-green-600'
                    }`}
                    onClick={async () => {
                      if (isCheckingCard) return;
                      
                      setIsCheckingCard(true);
                      try {
                        // Check if card already exists by mobile number
                        const userMobile = myuser?.number || user?.user?.number;
                        if (userMobile) {
                          const existingCard = await checkExistingCard(userMobile);
                          if (existingCard) {
                            setCardPreview(existingCard);
                            setQrValue(
                              window.location.origin + "/driver-id/" + existingCard.cardNo
                            );
                            setCardId(existingCard._id);
                            setIsModalOpen(true);
                            setSelectedOption("applyIdCard");
                            return;
                          }
                        }
                        
                        // If no existing card, proceed with application
                        setIsModalOpen(true);
                        setSelectedOption("applyIdCard");
                        initializeFormWithCardDetails();
                      } finally {
                        setIsCheckingCard(false);
                      }
                    }}
                    disabled={isCheckingCard}
                  >
                    {isCheckingCard ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiPlus />
                    )}
                    {isCheckingCard ? 'Checking...' : 'Apply for Id card'}
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-2  bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                    onClick={() => {
                      setIsModalOpen(true);
                      setSelectedOption("applyIdCard");
                    }}
                  >
                    <FiUser />
                    View ID Card
                  </button>
                )}
                <button
                  className="flex items-center gap-2   bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-md"
                  onClick={() => {
                    navigate("/post/video");
                  }}
                >
                  <FaPlusCircle />
                  upload a video
                </button>

                <button
                  className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors shadow-md"
                  onClick={Handlelogout}
                >
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">My Videos</h3>
            <span className="text-gray-500">
              {myVideos?.length || 0} videos
            </span>
          </div>

          {myVideos && myVideos?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map((videoData) => (
                <div
                  key={videoData._id}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                >
                  <div className="relative aspect-video">
                    <video
                      src={`  https://api.realhero.in${videoData?.video?.url}`}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      preload="metadata"
                      onMouseOver={(e) => e.target.play()}
                      onMouseOut={(e) => e.target.pause()}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800 line-clamp-1">
                          {videoData.title || "Untitled Video"}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(videoData.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(videoData._id)}
                        disabled={
                          isDeleting && deletingVideoId === videoData._id
                        }
                        className={`p-2 rounded-full transition-all duration-300
                          ${
                            isDeleting && deletingVideoId === videoData._id
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-red-50 text-red-500 hover:bg-red-100 group-hover:opacity-100 opacity-0"
                          }`}
                        title="Delete video"
                      >
                        {isDeleting && deletingVideoId === videoData._id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Video Stats */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        {/* <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                        </svg> */}
                        {/* {videoData.views || 0} views */}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {videoData.likes || 0} likes
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Videos Yet
              </h3>
              <p className="text-gray-500">
                Start sharing your moments by uploading your first video!
              </p>
              <button
                onClick={() => navigate("/post/video")}
                className="mt-4 inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FiPlus />
                Upload Video
              </button>
            </div>
          )}
        </div>
      </div>

      {/* More Options Modal */}
      {isModalOpen && selectedOption !== "applyIdCard" && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl relative animate-fadeIn">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              More Options
            </h2>
            <select
              className="w-full border border-gray-200 rounded-xl p-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="Salah">Salah Reminder</option>
            </select>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                onClick={handleNavigate}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Driver ID Card Application */}
      {isModalOpen && selectedOption === "applyIdCard" && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative animate-fadeIn">
            <div className="flex flex-col max-h-[90vh] overflow-y-auto p-8">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-700 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
              {!cardPreview ? (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <h2 className="text-2xl font-extrabold mb-4 text-center text-blue-700 tracking-tight">
                    Apply for Driver ID Card
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Name"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="fatherName"
                      value={formData.fatherName}
                      onChange={handleFormChange}
                      placeholder="Father's Name"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="designation"
                      value={formData.designation}
                      onChange={handleFormChange}
                      placeholder="Designation"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleFormChange}
                      placeholder="Mobile"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="dlNo"
                      value={formData.dlNo}
                      onChange={handleFormChange}
                      placeholder="D.L. No"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="policeStation"
                      value={formData.policeStation}
                      onChange={handleFormChange}
                      placeholder="Police Station"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      placeholder="City"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      placeholder="State"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleFormChange}
                      placeholder="Blood Group"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                    <input
                      name="dob"
                      value={formData.dob}
                      onChange={handleFormChange}
                      placeholder="Date of Birth"
                      className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400"
                      required
                    />
                     <input
                    name="memberAddress"
                    value={formData.memberAddress}
                    onChange={handleFormChange}
                    placeholder="Member Address"
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                    <div className="col-span-2  p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2"> Card Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Card No:</span>
                          <span className="ml-2 font-mono font-bold text-blue-700">{formData.cardNo}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Issue Date:</span>
                          <span className="ml-2 font-mono text-blue-700">{formData.issueDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expiry Date:</span>
                          <span className="ml-2 font-mono text-blue-700">{formData.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  <div className="flex flex-col items-center gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Photo
                    </label>
                    <input
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-200 rounded-lg"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg font-bold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all text-lg"
                  >
                    Submit Application
                  </button>
                </form>
              ) : (
                <div className="space-y-4 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-extrabold mb-2 text-blue-700">
                    Your Driver ID Card
                  </h2>
                  <div
                    id="driver-id-card-preview"
                    className="bg-white border-4 border-blue-600 rounded-2xl shadow-2xl flex flex-col items-center relative"
                    style={{
                      width: "340px",
                      fontFamily: "Inter, Arial, sans-serif",
                      overflow: "hidden",
                      background: "#fff",
                      minHeight: "480px",
                    }}
                  >
                    {/* Validity Status Badge */}
                    <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold text-white z-10 ${isCardValid(cardPreview.expiryDate) ? 'bg-green-500' : 'bg-red-500'}`}>
                      {isCardValid(cardPreview.expiryDate) ? 'VALID' : 'EXPIRED'}
                    </div>
                    {showBack ? (
                      // BACK SIDE DESIGN
                      <div
                        className="w-full h-full flex flex-col justify-between p-4"
                        style={{ minHeight: "470px" }}
                      >
                        {/* Instructions */}
                        <div
                          className="text-[13px] text-black font-semibold mb-2"
                          style={{ lineHeight: "1.2" }}
                        >
                          <div>
                            1. THIS CARD MUST BE SURRENDERED AT THE EVENT OF
                            TRANSFER OR DISCHARGE FROM SERVICE OF EMPLOYER.
                          </div>
                          <div className="mt-1">
                            2. THIS LOSS OF CARD SHOULD BE BROUGHT TO THE NOTICE
                            OF ALL DRIVER WELFARE ASSOCIATION (INDIA)
                            IMMEDIATELY.
                          </div>
                          <div className="mt-1">
                            3. THIS CARD IS NOT USE FOR LEGAL PURPOSE.
                          </div>
                          <div className="mt-1">4. CARD VALID FOR 1 YEAR.</div>
                        </div>
                        {/* Card No, Issue, Expiry */}
                        <div className="w-full flex flex-col gap-1 mt-2 mb-2">
                          <div className="flex items-center text-[13px] font-bold">
                            <span className="w-[40%] bg-blue-900 text-white px-2 py-1 rounded-l">
                              CARD NO
                            </span>
                            <span className="w-[60%] border border-blue-900 px-2 py-1">
                              {cardPreview.cardNo}
                            </span>
                          </div>
                          <div className="flex items-center text-[13px] font-bold mt-1">
                            <span className="w-[40%] bg-green-600 text-white px-2 py-1 rounded-l">
                              ISSUE DATE
                            </span>
                            <span className="w-[60%] border border-green-600 px-2 py-1">
                              {cardPreview.issueDate}
                            </span>
                          </div>
                          <div className="flex items-center text-[13px] font-bold mt-1">
                            <span className="w-[40%] bg-red-600 text-white px-2 py-1 rounded-l">
                              EXPIRY DATE
                            </span>
                            <span className="w-[60%] border border-red-600 px-2 py-1">
                              {cardPreview.expiryDate}
                            </span>
                          </div>
                          <div className="flex items-center text-[13px] font-bold mt-1">
                            <span className={`w-[40%] px-2 py-1 rounded-l ${isCardValid(cardPreview.expiryDate) ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                              STATUS
                            </span>
                            <span className={`w-[60%] border px-2 py-1 ${isCardValid(cardPreview.expiryDate) ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}`}>
                              {isCardValid(cardPreview.expiryDate) ? `VALID (${getRemainingDays(cardPreview.expiryDate)} days left)` : 'EXPIRED'}
                            </span>
                          </div>
                        </div>
                        {/* Date of First Issue, State, Signature */}
                        <div className="flex flex-col gap-1 mt-2 mb-2">
                          <div className="text-[12px] text-black">
                            Date of Frist Issue{" "}
                            <span className="font-bold">
                              {cardPreview.issueDate}
                            </span>
                          </div>
                          <div className="text-[13px] text-red-700 font-bold">
                            Haryana
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-[12px] text-gray-700">
                              National General Secretary
                            </span>
                            <span className="text-[12px] text-red-700 font-bold">
                              AUTH. SIGNATURE
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span className="text-[12px] text-black font-bold">
                              Member Address:
                            </span>
                            <span className="ml-1 text-[12px] text-black">
                              {cardPreview.memberAddress}
                            </span>
                          </div>
                          <div className="text-[12px] text-black">
                            Vill:SUDAKA-NUH
                          </div>
                          <div className="text-[12px] text-black">
                            Distt-NUH Mewat
                          </div>
                          <div className="text-[12px] text-black">
                            Haryana Pin-122107
                          </div>
                        </div>
                        {/* Bottom colored line */}
                        <div
                          className="w-full h-1 mt-2"
                          style={{
                            background:
                              "linear-gradient(90deg, #e53935 33%, #43a047 33%, #43a047 66%, #1976d2 66%)",
                          }}
                        ></div>
                      </div>
                    ) : (
                      // FRONT SIDE DESIGN
                      <>
                        {/* Header */}
                        <div className="w-full text-center border-b-4 border-red-600 pb-2 pt-2 bg-gradient-to-r from-blue-50 to-blue-100">
                          <div className="flex justify-between items-center px-3 mb-1">
                            <span className="text-xs font-bold text-gray-700">
                              Mob: 9381265784/8930740264
                            </span>
                            <span className="text-xs font-bold text-gray-700">
                              GOVT.REGD NO : 202
                            </span>
                          </div>
                          <div className="font-extrabold text-lg text-red-700 leading-tight tracking-tight">
                            ALL DRIVERS
                          </div>
                          <div className="font-bold text-blue-800 text-base -mt-1">
                            WELFARE ASSOCIATION
                          </div>
                          <div className="text-xs font-bold text-green-700 mt-1">
                            OFFICE ADDRESS
                          </div>
                          <div className="text-xs text-gray-700">
                            199/1, Aman Hospital Wali Gali, Kartar Nagar, Punjab
                            Ludhiana-141003
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            Email: alldriverwelfareassociationw.b@gmail.com
                          </div>
                        </div>
                        {/* Colored line */}
                        <div
                          className="w-full h-1"
                          style={{
                            background:
                              "linear-gradient(90deg, #e53935 33%, #43a047 33%, #43a047 66%, #1976d2 66%)",
                          }}
                        ></div>
                        {/* Photo, QR, and Seal Row */}
                        <div className="flex flex-row items-center justify-between w-full px-3 mt-3 mb-2">
                          <div className="flex-1 flex justify-center">
                            <div
                              className="rounded-lg border-2 border-gray-300 bg-gray-100 shadow-inner p-1 flex items-center justify-center"
                              style={{ width: "70px", height: "90px" }}
                            >
                              <img
                                src={
                                  cardPreview.photoUrl
                                    ? cardPreview.photoUrl.startsWith("/")
                                      ? `https://api.realhero.in${cardPreview.photoUrl}`
                                      : cardPreview.photoUrl
                                    : ""
                                }
                                alt="profile"
                                className="w-full h-full object-cover rounded"
                                style={{
                                  background: "#eee",
                                  minHeight: "80px",
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col items-center">
                            <div className="w-14 h-14 flex items-center justify-center text-[10px] text-blue-700 font-bold mt-2  rounded-full bg-white shadow">
                              DRIVER WELFARE ASSOCIATION
                            </div>
                          </div>
                          <div className="flex-1 flex justify-center">
                            <div className="w-16 h-16 flex items-center justify-center bg-white border-2 border-gray-300 rounded-lg shadow">
                              <QRCodeCanvas
                                value="http://localhost:5173"
                                size={56}
                                bgColor="#fff"
                                fgColor="#222"
                                includeMargin={true}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Details Table */}
                        <div className="w-full px-4 mt-2 mb-2">
                          <div className="flex text-[13px] font-semibold text-gray-800 mb-1">
                            <span className="w-[40%]">Name</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">{cardPreview.name}</span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Son/Daughter</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">
                              {cardPreview.fatherName}
                            </span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Designation</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">
                              {cardPreview.designation}
                            </span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Mobile No</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">
                              {cardPreview.mobile}
                            </span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">D.L.NO.</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">{cardPreview.dlNo}</span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Police Station</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">
                              {cardPreview.policeStation}
                            </span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">City</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">{cardPreview.city}</span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">State</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">{cardPreview.state}</span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Blood Group</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">
                              {cardPreview.bloodGroup}
                            </span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Date of Birth</span>
                            <span className="w-[5%]">:</span>
                            <span className="w-[55%]">{cardPreview.dob}</span>
                          </div>
                          <div className="flex text-[13px] text-gray-700 mb-1">
                            <span className="w-[40%]">Card Status</span>
                            <span className="w-[5%]">:</span>
                            <span className={`w-[55%] font-semibold ${isCardValid(cardPreview.expiryDate) ? 'text-green-600' : 'text-red-600'}`}>
                              {isCardValid(cardPreview.expiryDate) ? `VALID (${getRemainingDays(cardPreview.expiryDate)} days left)` : 'EXPIRED'}
                            </span>
                          </div>
                        </div>
                        {/* Bottom colored line */}
                        <div
                          className="w-full h-1 mt-2"
                          style={{
                            background:
                              "linear-gradient(90deg, #e53935 33%, #43a047 33%, #43a047 66%, #1976d2 66%)",
                          }}
                        ></div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 w-full mt-2">
                    <button
                      onClick={() => setShowBack(!showBack)}
                      className="w-1/2 bg-blue-500 text-white py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition-all text-base"
                    >
                      {showBack ? "Show Front Side" : "Show Back Side"}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="w-1/2 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-green-600 transition-all text-base"
                    >
                      Download {showBack ? "Back" : "Front"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
