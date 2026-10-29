# Cast lives: one-page card

Read this first, then [the coordinator handoff](COORDINATOR_HANDOFF_2026-10-28.md); the [plan](CAST_LIVES_PLAN_2026-10-28.md) is the dated record (rounds 1-12) and the
lane folder [cast-lives-lanes/](cast-lives-lanes/) holds briefs and checkpoints. Updated 2026-10-28 (late). Standing goal: lead first (AD44, CL268).
Everything here is a proposal under the 2026-10-27 adoption entry unless it cites an accepted code.

## Goal

Everything the book's protagonist touches lives in the game with its own week: schedules, relations,
knowledge and an arc that runs whether or not the player follows the lead (WA22-WA24). First slice:
LOTM chapters 1-24, "beside the lead" start. Second world: Mother of Learning, first loop.

## State (agent-verified, not human-reviewed)

| Lane | What | State |
| --- | --- | --- |
| L1 | Merge, id crosswalk, fitness report | Landed `b3b2c0c8e` |
| L2, L2b, L2c | Schedule module; worksheets; fight contracts and after-actions | Landed |
| L3, L6a, L6b | LOTM cast records; MoL worksheets; MoL cast records (AR11: zero seam edits) | Landed; data now in `private_packs/` |
| L4a, L4c, L4d | Beside start from the private pack: cast moves by schedule, walks to cast places, resident entry, talk gate with away reasons, remote people excluded, relative day in the header | **Meets the AD43 floor** `1cadee65e` (bundle `11cf2385`, 1920×1080, zero page errors, Save/reload/Export/Import) |
| L7 | Reaction classes; classifier 40% to 59% (LOTM), 37% to 63% (MoL) | Landed `cdefcf80e`, partial |
| L4b | Beats settle on their days with no player; Reports lines at witness level; gap probe (15 gaps); fold-loss ledger | Landed; FLR3 partial (person view rows) |
| L4e | Polish: capitalized report lines, district grouping, place title, person-view beat rows | Landed `1dd4f88db` |
| L5r | Chapters 1-3 UI replay: two identical fresh UI runs, zero page errors; 1/18 verified (clean fold), 17 typed gaps, measured in beside | Landed `8a6dffa6a`; fidelity counts in the be seat once B1 lands (CL269) |
| W1 | Lane runner (`scripts/codex_lane.mjs`), review script, brief template | Landed `6324d336f` |
| G1 | Wait until (quoted, interruptible); beat aftermath writes dated knowledge to who learned it | Landed `5832a1f8b`; floor PASS bundle `0539519f` (1920×1080, zero page errors, Save/reload/Export/Import); wait takes 13 s for six hours (target 3 s, CO3) |
| C1, S1 | Perspective tags for 64 controls; seat filter with one read point | Landed `5832a1f8b` with G1 |
| P1 | One command per book to records-ready (CL272) | Landed `569616c90`; MoL reproduces, LOTM shows input drift |
| G2 | Concealment | Held until the be replay needs it |
| B1 | **Be the lead**: history pass, seat registration, no Village behind him, seeded draws | Running (Sol, pid 25335, `codex_lane.mjs status`) |
| Next | Browser check of B1, then the L5r replay in the be seat (CL269); D1 determinism and divergence | See the handoff queue |

## What you can do now

With the private pack on this machine: from the Village, pick the fifth Tingen start ("beside the lead").
You wake in neighbourhood lodging on day 1. Walk to the household's flat, the market, the bakery and other
places; the people the lead knows are where their day puts them. Talk to whoever is there; anyone away
says when and where they are usually back. Their story beats now happen on their days whether you are there or
not; be at the household flat at dawn on day 1 and Reports tells you what you saw.

## Rules for this work (CLR1-CLR13; accepted as binding defaults 2026-10-28)

Each line restates an accepted code where one exists; only CLR2, CLR3, CLR6, CLR8 and CLR9 are new.

| Code | Rule | Restates or extends |
| --- | --- | --- |
| CLR1 | Implement from the cited paragraph, not the row; drop a row its paragraph does not support | Round 8 (accepted), PL-A46 |
| CLR2 | **Every brief opens with a data probe**: count the fields the lane depends on against stated expectations; stop if a count is under half, but only for counts named as gates | New (CL124, CL100); IPC77 |
| CLR3 | **Every brief states each output's publication class**: public code (name-free), private pack (canon data, book text), or private research. Canon people, names and beats never land in tracked `src/` or `tests/` | AD1, PROJECT book worlds (new as a brief line, CL141) |
| CLR4 | Absent means silent: a missing field is unknown, never "no" | WA8, schema 1.4 note |
| CLR5 | Fills come from the role's mechanism, labelled `fill` with a basis, and pass the forward-anchor lint | WA24, WA38 |
| CLR6 | **Map, fold or gap, with the fold-loss test**: a fold keeps choices, inputs and outputs, time and order, who was there, place, outcomes and what was noticed; a lossy fold is a gap and becomes build work | New (CL162, CL171-CL177) |
| CLR7 | Fix a gap at the cheapest layer; a new verb needs a second case | FND5, IPC60, AD38 |
| CLR8 | **One record set, several drivers**: the NPC lead, the bot playthrough and the player seat run the same records and commands; where two disagree, one is wrong | New (CL160, CL168); LP10 |
| CLR9 | **Codex lanes never commit; the coordinator reviews the diff, runs the focused test and one data spot check, and commits each lane's own paths** (the Codex sandbox cannot write `.git`) | New (CL119, CL127); IPC29 |
| CLR10 | Name the seam and the one location authority; no second store or clock | AR3, AR14, IPC12 |
| CLR11 | Receipts carry build hash, route kind (natural or fixture) and review state; below the floor is said plainly | AD43, IPC8, IPC9 |
| CLR13 | A page error or test failure during a lane's run is the lane's until a clean-HEAD run proves otherwise | IPC10 (CL205) |
| CLR12 | A lane's stop is a finding, not a failure: give the default for the known ambiguity in the next brief so the same stop does not recur | CL99 |

## Where to look

- **Top-down design of the lead's life** (actions, relationships, fights and results, knowledge, law, work, body,
  determinism, subtle chains, lanes): [LEAD_LIFE_SYSTEMS_DESIGN.md](LEAD_LIFE_SYSTEMS_DESIGN.md) (LSD1-LSD155, proposed).
- Method and index-to-runtime map: plan sections 2-3. Fights and gap probe: 8. Fate, time models, trends,
  UI: 9. Audits versus derivation, interaction loop: 10. Scene UI rules SUI1-SUI19: 15, 17, 18.
  Fold-loss: 19. Private pack and build order: 17. Reports text RPT1-RPT12: 21.
- Engine: `src/cast_schedule.js`, `src/beat_records.js`, `src/beat_ledger.js`. Tools:
  `scripts/lead_run/{build_crosswalk,cast_worksheet,conflict_contracts,after_actions}.mjs`.
