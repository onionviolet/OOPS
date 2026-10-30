# P4 tempo runner (tempo fights), 2026-10-30

Status: **at the AD43 floor for the road-rival contest route** (fixture-seeded, see FLR2). Agent-verified, not human-reviewed. Authority: LSD307-LSD317, LSD322-LSD323, LSD341-LSD343; AR3/AR5/AR9; AD36/AD43/AD45.

## What exists

| File | Role |
| --- | --- |
| `src/tempo_fight.js` | Tempo runner on `runConflictFrame`: time-unit costs scaled by speed, earliest-ready acts, surprise opening (LSD341), condition mishaps (LSD343), keyed draws (`checkKey`), named-policy driver, safe-only hand-over (LSD316), witness memory effect per damaging strike (P6 hook), adopts an open encounter session. Numbers sit in `TEMPO_DIALS` with reasons. |
| `src/tempo_fight_contract.js` | Schema 7 validator, away-minutes holder, constants. Light on purpose, so `native_battle_contracts.js` and `clock_owner.js` import it without a cycle. |
| `src/tempo_fight_domain.js` | Panel in the Notebook People view: log, who-acts-next strip, moves with time cost, hand-over button. Re-reads once a second because a restored waiting fight raises no publication. |
| `src/native_battle.js` | One export (`finishRoadContest`) so a tempo contest closes the road pursuit the same way the native duel does. No behaviour change; F1 replay suite still 149/149. |
| `src/clock_owner.js`, `src/native_tool_domains.js`, `src/main.js`, `src/adventure_notebook.js`, `src/native_battle_contracts.js` | One hunk each: bank away minutes, register the domain, pass `campaignContext`, map the panel, validate schema 7. |
| `tests/tempo_fight.test.js` | 9 cases: reload resume, speed order, replay + named policy, safe hand-over, surprise/mishap, held minutes, stale/wrong turn, road-pursuit close, witness memory effect. |

## Design calls (proposals, not accepted decisions)

- Away time: the game has no wall-clock catch-up, so a waiting fight loses nothing. Ticks that would have run are banked and repaid 60 per tick after the fight, capped at 7 days (`heldCapMinutes`).
- The legacy duel button stays; the tempo contest is a second drive of the same encounter, so the pursuit, relationship and insight consumers are shared.
- Withdraw is an immediate exit until P7 makes it an attempt.

## Floor evidence

- **FLR1 build:** browser bundle `4395934e5f2714dd07085193d4fc2a34e44e9e9cfd7081d59d4b207f46b00682` (built from the working tree at run 15). Final full-suite state below.
- **FLR2 route:** DEV SEEDED field-workshop fixture (field steps and the road challenge begun through fixtures), then real clicks: Accept the road duel as a tempo contest, moves, reload, Export, Import, finish. Not an earned whole-life route.
- **FLR3 shown:** each move shows its label, time cost and effect text; Tend shows why it is unavailable; the panel states that the world clock holds and time away is kept. Screenshot: `P4_tempo-open-1920.png` (1920x1080).
- **FLR4 used:** the result closes the road pursuit (`rival.lastResult`, pursuit `tested`), applies its relationship effects through the shared finish, writes vitals back to the character, and queues witness memory effects.
- **FLR5 kept:** headless Chrome 1920x1080, fresh origin: fight saved mid-tempo (7 actions) and reloaded byte-identical; a move after reload worked; Export then Import showed the same log and moves in the live panel; ticks while waiting left the clock at 21; finishing by real clicks closed the session (`lost`, pursuit `tested`); held minutes (33) were repaid to 0.
- **FLR6 label:** built, browser-verified at the fixture route; not director-accepted.

## Findings and limits (AD45)

- **F-P4-1 (shared layout, not edited):** after a reload under the composed workspace the notes shelf is parked, and the "Open waiting response" shortcut does not unhide it; the top navigation "Notebook" tab does. Likely true for the existing duel too; owner `src/workspace_layout.js` / `src/workspace_views.js`.
- **F-P4-2:** rival fighter stats are an approximation (`attack*9` points, `attack*1.6` power), not the player-side derivation. Share the derivation when a second consumer needs it.
- **F-P4-3:** minutes banked but not yet folded into the saved fight are lost on reload (known limit, no wall-clock accrual to repay).
- Mishaps, reactions and channelled actions (LSD311), intent that lies (LSD342) and gear attrition (LSD346) are not built.
- The harness locator clicks are rejected by these panels, so the run used coordinate clicks with an element-at-point check; the nav bar covered controls only while the panel was parked, not at the default position.
