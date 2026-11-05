# Foundation slice: retained place identity

```receipt
build: 172c917077d1628d9b56ac8ff9f2c7b316e23a0e543ee5b447eb75783f2de927
route: fixture(synthetic-conversation-knowledge-delayed-source)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 17 focused checks and 24 joined browser assertions pass
review: diff-scoped
surface: restored native place identity and existing conversation/Notebook task
```

Status: integrated in primary and agent-verified, not human-reviewed. Authorization: Weibao requested "Fix the malformed effect in the Klein pack, rerun the integration checks, and then continue with the next foundational slice." The [preceding checkpoint](../foundation-conversations-2026-11-04/CHECKPOINT.md) owns the pack repair and integration rerun. No new canon episode, progression, save schema, installation, commit or push.

## Problem and boundary

On cold reload/import, the native restoration path creates a name-free location placeholder before its optional source arrives. The source supplies the correct place name to the book panel, but `ensureCastLocation` previously returned early for the existing placeholder. The native header and return control remained unavailable while the actual actions worked. The preceding fixture screenshot records this mismatch.

Rules: AD6–AD8, AD36, AD42–AD43, AD45, AD51; [AR1–AR16](../../../ARCHITECTURE_RULES.md), [UI rules](../../../UI_RULES.md), existing source/identity/projection owners. P2/P3 of the [foundation plan](../../../audits/PROGRESS_EVIDENCE_MAP_2026-11-04.md) apply. Desktop 1920×1080, existing surface and labels; mobile, new skins, source revision migration and unrelated world depth are deferred.

Player result: after a known place's source arrives, its native header, book panel and Back destination use the same resolved identity. The current conversation/Notebook task stays open. If the source is absent, its placeholder stays explicitly unavailable.

## Implementation and ownership

Owner: Codex chat `01a1a74e-17ab-7172-9e53-5507c2df53fe`. Isolation reason: the full integration suite was reading primary source; this slice was implemented separately, then applied after that run finished. The own temporary checkout is now archived and retired without reset, stash or force. Exact temporary checkout, base and file hashes are recorded privately in `private/foundation-conversations-2026-11-04/pack-repair/lane.json`.

| Area | Change | Preserved boundary |
|---|---|---|
| `src/cast_location_restore.js`, `book_world_lotm_domain.js` | Track actual placeholder objects transiently and hydrate their display metadata when the matching source row arrives. Revisit existing native location ids after source installation. | Same native object, id, availability, jobs and other live fields. No second world-state owner or source-text persistence. Ordinary authored locations are not repeatedly overwritten. |
| `src/display.js`, `main.js` | An injected identity-refresh operation updates the current place's native name and description. | No re-entry, clock advance, reward grant, occupation interruption or full location redraw. The callback checks the current native object. |
| `src/center_modes.js` | Refresh current navigation labels without changing the task stack. | No Back/Stop callback, focus change or task replacement. |
| Tests and browser proof | Exercise delayed source, same-object restoration and retained conversation consequences. | Source fixture is synthetic and name-free. No personal save or sealed world truth is exposed. |

The helper marks placeholders with an ephemeral WeakSet, not a saved flag. Resolving metadata does not change environmental settings; newly created known locations retain their prior creation defaults. Compatibility: no command, cost, effect or saved shape changes. No new domain registration, cycle edge or import of main.

## Verification

