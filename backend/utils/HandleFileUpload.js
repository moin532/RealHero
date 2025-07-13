const path = require("path");
const fs = require("fs");

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const imageDir = path.join(__dirname, "../uploads/images");
  const videoDir = path.join(__dirname, "../uploads/videos");
  const voiceDir = path.join(__dirname, "../uploads/voice");

  fs.mkdirSync(imageDir, { recursive: true });
  fs.mkdirSync(videoDir, { recursive: true });
  fs.mkdirSync(voiceDir, { recursive: true });

  return { imageDir, videoDir, voiceDir };
};

// Slugify filename: remove spaces, special chars
const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-\.]/g, "");

// Save single file
const saveFile = async (file, targetDir, subFolder) => {
  const timestamp = Date.now();
  const cleanName = slugify(file.name);
  const filename = `${timestamp}-${cleanName}`;
  const filepath = path.join(targetDir, filename);

  await file.mv(filepath); // Move file to disk

  return {
    name: file.name,
    public_id: `${timestamp}-${cleanName}`,
    mimetype: file.mimetype,
    size: file.size,
    url: `/uploads/${subFolder}/${filename}`, // Clean URL to save in DB
  };
};

// Handle any image/video file
const handleFileUpload = async (files) => {
  const { imageDir, videoDir, voiceDir } = createUploadDirs();
  const result = {};

  if (files.aadharFile) {
    result.aadharFile = await saveFile(files.aadharFile, imageDir, "images");
  }

  if (files.DrivingLicense) {
    result.DrivingLicense = await saveFile(
      files.DrivingLicense,
      imageDir,
      "images"
    );
  }

  if (files.video) {
    result.video = await saveFile(files.video, videoDir, "videos");
  }
  if (files.images) {
    result.images = await saveFile(files.images, imageDir, "images");
  }

  if (files.voice) {
    result.voice = await saveFile(files.voice, voiceDir, "voice");
  }

  return result;
};

module.exports = handleFileUpload;
