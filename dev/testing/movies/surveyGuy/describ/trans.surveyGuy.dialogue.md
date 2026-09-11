# SurveyGuy Movie - Dialogue Translation Schema

`Filename: trans.surveyGuy.dialogue.md v0.1.2`

Dialogue parameter definitions and schema mappings.  
Reference: desc.surveyGuy.dialogue.map.md for complete dialogue sequence

## Dialogue Parameter Fields

### Core Dialogue Fields

**speaker:** Character speaking  
→ Narrator, Survey Guy, Worried Man  

**startTime:** When speech begins (seconds)  
→ Range: 0.0s - 51.0s  
→ Precision: 0.1s intervals  

**endTime:** When speech ends (seconds)  
→ Range: 4.0s - 53.0s  
→ Duration: startTime to endTime  

**text:** Exact dialogue text  
→ Natural language, terse but complete  
→ No phonetic notation (speech synthesis handles pronunciation)  

**tone:** How dialogue is delivered  
→ Calm (narrator, logical reasoning)  
→ Urgent (first emotional pleas)  
→ Desperate (peak emotional pleas)  
→ Raw/Honest (genuine revelation)  
→ Bitter (self-aware complaint)  
→ Cunning (punchline delivery)  

**volume:** Speech amplitude  
→ Normal (narrator)  
→ Shouting (character-to-character across distance)  
→ Clear (punchline, emphasis through clarity not volume)  

**emotion:** Character state during speech  
→ Maps to trans.surveyGuy.emotions.md  
→ Determines facial expression and posture  

### POV & Subtitle Fields

**pov_during:** Active camera perspective  
→ Riverside (Survey Guy speaking)  
→ Bridge (Worried Man speaking)  
→ None (narrator, or opening transition)  

**subtitle_position:** Where subtitle appears  
→ Top (when POV = Bridge)  
→ Bottom (when POV = Riverside)  
→ None (narrator opening, or scene end)  

**subtitle_reason:** Why position chosen  
→ Doesn't block character (primary reason)  

### Delivery Style Fields

**delivery_style:** How words are spoken  
→ Staccato: Fast, clipped phrases (emotional pleas)  
→ Flowing: Natural pacing (narration, reasoning)  
→ Intense: Sustained emphasis (anguished speech)  
→ Measured: Deliberate, controlled (punchline, logic)  
→ Rapid: Fast-paced delivery (urgent)  

**rate:** Speech synthesis speed parameter  
→ 1.0 = normal speed  
→ 1.2-1.5 = faster (urgency, emotional)  
→ 0.8-0.9 = slower (measured, punchline emphasis)  

**pitch:** Voice pitch adjustment  
→ Normal = 1.0  
→ Higher = distress or younger voice (SG distressed, WM regular)  
→ Lower = authority or older (narrator)  

## Speaker-Specific Parameter Defaults

### Narrator Defaults
- **Tone:** Calm, documentary
- **Volume:** Normal (over background traffic)
- **Emotion:** Neutral/observational
- **Delivery:** Flowing, clear
- **Rate:** 1.0 (normal)
- **Pitch:** Lower (older male)
- **Subtitles:** Bottom or none

### Survey Guy Defaults
- **Tone:** Varies by emotion (defensive → raw → anguished → accepting)
- **Volume:** Shouting (across distance)
- **Emotion:** See trans.surveyGuy.emotions mood arc
- **Delivery:** Varies (staccato for responses, flowing for complaint)
- **Rate:** Varies (1.2-1.5 for distress, 0.9-1.0 for reasoning)
- **Pitch:** Slightly elevated (distress, nasal quality)
- **Subtitles:** Bottom (Riverside POV)
- **POV:** Riverside

### Worried Man Defaults
- **Tone:** Urgent → logical → cunning
- **Volume:** Shouting (across distance)
- **Emotion:** See trans.surveyGuy.emotions mood arc
- **Delivery:** Staccato (pleas), flowing (reasoning), measured (punchline)
- **Rate:** Rapid (1.3-1.5 for pleas), moderate (1.0-1.2 for reasoning)
- **Pitch:** Normal to elevated (younger male, urgency)
- **Subtitles:** Top (Bridge POV)
- **POV:** Bridge

