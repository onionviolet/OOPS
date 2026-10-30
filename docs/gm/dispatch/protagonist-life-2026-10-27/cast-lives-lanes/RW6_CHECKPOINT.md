# RW6: relaxed inference paragraph review

Status: **authoring complete; content-compiled, not gameplay-verified**.
[Brief](RW6_BRIEF.md), [adapter contract](MF_INFERENCE_CHECKPOINT.md),
[relaxed forms](AD2_CHECKPOINT.md). No commit or private-pack mutation.
Rules: CLR1-CLR4, CLR6, CLR9, CLR12; AD6-AD8, AD36, AD44.
The existing lead-first forced-canon direction remains unchanged. This lane
adds private source dispositions over the existing inference seam; it changes
no runtime, tests, scripts, rules or shared direction owners.

## F1: scope, probe and files

Re-read all 100 RW3 dispositions in their existing order, then reviewed the
first 50 further unreviewed family steps in census scene order. The census
families remain lexical triage: a matching verb can actually describe another
actor, physical practice or a different action. Each disposition follows its
paragraph rather than trusting that classification.

Probe expectation: 100 prior dispositions, 50 additional targets, nearly all
citations retrievable. Observed: 150/150 matching mapping steps and 50/50 additional source
scenes; 372/372 paragraph references retrieved, 327 unique source paragraphs,
zero missing after qualifying later-volume bare citations from their source
shard's volume identity. Source retrieval used `shardIndex` and `locatorsOf`
from `cite_paragraphs.mjs`; no acquisition or source edits. Later-volume
qualification is recorded privately on each new disposition, not silently
resolved against the first volume. The unchanged RW3 input retains its own
locators. Review considered the cited paragraphs and bounded context where
actor attribution needed clarification.

Owned outputs, relative to the repository root:

| File | Publication class |
| --- | --- |
| `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW6.jsonl` | Private research; 150 appended dispositions, then bounded corrections after validation/review |
| `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW6_validate.mjs` | Private validation helper; reads source outputs and pack, no writes |
| This checkpoint | Public, counts and generic mechanism descriptions |

## F2: counts and remaining reasons

| Pass | Reviewed | Inference rows | Gaps |
| --- | ---: | ---: | ---: |
| Existing RW3 re-review | 100 | 36 | 64 |
| Further unreviewed steps | 50 | 20 | 30 |
| Total | 150 | 56 | 94 |

All row and gap dispositions have kind `inference`. Admitted command kinds:
33 `infer`, 20 `intend`, 2 `postpone`, 1 `recall`; one command per row.
Gap reasons: 76 `no mechanism`, 16 `actor not the lead`, 2 `not an action`.

Top five generic reason groups, disjoint and covering all 94 gaps:

| Group | Count | Meaning / next owner |
| --- | ---: | --- |
| Paragraph does not establish the mapped action | 51 | Repair source-step citation or mapping before authoring; unrelated thoughts cannot stand in for it |
| Action belongs to another participant | 16 | Attribute that participant's action; do not mint the lead's intention |
| Physical practice or physical-action misclassification | 11 | Exercise/skill or physical-action owner, rather than a thought receipt |
| Text, testimony or observer basis lacks its binding | 9 | Four text-access/evidence, three received-testimony, two observer-attribution gaps; preserve knowledge/truth separation |
| Communication or supernatural operation needs its own mechanism | 7 | Three instruction/delivery, four ability-operation gaps; own knowledge does not deliver or perform them |

Rows preserve supported fragments, not a claim to the entire surrounding
operation. A hypothesis writes qualified observer knowledge; a plan records an
intention without executing it, moving stock, delivering information, granting
capabilities or asserting a future result. No invented held-evidence keys,
stock, prices or outcomes were supplied. Explicit native support is nonempty.
Places are omitted when unresolved, or checked against the pack when supplied.

Scheduling default: untimed mental fragments use the adapter's one-minute
minimum as a labelled approximation, not a source-measured duration. Each row
records this outside its adapter-shaped payload. The actual thought/report and
observation remain paragraph-supported. No stock debit is asserted; the adapter
owns native timing and thought receipts. Exact source timing and downstream
consumption of these new source rows are not proven by compilation.

## F3: checks, identity and handoff

Run the private helper from the repository root:
`node docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW6_validate.mjs`.

| Command | Result | Gaps |
| --- | --- | --- |
| Temporary paragraph-selection/retrieval helpers using `cite_paragraphs.mjs` exports | PASS: 100 existing + 50 new targets; 372 paragraph references, 0 missing | Selection helpers are local scratch; source-specific paragraph text stays private |
| `node …/reviewed-rows-2026-10-29/RW6_validate.mjs` | PASS: 150 unique dispositions; exact RW3 order; 50 new steps absent from other reviewed outputs; 56 rows / 56 commands through real `defineInferences`, JSON/predicate checks and native `createSimulationRegistry` | Compilation and identity checks, not runtime acquisition or replay |
| Same helper, real `mergeReviewedRows` on an in-memory copy of the live pack | PASS: 56 inference rows added; merged pack validated with 101 talks, 530 journeys, 536 acts and 56 inferences | No pack was written or installed; current counts are input-specific |
| `node --test tests/cast_inference_adapter.test.js` | PASS: 6/6, 0 failures; 57.4 seconds | Existing synthetic fixture, including native headless UI and save/reload/export/import checks; no new source-row journey |
| Whitespace and checkpoint local-link check | PASS, as recorded after writing this receipt | Static checks only |

The focused test's disposable integrated bundle SHA-256:
`ec7035cbfebad0201e91959a1473a2ab243a9537bbcf6609a406ba966ad70607`.
It is a synthetic fixture, agent-verified, not human-reviewed, and does not
establish rebuilt desktop/browser evidence for these new content rows.

Input/output SHA-256 at final content validation:

| Input | SHA-256 |
| --- | --- |
| Inference adapter | `c5abcfb7d44602cee07f061498888d2d34b3d52dade2ab7da94431e2afd6bf33` |
| Native simulation contracts | `74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158` |
| Reviewed-row merge script | `f7cfd028eeb591a5b9ef041d08c3ec8358558b785971a44f6850f11090f67b0a` |
| Read-only live pack | `abb1eb1ea73226b2be5ba0facfc50de84e3d83f4e1a9fea77a5ea9e6c0db0d6f` |
| RW6 output | `f12e22080ab358c285531db5c9db222aa3907c3c3ee0d99a4b714ae2a5af94c0` |

Coordinator may take ownership of these outputs for review and ingestion.
Remaining gates: source-row integration and consumer/replay verification;
combined release checks belong to the coordinator. No full suite, shared build,
publication, installed-app or complete AD43 gameplay claim is made here.
