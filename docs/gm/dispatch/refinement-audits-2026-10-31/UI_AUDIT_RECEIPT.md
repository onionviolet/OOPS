# UI refinement audit receipt, 2026-10-31

Independent audit, no implementation or new design rule. This samples the desktop 1920×1080 shell and three journeys against [DESIGN](../../../../DESIGN.md), [UI rules](../../../UI_RULES.md), AD6–AD8, AD32, AD34, AD36, AD42–AD46, UR1–UR75, SUI and RPT. DSG lines and UR76–UR82 keep the statuses stated by their owners. Mobile and full world skins remain deferred. The higher-priority findings below concern existing player-visible behavior; the form comparison is a proposal.

## Input, route and evidence

- HEAD at snapshot and final source inspection: `43466ba23505c9f751317b4bd9e3ee161158105f`. The shared checkout was heavily dirty and changing; among tracked runtime inputs checked, `index.html` was modified. Its snapshot input SHA-256 was `dcdb0d8699cce93c5906b68ea01e35bdc29d2a37c157f2fdc1f27faf3c9efec2`. Private packs and assets were copied as found. [Pre-harness file manifest](ui-evidence/pre-harness-inputs.sha256) records copied `src`, `scripts`, `styles`, `resources`, `assets`, `private_packs` and `stories`; [supplement](ui-evidence/supplemental-inputs.sha256) covers locales, build dependencies and the temporary harnesses. These contain paths and hashes, not pack content or saves. The pre-harness manifest hash is `34d48a0d2339deee0317e76c0150268fb0ab055fb842464c9be13ec439104f7a`.
- A disposable `/tmp` snapshot was built with `npm run build`, using the copied inputs and read-only access to the existing `node_modules`. The initial snapshot missed the contract JSON and locales and the first build failed; after copying those inputs, the build passed with the existing duplicate-`dial` warning. Minified bundle SHA-256: `fc92f01b8b8b825926df198a14133f6362656990424a0173d3255caafe4baea8`. The fight harness separately built the same snapshot unminified: `e7ab05e83dd5c44df62498301e720519ec75a1d92c6531767442554d7e559226`. Neither is an installed-app claim.
- Lead: fresh disposable browser context → cross to Tingen → be the lead → `Other known panels` → `Moretti flat` → inspect the desk, quote 1 minute/no stock → advance 2 test-hook minutes → a desk receipt appears in Reports. [Fresh screen](ui-evidence/lead-fresh-14.png), [local controls and clocks](ui-evidence/lead-local-14.png), [after action](ui-evidence/lead-after-desk-14.png). One earlier automatic-timer capture was interrupted after the local screenshot; the paused, stepped action is the separate completed sample. The after-action frame shows Notebook in the center; why that navigation changed was not isolated. No lead reload or import was checked.
- Fight: **named DEV SEEDED field-workshop fixture**, not an earned encounter. The road contest was started and played with real controls, four strikes changed the player's HP, a keyboard move was made after import, and Back away was tried. A failed withdrawal and free-blow receipt appeared while the fight continued. [Changed-HP screen](ui-evidence/fight-changed-hp-14.png). Battle state compared equal after reload and literal Export/file Import except held-away minutes, which the harness deliberately excludes; visible HP is separately evaluated below. Failed withdrawal was observed; successful withdrawal, final settlement and healing were not.
- HP school: fresh **`structured_candidate=book.hp.school` test-candidate** origin → start school → charms lesson → practice → cast → reload → Export and literal file Import. The visible row moved from not learned to taught, practiced and one cast, and retained one cast on reload/import. [14 px, reduced effects](ui-evidence/school-cast-14.png); [21 px, effects off](ui-evidence/school-cast-21-effects-off.png). The Effects control was set by a scripted change event while its settings surface was hidden; the resulting root reported `off`. This proves the displayed effect setting and screen, not that a user navigated to that settings control. The 21 px capture is partway down the retained list, not its opening position.
- [Sanitized route data](ui-evidence/routes.json) contains the observed values and no saves or sealed text. SHA-256: `8a6012efbe1346fb701f74f5e53d5b10c31e0ff0885721810bd22b4b40f827a0`. Screenshot SHA-256s: fight `f3bed07da6e86604b8687cbbb35bfa418adbb88335e159b224cecb19ffa7f03a`; lead fresh `48399a6d0d342d6ae4167c8f2897d786f677cef82ba82641425aeb228c861edf`, local `6698756863315b586384f32edc544d40d9b67d9fa2ab701974fdd68e92f1c70b`, after `d61789f0799cfe3660cc530f0c4dbf5c53217d65e07d3724fbecfb74ec989644`; school 14 `eb48cf06e46bf15368ab9be1f8e731f4457f8ea4e452a1b806ad75b9c9ece2bd`, school 21 `39bab7c3a28a98db96c53a5920e400371477d57f4b79234345bbd59418048fcf`.

