# stickchat Specifications

`Filename: stickchat.specs.md v0.1.7`

**See [describ.md](../describ.md) for file formats, parameters (head size, emotions, posture), and rendering mappings.**

## Overview

Browser-based natural language editor for creating stick-figure movie content. Outputs describ markdown files. Fully local-first with IndexedDB persistence and offline asset caching.

---

## User Authentication

### OAuth Flow
1. User visits stickchat (localhost:3001)
2. "Login" button → OAuth provider (configured in .env)
3. User authenticates
4. Store session token in IndexedDB
5. Populate user profile (name, email, avatar)
6. Redirect to project dashboard

### Logout
- "Logout" button → Clear session token, IndexedDB session data
- Redirect to login screen

---

## Project & Screenplay Management

### Load Project
1. Show list of saved projects (from IndexedDB)
2. User selects project
3. Load: scenes, shots, describ files
4. Initialize state machine to DRAFTING phase
5. Show screenplay structure

### Create New Project
1. Form: Project name, default movie type (stick)
2. Create IndexedDB entries for: project, scenes, shots
3. Save empty describ template files
4. Initialize to DRAFTING phase

---

## Scene & Shot Navigation

### Sidebar Shot Grid
- Display all shots for current scene in grid/list
- Each box shows: shot name/number + text summary (first 100 chars)
- Click shot box → Load that shot into main editor
- Add/delete/reorder buttons on each box

### Current Scene Selector
- Dropdown or breadcrumb showing: Project → Scene 1 → Current Shot
- Advance to next scene button (if current scene complete)
- Cannot go back (forward-only to enforce ordering)

---

## Main Chat Interface

### Layout
```
┌─ stickchat v0.1.7 ────────────────────┬────── Sidebar ──────┐
│                                       │ [Shot 1] [+] [-]    │
│ [Project Name] → Scene 1 → Shot 5    │ [Shot 2]            │
│                                       │ [Shot 3]            │
│ ┌─ Current Shot Editor ──────────┐   │ [Shot 4]            │
│ │ Chat message area              │   │ [Shot 5] ← Active   │
│ │ (conversation history)         │   │ [+] Add New         │
│ │                                │   │                     │
│ │ [Input field.....................] │                     │
│ │ [Send] [Save] [Clear]          │   │                     │
│ └────────────────────────────────┘   │                     │
│                                       └─────────────────────┘
└───────────────────────────────────────────────────────────────┘
```

### Chat Area
- Conversation history (user → AI → user feedback loop)
- Input field for natural language editing instructions
- "Send" button: Process user input, update shot content
- "Save" button: Persist to IndexedDB
- "Clear" button: Undo unsaved changes

---

## Editing Types

### For Each Shot, User Can Create/Edit:

#### 1. Characters
- **Input:** "Survey Guy is a middle-aged man with a bent tie, looks worried"
- **Output:** desc.movie.characters.md

#### 2. Stage (Components)
- **Input:** "There's a suspension bridge with cables and hangers"
- **Output:** desc.movie.component.bridge.md (or other components)

#### 3. Dialogue
- **Input:** "Survey Guy says at 5 seconds: 'I can't go through with this'"
- **Output:** desc.movie.dialogue.map.md

#### 4. Locations
- **Input:** "Camera is on the riverbank looking up at the bridge"
- **Output:** desc.movie.locations.md

#### 5. Emotions
- **Input:** "Survey Guy looks increasingly worried and distressed"
- **Output:** trans.movie.emotions.md

#### 6. Audio
- **Input:** "Traffic sound fades in at 0s, splash at 51s"
- **Output:** desc.movie.audio.s.desc.md

#### 7. Background
- **Input:** "Daytime, overcast, suburban area, bridge isolated"
- **Output:** desc.movie.bg.s.desc.md

**See [describ.md](../describ.md)** for detailed parameter schemas, emotion mappings, and rendering rules.

---

## State Machine (XState)

### Phases

```
DRAFTING
  ↓ (user requests AI review)
BRANCHING_OPTIONS
  ↓ (user selects option)
CONSOLIDATING
  ↓ (user approves final version)
COMPILING
  ↓ (send to stickmake)
READY_TO_RENDER
  ↓ (ready for stickvid player)
[DONE]
```

### Phase Behaviors

**DRAFTING**
- User can edit any field
- Chat interface active
- "Request Review" button → Move to BRANCHING_OPTIONS
- Save shots to IndexedDB continuously

**BRANCHING_OPTIONS**
- AI provides alternative versions or corrections
- User selects preferred option
- "Approve Option" → Move to CONSOLIDATING
- Can go back to DRAFTING if unsatisfied

**CONSOLIDATING**
- Final review of complete shot
- Cannot edit directly (must go back to DRAFTING)
- "Lock & Continue" → Move to COMPILING
- "Return to Draft" → Back to DRAFTING

