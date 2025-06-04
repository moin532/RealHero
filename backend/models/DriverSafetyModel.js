const mongoose = require("mongoose");

const driverSafetySchema = new mongoose.Schema({
  note: {
    type: String,
  },
  image: {
    type: String, // File path or URL
  },
  video: {
    type: String, // File path or URL
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DriverSafety", driverSafetySchema);
