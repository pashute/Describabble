# Stick Project System Architecture

`Filename: stickTech.md v0.1.7`

**See [describ.md](../describ.md) for detailed file formats, parameter systems, and rendering mappings.**

## Overview

AI-native cinematic pipeline for creating stick-figure movies. Three integrated components:

1. **stickchat** (v0.1.7) - Interactive editor frontend
2. **stickmake** (v0.1.7) - Headless backend compiler  
3. **stickvid** (v0.1.7) - Player (already built, archive stickVid.prompt)

---

## Core Pipeline

```
stickchat (Browser/Tauri)
  ↓ (create describ files via chat)
  IndexedDB local storage
  ↓ (send to backend)
stickmake (Node.js/Express)
  ↓ (compile with Gemini AI)
  .vid manifest (YAML) + pashute.describ// references
  ↓ (load in player)
stickvid (Browser - Canvas player)
  ↓ (render animation)
  Stick figure movie
```

---

## Asset Naming & Formats

Three file types in dot notation: `.meta`, `.desc`, `.trans`

See **[describ.md](../describ.md)** for:
- Parameter schemas (head size, emotions, movement, posture)
- File type definitions with examples
- Meta/desc/trans distinctions
- surveyGuy character breakdown

**CDN URL Pattern:** `pashute.describ://meta/stick.emotions` (loads `meta.stick.emotions.md`)

---

## stickchat - Natural Language Editor

### Purpose
Chat-based interface where users create movie content through conversation. Outputs describ markdown files.

### Storage
- **IndexedDB (Local-First):**
  - User projects, scenes, shots
  - Describ markdown files
  - Edit history, drafts
  - Persists across sessions

- **Asset Cache (IndexedDB):**
  - Fetched from pashute.describ// CDN on first load
  - Cached locally for offline use
  - Includes: meta.*, trans.*, desc.gen.* files

### Setup
- **stickSetup.js (v0.1.7)** - Runs on app initialization:
  - Creates IndexedDB schema
  - Fetches and caches assets from pashute.describ// CDN
  - Initializes asset accessor for JS code
  - Graceful offline fallback

- **npm run dev:**
  - Automatically calls stickSetup.js on startup
  - Sets up IndexedDB and asset cache
  - Logs cache status to console

### UI/UX

#### Main Screen
1. **OAuth Login** - Secure user authentication
2. **Project Load** - Browse and load screenplays
3. **Scene/Shot Selector** - Choose current scene and shot to edit
4. **Chat Interface** - Main editing area for current shot
5. **Sidebar Units** - Grid of shot boxes (text or summary)

#### Editing Types
For each shot, user can create/edit:
- **Characters** - Names, roles, appearances, emotions
- **Stage** - Components (bridges, props, set pieces)
- **Dialogue** - Speaker, timing, delivery, tone
- **Locations** - POV/camera setup, environment
- **Emotions** - Character mood, expressions
- **Audio** - Sound effects, ambience, music
- **Background** - Scene description, atmosphere

#### Sidebar Shot Navigation
- Grid of shot boxes showing unit content (text/summary)
- Click to focus that shot in chat
- Edit, delete, or add new shots
- Remember all shots but work on one at a time

### State Machine (XState)

Strict phases prevent illegal transitions:

1. **DRAFTING** - User editing describ content
2. **BRANCHING_OPTIONS** - AI presents alternatives/corrections
3. **CONSOLIDATING** - User approves final versions
4. **COMPILING** - Sending to stickmake for .vid generation
5. **READY_TO_RENDER** - .vid ready for stickvid player

### Output
Generates describ markdown files for each shot:
- `desc.movie.characters.md`
- `desc.movie.scene1.md`
- `desc.movie.dialogue.map.md`
- `desc.movie.locations.md`
- etc.

---

## stickmake - Backend Compiler

### Purpose
Translates describ markdown files → .vid manifest (YAML)

