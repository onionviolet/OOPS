# Quality deep dives core audit

Status: proposal record (AD32). Root of the five cross-cutting quality passes run on the prose model
(sweep, rulebook, baseline-ratchet check, ranked backlog, then fixes). Direction:
[log entry](../gm/USER_VISION_LOG_2026-11.md#five-quality-deep-dives-on-the-prose-model-2026-11-06).
Execution and evidence: [checkpoint](../gm/dispatch/quality-deep-dives-2026-11-06/CHECKPOINT.md).

## Areas and owners

| Area | Rulebook | Check | Gate | Backlog |
| --- | --- | --- | --- | --- |
| Pacing and feel | [PAC1-PAC8](../PACING_RULES.md) | `npm run check:pacing` (work policy) | periodic, about 44 min cold; `--only` for touched starts | [pacing](../pacing/PACING_BACKLOG.md) |
| First scenes of each start | [OPN1-OPN9](../OPENING_RULES.md) | `npm run check:openings` | periodic, game-driven | [openings](../openings/OPENINGS_BACKLOG.md) |
| Names and world vocabulary | [NMR1-NMR8](../NAMING_RULES.md) | `check_names.mjs` (`--private` local) | in `check:rules` | [names](../names/NAMES_BACKLOG.md), [sheets](../names/WORLD_NAMING_SHEETS.md) |
| One fact, one value across files | [CTR1-CTR9](../CONTINUITY_RULES.md) | `check_continuity.mjs` | in `check:rules` | [continuity](../continuity/CONTINUITY_BACKLOG.md) |
| Feedback after every action | [FBK1-FBK8](../FEEDBACK_RULES.md) | `npm run check:feedback` (`--probe-disabled`) | periodic, game-driven | [feedback](../feedback/FEEDBACK_BACKLOG.md) |

The broader palette above these five, covering time, direction, progress, trust, comfort and ownership, is the [player experience core audit](PLAYER_EXPERIENCE_CORE_AUDIT.md) (PX1–PX27, 2026-11-10).

Shared tool: `scripts/headless/trace.mjs` (schema in its header; default policy for openings and feedback,
`--policy work` for pacing).

## Rerun triggers

- A new world or start: run all three game-driven checks with `--only <start>`, add a naming sheet row.
- A content wave that adds people, places or prices: `check:rules` covers names and continuity.
- A change to trace.mjs policy: rebaseline openings and feedback together, after reading the diff.
- A private pack rebuild: `check_names --private` and `check_continuity` before and after.

## Game fixes versus checker changes (run 1)

Kept apart so the numbers are honest.

| Area | Game or data fixes | Checker or target changes |
| --- | --- | --- |
| Names | 19 NPC display names, 4 nest names, ids kept; 108 private cast spellings, 120 private links | allow comments for plain items and false positives; VAR rule precision; private mode reads id links |
| Continuity | 21 + 108 private spelling fixes, one private place renamed | volume records compared within their volume (most of 146 -> 12); link files |
| Openings | Village pointer scoped to the Village; world-aware Mixing tooltip; long openings folded (1801 -> 260 words worst); walk labels name their place; 351 -> 12 visible walks on lotm.beside; place ids read as words | "Repeat X" and "Talk to/Walk to <name>" no longer flag |
| Feedback | slot buttons open their detail; Tools lists tool slots; closed hover footer hidden; affinity test disabled with a reason; locked nav controls say why; 25 book-start refusals given their own reasons | recipe-row and passive-bucket classes filtered as policy artifacts; FBK4 probe added |
| Pacing | none needed for the measured stalls | work policy, payoff signal, `--only`; targets loosened for book.hp.lead (gap 360 -> 420) and lotm.beside (first payoff 60 -> 420, it opens at night) |

## Remaining dispositions (run 1)

| Class | Count | Disposition |
| --- | --- | --- |
| Openings trace flags (late first action, dead stretch, no-effect choice) | 36 of 37 | policy artifact: the curious bot presses every "Choose" card; they never lead the backlog (OPN rule) |
| Feedback controls left | 9 (from 43) | visual-only or re-press: active tab (Actions, Here, Practice), Strength row already shown, Show me highlight, re-opened read disclosures; FBK3 dial (an "Already selected" note) LATER if wanted |
| Trade rows and filled slots | 22 | checker blind spot, named artifact classes (row moves between lists; slot re-selects a shown detail); a trade press on a sold-out item is a LATER browser check |
| Private names | 104 | needs a source read (about 46 person and 18 place pairs with no shared alias); 40 DUP titles need a display-name field the cast pack lacks |
| Continuity | 11 | needs a source read (pairs that may be different people) |
| Village pay on stop | 1 | design kept: shift pay at its end, accrued pay shown while working (BALANCE) |
| hp.lead acts | 3 | real gate may be a clock in the private hp-cast; shows the next unmet scene meanwhile |

## Run log

- 2026-11-06/07, run 1: five deep-dive lanes, then nine fix lanes and coordinator fixes. Gates: build, check:arch,
  check:rules pass; npm test 5658/5661 then the one failure fixed; persistence proof (save, reload, import).
  Agent-verified, not human-reviewed. Final tree re-measured with fresh traces: feedback 9, openings 37, 0 regressions.
