# Three deeper systems

These extend the prior event/economy pass at the dialogue, persistence and NPC-decision boundaries. SHOWN means source/data read; PROPOSALS are original options under existing owners.

## D1: A conversation shares rules with its visible choices

Sources: prior private `extract/code/EventStep.cs:1631-1939`, `EventUI.cs:2119-2255,2368-2414`, `Vagrus.UI/EventChoiceButton.cs:111-135`, `Vagrus.Data/EventScriptParser.cs`; private events table. Prior scheduler details remain in [EVENT_ENGINE](../pass-2026-10-14/EVENT_ENGINE.md).

The path is event eligibility -> current step description and participants -> choices with original IDs -> visible button mapping -> rechecked choice -> registered history and logged response -> check/action/transition. Portrait selection can change at each step; selected participating heroes have their own holder. The renderer composes dependency, outcome and test icons. A hidden choice that is not selectable is omitted outside test mode; visible unmet means can be explained. Clicking maps back to the original choice index, not its current visible rank.

Direct data sample: `asX3QUjjcLTP13YN`, a five-step companion exchange. Its root requires the actor, a named global variable value and absence of its own prior event history. The entry response restores that actor to maximum vitality. Agreeing to listen adds 10 loyalty; declining loses 10, and a later interruption can also lose 10. A later listening path terminates with an additional property change. The Loyalty UID was resolved against AirTable, rather than inferred from the prose. The reviewed terminal decline branch promises later conversation in prose, but the root repeat gate means that sentence alone cannot prove this same record is reachable again. Full later incoming paths remain unread. Exact IDs, scripts and full prose are retained privately, not quoted here.

A separate prologue sample, `kJY3LrP3D5M9rksp`, shows one actor-dependent question with an ordinary dependency and another with hidden plus dependency. It is a bounded data example of the distinction, not a full read of its eight-step route. The title keyword scan found 18 banter/small-talk matches; this is a lexical result, not the total number of conversations.

PROPOSAL P1: `docs/DIALOGUE_AND_INTERACTIONS.md` should declare what is unknown versus merely unavailable, and keep eligibility separate from response delivery. `docs/ENGINE_EXPANSION.md` should commit real typed effects and history at one boundary. One original companion interaction can test roster and money changes between render and click. Preserve reasonable return/reconciliation routes where the world supports them, rather than copying this sample's history lock globally.

## D2: Saves are a protocol, a queue and a migration program

Sources: `Vagrus/SaveGame.cs:350-767,817-938,2380-2609,2867-2903`, `Vagrus/SaveData.cs`, `Vagrus/SaveHeader.cs`, `GeneralSettings.cs:60`, `Crypto.cs:147-199`, `Vagrus.IO/VFile.cs:63-115` in prior private C# root.

The format uses a magic prefix, additive byte checksum, header length, base64 JSON header and compressed JSON body. The body persists more than resources: dialogue histories, scheduled actions, markets, notes, last-read pointers, tutorials, UI filters and fog of war are represented too. SaveVersion is 37 and minimumVersion is 14; tutorial/demo/mode gates can reject a header independently of its schema version.

A save request during an active event is refused in the reviewed Save method. Accepted threaded requests coalesce by path and return before durable completion. A worker writes data, then switches to the main thread to report results. A no-space result has a distinct warning; another error can trigger a synchronous durable retry. Flush waits for in-flight writing and drains the pending queue, with a timeout warning. This is not proof every exit flush succeeds.

The local durable method writes a temp file, verifies it and then deletes the old destination before move. The FileManager backend is a different route. Ordinary synchronous Save can call direct WriteSaveToFile instead. The method name Atomic does not prove atomic replacement for either route. Its verifier calls DecodeSaveData with full=false, which validates the outer data/header without deserializing the gzip body. Additive checksum is not strong corruption protection. These are static limits, not observed data loss or an exploit claim.

Load code includes content repair, not only field migration: old perks/characters, route visibility, unfinished scheduled work and a missing story variable can be reconstructed. Tutorial status can also be repaired from history. A timestamp in a header does not prove offline simulation. Personal saves, platform storage, malformed-body behavior and all migrations remain unrun.

PROPOSAL P2: `docs/ENGINE_EXPANSION.md` should make blocked/queued/completed outcomes visible to the existing save UI, validate the full payload before replacing good state and test migrations against content IDs as well as field shape. A selected implementation needs fixtures for an unsupported version, malformed body, interrupted write, repeated migration and exact import. Keep this separate from human gameplay acceptance.

## D3: Bounded simulation helps choose an NPC action

Sources: `HeroCombat.cs:10514-10630,11020-11996`, `AiTweak.cs:21-74,163-168`. These are newly read bounded consumers, not an exhaustive combat audit.

The AI starts a coroutine to simulate candidate actions when it has no selected skill, then consumes a selected skill and target through the combat host. Tutorial opening actions can bypass ordinary choice. The reviewed evaluation includes immediate damage/healing, kills/downed targets, armor/power effects, ongoing effects and net positional value. Tactical level can change whether maximum, average or skewed score is preferred.

Realistic simulation uses an iteration budget of clamp(14 + 4*tacticalLevel, 1, 150), unless a benchmark override applies. The non-realistic route returns 75; the declared per-frame budget is 8. These are conditional settings, not measured frame-time performance. Simulations can yield, and position scores have a cache with an explicit reset. It is more specific than saying enemies use utility AI, but does not prove universal parity, all legality checks or an autonomous overworld society.

PROPOSAL P3: adapt only the decision pattern under `docs/ENGINE_EXPANSION.md` and `docs/ENCOUNTERS_AND_PURSUIT.md`: enumerate legal original actions, estimate consequences with existing rules, cap work and execute exactly one selected action. Test that simulation cannot spend real resources, reapply a reward or reveal private information. Use authored reactions for companion promises where appropriate; combat lookahead does not replace a person's history.
