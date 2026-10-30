# MR4 checkpoint: P3c severity, loyalty, silence and claims

Status: **at the floor for the silence route** (keep or break a confidence), agent-verified, not human-reviewed. Severity rungs, loyalty, debt and claims are unit-proven derived reads or storage; only the silence route is shown in Chrome. Not committed by this note.

Authority: [systems design](../LEAD_LIFE_SYSTEMS_DESIGN.md) section 39, LSD408-LSD424, LSD425-LSD440; AR1-AR16, AD36/38/43/45, CLR3, LSD139. Weibao 2026-10-30: "do everything accordingly and more? dont duplicate work?"

## What was built

| Piece | Where | Default, dial, reason |
| --- | --- | --- |
| Memory schema 2 | `src/person_memory.js` | Optional `silence {asker, promised}` on a non-impression episode (tuple length 9) and a `claims` list. The lowest schema that holds the data is written, so every untouched schema-1 save stays byte-identical; schema 1 labelling a silence tuple or claims is rejected. `flagSilence`, `addClaim`, `decodeClaims` |
| Severity table `memory.severity@1` | `src/person_severity.js` | Five rungs by scaled magnitude (feeling / holder wealth x sensitivity x intent x provoked x public x friend betrayal); each rung sets band, fade multiplier, reach and goal eligibility. Last straw: current weights of minor slights sum to a serious rung and time pulls it back under. Tables carry `id@rev` so a world swaps them |
| Loyalty and debt `memory.loyalty@1` | `src/person_loyalty.js` | Per act kind, the n-th contribution counts 1/n; risk, hardship and kept confidences weigh most, a payment little; days together add slowly; cap falls with opposed goals; shown as "a guess" until a test (kept confidence or risk) is passed; betrayal removes a share. Debt is felt help less help returned, souring to resentment after `repayDays` |
| Silence verdict `memory.silence@1` | `src/person_silence.js` | Pure, keyed by holder, secret, listener and a 30-day block through `checkKey`. Factors: bond to asker, promise, bribe, loyalty, discretion (telling dial), severity rung, bond to the listener. Chance 3-97%. `silenceExplanation` returns the top reasons, never the die |
| Claims | `src/person_memory.js`, `src/person_silence.js` | A claim is `{speaker, fact, says, day}` beside the fact; `compareClaims` finds conflicts and lies. Distinct from the existing simulation `claim` effect (ownership) |
| Gossip wiring | `src/person_memory_effects.js`, `src/person_episode.js` | Flagged rows are weighed per listener; a kept secret yields to the next-strongest row; keeping writes a `kept_quiet` helped episode into the asker's memory, breaking writes a `broke_confidence` betrayal. Telling skips the person an account is about, the asker and anyone who already holds it. The deal itself (ask, promise, payment) is never retold |
| Promise route | `src/promise_content.js`, `src/promise_ui.js` | Tamsin's introduction gives the craftsman a neighbour to talk to (`familiarity` 3). The promise panel shows the craftsman's keep-quiet line with reasons and Tamsin's manner toward you |
| Village commands | `src/everyday_life.js`, one hunk in `src/simulation_effects.js` | `village.ask_quiet`, `village.ask_promise`, `village.pay_quiet` (one log) after the interruption |

## Checks

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/person_silence.test.js` | PASS 9/9: schema 1 untouched and schema 2 round trip, promise upgrade never downgrades, claims survive later writes, severity relativity and last straw, loyalty diminishing/cap/guess/betrayal, debt, verdict replay and sensitivity, gossip over 60 roots (bribe+promise keeps 42, bare ask keeps 16), lossless encode | |
| `node --test tests/person_memory*.test.js tests/person_temperament.test.js tests/promise_situation.test.js tests/everyday_life.test.js` | PASS (earlier same-day totals in the run log) | `person_memory.test.js` had one pinned shape updated: `schema: 2` is now valid, `schema: 3` still rejected |
| Chrome 1920x1080, fresh origin per run, real pointer clicks, named fixtures only for the craftsman meeting and three logs and a coin | **full** (promise + log): "About 97% likely to keep it quiet: likes you, was paid to keep quiet, gave you his word. So far he has kept it to himself." **ask only**: "About 49% ... is close to the one who would hear it" then, by day 7, "He has told someone. Tamsin: Cooler toward you after hearing that you interrupted his counting at the bench." The asker's memory holds the betrayal. **none**: told freely, same Tamsin line | Same seed in each run, so one draw per scenario; the break shown is a 49-64% outcome, not a certainty |
| Save, reload, `window.save_to_file` then `window.load_progress` (literal import) | Line and memory slice identical after reload and after import; `memoryAfterImportEqual` true; no page errors | |
| `npm test` (once, pre-commit) | 4516 pass, 11 fail, all in other sessions' dirty work: `cast_card_integration`, `cast_journeys`, `cast_topic_talk`, `cast_whole_book_scale` (2), `character_sheets`, `facts_frame` (a null district `qlabel` in the book-world district file), `lotm_cast_week`, `lotm_path_ladder`, and others in that area. `facts_frame` and `cast_journeys` rerun alone still fail the same way. No failure in person_*, promise, everyday_life or simulation tests | Not caused by these files by inspection; not proven by a clean-tree run |
| `npm run check:arch` | PASS (exit 0), no cycle edge from the new files | Count varies with other sessions' dirty files |

Evidence: `p3c_evidence/p3c-full-1920.png`, `p3c-ask-1920.png`, the harness `p3c_browser.mjs` (copied from the MR3 harness).

## Known limits and replacement points

- Lies exist as storage and compare logic (unit-proven); no player command tells one yet. Implemented, not shown in Chrome.
- Loyalty and debt are derived reads consumed by the silence verdict (loyalty) only; no screen shows them, and debt feeds no behavior yet. The severity table feeds the verdict's rung factor; revenge and goal starts (LSD415) are not built.
- A confidence broken writes the betrayal at once; the "found out" trail (LSD420) is the listener's `told` episode naming the teller. A delay or doubt dial is later work.
- Silence is flagged on the craftsman's interruption episode only; threaten, oath, witnesses and pressure (LSD418-LSD419) are not built. A rival's bribe outbidding is not built.
- Telling reaches a listener only while their derived bond to the holder stays at 1 or more, so Tamsin's `familiarity` is authored at 3.
- Draws hold for a 30-day block, so a longer wait re-weighs the choice; a 45-day Chrome run crashed the page at 90000 ticks, so only the day-1 to day-7 weighing is browser-shown.
- Machine load was high; tests ran standalone.
