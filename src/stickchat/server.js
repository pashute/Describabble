// Filename: server.js v0.1.7
// stickchat - Backend server for screenplay editing and describ file generation
// Unlicense - Free and Open Source

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const VERSION = '0.1.7';

// In-memory storage for development
const db = {
  projects: new Map(),
  scenes: new Map(),
  shots: new Map(),
  describs: new Map(),
  sessions: new Map()
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { code } = req.body;
  const token = uuidv4();
  const user = { id: uuidv4(), email: 'user@example.com', name: 'User' };
  db.sessions.set(token, user);
  res.json({ token, user });
});

app.post('/api/auth/logout', (req, res) => {
  const { token } = req.body;
  if (token) db.sessions.delete(token);
  res.json({ status: 'logged out' });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = db.sessions.get(token);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Projects endpoints
app.get('/api/projects', (req, res) => {
  const projects = Array.from(db.projects.values());
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const { name, movieType } = req.body;
  const project = {
    id: uuidv4(),
    name,
    movieType: movieType || 'stick',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sceneIds: []
  };
  db.projects.set(project.id, project);
  res.json(project);
});

app.get('/api/projects/:id', (req, res) => {
  const project = db.projects.get(req.params.id);
  if (project) {
    const scenes = project.sceneIds.map(id => db.scenes.get(id)).filter(Boolean);
    res.json({ ...project, scenes });
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Scenes endpoints
app.post('/api/scenes', (req, res) => {
  const { projectId, sceneNumber, name } = req.body;
  const scene = {
    id: uuidv4(),
    projectId,
    sceneNumber,
    name: name || `Scene ${sceneNumber}`,
    shotIds: [],
    createdAt: new Date().toISOString()
  };
  db.scenes.set(scene.id, scene);
  const project = db.projects.get(projectId);
  if (project) {
    project.sceneIds.push(scene.id);
  }
  res.json(scene);
});

app.get('/api/scenes/:id', (req, res) => {
  const scene = db.scenes.get(req.params.id);
  if (scene) {
    const shots = scene.shotIds.map(id => db.shots.get(id)).filter(Boolean);
    res.json({ ...scene, shots });
  } else {
    res.status(404).json({ error: 'Scene not found' });
  }
});

// Shots endpoints
app.post('/api/shots', (req, res) => {
  const { sceneId, shotNumber } = req.body;
  const shot = {
    id: uuidv4(),
    sceneId,
    shotNumber,
    characters: [],
    stage: [],
    dialogue: [],
    locations: [],
    emotions: [],
    audio: [],
    background: '',
    status: 'DRAFTING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.shots.set(shot.id, shot);
  const scene = db.scenes.get(sceneId);
  if (scene) {
    scene.shotIds.push(shot.id);
  }
  res.json(shot);
});

app.get('/api/shots/:id', (req, res) => {
  const shot = db.shots.get(req.params.id);
  if (shot) {
    res.json(shot);
  } else {
    res.status(404).json({ error: 'Shot not found' });
  }
});

app.patch('/api/shots/:id', (req, res) => {
  const shot = db.shots.get(req.params.id);
  if (shot) {
    Object.assign(shot, req.body, { updatedAt: new Date().toISOString() });
    res.json(shot);
  } else {
    res.status(404).json({ error: 'Shot not found' });
  }
});

// Describ file generation
app.post('/api/describs/generate', (req, res) => {
  const { screenplayName, shot } = req.body;
  // Generate markdown describ files from shot data
  const describs = {
    characters: generateCharactersDescrib(shot),
    dialogue: generateDialogueDescrib(shot),
    locations: generateLocationsDescrib(shot),
    emotions: generateEmotionsDescrib(shot),
    audio: generateAudioDescrib(shot),
    background: generateBackgroundDescrib(shot)
  };
  res.json(describs);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: VERSION, service: 'stickchat' });
});

// Helper functions for describ generation
function generateCharactersDescrib(shot) {
  if (!shot.characters?.length) return '';
  return shot.characters.map(c =>
    `## ${c.name}\n- Appearance: ${c.appearance || 'N/A'}\n- Role: ${c.role || 'N/A'}`
  ).join('\n\n');
}

function generateDialogueDescrib(shot) {
  if (!shot.dialogue?.length) return '';
  return shot.dialogue.map(d =>
    `**${d.speaker}** (${d.startTime}s): "${d.text}"`
  ).join('\n\n');
}

function generateLocationsDescrib(shot) {
  if (!shot.locations?.length) return '';
  return shot.locations.map(l =>
    `## ${l.name}\n- POV: ${l.pov || 'N/A'}\n- Lighting: ${l.lighting || 'N/A'}`
  ).join('\n\n');
}

function generateEmotionsDescrib(shot) {
  if (!shot.emotions?.length) return '';
  return shot.emotions.map(e =>
    `**${e.character}** at ${e.timing}s: ${e.emotion}`
  ).join('\n');
}

function generateAudioDescrib(shot) {
  if (!shot.audio?.length) return '';
  return shot.audio.map(a =>
    `- ${a.type} (${a.startTime}-${a.endTime}s): ${a.description}`
  ).join('\n');
}

function generateBackgroundDescrib(shot) {
  return shot.background || '';
}

app.listen(PORT, () => {
  console.log(`stickchat server running on http://localhost:${PORT}`);
  console.log(`Version: ${VERSION}`);
});

export default app;
