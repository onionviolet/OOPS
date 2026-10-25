# All saved reference mechanics, 2026-10-25

Authority: Weibao requested “Implement the fitting missing mechanics from various stuff using our existing systems, all of them” and clarified the source scope as “everything”. Scope is all saved game, book and mod reference-mechanics audits, deduplicated against actual native owners. This authorizes local implementation. No commit, push, publication or app adoption is selected.

Rules: MAW0–7; AD1/3/5–8/15–19/22/32–38/41; AR1–16; MR1–36; relevant domain rules; UR1–69. Existing source-evidence boundaries, world-specific mechanisms and sealed discovery routes remain distinct. A reference comparison is not automatically a runtime defect or a requirement to copy its whole game.

## Ownership and sequence

The active chat “Check cultivation game absorption” owns the CG01–CG29 implementation and its reserved native crafting, carry, household and cultivation files. Its existing checkpoint remains authoritative for delivery evidence. This chat will not duplicate those implementations or edit their reserved areas. Other same-day work retains its owners.

First slice reservation: new `src/craft_material_fit.js`, new `src/native_rendering_recipes.js`, one registration hunk in previously clean `src/crafting_recipes.js`, focused tests and this task's records. Primary checkout, no new worker or worktree. Existing recipe admission, transaction, inventory, work ledger and save writer remain owners. No root-file edits planned.

First slice: physical/functional ingredient fit connects the native catalogue to ordinary cooking. Deliberately selected alternative known meat sources render the existing Animal fat item at source-dependent input quantities. The original Boar meat recipe is unchanged. Quantities and catalogue physical values are original gameplay proposals, not nutritional measurements or canon claims. Existing downstream recipes consume the actual result.

UI: existing cooking list and detail at desktop 1920×1080, plus 1536×864 at 14/21px. Visible outcome: known source, exact quantity, native crafting, consumed stock and usable output agree. Mobile remains deferred.

Verification selected before implementation: current Animal fat gate and recipe result; trait fit admission and graded required quantity; unknown-source suppression; exact per-source spending with no fallback; existing native crafting rollback/persistence. Focused native recipe regressions, isolated rebuilt browser use and native Save/reload/Export/literal Import, then build/architecture/rules and the final combined full-suite gate. An engine helper alone does not close the playable slice.

## Coverage

The source inventory will freeze saved audit locators and hashes, not declare every candidate implemented. Each unique candidate needs an explicit existing, active-owner, implemented, unsuitable-with-reason, source-unknown or remaining disposition. “Large” is not an exclusion. This checkpoint is in progress; all-source closure is not claimed.

## First playable slice: native source contribution

Source implemented in `src/craft_material_fit.js`, `src/native_rendering_recipes.js` and the existing recipe registration. The catalogue gains a live consumer without another material/inventory/clock owner. The source-dependent recipes share the original learned method, stay hidden until their source is encountered and deliberately consume the selected species. Goat needs four units; Crab and Frog need ten; original Boar remains three. These are authored original quantities. Partial contribution changes paid quantity, not a canon identity, potency or hidden property. No whole-formula or symbolic similarity claim.

Checks and evidence:

- `node --test tests/native_rendering.test.js tests/native_material_bridge.test.js`: PASS 6/6. Admission/knowledge, graded contribution, conservative source quantities, original recipe preservation, shared method, exact-source availability and read-only quotes.
- `node build.js` in the frozen isolated preview: PASS. Bundle SHA-256 `4c10391f2855a34e53463174f5ac6f009766c93dc83ea868ba89cdff5958f7ad`; source hashes in `INPUTS.json`. Initial copy omitted stories, locales and the player-agency JSON contract; copied these build inputs and rebuilt successfully. Shared primary `dist/` and `index.html` were not overwritten.
- `rendering.cjs`: PASS, private `native-rendering-Kl9gcQ/`. Real reading of the existing books unlocks both methods; known Goat source spends exactly four, leaves Boar untouched, produces native Animal fat, survives native Save/reload/Export/literal Import and is then consumed by the real Healing balm recipe. Existing skill and ordinary book/ingredient stock are labelled fixture prerequisites. First run's downstream Alchemy attempt could fail at its low skill; the corrected fixture supplies ordinary Alchemy competence and does not grant any crafted result.
- `rendering-layout.cjs`: PASS, private `rendering-layout-haQbiJ/`. All six 1920×1080, 1800×1040 and 1536×864 at saved 14/21px preferences; visible exact source/cost and reachable craft control. Primary and 21px floor screenshots visually inspected. Uses the earned output prefix and changes presentation preference only.
- `npm run check:arch`: PASS, no new cycles and no root-file growth. `npm run check:rules`: PASS, existing WORLD_PASS_RULES and new uncommitted checkpoint warnings. `npm run check:rule-behavior`: PASS 36/36. `git diff --check` on touched tracked paths: PASS.
- `npm test`: 3,029 pass, one failure. `tests/lotm_pathway_rows.test.js` cannot import the retired `LOTM_ASSESSORS` export. This is independently recorded U3 in the active C5/G1 reconciliation. C1's `99d3a202b` contains its correction; it has not landed on primary. Do not edit or delete another lane's test or rerun the full suite before that input changes. This primary dirty-tree run is not a certified frozen combined release.

