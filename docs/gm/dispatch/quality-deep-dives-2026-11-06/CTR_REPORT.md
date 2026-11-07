# CTR lane report (continuity), 2026-11-06

CHECKPOINT: done. Sweep, rulebook, check, backlog, test written; check passes against its baseline. Nothing outside the owned files was edited.

## Sweep (SHOWN: `node scripts/check_continuity.mjs`, 0.4 s)

- 9.4k claims from 1,332 `src` files (static literal parse, nothing imported) and 46 private pack JSON files (name 5.7k, travel 0.9k, fact 1.1k, label price 98, where 47, price 5).
- `src` is clean: 0 findings. Prices, journeys, ages and label prices live mostly in helper calls and private packs, not in repeated literals. Six prose age hits in src, so no prose pass.
- Private packs: 146 findings. CTR1 42 (38 ability rows across `typed_v2..v8`), CTR2 104 (85 in `lotm-cast`, 19 ability duplicates). CTR3 to CTR8: 0 on real data; each is proven on fixtures in the test.
- False-positive classes fixed as dials: action-row labels, `tier`/counts/notes, `indexId` and `idMap` re-keys, name versus label, alias short forms, unplaced rows.
- Real classes: one ability under slug variants across volumes; one person or place under several ids in `lotm-cast` (spelling variants, "-seat" and "-unnamed" suffixes).

## Files written

`scripts/check_continuity.mjs`, `scripts/continuity_baseline.json`, `docs/CONTINUITY_RULES.md`, `docs/continuity/CONTINUITY_BACKLOG.md`, `tests/continuity_check.test.js`, this report.

## Checks

- `node scripts/check_continuity.mjs`: ok, 146 known findings. `--no-private` (a clone without the packs): ok, 0 findings, one stdout note.
- `node --test tests/continuity_check.test.js`: 11 pass, 0 fail (fixtures for CTR1 to CTR8, sealed withholding, dials, tree against baseline).
- Sealed handling: private findings carry a hash key, files and a ref in the baseline and backlog; `--show <ref>` prints details to the local terminal only. No name or text from a pack is in any written file.

## Proposed owner hunks (coordinator applies)

1. `package.json`: `"check:rules": "... && node scripts/check_player_text.mjs && node scripts/check_continuity.mjs"` and `"check:continuity": "node scripts/check_continuity.mjs"`.
2. `docs/RULES_INDEX.md`: register row "Continuity | CTR1-CTR9 | proposed (AD32) | one fact, one value across files | [CONTINUITY_RULES](CONTINUITY_RULES.md)" and a router row "content states a fact another file states".
3. `AGENTS.md` (after the prose line): "Facts stated in several files (names, travel, prices, ages, dates): follow [continuity rules](docs/CONTINUITY_RULES.md) CTR1-CTR9; `npm run check:rules` runs the check."
4. `docs/USER_VISION.md` lane record: add "CTR lane: check and rulebook proposed, src clean, 146 private-pack findings in the backlog."

## Top five backlog items

1. CTR2 `lotm-cast`: 85 name-with-several-ids groups, the largest; start with person ids that differ by a spelling variant.
2. CTR1 ability rows: 38 abilities named differently across `typed_v2..v8` volumes; pick one name per id.
3. CTR2 ability duplicates: 19 abilities defined under slug variants; merge or link with `indexId`.
4. CTR1 place and item cross-file names (4 findings between `lotm-abilities` and `lotm-cast`).
5. Add `indexId` or an `idMap` entry wherever a deliberate second id stays, so the check retires the entry.

## Defaults the coordinator can pick

- Keep private-pack results hash-only in committed files (default). Dial: a sealed-free allowlist could show ids later.
- Leave "who knows what" out until a sealed-safe `knows` extract exists (default).
