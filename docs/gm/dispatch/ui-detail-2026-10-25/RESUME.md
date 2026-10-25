# D1 G1 resume: remaining panel completeness

This supersedes the prior 17 source-only dispositions, not the original source/proof receipts. Scope is the original D1 overhaul on `codex/ui-detail-2026-10-25`, port 5101. Targets: 1920×1080 and 1440×900, native Gothic at 14px and the saved 21px preset. Mobile remains deferred. Changes remain proposals until Weibao plays them. No primary source writes, D4/cultivation merge, master merge, push or app adoption.

Rules: UR7/10/14/17/25/32/35/41/49/60/65–68, AR2/3/8, AD32/34/36/40/41. Native loaders, discovery presenters, quotes and commands retain authority. Fixtures below are explicit isolated prerequisites, not claims of natural acquisition. No sealed truth was supplied or save-integrity check bypassed.

## Per-surface final disposition

Each reached surface has paired before/after images at both desktop targets, at 14px and 21px, under `evidence/resume/{before,after}/`. Known routes has a reproduced missing-panel before view and an actual opened-panel after view. The other 15 compare the same opened native surface before and after. Unchanged surfaces were inspected and retain their existing presentation; source edits were made for concrete defects rather than to manufacture a visual difference.

| Code | Surface | Native route or declared prerequisite | Inspection and final disposition |
| --- | --- | --- | --- |
| G1-P01 | Skills (`skills`) | Public mid fixture, native save XP fields Cooking/Running/Perception = 1000, matching unlocked availability; native loader and All panels | Opened. Skill groups, progress, sort and empty categories inspected at both sizes. Prior 25 Cooking XP was insufficient fixture coverage, not a blocker. No additional source fix. |
| G1-P02 | Statistics (`statistics`) | Native `total_playtime=3600` saved prerequisite, All panels | Opened. Lifetime units, top skill table and no-materials state inspected; 21px remains internally scrollable with the return bar reachable. No additional source fix. |
| G1-P03 | Known routes (`known-routes`) | Native met-elder availability prerequisite, public parallel-entry terms chart, Choose independent Paradise entry, enter contractor district, personal Goa visit, All panels | Fixed and opened. Renderer previously deferred while its undiscovered parent was in the hidden workspace vault, preventing first discovery. It now computes the native read-only projection there. Existing exact commands, costs, disclosure and stale checks remain unchanged. Regression protects discovery from a hidden parent. |
| G1-P04 | Reading reference (`reading-reference`) | Native completed `ABC for kids` progress (loader caps to 120) with 120 matching book-owned Literacy XP | Opened. Completed-reading explanation and Journal/Bestiary route inspected. An earlier mismatched XP fixture was correctly rejected by the save/loading guard and was corrected, not bypassed. No additional source fix. |
| G1-P05 | Learned preparations (`learned-preparations`) | Declare 19 carried Golmoon leaves and one finite trader leaf; actual native trade purchase of the twentieth triggers the acquisition lesson | Opened. Recipe quantity, missing-station explanation and disabled review inspected. No direct lesson fact or recipe discovery was forged. No additional source fix. |
| G1-P06 | Carcass processing (`carcass-processing`) | Existing `createHarvest`, `drawSpecimen` and `addCarcass` factories create one public Wolf rat, 40 minutes old; native Butchering availability | Opened. Specimen count, condition uncertainty, method costs, processing controls and disabled reasons inspected. No additional source fix. |
| G1-P07 | Stock (`stock_view`) | Meet craftsman prerequisite and four carried logs; native field association begin, brace membership pays two logs + one coin + three played minutes, then native Meet Lio | Opened. Carried and companion holders, quantities, empty pack and loan controls inspected. Counts now explicitly say “item kind(s)”; transfer controls use the existing shared action-row grammar. No stock/loan behavior changed. |
| G1-P08 | Loadouts (`loadouts`) | Native equip of the fixture's existing Cheap leather pants, then All panels | Opened and fixed. Persistent visible name label replaces placeholder-only identification; checkbox sits beside its explanatory label instead of a detached full-width row. Keyboard Space toggles twice and retains focus. No loadout state or equip rules changed. |
| G1-P09 | Practiced actions (`practice-actions`) | Same native XP prerequisites reach level-one Running/Perception | Opened. Run/Investigate labels, pressed state, costs and local-search reason inspected. No additional source fix. |
| G1-P10 | Companions (`companions`) | Same actual association brace membership and native Meet Lio as Stock | Opened. Known temperament, condition, empty scene memory and bond actions inspected. Spacing uses shared action-row tokens through `.bond-actions`; primary D4's dirty companion renderer was not copied or edited. No bond behavior changed. |
| G1-P11 | Family (`family`) | `createChronicle(mortal)` with explicit age-80 test prerequisite, `advanceChronicle` at lifespan, `deriveHeirLeftovers`, `createHeirChronicle`; native loader | Opened. Two-generation tree, indent, predecessor age and kin link inspected. This is an owner-factory inherited-life fixture, not a naturally played lifetime. No raw lineage or ended-life flag fabricated. No additional source fix. |
| G1-P12 | World events (`world-events`) | Existing `createChronicle` factory supplies ordinary scheduled public invitations | Opened. Invitation timing/action, recent news and Life/Heard disclosures inspected. No event truth fabricated. No additional source fix. |
| G1-P13 | Status window (`status-window`) | `defaultCheatState`, `grantCheat(optionalStartCard)`, `awakenCheats(dayCount:3)` factories and native loader | Opened. Known stats/titles, zero points and no-quest text inspected. Explicit awakening prerequisite, not natural acquisition. No additional source fix. |
| G1-P14 | Hearthside clock (`place_clock`) | Fresh native Homes > homeowner start grants the owned cottage; All panels | Opened and fixed. Observer select now has a persistent visible label using the shared component. Ineligible release/reopen reasons remain readable. No time ratios, costs or ownership rules changed. |
| G1-P15 | Goa observer (`rank_gap_observer`) | Same native chart/independent-entry/personal-Goa route as Known routes | Opened and fixed. Method select gains a visible label. Known public watch quotes remain owner-projected; no watch was committed and no unresolved tier/truth supplied. |
| G1-P16 | Sect Library credit (`primordial_credit`) | Existing explicit localhost `?primordial_probe=1` host route, alongside `test_hooks=1` | Opened. Initial wallet, mission, request controls, empty debt/holding state and source/balance reference inspected. Probe-only prototype, not ordinary gameplay activation. No additional source fix. |
| G1-P17 | Optional worlds (`optional-worlds`) | `loadContentPacks` fetches `private_packs/manifest.json`; `createContentPackPanel` requires loaded definitions | **Blocked by external content.** Manifest returns 404 and no optional definition is loaded. Required input: schema-1 local manifest with `packs` entries such as an actual owner-supplied `<pack-id>/pack.json`, plus those exact pack files. Route after supply: native loader → Optional worlds → native enter/activity/return controls. No substitute pack or private content fabricated. |

