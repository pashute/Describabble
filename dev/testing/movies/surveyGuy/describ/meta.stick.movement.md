# Stick Figure Movement Metadata

`Filename: meta.gen.stick.movement.md v0.1.2`

## Movement Conventions for Stick Figures

Interpolation rules and posture patterns for common stick figure animations.

### Walking
- **Leg Animation:** Legs alternate in straight lines (left forward/right back → right forward/left back)
- **Stride Length:** Distance between legs indicates speed (short = slow walk, long = running)
- **Arm Motion:** Arms swing opposite to legs (left leg forward → right arm forward)
- **Torso:** Slight up-down bob with leg motion, stays roughly vertical
- **Head:** Follows torso motion, no independent tilt
- **Timing:** Smooth interpolation between leg positions

### Running
- **Leg Animation:** Legs alternate faster, more angle (higher leg lift)
- **Stride Length:** Much larger than walking
- **Arm Motion:** Faster arm swing, more pronounced
- **Torso:** More pronounced up-down motion, may lean slightly forward
- **Head:** Stable but body leans forward slightly
- **Timing:** Faster interpolation speed

### Climbing
- **Body Angle:** Tilt entire stick figure forward/upward (30-45° angle)
- **Leg Motion:** Legs bend at knees, raising upward (climbing position)
- **Arm Motion:** Arms extend upward, gripping position (hands at climb level)
- **Torso:** Angled to follow climb direction (upward lean)
- **Head:** Follows body angle, typically forward/downward while climbing
- **Timing:** Slower, more deliberate than walking

### Standing/Idle
- **Legs:** Vertical lines, feet on ground, no motion
- **Arms:** At sides (neutral), or varied position for balance/gesture
- **Torso:** Vertical, upright
- **Head:** Centered above torso
- **Body Sway:** Optional subtle side-to-side motion for natural feel

### Looking Up/Down
- **Head Motion:** Tilt head back (looking up) or forward (looking down)
- **Eye Direction:** Adjust eye/mouth direction to match head tilt
- **Body:** Typically stays upright while head tilts (unless searching)
- **Angle Range:** 30-45° tilt for normal look, up to 90° for extreme

### Gesturing
- **Pointing:** Raise one arm, extend, hand indicates direction
- **Waving:** Arm raised to side or overhead, hand circles or moves side-to-side
- **Shrugging:** Shoulders raise (shorten torso slightly), arms to sides
- **Emphatic:** Both arms raise/extend, body leans into gesture

### Sitting
- **Legs:** Bent at knee, feet back or to sides
- **Torso:** Upright or reclined depending on sitting style
- **Arms:** Can be at sides, on knees, or raised
- **Head:** Follows torso angle
- **Typical Positions:** On chair (upright), on ground (reclined), on edge (forward lean)

### Jumping/Falling
- **Legs:** Fully extended downward or in mid-jump pose
- **Body:** Vertical or slightly tilted
- **Arms:** Often raised upward during jump, down during fall
- **Timing:** Quick interpolation for impact, slower for recovery

### Panting/Exhaustion
- **Body Posture:** Bent forward or hands on knees
- **Chest/Torso:** Up-down motion subtle or absent
- **Head:** Downward tilt
- **Arms:** Hanging down or supporting on knees
- **Breathing Animation:** Chest compression/expansion implied by body posture

## Interpolation Principles

### Linear Interpolation
- Default for most movements
- Position changes smoothly from start to end over time
- Used for walking, climbing, looking

### Easing Functions (Optional)
- **Ease-in:** Motion starts slow, accelerates (getting into action)
- **Ease-out:** Motion starts fast, decelerates (finishing action)
- **Ease-in-out:** Smooth acceleration and deceleration (natural feel)

### Keyframe-Based Animation
- Define key positions at specific times
- Interpolate between key positions
- Works for any complex movement

### Cycle Animations
- Walking/running: Repeating leg/arm cycle
- Idle sway: Repeating subtle side-to-side motion
- Breathing: Repeating chest expansion/contraction

## Timing Guidelines
- **Walking:** 0.6-1.0s per stride cycle
- **Running:** 0.3-0.6s per stride cycle
- **Climbing:** 1.0-2.0s per limb movement
- **Looking:** 0.2-0.5s to complete
- **Gesture:** 0.5-1.5s depending on emphasis
- **Idle sway:** 1.5-3.0s full cycle
