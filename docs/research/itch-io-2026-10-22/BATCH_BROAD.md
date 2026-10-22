# Batch BROAD: games with interesting ideas, any genre (2026-10-22)

Follows [the decode brief](DECODE_BRIEF.md). Everything is a proposal (AD32), paraphrased, no code copied. Private notes with line locators and hashes: `private/BATCH_BROAD_NOTES.md`, `private/SHA256SUMS.broad.txt`. Topic: systemic, social, economic, survival, interactive fiction, deckbuilder, detective, cooking and management games outside the idle / cultivation / sect / life-sim / potion / procgen batches. No license is stated on any decoded game, so ideas only.

## Screen (41 titles)

Source: itch `/games/tag-<x>/html5` listings (simulation, immersive-sim, economy, trading, management, survival, emergent, NPC, parser, interactive-fiction, text-based, deck-building, roguelike, cooking, detective). "page" = store page read; "list" = listing line only. Grep of `docs/**` (no `private/`) found none of these titles except those noted as skipped.

| # | Title (author/slug) | Read | One line |
|---|---|---|---|
| 1 | EMERGENT - The Heir (albeus-games/emergent) | page, decoded | Month-by-month dynasty and company life sim with heir succession; the richest find. |
| 2 | Medieval Merchant Simulator (camembert0/mms-m) | page, decoded | Trade and household management with NPC retainers, marriage state, injuries, banks. |
| 3 | No Main Quest: After Hours (liquify420) | page, decoded | NPC chat town; NPCs keep capped memory lists and gate secrets by relationship points. |
| 4 | AI CIVILIZATION - 15 DAYS (neonvoidstudio) | page, decoded | Ten-agent society sim; "AI models" are four trait profiles, not live model calls. |
| 5 | ANTFALL (lynflippen) | page, decoded | Player paints scent for an ant colony; evaporation, rain and a food ledger. |
| 6 | Idle Fantasy Shop (drevengames) | page, decoded | Shop idle where customer societies, tastes and reputation set buy acceptance. |
| 7 | Dominion of Darkness (adeptus7) | page, decoded | Twine dark-lord sim with hidden pairwise tension between four peoples. |
| 8 | GOAP AI simulation, Excalibur.js (mookie4242) | page, decoded | Small lumberjack and bear demo with hand-written GOAP actions. |
| 9 | The Liars' Line (turnstonepass) | page, checked | Five conflicting alibis; embed is a cover page linking to an external site, not read. |
| 10 | Sovereign Tower (wildwits) | page | Recruit eccentric knights, balance egos; embed path 404, not decoded. |
| 11 | Trouble In NPC Town (karesito) | page | Two-player NPC town puzzle; embed path 404, not decoded. |
| 12 | Rum & Timber (azzaxx) | page | 3D Unity pirate colony and trade; engine build, not opened. |
| 13 | Twilight Tower (boz-float) | page | Card roguelite where morality conflicts with survival; Unity, not opened. |
| 14 | Flawed Heist (ventura) | page | Immersive sim, Godot, a god-like NPC helps the heist; not opened. |
| 15 | Necromarket (DaanVanYperen) | page | LD44 shopkeeper and enchanter story sim; libGDX, not opened. |
| 16 | Medieval Merchants 2.0 | prior | Already named in GAME_ABSORPTION_SCOUT as a lead; not this MMS-M title. |
| 17 | Seedship (spacegoblingames) | skip | Already in the itch screen. |
| 18 | Colony Adventure V36 (gamebuegar) | skip | Already in BATCH_SCOUT. |
| 19 | Slipways Classic (krajzeg) | list | Interstellar network builder in 30 minutes; economy chains. |
| 20 | Waterworks! (scriptwelder) | list | Medieval town water supply puzzle management. |
| 21 | Ravenhaul (bippinbits) | list | Raven mail delivery management. |
| 22 | Marketfield (pollikk-studios) | list | Cozy farming incremental with 1200+ upgrades. |
| 23 | Trash Inc. (sunbeam-studio) | list | Recycling yard incremental management. |
| 24 | Urbanitas (not-articulated) | list | City builder; pure builder, no obvious people model. |
| 25 | Doomsday: M.A.D. (stark52) | list | Nations build, trade and war on a living planet. |
| 26 | Metropolis 1998 (yesbox) | list | 90s-style city sim throwback. |
| 27 | Fossil Quest (unsigneddoublecollective) | list | Dig fossils, assemble exhibits, decorate a museum. |
| 28 | Cat Cove Inn (loaflabs) | list | Foster cats to homes; light management. |
| 29 | Uncharted Wanders (dashingstrike) | list | Trading between spiritual and physical realms, for profit. Worth a look for world-split trade. |
| 30 | Von Neumann (veltes) | list | Self-replicating probe incremental. |
| 31 | Prerolled (red-sauce) | list | Cozy dice shop roguelike deckbuilder. |
| 32 | Backpack Hero (thejaspel) | list | Inventory management roguelike. |
| 33 | Dragonsweeper (danielben) | list | Roguelike minesweeper; knowledge-from-numbers puzzle. |
| 34 | Hadean Lands (zarf) | list | Parser IF about alchemical process chains; the genre's best-known crafting-state game. |
| 35 | Anchorhead, Terminal City, Superluminal Vagrant Twin (parser list) | list | Parser IF; world-model references, no browser source read. |
| 36 | Alchemist's Gold, Hangman's Gulch (warrigal, drdooriddle) | list | Small parser puzzles with ingredient and item rules. |
| 37 | Wayfarer, Cantata, Burning Academia, Shepherds of Haven (IF RPGs) | list | Stat-driven interactive fiction RPGs; candidates for a later pass on stat gates. |
| 38 | Teide: Silent Gambit, Midnight Dispatch (detective list) | list | Evidence and testimony games; knowledge-tracking candidates. |
| 39 | Little Chef (truebiger) | list | Physics cooking with discovery of combinations. |
| 40 | Primordia (arcnovaofficial), Shoal (rdug627), Inochicules | list | Ecosystem and chemistry sims; emergent organisms, low fit for a person-centered life sim. |
| 41 | AIMLUS v0.5alpha (charcofangdev) | list | Emergent survival sandbox RPG; unread. |

