# Instructions for the AI to use Todo.md

## Filename todo.instructions.md  v0.1.1


## Purpose

The todo.md file for planing and tracking tasks and progress.

- Useful for AI after a crash
- Useful for Developer to instruct the AI and follow. 


## Strict Terse Instructions

### 1. The Todo Header

- The 13 line Todo header should not be touched.
- The version number there denotes the header version, not the file version. 
- If by some mistake the header was changed or removed, it should be restored from the following:

```
# AI's Todo Tracker

## Filename: todo.md v0.2.2

- don't forget to beep and to mark the tasks as you advance.

- [ ] planned, [[ ]] planned critical - stop batch if fails
- [>] single in progress item. 
- [V] previously completed, [v] done.
- [!] problem so skipped, `[?]` reached here and needs user attention

Do not touch this file before re-reading the `todo.instructions.md`. Follow those instructions to the tee. Don't forget the beeps, version report and callme. 

--- text may begin 2 lines below this line ---
```

- **TERSE:** All todo items must be terse headlines without details. NO VERBOSITY ANYWHERE. 

- **Batches:** AI writes the plan first in batches and sections 
  - Batch header: eg. # bSept3 morning
  - Section header: eg. ## bSept3.sec1 
  - Header spacing: Leave two empty lines before the header, and one empty line after it. 
  - batches may be mentioned in the commit messages but not in the code files or documentation. 
  - code files only comment on what they do and how, not on changes made to them. 

- ***Beeps:***
- `beep.ps1` should be invoked before each step.
- `callme.ps1` should be invoked when batch is done or BEFORE an action that will need the user's attention or permission.
- when planning steps, write `- beep.ps1` before each step or `- callme.ps1` when needed, as a reminder to beep. No checkbox because they are only reminders. 
- Tell the version of software being written, in the last line of the chat, after a batch is done.


# Avoid Non-Permitted Actions

- Avoid non permitted file invoking, which will bring up an Allow button and the alert won't be heard. 
- Avoid chaining terminal commands together in one line if it will cause permissions to be requested. i.e. `cd` is permitted for the project folder only. Chaining an action after it will cause the ALLOW button to pop up, pausing the automation. 

# checkboxes
- Every task should have a bulleted checkbox `- [ ]` to indicate its completion status.
- A critical task that needs to stop the batch if failed will be marked with a double square bracket `- [[ ]]`.
- Mark `- [>]` on only one task in the file before you - On completion markas follows 
- `[V]` previously completed, `[v]` done. 
- `[!]` problem so skipped, `[?]`  for when reached the stage that you need attention. Note for planned discussions do not mark [?] till previous tasks completed or skipped. 


- **Problems** If a problem was encountered, a terse telegraphic headline should be added as a bullet at the location. no detailed info here. 

temp.ai.md in the dev/docs/progress/ folder as a scrap file to write whatever it needs. the file should be set in gitignore. AI may user a proress/
