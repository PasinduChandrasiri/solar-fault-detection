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
        const arr = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));
        setUploads(arr);
      } else setUploads([]);
    });
  }, []);

  const handleDetectFault = async (upload) => {
    try {
      const response = await axios.post("http://localhost:4000/detect-fault", {
        imageUrl: upload.imageUrl,
      });
      alert("Fault detection result:\n" + JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error(err);
      alert("Model request failed!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Admin Panel</h2>
      {uploads.map((upload) => (
        <div
          key={upload.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <img
            src={upload.imageUrl}
            alt="Solar Panel"
            style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "cover",
            }}
          />
          <p>Latitude: {upload.latitude}</p>
          <p>Longitude: {upload.longitude}</p>
          <p>Timestamp: {new Date(upload.timestamp).toLocaleString()}</p>
          <button onClick={() => handleDetectFault(upload)}>Detect Fault</button>
        </div>
      ))}
    </div>
  );
}
