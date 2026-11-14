# Play surface: more to consider

Round 1, 2026-11-14. Weibao asked "more to consider?" on the play-surface push and the resumed foundation run. Everything here is a proposal (AD32) except ACT NOW items that were done. Codes are PS1 onward; later rounds continue them.

Evidence was read from the tree at `601cf3f8b` plus uncommitted lane files: `src/ri_wolf_tide.js`, `src/book_world_lotm_wage.js` and others.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: n/a
tests: considerations only; bundle freshness checked by git log (dist and src last changed together at 0e242f27e)
review: none
```

## ACT NOW (done this round)

- **PS1. The committed bundle matches the source.** `dist/bundle.js` and `src/` were both last changed at `0e242f27e`, so what Weibao loads from the repo is the committed source. This is a git check; the bundle was not rebuilt and hashed. The full merge gate (one `npm test` on the combined tree) is still to run after Klein's wage loop and the wolf-parts change land.

## ACCOUNT FOR NOW

Ranked by how much each could change the work in flight.

| Code | Finding | Evidence | Constraint for the lanes |
| --- | --- | --- | --- |
| PS2 | **Three wolf models in one world.** The patrol table pays flat merit by pack size (`ri_lead_day_facts.js`, `RI_PATROL_ENCOUNTERS`). The foundation run's `ri_wolf_tide.js` now holds a creature population, with large wolves hunted out. The combat hunt sizes its own wolf (`tempo_lead_fights.js`). The Gu-keeper life has its own wolf ridge (`gu_wolf_ridge.js`). | Read in the files named. `ri_wolf_tide.js` already imports the patrol rows, so reconciling has started. | One owner: `ri_wolf_tide.js` holds the population and the parts a wolf yields. The patrol draws from it, and so does the hunt (`riWolfFoe`). The board pays for parts. Default: no other module keeps a wolf count (dial: a life in another world may keep its own; reason: two counts drift). The keeper's ridge reads the same table when both lives share the world (CTR). |
| PS3 | **Merit is still paid in four places.** Patrol rows say "50 merit on the board", the hunt after-hook pays 75 or 25, the drive-off pays 25, and the eye hand-in pays 10. Weibao's wolf-parts direction moves pay to the board. | Patrol rows in `ri_lead_day_facts.js`; the combat lane's report. | After the wolf-parts change, the alliance board is the only writer of merit. Rows and the after-hook yield parts or a witnessed credit item. A test sums the merit writers and expects one. |
| PS4 | **The day loops are click-only in an idle game.** Fang Yuan's day has no routine: feeding, drawing and patrolling are each one press. YAIR's core is letting time run. | No routine, automation or auto in `book_gu_lead_day.js`. ACR8 says a routine summary does not enable offline play by itself. | Design each lead's loop so a later "keep my day" routine can run it. Every action has a policy-readable cost and gate, which they already do. Hunger and wounds stop a routine at a decision boundary (ACR8). The routine itself is LATER (PS9). |
| PS5 | **Every lead builds its own day.** Fang Yuan's day is a pack-specific command extension, and Klein's wage is a new LOTM module (`book_world_lotm_wage.js`). Without a common shape, Harry's will be a third. | Files named. | Before Harry's loop, daily-loops writes the shared shape the three use, citing ACR and LVR: day verbs, a longer loop, gates with reasons, a result line, a routine policy hook. Harry's is built on it, and so are other lives, which carries the day across worlds. |
| PS6 | **The proof saves are private.** The journey tests for Fang Yuan's day and the wolf fight skip without private earned saves (`ri-fang-yuan-*`). The fight fixtures `lotm-tingen-day3` and `hp-exam-week` are DEV fixtures. | `ri_lead_day_journey.test.js` "skips without the private checkpoint". | The merge gate passing does not prove these loops. Each lane's receipt names its private save, and the coordinator reruns one private journey per lead before calling the push done. A committed DEV fixture for each lead's day is LATER (PS10). |
| PS7 | **Tuning moves the content hash.** Daily-loops noted that changing a dial moves the extension's hash (89803de77). OR3's build, play, adjust cycle will tune often. | 89803de77 receipt. | Default: old saves stay disposable, as Weibao set. Each lane should still say in its commit when a tune changes a pinned hash, so a "save won't load" report is traceable. |
| PS8 | **The UI pass ran mostly on the Village.** UIC180–UIC200 were seen on `perf/mid` and the Gu keeper. The leads' own screens (Tingen, Hogwarts, Fang Yuan's Beginning panel) were only touched where a lane asked. | UI ledger batches 15–17. | The foundation run's OR2 panel step and the daily loops run their Chrome check on the lead's own screen, and log UI friction they see as UIC lines in the UI ledger rather than fixing other lanes' files. |

## LATER / DELEGATE (ranked)

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| PS9 | **A "keep my day" routine for the three leads.** It repeats the day's verbs on a stated policy (feed on time, draw when the sea is under a set level, patrol when fed and unwounded), stops at decisions, and uses the existing common-actions and automation direction (CA2–CA5, 2026-11-01). | Opus, M per lead after PS5 | Ten in-game days run unattended in Chrome; the routine stops on a wound and on a wolf at the wall; Reports names what it did. |
| PS10 | **Committed DEV fixtures for each lead's day**, so the journeys run in the normal suite (AD36 item 11). | Sonnet, S | `tests/ri_lead_day_journey.test.js` runs without the private save. |
| PS11 | **The leads' own screens get the feature-ui method.** Tingen workroom, Klein's wage panel, the Hogwarts timetable, Fang Yuan's Beginning panel. | Opus (feature-ui lane), M | One ledger batch per lead with before and after seen in Chrome. |
| PS12 | **Ordinary player starts get the loops.** The loops exist on the leads' developer routes. A low-spoiler start in the same world (WER) should reach the same day verbs. | Opus, M, after PS5 | A fresh start in Gu Yue village can feed a Gu and patrol. |
| PS13 | **Hints for what is new.** Hold back, the wolf at the wall, parts hand-in and natural sea recovery each get one in-world hint the first time, in the Mixing voice (PRS9, UIC173). Not a manual. | Sonnet, S | First encounter shows one line; later ones do not. |
| PS14 | **The next worlds' fights**, from the carry-out's next-worlds table, start once the lead loops and the wolf economy settle. | Opus (combat lane), M per world | One live fight per added world, seen in Chrome. |
