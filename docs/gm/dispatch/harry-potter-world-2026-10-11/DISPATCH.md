# Dispatch receipt and source-access update

Fresh visible GM created 2026-10-11: `01a12e0b-d61a-7ce0-8f5b-eafbdc46e988`, host `local`, title **Harry Potter source and origins GM**. Native wait snapshot confirmed an active turn and acknowledgment of source-qualified design scope. No implementation assigned.

## New local sources supersede initial absence

User asked to recheck Downloads after source access became available. Two local files were found. Reading and private conversion of these existing user-provided files is authorized. No book acquisition was performed by this dispatcher.

- Seven-novel collection PDF: 4,361 pages; PDF bookmarks identify all seven book boundaries at pages 1, 251, 626, 1106, 1840, 2833, 3660. SHA-256 `9db33901964c71cb58c90d65b50ac6af719e3ad8f9e65d25818343b14331b7d4`. Sampled pages contain extractable text. This is structural evidence, not an edition-authenticity or completeness certificate.
- Cursed Child EPUB: metadata identifies **Parts One and Two, Special Rehearsal Edition, original West End production**, English, dated 2016-07-31, with 98 declared spine items. SHA-256 `9d0264e0f37949b9797e57ecf4dad138535823a019cfdd6a7f5980d9f752148f`. Keep this distinct from later revised editions and from the seven-novel baseline.

Dispatcher exclusively owns `docs/research/novels/harry-potter/source-preparation-2026-10-11/`; receiver reads it but does not regenerate or overwrite it. User explicitly authorized context/token-efficient conversion. Its manifest contains exact absolute original paths, source hashes, book page ranges, extraction receipts and EPUB member locators. Per-book text and a separate play text use stable page/spine references. An FTS5 SQLite index provides bounded passage retrieval. Check the manifest's availability and final receipt before claiming conversion finished. Both source originals remain read-only and untouched.

Other novel workers own disjoint private/public design folders under `parallel-book-design-2026-10-11`. This changes the source-access gate; it does not change the user's audit/design-only scope or establish any whole-book reading.

## Conversion completed and checked

Converted all 4,361 declared PDF pages into seven novel text files, and all
98 declared EPUB spine members into a separate play text. Indexed 4,441
nonempty page/spine passages in SQLite FTS5. Source hashes before/after match.
Database integrity check returns `ok`; all eight source groups are populated,
stable page locators exist, and queries for wand, Potter+cousin and Polyjuice
return passages. Extracted text has zero Unicode replacement characters.
These checks prove this bounded extraction/retrieval slice, not semantic
completeness, perfect reading order, whole-book reading or primary authenticity.

Read-only preparation owner: `docs/research/novels/harry-potter/source-preparation-2026-10-11/README.md`
and `manifest.json`. Both text and database outputs are gitignored. No source
original, Calibre entry, user save or game code was changed by preparation.
The HP GM received a native follow-up directing it to these source receipts.
