# Packet re-trace C1 to C7, with tests read (2026-11-03)

Research only. Proposals (AD32); nothing here selects or accepts work. Redoes the
keyword-only pass in [PACKET_RECONCILIATION_2026-11-03](PACKET_RECONCILIATION_2026-11-03.md)
by reading producer, state owner, consumer and the covering tests.

Evidence labels: **read** = I read that code or test in this pass. **inferred** = reasoned from read code, not confirmed by running it.
Run: one focused test file per item with `node --test` (all passed, noted per item). Nothing built, no browser, no full suite.
Packet sources: `docs/research/{ngu-idle,theory-of-magic,your-chronicle,immortality-idle}/IMPLEMENTATION_PACKETS.md`.

## Summary

| ID | Packet | Verdict | Already there (read) | Gap | Smallest seam | Test file to extend | Save impact |
|---|---|---|---|---|---|---|---|
| C1 | NGU P1 renewal numbers | **small** | Preview returns raw `mastery`, `reserve` (structured) and static lost/retain text (both). Stale-sequence, failed-publish and reload tests exist | No current/next/reactivation rows; structured UI sanitizer drops the numbers | `previewFieldRenewal` (frontier_campaign.js) and `previewStructuredRenewal`; one line each in the two panels | `tests/frontier_campaign.test.js` (L62), `tests/structured_renewal.test.js` | none |
| C2 | Arcanum P7+P5 reading row | **small** | `start_reading_display` shows only "X left". The finished-book tooltip already formats bonuses, skills, recipes | Row and unfinished tooltip say nothing about what finishing allows | Pure helper in a leaf module reused by tooltip and row (display.js net zero) | new small pure test (display.js has no DOM test) | none |
| C3 | Your Chronicle P4 reading step | **large** | Work plans take command/travel/wait only. Native reading is `is_reading` plus `book_stats` in main.js, outside expansion state | A plan cannot own or bound a native reading step | New staged adapter plus new step kind; cross-owner | `tests/routine_jobs.test.js` plus `tests/reading.test.js` | yes (new step kind in `workPlans`) |
| C4 | Immortality Idle P2 aptitude | **medium** | Aptitude carrier and consumer exist for the continuation path (purchased anchors). Heir path carries no skill | Gain-derived value, heir carrier, one summary line | `deriveHeirLeftovers` plus `skillRecords` slice; merge in `apply()` | `tests/heir_inheritance.test.js`, `tests/skill_records_persistence.test.js` | yes (optional field) |
| C5 | NGU P3 activity board | **medium** | "Current work & saving" module lists the player's jobs as strings. Resident jobs and `projectAcceptedWorkLegibility` exist | No second-actor row, next result, remaining commitment or stop reason | New workspace module over `simulation.jobs` and `workPlanView`; move the inline read out of main.js | `tests/home_household.test.js` (projection), `tests/reports_dock.test.js` style for pure rows | layout only (localStorage), no save |
| C6 | NGU P7/T15/T16 target and return | **small** | `workPlanView` exposes status, steps, reasons, accepted job, `lastResult`, stock fields | `goal` and target kind not exposed; no "released means" rows | Extend `workPlanView` (pure projection) | `tests/routine_jobs.test.js` | none |
| C7 | Immortality Idle P3 named plan | **medium** | `programs[actor]`: one command, a count, status. Work plans have a `goal` predicate | No name, no second plan, no switch, no start-of-life plan, no generic skill fact | Optional `name`/`next` on the program record, evaluated in the existing program loop | `tests/simulation.test.js`, `tests/routine_jobs.test.js` | yes (optional field) |

Test runs (all green): structured_renewal 5/5, frontier_campaign 11/11, routine_jobs 19/19, heir_inheritance 7/7, reports_dock 3/3, simulation 28/28.

Rules that apply to all seven: AD32 (proposals), AD34 and UI rules (desktop first, evidence at 1366 by 768), AD36 (lean tests, one focused file per lane), AD43 (six-line floor before "done"), AD45 (current shape is replaceable), AR1 (main.js net zero), AR3, AR7, AR8, AR10 (journey, not a pure module). No AD or AR blocks any item. Stale anchors found in the packets are listed under each item.

