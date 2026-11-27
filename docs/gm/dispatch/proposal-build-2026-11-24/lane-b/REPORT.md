# Lane B Gu move slots

| Preflight | Scope |
|---|---|
| Reading and authority | Second-read WA23 chapter slots, record source-stated support jobs, and derive the Q4 blocker under the [lane brief](../BRIEF_B_GU_MOVES.md). |
| Player sentence, route and mechanism | Data for an atlas reader to show a supported role and its known job. The atlas session owns display and interaction. |
| Fit and ring | Extend the WA23 slot builder and the existing Gu coverage producer. This lane covers evidence, producer and contract checks. |
| Rule codes | AD32, AD36, GKM5–GKM8 and PWC59. |
| Files | Lane B ownership in the [dispatch README](../README.md). Shared checkout, local sources. |
| Failure scenario and checks | A slot rerun could drop a review or a disputed slot could promote a move. Check the generated contract and ledger with the four brief commands. |
| Generator and source pass | Existing slot key and ledger ID. Read each chapter row through the local passage checker and stop after the 88 rows. No network or paid calls. |

## Findings and changes

- **F1** Reviewed 88 chapter slots across 29 move IDs. The local passage command exited 0 for each row. It returned the exact locator for 40 rows. For the other 48 I read the cited paragraph and surrounding context through the same reader's local paragraph cache. Results were 86 `agree`, 2 `differ`, and 0 `nothing`. The two disputed observations are the proposed core in `ri:ch1885:p86` and the earlier substitute core with no variant tag in `ri:ch1859:p55`.
- **F2** Recorded five job observations covering four distinct jobs. The two modified Familiar Face IDs share the replacement job at `ri:ch976:p62`. The other jobs are the Giant Hand mortal group laying light trails at `ri:ch782:p86`, Precaution reinforcing the warship's defense at `ri:ch1795:p61`, and the unnamed Spring Autumn Success supports eliminating activation failure at `ri:ch1679:p32`. A name or a list of roles alone supplies no job.
- **F3** Twenty recipes moved to `blocked:roles-partial`. The producer applies the state to an existing `roles-unknown` or `roles-unchecked` blocker with an agreed chapter slot. It retains the previous note as evidence. The isolated fold regenerated all of its outputs. The lane copied back `gu_moves.jsonl` after confirming the isolated baseline matched the live move ledger byte for byte.

| Ledger state | Before | After |
|---|---:|---:|
| `blocked:roles-unknown` | 651 | 640 |
| `blocked:roles-unchecked` | 63 | 54 |
| `blocked:roles-partial` | 0 | 20 |
| Other states | 64 | 64 |
| Total | 778 | 778 |

## Atlas slot contract

Read [gu_move_slots.jsonl](../../../../coverage/evidence/gu_move_slots.jsonl). The slot key is `(move, variant, role, name, locator)`. The builder joins [gu_move_slot_reviews.json](../../../../coverage/evidence/gu_move_slot_reviews.json) on that key.

| New field | Presence and meaning |
|---|---|
| `secondRead` | Required on chapter slots. `agree` confirms the observation, `differ` records a disagreement, and `nothing` means the read found no confirming statement. Wiki and community slots omit it. |
| `secondReadNote` | Required string on `differ`. Gives the reason for disagreement. |
| `job`, `jobAt` | Optional pair on support or unnamed observations. `job` is a short paraphrase of the source-stated purpose and `jobAt` is its locator. It may differ from the slot's own locator. An unnamed slot can carry a job with `gu: null`. Current job rows are agreed chapter observations. |

## Checks

All checks are agent-verified, not human-reviewed.

| Command or evidence | Result |
|---|---|
| `node --test tests/gu_move_slots.test.js` | Exit 0, 3 passed. Exercises the schema, a job on an unnamed slot, the agreed-only state gate and a stronger blocker. |
| `python3 -I scripts/gu_move_slots.py --self-test` | Exit 0, WA23 self-test passed. |
| `npm run -s check:coverage` | Exit 0, coverage rows PASS across 224 ledgers. |
| `node --test tests/gu_coverage.test.js` | Exit 0, 16 passed. |
| `python3 -I scripts/gu_move_slots.py` and `cmp` | Both exit 0. The rebuild after the ledger fold was byte-identical across 328 slots. |
| `node scripts/gu_coverage_ledgers.mjs` in isolated scratch | Exit 0 for baseline and updated runs. Compared 778 ledger rows and found the expected state and note changes and nothing else. |

Files also changed in this lane: `docs/coverage/blocked_slugs.json`, `docs/coverage/gu_moves.jsonl`, `scripts/gu_move_slots.py`, `scripts/gu_coverage_ledgers.mjs`, and `tests/gu_move_slots.test.js`.

The atlas display and coverage README are owned by the atlas session and coordinator respectively. Runtime build, browser and save checks do not apply to this data lane.
