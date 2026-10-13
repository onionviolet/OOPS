# Long-term game vision: self-contained fresh-perspective packet

Snapshot: October 12, 2026, America/New_York.
Project: Yet Another Idle RPG expansion, `/Users/weiwei/code/yet-another-idle-rpg`.
Purpose: Weibao will copy this entire file into a fresh chat with no context, get a stronger overall design/review prompt, then bring that result back. This is broader than finishing the current Foundation phase.

## 1. Prompt to the fresh chat

I am Weibao, the creative director of a personal game project. Read this packet as the complete context available to you. Help me consider the overall long-term game, the important connections and missing questions, and what to do next. I want you to produce a better self-contained prompt that I can send back to a repository-owning chat for a substantial overall review and actionable planning.

Do the analysis and produce that prompt now. You are not being asked to implement, dispatch agents, acquire books, migrate the engine, unpause a campaign, or approve decisions for me. Repository access is unnecessary for this conceptual pass. Any technical status below is reported evidence, not something you personally verified.

Consider the experience as a whole: core loop, life and identity, worlds and their small details, progression, power interactions, ordinary skills, NPCs, economics, technology, time, starts/endings, discovery, idle/active play, presentation, persistence, performance, content production and long-term feasibility. Bring useful additional angles where they expose a concrete omission or improve the game. Do not reduce the task to a generic feature wishlist or another Foundation-only verification prompt.

Be candid. Preserve the ambition while proposing finite playable milestones. Neither “build everything first” nor silently narrowing the game to the already implemented mechanics is a useful answer. Avoid imposing universal balancing drawbacks, rank ladders, death rules or simulation assumptions that contradict local-world variation. Meaningful limits need a lore, usability, engineering or explicit scope reason.

Please deliver:

1. **V1: Overall synthesis.** Explain what kind of game this is trying to become and the player experiences that would distinguish it. Identify actual tensions, with alternatives and trade-offs rather than automatic prohibitions.
2. **M1: Connected coverage map.** A compact table covering the major domains and their joins, with user direction versus proposal, known evidence limits, omissions and a useful playable proof. Group small details under their meaningful parents without erasing them.
3. **D1: Strategy and choices.** Rank at most five near-term decisions or work priorities. Retain a longer-term horizon and revisable options/backburner. Identify which decisions need my preference and which are reversible implementation choices. Give concrete success gates and stop conditions.
4. **P1: Improved overall-review prompt.** A self-contained prompt for the repository-owning chat. It should recover current owners, audit the project against the long-term vision, reconcile existing material, propose connected milestones and save a useful source-backed report. It should not authorize runtime changes or new dispatches merely because a review recommends them.

End with P1 so I can copy it directly. Use plain active language, no em dashes, and short stable reference codes. Separate quoted user direction, reported facts, your inferences and your proposals. Do not invent sources, gameplay results, accepted decisions, percentages or a selected engine. Ask only questions that materially change outcome, scope or substantial effort; continue analysis under stated assumptions for the rest.

## 2. Authority and interpretation

This packet is a synthesis for transfer, not a replacement for the project's authoritative user vision. Direct quotes and the accepted rulebook reproduced later retain their wording. The other descriptions are interpretations or reported status. Unaccepted ideas remain options, not promises to implement every variant.

The project has a very large idea/research library. `docs/LIFE_SIM_NORTH_STAR.md` is explicitly headed PROPOSAL and contains accumulated user requests, examples, research and agent suggestions of different ages. Its convenient name does not make all its paragraphs accepted. Current direct user instruction and accepted project decisions outrank old agent interpretations. Some dated source-status comments have been superseded by later work.

Weibao directs and reviews playable results. Agents implement authorized ideas directly. This is not a coached coding project unless he asks to learn implementation. Preserve useful proposals as core/options/prototypes/backburner with clear status; do not make their omission from a first slice permanent rejection.

## 3. Long-term intent

The game grows from a single-player browser idle RPG fork of Yet Another Idle RPG, inspired by Proto23 and progression/cultivation fiction. It should deepen the inherited game and become a broad text-based progression/life RPG with distinct connected worlds, several progression paths and a life beyond continuous combat grinding.

The native opening, quests, skills, professions, stats, equipment and center-menu play remain usable. New fiction is opt-in, and no compulsory restart or world jump is needed merely to keep playing native content. The first milestone is one realm and one prestige layer. That is a delivery sequence, not the entire vision. Prestige/rebirth, travel, ascension, resurrection, succession and time reversal are distinct operations.

