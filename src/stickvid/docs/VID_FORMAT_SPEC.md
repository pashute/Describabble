# .vid File Format Specification v0.1.3

**Describabble Video Manifest Format**

## Overview

A `.vid` file is a text manifest that links all components needed to create and play a stick figure animation movie. It serves as the single source of truth for what files make up a complete Describabble video.

## File Format

- **Extension:** `.vid`
- **Format:** Plain text, key:value format
- **Encoding:** UTF-8
- **Line comments:** Start with `#`
- **Sections:** Marked with `##` headers
- **Subsections:** Use indentation (2 spaces)

## Sections

### Movie Metadata
```
name: Movie Title
version: 0.1.3
created: YYYY-MM-DD
description: Brief description
```

### Duration & Technical Specs
```
totalDuration: seconds (float)
fps: frames per second
canvasWidth: pixels
canvasHeight: pixels
aspectRatio: ratio string (e.g., "16:9")
```

### Description Files
Lists all `.md` describ files needed to describe the movie:
```
descriptions:
  characters: path/to/desc.*.characters.md
  locations: path/to/desc.*.locations.md
  scene1: path/to/desc.*.scene1.md
  dialogue: path/to/desc.*.dialogue.map.md
```

### Translation Schemas
Lists all `.trans.md` translation files:
```
translations:
  characters: path/to/trans.*.characters.md
  locations: path/to/trans.*.locations.md
  dialogue: path/to/trans.*.dialogue.md
  emotions: path/to/trans.*.emotions.md
```

### Generic Metadata
Lists reusable `.meta.md` files from meta.gen:
```
metadata:
  emotions: path/to/meta.gen.emotions.md
  movement: path/to/meta.gen.stick.movement.md
  bridge: path/to/meta.gen.stick.component.bridge.md
```

### VidData Files
Lists compiled JSON animation data:
```
viddata:
  scenes: path/to/vidData/scenes.json
  characters: path/to/vidData/characters.json
  locations: path/to/vidData/locations.json
```

### File Paths
```
basePath: relative/path/to/describ/folder/
```

All file paths are relative to the location of the `.vid` file.

### Status & Build Info
```
status: ready|building|error
lastBuilt: YYYY-MM-DD
buildTool: stickmake v0.1.3
player: stickvid v0.1.3
```

### License & Attribution
```
license: Unlicense
creator: Name
production: Studio
characters:
  - Character Name (Actor Name)
  - Character Name (Actor Name)
```

## Loading a .vid File

### In stickvid Player
```javascript
const player = new StickVidPlayer('animationCanvas');
const vidManifest = await player.loadVidFile('path/to/movie.vid');
player.play();
```

### In stickmake Backend
```javascript
const builder = new StickMakeBuilder();
const manifest = await builder.loadVidFile('path/to/movie.vid');
const compiled = await builder.translateToVidData(manifest);
```

### Programmatic Access
```javascript
const parser = new VidFileParser();
const manifest = parser.parse(vidFileContent);

// Access properties
console.log(manifest.movie.name);
console.log(manifest.descriptions.characters);
console.log(manifest.viddata.scenes);
```

## Example Usage

1. **Create .vid file** (surveyGuy.vid)
   - Lists all describ files
   - Lists all translation files
   - Lists all metadata files
   - Lists compiled vidData files

2. **Player loads .vid file**
   ```bash
   http://localhost:3003?movie=surveyGuy.vid
   ```

3. **Player fetches all resources**
   - Reads manifest
   - Loads JSON vidData files
   - Initializes animation
   - Plays movie

4. **Backend uses .vid for building**
   ```bash
   stickmake translate surveyGuy.vid
   ```

## Benefits

- **Single File Reference:** One file links everything
- **Version Control:** Easy to track what changed
- **Reproducibility:** Can rebuild anytime
- **Discovery:** Easy to see what files are needed
- **Validation:** Can check file completeness
- **Distribution:** Share one .vid file + describ folder
- **Modularity:** Reuse meta files across movies

## Validation

A valid .vid file must have:
- All required sections
- All referenced files exist
- Consistent path format
- Valid version string
- Non-empty movie name

## Extension Ideas (Future)

- Subtitles in multiple languages
- Multiple endings/variations
- Scene-specific metadata overrides
- Custom color palettes
- Audio track specifications
- Export formats (MP4, GIF, etc.)
