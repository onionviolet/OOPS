# HP review fix B: canon names out of the lead stub (agent-verified, not human-reviewed, not committed)

Edited only `src/world_packs/book_hp_lead_life_data.js` (display text: titles, labels, descriptions, knowledge notes, calendar label, sequence title). Ids, acts and structure unchanged. `dist/` not rebuilt.

- Compatibility grep (hash/saved state): `sourceSnapshot.hash` in `book_hp_lead_life.js` is a fixed literal, not computed from the data; no pack-content hash covers these strings; tests pin only ids (`.cupboard`, `.vernon`, `.petunia`). Changed text is display or knowledge-note values only. Result: no hash or key changed. Gap: existing saves keep their old note text (display only).
- `node --test tests/hp_lead_life*.test.js tests/hp_lead_window*.test.js tests/own_holdings*.test.js`: 17 pass, 0 fail.
- `npm run check:rules`: PASS (1 unrelated untracked-link warning).
- Name grep of the data file: no display strings remain. Gap: the id slugs `cupboard`, `vernon`, `petunia`, `dudley` stay in the file (`id('vernon')` etc.) because the private cast, window packs, tests and saved relationship keys match them. Renaming them changes saved keys and needs a migration decision.
- Other tracked files, not edited: `src/book_world_beginning_registration.js:20` (choice label "the boy in the cupboard"; owned by the parallel session); tests `hp_lead_life`, `world_portable_tools`, `lead_run_crosswalk` use the ids/fixtures; `scripts/lead_run/shard_tools.mjs:76` comment; `src/world_packs/book_hp_pack.js`, `hp_brewing_*` mention a school store-cupboard (unrelated).
- Private cast in `src/book_world_hp_lead_pack.js` was not read or edited; real names are expected from there. Not checked that it overrides the new neutral labels.
