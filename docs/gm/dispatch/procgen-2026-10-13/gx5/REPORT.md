# GX5 per-save mixture appearances

2026-10-14. W2-1 O3-A technical slice delivered on `proc/gx5-appearances`, isolated worktree `proc-gx5-appearances`, port 19410. Wave 1 merge `4e13f97f` is an ancestor. Main checkout was read only; no push or integration merge. Fiction/appearance taste remains for Weibao to accept.

## Play it

A1: In Village, choose **Mix at the Village counter**. Buy River bellleaf and Spring water, leave one pack of each selected, choose Steep and **Mix one vial**. The first four newly acquired types enter the demonstration appearance pool. The first accepted new acquisition explicitly enrolls the save; buying and previews do not. Its label describes a neutral container, distinguishable by texture or shape as well as color. Both the mixing list and native inventory use this label.

A2: **Experiment: drink one dose** consumes that actual owned vial, applies P2's real effect and records its observed properties. Mix the same selection again. The new batch has the same saved container and displays P2's learned type with **Recognized by its saved appearance**. Other concentrations/processes remain unknown until separately observed. Save, reload and Export/Import retain the mapping and learning.

A3: For four distinct types, mix leaf + water with Steep and Boil, then Emberseed + water with Steep and Boil. Later new types retain P2's normal presentation after the four-slot pool fills. Distinct fresh seeds generally produce different permutations, but collisions are possible; there is no promise that every pair of saves differs.

## Implementation and compatibility

F1: New `product_appearance_content.js`, `product_appearance_state.js` and `product_appearance_view.js` own six original neutral labels, finite allocation, validation and pure presentation. P1 has no standalone `appearances` family. The adapter uses its supported `discovery:appearances@village.demonstration` stream through `drawUnit`; P1 is unchanged. Fisher–Yates consumes exactly five draws once. Stored draw start/salt and permutation are validated through pure P1 decisions, without consuming or replacing saved state. Repeat types allocate no slot and consume no draw. Rendering never allocates.

F2: Optional `expansion.productAppearances` schema/revision 1 holds the frozen permutation, four bindings at most, enrollment/acquisition references and cursor. A bounded P2 `acquisitions` ledger records only enrolled types, at most four in the actual acquisition path. One staged durable write contains native input debits/output, P2 truth/receipt, appearance map and stream cursor; publication follows it. Forged/missing references, unsupported pools/truth revisions, duplicated slots or a changed permutation reject before replacing the current save. The additive owner uses the existing engine/save envelope; root owns any future global version negotiation.

F3: P2 revision 1's canonical `product.id` is the stable type key. It includes retained composition, process and truth revision, excluding count, player, UI label and individual acquisition sequence. P2 currently has no separate randomized batch dose/degradation truth: changed ratios/processes have distinct identities and do not inherit observations. Recognition reads only P2's exact `knowledge[id].observed` predicate. It never teaches dose or side effects from appearance. Future instance-specific truth needs P2's corresponding scoped knowledge adapter; GX5 does not invent those fields.

D1: Old saves without this owner load without creating it. All pre-slice P2 catalogue products keep their existing labels/knowledge, including later repeat batches; they are never retroactively enrolled. A newly created type can explicitly enroll the old save via Mix. Existing physical identities, inventory keys, ingredient laws, effects and fixed fieldcraft vial remain unchanged. Current reader rejects missing GX5 owner when its acquisition references remain, and unsupported retained data rather than repairing/rerolling it. Import back into an older build that ignores optional fields is outside the supported continuity claim.

D2: Generated vials now offer deliberate `[use]` only. P2's existing base-template `auto` control could not select a particular variant and had no working exact-key consumer. Native ordinary consumables retain their auto controls. All generated variants keep the same fixed price, so value sorting does not encode potency.

## Shared edits, separately listed

