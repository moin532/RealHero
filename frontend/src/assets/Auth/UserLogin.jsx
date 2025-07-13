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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 p-5">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
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
            <p className=" mt-5  text-gray">Don't Have a Account register</p>
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
