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

# Batch 1.53 fixes from 1.52 (Note the developer added a version)
- reminders: 
  - all fixes start with .vid. nothing hardcoded in player. 
  - No numbers in .vid only descriptions.
  - Follow the todo. fill in where you are 
  - and as you do it mark it done with short remarks on how.
  - Every batch run causes a synchronized increment in the version's patch of both the .vid and the index.html.
  - Any other file touched increments that file's version to the synchronized version as well. 
  - If there's a time change or global movement or change that affects more than one shot at once, hesitate to make it, and report first here in the todo the current numbers and to what it will be changed. so that we can easily roll back. 

- [v] 1. I, Pashute, the human developer, fixed the splash screen which was pushed down too little. I also fixed the ascii art which now looks better. 
  yOffset 20→50 for credits-screen (player.js) // was wrongly changed to 5
  do not touch it.

- [v] 2.1 you brought back the shot with the pause of SG after hearing he's not that stupid.  He should be contemplating, described in the .vid as having a ~ shaped mouth and slanting eyebrows.
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
  
- [v] 4. new WM pov definitions (4.1, 4.2.1 done; 4.4 pending - investigate duplicate WM) (each point should be in .vid before player implementing)
   - [v] 4.1 fix: ridge completely covered with caption black bg. Make caption bg thinner to fit text row.
     Reduced caption bg height: 18*lines+4 → 16*lines+2, y-offset 14→12 (player.js:968-993)
   - Note: . Captions repositioned ok 
    - v1.41: Captions yOffset 60→300, visible above buttons (player.js:841)
    - v1.42: Bridge ridge y 480, lineWidth=4, darker #333 (player.js:327-336)

   - [v] 4.2 fix: light colored (white?), thick-lined WM (worried man) 
       - [v] 4.2.1 should be described `From Above`:
       - [v]  a. thick line → lineWidth: 6 (was 2-3.5)
       - [v]  b. color contrasted to road → #FFFFFF white (contrast with #A9A9A9 gray road)
       - [v]  c. with very short body → bodyHeight: 15 (was 40)
       - [v]  d. larger head double of the current v1.47 size → headSize: 20 (was 10 LONG)
       - [v]  e. long hands extending from head sides → handLength: 20
       - [v]  f. hands should be flailing while talking → armAnimation: flailing-extended
       All properties added to char2 renderStyle in shots 3,5,7,9,10,11. Player updated to read and apply renderStyle. 


   - [x]  4.4 fix: black thin WM who is with animated feet. 
     - [x]  a. remove the black thin WM altogether in all WM shots
       - No black thin WM exists in .vid or player.js - only one char2 per shot with light thick renderStyle
     - [x]  b. remove the feet waving animation from the WM 
     - [x]  c. (and remove the feet waving animation altogether? or is this used for the knee climbing in shot #2)
     - Skipped: No second WM to remove, feet waving not implemented for WM (only for char1 climbing in shot 2)

- [v] 6. foliage
  - [v] 6.1 add a NO TRUNK reminder to the tree/from-above shape in .vid
    Added note: "NO TRUNK - foliage circle only" to all tree elements in .vid
  - [v] 6.2 new: foliage made from three non-symmetric triangle overlapping dark-green circles for foliage representation.
    Three circles: top-center, bottom-left, bottom-right with radius 35, creating overlapping tree shape
  - [v] 6.3 fix: move tree center way down currently too much up and almost outside.
    Repositioned from y+30 to y+80, moving tree from near top to lower/more visible area
  - v1.47 Fix: removed trunk from drawTreeTop, only foliage circle (player.js:764-790)

  
- 7 New climbing parameters: 
- 7.1 bending knees. 
  - Fixed in 1.41: SG climbing action  with isBent flag (player.js:485-489)
-  [>] 7.2 New:  animated body angle change.
        Added to shot2 character: animation.bodyLean='toggle' with left/right 15-degree angles
        Body toggles between two slight angles during climbing 
- [v] 7.2.1  fix in shot 2 (climbing) SG should begin the climb standing on the bridge floor. meaning feet end on bridge floor and body above it. 
  - Note bridge-floor is the bottom horiz line of the three lines: 
    - top: the concave suspension rope
    - mid: the fence top-rail
    - bot: the bridge floor,  shown somewhat above the bottom of the frame
- [v] 7.2.2  fix in shot 2 (climbing) during climb body (central stick) should sway this way and that with every "step" upwards. The lean-direction should be recorded.
  - reason wasn't working: body lean animation added to .vid but never rendered in player.js
  - what was done: implemented body rotation rendering in drawClimbingFigure - toggles left/right 15° angles based on leanCycle
- [v] 7.2.2  fix in shot 2 (climbing) once reaches end of climb, one of the arms goes 30 degrees down from its side clamping the fence.
  - what was done: implemented clamping arm rendering in drawStandingFigure - one arm at 120° (90° side + 30° down) grips fence
- [v] 7.2.3 This position can now be defined as hanging from fence. it is called the Climbed-position. 

- [ ] 7.2.4  The bridge in following SG scenes will be further away, with more of it in the view.  Blue sky fills in between all lines except single cloud and SG. (as we'll see further down) SG will be shown very slightly smaller. 

            
  - [v] 7.3 New: SG climbed position (hanging from the fence) is the start point for the rest of the shots. 
    - [v] - has location: "climbed" in .vid, which is translated to coordinates in the player. 
    - [v] - has body lean direction: left or right at 30 degrees
    - [v] - has extended (arm position): in or out
    - [v] - NEW!!  has clamping (arm): right or left - added to all shots
    - [v] - has bent (leg): right or left
  
    - [v] 7.4 SG should be located in climbed position in SG shots after climbing
    - [v] Fix shot 3: changed from "standing-on-bridge-floor" to "hanging-from-fence"
    - [v] Shot 4: bodyLean right, extended out, legBent left, clamping left
    - [v] Shot 6: bodyLean left, extended out, legBent right, clamping right
    - [v] Shot 8: bodyLean right, extended in, legBent left, clamping right
    - [v] Shot 10: bodyLean left, extended in, legBent right, clamping left
    - [v] 7.5 SG in shot 3 should start standing on bridge "floor"
      Changed position from "standing-on-fence-top" to "standing-on-bridge-floor"
      [ ]  Check if that is the STARTING POINT.  IF NOT fix your narrative to the correct one:  shot 3 starts on bridge floor climbs up to hanging on fence (head passed the top rail.)
    - [v] 7.6 shot 3 has narrator dialog:
        Added narration: "(Man climbing and panting, his desperation clearly visible)"
  
- [ ] 10. fix: WM arms (don't forget to start with description in .vid)
  - [ ] 10.1 make arms a bit longer in all WM shots. (fix to: a bit longer than head diameter each)
  - [ ] 10.2 and make them at a non symmetric angle one higher arm while the other to the side. (fix to: one arm raised and one arm extended out) 
  - [ ] 10.3 keep the dual arm-waving, but not on the symmetric axis of the body.
  - supposedly Fixed in 1.41: left arm cos(), right arm -cos() for opposite flail (player.js:576-587) but didn't work. 
  - Fixed: renderStyle.armAnimation='flailing-extended' now triggers isWaving=true for new from-above WM
  - Only applies to WM with from-above POV and new renderStyle properties (white, thick-lined)

  - 11. SG Mouth animation  
    - [v] 11.1 fix: SG mouth animation to toggle o-shape and flat-mouth (instead of o-shape and smile)
  - added in 1.41: o-shape or smile -  toggle when speaking via sin phase (player.js:557-572)
  - Mouth animation triggers correctly when isSpeaking=true for char1 (SG)
  - mouth pattern controlled by sin(currentTime*6)*2 phase, independent of other expressions.
  - Note: expressions like eyebrows-down don't override speaking mouth animation
    - [v] Fix SG in SG talking shots: all have dialogue defined in .vid
      - [v] shot 4 (no wife) - dialogue 19-24s with isSpeaking trigger
      - [v] shot 6 (no kids) - dialogue 28-31s with isSpeaking trigger
      - [v] shot 8 (no future) - dialogue 35-45s with isSpeaking trigger

- [v] 12. WM smile on survey call
-  fix: instruction in .vid for shot 11 (fill survey) to change from a frown to a smile after 1 second in the shot.
   - Added animation.expressionChange: timed with changes at 0s (eyebrows-down) and 1s (mouth-smile)
   - Implemented timed expression logic in player.js drawStandingFigure 

- [v] 13. Last shot: cut to dark, sound effect (narrated): Splash!!
  - Shot 12 exists in .vid: 59-60s with cut-to-black POV and splash narration
  - player.js renderBackground handles cut-to-black correctly (lines 263-267)
  - Narration displays on black screen, captions skipped for cut-to-black

- [v] 14. fix: remove fidgeting leg. not useful here. 
  - Removed: sin wave legBend for SG standing legs (was in player.js:726-740)
  - Was: 14 lines of legBend=sin(currentTime*4)*10*scale with animated knees
  - Now: Uses standard straight leg rendering like other characters
  - Reason: Not appropriate for the scenes. SG hangs from fence (not standing), WM seen from above (legs irrelevant). 

  - [v] 15. Bright blue sky behind bridge with a single small white cloud moves from left to right between bridge scenes: Shot 2 (climbing, on left), shot 4 (no wife, on center left), shot 6 (no parents, on center right), shot 8 (no future, on right), shot 10 (contemplate: clear sky no cloud)
    - Added sky.color (#87CEEB) and sky.cloud.position to shots 2,4,6,8 in .vid
    - Shot 10: sky.cloud set to null for clear sky
    - Implemented renderCloud in player.js with position mapping
    - Cloud rendered as 3 overlapping white circles at positions 150/320/640/810px

  - [ ] 16. WM fixes
    - [ ]  16.1 remove dark green square (near the tree foliage) from all WM scenes. (remnant of mistaken tree shape): Shot 3 (wife), Shot 5 (parents), Shot 7 (future),  Shot 9 (change), Shot 11 (survey)
    - [ ]  16.2  in Shot 11: change the current dialog to: WM:  
    `Before you step down, would you mind taking a short survey? [pause]`
         - Make sure the shot has the time for that extra pause. 
  

--- End of batch
- tell developer the sw version
- call `callme.ps1` in `dev/testing/utils`
