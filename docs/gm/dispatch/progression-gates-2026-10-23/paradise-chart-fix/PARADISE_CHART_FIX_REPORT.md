# Paradise chart-before-enrolment fix (2026-10-23, proposal for integration)

Reported by the high-power closure coordinator `local_cd7c318b-815b-47b2-9db2-4055d8a64c14`
(no action requested from H2; evidence `high-tier-power-2026-10-23/evidence/h2-true-route/`).
Authorized as a corrective continuation of GTR11 (a gate is checked at commitment, against
the state it reads). Not a new product decision.

## Defect

`book.paradise.chart` is the command that enrols living-world services, yet on a fresh game it
did nothing: the button was enabled, the preview said eligible, the commit was refused with
"The required knowledge, means or circumstances are missing." and no enrolment happened, until some other
route had already enrolled services.

Cause (`src/book_world_paradise_host.js`, `commitParadiseCommand`): `paradiseContext` derives the
`paradise.*` admission facts from the state it is given. The commit builds them once from the
pre-enrolment state, where `simulation.people.player` does not exist, so `paradise.chartSupported`
is false. It then enrols a copy and evaluates the command against that enrolled copy with the stale
facts. The preview already special-cased the pre-enrolment chart, so preview and commit disagreed.

## Fix

One statement, on the enrolling branch only: rebuild the context from the enrolled copy,
`enrolled ? paradiseContext(current, request) : request`. Non-enrolling commands are byte-identical
in behaviour. `paradiseContext` overrides facts with freshly computed ones, so it is idempotent.
No `main.js` change; no persistence change; no new import.

## Transaction and rollback

`enrollSimulation` plans onto a copy and returns it; the live state is untouched until the caller
persists the returned plan. A refused commit therefore leaves the state, sequence and enrolment
unchanged. Tests assert this for three refusals (elder not met, away from the Village, native body
not alive) by comparing the serialized state before and after, plus a refused non-chart command.

## Ownership

No Paradise runtime writer was found: the host, actions and campaign-facts files are clean in the
primary checkout and in all 24 other worktrees (scanned by `git status`). The high-power closure
coordinator reported the defect without owning an edit. Built in an isolated worktree
`.claude/worktrees/paradise-chart-fix`, branch `claude/paradise-chart-fix`. The primary checkout was
not edited; this folder is new files only.

## Checks (one line each)

- New `tests/paradise_chart_enrolment.test.js`: 4/4 pass with the fix; with the host reverted to HEAD, tests 1 and 2 (fresh-state chart, same plan as the other enrolment route) fail and tests 3 and 4 (refusal invariants) pass, so the regression is real.
- `node --test` over every test that references Paradise (`book_world_native_binding`, `continuation_state`, `ink_lin_parity`, `world_calendar` and the new test): 38/38 pass.
- `npm run check:arch`: pass. `npm run build`: pass (needed the frozen D1 `progression_gates.js` because committed `pledges` imports it; that copy is not part of the patch).
- Rebuilt headless 1920x1080, fresh origin, own port (stopped), native clicks, chart clicked directly after the village elder with no other enrolment: fixed bundle enrols living-world services (player at Village), chart recorded complete and no longer offered, no refusal text, enrolment survives reload and file import, no page errors (`paradise_chart_proof.cjs`, `chart-fixed-1920.png`). Control on the unfixed bundle with the same script: button enabled, click accepted, no enrolment (silent failure reproduced).
- Not run: full `npm test` (the receivers' combined gate owns it), `check:rules`, mobile.

## Gaps

- The screenshot shows the Notes panel after the chart (chart action gone, enrolled-service actions listed); the state assertions carry the proof, not the picture.
- Later Paradise commands (`enroll`, `enter_hub`, and so on) were not exercised after the chart in this proof.
- Human play feel is not assessed. Not committed, pushed or installed; no personal saves touched.

## Apply

`git apply paradise-chart-fix.patch` (HEAD-based, `git apply --check` passes on the primary tree and on the
`integration-o-f-a` and `closure-combined-h1h2` worktrees). Independent of D1, R3 and D3.
Inputs and hashes: `paradise-chart-fix-inputs.json`.