| File | Narrow change |
|---|---|
| `src/mixture_state.js` | Validate additive acquisition references; wrap existing authorized presentation through shared appearance projection. No resolver or knowledge law change. |
| `src/mixture_native.js` | Optional expansion context; acquisition adapter after accepted mix/completion staging; include staged expansion in one durable envelope. |
| `src/mixture_ui.js` | Counter help states first-four enrollment/recognition; existing list and preview already consume common P2 presentation. |
| `src/main.js` | Import view owner setter; pass expansion to staged action; publish staged expansion/view owner; restore appearance view after expansion load before inventory reconstruction. |
| `src/save_files.js` | Import and invoke appearance envelope validation at preflight. |
| `src/display.js` | Omit base-template auto control for generated-vial instances. |

`src/items.js`, inventory component, fieldcraft content/view, P1 streams and expansion engine are untouched. Existing item decoder/name/tooltip adapters already call common P2 presentation. New tests: `tests/product_appearance.test.js`.

## Evidence

| Code | Label / check | Result |
|---|---|---|
| V1 | SOURCE: `node --test tests/product_appearance.test.js tests/mixture*.test.js` | 24 passed, 0 failed, including 8 GX5 tests. Fixed five-draw budget; six-entry permutation; same-seed equality; chosen seeds 7/8 differ; 100-seed coverage; previews/shortage/repeats; four-slot exhaustion; recognition and unknown projection; rejected durable acquisition/experiment; exact serialized owners; forged/future/missing binding rejection; legacy product and full save validation. |
| V2 | SOURCE: final `npm test` | 687 passed, 0 failed. Includes V1; counts are not additive. Existing fieldcraft, save/import and mixture regression slices remain passing. |
| V3 | SOURCE/build: `npm run build` | Passed. Served worktree bundle matches SHA-256 `9e643c442500fbc92ce4fc4551e31785a9167de680fa04591d379ef57ff86f01`. Build output/index excluded from commit. |
| V4 | NATURAL: [browser harness](browser_journey.mjs), [evidence](browser_evidence.json), N1–N14 | 14 passed. Real fresh heroes/coins; paid inputs → unknown appearance → native oral experiment/effect → recognized repeat; four types; three stay unobserved; exact unidentified/identified Save/reload and literal-file Import at a second fresh origin (`127.0.0.1` → `localhost`); second natural fresh root/permutation differs and its wider acquisition/experiment/repeat/reload passes. Zero page errors. |
| V5 | SEEDED-NATIVE: [compatibility harness](compatibility_browser.mjs), [evidence](compatibility_evidence.json), S1–S3 | 3 passed. Compatibility fixture comes from earned natural unknown export by omitting only GX5's optional owner/receipts/draw cell, through real codec/validator. Actual literal-file loader preserves pre-slice truth/stock/knowledge/label. Repeat legacy type stays unchanged; real new type enrolls. Unsupported pool and forged binding files reject with exact current-save preservation. Zero page errors. |
| V6 | Rebuilt desktop visual review | [1366×768 unknown](laptop-unknown.png), [recognized](laptop-recognized.png); [1600×1000 imported](desktop-imported.png), second fresh [unknown](desktop-second-unknown.png)/[recognized](desktop-second-recognized.png). Labels, inputs and Mix action are readable in existing panels. At laptop height lower known-dose actions require scrolling the Local actions panel, as the existing P2 details grow; no page-level scroll is needed. Mobile deferred. |

Private saves were never opened. Fresh profiles and test exports remain in `/private/tmp/procgen-gx5-profile*` and `/private/tmp/proc-gx5-*.txt`, outside git. Reports/evidence do not dump product truth, save envelopes or sealed world data.

## Remaining gates

R1: Root integration and Weibao's appearance/balance/taste acceptance remain open. This worker commits only its isolated branch. [BACKLOG](BACKLOG.md) records native edges not exercised and deliberately deferred scope. The requested desktop acquisition/experiment/recognition/persistence journeys pass; broader mixture systems are not claimed.