## Prioritized findings

### UIA-R1: A later source action is offered at the opening place, P1

**Current rebuilt browser and current source.** In the opening lead context, the expanded local controls include enabled `place.act.lr.lotm.main.208304-2`, whose label names information not established at that start. Its text and underlying truth are withheld here. The source row shares the opening place's mapped ID and has no per-row requirement. [Place-act compilation and quotation](../../../../src/place_acts.js#L5) bind and filter by place/pending job; the [LOTM host](../../../../src/book_world_lotm_cast_host.js#L106) supplies those actions to the panel. The fresh route and enabled ID are recorded in `routes.json`; the screenshot intentionally does not expose the later label.

**Impact.** A player can see future knowledge as an available local affordance before its discovery route. A same-place match alone does not establish that an object, person, time or knowledge is currently present.

**Owner and next step.** LOTM lead-life pack generation and `place_acts`/`book_world_lotm_cast_host` integration. Trace the row's source scene, place mapping, object existence, time and observer prerequisites; retain open-ended actions that really are possible. Do not fix this by disclosing the hidden prerequisite.

**Done check.** On a rebuilt fresh lead start, the named later ID and its terms are absent until its actual place, object and observer conditions are satisfied. A known ordinary opening action remains usable; after legitimate discovery its real control becomes available and its result survives the applicable round trip. Audit sibling generated rows for the same mapping failure without exposing their truths.

### UIF2: Fight and hero health disagree, P1

**Current rebuilt browser; earlier screenshot concern confirmed.** After the player took 1.6 damage, the fight card showed `58.4/60 hp` and the hero showed `60/60 hp`; both still showed those respective values after reload and literal import. The fixture save's native `hp_to_full` was `0`. The fight record itself preserved the reduced fighter HP. This is more than a decimal-rounding difference. The current screenshot is on the unminified snapshot bundle, not the historical `f445ed30d920` capture.

**Impact.** The player sees incompatible health during a choice about whether to stay or leave; a state equality check of the fight session alone misses it.

