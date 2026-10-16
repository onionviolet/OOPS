# LP3 practice supply proposal

The player binds one Lever practice brace at Eda's existing fitting bench, then uses it up in the craftsman's supervised lever-setting practice. One owned Sound repair stave, one owned Tree sap, one stamina and two played minutes yield exactly one brace. Completion automatically collects it into native inventory. The batch reserves the existing bench's only slot and needs fresh inputs every time.

Authorized reversible PROPOSAL under Weibao's 2026-10-14 LP2–LP8 dispatch, implementing LP3 in [the packet](IMPLEMENTATION_PACKETS.md) and earlier P4. Original Village content only. No new world or prestige. Numbers, fiction and taste remain unaccepted.

Try it: Village → meet the ordinary craftsman → Notes, practice & people → Tools, practice & local lives → Fitting tools & materials → Meet Eda. Buy or borrow a fitting knife, cut one actual log into wet staves, and dry one in the ordinary sheltered rack. With one sap, choose **PROPOSAL · Bind one lever practice brace**. After two played minutes, the brace is automatically collected. Then Here → Field association & workshop → Ask about a shared field workshop → Wedged timber & lever lesson → watch the demonstration → explain the pivot rule → **Practice lever-setting with the craftsman**. Practice now spends one brace, one coin and one stamina over three played minutes. Its learned timber task still makes a useful actual survey kit.

D1: Target viewport: 1366 × 768 desktop. Visible outcome: existing fitting stock/slot records show brace supply, while the existing lesson shows its real cost and useful task. Mobile optimization, habitats, lesson-status changes and new production frameworks are deferred. Standing direction reconciled against PROJECT.md and USER_VISION.md; the supplied LP_COMMON text governs this lane.

## Changes

| File | Change |
|---|---|
| `src/lever_practice_supply.js` | Native brace item descriptor and shared inventory key. Importing it grants no stock or learning. |
| `src/feature_expansion_objects.js` | Register the item and one repeatable two-minute recipe using existing bench, scheduler, costs and durable completion. |
| `src/feature_expansion_objects_host.js` | Read-only owned brace count, recipe, slot and automatic collection explanation. |
| `src/lever_lesson.js` | Add the brace cost and acquisition explanation to practice. Lesson status, phases and eligibility facts are unchanged. |
| `tests/lp3_practice_supply.test.js` | Six focused contracts for stock/slot, refusals, refunds, downstream use and old frozen jobs. |
| `tests/lever_lesson.test.js` | Supply one controlled brace in lesson fixtures that intend to practice. Old absent-state test remains empty. |
| `lp3-evidence/` | Reproducible desktop browser harness and evidence. Disposable exports/logs are ignored. |

## Compatibility decision

No save version or namespace changes. Brace stock is an ordinary optional native item. The batch uses existing optional jobs, site reservation and completion receipts. Old saves load without braces, invented batch completion or learned methods. Newly accepted practice requires a brace. Existing earned methods remain valid; no back-charge. Pre-LP3 pending practice retains its frozen original costs, effects and completion support and finishes without inventing or charging a brace. Existing fitting and drying jobs are unchanged.

Collection is automatic at batch completion, in the existing durable transaction that writes the completion receipt and output inventory. There is no separate collectible reward or new collection flag to replay. Cancellation or lost support returns the reserved inputs and yields no brace. During practice the brace is reserved, consumed on supported completion, and refunded on cancellation or lost support. No additional offline production is introduced; the authored batch runs on played native scheduler minutes.

## Checks

V1: `npm run build` passed, including the existing Ink check with zero diagnostics. Source commit: `404ebb05`. No package installation.

V2: `node --test tests/lp3_practice_supply.test.js tests/lever_lesson.test.js tests/lp7_material_choice.test.js tests/field_workshop.test.js`: **30 tests, 30 passed, zero failures**, 2591.359 ms. Six LP3 checks cover exact declared output, actual owned inputs, borrowed-material refusal, one-slot reservation, repeated paid batches, cancellation/lost-support refunds, downstream brace consumption, no duplicate completion after restoration and frozen pre-LP3 practice costs.

V3: Final `npm test`: **1,471 tests, 1,468 passed, zero failures, zero skipped, three existing TODOs**, 68228.603958 ms. No pre-existing failures were observed. The TODOs concern legacy native combat RNG, local-life search/contact RNG and encounter/loot/craft/market/gather RNG in `tests/determinism_replay.test.js`. Machine-readable [checks](lp3-evidence/checks.json).

V4: Source, test and report `git diff --check` passed. `node --check lp3-evidence/browser.cjs` passed.

