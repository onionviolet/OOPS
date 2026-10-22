# Inventory overhaul and latest combined Electron release

Weibao selected this implementation, latest combined app integration, merge and
push. [Direction](../../../USER_VISION.md#inventory-overhaul-and-combined-publication-2026-10-21),
[checkpoint](CHECKPOINT.md), [starting assessment](../../../reviews/INVENTORY_OVERHAUL_ASSESSMENT_2026-10-21.md).
Rules AD6–8/34/36/40/41, AR1–16, UR1–64. Desktop targets1920×1080,
1800×1040,1536×864 at14/21px; mobile remains deferred.

## What was missing and what changed

| Code | Previous gap | Delivered behavior |
| --- | --- | --- |
| I2 | Books shared a broad Usable category, and components/materials/loot shared Other. Name search could not narrow same-name qualities. | Native-derived kind and quality facets supplement the existing native categories, search and sort. Closed view labels name active facets; clear resets all view choices. Counts distinguish matching stacks and units. No inventory key, category authority or save format changed. |
| I3 | Sparse-list checks did not establish a usable variant-heavy workbench; expanded reading and actions could lose useful context. | The existing expanded Inventory now holds the real list beside stable item reading and native-command proxies, preserving compact main proportions and full Reports. Exact selection scrolls into view on expansion. Both panes scroll inside the available height; commands remain above long reading. Quality, slot and stack units remain native facts. |
| I4 | Item-only comparison explicitly declined structured gear because it could not forecast fit/custody/condition. | A separate current-wearer comparison runs the same physical equipment projection before/after slot replacement. It includes native baseline defense, condition/fit/custody/body effects, weight, regional coverage, stamina and weather protection contributions. It names its scope and preserves ordinary item comparison. Private policy/claim/flag identifiers are not returned. No aggregate power score or speculative universal applicability. |
| I5 | Only per-stack quantities/one-item paired transfer had native proof. | Reviewed batches select exact local-chest stacks/quantities, explain holders and favorites, support cancellation and move every selected stack through one existing staged/durable transaction. Sequence/count changes, duplicate keys, equipped-only requests, favorites and disposition/custody guards revalidate before publication. An invalid batch moves nothing. Existing single-stack commands retain their behavior. |

The broader party/cargo stock redesign is not part of this local-chest slice.
There is no invented chest-capacity limit, new stock cache, timer or save writer.
Native counts, work reservations, custody and persistence remain authoritative.

Reference basis: previously pinned original Proto23 inventory/isort rendering,
matched task screenshots, and base YAIR native item rows, quality/quantity labels,
category/sort controls and transfer handlers. The expanded companion adapts their
compact list plus stable reading to OOPS, retaining explicit commands and its
useful compact Focus space under UR49. Original source/license attribution remains.

## Checks and exact evidence

- V1: [Full suite](evidence/tests-final.txt):2516/2516 pass. [Build](evidence/build-final.txt),
  [architecture](evidence/arch-final.txt), [rules](evidence/rules-final.txt), and
  [rule behavior36/36](evidence/rule-behavior-final.txt) pass. `main.js`10274 is below
  its10310 baseline; no new import cycle. Rules retain the existing untracked
  home-checkpoint warning until publication makes that owner tracked.
- V2: [Fresh-origin browser receipt](evidence/receipt.json):six mixed-stock cases
  with33 exact stacks and29 quality variants. Kind, quality, search, explicit
  expansion, selected-row containment, bounded side-by-side scrolling and no
  horizontal page overflow pass. Reviewed batch cancel/stale recovery/success,
  actual Save/reload/Export/literal-file Import, and original public structured
  test-pack compare4→8 followed by native Equip all pass with zero page errors.
  Fixture progress is declared; this is not natural-acquisition proof.
- V3: [Native Electron receipt](native/receipt.json):six actual local Gothic
  platform-font/layout cases with equipment, paired storage and work/cancel.
  [Exact frozen adoption/restart](electron-preserved/adoption-receipt.json):
  previous combined release→new release, native Save and reload, retained progress,
  real Electron restart, new filter/batch UI and actual custom Gothic14 glyphs.
  Local optional assets are preserved unchanged in the installation input.
- V4: [Source identity](SOURCE_INPUTS.json):759 runtime/style/locale inputs match
  the tested candidate. Released home and MF owners handed off their paths for
  scoped publication. The unrelated book-world, deep-workflow and cleanup edits
  remain outside the publication tree. Private font/pack bytes and test save
  exports are excluded from Git publication.

[1536×864,21px expanded workbench](evidence/expanded-1536-21.png),
[reviewed chest transfer](evidence/batch-chest-21.png),
[structured comparison](evidence/structured-comparison.png).

Initial browser failures caught an older expanded block/overflow rule, a reviewed
selection whose displayed count did not update its selection value, and an
unclosed Beginning route in the test. The first two were repaired; the journey
now uses the real Back route before item actions. A fake-DOM fixture was extended
for the added companion. Earlier snapshot tests accidentally replaced during the
font fix were restored alongside the new linked-asset regression. The final
full suite includes all those tests. These diagnostics are not passing evidence.

## Publication and player acceptance

[Clean export](CLEAN_CHECKS.json) rebuilds the identical bundle and passes2516/2516
tests plus architecture/rules/36 behavior checks. Its108 rule warnings describe
links in an export without a Git index. [Normal Electron](MAIN_ELECTRON.json)
has adopted frozen `v0.6-72af84cf8e66`, exact bundle `e35668b1862220d8737de390ce4a9fc11c03fc2a441be72363bb06dd552c36d4`, through the real Save and reload control; no reload gate remains. All82
served files match the delivery input, including unchanged optional local assets.
The source publication and guarded master/push identity are recorded separately
in PUBLICATION.json. Technical
checks establish these concrete behaviors, not whole-game parity or human taste
acceptance. Human visual/play judgment and natural pacing remain open.
