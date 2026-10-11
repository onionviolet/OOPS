# Noita composition digest

2026-10-09 source audit. No game was launched. This is a static model, with
engine gaps called out below. Adaptations are proposals, not accepted design.

Evidence paths below are archive-relative. Resolve `data/` against the private
extraction at `~/.codex/research/noita/data/`. Raw Lua/XML stays private.

## N7 verdict

**C1. Confirm the broad idea; correct the scope.** Wands contain card instances,
but evaluation is a small interpreter with a deck, a hand and a discard pile.
A modifier normally changes a cast group's shared state and requests another
draw. It does not universally attach to exactly one next card. A multicast
requests several draws within that state. A trigger builds a nested shot with
fresh modifier state, consuming its payload cards during cast construction;
the native projectile later releases the prepared payload. Evidence:
`data/scripts/gun/gun.lua:146-164`, `:202-234`, `:299-372`;
`data/scripts/gun/gun_actions.lua:4018-4031`, `:5573-5593`.

N7's capacity, cast delay, recharge and mana claims are confirmed, with further
axes: shuffle, draws per round, spread, projectile speed, mana reservoir and
mana refill rate. Do not collapse these into one quality number.
`data/scripts/gun/procedural/gun_procedural.lua:609-696`.

## Counted action catalogue

**C2. There are 422 active definitions across eight declared types.** Counted
from all of `gun_actions.lua` after removing block and line comments; commented
test actions are excluded. Each active `id` has one matching `type` field.
This is the shipped data catalogue, not 422 spells proven obtainable in play.
Spawn weights, unlock flags, special pools and the native engine affect access.
Types are declared at `data/scripts/gun/gun_enums.lua:1-9`.

| Type | Count | Role in composition |
|---|---:|---|
| Modifier | 143 | Change cast state or add behavior; often draw onward |
| Projectile | 122 | Emit a moving entity; some carry nested triggers |
| Static projectile | 45 | Emit a placed or persistent entity |
| Other | 42 | Special logic beyond the main families |
| Material | 26 | Emit material-bearing effects |
| Utility | 25 | Change resources, deck flow or other state |
| Draw many | 14 | Request more cards in one group |
| Passive | 5 | Persistent behavior declared as a card type |
| Total | 422 | Active records in this installed archive |

Example evidence: `data/scripts/gun/gun_actions.lua:24-62` (projectile),
`:4018-4031` (draw many), `:4776-4791` (modifier), `:10439-10472` (utility).
The type names classify cards; their functions still contain explicit behavior.
A declarative field list alone does not explain the whole spell system.

## Evaluation model

**C3. Keep these state owners separate.**

| Owner | State | Lifetime |
|---|---|---|
| Focus/wand | Capacity, shuffle, base draws, base cast delay, reload, mana max/refill, spread/speed | Persistent equipment stats |
| Card instance | Action ID, slot/deck index, remaining uses, identification, inventory ID | Across casts until removed or spent |
| Cycle | Deck, hand, discarded, accumulated reload time, first-shot/reload flags | Until deck refills |
| Cast group | Modifier state `c`, child draw count, projectile configuration | One root or nested shot |
| Cast as a whole | Current mana, shot effects, extra modifiers, draw controls | One cast invocation |
| Payload | Prepared child shot and trigger kind | Constructed at cast; dispatched on native trigger |

Sources: `data/scripts/gun/gun.lua:12-57`, `:76-121`, `:146-164`,
`:454-484`, `:559-590`.

A root shot resets a modifier state, copies the focus baseline from the engine,
sets its draw count from `actions_per_round`, receives current mana from the
engine, and orders the deck on the first shot. A shuffle focus randomizes
cards; an ordered focus sorts by slot index. `data/scripts/gun/gun.lua:170-200`,
`:454-484`.

For each requested draw, remove the next card. Use its explicit mana cost or
the default 10. If mana is short or remaining uses are zero, put it in discard
and try another card while cards remain. A successful draw subtracts mana,
adds the card to hand, updates current-action metadata and calls its function.
Negative mana costs can replenish mana. This means a missing resource can
change the resulting composition, rather than simply fail the whole cast.
`data/scripts/gun/gun.lua:202-234`, `:236-322`.

A damage modifier adds damage, cast delay, recoil and an extra entity to the
current state, then draws one card. Homing appends a behavior entity and draws
one. Double cast draws two cards. A modifier before a multicast is therefore
in the shared group, not bound only to a single physical card after it.
Exact retroactive projectile configuration is a native boundary discussed
below. `data/scripts/gun/gun_actions.lua:5573-5593`, `:5323-5338`,
`:4018-4031`; `data/scripts/gun/gun.lua:154-164`.

A timer, hit-world or death carrier begins a native projectile and trigger,
then draws a fresh child shot. `create_shot` resets child modifiers instead
of copying parent `c`; `draw_shot` restores the parent afterward. Mana and the
deck remain shared. Payload cards and their costs are processed now, not
redrawn at impact. Child draws allow immediate refill from discard on an
empty deck, whereas the root draw starts with that option disabled.
`data/scripts/gun/gun.lua:146-164`, `:244-251`, `:335-372`, `:500-501`.

