# DLC gate coverage

SHOWN installed source scan, build 25205862. Paths relative to REPORT’s installation root. Counts are literal `has_dlc` occurrences after comment removal, including negated checks. They are neither unique content counts nor owned/enabled DLC counts. Wrappers and named scripted triggers can also gate content without another literal occurrence.

| Literal DLC name | Gate occurrences | Exact example |
| --- | ---: | --- |
| Arms Against Tyranny | 1213 | `common/achievements.txt:7733` |
| Battle for the Bosporus | 633 | `common/achievements.txt:3197` |
| By Blood Alone | 998 | `common/ai_strategy/ENG.txt:371` |
| Death or Dishonor | 190 | `common/ai_strategy_plans/CZE_alternate_strategy_plan.txt:7` |
| Gotterdammerung | 815 | `common/achievements.txt:1688` |
| Graveyard of Empires | 515 | `common/achievements.txt:717` |
| La Resistance | 1020 | `common/ai_strategy/ENG.txt:3272` |
| Man the Guns | 1268 | `common/ai_strategy/ENG.txt:970` |
| No Compromise, No Surrender | 1093 | `common/abilities/CHI_abilities.txt:64` |
| No Step Back | 950 | `common/ai_strategy/GER.txt:295` |
| Peace For Our Time | 224 | `common/achievements.txt:7735` |
| Poland: United and Ready | 47 | `common/characters/POL.txt:190` |
| Thunder at Our Gates | 552 | `common/ai_strategy/SIA.txt:288` |
| Together for Victory | 283 | `common/ai_strategy_plans/CAN_alternate_strategy_plan.txt:7` |
| Trial of Allegiance | 535 | `common/ai_strategy/ARG.txt:4` |
| Waking the Tiger | 219 | `common/abilities/generic_leader_abilities.txt:16` |

SHOWN `dlc/` and `integrated_dlc/` descriptors were included in the hash census. Integrated metadata contains Together for Victory, Death or Dishonor, Waking the Tiger and Man the Guns directories. The Man the Guns descriptor still names a dlc/ path; do not equate the physical descriptor location with the active rule mount. This pass does not infer user entitlement or engine treatment from that placement.

SHOWN module-wrapper gates: No Step Back, `common/units/equipment/modules/00_tank_modules.txt:58`; By Blood Alone, `00_plane_modules.txt:47`; Man the Guns, `00_ship_modules.txt:76`. SHOWN starting-history alternate tank/naval tech and OOB: `history/countries/GER - Germany.txt:103`. Generic manufacturer exclusions reference country-specific DLC replacements: `common/military_industrial_organization/organizations/00_generic_organization.txt:14`. These are actual rule gates, not merely folder names.

Two installed DLC ZIPs were inventoried read-only and contain zero rule text members under common/events/history prefixes. Gameplay rules are present in the shared script corpus, including DLC-specific paths. All gate families were counted; every gated campaign, organization, faction goal and event option was not semantically exhausted. No raw archive or game script is copied into the repo.


## Content reconciliation B472: complete scope and consumer evidence

All28 lines and sixteen DLC rows were reviewed with the report's H-C6 limit. Comment-stripped literal has_dlc occurrences include negations and repeated tests; they are not unique features, enabled purchases, campaigns or ownership. Scripted wrappers, starting-history alternatives and manufacturer exclusions can gate behavior without another literal occurrence. Shared-script rules, descriptor locations, integrated metadata and two ZIPs lacking rule-text members are different packaging facts. A descriptor's physical path does not prove its active mount or engine treatment. Neither the census nor plaintext presence establishes arbitrary DLC/mod removal from a saved game. Current [PROJECT](../../../PROJECT.md) and AD32/AD36 govern selected pattern use. No current depot, entitlement, archive, source script, installation, native game or save was inspected; this is complete reading of the saved gate record, not renewed HoI4 source/runtime coverage.
