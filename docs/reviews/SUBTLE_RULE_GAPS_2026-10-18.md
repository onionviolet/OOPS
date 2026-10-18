# Subtle rule gaps (proposal, 2026-10-18)

Weibao, 2026-10-18: "subtle rules that would make future stuff easier but we
lack or havent expanded upon yet?"

Proposal only (AD32). Nothing here is a rule until Weibao accepts it. Checked
against [RULES_INDEX](../RULES_INDEX.md) and its register (AD1–AD38, AR, MR,
SR, GR, WA, BHR, CBR, SLR, UR). The big missing rulebooks the index already
names (cheats, companions, lives, time) are left out; these are the small
cross-cutting seams every future feature will hit.

| Code | Gap | Why it gets harder later | Nearest existing rule | Evidence |
|---|---|---|---|---|
| G1 | **Effect composition.** One resolver for how bonuses combine: named source, stacking group, stage order (base, flat, percent, conversion, caps), and a "why this number" breakdown. | Furniture (AD31), titles (AD30), skills (SLR8), cheats, body (BHR23) and gear each add bonuses. Without one order, every new source invents its own math and OP stacks stop being readable. | BHR23 (bodies only), SLR8 (names the layer, not the order) | `src/active_effects.js:34` TODO on potency versus `group_tags`; no doc mentions an order of operations |
| G2 | **Every change carries its cause.** A mutation through the transaction owner records actor, action, source ID and game time. | Return recap (AD17), cause-driven threats (AD25), site aftermath (SR), "why?" panels and debugging all need to ask what caused this. Retrofitting causes onto old state is lossy. | AR3 (one transaction owner, so the hook point exists), GR1 receipts (generators only) | Causes appear ad hoc as `cause:` fields in about 60 src files |
| G3 | **Catch-up equivalence and one interrupt ladder.** Away simulation gives the same outcome class as live play of the same routine, within declared approximations. One shared priority list decides what stops a routine. | AD16 says routines stop at "important choices" without defining important. Each new activity will define its own stop rule and offline results will drift from live ones. | AD16, GR17 (game time, not ticks), MR28 | "interrupt" and "catch-up" discussed in about 140 palette docs, no rule |
| G4 | **Align vocabulary through the existing tag owner.** Reuse `src/tag_store.js`; define shared meanings and world-qualified aliases where actual consumers need them. | GR7, BHR23 and AD38 need compatible selection and mechanism descriptions. A new parallel registry would duplicate an existing seam. | GR7, GR8, BHR23; `CRAFTING_ENGINE` already names the tag store | Earlier "none owns one" was too broad; vocabulary gaps still need a concrete consumer before expansion |
| G5 | **Content lifecycle for IDs.** ~~Retiring, splitting or merging an ID a save references leaves a tombstone and a mapping in a migration.~~ Revised in round 2: content IDs can be retired freely with no migration. Only remaining default: loading a save with an unknown ID drops it with one log line instead of crashing. | Weibao, 2026-10-18: no need to worry about safe migration here. | WA9, AR6, GR10 | No rule on removal |
| G6 | **Quantity scales per world and conversion at the carry edge.** Each world declares its measure for power, money and time; carrying converts through a named rule. | AD28 makes power relative and WA14 declares carry per edge, but a level-90 sword or 1,000 spirit stones crossing worlds has no unit. | AD27, AD28, WA14, Rulebook 5 | No "scale conversion" in any owner doc |
| G7 | **Modules are named for the domain they own.** Wave and dispatch names live in checkpoints, not filenames. | 93 of 539 src files are named for agent waves (`audit_remainder_*`, `feature_expansion_*`, `backlog_expansion_*`, `absorb_*`). Finding the owner of a fact gets slower with each wave. | AR1, AR2, AR13 | `ls src` |
| G8 | **Reuse and catalog existing disposable fixtures.** `tests/fixtures/rt_slice1/` already has seeded native exports, and `tests/fixtures/perf/` has performance fixtures. Record scenario, provenance and version before extending coverage. | Existing fixtures can support current-state persistence and populated UI checks; do not assume the same fixture proves natural acquisition or every world. Old-save migration is currently deferred. | AR6, GR16, UI_RULES, AD36 | Existing fixture README and helper; the earlier claim that no shared fixture set exists was too broad |

