import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = 5177;

// Allow CORS for local development
app.use(cors());

let accessToken = ''; // You should ideally store this in a database or session

// Redirect to Todoist's authorization page
app.get('/home', (req, res) => {
  const authUrl = `https://todoist.com/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=data:read_write&state=random_state&redirect_uri=${process.env.REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Callback URL
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    // Exchange code for access token
    const response = await axios.post('https://todoist.com/oauth/access_token', {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    accessToken = response.data.access_token;
    res.send('Successfully logged in with Todoist!');
  } catch (error) {
    console.error('Error exchanging code for access token', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch Todoist tasks (after login)
app.get('/tasks', async (req, res) => {
  if (!accessToken) {
    return res.status(401).send('Not authenticated with Todoist');
  }

  try {
    const response = await axios.get('https://api.todoist.com/rest/v1/tasks', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching tasks', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});