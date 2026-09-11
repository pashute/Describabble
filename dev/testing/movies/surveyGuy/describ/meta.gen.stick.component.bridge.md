# Stick Figure Bridge Component Metadata

`Filename: meta.gen.stick.component.bridge.md v0.1.2`

## How Stick Figures Draw Minimal Bridges

Using only simple lines and shapes to represent bridges in animation.

### Minimal Line Elements for Bridge Drawing

**Horizontal Lines:**
- Road/Deck: Single horizontal line (or double for width)
- Fence Top Rail: Horizontal line above road
- Fence Poles: Short vertical lines at regular intervals between rail and road
- Suspension Cables (Hangers): Short vertical lines from main cable to rail
- Other Horizontal Elements: Any additional structural line

**Curved Lines:**
- Suspension Cable (Catenary): Downward-arcing curve above rail
- Arch: Upward-arcing curve if arch bridge style

**Vertical Lines:**
- Support Columns: Vertical lines below deck
- Tower (if suspension): Tall vertical line(s) above/beside deck
- Fence Poles: Vertical connecting rail to road

### Specific Bridge Types in Stick Notation

#### Suspension Bridge (Minimal)
```
     /\          /\         <- Towers (optional, can omit)
    /  \        /  \
   /    \_____/    \        <- Main cables (catenary curves)
   |  |  |  |  |  |  |      <- Suspension hangers (vertical lines)
   |                  |      <- Fence top rail (horizontal)
   |  |  |  |  |  |  |      <- Fence poles (verticals)
   |________________|       <- Road/deck (horizontal)
```

#### Simple Beam Bridge
```
   =================        <- Road/deck
   | | | | | | | |         <- Support columns (verticals below)
```

#### Arch Bridge
```
         /‾‾‾‾‾\            <- Arch curve
        /       \
       |         |          <- Supports at ends (verticals)
   =================        <- Deck
```

### Drawing Rules for Stick Bridges

**Minimalism First:**
- Use fewest lines possible to communicate bridge type
- Deck is always a horizontal line (or implied)
- One or two other elements identify bridge type (cable = suspension, arch = arch, etc.)

**Proportions:**
- Towers (if drawn): 1.5-2x height of deck
- Cable curve: Arc depth ~0.3-0.5 of span width
- Fence poles: Short segments, spaced evenly
- Hangers: Thin lines connecting cable to rail

**Scale Consistency:**
- All bridge elements same scale (not realistic, but consistent)
- Character size relative to bridge shows magnitude of structure
- If character is small vs. bridge, structure feels massive/isolating

### POV-Specific Bridge Rendering

#### Riverside POV (Looking Up)
- Show full bridge structure: deck, rail, poles, cables
- Bridge fills upper portion of frame
- Character visible against bridge backdrop
- Sky or void above bridge
- River/ground in foreground (implied or shown)

#### Bridge POV (Looking Down)
- Show minimal bridge elements (edges, posts)
- Deck mostly fills frame (we're on it)
- Ground far below (small, distant)
- Character on bridge appears to look down toward ground below

#### Overhead POV
- Deck shown as rectangular shape
- Rails as parallel lines on sides
- Cables (if visible) as converging lines toward towers
- Poles as small marks along rails

#### Side View (Most Common)
- Profile of bridge
- Vertical lines (towers, support columns) prominent
- Horizontal line (deck) across middle
- Cables as curves from towers to deck
- Character positioned relative to these elements

### Component Details for Stick Bridges

**Fence/Rail System:**
- Top Rail: Single or double horizontal line
- Poles: Vertical lines at regular spacing (suggest railing texture)
- Gap: Visual space between poles (don't fill solid)
- Height: Rail typically shown above character's head height

**Suspension Cable:**
- Main Cable: Smooth downward-arcing curve (catenary)
- Curve Depth: Arc slightly deeper than perfectly smooth (realistic cable sag)
- Hangers: Evenly-spaced vertical lines from cable to rail
- Asymmetry Optional: If tension is different (not needed for stick figures)

**Deck/Roadway:**
- Simple Line: Single horizontal line suffices
- Width Indicator: Double parallel lines show width
- Texture: Minimal (maybe small hash marks) if needed
- Isolation: Space between deck and ground shows height

**Support/Ground:**
- Columns: Vertical lines below deck
- Foundation: Horizontal line at base (ground level)
- Water/River: Wavy line or blue color (if color available)
- Distance: Space between deck and ground conveys height impact

### Animation Considerations

**Static Bridge:**
- All lines remain in fixed position
- No animation needed

**Moving Camera Around Static Bridge:**
- Bridge lines stay fixed
- Character or camera reference point changes perspective
- Effectively "rotates" viewer's angle

**Bridge Elements in Motion (Rare):**
- Swaying cables: Slight perpendicular curves/wobbles
- Moving vehicles: Small dots/symbols on bridge
- Water below: Gentle wave animation

### Scale for Emotional Impact

**Massive Bridge:**
- Bridge dominates frame
- Character appears tiny
- Creates isolation, insignificance, dread
- Useful for: Despair, loneliness, weight of situation

**Moderate Bridge:**
- Bridge and character similar scale
- Bridge is prominent but not overwhelming
- Creates confrontation or dramatic tension
- Useful for: Conflict, decision-making

**Simple/Minimal Bridge:**
- Barely visible structure
- Character focus primary
- Emphasizes interpersonal connection
- Useful for: Dialogue, emotional exchange
