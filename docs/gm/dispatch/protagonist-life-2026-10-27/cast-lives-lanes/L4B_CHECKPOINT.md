# L4b checkpoint, 2026-10-28

Status: **engine ready, below the AD43 delivery floor; native integration pending ownership**.
Agent-verified at source, synthetic-focused and native-state-fixture scope, not human-reviewed.
The active app still has no beat-settlement caller, Reports publisher or cast person-history hook.
No commit, staging, stash, reset, force, push, or user-save access occurred.

Authority: [L4b brief](L4B_BEATS_NULL_RUN_BRIEF.md), [card](../CAST_LIVES_CARD.md),
[plan](../CAST_LIVES_PLAN_2026-10-28.md) sections 2.3, 8, 9.5, 10.2, 18, 19 and 21.
L4c/L4d's coordinator completion establishes the prerequisite beside start's floor.
Applied codes: AR1–AR16, AD1/AD36/AD41/AD43, CLR1–CLR3/CLR6/CLR8–CLR11,
SUI3/SUI7/SUI11, RPT1–RPT5/RPT7–RPT12, LP9, CL15/CL49/CL171–CL177/CL187/CL199.
UI target: **1920×1080 desktop**, witnessed report receipt and known person's retained history.
Mobile optimization, scene cards, executing the missing individual NPC verbs and the lead's player
seat are deferred. Relevant UI owner: [player UI rules](../../../../../.claude/rules/player-ui.md).
No new accepted direction is asserted here.

## F1. Owned writes and seam

| Path | Change |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | Add pure bound-scene settlement planner over `beat_records`, report projection through `renderRefs`, known-person history projection and a durable-plan adapter for the existing `beatLedger` domain. Existing location/talk behavior retained. |
| `tests/lotm_cast_week.test.js` | Three synthetic regressions: within-day dates/idempotence/actor/mechanism/lapse/name snapshots; four perception routes and private/missed/busy suppression; failed-save atomicity and ledger reset. |
| `scripts/headless/lead_runs/lotm_beside_week.mjs` | New native-state fixture with no player actions after enrollment, explicit settling driver, per-day counts, ledger hash and mid-run envelope roundtrip. |
| `private_packs/lotm-cast/cast.json` | Ignored: four conservative, source-reviewed external present-report routes; no unseen gossip or dream disclosure. |
| `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4b-probe-2026-10-28/` | Ignored: `scene_contracts.jsonl`, `gaps.jsonl`, `fold_loss.jsonl`, `counts.json`. |
| This checkpoint | Scope, input identities, evidence and remaining integration gates. |

Location and time retain their existing owners. Each bound scene becomes due at its authored start
minute on its bound day. The adapter reopens a resolver day for later scenes while retaining its
terminal `done` records, so scene order does not require a second clock or ledger. The inherited short
window-fact keys and the host's full scene keys are bound to the same day. No source date is upgraded:
these remain L4a's authored source-order bindings.

The planner carries `actor`, writes occurrence effects to the existing ledger fact map, and preserves
`blocked` for unimplemented mechanisms. It does **not** pretend those fact markers execute purchases,
choices, travel, contests or acquired knowledge. The fold-loss ledger records that missing behavior.

Report routes are explicit pack data. A route requires its place and optional received-knowledge key;
no report is inferred from a private thought or an unobserved location change. A currently busy player
or a skipped historical instant grants no fresh present witness. The four exposure levels have separate
synthetic coverage. Names are snapshotted from knowledge at settlement, then resolved from stored tokens
when projecting the receipt; later introductions do not rewrite the earlier line. Unknown people are
not introduced by settled truth. Movement emits no report. No new Reports kind is added.

`persistLotmCastPlan` stages the serialized domain slice in the existing expansion plan's native patch,
calls its durable save owner, then publishes the holder and receipt. A failed save leaves the live
ledger and report publisher unchanged. Existing absent-ledger saves remain valid under schema 1;
no schema migration or user-save rewrite is needed. Reset on a new beside enrollment is explicit.

