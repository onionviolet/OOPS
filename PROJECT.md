# YAIRPG expansion project

Status: v0.6 development foundation adopted with the expedition and save safeguards ported, 2026-10-01. Research and archived cultivation prototype retained. Build, 32 tests and generated-save browser/file migration checks pass; human gameplay acceptance remains pending. Evidence and limits are in `docs/PLAYTEST.md`.

## Intent

Build a single-player browser idle RPG on Yet Another Idle RPG, inspired by Proto23 and cultivation/progression fiction. Weibao directs the ideas and reviews the playable result; agents implement. This is a personal creative project, not a coached coding assignment.

## Agreed direction

Original user messages, interpretation boundaries and complete research-loop coverage are maintained in [User vision](docs/USER_VISION.md). Delivery milestones sequence the work; they do not narrow its permanent ambition.

- Multiple worlds and cultivation realms.
- Prestige/rebirth progression.
- Dense stats and interconnected skills with niche per-skill benefits.
- Expand existing systems as well as adding new progression systems.
- Incorporate a broad variety of worlds, with distinct mechanics, progression and interactions between worlds.
- First playable milestone: one realm and one prestige layer. This is a delivery milestone, not the limit of the game's intended scope.

Realm names, story, skill roster, reset rules, retained progress and balance are still undecided. The broad expansion direction is requested; the concrete designs below are proposals. Agents can make reversible prototype choices within the authorized direction, label them, and present playable results for review.

## Game reference direction

Accepted research direction, 2026-09-30: Weibao endorsed the initial shortlist of Theory of Magic, Orb of Creation, Siralim Ultimate, Path of Achra and Loop Hero, and requested further niche discoveries, especially games closer to Proto23. Prioritize Theory of Magic for earned magic/progression structure and Path of Achra for interacting abilities as research starting points. This accepts the comparison direction, not a commitment to copy their mechanics or replace the current milestone.

Look for character-centered browser RPGs with discovery, useful ordinary skills, equipment choices and interconnected progression. Assess depth by how unlocks change available actions and decisions. Keep broader adjacent references for specific mechanics. The initial shortlist and expanded source-checked candidates are in `docs/NICHE_GAME_REFERENCES.md`; new candidates and gameplay proposals remain unaccepted until review.

## Books and original worlds

Confirmed direction, 2026-09-30: build original worlds and reference specific books as needed or wanted. Book selection does not need to be finalized before development begins.

Use Weibao's saved Chinese and English fiction lists as discovery sources, and named favorites when he supplies them. A listed title is not automatically a confirmed favorite. For each useful reference, record the book, the relevant mechanic or world feature, the proposed adaptation and its gameplay purpose. Verify specific lore against the book or an authoritative source when it affects design; label interpretation and invention separately.

Worlds may be wholly original, inspired by selected books, or direct fan settings when explicitly wanted. Referencing a book does not by itself select a direct adaptation. Keep the shared progression framework flexible enough to support different world rules and cross-world interactions. A first discovery audit and source-backed inspiration proposal are recorded in `docs/EXPANSION_DESIGN.md`. This is not an exhaustive book audit or a confirmed favorite list.

## Expansion design proposal

### 1. Deepen the existing game

The checkout contains skill levels and milestones, gathering/training/jobs, combat stances, equipment and crafting, quests/dialogues, locations/travel, weather/time and reputation. The first source and save audit is recorded in `docs/BASELINE_AUDIT.md`; browser smoke testing does not establish full upstream-content coverage. The v0.6 foundation supports configurable race/height stat bonuses, disabled by default and unbalanced upstream. Character biography remains mostly cosmetic; no new race progression is selected.

Extend these systems through skill specializations, technique discovery, crafting mastery and material traits, enemy adaptations, faction access and branching quest rewards. Keep ordinary skills useful at later stages: farming can grow alchemical herbs, cooking can support breakthrough preparation, and environmental skills can unlock routes or resources. Each expansion should create an observable choice or interaction, not just another XP bar.

