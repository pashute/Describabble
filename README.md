# Describabble

Describabble is a dataless video storage and playback system: instead of storing heavy video files, it stores lightweight `.desc`, `.meta`, and `.trans` text assets and reconstructs scenes at playback time through deterministic rendering.

## Core architecture

1. **Analyzer** (`src/analyzer`)  
   Back-end on Vercel using the Vercel AI SDK + Mastra with `gemini-flash-lite` to manipulate `.desc`, `.meta`, and `.trans`.
2. **Author** (`src/author`)  
   Specialized chat-controlled UI built with React Native and Expo Web (web-first).
3. **Render** (`src/render`)  
   React Native + Expo Web renderer using PixiJS for high-performance 2D animation.
4. **Data** (`src/data`)  
   Upstash Redis-backed storage for compressed modular parts and fast-access summaries.

## Project layout (spec-level)

- `src/author/chat`
- `src/analyze`
- `src/data`
  - `data/general` (`desc`, `meta`, `trans`)
  - `data/movies/surveyor` (`desc`, `meta`, `trans`)
- `src/render`
- `dev/docs/plans`
- `dev/testing` with per-section testing folders:
  - `testing/features` (Cucumber)
  - `testing/units` (Jest)
  - `testing/ete` (Playwright)

See `/dev/docs/plans/specs.md` for the full requirements specification.
