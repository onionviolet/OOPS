# World atlas as a translation layer: proposal (2026-11-20)

**Status: proposal, not an accepted decision.** Weibao asked two things. Can the atlas be updated from what the library has read? Can it become an easy translation layer between the books and the game, in both directions? The [Sol brief](../gm/dispatch/play-surface-2026-11-14/ATLAS_CANVAS_SOL_BRIEF_2026-11-20.md) waived connecting the atlas to play. This proposal reopens that waiver deliberately and needs his yes.

## What exists today (verified 2026-11-20)

| ID | Finding | Evidence |
| --- | --- | --- |
| F1 | The atlas shows the game, not the library. It is a read-only projection of runtime definitions: living kinds, Moss, home places, the MOL and HP packs, the HP lead pack, Tingen districts and the Village map. | `prototypes/world-atlas/entity-library.mjs`, `native-map.mjs`, `serve.mjs` |
| F2 | The atlas is missing much of the game too. Gu keeper (about 35 `world_packs/book_gu_*` files), Shadow Slave, Paradise/Goa, primordial and most of LOTM outside Tingen have no atlas reader. | `ls src/world_packs`, `src/book_world_*` |
| F3 | **Corrected.** The book-to-game join is the private cast pack, not the crosswalk. The crosswalk's `places` values are reader registry ids (`lotm.place.<slug>`), not game ids, so the first draft's "794 of 5,247 resolve" counted the wrong thing. `private_packs/lotm-cast/cast.json` carries `indexId` on every place and person. It covers all 1,507 registry places, plus 14 more, and 1,500 people. | `private_packs/lotm-cast/cast.json`, joined to the whole-book `registry.jsonl` locally |
| F4 | **Corrected.** The gap is reachability, not identity. Of 1,516 LOTM cast places, 348 have a walk district and 1,168 have none. Many of those belong to other cities with their own region supplements. The parent chain under `lotm.place.tingen` holds 61 places, and 9 of them have a district. MOL's cast has 23 places and 22 people. | Same file, parent-chain walk |
| F5 | Book-to-game compilers exist. `build_cast_pack` builds pack places from the registry and takes authored `--base` places whose `travel.district` is inherited down the parent chain. `build_place_acts` and `build_journeys` add acts and travel. The shipped `cast.json` also has keys `build_cast_pack` does not produce (bindings, host, journeys), so running the script by itself would drop those keys from the live pack. | `scripts/lead_run/build_cast_pack.mjs:150-190` |
| F6 | An atlas-to-game precedent exists. `authored_site.js` validates a bounded draft (`DRAFT_FIELDS`), compiles it through `validatePack` and exports a file. The atlas server already exposes `/export` for it. | `src/authored_site.js`, `serve.mjs` |
| F7 | The atlas files are untracked. The coordinator session keeps them ([handoff](../gm/dispatch/play-surface-2026-11-14/HANDOFF.md) line 19). The Sol lane finished with screenshots in `docs/representations/evidence/world-atlas-2026-11-20/`. | `git status`, lane `LAST_MESSAGE.md` |

In short, most of the pipes for both directions exist. They are not connected, and the atlas looks at only one end.

## Proposed shape

**D1 (revised). The cast pack the game loads is what the atlas reads. An authored placement overlay is the writeback.** The atlas never writes `src/` or the live pack.

- **Game to atlas:** project the pack the game loads (`loadPrivateCast` plus `withCities`). Each place gets one of three states: **walkable** (has `travel.district`), **in game, unplaced**, or **outside the slice**. Each also shows its source evidence label (T, S, I or U) and its locator.
- **Books to atlas:** comes free through `indexId`, because the pack already holds every registry place.
- **Atlas to game:** a placement pick (district or parent) writes an authored overlay. `build_cast_pack --base` turns it into inherited districts. Merging that output into the live pack is a separate gate, because of the extra keys noted in F5.

