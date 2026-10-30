# L9 slice 4: host patch for floor-wire (death and restart wiring)

Engine is in `src/harm_engine.js` (pure, save in, save out), commit below. Floor-wire owns the host files; nothing here edits them. Agent-verified, not human-reviewed; proposals under AD5.

1. **Backlash from rites and crafts.** Where harm is ticked (after the act engine settles):
   `const a=backlashAdder(save); settleLotmBacklash(state,acts,worldId,facts,a.add); save=a.result().save;` then write `save.harm` back with `setHarmState` (the `harm` domain). `a.result().records` are the `{carrier,source,before,after}` lines for the log.
2. **Backlash from casts.** On a completed cast: `accrueBacklash(save,'cast',{source:castId,rankGap})`. `rankGap` = how far the cast reaches past the caster's comfortable rank (0 if the cast pack has none). Weights live in `HARM_WORLDS['book.lotm.tingen'].sources`.
3. **Loss of control.** Each time advance, `lossOfControlTick(save,{minutes,attended,facts})`. `attended` = a treated rest or another carer is acting; `facts` carries `harm.rescuer.present`. Write `save` back; when `die==='loss_of_control'`, plan `die:loss_of_control` through `planContinuation` with a fresh token (the moment is `now - minutes + dieAfter`, if the host stamps it). The tick pauses while rescued; the rescued outcome and its debt are the world's `death.alternatives` row, not applied here.
4. **Heirs.** `resume:<lifeId>` now works from an ended life to a living, paused, tethered life; the dead life keeps `ended` and cannot be resumed, only restarted when active. No host change; show `continuationView(save).deaths` so the player sees who died.
5. **Combat/odds.** `harmOdds(save,'fight')` gives `{allowed,blockedBy,'versus.you.mods','odds.shift'}` as `[{axis,delta,cause,kind}]`; `harmPart(save,{partId,rung,cause})` is the only door that writes the injury ladder. Earlier patch `L9_WIRING_S2.patch` (simulation preview) is still the route for the action quote.

Limits: no native tick calls any of this yet; accrual weights and the 30-minute grace are proposed dials with a stated reason in the world row.

## Slice 5 additions (same commit family)
- `src/harm_engine.js`: sources `line` (uses `prone`), `object`, `place`, `residue` (recurring); `cycleBacklash(save,kind,{fromMinute,toMinute})` for a native time tick (call it with the previous and new native minute, counts whole cycles crossed, so small and large ticks agree); `transferBacklash(save,{from,to,amount,ratio})` for a curse passed to another carrier.
- `src/harm_loops.js`: `LOOP_RESETS` six-dial rows (default, Tingen, `loop.time-bound`, `loop.perfect-run` archetypes) and `loopPlan(worldId,{trigger,lifeEnded,hasCheckpoint})` returning the continuation command (`cycle` / `restart:*`) to offer. Host: use it to choose which button the connection panel shows; the commands themselves are unchanged.