### 2. Several connected forms of progression

Proposed character tracks: body conditioning, energy cultivation, soul development and comprehension. Skill mastery can unlock techniques and specializations; equipment mastery can unlock refining, inscriptions and evolving artifacts. Faction standing can unlock mentors, research and facilities. A home or sect can develop gardens, workshops, training grounds and expedition support.

Use breakthroughs as gameplay transitions with visible requirements and preparation options. Combine training, materials, discoveries or a trial rather than requiring only a larger number. Provide alternative routes for combat, crafting and exploration builds.

Separate travel, ascension and rebirth. Travel changes place without a reset. Ascension opens a higher layer of play. Rebirth is an optional, clearly explained reset with explicitly retained knowledge, discoveries or chosen legacies. Show losses and retained progress before confirmation. Exact retention and balance need playtesting.

### 3. Worlds with different rules

These are candidate original settings, not committed names or a claim of implemented content:

| World family | Distinct play | Progress it can contribute elsewhere |
|---|---|---|
| Mortal frontier | Trades, martial schools, survival and local factions | Foundational skills, manuals and contacts |
| Cultivation realm | Energy affinities, alchemy, formations and breakthroughs | Techniques, spiritual resources and refining |
| Arcane world | Spell research, schools and enchantment | Spell patterns and alternative energy conversions |
| Beast wilderness | Ecology, taming and adaptation to habitats | Companions, biological materials and resistances |
| Industrial or technological world | Engineering, automation and crafted augmentations | Devices, production knowledge and expedition tools |
| Oceanic or sky world | Navigation, pressure or altitude, vehicles and routes | Mobility, rare resources and environmental mastery |
| Dream or spirit world | Soul trials, perception and memory | Insights, soul techniques and unusual artifacts |
| Ruined or hostile world | Scarcity, hazards and relic expeditions | Recovery expertise and lost technologies |
| Higher planes | Synthesis of paths, domain-building and difficult trials | Advanced specializations and new world interactions |

Worlds should differ in available energy, hazards, economy, factions, resources, access conditions and rewards. Use shared systems where they fit and world-specific rules where they change decisions. A technological world should not be a cultivation location with renamed enemies.

Treat worlds as both branches and tiers: some are alternative destinations at similar strength, others require a breakthrough. Keep visited worlds relevant through recipes, research, relationships and optional challenges. Avoid making every older area mandatory daily upkeep.

### 4. Cross-world interactions

Proposed combinations: grow herbs from one world in a researched garden, apply metallurgy to spiritual weapons, combine formations with engineered devices, use navigation mastery on sky routes, and bring spirit insights into spell research. Define compatibility, costs and tradeoffs rather than letting every imported ability dominate every world.

Permanent knowledge, maps, recipes, technique familiarity and faction history can form a discovery layer across journeys. Companions and a home base can connect these systems, but should follow the core loop rather than become a separate unfinished game.

### 5. Delivery and acceptance

The build baseline and first cultivation review slice were previously verified; that slice is now archived. Current delivery starts from the base adventure and introduces one ordinary expedition with two useful approaches, an observable capability or consequence, and save/reload verification. Keep one realm and one prestige layer as the first expansion scope.
Next add a second world with one distinct rule and one useful interaction with the first. This is the acceptance gate for the multi-world design: it changes decisions, gives a reason to revisit the first world, and does not break existing saves. Then add deeper mastery, factions, base development and further worlds in playable increments.

UI must explain unlock requirements, modifiers, resource uses and reset consequences. Provide filters and summaries as content grows. Preserve readable progression, offline behavior and recoverable saves. Record implemented, browser-verified and user-reviewed status separately; this document currently describes direction and proposals only.

## Repository

