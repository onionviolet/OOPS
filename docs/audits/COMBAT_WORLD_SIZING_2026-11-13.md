# Combat world sizing · 2026-11-13

What Gu, Hogwarts and LOTM fights already have, and what their signature fights still need. This carries out [CBD92](../COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md#round-18-unknowns-allies-pace-growth-and-what-a-world-supplies-2026-11-13). Findings and proposals, not accepted decisions.

**How it was checked.** Three read-only passes over source and tests, one per world, on the working tree of 2026-11-13. No tests were run and the game was not played. Spot-checked afterwards: the self-or-foe target rule, which files import each fight pack, the named places in the Hogwarts duel pack, and the test that keeps LOTM out of the contest engine. The gap counts are a reading of the code, not a measured estimate. The signature fights were chosen for this pass.

## Findings

- **F1 · There are three fight engines, and each world sits on a different one.** Gu runs on the shared [contest](../../src/contest.js). Hogwarts has two unjoined stacks: contest rows in [contest_packs/hogwarts.js](../../src/contest_packs/hogwarts.js) and a spell engine with a contest shell in [hp_duelling_club.js](../../src/world_packs/hp_duelling_club.js). LOTM runs on the [tempo fight](../../src/tempo_fight.js), and [a test](../../tests/contest.test.js) keeps LOTM modules out of `contest.js`.
- **F2 · What a player can reach today is narrow.** LOTM has live fights against ordinary men (the rent collector, constables, warehouse thieves, the revolver street fight). The Gu pit fight in the live game is a scripted chain that does not start a contest; the academy spar may be reachable through a capability-run panel (not confirmed). The Hogwarts stacks are imported by tests alone, and the live Hogwarts duel is a supper-and-wait sequence with no fight in it.
- **F3 · The same few gaps recur in every world.** See the table below. Moves that address something other than a fighter, and third parties who arrive or watch, are missing in all three.
- **F4 · The Hogwarts spell stack already has the tabletop scene.** It has named places (`west-platform`, `east-platform`, `far-floor`, `doorway`) joined by a sightline and a path, a wand as a real thing with a grip, a proctor standing in a place, escape through the doorway and pursuit. It is the nearest existing model for CBD62 and CBD69.
- **F5 · Real state enters fights in two places.** LOTM's revolver fight spends real loaded rounds. Gu's `liveProfile` counts a Gu if it is alive, present, controlled and fed. No path yet builds Gu fighters from a live player's own Gu.

## Shared gaps

| Code | Gap in the contest engine | Gu | Hogwarts | LOTM | Nearest existing |
| --- | --- | --- | --- | --- | --- |
| G1 | A move can address a thing, a place or another working (today: self or foe) | A Gu as a target | Pick up a wand; counter a spell in flight | A ritual as the stake | `drop` records a dropped item's position; the spell stack's Finite and shield |
| G2 | Third parties arrive, watch and step in | Reinforcements | A teacher in the corridor | Witnesses and exposure | `handoff` for relief; the `contest.blow` effect at a place; the proctor flag |
| G3 | What a fighter knows about a foe, and a look action that fills it | Hiding | | Pathway and tier; shown against believed strength | Notice and surprise at the opening; tempo's study step |
| G4 | Scene conditions beyond a line and sunlight: cover, terrain, darkness | Hunt terrain, night | Forest at night | Fog is in tempo | Positions, reach, `light:sun`; place tags that no rule reads |
| G5 | Endings: first blood or points, capture | Drill, taming | | | `limits: {landed}`; outcome names `captured` and `escaped` exist |
| G6 | Lasting conditions such as poison or slow | Gu duels | | | Add and remove on a body quantity |
| G7 | Allies with their own choosers, and orders to them | | | Nighthawks team | Tempo has `order`; contest has `ports.choose` and `wants` |

## Per world

| | Gu | Hogwarts | LOTM |
| --- | --- | --- | --- |
| Engine | Contest | Contest rows and a separate spell engine | Tempo |
| Moves on hand | About a dozen: moonblade forms, bow, fists, bite, close in, slip past, a Jade Skin guard | Disarm, shield, two jinxes, Finite (spell stack); four rows (contest stack) | Jab, swing, guard, tend, withdraw, yield, ally orders, shoot, reload |
| Reads real state | Gu alive, kept, controlled and fed; essence from fixtures | Wand grip and place, speech, footing; stamina seeded | Loaded and carried rounds, native stats; Beyonder state unread |
| Scene | A line with reach, sun direction and glare | Named places with a sightline and an exit | A conditions line with light and fog |
| Endings | Killed, yielded, routed, withdrew with pursuit | Referee call, surrender taken or refused, escape, pursuit | Win, lose, yield, withdraw, written to heat and wages |
| Live today | Scripted pit fight; spar unconfirmed | None | Four fights against ordinary men |
| Code gaps for its signature fights | About 5 (G1, G4, G5, G6, darkness) | About 5 (G1 three ways, G2, joining the two stacks) | About 6 (G3, G7, G2, ritual stakes, pursuit wiring), after an engine decision |
| Data-only gaps | 3 to 4 | 3 | 3 |

## Reading

- **R1 · G1 and G2 pay off in all three worlds.** A move that can address a thing, place or working is the round 12 loose-wand case. Third parties who arrive and watch are the round 17 school corridor and the LOTM exposure cost.
- **R2 · Gu is closest on the contest engine.** It has the most moves and reads real Gu state. Its nearest step is a live entry that builds fighters from the player's own Gu.
- **R3 · Hogwarts is closest in shape.** Its spell stack already has places, things and an intervener. Its cost is joining the spell stack to the contest so one fight sees both.
- **R4 · LOTM is live and furthest in kind.** Its fights work today on tempo with real bullets, and none involves a Beyonder. Moving it to the contest engine is larger than any single gap. Default (proposal): leave LOTM on tempo for now, build G3's knowledge fields where either engine can read them, and revisit the engine question when a Beyonder fight is next in Klein's journey.
- **R5 · A possible order (revised later the same day).** Headless before live, and the silent routine fight before pauses (PC95, palette CBD305 and CBD308). One routine fight told in terse lines and passing the three trials, which now exists for the Gu pit duel ([test](../../tests/fight_three_trials.test.js)); then G1 through the loose wand in the Hogwarts stack; then G2 through a corridor teacher; then G3 for LOTM. A live entry that builds fighters from the player's own Gu follows the headless proof instead of leading.
