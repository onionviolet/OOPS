# Life walk: ordinary play from start to legacy (2026-11-18, dev pass; findings, not decisions)

Purpose: the spine of the ordinary-play wave (PWC128-PWC133). Where does a played life touch the engine laws and `landEffect`, and where could it? Findings only, per AD56; ranked plug points are proposals for build lanes. No runtime code was changed.

## Method and honest coverage

- Tool: `yairpg-game` MCP on this worktree's build (live source, seed 1118), headless. Receipts under `private/` (gitignored): `lotm_day2.save.md` (game_save hash and size) and `hp_landings.json` when the HP walk finishes.
- **Reached by play (observed):** base start (Phandalin Village, amnesia start) from day 1 to day 4, including the elder, first work, a kit-return duty, first fight; a Tingen (LOTM) arrival as a Nighthawk probationer, the Seer dose, the first lesson offer and one day idle. A scripted HP lead walk (`scripts/headless/hp_lead_walk.mjs`) with a counting loader was started; see LW14.
- **Not reached by play (inferred from the area guide and source, labelled so):** ties and household, institutions beyond the patrol ladder, travel, crisis, mastery, legacy. Game speed is the limit: Village 3 days = 147 s wall, Tingen 1 day = 143 s wall, 7 Tingen days killed the session at 300 s (limit reported through `game_report_limit`; ledger now at 78 entries).
- Counting `landEffect`: a Node loader hook (scratchpad, not committed) wraps `landEffect` in `src/effect_host.js` and counts calls by cause and status. A 30-day idle fresh hero gave 0 landings (it was not a real life; idle is a floor in this pass, not the PWC128 headline).
- Per-call MCP output is 5-10k tokens even with `view: compact`, so a full season in two worlds by hand was not affordable in one session. The gap is itself a finding (LW15).

## Headline

**Observed: zero `landEffect` landings from ordinary play in everything reached.** Static check of the callers (grep of `src/`): the only ordinary-reachable caller is the Workshop capability run (`capability_runs_domain.js` -> `world_packs/effects_workshop.js`, a panel the player must open). `gear_ward.js`, `meadow_lantern_ward.js`, `workshop_light_ring.js`, `stored_working.js` and `cost_owner.js` are reached only through those packs or tests; no life action binds a ward or light ring. The Gu working host (`gu_working_law.js` and the `gu_*` keeper files) is reached through Gu Keeper trials, not through a village or Tingen life.

What a played life shows is native YAIR (fights, patrol, talk, skills) plus addressed draws, ambient lines, requests and the world-events panel. That matches the PWC129 diagnosis.

## Stages

Codes are LW1... Each: observed / systems hit / law or landEffect / gaps / ranked plug points. "(inferred)" marks what play did not reach.

### LW1 Start (base, Village, day 1)
- Observed: amnesia start. Elder Hesk and trader Dunstan; a "Lost memory" quest; a four-line talk tree ends in a free starting weapon choice (I took a spear). Next-step box says "Talk to Old Hesk". The Village lists a mixing counter, herb verge, gear workshop, Homes, Tingen crossing and Infested field.
- Systems (from the screen and area guide): native dialogue, quests (Journal), `homes` slice, mixing counter (Potioneering / `Village experiments` panels), crossing (`Worlds`).
- Law/landEffect: none.
- Gaps: the amnesia start has no tie to any catalogue row. 158 actions on screen at first look, mostly panel chrome.
- Plug: the free weapon is a native item; a weapon row could carry an effect sentence through the same joint as strike enchantments (see LW6).