## C1. NGU P1: numeric current/next/reactivation rows in the renewal preview

**What exists (read).** Two renewals share the shape.
- Field renewal: `previewFieldRenewal` (`src/frontier_campaign.js:99`) wraps `previewCampaignTransition` (`src/simulation.js:736`), which returns `lost`/`retained` copied from the transition's authored text. It then overwrites `lost` with two fixed sentences and `reward` with "+1 route preparation, once". The commit (`:104`) sets `powers.player["field.load_step"].mastery=1`, deletes `completed["field.practice_step"]`, and zeroes `reserve` and `strain` of `field.focus` and `field.drive`. `src/frontier_campaign_ui.js` renders `Lose: ... Keep: ... Gain: ...` as one sentence (`terms.textContent`, L47ish) with no numbers.
- Structured renewal: `previewStructuredRenewal` (`src/structured_renewal.js:26`) already returns `mastery` and `reserve` as live numbers, but `src/structured_pack_ui.js:24` rebuilds the view and keeps only `visible, eligible, label, description, lost, retain, reward, reasons`. The numbers never reach the panel (`:113-118` prints the static strings).
- Reactivation condition is present as data: `field.practice_step` (`src/field_workshop.js:77`) is visible at mastery 1, costs 2 min and 1 stamina, and is `once`, which is why the commit deletes its completion.

**Tests (read).** `tests/frontier_campaign.test.js:62-70` previews, checks `preview.sequence`, a stale sequence throw, reload, and the legacy source. `tests/structured_renewal.test.js` covers validation, exact three-value reset (`expected` deep equal), failed durable publish rollback (`persistExpansionPlan` with a throwing store), refusals, and relearn plus retained legacy. Neither asserts displayed numbers equal committed numbers.

**Smallest change (inferred).** Add `current` and `next` rows built from the same fields the commit mutates (mastery, `field.focus`/`field.drive` reserve and strain), plus a `reactivation` row from the registry command (label, duration, stamina). Return them from `previewFieldRenewal`; for structured, derive `current/next` from `methodKey`, `reserveKey`, `legacyKey` and pass them through the `:24` sanitizer. One render line in each panel. No new state, no new command (AR3, AR7, AR8).

**Failure scenario.** Mastery 2, focus reserve 5, drive strain 3: preview must read 2/5/3 now and 1/0/0 next, and after `commitFieldRenewal` the live values must equal the previewed `next`. Also an energy record that does not exist yet must render 0, not undefined. Extend the L62 test and the structured "exact three values" test.

**Persistence.** None; pure projection. **Constraints.** AD34 (check at 1366 by 768), UR rules on exact numbers for own stats (AD8: own stats are exact, so showing them is allowed). The packet's "no copied NGU numbers" holds. **Run:** structured_renewal, frontier_campaign pass.
**Verdict: small.** One caveat: the two panels differ, so "one packet" is two small joins.

## C2. Arcanum P7+P5: reading row says what finishing allows

**What exists (read).** The reading row is `start_reading_display` (`src/display.js:5303`): `Reading the book, <time> left`, a progress bar and a stop button. The packet's anchor `display.js:4457-4471` is stale (that range is now attribute notes), and `items.js:1092-1152` / `1128-1131` point at Cape/Ring code; books are `items.js:1155-1217`. Finish side (`src/main.js:4028 do_reading`): adds Literacy XP, `character.addBookBonus`, `process_rewards(book.rewards)`. Data on each book is `bonuses`, `rewards` (skills, recipes, flags, locations) in `BookData`.
- The finished-book tooltip (`display.js:730-755`) already prints "Reading it provided ...": `format_book_bonuses(bonuses)`, "a new skill/new skills", "a new recipe/new recipes". The unfinished tooltip prints only "Time to read".
- Literacy already speeds reading: `readingRate` (`src/reveal_chain.js:67`, +5% per level to 10), tested in `tests/reveal_chain.test.js` ("literacy speeds original work units"). That is the P5 half; no row states it.
- A hard-coded finishing gate exists: `referenceKnown` in `main.js` (~9900) opens the Reading reference desk once `ABC for kids` or `Old combat manual` is finished. The row could name that.

