# **Describabble Specs**

## *The Requirements Specification*

## **Section 1: What Describabble Is**

//in new

// in new

## **Section 3: The Components - (at the prototype stage)**

1. **Raw Script Prompts:** The initial script prompt with its adaptations. These are stored in the development environment and used for initial construction and testing.

2. **Discribabble Constructions Repository:** Stores modular .desc text files structured via custom naming conventions (e.g. `movie.characters.protagonist.moshe` or `scene1.background.desc`, or `scene2.sequence2.interaction`) containing clean, clearly analyzable, screenplay descriptions, after testing.

3. **Metababble Metadata Rule Files (.meta):** Shared extra information external to the descriptions such as defaults for parameters lacking from the given descriptors, or preferences for ambiguous situations. These are written in terse natural language.

4. **Translation Schema Files (.trans):** Configuration definitions in a natural language lexicon, identifying the parameters and their interconnections found in the .desc files.

   By looking at several .trans and .desc files along with their linked .meta files the program can easily render the scene in a methodic predictable way.

5. **AI Agent Parser:** A specialized, zero-parser LLM agent that translates natural language script commands into discrete spatial and temporal execution instructions based on .trans definitions.

6. **Procedural Animation Engine:** A client-side canvas renderer that takes agent instructions and animates stick figures and objects.

7. **Simulated AI Services:** Local simulation modules that mimic expensive cloud generative video/audio APIs for zero-cost prototyping.

8. **The Data Foundation:** (no-sql database and files).

## **Section 4: How It Works**

**1. Authoring / Input:** The user writes or generates clean natural language text describing a screenplay.

**2. General storyboard:** AI parses it into a terse formal general screenplay. Discusses the general theme with the user, and gets the user’s approval for the movie’s major layout.

**3. Initial Describ parsing:** AI works in three phases:
**3.1 Parameter Drafting:** AI now begins to construct a workable parameter list from the final accepted general storyboard and the prompt, and, if needed, on the fly creates or modifies `.meta` and `.trans` files for new never required screenplay parameters.

For example:

It's a survival movie (determined during the adjustments to the storyboard)

Scene 2: At the bridge

Tim runs towards the car.

Parameters:

* Survival - `NEW location.forest.meta`: animals, tree-type, sounds, weather

* Tim - `scene.participants.character`: name, looks, details

* The car - `scene.participants.object`: looks, detail

* Barbara (previous scene)

  $$
  not mentioned
  $$

   - `NEW scene.participants.others`

* runs - `scene.participant.movement`

* runs (Tim, The car) - `scene.participant.interaction`

* Bridge: - `scene.camera`: viewpoint, size, in-frame, movement, color

* Bridge: - `scene.background`: objects (colors, layout)

**3.2 Assumption Extrapolation:** AI constructs a completed parametric representation of the scenes, with the given and assumed parameters all filled.
**3.3 Screenplay reconstruction:** AI reconstructs the screenplay into a parsed structured text of the full movie, with all its scenes and elements, to be used as the basis for the user discussion.

For example:

@General:

It's a survival movie

generated: The scene is next to a burning building in the forest

@Bridge:

Tim runs towards the car. He looks worried.

* known: Tim (fig1), the car (The Green Car, from side, stationary, facing left)

* towards: from scene near left to far right

* assumptions:

  * camera: wide, behind (@bridge)

  * background: trees and the burning house (former scene, forest.meta)

scene: nothing to add or change

**4. Screenplay discussion:** The user can choose each scene and in it each element and discuss it in a prompt. Each scene has a version, and until the scene is determined, each scene can be independently rolled back and forward.

**5. Every change requested** modifies the Describs which then are reconstructed to modify the structured scene.
For example: The user writes it's not in the jungle, it's in the desert. The `movie.general.locations.all` is pointed to `location.desert.meta`.

Before modifying a Describ that will affect other parts of the movie, the user is warned what it will change and is given the choice:

1. to change it globally,

2. only in this scene, or

3. to explain what to do in the natural language AI chatbox.

AI stores the video as descriptions and reconstructs it from the descriptions with a fresh AI Agent that has no knowledge of the former screenplay and checks that Describabble got it correct.
They are in terse natural language, but can easily be translated into a structured format which is maintained behind the scenes:

* **General Instructions:** Global parameters, tone, and overall visual/narrative style.

* **Prefix / Header:** Metadata, versioning, and unique script ID.

* **Chapters:** Higher-level narrative segments and overarching plot structure.

