# itch.io decode batch: non-cultivation life sims A, 2026-10-22

Proposals only (AD32). Static reads of served files; no game code run, no native downloads. Paraphrased; identifiers only. Deep notes, hashes and line locators: `private/BATCH_LIFE_A_TRACE.md` (gitignored). Developer claims checked: `private/itch_lane_lifesim.md`. Not re-reported: the screen report's I1-I12.

Labels: `source` = found in code or data. `stated-not-found` = claimed, not found. `refuted` = code says otherwise.

## Incremortal (Godot 4.6.1 web export, pack v3, compiled scripts decoded)
Build 18258895, `index.pck` 10.8 MB. Readability: engine-compiled; all 36 scripts decoded with the project's Godot tools, 0 errors. License: none stated (ideas only).
- **Systems**
  - `source`: health is the clock. Decay grows 20% per minute alive, so life length is capped by design; at death the pending HP bonus (same 1.2^minutes curve, minus 1) is added to permanent max HP. A long life buys a tougher next one.
  - `source`: skills reset to level 1 each life; instincts (a second, slower track per skill) are saved and restored across death. Skill multiplier is 1.05 per level, instinct 1.01 per level, so reset skills are the fast lever and instincts the slow floor. Claim verified.
  - `source`: automation unlocks per task after a completion count that persists across lives; priority is a per-task integer (branch choices default 0, others 3), editable in a menu; the planner queues missing material gathers itself. Claim verified.
  - `source`: lethal cap. A task whose completion damage would kill is blocked or stopped short unless nothing safe remains.
  - `source`: mutually exclusive choices are data (`branch_group` + `branch_choice`, hidden once taken, flags reset each life), so "one path per life" is verified; the example pair costs 80 HP on completion.
  - `source`: New Game+ shop of nine echo upgrades (cheaper xp, head-start instinct levels, slower decay, shorter automation thresholds). Echoes are paid for clearing a cycle, scaled by automations unlocked.
  - `source`: three acts; an act transition clears items except food and mana.
- **Representations**: death screen lists HP gained, instinct gains, milestones, and milestone times against the previous life (`ui_death_screen.gd`); a milestone panel and active-effects strip exist.
- **Improvements**: the lethal-cap and food-emergency pivots (auto-requeue the current task when food is found) read as fixes for idle-death frustration.
- **YAIR mapping**: AD15/AD16 (routines run away, stop at choices), `src/home_staff.js` routines. A "completion count unlocks a standing routine, kept across lives" rule and a lethal-task guard for away time are the transferable parts. Not grepped in depth: whether YAIR already blocks lethal routines offline.

## ONE CLICK, ONE YEAR (plain JS, 6 files)
Build 19869445-2172962. Readability: plain, commented. License: none stated.
- **Systems**
  - `source`: each click or auto-click advances years; idle for 4 s and she lives at her own pace (8 s per year). Six scripted lives with named daughters, a seventh generic profile, 80-91 year lifespans.
  - `source`: per-life shop resets (auto-clicker, fast forward, promotion). Heirlooms are permanent (pocket watch, family business salary x2 in three levels, trust fund starts at 18, better doctors +6 years, plus three "slow" items that pay for not hurrying: rocking chair, photo album, grandfather clock).
  - `source`: skips each sell a named memory (childhood, recital, weekends, wedding, hospital) for money or salary multiplier; a skipped moment gets a stamped card and a later line from her.
  - `source`: wealth tier 0-3 comes from family fortune (25k/250k/600k) or her own salary (60/240/1920), whichever is higher; rooms and clothes are baked per (life stage, tier); the house bought at age 38 follows the tier. Claim verified.
  - `source`: an `asked` counter records lines where she asks you to slow down; each generation writes a record (death age, earned, asked, stayed) and a one-line note chosen from it. Claim verified.
