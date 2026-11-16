# Reverend Insanity move to claims join (2026-11-16)

GKM427 first step: a local, deterministic join of every Gu move in the private review index to the paid reader claims in `docs/research/novels/full-book/reverend-insanity/readers/*-CLAIMS.json`. It labels nothing. It finds which claims a later Haiku pass should read to settle each move's component Gu and roles.

Rerun: `node scripts/ri_move_claims_join.mjs` (needs the gitignored review index). Output: [MOVE_CLAIMS_JOIN.json](MOVE_CLAIMS_JOIN.json), with one row per move (matched claim ids, chapters and blocks, and the catalogue Gu kinds those claims name as "<name> Gu").

## Result

| Measure | Count |
| --- | ---: |
| Reader claims searched (164 files, ch1 to 2334) | 7,196 |
| Wiki move leads (`blocked:roles-unknown`) | 753 |
| Leads with at least one matching claim | 534 |
| Leads whose claims name a catalogue Gu kind | 191 |
| Mortal-tier leads, and those with claims | 48, 38 |
| Distinct claims for the Haiku pass to read | 1,688 |

By wiki tier: immortal 338 of 462, mortal 38 of 48, unrecorded 67 of 124, no tier 91 of 119.

## Limits

- Matching is by name. Generic move names ("Familiar Face", "Light Injuries") can match ordinary prose, so a match is a reading pointer, not evidence.
- A candidate kind means the claim names that Gu near the move, not that it is a component. Claims are paraphrases: a role the paraphrase dropped needs the chapter itself.
- 219 leads match no claim. They stay leads until a chapter pass or the wiki pass (GKM444).

## Next

Haiku batch over the 1,688 claims, mortal tier and Fang Yuan's range (ch1 to 140) first (GKM435). Freeze a held-out split before the pass (GKM429), and record whether each role comes from a character's claim, a demonstration or the narrator (GKM430).
