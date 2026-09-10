# Describabble Descriptive Parsing and Constructing Architecture

The Describabble Describ files are defined as a structured, declarative representation of video and screenplay components, allowing modular script descriptors, metadata, and lexical translations to be parsed into full production scenes.

## **1.  System Architecture**: 

Descibabble Describ types: 

1. `.desk` - Modular script descriptor files
2.  `.meta` - Metababble metadata and default parameter rules)  
3. `.trans` - Translation lexicon files creating a parametric schema for descriptions)

##  2.  Architecture Details 

**2.1 Movie Metadata**:

Movie metadata includes information not present in the descriptors and parameters that are could be missing from the translation lexicon schemas. 

Movie and scene metadata is usually given as rules in Tarzan English, or as lists, with easily understood headlines. They fill in for typical states like a genre, an accent, or a mood. 

**Sample fields covered by .metadata**

1. Genre & Tone (Global stylistic frameworks)  
2. Global Logline & Premise  
3. Mood & Visual Palette  


```
markdown

**Example**:  genre.comedy `.meta`  
   usually has surprise punchline at end.      
    overone:  sly and dry or slapstic (sequence of absurdities or puns)  
     comic scenes or shots  
      comic buildup  
     humorous style:  irony, cynicism, parody, sarcasm, absurd, satirical
```

```
markdown

example1: attire.office `.meta`  
	men usually wear suits,   
	women dress elegantly  
	often shown preparing hurriedly for work   
(brushing teeth. men: shaving. women: makeup)  
back from work in work attire.   
afterwork:  change of clothes depends on destination  
default: men to sports or tee shirts, women to more attractive attire  
night at home: casual assortment, or pygamas. 
```

**2.2 Lexicon Schemata .trans**

The lexicons in the `.trans` files are lists of terms and their related terms that should be looked for by the ai   
as parameters to categorize the text in the scene. 

General `.trans` files are called by their field name.   
Scene specific `.trans` files created specifically for this movie or scene have a prefix of m for movie or s for scene, and the scene number prefix to the translation file’s main topic. 

Example 1.  General characters `.trans` file:

**characters.trans**  

- character
-- participation:
---lead (protagonist,high importance), 
----support (mid importance), 
----or extras (low importance).
-- profile (age, name, gender, actor details, stage name), 

- profession, role (parent)
- gender see gender.typical  and gender.active
- mood: overall
    positive: (inventive, creative, happy, smart, interesting, wishful, powerful, 
               calm, protective, funny, charismatic, leader, attentive, caring),
    or negative (depressed, sleepy, aggressive, 
                  toxic, sick, psychopath, indifferent)  
- awareness :
    aware (currently knows whats happening), mistaken (false thoughts), unaware  
- looks:  attire, body looks (general specifics)

mv = m.surveyGuy  
scn = mv.scene1  
mv.character.JMP: profession, looks [gender, age, hair, expression, attire], mood, voice  
scn.settings.BRG: elements (e.g. cable), ambient, background, cam (angle, distance, width,foucs)  
scn.*.interaction.dialog,mood,tone

**2.3 Descriptor Sequence Referencing**:

**sceneN.seq.n** - Narrative play sequence holds links to the parts that constitute the sequence. part

**Example** for The surveyGuy scene one shot 2: (there’s only one scene in the whole movie)

Original texts: 

WM:   
Cut to closeup worried man (WM) age 24 looking up.   
WM yells:  think about your wife!  think about your children!

  bridge seen from reverside sidewalk.   
  = cam on sidewalk looking to bridge  
  WM looking up from far. 

  m.surveyGuy.scene1.shot2.seq.1.desc  
       this.cam.sidewalk.to.bridge // = m.surveyGuy.scene1.cam.sidwalk.to.bridge.trans  
         
      

**seq.shooting** - Production shooting sequence of each scene, points to a play sequence. 

1. **Screenplay Structure**:

   1. Chapters, Plot segments & Plot Points  
   2. Action lines, Beats & Pacing  
   3. Transitions  
   4. Dialogs & Parenthetical directions  
   5. Shots (Camera movements, framing, scale)

   6.   
