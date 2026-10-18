# Crafting UI evidence and limits

Captured/inspected 2026-10-15. **Depicted** means pixels in attributed source media. **Source** means configuration/code, not interaction. **Interactive** would mean this researcher operated the game; none was performed. Browser actions only operated public pages/video controls in hidden tabs. Original screenshots, captures, tables, captions and hash manifests are [private](private/); see [reference index](REFERENCE_INDEX.md). Media build versions are unknown unless explicitly named below. Capturing a video player at a larger display size does not establish the game's original resolution or accessibility.

## U1: Taiwu, developer manufacturing update

Primary: ConchShip's **UI/UX Improvements Update 26-7-22 #260722**, Steam news GID1839041357023957, timestamp1784727303. [Official announcement](https://steamstore-a.akamaihd.net/news/externalpost/steam_community_announcements/1839041357023957). Exact news body and six image receipts retained. The observed image source is2560×1440; developer caption overlays and dimmed backgrounds are part of the source image, not game-state measurements. Do not equate its patch label with the installed build25845203 from the old dossier.

| Locator / local private image | Depicted decision | What it establishes |
|---|---|---|
| `813d892428528d62f9eba7cd5edf3b6c70de4f23` / [entry lists](private/taiwu-813d892428528d62f9eba7cd5edf3b6c70de4f23.jpg) | Choose reagent and tool, with stock locations and list/detail controls | Entry lists are visually co-present in the developer demonstration; left/right selection reduces hidden setup |
| `11d97061f442f0a8ec675c9793c38c54f49b5f1c` / [product categories](private/taiwu-11d97061f442f0a8ec675c9793c38c54f49b5f1c.jpg) | Select output type | Dedicated category controls rather than an undifferentiated catalogue |
| `ab46c33bd2efb8ad9464884ce906e01c471198f1` / [quantity](private/taiwu-ab46c33bd2efb8ad9464884ce906e01c471198f1.jpg) | Quantity, allocation, output destination | Slider/step/min/max controls sit by a craft action and resource information |
| `3672cacf36f9ec804eab4ff3abe3fbf4885025b1` / [affix choice](private/taiwu-3672cacf36f9ec804eab4ff3abe3fbf4885025b1.jpg) | No specific affix, selected affix or random option | A separate optional target choice; does not prove authored success arithmetic |
| `86ada340278fad33003e5be64e469aea6f2b7a59` / [material effect preview](private/taiwu-86ada340278fad33003e5be64e469aea6f2b7a59.jpg) | Inspect what the material contributes | Material-specific effect explanation in context, not just a grade badge |
| `f6edb1f7e74ba78a7c4d8cae2c15206560a58e74` / [target output](private/taiwu-f6edb1f7e74ba78a7c4d8cae2c15206560a58e74.jpg) | Compare products by required reagent/tool | The chooser displays requirements under each product; source highlights enlarge a subset |

All assets use `https://clan.akamai.steamstatic.com/images/32975615/<locator>.jpg`; complete exact URLs/hashes are in `private/taiwu-image-receipts.json`. Only entry lists, quantity, effect-preview and target-output images were visually inspected in detail; the other two were retained with the developer's caption and remain **documented**, not independently assessed geometry.

Limits: no click sequence, keyboard, scrolling,125/150% text, medicine result or current native build tested. This improves prior Taiwu A06's visual reference coverage, not its runtime acceptance. Relevant complete encyclopedia TSVs were retained separately; CraftTool/Medicine compiled row coverage is still not claimed.

## U2: ACS, historical walkthrough plus source trace

