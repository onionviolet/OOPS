# X2 checkpoint: place and person resolution, 2026-10-29

Status: offline mapping/tooling completed; agent-verified, not human-reviewed. No runtime source or pack rows changed. Rules: AD36, AD44, CLR1–CLR4, CLR12, LSD151.

## Probe (CLR2)

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| M4 lead scenes, chapters 1–24 | Count | 418 scenes, 1,491 steps | Pass |
| Distinct reader places / people | Counts | 290 / 184 | Pass |
| Live pack people / places | Loads | 36 / 45 | Pass |
| R1 candidate people / places | Loads | 92 / 76 | Pass |
| Crosswalk and registry | Load and identify keys | `places`/`mapping`; registry 12,294 rows | Pass |

## Resolution

Place joins use existing crosswalk IDs, exact registry and pack aliases, then the most specific explicit comma/semicolon component present in those aliases. Unmatched text remains unresolved. Person joins use registry reader IDs, pack `indexId`, and pack redirects. No fuzzy-name guesses are made.

| Pack | Place refs before | Place refs after | Person refs before | Person refs after | Walk controls | Talk controls | Resolved-person talk candidates |
|---|---:|---:|---:|---:|---:|---:|---:|
| Live | 235/1,491 (15.76%) | 309/1,491 (20.72%) | 153/4,164 (3.67%) | 1,485/4,164 (35.66%) | 7 | 0 | 123 |
| R1 candidate | 253/1,491 (16.97%) | 340/1,491 (22.80%) | 153/4,164 (3.67%) | 1,538/4,164 (36.94%) | 6 | 0 | 123 |

Before counts apply the prior direct crosswalk-target-to-pack-ID join. The supplied X1 controls index has an empty `talks` map, so person resolution yields talk candidates but cannot create a UI action. Top unresolved place IDs are opaque hashes of private source strings; counts are scene-step references. Top unresolved person IDs are reader IDs. For the live pack, leading unresolved places: `unresolved-place:20415fa0de073be2` (41), `unresolved-place:00dc4402b0bf1e95` (38), `unresolved-place:1dd63ac3383ed91f` (28), `unresolved-place:5cefec22c4521070` (17), `unresolved-place:dff8d21de99eadb5` (17). Leading unresolved people: `lotm.person.audrey-hall` (169), `lotm.person.amon` (150), `lotm.person.alger-wilson` (150), `lotm.person.derrick-berg` (141), `lotm.person.fors-wol` (118). The candidate has the same leading unresolved IDs and counts.

Private mapping rows and reports (including unresolved source strings) are under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x2-resolution-2026-10-29/`.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_replay_mapping.test.js` | PASS, 4 tests; includes containing place, alias, unknown gap, and string-form M4 people | Focused tooling tests only |
| Generate `live-pack-chapters-1-24.json` using `/tmp/m4-lotm/merged/{scenes,crosswalk,registry}`, X1 controls and live pack, chapters 1–24 | PASS, 418 scenes / 1,491 steps; 7 walks, 0 talks | Talk UI control absent; 123 resolved-person talk candidates |
| Generate `candidate-pack-chapters-1-24.json` using same inputs and `/tmp/r1-pack/cast.json` | PASS, 418 scenes / 1,491 steps; 6 walks, 0 talks | Talk UI control absent; 123 resolved-person talk candidates |
| `git diff --check -- scripts/lead_run/build_replay_mapping.mjs scripts/lead_run/build_crosswalk.mjs tests/build_replay_mapping.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/X2_CHECKPOINT.md` | PASS | No runtime/browser proof in this offline tooling lane |

The older pack has incomplete identity coverage relative to R1's candidate. This lane only maps existing rows and leaves unresolved joins visible; pack reconciliation remains with its owner. No commit or push was performed.
