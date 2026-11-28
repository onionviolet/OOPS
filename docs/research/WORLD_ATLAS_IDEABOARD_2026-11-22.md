# World atlas ideaboard (2026-11-22, proposals)

Weibao, after the reader-findings and game-link build: "ideaboard improvements to make the atlas look more
flavorful, while being more useful and more?"

Every WA line is a proposal (AD32). "Now" means what the atlas does as of commit `708d0df0b`. The atlas is a
development tool (`prototypes/world-atlas/`, its own server), not a player surface. UI_RULES' player rules
inform it but do not bind it, and MW9's "no new standalone pages under `prototypes/`" means these ideas grow
the existing atlas rather than spawn new pages.

## Using the atlas to pick implementation work (2026-11-24)

Start with one thing a lead or local life should be able to do. Use the atlas to find the first missing step between source evidence and that action's consequence. The [current build order](../../PROJECT.md#current-focus) still supplies the priorities. The atlas gives each priority concrete cases to inspect.

| Question | Atlas route | What to take into the project |
| --- | --- | --- |
| Which shared rule needs work? | Progress › Mechanics, then open the underlying coverage ledgers | Sample one case needed by a current lead and one different case. Check each source locator and the existing engine seam. For a foundation wave, hold out cases and check both the route and the outcome. Broad tags and raw counts are search hints. |
| What could make a day in this world richer? | World › Scenes, Places, Things and Making | Connect a known person, place or working to a decision, cost and aftermath. For example, follow a patrol through the encounter, the take-home yield and the shop or crafting use. Check the actual host at each step. |
| Is this already built? | World › Making, then Progress › Where things stand | Check the reader ID, its game row, the command binding and the played receipt independently. The progress pane reflects the date of its input report. |
| Which research would change the build? | World › Reading and Progress › Reader findings | Reread the smallest passage that resolves a decision about cost, trigger, method or failure. Bring the unresolved question and source locator to the reading owner. |
| What could we learn from another game? | Worlds › YAIR, Proto23 or Arkivia | Pick a relationship among travel, supply, work and risk and ask what choice it would create in OOPS. Source-game maps support comparison. Workbench › Send to the game prepares LOTM placement candidates and shows their diffs. |

