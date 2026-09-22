# Filename: revEng.md v0.1.1

## Reverse Engineering Effort: From Natural Language to Stick Figure Animation

### Executive Summary

This document outlines the theoretical approach to reverse-engineering a working movie production pipeline. The goal is to decompose a running animated film (currently v0.1.54 of "The Survey Guy") back through its component stages to extract the generative rules and constraints that produced it.

**Starting Point:** Working .vid file (machine-readable animation manifest in YAML format)  
**End Point:** Natural language modules and stickchat transcript that generated the .vid  
**Current Stage:** Analyzing .vid structure and player implementation  

---

## Part 1: Architecture Overview

### The Pipeline (Forward Direction)

```
Natural Language Input
        ↓
  [stickchat] ← Human-AI conversation about joke, scenes, characters
        ↓
  [stickModules] ← Structured scene/character/dialogue modules extracted
        ↓
   [stickMake] ← Assembles modules into .vid YAML format
        ↓
  [.vid file] ← Machine-readable animation manifest
        ↓
  [player.js] ← Renders .vid into HTML5 Canvas animation
        ↓
    [Movie]
```

### The Reverse Engineering Path

We are walking this backward:

```
Working Movie (v0.1.54 "The Survey Guy")
        ↓
  [analyze .vid structure]
        ↓
  [extract scene/character patterns]
        ↓
  [infer module boundaries]
        ↓
  [reconstruct stickchat questions/answers]
```

---

## Part 2: Why Ambiguous Names Matter

### The Problem with Specification-First Approach

In traditional animation or game design, you specify exact positions first:
- "Character at (x: 450, y: 320)"
- "Animation duration: 5.234 seconds"
- "Head diameter: 40 pixels"

This works for implementation but **kills reverse engineering** because:
1. Too many degrees of freedom (why 40 pixels, not 38?)
2. No trace of the constraints or reasoning
3. Implementation details obscure intent

### Ambiguous Names as Intent Markers

We use terms like:
- **"standing-on-bridge-floor"** - implies position and constraints without exact coords
- **"hanging-from-fence"** - position relative to other elements, not absolute
- **"1 head down from fence top"** - relative sizing, preserves proportional reasoning

**Advantage:** When we reverse-engineer the .vid, these ambiguous names tell us:
- What was discussed (the name itself)
- What constraints mattered (why this term, not a pixel value)
- How the human reasoned about it (relative positioning, character-relative sizing)

Once we recover this reasoning, we can implement exact positions. But the reasoning (captured in ambiguous terms) is what we're trying to extract.

---

## Part 3: Current .vid Structure Analysis

### Position Terminology in .vid v0.1.54

**Climb Sequence (Shot 2):**
- `standing-on-bridge-floor` → Starting position for climb
- `head-above-fence-top-rail` → Ending position after climb

**Post-Climb Positions:**
- `hanging-from-fence` → Used in WM overhead scenes (3, 5, 7, 9, 11) 
  - SG reference kept at top of fence (even though not drawn)
  - Marks the "from-bridge POV" context
  
- `hanging-from-rail` → Used in SG solo shots (4, 6, 8, 10)
  - Position: "1 head down from fence top"
  - Resting position between speeches

**Character POV:**
- `from-above` → WM scenes (looking down from bridge at riverside road)
- `from-below` → SG shots (looking up from riverside at fence)

### What This Tells Us About the Original Discussion

The presence of these ambiguous terms suggests the original stickchat included questions like:
- "Where does SG start his climb?"  
  → "On the bridge floor"
- "How far does he climb?"  
  → "Until his head is above the top rail"
- "What does each side character see?"  
  → One sees from above (WM looking up), one sees from below (SG on fence)

---

## Part 4: Reverse Engineering Patterns Found

### Pattern 1: Character Rendering from POV

From-above WM (shots 3, 5, 7, 9, 11):
- Head diameter doubled (40 vs 20)
- Feet form "sharp angle"  
- Eyes/mouth "upper-head"
- No neck / No body (not visible from above)
- Arms asymmetric, longer

**Reverse Engineering Insight:**  
This wasn't specified as exact pixel values. It was discussed as a conceptual model: "Looking down at someone, what DO you see? Not their neck, not their body - just head and extended arms. The perspective makes them look different."

### Pattern 2: Emotional Arc via Position

| Shot | Character | Emotion | Position Detail |
|------|-----------|---------|-----------------|
| 2 | SG | Distressed | Climbing (feet floor → head above rail) |
| 3 | WM | Worried | Road, arms flailing, raised/extended asymmetrically |
| 4 | SG | Defensive | Rail-hang, leaning right, arm out |
| 6 | SG | Anguished | Rail-hang, leaning left, arm out |
| 8 | SG | Bitter | Rail-hang, leaning right, arms in |
| 10 | SG | Contemplative | Rail-hang, leaning left, arms in |

**Pattern:** Every time SG returns to the rail, a different lean/arm combo. This isn't random - it's a visual manifestation of emotional change.

---

## Part 5: Open Questions for Recovery

When we reconstruct stickchat, we need to answer:

1. **On character design:**
   - How was the "from-above WM" concept discussed?
   - Was it iterative? ("No, this makes him look like a baby... try again?")
   - Did the human sketch it or was it purely verbal?

2. **On timing:**
   - Why does the climb take 5 seconds?
   - Why does SG contemplate for 3 seconds (extended from 2)?
   - Were these durations debated?

3. **On the joke structure:**
   - What was the original punchline concept?
   - How did it evolve? ("The splash at the end - did you always want that?")
   - Where did the four "reasons not to jump" (wife, parents, future, job) come from?

4. **On constraints:**
   - Which things were fixed early vs. iterated on?
   - What was explicitly rejected? ("We can't see his body from above, right? So remove it.")

---

## Part 6: Next Steps

### Stage 1 (EMPTY - Reserved for stickchat recovery)

**Stickchat Transcript**  
*To be completed: Reconstructed conversation between human and AI that led to this movie*

**Location:** `dev/tests/movies/surveyGuy/stickchat.md` (or similar)

**Content should include:**
- Joke origin and iterations
- Character design discussions
- Scene-by-scene breakdown dialogue
- Why specific choices were made
- Constraints discovered or imposed

---

### Stage 2: Module Extraction

Extract structured scene/character/dialogue modules from the recovered stickchat.

### Stage 3: stickMake Implementation

Build the tool that assembles modules → .vid YAML

### Stage 4: Validation

Run the recovered stickchat → stickMake → player and verify it produces the same movie.

---

## Part 7: Success Criteria

The reverse engineering effort is successful when:

1. ✓ We can read the working .vid and understand its structure (DONE - v0.1.54)
2. ⏳ We can articulate the reasoning behind each choice (IN PROGRESS)
3. ⏳ We can extract natural language modules from the .vid
4. ⏳ We can reconstruct the stickchat transcript
5. ⏳ We can build stickMake to regenerate the .vid from modules
6. ⏳ We can generate a new movie using the same reverse-engineered pipeline

---

## References

- **Current .vid:** `dev/testing/movies/surveyGuy/surveyGuy.vid` (v0.1.54)
- **Player:** `src/stickvid/public/player.js` (v0.1.53)
- **Archive reference:** `dev/docs/archive/` (Gemini's working movie prototype)
- **Todo tracking:** `dev/docs/progress/todo.md` (Batch sept14 1824)

---

*Document created as part of Batch sept14 1824 debugging and clarification pass.*  
*Last updated: 2026-09-15*
