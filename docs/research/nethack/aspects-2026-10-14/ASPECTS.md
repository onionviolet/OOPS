# NetHack: aspect backfill, 2026-10-14

## Corrections

C1: The old FOLLOWUP_SOURCE.md claim that the fieldcraft inventory label adapter is absent is stale against the current checkout. src/nethack_fieldcraft_item_view.js now defines projectFieldcraftItemView, with an explicit completed-work and knowledge predicate. This is source presence only; this lane did not test its host integration or browser behavior.

C2: The new NetHack pin differs from the old 8898570da710513f38d81ed973f834863b795217. The current quest pager explicitly caches a private Lua interpreter and supports fallbacks and message-history synopsis. The old reports did not audit this route or saves, so these extend their coverage rather than overturning their item/pet/conduct conclusions.

## Evidence and scope

Shown means directly read source/control flow. Stated means repository documentation. Inferred means an interpretation, and every YAIRPG transfer is a PROPOSAL. Covered means a representative implementation route is traced for the aspect, not every record or branch. Partial rows name what remains unread. No games were installed, built or launched, no saves were opened, and no runtime behavior, feel, performance or installed-build parity is claimed.

- NetHack: [49b203ed83334c8a0f05024212f98675e51432cb](https://github.com/NetHack/NetHack/tree/49b203ed83334c8a0f05024212f98675e51432cb), tree `257f2f35d63d9b43bdec43c854038be2d1e5b6b4`, 1383 tracked paths.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems per game](DEEPER_SYSTEMS.md), [reproducible tooling](TOOLING.md), [source evidence](SOURCE_INDEX.json), and [implementation proposals](IMPLEMENTATION_PACKETS.md) preserve the different evidence layers. The shared lane checkpoint is [here](../../nethack/aspects-2026-10-14/CHECKPOINT.md).

<a id="A01"></a>

## A01: Dialogue and conversation

### NetHack | covered

Shown: quest.c chooses stable message IDs from quest status, location, capability, alignment and carried quest-object state. First meeting changes met_leader; assignment changes got_quest; completion records qcompleted and identifies the object. questpgr.c loads questtext[role][id] from quest.lua, falls back to common text, selects a random array entry or a text field, expands names/pronouns, and selects message/window/menu output. sounds.c supplies directional chat with body, choking, underwater and perception checks. This is authored state-based conversation, not a general player-response graph; no portrait model was found in this inspected route.

Sources: [src/quest.c:270-460](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/quest.c#L270-L460), [src/questpgr.c:470-684](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L470-L684), [dat/quest.lua:1-35](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/quest.lua#L1-L35), [src/sounds.c:1259-1345](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/sounds.c#L1259-L1345).

PROPOSAL: Keep text ID, eligibility and committed consequence separate in src/data/dialogues.js and src/models/dialogue_action.js; let actor state explain a refusal before any cost.

<a id="A02"></a>

## A02: Narrative delivery

### NetHack | covered

Shown: quest delivery can keep a short synopsis in message history even when the long passage used a separate window. Quest milestones use livelog_printf, while saved gamelog lines retain text and structure. Rumors and oracle consultation form separate hint delivery paths; those were located but their complete eligibility and payment branches remain unread. A recap is therefore a projection over past events, not proof that the player learned every fact in a long passage.

Sources: [src/questpgr.c:594-646](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L594-L646), [src/quest.c:320-370](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/quest.c#L320-L370), [src/save.c:239-266](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/save.c#L239-L266).

PROPOSAL: Add authored short recaps to existing event/Notebook receipts in src/simulation_ui.js; keep long reading separate from routine action space.

<a id="A03"></a>

## A03: Implementation architecture

### NetHack | covered

Shown: C99 gameplay is split among command/item/monster/level modules, with Lua dungeon, special-level and quest data. moveloop_core consumes hero movement, advances monsters while the hero lacks a movement allowance, then replenishes movement and runs once-per-turn effects. UI calls go through window operations. The quest interpreter is lazily initialized, sandbox configured and cached, so parsing does not recur for every line. Configuration-dependent ports and save backends remain distinct.

Sources: [README:25-45](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/README#L25-L45), [src/allmain.c:173-290](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/allmain.c#L173-L290), [src/questpgr.c:470-523](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L470-L523), [dat/dungeon.lua:1-65](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/dungeon.lua#L1-L65), [dat/Mon-strt.lua:1-65](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/Mon-strt.lua#L1-L65).

PROPOSAL: Preserve a single committed simulation clock in src/simulation.js and expose typed content adapters rather than adding a second clock for dialogue or crafting.

<a id="A04"></a>

## A04: Save and persistence

### NetHack | covered

Shown: save.c writes version/player identity, current level, global state and remaining level records through NHFILE/Sfo helpers, then converts/compresses as configured. Global state includes turns, flags, character, quest state, inventory and global timers. restore.c rebuilds object links and worn equipment, recomputes class probabilities and hero_seq, and restores quest state. version.c rejects unsupported version/configuration/entity-count combinations. A failed restgamestate branch frees loaded level data and deletes the save file, so rejection is not uniformly nondestructive. Checkpoint/recovery code exists; this lane did not test crash recovery or all file formats.

Sources: [src/save.c:160-305](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/save.c#L160-L305), [src/restore.c:600-730](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L600-L730), [src/restore.c:790-862](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L790-L862), [src/version.c:374-421](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/version.c#L374-L421), [src/timeout.c:2655-2745](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2655-L2745).

PROPOSAL: In src/save_compatibility.js and src/native_storage_transaction.js, validate a candidate before publication, preserve the old artifact on rejection, and explicitly restore actor/task references. Do not adopt the destructive restore branch.

<a id="A05"></a>

## A05: AI and NPC behavior

### NetHack | partial

Shown in the inspected dispatch: ordinary monster movement can route tame actors to dog_move, while defensive item selection is a separate path. The earlier pet-food report remains a selected-source baseline. Newly located monmove/muse branches show that allies and enemies are rule-bearing actors with inventory use, not flat player bonuses. Full defensive-item choice, all pet goals, pathfinding and off-level catch-up were not semantically reread in this pass.

Sources: [src/monmove.c:1760-1780](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/monmove.c#L1760-L1780), [src/monmove.c:785-805](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/monmove.c#L785-L805).

PROPOSAL: Extend the existing companion/controller owner in src/simulation_resolution.js with one visible, funded service; do not invent mandatory hidden starvation upkeep.

<a id="A06"></a>

## A06: UI and information design

### NetHack | partial

Shown: directional chat can produce a shop price quote without a separate negotiation tree; discovery updates inventory; long quest passages select a reading window and keep a concise history entry. dat/help maps ordinary verbs and discovery commands to keys. Source exposes a map/status/message/inventory-oriented port interface. Actual port composition, font size, mouse behavior and laptop usability were not observed.

Sources: [src/sounds.c:1259-1302](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/sounds.c#L1259-L1302), [src/o_init.c:440-493](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/o_init.c#L440-L493), [src/questpgr.c:594-646](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L594-L646), [dat/help:155-195](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/help#L155-L195).

PROPOSAL: Use independent desktop panels for item facts, action costs and recent receipts in src/display.js, governed by docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Mobile remains deferred.

<a id="A07"></a>

## A07: Content authoring and modding

### NetHack | partial

Shown: dungeon.lua defines branch topology and special-level locations. Mon-strt.lua uses a des API for terrain, regions, stairs and placement. quest.lua stores authored text and synopsis fields with replacement codes; C still owns most quest transitions. Adding text is easier than introducing a new effect or rule. The cached pager handles missing-table errors and a small fallback map. This is not evidence of a supported arbitrary mod load order or full sandbox security audit.

Sources: [dat/dungeon.lua:1-65](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/dungeon.lua#L1-L65), [dat/Mon-strt.lua:1-65](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/Mon-strt.lua#L1-L65), [dat/quest.lua:1-35](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/quest.lua#L1-L35), [src/questpgr.c:470-594](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L470-L594).

PROPOSAL: Content owners should validate IDs, required fallbacks and effect references before loading a world; preserve original content and attribution rather than porting Lua or text.

<a id="A08"></a>

## A08: Balance and numbers

### NetHack | partial

Shown: rnd.c distinguishes core and display random sequences in the ISAAC64 configuration and supplies a separate display generator in the fallback configuration. rn2 is a bounded integer draw; rnl applies a Luck-dependent adjustment. This is state-based luck, not evidence of universal pity. The main loop guards against turn-counter growth to one billion. Complete damage, growth, prices and all platform RNG configurations remain unread.

Sources: [src/rnd.c:1-130](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/rnd.c#L1-L130), [src/allmain.c:245-270](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/allmain.c#L245-L270).

PROPOSAL: Keep cosmetic flavor selection away from simulation RNG in src/simulation_contracts.js; a deterministic save/reload comparison must include the relevant random state.

<a id="A09"></a>

## A09: Time and scheduling

### NetHack | covered

Shown: time is action/movement based. Turns advance when both sides exhaust movement allowances. run_timers removes due entries from an ordered list before invoking callbacks. Global and level timer ranges serialize separately; restore can adjust ghost-level deadlines and later relink object pointers. Real play-duration bookkeeping is separate from turn state. No general wall-clock offline progression is established by this trace.

Sources: [src/allmain.c:173-290](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/allmain.c#L173-L290), [src/timeout.c:2210-2255](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2210-L2255), [src/timeout.c:2655-2745](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/timeout.c#L2655-L2745), [src/restore.c:618-642](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/restore.c#L618-L642).

PROPOSAL: In src/simulation.js, save due time plus subject identity and distinguish inactive-area simulation from browser-closed catch-up. Applicable passive YAIR progression remains required by its own owner.

<a id="A10"></a>

## A10: Onboarding and reveal

### NetHack | partial

Shown: dat/help gives command reference; discovery state separates observed objects from identified types and can update the inventory after learning. Quest acceptance checks capability and state and can reject with a reason-bearing message ID. This supports learning through use and contextual refusal. A full guided tutorial or a complete reveal catalogue was not read, so neither is claimed absent.

Sources: [dat/help:155-195](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/dat/help#L155-L195), [src/o_init.c:440-493](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/o_init.c#L440-L493), [src/quest.c:320-370](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/quest.c#L320-L370).

PROPOSAL: Extend the existing fieldcraft learning projection only where a concrete receipt needs a native consumer; do not reimplement the now-present vial view.

<a id="A11"></a>

## A11: Little touches

### NetHack | covered

Shown: message-history synopses, pronoun/name substitution, shop price quoting through chat, explicit underwater/choking refusal, distinct observed/identified flags and a display RNG are small mechanisms with clear owners. The pager converts long messages into a reading window. These are source details; their timing and visual feel are unplayed. Twenty specific adaptations and their source aspects are in SMALL_TOUCHES.md.

Sources: [src/questpgr.c:198-230](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L198-L230), [src/questpgr.c:594-646](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/questpgr.c#L594-L646), [src/sounds.c:1259-1302](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/sounds.c#L1259-L1302), [src/rnd.c:60-90](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/rnd.c#L60-L90).

PROPOSAL: Add precise contextual feedback in src/display.js and src/simulation_ui.js without substituting flavor for a real committed outcome.

<a id="A12"></a>

## A12: Other systems

### NetHack | partial

Shown: conduct encoding derives bits from causal counters and explicitly notes that unattempted Sokoban and completed/violated play cannot be represented well by one bit. Identification, quest access, companion services, shops and environment interactions are distinct subsystems. Broader religion, bones, polymorph, wish parsing, billing and level generation are inventoried rather than fully read here.

Sources: [src/topten.c:411-455](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/topten.c#L411-L455), [src/o_init.c:440-493](https://github.com/NetHack/NetHack/blob/49b203ed83334c8a0f05024212f98675e51432cb/src/o_init.c#L440-L493).

PROPOSAL: Extend src/nethack_fieldcraft_feats.js only after checking current consumers; model attempt participation and result separately, allow later attempts, and avoid a permanent solo-player lock.

