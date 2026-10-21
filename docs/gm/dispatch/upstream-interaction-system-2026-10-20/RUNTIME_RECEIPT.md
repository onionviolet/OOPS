# IS1–IS5 runtime integration receipt

2026-10-20. Runtime integrator source work is released to the coordinator for final build, full suite, architecture/rules, rebuilt browser and human acceptance. This receipt is focused implementation evidence, not whole-system acceptance.

Authority: BRIEF.md, AR3/7/8/10/16, MR1/5/29, AD3/6–9/16/32/34/36/38/40, UR35/36/40/43/47, PK9–PK12. Primary desktop outcome remains 1920×1080 with current laptop/large-text checks owed by the coordinator. Mobile remains deferred. Existing IG edits are retained; no style/token/profile edits were made here.

## What changed

| Area | Source changes | Meaning and boundary |
|---|---|---|
| IS1 | `recipe_connections.js`, `material_choice_view.js`, `crafting_detail.js`, native crafting in `display.js` and `main.js` | Known producers and uses cross native categories, components and equipment without calling result-producing/quality-roll methods. Follow/Back records exact material key, selected assembly keys, filter and nested scroll/return state. Known recipes can be inspected where a station is unavailable. Component material selection inspects; separate buttons commit exact variants. Assembly now shares native craft rollback and durable settlement. Execution rechecks station, learned recipe and stock. |
| IS2 | Same dependency index, exact variant stock in native item inspectors, `crafting_visibility.js`, `crafting_recipes.js` | Known-use links reuse native inventory keys across inventory/trade/storage item inspection. Readiness uses native stock/disposition, with carried stock separate from current material-group allowance. Equal base-value material groups use inventory-key order. No stock, reservation or general goal tracker was introduced. The actual bounded workplan goal owner remains unchanged; tracking is not reservation. |
| IS3 | `equipment_comparison.js`, native tooltips/part choices in `display.js` | Named baseline, quality range, exact parts, saved affix provenance and full native item stat contributions replace anonymous deltas. Component role comparisons also show actual assembly-input dimensions. Lower-is-better damage reduction is stated in text. New craft affixes remain unresolved and are labelled. Structured equipment requiring body/custody/coverage readers reports comparison unsupported instead of pretending zero item-defense forecasts worn defense. |
| IS4 | `recent_learning.js`, `components/levelable_component.js`, `gameplay_publication.js`, skill UI join | Actual accepted native XP awards and committed prepared-publication awards feed the same session view. Parent grants follow their accepted deltas; loading is excluded. Hidden skill membership is filtered by native discovery. Stable insertion order and cumulative/last-award values avoid intermittent flicker. The view explicitly means since session start/load, not progress or XP/minute. It is omitted by existing save serialization; rollback restores it together with XP. |
| IS5 | `combat_subject.js`, `combat_focus.js`, `combat_opponents_domain.js`, `opponent_board.js`, `ui/combat_display.js`, `combat_log.js`, `village_workspace.js`, log join in `display.js` | Runtime actor occurrence identity is distinct from reusable slots, with one shared encounter serial owner reused by logs. Inspection retains an ended reference after the selected actor disappears. Current opponents require deliberate reselection. Old log rows cross-highlight only the exact current actor. Pending gestures and queued attack progress cannot silently retarget a replacement. Pairwise native readouts remain the same owner; departure remains the ordinary encounter action owner. |

## More-to-consider disposition

- **ACT NOW:** exact variant/return, native award publication seam, assembly durable rollback, occurrence identity, stale stock and gesture binding were implemented.
- **ACCOUNT FOR NOW:** PFE21 inspection draws no gameplay RNG; PFE22 uses current transaction/stock owners; PFE24 controls target attempts and retain committed outputs; PFE29 preserves exceptional log outcomes and binds references to exact occurrence; PFE30 uses bound subjects. RUC semantics, Appearance/high-contrast and typography remain with existing owners. No new hidden rarity styling was added.
- **LATER:** PFE23 has no newly selected expiring-resource reader in these immediate native recipe routes; existing timed-work owners remain unchanged. PFE25–PFE28 and SBS13–SBS15 apply when their actual body/method/witness/actor routes are selected. No new NPC/world/pet/climb/fireplace program was introduced.

## Owned changed paths

Existing files with task hunks: `src/display.js`, `src/main.js`, `src/crafting_detail.js`, `src/crafting_recipes.js`, `src/crafting_visibility.js`, `src/components/levelable_component.js`, `src/gameplay_publication.js`, `src/ui/combat_display.js`, `src/combat_focus.js`, `src/combat_opponents_domain.js`, `src/opponent_board.js`, `src/village_workspace.js`, `src/combat_log.js`.

New leaves: `src/equipment_comparison.js`, `src/recent_learning.js`, `src/recipe_connections.js`, `src/material_choice_view.js`, `src/combat_subject.js`.

New regressions: `tests/interaction_system.test.js`, `tests/interaction_native.test.js`.

No commits, pushes, worktree changes, personal-save access or schema migrations. Existing dirty changes remain uncommitted. Main/display line growth was reduced by extracting comparison ownership rather than adding another feature owner to the composition roots.

## Focused evidence

Final focused command, on the released source:

```sh
node --test tests/interaction_system.test.js tests/interaction_native.test.js tests/crafting_home_refresh.test.js tests/crafting_native_reload.test.js tests/combat_focus.test.js tests/combat_log.test.js tests/combat_opponents_projection.test.js tests/gear_dimensions.test.js tests/native_craft_transaction.test.js tests/micro_p1_xp.test.js
```

Result: **37 passed, 0 failed**, 4.17 seconds. `git diff --check` passed for owned existing source paths. JavaScript syntax checks passed during editing.

