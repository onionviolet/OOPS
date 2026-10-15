# LP4 care proposal

The player can obtain a sheltered meadow pen and one fleece sheep, buy and spend actual hay, brush the sheep, collect finite wool and use it in the existing Wool cloth recipe. Rebuilt desktop care, useful product consumption, away policy and native persistence are verified on **http://127.0.0.1:8202/** at **1366×768**. The consumer check uses a labelled prior crafting context, described below. The remaining acceptance gate is **Weibao's play and taste**.

2026-10-14. Original reversible PROPOSAL, authorized by Weibao's LP2–LP8 dispatch. Fiction, rates and prices are not director-accepted. No new world or prestige layer. Authority: [LP4 row](IMPLEMENTATION_PACKETS.md), [P4 habitat extension](../hogwarts-games/IMPLEMENTATION_PACKETS.md#p4-a-study-workroom-supplies-a-real-task), [care digest](CARE_TO_CRAFT_DIGEST.md), [desktop priority](../../USER_VISION.md#standing-ui-priority-2026-10-13). `LP_COMMON.md` was absent; its supplied prompt was followed. Weibao's port-fix addendum explicitly reassigns LP4 from 8197 to **8202**.

## Play route

Village → Local actions → **Meadow pen · care proposal**. Ownership, welfare, care and harvest have separate visible rows. The native 1366×768 screenshots show the pen's routine controls together in the Local actions panel, with no horizontal page overflow. Policy prose expands separately. Mobile optimization, breeding, extra habitats/species, another world and another progression layer remain deferred.

- **A1:** **Obtain sheltered pen · 18 coins** buys a one-place drained grass pen, shelter and clean-water access. It grants no animal, feed or product.
- **A2:** **Adopt fleece sheep · 12 coins** binds one actual sheep to the player and that owned pen. Adoption grants no ready harvest.
- **A3:** **Buy 1 Meadow hay · 2 coins**, then **Feed sheep** and **Brush and inspect sheep**, in either order. Feeding removes one carried bundle. Neither care fact alone produces wool.
- **A4:** Allow six overlapping supported played minutes, then **Collect ready wool · 5 Wool**. Only one batch waits. Collection resets care and readiness; another batch needs another finite ration and attention.
- **A5:** With the existing craftsman's Crafting unlock, choose **Try to craft something → Tinkering → Items/trinkets → Wool cloth**. A native attempt consumes five Wool and obeys existing skill, station and success chance. Cloth supplies existing wool clothing recipes. The pen's instruction now names the visible Tinkering tab correctly.

## Authored care and away policy

**D1:** Welfare is a separate persisted animal fact, `sheltered_safe`. Its suitable pen provides shelter and clean water. Routine care can lapse without instant injury, death, debt or a hidden penalty. Welfare is not a substitute for feeding, attention or readiness.

**D2:** Feeding and attention each last 12 native played minutes. Production accumulates only during their overlap. Partial progress pauses when support lapses and can resume after new care. Readiness is capped at one six-minute batch and survives expired care. Inspection and time never add inventory; only validated collection does.

**D3:** The existing open-game native calendar applies while working or travelling elsewhere. Closed-game wall time adds no care or production. There is no offline feed consumption, harm, automatic collection or catch-up stock. Rendering projects supported native minutes without mutating stock. No independent clock or scheduler was added.

## Files changed

| File | Change |
|---|---|
| `src/habitat_care.js` | Optional ownership/care record, pure native-calendar projection, validation and finite action plans. |
| `src/habitat_care_ui.js` | Village panel, separate facts, unavailable reasons, explicit policy; addendum corrects the crafting tab label. |
| `src/main.js` | Native read/action/save/load/panel hooks using existing craft transactions and guarded save storage. |
| `src/items.js` | One native Meadow hay material. Product remains existing Wool. |
| `src/save_files.js` | Validate optional pen state before save/import mutation. |
| `tests/habitat_care.test.js` | Eight care, ownership, compatibility and rollback checks. |
| `lp4-evidence/` | Three browser drivers, result records and nine 1366×768 screenshots. Raw save/export fixtures remain temporary and are not committed. |

