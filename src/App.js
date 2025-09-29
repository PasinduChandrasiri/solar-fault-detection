// src/App.js
import React from "react";
import UploadForm from "./components/UploadForm";
import AdminPanel from "./components/AdminPanel";
import "./styles.css";

function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Solar Panel Fault Detection</h1>
      <UploadForm />
      <hr />
      <AdminPanel />
    </div>
  );
}

export default App;
