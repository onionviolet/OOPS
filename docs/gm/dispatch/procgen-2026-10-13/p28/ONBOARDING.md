# P28 gradual generator onboarding

2026-10-14. **PROPOSAL ONLY.** Extends root AF1, E2 life-stage decks, E5 section 8 and intro TE1–TE9. [Timelines T1–T4](../../../../TIMELINES_AND_DIVERGENCE.md#t1-separate-the-identities-before-adding-branches) owns identity/era/clock semantics. No unlock/tutorial behavior changes here.

## AF1.1: three gates, not one complexity level

Separate **world availability and real prerequisites**, **character discovery**, and **how much interface/help to foreground**. Age and play depth influence which fitting opportunity is introduced and how it is explained; neither grants a faction, creates a war nor makes an adult automatically know a system. A supported direct start can begin with established skills, responsibilities and known people. It should not require a Village tutorial or another life's deaths first.

Proposed invariant: actual commitments, current work, costs, consequences, cancel/recovery controls, Save and navigation remain accessible regardless of onboarding depth. A gentle mode may introduce one new optional concept at a time and collapse advanced explanations. It cannot hide an urgent known decision or delay an already-caused world event because its tutorial is unfinished. World simulation continues under its selected clock; foreground teaching is a presentation policy.

A local generator can enroll when a real discovery/deed happens, after deliberate opt-in, or as part of a qualified direct start. These are composable routes. Unsupported or private generators are never exposed by a generic “show everything.” An experienced-player choice opens all **known supported** controls and shortens help; it grants no undiscovered knowledge or unavailable capabilities. Per-world frequency adjectives govern recurrence. No “only once per life” rule is added to lessons or content.

## AF1.2: current unlock and tutorial audit, after P15 F26

All rows are **SHOWN/SOURCE**, read 2026-10-14; implications are **INFERRED**, not rebuilt UI proof.

| Code | File:line | Current source / implication |
|---|---|---|
| F31 | `src/character_creation.js:70–88`; `src/chronicle.js:78–92,162` | Creation stores selected categorical `bio.age`; chronicle creation independently initializes numeric age 18, then ages on its clock. Bind these deliberately before reading “life stage” across systems |
| F32 | `src/life_experience.js:8–15,26–30` | Current stage is youth below 25, adult below 65, elder otherwise; youth has a learning multiplier and elder teaching is tied to known lessons. It is not a child/apprentice/immortal universal stage model |
| F33 | `src/main.js:1655–1666,3109–3118`; `src/native_unlock_transaction.js:3–38` | Native flags gate gathering/crafting; reward path respects gathering access. Transaction helper validates/stages unlocks in the envelope before publishing. Teaching prose must not duplicate grants on restoration |
| F34 | `src/models/skill.js:26,55,148–155`; `src/main.js:3776–3803`; `src/skill_discovery.js:54–85` | Native skill naming/visibility depends on actual unlock and XP threshold; first-crossing cue excludes load/restore. New generator help cannot expose hidden skill labels before this gate |
| F35 | `src/skill_discovery.js:44–69,94–112`; `src/workspace_layout.js:89–114,124–130` | Known hints are distinct from hidden feature labels; discovered/unlocked/eligible and accepted work are separate. Workspace discovery is sticky in session and restores from owner predicates; it is not durable lesson-completion evidence |
| F36 | `src/workspace_views.js:15–20`; `src/native_discovery_policy.js:6–23`; `src/native_discovery_feedback.js:25–57` | Combat/stance discovery follows known/visible combat; cues use settled known events, batch coalescing and settings. Reuse small explanatory cues, without a decorative queue that blocks play |
| F37 | `src/simulation_ui.js:17–21`; `src/causal_story_host.js:459–483`; `src/event_feed_ui.js:31–36` | Optional local enrollment and received-fact action gating already exist. Feed routes depend on location/dialogue/combat/known panel. A generalized staged generator catalogue is not established by these inspected adapters |

P15 F9–F16 owns the detailed authored dialogue/Ink audit. Further narrative checks here: `src/causal_story_scenes.js:63–103` projects phases from heard accounts/actions/work; `src/causal_story_native.js:120–127` finishes a native quest only with the received closure; `src/event_feed.js:37–48,102` projects known events and retains eight recent news rows; `src/world_visit_history.js:21–58` compacts ended visits while protecting refs; `src/life_record.js:1,32–58` is lossy biography. None is a durable “has learned this UI” store. These extend existing audit findings without turning code into a general onboarding engine.

The intro doc's F4 “no tutorial or hint layer” is a dated broad source finding. Current source has discovery hints/cues and owner-specific introductions. This does not establish a complete progressive tutorial. Reuse those mechanisms and keep the broader missing generator onboarding explicit. A search for tutorial/onboard names is insufficient to prove absence; this conclusion is limited to the audited paths.

## AF1.3: life-stage and play-depth matrix

“First hours” below means an exposure/presentation guide, not a timer lock. Saved played-time exposure can supplement real discovery receipts, never count wall-clock idle as understanding. A player may move quickly, queue work, ask for more detail or enter a late-stage start directly. Suggested tiers are reversible prototype choices.

| Code / exposure band | World-qualified life contexts | First concepts / fitting generators | What brings more depth forward |
|---|---|---|---|
| AF1.3a Arrival / first useful loop | Dependent child, outsider, apprentice, veteran arriving elsewhere; supported nonhuman equivalent | Observe → hear terms → choose/help/decline → useful result. Simple local cards and known topics. Intent menu can appear immediately on request | One actual encounter/receipt or explicit “Show more”; introduce a contact without inventing friendship, capabilities or rewards |
| AF1.3b Familiar local life | School/household member, local worker, guest, early independent agent | Repeat opportunities, callbacks from shared deeds, knowledge/basis, small requests, creative works and optional bookmarks | Return to a known contact, perform supported work/study, or start with qualified familiarity. Basic taste controls follow an actual bookmark, not an unseen population model |
| AF1.3c Commitments and affiliations | Apprentice, professional, officer, collective member, established actor of any fitting age | Multi-step threads, faction requests, journey preparation, market/provenance stories | Actual membership/appointment/contract, group or planned travel makes the relevant owner useful. P12/P19/P21/P27 govern consequences |
| AF1.3d Regional responsibility | Organizer, commander, guild/sect leader, guardian, influential citizen | Settlement change, group leadership, wars, logistics, NPC-NPC plans | Actual authority/recognized ties and reachable regional causes. A war may already affect a new refugee; show their local consequences immediately without teaching the entire war UI |
| AF1.3e Long memory / further lives | Elder, immortal novice, successor, looper, traveler, archive-bearing nonhuman | Lineages, legacy, branch comparisons, retained knowledge, long callbacks, cosmic stories where supported | Actual kin/teaching/succession/history/retention carrier, or qualified direct late-era start. Elder age alone does not create heirs; first death is not compulsory access |

Keep all bands revisitable. A veteran can request basic help; a young faction member can encounter politics; an elder new to magic can learn beginner methods. No universal numerical age gates for fantasy species, systems, spirits or loops. A world's stage adapter maps its actual body/social status/lifespan and source-qualified rules into relevant content. Life stage, faction rank, power tier, skill mastery, fate-arc phase and source era remain distinct.

Canon starts use P9/P10/P13's chosen continuity/era/cutoff and actual known role. A Harry Potter school context, a D&D established adventurer or a Mother of Learning continuous visitor can each foreground different topics; these are **INFERRED adaptation examples**, not claims of source tutorial rules. Public content uses original names; direct recreations stay in their qualified private pack. A later era does not grant foreknowledge to its NPCs. TTKS is five different source profiles, not one universal progression ladder.

## AF1.4: receipts and presentation

Proposed small onboarding record stores policy revision, world/instance scope, selected help depth, relevant seen/help-dismissed concept IDs, discovery/deed refs and exposure clock anchor. It references domain progress; it does not duplicate ambition, quest, membership or skill state. Missing old owner preserves current discovery/enrollment behavior. Do not retroactively infer lessons from biography highlights or auto-enroll new generators into an imported old life.

A first reveal can use intro TE2's one-line explanation tied to the real cause, for example original UI text “You accepted a repair job. Its terms and progress are in your notes.” Dismissal means presentation acknowledged, not skilled at repairs. Replay help deliberately without paying/learning/rewarding again. Batches of discoveries coalesce into a readable summary; actual leads remain available. Returning after time away uses the selected world/branch clock and a known summary, not a new offline simulation.

Target 1366x768 and 1600x1000 desktop. Use the screen for a visible current action/terms panel and known goals/topics alongside optional details. Input/topic menus retain keyboard focus while time updates; ambiguity choices remain editable; no automatic panel jumps during ordinary work. Known commitments stay findable when advanced panels are collapsed. Effects off/reduced motion provide full text without flashes. Mobile optimization deferred.

Save/reload/import retains opted-in generators, disclosure, selected help depth and acknowledged messages without replaying grants/cues. Missing packs/revisions retain earned commitments under the selected compatibility policy; neutral unavailability never “repairs” a save by discarding paid work. Load is neither loop reset nor lesson replay. Shared host/save/layout joins need one root-controlled writer.

## AF1.5: future acceptance

Natural new life sees one useful local card, chooses an actual route, then encounters its known callback and can ask about it. A directly established start receives the fitting richer surface immediately; the same player can request simple help. Controlled fixtures separately cover dependent/nonhuman/elder/loop cases through the world's real admission code, with unsupported cases declared. Compare light versus expanded help while action eligibility/results remain identical.

Future source/build gates include disclosure, no grants from hints, correct categorical/numeric-age binding, sticky-known versus learned-help distinction, pending work visibility, batched restore suppression, and absent-owner compatibility. Rebuilt natural interaction at both desktop views plus Save/reload/Export/literal-file Import must show exact enrollment/knowledge/commitments/help state and next draws. Human clarity/feel acceptance remains separate. All are NOT RUN in P28.
