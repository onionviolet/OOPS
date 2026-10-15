# Small touches

All T01-T28 are INFERRED PROPOSALS for original YAIRPG content. Source locations identify the mechanism or stated help that inspired the touch, not proof that YAIRPG implements it. Choose only touches useful to the current slice. Counts are not a new acceptance barrier.

| Code | Touch | Proposed behavior | HyperRogue locator | Kit | Synthesis |
|---|---|---|---|---|---|
| T01 | Local rule beside action | A discovered place explains the rule that changes this action. | `help.cpp:788` | K2 K14 | P04 |
| T02 | Orb source shown | Known carried power points to its original acquisition place. | `orbgen.cpp:orbinfos` | K3 K9 K15 | P11 |
| T03 | Charges and activations differ | Stored activation stock is shown separately from active duration. | `inventory.cpp:remaining; orbs.cpp:reduceOrbPower` | K3 K14 | P17 |
| T04 | Departure preview | Show the exact one carrier that changes on this crossing. | `pcmove.cpp:1872` | K15 K14 | P05 |
| T05 | Danger has a named cause | Blocked movement names current, wind, gravity or another actual cause. | `checkmove.cpp:moveissue` | K10 K14 | P04 |
| T06 | Helpful foreign property | A carried source can improve a local process rather than only lose power. | `complex.cpp:livecaves` | K2 K13 K15 | P14 |
| T07 | Safe alternative visible | Explain an available route after a rejected dangerous action. | `pcmove.cpp:wouldkill` | K5 K14 | P01 |
| T08 | Local temperature cue | Known thermal state explains why a path is changing. | `complex.cpp:heat` | K19 K28 K30 | P11 |
| T09 | Terrain records combat | A defeated threat can leave an actual useful obstacle or support. | `classes.cpp:trollhelp; landgen.cpp:buildRedWall` | K5 K10 K29 | P12 |
| T10 | Match quality cue | Show legitimate partial similarity rather than a hidden yes/no puzzle. | `complex.cpp:tortoise::measure` | K9 K11 K30 | P15 |
| T11 | Identity stays when moved | Move the object and its retained properties together. | `items.cpp:443` | K9 K18 | P16 |
| T12 | Witnessed achievement acknowledgement | One resident reacts to real local success. | `complex2.cpp:roundTableMessage` | K6 K20 K31 | P21 |
| T13 | Speech changes after return | Select a new local acknowledgement from retained progress. | `complex2.cpp:knightFlavorMessage` | K6 K29 | P21 |
| T14 | Names travel with actors | A named resident retains the same name after moving. | `complex2.cpp:move_knight` | K6 K20 | P15 |
| T15 | Nested place breadcrumbs | A known local formation identifies its containing region without calling it a new universe. | `landlock.cpp:get_superland` | K5 K11 K15 | P04 |
| T16 | Optional completion marked | Separate optional local tasks from the current journey objective. | `help.cpp:hyperstone_optional` | K11 K16 | P04 |
| T17 | Missing route conditions explained | Describe a known unmet condition independently from spawn chance. | `landlock.cpp:landUnlocked; getNewLand` | K4 K5 K11 | P04 |
| T18 | Useful terrain timing | A scheduled local change has a readable phase cue. | `environment.cpp:advance_tides` | K5 K28 K32 | P13 |
| T19 | Power context warning | Distinguish dangerous, ineffective and locally forbidden use. | `inventory.cpp:616` | K3 K11 K14 | P04 |
| T20 | Practice record separate | Practice accomplishment does not imply prior goods entered the main journey. | `yendor.cpp:tactic::record` | K16 K17 | P14 |
| T21 | Mode clock shown | A practice variant states whether time is turns, elapsed play or frozen absence. | `shmup.cpp:turn` | K4 K18 K32 | P13 |
| T22 | Known route progress | Show progress toward the particular objective, not a generic key count. | `yendor.cpp:yendorinfo` | K5 K11 K12 | P12 |
| T23 | Earned native method | A demonstrated local technique later solves a problem abroad under the destination law. | `orbgen.cpp:LOCAL10/CROSS10/GLOBAL25` | K3 K13 K15 | P09 |
| T24 | Local material payoff | A lawful terrain interaction produces a real material. | `complex.cpp:elec::affect` | K9 K13 K29 | P02 |
| T25 | Rest matters locally | A local waiting cost or benefit is visible before choosing to idle there. | `content.cpp:laMotion; orbs.cpp:reduceOrbPower` | K2 K13 K32 | P13 |
| T26 | Foreign creature response | A local process reads an imported creature property using its real actor state. | `complex.cpp:livecaves` | K6 K10 K15 | P14 |
| T27 | Unknowns stay unknown | Adapt contextual help through actor knowledge rather than exposing every land. | `help.cpp:generateHelpForLand` | K11 K14 K30 | P11 |
| T28 | Revisit state retained | A return shows changed places from their existing owner, not regenerated defaults. | `savemem.cpp:save_memory as counterexample` | K18 K29 K33 | P16 |