**A worked example.** The LOTM Making tree leads from silver sheet into charm-making. A local run of `gameMaking()` on `db24d3a92` found three recorded charm rows linked to `lotm.craft.charm-making` and zero links to the merged reader ID `lotm.rule.charm-crafting` ([translation-layer finding F25](ATLAS_TRANSLATION_LAYER_PROPOSAL_2026-11-20.md#game-link-fills-and-the-remaining-reader-rows-built-2026-11-22)). Confirm the alias against the reading, then check whether the intended charm has a reachable producer and a consumer. A citation fix, a command binding and a played journey each close a different gap. The local checkout had no atlas snapshot or LOTM private cast pack, so this check covers the game-side projection only.

**Candidate cards in use.** Keep the list short: missing piece, reuse, next check. Expand the evidence when it changes the job. Pick one candidate from the current build order, implement it in its existing owner, then refresh the atlas from the new evidence.

### LOTM charm cards preflight

| Field | Scope |
| --- | --- |
| Reading and authority | Weibao authorized WA8 and WA12 on LOTM Making, with the first three charm variants. AD32 and WPR27 keep findings in this owner. |
| Visible result | At 1920×1080, Making has a Candidates view, and the silver-sheet working links to it. A missing reader digest still leaves the game-side cards available with an evidence status. |
| Fit and ring | Extend the existing game-making projection and Making tree. Read `defineActs` for bindings and use `lotm_act_engine` and the amulet workshop as reuse references. The project change is the developer UI and its evidence projection. |
| Files and failure check | Atlas prototype, existing atlas tests and this record. Check that the legacy citation appears as a candidate, the three rows remain unbound, and the dream rite remains a possible consumer until it binds. |

**Receipt, 2026-11-24.** LOTM Making now has three candidate cards and a link from the silver-sheet working when the reader digest is available. The proposed citation does not count as a direct join. The cards recommend Slumber first: finish making at inscription, then spend the held charm on use. Game commands and saves were outside this slice.

- `node prototypes/world-atlas/build.mjs` passed for local inputs on `db24d3a92` plus this change. Missing map and creature assets had blocked the atlas shell. The Village builds with base geography, and the unavailable creature record has its own fallback.
- Headless Chrome, 1920×1080, passed the no-digest route, old snapshot compatibility, card and evidence display, citation filter and silver-sheet round trip. The silver-sheet proof used a synthetic reader digest alongside the real game-side projection. Private collected files were unavailable here.
- 36 focused tests passed across atlas readers and transfer, craft rows and amulet crafting. `npm run check:docs` and `git diff --check` passed. The repo-wide `check:arch` exited in Windows import-graph processing before reporting results.

### Filling the atlas after a reading wave

1. **Collect before planning another run.** The [reading owner](../gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md#launch-under-the-40-ceiling-november-22) recorded seven approved worlds, $33.77 reserved under the $40 ceiling, and collection resumed November 23. Use those original receipts to reconcile collected, held and still-running stages. This Windows checkout lacks the private results, so it cannot confirm later progress. The other 22 plans remain pending in the latest recorded status.
2. **Rebuild on the checkout holding the private outputs.** After the collector grades and writes results to the registered book directory, run `node prototypes/world-atlas/build.mjs` and restart `serve.mjs`. The digest picks one canonical result per shard and pass, deduplicates stable IDs, and feeds Things, Making and Reader findings. Check one newly visible row and its locator against the collected file. Track planned, collected, source-qualified, drawn and joined to the game as distinct states.
3. **Draw what is already collected.** The findings matrix currently counts raw reader scenes, while Scenes draws from cast packs. A useful first atlas follow-up is a source-only Scenes view for one already-read world without a cast pack. Group by stable place ID or chapter, keep locators, and label unresolved place joins. This gives the atlas more coverage with the existing reader files and leaves place synthesis available for the chosen playable route.
4. **Enrich only where a build decision needs it.** Use `reading_review.mjs --keys <keys> --topic <topic> --level L2 --out <private-dir>` to inventory existing rows and start a focused dossier. For charms, look up the identity match and the relationship between inscription, activation and upkeep. Record what was shown, what was inferred and which values remain authored. Use the [existing batch workflow](BATCH_READING_WORKFLOW.md#operational-route) for gaps that survive that check, with a named question and finite reservation.
5. **Add game evidence through existing owners.** Link the relevant source IDs to the actual commands, consumers and played receipts. Runtime projections can add information the readers cannot supply, such as whether an item has a usable producer or whether a place is reachable. A snapshot comparison (WA16) can show new reader rows, repaired identity joins, new command bindings and newly exercised routes after each wave.

### Reader scenes and visual pass (2026-11-24)

Preflight under WPR27 and AD6–AD8. Weibao asked what existing novel batches could feed the atlas and for clearer visuals. At 1920×1080, Reader findings should open a book's scene index, where a developer can find a place, source locator and recorded choices. Use the existing canonical shard reader and layout. Keep sealed scenes at aggregate counts, preserve cast-pack scene views, and leave live game and paid reading outside this change. Verify a duplicate beat, a missing place, a sealed row and a reader world without a cast pack.

**Built.** Progress › Reader findings opens Reader scenes for any world with collected scenes in the snapshot. The index orders by source locator, filters by place or search, and shows counts for steps, options and outcomes. The reader's place ID stays marked unmatched until it joins to the census. There is a separate cast-pack view where available. Missing private files leave this local rebuild with zero collected worlds.

**What else to pull in.** Join people-pass routines and ties with scene places and texture-pass hours to answer who is around and what a local can do. Join prices, units, services and materials into cost and supply views. Compare rule and recipe rows across novels by the mechanism they use, preserving each world's inputs, limits and consequences. Start with joins and local synthesis on collected files. Commission targeted rereads for a named gameplay question that remains unanswered.

**Visual direction.** The scene table and Making cards now use readable body type and a distinct header. Try small per-world accents with shared evidence colors next. Use chapter strips for chronology, pins where geography is established, and recipe cards for input and output. Keep record IDs and locators available on demand.

**Checks.** The local atlas snapshot built successfully. Nine atlas reader tests passed. Headless Chrome at 1920×1080 passed Reader findings to the cast-free index with a synthetic digest, including search, place filter, pagination and withheld details. Real collected novel rows require a rebuild on the checkout holding those private files.

### Explore the thing first (2026-11-24)

Preflight under WPR27 and AD6–AD8. Weibao wants Slumber in Making to explain its effect, making and use, then connect people, places and scenes. Put one short OOPS status line after those facts. Keep the candidate list as a secondary work view. At 1920×1080, clicking the product in the silver-sheet tree should open that record. A direct Slumber link supports discovery and cached snapshots without the private reader digest. Show source facts from the craft row, match reader scenes by item ID or exact locator, and read runtime bindings for the status. Check a linked person, place and scene, the missing-digest view, and sealed exclusion. The separate charm chat owns gameplay and its proof.

**Built and checked.** Making opens the Slumber record directly or in the silver-sheet inspector. Links go to the selected person, place or reader scene. Without the private digest, the record uses the craft row's source references and available OOPS binding data. The current checkout projects inscription and throwing as wired and unused recharge as missing. The atlas build passed, nine focused tests and the docs check passed, and headless Chrome at 1920×1080 walked both entry routes, all three link types and the no-digest fallback. The scene joins used a synthetic reader digest. A rebuild on the reader host will populate those links from its collected files.

### Grouping the collected readings (2026-11-24)

Preflight under WPR27 and AD6–AD8. Extend the Slumber pattern to batch-reader creatures across worlds. At 1920×1080, open a novel from the collector's creature shelf, select a creature, and see its recorded facts, whereabouts, people and scenes with a short game link below. Keep source and runtime claims distinct. Group Things by what a user is looking for. Use the existing local digests and safe source projections. Verify exact creature joins, empty and unmatched records, and withheld scene details. No fresh reading or game changes are part of this slice.

**Built.** Creatures › From the readers opens a world by name. A creature's record pulls linked descriptions, sightings, people, rules and scenes when those fields exist. Presence in the registry is separate from play proof. Things groups its collections into Inhabitants, Places and daily life, Things and knowledge, and Reader evidence. People and places also link to their source scenes.

**Next groups.** Inhabitants should lead with roles, routines, ties and encounters. Places should lead with access, services, prices and scenes. Items and powers should lead with what they do, how to get or use them and their costs or consequences. Reader evidence should keep source locators, contested accounts and proposed fills handy. The compact OOPS line fits each group. Project the fields the existing passes collected, and ask for a targeted reading only when a named question still needs evidence.

**Checks.** The local atlas build and ten focused tests passed. Headless Chrome at 1920×1080 passed the two-world shelf, Things navigation, facts, person/place/rule/scene links, withheld details, a sparse creature, and an exact game-record match. The two novels in that check used synthetic digests. The collected novels require a build with their private reader files.

### Place records (2026-11-24)

Preflight under WPR27 and AD6–AD8. In the 1920×1080 atlas, selecting a place from the book map or Things should show available actions, people, hours, services, prices and scenes. Reuse exact reader IDs, the cast crosswalk, and the game's exposed commands. Label visits and scheduled appearances separately. Keep stated-free prices explicit and leave unknowns visible. Check a reader-only place and a cast-linked one, including same-named services in different places and the absence of private reader files. No runtime or paid reading changes.

**Built.** World › Places and Things › Places both open the place record. It joins book affordances, known routines and appearances, hours and access, services, priced amounts, scene links, and available game-side location/action records. A short OOPS line distinguishes a walk route, bound local commands, unverified access, and source-only records. The atlas still labels book prices as source information. Same-named services at different places keep separate costs, and an unmentioned price stays distinct from a stated-free service.

**Checks.** Atlas build, 22 focused tests, docs and whitespace checks passed. Headless Chrome at 1920×1080 passed the reader-only and cast-linked place routes, scene drilldown, isolated service prices, schedule details, and the no-reader fallback. Browser proof used fixture reader and cast data with the real Tingen action projection. The collected novel data will appear after a rebuild on the reader host.

## Standing World Atlas goal

The development Atlas also covers world rules and individual cheats. In **Library → World rules**, select a world or edition, then open a rule to see its source locator and recorded interpretation or implementation evidence. In **Library → Cheat catalogue**, select a family or enter a stable ID such as CTC1. Expand the type to compare the ordinary decision, the advantage and its evidence. The browser reads the ten sections of the catalogue directly. These are design tools; knowledge visible to a character follows that life. [Rule coverage](ATLAS_WORLD_RULES_2026-11-25.md) · [Cheat catalogue](../CHEAT_CATALOGUE.md) · [Catalogue desktop proof](../representations/evidence/atlas-cheat-catalogue-2026-11-25/proof.json)

Weibao made this a continuing development goal on [2026-11-24](../gm/USER_VISION_LOG_2026-11.md#standing-world-atlas-goal-2026-11-24). Clicking a subject opens what it is, what it does, and the connected source records. Keep the In OOPS line short and specific to the runtime evidence. Prefer the collected reader files and their stable IDs. Each atlas slice should have one browsable journey that can be checked at desktop size.

People, Places, Creatures, Items, Powers, Groups and Scenes have browsable records and a shared desktop check. The implementation pass is verified. The collected corpus still needs a snapshot built with its private reader folders. This goal concerns the atlas and follows the existing gameplay build order.

### Systems encyclopedia, 2026-11-27

Open **Systems** for the 12 shared mechanisms, six evolution policies, system voice and what the system reveals. The adopted snapshot joins census paraphrases, reader record identifiers, chapter references and the existing OOPS play receipts. Find indexes the articles and comparison cells. World rules opens the same catalogue filtered to that world. Background-only rows remain marked in the comparisons.

Systems maps to Time and progression, Research and sources, and Words and prose. It reads the same snapshot as Find, with native play labels based on receipts. [Census](../audits/LITRPG_SYSTEM_CENSUS_2026-11-27.md) · [Refresh workflow](ATLAS_ARCHIVE_SCALE_2026-11-25.md#windows-refresh-and-mac-completion-queue) · [Desktop proof](../representations/evidence/atlas-systems-2026-11-27/proof.json)

### People records preflight (2026-11-24)

At 1920×1080, a People or Things selection should show the person's sourced identity, routines and locations, ties, and linked scenes before the In OOPS line. Use the canonical reader digest and exact cast IDs. Label a scheduled visit and a single scene appearance separately. Check multiple ties to the same person, conflicting or absent hours, an unlinked player-facing record, and a cast-only record. WPR27 and AD6–AD8 apply.

**Built.** World › People, Things › People, and people links from a place open the new record. It shows identity facts, activities, where and when they appear, distinct ties, and source scenes. The OOPS line reports any exact cast, schedule or interaction link. A reader sighting remains a past event. Cast-only profiles still show game information if the reader files are absent.

**Checks.** Atlas build, 27 focused tests, docs and direction checks passed. Headless Chrome at 1920×1080 passed a reader person and a cast-linked person, following their place, person and scene links and checking the cast-only fallback. This used fixture reader/cast records and a real Tingen bound interaction. A cast schedule without an ID initially broke the linked place's scene list. That view now keeps the schedule row with its kind as a fallback label, and the desktop route passed after the fix.

### General items and materials (2026-11-24)

Preflight under WPR27 and AD6–AD8. Use the Slumber pattern for an ordinary material or product in Things and Making. Show sourced facts, workings that make or use it, exact scene and place links, and one In OOPS line. Preserve role, quantity, source labels and fill provenance. Check a census-only item, a recipe-only reference, a reversible path to a working, a native recipe, and evidence that a source working lacks a game match. Scope is the atlas projection and desktop view.

**Built.** Things and Making now open a general item record with sourced facts, producers, uses, people, places and scenes. Working links show the recipes' inputs and products, conditions, procedure, results and costs when recorded. Materials link back to the tree. The short OOPS line distinguishes an existing recipe or bound command from availability in a player's life.

**Checks.** Atlas build, 28 focused tests, docs and whitespace checks passed. Headless Chrome at 1920×1080 passed a source material, its recipe-only catalyst, a census-only item, linked person/place/scene labels, sealed exclusions and the native iron-ingot route. The source-world proof used a synthetic reader digest alongside the real recipe extract. A rebuild where the private files live will populate novel records.

### Powers (2026-11-24)

Preflight under WPR27 and AD6–AD8. From a world's Powers view, open an ability or spell and see its effects, prerequisites, learning, cost, limits and source connections. Use collected rule and scene fields plus exact coverage IDs. Keep engine evidence distinct from a bound action and from verified play. Check an ability and a spell with a reader fixture, a sealed scene, an unmatched power, and an actual coverage ledger row. Scope is the atlas and its desktop proof.

**Built.** World › Powers and Things › Powers show abilities and spells. Records connect results, procedures, inputs, teachers, costs, limits, and exact reader scenes. The short OOPS line separates a linked command, engine coverage, a blocker, and a missing match. Templates with qualified IDs can show their ledger evidence. Spells link between Making and Powers.

**Checks.** Atlas build, 30 focused tests, docs and whitespace checks passed. Headless Chrome at 1920×1080 checked an ability and a spell-only world, source scene links, withheld details, a missing game match, the Making round trip, and an actual LOTM ledger match. The browser used fixture novel data. This checkout lacks the private collected files needed to populate the real novel records.

### Groups and institutions (2026-11-24)

Preflight under WPR27 and AD6–AD8. A group or institution should show what it is, what it does, the places and people attached to it with their source relationship, and the rules and scenes that name it. Keep census groups, institution rules and laws browsable and join only by explicit IDs. Verify reader and coverage links, including an institution without a census row and a law that names an enforcer. Scope is the local atlas and desktop proof.

**Built.** World › Groups brings census groups and institution rules together by ID. Records show facts and procedures, directed ties, places, rules and linked scenes. Law records expose conditions, consequences, detection and the named enforcer. The OOPS line uses an exact command or qualified coverage link when available.

**Checks.** Atlas build, 31 focused tests, docs and whitespace checks passed. Headless Chrome at 1920×1080 checked a census group, an institution without a census row, person and law links, named enforcement, scene search, and sealed exclusions. The browser used fixture reader worlds and a real Eberron ledger entry. The private reader rebuild remains open.

### Scene records (2026-11-24)

Preflight under WPR27 and AD6–AD8. Reader scenes should open a record by stable beat ID from its table and from connected records. Show the named people, place and timing, reader action summaries, choices and options, outcomes, and source locators. Withhold sealed rows and withheld dependencies. Keep reader and game evidence distinct. Check a selected scene, cross-links, a sealed duplicate and a same-locator cast entry with a different ID. Scope is local atlas projection and desktop browser proof.

**Built.** Click a locator in Reader scenes to open the record alongside the index. It shows the recorded actions, choices, untaken options, outcomes, people, subject links and scene dependencies. In OOPS distinguishes an exact cast beat from an unconfirmed game link. The projection omits sealed duplicates and their dependency links. The reading metadata now opens Windows batch files by file URL.

**Checks.** Atlas build, 32 focused tests, docs and whitespace checks passed. Headless Chrome at 1920×1080 read a synthetic novel through the canonical batch files, then followed index, scene, person and item links. The test distinguished two scenes at the same locator, only one of which was a cast match, and withheld a sealed duplicate. Private collected reader files remain unavailable here.

### Standing goal completion check (2026-11-24)

`node prototypes/world-atlas/prove-records.mjs` passed in headless Chrome at 1920×1080. It uses the canonical book registry and ordinary build/server commands over synthetic batch files in a separate root. One scene links to a person with a timed routine, a creature with a sourced observation, a place with a service price, an item with a maker, a power with an actual LOTM coverage row, and a group with a directed tie. Every record has a short In OOPS line and a scene link that returns to the same record. Withheld details were absent from both the rendered scene and the served reader JSON. The smoke check also proved that `build.mjs --out` puts the reader digests beside the requested snapshot. The 33 focused checks, docs and direction sync passed on the same working tree. Runtime files and the gameplay build order were outside this implementation pass.

The current checkout's normal registry reports 152 book keys, zero available prepared shards and zero keys with collected output. A collected-corpus rebuild remains separate evidence. Run `node prototypes/world-atlas/build.mjs` where those private files live, or set `ATLAS_READER_ROOT` to the local or mounted folder that holds the same registry-relative private paths. Use the same reader root in the build and server. The atlas reads those files in place. The standing direction stays in [USER_VISION](../USER_VISION.md#research-and-sources).

## What it looks like now

- One look for every world: dark slate, monospace, thin outlined boxes in four or five border colours, hatched
  unknowns. LOTM, Harry Potter and Reverend Insanity look identical.
- Boxes carry a label and a count. Meaning sits in the inspector, so the canvas reads as a grid of names.
- Useful layers already exist but sit apart: scenes by place, districts, reader things, making trees, game
  state (playable, recorded, absent), the progress snapshot and batch receipts. A question that crosses two
  of them takes two views and memory.
- Every view describes. None of them says what to do next.

## Recommended first five

1. **WA1 · A world wears its book.** Per-world palette, display face and two or three motifs from a small
   theme table (below). Cheap, and every screen changes at once.
2. **WA8 · Gap cards that end in a next step.** Each gap the atlas already computes (unread shards, absent
   workings, stale citations, unplaced places) becomes a card saying what is missing, why it matters, and the
   command, file or owner that closes it.
3. **WA12 · One question, all layers.** Pick an item, person or place and see its census row, scenes, making
   tree, game state and the code that uses it on one page. This is the Things inspector grown into a dossier.
4. **WA5 · Real map ground for places.** Draw places on the district map the walk already uses (Tingen,
   Backlund), not on a grid. Box grids stay for kinds with no geography.
5. **WA16 · Since last time.** A dated diff between two snapshots: what the readers added, what turned
   playable, what went stale. The build already writes dated snapshots; nobody compares them.

WA1 is mostly flavour; WA8, WA12 and WA16 are mostly use; WA5 is both. Everything else below is the wider palette.

## Flavour: make each world feel like itself

**WA1 · Theme table per world.** One small table, no art pipeline:

| World | Ground | Accent | Display face | Motifs |
| --- | --- | --- | --- | --- |
| LOTM | Soot-dark paper | Brass, crimson for the red moon | A Victorian serif | Gears, tarot suits, the grey fog |
| Harry Potter | Parchment | House colours as accents | A storybook serif | Wax seals, quills |
| Reverend Insanity | Deep green-black | Jade, blood-gold | A brush-stroke CJK-friendly face | Gu silhouettes, aperture rings |
| Mother of Learning | Slate | Cyoria blue | A clean academic serif | Loop marks, mana lines |
| The Village (OOPS) | The current slate | YAIR green | The current mono | Stays the dev look |

The data look (hatched unknowns, the state colours) stays shared across worlds, so a playable box means the
same thing in every world and only the ground changes. A Display toggle keeps the plain dev look.

**WA2 · Kind glyphs.** One small icon per census kind (item, creature, deity, document, price, clock, place,
person) drawn in the box corner, so a Things grid reads at a glance without the label. The kit already has an
icon font for marks.

**WA3 · Book-voice captions.** Captions and empty states written in the world's register. "The fog holds no
record of this yet", not "No reader rows". Kept to captions and empty states, never data labels, so nothing
false sneaks in. Developer words stay in the inspector's id line.

**WA4 · A quote under the name.** The inspector shows one short source line where the readers kept a locator
(the first mention, a step). It must stay under the copyright limit the reading notes already follow: one
line and a locator, no passage.

**WA5 · Map ground.** Places on the district maps, scenes as pins on them, and the walk's routes as lines.
For worlds without a map, a sketch layout from the places pass's `within` chain (city › district › street) is
a fair stand-in.

**WA6 · Making trees drawn as recipe cards.** A working shown as a card with ingredients down the left and the
product on the right, ritual and minutes as stamps. The tree layout stays; only the box changes.

**WA7 · (Unusual) The atlas as an in-world object.** Each world's atlas is framed as a thing from that world:
LOTM's as a Tarot Club member's ledger, HP's as the Marauder's-map-style parchment, RI's as a Gu master's
scroll. Same data, a framing pass on the shell. This is a big taste call and could get kitschy; a worthwhile
version tries it on one world first.

## Use: make it answer the next question

**WA8 · Gap cards.** Every computed gap becomes a card: what, why it matters, how to close it, who owns it.
First sources: unread shards (closes with the batch run file), absent workings (closes with a source row
in `lotm_craft_rows.js`), stale citations (F25; closes with a rename), unplaced places (closes with a pick, which
already exists), census-label gaps (F29). Cards sort by consequence, not count.

**WA9 · "Close the gap" buttons where it is safe.** A pick already writes to the transfer chain. Extend that
pattern only to writes that are local and reversible: a stale-citation rename proposal, a place pick, a
fill accept or reject. Sending, spending and committing stay outside the atlas.

**WA10 · Fill review queue.** The 294 agent-filled items and 935 outcomes (F26) are agent work. A small queue
shows each with its source steps and lets Weibao or a lane mark it kept, wrong or unsure. Accepted fills
graduate; rejected ones drop out of the trees.

**WA11 · Book-to-game ladder per working.** For each working: read → in census → source row → bound command →
played in a headless run → delivered. The atlas has the first four. Game MCP receipts could supply "played",
which would answer "does this actually happen in play?"

**WA12 · Dossier.** One page per thing: census, scenes it appears in (with place and day), ties, workings
that make or use it, game rows that cite it, and `rule_routes`-style links to the source files that mention its
id. Today that takes four views.

**WA13 · Cross-world compare.** Pick a kind (healing potions, travel, money) and see it across worlds side by
side: what each book has, what each game slice plays. Good for mechanic absorption, since it shows where a shared
mechanism already exists.

**WA14 · Search across everything.** One box that finds an id or name in any world and any layer, with the
kind and world on each hit. The current finder is per view.

**WA15 · Leverage view.** For making: which raw materials unlock the most workings, and which single absent
working blocks the most others. That tells a lane which row to build next, rather than only listing what is
missing.

**WA16 · Since last time.** Snapshot diff: counts up or down per world and layer, newly playable workings,
new stale citations, readers collected since. Fed by the dated snapshots and the batch receipts.

**WA17 · Batch run watch.** The seven running reader drivers as a live strip: step, batch ids, measured
spend against the $40 ledger, stop-rule state. Today that lives in log files.

**WA23 · Evidence per recipe slot (added 2026-11-24, from I1 of the [community research](RI_COMMUNITY_ANSWERS_2026-11-24.md)).**
A killer move's dossier (WA12) gets one fold per slot: the Gu, its role (core, support, unnamed), the variant,
the locator, and whether the source states an order. Unnamed supports stay visible as open slots. Authored
values go on a separate scratch recipe, so a tested guess never reads as canon. Reason: whole-row blockers
such as `roles-unknown` (651 Gu move rows) hide usable facts. Chapter 1561 names four cores and 14 supports
for one Myriad Self configuration, and an umbrella row flattens several versions of a move into one.

**WA24 · "Check this passage" before paying for a read (added 2026-11-24, from I2).** A gap card (WA8) takes
a chapter and a name or alias and opens the matching local passages for a second reader, each tagged as an
explicit fact, a bare mention, a name collision ("Life Gu" inside "Remnant life Gu") or a character's
hypothesis. Paid reads are offered after that check. Reason: the [Gu blocker audit](../audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md)
found collisions and already-answered rows that a paid pass would have bought again.

## More: stretch and unusual

**WA18 · Time scrubber.** A slider over the book's chapters or in-world days. Places, people and workings
fade in as the readers first meet them, so you can see a world as the lead knew it on day 30. The census
already records `firstMention`; scenes carry days.

**WA19 · The lead's footprint.** Overlay what the lead has touched (`touchedByLead`, scenes, the walk) on
everything the world holds. That gives a quick read of how much of a world the game's slice actually uses.

**WA20 · Ask the atlas.** A question box that answers from the snapshot and digests only ("which LOTM
workings need silver and are playable?"), with every answer linked to rows. Local and read-only. It needs a
query layer more than a model, and the model is optional.

**WA21 · Printable world brief.** One page per world (themed per WA1): what the books hold, what the game
plays, the top gaps. Useful to hand a lane as its world briefing.

**WA22 · Sound off by default.** A faint ambient loop per world (a clock tick for LOTM, wind for RI) behind a
toggle. Pure flavour, cheap, easy to hate; listed so it is decided rather than forgotten.

## Not recommended

- A 3D globe or force-directed graph of everything. It looks impressive, but past about a dozen nodes it
  reads worse than the current grids, and the progress-atlas rule prefers grouped lists there.
- Completion percentages per world. They would turn a map into a score, which the progress-atlas skill rejects.
- Generated art per item. Cost and taste risk are high, and the payoff is low next to glyphs (WA2).

## If Weibao picks

The smallest useful bundle is WA1 on LOTM only (the theme table plus a toggle), then WA8 gap cards from the
four gap sources the snapshot already has. Both live in `things-views.mjs`, `library-views.mjs` and `canvas.css`,
and both can be proven with the existing `prove-all.mjs` screenshots at 1920×1080.

**Picked 2026-11-24: WA23 and WA24.** Weibao: "add the I1 and I2 ideas to the atlas ideaboard, can we start work
by coordinating the codex and sending them out to work on those?" Two Codex lanes build the data and tooling
outside `prototypes/world-atlas/`: a slot-evidence file and builder for WA23, and a local passage checker for
WA24. Briefs are in [atlas-slots-passages-2026-11-24](../gm/dispatch/atlas-slots-passages-2026-11-24/). The atlas
platform session owns the atlas UI and wires both in.

## Implementation workspace proposal (2026-11-24)

Use the World Atlas as the place to find a world, choose a playable improvement, and return to its evidence.
The library and readers own source findings. The game and its packs own behavior. The idea index and lane
checkpoints own proposals and work state. The scenario registry and task receipts own replay and proof.
The Atlas joins those records by their existing IDs and links back to their owners.

**F1 · A fresh build can still show old evidence.** The default local snapshot was built November 22 UTC
on `f7b037688`. A scratch build on the November 24 working tree at `db24d3a92` exited 0 with zero
projection failures. Both read the November 14 Progress Atlas report. The snapshot records HEAD, so it
does not identify which working-tree edits contributed. The server loads most projections at startup.
Show the snapshot date and dirty-tree state, the date of each imported report, and any unavailable inputs.
Refresh with the existing batch builder and reload the served snapshot.

**F2 · Source and game are already connected in specific places.** Making links reader workings to game
rows and distinguishes recorded data from bound commands. A bound command still needs a play receipt to
establish what a player can reach and use. The placement Workbench can produce a scratch pack and a diff.
Keep that candidate pattern for content types that already have a compiler. For runtime changes, hand off
through the owning module and existing task record. See the [translation layer record](ATLAS_TRANSLATION_LAYER_PROPOSAL_2026-11-20.md).

### First useful pass

1. **Refresh and show provenance.** Build on demand and at the end of a relevant reading or delivery task.
   Show changed source rows, new runtime bindings and new play receipts separately where the inputs support
   those distinctions. A stale report or an unmapped item stays visible.
2. **Add a Workbench implementation view using WA8 and WA12.** A short list of active work links each
   player outcome to its world or shared system, source or design record, game owner, current gap, named
   scenario and proof. Reuse IDs from those owners. A proposal can link to an idea before a lane exists.
   A shared system can appear under multiple worlds with distinct player routes and outcomes.
3. **Pilot on Watchcraft.** Show the verified rehearsal, skilled patrol and report as existing play.
   Link the [browser receipt](../audits/WATCHCRAFT_HANDOFF_REPLAY_2026-11-24.md) and surface the open
   next-day question from the [vision review](../reviews/OOPS_DESIGN_DIVERGENCE_2026-11-24.md#round-4--why-come-back-tomorrow).
   Register the earned pre-patrol starting point through the existing scenario registry. From the Atlas,
   a developer should be able to find that start, replay the patrol and another evening, and locate the
   evidence and the intended next change from the same card.

After the pilot, check the same view against Hogwarts potion preparation or an active foundation case.
Expand by adding links as work is picked up. For older records, backfill where a missing link blocks a
real decision. Refresh and show changed inputs before building a historical diff view (WA16). The
[project build order](../../PROJECT.md#current-focus) continues to determine which work is active.
### Reading coverage by chapter range, November 25

Preflight (AD34, AD36, PRF5, PRF7). In the 1920×1080 developer Atlas, open a world's Reading lane and select Read. Inspect a reading pass by book key and chapter range, then follow the collected records. The existing shard registry and pass-completion rules own the evidence. Exercise missing, partial and completed output with the record fixture. Older snapshots retain their aggregate counts. Mobile layout and paid reading are outside this desktop slice.
Verified with headless Chrome at 1920×1080 using a fresh localhost origin and a two-chapter LOTM fixture. The people pass showed one collected range and one awaiting output. The people link opened People. Browser Back returned to Reading, where the scenes link opened the collected scene and its six related subjects. The seven record routes and sealed exclusions passed. All 18 reader-findings tests passed. This checkout had 152 registry keys and zero prepared shards; the fixture demonstrates the UI, not a new private reading.

Library → Reading outputs now filters files by book, chapter range, pass and status, opens their matched records, and downloads references on the current page. Chapter-range scene links open the scenes read in that range. The [field coverage matrix](ATLAS_BATCH_FIELD_COVERAGE_2026-11-25.md) records projections, known omissions and desktop fixture evidence.

### Reader handoffs and runtime status, November 25

Weibao asked whether the Atlas should serve as an implementation engine and a handoff point for batch readers. Working proposal: use the Atlas to gather evidence, create a scoped implementation packet and point to a real game consumer. The game continues to own the rule that changes a life. A verified input, a proposed interaction, a candidate pack and a player-tested result have different meanings.

- **Source to workbench.** Open Library, select Reading outputs, inspect a file, select a matched record, and expand Prepare a gameplay handoff. Specify the proposed gameplay change, its playable check, and an optional backlog reference. Workbench → Reading handoffs reopens the saved packet. It carries the exact file version, source lines and admitted locators. Identical submissions share one local JSON packet in `work/atlas-reading-handoffs/`. A new world action needs an implementation and a game-side proof.
- **Existing transfer.** The placement tool already builds a local candidate cast pack and a diff. Applying a candidate is a separate step. Making also projects native game bindings for known workings; an Atlas-only record has no implied player command. [Placement tool](../../scripts/atlas/transfer_candidate.mjs) and [working projection](../../prototypes/world-atlas/game-making.mjs).
- **Implementation evidence.** Slumber is a case with distinct milestones: held readings document making, use and maintenance; the game already has making/use actions; upkeep has its own settlement, cost, and native verification. A backlog proposal for another institution or method can follow the same route without promising that the reading is a finished feature.
- **Breadth and ownership.** The existing [idea index](../IDEA_INDEX.md) remains the backlog directory. Link a handoff to its idea owner, then return the gameplay receipt to that owner. The handoff record is a work item, with proposed status, not a second authority over world rules.

**Reader to implementer, today.** A reader writes selected, schema-valid outputs into the registered private book directory. Refresh output files rescans that book. Rebuild the Atlas snapshot with `node prototypes/world-atlas/build.mjs` and serve it with `node prototypes/world-atlas/serve.mjs` to update admitted records. From a matched file row, the reader can download public references in text or structured JSON or save a proposal in the local Workbench queue. The server resolves the proposed record against the current file hash before publishing the packet. A second implementer can open Workbench → Reading handoffs after refreshing the page or read the corresponding packet in the shared checkout. The proposal carries its backlog reference, intended player change and a playable check. A game implementer consumes it through the relevant world or system owner and links the gameplay receipt back to the backlog.

**Backlog directory and returned evidence.** Workbench → Ideas and backlogs searches 443 document or section references, including 101 named backlog documents in this checkout. A reference can point to an open idea, an experiment or a historical decision. Choose an owner there and the next reading handoff in that tab carries its path. A saved handoff can now receive an implementation report with a runtime file, player route and proof receipt. Atlas records both file fingerprints and displays changes on later visits. The originally submitted proposal remains readable. [Desktop report proof](../representations/evidence/atlas-handoff-return-2026-11-25/result.json).

**First genuine returned report.** A reader can follow chapter 127, paragraph 28, low-grade charm upkeep, into the saved Workbench entry and see its actual Slumber implementation. The report reopened at 1366 by 850 with both source and receipt fingerprints current. It credits the native synthetic fixture and describes the remaining earned-entry check. [Reopened report](../representations/evidence/atlas-workbench-2026-11-25/actual-slumber-implementation.png) and [reported files and scope](../representations/evidence/atlas-workbench-2026-11-25/actual-slumber-implementation.json).

**Batch reader submission.** In Reading outputs, select JSON and save references from the page containing your finding. For that export, prepare a JSON array with one object per intended proposal. Copy each exact record `key` and supply `change`, `check` and optionally `backlog`. Run the following against the local Atlas. The result lists each saved handoff route or individual error. The current server checks source identity and line numbers for each proposal. An interrupted or partially rejected submission can be retried with the same input.

```sh
node scripts/atlas/submit_reading_handoffs.mjs references.json proposals.json
```

The directory now also discovers public Markdown owners cited by handoffs. At the November 25 reverse-lookup check, the 443 indexed document and section references gained two such owners. Selecting the Making rules shows both chapter 127 proposals and their separately recorded implementation status. [Backlog-to-handoff desktop proof](../gm/dispatch/play-surface-2026-11-14/ATLAS_IDEA_HANDOFF_LOOKUP_2026-11-25.md).

Readers running unattended can also pass the local record-page URL directly. The CLI requests the same reference projection used by the desktop JSON download and posts the selected proposals to that Atlas instance. The record key, file hash, offset and file lines are checked through the same handoff endpoint. Both entry points returned the identical chapter 128 packet in the [direct submission check](../representations/evidence/atlas-workbench-2026-11-25/actual-batch-handoff.json).

```sh
node scripts/atlas/submit_reading_handoffs.mjs http://127.0.0.1:4178/reading-output-records/lotm1/lotm1c128/rules/rules proposals.json
```

A saved proposal can now recheck the current reading from its own page. It compares the book, pass, output hash, public record route and physical file lines. An edited file, an unavailable file and a missing match on that output page produce different messages. At 1366 by 850 all four genuine proposals still matched after the next chapter joined the snapshot. [Source recheck evidence](../representations/evidence/atlas-workbench-2026-11-25/actual-source-checks.json).

A batch reader may identify the selected record with its Atlas `route` and contiguous physical file `line`, or an exact `fileLines` array. An explicit `contentHash` pins the proposal to the output bytes the reader examined. Book, prefix, pass and kind are checked when supplied. The unedited chapter 128 reader proposal returned the same saved ID as the browser export.

**Idea-level handoffs.** Workbench → Ideas and backlogs now opens the selected public owner on demand. Choose an idea to see its code, source section, wording and the handoffs citing that particular row. Two rows sharing a code remain separate. Selecting a row pre-fills the reading proposal with its exact content-addressed owner reference. [Actual N2 lookup](../gm/dispatch/play-surface-2026-11-14/ATLAS_OWNER_IDEAS_2026-11-25.md).

**Handing off a whole reading batch.** A reader can submit one proposal array spanning different books, chapters, passes and output files. For each proposal include `book`, `prefix`, `pass`, `kind`, the exact public record `route` and `fileLines`, the playable `change` and its proposed `check`. A single `line` also works for a one-line record. Include the output's `contentHash` to pin the version the reader saw. Start the local Atlas, then run:

```sh
node scripts/atlas/submit_reading_handoffs.mjs --batch proposals.json
```

The client looks up the relevant pages and returns the saved Workbench link or error for each proposal in input order. A re-submission covering all four actual proposals across LOTM chapters 127 through 129 returned their original four IDs. Focused checks also exercised a second page, a changed file during pagination and a mixed batch with individual failures. [Four-packet result](../representations/evidence/atlas-workbench-2026-11-25/actual-mixed-reader-batch.json).

**Starting with a backlog idea.** Open an exact entry under Workbench → Ideas and backlogs. Describe what the player can do and how to test it, then save the proposal directly. The proposal retains the exact owner text and its version. An implementer can attach a native consumer, a route to play, and its verification report. Harry's N2 chart-book proposal went through that entire workflow without a reading-output row. [Saved Harry work item and proof](../gm/dispatch/play-surface-2026-11-14/ATLAS_BACKLOG_FIRST_HANDOFF_2026-11-25.md).

**Starting with a place in the game.** The Great Hall's native actions lead back to the same Harry proposal. Open its gameplay receipt section and choose **Find Workbench reports citing this gameplay receipt**. The lookup finds reports whose saved receipt path exactly matches that activity and identifies their reading or backlog origin. It resolves again when reopened, so a subsequent independent handoff can appear alongside the first one. [Great Hall to N2, 1366×850](../representations/evidence/atlas-workbench-2026-11-25/great-hall-backlog.png) and [checked route](../representations/evidence/atlas-workbench-2026-11-25/great-hall-backlog.json).

**How to tell what you can play.** Open Workbench → Implementation handoffs. A reader can submit the exact chapter finding and a proposed player action. A designer can start from a backlog entry in the same queue. Open the implementation report for the game code, the starting conditions and the route, then open its playtest for the build tested. This lets one person finish a reading batch while another implements an earlier idea. The game owns the resulting actions, costs and saved consequences. The handoff keeps the trail back to the idea or reading, even when later chapters qualify the claim.

### Scene ideas from comics, adventures and original worlds

Proposal from the November 25 discussion. Keep one current playable situation and a place for future scenes. Choose the next inherited capability by the different decision it makes possible for two people in that situation. The Village watch/relay and Tingen circus comparison are the current pair.

| Idea | What to retain in the handoff | First useful playable difference |
| --- | --- | --- |
| A family waits behind a barricaded door in a Warhammer 40,000 setting | This is the user's illustrative premise. Its author, strip and panel are unidentified. Keep it as an idea until someone finds the actual source. Record whose version it is and what is shown versus inferred. | From inside, do I recognize the voice and open up? From outside, do I identify myself and wait for an answer? The same door, elapsed time, heard words and response should explain both accounts. |
| A D&D adventure in a named setting | Keep the particular adventure, setting, edition or table's house rules and scene locator. The 2014 rules and Forgotten Realms material already catalogued have distinct scopes. | A messenger who knows the innkeeper and a newcomer with a relevant spell can gain entry by different means. The interaction still works for a character with neither advantage if someone opens the door. |
| An original world | Write whose need brings them here, what each can perceive, what they would ordinarily do and one local rule that could change the result. | Play the day once from each side. Expand the world detail that changes a decision or its aftermath. |

For future reader handoffs, a source link and precise page, panel, strip date or adventure section can preserve a short scene for later. Attribute the creator, identify official material, fan continuity, or an original illustration, and mark invented alternatives. A fan work can anchor a life set in its own version. Capture qualified candidates as encountered; a comprehensive media crawl is a separate decision. The decisive promotion is a native playthrough in which doing something differently changes another person's opportunity.

### Find a record from a name or rule

The November 25 desktop UI request concerns the route from a remembered term to the underlying entry. Target 1366×768 and 1920×1080. Exercise global search from the home page, narrow by record type/world, inspect the detail and go Back with the query intact. Include a failed search and recovery. For the cheat shelf, preserve its own family/search on Back and let an exact catalogue ID open a reading view with the two decisions, evidence and implementation details. CTC21 and CTC64 have explicit native-results links. The mobile layout and additional source acquisition are outside this desktop check. Design references: DSG3, UR9, AD36.

Systems comparison rows now show the number of located campaign matches per world and one source citation. The campaign census lists the selection criteria, coverage gaps and precision review.
