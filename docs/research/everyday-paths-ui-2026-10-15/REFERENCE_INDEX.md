# Reference index

Deep copyrighted tables, screen captures, walkthrough text and decompiled bodies are in [private/](private/). Verified before writing: `git check-ignore -v docs/research/everyday-paths-ui-2026-10-15/private/probe` matched `.gitignore:41`, `/docs/research/*/private/`. Public reports paraphrase and link. No raw assets belong in gameplay or publication.

| Record | Location and purpose |
|---|---|
| Exact source URLs and private file mapping | `private/SOURCE_LOCATORS.json`; original browser bundle receipts `il-guide-assets.json`, `il-guide-cloud-source.json` |
| Integrity | `private/HASHES.json`; all private retained files hashed except this self-referential hash file |
| Build and redecompile receipts | `private/BUILD_RECEIPT.json`, `private/REDECOMPILE.md` |
| Full Immortal Life tables | `resources_17069_Fishing` (59 records), `resources_17249_FishingRod` (3), `resources_17180_FishingPoint` (11), `resources_17098_FishingQTE` (9), `resources_17071_FishingRule` (11 root fields). UTF-8 JSON despite extensionless names. Tables structurally inspected; not every row semantically audited. |
| Exact field references and UI sequences | `private/DEEP_NOTES.md`; condition/rod/sample IDs, source spans, costs, unknowns and conflict |
| Full retained Stardew tables | `Machines.xnb.json`, `CookingRecipes.xnb.json`, `Objects.xnb.json`; reader metadata and full content preserved. Original acquisition provenance remains with the [existing dossier](../stardew-valley/TOOLING.md). |
| Newly extracted method bodies | `private/code/FishingRod.cs`, `private/code/BobberBar.cs`; selected spans reviewed, not whole-class/game semantic coverage |
| Original guide text/full available fishing tables | `stardew-fishing-page.txt` (revision193904), `melvor-fishing-page.txt` (revision86852), `immortallife-fishing-page.txt` (revision24629), `immortallife-worstcase11-guide.txt`, `melvor-enjar-page.txt` |
| Captioned screen evidence | [UI_EVIDENCE](UI_EVIDENCE.md); image names there resolve inside `private/` |

Retained source-owner links: [Stardew](../stardew-valley/REPORT.md), [Melvor](../melvor-idle/REPORT.md), [Immortal Life](../immortal-life/REPORT.md), [Taiwu](../scroll-of-taiwu/REPORT.md), [ACS production](../amazing-cultivation-simulator/traces/production.md), [Tale](../tale-of-immortal/pass-2026-10-14/REPORT.md). No changes to them.

