const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["solved", "pending", "not solved"],
    default: "pending",
  },
  helpnumber: {
    type: String,
  },
  requestedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [2, "Name should be more than 2 characters"],
  },

  number: {
    type: String,
    required: [true, "Please enter your number"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be greater than 8 characters"],
  },

  role: {
    type: String,
    default: "user",
  },

  aadharFile: {
    public_id: String,
    url: String,
  },

  block: {
    status: {
      type: String,
      default: "false",
    },
    blockedAt: {
      type: Date,
    },
    blockedBy: {
      type: String,
    },
  },

  DrivingLicense: {
    public_id: String,
    url: String,
  },

  profileImage: {
    public_id: String,
    url: String,
  },

  userRequests: [userRequestSchema], // 📦 New: array of requests

  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("UserHero", userSchema);
