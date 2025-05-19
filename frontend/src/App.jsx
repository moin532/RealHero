import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoFeed from "./videos/videosFeed";
import Footer from "./assets/Footer";
import DriverLogin from "./assets/Auth/UserLogin";
import DriverRegister from "./assets/Auth/UserRegister";
import { useDispatch, useSelector } from "react-redux";
import { loadUserAction } from "../redux/action/UserAction";
import AddVideo from "./videos/AddVideo";
import ProfilePage from "./assets/Profile";
import NotificationsPage from "./assets/Notification";
import HelpBanner from "./assets/HelpBanner";
import NormalFeed from "./videos/NormalFeed";
const App = () => {
  const dispatch = useDispatch();

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.User
  );

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NormalFeed />} />
        <Route path="/login" element={<DriverLogin />} />
        <Route path="/register" element={<DriverRegister />} />
        <Route path="/post/video" element={<AddVideo />} />
        <Route path="/my/profile" element={<ProfilePage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="/help" element={<HelpBanner />} />
      </Routes>
      {isAuthenticated && <Footer />}
    </Router>
  );
};

export default App;
