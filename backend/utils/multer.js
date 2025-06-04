const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload folders exist
const ensureUploadDirs = () => {
  const imageDir = path.join(__dirname, "../uploads/images");
  const videoDir = path.join(__dirname, "../uploads/videos");

  fs.mkdirSync(imageDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });
};

ensureUploadDirs();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, path.join(__dirname, "../uploads/images"));
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, path.join(__dirname, "../uploads/videos"));
    } else {
      cb(new Error("Invalid file type"), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max per file
  },
});

module.exports = upload;
