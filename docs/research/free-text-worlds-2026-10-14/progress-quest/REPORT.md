# Progress Quest

2026-10-14. Static read of official web `main.js`, `config.js`, `clock.js` and `roster.js`; historical mirror pinned in [tooling](../TOOLING.md). No game executed.

**PQ-F1, SHOWN:** `Dequeue` cycles queued scenes, fighting, selling an overfull inventory and buying gear. `Timer1Timer` advances separate task, XP, quest and plot bars. These nested horizons provide near-term movement while longer goals accumulate. Loot names and short scene text supply variety; equipment/quest rewards renew the visible sheet. [Official main source](https://progressquest.com/play/main.js), `Dequeue`, `CompleteQuest`, `Timer1Timer`.

**PQ-F2, SHOWN:** The current web clock worker sends a tick every 50 ms; the simulation runs on the page. Elapsed increments cap at 100 ms. `LoadGame` restores state and resumes rather than replaying time since the saved stamp. Saved Alea state supports RNG continuation, but whole-game replay was not tested. Storage writes a JSON roster, with localStorage/WebSQL/cookie selection. [Clock](https://progressquest.com/play/clock.js), [main](https://progressquest.com/play/main.js), [config](https://progressquest.com/play/config.js).

**PQ-F3, INFERRED:** The spectator appeal is legible accumulation, funny combinations and anticipation of the next visible change. It offers no evidence that random prose alone can sustain YAIRPG's deep world agency. The website's emulated-supercomputer story and elaborate raid advice are parody, not technical evidence. [Play introduction](https://progressquest.com/play/), [news](https://progressquest.com/news.php).

## Ranked PROPOSALS

| Code | Proposal / owner | Cost and disposition |
| --- | --- | --- |
| PQ-P1 | Show current task, queue goal and longer project together on desktop. Owner: thematic UI. | Adapt a compact panel; target 1366x768 and 1600x1000. |
| PQ-P2 | Let a declared routine alternate work, storage and resupply. Owner: work scheduler. | Trial one finite loop, pause on an explained blocker. |
| PQ-P3 | Add grammar variants keyed to actual creature/item facts. Owner: generation foundation. | Small; presentation must not invent authoritative events. |
| PQ-P4 | Give level/project milestones a readable earned consequence. Owner: skill growth, action legibility. | Small; useful unlock over another empty counter. |
| PQ-P5 | Save pending task and RNG continuation together. Owner: persistence/offline audit. | Adapt contract, never copy the legacy format blindly. |
| PQ-P6 | Keep longer-term quest context while compressing repeated routine logs. Owner: journal. | Small; retain causes and rewards outside lossy prose. |

## Prior finding reconciliation

| Prior record | Result |
| --- | --- |
| Queue row 15: source public, unverified | Confirmed: official readable JS plus mirror commit. |
| Historical mirror README says static client only | Correct for current edition: official main source includes online brag routes and uses a worker clock; mirror differs. |
| Automatic progression might imply offline catch-up | Correct: inspected current path caps time and does not use saved absence for replay. |

Static source is checked; gameplay, import and long-run behavior untested by authorization. [Digest](DIGEST.md), shared [checkpoint](../CHECKPOINT.md).
