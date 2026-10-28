# L6B checkpoint: MoL cast records, 2026-10-28

Status: **source-bound data authored and structurally verified; implemented, below
floor for gameplay**. Agent-verified, not human-reviewed. No host, pack-definition,
start, save, registration, commit or push change. The coordinator's clarification
supersedes the earlier probe stop, preserved as history below.

Authority: [L6B brief](L6B_MOL_CAST_RECORDS_BRIEF.md),
[L3 brief](L3_CAST_RECORDS_BRIEF.md), [L3 checkpoint](L3_CHECKPOINT.md),
[L6A checkpoint](L6A_CHECKPOINT.md), [plan](../CAST_LIVES_PLAN_2026-10-28.md)
sections 3.2 and 12-16, and the coordinator's direct 2026-10-28 instruction:
"Day-mark coverage is not a stop criterion. The stop counts are lead scenes
(25, met) and worksheets (93, met)." The clarification also authorizes a
replaceable `days` list with inferred source-order bindings and irregular rows
where the walk cannot settle a date.

Applied: WA5, WA22-WA24, WA35, proposed WA43, PL-A46, CL2/CL24/CL25/CL86/CL110,
AR1-AR16, AD36, AD41. The seam is the pure schedule/beat pair in
`src/cast_schedule.js` and `src/beat_records.js`, beside the existing MoL pack.
See [architecture rules](../../../../ARCHITECTURE_RULES.md) and
[runtime guidance](../../../../../.claude/rules/runtime-code.md).

Writer reservation and release: only `src/book_world_mol_cast.js`,
`tests/book_world_mol_cast.test.js` and this checkpoint were written. Source and
test were absent at entry. Unrelated dirty/concurrent work was preserved. All
three paths are released to the coordinator; no `.git` writes were attempted.

## F1. Coverage and import contract

Exports: `MOL_CAST`, `validateMolCast()`, `molAnchorProbes()`. Data is frozen and
imports no private source. Five L1 runtime matches retain their IDs: Zorian,
Ilsa, Xvim, Taiven and Nora. All other crosswalk IDs strip `new:` and retain
`indexId`; no existing pack definition or `MOL_BASELINE` scope changed.

The rank uses the original worksheet present-plus-partial counts, keeping the
household. Daimen's reported foreign address puts him among recurring references
without a local body; Mother takes the household principal slot. Two explicit
place roles are schedule-only. Four other person IDs remain M1 references;
`mister-noveda` is linked to Zach by `sameActorAs`, not a second scheduled body.
This identity comes from chapter 2 p172-173, not later-loop knowledge.

| Surface | Count |
| --- | ---: |
| Principals | 8 |
| Recurring | 12 |
| Place roles | 2 |
| M1 person references | 4 |
| Place records | 23 |
| Checked place aliases | 6 |
| Schedule rows | 60 |
| Principal beats | 44 |
| Dated knowledge rows | 15 |
| Relations with basis and first verified checkpoint | 19 |
| Wants | 11 |
| Same-loop forward anchors | 0 |
| Other-loop/unqualified person anchor rows excluded | 1,426 |
| Reset-kind rule rows in input range | 0 |

One place is a remote address; one is an itinerary address for the train journey,
not a point travel destination. The arrival itinerary is narrowed to its
source-verified bridge encounter. The aliases resolve vague source names to the
reviewed addresses; consumers should resolve them before importing preparation IDs.
Empty recurring lists mean no verified claim was selected, not that the person
lacks relationships or knowledge. No attitude resolver, spell acquisition,
purse, inventory or body mutation is claimed by event-marker effects.

| Principal index ID | Beats |
| --- | ---: |
| `mol.person.zorian-kazinski` | 20 |
| `mol.person.ilsa-zileti` | 5 |
| `mol.person.akoja` | 5 |
| `mol.person.zach` | 4 |
| `mol.person.kirielle` | 2 |
| `mol.person.benisek` | 4 |
| `mol.person.fortov` | 2 |
| `mol.person.mother` | 2 |

| Collection | S | T | I | U | fill |
| --- | ---: | ---: | ---: | ---: | ---: |
| people | 22 | 0 | 0 | 0 | 0 |
| references | 0 | 4 | 0 | 0 | 0 |
| places | 23 | 0 | 0 | 0 | 0 |
| placeAliases | 6 | 0 | 0 | 0 | 0 |
| days | 4 | 0 | 11 | 10 | 0 |
| schedule | 0 | 0 | 0 | 0 | 60 |
| beats | 44 | 0 | 0 | 0 | 0 |
| clockClaims | 6 | 2 | 0 | 0 | 0 |
| remoteWhereabouts | 0 | 1 | 0 | 0 | 0 |
| anchors | 0 | 0 | 0 | 0 | 0 |
| resets | 0 | 0 | 0 | 0 | 0 |
| relations | 9 | 10 | 0 | 0 | 0 |
| knows | 0 | 15 | 0 | 0 | 0 |
| wants | 0 | 11 | 0 | 0 | 0 |

