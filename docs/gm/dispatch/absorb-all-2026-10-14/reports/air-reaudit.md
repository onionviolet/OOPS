# Air re-audit, 2026-10-14

Audit lane `air-reaudit`. Main HEAD inspected: `0216ccdefcfce79877378f8cb0ee41129fe11c5d`, branch `codex/gameplay-foundations`. Main was already dirty with concurrent documentation work and generated artifacts. This lane changes only this report. No snapshot, pack, source, save, branch or remote was changed; no commit was made.

## Verdict

**F1:** The a5 verdict is confirmed for source and recoverable tooling. **F2:** The structured foundation is present, but “nothing missing” is too broad: three real authoring/native-life adapters and their wiring are absent. Their deletion in a later agent snapshot is not a creative-director rejection. **F3:** Keep Pro's manifest and p06 as the baseline; selectively port wider mechanics into a separately versioned candidate. Do not overwrite either with Air bytes.

Authority: [COMMON.md](../COMMON.md), [PROJECT.md](../../../../../PROJECT.md), [USER_VISION.md](../../../../USER_VISION.md), [ability authoring](../../../../worlds/ABILITY_AUTHORING.md), and [identity/control](../../../../worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md). The October 14 instruction explicitly reopens rejected/parked items as reversible proposals. “Everything possible, reasonably,” world-specific mechanisms, independent character options and idle progression support the ports below. The October 10 solo-player correction rejects arbitrary fixed once limits; legitimate settlement idempotency remains necessary. A snapshot's later timestamp cannot override these directions.

Target for proposed UI work: **1366×768 desktop/laptop**. Visible outcome: discovery reveals actual executable source-qualified actions, a coherent outing with return/treatment, and an optional ended-life recovery screen. Mobile optimization, extra realms/prestige layers and a universal death/reincarnation ontology remain deferred. These are recommendations, not implemented or human-accepted behavior.

Snapshot root, read-only throughout:
`/Users/weiwei/MacTransferArchive/yair-private-work-20261013-extract/.codex/worktrees/<name>/yet-another-idle-rpg/`.

## Per-item decisions

| ID | Source item | Decision | Reason / next packet |
| --- | --- | --- | --- |
| D1 | wider `src/structured_ability_runtime.js`, four tests and compiler wiring | **port** | Real source/control/target/counter/carrier gates on shared paid commands. Fits current ability owner; adapt rather than copy old shared files. P1. |
| D2 | wider `src/structured_expedition_runtime.js`, eight tests, compiler/view wiring | **port** | Discovery-qualified prepare/enter/approach/return/treatment loop using existing owners. Keep the loop, remove universal once-only extraction and mandatory lethal-route requirements. P2. |
| D3 | wider `src/structured_life_runtime.js`, five tests and `main.js` wiring | **port** | Bound local death must reach actual health/time/action owners; independent next-life/archive is useful as an option. Do not restore deletion-based reset as the sole continuation policy. P3. |
| D4 | a5 production `src/**`, `tests/**` | **leave** | Every snapshot source/test file is byte-identical to git base `53dc1df158`; no source delta exists to absorb. |
| D5 | a5 diagnostic HTML, bundle and map | **leave** | Disposable inspection wrapper and generated artifacts, not production gameplay. Do not replace newer source/bundle with these. |
| D6 | six a5 private probes and scalar pack | **leave** | All six probes and `a-soldiers-life/pack.json` match current bytes. Already recoverable. Manifest separately assessed below. |
| D7 | retained structured foundation in starts/wider/world1 | **leave** | Current origin/container/pack/save/UI foundation and subsequent protections are present. No missing file in the final snapshot's source/test set. Preserve current extensions. |
| D8 | all Air `private_packs/manifest.json` variants | **leave** | Pro's eight entries contain every Air entry; all eight target files exist. Air offers no additional path. Preserve Pro order. |
| D9 | starts-talents-continuity `p06/pack.json` as replacement | **leave** | Earlier two-start, 15-command fixture would discard current content. Its container/transfer/vital/knowledge/event primitives already have shared owners; unique IDs alone do not establish missing engine behavior. Retain read-only history, not replacement bytes. |
| D10 | wider-gameplay `p06/pack.json` unique mechanics | **port** | Four ability records, one expedition and additional source/action dependencies are missing from current pack. Integrate a dependency-closed candidate after P1–P3, retaining Pro's current content and exact old-save binding. P4. |
| D11 | world1-completion `p06/pack.json`, final retained fixture | **leave** | Byte-identical to Pro's current p06. Already present. |

