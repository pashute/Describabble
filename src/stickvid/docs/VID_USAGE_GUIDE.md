# .vid File Usage Guide v0.1.4

## Quick Start: Running surveyGuy

### 1. Start the Player Server

```bash
cd src/stickvid
npm install
npm start
```

Open browser: `http://localhost:3003`

### 2. Load the .vid Manifest

1. Click the **Load .vid File** button
2. Select `surveyGuy.vid` from `dev/testing/movies/surveyGuy/`
3. The player loads the manifest and vidData files

### 3. Play the Movie

- **<<** First frame
- **-<** Previous frame (slow)
- **[]** Stop (reset to start)
- **||** Pause (toggle with play)
- **|>** Play (toggle with pause)
- **>+** Next frame (slow)
- **>>** Last frame
- **Timeline:** Click or drag the locator to seek
- **Time Display:** Shows current time / total duration

## How It Works

### .vid File Flow

```
surveyGuy.vid (manifest)
    ↓
Contains references to:
    ├── Describ files (*.md)
    ├── Translation schemas (trans.*.md)
    ├── Generic metadata (meta.gen.*.md)
    └── VidData JSON files (*.json)
    ↓
Player loads manifest
    ↓
Player fetches vidData JSON files
    ↓
Player renders animation in Canvas
```

### File Relationships

```
surveyGuy.vid
├── References: desc.surveyGuy.characters.md
├── References: desc.surveyGuy.locations.md
├── References: desc.surveyGuy.scene1.md
├── References: trans.surveyGuy.emotions.md
├── References: meta.gen.stick.emotions.md
└── Points to: vidData/scenes.json
                vidData/characters.json
                vidData/locations.json
```

## Creating a New .vid File

### 1. Create a .vid Manifest

```
# myMovie.vid v0.1.3

## Movie Metadata
name: My Movie Title
version: 0.1.3
created: 2025-09-11
description: My movie description

## Duration & Technical Specs
totalDuration: 60.0
fps: 60
canvasWidth: 960
canvasHeight: 540
aspectRatio: 16:9

## Description Files
descriptions:
  characters: desc.myMovie.characters.md
  locations: desc.myMovie.locations.md
  scene1: desc.myMovie.scene1.md
  dialogue: desc.myMovie.dialogue.map.md

## Translation Schemas
translations:
  characters: trans.myMovie.characters.md
  locations: trans.myMovie.locations.md
  dialogue: trans.myMovie.dialogue.md
  emotions: trans.myMovie.emotions.md

## Generic Metadata
metadata:
  emotions: meta.gen.emotions.md
  emotions_stick: meta.gen.stick.emotions.md
  bridge: meta.gen.stick.component.bridge.md

## VidData Files
viddata:
  scenes: vidData/scenes.json
  characters: vidData/characters.json
  locations: vidData/locations.json

## File Paths
basePath: ./describ/

## Status & Build Info
status: ready
lastBuilt: 2025-09-11
buildTool: stickmake v0.1.3
player: stickvid v0.1.3

## License & Attribution
license: Unlicense
creator: Your Name
production: Describabble
```

### 2. Generate VidData JSON

Use stickmake to translate describ files to JSON:

```bash
cd src/stickmake
npm install
npm start
```

Then POST to `/api/translate`:
```bash
curl -X POST http://localhost:3002/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "screenplay": "myMovie",
    "descripContent": "...",
    "translationSchema": "..."
  }'
```

### 3. Place Files

```
myMovie/
├── myMovie.vid                    (manifest)
└── describ/
    ├── desc.myMovie.*.md          (description files)
    ├── trans.myMovie.*.md         (translation schemas)
    ├── meta.gen.*.md              (generic metadata)
    └── vidData/
        ├── scenes.json
        ├── characters.json
        └── locations.json
```

### 4. Load in Player

1. Open `http://localhost:3003`
2. Click **Load .vid File** button
3. Select your `.vid` manifest file
4. Use the playback controls to play

## The .vid Manifest

The `.vid` file is the **single source of truth** for a movie. It contains:

| Section | Purpose |
|---------|---------|
| Movie Metadata | Title, version, description, creator |
| Technical Specs | Duration, resolution, FPS |
| Descriptions | Links to .md describ files (characters, locations, dialogue) |
| Translations | Links to trans.*.md schema files |
| Metadata | Links to meta.gen.*.md generic rules |
| VidData | Links to compiled JSON animation data |
| Status | Build status and tools used |
| Attribution | License, creator, characters |

## Benefits

✓ **One file** = Complete movie specification  
✓ **Reproducible** = Can rebuild anytime  
✓ **Discoverable** = See what files are needed  
✓ **Versionable** = Track changes easily  
✓ **Shareable** = Share .vid + describ folder = complete movie  

## Troubleshooting

### Load button not working?

1. Make sure you've clicked the **Load .vid File** button
2. Check browser console for errors
3. Verify you selected a valid `.vid` manifest file
4. Check that vidData JSON files exist in the referenced paths

### Player not rendering animation?

1. Verify `surveyGuy.vid` exists in `dev/testing/movies/surveyGuy/`
2. Verify vidData JSON files exist in `dev/testing/movies/surveyGuy/describ/vidData/`
3. Check file paths in .vid manifest are correct relative to the manifest location

### .vid file validation

```javascript
const loader = new VidLoader();
const manifest = loader.parse(vidContent);
const validation = loader.parser.validate(manifest);
if (!validation.valid) {
  console.error('Invalid .vid:', validation.errors);
}
```

## Next Steps

1. ✓ Create .vid manifest files for all movies
2. ✓ Implement .vid loading in stickchat (for reference)
3. ✓ Use .vid in stickmake (as build manifest)
4. ✓ Add .vid export feature to stickchat
5. ✓ Package movies as: movie.vid + describ/ folder
