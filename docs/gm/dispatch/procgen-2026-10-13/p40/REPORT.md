# P40: determinism and subtle hazard audit

2026-10-14. **DOCS / PROPOSALS COMPLETE.** No gameplay implemented or changed. All P40 writes are under this folder; no runtime/worktree edits, builds, commits, browser play, private saves or publication. Root owns adoption. [CHECKPOINT](CHECKPOINT.md) is the resume surface.

F04: Locale collation feeds live storylet draws and controller ordering. F09: P2's UI-driven repeat adapter produces one batch after a clock jump to minute 9, versus three at boundaries 3/6/9. F11: P34's history-helper probe can evict a receipt still referenced by a terminal event, then reject its next plan; the ordinary traveler route's request pins mean natural reachability remains unproven. These are the strongest direct signals. The [full findings](FINDINGS.md) also distinguish raw UI projection risks, JSON collection admission, float weights, intentional clock/rewind policies, newer-build message ordering, grammar and long/CJK layout gaps.

## Deliverables and scope

| Artifact | Contents |
|---|---|
| [FINDINGS](FINDINGS.md) | 19 findings/control records from full-tree lexical scans and focused seam inspection, covering every BL1–BL12 hazard, file:line, evidence label, severity, save impact, fix and branch distinctions |
| [LINT_RULES](LINT_RULES.md) + [standalone script](proposed/determinism_lint.mjs) | Concrete contracts; read-only lexical review queue; specifications clearly separated from implemented detectors; no package.json wiring |
| [TEST_CASES](TEST_CASES.md) | 21 future headless cases mapped to findings and P18, plus distinct rebuilt desktop/native/persistence gates |
| [MORE](MORE.md) | 17 concrete engineering extensions using root crafting/BL code suffixes, cross-linked to crafting P26–P29, P6/P8/P11/P5 and P18/P38/P39 |
| [SOURCE_SNAPSHOT](SOURCE_SNAPSHOT.json), [SOURCE_REFRESH](SOURCE_REFRESH.json) | Read source hashes and branch tips across main/P1/P2/P3/P4/P34, including concurrent drift |
| [PROBE_RESULTS](PROBE_RESULTS.json) + [probe script](proposed/audit_probes.mjs) | Eight synthetic source observations, no personal data or raw generated secrets |
| [LINT_SCAN](LINT_SCAN.json), [LINT_REFRESH](LINT_REFRESH.json), [DOC_CHECKS](DOC_CHECKS.json) | Advisory source inventory plus document/link/locator and script checks |

C1: Main already merged P1–P4 at the first source snapshot (`4e13f97f`), contradicting the prompt's dated “P2 unmerged” description. It later advanced to `f16bd67c` while P34 advanced from `6af99aec` to `364d8300`. Relevant changed code was reread; P34 retention/delta probes were repeated and still reproduced. New main start/anchor helpers were scanned and their numeric/hash/raw-preview seams added to F07/F08/F12/F15. Root must bind any implementation to its actual latest bytes.

