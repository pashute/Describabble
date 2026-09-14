# Prompt: Stickable Player - Load & Play SurveyGuy Movie

`Filename: stickPlayer.prompt.md v0.1.2`

**Version:** 0.1.2  
**Target:** Gemini Canvas / HTML5 + Vanilla JS  
**Output:** Single-file interactive HTML5 web app for stick figure animation playback

---

## Mission

Build a **Stickable Player** web application that:
1. **Reads** describ files (`meta.gen.*.md`, `desc.surveyGuy.*.md`, `trans.surveyGuy.*.md`) and optional JSON data files
2. **Parses** using translation lexicons to extract playable parameters
3. **Renders** the SurveyGuy stick figure movie as an animated HTML5 Canvas scene
4. **Plays** with UI controls (play/pause, restart, scrubbing timeline slider)
5. **Supports** multiple stick figure movies in the future (parameterized, not hardcoded)

---

## Input Files to Parse

### Generic Metadata Files (meta.gen.*.md) - Reusable Rules
```
meta.gen.emotions.md                ← Emotion types in screenplay (generic)
meta.gen.stick.emotions.md          ← Stick figure emotion rendering (minimal smiley faces)
meta.gen.stick.movement.md          ← Stick figure movement and posture conventions
meta.gen.component.bridge.md        ← Generic bridge structure and types
meta.gen.stick.component.bridge.md  ← Stick figure bridge drawing rules
```

### Translation Lexicon Files (trans.surveyGuy.*.md) - Parameter Schemas
```
trans.surveyGuy.characters.md       ← Character field definitions with meta references
trans.surveyGuy.emotions.md         ← Emotion mappings to meta.gen.stick.emotions
trans.surveyGuy.locations.md        ← Location/POV field definitions and camera rules
trans.surveyGuy.dialogue.md         ← Dialogue field definitions and delivery specs
```

### SurveyGuy-Specific Descriptions (desc.surveyGuy.*.md) - Movie Content
```
desc.surveyGuy.characters.md        ← Survey Guy (bent tie), Worried Man (long face)
desc.surveyGuy.component.bridge.md  ← Bridge setup specific to this movie
desc.surveyGuy.locations.md         ← Scene location, POV definitions, camera rules
desc.surveyGuy.scene1.md            ← Full 0-53s timeline, segments, dialogue, actions
desc.surveyGuy.dialogue.map.md      ← Detailed dialogue mapping with timing
```

### Optional JSON Data Files (vidData/) - Pre-parsed Data
```
scenes.json             ← Timeline structure with segments, dialogue lines, POV switches
characters.json         ← Character states, animations, expressions over time
locations.json          ← POV definitions, camera rules, structure elements
```

---

## Parsing Strategy

### Phase 1: Load & Validate Metadata
1. Parse `meta.gen.*.md` files to establish **drawing rules**:
   - Stick figure anatomy (body parts, minimal details) from meta.gen.emotions
   - How to render emotions (smiley faces, simple mouth/eye shapes) from meta.gen.stick.emotions
   - Movement interpolation rules from meta.gen.stick.movement
   - Bridge structure components from meta.gen.stick.component.bridge

2. Parse `trans.surveyGuy.*.md` files to establish **field schemas**:
   - Recognize what fields exist in descriptions (e.g., "speaker", "startTime", "pov", "tone")
   - Map human-readable descriptions to parameters using trans schemas

### Phase 2: Parse Movie Descriptions
1. Read `desc.surveyGuy.*.md` files and extract structured data:
   - **Characters:** Name, role, appearance details, voice, mood arc, posture states (from desc.surveyGuy.characters.md)
   - **Locations:** POV definitions (camera position, angle, distance), subtitle positions (from desc.surveyGuy.locations.md)
   - **Scene Timeline:** Segments, dialogue lines with timing, action states, POV switches (from desc.surveyGuy.scene1.md)
   - **Dialogue:** Detailed timing and delivery specs (from desc.surveyGuy.dialogue.map.md)

2. If JSON files present: use them directly (vidData/scenes.json, characters.json, locations.json)

3. If JSON files missing: build JSON structure from markdown descriptions using `trans.surveyGuy.*.md` schema mappings

### Phase 3: Build Playable State Machine
1. Create timeline of **events** from scene1:
   - [0.0s] Scene starts, POV = Riverside, action = climbing
   - [0.0s - 4.0s] Narrator dialogue, Survey Guy climbing
   - [4.0s] POV switches to Bridge
   - [9.0s] Worried Man dialogue begins, POV = Bridge
   - [14.0s] POV switches to Riverside, Survey Guy responds
   - ... (continue through all segments)
   - [51.0s] POV switches to black, splash sound, scene ends

2. For each **character state** at time T:
   - Position, angle, limbs, facial expression
   - Which emotion/mood is active
   - Which dialogue/sound is playing
   - Interpolation toward next state

---

## Rendering Rules (from `.g.meta`)

### Stick Figure Drawing
**Basic Structure:**
- Head: Circle (radius ~20px)
- Torso: Line from head center down (~40px)
- Arms: Two lines extending left/right from torso (~40px each)
- Legs: Two lines extending down from torso bottom (~40px each)
- Hands/Feet: Small dots at line ends

**Distinctive Details (from surveyGuy descriptions):**
- Survey Guy: Short black hair line above head, bent tie draped on chest
- Worried Man: Elongated vertical oval head (longer face)

