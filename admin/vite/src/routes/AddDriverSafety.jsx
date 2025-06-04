import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Card, CardMedia, IconButton, Alert, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';

const AddDriverSafety = () => {
  const [note, setNote] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [response, setResponse] = useState(null);

  const handleImageChange = (e) => setImage(e.target.files[0]);
  const handleVideoChange = (e) => setVideo(e.target.files[0]);

  const removeImage = () => setImage(null);
  const removeVideo = () => setVideo(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('note', note);
    if (image) formData.append('image', image);
    if (video) formData.append('video', video);

    try {
      const res = await axios.post('https://lipu.w4u.in/mlm/api/v1/create/safety', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResponse({ success: true, message: 'Upload successful!' });
      setNote('');
      setImage(null);
      setVideo(null);
    } catch (err) {
      setResponse({ success: false, message: 'Failed to upload data' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Add Driver Safety Data
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField fullWidth label="Note" value={note} onChange={(e) => setNote(e.target.value)} required margin="normal" />

        <Box mt={2}>
          <Typography variant="subtitle1">Upload Image</Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <Card sx={{ mt: 2, position: 'relative' }}>
              <CardMedia component="img" height="200" image={URL.createObjectURL(image)} alt="Preview" />
              <IconButton
                size="small"
                onClick={removeImage}
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Card>
          )}
        </Box>

        <Box mt={3}>
          <Typography variant="subtitle1">Upload Video</Typography>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
          {video && (
            <Card sx={{ mt: 2, position: 'relative' }}>
              <CardMedia component="video" controls height="200" src={URL.createObjectURL(video)} />
              <IconButton
                size="small"
                onClick={removeVideo}
                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'error.main', color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Card>
          )}
        </Box>

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 4, bgcolor: 'primary.main' }}>
          Submit
        </Button>
      </Box>

      {response && (
        <Stack mt={4}>
          <Alert severity={response.success ? 'success' : 'error'}>{response.message}</Alert>
        </Stack>
      )}
    </Container>
  );
};

export default AddDriverSafety;
