# P2 Village mixing

Started 2026-10-13; completed technical checks 2026-10-14. Branch `proc/p2-mixing`, isolated worktree `proc-p2-mixing`, rebuilt server `127.0.0.1:19320`. No main-checkout writes, push or merge. Original fictional ingredients; all prices, potency, duration and timing are proposals for Weibao.

## Reach it in play

A1: In Village, choose **Mix at the Village counter** in Local actions. Buy whole ingredient packs with native coins. Select quantities, include water and a plant, choose Steep or Boil, then Mix one vial. The two plant ingredients are also registered in the existing Forest road herbalism route with its existing access/tool requirements.

A2: Try different ratios or preparation. Inventory keeps the exact generated variant; matching physical products stack. Predictions stay unobserved until you drink a dose. **Experiment: drink one dose** applies real health/stamina regeneration and a possible agility side effect, then records what you actually observed. The ordinary inventory `[use]` route uses the same instance-aware handler.

A3: Save an observed method. **Queue learned method** accepts 1–999 batches, holds exact inputs for the admitted batch, takes three native calendar minutes per batch and admits the next batch against current stock. It stops with a named shortage. Cancel returns exactly the held ingredients. Keep the character free in Village for the counter to settle work. This is idle production while the game runs; closed-browser production is deferred.

## What changed

F1: `src/mixture_state.js` owns optional schema/revision 1 material truth, canonical products, observations, learned methods, hidden method/witness and reservations. Family truth is generated once when the owner is first created from the existing save seed, using a small local seeded helper and shared latent axes. Resolved values and receipts are saved. Restore reads retained truth and revision, never regenerates it from the current catalogue. Future unsupported revisions reject rather than silently falling back. The helper is explicitly awaiting root/P1 seed integration.

F2: Whole packs map to exact integer fictional mass units. All constituents enter the vial, including traces; this first law produces no unaccounted waste. Steep/Boil change oral availability. Concentration changes potency, so added carrier changes the result without creating active material. One entire vial is one dose. Rational split and dilution helpers retain exact trace quantities, tested at source; they are not additional player actions in this slice. The first law has one deterministic resolver, no competing reaction set or multi-step process language.

F3: One carrier template plus a canonical mixture reference supplies native identity. `src/items.js` reconstructs the selected product, and its name/description reads observer knowledge dynamically. Fixed prices do not encode hidden potency. `src/components/inventory_component.js` validates generated references and whole vial counts before insertion. No result template or permanent effect template is created per variant. Product records remain retained after consumption to support active exposures and other holders.

F4: `src/mixture_native.js` stages plain data, then validates and writes one complete envelope before publishing stock, money, knowledge, jobs or effects. Rejected stock requests and writes leave live owners/draws unchanged. Exposures save exact stat payload, dose, retained product revision/reference, native calendar application/expiry time and remaining duration. One family uses **latest dose replaces previous dose**. The payload is normalized before its first save so native restoration adds no missing default fields.

F5: `src/mixture_ui.js` adds a compact counter inside the existing crafting window, with ingredient amounts, owned counts, process, uncertainty, observed forecast and exact owned product/method controls. The existing crafting screen is restored on Back. At 1366×768 the first owned product and repeat controls are visible within the existing workspace; 1600×1000 also passes. Mobile is deferred. Polling retains quantity/method inputs rather than rebuilding unchanged controls.

### Shared-file edits for root integration

| File | Exact integration area |
|---|---|
| `src/main.js` | Imports; small staged native mixture bridge; `use_item` instance branch; `add_active_effect` reads existing instances' group tags; optional owner save and restore before inventory; canonical mixture bypass in the common v0.6 inventory loader; complete generated exposure restore; panel/gathering registration. No crafting success random site or clock loop edits. |
| `src/save_files.js` | Optional mixture owner, full holder-reference and exposure validation before load/import. |
| `src/crafting_recipes.js` | Idempotent registration of two original plant ingredients on existing Forest road herbalism. |

Other assigned changes: `src/items.js`, `src/components/inventory_component.js`, `src/active_effects.js`, three new `src/mixture_*.js` modules, four new test files. `src/native_craft_transaction.js` needed no edit because this route stages without live mutation. Build outputs and `index.html` are excluded from the commit.

