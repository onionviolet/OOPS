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

## Atlas shell reorganisation (built 2026-11-21)

Weibao asked for a more cohesive atlas. The baseline was twelve tabs of equal weight that mixed places, creatures, reading and developer fixtures, drawn three ways (the box canvas, an older percent-positioned graph, and plain sheets). The test task was: find Klein's apartment, check its walk, then check the reading behind it. In the baseline that took six clicks across three tabs, and each tab switch lost the world.

- **O7, low change:** group the tabs and share one toolbar. Kept as part of the build.
- **O8, world first (built):** four sections, Worlds, Library, Creatures and Workbench. A world page owns its views (Places, Registered locations, Walk districts or Cyoria encounter, Reading) under a breadcrumb. The Worlds index replaces the World library tab and the flat Other game places tab. Library lenses link back to world pages. Tingen walk districts moved onto the shared box canvas, and Book worlds search now selects the place it finds.
- **O9, one continuous canvas with lenses:** rejected. It needs a single layout across 2,000+ places, and the canvas reads well up to about 72 boxes.

**Proof.** `work/atlas-ui-1121/prove-shell.mjs` ran the task in four clicks from a cold start and exited 0. Old tab links redirect (for example `#tingen-districts` to `#world/lotm/districts`), and closing a canvas goes up one level. The earlier proofs were updated to the new routes and pass, including one that checks that the registered-location views across all worlds add up to the 160 places the Village walk misses. Screenshots are in `docs/representations/evidence/world-atlas-2026-11-21/`. The Village site workshop still uses the older draggable graph, because the box canvas has no drag editing; it now lives under Workbench.

## Source games, scenes, progress, mechanics, batch build and transfer (built 2026-11-21)

Weibao: "build all three, improve the batched run capabilities to add to this? improve the ability to transfer from this into real game? We can make a page for YAIR and proto23 and arkivia and map everything that's there into the atlas? We dont need a path to get there in game yet." All of it is in `prototypes/world-atlas/` and `scripts/atlas/`. No runtime `src/` file changed, and the live pack was not written.

- **Batch build.** `node prototypes/world-atlas/build.mjs` runs every projection into one snapshot (`work/atlas-snapshot/snapshot.json`, gitignored). The server reads it instead of booting the game on each start; `ATLAS_REBUILD=1` forces a fresh build. A reading wave, lead run or progress-atlas run can end by running it. The last build took about 70 s, 60 s of that for the fresh-game boot, with no failed parts.
- **Batch reading in the lanes.** `batch-status.mjs` reads the batch plans beside `books.json` and reports per key: planned, estimated, submitted and collected, plus estimated dollars. The reading lane and the progress overview show it (LOTM: 109 plans, 67 collected, $26.51 estimated). A reading request now also returns the `make_book_plans.mjs` and dry-run `batch_submit.mjs` commands; both send nothing, and a live batch still needs Weibao's go (AU7).
- **Source games.** Three world pages, each a containment canvas with people, shops, activities, enemies, gathering and crafting marks:
  - **YAIR upstream** (`source-yair.mjs`, read statically from `upstream/master` `e3356432a`, 2026-06-23): 61 places, 78 routes. All 61 still exist in OOPS; 18 more places on the Village walk were added by OOPS.
  - **Proto23 original** (`source-proto23.mjs`; the fetched file matches the recorded SHA256 `a43e55e2…`): 73 places in 4 regions, 124 routes. None match an OOPS place by id or name; OOPS's 5 Proto23 reference places have no source match (F17).
  - **Arkivia v0.26.1** (`source-arkivia.mjs`): 96 places in 3 regions, 179 routes, with distances. Shown as source only, since OOPS took ideas from it, not places.
  - Raw sources and extracts stay under `private/atlas-sources/`; only the extractors are tracked. None of them executes downloaded code.
