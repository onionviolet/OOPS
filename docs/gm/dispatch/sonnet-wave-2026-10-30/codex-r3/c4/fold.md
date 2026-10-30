# C4 fold and receipt, 2026-10-30

C4 preparation is complete. The coordinator launches [luna_1.md](luna_1.md) through [luna_6.md](luna_6.md); this lane launched no readers. Each reader owns one private output. No runtime or host changes, source acquisition, commits or pushes. Rules applied: AD36/AD38, WPR4–WPR8, WPR18–WPR23; source-to-engine seam is the existing L4 act compiler, not a new mechanic. This is metadata preparation, not a source-reading or gameplay-completion claim.

## Inputs and coverage

Private root: `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/`.

`manifest.json` records hashes of the merged registry/extras and all prior nonplaceholder Luna outputs, input hashes, batch paths and counts. `methods_all_in.jsonl` and `gm33_all_in.jsonl` are the complete assignment inventories; the `*_NN_in.jsonl` files partition each inventory. Each ID has exactly one input/brief assignment within its family. An ID can occur in multiple source volumes, so per-volume unique counts do not sum to the global distinct count. The shared known-method list is reference material, not another assignment.

| Volume | Procedure IDs | Procedure occurrences | GM33 candidate IDs | GM33 evidence occurrences |
| --- | ---: | ---: | ---: | ---: |
| 1 | 0 | 0 | 13 | 25 |
| 2 leftovers | 113 | 115 | 47 | 105 |
| 3 | 0 | 0 | 25 | 87 |
| 4 | 318 | 345 | 33 | 85 |
| 5 | 363 | 397 | 53 | 145 |
| 6 | 219 | 247 | 34 | 117 |
| 7 | 111 | 114 | 36 | 86 |
| 8 | 47 | 47 | 15 | 34 |
| Global distinct / occurrences | 1,078 | 1,265 | 187 | 684 |

| Brief | Family | Assigned IDs | Metadata occurrences | Private output basename |
| --- | --- | ---: | ---: | --- |
| [luna_1](luna_1.md) | procedures | 215 | 292 | `luna_methods_01.jsonl` |
| [luna_2](luna_2.md) | procedures | 216 | 262 | `luna_methods_02.jsonl` |
| [luna_3](luna_3.md) | procedures | 215 | 242 | `luna_methods_03.jsonl` |
| [luna_4](luna_4.md) | procedures | 216 | 250 | `luna_methods_04.jsonl` |
| [luna_5](luna_5.md) | procedures | 216 | 219 | `luna_methods_05.jsonl` |
| [luna_6](luna_6.md) | GM33 candidates | 187 | 684 | `luna_gm33_01.jsonl` |

### Reconstruction and exclusions

The old `v3c*_in.jsonl` files contain 274 occurrences, 246 distinct IDs. All 274 match merged `extras.jsonl` rows with `extra:rules`, the five requested kinds, and volume-3 shard/locator metadata. The old inputs omit some matching potion occurrences. C4 preserves the index fields (`id`, `kind`, `locator`, `shard`), includes all five requested kinds, and groups occurrences by ID to avoid competing readers. Volume detection prefers the shard's book prefix, then the locator; old band-shard `bNs` prefixes also identify volume. This includes later-volume rows from those bands, not just the `lotmNc` shards.

Volume 2 subtracts IDs represented by substantive rows in any prior nonplaceholder L4 Luna output; `no_content` counts as an already-read ID. Unread trailers do not count. The explicitly named `luna_v2a_placeholder.jsonl` is excluded, so its unsupported rows do not mask unfinished work. The private `already_authored.jsonl` preserves 395 method-bearing groups, 436 distinct IDs, labels and exact prior file/line provenance. Every new brief lists all those groups by ID; labels stay private. Previous extraction is not promoted to source-verified or runtime-authored status. No volume-3 remainder was added because the brief assigns volume 2 leftovers and volumes 4–8.

GM33 has no typed artifact kind in merged `rules`. The separate candidate inventory selects item registry rows with explicit artifact/sealed-object/mystical-item terms, plus item references from `rules`/`rules_other` rows mentioning artifact or handling hazards. The exact selector is in [prepare.py](prepare.py). Each candidate preserves selection basis and all matched evidence pointers. This is a bounded metadata census, not a complete semantic census of every dangerous item. Readers must reject incidental matches with supported gaps and preserve uncertain aliases separately. Generic collection IDs remain candidates, not invented individual artifacts. All candidates are conservatively handled as sealed in tracked surfaces; this flag does not classify their canon nature. Detailed artifact labels, holders and effects stay private.

### Source gaps and reader budget

`anchor_check.json` privately records exact missing IDs/locators. Across 1,949 metadata occurrences, 1,946 anchors parse; 1,777 resolve, 169 are missing and three do not parse, for 172 gaps. Some locators omit a book prefix: 317 use an inferred shard-derived book, explicitly marked in helper output. These address checks prove no source interpretation. Readers use [cite_input.mjs](cite_input.mjs) to avoid the standard citation command's earliest-mention/max-eight bias, then record missing or unchecked anchors without guessing. The helper prints private source text; do not capture it in tracked logs.

Each fresh reader observes the existing 12,000-word / six-response budget. A 150–300-ID metadata assignment may exceed that source budget, particularly GM33. A supported partial return plus exact unread trailer is valid; it is not full extraction. The coordinator launches a fresh remainder reader if needed, preserving the original single-writer output ownership until explicitly handed off. C4 does not precreate reader outputs or placeholders.