## Dialogue Sequence Mapping

### Line 1: Narrator Opening (0.0s - 4.0s)
- Speaker: Narrator
- Tone: Calm, documentary
- Volume: Normal
- Delivery: Flowing, descriptive
- Rate: 1.0 (normal)
- POV: Riverside (establishing)
- Subtitle: Bottom or none
- Emotion: Neutral
- Note: Scene establishes place and character

### Lines 2-4: Emotional Escalation Cycle 1 (4.0s - 14.0s)
- Pattern: Narrator → Worried Man first plea → Survey Guy first response
- Tone: Calm → Urgent → Defensive
- Volume: Normal → Shouting → Shouting
- Delivery: Flowing → Staccato → Emphatic
- Rate: 1.0 → 1.3 → 1.2
- POV: Bridge → Bridge → Riverside
- Subtitle: None/bottom → Top → Bottom
- Emotion: Neutral → Worried → Defensive

### Lines 5-6: Emotional Escalation Cycle 2 (19.0s - 26.0s)
- Pattern: Worried Man second plea → Survey Guy second response
- Tone: Desperate → Raw
- Volume: Shouting → Shouting
- Delivery: Staccato → Emphatic
- Rate: 1.4 → 1.3
- POV: Bridge → Riverside
- Subtitle: Top → Bottom
- Emotion: Desperate → Raw/Anguished
- Note: Escalation intensifies

### Lines 7-8: Peak Escalation (26.0s - 40.0s)
- Pattern: Worried Man third plea → Survey Guy anguished speech (extended)
- Tone: Desperate (peak) → Anguished → Bitter
- Volume: Shouting (max) → Shouting
- Delivery: Intense → Intense/sustained
- Rate: 1.5 (max) → 1.3-1.2
- POV: Bridge → Riverside
- Subtitle: Top → Bottom
- Emotion: Peak desperate → Anguished/Bitter
- Note: Emotional climax reached

### Line 9: Pivot to Reasoning (40.0s - 46.0s)
- Pattern: Worried Man job advice
- Tone: Logical, measured
- Volume: Shouting (but controlled)
- Delivery: Flowing, conversational
- Rate: 1.1 (slightly faster than normal, not urgent)
- POV: Bridge
- Subtitle: Top
- Emotion: Confident, logical
- Note: Topic shift, emotional intensity drops

### Line 10: Punchline Delivery (46.0s - 51.0s)
- Pattern: Worried Man final line
- Tone: Cunning, measured
- Volume: Clear (lower for emphasis)
- Delivery: Measured, deliberate
- Rate: 0.9 (slower, emphasis on clarity)
- POV: Bridge
- Subtitle: Top
- Emotion: Cunning, knowing, amused
- Note: Punchline emphasis through clarity, not volume

### Line 11: Scene End (51.0s - 53.0s)
- Pattern: Sound effect only (splash)
- Type: Sound effect, not dialogue
- Audio: Loud splash sound
- Duration: ~2 seconds
- POV: Black (no visual)
- Subtitle: None
- Note: Scene ending, implies action

## Dialogue Audio Layer Parameters

### Speech Synthesis Configuration
- **API:** Web Audio API browser speechSynthesis
- **Fallback:** System default voices (if specified voices unavailable)
- **Voices:**
  - Narrator: Male, older (default system male)
  - Survey Guy: Male, 30s, nasal (default system male with pitch up)
  - Worried Man: Male, 24, clear (default system male, younger)

### Audio Mixing
- **Traffic Ambient:** Continuous 0-51s, low volume (underneath)
- **Dialogue:** Primary layer, clear
- **Splash:** High volume at 51-53s, scene end

### Emotional Audio Markers
- **Panting:** Audible 0-4s (Survey Guy exhaustion)
- **Voice Crack:** Optional during raw lines 14-26s (SG vulnerability)
- **Intensity Shift:** Dialogue intensity audibly increases 4-40s
- **Reasoning Shift:** Volume/urgency decreases at 40s
