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
| G2 | Abilities held per rung (ladder home, sheet glance) | L10 `advanceLadders` now returns abilities per rung; bridge does not consume it until a rep view asks | rep-abilities: ask for per-rung abilities |
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
| G13 | Body parts and cures | CLOSED for parts (L9 5351071b2): `parts[{id,label,rung,rungLabel,modifiers[],recovers}]`, graded not gated; bridge shows the modifier axes as the felt line. Still open: cures (no cure verbs from L9; the rep's cure list comes from simulation commands) and `time left` (rest rate only, no duration) | L9/body owner: cure commands for `healPart` if the rep should list them |
| G14 | Gatherings on a board or web (L11 `gatherings.js`) | `seatsOn` returns `{seatId, label: seatId}` only: no persona name, standing or schedule text; no rep branch names a gathering contract | rep-organizations/relationship-web: name the contract; L11: seat labels. No bridge yet |
| G15 | Digest `Missed` row | rep reads `feed.heard`; L14 splits witnessed (`present`) from heard by `level`. Bridge maps present to Around, heard to Missed | rep-time: confirm that split |
| G16 | Wording for event rows | L14 holds `lineKey` only; text is pack data. Bridge takes a `textOf` callback and drops unworded events | sw-calendar/sw-absorb: supply the pack lookup at the host |
| G17 | A learnable-ability view (stage unlearned/practicing/castable, gates, mastery, next sign) | L10 `learnView(card,{facts})` is ready (de56fe717). rep-abilities defers skills and techniques to a later slice (O2 web), and rep-research mentions teachers but defines no contract | rep-abilities: name the learn view's contract; then a bridge drops `unstated` and shows `nextSignAt` only for signs already felt |
| G18 | "Who can I ask" / secret checks from L14 `whoKnows` and second-hand spread | engine ready (`9c7fb2ece`). No rep doc on any branch names a consumer (searched all 17 rep docs for whoKnows, who can I ask, gathering). The digest bridge already carries second-hand news as `heard` unchanged | rep-knowledge or rep-relationship-web: name the contract (ask list per person?). Bridge must drop `route` ids and show only people the seat knows |
| G20 | Advance notice for the upcoming strip | L14 `learnedDay` gives `present` from the window's first day and `heard` after it closes, so a future curfew is unknown until it starts; the strip would show only what is already in force | L14: an `announce` spread (notice posted N days ahead, learned by a channel). Until then the host passes `announced` (event ids the seat was told of) to `upcomingStrip` |
| G19 | Backlash walk (L9 `b41eec320`) | design counts only, no new read model | none |

Re-checked after L10 Sequence 5 and typed blockers, L11 multi-city and gatherings, L14 spread, L9 walk: all 11 bridge tests still pass; the ladder bridge takes the longer path unchanged and blockers surface through `refusedBy`.

## Contracts named by the UI coordinator (2026-10-30, after the first notices)

- G15 confirmed: `present` is Around (seen yourself), `heard` is Missed (second-hand); affected and aftermath also go under Missed with their level shown (RPT2). The UI integrator (`ui-integrator`) wires `time_digest_bridge.js` at merge. Affected/aftermath levels are not in L14's `level` yet (`present`/`heard` only): L14 gap if wanted.
- G14 gatherings and TC12 curfews: `upcoming_strip_bridge.js` `upcomingStrip(book, person, day, ctx, textOf, {placeLabel, gatherings, announced})` -> `[{id, kind, text, when, startsIn, place}]`, soonest first, max 3. Built (2026-10-30). Gatherings show label and schedule only, never seats.
- G17 `learnView`: `learn_tab_bridge.js` `skillsTabRows(views, {labelOf, known, understood})` -> rows `{id, label, stage, stageWord, canLearn, gates, refusedBy, progress, practiceMinutes, sign}`. Built. Cards not in `known` get no row; `nextSignAt` only for `understood`.
- G18 `whoKnows`: `knows_ask_bridge.js` `askListFromWhoKnows(known, {self, knownPeople, nameOf, topicOf})` -> `[{personId, name, topic, action:{kind:'ask', to, about}}]`. Built. No route, day or witness level leaves.

## COV15 gated figures (2026-10-30, requested by General UI)

| Figure | Bridge | Signature | Live feed (host supplies) |
|---|---|---|---|
| Ritual | `rite_state_bridge.js` | `benchWithRite(base, graded, {label, known})` -> bench detail with `rite` for `riteCircleSpec`/`riskLedger` | `gradeRitual()` result; `known` = condition ids the seat has learned. Any unknown condition returns `rite: null` |
| Combat chase | `chase_range_bridge.js` | `withPursuitRange(chaseSpec, {routes, here, pursuerSeenAt, labelOf})` | pursuit policy routes; `pursuerSeenAt` only when the seat has seen or sensed the pursuer, else the track says unknown |
| Research | `study_bridge.js` | `studyProjectFromLearn(learnView, {label, opensLabel, known})` -> project for `researchLadderSpec`/`researchMapSpec`/`projectLines` | L10 `learnView`; learning an ability is the study in progress |
| Spacetime | `place_history_bridge.js` | `placeHistorySpec(book, person, place, day, ctx, {eras, textOf, placeLabel})` -> spec with one track per era | L14 event book; eras named by the world calendar |

Not done: gallery fixtures that match each bridge (the COV15 done check asks for one per read model), and any route for a fresh life to show Research or Rituals; both are view-wiring. The study bridge covers learning an ability only; a non-ability study project (a lesson, a book) still comes from `researchView` rows. `left` for a practising step is the per-session `practiceMinutes`, an upper bound.

## Verification state

Focused tests pass (20: `tests/read_models_*.test.js`). Not wired into any UI, not built, full suite not run (integrator's). The combat test inlines `rungOf`; it does not import `harm_state.js`, which sw-death had staged but uncommitted at write time.
