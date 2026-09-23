# Debugging Guide - The Survey Guy

## Browser DevTools (F12 or Ctrl+Shift+I)

### Console Tab
- See all `console.log()` output and errors
- Type commands directly to interact with player
- Shows any JavaScript errors that occur

### Network Tab
- Watch .vid file loading
- Check if resources (images, scripts) are loading
- Monitor request/response times

### Elements Tab
- Inspect canvas and HTML structure
- See current DOM state

### Sources Tab
- Set breakpoints to pause execution
- Step through code line by line
- Watch variable values

## Debug Features Built Into Player

### Debug Button (🔍)
Located in top-right of player controls. Click to log current shot's active elements to console:
```
console.log(window.__PLAYER__.getActiveElements())
```

Output shows:
- Character IDs (char1, char2, etc)
- Current positions (standing-on-road, hanging-on-fence, etc)
- Emotions (worried, contemplative, etc)
- POV (from-below, from-bridge, credits-screen)
- Current playback time

### Canvas Click Diagnostic
Click anywhere on the canvas to log to console:
- Pixel coordinates where clicked (x, y)
- List of all characters in current shot
- Their position specifications

## Direct Console Access

Open DevTools Console and type:

```javascript
// View entire player instance
window.__PLAYER__

// View loaded .vid manifest (all shots, characters, dialogue)
window.__PLAYER__.manifest

// View current shot being rendered
window.__PLAYER__.currentShot

// View current playback time in seconds
window.__PLAYER__.currentTime

// View player state
window.__PLAYER__.isPlaying
window.__PLAYER__.duration

// View canvas properties
window.__PLAYER__.canvas.width
window.__PLAYER__.canvas.height
```

## Server Management

### Check if Server is Running
Windows:
```powershell
netstat -ano | findstr :3003
```

Mac/Linux:
```bash
lsof -i :3003
```

### Start/Stop Server

Stop: `Ctrl+C` in the terminal where server is running

Start with standard mode:
```bash
cd src/stickvid
npm start
```

Start with auto-reload (development):
```bash
cd src/stickvid
npm run dev
```

Run on different port if 3003 is busy:
```bash
PORT=3004 npm start
```

## Common Debug Workflow

1. Open browser DevTools (F12)
2. Open Console tab
3. Load .vid file in player
4. Click Debug button or canvas to log state
5. Check Console for output
6. Use `window.__PLAYER__.` commands to inspect specific values
7. Set breakpoints in Sources tab for deeper investigation

## What to Look For

**When Load File doesn't work:**
- Check Console for error messages
- Use Network tab to see if .vid file loaded
- Check if `window.__PLAYER__.manifest` is populated

**When character doesn't render:**
- Check `window.__PLAYER__.currentShot.characters`
- Click Debug button to see active elements
- Check character position, size, and POV values

**When animation doesn't play:**
- Check `window.__PLAYER__.isPlaying` 
- Check `window.__PLAYER__.currentTime` progresses
- Look for errors in Console tab

**When colors/sizing look wrong:**
- Use Canvas click to get coordinates
- Check `.vid` file specs vs rendered values
- Use `window.__PLAYER__.currentShot` to verify specs loaded
