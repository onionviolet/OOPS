# RW9 checkpoint: exchange-family paragraph review

Status: **100 steps reviewed, 0 adapter-ready rows, 100 explicit gaps**.
Private source/content review, agent-verified, not human-reviewed. Review quota
complete; whole-family coverage and new playable exchange coverage are not claimed.
No runtime, tests, scripts, private-pack or save edits; no commit or publication.
Authority: [RW9 brief](RW9_BRIEF.md), [paragraph review](RV6_BRIEF.md),
[exchange pack contract](MF_EXCHANGE_CHECKPOINT.md#row-contract-and-coordinator-registration),
[cast direction](../CAST_LIVES_CARD.md). Rules: CLR1-CLR4, CLR6, CLR9,
CLR12; AD2, AD6-AD8, AD36, AD44; sealed-secret publication rules.

## F1: scope and source probe

The live Resume 2 ladder census contains 971 gap steps in the union of trade/pay
and item-handling families. Excluding 38 already-reviewed step IDs across the
existing review JSONL files, selected the first 100 in source volume, scene
citation and local step order. All selected steps are in volume 1: **16 trade/pay,
84 item-handling**. Earlier review files were read-only.

The whole-book M4 merged scenes supply the source steps and citations. Reading
used `shardIndex` and `locatorsOf` from `scripts/lead_run/cite_paragraphs.mjs`.
Unqualified later-volume locators in the census were disambiguated by scene shard
identity before ordering; they were not read as opening-volume passages.
All 100 selected steps have retrievable citations, above CLR2's half-retrievable
gate. Each disposition was appended after reading its citations; additional
neighboring paragraphs settled several actor and action ambiguities. Final
ordering follows scene evidence, rather than incidental locators in nested
fields. Source wording stays private and output prose is paraphrased.

## F2: verdicts and generic reasons

All 100 records use `kind: exchange`, `verdict: gap`, `row: null`, a retrievable
locator, a paragraph-based paraphrase and a specific gap reason. No unsupported
stock, price, currency conversion, item count, native item key, equipment slot,
stage, duration or prior evidence was supplied. Unknown amounts and prior state
were not treated as invented prerequisites.

The actual adapter accepts purchase and wear rows. Cash receipts, service
contracts, custody transfers and compound occult/combat actions cannot be folded
into those operations while preserving their inputs and outcomes (CLR6). The
read-only pack probe found zero serialized native inventory keys. The four
purchase/procurement candidates below need exact goods/stock bindings; supported
source totals alone do not establish these bindings. This finding does not
claim that every such mechanism is absent elsewhere in the engine.

| Gap reason | Count |
| --- | ---: |
| no mechanism: ritual or ability | 24 |
| no mechanism: handling or custody | 18 |
| actor not the lead | 16 |
| no mechanism: dialogue or duty handoff | 13 |
| cited paragraph does not support step | 9 |
| no mechanism: service or contract payment | 7 |
| no mechanism: income or cash transfer | 4 |
| unresolved native item, stock or currency binding | 4 |
| no mechanism: combat | 4 |
| no mechanism: making | 1 |

Top five generic reasons, ranked by count: ritual/ability ownership (24),
handling/custody ownership (18), another actor acts (16), dialogue or duty
handoff (13), and cited paragraph/action mismatch (9). The other 20 are
service payments (7), income/cash transfers (4), native item/stock/currency
bindings (4), combat (4), and making (1). These are findings, not new work grants.

## F3: files, checks and handoff

Owned outputs only:

- Private `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW9.jsonl`.
- This checkpoint, public generic counts and findings only.

Scratch probes, source selection and validator are `/private/tmp/rw9-*`.
They are local review aids, not edits to the shared script or test owners.

| Command | Result | Gaps |
| --- | --- | --- |
| `node /private/tmp/rw9-review.mjs 0 0` | PASS: 971 family candidates, 38 prior-reviewed exclusions, 100 selected, 100 with retrievable citations | Offline selection and source reading, not replay proof |
| `node /private/tmp/rw9-validate.mjs` | PASS: 100 JSON-safe unique records, exact selected order, 100 retrievable final locators, zero overlap with other review files | 0 row verdicts; per-row adapter/native-registry validation has no candidates; empty adapter and registry path passes |
| `node --test --test-name-pattern='native registry accepts' tests/cast_exchange_adapter.test.js` | PASS, 1/1 | Synthetic contract test only; preserves unknown totals as silent and rejects invalid exchange shapes |
| Scoped whitespace, checkpoint local links and `git diff --check -- <checkpoint>` | PASS | Only the two owned outputs checked; unrelated dirty checkout preserved |

Validation input SHA-256 identities:

| Input | SHA-256 |
| --- | --- |
| src/cast_exchange_adapter.js | `86f6682623b33f5d992383e396edccc95339d70e051f4b5d35e6e30463bab3aa` |
| tests/cast_exchange_adapter.test.js | `893d0c5b0b89dbb3a0ee27883714588a58641fbf37e7177dce9c23c779d55e6b` |
| private_packs/lotm-cast/cast.json | `09c971e95889d9f80bc6f9f15b423547f54cf9bfbd8aa3fa1197e65c80c28e61` |
| docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/x4-whole-book-mapping-2026-10-29/ladder/census.json | `0429dc8ce7d0ef66c02ee30449b5f6344d8727247de1f4c24ec03e609da39f23` |
| scenes.jsonl | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |
| RW9.jsonl | `46f0a0f4f242d87efd05b5ef5b73d7b4415ff2c5137f33b6c725d010d092483e` |

Ownership released to the coordinator for review. Remaining gates are resolving
the recorded consumer/binding/source gaps and any later ingestion/replay proof.
No new runtime behavior was authored, so no build, full suite, save journey or
browser claim is made. The coordinator owns combined release checks.
