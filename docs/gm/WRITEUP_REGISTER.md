# Writeup register and follow-up workflow (2026-10-27)

Status: working process and register, proposals for the process itself. Nothing in the
registered writeups is accepted until PROJECT.md records it. Edit this file in place;
add rows, never delete them (mark superseded rows with a date).

Why: sessions now produce reports faster than anyone reads them. A report that is
not registered, routed and given a next step is lost. This file is the single list of
what exists, what state it is in, and what moves it forward. Owners stay where they
are (USER_VISION for Weibao's words, PROJECT.md for accepted decisions, the master
plan for rounds, IDEA_INDEX for idea routing); this register points to them and adds
the missing piece: **status and next action per writeup**.

## 1. States

| State | Meaning | Who moves it |
| --- | --- | --- |
| New | Written, committed, not yet read by Weibao or a reviewer | The writing session registers it |
| Read | Weibao or a named reviewer read it; reactions recorded | Weibao's reply, recorded by the GM |
| Routed | Its proposals are split into cards, decisions or deferrals in the owners below | A GM pass (section 3) |
| Decided | Weibao chose; PROJECT.md or USER_VISION records it | Weibao's instruction only |
| Building | A card from it is in a session or branch | The coordinator session |
| Done | A card passed the AD43 floor, or the writeup was fully absorbed | The coordinator |
| Adopted (adjustable) | Working direction by Weibao's 2026-10-27 instruction; may be changed by a later dated entry | Weibao's instruction (section 5b) |
| Parked | Deliberately waiting, with a named trigger | The GM, with Weibao's yes |
| Superseded | A newer writeup replaced it; link to it | The GM |

Agent proposals are never "accepted" (AGENTS.md design framing). A writeup reaches
Decided only through Weibao's own words, recorded as a dated entry.

## 2. Intake rule (every writing session)

In the same commit that adds or substantially extends a writeup, add or update one
register row (section 4) and, when Weibao's words drove it, a verbatim USER_VISION
record. A row needs: file, topic, state, the owner doc it extends, open decisions
(by code), the next action with owner, and one done check. If a session cannot fill
the next action, state `none yet: needs Weibao's read`. Do not copy the report into
the register; link it. Rounds appended to an existing report (Round 2, 3, 4...) update
the existing row and its "latest round" cell.

## 3. Consolidation pass (the follow-up routine)

Run by a GM session when asked, and by default after any day that added three or
more writeups. Steps, in order, stopping when a step has nothing to do:

1. **Inventory.** `git log --since=<last pass> --name-status -- docs | grep '^A'` plus
   the dispatch folders. Every new writeup missing from section 4 gets a row.
2. **Read-state.** Mark rows Read when Weibao reacted in chat or in a child session
   (child sessions hold his follow-ups; see section 6). Record his reaction in the row.
3. **Extract decisions.** Collect each writeup's open questions and decisions into the
   decisions table (section 5) with a recommended default, the owner, and what waits.
4. **Route.** For each proposal worth keeping, make one of: a card in the Village loop
   GM plan or the master plan; an IDEA_INDEX line; a PROJECT.md decision candidate
   (for Weibao to accept); or a Parked row with a trigger. Reuse existing codes; do
   not mint a competing specification.
5. **Zero-loss check.** For every shared doc touched, run the check in
   [SHARED_WORKTREE_PRACTICE](SHARED_WORKTREE_PRACTICE.md). Commit own paths only.
6. **Brief.** Give Weibao at most five items to act on: what is new, the decisions
   that unblock the most, and one recommended next card. Rank the rest; do not list
   everything.

Triggers besides the day count: Weibao says "consolidate" or "what's open"; a session
ends a turn with open questions; a writeup is more than seven days in New.

## 4. Register

Latest round is the newest appended round or part in the file. All rows below were
written 2026-10-27 and are proposals unless the next-action cell says otherwise.