Walkthrough author **Ic0n Gaming**, [TUTORIAL SECT, Ep01](https://www.youtube.com/watch?v=nmRI2NrVsJ4), approximately35:54. Historical2021-era footage; exact build/mod state not established. Caption transcript exported through the browser and retained in full. Captions can be inaccurate, and are not original code.

| Exact locator / private capture | Depicted or stated | Coverage |
|---|---|---|
| [24:14 production catalogue/order](private/acs-production-2414.jpg), [source time link](https://www.youtube.com/watch?v=nmRI2NrVsJ4&t=1454s) | Bonfire production window has available product below and queued product above; queued card shows repeat/remove controls | **Depicted** selection/order, not verified input debit or completion |
| Transcript24:18–25:04 | Creator describes enabled worker taking the station order; cooking at24:37 | **Walkthrough statement**, not a fresh native execution trace. Do not treat every type of crafting as identical because the narrator generalizes |
| Transcript25:09–25:23 | Creator describes repeat count and specific-material selection | **Documented by walkthrough**, controls were not operated by this researcher |
| [28:49 placement](private/acs-28m49.jpg), [source time link](https://www.youtube.com/watch?v=nmRI2NrVsJ4&t=1729s) | Workstation selection next to a placement grid, with existing stock and world context | **Depicted** spatial placement; no feng-shui or pathfinding outcome independently tested |
| [32:18 stock area](private/acs-32m18.jpg) | Area tools and stock labels | **Depicted** storage context only, not a production queue or inventory accounting test |

The initial seek temporarily buffered, then rendered during independent work; no native game or alternative video download was used. Selection screenshots taken before fullscreen are retained as capture receipts but are cropped by the page viewport; prefer `acs-production-2414.jpg`.

The [existing production trace](../amazing-cultivation-simulator/traces/production.md), build17074448, supplies the separate mechanism chain and exact P01–P35 locators. This pass matched all ten selected config files and both assembly hashes against its pins. Missing old decompiled scratch means its managed bodies were not re-read. This is not a version match between that trace and the video.

Supplementary **modded UI**, not vanilla proof: tdsat's [YaogUI](https://github.com/tdsat/YaogUI), commit`5c39af310518727d2e3395f67c25ddde85ab02e5`. [Material selector](private/acs-yaogui-MaterialSelect.png) shows an adjacent two-column material choice; [talisman list](private/acs-yaogui-Talismans.png) shows filtered pattern selection. Author's README documents these changes. They support search/selection design comparison, not our claim that stock ACS offers those exact controls. Complete URLs and hashes in `private/yaogui-receipts.json`.

Official Steam screenshot `ss_fde8f4d1edbd78e4d2bb7b510d2c2bd585203104`, [collection UI](private/acs-official-collection.jpg), shows category progress, search and known/obscured entries. [Official store](https://store.steampowered.com/app/955900/Amazing_Cultivation_Simulator/?l=english). Media build unknown. It is a collection reference, not a causal experiment notebook or proof that hidden names/results are safe in every route.

## U3: Tale, historical alchemy sequence

Author **阿胡的遊戲頻道**, [鬼谷八荒：煉丹的方式](https://www.youtube.com/watch?v=fOcF6yfn7wc), published2021-06-12 according to retrieved search metadata,2:16 duration. Exact game build, mods and original source resolution unknown. Paused samples were inspected, not a continuous frame-by-frame replay. The researcher operated video controls, not the game.

| Time / private capture | What is visible | What remains unverified |
|---|---|---|
| [00:05](private/tale-005-full.jpg) | Character arts/recipe screen and selectable formula entries | Acquisition/learning operation and access costs |
| [00:30](private/tale-030.jpg) | Furnace/durability, eight labelled elemental meters, target amounts, ingredient stock and a quantity overlay | Exact UI arithmetic and whether every substitute is eligible |
| [00:55](private/tale-055.jpg), [01:08](private/tale-068.jpg) | Stock/allocated-input state and element contribution progression; cropped browser views | Full tooltip details, cancel and underlying debit timing |
| [01:35](private/tale-095.jpg) | A highlighted elemental refinement meter with other axes dimmed | Precise control timing/skill relationship and probability |
| [02:02](private/tale-122.jpg) | Result dialog with several item icons | Exact grade/quantity, actual downstream use, saved method and delegation |

The file`005-full` was captured by a different screenshot route and is cropped despite its filename; do not infer full-screen coverage from its name. The00:30 capture is the clearest whole crafting reference. No picture here is the banner asset excluded by the assignment.

Fresh backup inspection preserves complete `MakePillFormula`, `MakePillFurnace`, `MakePillSkill`, `ItemHerbal`, `ItemPill`, `ItemPillSpRequire`, `TownRefine` JSONs and the alchemy workbook. Formula6051011 has named identity/count fields plus eight elemental target fields and output-ID fields; furnace6061011 separates requirement/slots/effect references. These are **source structure**. Header meanings, referenced effect consumers, full crafting bodies, save behavior and current-build match remain unresolved. It does not establish unlimited invention or automation.

## U4: Potion Craft, named discovery/save gap

Primary [official store](https://store.steampowered.com/app/1210320/Potion_Craft_Alchemist_Simulator/), niceplay games/tinyBuild. [Official screenshot0](private/potion-craft-official-0.jpg), asset`ss_a5197ad5bb35e9899c9e751820cdb9dbc0ceb308`,1920×1080, media build unknown, fetched2026-10-15. Store API response/URL/hash retained. The store page describes v2.0 additions, but that does **not** prove this image was captured on v2.0.

Caption: ingredient stock at right, current experimental path in center, preparation tools below, and save/finish controls at left. This makes the ongoing method and its retention visible together. The official description separately documents grinding/mixing/heating/base and route-based combinations with customer uses. No interactive recipe-save, resume, batch or stock-consumption behavior was tested. The finite set of implemented effects is distinct from the many recipes/routes used to produce them.

## U5: YAIR incumbent and viewport boundary

Read-only current source snapshot plus [saved S3 mixing screenshot at1366×768](../../gm/dispatch/ui-foundation-2026-10-15/evidence/s3-mixing-1366.png), inspected this pass. It shows stock/selection, cost/blocker/work/result feedback, destination Back and a distinct log region. Its center is already dense; adding a permanent notebook beneath every result would compete for space. That is a visual assessment of a historical generated test image, not a rebuilt current runtime check or a personal save.

Current source and the historical picture must not be conflated with the later Proto23 Shell. No new build, origin or gameplay session was created. Any proposal must be proved again by the owning UI implementation lane at populated1366×768, including useful inventory space, legible feedback, no ordinary page scroll, region overflow, return restoration and larger text. Human visual acceptance remains separate.

## Coverage summary

| Decision | Strongest evidence here | Remaining authoritative evidence |
|---|---|---|
| Ingredients/tools/quantities and requirements | Taiwu developer images; Tale meters | Exact native click/keyboard and scaled-text trial |
| Choice → delegated order | ACS24:14 image plus transcript and separate code trace | Native work-start, cancel/refund/shortage and repeat trial |
| Ordered preparation and changed feedback | Direct book passages; Tale refinement samples | A selected YAIR rule with a real consumer |
| Discover a route and retain it | Potion Craft official screenshot/save control | Interactive saving/replay and notebook comparison behavior |
| Usable output | ACS code consumers; YAIR source effect; Tale result depiction | Native use plus Save/reload/literal Import |
| Multiple ingredient uses | Relevant Taiwu/ACS tables and typed incumbent design | Selected cross-use consumer and conserved stock in actual play |

No screenshot proves all six rows. Native trials are deferred by the assignment, not substituted with store footage.

## U6: Round2 official Ryza2 manual examples

The [online comparison](ONLINE_COMPARISONS.md#o1-atelier-ryza-2-ingredient-selection-exposes-consequences) adds three preserved official images: a1080×608 material-selection screen, a600×544 numbered loop-detail crop and a240×240 recipe-morph icon. Only the first is a full composition example. The exact asset URLs/SHA256 are in `private/round2/web-receipts.json`. The2020–2021 manual does not pin executable build, screenshot platform or native input behavior. Visual inspection supports adjacent material/detail/output information; the manual separately documents process mechanics. No real interaction, laptop scaling, save or Mac compatibility claim follows.
