# Local tabletop catalog

Prepared 2026-10-14. Original capture/extraction snapshot; full-book reading remains **not read**. Selected-section reading is recorded in [implementation considerations](implementation-considerations/REPORT.md). Titles below identify files, not proven ownership or a full collection. Existing originals remain untouched. Source text and original-path/hash manifests are private and gitignored.

F2. Original preparation snapshot: 60 usable file records, 59 distinct file hashes, including one Eclipse Phase ZIP and its extracted members. 6,555 PDF pages counted across file records; duplicates count in this page total. 30,558 indexed page/section records include Ars Magica. Zero parse failures. A failed Ironsworn transfer is retained privately and superseded by the complete author-hosted PDF.

## F3. Preparation refresh for 11 added local records, 2026-10-14

Existing `manage_library.py prepare` completed. Manifest: 72 total records, 71 present downloaded/linked records with 70 distinct hashes; these include seven PDF parse failures and the collection archive. The earlier failed Ironsworn transfer remains separately recorded. **Presence is not usable extraction.** Counted PDF pages: 7,371 across successfully parsed records; this excludes unreadable files and still includes duplicates. Index: 31,371 page/section records. Four of the 11 additions prepared successfully; seven failed. No originals were altered.

| Added title (filename unless internally inspected) | Counted PDF pages | Preparation | Local copy |
|---|---:|---|---|
| Imperium Maledictum - Core Rulebook by Cubicle 7. | unavailable | parse_failed | [Open](<private/existing/Imperium-Maledictum-Core-Rulebook-by-Cubicle-7.pdf>) |
| Path of the Planebreaker | unavailable | parse_failed | [Open](<private/existing/Path-of-the-Planebreaker.pdf>) |
| Warhammer Fantasy Roleplay 4e Core | unavailable | parse_failed | [Open](<private/existing/Warhammer-Fantasy-Roleplay-4e-Core.pdf>) |
| Warhammer 40,000 - Core Book 9th Edition | unavailable | parse_failed | [Open](<private/existing/Warhammer-40-000-Core-Book-9th-Edition.pdf>) |
| Mutants  Masterminds Power Profiles | 225 | parsed_and_text_extracted | [Open](<private/existing/Mutants-Masterminds-Power-Profiles.pdf>) |
| GURPS Basic Set Characters | 338 | parsed_and_text_extracted | [Open](<private/existing/GURPS-Basic-Set-Characters.pdf>) |
| GURPS Basic Set Campaigns | 242 | parsed_and_text_extracted | [Open](<private/existing/GURPS-Basic-Set-Campaigns.pdf>) |
| Numenera Into the Outside | unavailable | parse_failed | [Open](<private/existing/Numenera-Into-the-Outside.pdf>) |
| GURPS 4th edition. How to Be a GURPS GM High-Powered Origins | 11 | parsed_and_text_extracted | [Open](<private/existing/GURPS-4th-edition-How-to-Be-a-GURPS-GM-High-Powered-Origins.pdf>) |
| The Strange In Translation The Strange Character Options | unavailable | parse_failed | [Open](<private/existing/The-Strange-In-Translation-The-Strange-Character-Options.pdf>) |
| Warhammer Age of Sigmar Soulbound Rulebook | unavailable | parse_failed | [Open](<private/existing/Warhammer-Age-of-Sigmar-Soulbound-Rulebook.pdf>) |

GURPS Characters internally identifies Fourth Edition, third printing, February 2008 (PDF pp.2-3). Selected rules were read; this does not validate every page of either Basic Set volume. In Translation failed both pypdf preparation and a bounded Poppler read; its rules are not used as evidence in this report. Other failed files were not repaired or exhaustively diagnosed. See private manifest for errors and hashes.

## Existing library

