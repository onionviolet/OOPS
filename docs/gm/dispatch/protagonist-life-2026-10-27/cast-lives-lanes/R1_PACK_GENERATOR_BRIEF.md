# Lane brief: R1, generate the cast pack from the merged readings (SZ3, LSD142, LSD158, LSD159, MW1)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` beside P5 (P5 owns the
simulation engine files). Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); design
[LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) sections 16-18. Rules: AD36, AD44, AD45, CLR1-CLR13,
`.claude/rules/research-and-agents.md`. Publication: the generator and its test are public and name-free; the pack is
local and private (`private_packs/`, gitignored).

## Why

`private_packs/lotm-cast/cast.json` (36 people, chapters 1-24) was assembled by hand by earlier lanes (L3M, L4a-c, B1,
D1). The merged readings now hold far more (M1, M2: LOTM volume 1 has 270 distinct people; the pipeline output is in
`/tmp/m2-lotm`, rerun it with `scripts/lead_run/world_lead_pipeline.mjs` if missing). Every future book and volume
needs a repeatable pack build, not a hand merge.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Current pack sections and counts (people, places, schedule, beats, anchors, bindings, leadLife, host, reports) | 36 people | | yes |
| Merged registry persons and their lead-scene counts from the crosswalk, chapters 1-24 | 100+ | | yes |
| Pack fields with no merged source (hand-authored: host profile texts, leadLife, day bindings, district travel) | list | | yes |

## Scope and seam

- **Outcome.** `node scripts/lead_run/build_cast_pack.mjs <book> --from <loc> --to <loc> --merged <dir> --base <current pack> --out <file>`
  builds a pack from the merged pipeline output and **keeps every hand-authored section of the base pack** (the base
  wins for fields the readings cannot supply; the generator never drops them). Ids are stable: crosswalk ids, never
  row order (LSD142); renamed or merged people get an id map in the pack.
- **Tiers (SZ3, LSD126, LSD136).** Each person gets a tier from crosswalk lead-scene counts and relations: principal,
  recurring (about 30-50 for the volume), role, crowd. Never from `touchedByLead` alone.
- **Timing (LSD156-LSD159).** Routines keep place plus band; relative phrases become order edges between rows; role
  hours come from a world hours table section (create it from the merged services and rules rows with locators). Change
  the consumer-fitness routine metric in `scripts/lead_run/build_crosswalk.mjs` to count place plus band, order edge or
  role hours as usable, and report both the old and new numbers.
- **Pack revision.** Bump the pack's revision field D1 added; write a revision note listing added, changed and removed
  ids, so D1's loader can report contradicted fills (LSD134, LSD142).
- **Files owned.** New `scripts/lead_run/build_cast_pack.mjs`, `scripts/lead_run/build_crosswalk.mjs` (metric only),
  new `tests/build_cast_pack.test.js` (synthetic fixture), checkpoint `cast-lives-lanes/R1_CHECKPOINT.md`. The real pack
  output goes to `/tmp/r1-pack/cast.json` first; **do not overwrite `private_packs/lotm-cast/cast.json`**. The
  coordinator swaps it in after a browser check. Runtime reader changes needed for new sections: `R1_INTEGRATION.patch`.

## Work and done check

- Synthetic test: base hand sections survive; ids are stable across two builds and a reordered input; tiers assigned;
  an order edge from a relative phrase; revision note lists changes; the build is byte-identical on two runs.
- Real build for LOTM chapters 1-24 into `/tmp/r1-pack/`: report people by tier, routines usable (old and new metric),
  order edges, hours-table rows, and the diff against the current pack. `node scripts/check_private_cast.mjs` passes on
  the generated pack (point it at the output or run it in a scratch copy). `node scripts/lane_review.mjs` with grants.
- **Known limits (AD45).** What stays hand-authored and why.
- **Stop conditions.** A hand-authored field conflicts with merged data: keep the base, list the conflict, continue.

Do not commit. Canon names and text stay in private outputs only.
