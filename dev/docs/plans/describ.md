# Describabble Describ Files Architecture

`Filename: describ.md v0.1.7`

Core file format system for screenplay description and animation data.

---

## Three File Types

### 1. `.meta` files - Parameter Schema & Defaults
Generic, reusable rules. Defines:
- **Parameter names** (what CAN be varied)
- **Default options** (what COULD be chosen)
- **Rendering rules** (how to draw/animate each parameter)

**Example: `meta.stick.fig.male`**
```
head:
  size: [GIANT, LARGE, LONG, SMALL, TINY, NONE]  # Options available
  shape: [circle, oval, triangle]
  variants: [none, hair-line, hair-full]
body:
  angle: [upright, leaning-left, leaning-right, twisted]
arms:
  length: [short, normal, long]
  position: [up, down, bent, gesture-left, gesture-right]
legs:
  stance: [together, apart, bent-walking, bent-kneeling]
face:
  mouth: [line, smile-up, smile-down, O-shape, grimace]
  eyebrows: [line, up, down, angled-happy, angled-worried]
```

**Example: `meta.stick.fig.female`**
```
Similar to male, with options for:
  head: [oval, contoured, feminine] variants
  body: [curves, straight] rendering hints
```

### 2. `.desc` files - Specific Implementation
Movie or scene-specific. Contains:
- **Only chosen parameters** (no alternatives listed)
- **Specific values** (what IS, not what COULD be)
- **No rendering options** (implementation detail, not description)

**Example: `desc.surveyGuy.char.jmp` (Survey Guy - Jumper)**
```
name: Survey Guy (JMP)
base: meta.stick.fig.male
head:
  size: LARGE           # Chosen from meta options
  shape: oval
  variants: hair-line
body:
  angle: twisted        # Leaning/climbing
arms:
  position: up          # Reaching/climbing
legs:
  stance: bent-walking  # Mid-climb
attire:
  shirt: blue-long-sleeve
  tie: dishevelled      # Specific detail for this character
```

**Example: `desc.surveyGuy.char.wm` (Worried Man)**
```
name: Worried Man (WM)
base: meta.stick.fig.male
head:
  size: LARGE
  shape: circle
  variants: hair-line
body:
  angle: upright
arms:
  position: down
legs:
  stance: together       # Standing still
attire:
  shirt: casual
  tie: none
emotion-arc:           # Movie-specific, not generic
  default: worried
```

### 3. `.trans` files - Natural Language → Parameters
Mapping schemas. Bridge between:
- **Human description** (natural language)
- **Structured parameters** (animation data)

**Example: `trans.stick.fig.male.clothed`**
```
Maps human descriptions like:
  "A businessman with a tie"
  → base: meta.stick.fig.male
  → attire.shirt: "long-sleeve"
  → attire.tie: "formal"
  → emotion: "neutral or authoritative"

  "A distressed man"
  → base: meta.stick.fig.male
  → face.eyebrows: "angled-worried"
  → body.angle: "leaning" or "twisted"
  → face.mouth: "line" or "grimace"
```

---

## Head Size System

| Size | Appearance | Use Case |
|------|-----------|----------|
| **GIANT** | Head = 50% of body height | Exaggerated, comedic, emphasis on thoughts |
| **LARGE** | Round head, oversized but proportional | Typical adult, emphasizes expressions |
| **LONG** | Elongated vertical head | Thin face, intellectual characters |
| **SMALL** | Regular small proportional head | Normal stick figure |
| **TINY** | Very small head | Childlike, alien, unusual proportions |
| **NONE** | No head | Special effect (headless stickman) |

---

## Emotion → Rendering Mapping

**Happiness**
- mouth: smile-up (curved ⌣)
- eyebrows: up or angled-happy (⌢)
- posture: upright, relaxed

**Sadness**
- mouth: smile-down (curved ⌢ inverted)
- eyebrows: angled-down (∨)
- posture: lean-down, slumped

**Worry/Anxiety**
- mouth: line or grimace
- eyebrows: angled-worried (∧ inward)
- posture: lean-forward, tense

**Anger**
- mouth: grimace or line
- eyebrows: angled-angry (sharp ∧)
- posture: twisted, arms gesture

**Distressed**
- mouth: O-shape
- eyes: wide (enlarged)
- posture: lean-back, falling gesture

**Neutral**
- mouth: line or dot
- eyebrows: line
- posture: upright

---

## Movement & Posture

**Standing** - Upright, legs together, arms natural
**Walking** - Legs bent alternating, arms swing, body forward-lean
**Climbing** - Body angled up, arms raised, legs bent
**Falling** - Body tilted/inverted, arms out, legs splayed
**Sitting** - Upper body upright, legs bent, lower torso reduced
**Gesturing** - Arms in direction of emphasis, body may twist

---

## surveyGuy Example Breakdown

**[EXAMPLE - surveyGuy specific, not generic]**

### Characters

`desc.surveyGuy.char.jmp`:
- Head: LARGE, oval, hair-line
- Body: twisted (climbing), blue-shirt, dishevelled-tie
- Emotion: distressed (mouth O, eyes wide, lean-back when realized)

`desc.surveyGuy.char.wm`:
- Head: LARGE, circle, hair-line
- Body: upright, casual-shirt, no-tie
- Emotion: worried throughout (eyebrows angled-worried, mouth line)

### Locations

`desc.surveyGuy.loc.bridge`:
- Camera angle: from riverside sidewalk looking up at bridge
- Elements: cables, hangers, road deck
- Lighting: daytime, overcast

### Dialogue & Emotion Timeline

```
0-4s: JMP climbing, panting (aggressive sound)
4s: WM yells "think about your wife!"
     → Emotion: worried, eyebrows down, mouth line
9s: JMP responds "I don't have a wife!"
     → Emotion: distressed, lean-back
14s: WM yells "think about your parents"
     → Emotion: worried maintained
```

**[END EXAMPLE]**

---

## Translation Example

**Human input:** "A young businessman, frustrated, climbing the bridge"

**AI translation process:**
1. Base template: `meta.stick.fig.male`
2. Emotion: frustrated → eyebrows angled-angry, mouth grimace
3. Action: climbing → body angle twisted, arms raised, legs bent
4. Attire: businessman → shirt long-sleeve, tie formal
5. Output: Structured desc parameters ready for rendering

---

## Meta vs Desc vs Trans - Key Distinction

| Aspect | `.meta` | `.desc` | `.trans` |
|--------|---------|---------|----------|
| **Purpose** | Schema + options | Specific values | Human language mapping |
| **Content** | "What COULD be" | "What IS" | "How to interpret" |
| **Reusable?** | Yes (generic) | No (movie-specific) | Yes (pattern-based) |
| **Who uses?** | AI/rendering engine | Player/animator | AI translator |
| **Change with movie?** | No | Yes | No |

---

## References

- Implementation: See [stickTech.md](stickTech.md) for full system architecture
- UI Specs: See [stickchat.specs.md](stickchat.specs.md) for editor interface
- Code: `src/stickSetup/stickSetup.js` v0.1.7 loads meta/trans files from CDN cache