The player should be able to live independently in a world rather than always follow its protagonist. Ordinary careers, a home, friends, trade, crafting, research, exploration, dangerous pursuits and extraordinary powers can coexist. Peaceful, overwhelmingly powerful, failed, changed-goal and unusual lives are valid possibilities where supported. A whole campaign is not defined by one first loop or the player's chosen route.

Representative user direction, verbatim from the vision owner:

> anything is possible and it depends

> anything is possible should be a line and in uservision

> I mean the risk isnt with how many properties dont know, it is how the unknown protieries interact with things, like if it has a kill everyone in a 9999999 mile property if mixed with this niche something else, thats exactly what happens

> Its unlikely for me to know stuff about them unless I use a certain thing to check, just as its unlikely for them to know about me and stuff, everything needs to make sense in their respective worlds

> I mean not the world let you observe but rather the means you have on hand

> frontier probably wont be played through, and we would be starting in some rantom starting point to keep it suspenseful

> dont forget cool ideas like the VFX for stuff like abilitites and more

These do not require infinite content or simulation of every atom. They reject arbitrary exclusions, omniscient presentation, flat reskins and forgetting the small expressive details.

## 4. Major domains to connect

| Code | Domain | Direction and considerations | Joins that matter |
|---|---|---|---|
| G01 | Worlds and campaigns | Distinct rules, economies, institutions, histories and daily life. Original worlds and direct source-world adaptations are both allowed. Canon, divergence, remix and swapped-premise variants are retained possibilities. | Starts, source qualification, powers, jobs, events, departure, reentry and late-game life |
| G02 | Person, body and control | Person, life, body and controller are distinct. Species, anatomy, age, sex, gender, constitution, genetics, bloodline and aptitude must not collapse into one stat. Nonhuman, constructed, spirit, host/collective and multiple-self play are candidate modes. | Actual opening actions, tools, speech, care, fit, learned methods, social recognition and persistence |
| G03 | Beginnings and randomness | Suspenseful random entry is requested; Frontier is optional. Coherent era/location/family/role/body/means/obligations and limited knowledge. Birth, childhood, professional, veteran, elder, outsider and legacy are possibilities. | Correlated generation, chosen versus unknown axes, eligible content, distribution, rerolls, accessibility and first meaningful action |
| G04 | Progression and powers | Dense connected skills, late usefulness of humble abilities, personal techniques, incomplete methods, alternative advances, titles/traits/statuses/feats, cultivation, magic, classes, technology and other paths. | Learning versus execution, fuel, organs, mastery versus structural evolution, counters, tools and useful noncombat outcomes |
| G05 | Exceptional advantages and cheats | Run-defining treasures, systems, vessels, archives, helpers, simulators, copying/theft, adaptation, vows, conceptual powers and time abilities are idea families. One-off outliers are allowed. | Trigger/source/carrier/target, scope and local laws, combinations, other actors' real countermeans, discovery and continuity |
| G06 | Knowledge and mystery | Truth exists independently of observation. Appraisal, rumor, experiment, reading, language, concealment, memory and forecast use actual means. Hidden material properties still act. | Honest uncertainty, useful experimentation, revised beliefs, NPC information, safety feedback and sealed discoveries |
| G07 | People and institutions | Independent protagonists/rivals, allies, teachers, patrons, companions, households, relationships, romance candidates, duties, debts, consent and inherited standing. | Individual means, remembered consequences, finite commitments, teaching, inventories/custody, conflict and closure |
| G08 | Everyday life and economics | Careers, rest, food/care, homes/furnishings, farming, trade, investing/property/management activities and minigames are retained families. | Why actions remain useful after power growth, time budgets, production, relationships, supply and places with actual uses |
| G09 | Craft and technology | Separate knowledge, practice, design/recipe, workshop capacity, materials, precision, construction and operation. Tech and magic are not one universal ladder. | Tools change production, measurement changes knowledge, actual outputs have consumers, maintenance, industry, teaching and adoption |
| G10 | Time, events and histories | Local played/absence/offline policies, aging, deadlines, independent events, eras, causal divergence, branches, parallel instances and temporal powers. | Natural course versus intervention, actor motives, retained history, old selves, compatible clocks and manageable simulation |
| G11 | Loss and continuing lives | Incapacity differs from death; recovery, resurrection, inheritance, renewal, reincarnation and reset vary by world. An heir receives what was actually left behind. | Who owns surviving items/records/obligations, carriers for memory/power, people with their own lives, archive and new usable beginnings |
| G12 | Travel and cross-world play | Worlds have distinct rules and meanings; return visits, hubs, nested/mini-worlds and alternate branches are possibilities. Carry and conversion range by actual mechanism. | Body, memories, methods, fuel, stock, custody, titles, debts, allies and local applicability, without duplication |
| G13 | Scale and emergence | Micro bodily/material details, households/workshops/groups, then regions/civilizations/large power scopes. Some lives may guide a host, network or brood. | What individual decisions change at higher scale, what aggregate change does to ordinary play, bounded detail and information reach |
| G14 | Text presentation and usability | Native-style panels and center actions, biography/life record, discovery-aware notebook, meaningful text VFX/SFX, transformations and show of power. | Costs and quote/results, readable status, focus/keyboard/narrow layouts, reduced motion, actual known effects and trustworthy save controls |
| G15 | Idle and active agency | A still-open experiential design choice: choices versus automatic routines, queues/delegation, offline progress, interruptible crises and routine work. | Attention burden, pacing over minutes/years, avoiding mandatory babysitting, clear selected policies and worthwhile return sessions |
| G16 | Engine, persistence and production | Durable authoritative state, exact identities/content versions, compatibility, recovery, history, performance and future app path. A scalable authoring/review pipeline must produce playable content. | Long campaigns, branch archives, source integration, migrations, measured bottlenecks and human acceptance |

