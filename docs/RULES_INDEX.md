# Rules index

One entry point for every standing rule in the project. Weibao, 2026-10-16:
"reconcile and organize all the rules for other aspects as well? maybe update
project.md to refer and accordingly make all work easier and more guided?"
([USER_VISION](USER_VISION.md#rules-index-and-reconciliation-2026-10-16)).

This file organizes; it adds no authority. The AD rules below restate accepted
decisions in one line each so agents can cite them. When an AD line and its
linked decision differ, the decision wins. Open details named in a decision stay
open here too.

## How to use it

1. Find your task in the [router](#router-what-applies-to-my-task) and read the
   codes it names in their rulebooks.
2. Check the [AD rules](#accepted-direction-rules-ad) for every aspect the task
   touches, including ones without a rulebook of their own.
3. Apply them, then choose the smallest coherent reversible behavior. Cite the
   codes in the task record or handoff ("SR7, MR4, AD16").
4. Escalate to Weibao only for a real conflict, a direction change or an
   irreversible choice. Ordinary details are resolved from existing direction
   (AD32).

## Authority order

| Level | What | Notes |
|---|---|---|
| 1 | Weibao's words in [USER_VISION](USER_VISION.md) and [PROJECT accepted decisions](../PROJECT.md#accepted-decisions) | Later direction supersedes earlier; superseded wording stays as dated history |
| 2 | Standing rulebooks in the register below | Bind how agents design and build. Each rule is a default with a reason; a world or feature may propose an exception and must say why |
| 3 | Source-qualified world law | Decides what is true inside one world (Rulebook 2–3). It narrows level 2 defaults for that world; it does not change project direction |
| 4 | Proposals: palettes, audits, considerations, GR, CX, checkpoints | Never binding. Saving one does not authorize building it |

## Register of rule sets

| Set | Codes | Status | Covers | Owner |
|---|---|---|---|---|
| Foundational rulebook | Rulebook 1–12 | Accepted 2026-10-10 | Multiverse-wide principles: worlds set their own rules, carriers, means, bodies, time, outliers | [RULES_FROM_SCRATCH](RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10) |
| Accepted direction rules | AD1–AD35 | Restates accepted decisions | Aspects without a rulebook: knowledge, lives, time, recovery, entry, goals, economy, cheats, process | [Below](#accepted-direction-rules-ad) |
| UI rules | UR1–UR58 | Standing 2026-10-15 | All player-facing UI | [UI_RULES](UI_RULES.md) |
| Architecture rules | AR1–AR16 | Standing 2026-10-16 | All runtime code: composition root, domain registry, save slices, seams | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
| Mockup workflow | none | Standing 2026-10-16 | Unsettled layouts and interaction comparisons | [MOCKUP_SYSTEM](MOCKUP_SYSTEM.md) |
| Making rules | MR1–MR36 | Standing 2026-10-15 | Potions, cooking, smithing, runes, enchanting, formations, constructs, any making | [MAKING_RULES](MAKING_RULES.md) |
| Site and exploration rules | SR1–SR24 | Standing 2026-10-16 | Sites, ruins, natural places, maps, discovery, restoration | [SITE_AND_EXPLORATION_RULES](SITE_AND_EXPLORATION_RULES.md) |
| Sealed secrets | none | Standing 2026-10-10 | Hiding world truths from Weibao outside play | [AGENTS](../AGENTS.md#sealed-secrets), [discovery doc](worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10) |
| Means and appraisal | none | Accepted principle 2026-10-10 | What each side can know and do | [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Agent workflow | AGENTS sections | Standing | Design framing, scope, research lens, verification, saves, sources, deep-detail storage, multi-agent ownership | [AGENTS](../AGENTS.md), [GM prompt](GAME_MASTER_PROMPT.md), [shared worktree practice](gm/SHARED_WORKTREE_PRACTICE.md) |
| Source research | none | Standing | Acquiring and deep-diving books, games and wikis | [Acquisition tools](research/SOURCE_ACQUISITION_TOOLS.md), [deep dive playbook](research/SOURCE_DEEP_DIVE_PLAYBOOK.md) |
| Generation foundation rules | GR1–GR17 | Proposal 2026-10-14 | Contract for every generator | [GENERATION_FOUNDATION_RULES](GENERATION_FOUNDATION_RULES_2026-10-14.md) |
| Complexity guardrails | CX1–CX8 | Proposal 2026-10-16 | Keeping depth while bounding implementation | [Part 9 pass](gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md) |
| World completion standard | none | Proposal 2026-10-11 | Sections, detail ledger and acceptance for a world | [WORLD_COMPLETION_STANDARD](WORLD_COMPLETION_STANDARD.md) |

## Router: what applies to my task

| If the task touches | Apply | Then read |
|---|---|---|
| Any runtime code | AR1–AR16; AR14 for lane briefs, AR16 before calling it done | [ARCHITECTURE_RULES](ARCHITECTURE_RULES.md) |
| Any player-facing UI | UR1–UR58, AD34; mockup workflow if layout is unsettled | [UI_RULES](UI_RULES.md), [surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md) |
| Making or crafting of any kind | MR1–MR36, AD9 | [CRAFTING_ENGINE](CRAFTING_ENGINE.md) |
| Sites, ruins, caves, maps, exploration, restoration | SR1–SR24, AD3, AD33 | [Site palette](gm/dispatch/procgen-2026-10-13/p11/LIBRARIES_TEMPLES_MINES_CAVES_AND_MAPS_2026-10-16.md), [ruins](gm/dispatch/procgen-2026-10-13/p11/DUNGEON_CONTENT.md) |
| Generators, RNG, seeds | MR2–MR3, MR28, SR20, Rulebook 9; GR1–GR17 as the recommended contract | [Procedural status](PROCEDURAL_GENERATION_STATUS_2026-10-13.md) |
| A new world or book adaptation | Rulebook 2–3, AD1–AD5, MR11–MR15, SR1–SR3 | [Rulebook precedent](RULES_FROM_SCRATCH.md#cross-world-audit-precedent-special-rules-and-little-details-2026-10-12), [completion standard](WORLD_COMPLETION_STANDARD.md), source research |
| Hidden truths, secrets, identification | Sealed secrets, AD3, AD6–AD8, MR1, MR31, SR5, SR9 | [WORLD_SECRETS_AND_DISCOVERY](worlds/WORLD_SECRETS_AND_DISCOVERY.md), [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Shown numbers, appraisal, opponent stats | AD6–AD8, UR40 | [MEANS_AND_APPRAISAL](MEANS_AND_APPRAISAL.md) |
| Lives, death, rebirth, return, carryover | Rulebook 4–5, AD10–AD14, AD19–AD20 | [Continuation owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md), [identity owner](worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md) |
| Time, idle, offline, recap | Rulebook 7, AD15–AD18, MR28, SR21 | [DIRECTION_SUMMARY](DIRECTION_SUMMARY.md), [DIRECTION_SYNTHESIS](DIRECTION_SYNTHESIS.md) |
| Danger, defeat, difficulty, settings | AD19–AD22, SR14 | [DIRECTION_SYNTHESIS](DIRECTION_SYNTHESIS.md#od12-forgiving-recovery-direction-2026-10-15) |
| Cheats | Rulebook 5, 11; AD26, AD28–AD30, AD11 | [CHEAT_COSMOLOGY](CHEAT_COSMOLOGY.md), [CHEAT_LIBRARY](CHEAT_LIBRARY.md) |
| Starts and entry | AD23, Rulebook 8 | [Intro and starts index](INTRO_AND_STARTS_INDEX_2026-10-14.md) |
| Goals, story, rivals, threats | AD2, AD24–AD25, AD6 | [CHARACTERS_AND_WORLD_EVENTS](CHARACTERS_AND_WORLD_EVENTS.md), [RIVALS_IDENTITIES_AND_FATE](RIVALS_IDENTITIES_AND_FATE.md), [TIMELINES_AND_DIVERGENCE](TIMELINES_AND_DIVERGENCE.md) |
| Economy, trade, property | AD27, AD31, MR5, SR15, SR19 | [Requests and markets](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md) |
| NPCs, companions, social systems | AD6, AD33 (NPC-heavy work deprioritized), MR23 | [Companions audit](audits/COMPANIONS_CORE_AUDIT.md) |
| Saves and persistence | Rulebook 9, AR6, MR3, MR30, MR33, SR22, AGENTS safety | Migration or explicit compatibility decision required |
| Research passes and sources | AD35, AGENTS scope and source acquisition | [Source tools](research/SOURCE_ACQUISITION_TOOLS.md) |
| Dispatching or coordinating agents | AGENTS multi-agent, AD32 | [GM prompt](GAME_MASTER_PROMPT.md) |

## Accepted direction rules (AD)

Each line restates an accepted decision. "Means" follows AD6: what a skill,
power, item, contact, access or prior knowledge actually supports. Sources are
the bold entry names in [PROJECT accepted decisions](../PROJECT.md#accepted-decisions)
unless another owner is linked.

### Worlds and canon

| Code | Rule | Source |
|---|---|---|
| AD1 | **Each world sets its own rules; book worlds start from their book.** Premises can change (canon, divergent, remix, swapped). Direct recreations stay in the private pack. | Rulebook 2–3; Book worlds; Worlds |
| AD2 | **Canon follows its natural course unless sufficiently disturbed.** Divergence is causal. Authored plot versus simulation varies by world and mode. | Natural course; OD7 |
| AD3 | **A world's special rules start hidden** and are found in play through fitting skills or other routes. | Hidden world specialness; sealed secrets |
| AD4 | **Worlds keep their own histories.** Crossing does not reset them; revisiting, fresh or parallel versions come through means. | OD5 |
| AD5 | **Anything is possible, reasonably.** Several reasonable answers become player choices with modest defaults. Outliers are recorded as outliers, not new general rules. | Anything is possible; Rulebook 1, 12 |

### Knowledge and means

| Code | Rule | Source |
|---|---|---|
| AD6 | **Means decide, on both sides.** Neither player nor NPC knows or does more than the means it holds; plain impressions are the default. NPC plans use the same gate. Hidden intent stays hidden without a fitting route. | Knowledge and means, both ways; Hidden intent; Rulebook 6 |
| AD7 | **One authoritative record per subject.** Truth, observer knowledge and representation stay distinct. | OD8 |
| AD8 | **Opponent numbers are learned; own stats are exact.** First sight shows impressions and `???`. | Learned opponent numbers (2026-10-16) |
| AD9 | **Forecasts reflect knowledge.** Experiment costs, risks and predictions follow what is known; failed experiments can teach; cheats can help discover. | Predictions and question triage; OD25 |

### Self, lives and carryover

| Code | Rule | Source |
|---|---|---|
| AD10 | **One life follows one person; the journey continues across lives.** One continuing self is the default; possession, shared minds and multiple bodies need means. | OD1; OD6 |
| AD11 | **Memories and the base cheat carry; the rest depends on world and means.** What carries can improve. Every crossing needs a carrier. | OD2; Rulebook 5; Starting continuation |
| AD12 | **A fresh life has its own history; the former life pauses.** Return is reciprocal by default but depends on means, including from an unconscious body. Intentional loops are a player option. | Voluntary fresh-life history; Reciprocal return; Unconscious-body return |
| AD13 | **Bodies are real.** Species, bloodline, constitution, sex, age and size carry stats, needs and lifespans. | Rulebook 4 |
| AD14 | **Bindings and duties carry by their own rules,** with known-consequence warnings. Research and cheats can detect or change them where supported. | Binding remedies; Goals and binding continuity |

### Time and being away

| Code | Rule | Source |
|---|---|---|
| AD15 | **Ordinary play advances time; settled routines can compress.** Worlds and lifespans pace differently. | OD23; Rulebook 7 |
| AD16 | **Away time runs chosen routines in the current world** and stops at important choices or exhausted supplies. Inactive worlds pause. Offline aging depends on world and settings. | OD4; Offline calendar clarification; Current-world choice pause |
| AD17 | **The return recap shows only what knowledge, means or cheats allow,** with adjustable detail and paused pending choices. | OD15 |
| AD18 | **Banked unused time follows the continuing journey;** capacity and efficiency can improve. | Continuing time bank |

### Danger, recovery and settings

| Code | Rule | Source |
|---|---|---|
| AD19 | **Recovery is forgiving by default.** Ordinary save/reload works; native defeat is unconsciousness and recovery. World danger and recovery strictness are separate; harsher play is optional or forewarned. | OD12; Defeat |
| AD20 | **A locally unwinnable situation may require going elsewhere or restarting,** including within the same life. | OD11 |
| AD21 | **Comfort settings change freely; difficulty changes are explained and affect future play.** In-world rules change only through cheats or means. | OD16 |
| AD22 | **Firm lines are save integrity and real-world guardrails.** Bugs and reload exploits get fixed; other limits are per-world adjectives, not fixed "once" rules. | Rulebook 9; MR15 |

### Entry, goals and story

| Code | Rule | Source |
|---|---|---|
| AD23 | **Entry is guided randomness by default;** full random and specific starts depend on means. Warn about known risks when relevant means are absent. Vanilla stays intact and optional. | OD10; Suspenseful random entry; Vanilla stays intact |
| AD24 | **Players choose their pursuits.** Guidance and optional campaigns, no compulsory global main quest. | OD24 |
| AD25 | **Threats develop from their actual causes,** not automatic matching to the player. | Cause-driven threats |
| AD26 | **Narration is direct by default; base-cheat powers are discovered in play.** A cheat's look follows what the cheat is, not its world. | OD13; [cheat looks](USER_VISION.md#cheat-looks-follow-the-cheats-own-type-2026-10-16) |

### Economy, power and cheats

| Code | Rule | Source |
|---|---|---|
| AD27 | **Economies are local; trade and arbitrage are intended.** Shared currencies come through means or cheats. | OD11 |
| AD28 | **Everything can become OP; power is relative.** Beaten obstacles stay beaten. | Rulebook 11 |
| AD29 | **The base cheat is a quiet personal faculty by default.** Systems or voices come through means or accompanying cheats. | Cheat-chat continuation (CA13) |
| AD30 | **Titles may grant real powers** through a world's rules or a cheat. | Titles, achievements and rule-tags (standing priorities) |
| AD31 | **Owned things such as furniture may give passive bonuses.** | Bonuses from furniture and more |

### Process

| Code | Rule | Source |
|---|---|---|
| AD32 | **Accepted means Weibao said so.** Agent text is proposal until he accepts it. Resolve straightforward details from existing direction instead of asking again. | Rulebook 10; Predictions and question triage |
| AD33 | **Complexity is welcome; slices sequence it.** NPC-heavy work is deprioritized and procedural layouts stay deferred. | [Complexity](USER_VISION.md#complexity-and-implementation-difficulty-2026-10-16); [procedural focus](USER_VISION.md#procedural-focus-ruins-and-world-first-2026-10-16) |
| AD34 | **Desktop and laptop first; mobile deferred.** | [Standing UI priority](USER_VISION.md#standing-ui-priority-2026-10-13) |
| AD35 | **Research passes save deep details privately** in gitignored `docs/research/<source>/private/`. | [Standing rule](USER_VISION.md#save-deep-details-for-reference-2026-10-14) |

## Shared principles across rulebooks

The same ideas recur under different codes. Cite the most specific one.

| Principle | Expressed as |
|---|---|
| Truth and knowledge are separate | Rulebook 6, AD7, AR8, MR1, MR31, SR5, SR9, GR5, sealed secrets |
| A seen thing does not silently change | MR3, MR30, SR22, GR3, GR10 |
| Previews and inspection cost nothing | MR4, SR13 |
| Things are conserved and have a custody | MR5, SR15, Rulebook 5 |
| Each world sets its own law | Rulebook 2–3, AD1, MR11–MR15, SR1, SR3 |
| One authority per fact | AD7, AR3, MR29 |
| Same rules for player and NPCs | AD6, MR23, GR13 |
| Nothing ships without a reader | MR32, SR12, GR12 |
| Game time, never wall clock | MR28, SR20–SR21, GR17 |
| Build a slice, not every adjacent system | SR23, AD33, AGENTS scope |
| Prove the claimed layer | AR10, AR16, SR24, MR34–MR36, UR "Before you call it done", AGENTS verification |
| Old saves keep working | AR6, MR33, SR22, AGENTS safety |

## Tensions reconciled

Each tension is resolved from existing authority; none needs a new decision.

| Code | Tension | Resolution |
|---|---|---|
| T1 | Rulebook 2 says no global defaults; many OD answers say "by default". | Rule 2 itself reads any default as a placeholder until the world defines its own. The OD defaults are those placeholders for ordinary play, accepted later; worlds can still differ where the OD says world- or means-dependent. |
| T2 | Rulebook 8 says new features extend existing panels instead of separate windows. | Its vanilla-playable part stands. Its UI composition clause is superseded by the 2026-10-15 Proto23 foundation and surface types (UR1, UR5), as PROJECT already marks for "Original UI is the baseline". |
| T3 | MR2 makes outcomes deterministic given inputs and draw; the repeatability answer selects no universal deterministic policy. | Different layers. MR2 governs save reload and preview (save integrity). Repeatability governs in-world rewinds and repeats, decided per world and means. |
| T4 | GR1–GR17 are a proposal, yet MR and SR state the same freeze and draw ideas as standing. | Standing for making and sites only. The general generator contract stays recommended until Weibao accepts it. |
| T5 | Rulebook 9 allows only two firm lines; SR14 and AD19 allow harsh play. | Harshness is chosen or forewarned, not a firm line. Anti-abuse beyond save integrity is not a rule (AD22). |
| T6 | The rulebook's "more to consider" candidates (consequences persist, many routes, information when it comes up, sources first) read like rules. | Still candidates in general. They are standing only where a later rulebook adopts them: SR22 for site persistence, AD5 for routes, UR42 for disclosure, AGENTS scope for sources. |
| T7 | LOTM planning docs use "AR1–AR11" for audit rules; ARCHITECTURE_RULES uses AR1–AR16. | Unqualified AR means architecture rules. Cite the LOTM set as "LOTM AR" with its link. |

## Aspects without a dedicated rulebook

Combat, cheats, characters and companions, lives and continuation, and time are
covered only by AD rules and their owners. If Weibao asks for standing rules in
one of these, write it like SR: a dated request in USER_VISION, a coded file
with "prevents" columns, a row here and one line in PROJECT.

## Changing this index

- New rulebook: only on Weibao's request. Record the request in USER_VISION, add
  a register row and router rows here, and one line in PROJECT standing priorities.
  Link it from AGENTS only if it binds every agent.
- New accepted decision: add or revise its AD line here when it changes an aspect.
- Codes are never reused. A superseded rule keeps its code with a dated note.
- Run `npm run check:rules` after any change here or to a rulebook's codes. It checks register coverage, code ranges, AD contiguity, cited codes and links.