## Decoded games

### 1. EMERGENT - The Heir (albeus-games)

- Build: itch html5, iframe 19746201, 3.79 MB single HTML, 84 inline scripts, plain readable JS, French/English/Italian text. Demo build of a game whose end screens ask players to follow it until Steam opens ("Keep playing as the heir", free life capped at three years). Readability: plain.
- **Systems (source)**
  - Doing nothing has a price. Developer header says earlier builds let a passive player end richer, calmer and healthier than real people, so V20 added: salary mostly spent via lifestyle creep, parents' home becomes a paid arrangement after 23 with a yearly "when are you leaving" question, and tension with the parents if you stay past 25. Expired opportunities cost frustration, more when they matched the character's life aspiration.
  - Body: stress is smoothed over about two months; health at zero means hospital (cost, lost pay, company revenue drop). A neglect collapse (smoothed stress low) does not count toward death, a burnout collapse does; a second burnout collapse inside eight years is fatal; six months of convalescence prevent another collapse. V76 adds a falling health ceiling after 40, rest raising it a little, and chronic conditions (back, heart, metabolic, joints) that can be treated, managed by lifestyle or ignored, with cost scaled by country healthcare and insurance. Natural death follows a Gompertz curve for every game, worsened by frailty, with a doctor's warning first.
  - Reputation (V74): the developer measured that reputation hit 100 by age 26 for every character and could not fall, then made it track a target built from rank, performance, company, degrees, years, family, help given, audience and wealth, with scars that fade over years and named extremes.
  - Isolation (V75): family bonds also decay when you give no news (half the speed of friendships, never below a floor); fewer than two close adults for months becomes a named isolation state that hurts morale and stress and offers ways out. Health is deliberately left out of it, with the reason written in the header.
  - Event triage: critical events interrupt, important ones wait in a "To decide" tray with a lifetime (shorter for everyday choices), informational ones go to the journal; an unanswered choice resolves to its default and the journal says so. Everyday events cap at three waiting.
  - Why panels: every outcome lists what helped and what hurt in plain words. Management changes report back after 12 weeks with the top drivers, scoped by company, department or person.
  - Management styles: ten styles each with control level, short-term push, engagement drift, stress, growth, innovation, quality, span and manager hours. Each employee has hidden needs (autonomy, structure, recognition, tolerance) that you learn only through a real conversation. Culture is never chosen; it is the residue of how people were managed.
  - Succession: heir hand-over from age 50 while alive, or at death; group passes through a holding company with reduced inheritance tax.
  - Dead or thin: `Staffing.monthly` is stubbed empty and replaced by the Workforce model; the vertical slice's allow-list hides generic events on purpose.
  - Stated-not-found: "a world that keeps moving without you" is true for markets and companies (monthly company ticks, shocks) but the store claim of consequences "for 40 countries" was only seen as country tables, not traced per consequence.
