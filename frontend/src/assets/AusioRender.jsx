import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [allAudios, setAllAudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    fetchAllAudios();
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
      const preview = URL.createObjectURL(audioBlob);
      setPreviewUrl(preview);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const uploadAudio = async () => {
    if (!previewUrl) return;

    setLoading(true);

    const response = await fetch(previewUrl);
    const audioBlob = await response.blob();
    const audioFile = new File([audioBlob], "voice.webm", {
      type: "audio/webm",
    });

    const formData = new FormData();
    formData.append("audio", audioFile);
    formData.append("name", "My Audio");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/audio/upload",
        formData
      );
      setAudioUrl(res.data.audio.audioUrl);
      fetchAllAudios();
      setPreviewUrl(""); // clear preview
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllAudios = async () => {
    const res = await axios.get("http://localhost:5000/api/audio");
    setAllAudios(res.data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/69/69524.png"
          alt="Mic Icon"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🎤 Voice Recorder</h2>

        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition"
          >
            Stop Recording
          </button>
        )}

        {previewUrl && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2 text-gray-700">🎧 Preview:</h3>
            <audio controls src={previewUrl} className="mx-auto mb-3" />
            <button
              onClick={uploadAudio}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        )}

        <div className="mt-10 text-left">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            📁 All Uploaded Audios:
          </h3>
          {allAudios.length === 0 ? (
            <p className="text-gray-500 text-sm">No recordings yet.</p>
          ) : (
            allAudios.map((audio) => (
              <div
                key={audio._id}
                className="flex items-center justify-between mb-3 bg-gray-100 px-4 py-2 rounded"
              >
                <p className="text-gray-700">{audio.name}</p>
                <audio controls src={`http://localhost:5000${audio.audioUrl}`} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioRecorder;