**Emotion Expressions (from emotions.g.meta):**
- Happy: Curved upward mouth, eyes as dots
- Sad: Curved downward mouth, optional tear
- Worried: Straight or wavy mouth, widened eyes
- Thinking: Curved mouth, eyes looking up or crossed
- Distressed: Mouth open (O shape), wide eyes
- Panting: Mouth open with radiating lines
- Neutral: Dash or dot for mouth

**Movement Interpolation (from movement.g.meta):**
- Climbing: Angle body upward, raise arms, bend legs
- Standing: Keep upright, adjust arms for balance
- Looking up/down: Tilt head, adjust eyes/mouth direction
- Gesturing: Raise arm(s) in direction of emphasis

### Bridge Structure Drawing (from bridge.g.meta)
**Canvas Elements:**
```
- Road deck:        Horizontal line (center)
- Fence top rail:   Horizontal line (above center)
- Fence poles:      Multiple short vertical lines (between rail and road)
- Catenary cable:   Curved arc (above rail)
- Hangers:          Vertical lines (cable to rail)
- River/ground:     Horizontal line (below)
```

### POV Rendering
**Riverside POV (looking up):**
- Frame: Bridge structure full, character above
- Subtitle: Bottom of screen
- Character size: Large (close perspective)

**Bridge POV (looking down):**
- Frame: Ground far below, minimal structure
- Subtitle: Top of screen
- Character size: Small (far perspective)

---

## Animation & Timing

### Frame Interpolation
1. Calculate state at time T by interpolating between key frames
2. For each character:
   - Interpolate position/angle toward next keyframe
   - Blend facial expression (timing depends on emotion)
   - Sync dialogue mouth animation with audio

### Dialogue Synchronization
1. Use Web Audio API or browser speech synthesis (as specified in audio.s.desc.md)
2. Sync mouth animation to speech timing (open mouth during dialogue)
3. Match emotion to tone (upset tone = distressed expression, reasoning = calm)

### POV Switching
1. At specified times, switch active POV (clean cut, no transition)
2. Hide character from previous POV, show character in new POV
3. Adjust subtitle position (top vs bottom)

---

## UI Controls

### Interactive Elements
1. **Play/Pause Button** - Toggle animation playback
2. **Restart Button** - Reset to 0.0s
3. **Timeline Slider** - Scrubbing position (shows current time)
4. **Live Timestamp Display** - Shows MM:SS or seconds elapsed

### Responsiveness
- Canvas responsive to window size (maintain 16:9 aspect if possible)
- Touch controls supported (swipe to scrub)

---

## Output Specification

### Single HTML File
- Pure HTML + Tailwind CSS (CDN)
- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Web Audio API for speech synthesis (browser built-in voices)

### File Structure
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Stickable Player - SurveyGuy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>/* Custom canvas styles */</style>
  </head>
  <body>
    <div id="player">
      <canvas id="canvas"></canvas>
      <div id="controls">
        <!-- Buttons, slider, timestamp -->
      </div>
      <div id="subtitle"><!-- Subtitle display --></div>
    </body>
    <script>
      // Load describ files (as JSON or embedded)
      // Parse using .trans schemas
      // Render animation on canvas
      // Control audio/speech synthesis
    </script>
  </html>
```

---

## Decision: Single-Stage vs Two-Stage Approach

### Option 1: Single-Stage (Recommended for MVP)
- **Player directly reads `.s.desc.md` and `.trans` files**
- Uses `.trans` parameter schemas to extract data
- Builds animation on-the-fly
- **Pros:** Simpler, fewer files, direct describ → animation
- **Cons:** Parsing logic embedded in player

### Option 2: Two-Stage (Future Modularity)
- **Stage 1 (stickTrans.prompt.md):** Translate `.s.desc.md` + `.trans` → `vidData/*.json`
- **Stage 2 (stickPlayer.prompt.md):** Read `vidData/*.json` → animate
- **Pros:** Describ → JSON pipeline reusable, player logic cleaner
- **Cons:** Extra preprocessing step, more files

**Recommendation:** Implement Option 1 (single-stage) for this MVP. Include vidData/ as optional reference/testing fallback.

---

## Testing Checklist

- [ ] Loads all `.g.meta` files without error
- [ ] Parses all `.s.desc.md` files correctly
- [ ] Extracts character states from descriptions
- [ ] Timeline builds with correct POV switches
- [ ] Canvas renders stick figures (both characters)
- [ ] Canvas draws bridge structure correctly
- [ ] Dialogue plays (speech synthesis or pre-recorded)
- [ ] Mouth animation syncs with speech
- [ ] POV switches at correct times (Riverside ↔ Bridge)
- [ ] Subtitle position changes with POV (top ↔ bottom)
- [ ] Play/Pause button works
- [ ] Restart button resets to 0.0s
- [ ] Timeline slider allows scrubbing
- [ ] Animation runs for full 53.0 seconds
- [ ] Splash sound plays at 51s, scene ends at 53s

---

## Future Extensions

1. **Load other movie describ files** (same player, different movie)
2. **Custom theme/colors** (override default black stick figures)
3. **Speed control** (play at 0.5x, 1x, 1.5x, 2x)
4. **Subtitles/translations** (support multiple languages)
5. **Export as video** (render canvas to WebM/MP4)

---

## Notes

- This prompt assumes describ files are embedded as JSON or fetched via fetch() API
- Speech synthesis uses browser built-in voices (system-dependent, acceptable for prototype)
- Canvas rendering is 2D (no 3D or complex effects needed for stick figures)
- All timing values are in seconds, matching swPrompt.md specification
