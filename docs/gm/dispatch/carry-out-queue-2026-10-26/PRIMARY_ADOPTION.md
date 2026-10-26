# Carry-out tooling adoption into primary, 2026-10-26

Owner: this Codex integration chat. User request: “put into primary checkout,
consider the stuff I was talking and if that even considered or addressed?
like general rules and more?”

Scope: adopt Q1/Q2/Q3/Q6/Q7/Q8 tooling into the dirty primary checkout,
repair demonstrated integration defects, and reconcile the broader request
against current rule/coordinator/queue owners. Existing game/UI work and other
lanes retain ownership. No push, app replacement, or new worker wave selected.
Rules: AD32, AD36, AD41–AD43; AR13; WPR18–WPR23, WPR27.

Baseline: primary `master` at `b520daeef`. G1 ledger releases the tooling wave;
exact recorded worker/coordinator PIDs were absent at recovery. Original
worktrees and branches retained. Copied source paths and hashes are recorded
in [input manifest](primary-adoption-inputs.json). Primary's pre-existing
dirty runtime, generated bundle, index page, launcher and research work are
preserved. Adoption here means local working-tree code, not branch ancestry.

PRF request/fit: make the existing rule/tooling work usable in primary and
check the whole request, rather than equating dispatch with adoption.
Visible result: usable npm commands, isolated build pages, explicit coverage
and a request-to-outcome map. Game state/persistence unchanged; existing
source, test and tooling owners reused. PRF/FND remain proposals; their
implementation examples do not promote them into binding policy.

Status: adopted and agent-verified in the primary working tree, not committed,
not human-reviewed. Branch ancestry remains unchanged. The new commands are
usable in primary; the original lane branches/worktrees remain recovery sources.

## What changed

- Q1: isolated BUILD_OUT page/bundle/map/notices, live static-asset links and
  concurrent-output proof. Repaired missing asset paths found by the browser.
- Q2: receipt lint is in `check:rules`; a fixed inventory of 317 pre-adoption
  paths replaces date inference. New nested/same-day receipts are validated;
  explicit files bypass exemptions. This receipt's companion exercises the
  adopted validator on an actual new nested path.
- Q3/Q6/Q7/Q8: adopted doc-slip diagnostic, description inventory, cached static
  generator census and cycle-group report with their focused regressions.
- General coverage: round 7 maps the broader request; corrected proposed-policy
  wording and blank-field stop gate, added world-GM routing, reconciled PROJECT,
  USER_VISION and queue states. The static reports remain diagnostics rather
  than claims of complete design or behavioral conformance.

## Verification

| Command / inspection | Result | Scope and gap |
| --- | --- | --- |
| `npm run build` | PASS | Default build, bundle SHA-256 `31ec61169638fb11be00716fe742de4279d13211d2ab9780b9cac68b0f81ee96`; same runtime bundle as browser proof. |
| Focused six tooling test files | PASS, 8 tests | Malformed receipt, selection coverage, description omissions, doc-slip positive/negative cases, detector fixture, cycle partition and concurrent builds. |
| `npm test` | PASS, 3,226 tests, zero failures | [Summary](evidence/primary-adoption/tests-summary.txt). Final assets-list repair to BUILD_OUT was made during this run, then explicitly rechecked below; do not treat the suite as a byte-identical final tooling-input run. Runtime inputs did not change. |
| `node --test tests/build_output.test.js` | PASS after final BUILD_OUT change | [Receipt](evidence/primary-adoption/build-final-test.txt); concurrent builds preserve pre-existing dirty output bytes. No equivalent full-suite rerun needed for this isolated change. |
| `node scripts/playtest/lane-build-output.mjs` | PASS | [Result](evidence/primary-adoption/result.json); two concurrent output roots, independent HTTP origins, fresh contexts at 1920×1080, normal PLAY, matching served bundle hashes, zero page/HTTP errors, watched primary outputs unchanged. Launch proof, no new gameplay or persistence claim. |
| `npm run check:arch` | PASS | Existing baseline retains 205 cycle edges; no runtime owner changed by this adoption. |
| `npm run check:rules` | PASS | [Receipt](evidence/primary-adoption/rules.txt); one new nested receipt checked, 317 named legacy paths skipped. Two existing untracked-link warnings. |
| `npm run check:descriptions` | Report generated | 1,397 descriptions, one mechanical flag, 1,959 missing fields explicitly unassessed. Not a count of proven prose defects. |
| `npm run check:generators` | Report generated | Eight detected kit primitives; static reader/test/budget signals with limited detector scope. Importing the detector does not run the full census. |
| `npm run report:cycles` | Report generated | All 205 baseline edges grouped once. No cycles removed or actual extraction owner assigned. |
| `npm run check:docs` | Diagnostic matches, exit 1 | Optional heuristic matched ordinary procedural/report prose across shared dirty/untracked documents. [Output](evidence/primary-adoption/doc-lint.txt). Not a clean result, not a new universal gate, and not proof that those lines violate accepted direction. |
| Owned-path `git diff --check`, new tooling whitespace, adoption relative-link checks | PASS for added/changed lines and link targets | `build.js` retains a pre-existing whitespace-only line. No generated bundle whitespace was hand-edited. |

Screenshots [lane 1](evidence/primary-adoption/lane-1.png) and
[lane 2](evidence/primary-adoption/lane-2.png) capture the rebuilt initial
desktop screen; lane 1 was visually inspected. No player profile, saves or
normal app were opened. Mobile remains deferred. The proof script stops its
servers/browser and removes its temporary output roots in `finally`.

Shared-document loss check: USER_VISION has zero nonempty HEAD lines absent.
PROJECT has six absent HEAD lines from the pre-existing replacement of the
October 25 descriptions summary, already present in the opening read of this
task. This task adds the primary-adoption paragraph and preserves that live
replacement; it does not restore the superseded summary or claim a globally
zero-loss HEAD comparison on an already dirty document.

## Remaining scope

AD43 remains the accepted floor. PRF/FND remain proposals. Repeated acceptance
questions are unnecessary for using the underlying existing rules or these
authorized tools. No claim that every idea is scheduled/fulfilled: Q18's nested
inventory exclusions, Q11's genuine-human correction classification, and Q14's
canonical sync optimization remain in their existing owners. Q17 gameplay
continues under its incumbent owner without a new tooling prerequisite.

Default builds intentionally still update tracked output files; BUILD_OUT
previews link mutable static assets and private packs where present. Their
source identity must accompany any reproducibility claim. No installed app,
release, commit, push or worktree retirement is implied by this local adoption.
