# L1 checkpoint, continued 2026-10-28

Status: L1 tooling and both private crosswalk/fitness reports complete; agent-verified, not human-reviewed.
This is local tooling and index preparation, not installed or playable cast behavior.

Authority: [L1 brief](L1_BRIEF.md), [cast-lives plan](../CAST_LIVES_PLAN_2026-10-28.md).
Weibao's continuation: “Resolve what you can, keep uncertain IDs separate, and continue L1
through the crosswalk and fitness reports. You can proceed past the ten-ID stop condition.”
This supersedes the prior stop for this lane. No paid calls, runtime edits, private-save
access, commit or push. Owned paths: this file, `scripts/lead_run/build_crosswalk.mjs`,
`tests/lead_run_crosswalk.test.js`. Codes: WA22-WA24, WA43 (proposed tier guidance),
AR1-AR16 (tooling boundary), AD36, AD41; CL55, CL57, CL77.

## Outcome and identity decisions

- D1: Reviewed unambiguous proper-name/role redirects; retained uncertain and common-noun
  collisions separately. Final private overlays have 51 LOTM and 23 MoL non-self redirects.
  Automatic people `reveals.same_as` edges are guarded by identity redirects unless explicitly
  reviewed. This matters because the original MoL merge conflated different people. The guard
  changes inputs, not merge code; redirect counts in merge reports include self guards.
- D2: LOTM runtime contacts are original institutional roles, so none substitutes for a canon
  cast member. MoL maps five source identities to confirmed existing pack people IDs. All other
  crosswalk rows use deterministic `new:<proposed id>` addresses, never invented runtime matches.
  Uncertain IDs are not folded merely because their labels match. Explicit `skip:<reason>` is
  supported, but no current row is skipped.
- D3: LOTM slice is chapters 1-24. MoL slice is chapter 1 through the first reset's waking
  confirmation, `lr.mol.main.00501` (`en b1 c5 p3`, `en b1 c5 p9`). The remainder of chapter 5
  belongs to the next played loop and is excluded. Source order is not treated as one global clock.
- D4: CL55 place references use exact unambiguous registry names or a reviewed join; unresolved
  text gets its own proposed place address. Composite routes are not collapsed into a guessed
  single location. A routine's organization ID used as a place gets a separate place proposal.

## Coverage

| Book | Lead scenes | Scene-touched entities checked independently | Missing touched rows | Crosswalk rows including routine/place supplements | Runtime matches | Proposals |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| LOTM | 58 | 229 | 0 | 297 | 0 | 297 |
| MoL | 25 | 71 | 0 | 109 | 5 | 104 |

Every person, place, organization and item touched as present/partial in the selected lead
scenes has a mapping. Scene `present` references and scene/routine locations supplement this
check. A mapping is a preparation address, not proof that the entity is implemented.

## Consumer fitness (CL57)

Counts below are **usable / total**. People metrics include `people` and `people_other`;
rules include `rules` and `rules_other`. Scene metrics count lead POV only. Slice membership
uses the earliest valid scene evidence locator; nested people fields use their own locator,
falling back to their row's locator. Missing dates are not guessed. Whole-index counts retain
the whole merged book scope, while slice counts are the lane's import boundary.

| Scope | Relations resolve to a person | Routine registry place + time | React trigger keyword class | Scene outcome + registry place | Rules explicit cost status |
| --- | ---: | ---: | ---: | ---: | ---: |
| LOTM slice | 209 / 266 | 11 / 131 | 79 / 196 | 40 / 58 | 0 / 454 |
| LOTM whole merged index | 1026 / 1205 | 88 / 696 | 317 / 812 | 295 / 369 | 0 / 1926 |
| MoL slice | 110 / 132 | 10 / 76 | 37 / 100 | 4 / 25 | 0 / 182 |
| MoL whole merged index | 3314 / 4020 | 66 / 1693 | 867 / 2632 | 96 / 714 | 0 / 6721 |

