# ASCII Sprite Editor

A modern, desktop-based ASCII art animation editor built with Electron, TypeScript, and Vite. Refactored for robust performance and a type-safe developer experience.

## Features

- **Character-Based Editing**: Draw animations using standard ASCII characters.
- **Dynamic Resizing**: Change canvas dimensions on the fly without losing data.
- **Animation Playback**: Preview your animations with adjustable frame durations.
- **Frame Management**: Insert and navigate through multiple frames via a vertical selector.
- **Color Control**: Set foreground and background colors for individual cells.
- **Export**: Save your sprite data as JSON for integration into other projects.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.x or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/smikulcik/ascii-sprite-editor.git
   cd ascii-sprite-editor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

To launch the application in development mode:
```bash
npm start
```

To build the application for production:
```bash
npm run build
```

## Development

- **Linting**: `npm run lint` (ESLint 9 + Prettier)
- **Type Checking**: `npm run type-check` (tsc)
- **Agentic Interaction**: See [AGENTS.md](./AGENTS.md) for guidelines on how AI agents interact with this codebase.

## Project Structure

```text
├── src/
│   ├── main/          # Electron Main Process (Lifecycle, Windows)
│   ├── preload/       # Electron Preload Script (Security, IPC)
│   └── renderer/      # Frontend Application (TypeScript + CSS)
│       ├── editor.ts      # Main Canvas & Interaction logic
│       ├── sprite.ts      # Core Data Structures & Resizing
│       ├── frame-selector.ts # Preview & Navigation
│       └── index.ts       # Entry Point & UI Event Handling
├── index.html         # Application Shell
├── electron.vite.config.ts # Build Configuration
└── tsconfig.json      # TypeScript Configuration
```

## License

ISC
