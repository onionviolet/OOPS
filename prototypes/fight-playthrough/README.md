# Fight playthrough (prototype)

A recorded playthrough of three fights on the proposed fight screen, to watch. It carries out round 30 of the [combat palette](../../docs/COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md) (CBD279 to CBD287). Everything here is a proposal.

Build and watch, from the repository root:

- `node prototypes/fight-playthrough/build.mjs` records the fights and writes `work/fight-playthrough/index.html`. Open it in a desktop browser. Space plays and pauses, the arrow keys step, and the bar scrubs.
- `node prototypes/fight-playthrough/capture.cjs --video` checks the page headless at 1920 by 1080 and writes stills and `work/fight-playthrough/playthrough.mp4` (about two minutes).

What is real: the fights. `record.mjs` runs the Wang Er pit duel on the contest engine (seed 5) and a street fight on the tempo engine (seed 7), reads each state through `src/fight_view.js`, and writes one frame per event. Every move, hit, cost, time and outcome comes from the engines.

What is built, not staged: the Gu scenes' Reports lines and result block come from `src/fight_text.js` (terse patterns over the contest log, CBD310), with repeated plain lines folded into one with a count.

Also built: the rule for when a fight pauses (`src/fight_pause.js`, CBD56), read from the shared view, so the same rule pauses the Gu fights and the street fight.

The pause rule's memory is taken from the recording's first fight (`fightPauseMemory`), every result block is `fightResult`, and the Gu move, means and part words are world data (`GU_FIGHT_LABELS`).

What is prototype: the three-panel layout (CBD75), the names of the people in the fixture fights, and the answers given at each pause, since nobody is playing a recording. The page footer says so.

The five scenes: a routine fight that asks nothing; the same fight entered with less essence, which pauses twice; a bout whose fighters are built from the Gu each keeps in the engine world (`src/world_packs/gu_fight_entry.js`), ending with what the next activity inherits; the same bout with an unfed Gu, where the move fails and the line still says what it cost; a street fight on the other engine through the same screen, with the parts that engine leaves out marked.

Not shown: the live game, a knowledge filter on what you know about foes, motion and sound cues, and the scene layer's spots. Below the AD43 floor and not played in the game.
