# C5 fold and review

Status: prep verified, classification pending coordinator launch. This packet fulfils the C5 prep gate; it does not establish semantic classification or gameplay coverage. No agents were launched by this lane. The coordinator owns launch, repair, review and integration.

## Source and scope

The frozen input is `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/m4-whole-book-2026-10-29/merged/extras.jsonl`. Its SHA-256, every TSV hash, counts and output owners are in [manifest.json](manifest.json). Reuse the L7 taxonomy at [WB_TAXONOMY.md](../../WB_TAXONOMY.md). Applied rules: WPR1-WPR8, WPR23, WPR26-WPR29, AU5-AU6, AU10-AU15. No accepted direction or runtime code changes.

The source contains 28,987 `texture_other` and 22,207 `rules_other` rows. All 51,194 are in exactly one of 19 briefs. News, customs, people and typed rule rows are excluded. A remaining summary can legitimately receive CAL; this does not reopen L14 news work. `rules_other` is included because LEDGER L7 explicitly names it as unclassified.

| Volume | Texture | Rules other | Briefs |
|---|---:|---:|---:|
| 1 | 0 in supplied merge | 0 in supplied merge | 0 |
| 2 | 6,674 | 5,406 | 4 |
| 3 | 6,341 | 4,827 | 4 |
| 4 | 5,058 | 4,268 | 3 |
| 5 | 4,928 | 3,350 | 3 |
| 6 | 2,978 | 2,055 | 2 |
| 7 | 2,163 | 1,701 | 2 |
| 8 | 845 | 600 | 1 |

**Source gap:** the supplied whole-book merge contains no volume-one rows of these two types. The base `lead-run-2026-10-27/merged/extras.jsonl` is empty. Older `merged-cast-2026-10-28` and original shard extras contain volume-one rows, but are different snapshots. This packet does not silently combine them or claim volume-one absence in the book. To extend coverage, the merge owner must identify the canonical volume-one shard selection and edition; then prepare a separate, disjoint supplement before calling this all-volume coverage. Do not regenerate these inputs while readers own outputs.

The original rows have no ids. Synthetic ids are `c5.v<volume>.<SHA256-of-exact-source-line>.<duplicate-occurrence>`. Identical duplicate rows retain distinct occurrence ids. The private `source_rows.jsonl` binds each id to its original source line, label, locator, about ids and complete row. These ids are row addresses, not source-world entity ids or paragraph-tool ids. `family_pass` receives an adapter copy with `extra: rules` solely to reuse its existing prep; original extra kinds remain in the kind column. Every count is a row count, unlike L7's unique-rule-id counts. Do not add these counts to L7 as unique mechanisms or deduplicated entities.

## Launch budget

Launch `luna_1.md` through `luna_19.md` from this folder with gpt-6-luna medium, fresh contexts, at most two concurrent. Each owns exactly one named private answer file. Use the first as the pilot and inspect its receipt before continuing. Up to 19 initial invocations plus at most three repair invocations, six responses per invocation. Repairs cover only explicit unread ids or rejected rows; beyond that finite reserve checkpoint the remainder. No paid fallback or stronger bulk route. Respect the wave's Codex 85% launch stop. This lane made zero model invocations; current shared-account allowance is unmeasured here.

C5's specific 2,500-3,500-row direction supersedes the common 150-300-row fallback. Existing prep balances each volume with max 3,500 rows, giving 1,445-3,109 rows per brief; short final volumes remain intact. This is a pass over previously extracted summaries, not raw paragraphs. Summary payloads contain 12,828-28,046 whitespace words per brief. Project only n + summary into reader context, preflight the payload including host instructions, and stop/return unread before context limits. Do not mistake this sizing for a measured token guarantee. Paragraph fallback is capped at ten ambiguous ids per job, eight paragraphs per id and 12,000 raw source words. No new paragraph reading was performed during prep.

## Commands and gates

Run from the repository root:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs --dry-run
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/fold.mjs
```

The first command verifies source/TSV hashes, row identity, preserved summaries, source-kind/volume counts, sequential n values, per-id single assignment and brief ownership. It runs the unmodified `family_pass.mjs tally` against a private dry-run directory with no answers. Expected: tally exits 0 with 19 `no answer yet` messages, empty totals and `semanticClassificationVerified: false`. This proves prep and tally compatibility, not classification.

The second command requires every answer file. It rejects duplicate or foreign n values, unknown family codes, malformed lines, unjustified NEW, extra unread ids, labelled-unread overlap and silently missing rows. Readers can append one JSON metadata line for unread ids and NEW reasons. The fold strips this trailer before existing tally, preserving each reader-owned answer file. An explicit unread remainder is tallied but exits 1 and blocks integration pending repair. An output with no metadata must classify every row. Do not replace unread rows with OTH without actually reading them.

Outputs are under the private `wb-families-texture/folded/`: normalized answers, ids, `tally.json`, `tally.log`, `receipt.json` and `review_sample.jsonl`. The sample selects up to 15 deterministic hash-ordered rows per family across the whole pass (all rows if fewer than 15). Before integration the coordinator checks all 15 against their own summaries, opens paragraphs for ambiguous claims within the repair budget, checks NEW reasons and looks for the known ADV/MAK/ACT drift. Save review findings privately by id and family, including errors and unresolved ids. Reject the affected labels and repair them; rerun fold after reader ownership is explicitly handed back. The sample being generated is not review completion.

Regeneration command, only before reader launch:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c5/prepare.mjs
```

It refuses to regenerate if top-level reader answers exist. It calls the existing `family_pass.mjs prep --merged <private adapter> --out <private home> --by lotm --max 3500`; no shared script is modified. Private artifacts stay local and gitignored. Coordinate source changes before regeneration and reassign old inputs explicitly rather than mixing hashes.
