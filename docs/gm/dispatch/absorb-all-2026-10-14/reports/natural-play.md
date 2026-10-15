# Natural-play reachability audit, 2026-10-14

**Result: partial natural reachability demonstrated.** The opening reveal, Run, watch, weekly bread, courier, finite searches, earned titles, reading, workshop entry/commission and air-wider candidate all worked without generated prerequisites. Investigate, the herb lesson, completed parcel relay, Town entry and Fort were **not reached in this run**. That does not establish that they are impossible. Their acquisition/pacing acceptance remains OPEN.

## Scope and method

Target HEAD `8615350a52bc7382949370e66e6a6b3ad1edba73`, fresh isolated Chrome contexts, port **18960**, **1366×768**. Read COMMON.md, PROJECT.md, USER_VISION.md, relevant lane reports, Village life-loop owner, Frontier campaign and implementation owners. Desktop/laptop remains primary; mobile is deferred. No product direction changed.

R1: The tip is newer than the assignment. P00 merge `be0e5945` is already an ancestor, and its additional panels are present. The explicitly excluded P00 modules were not audited. Their requested **“not landed”** classification refers to the assignment snapshot, not current Git. This pass is evidence at the recorded tip, with later integrated code present; it is not an isolated reconstruction of wave 1.

Fresh source was rebuilt **in memory** with esbuild, ES2022, minification and inline source map. The only override was `src/config.js: enable_dev_mode: true`, solely for existing `set_speed`. No config/index/dist/source files were written. Tested bundle SHA-256:
`819131442251e0c7e5b79892430350082d9ec967c5d8cabf2b0b72a3257bd66b`.

Used speeds **1, 10, 20, 100 and briefly 1000**. Only the game's own ticking, travel, study and sleep advanced time. No Playwright clock, advanceTicks, injected ticks, grants, money/access/XP helpers, generated save, imported prerequisites or fixed RNG. Normal NPC loans and earned contract rewards are ordinary play, not fixtures. The candidate's start was selected by untouched game RNG: `p06_air_wider_v1.ST04`.

R2: Nominal high speed did not translate into uniform compression. Early watch advanced about 86 minutes in ten wall seconds at 100×; later integrated work ran much slower. Combat uses its own repeated timer/render loop, so high-speed combat is especially unsuitable for a precise default-speed balance claim. Reported calendar times are observed game time; quoted durations are native UI/source durations, not a conversion from nominal multiplier.

The Frontier fresh play started **21:56:44 UTC**. The pass stopped after all features were classified: **50.47 minutes of browser-play wall time**, plus initial read/build setup, well before three hours. Exact finishing time/wall duration and build metadata are in [build.json](../checks/natural-play/build.json). Frontier evidence ends on day 4, with one field clear and five cave groups. Candidate saved clock is **618 played minutes**.

## Feature classifications and pacing

“Yes” means a native route actually reached the named feature. “No” means not reached in this bounded run, with the distinction between an observed blocker and a source-traced later dependency retained. **Nothing was forced.**

