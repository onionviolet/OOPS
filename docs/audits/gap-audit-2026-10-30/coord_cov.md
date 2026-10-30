# Coordinator idea coverage (2026-10-30)

Scope note: the extract held 7 coordinator chats, not 10. Cast-lives, GM dispatch handoff, overnight LOTM, L-A successor, "Turn reading shards into gameplay", and two "Book indexing and re-read" chats are present. Sonnet wave planning and General UI improvements are NOT in the extract, so they are uncovered here.

Method: grep of src/, tests/, docs/gm/dispatch checkpoints, plus CHOICES/QUEUE/LEDGER/ideas/IDEA_INDEX, the guide `docs/LEAD_LIFE_GUIDE.md`, `LEAD_LIFE_SYSTEMS_DESIGN.md` (LSD), READINESS_AND_SCOPE.md (C-codes) and READING_GAP_MAP. "TRACKED" means a named owner line exists, even if only as a design-doc proposal. IDEA_INDEX.md and LEDGER.md contain no LSD codes. The guide cites about 190 of the LSD codes, mostly the lead-life ones (26-264), plus 376, 378 and 441. Idea files are grep-checked by code, not read in full.

| # | Coordinator | Idea (<=20 words) | Status | Evidence | Next step |
|---|---|---|---|---|---|
| 1 | Cast-lives | Wake queue so each person has a next-wake time (LSD138) | DONE | `edb88a929`; src wake/nextWake hits (3 files), 2 tests | none |
| 2 | Cast-lives | Seeded chance via existing helpers, keyed by life/day/subject | PARTIAL | `seeded_streams`/`hash_rng` used in 43 src files; P1 `src/check_keys.js` (`dcc31f237`) has "no consumer yet" | wire a P1 consumer; two-run identity test is in B1/D1 (D1 reproduces identically) |
| 3 | Cast-lives | Canon-constraint store, conditioned draws, refuse spending later-canon items (D1) | DONE | D1 committed, 199 constraints; money/item/fight holds tested on made-up data only | build money/item/fight data in the pack |
| 4 | Cast-lives | Lead's workroom/supervisor tagged by date (CO6) | TRACKED-NOT-DONE | COORDINATOR_HANDOFF CO6 "ACCOUNT FOR NOW: B1 or C1 follow-up" | confirm B1 round 4 covered it (not verified) |
| 5 | Cast-lives | SZ4 load pack by chapter window | TRACKED-NOT-DONE | handoff SZ4 LATER (Luna medium after B1); no src hit | brief the lane |
| 6 | Cast-lives | SZ5 merge stage stops copying 400 MB | DONE | T1 brief + checkpoint | none |
| 7 | Cast-lives | MD2 group the 20+ ports `configureLotm` takes from `main.js` | TRACKED-NOT-DONE | handoff MD2 row; no src hit | include in a refactor lane |
| 8 | Cast-lives | Merge all row kinds, not just people (M2) | DONE | `96be7cb18` | none |
| 9 | Cast-lives | Local models: narrow census lane only; routine-time pilot (LA1-LA8) | PARTIAL | `2fd71528f`; CHOICES #3 holds the 3-shard routine pilot | answer CHOICES #3 |
| 10 | Cast-lives | Timing as order and windows, not hours (LSD156-LSD164) | TRACKED-NOT-DONE | design sec 18, guide cites 156/161/164; folded into November plans per handoff | apply in reader prompts when regenerated |
| 11 | Cast-lives | Details created on look, plain gap-fill, backwards canon (LSD126-LSD137) | TRACKED-NOT-DONE | design sec 16; LSD131 only in design doc, LSD134 in 3 dispatch docs | none until D1 consumers exist |
| 12 | Cast-lives | Volumes chain: vol N ending checked vs vol N+1 opening (LSD150) | TRACKED-NOT-DONE | design doc only | add to M3/M4 follow-up |
| 13 | Cast-lives | Many-worlds plan MW1-MW8 | TRACKED-NOT-DONE | COORDINATOR_HANDOFF (MW codes in 41 dispatch files) | other-book wave |
| 14 | Cast-lives | Refactor rule AD45 (everything built can be replaced) | DONE | rules index AD45 | none |
| 15 | Cast-lives | One resolution frame: untaken options show "Not how it happened" | DONE (inferred) | B1 round 2/3 reports; seat-only | none |
| 16 | Cast-lives | "As the lead would" button plays next step or whole fight (LSD93) | TRACKED-NOT-DONE | design doc LSD93 only; 0 src hits | schedule after P4 fight floor |
| 17 | Cast-lives | Book's next move marked in options list, off by default (spoilers), his later call | TRACKED-NOT-DONE | design LSD93/LSD116 wording only | add to CHOICES backlog |
| 18 | Cast-lives | Flashbacks as memory facts; date-bind fix; "remember" action | TRACKED-NOT-DONE | design doc (flashback in dispatch docs); no src | pack day-binding fix |
| 19 | Cast-lives | Fight data rows over one runner (F1), tempo clock, waiting fights (P4) | DONE | `0e6dd6928`, P4 floor for road-rival route, 9 tests | P5-P8 pending |
| 20 | Cast-lives | Allies fight from own goals and policies, never need control (LSD318, P5) | TRACKED-NOT-DONE | CHOICES #7, guide P5 "not started" | start P5 |
| 21 | Cast-lives | Experience changes ally fighting (LSD332, marked Later) | TRACKED-NOT-DONE | design doc only | none |
| 22 | Cast-lives | Run fights across many seeds; compare to book rates (LSD350) | TRACKED-NOT-DONE | design doc only; guide P8 "calibration" | P8 |
| 23 | Cast-lives | Memory records, effects, traits, severity/loyalty/silence (P2-P3c) | DONE | `b626a8c2c`, `653776593`, `432afe7b1`, `a25844ea`; src `person_silence.js` | none |
| 24 | Cast-lives | Memories can be wrong; faint episodes fold (LSD355, LSD360) | TRACKED-NOT-DONE | design doc only | memory later round |
| 25 | Cast-lives | Adjustable memory limits table (LSD441) | DONE (inferred) | `c8c5dcad2`; memlimits hits in 5 src files | none |
| 26 | Cast-lives | Bystanders become real only when they matter (crowd, P6) | DONE | `src/crowd.js`, MR5_CHECKPOINT; fight hook `P6_FIGHT_HOOK.patch` not applied | apply hook |
| 27 | Cast-lives | Cheap schedule-level lives for most people, 30-50 inner lives | TRACKED-NOT-DONE | design sec 16 | none |
| 28 | Cast-lives | Drop the cast "second engine" idea; adjust existing | DONE | design sec 14 | none |
| 29 | Handoff | Interference marks only touched facts contested; D2 resolves later | TRACKED-NOT-DONE | handoff D2 lane, design sec 15 | later |
| 30 | GM handoff | Rereads dropped ~13% rows; M2 union | DONE | `96be7cb18` | none |
| 31 | GM handoff | Schema 1.4 (four gap types) plus unused 1.5 fields undecided (`target`, `using`, `habit`, `results`, `witnesses`) | TRACKED-NOT-DONE | guide sec 3.2; "keep or drop" deferred by him | decide keep/drop |
| 32 | GM handoff | Reaction type recorded on reactions (CL56, schema 1.5 shape; keyword classifier places ~40%) | TRACKED-NOT-DONE | CL56 in 7 dispatch docs | CL112 follow-up |
| 33 | GM handoff | November book order by gaps per dollar (Perfect Run... TTKS); Re:Zero registration, Tensura text | TRACKED-NOT-DONE | READING_GAP_MAP, READINESS_AND_SCOPE, LIBRARY_INDEX | send on Nov 1 |
| 34 | GM handoff | Two medium runs merged vs one high (C28); local as second reader (C44/C46) | DONE | C28r, C44, C46 in READINESS | none |
| 35 | GM handoff | Sonnet re-judges touched/option class/needs (C31); test 3-5 shards ~$0.30 | TRACKED-NOT-DONE | READINESS C31 | run pilot in November |
| 36 | GM handoff | Halve caps for single-chapter shards (C35) | TRACKED-NOT-DONE | READINESS C35 | apply to Nov plans |
| 37 | GM handoff | Cloud "touch-up" census: model returns only missing/wrong rows | PARTIAL | `scripts/lead_run/touchup_pilot.mjs`; READINESS round 15 | small Nov pilot |
| 38 | GM handoff | Name merging as review proposals, not auto-applied | DONE (inferred) | merge fix + 101 tests, handoff | none |
| 39 | GM handoff | Local overnight driver; COI then RI vol 5+ overnight queue | DONE | `c7787ff6a`; LOCAL_OVERNIGHT_HANDOFF | runs on |
| 40 | GM handoff | Gap map: 21 game gaps + 9 pipeline gaps | DONE | `4f9e4a47d` | none |
| 41 | GM handoff | Free paid data now: MoL schedules, price lists from texture rows | TRACKED-NOT-DONE | gap map; only LOTM v1 merged for gameplay | run `merge_shards.mjs` for MoL/HP/SS |
| 42 | Overnight | Replay as fidelity scoreboard; no generic "do this scene" controls | DONE | handoff log, A_CHECKPOINT | none |
| 43 | Overnight | Whole-book gap census ranks mechanism lanes (X4) | DONE | `7955f4370` | none |
| 44 | Overnight | Eight lanes for remaining verbs; O2 audit of brew/ritual/craft depth | PARTIAL | adapters integrated (handoff 13:40 entry); QUEUE family owners (sw-rites) | none open |
| 45 | Overnight | Divination 0/150 rows, exchange 0/100, ability 2/100 need deeper mechanisms | PARTIAL | divination: L4/sw-rites rows + sw-wire intake; ability: sw-adv ideas; **exchange: only in handoff log** | see dropped D1 |
| 46 | Overnight | Self-journey (origin equals destination) blocks save | DONE | `src/cast_journeys.js:18` gate; T2 | none |
| 47 | Overnight | ~1/3 of replay "gap" steps are not lead actions (inflated denominator) | PARTIAL | RV2 note; tagging bar missed (corrected in guide) | review ranker `700a8f115` |
| 48 | Overnight | Two commits carry a `Co-Authored-By` trailer (`903621061`, `7955f4370`) | TRACKED-NOT-DONE | handoff only; `7955f437` still has the trailer, not rewritten | decide: leave (history) |
| 49 | L-A | 91 of 157 ch 1-24 cards unbound; Klein's day missing routine slots after ch 30 | TRACKED-NOT-DONE | CHOICES #3; A_CHECKPOINT | answer #3 |
| 50 | L-A | Place mapping for 241 free-text strings (A3); timing gap 854 of 1,319 rows | TRACKED-NOT-DONE | ideas/sw-absorb.md; A3/A4 briefs | run lanes |
| 51 | L-A | Later-volume shapes: city travel, seasonal cycles, irregular timing | TRACKED-NOT-DONE | ideas/sw-absorb.md V2-8 | Sol on `build_cast_pack.mjs` |
| 52 | L-A | Opening hours as `roleHours` per role | TRACKED-NOT-DONE | sw-absorb intake [folded QR6a] | small lane |
| 53 | L-A | Slices landed unwired (L4, L8, L9, L10, L11, L13, L14); wire via sw-wire | TRACKED-NOT-DONE | CHOICES #1, WIRING_HANDOFF | floor wave, divination first |
| 54 | L-A | Scripted Chrome floor at 1920x1080; browser floor pending under load | PARTIAL | `slot_run.mjs` exists (5 sw docs, 1 test); T2/TH2 "implemented, below floor" | run the floor |
| 55 | L-A | Divination fact supplier (`actor.lotm.div.*`); object contacts have no grant | TRACKED-NOT-DONE | CHOICES #1, sw-wire intake, QR6d | build supplier |
| 56 | L-A | Sheets: `openGates` never fed by host | TRACKED-NOT-DONE | sw-wire intake | route owner |
| 57 | L-A | News path data-empty in ch 1-24 (no lead-visible events) | TRACKED-NOT-DONE | sw-wire intake | data only |
| 58 | L-A | Harm counter saved outside expansion transaction | TRACKED-NOT-DONE | sw-wire intake LATER | fold into persist plan |
| 59 | L-A | Divination/ability strain weights are proposals to retune | TRACKED-NOT-DONE | sw-wire intake `LOTM_ACCRUAL` | retune after play |
| 60 | Turn shards | Lead-first standing goal (AD44) | DONE | `bcdf0615d` | none |
| 61 | Turn shards | Ten efficiency proposals (CL272-CL281); replay as only backlog; two lanes busy | PARTIAL | guide; runner exists | none |
| 62 | Turn shards | Causal mass (CL21), usability audit (CL57), "what next" mining (CL61) | PARTIAL | CL57 -> L1 usability report done; CL21/CL61 tracked in plan docs | CL61 mining lane |
| 63 | Turn shards | Scene-UI rules SUI1-19, CLR, RPT1-12 | DONE | accepted ("Sure", `46701f0ca`); src `ui` hits | none |
| 64 | Turn shards | 7 seat-only gaps wait for WER11 wording | TRACKED-NOT-DONE | CL226 | WER11 decision |
| 65 | Turn shards | Polish: "Tingen workroom" header in resident flat; long Places list | DONE | `book_world_lotm_ui.js` title is `v.at` for residents; district disclosure | none |
| 66 | Book indexing | Canon pull per fact, fate and butterfly (LSD233-LSD245) | TRACKED-NOT-DONE | design sec 24; `pull` input absent in src | shared joins (guide step 4) |
| 67 | Book indexing | `pull` default 1 on resolver, shared non-lead fixture, recovery helper, beat checkpoints | TRACKED-NOT-DONE | guide sec 5 (LSD256) | Luna lane |
| 68 | Book indexing | Canon-event cards by script; threads (LSD257-LSD264) | PARTIAL | `e12904f2b`, `eae2c7a46`; CR1 `src/cast_card_runtime.js`; CR2 patch `b830cebe6` not applied | apply CR2, browser check |
| 69 | Book indexing | Card keeps id as control (LSD268), effects apply once (LSD269), index by window (LSD272) | TRACKED-NOT-DONE | design sec 27; CR2 resume option | verify in CR2 |
| 70 | Book indexing | Run diff after every pipeline run (LSD273); one-representation lint (LSD267) | TRACKED-NOT-DONE | design doc only; 1 src hit for "run diff" | add to pipeline |
| 71 | Book indexing | Infer the 58 missing outcomes from next-scene change, labelled inferred (LSD274) | TRACKED-NOT-DONE | design doc only | review queue |
| 72 | Book indexing | Overrides file keyed by step id so reruns keep review fixes | TRACKED-NOT-DONE | guide pipeline notes | build |
| 73 | Book indexing | Code-per-covered-step meter (LSD165); plan by volume (LSD170) | TRACKED-NOT-DONE | guide cites both; no script | add to meter |
| 74 | Book indexing | Morning list of open questions (LSD189) | DONE (inferred) | CHOICES.md exists | none |
| 75 | Book indexing | Each mechanism lane also enables one choice beyond canon (LSD213) | TRACKED-NOT-DONE | guide | enforce in briefs |
| 76 | Book indexing | Locked-fact lists per canon fight (LSD219); variance by dependence (LSD235) | TRACKED-NOT-DONE | design doc only | D1 extension |
| 77 | Book indexing | Failure path per system (LSD227) | TRACKED-NOT-DONE | guide "Failure path" row; no shared kit | per system |
| 78 | Book indexing | Fine-tune a local reader; keep rows tune-ready (LSD231/232) | TRACKED-NOT-DONE | design doc only | none |
| 79 | Book indexing | Tempo clock, speed strip, waits forever (LSD281, 307, 314, 315) | DONE | `src/tempo_fight*.js`, 3 tests | none |
| 80 | Book indexing | Shared lists open both ways, back-port as revision (LSD305/306) | TRACKED-NOT-DONE | design doc only | none |
| 81 | Book indexing | 14 GM techniques; story-flow lines deferred (LSD379-LSD392) | TRACKED-NOT-DONE | marked deferred in doc | none |
| 82 | Book indexing | Chance sites: tail, face recognition, morale, wound spot, rumour spread | TRACKED-NOT-DONE | P1 fit map, 38 of 53 served | fill 15 gaps |
| 83 | Book indexing | Background work in daily batches with budget | TRACKED-NOT-DONE | design doc only | none |
| 84 | Book indexing | Village people have no traits; authored temperament as proposal | DONE (inferred) | MR3 `432afe7b1` | none |