- **Representations**: a family tree of records; the player's own pace is the moral axis.
- **YAIR mapping**: `src/home_inheritance.js` and `src/heir_inheritance.js` already carry wealth across generations (not re-audited). New: a per-generation record whose note reflects how the player treated that life, and home look keyed to wealth tier with in-life updates.

## Lifeidle (plain JS, Firebase leaderboard)
Build 17538318. Readability: plain. License: none stated.
- **Systems**
  - `source`: eight stages (newborn to elder, plus an "ascension" stage with biotech themes); each stage has timed activities that add ranged stat gains; the elder stage is one year long and extended by upgrades.
  - `source`: traits are assigned at stage end from stat conditions (`traitChecks`), each with a removal cost.
  - `source`: Life Points = sums over stats, traits, career tier, life satisfaction, peak wealth (divided by 2000), children and their happiness, elder stories and wisdom shared, plus a legacy bonus.
  - `source`: legacy looks only at the last three lives and counts a life as well lived by a test that, for elders, requires full reflection depth rather than money; bonus capped at 10. Permanent upgrades are bought with Life Points (child, teen, adult stage entry bonuses).
  - `source`: global leaderboard via Firebase (online dependency).
- **Representations**: past lives list (12 shown); achievements with discover-milestone hooks.
- **YAIR mapping**: legacy judged by "was the life well lived" rather than raw wealth is a useful proposal for `src/lore_history_state.js` or heir bonuses. Trait-at-stage-end with a removal price resembles body progression; not checked for overlap.
- Round 2 corrects the first pass: eleven system scripts had been missed. See Audit round 2 below.

## Beggar's Life (Unity WebGL, data in TextAssets)
Build 17976650/web35_00_03, `.data` 39.6 MB. Readability: engine-compiled code (not decompiled); the game's data is 32 plain JSON text assets, fully readable. License: none stated.
- **Systems**
  - `source`: content is declarative: 538 tasks, 77 resources, 36 classes, 57 encounters, 57 furniture, 16 locations, 15 houses. Gates are expression strings (for example a tier tag and a skill level) in `require`; `lock` lists tags a taken item closes.
  - `source`: classes unlock by requirements, not by choice. Taking a tier-0 class locks other tier-0 classes (tag `t_tier0`); church routes lock the beggar tags and vice versa (`jointhechurch` locks `beggary`). "Paths close others" verified.
  - `source`: feelings are resources tagged `emotionry` (loneliness starts full, happiness, sadness, sorrow, gratitude, guilt) with small caps; each feeds other caps (sadness and sorrow raise a supplication cap, loneliness lowers happiness cap). Fear, boredom, irritation are separate "stress" resources. Claim verified.
  - `source`: cat district route shows a late-added path: path items cost a prestige resource, grant skill points, and gate classes and houses; a cat class and a cat house exist.
  - `source`: ten "ending" tasks (90 s long, expensive in several feelings and counters), each tied to a character reading (cat, fire, church, charity, disease, winter gift).
  - `source`: prestige commons: a shared-instinct currency buys speed-ups; the demo has path unlocks priced out of reach.
  - `source`: population, fatality (deaths you caused raise a guilt cap), season/winter, disease ladder (weak to superheavy, degeneration).
- **Representations**: 6 achievements named after classes; hints (31); a layout JSON for a data-driven UI; seven language files.
- **Improvements**: version-numbered data patches (v15 to v38) layered over a base show additive content updates without breaking saves; the file names are the changelog.
- **YAIR mapping**: AD38 and a tag-lock grammar (`require` expression, `lock` tags) is a compact way to express "taking this closes those" without a permission list. Feelings as capped resources could live under body or lore state; not grepped for an existing emotion resource.