**Rejected:** O1, the atlas writing packs directly (it skips the compilers' source-location checks). O2, a new universal schema for all worlds (the [library atlas](LIBRARY_BUILD_ATLAS_2026-11-20.md) defers one until a build question needs it). O3, importing the 7,193 LOTM entities wholesale (it floods the canvas and none of them are reviewed).

## First slice

**A1. Tingen places, with MOL as the second consumer.**

1. Read-only first: a containment canvas over the loaded LOTM cast, with drill-down and the three states. MOL uses the same reader.
2. Prove the writeback seam in scratch. Rebuild with `--base` set to the current places and expect a zero diff. Then add N district picks and expect exactly N changes plus the descendants that inherit them.
3. Add a writeback UI only after step 2 passes.

**Done means:** a screenshot of the book-worlds canvas, the scratch diff counts, and nothing derived from `private/` committed.

## Constraints

- Run locally (`127.0.0.1`), because the packs are private. The atlas surfaces ids and locators, not source prose, because raw text stays private (SKR18). Crosswalk and review files stay under `private/`.
- Player UI rules route here (`.claude/rules/player-ui.md`: UR6, UR163, UR158, UR167, UR169 and others). The box-canvas reference stays the visual floor (UR177). Source-only nodes need a distinct legend entry.
- The atlas has one writer, the coordinator session. Covering F2 and the A1 slice can be one lane, or two if the F2 readers stay in `entity-library.mjs` and the review UI lives in a new module.

## Open questions

- **Q1.** Should a source-only node appear on the main canvas, or behind a "from the books" toggle? Recommended: a toggle, off by default.
- **Q2.** Should HP get a crosswalk run first, or wait until a build question needs one?

## Built 2026-11-20 (read-only direction)

Weibao said go on A1, all the Village locations and other content. Three atlas views landed in `prototypes/world-atlas/` (untracked, as before). Nothing writes back yet.

- **Book worlds** (`cast-places.mjs`, `book-worlds.mjs`). Reads the LOTM and MOL cast packs through the game's own `loadPrivateCast` and `withCities`. Shows a containment canvas with drill-down, search, evidence label, locator, book id and the people seen at each place. LOTM: 1,525 places. 296 are walkable with a district from the book, 87 are walkable with a provisional district (`fill`, or a proposal with no provenance), and 1,142 are not on any walk yet. MOL uses the same reader and walks through its own host, so it shows no district states.
- **Other game places** (`other-places.mjs`, plus `native-map.mjs` now also emits `others`). The game registers 239 locations, and the Village walk reaches 79. The other 160 are grouped by owner: Reverend Insanity 41, private test packs 34, Harry Potter 33, Frontier places not reached from the Village 14, Reincarnation Paradise 13, Mother of Learning 10, LOTM 5, Proto23 5 and Shadow Slave 5.
- **Proof.** `work/atlas-books-1120/prove.mjs` ran in headless Chrome at 1920×1080 and exited 0, with no page errors apart from the favicon 404. Screenshots are in `docs/representations/evidence/world-atlas-2026-11-20/`: `book-worlds-top.png`, `book-worlds-tingen.png`, `book-worlds-mol.png` and `other-game-places.png`. The Village canvas still shows 79 boxes.

**Findings from the build.** F8: within Tingen City, most districts and streets are in the game but not on a walk. F9: `Sunia Sea` and `West Bailang` carry the provisional `evernight` district, so the fill rule put a sea and a foreign region on a Tingen walk. F10: 14 Frontier places, including drainage markers 2 to 6, Reedbank and the Travel shelter, exist in the game but have no route from the Village at a fresh start.

**Next gate, unchanged.** Prove the `build_cast_pack --base` writeback in scratch (zero diff first, then N picks) before any placement UI. Merging into the live `cast.json` stays a separate decision.

## Writeback seam proof 2026-11-20 (scratch only)

Ran `build_cast_pack.mjs lotm --whole-book` with the recorded slice (`zh 第1章 p1` to `zh b8 第99999章 p99999`), the private `m4-whole-book-2026-10-29/merged` inputs and `cast-r1r2-candidate-2026-10-29.json` as `--base`, writing only to the session scratchpad. Scripts are in `work/atlas-books-1120/seam/` (gitignored). The live `private_packs/lotm-cast/cast.json` was not written (last modified 2026-11-16).

- **Zero diff.** The rebuild exited 0 and matched both the recorded whole-book candidate and the live pack on all 1,516 places: none added, removed or changed.
- **Three picks.** `apply.mjs` turns an overlay (`picks.json`: place id plus district) into authored base rows. The picks were Jinwutong District to `evernight`, East Bailang Dockyard to `machinery` and Tingen outskirts to `storm`. `expect.mjs` predicted 18 changed places (the 3 picks plus 15 unplaced descendants). The rebuild changed exactly those 18, in `district` and `travel`. Aliases, people and the other places were unchanged; `revision`, `revisionNote` and `buildSourceIdentity` moved, as they do on each rebuild.

**Findings.** F11: promoting a pick into the base drops that place's `placeAliases` rows unless the overlay copies them too, so `apply.mjs` now copies them. F12: descendants that inherit an authored district are stamped `canon-derived`, so the atlas would show them as "district from the book". **Fixed the same day:** `districtFor` now records when a district comes from a base row marked `travel.provenance: 'authored'`, and the places that inherit it are stamped `authored` with their own basis line. Base districts without that mark behave as before. After the fix the zero-diff rebuild still matches the live pack on all 1,516 places, and the three-pick rebuild still changes exactly the 18 predicted places, now all labelled `authored`. `tests/build_cast_pack.test.js` gained a regression test (20 of 20 pass; the new test fails on the old compiler). The atlas now gives `authored` its own state, "Walkable · placed in the atlas", with a violet border, a map-key entry and a count in the summary line. `ATLAS_LOTM_CAST=<file>` lets the atlas preview a scratch pack in place of the live one. `work/atlas-books-1120/prove-authored.mjs` ran against the live pack patched with the 18 scratch placements and exited 0: 18 places in the new state, Tingen outskirts shows "storm · authored", no page errors. Screenshot: `book-worlds-authored-preview.png`. The original proof against the live pack still exits 0 with unchanged counts. F13 (unverified): the pack places Jinwutong District directly under Tingen City and East Bailang Dockyard under Tingen's Docks district. Jinwutong reads like an untranslated name and Bailang matches the foreign region in F9, so both chains need a source check before anyone places them for real.

**Still gated.** The scratch output carries only what `build_cast_pack` produces. Getting a pick into the game still means running the acts and journeys passes on top and swapping the live pack, which needs Weibao's yes.

## Library and reading preparation in the atlas (options, 2026-11-20)

Weibao asked whether the library and reading preparation could appear in the atlas too. Today the atlas's "World library" tab only groups game locations by source collection. The library itself is drawn separately in `LIBRARY_BUILD_ATLAS_2026-11-20.html` (shelves and build connections). Reading coverage lives in `reading_review.mjs` inventories: 152 registry keys under 44 world labels and 8,972 prepared shards, of which 50 keys have all five passes, 10 have some and 92 have none (library build atlas F8, November 6 numbers).

- **O4. A pipeline lane per world (recommended first).** Each source moves through one chain: held → prepared shards → five passes → cast pack → in game → walkable. The atlas draws one box per stage, so the gap shows where it is: LOTM drops at walkability, and most keys stop at "prepared, no passes". The data comes from local counts (registry, `reading_review` inventory, cast packs, the game's location registry), not prose, because raw text stays private (SKR18). Clicking a stage opens the Book worlds or Other game places view it feeds.
- **O5. A library shelf canvas.** Moves the library build atlas's seven shelves into the box canvas, with sources as boxes coloured by reading level (L1 to L4) and an edge to their game consumer when one exists. This replaces the separate HTML drawing (draw it once). It costs more, because works, editions and keys have no common id yet (library build atlas, scope section).
- **O6. Mechanic-first readiness, the unusual one.** Start from a game place or mechanic and show which reading windows back it and what is missing. The writeback here is a reading request, not a placement: an overlay that `wishlist_queue.py` or a reading plan can pick up, the same pattern as `picks.json`. This answers the library atlas's F11, where nothing starts from a mechanic across shelves.

The join is only proven for LOTM and MOL, where the registry ids reach the game through the cast pack. For the other keys the link from reading key to game consumer is unknown and would show as "no consumer yet", which is a finding in itself.

### Built 2026-11-21: O4, O5 and O6

Weibao said do all of them. `library-reading.mjs` projects the reading registry (`plans/books.json`) with the same shard and pass helpers `reading_review.mjs` uses. It emits counts and ids only: held, shards, passes per key, extracted rows, and keyword-pointer counts per mechanic aspect. Its totals match the library build atlas F8: 152 keys, 8,972 shards, 50 keys through all five passes, 10 partly, 92 none. `library-views.mjs` adds three tabs.

- **Reading pipeline (O4).** 44 reading worlds sorted into columns by where their lane stops. All 44 are held and prepared, 15 are read through all five passes, 5 are used by the game, 5 are in the game, and 2 are walkable (LOTM by districts, MOL by its own host). 29 stop at reading, including Reverend Insanity (22% pass coverage) and Shadow Slave. 12 are fully read but no game system uses them, among them *A Soldier's Life*, *Circle of Inevitability* and *Worm*. Harry Potter stops at walkable because the atlas has no walk projection for its locations yet. Opening a world shows its six-stage lane.
- **Library shelves (O5).** The seven shelves from the library build atlas, with each world coloured by reading state. Membership is a hand-kept list in `library-views.mjs` that follows that table; a world can sit on two shelves. The scenario and tabletop shelves have no reading keys yet, so they show as empty. Reading depth shown is extraction (L1); L2 to L4 need a dossier, which this projection does not read.
- **Mechanic readiness (O6).** Eight mechanic aspects from `reading_review.mjs`, each opening to the worlds with pointer rows and whether the game uses them. "Request reading for this mechanic" saves a request to `work/atlas-reading-requests.json` (gitignored; `ATLAS_REQUESTS` overrides the path). The server picks the route: acquire (nothing held), read (passes missing; paid runs need Weibao's yes) or review (prints the `reading_review.mjs --keys … --topic …` command). Nothing runs from the file.

**Proof.** `work/atlas-books-1120/prove-library.mjs`, headless Chrome at 1920×1080, exit 0, no page errors. It checks all 44 pipeline boxes, the LOTM lane (6 stages, 5 edges, all reached, 383 places on a walk), 7 shelves, the 36-world genre shelf, 8 mechanics, and one request (Reverend Insanity, money and trade, routed to read). That request went to a scratch file; the real request file was not created. Screenshots: `reading-pipeline.png`, `reading-pipeline-lotm-lane.png`, `library-shelves.png`, `library-shelf-other.png`, `mechanic-readiness-economy.png`.

**Findings.** F14: twelve worlds are fully read with no game consumer, so reading is ahead of building for them. F15: for every aspect, all five game worlds have pointer rows, so "gap" never appears at this grain; the aspect patterns are too broad to show a missing mechanic. A finer split (for example price rows versus wage rows) would be needed. F16: the scenario and tabletop shelves have holdings in the library index but no reading keys, so the pipeline cannot see them at all.
