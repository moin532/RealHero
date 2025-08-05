import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverDetailsPage.css';

const DriverDetailsPage = () => {
  const { driverId } = useParams();
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch driver details and location
  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch driver basic info
        const driverResponse = await axios.get(`/api/v1/user/${driverId}`);
        if (driverResponse.data.success) {
          setDriver(driverResponse.data.user);
        }

        // Fetch driver location
        const locationResponse = await axios.get(`/api/v1/location/driver/${driverId}`);
        if (locationResponse.data.success) {
          setDriverLocation(locationResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching driver data:', err);
        setError('Failed to load driver information');
      } finally {
        setLoading(false);
      }
    };

    if (driverId) {
      fetchDriverData();
    }
  }, [driverId]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate time since last update
  const getTimeSinceUpdate = (lastUpdated) => {
    const now = new Date();
    const updated = new Date(lastUpdated);
    const diffMinutes = Math.floor((now - updated) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  // Open location in Google Maps
  const openInGoogleMaps = () => {
    if (driverLocation) {
      const url = `https://www.google.com/maps?q=${driverLocation.latitude},${driverLocation.longitude}`;
      window.open(url, '_blank');
    }
  };

  // Call driver
  const callDriver = () => {
    if (driver?.number) {
      window.open(`tel:${driver.number}`, '_self');
    }
  };

  if (loading) {
    return (
      <div className="driver-details-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading driver details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="driver-details-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Driver Details</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="driver-details-page">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Driver Details</h1>
      </div>

      <div className="details-container">
        {/* Driver Basic Info */}
        <div className="info-card">
          <div className="card-header">
            <h2>👤 Personal Information</h2>
          </div>
          <div className="card-content">
            {driver ? (
              <>
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{driver.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone:</span>
                  <span className="value">
                    {driver.number}
                    <button onClick={callDriver} className="call-btn">
                      📞 Call
                    </button>
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">User Type:</span>
                  <span className="value badge">{driver.usertype}</span>
                </div>
                <div className="info-item">
                  <span className="label">Account Status:</span>
                  <span className={`value badge ${driver.block?.status === 'false' ? 'active' : 'blocked'}`}>
                    {driver.block?.status === 'false' ? 'Active' : 'Blocked'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Joined:</span>
                  <span className="value">{formatDate(driver.createdAt)}</span>
                </div>
              </>
            ) : (
              <p>Driver information not available</p>
            )}
          </div>
        </div>

        {/* Location Info */}
        <div className="info-card">
          <div className="card-header">
            <h2>📍 Location Information</h2>
            {driverLocation && (
              <div className={`status-badge ${driverLocation.isOnline ? 'online' : 'offline'}`}>
                {driverLocation.isOnline ? 'Online' : 'Offline'}
              </div>
            )}
          </div>
          <div className="card-content">
            {driverLocation ? (
              <>
                <div className="info-item">
                  <span className="label">Latitude:</span>
                  <span className="value coordinates">{driverLocation.latitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Longitude:</span>
                  <span className="value coordinates">{driverLocation.longitude.toFixed(6)}</span>
                </div>
                <div className="info-item">
                  <span className="label">Address:</span>
                  <span className="value">{driverLocation.address || 'Not available'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Last Updated:</span>
                  <span className="value">
                    {formatDate(driverLocation.lastUpdated)}
                    <span className="time-ago">({getTimeSinceUpdate(driverLocation.lastUpdated)})</span>
                  </span>
                </div>
                <div className="location-actions">
                  <button onClick={openInGoogleMaps} className="maps-btn">
                    🗺️ Open in Google Maps
                  </button>
                </div>
              </>
            ) : (
              <div className="no-location">
                <p>📍 No location data available</p>
                <p className="sub-text">Driver hasn't shared location yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Documents Info */}
        {driver && (
          <div className="info-card">
            <div className="card-header">
              <h2>📄 Documents</h2>
            </div>
            <div className="card-content">
              <div className="documents-grid">
                <div className="document-item">
                  <span className="doc-label">Aadhar Card:</span>
                  <span className={`doc-status ${driver.aadharFile?.url ? 'available' : 'missing'}`}>
                    {driver.aadharFile?.url ? '✅ Available' : '❌ Not Uploaded'}
                  </span>
                  {driver.aadharFile?.url && (
                    <button 
                      onClick={() => window.open(driver.aadharFile.url, '_blank')}
                      className="view-doc-btn"
                    >
                      View
                    </button>
                  )}
                </div>
                <div className="document-item">
                  <span className="doc-label">Driving License:</span>
                  <span className={`doc-status ${driver.DrivingLicense?.url ? 'available' : 'missing'}`}>
                    {driver.DrivingLicense?.url ? '✅ Available' : '❌ Not Uploaded'}
                  </span>
                  {driver.DrivingLicense?.url && (
                    <button 
                      onClick={() => window.open(driver.DrivingLicense.url, '_blank')}
                      className="view-doc-btn"
                    >
                      View
                    </button>
                  )}
                </div>
                <div className="document-item">
                  <span className="doc-label">Profile Image:</span>
                  <span className={`doc-status ${driver.profileImage?.url ? 'available' : 'missing'}`}>
                    {driver.profileImage?.url ? '✅ Available' : '❌ Not Uploaded'}
                  </span>
                  {driver.profileImage?.url && (
                    <button 
                      onClick={() => window.open(driver.profileImage.url, '_blank')}
                      className="view-doc-btn"
                    >
                      View
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="info-card">
          <div className="card-header">
            <h2>⚡ Quick Actions</h2>
          </div>
          <div className="card-content">
            <div className="actions-grid">
              <button onClick={callDriver} className="action-btn call">
                📞 Call Driver
              </button>
              {driverLocation && (
                <button onClick={openInGoogleMaps} className="action-btn location">
                  🗺️ View on Map
                </button>
              )}
              <button 
                onClick={() => navigate('/admin/drivers')} 
                className="action-btn list"
              >
                👥 All Drivers
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="action-btn refresh"
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsPage;