## Lowmoor (plain bundle, large)
Build 19768891, `lowmoor.js` 2.8 MB, one line (esbuild formatted to read). License: none stated.
- **Systems**
  - `source`: away-time catch-up cap is 3600 x (4 + up to 20 levels of an upgrade called the Night Clerk). So 4 h base to 24 h. **Refuted detail**: the developer page calls it a hireling; code shows an honour-shop upgrade bought with legacy points ("one hour of absence accounted for" per level). Hirelings exist separately (mule, torch, prentice kinds with ranks, stars and training slots) and do not touch the cap.
  - `source`: catch-up runs the simulation in a loop with a guard, then shows a dialog of kills, gold, quests, bosses, level gained.
  - `source`: a `LEGACY` object holds honours, works (16 village buildings), pets, hirelings known/best, case of specials, achievements, so one hero's run feeds a village record.
  - `source`: weather and festival calendar with dated festivals; named recurring NPCs (Hesper, Pell, Wickett) with away and remark lines.
  - `source`: a plain-words toggle (`plainWords`) switches many strings between in-world and mechanical phrasing.
- **Representations**: the chronicle is a log of dispatched text; the plain/world wording toggle is a small UI idea.
- **YAIR mapping**: AD16-AD18 away time and recap. New: the away cap as a purchasable, level-capped building or person effect (the cap rises 1 h per level), and a world/plain wording toggle for recaps (AD17 already allows adjustable detail). Not verified: whether YAIR has a purchasable away cap.

## Town Tycoon (plain JS, ad-supported)
Build 17937664, `game.js` 368 KB. Readability: plain, commented. License: none stated.
- **Systems**
  - `source`: walkable isometric town; 10+ jobs, each with a minigame and production chain (film, edit, upload; coffee; code, QA, ship; DJ; kitchen; bakery; fish; ski).
  - `source`: staff hired per stage with growth 1.9 per hire. Offline: cap is 8 h plus 2 h per house level; staff chains earn at 35% efficiency while rentals, hotel, ice rink earn at full rate (passive by design). Claim verified.
  - `source`: prestige "Retire" gives legacy points = sqrt(followers / 500), needs all four core businesses owned and a follower floor; legacy raises job income 3% per point and permanent buildings 8% per point; jobs reset, buildings persist.
  - `source`: house tier gives +6% income and +2 h offline cap; an ad button doubles offline earnings (monetization hook).
- **YAIR mapping**: home upgrades extending away-time cap and a split of "active work offline at reduced rate" versus "passive property at full rate" fit AD16, AD27; ads and monetization are out. Thin otherwise.

## God of Ashes (single inline HTML, 1,928 lines)
Build 17131995. Readability: plain. License: none stated.
- **Systems**
  - `source`: six phases (silence to dominion), events with weighted choices, resource costs and outcomes, domains that change rules (the death domain stops follower loss and speeds growth), named followers exempt from threat losses.
  - **Refuted**: Maren does not age numerically. Her "gray at the temples" and "old now" lines are story flags keyed to the settlement phase (town, then dominion). A scripted departure event ends the arc (bless, ask to stay, send resources).
  - `stated-not-found`: any offline accounting; the save is a periodic localStorage write with no timestamp logic.
- **Representations**: a log with story-kind lines; an event modal with costed choices.
- **YAIR mapping**: companion aging keyed to the player's progress rather than a clock is already expressible with AD15; no new mechanism. One line only.

## Existence Simulator (TypeScript, Parcel; repo found)
Build 5336149; source repo `jesselawson/existence-simulator`, license GPLv3 (COPYING, README), found through the itch devlog's search listing, not a direct itch fetch (two 429s on the devlog page). Readability: source available. Ideas only; do not copy GPL code.
- **Systems**
  - `source`: days per second = 1 + anxiety per second, so stress speeds up life; anxiety rises, "missed opportunities" are a second counter that actions spend (read, work, blog), crying trades anxiety for missed opportunities; max anxiety ends the game (nervous breakdown path is in the inventory fields).
  - `source`: inventory fields show planned but unused ideas (intrusive thoughts, cannabis tolerance, immortality flag); the author notes some "never did pan out".