### LW2 First work and money (base, day 1-4)
- Observed: "Find work" offers patrolling with Tessa: a loaned lantern and baton, one round = 2 hours, pays 5 C native (the panel text says "50 base coins", a unit mismatch worth a check). After the round the patrol is blocked until the kit is returned (Patrol & custody panel: Return, or keep it and record a 50-coin debt). A career ladder is visible: Apprentice, "Dependable worker" (2 full shifts, 2 kits returned), and a Watchcraft practice that needs 5 meditation minutes. Tessa remembers shifts. 15 C after 3 days.
- Systems: `recurring_duties.js` (duties slice), obligations/debt slice, institution ladder (`institution_store.js`), person memory (`person_ties.js`), practice (`mastery_pool.js`).
- Law/landEffect: none. This stage is the best-built ordinary loop and has no law.
- Gaps: one chore, one patrol; the ladder is a counter. A debt or a returned kit changes standing text, not the world in the stretch played.
- Plug (rank 5): patrol as a PWC131-style chore hook. A shift calls one `landEffect` (lantern flame: light, fuel burned; baton wear) and the supply-runner request line reports the W quantity.

### LW3 Skills and the first days (base, day 1-4)
- Observed: skills unlock from idle time: Spatial awareness, Night vision, Breathing, Cold resistance. Weather appears (rain, cold) with a Wet debuff and Cold (stamina x0.8, Str x0.9). Ambient lines repeat ("Look, a bird!", "Tomorrow I'm gonna fix the roof", "*You hear some rustling*") across days. "Continuing insight" unlocked on day 3 ("What you learn need not end with this life").
- Systems: native skills, condition effects, ambient pool, `world_events` panel unlocked after the supply-runner request.
- Law/landEffect: none. Wet and Cold are native condition rows, not W quantities.
- Gaps: ambient repetition by day 3. Weather debuffs are the one place a W-substrate quantity (`world_sky.js`: rain, daylight) already exists and could drive them.
- Plug (rank 7): feed the sky quantity into condition rows through one law, so weather is a landing, not a hand-set debuff.

### LW4 Ties, household, home (base; inferred)
- Observed only: Homes panel button (default view only), "Neighbors" panel ("Go back to the Village to use this" away from the Village), Dunstan the trader. I did not open a household or build ties in this pass.
- Systems (area guide): `person_ties.js`, `home_overview_model.js`, `cast_schedule.js`.
- Law/landEffect (inferred): the household ward entry point named in PWC131 has no caller; `meadow_lantern_ward.js` exists and nothing in the Homes panel binds it.
- Plug (rank 3): Homes panel "ward the door/fold" action that calls `bindLanternWoolWard` (or a generic `bindGearWard`) and reports a hit through `settleGearHit` when the Infested-field rats or a stranger test it.

### LW5 First power or craft (Tingen, observed; Village mixing, inferred)
- Observed (Tingen Nighthawk): the Seer dose is allocated at the workroom. 22 offered actions at day 1 (more than the Village): accept or decline the dose, ordinary comparator, two supported sample lots, the Corpse Collector dose (5 pounds, blocked by money), ice, blackout canvas, harpy contract (4 pounds), a lesser spirit messenger, "dwell on an old injury", "play the song you love", a sealed-ledger errand (12 pence, 20 min), a vault request. The dose item `Tingen prepared Seer dose` is taken as an instant act ("Take the dose under supervision (irreversible)"). Result: Spirituality 3/3, Strain 0/6 and a control lesson (1 spirituality, 5 min) and "Ask Hale to teach a weak rite". The system text explains why the second pathway is withheld (switching is a stated cause of loss of control).
- Systems: `book_world_lotm_actions.js` (`ingest` command, the `lotm.holds.dose` gate), `ascension_paths.js` / `progression_path.js` (path), `brew_dose_*` (brewing) exist and are reachable from the workroom bench ("Potioneering"/brewing bench tabs).
- Law/landEffect: no landing seen on ingest (default view; the dose reads as a counter flip because its command sets Spirituality and Strain directly, per the `ingest` command in the source).
- Gaps: a Beyonder potion is the book's centre of gravity and plays as a menu button. No sensation text, no dose-quality variation, no consequence for the sample lots or ice.
- Plug (rank 1): route `ingest` through the dose-response law (`brew_dose_response.js`, `brew_dose_delivery.js`) and land the resulting effect sentence with `landEffect`; keep Spirituality/Strain as the readout. Entry point owned by `entry-points`.
- Plug (rank 4): the 20 optional actions each get an effect row (derived LOTM cases, `lotmDerivedCase` in `world_effect_packs.js`) so harpy, ice and "dwell on an old injury" change quantities the Notebook can read.