| Feature | Reached | Native route and rough time/actions | Hint / blocker / pacing judgment |
|---|---|---|---|
| F3: First skill level and reveal | **Yes** | Elder opening conversation → Train → Running. Real Running 1, +1 Agility and discovery cue by day 2 01:19. About 40 raw training minutes to first threshold, plus incidental inspection time. | Elder explicitly recommends training. Clear threshold receipt and cue; reasonable first reward. Watch also opened the skill area earlier through earned Persistence progress. |
| Run | **Yes** | Stop training → Run on → ordinary Shack/cave/Village travel. Running XP ends at 68. | Own panel explains 20% faster travel and two stamina. During combat/busy/low stamina, current reasons appear. Low-stamina reason disables the toggle too; source falls back to walking when running is unavailable. No stranded travel was observed. |
| Investigate | **No** | Watch/search and other ordinary play earned **41.41 Perception XP**. Level-1 threshold is 100 in `src/data/skills.js`; Investigate stayed undiscovered. | Watch/search name Perception rewards, but no visible progress-to-Investigate route was found. Longer natural skill acquisition was not exercised. Pacing remains unverified; do not infer a required number of shifts from watch XP alone. |
| Herb-taught preparation | **No** | No Golmoon leaves acquired; no 20-leaf lesson or native powder craft. | SOURCE: `reveal_chain.js` requires 20 currently held leaves. Forest-road/Carya acquisition exists in `data/locations.js`, behind further native progression. No early lesson clue was encountered. Natural acquisition and recipe pacing remain OPEN. |
| Reading unlocks | **Yes** | Elder equipment advice unlocks market. Six actual two-hour patrol rounds, returning each loan, earned 300 coins; purse 413 → purchase ABC for kids for **400** → Shack study. Completed by day 3 08:57; Reader title and Reading reference → Open Journal & Bestiary exercised. | Merchant book tooltip quotes 120 raw study minutes. Literacy visibly reduces remaining work as it grows. Study is short; acquisition is the longer gate. Twelve quoted work hours funded this chosen reading route. Book, reference fact and rewards survive reload. |
| F1: Village watch | **Yes** | Accept at day 1 ~08:11; remain idle in Village through 20:00. Paid **12 coins / 3 Perception XP**. Another day's open/closed controls observed. | Explicit stay/interrupt terms, served minutes and next-opening timer. About twelve game hours is a comprehensible idle shift, but binary interruption makes mixing it with other work costly. Only one completed watch was played. |
| Weekly bread stall | **Yes** | Claim day 1 at 09:37, bread **5 → 6** before later use. | Initially showed next opening in 55 minutes, then enabled claim and exact next occurrence after claiming. Sane optional free resource; later weekly restock was not played. |
| Daily midday bread | **No claim; UI reached** | Open/closed daily widget observed, including enabled availability during the first patrol. | Two-hour window was missed while inspecting/compressing time or working. This is a harness/play-route limit, not an admission failure. Widget's next-opening time is useful; no queue/notification was observed. |
| Courier and pamphlet | **Yes** | Courier appeared naturally on first Village visit, by 08:05. Read pamphlet before the watch. | Arrival log and persistent Local life button explain relay. Good discovery in this seed. The chance-visible visitor can be delayed on other seeds; no arrival was pinned. |
| F2: Parcel relay / elder guidance | **No completed relay; discovery yes** | Pamphlet revealed first handoff. First button remained disabled; guidance explicitly said clear Cave room and report back to open Eastern mill. Quests names the first stop. | Disabled row has no adjacent blocker explaining why “collect in Village” cannot yet be done. Cave gate was actually attempted: **5/25 groups**, then retreat at ~36 HP / nearly empty stamina. Mill stayed locked, parcel step stayed 0. Full relay pacing remains OPEN. |
| Titles | **Yes, partial** | Blooded through first kill; Back Again through actual unconsciousness; Reader through study; **Homebody** through actual Shack time/sleep, **1,577 home minutes** at final save. Bio → Titles inspected. | Public goals/counters are clear once Bio/Titles is opened. Sleeping's native 6× clock makes the home goal practical. Local Customer is **not earned: 1/25 settled-trade items**, despite separate workshop purchases. No claim that every title is reachable. |
| Search remaining / exhaustion | **Yes** | Village: one miss then find, ~10 search minutes. Shack: ordinary search later finds its remaining bread. Both stop at zero. | Chance, miss improvement, five-minute attempts and finite remainder are explicit. Exhausted disabled row is clear and repeat-safe. Reasonable small idle discovery. |
| UI polish / default reveal presentation | **Yes at observed subset** | Fresh Vivid desktop, real acquired-item dots, Running cue, readable trade affordability/receipts, Combat panel discovery, native title goals and reading desk. | Independent panels are useful, but collapsed modules and retained dock scroll hide important controls/vitals. No blanket claim for all polish ledger rows; native recipe-screen crafting, optional staged opening and every effects/accessibility setting were not exercised. |
| F4: Air systems workshop | **Yes, core route** | Speak to elder → open Iona ledger → Follow local people/work → Meet Iona → accept commission → buy one log for one coin → two-minute kit job → earned 10 points/cache → permanent learning for three points. By day 2 01:54. Later bought ordinary provisions for one coin. | The summary is discoverable among local controls after elder contact. Core costs are cheap and self-contained. First opening exposes dozens of later/disabled controls, with weak prioritization. Lease, module upgrade, irrigation, independent Ren work and every optional draw were not played here. |
| Upstream Town entry | **No** | Nearby cave physically reached; Cave room remains incomplete. Forest road / Town outskirts / guard negotiation were not earned or entered. | SOURCE: cave-depth report-back opens Forest road; guard offers ordinary 15,000-coin payment or Town reputation 15. Neither prerequisite was manufactured. Funding/reputation/admission pacing cannot be judged from this pass. |
| Fork known-clear hint | **Yes** | First field fight shows **known milestone: 2 clears** with native public description. One actual full clear earned. | Appears directly in Combat without a fixture. Clear and safe disclosure. Advancing next hint to four clears was not played. |
| Fork bestiary / reverse-source / loot estimate | **Partial** | Real kills opened Bestiary (10 starving rats / 15 wolf rats) and Data item-log source column. Hovered native tooltip at desktop viewport. | No relevant inherited rat loot acquired in 25 total kills with untouched RNG. Unknown entries stayed hidden; no partial-value estimate or positive reverse-source row appeared. Bought meat is known stock but not an inherited rat loot-list edge. Positive new projection remains **unverified**, not “broken.” |
| Frontier Fort chain | **No** | Mountain camp not earned. No `frontier.fort.*` lead, scout, craft, combat or completion forced. | SOURCE: actual camp → optional folio → study/scouting → connected Fort chain. Source also retains native camping-supply/advanced mountain dependencies; observed Village merchant camping supplies cost 8,000. Late optional content, with no early lead encountered. Whole-route pacing is unverified. |
| F5: Air-wider candidate | **Yes, substantial subset** | Query → Layout → Panels → Open Your beginning → Begin; untouched ST04. Native repair, learned-method variant, instruction/work and actual craft; survey briefing, case loan, preparation, approach, extraction, report/return; treatment, reloan and **second extraction**; acquired-device use. | Immediate/one-to-three-minute tasks are manageable and supplies/work form a natural route. Generic blocked reasons initially obscured control/stock/treatment requirements. Second survey worked after treatment, so no hard repeat block was established. Details/IDs below; other starts, held-storage approach and every candidate action remain unplayed. |

