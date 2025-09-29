import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { database } from "../firebaseConfig";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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
          faultResult: null,
          loading: false,
        }));
        setUploads(arr);
      } else setUploads([]);
    });
  }, []);

  const handleDetectFault = async (uploadId, imageUrl) => {
    setUploads((prev) =>
      prev.map((u) => (u.id === uploadId ? { ...u, loading: true } : u))
    );

    try {
      const response = await axios.post("http://localhost:4000/detect-fault", { imageUrl });
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? { ...u, loading: false, faultResult: response.data }
            : u
        )
      );
    } catch (err) {
      console.error(err);
      setUploads((prev) =>
        prev.map((u) =>
          u.id === uploadId
            ? { ...u, loading: false, faultResult: { error: "Model request failed" } }
            : u
        )
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      await remove(ref(database, `uploads/${id}`));
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: "auto" }}>
      <Typography variant="h4" textAlign="center" mb={4} color="white">
        Admin Panel
      </Typography>

      {uploads.map((upload) => (
        <Card key={upload.id} sx={{ mb: 4, backgroundColor: "rgba(255,255,255,0.9)" }}>
          <CardMedia
            component="img"
            image={upload.imageUrl}
            alt="Solar Panel"
            sx={{ maxHeight: 300, objectFit: "cover" }}
          />
          <CardContent>
            <Typography>Latitude: {upload.latitude}</Typography>
            <Typography>Longitude: {upload.longitude}</Typography>
            <Typography>Timestamp: {new Date(upload.timestamp).toLocaleString()}</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => handleDetectFault(upload.id, upload.imageUrl)}
                disabled={upload.loading}
              >
                {upload.loading ? "Detecting..." : "Detect Fault"}
              </Button>

              <IconButton color="error" onClick={() => handleDelete(upload.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {upload.faultResult && Array.isArray(upload.faultResult) && (
              <Table sx={{ mt: 2, backgroundColor: "#f5f5f5" }}>
                <TableBody>
                  {upload.faultResult.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.label}</TableCell>
                      <TableCell>{(item.score * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {upload.faultResult?.error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {upload.faultResult.error}
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