- **Representations**: "Why" boxes with plus and minus lines; a To-decide mailbox; a journal line when a default fired; named states (isolation, burnout, hospital) instead of raw gauges; a scoped before/after report after a policy change.
- **Improvements the developer wrote down**: V20, V74, V75, V76, V77 headers each state a measured failure (five or seven full lives played) and the fix. This is the most valuable text in the batch: it is a ready list of "flat gauge" traps to test YAIR against.
- **YAIR mapping** (grep before claiming a gap; mapping is proposal): AD13 and BHR rules for ageing and chronic conditions (no age-driven chronic-condition system with care choices found in `src`: grep hits for "chronic" were `chronicle` only); `src/npc_lives.js` and `src/home_staff.js` for contact decay and isolation (no isolation state found); `src/heir_inheritance.js` and `src/home_inheritance.js` already cover heirs, so the new part is hand-over while alive and a hospital-versus-death split on stress history; economy AD27 for lifestyle creep and the cost of staying home; `src/workspace_layout.js` and `src/feature_expansion_book_roster.js` showed inbox/triage hits, so check before building a decision tray.
- Worth playing? Yes. Confirm in play: the "To decide" tray with expiring defaults feels like help and not like punishment, and whether hospital/neglect versus burnout reads as two clear outcomes.

### 2. Medieval Merchant Simulator (camembert0)

- Build: iframe 19887397, modular plain JS (about 60 scripts: domain/, services/, data/), game.js 2.3 MB / 25,280 lines (index and the main domain files read, game.js read around payroll only). Ukrainian/English. Readability: plain.
- **Systems (source)**
  - Relationship state machine for the hero's partner: single, engaged, married, separated, annulled, deceased, lost, with previous status and a restore path, ceremony tier and cost kept.
  - Injury and condition model: four body zones, injuries with expiry, severe and bleeding flags, condition 0-100 in five tiers, and separate combat and work multipliers derived from condition.
  - NPC records carry status (serf, free, child, prisoner), loyalty, obedience, bond, trust, days together, unpaid days, starving days, gift equipment slots, a revivable-until day, and mastery.
  - Payroll: monthly wages; missing a payday increments unpaid days; workers quit after a configured number of unpaid days, and the spouse is handled separately as "family, not a worker": one serious talk (bond and trust drop), and separation only after a further grace period, with a spouse history entry.
  - Economy engine: price elasticity clamped between 0.62 and 1.7, bulk discount, bank houses bound to cities with remote-withdrawal fee, interest period and loan limits tied to reputation.
  - Item instances carry condition, origin, creator NPC, acquired day and a typed location; narrative graphs are validated (single route per node, missing targets, unreachable nodes) and saved with variables, trail and seen nodes.
  - Also present by file name but not read: religion system, farm service, port and branch systems, travel dice, combat techniques, city quests.