| Check | Result | Input / gaps |
|---|---|---|
| `node --test tests/cast_location_restore.test.js tests/center_modes.test.js` | 8 pass | Same-object, availability, pending job and environment preservation; absent source; authored-location retention; navigation stack and Stop callback invariants. |
| `BUILD_OUT=.lane-builds/foundation-place npm run build` | Pass | Isolated bundle `1951151f9447f6deee569989fa4cb46bf50d69dccd8c09a92e5af2a12f3dd100`; standard source build with existing unrelated duplicate-key warning. Primary build outputs untouched. |
| `npm run check:arch` and `npm run check:rules` in isolated checkout | Pass before final creation-default correction | main -7, display -4, save_files 0 vs baseline; no new cycle edges. Creation-default correction changes no graph or registration. Final primary architecture check passes with the same counts. Final primary rules check passes, including receipt and direction checks. |
| `node tests/conversation_knowledge_browser.mjs .lane-builds/foundation-place <private-output>` | 24 pass, 0 browser errors on final isolated bundle | Fresh localhost; actual conversation/Stop/Notebook/Save/Export/Import UI; named fixture enrollment hook. Later source requests delayed by 500 ms. Native header and Back label resolve correctly after reload; literal Import retains the same identity, recipient memory and exact payment. |
| Full integration suite | Completed primary run before this slice | Contains the pack repair and preceding conversation slice, not this isolated slice. 5133 pass and 8 failures, followed by targeted serial reruns; no green full-suite claim. |

Proof driver corrections: literal Import now waits for the real top-level navigation rather than a guessed delay, and waits for usable native input. The isolated checkout uses symlinked private fonts to match the primary test assets. These fix proof setup and do not bypass native save validation.

Private evidence: `private/foundation-place-identity-2026-11-04/` holds final `result.json`, screenshots, fixture export, build log and recoverable source patch/new-file copies. The earlier failed attempts there retain their original scope; the final receipt and bundle hash identify the passing run. Source-absent metadata retention has focused coverage; a separate source-absent native browser journey was not run.

## Joined primary verification

The patch was checked and applied against fresh primary inputs after the broad suite ended. `node --test tests/perspective_controls.test.js tests/lotm_records.test.js tests/cast_location_restore.test.js tests/center_modes.test.js` passes all 17 cases. `BUILD_OUT=.lane-builds/foundation-joined npm run build` passes. The joined browser replay passes 24 assertions with zero browser errors, including native header, retained task, Back destination, reload and literal Import. Final screenshots were visually inspected at 1920×1080. `npm run check:arch` passes; `npm run check:rules` passes: 30 register rows, 51 AD codes, 1005 relative links, 23 receipts and direction sync. The other writer resolved its transient missing receipt; no edit to that checkpoint was made here.

Joined evidence and input hashes: `private/foundation-place-identity-2026-11-04/joined/` and `joined-inputs.json`. Earlier isolated proof used bundle `1951151f9447f6deee569989fa4cb46bf50d69dccd8c09a92e5af2a12f3dd100`; it remains separate from the receipt above. Lane archive includes the full tracked patch and every untracked file; eight integrated owned paths were byte-compared before a clean plain worktree removal. See `lane-archive/retirement.json`.

No further slice is selected here. The broad suite was not rerun after this bounded identity change; focused and joined native proof cover the changed consumers. Local at verification; later runtime integration is committed as `72a33f151`. No installation or release established.

Final rebuilt proof after the concurrent job-control inventory fix: `.lane-builds/foundation-final`, bundle `172c917077d1628d9b56ac8ff9f2c7b316e23a0e543ee5b447eb75783f2de927`; `final/result.json` records 24 passing assertions and zero browser errors. Final 17 focused checks, build, architecture and rules gates pass. Earlier joined bundle evidence remains under `joined/`; the current receipt points to `final/`. Broad suite and serial recovery results remain separate in the preceding checkpoint.

Capture follow-up: the final post-import screenshot initially showed a blank viewport although the retained panel DOM assertions passed. The driver now brings the actual panel into view and waits for paint before capture. A rerun still passes all 24 assertions; `final/final-layout.json` records the panel inside 1920×1080 and the final screenshot was visually inspected. No product style or readiness check was bypassed.

Current reconciliation and delivery-state limits: [foundation follow-through reconciliation](../foundation-conversations-2026-11-04/CHECKPOINT.md#reconciliation-of-foundation-follow-through-2026-11-04). Original receipt remains proof of its pinned build, not a fresh journey on subsequent method/item edits.