## Dropped and untracked (main deliverable)

Almost every idea reached an owner line, so this list is short. Items marked "log only" sit in a chat handoff or session log but in no queue, ledger, idea file or index.

- **D1. Exchange adapter has no follow-up.** The overnight coordinator reported exchange as 0 of 100 reviewed steps becoming rows and needing a deeper mechanism, then listed an exchange adapter as integrated. Neither sonnet-wave QUEUE, LEDGER, CHOICES nor any `ideas/` file mentions "exchange" as an open gap. Only the handoff log does (log only, inferred from grep). Next: add a LATER line in `ideas/sw-rites.md` or `sw-road.md`, or an owner in QUEUE.
- **D2. No-spoiler toggle for the book's next move.** LSD93 says the marker stays off by default and is "your later call", but no CHOICES or backlog row asks for it (inferred). Next: one CHOICES backlog line with default off.
- **D3. Two stray Co-Authored-By trailers** (`903621061`, `7955f437`) are flagged only in the handoff log. Next: decide, one line, whether history stays as is.
- **D4. Fix verification for CO6 (workroom/supervisor dated, not seat-fixed).** Tracked as "B1 or C1 follow-up"; no later checkpoint confirms it landed (not verified). Next: grep the B1 round 4 checkpoint.
- **D5. Data we already own but never merged.** MoL, HP and Shadow Slave need `merge_shards.mjs` before schedules/price lists can be built. Not in QUEUE or LEDGER, only the gap-map session (inferred; they are free). Next: one local lane.
- **D6. Coverage hole in the extract.** Sonnet wave planning and General UI improvements were not in the input, so their dropped ideas are unknown. Next: re-run the extract for those two chats.
- **D7. Design-doc-only proposals with no queue row.** These exist only in `LEAD_LIFE_SYSTEMS_DESIGN.md` and are not in the guide, QUEUE, LEDGER or CHOICES: LSD150 (volume chaining), LSD131/LSD134 (create-on-look, backward canon), LSD274, LSD281-era shared list rules (LSD305/306), LSD332, LSD355/360. They are tracked as proposals only, so treat them as dormant, not dropped.