This is a coverage map, not sixteen compulsory meters or implementation packages. Broader specific forms remain candidates until selected and source-qualified. Texture can have a content/experience criterion without requiring a new simulation system.

## 5. Important design distinctions

**Power and challenge.** The accepted direction allows OP paths and rare outliers. Do not invent drawbacks or enemies that magically scale to negate success. A defeated obstacle stays defeated unless something relevant changes. Stronger rivals, institutions, different objectives, exposure, politics, exploration or another world's rules can matter when they have actual causes. Choosing ordinary life while powerful can remain meaningful.

**Sources and premises.** Book worlds should reflect their source, including subtle mechanisms and everyday details. This does not compel reenacting the protagonist's plot. A deliberate divergent/remixed premise must be distinguished from mistaken source claims. Direct adaptations are held in private packs outside git; public mechanics/original content preserve notices and attribution. Reading/source evidence is separate from capture, implementation and gameplay proof. This review must not acquire new sources or reveal world secrets.

**Causal history.** The timeline standard describes a world’s natural course when the player is absent, and consequences when intervention actually changes relevant causes. Off-script actors should keep motives and means, rather than fall into an empty world. Proposed inertia scores, event graphs, lazy resolution and aggregate simulation are implementation options, not accepted universal fate physics. The question of branch selection versus actual time travel must remain separate.

**Carriers and inheritance.** Teaching, reading a record, carrying a soul-bound memory, moving a physical organ and copying a technique are different operations. Transfer does not guarantee execution in a new body/world. Inheritance should derive from actual belongings, records, taught people, standing, debts and supported lineage faculties. It is not an automatic fresh copy of the previous character.

**Technology and social scale.** A person understanding an idea does not give a workshop the machines to build it or a city the organization to use it. Improved tools should enable actual different production, repair or precision, not merely increase a tier label. Macro diffusion and institutions remain design horizons, not proven current implementation.

**Living characters versus simulation cost.** Important nearby people may need individual state; distant populations may use coarse summaries. Aggregation cannot erase promises, custody, causes or distinctions used by later actions. A broad game does not require simulating every NPC at the same fidelity every tick. A performance cap must expose retained work or scope rather than silently lose consequences.

**Presentation and discovery.** An observer can be wrong; author truth should not leak through disabled buttons, sorting, labels or diagnostics. In-world distortion must not make real costs, save errors or accessibility controls unreliable. Text spectacle should express actual observed powers, not fake mechanical functionality. Small sensory and personal details matter alongside high-level systems.

## 6. Present implementation and its limits

The game currently uses JavaScript ES modules, browser DOM UI, esbuild/Node tests and Ink/inkjs. YAIR remains the vehicle. Godot, Rust, Bevy, desktop/mobile wrappers, typed core boundaries and replaceable platform adapters have been considered. No new engine, migration or app release is selected. Preserve an easy future app path is requested direction; a portable core is a proposal. Large source files alone do not establish poor performance.

An October 11 source review reports validated export/import, a conservative 4 MiB shared-origin storage guard, a Web Lock for one save writer, retained compatibility data and a 512-causal-boundary advance limit that returns unspent time. Expansion RNG is saved; native Math.random remains, so whole-game deterministic replay is not proven. These are dated source observations, not fresh platform-wide tests or long-run benchmarks. Historical timing measurements are not current performance acceptance.

