# INFRA-SIGHT — Simplified Bridge Workspace

## UX flow
1. Open INFRA-SIGHT.
2. Select the available bridge from the entry screen.
3. Enter the bridge workspace.
4. Use the 3D twin as the primary visual anchor.
5. Use the bottom sections for Overview, History, Evidence, Engineering, Inspections and Data lineage.
6. Select a structural component only when you need component-level intelligence.

## Current asset
The selector intentionally exposes only the first registry asset for the current demo. The underlying multi-bridge registry remains intact so additional open-source assets can be added later.

## Run locally
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
```

The uploaded `node_modules` folder was intentionally not included in the cleaned package because native bundler binaries are platform-specific. Install dependencies on the target machine before building.
