# stickmake v0.1.5 (confirmed)

Backend translator for Describabble: converts describ markdown files into .vid manifests.

Translates natural language descriptions of stick figure animations into structured .vid manifest files (nested YAML format).

## Usage

1. Start: `npm start` (http://localhost:3002)
2. POST describ files to `/api/translate` with translation schema
3. Receive: .vid manifest file

## Endpoints

- `POST /api/translate` - Translate describ to .vid manifest
- `POST /api/translate/batch` - Batch translate
- `POST /api/validate` - Validate describ compliance
- `GET /api/health` - Health check

## Requirements

Gemini API key in `src/.env` (graceful fallback without AI)

## License

Unlicense (Free and Open Source)