## Defects and source fit

| Code | Defect / change | Source and fit |
| --- | --- | --- |
| G1-F1 | Known-route discovery waited on its own hidden parent | Native `known_routes_ui` and workspace discovery ownership. Fix is a read-only presentation calculation, not a new journey mechanism. UR10/14/49, AR3. |
| G1-F2 | Loadout name vanished when typing; checkbox was separated from its label | Existing D1 `labelControl` and shared token/component direction from the original source-absorption table. Reuses that component and spacing scale. UR7/32/65–68. |
| G1-F3 | Hearth/observer method controls depended on their selected value or accessible name to explain their purpose | Same shared visible-label component. Existing select options, owner methods and quotes are retained. UR7/14/32. |
| G1-F4 | Stock header's bare count had no unit; adjacent stock/companion action buttons touched | Native holder rows and existing shared action-row grammar. “Item kinds” describes distinct rows, not unit count or capacity. The CSS consumer preserves D4's concurrent companion changes. UR25/40/60/65–68. |

No new research, mechanic, token migration, private pack or world-state enumeration was added. The original Discord/itch/prior-audit source-fit ledger in CHECKPOINT remains the absorption authority for this D1 candidate. These changes complete existing panel/label/action/discovery ideas from that ledger. Prototype source/balance values were retained rather than presented as accepted rates.

## Verification boundary

The exact original full-run receipt remains in `evidence/verification.json`: **one `npm test`, 2879 tests, 2875 passes, four sandbox `listen EPERM 127.0.0.1` failures**. The three affected files then passed 9/9 with reviewed local-server access. That full run preceded the original late navigation/spill changes, which had 53 focused checks. It does not claim to cover this later G1 source commit. No second full run was made.

- `node --test tests/ui_components.test.js tests/ui_contract.test.js tests/owned_place_clock.test.js tests/rank_gap_observer.test.js`: 24/24 pass for the control/observer slice before the final shared CSS adjustment.
- `node --test tests/known_routes_ui.test.js tests/known_routes.test.js tests/companion_bond_rite.test.js tests/stock_view.test.js`: 21/21 pass after route/stock fixes, including the new hidden-parent regression.
- `node --test tests/ui_contract.test.js`: final 3/3 pass after using `.bond-actions` as a CSS consumer to avoid the primary renderer overlap.
- `npm run build`: final committed runtime built; artifact hashes and source identities are in `evidence/resume/source-inputs.json`.
- `npm run check:arch`: pass, main 10113/10115, display 6724/6767, save 310/310; grandfathered cycles unchanged.
- `npm run check:rules`: pass, 22 register rows, 41 AD codes, 125 links, zero warnings.
- Rebuilt browser: final result recorded in `evidence/resume/verification.json`; 14px/21px and both desktop targets, native panel opening, page bounds and affected controls. Original proof is preserved separately.

No persistence behavior changed. The fixtures use native load/validation and existing durable commands; the original qualified Save/reload/Export/literal Import evidence is retained, not represented as a new G1 persistence run.

## M4 and remaining gates

Runtime source commit: `0ae4203522b7a3b1dbcb20e3c9616d034e5bdcb9`. This resume edits only `known_routes_ui`, `loadouts`, `owned_place_clock_panel`, `rank_gap_observer_domain`, `stock_view_ui`, shared `styles/ui_tokens.css`, and its focused test. It does not copy primary files. Primary has dirty changes in `companion_roster`; this resume deliberately leaves that file byte-identical to its lane parent and adds spacing through CSS. New label wrappers and route-discovery logic are small local hunks; integrate them as hunks if primary owners have advanced. The original seven primary overlaps, including Mistglass, remain listed in CHECKPOINT. Dirty cultivation and active D4 are not merged.

Remaining combined gate: coordinator reconciliation of this branch with the concurrent owners, then combined integration verification. Remaining product gate: Weibao's play/taste acceptance of the complete D1 proposal. Optional-world runtime inspection additionally needs the exact absent manifest/pack inputs above. No new follow-up dispatch is requested.
