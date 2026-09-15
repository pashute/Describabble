# AI's Todo Tracker

## Filename: todo.md v0.3

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. Don't forget the beeps, version report and callme. 

--- text may begin 2 lines below this line ---


# Task 0 - surveyGuy v0.1.9: Standardize .vid + Fix Animation + Align Describ

## T0.1 Standardize surveyGuy.vid to clean YAML format (v0.1.9)
- [v] Read current .vid file (surveyGuy.vid v0.1.4)
- [v] Create proper YAML schema: movie metadata, scenes, shots, characters, locations, dialogue, audio
- [v] Extract all data from current file into structured format
- [v] Ensure human-readable (comments, clear nesting)
- [v] Validate against describ.md structure

## T0.2 Fix stickvid player to animate correctly
- [v] Read current stickvid player code (v0.1.8)
- [v] Implement hand/leg movement (climbing animation for shot 2)
- [v] Implement camera POV switching (from.Below, from.Bridge)
- [v] Parse and render stick figures from .vid data
- [v] Rewrite player.js v0.1.9 to read YAML .vid format

## T0.3 Align describ files with describ.md spec
- [v] Review describ.md for file naming/structure requirements
- [v] Rename describ files to match spec (.meta., .desc., .trans. patterns)
- [v] Remove duplicate meta.gen.* files
- [v] Update surveyGuy.vid to reference new file names

## T0.4 Ensure backwards compatibility with stickmake
- [v] Rewrite stickmake v0.1.9 to generate standardized YAML .vid format
- [v] Implement manifest generation from describ data
- [v] Add validation endpoint for .vid compliance
- [v] Update to use js-yaml for proper YAML handling

---

# Batch Sept15 - Stick Project: Documentation & stickchat Implementation

## B.Sept15.1 Documentation Foundation - Consolidate stickTech

- [v] Review stickchat README vs stickTech.md for gaps
- [v] Add missing items from README to stickTech.md (OAuth, IndexedDB, editing types, asset caching, setup)
- [v] Rewrite stickTech.md: complete, consistent, ordered, nothing missing
- [v] Fix naming: .gen.* (all movies), .stick.* (stick genre) - NO .gen.stick (oxymoron)
- [v] Document asset naming: meta.*, trans.* patterns
- [v] Document pashute.describ// CDN URL pattern
- [v] Version: stickTech.md v0.1.7

## B.Sept15.2 Create stickchat.specs.md from stickTech

- [v] Extract stickchat requirements from stickTech.md
- [v] Document UI structure: OAuth → screenplay → scene/shot selection → editing
- [v] Document sidebar with unit boxes (character, stage, dialogue, location, emotion, audio)
- [v] Document state machine phases (DRAFTING, BRANCHING_OPTIONS, CONSOLIDATING, COMPILING, READY_TO_RENDER)
- [v] Document IndexedDB schema
- [v] Document asset integration
- [v] Save as dev/docs/plans/stick/stickchat.specs.md v0.1.7

## B.Sept15.3 Create stickSetup Infrastructure

- [v] Create src/stickSetup/ folder
- [v] Create stickSetup.js v0.1.7: IndexedDB schema init + CDN asset caching
- [v] Fetch assets from pashute.describ// on startup
- [v] Cache locally for offline use
- [v] Add error handling for missing/corrupt cache

## B.Sept15.4 Update stickchat Setup & README

- [v] Update src/stickchat/README.md v0.1.7: add setup instructions
- [v] Reference stickTech.md for full spec
- [v] Document npm run dev: auto-runs stickSetup on startup
- [v] Document how IndexedDB initializes on first load

## B.Sept15.5 CRITICAL REVIEW - Stop if Issues

- [v] Review stickchat.specs.md theoretically (no testing)
- [v] Verify it matches stickTech.md
- [v] Check for contradictions, missing pieces, feasibility
- [v] No issues found - proceed to implementation

## B.Sept15.6 Implementation - stickchat v0.1.7

- [v] Implement stickchat OAuth login/logout (placeholder)
- [v] Create IndexedDB schema and storage
- [v] Build chat interface with screenplay loading
- [v] Implement scene/shot sidebar with editing
- [v] Add character, stage, dialogue, location, emotion, audio editors
- [v] Implement state machine (XState)
- [v] Output describ markdown files (endpoint)
- [v] Version: stickchat v0.1.7

---

## Batch Status
- Plan created based on stickTech.md
- Ready for execution with beeps and version reports
- Test case: surveyGuy movie (real data, no mocks)
- End goal: Functional stickchat + stickmake pipeline

--- End of batch

---

# Batch v0.1.40-0.1.41 - Animation & Rendering Fixes

## B.0140.1 Player Baseline & Environment Support (v0.1.39→0.1.40)
- [v] Captions already in .vid (shots 3,5,7), player reads dialogue
- [v] WM position: x 440→520 (out of river onto road, player.js:482)
- [v] WM styling: white #FFFFFF, 3.5x lineWidth (player.js:505-507)
- [v] SG position: verified location:"continued" in .vid (surveyGuy.vid all shots)
- [v] Cut-to-black narration: skip text render, keep audio speak() (player.js:775-796)

## B.0141.1 Animation & Rendering Enhancements (v0.1.40→0.1.41)
- [v] Captions repositioned: yOffset 60→300, visible above buttons (player.js:841)
- [v] SG climbed-position: bent knees (isBent flag, charData.position), knees at 15px (player.js:485-489)
- [v] Tree repositioned: x=820, y=80, larger radius=35 circle, right upper corner (player.js:349, 706-709)
- [v] WM dual arm-waving: left arm cos(), right arm -cos() for opposite flail (player.js:576-587)
- [v] Bridge ridge visibility: y 500→460, thicker lineWidth=3, darker #666 (player.js:326-347)
- [v] SG mouth animation: o/_/- toggle when speaking via sin phase (player.js:557-572)
- [v] SG leg animation: bent knees with sin wave legBend motion for all standing (player.js:621-643)

--- End of batch
- tell developer the sw version
- call `callme.ps1` in `dev/testing/utils`
