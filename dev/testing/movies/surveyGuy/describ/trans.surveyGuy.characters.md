# SurveyGuy Movie - Characters Translation Schema

`Filename: trans.surveyGuy.characters.md v0.1.2`

Translation schema linking character descriptions to meta.gen.emotions and meta.gen.stick.emotions.  
See desc.surveyGuy.characters.md for character-specific content.

## Character Field Mapping

### Character Fields (From characters.trans generic schema)

**name:** Character identifier (string)  
→ Survey Guy, Worried Man  

**role:** Role in narrative (lead, support, extra)  
→ Survey Guy: lead (protagonist)  
→ Worried Man: support  

**age:** Age descriptor (numeric or descriptor)  
→ Survey Guy: 30s  
→ Worried Man: 24  

**gender:** Gender identifier  
→ Survey Guy: male  
→ Worried Man: male  

**appearance:** Physical description (stick figure specific)  
→ See meta.gen.stick.emotions for anatomy  
→ See meta.gen.stick.component.bridge for framing  

**voice:** Speech synthesis specification  
→ Gender: male (both)  
→ Age: 30s (SG) or 24 (WM)  
→ Quality: nasal phone rep (SG) or clear direct (WM)  

**mood:** Current emotional state  
→ See trans.surveyGuy.emotions.md for mappings  

**attire:** Clothing and accessories  
→ Survey Guy: bent tie (primary distinction)  
→ Worried Man: minimal (simple stick figure)  

**posture:** Body stance and position  
→ See meta.gen.stick.movement for conventions  

**awareness:** Knowledge of situation  
→ Survey Guy: aware (knows he's on bridge, choice ahead)  
→ Worried Man: aware (knows SG is contemplating jump)  

## Emotion Mapping to Meta

### Survey Guy Emotions (See trans.surveyGuy.emotions.md)

**[0-4s] Distressed:**  
→ Reference: meta.gen.emotions → Distressed (high intensity)  
→ Stick Rendering: meta.gen.stick.emotions → Distressed (open mouth, wide eyes)  
→ Posture: meta.gen.stick.movement → Climbing (angled body, arms raised)  

**[4-14s] Defensive:**  
→ Reference: meta.gen.emotions → Defensive (protective)  
→ Stick Rendering: meta.gen.stick.emotions → Worried (but hardened)  
→ Posture: meta.gen.stick.movement → Standing (upright)  

**[14-26s] Raw/Honest:**  
→ Reference: meta.gen.emotions → Anguished (revealing pain)  
→ Stick Rendering: meta.gen.stick.emotions → Anguished (open mouth, intensity)  
→ Posture: meta.gen.stick.movement → Standing (stable)  

**[26-40s] Anguished/Bitter:**  
→ Reference: meta.gen.emotions → Anguished (high intensity pain)  
→ Stick Rendering: meta.gen.stick.emotions → Distressed or Anguished  
→ Posture: meta.gen.stick.movement → Standing (with tension)  

**[40-46s] Contemplative:**  
→ Reference: meta.gen.emotions → Thinking (internal processing)  
→ Stick Rendering: meta.gen.stick.emotions → Thinking (subtle, eyes away)  
→ Posture: meta.gen.stick.movement → Standing (still, reflective)  

**[46-53s] Accepting:**  
→ Reference: meta.gen.emotions → Resigned (accepting fate)  
→ Stick Rendering: meta.gen.stick.emotions → Resigned (settled expression)  
→ Posture: meta.gen.stick.movement → Standing (settling)  

### Worried Man Emotions (See trans.surveyGuy.emotions.md)

**[9-14s] Worried:**  
→ Reference: meta.gen.emotions → Worried (anxious, concerned)  
→ Stick Rendering: meta.gen.stick.emotions → Worried (widened eyes, furrowed brow)  
→ Posture: meta.gen.stick.movement → Standing (upright, gesturing)  

**[19-30s] Desperate:**  
→ Reference: meta.gen.emotions → Desperate (high intensity concern)  
→ Stick Rendering: meta.gen.stick.emotions → Distressed (exaggerated)  
→ Posture: meta.gen.stick.movement → Standing (rigid, emphatic gestures)  

**[40-46s] Logical/Measured:**  
→ Reference: meta.gen.emotions → Confident/Determined  
→ Stick Rendering: meta.gen.stick.emotions → Neutral or Thinking  
→ Posture: meta.gen.stick.movement → Standing (firm, controlled)  

**[46-51s] Cunning/Knowing:**  
→ Reference: meta.gen.emotions → Amused (subtle humor)  
→ Stick Rendering: meta.gen.stick.emotions → Happy or Thinking (subtle)  
→ Posture: meta.gen.stick.movement → Standing (confident)  

## Voice Synthesis Mapping

**Survey Guy Voice Parameters:**
- Synthesizer: Web Audio API system voices
- Gender: Male
- Age: Older (30s)
- Accent: American English (slight nasal quality)
- Tone: Varies by emotion (see emotion mood arc)
- Rate: Normal to fast (varies by urgency)
- Pitch: Slightly higher than neutral (distress)

**Worried Man Voice Parameters:**
- Synthesizer: Web Audio API system voices
- Gender: Male
- Age: Younger (24)
- Accent: American English (clear, direct)
- Tone: Varies by emotion (urgent → logical → cunning)
- Rate: Fast (urgency) to moderate (reasoning)
- Pitch: Higher than neutral (younger male, urgency)

## Movement Timing

**Survey Guy Movement States:**
- Climbing: 0-4s (see meta.gen.stick.movement → Climbing)
- Standing: 4-51s (see meta.gen.stick.movement → Standing/Idle)
- Interpolation: Linear between states

**Worried Man Movement States:**
- Looking Up: 9-51s (see meta.gen.stick.movement → Looking Up)
- Gesturing: Throughout (see meta.gen.stick.movement → Gesturing)
- Interpolation: No major movement, subtle posture shifts

## Character Interaction Model

**Distance:** Bridge-height apart (significant separation)  
→ Communication: Shouting (volume must compensate)  
→ Eye Contact: Implied through POV switching  
→ Body Language: Exaggerated (distance requires amplification)  
→ Synchronized: Dialogue alternation (no overlap)  
