# Palette implementation audit

Historical independent Luna review. The subsequent [solo audit and repair closure](SOLO_AUDIT.md) and [current report](REPORT.md) supersede its coverage snapshot; findings below preserve the original evidence.

Read-only audit updated after root's integration repairs, 2026-10-20. The checkout is shared and dirty; observations are from current source plus `/tmp/oops-palette-craft-debug2.log`, not a frozen build. No source code or checklist rows were changed by this audit.

Rules checked: AR1–AR16, UR1–UR58, MR1–MR36, AD6–AD9/15–17/32–38/40. The UI and engine behavior remains source-implemented until root's integrated gates and rebuilt desktop run. Focused tests run: `node --test tests/crafting_visibility.test.js tests/palette_feedback.test.js tests/temperature_band.test.js tests/work_status_view.test.js tests/harvest.test.js` — 28 passed. No build, full suite, or browser was run by this audit.

## Findings

| Priority | Finding and reproduction | Smallest correction |
|---|---|---|
| P1 | **Native Sinew batch action throws before it reaches the native commit.** In `src/display.js:3427-3452`, `commit_selected_item_recipe` reads `game_stats.total_crafting_attempts` and `game_stats.total_crafting_successes`, but `display.js` has no import or binding for `game_stats` (the object is private in `main.js`). The supplied `/tmp/oops-palette-craft-debug2.log` records `ReferenceError: game_stats is not defined` at the first “All” click, before `window.useRecipe(...)`; inventory therefore stays unchanged. `bindSubjectGesture` allows click-only activation when `pressed` is unset, so this trace does not support focus/hover detachment as the cause. | Pass a narrow stats reader/receipt from `main.js` into display, or derive the receipt from an authorized native commit result; do not read main's private binding directly. Then rerun the native interaction case and confirm both click and keyboard paths. |
| P2 | **Crafting usable/blocked wording remains a projection mismatch.** `src/crafting_visibility.js:45-46` counts usable quantity in the selected native entries but marks the whole selected group blocked if any entry is blocked; the focused fixture shows need=2, usable=3, blocked=2 and unavailable (`tests/crafting_visibility.test.js:5-13`). Native craft asserts disposition for every selected entry before consuming it (`src/main.js:5391`), so the whole selected quote is rejected. This is not evidence that native should consume only the free subset. `held_back` predates this lane: `git show HEAD:src/crafting_visibility.js` already blocked a group if any selected entry was unavailable. | Present usable quantity as a property of the exact native policy-selected quote, or make the blocked label explain that the selected group includes unavailable stock. Test quote and commit against the same selected entries. |

## 53-row coverage snapshot

The owner checklist still reads 27 checked / 26 open. The following accounts for **all 26 currently unchecked rows** against current sources. “Consumer exists” means a native binding is present in source, not browser verified or human accepted. Rows marked partial still have a native consumer for one bounded example but do not cover the full palette family.

| Row | Current consumer/status | Remaining gap |
|---|---|---|
| BD3 | Repair and carcass work use `work_status_view`; consumer exists | Browser proof and visible finish boundary remain. |
| BD4 | `temperatureBand` reads native cold threshold/tolerance in Condition | Bounded to cold exposure; no other useful-range owner. |
| BD5 | Lamp fuel and crafting show carried/usable/blocked/proposed values; partial | No exact held/reservation quote across native trade/storage; crafting false-negative finding above. |
| BD6 | Lamp fuel supplies signed native burn rate in Tools | Only this rate/unit; no shared rate consumer. |
| BD7 | One-step work stage label exists | No actual multi-stage job or charge/pip consumer. |
| BD8 | No native provenance/uncertainty consumer found | No stale, remote or unassessed observation route. |
| BD9 | Per-copy tool meter and observed tool condition cue | No retained subject-history route beyond current session/previous check. |
| BD10 | Craft batch choices show a non-reserving proposal | No chosen target owner or completed-output progress counter. |
| BD11 | Repair/harvest remaining work uses native totals and pause gates | Browser proof remains; no next opening/cooldown timeline. |
| BD12 | Harvest work shows per-job progress and saved processed count; partial | Count is save-wide, not a continuing-cycle/output/stop-target owner. |
| LD1 | Per-instance tool condition meter and condition-change cue | Cue is transient and has the hidden-host issue above; no durable repair-history mark. |
| LD2 | Repair cancellation names material return; harvest cancellation names returned carcass; auto setting describes stop-after-current | Source/browser journey still open. |
| LD3 | Tool-condition increase/decrease receives different guidance/closing motifs | No body-recovery event consumer. |
| LD4 | Harvest completion receipt says carried; cancel returns carcass | No transfer/overflow holder comparison. |
| LD7 | Repair and automatic harvest expose native pause reasons and remaining work | No general interrupted-job/resume journey; source/browser gate remains. |
| LD8 | Native rain/snow and lamp transitions have local cues; partial | Host/text and snow wording source fixes now present; no creature/object reaction; browser proof remains. |
| LD10 | Palette-feedback sound has a trusted pointer/keyboard gesture consumer | Source fix present; browser sound-on/off and reduced-motion behavior remain unverified. |
| LD11 | Session return snapshot compares inventory, tools and known skills | No durable return baseline or encounter digest; snapshot fields are deliberately narrow. |
| LD12 | Known skill level increase gets a competence cue | No authored capability-based pose/action scene. |
| UF4 | Craft detail connects native inputs, outputs, policy and commit; repair/harvest show jobs | Trade/ordinary making journey and rebuilt browser evidence remain. |
| UF6 | Existing trade UI is styled; no new two-holder transfer/custody comparison found | Verify actual source/destination ordering and transfer journey in browser. |
| UF7 | Existing glyphs and text cues only | No bounded physical/spatial scene consumer. |
| UF8 | Weather/light/tool/skill example cues exist; partial | No local creature/actor response or persistent ordinary-life history. |
| MC3 | Harvest has per-carcass output receipt and processed count; partial | No activity-batch summary across rounds with interruptions and retained detail route. |
| MC4 | Session return digest is a native consumer; partial | No encounter digest/archive; return Details route now exposes overflow, pending browser proof. |
| RUC4 | Known weather/light changes can cue a local response; partial | No broader sensed-atmosphere accent system; never tint hidden properties. |

Root's current source repairs the previously reported sound activation, scene host/retained note, snow wording, return details overflow, and skill-discovery gating; harvest now has per-carcass totals and a discovery panel. These source fixes still need integrated browser confirmation. The physical-scene gap remains real: current feedback is text/motif over scene content, with no small spatial simulation. Digest coverage is session-return comparison, not an encounter digest. The continuing-cycle gap remains: harvest shows per-job progress and a save-wide processed count, not a cycle-owned output/stop boundary. The unchecked rows remain without a complete native consumer; partial examples are called out in the table. The immediate blocking native craft defect is the unbound `game_stats` read above. Root's browser and full gates remain authoritative.

## Integration gate

Root's rebuilt desktop browser run is still open. It should cross repair, lamp fuel, crafting and carcass-processing consumers; inspect scene cues and retained notes; exercise sound on/off and reduced motion; and verify actual transfer behavior. The native Sinew “All” click currently fails before reaching the commit due to the `game_stats` reference, so that must be fixed and retested before the interaction gate can pass. The prior 28 focused test passes do not cover this integrated failure.
