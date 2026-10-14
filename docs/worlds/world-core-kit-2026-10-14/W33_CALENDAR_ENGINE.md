# W33: Calendar engine shape

## CHECKPOINT

2026-10-14. Design complete; implementation and playable acceptance OPEN. Own only this file and `docs/gm/dispatch/world-core-kit-2026-10-14/W33_REPORT.md`. Inspected live source with HEAD observed at `5f2e18fbda306dfb1f0ac43ef1d21cf38b25def3` during this pass on `codex/gameplay-foundations`; concurrent workers and mixed staged/unstaged changes exist. Line locators describe the inspected live files, not an immutable clean commit. Refresh affected files before implementation. No source, tests, bundles, saves, private packs, root or sibling edits; no builds, test execution, staging, commits, checkout or merge.

All schema/API shapes and defaults below are **INFERRED proposals**, not accepted specifications. **SHOWN(source)** means read in code, not exercised. **SHOWN(doc)** means an owner says it, not new canon verification. No `SECRETS*` file was opened. No new franchise calendar claim is made from memory.

## W33.O: extend the owners

Read [COMMON](../../gm/dispatch/world-core-kit-2026-10-14/COMMON.md) first, then kit rounds 9-12 and the [audit playbook](../WORLD_CORE_KIT_AUDIT_PLAYBOOK.md). Direction remains canon-first, desktop/laptop first, one playable slice before the next. Design does not reopen paused runtime work or add a whole-world completion gate.