C2: Crafting P26–P29 labels collide with story lanes. [MORE's owner table](MORE.md#join-the-existing-owners) links the explicit crafting drafts, without treating unrelated story reports as consumable/crafting implementation.

C3: Existing safeguards matter. Newer numeric save versions already reject before import writes. Native craft includes saved streams in failure rollback. Scenario rewind intentionally retains random history. Normal JSON roundtrips are not demonstrated to scramble all Map-like records. P2 retains consumed product definitions. P34 has known-outcome projection and history validation; its concrete eviction policy is inconsistent with that validator. Do not replace those controls with blanket rules.

## Five ranked fixes for root consideration

Recommendations and future proof obligations only. They do not become accepted scope or retroactive gates for previously delivered claims. All reasonable further systems remain available. No global once limits, hunger death, mandatory risk rolls or mobile work are introduced.

| Rank / recommendation | Change and result | Ownership / compatibility | Future acceptance gate |
|---|---|---|---|
| 1 / R1 | **P34 reference-aware eviction**, F11, followed by explicit target binding F06. Keep terminal event links valid and stop deriving receipt identity from first inventory delta. | P34 history/request owner, with P38 typed references. Root coordinate the active branch; P40 edits none of it. Pin/archive/tombstone semantics retained across import. | T06/T13/T14: 97th receipt with terminal/open refs, multi-target deltas, pending request/callback/recap import. Failed plan cannot publish partially pruned history. A long run still reaches new lawful events after compaction. |
| 2 / R2 | **Scheduler-owned mixture repeats**, F09. Same eligible played time gives the same batches independent of polling and UI visibility. | P2/main native clock owner + P28 automation. Preserve paused/non-Village eligibility, frozen held stock, latest-dose replacement and old product IDs. Offline advancement is a separate selected policy. | T10/T11: small ticks vs drained jumps, UI unmounted, shortage/cancel at due, Save/reload and literal-file Import pending and settled. Rebuilt 1366x768 and 1600x1000 paid mixing → queue → useful product use. |
| 3 / R3 | **Versioned deterministic order/draw inputs**, F04/F07/F08/F15/F16. Replace causal locale sorts, explicit controller IDs, fixed numeric weight mapping and validated machine-ID encoding/range domain. | P1/P3/P4/P34 shared resolution owner; preserve old stream/hash/deck interpretation and generated truths. Display locale remains available. New start helpers need the same declared contracts. | T04/T07–T09/T19–T20: permutations/locales, exact threshold vectors, multiple engines, unrelated stream isolation, legacy retained truth and next draw unchanged. No silent distribution migration. |
| 4 / R4 | **Known-only render frames and opaque handles**, F12. Raw truth, missing-audience logs and composition-bearing DOM keys do not reach ordinary player surfaces. | P11 context/P34 view/P2 UI and host bridges, with P26–P29 consumers. Keep allowed discovery and explicit developer sandbox separate. Never change truth to hide it. | T15/T18: two unknown synthetic truths give identical public surfaces; scoped discovery changes only permitted fields. Scan all DOM metadata/hover/reasons/recaps and full-name focus. Rebuilt laptop/wider-desktop proof, no actual sealed values in reports. |
| 5 / R5 | **Strict JSON admission and clear future-save rejection**, F05/F13/F19. Reject unsupported runtime collection instances, give newer-build guidance first, keep exact canonical product restoration. | Save/simulation validation owner, root adoption of proposed lint as an advisory command. Avoid wholesale key normalization or new mandatory content schema. | T05/T16/T21: invalid collection/future version/schema invokes zero writes; old absent-owner and canonical literal import unchanged; storage faults preserve all owners/cursors. Lint fixture checks pass and candidates are reviewed rather than blindly suppressed. |

Grammar F17 and desktop long/CJK layout F18 remain concrete follow-on presentation work with T17/T18. Combat chronology/export/recorded-absence F03 requires its clock policy owner before a mechanical change; seeded outcomes alone do not establish full timing replay. F02's helper defaults remain a bypass risk rather than evidence that native main combat/crafting currently ignores P1. These options remain reachable; ranking does not remove them.

## Checks actually run

V1 SOURCE_SYNTHETIC: Eight read-only probes reproduced: astral hash collision, P2 late-vs-boundary batch count, P34 terminal-reference eviction rejection, insertion-order-dependent first item delta, masked newer-build message, unsafe-width integer admission, Map/Set JSON-validator acceptance, and locale-sensitive legal ASCII ordering. Eight assertions passed with zero assertion failures. This means the observed hazards/control behavior reproduced, **not** that fixes pass. Relevant probes were rerun after source drift; counts are not added together.

V2 LINT SCRIPT: 17 in-memory scanner fixture checks passed. Initial scans covered main and P1/P2/P3/P4/P34 with zero lexical errors. Refreshed main scanned 473 JS/MJS/CJS files and emitted 590 advisory review positions; refreshed P34 scanned 469 and emitted 581, zero lexical errors. Counts include scratch collections, benign sorts and duplicates across branches. They are not defect counts. Script catches only its documented lexical subset.

V3 DOCS: [DOC_CHECKS](DOC_CHECKS.json) records checked local links, existing file:line ranges and source/script hashes. Checks validate the packet, not canon accuracy or gameplay. Canon-specific design is cross-linked to its owners; no new canon assertions, book acquisition, private-note quotations or raw source prose were added.

No npm gameplay suite, build, browser, installed/runtime, persistence-file journey or director acceptance was run here. Remaining implementation/native gates are open exactly as mapped above. Everything in this packet is a proposal; no runtime change is implied by saving the audit.