- **YAIR mapping**: stress that speeds the world clock is a distinct pacing idea; YAIR time pacing is AD15, which does not mention stress. Satire tone, thin otherwise.

## Top findings
1. **Death as the clock, with a two-speed memory** (Incremortal): decay that grows with time alive, life length converted to permanent max HP, skills reset, instincts persist, standing routines unlock from cross-life completion counts, and a lethal-task guard. Closest map: AD15/AD16 and the routine system.
2. **Tag-lock content grammar** (Beggar's Life): requirement expressions plus lock tags express class ladders and closed paths as data; feelings are capped resources that modify other caps; endings are costly tasks. Fits AD38 (mechanisms, not permission lists); locks here are default closures, so per the design framing they would need dial-and-reason wording in YAIR.
3. **Away time as a bought, level-capped capacity** (Lowmoor Night Clerk 4 h to 24 h; Town Tycoon house tier +2 h with active work at 35% and property at 100%). Clarifies AD18: capacity and efficiency can improve, with a cheap model for it.
4. **Legacy judged by whether the life was well lived** (Lifeidle): last three lives, reflection depth, not wealth; plus ONE CLICK's per-generation record with a note reflecting how the player treated that life, and wealth tier changing the home mid-life.
5. **Stress that speeds time** (Existence Simulator): small, but a pacing lever AD15 does not name.

## Verification
Read: Incremortal pack decoded and `game_state.gd`/`game_data.gd`/`game_config.gd` key regions; ONE CLICK `engine.js` (all rules), `rooms.js` header; Lifeidle stages, lifepoints, progression, traits, game.js state head; Beggar's Life all 32 TextAssets listed, 13 data files summarized by script; Town Tycoon `game.js` lines 1-130 and 181-190; Lowmoor pretty-printed bundle by grep and key regions; God of Ashes events, flags and threat tick; Existence `game.ts`, `inventory.ts`, README (repo). Not read: Beggar's code (il2cpp metadata not dumped), Lifeidle events and trait lists beyond samples, ONE CLICK `game.js` rendering, Lowmoor combat and forge, Town Tycoon minigames, Incremortal task content and story text, God of Ashes economy, Existence upgrades data. YAIR greps were file-name level only; mapping claims marked "not grepped" need a deeper check. About 62 tool calls; itch pages 5 s apart; one 90 s wait on 429.

## Audit round 2 (deeper read, same day)

Weibao approved a deeper audit. New reads: Lifeidle's eleven missed system scripts, Lowmoor's hero and guild structure, Beggar's Life il2cpp metadata strings, Incremortal task counts, and a real grep of YAIR `src` for each mapping claim.

**Lifeidle, corrected and extended** (`source`)
- Ascension (after 60) is four chosen modes: experimental drugs, clone, android, mind upload. Each has its own failure resource (android: power; upload: core integrity; clone: a child-bonus window). Completing Transcendance pays at least 8,000 Life Points. So "how a person outlasts death" is a per-mode survival mechanism, not a flag.
- Children are year-ticked profiles (age, happiness). Their happiness moves each year by partner stability, career stress and whether money is positive, and it feeds Life Points. Up to four children (more in clone mode). They are never played as heirs; the next life is a fresh person.
- Midlife has a crisis meter driven by low health, low happiness, high career stress and having no partner or children; mentorship and prestige lower it; a permanent upgrade softens it. Midlife also tracks legacy projects.
- Elder life review score weights wisdom, happiness, health, reflection depth, stories told, wisdom shared and children; it feeds life satisfaction, which feeds Life Points and the well-lived test.
- Career is chosen from seeds by stats with eligibility, promotion and event handlers; debt spiral and annual net carryover exist.

**Lowmoor, extended** (`source`)
- The loop is a guild. Retiring or finishing a hero pays a pension (2 plus level) in honours and appends a record (name, level, ending, module, race, class, origin, act, elapsed time) to a heroes list. Gold buys 16 permanent guild works on cost ladders of 6 to 10 steps (for example the bell, library, cellar, barracks). Honours buy the 19 upgrades, including the Night Clerk.
- Hirelings persist as a roster with ranks, stars, study and training slots, separate from the hero's life.
- The persistent object is therefore household plus roll of heroes plus hireling roster, with one hero per run. This is the same shape as a house that outlives its people.

**Beggar's Life, extended** (`source`)
- The engine is the author's data-driven "Arcania" model (action runner, housing, exploration, situation executer, speed integration, persistence units per kind). Types for save slots, export and import, and an Archive mode exist.
- The prestige layer is an Archive screen. A heuristic resource (`TOTAL_ITEMS`) counts distinct items seen across lives, and shared-instinct currency is paid at thresholds (20, 40, 60 and so on up to 280). So prestige currency comes from codex completion, not from run score.
- Not decompiled: C# bodies. The data layer is the readable part.

**Incremortal, extended** (`source`)
- 105 tasks with work required, 8 skills (foraging, brawn, building, agility, magic, intellect, social, cooking), tasks tied to locations (world, training grounds, tower, workshop, library), 141 flag gates. Story beats are authored text per flag, so progress is narrated by flags set during a life.

**YAIR verification (grep of `src`, checked 2026-10-22)**
- Away/offline: only a finite prepaid packing proof slice exists (`src/backlog_expansion_time.js`: arm, request, pause, resume, cancel; six wall minutes; paused time earns nothing). General away running is direction only (OD4 in PROJECT.md; "no offline gameplay implementation is claimed"). Banking unused offline time is under consideration with "rates/caps" open. So Lowmoor's clerk and Town Tycoon's house-tier cap are applicable to an open question, not a gap in finished code.
- Feelings: `src/everyday_life.js` states "No mood currency" and uses mood conditions (irritated, unsettled, reassured) on the actor/condition engine. Beggar's feelings-as-capped-resources conflicts with that Village choice; they could still suit another world. Label: alternative, not a correction.
- Succession: `src/home_inheritance.js` conveys personal residences and fittings and a ledger line; household staff and rank do not transfer. There is no per-generation record with an interpretive note (ONE CLICK) and no "well-lived" test (Lifeidle). Both would be additions to the heir route, not duplicates.
- Lethal tasks: lethal guards exist in 28 files, mainly causal story and expedition runtime, so Incremortal's lethal-cap idea may already be covered for expeditions. Not checked for away routines because those do not exist yet.
- Automation by completion count: no `completionCount`-style routine unlock found in `src/home_staff.js` (45 lines, small). Completions fields exist in 65 files (world completion, expansion engine); not traced for routine unlock.
- Wealth-tier home look: no tier/wealth naming found in home files by grep.

**Round 2 candidates** (the brief caps Top findings at five, so these are listed here for the coordinator to rank against the five above, not added to that list; items 6 to 8 continue the numbering)
6. Lowmoor's persistent object (guild works, honours, heroes roll, hireling roster) as a model for a household that outlives one person; closest to home plus heir plus staff.
7. Lifeidle ascension modes as a template for per-world "outlast death" mechanisms, each with its own failure resource, matching AD15's "worlds and lifespans pace differently".
8. Beggar's Archive prestige: currency paid for distinct things seen across lives (a codex-to-currency conversion).

**Round 2 verification**: read Lifeidle `adultSystems`, `midlifeSystems`, `elderSystems` and `ascensionSystems` by function list and key regions, plus `game.js` life-end code; Lowmoor hero push, retire and works ladders; Beggar global-metadata strings (unfiltered noise, one pass); Incremortal task and skill counts; YAIR greps with `rg`. Not read: Lifeidle event pools and trait balance, Lowmoor combat and sea content, Beggar C# method bodies. About 25 more tool calls.

## Audit round 3 (remaining parts read)

Approved scope: read the parts left open in round 2. Tools: the project's Il2CppDumper on Beggar's wasm and metadata (`dump.cs`, 9.2 MB, in `private/beggar/dump/`), UnityPy text assets, Lowmoor's English text catalog (`lowmoor-boot.js` is a 22 MB offline language file; English patch notes saved to `private/lowmoor/patchnotes_en.txt`), Lifeidle event and trait files.

**Beggar's Life engine grammar** (`source`, from type and enum names plus the JSON keys)
- 16 unit kinds: resource, task, house, class, skill, furniture, tab, dialog, location, encounter, situation, dot, hint, tag, achievements, cutscene.
- 13 modifier kinds: max change, rate change, space consumption, lock, resource-change changer, speed, success rate, activate, power, and rate, duration and cooldown multipliers. Lock and activate are modifiers, which is how "taking this closes that" is ordinary data.
- 8 resource-change phases on a task: buy, cost, result, run (per tick), effect, result once, result on failure, max. Tasks carry a success rate and a failure result (7 uses in data).
- Exploration is a location with a length, per-tick run cost, a result, a one-time result, and a list of encounters. Encounters nudge several feelings by random ranges (written like "minus 1 to 3"). One location, "Surface emotions", is an inner place: you explore your own boredom, sadness, frustration, joy and anxiety as encounters. Introspection as a place is a representation idea.
- Stressors are marked resources (fear, boredom, irritation); the model holds the current stressor list during exploration; `Flee` exists.
- The action runner can interrupt a task and swap, auto-start a rest action, and checks whether continuing an action is meaningful before repeating it.
- Housing is a space budget: furniture consumes space, houses supply it, a house change checks fit.
- Prestige is a separate saved world. `WorldType` has default character, prestige world and two spare worlds, each with its own persistence record (main, archive, misc, skill, task, exploration, ui flags). The archive counts distinct ids ever seen per unit kind (tasks, powerups, classes, resources, skills, houses, furniture, locations, total), saved separately from the main run. This confirms round 2's reading.
- Every task has a buy status (free, needs buy, bought) and an unlock-notification state (locked, unlocked and unseen, unlocked and seen), so "new thing" markers are in the model, not the view.
- The shipped build is a demo (prestige world has locked paths priced at 999). Full content is on Steam, so claims about later content stay `stated-not-found`.

**Lifeidle events and traits** (`source`)
- 152 event definitions across four stages (41 general, 43 teen, 40 adult, 28 elder). Two kinds: forced events fire when a stat crosses a threshold (burnout at stress 78, debt notice when money is below zero, health crisis at health 28) and weighted random events with requirements. Events grant traits (burnout, health-conscious). No player choices are coded in these files.
- 122 traits: 68 positive, 22 negative, 11 mixed; by stage: newborn 11, toddler 7, child 9, teen 31, adult 21, midlife 13, elder 18, meta 12. Negative traits can be removed for a stated cost; conditions are evaluated at the end of the stage.

**Lowmoor changelog, read as developer-explained improvements** (`source`, English patch notes)
- A retirement-loop exploit was closed: Vale prestige now pays only after Chapter I, and the prologue's 20 points moved there, because "rapid retirement" combined with the Old maps upgrade farmed prestige.
- Active saves receive retroactive differences when a reward formula changes (completed chapters, recorded work, completed expeditions), while retired chronicles keep their existing records. So finished lives are frozen history and living saves are adjusted.
- The Sea map keeps surveyed nodes for later heroes ("inherited surveys") but pays no skill-point bonus again: knowledge persists, reward does not repeat.
- Training for reserve pets and hirelings runs online and offline, survives retirement, and does not add active slots; serving hirelings pause reserve training.
- Rests were retuned: camps can be prevented, and empty camp supplies send you to town only below 50% HP, with tooltips explaining the thresholds.
- Sea action speed scales at 100%, 50% and 25% with soft minimum thresholds, replacing hard minimum durations. Combat results now show at the end of each round, with durations and rewards unchanged.
- Gold labels were clarified: completion gold is total earnings, and gold earned while away is shown before spending.
- Layout presets (panel order, heights, collapsed panels, information bars) can be saved, renamed, imported and exported; a UI size slider and a language choice sit in Options.

**Round 3 mapping additions**
- A shared "known ids ever seen" archive per kind, with its own save, fits YAIR's chronicle and lore history; I did not grep `src/lore_history_state.js` in depth, so whether such a count exists is unverified.
- Closing prestige exploits by moving a reward to a later milestone (Lowmoor) is a pattern for AD22's firm lines (save integrity and real-world guardrails), not for balance.
- Retroactive adjustment of living saves while retired records stay frozen matches the project's persistence rule that changes need a migration or an explicit compatibility decision.

**Round 3 verification**: Il2CppDumper ran cleanly (metadata v31); read enum and class definitions for the Arcania model, archive data and persistence, and 16 unit kinds; sampled locations and encounters from the JSON; counted event and trait files in Lifeidle; extracted 70-plus English patch note lines for Lowmoor. Not read: Beggar C# method bodies (the dump has names and field offsets only), Lowmoor combat formulas and sea node text, Lifeidle event prose beyond samples. About 12 more tool calls.

## Audit round 4 (each game's remaining parts, read per game)

**Existence Simulator** (`source`, repo files)
- Content is 16 unlock upgrades and 45 timed research upgrades in seven panels (express yourself, do something, spend your money, try your best, create something, blog, podcast). Research takes seconds of real time; reveal triggers fade in the next panel with help text.
- The player's own embedded idle clicker lowers anxiety per second the more they play it (a game inside the game relieving the stress that speeds the clock).
- Worldwide players are capped at 100 million until in-world laws are passed (six legislation upgrades), so the cap lifts through action in the world, not a counter. Immortality is a state flag at the end. Cannabis raises then slowly restores anxiety per frame (a temporary modifier with a come-down).

**God of Ashes** (`source`)
- Twelve resources appear as phases open (essence first, aurite last); 17 miracles with cooldowns and prices (the cooldown of one, Divine Vision, resets only when you have grown); seven domains that state rule changes outright (for example followers never die; war guards never die to threats) at prices in worship, essence and a local resource. Events carry weights, a phase, optional once-only flags, and costed choices.
- Named followers are exempt from threat losses; unnamed ones are the loss pool. Maren's arc is flags by phase plus one departure event. No offline code or timestamps.
- YAIR mapping: domains as costly, stated rule changes match the "default, dial and reason" framing (a world's absolute becomes an option with a cost). Named-versus-unnamed loss pools match how YAIR treats named household members; not grepped.

**ONE CLICK, ONE YEAR** (`source`, `engine.js` remainder)
- Money carries across generations; heirlooms are bought with it. The goal is 1,000,000. The fifth life's daughter-line can end the family: the sixth life refuses a child unless you pay 50,000 to persuade her, and the ending differs by whether you watched or clicked her through it by hand.
- A "rewind" option appears at 30 memories and 200,000 money: money resets, the loop count rises. Skips mark a life as empty if all of its offered skips were bought.
- Telemetry hooks (`stat`) record per-life events (this build sends stats via a hook; destination not read).

**Incremortal** (`source`)
- Act 1 (kitchen worker) is a chain of narrative tasks tied by flags: gather straw, wood and cloth, build a bed frame and mattress, mimic apprentices, steal one of two books (each costs 80 HP), decipher it, enchant the broom or mop, sneak past a guard, then a master's offer ends the act. Act 2 adds lectures, a midterm, greenhouse, cooking, resonance lab, workshop, training grounds and a tower; ~80 authored story beats.
- Materials for buildings are spent progressively (build-spent tracking per task) and cleared when a plan changes.
- Each skill has two levels (skill and instinct), shown together as a total level for gates.

**Lowmoor** (`source`)
- Three modules (the Maw, Vale, Sea). The Sea opens when cumulative hero time across all heroes passes 200 hours or Vale is finished, so unlocks read the whole guild's history, not one run.
- Twelve D&D-style classes; foes come from a stat table (armor class, HP, attack, dice) scaled by an expected-level table for levels 1 to 45; fights are scripted ahead of time and replayed round by round, online and offline alike (patch note: results appear at the end of each round).
- Sea: 26 nodes in chapters with two work kinds (physical, survey); surveyed nodes persist as an atlas.

**Town Tycoon** (`source`)
- Each station has a short minigame (tap-fill bar, weighing sweep, timing) and a "perfect" bonus; daily rewards, diamonds and ad doubling are engagement hooks. Houses give +6% income, comfort rooms add stamina only. A rink build runs 3 minutes times the next level, offline included. Out of scope for YAIR beyond the offline split already noted.

**Lifeidle** (`source`, event files)
- See round 3 for events and traits. The elder stage runs one year by default and is extended by permanent upgrades, which is the same lever as Incremortal's decay and Town Tycoon's offline cap: lifespan or away time as a purchased capacity.

**Beggar's Life** (`stated-not-found`)
- C# method bodies cannot be read statically here: the dumper gives names and field layouts, `script.json` gives addresses only. The behavior is recoverable from the JSON data instead, which is what rounds 1 to 3 used. A wasm disassembler would be needed for more, and that is out of the brief's allowed tools.

**Round 4 verification**: Existence upgrade data and game loop (lines 913-960), God of Ashes data blocks (resources, buildings, miracles, domains, events), ONE CLICK `engine.js` lines 422-452, Incremortal task names by act (about 80), Lowmoor module and class constants plus combat setup lines 925-931, Town Tycoon minigame functions. About 14 more tool calls. Not read: Lowmoor prose of the sea nodes, Lifeidle event prose, Town Tycoon fishing and ski systems, God of Ashes event prose.

## Audit round 5 (tool pass on Beggar's code, and YAIR checks closed)

**Beggar's Life code, tried with the project's Cpp2IL (prerelease 21)** (`stated-not-found`)
- Cpp2IL ran cleanly on the wasm with the metadata and the framework file (Unity 6000.0.65f1). The C# output has signatures and attributes but empty bodies ("call analysis not supported" for WebAssembly). The ISIL output gives raw WebAssembly instructions per method (the action runner alone is 137 KB), and the callee numbers do not match the dumper's address table, so the calls cannot be named. The wasm-mapping output format crashed. Ghidra is installed but has no wasm loader checked in this session. Conclusion: engine internals (how lock and require expressions are evaluated, how offline time is handled) stay unread; the type names, enum values and JSON data from rounds 1 to 3 are the reliable evidence. Outputs are in `private/beggar/cpp2il_out` and `cpp2il_isil`.

**YAIR claims checked against `src` (previously marked not grepped)**
- Routine unlock by completion count: `src/home_staff.js` handles finite, funded staff orders (cook, repair, dry, gather) that the player requests at the manor; there is no standing routine and no unlock from repeated completions. So Incremortal's "completion count unlocks a standing routine" is not present. Whether to want it is a design call under AD16.
- "Ids ever seen" archive: `src/lore_history_state.js` keeps a bounded list of story-outcome receipts (limit 96) and pins; it does not count distinct things discovered across lives. A codex count would be new.
- Per-generation record: `src/heir_inheritance.js` writes only estate and debt ledger lines; no interpretive note on how the life was lived.
- These three are gaps in the sense of absent mechanisms. None is a recommendation to build; they are proposals for Weibao (AD32).

**Round 5 verification**: Cpp2IL run three times (diffable C#, ISIL, wasm mappings), one dumper table lookup, three YAIR source reads. About 10 more tool calls.
