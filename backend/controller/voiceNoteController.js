const VoiceNote = require("../models/VoiceNoteModel");
const handleFileUpload = require("../utils/HandleFileUpload");
const path = require("path");
const fs = require("fs");

// POST /api/voice/upload
exports.uploadVoiceNote = async (req, res) => {
  try {
    if (!req.files || !req.files.voice) {
      return res.status(400).json({ error: "No voice file uploaded" });
    }
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

// GET /api/voice/list
exports.getVoiceNotes = async (req, res) => {
  try {
    const notes = await VoiceNote.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json({ success: true, notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/voice/:id (stream)
exports.getVoiceNoteById = async (req, res) => {
  try {
    const note = await VoiceNote.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Voice note not found" });
    const filePath = path.join(__dirname, "../uploads/voice", note.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: "File not found" });
    res.setHeader("Content-Type", note.mimetype);
    res.setHeader("Content-Disposition", `inline; filename=\"${note.filename}\"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 