# Lane A2: LOTM Q3 second life, 2026-10-25

Authority: Weibao's Q3 dispatch to this isolated worktree, coordinated by Claude session "Codex lanes". Branch `codex/lotm-q3-2026-10-25`, base `640bc884b`. Primary checkout, master and node_modules are untouched. No push. Copied queue, Q1/Q2 checkpoints and untracked pathway test are context, not this lane's changes.

Rules: WA13, WPR31, AD5, AD38, AR1–AR16. Runtime seam: existing profile rows and `createLotmHost.enroll`, through the existing simulation enrollment, effect, transaction, clock and native save publisher owners. [Architecture rules](../../../ARCHITECTURE_RULES.md), [queue](../lotm-lives-regions-2026-10-23/QUEUE.md), [Q1](../lotm-q1-2026-10-23/CHECKPOINT.md), [Q2](../lotm-q2-2026-10-23/CHECKPOINT.md). No shared owner needs a new typed seam. No new command/verb.

Presentation: existing Tingen place-service panel and notebook ([UI rules](../../../UI_RULES.md)); desktop 1920×1080 target, visible outcome is a priced start and its remembered opening history beside the existing profile choices. Mobile and layout redesign are deferred.

## F1: baseline reconciliation

The supplied base already contains Q3's combined new-identity civil profile, enrollment, 5-pound purse and 3-pound weekly contract, plus later church profiles. Reuse those rather than create a duplicate start or replace existing IDs. The comparison for this slice is the original Nighthawk probationer versus the new-identity civil clerk. Neither the dated Q1/Q2 "next seam" notes nor the inherited queue erase the later integrated runtime.

The gap was explicit opening accounting and persistent knowledge, plus meaningful evidence that both profiles earn/spend and retain different purses. Existing `collect_pay` offers the first week's pay on signing and further pay at seven-day clock boundaries. This lane preserves that proposal and existing saved command definitions.

## D1: proposed coherent start

All amounts, funding and profile composition here are playable proposals, not new accepted direction or a recreation of the protagonist's entire balance sheet. Source anchors remain F7/F8/F16/F17/F25 in the supplied [institutions owner](../../../worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md).

| Aspect | Nighthawk probationer | New-identity civil clerk |
|---|---|---|
| Body | Existing human player body | Existing human player body, described as adult |
| Means | Existing native purse carries over | Proposed 29 pounds funded before entry; papers 8, clothes/goods 12, one third-class passage 4, leaving 5 pounds (1200 native pence) |
| Debts and obligations | No new loan or contract | No outstanding money loan; five-year employment term, lifetime secrecy and travel limits in the existing signed contract |
| Access | Supervised probationer track and district errands | Civil post, salary and ordinary district errands; no automatic potion or field membership |
| Knowledge | Original supervisor and retained purse | Paid identity costs, residual purse, contract offer, known old ties and certificate requirement for later ocean passage |

The spent 24 pounds are opening history, not charged again from the 5-pound remainder. Clothes, papers and passage are not minted as native inventory items or a new playable travel service. The existing civil profile excludes the source protagonist's extra gold and other assets; the proposed funding is explicit rather than silently importing those assets. There is no invented creditor or repayment verb.

## A1: changed files and compatibility

- `src/book_world_lotm_lives.js`: explicit opening-budget data and proposed priced blurb; entry knowledge effects using the existing knowledge effect type.
- `src/book_world_lotm_host.js`: applies those effects inside the existing enrollment plan before its single native publication.
- `src/book_world_lotm_ui.js`: civil staff see their post and signed terms instead of an unavailable Seer progression prompt. Existing probationer pathway presentation stays in its branch.
- `tests/lotm_lives.test.js`: both profiles pay endorsements once; both earn through an actual timed errand; civil salary, opening arithmetic and differing balances survive serialization without replay.
- `tests/lotm_lives_compat.test.js`: old fixtures remain deeply unchanged after validation and projection.

Compatibility decision: `state.lotm` stays schema 1 with the same profile IDs and same timed command definitions. Only new enrollment adds `simulation.knowledge.player['book.lotm.entry']` through the existing optional knowledge map. Loading an old save does not backfill that history or grant money, salary, debt or inventory. Existing civil profiles keep their saved balances and contract timestamps.

## Verification

Input: base `640bc884b` plus the five lane source/test files above; inherited context edits preserved. No rulebook change.

- `node --test tests/lotm_*.test.js`: 73 pass, 1 file fails before tests execute. Gap: inherited, untracked `tests/lotm_pathway_rows.test.js` imports `LOTM_ASSESSORS` (also references the older two-pathway API) absent from this base. Preserved as supplied context; not changed to hide the failure.
- `node --test tests/lotm_lives.test.js tests/lotm_lives_compat.test.js`: 9 pass, 0 fail; engine/host and historical save slice only.
- `npm run build`: pass; generated bundle and map used for browser verification. Generated files are verification output outside this lane's commit scope.
- `npm run check:arch`: pass; main −2, display −43, save_files 0 versus baselines; no added cycle/import violation.
- `npm run check:rules`: pass, 0 warnings (22 register rows, 41 AD codes, 123 links).
- `node /tmp/lotm-q3-browser.cjs`: initial two-profile native run PASS on bundle `07db4cdd82027a3cd750f1c4550adabb956184173ef80daa86c1b597485756cf`; final two-profile rerun PASS on bundle `34677003226f3c5385e57c8a96db05e6c9def5a1cf12887664b709bb91ccf7ee`. Fresh isolated browser contexts, 1920×1080, localhost `127.0.0.1:19873/?lotm_probe=1&test_hooks=1`, headless Chrome with no visible windows. Uses existing workspace Restore/Expand controls and native action buttons, not direct state edits. Native engine test hooks advance timed jobs.
- `node /tmp/lotm-q3-oldsave.cjs`: PASS. Builds a temporary baseline bundle with `640bc884b` host/lives owners, generates a full native civil save after contract and 720-pence pay, then loads the new bundle. Reload and literal file Import preserve expansion, purse (1920), location and inventory deeply unchanged; opening history is not backfilled; no page errors. Gap: one native prior-profile state, complemented by the five historical pathway fixtures.
- `git diff --check -- src/book_world_lotm_host.js src/book_world_lotm_lives.js src/book_world_lotm_ui.js tests/lotm_lives.test.js tests/lotm_lives_compat.test.js`: PASS. The broad check also sees esbuild's generated minified bundle whitespace; generated outputs were restored byte-for-byte from HEAD after proof; the verified bundle is retained only at `/tmp/lotm-q3-verified-bundle.js`.
- `npm test`: not run; no commit selected, and this lane follows the focused-test dispatch. Coordinator runs the combined pre-commit suite after reconciling the copied test/API mismatch.

