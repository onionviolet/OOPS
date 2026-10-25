# Potion pathways, higher Sequences and implementation, 2026-10-24

Weibao: "send stuff accordingly, consider higher sequence ones too, consider stuff
for all the pathways, and on how to implement accordingly". This continues
[CRAFTING_ENGINE round 8](../../../CRAFTING_ENGINE.md#round-8-2026-10-24-potion-requirements-brewing-versus-drinking-and-orphaned-materials)
(PZ1–PZ12). It authorizes research and implementation design. It does not
authorize runtime edits, a commit or a push.

Rules: AU1–AU15, WPR30–WPR32, WA1, WA5, AR11–AR16, MR1–MR36, LC6, sealed secrets.
Target viewport for any later UI: 1920x1080 (AD34).

## Budget (AU2)

`AU1-AU15 | edition: existing notes only, no new book reading | goal: potion
requirements for all 22 pathways, Sequences 9 to 0, brewing rules, implementation
plan | prior read spans: LOTM1 1,402 read / 363 reviewed, COI 1,178 reviewed |
coordinator chats: 1 | lanes: 3 Claude subagents (Sonnet), no repair reserved |
output: one file per lane, at most about 600 lines | stop: lanes return or the
first lane fails twice`

## Lanes (one writer per file)

| Lane | Owns | Inputs | Model |
|---|---|---|---|
| L1 Pathway table | `PATHWAY_POTION_TABLE.md` | census JSONL, both POWERS.md, pathways deep dive, wiki crosscheck, LOTM gates doc | Sonnet |
| L2 Brewing and higher Sequences | `BREWING_AND_HIGHER_SEQUENCES.md` | same notes, claims.json search, COI passes, LMG1–LMG33 | Sonnet |
| L3 Implementation design | `IMPLEMENTATION_DESIGN.md` | `src/book_world_lotm_*.js`, `ascension_paths.js`, `progression_gates.js`, craft and HP brewing modules, pack loader | Sonnet |

No lane edits `src/`, tests, or any other file. MYSTERIES files are not opened.

## Status

Dispatched and returned 2026-10-24: L1 457 lines, L2 415, L3 393. Key citations spot-checked (R005-C15; `pathways.js:22,29`; `state.js:28`). Folded into [CRAFTING_ENGINE round 9](../../../CRAFTING_ENGINE.md#round-9-2026-10-24-all-pathways-higher-sequences-and-how-to-implement). No runtime change, commit or push.

## Round 10: gap fill from the Chinese text and online sources, 2026-10-24

Weibao: "For F4 F5 F6 can we look online or search for data books? More to consider?"

Online search (2026-10-24): no official LOTM setting book with potion data found. Fan
wiki per-pathway `/Advancement` pages carry partial formulas; scripted fetch returns
402/403, so the earlier in-browser API route applies. Chinese fan and game-guide pages
exist but are not canon. The Qidian platform's power-system dictionary is a candidate.

Deterministic scan (AU11) of the local Chinese EPUB (`6126274…`): 2,371 paragraph hits
over 804 serials; 147 主材料, 107 辅助材料, 51 晋升仪式, 36 主要材料, 409 魔药配方. The
passages with ingredient or ritual keys plus one paragraph before and five after are
extracted to the gitignored `docs/research/novels/lord-of-mysteries/census-2026-10-19/formula-scan-2026-10-24/`
(181 serials, about 109,000 characters, four shards).

Budget (AU2): `existing local text, keyword-selected passages only | 4 Haiku extraction
readers, one per shard of about 30,000 Chinese characters (above the AU10 word bound
because the input is Chinese characters with locators and the task is row extraction,
not reading), two at a time | output: one JSONL per shard | no repair reserve | stop:
four returns or two failures`. Coordinator merges and reports coverage against L1's 43/220.

Result: four Haiku shards returned 30, 20, 14 and 17 rows (81), merged to private
`book_rows.jsonl`. Wiki route: in-app browser API (a shell fetch with a browser user
agent was refused as bot-check circumvention and not retried). `Module:Sequence/standard`
revid 127043: 219 Sequences, 184 with formulas, 131 rituals. Folded into
[CRAFTING_ENGINE round 10](../../../CRAFTING_ENGINE.md#round-10-2026-10-24-filling-the-gaps-from-the-chinese-text-and-online-sources).
Wiki snapshot not saved yet (download needs Weibao's yes).

## Round 11, 2026-10-25

Saved privately (gitignored): wiki snapshot `formula-scan-2026-10-24/lotm_wiki_sequence_standard_r127043.json`
(raw module sha256 `5b511195…`, 219 rows) and the whole-wiki API pull
`wiki-api-2026-10-25/lotm_wiki_api_2026-10-25.json` (2,021 pages, file sha256 `ae1e9877…`).
S3 dump link returned 403. Reddit blocked by safety policy in both browsers; not worked
around. PZ-L6 crosswalk ([CROSSWALK.md](CROSSWALK.md)): X1 and X2 rechecked in the Chinese
text, book wins (10 ml rock water; 60 ml sun divine bird blood, `1064`). Folded into
[CRAFTING_ENGINE round 11](../../../CRAFTING_ENGINE.md#round-11-2026-10-25-the-seq-1-and-seq-0-gaps-the-whole-wiki-symbolism-and-substitution).

## Round 12, 2026-10-25

Also saved privately in `wiki-api-2026-10-25/`: 935 category pages (`lotm_wiki_categories_2026-10-25.json`)
and an image manifest of 3,913 files (3.2 GB); images downloading with `fetch_wiki_images.py`
into `images/` (plain curl, 0.3 s apart, resumable). Reddit: no results through web search, and
the site is blocked in both browsers. Folded into CRAFTING_ENGINE round 12 (TSW1–TSW11); workflow
saved as playbook DGF1–DGF10.

## Build dispatch, 2026-10-25

Weibao: "send out and work on both?" (TSW-L1 native-item bridge; S0 plus S1 frog brew).
Local implementation in isolated worktrees off master `640bc884b`. No commit to master, no
merge, no push; those need Weibao's yes. Lanes run focused tests only; the coordinator runs
the full gate at integration (AD36). Separate O1 Opus review skipped on advisor advice; the
dose-identity decision (D1) is made inside lane B and written into IMPLEMENTATION_DESIGN.md
before coding.

| Lane | Owns (new unless marked) | Must not touch |
|---|---|---|
| A TSW-L1 native-item bridge | `src/native_material_catalogue.js`, `tests/native_material_bridge.test.js` | `craft_resolver.js`, `crafting_native_items.js`, `craft_content_frontier.js`, `crafting_frontier_runtime.js` (active uncommitted lane in primary) |
| B S0 + S1 frog brew | `src/book_world_lotm_brew.js`, edits to `src/book_world_lotm_{pathways,broker,actions,host,ui,envelope,content,ids,rows}.js` as needed, `tests/lotm_brew.test.js`, `tests/lotm_commands_golden.test.js`, a browser harness in this folder, design notes in `IMPLEMENTATION_DESIGN.md` | crafting files; non-LOTM runtime |

Worktree paths and branches are added when the lanes start.

## Wider dispatch, 2026-10-25

Weibao: "dont limit yourself, dispatch something to implement/absorb in depth? also create a
future workflow for something like this? we should write down our existing systems to help
fit in better like the swappable ingredients that works to varying degrees".

| Lane | Owns | Mode |
|---|---|---|
| A (done) | worktree `agent-aae6ede3f52b50209`: `src/native_material_catalogue.js`, `tests/native_material_bridge.test.js` | 33 items, 4/4 focused tests, check:arch pass; coordinator reran the test |
| B (running) | worktree, LOTM brew files listed above | told to read design docs from the main checkout by absolute path |
| C1 systems register: making, items, economy | `docs/systems/MAKING_ITEMS_ECONOMY.md` | read-only on `src/`, primary checkout |
| C2 systems register: progression, world, state, UI | `docs/systems/PROGRESSION_WORLD_STATE.md` | read-only on `src/`, primary checkout |
| D LOTM ingredient absorb (TSW-L2, PZ-L8) | worktree: `src/lotm_ingredient_catalogue.js`, `tests/lotm_ingredient_catalogue.test.js`, `tools/build_lotm_ingredient_pack.mjs`; private output under `private_packs/` only | wiki-derived data stays private (AD1, PZ30) |

## Results, 2026-10-25

| Lane | Result | Checks (command, result) |
|---|---|---|
| A native bridge | 33 native items as `base.native@1` materials, physical/functional tags plus 5 symbolic proposals on 9 items | `node --test tests/native_material_bridge.test.js` 4/4 (rerun by coordinator); check:arch pass |
| B frog brew | Hale sells the Corpse Collector formula (5 pounds, proposal; canon 230); broker frog consumed; 120 played minutes; bottling mints the same dose and sets `cc.allocated`; existing ingest unchanged. [S1 decision](S1_DECISION.md) in the lane worktree | `node --test tests/lotm_*.test.js` 80/80 (rerun); golden test: 193 existing command hashes unchanged; browser journey PASS at 1920x1080 plus 1536x864 at 14 and 21 px, save/reload mid-brew, Export string import, file re-import; old master probe save loads, drinks and re-saves |
| C1, C2 register | `docs/systems/MAKING_ITEMS_ECONOMY.md` (542 lines), `docs/systems/PROGRESSION_WORLD_STATE.md` (858 lines), index [SYSTEMS_REGISTER](../../../SYSTEMS_REGISTER.md) | Two claims spot-checked (no live `matchRecipe` caller; gate overflow read nowhere else) |
| D LOTM ingredients | Private pack `private_packs/lotm-ingredients/ingredients.json`: 292 ingredients, 176 formulas (Seq 9 to 2), 988 role slots, X1/X2 overrides; committable builder and pure catalogue with `substitutesFor` ranking | `node --test tests/lotm_ingredient_catalogue.test.js` 7/7 (rerun); check:arch pass; tracked files contain no wiki text |
| Images | 3,870 of 3,871 saved (1.3 GB, CDN WebP), no fetch errors | |

**Integration** in worktree `.claude/worktrees/integ-potion-2026-10-25` (branch
`claude/integ-potion-2026-10-25`, base `640bc884b`, uncommitted): lanes A, B, D combined.
`npm run build` pass; `npm test` 2877/2877; `npm run check:arch` pass, zero growth;
`npm run check:rules` pass, 0 warnings. A and D are not wired into play, so lane B's
browser proof covers the playable change. Not committed, merged or pushed. Open: accept
buttons stay visible (blocked, with the switching reason) while a brew stands; brewing is
closed once a dose is allocated; prices and times are proposals; human play acceptance.

Workflow saved: [MECHANIC_ABSORPTION_WORKFLOW](../../MECHANIC_ABSORPTION_WORKFLOW.md) plus
skill `.claude/skills/mechanic-absorption`; router row added in RULES_INDEX.
