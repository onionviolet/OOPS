# P10 host join request, original proposal

Status: source module, not registered native gameplay. P00 alone writes shared
files. Desktop 1366×768; visible outcome: two-minute target-dice round with paid
costs, hidden pending face, known-person later offer and biography. Mobile deferred.

## API and preflight

Import exports from `src/absorb_p23/leisure_memory/index.js`.
Optional top-level save key `p23_leisure_memory` (constant LEISURE_SAVE_KEY).
Absent/null remains absent on load; initialize ONLY on actual leisure enrollment
with `createLeisureMemory(save.game_stats.total_deaths ?? 0)` using the native
counter, not a fabricated past. Preflight the optional family using
`validateLeisureMemory(save.p23_leisure_memory, save.expansion.clock)` before any
load/import mutation. Unsupported schema/unknown fields reject. No migration to
native life/death policy. No own inventory, clock, skill engine or RNG stream.

Inputs `c`: `{clock, rng, worldId, location, alive, conscious, idle, money,
stamina, personId, personKnown, personPresent, personAlive, personMoney}`.
Use live native played `expansion.clock` and saved `expansion.rng`; money and
stamina come from the native gameplay snapshot. Person fields derive from native
actor/discovery/custody at the actual location. Never infer knowledge from a name
or from a future NPC life entry. Bind `alive` to both native living body and
chronicle `life.endedAt === null` where enrolled. Bind `conscious` to actual
native recovery/unconscious eligibility, not `character.is_alive` alone. Bind
`idle` to current activity/action/combat/reading/sleep/trade and actor reservation.

Every mutation receives the captured expected revision as its final argument.
A retry uses the SAME revision; do not recapture current revision for a replay.
Reducers return a cloned `{state, rng, effects, minutes}`; never mutate inputs.
Native save publisher must stage/validate ALL costs, output state, native RNG,
actor purse, biography and relationship memory in ONE durable transaction.
Write failure leaves live and durable state/resources/RNG/memories unchanged.
Only render/log after publication. Do not publish reducer state then effects.
`minutes` is zero: these reducers never advance time. The two-minute pending job
uses the existing played-clock owner, not a wall timer or offline catch-up.

## Exact actions and publication

- `startLeisureRound(state, target, c, revision)`: target integer 1–6 chosen
  before drawing. Reserve the player through `pending.due = clock+2`. Costs one
  native stamina and one native coin, or Eda's one actual coin for an earned
  ready offer. Uses native xorshift RNG once; persists seed/result before showing
  pending UI. Draw stays hidden until settlement. Do not draw a native generic
  action outcome too. No skill/stat luck bonuses or recipe rewards.
- `settleLeisureRound(state, pending.id, c, revision)`: played clock at/after due;
  call on actual clock advancement and restore reconciliation. Saved face never
  rerolls. Exact completed IDs return no effects even while a newer round is
  pending. Matching face refunds one paid stamina through native clamp; ended
  or unconscious bodies gain none. Every result publishes one known biography
  memory. Rounds are repeatable. No cancellation refund after RNG commitment:
  leaving retains the paid pending result until due. Reserve release is host work.
- `respondToEda(state, 'help'|'refuse', c, revision)`: known living co-located Eda,
  idle player. Help transfers one actual player coin to Eda's native purse.
  Refusal transfers nothing. Both publish a private relationship memory and a
  factual biography. No universal karma, reputation or moral luck statistic.
- `revisitEda(state, c, revision)`: an actual later known-person conversation,
  at least two played minutes after help. Produces one ready offer; re-render or
  repeat callback cannot grant a second offer. One next practice spends Eda's
  actual coin. If she has no coin or is absent, ordinary paid play is available
  and credit remains ready. After consuming the offer another help can recur.
- `rememberNativeDefeat(state, {kind:'unconsciousness', cause:'combat', count,
  knownOpponent?}, c, revision)`: P00 hook in the actual `kill_player` combat
  path after its real counter increment, with count from `game_stats.total_deaths`.
  Enroll baseline from that counter. Pass knownOpponent ONLY from already
  observed combat identity, never a sealed registry lookup. Omit if not known.
  No hook for noncombat old-age ending, no death token item, no change to
  native recovering or inheritance. Counter duplicate yields no effects; gap
  rejects so missed host events are surfaced rather than guessed.

Effect outputs are an explicit publication request, not existing effect types:
`nativeMoney` -> actual character money delta; `nativeStamina` -> native stamina
cost/clamped refund; `personMoney` -> the named simulation actor's actual coins;
`relationshipMemory` -> existing `relationshipChange` on enrolled chronicle or
native private relationship owner, with ID/text and no global score;
`biography` -> `appendLifeMilestone` in existing life_record, kind `memory`,
calendar year and `lifeCalendarMinute(save['current time'])`, actual world ID.
Do NOT use played clock as absolute biography calendar minute. Effects have
stable IDs. Publish only once with the state revision in the same transaction.
Validate existing chronicle, biography, actor and resource owners too.

## Registration request

Register original actor `p23.leisure.eda` (Eda, adult Village cup maker), whose
only authored initial public fact is this occupation. Start with zero native
coins. A Village conversation introduces her through normal discovery, then
asks for one coin for her worn cup. This is NOT Maia/Oren's family or MG08 Sela.
Expose the ordinary target-dice practice in Village without needing to help.
Use the existing native action duration/reservation UI for pending rounds and
actual known-person conversation for help/refusal/revisit. Do not create a new
service engine, panel registry or second calendar. `leisureMemoryView(state,c)`
returns safe display fields; render using textContent/native escaping. Do not
render raw pending state. No VFX emitted, so Effects-off remains authoritative.

The current minigames checkpoint's R15 integration and MG08 aid are read-only.
MG08 has loans/gifts to Sela and MG09 venue gatherings; overlap is the native
publication/relationship owner, not a replacement for these modules. Ordinary
chance leisure is a separate original small activity. P00 should reuse those
owners when registering Eda, not duplicate Sela's contracts.

## Native acceptance required from P00

Fresh origin on rebuilt matching served bundle, 1366×768: two paid rounds;
paused pending Save/reload/export/literal-file import with exact frozen face,
seed, costs and due clock; exact completed persistence; help, spend two played
minutes, return, sponsored round; refusal comparison and repeat help after
credit consumed; absent/no-coin Eda controls; known-only biography; true native
combat unconsciousness with cause memory, old-age ended life still separate.
Old absent save and unsupported family import rejected before mutation; inject
write failure to prove all-or-nothing costs/RNG/biography. Preserve user saves.
Human play/taste follows native technical acceptance. This lane cannot satisfy
these gates before P00 supplies a native integrated candidate.
