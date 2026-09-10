# **Describabble Specs** 

`# Filename: specs.md v0.1.1`

## *The Requirements Specification* 

## 1. What Describabble Is

Describabble is a "dataless" video storage and playback system. Instead of saving heavy video files (MP4, WebM) or high-bandwidth bitstreams, Describabble stores ultra-lightweight natural language  `.desk`  script files, modular translation schemas, and shared metadata .meta files.

 During playback, specialized AI agents parse these human-readable text definitions in real-time using .trans parameter maps to procedurally reconstruct, animate, and render the video on the fly. This reduces storage requirements by over 99% and makes every video fully editable and searchable as simple text.

## 2. Four Core Architecture Parts of Describabble

1. **Analyzer (Back-End):** Hosted on Vercel, utilizing the Vercel AI SDK and Mastra with `gemini-flash-lite` to manipulate `.desc`, `.meta`, and `.trans` configuration files.

2. **Author (UI):** A specialized chat-controlled UI built using React Native with Expo Web as the primary target.

3. **Render:** Built on React Native and Expo Web (first) using PixiJS for high-performance 2D WebGL/HTML5 canvas animation.

4. **Data:** Powered by Upstash Redis to store compressed modular parts and fast-access summaries.



## **Section 3: The Descriptors - (at the prototype stage)**

1. **Raw Script Prompts:**  The initial script prompt with its adaptations. These are stored in the development environment and used for initial construction and testing.

2. **Discribabble Constructions Repository:** Stores modular  `.desk`  text files structured via custom naming conventions (e.g. movie.characters.protagonist.moshe  or scene1.background.desc, or scene2.sequence2.interaction) containing clean, clearly analyzable, screenplay descriptions, after testing. 

3. **Metababble Metadata Rule Files (.meta):** Shared extra information external to the descriptions such as defaults for parameters lacking from the given descriptors, or preferences for ambiguous situations.  These are written in terse natural language.

4. **Translation Schema Files (.trans):** Configuration definitions in a natural language lexicon,  identifying the  parameters and their interconnections found in the  `.desk`  files.
   
   By looking at several `.trans` and  `.desk`  files along with their linked .meta files the program can easily render the scene in a methodic predictable way. 

5. **AI Agent Parser:** A specialized, zero-parser LLM agent that translates natural language script commands into discrete spatial and temporal execution instructions based on .trans definitions.

6. **Procedural Animation Engine:** A client-side canvas renderer that takes agent instructions and animates stick figures and objects.

7. **Simulated AI Services:** Local simulation modules that mimic expensive cloud generative video/audio APIs for zero-cost prototyping.

8. **The Data Foundation** (no-sql database and files)


## **Section 4: How It Works**

**1. Authoring:** The user writes or generates clean natural language text describing a screenplay. 

**2. General storyboard:**  AI parses it into a terse formal general screenplay.  Discusses the general theme with the user, and gets the user’s approval for the movie’s major layout.. 

**3. Initial Describ parsing:**  AI works in three phases: 

**3.1 Parameter Drafting**:  AI now begins to construct a workable parameter list from the final accepted general storyboard and the prompt, and, if needed, on the fly creates or modifies .meta and .trans files for new never required screenplay parameters.  

For example:    
   Its a survival movie (determined during the adjustments to the storyboard)  
   Scene 2 At the bridge  
   Tim runs towards the car.

Parameters:    
	Survival - NEW location.forest.meta:  animals, tree-type, sounds, weather  
	Tim - scene.participants.character: name, looks, details  
	The car - scene.participants.object: looks, detail  
	Barbara (previous scene) [not mentioned] - NEW scene.participants.others  
	runs - scene.participant.movement:   
	runs (Tim, The car)  - scene.participant.interaction:   
	Bridge: - scene.camera:  viewpoint, size, in-frame, movement, color  
	Bridge: - scene.background:  objects (colors, layout)

**3.2  Assumption Extrapolation**: AI constructs a completed parametric representation of the scenes, with the given and assumed parameters all filled. 

