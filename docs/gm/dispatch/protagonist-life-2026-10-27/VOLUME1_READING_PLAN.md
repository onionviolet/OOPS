# LOTM volume 1 reading plan (AU13 finite plan, 2026-10-27)

Status: **approved 2026-10-27, conditional** on the protocol v2 gate (Weibao, relayed: launch and send out readers once the gate passes; [round 13](PLAN.md#21-round-13-readiness-patches-protocol-v2-and-the-reader-optimization-2026-10-27)). The gate passed; progress is in [READING_STATUS](READING_STATUS.md). This covers volume 1 only. Rules: AU1-AU15 ([agent usage rules](../../../AGENT_USAGE_RULES.md)),
WA30, WA31, WPR7, WPR18-WPR19, the sealed-secrets rule. Tools: [reader brief template](READER_BRIEF_TEMPLATE.md),
[schema card 1.3](SCHEMA_CARD_1_3.md), `scripts/lead_run/assemble_brief.mjs`,
`scripts/lead_run/audit_shard.mjs`, `scripts/lead_run/lint_lead_run.mjs`. Output stays in the
gitignored `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`.

## Scope

| Item | Value |
| --- | --- |
| Source | Local Chinese EPUB, Calibre ID 1 (Q2 default), 第一部 小丑, chapters 1-213 [S nav.xhtml] |
| Size | 686,804 characters of body text over 213 chapters [S measured from the EPUB members 2026-10-27] |
| Already read | Chapters 1-24 in 9 shards (see PLAN 13.1 and round 13) |
| Remaining | Chapters 25-213, 604,377 characters [S measured per chapter 2026-10-27] |
| Out of scope | The author's volume note, 第二部 onward, the sequel, adaptations |

## Plan

| Parameter | Value | Reason |
| --- | --- | --- |
| Shard size | About 3 chapters, 8,000-11,500 characters, split at a chapter or scene boundary | Measured cost curve (PLAN 13.2); AU 12,000 cap |
| Shards | 63 (at most 3 chapters and 11,500 characters each) | Measured grouping, `wave_plan.json` (private) |
| Waves | 7 waves (six of 10, one of 3) | A wave ends with an audit and a merge before the next starts |
| Readers at once | 2 (AU default) | Budget and the shared machine |
| Model | haiku, fresh context per shard, retired after it | AU5, AU15 |
| Protocol | v2: assembled brief with schema card, known names and script candidates; two parallel reads in the first turn; one write script; mandatory lint; one fix at most | Round 13 measurements |
| Glossary | Rebuilt before each wave from the wiki dump plus all earlier census rows | Incremental census; stable ids |
| Audit gate | `audit_shard.mjs` on every shard; coordinator opens 5 locators per shard (grade A) on 1 shard in 3, and every claimed source conflict; arithmetic check on every amount | WA30, WA31, WPR19 |
| Spot check by a stronger model | sonnet reviews a 10% row sample per wave against the shard | R22, AU rules |
| Merge | After each wave: id registry and unit list merge (GF1, GF19) | Prevents duplicate ids across 63 shards |

## Budget

| Line | Estimate |
| --- | --- |
| Reader tokens per shard | about 123,000 measured under protocol v2 (mean of three shards, 41,000 per chapter) |
| Readers | 63 x about 123,000 = **about 7.8 million haiku tokens** |
| Retries | Up to 10% of shards rerun: about 0.8 million |
| Sonnet spot checks | 7 waves x about 150,000 = about 1.0 million sonnet tokens |
| Coordinator | Opus coordinator time per wave for audit and merge; not counted above |
| Total | **about 8.6 million haiku tokens plus about 1 million sonnet tokens** [I, from the measured v2 mean]; paced by AU7 (five points of any usage window per task) |

## Stop conditions

- The wave's audit grades: more than 2 shards graded C, or name accuracy under 90% on any shard.
- The same failure on three consecutive shards.
- A shard needs a source passage outside the volume, or an edition question appears.
- A sealed truth would need to appear outside an opaque ID.
- The token spend passes 110% of the wave's estimate.
- Another writer needs the private folder or the scripts.

## Outputs per wave

Shard files and headers (private); a wave report in this folder with counts, grades, token use,
reader errors found and fixed, and new gaps (public: ids and counts only).

## The yes needed

**"Yes to the volume 1 reading plan"** (optionally with a token cap, for example "up to 9
million haiku tokens"). Without it, reading stops at the 15-shard default bound.
