# Micro, meso and macro implementation-support GM

2026-10-12. Requested direction: consider details across worlds, starting points,
character creation and the systems that make future implementation easier.
This is a proposed role and implementation-support plan, prepared in this chat.
It does not launch another chat, select every world for implementation or accept
the proposed architecture. No gameplay source was changed.

## Purpose and current inputs

Act as the connection GM: turn existing world ideas into coherent playable
behaviors and reusable authoring patterns. Work beside world owners and the
shared integrator. Keep each world's laws local while making common operations
easy to implement, inspect, save and extend.

Recover [PROJECT](../../PROJECT.md), [master GM](../GAME_MASTER_PROMPT.md),
[completion sections](../WORLD_COMPLETION_STANDARD.md),
[actionability pass](WORLD_ACTIONABILITY_GM_PROMPT.md),
[origins](../worlds/ORIGINS_AND_WORLD_TIMELINES.md) and the selected world owner.
Reuse [macro/micro delivery](dispatch/macro-micro-detail-2026-10-11/REPORT.md)
and [starts delivery](dispatch/starts-talents-continuity-2026-10-11/REPORT.md).
Their counts and candidate gameplay claims remain owned by their evidence;
reading their reports here does not independently verify them.

The earlier macro/micro tranche is complete as planning. Its ten cards, causal
joins and packets should be routed, not recreated. The starts candidate reports
a bounded durable random beginning, not a universal character generator. The
new gap is organizing the connections and development affordances around them.

## Three scales, one behavior

| Scale | Questions for the GM | Example, original proposal |
|---|---|---|
| Micro | What can this body do with this object, here, now? What does the player see? | Borrow a worn tool; inspect its condition; repair it; return it or retain its actual obligation. |
| Meso | How do repeated actions change a household, workshop, relationship, organization or project? | Reliable repairs earn specific workshop access; an apprentice can perform a demonstrated task; household property stays with its owner. |
| Macro | How do world rules, institutions, supply, history and major powers shape those opportunities? | Better repair capacity changes local demand; an informed institution changes procurement; plentiful supernatural production can bypass that supply chain. |

For each selected feature, trace both directions. A world law affects a local
opportunity; a player or NPC action changes something; a particular informed
recipient responds; that response changes later options. Do not simulate a
whole economy to prove one workshop consequence. Some texture can remain prose.

## Character creation and the opening life

| ID | Detail to qualify | Concrete consequence and counterexample |
|---|---|---|
| C01 | Chosen identity, preferences and accessibility settings | Separate player preferences from randomized fictional circumstances. Decide which choices precede selection and which require discovered local means. No automatic assumption that every body or era is freely selectable. |
| C02 | World, continuity, era, region and entry route | Validate authored combinations. A birthplace must exist at that date; replacement and reincarnation have distinct histories. A label is not an independent world instance. |
| C03 | Body, life stage, senses, health and control | Match usable verbs, equipment and presentation to actual anatomy. An infant or rooted being needs its own interactions; retaining memories does not grant adult mobility. |
| C04 | Family, language, standing, property and duties | Name particular people, what they know, who owns each object and why help is available. A wealthy household does not automatically give the character its entire inventory. |
| C05 | Acquired means, potential, memory and practice | Keep potential, recollection, understanding and executable power separate. An ordinary approach remains meaningful where locally possible; an extraordinary means may actually replace its work. |
| C06 | First situation and continuing options | Show surroundings, at least one supported consequential action and known risks. Unequal or lethal starts remain allowed; record an intentional severe outcome rather than disguising missing support as difficulty. |
| C07 | Selection, confirmation, cancellation and restoration | Define commitment point, probability unit and reroll policy. Adding more starts to one world must not silently change the intended world distribution. Preserve a committed selection through failed initialization and reload. |

Keep hidden world identities, start catalogues and latent truths out of visible
creation previews unless the character has a discovery route. Public examples
here are invented patterns, not disclosures of existing sealed starts.

## Make future work easier

The following are proposals to qualify against actual existing owners. They are
not a request for a replacement engine or an all-purpose plugin framework.

