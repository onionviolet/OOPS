# H2 extended: settlements change through lived events

2026-10-14. **PROPOSAL ONLY.** Extends [root H2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#h-places-that-remember). Reuse [place episodes](PLACE_MEMORY.md), [P9 profile rules](../p9/PROFILE_RULES.md), [P7 people](../p7/GUIDELINES.md), [P19 social lane](../p19/CHECKPOINT.md) and [P21 conflict/economy lane](../p21/CHECKPOINT.md). P20 adds settlement state readers and visible evolution, not population, markets or faction engines in parallel.

## H2.1: fixed geography, mutable habitation

Authored nodes, routes, room boundaries, landmarks and source topology remain fixed. Generate occupancy, condition, installed supported fixtures, activity schedules and scenes within those nodes. A vacant authored shop may gain a proprietor; a burned building retains its site identity and can be restored through real work. A new building uses an explicitly authored eligible site/structural class; this proposal never draws a new street, canon landmark or floorplan. [P6 BUILDINGS](../p6/BUILDINGS.md) owns plans/materials/phases/installation. Where P6's wider geometry proposals exceed P9's boundary, use pre-authored layouts here; no silent geometry exception.

Canonical destruction or moving space can use separately authored state revisions when P13/source owners qualify them. It must not be implemented by mutating a shared location template across every save or branch. Law and premise changes stay with P13, not a prosperity threshold.

## H2.2: five dimensions with independent causes

| Code / dimension | Actual inputs and writers | Readable consequence and useful next content |
|---|---|---|
| H2.2a Population | P4/P19 admitted residents, household transitions, actual arrival/departure and selected life-state receipts; aggregate cohort only where explicitly modelled | More occupied beds, a new apprentice request, fewer available specialists after departure. Permanent residents, commuters, visitors and refugees are distinct counts. Named people count within, not in addition to, their cohort. |
| H2.2b Buildings/services | Authored site, paid P6 phases, installation, damage/removal and actual staffing/access | A covered workbench remains usable in an admitted rain exposure; a staffed repaired shop offers a real service. An unfinished frame supplies no shelter or production. |
| H2.2c Prosperity/distribution | P8/P11/P21 real supply, funded wages, delivery/production, owned reserves and current liabilities | A known repair-material shortage creates a funded order; households can disagree about a boom. A receipt for circulating the same coin is not unlimited new wealth. Prosperity does not mint money or alter every price. |
| H2.2d Mood | Particular participants' actual losses, successes and received reports, with coverage/sample basis | Neighbors celebrate reopening, a displaced resident remains distressed, and a newcomer may be unaware. Use qualified summaries such as interviewed workers, not omniscient village happiness. Mood guides expression/plans, not automatic consent. |
| H2.2e Culture | Repeated real practices, teaching, migration, patronage and organized occasions through P6/P11/P19 | A recurring repair demonstration acquires a local custom after people actually repeat/teach it. Song/account production stays P14/P6. Tradition can coexist with dissent, adoption and abandonment. |

These dimensions can diverge: prosperous merchant, damaged housing, hopeful rebuilding, unpopular administration. Avoid one scalar that manufactures all five. Species/culture/wealth never stand in for morality or personality; P7's sampling and canon-reservation rules apply. Comfort and useful meals remain available without introducing hunger death or mandatory household upkeep.

## H2.3: yearly evolution without annual invention

A settlement view is a projection over existing owners plus minimum retained transition records. Proposed view references: instance, authored settlement node set, coverage interval, resident/cohort owner refs, site revisions, economic summary refs, known mood accounts, practice/occasion refs and last explained changes. It stores no duplicate inventory. If a dimension lacks a supported writer, show unsupported/unknown or omit it, never invent a balanced census.

During eligible played time, process actual scheduled causes. At month/year close, summarize the deltas already committed; closing a year twice never applies them twice. Longer periods can summarize routine service while keeping significant arrivals, rights transfers, damage and restoration exact. Coarse distant cohorts require an explicit transition resolver with funds/means and stable child IDs; moving the camera closer must conserve membership and not roll a fresh population. Their simulation and sampling remain P19/P4 work, not assumed complete here.

For longer lives, present snapshots at local year boundaries and the intervening causes. Example original sequence: a real supplied repair reopens one existing station; a funded willing worker joins its actual roster; observed repeated demonstrations become a local practice; later departure changes staffing without deleting the building or the practice's record. A hundred played years cannot invent thousands of residents from a prosperity multiplier. Births, aging/death, war/refugees and offscreen catch-up each require their selected world owners.

## H2.4: source seams and limits

| SHOWN/SOURCE locator | Verified structure, without execution | Extension gap |
|---|---|---|
| `src/models/location.js:163-218`; `src/data/locations.js:330-339,396-409` | Authored connections, NPCs, housing/crafting; changing rat description; fixed Shack shelter and sleeping availability | No inspected general population/prosperity/culture record; do not replace existing rat counts with narrative claims. |
| `src/world_instances.js:97-123,365-385` | Instance/era and strictly bound scalar facts; site state currently exactly `{open}`; updates use revision guards | Do not append condition/occupancy fields to this exact validated schema. A selected adapter or explicit compatible revision is required. |
| `src/simulation_contracts.js:297`; `src/site_projects.js:4-25` | Actual site capacity/reservations; acyclic phases compiled into existing jobs and world facts | Building count does not raise capacity, open every station or create staff. Bind each real installed consumer. |
| `src/audit_remainder_home_facts.js:85-97,243-252` | Room completion, actual occupant, residence claim and cause remain distinct | One narrow residence is useful precedent, not a generic settlement. Preserve its existing exact once-only invitation decisions. |
| P4 read-only worktree [REPORT](../../../../../.claude/worktrees/proc-p4-people/docs/gm/dispatch/procgen-2026-10-13/p4/REPORT.md), Play route A3 | STATED-worker: supplied travelers can settle, in a separate store | Main integration and canonical actor/residence mapping still need root proof. Never infer whole census from three travelers. |

## H2.5: connected prototype and acceptance

Candidate S20-2: one optional settlement board at one already authored Village site, or one source-qualified canon site with equivalent supported means. Bind actual population coverage and existing facilities. Complete a paid fit-out and one funded residence/service transition; watch the board change condition, occupancy and availability with causes. Later generated work reads that state. Show prosperity only through a supported local delivered-work indicator, mood through received accounts and culture through an explicitly organized/repeated practice. Broad demographic/price/war changes are further reachable proposals, not fabricated outputs of this proof.

Cost medium/high because actor IDs, site rights, custody and calendars join. Dependencies: S20-1's place references, P6 physical consumers, P4/P19 identity if generated residents are used, P11 funded request/context; P21 only for genuine economic changes. No compulsory Frontier opening for canon play.

All future gates OPEN: actual site change alters a real job; completed occupancy and departure conserve claim/person membership; named/cohort counts never duplicate; two branches remain independent; one year closes once and multi-year SOURCE traces preserve all committed causes; natural early work plus labelled seeded-native long-window examples show visible evolution without calling simulated years natural play. Save/reload/literal import retain pending phases, funds, staffing, summaries and next draws. Legacy enrollment begins now, unchanged old saves acquire no fabricated past/census. Same geography/connection IDs before and after; rebuilding records a new transition instead of erasing damage. Desktop targets 1366×768 and 1600×1000, mobile deferred.
