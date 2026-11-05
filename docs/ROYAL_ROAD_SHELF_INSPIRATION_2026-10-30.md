# Royal Road shelf inspiration and its UI, 2026-10-30

Proposal palette, not accepted direction (AD32). Weibao: "lots of RR stuff can be inspiring,
More to consider?", then "go ahead, consider how we can implement those as UI too?" Sibling
of [bookshelf inspiration](BOOKSHELF_INSPIRATION.md), which did the same for his TTKS,
69shuba and TWKAN shelves.

## Scope and evidence

His Royal Road follows (178) and favorites (170) were read on 2026-10-30 from his signed-in
Chrome session, as he asked: 189 distinct titles. Only titles appear here; the dated list
is kept gitignored in `research/royal-road-2026-10-10/private/follows-favorites-2026-10-30.txt`.
Being on the list does not mean a favorite story or approval of every motif. Clusters
below come from titles, his own taglines and what this session already knew. **T**
means the title was inspected only; no chapters were read in this pass.

Holdings check (live Source Library database plus Calibre): 22 held, 165 not. One
correction: the "farmer mage" he remembered is S.C. King's *[Farmer] Mage* on his favorites,
not Seth Ring's *Battle Mage Farmer*, which was downloaded in its place (both stay).

## Clusters by the mechanism they offer (T)

| Code | Cluster | Titles from his list (held in **bold**) | Mechanism worth absorbing | Owner it would feed |
|---|---|---|---|---|
| RRF1 | Cozy jobs that grow into power | [Farmer] Mage, **Heretical Fishing**, Just Add Mana (baking magic), My Demonic Farm, Lord of EXP Farming, Harvesting Skills and Cultivating | An ordinary trade levels like a combat path and changes how the world treats you | [Gathering](GATHERING_AND_RESOURCE_USES.md), [skills](SKILLS_AND_TALENTS.md) |
| RRF2 | Crafting as the main path | Blueprint for Immortality, The Dark Lord of Crafting, Legendary Shadow Blacksmith, Crafted in Chaos, MagiCraft Master, Cultivation is Creation, Rise of the Living Enchantment | Making is the climb: recipes discovered by experiment, crafted things with history | [Making rules](MAKING_RULES.md) MR1-MR36 |
| RRF3 | Testing the world's rules | Hocus, Pocus, Hypothesis; The Laws of Cultivation: Qi = MC^2; Basic Thaumaturgy for the Emotionally Incompetent; Low-Fantasy Occultist Isekai; Magic Made Simple | The lead treats magic as a science: hypothesis, test, result, new rule | AD38, [deep concepts](DEEP_CONCEPTS.md) |
| RRF4 | Death, loops and resets | Death After Death, Player 0.4, Too Stubborn to Die, Respec On Death, Loopout, Master of the Loop, DIE. RESPAWN. REPEAT., **Stubborn Skill-Grinder**, **Speedrunning the Multiverse** | What carries over a death, what resets, and how a loop is planned | [Death and reset](research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md) |
| RRF5 | Rulers, firms and settlements | The Royal System: Ruler of the Poorest Kingdom, Path to Prosperity, Build. Fight. Survive., Industrial Mage, **Industrial Strength Magic**, Blue Star Enterprises, Corpo Age | A ledger life: budgets, staff, output, policy | [Economy rules](ECONOMY_RULES.md) |
| RRF6 | Crossing between worlds | The Lone Wanderer, Department of Otherworld Rescue, The Eager Dimension Hopper, **Rift-Runner Returns Home**, New Worlds: New Me, Escaping Valhalla | Portable strength, return trips, a job whose work is crossing | [World entry rules](WORLD_ENTRY_RULES.md) WER1-WER17 |
| RRF7 | Nonhuman and place bodies | Reborn as a Demonic Tree, World Tree Apocalypse, Saga of the Soul Dungeon, A Lich's Guide to Dungeon Mastery, Butler to a Core Lord, Humans Don't Make Good Familiars, Violet: Overpowered Magic Goo | The body is a tree, a dungeon or a servant of one; the You panel changes shape | Lead-life rules, [companions](COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) |
| RRF8 | The System as an interface | A Gamer's Guide To Beating The Tutorial, The Gods' Gacha Game, Ultimate Level 1, All The Skills (deckbuilding), Runic System, System Override, Super System | The power arrives as a screen: status windows, gacha pulls, skill decks | DSG15, DSG18 |
| RRF9 | Lives beside the protagonist | Non-Player Character, Somebody Stop Her, These Reincarnators Are Sus!, The Isekai Police | A person who is not the chosen one, or polices those who are | [Lead-life guide](LEAD_LIFE_GUIDE.md), fan premises |
| RRF10 | Canon fanfiction for our canon worlds | Harry Potter and the Surprisingly Competent History of Magic, **Harry Potter: Dimensional Wizard**, Herald of the Stars (40k Rogue Trader), Naruto: The Outsider's Resolve, The Adventurous Gamer Ninja | How fans extend a canon's rules; fan rules never establish canon (bookshelf rule) | Harry Potter world audit, canon pull | <!-- slip-ok: Source qualification: fan premises do not establish primary canon (AD1). -->

