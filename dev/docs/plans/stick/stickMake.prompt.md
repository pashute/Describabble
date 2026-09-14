# Prompt: stickTrans - Describ to VidData Translator (Two-Stage Pipeline)

`Filename: stickTrans.prompt.md v0.1.2`

**Version:** 0.1.2  
**Status:** Two-stage modular pipeline for describ file translation  
**Purpose:** Translate `desc.surveyGuy.*.md` + `trans.surveyGuy.*.md` → `vidData/*.json` → player reads JSON

---

## Mission

Build an **AI agent** that translates describ files into clean JSON data files:
1. **Input:** `desc.surveyGuy.*.md` descriptions + `trans.surveyGuy.*.md` lexicon schemas + `meta.gen.*.md` rules
2. **Process:** Parse natural language descriptions using parameter schemas
3. **Output:** Structured JSON files (vidData/scenes.json, characters.json, locations.json)

This creates a reusable **describ → JSON pipeline** for any stick figure movie.

---

## When to Use

**Use stickTrans (two-stage pipeline) for:**
- Describ file validation before player loads
- Batch-processing many movies (translate once, play many times)
- JSON as interchange format between tools
- Separating parsing logic from rendering logic
- Reusable translation pipeline for other movie types

---

## Translation Algorithm

### Step 1: Load Metadata & Schemas
- Parse `meta.gen.*.md` files → extraction rules (e.g., stick figure anatomy, emotions, movement, bridge)
- Parse `trans.surveyGuy.*.md` files → parameter definitions (e.g., characters have: name, role, age, gender, appearance, mood, voice)

### Step 2: Parse Character Descriptions
**Input:** desc.surveyGuy.characters.md

**Extract using trans.surveyGuy.characters.md schema:**
```
characters: [
  {
    id: extract name (Survey Guy)
    role: extract role (protagonist/lead)
    age: extract age (30s)
    gender: extract gender (male)
    appearance: extract appearance details (stick figure, bent tie, etc.)
    voice: extract voice params (nasal, 30s, male)
    moodArc: extract mood changes over timeline
    postureStates: extract posture descriptions (climbing, standing, thinking)
  }
]
```

**Output:** Structured objects matching `vidData/characters.json` schema

### Step 3: Parse Location Descriptions
**Input:** surveyGuy-locationsdesc.surveyGuy.*.md

**Extract using locations.trans schema:**
```
locations: [
  {
    id: extract location name (bridge)
    type, environment, weather: extract scene details
    bridgeStructure: extract component details (road, rail, poles, cables, hangers)
    pov: [
      {
        id: riverside_pov
        cameraPosition, angle, distance: extract camera setup
        visible, hidden, primarySubject: extract framing rules
        subtitlePosition: extract subtitle placement
        scenesTiming: extract which scenes use this POV
      }
    ]
  }
]
```

**Output:** Structured objects matching `vidData/locations.json` schema

### Step 4: Parse Scene & Timeline
**Input:** surveyGuy-scene1desc.surveyGuy.*.md

**Extract using dialogue.trans + actions.trans schemas:**
```
scenes: [
  {
    id: scene1
    segments: [
      {
        id: seg_opening
        startTime, endTime: extract timing
        pov: extract POV (riverside/bridge)
        dialogueLines: [
          {
            speaker: extract speaker name
            startTime, endTime: extract precise timing
            text: extract dialogue text
            tone, volume: extract delivery style
            subtitlePosition: extract based on POV + locations.trans rules
          }
        ]
        characters, actions: extract active characters and their actions
      }
      // ... continue for all segments through 51-53s
    ]
  }
]
```

**Output:** Structured objects matching `vidData/scenes.json` schema

### Step 5: Parse Audio Layer
**Input:** surveyGuy-audiodesc.surveyGuy.*.md

**Extract using dialogue.trans + audio schema:**
```
audio: {
  ambience: [
    {
      type: traffic
      timing: extract timing (0-51s)
      volume: extract relative volume
      description, quality: extract audio characteristics
    }
  ]
  dialogue: [
    // Map to scenes' dialogueLines with audio params
  ]
  soundEffects: [
    {
      type: splash
      timing: extract timing (51-53s)
      volume, duration: extract effect params
    }
  ]
}
```

**Output:** Audio parameters integrated into scenes.json or separate audio.json

---

## Validation & Error Handling

### Validation Checks
1. **Timing:** All times must be 0-53s, non-overlapping for same POV
2. **Characters:** Every dialogue line has valid speaker (must exist in characters.json)
3. **POV Consistency:** POV switches only occur between speaker changes
4. **Completeness:** All required fields from `.trans` schemas present
5. **References:** Any reference to character/location/POV must exist

### Error Handling
- **Missing field:** Flag as warning, use default from `.g.meta` if available
- **Timing conflict:** Halt translation, report segment and timing issue
- **Invalid reference:** Halt translation, list missing character/location
- **Ambiguous description:** Ask clarifying question (requires human input) or flag for review

---

## Output Files Structure

### scenes.json
```json
{
  "movie": "surveyGuy",
  "totalDuration": 53.0,
  "scenes": [ { ... segments with dialogue, POV switches, actions ... } ]
}
```

### characters.json
```json
{
  "characters": [ { ... all character states, animations, moods ... } ]
}
```

### locations.json
```json
{
  "locations": [ { ... POV definitions, camera rules, structure ... } ],
  "povSwitchSequence": [ { time, pov, reason } ]
}
```

### (Optional) audio.json
```json
{
  "ambience": [ { ... traffic, weather, ambient sounds ... } ],
  "dialogue": [ { ... maps to scenes dialogue with audio params ... } ],
  "soundEffects": [ { ... splash, impacts, special effects ... } ]
}
```

---

## Quality Assurance

### Comparison Test
1. **Translate:** Feed surveyGuy-*desc.surveyGuy.*.md + surveyGuy.trans + .g.meta → produce JSON
2. **Reconstruct:** Feed JSON to stickPlayer.prompt.md (as if reading JSON)
3. **Verify:** Does animation match original HTML (surveyGuyAni.html)?
4. **Approval:** If match, translation successful; if mismatch, debug

### Expected Outcomes
- Scenes JSON should specify exact 53-second timeline
- POV switches should occur at speaker boundaries
- Character mood/expression changes should align with dialogue tone
- Timing should match swPrompt.md specifications exactly

---

## Notes

- This translator is **deterministic** (same input → same output)
- Validation can be strict (reject ambiguous descriptions) or lenient (use defaults)
- Human review recommended for first movie (surveyGuy) to calibrate extraction
- Once working, translator can be reused for new movies with same `.g.meta` + `.trans` rules