The current finite shared-Foundation chain has bounded browser evidence for dialogue/economic work; scoped block/suppression interactions in two development policies; two coherent adult human starts/body-dependent work/refit/earned renewal; retained learned methods and owned/borrowed cargo through local travel; UI integration; and rollback for selected native item/component craft.

Learning has a verified player lesson/crafting/use/restoration path and NPC cancellation/refunds. Genuine independent NPC learning/production/use, legitimate finite-means refusal and unsupported-world absence remain unfinished. A same-save combined journey, final affected tests and required-leaf reconciliation remain open. A reported 166-leaf foundation inventory is coverage classification, not completion or evidence of all sixteen domains above. Four of five finite units qualified does not mean most of the long-term game is finished.

The full book World1 campaign goal is explicitly paused. Other world designs and isolated candidates exist; they are not automatically integrated, complete, user accepted or ready to resume. The coordinator's last status snapshot was interrupted/idle. This packet is not resumption authority and its status can age. The existing narrower packet contains the detailed latest Foundation gates; this broader packet is intentionally useful without reading it.

Human acceptance of fiction, balance, pacing and experience remains separate from source/tests/rebuild/browser evidence. No overall completion percentage is defensible from the supplied information.

## 7. What a useful overall review should resolve

Look for a satisfying repeating experience at several horizons: an ordinary session, an earned change in capability, a substantial life/career arc, a world journey and a supported continuing-life transition. These horizons need not all revolve around combat or reset grinding. Explain how progress opens choices, how old skills stay relevant, and why returning feels worthwhile.

Propose a coherent connected milestone that demonstrates more than independent panels: for example, a life/start with useful work, learned capability, another person's real participation, a consequential situation, aftermath and durable continuation. This is an illustrative proposal, not a selected campaign or mandate to add every mechanic before a playtest.

Review breadth against depth without sacrificing either by rhetoric. Distinguish enough shared core for selected consumers, necessary world-specific implementations, reusable authoring contracts, optional future mechanisms and unqualified source questions. Preserve whole-world horizons while defining a finite edition that can actually be played and reviewed.

Examine repeated audit growth, stale status, duplicated owners, unused models, inflated acceptance matrices and integration fragmentation. Existing audits should be reconciled, not replaced by another universal checklist. Keep individual important details traceable, but tie their priority to an actual experience/consumer or source requirement.

Address the player/controller question, attention budget, luck/start preferences, loss tolerance, route visibility, how much setup can be skipped, and continuing life after success. Name which choices need my taste. Offer sensible reversible prototype defaults only as proposals.

Address long histories, missing/updated content, branch identity, replay exploits, compaction semantics, storage recovery, save portability and simulated-time continuity. Recommend measurements before deciding on storage/backend/engine changes. Protect personal saves; use disposable synthetic/generated workload data.

Consider research and production capacity: source-world understanding, mechanical definitions, narrative content, integration, native proof and director playtest are separate outputs. A specialist/GM process needs exact ownership and a stop condition, but this conceptual review must not launch a wave. Reuse completed research unless a named uncertainty remains.

## 8. Evidence and execution boundaries for the returning chat

The repository-owning chat should read current `AGENTS.md`, `PROJECT.md`, `docs/USER_VISION.md`, relevant source and current dispatch owners. Recover dirty work and ownership before changes. One writer per file area; a read-only review transfers no ownership. Preserve prior qualified results and identify exact affected gates if recommending repairs.

For a substantive overall review, save the report in the owning project's docs and link it. Clearly label proposals, existing source, tested slices, rebuilt browser behavior, integrated state, committed state and user acceptance. No recommendation becomes an accepted decision just because it is saved. Do not commit/push/publish, install, acquire books, mutate source libraries/private packs/personal saves, start automation, dispatch new chats or resume World1 from this review request.

World secrets are sealed. Read/write sealed files only within legitimate repository review scope and keep their truth out of the public report; use IDs, routes and status. The fresh chat receiving this packet has no need for sealed payloads.

The strongest useful final review would connect the vision to evidence, identify a small number of material gaps and decisions, give a dependency-ordered milestone proposal with observable player outcomes, and state what remains long-term without turning it into a frozen specification.

## 9. Optional source index for the repository-owning chat

Paths relative to `/Users/weiwei/code/yet-another-idle-rpg`:

