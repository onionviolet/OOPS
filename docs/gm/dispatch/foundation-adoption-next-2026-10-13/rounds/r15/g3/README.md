# R15 G3 verification

The current replay uses the merged worker build on `127.0.0.1:19130`, headless
Chrome, 1600x1100. Browser profiles stay under `/private/tmp/r15-g3-profile*`.
The fixture generator imports the genuine historical test export through real
`importSaveFile` and `load`, changes the hero name and adds only the listed
ordinary stock with `character.addToInventory`, then calls real `create_save`
and `encodeSaveFile`. A second model imports and loads each output. See
`fixture/VERIFICATION.json`; no personal save is used.

From this worktree:

```sh
npm run build
python3 -m http.server 19130 --bind 127.0.0.1
# In another terminal:
node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g3/fixture/generate.mjs
node docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g3/harness.cjs /private/tmp/r15-g3-profile-new
```

Send `helpers.js` through `repl.sh` once. Then use `node run-step.mjs steps/<file>`
from this folder, in this order:

1. `current-00-import.js`, `current-01-study.js`, `current-02-kits.js`,
   `current-03-cancel-failure.js`.
2. `current-10-fa13-import.js`, `current-11-control-stamina.js`.
3. `fa13-03-controlled-comparison.js`, `fa13-04-pins.js`,
   `fa13-05-stave-pin-kit.js`, `fa13-06-dog-oil-feats.js`,
   `current-17-fa13-assertions.js`, `fa13-07-feats-ui.js`.
4. `current-20-old-absence.js`, `current-21-clouded-debit.js`,
   `current-30-copy-cancel-owner.js`.

`source-fa13.mjs` reruns the R8 probe against this worktree and adds loss-of-
support cases. `tests/fa10_manual.test.js` owns the FA10 source checks. The
other `fa10c-*` and `fa13-01/02` steps preserve the earlier worker's work;
they are not part of the merged-build replay above.

After that sequence, `node verify-evidence.mjs` checks the saved results,
fatigue timing, both native debit probes and every current persistence
comparison. Run `node compact-evidence.mjs` only after the browser sequence has
finished using its literal exported files.

Every checkpoint uses actual Save, reload, Export, and native file-input Import.
Comparisons cover character, all native person inventories, the entire expansion,
calendar, location, NPCs and NPC equipment. Equipment display caches populated by
the exporter are explicitly listed; all other fields must match. Early partial
checks that compared those caches strictly are kept as failed comparisons, then
superseded by the qualified comparisons, never silently called exact.

The stamina probe stops wall-clock timers immediately after a real durable
reservation to prevent Village regeneration racing the observation. It changes
no game values; reload resumes normal time. All other jobs use ordinary time.

Export files may be gzip-compressed for the evidence size limit. Decompress to
`/private/tmp/` before a replay Import, preserving the original bytes. SHA-256
values in checkpoint JSON refer to those uncompressed bytes. Delivered fixtures
are compressed too; the generator recreates their plain literal import files,
or decompress them to the same paths before running the browser steps. Older
manual exports superseded by the current replay are retained only in the local
archive, with hashes and dispositions in `evidence/COMPACTION.json`. Never
commit the generated bundle, HTML version change or a browser profile.
