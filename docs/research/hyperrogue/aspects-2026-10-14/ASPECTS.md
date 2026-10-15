# Aspect pass A01-A12

2026-10-14. Revision and evidence boundaries in [REPORT](../REPORT.md). SHOWN means source inspected; STATED means the game's help/declaration describes a behavior; INFERRED means a YAIRPG proposal or negative conclusion. No source or game runtime executed. Partial rows list bounded gaps, rather than silently claiming whole-system coverage.

## A01: Dialogue and conversation

Status: partial. Sources: `complex2.cpp:333-519`, `pcmove.cpp:1109,1355`, `complex.cpp:princess`.

SHOWN implementation / STATED delivery: Camelot uses state-conditioned ambient speech and named knights; Grail/radius/mode facts choose messages. A small cursor cycles available remarks. Movement transfers name identity. Princess rescue has separate scoped state, not a general conversation engine. Whole speech corpus and every princess branch remain unread.

INFERRED YAIRPG takeaways: K6/K20/K31, P21: original acknowledgements read real local achievement. K6/K11, P19: add a useful conversation consumer only if a chosen slice needs it.

## A02: Narrative delivery

Status: partial. Sources: `yendor.cpp:yendorinfo,check,collected`, `complex.cpp:princess`, `help.cpp:generateHelpForLand`.

SHOWN implementation / STATED delivery: Narrative arrives through help, action messages, objective paths, rescue and local acknowledgement. Yendor key-to-orb records carry quest progress and closure. No general novel-scale canon clock or career journal was established by this pass; full rescue narrative remains unread.

INFERRED YAIRPG takeaways: K11/K12/K16, P12: objective state and caused aftermath need distinct owners. K5/K15: neighboring lands are regions, not automatically separate worlds.

## A03: Implementation architecture

Status: covered. Sources: `hyper.cpp`, `content.cpp`, `classes.cpp:663`, `landgen.cpp:giantLandSwitch`, `environment.cpp:836`, `pcmove.cpp:589`.

SHOWN implementation / STATED delivery: C++ module set with X-macro metadata and code-driven rule consumers. A tiling graph underlies local generation. Turn processing orders environment and actors; shmup has an elapsed-time executor. Movement keeps reversible mutations and delayed committed effects. Coverage is architecture for this lane, not every engine module.

INFERRED YAIRPG takeaways: K2/K13/K34, P14/P16: validate the actual consumers of a local law. Start/branch IR1-IR4: use typed native effects rather than porting globals.

## A04: Save and persistence

Status: partial. Sources: `system.cpp:applyBoxes,saveStats,loadsave,load_last_save`, `game.cpp:teleportToLand,activateSafety`, `savemem.cpp:96`, `config.cpp`.

SHOWN implementation / STATED delivery: Versioned append score records and positional numeric boxes preserve selected run fields; Safety regeneration and separate settings/map-stream paths have different lifetimes. Faraway-memory cleanup can discard terrain history. No complete save graph, atomicity, migration matrix, corruption recovery or offline-reward guarantee was established.

INFERRED YAIRPG takeaways: K18/K33, P16/P24: definitions, run ledgers and actual retained world state differ. P23: retain YAIRPG complete native envelope; do not replace it with score-box reconstruction.

## A05: AI and NPC behavior

Status: partial. Sources: `monstermove.cpp`, `passable.cpp:353,494`, `environment.cpp:computePathdist,monstersTurn`, `content.cpp:NATIVE`, `complex.cpp:hive,dragon,kraken`.

SHOWN implementation / STATED delivery: Movement/path and monster classes have local legalities, segmented bodies, pace and hostility exceptions. Witch/golem pursuit is limited by region; cave and electricity consumers also read creatures. NATIVE classifies local reward relevance separately from AI. No comprehensive planner, autonomous career schedule or general social faction life was shown.

INFERRED YAIRPG takeaways: K10/K13/K15, P14: imported creatures retain actual movement/body constraints. K6/K7, P25: do not infer a general NPC society from tactical actors.

## A06: UI and information design

Status: partial. Sources: `help.cpp:378,788`, `hud.cpp`, `checkmove.cpp:moveissue`, `inventory.cpp:616`, `yendor.cpp:tactic menus`.

SHOWN implementation / STATED delivery: Context help combines metadata, requirements and special rules; HUD shows run resources; movement issues explain named causes; mode menus separate local records. Source structure inspected, no display or keyboard usability exercised. Public help is more omniscient than YAIRPG character knowledge.

