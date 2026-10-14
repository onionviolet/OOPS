# LP4 care proposal

The player can obtain a sheltered meadow pen and one fleece sheep, buy and spend actual hay, brush the sheep, and collect a finite wool batch. Wool uses the existing Wool cloth recipe. The implementation is committed on `codex/hl-lp4`; native browser acceptance is currently BLOCKED by the port collision described below. This is implemented-unverified gameplay, not a completed LP4 acceptance claim.

2026-10-14. Original reversible PROPOSAL, authorized by Weibao's supplied LP2–LP8 dispatch. No new world or prestige layer, and no accepted taste or balance decision. Task authority: [LP4 acceptance row](IMPLEMENTATION_PACKETS.md), [P4 habitat extension](../hogwarts-games/IMPLEMENTATION_PACKETS.md#p4-a-study-workroom-supplies-a-real-task), [care digest](CARE_TO_CRAFT_DIGEST.md), [standing desktop direction](../../USER_VISION.md#standing-ui-priority-2026-10-13). `LP_COMMON.md` was absent from this worktree; its full supplied prompt was followed.

## Play route

Target: **1366×768 desktop**, in the current Frontier world. Village → Local actions → **Meadow pen · care proposal**. The source presents ownership, welfare, care and harvest as distinct rows, with expandable policy text. Desktop fit remains unverified. Mobile optimization, breeding, extra habitats/species and another progression layer are deferred.

- **A1:** Choose **Obtain sheltered pen · 18 coins**. This buys a one-place drained grass pen, shelter and clean-water access. It grants no feed, animal or product.
- **A2:** Choose **Adopt fleece sheep · 12 coins**. The actual sheep is bound to the player and that owned pen. Adoption grants no ready harvest.
- **A3:** Choose **Buy 1 Meadow hay · 2 coins**, then **Feed sheep** and **Brush and inspect sheep**, in either order. Feeding removes one actual carried bundle. Neither care fact alone produces wool.
- **A4:** Allow six overlapping supported played minutes, then choose **Collect ready wool · 5 Wool**. At most one batch waits. Collection resets care and readiness; another batch needs another finite ration and attention.
- **A5:** After learning Crafting from the existing craftsman, open **Crafting → Crafting → Wool cloth**. Each native attempt consumes five Wool; existing skill, station and success chance apply. The existing cloth supplies wool clothing recipes. This consumer is source-connected and has not yet been exercised with habitat wool in a browser.

## Authored care and away policy

**D1:** Welfare is the animal's separate persisted `sheltered_safe` fact. Its suitable pen provides shelter and clean water. Routine care can lapse without instant injury, death, debt or a hidden penalty. Care status is not used as a substitute for welfare or readiness.

**D2:** Feeding and attention each last 12 native played minutes. Production accumulates only during their overlap. Partial progress pauses when support lapses and can resume after new care. Readiness is capped at one six-minute batch and survives expired care. Time and inspection never add inventory; only a validated collection does.

**D3:** The existing open-game native calendar applies while working or travelling elsewhere. Closed-game wall time adds no care or production. There is no offline feed consumption, welfare damage, automatic collection or catch-up stock. Saves retain timestamps and progress; rendering projects elapsed supported native minutes without mutating stock. No new scheduler or independent clock was added.

## Files and implementation

| File | Change |
|---|---|
| `src/habitat_care.js` | Optional typed ownership/care record; pure calendar projection, validation and finite action plans. |
| `src/habitat_care_ui.js` | Village panel; separate ownership, welfare, care and harvest rows; explicit unavailable reasons and policy. |
| `src/main.js` | Small native read/action/save/load/panel bindings; existing native craft transaction and guarded save storage. |
| `src/items.js` | One actual native Meadow hay material. Product remains the existing Wool item. |
| `src/save_files.js` | Validate the optional pen before save/import mutation. |
| `tests/habitat_care.test.js` | Eight care, ownership, compatibility and rollback checks. |
| `lp4-evidence/browser.cjs` | Rebuilt-byte guard and prepared desktop care/persistence harness. It still needs an unoccupied assigned port and actual execution. |

Implementation commit: `6648fd570a934c6c9339e665fdc85bf4c0722f7c`. No push or merge. Generated `dist/` and index fingerprint changes were restored after the successful build to keep the branch limited to source and the report. Rebuild before serving; V1 identifies the built candidate, not the restored checkout's bundle.

## Checks and exact limits

