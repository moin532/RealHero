import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DriverMapDashboard.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DriverMapDashboard = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map centered on India
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);

      // Set bounds to India approximately
      const indiaBounds = [
        [6.4627, 68.1097], // Southwest coordinates
        [35.5044, 97.3953]  // Northeast coordinates
      ];
      
      mapInstanceRef.current.setMaxBounds(indiaBounds);
      mapInstanceRef.current.fitBounds(indiaBounds);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Custom driver icon with location pin
  const createDriverIcon = (isOnline = true) => {
    const color = isOnline ? '#4CAF50' : '#f44336';
    return L.divIcon({
      className: 'custom-driver-marker',
      html: `
        <div style="
          position: relative;
          width: 30px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              transform: rotate(45deg);
              font-size: 16px;
              color: white;
            ">📍</div>
          </div>
        </div>
      `,
      iconSize: [30, 40],
      iconAnchor: [15, 40],
    });
  };

  // Handle phone call
  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  // Fetch driver locations
  const fetchDriverLocations = async () => {
    try {
      setError('');
      const response = await axios.get('https://api.realhero.in/api/v1/get/location');
      
      if (response.data.success) {
        // Transform the data to match our component structure
        const transformedData = response.data.data.map(driver => ({
          driverId: driver.driverId,
          driverName: driver.user.name,
          driverPhone: driver.user.number,
          latitude: parseFloat(driver.currentLatitude),
          longitude: parseFloat(driver.currentLongitude),
          lastUpdated: driver.createdAt,
          isOnline: true // Assuming if they're in the response, they're online
        }));
        
        setDrivers(transformedData);
        setLastUpdated(new Date());
        updateMapMarkers(transformedData);
      } else {
        throw new Error(response.data.message || 'Failed to fetch driver locations');
      }
    } catch (err) {
      console.error('Error fetching driver locations:', err);
      setError('Failed to load driver locations');
    } finally {
      setLoading(false);
    }
  };

  // Update map markers
  const updateMapMarkers = (driverData) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = {};

    // Add new markers
    driverData.forEach(driver => {
      if (driver.latitude && driver.longitude) {
        const marker = L.marker(
          [driver.latitude, driver.longitude],
          { icon: createDriverIcon(driver.isOnline) }
        ).addTo(mapInstanceRef.current);

        // Create popup content with call functionality
        const popupContent = `
          <div class="driver-popup">
            <div class="popup-header">
              <h4>${driver.driverName}</h4>
              <span class="status ${driver.isOnline ? 'online' : 'offline'}">${driver.isOnline ? '🟢 Online' : '🔴 Offline'}</span>
            </div>
            <div class="popup-content">
              <div class="contact-info">
                <p><strong>📞 Phone:</strong> ${driver.driverPhone}</p>
                <button class="call-btn" onclick="window.handleDriverCall('${driver.driverPhone}')">
                  📞 Call Driver
                </button>
              </div>
              <div class="location-info">
                <p><strong>📍 Location:</strong> ${driver.latitude.toFixed(4)}, ${driver.longitude.toFixed(4)}</p>
                <p><strong>🕒 Last Updated:</strong> ${new Date(driver.lastUpdated).toLocaleString()}</p>
              </div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

        // Add click event
        marker.on('click', () => {
          setSelectedDriver(driver);
        });

        markersRef.current[driver.driverId] = marker;
      }
    });
  };

  // Navigate to driver details
  const viewDriverDetails = (driverId) => {
    // You can implement navigation to driver details page here
    console.log('Navigate to driver details:', driverId);
    // Example: navigate(`/admin/driver/${driverId}`);
  };

  // Make functions available globally for popup buttons
  useEffect(() => {
    window.viewDriverDetails = viewDriverDetails;
    window.handleDriverCall = handleCall;
    return () => {
      delete window.viewDriverDetails;
      delete window.handleDriverCall;
    };
  }, []);

  // Auto-refresh driver locations
  useEffect(() => {
    fetchDriverLocations();
    
    const interval = setInterval(() => {
      fetchDriverLocations();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter online/offline drivers
  const onlineDrivers = drivers.filter(driver => driver.isOnline);
  const offlineDrivers = drivers.filter(driver => !driver.isOnline);

  return (
    <div className="driver-map-dashboard">
      <div className="dashboard-header">
        <h2>🗺️ Driver Location Dashboard</h2>
        <div className="dashboard-stats">
          <div className="stat-card online">
            <span className="stat-number">{onlineDrivers.length}</span>
            <span className="stat-label">Online Drivers</span>
          </div>
          <div className="stat-card offline">
            <span className="stat-number">{offlineDrivers.length}</span>
            <span className="stat-label">Offline Drivers</span>
          </div>
          <div className="stat-card total">
            <span className="stat-number">{drivers.length}</span>
            <span className="stat-label">Total Drivers</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={fetchDriverLocations} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-content">
        <div className="map-container">
          <div className="map-controls">
            <button 
              onClick={fetchDriverLocations} 
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? '🔄 Loading...' : '🔄 Refresh'}
            </button>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div 
            ref={mapRef} 
            className="map"
            style={{ height: '600px', width: '100%' }}
          />
        </div>

        <div className="driver-sidebar">
          <h3>Active Drivers</h3>
          <div className="driver-list">
            {loading ? (
              <div className="loading-spinner">Loading drivers...</div>
            ) : drivers.length === 0 ? (
              <div className="no-drivers">No active drivers found</div>
            ) : (
              drivers.map(driver => (
                <div 
                  key={driver.driverId} 
                  className={`driver-card ${selectedDriver?.driverId === driver.driverId ? 'selected' : ''}`}
                  onClick={() => setSelectedDriver(driver)}
                >
                  <div className="driver-info">
                    <h4>{driver.driverName}</h4>
                    <div className="phone-section">
                      <span>📞 {driver.driverPhone}</span>
                      <button 
                        className="call-btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(driver.driverPhone);
                        }}
                      >
                        📞
                      </button>
                    </div>
                    <p className="location-coords">
                      📍 {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div className={`driver-status ${driver.isOnline ? 'online' : 'offline'}`}>
                    {driver.isOnline ? '🟢 Online' : '🔴 Offline'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedDriver && (
        <div className="driver-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Driver Details</h3>
              <button 
                className="close-btn"
                onClick={() => setSelectedDriver(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-item">
                <strong>Name:</strong> {selectedDriver.driverName}
              </div>
              <div className="detail-item">
                <strong>Phone:</strong> {selectedDriver.driverPhone}
              </div>
              <div className="detail-item">
                <strong>Latitude:</strong> {selectedDriver.latitude}
              </div>
              <div className="detail-item">
                <strong>Longitude:</strong> {selectedDriver.longitude}
              </div>
              <div className="detail-item">
                <strong>Status:</strong> 
                <span className={`status ${selectedDriver.isOnline ? 'online' : 'offline'}`}>
                  {selectedDriver.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="detail-item">
                <strong>Last Updated:</strong> {new Date(selectedDriver.lastUpdated).toLocaleString()}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="navigate-btn"
                onClick={() => viewDriverDetails(selectedDriver.driverId)}
              >
                Navigate to Driver Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMapDashboard;