No whole-file restore is recommended. All useful missing behavior requires adaptation to current owners.

## What the three wider runtimes actually did

### D1: ability authoring adapter

`compileStructuredAbilities` cloned commands/powers, validated local unique ability IDs and exclusive local command bindings, and required a declared actual source. It classified physical/craft/storage/perception/support functions, acquisition (innate/learned/borrowed/acquired) and execution kind. Classification alone granted nothing. At execution it required the active source or a distinct active compatible carrier, explicit control, optional target support and absence of authored counters. A declared learned power had to match the actual native power binding. The command needed concrete supported effects and disclosed native costs; targeted effects required an actual target declaration. Timed execution rechecked support at completion and refunded reservations on lost support.

This is an authoring compiler, not another power inventory, combat engine or progression loop. Current source/faculty/power/command owners can express much of the raw machinery, but the structured metadata-to-gates compiler is absent. Source inspection found no current equivalent that consumes `abilities[]`. It fits the ability owner's distinctions between observing, understanding, holding and executing. Do not promote this short whitelist to a universal limit on conceptual powers or arbitrary per-method equality. Extend only for the concrete slice.

### D2: expedition adapter

Compiled held discovery knowledge into command eligibility **and** visibility, with completion rechecks on refundable timed jobs. Validated independent actor phase/injury keys and local command bindings for `idle → prepared → inside → resolved → returned`, with `ended` as a lethal branch. Required at least two authored approaches, retreat without settlement reward, extraction, treatment that actually heals and clears injury, and phase guards/effects. Observer preview used shared command quotes and hid undiscovered sites. No separate timer, RNG, inventory or reward system was introduced.

The old validator also required every expedition to have a clearly labelled lethal choice, fixed approaches without encounters/random outcomes, and `extract.once === true` plus a reward claim. Those are bounded fixture assumptions, not accepted laws for all outings. Port discovery/phase/physical-consequence integration, make lethal routes optional and allow repeatable paid attempts with claims scoped to the real attempt/object. A single attempt must never settle twice; that does not forbid another attempt. Keep existing expedition/planner/encounter owners rather than introduce a rival system. Saved jobs can progress through the existing idle clock, not a click-only completion gate.

### D3: local life and archives

Detected death only for a structured receipt bound to the player's current world and actual simulation person. Reconciliation demanded a saved cause and valid real vitals, staged zero health and recovery deficits. `main.js` added this condition to `nativeLifeEnded`, reconciled native plans/death statistics, rendered generic death text and export/archive actions, and enumerated ended-life archives. Thus it was more than a UI label. Ordinary native defeat/incapacitation was left distinct from true death.

The archive helper parsed and optionally validated the envelope, refused a conflicting archive for the same instance (ignoring `saved_at`), wrote a separate archive, set `skip_live_import`, then removed the active save. On failure it attempted to restore active bytes/import policy; enumeration skipped malformed archives. This implementation is tied to old storage and reset semantics. Its rollback can itself throw when storage writes fail, and “write archive then remove live save” is not a general atomic transaction guarantee.

Keep optional local death and recoverable independent-run choice. Do not impose “no memories/powers/continuity” on every world; independent lives, persistent-world continuation, reincarnation and other continuity rules have distinct owners. Use current writer-lock/save publication and profile/session owners. A dead character must not be revived by native unconsciousness recovery. Archive/export and next-character choice should preserve the old active bytes until a complete supported transition commits. No hunger death or offline loss is implied.

## Verification of previous verdicts

### a5-native-audit

Read the prior report and inventory; compared every file under snapshot `src/` and `tests/` with `git show 53dc1df158:<path>`: **zero differences**, zero missing current paths. The 57 differences against current source are later current development, not hidden a5 changes. All six `{probe,reinstall,absent-probe,harness,followup,legacy-completed}.cjs` files match current SHA-equivalent bytes; the scalar private pack also matches bytes. The manifest does differ, so the old “present by path” statement was insufficient for that file, but Pro is a strict superset. Diagnostic harness inspection confirms it uses an inspection hook and disposable wrapper.

Conclusion: production source has nothing to restore. Existing probes remain historical evidence/tooling; they do not prove current rebuilt native behavior. The prior interrupted full suite must not be recast as passing.

