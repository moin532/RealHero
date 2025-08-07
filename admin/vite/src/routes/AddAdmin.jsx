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
    role: 'admin', // default role
    permissions: {
      DriverManage: false,
      DriverRequest: false,
      AdminCreate: false,
      DriverMaps: false,
      DriverSafety: false,
      BusinessManage: false,
      AllAdmins: false,
      Dashboard: true, // Default true for all admins
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
      const token = Cookies.get('Token');
      console.log(token, "token");
      console.log(formData, "formData");
      
      const res = await axios.post('https://api.realhero.in/api/v1/add/admin', formData, {
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
          role: 'admin',
          permissions: {
            DriverManage: false,
            DriverRequest: false,
            AdminCreate: false,
            DriverMaps: false,
            DriverSafety: false,
            BusinessManage: false,
            AllAdmins: false,
            Dashboard: true,
          }
        });
      }
    } catch (err) {
      console.log(err, "err");
      alert(err.response?.data?.message || 'Error creating admin');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f7f7f7">
      <Paper elevation={3} sx={{ p: 4, width: 500, maxHeight: '90vh', overflow: 'auto' }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Add New Admin
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

        <Typography variant="subtitle1" mt={2} mb={1}>
          Permissions:
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox name="DriverManage" checked={formData.permissions.DriverManage} onChange={handlePermissionChange} />}
            label="Can Manage Drivers"
          />
          <FormControlLabel
            control={<Checkbox name="DriverRequest" checked={formData.permissions.DriverRequest} onChange={handlePermissionChange} />}
            label="Can Manage Driver Requests"
          />
          <FormControlLabel
            control={<Checkbox name="AdminCreate" checked={formData.permissions.AdminCreate} onChange={handlePermissionChange} />}
            label="Can Create Other Admins"
          />
          <FormControlLabel
            control={<Checkbox name="DriverMaps" checked={formData.permissions.DriverMaps} onChange={handlePermissionChange} />}
            label="Can Access Driver Maps"
          />
          <FormControlLabel
            control={<Checkbox name="DriverSafety" checked={formData.permissions.DriverSafety} onChange={handlePermissionChange} />}
            label="Can Manage Driver Safety"
          />
          <FormControlLabel
            control={<Checkbox name="BusinessManage" checked={formData.permissions.BusinessManage} onChange={handlePermissionChange} />}
            label="Can Manage Business"
          />
          <FormControlLabel
            control={<Checkbox name="AllAdmins" checked={formData.permissions.AllAdmins} onChange={handlePermissionChange} />}
            label="Can View All Admins"
          />
          <FormControlLabel
            control={<Checkbox name="Dashboard" checked={formData.permissions.Dashboard} onChange={handlePermissionChange} disabled />}
            label="Dashboard Access (Always Enabled)"
          />
        </FormGroup>

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
          Add Admin
        </Button>
      </Paper>
    </Box>
  );
};

export default AddAdmin;