| Title | Pages | Local research copy |
|---|---:|---|
| Numenera Technology Compendium Sir Arthour’s Guide to the Numenera | 162 | [Open](private/existing/Numenera-Technology-Compendium-Sir-Arthour-s-Guide-to-the-Numenera.pdf) |
| Numenera Destiny | 418 | [Open](private/existing/Numenera-Destiny.pdf) |
| Numenera Ninth World Bestiary | 162 | [Open](private/existing/Numenera-Ninth-World-Bestiary.pdf) |
| Arcana of the Ancients | 306 | [Open](private/existing/Arcana-of-the-Ancients.pdf) |
| The Strange Worlds Numberless and Strange | 226 | [Open](private/existing/The-Strange-Worlds-Numberless-and-Strange.pdf) |
| The Strange Players Guide | 98 | [Open](private/existing/The-Strange-Players-Guide.pdf) |
| Numenera Ninth World Guidebook | 258 | [Open](private/existing/Numenera-Ninth-World-Guidebook.pdf) |
| Cypher System Rulebook | 418 | [Open](private/existing/Cypher-System-Rulebook.pdf) |
| Numenera Player’s Guide | 65 | [Open](private/existing/Numenera-Player-s-Guide.pdf) |
| Numenera Corebook | 417 | [Open](private/existing/Numenera-Corebook.pdf) |
| Numenera Voices of the Datasphere | 162 | [Open](private/existing/Numenera-Voices-of-the-Datasphere.pdf) |
| The Strange | 418 | [Open](private/existing/The-Strange.pdf) |
| Beasts Of Flesh  Steel | 194 | [Open](private/existing/Beasts-Of-Flesh-Steel.pdf) |
| Rifts Dimension Book 07 - Megaverse Builder | 98 | [Open](private/existing/Rifts-Dimension-Book-07-Megaverse-Builder.pdf) |

## Acquired free assets

