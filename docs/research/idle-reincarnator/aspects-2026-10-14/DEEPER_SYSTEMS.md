# idle-reincarnator: top three deeper systems

These are the highest-payoff extensions among the source gaps found. Prior findings remain at their original evidence depth. All adaptation ideas are unselected PROPOSALS.

## D1 Story acquisition, remembrance and payment

All three sub-sources were structurally inspected: lore 117, job 48 and life 12. Every row declares popup=true, but controller preferences can suppress repeat popups. Requirements cause an unlock; on_unlocked adds effects and rewards then queues presentation. rebirth clears current unlocked/effects while retaining was_unlocked in that method; load restores effects without calling give_rewards.

Limits: Seen, active and paid are related but distinct. Full late-story continuity remains unread; a structural census does not mean all prose was semantically audited. Source: Story, StoryPopupHandler and the three content.json files in A01/A02.

PROPOSAL: a teacher event grants one method with a durable learning receipt, a replay-aware line and no duplicate grant on load. Owner: characters/world events plus technology/progression.

## D2 Save write stages and time-bank accounting

Save emits JSON/GZIP/base64; temp creation, main-to-backup rotation and temp promotion are explicit. Autosave requests every 10 seconds use a worker gate. Offline load clamps negative wall time, adds stored bank and does not replay lives. OfflineTimeManager.tick subtracts speed/2 per call during fast-forward; run_game_loop calls it each in-game frame.

Limits: Backup failure paths and frame-coupled spending deserve focused review if the pattern is selected. Nested mutex lock calls require Godot reentrancy semantics, so this report does not label them a deadlock. Exact runtime rate/thread consistency is unverified. Source: A04/A09.

PROPOSAL: represent banked seconds explicitly and use elapsed-time integration, with pause/zero/FPS-independent checks and crash recovery at each file rename boundary. Owner: engine save review and engine expansion.

## D3 Mod insertion and cached progression

GameLoading initializes base assets then enabled mod assets before saved-state binding. Mod folders use mod.json and per-family/type content.json; load_modded_content assigns content[id] directly, and type insertion can retain an existing content map. Level precomputes 1001 powers and caches reductions; signals refresh dependent effects.

Limits: This is useful content extensibility, but an overwriting assignment is not a dependency/conflict policy. Save IDs must be bound after the final definition set. Full mod ordering and cache dependency correctness remain unread. Source: AssetLoader, ModManager, Mod, Level.

PROPOSAL: add a static content-ID/reference validator and deterministic conflict report before any optional content pack, reusing existing authoring rules. Owner: engine authoring; no mod runtime is selected.

