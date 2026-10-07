# CDDA and Inform: selective pattern absorption

Recommendation: **independently borrow bounded authoring/action patterns; defer either upstream runtime or copied implementation.** This is an upstream-only recommendation for the comparison GM. Parent-owned local mapping determines which improvements are already supported and which need an adapter. No candidate adoption or runtime work is authorized by this note.

## Scope and revision receipt

Read the live AGENTS.md, PROJECT.md resume/expansion proposal, [assignment](ASSIGNMENT.md), GM refresh protocol and capacity/succession policy. The dirty checkout and runtime review hold were observed. Only this appendix is written; current local source/API mappings belong to the parent.

Pinned by `git ls-remote <official repository> HEAD`, then independently retrieved through GitHub commit/tree APIs and raw files:

| Candidate | Actual revision observed | Revision meaning |
|---|---|---|
| CDDA | `6c506a7544843e9f79b4fef105484e1e820005dd` | Committer date 2026-10-04T19:35:29Z, rolling HEAD, not a selected release. [Commit][cdda-rev] |
| Inform | `5c7ba42b74db69b93b1290453c65189fa60cfc67` | Committer date 2026-06-24T16:52:21Z. Standard Rules metadata says **10.2.0**; that does not establish a published release. [Commit][inform-rev], [metadata][inform-metadata] |

Initial revision retrieval: **2026-10-05T03:15:46Z**, which is 2026-10-04 in America/New_York. Both recursive source trees reported `truncated: false`. Relevant raw files were fetched at these SHAs into `/tmp/yairpg-engine-absorption-cdda-inform/`, outside the checkout. No build, install, interpreter or game was launched.

