# UI evidence and coverage

Captured/read 2026-10-15 in background browser tabs or local read-only extracts. These are depictions of donor screens and source-derived sequences, not interactions performed inside a game. Raw images and extensive text remain in the verified gitignored [private folder](private/). Hashes and source locators: [reference index](REFERENCE_INDEX.md).

## E1–E4: Stardew Valley

Source: ConcernedApe's [official trailer](https://www.youtube.com/watch?v=ot7uXNQskhs), linked from the [official press page](https://www.stardewvalley.net/press/). This is the original launch-era trailer, approximately 3:09; exact depicted executable revision is unknown. It must not be labeled installed 1.6.15 evidence. Browser frames are 1280×720 including page chrome, not full-resolution game captures or YAIR's 1366×768 acceptance target.

| ID | Exact locator / retained file | Depicted finding | Limit |
|---|---|---|---|
| E1 | [00:50](https://www.youtube.com/watch?v=ot7uXNQskhs&t=50s), `private/stardew-trailer-0050-farm.jpg` | Populated crop rows, pathways, machine-ready bubbles and a harvest notice in a local field. | Does not establish irrigation coverage, NPC automation or exact plant state. |
| E2 | [01:20](https://www.youtube.com/watch?v=ot7uXNQskhs&t=80s), `private/stardew-trailer-0080-crabpots.jpg` | Crab pots in water with output icons; character, hotbar and energy context remain visible. | Placement and ready feedback depicted; admission/bait costs not shown. |
| E3 | [01:22.9](https://www.youtube.com/watch?v=ot7uXNQskhs&t=82s), `private/stardew-trailer-0082.9-collection.jpg` | Some pots have been collected; catch stock/notifications appear. | Observed edited footage, not a controlled input/stock test. Some UI overlays reflect the YouTube player. |
| E4 | [Fishing revision 193904](https://stardewvalleywiki.com/mediawiki/index.php?title=Fishing&oldid=193904), image [`Fishingicons.png`](https://stardewvalleywiki.com/mediawiki/images/1/10/Fishingicons.png), `private/stardew-fishingicons.png` | Two cropped minigame bars depict fish, controlled region and catch progress. | An illustrative composite, not a screen sequence. Wiki-owned community documentation is distinct from developer executable proof. |

E4 documentation describes casting, bite cue, hooking, control, named catch and later collection inspection. The newly extracted `FishingRod` and `BobberBar` bodies independently support selected skill, bait and spatial causes. The screenshot cannot prove timing feel, keyboard accessibility, enjoyment or clock/persistence behavior. `FishZone.png`, retained as `private/stardew-bubbles.png`, shows a bubble patch only; it is not a depth map or proof of a full ecological simulation.

![E2, official launch-era trailer: ready crab pots at 01:20](private/stardew-trailer-0080-crabpots.jpg)

## E5–E7: Melvor Idle

Source: Enjar's first-person [Making Money Fishing](https://enjargames.com/melvor-idle-or-making-money-fishing). These are attributed original player screenshots, not developer-provided media. Atlas of Discovery branding is visible; precise app version and image dates are not shown. Keep them as an independent historical UI snapshot. The existing source audit's v1.3.1/script12097/data528 pin is **not** their version. Image sizes: 1921×1033 for full screens, 497×496 for mastery detail.

| ID | Source image / local file | Depicted evidence | Limit |
|---|---|---|---|
| E5 | Article `random fishing.jpg`, `private/melvor-enjar-random.jpg` | Region cards combine available species with adjacent selected species detail, interval, mastery and Start; a fixed sidebar gives skill routes. | No clicks were performed. Visual order supports a comparison, not a proven tab/focus order. |
| E6 | Article `whales for days.jpg`, `private/melvor-enjar-bank.jpg` | Selected whale has Stop Fishing and activity/reward feedback; other cards retain Start. | Filename is a retrieval alias; this is an active fishing screen, **not** a bank screen. It does not verify offline settlement. |
| E7 | Article `mastery pool for fishing.jpg`, `private/melvor-enjar-mastery.jpg` | Threshold detail explains consequences of pool checkpoints. | Static detail; spending and reversal effects come only from separately inspected source. |

The article's `fishing.jpg` lead image is retained as `private/melvor-enjar-fishing.jpg` but its large title obscures controls. E5/E6 are the useful interface evidence. The earlier downloaded `private/melvor-fishing-card.png` is a fish **icon**, rejected as UI evidence after inspection. It is not a selection card.

Exact image URLs remain in `private/SOURCE_LOCATORS.json`. For a versioned developer statement, the [v1.3 quality-of-life announcement](https://news.melvoridle.com/free-content-quality-of-life-updates-coming-in-v1-3/) says XP and interval would be visible without selecting a fish. That is documented intent, not proof of today's interactive client. The [wiki revision 86852](https://wiki.melvoridle.com/index.php?title=Fishing&oldid=86852) records area/skill rules; executable evidence is still the older local dossier, whose bulk-code directory was not found at its recorded path in this pass.

![E6, Enjar's historical Melvor capture: selected active work alongside other targets](private/melvor-enjar-bank.jpg)

## E8–E14: Immortal Life

Main visual source: worstcase11's [Beginners Guide to Immortal Life (WIP)](https://steamcommunity.com/sharedfiles/filedetails/?id=2855330245), chapters 6, 7a and 8. Posted August 28, 2022; page shows updated March 26, 2025. Header still says V0.7.xx with a V1.0.xx revision pending. Images are 1920×1080 and may come from different builds. Do not attach the installed-data dossier's build17861603 to these frames. UGC IDs and complete URLs are in `private/il-guide-assets.json`; the cloud has its own receipt.

| ID | UGC identifier / local file | Depicted evidence and interpretation |
|---|---|---|
| E8 | `1925877218917160608/A321740F1633DEDD387EA15613F0242899F3EB7D`, `il-guide-aa492cacdf92a89e.jpg` | Map selection with adjacent known-fish detail and map/calendar tabs. Shows an opportunity locator, not a live forecast. |
| E9 | `2453977469295377108/8BECFF296363DADD140CCE31771485018D314A9D`, `il-guide-78ecbdb48fab03cf.jpg` | Northern Fishery repair selection, held/required resources, one red shortage, time and disabled-looking Make. A still cannot establish enforced rejection. |
| E10 | `2061007234582252814/E4402B581F87B9F3647F9A5AADC4EF83D1E6BA4A`, `il-guide-cd07d246a81bb062.jpg` | Named fish catch and new-record presentation. Does not show the complete bite/hook inputs. |
| E11 | `2478742831196256072/8D4ED1DCE86BE6A3451CC5084AD3A776B2EC3158`, `il-guide-6a2958cadf239ebd.jpg` | Named NPC patrol return, destination list, selected place, returned stacks and Claim all. No dispatch duration or collection action exercised. |
| E12 | `1925877686190049346/0CDB515926FDA129501DE82CB57052BD4AF08E0B`, `il-guide-0aff7d796a0aa4c7.jpg` | Tilled field, selected tile, seed hotbar/counts and planting prompt. |
| E13 | `1925877686190051026/8DD1C71CD6E8F3CBF23512FE903AB705354D14E3`, `il-guide-cloud.jpg` | Gourd, cloud, rain and selected tile, with mana/physical bars and tutorial instruction. Depicts a qualitative area-action method, not just a production-rate label. |
| E14 | `1851564166860937489/BD083A8496173EAB24B2FF116B166DA3DDED41DD`, `il-guide-95c9d0e1588f679e.jpg` | Kitchen tutorial labels distinct preparation stations. No completed recipe, free-form invention or consumer settlement proved. |

The additional Fishery repair and ordinary watering frames are retained but add no essential missing stage. The guide describes a connected teaching/catch/cooking route and selectable patrols; it is an attributed walkthrough, not our native verification. [Official wiki revision24629](https://immortallife.wiki.gg/wiki/Fishing?oldid=24629) supplies documented conditions and patrol rules; [official store](https://store.steampowered.com/app/1201230/Immortal_Life/) independently names fishing and spell farming. Full fish tables were retained privately. Wiki patrol season restrictions conflict with the guide and remain unresolved.

![E11, worstcase11 guide: selected fishing destination and NPC return](private/il-guide-6a2958cadf239ebd.jpg)

![E13, worstcase11 guide: magical watering depiction](private/il-guide-cloud.jpg)

## Sequence coverage and remaining proof

| Stage | Strongest retained reference | Still unknown |
|---|---|---|
| Locate opportunity | E8 map/detail, E5 regional targets | Discovery gating and free inspection in current donor builds |
| Prepare/access | E9 resource quote; E12 tools/seeds; Stardew code | Complete rod/bait selection and failed-admission sequence |
| Personally act | E4 minigame diagram; E13 area-action depiction | Bite/hook timing, control feel and current accessibility |
| Read results | E2→E3 pot collection; E10 catch; E6 work feedback | Input/output conservation across the entire donor journey |
| Inspect knowledge | E8 known-fish pane; E7 mastery detail | Exact acquisition conditions and hidden-information safety |
| Manage repetition | E6 ongoing action; E11 patrol return | Current seasonal filtering, stop/cancel/reload settlement |
| Use output | Newly inspected Stardew machine records; existing Melvor food trace; E14 kitchen | A native catch→use run from one isolated save |

No full UI sequence was established for Taiwu, ACS or Tale in this pass. Their existing managed-code/configuration/workbook claims remain in their own dossiers. The marketing assets sampled on the Immortal Life store did not add a verified interaction, so no mechanism depends on them. All YAIR geometry, scrolling, keyboard and human acceptance gates remain open.