Foundation adopted, 2026-10-01: the shared project now uses Miktaew's pinned v0.6 development revision `25afe1a879459d85af609088a046ac4f1d3893e1` plus the ported fork work, on `codex/v06-migration`. The recoverable pre-migration checkpoint is `codex/pre-v06-checkpoint` (`62f100f9975e856517b623c9ba6c568b6d143aac`). [v0.6 migration](docs/V06_MIGRATION.md) owns the source changes, evidence and compatibility limits. Candidate work was verified in the isolated `codex/v06-foundation` worktree before the shared switch. Personal saves were untouched; no remote changes were pushed.

Fork: https://github.com/onionviolet/yet-another-idle-rpg
Upstream: https://github.com/miktaew/yet-another-idle-rpg
Keep the MIT license and upstream attribution.

Source lives in `src/`, with content in `src/data/`, character/combat models in `src/models/` and shared state components in `src/components/`. The browser loads `dist/bundle.js`. `build.js` uses esbuild. The fork now tracks package.json and package-lock.json with pinned esbuild 0.25.10. Use Node >=22.13, `npm ci`, `npm test`, then `npm run build`. Builds fingerprint JavaScript and CSS URLs to prevent stale previews.

Serve the existing game from this folder:

```sh
python3 -m http.server 8123 --bind 127.0.0.1
```

Open http://127.0.0.1:8123 and choose Play for the base adventure. Open the Field journal in Village for the new expedition. Cultivation controls and Jade Hollow are absent. Use a separate fresh origin for tests; do not use personal save exports. Use one game tab per origin and close older builds before reopening that origin. Saving requires browser Web Locks on localhost/HTTPS. A browser without Web Locks opens read-only; do not use a file:// URL.

## Next work

Accepted steering, 2026-10-01: return playable content to the existing YAIRPG foundation, remove the added cultivation slice from active gameplay, and retain reusable engine/build improvements and all research. Expand from that base toward the researched worlds, stories, events and run-defining opportunities. This retires the instruction to keep Jade Hollow playable; cultivation remains a possible later path.

Current implementation: the v0.6 YAIRPG foundation plus the first expansion runtime and a provisional Village field-journal expedition. `src/expansion_engine.js` owns versioned scoped state, immutable content definitions, preview/commit rules, reserved costs, persisted random draws, frozen pending effects, ordered simulation deadlines, bounded history and isolated scenario checkpoints. `src/expansion_persistence.js` commits extension state and real money in one existing save envelope before publishing them. `src/expedition_content.js` and `src/expedition_ui.js` exercise the rules with inspection, kit or strength routes, a saved guide condition and a later departure. Browser Web Locks permit one save writer per release; other tabs remain read-only. Native activities cannot start while an expedition occupies the player. Jade Hollow stays archived and dormant data stays preserved.

Native file checkpoint, 2026-10-01: imports validate structure/version/retirement compatibility and pass the real loader in an isolated non-running frame before storage replacement; rejected files retain current saves and show a player message. Export supports Unicode through a marked UTF-8 file format and accepts old unmarked Latin-1 files on import. Failed creation cannot emit an invalid export. Saved reputation is authoritative per region; legacy omissions reconstruct only earned rewards. First-clear unlocks require actual cleared groups, fixing unearned load-time story flags. Seventeen tests and native generated-save file roundtrip/rejection/reload checks pass; exact evidence and limits are in PLAYTEST.md. New exports require the updated fork importer; no upstream roundtrip is implied.

Compatibility: `src/save_compatibility.js` moves retired prototype fields and references into versioned `retired_content` entries when loading a prototype save. A character in Jade Hollow returns to Village and its activity pauses; resources, trial/legacy, region/recipe records and removed inventory/storage items stay dormant in the saved payload. Ordinary character progress remains active. This is preservation for future recovery, not automatic restoration into the retired prototype or a supported upstream roundtrip. Personal saves were not read or modified.

