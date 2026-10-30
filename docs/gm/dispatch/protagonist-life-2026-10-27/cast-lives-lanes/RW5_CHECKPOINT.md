# RW5 checkpoint: relaxed making-row review

Status: **150 steps reviewed: 9 adapter-ready rows, 141 explicit gaps**.
Private source/content compilation, agent-verified, not human-reviewed. No
runtime, test, script-owner, private-pack or save edits; no commit or publication.
Authority: [RW5 brief](RW5_BRIEF.md), [AD2 relaxation](AD2_CHECKPOINT.md),
[making contract](MF_MAKING_CHECKPOINT.md#pack-contract-and-row-lane-handoff),
[cast direction](../CAST_LIVES_CARD.md). Rules applied: CLR1-CLR4, CLR6,
CLR12, AD6-AD8, AD36, AD44, MR1-MR36. No new accepted direction.

## F1: probe and review scope

Re-reviewed all 100 RW2 steps, then the first 50 further unreviewed making-family
steps in volume/scene order. The current Resume 2 ladder and ordered family
rules yield 297 unique family gaps. Prior reviews across existing JSONL files
were excluded for the additional selection; RW2 overlap is deliberate under
the second-pass instruction. All 150 citations are retrievable, passing CLR2's
half-retrievable gate. Selected volumes: 34 / 59 / 57 for volumes 1 / 2 / 3.
This is the authorized review quota, not whole-family completion.

Read cited text through `shardIndex`/`locatorsOf` from the actual
`cite_paragraphs.mjs` bridge. Later-volume unqualified locators were disambiguated
using the scene shard's volume, following RW2's probe. Each disposition was
appended after the selected citations were read; supported document candidates
then received an additional context/binding review. RW2 itself is unchanged.

## F2: admitted shape and remaining gaps

All 150 records have `kind: making`. The nine row verdicts contain individual
`making.rows` entries, rather than whole pack envelopes, as the current reviewed
merge expects. AD2 forms: **4 document destroy, 4 document write, 1 inscribe**.
Eight rows supersede RW2 gaps; one comes from the additional 50 steps.
Stable IDs derive from source step IDs. Existing registry places are used;
source-established residence/table locations resolve missing mapper places.
No ambiguous inn or cabin identity was forced. Object keys record the supported
step-specific fact; they do not register inventory templates or seed stock.

Each row records its own object fact and observer knowledge. No recipe, stock,
usable substitute, ritual answer, delivery, recipient knowledge, concealment
guarantee, equipment state or physiology effect is granted. Unknown stock costs
remain unasserted, with the adapter's existing “stock cost not recorded” display.
These receipts are not evidence that downstream text/custody consumers exist.

Timing is a **labelled one-minute gameplay fill**, following the
[A3 convention](A3_CHECKPOINT.md) and the
[accepted timing direction](../../../../USER_VISION.md#cast-lives-timings-need-not-be-exact-to-the-hour-2026-10-29).
It is recorded separately from source timing in every admitted private record.
One brief source act is explicitly rounded to the native integer-minute envelope.
An initial draft treated missing exact minutes as a blocker; that was corrected
against the live timing direction before final validation. Numeric clock values
belonging to preceding waits were not silently reused as action durations.
Null/omitted/sub-minute adapter durations still fail validation; that technical
fact is not an added source-fidelity gate or a request to change the adapter.

| Gap reason | Count |
| --- | ---: |
| not an action (the labelled action is not established by its citations) | 64 |
| no mechanism (different owner or lossy fold) | 40 |
| actor not the lead | 22 |
| unresolved person/place/object | 15 |

Top five generic reasons partition the 141 gaps:

| Rank | Generic theme | Count |
| --- | --- | ---: |
| 1 | Citation/action mismatch | 64 |
| 2 | Different mechanism or compound step loses effects | 40 |
| 3 | Another actor performs the action | 22 |
| 4 | Physical stock, intermediate transformation or product binding | 10 |
| 5 | Unresolved document/preparation location | 5 |

These are findings, not newly authorized implementation work. Paragraph support
for a fragment is not counted as complete coverage of a compound step (CLR6).

## F3: files, checks and handoff

Owned files only:
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW5.jsonl`
and this checkpoint. Temporary probe/author/validation helpers live under
`/tmp/rw5-*`; they are local scratch, not additional shared-file changes.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node /tmp/rw5-probe.mjs` | PASS: 297 family members; 100 prior + 50 additional; 150 retrievable | Snapshot selection from existing reviews, not live gameplay coverage. |
| `python3 /tmp/rw5-author.py`, two `python3 /tmp/rw5-append.py <batch>` runs, `python3 /tmp/rw5-admit.py` | PASS: 150 ordered dispositions; supported candidates corrected under labelled timing fills | Authoring helpers require the initial scratch selection; not a reusable source-row generator. |
| `node /tmp/rw5-validate.mjs` | PASS: 150/150 unique ordered IDs, exact RW2 first-100 match, JSON safety, required fields, no undefined/empty requires; 9/9 rows pass `defineCastMaking` and native registry | Compilation only; no played source journey. Synthetic positive control passes; null, omitted, zero and fractional minutes are rejected as expected. |
| Node in-memory pack/merge check using `mergeReviewedRows(pack, [reviews])` | PASS: 9/9 existing place IDs, 9 combined native commands; 9 making rows added; full merged definitions validate (101 topic, 530 journey, 536 act, 9 making) | Live pack is read-only; merged candidate is not written or adopted. No end-to-end text/custody consumer claim. |
| `node --test --test-name-pattern='timed preparation and document handling' tests/cast_making_adapter.test.js` | PASS: 1/1 focused existing AD2 test | Other adapter tests and native browser/persistence journeys not run by this content lane. |
| Python owned-file whitespace/local-link check; `git diff --check -- docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RW5_CHECKPOINT.md` | PASS: both owned files, local links, whitespace | Static checks only. |
| Build, full suite, rebuilt desktop browser and source replay | Not run | Coordinator owns content adoption and combined gameplay acceptance. Review/compilation is not AD43 gameplay completion. |

Final RW5 JSONL SHA-256:
`d6db8be57626c9a091a2c09548fd72d6526750c2a54b411d6f3487fc3dcfdac3`.
Validated adapter SHA-256:
`b2eb6581581151e46ced8793ae946cb97c6c08a1e3b99f93adb63fdb876b3061`.
Native registry source SHA-256:
`74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158`.

Ownership released to the coordinating session. No commit, staging, stash,
reset, force, push or player-save access occurred. Remaining acceptance gate:
coordinator adoption and a fresh-origin rebuilt source replay, including the
actual downstream consumers; no source-row gameplay is claimed here.
