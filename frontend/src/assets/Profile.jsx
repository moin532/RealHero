import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../../redux/action/UserAction";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiPlus } from "react-icons/fi";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, user, error } = useSelector((state) => state.User);

  const myuser = user?.user?.[0] || {};
  const myVideos = user?.myVideos || [];

  console.log(myuser);
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

  const handleNavigate = () => {
    // if (selectedOption === "Salah") {
    navigate("/salah"); // Replace with your actual route
    // }
  };
  return (
    <div className="w-full min-h-screen bg-gray-100 text-black p-4   mt-16">
      {/* Profile Header */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={myuser?.profile?.url || "/profile.png"}
            alt="profile"
            className="w-28 h-28 rounded-full object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-black">{user[0]?.name}</h2>
            <p className="text-gray-500">{myuser?.number}</p>
            <p className="mt-2">Joined At: {myuser?.createdAt?.slice(0, 10)}</p>

            <div className="mt-6 flex justify-center sm:justify-start gap-4">
              <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                <FiEdit />
                Update
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                onClick={Handlelogout}
              >
                <FiLogOut />
                Logout
              </button>
              <button
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => setIsModalOpen(true)}
              >
                <FiPlus />
                More
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-4">Select an Option</h2>

            <select
              className="w-full border border-gray-300 rounded p-2 mb-4"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="Salah">Salah</option>
              {/* Add more options here if needed */}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleNavigate}
              >
                Navigate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="max-w-4xl mx-auto mt-6">
        <h3 className="text-xl font-semibold mb-4">My Videos</h3>
        {myVideos && myVideos?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {myVideos.map((videoData) => (
              <div
                key={videoData._id}
                className="relative group rounded overflow-hidden"
              >
                <video
                  // src={`https://lipu.w4u.in/mlm${video?.video?.url}`}
                  src={`https://lipu.w4u.in/mlm${videoData?.video?.url}`}
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
        ) : (
          <p className="text-gray-500">No videos uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
