# Stick Figure Emotions Metadata

`Filename: meta.gen.stick.emotions.md v0.1.2`

## How Stick Figures Express Emotions (Minimal Rendering)

Using only simple geometric shapes and minimal details for stick figure animation.

### Facial Expression Elements
- **Eyes:** Two dots, can be adjusted (wide/narrow, direction, crossed)
- **Mouth:** Curved line (up/down), dash, circle, or open shape
- **Eyebrows:** Optional short lines above eyes (downward angle = worried, upward = surprised)
- **Facial Hair:** Optional (mustache, beard as simple lines)

### Emotion Expression Rules

#### Happy
- Mouth: Curved upward ( smile )
- Eyes: Dots, slightly crinkled if possible (corners lifted)
- Eyebrows: Optional slight upward angle
- Head: Slight tilt optional
- **Implementation:** Curved mouth line upward, eyes dots, body relaxed

#### Sad
- Mouth: Curved downward ( frown )
- Eyes: Dots, possibly with teardrop line below
- Eyebrows: Optional downward angle toward center
- Head: Slight downward tilt
- **Implementation:** Curved mouth downward, tear line optional, body slumped

#### Worried
- Mouth: Straight dash or slight downward curve
- Eyes: Widened dots or oval shapes
- Eyebrows: Angle downward toward center (inverted V shape)
- Head: Slight upward tilt (looking up to speaker)
- **Implementation:** Mouth dash, wide eyes, eyebrows angled down

#### Thinking/Contemplative
- Mouth: Curved upward but subtle
- Eyes: Dots, looking upward or away (not centered)
- Eyebrows: Horizontal or slight angle
- Head: Tilt to side or back
- **Implementation:** Small smile, eyes directed up/side, posture leaning

#### Distressed/Anguished
- Mouth: Open (O shape or wide dash)
- Eyes: Very wide, possibly with radiating lines for intensity
- Eyebrows: Strongly angled downward
- Head: Any tilt depending on cause (fear = back, pain = forward)
- **Implementation:** Open mouth, wide eyes, body tension/contortion

#### Panting/Exhausted
- Mouth: Open with radiating short lines (breath lines)
- Eyes: Normal or slightly closed
- Eyebrows: Slightly raised
- Head: Tilted down/forward if exhausted
- **Implementation:** Open mouth with dash lines radiating, posture bent

#### Neutral/No Expression
- Mouth: Dash or dot (minimal)
- Eyes: Regular dots
- Eyebrows: Horizontal line or absent
- Head: Upright
- **Implementation:** Simple dash mouth, regular eyes, neutral posture

### Posture & Body Emotion Contribution
- **Relaxed:** Arms at sides, legs vertical, slight slouch possible
- **Tense:** Arms raised or crossed, body rigid, legs straight
- **Hunched:** Shoulders raised, body bent forward, arms close
- **Open:** Arms slightly raised, body upright, chest forward
- **Collapsed:** Body completely bent, arms down, legs weak

### Intensity Levels for Stick Figures
- **Low (subtle):** Small mouth curve, regular eyes, minimal body change
- **Medium (clear):** Larger mouth curve, slightly adjusted eyes, some body tension
- **High (obvious):** Exaggerated mouth shape, wide eyes, clear body posture change
- **Extreme (maximal):** Very open mouth, eyes as circles with radiating lines, dramatic body contortion

### Combining Elements for Complex Emotions
- **Relieved:** Smile mouth + relaxed body + head tilt back
- **Conflicted:** Straight mouth + tilted head + body facing one way but eyes another
- **Determined:** Straight mouth + forward-leaning body + direct eye gaze
- **Desperate:** Open mouth + body contortion + arms up/out
