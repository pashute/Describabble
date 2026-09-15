// Filename: player.js v0.1.9
// stickvid - Stick figure animation player with full control set
// Renders complex animations from standardized YAML .vid manifest files

class StickVidPlayer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
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
        ['firstBtn', 'prevBtn', 'stopBtn', 'playPauseBtn', 'nextBtn', 'lastBtn'].forEach(id => {
            document.getElementById(id).disabled = true;
        });
    }

    enableControls() {
        ['firstBtn', 'prevBtn', 'stopBtn', 'playPauseBtn', 'nextBtn', 'lastBtn'].forEach(id => {
            document.getElementById(id).disabled = false;
        });
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

            const movieInfo = this.vidLoader.getMovieInfo();
            document.getElementById('status').textContent = `Loaded: ${movieInfo.title}`;

            this.duration = movieInfo.duration;
            document.getElementById('totalTimeInput').value = this.formatTime(this.duration);

            this.enableControls();
            this.render();
        } catch (error) {
            document.getElementById('status').textContent = `Error: ${error.message}`;
            console.error('Failed to load .vid file:', error);
        }
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
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
        this.updatePlayPauseButton();
    }

    togglePlayPause() {
        this.isPlaying ? this.pause() : this.play();
    }

    stop() {
        this.isPlaying = false;
        this.currentTime = 0;
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
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
        if (this.isPlaying) this.pause();
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
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#ddd';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.manifest) {
            this.ctx.fillStyle = '#999';
            this.ctx.font = '16px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Load a .vid file to start', this.canvas.width / 2, this.canvas.height / 2);
        } else {
            this.renderScene();
        }

        this.updateTimeline();
        this.updatePlayPauseButton();
    }

    renderScene() {
        const currentShot = this.getCurrentShot();
        if (!currentShot) return;

        this.renderBackground(currentShot);
        this.renderCharacters(currentShot);
        this.renderDialogue(currentShot);
        this.renderCaptions(currentShot);
    }

    getCurrentShot() {
        if (!this.manifest.scenes || this.manifest.scenes.length === 0) return null;

        const scene = this.manifest.scenes[0];
        if (!scene.shots) return null;

        for (const shot of scene.shots) {
            if (this.currentTime >= shot.timeRange.start && this.currentTime < shot.timeRange.end) {
                return shot;
            }
        }

        return scene.shots[scene.shots.length - 1];
    }

    renderBackground(shot) {
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (shot.camera.pov === 'cut-to-black') {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        if (shot.camera.pov === 'credits-screen') {
            return;
        }

        this.drawBridge(shot);
    }

    drawBridge(shot) {
        const pov = shot.camera.pov;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;

        if (pov === 'from-below') {
            this.drawBridgeFromBelow(cx, cy);
        } else if (pov === 'from-bridge') {
            this.drawBridgeFromAbove(cx, cy);
        }
    }

    drawBridgeFromBelow(cx, cy) {
        this.ctx.fillStyle = '#e8e8e8';
        this.ctx.fillRect(0, cy - 40, this.canvas.width, 80);

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, cy - 40);
        this.ctx.lineTo(this.canvas.width, cy - 40);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, cy + 40);
        this.ctx.lineTo(this.canvas.width, cy + 40);
        this.ctx.stroke();

        for (let i = 0; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, cy - 40);
            this.ctx.lineTo(i, cy + 40);
            this.ctx.stroke();
        }

        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < this.canvas.width; i += 80) {
            for (let j = cy - 40; j <= cy + 40; j += 10) {
                this.ctx.beginPath();
                this.ctx.moveTo(i, j);
                this.ctx.lineTo(i + 5, j);
                this.ctx.stroke();
            }
        }
    }

    drawBridgeFromAbove(cx, cy) {
        this.ctx.fillStyle = '#b0e0e6';
        this.ctx.fillRect(0, cy, this.canvas.width, this.canvas.height - cy);

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, cy);
        this.ctx.lineTo(this.canvas.width, cy);
        this.ctx.stroke();

        this.ctx.fillStyle = '#8b7355';
        this.ctx.fillRect(0, cy - 20, this.canvas.width, 20);

        for (let i = 0; i < this.canvas.width; i += 60) {
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(i, cy - 20);
            this.ctx.lineTo(i, cy - 5);
            this.ctx.stroke();
        }
    }

    renderCharacters(shot) {
        if (!shot.characters || shot.characters.length === 0) return;

        const pov = shot.camera.pov;
        const progress = (this.currentTime - shot.timeRange.start) / (shot.timeRange.end - shot.timeRange.start);

        shot.characters.forEach((charData, idx) => {
            const charDef = this.manifest.characters.find(c => c.id === charData.id);
            if (!charDef) return;

            let x, y;
            if (pov === 'from-below') {
                x = this.canvas.width / 2 + (idx === 0 ? -80 : 80);
                y = this.canvas.height / 2 - 20;
            } else if (pov === 'from-bridge') {
                x = this.canvas.width / 2;
                y = this.canvas.height / 2 + 100;
            } else {
                x = this.canvas.width / 2;
                y = this.canvas.height / 2;
            }

            this.drawStickFigure(x, y, charDef, charData, progress, shot);
        });
    }

    drawStickFigure(x, y, charDef, charData, progress, shot) {
        const headSize = this.getHeadSize(charDef.headSize);
        const isClimbing = charData.posture === 'climbing';

        this.ctx.strokeStyle = '#333';
        this.ctx.fillStyle = '#333';
        this.ctx.lineWidth = 2;

        if (isClimbing) {
            this.drawClimbingFigure(x, y, headSize, charData, progress);
        } else {
            this.drawStandingFigure(x, y, headSize, charData);
        }
    }

    drawStandingFigure(x, y, headSize, charData) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, headSize, 0, Math.PI * 2);
        this.ctx.stroke();

        if (charData.expression === 'eyebrows-up') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8, y - 3);
            this.ctx.lineTo(x - 5, y - 5);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8, y - 3);
            this.ctx.lineTo(x + 5, y - 5);
            this.ctx.stroke();
        } else if (charData.expression === 'eyebrows-down') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8, y - 5);
            this.ctx.lineTo(x - 5, y - 3);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8, y - 5);
            this.ctx.lineTo(x + 5, y - 3);
            this.ctx.stroke();
        }

        if (charData.expression === 'mouth-open') {
            this.ctx.beginPath();
            this.ctx.arc(x, y + 5, 4, 0, Math.PI);
            this.ctx.stroke();
        } else if (charData.expression === 'subtle-smile') {
            this.ctx.beginPath();
            this.ctx.arc(x, y + 5, 3, 0, Math.PI);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 5, y + 5);
            this.ctx.lineTo(x + 5, y + 5);
            this.ctx.stroke();
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headSize);
        this.ctx.lineTo(x, y + headSize + 40);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headSize + 10);
        this.ctx.lineTo(x - 20, y + headSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headSize + 10);
        this.ctx.lineTo(x + 20, y + headSize);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headSize + 40);
        this.ctx.lineTo(x - 15, y + headSize + 70);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, y + headSize + 40);
        this.ctx.lineTo(x + 15, y + headSize + 70);
        this.ctx.stroke();
    }

    drawClimbingFigure(x, y, headSize, charData, progress) {
        const climbHeight = progress * 50;
        const adjY = y - climbHeight;

        this.ctx.beginPath();
        this.ctx.arc(x, adjY, headSize, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x, adjY + headSize);
        this.ctx.lineTo(x + 15, adjY + headSize + 35);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, adjY + headSize + 10);
        this.ctx.lineTo(x + 35, adjY + headSize - 15);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, adjY + headSize + 10);
        this.ctx.lineTo(x + 30, adjY + headSize + 20);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, adjY + headSize + 35);
        this.ctx.lineTo(x + 25, adjY + headSize + 65);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(x + 15, adjY + headSize + 35);
        this.ctx.lineTo(x + 10, adjY + headSize + 70);
        this.ctx.stroke();
    }

    getHeadSize(sizeType) {
        const sizes = {
            'GIANT': 25,
            'LARGE': 18,
            'LONG': 22,
            'SMALL': 12,
            'TINY': 8,
            'NONE': 0
        };
        return sizes[sizeType] || 15;
    }

    renderDialogue(shot) {
        if (!shot.dialogue || shot.dialogue.length === 0) return;

        const activeDialogue = shot.dialogue.find(d =>
            this.currentTime >= d.startTime && this.currentTime < d.endTime
        );

        if (activeDialogue) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, this.canvas.height - 80, this.canvas.width, 80);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${activeDialogue.speaker}:`, this.canvas.width / 2, this.canvas.height - 55);

            this.ctx.font = '12px sans-serif';
            const words = activeDialogue.text.split(' ');
            let line = '';
            let y = this.canvas.height - 35;

            words.forEach(word => {
                const testLine = line + word + ' ';
                if (this.ctx.measureText(testLine).width > this.canvas.width - 40) {
                    this.ctx.fillText(line, this.canvas.width / 2, y);
                    line = word + ' ';
                    y += 20;
                } else {
                    line = testLine;
                }
            });
            if (line) {
                this.ctx.fillText(line, this.canvas.width / 2, y);
            }
        }
    }

    renderCaptions(shot) {
        if (!shot.captions || !shot.captions.text) return;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, 60);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(shot.captions.text, this.canvas.width / 2, 35);
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
        btn.textContent = this.isPlaying ? '⏸' : '▶';
        btn.title = this.isPlaying ? 'Pause' : 'Play';
    }
}

const player = new StickVidPlayer('animationCanvas');
