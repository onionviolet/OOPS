# C2 LOTM/Tingen playtest, 2026-10-25

Owner: C2. Headless MCP evidence only; no desktop or human acceptance claim.
Exact build: source tree `6f928fb9523f41ce21c8140461ba39d81ecc7a52`, per
`C2_CHECKPOINT.md`. Rules: AD6–AD8, AD22, AD32, AD34, AD36, AR3/AR7/AR8,
AU1–AU7. Both starts used
`game_new({seed:<seed>,url:'http://localhost/?lotm_probe=1',panel:'lotm'})`.

## Findings

| Code | Area | Repro from fresh start | Expected | Observed | Severity | Receipt |
|---|---|---|---|---|---|---|
| CLC1 | Nighthawk entry | Seed 251044; choose `Begin as a Nighthawk probationer`, then report to Hale | Reach an early-Tingen supervised probationer life | Tingen supervised workroom at day 1, 08:00; player is an ordinary clerk under Warden Hale | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC2 | Pathway choice and supervision | Same seed and entry; `game_look({scope:'#lotm_panel'})` | Show both Sequence 9 routes and clear dose boundaries | Workroom identifies Seer → Clown and Corpse Collector → Gravedigger, says one pathway per life and calls a second pathway potion switching. Allocation and supervised irreversible ingestion are separate actions. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC3 | Seer acquisition and control | Seed 251044; accept and ingest Seer dose, complete lesson, take/observe/return sample A | Dose and faculty remain separate; novice can learn bounded control | Ingestion removed the dose; 5-minute lesson taught material perception, costing 1 spirituality and adding 1 strain. Sample finding reports a signal at the material without identifying it or certifying safety. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC4 | Seer save/export/import | Same seed and Seer route; call save, export, then load the returned path | Restore player, clock and location | Save hash `500699efa1a875dd` (129,948 bytes); import restored day 1, 08:05, workroom, Sequence 9 Seer, 2/3 spirituality, 1/6 strain and the learned method. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC5 | Tingen district role | Seed 251044; travel workroom→lodging→docks, finish trips, present papers, tally crate, return to lodging | Nighthawk visitor can use the Storm district's visible papers and paid work | Paid 24-pence endorsement; completed the 20-minute crate tally for 18 pence; returned to probationer lodging. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC6 | Corpse Collector brewing gate | Seeds 251044 and 251045; choose Nighthawk, report to Hale and inspect formula. In seed 251044, visit the dock broker for the 36-pence frog offer | Reach formula and brew route through available means | Formula control states 5 pounds and reports “Insufficient money” with the starting purse. No brew was started. This is a coverage gate; the run did not establish a balance defect. | Pacing (coverage gate) | `/tmp/c2-lotm-seer2.jsonl` |
| CLC7 | Corpse Collector progression | Seed 251045; choose Nighthawk, report to Hale, accept and ingest Corpse Collector dose; do three 25-minute wash/shroud acts and one 60-minute vigil; ask Hale to assess | Sequence 9 role work advances the ladder and assessment releases the next dose | Display reached 4/4 acts, described the potion as settled, recorded Hale's assessment and gave the player a prepared Gravedigger dose. Seer dose stayed withheld for this life. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |
| CLC8 | Corpse Collector save/export/import | Same seed and path; save, export, load returned path, reopen LOTM | Restore player, clock, location and pathway progression | Save hash `cc753da7d7266b67` (132,474 bytes); import restored day 1, 10:15, workroom, Corpse Collector 4/4, settled and assessed, with the Gravedigger dose held. | No issue observed | `/tmp/c2-lotm-seer2.jsonl` |

## Felt good

- Dose possession does not grant a faculty; irreversible ingestion is a separate supervised step.
- The Seer lesson and sample result state the limits of what the player can infer.
- Each pathway has its own practical role actions and clear digest count; assessment visibly releases the next dose.
- District travel, endorsement and paid work name the local church and its authority.

## Coverage

| Area | State |
|---|---|
| Seer Sequence 9 control and progression | Dose, lesson, sample cycle, one refusal and one client reading complete; digestion remains 2/6. Lodging and a dockside errand were exercised. |
| Corpse Collector Sequence 9 progression | Fresh life, dose, three body-care acts, one vigil, 4/4 digestion, assessment and held Gravedigger dose complete. |
| Brewing | Not reached. Formula requires 5 pounds and frog input; visible funds block the formula purchase. This is a bounded access gate, not a demonstrated balance defect. |
| Tingen locations and practical roles | Workroom, lodging and docks exercised; university quarter not visited. Each life was played through day 1; later days were not needed for these bounded checks. |
| Save/export/load | Both lives verified: Seer at day 1 08:05 and Corpse Collector at day 1 10:15. |

Transcript: `/tmp/c2-lotm-seer2.jsonl` contains both fresh lives and recorded tool
results. Earlier setup-only evidence is in `/tmp/c2-lotm-play.jsonl` and
`/tmp/c2-lotm-seer.jsonl`; the latter stopped after reading the supervisor's
offer and is not a completed journey.
