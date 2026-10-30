# C4 fold report, 2026-10-30

F1: Folded the returned partial outputs, source-reviewed all 60 available rows,
and recorded exact unread IDs. Highest state: source-reviewed and compiler-exercised,
agent-verified, not human-reviewed. No runtime or host files changed; no commit.
Rules: AD36/AD38, WPR4-WPR8 and WPR18-WPR23; existing L4 act seam.

F2: Original coverage failed because `luna_methods_05.jsonl` omitted 214 IDs.
Added 8 source-backed rows covering 9 IDs, retained the original 2 rows, and added
the exact remaining 205-ID unread trailer. The explicitly authorized over-150-ID
handoff is [luna_5b.md](luna_5b.md): 205 IDs, 208 occurrences, one new private output.
No reader was launched by this lane. Other outputs remain partial as reported below.

F3: Address review found 288 metadata occurrences with incorrect volume assignments.
`bNs`/`wNs` are volume-1 reading waves, not volume numbers; registry `shards`
plural also matters. Exact source headers and explicit book locators determine the
private correction ledger. Hashed assignment inputs, manifest and existing helpers
were preserved. The old preparation command still prints its original volume census;
its PASS below proves partition coverage, not the correctness of that census.
The table below uses corrected addresses, without claiming all those source texts read.
No new volume-1 inventory was commissioned.

## Counts

48 reviewed procedure rows cover 56 IDs; 12 reviewed GM33 rows cover 12 IDs.
Unread: **1,022 procedure IDs and 175 GM33 IDs**. Per-volume counts overlap when
an ID has multiple volumes. There are 11 distinct normalized act rows; no authored
runtime bindings were supplied, so all 11 remain unbound and produce zero commands.

| Source volume | Reviewed procedure IDs | Reviewed GM33 IDs | Normalized act rows | New bound rows / commands | Unread procedure IDs | Unread GM33 IDs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 21 | 11 | 6 | 0 / 0 | 185 | 20 |
| 2 | 19 | 1 | 2 | 0 / 0 | 94 | 46 |
| 3 | 0 | 2 | 0 | 0 / 0 | 0 | 24 |
| 4 | 6 | 1 | 4 | 0 / 0 | 250 | 31 |
| 5 | 3 | 0 | 0 | 0 / 0 | 297 | 41 |
| 6 | 11 | 0 | 1 | 0 / 0 | 141 | 32 |
| 7 | 1 | 0 | 0 | 0 / 0 | 89 | 31 |
| 8 | 0 | 0 | 0 | 0 / 0 | 47 | 15 |

Existing baseline compile: 77 rows, 5 bound rows, 14 commands, 72 unbound.
By declared row volume: volume 2 has 10 / 1 / 4 / 9; volume 3 has
53 / 2 / 6 / 51 (rows / bound / commands / unbound). The 14 baseline rows
without a declared volume have 2 bound rows, 4 commands and 12 unbound rows;
they are not silently assigned to volume 1. Volumes 1 and 4-8 have zero baseline
rows explicitly declaring those volumes.

## Review receipt

All available rows were checked, so each family meets the 15-or-all sample rule.
Original 52 rows: **16 pass unchanged, 36 corrected, zero rejected**. All 8 added
rows were also source-reviewed. Corrections include address provenance, evidence
labels, known-method classification, unsupported attribution and partial coverage.
Unavailable details remain gaps. No sealed truth is present in this report.

| Final family | Checked rows |
| --- | ---: |
| `no_content` | 15 |
| `ritual_other` | 8 |
| `occasion_of_known_method` | 12 |
| `craft` | 4 |
| `summons` | 4 |
| `potion_rule` | 3 |
| `divination` | 1 |
| `aid_preparation` | 1 |
| `gm33` | 12 |

Exact sampled IDs, locators, verdicts and correction notes: [review.jsonl](../../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/review.jsonl).
Exact unread IDs and corrected volumes: [unread.jsonl](../../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/unread.jsonl).
Address corrections: [volume_corrections.jsonl](../../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/volume_corrections.jsonl).
Accepted partial outputs: [methods_reviewed.jsonl](../../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/methods_reviewed.jsonl) and
[gm33_reviewed.jsonl](../../../../../research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/gm33_reviewed.jsonl).
Original reader files are preserved as private `*.pre-fold` snapshots.
Private `*.review-source.jsonl` receipts retain anchor windows; `fold_hashes.json`
identifies the final private inputs/outputs. Reading was by cited excerpts, not
consecutive chapters or whole volumes; exact source-word total was not measured.

## Checks

Commands below ran from the checkout root. `C4` means
`docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4`; `PRIVATE` means
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus`.
Observed shared HEAD: `bd4e66cb5bc761d4fa89d06fa8163fb02d3a4f20`; the tree includes
other sessions' work. No claim of a clean global worktree.

| Command | Result | Gaps |
| --- | --- | --- |
| `python3 $C4/prepare.py --outputs` | PASS: all 6 exact output partitions, IDs represented once as extracted or unread; input hashes unchanged | Original volume census is superseded by private address corrections; unread is not extracted |
| `python3 $PRIVATE/fold_review.py` | PASS: 60 review receipts; 48 procedure and 12 artifact rows folded | Explicit corrections and partial source coverage only |
| `python3 $PRIVATE/verify_fold.py` | PASS: 56 procedure IDs, 12 artifact IDs, 1,197 exact unread IDs, 205-ID handoff partition; usable-row and artifact-claim checks | Structural invariants do not replace source review |
| `node $PRIVATE/review_source.mjs` | PASS: private anchor/claim-window receipts generated | Existing old helper's volume inference remains unchanged |
| `node $C4/compile.mjs` | PASS: 77 / 5 / 14 / 72 baseline rows / bound / commands / unbound | Baseline only |
| `node $C4/compile.mjs --rows $PRIVATE/normalized_acts.mjs --bindings $PRIVATE/authored_bindings.mjs` | PASS: 11 rows, 0 bound, 0 commands, 11 unbound | No new playable coverage |
| Same private compile plus `--require-bound` | EXPECTED FAIL, exit 1: 11 unbound rows | Negative gate correctly rejects missing bindings; not reported as bound success |
| `node --test tests/lotm_act_engine.test.js` | PASS: 4/4, no skips | Existing engine slice only |
| `git check-ignore --stdin` over all private files | PASS: 44/44 ignored | Private files remain local |
| Inline Python local-link / trailing-whitespace checks; `git diff --check -- <two owned tracked paths>` | PASS | Checks scoped to the two new tracked documents |

A1: Coordinator launches `luna_5b.md` if continuing methods_05. Remaining IDs in
all other batches stay in their original trailers and `unread.jsonl`. Fold new
returns by replacing those IDs in trailers, not by blind concatenation.
A2: L4 runtime owner supplies eligibility, place, positive times, stock, output,
effects and risk bindings. Separate divination/potion consumers and GM33 owners
remain separate. No compile code change or `compile.patch` was needed.
A3: Build, fresh-origin desktop journey, persistence proof where relevant and the
committer's full suite remain with the integrating lane. No gameplay completion,
installed-app change or browser proof is claimed here.
