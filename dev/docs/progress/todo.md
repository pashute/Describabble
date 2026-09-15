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


# Batch sept14 1824

Reminders: 
- Only .vid first, never hardcoded player code.
- Player must read and implement the instructions and information from the .vid file.
- .vid contains only descriptions not numbers.
- AI should follow the todo and mark done w/ notes.
- AI should update the version patch once per batch 
- AI will not test or write test code. Only the developer. 
- No commit before code tested. Therefore AI should remind developer 
to test and find out how things went. 
- SG - Survey guy. a character in our funny The Survey Guy movie.
- WM - Worried man. the second character in our The Survey Guy movie.
- .vid - the .vid file is in dev/testing/movies/surveyGuy.vid
- player - the software under src/stickvid/ mainly player.js and server.js


## bSept14.shot1 (titles)

- [>] Shot 1: Add bridge 'stick image' left of text2 (height of 8 lines)
- beep.ps1


## bSept14.shot2 (climbing)

- shot2 is where we first meet SG the Survey Guy who is jumping

- [ ] Add darker squares at bottom (grass/river/road, see shot 3)
- [ ] Add cloud:  far left
- [ ] Fix SG face with own fill color (prevent sky color fill)
- [ ] Fix caption + TTS narration from Narrator dialog
      `(Man climbing, panting, clearly distressed.)`


### Shot2 climb

- [ ] Thicken bridge floor 5x (shots 1,3,5,7,9)
- [ ] Fix SG climb start - feet on bridge floor
- [ ] Arrange "Climbed-Position" formerly all wrong:
        - climb-start: feet on bridge road. 
        - climb-end: head fully above fence top-rail.
        - body-sway: right/left (15 degree body tilt)
        - knee-bend: right/left leg
        - clamp-arm: right/left arm (clamping fence rail)
- [ ] Fix climb animation to sway while bending knee and arms
- [ ] Give shot #2 the time to end climb
- [ ] On climb end:
  - [ ] Clamp animation: 
      - Lower arm Climbed-Position.clamp-arm
      - Left: 130 degrees, or Right: 150 degrees.
- beep.ps1

## bSept14.shot3 (family)

- WM is the Worried Man character under the bridge looking up
and preventing the Survey Guy from Jumping.
- Shot 3 is the first time we meet WM, always seen from the bridge, 
  looking up at the camera, with POV.From.Above

### Fix family dialog

- [ ] Fix caption and [ ] TTS narration, listed as the shot's dialog: 
  - Two lines of text. WM:
  - `(Shouts) Think about your wife!`
  - `Think about your children!`
  - Was replaced by mistake with caption from shot2


### Fix shot3 WM according to POV

- [ ] WM description and implementation: 
  - [ ] Double WM size (except line thickness)
  - [ ] Fix WM short feet to form a sharp angle,
        - looking like a standing person from above.
        - current wide angle looks like a baby squatting.
  - [ ] Fix WM eyes/mouth (upper head, looking up straining neck)
  - [ ] Remove neck - not seen from above.
  - [ ] Remove body - not seen from above
    - [ ] arms extend from (under) head
    - [ ] arms longer (a bit more than a head diameter each)

- [ ] Fix WM animation (was stationary)
  - [ ] Arms set asymmetrically: one raised, one extended to side. 
  - [ ] Hands wave symmetrically in and out but on an asymmetric diagonal axis
        - One hand goes up from a horizontal position, 
        - while the other waves overhead

### Other shot3 adjustments

- [ ] Move WM right: to mid-road (3 arm-lengths)
- [ ] Remove green rectangle on the right 
  - represented a riverside tree by mistake. 
- beep.ps1

## bSept14.shot4 (no family)

- [ ] Zoom out from bridge, show more of it
- [ ] Make SG slightly smaller than in shot2
- [ ] 
- [ ] Lower SG to Climbed-Position.climb-end 
  - Currently too high by 1 head
- [ ] Add cloud mid-left
- [ ] Fix SG face with own fill color (see step2)
- [ ] Fix mouth animation: 
  - Should toggle between o-shape and flat mouth
  - Not between smile and flat mouth.
- [ ] Fix SG position to hanging from rail (1 head down)
- [ ] Move caption bar up to 50
- [ ] Make caption bar thinner (single line)
- beep.ps1


## bSept14.shots5_7_9 (parents, future, choice)

- Copy shot3 (WM: family) fixes except captions and TTS narration. 
- [ ] Shot 5 (WM: parents): Mirror shot 3 fixes (WM, arms, animation)
- [ ] Shot 7 (WM: future): Mirror shot 3 fixes
- [ ] Shot 9:(WM: choice) Mirror shot 3 fixes
- beep.ps1


## bSept14.shot6 (SG: no family)

- [ ] Mirror shot 4 fixes (SG layout)
- [ ] Keep SG sitting on rail (good)
- [ ] Add cloud mid-right
- beep.ps1


## bSept14.shot8 (SG: no future)

- [ ] Shot 8: Mirror shot 6 fixes
- [ ] Shot 8: Add cloud far-right
- beep.ps1


## bSept14.shot10 (SG: contemplates)

- [ ] Shot 10: Mirror shot8 (no future) fixes
- [ ] Shot 10: Remove clouds
- [ ] Shot 10: Deep blue sky color
- [ ] Shot 10: Add 1 extra second (no narration)
- beep.ps1


## bSept14.shot11 (WM: survey)

- [ ] Shot 11: Mirror shot9 (choice) fixes
- [ ] Shot 11: Face changes to smile after 1 sec
- beep.ps1


## bSept14.shot12 (black)

- [ ] Display the black screen for 4 seconds
- [ ] Add [ ] caption + [ ] TTS narration as shot's Narrator dialog
  - `[pause] "Splash! [pause]" `
  - [ ] Add .vid `[pause]` description 
  - `[pause] read as instruction, not written nor narrated.`
  - [ ] Add player `[pause]` implementation.
- beep.ps1


## bSept14.clarifications

- AI to look at .vid and player code and Clarify the following:
  - [ ]  SG position: standing-on-bridge-floor vs hanging-from-fence
         When used and where, and are there any leftover errors, or ambiguities.
  - [ ] Report current SG positions (shot2 start/end, shots 4/6/8/10 position)

--- End of batch
- callme.ps1
