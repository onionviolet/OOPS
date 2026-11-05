# Harry Potter lead run: start, gaps and abstractions (proposal, 2026-11-03)

Proposal under AD32; nothing here is accepted except the instruction in [USER_VISION](../../../USER_VISION.md#harry-potter-protagonist-playthrough-starts-2026-11-03). Rules applied: AD44 (lead first), AD45, AD46, AD48, AD51, LSD216 (planning outruns playable change, so this stays short), F3/F4 and JR11 of the [HP/LOTM review](LOTM_HP_LORE_AND_ENGINE_REVIEW.md). HP runs beside Klein's route and the B2-B12 mechanism lane; it takes no file those lanes own.

## What is already on disk (checked this session)

| Item | State | Evidence |
| --- | --- | --- |
| Book 1 reading | All 17 chapters read into lead-run scenes: 9 shards, 152 scenes (8, 35, 14, 12, 14, 12, 25, 25, 7). Shard `hp1c001` is grade B, lint pass, name accuracy 1.0. Grades of the other eight not checked here | `private/lead-run-2026-10-28/hp1c0*_scenes.jsonl`, `hp1c001m_header.json` |
| Books 2-7 | Shards exist for every book (hp2 through hp7), quality unchecked | same folder listing |
| Window 1 source | `hp1c001` holds 8 lead scenes, all chapter 2 (Dudley's birthday, the zoo, the cupboard). Chapter 1, the prologue, is not Harry's point of view and has no lead scene | `hp1c001_scenes.jsonl` |
| Runtime today | `book.hp.school` (original Muggle-born pupil), `book.hp.trade` (adult glass trade), a 70-day abstract term. Two `book_world_hp_*` files against about 50 `book_world_lotm_*` | `src/world_packs/book_hp_*.js`, `src/book_world_hp_facts.js` |
| Canon money | 17 Sickles to a Galleon, 29 Knuts to a Sickle; wand 7 Galleons | `passes-2026-10-23/price_census.tsv`, B1:PDF-p59, p60, p68 |

Reading cost for window 1 is $0 (already read). No new reading is needed until a window runs past what is on disk; that needs a priced AU13 plan and his yes.

## Seam probe: does Klein's pipeline run on a second world?

This is the LSD226-230 test. Columns follow AD48. "Not probed" means I did not open it.

| Piece | Status | Evidence and consequence |
| --- | --- | --- |
| `constraint_store`, `constraint_pack`, `canon_pull` | Portable | No `lotm` or `hp` string in any of the three. First HP window can use them with no brief |
| Slice runner generator (`scripts/lotm_slice/gen-runner.mjs`) | **Parametrised (G1, 2026-11-03)** | Hard-codes `private_packs/lotm-cast/cast.json` and the `book.lotm.` prefix (lines 3, 31, 41). Needs a world parameter |
| Native route driver (`scripts/playtest/native-continuation.mjs`) | **Parametrised (G1)** | Defaults to panel `lotm` and `data-lotm-*` selectors (lines 6, 19-21). Needs the panel id and attribute prefix as inputs |
| Cast pack compiler (`scripts/lead_run/build_cast_pack.mjs`) | **Parametrised (G1)** | Place logic keys on `lotm.place.` districts (lines 142-158). Rest is book-addressed. Needs an HP place-id route |
| Crosswalk builder (`scripts/lead_run/build_crosswalk.mjs`) | **Missing for HP (found by G1)** | `runtimeCatalogue` throws `world must be lotm or mol` (line 134); no HP crosswalk can be built. Task G1b |
| Household acts / place acts host | Not probed | `src/place_acts.js` and `place_act_*` look generic; the LOTM host is `book_world_lotm_cast*.js`. First task of the build lane is to find what an HP life would call |
| Lead be-seat profile for HP | **Missing** | `book.hp.school` is an original life with `preserve-dormant` compatibility and saved hashes (F3). Harry is a new profile; do not extend it |
| Locked "Not how it happened" options | Not probed | Needed from scene 2 on: 5 of the 8 window-1 scenes carry options or choices |
| Currency ledger | Missing for HP | Per-world table (AD48 item `$`): Muggle pounds, Gringotts vault, and the school purse are separate holders |
| Clock claims and anchors | Partial | HP anchors are relative days in the text ("Saturday, Dudley's birthday"); the calendar year is not in the book (default: time by order and events, dial: hours where the text gives them, reason: AD timing line) |

## Gaps and abstractions

Codes G1 onward. Disposition: ACT NOW (window 1 needs it), ACCOUNT FOR NOW (design constraint, no build), LATER.

| Code | Gap | Disposition | Owner and done check |
| --- | --- | --- | --- |
| G1 | Pipeline portability (the three Missing rows above) | ACT NOW | One implementer, world parameter in `gen-runner`, `native-continuation`, `build_cast_pack`. Done: the existing LOTM runner output is byte-identical, and the HP runner starts a fixture |
| G2 | Harry as a new lead profile: child (eleven in book 1, ten at the open), legal guardians, no income, a cupboard as home | ACT NOW | New profile in a new pack file. Body, life stage and custody use existing owners; check against `GENETICS_AND_HERO_START_PLAN` |
| G3 | Prologue and the ten-year skip | ACCOUNT FOR NOW | Narration grain (LSD209). Harry does not know chapter 1; observer-safe projection must keep the reader-only facts out of his notebook |
| G4 | Accidental magic before any instruction (the glass vanishing) | ACT NOW | Source-side faculty with no learned method, existing split of faculty versus instruction (F2, LR2-H1). Canon run decides the outcome; no mechanism is invented |
| G5 | Canon school-year calendar beside the abstract 70-day term | ACCOUNT FOR NOW | Window 1 is summer, so it needs no calendar. First needed at the train. Add without touching existing saves (PL-A3); order and events, no invented year |
| G6 | Individually distinct wand (LR2-H1 reopen trigger fires at the wand shop, book 1 chapter 5) | LATER, first at window 3 | One instrument, one event, one counterexample, as LR2-H1 specifies. Not a wand-lore system |
| G7 | Separate purses and an institution currency (pounds, vault Galleons, later house points) | ACCOUNT FOR NOW | ECX6 and ECC25 already say one authority per currency. House points reuse the Merit shape, not its numbers |
| G8 | Fame as knowledge asymmetry (strangers know him, he knows nothing of them) | ACCOUNT FOR NOW | Observer projection plus event news; first needed in chapter 5. Back-test that it cannot leak to an NPC who was not there |
| G9 | The Sorting as a canon choice with a locked alternative | LATER | Window at the school; uses the locked-option row |
| G10 | Owl post as a delivery channel for letters | LATER | Existing news and delivery owners; the letter arrives in chapter 3 |
| G11 | Cast depth: the Dursleys are full lives, the zoo crowd is not | ACCOUNT FOR NOW | Tiers LSD126-LSD137. Dursleys full, Piers and the director thin, the boa a named non-human |
| G12 | Speaking with animals (a Parseltongue exchange) | ACCOUNT FOR NOW | Language and communication owner, not a power flag. Do not assume it is a trained skill or a gift without the book's own wording |

Mechanics tied to the source world stay local (wands, house points, the Sorting). Shared seams (custody, provenance, jobs, observer projection, locked options) come from the existing owners per AD51; HP validates them as the second world and may revise them.

## Window 1 proposal: the zoo Saturday

Boundary: `hp1c001`, chapter 2, 8 scenes, from the cupboard waking to the cupboard that night. It exercises the child body under guardian custody, a family with full schedules, a day with a clear order, five choice or option rows, the glass-vanishing beat (G4), and the punishment, all without a single new mechanic beyond G1, G2 and G4.

Done check (AD43 floor, plus AGENTS.md): rebuilt bundle, fresh origin, 1920x1080, actual 14/21 px; every canon step reachable with untaken options shown locked; save, reload and literal import; the window run again from a second-world fixture without an `isLead` check. Anything not run is "implemented, below floor".

## Open items before building

1. Is the HP sweep worth checking at grade level for the other eight book-1 shards before windows 2 onward? Cheap and local.
2. Who writes: one Sonnet implementer at high effort for G1 (runtime-adjacent, separate from content), then one content builder for the window. Both go through `start_session`.

## Reconciliation after G1 (2026-11-03)

| Claim | Evidence reached | Gap |
| --- | --- | --- |
| Three tools take the world as input, LOTM defaults unchanged | Focused tests re-run on the current tree by the coordinator: `tests/world_portable_tools.test.js` plus `tests/build_cast_pack.test.js`, 21 pass, 0 fail. Byte-identity of the kj3t runner and the cast-pack hashes are the implementer's report in [the receipt](HP_G1_PORTABILITY_RECEIPT.md), not re-run here | Source-edited and focused-tested just; not built, not in a browser, not committed, not human-reviewed |
| HP fixture runs the tools | Generator and stub-page level (default scope of that check) | No HP panel existed then, so the route driver had not touched a real HP page (window 1 later did) |
| G1b crosswalk seam | [Receipt](HP_G1B_CROSSWALK_RECEIPT.md); coordinator re-ran the three crosswalk/cast/portable test files on the current tree, 41 pass, 0 fail. lotm/mol hashes and the HP 26-id result are the implementer's report | HP canon ids map to nothing yet (26 proposed `new:`); no Harry persona alias; CLI write of `crosswalk.json` for HP not run |
| G2 Harry profile | [Receipt](HP_G2_PROFILE_RECEIPT.md); coordinator re-ran `hp_lead_life` and `world_pack_registry` tests. `book.hp.school` hash unchanged is the implementer's report | Implemented, below floor (AD43): `registerHpLeadDomain` is not called from `main.js`, so `project('hp')` is empty in a real page; the lead start is not in the beginnings list; one stub act just; not rebuilt, no browser |

Window 1 content waits for G1b, G2 and the HP panel test hooks (`simulationTestHooks.project('hp')` with `arc.next`), which no one has checked.

Next parts, in order: (1) wire the panel domain and the beginnings entry (two shared files, one writer); (2) author the 8 window-1 acts from the scenes through the crosswalk and cast pack; (3) rebuilt native proof at 1920x1080 with save, reload and literal import. Parts 2 and 3 need part 1.

Own-holdings display for the other non-native lives (from O1/O2 A1): [plan](OWN_HOLDINGS_PLAN_2026-11-03.md), proposal; P1 built, P2 in progress.

Whole-world window map (book 1 windows W1-W10, gap placement, books 2-7 coarse): [HP_WHOLE_WORLD_PLAN](HP_WHOLE_WORLD_PLAN_2026-11-03.md), proposal. Open item 1 above is answered there: eight of nine book-1 shards are grade B with lint pass, `hp1c011` is C with lint fail.


## Current-use reconciliation B102, 2026-11-04

Full probe read closes any prior sampled residue. Its old missing profile/crosswalk/panel and waiting-for-W1 route are superseded by G1/G1b/G2/W1–W4 and B100/B101 dispositions, not current work to relaunch. “Portable” based on absent world-name strings is a candidate seam, not semantic proof. Locally held/previously read sources remove acquisition needs, not review/model/time cost. Later whole-world map and repair settle header-grade placement at structural scope. G6’s original “window 3” is outdated: actual wand consumer is W4/ch5. G10 receiving/carrier facts remain distinct from delivery simulation; G11 tier labels are not all scheduled full lives; G12 does not infer a trained skill from a descriptive label. Current accepted direction and file ownership govern any next work, with no fresh session or source pass launched here.
