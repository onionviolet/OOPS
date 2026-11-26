# Local cast topic projection: absent sleep conditions

| Preflight | Scope |
| --- | --- |
| Request | Diagnose the whole-book scale failure for local and known-away topic offers; preserve existing journey, pending-action and known-person selection. |
| Authority and seam | AR2–AR7, AD36. Read the existing optional Slumber condition at its reader in `src/lotm_silver_charms.js`; no change to cast selection, schedules, actor provisioning or save ownership. Exact one-line ownership coordinated with `atlas_passes`. |
| Failure | `node --test tests/cast_whole_book_scale.test.js` reproduced 4 pass / 1 fail: local Vela topic quoting dereferenced `simulation.conditions[person]` when the sparse projection fixture omitted the table. Away quoting did not enter that reader. The condition catalogue already declares absence as zero. |
| Correction | Optional access to `simulation` and `conditions` treats the absent condition as inactive. The projection remains read-only, and existing active/expired condition comparison is unchanged. |
| Regression | Existing local/known-away/pending test now covers absent-table local eligibility, no table provisioning, active local sleep, away reason without exposing unseen sleep, expiry, and unknown-person filtering. A separate absence-zero test covers missing simulation, missing/empty table and another person's condition. |

## Verification

| Command | Result and limits |
| --- | --- |
| `node --test tests/cast_whole_book_scale.test.js` | 6 passed, exit 0 after correction. |
| `node --test tests/lotm_charm_upkeep.test.js` | 5 passed, exit 0. |
| `node --test tests/cast_whole_book_scale.test.js tests/lotm_charm_upkeep.test.js` | Final combined check: 11 passed, exit 0, 1.44 seconds test duration. |
| `node --test tests/cast_whole_book_scale.test.js tests/cast_topic_talk.test.js tests/lotm_charm_upkeep.test.js` | Broader exploratory run printed 9 passing topic cases and later exited before a process cleanup attempt; its final summary was not captured, so it is not counted as completion evidence. |
| `git diff --check` | Passed; existing unrelated line-ending warnings remain. |

This is a focused regression repair, agent-verified and not human-reviewed. It adds no player wording, new gameplay route, persistence shape or canon claim. No new browser behavior is claimed. Rebuilt packaging and the wave's full completion gate remain with the parent integration owner. No scratch files, builds or background processes were retained for this repair; no commit, push or paid call was made.