| Code | Check | Result |
|---|---|---|
| V1 | `npm run build` | PASS. Ink artifact check: zero diagnostics; bundle and source map built. Final candidate bundle SHA-256: `96e987c6c4df120a40f04d4d5889ce0483ab862eec8fb27bc10f93e7c682766a`. This is a local build hash, not served or played proof. |
| V2 | `node --test tests/habitat_care.test.js tests/save_files.test.js tests/native_craft_transaction.test.js` | PASS: 19 tests, zero failures, zero skips/TODOs. Includes eight LP4 checks. |
| V3 | Initial `npm test` | PASS: 1,401 tests, 1,398 passed, zero failed, three pre-existing TODOs. This preceded the final explicit welfare-field/compatibility test refinement, covered by V2. |
| V4 | Final `npm test` | PASS on the final source revision: 1,402 tests, 1,399 passed, zero failed/cancelled/skipped, three pre-existing TODOs. Duration: 621,049.610334 ms. Exit 0. Local output: `/tmp/hl-lp4-full-final.log`. |
| V5 | Prepared desktop harness | STOPPED at the served-byte guard: port 8197 serves LP1's bundle, not LP4's. No LP4 browser interaction or screenshots were claimed. |
| V6 | `node --check lp4-evidence/browser.cjs` | PASS. Harness syntax only, not gameplay proof. |

No unrelated failures were repaired. The three full-suite TODOs are inherited and are not failures.

## Save compatibility decision

Optional top-level `meadow_pen`, schema 1, policy `played_care_v1`. Absence remains absent; old saves receive no pen, animal, feed, wool, debt or fabricated history. No native save version bump or migration is needed. Unsupported schema/policy, wrong ownership/site, impossible counts and future care timestamps reject before import writes. The existing file encoder/decoder roundtrip is covered by V2, including an unchanged old envelope.

Native inventory remains the only hay and wool stock owner. The pen saves only its site/animal, dated care, bounded production and collection count. Each accepted action stages a pure result, commits native stock and money through the existing rollback boundary, validates the full envelope and writes durably. A storage failure restores the native owners and pen. Generic transaction rollback and the pen's boundary are source-tested. Actual pending/collected Save, reload, Export and literal file Import remain implemented-unverified until the browser gate runs.

## Port blocker and remaining evidence

**B1:** Both lane dispatches explicitly assign **8197**. The existing listener is Python PID **80125**, serving `.claude/worktrees/hl-lp1`, owned by still-active LP1 worker **74049** when checked. Its dispatch also says “8197 only.” Starting the required LP4 server failed with `OSError: [Errno 48] Address already in use`. The LP4 byte guard independently observed served SHA-256 `b52590edc6fd377de42bf9b6e3426ba323c6dc8db6b7d484d262a730cd05c78f`, which differs from V1. The sibling process and worktree were left intact. A different port or an explicit sequential port handoff is required. The user was asked which port to use; no answer has been assumed.

**U1:** No rebuilt LP4 browser run, screenshots, native care comparison, physical input/consumer exercise or literal Import has been completed. V2's pure/native-envelope tests do not substitute for them. Native away-travel and closed-browser behavior also need exercise against the authored policy. The prepared harness covers care and persistence, not the later native crafting consumer or an away-travel route.

Once B1 is resolved, rebuild and serve this worktree on the resolved assigned port. Run `node docs/research/hogwarts-legacy/lp4-evidence/browser.cjs` from the worktree (`LP4_URL` can select an explicitly reassigned origin). Complete and record the real Wool cloth consumer, away/offline checks and screenshot review. The browser acceptance column must pass before LP4 is considered gate-passing. After those technical checks, the remaining human gate is **Weibao's play and taste**.

## Merge risks

**R1:** Base merge point is `8856718da359ad61ffe7e690a87b95e1eb36e31b`. `codex/gameplay-foundations` was inspected at `0a29d134b3c6f700839edaac68314d1427dab494`; that committed range had no changes to LP4's three shared source files. Its live branch can advance during sibling work. No main-checkout file was edited.

**R2:** Sibling lanes may touch `src/main.js`, `src/items.js` and `src/save_files.js`, especially adjacent imports, save/load and panel mounting. Keep each hook once when merging. LP4-specific modules and `meadow_pen` are isolated. Do not rename or duplicate Wool, bypass existing crafting gates, or turn pen counters into native inventory during reconciliation.

**R3:** Rebuild the integrated branch after reconciliation. Do not copy LP4's generated bundle over siblings' bundles or mistake another lane's served origin for this source. Native UI/persistence acceptance and director taste remain distinct from the source checks and commit.
