# RW2 checkpoint: paragraph review of the making family

Status: **100 steps reviewed; 0 adapter-ready rows, 100 explicit gaps**.
Private source review, agent-verified, not human-reviewed. No runtime, pack,
script-owner, test or save changes; no commit or publication. Authority:
[RW2 brief](RW2_BRIEF.md), [making contract](MF_MAKING_CHECKPOINT.md#pack-contract-and-row-lane-handoff),
[cast direction](../CAST_LIVES_CARD.md). Rules: CLR1–CLR4, CLR6, CLR12,
AD36/AD44, WPR1/WPR2/WPR21/WPR27; making rows must preserve material inputs,
outputs, actor, place and order under MR1–MR36. This review changes no direction.

## Probe and selection

F1: The Resume 2 ladder, classified with the current ordered census rules,
contains 297 unique gap/lossy-gap members in this family. The historical table's
366 minus 70 gives 296; that dated number is not asserted for these current
input bytes. Ten members were already reviewed in the existing JSONL files
and were skipped. The next 100 were selected in source scene order, volume 1
first: 34 from volume 1, 59 from volume 2 and seven from volume 3.
All 100 have retrievable cited paragraphs, meeting the brief's half-retrievable
CLR2 gate. Each disposition was appended after reading its cited paragraphs
and neighbouring context, rather than generated from its action label.

F2: Some later-volume scenes have unqualified chapter locators that the mapping
labels volume 1. Selection and citation lookup use the scene's volume-bearing
shard identity to disambiguate those locators. Source order is volume, chapter,
paragraph, scene order and step number. The selected list has zero paragraph
order inversions within chapters. No mapping or source file was repaired by RW2.
The private probe records mapping, merged-scene and pack hashes; citations
retain original evidence and the disambiguated paragraph keys.

F3: The new making field supports fixed physical batches with real native
inventory inputs and a product consumer. It does not supply the separate
semantic-text, ritual, equipment, disposal or other-actor behavior needed by
most selected steps. The physical-preparation candidates still lack native
item/material/law/consumer bindings or require intermediate-stage state.
Source quantities that are stated remain in private evidence; missing stock,
amounts, timing, powers and outcomes were not invented. The live pack had no
`making` field at the probe. No row was downgraded merely to avoid adapter
validation; none reached a complete source-supported row shape.

## Counts and generic reasons

All 100 records have `kind: making`; verdicts: **row 0, gap 100**.

| Gap reason | Count |
| --- | ---: |
| no mechanism | 71 |
| not an action | 13 |
| unresolved person/place/object | 11 |
| actor not the lead | 5 |

The following five themes partition the 100 dispositions for the coordinator;
they are review categories, not new implementation scope or accepted decisions.

| Rank | Generic missing behavior or mismatch | Count |
| --- | --- | ---: |
| 1 | Ritual, projection, boundary or mental-context owner | 40 |
| 2 | Document, message, inscription or destruction owner | 26 |
| 3 | Equipment, fixture, tactical or travel state instead of production | 19 |
| 4 | Physical preparation lacks native item, material or consumer bindings | 10 |
| 5 | Another actor performs the action | 5 |

Private per-step details distinguish unsupported action labels from supported
actions whose mechanism or bindings are missing. No secret truth is published
here. A gap is evidence for later work, not playable coverage.

## Files and checks

Private output directory:
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`.
Owned files: `RW2.jsonl`, `RW2_citations.json`, `RW2_probe.mjs`,
`RW2_probe.json`, `RW2_review.mjs`, `RW2_validate.mjs`, `RW2_validation.json`,
and this checkpoint. Other sessions' files remained read-only.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node <private-output>/RW2_probe.mjs` | PASS: 297 family gaps, 10 previously reviewed, 100 selected, 100 retrievable | Source/mapping probe only. Input hashes in private report; rerunning uses current other-lane review files. |
| Five individually authored Node append batches using `RW2_review.mjs` | PASS: 100 ordered, unique JSONL verdicts | Review only; no runtime adoption. |
| `node <private-output>/RW2_validate.mjs` | PASS: 100/100 records match selected IDs/order; JSON safety, required fields, nonempty requirements if present; zero duplicate IDs | 0 row verdicts, so adapter/native content validation has denominator 0. No playable-row validation is claimed. |
| Real `defineCastMaking(undefined, binding)` and `createSimulationRegistry({commands: []})`, through validator | PASS: zero commands | Absence behavior only; not evidence of any source recipe working. |
| `node --check` on the three private `.mjs` helpers; Python owned-file whitespace and checkpoint-link checks | PASS: three syntax checks, eight files without trailing whitespace, three local links resolve | Static checks only. |
| Build, focused runtime tests, full suite and browser replay | Not run | No runtime edits or adopted rows. Coordinator owns later binding, integration and gameplay verification. |

JSONL SHA-256:
`e5363ad060b5ff2b52ed290691fe954069d7a2a613054dc1be4c8f27fc601e46`.
Review quota reached at 100; 187 initially unreviewed family members remain
beyond this lane's selected slice. This is not a whole-family completion claim.
Owned files are released to the coordinating session. No commit, staging,
stash, reset, force, push or player-save access occurred.
