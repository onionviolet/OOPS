# Bank deeper takes: what each first slice left in its source (BDT1-BDT111, 2026-11-10)

FRC75 of the [foundational rules coverage audit](FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md). A read-mostly pass: no runtime file was edited and no test was run. Weibao's standing note governs it: adapt to fit, do not copy ("Feel free to also adapt and adjust things to fit our purpose better too", 2026-11-10).

**Reading the rows.** Reading rows carry a [WPR4](../WORLD_PASS_RULES.md) label with a locator: SHOWN (read in source or code), STATED (a note or header says so) or INFERRED (my reading; confirm before building). Improvement rows are proposals. In the class column, **ACT NOW means "dispatch next"**, as in the FRC rows; nothing in this pass was built. ACCOUNT FOR NOW means name it in the owning rulebook or brief and schedule it behind its dependency. LATER means after the current wave. Levels are haiku, sonnet or opus. A row that removes an option, adds a stop or takes control from someone is also listed in [the Weibao list](#for-weibao-limiting-ideas-ad56) (AD56) and waits for his answer.

**Build state read.** Merged to master: storyteller core, mood, needs, spoilage, regional prices, away bank, HP exams, item identity. Unmerged branches: law (`claude/law-by-observation-86bcf9`, 3 ahead), storyteller Gu annex (`claude/storyteller-gu-f0705f`, 2 ahead), opinion, gifts, rest (`claude/amazing-hofstadter-465f39`), HP mood. Uncommitted in a worktree, read from disk and **may change**: mastery pool (`mastery-pool-8a0ffd`, session still working), mind meters (`unruffled-sutherland-fd9e30`, no commit yet), Mother of Learning exams (`exams-mol-b11add`, edits `hp_exam_model.js`).

## Storyteller (BDT1-BDT10)

Core `src/story_director.js` (merged); Gu annex `src/book_world_gu_care_story.js` (unmerged, includes candidate `kind` and per-category cooldown).

| Code | Row | Label, locator |
|---|---|---|
| BDT1 | Source has several components, each with a minimum day and target tags, and a seeded on/off calendar apart from the random one. The slice took the category-then-candidate draw only. | SHOWN: [STORYTELLER.md](../research/rimworld/pass-2026-10-14-deep/STORYTELLER.md) F13 scheduling |
| BDT2 | Final chance multiplies base, population curve, population intent and recent-occurrence penalties. The slice took tension, comfort and a cooldown, not a graded recent penalty or "how much is already open". | SHOWN: STORYTELLER.md F13 selection, F14 |
| BDT3 | A rejected recheck spends nothing and starts no cooldown. Adapted as written and it holds: receipts list the rejected tries. | SHOWN: `story_director.js` header and `directWindow`; source side INFERRED RW-D7 |
| BDT4 | Weak fit: `tension` is a number each caller computes for itself (Tingen deck, Gu missed meals), and the Gu annex found a memoised run needs player-dependent inputs in its signature and loses early windows once simulation prunes past 100 terminal occurrences. | STATED: Gu annex note (side-session note, outside the repo) "Seam contract" |
| BDT5 | Graded recent-kind penalty beside the binary per-category cooldown (which already exists on the Gu branch). Dial 0 keeps today's hash. | ACCOUNT FOR NOW, sonnet, small. Done: Tingen golden hash unchanged at dial 0; at dial on, a just-surfaced kind's weight recovers over N windows in a unit test. Waits on the Gu branch merge |
| BDT6 | Open-pressure intent (the population-intent analogue): pressure weight falls with how many pressure candidates are already held, so pressure does not pile up. | ACT NOW, sonnet, small. Done: three held pressure items give a lower pressure weight than none; replay stays deterministic |
| BDT7 | One `tensionOf` reader over named dated signals (missed meals, mind marks, open debts) with per-world weights, used by both callers. | ACCOUNT FOR NOW, sonnet, small. Done: Tingen and Gu tension equal today's values; golden hashes unchanged |
| BDT8 | Check that a 200-day life replays the same windows the player saw. If lossy, keep a compact ledger of surfaced ids and windows only. | ACCOUNT FOR NOW, sonnet, small. Done: replay of window 20 at day 200 equals the receipt shown on day 20 |
| BDT9 | Seeded-rhythm policy (`cycle: {on, off, hits}`) for fixed-rhythm openings such as market days and rounds; rechecks still run. | LATER, sonnet, medium. Done: same seed gives the same hit days after reload; a rejected hit spends nothing |
| BDT10 | Third caller on LOTM news (FRC38's LATER) plus price events from BDT45 as candidates, to test the seam beyond two decks. | LATER, sonnet, medium. Done: both callers run through `directWindow` with no core change, or the change is recorded |

## Mood, opinion and mind meters (BDT11-BDT20)

Core `src/mood_thoughts.js` (merged); opinion, gifts and HP mood are branches; mind meters are uncommitted (warn at two marks, route at three with a last window, contentment cancels one mark).

| Code | Row | Label, locator |
|---|---|---|
| BDT11 | Source keeps the mood sum apart from the break reader, which has its own duration, probability and exceptions (downed, asleep, blocked). The slice stops at the reader: `moodOf` returns a total and a band, and nothing consumes a break. | SHOWN: [RimWorld REPORT](../research/rimworld/REPORT.md) F4 line 41; `mood_thoughts.js` `moodOf` |
| BDT12 | An insult memory runs 20 days with a 2-day mood thought, attributed, stack-limited, fading over its last fraction. Taken in full (`fadeShare` 0.25, `kind: 'social'` on the opinion branch). Holds. | SHOWN: REPORT line 47; `mood_thoughts.js` `THOUGHT_LIMITS`; STATED: opinion-rows-shape note |
| BDT13 | Weak fit: caps are 60 rows for the whole slice and 20 per holder; over 60 the oldest row in the slice is cut, which can drop another holder's thought, and social rows run long. | SHOWN: `mood_thoughts.js` `addThought` tail; STATED: opinion note "Caps are shared" |
| BDT14 | Two producers keep truth differently: LOTM stores rows from a weekly filing, HP Ron rebuilds rows from dated notes on every read. No rule says which applies when. | SHOWN: `book_world_hp_lead_mood.js` header (uncommitted); `mood_thoughts_domain.js` |
| BDT15 | Break reader: a pure `breakOf(mood read, {at, chance, window, exempt})` that returns eligible or not with a reason, read by the one loss carrier (RCL5) and never a second counter. The mind-meters threshold covers dread and fascination, not a general mood break. | ACCOUNT FOR NOW, sonnet, medium. Done: same seed gives the same break window; asleep is exempt; an even band never breaks. In the Weibao list |
| BDT16 | Cap by holder (20) with a world ceiling sized to the cast, and trim the soonest-expiring row of the same holder, never another holder's. | ACT NOW, sonnet, small. Done: four holders at 20 rows each validate; a trim cannot remove a different holder's row |
| BDT17 | One line in MIND_RULES: rebuild rows from a dated record when one already owns the event, store rows when none does; both read through `moodOf`. | ACT NOW, sonnet, small. Done: the line cites both callers; `check:rules` passes |
| BDT18 | Generalize contentment: a port `settleThoughts(holder, source, count)` so a gift, tea or rest cancels rows of a named source (mind meters do it inside `dropThoughts`). | ACCOUNT FOR NOW, haiku, small. Done: a gift cancels one row of its source and no other source |
| BDT19 | Remnants: a row may name a longer, weaker row that replaces it when it runs out (Cultist injury hardens to a lasting remnant; despair marks accumulate). | LATER, sonnet, medium. Done: an expired grievance leaves a weaker long row; replay equals live. Source: [mind meters digest](../research/cultist-simulator/MIND_METERS_DIGEST.md) (STATED, snapshots missing) |
| BDT20 | Opinion steers choices (RimWorld opinion affects later interaction picks toward the same actor): one dialogue gate and one help-or-refuse choice read `opinionOf`. | LATER, sonnet, medium. Done: the same request gets different answers from a cool and a fond holder, with a stated reason. Source INFERRED from REPORT line 47 |

## Needs and hunger (BDT21-BDT30)

`src/needs.js` (merged); `rest` on `claude/amazing-hofstadter-465f39` (unmerged, saved rest debt in the harm slice).

| Code | Row | Label, locator |
|---|---|---|
| BDT21 | Source food need drains on an interval; malnutrition rises while starving, falls otherwise and changes later drain. The slice reader is stateless (`sinceMeal`), so one fed minute after a famine reads like a normal day. | SHOWN: RimWorld REPORT line 41; `needs.js` `readNeed` |
| BDT22 | Source food search uses legal sources and returns actual nutrition; no source means no food job. The slice has one fixed ration per body, and a meal always refills it. | SHOWN: REPORT line 41; `needs.js` `rationMinutes` |
| BDT23 | Kenshi bodies set hunger, heal and strength; robot wear lowers max HP, and a repair bed is a different service from healing. The slice took rate, heal, strength and self-fed; the branch gives construct heal 2 and rate 0. Wear and repair are not taken. | SHOWN: [BODIES.md](../research/kenshi/second-pass/BODIES.md) B4, B5; STATED: rest note |
| BDT24 | Weak fit: `BODIES` is a frozen table, so a world cannot add a race (Shek 1.25, hive worker 0.5 are in the source); food state is derived but rest debt is saved; feeding state lives in three callers. | SHOWN: `needs.js` 17-31; BODIES.md B4; [AREA_GUIDE](../AREA_GUIDE.md) Competing line |
| BDT25 | Malnutrition by replay: a slow `wear` derived from the meal log (rises per missed ration, falls per fed day) that scales heal and work. Default does not kill (BHR16). | ACCOUNT FOR NOW, sonnet, medium. Done: three missed rations then meals leaves heal under 1 for N days and then recovers; replay equals live; the save carries only the meal log. In the Weibao list |
| BDT26 | Meal size: `satisfy(item)` returns ration minutes from the food's own value, so a feast covers two rations and a snack half. | ACT NOW, sonnet, small. Done: two foods of different value give different next-hunger times; sheep stays at 12 minutes by default |
| BDT27 | `registerBody(world, row)` in the style of `registerTieMood`, so a second world adds a race without editing `needs.js`. | ACCOUNT FOR NOW, sonnet, small. Done: a test world registers rate 1.25 and reads it; an unknown body still fails |
| BDT28 | One state rule in AREA_GUIDE: derive a need from dated acts when they are recorded, save only when they are not (rest debt is the named exception). | ACT NOW, sonnet, small (docs). Done: the line names food and rest; `check:rules` passes |
| BDT29 | Wear as a need kind for constructs: work raises it, a named service (bed, mechanic, a favor) lowers it, apart from healing. Frontier native sleep stays as is. | LATER, sonnet, medium. Done: construct wear lowers its stage multipliers; the service restores them |
| BDT30 | `canMeet(body, source)` so a plan can say "nothing in reach" instead of a silent shortfall. | LATER, sonnet, small. Done: the Gu keeper planner reports an unmet need with its cause |

## Spoilage (BDT31-BDT40)

`src/spoilage.js` and the hearth shelf in `owned_place_clock.js` (merged); the Gu petal lot fold is on the unmerged Gu branch.

| Code | Row | Label, locator |
|---|---|---|
| BDT31 | A craft takes ingredients and weights spoil by the perishable ones only; the product inherits that fraction, capped at 1, and a recipe flag can reset freshness. The slice has no craft inheritance. | SHOWN: [quality-spoilage REPORT](../research/factorio/native/readers/quality-spoilage/REPORT.md) QS-03, QS-04, QS-06 |
| BDT32 | Expiry becomes a declared result and can chain, catching up several steps in one go; spoilage itself sorts by level then deadline. The slice has one step and `Spoiled food` has no result. | SHOWN: REPORT QS-08 to QS-10; `spoilage.js` `PERISHABLES` |
| BDT33 | A spoil can fire a trigger (an egg hatches). The slice's result is an item only. | SHOWN: REPORT exception table (egg row) |
| BDT34 | Weak fit: three cooked goods, one storage rate (stilled hearth 0.25), and rot has no consumer. Whether a cook path inherits spent age is not confirmed: the larder reads show spent age carried on stored keys only. | SHOWN: `spoilage.js` 11-18, 29; `owned_place_clock.js` 64-105; the cook-start claim is INFERRED, confirm first |
| BDT35 | Craft inheritance: product spent age is the weighted spent share of perishable inputs; nonperishables do not dilute; a recipe can state a fresh start. | ACT NOW, sonnet, small. Done: confirm the cook path first; then a meal cooked from 80%-spent input has less life than one from fresh |
| BDT36 | A consumer for rot chosen from existing owners (animal feed, compost for a plot, bait), with its effect in words. | ACCOUNT FOR NOW, sonnet, small. Done: one named owner accepts `Spoiled food` and states the effect |
| BDT37 | `STORAGE_RATES` (stilled hearth, cool cellar, sealed jar, ice) chosen by what a place does, passed as `rate`. | ACCOUNT FOR NOW, haiku, small. Done: the same item reads different spans in two storages, in the player's words |
| BDT38 | Result chains that catch up: let a result perish and have an away spend loop the chain (TMR9). | LATER, sonnet, small. Done: a three-step chain across a long spend equals live play |
| BDT39 | `becomes` may be an effect list (sprout, hatch, ferment), not only an item. | LATER, sonnet, medium. Done: one item sprouts into plantable stock after N days with a stated line |
| BDT40 | Perishability declared on item definitions so any world's items join, with `PERISHABLES` kept for old rows. | ACCOUNT FOR NOW, sonnet, small. Done: a new item declares a life and is read without editing `spoilage.js` |

## Regional prices (BDT41-BDT50)

`src/regional_prices.js` (merged; pure, nothing saved).

| Code | Row | Label, locator |
|---|---|---|
| BDT41 | Source has commodity metadata plus periodic price functions per region, and its news comments on calculated prices without simulating the cause. The slice goes past it with conserved stock, keyed events and cause lines, as the note's own warning asks. Holds. | SHOWN: [LIVING_UNIVERSE NV-D4](../research/naev/LIVING_UNIVERSE.md); `regional_prices.js` header |
| BDT42 | Ports check services, bribe, explicit allow or deny, hostility and standing in a fixed order, and a story permission is not friendship. The slice has buy and sell `terms` only, no access order. | SHOWN: LIVING_UNIVERSE NV-D4 (ports) |
| BDT43 | Weak fit: an event is keyed by place, kind and month, so a failed harvest never shows in the next place; the data is two places, two kinds, three goods in constants. | SHOWN: `regional_prices.js` `eventFor`, `PLACES`, `STAPLES` |
| BDT44 | A price is ceilinged to a whole unit with a floor of 1, so a cheap good in a coarse-purse world may not move with the shelf. Check against Tingen's grain-2 purse. | INFERRED: `unitPrice`; [AREA_GUIDE](../AREA_GUIDE.md) WORLD_GRAIN trap |
| BDT45 | Price events as news candidates: a keeper-stated cause becomes one feed row the director can surface, with no cause beyond what a keeper would say (ECR9). | ACT NOW, sonnet, small. Done: a failed-harvest month yields one news row carrying only the keeper's `say` |
| BDT46 | Events with reach: a named region with a damped effect on neighbors, so places move together with a lag. | ACCOUNT FOR NOW, sonnet, medium. Done: a Village failed harvest lifts Slums grain less than Village, identical after reload |
| BDT47 | `registerMarket(world, {places, kinds, staples, events})` so HP and Gu add markets without editing constants. | ACCOUNT FOR NOW, sonnet, small. Done: a second world registers rows and the conservation test passes |
| BDT48 | Carrier flows: a cart moves real stock between shelves (ECR conservation), so arbitrage is an act and the player can be the carrier. | LATER, sonnet, large. Done: moving 10 units lowers the source shelf, raises the destination, prices follow |
| BDT49 | A `tradeAllowed` read (deny, hostility, standing) apart from price, sharing the look reader of the law branch. | LATER, sonnet, medium. Done: one price, two looks, two answers |
| BDT50 | A grain-2 test for `lineValue` on a cheap staple. | ACT NOW, haiku, small. Done: a 10-unit total moves with the shelf in a grain-2 world |

## Law by observation (BDT51-BDT60)

`src/law_case.js` and `src/book_world_lotm_law.js` on `claude/law-by-observation-86bcf9` (unmerged, 3 ahead).

| Code | Row | Label, locator |
|---|---|---|
| BDT51 | Institutions classify by observed body, clothes, papers, ties and conduct; exile, escaped captivity and public bounty are separate facts; local reputation is evidence, not a pass. The slice took observed look, witnesses, jurisdiction and four routes, but standing is one heat and closure record. | SHOWN: [WORLD_CARD.md](../research/kenshi/second-pass/WORLD_CARD.md) line 41; STATED: law handover (side-session note, outside the repo) |
| BDT52 | A loss routes to an enforcement visit and a win to a repeat visit at different spacings, with forces changing by outcome. The slice has a `responses` ladder but no outcome-driven follow-up. | SHOWN: [SETTLEMENTS.md](../research/kenshi/second-pass/SETTLEMENTS.md) 37-39 (tuple meaning not read, INFERRED as delay and force) |
| BDT53 | Weak fit: only fights are observed and only constables with a door-fight note witness; the Klein life has nothing wearable, so disguise is test-only; `armedOpenly` has no statute. | STATED: law handover "Gaps" |
| BDT54 | The news seam lets a sighting pass to tied colleagues, but the handover does not say the law branch registers a topic. | STATED: news-travels note "Seam for law by observation"; unused is INFERRED |
| BDT55 | Register a topic and push constable sightings through `newsSighting`. | ACT NOW, sonnet, small. Done: constable A sees a fight and B classifies a look after contact; with no contact, nothing travels |
| BDT56 | Split standing into wanted, exiled, escaped and bounty, each with its owner, reach and lifecycle. | ACCOUNT FOR NOW, sonnet, medium. Done: clearing a bounty leaves exile in place; each reads who knows it |
| BDT57 | Each enforcer carries its own `reads` (guard reads clothes, clerk reads papers), so one look can pass one and fail another. | ACCOUNT FOR NOW, sonnet, small. Done: same look, two institutions, two rulings with reasons |
| BDT58 | Outcome follow-ups: a stronger visit after a lost arrest, a repeat visit after a win, delays as dials. | LATER, sonnet, medium. Done: a unit shows the delay and force by outcome. In the Weibao list |
| BDT59 | Give disguise a reachable caller (a life with outfits) and prove a changed outfit leaves the case unproven in a headless run. | ACT NOW, sonnet, small. Done: headless run at 1920x1080 shows the case drop after the swap |
| BDT60 | Second-world validation (AD51): Gu clan law or HP school rules through the same `law_case`. | LATER, sonnet, medium. Done: a second statute table runs with no seam change, or the change is recorded |

## Offline replay (BDT61-BDT70)

`src/away_bank_domain.js` and `tests/headless/away_bank_equivalence.test.js` (merged, `d3189cd6d`).

| Code | Row | Label, locator |
|---|---|---|
| BDT61 | Melvor replays the same 50 ms ticks up to a default 24-hour cap, lets passive systems run beside one active action, turns offline combat off by default and excludes some modes. The slice banks minutes and spends them through the native clock, which already beats a free grant. | SHOWN: [Melvor REPORT](../research/melvor-idle/REPORT.md) 43-45 (`game.js:1769-1800,2074-2168,2199-2227`); `away_bank_domain.js` header |
| BDT62 | Idleon clamps by a selected prayer (10 h). The slice's cap is 7 days with one registered growth source, `play` (original, TMR6); item and research sources are not registered. | SHOWN: [Idleon digest](../research/legends-of-idleon/AFK_AND_LEGIBILITY_DIGEST.md); `away_bank_domain.js` 24-30 |
| BDT63 | The harness proves hearth, woodcutting, a blocking choice and sleep give equal canonical saves live or spent. Spoilage, food need, stock restock and mood fade are not cases. | SHOWN: commit `d3189cd6d` file list and message |
| BDT64 | Weak fit: nothing in the header says what a spend does at a fight (Melvor's default is off), and the bank beyond capacity is dropped without a stated notice. | SHOWN: `away_bank_domain.js` header ("drop beyond it"); danger gap INFERRED |
| BDT65 | Add spoilage, food need, restock and mood fade as harness cases at spend 120 and 1440. | ACT NOW, sonnet, small. Done: each case's canonical save equals live play |
| BDT66 | Danger policy per act class (`runs`, `stops`, `asks`), default stop before danger with a stated reason. | ACCOUNT FOR NOW, sonnet, medium. Done: a spend halts where a fight would begin and says why. In the Weibao list |
| BDT67 | A "while you were away" line list from receipts (spoiled, delivered, restocked) after a spend. | LATER, sonnet, small. Done: a one-day spend lists those changes in player words |
| BDT68 | A bank-full notice before time is dropped, and the dropped amount shown on load. | ACT NOW, haiku, small. Done: a banner at capacity in a 1920x1080 browser run |
| BDT69 | More growth sources (items, research, a Mistglass-style practice) through `registerAwayCapacity` with stated reasons. Weibao's 2026-11-10 answer wants a growing cap. | LATER, sonnet, small. Done: a second source registered and listed in the projection |
| BDT70 | A list in TIME_RULES of which passive systems tick during a spend beside one active action. | ACCOUNT FOR NOW, sonnet, small (docs). Done: the list names each system and its harness case |

## Hogwarts exams (BDT71-BDT80)

`src/hp_exam_model.js` and `src/book_world_hp_exams.js` (merged). The Mother of Learning lane has uncommitted edits to `hp_exam_model.js`; BDT77 overlaps it.

| Code | Row | Label, locator |
|---|---|---|
| BDT71 | Source score is K draws from study level to 10, plus extra credit, an illness penalty and a floor, weighted between midterm and final (80-99% final). The slice has one sitting of seven papers: aptitude, fluency, understanding, revision and a draw whose width narrows with sessions. Adapted, not copied. | SHOWN: [ROLLS_AND_EXAMS](../research/academagia/decompile-2026-10-14/ROLLS_AND_EXAMS.md) R3; `hp_exam_model.js` header |
| BDT72 | Source grades by distribution, curve, hybrids or pass/not-pass, and equal scores have no tie rule. The slice ranks a cohort of 40 with a shared better rank on ties and canon anchors (Hermione leads). Holds, and the tie rule is an improvement on the source. | SHOWN: ROLLS_AND_EXAMS R4; `hp_exam_model.js` DIALS, ANCHORS |
| BDT73 | Only Charms (levitation power mastery over 8) and Potions (Alchemy xp over 40) are driven by play; five papers use baseline plus revision. | SHOWN: `book_world_hp_exams.js` 13, 26-29 |
| BDT74 | Exam mornings override attendance even when ill, with a small touch to explain why. The slice has the exam day on the lead clock; whether the screen says why is not confirmed. | SHOWN: ROLLS_AND_EXAMS R3 line 56; [SMALL_TOUCHES](../research/academagia/decompile-2026-10-14/SMALL_TOUCHES.md) T10; screen INFERRED |
| BDT75 | Drive the five baseline papers from the player's own recorded study or practice. | ACCOUNT FOR NOW, sonnet, medium. Done: each paper's enumerated chances move with a recorded act; undriven papers stay baseline |
| BDT76 | Exam-day condition: a tired or hungry stage scales fluency through the needs work multiplier (the illness-penalty analogue). | ACCOUNT FOR NOW, sonnet, small. Done: exhausted versus rested changes the enumerated chances. Waits on the rest merge |
| BDT77 | Lift subjects, exam day and anchors from module constants into a world row; coordinate with the Mother of Learning edits. | ACCOUNT FOR NOW, sonnet, small. Done: HP marks unchanged; the second world uses the same pure model |
| BDT78 | One line on exam day saying why the morning is taken. | ACT NOW, haiku, small. Done: the day text shows it at 1920x1080 |
| BDT79 | Extra credit and low-stakes class quizzes from named acts, capped, so progress shows before the year ends. | LATER, sonnet, medium. Done: a quiz result and a flat credit shift one paper's chances, both explained |
| BDT80 | Cohort moves with the player's acts: tutoring Neville raises his Herbology through ties while the cohort stays seeded. Original design. | LATER, sonnet, medium. Done: tutoring changes one cohort mark and the same seed reproduces it |

## Item knowledge (BDT81-BDT90)

`src/item_identity.js`, `src/item_views.js`, `src/book_world_lotm_item_names.js` (merged). The bank covers little here, so most rows are original design and say so.

| Code | Row | Label, locator |
|---|---|---|
| BDT81 | The bank has one precedent: Caves of Qud's Examiner, per-kind understanding by a skill. The rest of FRC54 is original design. | STATED: `item_identity.js` header; [coverage audit](FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md) FRC54 |
| BDT82 | Identities hold an open name and routes (knowledge key, cap); certainty is open, guessed or known; the first caller is the Tingen broker lots, where a seller's word caps at guessed and a verdict reads as known. | SHOWN: `item_identity.js` 1-25; STATED: item identity note (side-session note, outside the repo) |
| BDT83 | Not built: study and use routes, the sealed grade-3 lamp, the two hand-coded vial views, and a cast seat reaching broker lines only through `brokerView`. | STATED: item identity note "Not done" |
| BDT84 | Weak fit: identity is registered per item id, so a second item of the same kind starts unknown; Qud understands by kind. | INFERRED: `item_identity.js` header ("per item id"); Qud per-kind from the same header |
| BDT85 | Kind-level learning: a kind route marks every item of that kind for that observer only. | ACCOUNT FOR NOW, sonnet, medium. Done: naming one vial names the next of its kind; a second observer still sees the open name |
| BDT86 | A use route: taking or using an item writes a knowledge key from the effect actually seen, capped by how visible it is; the cost is real (AD38). | ACT NOW, sonnet, medium. Done: using an open vial moves the actor's name to guessed or known; another observer is unchanged |
| BDT87 | Move the two vial views onto identities and retire the duplicate chain. | ACCOUNT FOR NOW, sonnet, small. Done: golden hashes unchanged; both views read through `projectItemView` |
| BDT88 | An appraiser service: a verdict route sold at a price and a delay, with the appraiser's own reliability. | LATER, sonnet, small. Done: two appraisers of different skill give different certainty at different cost |
| BDT89 | Sweep the raw-name paths ITM23 listed, by id, so sealed lots show only what the route allows. | ACT NOW, haiku, small. Done: a grep of UI name paths finds no raw name for a sealed id |
| BDT90 | Cast-seat reach: broker lines visible to a cast seat. | ACCOUNT FOR NOW, sonnet, small. Done: a cast seat run shows the broker block with that seat's names |

## Mastery (BDT91-BDT100)

`src/mastery_pool.js` is **uncommitted** in `mastery-pool-8a0ffd` (session working); these rows may need redoing once it commits.

| Code | Row | Label, locator |
|---|---|---|
| BDT91 | Source has per-action mastery plus a realm pool, exact pool-to-action spending and checkpoint providers that switch; spending can drop a safety or bonus while recipe mastery stays, and later growth, healing and XP consumers read mastery. | SHOWN: [Melvor REPORT](../research/melvor-idle/REPORT.md) line 21 (PROD-C05) |
| BDT92 | The slice keeps mastery on the engine's power record and the pool as an actor resource (share 0.25, cap 8 per learned action), opens a different command at a checkpoint rather than a percentage, never decays and pays only on completion. Adapted well and it holds. | SHOWN: `mastery_pool.js` header and `MASTERY_POOL_DIALS` (worktree) |
| BDT93 | Weak fit: one world and one action, so the pool and that action's cap are the same number and a spend has nothing to trade against. | SHOWN: `MASTERY_POOL_DIALS` lists one action; AREA_GUIDE hunk "one world and one action family so far" |
| BDT94 | HP exams already read levitation power mastery over 8 as fluency, a second consumer of the same record, though the pool has no HP row. | SHOWN: `book_world_hp_exams.js` 26-29; pool row absence SHOWN in `MASTERY_POOL_DIALS` |
| BDT95 | A second desk action in Tingen so spending is a choice between two. | LATER, sonnet, medium. Done: spending into one action changes which checkpoint holds while the other's learned mastery stays |
| BDT96 | An HP row (levitation practice into a charms pool with a checkpoint that opens a different charm command) to validate the seam (AD51). | ACCOUNT FOR NOW, sonnet, small. Done: the HP row runs with no seam change; exams read the same record. After the mastery merge |
| BDT97 | Consumers beyond commands: mastery raising output quality or healing speed as Melvor's later consumers do, per-world dial. | LATER, sonnet, medium. Done: one world's mastery changes made-item quality with a stated reason |
| BDT98 | Show what each level and checkpoint opens in the panel, with the spend warning (`checkpointsLost` exists). | ACT NOW, haiku, small. Done: panel text at 1920x1080 lists each opening |
| BDT99 | Add a mastery gain to the away-bank harness. | ACT NOW, sonnet, small. Done: N copies spent equal N copies live in mastery and pool |
| BDT100 | Show "full" on the pool panel when share past the cap is dropped. | ACT NOW, haiku, small. Done: panel text shows it at the cap |

## Across systems (BDT101-BDT104)

| Code | Row | Label, locator |
|---|---|---|
| BDT101 | World rows sit in module constants (`BODIES`, `PERISHABLES`, `STAPLES`/`PLACES`, mastery dials, exam subjects). Away bank and tie mood already use `register*` ports. Give each a registration port of one shape. | INFERRED across `needs.js`, `spoilage.js`, `regional_prices.js`, `hp_exam_model.js`. ACCOUNT FOR NOW, sonnet, medium. Done: each of BDT27, BDT40, BDT47, BDT77 shares one registration shape |
| BDT102 | Outputs with no consumer: `Spoiled food`, a mood band, a `starved` stage. AD54 checks a caller for new actions at commit; extend it to new item and stage outputs. | INFERRED; ACCOUNT FOR NOW, haiku, small. Done: the check warns on a new result with no named consumer. In the Weibao list |
| BDT103 | Derived versus saved state (BDT17, BDT28) as one rule in ARCHITECTURE_RULES. | ACCOUNT FOR NOW, sonnet, small (docs). Done: one AR line cites mood, needs and rest |
| BDT104 | Make the away-bank equivalence harness the standing test for any system that reads the clock (BDT63, BDT65, BDT99). | ACCOUNT FOR NOW, sonnet, small. Done: the floor names it; each clock-reading system has a case. In the Weibao list |

## For Weibao: limiting ideas (AD56)

Each line adds a stop, takes control or narrows a range. Default, dial and reason are stated; nothing here is decided or built.

| Code | Idea | Default | Dial | Reason and cost |
|---|---|---|---|---|
| BDT105 | Offline spend stops before danger (BDT66) | Stop and ask before a fight starts | Per act class: runs, stops, asks | Melvor turns offline combat off by default; unattended minutes should not walk into a fight. Cost: no overnight fight idle unless a class is set to `runs` |
| BDT106 | A mood break reader (BDT15) | Off for the player character; a world may switch it on | Threshold, chance, window, exemptions | RimWorld's break is its drama; it also takes control. Cost: a character acts against the player's choice |
| BDT107 | Law escalation after a lost arrest (BDT58) | Off | Delay, force, per world | Kenshi routes loss to a stronger visit. Cost: a failed flight raises pressure |
| BDT108 | Pass/not-pass or hybrid grading for some papers (BDT72) | Marks stay the report | Per subject style | Academagia grades some courses on pass only. Cost: less mark detail on those papers |
| BDT109 | Famine wear that lingers after eating (BDT25) | Off | Length, severity, per world | RimWorld malnutrition outlasts a meal. Cost: a lasting drawback, against the no-forced-weakness line |
| BDT110 | Rule: a new output must name its consumer (BDT102) | Warning only | Strict per area | Rot with no use is dead weight. Cost: a new item waits for a use |
| BDT111 | Equivalence harness as a floor gate (BDT104) | Advice in the brief | Gate per system | A clock-reading system that drifts from live play is a silent bug. Cost: one more check per slice |

## Ranked next, across systems

1. ACT NOW cheap and shared: BDT16 (mood cap), BDT65 and BDT99 (harness cases), BDT35 (craft inheritance after confirming the cook path), BDT45 (price news), BDT55 (law sightings), BDT86 (item use route).
2. ACCOUNT FOR NOW behind merges: BDT5, BDT7 (Gu branch), BDT76 (rest), BDT96 (mastery), BDT77 (Mother of Learning exams).
3. Needs Weibao first: BDT105 to BDT111.