2. **Scene Building Blocks**:  
   1. Characters (, finite state machines, Archetypes, Motivation, Flaw)  
      1. Looks: gender, age, hair shape and color, facial hair, skin tone, dress, eye color, and detailed physical/non-standard descriptors (e.g., character.clothes.tie.dishevelled, character.face.interaction)  
      2. Profiles and archtypes with Motivations strenths and flaws

   2. Objects   
      1. Looks: shape, color, texture  
      2. Interactive props, collision/physics logic

   3. Scenery / Background   
      1. Environment, Lighting,   
      2. Ambient elements

   4. Action / Movement (Temporal timing, velocity, spatial cues)

3. **Audio & Music Layers**:  
   1. Audbabble (Voices, accents, speech synthesis)  
   2. Musociopath (Music, phrases, sync points)

## Example: surveyGuy Joke Stickman Movie

We are taking the general movie directives and the first four short shots of the single scene short movie. 

### Original prompt

BRG:   
A young man (JMP) caucasian black-hair age 30 with a long sleeved blue shirt and tie  is standing on a bridge threatning (action only: climbing) to jump off.  

WM:   
Cut to closeup worried man (WM) age 24 looking up.   
WM yells:  think about your wife!  think about your children!

BRG:   
JMP yells back: i don’t have a wife!  I don’t have kids!

WM: (cam from above at jumper’s POV but a closer: a bit less than halfway from bridge to WM).   
WM yells:  think about your parents

### Adjustments with Chat

Movie genre: comedy,  plot: a joke with a subtle puchline and an ending comic effect.   
Single scene (river bridge and sidewalk) 

Shot 1 BRG    
  - bridge element (ropes) in background   
   cam from bridge road.   
   man climbing withback to camera, facing away, unaware of it.   
   Panting aggravated sound. 

Shot 2 WM   
  bridge seen from reverside sidewalk.   
  = cam on sidewalk looking to bridge  
  WM looking up from far.   
Shot3 BRG -   
  cam looking down from behind JMP,   
  cam direction towards reverside sidewalk.   
  diagonal angle from JMP to WM   
  camera distance ¾ of way from bridge to WM.   
  WM face not clear. Head looking up. 

**Reconstruction Test**

The following text descriptors, translators and metadata should be enoug to  recreate the first and second scene of the movie. To test it AI should reconstruct the general section and the first and second scenes of the screenplay,  from these descriptors. 

If the test fails and something is missing The AI should complete it, and try again.   
If a descriptor is causing the reconstruction to fail an attempt should be made to modify the translator lexicons or the metadata so it will succeed. Otherwise the descriptor should be marked as unused  but kept in the example. 

7. **Global Descriptors**:

   1. movie.genre.desc: Comedy   
   2. movie.tone.desc: Dry “factual”  
   3. movie.pJoke: Turns out worried man is a surveyGuy himself. 

8. **Translators (.trans)**:

   1. stickman.bodyparts:   
      1. leg --thigh (top above knee), shin (below knee), foot (on floor)  
      2. face   
         1. eyes : shape, color direction,   
         2. mouth : shape, color, direction,   
         3. facial hair:  mustache, beared: shape and color  
         4. hair: shape, color  
   2. Localization keys for stickman archetypes and   
   3. environmental.bridge:  

9. **Scene Breakdown**:

   1. **Scene 1**: Man climbing/threatening to jump  
        
        
      1. Sequence Reference: seq.play: 01 | seq.shoot: 004  
      2. Character State: Distressed jumper on ledge, high emotional intensity state  
   2. **Scene 2**: Cut to worried man begging  
      1. Sequence Reference: seq.play: 02 | seq.shoot: 005  
      2. Character Descriptors:  
         1. character.clothes.tie.dishevelled: 'tie folded over on shirt or over shoulder contemplating'  
         2. character.bodyparts.face.interaction:  
            1. smile  
            2. cry  
            3. contemplate 'a smile that quivers and gets bigger while eyes slightly crossed'

