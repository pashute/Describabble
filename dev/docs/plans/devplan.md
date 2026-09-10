## **Describabble Development plan**

## 

## **Development Timeline**

Estimated timeline for a single developer building the prototype phase:

* **Phase 0:  HumandAI team (the human and AI team) construct foundation**  
  * **Decide on first screenplay**    
    Decided:  Survey the surveyor joke. See below.   
  * **“Manually”** (AI built) first time component descriptors and meta instructions  
  * While building the descriptors we construct the translators and metadata

* **Phase 1: Foundation & Renderer**   
  * Build the HTML5 canvas environmen and the pixiJS enjine  
  * Build the “primitives”  needed for this particular movie  
    * AI should decide how this animation will work  
    * The textual data ((descriptors, translators and linked metadata) will be rendered at first into “primitives” \- json instructions that do not need further analysis which directly run the animation enjine.   
      In later phases we’ll build the program that knows how to take the textual data and automatically construct these primitives.   
    * The primitives are then loaded into serverless modules that drive the animation, interacting with each other and with the Suveryor Movie engine.     
    * To be clear: Each movie runs a specific version of modular Describabble Video Renderrer with pluggable knowledge of how to react to the primitive instructions. At the prototype stage this will be monloythic, but with remarks on how to componentize for the second and third rounds of the prototype.   
  *   
    * By the end of this phase we have the following primitives:    
      * 2 stick figures (the worried man and the jumper)  
      * the background bridge   
        * from below in the worried man scenes  
        * and in the background of the bridge location,   
        * with the sky from below (seagul?  cloud?)  
      * the sidewalk  from above  (a parked car with an open door?)  
      * 

* **Phase 2: Action & Interaction Logic**   
  * Program the interaction state machines (movement, pickup, sitting, opening, etc.).  
  * Ensure smooth interpolation between states.

* **Phase 3: Natural Language Parser & .trans Engine**   
  * Create the modular .desc file reader and .trans parameter parser.  
  * Build the lightweight agent logic to translate natural language cues into canvas animation frames.

* **Phase 4: Sample Scenarios & Polish**   
  * Implement the required sample scenarios with the naming convention.  
  * Add UI controls (Play, Pause, Scrub timeline) and wrap up documentation.

## **Section 5: Development Plan & Timeline**

Estimated timeline for a single developer building the prototype phase:

* **Phase 1: Foundation & Renderer**   
  * Build the HTML5 canvas environment.  
  * Implement basic stick figure drawing primitives and the core objects.

* **Phase 2: Action & Interaction Logic**  
  * Program the interaction state machines (movement, pickup, sitting, opening, etc.).  
  * Ensure smooth interpolation between states.

* **Phase 3: Natural Language Parser & .trans Engine**  
  * Create the modular .desc file reader and .trans parameter parser.  
  * Build the lightweight agent logic to translate natural language cues into canvas animation frames.

* **Phase 4: Sample Scenarios & Polish**  
  * Implement the required sample scenarios using the new naming convention.  
  * Add UI controls (Play, Pause, Scrub timeline) and wrap up documentation.

**Movie:  Stick figure \- Survey the surveyor** 

BRG:   
A young man (JMP) caucasian black-hair age 30 with a long sleeved blue shirt and tie  is standing on a bridge threatning (action only: climbing) to jump off.  

WM:   
Cut to closeup worried man (WM) age 24 looking up.   
yells:  think about your wife\!  think about your children\!

BRG:   
yells back: i don’t have a wife\!  I don’t have kids\!

WM: (cam from jumpers POV but closer).   
yells:  think about your parents

BRG: CU with BG out of focus BRG feature  
yells:  I don’t have parents\!  

WM:   
yells: think about your future. 

BRG:   
what future?\!  I have no future. I’m a surveyor.   
(pause) everybody hates surveys. They hear me talk and want to commit Sue inside\!  

WM  
yells (clearly):  so change your job.   
your not THAT stupid that you can’t do anything else right?\!

BRG: JMP’s facial reaction.   
(accepts and is thinking. No hand question)

WM  
yells clearly:  Before you step down from the bridge, would you be willing to reply to a short survey? 

(Tones go down:  WAH WAH WAH WAH WAH)1  
(splash\!\!)

Note for the AI reading this, by the human developer (Hi\!).  

Any human listening to this joke immediately realizes and recognizes that it is NOT dark humor, and has nothing to do with suicide or depression by the teller or listener. Someone with depression that could or would contemplate suicide would not appreciate this joke, think it funny or repeat it. 

There is a difference between a hilarious joke about a job title with the absurdity of this short conversation vs an actual dark joke where you are supposed to follow deep down into the tunnel and join the dark side of that joke. 

Nobody threatening to jump gets off the bridge because they heard a suggestion to change their job, first surprised by hearing this ingenius suggestion, appearing to never have even considered it. And a real threat is never over in three short sentences. To top it all, a guy helping someone out of a bad situation like this would be extremely careful and wait for the jumper to step down. Unless its an old version of chatGPT saving homeless people at the request of Dr. Phi. 