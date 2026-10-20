# World and system completion standard

2026-10-11. Requested direction: section off the audits and ideas so every small
detail can be developed, and use a standardized way to complete worlds and more.
The section structure and workflow below are implementation proposals for that
direction. They do not accept new lore, numbers, loss rules or runtime behavior.

The intended entry is a suspenseful random starting point. Frontier is an
optional campaign, not a required opening or prerequisite playthrough. Exact
eligible starts, selection probabilities and reroll policy remain proposals.
Completion measures authored delivery; a player need not visit every world,
finish every career or see every ending.

## One structure, local ownership

Use this standard for a world, region, campaign, progression path, ability family
or shared system. Each scope has a local completion contract and detail ledger.
Reuse existing owners, especially Frontier's [WORLD_COMPLETION](worlds/original-frontier/WORLD_COMPLETION.md)
and [COMPLETION_LEDGER](worlds/original-frontier/COMPLETION_LEDGER.json). Map their
stable IDs into sections without replacing IDs or resetting earned evidence.
Those existing files describe a finite campaign, not the mandatory player start.

[World contract template](worlds/templates/WORLD_COMPLETION_TEMPLATE.md) and
[ledger template](worlds/templates/COMPLETION_LEDGER.template.json) give the
reusable shape. Existing ledger schemas remain valid; adopting this authoring
template is not a game-save migration.

Global indexes route to detail owners. A cross-world dependency points to its
shared owner and consumer tests rather than duplicating its specification.
Section tags are planning categories, not universal world rules or required
gameplay meters. Several sections can apply to one detail, with one primary
owner. Applicable sections require coverage; not-applicable decisions need a
reason grounded in the scope. Missing functionality is not not-applicable.

## Sections

These are reference categories, not fifteen tasks the player must complete.

| Code | Section | Details to account for | Existing detail routes |
|---|---|---|---|
| S00 | Scope, sources and audit reconciliation | Represented boundaries, editions, claims, aliases, canon/invention, disagreements, every idea's disposition | [Idea index](IDEA_INDEX.md), [audit method](gm/AUDIT_RECONCILIATION_METHOD_2026-10-11.md), local SOURCE_LEDGER |
| S01 | World identity, laws and history | Local rules, signature functions, exceptions, eras, continuity, cosmology, natural course | WORLD_BRIEF, [campaign framework](worlds/CAMPAIGN_FRAMEWORK.md), [rulebook](RULES_FROM_SCRATCH.md) |
| S02 | Starts, bodies and arrival | Eligible starting snapshots, origins, roles, means, knowledge, entry circumstances, initial usable actions | Local RULES_AND_STARTS/entry owner, [origins](worlds/ORIGINS_AND_WORLD_TIMELINES.md) |
| S03 | Places, environment and exploration | Routes, travel, terrain, materials, hazards, weather, access, observations, changed places | Local CAMPAIGN/MODULE_CATALOGUE |
| S04 | People, relationships and organizations | Motives, means, beliefs, services, duties, consent, memory, recruitment, institutions, heirs where relevant | Local INTERACTIONS, [life sim](LIFE_SIM_NORTH_STAR.md) |
| S05 | Everyday life, work and economy | Careers, food, rest, care, housing, production, supply, prices, payment, obligations, repeat work | Local campaign/economy owner, [life sim](LIFE_SIM_NORTH_STAR.md) |
| S06 | Items, materials, crafting and technology | Quality, provenance, custody, recipes, equipment, furnishings, functional devices, repair, upgrading | [assembly](worlds/PROGRESSION_AND_ASSEMBLY.md), [technology](TECHNOLOGY_AND_PROGRESSION.md) |
| S07 | Skills, bodies, powers and development | Acquisition, learning, execution, mastery, talents, energies, growth, support, synergy, special functions | Local ABILITIES/ABILITY_VARIANTS, [ability authoring](worlds/ABILITY_AUTHORING.md) |
| S08 | Combat, danger and recovery | Actual threats, targeting, effect order, groups, objectives, protection, defeat, interruption, aftermath | Local danger/ability owner and native combat contracts |
| S09 | Knowledge, discovery and secrets | Actor-specific observation, clues, wrong readings, appraisal, information channels, revelations, useful pre-certainty action | [means](MEANS_AND_APPRAISAL.md), [discovery](worlds/WORLD_SECRETS_AND_DISCOVERY.md) |
| S10 | Situations, dialogue and narrative | Causes, quests, character voice, choices, refusal, abstention, timings, variants, remembered responses | Local CAMPAIGN/INTERACTIONS, [dialogue](worlds/DIALOGUE_AND_INTERACTIONS.md) |
| S11 | Timelines, endings and continuing life | Independent events, divergence, closure, maturity, aftermath, ongoing play, succession where relevant | Local TIMELINE_AND_ENDINGS, [timelines](TIMELINES_AND_DIVERGENCE.md) |
| S12 | Travel, other worlds and other lives | Departure, carriers, cargo, companions, obligations, reentry, absence, inheritance, loops, reset/retention | [campaign framework](worlds/CAMPAIGN_FRAMEWORK.md), [simulators](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md) |
| S13 | Presentation and usability | Native panels, text/VFX, known costs, feedback, hidden identities, focus, keyboard access, recovery controls | [presentation](PRESENTATION_AND_FOURTH_WALL.md), local UI bindings |
| S14 | Persistence, integration and acceptance | Sole state writers, migrations, save publication, old saves, build identity, browser journeys, performance, director review | [engine authoring](ENGINE_AUTHORING.md), [playtest](PLAYTEST.md), local acceptance backlog |

