const mongoose = require("mongoose");

const voiceNoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserHero",
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VoiceNote", voiceNoteSchema); 