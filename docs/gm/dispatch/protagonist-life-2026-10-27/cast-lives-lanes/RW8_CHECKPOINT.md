# RW8 checkpoint: ability and conflict paragraph review

Status: **100 steps reviewed; 2 adapter-ready candidate rows, 98 explicit gaps**.
Private source review and adapter/native-registry validation, agent-verified,
not human-reviewed. This is not playable coverage or AD43 completion. No pack,
runtime, test-owner or script-owner changes; no staging, commit or publication.
Authority: [RW8 brief](RW8_BRIEF.md), [ability pack contract](MF_ABILITY_CHECKPOINT.md#d2-private-pack-contract-and-row-lane-handoff),
[cast direction](../CAST_LIVES_CARD.md). Applies: CLR1–CLR4, CLR6, CLR9,
CLR12; AD2/AD6–AD8/AD36/AD44; WPR1/WPR2/WPR4/WPR8/WPR21/WPR27.
This review changes no accepted direction.

## F1: selection and source probe

Owned output: private
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/RW8.jsonl`
and this checkpoint. Existing source, mapping, pack and other review files were
read-only. Verdicts were appended in reviewed batches; one provisional gap was
corrected to a row after checking the contract's explicit partial-descriptor
support. The final file has one line per step and no duplicates.

At selection, the 19-range X4 Resume 2 ladder contained 321 unique gap/lossy-gap
members across the two requested families: 160 ability-use and 161 fight/evasion.
Existing review files contained 792 unique reviewed steps at selection time;
31 intersected these families and were skipped. Selected the next 100 by actual
source volume, chapter, cited paragraph, scene and step: **26 / 46 / 28** from
the first three volumes. Selection stopped at 100, not family exhaustion.
The remaining family members are outside this brief.

Some later-volume scenes have bare chapter citations and mapping volume 1.
Qualified those citations using the volume-bearing `lotmNc` source-shard
identity. Ordinary batch/shard numbers are not volume identifiers. No source
or mapping was repaired. Lookup used `shardIndex` and `locatorsOf` from
`scripts/lead_run/cite_paragraphs.mjs`, with the whole-book merged scenes.
**100/100 selected steps have all cited paragraphs retrievable**, passing the
inherited CLR2 half-retrievable gate. Final locators, including bounded context
actually consulted, resolve to 257 unique paragraphs (319 citation references).
This is a bounded cited-paragraph review, not a full-chapter or whole-book read.

## F2: rows, gaps and the five generic reasons

All records have `kind: ability`: **row 2, gap 98**. Each row is one encounter
with one canon move, lowers through `defineCastAbilities`, and passes
`createSimulationRegistry`, separately and together. Both record directly
observed perception as observer knowledge with an observation basis. Neither
grants a faculty or changes another actor's body. Known place IDs resolve to
non-anchor pack places; no physical co-location with a remote projection is
invented. Source identity, acquisition/classification and costs remain null.
One native minute is an explicitly labelled scheduling fill retained in each
private paraphrase, not a claimed source duration. Unknown amounts, stages and
prior evidence alone were not used to reject a row.

| Gap reason | Count |
| --- | ---: |
| no mechanism | 56 |
| unresolved person/place/object | 28 |
| actor not the lead | 12 |
| not an action | 2 |

The following five review themes partition the 98 gaps. These describe what a
later lane would need to resolve, not accepted scope or new completion gates.

| Rank | Generic reason | Count | Needed evidence or consumer |
| --- | --- | ---: | --- |
| G1 | Cited evidence does not establish the labelled move | 35 | Bind the actual action paragraph; do not infer intermediate attacks, targets or outcomes from scene endpoints. |
| G2 | Native identity or physical input is unresolved | 28 | Resolve the actual place, target, held object or stock without inventing IDs, quantities or successful results. |
| G3 | A receipt loses a required state transition | 18 | Preserve body failure, spatial pursuit, projection attendance, dream/body separation, carrier custody or recipient-specific information in its actual owner. |
| G4 | The acting person is not the lead | 12 | Keep the other actor's command and costs separate; observation does not transfer authorship of the action. |
| G5 | Triage label describes another family, retrospective event or interrupted intention | 5 | Use the interpersonal/exchange route or retain an explicit non-action gap; avoid replaying an already settled event. |

`no mechanism` includes an unsupported action at the cited locus, not a claim
that the whole source lacks that action. Likewise, missing owner bindings are
unknowns in this candidate, not world-wide prohibitions. No gap was converted
to a knowledge receipt merely to hide lost physical inputs or outcomes.

## F3: checks and input identity

| Command | Result | Gaps |
| --- | --- | --- |
| Inline Node selection probe importing `buildGapCensus`, `shardIndex`, `locatorsOf` | PASS: 321 family members, 31 prior family reviews skipped, first 100 selected; source retrieval 100/100 | Read-only snapshot; later concurrent source changes require rechecking selection identity. |
| `node /tmp/rw8-validate.mjs` | PASS: 100 JSONL records in selected order, unique IDs, supported snapshot family membership, all citations resolve, no undefined or array-valued requires, 2 rows/2 commands pass the real adapter and registry, known non-anchor row places, zero cross-lane duplicates | Ephemeral lane probe; no pack merge or native gameplay journey. |
| Inline Node checkpoint link/public-text smoke check; `git diff --check -- docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RW8_CHECKPOINT.md` | PASS: local links resolve, generic public text, no diff whitespace errors | Checkpoint is untracked, so diff check alone does not inspect its content; inline checks read it directly. |
| Same validation probe, deliberately array-valued move `requires` | PASS: actual adapter/native registry rejects the malformed row | Focused failure scenario only. |
| `node --test --test-name-pattern='absent packs\|held source\|native observation\|unknown details' tests/cast_ability_adapter.test.js` | PASS: 4/4 focused adapter tests, zero failures | Existing synthetic fixtures; live integration test excluded. No full suite, build, browser or persistence claim. |

The first adapter-inspection one-liner mistakenly imported a nonexistent ID
module and failed before validation. Corrected the lookup from the live host's
exported binding; the actual validation and focused tests above then passed.
No owner file was changed to repair the probe.

F4: A later validation against the live ladder failed its gap-membership check
because another session refreshed the mapping during RW8: one selected
perception candidate is now `clean_fold`. The private output identifies that
step. This is input drift, not a row-validation failure. Rechecked the frozen
selection's original mapping rows through `buildGapCensus`; all 100 belong to
the requested families, and the final probe passes. Live pack, scenes, adapter,
contracts and family-rule hashes remained unchanged. The refreshed ladder
identity is `56a779a9f55f48fe37478f89f97d1d69ee2e49520c8fae2b90a083c5738a8a34`.
Coordinator should reconcile the now-mapped candidate rather than assume this
review adds two previously uncovered controls. No cross-lane review duplicates
were present at the final probe.

SHA-256 input identities:

| Input | SHA-256 |
| --- | --- |
| RW8 JSONL | `8687de438dad6007f46ff93cd4c0814989a22f93f7c9f880e7c4867c1f5fe239` |
| Live private pack | `09c971e95889d9f80bc6f9f15b423547f54cf9bfbd8aa3fa1197e65c80c28e61` |
| Whole-book merged scenes | `27540d66f80aeec3301aab50bc00a297e07ab99e55ade4dabdfc6eb46bc3735b` |
| Ability adapter | `bc6c1f6a8bc0f151603b2b7ceb1b2143bb71829f0bbc29c56ba6b25b41b4e005` |
| Native simulation contracts | `74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158` |
| Census family rules | `dae92e22b126edbf77a0a31c10318968b12fac9d9c65364c87776ce5e263b284` |
| Focused adapter test | `5918a67b4eda3b0bdca6a1a400a4c4afca0b8d71cc8aa0c5afc2a24d9b551535` |
| 19-range ladder identity | `e47a20b286956464cab1d1270c5110bedcf999936976bc27ab64bef5c1b422c6` |

Ladder identity hashes the lexically sorted list of
`filename + NUL + sha256(file)`, joined by newline. The temporary selection
snapshot hash is `0eb625f88af7c9ed057863497dc4976af845ee061e066969369f59060fe2c024`.

Remaining coordinator work: review the two partial-descriptor candidates,
merge selected rows into the pack through the appropriate owner, and measure
actual gameplay/replay behavior. Their unknown source identities do not supply
held-source admission guards. Adapter acceptance proves row shape and native
contract validity; it does not establish an earned route, correct scene order
in a live life, persistence or rebuilt desktop behavior. The 98 explicit gaps
remain available for source/binding/consumer follow-through. No human review
is a blocker to this completed review lane. Owned files are released to the
coordinator; RW8 made no commit.