## Checks and results

| Code | Label and evidence | Result |
|---|---|---|
| V1 | SOURCE: `node --test tests/mixture*.test.js` | 16 passed, 0 failed. Generator golden vector independently calculated; 100 seeds checked for correlated fractions. Pure preview; input order; ratio/process distinction; mass/trace split/dilution; unknown vs unresolved; reference rejection; stable hidden method/witness; decoder/stacking; dose restoration; paid stock; failed writes including experiment; reservations/refunds; timed shortage; native chest split/merge and vendor sale; UI controls. |
| V2 | SOURCE: `npm test` on final source | 637 passed, 0 failed. Includes the 16 P2 checks; do not add these counts together. Old-save, native transaction, import, and unrelated suites remain passing. |
| V3 | SOURCE/build: `npm run build` | Passed. Final served bundle SHA-256 `d4533c2a68d57e0d7d69b81ae8200d1d2a7d9cc98a46039add832612d04b4eef`; browser harness compared served bytes with this worktree's rebuilt bundle. |
| V4 | NATURAL: `browser_journey.mjs`, `browser_evidence.json` N1–N11 | 11 passed. Fresh Chrome profile, hero `TEST FIXTURE PROCGEN P2 natural`, paid acquisition → distinct/stacked mixing → experiment → real effect → learned method → timed repeat/shortage. Exact pending and consumed-source Save/reload plus three literal-file Export/Imports. Cancellation returns held stock. Both requested viewports; no page errors. |
| V5 | SEEDED-NATIVE: `holder_fixture.mjs`, `holder_browser.mjs`, `holder_evidence.json` S1–S2 | 2 passed. Fixture derived from the earned natural export through real native storage/trade/persistence code. Literal-file import and Save/reload reconstruct all carried, chest and vendor variants exactly. This does not claim natural chest access or a natural trader journey. |
| V6 | NATURAL: `exposure_browser.mjs`, `exposure_evidence.json` N12–N14 | 3 passed. Native inventory-use handler replaces one family with a different dose, exact replacement payload survives Save/reload, and native elapsed game minutes remove it at expiry. All final exposure checks passed. |

Screenshots: [laptop](laptop.png), [desktop](desktop.png). Evidence JSON contains only route/status claims, not generated hidden truths. Browser profiles and test exports stay under `/private/tmp/procgen-p2-profile*` and `/private/tmp/proc-p2-*.txt`, outside git. Harness scripts never read personal saves.

### Applied design gates and limits

D1: Audit A1–A4 is delivered as one playable Village slice. Relevant deep cases are covered: trace split (SOURCE); unknown properties operate while unresolved data rejects (SOURCE and NATURAL); stable saved hidden method with feasible witness (SOURCE); consumed-source exposure restoration (SOURCE and NATURAL). Canon identity, living propagation, surface/assembly transforms, competing reactions and multi-step process order belong to adapters beyond this slice, not invented claims here. Exact ingredient roles and resolved family profiles are both used by this local law; no universal substitution rule is introduced.

D2: Old saves without the owner stay absent and preserve existing behavior. Invalid generated references/revisions reject before import writes. Literal-file preflight uses the actual rebuilt loader. No migration changes previous native consumables, crafting chance, food or world rules.

D3: Final acceptance remains split: source/tests and rebuilt playable technical proof pass for the stated journey; balance/taste and root integration remain open. [BACKLOG](BACKLOG.md) owns the unexercised routes and deferred scope.

## Defects found and corrected

R1: Early added imports changed native initialization order. They were merged into the existing import positions. Initial launcher referenced a nonexistent actions container; it now uses the supplied native host.

R2: Fresh Village time does not advance the expansion clock before enrollment. Jobs now use native calendar minutes. The native inventory loader also stripped generated keys through template reconstruction; a narrow reference-preserving branch now runs before that conversion for all component holders.

R3: The inventory guard initially parsed a mocked legacy test key, and the first exposure save lacked constructor defaults. The guard now leaves non-JSON legacy keys to their existing decoder, and the first staged exposure already contains its complete native defaults. The final full suite and persistence harnesses pass after these corrections. Earlier diagnostic runs are not counted as final proof.