## Fold procedure

1. **F1, coverage.** From the checkout root run `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/prepare.py --outputs`. It checks input hashes, each family's exact single-reader partition, brief known-method lists and the union of extracted/unread IDs per output. No output is currently present; this gate is pending. Keep unread IDs and missing anchors in a private remainder ledger. Do not treat structural coverage as source verification.
2. **F2, source review.** Before folding, source-spot-check 15 rows per returned procedure family (divination, summons, ritual_other, potion_rule, aid_preparation, craft, occasion_of_known_method, no_content), plus 15 GM33 rows. Where a family has fewer than 15, check all. Select deterministic evenly spaced rows after sorting by earliest volume, anchor and ID, covering different batches and later volumes; add any materially risky/contradictory row. Open the actual anchor and context. Check evidence labels, costs, materials, outcomes, handling conditions and dated custody, including a changed variant and an explicit failure where present. For no_content confirm that the text lacks a relevant procedure. For known-method occasions confirm the referenced earlier method. Save exact sampled IDs, locators, verdicts and corrections privately in `review.jsonl`; tracked reporting uses counts and sealed IDs. Return unsupported rows to their reader owner before folding.
3. **F3, merge.** After review, concatenate accepted procedure rows into private `methods_reviewed.jsonl` and accepted artifact rows into `gm33_reviewed.jsonl`. Keep their source IDs/locators and variant boundaries, preserve contradictory readings and uncertain IDs, and retain `no_content`, known-method occasions, rejected candidates and unread IDs as coverage evidence rather than gameplay data. Artifacts use their artifact schema; do not feed them into a rite compiler or invent crafting acts for possession.
4. **F4, normalize and compile.** The coordinator assigns source normalization/bindings to the L4 owner in a later authorized runtime slice. Existing `defineLotmActs` consumes runtime rows, not Luna extraction JSONL. Normalize supported nonoccasion procedures into the owning rite/craft/aid shapes: stable `id`, `sourceIds`, volume, supported English labels, locators, performers, `steps:[{id,kind,text,minutes:null}]` (or the existing craft `method`), named `inputs`/`ingredients`, source outcomes and evidence, authored eligibility and `effects:[{type:'owner-needed',owner,value}]`. Keep unknown quantities/durations unresolved. Each authored binding supplies place, positive per-step minutes, input stock keys/quantities or explicit null apparatus, output and owner effects/risk. Export private `ROWS` and `BINDINGS` modules while reviewing proposals. No automatic extraction-to-gameplay conversion exists. Divination question rows follow `defineDivinations`/the existing divination adapter, and potion rules without acts wait for their actual consumer. GM33 routes to the existing artifact owners, with IDs connected to item custody and handling consumers. Host registration belongs to floor-wire.
5. **F5, proof.** Compile normalized act rows with the exact command below and run the focused act engine test. Check new divination/rite/craft/aid owners with their matching existing tests after their source changes. A successful compile with unbound rows is a report of missing bindings, not playable coverage. The integrating runtime lane owns build, fresh-origin desktop journey and persistence proof when relevant, with the coordinating committer's full suite. This prep adds no runtime gate or direction.

Existing compile command, run during C4 prep:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/compile.mjs
```

Future reviewed normalized act compile (modules must export `ROWS` and `BINDINGS`):

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/compile.mjs --rows docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/normalized_acts.mjs --bindings docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l4/v4plus/authored_bindings.mjs --require-bound
node --test tests/lotm_act_engine.test.js
```

The normalized files above are future outputs, not files C4 claims to have produced. The compiler wrapper imports the existing `src/lotm_act_engine.js`; `--require-bound` fails if any row lacks its binding. It does not exercise host gameplay.

## Checks and handoff state

Observed checkout HEAD for the check receipt: `76e0817b9f05764a398aaf31f61a75d02638be4c`. Shared HEAD can advance; metadata/input hashes in the private manifest identify this prep independently. Only C4-owned paths were written.

| Command | Result | Gaps |
| --- | --- | --- |
| `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/prepare.py --build` | PASS: generated six briefs and exact partitions; known-method lists checked | Rebuild explicitly regenerates inputs/briefs; do not run while readers own outputs or after source drift without reconciling |
| `python3 docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/prepare.py` | PASS: hashes, single assignment, counts and known-method list membership | Metadata proof; reader output gate pending |
| `node --check docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/cite_input.mjs` | PASS | Syntax, not source interpretation |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/check_anchors.mjs` | 1,777 anchors found; 172 explicit missing/unparseable gaps | Gap details private; no source read claimed |
| `node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c4/compile.mjs` | PASS: existing 77 rows, five bound, 14 commands, 72 unbound | Baseline compiler exercise; no new rows extracted or compiled |
| `node --test tests/lotm_act_engine.test.js` | PASS: 4/4 | Existing act mechanism only; no new gameplay proof |
| Inline Python `ast.parse`, owned-file whitespace and Markdown-link checks; `git diff --check -- <C4 owned folder>` | PASS | Scoped artifact checks; no reader outputs |
| `git check-ignore <private-root>/manifest.json` | PASS: private manifest is ignored | Private files remain local |

Highest state: prepared, metadata-checked. Pending work belongs to the coordinator: launch six readers, resolve their explicit unread/source gaps, source-review 15 rows per returned family, then fold and assign runtime normalization. No commit made.
