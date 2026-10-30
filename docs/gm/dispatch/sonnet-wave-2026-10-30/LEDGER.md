# LOTM volume 1 absorption ledger (2026-10-30)

Lane L2 of the [Sonnet wave](PLAN.md). Ids and counts only; no book prose. Gap codes are GM1-GM19 from the [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md). Rank order is a proposal for the integrator, not an accepted decision.

**Reproduce:** `node scripts/lead_run/coverage_ledger.mjs --out docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/coverage_ledger.json` (about 1 second; the JSON with full missing lists stays private). Test: `node --test tests/lead_run_coverage.test.js` (3 pass). Script drafted by Codex `gpt-6.1-sol` medium (lane `sw-l2-script`, Codex 27% at launch), then reviewed and fixed by me: scene beat ids (`lr.lotm.main.N`) never matched the id regex, so dated scenes read as all missing; now matched by a beat pattern and covered in the test.

## What "consumed" means (read before trusting a percentage)

Input: the `m4-whole-book-2026-10-29` merge filtered to volume 1 shards (not `lotm[2-8]c…`): 5,450 extras rows, 637 scenes, plus registry entities whose shards include volume 1. Game corpus: `private_packs/lotm-cast/cast.json`, `private_packs/lotm-ingredients/ingredients.json`, `src/book_world_lotm_*.js`, `src/lotm_formula_rows.js`, `src/cast_schedule.js`.

A row is **consumed** if its whole id token, or its volume 1 locator (`zh 第N章 pM`), appears in that corpus. This is a paragraph-level proxy:

- A locator hit means the game cites that paragraph, not that every field of the row is used. It over-counts partly used rows.
- Id matching under-counts where the game keeps its own ids (`lotm.cast.*` hashes, pence constants). **Prices read 0% for this reason**: the registry's `lotm.price.*` ids are quantities, and the game stores prices under its own pence ids. Treat the price count as "not traceable", not "absent".
- **Not measured:** scene steps (step-tags 16,679 and the enrich sidecar's 1,768 steps) and the `knows`/`reacts`/`wants`/`relations` fields of people rows. Their game use is unknown here, so GM2 and GM3 are ranked from `people_other` only.

## Coverage by kind

| Kind | Total | Consumed | % | Missing |
| --- | ---: | ---: | ---: | ---: |
| people (registry) | 270 | 270 | 100.0 | 0 |
| places and organizations (registry) | 438 | 315 | 71.9 | 123 |
| routines (person × slot locator) | 1,852 | 394 | 21.3 | 1,458 |
| services | 194 | 42 | 21.6 | 152 (97 of 194 carry a stated price) |
| prices (registry ids) | 430 | 0 | 0.0 | 430 (untraceable, see above) |
| opening hours (place rows with hours) | 171 | 49 | 28.7 | 122 |
| dated events: news rows | 178 | 21 | 11.8 | 157 |
| dated events: dated scenes | 580 | 242 | 41.7 | 338 |
| dated events, combined | 758 | 263 | 34.7 | 495 |
| customs rows | 196 | 20 | 10.2 | 176 |
| people_other rows | 131 | 9 | 6.9 | 122 |
| rules.ability | 363 | 31 | 8.5 | 332 |
| rules.craft | 103 | 16 | 15.5 | 87 |
| rules.custom | 335 | 61 | 18.2 | 274 |
| rules.institution | 201 | 48 | 23.9 | 153 |
| rules.law | 154 | 28 | 18.2 | 126 |
| rules.potion | 147 | 15 | 10.2 | 132 |
| rules.rite | 245 | 54 | 22.0 | 191 |
| rules.spell | 27 | 1 | 3.7 | 26 |
| rules.other | 134 | 17 | 12.7 | 117 |
| rules.reset | 2 | 1 | 50.0 | 1 |

(The script prints the combined dated-events row; the news/scene split is derived: news 178 rows with 21 consumed before the beat fix, so scenes are 758-178 = 580 with 242 consumed.)

**Shape of the gap.** People are fully indexed, but the cast pack is thin past the opening. Of 1,458 missing routine slots, 52 sit in chapters 1-30 and 1,406 in chapters 31-213 (208 / 334 / 397 / 467 by band 31-60 / 61-100 / 101-150 / 151-213). Of Klein's 324 slots, 276 are missing (17 in ch 1-30). Of 123 missing places, 71 are in ch 1-30: the early world has its people but not its big organizations.

## Ranked top 20 missing items

Rank = how much the item would change the lead's playable day (what he can do, where, when, for how much), then how many rows it unlocks.

| # | Missing item (ids / counts) | Gap | Why it ranks here |
| --- | --- | --- | --- |
| 1 | `lotm.person.klein-moretti` routine slots: 276 missing of 324 (46 in ch 31-60, 60 in 61-100, 104 in 101-150, 97 in 151-213) | GM1 | The lead's own day after the first month has no sourced anchors. |
| 2 | Routines of the Nighthawk team and household: `dunn-smith` 126, `leonard-mitchell` 66, `benson` 54, `melissa` 47, `old-neil` 46, `audrey-hall` 45, `luo-shan` 40, `frye` 31 | GM1 | Who is where at what hour decides every colleague/family encounter. |
| 3 | Services: 152 of 194 uncovered (32 in ch 1-60); 97 carry a stated price | GM19, GM4 | Direct "do X at place Y for Z" actions. |
| 4 | Opening hours: 122 uncovered (`lotm.organization.black-thorn-security` has 5 rows, plus home and bathroom places) | GM5 | Without hours, services and visits have no out-of-hours refusal. |
| 5 | Organization places: `church` (501 rows), `storm-church` 312, `night-church` 276, `tarot-council` 261, `police` 160, `steam-church` 159, `messengers` 147, `aurora-order` 129, `sentinels` 111, `rose-school` 89 | GM19, GM6 | The big institutions the lead visits are not place nodes yet. |
| 6 | Institution rules: 153 uncovered (`night-watch-probation`, `night-watch-duty`, `public-tram-fare`, `police-forwards-unofficial-cases`, `sealed-object-request`, `deville-borrowing`, `asylum-watch`) | GM6, GM13 | Duty, fares, access and borrowing shape the daily loop. |
| 7 | Prices: 430 registry price ids not traceable (`copper-penny`, `half-penny-coin`, `amt-1-soli`, `pound-note`, `weekly-total`, `cash-on-hand`, `several-hundred-pounds`) | GM4 | Needs a translation to the pence ids before it can be counted at all. |
| 8 | Potion rules: 132 uncovered (`lotm.potion.calm`, `clown`, `clown-brew`, `amanda-distillate`, three `lotm.item.*-potion` duplicates) | GM17 | Progression path; many rows are duplicates to fold into the formula table. |
| 9 | Rite rules: 191 uncovered (`altar-dream-divination`, `altar-search-divination`, `altar-statue-rite`, `cane-dowsing`, `copper-whistle-summon`, `copper-whistle-messenger`) | GM17 | Divination and summons are the lead's core problem-solving verbs. |
| 10 | Dated events: 495 uncovered (338 dated scenes, rest news; 17 in ch 1-30, 19 / 27 / 38 / 56 by later band) | GM18 | Calendar and news make the world move without the lead. |
| 11 | Law rules: 126 uncovered (`all-weapons-permit`, `sealed-grade`, `armory-requisition`, `expense-approval`, `poor-law`, `port-detention-survivors`, `mirror-divination-control`) | GM14 | Permits and requisitions gate weapons and sealed items. |
| 12 | Craft rules: 87 uncovered (`coin-divination`, `dream-divination`, `birth-chart`, `child-locating`, `covert-entry-search`, `diary-expression`) | GM8, GM17 | Practicable skills the lead can learn and use. |
| 13 | Custom rules: 274 rule rows plus 176 customs extras uncovered (`buffet-dinner`, `detective-payment-receipt`, `coin-toss`, `clerical-retreat`, `burial-rite`, `dog-pit-rat-betting`) | GM6, GM2 | Etiquette and payment habits, mostly texture; cheap once place and hours exist. |
| 14 | Ability rules: 332 uncovered (`black-flame`, `cane-locate`, `calm-by-imagining`, `clown-agility`, `audience-sequence`) | GM16 | Costs are thin in the source (3-10% filled), so check the cited paragraph first. |
| 15 | people_other: 122 uncovered (statuses and incidents about named people) | GM2, GM3 | Basis for attitudes and who-knows-what; needs a typed pass before use. |
| 16 | Routines of the second circle: `elizabeth` 21, `royale-reideen` 18, `angelica-barrehart` 16, `derrick-berg` 16, `seeka-tron` 16, `susie-dog` 16, `hanass-vincent` 15, `selena-wood` 15 | GM1, GM21 | Fills the city once the first two groups exist. |
| 17 | Spell rules: 26 uncovered (`black-flame`, `slumber-charm`, `crimson-activation`, `negan-hermes-words`) | GM8 | Small set, clear learn-and-cast slice. |
| 18 | `rules.other` 117 (`revolver-usage`, `hunter-bullet-firing`, `sealed-3-o271-mirror-effect`, `antigonus-notebook-writing`, `altar-cold-field`) | GM16 | Item handling for danger scenes. |
| 19 | `lotm.rule.dream-loop-reset` (1 row, ch 134) | GM11 | One row, large consequence for any dream-loop scene; verify against the paragraph. |
| 20 | Remaining unlisted routine slots for ~60 other people (about 400 slots) | GM1 | Long tail; only after items 1-3. |

## Suggested order for the integrator

Items 1-4 are one chain (schedule, service, hours) over the same locators and need no new reading: pull the missing routine, service and hours rows for ch 31-100 first, then place nodes for item 5. Items 8-9, 12 and 17 can go to a recipe/rite slice (GM17, GM8) cited through `cite_paragraphs.mjs`. Item 10 needs the PG5 date-anchor step (only 7 of 316 early scenes had a calendar date) before it is worth building.

## Grade-C scene set-aside (free script, no model call)

Applied by the existing untracked `scripts/lead_run/setaside_lint.mjs` (another session wrote and ran it at 00:49-00:50 on 10-30, before I started; I did not re-run it, to avoid a double write on a live file). I re-linted all 10 shards with `lint_lead_run.mjs` (without the shard text, so `zh-not-at-locator` was not re-checked).

| Shard | Lint now | Rows set aside |
| --- | --- | ---: |
| b4s42 | clean | 0 (scenes repaired only) |
| b4s44 | clean | 5 |
| b4s48 | clean | 1 |
| b5s50 | clean | 1 |
| b5s52 | clean | 1 |
| b5s59 | clean | 1 |
| b6s63 | clean | 1 |
| b6s67 | clean | 0 (scenes or note repairs only) |
| b6s68 | clean | 1 |
| b7s70 | clean | 0 (scenes repaired only) |
| **Total** | 10 of 10 clean | **11 rows set aside** |

Census row counts before and after: b4s48 96 to 95, b5s50 123 to 122, b5s52 113 to 112, b6s63 107 to 106, b6s68 135 to 134; the other five unchanged. For b4s44 the 5 set-aside rows were written before the `pre-setaside` backup was taken, so its before-count (145) is already post-change. Backups: `lead-run-2026-10-27/pre-setaside/`; set-aside rows: `*_setaside.jsonl` beside them. The 10 shards still need the whole-book merge to be re-run before the merged files reflect the repairs.

## Whole-book gaps pass (L7, 2026-10-30)

Owner: lane L7 (`local_e9811a9a` side session). Output: [gap map sections 2b and 2c](../../../research/READING_GAP_MAP_2026-10-28.md), rows GM22-GM40 (GM20 and GM21 already existed there, so numbering starts at GM22). Ids and counts only; family answers live in gitignored `private/wb-families*/` folders.

| Step | Result |
| --- | --- |
| `coverage_ledger.mjs --volumes all` (written by Sonnet, not Sol: about 40 lines, quicker than a brief) | Per-volume counts by extra, rule kind and registry kind, plus ids new in each volume. Volume 1 default output unchanged. `tests/lead_run_coverage.test.js`: 4 pass. |
| `family_pass.mjs prep` / `tally` (new, free) | One TSV of unique rule ids per volume or half; tally joins Luna answers and reports missing, malformed and duplicate lines. |
| LOTM families, 8 Luna lanes (`sw-l7-lotm-v1..v8`, gpt-6-luna medium) | 14 files, 8,663 id-volume pairs (7,976 unique ids), all classified, 0 missing, 0 malformed. No NEW slugs used. |
| Other books merged (`merge_shards.mjs --include-batch`; the default skips batch-route shards and yields 0 rows) | MoL 106 shards, HP 179, Shadow Slave 377, plus Godclads 90, Perfect Run 83, Reverend Insanity 143, Circle of Inevitability 28, A Soldier's Life 175. |
| Other books' families, 8 Luna lanes | MoL 1,063 ids, HP 1,332, SS 2,806, GC 728, PR 709, RI 1,607, COI 232, ASL 1,822; all classified, 0 missing, 0 malformed. Model confirmed gpt-6-luna in the lane record (checked on the Shadow Slave lane). |
| Not done | Worm, Super Supportive, Wish Upon the Stars, You Are Summoned have no sharded lead-run (0 headers), so they are not in the table. Texture and `rules_other` rows were not classified by Luna (28,987 LOTM texture rows); a keyword count over texture gave upper bounds only and is not in the register. Family labels against `src/` are file-name and grep checks, not a code read. |

Known classifier drift: potion ids went to ADV in volume 1 and MAK in volume 6; volume 2 has no creature ids. Merge ADV, MAK and ACT before reading trends. Reproduce: `node scripts/lead_run/family_pass.mjs prep --merged <merged> --out <private dir> --by lotm`, launch Luna lanes with a brief per file, then `tally --in <private dir>`.

## L14 calendar and news (2026-10-30)

| Slice | Result | Check | Meter |
| --- | --- | --- | --- |
| Design note | `L14_CALENDAR_DESIGN.md`: whole-source sample (v1-v8, MoL, HP), event record, reader API, bindings | none (doc) | Codex 29% |
| 1: `src/world_events.js` | Day-indexed record, `happenedOn`/`knownTo`/`learnedBetween`/`newsOn`, anchors, bound ordinals, curfews; written on Sonnet (about 90 lines) | `node --test tests/world_events.test.js`: 7 pass | Codex 29% |
| 2: LOTM v1 events as private data | Luna `sw-l14-news` classified 240 news rows (129 private facts kept off the calendar, 48 public, 36 disaster, 17 notice, 10 beat; 1 anchored, 129 ordinal, 110 unplaced). Sol `sw-l14-loader` wrote `world_events_build.mjs` and `world_events_pack.js`. Builder output: 427 events (326 beats from 170 scene frames, 147 anchored), 129 private facts, 0 left out; real pack loads. Frames are independent: the host binds each frame root to a day | `node --test tests/world_events_pack.test.js`: 3 pass; models confirmed in lane.json | Codex 29% before launch |
| 3: knowledge adapter | `src/world_events_knowledge.js` (`eventKnowledgeWrites`): learned news to the beat_knowledge write shape, no fork of the owners | `node --test tests/world_events_knowledge.test.js`: 2 pass | Codex 29% |
| 4: LOTM volumes 2-8 events | Luna lanes `sw-l14-news-v2a..v8` (11 files, gpt-6-luna medium) classified 4,597 rows, ids matched 1:1. `buildLaterPack` places rows by chapter (`lotm.v<N>.ch<chapter>`). Calendar events per volume 2-8: 709, 691, 313, 245, 213, 201, 85; private facts 381, 310, 496, 546, 212, 135, 60. Most rows are unplaced (dormant) by Luna's conservative placement | `node --test tests/world_events_pack.test.js`: 4 pass; builder `--later` run on real inputs exits 0 | Codex 29% |
| Improvement pass (slices 1-4) | Luna model confirmed for all 11 later lanes; 13-event spot-check plus counts over 2,568 rows found 6 defect classes (private leak, named-without-carrier, unwitnessable witnessed rows, later-volume bindings, curfew kind, dead fields); all fixed in one commit | `node --test` on the three world_events test files: 16 pass; builder re-run on real inputs exits 0 | Codex 29% |
| GM35 deepening | Second-hand spread (carrier must learn first, chains, loop guard) and `whoKnows`; design note updated | `node --test` on the three world_events files: 17 pass | Codex 29% |
| GM38 restrictions | `restrictionsOn` and `openUnder` (curfew, closure, travel_halt shaped to region_kit and travel_legs fields); Luna `sw-l14-restrict` (gpt-6-luna, model in lane.json) classified 155 placed city-scale rows, 11 with effects (4 closures, 4 region curfews, 2 halts, 1 curfew with hours); text-only scopes load as `unmapped` notices. Scenes the lead is absent from (25 of 316 merged scenes) now carry `present` and happen without the lead | `node --test` on the three world_events files: 20 pass; builder re-run on real inputs exits 0 | Codex 30% |

## Round 3: Codex bulk lanes (2026-10-30 ~09:55)

Weibao via the overnight supervisor: "MOre codex readings or more things codex can do? Send out and finish the other sonnet works too". The owning Sonnet lanes are idle, so each family's file area below passes to its Codex lane for this round. Briefs are in [codex-r3/](codex-r3/). Each Sol lane does the prep, and where the work is bulk it writes Luna briefs that the coordinator launches. Before anything is folded in, the coordinator spot-checks 15 rows per family. floor-wire is the only writer of the LOTM host files. Launch stops: Codex at 85%, Claude weekly at 90% (raised from 72% by Weibao, 2026-10-30). Codex was at 35% when these launched.

| Lane | Brief | Takes over from | Owned area | State |
| --- | --- | --- | --- | --- |
| `sw-r3-c1-l10` | C1: inferred ability costs (CHOICES 2), then slug clustering | sw-adv (L10) | `src/ability_cost_infer.js`, its test, `codex-r3/c1/`, private `l10/cost-infer/`, `l10/slug-cluster/` | launched, Sol medium |
| `sw-r3-c2-routine` | C2: 91 unbound cards, Klein slots after chapter 30 (CHOICES 3) | sw-absorb data line | `codex-r3/c2/`, private `routine-r3/` | launched, Sol medium |
| `sw-r3-c3-price` | C3: price ids to pence ids (L2 item 7) | L2 | `src/lotm_price_map.js`, its test, price count in `coverage_ledger.mjs` and its test, `codex-r3/c3/` | launched, Sol medium |
| `sw-r3-c4-rites` | C4: rites and crafts for volumes 4-8, volume 2 leftovers, GM33 artifacts | sw-rites (L4) | `codex-r3/c4/`, private `l4/v4plus/` | launched, Sol medium (prep) |
| `sw-r3-c5-texture` | C5: classify texture rows | L7 | `codex-r3/c5/`, private `wb-families-texture/` | launched, Sol medium (prep) |
| `sw-r3-c6-chars` | C6: Luen and Groselle thin sheets | sw-chars (L8) | the two private sheets, `codex-r3/c6/` | launched, Sol medium |

L14 needs no lane this round: volumes 2-8 of news and calendar are already done (see the L14 section above).

### Round 3 returns (2026-10-30 ~10:40, `043869b2`)

| Lane | Result | Check |
| --- | --- | --- |
| C1 | `inferAbilityCost` is a pure proposal function. 3,311 of 3,417 merged ability occurrences state no cost: 936 get qualitative proposals and 2,375 keep a reason, mostly an unknown rung or mechanism. Stated costs are untouched. The 1,575 condition and blocker slugs are split into 7 Luna slices of 225 each. | `node --test tests/ability_cost_infer.test.js` plus the fold test: 8 pass |
| C2 | The premise was wrong. All 91 unbound cards belong to scenes in later volumes whose locators were misread as volume 1. They are recorded as 91 decided gaps, and a builder patch is proposed (`c2/build_event_cards_volume.patch`, not applied). Live inputs show 322 missing lead slots, not 276. Of those, 240 are filled as source candidates (`runtimeReady: false`) and 82 are left with reasons. | `c2/verify.mjs` PASS; `tests/lead_run_step_tags.test.js` 10/10 |
| C3 | Price crosswalk. Volume 1 prices: 382 mapped, 2 band inferred, 46 unmapped. Traceable volume 1 coverage goes from 0% to 23.0%. | `node --test tests/lotm_price_map.test.js tests/lead_run_coverage.test.js`: 9 pass |
| C4 | 6 Luna briefs (methods and artifacts, volumes 4-8 and volume 2 leftovers) with compile and anchor helpers. | prep checks in `c4/fold.md` |
| C5 | 19 Luna briefs covering 51,194 texture rows, with a fold script. | `c5/CHECKS.md` |
| C6 | Groselle's sheet now has dated entries and 2 outcomes. Luen stays thin on purpose: the id refers to a country, not a person. The registry fix goes to sw-chars. | `node --test tests/character_sheets.test.js`: 8 pass, 0 skipped |

Combined focused run: 25 pass, `check:arch` pass. The full suite has not run.

Luna lanes: C1 (7) and C4 (6) were launched at about 10:40 with Codex at 36%. C5's 19 lanes wait until the load average falls (it was 70-83, driven by other sessions' ugrep and Chrome).

