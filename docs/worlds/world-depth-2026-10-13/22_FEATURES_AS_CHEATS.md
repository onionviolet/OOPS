# V. Game features as unlocks, tools and cheats (proposal, 2026-10-13)

Weibao (2026-10-13): "cheats" for stuff and more? Idea of unlocking game features as 'cheats' or is that unnecessary and be in the base game, more to consider? There are so many ways this can go.

Everything here is a proposal. Nothing is accepted until Weibao says so. Per "everything possible, reasonably", this file does not pick one answer. It gives each feature a recommended home, lists the framings, and ends with a default policy plus dials.

**Where this lands against the coordinator's starting view.** Mostly agreed, with four refinements backed by the code and docs:

1. **The base-game unlock seam already exists.** Panel discovery from save facts is live (`src/workspace_layout.js:84-106`), so "base, unlocked by play" is the cheapest home, not a new system.
2. **Rule 8 limits it in vanilla.** Vanilla YAIR already gives the bestiary, fast travel by beds, auto-consume favourites and equipment comparison from the start or by its own rules (X3 to X6 below). Adding new gates to those in the vanilla opening would change the original game (`docs/RULES_FROM_SCRATCH.md` rule 8). Default: new gating applies to new starts and worlds; vanilla keeps its own.
3. **"Cheat" needs a test, not a vibe.** Proposed test: a feature is a cheat in a world when that world's own people lack it and having it breaks a rule they live by (hidden odds, hidden stats, reversing time). A feature most locals have is a tool or a service, not a cheat. This keeps the YAIRPG meaning from `docs/CHEAT_COSMOLOGY.md` intact.
4. **An in-world framing needs a base fallback for anything in Lines (LN).** If a world makes the log a Pensieve, the plain log still exists for reading what happened. The framing adds depth; it does not take away the floor.

---

## 1. Code today (X)

Source-read on 2026-10-13, not browser-checked.

| Code | Consideration | Why it matters |
|---|---|---|
| X1 | **Panel discovery from save facts.** `registerWorkspaceModule` takes `eligible()` and `discovered()` (`src/workspace_layout.js:7`). An undiscovered panel has no name anywhere; discovery is sticky and re-derived on load; a reveal animates only on a flip during play (`src/workspace_layout.js:84-111`). Combat and stance use "first real fight" as the fact (`src/workspace_views.js:17-19`). | This is the Proto23 A6 pattern already in code. Any feature in FI can use "base, unlocked by play" by supplying one `discovered()` fact. |
| X2 | **Skill visibility thresholds.** Skills hide until XP passes `visibility_treshold` and the skill is unlocked (`src/models/skill.js:26,55,153`); discovery cues fire once per id (`src/native_discovery_policy.js:3-24`). | Skill-gated features (FR1) can ride the same threshold. |
| X3 | **Fast travel by beds.** Fast travel lists locations with unlocked beds or favourites (`src/main.js:1700-1701`, `src/main.js:2181-2190`), plus the last combat location. | Vanilla already unlocks fast travel through play. Keep it as is in vanilla (rule 8). |
| X4 | **Auto-consume favourites.** Consumables marked favourite are used when their effect runs out (`src/main.js:1741-1742`, `src/main.js:4692-4714`). | Vanilla auto-eat exists and is open. A world can skin it, not gate it, in vanilla. |
| X5 | **Bestiary from the start, filled by kills.** The journal button is always present (`index.html:423`); entries appear on first kill (`src/main.js:3652-3658`, `src/display.js:5267-5274`). | Contrast with Proto23, where reading a book grants the Bestiary (`docs/research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md` F4). Both patterns can coexist per world. |
| X6 | **Equipment comparison panel, ungated.** Registered with no `discovered()` fact (`src/workspace_views.js:69`). | An info panel that is base from start today. |
| X7 | **Automation as a declared program.** "Pack 3 kits automatically" runs as a simulation program with pause and resume (`src/simulation_ui.js:23,47-53`); automatic programs are blocked inside hosted commands (`src/main.js:1251`). | A bounded automation seam exists. The Earned Habit cheat (`docs/CHEAT_LIBRARY.md` section 8) could unlock its count or scope. |
| X8 | **Offline progress is frozen by design.** World clocks only allow `absence: "freeze"` (`src/world_instances.js:108-111,278`); the backlog packing batch is a prepaid escrow with no wall-time reads (`src/backlog_expansion_time.js:25-43`, `src/backlog_expansion_transit.js:244-250`). | Any offline-rate feature is a real engine change (BO10 in part 11), not a toggle. |
| X9 | **Time speed is dev-only.** `set_game_speed` allows 1x to 1000x, not saved (`src/main.js:7859-7878`), and dev detection is a URL match on the upstream dev site (`src/main.js:4884-4886`). | A player-facing time control has no seam yet. Sandbox (part 11 KA2) is its natural first home. |
| X10 | **Save, export, import, backup.** Export to file (`src/main.js:5195`, `src/main.js:8114`), import (`src/main.js:7022`), backup restore (`src/main.js:7072-7073`), hard reset (`src/main.js:7075`). Ended-life export is offered from the chronicle (`src/main.js:8252`). | Already open to all. These belong in LN. |
| X11 | **Presentation settings outside the save.** Font, font size (`src/customization_ui.js:30`), color scheme, craft detail place and layout live in local storage keys (`src/workspace_layout.js:32,77-82`); reveal respects reduced motion (`src/workspace_layout.js:110`). | Accessibility already sits outside play. A hint-density or spoiler setting can follow the same key pattern with no save impact. |
| X12 | **Read-only info projections.** Action terms, costs and causes show only known facts (`src/action_legibility.js:1-3`); crafting "makeable now" is a pure projection (`src/crafting_visibility.js:1-4`); people and routes show only witnessed rows (`src/people_knowledge.js:6`, `src/known_routes.js:1-2`). | Info features already filter by knowledge. An in-world "reveal" cheat can widen that filter instead of building a parallel view. |
| X13 | **No global player pause.** Pauses are owner-specific: battle (`src/main.js:557`), chronicle (`src/main.js:558`), save failure (`src/main.js:905`). | Pause is in LN; today it is partial. |
| X14 | **Capability origins.** Sources carry `unknown`, `inherited`, `trained`, `acquired` (`src/capabilities.js:5`) with receipts (`src/expansion_engine.js:498-504`). | A feature framed as a cheat or tool can reuse this origin and receipt shape for "where did this panel come from". |

---

## 2. Feature inventory (FI)

Homes: **Base-start** (open from the first minute), **Base-play** (base game, opens when a save fact says the life needs it), **World-cheat** (in-world cheat or tool in fitting worlds, base fallback kept), **Sandbox** (KA2 only, or sandbox first), **Access** (accessibility setting, reachable from the first minute). Several rows carry two homes: a base version plus a stronger in-world version.

| Code | Feature | Recommended home | Why it matters |
|---|---|---|---|
| FI1 | **Action automation (repeat a task N times)** | Base-play, plus World-cheat for wider scope | Repeating a known task is idle-genre floor (Increlution, Your Chronicle in `docs/RESEARCH_IDLE_GAMES.md`). Default: count grows with completions (Earned Habit). Dial: a system or servant in some worlds lifts the cap or adds new task kinds. |
| FI2 | **Action queue (do A, then B, then C)** | Base-play | Opens once the life has two queued-able actions in one place. Planning is play, not a cheat, in most worlds. Reasonably: a world with a scheduler NPC can sell a longer queue. |
| FI3 | **Offline progress rate** | Base-play with a low default; World-cheat for higher | Absence freezes today (X8). Default proposal: the current life keeps a modest rate (rule 7); a world's own rule or a cheat (a time-dilated domain, a servant) raises it. Needs the BO10 clock work first. |
| FI4 | **Time skip / fast-forward** | World-cheat; Sandbox | Skipping time breaks most worlds' rules, so it fits as a storyteller gift, a sleep spell or a loop. Default: wait-until-event ("sleep until morning") is base; free skipping is a cheat or sandbox. |
| FI5 | **Speed multiplier** | Sandbox | Dev-only today (X9). Upstream warns it changes combat. Default: sandbox; a world can offer a narrow in-fiction version (haste on chores only). |
| FI6 | **Fast travel** | Base-play (vanilla beds, X3) plus World-cheat | Keep vanilla. New worlds can tie it to their own means: Floo, teleport circles, a staff car. A cheat version skips cost or reach. |
| FI7 | **World map** | Base-play | Opens with the first known route (`known_routes.js`). A fogged map is a world adjective; a full map is a purchase or a cheat. |
| FI8 | **Bestiary** | Base-start in vanilla (X5); Base-play by book or teacher in fitting worlds | Proto23 grants it by reading. Default: keep vanilla open; new worlds may grant deeper bestiary tiers (weaknesses, drops) by study. |
| FI9 | **Item compare** | Base-start | Already ungated (X6). Hiding a comparison only slows the player and teaches nothing. |
| FI10 | **Item inspect (hidden properties)** | Base for known traits; World-cheat for hidden ones | Surface stats are base. Curses, true names and enchantments are a world rule; revealing them is Identify, appraisal, rune reading. |
| FI11 | **Crafting calculator ("how many can I make, what do I need")** | Base-play | The makeable filter exists (X12). Opens with the first recipe. A stronger version (best-quality plan, shortfall shopping list) can be a guild service. |
| FI12 | **Stat breakdowns (where a number comes from)** | Base-start, shallow; Base-play, deep | Knowing why a number moved stops confusion. Default: one-level breakdown at start; full tree after a teacher, a book or a mirror item. |
| FI13 | **Combat log detail** | Access for the toggle; Base-start for the basic log | Detail level is a reading preference, not power. Default: a short log; a setting turns on full lines. |
| FI14 | **Odds display (hit, crit, craft success)** | Base-play for your own odds; World-cheat for exact odds | Proto23 shows odds on the enemy panel (PA14 in part 18). Default: your own rough odds after some fights; exact percentages in worlds where divination, a system or a status window exists. |
| FI15 | **Loadouts / gear sets** | Base-play | Opens once the life owns two full sets. A soldier's kit card or a wizard's robe hook can skin it. |
| FI16 | **Bulk sell / bulk actions** | Base-play | Opens after a few manual sales. Tedium relief, not power. Reasonably: a fence or a quartermaster who buys by lot is the in-world face. |
| FI17 | **Auto-eat / auto-consume** | Base-start in vanilla (X4); World skin elsewhere | Keep vanilla. A servant, a ration routine or a house elf can carry it elsewhere with its own limits. |
| FI18 | **Multiple save slots** | Access | Saves are a player safety tool (rule 9). Default: available from the start. |
| FI19 | **Branch-from-here (fork a save)** | Base-start as a plain export; World-cheat as an in-fiction branch | Export already exists (X10). A loop world can turn branching into its native verb; outside fiction it stays a file action. |
| FI20 | **Start picker options** | Base-play by earned options (part 13 EO); Sandbox for all | Part 11 and 13 already cover this. Default: earned; dial EO11 opens all. |
| FI21 | **Hint density** | Access | How much the game hints is a taste setting. Default: medium; dial from none to near-solution (EO10). |
| FI22 | **Notebook search** | Base-play | Opens once the notebook has enough entries to need it (say 20). Search over what you already know reveals nothing new. |
| FI23 | **NPC schedule view** | Base-play by observation; World-cheat for full | Default: you learn a schedule by watching (known rows only, X12). A map with everyone's whereabouts is a cheat (Marauder's Map style, general knowledge). |
| FI24 | **Relationship numbers** | Base-play as feelings; Access for numbers | Proto23 reads changes as feelings (PT14). Default: words; a setting shows numbers beside them. A world with a favor ledger can make numbers diegetic. |
| FI25 | **Renown view (who knows you, how well)** | Base-play | Opens with the first reputation change. A full map of who knows your name is a spy service or a cheat. |
| FI26 | **Statistics journal (lifetime counters)** | Base-play | Proto23's journal (PA1). Opens after the first counter-based title. Reading your own record is harmless. |
| FI27 | **Death recap ("what killed me")** | Base-start | The last cause of death (PA2) helps learning. Hiding it costs time and adds nothing. |
| FI28 | **Pause after this fight** | Base-play | Proto23 PA13. Opens with the first long combat loop. |
| FI29 | **Hotkeys and item binds** | Access | Proto23 PA25. Input comfort, not power. |
| FI30 | **Future preview / timeline strip** | World-cheat | Seeing predicted beats (`docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md` timeline view) breaks most worlds. Fits foreknowledge, simulators, divination. |
| FI31 | **Undo last action** | Access for misclicks; World-cheat for real undo | A grace window on a misclick is safety (LN). Undoing a real choice later is time magic. |
| FI32 | **Rest-until-healed / wait-until** | Base-start | Waiting for a known event is pacing, not skipping. |
| FI33 | **Market price history / trend** | Base-play; purchased service | Opens after enough trades at one stall. A broker's report is a paid version. |
| FI34 | **Encyclopedia of world lore** | Base-play by reading; World-cheat for sealed lore | Known lore opens by reading. Sealed truths stay behind their routes (WORLD_SECRETS_AND_DISCOVERY.md). |
| FI35 | **Delegation (followers do tasks)** | Base-play in hub and home; World-cheat for scale | A hired hand is base. An army of shadows or clones doing work is a cheat. |
| FI36 | **Layout and panel arrangement** | Access | Already outside the save (X11). |
| FI37 | **Quest generator** | Base-play; World-cheat for System quests | Locals get work from boards, guilds, bounties and neighbors, so generated work is ordinary life. A System that knows hidden things, pays from nothing or aims at you is the cheat. Full treatment in part 8. |
| FI38 | **Other generators (events, rumors, NPC needs, rifts, contracts, dreams)** | Base-play; per-world density | Same engine as FI37, different output. Part 8 QS. |
| FI39 | **Action- and goal-driven quests** | Base-play | Quests that appear because of what you did or what you want. Builds on accepted Ambitions (`docs/LIFE_SIM_NORTH_STAR.md` lines 1099-1110). Part 8 QT and QG. |

---

## 3. Framings (FR)

One feature can take any of these faces. The framing changes cost, who notices and whether it can be lost; the mechanic underneath can stay the same.

