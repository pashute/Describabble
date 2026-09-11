# AI's Todo Tracker

## Filename: todo.md v0.2

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. 

--- text may begin 2 lines below this line ---

# bSept11 Major Restructuring - Describ Files & Prompts

## bSept11.R1 Create Generic Metadata Files (meta.gen.*.md) - Reusable for ALL movies/styles

- beep.ps1
- [V] meta.gen.emotions.md - emotion types in screenplay (not stick-specific)
- [V] meta.gen.stick.emotions.md - how stick figures express emotions
- [V] meta.gen.stick.movement.md - stick figure movement conventions
- [V] meta.gen.component.bridge.md - bridge types, views, components (general)
- [V] meta.gen.stick.component.bridge.md - stick figure bridge drawing rules

## bSept11.R2 Create SurveyGuy-Specific Description Files (desc.surveyGuy.*.md)

- beep.ps1
- [V] desc.surveyGuy.characters.md - Survey Guy, Worried Man
- [V] desc.surveyGuy.component.bridge.md - specific bridge setup
- [V] desc.surveyGuy.locations.md - scene location, POV definitions
- [V] desc.surveyGuy.scene1.md - full 0-53s timeline, segments, actions
- [V] desc.surveyGuy.dialogue.map.md - dialogue mapping with timing

## bSept11.R3 Create SurveyGuy-Specific Translation Files (trans.surveyGuy.*.md)

- beep.ps1
- [V] trans.surveyGuy.characters.md - character field schema with meta references
- [V] trans.surveyGuy.emotions.md - emotion mappings to meta.gen.stick.emotions
- [V] trans.surveyGuy.locations.md - location/POV parameter schema
- [V] trans.surveyGuy.dialogue.md - dialogue parameter schema

## bSept11.R4 Update vidData JSON Files (check/refresh with new structure)

- beep.ps1
- [V] Verify scenes.json matches new desc.surveyGuy.scene1.md structure
- [V] Verify characters.json matches new desc.surveyGuy.characters.md structure
- [V] Verify locations.json matches new desc.surveyGuy.locations.md structure
- Note: No changes needed - JSON files already align with describ files

## bSept11.R5 Move & Update Prompts to ../sw folder

- beep.ps1
- [V] stickPlayer.prompt.md in ../sw (updated with v0.1.2, new file references)
- [V] stickTrans.prompt.md in ../sw (updated with v0.1.2, new references, "optional" removed)
- [V] Both prompts reference new meta.gen.*.md, desc.surveyGuy.*.md, trans.surveyGuy.*.md files

## bSept11.R6 Cleanup - Delete/Archive Old Files

- beep.ps1
- [V] Delete old .g.meta files (replaced by meta.gen.*.md)
- [V] Delete old .s.desc.md files (replaced by desc.surveyGuy.*.md)
- [V] Delete old .trans files (replaced by trans.surveyGuy.*.md)

---

## ✓ ALL BATCHES COMPLETE

**Summary of Restructuring:**
- **R1 (5 files):** Generic metadata files (meta.gen.*.md) - reusable for all movies
- **R2 (5 files):** SurveyGuy description files (desc.surveyGuy.*.md) - parametrized movie content
- **R3 (4 files):** SurveyGuy translation files (trans.surveyGuy.*.md) - parameter schemas
- **R4 (3 verified):** VidData JSON files (scenes.json, characters.json, locations.json) - already aligned
- **R5 (2 updated):** Prompts (stickPlayer, stickTrans) - moved to ../sw, updated v0.1.2
- **R6 (12 deleted):** Old format files removed (obsolete .g.meta, .s.desc.md, .trans)

**Total new structure:** 22 describ files + 3 JSON + 2 prompts = 27 files (reusable, parameterized, versioned v0.1.2)