Initial implementation: `6648fd570a934c6c9339e665fdc85bf4c0722f7c`. The addendum changes only a player-facing tab label in runtime source; care, inventory, prices, timers, recipe mechanics and save schema are unchanged. No push or merge. Current generated `dist/bundle.js`, `dist/bundle.js.map` and index fingerprints are left locally built, uncommitted, so 8202 remains playable. Source, report and evidence are committed separately from those build artifacts.

## Checks and evidence

Current rebuilt and served bundle SHA-256: **`bbb7321af4ed38183c1c06ae4e034c330bfc3ef5e2b8b25ad93753fb719cc975`**. Browser drivers check served bytes against the local build before play. Screenshots below were inspected after the final label correction.

| Code | Check | Exact result and scope |
|---|---|---|
| V1 | `npm run build` | PASS after the addendum's label correction. Ink check: zero diagnostics. Current source rebuilt and served from this worktree on 8202. |
| V2 | `node --test tests/habitat_care.test.js tests/save_files.test.js tests/native_craft_transaction.test.js` | PASS after the label correction: **19 tests**, zero failures/skips/TODOs; includes eight LP4 checks. |
| V3 | Initial `npm test` | Historical implementation pass: 1,401 tests, 1,398 passed, zero failed, three inherited TODOs. |
| V4 | Final implementation `npm test` | **1,402 tests, 1,399 passed, zero failed/cancelled/skipped, three inherited TODOs**, exit 0, 621,049.610334 ms. This full regression preceded only the addendum's one-string tab-label correction. Gameplay logic and save schema have not changed since it. V1/V2 and current browser checks cover the addendum; the unrelated full suite was not repeated for that label. |
| V5 | `node docs/research/hogwarts-legacy/lp4-evidence/browser.cjs` | PASS on the current build: **eight native care/persistence groups**, fresh origin, 1366×768, no page errors or horizontal overflow. [Result](lp4-evidence/browser-results.json). |
| V6 | Browser-driver syntax checks | PASS for `browser.cjs`, `consumer.cjs` and `continue-import.cjs`. Syntax is separate from native evidence. |
| V7 | First fresh `consumer.cjs` run | PASS on the current build: **five policy/consumer groups**. Two actual attempts consumed ten earned Wool and produced one Wool cloth; no page errors or horizontal overflow. [Result](lp4-evidence/consumer-results.json). |
| V8 | `continue-import.cjs` with V7's exact earned checkpoint | PASS: **three continuation groups**. Fresh writable origin, exact earned stock retained, another paid hay purchase, another actual Export/literal file Import and enabled post-import controls. [Result and checkpoint hash](lp4-evidence/continued-import-results.json). |
| V9 | Additional fresh chance replay | **Budget-stopped**, not counted as a passing output test: 24 ordinary native recipe failures spent 120 earned Wool and produced no cloth. No page errors, no replacement stock or recipe changes. [Exact outcomes](lp4-evidence/chance-replay-results.json). The 24-attempt limit belongs only to the harness. V8 continued V7's already-earned positive checkpoint, rather than rerolling V9. |

V5 demonstrates an old absent state surviving native Save/reload/Export/literal Import without invented pen assets; paid site and animal acquisition; missing-feed refusal; actual finite feed consumption; no production while unattended or merely fed; exact pending persistence; ready wool surviving expired care while welfare stays safe; and exact collected-state import without reissuing wool.

V7 closes its disposable context for eight real seconds, longer than a six-minute production cycle at the ordinary native rate. Reopening the same saved browser state retains the exact pen and zero wool, with no wall-time catch-up. A subsequent normal Village departure, travel and brief field visit advance the actual native calendar; returning shows ready wool despite expired care, with safe welfare. No full combat clear is claimed or required for LP4.

**Consumer fixture boundary:** V7 changes only the pre-existing `global_flags.is_crafting_unlocked` flag, through a literal file import, to supply prior crafting eligibility. It verifies that this setup preserves native inventory, money and the earned pen exactly. No hay, wool, cloth, money, XP, animal, progress or collection count is injected. Native crafting itself then consumes the actual habitat Wool, awards its ordinary XP and produces the existing cloth. Acquisition of the craftsman's unrelated unlock is not an LP4 gate. Existing low-level recipe chance remains unchanged, including V9's unsuccessful outcomes.