| Code | Framing | When it fits | Why it matters |
|---|---|---|---|
| FR1 | **Skill** (practice opens the feature) | Any world with practice-based skills; the base default. | Feels earned and explains itself: "your Trading reached 5, you can now read price trends." Uses X2. |
| FR2 | **Tool or item** (carry it, lose it) | Worlds with craft and loot. Proto23's wallet and toolbox. | Possession and knowledge split: losing the tool disables use but keeps what you learned (F4 note in the Proto23 doc). |
| FR3 | **Servant or companion** | HP house elves, D&D familiars, SL batmen, Shadow Slave shadows. | Automation and auto-eat with a person attached: they have moods, can quit, can be bribed, can testify. |
| FR4 | **Institution membership** (library card, guild ledger, regimental pay book) | Schools, guilds, armies, churches. | The feature comes with dues, rules and a revocation clause. Expulsion takes the feature. Good for search, bestiary tiers, price data. |
| FR5 | **System or cheat** (status window, quest board) | Worlds with a known system (TTKS B2 and B3, Shadow Slave's Spell) or a YAIRPG-granted cheat. | The feature is part of a patron's terms (part 13 CA6). Can glitch, crack (PRESENTATION "cracked" state) or go dark. |
| FR6 | **Storyteller gift** | Fourth-wall worlds; any world when the narrator dial is high. | Fast-forward, recap or hint offered by a voice. Default: the gift has a mood and can refuse (PRESENTATION ID7 fast-forward return). |
| FR7 | **Body change** (new eyes, a sense, a gland) | Cultivation, mutation, LOTM potions, TTKS B5 infection. | The feature lives in the body: cannot be dropped, may show to others, may cost lifespan. Spirit vision as odds display. |
| FR8 | **Knowledge** (you know how, so you see it) | Scholarly worlds, MoL, reincarnators. | The feature crosses worlds when knowledge crosses (part 17 carryover). It decays where knowledge backing is weak. |
| FR9 | **Purchased service** (pay per use or subscription) | Market towns, hubs, LOTM black market, Fallout vendors. | Gives a money sink and keeps power optional: rent a map, pay a broker, hire an appraiser. Stops when money stops. |
| FR10 | **Achievement or title** | Any world with titles (`src/titles.js`). | A counter opens a feature with a receipt ("opened by 300 returned kits"). Proto23 Quartermaster (PA12). |
| FR11 | **Setting** (just turn it on) | Accessibility and comfort features; sandbox. | Honest when the feature is not power. No fiction needed. |
| FR12 | **Habit** (the routine runs itself) | Repetitive livelihoods; the Earned Habit cheat. | Automation as character growth; bad habits learn too (CHEAT_LIBRARY section 8 limit). |
| FR13 | **Ritual or spell** (cast to open, temporary) | D&D, HP, LOTM. | The feature lasts a scene or a day, with a component cost. Identify, Detect Magic, divination. |
| FR14 | **Inherited from a prior life** | Heir lines, reincarnation. | The heir keeps a panel the old life earned (part 13 EO7), with a receipt. |
| FR15 | **Contract or debt** | Warlock pacts, LOTM borrowed faculties, SL enlistment. | The feature is borrowed and has a return clause or countdown (part 13 CA18). |

---

## 4. Lines (LN)

Defaults that protect the player. Each is a strong default with a reason, not law. A dial is named where one fits.

| Code | Default | Why it matters |
|---|---|---|
| LN1 | **Accessibility settings stay outside play and outside cheats.** Font, size, contrast, color scheme, reduced motion, hotkeys, layout (X11). | Gating comfort behind progress punishes the people who most need it. Dial: none proposed. |
| LN2 | **Save, export, import, backup and multiple slots stay open.** (X10, FI18) | Rule 9 save integrity. A world can add a diegetic save (a diary, a shrine) on top, but the file route stays. Dial: hardcore worlds may limit in-fiction saves; the real file is still exportable. |
| LN3 | **Pause stays reachable.** Today pause is owner-specific (X13). Default proposal: a global pause that stops the current life's clock. | Real life interrupts. An idle game that cannot pause forces a choice between leaving and losing. Dial: some worlds can call the pause "the world holds its breath" with no cost. |
| LN4 | **Readable text and plain log stay available.** In-world framings (a cracked status window, a Pensieve log) sit on top of a plain readable version. | "Cracked" UI as state is already optional and cosmetic by default (`docs/PRESENTATION_AND_FOURTH_WALL.md` line 182). Dial: a reliability state can blur values while the plain log of what happened stays clear. |
| LN5 | **Misclick undo.** A short grace window (a few seconds or until the next tick) on sells, drops and destructive confirms. | Losing a rare item to a slip teaches nothing. Real undo of a choice later is FI31's cheat version. |
| LN6 | **Spoiler controls.** Hint density (FI21), unseal guard (part 11 UG11), sealed IDs only. | Weibao plays too (AGENTS.md sealed secrets). Dial: hint density from none to near-solution. |
| LN7 | **Death recap and failure reason.** (FI27) | Knowing why you lost is how the player learns; hiding it adds frustration, not mystery. Dial: a world can phrase it in fiction. |
| LN8 | **Losing a feature's carrier keeps what was learned.** A dropped map item disables live tracking; your known routes stay. | Proto23 F4: possession and knowledge are separate. Avoids feel-bad erasure. |
| LN9 | **No feature that exists in vanilla gets a new gate in the vanilla opening.** | Rule 8. Dial: an opt-in "staged interface" start (amnesiac, part 11) can hide more. |
| LN10 | **A feature that is also a cheat elsewhere still has a base path when it is QoL.** Automation, bulk sell, search. | Avoids a world where the only way to stop clicking is to take a patron's leash. Dial: the cheat version is wider or cheaper, not the only version. |

---

## 5. Per world (FW2)

Rows build on existing research rows where named (RS22, RS30, RS31 in part 14; CL27 in part 17) and add the interface side. (G) = general knowledge.

| Code | World | Feature as in-world cheat or tool | Why it matters |
|---|---|---|---|
| FW2-1 | Harry Potter | **Pensieve as replay log.** (G) A memory poured into a basin can be replayed. Default: the plain log is base; a Pensieve shows a past scene in full detail, including things you did not notice at the time. Reasonably: needs the basin and a drawn memory; others can view what you pour. | Turns combat log detail (FI13) and replay into a lore object with a privacy risk (CL27). |
| FW2-2 | Harry Potter | **Marauder's-style map as NPC schedule view.** (G) A charmed map shows people on the grounds. Default: FI23 by observation is base; the map is a found or inherited artifact. Reasonably: it can be confiscated, and its makers' rules shape what it shows. | The clearest case of "having the feature is suspicious" (DP5). |
| FW2-3 | Harry Potter | **Time-Turner as bounded undo.** (G) Default: a Ministry-issued device for a stated purpose; a few hours back, no meeting yourself. Reasonably: misuse draws attention; loss is likely in canon arcs. | FI31 real undo with a legal frame and a cap. |
| FW2-4 | D&D | **Identify as item inspect.** (G) Identify and Detect Magic reveal hidden properties (RS22). Default: surface stats base; hidden ones need the ritual, a pearl component or a sage's fee. | FI10's cleanest world framing; ritual or purchased service. |
| FW2-5 | D&D | **Familiar as auto-scout and auto-loot.** (G) Find Familiar gives a creature that scouts. Default: a familiar can reveal the next room on the map (FI7 depth) and fetch small items. Reasonably: it can be killed and re-summoned at a cost. | Servant framing (FR3) for map and loot automation. |
| FW2-6 | D&D | **Rules profile as an odds display dial.** (G) Tables expose numbers; a DM screen hides them. Default: profile-based (part 13 EW9); "show the dice" is base under a crunchy profile and hidden under a narrative one. | Odds display (FI14) as an edition choice, not a cheat. |
| FW2-7 | A Soldier's Life | **The pay book and service record as stat sheet and renown view.** The record follows the soldier (repo notes, SL4). Default: FI25 renown and FI26 counters appear as entries in an issued book. Reasonably: a clerk writes them, so errors and edits happen. | Institution framing (FR4); the record can be wrong or doctored. |
| FW2-8 | A Soldier's Life | **Kit ledger as crafting calculator and bulk actions.** Default: issue and return lots by ledger line; bulk handling opens with posting to stores. Reasonably: the ledger is audited (part 13 EW14 ledger sense). | Bulk sell (FI16) with a quartermaster face. |
| FW2-9 | A Soldier's Life | **Storage gift as loadouts.** The gift holds kit (repo notes). Default: loadout swap (FI15) is instant for the gifted and slow for others. Reasonably: superiors want to use it, which changes postings. | A world where a QoL feature is the gift itself and people plan around you. |
| FW2-10 | TTKS (five books) | **B2 system as status window and automation.** Default: the yearly-draw system (EW16) shows a panel and may grant an auto-loop as a draw. Reasonably: draws are random and graded. | System framing (FR5); automation as a drawn outlier. |
| FW2-11 | TTKS (five books) | **B4 ancestral machine as map and scan.** Default: machine legacy in steps (EW18): use gives a scan panel; command gives automation. | Four-layer earn applied to features: see, use, own, command. |
| FW2-12 | TTKS (five books) | **B5 inspection shifts as odds display.** Default: inspections done well reveal infection grades as numbers (EW19). Reasonably: the reading is wrong when tired. | Odds that depend on your state, not a flat reveal. |
| FW2-13 | Mother of Learning | **The loop as branch-from-here.** (G) The month restarts. Default: inside the loop, "fork" is diegetic: every restart is a new branch of the same month with knowledge kept (EW20). Outside, branch stays a file action (FI19). | The world's native verb is a save feature. |
| FW2-14 | Mother of Learning | **Notebook search as a mind palace.** Default: knowledge is what crosses, so a searchable notebook is the core tool; after mind magic lessons, search ranks by relevance. | FR8 knowledge framing; FI22 with depth. |
| FW2-15 | Mother of Learning | **NPC schedule view by repetition.** Default: after enough loops you know where people are each day; the schedule fills from seen loops. Reasonably: your changes shift schedules, so old rows go stale. | FI23 earned by the world's own mechanic, with drift. |
| FW2-16 | Lord of the Mysteries | **Divination as odds display.** (G) Dream, pendulum and coin divination answer narrow questions (RS30). Default: a yes or no with a confidence band; exact numbers out of reach at low Sequence. Reasonably: it risks attention from above. | FI14 with interpretation risk. |
| FW2-17 | Lord of the Mysteries | **Spirit vision as stat breakdown on others.** (G) Seers see auras and emotion colors. Default: a toggle that shows rough mood and health of NPCs. Reasonably: it costs spirituality and can show things that look back. | FI12 for others as a body change (FR7). |
| FW2-18 | Lord of the Mysteries | **A gathering's broker as purchased service.** (G) Mystic gatherings trade formulas and info. Default: price trends and rumor feeds as a paid membership (FR4 plus FR9). | Market data with exposure risk. |
| FW2-19 | Circle of Inevitability | **Village reset as auto-routine.** (G) The daily reset keeps gains (EW29). Default: a routine planned in one loop runs itself in the next; deviations need attention. | FI2 queue as the loop's own memory. |
| FW2-20 | Circle of Inevitability | **Burdened gift as a borrowed panel.** (G) Default: a bestowed power shows a burden meter; the feature it grants (future preview, FI30) is lost if the burden fills (EW28). | Contract framing (FR15) with a visible meter. |
| FW2-21 | Circle of Inevitability | **The familiar-sense meter as hint density.** (QCI-AU2.) Default: a villager-start's sense of "this has happened" raises hint density in-world. | Hint density (FI21) as a character trait instead of a setting, with the setting still present. |
| FW2-22 | Shadow Slave | **Rune view as stat sheet.** (G) Awakened read runes naming attributes, abilities and flaws (RS31). Default: the full stat sheet is the rune view; Memories show their runes. Reasonably: true names hidden in runes are dangerous to show others. | The world already ships a status window; the feature is native. |
| FW2-23 | Shadow Slave | **Shadows as delegation.** (G) Shadows serve their master. Default: a shadow can run a simple task or stand guard (FI35). Reasonably: shadows have limits and strong ones are rare. | Automation with a body. |
| FW2-24 | Shadow Slave | **Nightmare as bounded time skip.** (G) The Spell moves you through Nightmares. Default: time inside a Nightmare is not the waking world's time; return can skip waking time by the world's own rules. | FI4 tied to a world clock rule, not a button. |

---

## 6. Deeper (DP)

| Code | Consideration | Why it matters |
|---|---|---|
| DP1 | **Features change how a world feels when unlocked.** A map turns a frightening forest into a known one; odds turn a gamble into a choice. Default: each world flags which features it reveals late on purpose (horror, mystery) and which early (logistics). | The interface is part of the mood. Late reveals keep fear and mystery alive. |
| DP2 | **Features can be lost.** A confiscated map, a revoked library card, a cracked status window, a dead familiar. Default: loss disables live use and keeps learned records (LN8). Dial: harsh worlds can also blur stale records over time. | Loss gives a feature weight and creates goals (get it back). |
| DP3 | **Features with in-world costs.** Divination draws attention; spirit vision costs spirituality; Identify costs a pearl; a broker costs a fee. Default: base versions are free; stronger in-world versions cost the world's own currency. | Keeps power optional and ties features to each world's economy. |
| DP4 | **Other NPCs have the feature too.** Rivals with odds displays bet better; a quartermaster with storage plans around everyone; an Auror with a map watches you. Default: an NPC holding a feature changes their behavior in readable ways. | Makes features part of the world, not a player privilege. Ties to part 13 EO15. |
| DP5 | **Having the feature is suspicious.** A child who reads runes, a cadet who always knows the inventory count, a student with a map of the castle. Default: an unusual feature raises attention with those who would notice. Dial: per world from shrugged off to hunted. | Fits `docs/CHEAT_COSMOLOGY.md` "who notices". Gives cheats social cost. |
| DP6 | **Features with a voice.** A storyteller who offers fast-forward with a comment; a status window clerk who is bored (PRESENTATION "The Clerk"). Default: the voice is a skin; the function is the same. | Adds character without changing balance. |
| DP7 | **Features that degrade or drift.** Schedules go stale as you change the world (FW2-15); a map shows an older layout; odds shift after the enemy learns. Default: shown values carry an "as of" mark. | Rewards re-checking and keeps info honest. |
| DP8 | **Features shared across lives.** An heir inherits a library card or a familiar; a reincarnator keeps knowledge panels. Default: lineage scope with a receipt (FR14, part 13 EO16). | Gives succession a concrete interface payoff. |
| DP9 | **Features that cross worlds and stop working.** A system panel goes dark in a no-system world; a map has no signal. Default: panel stays readable with the reason (THEMATIC_UI "Crossing worlds"). | Makes world differences felt through the UI. |
| DP10 | **Features as a reward in their own right.** Some players want info more than power. Default: a quest reward can be a panel (the bestiary weakness tier) instead of an item. | Widens reward types beyond numbers. |
| DP11 | **Refusing a feature.** Turning down a patron's status window, a church's spirit vision or a system's auto-loop. Default: refusal keeps the base version and opens a refusal route (part 13 EO2). | Lets the player choose a harder, plainer life with its own rewards. |
| DP12 | **Feature as a disguise tell.** Fans notice when a "commoner" uses a noble's tool or a wizard's gesture. Default: some features have a visible tell when used near observers. | Small detail that makes the world feel watched. |

---

## 7. Recommendation

**Recommended default policy (proposal).**

- **Base layer.** QoL, info about your own state and plain logistics live in the base game. They open by play through `discovered()` facts (X1) at first need, Proto23 style. Vanilla keeps its current open features as is (LN9).
- **Lines layer.** LN1 to LN10 stay outside play and outside cheats.
- **World layer.** A world can reskin a base feature as a tool, servant, institution or ritual with its own cost, and can offer a stronger version.
- **Cheat layer.** "Cheat" is reserved for a feature that breaks that world's rule (hidden truths, real undo, free time skip, exact odds where others guess). It follows the patron and cost rules from part 13.
- **Sandbox.** KA2 opens every feature with a stamp, and sealed info still shows by ID only.

**Dials.**

| Code | Dial | Default | Range |
|---|---|---|---|
| DL1 | Interface staging | Discover at first need | All open from start, to staged amnesiac start |
| DL2 | Cheat framing | Per world, when the world gives a reason | Off (all features plain) to heavy (most features carry fiction) |
| DL3 | Feature loss | Lose live use, keep records | No loss, to stale records blur |
| DL4 | Suspicion | Per world | Ignored to hunted |
| DL5 | Odds display | Your own rough odds by play | Hidden to exact everywhere |
| DL6 | Hint density | Medium | None to near-solution |
| DL7 | Offline rate | Modest after BO10 | Frozen to full |
| DL8 | Open everything | Off | Per feature, per world, all (sandbox stamp) |

**Five cheapest builds, with save impact.**

| Code | Build | Save impact |
|---|---|---|
| T1 | **Feature home table as data.** One table mapping feature id to home, framing per world and the discovery fact, read by existing `registerWorkspaceModule` `discovered()` hooks (`src/workspace_layout.js:7,101-106`). | None. Discovery is derived from existing save facts. |
| T2 | **Assist settings group.** Hint density, spoiler guard and combat log detail next to font size and color scheme (`src/customization_ui.js:30`, `src/workspace_layout.js:77-82`). | None. New local storage key on the existing pattern. |
| T3 | **Sandbox feature switch under KA2.** Opens every feature, stamps the header, keeps seal guards. | Header flag only (part 11 KA2). |
| T4 | **Per-world label skin for existing panels.** Equipment comparison as "Appraise", bestiary as "Rune lore", log as "Pensieve" via a presentation profile row. | None. Presentation only. |
| T5 | **Earned Habit automation.** After N completions of a native recipe, offer the existing simulation program for it (`src/simulation_ui.js:23`), with counts read from title counters (`src/titles.js:7`). | None if the counter exists; otherwise one additive counter defaulting to 0, with a trivial migration. |

---

## 8. Quests and generators (QG, added 2026-10-14)

Weibao (2026-10-14): "Quest generators and more? more to consider? Should those be gated by a cheat? or is it base game but extended by cheats and more?" Then: "Quests that shows up based on actions and goals? more to consider?"

Proposal, not accepted. Answer under the part 7 policy: **base game, extended by world reskins and cheats.** The cheat test (refinement 3) settles it: locals get work handed to them in nearly every world, so a quest source is a tool. A quest source that breaks a world rule (knows hidden truth, pays from nothing, rewrites the world to make a target) is a cheat. LN10 also applies: a cheat-free life must still have goals.

**Accepted direction this builds on.** `docs/LIFE_SIM_NORTH_STAR.md` lines 1099-1110 (2026-10-07): three quest kinds (vanilla, Ambitions, story quests); quests surface through gossip and events; missed ones become log lines; Weibao chose "both" for Ambitions (the game suggests, the player accepts or writes one).

### 8.1 Code today (QC)

Source-read 2026-10-14, not browser-checked.

| Code | Fact | Why it matters |
|---|---|---|
| QC1 | Vanilla quests are hand-written objects in `src/quests.js` (597 lines) with `QuestTask` conditions grouped `any` / `all`. | A generator can emit the same shape instead of a new quest type. |
| QC2 | Task event types are `kill`, `kill_any`, `clear`, `reach_skill`, `enter_location` (`src/quests.js:205-223`); `change_location` fires `enter_location` (`src/main.js:2196`). | The action hooks QT needs already exist for these verbs. New verbs (craft, sell, talk, read) need new event calls. |
| QC3 | Native unlocks can start a quest (`src/native_unlock_transaction.js:37`). | A discovery-triggered quest has a working route today. |
| QC4 | No general native quest generator exists. Six authored expansion quest cards already share the quest display (`src/expansion_quest_ui.js:8-28`, `src/frontier_campaign.js:56-77`), and `src/simulation.js` already has due checks, saved draws and guaranteeAfter pacing (corrected by R2 K04, K05). | Generated quests are a new consumer of existing seams, not a parallel reward owner. LN9 is not at stake. |

### 8.2 Layers (QL)

| Code | Layer | Default | Why it matters |
|---|---|---|---|
| QL1 | **Base sources** | World-native boards, guild ranks, bounties, neighbors' problems, rumors at the inn. Open by play: the board panel appears when you first meet a board (X1 discovery). | Every life has goals without a patron. |
| QL2 | **World reskin** | Same engine with a local face: adventurers' guild, Hogwarts detentions and professor errands, Fallout radio calls, sect missions, regimental orders. | Worlds feel different without separate code. |
| QL3 | **Cheat versions** | Daily quest with penalty (Solo Leveling), parasite system that steers (`docs/CHEAT_LIBRARY.md` Oracle of Yonder), foreknowledge quests, hidden-truth quests pointing at sealed routes, quests that create their own target, quest system C3 with points and shop. | Breaks a rule; follows part 13 patron and cost rules; can crack or go dark (DP2, DP9). |
| QL4 | **Ambitions** | Personal goals, suggested from events or written by the player (accepted direction). | The player's own quest source, no issuer needed. |
| QL5 | **Sandbox** | Spawn any quest type, sandbox stamp (T3). | Testing and free play. |

### 8.3 Sources: what generates (QS)

Each source reads world state; none rolls a random fetch from nothing.

| Code | Source | Example | Why it matters |
|---|---|---|---|
| QS1 | **Shortage** | Grain low before winter, herbalist out of moonleaf. | Quest exists because the economy says so; finishing it changes prices. |
| QS2 | **Threat** | Wolves bred in the north woods; bandits on the trade road. | Undone, the threat grows or moves (QX1). |
| QS3 | **NPC need** | An authored person's current goal (`DEEPER_SYSTEM_INTERACTIONS` line 50) becomes a favor request. | Favors carry relationship weight and can be refused by either side. |
| QS4 | **Institution** | Guild rank exam, sect mission quota, school assignment. | Comes with dues and rank; fails can cost membership (FR4). |
| QS5 | **Rumor** | Gossip points at a ruin, a missing person, a treasure. | Reliability varies; some rumors are wrong (Knowledge and discovery "Told" layer). |
| QS6 | **Event** | Festival, plague, succession, war call. | Time-limited; missed ones become log lines. |
| QS7 | **Story beat** | Canon plot near the protagonist. | Story quests you join, change or miss. |
| QS8 | **Rift or dungeon** | Gate, rift, dungeon break, anomaly. | Native in Solo Leveling, DCC, Shadow Slave; spawns combat and loot work. |
| QS9 | **Contract** | Trade run, escort, caravan, commission. | Idle fit: hire a party to run it while away (QX6). |
| QS10 | **Dream or vision** | A divination, a nightmare, a patron's whisper. | Ambiguous issuer; can be a cheat face or a world rule. |

### 8.4 Triggers from your actions (QT)

Quests that show up because of what you did. The trigger is a save fact or counter, so a quest has a receipt ("offered because you sold 40 pelts").

| Code | Trigger | Example | Default |
|---|---|---|---|
| QT1 | **Skill or practice milestone** | Smithing 10: the smith offers a masterwork commission. | Offer, not auto-accept. |
| QT2 | **Repeated action** | Killed 30 wolves: the hunter's lodge invites you; the druid circle asks you to stop. | Repetition attracts both patrons and objectors. |
| QT3 | **Item found** | Pick up a sealed letter, a broken sword, a map fragment. | The item carries its own quest seed (vanilla-style). |
| QT4 | **Place entered** | First visit to a ruin or shrine (QC2 `enter_location`). | Uses the existing hook. |
| QT5 | **Person met or helped** | Help someone once; they come back with a bigger ask. | Follow-ups gated by trust, not a fixed count. |
| QT6 | **Harm done** | Theft, a death, a broken promise. | Revenge, bounty on you or a guilt quest (QX3). |
| QT7 | **Renown or suspicion threshold** | Known as a healer: plague town asks; known as a thief: guard investigates. | Reads renown (FI25) and suspicion (DP5). |
| QT8 | **Discovery** | Learn a secret or a recipe. | Native unlocks can start quests today (QC3). Sealed routes stay sealed; the quest names an ID only in reports. |
| QT9 | **Failure or death** | Lose a fight, die. | Rematch, recovery or a death-reward quest (`FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md`). |
| QT10 | **Body or life stage** | Coming of age, pregnancy, aging, illness, hunger. | Life-sim beats as quests (`HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md`). |
| QT11 | **Absence** | Away a season: the farm needs repair, a rival took your stall. | Offline time produces consequences you can fix. |

### 8.5 Quests from goals (QG)

Goal-driven quests run the other way: a goal exists first and the game decomposes it into steps.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QG1 | **Player-written goal** | Free text plus a chosen template ("master a craft", "find a person", "earn X", "join Y", "reach a place"). The game maps it to known steps and marks unknown steps as "find out how". | The player can aim anywhere; unknowns become discovery work, not dead ends. |
| QG2 | **Suggested Ambition** | Formed from what happened ("avenge my brother" after a death). Accept, reword or decline. | Accepted direction. Declined suggestions stay in a list, not deleted. |
| QG3 | **Goal decomposition as planning** | A goal shows a step tree: known steps, guessed steps, unknown steps. Steps can come from any source (QS) or trigger (QT). | Shows what to do next without a walkthrough. Hint density (DL6) controls how much is filled in. |
| QG4 | **Goal pulls the generator** | Active goals weight which generated quests appear: aim to be a smith and more ore and forge work surfaces. | The world seems to answer your interests, honestly framed as "you notice". |
| QG5 | **Character's goal vs player's goal** | The character can hold goals the player did not choose (identity doc Q1, "who forms the goal"). Conflict is shown, not hidden. | Fits possession, shared-body and strong-personality starts. |
| QG6 | **Goals change** | A goal can be abandoned, transformed (revenge becomes protection) or fulfilled early. | Abandoning is a life event, not a fail screen. |
| QG7 | **Inherited goals** | An heir or reincarnation can take up a predecessor's unfinished goal. | Lineage scope (DP8); a family ambition across lives. |
| QG8 | **Shared goals** | A companion, faction or patron shares or opposes your goal. | Allies help with steps; rivals race you. |
| QG9 | **Goal as cheat** | Some systems read your goals and post quests toward them, or toward what they want you to want. | QL3 parasite system: steering by tailored offers is the cost. |
| QG10 | **Long and short goals** | Day, season, life, multiverse horizons (`LIFE_SIM_NORTH_STAR.md` line 3881 table). | Idle play needs both a next hour and a next decade. |

### 8.6 Deeper (QX)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QX1 | **Undone quests have consequences** | The threat grows, the person finds someone else, the price spikes. Missed ones become log lines (accepted). | The world does not wait; choosing not to act is a choice. |
| QX2 | **Who issued it matters** | Person, institution, world, patron or unknown. Each issuer has motives and can lie, inflate or betray. | Quests become relationships, not checklists. |
| QX3 | **You can be the target** | Others' boards post bounties on you once renown or suspicion is high enough. | The generator is also a threat. |
| QX4 | **Rewards beyond numbers** | A panel (DP10), access, a contact, a clue, a title, a favor owed. | Info and access as rewards. |
| QX5 | **Quests conflict** | Two factions want opposite outcomes; helping one closes the other. | Choices that gate choices (`CHOICES_THAT_GATE_CHOICES_2026-10-13.md`). |
| QX6 | **Idle delegation** | Hired party, apprentice or follower runs a contract while you are away, with risk and a report. A cheat version is scale (shadow army, clones). | FI35 delegation applied to quests. |
| QX7 | **Corrupt or subvert a quest** | Fake the proof, sell out the issuer, do it your way. | Cheat library line 289: corrupt or satisfy the quest system. |
| QX8 | **Quest density per world** | Per-world adjective: sleepy village to rift-saturated city. Not a fixed cap (solo-player rule, no fixed "once"). | Worlds feel different in how much they ask of you. |
| QX9 | **Quest log as a feature that can be framed** | Plain list is base (LN4); a System window, a sect jade slip or a diary are skins. | Same readable floor everywhere. |
| QX10 | **Generated quests remember** | A generated wolf quest names the same wolves, the same farmer; follow-ups chain. | Avoids the radiant-quest feel of interchangeable fetch tasks. |
| QX11 | **Seeded generation** | Generation uses the saved RNG, so reloads do not reroll offers (accepted storyteller rule). | Save integrity and fairness. |
| QX12 | **Storyteller pacing** | A pity timer and a quiet period: no wall of offers, no long drought. | Uses the accepted storyteller with a pity timer. |

### 8.7 Dials

| Code | Dial | Default | Range |
|---|---|---|---|
| DL9 | Quest density | Per world | Sparse to saturated |
| DL10 | Goal suggestion | Suggest from events, player can write | Off to frequent |
| DL11 | Step visibility on goals | Known and guessed steps; unknown marked | Hidden to full plan |
| DL12 | Consequence speed for undone quests | Per world, season scale | Frozen to fast |
| DL13 | Quest framing | Plain board plus world skin | Plain only to heavy System face |

### 8.8 Cheapest builds (T)

| Code | Build | Save impact |
|---|---|---|
| T6 | **Template quest emitter.** A generator that emits vanilla `Quest` / `QuestTask` objects from a template plus a world-state read (QS1, QS2) using existing event types (QC2). | Needs a migration: generated quests must be saved with seed and template id, since vanilla quests are code-defined. Additive field, default empty. |
| T7 | **Action-triggered offers.** Hook QT1, QT2, QT4 to existing counters and `enter_location`; post an offer to the board panel with a receipt. | Offer list in save (additive, default empty). |
| T8 | **Ambition card.** One player-written or suggested goal with a step list mapped to known quest templates (QG1-QG3). | Additive goals array, default empty. |

---

## 9. Quests, second pass (2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly". New angles on part 8; same proposal status.

### 9.1 You as the issuer (QP)

The other side of the board. Most games only let you take work; a life sim lets you give it.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QP1 | **Post a quest** | Once you have money, rank or a home, post work to a board: gather 20 herbs, find my sister, clear my cellar. NPC adventurers take it on their own schedule. | Turns money into outcomes; an idle verb that scales with wealth. |
| QP2 | **Quality of who takes it** | Pay and your renown set who answers: a rookie, a veteran, a crook who takes the advance and runs. | Hiring has risk; reputation of the poster matters. |
| QP3 | **You become an institution** | Found a guild, shop, sect, house or company that issues quests to its members. | Late-life arc; links to hub and home building. |
| QP4 | **Followers' quests** | Followers ask for your help with their goals (QS3 inverted toward you). | Loyalty earned by helping, not by a meter. |
| QP5 | **Mentor quests** | Set tasks for an apprentice or heir; their completion trains them. | Lineage play (DP8, QG7). |
| QP6 | **Bounty on someone** | Post a bounty on a rival or monster. Others may also come for you (QX3). | Escalation that the player starts. |

### 9.2 Other questers (QO)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QO1 | **NPCs take quests too** | Board quests can be finished by someone else first. | Boards feel alive; urgency without timers. |
| QO2 | **Rival adventurers** | A named party competes for the same jobs and rank. | Recurring cast; rivalry can turn to alliance. |
| QO3 | **Party up** | Join an NPC party for a quest; split the pay, share the risk. | Social route into combat for weak builds. |
| QO4 | **Steal credit or be robbed of it** | Someone claims your kill; you claim theirs. | Proof matters (QF6). |
| QO5 | **Quest outcomes from others change the world** | A rival clears the dungeon; the rift closes without you. | You are one actor among many. |

### 9.3 Shapes (QF)

A generator needs more shapes than "kill N" and "fetch X".

| Code | Shape | Example | Why it matters |
|---|---|---|---|
| QF1 | **Investigate** | Find out who poisoned the well; clues and suspects, wrong answers possible. | Uses knowledge and discovery layers; can be wrong. |
| QF2 | **Escort or protect** | Keep a merchant alive on the road; protect a village for three nights. | Defense; idle-friendly when it runs over time. |
| QF3 | **Negotiate or persuade** | Settle a land dispute; convince the elder. | Social skills as quest power. |
| QF4 | **Make or repair** | Forge a blade to spec; repair a bridge. | Crafting lives get quests too. |
| QF5 | **Deliver under constraint** | Before dawn, unseen, without opening it. | Constraints create choices (open it?). |
| QF6 | **Prove it** | Bring a head, a seal, a witness. Faked proof is possible (QX7). | Verification becomes play. |
| QF7 | **Endure or wait** | Hold the post a season; survive the winter. | Fits idle time naturally. |
| QF8 | **Learn** | Pass an exam, master a spell, read a book. | School and sect worlds. |
| QF9 | **Choose a side** | Two issuers, opposite outcomes (QX5). | Branch points. |
| QF10 | **Open-ended** | "Make the town safer." Many ways count. | Rewards creativity; scored by state change, not a checklist. |

### 9.4 Failure and partial success (QR)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QR1 | **Partial credit** | Saved two of three hostages: partial pay, mixed relations. | Outcomes have degrees, not pass/fail. |
| QR2 | **Failure opens work** | A failed escort spawns a rescue or revenge quest. | Failure moves the story. |
| QR3 | **Abandon with cost** | Drop a quest; the issuer remembers. Cost per issuer, not universal. | Freedom with weight. |
| QR4 | **Late completion** | Still possible, worth less or different. | Avoids hard timers punishing idle play. |
| QR5 | **Unwinnable known up front?** | Default: quests can be impossible only when a world says so, and the log explains why afterward (LN7 spirit). | Fair surprise, no blind trap. |

### 9.5 Time and idle (QI)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QI1 | **Offline offers wait or expire by kind** | Standing bounties wait; urgent pleas lapse into log lines. | Absence has a cost without wiping everything. |
| QI2 | **Return summary** | On return: offers that came, ones taken by others, consequences. | You see what the world did. |
| QI3 | **Multi-day quests run in background** | Travel, waiting and enduring tick while you do other things. | Idle core. |
| QI4 | **Calendar quests** | Seasonal festivals, exams, tournaments on known dates. | Planning ahead; FI2 queue fit. |
| QI5 | **Routine-generated quests** | A daily routine produces small offers (the baker you visit asks a favor). | Routine becomes social. |

### 9.6 Presentation (QV)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QV1 | **Board as a place** | A physical board, a guild clerk, a sect hall, a radio, an owl. | Diegetic first, plain list always (LN4). |
| QV2 | **Offers in conversation** | NPCs mention needs in talk; you can ask "any work?". | Quests surface through gossip (accepted). |
| QV3 | **Receipts** | Each offer can show why it appeared (QT). Toggle in Assist settings (T2). | Explains the generator; hideable for immersion. |
| QV4 | **Not a wall of markers** | Few offers at once, pinned goals on top, the rest in a log. | Avoids checklist fatigue (QX12 pacing). |
| QV5 | **Desktop first** | Board and goal tree target laptop width per the standing UI priority; mobile deferred. | Matches accepted UI direction. |

### 9.7 Per world (QW)

Canon-first order (PROJECT.md 2026-10-13). Canon facts only; no sealed content.

| Code | World | Native quest source | Cheat face (if any) |
|---|---|---|---|
| QW1 | Harry Potter | Homework, detentions, professors' errands, house points, Quidditch, O.W.L.s as calendar quests (QI4). | A map or a ledger that posts other students' secrets as tasks. |
| QW2 | D&D | Tavern rumors, quest givers, patrons, guild contracts; the DM as storyteller. | A warlock patron's demands as a quest stream. |
| QW3 | A Soldier's Life | Orders, duty roster, inspections, campaign objectives. Orders are not optional: refusal is a military event. | Foreknowledge of the campaign. |
| QW4 | TTKS | Book-dependent; B2-B3 known system is native in its arc. | Outside that arc, a system is a cheat. |
| QW5 | Mother of Learning | Academy work and town needs that reset each loop; knowledge of quests carries. | Loop memory is the cheat: you know every request in advance. |
| QW6 | LOTM / Circle of Inevitability | Official Beyonder teams' duties, club requests, ingredient hunts. | Divination answers as quest hints (FW2-16), with attention risk. |
| QW7 | Shadow Slave | The Spell assigns trials to everyone it infects, so its quests are native, not a cheat, for the Spell-bearer. | A second, private quest source would be the cheat. |
| QW8 | JJK | Jujutsu school assigns exorcisms by grade; window reports. | Seeing curses' grades exactly. |
| QW9 | Bleach | Division duties, patrols, Hollow alerts. | Quest feed that predicts Hollow appearances. |
| QW10 | Fate | The Grail War is the main quest; Church as a referee. | Knowing other Masters' identities. |
| QW11 | HxH | Hunter exam, Hunter site bounties, Blacklist and Treasure hunting. | Full access to restricted listings. |

Point of QW7: the cheat test is per world. The same "System gives quests" feature is base in one world and a cheat in another.

### 9.8 Engine and authoring (QA)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QA1 | **Templates as data** | Template = shape (QF) + slot rules (who, where, what) + world tags + reward table. | Writers add templates without code. |
| QA2 | **Slot filling from known entities** | Slots pick real NPCs, places, monsters from world state, not new names. | QX10 memory comes free. |
| QA3 | **Authored beats beat generated ones** | When an authored quest fits the moment, it wins over a generated one. | Canon worlds stay canon-first. |
| QA4 | **Validation** | Every generated quest is checked as completable with current state (target exists, place reachable) before offering. | No broken quests. |
| QA5 | **Deterministic tests** | Fixed seed → fixed offers; tests snapshot a week of offers per world. | Generators are testable. |
| QA6 | **Sealed-secret guard** | Quests that point at a sealed route show only in-world clues; reports and logs name the secret by ID. | AGENTS.md sealed-secret rule. |
| QA7 | **New event types** | Add `craft`, `sell`, `talk`, `read`, `give`, `wait` events beside QC2. | Needed by QF3-QF8 and QT. |

### 9.9 Risks (QK)

| Code | Risk | Mitigation |
|---|---|---|
| QK1 | Radiant-quest blandness | QA2 real entities, QX10 chains, QF shape variety. |
| QK2 | Checklist fatigue | QV4 pacing, density dial DL9. |
| QK3 | Generated quests contradicting canon | QA3 authored first; world tags block off-canon templates. |
| QK4 | Save bloat from many offers | Expired offers compress to log lines (QI1). |
| QK5 | Steering feels manipulative | Receipts (QV3); manipulation only where a cheat does it on purpose (QG9). |

### 9.10 More dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL14 | NPC competition for quests | On, gentle | Off to cutthroat |
| DL15 | Offer receipts | Shown | Hidden to always |
| DL16 | Failure harshness | Partial credit | Pass/fail to forgiving |

| Code | Build | Save impact |
|---|---|---|
| T9 | **New quest event types (QA7)** in `src/quests.js` event dispatch. | None for events; quests using them follow T6 storage. |
| T10 | **Completability check (QA4)** before an offer posts. | None. |
| T11 | **Post-a-quest (QP1)** with one NPC taker resolved by time and a roll. | Additive posted-quests array, default empty. |

---

## 10. Quests, third pass: too many offers, open world, toward endgame (2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly, save accordingly? Stuff that naturally lead to end game and more? if anything? open world design? other stuf and more? I cant pick up every bounty after all, more to consider?"

Proposal, not accepted. Sequencing note: the first milestone stays one realm and one prestige layer (PROJECT.md). Endgame rows here describe where ladders lead; they do not add scope to that milestone.

### 10.1 You cannot take every bounty (QN)

Design stance: offers outnumber the hours of a life on purpose. A life is a selection, like a real one. The game should make choosing feel good and skipping feel normal.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QN1 | **Ignoring is free unless you promised** | Untaken offers carry no penalty. Accepted-then-dropped ones cost with that issuer only (QR3). | Removes completionist guilt; promises still mean something. |
| QN2 | **The world resolves what you skip** | Someone else takes it (QO1), the threat grows (QX1), or it fades. The return summary (QI2) tells you which. | Skipping has a story, not a hole. |
| QN3 | **Goals sort the board** | Offers matching active goals (QG4) sit on top; the rest fold into "other work". | Triage by what you want, not by scrolling. |
| QN4 | **Specialization narrows offers** | Known as a monster hunter, you get monster work; a healer gets plague calls. Renown (FI25) shapes the feed. | Identity emerges from choices and keeps the feed short. |
| QN5 | **Route bundling** | The board marks offers on or near your planned route or routine. | Efficiency is a pleasure; picks feel smart. |
| QN6 | **Delegate the rest** | Hand a bounty to a follower, party or hired hand (QX6, QP1); take a cut and the risk. | Wealth and followers turn "can't" into "someone can". |
| QN7 | **Saying no is a verb** | Decline politely, refuse openly or pass it to a friend. Each has a social read. | Turning down work is social play. |
| QN8 | **Roads not taken, at death** | The legacy screen lists notable offers you passed and what became of them. | Reflection, not a fail list. Fits life recap. |
| QN9 | **Another life can pick it up** | An heir, reincarnation or later run can find the same unresolved thread, changed by time. | Lineage gives skipped content a second chance. |
| QN10 | **No completion percentage by default** | No "47% of quests done" meter in normal play. Sandbox or a stats journal (FI26) can show counts. | A percentage turns a life into a checklist. |
| QN11 | **Scarcity is per world** | A busy city overflows with work; a frontier village has two jobs a season. | Density as world adjective (QX8, DL9). |

### 10.2 Open world design (QM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QM1 | **Exploration needs no quest** | Any reachable place can be entered for its own sake; quests are one reason among many. | Curiosity is the main open-world engine. |
| QM2 | **Visible pull** | Landmarks, smoke, ruins and a mountain on the horizon appear in the location text and map as unknown sites. | Things you can see invite you without a marker. |
| QM3 | **Rumors as fuzzy pins** | A rumor places a pin with an uncertainty radius and a reliability note. | Finding the place is part of the quest. |
| QM4 | **Danger gradient, not level walls** | Safe core, risky edges. You can wander into deadly places early; warning signs come first (tracks, bones, locals' advice). | Danger is a choice, not a lock. Scaling per world (DL17). |
| QM5 | **Regions have state** | Each region tracks control, season, prosperity and threat; quests read and write it (QS). | The map changes because of you and others. |
| QM6 | **Travel is content** | Journeys produce encounters, camps and roadside offers; idle-friendly as a background routine (QI3). | Space between points matters. |
| QM7 | **Knowledge map** | The map shows what this life knows; others' maps can be bought, stolen or inherited (FI7, FR2). | Knowledge as map. |
| QM8 | **Systemic answers** | Fire burns, rivers block, guards sleep, bribes work. Several ways through a problem. | Open world means open methods, not only open space. |
| QM9 | **Places remember you** | A cleared ruin stays cleared until something moves in; a town you saved greets you. | Persistence makes the world feel lived in. |
| QM10 | **Expeditions** | Set out on a multi-day expedition with supplies; resolve as a background run with a report and choices at key points. | Open world in an idle game. |
| QM11 | **Hidden places, no markers** | Some places are found only by noticing (a draft under a door, a song's lyric). | Discovery layer "Hidden" (accepted). |
| QM12 | **Desktop map first** | Map and region panels designed at laptop width; mobile deferred. | Standing UI priority. |

### 10.3 Toward endgame (QE)

Quests should ladder upward on their own. Each finished tier changes who notices you, which changes what gets offered. The loop table in `docs/LIFE_SIM_NORTH_STAR.md` (Moment to Multiverse) is the ladder.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QE1 | **Scale ladder** | Village, region, realm, world, multiverse. Renown and power past a tier attract the next tier's issuers. | Endgame arrives by escalation, not a menu. |
| QE2 | **Bigger powers notice** | Nobles, sects, gods, patrons and rival transmigrators start offering (or threatening) once you matter. | The issuer list grows with you. |
| QE3 | **Goal chains** | A fulfilled Ambition suggests a bigger one ("master the forge" then "forge a legend" then "found a school"). | Goals grow without the player having to invent each tier. |
| QE4 | **Endgame paths** | Several, none required: **Ruler** (own a town, realm or world), **Master** (top of a power or craft ladder), **Founder** (an institution that outlives you), **Resolver** (face the world's great threat or canon climax), **Seeker** (sealed truths, tracked by ID), **Explorer** (every region, then other worlds), **Escapee** (leave the cycle, free yourself from a patron), **Legacy** (a lineage that shapes history). | Many ends fit "several progression paths" in PROJECT.md. |
| QE5 | **World ceiling** | Each world has a native power and influence cap (canon's top tier). Beyond it lies "the outside" (`LIFE_SIM_NORTH_STAR.md` line 2942). | The world's own end leads to the next layer. |
| QE6 | **Finished world, still playable** | Reaching a world's end gives an epilogue and leaves the world open, changed. | Endings without a wall. |
| QE7 | **Endgame quests change the board** | Late quests reshape regions, factions and economies, which changes what small quests appear. | Your peak shows up in ordinary days. |
| QE8 | **Prestige hook** | A finished life or world feeds the prestige layer: carry what the world's rules allow. | Connects quests to the first-milestone prestige layer. |
| QE9 | **Post-peak life** | Aging, teaching, retiring, ruling. Endgame for one life can be quiet. | Life-sim honesty: not every end is a boss. |
| QE10 | **Endgame threats come to you** | Past a scale, crises arrive whether or not you accept a quest (war, invasion, a god's attention). | Power has a cost; prevents a solved, static world. |

### 10.4 Across worlds and the hub (QH)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QH1 | **Hub board** | The hub posts work set in other worlds (fetch a reagent from LOTM, an escort in D&D). | Ties worlds together through ordinary work. |
| QH2 | **Threads that cross** | A quest started in one world can need something from another. | Multiverse play from the ground up. |
| QH3 | **Quests as cheat acquisition** | A patron's trial, a system's onboarding quest or a relic hunt grants a cheat (`FEATURE_UNLOCK_AND_CHEAT_ACQUISITION_PROCESS_2026-10-13.md`). | Cheats earned through play, not only granted. |
| QH4 | **Reputation does not travel by default** | A legend in one world is a stranger in the next, unless a hub faction or cheat carries it. | Each world restarts the ladder; carryover is a choice. |
| QH5 | **World-native boards stay native** | Cross-world offers sit in the hub or a cheat panel, not on a local board. | Keeps canon worlds coherent. |

### 10.5 Other stuff (QZ)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QZ1 | **Quests that change who you are** | Mercy or cruelty choices shift traits, beliefs or titles. | Identity built by deeds (PLAYER_CHARACTER_IDENTITY doc). |
| QZ2 | **Companion arcs** | Companions' personal quests surface as trust grows. | Relationships with story. |
| QZ3 | **Teaching through quests** | A new system (crafting, alchemy, a power) opens with a short quest from someone who knows it. | Onboarding in fiction; replaces tutorials. |
| QZ4 | **Quest-free play is valid** | A life of farming, trading or studying with no quests still progresses. | Life sim first; quests are one path. |
| QZ5 | **Morally grey work** | Smuggling, debt collecting, assassination contracts. Reputation with different groups moves in opposite directions. | Fits the grey-area design stance; choices have readers. |
| QZ6 | **Repeatable work vs story** | Bounties and contracts repeat as a job; story quests happen once per world state. Repeat limits are per world, never a fixed "once". | Idle loops need repeatable work. |

### 10.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL17 | Danger scaling | Fixed danger by region | Fixed to scales with you |
| DL18 | Roads-not-taken recap | On at death | Off to every season |
| DL19 | Endgame pressure (QE10) | Per world | None to relentless |
| DL20 | Completion meter | Off in normal play | Off to always shown |

| Code | Build | Save impact |
|---|---|---|
| T12 | **Goal-sorted board (QN3, QN5).** Sort offers by active goal match and route distance. | None; derived. |
| T13 | **Return summary (QI2, QN2).** List offers that came, lapsed or were taken by others while away. | Uses the T7 offer list; lapsed offers compress to log lines. |
| T14 | **Region state (QM5).** Control, prosperity and threat per region that generators read and quests write. | Additive region-state map, default derived from current world data; migration needed. |

---

## 11. Book world endings (QB, 2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly, book world endings and more? more to consider?"

Proposal, not accepted. The divergence machinery already exists as a proposal in `docs/TIMELINES_AND_DIVERGENCE.md` (natural course, inertia, canon pressure, off-rails mode, per-world mutability dials). This part adds what is specific to endings. Related: epilogue starts ST3 (`06_CROSS_WORLD.md`), after-canon starts UG4 (`11_ACCESS_AND_STARTS.md`), SCI9 (`12_PRIORITY_WORLD_STARTS.md`), endgame paths QE4 and finished-world QE6 above.

Spoilers: public franchise endings are not sealed (AGENTS.md), but they stay out of UI until reached, under spoiler controls (LN6). A changed or randomized ending is sealed and referred to by ID.

### 11.1 Kinds of source ending (QB-K)

Each source gets an ending type in its world pack. Status needs source verification before a pack relies on it (PROJECT.md attribution rule).

| Code | Ending type | Fit | What the game does |
|---|---|---|---|
| QBK1 | **Closed** | A finished series with a final climax and often an epilogue. | Climax is a scheduled event graph node; after it, the epilogue era is a valid world state. |
| QBK2 | **Closed with sequel era** | A finished arc with a later continuation in the same world. | Sequel is a later era of the same world instance, not a new world (era stacking). |
| QBK3 | **Ongoing** | Publication continues or is on hiatus. | Canon runs to the last verified chapter; past that is the **canon frontier** (11.3). |
| QBK4 | **Branching** | Visual novels or works with several routes or endings. | Each route is an event-graph branch chosen by world state, not a menu. |
| QBK5 | **Setting, no ending** | Tabletop settings and shared worlds. | Natural course is generated (motive-driven); endings are campaign-scale threats, many possible. |
| QBK6 | **Adaptation split** | Different adaptations end differently. | The world pack names which continuity it follows; the other is an AU overlay. |
| QBK7 | **Disputed canon** | Supplementary works whose canon status fans argue about. | Optional overlay, off by default, labeled. |

Per world, by type only (no plot detail). **Updated 2026-10-14 from R1** (`docs/gm/dispatch/runs-and-endings-2026-10-14/r1/REPORT.md`, which holds evidence labels and citations). Spans and rates are rough; rates are proposals (RL1).

| Code | World | Ending type | Note (R1 code) |
|---|---|---|---|
| QBW1 | Harry Potter | QBK1 + QBK2 + QBK7 | Seven books complete; officially recognized stage sequel recorded separately from fan dispute. Canon ~6.8 years, 19-year epilogue gap. Proposed 7 days/h. (V01) |
| QBW2 | D&D | QBK5 | No global ending or frontier; each run binds setting, edition and adventure. Proposed 1 day/h regional campaign. (V02) |
| QBW3 | A Soldier's Life | Ongoing coverage, status U | Supplied books 1-5 to ch 319 is acquisition coverage, not a final ending; ~2 years attributed. Proposed 3 days/h. (V03) |
| QBW4 | TTKS | QBK3 per book | **Correction:** all five titles are ongoing at the 2026-10-10 capture, and B3 holds several challenge worlds plus a return, not one world. Separate local clocks per book; no manufactured climaxes. (V04a-e, V29) |
| QBW5 | Mother of Learning | QBK1 | Repeated external month vs ~8.5 subjective years; month-later aftermath era. Proposed 7 subjective days/h. (V05) |
| QBW6 | LOTM / Circle of Inevitability | QBK2 | Both novels complete; ~3.3 years then ~2.3 years, ~6-year gap between eras. Proposed 7 days/h. (V06) |
| QBW7 | Shadow Slave | QBK3 | Ongoing; exact current chapter and date still OPEN. Proposed 14 days/h. (V07, V17) |
| QBW8 | JJK | QBK1 + QBK2 | **Correction:** completed short sequel set decades later. Original ~6-7 months. Proposed 0.5 days/h. (V08) |
| QBW9 | Bleach | QBK1 + later one-shot and novels | Do not invent ongoing serialization; ~2 years to the war, later eras 10 and 12 years on. Proposed 3 days/h. (V09) |
| QBW10 | Fate | QBK4 | Routes apply to stay night; hollow ataraxia bound separately; no franchise-wide frontier. ~two-week route, proposed 0.0625 days/h. (V10) |
| QBW11 | HxH | QBK3 | Published to ch 420 with a dated return-to-gap; ~2.6 years, ~9 arcs. Proposed 3 days/h. (V11) |
| QBW12 | FMA | QBK6 | Split completed continuities; the 2003 film belongs to the 2003 line only. Manga ~1 year, proposed 1 day/h. (V12) |
| QBW13 | Naruto | QBK1 + QBK2 (sequel ongoing) | Original ~5 years; sequel has its own frontier. Proposed 7 days/h; later-generation starts separate. (V13) |
| QBW14 | Chainsaw Man | QBK1 | Two-part manga completed (ch 232). ~2-year envelope, proposed 3 days/h. (V14) |
| QBW15 | One Piece | QBK3 | Ongoing (ch 1195 as of 2026-10-11); ~11 sagas and ~33 arcs; final saga is not a completed ending. Proposed 3 days/h. (V15) |

R1 cross-cutting findings folded into this part:

| Code | Finding | Default |
|---|---|---|
| QBV1 | **Ending metadata combines, not one enum** (V00). Base closure, sequel status, adaptation or route identity and dispute are separate fields. | QBK codes stack, as in the table above. |
| QBV2 | **Frontier needs four endpoints** (V16, V18, V19). Published, captured, read and adapted endpoints, each with an absolute date and observation date. | QBF1 and QBF4 record all four; a displayed count is not enough. |
| QBV3 | **Several clocks** (V21). Waking, subjective, simulation, loop and hub clocks are separate; acceleration preserves source ratios. | RL1 rates apply per clock. |
| QBV4 | **Eras are optional run scopes** (V22), not forced life ends, resets or prestige. | RL7 unchanged in spirit; never a forced end. |
| QBV5 | **Static metadata first** (V23). Ending type, eras and rates live in world-pack data; persisted clocks later need additive versioning without retiming current instances. | T15 stays save-free. |
| QBV6 | **Open gaps stay open** (V25): Shadow Slave current chapter, today's A Soldier's Life and TTKS publication status, some exact spans. | Not promoted to facts. |

### 11.2 You and the climax (QB-C)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QBC1 | **The climax keeps its causes, not its schedule** | The natural course reaches its climax when its real causes hold, whether or not you take part. If causes fail, the event changes or never comes; prevention is a valid end (R2 K32; `docs/TIMELINES_AND_DIVERGENCE.md` T3). | You live in a world with its own story, not a stage waiting for you. |
| QBC2 | **Your role at the end** | Participant, helper, witness, absent, on the other side, or the cause of a different ending. | Many ways to be present; quiet lives can watch it from a village. |
| QBC3 | **Changed ending** | Enough disturbance (TIMELINES inertia) shifts the outcome: better, worse or sideways. The changed outcome is a sealed state, referred to by ID. | Your actions can matter at the largest scale. |
| QBC4 | **Ending that never comes** | You defuse the cause early; the climax never forms. Motives persist (TIMELINES C6), so a different crisis can grow. | Prevention is valid and has follow-ons. |
| QBC5 | **Bad ending** | The antagonist side wins. The world continues in that state, playable. | Failure is a world, not a game over. |
| QBC6 | **Protagonist absent or replaced** | If the canon lead dies or never appears, a role is filled only by someone with real motive and means; it can stay unfilled. No conjured substitutes to force canon (R2 K32, R5 P-I5). | Classic fanfic premise without railroading. |
| QBC7 | **You die before the end** | Your life ends before the climax; an heir, a fresh life or a ghost can see it. | Lifespans shorter than plots are normal. |
| QBC8 | **Being noticed by the plot** | Rising renown pulls you into canon events: the leads seek you out, antagonists target you. | Ties QE ladder to canon (QE2). |
| QBC9 | **Side characters' endings** | Canon fates of named NPCs (deaths, betrayals, marriages) are scheduled beats you can alter one by one. | Small endings matter as much as the big one. |
| QBC10 | **Foreknowledge of the ending** | A transmigrator who knows the ending has it as a notebook entry with confidence that drops as ripples reach it (TIMELINES "What the player sees"). | Knowing the end is the classic cheat; it decays honestly. |

### 11.3 Canon frontier for ongoing works (QB-F)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QBF1 | **Frontier marker** | The last verified chapter's date is the frontier. Beyond it the world runs on motives and generation, stamped "past canon" in the chronicle. | Honest about what is source and what is game. |
| QBF2 | **New canon arrives** | When new chapters are digested, existing saves keep their own course; new canon applies to new starts or as an opt-in update. | Save integrity (rule 9); no retcon of a life in progress. |
| QBF3 | **No invented canon** | Past the frontier, generated events are labeled original, never presented as the author's plot (LORE_AND_CONTINUITY line 27). | Attribution rule. |
| QBF4 | **Frontier per agent workflow** | Source deep dives (playbook) record the frontier chapter and date. | Keeps the marker verifiable. |

### 11.4 After the ending (QB-A)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QBA1 | **Aftermath era** | After the climax: rebuilding, power vacuum, veterans, ruins, new laws. The world keeps running with motives from the new state. | Epilogue starts (ST3) for the same life. |
| QBA2 | **Time jump choice** | At a world's end you can continue now, skip to the epilogue era, or jump to a sequel era (QBK2). | Fits idle pacing and long lives. |
| QBA3 | **Legend status** | Your part in the ending becomes history: songs, statues, textbooks, or nothing if you hid it. | Renown at world scale; heirs inherit it. |
| QBA4 | **What carries** | Ending a world feeds prestige (QE8) by that world's rules. A changed ending can grant a distinct carry. | Endings pay into the meta layer. |
| QBA5 | **Ending screen** | A chronicle page: what happened, your role, the canon course beside yours (public canon only; changed outcomes by ID in reports). | Closure; a reason to try another role next time. |
| QBA6 | **Replay the same world differently** | Next life in the same world with a different start, era or role (CONTINUATION_CHOICE P3). | Endings invite another run, not a stop. |
| QBA7 | **Endings unlock starts** | Seeing an ending opens after-canon starts (UG4) and AU overlays tied to it. | Earned options. |

### 11.5 More (QB-M)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| QBM1 | **Fix-it and villain-win AUs** | Common fan premises become AU overlays: the tragedy averted, the antagonist triumphant, the quiet epilogue. | Cheap AU variants (canon-first tier note). |
| QBM2 | **Ending as a goal** | "Change the ending" or "see the ending" can be an Ambition (QG2) with steps. | Gives a whole life a spine. |
| QBM3 | **Cross-world after ending** | A finished world can become a source of travelers, items or refugees to others (QH). | Endings feed the multiverse. |
| QBM4 | **The ending's people move on** | Leads age, retire, teach; you can meet them later as NPCs in the aftermath. | Living beside canon after canon. |
| QBM5 | **Smaller arc endings** | Each canon arc ends too (exam, tournament, war). Arc endings are mini-climaxes with the same rules. | Not only the final ending matters. |
| QBM6 | **Loop and time worlds** | In loop worlds an ending can reset, so "the end" may be the escape from the loop. | World-specific meaning of ending. |
| QBM7 | **Ending pacing in idle play** | A climax can pause offline progress or ask for presence (a "be here for this" flag). | Big moments are not resolved while you sleep, unless you choose. |

### 11.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL21 | Climax presence | Asks for presence when you are involved | Never pause to always pause |
| DL22 | Canon-beside-yours on ending screen | On | Off to full comparison |
| DL23 | Post-frontier generation | Motive-driven, stamped | Freeze at frontier to free generation |

| Code | Build | Save impact |
|---|---|---|
| T15 | **Ending type field** in world pack metadata (QBK). | None; data. |
| T16 | **Ending chronicle page** (QBA5) on climax resolution. | Additive record of the resolved climax, default absent. |
| T17 | **Canon frontier stamp** (QBF1) on generated post-frontier events. | Additive flag on chronicle entries, default false. |

---

## 12. Long worlds, uncertain runs, branches and prestige (RN, 2026-10-14)

Weibao (2026-10-14): "It can take a very long time to go through a world, and its not guaranteed, I could die and start again and more? ... For off canon it splits off into a branch world or something, or maybe its time to end that run (or split it) and then continue elsewhere and I prestige? other stuff and more?"

Proposal, not accepted. Owners this builds on: `docs/TIMELINES_AND_DIVERGENCE.md` (mutability dial includes "branching"; line 267 prestige restarts the natural course; heirs inherit the changed world), `CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md` (P1 fresh random life, P2 succession, P3 next protagonist separate from what persists), PROJECT.md (prestige kept separate from travel and ascension; first milestone one realm, one prestige layer). Code: `src/world_instances.js` (429 lines) already models instance and visit identity, revision guards and local facts as detached prototype records, so a branch world is a second instance, not a new concept.

### 12.1 A world is long and not guaranteed (RL)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RL1 | **World time vs play time** | Each world has a time scale (in-world days per real hour) and "wait until next beat" (FI32, FI4). A canon spanning years is reachable in weeks of play, not months. | Long canons stay finishable without rushing. |
| RL2 | **Death mid-world is normal** | A life can end anywhere in the story. The world instance does not reset; it keeps the changes (TIMELINES heirs rule). | Not reaching the end is part of a life sim, not a failure state. |
| RL3 | **Progress lives in several places** | Character (lost at death unless carried), world instance (persists by world rule), lineage (heir: bounded estate leftovers, lessons, reputation, home and obligations already carry through `src/heir_inheritance.js`, per R2 K08), meta, player knowledge. Player knowledge never fills the next character's Notebook without a real carrier (R2 K34). Each death shows what stayed where. | Death never means "everything gone"; the player sees what was kept. |
| RL4 | **Arc credit** | Each finished arc (QBM5), Ambition or ending pays into meta progress, so a life that dies mid-story still earns. | Removes the all-or-nothing feel of long worlds. |
| RL5 | **Next life after death, in this world** | Options: heir, fresh random life in the same world later in time, same era as someone else, or leave the world. All reasonable options reachable (CONTINUATION P1-P3). | Death opens choices instead of one forced path. |
| RL6 | **The world remembers you** | A next life in the same world finds your grave, your legend, your unfinished threads (QN9). | Continuity without immortality. |
| RL7 | **Eras as chapters** | A long canon splits into eras (before, during arcs, climax, aftermath). A run can target one era. | Shorter, complete-feeling runs inside a long world. |
| RL8 | **No save-scum; a character's time power is separate from the player's menu** | Reload does not reroll (QX11). Choosing a start, era or branch premise from the menu is a player choice, not a character power (Weibao 2026-10-10, `docs/USER_VISION.md` lines 1656-1662; corrected by R3 G-C1). An in-world return to an anchor is a time power with its own costs. | Death keeps weight without turning menu access into a cheat. |
| RL9 | **Pace the long middle** | Routines, delegation, expeditions and the storyteller carry the slow years; active play is for turning points (LIFE_SIM loop table, D2b). | Long worlds stay idle-friendly. |
| RL10 | **Difficulty of survival is per world** | Some worlds are lethal (CSM, JJK), some gentle (a village life). Expected life length is a world adjective. | Players can pick how risky a run is. |

### 12.2 Off canon: same world, or a branch world (RB)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RB1 | **Three handlings** | (a) **Stay**: one instance goes off canon and runs on motives (TIMELINES off-rails). (b) **Branch**: past a divergence threshold, the instance is labeled a branch world; the canon template stays clean for new starts. (c) **Fork on demand**: the player splits a copy (time cheat or sandbox). | All three stay reachable; (a) plus (b) labeling is the base default. |
| RB2 | **Canon template is never modified** | A world pack is a template. Every run is an instance. Divergence lives in the instance only. | New starts always get canon; branches never leak into it. |
| RB3 | **Branches are places** | A branched instance appears in the hub atlas with a name ("the world where the war never came") and can be revisited by later lives or travelers. | Your changed worlds become part of the multiverse. |
| RB4 | **Branches are saved automatically; carrying a person back is the power** | Accepted direction: branches are saved automatically as diffs, named by biggest change and renamable (`docs/TIMELINES_AND_DIVERGENCE.md` 2026-10-10 sections). Selecting a branch premise is a player choice (RL8). A character who deliberately splits or returns through time needs a world route or cheat. Labeling is not forking: an actual fork needs real owned state (R2 K37). | Keeps the cheat test for in-world time power only. |
| RB5 | **Branch drift label** | Each instance carries a drift band (near canon, bent, broken, unrecognizable) shown only in the atlas or via a divergence sense (TIMELINES "Optional faculties"). | Lets players choose where to go without numbers in normal play. |
| RB6 | **Branch limit by save size, not "once"** | Instances accumulate. Old, unvisited ones compress to a summary (state aggregates plus chronicle) and can be archived or exported. | Save integrity without a fixed cap. |
| RB7 | **Branch merge is rare power** | Merging two instances is a high cheat or endgame feat, never a base action. | Multiverse endgame material (QE5). |
| RB8 | **Canon worlds vs original worlds** | Original worlds have a generated natural course; "branch" there means a run instance as well. Same mechanics. | One system for all worlds. |
| RB9 | **Others' branches** | Rival transmigrators or patrons can create branches too; you may meet a world someone else bent. | Multiverse with other actors. |

### 12.3 Ending, splitting or shelving a run (RS)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RS1 | **End a run any time** | Retirement, death, world ending, or a plain "close this chapter" action. Solo player: no penalty beyond what the world's rules say. | Player decides when a story is done. |
| RS2 | **Shelve a world** | Leave a world without ending it. It freezes or ticks at low detail (aggregates) per the world's clock rule. Return later as the same or another person. | "Split" a run: stop here, keep the world, go elsewhere. |
| RS3 | **Continue elsewhere with the same person** | Transmigrate, travel or ascend to another world with what that route allows (travel stays separate from prestige). | A life can span worlds without a reset. |
| RS4 | **Continue elsewhere as someone new** | Fresh random life in another world (P1), with prestige carry if you prestiged. | Variety across worlds. |
| RS5 | **Come back changed** | Returning to a shelved world shows elapsed time, what others did (QO5) and what your absence caused (QI2). | Shelving has a story too. |
| RS6 | **Several open worlds at once** | Multiple shelved instances; one active life at a time by default. A cheat or a multi-body premise can run more than one. | Breadth without parallel micro-management by default. |
| RS7 | **Natural stopping points** | The game marks good places to end or shelve: arc ends, a funeral, a graduation, a season turn. | Helps players stop on a high note. |
| RS8 | **Run summary on any end** | Chronicle page per run (QBA5) even for deaths and shelves: what you did, what carried, what is still open. | Closure for every kind of end. |

### 12.4 Prestige (RP)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RP1 | **Prestige is a choice at run end** | When a run ends, prestige is offered, not forced. Declining keeps playing the lineage or world. | Respects long attachment to one world. |
| RP2 | **What prestige measures** | Deeds across the run: arcs, endings (canon, changed or prevented), Ambitions, discoveries, people helped, worlds touched. Not only levels. | Rewards the kinds of play the game wants. |
| RP3 | **What prestige carries** | Earned start options (part 13 EO), soul traits, knowledge records, cheat slots or patron standing; per-world rules can block some (carryover part 17). | Ties into existing carryover owners. |
| RP4 | **Partial prestige** | A run that ended early (death, shelving) still prestiges with its earned deeds (RL4). | Long uncertain worlds still pay. |
| RP5 | **Prestige restarts the natural course** | A new run in a world uses the clean canon template (RB2), unless a carried scar says otherwise (TIMELINES line 267). | Fresh canon for each prestige cycle. |
| RP6 | **Branches survive prestige** | Branch worlds stay in the atlas across prestige cycles, as places, not as your character's state. | Your history across cycles accumulates. |
| RP7 | **Repeat value per world, not "once"** | Repeating an ending pays by that world's adjective (diminishing, steady or rising), never a fixed one-time limit. | Solo-player rule. |
| RP8 | **Prestige vs travel vs ascension vs renewal** | Kept separate (PROJECT). Existing field and structured renewal retains the protagonist (`src/frontier_campaign.js`, `src/structured_renewal.js`, R2 K13) and stays as it is; a next-life prestige reset is a separate proposal needing its own carry contract before any payout (R2 K35, K450). Generic reset and rebirth transitions already exist in `src/simulation.js:567-608` (R2 K39). | One prestige layer for the first milestone; no accidental second layer. |
| RP9 | **First milestone** | One prestige layer, one realm. Branch atlas and multi-world shelving are later layers. | Sequencing, not scope cap. |

### 12.5 Other (RX)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RX1 | **Hall of lives** | Every past life listed with world, era, role, end and legacy. Readable across prestige. | Long-term memory of the player's history. |
| RX2 | **Legends travel slowly** | A famous past life can become a myth in later runs of the same world instance, or in branches it touched. | Rewards history without breaking canon templates. |
| RX3 | **Past selves as NPCs** | In a shelved or branched world, your past life (or their ghost, statue, diary) can appear to a later life. | Meeting yourself is a classic premise. |
| RX4 | **Achievement-like milestones** | Optional records (finished every arc in a world, prevented an ending) feed earned options. | Long-term goals that are not a meter (QN10). |
| RX5 | **Abandon without guilt** | Dropping a world for good is fine; it shelves forever with its summary. | Breadth over completion. |
| RX6 | **Export a world** | A branch instance can be exported and imported like a save (LN2). | Players keep favorite worlds. |
| RX7 | **Run modifiers** | Optional challenge or comfort settings per run (hardcore, gentle, short era). | Lets one player play both ways. |

### 12.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL24 | Branch labeling threshold | Medium drift | Never label to label every divergence |
| DL25 | Shelved world clock | Per world rule | Frozen to full aggregate ticking |
| DL26 | Prestige offer | At every run end | Only at world endings to any time |
| DL27 | Repeat payout per world | World adjective | Diminishing to rising |

| Code | Build | Save impact |
|---|---|---|
| T18 | **Run summary page** (RS8) at any run end, reading chronicle data. | Additive run record, default absent. |
| T19 | **Instance provenance and drift band** on `src/world_instances.js` records (RB2, RB5). | Instance schema 2 with `provenance.kind` canon / original / au / branch / unknown and a `forkedFromInstanceId` separate from enclosing `parentInstanceId`. Old records classify from their definition or become `unknown`, never blanket "canon, near" (R2 K10, K37, K413). |
| T20 | **Shelve action** (RS2) for the current world with a frozen clock. | Additive shelved-instance list; frozen state reuses existing instance records. |
| T21 | **Deeds ledger for prestige** (RP2, RL4) from existing title counters and chronicle. | Additive ledger; existing counters reused. |

Codex follow-up lanes for this part: `docs/gm/dispatch/runs-and-endings-2026-10-14/`.

---

## 13. Death and the next life: later, now or earlier in the same world (NL, 2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly, death and the new life later or past in the same world? more options to consider and more? Send out codex and more as needed?"

Proposal, not accepted. Owners this extends, not replaces: `CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md` (P1-P5, C1-C5 same-world starts, E1-E5 enemy starts, S1-S5 details; P4: choosing an earlier era as a player start needs no in-world time power, but carrying a person, memories or items into the past does), `SUCCESSION_BY_WORLD.md` (per-world death, succession and recognition rules), `docs/TIMELINES_AND_DIVERGENCE.md` (instances, inertia, mutability), `FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md` (DR rows), part 12 above (RL, RB, RS, RP).

Core split used below, from P4: **who you are next** (perspective, body, soul) is separate from **what crosses** (memories, skills, items, relationships) and from **what happens to history** (same instance, branch, overwrite).

### 13.1 When the next life starts (NT)

| Code | Placement | Default handling | Why it matters |
|---|---|---|---|
| NT1 | **Same moment, nearby** | A bystander, the person who found your body, your killer, a newborn that night. Same instance; C1 rules. | Immediate continuation; your death is a scene the next life lives through. |
| NT2 | **Short later (days to years)** | Same instance, aftermath fresh: funeral, estate split, investigation, revenge. C2 rules: elapsed time gets a declared outcome. | Consequences of the death are playable. |
| NT3 | **One generation later** | Your children grown, your workshop someone else's, your rivals old. | Lineage play without being the heir (P3). |
| NT4 | **Long later (centuries)** | You are a legend, a ruin or forgotten. Tech and politics moved (TECHNOLOGY doc eras). | Same world, nearly new setting. |
| NT5 | **Sequel or epilogue era** | Canon's own later era (QBK2) or the aftermath (QBA1). | Uses authored eras. |
| NT6 | **Overlapping your past life (earlier, while you were alive)** | You are born or start while your previous self is still living. Default: a branch (C3) so the finished history stays intact. | Meeting your earlier self is a classic premise; needs a paradox rule (13.3). |
| NT7 | **Before your past life was born** | Prequel era in the same world. As a plain start (P4) it is a branch with no memories; with memories it is regression or time travel. | Prequels and ancestor play. |
| NT8 | **Canon prequel era** | The world's own earlier history (founders, old wars). | Canon-first worlds often have rich back history. |
| NT9 | **Random placement** | Default for "fresh random life" (P1): random among eligible eras of this world, weighted toward later than your death. | Suspense; past placements stay rarer because they need a branch. |
| NT10 | **Chosen placement** | Picking the era from the menu is a player choice (RL8, P4), offered as an earned option or sandbox choice; only carrying a person or memories back needs a route (R5 P-I3). | Choice without making it the default. |

### 13.2 How the next life enters (NE)

| Code | Route | Default | Why it matters |
|---|---|---|---|
| NE1 | **Fresh person, no carry** | Pure perspective change. History stays; you only bring player knowledge. | The cleanest option; no lore needed. |
| NE2 | **Return by the world's own rules** | Only where the world supports it (SUCCESSION_BY_WORLD). The native form may be an infant, an adult, memoryless or partial; an infant with chosen memories is a proposed premise or cheat unless the world says so (C5; corrected by R4 WI3, W03, W41). | Canon-consistent return. |
| NE3 | **In-world afterlife** | Death moves you to a layer of the same world where the world has one: Bleach souls pass on, D&D outer planes (setting-pinned). HP portraits and ghosts are representations or remnants, not automatic afterlife personhood (R4 WI4). | The same world continues past death without a reset. |
| NE4 | **Resurrection** | A world-native price (D&D raise dead, a ritual, a bargain). Body returns; costs and changes stick. | Death can be undone where the world allows, never free. |
| NE5 | **Undeath or remnant** | Revenant, cursed spirit, lingering will, possessed item. | A dark continuation; world-dependent. |
| NE6 | **Possession or replacement** | Enter a living adult (E2): host survives, resists, shares or is absent. | Adult starts with a body history. |
| NE7 | **Patron or system respawn** | A cheat respawns you (DR4 afterlife offer, regression). Uses cheat costs. | The classic transmigrator loop, as a cheat. |
| NE8 | **Echo** | No memory, only déjà vu, talents or dreams from the past life. Low-cost carry. | Soft continuity for worlds without reincarnation lore. |
| NE9 | **Leave the world** | Death sends you to another world or the hub (RS4). | Same-world return stays optional. |

### 13.3 Past placement and paradox (NP)

| Code | Model | When it fits | Why it matters |
|---|---|---|---|
| NP1 | **Branch (default)** | Any past placement. The finished history stays as its own instance; the new life runs a copy from the earlier point (C3, RB). | Never destroys a finished run. |
| NP2 | **Reset or overwrite** | Worlds or cheats where a reset replaces the old course. MoL is a copied-iteration case with its own retained domains, not arbitrary real-era overwrite (R4 WI5, R5 P-I1; details in r5/SPOILERS.md). A recorded attempt is history, not automatically a visitable world (R5 P46). | Real stakes for time powers, scoped to the source. |
| NP3 | **Closed loop** | Rare, authored: you were always part of history; the new life fills a role the old run already saw (a stranger who helped you). Only for authored beats, not general simulation. | Delightful when authored; impossible to guarantee in general, so kept narrow. |
| NP4 | **Parallel past** | A separate instance with no causal tie; meeting "yourself" is meeting a counterpart (C4). | Simple and safe. |
| NP5 | **Meeting your earlier self** | Weibao's 2026-10-14 lean (USER_VISION, "Little to no interaction with the past selves or bodies?"): past selves and old bodies are ordinary background NPCs with little special interaction by default; a special meeting is optional, never mandatory or a boss (R5 P48, P-I4). | Respects the recorded lean while keeping the option. |
| NP6 | **Helping or harming your past self** | Possible in a branch; outcomes apply only to that branch. | Fix-it play within a branch. |
| NP7 | **Knowledge crossing** | Without a memory route, the character knows nothing; the player still does. Player knowledge guides goals without granting character mastery (identity doc E2). | Keeps player knowledge honest. |

### 13.4 What the next life finds (NF)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| NF1 | **Your grave and remains** | Grave, ashes, a body never found, an empty tomb. Grave robbers and necromancers exist where the world has them. | The past life is physically present. |
| NF2 | **Your stuff** | Estate divided, sold, stolen, kept as relics, cursed. Reclaiming it is a quest (QT3). | Items carry history across lives. |
| NF3 | **Your people** | Widow, children, apprentices, friends and enemies remember you. Recognition of the new you is narrow and fallible (SUCCESSION rule 4). | Emotional weight; reunion and grief scenes. |
| NF4 | **Your killer** | Still alive, rewarded, hunted or regretful. Revenge or forgiveness as an Ambition. | Strong motive for the next life. |
| NF5 | **Your unfinished threads** | Open quests, debts, promises, half-built projects (QN9). | Continuity of play. |
| NF6 | **Your reputation, distorted** | Legend grows or sours with time and retelling (RX2). | History is not exact. |
| NF7 | **Your institutions** | A guild or school you founded thrives or decays (QP3). | Founder endgame pays off across lives. |
| NF8 | **Your secrets** | Things you hid may be found by others; things you knew may be lost. Sealed routes stay sealed by ID. | Secrets have lives of their own. |
| NF9 | **Your changes to the world** | The natural course after your interventions (TIMELINES heirs rule applies to any later life in the instance). | Your impact outlives you. |

### 13.5 Who decides and how often (ND)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| ND1 | **Death screen offers** | Shows the reachable options for this world and your earned options: later here, now here, elsewhere, heir, prestige. Past placements shown when earned or sandbox. | Clear choice at an emotional moment. |
| ND2 | **Random default** | A "surprise me" option follows P1 suspense. | Low-effort continuation. |
| ND3 | **World rules can forbid** | A world without afterlife or reincarnation hides NE2-NE3 unless a cheat or premise provides them. | Canon consistency. |
| ND4 | **Repeat limits are per world** | No fixed "once"; a world may make repeated rebirths costlier, rarer or noticed (DP5). | Solo-player rule. |
| ND5 | **Death notice by others** | Seers, gods, death gods or systems may notice a soul that keeps coming back. | Rebirth has social and cosmic consequences. |
| ND6 | **Grief and attachment** | The game allows lingering: attend your own funeral as a ghost, read letters, see the estate split, before moving on. | Life sim honesty; closure. |

### 13.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL28 | Next-life placement | Random, weighted later | Only later to any era |
| DL29 | Past placement history model | Branch (NP1) | Branch, overwrite, parallel per world |
| DL30 | Memory carry on rebirth | World rule | None to full |
| DL31 | Linger after death | Short | Skip to long |

| Code | Build | Save impact |
|---|---|---|
| T22 | **Same-world later start** (NT2-NT3) using the current instance plus an elapsed-time summary. | New life record linked to existing instance; additive. |
| T23 | **Death screen option list** (ND1) driven by world rules and earned options. | None; derived. |
| T24 | **Past-life traces** (NF1-NF3): grave, estate record and remembered-by list created at death. | Additive records in the instance, default empty. |
| T25 | **Branch-at-earlier-point** (NP1) using `src/world_instances.js` instance copy with a start date. | New instance record; old instance untouched. |

Codex follow-up lanes R4 and R5 in `docs/gm/dispatch/runs-and-endings-2026-10-14/`.

---

## 14. Randomization across quests, runs, deaths and next lives (RZ, 2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly, randomization stuff and more? Merge when done and more?"

Proposal, not accepted. General randomness already has owners; this part covers only what parts 8 to 13 add. Owners: `docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md` P3 (layers: beginning, world creation, ongoing events, action resolution, long-term history; selection policies; commit and persist rules), `docs/PROCEDURAL_GENERATION_STATUS_2026-10-13.md` (what runtime code actually seeds today; O1-O5 order; procgen lanes P1-P18), `docs/emergent/E1_SEEDED_STREAMS.md` (named per-save streams), `docs/emergent/E5_STORYTELLER_AND_FATE.md` (tension, comfort, pacing, fairness), `docs/WORLD_COMPLETION_STANDARD.md` "Random starting points without spoiling discovery", `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` (rolled truths are sealed).

Baseline rules inherited, not restated in each row: reload never rerolls; previews never consume draws; random picks come from qualified, coherent candidates; a randomized truth is sealed and named by ID.

### 14.1 What can be random in quests (RZQ)

| Code | Random element | Default | Why it matters |
|---|---|---|---|
| RZQ1 | **Which offers appear** | Drawn from eligible sources (QS) weighted by state and goals (QG4); a quest stream per world instance. | Variety with reasons. |
| RZQ2 | **Slot filling** | Which real NPC, place, monster fills a template (QA2), weighted by proximity and relationship. | Generated quests stay grounded. |
| RZQ3 | **Hidden complications** | A twist drawn at offer time and committed then: the client lies, the target is innocent, a rival shows. Revealed by play. | Surprise without reload-farming. |
| RZQ4 | **Reward variance** | Within a band; rare bonus outcomes from the same table. | Small excitement without slot-machine feel. |
| RZQ5 | **Rival timing** | When an NPC party takes a board job (QO1) rolls on the same stream. | Urgency stays fair and reproducible. |
| RZQ6 | **Rumor truth** | Each rumor rolls true, partly true or false at creation (Told layer reliability). | Investigation matters. |

### 14.2 What can be random in runs and deaths (RZR)

| Code | Random element | Default | Why it matters |
|---|---|---|---|
| RZR1 | **Next-life placement** | Era, place, family, body drawn from eligible starts weighted later than death (NT9, DL28). | Suspenseful continuation. |
| RZR2 | **Rebirth talents and echoes** | A small draw of talents or echoes (NE8), correlated with the past life where the world's rules allow. | Each life feels distinct. |
| RZR3 | **Afterlife outcome** | Where a soul lands, per the world's rules (NE3), when the world has more than one place. | Canon cosmologies as tables. |
| RZR4 | **Death causes** | Accidents, illness and violence roll from real exposure: what you did, where you were, your body. Warnings come first (QM4). | Death is fair, never a dice ambush. |
| RZR5 | **What the next life finds** | Estate fate, heirs' choices, killer's fate (NF) resolve by motives plus draws on the instance's long-term stream. | The aftermath surprises even you. |
| RZR6 | **Run modifiers** | Optional random modifiers per run (RX7): a harsh winter era, a plague year, a lucky birth. Opt in; shown before commit. | Variety for repeat play. |
| RZR7 | **Prestige offers** | At prestige, a few boons drawn from earned options; choose one. Extra choices are earned. | Hades-style choice, bounded by earned options. |

### 14.3 What can be random in worlds and branches (RZW)

| Code | Random element | Default | Why it matters |
|---|---|---|---|
| RZW1 | **Original worlds' natural course** | Generated history and plans per instance (RB8, E6 lore grammar). | Original worlds differ each run. |
| RZW2 | **Canon worlds stay canon by default** | Canon facts are not rolled. Variation lives in people and places the canon does not fix (STARTS P3 "what may vary without breaking source rules"). | Canon-first priority. |
| RZW3 | **AU rolls** | An opt-in AU overlay can roll a changed premise; the changed truth is sealed. | Replay of canon worlds with real surprise. |
| RZW4 | **Branch events** | Off-canon instances run on motives plus the storyteller (TIMELINES C6, E5), seeded per instance. | Each branch goes its own way. |
| RZW5 | **Shelved world catch-up** | Elapsed time while shelved resolves with aggregate rolls on the instance stream (RS5). | Return surprises without full simulation. |
| RZW6 | **Rival transmigrators and patrons** | Whether another outsider exists in this instance, and who, rolled at creation and sealed. | Not every world has one; when it does, it is a discovery. |

### 14.4 Fairness and feel (RZF)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RZF1 | **Correlated, not independent** | Related facts roll together: a noble birth brings education, duties and enemies (STARTS P3). | Random results that make sense. |
| RZF2 | **Pity without fixing** | Storyteller pacing (E5) eases droughts and spikes; no secret forced luck unless that policy is selected. | Fair over time, honest about it. |
| RZF3 | **Anti-repeat history** | Optional memory across runs so the same start or quest twist does not repeat too soon. | Variety across prestige cycles. |
| RZF4 | **Outliers stay real** | A very lucky or unlucky start is allowed; it is not balanced away by a hidden penalty. | Stories need extremes. |
| RZF5 | **Show the cause, not the roll** | The log says why (a storm, a betrayal), not "rolled 3". Odds display follows FI14 and DL5. | Keeps fiction intact. |
| RZF6 | **Player-chosen seed** | Sandbox and challenge modes can set or share a seed; normal play uses a hidden per-save seed. | Shareable runs without spoiling normal play. |
| RZF7 | **Content changes** | A seed promises identical results only for the same content version; newer packs may differ (STARTS P3). | Honest reproducibility. |

### 14.5 Randomness as power (RZP)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| RZP1 | **Luck as a stat** | A world or cheat can bias draws (E1 cheat seams: see, reroll, pin, bias, steal, rewind). | Luck powers are a common cheat family. |
| RZP2 | **Reroll is a cheat** | An in-fiction reroll of a quest twist, birth or prestige offer uses cheat costs; base play does not reroll. | Keeps decisions weighty. |
| RZP3 | **Fate readers** | Divination shows tendencies of upcoming draws (FW2-16), with interpretation risk. | Information about randomness as a world power. |
| RZP4 | **Fate is noticed** | Bending probability often draws attention (DP5); luck has a price in worlds that track it. | Power with consequences. |

### 14.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL32 | Quest twist rate | Per world | None to frequent |
| DL33 | Run modifiers | Off | Off, opt-in, random |
| DL34 | Anti-repeat memory | On, light | Off to strict |
| DL35 | Seed visibility | Hidden | Hidden, shown in sandbox, shareable |

| Code | Build | Save impact |
|---|---|---|
| T26 | **Quest stream** on E1 streams for offers, slots and twists (RZQ1-RZQ3). | Stream state in save via E1 shape (P1 lane owns streams). |
| T27 | **Next-life draw** from eligible starts with committed result (RZR1). | Committed selection persisted before publication (WORLD_COMPLETION_STANDARD). |
| T28 | **Prestige boon draw** (RZR7). | Committed offer list in the run record. |

Depends on procgen lane P1 (seeded streams) landing first; parts 8 to 13 generators should consume its streams rather than add new randomness.

---

## 15. Between lives: the meta layer, balance, surfaces and onboarding (MZ, 2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly".

Proposal, not accepted. Parts 8 to 14 add many systems that meet between lives: run summaries, death screens, prestige, branch atlas, hall of lives. This part covers how they fit together. Owners: `SELF_AS_PLAYER_LORE_CONSIDERATIONS_2026-10-13.md` (S1 continuing self), `13_EARNED_OPTIONS_AND_CHEATS.md` (EO, CA, PF progress feel), `17_CARRYOVER_AND_RETROFIT.md`, `01_HOME_AND_HUBS.md` and `docs/worlds/paradise-hub/`, `docs/emergent/E9_WORLD_LAWS.md`, `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md` (standing UI gates).

### 15.1 The between (MB)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MB1 | **A place between lives** | One screen-space where the run summary (RS8), death options (ND1), prestige (RP1) and atlas (RB3) sit together. Its face follows the cosmology: a hub, a god's office, a library, a void, plain menus. | One coherent moment instead of five popups. |
| MB2 | **Diegetic or plain** | Diegetic when the cosmology gives a reason (Paradise hub, a patron); plain otherwise (LN4 floor). | Lore when it fits, never forced. |
| MB3 | **Time stands still there by default** | No world ticks while you are between lives, unless a shelved world's rule says otherwise (DL25). | Decisions without pressure. |
| MB4 | **Skippable** | "Surprise me" (ND2) goes straight to the next life. | Fast continuation for players who want flow. |
| MB5 | **Things to do between** | Review the hall of lives, read recovered notes, spend prestige, talk to a patron, visit an atlas entry. | The between is a reward, not a loading screen. |
| MB6 | **The between can have people** | Other souls, a clerk, a rival, a guide. Relationships here persist across lives. | A stable cast across many deaths. |

### 15.2 The self across lives (MS)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MS1 | **Who persists** | Default: the player persists; the character persists only through a carrier the world or a cheat supplies (SELF_AS_PLAYER S1). | Clear line between player and soul. |
| MS2 | **Memory load** | Many lives of memory can blur, stack or weigh on a soul where the world says so; a cleaner start is an option. | Long-lived souls feel different; a classic premise. |
| MS3 | **Identity drift** | Habits, fears and loves from past lives can leak into a new one as traits (NE8 echoes). | Continuity felt, not told. |
| MS4 | **Souls that follow you** | A companion, rival or beloved can reincarnate too, in the same or other worlds. | Cross-life relationships. |
| MS5 | **Names across lives** | The hall of lives lists each name; the soul may carry a true name some worlds can read. | Small detail with lore weight. |
| MS6 | **Player knowledge is always yours** | Nothing the player learned is taken away; the character's knowledge follows world rules (NP7). | Honest split; no memory wipe of the player. |

### 15.3 Meta progression shape (MM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MM1 | **Mostly sideways** | Prestige mostly adds options (starts, eras, routes, cheat slots) rather than raw power. | Early worlds stay meaningful after many cycles. |
| MM2 | **Some vertical, capped per world** | Carried power is clipped by each world's laws (E9, carryover part 17). | A god-level soul does not trivialize a village start unless a premise says so. |
| MM3 | **Soft growth curve** | Meta rewards grow slower than deeds (sublinear), so a long life is worth more than many short ones but not infinitely. | Idle prestige math without runaway. |
| MM4 | **Goals at every horizon** | Next life, next world, next prestige, multiverse (loop table). | Always a reason to continue. |
| MM5 | **Visible meta record** | A deeds ledger (T21) and earned options list. No overall completion meter (QN10). | Progress felt without a checklist. |
| MM6 | **Meta can be lost or bargained** | Patrons can take a cut, a cosmology can tax souls, a bargain can trade meta for a cheat. | Meta with stakes, per world. |

### 15.4 Balance across worlds (MW)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MW1 | **Different power scales** | Worlds keep their own scales (a village farmer vs a Nen user vs a Soul Reaper). No universal level number. | Worlds feel distinct (PROJECT vision). |
| MW2 | **Translation at the border** | Power crossing into a world passes through that world's laws: it works, works partly, changes form or fails (DP9, E9). | Prevents one world's power from flattening another. |
| MW3 | **Currency and goods do not convert freely** | Money stays local; goods may be valuable, worthless or illegal elsewhere. | Trade between worlds becomes play. |
| MW4 | **Difficulty per world, not per player level** | A world is as hard as its rules make it (DL17). | Players pick challenge by world. |
| MW5 | **Strong starts are allowed** | An overpowered life is a valid run (RZF4); the world reacts (DP5, QE10). | Power fantasy with consequences, not bans. |

### 15.5 Surfaces (MU)

Desktop and laptop first, per the standing UI priority; mobile deferred.

| Code | Surface | Default | Why it matters |
|---|---|---|---|
| MU1 | **Quest board and goal tree** | Board as a world panel; goals pinned at top (QV4, QG3). | Daily play surface. |
| MU2 | **Death and between screen** | One layout: summary, what stayed where (RL3), options, prestige. | The most emotional screen gets one coherent design. |
| MU3 | **Atlas** | Worlds, branches, shelved instances, drift bands (RB5). | Multiverse as a place you browse. |
| MU4 | **Hall of lives** | Timeline of lives with world, era, role, end, legacy (RX1). | Long-term memory. |
| MU5 | **Information density** | Plain summaries first, details on demand; no wall of numbers. | Readable at laptop width. |
| MU6 | **Rebuilt browser evidence** | Any of these, when built, is checked at the target desktop viewport (AGENTS.md). | Standing gate. |

### 15.6 Onboarding over time (MO)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MO1 | **One system at a time** | First life: ordinary work and a few offers. First death: a simple death screen. First run end: prestige appears. First branch: the atlas appears. | Discovery at first need (DL1). |
| MO2 | **Explain by fiction first** | A clerk, a ghost, a dream introduces the between; a short line of plain help as fallback. | Lore teaches; text backs it up. |
| MO3 | **No lost run from not knowing** | A first death never loses more than the rules said; the first death screen says what stayed. | Trust in the system early. |
| MO4 | **Advanced options earned** | Past placement, chosen era, seed sharing, run modifiers open later (EO). | Avoids choice overload at the start. |

### 15.7 Tone and content (MC)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MC1 | **Dark worlds stay dark** | Canon tone is kept (CSM, JJK, LOTM). | Faithful worlds. |
| MC2 | **Detail level settings** | A setting controls how much grim detail text shows (gore, grief scenes), not what happens. | Comfort without changing the world. |
| MC3 | **Grief scenes are optional to linger in** | ND6 linger is skippable. | Respects mood. |

### 15.8 Testing at scale (MT)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| MT1 | **Headless long-run tests** | Simulate many lives and prestige cycles from a fixed seed; check save size, determinism and that nothing dead-ends. | These systems fail only over long play. |
| MT2 | **Save growth budget** | A target size per instance and per hall entry; compression rules (RB6, QK4) tested. | Browser storage limits are real. |
| MT3 | **Migration chain tests** | Old saves move through every added field (T6 to T28) without behavior change where the slice does not apply. | Persistence rule. |

### 15.9 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL36 | Between-lives face | Per cosmology | Plain menus to fully diegetic |
| DL37 | Meta vertical power | Capped per world | None to uncapped |
| DL38 | Grim detail | Canon level | Softened to full |

| Code | Build | Save impact |
|---|---|---|
| T29 | **Between screen** combining T18 summary, T23 options and prestige. | None beyond T18, T21, T23. |
| T30 | **Hall of lives** reading run records. | Uses T18 run records. |
| T31 | **Headless long-run test harness** (MT1). | None; test only. |

---

## 16. The story across runs, final ends, story recognition and player authorship (XZ, 2026-10-14)

Weibao (2026-10-14): "more to consider? extend accordingly Save accordingly".

Proposal, not accepted. Owners already covering nearby ground, linked not repeated: `docs/LIFE_SIM_NORTH_STAR.md` "What persists across runs" (four persistence layers: world, soul, meta, player), `docs/TIME_KEEPERS_AND_VARIANTS.md` (the holder, a character above the branch atlas who persists across runs; time keepers and pruning), `docs/CHEAT_COSMOLOGY.md` (game and author layers), `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md` (A1-A7 story making, A6 thread registry, A7 counterfactual echoes), `docs/emergent/E3_LIVING_PEOPLE.md` (NPC goals, generations), `docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md` SG5 (player-authored starts), `docs/CHEAT_LIBRARY.md` US1 (new game+ door after a first life).

### 16.1 A story that only moves across runs (XA)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| XA1 | **Meta plot beats tied to run events** | The holder or patron (TIME_KEEPERS) reacts to deaths, endings, branches and prestige, so a cross-run story advances only by living lives. | Hades-style: dying moves a story forward. |
| XA2 | **The question of why you return** | Why this soul keeps coming back is a sealed secret with discovery routes across worlds; reports name it by ID. | A long mystery that spans the whole save. |
| XA3 | **Pruning threatens the atlas** | Time keepers can prune branch worlds you made (RB3), turning branch upkeep into a stake. Per cosmology; off where it does not fit. | Branches become things to protect. |
| XA4 | **Cross-run NPCs remember differently** | Beings in high layers remember past runs (COSMIC_EVENTS "whether gods remember"); ordinary people do not. | Recognition has a cosmology. |
| XA5 | **Quest choices echo upward** | Repeated patterns across lives (always merciful, always the thief) are noticed by the holder and shape later offers or titles. | Character of the soul built by play. |

### 16.2 Story recognition (XS)

The game notices stories that happened on their own and names them, so emergent play becomes legible.

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| XS1 | **Pattern detectors** | Recognize rivalry (repeated clashes), debt of life (saved twice), feud across generations, betrayal, rise from nothing, fall from grace, revenge completed. | Turns raw events into arcs. |
| XS2 | **Named arcs** | A recognized arc gets a title in the chronicle ("The Miller's Feud") and the thread registry (A6). | Players remember named stories. |
| XS3 | **Arcs become offers** | A recognized rivalry can produce a duel challenge; a debt of life can produce a favor call (QT). | Emergent stories feed the quest generator. |
| XS4 | **Arcs become titles and legends** | A finished arc can grant a title (`src/titles.js`) and a legend that spreads with distortion (RX2, NF6). | Rewards play that was never a quest. |
| XS5 | **Arcs across lives** | A feud that outlives you continues with your heir or your next life's family (NF4). | Cross-life drama without scripting. |
| XS6 | **Arc pages at run end** | The run summary (RS8) lists the arcs this life took part in. | Better closure than a stat list. |
| XS7 | **Restraint** | Only a few arcs named per life; minor patterns stay unnamed. | Named stories stay special. |

### 16.3 Final ends and new game plus (XF)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| XF1 | **Soul death** | Some worlds can destroy a soul. Default: a soul-death ends the soul's carry but not the save; the player continues as a new soul with player knowledge and meta options kept. | Real stakes without deleting the player's history. |
| XF2 | **Hardcore save** | Opt-in: soul death or a set condition ends the whole save. Export still works (LN2). | For players who want it, never the default. |
| XF3 | **A true ending** | The cross-run story (XA) can end: leave the cycle, take the holder's seat, break the system (QE4 Escapee). | The whole save can have an ending. |
| XF4 | **After the true ending** | Epilogue, then continue: the cycle gone or changed, the atlas still there, new options (NG+ door, US1). | Endings without walls (QE6). |
| XF5 | **Several true endings** | Different final ends by path (Ruler of a multiverse, Founder of a new cycle, free mortal). | Matches several progression paths. |
| XF6 | **Reset everything** | A fresh save keeps nothing unless the player imports a legacy file by choice. | Clean starts stay possible. |

### 16.4 Player authorship (XP)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| XP1 | **Player notes** | Free-text notes on people, places, quests and lives, saved with the save; never read as game facts. | Players track their own theories. |
| XP2 | **Naming** | Name your horse, your sword, your guild, your branch world (RB3). Names appear in chronicle and legend. | Ownership through naming. |
| XP3 | **Custom ambitions** | Free-text goals (QG1) with player-picked steps. | Player-driven play. |
| XP4 | **Posted quests** | Your own quest postings (QP1) with your wording. | Authoring inside the fiction. |
| XP5 | **Custom starts and worlds** | Creative-mode start editor (SG5) and, later, custom world packs; labeled and separate from canon. | Long-term play value. |
| XP6 | **Sharing** | Export a branch world, a start record or a seed (RX6, RZF6) to share. Shared items never carry another player's private save data. | Replay with friends without multiplayer. |
| XP7 | **Fan premise import** | A short premise form ("what if X survived") turns into an AU overlay draft for agents to qualify. | Fits the fan-premise surveys (source deep dive playbook). |

### 16.5 Session realities (XN)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| XN1 | **Short and long sessions** | A five-minute check-in (collect, set routines, read the return summary) and a long session (turning points) both work. | Idle game honesty. |
| XN2 | **Return summary first** | Coming back opens on what happened (QI2), then the board. | Reorientation before choices. |
| XN3 | **Safe stopping** | Any moment is a safe save point; big moments ask for presence (QBM7). | Real life interrupts. |
| XN4 | **Several devices by export** | Move a save by export and import; no account required. | Matches LN2 and current save design. |

### 16.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL39 | Arc naming frequency | Few per life | Off to many |
| DL40 | Soul death | World rule, save continues | Off to hardcore save end |
| DL41 | Pruning pressure on branches | Per cosmology | Off to active |

| Code | Build | Save impact |
|---|---|---|
| T32 | **Two arc detectors** (rivalry, debt of life) over chronicle and relationship events, writing named arcs. | Additive arc list; detectors derived. |
| T33 | **Player notes** on any entity. | Additive notes map keyed by stable id, default empty. |

---

## 17. Practicalities: parties, downtime, the money of work and the paperwork of death (PZ, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as useful".

Proposal, not accepted. Owners nearby: `20_FRIENDS_AND_RELATIONSHIPS.md` (RM relationship model, RD favors, RX across worlds and lives), `docs/emergent/E3_LIVING_PEOPLE.md`, `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md` B6 (laws, crimes, bounties, courts) and B8 (careers), `SUCCESSION_BY_WORLD.md`, `docs/worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md`.

### 17.1 Parties and companions on quests (PP)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| PP1 | **Companions have opinions on quests** | A companion approves, objects or refuses a job by their values (RM axes). Refusal is a scene, not a stat check. | Party as people (S3). |
| PP2 | **Shares and pay** | Who gets what from a reward is negotiated once and remembered; unfair splits strain trust. | Money as relationship. |
| PP3 | **Roles in a party** | Scout, face, healer, muscle, planner. Roles change which quest shapes (QF) go well. | Party composition matters without class locks. |
| PP4 | **Companion death** | Permanent by default where the world says so; grief, funeral, revenge, or an in-world afterlife route (NE3) for them too. | Loss with weight. |
| PP5 | **Companions after your death** | They go on: continue your goal, scatter, join your heir, mourn, betray. Next life may meet them (NF3). | Your party outlives you. |
| PP6 | **Companions who know about your rebirths** | Rare, earned trust; can be told the truth and may or may not believe it (SUCCESSION recognition). | Strong cross-life bonds. |
| PP7 | **Party while you are away** | A party on a contract (QX6) reports back with choices at key points (QM10). | Idle-friendly party play. |

### 17.2 Downtime and ordinary days (PD)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| PD1 | **Rest days are play** | Cooking, visiting, hobbies, festivals, sleeping in. They restore and build relationships. | Life sim between quests. |
| PD2 | **Wounds and recovery time** | Injuries take time; downtime is when recovery happens, with care from others. | Natural pacing between big jobs. |
| PD3 | **Training montages** | Downtime can be spent training with a teacher; the result shows at the next challenge. | Anime and xianxia staple. |
| PD4 | **Home upkeep** | A home needs repair, rent, tending; a neglected home decays (QT11 absence). | Ties quests to home life. |
| PD5 | **Cozy worlds or stretches** | Some lives or eras can be quest-light by choice (QZ4). | Not every life is an adventure. |

### 17.3 The money of work (PM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| PM1 | **Bounty prices move** | Prices follow danger, urgency and how many adventurers are around; a monster boom floods the board and cuts pay. | Work has a market. |
| PM2 | **Fees and dues** | Guild fees, licenses, rank exams, sect contributions; unpaid dues cost rank. | Institutions have upkeep (FR4). |
| PM3 | **Expenses** | Gear repair, potions, travel, bribes; a job's net pay can be negative. | Choosing jobs is a calculation. |
| PM4 | **Information is sold** | Maps, quest tips, monster weaknesses and rumor verification are goods (FR9). | Knowledge economy. |
| PM5 | **Debt and loans** | Borrow to equip; lenders send collectors; debt outlives you if the world's law says so. | Risk with consequences across lives. |
| PM6 | **Taxes and tribute** | Lords, states, sects take a share; evasion is a crime. | Grey-area play (QZ5). |

### 17.4 The paperwork of death (PW)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| PW1 | **Wills** | Write a will that names heirs and bequests; without one, local law decides (SUCCESSION). | Planning your death is play. |
| PW2 | **Executors and disputes** | Relatives contest, executors cheat, courts decide. Next life can watch or intervene (NT2). | Aftermath drama. |
| PW3 | **Funerals** | Rites per culture and world; cost, who attends, and what is said shape your legend (NF6). | Closure with social meaning. |
| PW4 | **Stashes and dead drops** | Hide goods for a future life to find; finding them needs knowledge carry or luck (NF2). | Classic reincarnator move. |
| PW5 | **Letters to the future** | Leave letters, diaries or a sealed box to open later; others may open them first. | Cross-life messages. |
| PW6 | **Insurance, temple tithes and death benefits** | Where the world has them: a guild pays your family, a temple guarantees rites. | World-specific comfort and costs. |
| PW7 | **Missing, presumed dead** | A body never found: estate frozen, rumors you live, return possible if you were not dead. | Ambiguity as story. |
| PW8 | **Identity after rebirth** | Claiming your old property as a new person is legally impossible in most worlds; proof, bribery or a sympathetic judge may work. | Real cost to reincarnation claims. |

### 17.5 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL42 | Market pressure on bounty prices | Gentle | Fixed to volatile |
| DL43 | Debt across lives | World law | Off to inherited |

| Code | Build | Save impact |
|---|---|---|
| T34 | **Will and bequest** at death applied by `src/life_experience_host.js` heir leftovers path. | Additive will record on the life, default absent (local law applies). |
| T35 | **Stash for a future life** (PW4): a hidden container in the world instance. | Additive instance fact. |

---

## 18. Endgame play in depth: ruling, war, faith, mastery, founding, exploring (EG, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as useful?"

Proposal, not accepted. QE4 names eight endgame paths; this part says what daily play on each path looks like, how it idles, and what threatens it. Owners nearby: `docs/LIFE_SIM_NORTH_STAR.md` lines 1218-1223 (expansion and home defense as actors), `24_TITLES.md` (offices and divine marks as titles), `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md` B1 (factions over time), B6 (laws and courts). First milestone stays one realm and one prestige layer; these are later layers.

### 18.1 Ruler (EGR)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGR1 | **Holdings ladder** | Household, estate, village, town, province, realm. Each step adds a few new verbs, not a new game. | Ruling grows out of ordinary life. |
| EGR2 | **Decrees and policies** | A handful of standing choices (tax rate, law focus, levy, festival budget) with slow, visible effects. | Idle-friendly governance. |
| EGR3 | **Council and delegates** | Appoint people to run things; their competence and loyalty matter (E3 people). | Delegation as the core ruling verb. |
| EGR4 | **Unrest and legitimacy** | Subjects judge you by results and by their values; unrest produces petitions, protests, revolts. | Power has to be kept. |
| EGR5 | **Petitions as quests** | Subjects bring problems; ruling is choosing which to hear (QN triage at scale). | The quest board becomes a throne room. |
| EGR6 | **Succession of rule** | Who rules after you is its own drama (PW wills, heirs, usurpers). | Ties ruling to death systems. |
| EGR7 | **Canon offices** | In canon worlds, rule means canon offices: Ministry posts, division captaincy, clan headship, church rank, Hunter Association seats. | Ruling stays in-world. |

### 18.2 War (EGW)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGW1 | **Armies as aggregates** | Units with size, quality, morale and supply; named officers only (TIMELINES C4 level of detail). | War without micromanaging soldiers. |
| EGW2 | **Campaigns run over time** | March, siege, battle and retreat resolve on the clock with reports and key decisions (QM10 style). | War fits idle play. |
| EGW3 | **Your place in battle** | Commander, champion, healer, spy or civilian. A personal scene at the decisive moment. | Personal stakes inside mass events. |
| EGW4 | **War weariness and cost** | Wars drain people, money and goodwill; long wars change the world (QM5 region state). | War is never free. |
| EGW5 | **War comes to you** | Past a scale, others declare on you (QE10). | Power invites conflict. |
| EGW6 | **Ending wars** | Treaties, marriages, tribute, conquest, mutual exhaustion. | Many ways out. |

### 18.3 Faith (EGF)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGF1 | **Gods want things** | Where gods are real, they issue tasks (QS source), reward piety and punish breaches (24_TITLES divine marks). | Faith as a quest source with stakes. |
| EGF2 | **Rank in a church** | Acolyte to high priest; a church is an institution (FR4) with doctrine and politics. | Religious career path. |
| EGF3 | **Sainthood and apotheosis** | Where a world allows, deeds and worship can raise you toward divinity (LOTM-style ladders, original cosmologies). | A faith endgame with a ceiling break (QE5). |
| EGF4 | **Founding a faith** | Start a cult or religion; followers bring power and duties. | Founder path for faith. |
| EGF5 | **Heresy and persecution** | Unorthodox belief draws inquisitors (DP5). | Faith has social risk. |

### 18.4 Mastery (EGM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGM1 | **Masterworks** | Late craft or power goals produce named works with legends (XS4). | A crafting endgame. |
| EGM2 | **Students and schools** | Teaching spreads your method; students compete, betray or surpass you (QP5). | Mastery becomes legacy. |
| EGM3 | **Research frontier** | Discover techniques nobody has; discoveries can leak or be stolen (TECHNOLOGY doc carriers). | Knowledge endgame. |
| EGM4 | **Peak and decline** | Aging dulls the body; mastery shifts to judgment and teaching (QE9). | Honest life arc. |
| EGM5 | **Rivals at the top** | Other masters challenge, duel or collaborate. | The top is crowded. |

### 18.5 Founder, Explorer, Seeker, Escapee, Legacy (EGO)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGO1 | **Founder: institution life** | A guild, school or company has members, budget, rules and reputation; it can split, merge or be captured (QP3, B1). | An endgame that outlives you. |
| EGO2 | **Explorer: edges of the map** | Unknown regions, other planes, other worlds; first contact and mapping as deeds (QM). | Curiosity endgame. |
| EGO3 | **Seeker: sealed truths** | Long investigations across lives toward sealed secrets by ID (XA2). | Mystery endgame. |
| EGO4 | **Escapee: breaking free** | From a patron, a system, a loop or the cycle (XF3). | Freedom endgame. |
| EGO5 | **Legacy: shaping history** | Lineage and institutions bend a world's long course (NF9). | Quiet, long endgame. |
| EGO6 | **Paths combine** | A ruler can be a master; a founder can be a saint. No path excludes another unless a world's law does. | Everything possible, reasonably. |

### 18.6 Idle fit and threats (EGI)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| EGI1 | **Endgame idles through delegation** | Councils, officers, students and clergy do the daily work; you decide turning points. | Large-scale play stays light. |
| EGI2 | **Reports, not micromanagement** | A periodic report per holding, army, church or institution with a few decisions. | Readable at scale (MU5). |
| EGI3 | **Threats scale with reach** | Rivals, coups, crusades, plagues, cosmic events (COSMIC_EVENTS) target what you have built. | Endgame stays alive. |
| EGI4 | **Losing it all is a story** | Exile, deposition, schism or defeat continue the life rather than end the save. | Falls are content (QR2). |

### 18.7 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL44 | Governance depth | Few decrees | Off to detailed |
| DL45 | War frequency at scale | Per world | Rare to constant |

| Code | Build | Save impact |
|---|---|---|
| T36 | **Village holding** (EGR1-EGR2): one holding with three decrees and a periodic report. Later layer, not first milestone. | Additive holding record, default absent. |

---

## 19. The other side: villain, monster and outsider play through quests, endings and runs (OS, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as useful?"

Proposal, not accepted. Owners: `docs/ENEMY_PROTAGONISTS.md` (independent arcs, "you can be the inciting incident", rival stories intersect), `CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md` E1-E5 (enemy starts), `docs/worlds/NONHUMAN_STARTS_PLAY_2026-10-14.md` (BK body profiles: beast, monster, plant, ghost, object, place), `docs/worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md`. This part covers how parts 8 to 18 look from the other side of the board.

### 19.1 Quests from the villain side (OSV)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OSV1 | **Dark boards** | Thieves' guilds, cults, black markets and crime lords post work: theft, smuggling, intimidation, assassination (QZ5). | Grey and dark lives have goals too. |
| OSV2 | **You post the evil quests** | As a crime boss or dark lord, you post work for minions (QP1 inverted). Minion quality follows pay and fear. | Villain endgame verbs. |
| OSV3 | **Heroes come for you** | Past a notoriety threshold, boards post bounties on you and adventurers arrive in waves (QX3, QE10). | Being the dungeon boss as play. |
| OSV4 | **Canon heroes as threats** | In canon worlds, the protagonists may become your enemies if you oppose the plot (ENEMY_PROTAGONISTS). | Living opposite the protagonist. |
| OSV5 | **Redemption and corruption arcs** | Story recognition (XS) can name a fall or a redemption; both stay open. | Moral change across a life. |
| OSV6 | **Villain endings** | The villain-win ending (QBC5) as a goal: what does the world look like when you win? | Dark ends are complete worlds. |

### 19.2 Monster and nonhuman lives (OSM)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OSM1 | **You are the bounty** | As a monster (BK2), the quest board is a threat list: who is hunting you, when, how strong. | Inverts the quest system. |
| OSM2 | **Monster goals** | Feed, grow, evolve, claim territory, protect a brood; generated from body needs (BK profiles). | Quests without a board. |
| OSM3 | **Monster society quests** | A pack, hive or dungeon ecology issues its own tasks (NONHUMAN society doc). | Nonhuman worlds have institutions too. |
| OSM4 | **Dungeon core play** | As a place (BK7), adventurers are visitors; you design defenses and rewards; their quest outcomes are your income. | Classic dungeon-core genre. |
| OSM5 | **Monster death and rebirth** | Monster lives die often; rebirth as a stronger form or a different species follows world rules (NE). | Fits evolution and reincarnation tropes. |
| OSM6 | **Crossing to the human side** | Taming, alliance, disguise or peace treaties can move a monster into human quest boards. | Paths between sides. |

### 19.3 Outsiders and neutrals (OSO)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OSO1 | **Neutral brokers** | Information brokers, mercenaries and fences work for any side; both sides post to them. | A third position. |
| OSO2 | **Double agents** | Take quests from both sides; discovery is a renown and suspicion event (DP5). | High-risk play. |
| OSO3 | **Outsider transmigrators as rivals** | Another outsider pursues the opposite ending (RZW6). | Mirror rivals. |
| OSO4 | **Spirits and gods as players** | As a ghost or minor god (BK4), you issue quests to mortals through dreams and omens. | Quest giver as the main role. |

### 19.4 Across runs (OSR)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OSR1 | **Meet your old victims or heroes** | A next life in the same instance can meet those your villain life hurt (NF3, NF4). | Consequences across lives. |
| OSR2 | **Karma where the world tracks it** | Some cosmologies weigh past lives' deeds on rebirth placement (RZR1); others do not. | Moral weight as a world adjective. |
| OSR3 | **Notoriety in the hall of lives** | Villain lives are recorded like any other (RX1). | No judgment from the game, only from the world. |
| OSR4 | **Prestige for dark deeds** | Deeds count regardless of alignment (RP2); some patrons pay more for darker ones. | Every path rewarded on its own terms. |

### 19.5 Lines (OSL)

| Code | Consideration | Default | Why it matters |
|---|---|---|---|
| OSL1 | **Grim detail follows the setting** | Villain acts are described at the grim-detail setting (MC2), not more. | Comfort control without censoring choice. |
| OSL2 | **The world reacts honestly** | People judge villainy by their values; no forced redemption, no forced punishment beyond the world's means. | Grey-area stance: consequences, not moralizing. |

### 19.6 Dials and builds

| Code | Dial | Default | Range |
|---|---|---|---|
| DL46 | Hero pressure on notorious players | Per world | Off to relentless |
| DL47 | Karma on rebirth | World rule | Off to strong |

| Code | Build | Save impact |
|---|---|---|
| T37 | **Bounty-on-you list** (OSV3, OSM1) reading existing renown and suspicion. | Additive hunter list on the instance, default empty. |

---

## 20. Overlap notice and reading guide for parts 8 to 19 (2026-10-14)

Parts 8 to 19 were written fast, one request at a time. Several rows repeat ideas that older owners already hold. Until the R9 dedupe lands, treat these owners as primary where they overlap:

| Code | Part 22 rows | Older owner (primary) | Overlap |
|---|---|---|---|
| OV1 | PW4 stashes, PW5 letters, NF2 your stuff, RL5 next life options | `docs/LIFE_SIM_NORTH_STAR.md` lines 3527-3760 (plans that narrow the next-life roll, stashes, corpse runs, letters, dead-man's switches, family vault, succession politics, lineage progression) | Same ideas; part 22 adds quest and branch links only. |
| OV2 | RX1 hall of lives, RP prestige, RS3 cross-world continuation, MS self across lives | `docs/CHEAT_LIBRARY.md` player-layer cards (Heirloom Compact, Rebirth Ledger line 478, Hall of Selves line 553, World Deeds line 569) | Those cards frame the same features as cheats; part 22 frames base versions. Cheat test (refinement 3) decides per world. |
| OV3 | RL2-RL3 death keeps the world, RL8 anchors, NP2 overwrite | `docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md` (reset dials R1-R6, foreknowledge decay F1-F5) | Part 22 RL and NP rows should cite those dials rather than restate them. |
| OV4 | NF3 recognition, PP6 companions who know, MS3 echoes | `docs/SELVES_AND_ECHOES.md` (recognition by soul, face or habit) | Same mechanism. |
| OV5 | RS, RP, MB carry and retrofit | `17_CARRYOVER_AND_RETROFIT.md` (carry rules, retrofit of existing saves) | Part 17 owns what carries; part 22 does not change it. |
| OV6 | XA1 holder, XA3 pruning | `docs/TIME_KEEPERS_AND_VARIANTS.md` | Already linked in part 16. |

**Reading guide.** Parts 8 to 10: quests and generators. Part 11: book world endings (R1-verified table). Part 12: long runs, branches, prestige. Part 13: next life placement. Part 14: randomization. Part 15: between lives and meta. Part 16: story across runs and authorship. Part 17: parties, money, death paperwork. Part 18: endgame paths. Part 19: villain and monster side. Builds T6-T37 and dials DL9-DL47 are spread across parts; R2 (`docs/gm/dispatch/runs-and-endings-2026-10-14/r2/`) proposes their build order.

---

## 21. Lane findings R2 to R5, merged 2026-10-14

Lane folders: `docs/gm/dispatch/runs-and-endings-2026-10-14/r2/` (code and owner reconciliation), `r3/` (genre research, 51 rows), `r4/` (per-world death and rebirth; merged into `docs/worlds/SUCCESSION_BY_WORLD.md`), `r5/` (time placement and paradox, 31 rows). All findings are proposals except where they correct a shown code fact or cite accepted direction.

### 21.1 Rows corrected inline

QC4, RL3, RL8, RB4, NE2, NE3, NP2, NP5, T19, QBC1, QBC6, RP8 and NT10 were rewritten in place with the lane code that drove each change. Main reasons: the heir slice already carries bounded leftovers (R2 K08); choosing a start or branch premise from the menu is a player choice, not a character power (Weibao 2026-10-10); branches are saved automatically by accepted direction; canon events keep their causes, not their schedule; past selves default to ordinary background NPCs (Weibao 2026-10-14 lean); existing renewal stays and prestige is not a second layer.

### 21.2 Rules that override any part 22 row (R2 K31-K38)

| Code | Rule | Owner |
|---|---|---|
| LR1 | Absent worlds freeze and nothing ages while the browser is closed unless a world's selected policy and adapter say otherwise. Offline consequences in QT11, QI1-QI3, RS2, RS5, DL25 are per-world options, never defaults. The one current exception is the reviewed prepaid packing batch (`src/backlog_expansion_time.js`). | `docs/RULES_FROM_SCRATCH.md` lines 142-156, 168-173 (K31, K15) |
| LR2 | Canon yields when its real causes fail; no forced substitutes. | PROJECT.md lines 365-367; TIMELINES T3 (K32) |
| LR3 | Heirs are optional; leftovers persist through supported routes only. Wider world continuity after death is an implementation gap, not a new reset policy. | RULES_FROM_SCRATCH lines 38-60; USER_VISION lines 133-139 (K33) |
| LR4 | Player memory and codex are not another character's knowledge or power. | RULES_FROM_SCRATCH lines 63-71, 181-188 (K34) |
| LR5 | Travel, local renewal and next-life prestige are distinct; one prestige layer in the first milestone; choose reset terms before payouts. | PROJECT.md 228, 303-309 (K35) |
| LR6 | No universal "once": the same receipt pays once, new real occurrences pay by the world's repeat adjective. | `docs/ABUSE_AND_LIMITS.md` 32-40 (K36) |
| LR7 | A label is not a fork; resumable history needs owned state. | TIMELINES (K37) |
| LR8 | Atlas, merges, multi-world shelves and multi-body play are later; they never gate a local offer or the first prestige. | PROJECT.md 303-309 (K38) |

### 21.3 Build order (R2)

Topological order: **T10, T6, T7, T8, T9, T12, T14, T11, T13, T15, T17, T16, T18, T21, T19, T20**. Three branches:

- **Local quests:** T10 completability check, then T6 emitter plus T7 offers as the first playable taste (one local shortage or threat, one offer with a cause line, one real consequence), then T8 one Ambition, T12 board sorting. T9 adds a new verb only with a template that uses it.
- **Closure:** T15 ending metadata, T16 one local arc ending, T18 run summary, T21 deeds ledger (payout waits for the reset contract).
- **Instances, later:** T19 provenance, T20 single-realm suspend and resume.

Exact save shapes, migrations and milestone fit (M or L) per build: R2 REPORT K400-K415. Not every build belongs in the first milestone; finish one playable slice first.

### 21.4 Open choices with recommended defaults (R2 K450-K454)

These defaults stand unless Weibao says otherwise; alternatives stay reachable.

| Code | Choice | Recommended default |
|---|---|---|
| OC1 | First run-end prestige vs existing renewal | Keep renewal as is; record deeds first; later offer one optional next-life reset with a named carrier and exact kept domains. |
| OC2 | Usual next protagonist after a real death | Fresh coherent life suggested first; heir and same-world continuation beside it. |
| OC3 | First long world's time policy | Absent worlds frozen, no closed-browser aging; funded safe routines while active; pause at irreversible beats you are part of. |
| OC4 | What closing or shelving earns | Records closure and earned deeds; no new prestige just for suspend and resume. |
| OC5 | Profile unlocks across hard reset | Run archive travels with export; a separate profile later with its own clear-profile action; player codex grants no character knowledge. |

### 21.5 R3 genre findings (selected)

R3 compared 36 sources (G01-G36) and added 15 missed considerations (G37-G51). The distinctions most worth keeping:

| Code | Consideration | Default |
|---|---|---|
| RG1 | Say separately whether history, actor and observer knowledge continue (G37). | Each continuation option lists all three. |
| RG2 | Retirement, ruin and reclaim make failure a place you can return to (Dwarf Fortress, G02). | Fits RS and NF. |
| RG3 | Safe extraction, escape and death can settle loot differently while effort still counts (G16). | Partial credit by outcome. |
| RG4 | Bounty settlement needs custody, issuer jurisdiction and declared proof terms (G27). | Extends QF6. |
| RG5 | Unaccepted offers expire; accepted ones are liabilities with their own records (G29). | Extends QN1, QR3. |
| RG6 | Revalidate a job at acceptance and settlement when target, issuer or place changes (G41). | Extends QA4. |
| RG7 | An inherited goal, a personal debt and an office duty bind different people (G42). | Extends QG7, PM5. |
| RG8 | A reversible shelf must not cash out unchanged progress or end the actor (G43). | Matches OC4. |
| RG9 | Era jumps stop at unresolved decisions or lost support (G45). | Extends QBA2. |
| RG10 | Return summaries put changed commitments and routes first, not a new offer flood (G48). | Extends QI2. |
| RG11 | Death and ending receipts keep uncertainty and sealed boundaries (G49). | Extends RS8. |
| RG12 | A kept branch needs its original content version or a migration (G51). | Extends RB6. |
| RG13 | Source mechanics (hard caps, survival drains, fixed rescue rules) are examples, not YAIRPG defaults; comfortable unfed play stays (G-C2). | Standing direction. |

### 21.6 R5 time placement findings (selected)

R5 surveyed 18 sources and proposed P40-P70. The ones that change section 13:

| Code | Consideration | Default |
|---|---|---|
| RT1 | Birth, arrival and first playable date differ; infancy never forces years of real-time waiting (P41). | Skip to first meaningful choice. |
| RT2 | Name the relation: same person, soul, counterpart or echo; never assume an alternate self exists (P42). | Explicit per start. |
| RT3 | A rewind, a body return and a new life are different continuations (P43). | Counted separately. |
| RT4 | A reset power needs interval, trigger and anchor owner (P44). | Per source. |
| RT5 | Backward reincarnation needs a cause beyond ordinary rebirth (P50). | Route or cheat. |
| RT6 | Closed loops need authored compatible choices or a branch alternative (P51). | Matches NP3. |
| RT7 | Body age, remembered duration, calendar date and campaign order are separate values (P56). | Separate fields. |
| RT8 | Later starts need a sparse frozen outcome summary with coverage, not full simulation (P57). | T22 design. |
| RT9 | Estates settle real custody and debts; a stranger never gets the old inventory (P59). | Matches PW8. |
| RT10 | Historical fork ancestry is separate from enclosing-realm parentage (P61). | Matches T19. |
| RT11 | Selection is frozen and the new life, world and estate publish together; failure leaves the old life intact (P64). | Save integrity. |
| RT12 | Source-specific repeat limits never become a universal cap (P67). | LR6. |
| RT13 | Joining a world never restarts an event it already completed (P68). | T22 rule. |

T22, T24 and T25 record shapes and engine limits (old-age-only `endedAt`, heir builds at clock zero, 4 MiB storage guard): R5 REPORT P26-P38 and P-I2, P-I6, P-I9, P-I10.

### 21.7 R4 per-world death and rebirth

Merged into `docs/worlds/SUCCESSION_BY_WORLD.md` (per-world death routes, which NE routes are native or cheat-only, era bounds, recognition, death-screen defaults). Spoiler evidence stays in `r4/SPOILERS.md`.

### 21.8 R7 numbers for deeds, prestige and bounties (merged 2026-10-14)

Source: `docs/gm/dispatch/runs-and-endings-2026-10-14/r7/` (REPORT N1-N21, `simulate.py`, TABLES, CSVs; 27 checks pass and reproduce). Proposals; the model has no combat feedback and invented time units, so gameplay balance is unverified.

| Code | Finding or default | Why it matters |
|---|---|---|
| RN1 | **Prestige from cumulative deeds:** `F(E) = 10 * ((1 + E/20)^0.65 - 1)`; pay the difference between total entitlement and what was already issued. | Identical deeds pay identically however they are split across lives; splitting gives no bonus (a per-life curve would give 20% extra). |
| RN2 | **No per-reset grants.** No currency, free boon or slot just for resetting. | A zero-deed reset cannot farm prestige. |
| RN3 | **Deed weights** 2 / 4 / 12 / 20 / 40 by outcome kind; arc credit paid 20% / 30% / 50% at milestones. | Partial lives earn (RL4) without paying the same closure twice. |
| RN4 | **Repeat modes per world:** diminishing with a 0.35 floor by default; steady and rising (+0.15 per doubling, cap 1.5) kept as world options. | Repeating still earns; no universal "once" (LR6). |
| RN5 | **Long life wins at equal time under defaults** (105 vs 76 for many short lives), but rising rewards on easy openers, a very fast ending, or modest mortality can reverse it. | No promise that longer is always better; tune deeper deeds and early checkpoints in lethal worlds. |
| RN6 | **Grinding one ending does not dominate at default length**, but an ending compressed to a third of its time does. | Calibrate fast high-value endings per world instead of capping. |
| RN7 | **Vertical carry stays small:** +20% asymptote, clipped to +10% in early worlds. | Early worlds stay meaningful numerically (MM2); real play still untested. |
| RN8 | **Sideways options cost** 10 / 25 / 50 plus an earned condition; boon draw shows 3-5, pick one, committed. | Prestige buys opportunities, not unexplained strength (MM1, RZR7). |
| RN9 | **Bounty price** from danger (x2), urgency (x1), available labor (elasticity 0.25) and issuer funds, smoothed. | A monster boom with many adventurers cuts pay (PM1). |
| RN10 | **Density presets** sparse / settled / busy / saturated gave about 22 / 220 / 1,783 / 7,193 arrivals over 900 days; show three highlights, the rest on request, notifications at least five session-minutes apart. | Supply varies by world; presentation stays calm (QV4, QN11). |
| RN11 | **Persistence:** a future versioned ledger starts empty on old saves, never infers past currency from titles, issues atomically and keeps receipt identity through export, import and forks. | Save integrity (LR6, T21). |

---

## 22. Micro details for quests, death, next lives, endings and the between (MD, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as useful? Subtle micro stuff too?"

Proposal, not accepted. General micro moments live in `36_MICRO_MOMENTS_AND_SMALL_SIGNALS.md` (MC1-MC48, written the same day by another session); this part only adds touches specific to parts 8 to 21 and uses part 36's rules: one line or one small visual change, true in state, a cooldown that is a world adjective, no sealed or hidden truth, and part 36's signal registry (MC47) as the carrier.

### 22.1 Boards and offers (MDQ)

| Code | Micro detail | Why it matters |
|---|---|---|
| MDQ1 | **Notices age.** Fresh paper, then yellowed, curled, rained on; the oldest get a second pin. | Urgency and neglect shown without a timer (QN1). |
| MDQ2 | **Taken jobs are crossed out** with the taker's name or mark; a failed taker's name gets a second line. | Rivals felt (QO1); failure visible (QR2). |
| MDQ3 | **Handwriting tells the issuer.** Neat clerk script, a child's scrawl, a noble's seal, misspellings. | Issuer as a person (QX2). |
| MDQ4 | **The reward was amended.** A crossed-out number raised after nobody took it. | Bounty market shown (PM1, RN9). |
| MDQ5 | **The issuer waits nearby.** The farmer lingers by the board on market days. | A face for the job. |
| MDQ6 | **Missing posters update.** "Missing" becomes "Found, thank you" or quietly disappears. | Undone work resolves (QN2). |
| MDQ7 | **A job you already did.** A notice for wolves you killed last week: bring proof and get paid late. | Rewards proactive play; proof matters (QF6). |
| MDQ8 | **Your own posting looks like you.** Your handwriting, your seal, your spelling. | Authorship felt (QP1, XP4). |
| MDQ9 | **Thank-you notes arrive.** Weeks later, a letter or a small gift from a client. | Small payoff after the quest (MC45). |
| MDQ10 | **Repeat clients.** A client who liked your work asks for you by name and pays a little more. | Reputation at small scale. |
| MDQ11 | **Rumors change as they travel.** The same rumor, three towns apart, with a different monster size. | Rumor truth as texture (RZQ6). |

### 22.2 Death and what it leaves (MDD)

| Code | Micro detail | Why it matters |
|---|---|---|
| MDD1 | **The last line stays.** The final log line before death is kept and shown on the run summary. | A quiet, exact ending. |
| MDD2 | **Things where you left them.** Your cup on the table, your book open at a page, seen by whoever comes next. | Absence felt through objects. |
| MDD3 | **The pet waits.** A dog by the door, a cat on your bed, until someone takes them in. | Grief without a speech. |
| MDD4 | **Mail still comes.** Letters addressed to you arrive after you die; the next reader decides what to do. | The world has not caught up. |
| MDD5 | **A line through your name.** The guild roster, the class register, the duty list. | Institutions record death simply. |
| MDD6 | **The funeral notice goes on the board.** Same board as the quests. | Death as part of ordinary town life. |
| MDD7 | **A creditor at the funeral.** Debt follows you to the grave (PM5). | Grim, true, small. |
| MDD8 | **Your phrase lives on.** An apprentice or friend repeats something you used to say. | Legacy at the scale of one sentence. |
| MDD9 | **Flowers wither or stay fresh** on the grave depending on whether someone tends it. | Who still cares, shown without a meter. |
| MDD10 | **The epitaph is chosen by whoever loved you most,** or by the town clerk if nobody did. | Relationships decide your last words. |

### 22.3 Next life texture (MDN)

| Code | Micro detail | Why it matters |
|---|---|---|
| MDN1 | **Déjà vu on a street,** only where a memory carrier or echo applies (NE8, LR4). | Continuity felt, never free knowledge. |
| MDN2 | **A smell or song** from the past life, described without naming it. | Memory as sense. |
| MDN3 | **Animals react.** A dog that knew you is wary or friendly, in worlds where animals sense souls. | Recognition at the lowest rung of the ladder (W42). |
| MDN4 | **Your old handwriting** on a sign, ledger or letter, seen by the new life. | Meeting yourself without a scene (NP5 lean). |
| MDN5 | **Children play your legend,** wrong in the details. | Legend drift made visible (NF6). |
| MDN6 | **A misquoted plaque** on your statue or workshop. | History is not exact. |
| MDN7 | **Your things at auction,** priced as relics or junk. | Value of a past life, in coins. |
| MDN8 | **A familiar face aged.** Someone you knew, now old, in an ordinary background role. | Time passing through people (NT2-NT4). |

### 22.4 After endings (MDE)

| Code | Micro detail | Why it matters |
|---|---|---|
| MDE1 | **The first ordinary day.** After a climax, the market opens and someone complains about bread prices. | Life goes on (QBA1). |
| MDE2 | **Scars on the city.** A burned wall left unrepaired, a memorial being carved. | The ending leaves marks (QM9). |
| MDE3 | **The hero buys bread.** Canon leads in the aftermath doing ordinary things, as background people. | Living beside canon after canon (QBM4). |
| MDE4 | **Anniversary of the ending** as a festival or a day of mourning (MC46). | The ending enters the calendar. |
| MDE5 | **Textbooks get it wrong,** a generation later. | History drifts (NF6). |

### 22.5 The between and runs (MDB)

| Code | Micro detail | Why it matters |
|---|---|---|
| MDB1 | **A small token per life** on a shelf in the between: a button, a ribbon, a coin. | The hall of lives as objects (RX1). |
| MDB2 | **The clerk remembers.** A line that counts your returns or comments on your last life, in the clerk's voice. | A between cast with memory (MB6). |
| MDB3 | **The room changes a little** each run: a new chair, a crack, more tokens. | Progress felt in place, not numbers. |
| MDB4 | **A calm death screen.** No flashing "you died"; plain type, the last line, then options. | Respect for an emotional moment (MU2). |
| MDB5 | **A gentle first death.** Longer, kinder text the first time; short after (MC34). | Onboarding (MO3). |
| MDB6 | **Branch subtitles.** The atlas shows each branch with its biggest-change name in small text. | Branches as places (RB3). |
| MDB7 | **Same day, different weather** in a branch you revisit. | Branches differ in small ways too. |
| MDB8 | **A familiar person with a different job** in another branch. | Counterparts without a meeting scene (NP4, NP5). |

### 22.6 Cheapest slice

| Code | Build | Save impact |
|---|---|---|
| T38 | **MDQ1, MDQ2, MDD1 and MDB4** on the existing quest display and chronicle ending dialog, carried by part 36's signal registry. | MDQ1 and MDQ2 derive from offer state (T7); MDD1 stores one string on the run summary (T18). |

---

## 23. Implementation implications across parts 8 to 22 (II, 2026-10-14)

Weibao (2026-10-14): "more to consider? other stuff and more? save and extend accordingly Send out codex as useful? Subtle stuff too? Implementation implications and more?"

Proposal, not accepted. R2 (K400-K415) gives per-build save contracts; this part covers what cuts across builds. Facts marked **shown** were source-read today; the rest is inference.

### 23.1 Shared primitives, built once (IP)

| Code | Primitive | Implication | Why it matters |
|---|---|---|---|
| IP1 | **Receipt and outcome records** | Offers, posted jobs, endings, deeds, settlements and run segments all point to one outcome or evidence record (R2 K17 shared block). Build that block first, not per feature. | Five features otherwise invent five incompatible histories. |
| IP2 | **Thread registry** | Quests, rumors, legends, arcs and chronicle lines share a thread id (PROCEDURAL_STORY A6). Story recognition (XS) and micro callbacks (MDQ9, MC4) read it. | Callbacks and arcs need something stable to point at. |
| IP3 | **Signal registry** | Part 36 MC47 carries all micro lines (section 22): id, condition, variants, cooldown adjective, priority. | One place to tune noise. |
| IP4 | **Named seeded streams** | Quest, next-life, prestige-boon and instance streams are named streams from procgen lane P1 (E1), never `Math.random`. | Reload never rerolls (RZ baseline). |
| IP5 | **Clock policy object** | Every offer, shelf, absence and era jump names its clock policy (LR1, OC3). Default policy: frozen when absent. | Prevents silent offline growth or loss. |
| IP6 | **Actor knowledge filter** | Every UI string about a fact passes through what this actor knows (WORLD_SECRETS line 196). Quest twists, rumor truth, branch drift and ending comparisons all use it. | Spoilers leak through labels, tooltips and sort orders, not only text. |

### 23.2 Save and storage (IS)

| Code | Consideration | Implication | Why it matters |
|---|---|---|---|
| IS1 | **4 MiB shared-origin budget** (shown, `src/save_files.js:194-207`) | Branches, shelved instances, hall of lives and outcome history must be budgeted against it; compaction rules (RB6, QK4) are required, not optional. | The save refuses to write past the budget today. |
| IS2 | **Exact resume vs summary** | Each archived instance is labeled exact-resumable or history-only before compaction (R3 G40, R5 P63). | A summary cannot be resumed honestly. |
| IS3 | **Forward-only writers, backward readers** | New blocks are versioned; old writers must not silently drop unknown fields (R2 K17). | Old saves and newer saves both survive. |
| IS4 | **Atomic publication** | A new life, its world instance, estate settlement and prestige issue publish together or not at all (R5 P64, R7 RN11). | A crash mid-death must not lose the old life or double-pay. |
| IS5 | **Second tab is read-only** (shown, `src/main.js:589-593`, `navigator.locks`) | Death, prestige and branch actions must check the write lock before showing confirm buttons. | Two tabs could otherwise settle the same death twice. |
| IS6 | **Sealed truths in exports** | Exports are readable JSON. Store sealed and rolled truths as seed plus template id and derive them only at discovery, or keep them in a clearly opaque field; never as plain text. | WORLD_SECRETS: exports reveal only what the observer knows. |
| IS7 | **Import of shared branches** (XP6) | An imported branch gets new ids and keeps its ancestry and receipts; it never merges into the importer's deeds (R7 RN11). | Sharing must not mint prestige. |
| IS8 | **Content version pinning** | Each instance pins its world-pack revision; newer packs apply to new starts or by explicit migration (R3 G51, RZF7). | Content updates do not rewrite running lives. |

### 23.3 Simulation load and performance (IL)

| Code | Consideration | Implication | Why it matters |
|---|---|---|---|
| IL1 | **Level of detail** | Only the active instance ticks in detail; shelved ones are frozen or aggregate (TIMELINES C4). | Many branches cannot all tick. |
| IL2 | **Lazy resolution** | Distant events resolve when reached or observed (TIMELINES C3); offers are generated on due checks, not every tick. | Keeps idle ticking cheap. |
| IL3 | **Bounded logs** | Chronicle log is capped at 40 entries (shown, R2 K06); compact terminal outcomes survive while prose compacts. | History must outlive the display log. |
| IL4 | **Offer counts** | Saturated worlds produced about 7,200 arrivals over 900 days in R7's model; expired offers must compress to log lines. | Save and UI stay small in busy worlds. |

### 23.4 Content authoring (IA)

| Code | Consideration | Implication | Why it matters |
|---|---|---|---|
| IA1 | **Templates are data** | Quest templates, death-screen option sets, era tables and ending metadata live in world-pack data with validators, not code branches (QA1, T15). | Fifteen worlds cannot each be hand-coded. |
| IA2 | **Text grammar** | Templates need names, pronouns (they/them by default for unknowns), plurals, articles and per-world vocabulary (MC32). | Generated lines read like writing, not mail merge. |
| IA3 | **Validators in tests** | Each template is checked for reachable targets (T10), sealed-text leaks and missing variants in unit tests. | Broken content caught before play. |
| IA4 | **Per-world adjectives table** | Repeat payout, density, danger, clock, karma and soul-death rules are one table per world (DL dials). | One place to read a world's feel. |
| IA5 | **Canon facts with sources** | World-pack facts carry source ids and observation dates (QBV2). | Attribution rule and later frontier updates. |

### 23.5 Testing and verification (IT)

| Code | Consideration | Implication | Why it matters |
|---|---|---|---|
| IT1 | **Deterministic fixtures** | Same seed, same week of offers and same next-life draw in tests (QA5). | Generators testable at all. |
| IT2 | **Headless long runs** | Many lives and prestige cycles from a seed check save size, no dead ends and no double settlement (MT1). | These bugs only show over long play. |
| IT3 | **Migration chain** | Every new block tested from each older save shape (MT3). | Persistence rule (AGENTS.md). |
| IT4 | **Browser proof per slice** | Rebuilt bundle, fresh origin, 1366x768 desktop, save, reload, literal import (AGENTS.md, standing UI priority). | Required before calling any slice done. |
| IT5 | **Spoiler tests** | Snapshot visible strings for a fresh actor and assert no sealed id resolves to its truth. | Sealed secrets standard. |

### 23.6 Subtle pitfalls (IX)

| Code | Pitfall | Guard |
|---|---|---|
| IX1 | **Preview consumes a draw.** Hovering a death option or prestige boon rolls the stream. | Previews read a forked copy; only commit advances (STARTS P3). |
| IX2 | **Load-time title backfill.** Load recognizes missing titles from saved counters and reapplies bonuses (`src/main.js:7784-7799`, `src/titles.js:69-77`); no deeds are issued there today. Risk only once a deeds ledger exists (corrected by R11 I04). | Deeds come only from receipts with occurrence ids; backfill never mints deeds. |
| IX3 | **Clicks award progress.** Opening a panel or preview fires a quest event (R2 K02). | Only successful-action producers emit events. |
| IX4 | **Faint vs death.** The `deaths` counter counts consciousness losses today (shown, R2 K16). | New death records use a typed end receipt, not that counter (R5 P-I9). |
| IX5 | **Old-age-only end field.** `endedAt` requires exact old-age ending (shown, `src/chronicle.js:18`). | Add a typed end receipt for other deaths. |
| IX6 | **Time zones and wall clocks.** Any wall-time read (packing batch) needs a trusted timestamp and must ignore device clock changes. | Clock cheating and travel do not corrupt saves. |
| IX7 | **Floating point drift.** Prestige curves (RN1) computed in different orders give different fractions. | Store issued totals and remainders; never recompute history on load. |
| IX8 | **Sort orders leak.** Sorting offers by hidden danger reveals it. | Sort only by what the actor knows (IP6). |
| IX9 | **Name collisions.** Generated names that match canon characters confuse canon worlds. | Name generators exclude canon cast lists per world. |
| IX10 | **Renamed branches in reports.** A player-renamed branch can carry spoiler text the player wrote; that is fine, but agent reports still use ids. | Sealed-secret reporting rule. |

### 23.7 Cheapest first

| Code | Build | Save impact |
|---|---|---|
| T39 | **Shared outcome block (IP1)** with versioned read and forward-only write, used first by T6 and T7. | One new versioned block, default empty. |
| T40 | **Spoiler snapshot test (IT5)** over current visible strings. | None; test only. |

---

## 24. Paper playthrough gaps (R6, merged 2026-10-14)

R6 walked four whole saves through parts 8 to 23 (Harry Potter short life then a later stranger then prestige; Mother of Learning long life, branch, shelf, another viewpoint; original world contracts, party, debt, probate, afterlife, new soul; three worlds through a hub to a true ending). 54 steps, 28 gap rows (H1-H28) in `docs/gm/dispatch/runs-and-endings-2026-10-14/r6/REPORT.md`. Ten ranked gaps, each with a recommended default (proposals, not first-milestone requirements):

| Code | Gap | Recommended default | Why it matters |
|---|---|---|---|
| PG1 | **Identity and transition semantics** (H1, H18-H19, H23) | One typed transition record separates control, body, soul, life, visit, instance and prestige; every kept thing names its holder or carrier. Soul death loses that carrier while save history and options remain. | Otherwise death, retirement, afterlife and travel reset the wrong thing. Matches IX4-IX5 and R5 P-I9. |
| PG2 | **Dated clocks and catch-up** (H2, H9-H10, H12, H23) | Absent worlds freeze unless their rule says otherwise; a later placement is an explicit deterministic advance with source anchors and birth dates; presence boundaries pause before decisions. | No invented offline loss, malformed adults or skipped finales (LR1, OC3). |
| PG3 | **Deed provenance** (H6, H18, H26) | One claim per real contribution or settlement; summaries, shelves, control switches and duplicate imports mint nothing; new played repeats stay eligible per world. | Partial prestige without paying for menu actions (RN1-RN2, LR6). |
| PG4 | **Branch identity and resumable state** (H8, H11, H28) | Label a divergent instance in place; deliberate forks create children from real snapshots; keep lossless resumable state with pinned versions. | Protects old worlds and the clean template (LR7, IS2, IS8). |
| PG5 | **A true ending that survives continuation** (H24-H25, H19, H27) | Separate route credit, character knowledge and sealed truth; an explicit post-ending contract persists across death, travel, reload and import. Final story content is Weibao's acceptance gate. | Makes a whole-save ending more than a label (XF3-XF5). |
| PG6 | **Ownership, contracts and probate** (H5, H15, H17, H21) | Real funds back accepted work; shares and expenses freeze at acceptance; debt, escrow and inheritance bind real persons and property under local law; settle once; stage missing, dead and disputed estates. | Paid work, parties, wills and soul death stay coherent (PP2, PM, PW). |
| PG7 | **Knowledge, recognition and border carry** (H4, H19, H22, H24) | Keep player theory, character knowledge, world truth, local claims and powers separate; passage and real carriers decide what crosses; no universal memory loss, mastery grant, property claim or power clip. | Keeps both discovery and strong carried abilities (LR4, MW2). |
| PG8 | **Honest eligibility and committed randomness** (H3, H7, H20, H28) | Validate references, dates, means and routes, not winnability; commit draws before publication; defined handling when no candidate or content fits. Harsh worlds stay harsh by premise. | Fixes broken saves without flattening dangerous worlds (RZ, IS4). |
| PG9 | **Long play without obligation spam** (H13, H16, H21, H27) | Budgeted routines stop at meaningful new choices; untaken optional work has no artificial penalty; quiet causal summaries; frozen absence adds no chore debt. | Decades and atlases stay usable in five-minute sessions (QN1, XN1). |
| PG10 | **Qualified eras and quiet closure** (H9, H14, H25) | Keep the source calendar, label original extensions, require real causes for later crises; beaten problems can stay beaten; retirement and ordinary aftermath stay paths. Test pace and ending satisfaction with Weibao. | Long lives and endings stay worth reaching (QE10 softened: crises need causes). |

PG1 and PG2 are the two contracts most other rows depend on; they belong before T16-T22 in R2's build order.

---

## 25. Comic world laws meet runs, deaths and endings (CR, 2026-10-14)

Weibao (2026-10-14): "Considering comic worlds and stuff and more? ..." A parallel session owns the comic palette: `docs/COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md` (CL1-CL18 comic habits as world dials, CK cheats, CI, CA, lanes K1-K6). This part only maps those dials onto parts 11 to 16 so the two stay compatible. Proposals.

| Code | Comic law (owner code) | Where it plugs in here | Default | Why it matters |
|---|---|---|---|---|
| CR1 | Revolving-door death (CL3) | A world-native return route in NE (part 13) with a rate, cost and who qualifies; not a free respawn. | Off outside comic worlds; on with cost inside. | Comic deaths stay possible without cheapening every world (PG1 transition record still applies). |
| CR2 | Status-quo pull (CL1) | A form of canon pressure (TIMELINES) that heals big changes over time unless anchored. | Weak by default; strong only in comic worlds. CL1 off with CL3 on makes returns feel earned. | Explains why comic villains come back without forcing canon elsewhere (LR2). |
| CR3 | Sliding timescale (CL2) | A clock policy (IP5, PG2): years of story, few years of age. | Per world; never silently applied to non-comic worlds. | Long comic runs without everyone aging out. |
| CR4 | Retcon (CL4) | A versioned world fact with valid-from and who remembers (CI3); a branch label (RB) when the player's history conflicts. | The player's committed past is never rewritten; a retcon creates a labeled branch or an in-world memory change. | Save integrity (LR7, IS8). |
| CR5 | Reboot and crisis (CL5) | Maps to world end plus prestige (part 12) or a branch merge (RB7) as a cosmic event, with declared carry. | Opt-in world event; carries follow RP3 and part 17 carryover. | A comic multiverse reset is a natural prestige fiction. |
| CR6 | Crossover event (CL6) | A cross-world event (QH) that posts tie-in offers on every board. | Player can opt out; no chore debt (PG9). | Big events without obligation spam. |
| CR7 | Legacy and mantle (CL7) | An office record (CI5) in succession: a next life can inherit a mantle without the previous holder's skill (LR4). | Mantle is a carrier for gear, enemies and renown, not knowledge. | A comic-native way to continue after death (NT2-NT3). |
| CR8 | Cancellation (CL14) | A soft ending type (QBK) for a world: threads close fast or hang. | Never forced on canon worlds; available in original or comic worlds. | Endings vary in shape. |
| CR9 | Elseworld or What If (CL13) | An AU overlay (QBM1) built from one changed variable. | Opt-in start. | Cheap replay of canon worlds. |
| CR10 | Rogues gallery (CL9) | Rivals and bounties on you (QO2, OSV3) that escape and return with escalation per world. | Escape rate per world. | Recurring enemies across a long life. |
| CR11 | Training time skip (CL11) | Idle catch-up shown as a montage summary (CI9, QI2). | Uses the frozen-or-declared clock policy (LR1). | Idle gaps become story beats. |
| CR12 | Cheat: continuity sense (CK8 in owner) | Shows which facts were retconned and which branch you are on (RB5 drift band). | Cheat only; base players feel déjà vu at most (MDN1). | Comic meta-awareness as a power (Deadpool, She-Hulk style). |

---

## 26. Endgame paths, refined by R8 (merged 2026-10-14)

Source: `docs/gm/dispatch/runs-and-endings-2026-10-14/r8/REPORT.md` (E01-E15 ten paths per canon-first world with native, AU and cheat limits; E20-E44 game survey; E50-E75 missed considerations; E80-E95 later slices and dials). Extends part 18. Proposals; all slices come after the first milestone.

| Code | Refinement | Default | Why it matters |
|---|---|---|---|
| EG2-1 | **An office is a rights bundle** (E50): jurisdiction, who appoints and removes, budget custody, vetoes. | A headmaster, captain and minister get different verbs. | EGR7 is not "everyone is a king". |
| EG2-2 | **Several ceilings per actor** (E51): institutional reach, competence, body capacity, scarce source access. | A canon-native rare transformation is not a cheat. | Refines QE5 and EGF3. |
| EG2-3 | **Access is not accession** (E52): appointment, election, charter, conquest and succession each have conditions. | No office by XP threshold. | Makes ruling playable. |
| EG2-4 | **Delegates get a mandate** (E53): task, spending limit, forbidden acts, stop condition; they can refuse or ask for means. | No free labor. | EGI1 with real people. |
| EG2-5 | **Reports have a source and an age** (E54): accounts, witnessed results, rumor and excuses kept apart, with known gaps. | No omniscient reports. | EGI2 without spoilers. |
| EG2-6 | **Attention grows slower than holdings** (E55): one digest, exceptions promoted, a few decisions per pass. | Player sets interrupt policy (Stellaris-style message controls, E44d). | Stops bounty overload at kingdom scale. |
| EG2-7 | **A champion and an army have different reach** (E58). | Logistics, healing and intelligence decide campaigns too. | Fits worlds with overwhelming individuals. |
| EG2-8 | **Wars end around an objective** (E59): claims, terms, aftermath, grievances. | No world-conquest requirement. | EGW6 gets a real finish. |
| EG2-9 | **Office, faith and divine power differ** (E61); congregations are people with needs and dissent (E62); godhood keeps upkeep (E63). | Faith fits social religions and LOTM alike. | EGF without godhood everywhere. |
| EG2-10 | **Mastery is reliable use with a recipient** (E64); knowledge travels by carriers (E65); aging limits are body-specific (E66). | A masterwork solves someone's problem. | EGM grounded. |
| EG2-11 | **A founder succeeds when it runs without them** (E67). | One service continues through an absence. | EGO1 differs from buying a building. |
| EG2-12 | **Explorer, Seeker and Escapee finish at a chosen scope** (E68-E70): one region, one supported or refuted theory, one named binding released. | No "every region" requirement; sealed truths by ID. | Finite goals in unbounded or ongoing worlds. |
| EG2-13 | **Legacy can be non-hereditary** (E71); **Resolver is its own path** (E72): prevent, rescue, contain, rebuild. | No mandatory children; peaceful resolutions count. | Restores QE4's Resolver to section 18. |
| EG2-14 | **Combinations create obligations, not exclusions** (E73); **loss keeps what lawfully stays** (E74); **a finished holding can plateau into calm** (E75). | No punishment crises for reaching a peak. | Post-peak quiet life (QE9, PG10). |
| EG2-15 | **First later slice** (E90): one funded local office with an assignment card and a sourced report (E80), proving the shared mechanism behind ruler, church, founder and war administration; a single commission with an apprentice (E83) is the cheaper alternative. | After the first milestone only. | One mechanism, many paths. |

---

## 27. Coherence corrections, measurements and per-world micro (R9, R10, R11; merged 2026-10-14)

### 27.1 R9 dedupe result

R9 reviewed 551 rows in sections 8 to 20: **257 duplicate an older owner, 249 refine one, 26 contradict one.** Per-row dispositions: `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/DEDUPE_TABLE.md`; a compact replacement outline for sections 8 to 20: `r9/COMPACT_REPLACEMENT_OUTLINE.md`. The compaction itself is not applied yet; until it is, duplicates defer to their owner (section 20) and the corrections below override the rows they name.

### 27.2 Rows corrected by R9 (override the named row)

| Code | Row | Correction |
|---|---|---|
| CC1 | QT11, PD4 | Absence does not advance worlds by itself; decay, occupation and home damage need the selected clock policy (LR1). Frozen absence damages nothing. |
| CC2 | QR5 | An afterward explanation is knowledge-qualified: state available warnings and what is unknown; the observer can be wrong. |
| CC3 | QW5 | In Mother of Learning, looping quests and loop memory apply only to an explicitly qualified looper start, not every life there. |
| CC4 | QA3, QK3 | Authored-first never forces canon over changed causes or bans a legitimate divergent instance; prefer eligible authored content within the bound continuity. |
| CC5 | QN1 | Refusing an offer creates no debt, but accepted defaults, witnessed threats, military duties or ecological effects still happen. |
| CC6 | QE5 | Canon top tiers are observed context, not a hard cap; world-supported exceptions and outside routes stay. |
| CC7 | QE10 | Late crises need real new causes; a quiet late game is a valid path (matches PG10, EG2-14). |
| CC8 | QBF1 | Generation binds to the adapted endpoint, each endpoint dated (QBV2). |
| CC9 | RL2 | Death and reset are a selected profile per world; continuing history is one option beside explicit loops, overwrites and new runs. |
| CC10 | RB2 | The source template stays immutable, but new starts can also use persistent-history, AU or branch starts by choice. |
| CC11 | RB7 | Data dedupe and administrative collapse of equivalent branches are bookkeeping; only an in-world merge of worlds is a power. |
| CC12 | RS5, RZW5 | Returning reveals only what the actor can learn; frozen worlds have no absence-driven aging, decay or rival progress. |
| CC13 | NE4 | Resurrection cost follows the world's mechanism; gifts and exceptional free returns stay reachable. |
| CC14 | NE8 | Echoes still need a carrier; they do not substitute for missing reincarnation lore. |
| CC15 | T25 | Branching at an earlier point needs a real historical snapshot or replay with id remapping, actors, custody, RNG and content revision; parent id plus copy is not enough. |
| CC16 | RZQ6 | Rumor reliability exists already; separate a truly hidden cause from an attributed belief; never roll a contradiction to fixed canon. |
| CC17 | MS1 | Self-as-player S1 proposes a continuing embodied self with selected real outside memories; player-only persistence is a different model, both kept distinct. |
| CC18 | MW1, MW3 | Distinct scales and local money are defaults, not universal rules; declared common scales, converters and free-carry modes stay reachable. |
| CC19 | MO4 | Earned advanced options are a proposal; open-all creation and sandbox modes (EO11) and opt-in modifiers stay reachable. |
| CC20 | T32 | Named arcs are views over the one shared thread registry (A6), not a second story store. |
| CC21 | PW8 | Reclaiming old property depends on local law and proof; "impossible in most worlds" is withdrawn. |
| CC22 | OSM1 | A monster learns hunters through channels; no automatic complete threat list. |
| CC23 | OSM4 | Dungeon-core income needs willing visitors, a source-defined harvest or funded settlement; not every core is antagonistic. |

(R9 counts 26 flags; three repeat across paired rows above.)

### 27.3 R11 measurements and corrections

Script and output: `r11/measure.mjs`, `r11/OUTPUT.json`. Sizes are UTF-16 bytes against the 4 MiB origin budget.

| Code | Finding | Implication |
|---|---|---|
| CM1 | A fresh save serializes to about 109 KB (2.6% of budget); export about 73 KB. | Room exists, but backups and other keys share the origin (I01, I62). |
| CM2 | One offer's metadata is about 1.3 KB; 1,000 uncompacted offers use **86.7%** of the budget; receipt-preserving compaction brings that to **23.3%**. | Compaction of terminal unaccepted offers is mandatory, keeping dedupe tuples and causal outcomes (I35). |
| CM3 | A 100-life hall of headers is about 526 KB. | A hall is history, not 100 resumable lives (IS2). |
| CM4 | A small branch delta saves little once fork headers count; a portable delta plus its bundled anchor can exceed one full copy. | Diffs help only with a shared local base (RB6). |
| CM5 | Exports are prefixed base64 of full JSON with no actor-knowledge projection (`src/main.js:4985-5247`); the chronicle even stores undiscovered actor profile data (`src/chronicle.js:79-82`). | IS6 policy: neutral generator ids plus seed plus pinned revision for new secrets; opaque payloads for legacy committed truth; this is not cryptographic secrecy. |
| CM6 | The tab lock is per key and origin; it cannot stop reimporting an older export or play on another device. | Command guards on every settlement write, plus receipt scopes for imports (I02, I40-I44). |
| CM7 | New pitfalls: fresh-reset builders and explicit serializers drop newly earned history (rank 1); the heir marker lacks predecessor identity and shares the live and dev namespace (2); full backups break an archive budget (3); host validators admit one fixed pocket, so a branch schema alone is not enough (4); era changes must reconcile every deadline, person and job owner together (5); `Date.now` stays untrusted against forward clock changes (I65); scenario rewind keeps global RNG and is not a branch engine (I66). | Each needs a guard before T18-T21. |

### 27.4 R10 per-world micro texture

`r10/REPORT.md`: 94 world-native details across 15 worlds (how work is posted, how death is recorded and mourned, how a return might be signaled where allowed, the first ordinary day after an arc), cited, spoilers in `r10/SPOILERS.md`. Ten cross-world additions (M201-M210), for example "Received; awaiting your answer" until real acceptance, "Awaiting reissue by the successor" when an issuer dies, a memorial that says it holds no remains, a dated correction appended to an earlier death report, a witness column left blank. Cheapest first (read-only, no save change): M301 one native work-channel line on an existing quest, M302 an acceptance cue, M303 a time-domain qualifier on a timestamp.

---

## 28. Wave fold summary: runs-and-endings R1-R11 (2026-10-14)

The `docs/gm/dispatch/runs-and-endings-2026-10-14/` wave is **folded**. Every lane return is merged above; this table is the one-place summary. All rows remain proposals.

| Code | Lane | Adds | Duplicates | Contradictions fixed | Top pick |
|---|---|---|---|---|---|
| WF1 | R1 source check | Verified ending types, spans, eras and proposed pace for 15 worlds; QBV1-QBV6 (part 11) | None | TTKS is five ongoing captures and B3 holds several worlds; JJK and HP sequel status | QBV2: four dated frontier endpoints |
| WF2 | R2 code reconciliation | Build order T10, T6, T7, T8 then closure; save contracts K400-K415; open choices OC1-OC5 (part 21) | Heir, renewal, reset and pacing seams already in code | 13 rows rewritten in place; override rules LR1-LR8 | LR1 frozen absence plus T10 to T7 first slice |
| WF3 | R3 genre research | 51 comparisons; RG1-RG13 (21.5) | Many with LIFE_SIM persistence layers | Menu choice is not a time power (RL8, RB4) | RG5: offers expire, accepted jobs are liabilities |
| WF4 | R4 death routes | Per-world NE routes, recognition ladder, era bounds, death-screen defaults (in SUCCESSION_BY_WORLD) | Existing succession rows | LOTM resurrection absolute; HP infant rebirth and portraits | W42 recognition ladder |
| WF5 | R5 time placement | 31 rows P40-P70; RT1-RT13 (21.6) | TIMELINES branch rules | MoL overwrite scope; past selves as background NPCs (Weibao lean) | RT11: frozen selection, atomic publication |
| WF6 | R6 paper playthroughs | Ten ranked gaps PG1-PG10 (part 24) | None | Late crises need causes | PG1 typed transition record, PG2 dated clocks |
| WF7 | R7 reward math | Cumulative sublinear prestige curve, weights, repeat modes, bounty pricing; RN1-RN11 (21.8) | None | No per-reset grants | RN1: identical deeds pay identically across lives |
| WF8 | R8 endgame per world | EG2-1 to EG2-15 (part 26) | Part 18 headings | Resolver restored; no forced peak crises | EG2-15: one funded local office slice, after the first milestone |
| WF9 | R9 dedupe | 551 rows reviewed: 257 duplicates, 249 refinements, 26 contradictions; compact outline (part 27) | 257 rows defer to their owners (part 20 plus DEDUPE_TABLE) | CC1-CC23 override table | Apply the compact outline to sections 8-20 next |
| WF10 | R10 per-world micro | 94 world-native details, M201-M210 (27.4) | Part 36 general micro | None | M301-M303 read-only signals, no save change |
| WF11 | R11 measurements | Save sizes, export and lock findings CM1-CM7 (27.3) | None | IX2 title backfill corrected | CM2: compaction is mandatory for offers |

Not committed by design: R9's `SEARCH_EVIDENCE.json` and `FINAL_SEARCH_EVIDENCE.json` (machine search hits, 1.2 MB and 3 MB). Remaining owner work: apply R9's compact outline; fold the weaponcraft duplicate rows into the primary weaponcraft palette.
