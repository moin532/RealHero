import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const DriversCaution = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = () => {
    axios
      .get('https://lipu.w4u.in/mlm/api/v1/all/safety')
      .then((res) => {
        setEntries(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch entries', err);
      });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`https://lipu.w4u.in/mlm/api/v1//create/safety/${id}`);
        setEntries((prev) => prev.filter((entry) => entry._id !== id));
      } catch (err) {
        console.error('Error deleting entry:', err);
        alert('Failed to delete entry');
      }
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
        Driver Safety Caution
      </Typography>

      <Box>
        <Button
          variant="contained"
          onClick={() => navigate('/add/safety')}
          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, mb: 5, mt: 3 }}
        >
          Add a Safety Caution
        </Button>
      </Box>

      <Grid container spacing={4}>
        {entries.map((entry) => (
          <Grid item key={entry._id} xs={12} sm={6} md={4}>
            <Card elevation={4} sx={{ borderRadius: 3, position: 'relative' }}>
              {/* Delete Button */}
              <IconButton
                onClick={() => handleDelete(entry._id)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'white',
                  '&:hover': { bgcolor: '#f44336', color: 'white' }
                }}
              >
                <DeleteIcon />
              </IconButton>

              {/* Image */}
              {entry.image && (
                <CardMedia
                  component="img"
                  image={`https://lipu.w4u.in/mlm/${entry.image}`}
                  alt="Safety Image"
                  sx={{ height: 240, objectFit: 'cover' }}
                />
              )}

              {/* Video */}
              {entry.video && (
                <Box sx={{ position: 'relative', width: '100%', height: 240, mt: 2, px: 2 }}>
                  <video
                    controls
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: '1px solid #ddd'
                    }}
                  >
                    <source src={`https://lipu.w4u.in/mlm/${entry.video}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              )}

              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Created At:</strong> {formatDate(entry.createdAt)}
                </Typography>
                <Typography variant="body1" color="text.primary" fontWeight={500}>
                  {entry.note}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DriversCaution;
