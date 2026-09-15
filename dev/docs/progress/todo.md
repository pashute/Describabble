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

- [ ] 1. fix splash screen pushed down too little.
  First 2.5 lines of ascii art header are hidden behind the Load button row. 

- [ ] 2.1 bring back the shot with the pause of SG after hearing he's not that stupid.  He should be contemplating, described in the .vid as having a ~ shaped mouth and slanting eyebrows. 
- [ ] 2.2 (next shot is back to WM who offers survey). In this one the mouth should change from line to smile. or just smile. As i remind you any requested change should start in the .vid and only then reflected in the player. 

- [ ] 2.3 restore last shot: cut to dark and splash sound (narrated).
  - is it in the .vid just for some reason preliminarily ending. 
  - or was it removed from the .vid file by you by mistake?

- [ ] 3. new splash caption: add to splash screen caption (and read it): 
  in Narrator's voice: with a new Dialog text from the narrator: 
  there should be a pause betweeen The Survey Guy and (heavy traffic heard)
  `The Survey Guy (...Heavy traffic heard)`
  - in 1.46 or so, you added to shot1 text1 in .vid (surveyGuy.vid:187-188)
  - But shouldn't be part of the Title screen text. Only the narrator's voice and part of the caption!!  Currently this text is not showing up ANYWHERE. 

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

- [ ] 6. foliage
  - [ ] 6.1 add a NO TRUNK reminder to the tree/from-above shape in .vid
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