Official rendered documentation was opened live on that access date: [CDDA EOC](https://docs.cataclysmdda.org/JSON/EFFECT_ON_CONDITION.html), [NPC dialogue](https://docs.cataclysmdda.org/JSON/NPCs.html), [magic](https://docs.cataclysmdda.org/JSON/MAGIC.html), [Inform actions](https://ganelson.github.io/inform/WorldModelKit/actns.html), [physical model](https://ganelson.github.io/inform/standard_rules/pwm.html). These moving pages did not provide a verified deployment SHA. The immutable source references below control revision-specific claims.

## Verified upstream behavior

### CDDA: actor conditions, dialogue and powers

- **Explicit participants and scopes.** EOC documents distinguish alpha/beta talkers and character, world and temporary context variables. Prefixes `u_`/`npc_` identify bindings, not reliable human roles: spell EOCs place the target in alpha and caster in beta. The spell implementation confirms that binding and supplies target coordinates as context; a non-creature target may leave alpha absent. [Pinned documentation][cdda-eoc-doc], [spell implementation][cdda-spell-eoc]
- **Items use an actor; some knowledge does not.** Quantity/charge predicates resolve the selected talker, and Character talker wrappers read that character's items/variables. However, `u_know_recipe` still calls `get_player_character().knows_recipe()` directly. Treat actor support as a capability of each predicate, not of the whole condition language. [Item predicates][cdda-condition], [wrappers][cdda-talker], [recipe exception][cdda-recipe]
- **Dialogue is more than a prose cursor.** NPC documentation defines conditional response visibility, success/failure branches, and `speaker_effect` before the player responds. An optional sentinel limits that speaker effect. Code generates unavailable-response explanations and applies effect functions sequentially before changing topic. The inspected application function has no transaction/rollback boundary. A rendered line or topic entry can therefore have authored effects; do not map narrative advancement directly to browser rewards. [Dialogue documentation][cdda-npc-doc], [responses][cdda-response], [effects][cdda-effects]
- **A trade can move stock rather than create it.** `u_sell_item` removes real quantities/charges from alpha, assigns the recipient faction as owner, adds the objects to beta, then adds debt and runs success EOCs. Its missing-stock branch runs failure EOCs. This is a useful behavioral example; it is not evidence of YAIRPG save atomicity. [Transfer implementation][cdda-sale]
- **Learning and execution remain distinct.** Magic JSON defines components, energy source, casting duration and growth independently. `can_cast` checks caster restrictions, required components and energy, while `knows_spell` checks the actor's spellbook separately. Components use the crafting inventory, which can include nearby map stock; that is not an exclusive-custody rule. `NON_MAGICAL` returns early from `can_cast`. Cost handling accepts a cast-success flag and can scale failure cost. Magic saves mana plus spell IDs/XP and UI preferences; invalid saved spell IDs are skipped on load. [Magic documentation][cdda-magic-doc], [execution checks][cdda-cast], [costs][cdda-cast-cost], [knowledge/save code][cdda-magic-save]

### CDDA: recurrence, events and serialization

A queued EOC records ID, due game time and copied context. Non-global queues belong to characters; global processing occurs on the avatar's turn. A recurring event schedules its next deadline from **current game time plus recurrence**, not its previous deadline. The dispatcher holds requeued entries aside until its current processing loop ends. It does not itself replay every missed recurrence. [Queue/dispatch][cdda-queue]

A failed condition either runs its false effect or can deactivate the recurring rule. A defined false effect suppresses deactivation. Reactivation constructs new context from its current dialogue, so the old queued context is not preserved in the inactive-ID record. Global NPC fan-out returns the avatar's activation result, which governs requeue/deactivation. [Activation][cdda-activate], [reactivation][cdda-queue]

EVENT handlers invoke EOCs directly, with event data as context. Without explicit participants they try several event character fields, then fall back to the avatar. That fallback should not become a generic browser permission rule. [Event handler][cdda-event]

Character and global save code write queued IDs/deadlines/context and inactive IDs; character loading also migrates legacy variable prefixes. Definitions remain referenced by ID rather than frozen in those queue records. This demonstrates serialization shape, not all-version compatibility or atomic persistence. Game turns advance the calendar and Character processing drains its EOCs. [Character save][cdda-save-character], [load][cdda-load-character], [global save][cdda-save-global], [turn][cdda-turn], [character hook][cdda-process]

### Inform: physical relations and action stages

The physical model separates containment/support/incorporation, carrying/wearing and sensory accessibility. It models the ability to see or touch; that is not a history of what an actor actually perceived. Runtime holder/carrier calculations use structural parent relationships, with a separate worn attribute. These are spatial/possession relations, not a legal title, loan, reservation or private-knowledge ledger. [Physical model][inform-physical], [holder code][inform-holder], [carrier code][inform-carry]

The action pipeline is not only check/carry/report: **before → general visibility/tangibility/access/carrying checks → instead/request handling → action-specific check → carry out → after → report**. Carrying checks can attempt an implicit take. Check failure stops the action; reaching carry out defines action success. After rules may end processing and suppress reporting; reporting also depends on silence and player awareness. These semantics do not mean the desired outcome occurred or no state changed before a rejected main action. [Pinned stage definitions][inform-rules]

Nested `try` saves/restores participant/action variables around `BeginAction`. That call runs action processing, not the top-level turn sequence. Implicit subactions therefore do not inherently add a separate clock tick. This is nesting discipline, not a snapshot rollback of world mutations. [Try implementation][inform-try], [action entry][inform-action]

### Inform: turn and save boundaries

Ordinary turn processing generates an action and later processes scene/every-turn/timed stages. Out-of-world actions stop after action generation, avoiding clock/every-turn advancement. Clock advancement increments turn count and time of day. Timed events use one slot per rule, so setting the same rule again replaces its pending timer; the slot is removed before invocation. Relative delays count timed-stage invocations, while clock-time events use a 30-minute matching window. [Turn code][inform-turn], [timers][inform-timer], [clock][inform-clock]

Saving/restoring are out-of-world actions; their implementation delegates to `VM_Save`/`VM_Restore`. The reviewed boundary is a virtual-machine state operation, not an export of YAIRPG actor/stock/job JSON. No browser interpreter, cross-engine save bridge, save-format compatibility or transaction failure behavior was assessed. [Action declarations][inform-save-action], [save implementation][inform-save]

## Five useful independent design rules

These are **original proposed contracts**, not upstream APIs, accepted balance or demonstrated local gameplay.

| Pattern | Useful browser behavior | Boundary to preserve |
|---|---|---|
| Typed actor conditions | A worker's recipe knowledge and actual stock enable the worker's craft; another person's knowledge does not. | Require explicit actor/world/instance binding; reject unsupported predicate/actor pairs. Never default a missing participant to player. |
| Separate knowledge and means | Reading a herb method records understanding without granting fuel, tools, physical access or another person's private evidence. | Known fact, physical stock, body capability and present permission remain separate owners. Visibility is not witnessed knowledge. |
| Action stages | Explain an unavailable herb-drying route, then commit one legal paid outcome, then report what was actually published. | Pure preview/check; parent-owned resolution/publication; report reads receipt. Before/interception cannot silently mutate stock. |
| Explicit event policy | A resident's next work opportunity can wait, skip or pause when absent, with a declared policy. | One existing clock/scheduler. Persist due ID, actor, scope and required context. Specify catch-up, duplicate and reactivation rules rather than copying either engine's defaults. |
| Bounded nested actions | An NPC accepts a request, then independently attempts the work; the request and work have different outcomes. | One authorized root command, bounded depth and distinct rejection/paid attempt/outcome/committed states. No implicit taking, nested time advancement or subaction reward without an explicit owner. |

The parent can turn these into an authoring-contract amendment if local mapping finds a real missing behavior. They do not justify another scheduler, inventory, people ledger, world store or rewards system.

## Two discriminating later acceptance cases

**Everyday/power/trade case, proposed:** a trader requests dried herbs. Ordinary drying uses the character's herbs and rented equipment; a learned technique uses the same herbs plus the actor's actual fuel. The actor may decline or defer. A worker who knows the method can be commissioned using agreed material transfer, but player knowledge alone does not teach that worker. Private evidence changes only the knower's response. Revisit after a published delivery or refusal and show the trader's retained response without duplicating payment. Attempt a stale request after stock changes: explain rejection and publish no cost, reward or remembered delivery. This tests actor binding and authoritative receipts rather than dialogue branching alone.

**Spatial/long-action case, proposed:** through a viewing slit, observe a resident's jammed cabinet. Observation can reveal an actor-owned clue but grants no ability to take a tool inside. Physically enter to negotiate a loan and repair it, or ask the resident to try using their own available tool; abstention preserves the jam. The resident can accept the request and still fail the repair. Nested attempt/report must not duplicate world time, inventory or success memory. A loan's title/custody remains separate from where the tool is carried. This exposes Inform's useful access/action vocabulary and the extra rules neither upstream model provides automatically.

Both are designs only. Later generated-save/reload/failed-publication/browser proof and human wording/game-feel acceptance remain deferred under the current pace and runtime hold.

## Reuse, provenance and uncertainty

[CDDA's repository license][cdda-license] declares CC BY-SA 3.0 Unported, with separate licenses for named bundled components. [Inform's repository license][inform-license] is Artistic License 2.0; the reviewed Standard Rules [metadata][inform-metadata] also declares Artistic-2.0 and a no-acknowledgement statement for that extension. These are verified declarations, not a conclusion that all code, assets, third-party dependencies or compiled output can be combined under the fork's license. Any later copied-code proposal needs an exact-file provenance and redistribution review.

No code copying is recommended here. Independently implement only needed contracts with original names, data shapes and prose; retain research attribution to these references. This adds no dependency/license-bearing upstream code or content. A future reuse proposal must establish a concrete advantage over the existing engine, including adapter/removal cost and one state owner. Neither a C++ function nor Inform's I6/VM implementation is a drop-in browser API.

Coverage is targeted source reading of the named subsystems, not a whole-engine audit. Live rendered docs have no verified deployment pin, and some broad prose exceeds actual predicate support. Magic documentation's general free-failure wording also cannot override the inspected configurable cost function; the complete casting caller/order was not traced. No upstream behavior was executed. Persistence references establish fields/hooks only, not determinism under every event, offline policy, private knowledge guarantees or save rollback. Exact local fit, migration choices and later implementation packets belong to the parent.

Performed checks: full commit retrieval; official docs opened; selected immutable raw files read; every referenced file and line range checked against its downloaded pin; this Markdown and its sole local link read back. No running processes, temporary checkout, installed package, game/test/browser process, commit or external message was created.

[cdda-rev]: https://github.com/CleverRaven/Cataclysm-DDA/commit/6c506a7544843e9f79b4fef105484e1e820005dd
[inform-rev]: https://github.com/ganelson/inform/commit/5c7ba42b74db69b93b1290453c65189fa60cfc67
[cdda-eoc-doc]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/doc/JSON/EFFECT_ON_CONDITION.md#L54-L128
[cdda-npc-doc]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/doc/JSON/NPCs.md#L619-L703
[cdda-magic-doc]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/doc/JSON/MAGIC.md#L64-L113
[cdda-condition]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/condition.cpp#L684-L727
[cdda-recipe]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/condition.cpp#L1953-L1961
[cdda-talker]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/talker_character.cpp#L577-L638
[cdda-effects]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/npctalk.cpp#L8497-L8526
[cdda-sale]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/npctalk.cpp#L4093-L4135
[cdda-response]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/npctalk.cpp#L9082-L9132
[cdda-queue]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/effect_on_condition.cpp#L233-L348
[cdda-activate]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/effect_on_condition.cpp#L351-L424
[cdda-event]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/effect_on_condition.cpp#L594-L636
[cdda-save-character]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/savegame_json.cpp#L1599-L1613
[cdda-load-character]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/savegame_json.cpp#L1368-L1378
[cdda-save-global]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/savegame.cpp#L147-L165
[cdda-turn]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/do_turn.cpp#L525-L541
[cdda-process]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/character.cpp#L2419
[cdda-cast]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/magic.cpp#L1138-L1210
[cdda-cast-cost]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/magic.cpp#L1885-L1912
[cdda-magic-save]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/magic.cpp#L2370-L2424
[cdda-spell-eoc]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/src/magic_spell_effect.cpp#L2012-L2040
[cdda-license]: https://github.com/CleverRaven/Cataclysm-DDA/blob/6c506a7544843e9f79b4fef105484e1e820005dd/LICENSE.txt
[inform-rules]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Source/Sections/Variables%20and%20Rulebooks.w#L795-L986
[inform-physical]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Source/Sections/Physical%20World%20Model.w#L8-L95
[inform-holder]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/WorldModel.i6t#L20-L52
[inform-carry]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/WorldModel.i6t#L282-L295
[inform-try]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/Actions.i6t#L132-L177
[inform-action]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/Actions.i6t#L321-L332
[inform-timer]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/OrderOfPlay.i6t#L419-L504
[inform-turn]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/OrderOfPlay.i6t#L335-L386
[inform-clock]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/OrderOfPlay.i6t#L522-L538
[inform-save]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Materials/Inter/WorldModelKit/Sections/State.i6t#L29-L48
[inform-save-action]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/Source/Sections/Actions.w#L3020-L3051
[inform-license]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/LICENSE
[inform-metadata]: https://github.com/ganelson/inform/blob/5c7ba42b74db69b93b1290453c65189fa60cfc67/inform7/Internal/Extensions/Graham%20Nelson/Standard%20Rules.i7xd/extension_metadata.json
