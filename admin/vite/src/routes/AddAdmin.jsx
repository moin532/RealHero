import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    password: '',
    location: '',
    role: 'sub-admin', // default role
    permissions: {
      DriverManage: false,
      DriverRequest: false,
      AdminCreate: false
    }
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [name]: checked
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = JSON.parse(Cookies.get('Token'));
      const res = await axios.post('https://lipu.w4u.in/mlm/api/v1/add/admin', formData, {
        headers: {
          Authorization: `${token}`
        }
      });

      if (res) {
        alert('Admin created successfully');
        setFormData({
          name: '',
          number: '',
          password: '',
          location: '',
          permissions: {
            DriverManage: false,
            DriverRequest: false,
            AdminCreate: false
          }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating admin');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f7f7f7">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Add New Sub-Admin
        </Typography>

        <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Phone Number" name="number" value={formData.number} onChange={handleChange} fullWidth margin="normal" />
        <TextField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth margin="normal" />

        <Typography variant="subtitle1" mt={2}>
          Permissions:
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox name="canViewUsers" checked={formData.permissions.canViewUsers} onChange={handlePermissionChange} />}
            label="Can manage Driver"
          />
          <FormControlLabel
            control={<Checkbox name=" DriverRequest" checked={formData.permissions.DriverRequest} onChange={handlePermissionChange} />}
            label="Can Manage Driver Requests"
          />
          {/* <FormControlLabel
            control={<Checkbox name=" AdminCreate" checked={formData.permissions.AdminCreate} onChange={handlePermissionChange} />}
            label="Can Delete Users"
          /> */}
        </FormGroup>

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
          Add Admin
        </Button>
      </Paper>
    </Box>
  );
};

export default AddAdmin;