Smaller, cheap to add when touched:

- G9 **Shown rounding versus stored truth.** Stored values stay exact; display rounding is one shared formatter so two panels never disagree (AD8 says own stats are exact).
- G10 **One canonical game-time unit** for durations in data, converted only at display, so world calendars (AD15) do not leak into stored numbers.

## Suggested order

G1, G2 and G3 first: each is cheap now at a single existing seam (effects
resolver, transaction owner, away runner) and costly once more features ship.
G7 and G8 are process rules that can land with the next structural round (AR9).

## Round 2: frozen-world idle and G5, 2026-10-18

Weibao: "G5 we dont need to worry about safe migration, more to consider?
Consider Idle mode where time doesnt move? more to consider?"

Reading of the idea: the self keeps progressing (practice, meditation,
crafting from carried stock) while the world clock stands still. In-world
routes include a time-stop cheat, a time-chamber or pocket realm, a dream or
mind palace, an inner world or soul space, and spending the banked time of AD18.
It is the same thing the game already does to inactive worlds (AD16 pauses
them), so it generalizes an existing behavior rather than adding a new one.

| Code | Finding | Why it matters |
|---|---|---|
| G11 | **Two clocks: world time and personal time.** Each world has its own clock (already implied by AD4 and AD16). The self has a personal clock that always advances while it acts. A **time ratio** dial links them: 1 is ordinary play, 0 is frozen-world idle, other values are dilation (a world where a day outside is a year inside). | Frozen idle, inactive-world pause, time chambers and dilation worlds become one mechanism with one dial, set per world and means ("limits are adjectives"). |
| G12 | **Durations name their clock.** Body aging, hunger, wounds, buffs, skill rust and practice use personal time by default (AD13, bodies are real: you age in the chamber). Crops, markets, NPC plans, threats, seasons and canon events use world time. | Without this, the first frozen-time feature has to guess whether `Bleeding`'s 15-minute cap in `src/active_effects.js` runs. Folds G10 in. |
| G13 | **Draws key on both clocks.** GR17 keys daily draws on the in-game day. With the world frozen, every practice draw would land on the same key and repeat. Key self-side draws on personal time. | Prevents frozen idle from rerolling the same result forever or, worse, granting the same lucky draw every minute. |
| G14 | **What works frozen follows mechanism (AD38).** Anything needing the world moving (other people, trade, teachers, crop growth, restock, travel) does not happen. Self-contained acts do. Supplies are still consumed (MR5) unless the realm's own rule says otherwise. | Defines the mode without a permission list; the world's mechanisms decide. |
| G15 | **Hour-locked activities freeze at their hour.** `src/activity_time.js` gates by `current_game_time.hour` and season. Frozen at 3 a.m., day-only activities stay closed; a pocket realm may carry its own fixed light. | A subtle bug class before it ships. |
| G16 | **Frozen idle uses the shared interrupt policy.** Ordinary outside processes pause with their clock; self-side supplies, injury and choices still interrupt. A means that crosses the frozen boundary can interrupt too (see round 4). | Keeps G3 small and makes frozen idle safe to leave running. |
| G17 | **Frozen time follows its means, including any real cost.** Fuel, aging, supply drain or isolation can matter when the mechanism causes them; an extraordinary means can also make them negligible or absent. | Threats and rivals freeze under the selected clock law. Do not add a balancing tax solely because time control is powerful (AD22, AD28, AD38). |

### ACT NOW (done)

