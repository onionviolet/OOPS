# Idea intake: sw-rites

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## 2026-10-30 (slices 1-4, volume 1; sibling-book shape check)

Shape check against the sibling book's existing rule rows (14 sampled by structure only; 54 rite/potion/craft rows exist, no names or facts used). Fields present in more than half of sibling rite rows: conditions, steps, results by outcome (`success`/`failure`/`partial`), who performs, limits; also common: inputs and products, `ritual.scale` (personal, single-room altar, one petitioner, village-wide, large sacrifice, one memory per performance). Rare: consequences with an agent (`by`), costs, place, acquire, reset, minutes. Rite kinds include incense use, device use, dance, directed spirit task, command in an ancient language, prayer, healing act. [folded: GM42]

| Class | Entry |
| --- | --- |
| ACT NOW | Slice 1-4 rows already carry conditions, steps, locators and S/T/I evidence; sibling shape needs nothing removed. [folded: done in slice] |
| ACCOUNT FOR NOW | `outcomes` branches (success/failure/partial) are the common shape, not the exception. The divination adapter holds one signal per attempt; my summons rows hold one `limits` list. Apply the branch shape in the next summons or ability slice rather than widening `queries`. [folded: GM42] |
| ACCOUNT FOR NOW | `scale` (who or what the rite spans) is a first-class field in sibling rows and already exists in `ritual_conditions.js` (`scale`). Reuse it for summons rows when they get a ritual block. [folded: GM42] |
| LATER (level: schema; effort: S; done: summons rows gain `outcomes[{when,stated}]` and `performers`, test asserts both, existing ids unchanged) | Add `outcomes` and `performers` to `lotm_summons_rows.js` at the next summons slice (volume 2). [folded: GM42] |
| LATER (level: mechanism; effort: M; done: a consequence-by-agent field routed to the harm/backlash owner `sw-death`, not built here) | `consequences[{trigger, response, by}]` where `by` is the agent (the rite itself, a summoned messenger, a principle). Hand to `sw-death`. [folded: GM46] |
| LATER (level: data; effort: S; done: coverage ledger counts the L4 row files as a consumer or the wiring commit lands) | The ledger corpus does not list `src/lotm_*_rows.js`; counts only move when added or wired. Ask the ledger owner. [folded: done: coverage_ledger defaults now include src/lotm_*_rows.js] |
| LATER (level: process; effort: S) | Luna sampling lanes pulled later-volume locators (`zh bN ...` prefix) into volume 1 queries once; the review caught it. Add a locator-prefix check (`/^zh 第/`) to every row test (done in slices 2-4 tests). [folded: WA53] |

## 2026-10-30 (slice 5, volume 2)

| Class | Entry |
| --- | --- |
| ACT NOW | `lotm_rite_rows.js` carries the sibling-shape fields: `outcomes` branches, `performers`, `scale`, `consequences`, volume tag. Locator form for volume 2+ is `zh bN 第N章 pM`; tests accept the optional prefix. |
| ACCOUNT FOR NOW | Luna lanes drift to placeholders when handed more than ~30 unique ids (208-row lane returned 166 empty rows and admitted it). Cap chunks at about 28 ids and require an `unread` line. |
| ACCOUNT FOR NOW | Of 184 craft/potion volume 2 rows, 103 are later-ladder potion rules (ADV/MAK territory, GM25) and 40 crafts are unusable as cited; sw-adv owns the ladder rows. |
| LATER (level: data; effort: M; done: the 29 unread rite citations and 8 unread volume 2 craft/potion groups extracted in 15-id chunks, rows added to `lotm_rite_rows.js`) | Finish volume 2 rite extraction. |
| LATER (level: data; effort: S; done: v2 mirror-questioning and remains-search moved under `lotm_divination_rows.js` queries if a performed answer is confirmed) | Two v2 rows are question-and-signal in kind but sit in the rite file for now. |

## 2026-10-30 (improvement pass over slices 1-4, round 2)

| Class | Entry |
| --- | --- |
| ACT NOW | Tests pinned incidental shapes: exact row counts (9 queries, 29 commands, 12 occasions, 4 unknown, 6 added methods, 2 summons, 6 aids, 5 rules, 6 oil inputs) and `volume === 2` on every rite row, which would have broken the next volume. Replaced by published-id checks and invariants (command count equals step count; volume is an integer from 2). |
| ACT NOW | Cross-file test `tests/lotm_row_files.test.js`: ids unique across the five row files, fact names stay in their own `actor.lotm.<ns>.` namespace, every locator is the source-index form with an optional `bN` prefix. |
| ACT NOW | Divination gaps for the copper-whistle ids now name `coveredBy: 'lotm.summon.copper-whistle-messenger'` so they no longer read as missing. |
| ACCOUNT FOR NOW | Checked for absolutes: no never/always/only in mechanism text; the "cannot" uses restate a source limit tied to a stated condition. Authored numbers (minutes, spirituality threshold) are labelled proposals. |
| ACCOUNT FOR NOW | Fields nobody reads yet: all five files are unwired, so `proposals`, `evidence` and `effects` are read only by tests. Wiring (`sw-wire`) decides which are consumed; unused ones go in the next pass after wiring, not before. |
| LATER (level: data; effort: S; done: wiring shows `craft.ritual-essence-oil` and `aid.ritual-oil-bath` overlap or not, then merge or cross-reference) | The craft row for ritual essence oil and the aid row for the ritual bath oil may describe one product from two sides. |

## 2026-10-30 (slice 6, volume 3)

| Class | Entry |
| --- | --- |
| ACT NOW | Volume 3 rite rows add families `contract`, `contact`, `offering`, `blessing`, `entry`, `concealment`; craft rows add a `kind` field (making, cooking, communication, disguise, concealment, training, item_use). `-v3` id suffix marks the merged volume 3 group of a method that also exists in volume 1 or 2. |
| ACCOUNT FOR NOW | The same methods recur across volumes (messenger summoning, self-summon to the grey fog, sacrifice door, crystal ball contact). Rows carry per-volume ids; a wiring layer should group them by method (a `method` key) rather than the ids. |
| ACCOUNT FOR NOW | Codex Sol can fail with "model at capacity" and leave an empty report; check `run.log` and relaunch rather than trusting an empty exit. |
| LATER (level: schema; effort: S; done: rows gain `method` key shared across volumes; test asserts every `-v3` row names its earlier-volume sibling) | Add a shared `method` key so volume 1-3 siblings group. |
| LATER (level: data; effort: M; done: volumes 4-8 extracted in 28-id chunks and the usable rows appended to the rite and craft files) | Walk volumes 4-8 with `mkchunks.py`/`runchunks.sh` style chunking (scratchpad scripts; move to scripts/lead_run if reused). |
