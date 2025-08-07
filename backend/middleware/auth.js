const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const UserNormal = require("../models/NormalUserModel");

exports.authMiddle = async (req, res, next) => {
  try {
    const Token = req.headers.authorization;

    if (!Token) {
      return res.status(404).json({
        err: " Token is empty",
      });
    }

    // Extract token from "Bearer <token>"
    const token = Token.startsWith('Bearer ') ? Token.slice(7) : Token;

    const decoded = jwt.verify(token, "moinSecret");

    // req.user = await User.findById(decoded.user_id);
    req.user = await User.findById(decoded.user_id) || await Admin.findById(decoded.user_id);
    req.normalUser = await UserNormal.findById(decoded.user_id);

    next();
  } catch (error) {
    return res.status(400).json({
      err: error.message,
    });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res
          .status(400)
          .send(`Role: ${req.user.role} is not allowed to access this resouce `)
      );
    }
    next();
  };
};

exports.checkStatus = (permissionName) => {
  return (req, res, next) => {
    if (req.user.role === "admin") {
      return next(); // full access
    }

    if (
      req.user.role === "admin" &&
      req.user.permissions &&
      req.user.permissions[permissionName]
    ) {
      return next();
    }

    return res.status(403).json({ message: "Permission denied" });
  };
};
