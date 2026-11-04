# HP shard hp1c011 repair receipt (2026-11-03)

Outcome: hp1c011 (Book 1, chapters 11-12) moves from lint fail / grade C to lint pass / grade B, with the same gate the other eight shards passed. Window 8 of the [whole-world plan](HP_WHOLE_WORLD_PLAN_2026-11-03.md) is unblocked on this shard. Status: agent-verified, not human-reviewed. Nothing committed.

## Tools

`scripts/lead_run/lint_lead_run.mjs` (row lint plus locators) and `auditShard` in `scripts/lead_run/shard_tools.mjs` (the grade, as `audit_shard.mjs` calls it). `audit_shard.mjs` itself was not run because it overwrites the header and would drop the route, pass and effort fields; the same `auditShard` call ran without writing. hp1c009m was run the same way as a control: pass, B.

## Before (command: lint CLI on hp1c011m scenes, census and the chapter 11-12 shard)

Three defects, no re-read needed:

- Scene lr.hp.main.01111: missing `weight` (rule `weight`).
- Census rows hp.price.fifty-pence and hp.price.silver-sickle: price rows without `amount` (rule `price-amount`).
- Grade C came from those alone. Locator validity 1, name accuracy 1.

The m13 pair was byte-identical to the m pair and failed the same way. `hp1c011_m13_review.json` is an empty list, so it records nothing about the cause. The plain (pre-merge) variant additionally has 5 `zh-not-at-locator` rows (name accuracy 0.952); it is not what the header grades, so it was left as is.

## Repair (local, deterministic, source text untouched)

- 01111 gets `weight: routine`. Default and reason: it has no footprint and no lasting change beyond a repeat visit, like the other routine scenes here; a dial of `great` would also need a footprint, which a new read would have to supply.
- fifty-pence gets `amount` 50 pence; silver-sickle gets `amount` 1 sickle.
- Two census notes ended in stray tokens from the reader; the tokens were removed.

Changed files, each with a `.bak-20261103` beside it, in `docs/research/novels/harry-potter/private/lead-run-2026-10-28/` (gitignored): hp1c011m_scenes.jsonl, hp1c011m_census.jsonl, hp1c011_m13_scenes.jsonl, hp1c011_m13_census.jsonl, hp1c011m_header.json (lint pass, grade B only).

## After

Lint CLI on m and on m13: `ok: true`, no issues. `auditShard` on hp1c011m: lintOk true, grade B, locatorValid 1, nameAccuracy 1, counts 12 scenes, 105 census rows, 4 fills. sourceHash unchanged (1eb456ab17d97c52). A row-level diff of the m files shows one scene row and two census rows changed.

## Spot checks (not a human read; header `spotChecked` stays 0)

- Chapter 12 locator for the sickle row resolves to a paragraph that prints a silver sickle in a pudding slice, matching amount 1 sickle.
- Fifty-pence first mention resolves to the paragraph with the coin taped to the Dursleys' note, matching amount 50 pence.
- Scene 01111 choice locator resolves to the paragraph where Harry insists the mirror room is nearby, consistent with a routine search scene.

## Remains

Plain-variant zh rows (superseded by the m files); a human read of the shard; no paid re-read was needed.
