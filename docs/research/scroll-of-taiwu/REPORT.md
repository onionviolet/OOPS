# The Scroll of Taiwu research, 2026-10-14

Build 25845203 is a full Windows payload. Read-only ILSpy inspection confirms a Unity client with a separate managed GameData backend. Taiwu links inherited knowledge and wealth, sect support, study, internal-force training and village work through a monthly world update. The strongest lesson for YAIRPG is that people and institutions can change the conditions of learning, rather than merely grant XP.

Status: PARTIAL. All four questions have bounded answers below; this is code and shipped-document research, not a playthrough or an exhaustive table audit. No game, Windows program or game assembly was executed, and no saves were accessed. Raw extracts stay in `~/.codex/research/taiwu/extract/`. Source keys in this dossier refer to those extracts from the installed payload, not upstream source code.

## Ranked PROPOSALS

These are research proposals, not accepted decisions or authorization to implement. Exact Taiwu caps, uniqueness rules, age thresholds and cosmology are source facts, not YAIRPG requirements. All fitting repeat, alternate acquisition and later improvement routes remain possible. First milestone stays one realm and one prestige layer. Proposed UI gates target 1440×900 laptop; mobile optimization is deferred.

| Rank / ID | Proposed result | Owner to consult | First useful proof |
|---|---|---|---|
| 1 / P1 | Separate a teacher's goodwill, institutional support and permission to study a method. Support can improve the study itself. | `docs/ENGINE_EXPANSION.md` institutional/world-profile contracts; `docs/LIFE_SIM_NORTH_STAR.md` people | Friendly teacher can offer a basic lesson; contribution or a second valid route grants a useful advanced lesson. Teacher departure changes support without erasing learned skill. |
| 2 / P2 | Preserve distinct succession channels: personal knowledge, owned objects, village assets, bonds and a life-earned legacy budget. | `docs/RULES_FROM_SCRATCH.md` heir; `docs/SELVES_AND_ECHOES.md`; `docs/ENGINE_EXPANSION.md` persistence | Successor receives the authored channels and keeps their own body and relations. Reload/import preserves each result and does not repeat transfers. |
| 3 / P3 | Make a damaged manual a useful object with page-level knowledge, reference copies and repeat study, rather than a consumed XP token. | `docs/SKILLS_AND_TALENTS.md`; `docs/ENGINE_EXPANSION.md` skills/mastery | Read an intact early page, use another copy to repair a knowledge gap, then apply the technique outside study. Cost and partial progress survive reload. |
| 4 / P4 | Let a named worker's skill, a maintained facility and available inputs jointly control one village output. | `docs/PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md`; `docs/ENGINE_EXPANSION.md` jobs/sites | Move one worker between study support and production; see the opportunity cost and use the output in an existing activity. |
| 5 / P5 | Give local internal-force methods separate reserve growth, allocation growth and compatibility consequences. | `docs/ENGINE_EXPANSION.md` energy policies; `docs/SKILLS_AND_TALENTS.md` methods | Two world-fitting training methods produce different usable outcomes; an incompatible choice has a known cost and a reachable recovery path. |
| 6 / P6 | Advance a small cast through ordered life, study, relationship and work phases with an understandable change report. | `docs/LIFE_SIM_NORTH_STAR.md`; `docs/ENGINE_EXPANSION.md` scheduler | A teacher studies, a worker completes a job and one relationship changes from a recorded cause. Combined and split advancement agree. |
| 7 / P7 | Keep definitions, mutable instances and translated descriptions separate; validate cross-table links. | `docs/ENGINE_EXPANSION.md` world registries and compatibility | One authored technique links to its manual, effects and institution. A broken link fails authoring validation with the exact field. |

Implementation packets and 24 small touches are in companion files. These adapt causal patterns using original code/content. They do not propose copying proprietary rows, prose or assets.

## Answers and evidence