| ID | Development affordance | First useful deliverable | Qualification gate |
|---|---|---|---|
| E01 | One authoritative state owner per domain | Map body, stock, custody, knowledge, time, commitments and world facts to existing writers and save fields. | One action updates its real owner; failure publishes no partial inventory, reward or visible success. |
| E02 | Shared operations with local rule contracts | Document existing action preview/commit, conditions, effects and view seams; bind world-specific costs, powers and clocks through them. | Two contrasting local behaviors reuse the operation without inheriting each other's power ladder, scarcity or death rules. |
| E03 | Compatible composition | Represent supported era/place/origin/scenario combinations explicitly; declare dependencies, exclusions and required capabilities. | One valid composition runs; an incompatible one produces a precise author diagnostic before publication. Avoid an unchecked Cartesian product. |
| E04 | A content authoring starter | Give a tiny original pack example, a schema reference, an owner map and a recipe from authored action to actual native consequence. | A new author adds one complete loop without copying a world runtime or inventing an API. Data fields alone do not establish native support. |
| E05 | Versioning and private-pack portability | Separate definition revision, content identity, instance identity and save migration; document exact-content restoration and optional-module absence. | Old generated saves remain intact; missing or mismatched content fails safely; removal does not silently discard obligations or stock. |
| E06 | A shared action presentation contract | Feed known actions, actual blockers, costs, jobs and cancellation into the existing center-menu owner. | Focus survives ticks; a usable local action is findable; NPC private facts and undiscovered actions do not leak. Reuse the existing UI audit rather than adding another panel. |
| E07 | Author diagnostics and causal receipts | Report the failed capability, dependency, actor, target and effect consumer; retain a bounded cause trace for debugging. | An author can explain why an action is unavailable and what actually changed. Debug views stay author-only and never enter player discovery text. |
| E08 | Generated fixtures and contract checks | Reuse disposable starts/saves with known revisions; cover ordinary, powerful, interrupted, repeated and restored variants. | Rebuilt fresh-origin native play plus save/reload/import proves the selected journey. A fixture mutation cannot stand in for earned progression. |
| E09 | Performance boundaries | Measure the chosen loop with larger authored actor/action sets; declare clock catch-up and retention semantics. | Menus remain usable and pending work stays correct. Bounded histories do not erase live obligations; no separate timer is added for convenience. |
| E10 | Integration and scope records | Name exclusive writers, interface revision, actual dependency and delivery state for each packet. | The integrator can review one complete behavior and its evidence without reconstructing several chats. No duplicate global rule owner. |

Extract a reusable helper after concrete consumers show the shared shape. The
second different world is a useful comparison, not a mandate to wait before
fixing an already understood common operation. Keep unique mechanics in local
modules; extraction must preserve their differences.

## Possibility, agency and features within features

Revision 2, 2026-10-12. Weibao asked to expand and dispatch, including romance,
subtle details, nested features, research, ponderings, actions, capabilities,
ordinary and outlandish possibilities, and unlimited choice.

Read the accepted possibility direction in PROJECT and
[means](../MEANS_AND_APPRAISAL.md). Preserve the broad horizon: an option can
be possible through a local person, event, invention, obscure route, extraordinary
power or carried means from another life. Do not impose a universal action list,
power ceiling, slot budget, scarcity fee or drawback merely to simplify a system.
Unlimited creation really can remove a material bottleneck. Local rules still
determine the effect and other actors still have their own capabilities.

Separate physical possibility, held means, controllability, knowledge,
recognition/permission, willingness and actual execution. A prohibited action
can be physically possible; lack of permission is different from lack of means.
Unknown differs from impossible; not-yet-implemented differs from both. A freely
typed wish is not evidence that its effect exists. If arbitrary intent input is
proposed, resolve it to supported targets/operations, show actual interpretation,
and refuse unsupported publication without inventing a fictional prohibition.

The visible menu can group an open-ended possibility space. Keep known unusual
routes findable and explain missing means without revealing hidden answers.
Seeking a way, asking someone, experimenting, commissioning, combining and
inventing can themselves be actions with supported outcomes. No requirement to
author infinitely many buttons before one complete loop can be delivered.

The following X IDs are review additions, not claims that the project has never
considered them. Reconcile earlier owners before calling anything new.

