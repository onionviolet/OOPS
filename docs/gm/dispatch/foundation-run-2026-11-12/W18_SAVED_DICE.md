# Wave 18, lane E11: saved dice

*Proposal throughout (AD32), 2026-11-12. Lane `fable/w18-dice`. Agent-verified by headless tests, not human-reviewed. Codes: PC94, PC95, PC99, KW6, KW15, KW35, GR1-GR17, PFP10, AD5, AD22, AD38, AF3, W17 design record G3. Engine only; no `src/main.js`, no UI, no game save change, no build.*

## The rule

The engine world holds one draw root and saves it in the engine save. A draw is a pure function of the root and an address. Nothing is counted and nothing is used up, so the order things settle in, the size of a jump and a save and restore cannot move a draw. Two things draw today: a kernel working's odds step, and a pack law through its view.

```
save:  {schema: 'engine.world@1', packs, world, records?, draws?: {schema: 'engine.draws@1', root}}
root:  an unsigned four-byte whole number or a non-empty string (what gen_kit takes)
```

The root is data. Two saves with different roots play out differently from the same start, which is how a world gets variety between runs; a world that wants the same story twice keeps the root. `createEngineWorld({drawRoot})` sets it, `engine.draws.root` reads it, and `engineDraw(engine, ...address)` gives a raw draw.

Compatibility: a save with no `draws` key (every save before this lane) restores with the default root, 0. A world on the default root saves without the key, so such saves are unchanged byte for byte. Another `draws` version is refused. Giving an old save its own root is an edit to the save data, not a restore option, so a root cannot change by accident between two loads.

## Addresses

| Draw | Address under the root | Why these parts |
| --- | --- | --- |
| A working's odds step | `working`, working id, step, deadline minute, `odds` | The working id and step name the attempt (KW6). The minute makes the same working begun later a new attempt. Deadlines are absolute, so jump size does not enter. |
| A pack law, `view.draw(address)` | `law`, pack id, then the law's own list | Each pack has its own lane (PFP10), so two packs cannot collide. The law picks holder, purpose, and the period or minute when the draw is of a moment. |
| An owner that takes a root and an id (heredity) | its own, under `engine.draws.root` | No change to the owner. |

A law that draws by period has to make the period a boundary the substrate stops at (a `horizon`), because decisions run at the minutes a run reaches. The fixture's gust law does this; a law that drew "each minute" with no horizon would differ between a jump and minute steps.

## The odds step

An operation already publishes `odds` in permille (KW15). The kernel now takes an optional `ports.draw`, in the same style as `settleCosts`. It is asked once per allowed step that carries odds, answers a raw draw, and the kernel scales it to a roll from 0 to 999; a roll below the odds is a hit. The receipt keeps `truth.draw = {address, roll, hit}`. The draw comes before the costs, so the price is for the branch that happened. The engine host supplies the port from the saved root. With no port a receipt is as it was before, and odds stay a label.

What a miss does is the operation's to say, through `miss` on its answer:

- Default: the step settles, lands none of the operation's effects and keeps none of its facts. The working goes on.
- `miss: {effects, facts, observed}`: another outcome (a fumble that bruises).
- `miss: {ok: false, reason}`: the working is interrupted with cause `draw`.

Effects and costs an authority attached to the step (KW35) land on a hit and on a miss.

A quote shows the odds and what a hit would land. It does not ask the port, so it cannot show the outcome, and its fingerprint is the same under every root. Since draws are addressed, nothing is consumed by quoting either. A world that wants a seer to read the roll ahead of time can add a knowledge route that calls the same address at a price; that is a later row, not a default.

## Lineage for copies

A holder's innate draws (the fleece it grows, its height) go by its draw key: `view.drawKey(id)`, which is `refs.draws` when the holder carries one and its id otherwise. Proposed default for a copy or clone act: set the copy's `refs.draws` to the original's draw key, so a clone under a new id shows the same innate traits. The dial is to leave it off (or set a fresh key), which gives twins raised apart. Draws of a moment (does this gust hit today) use the holder's own id, so a clone and its original fare differently from the day they part. The key is saved with the holder.

Shown in the test with the creature owner's own functions and no change to them: `individualSpread` and `expressPolygenic` given the draw key as `id` and the saved root as `root` return the same height and fleece for the copy, and different ones for the independent copy. That closes G3 at the engine level. For the game's creature records to do the same, `creature_lifecycle` needs an optional `drawKey` on an individual (copied by a clone act, absent otherwise) and `living_body.js` line 140-141 needs to pass `animal.drawKey ?? id`. The holder lifecycle lane (E12) needs its copy act to set `refs.draws`.

## What the test proves

`tests/saved_dice.test.js`, an original fixture world: three sheep in a fold, two twelve-step workings at even odds, a fixture pack with a gust law (by period) and a fleece law (innate).

1. One jump, minute by minute, uneven jumps, a restore at four points and a restore at every minute give the same save, with hits and misses mixed.
2. What landed matches what the receipts say was drawn.
3. Two roots give different rolls, gusts and fleeces. A number root and a string root both replay.
4. The compatibility rule above, both directions.
5. A working's draws are the same alone, beside another working, and whichever began first. The fold's gusts are the same with or without the sheep.
6. A quote lists the odds, does not call the port, and has one fingerprint under two roots.
7. The three miss behaviours, and an interrupted working restores.
8. The copy rule, with the heredity functions.

## Below the bar, and what else needs it

- **D1.** `ownPacks` on the engine world is new: packs the caller brings, passed again on restore. It was needed to run a fixture law through the engine save without adding a registry row. The coordinator may prefer a registry row.
- **D2.** An operation gets no raw draw inside `settle`, only odds. A step that picks one of several outcomes needs a `draw(purpose)` argument that is withheld in a quote.
- **D3.** Stored workings, bindings, the cost owner and reactors do not draw yet. A stored working's firing would use `stored`, id, minute.
- **D4.** No engine quote action exists (E7), so the quote proof runs on the kernel with a port that fails if asked.
- **D5.** Paced workings carry the port through untested. The contract doc (`docs/KERNEL_WORKING_CONTRACT.md`) has no line for the port yet.
- **D6.** Older owners (`check_resolver`, `spell_depth`, `crowd`, `trade`, `story_director`) still take their root from their caller. Tie-in means handing them `engine.draws.root`; none was changed.
- **D7.** A law draws through `view.draw` inside `decide`, `rates`, `advance` and reactors alike; only `decide` is tested.

## Files and checks

New: `tests/saved_dice.test.js`, this note. Changed: `src/kernel_working.js`, `src/world_substrate.js`, `src/engine_records.js`, `src/engine_world.js`.

Reachable from `src/main.js` (`node scripts/reachable.mjs --is`): `src/kernel_working.js` and `src/world_substrate.js` are reachable (exit 0). Both changes are optional and off unless a caller passes a draw; no game caller does. Not rebuilt, not exercised in a browser. `src/engine_records.js` and `src/engine_world.js` are not reachable (exit 1).

Checks: `node --test tests/saved_dice.test.js` 9 of 9. The 58 test files that import a changed module: 435 of 449; the 14 failures are all `ENOENT` on `docs/research` or another dispatch folder that this sparse checkout does not have (`effect_grammar` 7, `effect_host` 3, and one each in `brew_grammar_layers`, `gu_move_roles`, `gu_coupled_working`, `spell_grammar`). `npm run check:arch` exit 0. The full suite, `check:rules` and `check:docs` are left to the fold.
