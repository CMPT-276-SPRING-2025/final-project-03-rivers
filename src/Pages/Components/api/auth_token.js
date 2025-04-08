import axios from "axios";
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight requests
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const { code } = req.body;
  const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;
  console.log("🔐 Received code:", code);
  console.log("🌍 Env vars:", CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  if (!code || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  try {
    const response = await axios.post("https://todoist.com/oauth/access_token", {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code,
      redirect_uri: REDIRECT_URI,
    });
    const access_token = response.data.access_token;
    console.log("✅ Token:", access_token);
    return res.status(200).json({ access_token });
  } catch (error) {
    console.error("❌ Error exchanging code:", error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || "Exchange failed" });
  }
}