## F2. Data gate, null run and private gaps

CLR2 gate: **84 bound beats** against expected about 84; **4 bound days** against expected 4.
Neither is under half. There are 60 bound scene windows. Both private packs still pass their validator.

| Bound day | Settled | Blocked | Lapsed | Report lines at idle lodging |
| --- | ---: | ---: | ---: | ---: |
| 1 | 13 | 6 | 0 | 0 |
| 2 | 14 | 0 | 0 | 0 |
| 3 | 45 | 5 | 0 | 0 |
| 4 | 1 | 0 | 0 | 0 |
| Total | 73 | 11 | 0 | 0 |

Zero lines is the observed witness budget for this unattended lodging fixture, not a missing-mechanism
success claim or invented household news. The four reviewed real-pack routes require presence elsewhere.
Every non-mechanism beat resolves `carried` on its bound day; every mechanism beat resolves `blocked`.
Two fresh processes and a third with the mid-run roundtrip print byte-identical output, including ledger
SHA-256 `43cf36ce7bc5d96efa03d86666c9ac261e87c15ed77c1eec304a10e6f87bb5c2`.

The probe covers five kinds: routine day, purchase, fact-changing talk, police questioning and night
threat. Their cited evidence paragraphs were read locally; **zero cited paragraphs missing**.
Private contracts include actual fixture results and the absence of a command transcript.
There are **15 concrete gap rows**: noun 1, number 2, rule 3, verb 4, aftermath 4, detail 1.
The detail row is optional scene-card work, not an added completion gate. A source/index numeric
mismatch is recorded privately for L1; this lane does not rewrite the merged index.

CL187 fold-loss: **84 beat rows, 84 lossy or unverified folds, 386 typed loss entries**. Eighty-two
rows have matching merged scene contracts; two lack such a contract and receive explicit gaps.
Expected choices, inputs, outcomes, participants, place, time and knowledge are retained in the private
research ledger as expectations. They are **not** claimed as executed NPC state. Bound actors, places,
scene dates and occurrence effects are the narrower runtime result. No sealed truth is disclosed here.

## F3. Unowned integration and reviewable patch

The L4 table assigns this lane the cast host, focused test and headless route. The necessary native
caller, Reports port and person-view hook live outside that list. The user's instruction to touch only
owned files is why an asynchronous ownership request was raised. It remained unanswered at checkpoint.
Those shared files are unchanged by this lane:

| Unowned path | Prepared change, not applied |
| --- | --- |
| `src/book_world_lotm_host.js` | Wrap the existing persistence calls with the durable adapter; reset on beside enrollment; tick when a beat becomes due even if no location/window fact changed. |
| `src/main.js` | Supply the existing `log_message` operation through the existing LOTM configuration object. No extra registration line. |
| `src/people_knowledge.js` | Append observer-safe known-cast histories to the existing known-people view. |

Concrete patch: `/tmp/l4b-integration-ownership.patch`. Candidate copies:
`/tmp/l4b-hooks/{book_world_lotm_host,people_knowledge,main}.js`.
Preparation script: `/tmp/l4b-prepare-hooks.py`. All three copies pass `node --check`.
The patch's host and people hook were additionally exercised through a temporary esbuild replacement
plugin: `/tmp/l4b-build-candidate.mjs`, `/tmp/l4b-candidate-entry.mjs`,
`/tmp/l4b-candidate-check.mjs`, receipt `/tmp/l4b-candidate-check.log`.
That **temporary source candidate** passes native enrollment and ticks, all 84 commits, one witnessed
Report with the existing Event kind and known-person link, retained person memory, and repeated
view/tick idempotence. Its player co-location and introduction are explicit fixtures.
It does not prove the active checkout adopted the patch or a rebuilt browser displayed it.

