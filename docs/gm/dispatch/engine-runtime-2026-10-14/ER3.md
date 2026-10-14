Read docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md and follow it.

Lane ER3: tech stack options. Output
docs/research/TECH_STACK_OPTIONS_2026-10-14.md and
docs/gm/dispatch/engine-runtime-2026-10-14/ER3/REPORT.md.

Use current web sources (cite URL and date) for each TS row in the root
palette plus anything missed. For each option: what it fixes here, adoption
path on this repo (plain ESM, esbuild, node:test, inkjs, desktop-first, many
parallel agents), cost, reversibility, and a smallest first step.
Cover at least: JSDoc + tsc checkJs vs TypeScript; ESLint flat config rules
worth having; Playwright for fresh-origin build/save/reload/import gates;
Web Workers and SharedArrayBuffer limits; IndexedDB vs OPFS vs File System
Access for saves, quotas and eviction (navigator.storage.persist);
CompressionStream; Tauri 2 vs Electron vs PWA for a desktop idle game,
including background throttling and Steam; signals / lit-html / Preact
islands vs vanilla; esbuild serve/watch live reload; big-number libraries.
End with a ranked shortlist of at most five first steps.
