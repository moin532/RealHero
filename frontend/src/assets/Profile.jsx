import React, { useEffect } from "react";
import { FiEdit, FiLogOut } from "react-icons/fi";
import Cookies from "js-cookie";
const usere = {
  name: "Wayne",
  username: "@stackcoder",
  bio: "Full Stack Developer | MERN | Building awesome things",
  followers: 1200,
  following: 180,
  posts: 12,
  profilePic:
    "https://images.unsplash.com/photo-1502767089025-6572583495b0?auto=format&fit=crop&w=150&q=80",
  videos: [
    {
      id: 1,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      id: 2,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
      id: 3,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: 4,
      url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
  ],
};
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../../redux/action/UserAction";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useSelector((state) => state.User);
  useEffect(() => {
    dispatch(loadUserAction());
  }, [dispatch]);

  const Handlelogout = () => {
    Cookies.remove("Token");
    navigate("/login");
    window.alert("logout sucsess");

    window.location.reload();
  };
  return (
    <div className="w-full min-h-screen bg-gray-100 text-black p-4 mt-12">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src="/profile.png"
            alt="profile"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-black">{user[0]?.name}</h2>
            <p className="text-gray-500">{user[0]?.number}</p>
            <p className="mt-2">{user.bio}</p>

            <div className="mt-6 flex justify-center sm:justify-start gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                <FiEdit />
                Update
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={() => {
                  Handlelogout();
                }}
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-4xl mx-auto mt-6">
        <h3 className="text-xl font-semibold mb-4">My Videos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {usere.videos.map((video) => (
            <div
              key={video.id}
              className="relative group rounded overflow-hidden"
            >
              <video
                src={video.url}
                className="w-full h-48 object-cover"
                muted
                loop
                preload="metadata"
                onMouseOver={(e) => e.target.play()}
                onMouseOut={(e) => e.target.pause()}
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
