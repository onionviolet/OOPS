# Wave 21: Klein digests the Seer potion by reading for others (2026-11-16)

Resume wave after the weekly reset. Coordinator: the foundation-run session (Opus), with the default from "Opus chats and UI refinement" (2026-11-15, AD5/AD56, a proposal). One lane (Opus). Rules applied: OR1–OR10, AD38, AD43, AD56, UR70, PRS1–PRS8, AR1.

```receipt
build: scratch tree only (no dist/ or index.html committed this wave; the coordinator session builds before each push gate)
route: earned private save lotm-kjw42, then play
state: committed (hash in RUN.md)
viewport: 1920x1080 headless Chrome
persistence: no new save slice; actor facts book.lotm.be.acting.<row> and knowledge; save, reload, Export and Import into a fresh origin keep the count
tests: see Checks
review: agent-verified, not human-reviewed
```

## What the player can now do

In Klein's own life, readings he gives to other people now count as acting the Seer, and he can see the potion settle. From `lotm-kjw42`:

1. Retrieve your cane, then return with Old Neil to the Moretti flat.
2. At the Blackthorn Security Company office, take Old Neil's lessons: "Learn chart divination from Old Neil" (45 min), then the tarot lesson (45 min). Both sit in the Rites and questions list.
3. Back at the flat, "Take the carriage to the club for Hanass Vincent's client" (40 min). At the Divination Club, Hanass Vincent introduces Glacis, who gives the details and key times of his iron-mine investment.
4. Chart the investment: gather, draw, read.

The line under Here moves from "The Seer potion is settling as you play the Seer: 4 of 6 readings given to others in the Seer's role." to 5 of 6. It starts at 4 because the pack's four paid club sessions (Anna, Joyce, Glacis, Bogda) count.

A blocked reading now names what it lacks, for example "Have paper, a pen and the ability to construct and read an event chart.", instead of a generic "missing" line (UR70, in `quoteDivinations`).

- **Clicks:** about nine from the save to the counted reading.
- **What was confusing:**
  - Away from the office, a lesson row says only "This is done somewhere else; go there first."; the place is named in the row's own text.
  - 6 of 6 is not reachable on this route. The tarot and numerology readings need contact keys nothing grants yet (`contact.bogda-operation`, `contact.joyce-birth-date`).
- **Held-out scores:** none moved. Divination has no held-out split.

## Proposal lines (labelled in code, adjustable)

- **Neil's lessons.** Old Neil teaches chart and tarot. Canon has him teaching mysticism in Klein's first weeks (zh 第19-21章); chart and tarot by name have no locator. The gate is the office only. His presence and a first-weeks window are dials, set off, because the cast schedule stops placing Neil after day 7.
- **The club case.** It is Glacis's iron-mine chart (row zh 第62章 p70; canon's later chart for him, zh 第115章 p54), and it needs chart learned. Canon names only (Glacis, Hanass Vincent), nothing invented.
- **Counting.** One act per reading row. An unclear reading does not count (`COUNT_UNCLEAR`). The pack's client sessions count (`COUNT_CLIENT_SESSIONS`). The number 6 and the felt words come from the probationer's `LOTM_DIGEST_ACTS` and `digestionFelt`. `book_world_lotm_state.js:92` is untouched.
- **Where the rows live.** The lessons and the club case sit on the divination command list, because pack place acts are one forced sequence and cast talks follow a schedule that never places Glacis. They move to a side-act seam when one exists.

## Files

- New:
  - `src/lotm_be_acting.js`: the counter, the interpret hook and the line.
  - `src/lotm_be_div_learning.js`: the lessons and the club case.
  - `tests/lotm_be_acting.test.js`.
- `src/cast_divination_adapter.js`: an `interpretEffects` option, and named unmet reasons in `quoteDivinations`.
- `src/book_world_lotm_cast_host.js`: two imports and the command-list line.
- One line each in `src/book_world_lotm_host.js` (`beDigestion` in the resident view) and `src/book_world_lotm_ui.js` (the printed line, tagged `data-lotm-mind="digestion"`). Daily-loops owns these files and cleared both lines.

## Checks

- `tests/lotm_be_acting.test.js`: 4 of 4. A cancelled interpret writes nothing, a repeat does not double count, the unclear variant counts nothing, and the blocked row names its means.
- Focused: Klein, divination, perspective_controls, lead_saves_load and panel files, 49 of 49.
- `check:arch` exit 0, no new cycles. `check:rules` exit 0, with 0 new player-text findings.
- `check:flow` exit 0. One finding, "no rain within ten played days", is a Village state and not this slice's.
- `check:visual -- --lives` exit 0. klein-kjw42 differs by 37 dither pixels.
- The lane's `test:changed` did not finish: 681 files were queued behind the single suite slot. The full suite on the combined tree stands in for it (see RUN.md).
- Browser, headless at 1920x1080 on a scratch build of `fbfa6601e`: the full click path, then save, reload, and Import into a second origin all keep 5 of 6, with no page errors. Captures: `klein-fbfa6601e-1-start.png`, `-2-after-reading.png`, `-3-rites.png`, `-4-imported.png` (coordinator scratch, sent to the coordinator session).

## Next

Give the tarot and numerology readings their contact and grounds keys through canon client cases (Bogda's operation, Joyce's birth date), so 6 of 6 is reachable and the "settled" word can show.
