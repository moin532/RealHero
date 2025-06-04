import React, { useState, useEffect } from "react";
import axios from "axios";

const DriverSafetyCard = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on component mount
    axios
      .get("https://lipu.w4u.in/mlm/api/v1/all/safety")
      .then((res) => {
        setEntries(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch entries", err);
      });
  }, []);

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Driver Safety Caution
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {entries.map((entry) => (
          <div
            key={entry._id}
            className="bg-white rounded-xl shadow-md border p-4 transition hover:shadow-xl"
          >
            {entry.image && (
              <div className="mb-8">
                <img
                  src={`https://lipu.w4u.in/mlm/${entry.image}`}
                  alt="Safety"
                  className="w-full  h-full object-cover rounded-md border"
                />
              </div>
            )}

            {entry.video && (
              <div className="mb-3 mt-4">
                <video
                  controls
                  className="w-full h-48 object-cover rounded-md border"
                >
                  <source
                    src={`https://lipu.w4u.in/mlm/${entry.video}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            <p className="text-sm text-gray-500">
              <span className="font-medium">Created At:</span>{" "}
              {formatDate(entry.createdAt)}
            </p>
            <p className="text-sm text-gray-800 mt-5">
              <span className="font-medium ">{entry.note}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverSafetyCard;
