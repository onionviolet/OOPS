# Seam adoption register

Proposal-backed tool (AD32; [AR17](ARCHITECTURE_RULES.md) is proposed, not standing). It makes [AR11](ARCHITECTURE_RULES.md) checkable: for each shared seam it lists who imports it and which world families those importers belong to. Source: [lane H](audits/cross-world-foundations-2026-11-06/LANE_H_HOSTS_REGISTER.md) (its 37 seams, curated in `scripts/seam_register.mjs`).

Regenerate: `node scripts/seam_register.mjs --write`. Print only: `node scripts/seam_register.mjs`. Staleness check (exits non-zero): `node scripts/seam_register.mjs --check`. It is not wired into `npm run check:rules`; the coordinator decides that.

What the counts show: how many files under `src/` statically import a seam (`import`, `import 'x'`, `export ... from`), and the world family of each importer, taken from its file name. "Shared" importers (main, display, panels, other kits) are not a world. Dynamic `import()`, registry-based use (a domain reaching a seam through `domainRegistry`) and one hop through shared adapters are not counted.

What they do not show: that a seam works, that a player can reach it, or that a second world's case was different enough to prove it. Two families importing a seam is code reach only. The proof column is curated by hand from cited receipts and defaults to `unknown`; `one-world route` or `two-world route` means a native play route (AR10) exists in the cited receipt, nothing weaker.

Only two seams have a cited receipt today: `ready_stock` (fixture route, LOTM, fight use blocked) and `tempo_fight` (Frontier fixture-seeded route, not reached natively for LOTM).

## Register

<!-- BEGIN GENERATED: seam_register -->

| World families importing (direct) | Seams | Which |
|---|---|---|
| 0 | 10 | check_contract, conflict_frame, tempo_fight, faction_rank, law_case, life_events, home_building_model, research_*, ability_ladders, effect_dsl |
| 1 | 15 | notch_contest, recurring_duties, teacher_window, travel_legs, world_light, people_knowledge, constraint_store, world_events, storylet_deck, institution_access, owed_ledger_sources, structured_ability_runtime, ability_records, lore_history_state, combat_math |
| 2+ | 14 | ready_stock, own_holdings, lesson, people_sources, harm_state, world_rhythm, cast_schedule, seeded_streams, institution_store, world_calendar, cast_* adapters, material_lineage, spell_cast_lowering, person_ties |

