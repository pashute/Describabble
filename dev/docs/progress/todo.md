# AI's Todo Tracker

## Filename: todo.md v0.3

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. Don't forget the beeps, version report and callme. 

--- text may begin 2 lines below this line ---

## B.0141.1 Animation & Rendering Enhancements (v0.1.40→0.1.41)

# Batch 1.47 fixes
- reminders: 
  - all fixes start with .vid. nothing hardcoded in player. 
  - No numbers in .vid only descriptions.
  - Follow the todo. fill in where you are 
  - and as you do it mark it done with short remarks on how.
  - Every batch run causes a synchronized increment in the version's patch of both the .vid and the index.html.
  - Any other file touched increments that file's version to the synchronized version as well. 

- [v] 1. fix splash screen pushed down too little.
  yOffset 20→5 for credits-screen (player.js:910)

- [v] 2.1 bring back the shot with the pause of SG after hearing he's not that stupid.  He should be contemplating, described in the .vid as having a ~ shaped mouth and slanting eyebrows.
  Shot 10 added (51-53s) with mouth-tilde and eyebrows-slanting expressions to .vid, player.js renders both

- [v] 2.2 (next shot is back to WM who offers survey). In this one the mouth should change from line to smile. or just smile. As i remind you any requested change should start in the .vid and only then reflected in the player.
  Shot 11 modified (53-59s) with mouth-smile expression for WM, player.js renders it

- [v] 2.3 restore last shot: cut to dark and splash sound (narrated).
  Shot 12 added (59-60s) cut-to-black with splash narration restored

- [v] 3. new splash caption: add to splash screen caption (and read it): 
  - [v] 3.1 add a character in characters called Narrator. always backstage. deepest male voice.
    Added char3 (Narrator) with voice3 (Deep Narrator) configuration
  - [v] 3.2 add a dialog for this shot:  
    Shot1 narration updated to array with two items: "The Survey Guy" (0-1s) and "(Heavy traffic heard)" (2-3s with 1s pause)
    Updated renderNarration in player.js to handle array narration items and display captions for active items
  
- [ ] 4. new WM pov definitions (each point should be in .vid before player implementing)
   - [ ] 4.1 fix: ridge completely covered with caption black bg. Make caption bg thinner to fit text row.  
   - Note: . Captions repositioned ok 
    - v1.41: Captions yOffset 60→300, visible above buttons (player.js:841)
    - v1.42: Bridge ridge y 480, lineWidth=4, darker #333 (player.js:327-336)

   - [ ] 4.2 fix: light colored (white?), thick-lined WM (worried man) 
       - [ ] 4.2.1 should be described `From Above`:
       - [ ]  a. thick line 
       - [ ]  b. color contrasted to road. 
           - (list here in todo the contrast color)
       - [ ]  c. with very short body
       - [ ]  d. larger head double of the current v1.47 size. 
           - (list here in todo the old and new size)
       - [ ]  e. long hands extending from head sides. 
            - each hand the length of the diameter of the head. 
            - change from current definition: list here the change
       - [ ]  f. hands should be flailing while talking. 
           - no need for elbows. 
           - should not move symmetricly.
           - current is static.
          - probably because there's another WM (black thin and small) in shots. 


   - [ ]  4.4 fix: black thin WM who is with animated feet. 
     - [ ]  a. remove the black thin WM altogether in all WM shots
       - list here which shots the black thin was removed 
       - for each shot list also a verification that the light thick one
     - [ ]  b. remove the feet waving animation from the WM 
     - [ ]  c. (and remove the feet waving animation altogether? or is this used for the knee climbing in shot #2)

- [v] 6. foliage
  - [v] 6.1 add a NO TRUNK reminder to the tree/from-above shape in .vid
    Added note: "NO TRUNK - foliage circle only" to all tree elements in .vid
  - [ ] 6.2 new: foliage made from three non-symmetric triangle overlapping dark-green circles for foliage representation. 
  - [ ] 6.3 fix: move tree center way down currently too much up and almost outside. 
  - v1.47 Fix: removed trunk from drawTreeTop, only foliage circle (player.js:730-736)

  
- 7

- New bending knees. 
  - Fixed in 1.41: SG climbing action  with isBent flag (player.js:485-489)
  - [ ] New: SG climbed position - needed for setting location, angle, arms and legs in SG shots, after the climbing shot (shot #2, one after the titles)
  
- [ ] 10. fix: WM dual arm-waving
  - supposedly Fixed in 1.41: left arm cos(), right arm -cos() for opposite flail (player.js:576-587)
  - problem is there are multiple WM's in some of the shots. must work only with new From.Above light colored thick and larger WM

- [ ] 11. fix: SG mouth animation
  - Fixed in 1.41: o/_/- toggle when speaking via sin phase (player.js:557-572)
  - mouth animates in some cases to smile and dash instead of from o/middle/- when SG speaks (shots 4,6,9)?

- [ ] 12. explain why you made SG leg animation, and if it is not part of climb, remove
  - Added in 1.41: sin wave legBend for SG standing legs (player.js:621-643)
  

--- End of batch
- tell developer the sw version
- call `callme.ps1` in `dev/testing/utils`
