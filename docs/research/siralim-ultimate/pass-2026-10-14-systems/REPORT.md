# Siralim Ultimate: undocumented systems sweep

Lane `ds-siralim-ultimate`, research wave 2026-10-14, finished after resumption on 2026-10-15. **Status: PARTIAL.** The dossier now covers fifteen deeper system groups and all 146 inventory/reference rows in ten families. Eighteen additional native helpers returned pseudocode. Nothing was implemented in YAIRPG, launched, installed, staged, committed or pushed.

## Corrections and extensions first

| Code | Earlier pass / tempting conclusion | Current evidence and correction |
|---|---|---|
| C1 | Save domains were only named; whole save remained unread | **SHOWN:** paired creature, project and decoration serializers now expose real fields. This closes those selected body reads within prior U4/U5, while whole-save completion, recovery and roundtrip remain OPEN. [D15/N16-N18](SYSTEMS.md#d15-domain-serialization-reconstruction-and-unresolved-publication). |
| C2 | A knowledge rank can be read as one generic counter | **SHOWN:** `scr_KnowledgeGetRank` reads `kills`; `GetRank2` reads `knowledge`, with thresholds ten times higher and a guard. Which current consumer selects which reader is unread. Do not mix them into one formula. [N19/N20](SYSTEMS.md#n19n20-rank-thresholds). |
| C3 | Personality growth is always 40%/20%/30% | **STATED:** that is ordinary help behavior. **SHOWN:** the native helper returns 30% in biome ID 21. Its named context and final-stat caller remain unjoined. [N29](SYSTEMS.md#native-trace-supplement-exact-static-observations). |
| C4 | A project is a timer, or a mission implies autonomous companions | **SHOWN:** completion predicate reads dust, parts and six item counters; no clock read occurs in that predicate. **STATED:** repeatable missions give selected knowledge, favor or material rewards. This does not establish absent-player labor. [D02/N21-N24](SYSTEMS.md#d02-projects-repeatable-missions-and-service-progression). |
| C5 | Cooking/breeding names prove playable life-sim systems | **SHOWN:** cooking has an ingredient/style lookup body; breeding and recipe remnants also exist. Their reachable UI and retention are not proved. Keep both as uncertain, not absent or verified playable. [D05/D06](SYSTEMS.md#d06-cooking-and-recipe-discovery-uncertain-reachability). |
| C6 | Every realm quest awards specialization points | The realm introduction is broad; specialization help qualifies points to highest-ever depth. Preserve that qualification. **STATED**, exact payout consumer unread. [D13](SYSTEMS.md#d13-events-dialogue-and-narrative-state-are-not-one-table). |
| C7 | Serialization field symmetry proves compatibility | **SHOWN:** the project loader clamps negative quest count to zero; creature loading has a conditional GUID repair. Creature `note` appears in the load field list but not the observed save field list. These need key/default/caller joins, not a claimed migration chain or reproduced note-loss bug. [D15](SYSTEMS.md#d15-domain-serialization-reconstruction-and-unresolved-publication). |

The prior pass's boundaries still hold: fusion visuals differ from semantic fusion, localized rows differ from active entities, generated realms differ from persistent societies, and source evidence differs from playable adoption. Existing realm pools and combat queue gaps were not silently closed.

## What the deeper pass adds

**F1, learning links to real acquisition.** Knowledge opens Hunt, candle targeting and Assassination; each has separate rank, stock or availability checks. This is more useful for YAIRPG than an isolated Bestiary percentage. The source's kill-based learning is one local rule, not a proposed universal learning route. [D01](SYSTEMS.md#d01-knowledge-recruitment-and-targeted-acquisition).

**F2, a lasting home connects renewable trips.** Projects unlock or improve home services; repeatable missions and refinery recovery keep acquired materials useful afterward. Inputs, access, instance identity and completion are separate state. [D02-D03](SYSTEMS.md#d02-projects-repeatable-missions-and-service-progression), [D07](SYSTEMS.md#d07-castle-decoration-as-service-placement-and-authored-speech).

**F3, distinct layers make a large build legible.** Primary identity, fused body traits, personality voice, card membership, patron favor, spendable emblems, relic assignment and anointment loadout have different lifetimes and readers. The most reusable lesson is to join actual owners, rather than copying the source's rank ladders or caps. [SYSTEMS](SYSTEMS.md).

## Ranked PROPOSALS

These are selectable research proposals, not accepted product decisions, new priorities or required Foundation gates. Existing canon-first direction and one-realm/one-prestige milestone remain in force. The current selected slice has its own live owner; this lane does not displace it.

| Rank / code | Original YAIRPG result | Owner routing | Kit / synthesis |
|---|---|---|---|
| 1 / DS-P01 | A learned local fact opens a useful, targeted observation or material route with an honest blocker | [Technology](../../../TECHNOLOGY_AND_PROGRESSION.md), [means/appraisal](../../../MEANS_AND_APPRAISAL.md) | K9/K11/K13; P03/P04/P11 |
| 2 / DS-P02 | A paid home project consumes trip-earned stock and changes an existing service | [Production palette](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md), [life-sim palette](../../../LIFE_SIM_NORTH_STAR.md) | K8/K9/K13/K25; P02/P06/P12/P18 |
| 3 / DS-P03 | A body change states who continues and which faculties, learning and equipment actually survive | [Genetics/body palette](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md), [companions](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md) | K3/K6/K15/K22; P05/P15/P16 |
| 4 / DS-P04 | One institution offers a useful service through separate standing, permission and funded stock | [Life-sim palette](../../../LIFE_SIM_NORTH_STAR.md), means/appraisal | K7/K8/K21/K29; P07/P18 |
| 5 / DS-P05 | Disassembly quotes what is destroyed, returned and usable in another real recipe | Production palette | K8/K9; P02/P18/P16 |
| 6 / DS-P06 | An optional task occurrence supports claim-now or continue, retaining partial progress without duplicate rewards | [Events](../../../CHARACTERS_AND_WORLD_EVENTS.md), [authoring](../../../ENGINE_AUTHORING.md) | K12/K13/K16/K18; P10/P12/P24 |
| 7 / DS-P07 | A companion's original voice reads a retained known disposition without implying unearned memory | Companions and genetics/body palettes | K6/K20/K31; P15/P21 |
| 8 / DS-P08 | A routine shows intent, next useful action and actual stop reason in its existing home | [UI owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md), [UI rules](../../../UI_RULES.md) | K11/K14/K26/K30; P01/P04/P08 |

[Implementation packets](IMPLEMENTATION_PACKETS.md) give scope and observable adoption gates. [Small touches](SMALL_TOUCHES.md) has 26 sourced details. None requests a new global engine, mandatory hunger, lifetime acquisition bans or a second prestige layer. Source once-per-occurrence constraints stay source observations; YAIRPG keeps all reasonable later options reachable.

## Inventory and owner gaps

[FAMILY_MAP.json](FAMILY_MAP.json) includes every row in the prior inventory, all prior U1-U8 gaps, and 36 explicit semantic splits. Counts overlap: a table, a database entry point and a gameplay system are different inventory rows, not three unique features.

| Family | Rows | Deep reads |
|---|---:|---|
| Knowledge | 3 | D01 |
| Production | 9 | D02/D03/D06 |
| Body and companions | 16 | D04/D05 |
| Institutions and economy | 5 | D08/D09 |
| Events and dialogue | 14 | D10/D13 |
| Combat and progression | 47 | D09-D12 |
| World and home | 17 | D07 plus retained prior realm work |
| UI and automation | 6 | D14 |
| Authoring | 22 | Cross-cutting definitions and localization |
| Save | 7 | D15 |

**O1, partial coverage:** targeted acquisition, experimental recipe discovery and collection synergy have broad knowledge/production/ability routing, but no dedicated complete policy was confirmed in the owners read. These are bounded joins to inspect, not reasons to create new owner files now.

**O2, no dedicated owner found:** side-game odds and payout policy has only adjacent trials/UI routing. Its low priority and unread probabilities make it a later option. This is a scoped search result, not proof the whole repo lacks any relevant work.

**O3, source gap:** reachable breeding, autonomous social lives, aging/offline simulation and persistent societies were not established. Genetics, companions and life-sim palettes cover the YAIRPG interests; Siralim does not supply proof of those mechanisms here.

## Evidence and delivery

[CHECKPOINT](CHECKPOINT.md) reconciles U1-U8 and preserves a fresh per-system unread ledger. [TOOLING](TOOLING.md) records exact tools, corrections, commands and pins. Full text, multilingual tables, topic indexes, native bodies and field summaries remain private in [the work area](/Users/weiwei/.codex/research/ds-siralim-ultimate/); earlier raw tables and fifteen native bodies remain read-only inputs under `~/.codex/research/mw-siralim/`. No raw game prose or code is copied into the public dossier.

The resumed verification checks file presence, JSON, inventory coverage, native-return status, private manifests and local links. No source-game or YAIRPG gameplay, build, browser, installation or save-roundtrip claim is earned. Selected adoption still needs the existing owner's natural useful-action proof and affected persistence gates; user taste and balance acceptance remain separate.
