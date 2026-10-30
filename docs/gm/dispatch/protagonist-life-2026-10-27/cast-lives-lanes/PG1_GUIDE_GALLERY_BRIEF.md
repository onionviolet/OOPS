# Lane brief: PG1, absorb the English edition's Pathways Guide and Image Gallery

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Other sessions share this checkout: touch only the files granted below. Research pass under [world pass rules](../../../../WORLD_PASS_RULES.md): label each claim shown, stated or inferred, with a locator (EPUB file name plus heading).

**Mandate:** Weibao 2026-10-30, "absorb useful stuff from the guide and image gallery". The official English LOTM EPUB (`docs/research/novels/lord-of-mysteries/private/source/en/lotm_en_webnovel_official.epub`) holds a "Pathways Guide" chapter, an "Image Gallery" chapter and about 328 webp illustrations. Read them (open the EPUB with Python's `zipfile` under `python3 -I`; never modify it) and fold what is useful into the private research, comparing against what the project already holds. Rules: CLR1-CLR4 and CLR12 in [LEAD_LIFE_RULES](../../../../LEAD_LIFE_RULES.md) section F, `.claude/rules/research-and-agents.md`. Sealed secrets by id only; public franchise facts are not sealed.

## Existing owners to compare against (read the relevant parts only)

- `docs/research/novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md`, `WIKI_CROSSCHECK_2026-10-10.md`, `readers-2026-10-10/COI_PATHWAYS_2.md` (gitignored research).
- The pack registry `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged/registry.jsonl` (ids, Chinese names, labels).
- `src/book_world_lotm_path.js` and `src/book_world_lotm_abilities.js`, read-only, to see which pathway and sequence data the game already uses.

## Deliver (all under `docs/research/novels/lord-of-mysteries/private/guide-gallery-2026-10-30/`)

1. `pathways_guide.jsonl`: one row per pathway and sequence the guide states (pathway, sequence number, English name, any stated ability or note in your own words, locator), plus `guide_vs_project.md`: rows the project lacks, rows that disagree (with both sides and locators), and rows that match. Do not resolve disagreements by preference; record them.
2. `glossary_en.jsonl`: official English names for pathways, sequences, organizations, people, places and items found in the guide, gallery captions and chapter titles, joined to registry ids where the Chinese or label match is clear (`match: exact | likely | none`, with the basis). This feeds pack display labels later (LSD469).
3. `gallery_index.jsonl`: one row per illustration (file name, caption or alt text, the chapter or section it sits in, depicted people and places as registry ids where the caption or context names them). If your environment can view images, add short appearance notes (clothing, features, setting) labelled `observed`; if it cannot, say so in the checkpoint and index from captions and placement only. Do not copy images.
4. Checkpoint `cast-lives-lanes/PG1_CHECKPOINT.md`: counts, what is new to the project, the top disagreements, what could feed which system (ability ladder, figure gallery or portraits, display labels), and gaps. No source prose quoted.

## Files owned

`cast-lives-lanes/PG1_CHECKPOINT.md` and the private `guide-gallery-2026-10-30/` folder. Read-only for everything else, including `src/` and the registry.

## Done check

Row counts printed by a short script you write in the private folder; every row has a locator; 10 random glossary matches re-checked against the registry and the result recorded. One line per check. Ambiguity default (CLR12): an unclear match is `likely` with its basis, never forced to an id.