Production ownership stays with the [materials/alchemy audit](../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [crafting/consumables considerations](../../PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md) and companion research. This folder owns fishing/gardening questions, not a second material resolver.

Follow-up: [PATH_PROPOSALS](PATH_PROPOSALS.md), private `FOLLOWUP_SOURCE_NOTES.md` and `FOLLOWUP_RECEIPT.json` retain two new class exports, five more full growing/care tables and exact original spans for bait/sprinkler consumers. The complete selected class bodies are in `private/code/`; source spans copied from older extracts retain their original line numbers in the receipt.

## Farming/delegation deep dive

[FARMING_DELEGATION_DEEP_DIVE](FARMING_DELEGATION_DEEP_DIVE.md) and [FARMING_DELEGATION_UI](FARMING_DELEGATION_UI.md) own this follow-up. Private root: `private/farming-delegation/`.

| Record | Retained reference |
|---|---|
| Fresh ACS exports | `ACS_EXPORT_RECEIPT.json`, complete13 `acs/*.cs` classes; managed assembly matches prior audit hash |
| Complete selected configurations | `DATA_RECEIPT.json`: six live ACS XMLs, ten full IL JSON tables including Language, plus three declaration spans |
| Exact reviewed spans and boundaries | `SOURCE_NOTES.md` |
| Actual UI and provenance | `ui/`, `ACS_UI_RECEIPT.json`, `ACS_FARM_UI_RECEIPT.json`, `IL_UI_RECEIPT.json`, `IL_UI_EXTRA_RECEIPT.json`, `IL_UI_EXTRA2_RECEIPT.json` |
| Full available guide text | `il-guide-2026-10-15.txt`; version and translation limits in the UI report |

All raw donor material remains ignored; whole retained tables/classes do not imply every row/path was semantically audited. Immortal Life native bodies and modern donor interactive UI remain unverified.

## Existing YAIR fit and Taiwu

[EXISTING_SYSTEM_FIT_AND_PROPOSALS](EXISTING_SYSTEM_FIT_AND_PROPOSALS.md) records EG1–EG8, TF1–TF3 and EP1–EP5. `private/existing-fit/RECEIPT.json` pins15 current source files with selected line-numbered snapshots and six reused Taiwu source/media records. Full retained BuildingDomain and ProfessionData, role/month encyclopedia tables, official input/tool UI image and original donor input pins remain private. Re-read spans: BuildingDomain1387–1465,2761–2825,9581–9620; ProfessionData1–85 and135–170. No specific Taiwu farmer/fisher profession ability or personal fishing screen was verified. Official crafting media and managed source are distinct evidence layers; source paths/hashes retain provenance without a fresh native compatibility claim.

## Fleshed-out life/path proposals

- [River keeper](FISHING_PATH_PROPOSAL.md): RF1–RF5, original fishing purpose, outing, capability examples, discovery, assignment and involvement-dependent UI.
- [Courtyard grower](FARMING_PATH_PROPOSAL.md): CG1–CG5, original farming cycle, area example, skill/power contributions, discovery and mixed personal/delegated care.
- [Land/area/UI model](LAND_AREA_AND_INVOLVEMENT_UI.md): LA1–LA3, A1–A10 reference distinctions, UX1–UX2 paper layouts, DS1–DS2 state/lifecycle/disposition.

No new external factual research or donor extraction was needed for this design pass. These examples reuse the qualifications and sources in EXISTING_SYSTEM_FIT_AND_PROPOSALS and the donor reports. No fictional local rule, power capacity, area number, seed coverage or UI control is claimed as existing content or accepted tuning. No standalone prototype was built.


## Interactive studies and broader implications, 2026-10-15

User authorized mockups and subsequently requested better ideas/parity, potion and other menus, future cheat menus, studio improvements, future abstractions/integration, and direct farming-block interaction. Saved [interactive viewer and guide](mockups/README.md), [parity/menu/studio/abstraction proposals](MOCKUP_PARITY_AND_IMPLICATIONS.md), and [current mining flow versus proposed path](MINING_FLOW_AND_PATH_PROPOSAL.md). The viewer includes21 main scenes plus adjacent-pursuit cards and bed-specific previews; actual farm blocks now select their target directly. Full captures and browser/interaction receipts are in mockups/. All fixtures remain fictional proposals. No gameplay, source, persistence, build, save, canonical-owner or accepted-product change. Previous entries describing paper-only/no-prototype scope remain dated history; a standalone interactive design artifact now exists.

Current mining source spans and hashes retained privately; new Factorio primary documentation locators supplement existing ACS/IL/Taiwu/Stardew/Melvor comparisons. Factorio documentation is not native UI proof. Full native IL behavior, selected donor interaction and production parity remain separate open evidence. Browser checks cover this mockup at1366×768, not a rebuilt YAIR populated save. Mobile and engine implementation deferred. Only this research folder was written; no workers, messages, commit or push.


## Selectable fishing/mining targets, 2026-10-15

Completed the requested mockup-only follow-up in [FISHING_MINING_INTERACTIVE_CHOICES](FISHING_MINING_INTERACTIVE_CHOICES.md). Three fishing reaches and three faces of the same known seam are directly selectable; target, skill, sensing/control and method change the inspector, blocked reasons and preview. Investigation/delegation retain selected context and responsibility. Existing Current flow remains separate.36 scenario combinations plus targeted interactions checked;21 main captures refreshed at1366×768. No game implementation, actual-world balance, native parity, save or accepted-product change. Larger-text and native acceptance remain open if a candidate is later selected. All writes stayed in this research folder; no new donor acquisition, workers, messages, commit or push.
