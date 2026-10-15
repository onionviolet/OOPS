# Fifteen deeper systems

2026-10-14, lane `ds-hyperrogue`. Static reading at the source pin in [TOOLING.md](TOOLING.md). **SHOWN** means inspected source structure, not runtime observation. **STATED** is help/declaration text. **INFERRED** marks negative bounds and all YAIRPG adaptations. No game, executable, build, source save or YAIRPG runtime was used.

These systems were selected from prior named/unread entries for companions, knowledge, bodies, useful environmental processes, events, content and retention. Fifteen bounded reads do not close every exception in their host modules. HyperRogue is a tactical source; no broad life economy, inheritance, tech tree or production-chain engine was established. Those are bounded negative findings, not proof that every optional extension lacks them.

Owner mappings describe design routing, not runtime readiness or authorization. Topic prefix key: `chains` = MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md; `technology` = TECHNOLOGY_AND_PROGRESSION.md; `body` = GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md; `kit` = WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md. The selected Village P01 priority remains intact.

## DS01: Rescue as an escort state machine

Sources: [complex.cpp:503-816](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L503), [monstermove.cpp:1630-1785](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/monstermove.cpp#L1630), [system.cpp:1258-1265](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/system.cpp#L1258), [system.cpp:1879-1880](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/system.cpp#L1879).

**Data model, SHOWN.** `princess::info` stores id, original prison pointer, alternate-map pointer, best escort distance, best player approach, frozen rug value, current companion cell and last safe together-turn. Global flags distinguish current rescue, historical rescue, challenge, warning and revival threshold. These are scoped quest records, not a universal person schema.

**Rules, SHOWN.** Distance sentinels are OUT_OF_PRISON=200 and OUT_OF_PALACE=250. `setdist` only advances bestdist when newdist is larger and below ALTDIST_ERROR. Reaching 250 marks saved/everSaved and increments the saved-princess item; challenge reaching 200 records the frozen score. `playernear` freezes rug value when bestnear crosses from >100 to <=100. `save` removes an untracked or barely progressed companion (bestdist<=3), otherwise advances it to 200 outside Euclidean mode. An unarmed companion's successful revenge attack changes its type to armed in `movegolems`. Safe adjacency produces a hug only when turncount > together+20, then updates together. The safety test scans neighboring active enemies. Revival searches a passable cell and restores an armed companion with palaceHP(), reusing an escaped record where possible.

**Connections, SHOWN with bounded inference.** Movement updates the quest pointer; challenge score reads actual approach-time possessions; combat changes future companion behavior; rescue increments a treasure ledger and achievement readers. Orb Strategy's prior apparent forbidden-history mismatch remains relevant to achievement eligibility, not rescue's existence.

**Authoring, SHOWN.** C++ conditions and constants author the arc; no dialogue graph or configurable relationship table. New stages need movement, generation, messages and restore readers.

**Persistence, SHOWN fields with limits.** Normal score save stores counts separately for unarmed/armed companions plus HP totals, then restoreGolems rebuilds them. The inspected score and map serializers do not emit the full info vector, prison pointers or together timestamps. Map cells preserve companion type/HP, but that alone does not preserve the quest's whole identity/history. No exact escort reload is claimed.

**Closure and unread.** Closed: unread rescue milestone, revenge, revival and source speech bodies. Open: all prison generation alternatives, princess_ai gate search, every death/mode caller and native roundtrip.

**YAIRPG, INFERRED.** PROPOSAL: extend a retained YAIRPG companion's useful escort outcome and a later action, keeping actor ID, quest record and relationship distinct. Do not import jealous attacks as a default social rule.

Routing: K6, K10, K12, K16, K18, K29; P06, P12, P25. Owners: [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md), [WORLD_CORE_KIT_2026-10-14.md](../../../worlds/WORLD_CORE_KIT_2026-10-14.md). Topic rows: body:MT4, kit:KW1, kit:KW4.

## DS02: Ambient speech, acknowledgement and named knights

Sources: [complex2.cpp:333-519](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex2.cpp#L333), [complex.cpp:706-816](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L706), [pcmove.cpp:1109](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp#L1109), [pcmove.cpp:1355](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp#L1355).

**Data model, SHOWN.** Camelot has knight_names, a map from cell pointer to name-pool index and a scalar knighted value. `knight_name` assigns a random pool index lazily; indices can repeat. Princess speech and knight flavor each have one function-static msgid, shared across callers of that function, captured by changes for rollback.

**Rules, SHOWN.** Knight flavor wraps at 32 and skips ineligible slots until one matches; princess speech wraps at 127. These bounds are cursor spaces, not line counts. Knight conditions read Grail found, radius versus newRoundTableRadius, geometry, tactics/peace/full-game flags and treasure/rescue progress. Round-table acknowledgement computes destination radial distance minus player radial distance: leaving with a found Grail sets knighted to current table radius; other directions/history choose other acknowledgement. Princess lines gate on palace/dungeon membership, distance <20, >=20 or >=70, armed state and peace. Mouse cues use missing record, rescue progress, missing companion, then distance bands >120, >90, >60 and >30 in that order.

**Connections, SHOWN with bounded inference.** Speech reads existing achievement and exploration facts. Mouse cues can teach a direction through an actor rather than an omniscient quest marker. No player answer graph or staged economic choice appears in these speech functions.

**Authoring, SHOWN.** Original text is authored as XLAT calls in C++ predicates; language files map source strings into translations. Full original text, IDs and conditions remain in private source captures. Repo prose paraphrases them. The default source speech bodies were read; translation parity was not audited.

**Persistence, SHOWN fields with limits.** `move_knight` transfers the map entry at commit. No serialization of knight_id or either static msgid was found in inspected core serializers or local save hooks. Name continuity is shown for runtime movement only, not Safety/map-load continuity.

**Closure and unread.** Closed: default Camelot/princess selection bodies. Open: translations, every talk trigger and persistence of incidental presentation state. The prior wording about stable knight IDs needs this narrower lifetime.

**YAIRPG, INFERRED.** PROPOSAL: P21 acknowledgement should read retained aftermath and actor knowledge; persist a real person ID separately from a display name. P19 remains a different useful-choice mechanism.

Routing: K6, K7, K11, K20, K31; P19, P21, P15. Owners: [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md), [WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md](../../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md). Topic rows: kit:KW1, kit:KW2, technology:FT5.

## DS03: Companion utility and lawful pathfinding

Sources: [environment.cpp:82-304](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/environment.cpp#L82), [monstermove.cpp:1500-1785](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/monstermove.cpp#L1500), [environment.cpp:836-869](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/environment.cpp#L836).

**Data model, SHOWN.** Transient pathdata owns a shared path queue and clears pathdist on destruction. golems is a work list containing multiple friendly species. Each candidate uses monster type, current cell, neighbor, attack flags, pathdist, hazard and plate facts. These are local utility scores, not jobs or a social planner.

**Rules, SHOWN.** `movegolems` skips stunned actors, compares stayvalue against each neighbor's movevalue, gathers ties and picks one with hrand_elt. Princess distance penalty is d for d<=3, else 10*d; pressure plates and trapdoors subtract 5. Tame bomberbirds remap approaching distance 1 to 5 or distance 2 to 4 when starting farther away. Mouse policy stays within prison radius 150 and biases toward the player when pathdist is 4..19, otherwise points toward the prison. `computePathdist` gives princesses friend/boat/chain movement flags and bomberbirds flying/friend flags; creatures and visibility block search. Orb-used state is restored after evaluating candidates. Empathy plus Slaying admits crush and can pay the actual powers on chosen attacks. Speed's extra phase can move allies via Empathy.

**Connections, SHOWN with bounded inference.** Passability and attack admission are shared consumers; real movement also moves a boat where supported and calls empathyMove. Friendly types become moved variants so the ordinary phase does not move them twice. These are useful examples of action order and actual movement means.

**Authoring, SHOWN.** Type-specific C++ movevalue/stayvalue branches plus passable_for and flags. Adding a friendly body needs path legality, utility, phase refresh and special effects, rather than only changing hostility.

**Persistence, SHOWN fields with limits.** Path queues, tie candidates and pathdist are derived transient state. Score Safety restoration carries counts for selected friend types, not general goals, supplies or commitments; editor map carries cell monsters. A YAIRPG plan needs its own existing saved actor/intent owner.

**Closure and unread.** Closed: selected friend chooser and path lifetime. Open: every stayvalue/movevalue branch, all princess gate-plate planning, and broad hostile AI. No offscreen household simulation shown.

**YAIRPG, INFERRED.** PROPOSAL: one helper should use lawful means for a useful task, with actual cost and a retained outcome; do not copy numerical tactical weights into social choice.

Routing: K6, K10, K13, K15; P06, P25, P08. Owners: [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md), [ABILITY_AUTHORING.md](../../../worlds/ABILITY_AUTHORING.md). Topic rows: kit:KW1, body:MT1.

## DS04: Attack grammar, stun and combat aftermath

Sources: [attack.cpp:82-181](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/attack.cpp#L82), [attack.cpp:391-438](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/attack.cpp#L391), [attack.cpp:478-550](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/attack.cpp#L478), [attack.cpp:1007-1062](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/attack.cpp#L1007).

**Data model, SHOWN.** An attack supplies source/target cells, source/target monster type and AF_* flags. Target cell holds HP, stun duration and orientation; global kills keeps history. Admission, stun-versus-kill, mutation and flavor/achievement readers are distinct functions.

**Rules, SHOWN.** `canAttack` rejects a must-kill attack if it only stuns; friend/enemy filters precede type counters. Dice accept magic/crush; ordinary bulls require magic, horns, sword-into or crush. Worm bodies are immune except named exceptions; a segmented body cannot attack itself or its mounted player through the inspected same-head check. Shield checking can use next-turn state. `attackJustStuns`: weak always stuns; horns use hornStuns; arrow traps use arrow_stuns; skeleton sword can kill; crush/magic/fall/eat/gun/psi bypass ordinary stuns; otherwise stunnable && HP>1. `stunMonster` sets at least the species delay, not a blanket additive delay. Examples: princess 6, fat guard 2, vizier 0, terracotta min(oldStun+8-HP,7). Arrow trap adds 3 capped at 7. HP drops on nonweak hits except explicitly exempt durable species.

**Connections, SHOWN with bounded inference.** `attackMonster` resolves the stun decision, calls stunMonster or killMonster, then progression hints/achievements. Death can alter walls/items and trigger segmented-body cleanup. Capability affects legality and result before a scalar damage race exists.

**Authoring, SHOWN.** C++ flags and ordered guards author interaction grammar. New ability authoring must check admission and resolution consumers. Some admission helpers mark orb use, so use changes rollback for hypothetical checks rather than assuming every predicate is pure.

**Persistence, SHOWN fields with limits.** Kills and selected powers enter score boxes; cell HP/stun/type enter editor maps. Normal Safety does not restore every hostile encounter. Long injury, medicine and body age are not established by these hitpoint fields.

**Closure and unread.** Closed: central admission and stun formulas. Open: complete killMonster terrain side effects, attack flags Cartesian product, all counters and player defeat modes.

**YAIRPG, INFERRED.** PROPOSAL: explain one mechanic-based counter and one useful nonlethal result using existing command admission. Keep no-effect, stun, injury and death separate.

Routing: K2, K3, K10, K22, K29; P14, P17, P12. Owners: [ABILITY_AUTHORING.md](../../../worlds/ABILITY_AUTHORING.md), [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md). Topic rows: body:MT1, kit:KW3.

## DS05: Segmented bodies and mounted movement

Sources: [complex.cpp:2648-2834](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L2648), [complex.cpp:2983-3129](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L2983), [attack.cpp:478-505](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/attack.cpp#L478).

**Data model, SHOWN.** Dragon head/tail occupy linked cells. mondir points along the body; each segment has HP/stun. findhead searches reverse links, bounded by iteration_limit. Kraken tentacles point to a neighboring head and carry their own HP. Shared target/whichturn fields serve Domination, not a private plan per dragon.

**Rules, SHOWN.** Dragon totalhp sums linked segment HP until the terminal NODIR or bound; kraken totalhp sums adjacent tentacle HP. Pullback/pullfront transfer monster/HP and stun segments to 2 while updating mounted movement. bodypart classifies positions from chain order for drawing. Dragon kill traverses the chain, increments a head kill, clears bodies and attempts flame duration 5. Eligible fire cells receive alternating treasure, with an accumulating outside-Dragon-land penalty. Kraken kill clears the head and surrounding tentacles, creates its treasure only in native Kraken land when item-free, and handles Stone/Undeath effects.

**Connections, SHOWN with bounded inference.** Body topology affects combat immunity, movement, mounted player position, rendering and material aftermath. It is a spatial body model. It supplies no inherited genes, fertility, parentage or developmental anatomy.

**Authoring, SHOWN.** C++ body types and graph links; generation must build a valid chain and all readers must agree on head identity. Existing validation can report malformed chains; it is not a full topology validator for authored anatomy.

**Persistence, SHOWN fields with limits.** Map serializer writes segment type/mondir/HP/stun, enough for those explicit cell fields, but no claim of every Domination target/auxiliary map surviving. Safety's selected-follower restoration is separate. YAIRPG should retain stable actor/body IDs rather than cell-pointer identity.

**Closure and unread.** Closed: representative dragon/kraken structural rules. Open: all spawn/attack/mount branches, worm/hexsnake bodies and transformed-body restore. Lineage remains unsupported by this evidence.

**YAIRPG, INFERRED.** PROPOSAL: one functional body trait should change a real command and its aftermath. Brood and lineage designs need sources with actual inheritance, not an analogy to linked tails.

Routing: K3, K6, K10, K22, K15; P14, P06, P15. Owners: [NONHUMAN_BODY_AUTHORING_2026-10-14.md](../../../worlds/NONHUMAN_BODY_AUTHORING_2026-10-14.md), [GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md](../../../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md). Topic rows: body:MT1, body:MT4, body:MT5.

## DS06: Mine knowledge, marking and reveal radius

Sources: [complex2.cpp:520-668](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex2.cpp#L520), [mapeffects.cpp:544-549](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeffects.cpp#L544).

**Data model, SHOWN.** Wall types separate hidden mine, unknown safe cell and open cell. Minefield landparam bit 1 records a mine mark; bit 2 records safe marking. An item itself can establish safe status. The mark command has extension hooks and rejects wrong land, items and noncandidate walls.

**Rules, SHOWN.** `uncoverMines` has a just_checking route and recursive bounded reveal. Unknown safe cells open on mutation; recursive propagation needs lev>0, no adjacent real mines and either adjacent unknown empty safe candidates or an already open neighbor. At root, known mine-only remaining neighbors can receive the mine-mark bit. Reveal radius is 3 for closed/bounded play; otherwise 0 before first egg outside tactics, 1 below 20 eggs, 2 below 30, else 3. Non-normal gravity prevents ordinary uncover/explosion; Aether is marked only if checking finds relevant hidden state. Explosion requires actual mine wall and an actor that does not ignore plates. In bounded Minesweeper, zero unknown cells records victory_time; teleport charge becomes 0 on fire, else 1.

**Connections, SHOWN with bounded inference.** Collected treasure changes perception range; truth, player annotation and disclosed terrain are distinct. `performMarkCommand` also dispatches CA editing through a separate early branch. Source marking is a convenience operation, not proof of knowing a mine.

**Authoring, SHOWN.** Wall enums, landparam bit meanings and direct C++ reveal procedure. UI needs to read marked_safe/marked_mine rather than infer truth from wall alone.

**Persistence, SHOWN fields with limits.** Editor map writes wall/landparam/item, preserving disclosed terrain and explicit bits at field level. Score boxes do not reconstruct an exact Minefield graph. victory_time's entire persistence route was not established.

**Closure and unread.** Closed: mine namespace reveal/mark/status rules and explosion admission. Open: all mine generation probabilities, full visual number display and protection interactions.

**YAIRPG, INFERRED.** PROPOSAL: an observer can keep a tentative mark apart from verified fact, and an earned method can widen what they inspect. Do not present source omniscience as YAIRPG actor knowledge.

Routing: K5, K11, K14, K30; P04, P11, P15. Owners: [MEANS_AND_APPRAISAL.md](../../../MEANS_AND_APPRAISAL.md), [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). Topic rows: technology:FT5, kit:KW4.

## DS07: Thermal simulation, fire and finite transformations

Sources: [complex.cpp:2073-2375](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L2073), [mapeffects.cpp:143-159](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeffects.cpp#L143), [environment.cpp:836-895](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/environment.cpp#L836).

**Data model, SHOWN.** HEAT(c) is local cell storage with land-specific baseline; pending hmods is indexed by current map cells. offscreen_heat/offscreen_fire retain work lists; newfires batches ignition until scanning finishes. Fire duration is wparam; Dry Forest accumulated heating uses landparam.

**Rules, SHOWN.** Absolute heat is HEAT-.6 in Cocytus and HEAT-.4 in Ice/Blizzard/Eclectic; displayed Celsius is absheat*60. Speed halves process rate. Player input is +/-1.2*xrate (Winter chooses negative), with PURE factor 1.7, turn mode /1.5 and Cocytus shmup /3. Neighbor diffusion uses (absoluteNeighbor-absoluteSelf)/divby; divby starts 10 and doubles for S7>10, Archimedean and 3D. Cells apply accumulated hmod*rate after the scan. Ice walls melt above .4; frozen lakes melt above .6 in Cocytus else .4. Lakes freeze below -.4 in Cocytus else .4, except greater sharks. Offscreen heat decays by 1-rate/10 until magnitude <.01 becomes zero. Dry Forest neighbors ignite at accumulated heat >=1 for a standard tree, >=10 otherwise. New fire duration is half the queued source value; useup decrements duration and transforms at zero. Temporary floor becomes chasm; temporary/burning bridge or Brownian terrain becomes water.

**Connections, SHOWN with bounded inference.** Monsters, powers, neighboring foreign fires, terrain and volcanoes supply heat. Melting forces BFS refresh. Fire has wind, half-vine, barrel and fire-trap exceptions and offscreen support. This is environmental transformation, not a recipe/stock/workforce production chain.

**Authoring, SHOWN.** C++ source/sink rules and wall enums. Material authoring needs state, sources, thresholds, transformation output and applicable clock, not a flavor tag alone.

**Persistence, SHOWN fields with limits.** Map writes landparam/wparam and terrain, but inspected serializers do not explicitly emit offscreen work queues. Score Safety regenerates terrain. Exact resumed thermal evolution and queue reconstruction are unverified; do not promise replay parity from saved scalar heat.

**Closure and unread.** Closed: thermal diffusion, thresholds, core fire staging and timeout mutation. Open: all burnable item rules, wind transport, every geometry and offscreen queue reconstruction.

**YAIRPG, INFERRED.** PROPOSAL: extend the selected useful drying/refining lot with one causal condition and shown units. Keep comfortable unfed ordinary play and no hunger death; this source offers no reason to add survival chores.

Routing: K2, K5, K9, K13, K28, K29; P02, P13, P14, P17. Owners: [MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md), [TECHNOLOGY_AND_PROGRESSION.md](../../../TECHNOLOGY_AND_PROGRESSION.md). Topic rows: chains:FC6, chains:ML-R4c, body:MT2.

## DS08: Tides, hazard phases and truthful countdowns

Sources: [mapeffects.cpp:646-750](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeffects.cpp#L646), [environment.cpp:827-874](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/environment.cpp#L827), [help.cpp:969-991](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/help.cpp#L969).

**Data model, SHOWN.** A lazily built tide[200] array and tidalsize define the repeated cycle; two current phases select wet, shallow and dry cells. Local landparam is the shore threshold. Chaos uses separate sea/land distance bytes and derived CHAOSPARAM. Lava uses windmap phase.

**Rules, SHOWN.** Cycle construction starts with five 1s, repeats 1..3 three times, 4..6 twice, 7..19 once, 20..22 twice and 23..25 three times. The final loop appends 27-tide[i] while 2*i<current tidalsize; current size grows, so it appends the entire initial 48 entries, giving 96 total. Clock index is turncount or floor(shmup curtime/600). phase2 is phase-1 if either neighboring phase is lower, otherwise phase. Peace compresses both to 5+floor(phase/6). Ocean t>=phase is sea/boat, else t>=phase2 is shallow, else dry/stranded. Chaos distances relax to a fixed point through recalcTide; when both distances are 1 t=15, otherwise t=1+floor(29*(landdist-1)/(seadist+landdist-2)). Lava phase=(windmap+(clock+t)*4)&255, with clock shmup/400 or turncount; values <96 are magma. Normal help searches at most 1000 future turns for a wet/dry change.

**Connections, SHOWN with bounded inference.** Tides run even on Speed phases that skip other environment work because they read turncount. The same rule drives path terrain, stranded boats, item burning and contextual countdowns. Ocean and volcano clocks use different shmup divisors.

**Authoring, SHOWN.** Fixed procedural cycle plus terrain thresholds in C++; not a universal day/night calendar. A new phase law needs a correct view and all movement/hazard consumers.

**Persistence, SHOWN fields with limits.** Editor map saves turncount, land parameters and terrain; recomputing tide from the clock is plausible but exact load/order parity is untested. Score Safety map rebuild differs. No offline-time catch-up follows from a cyclic turn law.

**Closure and unread.** Closed: tide construction and clock mapping. Open: all chaos/geometry boundary convergence and native pause/resume. Formula count derived by a separate static arithmetic check, not game execution.

**YAIRPG, INFERRED.** PROPOSAL: one known work or travel window shows its next phase from the authoritative local clock, with stop-at-choice semantics. Do not grant missed jobs from elapsed wall time.

Routing: K2, K5, K14, K28, K32; P13, P04, P10. Owners: [ENGINE_EXPANSION.md](../../../ENGINE_EXPANSION.md), [WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md](../../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md). Topic rows: body:MT2, kit:KW3.

## DS09: Hive conflict and local traces

Sources: [complex.cpp:1702-1970](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L1702).

**Data model, SHOWN.** buginfo holds cell plus distance per bug color; color-specific queues, delayed outsider queues and bugtomove tuples are rebuilt per move. Persistent spatial pheromone-like traces use landparam. Counts and death lists are local resolution aids.

**Rules, SHOWN.** Enemy detection ignores same color and ivy; player is enemy when visible and outside peace. hivehard=RoyalJelly+hardness_empty; Luck quarters nonzero hardness before the hrand(200)<h color bias. Outsider invasion offset=max(0,4-floor((RoyalJelly+10)/20)). Moves sort by distance then number of good moves after shuffle. Adjacent attack quality 2 beats approaching 1 and equal-distance 0, with hazard/rose/peace penalties. Hive trace decreases by 1 when >1 outside wax walls; successful movement adds 5 to source/destination while values <90, and no admissible move adds 3. Trace causes exploration of extra nearby cells. Commented queen promotion is not active behavior.

**Connections, SHOWN with bounded inference.** Groups fight each other using shared canAttack, leaving temporary dead-bug markers until cleanup. Combat can happen without the player delivering each hit. This shows tactical group conflict and fading spatial evidence, not a state economy, political diplomacy or inherited clans.

**Authoring, SHOWN.** BUGCOLORS, type enums and utility/distance consumers are C++ authored; no faction relation table or event-script language shown.

**Persistence, SHOWN fields with limits.** Queue distances/counts are recomputed. Map landparam can carry local trace values and monsters, but normal Safety does not retain this exact conflict field. No social-memory or faction-history record is emitted by this namespace.

**Closure and unread.** Closed: central hive target and action rules. Open: bug-city generation, entire offscreen budget, every species and peace/mode branch.

**YAIRPG, INFERRED.** PROPOSAL: one cause should leave a local trace that a later observer or routine actually reads. Keep remembered knowledge separate from a fading physical trace.

Routing: K6, K7, K10, K29; P25, P12, P15. Owners: [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md), [GENERATION_FOUNDATION_RULES_2026-10-14.md](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). Topic rows: kit:KW3, body:MT1.

## DS10: Committed ambushes and delayed awakening

Sources: [complex2.cpp:670-919](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex2.cpp#L670).

**Data model, SHOWN.** Terracotta stores dormant state in wall and countdown wparam. Ambush tracks current distance/ambushed/fixed_size plus actual dog/guard cells. A celllister provides the bounded reachable ring used for placement.

**Rules, SHOWN.** randterra is compile-time false. Each eligible adjacency check decrements wparam; at zero, wall becomes empty and a 7-HP warrior appears. Racing suppresses it; shmup checks an extra neighbor ring. Hunting pickup ambush size=min(min(qty,max(33-qty,6)),15); other items have explicitly authored sizes, with a restricted branch when an active nearby nonfriendly non-slow nonmultitile monster exists. Ambush is deferred with LATE, converts nearby guards, collects an eligible outer ring, caps dogs at ring size and spaces them at (randomShift+floor(N*i/gaps))%N. Killing a guard activates other guards and calls ambush(...,7). Give-up detection is enabled only for hunting count >5 and <=22 and reads converging marked approaches.

**Connections, SHOWN with bounded inference.** Event eligibility, placement, actual actor conversion and closure happen in separate code. Commit deferral prevents hypothetical movement spawning real dogs. No cooldown calendar or recurrence scheduler is shown here.

**Authoring, SHOWN.** Direct C++ item-to-size switch, geometry-specific ring traversal and deterministic awakening countdown. Preserving a useful escape path is a design consequence, not a proof that every tiling is fair.

**Persistence, SHOWN fields with limits.** Editor maps retain dormant countdowns and spawned actors; full ambushed/distance/fixed_size globals are not explicitly serialized in inspected map/score routines. Exact pending-callback save is not established. YAIRPG must save an actual pending event/receipt if it crosses a save boundary.

**Closure and unread.** Closed: selected ambush and terracotta bodies. Open: all pickup callers, geometry placement edge cases, complete give-up behavior and runtime fairness.

**YAIRPG, INFERRED.** PROPOSAL: use an existing event owner for one telegraphed consequence of a committed action, with abstention/escape and retained aftermath. Do not treat these routines as proof of a four-stage generic source engine.

Routing: K10, K12, K29, K32; P10, P12, P24. Owners: [CHARACTERS_AND_WORLD_EVENTS.md](../../../CHARACTERS_AND_WORLD_EVENTS.md), [WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md](../../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md). Topic rows: kit:KW3, body:MT2.

## DS11: Sentient dice as stateful objects

Sources: [complex2.cpp:919-1208](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex2.cpp#L919), [pcmove.cpp:843-868](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp#L843), [mapeditor.cpp:1202-1211](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L1202), [mapeditor.cpp:1422-1435](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L1422).

**Data model, SHOWN.** die_structure contains face adjacency, reverse spin table, hardness distance, face counts and rotational order. Five authored shapes are d4/d6/d8/d12/d20. Per-cell die_data stores shape pointer, current face val, orientation dir and mirrored bit. Happy is +1 at last face, -1 at first, 0 otherwise.

**Rules, SHOWN.** Hardness starts at 99 except final face 0, then repeated adjacency relaxation yields minimum roll distance to the desired face. Legal roll requires gcd(targetDegree,faceSides)!=1 and (currentDir-moveDir*faceSides)%sourceDegree==0. roll_effect finds outgoing face index with modular arithmetic, follows the side adjacency, maps reverse spin and XORs mirroredness across the edge; orientation is normalized modulo targetDegree*newFaceSides. generate_specific selects face values in an authored hardness interval and compatible directions. Pushing an animated die is admitted only if projected top is the highest face, unless Slaying takes the alternative attack branch. Orientation is transferred with map rollback support.

**Connections, SHOWN with bounded inference.** The same orientation feeds movement legality, hostility/happiness, help description, rendering and reward-state conversion. This is a compact mechanically shared phenotype; it is not Mendelian inheritance or general emotion.

**Authoring, SHOWN.** Five explicit polyhedral adjacency tables plus constrained generation intervals. Do not copy tables into YAIRPG; adapt the rule that one object state has several consistent readers.

**Persistence, SHOWN fields with limits.** Editor map explicitly writes die shape ID, val, dir and mirrored. Load converts pre-0xAA23 direction units and reads mirrored only from 0xA902. Missing orientation cannot be replaced by a fresh roll without changing the puzzle. No regular Safety exact-puzzle restore shown.

**Closure and unread.** Closed: data/roll/admission and explicit map migration fields. Open: full reward/anger lifecycle, all Chaos swap cases and all visual preview traversal.

**YAIRPG, INFERRED.** PROPOSAL: one apparatus/body configuration should affect both a practical verb and an earned diagnostic cue. This extends P15; no separate new trait generator is needed.

Routing: K2, K9, K10, K11, K30; P15, P14, P16. Owners: [GENERATION_FOUNDATION_RULES_2026-10-14.md](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md), [NONHUMAN_BODY_AUTHORING_2026-10-14.md](../../../worlds/NONHUMAN_BODY_AUTHORING_2026-10-14.md). Topic rows: body:MT1, body:MT4, kit:KW4.

## DS12: Ranged path preview and reload work

Sources: [crossbow.cpp:26-117](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/crossbow.cpp#L26), [crossbow.cpp:217-278](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/crossbow.cpp#L217), [crossbow.cpp:383-539](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/crossbow.cpp#L383), [pcmove.cpp:323-345](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp#L323), [orbs.cpp:230-235](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/orbs.cpp#L230), [system.cpp:1042-1049](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/system.cpp#L1042).

**Data model, SHOWN.** Weapon/style selects blade or crossbow and bull/geodesic/geometric path style. bowpoint has prev/next cellwalkers and FIRST/LAST/COPIED flags. bowpath, its cell-index projection and target_at are temporary targeting data. items[itCrossbow] is the reload counter.

**Rules, SHOWN.** loading_time is 3 for bull style, 4 otherwise. Shooting assigns this counter before resolution; power reduction decrements it each applicable action, except skipping in warped space. Blocking checks allow Aether bypass; ordinary walls block except mirror/cloud/nonblocking cases. Path creation forks copied bolts through mirror images and records their provenance. Shooting uses AF_BOW plus Speed/Slaying/Weakness flags, shared attack admission and reverse-order pushes. `have_bow_target` temporarily preserves preview containers, initializes changes, tries the real shooting path and rolls back. Auto path requires score >=10000, a source targeting heuristic rather than probability of hit.

**Connections, SHOWN with bounded inference.** One path feeds preview and actual hits; mirrors, friend treatment, body segments and pushes compose with combat. A wait action can fail to progress reload locally, which makes environment part of preparation.

**Authoring, SHOWN.** C++ targeting scores, path generation and style definitions; not a data-only ranged weapon recipe. Avoid adapting geometric pathfinding to a textual UI without an actual need.

**Persistence, SHOWN fields with limits.** Score boxes save weapon/style and reload counter. Derived target paths are cleared by reset paths; editor map saves items but no complete temporary aim state in the inspected writer. Saved reload need not imply saved mouse target.

**Closure and unread.** Closed: reload and selected targeting/rollback consumers. Open: all style optimization, mirror recursion, extra achievements and live targeting UX.

**YAIRPG, INFERRED.** PROPOSAL: preparation should show actual remaining work and the condition stopping it; manual and queued commands read the same state. Source numbers are not accepted YAIRPG rates.

Routing: K3, K10, K14, K26; P04, P08, P14, P17. Owners: [ABILITY_AUTHORING.md](../../../worlds/ABILITY_AUTHORING.md), [ENGINE_EXPANSION.md](../../../ENGINE_EXPANSION.md). Topic rows: kit:KW4, body:MT2.

## DS13: Map topology persistence and versioned restoration

Sources: [mapeditor.cpp:818-878](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L818), [mapeditor.cpp:1131-1306](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L1131), [mapeditor.cpp:1326-1580](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L1326), [mapeditor.cpp:1608-1697](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/mapeditor.cpp#L1608), [system.cpp:1316-1447](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/system.cpp#L1316).

**Data model, SHOWN.** mapstream assigns numeric cell IDs and a cellbyid array, with relative spin for reconstruction. A nonroot cell references an earlier neighboring parent and edge orientations, not a raw pointer. Geometry/config, item and kill arrays, cells, drawing shapes, phases, turncount and optional hooks have distinct stream sections.

**Rules, SHOWN.** save_start chooses gamestart for specified geometries, otherwise the current heptagon root. Breadth-like discovery visits neighboring cells except laNone/laMemory and optional portal exclusions; a missing earlier parent throws. Each cell writes land, monster/direction, wall, item, generation distance, wall/land parameter, stun and HP plus explicit tortoise/die extras and mirror boundary metadata. A -1 sentinel ends cell records and a player cell ID follows. Load bounds-checks item/monster counts, remaps relative spin, handles version-specific fields and resets some timers/flags before restoring later phases; it marks the loaded map cheater=1. Map versions >10505 and <11000 normalize to 11005. Multi-map portals and dual state have separate dispatch. This is editor-map persistence, not ordinary competitive Safety continuation.

**Connections, SHOWN with bounded inference.** Core hooks permit optional module sections, terminated by numeric 0; callers own payload agreement. Inspected local files supply no full rescue-vector/knight-name/offscreen-fire hook. Score load independently scans versioned append records, zeros missing numeric tails and special-cases old tactics/Yendor records. A short numeric record's missing tail defaults do not prove corruption recovery.

**Authoring, SHOWN.** Stream layout and version comparisons are hand-authored C++; new fields need symmetric writer/reader and stable ID policy. The writer opens wb directly. No atomic replacement protocol is shown in this function.

**Persistence, SHOWN fields with limits.** This is the save subsystem itself. Native map roundtrip, malformed/truncated streams, hook compatibility, all geometry codecs and backup recovery remain untested. Score save, config save and editor graph save have different retention guarantees.

**Closure and unread.** Closed: prior unread core map cell format and selected migration/default branches. Open: complete geometry codecs, external hook consumers, all historic versions, corruption/atomicity and runtime roundtrip.

**YAIRPG, INFERRED.** PROPOSAL: each selected YAIRPG system should declare saved fields, derived state and transient UI, while retaining its complete native envelope. Do not port the graph format or replace current import preflight.

Routing: K18, K29, K33, K34; P16, P23, P24. Owners: [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md), [ENGINE_AUTHORING.md](../../../ENGINE_AUTHORING.md). Topic rows: kit:KW4, body:MT4, body:MT5.

## DS14: Example-driven generation and repair

Sources: [wfcgen.cpp:5-112](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/wfcgen.cpp#L5), [wfcgen.cpp:145-240](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/wfcgen.cpp#L145), [landgen.cpp:2636-2684](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/landgen.cpp#L2636).

**Data model, SHOWN.** wfc_data maps a vector of central/neighborhood wall types to a short weight. probs is the sampled dictionary; built-in Eclectic patterns are compressed static data. centers is a scheduled work vector; per-degree caches hold adapted patterns.

**Rules, SHOWN.** load_probs samples explored neighborhoods with mpdist<=7 and no chasm, retaining patterns with at least one nonempty wall; rotations contribute integer 42/degree (hexagonal odd rotations skipped). Compression canonicalizes rotated neighborhoods. agree requires matching degree and every already-fixed wall parameter. Each iteration chooses minimum weighted Shannon entropy sum(w/total*log(total/w)), samples a compatible pattern by weight and writes the center plus same-land nonbarrier neighbors. Renumeration inserts/removes neighbor entries for another degree, with a charged/grounded adjacency guard. Empty compatible sets yield no weighted choice in this loop; no global backtracking proof follows. Eclectic generation schedules at distance stage 8 and invokes at 7, then repairs roses, boundary charge/sandstone and some palace enclosure cases.

**Connections, SHOWN with bounded inference.** Generation is constrained by already fixed neighboring state but still needs hand-authored repairs. A valid local pattern does not imply a solvable quest, coherent institution or complete causal history.

**Authoring, SHOWN.** Author a sample map, import its neighborhood statistics through the WFC menu, or compile the built-in compressed dictionary. Command hooks expose capture/use/export. None were executed. No universal mod load-order resolver was found in this module.

**Persistence, SHOWN fields with limits.** WFC custom probabilities are not explicitly serialized by the inspected map writer; resulting terrain is. The built-in dictionary is code content, and work vector is cleared by memory hooks. Save resolved generated facts when content changes rather than resampling seen places.

**Closure and unread.** Closed: full compact WFC module algorithm and Eclectic callers, excluding opaque built-in dictionary decoding. Open: dictionary census, constraint dead-end rates and all repair consumers.

**YAIRPG, INFERRED.** PROPOSAL: retain one validated generated fact with actual readers under existing generation ownership. A general constraint solver has no dedicated accepted YAIRPG leaf here; mark it unowned at that specific mechanism level, not as missing broad authoring ownership.

Routing: K1, K2, K5, K33, K34; P15, P16, P22. Owners: [ENGINE_AUTHORING.md](../../../ENGINE_AUTHORING.md), [GENERATION_FOUNDATION_RULES_2026-10-14.md](../../../GENERATION_FOUNDATION_RULES_2026-10-14.md). Topic rows: chains:FC6, kit:KW4.

**Owner gap:** broad generation/authoring owners exist; an accepted local constraint-solver leaf was not found. Proposed only, not a required new subsystem.

## DS15: Playable lessons with reversible presentation state

Sources: [tour.cpp:20-164](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/tour.cpp#L20), [tour.cpp:337-455](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/tour.cpp#L337), [tour.cpp:602-646](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/tour.cpp#L602), [tour.cpp:646-1135](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/tour.cpp#L646).

**Data model, SHOWN.** slide has name, currently unused numeric ID, flags, help text and a callback taking presmode. Presentation modes include start/frame/stop/key/restart/help and geometry changes. Shared globals track current slide, text visibility, tour value and help. A vector of restorers records temporary variable backups.

**Rules, SHOWN.** slide_backup captures the old value and pushes a restore callback; slide_restore_all runs callbacks in reverse order. Canvas lessons push game state and pop it at stop. Geometry controls test slide LEGAL flags and land validity before creating a temporary alternate game. Tutorial rescue control offers teleport, then Aether, then Flash when canmove stays false. Slides can grant demonstration resources through key callbacks. Frame/key/next-land hooks route presentation behavior; initialize_slides walks until FINALSLIDE. This is authored interactive presentation, not a retained learning/XP engine.

**Connections, SHOWN with bounded inference.** The source separates text, optional practice action and temporary game setup. Lessons can demonstrate the same rules with altered geometry. Free demonstration resources belong to the tour context, not evidence of ordinary earned acquisition.

**Authoring, SHOWN.** C++ slide arrays and callbacks, with extension slideshow hooks. The menu can navigate folders/slides; geometry compatibility is per slide. Entire help prose remains in the private source; no prose copied here.

**Persistence, SHOWN fields with limits.** Backups are process-memory callbacks; score load returns early while tour is on. No durable current-slide/restore-callback serializer was established. Temporary lessons need an explicit lifetime boundary before offering them as saveable branches.

**Closure and unread.** Closed: presentation schema, callback lifecycle, recovery controls and default slide authoring structure. Open: every callback's cleanup correctness, extra registered slideshows, accessibility and live lesson feel.

**YAIRPG, INFERRED.** PROPOSAL: one earned lesson lets the actor try a useful verb and return safely. Learning and discoveries must still use YAIRPG knowledge owners; demonstration stock cannot leak into the main life.

Routing: K4, K11, K14, K34; P03, P04, P14. Owners: [ENGINE_AUTHORING.md](../../../ENGINE_AUTHORING.md), [WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md](../../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md). Topic rows: technology:CN14, kit:KW1, kit:KW2.
