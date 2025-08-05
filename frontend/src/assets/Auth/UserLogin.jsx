// src/components/DriverLogin.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { LoginUser } from "../../../redux/action/UserAction";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { USER_LOGIN_RESET } from "../../../redux/constant/UserConstant";
const DriverLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, user, error } = useSelector((state) => state.User);

  console.log(user);
  const [form, setForm] = useState({
    number: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      toast.success("Login Successful!");
      navigate("/");

      window.location.reload();
    }
    if (error) {
      window.alert(error);
      toast.error(error);
      dispatch({ type: USER_LOGIN_RESET });
    }
  }, [user, error, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(LoginUser(form));
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, rgba(34, 139, 34, 0.8), rgba(0, 123, 255, 0.8)), 
                    linear-gradient(45deg, #1a365d 0%, #2d3748 50%, #4a5568 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Driver-themed background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-28 h-28 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 border-4 border-white rounded-full"></div>
      </div>
      
      {/* Truck/driver themed elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-16 h-8 bg-white rounded-full transform rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-6 bg-white rounded-full transform -rotate-45"></div>
        <div className="absolute bottom-1/4 left-1/3 w-14 h-7 bg-white rounded-full transform rotate-12"></div>
      </div>
      
      {/* Driver icon */}
      <div className="absolute top-8 right-8 text-white opacity-20">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      
      {/* Truck icon */}
      <div className="absolute bottom-8 left-8 text-white opacity-20">
        <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
        </svg>
      </div>
      
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full relative z-10"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Driver Login
        </h2>

        {user && user.length > 0 && (
          <p className="text-green-600 text-center mb-4">Login Successful!</p>
        )}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="number"
            placeholder="Phone Number"
            value={form.number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>

          <Link to="/register">
            <p className=" mt-5  text-green-500">Don't Have a Account register</p>
          </Link>
          {/* Add link to user login */}
          <Link to="/end/user/login">
            <p className="mt-2 text-blue-600 text-center underline">Login as User</p>
          </Link>
        </form>
      </motion.div>
    </div>
  );
};

export default DriverLogin;
