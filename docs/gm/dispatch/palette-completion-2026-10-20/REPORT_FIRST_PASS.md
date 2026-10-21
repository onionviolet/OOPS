# Palette implementation, audit and repairs

## Result and current boundary

2026-10-20. A substantial native implementation is delivered and rebuilt-browser checked. **The full retained palette is not complete.** The original 27/53 checked figure predates this run; it must not be presented as the current amount implemented, and this report does not replace it with an unsupported 53/53 claim. The remaining specific implementations and proof gaps are in [COVERAGE.md](COVERAGE.md). Weibao's full implementation request remains open.

Authority: Weibao requested “Fully implement”, “use luna subagents accordingly and then audit”, and root implementation of better approaches after auditing. [Checkpoint](CHECKPOINT.md), [independent Luna audit](AUDIT.md), [meter lane](METERS.md), [feedback lane](FEEDBACK.md), and [final runtime input hashes](INPUTS.json). No commit, push, publishing or personal-save access occurred.

## Delivered native behavior

- Tools exposes real repair progress/stage, native busy/location pause reasons, cancel/material return semantics, per-copy condition/change and proposed restoration. Lamp-only ownership discovers Tools; actual lamp fuel, loose flasks and burn rate follow the existing lamp owner. No second fuel clock or spending owner.
- Crafting distinguishes owned/unblocked/blocked stock and the native selected-group restriction. Batch choices show non-reserving maximum input proposals; actual attempts/successes come from the native counter port. Existing native stock, skill caps, quality, RNG and rollback remain authoritative.
- Processing now has a reachable workspace panel, frozen original work totals for new jobs, saved processed count, actual automatic-cycle status, stop-after-current wording and explicit cancel/return wording. Old remaining-only jobs remain readable without an invented total; new totals validate and round-trip.
- Condition reads the actual local cold threshold/tolerance; native rate cells show sign and zero reference without inventing net battle rates. Stat labels stay intact by moving values to the next line when necessary. A browser-only loot filter hides retained rows without changing acquisition or save data.
- Native session notes compare known inventory, tool copies and discovered skills across real place changes. Full return Details retain every compared change and identify the remembered snapshot. Native output receipts name their carried destination. Known scene/tool/competence cues reuse the existing effects/sound settings; hidden-return animation replay is suppressed. The actual place owner hosts local cues in the visible shell.
- The existing owned-home model drives a bounded cat/hearth scene, real prepaid fuel meter, static/off state, optional original flame movement, known furniture Active here/Available at readings and native bonus inspection. The existing native meet/install/light/vent/extinguish and furniture owners still own commands/effects. This does not implement a furnace, new heat/light/cooking effects or automatic refuelling.

## Audit and root repairs

F1 sound had no gesture activation. F2 local cues targeted a different or hidden host. F3 unblocked counts were described as universally usable despite the native selected-group gate. F4 snow was called rain. F5 return summaries silently omitted changes after four. Root repaired these, preserved the native material policy, and added full Details. Root also removed a new cyclic skill-table import by passing the existing discovery table through the read port.

The combined suite then exposed two more real failures. An early import could call the harvest projection before ports existed; baseline establishment now waits for the first configured render. Native crafting's new receipt read private `game_stats`, causing a ReferenceError before the craft command; it now uses the existing read-only `gameStats` port. The previously passing helper checks had not exercised that native click. Both exact failing tests passed on repair. Browser inspection additionally found raw processing UI unreachable in the shell; it is now registered through the panel kit and layout spec. A headless departure/return regression exposed missed place publications; native completed location changes now refresh observers.

## Evidence and input identity

Final isolated candidate: `/tmp/oops-palette-candidate-20261020`. Bundle SHA-256 `27b627308d043cd2397c74c0d21668cf2ff8b64e7246649ffdaa9769d78afb0c`. [INPUTS.json](INPUTS.json) compares all 31 touched runtime/style inputs against that candidate: **zero drift** at final capture. Shared generated `dist/` and index fingerprints were not rebuilt by this task.

| Check | Result and scope |
|---|---|
| Isolated `npm run build` through the existing build helper | PASS on final candidate; source Ink/compiler checks included |
| Full `npm test` | **2364 passed / 0 failed**, 72.61 seconds, after fixing both integrated failures. This full run precedes the final narrow visible-place join and hearth/furniture display refinement |
| Final changed-input focused checks | **13/13** for village workspace, native session return/load, feedback and UI contracts after the visible-place join; **4/4** for household scene and UI contracts after the hearth/furniture refinement. These are separate evidence, not a second full-suite claim |
| `npm run check:arch` on final source | PASS: main -7 lines, display -76, save 0 versus baseline; no new main imports/cycle edges |
| `npm run check:rules` | PASS; existing warning for the linked untracked gear-depth owner remains |
| `npm run check:rule-behavior` | PASS, 36 cases |
| Rebuilt browser | **8 recorded checks**: lamp/use/fuel; pending processing round trip; finished processing round trip; processing count/carried receipt; loot visibility without state change; visible lamp cue and optional WebAudio start after a user gesture; actual home meet/install/light/fuel; Gothic 21px at 1920×1080, 1800×1040, 1536×864 plus high contrast/reduced motion |
| Diff whitespace | PASS on the task's runtime/style paths. Existing dirty shared generated outputs are outside this task's claim |

Browser command: `node scripts/playtest/palette-completion.mjs /tmp/oops-palette-candidate-20261020 /tmp/oops-palette-browser`. Evidence and screenshots: `/tmp/oops-palette-browser/receipt.json`, `palette-home-native.png`, `palette-1920x1080.png`, `palette-1800x1040.png`, `palette-1536x864.png`, `palette-high-contrast-reduced.png`. Optional private-pack manifest 404s are explicitly matched to observed requests; unexpected requests and page/console errors fail.

Browser setup was a disposable, seeded mid fixture with a carcass and selected stock/ownership. Before changed commands, its first load normalized twenty pre-existing zero-XP entries for two NPCs; the receipt records those exact initial normalization differences. New pending and finished processing states then passed exact Save/reload/Export/literal Import. This is not natural campaign acquisition, speaker audibility, complete-game play acceptance, or old-save compatibility proof.

## Usage stop and ownership

Five Luna-low invocations were used, including one continued implementation job and two audit passes; at most two ran concurrently. No heavier agent or paid fallback was used. The shared included-usage meter moved **24% → 29%**. AU7 requires stopping expansion at the default five-point bound; that shared movement is a conservative stop signal, not attribution of all usage to this chat. Full implementation needs another explicitly authorized finite allowance before this task expands further. Human visual/play acceptance is independently open.

Root runtime/style reservations are released at this verified snapshot. All dirty pre-existing and concurrent work is preserved. A separate human-directed firewood-supply lane has been reported by the reference coordinator; recover its current `docs/gm/dispatch/reference-engine-boundaries-2026-10-20/FF3_STATUS.md` and live ownership before touching household model/main/host joins. No completion of that lane is claimed here.

Local review preview: [127.0.0.1:50531](http://127.0.0.1:50531/), serving the frozen candidate on a new unseeded origin, exec session `12536`. It does not preload the browser-test fixture or a personal save. Stop only that server process or its port when no longer needed. Opening the app preview is a delivery request, not proof of user-visible acceptance.