- **Representations**: tier labels for condition; relationship status shown as a family status line; event scenes with art.
- **Improvements**: none stated in comments I read; version tags like "v0.55" mark the spouse rule as a deliberate fix.
- **YAIR mapping**: `src/npc_lives.js` (6 spouse hits) for a relationship status machine with restore; `src/home_staff.js` already has an owed-wage notion (line 42), check whether it ends in quitting and whether family members are exempt; BHR rules for zoned injury and condition-to-output multipliers; ECR rules for elasticity and branch banks.
- Worth playing? Yes, late in the queue. Confirm: whether a hired spouse or relative is paid at all and what the "serf/free" status does to loyalty (the status labels carry content that YAIR would treat with care under AD-level content rules).

### 3. No Main Quest: After Hours (liquify420)

- Build: iframe 18197448, game.js 34 KB and data.js 54 KB, plain, canvas isometric town. Readability: plain. Keyword-regex dialogue, not a language model.
- **Systems (source)**: per-NPC memory list capped at 14 entries; player statements ("I love ...", "I am ...") are extracted by pattern and stored as things the NPC remembers; relationship points rise with each exchange; a secret is gated at 8 points; quest completion writes a memory to both the giver and the completer and adds a town fact (capped 60); town mood label sums all relationships. Stated-not-found: the store line "townsfolk remember you" is true only as quoted memory lines, not as changed behavior.
- **Representations**: journal tabs for quests, people and town notes; greeting that quotes the latest memory.
- **YAIR mapping**: `src/generated_people_ui.js` and `src/body_progression.js` showed "remembers" hits; check `src/npc_lives.js` before adopting. The idea to keep: one fact written into several NPC memories at once.
- Worth playing? Short; ten minutes. Confirm whether remembered lines ever change an NPC's choices.

### 4. AI CIVILIZATION - 15 DAYS (neonvoidstudio)

- Build: iframe 17706252, one 61 KB HTML, plain, no network calls (grep for fetch and XHR found none). The store text says AI agents run the world; the code shows four hand-set trait profiles labelled with real model names plus random draws. Labeled `stated-not-found` for any live model use.
- **Systems (source)**: ten agents with health, hunger, resources, aggression, cooperation, morality, morale, power, a trust value toward every other agent, crimes and coalition; daily 4-6 weighted events (fight, robbery, betrayal, arson, vote, friendship, flirt, speech, coalition, law, murder, revolution, tribunal) whose odds shift with scarcity and a world chaos meter; laws unlock when a democracy score passes a threshold; a day-7 tribunal for the worst offender.
- **Representations**: a newspaper per day that headlines the most dramatic event, a society label from aggregate stats, a connection graph of trust.
- **YAIR mapping**: `docs/research` has no equivalent report; fits household gossip as a "daily paper" presentation of the chronicle (`chronicle` in `src/`). Low mechanical value.
- Worth playing? No; five minutes at most. Confirm only the newspaper framing.

### 5. ANTFALL (lynflippen)

- Build: iframe 19843618, 37 KB, plain, store tag "ai-generated". 
- **Systems (source)**: two scent fields on a 160x96 grid (to-food, to-home) with evaporation (slower normally, fast in rain), ants steer toward the stronger of three sensed cells, carriers also steer toward the nest so lost ants still get home slowly, deposit strength fades with time since the last nest or food, breeding costs food and can be paused, and starvation kills ants.
- **Representations**: a one-line food ledger (start + delivered - eaten - spent breeding = stock) and a loss tip that names the largest cause of defeat.
- **YAIR mapping**: the ledger plus largest-cause tip is the useful part; matches the Why-panel idea above and AD-level explanation rules. Otherwise irrelevant to person-scale play.
- Worth playing? Two minutes. Confirm the loss tip picks the right cause.

### 6. Idle Fantasy Shop (drevengames)

