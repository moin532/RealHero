// Utility function to get user's current location address
export const getAddressFromCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Using OpenStreetMap Nominatim API for reverse geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }
          
          const data = await response.json();
          
          // Format the address nicely
          const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          resolve(address);
          
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          resolve(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred while retrieving location";
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  });
};
