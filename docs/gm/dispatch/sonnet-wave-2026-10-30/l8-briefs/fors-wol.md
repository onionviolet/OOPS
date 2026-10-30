# Lane sw-l8-fors-wol: fill one character sheet

Read the schema first: docs/gm/dispatch/sonnet-wave-2026-10-30/L8_CHARACTER_SHEET_SCHEMA.md (fields, entry shape, conventions). Follow every convention.

Input (read only): docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets/bundles/fors-wol.json. It holds the person's registry id, aliases and, per volume (byVol keys 1-8), the merged rows that name them: about (facts), rules (abilities, rites, potions with rule ids), person (reveals, wants). Rows carry a label (S/T/I/U) and a locator.

Output (the only file you write): docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/character-sheets/fors-wol.json, valid JSON: {id, slug, tier:"principal", fields...} using the schema's field names. Each list field holds dated entries {v, from, to?, view, by?, ev, loc, rule?, gate?}.

Required content:
- identities: every name, alias, persona and title with the chapter it starts (from), per volume where the bundle shows it.
- power: path and level (the world's own scale) with a different entry for volume 1 and for later volumes; a promotion closes the earlier entry with "to".
- abilities: rule ids from the bundle's rules rows (use the row id as rule), with conditions, costs, limits taken from the rows. Never describe the rule's content beyond the row.
- stats: bands 0-9 on the schema axes, only where the rows support one; set "reproduces" to an outcome id.
- outcomes: at least 3 stated outcomes the bundle rows support, each with id, what, from, loc and expect = {kind:"beats"|"loses_to", vs:{axis:band}} (opponent band inline, an axis you set in stats) or {price_at_least:N} (a money entry you also record). Money outcomes are the safest.
- money, held, affiliation, skills, condition where rows support them. Keep actual / shown / believed apart (view, by).
- gate: use "reveal@bN:CH" for a truth about another person or a sealed fact, from a bundle reveals row. Do not gate the person's own personas.

Rules: every loc string must be copied from the bundle; never invent one. Unknown stays ev "U". No outside knowledge of the book: use only the bundle. Keep "what"/"note" text short and in your own words. No commits, no web, no edits outside the output file. Print nothing to stdout except a one-line "done <path>" when finished. Run "node -e 'JSON.parse(require(\"fs\").readFileSync(PATH))'" on your output to confirm it parses.

Extra rules (from the pilot): record at least 3 money entries and a stats entry in force at the "from" of every axis an outcome uses. Persona identities (kind "persona") carry v.persona = "persona.<slug>" and the sheet has personaIds listing them. Abilities cite the bundle rules rows' id as "rule", with conditions/costs/limits copied only when the row has them (empty arrays otherwise); do not invent notes. Include a "personaIds" array, "id" ("lotm.person.fors-wol"), "slug", "tier":"principal".
