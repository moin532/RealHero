import React from "react";
import {
  FaHome,
  FaPlusCircle,
  FaUserFriends,
  FaBell,
  FaUser,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { MdEmergencyShare } from "react-icons/md";
import { FaHandsHelping } from "react-icons/fa";

const Footer = () => {
  return (
    <div
      className="w-full bg-white shadow-md flex justify-around items-center py-3
      fixed z-50 bottom-0 md:top-0 md:bottom-auto"
    >
      {/* Feed */}
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-700"
          }`
        }
      >
        <FaHome className="text-2xl" />
        <span className="text-xs mt-1">Feed</span>
      </NavLink>

      <NavLink
        to="/emergency"
        className={({ isActive }) =>
          `flex flex-col items-center text-red-600 ${
            isActive ? " text-orange-600" : "text-gray-700"
          }`
        }
      >
        <MdEmergencyShare className="text-2xl" />
        <span className="text-xs mt-1">Emergency</span>
      </NavLink>

      {/* Upload */}
      <NavLink
        to="/post/video"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-700"
          }`
        }
      >
        <FaPlusCircle className="text-2xl" />
        <span className="text-xs mt-1">Upload</span>
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/my/profile"
        className={({ isActive }) =>
          `flex flex-col items-center ${
            isActive ? "text-blue-500" : "text-gray-700"
          }`
        }
      >
        <FaUser className="text-2xl" />
        <span className="text-xs mt-1">Profile</span>
      </NavLink>

      {/* Alerts */}
      <NavLink
        to="/help"
        className={({ isActive }) =>
          `flex flex-col items-center text-indigo-600 ${
            isActive ? "text-blue-500" : "text-gray-700"
          }`
        }
      >
        <FaHandsHelping className="text-2xl" />
        <span className="text-xs mt-1">Help</span>
      </NavLink>
    </div>
  );
};

export default Footer;
