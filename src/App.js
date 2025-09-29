import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import AdminPanel from "./components/AdminPanel";
import { Box, Button, Container } from "@mui/material";

function App() {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/background.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(40%)", // makes background darker / low opacity effect
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <Container sx={{ position: "relative", zIndex: 1, pt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button variant="contained" onClick={() => navigate("/")}>
            Upload
          </Button>
          <Button variant="contained" onClick={() => navigate("/admin")}>
            Admin Panel
          </Button>
        </Box>

        <Routes>
          <Route path="/" element={<UploadForm />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
