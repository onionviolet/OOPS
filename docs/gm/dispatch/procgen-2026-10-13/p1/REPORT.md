# P1: seeded core loop

Completed locally 2026-10-14 EDT, in the 2026-10-13 procgen dispatch. Branch `proc/p1-streams`, isolated worktree `proc-p1-streams`, server port 19310. Main checkout was read-only. Scope comes from the user's P1 instruction, COMMON/PLAN and E1's core design; cheat access remains deferred.

The ordinary native loop now uses per-save named streams for enemy groups, combat rolls, drops, merchant stock, crafting, action rewards, gathering and local-life chances. No new player controls or enrollment are needed. Follow the usual Village elder dialogue to Infested field; fight, Save mid-fight and reload. Village merchant stock uses the existing Visit a merchant route. Existing crafting stations, native actions and gathering activities use the same saved bridge.

## Implementation and compatibility

**D1: additive save extension.** `expansion.streams = {schema:1, root, cells, log}`. Missing state derives its root once with the existing FNV derivation from the save's current expansion RNG and `streams.root`. The original historical seed cannot be recovered from that moving cursor. Existing saves' future formerly-unseeded native outcomes deliberately become deterministic; their inventory, earned progress and prior outcomes are not rewritten. Pre-expansion saves with no seed use the stable native-stream fallback seed 1, leaving the legacy expansion RNG unchanged. New saves derive from their freshly created per-save seed. Unsupported stream schemas and malformed cells/receipts are rejected by this reader; unknown saved names are retained but cannot be drawn until registered.

The stream schema is independent of the expansion engine's existing feature-admission schemas. No expansion-engine schema bump, simulation enrollment change or generator replacement was made. Old builds cannot be retroactively taught to reject this additive field, so use this compatible reader for these exports. No anti-save-edit policy is added.

**D2: keyed decisions plus saved cursors.** The registry, FNV derivation, Murmur-style finalizer, pure chance/table/integer decisions, counters and receipt ring live in `src/seeded_streams.js`. World streams use `@worldId`; `craft` is campaign/person-side. Repeated native reward/gather/craft decisions advance only their own saved cell. Encounter generation reserves a saved encounter ordinal and keys its composition draws to that instance. Combat uses `encounter:core` with encounter/fighter/turn/target/decision keys, keeping the cell set bounded. Loot is keyed by enemy instance and item. Merchant presence/count/quality are keyed by trader, refresh epoch, template slot and decision. A market draw cannot shift an encounter, combat or loot decision. Integer ports preserve legacy `Math.round` distribution.

Receipts retain the declared decision key and exact unit value, at most 32 per stream and 256 total. Pure evaluations do not mutate state; native commits retain their receipts. Injected combat callbacks carry their turn-local RNG into status picks. Pin/bias/reroll/rewind policies are not implemented. The decision helpers, explicit keys, salts and receipts are the clean extension seam.

**D3: active fights are saved too.** Before this change, current enemies were discarded on load. `native_encounter` now retains template identities, rolled stats, health/alive state, per-fighter turns and pending attack progress/targets/power. Restoration does not generate a group, draw a roll or charge stamina again. A valid durable last-kill boundary may contain all dead enemies: starting it resumes the pending zone clear without granting that kill or its loot twice. Dead fighters' pending timers are not retained.

A commit-only recipe view redirects internal quality rolls while binding private-field methods to the original recipe. The original recipe object stays unchanged, so previews do not consume stream state. Native craft rollback includes stream state. Reward `chance:0` and mixed-reward inclusion `0` now mean impossible rather than falling through a truthiness check. All probabilities retain the original numeric thresholds otherwise.

The legacy expansion action tables, simulation check/outcome cursors and already-seeded duel/battle adapters retain their generators and outcomes. Their migration onto E1's future discovery/event wrappers, cross-life stream transfer and cheat controls are outside P1.

## Files

| Area | Change |
|---|---|
| `src/seeded_streams.js` | New saved stream/decision module, host bridge, commit-only recipe view and encounter validation |
| `src/models/location.js` | Saved encounter ordinal and keyed composition/size/stat variation; enemy instance/template identities |
| `src/models/combat.js` | Injected damage RNG, keyed block/evade/crit/targets/callbacks; snapshot and pending-turn restoration |
| `src/enemies.js` | Keyed loot chances/counts; injected on-hit/on-damaged/status picks |
| `src/components/trader_component.js` | Keyed presence/count/quality for each trader refresh epoch |
| `src/absorb_c2/local_life.js` | Requires an injected saved RNG when a chance is actually evaluated |
| `tests/seeded_streams.test.js` | Eight source tests, including real native models and a craft rollback regression |
| This `p1/` folder | Checkpoint, report, backlog, reproducible harness, small test-save/export fixtures and desktop evidence |