- F1: Routine recurrence such as weekdays is not a time. A stated hour, band or temporal
  window is required. Additional slice slots with time but only proposed places: LOTM 7,
  MoL 3. All slice routine place strings have crosswalk addresses, including unresolved proposals.
- F2: Additional slice scenes with an outcome but only proposed places: LOTM 0, MoL 21.
  Proposals are reported separately and do not inflate the usable registry-join numerator.
- F3: No selected input rule has the schema-1.4 `costStated` field. Zero records the missing
  field, not a claim that these actions are free. `stated` and `stated-free` count as known;
  `not-mentioned` is tracked as field coverage but not usable known cost.
- F4: `classifyAction` is exported for CL60/CL61. Keyword hits are not semantic accuracy or
  held-out reaction validation. Unclassified triggers stay null; there is no catch-all `other`.
  Its low hit rate is evidence for the reading session's CL56 schema decision, not paid-run
  authorization. CL60's held-out principal reaction test remains outside L1.

## Reproduction and private evidence

For each book, outputs are under `private/lead-run-<date>/merged-cast-2026-10-28/`:
`registry.jsonl`, `scenes.jsonl`, `extras.jsonl`, `merge_report.json`, `crosswalk.json`,
`consumer_fitness.json`. Original `merged/` directories are untouched. Parent private folders
hold `L1_overlay_reviewed.json` (merge input) and `L1_overlay_review.json` (decisions, retained
separate groups and guards). MoL also has `L1_crosswalk_review.json` for reviewed runtime/place
joins. The initial LOTM `L1_collision_stop.json` is historical evidence, not a live stop.
Each fitness report and crosswalk records input SHA-256 identities; runtime source and tool
identities are included. No source prose is reproduced here.

```sh
node scripts/lead_run/merge_shards.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27 --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28 --match '^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)' --overlay docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/L1_overlay_reviewed.json
node scripts/lead_run/merge_shards.mjs docs/research/novels/mother-of-learning/private/lead-run-2026-10-28 --out docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28 --match '^molc[0-9]+m$' --overlay docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_overlay_reviewed.json
node scripts/lead_run/build_crosswalk.mjs docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/merged-cast-2026-10-28 --world lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --report
node scripts/lead_run/build_crosswalk.mjs docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged-cast-2026-10-28 --world mol --from 'en b1 c1 p1' --to 'en b1 c5 p9' --review docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/L1_crosswalk_review.json --report
```

## Check log

- LOTM reviewed merge command above: PASS, 61 shards, 429 scenes, 2,127 registry entries;
  `people` extras 590 and `rules` extras 490. Nonzero-extras gate met without merge code changes.
- MoL reviewed merge command above: PASS, 106 shards, 780 scenes, 2,289 registry entries;
  `people` extras 1,702 and `rules` extras 1,704.
- Both crosswalk CLI commands above: PASS, coverage/counts in tables; no skip rows.
- Independent Python scan of selected scenes, touched rows and place target syntax: PASS;
  229 LOTM / 71 MoL touched entities covered; all emitted place addresses valid;
  merged input hashes match reports. No gameplay or implementation claim.
- `node --test tests/lead_run_crosswalk.test.js`: PASS, 15/15 on final source; includes the
  final keyword false-positive regression added while the combined suite was running.
- `npm run check:rules`: PASS; 26 register rows, 43 AD codes, 145 relative links;
  16 receipts checked, no problems.
- `npm test`: PASS, 3,652/3,652, zero skipped, run once (127.9 seconds). This run loaded the
  14-test crosswalk version before the final keyword correction; the 15-test final-source run
  above verifies that later change. No other test imports the crosswalk script. No full-suite rerun.
- Repository-wide `git diff --check`: unrelated existing `dist/bundle.js` trailing whitespace;
  L1 does not edit that output. Owned-file `git diff --no-index --check /dev/null <path>` checks: PASS, no whitespace
  diagnostics for all three L1 files (exit 1 indicates the expected new-file diff).

## Remaining boundaries

