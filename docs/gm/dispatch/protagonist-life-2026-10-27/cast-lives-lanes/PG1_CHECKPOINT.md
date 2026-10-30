# PG1 checkpoint: English Pathways Guide and Image Gallery

**Scope and publication class.** This lane produced private research under `docs/research/novels/lord-of-mysteries/private/guide-gallery-2026-10-30/`. It read the official English EPUB with Python `zipfile`; the EPUB and its media were not changed or copied. Pathway cards were image-only, so their headings and summaries were read with OCR from archive bytes. Gallery captions and placement came from the EPUB XHTML. All source claims below are paraphrased and labeled stated, with EPUB chapter/image locators in the indexes.

**Counts.** The indexes contain 19 pathway-card rows, 118 gallery-image rows, and 136 glossary rows. Each row has a locator. The 19 pathway cards have no sequence numbers, sequence names, or rung-by-rung ability entries, so `sequence_number` is null and each row states that scope. The gallery has 118 figures across nine Image Gallery chapters; banner entries with no caption are marked as having no caption or alt text. The EPUB has 328 WebP illustrations overall; this index covers figures in the Image Gallery chapters, not every novel illustration. Appearance notes were not observed: this environment allowed OCR but not visual inspection without extracting/copying image files, so the gallery index uses captions and placement only.

## What is new against project data

- The guide cards provide broad summaries for 19 pathways. The inspected playable pathway data in `src/book_world_lotm_rows.js`, `src/book_world_lotm_path.js`, and `src/book_world_lotm_abilities.js` covers a small low-sequence slice (Seer, Corpse Collector, Savant and Sailor); these summaries do not add an executable sequence ladder.
- The gallery supplies 118 captioned or positioned images that can feed a future figure-gallery/portrait index, with registry IDs attached only where the caption match was clear. It does not provide appearance metadata in accessible text.
- The glossary adds English display-name candidates from guide headings and gallery captions. Unclear registry joins remain unjoined or `likely`; they are not forced to an ID.

## Main differences and gaps

1. **Sequence coverage:** the guide cards are pathway summaries, not sequence ladders. The project has explicit sequence progression for the Seer path and other low-sequence pathway data; there is no guide-side sequence material to compare against it. This is a source coverage gap, not a contradiction. Locator: EPUB `EPUB/text/ch218.xhtml` through `EPUB/text/ch1465.xhtml`, heading “Pathways Guide”; project `src/book_world_lotm_path.js` and `src/book_world_lotm_rows.js`.
2. **Breadth:** the guide describes whole-pathway capabilities while the playable project data models selected progression and actions. Three inferred crosswalks match progression names (Fool with Seer/Clown, Death with Corpse Collector/Gravedigger, and Paragon with Savant/Archaeologist); their coverage differs in scope. The other guide cards lack a corresponding playable pathway row. No direct contradiction was found. Locator per card is in `guide_vs_project.md` and `pathways_guide.jsonl`.
3. **Registry ambiguity:** some English pathway names have duplicate or absent exact aliases in the pack registry. The glossary records these as `likely` or `none`, with its basis, and leaves `registry_id` null when the candidate is not clear. Ten additional joined rows were rechecked against the registry; results are below.

## Possible consumers

- **Ability ladder:** pathway summaries are discovery/reference material only. Sequence names and rung-level abilities still need a sequence-specific source before building ladder rows.
- **Figure gallery and portraits:** 118 image filenames, captions, gallery sections, and named subject IDs can seed a browseable index; appearance and portrait-selection work still needs visual inspection through a route that does not copy source images.
- **Display labels:** glossary English names can inform pack display labels after the remaining `likely`/`none` joins are reviewed.

## Checks

- `python3 -I docs/research/novels/lord-of-mysteries/private/guide-gallery-2026-10-30/build_index.py` — passed; indexes regenerated from the read-only EPUB and registry.
- `python3 -I docs/research/novels/lord-of-mysteries/private/guide-gallery-2026-10-30/check_counts.py` — passed; 19/19 pathway, 118/118 gallery, and 136/136 glossary rows have locators; 10 seeded random joined glossary entries passed exact label/alias checks against the registry (seed `20261030`). Sampled names: Mobet Zoroast, Luck, Roselle Gustav, Bernadette Gustav, Dorian Gray Abraham, Evernight Goddess, Leticia Dolera, The Giant, Sauron, Zaratul.
- Visual appearance review — not run; indexes rely on captions and placement. No image copies were made.
- Gameplay/build/browser verification — not applicable; research and index output only.
