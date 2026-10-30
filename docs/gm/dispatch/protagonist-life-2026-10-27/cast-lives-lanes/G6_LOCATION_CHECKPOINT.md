# G6 hit location in tempo fights, 2026-10-30

Status: **at the AD43 floor for the road contest** (fixture-seeded, see FLR2). Agent-verified, not human-reviewed. Authority: gap audit G6 (`docs/audits/GAP_AUDIT_2026-10-30.md`); LSD307-LSD317; AR3/AR5/AR9; AD36. Direction (Weibao, relayed 2026-10-30): middle path, only the extreme rung blocks.

## What exists

| File | Role |
| --- | --- |
| `src/tempo_location.js` | Slot weights (stance, move, reach, aim), one keyed pick, armour at the slot (with a piercing seam), part injury from the share of health a blow takes, odds from L9's `harmOdds` on each fighter's own parts. Every number sits in `LOCATION_DIALS` or `SLOTS` with its reason. |
| `src/tempo_fight.js` | Strike branch picks the slot, mitigates with that slot's armour and the slot's scale, records `b.hits` (last 12), injures the part, shifts accuracy, evasion and speed by degree, and refuses a strike only when L9 blocks it (extreme rung). The player's parts leave as `plan.harmEffects` at fight end. |
| `src/tempo_fight_contract.js` | Saved fighters may carry `parts`; `b.hits` is validated. |
| `src/tempo_fight_domain.js` | Aim chips (Anywhere, Head, Body, Arm, Leg), an injuries line with the shift per axis, injuries on the Opponents line; after the commit the host writes the player's parts through `harmPart` and `setHarmState` (default parts rows). |
| `src/native_battle.js` | `readNativeFighter` also returns `armorBySlot` (head, torso, arms, legs) from worn gear. |
| `tests/tempo_location.test.js` | 6 cases: weights, armour by slot and piercing, ladder and odds and block, maimed striker, save/reload/replay and harm effects, aim cost. |

## Design calls (proposals, not accepted decisions)

- Head maps to eyes, arm to hands, leg to legs (L9's default part rows). The body has no part row, so a body blow only costs health.
- A blow injures a part when it takes at least 8, 18 or 30 percent of maximum health (shaken, bruised, wounded); a critical goes one deeper; a repeat blow at the same level deepens the part one rung, capped at maimed. A light blow never deepens a worse injury.
- Slot scales: head 1.4, body 1, arm and leg 0.75. Aiming costs one time unit and makes the blow easier to avoid (0.9 hit); it moves 35 percent of the weight to the chosen slot, never all of it.
- Slot armour is the worn defence in that slot over a base that covers everything. A world with no per-slot data behaves as before.

## Floor evidence

- **FLR1 build:** browser bundle `c1e3255d40aa48ccc821524b51bd516fd0f83cc9c7eee43fb4654bc7b747b182` came from the first run; the final run's bundle hash is in the commit record of the harness output. Full-suite state in the commit record.
- **FLR2 route:** DEV SEEDED field-workshop fixture. Seeded for the proof: the rival's attack raised threefold (so injuries are reachable at level one) and a Snakeskin vest and hat (quality 100) put in the pack and worn through the game's own equip function. Then real clicks at 1920x1080: Accept the road duel, aim chips, moves, reload, Export, Import, finish.
- **FLR3 shown:** the log names the slot and what the armour stopped ("Mara hits you in the body for 1, armour stopped 9.7."), the aim chips, an injuries line ("hands bruised (accuracy -25%), legs bruised (speed -25%, evasion -25%)") and move costs that rise after a leg injury (Quick strike 3 to 4 time). Screenshot: `G6_location-1920.png`.
- **FLR4 used:** located injuries change later hit chance, evasion and speed; a maimed striker cannot strike; the player's injuries are written to the L9 ladder after the commit.
- **FLR5 kept:** mid-fight save reloaded identical apart from banked minutes; Export then Import left the fight identical; the fight finished by real clicks.
- **FLR6 label:** built, browser-verified at the fixture route; not director-accepted.

## Gaps and requests

- **L9 (needs a patch from the injury-ladder owner):** `HARM_WORLDS['base.frontier']` has no `parts`. Under that world the player's stored injuries do not act and `harmPart` on a real frontier save throws. The host writes through default rows meanwhile. Add `parts: partDefaults()` there.
- The shield branch of a strike returns before location (a blocked blow has no location).
- Foes never choose an aim; only the player does. Unseen injuries do not exist yet because every injury is announced in the log.
- The combat card (`combat-surface` lane) will read `b.hits[]` (`slot`, `dmg`, `stopped`, `injury`).
