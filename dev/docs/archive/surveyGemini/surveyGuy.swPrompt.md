`Filename: surveyGuy.sw.prompt.md  v1.7`

# Prompt: "The surveyGuy" Animated Short Film (v1.7)

Create a single-file HTML/JS stickman animation web app for the short film "The surveyGuy" (directed by Moussa Yashir).

## Technical & Architecture Requirements
* **Single File:** Pure HTML, Tailwind CSS (via CDN), and vanilla JavaScript with an HTML5 Canvas (`960x540`).
* **Interactive UI:** Play/Pause button, Restart button, and a scrubbable timeline slider with live timestamp.
* **Audio:** 
* 1. Web Audio API for background traffic sound effect
  * `traffic`. 
  * *(Note: Used "SPLASH!" narration text/sound fallback because  could not find a splash sound effect).*
* **Speech Synthesis:** Uses browser `speechSynthesis` for dialogue. *(Note: Used available system voice synthesis).*

## Scene & POV Rules
1. **Opening:** Silent climbing intro. Survey Guy climbs hesitantly over the bridge fence with a bent tie.
2. **Strict Camera Framing (POV):**
   * **Riverside POV:** Looking up from river level at bridge featuring the road level, top fence rail, catenary suspension wire, and vertical suspender ropes/hangers. Only **Survey Guy** is visible.
   * **Bridge POV:** Looking down from the bridge at the Worried Man below. **No bridge structure visible**. Only the **Worried Man** is visible. *Subtitle box on the top of the screen so it doesn't obscure the Worried Man.*
3. **Actor Labels:** Do **not** show character name labels on screen. Only show clean subtitles: during Bridge POV at the top, otherwise at the bottom.

## Dialogue Script & Timing (Total Duration: 53.0s)
* **0.0s - 4.0s:** Narrator: `EXT. SUSPENSION BRIDGE - DAY (fast-moving traffic sounds heard in distance)` *(POV: Riverside Climb)*
* **4.0s - 9.0s:** Narrator: `Survey Guy climbs hesitantly over the bridge fence.` *(POV: Bridge)*
* **9.0s - 14.0s:** Worried Man: `Think about your wife! Think about your children!` *(POV: Bridge)*
* **14.0s - 19.0s:** Survey Guy: `I don't have a wife! I don't have kids!` *(POV: Riverside)*
* **19.0s - 23.0s:** Worried Man: `Think about your parents!` *(POV: Bridge)*
* **23.0s - 26.0s:** Survey Guy: `I don't have parents!` *(POV: Riverside)*
* **26.0s - 30.0s:** Worried Man: `Think about your future!` *(POV: Bridge)*
* **30.0s - 35.0s:** Survey Guy: `What future?! I have no future. I'm a phone rep survey guy!` *(POV: Riverside)*
* **35.0s - 40.0s:** Survey Guy: `Everybody hates surveys. They hear me talk and want to die!` *(POV: Riverside)*
* **40.0s - 46.0s:** Worried Man: `So change your job. You're not that stupid that you can't do anything else, right?` *(POV: Bridge)*
* **46.0s - 51.0s:** Worried Man: `Before you step down, would you be willing to reply to a short survey?` *(POV: Bridge)*
* **51.0s - 53.0s:** Narrator: `SPLASH!` *(CUT TO BLACK)*

## Changes from Original Screenplay v1.0

* **Character Name Update:** Changed all instances of "Surveyor" to **"Survey Guy"**.

* **Dialogue Update:** Expanded survey job description to *"I'm a phone rep survey guy!"* and 
* Ypdated "Sue inside" line to *"want to die"*.

* **Audio Enhancement:** Standard browser synthesis voices were used, since male voice filters were limited.

* **Extended Timings:** Increased duration for dialogue lines to ensure full speech synthesis pronunciation without cutting off.
Especially last two dialogs (by worried man).


* **Bridge Architecture:** Added precise details for simple bridge drawing:
  * Two horizontal lines - on the bottom for the bridge road, on the top for the fence top rail
  * A few horizontal lines between the top and bottom of the fence to represent fence poles.
  * A suspension catenary curve from above with vertical hanger ropes to the top rail. 

* **Subtitle Layout:** Dynamic subtitle repositioning (top vs bottom) depending on POV to avoid blocking character artwork.
