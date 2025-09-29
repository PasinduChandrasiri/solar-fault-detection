// backend/server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/detect-fault", async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      { inputs: imageUrl },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Error calling HF API:", err.response?.data || err.message);
    res.status(500).json({ error: "Inference failed" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