### Input
From stickchat via `/api/translate` endpoint:
- Describ markdown files (characters, dialogue, scenes, locations, audio)
- Translation schemas (`trans.stick.*`)
- Generic metadata (`meta.stick.*`, `desc.gen.*`)

### Processing
1. Load and validate describ files
2. Check completeness (fail if missing required fields)
3. Use Gemini Flash-lite AI to extract structured data
4. Map human-readable descriptions to animation parameters
5. Build nested YAML .vid manifest with describs links in each section

### Output
Single `.vid` file (YAML format):
```yaml
## Movie Metadata
movie:
  name: surveyGuy
  version: 0.1.7
  describs: [desc.surveyGuy.characters.md, ...]

## Duration & Technical Specs
specs:
  totalDuration: 53.0
  describs: [desc.surveyGuy.scene1.md]

# ... etc for all sections
```

### Validation
- All times within 0-53s bounds
- Characters exist (valid references)
- POV consistency
- All required fields present
- Completeness checks

### Error Handling
- Missing field → Use default from desc.gen.* if available
- Timing conflict → Halt, report issue
- Invalid reference → Halt, list missing item
- Ambiguous description → Flag for review

---

## stickvid - Animation Player

### Already Built
See stickvid/README.md and src/stickvid/

### Input
- .vid manifest file (YAML)
- pashute.describ// asset references

### Rendering
- HTML5 Canvas stick figure animation
- Reads timeline from .vid
- Draws characters, locations, emotions
- Handles POV switches

### Controls
- Play/Pause (green button toggles)
- ⏮ First, ⏪ Back 10s, ⏹ Stop, ⏩ Forward 10s, ⏭ Last
- Timeline scrubber with movable locator
- Time display (0.1s precision)

---

## surveyGuy Test Case

Requirements:
1. Use existing surveyGuy describ files (no mocks)
2. Stickmake must validate completeness
3. Must produce valid .vid file
4. Stickvid must play without errors
5. All timing and references must be correct

Assets provided:
- `desc.surveyGuy.*.md` files
- `trans.surveyGuy.*.md` schemas
- `meta.gen.*` and `meta.stick.*` rules
- Bridge component definitions

---

## Asset Loading Architecture

### stickSetup.js Location
`src/stickSetup/stickSetup.js` (v0.1.7)

### Initialization Flow
1. App starts → npm run dev calls stickSetup.js
2. Create IndexedDB database schema
3. Check cache status (already downloaded?)
4. If not cached: Fetch from pashute.describ// CDN
5. Store in IndexedDB for offline use
6. Provide global asset accessor
7. Ready for stickchat to use

### Asset Accessor
```javascript
// Available to stickchat code:
Assets.get('meta.stick.emotions')    // Returns markdown content
Assets.list('trans.stick.*')         // Lists matching assets
Assets.isCached('meta.gen.bridge')   // Check cache status
```

### Offline Capability
- First load: Downloads from CDN (requires internet)
- Subsequent loads: Uses local cache (works offline)
- Manual refresh: Clear cache, re-fetch from CDN

---

## Development Setup

### stickchat npm run dev
1. Install dependencies
2. Run stickSetup.js initialization
3. Create IndexedDB schema
4. Fetch and cache assets from pashute.describ// CDN
5. Log cache status
6. Start dev server on localhost:3001
7. Ready for user login and project creation

### Environment
- OAuth credentials in `.env`
- Gemini API key in `src/.env` (optional, for stickmake AI)
- Asset CDN accessible (pashute.describ//)

---

## Licensing

All code: **Unlicense** (Free and Open Source)  
Dependencies: Retain original license notices (e.g., MIT for XState)

---

## Next Steps

1. Create stickchat.specs.md from this architecture
2. Implement stickchat with OAuth, IndexedDB, state machine
3. Implement stickmake .vid compiler
4. Test end-to-end with surveyGuy movie
