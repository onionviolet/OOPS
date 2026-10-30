# RW4: relaxed-adapter paragraph re-review

Status: **150 steps reviewed: 0 row verdicts, 150 typed gaps**. Offline private
research, agent-verified, not human-reviewed. No gameplay coverage, runtime,
pack adoption, commit or publication. The two owned outputs are released to the
coordinator. Authority: [RW4 brief](RW4_BRIEF.md), its second-pass instruction,
[AD2](AD2_CHECKPOINT.md), [query contract](MF_DIVINATION_CHECKPOINT.md#d1-row-contract-for-the-content-lane),
and the current lead-life direction in [PROJECT](../../../../../PROJECT.md).
Applies: CLR1–CLR4, CLR6, CLR12, AD6–AD8, AD36, AD44; sealed-secret publication
rules. No accepted direction or registered rule changed.

## F1: scope, probe and private output

Private output:
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW4.jsonl`.
Each verdict was appended after paragraph review. Public reporting here contains
counts and generic mechanisms; source locators and paraphrases remain private.
RW1 and the other reviewers' files were read without modification.

The first 100 records re-review RW1's exact 100 identities in its existing scene
order. The next 50 are further unreviewed family members, ordered by source
volume, chapter, scene and step. Selection reuses the X4 Resume 2 ladder census
and mapping/source-scene selection recovered by RW1; it checks identities against
the live census and checks additional steps against the other reviewed files.
Seventeen further ability-family candidates were inspected and excluded because
they were direct perception, artifact powers, combat, ordinary calls or immediate
messenger calls without a cited rite. Divination-family misclassifications were
retained as typed gaps rather than silently skipped. The family is not exhausted.

Paragraphs were read through `shardIndex` from
`scripts/lead_run/cite_paragraphs.mjs`, with nearby paragraphs consulted where
needed. Later-volume citations use their actual source volume. Neighboring
passages used to clarify verdicts are included in the private locator where
material to that verdict. Raw source text was not copied to the outputs.

| CLR2 probe | Expected | Observed | Gate |
|---|---:|---:|---|
| RW1 records re-reviewed | 100 | 100 | Met |
| Additional eligible unreviewed records | Up to 50 | 50 | Met |
| Selected records with retrievable paragraphs | At least half | 150/150 | PASS |
| Authored citation references retrieved | All | 555/555, zero missing | PASS |
| Duplicate step identities | 0 | 0 | PASS |
| Additional-step overlap with other reviews | 0 | 0 | PASS |

Kind counts: `divination=150`, admitted row kinds `divination=0`, gap kinds
`divination=150`. Census families: 128 divination/ritual and 22 ability-family
rites. Source-volume counts: 51, 51 and 48 in the first three volumes.

## F2: results and top five generic gap reasons

AD2 removes the old mandatory-payment and complete-stage blockers. They were
not reused as rejection reasons. Unknown costs do not mean zero payment, and an
omitted stage does not supply an answer or an invented rite.

Thirty-seven provisional fragments (28 re-reviewed, nine additional) passed the
relaxed adapter and native command registry syntactically. They were **rejected
from the final output**: their proposed means/contact predicates depended on new
support facts with no existing acquisition or contact producer. A schema-valid
predicate is not evidence of held means. Adding these facts or setting them true
would invent availability. The final records retain the paragraph-supported
paraphrase with a binding gap and `row:null`. The draft's provisional timing and
support keys are not delivered as content.

Counts name the first sufficient blocker, not every possible limitation.

| Rank/code | Exact private gap reason | Count | Generic next binding or mechanism |
|---|---|---:|---|
| 1 / G1 | unresolved person/place/object: subject or location binding missing | 63 | Resolve the actual subject and performed-rite location. Preserve separate person records; a scene's broad or forward-address place is not automatically the rite's location. Consumed objects need actual stock keys. |
| 2 / G2 | unresolved person/place/object: native held-means/contact binding missing | 37 | Connect the supported fragment to existing inventory, capability and contact producers. A new unproduced support flag does not establish those conditions. |
| 3 / G3 | not an action: cited paragraph does not support mapped rite | 35 | Correct the source linkage or route the action to its actual owner. Lessons, thoughts, travel and already-observed outcomes do not supply a performed rite. |
| 4 / G4 | unresolved person/place/object: held means or contact not established | 8 | The text reports a result or broad activity without enough support detail for the retained means/contact contract. Unknown costs and omitted stages do not establish those inputs. |
| 5 / G5 | actor not the lead | 5 | Keep another actor's prayer or possessed body's performance with its actor/body owner. |

Remaining reason G6: `no mechanism: required physical effect owner unbound`,
**2** records. Projected-persona prayer and forwarded communications need their
projection and delivery owners; an observer receipt cannot grant that behavior.
All six reasons total 150. No stock, payment, recipient knowledge, person merge,
physical effect or canon alternative was invented.

## F3: checks, identity and limits

Temporary selection, reading and validation helpers are local scratch under
`/tmp`, not additional checkout deliverables. The final validator invokes the
real `defineDivinations` and `createSimulationRegistry` for any row verdict.
There are **zero admitted source rows and zero output commands**. Empty adapter
and registry success is not source-row or gameplay validation.

| Command | Result | Gaps |
|---|---|---|
| `node /tmp/rw4-validate.mjs` | PASS: 150 records; RW1 100/100 retained; 50 additional; 555/555 authored references; zero duplicate IDs, missing citations, additional prior-review overlaps, undefined values or empty requires arrays | Adapter row PASS count 0; output native command PASS count 0. Census/source linkage and JSON checks do not prove playability. |
| `node /tmp/rw4-support-check.mjs` | PASS: 37 provisional drafts compile through the real adapter and registry, but both support predicates per draft are absent from the live pack and fail without a producer | Diagnostic drafts excluded from output; this does not establish acquisition or runtime support. |
| `node --test --test-name-pattern='row validation\|partial rites' tests/cast_divination_adapter.test.js` | PASS: 2 tests, zero failures | Existing synthetic checks cover invalid row inputs and relaxed partial/unpaid rites with native effects; no source-row journey. |
| `node scripts/lane_review.mjs --grant <RW4.jsonl> --grant <RW4_CHECKPOINT.md> <RW4.jsonl> <RW4_CHECKPOINT.md>` | PASS: outside-grant 0, source/test candidates 0 | Exact two owned paths only; name scanner does not inspect private paraphrases or Markdown. |
| `python3 /tmp/rw4-doc-check.py` | PASS: both outputs have clean whitespace, 150 JSON records and all four local Markdown links resolve | Static output/document checks only. |
| Full suite, build, architecture/rule gates, desktop browser and save/import | Not run | No runtime, UI, rules or persistence changed. Later integration and gameplay verification belong to the coordinator after actual row bindings exist. |

Observed shared HEAD at closing: `2294b9d5c98ed29c59b0a4483a8772199487f2a3`.
Input/output SHA-256 identities at validation:

| Input/output | SHA-256 |
|---|---|
| RW4 JSONL | `914052c986f46ebb2095aa7c229461778a552065c1866cc86d10cf55405db56f` |
| RW1 JSONL | `433aac28bab6b8ba0175884e0221ad66019c0decd1c0dcbe081ec3dc32fb6c7b` |
| Divination adapter | `c1c8b8da93ccf5ea2b77afcf7dad8d02f6818278ff2398a050cb5f5ea0d3e621` |
| Native registry contracts | `74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158` |
| Live private pack | `abb1eb1ea73226b2be5ba0facfc50de84e3d83f4e1a9fea77a5ea9e6c0db0d6f` |
| X4 ladder census | `0429dc8ce7d0ef66c02ee30449b5f6344d8727247de1f4c24ec03e609da39f23` |
| Merged source scenes | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |

Only RW4.jsonl and this checkpoint were written in the checkout. Concurrent
edits were preserved. No source, tests, scripts, private packs, build output,
player saves or Git state were changed by this lane. The remaining content gate
is binding the recorded supported fragments to actual held means, contact,
subjects and locations, or resolving their recorded source/owner mismatch.
There is no new playable slice or browser acceptance claim in this delivery.
