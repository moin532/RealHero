const User = require("../models/userModel");
const UserNormal = require("../models/NormalUserModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const myVideo = require("../models/MyVideoModel");
const axios = require("axios");
const randomstring = require("randomstring");
const handleFileUpload = require("../utils/HandleFileUpload");
const VoiceNote = require("../models/VoiceNoteModel");
const path = require("path");
const fs = require("fs");

exports.LoginUser = async (req, res, next) => {
  try {
    const { number, password } = req.body;

    const user = await User.findOne({ number: number });

    if (!user) {
      return res.status(400).json({
        success: false,
        content: "Incorrect credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        content: "Incorrect credentials",
      });
    }

    const Token = jwt.sign(
      {
        number: user.number,
        user_id: user._id,
      },

      "moinSecret",
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      Token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.Register = async (req, res) => {
  try {
    const { name, number, password } = req.body;

    console.log(req.files);
    if (!name || !number || !password) {
      return res.status(400).json({
        success: false,
        msg: "Name, number, and password are required",
      });
    }

    if (!req.files?.aadharFile || !req.files?.DrivingLicense) {
      return res.status(400).json({
        success: false,
        msg: "Both Aadhar and Driving License files are required",
      });
    }

    const isUserExist = await User.findOne({ number });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        msg: "Number already exists",
      });
    }

    // Upload and get file paths
    const uploadedFiles = await handleFileUpload(req.files);

    console.log(uploadedFiles);
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB
    const newUser = await User.create({
      name,
      number,
      password: hashedPassword,
      aadharFile: {
        public_id: uploadedFiles.aadharFile.public_id,
        url: uploadedFiles.aadharFile.url,
      },
      DrivingLicense: {
        public_id: uploadedFiles.DrivingLicense.public_id,
        url: uploadedFiles.DrivingLicense.url,
      },
    });

    // JWT Token
    const Token = jwt.sign(
      {
        number: newUser.number,
        user_id: newUser._id,
      },
      "moinSecret",
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      Token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.LoadUser = async (req, res) => {
  try {
    let user;
    let userId;
    if (req.normalUser && req.normalUser.id) {
      userId = req.normalUser.id;
      user = await UserNormal.findById(userId);
    } else if (req.user && req.user.id) {
      userId = req.user.id;
      user = await User.findById(userId);
    }
    if (!user) {
      return res.status(404).json({ success: false, err: "User not found" });
    }
    const myVideos = await myVideo.find({ user: userId });
    res.status(200).json({
      success: true,
      user,
      myVideos,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ success: false, err: "jwt malformed" });
    }
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, number } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Update basic fields
    if (name) user.name = name;
    if (number) user.number = number;

    // Check and upload new Aadhar file if provided
    if (req.files?.aadharFile) {
      const aadharUpload = await cloudinary.uploader.upload(
        req.files.aadharFile.tempFilePath,
        { folder: "driversHub/aadhar" }
      );
      user.aadharFile = {
        public_id: aadharUpload.public_id,
        url: aadharUpload.secure_url,
      };
    }

    // Check and upload new Driving License if provided
    if (req.files?.DrivingLicense) {
      const licenseUpload = await cloudinary.uploader.upload(
        req.files.DrivingLicense.tempFilePath,
        { folder: "driversHub/license" }
      );
      user.DrivingLicense = {
        public_id: licenseUpload.public_id,
        url: licenseUpload.secure_url,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      msg: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.getUserDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    succes: true,
    user,
  });
};

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(400).json({
        msg: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.GetAlluser = async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};
exports.requestUser = async (req, res) => {
  try {
    const { location, helpnumber } = req.body;
    const user = await User.findById(req.user);

    console.log(user, req.user);

    if (!user) {
      return res.status(400).json({
        success: false,
        content: "Incorrect credentials",
      });
    }

    user.userRequests.push({
      number: user.number,
      location: location,
      status: "pending",
      helpnumber: helpnumber,
    });

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};
exports.adminUserRequest = async (req, res) => {
  try {
    const { location } = req.body;
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(400).json({
        success: false,
        content: "Incorrect credentials",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};

exports.updateUserRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, requestId } = req.body;

    const user = await User.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const request = user.userRequests.id(requestId);
    if (!request)
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });

    request.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      request,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id; // assuming req.user is admin/user who is blocking

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.block = {
      status: "true",
      blockedAt: new Date(),
      blockedBy: adminId,
    };

    await user.save();

    res.status(200).json({ success: true, message: "User blocked", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    user.block = {
      status: "false",
      blockedAt: null,
      blockedBy: null,
    };

    await user.save();

    res.status(200).json({ success: true, message: "User unblocked", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRemindSalah = async (req, res) => {
  const { remindSalah } = req.body;

  try {
    const updatedMosque = await User.findByIdAndUpdate(
      req.user.id,
      { remindSalah },
      { new: true }
    );

    if (!updatedMosque) {
      return res.status(404).json({ message: "Mosque not found" });
    }

    res.json({ message: "Reminder updated successfully", data: updatedMosque });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.SalahTime = async (req, res) => {
  const { lat, lon } = req.query;

  // const user = await User.findById(req.user.id);

  // if (user?.remindSalah === "on") {
  try {
    const response = await axios.get(`https://api.aladhan.com/v1/timings`, {
      params: {
        latitude: lat,
        longitude: lon,
        method: 2,
      },
    });

    const timings = response.data.data.timings;
    res.json(timings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prayer times" });
  }
  // }
};

exports.myuploadVoiceNote = async (req, res) => {
  res.status(200).json({
    succsess: true,
  });
  try {
    if (!req.files || !req.files.voice) {
      return res.status(400).json({ error: "No voice file uploaded" });
    }

    console.log("CLicked");
    // Save file
    const saved = await handleFileUpload({ voice: req.files.voice });
    const file = saved.voice;
    // Save metadata
    const note = await VoiceNote.create({
      user: req.user._id,
      filename: file.name,
      url: file.url,
      mimetype: file.mimetype,
      size: file.size,
    });
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.RegisterSimpleUser = async (req, res) => {
  try {
    const { name, number, password } = req.body;
    if (!name || !number || !password) {
      return res.status(400).json({
        success: false,
        msg: "Name, number, and password are required",
      });
    }
    const isUserExist = await User.findOne({ number });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        msg: "Number already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      number,
      password: hashedPassword,
      role: "user",
      usertype: "user"
    });
    const Token = jwt.sign(
      {
        number: newUser.number,
        user_id: newUser._id,
      },
      "moinSecret",
      { expiresIn: "10d" }
    );
    res.status(200).json({
      success: true,
      Token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      err: error.message,
    });
  }
};
