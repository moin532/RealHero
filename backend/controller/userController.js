const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const randomstring = require("randomstring");

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

      process.env.JWT_KEY,
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
    const aadharFile = req.body?.aadharFile;
    const DrivingLicense = req.body?.DrivingLicense;

    // Check if all required data is present
    if (!name || !number || !password || !aadharFile || !DrivingLicense) {
      return res.status(400).json({
        success: false,
        msg: "All fields are required including files",
      });
    }

    // Check if tempFilePath exists
    if (!aadharFile || !DrivingLicense) {
      return res.status(400).json({
        success: false,
        msg: "Files are missing or not properly uploaded",
      });
    }

    const isUserExist = await User.findOne({ number });

    if (isUserExist) {
      return res.status(400).json({
        success: false,
        msg: "Number already exists",
      });
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ☁️ Upload Aadhar to Cloudinary
    const aadharUpload = await cloudinary.uploader.upload(aadharFile, {
      folder: "driversHub/aadhar",
    });

    // ☁️ Upload Driving License to Cloudinary
    const licenseUpload = await cloudinary.uploader.upload(DrivingLicense, {
      folder: "driversHub/license",
    });

    // ✅ Create new user
    const newUser = await User.create({
      name,
      number,
      password: hashedPassword,
      aadharFile: {
        public_id: aadharUpload.public_id,
        url: aadharUpload.secure_url,
      },
      DrivingLicense: {
        public_id: licenseUpload.public_id,
        url: licenseUpload.secure_url,
      },
    });

    // 🔐 Generate JWT
    const Token = jwt.sign(
      {
        number: newUser.number,
        user_id: newUser._id,
      },
      process.env.JWT_KEY,
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
    const user = [];
    if (req.seller) {
      // const seller = await sellerModel.findById(req.seller._id);

      user.push(seller);
    } else {
      const usere = await User.findById(req.user.id);
      user.push(usere);
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