Requested steering, 2026-10-01: extend the engine to make the audit candidates implementable. This authorizes engine work; it does not accept every research proposal or a final campaign roster. The Village route survey is a reversible original demonstration. Its names, costs, odds and timer remain proposals for review. The earlier [broken crossing rescue](docs/NEXT_EVENT_PROPOSAL.md) remains a separate unselected story option. `docs/ENGINE_EXPANSION.md` owns runtime contracts, the audit coverage map and remaining architecture; `docs/DIRECTION_SYNTHESIS.md` owns broader creative proposals; `docs/RUN_DEFINING_ADVANTAGES.md` owns the origin comparison.

Next gate: review the playable expedition for a worthwhile choice and add one authored helper or a second obstacle requiring a different capability. Add an item/XP transaction adapter and a second world only when their actual content needs them. Authored party progression, physiology/equipment compatibility, policy-driven NPC arcs, identity transfer, automated production, offline wall-time replay, global rebirth and historical rollback remain unimplemented. Isolated checkpoint and multiple actor-budget contracts are unit-tested engine features, not active ring/clone gameplay. No second world or prestige layer was added.

Requested research scope, 2026-10-01: enemy/peer tropes and young-master chains, heaven's chosen and other identities, villain-MC routes, identity/luck stealing and persistent nemesis-style rivals. [Rivals, identities and fate](docs/RIVALS_IDENTITIES_AND_FATE.md) records the current-source audit, bounded source evidence, broad catalogue and original future implementation proposals. This accepts the research scope, not a particular roster, theft rule or runtime implementation. An ordinary recurring-rival dispute is one candidate for the next event; the event itself remains unselected.

Requested enemy-protagonist follow-up, 2026-10-01: [Enemy protagonists](docs/ENEMY_PROTAGONISTS.md) compares five books and proposes independent NPC arcs, altered foreknowledge, companion agency, contested opportunities and duties inherited with stolen roles. Its eight arc patterns and three scenarios remain future research candidates; no actor roster, plot, autonomous simulation or new power is selected.

Requested concurrency feasibility discussion, 2026-10-01: the [concurrent-character and rogue-clone comparison](docs/ENEMY_PROTAGONISTS.md#concurrent-characters-rogue-clones-and-alternate-modes) distinguishes independent instances, recorded journeys, bounded shared-world actors and larger population simulation. A player/copy/peer scenario is a proposed way to test shared opportunities, independent goals and save ownership. No alternate mode, AI provider, clone origin or runtime implementation is selected; broad autonomy remains an architectural extension beyond the current single-player state.

Requested genre research, 2026-10-01: [Progression fantasy tropes and subversions](docs/RESEARCH_GENRE_TROPES.md) records Reddit/Royal Road discussions, author and publisher sources, broader genre directions and original gameplay proposals. Its concrete mechanics and reference shortlist remain unaccepted; the playable milestone is unchanged.

Requested broader sweep and trope follow-up, 2026-10-01: [Genre sweep and implementation catalog](docs/RESEARCH_GENRE_SWEEP.md) adds primary-source reference cases, 26 progression families, 30 trope-to-gameplay entries, eight creature relationship models, fourteen scenario seeds and five worked scenarios. It deepens monster bonding, summons, evolution, support, institutions, survival technology and managed sites, with source fit, persistence rules and staged implementation options. These are future candidates; no new power path, plot, roster, reset rule or gameplay implementation is accepted by the research request.

Requested upstream comparison, 2026-10-01: [Upstream direction and future adaptation](docs/UPSTREAM_DIRECTION.md) separates Miktaew's hosted v0.5.5.30 releases from the newer v0.6 development source, compares shared NPC/availability/combat work with our plans, and records selective-port versus coordinated-migration options. Town access followed by magic is an explicit future sequence, without a verified delivery date. Use the development source as a comparison before expanding those engine areas; no upstream merge, migration or gameplay selection is accepted by this research request.

Verification and limits are recorded in `docs/PLAYTEST.md`. Previous prototype rules, review status and superseded planning are preserved in `docs/PROTOTYPE_HISTORY.md`. Historical save exports in `/Users/weiwei/Downloads/Games/` remain private and untouched.
