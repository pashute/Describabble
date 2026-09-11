# SurveyGuy Movie - Locations Translation Schema

`Filename: trans.surveyGuy.locations.md v0.1.2`

Translation schema for location and POV definitions.  
Reference: meta.gen.component.bridge, desc.surveyGuy.locations, desc.surveyGuy.component.bridge

## Location Fields Mapping

### Location Base Information

**name:** Location identifier  
→ "Suspension Bridge" (only location in surveyGuy)  

**type:** Location category  
→ Outdoor (single outdoor location)  

**environment:** Geographic/setting context  
→ Bridge spanning river, sidewalk at ground level  

**weather:** Atmospheric conditions  
→ Clear (daytime, good visibility)  

**time_of_day:** Temporal setting  
→ Daytime (natural daylight)  

**lighting:** Light source and quality  
→ Natural daylight (sun above, no artificial lighting)  

**ambience:** Ambient sound  
→ Traffic in distance (not loud, background layer)  
→ See desc.surveyGuy.audio.s.desc.md for details  

## POV-Specific Translation

### Riverside POV (Looking Up)

**POV ID:** riverside_pov  
**Camera Position:** River/ground level  
→ Below bridge, at water/ground surface  

**Camera Angle:** Upward looking  
→ 45-60° angle looking up toward structure  

**Camera Distance:** Medium  
→ Seeing full bridge span  
→ Character fills mid-to-upper frame  

**Frame Composition:**
- Bridge structure: Prominent (deck, rail, poles, cables all visible)
- Sky: Upper portion
- River: Implied or lower portion
- Character: Upper-center, against bridge backdrop

**Visible Bridge Elements (from meta.gen.stick.component.bridge):**
- Road/Deck: Horizontal line mid-frame
- Fence Top Rail: Horizontal line above deck
- Fence Poles: Vertical lines between rail and deck
- Catenary Cable: Curved line above rail
- Hangers: Vertical lines from cable to rail
- Sky: Background space

**Primary Subject:** Survey Guy  
**Subject Positioning:** Upper-center frame  
**Subject Scale:** Large (close perspective)  

**Subtitle Position:** Bottom  
**Reason:** Subtitle doesn't block subject above  

**Active Scenes:**
- [0-4s] Opening climbing
- [14-19s] First response
- [23-26s] Second response
- [30-40s] Job complaint

**Visual Impact:** Bridge dominates, character isolated, height emphasized  

### Bridge POV (Looking Down)

**POV ID:** bridge_pov  
**Camera Position:** Bridge level (on deck)  
→ Above Worried Man, looking downward  

**Camera Angle:** Downward looking  
→ 45-60° angle looking down toward ground  

**Camera Distance:** Far  
→ Ground appears far below  
→ Character appears small and distant  

**Frame Composition:**
- Ground/River: Lower portion (far, small)
- Bridge: Implied edges or minimal structure
- Sky: Upper portion
- Character: Center-lower frame, appears small

**Visible Elements:**
- Ground/River: Horizontal line far below
- Minimal structure: Edges or post tops implied
- Sky: Significant portion of frame
- Distance: Emphasized through scale

**Primary Subject:** Worried Man  
**Subject Positioning:** Center to lower frame  
**Subject Scale:** Small (far away)  

**Subtitle Position:** Top  
**Reason:** Subtitle doesn't block subject below  

**Active Scenes:**
- [4-9s] Narration bridge perspective
- [9-14s] First plea
- [19-23s] Second plea
- [26-30s] Third plea
- [40-51s] Job advice and punchline

**Visual Impact:** Distance emphasized, character appears helpless, power differential shown  

### Black (No Visual)

**[51.0s - 53.0s]** Cut to black  
→ No visual elements  
→ Audio (splash) dominates  
→ Scene end indicator  

## POV Switching Logic

**Rule 1: Speaker Determines POV**  
→ Riverside POV when Survey Guy speaks  
→ Bridge POV when Worried Man speaks  
→ Riverside POV for narrator opening (but transition to Bridge at 4s)  

**Rule 2: Clean Cut (No Transition)**  
→ Immediate switch at speaker change  
→ No dissolve, fade, or other transition  
→ Maintains clear POV separation  

**Rule 3: No Mid-Sentence Switches**  
→ POV changes only at dialogue boundaries  
→ If one character speaks multiple lines, same POV continues  
→ See desc.surveyGuy.scene1.md for exact switch times  

**Rule 4: Subtitle Follows POV**  
→ Riverside POV: Subtitle bottom
→ Bridge POV: Subtitle top  
→ Maintains visual clarity (subtitle doesn't block character)  

**Switching Sequence:**
- [0.0s] Start Riverside (opening narration)
- [4.0s] Switch Bridge (narrator establishes POV, then Worried Man begins)
- [14.0s] Switch Riverside (Survey Guy responds)
- [19.0s] Switch Bridge (Worried Man continues plea)
- [23.0s] Switch Riverside (Survey Guy responds)
- [26.0s] Switch Bridge (Worried Man continues plea)
- [30.0s] Switch Riverside (Survey Guy anguished speech, extends through 40s)
- [40.0s] Switch Bridge (Worried Man job advice, extends through 51s)
- [51.0s] Switch Black (splash, scene end)

**Total POV Switches:** 7 (opening + 6 transitions)  

## Camera/Frame Technical Parameters

**Canvas Resolution:** 960x540 (16:9)  
**Background Color:** Light (white or light blue for sky)  
**Line Weight:** 2-3 pixels (stick figures and structure)  
**Scale Ratio:** Stick figure height ~60px, bridge proportionally larger  

## Distance Communication Through Visual Scale

### Riverside POV Scale
- Bridge structure: 80-90% of frame
- Character: 20-30% of frame height
- River: Implied or 10% of frame
- Creates: Isolation, height awareness, scale

### Bridge POV Scale
- Ground/River: 70-80% of frame (but very far)
- Character: 10-15% of frame height
- Sky: 20-30% of frame
- Creates: Distance, helplessness, power dynamic

## Framing Rules Summary

- **Riverside:** Character upper-center, bridge fills frame, subtitle bottom
- **Bridge:** Character lower-center, ground/distance fills frame, subtitle top
- **Black:** No visual content, audio-only
- **Consistent:** Frame composition same throughout each POV (no camera movement)
- **Emotional:** Visual scale conveys emotional weight and stakes
