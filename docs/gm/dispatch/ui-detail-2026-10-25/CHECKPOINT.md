# D1 desktop UI overhaul, 2026-10-25

Status: implemented and committed branch candidate; canonical evidence/index verification complete within the published coverage. All presentation choices remain proposals until Weibao plays and accepts them. No merge to master, push, installed-app adoption or human acceptance is claimed.

Branch `codex/ui-detail-2026-10-25`, worktree `~/.codex/worktrees/ui-detail/yet-another-idle-rpg`, starting/current master `3dfc49cf3`. `git merge --no-edit master` returned **Already up to date**. The primary checkout's dirty work is excluded.

## Outcome and authority

Target: **1920×1080 and 1440×900 desktop**, including Mistglass, workshop, household/manor, combat, continuation and Reports. Mobile layout is deferred. Weibao's later addition authorizes an overhaul and fitting reference absorption; the earlier polish-only wording is not the scope boundary.

Live owners: [UI rules](../../../UI_RULES.md), [player UI rule](../../../../.claude/rules/player-ui.md), [UI design owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md), [standing UI priority](../../../USER_VISION.md#standing-ui-priority-2026-10-13), [PROJECT UI modularity round](../../../../PROJECT.md#ui-modularity-round-2026-10-22). Existing UM3/4/5/8/9 delivery, region lending, Gothic strikes, saved appearance choices, the full-height log and shared center controller are baseline, not newly delivered work.

Rules: UR1–UR69, especially UR6/7/9–17/25/32/33/40–49/59–68; AD32/34/36/40/41; AR1–AR16. Presentation seam: panel-owned renderers, existing `meter_bar`, shared `ui_components` and new `ui/panel_sections`, shared token stylesheet. No new gameplay clock, roll, save slice, rates, reward, currency or eligibility authority.

## Changes and evidence

| Code | Change / player consequence | Rules and proof |
| --- | --- | --- |
| D1-C1 | Disabled reasons retain prior subject/cost descriptions, follow moved buttons, share note identity across nested decorators and retire orphan notes | UR7/17, AR3. Regression reproduced the overwritten description, then passed moved/enabled/removed/nested cases. Commit `6ca574a6`. |
| D1-C2 | Shared section, visible field-label and quoted-action components feed Mistglass and workshop. Repeated blockers appear once per group; unavailable alternatives remain inspectable | UR6/7/41/65–68, AR3/8/11. Disabled actions cannot activate; selected methods remain focusable with `aria-disabled` and preserve focus through redraw. Initial component/panel commit `e36f2bf9`; later refinements follow it. |
| D1-C3 | Workshop reads **choose gear → plan work → review/apply**, with labeled inputs, honest supported-gear empty copy, stable selected subject and disclosed local repair/hide work | UR7/10/14/32/41/63. Existing quotes/commands remain owners. Simple clothing is explained instead of being called missing carried equipment. Paired `journeys/workshop-*`. |
| D1-C4 | Mistglass separates visit/learning, local reserve, method practice, trial stakes, sluice, precise path work and history. Owner-fed pool/track meters show different deciding quantities. Secondary rates/history disclose locally | UR14/33/40/41/59–63. Actual entry, learning, method selection, played practice and reload; paired `mistglass-*`. No hidden history is newly revealed. |
| D1-C5 | Homes has direct Household/Storage/Furnishings/Rooms links, grouped people/readiness, teaching, family request, pantry and office content. Reasons are separate readable blocks; staff effort is an existing-state meter | UR7/14/25/32/41/65–68. Actual ducal manor start, household disclosure and focused shortcut; paired `manor-*`. Rights, appointments, supplies and wages are unchanged. |
| D1-C6 | Connection has a discovered route (Alt+Y), opens on anchors/study, names the chosen destination and dates in Return, gives confirmation a title and restores focus on cancellation. In-flight command feedback prevents repeated UI activation | UR5/9/10/14/35/41/52, AR3/7. Uses the existing continuation owner and gate. Actual tabs, review and cancellation; paired `connection-*`. No starting-menu redesign or return entitlement is added. |
| D1-C7 | Native trade controls use buttons; totals and settlement controls stay visible. Coupon/standing explanations share a stable Price details disclosure, instead of stretching the footer into thin text columns | UR7/11/25/35/41/63. Actual native trade, keyboard Cancel and shared Village return; paired `trade-*`. Existing quote, coupon and settlement functions remain authoritative. |
| D1-C8 | All panels and overflow shortcuts have distinct labels. Overflow now reserves the final shortcut-label width before folding, preventing the panel picker from clipping at laptop width | UR10/14/27/52/60. Browser regression checks picker bounds against its clipped parent, plus full shortcut-label readability. |
| D1-C9 | Shared spacing/control/type consumers, tabular numeric roles, quiet prose, hover/focus/pressed states, role-based affordance/active/discovery light and motion tokens apply across panels. Existing rarity treatment remains separate. Mixing joins the native routine-row grammar | UR6/7/11/38/44/60/65–68. Full-height Reports retained. OS reduction, effects off/reduced, high contrast, actual font loading, native hover, 21px and explicit player overrides exercised. Existing `corc_readability` synthetic-bold removal is reused, not claimed as new. |
| D1-C10 | Native shield backing readout drops the stray `2345` suffix and names block strength on inspection | UR40/60/61. Original suffix reproduced in a real shield-equipped native encounter, then checked after the change. Current opponent context and Reports are captured at both targets. |
| D1-C11 | Spill panel's stock/room selectors gain visible labels; an empty stock selector says what is missing and is disabled. Selection focus survives redraw | UR7/14/32/35/65–68. Found by the full panel census; paired `panels/fields-*`, focused field tests. No spill/fire mechanism changes. |

## Source absorption ledger

These are implementation proposals, not accepted design decisions. The original reports retain shown/stated/inferred distinctions.

| ID | Source and native fit | Built / retained / skipped |
| --- | --- | --- |
| D1-S1 | [Discord sweep](../../../research/PROTOLIKE_DISCORD_SWEEP_2026-10-24.md) F1/S1/P1: method-owned milestones | Built the existing 16/48-minute practice track and disclosed comparison. No separate realm ladder. |
| D1-S2 | Same sweep F2/S2/S3: shared title/description/effect frame across items, work and cultivation | Built shared reading sections, nearby stakes and grouped blockers. Kept the current inspection owner and tooltip frame rather than another tooltip implementation. |
| D1-S3 | Same sweep F6/P2 and round-2 F11/P6: show independently deciding quantities | Built owner-fed condensate pool and method track, plus existing staff effort. A trial with one remaining-time quantity stays text; no invented pressure/heat meter or new stance mechanic. |
| D1-S4 | Same sweep F4/F5: introduced fields, compact stats and named navigation | Retained discovery gates and existing paired stats; added an actual Connection destination and distinct All panels/Shortcuts labels. Skipped unexplained abbreviated tab codes and pre-discovery stats. |
| D1-S5 | Same sweep F7/P4: honest economic estimates | Retained exact native quote amounts and put the existing breakdown behind an adjacent disclosure. Skipped new economic rounding or valuation law. |
| D1-S6 | Same sweep P3/P5/P7–P10: first-food behavior, rest overlap, ecology, shared policy and auto-breakthrough | Skipped gameplay changes in the UI lane. Source ideas remain proposals in their owners. No hidden consumables or new progression rule. |
| D1-S7 | [UI core audit](../../../audits/UI_DESIGN_CORE_AUDIT.md) UIA14/L8 | Built the single Mixing routine-row grammar, confirmed against full-resolution baseline. |
| D1-S8 | Same audit UIA5/7/8/10, DL1–DL8, L6/L7/L9; [typography/glow owner](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#typography-component-style-and-glow-implementation-2026-10-20) TSG1–TSG6 | Extended shared tokens/consumers and static feedback. Reused Gothic strikes, numeric face and existing single-weight rules. Kept synthetic bold disabled; font presence is tested, not inferred from CSS. No whole-cascade rewrite or new glow theme. |
| D1-S9 | [Itch progression](../../../research/itch-io-2026-10-22/BATCH_PROGRESSION.md), Heavenly Path Idle: preview by the same function as commitment, explicit success deltas | Retained owner-provided workshop/trial quotes and displayed the decisive cost, time and chance together. Skipped copied breakthrough formulas or new power deltas. |
| D1-S10 | Same report, First Dawn: discovered-only atlas and records | Preserved known-only panel gates and added a route only to the existing discovered Connection. Existing known-route/Journal systems are reused; no duplicate atlas or automatic lore fill. |
| D1-S11 | [Itch crafting](../../../research/itch-io-2026-10-22/BATCH_CRAFTING.md), Heat & Hammer: risk should read as a decision, preview consumes nothing | Built separate review/stakes sections around existing workshop and purification commitments. Skipped imported forge-heat/remelt rules and reward balance. |
| D1-S12 | [Itch life](../../../research/itch-io-2026-10-22/BATCH_LIFE_A.md), Lowmoor patch notes: explicit thresholds, earnings before spending and saved layouts | Clarified work/readiness and household groupings, kept exact quote/holder boundaries and saved appearance/layout authority. Existing layouts stay intact; no duplicate layout preset system or new time accounting. |

## M4 overlap and integration

Checked each touched path in primary with `git -C /Users/weiwei/code/yet-another-idle-rpg status --short -- <paths>`. At the last inspection, these D1 paths also had primary edits: `index.html`, `src/absorb_p23/host_joins/world_adaptation_ui.js`, `src/continuation_ui.js`, `src/gear_workshop_panel.js`, `src/home_household_panel.js`, `src/home_panel.js`, `src/layout_spec.js`.

Cultivation also owns primary-only changes in `world_adaptation.js`, `world_adaptation/techniques.js`, `gear_workshop_domain.js` and `main.js`; D1 does not copy or overwrite them. Its newer vessel/away/seedbed/inquiry UI is outside this branch's runtime evidence. Integrate both presenters deliberately, retaining their current read-model fields and commands. Use D1's shared sections/actions where fitting, not a whole-file replacement of the live cultivation owner.

Runtime commits: `6ca574a6` (disabled descriptions), `e36f2bf9` (shared work panels), `60aee03d` (household/connection/trade) and `82b5be9c` (detail feedback/control visibility). The last two use fresh-HEAD private indexes and guarded branch updates.

No source edits to `main.js`, `display.js` or `save_files.js`. No `dist/` commit. Local ignored font assets are copied from the existing primary asset directory and excluded from git. Primary is untouched.

## Evidence and audit corrections

Canonical matched evidence: **[comparison index](evidence/index.html)**, [panel coverage](COVERAGE.md), `evidence/{before,after}/panels/receipt.json`, `evidence/{before,after}/journeys/receipt.json`, and `evidence/after/interactions/receipt.json`.

The four Luna-medium audits were serialized on port 5101. Their [shell](AUDIT_SHELL.md), [cultivation](AUDIT_CULTIVATION.md), [household](AUDIT_HOUSEHOLD.md) and [combat](AUDIT_COMBAT.md) reports preserve their original evidence limits. Parent verification supersedes their missing combat/Mistglass paths and incorrect selector conclusions. Their first captures lacked ignored private font assets and used fallback glyphs. They are preliminary evidence, not the canonical paired matrix.

The initial `npm run build` left the tracked bundle unchanged (only its map changed). Canonical baseline uses that same `3dfc49cf3` bundle and original index/token sheet intercepted in the browser, with the **same real Gothic assets** as the candidate. Baseline and candidate SHA-256 inputs are in receipts. Other shared styles are unchanged from baseline. Generated HTML cache-version lines were restored after verification; runtime source/controls remain committed and the merger rebuilds them. Temporary baseline files come from `git show 3dfc49cf3:{dist/bundle.js,index.html,styles/ui_tokens.css}` into `/tmp/d1-baseline/`.

All current screenshots are isolated public-fixture/test-origin views. Fixture prerequisites are stated; native progression acquisition time is not claimed. Optional `/private_packs/manifest.json` absence is recorded separately; current canonical captures have no page errors and no missing font assets. No personal save is read or edited.

## Checks (one line per check)

- `npm run build`: PASS initially and after candidate changes; final artifact hashes in canonical receipts. Tracked generated artifacts excluded from commits.
- `node --test tests/ui_components.test.js`: original description-overwrite regression reproduced as FAIL; corrected moved/nested/disabled/removed and quoted-activation cases PASS.
- `node --test tests/ui_components.test.js tests/ui_contract.test.js tests/home_household.test.js tests/gear_workshop.test.js tests/continuation_state.test.js`: PASS 35 during implementation; gameplay owner invariants unchanged.
- `node --test tests/ui_components.test.js tests/ui_contract.test.js tests/layout_spec.test.js tests/shell_composition.test.js tests/field_layer.test.js`: PASS 53 on final runtime source, including the late picker/folding fixes.
- `git merge --no-edit master`: PASS, Already up to date at `3dfc49cf3`; excludes primary dirty work.
- `npm run check:arch`: PASS on final runtime source; main 10113/10115, display 6724/6767, save_files 310/310; no new cyclic edge or main import.
- `npm run check:rules`: PASS, 22 register rows, 41 AD codes, 125 relative links, 0 warnings. No rule change, so rule-behavior gate is not required.
- `npm test`: run **once**, 2875/2879 PASS; four cases failed solely with sandbox `listen EPERM 127.0.0.1`. This run preceded final navigation/spill presentation corrections; the 53 focused checks and final browser evidence cover those changed inputs.
- `node --test tests/cheat_awakening.test.js tests/cheat_cards.test.js tests/rt_slice1_fixtures.test.js` with reviewed local-server access: PASS 9/9, resolving all four environment failures. Full suite not repeated.
- `node scripts/playtest/d1-panel-matrix.mjs before`: PASS, matched baseline at both targets; final count/index in receipt.
- `node scripts/playtest/d1-panel-matrix.mjs after`: PASS, 46 panels / 92 images at both targets; no page overflow or empty unnamed control detected. Optional-world and unselected item-detail gates are explicit, not blank-panel evidence.
- `node scripts/playtest/d1-journeys.mjs before`: PASS, real shield backing suffix reproduced, native Mistglass and actual manor/continuation/trade flows captured at both targets.
- `node scripts/playtest/d1-journeys.mjs after`: PASS, 34 images at both targets: native selected-method focus, reserve/practice, reload, shield suffix, manor/qualified references, connection review/cancel, and keyboard trade return.
- `node scripts/playtest/d1-interactions.mjs`: PASS, actual custom Gothic glyphs at both sizes, picker bounds, keyboard focus/native hover, OS reduction, effects off/reduced, saved system/21px palette override, 21px workshop, empty gear, high contrast, and Save/reload/Export/literal Import for appearance, holdings and player learning. Existing zero-XP NPC initialization is not mistaken for player learning changes.
- `node scripts/playtest/d1-inspection.mjs before` / `after`: PASS, paired named-item inspection at both targets; no holdings/learning change. Skills remain explicitly gated in this fixture.
- `D1_LARGE_ONLY=1 node scripts/playtest/d1-interactions.mjs .../after/large-text`: PASS, current 21px workshop at both targets, empty gear and high-contrast captures; passing persistence evidence reused.
- Headless comparison-gallery check: PASS, 64 paired views and functional view/viewport controls, full images loaded.
- `git diff --check -- src styles tests index.html scripts docs/gm/dispatch/ui-detail-2026-10-25`: PASS; generated dist excluded.

## More-to-consider round D1-MTC1

**ACT NOW (done).** Selecting a method must not throw keyboard focus back to the page; the active control stays focusable without reactivation. A width change must measure the final overflow label before parking routes; both the All panels picker and shortcut label are tested. Empty native selectors need a named missing-stock state. Real font assets must be present before comparing typography. These corrections are in the candidate, not a new backlog.

**ACCOUNT FOR NOW.** Presentation state is session-local or remains in existing preference owners. Group/read positions cannot create XP, reserve material or alter odds. Retain canonical quote/command IDs and current explicit overrides when integrating cultivation's newer presenter. UI proof on this branch is separate from master integration, packaging, installed adoption and Weibao's visual acceptance. A paused test engine's domain-readiness reason is not itself evidence of a production save-ownership defect.

| Later code | Follow-up, level / effort | Done check |
| --- | --- | --- |
| D1-L1 | Coordinator: reconcile seven primary UI overlaps with cultivation/other owners; Sol, medium | Combined source preserves both command/read-model additions; rebuilt paired desktop check, no discarded owner fields. |
| D1-L2 | Gated prototype/reference states outside the available fixtures; Luna medium collection, Sol review, small per route | Each supplied valid state opens its panel through its owner; screenshots at both targets, otherwise explicit source-only status. No forced discovery or sealed-truth dump. |
| D1-L3 | Continue legacy literal token migration and cascade reduction in the existing UI audit owner (L6/L7/L10); Sol, medium per file | Token ledger shrinks with matching geometry/evidence and preserved saved choices; no broad stylesheet rewrite based on this lane. |

## Remaining authoritative gates

Coordinator reconciliation of primary overlaps and unexercised gated states, then Weibao's actual visual/play acceptance. Canonical evidence completion is recorded in the final handoff below. No merge/push/install permission is inferred from this branch delivery. Mobile remains deferred.


## Original handoff (superseded by the G1 resume below)

Canonical evidence is complete: 64 paired views at both desktop targets (46 navigation panels, 17 native journey views, one named-item inspection), with 56 of 73 registered surfaces represented by a panel or visible shell/native-state view. The other 17 are explicitly source-inventory-only/gated in COVERAGE; this is not an all-world-state certification. The DOM census has no empty unnamed control and no page overflow in its captured states. Native actor/read-model and player appearance/holdings/learning round-trips are qualified in the receipts.

Runtime is committed through `82b5be9c`. The evidence/record commit follows it. No runtime source remains uncommitted; rebuilt dist and preliminary diagnostic audit attempts are intentionally outside the committed source candidate. The assigned server is stopped after final artifact verification.

Play review: open the comparison index first, then run the rebuilt branch on port 5101. Check Mistglass method/reserve/stakes, workshop steps, manor Household shortcut, Connection anchors/review/cancel, native trade footer and Reports. These are candidate choices, not accepted defaults. Coordinator M4 reconciliation and the source-only gated-state cases remain separate work; no master merge, push or app adoption is claimed.


## G1 resume, 2026-10-25: remaining original D1 panel scope

Weibao authorized this one resume in the same branch/worktree on port 5101. It closes the original 17 source-only rows through native routes and declared public owner-factory prerequisites. Mobile stays deferred; no D4/dirty cultivation merge, primary writes, master merge, push, deletion, cultivation contact or further dispatch. The full suite is not rerun.

[RESUME.md](RESUME.md) owns the exact per-surface prerequisite, inspection, change and final disposition. Sixteen panels are reached at both desktop viewports at 14px and 21px. Optional worlds is blocked by the exact absent `private_packs/manifest.json` and actual pack files, rather than by the original fixture. Known routes required a real discovery fix: it deferred behind its own hidden parent. Its before views reproduce the missing native panel after valid entry; its after views open the owner-projected panel. Other comparisons show the same native surface.

| Code | Change | Rules and evidence |
| --- | --- | --- |
| G1-C1 | Known routes computes its read-only native projection in the undiscovered workspace vault, breaking the visibility/discovery cycle | UR10/14/49, AR3. Hidden-parent regression and native terms-chart/independent-Goa journey. |
| G1-C2 | Loadout name, hearth-reading and observer-method controls use the existing shared visible-label component; loadout checkbox is aligned with its label | UR7/14/32/35/65–68. Paired 14px/21px views at both targets, keyboard Space check. |
| G1-C3 | Stock count says item kinds; stock and companion buttons reuse existing action-row spacing | UR25/40/60/65–68. Paired populated Stock/Companion views. Primary companion renderer is untouched; `.bond-actions` consumes CSS. |

Runtime source: `0ae4203522b7a3b1dbcb20e3c9616d034e5bdcb9`. Old canonical images and `evidence/source-inputs.json`, `verification.json` remain unchanged. New input identities, image hashes and verification are under `evidence/resume/`; the comparison gallery adds resume cases with their own D1 baseline label. Generated dist and generated-only HTML query changes are excluded from commits.

Checks, one line each:

- `node --test tests/ui_components.test.js tests/ui_contract.test.js tests/owned_place_clock.test.js tests/rank_gap_observer.test.js`: 24/24 pass, before the final shared-CSS consumer adjustment.
- `node --test tests/known_routes_ui.test.js tests/known_routes.test.js tests/companion_bond_rite.test.js tests/stock_view.test.js`: 21/21 pass, including hidden-parent discovery regression.
- `node --test tests/ui_contract.test.js`: final 3/3 pass after the CSS consumer adjustment.
- `npm run build`: pass for final runtime; hashes in resume/source-inputs.json.
- `npm run check:arch`: pass, main 10113/10115, display 6724/6767, save 310/310; no new cycles.
- `npm run check:rules`: pass, 22 rows, 41 AD codes, 125 links, zero warnings.
- `node scripts/playtest/d1-resume.mjs before` / `after`: final browser receipt in resume/verification.json; both desktop targets and 14px/21px. Known-route before is an explicit absent-panel reproduction.
- Original `npm test`: unchanged exact receipt, 2879 total / 2875 pass / four sandbox bind failures, then the three affected files 9/9 with reviewed local-server access. It predates the original late navigation/spill fixes (53 focused checks) and G1 source; no later full-suite claim.

M4: new runtime edits are six small source/CSS paths plus one focused test; no primary files copied. The original seven overlap files remain in the earlier M4 table. Primary's dirty companion renderer differs in its bond-return child; this resume avoids that file entirely and styles its existing `.bond-actions` class. Cultivation overlap remains a coordinator hunk reconciliation, with no owner contact or merge in this resume.

Final consideration round: ACT NOW (done): native/disposable prerequisites replace fixture absence as a blocker; route discovery and concrete field/count/action defects fixed. ACCOUNT FOR NOW: keep old proof identity separate from the resume baseline and preserve primary owner hunks in combined integration. LATER/BLOCKED: Optional worlds, bounded owner-supplied-content check only; done when its exact manifest/pack loads and its native panel can be inspected at the same targets. No new lane or dispatch.

Remaining gate: combined owner reconciliation/integration and Weibao's play/taste acceptance. This is a branch proposal, not a merged, pushed, installed or human-accepted overhaul.

G1 evidence seal: 96 paired gallery views, 32 new views / 128 new images; 72/73 surfaces rendered or qualified inline. The 281 original proof files outside the extended gallery HTML remain byte-identical. The assigned Python server on port 5101 was verified by PID/command/CWD and stopped after capture.
