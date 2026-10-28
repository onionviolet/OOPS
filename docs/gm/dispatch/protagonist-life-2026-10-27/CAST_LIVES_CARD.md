# Cast lives: one-page card

Read this first; the [plan](CAST_LIVES_PLAN_2026-10-28.md) is the dated record (rounds 1-12) and the
lane folder [cast-lives-lanes/](cast-lives-lanes/) holds briefs and checkpoints. Updated 2026-10-28.
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
| L3, L6a, L6b | LOTM cast records; MoL worksheets; MoL cast records (AR11: zero seam edits) | L3 landed in `src/` (moving to the private pack, CL141); L6b data held uncommitted |
| L4a | Beside start, schedule-driven locations, talk gate, save round trip | Implemented, below floor; uncommitted (canon names, AD1) |
| L4c | Private pack move, travel to cast places, beside entry answers, AD43 floor | Running |
| Next | L4b beats and null-player run with the gap probe; L5r UI replay of chapters 1-3; scene card | Briefs to write from L4c's checkpoint |

## Rules for this work (CLR1-CLR12, proposed)

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
| CLR12 | A lane's stop is a finding, not a failure: give the default for the known ambiguity in the next brief so the same stop does not recur | CL99 |

## Where to look

- Method and index-to-runtime map: plan sections 2-3. Fights and gap probe: 8. Fate, time models, trends,
  UI: 9. Audits versus derivation, interaction loop: 10. Scene UI rules SUI1-SUI19: 15, 17, 18.
  Fold-loss: 19. Private pack and build order: 17. Reports text RPT1-RPT12: 21.
- Engine: `src/cast_schedule.js`, `src/beat_records.js`, `src/beat_ledger.js`. Tools:
  `scripts/lead_run/{build_crosswalk,cast_worksheet,conflict_contracts,after_actions}.mjs`.