**Owner and next step.** Tempo fight publication and native hero health display: trace `runMove`, native vitals update and repaint from the [fight domain](../../../../src/tempo_fight_domain.js) to [hero display](../../../../src/display.js#L4197). Avoid inventing a second health owner.

**Done check.** On a rebuilt fight, assert the same underlying health in hero and fight views after damage and healing, after settlement, reload and import. If presentations round differently, prove the numeric readings have the same owner and make the rounding unambiguous.

### UIA-R2: The story panel is filtered from the lead seat, P1

**Historic real-play receipt plus current source and pure probe.** [cp9](../protagonist-life-2026-10-27/CANON_PULL_SLICE_2026-10-30.md#host-binding-and-browser-floor-2026-10-31) records that the active story slice was not offered in `Other known panels`; its after-import panel text was correct. It did not diagnose cause, and this audit did not rerun cp9. Current [registration](../../../../src/canon_pull_panel.js#L38) gives `canon-pull` no perspective. [Seat classification](../../../../src/seat_profiles.js#L84) leaves it `unclassified`, and the lead seat rejects that; both [known panels](../../../../src/workspace_layout.js#L627) and the expansion path apply the filter. A pure current-source probe returned `allowed: false` for that registration and `true` for a hypothetical `current-world` perspective. That probe does not establish the best permanent classification.

**Impact.** A recorded story outcome can exist and render correctly after import while its ordinary in-play surface is unreachable.

**Owner and next step.** `canon_pull_panel` and seat/perspective registration. Assign an appropriate scoped perspective or owning route and ensure discovery updates when the slice changes; do not weaken unrelated seat boundaries.

**Done check.** Repeat the actual cp9 lead route on a rebuilt bundle: the active panel is offered and opens during play, reports its state, and remains correctly reachable after reload/import. An inactive and a different-world/seat case do not disclose it incorrectly.

### UIA-R3: Reports assigns the native clock to the lead's current place, P2

**Current rebuilt browser and source.** At Moretti flat the local panel said `Day 1, night` and `Wait until dawn · 359 min`, while Reports said `Now: Mon, Summer, Day · 08:01 at Moretti flat`. After two stepped minutes the local countdown had refreshed to 357 in the panel DOM while Reports said 08:03; the center had by then changed to Notebook. These are intentionally different clock bases: [castCalendar](../../../../src/book_world_lotm_cast_host.js#L219) starts this life in its own small hours and supplies cast schedules and journey hours; [todayDigest](../../../../src/today_strip.js#L39) reads `current_game_time`, the native calendar. The defect is presenting the native clock as **Now at this place**, not that separate clocks necessarily have equal values.

**Impact.** The player cannot tell which time governs local actions, opening hours and appointments. A displayed daytime and a long wait until dawn appear simultaneously for one place.

**Owner and next step.** Today/Reports dock and the world calendar adapter. Use the active place's actual local clock, or explicitly identify a separate home clock when useful. Preserve genuinely unknown date information and other worlds' calendar dials.

**Done check.** A fresh lead start, two-minute advance, a scheduled wait and return/reload show the correct local time and countdown together. If the home clock is also displayed, its world and relationship to the active place are explicit; HP school and Frontier keep their own correct clocks.

### UIA-R4: School repayment lists debt reduction as a second unnamed input, P2

**Current rebuilt school candidate and source.** The repayment action's visible quote is `Inputs: 4 local resource units, 4 local resource units.` The [school command](../../../../src/world_packs/book_hp_life_data.js#L51) subtracts four allowance units and four debt units; the [generic cost projection](../../../../src/structured_pack_runtime.js#L149) renders both negative resources as the same input phrase. We did not execute this repayment in the sampled route.

**Impact.** Before committing, the player cannot tell whether eight spendable units are required, which resource is spent, or how much debt will be cleared.

**Owner and next step.** Structured action quote/read model with HP school data. Give meaningful world-facing resource names and distinguish the amount paid from the obligation reduced, following the actual settlement owner.

**Done check.** At the opening allowance/debt state, the quote makes payment and debt reduction distinct. Execute repayment and compare both actual balances, result, insufficient-allowance feedback, reload and import; add another resource consumer to prevent generic names from collapsing different meanings.

### UIF1: The withdrawal policy says safe when failure can invite a blow, P2

**Current rebuilt seeded fight.** Back away reads `A miss costs a free blow ... Safe.` The handover says `one safe turn`. This run actually failed Back away, logged the free blow and remained in combat. Yield also carries `Safe` while its text says the other side may refuse. [Combat surface](../../../../src/combat_situation_ui.js#L37) appends the internal `safe` flag to player-facing wording; the old receipt's concern is confirmed, including real failure.

**Impact.** A cautious/non-attacking policy can be mistaken for a guaranteed safe result at the point of choice.

**Owner and next step.** Tempo fight move wording and both card/fallback surfaces. Rename the internal eligibility concept in the presentation and retain the actual risk and cost.

**Done check.** Rebuilt controls for withdrawal, yield, brace and handover state what the policy does; failed withdrawal and refusal feedback agree with what occurred, without changing policy eligibility.

### UIF5: Keyboard focus is lost after a tempo move, P2

**Current rebuilt seeded fight.** Focus was on the Quick strike button; pressing Enter performed another strike and the active element became `body`. [Tempo rendering](../../../../src/combat_situation_ui.js#L29) replaces the card children when the view changes. The existing UIF5 hypothesis is now a reproduced keyboard failure for this move, not a conclusion about every other control or lifecycle.

**Impact.** Keyboard users lose their place after each action and must rediscover the fight controls. A changed game state can also invalidate an old target, so simply retaining a detached node is insufficient.

**Owner and next step.** Fight card rendering/focus management. Preserve stable controls where possible, or restore focus to an equivalent live control or a meaningful status if the former action disappears; announce results without shifting the player to an unrelated area.

**Done check.** Keyboard-play several moves, a refused move, opponent turn and a completed/withdrawn fight; verify focus and readable feedback after each redraw. Separately set and check aim/pin/scroll across redraw, reload and import according to their intended lifetimes.

### CG3: The lead's useful controls are hidden behind a second place view, P2

**Current rebuilt browser; prior observation rechecked.** The fresh lead screen had empty Actions and no visible Next step. The useful `Moretti flat` panel was an entry in `Other known panels`; selecting it exposed a desk action with duration, a paid meter action and visible but vague blockers. The desk action then produced a Reports receipt. The first screen's emptiness is therefore not evidence that no actions exist; it is a findability gap. See the [fresh](ui-evidence/lead-fresh-14.png) and [opened](ui-evidence/lead-local-14.png) frames.

**Impact.** The main-line player is given a blank place before being asked to discover a second place panel with the same name.

**Owner and next step.** Lead-start routing and local scene/workroom presentation, with the existing next-step owner. Make an actual, currently possible local action or a clear route to it visible from the opening screen; preserve the separate local controls and their authoritative quotes.

**Done check.** Fresh be-lead start at 14/21 px: a player can identify and reach an available first action from the opening screen, see cost/blocker, act, read the result and return without knowing a hidden panel name. No secret or invented action is exposed.

### UIA-R5: A known school prerequisite becomes an opaque generic refusal, P2

**Current rebuilt school candidate.** Before teaching, practice said `The required knowledge, means or circumstances are missing.` After the lesson, the status row said `Practised 0 of 1 drills`, but the cast control still said `The held method, control or target does not support this action.` After practice, it became available. [School data](../../../../src/world_packs/book_hp_life_data.js#L75) includes a specific practice-first reason; [structured ability compilation](../../../../src/structured_ability_runtime.js#L18) strips nested reasons and substitutes a broad one. The lead lamp also shows a generic missing-means message on its blocked row, though its nearby description hints at the meter.

**Impact.** The status elsewhere contains enough known information to act, but the blocked control does not identify what to do next. It becomes difficult to distinguish an unlearned method, no practice, missing target or a genuinely hidden cause.

**Owner and next step.** Structured ability projection/observer boundary and HP status bridge; local place-action reasons for the lamp. Carry an observer-permitted explanation from the real prerequisite, preserving a neutral answer where its cause is not knowable.

**Done check.** Fresh school before teaching, taught-but-unpracticed, missing wand/target and practiced states each display the correct known next step at the relevant control. A hidden prerequisite remains undisclosed and the real guard/settlement is unchanged.

### UIA-R6: Player descriptions expose implementation notes and planned odds, P3

**Current rebuilt school candidate and source.** The actual school controls include phrases such as `native skill owner`, `authored slice dials` and a source/canon qualification. The ready charm row states a proposed future fizzle percentage while also correctly saying it is not active ([bridge](../../../../src/read_models/hp_charm_bridge.js#L24), [school content](../../../../src/world_packs/book_hp_life_data.js#L37)). This is accurately labeled as a plan, but it does not help the player decide a present cast.

**Impact.** Technical and source notes compete with the practical lesson, cost and real result; future odds can be mistaken for current risk despite the caveat.

**Owner and next step.** School content and shared structured descriptions, under UR70–UR73. Retain meaningful present limitations in player terms and keep authoring provenance and proposed values in the appropriate developer owner.

**Done check.** The fresh, taught, practiced and cast rows explain the actual action, requirements, cost and result without implementation jargon or inactive numeric odds. The source and pending fizzle remain accurately documented, and no unimplemented effect is claimed.

### UIA-R7: School action hierarchy needs a form comparison, P3 proposal

**Current rebuilt screenshots, design judgment.** Luminous Gothic's shared colors, square frames, clear stat strip and intact Reports column carry across the sample. The school view instead presents many long, equally weighted action blocks. At 14 px the quoted costs and status are readable but compete with repeated descriptions; at 21 px the sampled scrolled frame displays only a few actions at once. This demonstrates the visible density, not measured comprehension or universal failure. The [school capture](ui-evidence/school-cast-21-effects-off.png) keeps static text usable with effects off.

**Owner and next step.** Structured school/world panel and shared action components. Compare (1) the current stacked blocks, (2) compact action rows carrying verb, current state and actual time/cost with details on expansion, and (3) an unusual timetable/agenda that groups actions by the local school window. Prefer compact rows as a candidate for ordinary action selection; use the agenda when timing is the player's real question. Keep independent details, live conditions and a plain text form. This is a proposal, not accepted direction.

**Done check.** At 1920×1080 and 14/21 px, compare the same fresh, blocked, in-progress and post-cast school states in the real app. A player can find a lesson, its cost/window and the next useful action, inspect the actual effect and return without losing context; no hidden horizontal clipping, misleading counts or color-only state. Human taste review remains optional.

## Reconciliation, remaining limits and checks

- **UIF3:** the earlier before-image correction stands. This audit's fresh screenshot was taken after the lead location loaded; an opened local panel and a settled action are separately evidenced. A selector/click alone is not the asserted result.
- **UIF4:** still an observer-knowledge risk, not a demonstrated live leak in this audit. Current [promise panel](../../../../src/promise_ui.js#L67) passes the holder's memory directly to `silenceLine`; [silenceCase](../../../../src/person_memory_effects.js#L123) derives pressure and rival-offer factors from that holder's memories and [explanation](../../../../src/person_silence.js#L32) prints the strongest factors and chance. No observer-knowledge input is visible on this path. Owner: social memory and promise UI. Next: run an unwitnessed offer, a sourced rumor and subsequent discovery through the actual panel. Done: displayed reasons and confidence reflect what the player can know while the underlying NPC verdict stays unchanged.
- **UIF6:** the current HP candidate rendered a school-specific entry line pointing to the real `Your beginning` panel. This is one current sampled world and does not prove all enterable worlds, repeated place names, missing locations or sealed cases. The [world kit census](../../../audits/WORLD_UI_KIT_CENSUS_2026-10-30.md) remains the inventory: HP location/actions/skill state/report voice were sampled here; people-presence and combat were not. Other unchecked cells remain unchecked, not missing.
- **UIF7:** the current 21 px school capture adds a real-world density sample, not a retest of the old talk screenshot. See UIA-R7; long names, talk, focus return and comprehension remain open.
- **UIF8:** [DESIGN](../../../../DESIGN.md) is the look owner; its proposal lines retain their own statuses. The writing draft remains a proposal. UIA-R6 names current observable text; it does not promote the draft or change the owner.
- The paused lead action's after-frame showed the Notebook center while its Reports receipt appeared. It was not established whether the action, redraw or another scheduled navigation caused the change; reproduce and inspect the return path before calling it a confirmed navigation defect. The lead action's save/reload/import, normal-profile 21 px fight, successful withdrawal, healing and final settlement were not exercised. No user save, native app, visible browser, installed package, full test suite, runtime source, shared build output or gameplay data was changed.
- Checks: isolated `npm run build` passed after copying the two missing snapshot dependencies, with one existing duplicate-key warning; headless lead action route completed with zero collected page errors; seeded fight harness passed its session/reload/import checks with zero collected page errors while the extra UI checks exposed UIF1/UIF2/UIF5; HP candidate reached and retained the cast row through reload/import with zero collected page errors. The current `seatAllowsPanel` pure probe produced the two classifications stated in UIA-R2. A local Markdown target and whitespace check found no missing file targets or trailing spaces. These are agent-observed samples, not human review or whole-system completion.
