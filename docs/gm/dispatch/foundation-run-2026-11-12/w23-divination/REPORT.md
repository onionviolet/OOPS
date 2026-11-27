# W23-D divination law report

Status: proposal (AD32), engine tested, agent-verified, below the PWC60 ledger take floor. No ledger was written, no consumer was edited, and no player route or browser proof is claimed.

## Census and design

There are 567 `blocked:divination` rows in 91 ledgers. The exact `Effect verb.object/target/time` sentence parser finds 522 labels, 38 distinct verb.object pairs, seven target values (`area`, `bound`, `line`, `marked`, `none`, `self`, `touched`) and six time values (`delayed`, `instant`, `lasting`, `none`, `sustained`, `triggered`). The wave brief said 535 labelled rows; 13 do not match the exact sentence parser, so this report uses the reproducible 522 count. `sense.information` is the largest coherent pair, 386 rows. Other pairs include sensing a mind, position, essence and memory, and concealing or blocking information. Those have different truth sources or counterplay and stay blocked. A later split could use `divination-mind`, `divination-location`, `divination-detection-counter` and `divination-forecast`; no slug was changed.

The law reads a target's named property at settlement, pays the declared cost through the engine cost path, and publishes an `effect.add.information` record to `n.knowledge`. The observer receives a believed value and an observation source; the truth pointer remains on the record's private side. If the property has no signal, the working pays and returns `unanswered` without a record. `supported` and `uncertain` are stated reliability values; uncertain records carry a doubt. The law never manufactures a future or a hidden answer. Its case uses a working, a save/restore step and a knowledge expectation. The case runner cannot yet bind a `divination` working family, so it correctly reports `blocked:runner-working-case`.

Fields that change play: the sentence, the subject/property being read, reliability, time and cost. Target shape changes how a consumer selects and reaches a subject; this first case binds one named subject, and a world must supply any remote reach or area selection. The property is world data, never a universal divination truth. Dials: one minute, one `energy:spirituality` unit, `reading_signal` and `supported` are design defaults chosen for the first LOTM consumer; a world overrides each. Rejected designs: (1) a generic success roll would create unsupported answers and hide source grounding; (2) writing a plain label/property instead of an N record would bypass the knowledge owner; (3) making every `sense.*` row this law would claim mind reading, tracking and elemental sensing without their mechanisms. These are working defaults under AD56, not accepted rules.

## Dry run and gap

`node scripts/divination_ledgers.mjs` wrote nothing: 567 rows, 522 exact labels, 339 eligible sentence shapes, 23 distinct candidate cases. **Actual take: 0/567 (0%); held-out fifth: 0/131 (0%).** Both miss the 25% floor. Of held-out rows, 76 have an eligible sentence, but they are not taken. Top blocked reasons: missing runner working family 339; another sentence 136; no sentence 45; unsupported target shape 37; unsupported time shape 10. The latter two are mainly labels with `none`; no target or time is inferred from that word.

The exact shared-file change needed is a `divination` entry in `WORKING_FAMILIES` of `scripts/case_runner.mjs` that imports `DIVINATION_LAW` from `src/divination_law.js` and returns `{law: DIVINATION_LAW, method: w.method, bindings: w.bindings}`. Then rerun this dry run and its cases, review the 25% floor and only then attach ledger cases. The coordinator owns that shared file and all ledger writes. The script's `--write` option refuses while the adapter is absent.

## First consumer and checks

Klein's readings are the first consumer. `src/book_world_lotm_div_supply.js:lotmDivinationFacts` supplies whether he holds the means; `src/cast_divination_adapter.js:defineDivinations` is the later tie-in for the attempt and interpretation steps, with `quoteDivinations` exposing duration, price, eligibility and a result only after settlement. The player would see an action row with minutes and Spirituality beside the button, a blocked reason if the means or grounding is missing, then a result line with signal, `supported`/`uncertain`/`unanswered` reliability and the recorded cost. The existing chapter 82 engine route in `src/world_packs/lotm_bogda_consultation.js` is a closer proof pattern, but was outside this lane's write list and was not changed.

Owned files: `src/divination_law.js`, `tests/divination_law.test.js`, `scripts/divination_ledgers.mjs`, this report.

| Command | Result |
| --- | --- |
| `node --test tests/divination_law.test.js` | Exit 0; 3 pass. Direct engine working, cost, reliability, unanswered result and save/restore pass. Runner case is correctly blocked pending its adapter. |
| `node --test tests/case_runner*.test.js tests/*_law.test.js` | Exit 0; 92 pass. |
| `npm run -s check:arch` | Exit 0; grandfathered main imports/cyclic edges reported. |
| `npm run -s check:rules` | Exit 1; two new raw duration strings in another lane's `src/world_packs/book_gu_keeper_lotus_route.js` lines 58–59. No finding in owned files. |
| `npm run -s check:docs` | Exit 0; no new doc slip hits. |
| `node scripts/divination_ledgers.mjs` | Exit 0; read-only output above. |

No full build or browser proof: this is an engine-first law and has no played tie-in. Unrelated dirty checkout work remains with its owners. No commit or push was attempted.
