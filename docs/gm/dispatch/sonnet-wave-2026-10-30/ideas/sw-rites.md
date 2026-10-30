# Idea intake: sw-rites

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30 (slices 1-4, volume 1; sibling-book shape check)

Shape check against the sibling book's existing rule rows (14 sampled by structure only; 54 rite/potion/craft rows exist, no names or facts used). Fields present in more than half of sibling rite rows: conditions, steps, results by outcome (`success`/`failure`/`partial`), who performs, limits; also common: inputs and products, `ritual.scale` (personal, single-room altar, one petitioner, village-wide, large sacrifice, one memory per performance). Rare: consequences with an agent (`by`), costs, place, acquire, reset, minutes. Rite kinds include incense use, device use, dance, directed spirit task, command in an ancient language, prayer, healing act.

| Class | Entry |
| --- | --- |
| ACT NOW | Slice 1-4 rows already carry conditions, steps, locators and S/T/I evidence; sibling shape needs nothing removed. |
| ACCOUNT FOR NOW | `outcomes` branches (success/failure/partial) are the common shape, not the exception. The divination adapter holds one signal per attempt; my summons rows hold one `limits` list. Apply the branch shape in the next summons or ability slice rather than widening `queries`. |
| ACCOUNT FOR NOW | `scale` (who or what the rite spans) is a first-class field in sibling rows and already exists in `ritual_conditions.js` (`scale`). Reuse it for summons rows when they get a ritual block. |
| LATER (level: schema; effort: S; done: summons rows gain `outcomes[{when,stated}]` and `performers`, test asserts both, existing ids unchanged) | Add `outcomes` and `performers` to `lotm_summons_rows.js` at the next summons slice (volume 2). |
| LATER (level: mechanism; effort: M; done: a consequence-by-agent field routed to the harm/backlash owner `sw-death`, not built here) | `consequences[{trigger, response, by}]` where `by` is the agent (the rite itself, a summoned messenger, a principle). Hand to `sw-death`. |
| LATER (level: data; effort: S; done: coverage ledger counts the L4 row files as a consumer or the wiring commit lands) | The ledger corpus does not list `src/lotm_*_rows.js`; counts only move when added or wired. Ask the ledger owner. |
| LATER (level: process; effort: S) | Luna sampling lanes pulled later-volume locators (`zh bN ...` prefix) into volume 1 queries once; the review caught it. Add a locator-prefix check (`/^zh 第/`) to every row test (done in slices 2-4 tests). |
