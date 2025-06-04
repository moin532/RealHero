import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';

const AllDrivers = () => {
  const [users, setUsers] = useState([]);

  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const token = Cookies.get('Token') ? JSON.parse(Cookies.get('Token')) : null;

    const HandleFetch = async () => {
      try {
        const response = await axios.get('https://lipu.w4u.in/mlm/api/v1/admin/users', {
          headers: {
            Authorization: `${token}`
          }
        });

        const fetchedUser = response.data.user;
        setUsers(fetchedUser); // ✅ no wrapping
      } catch (error) {
        console.error('Fetch failed:', error.response?.data || error.message);
      }
    };

    HandleFetch();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        All Drivers List
      </Typography>

      <TableContainer component={Paper}>
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Aadhar</TableCell>
              <TableCell>License</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Help Requests</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} onClick={() => navigate(`/driver/detail/${user._id}`)}>
                <TableCell>{user?.name}</TableCell>
                <TableCell>{user?.number}</TableCell>
                <TableCell>
                  <a href={`https://lipu.w4u.in/mlm${user?.aadharFile?.url}`} target="_blank" rel="noreferrer">
                    View Aadhar
                  </a>
                </TableCell>
                <TableCell>
                  <a href={user?.DrivingLicense?.url} target="_blank" rel="noreferrer">
                    View Aadharback
                  </a>
                </TableCell>
                <TableCell>{user?.createdAt?.slice(0, 10)}</TableCell>
                <TableCell>{user?.userRequests?.length ?? 0}</TableCell>
                <TableCell sx={{ color: 'yellowgreen' }}>{user?.block?.status === 'false' ? 'Active' : 'Blocked'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AllDrivers;
