# L13 read-model bridges (2026-10-30)

Pure mappers in `src/read_models/` from engine read models to the view contracts the rep branches already define. Contracts read with `git show <branch>:<path>`; no rep branch or engine file was touched. Tests: `tests/read_models_ability_combat.test.js`, `tests/read_models_sheet_travel_body.test.js` (10 pass). Written directly by Sonnet (about 250 lines in all), no Codex lane.

## Switch-over table (what each rep adapter imports at merge)

| Rep branch, contract | Bridge | Replaces |
| --- | --- | --- |
| `rep-abilities` ladder view (`ability_ladder_figure.js` header) | `ability_ladder_bridge.js` `ladderViewFromRecord(adv, {position, facts, known, ceiling})` | the direct `pathView` call (the rep doc's `ladderViewFromRecord` mapper) |
| `rep-combat` `versus` model (`combat_situation.js`) | `combat_situation_bridge.js` `versusWithEngine(versus, ctx)` | threat word, down word, intent chip, `you.abilities` |
| `rep-maps` `legs` (`MAPS_AND_TRAVEL.md` switch-over) | `travel_legs_bridge.js` `legsFromRoute(s)` | the `Walk to {place} · ` label-prefix match |
| `rep-character-sheet` `subject` (`character_sheet.js`) | `character_sheet_bridge.js` `subjectFromDatedSheet(sheetAsOf(...), opts)`, `standingRows(...)` | `subjectFromDatedSheet` the rep doc names |
| `rep-body` `bodyViewModel` shape (`body_figure.js`) | `body_bridge.js` `bodyViewFromHarm(harmView(save), opts)` | the `live` read in `bodyViewModel` |
| `rep-time` return digest (`return_digest.js` `groupDigest` inputs `around`, `missed`) | `time_digest_bridge.js` `digestRowsFromEvents(book, person, span, ctx, textOf)` | the digest's news source for world events (L14) |

## Observer rules each bridge keeps

- Ladder: an unnamed next rung (`'???'`) passes no grants, crossings or failure, and `ready` is false (ABR19).
- Combat: intent shows only with an appraisal read; no read leaves `Intent unread`. A beaten opponent's word comes from a typed outcome only. Hooks and unstated lists never reach `you.abilities`.
- Maps: hazards are not passed (met, not known); places the seat has no label for are dropped (SR9).
- Sheet: the gated `hidden` count is dropped. Self reads `actual`. Anyone else reads the `shown` view as a whole for a field where anything is shown (so a displayed persona hides the legal name), `actual` only where nothing is shown, and `believed` only when `by` is that observer, marked `guess: true`.
- Body: harm is felt, not seen; another seat gets `null`.

## Gaps (view wants / engine has / who changes)

| Id | View wants | Engine has | Who |
| --- | --- | --- | --- |
| G1 | Witness ladder needs the rung index another person was seen at | L8 `power` entries are `{path, level, title}` with no stage id; a Sequence number counts down, so index is not derivable | L8 adds `stage` (stage id from the path) to `power.v`, or L10 exposes a level-to-stage map |
| G2 | Abilities held per rung (ladder home, sheet glance) | `abilityViews` filters by held source only; no rung-to-ability index | L10: carry `rung` on each card |
| G3 | Combat threat rung "hurt, downed, maimed, dead" | `harmView().rung` is always `null`; `harmRung` exists but nothing feeds it in-fight. Bridge takes `rungOf` as an argument (importing `harm_state.js` would register a domain) and reaches at most `dying` (AD19) | L9/combat: feed a current-hp fraction into `harmView`; rep passes `harmRung` in |
| G4 | Typed fight outcomes (unconscious, yielded, fled, dead; CBR2, CBR5) | none on master; `defeated` boolean only | L9. The bridge maps the four words and falls back to `Down` |
| G5 | Intent from an opponent's readied ability | no "readied ability" state anywhere; no appraisal read object | L10 (readied state) and the knowledge owner (read with a source). Bridge takes both as inputs |
| G6 | Maps `window` (next firm clock) | rep names the field but not its shape; legs hold `hours:[open,close]` | rep-maps: confirm `{hours, text, waitMinutes}` |
| G7 | "Farther" section (other cities) | `leg.to` is a place id only; no city or region on a leg, and `region_kit` places have no `district`/`team` | L11: add `region` to legs or a place-to-region lookup |
| G8 | Jurisdiction on the board | `jurisdiction_rules.rulingFor` is per act; no rep field consumes it | none yet (no bridge written) |
| G9 | Sheet `level` for a descending scale | Sequence 9 to 0, lower is stronger; the rep's rank ceiling compares numbers upward | world passes `powerStrength` dial (bridge supports it); without it level is words and `rank` is unset |
| G10 | Sheet rows tagged as guesses | `subject` rows have no `guess` field; the rep marks guesses only per read | rep-character-sheet: honour `row.guess` (bridge emits it) |
| G11 | `appearance`, `ties`, `history`, `intent`, `between` | L8 sheets have none; `links` are pointers owned by `sw-absorb` | sw-absorb joins them from cast records; bridge leaves them empty |
| G12 | Stats as exact numbers | L8 bands are 0 to 9 and coarse; rep bands numerics to 10/5/2/1 | rep: treat world bands as already banded (read precision 3 shows the band) |
| G13 | Body parts and cures | `harmView().parts` is `[]` in slice 1 and its entry shape is not fixed; no `healPart`, so no cures or time left. Bridge assumes `{id, rung, cause?, gates?[]}` and shows "eases with rest" | L9: fix the part entry shape when the first combat consumer lands |
| G14 | Gatherings on a board or web (L11 `gatherings.js`) | `seatsOn` returns `{seatId, label: seatId}` only: no persona name, standing or schedule text; no rep branch names a gathering contract | rep-organizations/relationship-web: name the contract; L11: seat labels. No bridge yet |
| G15 | Digest `Missed` row | rep reads `feed.heard`; L14 splits witnessed (`present`) from heard by `level`. Bridge maps present to Around, heard to Missed | rep-time: confirm that split |
| G16 | Wording for event rows | L14 holds `lineKey` only; text is pack data. Bridge takes a `textOf` callback and drops unworded events | sw-calendar/sw-absorb: supply the pack lookup at the host |

## Verification state

Focused tests pass (11). Not wired into any UI, not built, full suite not run (integrator's). The combat test inlines `rungOf`; it does not import `harm_state.js`, which sw-death had staged but uncommitted at write time.
