# ngu-idle: top three deeper systems

These are the highest-payoff extensions among the source gaps found. Prior findings remain at their original evidence depth. All adaptation ideas are unselected PROPOSALS.

## D1 Encounter text and combat behavior

New extraction extends the old managed-only pass. 328 TextAssets contain 301 boss entries and 27 help/other entries; 19 boss entries are zero bytes. BossNameStory supplies the TextAsset/name pairing, while BossController indexes it and maintains independent sprite lists. Early, middle and final indexed entries show prose grows with the encounter sequence; the text itself is not copied into this report. EnemyAI dispatches seven ordinary behavior modes plus special branches. This separates narrative addressing, presentation and combat rules.

Limits: A plain row count hides missing writing and does not establish a branching dialogue system. Source references: A01/A02/A05. The serialized bossProperties order and every portrait link are still unread.

PROPOSAL: author one original encounter with a stable text ID, a visible behavioral tell and a real counter. A history record should remember the encounter while current access can change. Owner: characters/world events. Later acceptance: meet, counter, record, reload and revisit without duplicate reward.

## D2 Save envelope and repair topology

PlayerData is a typed object graph; SaveData wraps serialized player text plus a checksum. Both binary payloads become base64. ImportExport verifies checksum and future version before many null/default/version branches. OpenFileDialog has platform-specific route checks, 60-then-30-second local autosave timing, and half-hour standalone backup scheduling. Read-only source tracing shows the architecture, not safe behavior for every malformed input.

Limits: The checksum only detects text mismatch. It does not establish field validity, correct migration order or crash recovery. All routes and all repairs were not read; copying BinaryFormatter is not proposed. Source references: A04.

PROPOSAL: review a data-only envelope and migration matrix for one existing YAIRPG transition, with an interruption-safe backup test and exact retained/lost preview. Owner: save review and starts/endings.

## D3 Offline dispatch as a per-system contract

Character.addOfflineProgress calls subsystem methods and composes a receipt. Energy-fill delay affects later growth. Some daily/booster timers advance before early returns for selected challenges; other production stops at those returns. At least training, adventure, inventory, fruit, NGU, beard, hack, wish, card and cooking handlers are distinct.

Limits: A universal claim that offline equals online is unsupported. No-offline text also overstates what freezes. Full time acquisition/caps and idempotence remain unread. Source references: A09 and prior reset digest.

PROPOSAL: one existing funded work plan settles from its own eligibility and capacity rules and returns a receipt with stopped timers listed separately. Owner: engine expansion; offline policy remains unselected.