## Remaining acceptance and transfer

Browser acceptance includes both profiles enrolling from empty origin storage, reporting in, earning a 12-pence north errand, walking 20 native minutes to the docks, spending 24 pence on endorsement, earning an 18-pence docks errand, saving, reloading, exporting, walking away and literal file Import restoring the exported place and balance. Civil staff additionally sign and collect 720 pence once, with immediate repeat collection disabled. Probationer purse: 102 → 108; civil purse: 1200 → 1926. Both imports preserve profile, money, knowledge, resources and facts exactly, with no page errors. Final export strings: probationer 188,364 characters, civil 190,280 characters. Final civil panel shows Civil staff and its contract without a Seer progression prompt; inspected 1920×1080 screenshot. Screenshots and machine receipt remain synthetic temp artifacts at `/tmp/lotm-q3-{probationer,civil}.png` and `/tmp/lotm-q3-browser-result.json`.

An early implementation used the workroom situation as the opening knowledge basis before report-in created that situation. Native save validation caught it. Opening history now uses the existing optional unattributed knowledge form; enrollment tests also invoke full simulation validation. The corrected implementation passed the native persistence checks above.

Uncommitted lane handoff. No full-suite/commit claim, no merge, no push, no app adoption. Generated bundle/index output was restored and is not part of this lane's delivery. Optional private Gothic font files were absent (HTTP 404); screenshots use the available fallback font. A font/layout matrix and natural weekly pacing were not exercised. Director fiction/balance acceptance, normal-app adoption and integration are separate from the headless native slice. The inherited wildcard test API mismatch remains the coordinator's integration decision; no shared runtime or unrelated test was rewritten for it.

Final lane input SHA-256 (build identity above):

| File | SHA-256 |
|---|---|
| `src/book_world_lotm_host.js` | `a6de43f797c9c9f6cd248877252fb1fffd2e73dde2bd45a66b6eabc582fc0917` |
| `src/book_world_lotm_lives.js` | `2b71c429307ffebfe7549bfbb9facdceb0f54d7363721e06f425b0979af6737b` |
| `src/book_world_lotm_ui.js` | `94ea055095881af1dcde0a89fee806b58b0893b8dad14811f8648829b711fcec` |
| `tests/lotm_lives.test.js` | `b6a81dbf3ee48215eda095ccf16c7a0eed58296091119f7d37f962d219d90807` |
| `tests/lotm_lives_compat.test.js` | `58ede767b5aaaefb89f132f3768741e5fa39f270d6c4cb3843c301d3762c6c7e` |

## C1 integration, 2026-10-25

Q3 source committed as `40e186d1`; master `9b997ea60a7eb12200dbc825684e6668403aa015` merged without conflicts as `ba40dcc9d`. This preserves master’s Corpse Collector brewing, native material bridge and ingredient catalogue. Primary checkout and master were read only. Inherited queue/Q1/Q2 context remains outside this lane’s commits.

The inherited untracked `tests/lotm_pathway_rows.test.js` targeted a retired factory and assessor API. Replaced with current-row tests of the shared `pathwayDoses` save seam: release at assessment versus examination, missing/duplicate doses and consumed doses. Existing system journeys retain pathway behavior coverage. No runtime API was restored for a copied test.

Input: merge `ba40dcc9d` plus the replacement test. Rules: AR1–AR16, WA13, AD38, SR1–SR24 where places/custody matter, UR1–UR69. Existing desktop 1920×1080 panel; mobile and layout redesign deferred.

- `node --test tests/lotm_*.test.js`: PASS, 91/91, no skipped tests.
- `npm run build`: PASS; rebuilt browser bundle.
- `npm run check:arch`: PASS; no new cycle or composition-root growth.
- `npm run check:rules`: PASS, 0 warnings.

Browser proof and final combined checks follow below. Full `npm test` is intentionally reserved for the final Q5 branch tree under the C1 dispatch.

- `node docs/gm/dispatch/lotm-q3-2026-10-25/checks/profiles.cjs`: PASS on rebuilt bundle SHA-256 `dd07f8d0687100ab6220da341890ea18e44e8877ff0e5ea226b03f757fc2cdf4`. Two fresh browser contexts at 1920×1080, headless Chrome, localhost :19873. Both profiles enroll, earn, spend, Save, reload, Export and literal file Import; exact profile/money/knowledge/resources/facts/place comparison, no page errors. Final balances: probationer 108 pence, civil 1926 pence. Civil salary repeat disabled. Native test hooks advance the actual clock. [Receipt](browser-result.json). Optional private fonts remain unavailable; fallback font used.
- `git diff --check` on Q3 owned paths: PASS.

Q3 integration gate complete before Q4 source edits. Human pacing/taste acceptance, normal-app adoption and master integration remain separate. No push.