The table describes content evidence. Schedule hours are fills; scene dates and
knowledge `since` windows retain separate precision. The labels on excluded day
metadata do not make those scenes executable.

## D1. Replaceable day walk and unresolved timing

The `days` list covers all 25 input scenes. Twenty are initial-loop, pre-festival
scenes. Fifteen bind: five marked day-1 scenes retain `U`, followed by ten
`I` rows with `basis: 'source order'`. Five remain unplaced. Four festival scenes
and the restart scene are excluded metadata, with no schedule, beat or knowledge
import. The sixth numeric mark (`L1-D1`, label I) is retained on that excluded
restart row rather than treated as another initial day.

| Scenes (suffix of `lr.mol.main.`) | Binding | Evidence/default |
| --- | --- | --- |
| 00101-00105 | Day 1, U | Input marks `L?-D1` retained |
| 00201-00202 | Day 2, I | c1 p171 wakes next morning; c2 p10 says arrival was yesterday |
| 00203-00204 | Day 4, I | c2 p101 advances two days to Monday |
| 00205-00206 | Day 5, I | c2 p164 says the following day |
| 00207 | Day 8, I | c2 p178 names Friday |
| 00301-00303 | Day 22, I | c3 p1 says two weeks after the first school week; Friday is the source-order default |
| 00304-00308 | Unplaced, U | The classroom and subsequent days do not have a consistent settled calendar |
| 00401-00404 | Excluded | Festival night deferred by D4 |
| 00501 | Excluded | Restart boundary |

The chapter-3 classroom sequence at p57-93 includes the five-day dance-teaching
claim (p67) and a recollection of four weeks of mentoring (p86), following the
exam's two-week advance (p1). Its following evening lesson then precedes a daytime
office visit, and p183 names Friday evening. The worksheets flatten several of
these into the same day. Rather than turn that into a source date, this lane
leaves the five affected scenes irregular. Their `[22,36]` envelope is an
explicitly replaceable eligibility default, not an assertion that they occur by
day 36. A downstream binding must narrow dates and change the envelope if needed.

Last bound day: 22. Unresolved eligibility envelope: through day 36.
No locked thirty-day loop is inferred. `timeModel` remains
U/Ordinary. `resets` is empty because no schema 1.4 reset-kind rule exists in the
declared input range; no later reset rule was borrowed.

All source locations keep locators. Hour partitions are labelled fills with a
basis rather than promoted to source clock times. Source-confirmed co-presence
is partitioned into non-overlapping travel, class or work intervals for the
lead. Unknown dates keep `recurrence: 'irregular'`. The private-meeting row does
not place Mother or Kirielle in the kitchen after they leave; the family stays
at the station rather than riding along in the lead's train record. The salve
workshop uses 21:00-24:00 as a fill, not the shared seam's 00:00-06:00 night band.

Bound beats use their day and an own-word event marker. Unplaced beats need
`mol.cast.window.<scene>` facts; without a binding, the test confirms that no
outcome fact appears. A host must supply that fact on a narrowed date, not merely
enable every unresolved scene at the start of the eligibility envelope.

Knowledge dates mean first verified source checkpoint. They do not claim the
person lacked that knowledge earlier. The current module supplies data, not a
public knowledge projection.

## F2. PL-A46 rejected worksheet claims and scope exclusions

These references identify input fields; worksheet collections often have no
individual row IDs. Rejected fields were not repaired from reader memory.
Independently checked claims use their own correct locators.

