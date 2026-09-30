# AI's Todo Tracker

## Filename: todo.md v0.3

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. Don't forget the beeps, version report and callme. 

--- text may begin 2 lines below this line ---

# fix 0.1.57

- beep.ps1 in dev/testing/utils
- [v] 1. fix shot 1 narration to be a dialog:

- [v] 1.1  start with surveyGuy.vid in dev/testing/movies/surveyGuy/
- 1.1 Do not change the Texts written on the screen html overlay
- a. do not change The ascii art banner
- b. do not change The credits
- c. do not change The bridge image

- [v] 1.2 Change the narration and caption to become the shot's Dialog:
- 1.2.1 Narrator intro: "The Survey Guy - a generated movie with a happy ending"
- 1.2.2 Narrator description: "(Heavy traffic heard, honking, radio blaring unrecognized music)"
- 1.2.3 Removed narration section, converted to dialogue structure

- [v] 1.3 In player.js Implement the two dialog texts as voice. 
- 1.3.1 renderDialogue called for shot 1, handles voice generation
- 1.3.2 Billboard overlay hides canvas text, voice plays via speak()

- [ ] 2. remove duplicate texts and instead point to the parsed dialog lines of text.  give enough time for each text to be heard. 
- [ ] 3. The shot length should be adjusted so we hear the dialog when done. 
- [ ] 4, fix all shots like this, tell me when done. 
- [v] 5. set version number to 0.1.65 in .html, .vid and player.
- User testing: shot 1 and 2 needed



