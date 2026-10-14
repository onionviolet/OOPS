# T2 chain inspector

## Stage 1: live audit, before code

F1: Clean branch proc/cb-t2-inspector starts at 4f853c24, the merged HV1 source. PC1-P2/P16 and PC4-H1 through H5 still describe the live shapes. HV2 M1 is a semantic role mapping, not a new schema. Its MODEL is absent in this base worktree; read the explicitly requested main-checkout document without writing there.

F2: HV1 retains schema/revision 1, FIFO specimen arrays, one job, and the latest receipt only. Species priority is the HARVEST_SPECIES list, with no rotation. Ordinary automatic jobs advance alongside combat but pause for activity, action, dialogue, sleep, reading, trade and native occupation. An explicit job owns the player. One advance settles at most one job, then admits another without applying surplus time. The per-species cap of 24 includes the active specimen. Incoming overflow auto-processes whole immediately when enabled, otherwise increments left. Taking one part discards the rest. Grade uses settlement clock, skill and tool; inventory keys retain quality/completeness but no per-copy provenance or freshness history.

F3: P2 retains ingredient profiles, product truth, independent observed knowledge, learned methods and one repeat job with held inputs. Mixing is immediate; repeat reserves one batch, takes three played minutes, then attempts the next admission from current stock. Product keys are recipe/composition identities, not physical vial lineage. Feature objects already use native keyed stock plus simulation jobs/sites/custody/knowledge. Cut produces wet staves, drying produces sound staves, matching produces a fitting insert, and kits consume sound staves plus sap. Matching is a branch, not a prerequisite for kits.

D1: Reuse the existing Developer harvest inputs disclosure (src/harvest_ui.js), rename it Developer chain inspector and retain its existing explicit developer gate: exact dev-release URL or ?harvest-inspector=1. The query flag is an explicit debug opt-in, never an in-fiction lens. Move the disclosure next to the harvest panel so it can show mixtures before the first kill and while the harvest owner is absent. No new screen or saved preference. Developer labels warn that retained truth is visible. Every non-developer projection returns no rows, IDs, counts or traces.

D2: Target desktop 1366x768 and 1600x1000 with wrapping role rows and one bounded scrolling disclosure. No mutation controls inside it. Read only existing owners and receipt fields; never enroll, initialize absent domains, resolve mixtures, sample randomness or recompute a rule. T3 gets an optional resolver-produced trace input, absent until supplied. No save changes or migration: absent owners stay absent and existing saves keep exactly their current contract.

## Verification

Final result: seven focused SOURCE tests pass; npm test passes 1398 tests with zero failures and three existing TODOs; node build.js passes. Rebuilt desktop proofs pass for natural and seeded-native fixtures. Details and reproducible proof script below.

## Stage 2: pure readers

F4: Added src/chain_inspector.js. Source rows read retained lots/profiles/native stock and custody; part-template rows read authored part/command definitions; operation rows read current jobs/methods and current scheduler eligibility; output-batch rows distinguish current keyed stock from latest receipt output; observation rows read existing harvest/knowledge receipts. No physical lineage is invented. Why text identifies existing policy or quotes caused knowledge. Feature templates are definitions, not recomputed eligibility or rule traces.

F5: Six focused SOURCE tests pass: deterministic frozen inputs, byte equality, identical harvest/mixture quotes, identical next loot/craft/gather draws and stream receipts, absent-owner non-initialization, fail-closed non-developer access, and verbatim supplied-trace display. The public view entry is projectChains(frame, {developer:true}); only that explicit boolean enables truth. Domain readers are internal developer adapters, not in-fiction views. T3 supplies ruleTrace as a transient frame property; absent traces stay absent and no resolver is imported.

## Stage 3: native surface

F6: Existing harvest disclosure now hosts all three chain readers even before a harvest owner exists. Explicit dev-release or ?harvest-inspector=1 remains required. It reads live owners only while open. The expanded disclosure uses 92% desktop width, wrapping columns and a bounded scroll region, with only disclosure controls. It creates no save preference. Extracted the existing automatic-readiness expression into harvestAutomaticReady so scheduler and inspector share that exact predicate; no eligibility policy change. All domain adapters are private behind the fail-closed projection entry.

V1, stage-3 record: six focused tests and node build.js passed before browser proof. The repository tracks its bundle/map and fingerprinted index, so those accompanied the native-stage commit. Stage 4 below supersedes the then-pending verification gates.

