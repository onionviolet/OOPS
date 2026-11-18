# Pin store lane (PSA29, 2026-11-17)

Built: `src/pin_store.js`, `src/pin_store_domain.js`, `src/gu_rank_pins.js`, `tests/pin_store.test.js`; one side-effect import line in `src/native_tool_domains.js` (no `main.js` change).

## Shape (default, with dials)
- One address space: `pinAddress("gu.rank", id)` over gen_kit `address`. Default: a dotted lowercase space plus at least one id.
- Two layers, one read: manifest pins (kind `canon` or `exception`) are content and never saved; cheat pins are saved in the `pins` slice. Default: manifest wins and a cheat cannot take its address. Dial: a world that lets a cheat bend canon adds an explicit override with a cost (G6 PC2).
- Slice: `{schema:1, revision, cheats:{addr:{value,note,revision}}, manifests:{name:rev}}`. Absent when no cheats, so older saves keep their bytes. Newer schema is refused. No older slice exists, so no migration is needed beyond `null` to fresh. Old saves are unaffected.
- Caps (defaults, adjustable): 200 cheats, 2000 characters per value, JSON data (default; a richer value type would need its own dial).

## Exceptions and their reasons
The 15 PWC92 exceptions load as `exception` pins with `reasonStatus: class-only`. Their in-world reasons are not read yet (the file says "needs a chapter read"). No reason was invented. Reading each chapter and flipping a pin to `read` is the open work.

## Receipts
- `node --test tests/pin_store.test.js`: 4 pass.
- Game MCP walk on a rebuilt worktree build, test origin, seed 7: Dev pins panel lists 15 exception pins with reasons; set cheat `gu.rank / candidate:walk-cheat = 6` through the panel; `game_save` (hash aa958401219d73ed); `game_reload` showed the cheat plus the 15 exceptions; `game_export`, then `game_new` with that file in a fresh session showed the same cheat line. Zero page errors.
- `gu.rank.precursor` pin read is proven in the unit test (pin wins, plain rule otherwise); the game exposes the pins through the panel, not a gu rank consumer yet.

## Gaps
- Default for now: no live game route consumes a gu rank; the rule reader is covered by test only.
- The panel sets pins in memory; they reach disk on the next save (manual or autosave).
- Name for later: a per-world manifest loader for canon pins beyond Gu.
