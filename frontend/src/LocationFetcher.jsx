import React, { useState } from "react";

const LocationFetcher = () => {
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    error: null,
  });
  const [address, setAddress] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        ...location,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon, error: null });
        fetchAddress(lat, lon);
      },
      (error) => {
        setLocation({ ...location, error: error.message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      setAddress(
        data.city ||
          data.locality ||
          data.principalSubdivision ||
          "Address not found"
      );
    } catch (error) {
      setAddress("Unable to fetch address");
    }
  };

  return (
    <div>
      <button
        onClick={getLocation}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Get Current Location
      </button>

      {location.error && (
        <p className="text-red-600 mt-2">Error: {location.error}</p>
      )}

      {location.lat && location.lon && (
        <p className="mt-2">
          Latitude: {location.lat}, Longitude: {location.lon}
        </p>
      )}

      {address && <p className="mt-2 font-semibold">Address: {address}</p>}
    </div>
  );
};

export default LocationFetcher;
