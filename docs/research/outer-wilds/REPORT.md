# Outer Wilds: knowledge as progress (2026-10-13)

**Answer first.** Borrow the evidence graph before borrowing the time loop. Outer Wilds turns a fact into a better question, a route or a test the player can now perform with existing tools. Its ship log remembers the evidence and points out unresolved leads. A filled log is not a key required to execute every solution.

For YAIRPG, the smallest useful result is a connected Notebook record: one observed clue, one rumored destination, one tested reading and one practical consequence. Keep human foreknowledge distinct from character knowledge and its actual carrier. A knowledge-only reset belongs to a world that permits it. This research does not reprioritize the canon-first worlds or create a new prestige layer.

**Status:** findings and P1 to P5 are PROPOSALS, not accepted decisions or implemented gameplay. Public Outer Wilds spoilers are allowed here. No divergent YAIRPG secret truth is disclosed.

## Sources and evidence levels

Verified (code) means a static read of community source or schema, not proprietary game-code verification. Verified (page) means a developer page, author sample or explicitly limited talk abstract. Verified (wiki) means the stated claim was present in search-returned wiki excerpts, not that a complete revision was captured. Inferred marks this lane's synthesis. No runtime play or video viewing occurred.

| Source | Evidence read | URL or pinned locator |
|---|---|---|
| S1: New Horizons ship-log guide | Full selected guide, static; community description of entries, facts, groups and layout | [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/ship-log.mdx) |
| S2: New Horizons XML schema | Full schema, static; not the proprietary vanilla parser | [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd) |
| S3: New Horizons reveal builder | Full selected builder, static; Enter, Observe and Snapshot adapters | [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/ShipLog/RevealBuilder.cs) |
| S4: New Horizons knowledge lookup | Handler and selected manager/fact patches read; save-backed fact lookup | [Source](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Handlers/ShipLogHandler.cs#L115-L119) |
| S5: OWML README and storage | README, storage docs and ModStorage.cs read; loader and JSON storage, not the ship-log XML owner | [Source](https://github.com/ow-mods/owml/blob/d58505f01d37630e71152ef0b78921b3d2c08f4f/Readme.md) |
| S6: Mobius release design description, Kelsey Rice, 2019 | Article body read; 22-minute loop, equipment, knowledge carry and changing environments | [Source](https://blog.playstation.com/archive/2019/10/08/explore-a-solar-system-that-resets-every-22-minutes-in-the-outer-wilds-out-this-month) |
| S7: Kelsey Beachum found-text breakdown | All three pages of extracted text read; no game script copied | [Source](https://static1.squarespace.com/static/54ad82b4e4b09209a614c362/t/682bc92229567841984abe38/1747700002451/beachum_foundtext_breakdown.pdf) |
| S8: Kelsey Beachum GDC 2021 talk | Indexed session abstract and author talk listing only; PDF 403, video not watched | [Source](https://www.gdcvault.com/play/1027368/Independent-Games-Summit-Sparking-Curiosity) |
| S9: Alex Beachum and Sarah Scialli interview, 2015 | Interview body read; pre-release 20-minute description is historical, not shipped 22-minute timing | [Source](https://www.gamedeveloper.com/design/road-to-the-igf-alex-beachum-s-i-outer-wilds-i-) |
| S10: Outer Wilds wiki: Computer | Search-returned excerpts only; orange asterisk and log memory mechanism; no revision ID | [Source](https://outerwilds.fandom.com/wiki/Computer) |
| S11: Outer Wilds wiki: Ash Twin Project and Quantum Moon | Search-returned excerpts only; memory transfer and imaging example; no revision IDs | [Source](https://outerwilds.fandom.com/wiki/Ash_Twin_Project) |
| S12: Outer Wilds wiki: Forbidden Archives and Subterranean Lake | Search-returned excerpts only; unburnt record and simulation bypass examples; no revision IDs | [Source](https://outerwilds.fandom.com/wiki/Forbidden_Archives) |
| S13: Alex Beachum Echoes announcement, 2021 | Article body read; trailhead, depth, new storytelling and reduced-frights option | [Source](https://blog.playstation.com/2021/07/29/more-to-explore-outer-wilds-echoes-of-the-eye-expansion-lands-september-28/) |
| S14: Mobius 1.1.8 to 1.1.10 patch notes | Changelog read; clue polish, contradiction repair and less misleading visual aid | [Source](https://www.mobiusdigitalgames.com/news/echoes-of-the-eye-is-here) |

| S15: Custom Ship Log Modes author docs | Selected API sections: SetItems, GetQuestionMark, EnterMode; vanilla visual meanings, community page level | [Source](https://outerwildsmods.com/mods/customshiplogmodes/) |

New Horizons SHA: `5611a9ce01f881d8798de5c0342f99ba3cee3e47`. OWML SHA: `d58505f01d37630e71152ef0b78921b3d2c08f4f`. Both inspected root licenses are MIT. No third-party code or assets are included in this lane.

## Ranked findings

### F1: The log is an evidence graph, not a quest dependency tree.

**verified (code).** Entries describe places or concepts; rumor facts point from a source entry to a destination through SourceID. Explore facts record direct findings. A link explains why a lead is known; it does not establish that all earlier nodes must be completed. [S1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/ship-log.mdx) [S2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd)

### F2: Knowledge replaces permanent ability upgrades, not physical constraints.

**verified (page).** The developer describes progression as limited by player knowledge while also naming oxygen, fuel, hazards and tools. Learning changes a feasible plan. Do not translate this into a universal rule that merely setting a notebook flag opens a door. [S6](https://blog.playstation.com/archive/2019/10/08/explore-a-solar-system-that-resets-every-22-minutes-in-the-outer-wilds-out-this-month)

### F3: The shipped loop is 22 minutes, with knowledge carried.

**verified (page).** The developer describes changing environments and information retained between loops. The wiki explains memories and computer data being sent backward by the Ash Twin Project. Ordinary physical changes are reset rather than banked as permanent inventory or XP gains. Tutorial and disabled-project endings are exceptions to the normal loop, not alternative prestige tiers. [S6](https://blog.playstation.com/archive/2019/10/08/explore-a-solar-system-that-resets-every-22-minutes-in-the-outer-wilds-out-this-month) [S11](https://outerwilds.fandom.com/wiki/Ash_Twin_Project)

### F4: A return hint can say something remains without naming it.

**verified (page), corroborated by wiki excerpt.** Mod-author documentation distinguishes an orange question mark for a rumored entry, a green exclamation mark for unread facts, and an orange asterisk for more to explore. The Computer wiki excerpt also confirms the asterisk. This is guidance about authored log coverage, not a promise that every prop or secret has been catalogued. The exact vanilla completeness algorithm was not inspected. [S10](https://outerwilds.fandom.com/wiki/Computer) [S15](https://outerwildsmods.com/mods/customshiplogmodes/)

### F5: Rumored, explored and still-unfinished are separate states.

**verified (code).** The schema uses RumorName until an ExploreFact on the entry is revealed. Entry-level, child-entry and fact-level IgnoreMoreToExplore controls can suppress coverage hints. A discovered lead need not expose an unseen answer or every child node. [S2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd)

### F6: Labels and summaries can deepen after further evidence.

**verified (code).** RumorNamePriority chooses among rumor titles; AltText conditions and AltPhotoCondition support later presentations. Curiosity groups and nested entries structure scale without making a larger node an XP reward. These are community extension contracts, not a reverse engineering claim about all vanilla behavior. [S1](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/docs/src/content/docs/guides/ship-log.mdx) [S2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd)

### F7: Clues work in both directions through a story.

**verified (page).** Beachum explains that nonlinear text must point toward earlier context as well as later leads. Her High Energy Lab sample pairs a previous experiment with an alternate access path. The structure allows a player to enter a thread partway through and reconstruct it. [S7](https://static1.squarespace.com/static/54ad82b4e4b09209a614c362/t/682bc92229567841984abe38/1747700002451/beachum_foundtext_breakdown.pdf)

### F8: Hidden answers are protected by placement and understanding.

**verified (page).** Beachum separates surface hooks, mid-level explanations and hidden payoffs. Mid-level material may be found accidentally; hidden material was not found accidentally in the cited playtests. Hard-to-reach answers need information or a clue that the place exists. This is a playtest observation, not a guarantee against every future shortcut. [S7](https://static1.squarespace.com/static/54ad82b4e4b09209a614c362/t/682bc92229567841984abe38/1747700002451/beachum_foundtext_breakdown.pdf)

### F9: Reveal receipts should come from actual acts.

**verified (code).** The New Horizons builder binds facts to entering a volume, observing within distance and angle, or taking a snapshot. ShipLogHandler checks saved revealOrder, including between star systems. This is evidence for separating trigger, recorded fact and presentation; no runtime behavior was tested. [S3](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Builder/ShipLog/RevealBuilder.cs) [S4](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Handlers/ShipLogHandler.cs#L115-L119)

### F10: Time is part of a route, not just its cost.

**verified (page).** The developer describes collapse and shifting sand changing access during the loop. Alex and Sarah explain why resets permit irreversible dynamic systems. A route can require returning at the right phase with the same equipment rather than buying stronger equipment. [S6](https://blog.playstation.com/archive/2019/10/08/explore-a-solar-system-that-resets-every-22-minutes-in-the-outer-wilds-out-this-month) [S9](https://www.gamedeveloper.com/design/road-to-the-igf-alex-beachum-s-i-outer-wilds-i-)

### F11: Echoes uses withheld records to teach investigation.

**verified (wiki).** The Forbidden Archives excerpt describes unburnt records and a report about leaving rafts between simulation areas. The Subterranean Lake excerpt describes dying near a campfire to bypass alarm bells. These are different applications of understanding the simulation, not permanent power upgrades. A full three-archive or all-seal audit was not performed. [S12](https://outerwilds.fandom.com/wiki/Forbidden_Archives)

### F12: Echoes adds depth through a trailhead and changed storytelling.

**verified (page).** Alex describes a new museum exhibit as the trailhead, a hidden location with greater depth than an existing location, and new storytelling and mechanics. The expansion should serve new and returning players. Reduced frights is an explicit option. These are developer design statements, not measured pacing. [S13](https://blog.playstation.com/2021/07/29/more-to-explore-outer-wilds-echoes-of-the-eye-expansion-lands-september-28/)

### F13: OWML is infrastructure; New Horizons owns the inspected ship-log authoring contract.

**verified (code).** OWML patches and loads mods. Its ModStorage writes JSON relative to a mod folder; docs warn that update preservation needs pathsToPreserve. This is not evidence that OWML itself defines rumor XML or vanilla loop carry. [S5](https://github.com/ow-mods/owml/blob/d58505f01d37630e71152ef0b78921b3d2c08f4f/Readme.md)

### F14: Clue wording and visual evidence need iteration.

**verified (page).** Official patch notes repair a Southern Observatory clue and a museum-statue contradiction, and make a visual aid less misleading. Knowledge progression still needs feedback repair after release. A confusing inference is not automatically a player failure. [S14](https://www.mobiusdigitalgames.com/news/echoes-of-the-eye-is-here)

### F15: Pair permanent recognition with world-specific certainty and carry.

**inferred.** Cultivation-idlers F1 already covers invisible unearned systems, lasting revelation and deeper labels. This lane adds connected leads and separate coverage hints. Recognition can remain while a hypothesis is disproved, a visit window closes or a new life lacks the old character's memory carrier. This synthesis is a YAIRPG proposal, not an Outer Wilds rule. [S2](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd) [S7](https://static1.squarespace.com/static/54ad82b4e4b09209a614c362/t/682bc92229567841984abe38/1747700002451/beachum_foundtext_breakdown.pdf)

## The graph and loop, in concrete terms

An entry is a place or concept. A rumor fact records a clue about it, possibly learned elsewhere. Its source edge routes curiosity. An explore fact records something learned directly. A curiosity groups entries around a major question; children represent smaller subjects. Presentation conditions alter names, text and images after relevant facts arrive. The XML is authoring data, while reveal triggers and saved fact state are separate owners. [Pinned schema](https://github.com/Outer-Wilds-New-Horizons/new-horizons/blob/5611a9ce01f881d8798de5c0342f99ba3cee3e47/NewHorizons/Schemas/shiplog_schema.xsd).

| Visible log cue | Meaning | What it does not prove |
|---|---|---|
| Question mark | A rumored entry, still represented as an unexplored lead | That the character knows its answer |
| Green exclamation mark | New facts remain unread | That the location has more undiscovered facts |
| Orange asterisk | More authored exploration remains | A complete inventory of every world secret |

These meanings are documented by the [Custom Ship Log Modes author](https://outerwildsmods.com/mods/customshiplogmodes/); the pinned schema separately supports rumor naming and suppression of unfinished-coverage hints. They are community documentation evidence, not a fresh playtest.

The normal physical loop restores the world; the player learns movement, routes, timing and rules, and the ship log preserves recorded information. In fiction, the Ash Twin Project transfers memories and data. In design, the durable gain is understanding, not accumulated equipment. The story can disable the project, so endless resetting is not a universal invariant. [Wiki excerpts: mechanism](https://outerwilds.fandom.com/wiki/Ash_Twin_Project), [ending exception](https://outerwilds.fandom.com/wiki/Endings).

For example, photographing the Quantum Moon and keeping its image observed permits landing. The Tower of Quantum Trials teaches the rule, but the useful act is maintaining observation. The route is explained by a law rather than an inventory upgrade. The claim is wiki-level; no vanilla conditional code was read. [Quantum Moon](https://outerwilds.fandom.com/wiki/Quantum_Moon).

For Echoes, the inspected developer evidence establishes a trailhead and a dense hidden location. Wiki excerpts establish recoverable unburnt records and simulation exploits taught through archive reports. **Inference:** this lets a later discovery revise the player's model of an earlier obstacle. Preserve that relation in original clues, rather than copying slide reels, symbols, prose or the whole horror structure. Exact DLC event times, all three exploit rules and seal conditions remain unread.

## Covered versus new

| Existing owner or lane | Already covered | This lane adds |
|---|---|---|
| [RESEARCH_IDLE_GAMES.md](../../RESEARCH_IDLE_GAMES.md), Outer Wilds row | Changing access; separate inference from confirmed knowledge; no mandatory loop | Rumor/explore structure, source edges and coverage suppression |
| [Far-field genres G10](../far-field-tropes-2026-10-08/PART_1_GENRES.md) | Returning at the right time; a tide instead of another prestige layer | Fact-driven return leads and graph presentation |
| [TIMELINES_AND_DIVERGENCE.md](../../TIMELINES_AND_DIVERGENCE.md) | A schedule runs without the player | Knowledge of a phase as an executable plan |
| [LIFE_SIM_NORTH_STAR.md](../../LIFE_SIM_NORTH_STAR.md) | Human knowledge as progress and knowledge-only carry | Distinct graph, action and carrier contracts |
| [Cultivation-idlers F1](../cultivation-idlers/REPORT.md) and P1 | Invisible unearned systems, lasting revelation, deeper labels, hidden counts | Keep a discovered question visible while certainty and availability change; do not repeat its proposed global law |
| [WORLD_SECRETS_AND_DISCOVERY.md](../../worlds/WORLD_SECRETS_AND_DISCOVERY.md) | Staged readings, multiple routes, useful payoff, per-life carry, sealing | Connected evidence and spoiler-safe unfinished-lead policy; no new truth catalogue |

The target search also found candidate lists and the sci-fi plan. No earlier dedicated Outer Wilds lane existed at start. Nearby loop and discovery work stays authoritative for its own scope.

## How YAIRPG compares

These paths were actually read. This is a bounded source comparison, not a claim that the entire engine lacks equivalent behavior.

| Read source | What exists | Small missing or uncertain part |
|---|---|---|
| `src/adventure_notebook.js` | Here, Practice and People views, known-route panels and attention to waiting work; workspace module integration | In this module, no general evidence-node and source-edge view; it organizes gameplay panels |
| `src/simulation_effects.js:281` and `src/simulation_contracts.js:66` | Per-actor knowledge with `seen`, `interpreted`, `understood`; clock, cause and optional basis; later or equal stage can replace a record | No general rumor-source graph in these records; stage is not confidence or truth. Equal-stage replacement does not preserve every former reading |
| `src/causal_situations.js:52` | Basis kinds: recollection, observation, instruction, inference, with actor and situation attribution | Basis is optional; graph projection must not invent an evidence source or convert inference into proof |
| `src/world_knowledge.js` | Names and continuity are disclosed only by known facts; old saves do not reveal cosmology | Reuse this boundary for lead labels, not registry names |
| `src/people_knowledge.js` | Known-person projections exclude private axes, inventory and independent activity | Good precedent for observer-scoped fact and source projections |
| `src/known_routes.js` | Only native-disclosed player routes and current quotes; no registry destination search | A rumor is not yet a travel authorization. Keep it distinct from a usable route |
| `src/native_discovery_policy.js` | Settled, known skill events generate a small deduplicated cue; presentation owns no saves | Do not store the evidence graph in its local `seen` set or treat a cue as durable discovery |
| `src/observation_ui.js` and `src/observation_channels.js` | Stored impressions differ from live sampling; remote plans require actual endpoint and observer support | A reread should change attention state only, not create new observation receipts |
| `src/world_rhythm.js` | Recurring availability derives from native calendar and per-cycle claims | Timed access can reuse this idea; it is not proof of a whole-world 22-minute reset |
| `src/heir_inheritance.js` | Written and taught lessons pass via actual leftovers; heir body and XP remain their own | A notebook graph cannot automatically give a new life the previous actor's mental knowledge |
| `src/simulation_contracts.js:190` | Transition validation permits distinct reset categories including knowledge | This read proves a contract, not a tested knowledge-only transition. Runtime reset and carrier wiring need a separate implementation audit |

The sealed-secret owner already proposes stages from unnoticed to usable and fair alternate routes. Outer Wilds adds a useful tension: a question can be recognized forever while its answer is still hidden. Cultivation's permanent revelation must not mean that every hypothesis stays true or every action stays available.

## Proposed data and first slice

Use original names. A **PROPOSAL** record could contain `entryId`, `worldId`, `observerId`, `lifeId`, `evidenceIds`, `sourceEntryIds`, `readingId`, `stage`, `recordedAt`, `carrierId`, and a native-approved presentation. Keep truth IDs, unreachable nodes and undisclosed edges out of that public projection. Graph links represent evidence relations; execution checks actual body, tool, location and time separately.

Start with **P1: Connected field notes**, then P2's return hints. Show known questions and selected evidence together in the existing desktop Notebook at 1366×768 and 1920×1080. Mobile optimization is deferred. P3's timed route and P4's revised reading are later independent slices. P5's per-world reset has the largest compatibility cost and is lowest priority. None requires adapting Outer Wilds as a playable world.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Small touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Limits and acquisition: [CHECKPOINT.md](CHECKPOINT.md). Structured evidence: [FINDINGS.json](FINDINGS.json).