Shared-file edits, separately listed:

- `src/main.js`: bind/initialize/migrate streams; route native action/reward/mixed/craft/recovery/gather/local-life draws; include stream state in craft rollback; snapshot and restore native encounters; resume a saved last-kill clear. Craft quality uses a scoped view, leaving P2's recipe file untouched.
- `src/save_files.js`: validate the additive stream and encounter fields before accepting an envelope.
- `src/simulation.js`: **no edits**.

No edits to `src/combat_math.js`, `src/crafting_recipes.js`, `src/items.js`, `src/misc.js` or other slices' owners. `dist/` and `index.html` were rebuilt for verification and are not committed.

## Verification

| Code | Label | Check | Result |
|---|---|---|---|
| S1 | SOURCE | Eight focused stream tests: same-seed replay across native families; per-system/keyed independence; JSON restore continuity; old-save deterministic load; pure previews, legacy rounding, chance 0/1 and weighted tables; schema/cell validation and receipt bounds; real native lineup/loot/stock/hit/pending-turn replay with unseeded draws forbidden; craft rollback | PASS |
| S2 | SOURCE | `npm test` | PASS, 629 tests, zero failures/skips |
| S3 | SOURCE / rebuilt | `npm run build`; changed sources match built source-map content; served bundle SHA-256 equals the worktree build | PASS |
| N1 | seeded-native | Fresh persistent Chrome profile, real game constructor seed 43, named hero `TEST FIXTURE PROCGEN P1 replay`; native XP and location-unlock APIs provide test readiness; actual combat timers execute | PASS |
| N2 | seeded-native | Save mid-fight after two hero hits; note the next kill; restore the exact checkpoint via normal reload. Manual Save writes verified, not merely read from stale storage. Same loaded enemy health/stats and stream state; same subsequent hero roll receipts, kill loot and next rolled lineup | PASS, one Rat tail in both branches, one bestiary kill, six hero hits by settlement |
| N3 | seeded-native | Start the ordinary Village trader through the native API; restore pre-refresh Save by reload and refresh again | PASS, identical inventory and market receipts |
| N4 | seeded-native | UI Export download; change purse through real native code and Save; literal downloaded file uploaded to `#saved_file_input`; application's probe/normal reload; manual Save of imported runtime | PASS, exact tested projection: streams, encounter, inventory, native XP, merchant inventory, purse and combat counters |
| N5 | seeded-native / visual | Rebuilt 1366x768 combat/Village captures and 1600x1000 Village capture inspected | PASS, usable desktop panels and native Save/Export/Import controls; mobile deferred |

Evidence: [browser observations](BROWSER_EVIDENCE.json), [source/build checks](CHECKS.json), [harness](browser_proof.mjs), [fight](fight-1366.png), [Village](village-1366.png), [wide Village](village-1600.png). Fixtures are synthetic and remain under this worktree's report folder; no personal save was read. Profiles stay under `/private/tmp/procgen-p1-profile-*`.

Combat's wall-clock scheduling remains the existing timer system. N2 compares decision receipts, inventory and next lineup, not exact millisecond timer phase or every interleaving-dependent XP effect. The import check occurs before a new idle tick; the wide screenshot follows a tick so the restored writable status is visibly refreshed. No natural low-level pacing or human acceptance is claimed.

During proof, the first native kill exposed overly strict validation of an all-dead pending-clear snapshot; that was fixed and added to source coverage. A virtual-clock harness did not advance the native timers reliably and was replaced by ordinary elapsed native timers. An initial import comparator included a new second of idle Breathing XP; the final check observes restored state before that tick and verifies an actual manual Save write. Earlier incomplete attempts are not acceptance evidence.

## Randomness deliberately retained

| Sites | Why retained |
|---|---|
| `main.js`: floating click-effect pick, failure-line variants | Presentation only; no reward/action eligibility changes |
| `main.js`: rat dialogue easter egg | Display text only |
| `main.js`: background/activity sound chance and sound-line pick | Log ambience only |
| `display.js`: effect position/appearance; all `particles.js` draws | Visual animation only |
| `combat_math.js` default `Math.random` arguments | Existing injectable API retained. Native combat passes a saved keyed RNG; existing seeded battle/duel callers retain their injected RNG |
| `misc.js:random_range` and original recipe quality methods | Default compatibility helpers retained without editing P2's owner. The production native craft path uses its seeded recipe view; other display/source callers do not advance native stream state |

Remaining extended native checks and deferred work are listed in [BACKLOG](BACKLOG.md). Root owns branch integration and any merged PROJECT/design-owner status update. This worker does not push or merge.
