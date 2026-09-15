// Filename: server.js v0.1.25
// stickvid - Frontend web app for HTML5 Canvas stick figure animation playback
// Loads vidData YAML and renders animations
// Unlicense - Free and Open Source

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const VERSION = '0.1.49';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve HTML5 Canvas player
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: VERSION, service: 'stickvid' });
});

app.listen(PORT, () => {
  console.log(`stickvid player running on http://localhost:${PORT}`);
  console.log(`Version: ${VERSION}`);
});