## Preserve the little details

Decompose as scope → section → family → feature → observable detail. For example,
S06 → furnishings → bookshelf → read-book contribution → moving, selling,
borrowing, duplicate loading, display explanation and applicable study effects.
One implemented bookshelf does not close every furnishing. One native panel
does not establish every promised function inside it.

Give each meaningful detail a stable ID and one observable criterion. Keep tiny
related cases under a parent instead of creating a new system or document for
every adjective. Save source IDs and precise locators; a merged requirement
retains each source's distinct consequence. Harmless texture can have a content
review criterion without a mechanical effect. Exact wording and numerical tuning
belong to their existing owners, not duplicated in an index.

Each detail records scope/section, authority and source, disposition, owner,
criterion, dependencies, native consumer, interaction cases, persistence decision,
evidence by verification stage and remaining work. Evidence must identify the
input/build or content revision and actual result. Proposed, selected, source
implemented, built, browser verified and director accepted are separate states.

Sealed details expose only opaque IDs, route/status and agent-only pointers in
public planning surfaces. Hidden truths, future outcomes and even revealing
criteria live in sealed owners. Reports, menus and intake manifests must not
turn the author checklist into a player spoiler list.

## Depth and interaction coverage

For a selected functional feature, author its useful life: discovery/acquisition,
real execution, distinct approaches when appropriate, actual combinations,
development, responses, continuing use and retention. Record actual constraints,
interruptions and counterexamples without inventing universal flaws or ceilings.
Do not force every feature through a prestige loop or every world through combat.

Each section gets its own detail review and a cross-section interaction table.
Inspect declared joins, not the full Cartesian product of every ability and
item. Include changed-state and high-consequence boundaries: new equipment,
changed body, lost access, unavailable teacher, stock exhaustion, moving a
fixture, cancellation, departure, repeat reward and save restoration, where they
can affect this feature. Strong earned means may resolve a problem outright.

| Example join | Observable obligation |
|---|---|
| S06 furnishings × S07 learning × S14 saving | Saved owned fixture affects the actual learning consumer; removal stops its effect; reload never multiplies it |
| S04 NPC means × S09 observation × S10 response | NPC acts on supported knowledge; learning a fact changes a fitting response; hidden player abilities remain hidden |
| S02 random start × S03 access × S05 livelihood | Selected snapshot provides coherent body/access/resources and actual initial interactions; no assumed Frontier wages or history |
| S07 exceptional function × S08 threat × S11 aftermath | Function changes the actual target/outcome; any surviving consequences follow their real causes |
| S12 departure × S11 continuity × S14 persistence | Return resumes the chosen history and claims; travel does not silently reroll a world or award first-entry rewards again |

## Random starting points without spoiling discovery

Author compatible starting snapshots before choosing among them. A candidate
joins world/continuity/era/region/origin/situation with an actual body, means,
resources, relationships, obligations and actor knowledge. Mid-history starts
need a coherent prior world state; they do not fabricate actions the player
performed or rewards the player earned. A random place is not necessarily a
random power, era or character. Each axis needs its own selected policy.