| Seam | Purpose | src importers | tests / scripts | Shared importers | World families (importer files) | Families | Proof state | Receipt |
|---|---|---|---|---|---|---|---|---|
| ready_stock | Counted stock a holder carries and spends (rounds, doses) | 2 | 2 / 0 | 0 | gu 1, lotm 1 | 2 | one-world route | `docs/gm/dispatch/at15-fight-2026-11-06/CHECKPOINT.md` |
| notch_contest | Notch-banded contest resolution | 3 | 1 / 0 | 2 | lotm 1 | 1 | unknown | none cited |
| check_contract | Declared check contract (inputs, outcomes) for skill checks | 4 | 1 / 0 | 4 | none | 0 | unknown | none cited |
| own_holdings | Purse and holdings owned by the player | 8 | 4 / 0 | 3 | lotm 3, hp 2 | 2 | unknown | none cited |
| recurring_duties | Duties that come due on a schedule | 2 | 8 / 1 | 1 | lotm 1 | 1 | unknown | none cited |
| lesson | Taught lessons and what they leave behind | 5 | 2 / 0 | 1 | hp 2, lotm 2 | 2 | unknown | none cited |
| teacher_window | When a teacher is available | 1 | 1 / 0 | 0 | village 1 | 1 | unknown | none cited |
| travel_legs | Journeys as legs with cost and time | 2 | 3 / 0 | 0 | lotm 2 | 1 | unknown | none cited |
| world_light | Light and dark by place and hour | 2 | 1 / 0 | 0 | lotm 2 | 1 | unknown | none cited |
| people_knowledge | What the player knows about each person | 7 | 7 / 0 | 6 | mol 1 | 1 | unknown | none cited |
| people_sources | Where people entries come from | 4 | 1 / 0 | 1 | hp 1, lotm 1, mol 1 | 3 | unknown | none cited |
| constraint_store | Standing constraints on the actor | 3 | 2 / 0 | 1 | lotm 2 | 1 | unknown | none cited |
| conflict_frame | Shared frame for an encounter and its grains | 5 | 0 / 0 | 5 | none | 0 | unknown | none cited |
| tempo_fight | Tempo fight engine, contract and domain | 3 | 23 / 1 | 3 | none | 0 | one-world route | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P4_TEMPO_CHECKPOINT.md` |
| harm_state | Harm ladder and wounds | 9 | 5 / 0 | 7 | lotm 1, village 1 | 2 | unknown | none cited |
| world_rhythm | World clock rhythm and seasons | 32 | 6 / 7 | 25 | hp 2, lotm 2, proto23 2, primordial 1 | 4 | unknown | none cited |
| cast_schedule | Where the cast is by hour | 5 | 6 / 1 | 1 | lotm 2, mol 1, village 1 | 3 | unknown | none cited |
| world_events | Dated world events and who knows them | 9 | 10 / 1 | 7 | lotm 2 | 1 | unknown | none cited |
| storylet_deck | Storylet draw and gating | 4 | 3 / 1 | 3 | village 1 | 1 | unknown | none cited |
| seeded_streams | Named seeded random streams | 26 | 14 / 3 | 19 | proto23 3, field 1, lotm 1, mistglass 1, village 1 | 5 | unknown | none cited |
| institution_store | Institutions with standing and credit | 2 | 1 / 0 | 0 | lotm 1, primordial 1 | 2 | unknown | none cited |
| institution_access | What an institution lets a member reach | 1 | 1 / 0 | 0 | mol 1 | 1 | unknown | none cited |
| faction_rank | Rank inside a faction | 7 | 1 / 0 | 7 | none | 0 | unknown | none cited |
| law_case | Cases and jurisdiction rules | 0 | 2 / 0 | 0 | none | 0 | unknown | none cited |
| owed_ledger_sources | Sources of what is owed to or by the player | 5 | 5 / 0 | 4 | lotm 1 | 1 | unknown | none cited |
| structured_ability_runtime | Structured ability execution | 8 | 4 / 0 | 7 | lotm 1 | 1 | unknown | none cited |
| life_events | Life events and their domain | 1 | 1 / 0 | 1 | none | 0 | unknown | none cited |
| home_building_model | Home as a building model | 6 | 1 / 0 | 6 | none | 0 | unknown | none cited |
| research_* | Research content, view and home | 3 | 3 / 0 | 3 | none | 0 | unknown | none cited |
| ability_ladders | Ability ladders | 2 | 1 / 0 | 2 | none | 0 | unknown | none cited |
| effect_dsl | Effect description language (inert by ABR4) | 1 | 1 / 0 | 1 | none | 0 | unknown | none cited |
| world_calendar | Per-world calendar | 10 | 8 / 0 | 4 | hp 2, paradise 2, mol 1, village 1 | 4 | unknown | none cited |
| cast_* adapters | Adapters that give cast members shared mechanisms | 3 | 15 / 1 | 0 | lotm 2, hp 1 | 2 | unknown | none cited |
| ability_records | Ability records | 4 | 4 / 0 | 3 | lotm 1 | 1 | unknown | none cited |
| material_lineage | Where a material came from | 14 | 6 / 0 | 10 | paradise 2, hp 1, mistglass 1 | 3 | unknown | none cited |
| lore_history_state | Lore and history knowledge state | 9 | 7 / 0 | 8 | mistglass 1 | 1 | unknown | none cited |
| combat_math | Shared combat arithmetic | 13 | 7 / 0 | 11 | village 2 | 1 | unknown | none cited |
| spell_cast_lowering | Casts lowered to native commands: a seeded works-or-fizzles outcome where a world has a failure chance (LT2) | 2 | 2 / 0 | 0 | hp 1, lotm 1 | 2 | two-world route | `docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md` |
| person_ties | Ties on the one person record: regard as rule facts, observed notes, tie-gated offers (LT8) | 4 | 1 / 0 | 1 | lotm 2, hp 1 | 2 | two-world route | `docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md` |

One hop through shared adapters: not computed (lane H marked those rows inferred but defined no rule). Receipt column shows the first cited path only; full locators are in `PROOF` in `scripts/seam_register.mjs`.

<!-- END GENERATED: seam_register -->
