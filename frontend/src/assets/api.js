// locationService.js
import axios from "axios";
import Cookies from "js-cookie";

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

// Voice Chat API

const API_BASE = "https://api.realhero.in/api/v1";
// const token = Cookies.get("Token") ? JSON.parse(Cookies.get("Token")) : null;
const token = Cookies.get("Token") || null;
export async function uploadVoiceNote(file) {
  const formData = new FormData();
  formData.append("voice", file);

  const res = await axios.post(`${API_BASE}/voice/upload`, formData, {
    headers: {
      authorization: token,
      // Let Axios set Content-Type for FormData automatically
    },
  });
  return res.data;
}

export async function listVoiceNotes() {
  const res = await fetch(`${API_BASE}/voice/list`, {
    headers: {
      authorization: token,
    },
  });
  return res.json();
}

export function getVoiceNoteStreamUrl(id) {
  console.log(id);

  return `${API_BASE}/voice/${id}`;
}

export async function deleteVoiceNote(id) {
  const token = Cookies.get("Token") ? JSON.parse(Cookies.get("Token")) : null;
  const res = await axios.delete(`${API_BASE}/voice/delete/${id}`, {
    headers: {
      authorization: token,
    },
  });
  return res.data;
}
