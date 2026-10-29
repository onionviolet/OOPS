# RW3: paragraph-reviewed inference family

Status: **100 steps reviewed, 0 rows, 100 typed gaps**. Private research,
agent-verified, not human-reviewed. No runtime implementation, pack adoption,
playable coverage increase, build, commit or push is claimed. Ownership is
released to the coordinator for review. [Brief](RW3_BRIEF.md).

## Scope and method

Applied CLR1-CLR4, CLR6, CLR9, CLR12; AD6-AD8, AD36, AD44; WPR4,
WPR18, WPR20, WPR27; sealed-secret publication rules. The live lead-first,
forced-canon direction remains unchanged. No new decision or mechanism was
introduced. This lane changes private review data and this generic receipt.
Source, tests, scripts, private packs and other sessions' files were read-only.

Selected the first 100 unreviewed family gaps from the Resume 2 ladder using
`buildGapCensus` and its ordered family rules. Input inventory: 930 family gap
IDs, 392 existing reviewed records at selection, 917 remaining family members.
Volume/shard identity corrects unqualified later-volume chapter locators; source
volume, chapter, scene order and step order control selection. The selected
100 comprise 71 first-volume and 29 second-volume steps. Previously reviewed
steps are skipped regardless of their verdict. The final overlap check found
zero overlaps with other review files.

CLR2 paragraph-retrieval gate: expected nearly all, observed **100/100**,
above the one-half stop threshold. Every selected citation was read through
`shardIndex`/`locatorsOf` from `cite_paragraphs.mjs`; nearby paragraphs were
also read to settle actor ambiguities. Final output has 240 retrievable
paragraph references, counting repeated references across verdicts. One
initial actor classification was corrected after reading adjacent paragraphs.
Each verdict was appended in order, then that attribution and supporting
locators were corrected in the owned output.

The inference adapter requires at least evidence, inference and intention,
and exact already-held observer evidence. Source-supported single thoughts
cannot be padded with an invented next decision. Read/testimony stages cannot
create their own initial evidence. The inspected producers include life-history
records, beat knowledge, place-act receipts, topic receipts and explicit
knowledge effects. Their available records do not supply the exact required
background for the candidate chains identified here. Other gaps reflect
unsupported citations, another actor, or a different action mechanism. Private
verdicts preserve the per-step distinction rather than a blanket rejection.

## Counts

| Kind | Reviewed | Adapter-shaped rows | Gaps |
| --- | ---: | ---: | ---: |
| inference | 100 | 0 | 100 |

| Gap reason | Count |
| --- | ---: |
| no mechanism | 86 |
| actor not the lead | 12 |
| not an action | 2 |

Top five generic detailed reasons:

| Code | Reason | Count |
| --- | --- | ---: |
| G1 | Cited paragraphs do not substantiate the mapped action | 25 |
| G2 | Exact held observer evidence has no mapped producer | 24 |
| G3 | Supported fragment does not complete an evidence-inference-intention chain | 24 |
| G4 | Thought or action belongs to another actor | 12 |
| G5 | Physical practice requires training/skill consumers | 8 |

The remaining seven are ability operations (3), teaching/delivery (2), and
physical actions lexically misclassified as mental actions (2). These are
review findings, not authorisation to implement new systems. No stock,
prices, outcomes, evidence keys or decisions were invented to obtain a row.

## Outputs and input identity

Private outputs are under
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`:
`RW3.jsonl` and `RW3_validate.mjs`. The JSONL contains private paraphrases,
locators and individual gap details; this receipt contains generic counts only.
The validator loads every authored row through `defineInferences` and
`createSimulationRegistry` if rows are present. Here there are **zero authored
rows**, so empty adapter/registry compilation is not row-load evidence.

| Input/output | SHA-256 |
| --- | --- |
| Merged source scene input | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |
| Frozen selection and citations, temporary review input | `61ce10feaebd4707380dd4e061dcd7f34242eee86286188223682929fc08185e` |
| Inspected pack snapshot, JSON serialisation | `4b7eb266604e5e81aa4d95bfc91e387e85a04a1c00416b6c4aca1b3a195a4a1f` |
| Inference adapter | `f23901665ee4990502aab9f28a0664f4a86a2d108c10af401e3a2632c3af996e` |
| Focused test source | `78de8150cb89c59787e21e0aa006fc0fe7f00f3c65aa00e35b0574b0dbfd592a` |
| Final verdict file | `e077bf35f6d94e4f0312b920967d65e51dceccee6eb300b9b72f75f26ba9daa1` |

Temporary selection/pack snapshots are review-session scratch, not required
runtime assets. The durable verdicts retain step identities, citations and
reasons; the validator rereads source shards and checks current cross-lane
review overlaps. Shared live inputs may change after this receipt.

## Checks

Let `R=docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29`.

| Command | Result | Gaps |
| --- | --- | --- |
| `node /tmp/rw3-probe.mjs` | PASS: 100 selected, 100 retrievable; first-volume-first ordering, existing reviews skipped | Offline selection and citation retrieval, not gameplay |
| `node $R/RW3_validate.mjs` | PASS: 100 distinct JSON-safe verdicts, 240 retrievable paragraph references, zero cross-file overlaps; counts above | 0 rows and 0 native commands; no authored-row adapter/registry success claimed |
| `node --test --test-name-pattern='supported text and testimony' tests/cast_inference_adapter.test.js` | PASS: 1 test, 0 failures; real adapter/native registry variants and malformed-row rejection | Existing synthetic contract only; other tests deliberately not selected |
| `node scripts/lane_review.mjs --grant <checkpoint> --grant <private-verdicts> --grant <private-validator> <same three paths>` | PASS: 0 outside-grant paths, 0 name-hit files, 0 top-level-await files | Tool reports 0 tracked files; private/untracked content inspection is not proved by this check |
| `git diff --no-index --check /dev/null docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RW3_CHECKPOINT.md` | PASS | Whole new receipt whitespace only |

No runtime, UI or persistence change: full suite, build, architecture gate,
rebuilt desktop browser and Save/reload/Export/Import were not run. This is a
completed bounded review, not a runtime slice meeting the AD43 floor. The
remaining gate is coordinator review of the private verdicts; source-supported
producer and chain gaps remain open. Human review is optional under AD42.
