import React, { useState, useRef, useEffect } from "react";
import {
  uploadVoiceNote,
  listVoiceNotes,
  getVoiceNoteStreamUrl,
  deleteVoiceNote,
} from "./assets/api";
// const token = Cookies.get("Token") ? JSON.parse(Cookies.get("Token")) : null;
const token = Cookies.get("Token") || null;
import Cookies from "js-cookie";

const currentUser = "6855753406895709f8503161"; // Replace with real user ID later

const VoiceChat = ({ user }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);


  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await listVoiceNotes();
      if (res.success) setVoiceNotes(res.notes);
      else setError("Failed to fetch voice notes");
    } catch {
      setError("Error loading voice notes");
    }
    setLoading(false);
  };

  const startRecording = async () => {
    setError("");
    setSuccess("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => handleStop(chunks);
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied or not supported");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const handleStop = async (chunks) => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    if (blob.size < 1000) {
      setError("Recording too short. Try again.");
      return;
    }
    await upload(blob);
  };

  const upload = async (blob) => {
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const file = new File([blob], `voice-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      const res = await uploadVoiceNote(file);
      if (res.success) {
        setSuccess("Voice note uploaded!");
        fetchNotes();
      } else {
        setError("Upload failed");
      }
    } catch {
      setError("Upload error");
    }
    setUploading(false);
  };

  const removeNote = async (id) => {
    try {
      const confirm = window.confirm("Delete this voice note?");
      if (!confirm) return;
      await deleteVoiceNote(id);
      fetchNotes();
    } catch {
      setError("Delete failed");
    }
  };

  const renderVoiceNote = (note) => {
    const isMine = user?._id;

    return (
      <div
        key={note._id}
        className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}
        onClick={() =>
          setShowDeleteId((prevId) => (prevId === note._id ? null : note._id))
        }
      >
        <div
          className={`relative max-w-xs p-4 rounded-2xl shadow-md 
          ${isMine ? "bg-blue-200" : "bg-gray-100"}
          flex flex-col items-center`}
        >
          <audio
            controls
            src={`http://localhost:4000${note.url}`}
            className="w-full mb-2"
          />

          <div className="text-xs text-gray-500">
            {new Date(note.createdAt).toLocaleString()}
          </div>

          {/* Show delete only on click and only if it's your own note */}
          {isMine === note.user && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNote(note._id);
                setShowDeleteId(null);
              }}
              className="absolute top-1 right-1 text-red-500 text-xs"
              title="Delete"
            >
              {/* ❌ */}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen mt-16 flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-200 py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 static">
          Voice Chat
        </h2>
        <div className="flex flex-col items-center mb-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg"
              disabled={uploading}
            >
              🎤 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg animate-pulse"
            >
              ⏹️ Stop & Upload
            </button>
          )}
        </div>

        {uploading && (
          <div className="text-blue-500 text-center mb-2">Uploading...</div>
        )}
        {success && (
          <div className="text-green-600 text-center mb-2">{success}</div>
        )}
        {error && <div className="text-red-500 text-center mb-2">{error}</div>}

        <div className="flex-1 overflow-y-auto mt-4" style={{ maxHeight: 400 }}>
          {loading ? (
            <div className="text-center text-blue-400">
              Loading voice notes...
            </div>
          ) : voiceNotes.length === 0 ? (
            <div className="text-center text-gray-400">
              No voice notes yet. Record your first!
            </div>
          ) : (
            voiceNotes.map(renderVoiceNote)
          )}

          {/* Manual test audio
          <div className="mt-4 flex justify-end">
            <div className="max-w-xs p-4 rounded-2xl shadow-md bg-yellow-100 flex flex-col items-center">
              <audio
                controls
                src={
                  "http://localhost:4000api/v1/uploads/voice/1750430583895-voice-1750430583536.webm"
                }
                className="w-full mb-2"
              />
              <div className="text-xs text-gray-600">Manual Audio Test</div>
            </div>
          </div> */}
        </div>

        <div className="mt-6 text-xs text-gray-400 text-center">
          Advanced features coming soon: transcription, reactions, group chat...
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
