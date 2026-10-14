# Progress Quest implementation digest

SHOWN, official static files captured 2026-10-14. Absolute extracts and hashes are in shared TOOLING. Locators refer to captured files; no code copied into YAIRPG.

| System | Locator | Mechanism / limit |
| --- | --- | --- |
| Task selection | `pq-main.js:297-363`, Dequeue | Pays out prior result, consumes queued scenes, returns to market if full, buys if gold sufficient, otherwise fights. |
| Reward generation | `pq-main.js:587-624`, WinEquip | Equipment slot and descriptors selected; purchase replaces an item. Not a player build planner. |
| Quest horizon | `pq-main.js:666-730`, CompleteQuest | Award selection and new task caption/target; stored quest list bounded. |
| Timed progress | `pq-main.js:906-951`, Timer1Timer | Work completion updates bars and selects next task; late callback time is capped. |
| Worker | `pq-clock.js:1-17` | Wake messages only; page owns simulation and DOM. |
| Growth curve | `pq-config.js:304-309`, LevelUpTime | Exponential term increases required seconds with level. |
| RNG continuation | `pq-config.js:116-141`, Alea.state/randseed | Four values saved/restored; uses modulo selection. Not proof of addressed independent streams. |
| Persistence | `pq-config.js:246-297`; `pq-main.js:1089-1150` | JSON roster and migration of misspelled spells; state loaded then clock starts. |

INFERRED: borrow readable nested horizons and automatic routines, while retaining YAIRPG's existing transactional host, observation rules, clocks and meaningful choices. Do not import source text, the DOM-coupled implementation or its absence semantics.
