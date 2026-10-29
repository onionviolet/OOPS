# X4 checkpoint: whole-book replay gap census

Status: volume-aware mapping and private census completed; agent-verified, not human-reviewed. Offline mapping/tooling only; no runtime or pack changes. Rules: AD36, CLR1–CLR3, CLR6–CLR7, CLR12.

## Data probe

| Input | Expected | Observed | Result |
|---|---:|---:|---|
| M4 lead-step inputs | Eight volumes, thousands of steps | Eight volumes, 11,159 selected steps | Pass |
| Chapters 1–24 comparison baseline | 1,491 steps | 1,491 steps | Pass |
| Mapping ranges | Every volume range generated or recorded as a failure | 19 ranges generated; 0 failed | Pass |

The mapper now accepts `--from-locator` and `--to-locator` bounds such as `zh b2 第1章` and `zh b2 第100章`; volume 1 uses `zh 第1章`. Existing `--from`/`--to` chapter-only callers remain supported. Whole-book generation used 100-chapter ranges, clipped to each volume's observed final chapter. The private runner loaded M4 `scenes.jsonl`, `crosswalk.json`, `registry.jsonl`, X1 `controls.json`, and the live cast pack, then called `buildReplayMapping` once per range. A CLI sample of volume 1, chapters 1–100, returned 396 scenes / 1,130 steps.

Mapping files, `range_failures.json`, `census.json`, and the chapter 1–24 comparison are private under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x4-whole-book-mapping-2026-10-29/`. Census rows are deduplicated by step ID across ranges; none overlapped in this run. Public code, tests and this checkpoint contain counts only.

## Chapters 1–24, prior mapper and X4

The prior row counts are from X3's generated output on the same 1,491-step range. Gaps exclude mapped acts, walks, wait intentions and talks.

| State | Steps | Acts | Walks | Waits | Talks | Gaps by class |
|---|---:|---:|---:|---:|---:|---|
| X3 prior mapper | 1,491 | 7 | 28 | 165 | 117 | ritual 97; socialize 124; unknown 95; other 219; rest 43; trade 92; travel 115; research 74; fight 51; work 36; study 103; practice 24; appraise 70; craft 19; care 12 |
| X4 mapper | 1,491 | 7 | 28 | 159 | 130 | ritual 99; socialize 116; unknown 87; other 213; rest 43; trade 96; travel 124; research 74; fight 51; work 36; study 101; practice 24; appraise 71; craft 20; care 12 |

The additional matches use existing talk controls for explicit social verbs with a resolvable present person, and existing walk controls for explicit movement verbs with a resolvable destination. Generic `other`/`unknown` rows are reclassified only when their verb clearly supports one of those existing classes. Unresolved people and places, and actions needing a different control, remain typed gaps.

## Whole-book ranked gap table

Share is each class's portion of the 10,047 gap steps. The private census contains counts by volume, reason split, and up to 40 normalized verb phrases per class.

| Rank | Class | Gap steps | Share |
|---:|---|---:|---:|
| 1 | other | 1,853 | 18.44% |
| 2 | ritual | 1,191 | 11.85% |
| 3 | travel | 1,167 | 11.62% |
| 4 | socialize | 982 | 9.77% |
| 5 | study | 795 | 7.91% |
| 6 | fight | 693 | 6.90% |
| 7 | appraise | 633 | 6.30% |
| 8 | research | 585 | 5.82% |
| 9 | trade | 571 | 5.68% |
| 10 | rest | 486 | 4.84% |
| 11 | work | 377 | 3.75% |
| 12 | practice | 240 | 2.39% |
| 13 | care | 198 | 1.97% |
| 14 | craft | 178 | 1.77% |
| 15 | unknown | 98 | 0.98% |

Reason split: missing verb 0; missing place/person 466; missing UI path 9,581. Mappings and reason labels are census inputs, not gameplay coverage evidence.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_replay_mapping.test.js tests/lead_replay_score.test.js` | PASS, 13 tests | Synthetic mapping and scoring only |
| `node --check scripts/lead_run/build_replay_mapping.mjs` | PASS | Syntax only |
| `node --check scripts/lead_run/gap_census.mjs` | PASS | Syntax only |
| Volume-aware CLI generation, volume 1 chapters 1–100 with M4/X1/live-pack inputs | PASS, 396 scenes / 1,130 steps | One real-data range; offline mapping only |
| Whole-book mapping runner over volume/chapter ranges | PASS, 19 ranges / 11,159 steps / 0 range failures | Offline mapping only; not browser or gameplay proof |
| `node scripts/lead_run/gap_census.mjs --mappings <private-x4-dir> --failures <private-x4-dir>/range_failures.json --out <private-x4-dir>/census.json` | PASS, 10,047 gaps; all 8 volumes represented; 0 failed ranges | Private report; no gameplay coverage claim |

