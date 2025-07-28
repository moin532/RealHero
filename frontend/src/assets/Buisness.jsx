import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get("https://api.realhero.in/api/v1/buisness");

      if (response.data) {
        setBusinesses(response.data.data);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch businesses");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Our Business Partners
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <div
              key={business._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <FaBuilding className="text-blue-500 text-2xl mr-3" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {business.name}
                  </h2>
                </div>

                <p className="text-gray-600 mb-4">{business.description}</p>

                <div className="space-y-3">
                  {business.address && (
                    <div className="flex items-center text-gray-600">
                      <FaMapMarkerAlt className="mr-3 text-green-500" />
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          business.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-600"
                      >
                        {business.address}
                      </a>
                    </div>
                  )}

                  {business.phone && (
                    <div className="flex items-center text-gray-600">
                      <FaPhone className="mr-3 text-blue-500" />
                      <a
                        href={`tel:${business.phone}`}
                        className="hover:text-blue-600"
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-center text-gray-600">
                      <FaEnvelope className="mr-3 text-red-500" />
                      <a
                        href={`mailto:${business.email}`}
                        className="hover:text-blue-600"
                      >
                        {business.email}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      business.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {business.status}
                  </span>
                  {business.category && (
                    <span className="ml-2 inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {business.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {businesses.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No businesses available at the moment.
          </div>
        )}
      </div>
    </div>
  );
};

export default Business;
