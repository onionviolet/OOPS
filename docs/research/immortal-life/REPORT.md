# Immortal Life: useful work becomes cultivation

2026-10-14. Lane `immortal-life`. **Status: PARTIAL.** Static installed-data research and PROPOSALS only.

Immortal Life's strongest fit is its link between ordinary skilled work, personal growth and a shared sect's recovery. Farming, gathering, cooking, fishing, workshop work, battle, classes and alchemy have separate breakthrough preparation fields. Friendships open authored stories and roommate stays. This is a good comparison for a cultivator who has a daily life; it does not establish a society of NPCs independently aging, marrying and advancing.

**F1: Payload gate passed.** Steam app 1201230, fully installed Windows depot, build 17861603. Unity IL2CPP: source-built Il2CppDumper recovered type declarations and UnityPy extracted 296 TextAssets. 291 parse as JSON. Method declarations are not recovered executable method bodies. No game launch or personal save access occurred. [Tooling](TOOLING.md).

**F2: Cultivation has more than one ledger.** `Level` holds realm requirements, attribute limits, costs, eight preparation categories, trial skills and monster waves. `LifeSkillLevel` separately holds six professions with 15 rows each and commands that unlock products. NPCs have their own configured realm profiles. These must not become one universal XP meter. [Cultivation digest](CULTIVATION_DIGEST.md).

**F3: “Marry” names do not establish romance.** `Marry` NPCIDs 1001–1012 use invitations to stay in Misty Valley. `Trigger` 355–366 ties access to friendship quest completion and home level 5. `MarryEvent` has 48 single events and 12 repeating dialogue pools with item/buff rewards. Local English text also describes shared residence. This supports roommate content, not a proven marriage/children system. [NPC digest](NPC_LIFE_DIGEST.md).

**F4: Scheduled presence is distinct from autonomous cultivation.** 371 NPC schedules contain 644 Move and 467 Animation entries. Realm profiles and NPC state exist, but this pass has no paid offscreen cultivation, mentor recruitment, rival planning or autonomous breakthrough trace. Neither public “life sim” wording nor an idle animation closes that gap.

**F5: There are unresolved source conflicts.** The wiki describes nine stage rows and timed breakthroughs. Installed `Level` has seven rows, all `BreakTimeSpend` values zero, and different later XP values. A separate nine-row `Breakthrough` table defines puzzle maps. They coexist. Do not assert which reaches live play or label either obsolete without a loader/runtime trace. [Events and fortune digest](EVENTS_AND_FORTUNE_DIGEST.md).

Shown = directly inspected data or type schema. Stated = localized description, official page or prior report. Inferred = bounded interpretation. “Not established” means this pass did not find proof, not proof of absence.

## Ranked PROPOSALS

All unselected. One realm and one prestige layer remains the first milestone. Optional spiritual entry, useful mundane paths, supported idle practice and repeatable options remain reachable. No global once-only rule is proposed. UI packets target 1440 × 900 desktop/laptop; mobile work is deferred. No YAIRPG source/build/browser change is claimed.

| Rank/code | Proposed result | Existing owner | Disposition and cost |
|---|---|---|---|
| 1/P1 | Real work earns an applicable preparation option for a later trial, while keeping profession mastery and realm readiness separate. | [Cultivation](../../RESEARCH_CULTIVATION_PATHS.md), [techniques](../../ENGINE_EXPANSION.md) | Adapt; one work-to-application consumer, not eight new professions. |
| 2/P2 | Repairing one shared facility changes available work and teaching for its residents. | [Characters/institutions](../../CHARACTERS_AND_WORLD_EVENTS.md), engine | Adapt; facility access, stock and teacher availability must agree. |
| 3/P3 | A friendship creates a voluntary roommate stay with retained habits, gifts and a supported departure. | Characters, [continuity](../../SELVES_AND_ECHOES.md) | Trial; existing actors remain people with work, not reward dispensers. |
| 4/P4 | A known specialist accepts a finite supply request and returns an attributed result after travel/work. | Characters, actor scheduling, engine | Adapt; reuse existing agreed duties and actual custody. |
| 5/P5 | A class grants a particular improvement within current capacity; advancement expands capacity separately. | Cultivation, techniques, engine | Adapt; learning access, cost, result and cap need separate facts. |
| 6/P6 | A chosen blessing affects one named resource process, with its own duration and visible result. | [Ability authoring](../../worlds/ABILITY_AUTHORING.md), engine effects | Trial; no universal “luck makes everything better” stat. |
| 7/P7 | A familiar NPC's whereabouts respond to appointments, work and earned story changes. | Characters, actor scheduling, [UI](../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md) | Adapt; one causal schedule override, not whole-population AI. |

[Implementation packets](IMPLEMENTATION_PACKETS.md) name concrete future gates. [Small touches](SMALL_TOUCHES.md) contains 24 original options. These files do not dispatch implementation.

## Prior lane findings: confirm, correct, extend

| Prior locator | Result | Evidence and limit |
|---|---|---|
| Tale of Immortal pass-2026-10-14 REPORT: Immortal Life missing/partial | Correct current availability | This lane observed StateFlags 4, complete byte totals and exe. Earlier observation remains dated history. |
| Tale NPC F2: social tables do not prove autonomous progression | Confirm boundary | Immortal Life likewise exposes profiles/schedules without an autonomous cultivation transaction trace. |
| Tale realm F3: preparation, materials, lifespan and failure separated | Extend comparison | Immortal Life adds occupation-specific trial skill preparation; inspected Level has no lifespan field. Not a substitute for Tale's lifespan rules. |
| ACS supported production/institution traces | Extend | Immortal Life's development rewards link recovery to classes/trade, but this pass has data and declarations only. ACS's managed-body traces support stronger execution claims. |
| ACS actor cleaning and baseline relationship drift | Distinguish | Immortal Life schedules and friendship thresholds are simpler visible data; no matching goal search or relationship drift proven here. |
| Cultivation-idlers F3/F12: persistent rebirth and lifetime budgets | Distinguish | No equivalent rebirth/carryover contract found here; do not import idler loops from the genre label. |
| Cultivation-idlers parent F9: lethal ordinary Path breakthrough | Use newer correction | [Path follow-up](../cultivation-idlers/path-of-the-idle-cultivator/REPORT.md) says its standard trial exhaustion still advances after reward confirmation. |
| Idlers F6/F8: ordinary work and regional life | Extend | Profession-specific breakthrough skills and authored roommate routines offer a different work-to-life link. Immortal Life does not prove offline simulation. |

Proposed owner edits for the coordinator: link this dossier from the existing research index; retain the no-autonomy/no-rebirth proof boundaries; replace the older Immortal Life payload gap with this dated receipt. Do not turn these proposals into accepted product direction.

Remaining gaps: live table selection, exact costs/failure settlement, autonomous NPC cultivation, marriage/disciples/rivals execution, lifespan and next-life rules, full quest/realm semantics. [Checkpoint](CHECKPOINT.md) names every unread family. Research output is ready for coordination; whole-game and playable acceptance remain open.