### structured-packs

All 28 final-snapshot source/test paths changed relative to the old base exist currently. Read the wider three runtime files and tests, final removal/wiring differences and current compiler/runtime/state/container owners. Current retains equipment/shelter validation, deferred identified objects/title recipients, supported refundable timed travel, target/body bindings, location filtering and richer receipts/UI. For example, the final Air compiler disallowed timed player relocation altogether; current admits it with completion support/refunds. Current container handling supports deferred acquisition and its exposure clock, which final Air lacks. Pasting final Air source would lose those improvements.

The narrower **foundation present** verdict holds. “No implementation or playable acceptance gate remains” does not hold for wider-only mechanics, and the prior report's sentence treating withdrawal as creative intent is unsupported. The October 14 instruction now authorizes their re-evaluation and proposal ports.

Additional observed gap: current `compileStructuredPack` accepts the wider p06, yet imports neither missing compiler and returns unaugmented commands. Top-level `abilities`/`expeditions` metadata is not rejected. A standalone compile pass therefore cannot validate held-source/counter gates or expedition discovery contracts. P1/P2 must consume these fields or reject unsupported declarations before registration, and test registered commands rather than metadata alone.

## Private JSON diff and winner

No private prose, hidden outcome truth, start body values or command descriptions are reproduced here. IDs/counts/field paths are audit locators only.

### D8: manifest

| Version | Entry count | SHA-256 |
| --- | ---: | --- |
| a5 | 1 | `2279d27bcda5a216504a7eb085653075ffde589d8df04c49a419638d07164a68` |
| starts-talents-continuity | 6 | `40a8523af3a46aabd4c6efc99a0b4fcd804a82dc77aaa6f4050be9b23ddd710f` |
| wider-gameplay | 5 | `d6abf9a5144496bffb97182696146ab2ca97e2933fce80b00ca0ed537f81f555` |
| world1-completion | 7 | `8cac262fe69e0f8609c88cc82a966d8880d56e3daa99901c3c7a54b00210e9e2` |
| current Pro | 8 | `cb74be41d7acc7e929fa6a8a4f652f64ed25cc758ab1e60d3536ee400032eb73` |

All use schema 1. Pro order is `p08, p07, p06, p05, p04, a-soldiers-life, p03, p02` with `/pack.json` suffixes. Final Air lacks only p08. Wider additionally lacks p07/p05; starts lacks p07/p08. **Pro wins unchanged**. No union adds an Air-only entry; do not remove newer paths or infer content equivalence from manifest presence.

### D9/D10: two differing p06 copies

| Structural comparison to current Pro | starts-talents-continuity | wider-gameplay |
| --- | ---: | ---: |
| Bytes | 61,832 | 324,379 |
| SHA-256 | `9fcbc51d282c3ae944a343a01c3d2754ed61111858de969c76073c8be342ed31` | `2ed6552885effa018d9bd2c4ff3aadca99779155862642ae02069fc3d5e2eb86` |
| Commands (Air / Pro) | 15 / 94 | 80 / 94 |
| Commands only Air / only Pro / changed shared | 7 / 86 / 7 | 26 / 40 / 26 |
| Items (Air / Pro); only Air / only Pro | 9 / 23; 1 / 15 | 20 / 23; 5 / 8 |
| Locations (Air / Pro); only Air / only Pro | 2 / 5; 0 / 3 | 4 / 5; 1 / 2 |
| Starts (Air / Pro) | 2 / 3; no shared IDs | 2 / 3; both shared entries changed |
| Units (Air / Pro) | 1 / 7; shared unit changed | 6 / 7; 1 only Air, 2 only Pro, shared unchanged |
| Sources (Air / Pro) | 1 / 1 | 4 / 1; 3 only Air |

Current Pro is **419,005 bytes**, SHA-256 `89adcf18685ff564de985a2bb774d21a759f24cce3c2318e6b3fe15d1cb80f52`, exactly matching world1-completion. Both older Air copies retain the same schema and revision as Pro despite different content. Reusing that identity would still change content hash and fail saved beginning bindings.

Starts copy: lacks renewal; has two simulation events absent in Pro, fewer people/conditions/status rows, different start IDs, container objects and a shared unit. Its seven unique commands use container, knowledge, transfer and vital effects, all existing shared primitives. Leave the old fixture as a historical option specification, not a replacement or evidence of new missing runtime. Do not map its old starts to current IDs by guesswork.