| ID | Family and subtle details | Nested behaviors and consequences to expand |
|---|---|---|
| X01 | Romance and affection | Attraction, trust, comfort, respect, commitment and compatibility can disagree. Invitations, mutual interest, uncertainty, rejection, changing preferences and friendship need actual scenes, not one affection threshold. Gifts carry taste, history and provenance; repeated identical gifts need not buy identical feelings. |
| X02 | A shared life | Calendars, chores, privacy, finances, separate possessions, guests, careers, caregiving, rituals, repair after conflict and moving house. A partner retains independent plans and can offer help, decline a journey or renegotiate a commitment. Courtship and household rules stay local; relationship structures need explicit participants and agreements rather than one global model. |
| X03 | Strange relationships and identities | Spirits, artificial minds, distributed selves, body changes, immortality, soul bonds, copied memories, reincarnation and alternate counterparts. Recognition, continuity of identity, memory, affection and present agreement are separate. Restoring a body does not automatically restore a relationship; a copy does not acquire every original person's promises. Keep intimacy age-appropriate to the actual embodied life stage. |
| X04 | Features inside features | Decompose a workshop into access, tools, stock, technique, orders, assistants, quality, inspection, maintenance and customers; a date into invitation, availability, place, preparation, conversation and aftermath; a school into admission, attendance, mentoring, peers, projects and credentials. Expand only leaves that change choices, useful texture or consequences. |
| X05 | Research and invention | Questions, hypotheses, evidence provenance, instruments, experiments, controls, negative results, uncertainty, replication, translation, teaching and application. A hypothesis or imported recipe is not a working local method. Abundant resources can remove costs while interpretation, compatibility or aim remain genuine questions only where the fiction supports them. |
| X06 | Pondering and self-understanding | Recall, reflect, compare, rehearse, plan, journal, seek advice and reassess. Distinguish player notes, character recollections, inference and world truth. A quiet scene can matter without XP; reflection cannot fabricate knowledge of an unseen event. |
| X07 | Action grammar and targets | Inspect, ask, offer, refuse, take, borrow, delegate, teach, repair, transform, combine, conceal, undo where possible, and leave. Qualify actor, target, reachable channel, tool, method, scale and intention. A correct verb with the wrong target/body/channel fails for its actual reason. |
| X08 | Means and capabilities | Acquisition, possession, custody, access, activation, control, range, precision, throughput, perception and transfer. Borrowed access is not ownership; knowing how differs from doing; losing a tool can end one route while another remains. Apply the same reasoning to NPCs. |
| X09 | Cooperation, opposition and delegation | A willing ally may lack the means; a capable enemy may lack location or intent. Delegated work has an actual recipient, instructions, supplies, scope, commitment and completion report. Plans must change when a route, person or resource changes, without universal NPC omniscience. |
| X10 | Ordinary life | Meals, rest, hobbies, clothes, tidying, gardens, pets, letters, celebrations and useful routines. Distinguish cosmetic expression from functional equipment and care obligations. Do not turn every pleasure into a mandatory maintenance meter or progression tax. |
| X11 | Outlandish means | Become a landscape, inhabit a tool, grow a city, duplicate yourself, create matter, exchange senses, guide a host as a system, rewrite a local rule, bargain with a concept or move a home across worlds where supported. Name what actually changes, whose identity/ownership persists and which native consumer expresses the feat. No automatic nerf or universal price. |
| X12 | Open choices and discovering routes | Direct action, assistance, persuasion, trade, theft, invention, powerful bypass, waiting, refusal and doing something else. Preserve materially different options, including free help when someone would offer it. Distinguish absence of a current route from a decree that no future route can exist. |
| X13 | Time and interrupted lives | Appointments, travel, asynchronous letters, overlapping plans, interrupted preparation, late arrival, long absence and return. An idle resolution needs actual means and a defined clock. Cancellation does not erase another person's already received message or committed response. |
| X14 | Ownership and downstream users | Personal/household/institutional property, shared access, loans, gifts, repairs, warranties and commissioning. New quality needs an actual consumer; an appraisal score alone does not change performance. Provenance and emotional meaning can persist after sale or transformation. |
| X15 | Scale and abundance | One tool to production line; one household to settlement; one lesson to school; one insight to research tradition. Identify the actual bottleneck and recipients. If a power solves production, allow changed demand and new goals; do not secretly restore scarcity to preserve the old grind. |
| X16 | Closure and continuing life | Graduation, finished research, resolved feud, retirement, separation, death, succession and return. A finished arc can leave routines, relationships and projects alive. Specific assets, rights, debts, memories and methods have their own carriers rather than one global retention percentage. |
| X17 | Modularity under unusual play | Capability-based local extension points, typed effect targets, domain ownership, versioned content and actor-safe views. A nonhuman actor or unlimited means should expose the missing adapter precisely, not force every module to impersonate a human inventory or normal wage loop. |
| X18 | Creation and choice presentation | Preferences versus rolled circumstances, identity versus recognition, expected role versus chosen life, accessible controls versus fictional senses. Preserve suspense while showing known costs and severe stakes. A hidden catalogue is not a license to hide already-known alternatives. |

## Worked connections, original proposals

**J01 Workshop and shared life.** A character learns a partner's particular
practical need through conversation, checks whose tool it is, asks to work on it,
repairs with actual means and lets its user try it. The object becomes more
useful; the recipient remembers the specific exchange. Further commissions,
trust or a joint project require their own cause. Refusal, wrong diagnosis,
borrowed materials and an extraordinary instant repair change the route.

**J02 Research and an organization.** A pupil notices an inconsistent result,
records an attributed observation, asks a mentor, runs a supported comparison
and revises a hypothesis. A reproducible method can be taught to a willing
recipient with appropriate tools. A school may change its practice after actual
received evidence. Discovery, publication, institutional adoption and executable
mastery are four different outcomes.