### LW6 First fight (base, day 4)
- Observed: Infested field, 15 min away, 15 groups of wolf rats (20 hp each). Fights run on their own; I had the spear in inventory but unequipped, so the hit text read "bludgeoning 0.6". In two hours I went from 40 to 0 stamina and 61 to 26 hp and cleared one rat; titles and skills unlocked (Blooded, Combat, Evasion, Pest killer). Next step box: "Clear the wolf rats". Drop table shown as odds ("a farmer left bread, about 1 in 3").
- Systems: native combat; the village recognizes 2, 4 and 10 clears (a public-standing hook). `tempo_fight.js`, `harm_state.js` and Gu/ward combat laws are not in this fight.
- Law/landEffect: none.
- Gaps: no prompt to equip the weapon (a trap for a new player); an hour-long loop of identical hit lines.
- Plug (rank 6): field-clear milestones (2, 4, 10) land an effect row on the Village (grain saved, rat pressure) and a world-events line.

### LW7 Institutions (base patrol ladder observed; Tingen church teams inferred)
- Observed: the patrol ladder (LW2). Tingen offers three church teams plus a civil post at crossing; Warden Hale's "attention 6" is a meter that a request reserves and returns.
- Systems: `institution_store.js`, `institution_access.js`, `recurring_duties.js`.
- Law/landEffect: none.
- Plug (rank 8): institution rank changes (Apprentice to Dependable, probation to full) emit a `landEffect` of kind label so standing, access and the next offered doses/duties move together.

### LW8 Travel (inferred)
- Observed: a Village-to-Tingen crossing screen ("Crosses with you" and "Stays behind" lists) and, in Tingen, a walking map with strained (blocked until "Report in") nodes: docks 20 min, university 25 min. Fast travel exists in the Village ("Walking map · minutes from here").
- Systems: `travel_legs.js`, `Worlds` panel.
- Law/landEffect: none observed. The crossing could land an effect (body, cheat, memories) and does not.
- Plug (rank 9): crossing as one `landEffect` of the crossing law (memories fragment, body swap) so the list printed on the screen is the same data the world applies.

### LW9 Crisis (not reached; inferred)
- Source: AD50 says run-ending events are announced with two exits; the Tingen deck (`book_world_lotm_deck.js`: `runDeck2`, `runDirector`) draws cards by facts and surfaces one per six-hour window.
- Observed: the deck is derived and save-free; it shows "While you were away" lines (neighbour on the stairs, news-stand headline about coal and dockers, hurrying clerks), not consequences. The Village schema-1 deck and `story_requests.js` produced one request (the supply runner at the well, "offer five coins for their meal").
- Plug (rank 2): the director picks a card and the card carries an effect sentence; `world_events_knowledge` reports the changed W quantity (PWC129). `director-cards` is building this.

### LW10 Mastery (inferred)
- `mastery_pool.js` and practice skills exist (Watchcraft needing five meditation minutes; Patience level 3/10 observed from patrol). The practiced action is a counter.
- Plug (rank 10): a practiced action that has a law lands its effect with a quality from mastery (the PSA27 joint for spells/Gu).

### LW11 Legacy and aftermath (inferred)
- Observed: "Continuing insight" appeared on day 3 ("What you learn need not end with this life"), a Lives and inheritance panel, Remembered years, Beginning. Nothing was carried or inherited in four days.
- Plug: later pass; the ordinary-play wave needs LW1-LW10 first.

