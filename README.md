# PC Builder

Interactive PC configurator with a live compatibility engine, performance estimates and a
photoreal 3D viewer. Available in English, Russian and Uzbek. Built with TanStack Start,
React 19, TypeScript, Tailwind CSS and Three.js (`@react-three/fiber`).

## Features

- 13 part categories, 129 catalogue parts (`src/data/parts.ts`)
- Compatibility checks (`src/lib/build.tsx → runChecks`): CPU socket, RAM type, motherboard form
  factor vs case, GPU length vs case, cooler socket and cooling capacity vs CPU, PSU headroom,
  and a warning when essential parts are still missing
- Price split into **PC** and **desk set-up** (monitor, peripherals, desk, chair)
- Performance score and FPS estimate (a planning estimate, not a benchmark)
- 3D viewer with real GLB models (`public/models`, credits in `3D_MODELS.md` and the About page)
- Saved builds, light/dark theme, EN / RU / UZ

## Development

```sh
npm install
npm run dev      # start the dev server
npm test         # catalogue, compatibility and translation tests
npm run lint
npm run build
```

## Data and backend

There is no backend yet. The catalogue is static sample data, and the current build, saved
builds, theme and language live in the browser (`localStorage`). To go live, replace the
static catalogue in `src/data/parts.ts` with an API (prices, stock) and move saved builds,
accounts and orders to a server. The UI reads parts only through `getPart`, `partsByCategory`
and `ALL_PARTS`, so that is the single integration point.

## Licences

3D models are CC BY 4.0 unless noted otherwise in `3D_MODELS.md`. Keep the visible credit on the
About page when publishing. Models marked "user-provided" or "royalty-free" need their licence
confirmed before commercial use.