L1 supplies identity preparation and measured fitness, not the L2 schedule or L3 cast import.
Uncertain identities remain separate, proposed places need downstream review, missing timing
and cost status remain data gaps, and keyword classes need CL60 validation. Runtime build,
browser, save/reload and installed-app gates do not apply to this tooling-only change.
Changes remain uncommitted and unpushed.

## Historical initial attempt (superseded by the continuation above)

### Initial stop, 2026-10-28

Status: stopped at the brief's collision-ambiguity gate; not complete.
Authority: [L1 brief](L1_BRIEF.md), [cast-lives plan](../CAST_LIVES_PLAN_2026-10-28.md).
Codes: WA22-WA24, WA43 (proposed tier guidance), AR1-AR16 (tooling boundary), AD36, AD41.
No runtime changes, paid calls, overlay application, commit or push.

## Findings

- F1: The new LOTM volume-1 merge loads 590 people extras and 490 rules extras.
  It contains 61 shards, 429 scenes and 2,160 registry rows. The existing `merged/`
  was left untouched. No merge code change is needed for the nonzero-extras gate.
- F2: The proposed overlay contains 53 redirects and 86 collision-review groups.
  A conservative review retained uncertainty for 26 IDs across 12 item groups:
  shared common names do not establish identity, and the data mixes item types,
  individual objects and separate occurrences. For example, the keys group includes
  `lotm.item.keys` and `lotm.item.key`; their rows include distinct holders, so
  name equality cannot establish one object. The private receipt preserves IDs
  and first-mention locators for the 12 groups. This exceeds the brief's threshold
  of ambiguity on more than ten IDs. No proposed redirects were accepted or applied.
- F3: MoL's existing overlay has 23 proposed redirects and 77 review groups.
  It was inventoried, not adjudicated: execution stopped at F2 before completing
  the two-book review, crosswalk or consumer-fitness report.

## Exact inputs and private outputs

LOTM input: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27`.
New output: that directory's `merged-cast-2026-10-28/`.
Private collision receipt: `merged-cast-2026-10-28/L1_collision_stop.json`.
MoL overlay: `docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/merged/overlay_proposed.json`.

Final selection regex: `^(s[0-9]+[rv]?m$|w[1-4]s[0-9]+m$|b[4-7]s[0-9]+m$)`.
It includes the chapter 1-3 `s2m` input and chapter 16-24 `s7vm`-`s9vm` inputs;
excludes later-volume, `w3s33` experimental variants and `zw` inputs.
An initial narrower selection omitted those four early inputs (57 shards,
528 people, 428 rules); that preliminary output was replaced by the final selection.

## Consumer-fitness counts (CL57)

| Book | Relations resolved | Routine place + time | Reacts classified | Outcome + place scenes | Rules costStated |
| --- | --- | --- | --- | --- | --- |
| LOTM | Not measured | Not measured | Not measured | Not measured | Not measured |
| MoL | Not measured | Not measured | Not measured | Not measured | Not measured |

These are unrun checks, not zero counts. Crosswalk coverage and the MoL first-restart
boundary have not been verified. `build_crosswalk.mjs` and its tests were not created.

## Check log

- `node scripts/lead_run/merge_shards.mjs <LOTM-input> --out <new-output> --match '<final-regex>'`: PASS, exit 0; counts in F1; unresolved identity review remains.
- Local JSON inventory and census/registry identity inspection: PASS; 12 candidate groups / 26 IDs retained unresolved in the private receipt; not a completed overlay audit.
- `node --test tests/lead_run_crosswalk.test.js`: NOT RUN; implementation stopped before creation.
- `npm run check:rules`: PASS, exit 0; 26 register rows, 43 AD codes, 145 links; 16 receipts checked, no problems.
- `npm test`: NOT RUN; no commit attempted, so the full pre-commit suite was not invoked.

## Resume condition

Resolve the item type versus instance identity policy or explicitly revise the collision
stop condition before proceeding with L1. Continue from the private receipt and review
both overlays before applying redirects. No change to `merge_shards.mjs` or `batch_lib.mjs`
was made or proposed as necessary to clear the extras gate.