| Input field/row | Disposition |
| --- | --- |
| `kirielle/scenes/00102` kitchen co-presence | c1 p74 sends her and Mother to the market before the private discussion; no body or beat there |
| `kirielle/scenes/00201` cafeteria co-presence | Scene presence names the lead and Benisek; no physical placement imported for Kirielle |
| `main.00306/steps` Xvim practice at Ilsa's office | c3 p86 recalls earlier mentor sessions; it does not place Xvim in that office |
| `main.00304/date` and subsequent same-day propagation | c3 p67/p86 and the later daytime/Friday cues do not settle that binding; five scenes remain irregular |
| `kirielle/wants` dolls at c1 p3 | That paragraph shows teasing, not that aim; dropped. Magic interest is independently supported at p13 |
| `zorian-kazinski/wants` c1 p1, c3 p1 aggregate rows | Those opening paragraphs do not substantiate the listed aims. Imported aims cite independently checked p170 and other actual statements |
| `fortov/wants` c3 p11 aggregate rows | That paragraph concerns Zach at the exam. The treatment request uses c3 p198 instead |
| `zach/relations` wariness at c3 p32 | It is Zorian's suspicion, not Zach's attitude toward him; dropped |
| `benisek/relations` at c3 p33 as evidence of Zach's attitude | The speaker is Benisek; no reverse attitude imported |
| `mister-noveda` as a second body | c2 p172-173 identifies the same class exception; retained as M1 alias to Zach |
| Composite place row for arrival | The bridge encounter uses c1 p149-151; the full city itinerary does not become one concrete destination |

Festival/restart rows and all `anchorsOtherLoops` are scope exclusions, not
claims shown false by their source. Non-selected valid routine/reaction rows
remain in the worksheets; this is a tiered first slice, not a whole index import.

## F3. AR11 report: second-case seam fit

Lookup performed against `src/cast_schedule.js`, `src/beat_records.js`, and L3's
exported data, validator and tests. **Zero shared seam edits, zero core-owner
edits, zero registration lines and zero save fields.** The existing data seams
accept all 60 schedules and 44 beats. This proves structural data fit, not an
integrated second-world journey.

| Code | Requirement beyond the default shape | Handling and remaining limit |
| --- | --- | --- |
| AR11-M1 | Distinguish initial-loop, festival and restart records | World-owned `slice` and excluded `days` metadata; `resets` list reserved. Neither shared seam interprets loop identity or performs resets |
| AR11-M2 | Replaceable source-order days with explicit marks | World-owned `days` list; original labels retained. Date derivation is not supplied by the shared seams; L3's eligibility/gate shape handles unplaced dates |
| AR11-M3 | Late-evening workshop rather than the generic night band | Explicit numeric minutes use the existing schedule shape. Local band label is metadata; no shared `TIME_BANDS` addition |
| AR11-M4 | Multiple locations in a source scene and within-day order | Split schedule rows and fill partitions; train itinerary remains an address, not a new travel resolver. Beats settle by day and do not enforce hour order or move bodies |
| AR11-M5 | Known runtime people plus preparation aliases | Existing crosswalk IDs and L3's `indexId`/alias pattern fit. The host still must resolve aliases and enroll records beside existing definitions |
| AR11-M6 | Dated learning, relations and aims | L3's lists retain provenance and date windows. The beat resolver writes event markers, not learning, spending, relationship resolution or observer-safe public knowledge |
| AR11-M7 | Same-loop forward-anchor eligibility | Input has zero qualified anchors, so production lint is empty. A synthetic conflicting same-loop fixture proves detection; another-loop fixture is rejected. This does not prove real-anchor temporal coverage |

No missing requirement was hidden as a new engine capability. M1/M2/M4/M6 name
consumer work outside this data-only lane; M3/M5 use existing shapes without
core changes. The temporal conflict remains open rather than a forced seam change.

## A1. Verification receipt and next owner

- `src/book_world_mol_cast.js` SHA-256: `568ec7bf98a02a70600970d14fe85ea4e4fe97aa93444b6b2a84e25f4a051dbc`.
- `tests/book_world_mol_cast.test.js` SHA-256: `36dfe3bfe744376a4ec08e5a9857f632a66a07477dcc80e7a56fa94600153351`.

Observed shared HEAD: `1740ffd71f26c830ecc4992a740f339a1967611c`; this is
not a frozen combined candidate. Merged input hashes are in `sourceIdentity` and
in the historical probe below.

| Command/check | Result | Gaps |
| --- | --- | --- |
| `python3 - <<'PY' ... PY` JSON input probe | PASS: 25 scenes, 93 worksheets; numeric marks 6 informational | Earlier stop superseded by direct clarification |
| `node --test tests/book_world_mol_cast.test.js` | PASS 8/8 on the hashes above | Pure module checks; no host/browser/save claim |
| `npm run check:arch` | PASS; main -30, display -37, save 0 growth; 6 grandfathered main imports, 205 cyclic edges | Shared-tree snapshot; no new cycles from this module |
| `node --input-type=module - <<'JS' ... JS` locator/prose audit using `shardIndex` | PASS: zero missing imported locators; zero matching eight-word source sequences in exported data strings | Eight-word comparison is a text-copy screen, not a proof against every shorter shared phrase; claims were locally reviewed and paraphrased |
| `git diff --check -- src/book_world_mol_cast.js tests/book_world_mol_cast.test.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L6B_CHECKPOINT.md` plus direct whitespace/local-link check | PASS | Direct check covers untracked files too |
| Full `npm test`, build, browser, save/reload/Export/Import | NOT RUN in this data-only lane | Coordinator owns combined pre-commit and integration gates; no persistence changed |

