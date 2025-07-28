import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const Business = () => {
  const [businesses, setBusinesses] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    category: '',
    status: 'active'
  });
  const { enqueueSnackbar } = useSnackbar();

  const API_URL = 'https://api.realhero.in/api/v1/';

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(API_URL);
      setBusinesses(response.data.data);
    } catch (error) {
      enqueueSnackbar('Error fetching businesses', { variant: 'error' });
    }
  };

  const handleOpen = (business = null) => {
    if (business) {
      setSelectedBusiness(business);
      setFormData(business);
    } else {
      setSelectedBusiness(null);
      setFormData({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        category: '',
        status: 'active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBusiness(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBusiness) {
        await axios.put(`${API_URL}/${selectedBusiness._id}`, formData);
        enqueueSnackbar('Business updated successfully', { variant: 'success' });
      } else {
        await axios.post('https://api.realhero.in/api/v1/create', formData);
        enqueueSnackbar('Business added successfully', { variant: 'success' });
      }
      handleClose();
      fetchBusinesses();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || 'Error saving business', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this business?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        enqueueSnackbar('Business deleted successfully', { variant: 'success' });
        fetchBusinesses();
      } catch (error) {
        enqueueSnackbar('Error deleting business', { variant: 'error' });
      }
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4">Business Management</Typography>
              <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => handleOpen()}>
                Add Business
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {businesses.map((business) => (
                    <TableRow key={business._id}>
                      <TableCell>{business.name}</TableCell>
                      <TableCell>{business.category}</TableCell>
                      <TableCell>{business.phone}</TableCell>
                      <TableCell>{business.email}</TableCell>
                      <TableCell>{business.status}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleOpen(business)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDelete(business._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedBusiness ? 'Edit Business' : 'Add Business'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Category" name="category" value={formData.category} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBusiness ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Business;
