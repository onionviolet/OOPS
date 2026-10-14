# Companions, crew and quest exceptions

**SHOWN** unless marked otherwise. Private table: `extract/events.json`, keyed by event title, step title and zero-based choice ID. Private managed source: `extract/code/`. Prior warning/departure reads remain in [prior findings](../FINDINGS.md), F27-F30/F47-F56.

## Three different entities

Counted crew use category properties and labor/food/pay/cargo coefficients. Named companions have individual GameCharacter properties, alignment, quest caps, roles and combat growth. Hirelings are another category: the shared morality pass excludes them and their display reports not upgradable. `Caravan.RunMoralityAction:1355-1399`; `Character.IsHireling/IsUpgradable`; `GameCharacter.GetMaxCharProwess:407-504`.

Roster-add is not identity-preserving reactivation. `Caravan.AddCharacter:5616-5662` rejects null, unavailable, collection and duplicate records, then creates a new GameCharacter at starting Prowess and loads initial perks. Removal clears roster, role, gear mounts and formations; the underlying Character record and story flags need not disappear. `RemoveCharacter:5900-5925`. The add method has no universal permanent-departure prohibition, but that does not make an authored recruitment route reachable again.

## Recruitment and return gates actually traced

| Route | Gates and mutation | What it establishes |
|---|---|---|
| Harvek, Lumen_Tavern | Root choice 4 requires absent, no tavern death and HarvekRecruited=0. Step 29 choices 0-2 add him with encounter-dependent loyalty, then set recruitment flag | Different starts to first recruitment; initial route does not automatically reopen after departure |
| Braxius, TorZag_MarketDist | Root choices 2/3 branch on visit, assignment, roster and prior recruitment/death flags; choices set BraxiusVisit=1. Steps 44/54/64 offer Harvek/Criftaa/Renkailon additions, optionally spending drink for loyalty | Alternate first-hire routes. **Not proof of repeatable re-recruitment** |
| Garrik, TorZag_Undercity | Step 12 choice 5 uses passenger and GarrikRecruited=0, consumes passenger and sets recruitment flag; step 20 adds him | A passenger handoff precedes actual roster insertion |
| Nedir, Larnak_Fields | Step 1 choices 6/7 require not met, not recruited and absent; referral or Renown path. Steps 87/88 add her, optionally pay for loyalty, then mark recruited and schedule a 30-day flag | Social access and delayed aftermath, not just a price tag |
| Vorax_Recruitment | DLC, current node, earlier visit, absent, no prior recruitment-event count and VoraxRecruit=0. Several refusal/death paths; recruitment writes flag then adds at step 10 | Table presence alone does not grant him; event-history gate survives roster removal |
| Sedarias_Recruitment | CompanionDLC, location, assigned prerequisite, not later journal, absent, SedariasDigUp=0. Entering sets DigUp=1. Can remove Javek and fail his current quest. Closing completes/assigns journals, adds Sedarias and schedules a 15-day flag | Rival companion replacement and delayed quest aftermath |
| Javek_Recruitment | CompanionDLC, location, journal prerequisites and OldJavekOasis=0. Some branches remove Sedarias and fail his current quest; refusal can set blocking flag; acceptance adds Javek, completes/assigns journals and schedules a 2-day flag | Mutual hostility is enforced by authored branches; no universal simultaneous-recruitment rule inferred |
| Renkailon, Deven_Hintercaves | Step 70 adds companion and sets encounter/freed/recruited state. Separate character-presence code handles changed variants using quest and variable state | A second insertion site is not proof of an after-departure return |

Public developer statement confirms both Old Acquaintances companion questlines can be completed sequentially in one playthrough, while simultaneous employment is excluded. This is a **STATED** exception to treating mutually hostile stories as an either/or lifetime lock. [Old Acquaintances](https://store.steampowered.com/app/2672530/), About This Content.

This pass does **not** establish a complete list of all post-departure re-recruitment exceptions. An all-companion return claim would need full incoming-path and journal/flag reset closure, including custom scripts and newer graphs. Specific remaining gaps: Gor’Goro, Skornar, Eylani, Finndurarth and changed Criftaa/Renkailon return paths; full post-quest Sedarias/Javek switches. The table and a private companion script cross-reference are retained for that follow-up.

## Loyalty, departure and quests

Alignment chooses a reaction array for Altruistic/Kind/Cruel/Malevolent actions; only present eligible non-hireling player characters receive it. Authority scales negative reactions. Authored explicit loyalty changes supplement those categories. This supports different opinions, not autonomous companion planning. `Caravan:1355-1399`; prior F55.

Warning and critical records use separate bands. A large loss can cross straight into departure; warning is not guaranteed. Individual critical branches fail whichever personal journal is active, with some item/passenger exceptions, before removing the actor. The newly read `Loyalty_Critical_Javek` has four active-quest failure branches plus a no-active-quest removal branch. Harvek and Renkailon likewise select quest-dependent cleanup. These are not one generic remove-everything operation. Prior pass traced all 25 then-named warning/critical records; this pass reused that completed scope and extended recruitment consumers.

Quest caps are milestone-specific: default Prowess cap 3; completion of first, second or third qualifying journal permits 5, 7 or 9. The method tests highest completion first. Criftaa and Javek each have alternative third-journal completions. Trusted-tester builds bypass to 9. All 12 named companion cases in `GetMaxCharProwess:407-504` were read, including Vorax, Javek and Sedarias. This is a cap, not automatic level gain or evidence every quest path awards equal Insight.

**PROPOSALS:** preserve actor identity, learned abilities and memories across negotiated returns; separate departure reason, custody and unfinished promises; allow world-qualified reconciliation, sequential rival stories and repeatable earned options. YAIR's all-options direction does not require deleting consequences. A return can need changed conditions rather than a fixed once-only ban. [Companion owner](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md), [means owner](../../../MEANS_AND_APPRAISAL.md).
