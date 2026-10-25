# Fresh lives and optional succession

> Codes renamed 2026-10-19 from AR1-AR8 and AU1-AU4 to CCH-AR1-CCH-AR8 and CCH-AU1-CCH-AU4 to avoid collision with registered AR (architecture) and AU (agent usage). Its OM3 and WT2 also repeat in other docs; cite them as CONTINUATION_CHOICE_CONSIDERATION_2026-10-13#OM3 outside this file. See [reserved prefixes](../RULES_INDEX.md#reserved-prefixes-2026-10-19).

Status: design consideration, 2026-10-13. Proposed recommendation, not an accepted default or runtime change.

Weibao asked: "consider if heir shoudnt be the main continueation, but instead maybe another random start?"

Latest accepted direction: [reciprocal return and intentional loops](#reciprocal-return-and-intentional-loop-direction-2026-10-15).
The cheat chat owns runtime execution; source-route descriptions below retain
their dated inspection limits and do not establish current implementation status.

## Current authority and implementation

[PROJECT.md](../../PROJECT.md) records suspenseful random entry, optional Frontier, and heir-only carryover as implementation state rather than a design limit. [User vision](../USER_VISION.md) records that an heir is optional and a life can end without one. [Origin composition](ORIGINS_AND_WORLD_TIMELINES.md) already supports fresh lives, generated families and source-qualified reincarnation. [The heir rule](../RULES_FROM_SCRATCH.md#the-heir) specifies what an heir receives when succession happens; it does not require every next life to be an heir.

Source inspection: `src/chronicle_ui.js` presents the begin-heir action; `src/main.js` handles its saved request; `src/life_experience_host.js` builds a fresh envelope with inherited leftovers and a heir chronicle. This establishes the current code route, not browser verification of continuation or random entry.

## Direction update, 2026-10-15

[OD2](../USER_VISION.md#overarching-direction-discussion-od2-2026-10-15)
accepts memories and the base cheat across lives, with other retention depending
on world/means and capable of improvement. P3 below is historical proposal where
it suggests the continuing self need not retain memories; a separate person's
local knowledge is still distinct. Blanket warnings about stat inheritance do
not forbid earned retention through means. [OD10](../USER_VISION.md#overarching-direction-discussion-od10--q5-2026-10-15)
accepts guided randomness by default, with full random/specific starts as options.
Later [CA1–CA7 answers](#cheat-chat-answers-reconciled-2026-10-15) select ordinary
starter/checkpoint behavior and qualified retention. Other reset/death/property
and succession details still follow their actual means.

## Cheat-chat answers reconciled, 2026-10-15

Accepted direction from [CA1–CA7 original answers](../USER_VISION.md#ca1-original-answer-reconciled-2026-10-15),
folded at [Weibao's request](../USER_VISION.md#direction-review-fold-and-cheat-answer-reconciliation-2026-10-15).
This narrows older “initial access / retention / rewind still open” wording below;
those passages retain their dated discussion history, not competing live defaults.

| Code | Accepted direction or explicit request | Still open / not implied |
| --- | --- | --- |
| CA1 | Initial-arrival replay and fresh-life continuation available from the start; activation before death requested. | Exact suppression/interruption, death fallback and old-body outcome. No universal combat restriction, delay or activation cost. |
| CA2 | Learned mastery carries according to its nature; practical expression requires actual brain/body/faculties and means. | No automatic physical growth, universal power percentage or grant of other cheats. |
| CA3 | Later checkpoint is the first authored upgrade; research/discovery can develop it. Cheat type/carrier and research capabilities matter. | Not a mandatory universal upgrade order; storage and carrying other cheats remain possibilities. |
| CA4–CA5 | Ordinary checkpoint return rewinds current-world history by default, qualified by anchor type/means. Enduring base-cheat upgrades carry. | Revival, body backup and extraction need not rewind. Exact charges/cooldowns, outside-state interactions and other retention need their actual mechanisms. |
| CA6 | External recipient keeps the only exported object by default; duplication can depend on means/upgrades. Distinguish actual temporal copies and provenance. | A later-age version can be the same continuing object; equal names do not establish identity. No omniscient player-facing provenance labels or universal conservation ban. |
| CA7 | Preserve initial-arrival fallback plus one deliberately set replaceable later checkpoint as the ordinary first upgrade; more through means/upgrades. Clear replacement confirmation and preserve old point until setting succeeds. | Not universal safety from every trap/seal. Exact setting conditions remain mechanism-dependent. |

**Derived contract, not a selected schema:** name the affected life/body/history,
actual custody, retained mastery, enduring upgrade versus charges, pending work,
and clocks for a selected transition. Reconcile those affected owners together
through existing durable publication. Memory, physical artifacts and enduring
cheat growth are distinct carriers. Bank restoration is not decided by the
world-rewind default; coordinate its exact ledger treatment with the bank/cheat
owners before implementing that interaction. No new technical gate applies to
unrelated delivered work. Qualified [repeatability](../TIMELINES_AND_DIVERGENCE.md#repeatability-answer-and-research-across-rewinds-2026-10-15)
is answered broadly; exact RNG behavior remains local.

**Proposals remain proposals:** clone/object embodiments, branch preservation,
storage, broader transfer, automatic recovery, and outside consumption/transform
settlement details are not all selected by the answers above. See the exclusive
[cheat discussion](../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md).
These are direction records, not implemented continuation or persistence proof.

## Recommendation

- **P1: Fresh random life as the usual next run.** Select a coherent authored world/era/body/household/situation from eligible starts. Randomness introduces new opportunities and circumstances, rather than merely resetting equipment. The first meaningful actions must support the selected start; infancy or unusual bodies require actual play, not a long forced wait. No promised equal difficulty or safe outcome.
- **P2: Succession as a meaningful available alternative.** Offer an actual child, apprentice or other supported successor when that relationship and access exist. Retain established inheritance semantics and local claims. Family play should be valuable when desired, without making family creation a compulsory preparation for every next run.
- **P3: Separate the next protagonist from what persists.** A fresh protagonist need not reset an enduring world, and need not receive the prior protagonist's property, skills or memories. Same-world aftermath persists only to the extent represented and supported; another era or continuity is explicit. Cross-life gains require their actual carriers. An old life can leave people, records or projects behind that a later stranger might encounter without owning them automatically.

This fits variety across the intended worlds better than mandatory dynasty play. Its main cost is a weaker immediate attachment to one household and the risk of repetitive early chores. Distinct opening situations, shorter repeated introductions and a reachable succession option address that cost. Do not substitute automatic account-wide stat inflation for meaningful differences between lives.

## Implementation boundary

Do not force an ending to create variety: retirement, ordinary survival, recovery, same-life travel, true death and rebirth are separate outcomes. Rebirth or retained memory requires a supported premise. Random entry by itself is not proof of reincarnation.

Before a future implementation: select the eligible start pool and timeline policy; specify probabilities, reroll/fallback and exact retention; preserve the ended life and private saves; freeze selection across save/reload/import; qualify functioning initial interactions. Follow [random-start requirements](../WORLD_COMPLETION_STANDARD.md#random-starting-points-without-spoiling-discovery). Existing heir saves keep their meaning. No runtime edits, build, tests or browser acceptance were performed for this consideration.

## Same-world, timeline and enemy starts: follow-up consideration

Weibao asked about same-world options, time-travel gates, another person in the same timeline, and reincarnating or starting as an enemy. These are requested considerations, not an accepted selection policy. [Origin/timeline owner](ORIGINS_AND_WORLD_TIMELINES.md), [continuity owner](LORE_AND_CONTINUITY.md), [identity catalogue](../RIVALS_IDENTITIES_AND_FATE.md) and [enemy protagonists](../ENEMY_PROTAGONISTS.md) supply existing related design.

**P4: Choosing a perspective does not require an in-world time-travel power.** Selecting an earlier-era campaign or playing another existing person is an author/player start choice. A character moving their body, memories, cargo or effects into the past does need a real world-supported route, system or explicit branch premise. The same distinction applies to another world: a fresh campaign can start there without portal ownership; an existing character carrying themselves there needs a passage. A deliberately available meta mode can supply an outside cause rather than masquerading as ordinary local physics.

| Code | Start/continuation | History and identity consequence |
|---|---|---|
| C1 | Another person, same world and present moment | Shared established consequences stay. The previous character may be alive and independently pursuing supported activities. This is a perspective handoff, not death, inheritance or soul transfer. Switching cannot double-book bodies, duplicate stock or arbitrarily change allegiance. |
| C2 | Another person later in the same history | Prior consequences remain to the supported extent. Time passed must have a declared represented outcome; it is not permission for invented offline growth or loss. Earlier commitments, ages and ownership need reconciliation. |
| C3 | Another person at an earlier checkpoint | Offer a separate branch/replay, preserving the existing history, unless an actual regression/time-travel mechanism changes that history. Decide whether any prior perspective's memories cross. |
| C4 | Similar world, different continuity | A counterpart has its own actual history and holdings. Same face/name does not establish shared experiences, remembered friendship, earned power or ownership. |
| C5 | Soul reborn after death | Actual retained soul/memory faculties and new body are specified. Being born as a baby occurs at a coherent birth date. Becoming an already living adult needs possession/replacement/merger or another supported explanation. |

**P5: Enemy origins should be several mechanically different scenarios.** A hostile actor is a person with their own relationships, knowledge and aims; hostility is not their entire identity.

| Code | Enemy-related option | Subtle consequences |
|---|---|---|
| E1 | Play the existing enemy as themselves | Their own mind, body, trained methods and history remain. The player can choose new behavior, but the character does not automatically learn the former character's secrets. Their family and allies have concrete expectations. |
| E2 | Your soul enters the enemy's body | Determine whether the original occupant survives, resists, shares control or is absent. Body functions, host memories, soul-bound sources and actual control are separate. Contacts may recognize the body while noticing changed habits. Equipment, pacts and offices need actual access/recognition, not a universal transfer. |
| E3 | Reborn as the enemy's child or descendant | A new person can inherit a family feud, stigma, support or expectations without sharing the parent's guilt or skills. The former life's allies may distrust this household without recognizing the reincarnated soul. |
| E4 | Start as the enemy before the feud | Branch from a supported earlier state. Neither enmity nor future crimes are inevitable. Remembered future events are leads conditional on the retained-memory premise; changed causes can invalidate them. |
| E5 | Enemy counterpart in a parallel branch | Similar potential can produce another person with different loyalties. Prior-run recognition is a player observation unless the character has a means to establish it. |

### Small details that make these starts convincing

- **S1: Preserve causality across perspectives.** Starting as an enemy in the same present inherits actual injuries, expenditures and losses from the prior encounter. Do not respawn their unique weapon, erase a defeated condition, or overwrite inconvenient history to make the origin stronger. A dead enemy needs an earlier branch or an actual supported return route.
- **S2: Keep knowledge and recognition specific.** Remembered enemy rumors can be false; host memories can be incomplete; observed habits can expose an impostor without giving witnesses supernatural certainty. Learning the enemy's perspective can reveal new information through actual records, conversations or memories, without presenting all secrets at origin selection.
- **S3: Keep both sides alive as people.** The former character does not automatically become hostile, omniscient or a scripted boss when control moves. Relationships, willingness and objectives follow actual history. A perspective change is not universal authority over all actors or a shortcut around their refusal.
- **S4: Distinguish expertise from execution.** Playing the enemy themselves can retain their real acquired mastery; possessing their body need not transfer it. Bodily capacities may remain, while soul sources, equipment cooperation, fuel and ability to perform a method each have their own rules. Avoid automatic full-power transfer and arbitrary full-power erasure.
- **S5: Make discovery earned.** Recognizing one's old home, finding a prior journal, meeting a former ally or realizing whose body this is can become playable discoveries. A mysterious origin should reveal usable sensations and actions, not spoil the identity or sealed truths in its selection label.

Recommended first authored comparison: a single local incident offers a fresh stranger and an existing rival as two distinct starts in an isolated branch. Compare initial access, goals, known facts and reactions without claiming a general autonomous multi-character simulation. Later runtime work needs exact world-instance/time identity, actor/controller/body/memory ownership, selection stability and compatibility; this document implements none of them.


## Restarts, backups and locally unwinnable situations, 2026-10-15

[Weibao's clarification](../USER_VISION.md#overarching-direction-discussion-od11-and-recovery-refinement-2026-10-15)
allows locally unwinnable/trapped situations and trying elsewhere or restarting,
including within the same life. Forgiving recovery does not promise a winning move
at every point. This supersedes the earlier RC4 implied prohibition in direction
synthesis. This dated discussion preceded [CA1–CA7](#cheat-chat-answers-reconciled-2026-10-15),
which now select ordinary starter/checkpoint defaults; remaining mechanism-specific
backup and fresh-life details remain open.

### Proposed vocabulary: independent axes, not a selected schema

| Axis | Questions to distinguish |
| --- | --- |
| Continuing self/life/body | Same ongoing person with a setback, restored earlier embodiment, a new incarnation, or multiple embodiments? Memories/base cheat persist under accepted OD2; body and other retention follow means. |
| History | Continue the actual changed world, rewind it, fork it, or enter an independently fresh/parallel version? One transition need not do all four. |
| Date | Resume at current time, an earlier anchor, a later era or an independent destination clock? A new life need not begin later in another world's calendar. |
| Retained gains and claims | Which memories, powers, belongings, debts, commitments and counterpart relationships survive through the actual means? No blanket carryover or loss inferred. |
| Concurrency | The same calendar date in two histories differs from operating two lives/bodies concurrently. The user's "at the same time" could refer to either; do not decide by assumption. |

A same-life restart could rebuild the current situation without resetting the
whole world, or restore an earlier state if a time mechanism supports it. A new
life could begin in another history at the same calendar date. Actual concurrent
bodies/lives use the accepted means-based multiple-body possibility, with control
and knowledge-sharing rules still open. These are examples, not chosen mechanics.

Backup candidates: a prepared refuge/extraction route, a return anchor, an external
memory record, a replacement body, a patron's rescue or a loop checkpoint. Distinguish
what triggers a backup, what threat it handles, where it goes, whether it can be
invoked early and what it retains. Reliable backup can be a valuable earned power;
do not invent universal failure/costs or assume every means survives every danger.
Forewarn known gaps at the appropriate discovery level. Save/reload remains a
separate player facility unless a selected cheat makes it part of world history.

Historical pending question, answered later by [CA1–CA7](#cheat-chat-answers-reconciled-2026-10-15): restart/recovery anchors that can support
same-life restoration or a new beginning depending on available means. No answer
yet. No backup system, new record schema, runtime or migration implemented here.


## Improvable anchors and starting access, 2026-10-15

[Answer](../USER_VISION.md#anchors-trade-cheat-correction-and-discussion-workflow-2026-10-15)
accepts means-based anchors, improvability and same-life or different-life
restarts, including at the same calendar date. This answers the previous anchor
question broadly, not its exact implementation or concurrency mechanics.

**ACCOUNT FOR NOW, proposals:** an anchor may improve destination selection,
retained gains, placement/reach, trigger reliability, usable histories, recovery
capacity or cost. Not every improvement needs a numeric tier or finite charge;
strong/reliable/cheap anchors remain possible. A world's actual source rules may
support narrower or different capabilities. A return address, stored body and
historical checkpoint are not automatically the same means.

Roguelike elements can include life-specific opportunities/builds plus persistent
memories, access, discovered starts and upgraded recovery. Not everything must be
earned from nothing. Proposed default: the base cheat supplies a modest initial
continuation option; exact anchors, precise date/body choice, retained power and
broader access expand through play or selected starting advantages. Other modes
can start differently. This starting-access default is still awaiting an answer.

Before a chosen restart, explain known destination/life/history/date/retention and
actual consequences without revealing sealed unknowns. Whether an old life stays
behind, rewinds or coexists follows the selected means; no automatic deletion or
copying. Ordinary save/reload is a separate player facility. Next question:
what the base cheat grants initially versus what must be earned/unlocked.

A separate cheat-access/design chat could translate chosen rules into a bounded
first implementation brief after inspecting existing code/owners. It should not
start by implementing the entire cheat library or settle gameplay on its own.
This was a recommendation at the time; the cheat chat was subsequently launched
and its settled answers are [reconciled above](#cheat-chat-answers-reconciled-2026-10-15).
No runtime work is dispatched by this paragraph.


## Starting continuation answer and research routes, 2026-10-15

[Accepted answer](../USER_VISION.md#starting-continuation-research-and-cheat-design-dispatch-2026-10-15):
modest continuation by default; better anchors and carryover earned through play
or available through special starts. Research can improve them. The earlier
starting-access proposal is now accepted at this broad level; its numeric terms,
initial recovery/destination and upgrade behavior were open at that point.
The [CA1–CA7 update](#cheat-chat-answers-reconciled-2026-10-15) now answers ordinary
starter/first-upgrade behavior; the fresh-life embodiment/history profile still
needs a selected consequence model.

**ACCOUNT FOR NOW, proposed implications:** research might explain an existing
anchor, discover where it can reach, improve retention or enable constructing a
new recovery means. Discovering a method, understanding it, obtaining prerequisites
and actually modifying an anchor are distinct where the world makes them so.
Research need not always be a timed bar or a prerequisite: use, practice, insight,
teachers, crafting, bargains or compatible powers may offer different routes.
Special starts can supply advanced means without replaying the ordinary unlock
path; knowledge of hidden possibilities remains governed by discovery.

Known improvements should have an observable effect, such as a wider choice of
restart dates or a retained faculty; not every improvement needs another currency.
No mandatory sacrifice, universal charges, automatic reset on improvement or
future-counter mechanism is selected. Cheat access/design chat is authorized to
explore concrete starter and upgrade behavior in its exclusive record; no runtime
source/build/save changes assigned by this discussion.


## Soul-bound benefits, burdens and continuation, 2026-10-15

[Accepted direction](../USER_VISION.md#remembered-goals-cross-run-plans-and-soul-bound-duties-2026-10-15):
soul contracts/cheats can carry obligations across lives; retained soul-related
features can be beneficial or harmful. World/history/means decide actual scope.
No particular contract, secret soul truth or universal cleansing rule selected.

### ACCOUNT FOR NOW: proposed binding distinctions

- **SC1, actual holder:** distinguish a person's promise, a legal/institutional
  claim, a body condition, a soul mark, an external patron bond and a cheat's own
  state. Their continuity can differ. Name what death, body replacement, crossing,
  a fresh branch or a restart actually changes under that means.
- **SC2, scope and enforcement:** a remembered promise, a creditor's knowledge,
  local recognition and a supernatural enforcement power are different. State
  which participants/history/law/source it reaches. The same date in another
  history need not transfer a claim; a cross-history power may genuinely do so.
  No automatic inheritance into every counterpart or descendant inferred.
- **SC3, benefits and burdens:** a bond can preserve protection, access, knowledge,
  duties, restrictions or harm. Do not mechanically make every blessing secretly
  cursed or turn every burden into an automatic advantage. Whether benefits and
  obligations can be separated, discharged or transferred follows selected rules.
- **SC4, legibility without omniscience:** known carryover should identify the
  binding, reason it persists and relevant consequences rather than show a vague
  unexplained penalty. Unknown status/terms can remain uncertain under discovery;
  a talking cheat's report may be incomplete or deceptive. Inspection, appraisal,
  contract reading and suitable protection can improve what is known. Do not
  expose a sealed clause just to make a preview exhaustive.
- **SC5, recovery possibilities:** fulfilling, renegotiating, contesting, suppressing,
  breaking, transferring or cleansing a bond are possible routes through actual
  means; none guaranteed universally. Leaving a world, choosing a new body or
  restoring a life is not automatically a loophole or automatically useless.
  Avoid silently inventing a new binding just to block every escape.

Restart previews must distinguish known facts, actor claims and uncertainty;
ordinary player comfort/save facilities remain distinct from fictional contracts.
A harmful bond can create meaningful trouble and affect plans without every new
life becoming the same unavoidable chore. Exact baseline protection, irreversible
consequences, detection and available recovery choices remain open. Forgiving
recovery and forewarned harsher modes retain their standing direction.

**Baseline accepted later 2026-10-15:** bindings carry according to their rules
and available means, with warnings for known consequences. Research/cheats may
detect, remove or change them where supported. No universal auto-cleanse or
inability to escape is selected. Safer-mode exact protection remains an option,
not a chosen implementation. See the [answer](../USER_VISION.md#binding-remedies-and-exchange-cheat-interactions-2026-10-15).
No runtime carryover/contract migration, implementation test or new dispatch.


### Binding-conversion clarification, 2026-10-15

An exchange cheat may turn a bond into a roll, resource or other benefit if its
actual means support that target/effect. The [cheat-cosmology note](../CHEAT_COSMOLOGY.md#exchange-cheats-and-binding-conversion-consideration-2026-10-15)
records proposed distinctions; a visible mark, supernatural enforcement, local
claim and relationship history need not be the same subject. Removing one need
not remove them all, while a truly stronger power may do so. No secret contract
truth, guaranteed remedy, universal legal rule or new power selected here.

## Quiet faculty, finite brief and remaining fresh-life question, 2026-10-15

[CA13 accepted answer](../USER_VISION.md#ca13-original-answer-reconciled-2026-10-15):
quiet personal faculty/connection by default; systems/voices may come through
suitable means or accompanying cheats without making the base faculty speak.
Exact origin/ontology remains unselected. The existing
[bounded brief](../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md#bounded-implementation-brief-quiet-continuation-and-one-learned-checkpoint)
collects settled mechanics and proposed implementation details. Its capable-human
Frontier demonstration is a proposed test scope, not replacement of guided random
entry or an extra vanilla prerequisite. No runtime implementation authorized.

**Q1 answered later in this discussion:** separate history by default, former
life/history paused, return through actual means. Same-world rebirth or an active
former body can depend on cheats/means. The [answer and implications](#fresh-life-answer-and-transition-implications-2026-10-15)
now control; the preceding proposed profile is preserved as dated history in the
[core audit](../OVERARCHING_DESIGN_CORE_AUDIT_2026-10-15.md#fresh-life-answer-and-prior-question-history-2026-10-15).
Exact start/date/body and implementation bindings still follow guided entry and
supported means. Do not ask again whether fresh life leaves a paused history.

Q2 activation now has a [worked profile](#activation-recovery-profile-and-fresh-life-return-walkthrough-2026-10-15);
CA14 unconscious-body choice access is accepted subject to means/suppression. Q3 engineering/legacy/tuning details need slice evidence rather than a
poll. Q4 Paradise/external authority, cargo, storage, copies and branch interactions
remain later per-means profiles; do not gate the one-world proposal on all of them.

## Fresh-life answer and transition implications, 2026-10-15

**Accepted Q1:** [original answer](../USER_VISION.md#voluntary-fresh-life-history-and-paused-former-life-2026-10-15).
Ordinary voluntary fresh-life continuation uses a separate history. The former
life/history pauses, with return depending on actual means. Same-world rebirth
or an active former body may be enabled by suitable cheats/means. These are
supported alternatives, not a new compulsory reincarnation system or concurrent
actor simulation. Accepted guided entry, continuing-self memory/base-cheat growth,
means-dependent mastery expression and local world rules still apply.

### Derived constraints: what the accepted answer requires

| Code | Consequence | Player-visible reason |
| --- | --- | --- |
| FL1 | Distinguish continuing self, embodied life, world definition and history/instance. Reuse a world's content definitions without aliasing mutable people, stock, claims or relationships between histories. | A fresh version cannot silently inherit the old world's completed job, marriage, stock or local recognition. Actual transferred knowledge/objects follow their means. |
| FL2 | Preserve the paused life/history at its actual departure boundary. Returning is distinct from rewinding that life to a checkpoint. | Resume preserves its real consequences; ordinary checkpoint return restores the scope selected by that temporal mechanism. A fresh life does not silently rewind the previous one. |
| FL3 | Paused does not imply already accessible. Validate the chosen route/anchor/capability before offering an executable return. | A known former life may be remembered without an unlocked route back. Do not promise unrestricted life switching merely because data is retained. |
| FL4 | Same-world rebirth and active former bodies require explicit identity, occupancy, knowledge, custody and clock rules supplied by their actual means. | A counterpart, a descendant, a new embodiment and the same continuing person are different. An autonomous former body does not appear because a snapshot exists. |
| FL5 | Historical memory and current local knowledge/relationships remain distinct. | Remembering a teacher or obligation in one history does not cause that person in another history to recognize you. Actual cross-history powers/contracts may differ. |

### Implementation challenges and proposed ordinary contracts

**PFL1, switch as one coherent transaction:** stage the new embodied start, affected
native owners and the exact old-life pause together. Publish only after validated
durable storage; failure keeps the old life usable and grants no partial start,
stock or journey reward. Use a transition/sequence identity to prevent duplicate
application. Do not implement this by copying only the character object while
leaving old quests, equipment, jobs or clocks bound to shared globals.

**PFL2, preserve enough to resume:** map current location, body/stats, equipment,
inventory/custody, local people/events/claims, pending work/choices, RNG context,
knowledge, clocks and content revisions wherever the selected slice owns them.
Existing instance IDs and summaries are useful seams, not proof of complete native
history archival. Preserve exact supported state rather than regenerate a played
past from seed/prose. No personal saves are touched for a prototype.

**PFL3, single continuing journey:** ordinary switching should pause the departing
life and resume/start only the selected one; current memories/usable mastery and
enduring base-cheat growth follow their accepted carriers, without cloning journey
bank balances or silently refilling charges. Later reciprocal-return acceptance
selects ordinary A/B switch symmetry through its actual means; it does not settle
every destination/body return mechanism.
Bank rewind/restoration semantics remain distinct and need their selected profile.

**PFL4, storage and compatibility:** separate immutable definitions from per-history
mutable state; avoid recursively nesting complete saves/checkpoints inside one
another. Measure actual supported-history storage and load cost. Do not invent
an accepted history cap, expiry, deletion policy or compression loss. Schema/content
revision and legacy adoption need a written compatibility choice before runtime
work, preserving unsupported records and honest unavailable/resume status.

### Representation implications, not a selected new UI

**PFL5, proposed surface/home:** an on-demand continuation center view reached from
the existing quiet-faculty/character reference home, using shared navigation/back
bar/Esc and keeping the log intact under [UI rules](../UI_RULES.md). Target a populated
1366×768 desktop save. Visible outcome: distinguish current life, paused known
history, proposed new guided life and known route/access status. Show the selected
world/version/date/body and known carryover when actually known. Unknown histories,
sealed causes and undiscovered routes stay concealed. Represent paused history as
resume state, not a dead person or a generic “completed run.”

Use readable known labels plus a stable internal identity, rather than expose raw
IDs or rely on identical character/world names. Returning to a paused life,
rewinding it and starting a fresh version are separate actions even if they share
a selector. Explain why a known return is unavailable through known means. An
archive entry must not promise playable resume when only a chronicle survives.
Numeric history limits, visual style, maps/portraits, concurrent-body dashboards,
mobile and Paradise/external-system integration remain deferred/separately owned.
This is design consideration only; the representation chat's record stays untouched.

### What to resolve next without another long interview

Q1 broad direction is answered. Exact guided start/date/body are authored from
eligible coherent starts under the accepted entry policy, not another universal
numeric preference. The brief's Q2 can receive a concrete proposed starter profile:
player-directed invocation need not require physical movement; ordinary native
unconsciousness recovery remains available; true-death continuation, if implemented,
pauses for a choice rather than silently selecting rewind/new life. Real suppression
or automatic rescue needs an actual authored means. This is a recommended profile,
not an accepted consciousness/death guarantee or implementation claim.

The [worked profile below](#activation-recovery-profile-and-fresh-life-return-walkthrough-2026-10-15)
now supplies the proposed new-life → paused-history → supported-return walkthrough
and affected-owner map. Current source and rebuilt behavior remain distinct evidence.
Activation edge cases, bank interactions and legacy adoption should be made
concrete in the existing brief; ask only if a remaining choice materially changes
retention, involuntary loss, control or recovery. No new brief execution, framework,
source change, agent dispatch, message or commit authorized by saving this answer.

## Activation recovery profile and fresh-life return walkthrough, 2026-10-15

[Requested work](../USER_VISION.md#activation-recovery-and-fresh-life-walkthrough-request-2026-10-15).
This is a worked design proposal, not runtime implementation or a demonstrated
play path. Accepted answers above constrain it. AR/PFL/WT recommendations below
resolve ordinary authoring details for review without pretending Weibao explicitly
accepted each one. The exclusive [cheat brief](../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md#bounded-implementation-brief-quiet-continuation-and-one-learned-checkpoint)
remains its writer's record; use this canonical profile for the later fresh-life
answer and current cross-owner implications. No new execution packet or dispatch.

### CCH-AR1–CCH-AR8: recommended ordinary activation and recovery contract

| Code | Situation | Proposed resolution / boundary |
| --- | --- | --- |
| CCH-AR1 | Awake and able to invoke the quiet faculty | Deliberately open known continuation choices. Ordinary invocation needs no hand gesture, item use or bodily movement; this is a recommended starter capability, not universal immunity to suppression. Merely opening/inspecting a choice spends nothing, draws no new start and changes no history. |
| CCH-AR2 | In work, travel, combat or another committed routine | Commit only at a coherent simulation boundary. Already landed effects, elapsed time and settled costs remain real. Pause preserved source work at departure; do not falsely mark it completed/refunded. Destination does not inherit its live callbacks. An actual authored channel time/cost/interruption remains possible for another means. |
| CCH-AR3 | Bodily restraint but still aware | Lack of movement alone need not block a personal faculty. A real seal or other mechanism can block it according to actual authority; a generic location/danger tag is not itself a universal ban. Known restrictions should be explained; unknown restrictions must not be fabricated after the player chooses. |
| CCH-AR4 | Body unconscious / incapacitated | **CA14 now accepted:** return choice remains accessible, depending on actual means and suppression. It does not grant ordinary research/actions, automatically relocate or bypass every seal. Separate an unconscious body, suppressed faculty/volition and absent human player. Native recovery remains distinct. |
| CCH-AR5 | Native defeat / unconscious recovery | Keep native unconsciousness and its recovery effects distinct from death. Continuation is an optional additional route only when its actual access allows it. Opening a recovery view does not award revival, heal the paused body or erase defeat costs. |
| CCH-AR6 | A supported actual death/life end | Where the continuing faculty survives and reaches an eligible destination, stop at the saved cause and offer continuation choices. Do not silently select the newest anchor, resume a fatal queued command or invent a corpse-resume resurrection. Ordinary resume requires a valid resumable embodiment; rewind/resurrection/replacement need their actual means. Proposed default is a choice stop, not a new mortality system. |
| CCH-AR7 | Important pending choice, offline return or bank spending | Preserve its boundary and unused eligible time under existing pause/bank rules. No automatic fresh life, commitment or bank spend across a transition. Player selects the next supported routine. The bank follows the journey once; an old-life record is not another bank balance. |
| CCH-AR8 | Read-only tab, stale sequence, failed storage or incompatible destination | Explain the actual technical blocker through ordinary recovery UI, not invented cheat lore. Inspection/export of preserved data remains available where supported. Publish no partial switch, cost, start draw or success message. Retry revalidates ownership/conditions and the same prepared result; it must not mint another life or new roll. |

**Invocation and settlement:** the proposed ordinary faculty has no invented
activation fee, cooldown, forced death or combat lock merely to make the profile
look balanced. Actual consumption/cooldowns for a selected means still settle by
its own rules. Confirmation is useful for the consequential transition itself,
not for every navigation click. A cancelled preview returns to the current life;
it is not automatically a free temporal stasis power. A short decision pause is
an interaction policy, not an in-world ability to train or produce while frozen.
The exact online pause/resume boundary is a later implementation contract.

**Simultaneous causes:** do not grant a reaction window after an irreversible
committed death unless the actual ability provides one. Order an invocation
against damage/deadlines using the simulation's declared event order, not render
speed or which button callback wins. This technical ordering must respect the
selected ability's actual reach; no unearned “return always wins” rule.

### WT1–WT6: paper walkthrough, two histories of one realm

Illustrative capable-human starts in two histories of the same existing world;
not a second realm, second prestige layer, compulsory Frontier opening or selected
numeric pacing. “A” and “B” are author labels; player-facing names depend on known
context. Later [reciprocal-return acceptance](#reciprocal-return-and-intentional-loop-direction-2026-10-15)
selects the ordinary fresh-life method's specific connection back to its living
paused departure life, depending on actual means. WT5 is now in the selected slice;
do not leave it open merely because archives do not generally grant access. No
extra mandatory research upgrade is silently added. A particular blocked/inoperative
route still fails honestly; this is not unrestricted history travel.

| Step | Player action / visible outcome | Actual state and continuity |
| --- | --- | --- |
| WT1 | In life A, learn a method, earn a wage, own tools, and deliberately start a job. Consult continuation. | A owns its body, wage, tools, local people/recognition, job and calendar. Journey carries supported memory/mastery/base-cheat growth. Inspection neither completes the job nor prepares another random draw. |
| WT2 | Select a guided fresh-life option. Review known world/start/body/date, carryover and the fact that A pauses. Cancel first, then choose to proceed. | Cancellation preserves A. Commit records the chosen start/profile/revision and actual generated result once. A's departure state and new B are published together. Reopening/loading does not reroll that committed start. Genuine rerolls need their actual access. |
| WT3 | Arrive in a distinct life B/history B. Remember the learned method, with practical use depending on B's body/tools/means. | B uses its authored initial stock and relationships, not A's wage, tools, job credit or local recognition. A/history A is paused at departure, including ordinary deadlines/production. Journey memory and enduring base-cheat growth persist; unsupported bodily power is not copied. |
| WT4 | Work and learn in B, then inspect A through the accepted method's known reciprocal connection. Show actual route availability or known blocker. | B's calendar advances under its world rules; A has not silently aged, completed its job or accumulated unattended output. Local calendars need not share a date. Remembering A does not itself open a route. |
| WT5 | Use the ordinary method's accepted reciprocal route to deliberately resume A when operative. Preview its known effects and commit. | Accepted ordinary reciprocal profile: pause B and restore A's departure embodiment/history, retaining current journey memory/usable learning/base-cheat development under actual means. Do not apply A's older journey balance/upgrade snapshot over the current journey. A's local possessions and conditions resume; no automatic healing or imported B equipment. This accepted route profile does not decide every possible travel mechanism. |
| WT6 | Back in A, inspect the paused job and choose to resume, cancel by its own rules, or do something else. Compare a separate checkpoint-return option if available. | Old UI/timer callbacks cannot fire again on load. Resume continues from the departure boundary; checkpoint rewind would restore its earlier scope. B stays preserved/paused under the selected ordinary reciprocal profile. No automatic reenactment of wages, upgrade grants, death counts or spent inputs. |

**What the trace deliberately does not promise:** ordinary cross-history travel
with B's physical body/cargo, automatic mind merge, independent A/B agents,
resurrection, permanent unlocked switching, all-world compatibility or cloning
an exported artifact. Same-world rebirth, external institutions and active former
bodies use their actual means. A living supported paused body is not a deceased
body, an autonomous person elsewhere or a chronicle-only archive.

### OM1–OM7: affected-owner map and current-source limits

Read-only source observations for this profile. No build, test, browser journey,
private save or persistence experiment was run. Existing proofs remain with their
wave owners; named seams are reuse candidates, not an implemented whole-life switch.

| Code | Existing owner / inspected seam | Selected slice must account for |
| --- | --- | --- |
| OM1 | [Identity owner](PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md#embodiment-and-return-profile-reconciliation-2026-10-15); [world_instances.js](../../src/world_instances.js), `createWorldInstance`, `createWorldVisit` | Continuing self, embodied life/body and history IDs; definition/revision and actual traveler binding. Instance construction creates local state and IDs; it does not itself archive/rebind every native owner or grant a return route. |
| OM2 | [main.js](../../src/main.js), `persistExpansion`; [native_authority.js](../../src/absorb_p23/save_time_options/native_authority.js) | Native/body/inventory/equipment/world publication, existing writer lock and async mutation freeze. Native authority explicitly relies on its host to stop gameplay timers; a new helper cannot assume it controls them. Integrate through current durable ownership rather than a competing slot. |
| OM3 | [save_files.js](../../src/save_files.js), `importSaveFile`; [world timeline contracts](../TIMELINES_AND_DIVERGENCE.md#implementation-planning-starts-histories-and-parallel-worlds-2026-10-11) | Validated/preflighted destination and exact recoverable source state; content revision, quota and unsupported records. A history must contain enough real state to resume, not only a seed or life-log summary. |
| OM4 | [life_experience_host.js](../../src/life_experience_host.js), `buildLifeHeirSave` | Existing heir builder requires an ended life and applies heir leftovers/chronicle/calendar and local-data rules. It is not a neutral fresh-history constructor. Do not inherit its death, household, date, memorial or property assumptions for WT2. |
| OM5 | [structured_life_runtime.js](../../src/structured_life_runtime.js), `archiveStructuredLife`, `publishIndependentStructuredLife` | Existing scoped ended-life archive and independent destination path requires supported death proof and retained immutable archive. Reuse validated publication concepts, but do not equate an ended archive with a living paused life or claim it implements WT5. |
| OM6 | [expansion_engine.js](../../src/expansion_engine.js), `checkpointScenario`, `previewScenarioRewind`, `rewindScenario`; [qualified repeatability](../TIMELINES_AND_DIVERGENCE.md#repeatability-answer-and-research-across-rewinds-2026-10-15) | Scenario-local rewind is a distinct transition. Extend only actual affected owners under the selected history scope. Preserve committed outcomes on ordinary reload; exact temporal random context remains mechanism-specific. |
| OM7 | [Bank owner](../DIRECTION_SYNTHESIS.md#time-bank-continuity-and-improvement-answer-2026-10-15), [knowledge separation](../SHARED_FOUNDATIONS_AUDIT_2026-10-12.md#od8-accepted-direction-and-implications-2026-10-15), [UI rules](../UI_RULES.md) | One journey bank and enduring progress across ordinary switches; local knowledge/custody and known projections; UI preferences separate from gameplay state. A/B snapshots must not each mint a journey balance or overwrite current comfort settings. Rewind/bank policy still needs its selected contract. |

**Implementation challenge:** current native state has many affected owners. A
map must include the chosen slice's quests, named actors, inventory/equipment,
body/effects, active work, clock, RNG, local records and optional content rather
than assume one expansion object is the complete life. Invalid source/destination
bindings must fail before publication. Preflight must not enroll, grant knowledge
or let observers mutate live gameplay. On restoration, recalculate derived values
without re-awarding earned ones. Measure storage/load cost before history limits;
no cap, expiry, silent pruning or recursive snapshot policy is accepted here.

**Compatibility proposal:** first demonstrate on disposable new games and retained
fixtures. Legacy adoption is explicit: do not invent a historical initial-arrival
snapshot for a previously played save. A new baseline must say what it represents.
Missing/incompatible content preserves the archived bytes and accurately disables
resume until a compatible route/build is available, rather than regenerate a
replacement life. A technical storage error is not an in-world suppression power.

### Representation and discoverability challenges

Proposed surface/home stays PFL5: continuation threshold center view reached from
the existing quiet-faculty/character reference home, under shared controller/back
bar/Esc and [UI rules](../UI_RULES.md). Target 1366×768 populated desktop; keep the
log/current status readable. No mobile, new art style, visual system or concurrent
body dashboard is selected. Representation chat retains its exclusive record.

| Information | Proposed visible distinction |
| --- | --- |
| Current and prior lives | Known life/world/context, local date and state: current, paused/resumable, ended, or record-only. Readable disambiguation rather than raw IDs or identical names. These are permitted player-side state labels, not proof of an omniscient in-world narrator. |
| Transition type | “Start a fresh life,” “Resume [known life],” and “Return to [known checkpoint]” have distinct consequences. Browser Back/cancel only navigates; it never means travel to another history. |
| Access | Remembered destination versus currently executable route. Show a known blocker or uncertainty; do not expose an undiscovered route/upgrade tree or a sealed reason to fill the panel. |
| Carryover | A concise known “stays with this life / follows your journey / transferred by this means” summary. Do not call carried memory usable mastery where B lacks the body/tools. |
| Work / recoverability | Show the old life pauses and the chosen supported return boundary. Do not offer a replayable success-looking Resume button for an ended/record-only/incompatible state. Keep technical export/recovery accessible independently of fictional knowledge. |

This profile needs a readable path to known paused lives once relevant; it does
not require a huge empty multiverse list on the opening screen. UI navigation
history is not history ownership, and sharing a panel must not merge their data.

### Further considerations, bounded to the trace

**FC1, outside the pause:** a supported cross-history contract, external institution
or independently advancing realm may retain its own state. Do not grant total
frozen-world immunity outside the selected pause domain. Those interactions need
an authored profile when selected; Paradise integration is deferred, not a gate.

**FC2, restart and bank interactions:** ordinary switching uses current journey
state once. A local rewind that preserves journey gains must explicitly declare
which charges/time credits, exported goods and pending duties it restores. Do not
silently solve those external-state questions by replacing all saves wholesale.
No global anti-loop rule, free duplicate grant or numeric exploit cap selected.

**FC3, return into danger:** resuming the paused life does not improve its actual
situation. Show known danger and offer the available alternatives; do not auto-
resume queued combat/work. Initial fallback is retained under its actual rules,
not a promise that every seal or outside claim is defeated. Avoid a UI loop that
repeatedly selects the same fatal point without player choice.

### Choice status, automatic recovery defaults and next evidence

**CA14 answered during this pass:** [original answer](../USER_VISION.md#unconscious-return-access-and-automatic-recovery-consideration-2026-10-15).
Return choice remains accessible while the body is unconscious, depending on actual
means and suppression. Do not re-ask it. Access to a choice, automatic presentation
of that choice and automatic relocation are different capabilities. The new
answer does not make the rest of this profile directly user-accepted.

| Code | Recommended automatic-handling detail | Limit / consequence |
| --- | --- | --- |
| CCH-AU1 | At a real supported terminal-body event, present/preserve the continuing-self choice if the faculty survives and has an operative destination. | No reaction-time test or app-close default. This is a proposed faculty capability, not bodily resurrection or proof of native true-death integration. |
| CCH-AU2 | Actual automatic relocation uses an explicit optional standing instruction: trigger, destination/profile and any chosen fallback order. | No silently selected newest/safest anchor. A fully specified fresh-life profile may use supported preauthorized guided randomness; unresolved required choices pause instead. |
| CCH-AU3 | Suppressed faculty/volition, unconscious body and absent human are distinct. An automatic mechanism works only if its actual means survive/reach the condition. | No checkbox immunity to every seal. With no operative route, preserve the real blocked state and player save/reload; do not fabricate extraction or erase the life. |
| CCH-AU4 | One event/attempt commits one recovery. Clear stale callbacks; ordinary arrival pauses unless an explicit chosen repeat policy authorizes the next supported cycle. | No unchosen fatal routine, recursive failed fallback, duplicated charge/reward or repeated retry on load. Intentional loops are accepted; a new selected cycle is distinct from another processing of the same event. |

These AU rules and cheat-record RD16–RD21 are **implementer recommendations**,
not acceptance of a universal auto-return, default destination or every rescue
variant. First ordinary proposal keeps native defeat recovery plus optional manual
return; multiple rescue powers need explicit actual trigger ordering when selected.
External costs/claims remain outside a rewind if their actual scope is outside it.

No additional broad preference question is ready. Concrete start/date/body,
mastery mapping, snapshot coverage, RNG context and legacy adoption now need an
implementation/compatibility proposal and evidence. The separate-history/paused
old-life answer controls the cheat brief's still-broad Q1 wording. Unknowns about
a named suppressor or Paradise authority stay later per-means cases, not global
gates for the ordinary slice. This profile authorizes no runtime work or dispatch.

Future proof, if implementation is authorized: exercise WT1–WT6 from disposable
fresh starts, including cancel, blocked return, successful resume, changed mastery,
paused clocks/job and actual save/reload/file import. Compare exact owned state,
exercise stale/double submission and failed storage, and verify no grant/reroll on
inspection/load. Add actual incapacitated-choice access, saved pending choice,
optional standing-trigger integrity and paused arrival within selected scope.
Inspect whether a real native terminal-body event exists for this slice before
claiming death-return integration; keep unsupported true death unverified/deferred
without dropping the accepted voluntary/incapacitated return capability. Rebuild
and show the three distinct actions at 1366×768 before claiming UI behavior.
Human feel remains separate. These are proposed future checks, not results here.

### Documentation verification for this profile

Checked the current request and two newly reconciled cheat-chat answers verbatim,
38 newly added local file/heading references, added formatting, the single PROJECT
Accepted decisions heading and seven pre-edit owner snapshots. The added profile
self-link also resolves. Source seams were inspected read-only; no tests/build,
served-byte/browser/save proof, personal saves, messages, workers or commits.
The paper walkthrough and future proof checklist do not establish gameplay.

## Concrete state coverage and compatibility plan, 2026-10-15

The requested [source-inspected plan](../gm/CONTINUATION_STATE_COVERAGE_AND_COMPATIBILITY_2026-10-15.md)
now expands OM1–OM7 without implementing them. C1–C19 classify 83 direct native
serializer field names plus conditional adapter/dormant/browser domains. P1–P7
resolve routine topology/switch/mastery proposals; K1–K9 specify compatibility and
failure handling; B1–B5 identify actual implementation/evidence blockers. Current
native fresh-game and loader preflight are reuse seams, not missing tools.

Material gaps: multi-life/journey authority, meaningful mastery projection,
occupied/incapacitated quiescence plus suspended reconstruction, complete owner
coverage and measured storage/legacy compatibility. The existing Undo recovery
wrapper requires a free body and cannot be applied unchanged to this slice.
These are engineering work, not an invitation to another global preference interview.
No runtime edits, schema adoption, build/test/browser/save proof or dispatch occurred.

## Reciprocal return and intentional loop direction, 2026-10-15

[Original answers and implementation assignment](../USER_VISION.md#intentional-loops-and-reciprocal-return-reconciled-2026-10-15).
**Accepted:** ordinary reciprocal connection by default depending on means, using
the CP2 MC1 profile: a fresh life has a specific connection to its living paused
departure embodiment/history. Returning pauses B and resumes A at departure with
current journey memory/usable mastery/base-cheat development. Reciprocal access
is now selected for the bounded slice; preservation alone remains insufficient for
unrelated archives. Exact reach/suppression and other transition types follow their
actual means. No automatic resurrection, forward travel or autonomous old body.

**Accepted D27:** intentional repeat loops may be a player choice/option. Preserve
genuine entrapment where actual means produce it. Do not implement a universal
ban on repeat attempts in the name of safety/idempotency. Duplicate event handling,
stale callbacks and unintended retry loops remain implementation failures.

### RL1–RL5: derived constraints and proposed execution defaults

| Code | Classification | Resolution and consequence |
| --- | --- | --- |
| RL1 | Derived boundary | Ordinary reciprocal access is scoped to the method's supported A/B connection. Known connection, currently operative route and merely retained history are distinct. No new mandatory return-access research is invented to postpone WT5/WT6. |
| RL2 | Proposed ordinary default | Looping is initially off. A deliberate policy names an operative trigger/destination, whether to repeat a supported routine, and optional stop/fallback conditions. The accepted option does not imply every routine/cheat or every offline mode supports it. Exact pacing/UI values can be resolved by its executor. |
| RL3 | Derived processing distinction | A newly authorized cycle needs its own attempt/transition identity; a retry of the same command keeps its identity and settles once. The same in-world timestamp/event after rewind can be encountered in another real attempt. Do not globally deduplicate all cycles together or treat reload/retry as another earned cycle. |
| RL4 | Proposed stop/arrival contract | Ordinary arrival pauses. A selected repeat policy may deliberately start its next supported cycle, with fresh validation and cleared stale callbacks. A responsive stop control cancels further automation at the owned boundary, retaining committed outcomes. It does not promise in-world escape, healing, rewind cancellation or removal of a curse/contract. |
| RL5 | Derived world/knowledge boundary | Scope governs costs, stock, charges, bank credits, outside claims, memories and RNG. Repeating a draw can legitimately repeat an outcome; actual changed means/skill/luck can alter it. No automatic fresh randomness, body cloning, time-free production, outside-debt erasure or universal diminishing-return cap. Known danger is shown without an omniscient safest-target selector. |

A bounded scheduler should yield and honor stop even for an intentionally endless
strategy; host responsiveness is not a fictional loop limit or an escape power.
Offline repetition needs its actual supported clock/decision/resource policy and
summary, rather than inheriting authorization from a foreground toggle. Unknown
or changed requirements stop/present choices under existing rules. A fully specified
standing policy may act through supported means; total suppression is not defeated
by a setting. Do not introduce hostile suppression just to make the specimen harder.

**Implementation owner:** cheat chat `01a13e1b-6f99-79a2-8172-b0b5940e78a6` owns
CP1–CP7 runtime execution and actual file reservations. This chat owns canonical
reconciliation only. Link the [exclusive execution plan](../gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md#concrete-implementation-plan-against-live-source-and-ownership)
rather than duplicate it. The [coverage plan](../gm/CONTINUATION_STATE_COVERAGE_AND_COMPATIBILITY_2026-10-15.md)
remains a dated source/proposal input, not proof of current code or authority to
edit the requester's files. No worker/message/source/save action dispatched here.

**What still needs Weibao:** no new consequential preference is ready now. MC1
reciprocal access is answered; MC2/MC3 expose its actual terms and deliberate-loop
control rather than demand another global interview. Nested coverage, mastery,
quiescence, schema, save/import and UI behavior need engineering and proof. Bring
back a concrete decision only if measured limits require lossy archival/history
caps, altered retained gains, a new incompatible persistence commitment, forced
loss, different control/recovery or a genuinely unresolved world interaction.
Do not silently solve those consequences by pruning, blanket XP carry or adding
extra realms/features. Those conditional decisions are not current blockers for
this documentation reconciliation or new required milestone scope.

### Reciprocal/loop documentation verification

Checked 21 added local file/heading references, three exact human quotes and nine
pre-edit owner snapshots. The reciprocal answer was independently retrieved from
its human user turn in the implementation chat; the intentional-loop quote matches
that chat's saved record. Accepted capabilities and RL/CP/RD recommendations remain
distinct. No source/runtime test, build, save migration, personal-save operation,
worker/message dispatch, commit or exclusive-discussion-record edit by this chat.
This reconciliation does not establish the implementation chat's progress or proof.

## Loops as idle automation, pointer (2026-10-18)

Proposals LP1-LP12 (knowledge-carry loops feeding automation, personal loop by
default with world loops by world law, the one prestige layer as an automation
layer, record-and-replay plans from subject verbs) live in
[Around you round 7](../AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md#round-7-2026-10-18-loops-and-starting-over-as-idle-automation).
They keep D27 and the RL2 off-by-default proposal; nothing here is accepted.

## You Are Summoned source evidence, 2026-10-25 (source row, proposal)

Weibao asked for this source row on 2026-10-25 after the
[You Are Summoned round](world-core-kit-2026-10-14/cards/you-are-summoned.md) (full read of Books 1-5,
private synthesis in `docs/research/novels/you-are-summoned/`). It is dated source evidence for how one
fiction runs crossings. It is not accepted design and changes no D27, MC1 or RL row above.

| Code | What the source shows | Bearing on this owner |
|---|---|---|
| YAS-C1 | A home room between worlds repairs the body after each job and is where new skills are committed before they carry | A concrete model of a between-worlds commit point for carryover decisions (AD11) |
| YAS-C2 | Return lands near the same time and place; extreme differentials are rare; linked summonings track home more closely | Supports reciprocal return near the departure moment (MC1, AD12) and gives a world dial for clock drift |
| YAS-C3 | Three clocks per crossing: away-time, world time, days between jobs | A way to state transition time without paradox questions |
| YAS-C4 | Carryover by kind: System-held growth always, physical goods if withdrawn, mana only if shielded, scrolls fail at home, minions stay | A carrier table by item kind and medium (AD11) |
| YAS-C5 | Deaths on jobs end the job and are repaired; deaths at home are real | A world-qualified death rule (AD13) |
| YAS-C6 | A gauge fills across a series of short jobs before going home; later a chosen return point | A session shape for repeated short visits (D27 loops stay a player option) |
| YAS-C7 | Contract penalties and debts follow him home | Bindings carry by their own rules (AD14) |

Proposal status only. Folding any of these into runtime needs its own scope and proof.