| Code | Existing owner and consequence for this proposal |
|---|---|
| W33.O1 | [Origins and world timelines](../ORIGINS_AND_WORLD_TIMELINES.md#overarching-history-with-local-calendars): campaign order, local date/era and traveler exposure are separate concepts. Extend its proposed timeline record with a calendar binding; keep the authoritative scheduler/publication path. |
| W33.O2 | [Intro flow](../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md), AH1-AH11, SS4, MZ5, IR3: anchors belong to starts; a local date stamp is a clue. A named event anchor need not have an exact historical date. |
| W33.O3 | [MoL pilot lessons](../../gm/dispatch/canon-events-2026-10-14/pilot-mol/LESSONS.md), K3/K6: axis, bounds and precision qualify dates; replay ordinal is not a sourced day; distinguish loop-local recurrence. Retain this even where newer code resolves window bounds. |
| W33.O4 | [Timelines and divergence](../../TIMELINES_AND_DIVERGENCE.md), TIME-P4: selected clock/absence mapping and exposure must agree. Formatting cannot advance time, age bodies or settle jobs. |
| W33.O5 | [W25](W25_CLOCKS_AND_AWAY.md), C1-C20, D2/D7 and its module census: reuse the elapsed-reader inventory and proposed WorldTimeFrame. CR5's policy envelopes are an input shape, not evidence every rate/absence policy works today. |
| W33.O6 | [W29](W29_PARADISE_SPECIAL.md), B3; [W30](W30_HP_DND_MOL_SPECIAL.md), N-ML: document hierarchy is not saved physical containment. Preserve MoL's independent forward visitor slice; a future canon loop is a separate selected adapter. |
| W33.O7 | [W28 assignment](../../gm/dispatch/world-core-kit-2026-10-14/W28.md): climate prototype accepts explicit world/place/clock/seed. Its result file and branch `kit/w28-world-climate` were absent at this check. W31/W32 were absent at the initial read; W31 appeared before close and its calendar/clock rows were read. W31.F1 clarifies TTKS B1-B5 are separate novels; W31.F3 rejects an assumed universal paired-realm conversion. W32 remained absent; no completion dependency inferred. W28 integration below is a proposed seam, not a statement about its eventual API. |

Use the `more-to-consider` skill to trace ownership, lifecycle, old saves and adjacent opportunities without widening this docs-only authorization. W34/W35 own source calendar census; exact names/epochs must come from their evidence and world source owners.

## W33.I: time/date inventory

This is the calendar-facing inventory, with the exhaustive elapsed-module census reused by reference from W25 rather than copied into a competing owner. Search surface: `src/**/*.js`, calendar/night/season/moon/date and formatting expressions, native adapters, save labels and rendered date callers. A lexical hit is not a separate clock. Arithmetic below is SHOWN(source); missing general calendar behavior is an inference from these readers. No date-output/browser claim was exercised.

Coordinates: **G** global native date fields; **J** joined played minutes; **I** instance elapsed played minutes; **W** wall epoch milliseconds; **P** pure supplied coordinate. **C** means clock/accounting, **F** means date naming/format, **R** means rule/derived environment. A module can have several roles. Calendar units affect projection, while clock policies decide how much elapsed it receives.

| Code | File:line | Kind and observed path |
|---|---|---|
| W33.I01 | `src/game_time.js:8`, `:18`, `:35`, `:48`, `:195` | C/G: mutable date arithmetic and load normalization, 60 minutes/hour, 24 hours/day, 30 days/month, 12 months/year. Global seed is year 999, month 4, day 1, 08:00, weekday count 1. This is not native visitors' epoch. |
| W33.I02 | `src/game_time.js:90`, `:109`, `:120`, `:193` | F/R: seven named weekday abbreviations already exist; day_count drives them. Numeric date plus season/weekday; 29.5-day moon and phase names. No source month-name/era profile. Moon helper existence is not a calendar UI integration claim. |
| W33.I03 | `src/game_time.js:63`, `:77`, `:84`, `:188` | R: four equal three-month seasons; Dawn/Day/Dusk/Night; simple Night begins 21:00, but `night_time` and `is_night` begin 20:00 (`:3`). Both end at 04:00. This existing disagreement needs an explicit legacy policy, not silent cleanup in a formatter. |
| W33.I04 | `src/game_time.js:137` | F duration, not date: `format_time` mutates its input and reduces by 60/24/30/12. `>30` and `>12` conversion boundaries differ from date normalization. Preserve existing callers; the new pure date formatter must not reuse this mutating function. |
| W33.I05 | `src/book_world_mol_native.js:7`, `:19`, `:30`, `:37`, `:146`, `:153` | C/I to legacy F: seed 06:00 year one, `360 + elapsed`, fixed 30/12 projection. Native metadata checks exact derived calendar equality; publish/restore load it into local Game_Time objects. |
| W33.I06 | `src/book_world_paradise_native.js:7`, `:19`, `:30`, `:37`; `src/book_world_paradise_carriers.js:23`, `:30` | Same legacy F for two independently owned instance clocks; native carriers expose calendar owners and common/presence clock-policy envelopes. Hub and child dates need separate bindings. |
| W33.I07 | `src/feature_expansion_destination_native.js:9`, `:20`; `src/feature_expansion_nested_native.js:11`, `:27`; `src/proto23_world_native.js:19`, `:61` | Additional I-to-legacy-calendar adapters and validation. Do not design a two-world-only replacement that leaves these duplicate projections unsafe. Keep them on legacy profiles until their owners select adoption. |
| W33.I08 | `src/world_instances.js:108`, `:278`, `:309`, `:339`; `src/realm_clock_leases.js:179` | C: saved elapsed/observedAt/unit/absence. Existing instance validator requires played_minutes and freeze; visits/eligible leases authorize advancement. Calendar profile does not supply a second rate or absence policy. |
| W33.I09 | `src/book_world_mol_state.js:24`, `:55`, `:57`; `src/book_world_mol_host.js:60` | C/I: independent_nonmage_visitor, local offer window of 90 minutes. No native general month-loop reset is established by these paths. |
| W33.I10 | `src/book_world_paradise_state.js:8`, `:20`, `:51`, `:54`; `src/book_world_paradise_host.js:77` | C/I deadlines/extraction, J receipt coordinates. Deadline 90 and extraction 2 are prototype contract minutes, not civil dates or canon calendar evidence. |
| W33.I11 | `src/chronicle.js:3`, `:15`, `:78`, `:92`, `:93`, `:102`; `src/chronicle_ui.js:70`, `:83` | C/J + G anchor: enrollment snapshot, elapsed age/lifespan on 360-day years; validator equates calendar delta with J delta. UI replays J offset through Game_Time to print dates and durations. Not an instance-local calendar converter. |
| W33.I12 | `src/life_record.js:3`, `:20`, `:55`, `:60`, `:65`, `:75`; `src/life_record_ui.js:13` | C/G encoded as absolute minutes with `year * 360 * 1440`, not `(year-1)`. Year consistency and monotonic append guards; observation stamps current global date and current actor world separately. UI prints Year N and compacted year headings. A lossy biography is not a scheduler. |
| W33.I13 | `src/titles.js:3`, `:47`, `:52`; `src/main.js:7882`, `:7895`; `src/npc_lives.js:5`, `:33`, `:42`; `src/npc_lives_ui.js:16` | C/G-derived years and F age/year labels. Fixed home start, title tenure, Village births/deaths/news; these must not age or re-award titles when only a local date label changes. |
| W33.I14 | `src/world_rhythm.js:5`, `:20`; `src/expansion_engine.js:438`, `:548` | C/P: 360-day absolute calendar encoding, periodic half-open availability, saved cycle claims. Reusable recurrence consumer, not arbitrary calendar holidays. |
| W33.I15 | `src/weather.js:2`, `:63`, `:71`, `:111`, `:162`, `:194`, `:198` | R/G: fixed seasonal/day temperature tables, day_count modulo 11/13, mutable smoothing history, rain, roof light and global night window. Some helpers take time but still use current_location. Not a pure per-world climate derive. |
| W33.I16 | `src/main.js:698`, `:737`, `:810`, `:842`, `:864`, `:989`, `:1272`, `:1311`, `:7344` | C: host calendar contexts, native snapshots, planned consumed-minute advance, durable publication/load, live goUp. Select a world frame at these existing seams rather than letting UI pick the clock independently. |
| W33.I17 | `src/main.js:3501`, `:3508`, `:3670`; `src/conditions.js:225`; `src/data/locations.js:349`, `:1092`; `src/components/trader_component.js:87`; `src/main.js:7413`, `:7426` | R/G: hour/season availability, descriptions, shop refresh and day-change consumers. Changing month names alone must not change these rules. Full local binding is a separate later adoption from the log slice. |
| W33.I18 | `src/absorb_c2/local_life.js:59`; `src/absorb_e1/pacing.js:29`; `src/main.js:700`, `:741` | R: supplied day/hour and season drive people/watch and pacing. Same frame must eventually feed forecast, schedules and display; no free work from a rendered date. |
| W33.I19 | `src/anchor_snapshots.js:39`, `:75`, `:83`, `:90`, `:147`, `:165` | P: explicit numeric at wins; otherwise window.from/to resolve deterministically by seed/event ID, integer bounds inclusive. resolvedAt stores times, including future ones. Reset/localAt and incremental invalidation exist in this pure snapshot tool, not a live general calendar scheduler. |
| W33.I20 | `src/display.js:4221`, `:4225`; `src/main.js:1917`, `:5494` | F/G: visible top time field at initialization, ticks and restore. Formats global Game_Time even during book-world play. No new formatter can claim local UI completion until all those entry points agree. |
| W33.I21 | `src/display.js:927`, `:1098`, `:1112`; `src/quiet_place_detail.js:3`; `src/main.js:8537` | F: message log receives already authored text, trims categories and preserves scroll/unread behavior; no general local-date stamp at this seam. Atmosphere text reads host daylight/rain. Date lines must respect log settings and known information. |
| W33.I22 | `src/display.js:849`, `:2635`, `:4214`; `src/chronicle_ui.js:83`; `src/crush_social_views.js:154` | F duration/window text: effect/travel duration, elapsed life, work opening countdown. These are not civil dates; keep explicit played-minute units where that is the contract. |
| W33.I23 | `src/main.js:5055`, `:5094`, `:5421`, `:8730`; `src/display.js:6082`, `:6097` | W and F: host-local Gregorian saved_at label, backup and alternate-save load buttons. `new Date()` is wall metadata, not in-world date. Keep this labeling independent. |
| W33.I24 | `src/main.js:5389`, `:5519`, `:7398`; `src/away_ledger.js:6`; `src/backlog_expansion_time.js:70`; `src/settled_text_effects.js:163` | C/W or presentation: export cooldown, tick compensation, pure away allowance, reviewed packing, visual monotonic time. No calendar profile converts these straight into world progression. Full consumer/guard inventory: W25 C10-C20 and appendix. |

| W33.I25 | `src/save_files.js:66`, `:67`, `:157`, `:159`; `src/expansion_persistence.js:17`; `src/life_experience_host.js:17`, `:28` | C/guards: generated people and Village lives may not be ahead of global time; chronicle import validates its anchor; publication carries the planned date; heir transfer preserves global calendar and appends a legacy milestone. New date content must not invalidate these paths. |
| W33.I26 | `src/cooling_refinement_facts.js:29`, `:95`; `src/cooling_refinement_host.js:114`, `:122`; `src/audit_remainder_livelihood_facts.js:63` | C/P and visible numeric receipts: saved calendar anchor plus J delta supports quiet/work windows. Accepted frozen quote prints calendar minute and observed entries print minute at. These stay labelled accounting coordinates, not rewritten as source civil dates. |
| W33.I27 | `src/generated_people.js:43`, `:50`; `src/status_care_facts.js:35`; `src/world_completion_life_facts.js:30` | C/P: supplied absolute minute/hour routines and calendar-support guards. No new calendar formatter, but adoption must preserve these numeric consumers and distinguish local place time from actor/body support. Other feature receipts/guards remain enumerated in W25's module census. |

**W33.F1, CR7 correction in both directions.** Native MoL/Paradise date projections are indeed synthetic fixed-unit dates. But “no week” in CR7 is too broad for the shared implementation: Game_Time has named weekdays and a moon helper. They do not establish a sourced MoL/Paradise week or lunar calendar. W25 C3 and CR5 also need the distinction between descriptive carrier policies and currently accepted instance policies. Preserve both the existing functionality and its limits.

**W33.F2, pilot versus live snapshot code.** Pilot K3/K6 remain valid source-precision lessons; their older “metadata only” window description no longer describes all live code. Anchor snapshots now resolve numeric windows and finite resets; [V2 notes](../../gm/dispatch/canon-events-2026-10-14/V2_NOTES.md), A3/A4, agree. This is SHOWN(source), not executed by W33. It still does not provide civil calendar conversion, a general holiday runner, or actor-safe display of resolvedAt.

## W33.C: CC1-CC16 against current code

“Partial” credits a concrete seam, not a passing gameplay gate. “Missing” means no implementation of this calendar requirement found in the inspected surface. No CC row is fully met across worlds; none was tested by execution in this design lane.

| Kit item | Status | Evidence and smallest missing piece |
|---|---|---|
| CC1 system | Partial | I01-I07 support one fixed numeric system and weekdays. Missing source-specific day/year/month/era/epoch content and configurable arithmetic. |
| CC2 precision | Missing | I19 resolves numbers, not epistemic precision. Keep exact simulated occurrence distinct from source precision; no September day manufactured from a replay ordinal. |
| CC3 arrival anchor | Partial | I05/I06 synthetic zero and I11 enrollment anchor exist. Missing instance-bound canon/start anchor with revision and evidence. |
| CC4 recurring dates | Partial | I14 periodic service occurrences; no general source festival/term/moon rule set. Calendar matches must dispatch to existing effect owners. |
| CC5 several calendars | Partial | I06 has separate hub/child owners; G/J/I already differ. Missing primary/overlay calendar bindings for one local instant and actor-safe line composition. |
| CC6 canon windows | Partial | I19 deterministic numeric windows, precedence, reset projection. Missing unit/axis/calendar binding, precision-aware date view and integration with live causal resolution. |
| CC7 foreknowledge | Partial | Snapshot knowledge/requirements exist (`src/anchor_snapshots.js:32`, `:48`). Missing safe calendar presentation filter; raw resolvedAt is not a public calendar API. |
| CC8 divergence | Partial | Snapshot branch/provenance/invalidation exist (I19). Missing known-actor-only would-have-happened calendar ghosts. Date projection should continue without forcing a failed canon event. |
| CC9 loops | Partial | Pure snapshot localAt/reset exists (I19); MoL visitor stays forward (I09). Missing selected native loop law, iteration identity, resets/retention and loop-aware date view. |
| CC10 ages/birthdays | Partial | I11-I13 elapsed age and original Village birth years, life kind birthday. Missing sourced per-person birth precision and birthday recurrence. Civil year is not body age. |
| CC11 sky | Partial | I02/I03/I15 moon/night/season/light exist globally. Missing world/place latitude/daylight/multi-moon profiles and shared climate projection. |
| CC12 literacy | Missing | Numeric date and weekday names exist (I02/I20); no actor-local calendar vocabulary, learned translation or social consequence. |
| CC13 saves | Partial | I05-I12 preserve clocks/anchors and validate synthetic dates. Missing pinned calendar profile/revision/hash plus migration compatibility path. |
| CC14 lens | Missing | No calendar-specific today/overlays/known-window inspector found. W27 owns future shell integration. |
| CC15 contradictions | Missing | Source labels exist in design owners, but no runtime calendar alternative/revision/evidence selection found. Keep conflicting anchors labelled rather than averaging them. |
| CC16 crossover anchors | Partial | I06/I08 preserve independent world coordinates. Missing explicitly authored shared-date mapping and non-converting local display. Independence alone is not a crossover anchor. |

## W33.P: profile content and pure projection

Default: source-qualified profile when available, explicit legacy/local elapsed wording otherwise. Dial: actor-chosen primary/known overlays and labelled fan-timeline variant. Reason: a school timetable, civil holiday and traveler lifetime refer to different things.

Keep three pure operations rather than one formatter that quietly schedules effects:

```text
projectCalendar(profile, binding, frame) -> CalendarView
formatCalendar(CalendarView, vocabulary, precisionPolicy) -> text/tokens
calendarOccurrences(profile, binding, interval, scope) -> candidate windows
```

Only the existing command/scheduler/publisher can commit an occurrence's effect or claim. Projection reads no globals, wall clock, RNG, mutable smoothing state, save store or DOM, and does not mutate inputs. Format text from safe tokens with textContent; packs supply data and registered rule IDs, not executable JavaScript or arbitrary HTML.

### W33.P1 proposed world-content record

```text
CalendarProfile {
  id, schemaRevision, contentRevision, contentHash,
  qualification: {kind, sourceLocators, conflicts, alternativeIds},
  algorithm: {id: fixed | gregorian | table-cycle, revision},
  units: {ticksPerMinute, minutesPerHour, hoursPerDay},
  months: [{id, nameKey, days}], leapRuleId, intercalaryRules,
  week: null | {dayIds, names, epochWeekday, intercalaryCounts},
  year: {eraIds, yearZeroPolicy, displayOffset},
  vocabulary: {datePattern, shortPattern, unitNameKeys},
  cycles: [{id, periodTicks, phaseAtEpoch, names}],
  recurrence: [{id, calendarId, rule, scope, evidence, visibilityRef}],
  skyRef, seasonRef, defaultPrecision, overlayIds
}
CalendarBinding {
  worldId, instanceId, continuityId,
  profileId, profileRevision, profileHash, algorithmRevision,
  clockRef, conversion: {numerator, denominator},
  anchor: {clockValue, dateCoordinate, precision, evidence},
  overlayBindings, resetPolicyRef
}
```

Units are content for projection. Tick is a declared integer subunit, not another ticking owner. Bind existing played minutes through an explicit rational conversion, with safe-integer bounds and saved remainder only if the clock owner actually needs one. Do not rewrite instance clock.unit. Use absolute day/tick coordinates internally; month/year display is derived. Algorithms are registered engine implementations; adding Gregorian data must not route February through Game_Time's 30-day normalization. Validate month lengths, era transitions, leap rules, overlay references and overflow. Unknown era/year is nullable, not invented year one. Intercalary days declare whether the weekday advances. Default fixed arithmetic for legacy, Dial registered source-specific rules.

Anchor mapping is `localTicks = anchorTicks + convert(frame.clockValue - anchor.clockValue)`. The date anchor must not itself advance when rendered. A source anchor with month/season precision can retain an exact simulation offset internally while its public label stays coarse. A date unknown to canon can still have an exact simulation time for deterministic weather; mark that offset as an authored choice, not a discovered source fact.

### W33.P2 frame, precision and overlays

Extend W25's read projection by reference: world/instance/clock-policy revision, selected elapsed coordinate, place, pinned seed, calendar binding reference and optional authorized reset coordinate. Clock policy remains owned by W25/runtime. CalendarView supplies absoluteLocalDay, minuteWithinDay, cycle IDs/phases, year/month/day/weekday where meaningful, era, seasonPhase, precision/evidence and safe display tokens. These are derived, not a second saved clock.

Separate three precision axes: simulation coordinate, source assertion, actor knowledge. Format at their supported intersection. An exact authored offset within a source-qualified season displays “early autumn” if that is all the source supports. Fan exact dates require explicit labelled alternative selection. Tooltip/accessible description can explain units and “date approximate”; it must not reveal a hidden exact day. Plain translation is not permission to increase precision. Unknown dates display local elapsed or known term, not a fake Gregorian date.

CC5 overlays project the same selected local instant into civil, religious or school calendars, each with its own binding/evidence. Default primary plus at most a useful known short overlay in the log; Dial more in the lens. Independent Paradise hub/child clocks are separate frames, not two format overlays on one elapsed number. CC16 linked worlds use a pinned mapping edge naming both instances, clock coordinates, revision and uncertainty. Default show each local date without conversion. No automatic UTC or Gregorian bridge.

### W33.P3 recurrence, loops and canon windows

Recurrence rules describe weekly/month/day/term/phase or finite relative windows, with explicit calendar ID, half-open interval semantics and loop-local versus continuity scope. Birthday rules for missing dates/leap days declare a profile choice. Query `[from,to)` yields candidate occurrence IDs derived from profile revision, instance/continuity, rule and cycle; include iteration ID for loop-local events. These IDs prevent double claims after split advancement/reload. Claims, attendance, price changes and rewards stay in their existing owners. A matched holiday does not award participation. Recheck causes/support at resolution; week rhythm KX77 and effects KX78 are later consumers.

Preserve the existing snapshot API's **inclusive** integer window selection and explicit-at precedence. Do not silently convert it to half-open recurrence bounds. An adapter records axis, unit, graph revision, source precision, selected anchor and resolved occurrence independently. A replay ordinal with no date binding stays ordinal. Public windows pass CC7 knowledge/sealed filtering before text generation; do not pass raw graph/resolvedAt into UI. CC8 ghosts require actor prior knowledge and stay proposals; current elapsed keeps running even after a canon cause fails.

For CC9, a selected reset adapter supplies `iterationId`, loop-local coordinate and retention policy. Use its reset point; do not infer a canon loop by taking elapsed modulo 30 days. The date may repeat while J, biography order and traveler exposure continue. Loop-aware actors may see loop number; other actors see only permitted local dates. Recurrence keys include iteration, while deliberately retained claims follow their declared scope. The profile formats a reset; it does not perform one. Existing MoL visitor saves never acquire a loop merely by upgrading calendar content.

### W33.P4 W28 sky and climate hook

Offer `calendarEnvironment(view, skyProfile, place) -> {absoluteLocalDay, dayFraction, seasonId, seasonPhase, daylight, moons}`. It is a pure derived input for W28, using the same binding and selected instance clock. W28 continues to own temperature/rain and place shelter effects. Season names are vocabulary; climate uses stable season IDs/phases, not translated labels. No-season profiles return null, not inherited Spring. Cycles need not be 360 days and may exist without months. Moons carry explicit period/phase/evidence; absent sky data stays unknown or a labelled prototype.

Default compatibility daylight reproduces legacy light boundaries; keep the 20:00 versus 21:00 semantic discrepancy visible until the environmental owner chooses a versioned reconciliation. Dial latitude/day-of-year sunrise/sunset, polar/no-sun/indoor realms and authored cycles with an in-world reason. A sealed indoor hub does not inherit outdoor rain or a sourced civil calendar by implication. Cache only by complete world/instance/profile/place/time/seed key. Computing the same skipped interval or the same repeated loop with unchanged causes must not draw new climate randomness. Record weather consequences in existing effect owners, not in CalendarView. Display-only KX76 delivery does not claim W28 integration or repair the global weather readers.

## W33.M: native adoption and compatibility, CC13

**Default preserve elapsed and legacy projection; Dial explicit new-start or versioned migration into a source-qualified calendar.** No saved elapsed, deadline, receipt, claim, biography year or enrollment snapshot changes just because a date label does.

| Code | Adoption step / compatibility condition |
|---|---|
| W33.M1 legacy | Define a legacy 24/60, 12x30 profile with year-one 06:00 anchor for native visitors, and a distinct home binding for year 999/April-like numeric month 4/08:00. Derive weekday from the existing day_count anchor, not a guessed historical weekday. Keep native metadata `calendar` and exact validation unchanged in the first display slice. |
| W33.M2 MoL | Read instance.clock.elapsed, bind legacy profile initially, then optionally use a source-qualified visitor calendar at new enrollment. A source epoch/name profile can relabel the date without resetting retrievalOpenedAt or its +90 window. A future canon-loop start requires its own reset adapter and acceptance; do not migrate independent_nonmage_visitor into it. |
| W33.M3 Paradise | Separate hub and Goa bindings; preserve active-visit presence clock, localDeadline and extraction.dueAt. Hub default may show qualified elapsed/shift wording when no sourced civil date exists; Dial a sourced civil overlay if evidence establishes one. Child source date needs its own anchor. Do not turn document parentCard into saved parentInstanceId. |
| W33.M4 staged schema | Existing native envelopes validate exact key sets and revision 1 (I05/I06). Adding fields there is a real compatibility change. First use existing immutable campaign definition revision to resolve the legacy binding with no new persisted field. For source-aware starts, add a separately validated versioned binding through the save/envelope owner, with an explicit reader/schema migration. Do not inject fields into current exact shapes. |
| W33.M5 old saves | Missing binding deterministically resolves to legacy profile and original anchor, no elapsed credit, fabricated history, retroactive birthdays or changed claims. Non-enrolled optional worlds remain absent. Save/reload/export/literal-file import must preserve exact existing owners. Historical biography and chronicle dates remain on their legacy axes until those owners authorize a versioned extension. |
| W33.M6 profile corrections | Pin revision/hash and keep the matching definition available. New canon research does not re-anchor existing lives silently. Default retain old binding with labelled source correction; Dial explicit compatible relabel migration with old/new anchor/revision and note. If mechanics use recurrence/sky differently, treat it as a gameplay migration, not cosmetic text. |
| W33.M7 missing/invalid content | Unknown custom profile revision suspends its calendar-dependent actions and gives a safe unavailable label; preserve export and the original save. Do not silently substitute base arithmetic. Reject invalid binding identities/hash/units before publication. An explicitly recognized legacy save may use M5; corrupt new data is not a legacy save. |
| W33.M8 accounting boundaries | lifeCalendarMinute, calendarMinutes, titleCalendarMinute and chronicle anchors keep their 360-day encodings. Do not feed a Gregorian CalendarView into them. Future history records can add world/instance/local coordinate plus profile binding, while legacy `at` continues ordering. Age follows selected actor exposure/life clock, not displayed era year (KX80). |

## W33.V: smallest visible slice, KX76/KX81

Proposed target: **1366x768 desktop**, Workspace/default log panel, normal text size. Visible result: first world log header and each committed local day change show that instance's qualified date. No mobile optimization, calendar inspector, holiday effects, climate rewiring, native loop law or whole-world scheduler in this slice. Later verify a larger desktop as useful evidence, without replacing this target.

| Code | Seam and result |
|---|---|
| W33.V1 resolve | After valid new-game/enrollment/restore/world entry, resolve actor's active world instance and binding from committed state. Home uses home binding; visiting worlds use local I. Resolve before the first playable-world message. A generic pre-world loading message is not that first world log line. |
| W33.V2 print | Put an ordinary event-category date header through the existing log settings/scroll/unread path (`display.js:927`, `:1098`). Header data is safe text. Tooltip and keyboard-accessible description give permitted translation/precision, not hidden exact dates. Preserve filters and unread behavior. |
| W33.V3 boundary | Compare previous/next committed CalendarView day identities, not global day_count or formatted strings. Identity includes instance, binding and optional iteration. Emit header before messages caused on that day; name exact-equality ordering in the host adapter. World entry prints a contextual header even if its date resembles the last world's date. Rendering panels creates no header/effect. |
| W33.V4 lifecycle | Log is currently a transient DOM stream, not a durable calendar ledger. Keep last-displayed key transient per restored session; reload produces one current contextual header, not replay of every old day. Within session no duplicate on rerender, filter toggle or failed publication. If durable date receipts are later wanted, that is separate save scope. |
| W33.V5 jumps | For a multi-day committed advance, attach headers to actual emitted day-grouped events; where silent days are skipped, use a compact dated interval/count summary with explicit skipped days. Do not produce unbounded log spam or synthetic attendance. This is a proposed compact exception to literal every-day printing; direct single-day advancement must print its day boundary. Away processing remains W25's owner. |

Proposed checks, **not run**:

| Code | Future test and acceptance signal |
|---|---|
| W33.T1 | Pure projection freezes inputs; equal calls equal outputs. Fixed epoch elapsed 0 = 06:00, 1079 = 23:59, 1080 = next day 00:00; month/year boundaries, safe-integer overflow and invalid units/references covered. Legacy weekday and Game_Time outputs compared at declared supported boundaries. |
| W33.T2 | Gregorian leap/non-leap centuries, month ends, intercalary weekday behavior and custom day length; exact arithmetic stays out of lifeCalendarMinute. Distinct profiles for same elapsed yield different labels without clock changes. |
| W33.T3 | Coarse/unknown dates, contradictory selected alternatives and known/unknown overlays; hidden event IDs/dates absent from text, tooltip, accessible label and public return object. Filter at projection boundary, not CSS. |
| W33.T4 | Recurrence `[a,b)` split parity, no duplicate candidate at b; legacy snapshot inclusive windows/explicit at precedence preserved. Loop reset repeats local date with fresh iteration occurrence ID, retaining only selected claim scope. Pure fixtures do not prove native reset gameplay. |
| W33.T5 | Formatter/profile introduction leaves old MoL/Paradise envelopes, elapsed, deadlines, stock, quests, money, biography, RNG state and chronicle validation unchanged. New binding save/reload/export/import exactly round-trips; unavailable revision suspends rather than rewriting. |
| W33.T6 | Host log contract: one header on entry, one at exact midnight, none on rerender/failed commit; transition and first cause ordering; return to frozen world, repeated loop date, log category limit, scroll/unread/filters; bounded multi-day summary. Failed save causes no date advance/public header for unpublished work. |
| W33.T7 | W28 consumer contract later: identical frame gives same season/daylight in log/climate preview/live and segmented skip; no-season/indoor/no-moon and world-switch cache isolation. Does not require integrating weather.js for KX76. |

Desktop journey for later implementation, using a rebuilt fresh isolated test origin and disposable fixtures through supported start/import routes:

1. **W33.J1:** Start home at the target viewport. Capture first date header, source/build identity and normal-time field. Use an earned or documented disposable near-midnight save; cross midnight through actual supported play. Verify exact one header before that day's first consequence and readable placement without stealing scroll.
2. **W33.J2:** Enroll/enter the existing MoL visitor, then Paradise hub/child through their native routes. Record entry header and current instance elapsed, compare a local boundary, leave/reenter a frozen instance and verify local date has not advanced from home passage. Deadline behavior stays equivalent to pre-calendar fixtures. Any unreached route stays OPEN.
3. **W33.J3:** Save/reload, export and literal-file import on a separate disposable origin. Compare binding, elapsed, native projection, deadlines and current header. Repeat with an old save lacking bindings. Verify no event replay/reward or biography rewrite. Include missing-profile import behavior once new persisted bindings exist.
4. **W33.J4:** Read long local names and coarse date labels by keyboard, with log scrolled up and event category toggled. Show no sealed/future dates. Capture screenshots and receipts at 1366x768. Human taste acceptance remains separate. A loop-only or climate-only fixture proves its slice, not native loop/climate integration.

## W33.W: per-world calendar floor and new angles

Scope: calendar runtime floor only, not full K-part readiness or a canon census. **SHOWN(doc)** pointers below use [W21](W21_READINESS_K19_K34.md), [W25](W25_CLOCKS_AND_AWAY.md) W01-W19 and [consolidated cards](cards/README.md); those owners keep broader readiness. Runtime claims use I rows. All floor proposals/angles are INFERRED; source facts, names and years remain for W34/W35. “Missing” credits no inspected local calendar consumer, even where world prose exists.

| Code/world | Floor today and pointer | Proposed floor, Default + Dial, reason; extra angle |
|---|---|---|
| W33.W01 Harry Potter | Missing source-local calendar; W25.W01, HP card; global I01 is not school binding | Default selected school-era binding, Dial adult/school overlay. Public term dates can be known while personal appointments remain private; leaving school does not change civil dates. |
| W33.W02 D&D | Missing setting calendar; W30.N-DD, D&D card | Default chosen setting/edition content pin, Dial plane/region overlays. A rest duration is a rules clock, not a month name; intercalary festivals must declare weekday advancement. |
| W33.W03 TTKS B1 | Missing; W25.W03, B1 card | Default separate-novel B1 evidence/profile, Dial era. Do not import later-book epochs from shared labels. |
| W33.W04 TTKS B2 | Missing; W25.W03, B2 card | Default separate B2 binding, Dial local cycle names. Long practice retains elapsed and approximate source era independently. |
| W33.W05 TTKS B3 | Missing; W25.W03, B3 card | Default B3-qualified units, Dial known local overlay. Translator vocabulary does not prove equal year length. |
| W33.W06 TTKS B4 | Missing; W25.W03, B4 card | Default B4 anchor precision, Dial school/institution cycle. Scheduled assessment does not certify attendance. |
| W33.W07 TTKS B5 | Missing; W25.W03, B5 card | Default B5 profile revision, Dial dated source alternative. Pack upgrades must not redate B1-B4 histories. |
| W33.W08 Mother of Learning | Partial, forward I05/I09; W30.N-ML | Default preserve visitor date, Dial later selected loop adapter. Distinguish repeat local day, retained actor exposure and iteration-scoped recurrence. |
| W33.W09 Lord of the Mysteries | Missing local calendar runtime; W25.W05, LOTM card | Default sourced era vocabulary when qualified, Dial civil/church overlay. Newspaper occurrence date differs from receipt and a reader's confidence. |
| W33.W10 Circle of Inevitability | Missing; W25.W06, CoI card | Default separate era/continuity binding, Dial explicitly sourced linked anchor. Reusing a calendar family must not reuse another world's current instant. |
| W33.W11 Shadow Slave | Missing; W25.W07, SS card | Default separate selected realm frames, Dial known translation edge. Personal time exposure may diverge from both displayed dates. |
| W33.W12 Reincarnation Paradise | Partial, two synthetic local dates I06/I10; W29 | Default qualified hub elapsed plus child-local view, Dial sourced civil overlays. Mission countdown remains on contract clock and cannot disclose an uncertain local era. |
| W33.W13 Jujutsu Kaisen | Missing; W25.W09, JJK card | Default source-qualified civil-era binding, Dial school overlay. An actor need not know future dated events merely because the formatter can express them. |
| W33.W14 Bleach | Missing; W25.W10, Bleach card | Default locality/realm binding, Dial explicit realm mapping. Dated correspondence needs occurrence and receipt coordinates. |
| W33.W15 Fate | Missing; W25.W11, Fate card | Default scenario/continuity anchor, Dial selected nightly windows. Identical civil dates do not merge different scenario histories. |
| W33.W16 Hunter x Hunter | Missing; W25.W12, HxH card | Default only qualified local anchor, Dial institution schedules. Thin date evidence supports an exam-relative label without inventing a month. |
| W33.W17 Fullmetal Alchemist | Missing; W25.W13, FMA card | Default selected national-era profile, Dial institutional overlay. Birthday/age assertions keep their own precision when the current date is exact. |
| W33.W18 Naruto | Missing; W25.W14, Naruto card | Default local qualified units, Dial mission/institution overlay. Relative appointment dates can work before a full civil calendar is sourced. |
| W33.W19 A Soldier's Life | Missing local calendar; W25.W15, paused runtime | Default documentation only, Dial future duty-cycle binding. Duty exposure and local civil year need separate age accounting; no new runtime gate. |
| W33.W20 Original Frontier | Partial G date/week/moon and service cycles I01-I04/I14 | Default exact legacy binding, Dial original named-month profile marked original. Weekday seed and 360-day biography semantics remain stable across cosmetic changes. |
| W33.W21 Fallout | Deprioritized; no new calendar audit; retain existing content, later qualified local binding only. | No new work proposed for this lane. |
| W33.W22 Skyrim | Deprioritized; no new calendar audit; retain existing content, later qualified local binding only. | No new work proposed for this lane. |
| W33.W23 Elden Ring | Deprioritized; no new calendar audit; retain existing content, later qualified local binding only. | No new work proposed for this lane. |

## More to consider, other stuff

| Code / disposition | Cross-world angle, consequence and proposed default + dial |
|---|---|
| W33.X1 ACT NOW in design | A precision change can leak a truth through a tooltip, sort order, occurrence ID or countdown even when the label is vague. Default public projection omits hidden fields entirely; Dial explicitly authorized foreknowledge view. Include negative disclosure assertions in T3. |
| W33.X2 ACCOUNT FOR NOW | Date-line deduplication is not event deduplication. Default transient header key and durable effect claims remain separate; Dial persistent calendar journal later. This prevents log clearing from reopening a birthday reward or reload from printing old attendance. |
| W33.X3 ACCOUNT FOR NOW | Same date is not same world, source revision or iteration. Default identity includes continuity/instance/revision and optional iteration; Dial explicit linked-anchor mapping. This extends CC16 to branch copies and prevents cross-AU cache/claim collisions. |
| W33.X4 ACCOUNT FOR NOW | A renamed/revised calendar can change old prose if history is reformatted live. Default keep original biography text and its legacy axis; Dial later dual original/translated history display with pinned provenance. Do not regenerate a person's past from the newest pack. |
| W33.X5 ACCOUNT FOR NOW | Midnight need not define every day. Default civil midnight for legacy; Dial sunset/ritual/shift boundary in calendar rules. Daylight, service day and date day can differ without a new clock; recurrence must name which boundary it uses. |
| W33.X6 LATER | Exact date literacy could be learned through public notices, language or imported almanacs. Default plain local date with a safe translation; Dial knowledge-gated vocabulary and social mistakes. Keep it optional rather than a mandatory UI puzzle. |
| W33.X7 LATER | CC14 lens can compare known dates without revealing unknown windows. Default read-only world/instance/profile/precision/clock identity, Dial explicitly authorized lens cheats. Reuse W27 shell; no new store or wall timer. |
| W33.X8 ACCOUNT FOR NOW | KX79 calendar-gated starts must evaluate a selected instance snapshot and known window, not today's computer date. Default pinned start anchor; Dial authored festival-window selection. A failed start should not reserve time or mutate a frozen world. |

Three ranked suggestions, all design proposals:

1. **W33.S1:** Implement one legacy-compatible profile/projector and KX76 header slice behind the existing host seams, then prove T1/T5/T6 and J1-J3 on rebuilt desktop bytes. Keep elapsed, validators and current native gameplay semantics exact. This is the smallest useful visible result.
2. **W33.S2:** Route source-qualified anchors, precision and alternatives from W34/W35 into world content/start owners, beginning with one selected canon-first world. Gate adoption on source locators and old-save compatibility; do not make completing every calendar a prerequisite for S1.
3. **W33.S3:** Join the same CalendarView to W28's pure climate inputs and W27's safe lens after their actual APIs are available. Prove no-season/custom-cycle/loop and split-advance parity independently, then request the relevant host integration scope. No loop law, holiday effect or runtime climate delivery is claimed here.
