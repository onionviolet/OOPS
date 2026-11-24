# WA9 handoff: gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus

Proposal, not an accepted decision (AD32). Agent-verified, not human-reviewed. Atlas platform pilot B3, 2026-11-24. Nothing here is applied to `docs/coverage/gu_kinds.jsonl`.

## Row and why

- Composite id `gu_kinds:fandom:Heavenly_Essence_Treasure_Monarch_Lotus`; line 1144 of `gu_kinds.jsonl`, state `blocked:effect-unknown`.
- Source hash of the current line: sha256 `e383ed61d5c59ed5b878caf75aff8c59ec26b4b18da5f408b1a1e5e6116d8140` (same in HEAD `3c31774e2` and the working tree at write time; the file hash `513089d7...` is not stable, lane A has uncommitted edits to other lines).
- Why: the chapters state both facts the row lacked. Rank four at `ri:ch308:p82`, `ri:ch558:p9`, `ri:ch2235:p2` (matches wiki-tier rank 4). Effect at `ri:ch463:p2`: the Lotus series "could produce primeval essence". The Gu grammar already has `add essence, self, instant`, which lowers to `energy:primeval`, so no new rule is needed.
- Rejected: `candidate:wolf-swallow-gu` (coordinator's suggestion). Lane A confirmed rank and storage effect, but the row stays `blocked:spatial-storage` because no storage rule exists. A pilot there ends at a missing rule, not at "runs". `blood-asset` was also rejected: its rank sources disagree (catalogue 7, wiki tier 6, chapter tier "differ") and its effect needs suppression and recovery rules.
- Wiki-tier label guessed `heal`; that is wrong (essence, not vitality). The test has a near miss for it.

## Proposed line (also in `fandom_Heavenly_Essence_Treasure_Monarch_Lotus.jsonl`)

Changes: `source` gains `ch308; ch463; ch558; ch2235`; `state` `runs-authored`; `mechanisms` `["G","P","W"]`; `test` `tests/gu_lotus_essence_case.test.js`; `note` rewritten; `case` added.

```json
{"id":"fandom:Heavenly_Essence_Treasure_Monarch_Lotus","source":"https://reverend-insanity.fandom.com/wiki/Heavenly_Essence_Treasure_Monarch_Lotus?oldid=54179; ch308; ch463; ch558; ch2235","state":"runs-authored","mechanisms":["G","P","W"],"test":"tests/gu_lotus_essence_case.test.js","note":"Produces primeval essence for its user (ri:ch463:p2); rank four (ri:ch308:p82, ri:ch558:p9, ri:ch2235:p2, wiki-tier rank 4). Resolved effect scene: add essence to the user's own pool; the amount and the pool stage are authored calibration. The wiki-tier heal guess is not used. Former state: blocked:effect-unknown. Wiki identity checked against chapter text for this effect only.","case":{"module":"src/world_packs/gu_lotus_essence_case.js","id":"fandom:Heavenly_Essence_Treasure_Monarch_Lotus"}}
```

Validation: `parseLedger` on a scratch copy of the ledger with this line swapped in returns no problems. `runCase` returns `runs-authored` for it, so the state matches the computed one.

## Owner and adoption

- Applies it: lane A until it lands, then the coverage owner.
- The ledger is generated. `scripts/gu_coverage_ledgers.mjs` attaches cases only to chapter-layer rows through `guCaseNote` and `GU_CASE_MODULE`; a wiki-layer row like this one goes to `blocked:effect-unknown`. A hand-applied line is overwritten on the next regeneration. The coverage owner needs a generator change: a case table for wiki-layer rows keyed by id (module `src/world_packs/gu_lotus_essence_case.js`), or promote the row to the chapter layer with a catalogue entry.
- Conflict with lane A: its working-tree `wiki_tier_labels.json` now has `effectFamilyGap {owner W/L, rule "Produce a material or food as an output..."}` for this id. The chapter text and the case show the effect fits an existing sentence (`add essence`), so that gap should be dropped or reworded for this row. Stale-base risk: this proposal was made against that file before lane A lands.
- Runtime edit to review: one added act in `src/world_packs/effects_workshop.js` plus an import, and `tests/effects_workshop.test.js` (act count 13 to 14, one expected line). Not covered by any lane list; only I touched them.

## Scenario

A Gu master with 10 in `energy:primeval.rank4.initial` uses the Lotus; the pool rises by 40 (authored amount; the chapters give no number). Pool stage is also authored: the case uses rank 4 initial, the workshop uses the adept's own pool (`aperturePool(rank, stage)`), not a bare `energy:primeval`.

## Evidence per rung (each separate)

1. Case success: PROVEN. `runCase(row, {reachable: new Set()})` returns `{state:'expressed-authored', basis:'authored', confidence:null}`. Test: `node --test tests/gu_lotus_essence_case.test.js` (4 of 4 plus the workshop restore test pass; includes a heal near miss and a missing-key refusal `blocked:runner-needs`).
2. Module reachability: PROVEN. `node scripts/reachable.mjs --is src/world_packs/gu_lotus_essence_case.js` exits 0; `runCase(row)` returns `runs-authored`. Reached through the new Lotus act in `effects_workshop.js`, a real consumer, not a bare re-export.
3. Player action: PROVEN headless, for the workshop capability run only. `tests/gu_lotus_essence_play.test.js` boots the whole game, clicks "Capability runs", the workshop tab, Begin, then the Lotus act; the line "Monarch Lotus ... rose by 40 of 40 motes" appears. Not proven: any browser (fresh-origin) receipt; any ordinary-play path (the workshop is a demo run, `effect_landing_count.mjs` denies it by design, so it adds nothing to ordinary-play landings); a way to obtain a Lotus in the game.
4. Persistence: PROVEN headless for the workshop run. Same test: game save, `reload()`, then export, storage clear and import; the line, the "Adept sea 40 motes" fact and the spent button survive each. Not proven: browser; migration of older saves.

## What remains

- Generator change so the line survives regeneration (above).
- Lane A reconciling its `effectFamilyGap` for this id.
- Decide whether the amount (40) and pool stage need a canon-backed source; a Lotus in ordinary play (item, source, use action) is unbuilt.
- Browser receipt if the pilot should claim more than the headless runner.
- Other `effect-unknown` rows: lane A found 112 of 113 wiki effects match no family. This row shows chapter text can still give a sentence; the others need a check.

## WA11: what the atlas row detail should show

What I actually had to look up, per rung:
- Header: composite key, current line hash and the ledger's file hash, and whether the working tree differs from HEAD (lane A's edits moved the file under me).
- Blocker rung: the blocker slug and what the fold thinks the gap is. For this row I needed the wiki-tier label (`functionGuess: heal`, `effectAt`), the new `effectFamilyGap`, and `check_passage` fact counts. Show the top fact paragraph locators (`ri:ch463:p2`) and tag (rank, effect) beside each, without the text. The codex `ladder` was all null for this row and told me nothing about why.
- Rung 1: case module and id, `runCase` state, basis, the `expect` terms, and the near-miss results. "Proposed, not in the ledger" must be visible.
- Rung 2: reachable yes/no, and the importing file that reaches it (here `effects_workshop.js`), so a bare re-export looks different from a consumer.
- Rung 3: the capability or action name, the receipt test path, and the scope word ("workshop demo run, not ordinary play"). Default text: "not proven".
- Rung 4: separate chips for engine restore, game save/reload, export/import, browser. Each "not proven" until a receipt exists.
- Footer: proposals pending for this row (handoff path, owner, conflicting lane edits such as `effectFamilyGap`).