* **Scenes (Core Building Blocks):** The atomic visual and chronological units containing:

  * **Characters:** Character profiles, finite state machines, and dynamic dialogue/voice parameters.

  * **Objects:** Interactive props and entity interaction logic (e.g., collisions, pickup).

  * **Background / Scenery:** Environmental definitions, lighting, and ambient visual elements.

  * **Camera Instructions:** Framing, trajectory, movement, angles, and perspective controls.

  * **Action / Movement:** Temporal timing, velocity, spatial cues, and procedural interpolation rules.

1. AI further parses these into detailed sub-descriptors such as characters, background elements, interactions called for in the scene inside modular `.desc` files.

2. **Storage:** The texts are compressed and stored in a NoSQL database along with a searchable summary that links to important parts of the descriptions (negligible storage size, typically under $2$ KB per video).

3. **Playback Request:** The client requests the video by fetching the lightweight `.desc` scripts and matching `.trans` and `.meta` parameter files.

4. **Agent Interpretation:** The AI interpreter reads the natural language lines, utilizes the `.trans` rules to extract parameters, breaks down the timeline, and maps actions to available sprite behaviors.

5. **Real-Time Rendering:** The canvas engine executes the frames smoothly, displaying the stick figure animation live to the viewer without streaming video data.

## **Section 5: Technologies & Cost-Free Simulation**

To maintain zero infrastructure cost during development, external or paid AI/video services are simulated locally:

* **Core Framework:** HTML5, Vanilla JavaScript, and Tailwind CSS for the frontend preview player.

* **LLM / Parsing Agent:** Lightweight regex or small local model mapping natural language `.desc` lines using `.trans` parameter definitions.

* **Animation & Action Simulation:** Custom JavaScript procedural keyframe interpolator.

  * *Action & Interaction Sub-module:* A finite state machine handling the $12$ prototype interactions (e.g., computing collision boxes for *picks up* or trajectory arcs for *throws*).

* **Audio:** Web Audio API synthesized procedural sound effects to simulate dynamic soundtrack generation.

## **Section 6: Hybrid Agentic Deterministic Back-End**

The backend architecture relies on a hybrid approach combining Mastra for multi-agent workflow coordination and the Vercel AI SDK powered by `gemini-flash-lite` for high-frequency model calls. Both tools work together in a synergistic architecture:

* **Mastra:** Orchestrates the complex multi-agent pipeline, managing specialized agent states, memory, and multi-step tool interactions (e.g., dramatic perspective agent, screenplay component expert, character looks analyst, and animation layout planner).

* **Vercel AI SDK (`gemini-flash-lite`):** Handles the high-speed text generation, structured object output (`generateObject`), and fast token streaming required for live parameter adjustments.

### Analysis, Storage, vs. Deterministic Rendering

The pipeline separates AI-driven analysis and text authoring entirely from client-side deterministic rendering:

* **Authoring & Translation Phase (AI-Heavy):** Natural language prompts are analyzed, broken down, and stored as lightweight `.desc`, `.meta`, and `.trans` text files. No heavy video or audio assets are generated or stored here—only structured semantic text.

* **Playback & Rendering Phase (Zero-AI Deterministic):** Once the text is translated into parameters, the AI drops out of the loop completely. A lightweight client-side renderer (such as an Expo Web / HTML5 canvas engine) takes the parameter maps and executes state machines and keyframe interpolators locally (starting with stick figures, then expanding to 2D animation). This guarantees zero latency, instant scrubbing, and zero streaming costs.

## Core architecture

1. **Analyzer** (`src/analyzer`)  
   Back-end on Vercel using the Vercel AI SDK + Mastra with `gemini-flash-lite` to manipulate `.desc`, `.meta`, and `.trans`.
2. **Author** (`src/author`)  
   Specialized chat-controlled UI built with React Native and Expo Web (web-first).
3. **Render** (`src/render`)  
   React Native + Expo Web renderer using PixiJS for high-performance 2D animation.
4. **Data** (`src/data`)  
   Upstash Redis-backed storage for compressed modular parts and fast-access summaries.

## Project layout (spec-level)

- `src/author/chat`
- `src/analyze`
- `src/data`
  - `data/general` (`desc`, `meta`, `trans`)
  - `data/movies/surveyor` (`desc`, `meta`, `trans`)
- `src/render`
- `dev/docs/` (`plans`, `progress`)
- `dev/testing` with per-section testing folders:
  - `testing/features` (Cucumber)
  - `testing/units` (Jest)
  - `testing/ete` (Playwright)

Important files: 
-(root) readme.md
- plans: 
  - specs.md 
  - components.md
  - 