Wider copy: adds `abilities[4]`, `expeditions[1]`, three sources, one location and dependency rows; lacks two current people/presentations, one condition and four status rows. Its 26 extra commands include six timed commands and seven once-tagged commands, with actual fact/knowledge/custody/transfer/source/relocation/vital/container/item/resource/life/XP effects. Of 26 changed shared commands, 25 differ in requirements, 14 in completion requirements, two in effects and 25 in description. Both shared starts differ in initialization effects; the container object set also differs. This is **not** a safe ID union or “append 26 commands” operation.

**Merge recommendation:** Pro wins all baseline/shared rows. Port wider's useful mechanics as P4, explicitly tracing each command's source, target, location, inventory key, title/claim, condition, phase/injury/knowledge fact and start-initialization dependencies. Preserve current jobs/equipment/custody/renewal/actions. Give the candidate a separate identity or explicit new revision/version-routing policy; keep old exact content available for old receipts. Do not import old starts wholesale, overwrite same-ID commands, or change live private packs during this audit.

## Ready-to-run implementation prompts

All packets below: follow `COMMON.md`; obtain a coordinator-assigned isolated worktree/branch and port before writes. One writer owns shared compiler/runtime/UI/main/save paths at a time. Read current owners and dirty state first. Adapt source, preserve MIT attribution and cite the Air snapshot path. New behavior is a reversible proposal. Write that lane's report, commit only its task paths on its branch, no push/merge/personal saves. Do not commit private pack prose or ignored research. Required delivery: build, focused tests, full `npm test` with exact results, rebuilt fresh-origin **1366×768** browser positive/negative execution, save/reload/export/literal-file import where persistence changes. Report tested bundle hash and unexercised gates separately; human play/taste remains open. Assigned worktree/port are operational coordinator inputs, not permission to write main.

### P1: port source-qualified structured ability compilation (D1)

> Implement the missing structured ability authoring adapter from read-only `wider-gameplay/src/structured_ability_runtime.js` and its four tests, adapting to current `structured_pack_definitions.js`, source/faculty facts and shared simulation command transaction. Integrate compilation before registry validation/registration; reject malformed/unsupported ability declarations instead of silently ignoring them. Bind actual held source or distinct compatible carrier, learned power, control, target and counters; validate concrete effects/costs; recheck timed completion support and refund on loss. No new inventory, timer or blanket power taxonomy. Use one original public fixture with two differently supported methods and a real paid useful native action. Test direct registry-command bypass, unsupported metadata, carrier mismatch, wrong target/world, suppression and failed durable write. Preserve all current equipment/custody/container/origin checks. Old packs without metadata compile unchanged; preserve old save receipts/content hashes, and use a separate optional candidate identity for new content. Show paid functional change and refusal without spend in the rebuilt browser, including persistence. Report and commit the bounded port.

### P2: port discoverable repeatable structured outings (D2)

> After P1's compiler ownership releases, adapt read-only wider `structured_expedition_runtime.js` and its eight tests into current expedition/simulation/structured owners. Compile actual held-discovery eligibility and visibility before registration and project only known sites/current quotes. Implement one original local prepare/enter/two-approach/retreat-or-extract/return/treatment loop on shared saved jobs and actual health/inventory. Preserve phases and injury prerequisites, allow another paid attempt after return/treatment, scope reward claims to a genuine attempt, and prove retry cannot duplicate one settlement. Remove mandatory lethal command and universal `once` extraction validation; lethal routes are optional and can be omitted from this first slice. Do not prohibit existing encounters/RNG globally or force an active click to complete elapsed jobs. Preserve current location/custody/equipment/refund guards. Test direct-command discovery bypass, phase skips, source loss, refund, retreat without payout and two completed attempts. New state is optional and absent from old saves. Provide a rebuilt desktop play loop, exact pending/final persistence and failed-write preservation, then report/commit. P3 is needed only before exposing lethal content.

### P3: port scoped true-death recovery with optional independent next life (D3)