**COMPILING**
- Send all describ files to stickmake /api/translate
- Show progress spinner
- Wait for .vid generation
- On success: Move to READY_TO_RENDER

**READY_TO_RENDER**
- Display generated .vid file
- "Download .vid" button
- "Open in Player" button (passes .vid to stickvid localhost:3003)
- Can start new project

### Guardrails

Cannot transition forward if:
- Required fields missing (checked per editing type)
- Scene incomplete (not all shots done)
- Character references invalid
- Timing conflicts exist
- POV switches inconsistent

---

## IndexedDB Schema

### Collections

**projects**
- `id`: UUID
- `name`: String
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `status`: DRAFTING | BRANCHING | CONSOLIDATING | COMPILING | READY

**scenes**
- `id`: UUID
- `projectId`: UUID (foreign key)
- `sceneNumber`: Number
- `shots`: Array of shot IDs
- `status`: Complete | InProgress

**shots**
- `id`: UUID
- `sceneId`: UUID (foreign key)
- `shotNumber`: Number
- `characters`: Array of character definitions
- `stage`: Array of stage/component definitions
- `dialogue`: Array of dialogue objects {speaker, time, text, tone}
- `locations`: Array of location/POV objects
- `emotions`: Array of emotion objects {character, emotion, timing}
- `audio`: Array of audio objects {type, timing, volume}
- `background`: String (description)
- `status`: DRAFTING | BRANCHING | CONSOLIDATING | COMPILING | READY

**assets** (cached from CDN)
- `id`: String (e.g., "meta.stick.emotions")
- `content`: String (markdown content)
- `fetchedAt`: Timestamp
- `expiresAt`: Timestamp (for cache invalidation)

---

## Asset Integration

### On App Start (via stickSetup.js)
1. Check IndexedDB for cached assets
2. If not cached or expired:
   - Fetch from pashute.describ// CDN:
     - `meta.stick.*` - Genre-specific rendering rules
     - `trans.stick.*` - Mapping schemas
     - `desc.gen.*` - Generic descriptions
3. Store in IndexedDB
4. Provide global `Assets` accessor

### In Chat
- Reference asset content when building descriptions
- Example: "Stick emotions available: happy, sad, worried, distressed" (from `meta.stick.emotions`)
- Map user input to asset parameters

---

## Output: Describ Files

When shot is locked, generate markdown files:

- `desc.movie.characters.md` - All characters with full definitions
- `desc.movie.scene1.md` - Scene 1 with all shots, dialogue, timing
- `desc.movie.locations.md` - All POV/camera definitions
- `desc.movie.dialogue.map.md` - Complete dialogue timeline
- `trans.movie.emotions.md` - Emotion mappings for this movie
- `desc.movie.component.bridge.md` - Stage/component definitions
- `desc.movie.audio.s.desc.md` - Audio specification
- `desc.movie.bg.s.desc.md` - Background/mood description

---

## Integration with stickmake

### Send to Backend
1. User clicks "Compile" → COMPILING state
2. POST to `http://localhost:3002/api/translate` with:
   - All describ markdown content (as JSON payload)
   - Movie name, version, metadata
3. Wait for response (timeout: 30s)
4. On success: Receive .vid YAML file
5. Save .vid to IndexedDB
6. Move to READY_TO_RENDER

### Error Handling
- stickmake validation failure: Return to CONSOLIDATING, show error
- Network error: Retry or save draft, alert user
- Timeout: Auto-retry 3 times, then fail

---

## UI Styling

### Design Principles
- Clean, minimal interface
- Focus on text/content, not graphics
- Keyboard-friendly navigation
- Responsive (works at 100% zoom)
- Dark/light theme toggle (prefers-color-scheme)

### Components
- Consistent button styling (green for approve, red for delete, blue for action)
- Sidebar fixed, main area scrollable
- Chat messages: user (right, blue), AI (left, gray)
- Form inputs: clear labels, validation feedback
- Status indicators: colored dots (green=ready, yellow=pending, red=error)

---

## Testing Checklist (Theoretical Only)

- [ ] OAuth login/logout flow works
- [ ] Project creation and load works
- [ ] Scene/shot navigation works
- [ ] All 7 editing types capture input correctly
- [ ] State machine prevents illegal transitions
- [ ] IndexedDB persists data across sessions
- [ ] Asset caching loads on app start
- [ ] Describ files are generated correctly
- [ ] stickmake integration sends/receives .vid
- [ ] .vid can be downloaded
- [ ] .vid opens in stickvid player
- [ ] Offline mode works with cached assets

---

## Non-Requirements (Keep it Simple)

- No real-time collaboration (single user per project)
- No AI-generated content (user provides all text)
- No animation preview (stickvid handles that)
- No audio playback (text only)
- No file upload (markdown only)
- No version control (single latest draft)