- **O2 scenes.** `cast-places.mjs` now attaches book scenes to places: beats, dated anchors, schedule slots and household acts, ids and locators only. LOTM has 1,290 at 194 of 1,525 places, and MOL 104 at 22 of 23. Worlds › LOTM or MOL › Scenes draws the places by scene count, and the place inspector lists them. Generated near-detail scenes (`scene_layer.js`) are not drawn, because that layer has no runtime caller.
- **O1 progress.** `docs/reports/progress-atlas-2026-11-14.json` transcribes the November 14 table (the markdown report stays the owner). Reading lanes gain Proven and Delivered stages, and Progress › Where things stand draws built, proven, integrated and delivered per lead world and mechanic. A world the report never covered shows hatched as unknown, not failed. Each future `/progress-atlas` run should write its own dated JSON beside it; the atlas reads the newest.
- **Progress and sub-progress** (Weibao: "section progress better? progress and subprogress?"). Progress › Where things stand now shows one box per lead world and mechanic, with a compact built, proven, integrated and delivered readout (● yes, ◐ partial, ○ no, ? unknown). Opening a box shows its sub-progress. For a world, that means the recorded columns plus live reading parts (held, prepared, read, batch) and in-game parts (places, walkable, book scenes, people). For a mechanic, it means the parts the report names under Built and its running laws, with live run counts from the coverage ledgers. The server reads the newest progress JSON on each start, so a new `/progress-atlas` file shows without a rebuild. Screenshots: `progress-overview.png`, `progress-sub-lotm.png`, `progress-sub-potions.png`.
- **O3 mechanics.** `mechanics.mjs` takes mechanic ids from the coverage ledgers, not a new list. Missing mechanisms are the canonical blocked slugs (for example effect-unknown, 4,340 rows in 36 worlds; area-field, 2,933 in 62). Running ones are named law owners on runs or expressed rows (for example brew_law, 513 rows in 3 worlds, with its tests and its progress-atlas row). Two-letter chat lane labels are skipped.
- **Transfer to the game.** `scripts/atlas/transfer_candidate.mjs` runs the whole chain into `work/atlas-transfer/`: validate picks, overlay, `build_cast_pack --base`, the topic-talk, journey and place-act passes, a key-preserving merge, and a diff. It refuses picks on or inside the F9/F13 places. Places now have a "Place on a walk" district picker, which writes `work/atlas-picks.json`. Workbench › Send to the game lists the picks, starts a candidate build in the background and shows each run's diff with preview and adoption commands. The atlas never copies over the live pack.

**Proof.** `node prototypes/world-atlas/prove-all.mjs` starts its own server with scratch request and pick files and runs headless Chrome at 1920×1080. It exited 0 with 11 of 11 checks and no page errors. Screenshots are in `docs/representations/evidence/world-atlas-2026-11-21/` (`worlds-with-sources`, `source-yair`, `source-proto23`, `source-arkivia`, `scenes-lotm`, `scenes-mol`, `reading-lane-progress-lotm`, `progress-overview`, `mechanics`, `mechanic-brew-law`, `pick-tingen-outskirts`, `send-to-game`). Transfer runs: empty picks exited 0 with no place diff and all 27 keys identical; two picks (Tingen outskirts and Tasok River to storm) changed exactly the 8 predicted places; a flagged pick exited 2 and was refused. `validateLotmCast` returns no problems for both the live pack and the two-pick candidate. Unit tests: `atlas_source_yair` 2, `atlas_source_proto23` 2, `atlas_source_arkivia` 2 and `atlas_transfer_candidate` 11, all passing.

**Findings.**
- F17: Proto23's original places and OOPS's Proto23 reference places share no names, so the reference pack is a reimagining, not a port.
- F18: the journeys and household-act passes disagree with the live pack even with no picks (616 against 522 journeys, 551 against 620 acts). The live rows come from older builders plus reviewed merges, so the candidate keeps the live rows; `--recompile-derived` switches. Whether to recompile is Weibao's call.
- F19: picks cannot change those derived rows; for every derived key, the outputs differ by nothing between the candidate and the live pack.
- F20: the mechanics projection falls back to a file-name guess for ledgers that `worlds.jsonl` does not list, so a few worlds appear twice under two ids (for example `pf1` and `tt-pf1`).

**Still gated.** Adopting a candidate into `private_packs/lotm-cast/cast.json` needs Weibao's yes, followed by AD43 browser proof in the game. Only LOTM is wired for transfer. Source-game pages have no in-game path, by request.

## Reader findings, things and making (built 2026-11-21)

Weibao asked whether the atlas had absorbed everything the batch readers found. It had not. The atlas read
places through the cast pack, scenes for LOTM and MOL, and batch receipts. It did not read the census kinds
(items, creatures, groups, gods, documents, prices, clocks), the rules pass (crafts, potions, rites, spells,
abilities, laws) or the texture pass (services, customs, news).

- `reader-findings.mjs` digests every registry world. It reads one canonical file per shard and pass, using
  the library's `chosenFile` (merged `m_` census, plain prefix before the Luna copy), so `m13`, `x2`, pilot
  and A/B runs never count. It then dedupes by id. For LOTM it also reads the 63 Book 1 lead-run slices
  that predate the registry, one stem per slice (`w1s10`-`w4s41`, then `b4s42`-`b7s72`; the `c` family re-reads
  the `b` chapters and is skipped). Rule items join to census ids, then to census
  labels and aliases; unmatched items are kept and hatched. Census notes and step prose stay out.
- `build.mjs` writes the counts matrix into the snapshot and one digest per world to
  `work/atlas-snapshot/readers/`. The server serves those at `/readers/<world>`.
- `game-recipes.mjs` reads `src/crafting_recipes.js` and upstream's copy statically, in the same shape.
- Progress › Reader findings: one row per registry world, one column per row family.
- World › Things: census entities by kind, ranked by slices, plus abilities, laws and services, customs, news.
- World › Making: raw materials, intermediates and products, and a tree centered on any item (what makes
  it from what; what it goes into). Book worlds draw reader rules; the Village draws the YAIR-format recipe book
  in OOPS (`crafting_recipes.js`) and YAIR the upstream one. It does not draw the making domain
  (`craft_resolver`, cast making), LOTM brewing and charms, HP brewing, Gu refinement or the native material
  catalogues. The 14 read worlds with no game page get their own Things, Making and Reading.

