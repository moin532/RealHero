// src/components/DriverRegister.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";
import { RegisterUser } from "../../../redux/action/UserAction";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaCamera, FaImages, FaTrash } from "react-icons/fa";

const DriverRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.User);

  const [form, setForm] = useState({
    name: "",
    number: "",
    password: "",
    aadharFront: null,
    aadharBack: null,
    drivingLicense: null,
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

  const handleCameraClick = (fieldName) => {
    document.getElementById(`${fieldName}-camera`).click();
  };

  const handleGalleryClick = (fieldName) => {
    document.getElementById(`${fieldName}-gallery`).click();
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   const name = e.target.name;

  //   // const reader = new FileReader();
  //   // reader.onloadend = () => {
  //   //   setForm((prev) => ({
  //   //     ...prev,
  //   //     [name]: reader.result, // Base64
  //   //   }));
  //   // };

  //   if (file) reader.readAsDataURL(file);
  // };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;

    if (file) {
      setForm((prev) => ({
        ...prev,
        [name]: file, // store file object, not base64
      }));
    }
  };

  const handleDeleteImage = (fieldName) => {
    setForm((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("number", form.number);
    formData.append("password", form.password);

    // Combine both front and back into one "aadharFile" object
    formData.append("aadharFile", form.aadharFront);
    // formData.append("aadharFileBack", form.aadharBack);

    formData.append("DrivingLicense", form.aadharBack);

    dispatch(RegisterUser(formData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-gray-400 p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Driver Registration
        </h2>

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

          {/* Aadhar Front */}
          <div>
            <label className="block font-semibold mb-2">Aadhar Front</label>
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => handleCameraClick("aadharFront")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaCamera /> Camera
              </button>
              <button
                type="button"
                onClick={() => handleGalleryClick("aadharFront")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaImages /> Gallery
              </button>
            </div>
            {form.aadharFront && (
              <div className="relative w-32 h-32 mb-2">
                <img
                  src={form.aadharFront}
                  alt="Preview"
                  className="rounded w-full h-full object-cover border"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage("aadharFront")}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            )}
            <input
              type="file"
              id="aadharFront-camera"
              name="aadharFront"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              id="aadharFront-gallery"
              name="aadharFront"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Aadhar Back */}
          <div>
            <label className="block font-semibold mb-2">Aadhar Back</label>
            <div className="flex gap-4 mb-2">
              <button
                type="button"
                onClick={() => handleCameraClick("aadharBack")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FaCamera /> Camera
              </button>
              <button
                type="button"
                onClick={() => handleGalleryClick("aadharBack")}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <FaImages /> Gallery
              </button>
            </div>
            {form.aadharBack && (
              <div className="relative w-32 h-32 mb-2">
                <img
                  src={form.aadharBack}
                  alt="Preview"
                  className="rounded w-full h-full object-cover border"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage("aadharBack")}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                >
                  <FaTrash />
                </button>
              </div>
            )}
            <input
              type="file"
              id="aadharBack-camera"
              name="aadharBack"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              type="file"
              id="aadharBack-gallery"
              name="aadharBack"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <Link to="/login">
            <p className="mt-5 text-gray-700 text-center">
              Already have an account? <span className="underline">Login</span>
            </p>
          </Link>
          {/* Add link to user registration */}
          <Link to="/end/user/register">
            <p className="mt-2 text-blue-600 text-center underline">Register as User</p>
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default DriverRegister;