> Read current chronicle/native life, save writer-lock/profile/import, structured receipt and identity/continuation owners. Adapt wider `structured_life_runtime.js`, its five tests and relevant `main.js` integration to bind a selected local true-death route to saved cause, real zero health, halted actions/time and one death-stat publication. Ordinary unconsciousness and default-off hunger remain unchanged. Reuse the current life-end UI where possible; show generic observer text without leaking sealed cause truth. Add archive/export plus an explicit independent-new-character choice, preserving old full bytes until archive and supported destination/profile publication succeed. Do not implement raw active-save removal or hard reset as the only path. Reuse existing continuation choices and do not universally erase retained memories/powers or dictate former-body world behavior. Scope lifetime/archive identity to the current instance; reject a conflicting archive, wrong instance and unsupported schema. Test storage quota/partial publication/rollback failure, occupied save and double action; prove no revival or elapsed-time drift after reload. Use synthetic saves only. Old live/absent structured states load unchanged, with an explicit archive compatibility policy. Rebuild and demonstrate lethal transition, export/reimport the ended life and the independent new life while preserving archive bytes. Report/commit; do not claim director acceptance.

### P4: selectively integrate wider p06 mechanics into a versioned candidate (D10)

> After P1/P2 and, if lethal content is included, P3, read all three archived p06 versions privately and current Pro p06. Keep current manifest and p06 untouched. In your assigned worktree create a separate git-ignored candidate under its private pack area, with explicit identity/revision and compatibility, using Pro as baseline. Port wider's four ability bindings and one outing plus their minimal dependency closure; retain all Pro-only rows and current shared command/start/container semantics. For changed shared IDs, add explicit proposed variants or recompute their support through current owners, never overwrite by timestamp. Reconcile initial facts/sources/body/energy/title/unit dependencies against each supported start. Treat old seven once-tags individually: retain idempotent acquisition/settlement, remove arbitrary global replay limits. Leave early fixture's event/transfer/start alternatives in read-only history unless a concrete distinct playable mechanic is selected; do not invent migrations for their unrelated start IDs. Build an original non-secret committed test fixture/authoring tool if needed, keeping private prose out of git and reports. Verify compiled registered commands actually contain metadata gates. Demonstrate useful changed actions, ordinary alternative, paid repeat outing, withdrawal/treatment and optional death only after its adapter lands, with old exact-receipt saves unchanged and candidate pending/final literal import. Report ID/route/status only for sealed outcomes, include candidate hashes and compatibility choice, and commit only permitted source/tests/docs/tooling. Installing the candidate over live private content is a separate integration decision, not part of the audit.

## Checks, limits and handoff risks

**A1, completed:** read original `SUMMARY.md`, `INVENTORY.txt`, a5/structured reports, live owners and `runs/SESSIONS.md`; read wider runtime/test/wiring and current/final corresponding source. Compared a5 and final source/test trees against base; diffed pack JSON structurally by keyed ID, metadata and byte hashes; checked manifest targets and probe/pack bytes. Four standalone p06 compiles passed (starts, wider, final, current), with the silent-metadata limitation described above.

**A2, completed:** `node --test tests/content_pack_provenance.test.js tests/native_gameplay_binding.test.js tests/structured_pack_definitions.test.js tests/structured_pack_runtime.test.js tests/structured_pack_ui.test.js tests/structured_origins.test.js tests/structured_container_runtime.test.js tests/structured_renewal.test.js`: **64 tests, 64 pass, 0 fail, 0 skipped**, duration 1364.374833 ms. These prove only the current focused SOURCE slice, not absent wider behavior.

No build, full suite, browser or save mutation ran in this audit. Those would not prove unimplemented ports; build also writes artifacts outside this lane's scope. Every P1–P4 behavior is **proposed, not implemented**, so native/persistence/human acceptance remains open. No implementation-unverified change was introduced by this report.

**R1:** P1–P4 touch the same compiler/runtime/main/save/UI areas; serialize ownership or assign them as one bounded follow-up chain. **R2:** `air-workshop` touches shared native/simulation publication; P3 must preserve its integration. **R3:** `p23-life-loops` touches bodily needs/clock behavior, `p23-reveal-chain` and `p23-ui-polish` affect visibility/panels, and upstream/fork lanes may change shared code. Rebase against integrated source and validate affected slices rather than paste archive files. `fork-fort` has location/equipment consumers that current validation must retain. These are source integration risks, not reasons to abandon the ports.

Next authoritative technical gate: deliver each assigned port's rebuilt native changed-positive and exact persistence evidence under COMMON. Final acceptance gate: Weibao's play/taste. Historical audit completion does not close either.