| File | Topic | State | Extends | Latest round | Open decisions | Next action (owner) and done check |
| --- | --- | --- | --- | --- | --- | --- |
| [MASTER_PLAYABILITY_PLAN_2026-10-25](../MASTER_PLAYABILITY_PLAN_2026-10-25.md) | Rounds 3 to 11: cadence, overnight, world travel, cheat growth, Village loop, three worlds, red team, overarching loop, absence pointers | Read (Weibao directed rounds) | PROJECT.md | Round 11 pointers | See section 5 | GM pass to keep pointers current (GM). Done when each round links its owner. |
| [GM_PLAN](dispatch/village-loop-2026-10-27/GM_PLAN.md) | Village loop, three worlds, red team, seven survivor cards | Building | Master plan R7 to R10 | Section 18 | WD1 to WD5 (WD5 answered 2026-10-27, port permitted with credit) | village-loop continues cards in section 18 order (VC7a, UF7, VC9). Done: card floor per AD43. |
| [VILLAGE_LOOP_CHECKPOINT](dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md) | VL1, VC3a, VC2n, VC12 results | Done (agent-verified, not human-reviewed) | GM_PLAN | VC12 | Known Face threshold proposal; relay-grant walk (needs the Cave room cleared) | Weibao plays the Village route; village-loop closes the relay walk. |
| [BACKLOG_UI_CHECKPOINT](dispatch/village-loop-2026-10-27/BACKLOG_UI_CHECKPOINT.md) | UIV1, Q18 P02 to P10, DRC11, DRC12 | Done (DRC12 below floor: seeded carcass) | Backlog UI | f0352c95e | none | backlog-ui picks next UI rows; DRC12 needs a fresh-life carcass walk. |
| [ATTENTION_BALANCE_GAMES](../research/ATTENTION_BALANCE_GAMES_2026-10-27.md) | Idle, active and life-sim pace dial; P1 to P8 | Read | Master plan R10 (OL, CP, WR) | Initial | Q1 to Q5 (pace per life, hands-on rate, director inputs, offline cap, source gaps) | Candidate cards P2 and P3 (stop reasons, return note) to the Village loop. Done: scripted 12 h absence shows a note with a stop reason. |
| [NPC_ABSENCE_AND_REACH_OUT](../research/NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md) | Absence, VNs, per-world reach-out, many-clock model, schedules over deadlines, pace from event calendar, catch-up models, no caps, standing orders, helpers and bad actors | Read (Weibao followed up four times in its chat) | Attention balance; PROJECT.md OD4 | Round 4 (L1 to L8) | Catch-up multiples, bank decay, favour ledger fate across heirs; VN source gaps | Choose clock shape C1/C2 and N1/N2/N4 as first Village cards (Weibao picks; GM routes). Done: one card with done check in GM_PLAN. |
| [CANON_PROTAGONIST_INTERACTIONS](../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md) | Playing as, beside, apart from the original protagonist; lead-first authoring and autonomous pipeline; PX1 to PX64 | New | WER1 to WER17; NPC absence clocks; time travel and seeded worlds (DT1) | Part H (round 5) | LOTM start month, HP cohort offset; fanfic census needs Weibao's yes; bulk source acquisition and private-pack placement for named canon | Run the Village mini-line first (PX64): lead-run table, pack data, same-verb bot, null-player and poke tests, bystander smoke test. Done: the eight checks in Part H.6 pass, agent-verified, not human-reviewed. |
| [TIME_TRAVEL_AND_SEEDED_WORLDS](../research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) | Time-travel kinds, seeded-day contract, generated-things inventory, engine decisions E1 to E12, ordered changes C1 to C12 | New | AR rulebook; PROJECT.md OD23 | Part D | Per-instance seed; Import behaviour; genVersion | First slice C1/C2: keyed shop stock test on the Village shop. Done: same seed and date give identical stock twice, saves unchanged. |
| [CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT](../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT_2026-10-27.md) | Brief for the conceptual-abilities audit | Done (executed by `conceptual-abilities`) | Time travel Parts C and D | Initial | none | Audit landed; see the next row. |
| [CONCEPTUAL_ABILITIES_ENGINE_AUDIT](../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md) | Channel model for name, record, memory, claim effects as delta rows over the seeded base; one reference resolver; `generated(kind, key)` | New | Time travel report Parts C and D | Initial | Reference-resolver ownership; delta kinds (mask, rewrite, seal, swap, bind); which generators migrate first | First slice CAE-E1/E2/E4: one resolver with fallback and stop baking names into new prose. Done: erased-name test shows fallback in UI and no dangling references after save, reload, Import. |
| [PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT](PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT_2026-10-27.md) | Brief for a GM session: implement the protagonist's life, then open the seat and transfer to the rest of the world | Plan rounds 1-13 done 2026-10-27 ([PLAN](dispatch/protagonist-life-2026-10-27/PLAN.md), [schema](dispatch/protagonist-life-2026-10-27/LEAD_RUN_SCHEMA.md)); reader protocol v2 built and gated; volume 1 reading approved; waves 1-3 of 7 done (chapters 25-114, all A or B); stopped before wave 4 at the 110% wave-cost line, awaiting Weibao's rate call ([status](dispatch/protagonist-life-2026-10-27/READING_STATUS.md)); engine lanes PL-E0, B1, E2, E3, E1, H1 committed 2026-10-27, all implemented below floor ([checkpoint](dispatch/protagonist-life-2026-10-27/ENGINE_LANES_CHECKPOINT.md)) | Canon protagonist Parts G and H; time travel C1/C2; CAE-E1/E2/E4; WA22-WA24 | Round 14 (after wave 1; WA25-WA41 accepted, adjustable; WA42-WA47 proposed) | Q3 private placement; Q4 LOTM start month; yes to WA42-WA47; Q5 WER11 wording; AD33 order for allies; HP and MoL reading plans | Read volume 1 in 7 waves under protocol v2, audited per wave, paced by AU7; engine lanes run in pilot-engine-lanes. Done: all 63 shards graded A or B with headers, then the lead-run table assembly (P2). |
| [VC9_STEP0_PROBE](../research/proto23/VC9_STEP0_PROBE_2026-10-27.md) | Proto23 port: mechanisms, licence gaps, first slice | Read (port permitted with credit) | GM_PLAN VC9 | Initial | Where the port lives (branch), credits note wording | village-loop or a port lane builds the first slice. Done: probe cases match. |
| [USER_VISION entries 2026-10-27](../USER_VISION.md) | Verbatim requests (Proto23 permission, many clocks, schedules, time travel, abilities, this register) | Decided (as Weibao's words) | n/a | n/a | n/a | n/a |
| [UI coverage PLAN](dispatch/ui-coverage-2026-10-27/PLAN.md) | A surface for every 2026-10-27 system without a screen per feature: 18-row coverage matrix, eight shared primitives (K1-K8), frozen home budget, desktop IA, lenses only narrow, contract template, coverage tests | New | UI_RULES UR1-UR75; master plan UT, UF; GM_PLAN section 17; protagonist PLAN section 17 | Round 1 | Yes to proposed UR76-UR82; B1 persistence decision (note "last seen" marker); P1 pace answer before B5 | Build B1 (note primitive, return note, stop-reason line on the work line), then B2 Ledger → Owed (UI lane, Sonnet medium). Done: section 5 B1 check at 1920×1080, 1800×1040 and 1536×864, 14 and 21 px. |

## 5. Decisions waiting for Weibao (rolling)

Rank by what each unblocks. Keep to the five most useful at any time; the rest stay in
the writeups with their codes. Default recommendations are proposals, not accepted.

| # | Decision | Default if he says nothing | Unblocks |
| --- | --- | --- | --- |
| 1 | Launch the protagonist-life lanes ([prompt](PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT_2026-10-27.md)): plan pass done ([PLAN](dispatch/protagonist-life-2026-10-27/PLAN.md)), LOTM vol 1 proposed as pilot, Village mini-line kept as the PL-H1 harness | Yes: lanes wait for his launch yes and plan Q2, Q3, Q4, Q8 | Lead-first pipeline, golden run, every later world |
| 2 | First engine slice: keyed Village shop-stock test (time travel C1/C2) with the reference resolver (CAE-E1/E2/E4) right after | Yes: smallest change, no save change | Repeatable days, golden runs, seeded NPCs, name abilities |
| 3 | Clock shape: schedules by default, deadlines only from an in-world source, scoped to life facts, cap on firm visible clocks (C1/C2) | Adopt as working shape | Village cards N1/N2/N4, per-world clock sets |
| 4 | Canon start settings: LOTM start month, HP cohort offset (D3), WER11 rewording (D2), default seat `beside` (D1) | D1 `beside`; D2 and D3 wait for his yes | Beat data for LOTM and HP |
| 5 | Catch-up feel and cap; Known Face threshold; Proto23 port branch and credits wording | Uncapped bank with world friction; keep the current threshold until played; port on its own branch, push waits | Offline cards, Village standing gates, VC9 pack |

## 5a. Pass log

### Pass 1, 2026-10-27

- **Inventory:** nine writeups plus three dispatch folders were already rowed; added the
  canon rounds 3 to 5 (PX37 to PX64), the conceptual abilities audit and the new
  protagonist-life prompt. No unregistered 2026-10-27 research file remains.
- **Read-state:** Weibao reacted in chat to attention balance, NPC absence (four times),
  canon protagonist (twice), time travel (twice). Not yet read by him: Village checkpoints,
  conceptual audit, Proto23 probe, VC9 report. His reactions are already folded in those
  reports' later rounds; no extra recording needed.
- **Routed:** (1) lead-first pipeline to the new prompt (not launched); (2) time travel C1/C2
  plus the reference resolver to a Village engine card (pending his yes, decision 2);
  (3) attention P2 and P3 (stop reasons, return note) and NPC N1/N2/N4 to the Village loop
  as the cards after VC12, in that order; (4) clock shape C1/C2 to GM_PLAN as a working
  shape once he picks (decision 3); (5) canon beat records PX19/PX20 wait for the start
  settings (decision 4).
- **Parked, with triggers:** fanfic departure-point census (needs his yes and a terms check);
  LOTM clock set by pathway (needs a LOTM source pass); VN primary-source pass (only if VN
  depth becomes a design reason); offline multiples and bank decay (after he picks a feel).
- **Superseded wording:** "at most one hard clock per world" (E7, N5) by the cap on firm
  visible clocks per life; the earlier no-copy Proto23 default by the 2026-10-27 permission.
- **Not changed:** GM_PLAN, PROJECT.md and the master plan were not edited in this pass;
  routed cards wait for Weibao's decisions, then the owners get dated hunks.

## 5b. Adoption (2026-10-27)

Weibao's words are in [USER_VISION](../USER_VISION.md#adopt-this-sessions-proposals-as-adjustable-working-direction-2026-10-27).
Reading: proposals in the rows above are **Adopted (adjustable)**, a new state between
Routed and Building. It means: use as the working default, change by a later dated
entry, never treat as frozen. Rules: (1) the later dated wording wins and the earlier
stays as history; (2) adoption does not skip the AD43 floor for runtime work; (3) the
proposed WA25 to WA41 rules are accepted by the plan session editing the rulebook and
rules index after its current round (the yes is covered by this entry); (4) sealed
secrets, the UI priority and the save-compatibility rule still apply; (5) open
questions that need a value from Weibao (LOTM start month, HP offset, reading budget,
the launch of engine lanes) stay open.

Open worry recorded: UI coverage for everything. Owner: the UI coverage plan
(session `ui-coverage`, docs only), then the Backlog UI coordinator.

## 6. How Weibao follows up (observed 2026-10-27, for future sessions)

Saved so a fresh session can predict and match his routine. Evidence: his messages in
the `npc-absence`, `time-travel` and main chats; not a rule he stated.

- **He answers inside the child chat that owns the topic**, not through the main chat.
  The child appends a numbered round (Round 2, 3, 4) to its own report and commits.
  Look in the child chat for his reactions before assuming he has not responded.
- **Short, dictated, curious prompts**, often ending "more to consider?" or running
  the `/more-to-consider` skill with his idea as the argument. Answer by adding a
  round with ACT NOW / ACCOUNT FOR NOW / LATER, not by restating the report.
- **He corrects from domain knowledge** ("doesn't Proto23 have the weekly meals"). Fix
  the record and the reasoning, and note the correction as dated history.
- **He extends scope one idea at a time** (no caps, automation, NPC help, evil people,
  random events together). Fold each into the same report; keep one layering order.
- **"Save accordingly" means the repo owner doc plus a USER_VISION record**, not chat.
- **He asks for a prompt/brief in one chat and launches it elsewhere**, naming the
  model ("with an Opus analyzer"). The launching session reads the brief file first.
- **He prefers separate chats for separate topics** ("we might need a separate chat")
  and expects them to run without waiting.

## 7. Gaps in this process (to fix as they bite)

- Child-chat reactions are found by reading transcripts (`list_events`), which is slow.
  Cheap fix: each child records Weibao's reaction in its report round header.
- Register rows can drift. The consolidation pass in section 3 is the repair; a
  weekly pass is the default, none is scheduled yet.
- Nothing here enforces the intake rule. A `check:rules`-style link check for new
  `docs/research/*_2026-*.md` files missing from this register is a later card; it
  touches tooling, so it waits for Weibao's yes.