### LW12 Ledgers, windows, decks, events, ambient lines (what appeared)
- Coverage-ledger rows: none surfaced in the stretch played (a dial of play length, not a rule). Computed runs (370 of 68,016) fire from the Workshop capability run in this build, by the reason that packs are reachable there.
- Director windows: not seen in the Village (schema-1 deck plus requests, by default); in Tingen the deck is derived and read-only by design (the file header says save-free).
- World events: the panel unlocked on day 1-4; one request (supply runner).
- Ambient lines: Village 3 repeating lines; Tingen 3 "While you were away" lines.

### LW13 Empty or repetitive
- Village ambient lines repeat within 3 days.
- First fight is the same hit line for two hours; weapon not equipped.
- Tingen's 22 actions are menu rows with no sensory result.
- A step of idle time does nothing: with no action, a Tingen day produced three ambient lines and one skill (Patience).
- Display mismatch: patrol "5C" vs "50 coins".

### LW14 HP walk (scripted headless)
- `hp_lead_walk.mjs` with the counting hook was started in the background. Result lines (landings by cause) go to `private/hp_landings.json` if it finishes. If that file is absent the run did not finish in the session; no HP result is claimed.

### LW15 Tool limits met
- Output is large per call (full view is ~7k tokens; compact baseline costs the same). Step speed is 10-30 game minutes per wall second. These cap a by-hand season; the Node runner or a scripted bot (as in `lead_bot.mjs`) is the practical route and needs a landing counter (see plug 10).

## Top ten plug points (ranked by how much ordinary play they would change)

| # | Plug point | Seam and caller file (area guide) | Size |
| --- | --- | --- | --- |
| 1 | Tingen dose `ingest` goes through the dose-response law and lands an effect sentence | Brewing/dose law + `landEffect` joint; caller `src/book_world_lotm_actions.js` (`ingest`), law in `brew_dose_response.js`/`brew_dose_delivery.js` | M (one command, one effect-grammar row, test) |
| 2 | Director/deck cards carry an effect sentence; the event line reports the W change | Situations seam: `story_director.js`, `storylet_deck2.js`; caller `book_world_lotm_deck.js` + `world_events_knowledge.js` | M-L (card schema field + reader; in progress in `director-cards`) |
| 3 | Household ward: a Homes action binds a ward and a rat/stranger test settles a hit | Substrate pack + stored working; caller to add in the Homes panel, uses `world_packs/meadow_lantern_ward.js`, `gear_ward.js` | M |
| 4 | The 20 optional Tingen workroom actions (harpy, ice, canvas, "dwell on an old injury") get effect rows | Derived LOTM cases (`lotmDerivedCase`, `world_effect_packs.js`); caller `book_world_lotm_actions.js` | L (data-heavy, small code) |
| 5 | Patrol shift as a chore hook (lantern fuel, baton wear, report line) | Work and duties seam `recurring_duties.js`; caller the Village patrol job | S-M |
| 6 | Field-clear milestones (2/4/10 clears) land an effect on the Village and a world-events line | Fights + world events; caller native combat clear counter + `world_events_pack.js` | S |
| 7 | Sky/weather quantity drives Wet/Cold condition rows through one law | `world_sky.js` + condition rows; caller native weather module | M |
| 8 | Institution rank change lands a label effect and moves access/standing together | `institution_store.js`/`institution_access.js`; caller the Patrol & custody panel and church probation | S-M |
| 9 | World crossing applies its printed list (memories, body, cheat) as one law landing | `Worlds` panel crossing; caller crossing screen + `travel_legs.js` | M |
| 10 | A landing counter in the headless runner (cause, world, status) so PWC128 is one command | `scripts/headless/` over `effect_host.js`; no ordinary caller is needed, this is a measurer | S (my loader hook is the prototype) |

## Observed vs inference summary
- Observed: LW1-LW3, LW5 (Tingen first day), LW6, the patrol ladder in LW7, the crossing text in LW8, the ambient and deck output in LW12 and LW13, the speed limits in LW15, and the static caller list under Headline (a grep, repeatable with `grep -rln landEffect src`).
- Inferred: LW4, LW9, LW10, LW11 and parts of LW7 and LW8. No claim of play evidence for them.
