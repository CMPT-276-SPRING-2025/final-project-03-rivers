import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

app.post("/api/auth-token", async (req, res) => {
  const { code } = req.body;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  if (!code || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const response = await axios.post("https://todoist.com/oauth/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const access_token = response.data.access_token;
    return res.status(200).json({ access_token });
  } catch (err) {
    console.error("❌ Error exchanging token:", err.message);
    return res.status(500).json({ error: "Token exchange failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});
