# Academagia decompile research, 2026-10-14

The installed code corrects the wiki's roll, exam, final-weight, stress and concealment claims. Classes use a saved calendar of 1,192 gains; adventures use linked story records and prerequisites; random events use a daily Luck gate followed by uniform selection. Relationships affect recruitment, shared adventure skills, favors, information and infighting.

**Status: PARTIAL.** Core source and data questions are answered. Runtime cache merging, complete club content semantics and a one-to-one mapping of the wiki's 258 adventure pages remain open. No game launch, save access, install change or YAIRPG implementation occurred. Only this output directory was written in the repo. The prior web files are unchanged.

Payload gate passed: app 533480, StateFlags 4, downloaded/staged bytes complete, build 2453605, depot 533481 manifest 6671209053462036643. ILSpy decompiled six managed assemblies successfully. A passive Python reader consumed all base and four patch data streams to their exact final bytes. Raw data/code and hashes remain under `~/.codex/research/academagia-decompile/`.

**Labels:** shown = inspected code or decoded shipped field; stated = prior web source or external announcement; inferred = analysis/reconstruction; proposal = unaccepted YAIRPG design. Source evidence is not gameplay acceptance.

## Ranked PROPOSALS

| Rank/code | Proposal | Owning system and reason |
|---|---|---|
| 1 / P1 | Separate subject competence, study preparation and recorded exam result | `docs/ENGINE_EXPANSION.md`, school-world design; preparation can reduce variance without replacing practical skill |
| 2 / P2 | Persist a generated term curriculum and completed assessment draws | ENGINE_EXPANSION, chronicle/simulation; earned outcomes survive reload and idle progress has a stable plan |
| 3 / P3 | Let companions contribute named expertise to an adventure option | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, `docs/worlds/ABILITY_AUTHORING.md`; a group's skill coverage changes reachable solutions |
| 4 / P4 | Track group conflicts with a visible repair interval | CHARACTERS_AND_WORLD_EVENTS; preserve pair causes, intervention and changed groups rather than instant punishment |
| 5 / P5 | Separate event frequency, eligibility and weight | ENGINE_EXPANSION; a player can understand why a world is quiet without confusing it with missing content |
| 6 / P6 | Build an institution ledger for merit, favors and access | school-world design, character/reputation owners; one earned act can open several useful routes |
| 7 / P7 | Make clubs authored progression paths with practice and benefits | school-world/ability owners; no need to invent one universal club level or copy source clubs |
| 8 / P8 | Show independent curriculum, cohort and story panels on a desktop term view | `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`; use the laptop screen for planned and emerging activity |

These are proposals only. Preserve every reasonable route and world-specific repeat policies; the source's played-event exclusion is not a fixed YAIRPG once-only limit. Desktop target for a future P8 slice: 1440×900, visible timetable, subject preparation and cohort consequences; mobile optimization deferred. Later implementation needs a fresh rebuilt browser origin plus save/reload/import, with director acceptance separate.

## Prior-lane reconciliation

All 20 prior finding codes are addressed below. Formula detail: [rolls and exams](ROLLS_AND_EXAMS.md). Exact course weights/dates and gain counts: [class tables](CLASS_TABLES.md). Storage/graphs/frequency: [events and calendar](EVENTS_AND_CALENDAR.md). Social hooks: [groups](RELATIONSHIPS_AND_GROUPS.md).

