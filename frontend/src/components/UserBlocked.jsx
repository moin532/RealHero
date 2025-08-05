import React from 'react';
import './UserBlocked.css';

const UserBlocked = ({ user }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleContactSupport = () => {
    // You can implement contact support functionality here
    // For example, open email client or redirect to support page
    window.location.href = 'mailto:support@realhero.com?subject=Account Blocked - Support Request';
  };

  return (
    <div className="user-blocked-container">
      <div className="user-blocked-content">
        <div className="blocked-icon">
          <div className="icon-circle">
            🚫
          </div>
        </div>
        
        <div className="blocked-message">
          <h1>Account Blocked</h1>
          <p className="main-message">
            Your account has been temporarily blocked due to policy violations or security concerns.
          </p>
          
          <div className="block-details">
            <div className="detail-item">
              <span className="label">Account:</span>
              <span className="value">{user?.name || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{user?.number || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Blocked On:</span>
              <span className="value">
                {user?.block?.blockedAt ? formatDate(user.block.blockedAt) : 'N/A'}
              </span>
            </div>
          </div>

          <div className="blocked-actions">
            <button 
              className="contact-support-btn"
              onClick={handleContactSupport}
            >
              📧 Contact Support
            </button>
            
            <div className="help-text">
              <p>
                If you believe this is a mistake, please contact our support team. 
                We'll review your account and get back to you within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="blocked-footer">
        <p>© 2025 RealHero. All rights reserved.</p>
      </div>
    </div>
  );
};

export default UserBlocked;