## Stage 4: rebuilt proof

A1, reach it: append `?harvest-inspector=1` to the game URL, then open **Developer chain inspector · retained truth · read only** in Local actions. It is the existing developer harvest disclosure, now independent of carcass ownership. Its expanded view uses the desktop screen; the summary closes it and the contents scroll. Individual chain headings collapse. Ordinary URLs have no inspector DOM and no projected truth. No game-action button, input, select or textarea exists inside it.

### M1 mapping in plain English

| Role | HV1 harvest | P2 Village mixing | Feature objects |
|---|---|---|---|
| Source | Actual waiting count and FIFO head, held specimen, or explicitly consumed latest specimen | Owned ingredient packs and retained profiles | Carried material/tool counts and actual loan custody |
| Part template | Species-supported parts and base counts/minutes | Whole-pack mass basis, steep/boil and the existing oral consumer | Actual cut/dry/match/kit command inputs, outputs and durations, including tool transformations |
| Operation | Current job and shared host occupation gate; fixed priority and immediate overflow policy | Learned methods, held inputs, due time and repeats still including the held batch | Actual simulation job/reservation; templates remain definitions rather than new eligibility calculations |
| Output batch | Current graded key/count separately from latest receipt outputs | Saved product and current vial count, with no invented physical vial identity | Native wet/sound/matched/kit counts, with no invented per-copy history |
| Observation | Latest-only saved damage/handling/output receipt | Retained oral observation and its timestamp/source | Existing caused knowledge and attributed basis; Why quotes the retained account |

F7: Final presentation refinements replace escaped template effect dumps with input/output labels, show live feature records before static templates, and keep empty/consumed harvest roles meaningful. Full lots display counts and their actionable FIFO head rather than dumping 24 full specimens. No grade/resolver recomputation is called, including through the mixture key validator. Product inventory lookup uses only the retained product ID and canonical key layout. Seventh focused check covers completed harvest with no live stock.

V2, NATURAL: Fresh Chrome origin on port 22450, profile `/private/tmp/cb-t2-profile-*`, hero **TEST FIXTURE CB T2 NATURAL**. Talked to the elder, earned/equipped the offered sword and starting pants, entered Infested field, fought a Wolf rat and earned one carcass. Native whole processing spent four played minutes and awarded graded pelt/tail/fangs. Bought water and bellleaf at Village, brewed, drank an experimental dose, saved the observed method and queued repeats. No carcass, mixture, knowledge or skill was injected for this route. [Route record](evidence/natural-route.json). Regular HackTimer worker callbacks drove play; attempted Playwright clock fast-forward did not control that worker and is not claimed as game advancement.

V3, SEEDED-NATIVE: Craftsman access remained locked after the first kill, so the feature fixture explicitly supplied that contact prerequisite, 100 coins, full native vitals, 3 logs and 5 sap. No tool, wet/sound/matched stave, kit, learned matching or feature enrollment was seeded. Literal native Import loaded the fixture. Native buttons met Eda, bought a knife, cut a log, dried both staves, inspected the joint, observed Eda, paid for matching instruction, restored/refitted the owned knife, bought Eda's extra sound stave, matched it, restored the fine knife and made two survey kits. Native timers settled each job. Final receipts prove cut 1, dry 2, match 1, kit 1; actual stock contains one matched stave and two kits. [Route record](evidence/feature-route.json). This proves the downstream inspector over native paid work, not natural acquisition of those prerequisites.

V4, SEEDED-NATIVE auto controls: Fixture held 24 Wolf rat carcasses, two Starving wolf rat carcasses, auto enabled, and a native Wolf rat encounter near defeat. Ordinary callbacks selected Starving wolf rat first despite Wolf rat being first in the lot object, advanced its job during combat, and settled the incoming Wolf rat overflow immediately while that timed job still had three minutes remaining. The full Wolf rat lot stayed at 24 and processed advanced 1 → 2. Starting a native Village run and reloading retained an automatic job at four minutes; it remained at four over a 3.1-second observation while normal game time advanced, with the inspector showing paused. [Machine record](evidence/auto-proof.json), [combat 1366](evidence/auto-combat-1366.png), [combat 1600](evidence/auto-combat-1600.png), [excluded occupation 1366](evidence/auto-paused-1366.png), [excluded occupation 1600](evidence/auto-paused-1600.png).