**Tests (read).** No test touches `start_reading_display` or the tooltip. `tests/loot_log.test.js` and `tests/world_calendar.test.js` read `display.js` as source text only. `tests/helpers/native_loader.mjs` stubs display.js, so display code cannot be unit-tested directly.

**Smallest change (inferred).** Move the reward text into a pure function in a leaf (for example next to `format_book_bonuses` data in misc.js or a new small module): input `book_stats[title]` plus Literacy level, output `finishLines` (bonuses, "a new skill", "a new recipe", reference desk) and the reading-speed line. Call it from the unfinished tooltip and from `start_reading_display`. AR1: display.js must shed a line for every line added, which the move of `format_book_bonuses` supplies. Exclude the Anthology (p23 owner, `ANTHOLOGY`), which reads through expansion state.

**Constraint to honour.** AD3/AD6/AD9 and sealed secrets: show categories only ("a new skill"), never names or flags of hidden unlocks. The existing finished tooltip already follows that.

**Failure scenario.** A book with `rewards.skills` of two ids and a `xp_multipliers` bonus must show "new skills" and the multiplier before reading starts, show nothing for a book with empty rewards, never show recipe or skill names, and not appear for the Anthology.

**Persistence.** None. **Test file.** A new pure test (there is no existing display test to extend). Not run; no cheap display test exists.
**Verdict: small.**

## C3. Your Chronicle P4: native reading/study step in work plans

**What exists (read).** `validateStep` (`src/feature_expansion_work_plan.js:50`) accepts `command`, `travel`, `wait` and nothing else (`keysOnly` per kind). Plan advance (`advanceOne`) is staged and pure: it clones state, previews and commits simulation commands, and never touches native game variables. Native reading lives outside that: `is_reading`, `start_reading`, `do_reading`, `end_reading` in `src/main.js` (~3960-4050), progress in `book_stats[...].accumulated_time` (native save), rewards through `process_rewards`. Only the Anthology reads through expansion state (`p23Reading`, `planReadingCommand`, `src/absorb_p23/reading/runtime.js`), with its own staged result (`studyPlan`, `actStudy`, `main.js:855`). A native occupation descriptor `native.book.<id>` exists at `main.js:697-705` for the repeat search, and shows the seam is informed of reading but not driven by it.

**Tests (read).** `tests/routine_jobs.test.js` (19 tests) covers the reserve plan, mixed itinerary, refund, hold and quota rejection. `tests/reading.test.js` covers the Anthology only (start, pause, settle once, replay no XP, host envelope). Nothing covers a native book inside a plan.

**Smallest change (inferred).** Not small. Needs (1) a new step kind (`read`) with a version, (2) a staged adapter that turns "N played minutes of native book B" into the same envelope the Anthology uses, so XP, `finish_reward`/`rewards` and `setAsFinished` publish once, (3) a `workPlans` validator change, (4) a host join in main.js (AR1 net zero). Because `book_stats` is native-owned, AR3 (one authority per fact) means the plan may not copy progress; the cursor can only carry book id, minute budget and the receipt boundary, as the packet says. The cheaper variant, reading only the Anthology as a command, reuses the existing p23 path but is not "native reading of a held unfinished book".

**Failure scenario.** Five-minute reading step on a book with 3 minutes left: the book finishes at minute 3, XP and rewards arrive once, the step ends early, the cursor advances to the paid kit command; a failed save mid-step leaves no duplicated XP or unlock; reload mid-step resumes from native progress.

**Persistence.** Yes: `workPlans` schema (`WORK_PLAN_SCHEMA = 2`) and `keysOnly`/`validateStep` change, so the validator rejects the new step on older code. Per `docs/SAVES.md` (2026-10-17 decision, G3 exact-field validators) a recorded compatibility decision suffices; new state must still round-trip save, reload, Export and Import. Bumping to a new schema also forces the `state.schema` gates seen in `startWorkPlan`.

**Constraints.** AD16 (away time runs chosen routines): a reading step interacts with offline catch-up, which the packet leaves unselected; keep it out. AR10/AD43: needs a rebuilt browser journey. **Run:** routine_jobs passes.
**Verdict: large.** Blocked on nothing external, but it is the most expensive of the seven and YC-P1 (the late archive index) depends on it only as a dependency note, not as a gate.

