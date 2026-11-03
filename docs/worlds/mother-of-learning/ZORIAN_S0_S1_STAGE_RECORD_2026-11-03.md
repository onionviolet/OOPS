# Zorian S0 and S1: stage record (proposal, 2026-11-03)

Proposal under AD32; nothing accepted, nothing built. Shape follows [HP_LEAD_RUN_START](../../gm/dispatch/refinement-audits-2026-10-31/HP_LEAD_RUN_START_2026-11-03.md).
Rules applied: [plan](ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md) (lessons table, WER ST13-ST17), [P1/P2/P2b](ZORIAN_P1_P2_PAPER_TEST_2026-11-03.md),
[seam note](RETENTION_RESET_SEAM_2026-11-03.md), LSD216 (planning stays short). Evidence words: *read* (file opened), *counted* (script over files).
Nothing was run in the game. Sealed lead-run scenes are named by count only (AGENTS sealed-secret rule); no plot is restated.

**Which done this gives (ST17):** neither yet. S0/S1 "lead replay done" means c1-c13 events in order inside their windows (LSD156); "world ready for an
ordinary life" means a non-lead start can use the same systems. Each gap below says which it blocks.

## What is already on disk

| Item | State | Evidence |
|---|---|---|
| Lead scenes for c1-c13 | 105 scenes in the merged reading: S0 (c1-c4) 24 scenes (5, 7, 8, 4); S1 (c5-c13) 81 scenes (13, 15, 6, 4, 9, 9, 7, 7, 11). 19 of the S1 scenes are sealed; none of S0. Every scene carries steps, options, outcomes, anchors, knowledge and a `dateRef` | counted, `private/wb8-merged-2026-10-30/scenes.jsonl` |
| Day numbering | 37 of the 81 S1 scenes have date label `I` (inferred) and 44 `U` (unknown); all 24 S0 scenes are `U`. The first scene's own note says the restart count is not shown and day numbering is assumed | counted; scene 1 `date.note` |
| Rules and families | 106 shards, 7,282 census rows, families assigned; S0/S1 draw on census rows 1, 2, 6, 7, 12, 15, 21 | [census](COVERAGE_CENSUS_2026-11-03.md) |
| Calendar | `book.mol.cyoria` has a `fixed_months` profile (12 months of 30 days, labelled "Cyoria visitor", no seasons). A one-month loop fits the month length; the profile is the visitor's and carries no restart-day or event list | read, `src/world_calendar_content.js` |
| Event feed | Scheduled leads are keyed to game minutes (`opensAt`, `due`), not to a day of a month | read, `src/event_feed.js` |
| Knowledge | `people_knowledge.js` reads per-actor knowledge records; no day stamp or decay field was found | read (grep only) |
| Runtime seat | Visitor only: 82 commands, 387 `player` references, 81 gated on three visitor-derived facts | [P2b](ZORIAN_P1_P2_PAPER_TEST_2026-11-03.md#p2b-what-actor-binding-costs-read-by-script-over-the-pack-object-2026-11-03-not-run-in-the-game) |

## Seam probe: does the Klein pipeline run on MoL?

| Piece | Status on this branch | Consequence |
|---|---|---|
| `build_crosswalk.mjs` | Supports `--world mol` (reads the MoL ids and pack people) | Usable for S0/S1 scenes; its place logic and people table are the visitor's, so Zorian's home and school need rows |
| `gen-runner.mjs`, `native-continuation.mjs` | Hard-code `private_packs/lotm-cast/cast.json`, the `book.lotm.` prefix, panel `lotm` and `data-lotm-*` selectors | **Not portable here.** The HP record lists these as parametrised by G1; that change is not on this branch (unverified whether it landed elsewhere). Verify after the next merge before writing a runner |
| `constraint_store`, `canon_pull` | Portable per the HP probe (not re-opened here) | The canon pull needs MoL anchors; see G6 |
| Cast pack | LOTM uses one gitignored cast pack. MoL's pack is a committed world pack (`book_mol_pack.js`, 13,149 lines) | Zorian's start adds rows to the shared pack with one writer (T8); a private cast pack is a separate decision (G9) |
| Lead be-seat profile | Missing; `book.mol.cyoria` has a visitor seat only | Per HP and the Klein B1 lesson, a new profile, not an extension of the visitor row |
| Currency ledger | Missing for the lead. Crowns exist as the visitor's purse | A purse table for Zorian's household, school and travel money (AD48 `$`) |

## Gaps and abstractions

Disposition: ACT NOW (S0 needs it), ACCOUNT FOR NOW (constraint, no build), LATER. Tag: on-path (ST13) is build-now ground; off-path is recorded.

| Code | Gap | Disposition | Tag and blocks | Owner and done check |
|---|---|---|---|---|
| G1 | **Zorian start and seat.** A start on `book.mol.cyoria` with its own `actorId`; resolve `player` to the seat at load; supply `mol.nativeBound`, `mol.playerSupported`, `mol.local.book.mol.cyoria` from the start; guest permit becomes student status | ACT NOW | on-path; blocks both dones | M1 implementer session. Done: the first Zorian command (a morning command at the family house) previews and commits as the seat, and the visitor's `chart` path still passes its focused test | **Status 2026-11-03: focused-tested, built; not native-run, not persisted** (below the AD43 floor). `book_world_mol_starts.js` names the start (`book.mol.zorian@1`), the seat (bound to the native `player` actor; `resolveSeatActor` is the one place another id would enter, shown by a pure test), the two fact suppliers (WA51) and the student-status term (answers `actor.book.mol.guestPermit` without storing a permit). Begin command `book.mol.begin_zorian`; first command `book.mol.zorian.morning_home` previews and commits as the seat (`tests/mol_zorian_start.test.js`). Partial: `study_invocation` and `control_drill` not yet run as the seat; home is the household placeholder until G4; the begin command is not wired into a menu or a native browser run; per-start loop key (G2) is another session's hook. 
| G2 | **Per-start loop key** (for example `book.mol.cyoria#zorian`), so the visitor row stays "no loop" and the seat has the month loop. Today `loopRule` looks up by world id | ACT NOW (S1); design in S0 | on-path; blocks lead replay | Seam note AB11 plus a regression on the LOTM death row. Done: two starts in one world read different rows | **Evidence row reached (2026-11-03): built as `worldId#startId` keys in `src/harm_loops.js`; `tests/harm_loops_v2.test.js` shows the visitor start on the default and the Zorian start on the month loop; below floor (no seat reads it yet).** |
| G3 | **First-use boot test.** Boot the pack against the current registry with the start concept and a `triggers` row before more content builds (KJ3P lesson) | ACT NOW | on-path | Focused test on first use of the start key | **Status: focused-tested** (the same test file boots the pack against the registry with the Zorian start, checks the native envelope and runs the visitor `chart` path unchanged).
| G4 | **Home, school and household rows for c1-c4.** The visitor pack has the academy, a guest room and a library; Zorian's family house, sister, school day and classes are not rows | ACT NOW (S0 content) | on-path; ST16: the family and classmates he meets are central here, tiers raised from the same records | Content lane after G1; each place and person reference the shared rows by id |
| G5 | **Reserve as the just-stated measure** (8 then 10 casts; ZS1-ZS2) bound to the seat; shaping practice (ZS3) and one watch-and-learn spell (ZS4) | ACT NOW (S0) | on-path | Binds existing consumers (`study_invocation`, `control_drill`). Done: a cast count shows on the seat and falls with use; status stays "partial" until the focused test passes as the seat (seat reachability) |
| G6 | **Calendar for one month.** Restart-day lights, the dated dance, the month's end; event feed keyed to a day of month. Reuse `clockClaims` and anchors, no new clock | ACT NOW (S1) | on-path; blocks lead replay | M3. Done: the strip shows an event on its day and not before (GM18); the brief states each day and hour with locators, and 37 inferred and 44 unknown dates are resolved from stated source times, not guessed |
| G7 | **Reset row v2: triggers (date, death), carry, witnesses.** The restart itself | ACT NOW (S1) | on-path; blocks lead replay | M2 per P1. Resolves R1 (earliest event in the clock wins, a tie is a date end) and R2 (see below). Done: the P1 Perfect Run and LOTM rows still validate unchanged **Evidence row reached: row v2 fields, R1 `endingEvent` and the Zorian row built; Perfect Run and LOTM rows validate and plan unchanged (focused tests); R2 left open, `soul-bound` named as the proposed default; below floor.** |
| G8 | **Carried-knowledge items with a day stamp** and a prediction the lead can check (foreknowledge widens the menu, no stat gain) | ACT NOW (S1) | on-path | M4. Done: after a restart a known fact shows with its day, and a changed day marks it stale |
| G9 | **Cast pack decision:** extend the committed MoL pack (one writer) or a private lead pack. Pack growth and boot time were an open measure in LOTM (4.2 MB, boot 18-21 s) | ACCOUNT FOR NOW | on-path | One measurement line in the first receipt; chunking only past a stated trigger |
| G10 | **Pipeline portability.** `gen-runner` and `native-continuation` hard-code LOTM; HP's G1 may cover this | ACCOUNT FOR NOW | on-path; blocks proof | Re-check after the next merge; if absent, a world parameter in those scripts with the LOTM output byte-identical |
| G11 | **Canon pull anchors.** A skipped replayed stretch must still land him where the next beat expects (LOTM canon-pull lesson) | ACCOUNT FOR NOW | on-path | Brief per row lists the next beat's place, time and presence; replayed months run at L0/L1 with exact quantities kept |
| G12 | **Locked options** ("Not how it happened") in the 105 scenes | ACCOUNT FOR NOW | on-path, feeds the open-run backlog (ST15) | Per arc: resolves-by-mechanism, needs-build or out-of-world. Not counted here: all 105 scenes have an `options` field, but how many are non-empty was not taken |
| G13 | **Off-canon input check** before S1 counts as ready for other lives: one beat with a different purse, timing or choice | LATER (end of S1) | on-path (ST14) | One focused run; result read by mechanism |
| G14 | **Teacher windows and ally trust** (Ilsa, Taiven, Xvim, Kael, Zach) beyond their S0/S1 appearances | LATER | off-path until S2 | Recorded; built when S2 starts |
| G15 | **The Zorian NPC for the visitor start** stays a resident with `zorian_talk`; in his own start that row is suppressed | ACCOUNT FOR NOW | on-path | Part of G1's gate; visitor focused test unchanged | **Status: focused-tested.** The book Zorian is not met in the Zorian start (`mol.support` false, `zorian_talk` hidden); his resident record stays attached but inert because the native envelope requires every definition person. Visitor start unchanged.
| G16 | **Full-text coverage for c56-c82 and c90-c106** is keyword windows only | LATER (S7-S9) | off-path | Full-text reader pass before those stages; statuses stay "not read" |

## Decisions that stay with Weibao (reversible until a slice ships)

- **D1 / R2:** soul-bound skill versus an aptitude multiplier on restart. Proposed default for the first slice: soul-bound reserve and skill with a stated carrier
  (the self), the multiplier left as a dial for other worlds (WER9: what carries is stated per crossing). Shown in the reset row so either works.
- **D2:** which "done" a stage report leads with. Proposed: report lead replay first and the world-ready line second, each named (ST17).

## Order

1. G3 and G10 checks (no code), then G1 and G2 together as one M1/M2 packet after the Klein lane releases `harm_loops.js` and its validator.
2. S0: G4, G5 content on the seat. First command, then a day of school.
3. S1: G6, G7, G8, then the first restart replaying two beats at their pulls, proved from the S0 checkpoint (chain lineage).
4. G13 and the six-line floor before any "ready" claim; the batch gate replays S0 then S1 in order on one bundle.

## More to consider

- ACT NOW (done): this record; R1 default written; G10 found to be a branch fact, not a world fact.
- ACCOUNT FOR NOW: the 37 inferred and 44 unknown dates decide whether G6 can be built from the text or needs a reader pass on stated times; check `check_reader_rows.mjs` on any reader output.
- LATER / DELEGATE: haiku shard to list, per S1 scene, the verbs the seat performs (actor per verb), sonnet to merge; done when each scene names its owner command or a gap.
