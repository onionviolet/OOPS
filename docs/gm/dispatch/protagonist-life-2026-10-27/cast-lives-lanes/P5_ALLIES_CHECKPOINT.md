# P5 allies by goals and orders, 2026-10-30

Status: **at the AD43 floor for the road contest with Lio** (fixture-seeded, see FLR2). Agent-verified, not human-reviewed. Authority: LSD318-LSD320, LSD324, LSD325, LSD327, LSD328, LSD331, LSD333, LSD334, LSD340, LSD363; AR3/AR5/AR9; AD36.

## What exists

| File | Role |
| --- | --- |
| `src/tempo_allies.js` | Ally goals (survive, protect, aim, pay), derived fear, goal-weighted move choice, orders heard by keyed chance, cover chance, saved-ally validator. Every number sits in `ALLY_DIALS` with its reason. |
| `src/tempo_fight.js` | Allies act on the same clock through `policyMove`; an `order` move for the player (speech act, costs tempo, no mishap roll); a covering ally can take a blow meant for the player; the fight is lost when the player is down; fight end writes `party.lastResult` and a familiarity note for each ally. |
| `src/tempo_fight_contract.js` | Saved fighters may carry an `ally` block (validated); `order` is a legal move id. |
| `src/tempo_fight_domain.js` | "Accept it with Lio beside you" (party terms and fee through `initializePartyBattle`), an allies line, one button per order with its odds in words. Rival and Lio profiles now come from the same Enemy derivation the road duel uses (closes P4 F-P4-2). |
| `tests/tempo_allies.test.js` | 7 cases: own-goal acts, fearful vs bonded ally, keyed orders and odds, cover substitution and fall-back, save/reload resume, derived fear, Lio route closing the pursuit and writing the bond. |

## Design calls (proposals, not accepted decisions)

- Weights reorder four rules (flee, tend, guard, strike); no planner (LSD334). Fear is derived each turn, never stored (LSD325).
- Orders are heard by a keyed draw on bond, discipline, fear, noise and distance (LSD327); the draw is keyed on the fight clock, so the same moment gives the same answer and time passing is a new draw (LSD363). Odds show as words (LSD340).
- A followed order edits the ally's priorities for about half a minute of fight time (`orderMemory`), then they fall back on themselves.
- Lio's goals are defaults from who he is (hired, trained, keeps faith); bond reads the relationship axes. Both are proposals with dials.

## Floor evidence

- **FLR1 build:** browser bundle `5a172999cbc7bdc72df0479ca62334c3feac5e2af87a3fce10761511c127c643`. Full-suite state in the commit record.
- **FLR2 route:** DEV SEEDED field-workshop fixture (field steps, `party.meet`, road challenge begun through fixtures), then real clicks at 1920x1080: Accept it with Lio beside you, "Lio: Cover me" order, moves, reload, Export, Import, finish.
- **FLR3 shown:** log lines name the ally's acts ("Lio moves to cover you", "Lio braces"), a who-acts-next strip lists You, Lio, Mara, an allies line shows Lio's state and current order, and each order button shows its time cost and odds. Screenshot: `P5_allies-open-1920.png`.
- **FLR4 used:** the fight closes the road pursuit, sets `party.lastResult`, and writes a relationship note for Lio.
- **FLR5 kept:** mid-fight save reloaded identical apart from banked minutes (34 to 36 across two reload ticks, so held minutes now survive reload); Export then Import left the fight identical; a move after reload worked; the fight finished by real clicks as a win.
- **FLR6 label:** built, browser-verified at the fixture route; not director-accepted.

## Gaps

- Allies do not yet misread intent or miss hidden enemies (LSD326), canon pull on ally choices (LSD329), experience changing policies (LSD332), pre-fight plans (LSD320) and talking as a fight action (LSD330) are not built.
- The harness skipped one intro dialogue click ("Hello?") that no longer responds; the fixture start does not depend on it.
- The nav-bar/parked-shelf finding from P4 is unchanged and is owned by the UI defects session.
