# Open idle games research checkpoint

Status: **completed research delivery**, 2026-10-09. Role: `/root`, open-source idle games research GM. Checkpoint revision 2. Start with [REPORT.md](REPORT.md).

## Objective and authority

Follow [assignment](../../gm/dispatch/open-idle-games-2026-10-09/ASSIGNMENT.md): canonical original repositories first; shallow clones outside YAIR; inspect core loop, life/reset/carryover, pacing, data/saves and browser UI; record licenses and source locators; deliver >=20 vanilla-mapped touches and 5-10 ranked north-star proposals. Research only. No YAIR source, build, tests, saves, commit or publishing changes. All proposals remain proposals. Accepted vanilla preservation and one-realm/one-prestige milestone govern the comparison.

## Ownership and recovery

Checkout `/Users/weiwei/code/yet-another-idle-rpg`, baseline head `d6b6937c921ab8573480aa798dc0a5a56131db7e`. [INPUT_SNAPSHOT.json](INPUT_SNAPSHOT.json) records dirty input hashes and status. Existing unrelated edits were preserved. No source-input hash drift found during final checks. Coordinator owns final outputs in this directory only. Research workers `/root/progress_knight`, `/root/idle_loops`, `/root/evolve` completed disjoint dossiers; no worker is authorized for further writes. Idle Loops worker explicitly handed ownership back after the locator repair. No pending tool operations or unknown write outcomes.

Seven clean depth-1 clones remain under `~/.codex/research/progress-knight/{original,two,quest}/`, `~/.codex/research/idle-loops/{original,maintained,dmchurch}/`, and `~/.codex/research/evolve/`, about 204 MiB total. [SOURCES.json](SOURCES.json) records full SHA, date, path, remote and license finding. No dependency installs or upstream script execution. Clone directory names do not establish active maintenance.

## Completed evidence and artifacts

| Artifact | Result |
|---|---|
| [REPORT.md](REPORT.md) | Short plain-language synthesis and artifact entrypoint |
| [PROGRESS_KNIGHT.md](PROGRESS_KNIGHT.md) | Original versus 2.0/Quest lineage, six lenses, exact original carryover and bounded Quest reset trace, twenty touches |
| [IDLE_LOOPS.md](IDLE_LOOPS.md) | Original/Omsi/dmchurch lineage, six lenses, loop versus reload reset, exact offline variants, fourteen touches |
| [EVOLVE.md](EVOLVE.md) | Canonical source, six lenses, shared reset wipe/retention exceptions, thirteen surveyed ending routes, exact offline formula, twenty-four touches |
| [LICENSES.md](LICENSES.md) | Every cloned repository's license or explicit absence; original grant not silently extended to fork additions |
| [YAIR_BASELINE.md](YAIR_BASELINE.md) | Live owner comparison; save guard/life record/household/routines already exist |
| [PROPOSALS.md](PROPOSALS.md) | Eight ranked proposals, costs/dependencies and bounded future playable proofs; P1 is one lived native career |
| [SMALL_TOUCHES.md](SMALL_TOUCHES.md) | Thirty curated adaptations from fifty-eight dossier mappings; overlaps disclosed |
| [VALIDATION.json](VALIDATION.json) | Static locator/range, local target, proposal/touch count, clone and source-hash checks; rerunnable via [validate_research.py](validate_research.py) |

Coordinator reviewed the full three dossiers and directly cross-checked high-impact original rebirth, Quest offline death-stop, Idle Loops talent/reload and Evolve shared-reset/offline paths. First artifact-validation pass found an Idle Loops source range ending one line beyond the file, repaired to 132-149 and reread. Its two apparent missing links were references to the validation output before its initial creation. Final validation passed after those repairs: 115 pinned locator occurrences (112 unique), seven clones, thirty curated touches, eight proposals, no missing local targets and no captured input drift. Range validation proves a locator exists, not that every interpretation is correct.

## Findings to preserve

F1: Original Progress Knight selects one job/skill; Quest concurrently trains unlocked tasks and has additional prestige layers. F2: Idle Loops remembers learning/town knowledge but resets supplies/raw stats, and reload discards the current run. F3: Evolve's species/tech/event/queue mechanisms are civilization systems, not individual follower or heir simulation. F4: Banked acceleration and absent-time tick replay are different offline policies; no YAIR policy is selected here. F5: Live `src/save_files.js` already has a 4 MiB origin budget guard; older north-star text asserting no guard is stale. Existing compact biography/household/routine owners are the incumbent.

## Limits and next action

The finite research assignment is complete after final static validation. No browser game was played, no balance timings measured, no accessibility/layout, offline, save/reload/import or third-party dependency/asset inventory was exercised. Boundaries and formulas are source-inspected at pinned heads. Large content catalogues and every trait-specific edge case were not exhaustively audited. Missing fork license grants remain recorded; this assignment only uses mechanical paraphrase.

Next action belongs to Weibao or the integrating GM: review the eight proposals, preferably P1, and select any future playable slice separately. Do not autonomously implement or start another research wave. A later authorized gameplay change needs current-file reconciliation, rebuild/fresh-origin browser proof and save/reload/import for persistence changes. No current playable acceptance gate is claimed passed by this research.
