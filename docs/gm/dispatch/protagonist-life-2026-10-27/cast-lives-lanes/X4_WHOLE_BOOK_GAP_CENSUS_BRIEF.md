# Lane brief: X4, whole-book replay mapping and gap census (ranks the mechanism lanes)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force
or push. Read first: [X3_CHECKPOINT](X3_CHECKPOINT.md) (exact generator command and inputs), [X1](X1_CHECKPOINT.md),
[X2](X2_CHECKPOINT.md), [V2](V2_CHECKPOINT.md), [M4](M4_CHECKPOINT.md). Rules: CLR1, CLR2, CLR3, CLR6, CLR7, CLR12.
Publication: script and tests public code (name-free); mapping outputs and the census are private research under the
private lead-run folder `x4-whole-book-mapping-2026-10-29/`; the checkpoint lists counts only, no canon names or text.

## Why

Whole book is read (M4: 8 volumes, 3,444 lead rows) but the generator has only run on chapters 1-24. Mechanism lanes
are expensive; we rank them by how often each verb class appears over the whole book, and fix cheap mapping gaps first.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Lead steps per volume from the M4 output | 8 volumes, thousands | | yes (volumes present) |
| ch1-24 gaps by class (other 227, socialize 182, travel 117, study 109, unknown 107, trade 105, ritual 102, research 82, appraise 73, fight 51) | as listed | | no |

## Scope

- Owned files: `scripts/lead_run/build_replay_mapping.mjs`, a new `scripts/lead_run/gap_census.mjs`, focused tests,
  `cast-lives-lanes/X4_CHECKPOINT.md`. No `src/`, no `private_packs/`.
1. Make the generator run on any chapter range across all eight volumes (volume-aware locators, if M4 output needs it).
   Generate the whole book in arc-sized ranges (about 100 chapters) plus ch1-24; write outputs privately.
2. Cheap matching fixes where an existing be-seat control already covers the step (the controls inventory is the
   authority): widen the talk/speak verbs (socialize steps with a resolvable present person), travel steps that are
   walks to a resolvable place, and "other"/"unknown" steps whose text supports an existing class. Never add a generic
   or lossy control (CLR6): unmatched stays a typed gap.
3. `gap_census.mjs` reads the mappings and writes a private census: gaps by class, by volume, and the top 40 normalized
   verb phrases per class with counts, plus the reason split (missing verb, missing place/person, missing UI path).
   Print a one-screen ranked table (class, whole-book steps, share) in the checkpoint, counts only.
- Failure case: a volume or range that fails to generate is recorded as a typed finding, not skipped silently.

## Done check

Focused tests pass (`node --test` on the touched tests plus `tests/lead_replay_score.test.js`); ch1-24 counts before/after
(acts, walks, waits, talks, gaps by class); whole-book totals and the ranked table; `node scripts/lane_review.mjs` with
your grants. One line per check. Ambiguity default (CLR12): when text fits two classes, keep the existing class.
