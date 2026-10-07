# XState: bounded goal authoring trial

2026-10-06. **Trial outside the game first; adopt no runtime dependency now.** The useful question is whether a statechart makes one NPC's interrupted, branching goal easier to author and review than current controllers plus commands. XState adds neither material ownership nor social motivation. No machine was executed or installed in this research.

## Qualified source

The npm registry reports stable `5.33.2`, alpha `6.0.0-alpha.64`. The published stable tag `xstate@5.33.2` resolves to `fbee62e7c1586315ed478c2fedf530d7e0ff5a3e`, commit2026-09-15. Its package version matches. The initially screened HEAD `38dcaffb20ec7f3cbb10e6161d8f0ebacca33701` also reports5.33.2, but the stable tag owns the source claims here. Registry response and selected files/hashes are outside Git in `/Users/weiwei/.codex/research/idle-social-engine-scout-2026-10-06/xstate/`.

The official [pure transition](https://stately.ai/docs/pure-transitions) and [persistence](https://stately.ai/docs/persistence) pages currently show a v6-alpha navigation header. Treat them as documentation, not evidence that YAIRPG should adopt alpha or that every v6 persistence promise applies to5.33.2. The inspected v5 source independently establishes the selected behavior.

| Source at stable pin | Observed mechanism | Consequence for YAIRPG |
| --- | --- | --- |
| [transition.ts20–69](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/packages/core/src/transition.ts#L20) | `transition` and `initialTransition` collect executable actions through an inert scope and return the next snapshot/action tuple | A proposed pure adapter can map only declared actions to stable host command IDs. User-supplied guards/context code still must be pure; this API is not an arbitrary-code sandbox. |
| [createActor.ts61–69,265–304](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/packages/core/src/createActor.ts#L61) | Live actors default to host `setTimeout`; state restoration delegates to logic; deferred effects execute during actor update | Starting a live actor introduces execution and timer ownership that the pure proposal route does not need. |
| [system.ts108–135](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/packages/core/src/system.ts#L108) | Scheduler records wall-clock start time, uses a random default event ID and calls the configured clock | Passing a simulated clock alone does not establish equivalence to YAIRPG's played-time/RNG/receipt policy. Omit delayed/spawned/invoked work in the trial. |
| [State.ts420–483](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/packages/core/src/State.ts#L420) | Persistence projects snapshot/context/history and recursively persists children; development guards inline child logic | Ordinary JSON serialization of a live snapshot is not the full durable contract. A dedicated versioned plain cursor is a smaller proposed boundary. |
| [StateMachine.ts493–511,566–626](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/packages/core/src/StateMachine.ts#L493) | Restores referenced child logic and starts active children; unresolved child logic is skipped | A restored actor tree needs retained logic/version validation and external-operation receipts. It cannot replace the game's registry/save compatibility policy. |

License: [MIT](https://github.com/statelyai/xstate/blob/fbee62e7c1586315ed478c2fedf530d7e0ff5a3e/LICENSE). Any copied code or bundled runtime retains its notice. No copied code is included in the project.

## Fit and cost

Current `src/simulation.js:448–485` already schedules legal prioritized NPC actions and pauses unfunded routines. `inspectActorChoices`/`acceptActorProposal` at552–566 expose stable commands and reject authoritative effects from proposals. `src/feature_expansion_work_plan.js` already owns finite saved itineraries, accepted jobs, waits and stop reasons. A statechart must improve a named branching goal authoring problem; renaming these services would add maintenance without gameplay.

An isolated trial needs one authored machine, a strictly observer-limited input, a pure command-ID mapper, current sequence acceptance, and a versioned cursor staged with the accepted host plan. Failed host acceptance must retain the old cursor. Consumed host completion/cancellation receipts drive later transitions. Use no library timer, inventory, RNG, social graph, live invoke or separate save writer. Removing the trial leaves the person's ordinary host jobs and relationships intact; missing/changed machine content needs a deliberate cursor recovery rule. Integration effort is qualitatively medium because these joins remain even with the library; no time or speed estimate was measured.

## Original trial proposal

Use one existing willing resident's **prepare -> offer -> wait -> carry out -> hear result** goal with an interruption or declined offer. Every transition consumes an actual host receipt or explicitly heard account. Two paths must end in different useful work choices, while a private motive stays absent from player menus until reported. Compare author edits and review errors against the same declarative controller/content recipe. Advance only if the statechart reduces duplicated transition conditions without copying facts or creating another scheduler. Player acceptance later requires a visible offer, real paid work, a retained refusal/interruption and exact resume; those gates are not run now.

Unread: complete macrostep/statechart/guard/action implementations, model checking, Stately editor services/pricing, v6 migration, actor-tree recovery and performance. None is claimed. This is a proposed authoring experiment, not implemented gameplay.