| Title | Kind | Pages | Source | Local file |
|---|---|---:|---|---|
| D&D SRD 5.2.1 | reference_document | 364 | [Source](https://www.dndbeyond.com/srd) | [Open](<private/sources/dnd/SRD_CC_v5.2.1.pdf>) |
| Cypher System Reference Document 2025-08-22 | reference_document |  | [Source](https://csol.montecookgames.com/license/) | [Open](<private/sources/cypher/Cypher-System-Reference-Document-2025-08-22.docx>) |
| Cypher System Open License | license | 2 | [Source](https://csol.montecookgames.com/license/) | [Open](<private/sources/cypher/Cypher-System-Open-License.pdf>) |
| Blades in the Dark Player Kit v8.2 | playkit | 32 | [Source](https://bladesinthedark.com/downloads) | [Open](<private/sources/blades/Blades-Playerkit-v8-2.pdf>) |
| Eclipse Phase Second Edition Quickstart November 2023 | quickstart | 37 | [Source](https://eclipsephase.com/) | [Open](<private/sources/eclipse-phase/Eclipse-Phase-2e-Quickstart-Nov2023.pdf>) |
| Ironsworn Playkit | playkit | 10 | [Source](https://tomkinpress.com/collections/free-downloads/products/ironsworn-playkit) | [Open](<private/sources/ironsworn/Ironsworn-Playkit.pdf>) |
| Ironsworn Asset Cards | playkit | 19 | [Source](https://tomkinpress.com/collections/free-downloads/products/ironsworn-printable-asset-cards) | [Open](<private/sources/ironsworn/Ironsworn-Assets.pdf>) |
| Starforged Rules and Setting Primer | preview | 33 | [Source](https://tomkinpress.com/collections/free-downloads/products/ironsworn-starforged-rules-setting-primer) | [Open](<private/sources/ironsworn/Starforged-Rules-Setting-Primer.pdf>) |
| RuneQuest Quickstart | quickstart | 50 | [Source](https://www.chaosium.com/runequest-rpg/) | [Open](<private/sources/runequest/RuneQuest-Quickstart.pdf>) |
| Pendragon 6e Sword Tournament quickstart | quickstart | 28 | [Source](https://www.chaosium.com/pendragon-quick-start/) | [Open](<private/sources/pendragon/Sword-Tournament-6e-Quickstart.pdf>) |
| D&D SRD 5.1 | reference_document | 403 | [Source](https://www.dndbeyond.com/srd) | [Open](<private/sources/dnd/SRD-5.1.pdf>) |
| Worlds Without Number Free Edition | full_free_edition | 352 | [Source](https://www.drivethrurpg.com/en/product/348809/worlds-without-number-free-edition) | [Open](<private/sources/free-core/WorldsWithoutNumber_FreePDF_040221.pdf>) |
| Stars Without Number Revised Free Edition | full_free_edition | 261 | [Source](https://www.drivethrurpg.com/en/product/230009/stars-without-number-revised-edition-free-version) | [Open](<private/sources/free-core/StarsWithoutNumberRevised-FreeEdition-122917.pdf>) |
| Godbound Free Edition | full_free_edition | 193 | [Source](https://www.drivethrurpg.com/en/product/185959/godbound-a-game-of-divine-heroes-free-edition) | [Open](<private/sources/free-core/Godbound_FreeVersion-062516.pdf>) |
| Ironsworn Core Rulebook | full_free_edition | 270 | [Source](https://shawn-tomkin.itch.io/ironsworn) | [Open](<private/sources/free-core/Ironsworn-Rulebook.pdf>) |
| Eclipse Phase Second Edition shared collection | collection_archive |  | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/Eclipse Phase Second Edition.zip>) |
| EP2_errata_major_version1.3 | collection_member | 5 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10000 - Eclipse Phase Second Edition/EP2_errata_major_version1.3.pdf>) |
| EP2_references | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10000 - Eclipse Phase Second Edition/EP2_references.pdf>) |
| EclipsePhase_SecondEdition_CharacterSheet | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10000 - Eclipse Phase Second Edition/EclipsePhase_SecondEdition_CharacterSheet.pdf>) |
| EclipsePhase_SecondEdition_v1.3 | collection_member | 435 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10000 - Eclipse Phase Second Edition/EclipsePhase_SecondEdition_v1.3.pdf>) |
| EclipsePhase_NeedToKnow_Preview | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10001 - Eclipse Phase Second Edition Quick-Start Rules/EclipsePhase_NeedToKnow_Preview.pdf>) |
| PS+10001_EclipsePhaseSecondEdition_QuickStartRulesAcrimony_Nov2023 | collection_member | 37 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10001 - Eclipse Phase Second Edition Quick-Start Rules/PS+10001_EclipsePhaseSecondEdition_QuickStartRulesAcrimony_Nov2023.pdf>) |
| PS+10002_RouterCaseFiles1.0 | collection_member | 27 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10002 - GM Screen & Router Case Files/PS+10002_RouterCaseFiles1.0.pdf>) |
| EclipsePhase_CharacterOptions | collection_member | 154 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10003 - EP2 Character Options/EclipsePhase_CharacterOptions.pdf>) |
| EclipsePhaseSecondEdition_CondensedPlayersGuide | collection_member | 115 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+10006 - EP2 Condensed Player's Guide/EclipsePhaseSecondEdition_CondensedPlayersGuide.pdf>) |
| EclipsePhaseSecondEdition_RulesPrimer | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18000 - EP2 Rules Primer/EclipsePhaseSecondEdition_RulesPrimer.pdf>) |
| Placeholder - Setting Primer | collection_member | 1 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18001 - Setting Primer/Placeholder - Setting Primer.pdf>) |
| EclipsePhase_NanoOp1_Grinder | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18002 - Nano Op 1 Grinder/EclipsePhase_NanoOp1_Grinder.pdf>) |
| EclipsePhase_NanoOp2_BetterOnTheInside | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18003 - Nano Op 2 Better on the Inside/EclipsePhase_NanoOp2_BetterOnTheInside.pdf>) |
| EclipsePhase_NanoOp3_BodyCount | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18004 - Nano Op 3 Body Count/EclipsePhase_NanoOp3_BodyCount.pdf>) |
| EP2_Xenovore_GMMaps | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18005 - Xenovore/EP2_Xenovore_GMMaps.pdf>) |
| EP2_Xenovore_PlayerMaps | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18005 - Xenovore/EP2_Xenovore_PlayerMaps.pdf>) |
| EclipsePhase_Xenovore(1.0.0) | collection_member | 42 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18005 - Xenovore/EclipsePhase_Xenovore(1.0.0).pdf>) |
| EclipsePhase_XenovoresFate | collection_member | 67 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18006 - Xenovore's Fate/EclipsePhase_XenovoresFate.pdf>) |
| EclipsePhaseSecondEdition_CharacterPack(1.3)_creativecommons | collection_member | 38 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18007 - Character Pack/EclipsePhaseSecondEdition_CharacterPack(1.3)_creativecommons.pdf>) |
| EclipsePhase_Overrun(1.0.1) | collection_member | 28 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18008 - Overrun/EclipsePhase_Overrun(1.0.1).pdf>) |
| EclipsePhase_NanoOp4_AllThatGlitters | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18009 - Nano Op 4 All That Glitters/EclipsePhase_NanoOp4_AllThatGlitters.pdf>) |
| EclipsePhase_NanoOp5_Binge | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18014 - Nano Op 5 Binge/EclipsePhase_NanoOp5_Binge.pdf>) |
| EclipsePhase_NanoOp6_DividedIntentions | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18015 - Nano Op 6 Divided Intentions/EclipsePhase_NanoOp6_DividedIntentions.pdf>) |
| EclipsePhase_NanoDrop2_Motifs | collection_member | 3 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18016 - Nano Drop 2 Motifs/EclipsePhase_NanoDrop2_Motifs.pdf>) |
| NanoDrop1_FirewallScratchSpace | collection_member | 5 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18017 - Nano Drop 1 Firewall Scratch Space/NanoDrop1_FirewallScratchSpace.pdf>) |
| EclipsePhase_NanoOp7_Unbodied | collection_member | 2 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18019 - Nano Op 7 Unbodied/EclipsePhase_NanoOp7_Unbodied.pdf>) |
| EclipsePhase_MultiplicityandSynthesis | collection_member | 15 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18021 - Multiplicity and Synthesis/EclipsePhase_MultiplicityandSynthesis.pdf>) |
| EclipsePhase_FlexbotConfidential | collection_member | 12 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18022 - Flexbot Confidential/EclipsePhase_FlexbotConfidential.pdf>) |
| EclipsePhase_MindTheWMD_Resleeved | collection_member | 34 | [Source](https://robboyle.info/) | [Open](<private/sources/eclipse-phase/extracted/PS+18023 - Mind the WMD Resleeved/EclipsePhase_MindTheWMD_Resleeved.pdf>) |
| Basic Roleplaying quickstart | quickstart | 50 | [Source](https://www.chaosium.com/basic-roleplaying/) | [Open](<private/sources/brp/BRP-Quickstart.pdf>) |

## Ars Magica repository

Commit `fd0e31fc3e1a7265adc059908dc00a60cbc4a515` from the [publisher-linked repository](https://github.com/OriginalMadman/Ars-Magica-Open-License). Complete repository captured, including its license and supporting assets. **34 reviewed, 20 work-in-progress and 2 community Markdown entries**. These are file-status counts, not 56 unique official books or a verified reconciliation of the publisher's 53-title release. Some entries are ancillary or alternative versions. Source proofreading status is distinct from our reading state.

| Entry | Repository status | Local source |
|---|---|---|
| Ars Magica - Definitive Edition (Core Rules) | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica - Definitive Edition (Core Rules).md>) |
| Ars Magica 3e - Lion of the North - The Loch Leglean Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 3e - Lion of the North - The Loch Leglean Tribunal.md>) |
| Ars Magica 3e - Tribunals of Hermes - Rome | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 3e - Tribunals of Hermes - Rome.md>) |
| Ars Magica 4e - Heirs to Merlin - Stonehenge Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 4e - Heirs to Merlin - Stonehenge Tribunal.md>) |
| Ars Magica 4e - Icelandic Wars - Land of Fire and Ice | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 4e - Icelandic Wars - Land of Fire and Ice.md>) |
| Ars Magica 4e - Sanctuary of Ice - The Greater Alps Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 4e - Sanctuary of Ice - The Greater Alps Tribunal.md>) |
| Ars Magica 5e - Against the Dark - The Transylvanian Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Against the Dark - The Transylvanian Tribunal.md>) |
| Ars Magica 5e - Art & Academe | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Art & Academe.md>) |
| Ars Magica 5e - City & Guild | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - City & Guild.md>) |
| Ars Magica 5e - Covenants | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Covenants.md>) |
| Ars Magica 5e - Dies Irae - A Book of Wrathful Days | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Dies Irae - A Book of Wrathful Days.md>) |
| Ars Magica 5e - Guardians of the Forests - The Rhine Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Guardians of the Forests - The Rhine Tribunal.md>) |
| Ars Magica 5e - Hooks | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Hooks.md>) |
| Ars Magica 5e - Houses of Hermes - Mystery Cults | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Houses of Hermes - Mystery Cults.md>) |
| Ars Magica 5e - Houses of Hermes - Societates | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Houses of Hermes - Societates.md>) |
| Ars Magica 5e - Houses of Hermes - True Lineages | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Houses of Hermes - True Lineages.md>) |
| Ars Magica 5e - Lands of the Nile - Egypt, Ethiopia & Nubia | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Lands of the Nile - Egypt, Ethiopia & Nubia.md>) |
| Ars Magica 5e - Legends of Hermes | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Legends of Hermes.md>) |
| Ars Magica 5e - Lords of Men | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Lords of Men.md>) |
| Ars Magica 5e - Magic - Ancient Magic | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Magic - Ancient Magic.md>) |
| Ars Magica 5e - Magic - Apprentices | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Magic - Apprentices.md>) |
| Ars Magica 5e - Magic - Hedge Magic (Revised) | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Magic - Hedge Magic (Revised).md>) |
| Ars Magica 5e - Mythic Locations | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Mythic Locations.md>) |
| Ars Magica 5e - Realms of Power - Faerie | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Realms of Power - Faerie.md>) |
| Ars Magica 5e - Realms of Power - Magic | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Realms of Power - Magic.md>) |
| Ars Magica 5e - Realms of Power - The Divine (Revised) | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Realms of Power - The Divine (Revised).md>) |
| Ars Magica 5e - Realms of Power - The Infernal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Realms of Power - The Infernal.md>) |
| Ars Magica 5e - Social - Grogs | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Social - Grogs.md>) |
| Ars Magica 5e - The Church | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - The Church.md>) |
| Ars Magica 5e - The Contested Isle - The Hibernian Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - The Contested Isle - The Hibernian Tribunal.md>) |
| Ars Magica 5e - The Lion and the Lily - The Normandy Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - The Lion and the Lily - The Normandy Tribunal.md>) |
| Ars Magica 5e - The Mysteries (Revised) | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - The Mysteries (Revised).md>) |
| Ars Magica 5e - The Sundered Eagle - The Theban Tribunal | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - The Sundered Eagle - The Theban Tribunal.md>) |
| Ars Magica 5e - Transforming Mythic Europe | reviewed | [Open](<private/sources/ars-magica-open-license/reviewed/Ars Magica 5e - Transforming Mythic Europe.md>) |
| Ars Magica 3e - Tribunals of Hermes - Iberia | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 3e - Tribunals of Hermes - Iberia.md>) |
| Ars Magica 4e - Blood_and_Sand_-_The_Levant_Tribunal | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 4e - Blood_and_Sand_-_The_Levant_Tribunal.md>) |
| Ars Magica 4e - Land of Fire & Ice, Mythic Iceland | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 4e - Land of Fire & Ice, Mythic Iceland.md>) |
| Ars Magica 4e - The Dragon and the Bear - The Novgorod Tribunal | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 4e - The Dragon and the Bear - The Novgorod Tribunal.md>) |
| Ars Magica 4e - Ultima Thule - Mythic Scandinavia | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 4e - Ultima Thule - Mythic Scandinavia.md>) |
| Ars Magica 5e - Adventure - Broken Covenant of Calebais | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Adventure - Broken Covenant of Calebais.md>) |
| Ars Magica 5e - Antagonists | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Antagonists.md>) |
| Ars Magica 5e - Between Sand & Sea - Mythic Africa | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Between Sand & Sea - Mythic Africa.md>) |
| Ars Magica 5e - Core Rules | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Core Rules.md>) |
| Ars Magica 5e - Faith & Flame - The Provencal Tribunal | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Faith & Flame - The Provencal Tribunal.md>) |
| Ars Magica 5e - Living Covenant | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Living Covenant.md>) |
| Ars Magica 5e - Magi of Hermes | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Magi of Hermes.md>) |
| Ars Magica 5e - Magic - Hermetic Projects | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Magic - Hermetic Projects.md>) |
| Ars Magica 5e - Magic - Rival Magic | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Magic - Rival Magic.md>) |
| Ars Magica 5e - Magic - The Cradle & the Crescent | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Magic - The Cradle & the Crescent.md>) |
| Ars Magica 5e - Mundane Beasts | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Mundane Beasts.md>) |
| Ars Magica 5e - Tales of Mythic Europe | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Tales of Mythic Europe.md>) |
| Ars Magica 5e - Tales of Power | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Tales of Power.md>) |
| Ars Magica 5e - Thrice-Told Tales | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Thrice-Told Tales.md>) |
| Ars Magica 5e - Through the Aegis - Developed Covenants | wip | [Open](<private/sources/ars-magica-open-license/wip/Ars Magica 5e - Through the Aegis - Developed Covenants.md>) |
| Ars Magica Chronology - by OriginalMadman | 3rd-party | [Open](<private/sources/ars-magica-open-license/3rd-party/Ars Magica Chronology - by OriginalMadman.md>) |
| Ars Magica Solitaria - Solo Roleplaying Rules by OriginalMadman | 3rd-party | [Open](<private/sources/ars-magica-open-license/3rd-party/Ars Magica Solitaria - Solo Roleplaying Rules by OriginalMadman.md>) |

## Verification limits

F3. PDF parsing/text extraction, ZIP CRC checking, SHA256 receipt records and a pinned repository revision establish local acquisition/preparation only. Text extraction is not an illustrated-page layout check, complete human reading, rules validation or native YAIR gameplay. Eclipse Phase includes a file explicitly named Placeholder - Setting Primer; its presence does not establish a complete setting primer. EP quickstart occurs both as a direct download and in the archive. DOCX extraction includes paragraphs and table cells, with table content flattened. Source boundaries and original locators remain in private metadata.

The initial title scan found 13 MCG PDFs; a later refresh found one Rifts PDF. Newly checked out free editions are listed separately. The earlier 12-file report is a historical snapshot.