RPT6's away digest is unimplemented; raw receipts and the person-history projection are the available
pieces. RPT12 currently has one deterministic wording per reviewed real route, not a multi-variant
texture catalogue. Heard/affected/aftermath support is synthetic-verified; this pack currently supplies
four present routes. Broader source-backed routes remain data work, with no unseen news fabricated.

## F4. Checks and delivery floor

Active-source isolated build: `BUILD_OUT=/tmp/yairpg-l4b npm run build`.
Bundle SHA-256: `aae88325318842531746a29623f077e355b4c35992571110b7ca1b8f13a3970c`.
Tracked `dist/` and `index.html` were already dirty and were not written by this lane.
Observed shared HEAD: `a76ab76bc6627f014ad80357ebf476e58e9bdf4e`.

| Command / route | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js` | PASS 12/12. `/tmp/l4b-focused-final.log`. | Synthetic regression and existing host fixture; full `npm test` remains the coordinator's combined pre-commit gate. |
| `node scripts/headless/lead_runs/lotm_beside_week.mjs` twice | PASS 84/84 terminal on bound days; outputs identical. `/tmp/l4b-null-final1.log`, `/tmp/l4b-null-final2.log`. | Native-state fixture, explicit settlement driver; it does not establish the app tick is wired. |
| `node scripts/headless/lead_runs/lotm_beside_week.mjs --roundtrip` | PASS; output identical to both ordinary runs. `/tmp/l4b-null-final-roundtrip.log`. | Exercises actual domain save/validate/load hooks through JSON envelopes mid-run. Not literal browser Save/reload/Export/Import buttons. |
| `node scripts/check_private_cast.mjs` | PASS both real packs. | Real content kept separate from synthetic tests. |
| `node /tmp/l4b-refine-probe.mjs` | PASS, five executed fixture contracts; counts in F2. | Marker-level run exposes missing individual verbs; no claim of complete NPC playthrough. |
| `BUILD_OUT=/tmp/yairpg-l4b npm run build` | PASS, bundle hash above; `/tmp/l4b-build.log`. | Active app includes the helper but has no settling caller. Pending hook patch excluded. |
| `npm run check:arch` | PASS; main -30, display -37, save 0; 6 grandfathered main imports, 205 grandfathered cyclic edges; zero growth/new cycles. `/tmp/l4b-arch.log`. | Active shared source only, not a frozen combined candidate. |
| `node /tmp/l4b-build-candidate.mjs` then `node /tmp/l4b-candidate-check.mjs` | PASS temporary hook-candidate fixture described in F3. | No shared-file adoption or browser evidence. |
| `git diff --check -- src/book_world_lotm_cast_host.js tests/lotm_cast_week.test.js`; `node --check scripts/headless/lead_runs/lotm_beside_week.mjs` | PASS. | No Git writes. |
| Browser at 1920×1080 from fresh origin | NOT RUN: active app's necessary caller/render hook remains unowned and unapplied. | Required witnessed-report and person-history screenshots remain open; no old browser evidence reused. |

Initial harness failure: a single `advanceSimulation` call stopped before a distant boundary. The script
now advances in bounded 60-minute steps and asserts forward progress; all final runs reach every
boundary. A temporary candidate fixture initially omitted the required knowledge `cause`; it was
corrected before its passing run. These failures were investigated rather than attributed to siblings.

| Floor line | State |
| --- | --- |
| FLR1 | PASS at active-source build scope, hash above. Pending integration patch excluded. |
| FLR2 | PARTIAL: fresh enrolled native-state fixture and temporary native caller candidate pass; no active app journey or browser proof. |
| FLR3 | BELOW FLOOR: pack report templates and observer-safe projections exist; active Reports and person rendering remain unwired; screenshots missing. |
| FLR4 | PARTIAL: focused consumers and temporary person/report hooks pass; active consumer adoption remains open. Markers do not execute source choices and transactions. |
| FLR5 | PARTIAL: ledger domain Save/reload/Export/Import envelope hooks pass mid-run; failed-save atomicity passes. Literal browser controls remain unrun. |
| FLR6 | Engine ready, below floor; agent-verified at source/focused/native-state-fixture scope, not human-reviewed. No commit, install, publication or deployment claim. |

Remaining playable gate: coordinator adoption of the prepared native hook patch, then one rebuilt fresh
1920×1080 browser journey witnessing a reviewed route and opening its known-person history, with literal
Save/reload/Export/Import and the two required private screenshots. Record the new bundle hash.
The individual NPC verb and fold-loss gaps remain in the private ledger, not silently treated as solved.

## F5. Input identities for coordinator adoption

Core-owner files changed in the active checkout: zero. New cyclic edges: zero. New registration lines:
zero. Owned writes are released to the coordinator; all pre-existing unrelated changes are preserved.

| Path | SHA-256 |
| --- | --- |
| `src/book_world_lotm_cast_host.js` | `c96c307c1094f600e9ede1e0fd5b7a30de3380457a4553ea6b6892537167d79a` |
| `scripts/headless/lead_runs/lotm_beside_week.mjs` | `b3b2ddf6bb004a726b9a6819a958ad7e97e7a2b3ccd6db6724af4c0e4608453f` |
| `private_packs/lotm-cast/cast.json` | `daa170d75cc81398447c99f1603442dad61ab4bc9d084d5dd8320d4f20468dfc` |

The final focused-test file identity and document/rules checks are recorded below after the final run.

Final test SHA-256: `8e2eb323103a6200c5d313ae9497d65aa6526c9d53866495510f4008b51c6ae8`.

| Final check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_cast_week.test.js` | PASS 12/12 on the final test identity above, 10.8 seconds. | Same focused scope described in F4. |
| `npm run check:rules` | PASS: zero warnings, 16 receipts, zero problems. `/tmp/l4b-rules.log`. | No rulebook or accepted-direction changes made. |
| Python checkpoint-relative-link check | PASS all linked local paths. | Local document links only. |
| Python owned-public-file principal-name and trailing-whitespace scan | PASS zero full principal-name hits and clean whitespace in all three owned public code files. | Does not claim a whole-repository or whole-bundle name sweep. |
| `git status --short -- <owned paths and three pending-hook paths>` | Only the four owned public/checkpoint paths changed; the three unowned hook paths remain clean. | Ignored pack/research outputs separately inventoried in F1. |

