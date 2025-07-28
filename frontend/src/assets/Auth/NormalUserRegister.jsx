import React, { useState } from "react";
// If using Material UI or Tailwind, import here. Otherwise, use clean CSS.
// import { TextField, Button, Alert } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const NormalUserRegister = () => {


  const navigate = useNavigate();


  const [form, setForm] = useState({ name: "", number: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("https://api.realhero.in/api/v1/normaluser/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data) {
        setMessage("Registration successful! You can now log in.");
        setForm({ name: "", number: "", password: "" });
    Cookies.set("Token",data.Token, {
      expires: 7,
      path: "/",
    });

    navigate("/");


      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
        style={{ minWidth: 320 }}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Normal User Registration</h2>
        {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
        {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            minLength={2}
            maxLength={30}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="text"
            name="number"
            value={form.number}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            placeholder="Enter your phone number"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            minLength={4}
            placeholder="Enter your password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default NormalUserRegister; 