V5: Rebuilt fresh-origin browser run on port **8196**: **17 groups passed, zero page errors**, at **1366 × 768**. Served bundle SHA-256 matched local rebuilt bytes: `f0bd147c75f1295483568c3facf3344c7a4a2928bdc446c39183da5c320b3422`. See [browser results](lp3-evidence/results.json) and [harness](lp3-evidence/browser.cjs).

| Native acceptance path | Observed result |
|---|---|
| Real inputs | Bought an actual knife from Eda for six coins, cut one owned log into two wet staves and dried one into a sound stave. Bought one additional finite sound stave for two coins to isolate slot refusal from missing stock. The batch reserved one sound stave and one sap and produced nothing initially. |
| Slot and declared output | The same existing fitting bench showed its only slot reserved, and ordinary drying was blocked despite available wet stock. Two-minute completion freed the slot and collected exactly one brace. Owned brace stock displayed 1 beside the 0/1 occupied slot record. |
| Actual downstream cost | The explained lesson refused with no brace. Supplied practice consumed the one brace and one coin, then taught the method exactly once. Learned lever work produced one real Prepared survey kit from an actual log while returning the spare lever. |
| Pending Save/reload/Export/literal Import | Batch pending and practice pending restored exactly, including native stock, purse, levels/XP, simulation records, actor, RNG, clock and reserved slot. Their actual Export files retained live jobs due after the saved clock: batch 18 → 19, practice 23 → 25. |
| Collection and completed persistence | Collected brace stock and completed lesson/task each passed native Save, reload, Export and file-input literal Import. Repeating the collected Import kept one brace, then advancing time added none. Repeating the final Import retained zero braces, one lesson completion and one kit. |
| Compatibility | The old public checkpoint loaded with its original native inventory and no LP3 stock or batch receipt. No LP state was injected. Controlled source checks separately load absent optional state unchanged and retain frozen old practice costs. |

The browser uses the existing public R1 earned checkpoint with 95 logs and three sap. **Only its initial native time is controlled to 08:00**, to make the craftsman's established teaching window available. All LP3 production, lesson evidence, practice and task results are earned through UI actions. This is a bounded slice proof, not a fresh-new-game acquisition or natural overnight-wait proof. The Playwright clock advances normal native timers; it never calls the simulation executor or supplies material or lesson state. Earlier harness runs stopped on an insufficient virtual-timer loop bound and a duration assertion sampled one minute after acceptance. Increasing the timer bound and capturing acceptance in the same click corrected those harness issues; no production repair was needed.

Screenshots: [missing ingredient](lp3-evidence/01-missing-ingredient.png), [ready recipe](lp3-evidence/02-ready-batch.png), [reserved slot](lp3-evidence/03-slot-reserved.png), [collected stock and free slot](lp3-evidence/04-collected-stock.png), [practice cost](lp3-evidence/05-practice-ready.png), [learned useful task](lp3-evidence/07-learned-task.png). `node lp3-evidence/capture.cjs` additionally reopened the actual completed Export, verified zero braces / one lesson / one kit, and captured the learned UI. Disposable Export files and raw logs remain local and ignored.

## Merge risks and limits

M1: Reviewed `codex/gameplay-foundations` at `d40b80cbc90896c701ebfa4bada3b5735e540a23`; none of LP3’s three modified existing source files differ there from dispatch base `277c8ffd`. Integration should rebuild generated `dist/` and `index.html`; they are local verification outputs and excluded from source commits. The existing fitting definition array/item list and host projection may overlap sibling edits. Retain both lanes' entries. The new command ID is `feature_objects.lever_practice_brace` and the item is `Lever practice brace`.

M2: LP2 owns lesson status. LP3 changes only one import, practice label, cost and explanation in `lever_lesson.js`, leaving lesson state effects and blockers structurally intact. On merge retain LP2 status work and this actual cost. LP1 evidence is historical evidence for the former practice cost, not current LP3 evidence.

L1: Native browser cancellation, lost support, borrowed-input refusal, a second production batch and pre-LP3 pending-practice restoration remain **implemented-unverified in the browser**, with passing controlled source coverage. Unloaded/offline timing and a fresh-new-game-to-craftsman route were not exercised. Mobile optimization is deferred. No broader Foundation-chain or world-completion claim.

The required LP3 technical acceptance path passed. The one remaining authoritative acceptance gate is **Weibao's play and taste**. The tested proposal is served at http://127.0.0.1:8196/. Source and evidence are committed on `codex/hl-lp3`; no push or merge. Generated bundle/map and `index.html` fingerprints remain local build outputs.