- Build: iframe 19945068, Vite/React bundle, minified but with readable identifiers in data (content, runtime, shared chunks pretty-printed). English/Russian. Readability: minified.
- **Systems (source)**: customers belong to groups, each tied to a society; whether a customer buys is an acceptance value in basis points that sums a base for the pricing mode, a band adjustment for the item's tags (wants, likes, neutral, dislikes, hated), set bonuses, trading level, that society's reputation, a society bonus and an innate bonus; "hated" forces zero. A haggle trait pays 90 percent of the posted price. Delivery contracts are gated by actions and society.
- **Representations**: a computed breakdown object (one number per term) that a UI can show line by line.
- **YAIR mapping**: ECR rules and AD27 local economies: per-faction reputation as an additive term in sale odds, with a visible breakdown. `src/money.js` and the merchant code should be checked for a breakdown object before building.
- Worth playing? Yes, 20 minutes. Confirm the breakdown is shown to the player and not only computed.

### 7. Dominion of Darkness (adeptus7)

- Build: iframe 19321153, Twine 2 / Harlowe, 2,933 passages in an 8.8 MB file (mostly media), store tags "ai-generated". Readability: plain passages.
- **Systems (source)**: each turn the player raises influence in one of four peoples or recruits from a people once influence exceeds 1; a random "discord" event then increments a hidden pairwise tension counter between two peoples (human-dwarf, elf-human, elf-dwarf and so on); each player action also increments a per-people threat counter.
- **YAIR mapping**: the hidden pair-tension counters driven by flavor events are a cheap way to make faction relations drift without a full diplomacy model; a pattern only; no YAIR owner checked. Low priority.
- Worth playing? No. Skim the manual passage only.

### 8. GOAP AI simulation (mookie4242)

- Build: iframe 10287918, Excalibur.js bundle (0.9 MB), app code last 140 lines of the pretty copy. 
- **Systems (source)**: actions with name, cost function, timeout, precondition, effect; move-to-tree costs equal distance; a bear within range sets a cancel latch that clears the action queue and forces "run away" then "relax". Preconditions are hand-written state-enum checks, so it is a state-driven picker, not a symbolic planner.
- **YAIR mapping**: `docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md` already mentions GOAP; nothing new.
- Worth playing? No.

### Gap pass additions (2026-10-22, second pass)

- **EMERGENT, more sections read (source, all.js headers and code):** debt now has a bank limit and an over-indebtedness procedure with two outcomes, and a failing company states how many months of cash remain before it dies (V72, L13177); unemployment is a period with a hardening job market (worse after 40 and with a longer CV gap), eroding reputation, skills and morale, with staged exits (lower the bar, retrain, temp work, network) (V73, L13767); rivals appear one at a time, want something specific (promotion, clients, inheritance), act visibly and can be answered, because the developer found nothing ever moved against a passive player (L9299); an optional shadow-business layer is abstract (integrity profile, intermediaries, traces, evidence, investigations) and states that a clean company is fully competitive (L2930); the market is an offline valuation chain with a readable explanation (fundamentals to fair value to sentiment, sector cycle and macro) (L3388); cities carry cost, pay, size, strong sectors, life quality and map position (L9535); travel cost depends on who pays (parents for minors, employer for business, student after grants) and people met on the road stay in the world (L4410); about 40 countries each have salary, cost of living, tax, benefits, healthcare, labour protection, pensions, lending and inflation phases (L4882-L5600). The store claim of country-specific consequences is therefore confirmed as data tables read by the systems.
- **Medieval Merchant Simulator, more files read (source):** religion is a catalog of faiths with maximum spouses by sex, divorce allowed or not, annulment allowed or not, and city institutions (religion-system.js L5-35); the farm is a capacity-per-level herd where breeding chance is 0.30 plus 0.15 per pair, capped at 0.80, and animals move between pasture and other zones (farm-service.js L117-135); branch offices cost a base fee plus a step per existing branch, carry per-ordinal maintenance, storage by warehouse level, and port modules by level with berths, storage, crew and fee discount (branch-system.js L1-30); pilot ports have berth fees, duty rates and a named manager (port-system.js L1-8). Combat techniques, travel dice and visual-novel services were not read.
- **Trouble In NPC Town (Phaser, source):** a jam game where NPC crowd members random-walk with layered hat, top and bottom sprites and can be clicked dead; missions ask the player to visit corners, stay in crowds, or stalk an NPC at a set distance (Missions.js L1-25). No world model. Low value.
- **Uncharted Wanders (dashingstrike, Ludum Dare style, glov engine):** goods carry a realm tag (physical, spirit or both) and each town has a want and a sell table of price and stock per good, so arbitrage works across a physical and a spiritual realm; supplies are universal (app.pretty.js L5523-5560). Prices and stocks are per-town tables, not a simulation. Relevant only as a minimal "two-realm trade" shape for ECR and AD27.
- **Rum & Timber (Unity, IL2CPP):** unpacked `Web.data`, extracted the 14 MB `global-metadata.dat` and read the string table. Names only (no method bodies): Contract with ContractRep and ContractGain, Faction and FactionCard, Demand with relax/step/max, DefensePoints, Housing, Market, Island and IslandType. It suggests faction-reputation contracts and demand that relaxes over time; nothing traced.
- **Twilight Tower (Unity, mono/IL2CPP metadata):** unpacked the same way; names only: CardData, CardManager, ChoiceNode, ChoiceValue, and a dialogue/ink-style handler set. No morality or survival numbers found in strings.

