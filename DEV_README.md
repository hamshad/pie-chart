# Development — @hamshad/pie-chart

This file contains development-focused instructions: how to run the example locally, build the library, and common tasks.

Prerequisites
- Node.js (LTS recommended)
- npm or yarn

Install dependencies

```bash
npm install
```

Available scripts

These are the scripts defined in `package.json` and what they do:

- `npm run dev` — start the Vite dev server (serves the workspace; open `http://localhost:5173/example/index.html` to view the example)
- `npm run dev:example` — alias for the Vite dev server
- `npm run build:example` — build the example to `example-dist` using Vite
- `npm run build:lib` — build the library bundle using Rollup (runs the same Rollup config as `build`)
- `npm run build` — runs Rollup to create `dist/` (entry points: `dist/index.js`, `dist/index.esm.js`, `dist/index.d.ts`)

Common workflows

- Run example locally

```bash
npm run dev
# then open http://localhost:5173/example/index.html
```

- Build the example for preview (produces `example-dist/`)

```bash
npm run build:example
```

- Build the library for publishing

```bash
npm run build:lib
```

Publishing notes

- The package uses `prepublishOnly` which runs `npm run build` before publishing.
- Make sure `dist/` contains built JS and type declarations before publishing.

Tips & troubleshooting

- If you change Rollup or Vite config, restart the dev server.
- If type declarations are missing, ensure TypeScript runs successfully and `tsconfig.json` has `declaration: true` for library builds.
- The project declares `react` and `react-dom` as peerDependencies; install compatible versions in consuming apps, not in this library.

If you need any more dev scripts (tests, lint, format, CI) I can add them.