## UI and intuitiveness ideas

- Be-the-lead start: "Be [the lead]" then "Start this new life", with header "Day 1, night · canon run" (done in B1; seat-only).
- Locked options show "Not how it happened" instead of vanishing (done, canon run).
- Plans shown as his intentions, never the book's future (LSD116, design).
- Reports at witness level: present sees it, affected sees the effect, late arrival sees aftermath, heard news marked "Word at the market" (RPT2, accepted; first line shows in Reports).
- Scene card closes with what comes next that you know of plus travel time (SUI13-SUI16, accepted).
- A next step is findable from the current screen; either the route or what is missing is shown (SUI18, CL163; accepted).
- Open matters journal at his knowledge level, "rent due on the 3rd" (LSD264, TRACKED).
- Refusal names the thread needing the item ("you need this for the rent") (LSD261, TRACKED).
- Fight steps as prose with decisions plus a "who acts next" strip of 2-3 names (LSD314, TRACKED; P4 partly built).
- "As the lead would" button for tactics-averse play and away time (LSD93, TRACKED-NOT-DONE).
- Reaction line names its cause and fades ("Wary of you since you shoved him at the well") (P3, DONE for the craftsman).
- Panel churn: LOTM panel rebuilds its walk list every game minute, so clicks land on replaced buttons and hidden duplicates exist (CO2; DONE in workshop clutter fix `d5f48d5f6`/`5b9a449bb`, LOTM panel itself unverified).
- District grouping with collapsible Places lists (done, L4e).
- Ghost fill on the ability ladder, "after this: 3 of 6" (CHOICES #2; TRACKED, only one src hit).
- UI look rules P1-P16 and figure gallery (CHOICES #4; awaiting him).
- Upcoming strip from curfews and anchored events (sw-bridge, TRACKED); gatherings bridge must not name a seat's body (G14, TRACKED).
- Old workshop freeze: page responds in 0-1 ms (done, `5b9a449bb`).