Private evidence root: `/Users/weiwei/.codex/research/reference-mechanics-2026-10-25/`. Preview: `http://127.0.0.1:19525/`, server PID 55105, tool session 21321; exact private directory in `INPUTS.json`. The preview has isolated browser storage. No personal save was read or changed. Human pacing/taste, normal-app adoption, commit and publication are not claimed.

## All-source continuation and active ownership

`SOURCES.json` is an initial nonignored discovery index: 427 saved audit/packet/coverage/palette documents and 6,282 table-code locators. Locators repeat across sources and are not 6,282 missing mechanics. Private raw sources and duplicated historical snapshots are excluded from this locator index. The full candidate-level semantic crosswalk and implementation remain open; filename indexing does not complete either.

| Track | Existing owner / current boundary |
|---|---|
| Native ingredient contribution | This first slice. General formula matching, symbolic/foreign compatibility, potency/risk grading and further native process consumers remain open; MIE-G1 is partial, not closed. |
| CG01–CG29 cultivation, carry and households | Active [cultivation checkpoint](../cultivation-absorption-2026-10-24/CHECKPOINT.md), including its pending browser/combined gates and U1/U2/U4 follow-up. Do not duplicate its writes. |
| LOTM worlds and brewing | Active [C1 and subsequent coordinator status](../codex-parallel-2026-10-25/README.md). Prior limited potion/signature-loop receipts do not certify all pathways or worlds. |
| HP world | Active [D7](../codex-parallel-2026-10-25/D7_hp_world.md). This chat leaves its world-pack area with that lane. |
| UI/reference presentation, engine seams, cheats and agentic work | Active D1/D2/D4/D6 in the same [wave owner](../codex-parallel-2026-10-25/README.md); their branch work and later integration retain separate gates. |
| Remaining ideas and saved audit crosswalk | [D5](../codex-parallel-2026-10-25/D5_ideas_left.md) owns the comprehensive idea inventory and ranked next-buildable list. This machine locator inventory supplies discovery pointers only and is not a competing backlog. D5 is docs-only; its list does not itself deliver the remaining mechanics. |
| Minecraft and recovered-reference families | Existing [MF](../minecraft-fit-2026-10-21/CHECKPOINT.md) and [recovered coverage](../title-rules-implementation-2026-10-21/COVERAGE.md) retain their bounded deliveries. Wider spatial, environmental and other source variants require current-code reconciliation, not a blanket done label. |

Ownership release for this first slice will be explicit after the remaining Crab/Frog and quota native checks. No other file area is claimed. The broader “everything” request remains open under these owners; this slice is not all-source closure.

### Variant proof and ownership release

`rendering-variants.cjs`: PASS, private `rendering-variants-kpfNyC/`, same frozen bundle. Crab spends exactly ten for one actual fat; Frog with nine refuses even through the direct native command and leaves Goat/Boar stock untouched; adding one labelled ordinary Frog unit permits exactly one native attempt. Both results pass native Save/reload/Export/literal Import. A forced quota failure restores the prior Crab stock/output before the successful attempt. The first variant driver used a broad selector matching both Cooking and the separate Village experiment button; narrowing it to the Cooking detail fixed the driver without a runtime change.

All three selected source variants now have rebuilt native action proof. `OWNED_INPUTS.json` records current owned hashes: the three runtime implementation files match the browser snapshot exactly; `native_material_catalogue.js` differs only in its header comment announcing the new consumer. Its data is unchanged. The first slice is technically delivered in primary source and the isolated rebuilt preview, with human acceptance and the combined U3 integration gate still separate.

Runtime write ownership for this slice is released. No files are staged or committed by this task. The all-source semantic crosswalk and subsequent fitting mechanics remain open with the comprehensive D5/G1 queue and the named active implementation owners above. Do not represent the locator inventory, this one delivered process or the other lanes' running status as implementation of every saved mechanic.
