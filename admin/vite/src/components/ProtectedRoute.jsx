import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from 'contexts/UserContext';
import { Box, Typography, Button } from '@mui/material';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { user, hasPermission } = useUser();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific permission is required, check it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f7f7f7"
      >
        <Typography variant="h4" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          You don't have permission to access this page.
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