## Air-wider evidence without sealed prose

Installed candidate file SHA-256 `5cbd5798301b79c99d32f433fa2261fec0cab80f17475eb0a290f71060f5100f`. Real manifest and all nine pack fetches returned 200. No intercepted/fixture pack response. “Your beginning” title was initially misidentified by the harness as a fallback; after native Begin, the saved binding proved the requested candidate. `candidate-loading.json` was corrected to that verified identity.

In namespace `p06_air_wider_v1`, native completions include:

| Route IDs | Earned result |
|---|---|
| `meet`, `borrow`, `repair`, `ask_packing_depot`, `walk_to_road`, `practice_packing_road_1.air_variant`, `practice_packing_road_2` | Real first work/learning route; no supplied level/control fixture. |
| `meet_drill`, `site_brief`, `issue_site_case`, `prepare_site`, `enter_site`, `approach_careful`, `extract_site`, `report_site`, `return_site_case` | Actual discovered survey/custody loop; `extract_site` completes **twice**. |
| `practice_dressing`, `treat_site` | Ordinary treatment made another preparation available. Initial generic refusal was a real missing prerequisite, not a proven deadlock. |
| `watch_practiced`, `craft_dressing` | Staffed work supplied the needed stock/control route; craft completed **once**. |
| `acquire_beyond`, `device_treat` | Ordinary earned-credit acquisition; device use completed **once**. |

Final Save/reload retains the same completed counts and entire checked carried-stock projection. Source bindings, native jobs and ID-only stock are in [candidate-final.json](../checks/natural-play/candidate-final.json). No private prose, full save body, secret truth or unchosen outcome is copied into this report.

## Checks and limitations

| Check | Result |
|---|---|
| Fresh rebuilt bytes | In-memory esbuild PASS. **502 app/source-map entries match current files, zero mismatches**; 37 embedded Ink vendor TypeScript sources do not exist as local TS files and are not claimed independently compared. |
| Ink artifact check | `npm run ink:check` PASS, zero diagnostics. |
| Desktop browser | Two fresh isolated 1366×768 contexts, real native controls. **Zero page errors** recorded. Screenshots visually reviewed for opening/search, workshop and cave. |
| Frontier Save/reload | Money, field/cave group counts, reveal facts, completed book and workshop completions match exactly. Final skills: Running 68 XP, Perception 41.41, Literacy 129.65; field 15 groups, cave 5; four earned native titles. Normal calendar/idle time may continue during reload. |
| Candidate Save/reload | Requested pack/start binding retained; completion counts and carried stock match exactly; extraction 2, craft 1, device use 1. |
| Source/config preservation | Tracked source diff empty. `enable_dev_mode` stayed **false on disk** throughout; in-memory override is disposed when the owned browser/server close. Existing `?? private_packs` symlink preserved. No commit, install, source save migration or user-save access. |
| Other verification | Full npm test/standard disk-writing build were not rerun for this read-only audit. No export/import claim; previous fixture gates remain separate evidence. No installed/human-taste acceptance claimed. |

R3: Some five-second Playwright actions timed out in dynamically updating panels even when a native action later proved completed. No failed attempt is counted as a completed action. The final evidence uses observed state/counters. Keyboard activation of visible enabled controls and longer bounded waits resolved these harness issues. One broad nested-menu click accidentally started fieldwork; it was stopped without a completed-round payment. This does not establish a product defect in fieldwork.

