import express from "express";
 import axios from "axios";
 import cors from "cors";
 import dotenv from "dotenv";
 
 dotenv.config();
 
 const app = express();
 app.use(cors());
 app.use(express.json());
 
 app.post("/auth/token", async (req, res) => {
     const { code } = req.body;
     try {
         const response = await axios.post("https://todoist.com/oauth/access_token", {
             client_id: process.env.CLIENT_ID,
             client_secret: process.env.CLIENT_SECRET,
             code,
             redirect_uri: process.env.REDIRECT_URI,
         });
         res.json(response.data);
     } catch (err) {
         res.status(500).json({ error: err.message });
     }
 });
 
 app.listen(4000, () => console.log("Server running on port 4000"));