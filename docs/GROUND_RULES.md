# Ground rules

One page, read before any task. Everything here restates a rule that already
exists; the code after each line is where the detail lives. Status per block:
**accepted** binds every agent, **proposed** binds once Weibao accepts it by
name (AD32). Created 2026-10-26 from
[implementation practice rounds 2-5](audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md),
which found that every rulebook was written after a noticed mistake and that
prose rules without a check recur.

## Authority (accepted)

- Weibao's words are direction; agent text is proposal until he accepts it. Never write "accepted" without his quote or an AD code. (AD32)
- Anything is possible, reasonably; things work by how they work. Constraints are a default, a dial and an in-world reason, never "never/always/only". (AD5, AD38)
- One authority per fact; truth, knowledge and display stay separate; sealed secrets stay sealed outside play. (AD6-AD8, AR3)
- Everything built is the current best, open to refactor, replacement and improvement with a reason; past code earns no weight over a better implementation. Build modular (small modules behind ports, one owner, versioned data) so parts swap cleanly; structural rounds change no gameplay; checkpoints name known limits and the expected refactor. (AD45, AR9)

## Design pre-flight, PRF1-PRF8 (proposed, [round 3](audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md#round-3-2026-10-26-design-practice-the-mistakes-agents-make-before-code))

A brief or design note can use these prompts before a lane starts. Missing information that affects correctness or scope is resolved under the underlying standing rules; a blank field does not create a new stop gate. This set remains proposed.

| Code | The brief states | Restates |
|---|---|---|
| PRF1 | **Reading.** One sentence restating the request at the level meant, and the premises it rests on (viewport, what exists, who plays). | sharpen; AD32 |
| PRF2 | **Player sentence.** What the player reads when it works, and when it cannot run. Written before the model. | UR70-UR75, PIR9 |
| PRF3 | **Ordinary route.** The simple default and one exception with its in-world reason and cost; no obligation on every world. | AD5, AD38, WPR5 |
| PRF4 | **Mechanism, means, aftermath.** How it happens, who can know or do it on both sides, what follows. Checked from the character's seat. | AD6, AD38, WGP1 |
| PRF5 | **Fit.** The register row, seam, descriptor or prior audit it extends, by name; "none found" only after the lookup. | AR14, IPC12 |
| PRF6 | **Ring.** Which of producer, consumer, failure, persistence, UI this slice covers; "full" means all five; where the live missing list lives. | WPR30 |
| PRF7 | **Screen.** For UI, the populated 1920×1080 screen in the real app and what it displaces. | AD34, UR1-UR75 |
| PRF8 | **Constraints.** Each one is Weibao's quote, an AD code, or a default with dial and reason. No agent-authored gate, milestone or absolute. | AD5, AD32 |

## Delivery floor, FLR1-FLR6 (accepted as [AD43](RULES_INDEX.md#definition-of-done-the-floor-ad43))

A runtime slice missing a line is "implemented, below floor", never "done". Content rows on a proven mechanism meet FLR2-FLR4 through the mechanism's lint and one sampled journey.

| Code | A slice is done only when | Restates |
|---|---|---|
| FLR1 | **Build.** The receipt names the bundle hash it was proven on. | IPC9, AD36 |
| FLR2 | **Route.** Reached from a fresh life by earned steps, or the fixture is named; MCP walk first, rebuilt desktop browser as UI proof. | IPC8, AR10, WPR32 |
| FLR3 | **Shown.** A description in UR70-UR75 shape, a visible cost, feedback when it cannot run. | UR70-UR75, PIR9 |
| FLR4 | **Used.** The result has an existing consumer: an edge, verb, gate or use. A renamed meter is not one. | DWF175 |
| FLR5 | **Kept.** When persistence changes: save, reload, Export, Import exercised. | AR10, WPR32 |
| FLR6 | **Labelled.** The receipt names the highest review state reached and the route kind. | WPR21, AD42 |

## Foundation, FND1-FND5 (proposed, [round 4](audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md#round-4-2026-10-26-foundation-rules-procedural-modular-and-stack))

| Code | Default with its dial | Restates |
|---|---|---|
| FND1 | **A generator ships four lines:** address shape, reader, three tests, budget. | GR1, GR11, GR12, GR16 |
| FND2 | **Every runtime receipt states its change surface:** core-owner files touched, new cycle edges (zero), registration lines paid for. | AR13 |
| FND3 | **An extraction round names the baseline number it lowers** and proves no behavior change by the same journey. | AR9, AR15 |
| FND4 | **Stack questions route to the ranked table** (TS10-TS17); reopen only with new measurement or Weibao's direction. | AD39 |
| FND5 | **The content DSL grows only by a second consumer** from a second world; otherwise add rows over existing verbs. | AR11, WA1, WA5, WA20 |

## Process (accepted)

- Commit only your own paths from a fresh HEAD; push waits for Weibao's yes; no `Co-Authored-By`. (shared worktree practice)
- Lanes run their focused test file; the committer runs the full suite once; `check:arch` and `check:rules` at the stages AD36 names. (AD36)
- Save findings in the owning doc under `docs/`, not in memory; link from the owner. (WPR27, AD35)
- Haiku for bounded reading and lookups, sonnet for synthesis and code, opus or Astra only with a stated reason and a second opinion. (AU5, WPR6)
- Report route kind, build hash and review state; "agent-verified, not human-reviewed" is a valid final state. (AD42, IPC8, IPC9)

## Complexity guardrails, CX1-CX8

Accepted 2026-10-16 as P9Z40 (Weibao: "I like these rules"), confirmed under core rules 2026-10-19; moved 2026-10-29 from the Part 9 pass, codes and wording unchanged. They limit when depth arrives, not how much depth the game may eventually have.

| Code | Guardrail | Test |
| --- | --- | --- |
| CX1 | **Depth on demand.** A place, person or system gains detail only when a player choice uses it. | Can you name the choice the new detail serves? |
| CX2 | **Connect, don't add.** A new system plugs into existing verbs, tags and owners before it adds new ones. | Does it reuse at least one existing verb and one existing consumer? |
| CX3 | **Rules over pairs.** Prefer one rule on tags over many pairwise interactions. | Would adding the tenth content item need new code? |
| CX4 | **Promote, don't pre-simulate.** Unconstrained detail can remain counts or addresses until observed (GR3, GR4). Hidden causes already consumed by an event retain their actor/resource/time/custody bindings; see [GW5](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md#gw5-causal-commitment-before-observation-2026-10-15). | Does anything tick that the player cannot affect or learn about? |
| CX5 | **Budget declared.** Each generator and simulation states entity, draw and time budgets (GR11). | Is there a number that fails a test when exceeded? |
| CX6 | **Honest coverage.** Background, inspectable and playable are distinct (P9K4). Unfinished content is not disguised as a fictional lock. | Does every travel button resolve to real play? |
| CX7 | **One slice at a time.** Finish a playable slice before widening (AGENTS.md). | Can Weibao play the last slice now? |
| CX8 | **Deferral register.** Every deferred feature records its reopen trigger. | Does each LATER item say what evidence reopens it? |
