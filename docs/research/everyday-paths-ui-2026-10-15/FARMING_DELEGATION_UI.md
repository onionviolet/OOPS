# Farming and delegation UI evidence

2026-10-15. Complements [deep dive](FARMING_DELEGATION_DEEP_DIVE.md). All images were visually inspected; the two key stage/work-matrix frames were also inspected at their individual resolution. Images are retained only in ignored `private/farming-delegation/ui/`. No donor UI was operated. Mouse, key, focus, actual expiry and responsive behavior are untested.

## Sources and version boundaries

**FU1. Immortal Life:** [worstcase11 Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=2855330245), posted2022-08-28, updated2025-03-26. It mixes alpha0.5.10–0.8.xx and1.0-era material; the author notes translating some screenshot dialogue. Treat English rendering as potentially edited guide presentation, not proof of native English localization or current-build geometry. Source-image URLs and downloaded-file mappings are preserved in `IL_UI_RECEIPT.json`, `IL_UI_EXTRA_RECEIPT.json`, `IL_UI_EXTRA2_RECEIPT.json`; full available guide text in `il-guide-2026-10-15.txt`.

**FU2. ACS work screen:** [Ali213 work guide](https://gl.ali213.net/html/2019-1/297385_11.html), published2019-01-08 with20190111 image paths. Chinese,584×373, launch-era build unknown. These small screenshots support surface composition and a work-matrix/tooltip depiction. Use fresh decompiled `Wnd_NpcWork`/`JobNpcEngine` for control binding claims; do not read modern numeric values or exact interaction rules out of this old screenshot. Provenance in `ACS_UI_RECEIPT.json`.

**FU3. ACS farming:** [3DM cultivation article](https://www.3dmgame.com/gl/3754518.html), published2018-12-30, credits indienova as source/author. Syndicated early material, not an independent modern play session. The original page eventually became readable after a navigation timeout; the already-loaded DOM was inspected without another navigation. Three exact image elements were downloaded. Provenance in `ACS_FARM_UI_RECEIPT.json`.

## Actual screen inventory

File names below resolve inside `private/farming-delegation/ui/`. The preview labels describe what is visible, not behavior verified by interaction.

| ID | File | Visible evidence | Practical reference and limit |
|---|---|---|---|
| FE15 | `il-5087359a974e4722.jpg` | Crop notebook with crop list, normal/variant tabs, season, growth time, output quality/acquisition information. | Separate browsing knowledge from active care; acquired knowledge can deepen a path. Does not prove when each entry unlocks. |
| FE16 | `il-2047482487774952351.jpg` | Rare-crop stage panel:3×3 arrangement diagram, west/east required items with counts, circular ranges, two elemental progress bars, Next phase. | Requirements and progress share one task-focused view. Static diagram does not demonstrate placement validation or button availability. Guide image may contain translated text. |
| FE17 | `il-2021583847800679394.jpg`; `il-2021583847800679751.jpg` | Later-stage diagrams with additional required placements and elemental bars. | A specimen can change the kind of planning it needs across stages; cannot infer transition timing from the images. |
| FE18 | `il-2047482487774951382.jpg`; `il-2047482487774950413.jpg` | Garden space around a central specimen, then surrounding devices and a selected-ground fill prompt. | Devices have spatial presence; detailed layout can earn its screen space. Does not prove exact absorption radius, throughput or resource depletion. |
| FE19 | `il-46826210419674109.jpg`; `il-46826210419672951.jpg` | Helper's Praying/Spirit surface, level/power information; prayer selection, tier, offering requirement and Use/Upgrade controls. | Explain a power's availability and investment beside its action. These frames do not show AutoFarm selected or unlocked, and do not demonstrate care execution. |
| FE20 | `il-d71db570ca599050.jpg` | Offering choice through an inn menu. | A second surface supports helper progression. No purchase/offer was made; costs are a historical depiction. |
| FE21 | `acs-bb4e804b51f9916f.jpg`; `acs-87d13af9e5c37e32.jpg` | Work-screen entry cue; worker-by-task matrix with tooltip and surrounding settlement. | Useful when many people/tasks require comparison. Exact readability/scaling should not be copied from584×373. |
| FE22 | `acs-2d40f166d442fe56.jpg` | Tutorial explanation over the work matrix. | Onboarding reference only, not completion or live priority proof. |
| FE23 | `acs-farm-1.jpg` | Cultivated area with varied plants and adjacent structures. | Spatial farm/world composition, not a verified crop-designation interaction. |
| FE24 | `acs-farm-2.jpg` | Small ground tooltip naming fertile soil, darkness, cold and−2.9°C. | Surface local conditions where the player inspects a site. Very small historical crop; current tooltip behavior untested. |
| FE25 | `acs-farm-3.jpg` | Crop-selection icons with a cotton description/temperature-related tooltip. | Explain a crop's role and conditions at selection. Image is cropped and unsuitable for measuring full-screen layout. |

Retained but excluded as mechanical UI proof: IL story dialogue (`il-2021583847794115051.jpg`, `il-2021583847794116918.jpg` if present), helper unlock dialogue, blessing animation and unrelated shop gallery; ACS `acs-200d7c8032b5dcfe.jpg` is a title/tutorial-end frame. None demonstrates worker priority or automated care. Retention is for traceability, not additional evidence weight.

## Proposed use, not adopted layouts

**UP1. Current work:** show selected crop/chore, actual actor, waiting reason and any temporary-care expiry in a calm summary. A worker grid becomes useful only when the player actually manages several workers; do not make it the default entrance to a personal garden.

**UP2. Cultivation detail:** show known condition ranges, current condition, progress and stage requirements. Use a spatial diagram where neighborhood placement matters. Unknown relationships remain unknown until the player's discovery route establishes them.

**UP3. Knowledge:** let a notebook retain observations, variants and confirmed rules apart from action controls. A player can inspect known evidence without advancing time. Preview one selected specimen or technique rather than presenting the whole world's sealed truth.

Any future YAIR UI proposal uses [UI rules](../../UI_RULES.md), an existing shared home/controller, populated1366×768 desktop, intact log/status/current work, bottom Back/Esc. These references establish no accepted YAIR layout and no mobile work.
