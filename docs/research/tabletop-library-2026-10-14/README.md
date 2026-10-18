# Tabletop research library

**Later inventory refresh:** [Core titles and adaptation plan](CORE_TITLES_AND_ADAPTATION_PLAN.md) records additional user downloads, removes repeat-acquisition candidates and narrows the core shortlist. Earlier inventories below retain their original scope.

2026-10-14. Authorized acquisition and organization for YAIRPG. No paid order, game code change, commit or push. The user's selected address was used for zero-dollar DriveThruRPG guest checkout with newsletter/publisher subscriptions off. Personal receipt details stay private.

## F1. Start here

**World/content guidance:** [WORLD_RULES_GUIDE.md](WORLD_RULES_GUIDE.md) maps design questions to the available rulebooks, source retrieval and current design owners.

| Need | Owner |
|---|---|
| What we actually have, per-file page counts and local links | [CATALOG.md](CATALOG.md) |
| What still needs buying, dependencies and free-but-queued items | [BUYING_LIST.md](BUYING_LIST.md) |
| Multiverse types, retained powers, text presentation and reading priorities | [DESIGN_CONSIDERATIONS.md](DESIGN_CONSIDERATIONS.md) |
| Earlier publisher comparison, Warhammer distinctions and 5e explanation | [Original sweep](../TABLETOP_BOOK_SWEEP_2026-10-14.md) |
| Original sources, full text and receipt evidence | [Private library](private/) |

## F2. Acquisition result

Captured the whole publisher-linked Ars Magica open-text repository at a pinned revision, including license/support files. It has 34 reviewed, 20 work-in-progress and 2 community Markdown entries. This is not a claim to have reconciled all 53 official release titles or read them.

Saved Worlds Without Number, Stars Without Number Revised and Godbound free editions; Ironsworn core, assets/playkit; Starforged primer; D&D SRDs 5.1 and 5.2.1; Cypher reference DOCX and license; Blades player kit; RuneQuest, Pendragon and BRP quickstarts. The author-shared Eclipse Phase second-edition ZIP contains 29 PDFs, including its v1.3 core, Character Options, condensed player guide, errata and adventures. Kits, previews, character sheets and primers are labeled separately from full books. The archive also includes a placeholder file, not a complete setting primer.

Inventoried 13 existing MCG PDFs and one Rifts Megaverse Builder PDF in Downloads. They are linked into this lane rather than moved or renamed. The scan also covered Calibre Library, but filename matching is not an exhaustive audit of every source location. Current counts and duplicate qualifications are in CATALOG.md.

## F3. Research preparation

Private `manifest.json` records selected source URLs, local paths, hashes, route, page count and preparation status. `ars-magica-inventory.json` records repository revision, per-entry hash and repository review group. `verification.json` summarizes extraction checks. Full extracted text is in `private/text/`; `private/search.sqlite` provides page/heading-level FTS5 lookup. All these remain gitignored.

Use the bundled Python or any Python with SQLite FTS5:

```sh
python3 docs/research/tabletop-library-2026-10-14/search.py 'covenant AND laboratory' --limit 8
```

Search results retain source title and page/heading locator. They are starting points for reading and verification, not already accepted rules. Preparation script `manage_library.py` can refresh the bounded local inventory or rebuild the private index. Its selected-asset download mode receives explicit observed URLs; it does no site discovery or crawling. Browser checkout downloads use publishers' native flows.

## A1. Reading order

| Order | Read for | Deliverable before implementation |
|---|---|---|
| 1 | Ars Magica core and Covenants | One concrete study/invention cycle and a persistent community, exact private locators |
| 2 | WWN / SWN | One causal place/faction situation and useful return state |
| 3 | Godbound | One supported world-changing project and actual means/consequences |
| 4 | Eclipse Phase | One identity/body transition with knowledge, body faculties and custody separated |
| 5 | Existing Strange / Rifts; compare focused paid gaps | One cross-world connection and power interaction, then identify the smallest missing source |

Each source gets a private exact-rule packet and a public paraphrased synthesis, following the existing source deep dive playbook. No full-book reading or playable acceptance is claimed by downloading/indexing. Free items that could not be retrieved are explicitly queued in BUYING_LIST.md, separate from paid books.