## Floor wave (O1)

| Slice | Floor result |
| --- | --- |
| Divination (L4 rows, `div_supply` facts, cast-pack seam; wired by sw-wire `fe6a8e17`) | Each row now names a `grounds` fact (`actor.lotm.div.grounds.<name>`, held when the lead knows `book.lotm.div.grounds.<name>`); an attempt or interpretation without it is the `.unclear` twin: "The answer will not settle; nothing you know bears on this question yet" and a belief naming the source scene (WA51). Played at 1920x1080, fresh origin, lead-life start: unsupported run ends unclear; supported run (grounds knowledge seeded by editing the exported save and loading it through `window.load_progress`) ends with the authored answer; save and reload keep 5 `divination.*` keys in both. Focused tests: 15 pass; `check:arch` pass. Probe: `scripts/playtest/lotm-divination-probe.mjs <out> [unclear|supported]`. Agent-verified, not human-reviewed. Gaps: no in-run route earns the grounds knowledge yet (the cast pack covers chapters 1-24; the rows cite chapters 46-136), so every real run reads unclear; import used `load_progress`, not the file chooser; screenshots time out on font load; the 8 scenes still list at once. Implemented, at the floor for the mechanism, not for earning a supported answer. |

| Second city and restrictions (L11, L14) | Not played: no real data reaches the lead. The host already passes `lotmRestrictions` into `lotmRegionAt` and the cast journeys (sw-wire), but `private_packs/lotm-events/events.json` is not built into the pack folder or the manifest, and its pack has no prose `lines`. The enforceable restrictions in the built event packs start at volume 3 chapter 60 (curfew), volume 6 chapters 46 and 67 (travel halts) and volume 7 chapters 17-18 (curfews); volume 1 has one restriction and it is unmapped (a notice). The cast pack binds days 1-4. A browser floor would need a faked event, so none was run. Unblocks when the cast reaches volume 3, or an early restriction row is authored. Below floor. |

| Death, backlash and loss of control (L9, played character only, no heirs) | Partly played. sw-wire's host consumer (`book_world_lotm_harm.js`: `accrueHarm` on commit, `restHarm`, `lostControlOutcome` to `ports.die('loss_of_control')`) is live: in the lead-life run three coin peeks took `harm.backlash.power` 1, 2, 3 (probe `... lotm-divination-probe.mjs <out> backlash`). Not reached: the stage-9 `lost` state, the death and the restart panel, and save, reload and import of the harm slice. Machine load was 146-155 during the runs; two runs lost the browser page mid-loop (no crash or page error recorded), so the death run is unproven, not failed. Not wired: L9 slice 4 (`accrueBacklash` for casts, `backlashAdder` into `settleLotmBacklash`, `lossOfControlTick` with the saved `lostFor` countdown, `loopPlan`), and `context.harmSave` rebinding at execution. Heir `resume:` stays unwired by direction. Below floor. |