| Prior code | Verdict | Source-grounded result and limit |
|---|---|---|
| F1 day slots | Confirm + extend | Three planned slots; four internal phases, with night processing. Weekday morning/afternoon attendance defaults. `ActionScheduleDay`, `DateAndTimeHelper` |
| F2 calendar | Correct | 28 numbered days plus two named holidays per month, 360 dates. Exams months 12/6, gain anchors absent in 6/7/8/12; year ends month 6 day 28. Scheduler availability is not globally disabled by month. `DateAM`, `ClazzSkill`, `GameController.EndGame` |
| F3 exams | Correct | K draws from study level through 10, illness penalty, extra credit; final weights 80–99%, not 80–95%. Absolute bands confirmed; hybrid styles take worse/better of band and curve, PNP uses skill ≥5. `ExamSystem`, `Clazz` |
| F4 learning | Correct explanation | Study/Train magnitude 1 confirmed. Class gains are randomly assigned within anchor ±3 at initialization, then persisted; no stable date-seeded RNG shown. `ClazzSystem`, `RandomGenerator` |
| F5 skill shape | Confirm + extend | Top-three minimum confirmed, fewer than three gives zero. Base 55 parent records incl. Bond; parent-derived cap can be 99. Exact step formula and reset documented. Failed checks inform skills. `ActorSkill`, `SkillSystem`, `StorySystem` |
| F6 adventures | Correct count meaning | Base 1,555 nodes/237 roots; patch reconstructions 3,018–3,030 nodes depending on merge interpretation. 258 wiki pages cannot be treated as shipped adventure count. Checks accept any successful roll alternative; clique expertise applies. Five viewpoint exclusivity is authored content, not a generic enum. |
| F7 students | Confirm + qualify | 83 base/87 in patch union. Default pair range -10..10 and +1 same-college starting relationship. +12 is not a universal cap demonstrated here. Full personal arcs unread. `Student`, `RelationshipSystem` |
| F8 cliques | Confirm + exact hooks | Contested Charm/Befriend; recruitment malus sums deficits below +5 to other members. Negative relations must persist across daily updates before infighting. Camp relations change ±1; split conditions documented. Vendetta numeric entry gates unread. `CliqueSystem`, `CliqueInfighting` |
| F9 colleges/favors | Confirm + qualify | Seven colleges; reward prerequisite values extend through 900. Successful favor reward table lookup resets teacher relation to zero. Detention scheduler hooks confirmed; per-college ladder and all teaching effects unread. |
| F10 stress | Correct | Baseline maximum 2×Fitness plus modifiers. Overflow alone does not guarantee illness: resistance helper roll must be lower than stress. Illness locks next-day plan; recovery resets stress. `Stress`, `StressSystem`, `ActionScheduleDay` |
| F11 rolls | Correct | Normal draw is integer 1..max(1,2×Attribute) + effective Skill; helper Power draws 0..2×Attribute-1. Strict > normally, ≥ with contextual Penetrate. Bonuses, Glory and rerolls have distinct paths. Displayed bands are estimates. |
| F12 locations | Correct + extend | 452 base; patch union 547, deletion reconstruction 545. Shipped discovery values range 0–45, not just 0–15. Unauthorized visit checks discovery chance then conduct reprimand. `Location`, `VisitSystem`, `ReprimandSystem` |
| F13 money/concealment | Correct | Allowance credits approval on numbered days 14/28. Concealability sums backpack + equipped items; limit is 2×Finesse. Overload triggers a chance path, then blackmail/reprimand; inspected method does not directly remove an illegal item. `AllowanceSystem`, `Inventory`, `IllegalSystem` |
| F14 spells | Extend, partial | Pheme/component schema confirmed; 639 base/679 patch Spell records. Exact component difficulty and duel interaction not fully read. No universal count of 409 for this payload. |
| F15 creation/familiar | Partial correction | Ten points and seven pages remain prior stated claims, UI not audited. Checked story skill path adds full familiar skill; training caps include Bond+1, capped at 10 in ExpandLevel. No universal half-Bond bonus cap demonstrated. |
| F16 random events | Correct + extend | 836 base/1,316–1,317 patch event records. Daily chance clamp(48+Luck+eventChance,0,100)%, zero while ill. Uniform eligible-unplayed selection, persisted exclusion list, no scheduled slot. |
| F17 series status | Unchanged stated/inferred | No fresh series-status research; installed Year 1 ending is confirmed, future-year publication remains outside this pass. |
| F18 engine/tools | Confirm runtime format | Managed .NET assemblies and Firebird authoring code; shipped records are custom binary and ZIP patches. No mod-tool install or Windows execution. |
| F19 reviews | Outside source scope | Prior review/reception counts not refreshed; source confirms planning detail but does not prove grind or current sentiment. |
| F20 lineage | Outside source scope | Prior external developer/lineage claims remain stated/inferred, not confirmed by this payload. |

The prior purchase prerequisite is obsolete: this lane used Weibao's installed, owned payload. Proposed edits for the coordinator: link this report from the prior checkpoint, retire its purchase gate, narrow all wiki 'verified' labels to 'stated by community source', and route accepted school ideas to their live owners. No owner edits were made here.

A primary developer forum archive identifies the 3.0.22 patch as a content replacement including `Content.mdm`, supporting the need to inspect patches as well as base content. [BCS moderator/developer patch posts](https://academagia.invisionzone.com/profile/4-command/content/). Mod-tool acquisition was unnecessary for the confirmed binary reader route; a runnable public editor package was not acquired.

## Verification and remaining gate

All six decompile commands exited successfully. Base header consumed exactly 7,189,608 bytes; base data exactly 68,154,787 bytes. Patch readers consumed all four streams exactly. Course count, linked class gain count, variance, weight range and course-to-gain references pass passive checks. [TOOLING.md](TOOLING.md) gives rerun steps; [CHECKPOINT.md](CHECKPOINT.md) names every remaining gap. No runtime or gameplay proof is claimed.
