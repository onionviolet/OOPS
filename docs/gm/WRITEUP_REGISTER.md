# Writeup register and follow-up workflow (2026-10-27)

[Lane branch and worktree reconciliation, 2026-11-07](BRANCH_WORKTREE_RECONCILIATION_2026-11-07.md): 22 branches from the 2026-10-30 replication wave checked by content; all landed, none to merge; 8 worktrees removed and 22 branches dropped 2026-11-07, tips kept under `refs/archive/2026-11-07/` (New).

Status: working process and register, proposals for the process itself. Nothing in the
registered writeups gains acceptance from registration. Under AD32, direction is established by Weibao’s words and the owning rulebook/AD line; PROJECT.md summarizes current focus and priorities. Edit this file in place;
add rows, never delete them (mark superseded rows with a date).

Why: sessions now produce reports faster than anyone reads them. A report that is
not registered, routed and given a next step is lost. This file is the single list of
what exists, what state it is in, and what moves it forward. Owners stay where they
are (the direction log `USER_VISION_LOG_*.md` for Weibao's words, USER_VISION for standing direction, rulebooks/AD lines for accepted direction, PROJECT.md for current focus,
the master plan for its rounds, IDEA_INDEX for idea routing); this register points to them and adds
the missing piece: **status and next action per writeup**.

## 1. States

| State | Meaning | Who moves it |
| --- | --- | --- |
| New | Written/registered, not yet read by Weibao or a reviewer; commit state recorded separately | The writing session registers it |
| Read | Weibao or a named reviewer read it; reactions recorded | Weibao's reply, recorded by the GM |
| Routed | Its proposals are split into cards, decisions or deferrals in the owners below | A GM pass (section 3) |
| Decided | Weibao chose; PROJECT.md or USER_VISION records it | Weibao's instruction only |
| Building | A card from it is in a session or branch | The coordinator session |
| Done | A named card met its applicable floor, or a writeup was fully routed at its declared scope; neither closes unrelated cards | The coordinator |
| Adopted (adjustable) | Working direction by Weibao's 2026-10-27 instruction; may be changed by a later dated entry | Weibao's instruction (section 5b) |
| Parked | Deliberately waiting, with a named trigger | The GM, with Weibao's yes |
| Superseded | A newer writeup replaced it; link to it | The GM |

Agent proposals are never "accepted" (AGENTS.md design framing). A writeup reaches
Decided only through Weibao's own words, recorded as a dated entry.

## 2. Intake rule (every writing session)

In the same change that adds or substantially extends a writeup, add or update one
register row (section 4) and, when Weibao's words drove it, a verbatim direction-log
record. A row needs: file, topic, state, the owner doc it extends, open decisions
(by code), the next action with owner, and one done check. If a session cannot fill
the next action, state `none yet: needs Weibao's read`. Do not copy the report into
the register; link it. Rounds appended to an existing report (Round 2, 3, 4...) update
the existing row and its "latest round" cell.

## 3. Consolidation pass (the follow-up routine)

Run by a GM session when asked, and by default after any day that added three or
more writeups. Steps, in order, stopping when a step has nothing to do:

1. **Inventory.** Compare the requested document roots with this register and the
   native idea/domain indexes. Include untracked files and appended rounds in older
   files; Git added-file history is a useful input, not the whole census. Record
   roots, exclusions, input identity and reviewed ranges. Use the [project-wide
   intake](../audits/LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md) for collection-scale
   coverage; discovered or metadata-routed entries retain substantive review gaps.
   New writeups receive a row; original entries remain when superseded.
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

Latest round is the newest reviewed round or part in the file, with its review date. Rows retain their own dates and scopes. The October 27 adoption in section 5b applies to its then-selected material, not later additions. Unrefreshed rows remain dated snapshots: verify their current owner before acting (AD32, AD36).

