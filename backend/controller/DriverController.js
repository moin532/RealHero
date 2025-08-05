const DriverSafety = require("../models/DriverSafetyModel");
const fs = require("fs");
const path = require("path");
const DriverLocationSharing = require("../models/DriverLocationSharing");
const User = require("../models/userModel");
// Add new safety entry
exports.createSafety = async (req, res) => {
  try {
    const { note } = req.body;
    let image = null;
    let video = null;

    // Ensure upload directories exist
    const imageDir = path.join(__dirname, "..", "uploads", "images");
    const videoDir = path.join(__dirname, "..", "uploads", "videos");

    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });

    // Handle image upload
    if (req.files?.image) {
      const imageFile = req.files.image;
      const imageName = `${Date.now()}-${imageFile.name.replace(/\s+/g, "_")}`;
      const imagePath = path.join(imageDir, imageName);
      await imageFile.mv(imagePath);
      image = `uploads/images/${imageName}`; // Save relative path to DB
    }

    // Handle video upload
    if (req.files?.video) {
      const videoFile = req.files.video;
      const videoName = `${Date.now()}-${videoFile.name.replace(/\s+/g, "_")}`;
      const videoPath = path.join(videoDir, videoName);
      await videoFile.mv(videoPath);
      video = `uploads/videos/${videoName}`;
    }

    const safetyEntry = new DriverSafety({ note, image, video });
    await safetyEntry.save();

    res.status(201).json({ success: true, data: safetyEntry });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Edit safety entry
exports.updateSafety = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    const safetyEntry = await DriverSafety.findById(id);
    if (!safetyEntry) return res.status(404).json({ error: "Entry not found" });

    // Optional update of files
    if (req.files?.image) {
      if (safetyEntry.image) fs.unlinkSync(safetyEntry.image);
      const imagePath = `uploads/images/${Date.now()}-${req.files.image.name}`;
      await req.files.image.mv(imagePath);
      safetyEntry.image = imagePath;
    }

    if (req.files?.video) {
      if (safetyEntry.video) fs.unlinkSync(safetyEntry.video);
      const videoPath = `uploads/videos/${Date.now()}-${req.files.video.name}`;
      await req.files.video.mv(videoPath);
      safetyEntry.video = videoPath;
    }

    safetyEntry.note = note || safetyEntry.note;
    await safetyEntry.save();
    res.json({ success: true, data: safetyEntry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete safety entry (and optionally video/image)
exports.deleteSafety = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DriverSafety.findById(id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    // Delete media files
    if (entry.image) fs.unlinkSync(entry.image);
    if (entry.video) fs.unlinkSync(entry.video);

    await DriverSafety.findByIdAndDelete(id);
    res.json({ success: true, message: "Entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getDetailSafety = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await DriverSafety.findById(id);
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
exports.getAllDetailSafety = async (req, res) => {
  try {
    const entry = await DriverSafety.find({});
    if (!entry) return res.status(404).json({ error: "Entry not found" });

    res.json({ success: true, data: entry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



exports.updateCurrentLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const driverId = req.user._id;

    if (!driverId || !latitude || !longitude) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const location = await DriverLocationSharing.findOneAndUpdate(
      { driverId }, // Match existing record
      {
        currentLatitude: latitude,
        currentLongitude: longitude,
      },
      {
        new: true,         // Return updated document
        upsert: true,      // Create if not exists
        setDefaultsOnInsert: true,
      }
    );

    res.json({ success: true, data: location });

  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};







exports.getDriverCurrentLocation = async (req, res) => {
  try {
    // Step 1: Get all location records
    const locations = await DriverLocationSharing.find();

    console.log(locations)
    // Step 2: For each location, manually fetch the user by driverId
    const dataWithUser = await Promise.all(
      locations.map(async (loc) => {
        const user = await User.findById(loc.driverId).select('name number ');
        return {
          _id: loc._id,
          driverId: loc.driverId,
          currentLatitude: loc.currentLatitude,
          currentLongitude: loc.currentLongitude,
          createdAt: loc.createdAt,
          user: user || null, // in case user not found
        };
      })
    );

    res.json({
      success: true,
      data: dataWithUser,
    });

  } catch (error) {
    console.error("Error fetching driver locations:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};