No build or browser replay was run because this is a private-data mapping/tooling lane. No commit or push was performed.

## Resume 1: actor filter and command families

Status: **lead-only lane ranking blocked by missing actor data**. Agent-verified tooling and a provisional census are available for coordinator review. The M4 scenes have a scene POV, but all 11,168 steps in `lead` POV scenes lack both step `actor` and step `pov` fields. A scene POV does not identify the actor of every step. Among 11,159 ranged steps, the mapper therefore tags 0 confirmed lead actors, 0 confirmed non-lead actors and 11,159 unknown; the 11,141 current gaps are all actor-unknown. Zero tagged non-lead steps is not a claim that none exist. Two additional lead-POV scenes contain nine steps without a chapter locator and remain outside the ranges. Another 348 candidate-persona POV scenes contain 1,165 steps with a chapter locator; they are outside this literal-`lead` POV mapping and their identity links require separate review. M4's stricter locator selection reported 346 candidate-persona scenes.

Resume 1 corrects the previous mapping census: a scene's first action is no longer folded into a walk solely because its place changed; a topic-specific exchange or an ambiguous person is no longer folded into a greeting; and a payment cannot match a different local pay act solely because it is the only pay act there. A walk or return can use an existing control when its explicit destination resolves to the scene place; a plain walk can also use a resolved place object. Against the prior mapping, one gap became a candidate walk and 1,095 prior folds returned to gaps (1,000 talk, 86 walk, nine acts). The remaining 18 candidate folds are actor-unknown. These are mapping classifications, not proven lead actions or gameplay coverage.

The private `resume-1/census.json` lists each family member, per-volume family counts, reason splits and the ordered head-verb/object rules. It also lists the following possible cheap-control gaps: wait 141, walk 18, return to a resolved place 0, pay 0 and talk 1. The wait control requires a concrete offered game minute; M4 has no numeric step time. The listed walks need destination or route evidence, and the listed talk needs its specific conversation rather than a generic greeting. These candidate counts are actor-unknown and require source review. They are not 160 verified lead-action fixes.

The following table clusters **actor-unknown gaps**, so it is a working hypothesis for lane design, not a lead-only ranking. The rules cluster 7,994 of 11,141 gaps (71.75%); 3,147 (28.25%) remain unclustered. The 70% target for *lead-actor* gaps cannot be assessed until actor attribution is recovered. The family rules use lexical head and object types; source review is needed before converting any row into an action.

Reason codes: **R1** no matching control established; **R2** an available control's place, person or item is unresolved; **R3** the available control implements a different mechanism; **R4** the wait control exists but the target game time is unresolved. These are rule-based triage labels, not proof that the entire runtime has been exhaustively inventoried. The private census carries the per-family splits. H1 fit is based on `definePlaceActs` and `householdActs`: fixed place-bound operations can use authored costs, effects and reports, while dynamic actors, targets and mechanisms need their own owners.