| File | Topic | State | Extends | Latest round | Open decisions | Next action (owner) and done check |
| --- | --- | --- | --- | --- | --- | --- |
| [Loose-document reconciliation](../audits/LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md) | Continuous actual-content review under the Nov 4 request; original-ID dispositions and owner folds in linked batches | Active across batches; source reading distinguished from metadata and partial owner review | This register, IDEA_INDEX and current domain owners | B624, continuous execution 2026-11-05 | No deletion, new gameplay or blanket proposal adoption selected | Use the linked inventory and reviewed-range ledger; continue remaining actual-content batches through their incumbent owners without a batch approval stop. Full coverage includes partial-owner residue, not just metadata-only rows. Done check for this pass: skill validation, document/rules/link checks and input-drift accounting; historical gameplay receipts retain their dates. |
| [Reconcile-project scope assessment](../audits/RECONCILE_PROJECT_SCOPE_ASSESSMENT_2026-11-04.md) | Prior assessment leading to the requested skill update | Follow-through recorded in the reconciliation row above | Generic reconcile-project skill; this register | Follow-through 2026-11-04 | None for the requested workflow edit | Assessment retained as provenance; execution record owns delivered changes and residue. |
| [Progress evidence map](../audits/PROGRESS_EVIDENCE_MAP_2026-11-04.md) | Original document-label progress view and bounded foundation follow-through | Reconciled at selected foundation scope; original visualization remains historical | systems/README, SAVES, Klein mechanism sequence; [foundation reconciliation](dispatch/foundation-conversations-2026-11-04/CHECKPOINT.md#reconciliation-of-foundation-follow-through-2026-11-04) | Foundation delivery/routing refresh, 2026-11-04 | Broader proposals remain proposals under AD32 | Conversation, pack validation, retained identity and paid-work runtime integrated in `72a33f151`; retain each pinned route and current-input drift. M21/M22/M25 has a later released method-use receipt, scoped to its named command, native paper and recipient; see B153 in the reconciliation record. Done check: selected focused tests and document/rules links; no clean full-suite or fresh whole-game claim. |
| [World implementation routes audit](../audits/WORLD_IMPLEMENTATION_ROUTES_AUDIT_2026-11-04.md) | Original/book world, mechanic and UI routing | F1–F4 applied as maintenance under existing direction; F5 records check scope | LEAD_LIFE_GUIDE §10, RULES_INDEX router, PROJECT current focus | Reconciled 2026-11-04 | No extra rules or universal gate adopted | Applied guide, router, HP-summary and expired-deadline fixes; original audit retained with a current pointer. Checks and remaining evidence limits are in the reconciliation record. |
| [WA61-WA68 source gap rules and JJK gap register](../WORLD_ABSORPTION_RULES.md#source-gap-rules-wa61-wa68-proposal-2026-11-03) | Standing rules for source gaps across worlds; JJK OCR gap register, VIZ novel fill plan, AU2 budget and haiku pilot ([register](../worlds/jujutsu/JJK_OCR_GAP_REGISTER.md), [plan and pilot](../worlds/jujutsu/JJK_GAP_FILL_PLAN.md)) | Proposals under AD32, none accepted; register and pilot are evidence, uncommitted | WA8, WA32, WA44, WA49, WA58; AD49, AD51; AU2-AU15; WPR7 | Round 1, 2026-11-03 | Weibao's yes to WA61-WA68; whether to dispatch beyond the pilot | Coordinator records his answer (hunk-only). Done check: `npm run check:rules`; JJK ledger header declares layers (WA68) when a reader folds the pilot. |
| [Reconciliation tooling and options](../audits/RECONCILIATION_TOOLING_PROPOSAL_2026-10-31.md) | Generic skill/helpers, safe Q-lane retirement and O4/O5 guide/MC reconciliation | Tools and scoped O4/O5 documentation delivered; gameplay unchanged (AD32) | Rules audit; worktree practice; current refinement tracker; engine dependency map | Round 5 | No blanket adoption or new runtime dispatch | Current owners route resolved questions; all MC135–MC173 have retained source IDs, families, owner/gap and check. Remaining LSD horizon and source/host/browser gaps stay explicit; runtime work remains coordinator-owned. |
| [DEPTH_DIAL_PROPOSAL](dispatch/refinement-audits-2026-10-31/DEPTH_DIAL_PROPOSAL.md) | Depth per arc after ch54, case bars and slots, variance by key and dial, AD33 tiers, skill intake; idea bank IB1-IB12 | New; proposals under AD32, none accepted | BOOK_ABSORPTION_WORKFLOW row D; AD47, AD49, WA45, LSD107/217/218/233; SLC112-SLC122; GR1-GR17 | Round 14, 2026-11-03 | Q-W10 recorded 2026-11-03 for his direction only (tiers, slot, intake stay proposals); Q-W21 resolved by SLC37/SLC42 (two stores); Q-W22; earlier Q-W codes in the file | Coordinator or Weibao records the direction (hunk-only); slot slice and SLC119/SLC120 columns per the file's LATER lists. Done check: a native slot proof, and a locator trace of the two skill paths. |
| [CROSS_NOVEL_GAME_MECHANICS_SCOUT_2026-10-31](../research/CROSS_NOVEL_GAME_MECHANICS_SCOUT_2026-10-31.md) | Prior-source correction; five world-specific game comparisons N1–N5 | Routed research/proposals; uncommitted | World core kit routing; similar-games research; existing world/planner owners | Initial, 2026-10-31 | No research decision pending; no build selected | Existing world coordinator reopens the ranked proposal on its named trigger. Research done check: primary links, history/evidence labels, incumbent/gap/cost and acceptance examples; no new runtime or priority authority. |
| [RI_CROSS_GAME_MECHANICS_COMPARISON_2026-10-31](../research/RI_CROSS_GAME_MECHANICS_COMPARISON_2026-10-31.md) | Fourteen game/mod references; Gu upkeep, combinations, refinement and world-economy interactions X1–X12 | Routed as research/proposals; uncommitted, no build selected | RI institutions and progression-gate owners; economy palette; existing Gu packs | Round 2, 2026-10-31 | None needed for research completion; revised P1 scope remains a proposal | RI coordinator reopens on an explicitly selected implementation lane. Research done check: source labels, cost/effort and acceptance examples, current-status corrections and owner links. Future runtime uses AD43; no worker dispatched. |
| [MASTER_PLAYABILITY_PLAN_2026-10-25](../MASTER_PLAYABILITY_PLAN_2026-10-25.md) | Rounds 3 to 11: cadence, overnight, world travel, cheat growth, Village loop, three worlds, red team, overarching loop, absence pointers | Read (Weibao directed rounds) | PROJECT.md | Round 11 pointers | See section 5 | GM pass to keep pointers current (GM). Done when each round links its owner. |
| [GM_PLAN](dispatch/village-loop-2026-10-27/GM_PLAN.md) | Village loop, three worlds, red team, seven survivor cards | Building | Master plan R7 to R10 | Section 18 | WD1 to WD5 (WD5 answered 2026-10-27, port permitted with credit) | village-loop continues cards in section 18 order (VC7a, UF7, VC9). Done: card floor per AD43. |
| [VILLAGE_LOOP_CHECKPOINT](dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md) | VL1, VC3a, VC2n, VC12 results | Done (agent-verified, not human-reviewed) | GM_PLAN | VC12 | Known Face threshold proposal; relay-grant walk (needs the Cave room cleared) | Weibao plays the Village route; village-loop closes the relay walk. |
| [BACKLOG_UI_CHECKPOINT](dispatch/village-loop-2026-10-27/BACKLOG_UI_CHECKPOINT.md) | UIV1, Q18 P02 to P10, DRC11, DRC12 | Done (DRC12 below floor: seeded carcass) | Backlog UI | f0352c95e | none | backlog-ui picks next UI rows; DRC12 needs a fresh-life carcass walk. |
| [ATTENTION_BALANCE_GAMES](../research/ATTENTION_BALANCE_GAMES_2026-10-27.md) | Idle, active and life-sim pace dial; P1 to P8 | Read | Master plan R10 (OL, CP, WR) | Initial | Q1 to Q5 (pace per life, hands-on rate, director inputs, offline cap, source gaps) | Candidate cards P2 and P3 (stop reasons, return note) to the Village loop. Done: scripted 12 h absence shows a note with a stop reason. |
| [NPC_ABSENCE_AND_REACH_OUT](../research/NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md) | Absence, VNs, per-world reach-out, many-clock model, schedules over deadlines, pace from event calendar, catch-up models, no caps, standing orders, helpers and bad actors | Read (Weibao followed up four times in its chat) | Attention balance; PROJECT.md OD4 | Round 4 (L1 to L8) | Catch-up multiples, bank decay, favour ledger fate across heirs; VN source gaps | Choose clock shape C1/C2 and N1/N2/N4 as first Village cards (Weibao picks; GM routes). Done: one card with done check in GM_PLAN. |
| [CANON_PROTAGONIST_INTERACTIONS](../research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md) | Lead/beside/other seats and source pipeline | Historical palette; later lead-first direction governs (AD44) | LEAD_LIFE_RULES; LEAD_LIFE_GUIDE; current refinement tracker | Part H retained; routing reconciled 2026-10-31 | LOTM opening date and main-line lead seat resolved; HP cohort premise remains with the HP plan | Follow current world plan and runtime tracker; do not relaunch the old Village mini-line as a universal prerequisite. Source/permission gaps retain their original owners. |
| [TIME_TRAVEL_AND_SEEDED_WORLDS](../research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md) | Time-travel kinds, seeded-day contract, generated-things inventory, engine decisions E1 to E12, ordered changes C1 to C12 | New | AR rulebook; PROJECT.md OD23 | Part D | Per-instance seed; Import behaviour; genVersion | First slice C1/C2: keyed shop stock test on the Village shop. Done: same seed and date give identical stock twice, saves unchanged. |
| [CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT](../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_PROMPT_2026-10-27.md) | Brief for the conceptual-abilities audit | Done (executed by `conceptual-abilities`) | Time travel Parts C and D | Initial | none | Audit landed; see the next row. |
| [CONCEPTUAL_ABILITIES_ENGINE_AUDIT](../research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md) | Channel model for name, record, memory, claim effects as delta rows over the seeded base; one reference resolver; `generated(kind, key)` | New | Time travel report Parts C and D | Initial | Reference-resolver ownership; delta kinds (mask, rewrite, seal, swap, bind); which generators migrate first | First slice CAE-E1/E2/E4: one resolver with fallback and stop baking names into new prose. Done: erased-name test shows fallback in UI and no dangling references after save, reload, Import. |
| [PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT](PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT_2026-10-27.md) | Historical launch/reader/engine brief | Superseded launch/read-count snapshot; work has launched, not whole-life complete | [reading status](dispatch/protagonist-life-2026-10-27/READING_STATUS.md), [lead guide](../LEAD_LIFE_GUIDE.md), [runtime tracker](dispatch/refinement-audits-2026-10-31/IMPLEMENTATION_TRACKER.md) | Original round 14 retained; routing reconciled 2026-10-31 | LOTM opening date resolved in USER_VISION 2026-10-28; WA42–WA47 retain their mixed current statuses in RULES_INDEX | Readers use current READING_STATUS and its qualification limits; runtime uses the incumbent tracker, including L2b below floor. No old launch vote, shard count, blanket WA adoption or fresh budget follows from this row (AD32/AD36). |
| [VC9_STEP0_PROBE](../research/proto23/VC9_STEP0_PROBE_2026-10-27.md) | Proto23 port: mechanisms, licence gaps, first slice | Read (port permitted with credit) | GM_PLAN VC9 | Initial | Where the port lives (branch), credits note wording | village-loop or a port lane builds the first slice. Done: probe cases match. |
| [USER_VISION entries 2026-10-27](../USER_VISION.md) | Verbatim requests (Proto23 permission, many clocks, schedules, time travel, abilities, this register) | Decided (as Weibao's words) | n/a | n/a | n/a | n/a |
| [UI coverage PLAN](dispatch/ui-coverage-2026-10-27/PLAN.md) | A surface for every 2026-10-27 system without a screen per feature: 18-row coverage matrix, eight shared primitives (K1-K8), frozen home budget, desktop IA, lenses only narrow, contract template, coverage tests | New | UI_RULES UR1-UR75; master plan UT, UF; GM_PLAN section 17; protagonist PLAN section 17 | Round 1 | Yes to proposed UR76-UR82; B1 persistence decision (note "last seen" marker); P1 pace answer before B5 | Build B1 (note primitive, return note, stop-reason line on the work line), then B2 Ledger → Owed (UI lane, Sonnet medium). Done: section 5 B1 check at 1920×1080, 1800×1040 and 1536×864, 14 and 21 px. |
| [Batch reading PLAN](dispatch/batch-reading-2026-10-27/PLAN.md) | Reading campaign and batch-specific execution | Original “nothing submitted” is historical; later reading results are recorded | [READING_STATUS](dispatch/protagonist-life-2026-10-27/READING_STATUS.md), batch PLAN and run files | Original round 1; routing reconciled 2026-10-31 | Future submissions retain their own explicit run approval and budget; no authorization inferred here | Read current per-book/source/grade state and exact run approval. Acquisition, reading, lint/grade, merge and gameplay remain distinct; this row launches nothing (AD32). |
| [READING_GAP_MAP](../research/READING_GAP_MAP_2026-10-28.md) | Game gaps (GM1-GM21) mapped to what batch readings can supply, pipeline gaps PG1-PG9, book priority by gaps per dollar, first five | New | BOOK_WORLD_FEATURE_GAPS, MASTER_PLAYABILITY_PLAN | Round 1 | Order of books (Weibao's call) | Weibao reads; first lane picks F1 after merging MoL rows (Weibao). |
| [LOCAL_AI_READER_TEST_2026-10-27](../research/LOCAL_AI_READER_TEST_2026-10-27.md) | Local Ollama models and dsh as LOTM lead-run readers: none replaces haiku; a table-derived census script does the mechanical part | Written | LOTM volume 1 reading ([READING_STATUS](dispatch/protagonist-life-2026-10-27/READING_STATUS.md)), AU5, AU15 | First | A4 (Anthropic API key route needs Weibao's yes) | A1: reading coordinator adds a known-name census script to protocol v3; done check: name accuracy 1.0, lint clean, measured tokens per shard (A2) |
| [END_RUN_THREATS_LORE_SWEEP_2026-11-03](../research/END_RUN_THREATS_LORE_SWEEP_2026-11-03.md) | Rules audit (A1-A16) and lore sweep of run-ending threats capable characters exploit (LOTM, RI, HP, D&D, cyberpunk); proposes RLEE10-RLEE13 | New; research, AD50 added, uncommitted (AD32) | RELATIONSHIPS_AND_CANON round 5 (RLEE1-RLEE9); DEATH_AND_RESET; ABUSE_AND_LIMITS | Initial, 2026-11-03 | Review of the AD50 wording; which candidate mechanisms are wanted | Weibao reads; AD50 and RLEE10-RLEE13 stand as accepted on his 2026-11-03 instruction, wording adjustable. Done: RULES_INDEX router row and AD50 match the owner. |
| [CYBERPUNK_WORLD_SCOUT](../research/CYBERPUNK_WORLD_SCOUT_2026-11-03.md) and [CYBERPUNK_COMMUNITY_SCOUT](../research/CYBERPUNK_COMMUNITY_SCOUT_2026-11-03.md) | Cyberpunk source worlds and community scout; ECR21 wording corrected 2026-11-03; candidate mechanisms CW35-CW37 added | New; research and proposals, uncommitted, Reddit mostly unreachable (community scout section 0) | Lore sweep above; BHR20; ECR21-ECR24 | Initial, 2026-11-03 | Whether a cyberpunk world is wanted and in what order (Weibao) | Weibao reads; world order stays Weibao's call. Done: none until selected. |

## 5. Decisions waiting for Weibao (rolling)

Review date: 2026-10-31. These are dispositions of the earlier five asks, not five new questions for Weibao. Original wording is preserved in the [O4 history](../audits/reconciliation-tooling-2026-10-31/o4-superseded-register.json). Current ownership and finite authorization are checked at the selected task (AD32/AD36).

| # | Earlier ask | Reconciled disposition and owner | Next action |
| --- | --- | --- | --- |
| 1 | Launch protagonist-life lanes | Resolved: work launched; current [tracker](dispatch/refinement-audits-2026-10-31/IMPLEMENTATION_TRACKER.md) records delivered and below-floor slices | Resume the selected coordinator-owned task under its current scope/allowance; no repeated launch vote. |
| 2 | Select the first seeded-shop/reference-resolver slice | Historical sequencing proposal, superseded as a global next action by PROJECT current focus and the [runtime tracker](dispatch/refinement-audits-2026-10-31/IMPLEMENTATION_TRACKER.md) | Reopen a specific seed/reference seam when a selected consumer needs it; do not claim the old proposed pilot is verified. |
| 3 | Pick one clock shape | USER_VISION’s many-clock direction and current time/away owners apply; this register selects no global cap or universal clock | Resolve the chosen life’s clock/support boundary in its own plan; historical default recommendations are not new approval. |
| 4 | LOTM date, default seat, HP cohort and WER wording | LOTM uses the book opening date (USER_VISION “Cast lives: batched defaults accepted”, 2026-10-28); lead is the main line (AD44). HP cohort/era specifics and any WER wording change stay with [HP plan](dispatch/refinement-audits-2026-10-31/HP_UI_ENGINE_PLAN.md) and WER owner | No question repeats resolved LOTM/seat direction. Qualify unresolved premise values only when the selected HP/WER task depends on them. |
| 5 | Catch-up, Known Face and Proto23 settings | Mixed tuning/delivery proposals; no global answer inferred. Current domain owner and existing authorization govern each selected card | Use current away/standing/port owners and actual receiving consumer. Push/submission remains separately authorized; no runtime tuning selected by this reconciliation. |

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

### Pass 2, 2026-10-30

- **Added:** [done-chats audit](../audits/DONE_CHATS_AUDIT_2026-10-30.md), covering 49 chats from 2026-10-29 to 2026-10-30 morning. Its findings are F1-F12, its proposals O1-O10, and its asks of Weibao A1-A5. Not yet read by him. Nothing has been routed to owners yet: the proposals wait on A2 (the next wave) and A4 (the hook and limiter).
- **Added:** [gap audit](../audits/GAP_AUDIT_2026-10-30.md), which checks USER_VISION, his chats, the coordinator chats, the research packets and the readings against the code. It has gap themes G1-G16, reading gaps R1-R5 and seven proposed lanes. The per-source tables are in `docs/audits/gap-audit-2026-10-30/`. The UI section is pending. Not yet read by Weibao.

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
- **"Save accordingly" means the repo owner doc plus a direction-log record** (and a USER_VISION line when standing direction changes), not chat.
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

## Reconciliation pass 3, 2026-10-31: O4/O5

Under Weibao’s scoped O4/O5 request, corrected acceptance routing, dated-adoption scope, selected lead/canon/reader rows and the earlier five-question list against current owners (AD32/AD36/AD44). Original replaced hunks are in the [O4 history](../audits/reconciliation-tooling-2026-10-31/o4-superseded-register.json). Other rows retain their recorded scope and need their own current-owner check before action. The systems front door and lead-life guide now link the [MC135–MC173 supplement](dispatch/refinement-audits-2026-10-31/ENGINE_UI_DEPENDENCY_MAP.md#incremental-supplement-mc135mc173); 39 codes are mapped, not implemented. No runtime or reading lane was resumed. Full changes/checks: [tooling report round 5](../audits/RECONCILIATION_TOOLING_PROPOSAL_2026-10-31.md#round-5-o4o5-applied-and-skill-lessons-retained).

## Reconciliation pass 4, 2026-11-02: LOTM Klein-first progress

Read-only reconcile of the KJ1–KJ3D campaign state against its live owners, with a more-to-consider round: [LOTM progress reconciliation](dispatch/refinement-audits-2026-10-31/LOTM_PROGRESS_RECONCILIATION_2026-11-02.md). Ten ledger rows (RL1–RL10), five ACCOUNT FOR NOW items (M1–M5), four LATER items, and a commit batch manifest with handoff steps (families A–G; build and arch checks passed, full suite started). The whole campaign is still uncommitted over the Oct 31 HEAD, and a ch16 (KJ3E) build was in flight in another session, so no campaign owner file was edited; that writer carries RL2, RL9 and RL10. No runtime, pack, save, commit or dispatch.

## MoL census, retention seam and Zorian plan, 2026-11-03

Whole-source family census of the held MoL text against the built visitor world (reused merged rows, no new read), a proposed reset/retention row shape that LOTM and MoL share (AB11, with WA55 differences rows), and a staged Zorian developer playthrough plan to the Threshold milestone: [census](../worlds/mother-of-learning/COVERAGE_CENSUS_2026-11-03.md), [seam note](../worlds/mother-of-learning/RETENTION_RESET_SEAM_2026-11-03.md), [plan](../worlds/mother-of-learning/ZORIAN_PLAYTHROUGH_PLAN_2026-11-03.md). Proposals only (AD32). Planned, not built: no Zorian seat exists and the shape change touches the file the Klein lane reads. Next action: packets P1-P5 in the plan, P1 first.

## Packet reconciliation and Climb source read, 2026-11-03

Read-only reconciliation of the idle/cultivation implementation packets against `src/`, with a tested C1-C7 re-trace and a bundle-level Climb read: [reconciliation](../research/PACKET_RECONCILIATION_2026-11-03.md), [C1-C7 re-trace](../research/PACKET_RETRACE_C1_C7_2026-11-03.md), [Climb source read](../research/CLIMB_SOURCE_READ_2026-11-03.md). Proposals only (AD32); nothing accepted.

## Skills round 6, 2026-11-03

Proposal round on milestone ladders, titles and perks in a lead's playthrough, with more-skill candidates and four delegable deep dives (SLC112-SLC122): [skills palette, Round 6](../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md#round-6-2026-11-03-milestone-ladders-titles-and-perks-in-a-leads-playthrough-more-skills-proposal-only). State: New. Next: Weibao picks which of SLC119-SLC122 to start.

Skills round 6 deep dives, same day (all New, proposals, none human-reviewed): [source-game skill catalogue SLC119](../research/proto23/SKILL_CATALOGUE_2026-11-03.md); [lead skill timelines SLC120](dispatch/protagonist-life-2026-10-27/LEAD_SKILL_TIMELINES_2026-11-03.md) (Klein and Zorian; no row seat-neutral yet); [deed titles with witnesses SLC122](dispatch/protagonist-life-2026-10-27/DEED_TITLES_WITNESSES_2026-11-03.md) (Klein, design only); SLC121 ladder slice built and committed on branch `worktree-agent-a99cafb056410fd34`, not merged. Next: Weibao decides whether to merge the slice.

Abstraction direction (AD51) and the shared-seam round AB1-AB10, 2026-11-03: [USER_VISION](../USER_VISION.md#reasonable-things-get-abstracted-2026-11-03), [ABILITY_RULES round](../ABILITY_RULES.md#abstraction-round-2026-11-03). State: New (proposal round; AD51 recorded as Weibao's direction). Next: Weibao decides whether to send out AB8.

Next world after Mother of Learning, 2026-11-03: [ranked world proposal](dispatch/NEXT_WORLD_AFTER_MOL_PROPOSAL_2026-11-03.md) (Harry Potter first, JJK runner-up with a canon-first-order deviation, Naruto and Hunter x Hunter need text). State: New (proposal, none accepted). Next: Weibao decides D1-D4.

## Afflictions and weapon properties, 2026-11-03

Staged-affliction and corrosion seams (Tetanus, Rusting, a resistant festering wound) plus a d20 palette AFW1-AFW36: [considerations](../AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md). State: New. Round 2 wires the affliction seam into the HP Polyjuice bench (staged animal features, hospital-wing care), agent-verified, not human-reviewed. Next: a disease consumer with exposure and a terminal stage, or AFW-L2 corrosion in combat. Round 3 (same day) folds in the collected d20 rules: calibration checks, a real-disease ladder, AFW37-AFW42.

PF1 data absorption candidates, PFA1-PFA9 (proposal; exposure without a wound and the PF1 timing dial handed to the seam owner; nothing in `src/` changed): [list](../research/d20/PF1_ABSORPTION_CANDIDATES_2026-11-04.md). State: New.

## Polyjuice and perceived identity, 2026-11-03

Identity as layers (looks, credentials, knowledge, true self) and which layers each gate reads, with d20 disguise and detection ideas, PJI1-PJI30: [considerations](../worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md). State: New. Round 2 folds in the collected PF2 rules (PJI7-13 cited, PJI31-36). Next: PJI-L1, a dose that passes one gate. The d20 rules data is collected: [receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md).

## UI copy pass, 2026-11-03

Interface wording inventory and house rules: [string inventory](../reviews/UI_STRING_INVENTORY_2026-11-03.md) (generated by `node scripts/ui_string_inventory.mjs`) and [copy style sheet](../ui/COPY_STYLE_SHEET.md) F1-F8, reference voices V1-V8 (YAIR, Proto23), CPY1-CPY18. State: New (proposals, none accepted). Next: Weibao reviews CPY1-CPY18; then the report-only copy lint and the refusals slice (CPY3).

Round 2 (2026-11-03, "more to consider" on other games and the log): F9-F14, reference games G1-G14 (unchecked recall), CPY19-CPY26 for log tense, message weight, folding, outcome lines, shown working, density, layered tooltips and system messages; aspects A1-A6; follow-ups L1-L6 with level and done check. State: New (proposals). Next: refusals slice, then L1 runtime log capture before the log slice.

Slice 1, home-world refusals (2026-11-03): 28 rewrites in six files, logged in the [style sheet](../ui/COPY_STYLE_SHEET.md#slice-1-home-world-refusals-2026-11-03). Focused tests 112/112, build passes, two lines checked in headless Chrome at 1920×1080. State: implemented, agent-verified, not human-reviewed. Next: L1 runtime log capture, then the log slice.

L1 runtime log capture (2026-11-03): `scripts/ui_log_capture.mjs` and [UI_LOG_CAPTURE_2026-11-03](../reviews/UI_LOG_CAPTURE_2026-11-03.md), findings F15-F20 in the style sheet. State: New. Next: L3 message weights and L4 folding. Refusals slice 2 and the empty-states slice run in their own worktree sessions.

Slice 2, leftovers plus Tingen and Harry Potter refusals (2026-11-03): 62 lines at 75 sites in 24 files, logged in the [style sheet](../ui/COPY_STYLE_SHEET.md#slice-2-leftovers-tingen-and-harry-potter-refusals-2026-11-03). HP tests 50/50, build passes, two lines checked in headless Chrome at 1920×1080. Found: the Polyjuice bench reads as save-paused in a writing tab (`tradeWritable` false). State: implemented, agent-verified, not human-reviewed. Next: HP school pack text needs a pack revision; the bench's writable check is a separate runtime fix.
## H2 rewind checkpoint, 2026-11-03

Design for the cross-world rewind checkpoint, saved as a section of the [L9 death and restart design](dispatch/sonnet-wave-2026-10-30/L9_DEATH_RESTART_DESIGN.md#h2-rewind-checkpoint-extend-the-continuation-anchors-do-not-add-a-second-one-proposal-ad32-2026-11-03). Finding: the H2 audit row is stale; `continuation_state.js` already keeps an initial plus one replaceable checkpoint as whole-save snapshots, with loop and restart commands, Frontier-only for `set`, `checkpoint` and `loop`. Proposes loop kinds `chosen`, `entrapment` and `duplicate`, world-called anchors, an additive no-bump slice and one first slice (Mother of Learning as `entrapment`) with its AD43 floor. State: New (proposals, none accepted; read from `src/`, tests not run). Next: Weibao's yes on the MoL slice; Regressor's Tale and Speedrunning rows wait for their readers.

## H3 and H4 body, control and recognition bridge, 2026-11-03

One design for body template, control and carrier records (H3) and claim, receipt, belief recognition (H4), saved as a section of [nonhuman abstractions](../worlds/NONHUMAN_ABSTRACTIONS_NEEDED_2026-10-14.md#h3-and-h4-as-one-shape-body-control-and-recognition-bridge-2026-11-03-proposal). Findings: the simulation body record stays the body authority and native Person/Hero stays the goods owner (derived binding, no migration); knowledge is keyed by person and `basis` is free-form, so the record needs no save change; `persona_standing.exposedTo` is a second authority (compatibility exception); `registerWhoKnowsSource` has no caller. State: New (proposals, AD32, docs only). Next: H34-S1, the "who do they think this is" read slice with AD43 floor checks.

## Book-world gaps, 2026-11-03

Per-book source, design, implementation and next-slice rows for the LOTM, COI, MoL, Shadow Slave, Reverend Insanity, Harry Potter, D&D, A Soldier's Life, Reincarnation Paradise, Regressor's Tale, TTKS, Primordial Saint Sect, Fanren and BF43-BF57 worlds, with a cross-book section: [BOOK_WORLD_GAPS](../audits/BOOK_WORLD_GAPS_2026-11-03.md). Includes X1-X15 (contradictions and stale claims between inputs) and a refreshed H1-H12 native check with importer counts. State: New (proposals, none accepted). Next: Weibao or the GM routes X1-X10 library and doc corrections, the S9 reachability check, and the library-hygiene rows.

## Cross-world detail pass, 2026-11-03

Coverage of the 36 detail families (CW01-CW36) across four world clusters by reader pass, seven real gaps R1-R7, shared joins J1-J6, twelve hard cross-world features H1-H12 with a state check and floor check, and the H12, H7 and H8 results: [CROSS_WORLD_DETAIL_PASS](../audits/CROSS_WORLD_DETAIL_PASS_2026-11-03.md). All proposals (AD32), docs only except the H7 and H8 slices, which are agent-verified, not human-reviewed.


## Cross-world detail pass, round 2, 2026-11-03

Round 2 of the same audit: spot-checks of R1-R3 and CW04, a 16-world by 36-family grid for D&D, Fullmetal Alchemist, Skyrim, Fallout, Elden Ring and ten anime and manga worlds ([matrix](../audits/CROSS_WORLD_DETAIL_ROUND2_MATRIX_2026-11-03.md)), new gaps R8-R10, sixty small details SD1-SD60 with their second systems, X1-X18 resolved or sharpened, joins J7-J11 and hard features H13-H15, in [CROSS_WORLD_DETAIL_PASS](../audits/CROSS_WORLD_DETAIL_PASS_2026-11-03.md#round-2-2026-11-03-proposal). Proposals (AD32), docs only, source-spot-checked for the locators opened; not rules-reconciled, built or browser-verified. Next: G8-G14 in that doc.

## Shared mechanisms from one world, adaptation seam, 2026-11-03

AB11-AB26 in the [ability abstraction round](../ABILITY_RULES.md#round-2-2026-11-03-mechanisms-from-one-world-that-serve-all-and-the-adaptation-slice): bloodline through AB1 provenance, LOTM digestion and loss of control left to their lane, conserved power, upkeep, soul anchors, enforced vows, emotion fuel, rule spaces, capacity, felt rank, names. AB11 built: `src/adaptation_ledger.js`, `src/adaptation_catalogue.js`, `tests/adaptation_ledger.test.js` (9 pass), calibrated in [E8E](../emergent/E8E_ADAPTATION.md#source-calibration-2026-11-03). Implemented, below floor (no consumer, route or UI). Proposals (AD32).

## World implementation rules map, 2026-11-04

Nine-stage map of the rule sets for implementing a world (source to done), status colors, and findings F1-F9 with proposals A1-A5, saved as [the audit](../audits/WORLD_IMPLEMENTATION_RULES_MAP_2026-11-04.md). The initial missing-UI-list claim was withdrawn in the map’s own later correction; existing DSG19 and its selected consumer remain the route. Proposal only (AD32); extends the 2026-10-30 reconciliation audit. Round 4 adds an interactive [visual map](../audits/world_implementation_rules_map_2026-11-04.html) and persistence findings F15-F16.

## Hunger Games institutions, WER answers and arena slice plan, 2026-11-04

[Institutions, roles and subtle details](../worlds/HUNGER_GAMES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-11-04.md): 12 Haiku windows (about 135,000 of 580,000 words; Mockingjay unread), WER2-WER12 for four starts, one arena slice (T-HG1 water withdrawal, four exits) as the first AD50 consumer, missing seams M1-M8, and an evidence-labelled difficulty note (unknown). Proposal only (AD32); extends WPR9-WPR17, WER, SR and AD50 for Order 6 of the master plan. State: New (source-spot-checked, partial). Open: BHR16 exception for a full thirst end needs Weibao's yes. Next: read B4 after line 258, then B2 and B5 remainders (section 9); build only if the slice is selected. Done check: windows closed or restated.


## Electron and Rust assessment, and the measured Electron/Tauri shell comparison, 2026-11-05/06

Two loose review documents from another session, registered here on 2026-11-06 so they have a home. The [Nov 5 assessment](../reviews/ELECTRON_RUST_ASSESSMENT_2026-11-05.md) answers Weibao's Electron-efficiency and Rust question from source reading only (F1-F3): keep Electron, measure before optimizing, consider a Rust/WASM kernel only for a measured hot spot. The [Nov 6 comparison](../reviews/shell-comparison-2026-11-06/REPORT.md) is the experiment he then authorized ("measure our current Electron performance and try a small Tauri prototype"): hidden 1920×1080 windows, three trials per host on the fresh and crowded perf fixtures. Headline: Electron starts in about 8 to 12 s against Tauri's 38 to 52 s; Tauri's summed footprint is about 40% lower; on the crowded fixture the Tauri prototype ran the clock at 0.11 game minutes per wall second and completed 0 of 3 save/reload sequences. The stack owner carries the pointer ([TS13 follow-up](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md)). State: agent-verified bounded background experiment, not human-reviewed; AD39 unchanged, no migration authority (AD32). Scripts: `scripts/perf/compare-shells.mjs` and `scripts/perf/tauri-prototype/` (untracked until their owner commits). Open: visible painting, long-run energy, quit/relaunch durability, crowded Tauri save path.

## Full register content reconciliation, 2026-11-04

The register’s states describe different events. Read or Routed does not mean decided, implemented, integrated or published; Done is scoped to the named card/routing task. Section 5b’s dated working adoption does not absorb later rows or overturn later instructions. The observed child-chat workflow and proposed daily/weekly consolidation are history/process ideas, not scheduled automations or authorization to message, commit, publish or spawn workers (AD32, AD36).

Full reading of the table and appended topic entries does not review every linked report. Preserve their original rounds and use the receiving owners: B184’s complete world-rules-map review retains the author’s own correction that the UI shipping list already exists; B153’s released method-use checkpoint supersedes the progress row’s active wording at M21/M22/M25 scope. Its final method/recipient/paper proof does not close all method families or source arrival. Other old slice rankings, held budgets, prototype gaps and New labels retain their dates until the selected owner supplies a scoped correction.

Earlier pass logs and fixed five-question dispositions remain intact. Do not ask again for resolved lead/date direction, treat the old original-world ranks as a global queue, or use a missing row as evidence a mechanism is absent. The project-wide inventory remains the content-coverage owner, including partial files; this register is the routing/status front door. No gameplay, independent acceptance vote, new automation or source reading follows from this maintenance.
