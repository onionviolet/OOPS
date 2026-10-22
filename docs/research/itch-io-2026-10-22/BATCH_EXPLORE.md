# itch.io batch: exploration, sites and dungeons, 2026-10-22

Genre audit against the site and exploration rules ([SR1-SR24](../../SITE_AND_EXPLORATION_RULES.md)).
All titles below were new to the repo docs (title grep over `docs/`, private excluded).
Everything is a proposal (AD32). No license is stated on any page read, so ideas only.

## Screened (about 60 listed, 30 considered, 8 read)

Sources: itch.io html5 tag pages for exploration, cartography, expedition, travel and 7drl (first pages only; text-based and dungeon-crawler tag pages returned 403, not retried).

Read (below): Mountain No Reason, PokeQuest: The Trail, The Path Past The Mountain, Coop Catacombs, Astroecologist Roguelike, Cartographomancer, Stoneheart Archive, Emerald Woods.

Screened by listing line only, no new mechanism or off-genre: Cartographer Journey (map scale as 90-second traversal, Unity, jam), The Unruly Spheres, Captain Peggles, Expedition: Artifact, Walk on Thin Ice, Dank Tomb (PICO-8 corridor puzzles), EverythingRL (Rust wasm, free item combining), Mito, Project SUBURBION (subway trading roguelite), Wender, Routeka, Wheel and Wander (bikepacking life sim, real routes), Kadath Express Travelogue, LDRP:CC (caravan), World Explorer (sailing), Indiana Bones, Magpie, Crypt of the Bone King, 4KRL, Gar's Den, Reflector, Monster Trainer RL, Fossil Quest, Kenzu, Terra, Witherspring Wilds, Green Memories, Spelunky Classic HD, Carillon. Two worth a later look if the queue is short: Wheel and Wander and Project SUBURBION.

## Mountain No Reason (jpojecp), plain JS, readable
Build: html-classic 6920409, `mtn.js` 596 lines, `data.js` 410 lines, createjs plus seedrandom. License none stated.
- **Systems (source):** a day-seeded draw-a-map toy. The seed is the calendar day count since a fixed date (`mtn.js:88-92`), so every player gets the same map on the same day. Thirteen oval areas on a fixed grid; 3-6 big and 3-6 small are active, the rest are pre-finished blanks (`drawInitialAreas`, 157-208). Each active area gets a prompt built from a shared mood (3 per map), a biome (3 per map) and a feature picked without repeats from the feature list (`data.js`). The center area is always the same dry prompt. An area counts done once it holds at least one stroke (`finishArea`, 406-418); the map completes when all 13 are done.
- **Representations:** the map is a set of closed-in zones you zoom into one at a time (`chooseArea`, 251); prompts are one short noun phrase, not a spec.
- **YAIR mapping:** SR7 (map as a scoped artifact: this one is an authoring toy, not a knowledge artifact), SR2 (a site needs only the detail the chosen experience uses). A site card made of mood plus feature plus terrain triples shared across a region is a cheap generator that keeps a region coherent; YAIR `src` has no such shared-triple prompt (grep: no match). Worth playing: no, as a game; a two-minute look at the prompt data is enough. Play should confirm: whether the shared mood per map reads as a coherent region.

## PokeQuest: The Trail (PokeQuest), plain single HTML, readable
Build: html-classic 19477857, one 4.6 MB file (images inline), about 1,540 lines. Oregon Trail structure, Pokemon-flavored.
- **Systems (source):**
  - A 100-day clock over 3,000 miles with 9 named stops (`STOPS`, line 71). Region changes foraging tables and text by mile band (`region`, 82).
  - Pace choice each dawn: easy, steady, push, each tied to battery (the limiter) with health as the price; a second leg the same day costs 1.5x battery and a flat health loss (`TUNE`, 97; `ride`, 509). Rest and forage and fish are once per stop (`stopAct`).
  - Daily weather roll (clear, rain, heat, cold) changes which events can fire and adds health costs (`rollWeather`, 216; `afterRideLeg`, 532).
  - **Scout before you commit:** a road fork where one branch is good and one bad; the safe third option pays 5 miles to reveal which is which (`evFork`, 1119). Information has a stated price and is accurate.
  - **Rumors raise find odds:** heard rumors add about 4 points each to the roll for a specific hidden find (secret shortcut, orchard, hot spring), and each find is consumed when found (`searchArea`, 714). Search itself is a risk roll with injury outcomes that cost a day.
  - A short rolling journal of 40 lines feeds a copyable trip story (`jlog`, 110; `storyText`, 176).
  - Local-storage run records (`getRecords`, 1254).
- **Improvements:** a `hard` flag shortens all mile ranges rather than adding new content; the developer comment says battery tracks miles by design.
- **YAIR mapping:** SR6 (lead versus location versus method: a rumor here is a lead that changes odds, not a location), SR8 (paid information grants only what the channel supports: the ridge scout reveals one fork), SR13 (cost declared before commit), SR14 (declared stop and withdrawal costs), SR21 (day clock, pace). YAIR `expedition_content.js` has a Scout entry but grep found no odds-shifting rumor or priced-scout fork. Note the fork resolves by a hidden coin flip (SR13 would want the uncertainty declared); and the search roll can injure with no warning (SR14 risk). Worth playing: yes, 15 minutes. Play should confirm: whether the rumor odds bump is perceptible or only noticeable in the journal.

