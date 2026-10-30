# R3b: re-split the unread remainders into small Luna briefs (Sol)
Model: gpt-6.1-sol medium. Read the parents first: [C1_FOLD](C1_FOLD.md) with [c1/FOLD_REPORT.md](c1/FOLD_REPORT.md), [C4_FOLD](C4_FOLD.md) with [c4/FOLD_REPORT.md](c4/FOLD_REPORT.md), and [c5/fold.md](c5/fold.md).
Finding: Luna lanes given 200-3,000 items mostly stalled. C1 resolved 213 of 1,575 slugs. C4 left 1,022 procedure and 175 GM33 ids unread. Several C5 texture lanes hit truncated tool output (lanes 11, 12, 15 and 17 report incomplete).
Task: build small, self-contained Luna briefs for exactly the unread remainder, and no more.
- C1 slugs: at most 40 slugs per brief, from private `slug-cluster/coordinator-gaps.json`. Same output schema as `c1/luna_N.md`, one new private output per brief (`out_b<N>.jsonl`). Keep the pathway-neutral naming note.
- C4: at most 35 ids per brief, from the unread trailers plus `c4/luna_5b.md`'s 205 ids. Use the corrected volume addresses from the C4 fold. Same schema as `c4/luna_1.md`, one new private output per brief. GM33 artifact briefs stay separate from method briefs.
- C5: run the tally to find texture ids with no answer. Skip any shard whose lane `node scripts/codex_lane.mjs status` still shows as running. Write at most 500 rows per brief, input given as a pre-cut small TSV so no tool output truncates, one new private answer file each.
- Each brief warns against placeholders (rows only from text actually read; an `{"unread":[...]}` trailer) and tells the reader to batch `cite_paragraphs` calls with `--max` small enough that output is not truncated.
- Update each family's fold so it also reads the new `*b*` outputs. Write a fold-script change only in the owned folders listed below.
- Write `codex-r3/r3b/queue.txt`: one brief path per line, C4 first, then C1, then C5.
Owned paths: `codex-r3/c1b/`, `codex-r3/c4b/`, `codex-r3/c5b/`, `codex-r3/r3b/`, fold-script edits inside `codex-r3/c1/`, `c4/`, `c5/`, and the private input slices under each family's private folder.
Done check: every unread id appears in exactly one new brief (print counts per family); `queue.txt` lists every brief. No commits, and launch no readers.
