import React, { useEffect, useState } from "react";
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
import SalahReminder from "./assets/SalahReminder";
import AudioRecorder from "./assets/AusioRender";
import Emergency from "./videos/Emergency";
import LocationFetcher from "./LocationFetcher";
import VoiceChat from "./VoiceChat";
import Business from "./assets/Buisness";
import Cookies from "js-cookie";
import UserRegister from "./assets/Auth/UserRegister";
import NormalUserRegister from "./assets/Auth/NormalUserRegister";
import NormalUserLogin from "./assets/Auth/NormalUserLogin";
import LocationSharing from "./components/LocationSharing";
import UserBlocked from "./components/UserBlocked";
import axios from "axios"
const App = () => {
  const dispatch = useDispatch();

  const [isToken, setIsToken] = useState("");
  const { user } = useSelector((state) => state.User);

  // Check if user is blocked
  const isUserBlocked = user && user.user && user.user.block && user.user.block.status === "true";

  console.log(isUserBlocked)
  useEffect(() => {
    const tokenString = Cookies.get("Token");
    let token = null;
    if (tokenString) {
      try {
        token = JSON.parse(tokenString);
      } catch (e) {
        token = tokenString;
      }
    }
    setIsToken(token);
  }, []);

  useEffect(() => {
    dispatch(loadUserAction());
  }, []);

  useEffect(() => {
    const fetchLocation = () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      const token = Cookies.get('Token');
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;


          console.log(latitude, longitude);
          try {
            await axios.post('https://api.realhero.in/api/v1/update/location', {
              latitude,
              longitude,
            }, {
              headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json'
              }
            });
            console.log('Location sent to backend.');
          } catch (error) {
            console.error('Failed to send location:', error.message);
          }
        },
        (error) => {
          // If user blocks location access
          if (error.code === error.PERMISSION_DENIED) {
            alert('Please enable location services for this app to work properly.');
          } else {
            alert('Unable to fetch location. Please try again.');
          }
        }
      );
    };

    fetchLocation();
  }, []);

  // If user is blocked, show the blocked page instead of normal app
  if (isUserBlocked) {
    return <UserBlocked user={user?.user || user} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NormalFeed />} />
        <Route path="/login" element={<DriverLogin />} />
        <Route path="/register" element={<DriverRegister />} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/end/user/register" element={<NormalUserRegister />} />
        <Route path="/end/user/login" element={<NormalUserLogin />} />
        <Route path="/send/audio" element={<AudioRecorder />} />
        <Route path="/post/video" element={<AddVideo />} />
        <Route path="/my/profile" element={<ProfilePage />} />
        <Route path="/notification" element={<NotificationsPage />} />
        <Route path="/help" element={<HelpBanner />} />
        <Route path="/salah" element={<SalahReminder />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/location" element={<LocationFetcher />} />
        <Route path="/business" element={<Business />} />
        <Route
          path="/voice-chat"
          element={
            <VoiceChat
              user={Array.isArray(user?.user) ? user.user[0] : user?.user}
            />
          }
        />
      </Routes>
      {isToken && <Footer />}
      <LocationSharing />
    </Router>
  );
};

export default App;