Initial focused run was 7/8: the principal-completeness assertion found Ilsa's
knowledge list empty. Added the source-supported restricted-material statement
at c3 p77; final 8/8 includes it. No unrelated suite reruns.

Remaining gate: host integration and the rebuilt desktop journey. The five
unplaced scene dates need a source-qualified binding before their body rows and
beats activate. Human review is optional, not a completion blocker. No commit
or push was made.

### M1 promotion queue

| Person index ID | Present | Partial | Note |
| --- | ---: | ---: | --- |
| `mol.person.father` | 0 | 1 | No verified local body scheduled |
| `mol.person.veyers-boranova` | 0 | 1 | No verified local body scheduled |
| `mol.person.mister-noveda` | 0 | 1 | Alias to Zach |
| `mol.person.nirthak` | 0 | 1 | No verified local body scheduled |

Other worksheet entities without authored place/alias records remain preparation
references, not new destinations. Organization counts do not promote them into
people:

| Index ID | Present | Partial |
| --- | ---: | ---: |
| `City streets, then a house upper floor` | 0 | 0 |
| `Cyoria academy grounds, administration building, third-year housing room` | 0 | 0 |
| `Dance hall roof, dance hall stairway, dance hall, city streets` | 0 | 0 |
| `Residence building, walk to dance hall, dance hall` | 0 | 0 |
| `Street near the house, behind a cart` | 0 | 0 |
| `another continent` | 0 | 0 |
| `burning city streets (no id)` | 0 | 0 |
| `city streets (no id)` | 0 | 0 |
| `classroom` | 0 | 0 |
| `classroom door` | 0 | 0 |
| `family business` | 0 | 0 |
| `house upper floor (no id)` | 0 | 0 |
| `mol.organization.academy` | 1 | 2 |
| `mol.organization.guild` | 0 | 1 |
| `mol.organization.kazinski-family` | 0 | 2 |
| `mol.organization.noble-house-boranova` | 0 | 1 |
| `mol.organization.noble-house-noveda` | 0 | 1 |
| `mol.organization.royal-academy-of-magical-arts` | 2 | 1 |
| `mol.place.academy` | 0 | 0 |
| `mol.place.administrative-building` | 0 | 1 |
| `mol.place.cirin` | 1 | 1 |
| `mol.place.cyoria` | 0 | 1 |
| `mol.place.cyoria-train-station` | 1 | 0 |
| `mol.place.dance-hall` | 2 | 0 |
| `mol.place.entrance-hall` | 0 | 1 |
| `mol.place.fountain` | 0 | 1 |
| `mol.place.korsa` | 0 | 1 |
| `mol.place.reference-91e952cc0420b0ed3e72` | 0 | 0 |
| `mol.place.reference-c5ce61f1a9a395cef0ca` | 0 | 0 |
| `mol.place.residence-building` | 1 | 1 |
| `mol.place.room-115` | 0 | 1 |
| `mol.place.sarokian-highlands` | 0 | 1 |
| `mol.place.the-hole` | 0 | 1 |
| `mol.place.tunnels-beneath-city` | 0 | 2 |
| `mol.place.zorian-cirin-room` | 0 | 0 |
| `town market (Cirin)` | 0 | 0 |
| `unstated` | 0 | 0 |
| `wilderness survival class` | 0 | 0 |

## Historical probe stop, superseded by coordinator clarification

### Original probe receipt

Status: **stopped at the brief's data-probe gate; cast records not authored**.
Agent-verified probe, not human-reviewed. No runtime, host, save, pack definition,
registration, commit or push change.

Authority: [L6B brief](L6B_MOL_CAST_RECORDS_BRIEF.md),
[L6A checkpoint](L6A_CHECKPOINT.md), [L3 brief](L3_CAST_RECORDS_BRIEF.md),
[L3 checkpoint](L3_CHECKPOINT.md), and
[cast-lives plan](../CAST_LIVES_PLAN_2026-10-28.md) sections 3.2 and 12-16.
Applicable codes: WA22-WA24, WA35, proposed WA43, PL-A46, CL24-CL25,
AR3/AR5/AR10-AR16, AD36, AD41. This remains a data-only lane.

