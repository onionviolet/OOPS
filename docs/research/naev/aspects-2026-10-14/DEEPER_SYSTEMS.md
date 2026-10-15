# Three deeper Naev joins

Static traces at `f8982244800e86553217a2dba555a0f41c2b87ba`. These are the highest-payoff joins left unclear by a directory inventory. Runtime edges remain open; this is not an exhaustive audit.

## NV-X1: Scene reservation is neither ownership nor selection

**Shown:** mission creation can call misn.claim and stop when it fails. claim.c stores system and string claims and exclusive/non-exclusive behavior: several non-exclusive claims can coexist but block an exclusive one. The mission loader sorts priority so early content can claim first, while board generation also sorts resulting offers. Mission cleanup destroys its claim; active claims are saved with mission state and restored through the source load path. Event dispatch activates claims after creating matching events.

**Why it matters:** a mission list with independent random rolls can still coordinate authored encounters. Selection policy, overlap reservation, acceptance and institutional permission solve different problems. Naev's claims do not convey land title or a legal right.

**PROPOSAL:** NV-N1 extends P10/P22 for a real conflicting scene only. Keep current candidates and response settlement. Quote any known conflict and preserve the existing pending occurrence until its declared release. Authoring tools should show claim collisions and unresolved Lua gates.

**Open proof:** abandonment, failed create, save/load and simultaneous claims must release/reacquire the intended reservation exactly. All event priority/caller interactions remain unread. A source claim helper is not proof against every double-spawn.

Sources: [`src/claim.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/claim.c); [`src/mission.c` (`mission_cleanup / missions_activateClaims / mission_parseFile`)](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/mission.c); [`src/event.c` (`events_trigger`)](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/event.c); [`dat/missions/tutorial/nelly01.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/tutorial/nelly01.lua). Kit K12/K18/K34; packet NV-P01.

## NV-X2: Rebuild equipment support while retaining the right carrier

**Shown:** player.c loads shipvars independently of equipped outfits; Bioship Manager reads shipvars, reconstructs the stage and re-enables saved skills by tier, registering hooks on ship swap, payment and landing. Its comments describe repair for slot-layout changes in older versions. Flow recalculates capacity and regeneration from the actual hull and equipped outfits. Chakra checks the current target, charge and cooldown when used; descriptions use its stat function. Psychic status is a player variable taught in a scene, while apparatus support is current ship state.

**Why it matters:** retained progress and derived support differ. Serializing a boolean is insufficient if loading equips the wrong apparatus or restores a skill into a changed slot. Source-dependent resources may be transient even where earned knowledge is durable.

**PROPOSAL:** NV-P02 extends P04/P09/P17 with a single real carrier and support reader. NV-P06 extends P24 for one supported restore. Restore earned identity first, validate compatible content, recompute derived support through real owners, and only then expose known usable actions.

**Open proof:** exact Flow charge across save/ship swap, all bioship respec/refund routes and concurrent fleet income are unread. Pay reason is ignored in the manager callback; no fraud-resistant XP provenance is claimed. Do not import source caps or this payment rule blindly.

Sources: [`src/player.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/player.c); [`dat/events/bioship.lua` (`update_bioship / bioship_pay`)](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/events/bioship.lua); [`dat/scripts/bioship.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/bioship.lua); [`dat/ships/lua/lib/flow.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/ships/lua/lib/flow.lua); [`dat/outfits/flow/abilities/seeking_chakra.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/outfits/flow/abilities/seeking_chakra.lua). Kit K3/K9/K15/K18/K33; packets NV-P02/NV-P06.

## NV-X3: A service unlock is a retained place-state transition

**Shown:** Antlejos common code stores cumulative supplies, resolves current phase from active diffs and removes any earlier project diff before applying its replacement. The delivery completion callback adds volume, pays, logs and advances at most one stage if thresholds qualify. Stage XML contains actual service and technology additions plus population and descriptions. save_data writes diffs first, and unidiff.c has typed hunk categories and tracks failed application.

**Why it matters:** growth can change the affordances of the same destination. A text recap is insufficient; the next visit must resolve to that retained place state. The source implements authored phases, not full simulated settlement inputs or independent resident agendas. Its callback sequence is not evidence of transactional storage across interruption.

**PROPOSAL:** NV-P03 extends P02/P12/P16 using existing conserved effects and a service consumer. One real delivery changes one phase and opens one useful action. Native pending work, destination identity and phase receipt should commit together in YAIRPG's existing publisher.

**Open proof:** interruption between pay and phase application, failed hunk application, old stage migrations and interactions with unrelated diffs need focused execution. The service must remain changed after Save/reload/Export/literal Import and departure/return, without duplicate rewards or erased residents.

Sources: [`dat/scripts/common/antlejos.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/scripts/common/antlejos.lua); [`dat/missions/neutral/antlejos/ant_supplies.lua`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/missions/neutral/antlejos/ant_supplies.lua); [`dat/unidiff/antlejosv_9.xml`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/dat/unidiff/antlejosv_9.xml); [`src/unidiff.c`](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/unidiff.c); [`src/save.c` (`save_data`)](https://github.com/naev/naev/blob/f8982244800e86553217a2dba555a0f41c2b87ba/src/save.c). Kit K5/K8/K12/K16/K18/K29; packet NV-P03.