Proof: `prove-all.mjs` passes 16 of 16 with no page errors, including the matrix, LOTM silver sheet →
low-grade charm crafting → slumber, soothing and dream charms, and the OOPS iron ingot tree. Unit tests:
`tests/atlas_reader_findings.test.js` (dedupe across three shards, joins, recipe extraction).

Findings:

- F21: 19 of 44 registry worlds have reader rows. 25 have prepared shards and no output (Ar'Kendrithyst,
  Randidly Ghosthound, Mark of the Fool and others); Shadow Slave, Reverend Insanity, Wish Upon the Stars and
  Wasteland Border Inspector are partly read.
- F22: reader scenes reach the atlas only through a cast pack, so 17 worlds' scenes are recorded and not drawn.
  The people pass (relationships), the `other` rows of the rules and texture passes, and fills are not drawn
  anywhere.
- F23: making rules name both inputs and products in only about a third of LOTM workings (474 of 1,642); rites
  and abilities often record a product as a note (`lotm.note.*`) rather than an item, so the trees are shallow
  and many products show as unmatched.
- F24: the YAIR-format recipe book in OOPS has 257 workings (component recipes count once per material), 34 added by OOPS
  and none of upstream's dropped.

## Game link, fills and the remaining reader rows (built 2026-11-22)

Weibao asked for O1–O5 from the follow-up list: link book workings to the game's making, fill the incomplete
recipes, draw the reader rows the atlas still skipped, send the batch readers, and the housekeeping.

- `game-making.mjs` reads the game's own making rows: the LOTM rite, craft and aid rows (`book_world_lotm_acts_host.js`),
  the LOTM potion rules and summons, and three playable makers that cite nothing (the Seer brew, the HP Cure for Boils,
  the Tingen silver amulet). A row the host compiles into a command is playable. A row that only sits in a source table
  is recorded. The three uncited makers get atlas-authored links, labelled as such in the inspector. World › Making now
  colours each reader working by that state and adds Playable, Recorded only and Not in the game tabs.
- Six Haiku agents read the readers' own step text for the 1,168 LOTM workings that lacked inputs or products and
  wrote `work/atlas-fill/lotm/making_fill-*.jsonl` (gitignored). They added only stated or plainly implied items; a
  working that makes no item gets an outcome line instead. `reader-findings.mjs` applies the fill before the census
  join and marks each filled item with its confidence.
- The digest now folds the people pass (routines, ties, what a person knows) and the places pass (hours, access,
  affordances) onto entities, and keeps the `other` rows of every pass and the fills. Things gains `"Other" rows` and
  `Fills (proposals)` tabs; a person's inspector shows routine and ties, a place's shows what you can do there.
- Batch readers: 29 dry run files for the unread and partly read worlds, true bound $816.18, all PENDING
  ([preflight](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#unread-world-preflight-november-22)).

Findings:

- F25: of LOTM's 1,642 reader workings, 10 are playable, 99 are recorded in game source tables only and 1,533 are
  not in the game. The 86 game rows hold 132 citations; 8 rows are playable. 20 citations name ids the readers never
  wrote, mostly older spellings. The charm rows cite `lotm.craft.charm-making`, `lotm.craft.slumber-charm` and
  `lotm.rule.dream-charm-making`, while the merged readers recorded `lotm.rule.charm-crafting`, so the most
  developed LOTM craft does not link to its reader working. Renaming the citations, or adding the reader id beside
  them, would close it; that is a source-row edit for the owning lane.
- F26: F23's shallow trees were mostly not missing data. Of the 1,168 incomplete workings, the fill gave about 935
  an outcome instead of an item (rites, readings, effects), added 294 items to the rest (146 joined to a census
  entry), and found nothing in about 70. With the fill, 1,138 of 1,642 workings name inputs and a product or an
  outcome; 526 name both inputs and an item product, up from 474. Filled items are agent work from the readers'
  steps, not a reread of the text, and are marked in the inspector.
- F27: the people pass has rows for 1,328 LOTM people and the "other" rows hold 87,624 distinct loose facts after
  dedupe; the digest keeps the first 3,000 for the tab and the full count in the matrix. Fills (2,321) are now
  listed by layer. Census notes and step prose stay out of the digests on purpose.
- F28: the batch read of the unread worlds is ready but not sent. Its bound is $816.18 and its expected spend about
  $80–120 against a paid balance no project key can read.
- F29: some census rows put the evidence letter (S, T, I) in `label`, so 316 LOTM, 62 HP and 61 MOL entities
  showed as "S" or "T" in Things and Making since the 2026-11-21 build. The digest now ignores a one-letter label,
  falls back to the id, and takes the first real label any shard gives. The reader schema could reject it at
  collect; that is the reading lane's call.
