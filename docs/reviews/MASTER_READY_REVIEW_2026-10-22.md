# Ready-work review and fork publication, 2026-10-22

Weibao authorized reviewing the uncommitted changes, preserving active work,
then committing and pushing everything ready to the personal fork's master.
Applies AD32, AD33, AD34, AD36, AD41; AR1–AR16; UR1–UR69; MR1–MR36;
sealed-secrets and the shared-checkout commit procedure. This is publication of
selected existing work, not acceptance of new design proposals.

## Review findings and disposition

| Code | Finding | Disposition |
| --- | --- | --- |
| F1 | Shared master had advanced to `12720adc2` through isolated merges without updating primary's working files/index. The apparent removal of toxin binding, cold armor and the HP brewing pack matched the pre-merge state. The merge owner's final receipt explicitly says primary's files were left untouched. | Three-way reconciliation against pre-journey base `b4f75dfa5`, retaining published master and the completed working changes together. All 21 apparent deleted published paths are retained. No intended rollback was found. |
| F2 | Cultivation methods/log spacing, engine bindings, C9 body/exposure work, W1–W4 and LOTM ascension had completed owner records and source/test inputs. | Included together with their source, tests, records and selected final evidence. LOTM remains a localhost probe; its broader abilities/pathways and Mistglass ladder UI remain at the owner-recorded boundaries. |
| F3 | Research palettes, source/tool routing, shared-doc reconciliation and checkout-history notes were authored but uncommitted. | Include completed documents and registry edits. Proposal labels remain proposals; this publication grants no implementation authority. |
| F4 | The source-library chat was active and had recently edited `docs/research/SOURCE_ACQUISITION_TOOLS.md`. Large untracked sets also contained frozen bundles, exported saves, failed diagnostics and redundant screenshots. | Leave the active document and those local artifacts untouched and outside this publication. Preserve the zero-byte `private_tmp_dummy` scratch file. Public evidence is a selected receipt/screenshot set, with no exported saves or private source captures. |

A private recovery snapshot at
`/Users/weiwei/.codex/research/master-review-2026-10-22/` retains the original
binary working patch, staged patch, original index, SHA-256 file inventory and
all then-untracked files in `untracked.tar`. This archive is local, not public.
The isolated candidate is in its `candidate/` child on
`codex/review-ready-20261022`. It isolates verification from primary and has no
active feature writer. Retirement follows successful guarded integration and
preservation of its unique logs/evidence.

## Verification identity and checks

[Input hashes](../gm/dispatch/master-ready-review-2026-10-22/INPUTS.json) identify
the combined runtime, tests, scripts, styles and built output. Bundle SHA-256:
`5b644b2392c1386817da5b4bda711dcddbd4a605d587548c4f565d5c357f865c`.
All checks below run on the reconciled candidate, not primary's stale bundle.

| Check | Result |
| --- | --- |
| `npm run build` | PASS |
| `npm test` | PASS: 2,589 tests, 0 failures/skips |
| `npm run check:arch` | PASS: main growth 0, save owner growth 0 |
| `npm run check:rules` | PASS: 0 warnings after staging (3 untracked-link warnings before staging) |
| `npm run check:rule-behavior` | PASS: 36 checks |
| `python3 scripts/toolsets.py list --json` | PASS: changed registry parses through the actual CLI |
| Shared-doc zero-loss | PROJECT, USER_VISION and IDEA_INDEX each retain every nonblank HEAD line |
| `git diff --check` excluding generated bundle/map | PASS; generated bundle contains whitespace inherited from source strings |
| Publication content review | No credential/signed-URL pattern in selected new text; private frozen builds, raw captures, exported saves and failed diagnostics excluded |

Browser target: desktop 1920×1080; matrix also 1800×1040 and 1536×864,
at 14/21px. Mobile remains deferred. Fresh contexts use disposable test saves.
Existing W1–W4 harnesses exercise all four native journeys on this exact bundle,
including ten Save/reload/Export/literal-Import persistence states. The 18-case
three-surface desktop matrix passes; smallest 21px workshop and institution
screens were visually inspected. Retained toxin-binder and cold-armor native
journeys also pass after reconciliation. LOTM native teaching, six acts, recovery,
assessment, promotion, held-dose reload and Export/literal Import pass on this
same bundle at 1920×1080. The retained Polyjuice harness also passes eight gameplay/persistence gates with
zero page errors. It rebuilds the same source in its own disposable bundle;
its first run logged 21 missing-asset console errors. Private fonts and an empty
schema-1 private-pack fixture were absent from the isolated checkout, so the
initial desktop matrix used fallback fonts. Fonts are now linked locally and
the corrected desktop matrix is the final visual evidence. No private font or
pack file is published. The long twenty-one-day stew completion was not rerun.
Historical feature evidence keeps its original bundle identity and is not
counted as current combined proof.

[Combined proof](../gm/dispatch/master-ready-review-2026-10-22/CHECKS.json)
records final browser checks and publication input identity. Private runner
logs and exported test saves stay with the recovery snapshot. W3 is reported
by route and status; sealed truths are not restated here. History-bearing W3/W4
screenshots also remain private; their public evidence consists of route/status
receipts.

## Delivery boundary

The required final step is a guarded local-master update and fast-forward push
to `origin/master` only. Upstream is outside this authorization. The publisher
rechecks primary's input hashes and HEAD before integration, copies reconciled
files only where their snapshot inputs are unchanged, and aligns only reviewed
index paths. Concurrent changes remain local instead of being overwritten.

Source, build, tests and disposable-browser behavior are distinct from Electron
snapshot staging, installed-app adoption and human pacing/taste acceptance.
This task does not update the player's running app or touch personal saves.
The existing app's Save and reload/restart adoption gate and human acceptance
remain open. Feature-specific unfinished scope stays with its linked owner.
