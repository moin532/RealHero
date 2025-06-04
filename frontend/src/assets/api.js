// locationService.js
export const getAddressFromCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );

          if (!response.ok) {
            reject(new Error("Failed to fetch address"));
            return;
          }

          const data = await response.json();

          // bigdatacloud.net returns city, locality, principalSubdivision, countryName, etc.
          // Construct an address string with available info:
          const address =
            data.city ||
            data.locality ||
            data.principalSubdivision ||
            data.countryName ||
            "Address not found";

          resolve(address);
        } catch (error) {
          reject(new Error("Unable to fetch address"));
        }
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};
