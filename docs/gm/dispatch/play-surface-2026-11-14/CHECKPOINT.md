# Play surface lanes, 2026-11-14

Coordinator: the "Opus chats and UI refinement" session. Direction: [Weibao, 2026-11-14](../../USER_VISION_LOG_2026-11.md#play-surface-ui-per-feature-combat-across-worlds-daily-loops-2026-11-14). Fable usage is exhausted until 2026-11-16, so every chat runs on Opus. Usage at dispatch: 5-hour window 6%, weekly all-models 56%.

```receipt
build: n/a
route: n/a
state: drafted
viewport: n/a
persistence: n/a
tests: coordination record only; each lane keeps its own receipt in its owning doc
review: none
```

## Lanes and owners

| Lane | Session | Owns | Done when |
| --- | --- | --- | --- |
| Feature-by-feature UI (farming first, then crafting, mixing, care display, gathering) | feature-ui, `local_7ab5da3b` (new) | Feature panel UI files: `field_works_ui.js`, `field_ui.js`, `field_layer_panel.js`, crafting and mixing display, care display; a new round in the UI audit ledger | Farming and two more features seen before and after in headless Chrome at 1920×1080, with ledger lines and commits |
| Daily actions and loops for the three leads | daily-loops, `local_4ce8289f` (new) | Duties, livelihood and lead-day files; a new round in the lead core-flow audit | Map saved, loops proposed, and one lead's day loop playable at floor (AD43) |
| Combat refined and carried across worlds | Combat refined and carried across worlds (Opus), `local_7da0d3f3`; the Fable-limited family (`local_263f9375`, combat-design and children) is paused | `contest.js`, `combat_situation_ui.js`, contest and fight tests | One playable fight carrying the new possibilities, with a familiar surface, in each lead's world |
| Foundation run, oriented to play (OR1–OR10 in its RUN.md) | foundation-run, `local_dc54e7c3` (resumed on Opus) | Procedural foundation modules and its run docs; panel rows go through the owning lane above | One wave with a playable outcome seen in Chrome, or a usage stop at a resume block |
| Day strip follow-ups | Switching to Opus model, `local_2ce54229` (took over from the UI and vision coordination chat when it hit its Fable limit) | `src/ui/day_strip.js`, `styles/day_strip.css` | Its own list: instant hide at fight start, hide over centre views, the clipped tempo card, LOTM disabledReason, home baseline |

`src/book_world_lotm_ui.js` had another chat's uncommitted edit at dispatch; by default the other lanes leave it until that edit is committed, because two writers on one file lose work.

## Shared gates

- Browsers run headless, so nothing opens on Weibao's screen.
- `npm run test:changed` while working, and `check:arch` plus `check:rules` before each commit.
- Build with `sh scripts/clean_bundle.sh`.
- Commit your own paths from a fresh HEAD.
- No push without Weibao's yes, and no `Co-Authored-By` trailer.
- Report "agent-verified, not human-reviewed".

## Delivered so far (agent-verified, not human-reviewed)

- **Feature UI** (feature-ui). Farming and the courtyard, crafting, mixing (76c5f1682, b361fa580). Reports' Earlier lines (a529e0db5). The Gu house rows (38d7b3d25). Gathering (dd22b9148). Carcass processing (6231596d7). Prices in the purse format (ea9249039). Blocked repeatable actions keep their reason (b00b56374). Result lines for instant acts (2d48e8948). A life's day on Here (a538b279e). The shop (04bf7b2c1). Ledger: UI audit, fifteenth and sixteenth batches. Eating and home, and training, are still in progress.
- **Daily loops** (daily-loops). Map and proposed loops (008fa95b1). Fang Yuan's ordinary day (425d14bb7, corrected in 89803de77). Natural sea recovery and seeded patrol nights (69a9ddda6), at floor. Next is Klein's wage loop, then Harry's timetable.
- **Combat** (combat lane, `local_7da0d3f3`, which took over from the Fable-limited family). CFC9 committed (49fb16bd3). One live fight per lead world on the familiar card: Klein's brawl, Harry's duel and Fang Yuan's hunt, with stakes presets, spells and Gu as kit rows and Hold back (ea9cbe543). Proof is under `combat/`, and the next-worlds table is in the carry-out. Not built: enchanted gear (AE1), counters, calibration against source fights (WS5).
- **Klein's wage loop** (fa49cee23): implemented, below floor. The browser gate is blocked by G18: late LOTM saves stall headless Chrome at PLAY, on HEAD too. The G18 bisect went to feature-ui on 2026-11-14.
- **Open:** F3 (the story cast in Around you) waits on G18.

## Waiting on Weibao

- The combat chat's pending question. It was asked before the new brief, so the brief stays queued until he answers it.
- The held UI picks: directions A to F, the top bar (UIC132, UIC175), the Notebook (UIC168) and the growing screen (UIC131). The mocks are in `prototypes/ui-directions-2026-11-13/index.html`.

## Log

- 2026-11-14: the parent combat chat was found frozen on an old question (master was already pushed), so the combat build went to its idle child, combat-design (`local_2359a5ca`), and started there.
- 2026-11-14: direction recorded; feature-ui and daily-loops started; the combat brief was queued to the combat chat; the day-strip chat was told the boundaries.
