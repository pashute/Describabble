// Filename: vid-loader.js v0.1.9
// .vid File Parser and Loader for stickvid
// Parses standardized YAML .vid manifests (self-contained, no external files)

class VidFileParser {
    parse(vidContent) {
        try {
            if (typeof jsyaml === 'undefined') {
                throw new Error('YAML library not loaded');
            }
            const manifest = jsyaml.load(vidContent);
            return manifest;
        } catch (error) {
            throw new Error(`Failed to parse .vid file: ${error.message}`);
        }
    }

    validate(manifest) {
        const errors = [];

        if (!manifest.movie?.name) errors.push('Missing movie name');
        if (!manifest.specs?.totalDuration) errors.push('Missing total duration');
        if (!Array.isArray(manifest.scenes) || manifest.scenes.length === 0) errors.push('Missing scenes');
        if (!Array.isArray(manifest.characters) || manifest.characters.length === 0) errors.push('Missing characters');

        manifest.scenes?.forEach((scene, idx) => {
            if (!scene.shots || scene.shots.length === 0) {
                errors.push(`Scene ${idx} has no shots`);
            }
        });

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

class VidLoader {
    constructor(basePath = '') {
        this.basePath = basePath;
        this.parser = new VidFileParser();
        this.manifest = null;
    }

    async loadFromFile(vidFilePath) {
        try {
            const response = await fetch(vidFilePath);
            const vidContent = await response.text();
            return this.parse(vidContent, vidFilePath);
        } catch (error) {
            throw new Error(`Failed to load .vid file: ${error.message}`);
        }
    }

    parse(vidContent, basePath) {
        this.manifest = this.parser.parse(vidContent);

        const validation = this.parser.validate(this.manifest);
        if (!validation.valid) {
            throw new Error(`Invalid .vid file: ${validation.errors.join(', ')}`);
        }

        return this.manifest;
    }

    getMovieInfo() {
        if (!this.manifest) {
            throw new Error('No manifest loaded.');
        }

        return {
            title: this.manifest.movie?.name || 'Untitled',
            description: this.manifest.movie?.description || '',
            duration: this.manifest.specs?.totalDuration || 0,
            version: this.manifest.movie?.version || '0.1.9',
            created: this.manifest.movie?.created || '',
            creator: this.manifest.movie?.creator || '',
            canvasWidth: this.manifest.specs?.canvasWidth || 960,
            canvasHeight: this.manifest.specs?.canvasHeight || 540
        };
    }

    getFileList() {
        if (!this.manifest) {
            throw new Error('No manifest loaded.');
        }

        return {
            describs: this.manifest.describs || {},
            characters: this.manifest.characters || [],
            locations: this.manifest.locations || [],
            scenes: this.manifest.scenes || []
        };
    }
}

// Export for use in player
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VidFileParser, VidLoader };
}