| ID | Question | Bounded answer | Evidence class and source |
|---|---|---|---|
| F1 | Inheritance eligibility | Normal candidate list comes from the party excluding the current Taiwu; valid selection requires physiological age at least 16 and a suitable character template. Random succession finds or creates two candidates. It is not restricted to biological children. | shown: `TaiwuDomain.cs:13104`, `CalculateSuccessorCandidates` |
| F2 | Skills | The successor's learned life and combat skills are cleared in preparation, then replaced with the predecessor's. Combat instances are serialized copies with the successor ID; loadout, mastered skills, proficiency and looping selection also transfer. This is not a simple union of both characters' skills. | shown: `CharacterDomain.cs:8327`; `TaiwuDomain.cs:13237` |
| F3 | Objects and assets | Inventory objects, resources and XP move to the successor; old inventory/resources/XP are cleared. Equipment has a clothing exception. Village storage stays keyed to settlement, not the actor. | shown: `TaiwuDomain.cs:13237` transfer and `WarehouseAdd` |
| F4 | Relations | Party leadership, special groups and selected story bonds/favour records have explicit handlers. Ordinary family/romance/affection are not blanket-copied by the inspected transfer. Fixed-character favour transfer targets only templates 831 and 833. Full handler coverage remains open. | shown: `TaiwuDomain.cs:13320–13460`; `CharacterDomain.cs:23923`; scope inference for uncopied generic relations |
| F5 | Legacy budget | Actions award points by source row. Awards scale with world settings and a village effect, clamp to a per-source maximum, and unlock choices at half/full thresholds. Selected effects can alter people, buildings, regions and sect support. | shown: `TaiwuDomain.cs:12899–13050`, `ApplyLegacyAffect`; `LegacyPoint.cs` |
| F6 | Techniques | 955 compiled rows carry grade, sect, element, manual ID, public/nonpublic flag, requirements, direct/reverse effects, breakthrough data and internal-force fields. These include special/NPC techniques, not 955 player-learnable arts. | shown: `Config.CombatSkill.cs`, `Config.CombatSkillItem.cs`; verified structural count |
| F7 | Reading | Life manuals have five study pages and martial manuals six; strategies have three slots per page. Page condition, earlier unread pages, attainment, sect rules, references, facilities and world settings affect speed. Monthly study and active study are distinct. | shown: `TaiwuDomain.cs:15120`, `15449–15580`, `15859–16110`, `ActiveReadOnce` |
| F8 | Sect support | Support sums member approval and clamps to an upper limit. Teaching grade uses support; study has sect-specific substitutions and direction/page/behavior modifiers. At 40% support the reading modifier gains 25 percentage points. Personal affection is a separate concept. | shown: `Settlement.cs:258`; `OrganizationDomain.cs:1399`; `TaiwuDomain.cs:17012–17090` |
| F9 | Internal force | Looping produces reserve growth, qi-disorder changes and allocation progress. Compatible/countering elements alter benefit; references, maturity, profession, feast and world settings modify results. | shown: `CombatSkillDomain.cs:315`, `553`, `710`; `Character.cs:11558` |
| F10 | NPC life and time | Month advancement has ordered phases for status, self-improvement, supplies, relations, goals/actions, movements and settlement work. Aging occurs on birth month; actual and current ages can diverge. Pregnancy and death have explicit state transitions. | shown: `WorldDomain.cs:4520–4670`; `Character.cs:13692`, `13253`; `CharacterDomain.cs:7849` |
| F11 | Village economy | Worker skill contributes to construction progress; buildings have maintenance inputs, managers, stored outputs and capacity limits. Facilities can teach and improve study. | shown: `BuildingDomain.cs:1369`, `2129`, `2684`, `2761`, `9581`; `Config.BuildingBlockItem.cs` |
| F12 | Data shape | Large rule tables are compiled typed constructors in Shared, with separate language keys and reference-name maps. Mutable character, skill, item and building instances use independent domain identities. | shown: `ConfigData.cs`; `Config.CombatSkill.cs`; domain call sites |

## Prior-lane reconciliation

| Prior finding | Result | Current evidence / boundary |
|---|---|---|
| Acquisition queue at 17:00: Taiwu only has soundtrack; Unity unverified | Corrected for this later snapshot | Windows executable and Mono managed client present; manifest StateFlags 4, Windows depot 838351 installed, byte totals match. Main queue not edited. |
| Coverage-refresh snapshot: missing matching executable | Corrected for this later snapshot | Current Windows executable exists. This does not establish launch compatibility under notproton. |
| Absorption scout: fifteen sects, institutions, village industries, aging and inherited knowledge | Confirmed and extended | Backend identifies major sect IDs 1–15; compiled study, succession and month phases explain mechanisms. |
| Scout: teacher goodwill differs from institutional access | Extended | Support is an aggregate of member approval; support affects teaching grade and reading. Exact dialogue transactions are still unread, so no universal permission predicate is claimed. |
| Scout: succession conditional future work, no full population-sim requirement | Retained | P1 and P4 can be useful without implementing P2 or a whole-world actor census. Source breadth is not an adoption gate. |
| PROJECT: heir-only carryover is current code, not a design limit | Retained | Taiwu is one source-specific inheritance policy. Other worlds may have other channels and repeated lives. |

## Sources and limits

Installed source base: `/Users/weiwei/Library/Application Support/Steam/steamapps/common/The Scroll Of Taiwu/`. Backend source assemblies are `Backend/GameData.dll` and `Backend/GameData.Shared.dll`; shipped documentation is `The Scroll of Taiwu_Data/StreamingAssets/Language_CN/EncyclopediaAssets/`, with parallel EN files. Local extract hashes and payload fingerprint are in the work area.

The [official Steam description](https://store.steampowered.com/app/838350/) states the generational premise and learning across sects. The [independent guide](https://scrolloftaiwu.com/) was inspected only to locate current-version guidance; its limited catalogue is not a full technique-table count. Detailed mechanics above rely on the installed code and shipped documentation. Web access was read-only. No wiki dump was needed because the payload gate passed and richer local primary material was available.

Unread tables and runtime exclusions are listed in CHECKPOINT.md. No YAIRPG implementation, build, persistence test or human acceptance is claimed.