V8 imports V7's actual earned checkpoint into a fresh writable origin, then buys another hay bundle for two coins. Wool stays zero, cloth stays one and collection count stays two. A subsequent real Export/literal file Import retains that new hay and the old earned output; saving and pen controls remain available. It does not replay collection or replace spent materials.

### Desktop screenshots

| Evidence | Visible result |
|---|---|
| [01 unattended](lp4-evidence/01-unattended.png) | Owned suitable pen and sheep; no feed, attention or free wool. |
| [02 pending](lp4-evidence/02-cared-pending.png) | Actual paid care and pending harvest. |
| [03 expired care, ready harvest](lp4-evidence/03-ready-care-expired.png) | Safe welfare, missing care and ready wool coexist. |
| [04 collected/imported](lp4-evidence/04-collected-imported.png) | Exactly one batch retained after import. |
| [05 closed-game return](lp4-evidence/05-offline-resumed.png) | No offline stock or readiness catch-up. |
| [06 return from field](lp4-evidence/06-away-ready.png) | Open-game travel advances the native care window and production. |
| [07 native chance failure](lp4-evidence/07-native-wool-consumer.png) | Ordinary material-consuming recipe failure in the additional replay. |
| [08 writable imported pen](lp4-evidence/08-consumer-imported.png) | One paid hay, one cloth, zero wool and exactly two collected batches. |
| [09 earned consumer context](lp4-evidence/09-earned-consumer-context.png) | Existing Wool cloth recipe and actual earned cloth after import. |

## Save compatibility decision

Optional top-level `meadow_pen`, schema 1, policy `played_care_v1`. Absence remains absent: no pen, animal, feed, wool, debt or invented history on old saves. No native save version bump or migration is needed. Unsupported schema/policy, wrong ownership/site, impossible counts and future care timestamps reject before import writes. Unit/native-envelope checks and V5's actual old-state reload and literal Import cover that decision.

Native inventory is the only hay and wool stock owner. The optional pen stores its site/animal, dated care, bounded production and collection count. Accepted actions stage a pure result, commit native stock/money through the existing rollback boundary, validate the full envelope and write durably. Storage-failure rollback is source-tested. V5/V7/V8 separately establish actual pending, collected and consumed-product native persistence, with no duplicated stock or rewards.

## Checkpoint and remaining gate

**B1 resolved:** the earlier dispatch mistakenly assigned LP4 the active LP1 port, 8197. That server was left untouched; LP4's attempted bind failed and started no server there. Weibao's later addendum authorized **8202**. LP4's own Python server serves this worktree on 8202. The original blocker and hashes remain in the preceding report commits; they are historical, not current acceptance blockers.

**U1:** No required LP4 technical acceptance item remains implemented-unverified. The prior crafting eligibility is explicitly controlled; its acquisition route, mobile layout, extra species, breeding and prestige are outside this slice. Broader policies such as absent simulation in another realm have not been added as acceptance requirements.

**Next pending item:** **Weibao's play and taste**, including prices, six-minute production, care cadence and the existing probabilistic consumer. No director acceptance is claimed. The slice remains a labelled proposal in the current world.

## Merge risks

**R1:** Base merge point: `8856718da359ad61ffe7e690a87b95e1eb36e31b`. Latest inspected `codex/gameplay-foundations`: `83394625971342eb9b77b4a9cf6903a41731a170`. Its committed range now changes `src/main.js` by eight additions/five removals, including adjacent harvest and panel mounting areas. `src/items.js` and `src/save_files.js` have no committed changes in that range. The branch can advance; inspect it again when merging. No main-checkout file was edited.

**R2:** Siblings can touch the same three host files, especially imports, save/load and panel mounting. Retain each hook once. LP4 modules and `meadow_pen` are isolated. Keep native Wool as the product, existing crafting gates/odds intact and pen counters separate from inventory. The addendum's runtime edit is one instructional label, with no host-shell reformatting.

**R3:** Rebuild the integrated branch after reconciliation. Do not merge local generated bundles over sibling builds or mistake another origin's bytes for LP4. The controlled consumer context, completed native checks, source test counts, commits and director taste are distinct evidence layers.