Proposed first implementation chooses among a bounded set of qualified starts.
Eligibility depends on installed content and supported native bindings, not a
promise that every drafted world works. Persist the committed selection and
starting snapshot, candidate-pool revision and relevant seeded choices before
live publication. Reload/import preserves it; previews
and failed saves cannot silently reroll it. Seed, distribution, explicit reroll,
fallback and compatibility policies must be specified before implementation.

Qualified means internally coherent with functioning initial interactions and
understandable feedback. It does not guarantee equal difficulty, safety, escape,
or protagonist powers. Such differences need deliberate authored policy. Missing
content must have a declared compatibility result without exposing an unknown
world or silently granting a second beginning.

Reveal only what this character's present means can establish. Show observable
surroundings and usable actions, not an author list of worlds, signature rules,
rankings or eventual outcomes. The developer qualifies every selected candidate
and its save/knowledge boundaries without revealing the candidate catalog to
Weibao. No mandatory Frontier tutorial precedes the selection. Frontier remains
available when an actual supported route/start makes it available.

## Completion levels and gates

### Design expansion and implementation audit

Use both passes for every selected feature family, including titles, progression,
skills, milestones, traits, statuses, perks, item utilities and small recurring
interactions. Recover earlier audit IDs and variants before adding new ideas.
Design expansion asks what meaningful forms, uses, synergies and consequences
the feature should support. Implementation audit asks what its actual current
owners, callers, UI, saves and observed behavior support now.

| Audit stage | Evidence required | What an uncovered gap becomes |
|---|---|---|
| Definition/source | Exact declarations, relevant handlers and source/premise fidelity | Missing content, mistaken rule or unsupported function |
| Invocation/state ownership | Actual gameplay caller, inputs/effects, ordering and sole owner | Missing binding, duplicated writer or wrong effect target |
| Native presentation | Reachable action/readout, correct observed feedback, relevant visibility and recovery | UI consumer or discovery/control repair |
| Persistence/compatibility | Actual saved fields, loading/migration, removal/reapplication and publication policy | Retention/migration/idempotence work |
| Behavioral acceptance | Rebuilt fresh-origin positive/variant/interaction journeys and relevant save/reload/import | Specific failure repair or explicit unrun acceptance |

Source presence, a test-only caller, a tooltip and a saved namespace establish
different facts; none alone proves the promised function works. Existing working
features should be extended rather than recreated. Known browser evidence can
be retained for its exact scope/revision; new unplayed variants remain open.
Plan relevant stacking/removal, hidden titles, milestone functions, native skill
discovery, branch eligibility, late ordinary usefulness and current/history
bookkeeping as leaves where they change behavior. Content-only texture still
needs no invented mechanic. Numerical caps/costs/rarity ladders remain local
choices, not defaults imposed by this audit method.

Implementation audits are targeted to selected details and affected consumers,
not an instruction to rerun every suite or rebuild the engine before expanding
ideas. The current planning wave performs source/contract inspection only; its
runtime, browser and save cases are specified-not-run.

| Level | Claim allowed | Required evidence |
|---|---|---|
| C0 inventoried | Inputs and scope accounted for | Audit manifest with explicit exclusions/unread remainder; no runtime claim |
| C1 specified | Finite required details and cases selected | Linked owners, reviewed section coverage, resolved/recorded conflicts, dependencies and frozen criteria |
| C2 playable slice | One connected journey works | Current rebuild, fresh-origin native journey, relevant failure/interaction checks and persistence proof if changed |
| C3 section complete | All selected details and joins in one section work | Evidence for every required leaf, reachable alternatives, section review, no concealed missing adapter |
| C4 campaign/system delivery complete | Frozen represented scope works end to end | All required sections, starts/routes/endings and cross-section journeys covered; residual scope explicitly outside this revision |
| C5 director accepted | Fiction, pacing, balance and feel accepted | Weibao's actual acceptance for the reviewed revision, separately from automated/browser checks |

Levels qualify only their declared scope. A C2 room is not a C4 world. A finished
region is not a fully represented source universe. A player's ending is not
developer completion of alternate paths. Director acceptance can also apply to
a bounded slice without promoting the full campaign to C5.

Freeze a finishable represented scope, not the size of the vision. Later detail
requests receive requirement revisions; they reopen affected criteria rather
than erasing unrelated evidence. No generic percentage proves depth. Report
required/verified/open counts with the selected scope and specific missing gates.