## F1. Probe result and stop

The brief asks for lead scenes with numeric day marks of the form `L?-D<n>`
or `L1-D<n>`, expects about 25 scenes and 93 worksheets, and says:
"Stop and report if under half."

| Measure | Observed |
| --- | ---: |
| Worksheets | 93 |
| People | 26 |
| Places | 61 |
| Organizations | 6 |
| Lead scenes in `en b1 c1 p1` through `en b1 c5 p9` | 25 |
| Lead scenes with numeric day marks | 6 |
| Other lead scenes without numeric day marks | 19 |
| Candidate schedule rows | 139 |
| Candidate rows with both `from` and `to` | 43 |
| Routine slots | 76 |
| Timed candidate rows whose source is `routine` | 0 |

Numeric day coverage is 6/25 (24%), below half the expected scene count.
The 43 usable-time rows reported by L6A are candidate rows from whereabouts,
not timed routine rows. Total scene and worksheet counts pass; numeric day
coverage does not. No dates were repaired from memory or inferred to pass the gate.

| Scene | Day mark | Date label | First evidence locator |
| --- | --- | --- | --- |
| `lr.mol.main.00101` | `L?-D1` | U | `en b1 c1 p1` |
| `lr.mol.main.00102` | `L?-D1` | U | `en b1 c1 p79` |
| `lr.mol.main.00103` | `L?-D1` | U | `en b1 c1 p115` |
| `lr.mol.main.00104` | `L?-D1` | U | `en b1 c1 p138` |
| `lr.mol.main.00105` | `L?-D1` | U | `en b1 c1 p160` |
| `lr.mol.main.00501` | `L1-D1` | I | `en b1 c5 p9` |

The last marked scene is explicitly a restart scene in the worksheet. It cannot
be imported into the requested first-loop cast as another initial day. The
chapter 4 scene rows also carry dance-night labels; plan D4 defers festival
night. Neither boundary was silently widened to produce more records.

## F2. AR11 lookup and unperformed authoring

Read `src/cast_schedule.js`, `src/beat_records.js`, and the L3 data/validator
and focused test. The schedule seam supports `once` with a positive day and
`irregular` without an active phase. The L3 shape retains unresolved day windows
and gates beats with a binding fact. These are available for unresolved MoL
dates if the coordinator revises or clarifies the probe gate.

An exhaustive second-case gap report is **not established**: authoring stopped
before importing MoL rows. No shared seam edit was made or demonstrated necessary.
Loop scoping and reset metadata require first-loop review before import; no
restart implementation was attempted. This checkpoint does not claim AR11 proven.

Counts per authored tier, authored row label, beats per principal and PL-A46
rejections: not applicable because no cast rows were authored or paragraph-level
claim acceptance performed. The source/test paths were absent at entry and
remain absent.

## A1. Check log and ownership release

Inputs are under `docs/research/novels/mother-of-learning/private/lead-run-2026-10-28/`.
Merged input SHA-256 identities:

| File | SHA-256 |
| --- | --- |
| `scenes.jsonl` | `fe341e3f53221245467af964b2e29c27efc5b396d779ce15f92961feab6af1e9` |
| `crosswalk.json` | `9e2eff5288706d749b576c1dc93ac04a63c1952dad6eeef42a5c7f1e3dc4a222` |
| `extras.jsonl` | `4bfd0b20c9dab1cb76c51c2c3102f0bea2adc922b42d46dbd707620f15035a79` |

- `python3 - <<'PY' ... PY` read-only JSON probe: PASS for counting; STOP condition found. Parsed all 93 worksheet JSON files, counted kinds and candidate/routine times, filtered scene first-evidence locators to the declared inclusive range, and full-matched date values against `L[?1]-D\d+`. Counts and matching scene IDs are above; no source prose copied.
- `git diff --check -- docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L6B_CHECKPOINT.md`: PASS, no diagnostics. The new untracked checkpoint was also checked directly for trailing whitespace and linked local files.
- `node --test tests/book_world_mol_cast.test.js`: NOT RUN; test and cast module not created because the input gate stopped authoring.
- `npm run check:arch`: NOT RUN; no JavaScript or import changes.

Only this owned checkpoint was created. Unrelated shared-tree changes were
preserved. All three owned paths are released to the coordinator. Remaining
gate: resolve numeric-day coverage under the brief before resuming cast authoring.
