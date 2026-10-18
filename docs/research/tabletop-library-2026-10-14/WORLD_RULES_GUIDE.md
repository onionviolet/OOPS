# Rulebook guidance for world rules and content

2026-10-14. Research navigation for YAIRPG, not an adopted universal rules engine. Read PROJECT.md and docs/USER_VISION.md for accepted priorities, and the relevant world/design owner before proposing changes. [Library README](README.md), [catalog](CATALOG.md), [latest inventory corrections](CORE_TITLES_AND_ADAPTATION_PLAN.md) and [private manifest](private/manifest.json) separate downloaded, prepared and read states.

## Where to look by design question

| ID | Question | First sources | What to extract |
|---|---|---|---|
| G1 | How does a world connect to other worlds? | The Strange, Worlds Numberless and Strange, In Translation; Rifts Megaverse Builder | Actual passage/translation, body and cargo handling, local laws and return state. GURPS Infinite Worlds / Torg are candidates unless manifest confirms acquisition. |
| G2 | How do study, invention and a persistent magical home work? | Ars Magica core, Covenants, Apprentices, Hermetic Projects | Exact prerequisites, time units, research outputs, laboratories, teaching and community dependencies. Repository WIP status matters. |
| G3 | How can different supernatural traditions coexist? | Ars Magica Hedge Magic, Rival Magic, Ancient Magic and Realms of Power; WFRP core | Distinct means, supported effects, source boundaries and local institutions. Thaumatology/Powers remain candidates until inventoried. |
| G4 | How should abilities be specified precisely? | GURPS Basic Set, Mutants & Masterminds Power Profiles, Cypher reference | Function, target, scope, duration, carrier, requirements, control and growth. Power Profiles depends on M&M rules; book point costs are not automatic YAIR balance. |
| G5 | What gives a place ordinary life? | Ars Magica City & Guild, Art & Academe, Covenants; WWN and SWN | Work, craft, services, scholarship, institutions, resources and independently motivated factions. |
| G6 | How does very high power change a world? | Godbound free edition | Concrete change, actual reach, world projects, institutions and lasting consequences. Preserve free-versus-deluxe coverage. |
| G7 | What survives changing bodies? | Eclipse Phase second-edition core, Character Options, errata | Continuing identity, knowledge, body-dependent faculties, access, backups and actual custody. |
| G8 | How do expeditions connect to ongoing projects? | Ironsworn, WWN/SWN; Blades player kit and Starforged primer | Supported action loops, progress tracking, preparation, complications and returns. A kit/primer is not a full core. |
| G9 | How do we add varied details? | Existing Numenera/Strange setting and bestiary books | Concrete creatures, places, materials and encounters tied to supported actions. The Weird is a candidate prompt resource, not a simulation. |

## Retrieval and evidence

Original user files stay in place. `private/existing/` provides research symlinks; `private/sources/` holds native downloads, Eclipse Phase extracted files and the full Ars Magica repository. `private/manifest.json` is the acquisition ledger, including exact paths, hashes and preparation states. The public catalog is a dated snapshot; subsequent inventory additions may await extraction/catalog refresh. A filename match does not verify a book's internal edition or completeness.

Use `python3 docs/research/tabletop-library-2026-10-14/search.py 'your FTS5 query' --limit 8` to find prepared page/heading excerpts. Inspect the actual source around each result. Keep full rules, tables and examples with exact source locators in the appropriate gitignored private research folder. Public reports paraphrase and link to private evidence. Do not infer that a full-text index means a full reading or that a book's rules are all machine-resolvable.

For deep adaptation follow [SOURCE_DEEP_DIVE_PLAYBOOK.md](../SOURCE_DEEP_DIVE_PLAYBOOK.md), selecting the modules needed. Classify each finding as source rule, interpretation or proposed YAIR behavior. Resolve human-GM judgments explicitly. Keep licensing/attribution notes source-specific when considering code or content reuse; personal reference acquisition does not establish redistribution permission.

## Apply through current owners

World connections and persistence belong in [MULTIVERSE_STRUCTURES.md](../../worlds/MULTIVERSE_STRUCTURES.md); ability behavior belongs in the relevant existing ability/design owner. Use one source-defined local place, branching progression opportunities and procedural variation within supported rules. Preserve earned abilities where their actual means permit use. Specific setting restrictions do not become universal suppression, mandatory costs or equalization.

Keep a world's people, unique items, resolved events and generation revision durable. Show useful choices and actual idle progress in a desktop-first interface. New rules require actual consumers and observable consequences. No research report alone authorizes a new implementation priority, merge, purchase or publication.

## Active follow-up scopes

| Chat scope | Saved brief | Exclusive report area |
|---|---|---|
| YAIR implementation considerations | [Implementation brief](handoffs/IMPLEMENTATION_BRIEF.md) | `implementation-considerations/` |
| Existing rulebook-to-game endeavors | [Conversion research brief](handoffs/CONVERSION_AUDIT_BRIEF.md) | `conversion-landscape/` |

Created chat IDs and write areas are recorded in [chat routing](handoffs/CHAT_ROUTING.md).

Using the shelf for world building and an in-game GM (tag decks, faction turns,
downtime as idle jobs, SRD licensing, rulings ledger):
[considerations](../../RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md).
