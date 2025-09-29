// src/components/AdminPanel.js
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";

export default function AdminPanel() {
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    const dbRef = ref(database, "uploads");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setUploads(arr);
      } else setUploads([]);
    });
  }, []);

  const handleDetectFault = async (upload) => {
    try {
      const formData = new FormData();
      formData.append("file", upload.imageUrl);

      const response = await axios.post(
        `https://huggingface.co/IsurikaDilrukshi/reaserach_llm3`,
        { inputs: upload.imageUrl },
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
        }
      );

      alert("Fault detected: " + JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      alert("Model request failed!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Admin Panel</h2>
      {uploads.map((upload) => (
        <div key={upload.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
          <img src={upload.imageUrl} alt="Solar Panel" style={{ width: "100%", maxHeight: "300px", objectFit: "cover" }} />
          <p>Latitude: {upload.latitude}</p>
          <p>Longitude: {upload.longitude}</p>
          <p>Timestamp: {new Date(upload.timestamp).toLocaleString()}</p>
          <button onClick={() => handleDetectFault(upload)}>Detect Fault</button>
        </div>
      ))}
    </div>
  );
}
