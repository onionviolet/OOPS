# LP1 lever-setting lesson

The player frees supplied wedged timber into a survey kit, sees the craftsman demonstrate a pivot, explains the rule, then spends three played minutes, one coin and one stamina on supervised practice. The same timber task gains a two-minute, one-stamina solution using a spare log as a lever. The lever returns; one material log becomes one kit. Routine uses can queue while idle.

2026-10-14. **Authorized, reversible PROPOSAL.** Original Village content extending [P1](../hogwarts-games/IMPLEMENTATION_PACKETS.md#p1-a-lesson-changes-a-known-field-task) and [LP1](IMPLEMENTATION_PACKETS.md). No canon spell, borrowed game text, new world or prestige layer. Taste and balance are unaccepted.

## Try it

- P1: In Village, meet the old craftsman through the existing elder/field-clear route. His ordinary gathering instruction supplies tools. Equip the Old axe and use Local actions → Gather resources → Gather wood on the outskirts to carry logs.
- P2: Open Notes, practice & people → Here → Field association & workshop. Choose **Ask about a shared field workshop**, then expand **Wedged timber & lever lesson · PROPOSAL**. Association membership and the assembled workshop are not prerequisites.
- P3: Try **Free wedged timber by hand** with one log. Replenish logs, choose **Ask the craftsman to demonstrate lever-setting**, explain the displayed pivot rule, then choose **Practice lever-setting with the craftsman**. Instruction needs his living presence, willingness, teaching hours and reserved attention. Practice is an untimed choice followed by three played minutes.
- P4: Carry two logs and choose **Free wedged timber with lever-setting**. One log is material; the other is the actual held tool and returns. **Queue 3 lever jobs** requests a finite routine; it pauses if fresh support or inputs run out. Uses and later queues repeat without a lifetime limit. Missing learning, a spare lever or usable hands have concrete reasons. Existing Practice → Body & recovery → Rest your hands treats soreness.

Target: **1366 × 768 desktop**, also 1440 × 900. The existing notebook separates task/lesson controls from stock and vitals. Its reading region scrolls. Mobile optimization, school calendars and other packets are deferred.

## Files

| File | Change |
|---|---|
| `src/lever_lesson.js` | Original staged lesson, known task alternatives, real log reservation/return, body/tool projections and specific missing-condition messages. |
| `src/field_workshop.js` | Compose the lesson into the existing field family. |
| `src/simulation_content.js` | Register the lesson's existing-format situation context. |
| `src/simulation_effects.js` | Join current support facts into ordinary simulation checks. |
| `src/field_ui.js` | Lesson/task group, saved teacher/time record and finite idle queue controls/status. |
| `tests/lever_lesson.test.js` | Five focused contract tests. |
| `lp1-evidence/` | Desktop screenshots, verification results and reproducible browser harness. Disposable exports stay ignored. |

Existing simulation knowledge provenance and power learning handle instruction. The enemy-observation technique handler is unchanged. The scheduler, publisher and save envelope own spending, attention, jobs and persistence; no second teaching or queue engine was added.

## Checks

- V1: `npm run build` passed, including the existing Ink check. Tested/served bundle SHA-256: `b52590edc6fd377de42bf9b6e3426ba323c6dc8db6b7d484d262a730cd05c78f`. HTTP 200 bytes matched the local rebuilt bundle.
- V2: `node --test tests/lever_lesson.test.js tests/field_workshop.test.js`: **18/18 passed**, including **5/5 LP1** checks. Costs, teacher/contact refusal, unsupported body/tool, lost-support refunds, cancellation, pending/final reload, idle depletion and absent optional state were exercised.
- V3: Final `npm test`: **1,399 tests, 1,396 passes, zero failures, three TODOs**, 597353.247 ms. No pre-existing failures. Existing TODOs concern legacy native combat RNG, local-life search/contact RNG, and encounter/loot/craft/market/gather RNG.
- V4: **12 browser groups passed**, with zero page errors and nine screenshots at 1366 × 768 and 1440 × 900. Native hand work spent three stamina and six played minutes for one kit. Paid lesson acquisition, the two-minute faster result, missing-tool refusal, sore-hands refusal with three logs present, recovery and two queued repeats were exercised. Pending practice Save/reload/Export/literal Import retained the exact job. Learned and queued literal Imports preserved knowledge/program state without another lesson or duplicate kit. See [results](lp1-evidence/results.json) and [desktop evidence](lp1-evidence/06-body-unfit.png). Source commit: `2be92fb7`. No push or merge.

The browser uses a fresh isolated origin with the repository's disposable `craft_ready.save.txt`. The craftsman, gathering access and initial two logs are controlled prerequisites. All LP1 lesson state and task results are earned through UI actions; one additional log for the before/after task was gathered normally. The separate body/idle control copies the earned lesson export and sets carried log stock to three. Its paid grip drill, recovery and queued consumption/results are native UI play. It makes no natural acquisition claim for those three control logs. This does not prove a fresh new-game-to-craftsman journey. Real Export and literal file-input Import use the native loader and preflight. Natural stamina recovery required a same-click save snapshot to verify the initial debit. Notebook tab targeting, navigation waits and same-handler save capture were corrected in the harness; no production repair was needed for those harness failures. Slow normal gathering and a save-click timeout under concurrent load led to the disclosed stock control. Disposable logs and exports are kept in ignored local evidence, not published as player saves.

## Compatibility decision

Use optional records in the existing simulation owners: situation, attributed knowledge, power, completion, frozen job and routine program. No required top-level field or new save format is introduced. Old saves receive no lesson, power, provenance, reward or pending practice merely by loading. The new scene begins only after the explicit demonstration.

Pending practice freezes its three-minute duration, costs, effects, participants and completion support. Completion checks current body, teacher contact/willingness and the explained rule. Cancellation or lost support refunds and teaches nothing. Tool use holds two real logs outside available stock; its frozen return restores one conserved lever. Completion rechecks body, location and learning. Reload/import preserves committed state instead of spending again or replaying settlement.

## Limits and merge review

- L1: Zero-hand/immobile forms and teacher refusal/lost-contact variants are **implemented-unverified in a native browser**, with controlled source coverage. Real browser zoom was not exercised; mobile optimization is deferred. No offline-progress claim is made.
- L2: The existing elder/combat introduction was not replayed end to end; the native slice begins from the disclosed disposable fixture.
- M1: Reviewed `codex/gameplay-foundations` HEAD `78e3c70afcf20af93d215dd69892c80b8b21866f`. None of LP1’s four existing integration files changed there since base `8856718d`; no current overlap was found. Parallel branches may later touch the shared simulation registration/fact joins or field panel. Rebuild after integration; derived `dist/` and cache-bust `index.html` changes are local proof outputs and excluded from these commits.
- M2: The new kit route changes the Village supply economy. Its authored costs, mundane method, wording and placement are proposals for director play, not accepted balance or Hogwarts-world behavior.

The required technical gates passed. The one remaining authoritative acceptance gate is **Weibao's play and taste**. The own-worktree server on http://127.0.0.1:8197/ serves the tested rebuilt proposal; rebuild with `npm run build` when integrating the source commits.