V5, NATIVE persistence/read-only proof: [browser-proof.cjs](browser-proof.cjs) imports each earned literal fixture into another fresh profile, verifies exact imported bytes, then uses the real Save and Export controls. It fixes wall-clock date and stops only the external HackTimer worker after panels mount, so an ordinary game tick cannot contaminate the open/close comparison. It does not patch game state or the inspector. Full saves are byte-identical before, during and after inspection at both viewports; Export decodes to those exact bytes. Reload retains exact harvest, mixture, inventory, simulation and stream owners. The next craft-stream draw on cloned snapshots matches before/after and after reload. Source tests also consume actual next loot/craft/gather draws on control/test copies, with identical cursors/logs.

The host normally rebuilds native character/level/quest/option snapshots on load, so a later normalized full save is not claimed byte-identical to the pre-load envelope. The byte comparison is before/after opening within each loaded state; literal-file Import itself writes exact exported bytes. Natural fixture: 70,516-byte literal, 80,837-byte normalized save. Feature fixture: 95,184-byte literal, 95,219-byte normalized save. Those are existing host normalization differences, with exact chain/stock/stream equality and no inspector fields. No schema, migration or save domain was added.

Both final proofs fetched and hashed the served rebuilt bundle against the worktree: SHA-256 `b53222f574dfdd3bed4c1d5e3b72c4397c8a4da595724188d10ce2911f7d4b26`. Zero page errors, zero mutation controls; expanded bounds fit both viewports. The default URL was then loaded and contained no inspector. [Natural proof](evidence/natural-final/proof.json), [feature proof](evidence/feature-final/proof.json).

### Screenshots

These are developer-only truth views. Do not reuse their contents as player knowledge or a sealed-world report.

| Evidence | 1366x768 | 1600x1000 |
|---|---|---|
| Final rebuilt inspector over naturally earned harvest and mixture | [Laptop](evidence/natural-final/final-1366.png) | [Desktop](evidence/natural-final/final-1600.png) |
| Final rebuilt inspector after seeded-native cut/dry/match/kit work | [Laptop](evidence/feature-final/final-1366.png) | [Desktop](evidence/feature-final/final-1600.png) |
| Natural intermediate capture, before final formatting refinement | [Carcass](evidence/carcass-1366.png), [processing](evidence/processing-1366.png), [mixing](evidence/mixture-1366.png) | [Mixing](evidence/mixture-1600.png) |
| Seeded-native intermediate feature capture | [Cut reservation](evidence/feature-cut-pending-1366.png) | [Cut reservation](evidence/feature-cut-pending-1600.png), [dry](evidence/feature-dry-1600.png), [match](evidence/feature-match-1600.png) |

V6, SOURCE/BUILD: Seven focused tests pass. Final full suite: 1401 total, 1398 pass, zero fail, three pre-existing RNG-inventory TODOs. `node build.js` passes, including Ink compiler artifact check. Source/tests/docs/index whitespace check passes. Generated minified bundle inherits esbuild's embedded translation whitespace; it is left compiler-authored rather than hand-edited. Visual QA inspected final 1366 and 1600 renders; text wraps, disclosure stays inside the viewport, and the scroll is intentional.

### T3 join and shared files

D3: T3 may supply `ruleTrace` on the transient frame passed by main's `readInspector`. `projectChains` clones/displays a supplied resolver trace verbatim under Observation, and otherwise says none supplied. Keep law effects in the resolver. Do not regenerate a trace from product truth, initialize a missing owner, or create a trace save domain from this inspector. No T3 law is implemented or leaked here.

Changed source: new `src/chain_inspector.js` and `src/chain_inspector_ui.js`; existing `src/harvest_ui.js` and one host join/readiness extraction in `src/main.js`. Added `tests/chain_inspector.test.js`. Tracked build outputs: `dist/bundle.js`, its map and `index.html`. No harvest, mixture, feature reducer, persistence validator or schema changed. Main checkout untouched; branch remains proc/cb-t2-inspector. No merge or push.

Summary: T2 is implemented and verified at both desktop sizes, with natural harvest/mixing and explicitly seeded-native feature/auto coverage. Remaining scope and proof limits are in [BACKLOG](BACKLOG.md).