### Not decoded (one line each, details in the gap ledger)

- The Liars' Line: the embed is a cover page; the game is on the developer's own site, outside the allowed route.
- Sovereign Tower and Flawed Heist: no browser build exists (Windows, and Windows/Linux, downloads only).
- Necromarket: Java/libGDX from LD44; not opened.
- Parser games (Hadean Lands, Anchorhead and others), the detective titles, Marketfield, Trash Inc., Cat Cove Inn, Fossil Quest and AIMLUS: see the ledger.

## Top findings

1. **Test list of flat-gauge traps (EMERGENT V20, V74-V77).** The developer measured full lives and found passive play was easy, reputation was a timer, health stayed flat until 65, isolation had no consequence, and natural death only existed in one mode. Use as a checklist against YAIR's body, reputation and household systems. Owners: BHR rules, AD13, `src/body_progression.js`, `src/npc_lives.js`.
2. **Age-driven chronic conditions with three responses (treat, manage, ignore) and a health ceiling that falls after a threshold age**, with costs scaled by local healthcare. No such system found in `src` by grep. Owners: BHR, AD13, AD27.
3. **Two-kind collapse: neglect hospital versus burnout death, decided by a smoothed stress history, with a convalescence floor and a long forgiveness window.** Cheap to prototype and readable to a player. Owner: BHR.
4. **Sale or hire acceptance as a decomposed sum with a visible breakdown (Idle Fantasy Shop), plus "Why" boxes and 12-week before/after reports on policy changes (EMERGENT).** One explanation pattern for ECR, household staff and management. Owners: ECR, `src/home_staff.js`, UI rules (UR codes) for the panel.
5. **Family is not staff (MMS-M payroll):** a spouse gets a warning and a long grace before leaving, a worker quits quickly; plus an explicit relationship state machine with restore. Owner: `src/npc_lives.js`, `src/home_staff.js`.

## Verification line

Read: listings for 15 tag pages (no 429s, 4-5 s spacing); 15 store pages for title, tags, iframe id; fully or mostly read EMERGENT (header comments for every module and about a dozen modules read in full; two large data scripts truncated), MMS-M (14 domain, service and data files plus the payroll section of game.js), No Main Quest (game.js and data.js structure), AI Civ (setup, event generation), Antfall (step and ledger), Idle Fantasy Shop (acceptance and haggle code), Dominion of Darkness (manual and four passages), GOAP (action definitions). Not read: MMS-M's religion, farm, port and combat files beyond name; EMERGENT's market, travel, map and shadow-business sections beyond headers; any Unity/Godot build; parser story files. Nothing executed; esbuild used only as a pretty-printer. Roughly 60 tool calls in the first pass plus about 30 in the gap pass (curl for fetches; WebFetch was 403 on itch). The gap pass additionally read Rum & Timber and Twilight Tower metadata strings, NPC Town and Uncharted Wanders source, and more EMERGENT and Medieval Merchant Simulator sections; its remaining gaps are in the ledger below. Dedupe: titles grepped over `docs/**/*.md` outside `private/`; only Seedship and Colony Adventure were already covered. Nothing committed.


