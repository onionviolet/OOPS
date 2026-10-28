# Lane brief: G2, hide a thing in a container and what others can notice (CL210, CL214)

Model: `gpt-6.1-sol`, medium. Runs locally in `/Users/weiwei/code/yet-another-idle-rpg` after G1 is
committed (it reads G1's knowledge writes). Card: [CAST_LIVES_CARD](../CAST_LIVES_CARD.md); plan
section 22 (CL214-CL220) governs. Rules: `.claude/rules/runtime-code.md` (AR1-AR16),
`.claude/rules/player-ui.md` (UR1-UR75), AD5, AD6-AD8, AD38, AD43. Target viewport 1920×1080;
mobile deferred. CLR codes applied: CLR1-CLR4, CLR6, CLR7, CLR9-CLR13.

## Data probe (CLR2)

Before editing, count and record. Stop only on a gate row under half its expectation.

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Rows in the private combined ledger (`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l5r-ui-replay-2026-10-28/combined_gaps.jsonl`) whose reason names hiding or concealment | 2 | | yes |
| Places in the beside life with a furnishing that can hold an item (pack data or the place's existing affordances) | 1 or more | | yes |
| Cast records with a home place shared with the player's reachable places | 1 or more | | no |

If no place has a container in pack data, add the minimum container fields to the private pack for the
places the two ledger rows name, labelled `fill` with a basis (CLR5), and record it.

## Scope and seam

- **Player sentence (PRF2).** At a place with a container: "Hide [item] in [container] · 2 min. Someone
  who searches or uses this [container] may find it." When it cannot run: "Nothing here can hold [item]"
  or "You are not carrying anything that fits". Later, when a person finds it, Reports says so at the
  player's witness level (RPT2); the person view shows what they now know.
- **Mechanism (PRF4, AD38).** A hidden item stays in the world's one item or location authority (find it;
  no second store, CLR10, AR3) with a concealment record: who hid it, when, where, and how well
  (a small number from the container and the time spent). Noticing is a check on the people whose
  schedule or a beat puts them using or searching that container: chance from how well it is hidden,
  how hard they look, and how familiar they are with the place. A find writes knowledge through G1's
  beat-knowledge seam for that person, dated, with the find as its basis (AD6-AD8). Not found means
  silent: they do not know, never "they know it is absent" (CLR4).
- **Ordinary route (PRF3, CL215).** Default: one hide action and passive noticing by people who use
  the container on their schedule. Dial per world: search intensity, household familiarity, magic or
  tools that sense hidden things. One fitting exception with reason and cost: a deliberate search (a
  person with a reason to look) raises the chance and takes their time.
- **Second case (CL214).** The basis is an ordinary player's day in any world: hiding contraband, a
  gift or evidence at home from the people who share it. L5r's later concealment scene is a candidate
  only (its checkpoint calls it not yet source-proven); do not build for it. Build the verb world-general; the LOTM beside
  life is the first consumer, through the same seam other panels can call.
- **Files owned.** New `src/concealment.js` (name-free); hunks in `src/book_world_lotm_cast_host.js` and
  `src/book_world_lotm_ui.js`; private pack fields under `private_packs/lotm-cast/` for container
  places; `tests/concealment.test.js` (synthetic, no canon names); checkpoint
  `cast-lives-lanes/G2_CHECKPOINT.md`. For a needed hunk outside these, write
  `cast-lives-lanes/G2_INTEGRATION.patch` and continue.
- **Publication class (CLR3).** Engine, UI and tests public and name-free; container and place data
  in the private pack; screenshots private
  (`docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-28/`).
- **Save and economy (CL220, AR6).** New save fields: concealment records (additive; old saves load
  with none). No money flow. The four original LOTM starts are unchanged; state that with a check.

## Work and done check

- **Failure case.** Hiding with nothing carried, at a place with no container, or while walking keeps
  state untouched and shows the reason line (FLR3).
- **Verification.** Focused test `node --test tests/concealment.test.js` covering: hide succeeds and
  stores one record; a non-user never finds it; a scheduled user finds it at a rate that rises with
  search intensity (seeded); a find writes one dated knowledge entry for the finder and none for others;
  save round trip keeps the record. Run `scripts/lane_review.mjs` with your grants. Rescore L5r's
  concealment step and the L4b concealment row in your checkpoint (expected: the step reproducible
  through the UI, the aftermath row narrowed).
- **Done when.** Focused tests pass, `npm run check:arch` shows no growth, and the checkpoint has
  FLR1-FLR6 lines. Browser proof is the coordinator's (the sandbox blocks Chrome): name the clicks
  for it (hide, wait for the user's scheduled visit, see the Reports line and the person view).
- **Stop conditions.** No item or location authority can carry a concealment record without a second
  store: stop and describe the seam you would need.
- **Known ambiguities default (CLR12).** Which items fit: anything the player carries that is not worn,
  unless the container declares a size. Chance numbers: pick a small readable table in the module and
  label it a proposal. A beat in the pack that already says someone finds the item settles as a find.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
