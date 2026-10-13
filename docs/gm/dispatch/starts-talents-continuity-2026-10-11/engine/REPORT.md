# Representative engine seam review

2026-10-11. Read-only audit of candidate `/Users/weiwei/.codex/worktrees/starts-talents-continuity/yet-another-idle-rpg`, after the frozen donor base recorded in `../CANDIDATE_BASE.json`. No runtime edits, test execution, build or browser acceptance performed by this worker. Private p06 content not inspected in this first pass. Findings below are generic machinery only.

## First-slice joins

- **F1, timer bootstrap required.** `src/structured_pack_runtime.js:52` manually provisions declared people and applies beginning effects. It does not create checks for declared simulation events or enroll declared controllers. Merely adding either definition leaves it inert. `src/simulation_effects.js` supports an explicit `type:event` beginning effect to create a durable seeded check. The selected slice must use that join. Authored controllers require a separate actual enrollment mechanism; direct beginning people do not take the spawn path that enrolls controllers.
- **F2, open decisions lack a reachable panel.** `structuredCampaignView` and `createStructuredPackPanel` project actions/jobs/status, with no event response. Generic `simulation_panel` is hidden outside Village/Shack. A discovered player decision can stop the common clock, so a structured local decision risks an inaccessible pause. Ambient events with immediate structured commands provide a bounded existing route; an open decision requires an explicit new UI/host join.
- **F3, expiry is not a causal gate.** Event `requires` is checked at occurrence; response `requires` is checked at response. Saved `onExpire` executes unconditionally. Effect `when` is not interpreted by `prepareSimulationEffects` or `applySimulationEffects`, despite arbitrary JSON fields being accepted in some validators. Never use that field to promise conditional effects. Use an ambient occurrence whose current `requires` includes its real necessary participants/means. If the situation is already open, re-evaluate prerequisites through a supported later check, rather than forcing a frozen expiry outcome.

## Existing useful machinery

**E1:** Typed selection is a separate durable pending receipt. Initialization requires its exact pack revision/hash/start/body snapshot and preserves the selection on failure. Host saves selection before publishing the beginning, and `persistExpansionPlan` writes the staged envelope before returning it to the host. `tests/structured_origins.test.js` covers equal seed ranges, write refusal/retry, content/tampering rejection and legacy bootstrap. This is inspected test coverage, not a passing test claim.

**E2:** Faculty lifecycle is an actual consumer gate. Capability queries omit dormant/inactive/suppressed/expired faculties; simulation facts expose actual faculty active/development values. A faculty effect alone is insufficient evidence: compare the specific consumer quote/output with and without the live faculty, using the same ordinary resources and world state.

**E3:** Structured people and status use the player's held introduction/status knowledge keys. Command previews evaluate actual means, and costs project only acting-player inputs. A p06 event should grant only its intended observer knowledge. Controller and command knowledge conditions must use that actor's own knowledge, not player's knowledge or public source expectation.

## Finite acceptance recommendations

| ID | Required observation |
|---|---|
| T1 | Two generated seed ranges produce distinct usable starts; inspect body/origin/resource differences and executable first actions, not metadata alone. |
| T2 | Save pending selection, refuse initialization publication, retry/reload/import without changed choice or duplicated stock/actors/source; old legacy state remains unchanged. |
| T3 | Faculty changes a real consumer; suppression/removal denies that contribution while an ordinary alternate remains executable where authored. |
| T4 | Same initial seed: abstention and fitting intervention produce different causal aftermath. Remove each necessary means before settlement and verify the former outcome does not occur. Explicit event bootstrap actually reaches its first check. |
| T5 | Fresh native origin: selected routes, ordinary preparation and continuing aftermath are visibly usable. Save/reload/import preserves the aftermath. No unseen NPC build, source truth, alternate start or reroll truth appears in observer text. |

p06-specific final inspection remains open until its builder release. Build, fresh-browser journeys and director acceptance remain with the integrator. No whole-world or universal engine completeness claim.

## Draft p06 review, builder not yet released

**P06-R1:** Draft resolves F1-F3 through explicit beginning checks for the actual NPC, ambient occurrences without unreachable decisions, and mutually exclusive live resource/knowledge/custody predicates plus one shared closure fact. The deadline is a delayed actor-local check rather than an unconditional expiry effect. Dead actors are excluded by the existing scheduler; each actual input quantity is required before consuming it. Final released source/test inspection remains pending.

**P06-R2:** The faculty has an actual native inventory consumer. `structured_container_runtime` checks the installed source, expiry, awakened/active/suppressed lifecycle and actual body before access; its output policy also reads development. This draft is not merely a displayed talent label. No build/browser proof claimed here.

**P06-F1:** One draft introduction command writes a fixed present NPC-stock assertion despite being reachable after stock changes. Integrator notified privately by opaque command ID. Fix by removing that assertion or binding the utterance to actual stock. No source truth recorded here.

## Released p06 final static review

Reviewed released private pack, receipt, author report, executable content-test source and route manifest. Pack SHA-256: `90b78093982618d40854390f32ce0a8454c21fea95e7f3fc231b1c2478cefb97`, matching the private input receipt. Builder TEST.log records eight passed actual-content checks; this reviewer inspected that evidence but did not rerun it. No blocking source/content defect found in selected causal/consumer joins.

- **P06-R3:** F1-F3 are addressed in the selected content: explicit actor-local ambient bootstrap; actual life/location/world/knowledge and finite input prerequisites at occurrence; mutually exclusive aftermath and durable closure preventing double settlement. Current NPC input loss does not force a former expected outcome. Required exact custody and title are checked/settled through existing effects. Numeric input checks precede finite consumption; there is no unsupported conditional-effect field.
- **P06-R4:** Native faculty access has an actual ownership/body/source/lifecycle/reserve consumer. Ordinary preparation uses timed native work; affected jobs retain live completion support and refund policy rather than awarding output after support is lost. Actor knowledge comes from authored prior instruction or actual local communication/delivery. Hidden faculty use does not disclose its build to the NPC. P06-F1 is corrected in released content.
- **P06-R5:** Test evidence is narrower than a native reload/import or publication rollback proof. The private restore helper validates the serialized envelope and reloads expansion while retaining its original in-memory gameplay/ownership. Its write-refusal case preserves original serialized bytes but does not exercise main.js publication rollback. Root's fresh native reload/import and refusal journeys own those claims. Suppression/removal of the faculty and mid-job completion-support loss are source-supported but not directly exercised by those eight cases.

**P06-F2, minor presentation gap:** One player-facing cancellation statement mentions a return action absent from the released action list. Integrator notified privately; remove the promise or retain its actual return route as an explicit unimplemented gate. This does not block the selected connected journey.

Final status: static reviewed, selected consumer/causal joins found sound; builder content-test log inspected; native build/browser acceptance and director acceptance remain separate integrator gates. No runtime writes, public source truths or personal-save access by this reviewer.

Integrator correction after review: removed the unavailable assignment-return sentence from P06 knowledge text and its private generator. The existing supported job cancellation explanation remains. No new action was invented. Final content hash and rebuild are in ../VERIFICATION.json; private content checks rerun, native proofs target that revision.
