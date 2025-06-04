import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router';

const AlllAdmins = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const token = Cookies.get('Token') ? JSON.parse(Cookies.get('Token')) : null;

    const HandleFetch = async () => {
      try {
        const response = await axios.post(
          'https://lipu.w4u.in/mlm/api/v1/get/admin',
          {},
          {
            headers: {
              Authorization: `${token}`
            }
          }
        );

        const fetchedAdmins = response.data.admins;
        setUsers(fetchedAdmins);
      } catch (error) {
        console.error('Fetch failed:', error.response?.data || error.message);
      }
    };

    HandleFetch();
  }, []);

  // ✅ Delete Handler
  const handleDelete = async (id) => {
    const token = Cookies.get('Token') ? JSON.parse(Cookies.get('Token')) : null;

    window.alert('Are you sure you want to delete this admin? This action cannot be undone.');
    try {
      await axios.delete(`https://lipu.w4u.in/mlm/api/v1/delete/admin/${id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      alert('Admin deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
      alert('Failed to delete admin');
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        All Admins List
      </Typography>

      <TableContainer component={Paper}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user?.name}</TableCell>
                <TableCell>{user?.number}</TableCell>
                <TableCell>{user?.location}</TableCell>
                <TableCell>{user?.role}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleDelete(user._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No admins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AlllAdmins;