## Gap ledger

| Gap | Status | Evidence or locator |
|---|---|---|
| EMERGENT: market, travel, map, shadow business, countries, debt, unemployment, rivals | closed (headers and core code read; remaining sections are text tables and UI) | `private/emergent-heir/all.js` L2930, L3388, L4410, L4882-5600, L9299, L9535, L13177, L13767 |
| EMERGENT: two large data scripts truncated | low value: portrait metadata and country name tables | scripts 3 and 29 in `all.js` |
| EMERGENT: "world keeps moving without you" | closed: monthly company ticks, shocks, rivals, market and country phases exist | L176-190, L9299, L3388, L5097 |
| MMS-M: religion, farm, branch, port | closed | `private/mms-m/js/domain/religion-system.js`, `farm-service.js`, `data/branch-system.js`, `port-system.js` |
| MMS-M: combat techniques, travel dice, visual-novel service, city quests, rest of game.js (25,280 lines) | low value for YAIR: combat and travel are covered by other owners; content-heavy. Files not fetched | script names in `private/mms-m/index.html` |
| MMS-M: whether a hired spouse is paid | needs play | payroll code distinguishes `person.spouse` (game.js L22781-22850) but pay source not traced |
| No Main Quest: remembered lines change behavior? | closed: no. Memory only quoted in greetings and `remember` replies | `private/no-main-quest/game.js` L221-251 |
| AI Civilization: live model use | closed: none (no fetch/XHR) | `private/ai-civ-15/index.html`, grep count 0 |
| Dominion of Darkness: only 4 passages read | low value: AI-generated passage fan-out of one pattern (influence, recruit, discord event) | `private/dominion-of-darkness/index.html` |
| GOAP sim: planner type | closed: hand-written precondition picker, not a symbolic planner | `private/goap-sim/index.pretty.js` L22940-23075 |
| Idle Fantasy Shop: breakdown shown to player? | needs play | computed in runtime.pretty.js L957-960; UI use not traced |
| Trouble In NPC Town | closed (jam, no world model) | `private/npc-town/Scripts/` |
| Sovereign Tower | unreadable: no HTML5 build, Windows download only | store page: single "Download for Windows" |
| Flawed Heist | unreadable: no HTML5 build (Windows/Linux downloads only; Godot) | store page downloads list |
| The Liars' Line | server-side / outside route: embed links to developer site | `private/liars-line/index.html` (2.6 KB cover) |
| Rum & Timber (Unity) | closed to names only: method bodies are in WASM, not dumped | `private/rum-timber/Build/meta.strings`; global-metadata.dat 13,965,044 B |
| Twilight Tower (Unity) | closed to names only | `private/twilight-tower/meta.strings`; 3,689,508 B metadata |
| Necromarket (libGDX, LD44) | low value: 2019 jam shopkeeper story game; not opened | store page tags libgdx, ludum-dare-44 |
| Uncharted Wanders | closed (see additions) | `private/uncharted-wanders/app.pretty.js` L5523-5560 |
| Parser games (Hadean Lands, Anchorhead, Terminal City, warrigal titles) | needs play: story files are Glulx/Z-code or hosted engines, not readable source; listing-only | listing lines in screen table |
| Detective games (Teide, Midnight Dispatch, The Liars' Line) | needs play / server-side: no HTML5 embed found in the page HTML for Teide | store page of Teide has no `html-classic` iframe |
| Marketfield (19872439), Trash Inc. (19906784), Cat Cove Inn (6577714), Fossil Quest (16435062) | low value: incremental/management patterns already covered by earlier batches; embeds located, not opened | iframe ids from store pages |
| AIMLUS v0.5 | low value: Unity WebGL alpha (id 11594859), tagged emergent; not opened | store page iframe path |
| Listing-only titles (rows 19-41 of the screen, other than those above) | low value / not read: one-line screen only; promote from the play queue if wanted | screen table |
