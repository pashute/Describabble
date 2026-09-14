`Filename: batch.instructions.md v0.1.6`

0.1 clear the todo (but of course not the instructions on top)

0.2 Read the todo.instructions.md  and accordingly plan the new instructions into the todo as batches with batch names, i.e. `# Batch Sept 14 19:35 Stick proj complete`  and subsections i.e. `## B.Sept14 19:35 state machine`

0.3 Once done writing the plan (which includes the last two lines of callme.ps1 and version report for each batch) depending on the instruction you received:  

0.3.1  Without a specific instruction to execute the todo, get the developer's approval:  Do not begin executing the todo till approved. And when you do get the approval, remember the beeps!

0.3.2  With a specific instruction to execute the todo without questions once written, execute it immediately. And remember the beeps!

0.4  All new files and touched files get advanced patch of version in the filename header. 
for md: `Filename: {filename} v{newversion}`
for ts or js: // Filename: {filename} v{newversion}

0.5 In the version report at the end of the batch, report the sw name and version number that will be shown during the software execution. If more than one package or project is being updated report each with its name and version. 