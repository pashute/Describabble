// Filename: player.js v0.1.7
// stickvid - Stick figure animation player with full control set

class StickVidPlayer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.vidData = null;
        this.manifest = null;
        this.vidLoader = null;
        this.animationFrameId = null;
        this.lastFrameTime = 0;

        this.setupEventListeners();
        this.disableControls();
    }

    setupEventListeners() {
        document.getElementById('loadBtn').addEventListener('click', () => this.loadFile());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));

        document.getElementById('firstBtn').addEventListener('click', () => this.goToFirst());
        document.getElementById('prevBtn').addEventListener('click', () => this.rewind());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('playPauseBtn').addEventListener('click', () => this.togglePlayPause());
        document.getElementById('nextBtn').addEventListener('click', () => this.fastForward());
        document.getElementById('lastBtn').addEventListener('click', () => this.goToLast());

        document.getElementById('timeline').addEventListener('click', (e) => this.seekToTime(e));
        document.getElementById('timelineLocator').addEventListener('mousedown', (e) => this.startScrubbing(e));
    }

    disableControls() {
        document.getElementById('firstBtn').disabled = true;
        document.getElementById('prevBtn').disabled = true;
        document.getElementById('stopBtn').disabled = true;
        document.getElementById('playPauseBtn').disabled = true;
        document.getElementById('nextBtn').disabled = true;
        document.getElementById('lastBtn').disabled = true;
    }

    enableControls() {
        document.getElementById('firstBtn').disabled = false;
        document.getElementById('prevBtn').disabled = false;
        document.getElementById('stopBtn').disabled = false;
        document.getElementById('playPauseBtn').disabled = false;
        document.getElementById('nextBtn').disabled = false;
        document.getElementById('lastBtn').disabled = false;
    }

    loadFile() {
        document.getElementById('fileInput').click();
    }

    async handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const content = await file.text();
            this.vidLoader = new VidLoader();
            this.manifest = this.vidLoader.parse(content);

            // Update status
            const movieInfo = this.vidLoader.getMovieInfo();
            document.getElementById('status').textContent = `Loaded: ${movieInfo.title}`;

            this.duration = movieInfo.duration;
            document.getElementById('totalTimeInput').value = this.formatTime(this.duration);

            // Load vidData files from same directory as .vid file
            try {
                const vidFileDir = file.webkitRelativePath ?
                    file.webkitRelativePath.substring(0, file.webkitRelativePath.lastIndexOf('/')) + '/' :
                    '';

                // Create mock vidData if files don't exist yet
                this.vidData = {
                    scenes: this.generateMockScenes(),
                    characters: [{ name: 'Character 1' }, { name: 'Character 2' }],
                    locations: [{ name: 'Stage' }]
                };
            } catch (error) {
                console.warn('Could not load vidData files:', error);
                this.vidData = null;
            }

            this.enableControls();
            this.render();
        } catch (error) {
            document.getElementById('status').textContent = `Error: ${error.message}`;
            console.error('Failed to load .vid file:', error);
        }
    }

    generateMockScenes() {
        // Generate mock scene data for demonstration
        const scenes = [];
        const frameCount = Math.floor(this.duration * 60); // 60 fps

        for (let i = 0; i < frameCount; i++) {
            scenes.push({
                frame: i,
                characters: [
                    { name: 'Character 1', x: 100, y: 200, pose: 'stand' },
                    { name: 'Character 2', x: 250, y: 200, pose: 'stand' }
                ]
            });
        }

        return scenes;
    }

    play() {
        if (!this.manifest) return;
        this.isPlaying = true;
        this.updatePlayPauseButton();
        this.lastFrameTime = performance.now();
        this.animate();
    }

    pause() {
        this.isPlaying = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.updatePlayPauseButton();
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.render();
    }

    goToFirst() {
        const wasPlaying = this.isPlaying;
        this.currentTime = 0;
        this.render();
        if (wasPlaying) this.play();
    }

    rewind() {
        const wasPlaying = this.isPlaying;
        this.currentTime = Math.max(0, this.currentTime - 10);
        this.render();
        if (wasPlaying) this.play();
    }

    fastForward() {
        const wasPlaying = this.isPlaying;
        this.currentTime = Math.min(this.duration, this.currentTime + 10);
        this.render();
        if (wasPlaying) this.play();
    }

    goToLast() {
        this.currentTime = this.duration;
        if (this.isPlaying) {
            this.pause();
        }
        this.render();
    }

    startScrubbing(e) {
        e.preventDefault();
        const onMouseMove = (moveEvent) => this.scrubTimeline(moveEvent);
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    scrubTimeline(event) {
        const timeline = document.getElementById('timeline');
        const rect = timeline.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        this.currentTime = percent * this.duration;
        this.render();
    }

    seekToTime(event) {
        if (event.target.id === 'timelineLocator') return;
        const timeline = document.getElementById('timeline');
        const rect = timeline.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        this.currentTime = percent * this.duration;
        this.render();
    }

    animate() {
        if (!this.isPlaying) return;

        const now = performance.now();
        const deltaTime = (now - this.lastFrameTime) / 1000;
        this.lastFrameTime = now;

        this.currentTime += deltaTime;
        if (this.currentTime >= this.duration) {
            this.currentTime = this.duration;
            this.isPlaying = false;
        }

        this.render();

        if (this.isPlaying) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw border
        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw content
        if (!this.manifest) {
            this.ctx.fillStyle = '#999';
            this.ctx.font = '16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Load a .vid file to start', this.canvas.width / 2, this.canvas.height / 2);
        } else if (this.vidData) {
            // Render stick figures from vidData
            this.drawStickFigures();
        } else {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '14px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Loading animation data...', this.canvas.width / 2, this.canvas.height / 2);
        }

        // Update UI
        this.updateTimeline();
        this.updatePlayPauseButton();
    }

    drawStickFigures() {
        if (!this.vidData.scenes) return;

        const frameIndex = Math.floor(this.currentTime * 60); // 60 fps
        const scene = this.vidData.scenes[frameIndex];

        if (!scene) return;

        // Draw simple stick figures
        this.ctx.strokeStyle = '#333';
        this.ctx.fillStyle = '#333';
        this.ctx.lineWidth = 2;

        if (scene.characters) {
            scene.characters.forEach((char, idx) => {
                this.drawStickFigure(char, idx);
            });
        }

        // Draw time text
        this.ctx.font = '12px sans-serif';
        this.ctx.fillStyle = '#666';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Frame: ${frameIndex}`, 10, this.canvas.height - 10);
    }

    drawStickFigure(charData, index) {
        const x = 100 + index * 150;
        const y = 200;
        const headRadius = 15;

        // Head
        this.ctx.beginPath();
        this.ctx.arc(x, y, headRadius, 0, Math.PI * 2);
        this.ctx.stroke();

        // Body
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headRadius);
        this.ctx.lineTo(x, y + headRadius + 40);
        this.ctx.stroke();

        // Left arm
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headRadius + 10);
        this.ctx.lineTo(x - 20, y + headRadius - 10);
        this.ctx.stroke();

        // Right arm
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headRadius + 10);
        this.ctx.lineTo(x + 20, y + headRadius - 10);
        this.ctx.stroke();

        // Left leg
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headRadius + 40);
        this.ctx.lineTo(x - 15, y + headRadius + 70);
        this.ctx.stroke();

        // Right leg
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headRadius + 40);
        this.ctx.lineTo(x + 15, y + headRadius + 70);
        this.ctx.stroke();

        // Name label
        this.ctx.font = '10px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(charData.name || `Char ${index + 1}`, x, y + headRadius + 90);
    }

    updateTimeline() {
        const percent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
        document.getElementById('timelineProgress').style.width = percent + '%';
        document.getElementById('timelineLocator').style.left = percent + '%';
        document.getElementById('currentTimeInput').value = this.formatTime(this.currentTime);
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const secStr = secs.toFixed(1).padStart(4, '0');
        return `${mins}:${secStr}`;
    }

    updatePlayPauseButton() {
        const btn = document.getElementById('playPauseBtn');
        if (this.isPlaying) {
            btn.textContent = '⏸';
            btn.title = 'Pause';
        } else {
            btn.textContent = '▶';
            btn.title = 'Play';
        }
    }
}

// Initialize player
const player = new StickVidPlayer('animationCanvas');
