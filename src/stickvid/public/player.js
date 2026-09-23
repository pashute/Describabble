// Filename: player.js v0.1.54
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
        this.characterPositions = {};
        this.captionRules = {
            showSpeakerName: false,
            audioFormat: 'parentheses'
        };
        this.voices = {};
        this.currentNarrationUtterance = null;
        this.lastSpokenTime = -1;
        this.isSpeaking = false;
        this.lastShotId = null;
        this.bridgeImage = null;

        this.setupEventListeners();
        this.disableControls();
        this.initSpeechSynthesis();
        this.loadBridgeImage();
    }

    loadBridgeImage() {
        const img = new Image();
        img.src = 'bridgeside.jpeg';
        img.onload = () => { this.bridgeImage = img; };
        img.onerror = () => { console.warn('Could not load bridge image'); };
    }

    initSpeechSynthesis() {
        this.synth = window.speechSynthesis;
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

        const debugBtn = document.getElementById('debugBtn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => console.log(window.__PLAYER__.getActiveElements()));
        }

        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        console.log(`Canvas clicked at (${Math.round(x)}, ${Math.round(y)})`);

        if (this.currentShot && this.currentShot.characters) {
            this.currentShot.characters.forEach(char => {
                console.log(`  - ${char.id}: ${char.position || 'unknown'} at estimated (${char.position})`);
            });
        }
    }

    disableControls() {
        ['firstBtn', 'prevBtn', 'stopBtn', 'playPauseBtn', 'nextBtn', 'lastBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = true;
        });
    }

    enableControls() {
        ['firstBtn', 'prevBtn', 'stopBtn', 'playPauseBtn', 'nextBtn', 'lastBtn'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = false;
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

            if (this.manifest.meta?.gen?.captions) {
                this.captionRules = {
                    showSpeakerName: this.manifest.meta.gen.captions.showSpeakerName ?? false,
                    audioFormat: this.manifest.meta.gen.captions.audioFormat ?? 'parentheses'
                };
            }

            if (this.manifest.voices) {
                this.voices = this.manifest.voices;
            }

            const movieInfo = this.vidLoader.getMovieInfo();
            const vidHeader = content.split('\n')[0] || '';
            const versionMatch = vidHeader.match(/v(\d+\.\d+\.\d+)/);
            const vidVersion = versionMatch ? versionMatch[1] : 'unknown';
            document.getElementById('status').textContent = `Loaded: ${movieInfo.title} (v${vidVersion})`;

            this.duration = movieInfo.duration;
            console.log('Loaded .vid. Duration from specs:', movieInfo.duration, 'MovieInfo:', movieInfo);
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
        this.lastSpokenTime = -1;
        this.lastShotId = null;
        if (this.synth) this.synth.cancel();
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
            console.log('Animation stopped. Duration:', this.duration, 'CurrentTime:', this.currentTime);
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

        if (currentShot.camera?.pov === 'credits-screen') {
            this.renderCreditsScreen(currentShot);
        } else {
            this.renderBackground(currentShot);
            this.renderCharacters(currentShot);
            this.renderNarration(currentShot);
            this.renderDialogue(currentShot);
            this.renderCaptions(currentShot);
        }
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
        const skyColor = shot.sky?.color || '#f5f5f5';
        this.ctx.fillStyle = skyColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (shot.camera?.pov === 'cut-to-black') {
            this.ctx.fillStyle = '#000';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        if (shot.sky?.cloud) {
            this.renderCloud(shot.sky.cloud);
        }

        if (shot.camera?.pov !== 'credits-screen') {
            this.drawBridge(shot);
        }
    }

    renderCloud(cloudData) {
        const cloudRadius = 20;
        const cloudColor = cloudData.color || '#FFFFFF';
        const positionMap = {
            'left': 150,
            'center-left': 320,
            'center-right': 640,
            'right': 810
        };

        const cloudX = positionMap[cloudData.position] || 400;
        const cloudY = 80;

        this.ctx.fillStyle = cloudColor;
        this.ctx.beginPath();
        this.ctx.arc(cloudX - 10, cloudY, cloudRadius * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(cloudX + 10, cloudY, cloudRadius * 0.7, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(cloudX, cloudY - 8, cloudRadius * 0.65, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBridge(shot) {
        const pov = shot.camera?.pov || 'from-below';
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        if (pov === 'from-below') {
            this.drawBridgeFromBelow(cx, cy);
        } else if (pov === 'from-bridge') {
            this.drawBridgeFromEnvironment(shot.camera?.environment);
        }
    }

    drawBridgeFromEnvironment(environment) {
        if (!environment || !environment.layout) {
            this.drawBridgeFromAbove(this.canvas.width / 2, this.canvas.height / 2);
            return;
        }

        const layout = environment.layout;
        const colorMap = {
            'light-green': '#90EE90',
            'light-blue': '#ADD8E6',
            'gray': '#A9A9A9',
            'silver': '#C0C0C0',
            'dark-green': '#228B22'
        };

        // Calculate positions based on descriptions
        const getPosition = (item) => {
            let xPos = 0, width = 0;

            if (item.position === 'left-side' && item.size === 'quarter') {
                xPos = 0; width = 240;
            } else if (item.position === 'center' && item.size === 'quarter') {
                xPos = 240; width = 240;
            } else if (item.position === 'right-of-river' && item.size === 'narrow') {
                xPos = 480; width = 96;
            } else if (item.position === 'right-side' && item.size === 'remaining') {
                xPos = 576; width = 384;
            }

            return { xPos, width };
        };

        // Draw vertical elements
        layout.forEach(item => {
            if (item.element === 'grass-left' || item.element === 'grass-right' ||
                item.element === 'river' || item.element === 'road') {
                const { xPos, width } = getPosition(item);
                this.ctx.fillStyle = colorMap[item.color] || item.color;
                this.ctx.fillRect(xPos, 0, width, this.canvas.height - 50);
            }
        });

        // Draw bridge at bottom
        layout.forEach(item => {
            if (item.element === 'bridge') {
                const yPos = this.canvas.height - 60;
                this.ctx.fillStyle = colorMap[item.color] || item.color;
                this.ctx.fillRect(0, yPos, this.canvas.width, 40);

                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(0, yPos);
                this.ctx.lineTo(this.canvas.width, yPos);
                this.ctx.stroke();

                this.ctx.lineWidth = 1;
                for (let i = 0; i < this.canvas.width; i += 60) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i, yPos);
                    this.ctx.lineTo(i, yPos + 40);
                    this.ctx.stroke();
                }
            }
        });

        // Draw tree top
        layout.forEach(item => {
            if (item.element === 'tree') {
                this.drawTreeTop(820, 80);
            }
        });
    }

    drawBridgeFromBelow(cx, cy) {
        const ropeY = 120;
        const fenceY = 280;
        const bridgeFloorY = this.canvas.height - 140;

        this.ctx.strokeStyle = '#333';

        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(0, ropeY);
        const ropeControlX = cx;
        const ropeControlY = ropeY + 50;
        this.ctx.quadraticCurveTo(ropeControlX, ropeControlY, this.canvas.width, ropeY);
        this.ctx.stroke();

        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#FF0000';  // RED for fence top rail
        this.ctx.beginPath();
        this.ctx.moveTo(0, fenceY);
        this.ctx.lineTo(this.canvas.width, fenceY);
        this.ctx.stroke();

        this.ctx.lineWidth = 18;  // 6x thicker than rail (3*6=18)
        this.ctx.strokeStyle = '#9400D3';  // PURPLE for bridge floor
        this.ctx.beginPath();
        this.ctx.moveTo(0, bridgeFloorY);
        this.ctx.lineTo(this.canvas.width, bridgeFloorY);
        this.ctx.stroke();

        this.ctx.lineWidth = 2;  // Reset for poles
        this.ctx.strokeStyle = '#333';  // Reset to default

        const fencePoles = [100, 300, 650, 850];
        this.ctx.lineWidth = 2;
        fencePoles.forEach(x => {
            this.ctx.beginPath();
            this.ctx.moveTo(x, fenceY);
            this.ctx.lineTo(x, bridgeFloorY);
            this.ctx.stroke();
        });

        const suspenderPositions = [80, 200, 740, 860];
        this.ctx.lineWidth = 1.5;
        suspenderPositions.forEach(x => {
            this.ctx.beginPath();
            this.ctx.moveTo(x, ropeY);
            this.ctx.lineTo(x, fenceY);
            this.ctx.stroke();
        });
    }

    drawBridgeFromAbove(cx, cy) {
        const bridgeY = this.canvas.height - 80;
        const roadY = this.canvas.height - 120;
        const riverY = this.canvas.height - 40;

        this.ctx.fillStyle = '#4a90e2';
        this.ctx.fillRect(0, riverY, this.canvas.width, this.canvas.height - riverY);

        this.ctx.fillStyle = '#888';
        this.ctx.fillRect(0, roadY, this.canvas.width, 40);

        this.ctx.fillStyle = '#8b7355';
        this.ctx.fillRect(0, bridgeY, this.canvas.width, 40);

        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, bridgeY);
        this.ctx.lineTo(this.canvas.width, bridgeY);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, roadY);
        this.ctx.lineTo(this.canvas.width, roadY);
        this.ctx.stroke();

        for (let i = 0; i < this.canvas.width; i += 60) {
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(i, bridgeY);
            this.ctx.lineTo(i, bridgeY + 40);
            this.ctx.stroke();
        }
    }

    renderCharacters(shot) {
        if (!shot.characters || shot.characters.length === 0) return;

        const pov = shot.camera?.pov || 'from-below';
        const progress = (this.currentTime - shot.timeRange.start) / (shot.timeRange.end - shot.timeRange.start);
        const cameraScale = shot.camera?.scale || 1;

        shot.characters.forEach((charData) => {
            charData = this.resolveCharacterRef(charData, this.manifest);
            const charDef = this.manifest.characters.find(c => c.id === charData.id);
            if (!charDef) return;

            if (charData.location === 'continued') {
                if (!this.characterPositions[charData.id]) return;
                charData.position = this.characterPositions[charData.id];
            } else if (charData.location === 'new') {
                this.characterPositions[charData.id] = charData.position;
            }

            // Check if this character is currently speaking (arm-waving only for WM/char2)
            const activeDialogue = shot.dialogue?.find(d =>
                d.speaker === charData.id &&
                this.currentTime >= d.startTime &&
                this.currentTime < d.endTime
            );
            charData.isWaving = (charData.id === 'char2') && !!activeDialogue;

            let x, y, scale = cameraScale;

            if (pov === 'from-below') {
                if (charData.position === 'fence-bottom') {
                    x = this.canvas.width / 2;
                    y = this.canvas.height - 140;
                } else if (charData.position === 'fence-climbing' || charData.position === 'fence-top' || charData.position === 'hanging-on-fence') {
                    x = this.canvas.width / 2;
                    y = this.canvas.height - 140;
                } else if (charData.position === 'standing-on-fence') {
                    x = this.canvas.width / 2;
                    y = 240;
                } else {
                    x = this.canvas.width / 2;
                    y = this.canvas.height / 2 - 50;
                }
            } else if (pov === 'from-bridge') {
                if (charData.position === 'fence-climbing' || charData.position === 'fence-top') {
                    x = this.canvas.width / 2;
                    y = this.canvas.height - 100;
                    scale = cameraScale * 0.7;
                } else if (charData.position === 'standing-on-fence') {
                    x = this.canvas.width / 2;
                    y = this.canvas.height - 100;
                    scale = cameraScale * 0.7;
                } else if (charData.position === 'climbed-position') {
                    x = this.canvas.width / 2;
                    y = this.canvas.height - 120;
                    scale = cameraScale * 0.7;
                    charData.isBent = true;
                } else if (charData.position === 'standing-on-bridge') {
                    x = 520;
                    y = 325;
                    scale = cameraScale * 0.9;
                } else if (charData.position === 'standing-on-road') {
                    // WM on road below bridge, positioned to the right
                    x = this.canvas.width * 0.65;  // standing-on-road: right side positioning
                    y = this.canvas.height - 120; // lower on road, near bottom of visible area
                    scale = cameraScale * 0.8;
                } else {
                    x = this.canvas.width / 2;
                    y = this.canvas.height / 2 - 50;
                }
            } else {
                x = this.canvas.width / 2;
                y = this.canvas.height / 2;
            }

            charData.pov = pov;
            const sizeMultiplier = this.getSizeMultiplier(charData.size);
            this.drawStickFigure(x, y, charDef, charData, progress, shot, scale * sizeMultiplier);
        });
    }

    drawStickFigure(x, y, charDef, charData, progress, shot, scale = 1) {
        // Use renderStyle.headDiameter if available, otherwise use headSize type
        let headSize;
        if (charData.renderStyle?.headDiameter) {
            headSize = charData.renderStyle.headDiameter * scale;
        } else {
            const headSizeType = charData.headSize || charDef.headSize;
            headSize = this.getHeadSize(headSizeType) * scale;
        }
        const isClimbing = charData.posture === 'climbing';

        const isWM = charData.id === 'char2';
        const renderStyle = charData.renderStyle || {};

        this.ctx.strokeStyle = renderStyle.color || (isWM ? '#FFFFFF' : '#333');
        this.ctx.fillStyle = renderStyle.color || (isWM ? '#FFFFFF' : '#333');
        this.ctx.lineWidth = renderStyle.lineWidth ? renderStyle.lineWidth * scale : (isWM ? 3.5 * scale : 2 * scale);

        if (isClimbing) {
            this.drawClimbingFigure(x, y, headSize, charData, progress, scale);
        } else {
            this.drawStandingFigure(x, y, headSize, charData, scale, shot);
        }
    }

    drawStandingFigure(x, y, headSize, charData, scale = 1, shot = null) {
        // Handle timed expression changes
        if (charData.animation?.expressionChange === 'timed' && charData.animation?.changes) {
            let currentExpression = charData.expression;
            const changes = charData.animation.changes;
            for (let i = changes.length - 1; i >= 0; i--) {
                if (this.currentTime >= changes[i].time) {
                    currentExpression = changes[i].expression;
                    break;
                }
            }
            charData = { ...charData, expression: currentExpression };
        }

        const renderStyle = charData.renderStyle || {};
        const bodyHeight = renderStyle.bodyHeight === 'short' ? 15 * scale : 40 * scale;
        const handLength = renderStyle.handLength || 20 * scale;
        const armLength = handLength;
        const isFromAbove = charData.pov === 'from-above' || charData.pov === 'from-bridge';
        const legLength = isFromAbove ? 5 * scale : 30 * scale;
        const isWaving = charData.isWaving || renderStyle.armAnimation === 'flailing-extended';
        const climbedPos = charData.climbedPosition;
        const hasBodyLean = climbedPos && (climbedPos.bodyLean === 'left' || climbedPos.bodyLean === 'right');

        this.ctx.beginPath();
        this.ctx.arc(x, y, headSize, 0, Math.PI * 2);
        this.ctx.stroke();

        // Special rendering for WM from-above POV
        const isWM = charData.id === 'char2';
        const wmFromAbove = charData.pov === 'from-above';
        if (wmFromAbove && isWM) {
            console.log(`WM head center: x=${x}, y=${y}`);
            // 5x larger scale for from-above WM
            const wmScale = scale * 5;

            // Draw O shape for sitting/body (shelf)
            const oRadius = headSize * 0.4;
            this.ctx.beginPath();
            this.ctx.arc(x, y + headSize + oRadius, oRadius, 0, Math.PI * 2);
            this.ctx.stroke();

            // Draw tiny A-shaped feet (half-size, close together)
            const footHeight = headSize * 0.25;
            const footSpacing = headSize * 0.3;
            // Left foot
            this.ctx.beginPath();
            this.ctx.moveTo(x - footSpacing/2, y + headSize + oRadius * 2);
            this.ctx.lineTo(x - footSpacing/2 - footHeight/2, y + headSize + oRadius * 2 + footHeight);
            this.ctx.lineTo(x - footSpacing/2 + footHeight/2, y + headSize + oRadius * 2 + footHeight);
            this.ctx.closePath();
            this.ctx.stroke();
            // Right foot
            this.ctx.beginPath();
            this.ctx.moveTo(x + footSpacing/2, y + headSize + oRadius * 2);
            this.ctx.lineTo(x + footSpacing/2 - footHeight/2, y + headSize + oRadius * 2 + footHeight);
            this.ctx.lineTo(x + footSpacing/2 + footHeight/2, y + headSize + oRadius * 2 + footHeight);
            this.ctx.closePath();
            this.ctx.stroke();

            // Draw asymmetric arms (size of O)
            const armSize = oRadius;
            // Left arm horizontal (—)
            this.ctx.beginPath();
            this.ctx.moveTo(x - headSize - armSize/2, y);
            this.ctx.lineTo(x - headSize - armSize, y);
            this.ctx.stroke();
            // Right arm raised (/)
            this.ctx.beginPath();
            this.ctx.moveTo(x + headSize + armSize/2, y);
            this.ctx.lineTo(x + headSize + armSize, y - armSize);
            this.ctx.stroke();

            // Return early to skip normal body/arm drawing
            return;
        }

        if (charData.expression === 'eyebrows-up') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8 * scale, y - 3 * scale);
            this.ctx.lineTo(x - 5 * scale, y - 5 * scale);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8 * scale, y - 3 * scale);
            this.ctx.lineTo(x + 5 * scale, y - 5 * scale);
            this.ctx.stroke();
        } else if (charData.expression === 'eyebrows-down') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8 * scale, y - 5 * scale);
            this.ctx.lineTo(x - 5 * scale, y - 3 * scale);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8 * scale, y - 5 * scale);
            this.ctx.lineTo(x + 5 * scale, y - 3 * scale);
            this.ctx.stroke();
        } else if (charData.eyebrows === 'slanting') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 8 * scale, y - 2 * scale);
            this.ctx.lineTo(x - 4 * scale, y - 5 * scale);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(x + 8 * scale, y - 2 * scale);
            this.ctx.lineTo(x + 4 * scale, y - 5 * scale);
            this.ctx.stroke();
        }

        const isSpeaking = charData.isWaving || (shot?.dialogue?.some(d => d.speaker === charData.id && this.currentTime >= d.startTime && this.currentTime < d.endTime));

        if (isSpeaking && charData.id === 'char1') {
            const mouthPhase = Math.sin(this.currentTime * 6) * 2;
            if (mouthPhase > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(x - 4 * scale, y + 5 * scale);
                this.ctx.lineTo(x + 4 * scale, y + 5 * scale);
                this.ctx.stroke();
            } else if (mouthPhase < -1) {
                this.ctx.beginPath();
                this.ctx.arc(x, y + 5 * scale, 3 * scale, 0, Math.PI);
                this.ctx.stroke();
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(x - 3 * scale, y + 5 * scale);
                this.ctx.lineTo(x + 3 * scale, y + 5 * scale);
                this.ctx.stroke();
            }
        } else if (charData.expression === 'mouth-open') {
            this.ctx.beginPath();
            this.ctx.arc(x, y + 5 * scale, 4 * scale, 0, Math.PI);
            this.ctx.stroke();
        } else if (charData.expression === 'subtle-smile' || charData.expression === 'mouth-smile') {
            this.ctx.beginPath();
            this.ctx.arc(x, y + 5 * scale, 3 * scale, 0, Math.PI);
            this.ctx.stroke();
        } else if (charData.expression === 'mouth-tilde') {
            this.ctx.beginPath();
            const waveHeight = 2 * scale;
            for (let i = 0; i <= 4; i++) {
                const px = x - 5 * scale + (i / 4) * 10 * scale;
                const py = y + 5 * scale + (Math.sin(i * Math.PI / 2) * waveHeight);
                if (i === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            }
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x - 5 * scale, y + 5 * scale);
            this.ctx.lineTo(x + 5 * scale, y + 5 * scale);
            this.ctx.stroke();
        }

        const bodyStartX = x;
        const bodyStartY = y + headSize;
        const bodyEndX = x;
        const bodyEndY = y + headSize + bodyHeight;

        let leanRad = 0;
        let bodyMidX = (bodyStartX + bodyEndX) / 2;
        let bodyMidY = (bodyStartY + bodyEndY) / 2;

        if (hasBodyLean) {
            const leanDegrees = climbedPos.leanDegrees || 30;
            const leanAngle = climbedPos.bodyLean === 'left' ? -leanDegrees : leanDegrees;
            leanRad = leanAngle * Math.PI / 180;

            this.ctx.save();
            this.ctx.translate(bodyMidX, bodyMidY);
            this.ctx.rotate(leanRad);
            this.ctx.translate(-bodyMidX, -bodyMidY);
        }

        this.ctx.beginPath();
        this.ctx.moveTo(bodyStartX, bodyStartY);
        this.ctx.lineTo(bodyEndX, bodyEndY);
        this.ctx.stroke();

        const clampingArm = charData.climbedPosition?.clamping;
        const hasClampingArm = clampingArm === 'left' || clampingArm === 'right';

        if (isWaving) {
            const waveAngle = Math.sin(this.currentTime * 8) * 30 * scale;
            const waveRad = waveAngle * Math.PI / 180;

            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + 10 * scale);
            this.ctx.lineTo(x - armLength + Math.cos(waveRad) * 12 * scale, y + headSize + 10 * scale - Math.sin(waveRad) * 12 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + 10 * scale);
            this.ctx.lineTo(x + armLength - Math.cos(waveRad) * 12 * scale, y + headSize + 10 * scale - Math.sin(waveRad) * 12 * scale);
            this.ctx.stroke();
        } else if (hasClampingArm) {
            const clampingArmLength = 25 * scale;
            const clampingAngleDegrees = 120; // 90 degrees (side) + 30 degrees downward
            const clampingAngleRad = clampingAngleDegrees * Math.PI / 180;

            if (clampingArm === 'left') {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + headSize + 10 * scale);
                this.ctx.lineTo(x - clampingArmLength * Math.cos(clampingAngleRad), y + headSize + 10 * scale + clampingArmLength * Math.sin(clampingAngleRad));
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(x, y + headSize + 10 * scale);
                this.ctx.lineTo(x + armLength, y + headSize);
                this.ctx.stroke();
            } else {
                this.ctx.beginPath();
                this.ctx.moveTo(x, y + headSize + 10 * scale);
                this.ctx.lineTo(x - armLength, y + headSize);
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.moveTo(x, y + headSize + 10 * scale);
                this.ctx.lineTo(x + clampingArmLength * Math.cos(clampingAngleRad), y + headSize + 10 * scale + clampingArmLength * Math.sin(clampingAngleRad));
                this.ctx.stroke();
            }
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + 10 * scale);
            this.ctx.lineTo(x - armLength, y + headSize);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + 10 * scale);
            this.ctx.lineTo(x + armLength, y + headSize);
            this.ctx.stroke();
        }

        if (charData.isBent) {
            const kneeY = y + headSize + bodyHeight + 15 * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + bodyHeight);
            this.ctx.lineTo(x - 12 * scale, kneeY);
            this.ctx.lineTo(x - 15 * scale, kneeY + 12 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + bodyHeight);
            this.ctx.lineTo(x + 12 * scale, kneeY);
            this.ctx.lineTo(x + 15 * scale, kneeY + 12 * scale);
            this.ctx.stroke();
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + bodyHeight);
            this.ctx.lineTo(x - 15 * scale, y + headSize + bodyHeight + legLength);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(x, y + headSize + bodyHeight);
            this.ctx.lineTo(x + 15 * scale, y + headSize + bodyHeight + legLength);
            this.ctx.stroke();
        }

        if (hasBodyLean) {
            this.ctx.restore();
        }
    }

    drawClimbingFigure(x, y, headSize, charData, progress, scale = 1) {
        const climbHeight = Math.min(progress * 200 * scale, 120 * scale);
        const adjY = y - climbHeight;
        const bodyHeight = 40 * scale;
        const bodyAngle = 25; // degrees for diagonal pose
        const limbPhase = Math.sin(progress * Math.PI * 4) > 0; // alternates limbs

        this.ctx.beginPath();
        this.ctx.arc(x, adjY, headSize, 0, Math.PI * 2);
        this.ctx.stroke();

        // Diagonal body with body lean animation
        let bodyLeanAngle = 0;
        if (charData.animation?.bodyLean === 'toggle') {
            const leanCycle = charData.animation.leanCycle || 0.5;
            const leanPhase = Math.floor(this.currentTime / leanCycle) % 2;
            const leanAngles = charData.animation.leanAngles || [
                { direction: 'left', degrees: 15 },
                { direction: 'right', degrees: 15 }
            ];
            const currentLeanAngle = leanPhase === 0 ? leanAngles[0] : leanAngles[1];
            bodyLeanAngle = currentLeanAngle.direction === 'left' ? -currentLeanAngle.degrees : currentLeanAngle.degrees;
        }

        const bodyX = x + 8 * scale * Math.sin((bodyAngle + bodyLeanAngle) * Math.PI / 180);
        const bodyEndX = bodyX + 15 * scale;
        const bodyEndY = adjY + headSize + bodyHeight;

        this.ctx.beginPath();
        this.ctx.moveTo(x, adjY + headSize);
        this.ctx.lineTo(bodyEndX, bodyEndY);
        this.ctx.stroke();

        if (limbPhase) {
            // Right arm up, left arm down
            this.ctx.beginPath();
            this.ctx.moveTo(bodyX, adjY + headSize + 10 * scale);
            this.ctx.lineTo(bodyX + 30 * scale, adjY + headSize - 20 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(bodyX, adjY + headSize + 10 * scale);
            this.ctx.lineTo(bodyX - 20 * scale, adjY + headSize + 15 * scale);
            this.ctx.stroke();

            // Right leg down (with bent knee), left leg up (with bent knee)
            const kneeY = bodyEndY + 15 * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(bodyEndX, bodyEndY);
            this.ctx.lineTo(bodyEndX + 15 * scale, kneeY);
            this.ctx.lineTo(bodyEndX + 25 * scale, bodyEndY + 30 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(bodyEndX, bodyEndY);
            this.ctx.lineTo(bodyEndX - 10 * scale, kneeY - 10 * scale);
            this.ctx.lineTo(bodyEndX - 15 * scale, bodyEndY - 15 * scale);
            this.ctx.stroke();
        } else {
            // Left arm up, right arm down
            this.ctx.beginPath();
            this.ctx.moveTo(bodyX, adjY + headSize + 10 * scale);
            this.ctx.lineTo(bodyX - 30 * scale, adjY + headSize - 20 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(bodyX, adjY + headSize + 10 * scale);
            this.ctx.lineTo(bodyX + 20 * scale, adjY + headSize + 15 * scale);
            this.ctx.stroke();

            // Left leg down (with bent knee), right leg up (with bent knee)
            const kneeY2 = bodyEndY + 15 * scale;
            this.ctx.beginPath();
            this.ctx.moveTo(bodyEndX, bodyEndY);
            this.ctx.lineTo(bodyEndX - 15 * scale, kneeY2);
            this.ctx.lineTo(bodyEndX - 25 * scale, bodyEndY + 30 * scale);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(bodyEndX, bodyEndY);
            this.ctx.lineTo(bodyEndX + 10 * scale, kneeY2 - 10 * scale);
            this.ctx.lineTo(bodyEndX + 15 * scale, bodyEndY - 15 * scale);
            this.ctx.stroke();
        }
    }

    drawTreeTop(x, y) {
        this.ctx.strokeStyle = '#228B22';
        this.ctx.fillStyle = '#228B22';
        this.ctx.lineWidth = 2;

        // Foliage: three overlapping dark-green circles for non-symmetric tree shape
        // Positioned lower (y + 80 instead of y + 30)
        const centerY = y + 80;
        const radius = 35;

        // Top circle (centered)
        this.ctx.beginPath();
        this.ctx.arc(x, centerY - 20, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Bottom-left circle
        this.ctx.beginPath();
        this.ctx.arc(x - 25, centerY + 20, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();

        // Bottom-right circle
        this.ctx.beginPath();
        this.ctx.arc(x + 20, centerY + 25, radius, 0, Math.PI * 2);
        this.ctx.fill();
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

    getSizeMultiplier(sizeSpec) {
        if (!sizeSpec) return 1;
        const multipliers = {
            'half': 0.5,
            'slightly-smaller-than-shot2': 0.45,
            'triple': 3,
            'double': 2
        };
        return multipliers[sizeSpec] || 1;
    }

    renderDialogue(shot) {
        if (!shot.dialogue || shot.dialogue.length === 0) return;

        const activeDialogue = shot.dialogue.find(d =>
            this.currentTime >= d.startTime && this.currentTime < d.endTime
        );

        if (activeDialogue) {
            const pov = shot.camera?.pov || 'from-below';
            let dialogueText = activeDialogue.text;

            if (this.captionRules.showSpeakerName) {
                const speakerChar = this.manifest.characters.find(c => c.id === activeDialogue.speaker);
                const speakerName = speakerChar?.name || activeDialogue.speaker;
                dialogueText = `${speakerName}: ${dialogueText}`;
            }

            if (pov !== 'from-bridge') {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                this.ctx.fillRect(0, this.canvas.height - 90, this.canvas.width, 90);

                this.ctx.fillStyle = '#fff';
                this.ctx.font = '12px sans-serif';
                this.ctx.textAlign = 'center';
                const words = dialogueText.split(' ');
                let line = '';
                let y = this.canvas.height - 60;

                words.forEach(word => {
                    const testLine = line + word + ' ';
                    if (this.ctx.measureText(testLine).width > this.canvas.width - 40) {
                        this.ctx.fillText(line, this.canvas.width / 2, y);
                        line = word + ' ';
                        y += 18;
                    } else {
                        line = testLine;
                    }
                });
                if (line) {
                    this.ctx.fillText(line, this.canvas.width / 2, y);
                }
            }

            if (this.isPlaying && shot.id !== this.lastShotId) {
                this.lastShotId = shot.id;
                const voiceId = activeDialogue.voice || 'voice1';
                this.speak(activeDialogue.text, voiceId);
            }
        }
    }

    renderNarration(shot) {
        if (!shot.narration) return;

        const narration = Array.isArray(shot.narration) ? shot.narration : [shot.narration];

        let activeNarration = null;
        for (const n of narration) {
            if (this.currentTime >= n.startTime && this.currentTime < n.endTime) {
                activeNarration = n;
                break;
            }
        }

        if (!activeNarration) return;

        const text = activeNarration.text || activeNarration.caption || '';
        const voiceId = activeNarration.voice || 'voice1';
        const caption = activeNarration.caption || text;

        if (!text) return;

        const pov = shot.camera?.pov || 'from-below';
        if (pov !== 'cut-to-black' && caption) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.fillRect(0, 401, this.canvas.width, 40);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(caption, this.canvas.width / 2, 423);
        }

        if (this.isPlaying) {
            const narrationId = shot.id + '_' + narration.indexOf(activeNarration);
            if (narrationId !== this.lastShotId) {
                this.lastShotId = narrationId;
                this.speak(text, voiceId);
            }
        }
    }

    speak(text, voiceId = 'voice1') {
        if (!this.synth || !text) return;

        this.synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voiceConfig = this.voices[voiceId];

        if (voiceConfig) {
            utterance.pitch = voiceConfig.pitch === 'low' ? 0.8 : (voiceConfig.pitch === 'high' ? 1.2 : 1.0);
            utterance.volume = voiceConfig.volume || 1.0;
            utterance.rate = 0.9;
        }

        this.synth.speak(utterance);
    }

    stripInstructions(text) {
        if (typeof text !== 'string') return text;
        return text.replace(/\[pause\]/g, '').trim();
    }

    resolveCharacterRef(charData, manifest) {
        if (!charData.characterRef || typeof charData.characterRef !== 'string') return charData;

        const refPath = charData.characterRef.replace('@', '').split('/');
        let refDef = manifest;
        for (const segment of refPath) {
            refDef = refDef?.[segment];
        }

        if (!refDef) return charData;

        return { ...refDef, ...charData, characterRef: undefined };
    }

    resolveReference(ref, shot) {
        if (typeof ref !== 'string' || !ref.startsWith('@')) return ref;

        if (ref === '@narration' && shot.narration && shot.narration.length > 0) {
            return shot.narration.map(n => this.stripInstructions(n.text)).join('\n');
        }
        return ref;
    }

    renderCaptions(shot) {
        if (!shot.captions) return;

        const pov = shot.camera?.pov || 'from-below';
        if (pov === 'cut-to-black') return;

        if (shot.captions.text1 || shot.captions.text2) {
            this.renderMultiTextCaptions(shot.captions, pov);
        } else if (shot.captions.text) {
            const position = shot.captions.position || 'top';
            let text = this.resolveReference(shot.captions.text, shot);
            text = this.stripInstructions(text);

            if (position === 'none') return;

            if (position === 'center') {
                this.renderCenteredCaption(text);
            } else if (position === 'top') {
                this.renderTopCaption(text);
            } else if (position === 'bottom') {
                this.renderBottomCaption(text);
            } else if (position === 'side') {
                this.renderSideCaption(text);
            }
        }
    }

    renderMultiTextCaptions(captions, pov = 'from-below') {
        let yOffset = pov === 'credits-screen' ? 120 : 300; // Pushed down to clear Load button 
        // was 5 changing to 10. had two bottom lines of ascii art

        if (captions.text1) {
            const align = captions.text1.align || 'center';
            const content = captions.text1.content || '';
            const lineCount = captions.text1.lines || null;
            const preserveEmpty = captions.text1.emptyRowMode === 'keep';
            yOffset = this.renderCaptionBlock(content, align, yOffset, preserveEmpty, lineCount);
        }

        if (captions.text2) {
            const align = captions.text2.align || 'center';
            const content = captions.text2.content || '';
            const lineCount = captions.text2.lines || null;
            const preserveEmpty = captions.text2.emptyRowMode === 'keep';
            this.renderCaptionBlock(content, align, yOffset, preserveEmpty, lineCount);
        }
    }

    renderCaptionBlock(text, align, startY, preserveEmpty = false, lineCount = null) {
        const allLines = text.split('\n');
        let lines = preserveEmpty ? allLines : allLines.filter(line => line.trim());

        const numLines = lineCount !== null ? lineCount : lines.length;
        const bgHeight = numLines * 16 + 2;
        const bgY = startY;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, bgY, this.canvas.width, bgHeight);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.lineHeight = 16;

        let y = bgY + 12;
        for (let i = 0; i < numLines && i < lines.length; i++) {
            const line = lines[i] || '';
            if (align === 'left') {
                this.ctx.textAlign = 'left';
                this.ctx.fillText(line, 40, y);
            } else if (align === 'center') {
                this.ctx.textAlign = 'center';
                this.ctx.fillText(line.trim(), this.canvas.width / 2, y);
            }
            y += 16;
        }

        return bgY + bgHeight;
    }

    renderCenteredCaption(text) {
        const lines = text.split('\n');
        const bgHeight = Math.max(100, lines.length * 25 + 20);
        const bgY = (this.canvas.height - bgHeight) / 2;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(50, bgY, this.canvas.width - 100, bgHeight);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px sans-serif';
        this.ctx.textAlign = 'center';

        let y = bgY + 30;
        lines.forEach(line => {
            this.ctx.fillText(line.trim(), this.canvas.width / 2, y);
            y += 25;
        });
    }

    renderTopCaption(text) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, 70);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';

        const words = text.split(' ');
        let line = '';
        let y = 25;

        words.forEach(word => {
            const testLine = line + word + ' ';
            if (this.ctx.measureText(testLine).width > this.canvas.width - 40) {
                this.ctx.fillText(line, this.canvas.width / 2, y);
                line = word + ' ';
                y += 18;
            } else {
                line = testLine;
            }
        });
        if (line) {
            this.ctx.fillText(line, this.canvas.width / 2, y);
        }
    }

    renderBottomCaption(text) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, this.canvas.height - 70, this.canvas.width, 70);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';

        const words = text.split(' ');
        let line = '';
        let y = this.canvas.height - 45;

        words.forEach(word => {
            const testLine = line + word + ' ';
            if (this.ctx.measureText(testLine).width > this.canvas.width - 40) {
                this.ctx.fillText(line, this.canvas.width / 2, y);
                line = word + ' ';
                y += 18;
            } else {
                line = testLine;
            }
        });
        if (line) {
            this.ctx.fillText(line, this.canvas.width / 2, y);
        }
    }

    renderSideCaption(text) {
        const boxWidth = 200;
        const boxX = this.canvas.width - boxWidth - 10;
        const padding = 10;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(boxX, 10, boxWidth, this.canvas.height - 20);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px sans-serif';
        this.ctx.textAlign = 'left';

        const words = text.split(' ');
        let line = '';
        let y = 25;
        const maxWidth = boxWidth - (padding * 2);

        words.forEach(word => {
            const testLine = line + word + ' ';
            if (this.ctx.measureText(testLine).width > maxWidth) {
                this.ctx.fillText(line, boxX + padding, y);
                line = word + ' ';
                y += 16;
            } else {
                line = testLine;
            }
        });
        if (line) {
            this.ctx.fillText(line, boxX + padding, y);
        }
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
        if (!btn) return;
        btn.textContent = this.isPlaying ? '⏸' : '▶';
        btn.title = this.isPlaying ? 'Pause' : 'Play';
    }

    renderCreditsScreen(shot) {
        this.ctx.fillStyle = '#f5f5f5';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw bridge image on left side if available
        if (this.bridgeImage && this.bridgeImage.complete) {
            const imgHeight = 280;
            const imgWidth = (this.bridgeImage.width / this.bridgeImage.height) * imgHeight;
            this.ctx.drawImage(this.bridgeImage, 10, this.canvas.height - imgHeight - 10, imgWidth, imgHeight);
        }

        const captions = shot.captions;
        if (captions) {
            if (captions.text1?.content) {
                this.ctx.fillStyle = '#333';
                this.ctx.font = 'bold 12px monospace';
                this.ctx.textAlign = 'left';
                const lines = captions.text1.content.split('\n');
                let y = 40;
                lines.forEach(line => {
                    this.ctx.fillText(line, 50, y);
                    y += 16;
                });
            }

            if (captions.text2?.content) {
                this.ctx.fillStyle = '#333';
                this.ctx.font = '11px sans-serif';
                this.ctx.textAlign = 'center';
                const lines = captions.text2.content.split('\n');
                let y = 280;
                lines.forEach(line => {
                    if (line.trim()) {
                        this.ctx.fillText(line, this.canvas.width / 2, y);
                        y += 14;
                    } else {
                        y += 7;
                    }
                });
            }
        }

        this.renderNarration(shot);
    }

    getActiveElements() {
        if (!this.manifest || !this.currentShot) return [];
        const elements = [];
        if (this.currentShot.characters) {
            this.currentShot.characters.forEach(char => {
                elements.push({
                    type: 'character',
                    id: char.id,
                    position: char.position || 'unknown',
                    emotion: char.emotion || 'neutral',
                    pov: this.currentShot.camera?.pov,
                    currentTime: this.currentTime
                });
            });
        }
        return elements;
    }

}

const player = new StickVidPlayer('animationCanvas');
window.__PLAYER__ = player;
