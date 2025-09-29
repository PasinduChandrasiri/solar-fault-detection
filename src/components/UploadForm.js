// src/components/UploadForm.js
import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";

export default function UploadForm() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Select an image");

    setLoading(true);

    // 1️⃣ Get location
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      // 2️⃣ Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "Firebase"); // Your upload preset
      formData.append("folder", "solar image");     // Cloudinary folder

      try {
        const cloudRes = await axios.post(
          `https://api.cloudinary.com/v1_1/dplnzogmx/image/upload`, // your cloud name
          formData
        );

        const imageUrl = cloudRes.data.secure_url;

        // 3️⃣ Save metadata to Firebase
        const dbRef = ref(database, "uploads");
        await push(dbRef, {
          imageUrl,
          latitude,
          longitude,
          timestamp: Date.now(),
          status: "pending"
        });

        alert("Uploaded successfully!");
        setImage(null);
      } catch (err) {
        console.error(err);
        alert("Upload failed!");
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error(err);
      alert("Failed to get location. Make sure location is enabled on your device.");
      setLoading(false);
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Upload Solar Panel Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} required />
      <button type="submit" disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </form>
  );
}
