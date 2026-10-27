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
| [CANON_PROTAGONIST_INTERACTIONS](../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md) | Playing as, beside, apart from the original protagonist; PX1 to PX26 | New | WER1 to WER17; NPC absence clocks | Part E (round 2) | LOTM start month, HP cohort offset; fanfic census needs Weibao's yes | Settle start offsets in the world cards, then PX19/PX20 beat record. Done: beat record fields in a pack. |
| [TIME_TRAVEL_AND_SEEDED_WORLDS](../research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) | Time-travel kinds, seeded-day contract, generated-things inventory, engine decisions E1 to E12, ordered changes C1 to C12 | New | AR rulebook; PROJECT.md OD23 | Part D | Per-instance seed; Import behaviour; genVersion | First slice C1/C2: keyed shop stock test on the Village shop. Done: same seed and date give identical stock twice, saves unchanged. |
| [CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT](../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT_2026-10-27.md) | Brief for the conceptual-abilities audit | Building (running in `conceptual-abilities`) | Time travel Parts C and D | Initial | none | When the audit report lands, register it here and route its engine changes. |
| CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27 (not yet written; link when it lands) | Channel model for name, record, memory, claim effects; generator API | Pending (session running) | Time travel report | none | to be listed when written | Register on arrival. |
| [VC9_STEP0_PROBE](../research/proto23/VC9_STEP0_PROBE_2026-10-27.md) | Proto23 port: mechanisms, licence gaps, first slice | Read (port permitted with credit) | GM_PLAN VC9 | Initial | Where the port lives (branch), credits note wording | village-loop or a port lane builds the first slice. Done: probe cases match. |
| [USER_VISION entries 2026-10-27](../USER_VISION.md) | Verbatim requests (Proto23 permission, many clocks, schedules, time travel, abilities, this register) | Decided (as Weibao's words) | n/a | n/a | n/a | n/a |

## 5. Decisions waiting for Weibao (rolling)

Rank by what each unblocks. Keep to the five most useful at any time; the rest stay in
the writeups with their codes. Default recommendations are proposals.

| # | Decision | Default if he says nothing | Unblocks |
| --- | --- | --- | --- |
| 1 | Pick the clock shape: schedules by default, deadlines only from an in-world source, scoped to life facts, cap on firm visible clocks | Adopt C1/C2 as the working shape | Village cards N1/N2/N4, per-world clock sets |
| 2 | Catch-up feel: cozy and slow or fast, and whether the bank has any cap | Uncapped bank with world friction (L1/L2), multiples per world | Offline and banked-time cards |
| 3 | Known Face threshold proposal | Keep the current value until played | Village standing gates |
| 4 | Where the Proto23 port lives and credits wording | Port on its own branch; credits note names Proto23 and 23html; push waits for his yes | VC9 pack |
| 5 | Start the keyed shop-stock test (time-travel C1/C2) | Yes: smallest engine slice, no save change | Seeded NPCs, finds, time travel |

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