## Coordinator completion, 2026-10-28

Applied L4b's prepared integration patch (`src/book_world_lotm_host.js` persist path, `src/people_knowledge.js`
known-person rows, one existing `main.js` line gains the `logMessage` port: AR1 zero line growth). The
patch exposed a test-order bug, not a product bug: the ledger test committed a fixture and then enrolled,
and enrollment now resets the ledger as intended; the test enrolls first.

| Check | Result |
| --- | --- |
| `node --test tests/lotm_cast_week.test.js` | PASS 12/12 |
| Browser, headless Chrome, fresh origin, 1920×1080, natural route (enroll, walk to the household flat, wait to dawn) | PASS: the dawn beat writes one Reports line at the present witness level with the actor's name masked as not yet known (RPT2, RPT4); zero page errors; Save, reload, Export, Import pass. Bundle `1fe67d59ffd16069c2dba3d86fac5e8c150eee7b23b89c005287745556f2ae26`. Screenshot private (CLR3) |
| `npm test` | PASS 3,679/3,679 |
| `npm run check:arch` | PASS, no growth |

Floor: FLR1, FLR2, FLR4, FLR5 pass. FLR3 partial: the Reports line shows; the person view's settled-beat
rows appear only for known people and were not screenshotted. FLR6 agent-verified, not human-reviewed.
Polish noted: report lines start lowercase (capitalize the first letter at render); the walk list needs
grouping by district (UR42).
