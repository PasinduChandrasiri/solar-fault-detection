import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";
import { Box, Button, Typography, Paper } from "@mui/material";

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Select an image");

    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "Firebase");
      formData.append("folder", "solar image");

      try {
        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dplnzogmx/image/upload`,
          formData
        );
        const imageUrl = cloudRes.data.secure_url;

        const dbRef = ref(database, "uploads");
        await push(dbRef, {
          imageUrl,
          latitude,
          longitude,
          timestamp: Date.now(),
          status: "pending",
        });

        setImage(null);
      } catch (err) {
        console.error(err);
        alert("Upload failed!");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      alert("Failed to get location. Make sure location is enabled.");
      setLoading(false);
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 400,
        margin: "auto",
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
    >
      <Typography variant="h5" textAlign="center" mb={2}>
        Upload Solar Panel Image
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </Box>
    </Paper>
  );
}