## C4. Immortality Idle P2: gain-derived aptitude

**What exists (read).** Two life paths, only one carries skills.
- Continuation path: `src/continuation_state.js` stores `mastery[skill]` (max XP observed, `observeContinuation` L100-105) and restores compatible skills on rewind (`restore`, L119-128). `src/continuation_retention.js` has the aptitude carrier: `retention.anchors[skill]` bought with insight or coins (`purchaseAnchor`, cost `50*(n+1)`), and `aptitudeMultipliers` = `1+.05*log1p(mastery/100)*sqrt(anchors)`. Consumer: `skill_records_domain.js:apply()` writes it to `xp_bonuses.multiplier.aptitude`, multiplied into XP gain at `src/models/person.js:614`. Display: `continuation_ui.js:80`.
- Heir path: `deriveHeirLeftovers` (`src/heir_inheritance.js:81`) and `applyHeirLeftovers` carry money, goods, home, reputation, papers, debts, lineage. Its comment says skills and XP "stay their own". `buildLifeHeirSave` (`life_experience_host.js:12`) builds the heir from a fresh envelope. `heirLeftoverLines` (L188) is the ended-life dialog text. `lifeSummary` exists in `skill_records.js:57`.
- The packet's anchors are stale: `commitCampaignTransition` is `simulation.js:748` (not 565) and the skill XP scaling is in person.js.

So "carrier and consumer exist" is true only for the continuation path, and its input is purchased anchors times cumulative mastery, not gain. The heir path has neither a carrier nor a consumer.

**Tests (read).** `tests/heir_inheritance.test.js` (7: goods, papers, grievance, debt, empty heir, old-save validity, law dial), `tests/life_experience.test.js:44` (heir envelope keeps pristine XP, `total_xp` 0), `tests/skill_records_persistence.test.js` (rust preference only), `tests/continuation_state.test.js` (not read in full).

