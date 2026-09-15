// Filename: server.js v0.1.9
// stickmake - Backend translator: describ files → .vid manifest YAML
// Processes screenplay descriptions and generates standardized .vid files
// Unlicense - Free and Open Source

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dump as yamlDump, load as yamlLoad } from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3002;
const VERSION = '0.1.9';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/translate', async (req, res) => {
  const { movie, specs, characters, scenes, describs } = req.body;

  try {
    const vidManifest = generateVidManifest({
      movie,
      specs,
      characters,
      scenes,
      describs
    });

    res.json({
      status: 'success',
      manifest: vidManifest,
      version: VERSION
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message,
      version: VERSION
    });
  }
});

app.post('/api/validate', async (req, res) => {
  const { vidContent } = req.body;

  try {
    const manifest = yamlLoad(vidContent);
    const errors = validateManifest(manifest);

    res.json({
      status: 'validated',
      valid: errors.length === 0,
      errors: errors,
      version: VERSION
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      error: error.message,
      version: VERSION
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: VERSION,
    service: 'stickmake'
  });
});

function generateVidManifest(data) {
  const manifest = {
    movie: {
      name: data.movie?.name || 'Untitled',
      version: VERSION,
      created: new Date().toISOString().split('T')[0],
      description: data.movie?.description || '',
      license: 'Unlicense (Free and Open Source)',
      creator: data.movie?.creator || '',
      production: data.movie?.production || 'Describabble'
    },

    specs: {
      totalDuration: data.specs?.totalDuration || 0,
      fps: data.specs?.fps || 60,
      canvasWidth: data.specs?.canvasWidth || 960,
      canvasHeight: data.specs?.canvasHeight || 540,
      aspectRatio: data.specs?.aspectRatio || '16:9'
    },

    describs: data.describs || {},

    characters: data.characters || [],

    locations: data.scenes?.length > 0 ? extractLocations(data.scenes) : [],

    scenes: data.scenes || [],

    status: {
      ready: true,
      lastBuilt: new Date().toISOString().split('T')[0],
      buildTool: `stickmake ${VERSION}`,
      player: 'stickvid v0.1.9'
    },

    notes: data.movie?.notes || []
  };

  return manifest;
}

function extractLocations(scenes) {
  const locations = new Map();

  scenes.forEach(scene => {
    if (scene.shots) {
      scene.shots.forEach(shot => {
        if (shot.camera?.location) {
          const locId = shot.camera.location;
          if (!locations.has(locId)) {
            locations.set(locId, {
              id: locId,
              name: shot.camera.location,
              camera: shot.camera || {},
              elements: shot.camera?.elements || [],
              lighting: shot.camera?.lighting || 'default'
            });
          }
        }
      });
    }
  });

  return Array.from(locations.values());
}

function validateManifest(manifest) {
  const errors = [];

  if (!manifest.movie?.name) {
    errors.push('Missing movie.name');
  }

  if (!manifest.specs?.totalDuration) {
    errors.push('Missing specs.totalDuration');
  }

  if (!Array.isArray(manifest.scenes) || manifest.scenes.length === 0) {
    errors.push('Missing scenes');
  }

  if (!Array.isArray(manifest.characters) || manifest.characters.length === 0) {
    errors.push('Missing characters');
  }

  manifest.scenes?.forEach((scene, idx) => {
    if (!scene.shots || scene.shots.length === 0) {
      errors.push(`Scene ${idx} has no shots`);
    }
    scene.shots?.forEach((shot, sidx) => {
      if (shot.timeRange.start === undefined) {
        errors.push(`Scene ${idx} Shot ${sidx} missing start time`);
      }
      if (shot.timeRange.end === undefined) {
        errors.push(`Scene ${idx} Shot ${sidx} missing end time`);
      }
    });
  });

  return errors;
}

app.listen(PORT, () => {
  console.log(`stickmake server running on http://localhost:${PORT}`);
  console.log(`Version: ${VERSION}`);
});

export default app;
