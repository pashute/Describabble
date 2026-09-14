// Filename: vid-loader.js v0.1.7
// .vid File Parser and Loader for stickvid
// Parses Describabble Video Manifest files (nested YAML format)

class VidFileParser {
    parse(vidContent) {
        const lines = vidContent.split('\n');
        const manifest = {
            movie: {},
            specs: {},
            descriptions: {},
            translations: {},
            metadata: {},
            viddata: {},
            status: {},
            basePath: './'
        };

        let currentSection = null;
        let currentSubSection = null;

        for (const line of lines) {
            // Skip comments and empty lines
            if (line.trim().startsWith('#') || !line.trim()) continue;

            // Section headers
            if (line.startsWith('##')) {
                let sectionName = line.replace('##', '').trim().toLowerCase();
                // Remove parenthetical descriptions from section headers
                sectionName = sectionName.replace(/\s*\(.*?\)\s*$/, '');
                currentSection = sectionName;
                currentSubSection = null;
                continue;
            }

            // Parse key: value pairs
            if (line.includes(':')) {
                const indent = line.search(/\S/);
                const [key, value] = line.trim().split(':').map(s => s.trim());

                // Top-level key in section (not indented)
                if (indent === 0) {
                    currentSubSection = key;
                    if (currentSection === 'movie metadata' && key === 'movie') {
                        currentSubSection = 'movie';
                    } else if (currentSection === 'duration & technical specs' && key === 'specs') {
                        currentSubSection = 'specs';
                    } else if (currentSection === 'status & build info' && key === 'status') {
                        currentSubSection = 'status';
                    } else if (currentSection === 'file paths' && key === 'file_paths') {
                        currentSubSection = 'file_paths';
                    }
                } else {
                    // Indented key-value pair (child of currentSubSection)
                    if (currentSubSection === 'movie') {
                        manifest.movie[key] = value;
                    } else if (currentSubSection === 'specs') {
                        manifest.specs[key] = isNaN(value) ? value : parseFloat(value);
                    } else if (currentSubSection === 'descriptions' && key !== 'describs') {
                        manifest.descriptions[key] = value;
                    } else if (currentSubSection === 'translations' && key !== 'describs') {
                        manifest.translations[key] = value;
                    } else if (currentSubSection === 'metadata' && key !== 'describs') {
                        manifest.metadata[key] = value;
                    } else if (currentSubSection === 'viddata') {
                        manifest.viddata[key] = value;
                    } else if (currentSubSection === 'status') {
                        manifest.status[key] = value === 'true' ? true : (value === 'false' ? false : value);
                    } else if (currentSubSection === 'file_paths' && key === 'basePath') {
                        manifest.basePath = value;
                    }
                }
            }
        }

        return manifest;
    }

    validate(manifest) {
        const errors = [];

        // Required fields
        if (!manifest.movie.name) errors.push('Missing movie name');
        if (!manifest.specs.totalDuration) errors.push('Missing total duration');
        if (!manifest.descriptions.scene1) errors.push('Missing scene1 description');
        if (!manifest.viddata.scenes) errors.push('Missing scenes vidData');
        if (!manifest.viddata.characters) errors.push('Missing characters vidData');
        if (!manifest.viddata.locations) errors.push('Missing locations vidData');

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
        this.vidData = null;
    }

    async loadFromFile(vidFilePath) {
        try {
            const response = await fetch(vidFilePath);
            const vidContent = await response.text();
            return this.parse(vidContent, vidFilePath);
        } catch (error) {
            console.error('Failed to load .vid file:', error);
            throw error;
        }
    }

    async loadFromUrl(vidUrl) {
        try {
            const response = await fetch(vidUrl);
            const vidContent = await response.text();
            return this.parse(vidContent, vidUrl);
        } catch (error) {
            console.error('Failed to load .vid from URL:', error);
            throw error;
        }
    }

    parse(vidContent, basePath) {
        this.manifest = this.parser.parse(vidContent);

        // Validate
        const validation = this.parser.validate(this.manifest);
        if (!validation.valid) {
            throw new Error(`Invalid .vid file: ${validation.errors.join(', ')}`);
        }

        // Set base path if not already set
        if (!this.basePath && this.manifest.basePath) {
            this.basePath = this.manifest.basePath;
        }

        return this.manifest;
    }

    async loadVidData() {
        if (!this.manifest) {
            throw new Error('No manifest loaded. Call parse() first.');
        }

        const vidData = {};

        try {
            // Load scenes.json
            const scenesResponse = await fetch(
                `${this.basePath}${this.manifest.viddata.scenes}`
            );
            vidData.scenes = await scenesResponse.json();

            // Load characters.json
            const charactersResponse = await fetch(
                `${this.basePath}${this.manifest.viddata.characters}`
            );
            vidData.characters = await charactersResponse.json();

            // Load locations.json
            const locationsResponse = await fetch(
                `${this.basePath}${this.manifest.viddata.locations}`
            );
            vidData.locations = await locationsResponse.json();

            this.vidData = vidData;
            return vidData;
        } catch (error) {
            console.error('Failed to load vidData files:', error);
            throw error;
        }
    }

    getMovieInfo() {
        if (!this.manifest) {
            throw new Error('No manifest loaded.');
        }

        return {
            title: this.manifest.movie.name,
            description: this.manifest.movie.description,
            duration: this.manifest.specs.totalDuration,
            version: this.manifest.movie.version,
            created: this.manifest.movie.created,
            creator: this.manifest.creator,
            canvasWidth: this.manifest.specs.canvasWidth,
            canvasHeight: this.manifest.specs.canvasHeight
        };
    }

    getFileList() {
        if (!this.manifest) {
            throw new Error('No manifest loaded.');
        }

        return {
            descriptions: this.manifest.descriptions,
            translations: this.manifest.translations,
            metadata: this.manifest.metadata,
            viddata: this.manifest.viddata
        };
    }
}

// Export for use in player
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VidFileParser, VidLoader };
}