INFERRED YAIRPG takeaways: K11/K14/K30, P04: project actual command blockers into a known local rule panel at 1366x768. Keep useful desktop panels independent; mobile deferred.

## A07: Content authoring and modding

Status: partial. Sources: `content.cpp:header`, `classes.cpp:663`, `landgen.cpp`, `wfcgen.cpp`, `mapeditor.cpp`, `hyper.cpp`.

SHOWN implementation / STATED delivery: Content metadata is centralized with stable enum-order guidance, but new mechanics need C++ consumers. Eclectic City calls WFC generation and repairs mixed borders. Editors, pattern tools and devmods are found, not fully audited. No universal data-only mod API or load-order contract is established.

INFERRED YAIRPG takeaways: K1/K33/K34, P16/P22: compile/lint references and preserve revisions. A catalog row is not implemented local law.

## A08: Balance and numbers

Status: partial. Sources: `hyper.h:458-479`, `landgen.cpp:49,190,313,1054`, `orbgen.cpp:orbprizefun`, `complex2.cpp:variant`.

SHOWN implementation / STATED delivery: Treasure and kills feed distinct spawn formulas; PT substitutes mode-dependent rates, custom lists scale them and chaos multiplies some rates. big_unlock changes unlock thresholds. Trait bits jointly affect hazards and reward rates. No full RNG audit, simulated balance or big-number progression was performed.

INFERRED YAIRPG takeaways: K3/K10/K13/K34, P14/P17: show the selected local cost rather than normalizing all power systems. Keep source balance numbers as examples, not accepted YAIRPG rates.

## A09: Time and scheduling

Status: covered. Sources: `environment.cpp:836`, `orbs.cpp:87,132`, `shmup.cpp:2638-2775`, `complex.cpp:heat,clearing`.

SHOWN implementation / STATED delivery: Normal play advances turn phases; power use/decay and Speed alter consumers. Shmup advances clamped elapsed simulation with focus/pause handling, projectile motion and periodic environment updates. This bounded scheduling read shows distinct play clocks, not browser-closed catch-up or a lived calendar.

INFERRED YAIRPG takeaways: K18/K26/K28/K32, P13: explicit local clock and absence policy. Do not turn real-time rendering delta into idle job rewards.

## A10: Onboarding and reveal

Status: partial. Sources: `landlock.cpp:276,323`, `orbgen.cpp:35`, `help.cpp:788`, `tour.cpp`, `yendor.cpp:987`.

SHOWN implementation / STATED delivery: Treasure/kills unlock regions and powers; local orb availability commonly grows into hub and foreign availability. Per-land help explains requirements. Tactics depends largely on prior accomplishment; Yendor Challenge follows a normal victory. Guided tour exists but was not followed.

INFERRED YAIRPG takeaways: K4/K11/K13, P04/P09: earned use can teach a local grammar. Retain default/dial access for YAIRPG solo options; no universal mode qualification.

## A11: Little touches

Status: partial. Sources: `help.cpp`, `checkmove.cpp`, `complex.cpp:tortoise`, `complex2.cpp:camelot`, `items.cpp:pickup sounds`.

SHOWN implementation / STATED delivery: State-aware warnings, dynamic help, matching cues, contextual speech, named actors and distinct pickup sounds make rules legible. Sound/graphics implementation symbols were inspected; perceived quality, accessibility and timing were not tested. 28 original touches are proposed in SMALL_TOUCHES.

INFERRED YAIRPG takeaways: K14/K19/K20/K30, P04/P15/P21: give each cue a real state reader. Visual and human-feel acceptance stay open until a selected UI change is rebuilt and exercised.

## A12: Other systems

Status: partial. Sources: `achievement.cpp:126`, `yendor.cpp:tactic,yendor`, `inventory.cpp`, `complex2.cpp:dice`, `landlock.cpp:90`.

SHOWN implementation / STATED delivery: Mode-qualified achievements, consecutive-run scoring, stored orb activation economy, sentient-die orientation puzzles and specialized land structures reuse content under different rules. Full optional subsystem and achievement catalogs were not behaviorally audited.

INFERRED YAIRPG takeaways: K16/K17/K34, P14/P15: reusable content supports several chosen rule sets. Do not copy competitive restrictions into ordinary solo play.
