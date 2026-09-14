# AI's Todo Tracker

## Filename: todo.md v0.3

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. Don't forget the beeps, version report and callme. 

--- text may begin 2 lines below this line ---


# Batch Sept15 - Stick Project: Documentation & stickchat Implementation

## B.Sept15.1 Documentation Foundation - Consolidate stickTech

- [>] Review stickchat README vs stickTech.md for gaps
- [ ] Add missing items from README to stickTech.md (OAuth, IndexedDB, editing types, asset caching, setup)
- [ ] Rewrite stickTech.md: complete, consistent, ordered, nothing missing
- [ ] Fix naming: .gen.* (all movies), .stick.* (stick genre) - NO .gen.stick (oxymoron)
- [ ] Document asset naming: desc.gen.*, meta.*, trans.* patterns
- [ ] Document pashute.describ// CDN URL pattern
- [ ] Version: stickTech.md v0.1.7

## B.Sept15.2 Create stickchat.specs.md from stickTech

- [ ] Extract stickchat requirements from stickTech.md
- [ ] Document UI structure: OAuth → screenplay → scene/shot selection → editing
- [ ] Document sidebar with unit boxes (character, stage, dialogue, location, emotion, audio)
- [ ] Document state machine phases (DRAFTING, BRANCHING_OPTIONS, CONSOLIDATING, COMPILING, READY_TO_RENDER)
- [ ] Document IndexedDB schema
- [ ] Document asset integration
- [ ] Save as dev/docs/plans/stick/stickchat.specs.md v0.1.7

## B.Sept15.3 Create stickSetup Infrastructure

- [ ] Create src/stickSetup/ folder
- [ ] Create stickSetup.js v0.1.7: IndexedDB schema init + CDN asset caching
- [ ] Fetch assets from pashute.describ// on startup
- [ ] Cache locally for offline use
- [ ] Add error handling for missing/corrupt cache

## B.Sept15.4 Update stickchat Setup & README

- [ ] Update src/stickchat/README.md v0.1.7: add setup instructions
- [ ] Reference stickTech.md for full spec
- [ ] Document npm run dev: auto-runs stickSetup on startup
- [ ] Document how IndexedDB initializes on first load

## B.Sept15.5 CRITICAL REVIEW - Stop if Issues

- [ ] Review stickchat.specs.md theoretically (no testing)
- [ ] Verify it matches stickTech.md
- [ ] Check for contradictions, missing pieces, feasibility
- [ ] [?] CALLME if issues found - need user approval before proceeding

## B.Sept15.6 Implementation - Proceed if Approved

- [ ] Implement stickchat OAuth login/logout
- [ ] Create IndexedDB schema and storage
- [ ] Build chat interface with screenplay loading
- [ ] Implement scene/shot sidebar with editing
- [ ] Add character, stage, dialogue, location, emotion, audio editors
- [ ] Implement state machine (XState)
- [ ] Output describ markdown files
- [ ] Version: stickchat v0.1.7

---

## Batch Status
- Plan created based on stickTech.md
- Ready for execution with beeps and version reports
- Test case: surveyGuy movie (real data, no mocks)
- End goal: Functional stickchat + stickmake pipeline

--- End of batch
- tell developer the sw version
- call `callme.ps1` in `dev/testing/utils`
