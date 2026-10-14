# ER14 disposable kernel spike

Proposal and headless synthetic evidence only. No repo runtime integration.

Run without dependencies:

```sh
node check.mjs
```

Run the comparison on the owning checkout (read-only imports of the repo's current expansion modules):

```sh
ER14_REPO=/Users/weiwei/code/yet-another-idle-rpg node benchmark.mjs
```

The benchmark writes its JSON beside itself and filesystem chunks under
`/tmp/yairpg-er14/writes/`. Run from a scratch copy if keeping lane evidence fixed.
Node 22 or later. No node_modules, browser, build or user saves required.

`kernel.mjs` is the new kernel. `adapter.mjs` declares three fixture modules.
`copied/pacing.mjs` is an exact copy of `src/absorb_e1/pacing.js`;
`copied/world_rhythm.mjs` is an exact copy of `src/world_rhythm.js`.
Their original comments and repository LICENSE are retained. The pacing file
also exports singleton runtime wrappers; the adapter calls only its pure functions.
`source-snapshot.json` pins source hashes and historical ER1 input.

Time is safe whole played minutes, with one host `advance` owner. At a boundary,
ordered interval systems run before due commands; equal-time due work is ordered
by dependency rank, event ID and sequence. Each public operation commits once
or rolls back. Modules are trusted functions, not sandboxed plugins. IDs are
idempotent for commands, not unique job slots. Module/schema version 1 is pinned;
no migration or future-field preservation is implemented.

Save writes content-addressed JSON domain chunks then a manifest pointer. The
filesystem benchmark replaces that pointer through a temporary file and rename,
without fsync. Memory failure tests preserve the previous manifest. Live state
can be newer than the stored snapshot after failed save. Storage is explicit,
not part of each command's transaction. Loading validates all chunks before
publishing. Changed-slice validation includes declared reverse dependencies;
missing declarations cannot be detected by this prototype. Total-byte reporting
reads all referenced chunks even on an incremental save.

Exact split equality covers default-off hunger with weather enabled and a fixed
Spring/home-world context. A separate measured enabled-hunger floating-point
counterexample is retained. Replay uses the same fixture/content, initial seeds,
commands and advance records, including command IDs. It is not whole-game replay.

Known omitted contracts: native pause/choice/life barriers, world/season context
changes, stock-backed meals, native calendar publication, durable command commit,
browser writer lock, browser storage/import, recovery history/GC, migrations,
bounded replay/receipt retention, per-entity updates, event notifications/panels.