The new native integration fixture boots the actual source bundle in isolated in-memory storage. Synthetic late-state setup supplies supported materials/stations; native button handlers then prove selection without expenditure or RNG, cross-category producer/Back, exact material return, actual component craft and XP, rejected assembly-write rollback of stock/XP/recent learning/RNG, successful durable assembly, stale stock/no RNG, mixed leftovers, current-group All and renewed-command depletion. This is a source/headless check, not a rebuilt visual-browser or ordinary acquisition proof.

The pure/native-data regressions cover all seven supported recipe categories without random inspection; actual armor source dimensions; fixed-baseline quality ranges; explicit unsupported comparisons; hidden/loading/rollback-safe learning; both native XP publication seams; stable fighter identities and ended references; and A-to-B gesture rebinding refusal.

## Coordinator gates still open

Full build/suite/architecture/rules, rebuilt 1920×1080 and current laptop/large-text/browser scenarios, ordinary acquisition/use and departure, and human visual/play acceptance remain with the coordinator. Save schema is unchanged, but the new durable assembly path merits final browser save/reload/export/literal-import coverage if selected as an acceptance route. No whole-system completion claim is made by this receipt.

## Final substantive review and corrections

The Sol runtime review traced every IS1–IS5 consumer and the applicable PK/AA/PFE folds against the live brief. Findings below are corrected source defects, not new product direction.

| Finding | Defect and correction | Evidence |
|---|---|---|
| RV1, IS4/AA13 | The original twelve-record limit ran before discovery filtering. Hidden awards could remove visible entries, and revisiting an evicted skill could reset the stated cumulative session gain. Retain one ephemeral cumulative record per finite native skill ID, then apply native discovery filtering. No arbitrary display cap is imposed. | Hidden-award eviction/cumulative regression, both native award seams and rejected craft rollback. |
| RV2, IS2/AR7 | A known-use button nested in a native trade/storage tooltip bubbled to the holder's click-to-move handler before document navigation. Intercept known-use navigation in capture phase, before holder commands. This also prevents a part-selection click when following a use from that part's tooltip. | Nested native-holder-shaped DOM regression: one follow, zero transfer commands. |
| RV3, IS1/IS2 | The new trade-to-recipe inspection route exposed an existing disagreement: native availability checked expansion occupation/disposition, but durable settlement required a living, free, writable holder. Reuse that actual settlement boundary for native readiness and immediate command eligibility, before output/quality RNG. | Actual native trader fixture: recipes remain inspectable, material craft controls are disabled, direct renewed command changes neither stock nor RNG. |
| RV4, IS5/PK9 | An ended opponent reference could retain priority over Around you after a fight ended at the same place. Add an explicit presentation-only return button. It clears the ended selection and returns to the actual current roster or nearby context. This button does not flee or settle combat. | Ended-reference/current-roster/nearby-context seam regression; ordinary combat departure remains its native owner and requires rebuilt browser evidence. |
| RV5, IS3/AA13 | Raw affix-origin metadata did not establish known manufacturing history. Compare stored item modifiers and existing part names without inferring whether an affix was randomly rolled or caused by a material mechanism. | Two identically known items with different private affix-origin metadata produce identical comparison text. |

Review-only source/test edits: `src/recent_learning.js`, `src/recipe_connections.js`, `src/main.js`, `src/village_workspace.js`, `src/equipment_comparison.js`, `tests/interaction_system.test.js`, `tests/interaction_native.test.js`. No styling or separate light/time/PFE23 owner paths were touched.

### Area closure limits after review

- IS1: supported item/component/equipment producers and return are joined; immediate execution and durable assembly share current native owners. Mixed-leftover and renewed-command behavior is proven in source/native fixtures. Final UI return geometry, all-category discoverability and ordinary acquisition remain browser gates.
- IS2: native inventory/trade/storage inspectors share exact-key known-use and carried-stock readers. Rows retain their holder's own quantity/transaction authority. The review corrected transfer bubbling. There is no general explicitly tracked material-goal consumer to extend; the bounded workplan owner retains its existing next-step reservation semantics. Real holder movement/quote orderings remain final native-browser evidence.
- IS3: current native assembly/part reader comparisons are implemented. Structured equipment with body/coverage/custody effects is explicitly unsupported in this item-contribution comparison. Future craft affixes remain unresolved; no forecast is presented as a committed roll. Baseline text names an inspection-time snapshot, not a continuously live slot. No new learned-appraisal system is claimed.
- IS4: temporal meaning is actual cumulative/last XP since session start/load, with no rate inference or new clock. All native skills remain recorded and presentation filters knowledge. Existing practice-block/lead owners remain authoritative. Large-text inspection of the now complete visible session list remains a layout gate.
- IS5: selection, event linking, queued attack progress and ended-reference return are occurrence-safe. Pairwise readouts retain the inherited explicitly labelled `native-legacy` disclosure; this is not evidence of a new learned-opponent appraisal mechanism. Reference inspection/scroll and ordinary departure still require rebuilt browser proof. The inspection-return button is not escape proof.

The review introduces no unresolved source defect in the selected joins. This does not close the coordinator's final build/full-suite/architecture/rules, rebuilt desktop/laptop/large-text, ordinary acquisition/holder/combat/persistence or human visual/play gates. PFE23 remains with its separate engine owner; no light/time behavior was reviewed or changed here.

Final review focused command on released review inputs:

```sh
node --test tests/interaction_system.test.js tests/interaction_native.test.js tests/village_workspace.test.js
```

Result: **15 passed, 0 failed**, 4.14 seconds. This supersedes the review's intermediate 10/14-check runs; the original 37-check run remains historical evidence for its earlier inputs. Native fixture uses the actual `villageTrader` NPC key. Review runtime/test ownership is released again for the coordinator's final combined gates.