## UI: how these would show on screen

Proposals that follow [DESIGN.md](../DESIGN.md) DSG1-DSG19 and the UR rules. The game
already has the bones: Fishing, Farming (fieldwork and harvesting) and animal care are
`Gathering` activities in `src/activities.js`; fishing already has background lines
("*The fish steals your bait*"). `gathering_panel.js` is a "Gathering at a glance" panel
with a season band and a weather line, and the home panels (`home_overview_panel.js`,
`home_layout_panel.js`, household and furniture) give a home somewhere to live. Each row
is a default, a dial and a reason.

| Code | Surface | Default | Dial | Reason |
|---|---|---|---|---|
| RUI1 | **A job's home is where the work happens** (DSG6) | Fishing lives at the pier or bank as a "Line" panel, farming at the plot as a "Plot" panel, baking at the hearth; each registers with `definePanel` and shows only where it can be done | A world with no such job shows nothing (UR82) | Cozy jobs read as places you go, not menu verbs |
| RUI2 | **Glance chip in the place header** (DSG7) | One line in the job's own form: `Plot · 3 rows sprouting · rain helps` or `Line · waiting · bites likelier at dusk` | The world picks words and glyph (苗 seedling, 鱼 fish) beside the English word | The idle player checks the farm without opening it |
| RUI3 | **Plot view** (DSG8) | Hairline rows, one per bed: crop, stage as a short meter, water, what speeds or harms it, with reasons in words | Grid or row layout is a layout setting | Dense and readable, not cards in cards (DSG1); every coloured fact has a word (DSG3) |
| RUI4 | **Line view for fishing** | Bait, spot, the odds that matter (time, weather, skill) as reasons, and the last few bites; the existing background lines go to Reports at low priority, folded | Flavour lines can be turned down; the useful part (a catch, a lost bait) always shows | Heretical Fishing makes waiting itself the craft; RPT rules keep Reports honest | <!-- slip-ok: Proposed fishing feedback default; flavour may vary while the actual catch/loss stays legible (UR73-UR74). -->
| RUI5 | **Catch and harvest journal** | A book of what you have caught or grown: known entries with records, unknown ones as "not yet caught here" (UR52), first catches written in the world's voice (DSG13) | Per world: a fish register, a herbal, a seed catalogue | Collection is the long goal of cozy play; empty states teach where to go |
| RUI6 | **The job feeding a path** | When a cozy job counts toward a larger path (fishing as the heretic's way, farming as [Farmer] Mage's class), the job view shows one line: "Feeds: your water path, step 2" linking to the progress owner (DSG11) | The path's form is the world's (DSG15) | RRF1's whole appeal; one home per fact |
| RUI7 | **Day plan strip** | A thin timeline of the in-game day: water at dawn, fish at dusk, bake at night; the player drags jobs into slots and the idle loop runs them | Off by default in worlds without daily routine | An idle game's best cozy loop is a routine you set, then watch |
| RUI8 | **Household flow** | Farm output into kitchen, kitchen into market, as one small flow linking the larder, recipes and prices that already exist; no new copy of any number (DSG11) | Hidden until two links exist | Production chains (modular chains palette) become visible without a spreadsheet |
| RUI9 | **Lab notebook for RRF3** | Hypothesis, test, result, rule: a player-written or auto-noted page beside the workshop, where a confirmed rule becomes a known fact | The world decides how much it reveals; sealed truths read "not yet" (DSG10) | AD38: things work by their mechanisms, and testing them is play |
| RUI10 | **Loop ledger for RRF4** | After a death or reset: what carried over, what reset, what this run learned, as one ledger page; the existing "owed ledger" gallery draft is the shape to reuse | Per world, by its reset rules | Loop stories are about planning the next run |
| RUI11 | **Status window for RRF8** (DSG18, later) | A System world gets a diegetic status window only after its basic kit works (DSG19), and keeps a plain text form | One world at a time | Weibao: the most basic UI working for each world first |
| RUI12 | **Body-shaped You panel for RRF7** | A tree shows roots, reach and seasons in place of limbs; a dungeon shows rooms and visitors; the twin-panel layout stays (DSG1) | Per body | The you-panel already varies by world; a body is the bigger case |