## Execution cycle and parallel planning

Broad book/anime world work uses the
[whole-world actionability pass](gm/WORLD_ACTIONABILITY_GM_PROMPT.md) to improve
and expand existing ideas before selecting implementation packets. Preserve
identified starts, premises and cheat variants through explicit compatibility
and dependency mapping. A whole-world blueprint and the next playable revision
are separate linked horizons; a small proof cannot substitute for source/idea
coverage of the full assigned setting.

Recommended planning sequence: idea-family GMs first audit and expand starts,
cheats/progression, lived worlds and continuity; one actionability integrator
reconciles their details and packets. Selected world GMs then apply the reviewed
palettes to local source rules and flesh out whole settings. This proposed order
does not make family palettes universal laws or launch those assignments.

Use five steps for each selected tranche:

1. P1 ingest and reconcile: inventory audit inputs, extract leaf ideas, map each
   to an existing owner and disposition, and keep source disagreements explicit.
2. P2 section and qualify: populate local detail rows, start candidates and
   cross-section joins; select finite scope and identify actual missing adapters.
3. P3 assign: prepare bounded packets with requirement IDs, dependencies and exact
   file ownership. Independent source/detail review can run in parallel; shared
   inventory, clocks, saves, registries and build publication have one integrator.
4. P4 implement and exercise: complete a connected playable slice, extend its
   details, then close selected sections. Rebuild before fresh-origin browser
   checks; persistence changes include compatibility, old-save and save/reload/import.
5. P5 review and continue: join worker evidence, review interactions and director
   gates, update remaining work and finish the next slice within authorized scope.

Roles are useful lanes, not a permanent agent per section. Reviewers can inspect
the same files read-only; writers cannot. Contracts settle before dependent code
workers begin. Check live files/workers after refresh, transfer reservations
explicitly and retain current checkpoints. Planning authorization does not start
every queued runtime wave or allow publishing, pushing or using private saves.

## Intake and current boundary

[Public audit intake](gm/completion/AUDIT_INTAKE.json) groups discoverable research
artifacts by source family and links prior reconciliation owners. It inventories
files; per-idea extraction and section adjudication remain pending. Private book
research and sealed sources must be inventoried through agent-only owners, not
copied into this public manifest. An unread artifact is not an absent idea.

Existing campaigns adopt these categories through a mapping, not a bulk rewrite.
The current absorption assignment retains its scope and own verification gate.
This document sets up planning and completion; it changes no gameplay and claims
no world, random-start selector or existing audit backlog newly complete.

## Setup review, 2026-10-11

Three internal subagents reviewed completion depth, random-start requirements
and the public intake. A final independent read-only review passed the standard,
contract/ledger templates and PROJECT routing with no concrete gap found. This
is document review, not gameplay acceptance.

Structural checks passed: 37 local links across the new planning documents,
matching S00–S14 ledger sections with all applicability pending and no selected
requirements, 396 unique existing public intake paths across 66 source families,
and restricted-path exclusions. The intake worker additionally checked its three
prior-owner paths. Whitespace checks passed for the edited routing/templates.
No source, build or gameplay checks were run by this planning task.

## Current rule qualification, 2026-10-18

This proposal is a coverage/readiness standard, not a gate requiring all S00–S14
before any playable slice. Follow the selected brief and current RULES_INDEX
(AD32/AD33/AD36); expose relevant thin or unbuilt coverage rather than calling
it a fictional prohibition (AD38). Source unknowns, character knowledge and
implementation coverage remain separate facts (WA8/WA12, G30).

Earlier mandatory old-save/migration wording is currently qualified by
[the 2026-10-17 decision](USER_VISION.md#old-save-compatibility-deferred-2026-10-17).
New-state persistence and private-save boundaries remain. Runtime UI checks use
current UI_RULES targets. Authored start/world floors do not override accepted
guided-random entry or require the vanilla campaign first (AD23). Apply
[G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)
only to affected seams, with an actual player consumer.

## Per-world subtle gaps sweep, 2026-10-20

A read-only sweep applied this standard to every world folder: supported level
(none above C1), signature, and one subtle missing aspect per world with a done
check, plus cross-world patterns. Proposals only. Index:
[world subtle gaps](audits/WORLD_SUBTLE_GAPS_2026-10-20.md) (WG1-WG26, WGP1-WGP4,
WGX1-WGX6).