- G5 rewritten above per Weibao's instruction; recorded in
  [USER_VISION](../USER_VISION.md#content-id-retirement-and-frozen-world-idle-2026-10-18).
- G11–G17 saved here. G10 is folded into G12.

### ACCOUNT FOR NOW

- When G1 (effect resolver) or G3 (away runner) is drafted, each duration
  field names its clock and the runner takes a separate world delta and
  personal delta. `computeAway` in `src/away_ledger.js` already has
  `gameMinutesPerRealMinute` and barriers; a future integration should reuse its accounting where it fits (AR3). The
  current API has one positive rate and no separate personal/world deltas;
  frozen idle is not supported by passing a zero rate (round 4 G27).
- G2 cause records carry both clock readings.

### LATER / DELEGATE

- **Frozen-world idle slice.** One means (spend banked time from AD18, or a
  pocket realm) that runs solo practice with world delta 0, shows both clocks
  in the recap (AD17) and survives save, reload and import. Level: strong
  runtime agent; effort: medium; done check: rebuilt browser journey at
  1920×1080 where an hour of frozen practice raises skill and personal age
  while the world date and crop timers stay unchanged.
- **Both clocks in the UI.** World date plus personal elapsed time or age in
  the top bar, under UI_RULES. Level: UI agent; effort: small; done check:
  rebuilt browser evidence at 1920×1080 and 1366×768.

## Round 3: when the world keeps moving, 2026-10-18

Weibao: "What should we do instead? if the world moves while this game is
idling, what should happen? There seems to be so much to consider, will things
just past by? what happened in yair normally? What ideas did we have for this
before?"

### What the game does today (shown in code)

- The world runs only while the page is open: one tick per real second
  (`tickrate: 1` in `src/config.js`), one game minute per tick, with drift
  correction in `update()` (`src/main.js:8670`). A background tab keeps ticking.
- Closing the page stops everything. There is no player offline progress:
  `fastForward` runs only behind a test hook, with the comment "No player offline
  policy exists yet" (`src/main.js:9308`). `computeAway` in
  `src/away_ledger.js` is a pure, unwired ledger with caps, a game-minutes rate,
  barriers and banking.
- While the page is open and unwatched, live events fire with no "important
  choice" stop. Inferred from the loop; not exercised for this report.

### What is already decided (2026-10-15)

| Decision | Content | Owner |
|---|---|---|
| OD4 | Chosen routines progress while away, stop at important choices or exhausted supplies, with a return summary. Inactive worlds pause. | [PROJECT](../../PROJECT.md) |
| Offline calendar | Ordinary away progress advances the current world's calendar. Aging depends on world and settings; means and cheats can change both. | [USER_VISION](../USER_VISION.md#offline-world-time-decisions-and-responsibilities-2026-10-15) |
| Current-world pause | An important unresolved choice stops current-world catch-up at that moment, including linked deadlines and same-world production, unless policies, helpers or cheats allow continuing. | [USER_VISION](../USER_VISION.md#current-world-pause-and-unused-offline-time-2026-10-15) |
| Time bank | The unprocessed remainder is banked, follows the journey and is spent later on forward play. | [DIRECTION_SYNTHESIS](../DIRECTION_SYNTHESIS.md#banking-unused-offline-time-consideration-2026-10-15) BT1–BT5 |
| OD15 | Recap shows only what means allow. "Time not passing but earning the benefits" is a requested unlock, not a default. | [DIRECTION_SYNTHESIS](../DIRECTION_SYNTHESIS.md#time-free-benefits-and-offline-calendars-consideration-2026-10-15) |
| Proposals | DR1–DR5: standing instructions, commitments, delegation, meaningful stops, clock fairness. DR5 already warns that freezing danger while keeping production is an unexplained time cheat. | [CHARACTERS_AND_WORLD_EVENTS](../CHARACTERS_AND_WORLD_EVENTS.md#offline-decisions-and-responsibilities-consideration-2026-10-15) |

So round 2's frozen-world idle is the OD15 unlock, not a replacement. The
default is already "the current world moves, and stops for you at what matters."

### Findings

| Code | Finding | Why it matters |
|---|---|---|
| G18 | **Correction to round 2.** G11's time ratio defaults to 1 for the current world and 0 for inactive worlds; frozen idle is a means that sets it to 0 for the current one. | Keeps round 2 consistent with the accepted offline calendar decision. |
| G19 | **Known events can become policy stops.** Known deadlines, scheduled events, foreknown canon dates, a rival's known plan and your own commitments are candidates for barriers under G20, rather than automatic stops. `computeAway` already takes supplied barriers. | A stop pauses catch-up at its boundary under AD16; it does not extend the event window. Foreknowledge can support more watch-list entries. Unknown events can still require a safety stop when their consequences reach the character (round 4 G26). |
| G20 | **Per-category standing orders: stop, handle, let pass.** One small setting per event category (visitors, offers, threats, market swings, canon events) instead of a decision tree. "Handle" uses DR1 policies and DR3 helpers. | Turns "so much to consider" into three choices the player sets once. |
| G21 | **Missing something leaves aftermath, not a hole.** A passed event changes the world (site aftermath, canon flows on under AD2), shows in the recap through means (AD17), and leaves hooks: a rumor, a ruin, a new opening. Opportunity windows have their own length, set per world. | Missing things becomes story. AD20 and AD4 keep later routes open. |
| G22 | **The character is there even when you aren't.** Away routines are the character living; things that would reach them still do, such as a raid on the village while they farm. Danger uses forgiving recovery (AD19) and the standing orders in G20. | Avoids a ghost character the world ignores. Gives away time stakes without forcing logins. |
| G23 | **One runner for every case.** Live play, open-tab unwatched, closed-tab catch-up, spending banked time, compressing settled routines (OD23) and frozen idle are one runner with different world and personal deltas, barriers and orders. | Same results whichever way time passes (G3). Avoids five slightly different simulations (AR3). |
| G24 | **Unwatched open tab needs the same stops.** Today an open background tab plays straight through events that a closed tab would stop at. A "not looking" state (tab hidden or no input for a while) applies the G19 barriers live. | Otherwise leaving the tab open is worse than closing it. |
| G25 | **Catch-up should be fast enough to feel instant.** Simulating a long absence tick by tick is slow; settled routines can be summarized per hour or per day with the same result class (GR17 keys on game time already). | A slow return screen stops anyone wanting to be away. |

### ACT NOW (done)

- Round 2 corrected by G18; current behavior and prior decisions recorded above.

### ACCOUNT FOR NOW

- Player watch-list barriers for G19 come from the knowledge projection
  (AR8). Safety and content boundaries are checked internally too, with
  observer-safe explanations rather than hidden event IDs (round 4 G26).
- G20 categories reuse DR1 policies and DR3 delegation; no new authority.

### LATER / DELEGATE

- **Away with a watch list.** Wire `computeAway` to closed-page absence for one
  Village routine, with barriers from two known event kinds and a recap that
  shows what was processed, what stopped it and the banked remainder. Level:
  strong runtime agent; effort: medium; done check: rebuilt browser journey at
  1920×1080 where an absence crosses a known event, stops there, banks the rest,
  and survives save, reload and import.
- **Standing-orders panel** (G20) under UI_RULES once the watch list exists.
  Level: UI agent; effort: small; done check: rebuilt browser evidence at
  1920×1080 and 1366×768.


## Round 4: latest audits together, 2026-10-18

Weibao: "based on the latest audit plans and rules and stuff, consider if we
missed anything?" More-to-consider pass, proposals only (AD32). This extends
G1–G25; it does not start another topic audit, dispatch workers or select a build.

### Evidence and scope

Read the current rules router and accepted direction, world-kit/body/combat/
economy core-audit entries, BHR/CBR/ECR/SLR/WA/GR coverage, making and architecture
rules, story/content-edge round 6, and the existing engine proposals N1–N8 and
MX5–MX8. Inspected `src/away_ledger.js`, `src/domain_registry.js` and
`src/native_trade_transaction.js` for the specific seams below. This is a
bounded document/source pass, not a whole-runtime audit or browser verification.
No claim that a topic is absent from every project file.

The individual audits already name most domains. The useful additions are
**composed scenarios and the exact handoff between owners**, rather than another
universal rulebook. Relevant standing codes: AD5, AD6–AD8, AD14–AD18, AD19,
AD22, AD32–AD36, AD38; AR3, AR7–AR12; MR1–MR5, MR29, MR31. ECR/CBR/SLR/WA,
GR and N/MX specifics retain their own proposal status.

### ACT NOW (done): correct overclaims in this report

G16 and G19 above now distinguish ordinary frozen processes from means that
can cross the boundary, and a chosen watch list from safety stops. Earlier
wording made every known event wait and every unknown event pass, which was
stronger than AD16 and conflicted with G22's character-presence point.
The round-2 runner paragraph now states its actual API limit.

G8's old-save motivation is historical: the accepted 2026-10-17
[compatibility decision](../USER_VISION.md#old-save-compatibility-deferred-2026-10-17)
permits dropping/resetting old state. Reusable **current-version** populated
fixtures still help, and newly built state still needs Save/reload/Export/Import.
This pass adds no backward-compatibility gate. G11's two-clock model is a first
case, not a universal identity model: multiple bodies, souls and pocket spaces
may need different clock owners. Banked time is credit for forward processing,
not by itself a means that freezes a world (AD18 versus OD15).

### ACCOUNT FOR NOW

| Code | Finding and evidence | Consequence / proposed default, dial and reason | Observable case when the seam is selected |
|---|---|---|---|
| G26 | **Separate a watch-list stop from a safety stop, then filter its explanation.** G19 used knowledge alone; CBR27 proposes unseen combat-risk stops, while MR1 says unknown properties still act. | The simulator checks real consequences internally; player policies use known facts. A hidden cause can reach a downed state, a meaningful choice or a content boundary without its name entering the recap. Default: pause at the relevant decision boundary, explain only perceivable facts. Dial: forewarned harsher policies and actual sensing means. Reason: safety must not require omniscience, and warnings must not identify a hidden truth. No promise to stop before every unknown danger. | Synthetic hidden hazard changes truth identically before/after identification; the stop does not reveal its source ID or type. Identification changes the explanation and available policies, not the underlying effect. |
| G27 | **Time needs a settlement receipt, not just clock dials.** `computeAway` rejects a rate of zero, accepts only one elapsed rate, selects barriers with `at < applied`, and on a barrier retains pending wall time rather than adding that remainder to `bankedMinutes`. | G11/G23 describe a target, not an integrated dual-clock runner. Default: name whose clock advances, the exact stop instant, and whether each unused unit remains pending or becomes bank credit, with one owner settling it. Dial: world/personal/space clocks and means-dependent ratios. Reason: replaying a pending interval and also banking it duplicates progression. Endpoint equality and simultaneous barriers need an explicit result, not an inferred bug verdict. | Compare one long interval with segmented intervals, including a barrier exactly at the endpoint, two barriers at one instant, and save/resume. Processed plus pending/banked credit accounts for the interval once; frozen practice needs a real personal delta, not a zero rate passed to today's API. |
| G28 | **Interrupting work must settle its intermediate state.** MR29 has stage timelines, crafting SP3 distinguishes cancellation before/after commit, AR7 revalidates commands, and CBR25 prices retreat. These do not alone decide what happens when one interrupts another. | Default: the activity owner records the last completed stage, spent inputs, reserved stock and any real intermediate product before combat, travel or a content-edge park takes control. Dial: a brew can spoil, a rune can retain strokes, a service can refund by its terms. Reason: one universal rollback or refund would erase real mechanisms. Keep native atomic trade atomic; do not impose a staged job on every click. | A synthetic interrupted craft, followed by resume/abandon and Save/reload/Import, neither consumes stock twice nor grants a finished product early. No new persistence feature is selected here. |
| G29 | **Effect chains need an explicit resolution boundary.** G1 covers bonus arithmetic; engine N2 already proposes queued post-commit reactions and MX5 names contested-resource ordering. Those are existing owners, not missing ideas. | Extend the selected scenario to reflect damage, healing, defeat publication and reward reactions together. Default: commit one cause, enqueue reactions in a declared stable order, then publish the resolved outcome at its defined boundary. Dial: simultaneous outcomes and world-specific replacement effects. Reason: reflected damage or rescue should not depend accidentally on listener registration order. A technical work limit suspends remaining processing with diagnostics; it is not an invented in-world cap on legitimate chains (AD22). | Two actors can down each other on one action; defeat/recovery and rewards publish once per actual outcome. Reordered unrelated registrations do not change the result; a long chain can stop and resume without losing queued work. |
| G30 | **Mechanism, knowledge and implementation coverage are different answers.** AD38 allows what mechanisms support; WA8 keeps source unknowns open; RLCE1/RLCE10 separately name unbuilt mechanics and small unavailable actions. G4's tag registry cannot resolve these distinctions by itself. | Default: distinguish "cannot work here", "character cannot yet judge/perform it", and "not implemented" at quote/projection boundaries. Tags describe properties and help select applicable mechanisms; a missing selector tag is not proof that the world's laws forbid the action. Dial: source-qualified world laws and supported experimentation. Reason: otherwise a pack checklist quietly becomes the permission list AD38 rejects. | One improvised-tool case succeeds through its supported physical mechanism; an unbuilt verb reports its coverage honestly; an unknown property stays hidden. No unrestricted natural-language action interpreter is implied. |

These cases connect the existing body/combat, skills/making, economy/custody,
clocks and story owners. Their presence here is not a demand to build all those
systems before the next playable slice. Mobile, NPC-heavy simulation and
procedural layouts retain their deferrals. UI evidence, when any case is built,
uses 1920×1080 plus the 1366×768 floor and the existing surface owner.

### LATER / DELEGATE

| Code | Bounded follow-up | Level / effort | Done check |
|---|---|---|---|
| G31 | Attach the G26/G27 synthetic stop-and-resume case to the next authorized away-time slice, reusing `computeAway` tests and the selected integration owner. | Strong runtime agent, medium; no dispatch now | Focused source checks plus rebuilt desktop journey, current-state Save/reload/Export/Import and observer-safe recap. Record pending versus banked time explicitly. |
| G32 | Attach **one** of G28–G30 to the next slice that actually touches that seam, linking the existing domain owners rather than copying this table into each rulebook. | Strong cross-domain agent, small planning step; runtime effort depends on the chosen case | Brief names producer, state/transaction owner, consumer, failure case and one useful played consequence. Existing mandatory gates remain; unrelated cases stay later. |

### Verification and limits

Documentation-only edits. Relative links in this report and its idea-index
entry checked. `npm run check:rules` FAIL: AD38 precedes AD10 in the existing
rules index, producing 29 ordering errors; one warning names the already
untracked `WORLD_ABSORPTION_RULES.md`. This pass did not edit either file.
No missing-link error was reported by that check.
The source observations above describe inspected inputs, not exercised gameplay.
No runtime edits, rebuild, agent dispatch, commit or push in this pass.

## Plan/rule follow-through, 2026-10-18

Weibao requested updating the plans/rules and checking other audits. The
[reconciliation report](PLAN_RULE_RECONCILIATION_2026-10-18.md) owns that docs-only
execution and coverage. G26–G30 now link to actual rule/plan applications; no
standalone feature bundle is selected. The earlier AD38 check failure above is
historical and repaired by this follow-through. Original source observations and
unexercised gameplay limits remain exact.

### Further corrections from the plan pass

G4 now reuses the existing `tag_store.js` owner instead of claiming no registry
exists. G17 now allows a cost-free or extraordinary time means when its mechanism
supports it; power alone does not require a balancing tax. ECR15 now distinguishes
conserved transferred quantities from economic value: arbitrage need not conserve
valuation between markets. These are core-rule corrections, not new feature work.

G8 likewise now points to existing `rt_slice1` native exports and performance
fixtures. Their documented seeded-native provenance is not natural acquisition
proof; the next consumer should extend a named missing scenario rather than build
a replacement library by default.
