import React from "react";
import { FaUserPlus, FaHeart, FaComment, FaVideo } from "react-icons/fa";

const notifications = [
  {
    id: 1,
    type: "follow",
    user: "alex_dev",
    time: "2h ago",
    icon: <FaUserPlus className="text-blue-500" />,
    message: "started following you.",
  },
  {
    id: 2,
    type: "like",
    user: "jane_doe",
    time: "4h ago",
    icon: <FaHeart className="text-pink-500" />,
    message: "liked your video.",
  },
  {
    id: 3,
    type: "comment",
    user: "john_smith",
    time: "6h ago",
    icon: <FaComment className="text-green-500" />,
    message: "commented: Nice content!",
  },
  {
    id: 4,
    type: "mention",
    user: "sarah_k",
    time: "1d ago",
    icon: <FaVideo className="text-purple-500" />,
    message: "mentioned you in a video.",
  },
];

const NotificationsPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:bg-gray-50 transition"
          >
            <div className="text-2xl">{notif.icon}</div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">@{notif.user}</span>{" "}
                {notif.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