After the cast, hand cards go to discard unless spent or permanently attached.
Use consumption has conditions: projectile production or utility/other type,
identification, optional custom use logic, and a native callback that may
cancel the decrement. Do not assume every evaluated modifier consumes a use.
An empty deck or a requested reload returns discard to deck, orders it again
and asks the engine to reload for the accumulated time.
`data/scripts/gun/gun.lua:389-431`, `:520-535`.

Always-cast cards follow a special route. They are cloned with unlimited uses
and marked permanent. Positive cost is not subtracted through the normal draw
route; negative cost is handled explicitly. A permanently attached modifier's
single onward draw is suppressed. Treat this as a distinct attachment policy,
not an ordinary first slot. `data/scripts/gun/gun.lua:289-305`, `:575-590`.

## Stacking and order

**C4. Composition supports several operators, not one stacking rule.** Damage
adds to a scalar; homing appends behavior entities; chainsaw assigns cast delay
to zero and subtracts reload time; add-mana uses a negative cost but adds delay.
Therefore card order can matter even within one group. Two modifiers need not
combine by addition, and a lower-cost part can outperform a rarer part for a
specific focus. `data/scripts/gun/gun_actions.lua:1583-1587`, `:4785-4790`,
`:5335-5337`, `:5586-5592`.

Deck wrapping only recycles discarded cards, not every card currently in hand.
Special cards can alter that flow: reset explicitly moves hand and deck to
discard, empties them, then rebuilds while setting a stop-draw flag. Recursive
copy behavior has an explicit check against `recursion_limit = 2`, but that is
not a general proof that every possible spell graph is bounded.
`data/scripts/gun/gun.lua:57`, `:244-251`, `:382-430`, `:433-447`;
`data/scripts/gun/gun_actions.lua:10439-10472`.

## Focus generation and power axes

**C5. Focus power is a budget with tradeoffs.** The procedural generator spends
cost across reload, delay, spread, speed, capacity, order and draws. It varies
the allocation order; higher capacity and multiple draws compete for budget.
Mana max and mana charge start from level formulas. Special rolls trade a
larger reservoir for slower refill or a smaller reservoir for faster refill.
Rare rolls add budget. Leftover budget can expand capacity. These are multiple
useful dimensions, not a clean common-to-legendary ladder.
`data/scripts/gun/procedural/gun_procedural.lua:429-540`, `:609-708`.

This supports E4B's quality/potency discussion as an analogy, but Noita does not
prove that stronger tags should always improve a recipe. Reservoir, throughput,
precision, repeatability, slot count and compatibility can improve separately.
A slow high-reservoir focus and a fast small-reservoir focus fit different builds.

## Proposed technique model for YAIR

**C-P1. Represent techniques as parts plus a compiled execution plan.** Use stable
`skill` or `power` IDs from the shared vocabulary; avoid calling them `card`
because that word already means storylets. A focus remains an `item`. Keep the
ordered part list on the technique/focus instance, not in E4's short item-key
`t` field. Each part declares role, cost, draw count, allowed scope, operator
(add, multiply, assign or append), and optional trigger kind.

The plan has group nodes and payload edges. Each group starts with a defined
baseline, collects modifier changes, emits verbs through existing effects,
then carries bounded child groups attached to `hit`, `timer` or `resolve`.
Use game minutes or explicit combat steps rather than importing frame counts.
Compile first, then resolve through E4 contact hooks so water, fire and targets
still use the same material rules. Do not execute arbitrary imported Lua.

**C-P2. Define the cost and failure contract before authoring builds.** Propose:
reserve payload resources at technique use; defer only the payload effects.
If a part cannot pay, record a skipped-part receipt and keep evaluating only
if that technique permits it. Put group scope, child reset/inheritance, use
charges, and attachment exemptions in visible data. Keep assembly and impact
as different receipts so players can explain a failed combo.

**C-P3. Correct the Rain Dance example.** E4B's `pour water → wider → trigger:
ignite` leaves modifier scope, carrier and payload ambiguous. A clearer
proposal is `wider → pour water [on contact: ignite]`. The contact puts water
in the place; the payload applies heat there; E4's authored material reaction
creates steam; a separate steam-on-body rule may blind. Neither blindness nor
that recipe is automatically supplied by Noita. The whole chain is proposed
YAIR content and needs explicit authored rules.

**C-P4. Keep a small observable proof.** One ordered focus, four parts (pour,
ignite, wider, on-contact), one multicast and two material rules are enough.
Acceptance must distinguish root and payload scope, insufficient resource,
spent charges, a modifier before multicast, and save/reload/import of the
assembly and a queued payload. This report does not authorize implementation.

## Engine gaps and coverage boundary

**G1. Lua reveals assembly, not every physical consequence.** `BeginProjectile`,
`SetProjectileConfigs`, trigger dispatch, `StartReload`, action identification,
remaining-use callbacks and component behavior are native calls. We did not
reverse engineer the executable or run the game. Exact collision conditions,
modifier application to already-emitted projectiles, minimum delay clamps,
mana regeneration timing and payload inheritance through native configuration
remain unverified. Do not claim a full Noita emulator from this digest.

Reviewed deeply: `gun.lua` assembly and exported cast/deck routes;
`gun_enums.lua`; action examples cited above; procedural generator budget and
mana sections; `procedural/wands.lua` initial sprite/stat records. Counted all
active action records in `gun_actions.lua`; did not manually read all 422
functions or all generated spell XML. None of these files was modified.
