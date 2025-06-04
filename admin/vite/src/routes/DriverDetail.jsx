import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

const DriverDetail = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);
  const [status, setStatus] = useState('');
  const [posts, setposts] = useState([]);

  console.log(posts);
  const token = Cookies.get('Token') ? JSON.parse(Cookies.get('Token')) : null;

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.get(`https://lipu.w4u.in/mlm/api/v1/admin/user/${id}`, {
          headers: {
            Authorization: `${token}`
          }
        });

        setDriver(response.data.user);
        setStatus(response.data.user.userRequests[0]?.status || '');
      } catch (error) {
        console.error('Failed to fetch driver:', error);
      }
    };

    fetchDriver();
    const fetchPost = async () => {
      try {
        const response = await axios.get(`https://lipu.w4u.in/mlm/api/v1/product/${id}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        if (response.data) {
          setposts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch driver:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleStatusChange = async (reqid, newStatus) => {
    try {
      const response = await axios.put(
        `https://lipu.w4u.in/mlm/api/v1/status/change/${id}`,
        { status: newStatus, requestId: reqid },

        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      setStatus(newStatus);

      if (response.data) {
        window.alert('Status Updated Sucsessfullly');
      }
    } catch (error) {
      console.error('Status update failed:', error);
    }
  };

  const handleBlock = async () => {
    try {
      const res = await axios.put(
        `https://lipu.w4u.in/mlm/api/v1/block/${driver._id}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      alert('User blocked successfully');
      setDriver(res.data.user); // refresh driver with updated block data
    } catch (error) {
      console.error('Failed to block user:', error);
      alert('Blocking failed');
    }
  };

  const handleUnblock = async () => {
    try {
      const res = await axios.put(
        `https://lipu.w4u.in/mlm/api/v1/unblock/${id}`,
        {},
        {
          headers: {
            Authorization: `${token}`
          }
        }
      );
      alert('User unblocked successfully');
      setDriver(res.data.user); // refresh the state
    } catch (error) {
      console.error('Failed to unblock user:', error);
      alert('Unblocking failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`https://lipu.w4u.in/mlm/api/v1/delete/user/${id}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      alert('User deleted successfully');
      // Optionally redirect or go back to user list
      window.location.href = '/'; // or navigate("/admin/users") if using `useNavigate`
    } catch (error) {
      console.error('User deletion failed:', error);
      alert('Failed to delete user');
    }
  };

  if (!driver) return <Typography>Loading...</Typography>;

  const request = driver.userRequests[0];

  return (
    <Box p={3}>
      <Card sx={{ p: 3, boxShadow: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <Avatar alt={driver.name} src={driver.profileImage || ''} sx={{ width: 120, height: 120, fontSize: 40 }}>
              {driver.name[0]}
            </Avatar>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Typography variant="h5">{driver.name}</Typography>
            <Typography variant="subtitle1">Phone: {driver.number}</Typography>

            <Typography variant="subtitle1" color={driver?.block?.status === 'true' ? 'error' : 'green'}>
              Status: {driver?.block?.status === 'true' ? 'Blocked' : 'Active'}
            </Typography>
            {driver?.block?.status === 'true' && (
              <>
                <Typography variant="body2">Blocked At: {new Date(driver.block.blockedAt).toLocaleString()}</Typography>
                <Typography variant="body2">Blocked By: {driver.block.blockedBy}</Typography>
              </>
            )}

            <Box mt={2} display="flex" gap={2}>
              {driver?.block?.status === 'true' ? (
                <Button variant="outlined" color="success" onClick={handleUnblock}>
                  Unblock
                </Button>
              ) : (
                <Button variant="outlined" color="error" onClick={handleBlock}>
                  Block
                </Button>
              )}

              <Button variant="outlined" color="secondary" onClick={handleDelete}>
                Delete
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Typography variant="h6">Request History</Typography>
          {driver.userRequests?.length > 0 ? (
            driver.userRequests.map((req) => (
              <Card key={req._id} sx={{ my: 2, p: 2 }}>
                <Typography variant="subtitle2">📍 Location: {req.location}</Typography>
                <Typography variant="subtitle2">📞 Help Number: {req.helpnumber}</Typography>
                <Typography variant="subtitle2">📅 Requested At: {new Date(req.requestedAt).toLocaleString()}</Typography>

                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={req.status} label="Status" onChange={(e) => handleStatusChange(req._id, e.target.value)}>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="solved">Solved</MenuItem>
                    <MenuItem value="not solved">Not Solved</MenuItem>
                  </Select>
                </FormControl>
              </Card>
            ))
          ) : (
            <Typography>No requests found.</Typography>
          )}
        </Box>

        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Uploaded Documents
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="body1">Aadhar</Typography>
                  <img src={driver.aadharFile?.url} alt="Aadhar" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <Typography variant="body1">Driving License</Typography>
                  <img src={driver.DrivingLicense?.url} alt="License" style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <hr />
        <Box>
          <h1 sx={{ mt: 4 }}>User Posts : </h1>

          <Grid container spacing={2} mt={2}>
            {posts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post._id}>
                <Card>
                  {/* Video Section */}
                  {post.video?.url && (
                    <CardMedia
                      component="video"
                      sx={{ border: '1px solid black' }}
                      src={`https://lipu.w4u.in/mlm${post.video.url}`}
                      controls
                      style={{ height: 250 }}
                    />
                  )}

                  {/* Image Section */}
                  {post.images?.length > 0 && (
                    <Box display="flex" overflow="auto" p={1} gap={1}>
                      {post.images.map((img, idx) => (
                        <CardMedia
                          key={idx}
                          component="img"
                          src={`https://lipu.w4u.in/mlm${img.url}`}
                          alt="Post Image"
                          sx={{ width: 100, height: 100, borderRadius: 2, border: '1px solid black' }}
                        />
                      ))}
                    </Box>
                  )}

                  {/* Metadata */}
                  {/* <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Posted on: {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent> */}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default DriverDetail;