**Smallest change (inferred).** (1) In `deriveHeirLeftovers`, compute per-skill gain from `previous.levels.person.main_character.skill_xp` (heir bodies start at zero XP, so final XP is the life's gain without a snapshot) through a per-world divider and diminishing curve, giving `leftovers.aptitude`. (2) Persist on the heir through the existing `skillRecords` slice as an optional `aptitude` map. (3) `apply()` multiplies it with the continuation multiplier instead of overwriting `multiplier.aptitude`. (4) One line in `heirLeftoverLines`. Without (3) the two carriers would clobber each other (inferred from `apply()` assigning the whole object).

**Failure scenario.** Life A: 5000 Woodcutting XP, Life B: no practice. A's heir shows a Woodcutting aptitude line and a multiplier above 1 on that skill only; B's heir shows none; reload and Export/Import do not apply it twice; a heir of a heir does not compound beyond the curve; a continuation save with anchors still yields its own multiplier.

**Persistence.** Yes: optional `skillRecords.aptitude`; absent means neutral. `validateSkillRecords` checks listed fields only (inferred from L20-21), so older saves load, but new data must validate. Per SAVES G3, record the compatibility decision.

**Constraints.** AD10-AD14 and AD11 ("what carries can improve"; carrier needed), AD46 (each world picks its own version: the divider is a per-world dial, default off), AD22 (limits are adjectives, no fixed "once"), AD28 (everything can become OP; compounding is acceptable but bounded by a curve). No conflict. **Run:** heir_inheritance passes.
**Verdict: medium.**

## C5. NGU P3: desktop activity board

**What exists (read).** `createWorkspaceViews` (`src/workspace_views.js:10`) registers a centre module `current-work` ("Current work & saving") whose `work` is an array of strings built inline in `main.js:9955-9968`: native activity, sleeping, reading, combat, then `expansionState.pending` and `simulation.jobs` filtered to `actorId==='player'`, each as `<label>: N min remaining`. It shows no resident row, next result, remaining commitment or stop reason. `src/today_strip.js` (`runningCommitments`) counts only `expansion.pending`, not `simulation.jobs` (inferred gap). `src/reports_dock.js` shows Next step, Now, Open here, Running count for a short log. The Work ledger module (`work_ledger_ui.js`) is a separate tabbed panel.
- Building blocks: `registerWorkspaceModule` with docks left/centre/right/float (`workspace_layout.js:114`); `projectAcceptedWorkLegibility` (`action_legibility.js:254`) returns remaining text, cancellation policy, costs and reservations for any actor, and returns null unless the observer knows that actor's terms (`:256`); `workPlanView` gives next step, reasons and last result.
- Layout is stored in the browser (`localStorage`, `workspace_layout.js:25-32`), not in the save.

**Tests (read).** `tests/home_household.test.js:16,36-37` covers `projectAcceptedWorkLegibility` for a resident cook (null for an observer without terms, populated for the owner). `tests/reports_dock.test.js` (3 tests) covers pure `dockRows`. `tests/workspace_composition.test.js`, `tests/layout_spec.test.js`, `tests/workspace_spec.test.js` cover layout normalisation. No test covers `createWorkspaceViews` or the inline `work` read.

**Smallest change (inferred).** A pure `activityBoardRows(state, registry, context)` in a leaf (next to `action_legibility.js`) returning up to two rows (player job, one willing resident's job) with status, next result, remaining commitment and stop reason, reading `simulation.jobs` and `workPlanView`; a panel registered with `registerWorkspaceModule` at the centre dock. AR1: the inline array in `main.js:9955-9968` moves into the new leaf to pay for the one registration line. AR8: rows go through the disclosure gate, never raw job state. Medium because the layout join and viewport evidence are required (AD34: 1366 by 768, secondary 1920 by 1080; human layout acceptance is optional per AD42).

**Failure scenario.** Player job plus a resident cook job: cancel the player job; the board drops only the player's row and the cook's reservation stays; an observer without the cook's terms sees no cook row; a paused work plan shows its stop reason rather than "running".

**Persistence.** No save change. A new module id adds a default entry (`normalizeLayout` accepts new ids; older layouts gain no field per `layout_spec`), so the packet's "saved layout changes require compatibility" reduces to a localStorage normalisation check.
**Run:** reports_dock passes. **Verdict: medium.**

## C6. NGU P7/T15/T16: target and capacity-return display

**What exists (read).** `workPlanView` (`feature_expansion_work_plan.js:342`) returns `status`, `index/total`, `reason`, per-step status, `next` (eligible, reasons, duration, costs), `accepted` (remaining, `cancellation`), control flags and `lastResult` (K1 re-fit: the latest settled step read from the simulation log). Goal plans exist (`cursor.goal`, set in `startWorkPlan`; the reference cooling plan uses `gte power.cooling.mastery 3`, `reference_gameplay_content.js:95`) and complete with a fixed message "The useful function is earned. No further practice is reserved." (`advanceOne`). Stock plans expose `stockPolicy`, `holding`, `remainingBatches`. `settleAccepted` already knows the accepted job and whether it completed or stopped.
- Not exposed: the cursor's `goal` (kind of target: finite steps, goal, stock band; "off"/"keep working" states per T15), and any list of what was released when it ended (T16). Refund and reservation return are known from the command definition (`reservationReturns`, `cancellation`) and the log text, not summarised. Consumers (`feature_expansion_wave_host.js:82-90`, `audited_kit_reserve_host.js`, `factorio_retort_host.js:182`, `crush_social_views.js:163`) print `status`, `reason` and `lastResult.text`.

**Tests (read).** `tests/routine_jobs.test.js` covers it best: held/released stock, refund on support loss, future vs current cancellation (`controlWorkPlan` with `cancelCurrent`), `lastResult` (L65-70), quota rejection, reload clones. There is no goal-plan test file (no test references `reference_gameplay.cooling_plan`; inferred from grep).

**Smallest change (inferred).** Add `target: {kind: 'steps'|'goal'|'stock', reached}` and, once a step settles, `released: [...]` built from the settled command's declared costs/reservation policy (the same fields `projectAcceptedWorkLegibility` already reads), all inside `workPlanView`. Host panels print one more line. No new state, so the packet's acceptance ("target releases only its own allocation, unknown target blocks cleanly, reload exact") is checked by reading, not by new persistence.

**Failure scenario.** Goal plan reaches mastery 3 while a separate non-plan job is in flight: `target.reached` true, `released` lists only the plan's own reservation, the other job is untouched; a plan whose command revision is missing shows a blocked reason instead of throwing; the same view after JSON reload equals the view before.

**Persistence.** None. **Constraint.** AR8: `released` must come from the actor-safe projection, not private job fields. **Run:** routine_jobs passes.
**Verdict: small.**

## C7. Immortality Idle P3: named plan with threshold switch

**What exists (read).** `s.programs[actorId] = {commandId, remaining, status, targetId, reason?}` (`simulation.js:368-386`): one repeating command per actor, count 1 to 10000, statuses running/paused/complete. `setSimulationProgram` refuses a second while one runs ("Pause the existing routine first"), `pause`/`resume` exist, and the program loop (`:722-731`) starts the next batch at each boundary and pauses with a reason when inputs are missing. `commitCampaignTransition` pauses every program (`:772`). The validator (`simulation_contracts.js:321`) checks only `commandId`, `remaining`, `status`. The only UI is a hard-coded button "Pack 3 kits automatically" (`simulation_ui.js:35`) wired through `main.js:2364`. Work plans (above) have a `goal` predicate that ends a plan, but plan definitions are authored content, not player-named. The packet's anchor `simulation.js L319-337` is stale (now 368-386).
- The packet's example trigger "Woodcutting reaches 10" has no fact feed: `main.js:1720` and `:2088` supply only `skill.Crafting` (and `skill.Cooking`) to the simulation facts, so a generic skill threshold needs a fact source (inferred; grep of `'skill.` in src).

**Tests (read).** `tests/simulation.test.js:101-109` (programs: spend each batch, complete, pause on shortage, refund on cancel), `tests/routine_jobs.test.js:110-116` (existing measured-pack program), `tests/determinism_replay.test.js`, `tests/field_works.test.js`, `tests/lever_lesson.test.js` also call program functions (not read in full).

**Smallest change (inferred).** Extend the program record with an optional `name` and one optional `then: {when: <predicate>, commandId, count}`, evaluated in the existing program loop at a played-minute boundary using `meets(predicate, facts)` (already used by plans). On fire: set the next program once, log the rule (the packet wants the reason visible), clear `then`. "Start of life" is a flag read where rebirth currently pauses programs (`:772`/`:761-765`). Add a `skill.*` fact provider as a leaf (not another line in main.js). This is not a new scheduler (AR3). A UI to author a name and rule replaces the one hard-coded button; that is the larger half.

**Failure scenario.** Plan A (run command X) with `then: skill.Crafting >= 10 -> plan B`: crossing 10 during an in-flight job switches exactly once after that job settles; reload before the boundary keeps `then`; reload after keeps B and no `then`; a missing B command blocks with a reason; a threshold already met at start does not loop.

**Persistence.** Yes: optional fields on `simulation.programs`; absent means inert. The strict-key validator tolerates extra keys, but the new fields need their own validation and a compatibility decision (SAVES G3). Named multi-plan storage ("two named plans") needs a map beyond the single per-actor slot, which is the real schema change.

**Constraints.** AD16 (routines run away time and stop at exhausted supplies or important choices): a switch must not bypass that stop. AD22 (no fixed "once"; the one-shot switch is a default, not a law). AD45 supports starting small. **Run:** simulation passes.
**Verdict: medium** (large if the full authoring UI plus the start-of-life plan are in the first slice).

## Cross-cutting notes

- C1, C2, C6 are projection-only and need no save work; they are the cheap trio. C4, C7 and C3 each change saved shape; C3 is the heaviest.
- C1 (structured path) and C5 both touch code where main.js builds a view inline (`main.js:2097`, `:9955`); AR1 asks the join to move out, not grow.
- Packets' anchors stale: Arcanum `display.js:4457-4471`, `items.js:1092-1152`; Immortality Idle `simulation.js:565`, `L319-337`. Update them if any packet is selected.
- Not verified: any browser behaviour, build identity, or UI layout. All verdicts are code-read estimates, not effort commitments.