| Family | Actor-unknown gaps | Main reason | H1 fit |
|---|---:|---|---|
| Speak or ask | 1,196 | R2 1,037; R1 123; R3 36 | New dialogue mechanism for topics and choices; the existing control records a brief greeting. |
| Travel or move | 1,107 | R3 869; R2 225; R1 13 | Existing walks handle a resolved walking destination; other routes and means need their own mechanisms. |
| Handle or move an item | 897 | R3 896; R2 1 | H1 can carry fixed local object acts; general custody and dynamic targets need an item mechanism. |
| Reason or plan | 832 | R1 832 | A decision and knowledge mechanism is needed; a fixed place-act report cannot establish the reasoning. |
| Observe or listen | 555 | R1 555 | H1 can describe a fixed local inspection; perception of changing people and events needs observation logic. |
| Inspect or investigate | 530 | R3 527; R2 3 | H1 can inspect an authored local object; dynamic evidence and investigation require their own consumer. |
| Make or write an item | 364 | R3 364 | H1 can carry fixed authored work; variable materials, recipes and written content need making or writing mechanisms. |
| Rest or personal care | 344 | R3 337; R2 7 | H1 can carry fixed local care acts; sleep and changing bodily needs need their existing or extended systems. |
| Agree or refuse a proposal | 311 | R3 311 | Dialogue and commitment state are needed to preserve the parties, choice and consequences. |
| Change or maintain state | 284 | R3 284 | The affected state needs its owning mechanism; a fixed local act cannot stand in for every effect. |
| Divination or ritual | 232 | R3 232 | A ritual and divination mechanism must model means, costs and results. |
| Exchange a message | 175 | R3 175 | H1 can stage fixed local reading or writing; delivery and recipient state need a messaging mechanism. |
| Trade or pay | 164 | R3 164 | H1 can settle a fixed local payment; general prices, counterparties and transfers need trade logic. |
| Wait for a time or event | 162 | R4 162 | The existing wait mechanism is the fit once a valid target time is established; H1 is unnecessary. |
| Fight or evade | 161 | R3 161 | Conflict requires combat state, opposing actions and outcomes beyond a place act. |
| Paid transport | 161 | R3 161 | Transport needs a route, conveyance and fare; a walk or meter payment does not supply them. |
| Use an ability | 160 | R3 160 | Ability execution needs its own means, targeting and effect rules. |
| Read a text | 128 | R3 128 | H1 can expose a fixed local report; reusable text and learned knowledge need a reading consumer. |
| Direct another actor | 127 | R1 127 | A task and actor-response mechanism must retain who was directed and what they do. |
| Obtain or learn information | 104 | R1 104 | Knowledge and skill consumers must record the acquired result and its basis. |
| Unclustered | 3,147 | R1 3,146; R2 1 | Review the source and assign a family before choosing an implementation. |

Actor-unknown gaps by volume: 2,734; 2,137; 1,965; 1,631; 1,291; 682; 380; 321. The private census provides the family breakdown for each volume. Next evidence needed: extract explicit step actors from cited passages, keep unresolved persona identities separate, regenerate, then rank the confirmed lead-actor families.

### Resume 1 checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/build_replay_mapping.test.js tests/replay_mapping_household.test.js tests/lead_replay_score.test.js` | PASS, 22 tests | Synthetic mapping, actor and census behavior; no source attribution or gameplay proof |
| Whole-book mapping runner with M4/X1/live-pack inputs | PASS, 19 ranges, 11,159 steps, zero failed ranges | Literal lead-POV scenes only; actor fields absent; two no-chapter scenes excluded |
| `node scripts/lead_run/gap_census.mjs --mappings <private-resume-1> --failures <private-resume-1>/range_failures.json --out <private-resume-1>/census.json` | PASS, 11,141 actor-unknown gaps, 7,994 clustered | Heuristic family and cause labels need source review; no confirmed lead-only ranking |
| `node --check scripts/lead_run/build_replay_mapping.mjs` and `node --check scripts/lead_run/gap_census.mjs` | PASS | Syntax only |
| `git diff --check` on granted tracked paths | PASS | Whitespace only |
| `node scripts/lane_review.mjs` with the X4 grants and touched tests | PASS | Static publication and scope review only |
