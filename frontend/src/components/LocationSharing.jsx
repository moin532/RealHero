import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';

const LocationSharing = () => {
  const [locationStatus, setLocationStatus] = useState('requesting'); // requesting, granted, denied, error
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState('');
  
  const { user } = useSelector((state) => state.User);

  // Send location to backend
  const sendLocationToBackend = async (latitude, longitude, driverId) => {
    try {
      const token = Cookies.get('Token');
      
      if (!token) {
        console.error('No authentication token found');
        return;
      }
 
      const response = await axios.post('/api/v1/update/location', {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        driverId: driverId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('Location sent successfully:', response.data);
        setError('');
      } else {
        console.error('Failed to send location:', response.data.error);
        setError('Failed to save location');
      }
    } catch (error) {
      console.error('Error sending location to backend:', error);
      setError('Network error while saving location');
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setError('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setCurrentLocation({ latitude, longitude });
        setLocationStatus('granted');
        setError('');
        
        console.log('Location obtained:', { latitude, longitude });
        
        // Send location to backend if user is logged in
        if (user && user._id) {
          await sendLocationToBackend(latitude, longitude, user._id);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('denied');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable');
            break;
          case error.TIMEOUT:
            setError('Location request timed out');
            break;
          default:
            setError('An unknown error occurred while retrieving location');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Request location permission and get location when component mounts
  useEffect(() => {
    // Only request location if user is logged in
    if (user && user._id) {
      console.log('Requesting location permission for user:', user.name);
      getCurrentLocation();
    }
  }, [user]);

  // Set up periodic location updates (every 2 minutes)
  useEffect(() => {
    if (locationStatus === 'granted' && user && user._id) {
      const interval = setInterval(() => {
        console.log('Updating location...');
        getCurrentLocation();
      }, 120000); // 2 minutes

      return () => clearInterval(interval);
    }
  }, [locationStatus, user]);

  // Don't render anything visible - this component works in the background
  // But you can uncomment the JSX below for debugging purposes
  
  return null;

  // Uncomment below for debugging/testing purposes
  /*
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '200px'
    }}>
      <div>Status: {locationStatus}</div>
      {currentLocation && (
        <div>
          Lat: {currentLocation.latitude.toFixed(4)}<br/>
          Lng: {currentLocation.longitude.toFixed(4)}
        </div>
      )}
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
  */
};

export default LocationSharing;
