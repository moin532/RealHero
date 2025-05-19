// src/components/DriverRegister.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"; // For animation
import "tailwindcss/tailwind.css";
import { RegisterUser } from "../../../redux/action/UserAction";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
const DriverRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.User);

  console.log(error);
  const [form, setForm] = useState({
    name: "",
    number: "",
    password: "",
    aadharFile: "",
    DrivingLicense: "",
  });

  useEffect(() => {
    if (user === true) {
      toast.success("Registered Successfully!");
      navigate("/");
    }
    if (error) {
      toast.error(error);
    }
  }, [error, user]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        [name]: reader.result, // Base64
      }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(RegisterUser(form));
  };

  return (
    <div className="min-h-screen  flex items-center justify-center bg-gradient-to-r from-purple-500 to-gray-400 p-5 ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Driver Registration
        </h2>

        {user && user.length > 0 && (
          <p className="text-green-500 text-center mb-4">
            Registered Successfully!
          </p>
        )}
        {error && (
          <p className="text-red-500 text-center underline  mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            value={form.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />

          <label className="block text-gray-700 font-semibold">
            Upload Aadhar:
          </label>
          <input
            type="file"
            name="aadharFile"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />

          <label className="block text-gray-700 font-semibold">
            Upload Driving License:
          </label>
          <input
            type="file"
            name="DrivingLicense"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Register
          </button>

          <Link to="/login">
            <p className=" mt-5  text-gray">Already Have a Account Login</p>
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default DriverRegister;