## The Path Past The Mountain (Kevin Hutchins), Unity WebGL, page read only
- **Systems (stated, not decoded):** an alien-world path explored with a compass and a pedometer only; the player records the map outside the game on paper using a downloadable rules sheet. Paths carry identifiers so a player can re-enter a known path. A portal opens for five minutes at each full moon.
- **YAIR mapping:** SR7 and SR9: knowledge comes from named instruments (heading, step count), and the player keeps the artifact. Closest match to "maps only show what you know" because the game hands you measurements and no map. SR20/SR21: a scheduled window (full moon) as the access clock, with a forced return on sleep. Not decoded (Unity). Worth playing: yes, 10 minutes. Play should confirm: how the step counter's error behaves and whether a path identifier makes a path revisitable unchanged.

## Coop Catacombs (AikonCWD), Godot 3.5 client with PHP and MySQL, page read only
- **Systems (stated):** one shared dungeon for everyone, played asynchronously. Players leave wall messages (true or misleading), dropped gear at death, bone piles, optional ghosts, a graveyard, and a champions' stone. Finishing it spawns a deeper dungeon for all. Items must be identified by use.
- **YAIR mapping:** the closest thing to "return to a changed place" with a cause: change comes from other agents' recorded deaths and notes, not from a refill timer (SR20). Fits SR5 (marks are claims, some false; keep evidence separate from truth) and SR19 (access does not grant ownership). YAIR is single player (AD22), so the transferable idea is NPC or past-life traces, such as an heir or a previous life leaving notes and a corpse in a site. Not decoded (needs a server). Worth playing: yes if it can be reached; the server may be offline. Play should confirm: how often wall messages lie and whether the dungeon actually changes between two visits.

## Astroecologist Roguelike (Jay), Unity WebGL, 7DRL 2022, page read only
- **Systems (stated):** islands regenerate on each return; species keep daily routines (some hide by day, some are nocturnal); you subdue animals with a tranquilizer and push them; containment units are opened from the ship. Eleven species. The author states a knowledge log was cut, so knowing a species is observation only.
- **YAIR mapping:** SR12 (output has a reader: captured animals feed a station), SR20 (animal schedules as a change clock instead of a refill), SR10. A cut knowledge log is a useful negative: a site can be rich with no codex. Worth playing: maybe, 10 minutes. Play should confirm: whether routines are readable from behavior alone.

## Cartographomancer (Infohazard Games), Godot, GMTK 2024, page read only
- **Systems (stated):** you draw a map with a compass and step counter at scale; NPC travelers follow it, safe if accurate, lost if not.
- **YAIR mapping:** SR7 and SR8 from the other side: the player authors the map and its errors have consequences for someone using the copy. Pairs with the idea that a copy keeps its source lineage and carries the author's error. Worth playing: yes, 10 minutes. Play should confirm: whether map errors come from the player's measurement or from a scoring rule.

## Stoneheart Archive (chaostheorygames), Unity, AI-assisted code disclosed, page read only
- **Systems (stated):** a walking castle you route; you leave it to scavenge and search ruins for lost knowledge, then race back; knowledge levels you up; settlements trade, repair and can be restored. Reward scales with distance, with a stated return race.
- **YAIR mapping:** SR14 (declared withdrawal) and SR18 (restoration with a purpose). Page does not say how unexplored areas are revealed. Worth playing: low priority. Play should confirm: whether "restored" settlements change on return.

## Emerald Woods (slashie), PixiJS bundle (1.5 MB), page read only
- **Systems (stated):** solo survival in a generated forest with seasons, caverns, underwater caves reached by diving, and abandoned experiment buildings whose documents reveal a former company's fate; the explanation changes per game.
- **YAIR mapping:** SR2 and SR5: a hidden past that is re-generated per run, discovered through documents. The reveal-by-documents design fits sealed-secret rules ("Sealed secrets" in AGENTS.md). I did not find the game code in the bundle, so none of this is source. Worth playing: yes if the past really changes per run. Play should confirm: whether two runs give different explanations from consistent clues.

## Top findings
1. **Priced, accurate scouting plus consumable rumors** (PokeQuest, source): scouting costs a stated amount and reveals which branch is good; rumors shift specific find odds and are consumed. Maps to SR6, SR8, SR13.
2. **Instruments instead of a map** (Path Past The Mountain, stated): heading and step count are the only readouts; the player owns the map artifact. Maps to SR7, SR9.
3. **Traces of other agents as the change cause** (Coop Catacombs, stated): notes, bones and ghosts, some of which lie, change a revisited site without a refill timer. Maps to SR5, SR20.
4. **Map copy errors have consequences for the user** (Cartographomancer, stated): the author's measurement error steers someone else. Maps to SR7.
5. **Shared mood plus biome plus feature prompt triples** (Mountain No Reason, source) as a cheap coherent-region site generator. Maps to SR1, SR2.

## Verification
Read: source for Mountain No Reason (mtn.js, data.js heads; seeding, area selection, completion) and PokeQuest (index.html: stops, region, pace, weather, dawn, ride, arrival, search, fork). Page text only (via fetch summaries) for the other six. Not read: engine builds of Unity/Godot titles; Emerald Woods game code; text-based and dungeon-crawler tag pages (403). About 30 tool calls. Raw files, hashes and notes in `private/explore/`. Nothing committed; no game code run.
