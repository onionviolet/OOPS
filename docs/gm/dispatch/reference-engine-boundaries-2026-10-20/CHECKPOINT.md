# Engine light/resource/time continuity checkpoint

**Final status, 2026-10-20:** selected engine slice implemented and technically verified on the isolated rebuilt candidate. Human play acceptance remains open. Writer reservations are released; no commit/push/publish or shared generated-output write.

## Scope and ownership

Authorized PFE09/PFE11/PFE17/PFE23 slice, through existing lamplight and reading seams. Applies AR1–AR16; AD3/6–9/15–17/32/34/36/38/40; SLR3–8/24–27 and owning-clock application. Desktop target 1920×1080; visible outcome: actual lamp light/fuel, reading pace, expiry and saved progress agree. Mobile, UI redesign, additional systems and natural acquisition campaigns are deferred.

Writer: chat 01a15be7-2e00-7a13-a826-7eb4f9ad4771. Execution reservations (now released): `src/lamplight_domain.js`, `src/reveal_chain.js`, `tests/lamplight_domain.test.js`, `tests/headless/lamplight_continuity.test.js`, `scripts/playtest/lamplight-continuity.mjs` and this dispatch folder. `src/items.js` was reserved narrowly for the reading light interval consumer (now released): read live connected-system checkpoint at start, which reserves neither items nor these domain paths; items hash equals dispatch input and has no dirty hunks. Main/display/styles and all connected-system reservations remain untouched. No messages, further delegation, commit/push/publish, or personal saves.

Input identity: `LANE_INPUT_STATE.json` captures actual shared dirty checkout (HEAD b0af7db5bd21770ca603fdf1e7b865b376f46857) and relevant hashes. Candidate copy and hashes will be recorded before completion gates; shared dist/index will not be rebuilt.

## Trace and selected checks before edits

- F1: Native `simulateTick` calls `update_timer`, which commits clock then dispatches domain ticks, before `do_reading` calls `Book.addProgress`. Supported `advanceTicks` and `fastForward` replay native ticks; direct travel advances fuel without reading. Need reproduce whether expiry removes the final fueled reading interval.
- F2: Existing lamp command revalidates stock/action/oil, rolls back failed persistence, and dynamically stops shining on custody loss. Preserve these mechanisms; verify stale command, douse/relight and no observation mutation.
- Selected regressions: final and fractional fuel intervals; expiry coincident with book completion and exactly-once reward/XP; sufficient alternate light and ambient daylight; inspection across post-expiry remainder; normal versus supported batched advances; reading stop/pause, current-state pending/post-expiry Save/reload/Export/literal Import.
- Existing focused checks: lamplight/reveal-chain/domain registry tests and native headless journey. Completion: isolated candidate `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules`, then rebuilt browser and persistence at fresh disposable origin. No rule change selected.

## Progress and verification

F1 reproduced on original native headless inputs: one minute of oil at 22:00 yielded 1.0 book work instead of 1.2 because fuel tick precedes study. F3 reproduced in a focused test: with 5 oil minutes and a sufficient independent light, a 25-minute domain tick recorded 5 inspection minutes while 5+20 recorded 20. Both failing regressions were run before runtime edits.

Implemented domain-local corrections: lamplight records the just-settled light interval against the existing native calendar/place/state/custody; `Book.addProgress` asks for that elapsed interval, while estimates/projections still read current light. The record is transient, cleared on configure/load/command and unavailable after the native clock/place/custody changes. No new clock, scheduler or save field. Inspection settles the post-expiry remainder through actual remaining sources. Existing commands, native transaction/save writers, XP and completion owners remain unchanged.

Focused source checks: `node --test tests/lamplight_domain.test.js tests/reveal_chain.test.js tests/domain_registry.test.js` passed 19/19 after edits. Existing native lamp purchase/travel/route/persistence headless journey passed 1/1 on the pre-edit input; that is preserved-support evidence only. New native tests initially reached all pending/post-expiry persistence and batch comparisons, then exposed two fixture errors (null versus undefined reading state; preloaded book progress without matching Literacy XP). Corrected fixtures retain native save invariants; rerun pending.

Frozen dirty-input candidate: `/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/oops-engine-continuity-6kj_mta0`, 14,902 copied files, zero source drift during copy. Full SHA-256 map is local-only `docs/research/proto23/private/engine-boundaries-2026-10-20/candidate-inputs.json`. Candidate has its own Git index and shares dependencies, not generated outputs. Required gates and rebuilt browser verification pending. Source support is not human acceptance.


### Native evidence and candidate revision B

