const express = require("express");
const router = express.Router();

const { authMiddle } = require("../middleware/auth");
const voiceController = require("../controller/voiceNoteController");

// POST /api/v1/voice/upload - Upload a voice note
router.post("/voice/upload", authMiddle, voiceController.uploadVoiceNote);

// GET /api/v1/voice/list - List all voice notes for the user
router.get("/voice/list", authMiddle, voiceController.getVoiceNotes);

// GET /api/v1/voice/:id - Stream/download a specific voice note
router.get("/voice/:id", authMiddle, voiceController.getVoiceNoteById);

// DELETE /api/v1/voice/delete/:id - Delete a voice note
// router.delete(
//   "/voice/delete/:id",
//   authMiddle,
//   voiceController.deleteVoiceNoteById
// );

module.exports = router;