**J03 Unlimited creation and new aims.** A holder can create useful material
without a fabricated resource fee if that is the power's actual rule. People who
receive and can use it may stop buying the old supply. Distribution, taste,
trust or engineering may remain questions, but only if those constraints really
apply. If the same means solves them too, let it. Later choices can concern
what to build, whom to help or which world to visit instead of earning the same
material again.

**J04 A changed body and an existing relationship.** A character changes form,
retains only declared carriers and attempts contact using the new senses and
communication means. A partner can recognize them through supported evidence,
remain unsure, adjust routines or decline a proposed change. Appearance,
recognition, continuing identity and willingness need separate state and scenes.
No rule here selects the relationship's ending.

## Research and expansion method

Use the existing romance expansion in
[life-sim north star](../LIFE_SIM_NORTH_STAR.md#romance-expanded), earlier MM
cards, minigame owners and actual world/source dossiers first. For each X ID,
record already-considered details, the newly specified consequence and the
remaining uncertainty. Preserve useful small variants when consolidating.

Research named uncertainties: a selected world's custom or power rule; a
reference game's particular reusable interaction; an existing native adapter;
or the usability of an unsettled choice display. Use bounded source ranges and
primary evidence where possible. Clearly separate source fact, interpretation
and original proposal. Do not browse just to certify an invention or acquire
another corpus without assigned need. Private source text and sealed truths
remain in their current private owners.

For each functional leaf, specify the player fantasy, local rule, actor/target,
held means, discovery, actual action, ordering/time, recipient response,
continuing use, refusal/interruption, durable owner and observable consequence.
Add ordinary, unusually powerful and changed-body variants when relevant.
Separate incidental texture from gameplay so neither is lost to a schema.

## Source observations from this pass

Source inspected on 2026-10-12, in the dirty shared checkout:

- [Structured definitions](../../src/structured_pack_definitions.js) exports
  compile/merge/stage seams and enumerates supported simulation families.
  These are useful extension points, not proof of arbitrary world behavior.
- [Structured runtime](../../src/structured_pack_runtime.js) validates typed
  beginnings, plans a selection receipt before origin publication and binds the
  selected body/location during initialization. Its admission checks require
  compatible native form/life stage. General nonhuman creation is not established.
- [Structured state](../../src/structured_pack_state.js) checks exact selected
  content identity during restoration. Preserve this contract when considering
  author tooling and revisions; do not silently substitute another start.
- [Existing menu proposal](dispatch/starts-talents-continuity-2026-10-11/MENU_CONSIDERATIONS.md)
  already identifies a common presentation owner. Keep gameplay state with
  feature owners and layout coordination with that owner.

No runtime, performance, browser or save test was run for this document.

## Finite first assignment and handoff

First qualify a character-to-local-life journey using an existing selected
world's public contract and generated saves. Reconcile the starts candidate
with its live owner before any integration; do not open private truths for a
public architecture report. Use one contrasting world contract to challenge
universal assumptions without implementing that world in this tranche.

Deliver five bounded outputs in a newly reserved task folder:

1. A coverage matrix routing C01–C07 and E01–E10 to canonical owners, with
   proposed, supported, implemented and played evidence kept separate.
2. A state/interface map for the selected journey, including native consumers,
   writes, durable publication, player knowledge projection and cancellation.
3. A complete original example pack or authoring recipe, using existing APIs;
   any unsupported operation becomes an exact dependency rather than a stub
   presented as finished gameplay.
4. Dependency-ordered implementation packets, each with one player behavior,
   exact writer reservation, compatibility decision and positive/negative gate.
5. A spoiler-safe report and compact checkpoint naming what was delivered,
   actual checks, remaining world coverage and the next concrete proof.

The initial priority is E01/E03/E05 around C02–C07: coherent composition,
ownership and durable beginning. Then qualify E04/E06/E08 through an actual local
loop. Broader organizations, economies and scale checks follow the selected
behavior's needs, not a speculative framework rewrite.

This GM can review and prepare additive packets in its reserved area. Runtime
implementation needs an assigned slice and exclusive transfer from the live
integrator; no authority over another world's files follows from this role.
New lore, distributions, balance and architecture remain proposals until selected.

## Resume point

Prepared here: three-scale role, seven opening-life considerations, ten future
development affordances, targeted source observations and a finite first brief.
No new chat or worker was launched; no shared source, candidate, private save,
PROJECT decision or existing dispatch owner was changed. Next: a selected
implementation-support GM can route this checklist against the live starts and
world owners before authoring or integrating a concrete slice.