## More to consider

- **RRM1.** The cozy cluster is the cheapest playable proof: fishing and farming already
  run, so RUI1-RUI5 are a UI slice, not a new system. A first slice would be the plot glance
  chip plus the plot view on the frontier village, at 1920x1080.
- **RRM2.** Reports volume: fishing's background lines are flavour. Cozy play adds many
  small events, so they need folding (one "12 nibbles, 1 catch" line) before more jobs
  write to Reports.
- **RRM3.** A cozy job that grows into power changes the balance between jobs and combat.
  The default is that both are real paths, with the world's mechanisms deciding which one
  pays more where.
- **RRM4.** The day plan (RUI7) touches the idle loop's scheduler; it needs a save-compatible
  slot format before it ships.
- **RRM5.** His list is a better feed than any public chart. Re-read it monthly (same Chrome
  route, paced) and diff it against holdings; new follows are the strongest signal.
- **RRM6.** Downloads: most of these are RR-only or self-published. Route as before:
  Z-Library or Anna's for stubbed or published books, and paced RR capture of free
  chapters for the rest (RR capture rules in the acquisition tools doc).

## LATER

| Code | Task | Level | Effort | Done check |
|---|---|---|---|---|
| RRL1 | Read openers (first 10 chapters) of [Farmer] Mage, Just Add Mana, Blueprint for Immortality and Hocus, Pocus, Hypothesis; save one mechanism row each with chapter evidence | sonnet | small | four rows in this file, each with a cited chapter |
| RRL2 | Plot glance chip and plot view (RUI2, RUI3) in the frontier village | sonnet lane, UI rules | medium | rebuilt browser evidence at 1920x1080, save and reload kept |
| RRL3 | Catch journal (RUI5) for fishing | sonnet lane | medium | journal shows known and unknown entries; first catch writes a Reports line |
| RRL4 | Monthly diff of the RR list against holdings (RRM5) | haiku | small | a dated line per new follow, held or not |


## Content reconciliation B301: shelf counts, inferred motifs and real UI readers

The full original 87-line palette was reviewed. Its October30 follows/favorites/holdings are dated observations, not current personal preferences or new chapter reading. T means title-only, and clusters also used taglines/prior knowledge; none certifies the books' precise mechanics. Preserve the specific Farmer Mage versus Battle Mage Farmer identity correction and the choice to keep both. The distinct-title total189 differs from held22 plus not-held165, which totals187. Two titles/identities remain unaccounted for by those aggregate figures; this pass did not open the private list/database or guess which rows differ. Counts are retained as historical claims with that gap explicit.

RRF1–RRF10 keep useful motifs for paid ordinary jobs, making, experiments, loops, organizations, crossings, different bodies, interface powers, other lives and fan premises. A fan rule does not establish canon. RUI1–RUI12 are proposed views over actual consumers: a rain/dusk caption requires the real yield/exposure reader, a path-feed line requires actual progression, household arrows require real stock/transactions, and a tree/dungeon panel requires supported bodily means. A renamed panel or existing fishing background text does not create those mechanics. Reuse actual owner state and commands, with layout/body/task dials rather than a permanent twin-panel arrangement.

Unknown journals, recipe silhouettes and lab not-yet labels cannot disclose a hidden species, recipe, slot count or secret's existence unless known by means. UR82 remains proposed under AD32, so citing it does not adopt all per-job panel behavior. A collection first/catch reward is a local idea with its own settlement, not automatic XP from display. A dragged day plan needs actual scheduler/cost/persistence support, not merely a timeline view. Routine summaries preserve real counts/losses rather than inventing nibbles or changing randomness.

Current book-world/menu priority retires RRM1/RRL2's suggested new Frontier farming UI depth; keep the idea for an appropriate selected world. The RRL1 opening-reader list, RRM6 download routes and RRM5/RRL4 monthly account/holdings diff are later proposals, not authorization to read, acquire, refresh private accounts or schedule an automation in this reconciliation. Better source evidence, existing library coverage and actual title identity can refine future choices through their incumbent owners. No account, chapter, holdings, private source, screenshot, download, scheduler or native UI was operated by this fold.
