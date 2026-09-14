# stickchat v0.1.7

Natural language editor for creating stick-figure movie content. Outputs describ markdown files for compilation into .vid manifests.

**Full specification:** See [stickTech.md](../docs/plans/stick/stickTech.md) and [stickchat.specs.md](../docs/plans/stick/stickchat.specs.md)

---

## Quick Start

### Setup (Automatic on first run)

```bash
npm install
npm run dev
```

On startup, `stickSetup.js` automatically:
1. Creates IndexedDB database schema
2. Fetches assets from pashute.describ// CDN
3. Caches assets locally for offline use
4. Initializes global `Assets` accessor

Check console logs for cache status.

### Usage

1. Open http://localhost:3001 in browser
2. **OAuth Login** - Authenticate with configured provider
3. **Load/Create Project** - Select screenplay or create new
4. **Select Scene/Shot** - Choose current unit to edit
5. **Edit in Chat** - Describe characters, dialogue, emotions, locations, audio
6. **Save** - IndexedDB persists automatically
7. **Compile** - Send to stickmake to generate .vid
8. **Download** - Get .vid file or open in stickvid player

---

## Architecture

- **Frontend:** React + IndexedDB (local-first persistence)
- **Storage:** Browser IndexedDB (projects, scenes, shots, assets)
- **Assets:** Fetched from pashute.describ// CDN, cached locally
- **Setup:** `src/stickSetup/stickSetup.js` initializes on startup
- **Backend Integration:** POST to stickmake `/api/translate` endpoint
- **Output:** Describ markdown files + .vid YAML manifest

---

## State Machine (XState)

Strict phases prevent invalid edits:

1. **DRAFTING** - Edit content, request AI review
2. **BRANCHING_OPTIONS** - AI provides alternatives
3. **CONSOLIDATING** - Final approval
4. **COMPILING** - Send to stickmake
5. **READY_TO_RENDER** - Download .vid or play in stickvid

---

## Editing Types

For each shot, create/edit:

- **Characters** - Names, ages, appearances, emotions
- **Stage** - Components (bridges, props)
- **Dialogue** - Speaker, timing, tone, text
- **Locations** - Camera POV, position, angle
- **Emotions** - Character mood, expressions
- **Audio** - Sounds, music, timing
- **Background** - Scene description, atmosphere

---

## Environment Variables

Create `.env` in `src/`:

```
VITE_OAUTH_CLIENT_ID=your_oauth_client_id
VITE_OAUTH_REDIRECT_URI=http://localhost:3001/callback
```

Optional (for AI features in stickmake):
```
GEMINI_API_KEY=your_gemini_api_key
```

---

## Asset Caching

Assets are fetched from `pashute.describ//` CDN and cached locally:

- **First load:** Downloads assets (requires internet)
- **Subsequent loads:** Uses local cache (works offline)
- **Manual refresh:** Clear cache and re-fetch via Assets.refresh()

Available asset types:
- `meta.stick.*` - Genre-specific rules
- `trans.stick.*` - Mapping schemas
- `desc.gen.*` - Generic descriptions

---

## Integration with stickmake

When user completes shot and clicks "Compile":

1. POST to `http://localhost:3002/api/translate`
2. Send all describ markdown files
3. Receive generated `.vid` YAML manifest
4. Save .vid to IndexedDB
5. Ready to download or play in stickvid

---

## Requirements

- Node.js 16+
- Modern browser (IndexedDB support)
- OAuth provider configured
- stickmake backend running on localhost:3002 (for compilation)
- Internet for first asset cache load (optional: pre-seed assets)

---

## Testing

Full specification in [stickchat.specs.md](../docs/plans/stick/stickchat.specs.md) - review theoretically before implementation.

---

## License

Unlicense (Free and Open Source)