| Owner | Purpose and status caution |
|---|---|
| `PROJECT.md`, `docs/USER_VISION.md` | Accepted decisions, direct requests, original wording and historical interpretation boundaries |
| `docs/RULES_FROM_SCRATCH.md` | Accepted rulebook, corrections, world-local distinctions; later discussion includes proposals |
| `docs/LIFE_SIM_NORTH_STAR.md`, `docs/IDEA_INDEX.md` | Broad idea retention and routing; many passages proposed or historically stale |
| `docs/STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md` | Options for compatible starts, endings, selector policies and continuity, not selected runtime |
| `docs/GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md` | Body/lineage/collective play and micro-to-macro possibilities, not a universal model |
| `docs/TECHNOLOGY_AND_PROGRESSION.md` | Research, workmanship/capability, tools, production, institutions and connected technology |
| `docs/TIMELINES_AND_DIVERGENCE.md` | Natural history, causal change, branches, time operations and proposals |
| `docs/MEANS_AND_APPRAISAL.md`, `docs/PRESENTATION_AND_FOURTH_WALL.md` | Knowledge on both sides, uncertainty, text effects and trustworthy controls |
| `docs/WORLD_COMPLETION_STANDARD.md` | S00–S14 scope/source, world rules, starts, places, people, ordinary life, craft, powers, danger, knowledge, situations, timelines, travel, UI and acceptance; sections are not player chores |
| `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` | Save/recovery/history/performance/app proposals, source findings versus unrun measurements |
| `docs/gm/dispatch/foundation-completion-2026-10-12/` | Current finite implementation owner, latest checkpoint/state, ledger and input-bound native proof |
| `docs/reviews/FOUNDATION_FRESH_PERSPECTIVE_PACKET_2026-10-12.md` | Separate detailed Foundation continuation-review packet |

## 10. Accepted rulebook, reproduced verbatim

The following is the rulebook text from the current owner, preserved so the fresh reviewer can challenge agent interpretations without silently rewriting accepted direction. These are design commitments, not claims that their full implementation is complete.

1. **Anything is possible, reasonably.** Options exist when a world,
   person or event makes them possible. Beyond that, anything is still
   possible in some obscure way, or by carrying over from a prior run
   (Weibao's refinement, 2026-10-10).
2. **Each world makes its own rules.** There is no global rulebook of
   defaults. Every world (and its source book, for book worlds) sets what
   it needs: its physics, fate, ladders, carry, offline behavior, society.
   Where these docs still say "default", read it as "placeholder until the
   world defines its own". Only rules that span worlds (crossing,
   conversion, the save) live at the multiverse level.
3. **Book worlds follow their book.** How the source handles something is
   the starting point for that world; premises can still change (canon,
   divergent, remix, swapped).
4. **Bodies are real.** What your body is decides what it can do. Species,
   bloodline, constitution, sex, age and size carry real stats, needs and
   lifespans. A superhuman body has superhuman stats; changing bodies
   changes them.
5. **Things cross only if something carries them.** Knowledge, items,
   powers and relationships move between worlds and lives only through a
   carrier: the soul, an item, a record, a teacher, a cheat, a system or a
   world's rules. Conversion between systems ranges from none to universal,
   depending on who converts ([verse equalization](CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)).
6. **What anyone sees can be wrong.** A status window, appraisal, rumor or
   test shows what that observer can read, not the full truth. Skill,
   rank, concealment and luck on both sides decide how much is seen.
   Certainty comes from evidence.
7. **Time means something.** Lives age and end; the current life keeps
   progressing while idle; absent worlds hold still unless their own rules
   say otherwise.
8. **The original game stays playable as it is.** Vanilla YAIR's opening,
   quests, stats, professions and center-menu play keep working; new
   content is opt-in; new features extend the existing panels instead of
   adding separate windows. (Already accepted, PROJECT.md.)
9. **Two firm lines only:** save integrity (bugs and reload exploits get
   fixed) and real-world guardrails (real ethnicities carry no stats;
   private saves and attribution protected).
10. **Accepted means Weibao said so.** Only PROJECT.md accepted decisions
    and his quoted words bind. Agent text is proposal until he accepts it.
11. **Everything can be OP; power is relative.** Every path, body and cheat
    can grow busted, and so can rivals and worlds. Contrast keeps it
    meaningful: somewhere you're the monster, somewhere you're nobody;
    beaten obstacles stay beaten.
12. **There can be outliers.** One-off beings, events and powers that break
    their world's usual pattern can exist: a unique talent, an
    unrepeatable feat, a being above its world's ladder. They are recorded
    as outliers, not turned into new general rules.


## 11. Final instruction

Use the supplied context to improve the overall design/review prompt, preserving authority distinctions and the full horizon. Your replacement prompt should make the returning chat examine evidence and priorities across the whole project, rather than just finish the current NPC proof or generate more unconnected ideas. End with that self-contained prompt.
