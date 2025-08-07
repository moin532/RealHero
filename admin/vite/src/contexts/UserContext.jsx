import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

// Simple JWT decoder function
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    // Load user data from token
    try {
      const token = Cookies.get('Token');
      if (token) {
        // Decode the JWT token to get user data
        const decodedToken = decodeJWT(token);
        console.log('Decoded token:', decodedToken);
        
        if (decodedToken) {
          setUser({
            id: decodedToken.user_id,
            name: decodedToken.name,
            number: decodedToken.number,
            role: decodedToken.role,
          });
          
          setPermissions(decodedToken.permissions || {});
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    setPermissions(userData.permissions || {});
  };

  const hasPermission = (requiredPermission) => {
    return permissions[requiredPermission] === true;
  };

  const value = {
    user,
    permissions,
    updateUser,
    hasPermission
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
