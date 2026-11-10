# Stored-save compression (2026-11-09)

Compatibility decision. Klein's lead-life save is about 1.87M characters; the 4 MiB
origin budget (`SAVE_STORAGE_BUDGET`, UTF-16 bytes) was one episode from refusing
every write. The stored string is now compressed; the plain JSON everywhere else is
unchanged.

## Decision

- Values of 256K characters or more are stored as `yairpg-lz1:` plus an LZ77 body
  packed 15 bits per UTF-16 unit (characters 0x20..0x801F: no NUL, no surrogates, so
  JSON, serde and WebKit accept it). Smaller values, and any value that would not
  shrink below 90 percent, stay plain.
- `getItem` returns the plain string and `setItem` takes the plain string, so every
  reader, byte comparison (native authority, backup undo, structured life, durable
  writer) and every exported file (`encodeSaveFile`) sees exactly today's bytes.
- Old plain stored saves read unchanged (no prefix, no decode). Damaged compressed
  bytes are returned as stored, so the caller's own parse check reports them.
- The budget guard measures stored form: the candidate through `storage.storedLength`
  and other keys through `storage.getStoredItem`. A storage without the codec
  (test doubles) falls back to plain length, so behaviour there is unchanged.
- Seam: `src/save_storage_codec.js` (leaf, no imports) patches the storage class
  prototype once (never the instance, since assigning a property on a Storage
  creates a stored key). The desktop host's `setItem` hook stays in the chain.
- Old saves are disposable (AD, 2026-11 memory), but nothing here needs a migration.

## Readers and writers checked

| Surface | Effect |
|---|---|
| `save_files.js` writeGuardedSave/checkSaveSize | sole source of SAVE_STORAGE_FULL; now measures stored form |
| `main.js` (reads at ~497-560, export/import probe) | plain via `getItem`; one dev-only `localStorage[key]` read changed to `getItem` |
| `native_authority.js`, `backup_undo.js`, `structured_life_runtime.js` | compare/parse `getItem` strings; plain and deterministic, route writes through the guard |
| `panel_folds.js`, `workspace_layout.js` | small keys, plain |
| `world_pack_save.js` `sectionBytes` | section budget, not the origin guard; unchanged |
| `desktop-tauri` `store_script`, `mirror_js`, `readStorage`, `scripts/tauri/save_mirror.cjs` | now read raw stored strings (`getStoredItem`) so the host copy holds the compressed form and a restore never writes a multi-MB plain value after a clear |
| `desktop-tauri/src/mirror.rs` `has_save`, `save_mirror.cjs` `hasSave` | accept the prefix as a save |
| `desktop-tauri/src/recover.html` | shows "save present" for a prefixed save instead of failing JSON parse |
| `scripts/playtest/lib.mjs`, `browser_parity.mjs`, `scripts/mcp/chromium_backend.mjs` | seed with plain `setItem` before the game loads, read through in-page `getItem`: both work |
| headless runner `MemoryStorage` | exposed as global `Storage`; the same prototype patch applies |

## Change surface

Files: `src/save_storage_codec.js` (new), `src/save_files.js` (two lines edited in place),
`src/main.js` (one import line, one call folded into the existing `createNativeAuthority`
line, dev-backup block shortened by 3 lines), the Tauri files above,
`tests/save_storage_codec.test.js`. `npm run check:arch`: main.js -2, display.js 0,
save_files.js 0; no new cycle edge or main import (the leaf has no imports).
Registration line: `installSaveStorageCodec(localStorage)` runs where the native
authority gets its storage, before any save read.

## Evidence

Measurements and browser results are in the lane report. Rust: `cargo test` in
`desktop-tauri` passed (7 tests); the Tauri app itself was not launched.
