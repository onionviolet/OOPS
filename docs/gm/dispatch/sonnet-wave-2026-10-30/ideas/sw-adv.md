# Idea intake: sw-adv

Append-only. Format and rules: [QUEUE](../QUEUE.md#idea-intake).

## Slices 1-4 (ability records, Seq 7 rung, costBasis, learnables), 2026-10-30

**ACT NOW (done)**
- Unstated costs, limits, teachers and practice are listed per record (`unstated`), never filled silently.
- Cost ordering is cited (`costBasis.rank`) and tested, so authored amounts cannot flip the source's ordering. [folded: done in slice]
- Backlash stays a hook (`failure.hook`); learnables reuse the engine power and practice model. [folded: done in slice]
 [folded: done in slice]
**ACCOUNT FOR NOW**
- Ability cast conditions read facts such as `actor.lotm.fire_at_hand`; every world host must supply them or the row quotes ineligible (safe, but silent). Integrator wiring note sent. [folded: WA51]
- A prerequisite spell is a power-owned fact, which is unknown until first touched; gates use positive tests (a negation of an unknown fact fails closed). [folded: WA51]

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| Counter-conditions: an ability cancelled by a named state (heavy rain, a blocked mind, a stated aura) as a typed `blockedBy` list, separate from conditions, shown in the view as "blocked by X" | mechanism | small | An ability with a blocker refuses while it holds and the view names it [folded: GM41] |
| Scale by rung: same ability stronger later (a second record at the higher rung, or WA33 band) | mechanism | medium | One ability has two rung records and the sheet shows the stronger one [folded: GM41] |
| Ability used by a non-player (hostile or ally) from the same record, with their own held source | seam | small | A hostile quote uses the same card and cost [folded: GM41] |
| Shared practice: learning faster with a teacher present or a rod (HP wand, MoL spell rod) as a mastery multiplier fact | mechanism | small | Practice with a focus adds more mastery than without [folded: GM41] |
| Reflexive casting stage (MoL: casting until it needs no chant, gesture or formula) as a third learn stage after castable | mechanism | small | A `reflexive` sign removes the formula condition [folded: GM41] |
| Failure chance dial per world, drawn through the seeded streams, never a hidden roll | dial | medium | Same seed gives same outcome; dial zero is the current behaviour [folded: GM41] |
| Ability discovery by watching someone cast (copy after one cast, MoL c8) as a learn route without a teacher | mechanism | medium | Observing a cast makes the learn gate pass with a stated reason [folded: GM41] |

## Slice 5: Sequence 6 rung and typed blockers (volumes 2-4), 2026-10-30

**ACT NOW (done):** `blockedBy` on ability records (a named state that cancels the cast, shown as "blocked by X", seeded false so the negated test does not fail closed); `advanceLadders` walks every rung in the pack and appends stages; Seq 6 (digest by disguises that pass close kin, ingest, one face-copy ability with two blockers) in the private pack, each blocker cited. [folded: done in slice]

**ACCOUNT FOR NOW:** the face-copy ability is surface only (height within 10 cm, no memories gained, clothing not changed): those are limits the engine cannot simulate here, so they are carried as `notes` and must come from the identity owner (`sw-road` GM24 personas) when a disguise grants a persona. [folded: GM41, GM24]

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| Disguise digestion by acts "held undetected long enough": a crossing fact fed by the persona owner (days a persona went unchallenged) | seam | small | The digest crossing reads the persona owner's counter [folded: QR6d] |
| Revert in a second or two as a free cost-0 record paired with face-copy | data | tiny | A `revert` record clears the condition [folded: GM41] |
| Observer kinds as a typed list (Spectator-type, a half-god, close kin) so one blocker row covers a class | mechanism | small | One blocker row refuses for any observer of a kind [folded: GM41] |
| Walk the next rung (Seq 5) and Seq 6 abilities from volumes 5-8 once the lead nears Seq 6 | data | medium | Seq 5 stage and abilities in the pack with cited blockers [folded: QR6d] |

## Improvement pass on slices 1-5, 2026-10-30

Read `ability_records.js` and `lotm_advancement.js` whole; checked consumers (`read_models/ability_ladder_bridge.js`, `combat_situation_bridge.js`, `sheet_joins.mjs`) and the 23 tests that touch them.
- **Fixed:** ability keys repeated across rungs would collide on ids; `advanceLadders` now throws. Private-pack test pinned exact counts (2 crossings, 3 abilities, 2 blockers); now checks properties. Unstated lists now name the paper-substitute charge count and the flame-jump duration (supply and duration stated as limited or short, no number).
- **Checked, no change:** unread pack fields (`notes`, per-condition `locator`) are citations for audit and tests, deliberately not in player-facing cards (spoilers). Other lanes: `sw-chars` joins by ability record id only; `sw-death` has not consumed the `lotm.backlash` hook yet, so nothing duplicates it.
- **Authored costs:** all remaining amounts (spirituality 1-4, cooldown 10, charges 3, durations) have no stated number in the rows; only orderings are cited, so they stay proposals and are listed under `unstated`. A number would need a stated amount or a balance decision.

## Slice 6: Sequence 5 rung (volumes 3-6), 2026-10-30

**ACT NOW (done):** Seq 5 in the private pack: a contribution quota (institution gate, count a proposal) and the dose crossing citing the formula row; three ability records with stated ranges as conditions (about 5 m to bind, about 120 m to operate, about 150 m to swap) and cited blockers (stunned, a parasitic state on the puppet). **Order held:** the ladder test checks stage order, not a fixed list.

**ACCOUNT FOR NOW:** ranges are conditions on facts the host must supply (`actor.lotm.target_within_5m` and kin), because the engine has no distance model; swap's two-to-three-second gap and bind's twenty-second threshold are below the minute clock and sit in `unstated`.

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| A distance fact family from the scene or map owner (`within <n> m` of a named actor), so range conditions read geometry, not a flag | seam | medium | Range facts come from a position owner and the bind refuses at 6 m |
| Sub-minute timing: a seconds-grain gap and threshold for fights (swap gap, 20 s bind), owned by combat | mechanism | medium | A bind takes about 20 s in a combat scene |
| Seq 4 onward (volumes 5-8): defer until the lead nears Seq 5; walk by the same extraction | data | medium per rung | Next rung stage and abilities with cited blockers |

## Typed abilities per volume, 2026-10-30 overnight

**ACT NOW (done):** 2,368 ability ids over volumes 2-8 typed into conditions, blockers, stated numbers and stated costs with locators (private); the pipeline, brief and fan-out driver are reusable for any book's ability rows.

**ACCOUNT FOR NOW:** most rows state no cost amount (about 130 stated costs over about 2,400 ids) and no effect, so promoted records carry a marker effect and list both as unstated; slugs are specific per row, so the host must supply facts per slug (many facts) or a clustering step must merge them first.

**LATER**
| Idea | Level | Effort | Done check |
| --- | --- | --- | --- |
| Slug clustering: one Luna pass merges near-equal slugs across a volume to a shared vocabulary (`item_held`, `target_within_reach`) so hosts supply fewer facts | data | small, 7 lanes | Distinct slugs fall below about 400 with no condition changed in meaning on a 30-row sample |
| Bulk-promote typed rows to records per pathway once a pathway's source and effects are authored (the effect is the missing piece) | data | medium per pathway | A pathway's abilities quote eligible or refused from facts |
| Same pipeline over Shadow Slave, Harry Potter and Mother of Learning ability and spell rows (GM26, GM40 across worlds) | data | medium | Typed rows for 3 books with the same counts table |
| More Mother of Learning and Harry Potter learnable spells from cited rows (round 2, item 2), starting with spells that state a teacher or practice time | data | small | 3 more spells per book compile with a cited teacher gate |

## Slice 7: ladders held as data (no hardcoded path, Weibao 2026-10-30)
ACT NOW (done): `src/ladder_holdings.js` is the world-neutral model. A ladder row (`pathFromLadderRow`) replaces a hand-written descriptor; the lead's ladder is chosen by `startHoldings(def, id)` with the book's pathway only as `defaultLadder`; a character holds several ladders (`held[]`, `active`). Transition rows `swap`, `branch`, `demote`, `wrong` carry requires, costs, an opaque failure hook and `onFail` (`stay`, `demote:N`, `lose`); `intake` returns the failure for a skipped or unheld rung. Tests use invented sample ladders only. Authored amounts go in `unstated` (WPR5). Pure: nothing saved, nothing wired.
ACCOUNT FOR NOW (floor-wire, single writer of the LOTM host): in `src/book_world_lotm_path.js` the hand-written `seerPathway` and the "Not offered" seq7 stub become a ladder row run through `pathFromLadderRow`, and `lotmPathView` reads the active ladder from `startHoldings`/`heldView`; the advancement pack's knowledge gate (`known`) stays as it is. Persisting `held[]` needs a namespaced slice with a migration (AR). I did not touch the file.
LATER: lower a transition row to a native command (costs paid, flag effects, failure via the hook) like ability_records does; Seer and Corpse Collector neighbouring-path swap rows from cited book rows (private pack); a demotion cause list (what in the world pushes a rung down); view side (path picker, grouping by system and source) is rep-abilities'.

## Slice 8: ascension as a graph (Weibao 2026-10-30, "maybe tree for all of them?")
ACT NOW (done): `src/ascension_graph.js` adds `defineGraph` (nodes, edges, entries) and `graphView(graph, at[], facts, {known})`. Edge kinds: advance (several leaving one node is a branch), mix (carries odds, signs, outcome, aftermath; never a ban), demote (costs). A lock is a dial (narrow, tight, sealed) with a reason and an optional fact that opens it. `at: []` is the valid "no path" state; several nodes is "mixed". `ladderToGraph(path)` embeds any ladder; the test checks it agrees with `pathView` on ready, crossings and failure, and the existing ascension, advancement, figure and holdings tests pass unchanged. `ascension_paths.js` only exports `validateCrossing` and `crossingMet` (renamed from the private `met`); `definePath` and `pathView` are untouched. The bk-ss rank path is a plain ladder (`ascension_paths_ss.js`), so it embeds as is; not run against that branch.
ACCOUNT FOR NOW: `ladder_holdings.js` swap/branch/wrong rows and graph mix edges overlap; floor-wire should pick the graph as the one authority (holdings `held[]` becomes `at[]`) when wiring. Mix aftermath is text only; a lasting effect needs a condition owner. Odds are words (authored proposals).
LATER: lower graph edges to native commands; tree/web/wheel node layout for the view (rep-abilities); a node's own ability-record set.
