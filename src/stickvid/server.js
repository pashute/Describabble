// Filename: server.js v0.1.3
// stickvid - Frontend web app for HTML5 Canvas stick figure animation playback
// Loads vidData JSON and renders animations
// Unlicense - Free and Open Source

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve HTML5 Canvas player
app.get('/', (req, res) => {
  res.sendFile(new URL('./public/index.html', import.meta.url).pathname);
});

// API endpoints for player
app.get('/api/movie/:screenplay', (req, res) => {
  // TODO: Load vidData JSON files for screenplay
  const { screenplay } = req.params;
  res.json({
    title: `${screenplay} Movie`,
    version: '0.1.3',
    scenes: [],
    characters: [],
    locations: []
  });
});

app.get('/api/viddata/:screenplay/:type', (req, res) => {
  const { screenplay, type } = req.params;
  // TODO: Serve vidData JSON (scenes.json, characters.json, locations.json)
  res.json({ type, data: [] });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1.3', type: 'player' });
});

app.listen(PORT, () => {
  console.log(`stickvid player running on http://localhost:${PORT}`);
  console.log('Version: 0.1.3');
});