The deterministic `advanceTicks` stepper would have helped especially with: exact watch/market windows, repeat work waits, the long home-time threshold, first Perception threshold, book deadlines and controlled comparisons of clock versus combat progress. It was **not used**. It would not replace ordinary player hints, typed acquisition prerequisites or untouched-RNG natural reachability proof.

Acceptance still OPEN: natural Investigate/herb/relay/Town/Fort routes; positive acquired-loot projection; unplayed workshop/candidate branches; **Weibao's play/taste**. This audit changes no mechanics or accepted decisions. There are no implementation merge risks from this lane because it edits only this report and its checks.

## Explicitly excluded P00 rows

Requested status: **not landed at assignment; skipped**. Current recorded HEAD contains the joined work, as R1 explains. No native acceptance is assigned here.

| Lane | Status |
|---|---|
| p23-exposure | not landed at assignment; skipped |
| p23-household | not landed at assignment; skipped |
| p23-living-gear | not landed at assignment; skipped |
| p23-combat-options | not landed at assignment; skipped |
| p23-reread | not landed at assignment; skipped |
| p23-salvage | not landed at assignment; skipped |
| p23-field-familiarity | not landed at assignment; skipped |
| p23-long-life | not landed at assignment; skipped |
| p23-market-life | not landed at assignment; skipped |
| p23-leisure-memory | not landed at assignment; skipped |
| p23-known-detail | not landed at assignment; skipped |
| p23-world-adaptation | not landed at assignment; skipped |
| p23-repeat-search | not landed at assignment; skipped |
| p23-save-time-options | not landed at assignment; skipped |
| p23-encounter-profiles | not landed at assignment; skipped |
| p23-growth-profile | not landed at assignment; skipped |

## Ranked fixes for reachability or clarity

Proposals only; no fixes implemented. Ranking favors observed friction over inferred late balance changes.

1. **A1: Make collapsed gameplay panels open from their visible headers.** Candidate Begin and patrol kit-return required Layout → Panels → Open. A plain title click did nothing. Keep editing controls separate, but expose normal expand/open. Owner: `src/workspace_layout.js`, `styles/workspace.css`.
2. **A2: Keep health/stamina visible when combat starts.** After examining Bio/Titles, the left dock retained its scroll position into Cave room, leaving vitals above the viewport in `24-cave-attempt.png`. Pin the critical vitals or restore their visibility on combat entry without collapsing useful panels. Owner: workspace layout/combat presentation.
3. **A3: Replace generic candidate blockers with actionable criteria.** Identify missing treatment, control, stock or location; show actual input quotes consistently. Ordinary treatment/work ultimately opened the second survey/craft, but initial reasons did not explain that route. Owner: `src/simulation.js`, `src/structured_ability_runtime.js`, `src/structured_expedition_runtime.js`, candidate authoring predicates.
4. **A4: Put the mill prerequisite on the disabled first parcel row and Quest objective.** “Collect in Village” conceals the Cave-room/report-back requirement until a separate guidance click. Owner: `src/absorb_c2/local_life.js`, `src/expansion_quest_ui.js`.
5. **A5: Prioritize workshop next actions.** Present current commission/cost/receipt first and group later learning, assistance, irrigation and optional controls. Do not remove reasonable options. Owner: `src/systems_workshop_ui.js`.
6. **A6: Allow turning Run off when stamina is low; label its walking fallback.** The same reason gate disables both enabling and disabling. Travel itself still works through fallback. Owner: `src/reveal_chain.js`, `src/main.js: practiceRunReason/toggleRun`.
7. **A7: Give patrol refusal a direct kit-return route.** Repeat patrol remained offered, then refused with a log message while the return control lived elsewhere. Link/open the custody panel or show the current reason alongside work. Owner: `src/village_career_ui.js`, native activity admission/display.
8. **A8: Surface known Perception practice progress and a modest herb-learning clue.** This save has 41.41 XP but no Investigate; herb preparation stayed entirely out of view. Use already-known activities/acquired items to point toward earned thresholds, respecting staged discovery. Owner: Local life/practice UI, `src/reveal_chain.js`, item tooltip/acquisition presentation. Herb-clue part is a proposal from an unreached route, not proof of a broken gate.
9. **A9: Make recurring food opportunities easier to resume.** Offer a visible reminder or a supported wait-until-opening control with ordinary time/cancellation semantics. Exact next times are already good; compression/work made the short midday window easy to miss. Owner: `src/absorb_c2/panel.js`, `src/world_rhythm.js`.
10. **A10: Profile integrated minute settlement/rendering and verify speed controls with the stepper.** High nominal multipliers became uneven after enrollment/full content loading. Separate measured CPU/serialization/render overhead from intended balance before adjusting XP, drops, Town fees or Fort gates. Owner: `src/main.js: update/update_timer`, simulation settlement and the sim-stepper lane.