**3.3 Screenplay reconstruction:** AI reconstructs the screenplay into a parsed structured text of the full movie, with all its scenes and elements, to be used as the basis for the user discussion.

For example:  

@General:    
Its a survival movie  
   generated:  The scene is next to a bruning building in the forest

@Bridge:   
Tim runs towards the car. he looks worried.   
known:  Tim (fig1),   
                  the car, The Green Car, from side, stationary, facing left  
                  towards: from scene near left to far right.   
                  the car:  The Green Car

assumptions:   
	     camera: wide, behind (@bridge)  
                   background: trees and the burning house (former scene, forest.meta) 

scene: nothing to add or change

**4. Screenplay discussion**:  The user can chose each scene and in it each element and discuss it in a prompt. Each scene has a version, and until the scene is determined, each scene can be independently rolled back and forward. 

5. Every change requested modifies the Describs which then are reconstructed to modify the structured scene. 

For example:  The user writes its not in the jungle its in the desert. 

The movie.general.locations.all  is pointed to location.desert.meta

Before modifying a Describ that will affect other parts of the movie, the user is warned what it will change and is given the choice 1. to change it globally, 2.  only in this scene. or 3. to explain what to do in the natural language ai chatbox. 

and reconstructs the full movie layout as scenes with their elements in a structured text document: 

User interaction.  When the user responds in a prompt the text is updated accordingly. 

 

AI stores the video as descriptions and reconstructs it from the descriptions with a fresh AI Agent that has no knowledge or the former screen play and checks that Describabble got it correct  
They are in terse natural language, but can are easily be translated into a structured format which is maintained behind the scenes. 

* **General Instructions:** Global parameters, tone, and overall visual/narrative style.  
  * **Prefix / Header:** Metadata, versioning, and unique script ID.  
  * **Chapters:** Higher-level narrative segments and overarching plot structure.  
  * **Scenes (Core Building Blocks):** The atomic visual and chronological units containing:  
    * **Characters:** Character profiles, finite state machines, and dynamic dialogue/voice parameters.  
    * **Objects:** Interactive props and entity interaction logic (e.g., collisions, pickup).  
    * **Background / Scenery:** Environmental definitions, lighting, and ambient visual elements.  
    * **Camera Instructions:** Framing, trajectory, movement, angles, and perspective controls.  
    * **Action / Movement:** Temporal timing, velocity, spatial cues, and procedural interpolation rules.

1. AI further parses these into detailed sub-descriptors such as characters, background elements, interactions called for in the scene (picking up a ball, lighting a cigarette) inside modular  `.desk`  files.
   
2. **Storage:** The texts are compressed and stored in a nosql along with a searchable summary that links to important parts of the descriptions.  (negligible storage size, typically under 2 KB per video).  

3. **Playback Request:** The client requests the video by fetching the lightweight  `.desk`  scripts and matching .trans and .meta parameter files.  
4. 
5. **Agent Interpretation:** The AI interpreter reads the natural language lines, utilizes the .trans rules to extract parameters, breaks down the timeline, and maps actions to available sprite behaviors. 
6.  
7. **Real-Time Rendering:** The canvas engine executes the frames smoothly, displaying the stick figure animation live to the viewer without streaming video data.

## 

## 

## **Section 4: Technologies & Cost-Free Simulation**

To maintain zero infrastructure cost during development, external or paid AI/video services are simulated locally:

* **Core Framework:** HTML5, Vanilla JavaScript, and Tailwind CSS for the frontend preview player.  
* **LLM / Parsing Agent:** Lightweight regex or small local model mapping natural language  `.desk`  lines using .trans parameter definitions.  
* **Animation & Action Simulation:**  
  * Custom JavaScript procedural keyframe interpolator.  
  * *Action & Interaction Sub-module:* A finite state machine handling the 12  prototype interactions (e.g., computing collision boxes for *picks up* or trajectory arcs for *throws*).  
* **Audio:** Web Audio API synthesized procedural sound effects (e.g., simple beeps or footstep clicks) to simulate dynamic soundtrack generation.

1. 

