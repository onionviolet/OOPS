# R1 checkpoint: pack generator, 2026-10-29

Status: offline tooling and candidate agent-verified, not human-reviewed. No commit,
base-pack replacement, runtime edit, bundle rebuild or gameplay completion claimed.
Coordinator owns integration and its rebuilt desktop browser check.

Authority: [R1 brief](R1_PACK_GENERATOR_BRIEF.md), [cast card](../CAST_LIVES_CARD.md),
[design sections 16–18](../LEAD_LIFE_SYSTEMS_DESIGN.md#16-everyone-else-depth-by-tier-a-path-for-everyone-weibao-asked-2026-10-28-proposal).
Applied AD36, AD44, AD45, CLR1–CLR13, LSD126, LSD134, LSD136, LSD142, LSD156–LSD159.
This implements the named brief, not a change to accepted direction.

## F1. Probe and preservation

| Gate/input | Expected | Observed | Result |
| --- | --- | --- | --- |
| Current people | 36 | 36 | Pass |
| Crosswalk-selected persons, chapters 1–24 | 100+ | 59 (270 in full-volume registry) | Above CLR2 half-count stop threshold; proceed |
| Selected lead scenes | Measured | 58 | Counts computed from scene presence/partial rows, not touchedByLead |
| Base sections | Inventory | 45 places, 77 schedule rows, 84 beats, 38 anchors; host 2 fields, bindings 5, leadLife 11, reports 4 | All retained |
| Fields with no merged replacement | Inventory | Host profile/situation prose, leadLife, dated day bindings, authored schedule/beat adaptations, Reports routes, district travel | Base wins |

Exact section inventory: private `/tmp/r1-pack/probe.json`. Every original people/place
field survives; all other original sections except revision are deeply identical.
References stay exact. New metadata does not replace the existing sourceIdentity.
`buildSourceIdentity` separately pins the compiler inputs.

## F2. Candidate and seam

Owned public code: `scripts/lead_run/build_cast_pack.mjs`, `scripts/lead_run/build_crosswalk.mjs` (fitness metric/helpers only),
`tests/build_cast_pack.test.js`. Owned records: this checkpoint and [R1_INTEGRATION.patch](R1_INTEGRATION.patch).
Private candidate: `/tmp/r1-pack/cast.json`; public files contain no canon records.

Command:

```sh
node scripts/lead_run/build_cast_pack.mjs lotm --from 'zh 第1章 p1' --to 'zh 第24章 p99999' --merged /tmp/m2-lotm/merged --base private_packs/lotm-cast/cast.json --out /tmp/r1-pack/cast.json
```

- People: **92** (principal 8, recurring 15, role 69, crowd 0). Base tier choices win
  conflicts. New tiers use lead-scene counts and relations; crowd uses explicit collective metadata.
  The volume-wide 30–50 deep-person estimate is not a slice quota.
- Routines: **81** emitted; old place/time usable **24**, new band/order/role-hours usable **31**.
  There are **10** order edges and **18** world-hours rows with locators. The hours rows
  in this slice come from services; rules are supported when they supply explicit hours.
- Crosswalk fitness, all 94 slice routine inputs: confirmed places **12 → 19** usable;
  including proposed places, new **32**. Whole volume: confirmed **289 → 512 / 1897**.
  These differ from pack counts because pack joins include preserved aliases and unresolved
  actor rows do not become cast records. Historical `registryPlaceAndTime` output keys are
  retained for compatibility; `timingBasis` and `oldPlaceAndTime` explain the changed numerator.
- Revision diff: **196 added, 33 changed, 0 removed** IDs across generated people/place/timing
  sections; **73** field conflicts retain the base. Exact IDs and conflicts remain private
  in `revisionNote`. Explicit redirects plus base indexId mappings form `idMap`; no fuzzy merges.
- Gaps: **13** source routine rows have unresolved actor IDs, listed privately rather than
  assigned guessed identities. No emitted routine has an unresolved place in this candidate.

The new `routines` section retains source timing and band without inventing a minute.
Order edges point to another routine when one exact actor-local target exists; otherwise
an embedded reference node preserves the named meal/event or previous-day relation.
`worldHours` retains stated phrases; it does not manufacture numerical shifts.
The integration patch, **not applied**, exposes these three sections through
`constraintsFromPack().timing` and records undated-window gaps. It does not execute the
order graph or turn an undated routine into a dated reservation. Existing host/location/
clock authority stays with the runtime owners. No P5 file was changed.

## C1. Checks (final inputs)

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/build_cast_pack.test.js tests/lead_run_crosswalk.test.js` | 22/22 pass; `/tmp/r1-pack/focused-tests.tap` | Focused tooling slice only |
| CLI above, twice via `node /tmp/r1-pack/verify.mjs` | Byte-identical; all base fields preserved; base hash unchanged | No runtime adoption |
| `node scripts/check_private_cast.mjs` in `/tmp/r1-pack/validation` | Generated LOTM pack valid; exit 0 | Scratch uses copied checker, symlinked source and generated pack; MoL absent/skipped |
| `node scripts/lane_review.mjs` with explicit grants and the five owned paths | 0 outside grant, 0 name-hit files, 0 top-level-await files | Scanner scans source/tests; scripts manually kept generic |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/R1_INTEGRATION.patch` | Pass | Patch unapplied; runtime behavior unverified |
| `git diff --check -- scripts/lead_run/build_crosswalk.mjs` | Pass | Tracked owned diff only |

Final base SHA-256: `76bd2b74ef7d9d8b40b46dd86627f26cae6ef97127a7079a22d3caa269b6cb99`.
Candidate SHA-256: `7889931a2b25bc276df2c1b66cb68d2cc297a23167d709bfa8ab9f6ef207e7d5`.
Code input identities:

- `scripts/lead_run/build_cast_pack.mjs`: `057ebae38ee2b50f74e56d126b04c291723bb2045d976c1406108b4b9a549669`
- `scripts/lead_run/build_crosswalk.mjs`: `93af3ac74ab1b939b77c33566f2f2eeeb5eb46bc6e55de785ce644e39dc59b67`
- `tests/build_cast_pack.test.js`: `72bc5e1bbde4c8e1d0936bde872e32efa1a68cf228dacd08497bc62dab1205df`

Private receipts: `build-report.json`, `consumer-fitness.json`, `determinism.json`,
`probe.json`, and `focused-tests.tap`, all under `/tmp/r1-pack/`.

## R1. Known limits and next integration gate

Authored host texts, start history, exact day bindings, existing beats/schedules,
perception routes and district travel remain authored because merged readings do not
supply equivalent engine-ready records. The compiler extends people/places/timing;
it does not synthesize new event effects or overwrite authored adaptations.

Tier thresholds (10/top count principal; 3 lead scenes or 2 relations plus contact recurring)
are compiler defaults, not new accepted world rules. Existing principal assignments remain.
Relations are added for new people only with exact known targets; this is not a new full
inner-life extractor. Identity redirects need explicit evidence. Missing actor IDs stay
in the private gap list. Future consumer work can resolve graph references and dated windows
without replacing base scheduling or fabricating hours.

Remaining authoritative gate: coordinator reviews the private diff/one source spot check,
integrates the adapter as appropriate with the runtime owner, then browser-checks the
candidate before swapping the live private pack. Full suite/build/runtime/save proof and
week-cost/save-size measurements belong to that combined candidate, not this offline lane.

An intermediate preservation assertion treated reference enrichment as a whole-section
change; the compiler now retains references exactly and the final assertion passes.
A diff check initially ran from the scratch checker directory; it was rerun from the repo.
No commits or Git mutations were performed. Ownership released to coordinator at this receipt.
