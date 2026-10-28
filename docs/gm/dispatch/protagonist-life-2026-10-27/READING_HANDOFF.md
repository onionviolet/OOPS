# LOTM volume 1 reading: handoff to a cheaper coordinator (2026-10-27)

Weibao: "Let's improve accordingly, make the chat restart with cheaper lanes, send a separate
chat to test how local AI can do these." This file hands the reading to a fresh coordinator.
Owners: [reading plan](VOLUME1_READING_PLAN.md), [status](READING_STATUS.md),
[schema card 1.3](SCHEMA_CARD_1_3.md), [schema and change rule](LEAD_RUN_SCHEMA.md),
[reader brief template](READER_BRIEF_TEMPLATE.md), [plan rounds 13-14](PLAN.md#21-round-13-readiness-patches-protocol-v2-and-the-reader-optimization-2026-10-27).
Private output: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/` (gitignored).

## State

| Range | Shards | Grades | Notes |
| --- | --- | --- | --- |
| Chapters 1-15 | `s2` (re-run of 1-3), `s2r`, `s3r`-`s6r` | 4 B, 2 C under their own schema | Under 1.3 they carry 165 review items (action classes, motive tags): a JSON-only pass, no reread (PL-L44) |
| Chapters 16-24 | `s7v`, `s8v`, `s9v` (migrated `*m`) | 3 B | Protocol v2 gate |
| Chapters 25-54 | `w1s10`-`w1s19` | 2 A, 8 B | Wave 1 |
| Chapters 55-84 | `w2s20`-`w2s29` | 10 B | Wave 2 |
| Chapters 85-114 | `w3s30`-`w3s39` | 10 B | Wave 3 (full-census instruction) |
| Chapters 115-120 | `w4s40`, `w4s41` | 2 B | Wave 4 started; **stopped here by plan** |
| Chapters 121-213 | `w4s42`-`w7s72` (31 shards) | not read | `w4s42`-`w4s49` already prepared (brief and shard files); `wave_plan.json` lists all 63 |

Every graded shard has `<prefix>_header.json` (`shard-header/1.3`). Use the migrated files
(`<prefix>m_*.jsonl`) downstream; originals stay as the readers wrote them. Token log per
shard: `wave_ledger.csv` in the private folder (32 rows for waves 1-4, about 4.5 million haiku
tokens; the earlier v1 and gate runs, about 1.5 million, are in PLAN 13.1 and 21.2).

**Open review items:** older-shard action classes and motives (165); `name-not-in-shard`,
`fill-without-basis` and `great-without-footprint` lists in each `<prefix>_m13_review.json`;
duplicate ids for one entity across shards (two washrooms, two reception halls, kinship and title
aliases); wiki-label kind mismatches (a philosopher tagged deity); one valid candidate a reader
skipped as absent (`w3s33`, chapter 95); one note in 15 spot-checked that imported outside
knowledge (`w1s13`).

## Commands (all exist, all tested)

```text
# prepare: EPUB chapters -> paragraph-numbered shard, index, brief with glossary and candidates
node scripts/lead_run/prepare_shard.mjs --epub <book.epub> --from 121 --to 123 --dir <private> --prefix w4s42 --base 4201 --wiki <wiki.json>
# rebuild a brief with the glossary from graded shards only
node scripts/lead_run/assemble_brief.mjs <template> <card> <shard> <brief> --wiki <wiki.json> --census <private> --census-match '^(s[3-6]r|s[7-9]vm|w[1-4]s[0-9]+m)_census\.jsonl$' --prefix w4s42 --base 4201
# lint (prints failing row ids)
node scripts/lead_run/lint_lead_run.mjs <scenes> <census> <shard>
# safe repairs (labels, deps, anchors, footprints, locators moved to the printed name, basis-less fills set aside)
node scripts/lead_run/migrate_shard.mjs <private> w4s42 <shard>   # then copy *_m13_* to w4s42m_*
# grade and header
node scripts/lead_run/audit_shard.mjs <private> w4s42m <shard> --model haiku --chapters 121-123 [--spot-checked 5]
```

Tests: `node --test tests/lead_run_lint.test.js tests/lead_run_audit.test.js`.

## Bounds

AU7 raised by Weibao to **15 points per usage window** for this task, from each window's starting
level. Wave cost stop: **110% of 1.5 million tokens per wave of 10** (150,000 per shard, his
"Continue, new rate"). Other stops in the reading plan still apply. Volume 1 only; HP and Mother
of Learning wait for their own plans.

## What the runs taught (cost)

- **Fixed overhead dominates:** about 95,000 tokens per reader before it reads a line; a reader
  agent resends its whole context on every tool call, so calls drive cost more than text size.
- **Protocol v2 averages:** wave 1, 131,700 per shard; wave 2, 134,000; wave 3, 150,100 (after the
  full-census rule: census rows per chapter rose from about 22 to 32); wave 4 so far, 165,900.
- **Failures were structural**, not content: string deps, invented anchors, prose labels,
  missing whereabouts, names cited a paragraph off. The repair script fixes all of them safely.
- **Glossary care:** amounts, short common nouns, kinship words and titles must not carry ids
  across shards; names must keep the edition's printed dot form.

## Protocol v3: one model call per shard, by script

Goal: drop the agent loop (the ~95,000 fixed overhead and the per-call resends).

1. **Script, not agent.** A new `scripts/lead_run/read_shard.mjs` builds one prompt in a stable
   order, cache-friendly prefix first: (a) the fixed instructions and the schema card, (b) the
   output JSON schema, (c) the glossary of known entities (incremental: list known ids and ask
   only for new entities and new facts about known ones), (d) the script candidates, (e) the shard
   text last.
2. **One headless call:** `claude -p --model haiku --output-format json --json-schema <schema>
   --tools "" --no-session-persistence` with the prompt on stdin. This uses the subscription, no
   API key and no paid fallback; check `claude --help` for the flag names on the installed
   version (2.1.309 has all of these).
3. **Validate in code:** parse the JSON into the three files, run `lint_lead_run.mjs`, then
   `migrate_shard.mjs` and `audit_shard.mjs`.
4. **At most one repair call** with only the lint error list and the failing rows; then grade.
   A grade C after that gets one fresh call; never a third.
5. **Expected cost:** prompt about 25,000-30,000 tokens (card, glossary, candidates, about 10,000
   characters of text) plus about 15,000-25,000 output tokens, so **about 45,000-55,000 per
   shard** [I], roughly a third of protocol v2.
6. **A/B test before switching:** rerun one wave-3 shard (for example `w3s33`, chapters 94-96)
   with v3 into a new prefix (`w3s33x`). Compare with the v2 result: grade, census rows, name
   accuracy, scene and option counts, tokens, and the usage-meter movement for that one call.
   Switch only if the grade is A or B and census recall is at least 90% of v2's.

**Local model test:** a separate chat tests how the local model handles the deterministic and
labelling parts (candidate labelling, unit normalization, idiom filtering); see
[local AI considerations](../../../research/LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md). The
coordinator uses its findings for v3 step (d).

## Open questions for the new coordinator

1. Run the v3 A/B first, then resume `w4s42` onward with whichever protocol wins.
2. After wave 4: the cross-shard id merge (PL-L16) and the sonnet consistency pass (PL-A49).
3. The JSON-only review pass over the 165 older-shard items (PL-L44).
4. Then the lead-run table assembly (P2, PL-A50); the first lived week needs chapters 1-24 only.
