# Lane C · Composed investigation (B5 / HW3)

| Preflight | Scope |
|---|---|
| Reading | One headless Gu working combines sight and spirit into a broad sweep or one stronger probe. |
| Authority | “Start all of them up till Q5,” as recorded in the [vision log](../../../USER_VISION_LOG_2026-11.md#proposal-reconciliation-q1q4-answered-b1b5-started-2026-11-24). Q3 authorizes an engine-only wave. GKM5–GKM8 and GKM340–GKM343 guide this proposal under AD32. |
| Player sentence | A future action can show which channels made contact and where. An empty reading means no contact on this cast. A failed cast reports recoil. |
| Ordinary route | Sweep the approaches first. Probe one nearby subject for a closer reading. Both modes use the same essence charge. |
| Mechanism | Sight and spirit are separate roles. Bodies and their concealment are read at settlement. The observer receives the readings the channels resolve and nothing more. |
| Fit | The kernel working and engine records own settlement. `detectGuApproach` owns the channel check. |
| Ring | Engine producer, observed receipt, and failure. Fang Yuan’s future scouting route is the first consumer. |
| Rule codes | AD32, AD36, AD38, AD43, SKR1, SKR21, GKM5–GKM8, GKM340–GKM343, OR1, Q3. |
| Files | New case, new focused tests and this report. Other lanes own the shared checkout paths listed in the dispatch README. |
| Failure scenario and checks | Support moves before settlement. The attempt pays once, recoils on the core, and yields no contacts. |

## Receipt

**Engine-only under Q3. Agent-verified, not human-reviewed.** New capability: one paid working uses two live investigation Gu. Sweep reports coarse place/channel contacts out to range 4. Probe reads a single subject within range 1 and penetrates a spirit veil the sweep cannot read. A physical sight screen still blocks sight. A lost support consumes the same three essence, recoils on the core and returns no partial reading. This is an authored held-out capability check. Canon holdout scoring was outside this wave.

The local English *Reverend Insanity* EPUB anchors complementary scouting at ch. 714 p12 and limited evidence at ch. 138 p57. The latter shows Earth Communication Ear Grass hearing footsteps without establishing a person's identity. The local checks found Investigation Courtyard as a Gu House that activates an unnamed investigative move (ch. 1566 p72), and Micro Sense named without its recipe (ch. 698 p34). Neither passage supplies the two-mode recipe. Its sight and spirit Gu roles, ranks, quantities, geometry and recoil calibration are authored.

| Receipt | Evidence |
|---|---|
| FLR1 Build | Gap. No rebuilt app bundle for this engine-only lane. |
| FLR2 Route | The `combined-investigation` engine fixture exercises a clear subject, a veiled subject, a distant subject and a subject beyond sweep range. Player route pending. |
| FLR3 Shown | Engine receipts expose mode, outcome and contacts. A probe can report a channel cue. No game UI. |
| FLR4 Used | First future consumer is Fang Yuan's Gu scouting before approaching a rival or patrolling the wolf front. The current case binds an explicit field of subjects. World discovery and player targeting belong to tie-in. |
| FLR5 Kept | JSON round-trip while the probe is pending matches continuous settlement. Uses the existing engine working record and adds no save schema. No player export/import exercised. |
| FLR6 Labelled | Authored engine fixture, agent-verified, not human-reviewed. Runtime delivery remains below the playable floor. |
| Change surface | New case module and focused tests. No change to `src/gu_senses.js`; the case calls its existing `detectGuApproach`. No cycle or app registration lines. |

### Checks

| Command | Exit | Result |
|---|---:|---|
| `node --test tests/gu_investigation_cases.test.js` | 0 | 4 passed. |
| `node --test tests/gu_*.test.js` | 0 | 514 passed in the shared checkout. |
| `npm run -s check:arch` | 0 | Passed. |
| `npm run -s check:rules` | 0 | Passed with warnings outside lane C, including direction-log sync and a stale rule glob. |
| `python3 -I scripts/check_passage.py --name "<candidate>"` | 0 | Investigation Courtyard, Micro Sense and Earth Communication Ear Grass gave the passage receipts above. |
| `runCase` on the proposed row in the checkout | 0 | Returned `blocked:runner-working-case` because the shared conveyor has no registered `gu-investigation` family. The process printed the result and exited normally. |
| `runCase` with the proposed adapter in a temporary in-memory copy of the runner | 0 | Returned `expressed-authored`. The full timeline passed through the regular conveyor with that adapter. |

### Coordinator handoff

The shared conveyor dispatches workings from a fixed family table. Its file is outside the assigned ownership. The adapter verified in memory is one entry in `WORKING_FAMILIES` in `scripts/case_runner.mjs`.

```js
    'gu-investigation': async w => (await import('../src/world_packs/gu_investigation_cases.js')).investigationWorking(w),
```

After that entry lands and the checkout's `runCase` returns `expressed-authored`, the proposed new ledger row is below. Keep the Investigation Courtyard lead on its own source evidence.

```json
{"id":"combined-investigation","source":"Reverend Insanity (local English EPUB), ch714 p12 and ch138 p57; authored HW3","state":"expressed-authored","mechanisms":["G","K","W","L"],"test":"tests/gu_investigation_cases.test.js","note":"Authored sight and spirit recipe with a paid wide sweep, a focused probe and failed-support recoil. Local canon anchors complementary scouting and limited evidence.","case":{"module":"src/world_packs/gu_investigation_cases.js","id":"combined-investigation"}}
```