- New native continuity case passed 1/1, including pending/final full-envelope Save/reload/Export/literal Import, six-minute batch versus singles, native dawn samples (6.3775 work), pause/stop and fuel conservation. Completion case passed separately 1/1 after its fixture correction. Book work, XP and book bonus settle once when completion coincides with expiry. The existing Reader title is recognized at the next native publication or by load backfill: immediate completion reload changes only `/character/titles/reader`, while book/fuel/XP/bonus are exact; after recognition the entire envelope round-trips. This preserves the existing recognition mechanism, not a second title writer.
- First browser run established native inventory lighting/reading, pending and expired exact persistence and `advanceTicks`/single-minute/`fastForward` equivalence. The completion comparator initially failed only on that existing Reader backfill; explicit immediate selected-state and later whole-envelope checks now pass. Screenshots inspected at 1920×1080; harness seeds book/items/time and short fuel/completion progress. No natural campaign acquisition is claimed.
- First full suite on frozen revision A: 2,334 pass / 1 fail, 133.76 s. Sole failure was UI-contract fingerprint `src/harvest_ui.js|cssText|004363ff925e2ac8` in another concurrent lane. The live harvest owner independently removed that inline style while these checks ran. Copied only its corrected `src/harvest_ui.js` into candidate revision B; the engine lane did not edit it. Candidate hash-map revision records old/new inputs. Final build passed; full suite and browser checks rerunning for this concrete changed input.
- Browser optional-resource check was tightened: only missing `/private_packs/manifest.json` is expected in the isolated public candidate; any other resource failure or JS console/page error fails. The existing local font is a same-machine symlink in the temporary candidate, not copied or distributed.


## Final result and verification

F1 is corrected: the last fueled fraction contributes to native study before its support expires. With 2.5 minutes of oil, six night minutes produce 6.5 work; the current lamp is out and the rendered remaining estimate becomes 113.5 minutes. F3 is corrected: an independent sufficient light supports the inspection remainder after lamp expiry. F2's working stock/command/rollback/custody behavior is retained. Native dawn remains the weather owner's end-of-minute sample; the selected dawn regression expects 6.3775 work. Supported compressed advances replay native ticks, not a new approximate clock. Travel still burns actual elapsed fuel without inventing study, and no new offline policy was introduced.

Changed source: `src/lamplight_domain.js`, `src/reveal_chain.js`, one reading-consumer line in `src/items.js`. Tests: expanded `tests/lamplight_domain.test.js`, new `tests/headless/lamplight_continuity.test.js`. Runnable browser journey: `scripts/playtest/lamplight-continuity.mjs`. Lane input receipt: `LANE_INPUT_STATE.json`. No save schema change or old-save migration is needed; transient completed-light intervals are not serialized.

| Evidence | Command / case | Final result |
|---|---|---|
| V1 Build | `npm run build` in candidate revision B | PASS. Shared `dist/` and `index.html` not regenerated by this lane. |
| V2 Full suite | `npm test` in revision B | **2,335 passed, 0 failed**, 131.94 s. The previous revision-A UI failure is preserved above; no engine-lane UI repair or allowlist change. |
| V3 Architecture/rules | `npm run check:arch`; `npm run check:rules` | PASS, zero new architecture growth/edges. Rules: one existing warning for an untracked linked gear-depth doc. Same relevant main/display/save/registry and rule-index inputs in revision B. No rule change, so rule-behavior gate does not apply. |
| V4 Focused source | `node --test tests/lamplight_domain.test.js tests/reveal_chain.test.js tests/domain_registry.test.js` | **19/19 PASS**: final/fractional fuel, current projections, daylight/alternate source, held loss, paused ticks, stale commands, once-only expiry and inspection equivalence, existing rollback and slice checks. |
| V5 Native | New headless continuity case; corrected completion case | **2/2 cases PASS across recorded runs**. Current-format pending/final round trips, dawn, stop/pause, batch equivalence, completion at the expiry minute, exact XP and one book multiplier. Existing lamp buy/travel journey also passed 1/1 on the pre-edit baseline. |
| V6 Rebuilt browser | Dedicated journey on fresh disposable origins, 1920×1080 | PASS: native inventory light/read, paid flask, expiry, six single minutes versus batch versus `fastForward`, pending/expired/completed persistence. Immediate completed-study reload preserves book/fuel/XP/bonus; existing title backfill is explicitly separate. |
| V7 Visible transition | Focused browser probe and inspected screenshots | PASS: selected book estimate updates **98 → 113.5 minutes** as actual light expires; final work **6.5**, shining **false**. Render waits are in the runnable script; all unchanged persistence scenarios reuse V6. |

Exact verified bundle SHA-256: `ce1be18c3b775e23f2fd2f4845b0dae8a31bfe708dafd5cfd75171441456751f`. Runtime and regression source hashes match the candidate; the final browser script adds only the two visible-estimate waits exercised by V7. Detailed manifest, logs, technical/browser/visible receipts, screenshots and literal exports stay in the ignored local-only `docs/research/proto23/private/engine-boundaries-2026-10-20/` route. Expected optional private-pack manifest 404 is recorded; other request failures and JS/page errors fail the browser check. No sealed truth is needed in this checkpoint.

Reproduce from the existing rebuilt copy:

```sh
node scripts/playtest/lamplight-continuity.mjs /var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/oops-engine-continuity-6kj_mta0 /tmp/oops-lamplight-evidence
```

G1, remaining acceptance: Weibao's play judgment. Setup was harness controlled: nighttime, owned book/items, short remaining fuel and nearly completed study are seeded; no natural campaign acquisition is claimed. The existing pre-edit market journey used native purchasing with seeded access/money. Styling/IG and connected-system completion remain with their own chats. Candidate and evidence are local and reviewable; all lane writers and disposable browser/server processes have stopped. No commit, push, publish or personal-save operation was performed.
