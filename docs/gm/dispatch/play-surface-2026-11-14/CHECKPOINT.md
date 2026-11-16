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
| UI cohesion: directions A, B, D, F, then PS53–PS60 and making things make sense | ui-cohesion, `local_db49717e` (new, 2026-11-14) | Frame, shell, navigation, status line, inspector, ready-now hub; panel content stays with feature-ui | A, B, D, F seen in Chrome, and PS55–PS57 across three features |
| G18: late LOTM saves stall headless Chrome | G18 session, `local_a3b034e2` (started from the progress-atlas chat) | Done. Hang fix bb822ec5f (feature-ui, UIC203); load follow-up e29799c15 (UIC205: stale timer ticks coalesced, courtyard, practical works and seat filter no longer build whole views per poll) | kjw42 and kjw33 open in about 14 s at 1920×1080 with save, reload and import holding; left: ~3 workroom builds at boot and one context build per tick in four polls (UI audit, G18 section) |
| PS33: native cold in other worlds | daily-loops, `local_4ce8289f` | Cold conditions read the world's climate; under a roof is indoors | Fang Yuan is warm at the academy; the Village's cold is unchanged |
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
- **Klein's wage loop** (fa49cee23): at floor (f0bb7696a), played in Chrome at 1920×1080 on kjw42 after the G18 fix (bb822ec5f), with collect, reload and import holding. G18 is closed; the load follow-up is e29799c15.
- **Open:** F3 (the story cast in Around you), which waited on G18, can now be proved on kjw42. It is assigned to ui-cohesion, with its "This place" panel.

## Waiting on Weibao

- The combat chat's pending question. It was asked before the new brief, so the brief stays queued until he answers it.
- The held UI picks: directions A to F, the top bar (UIC132, UIC175), the Notebook (UIC168) and the growing screen (UIC131). The mocks are in `prototypes/ui-directions-2026-11-13/index.html`.

## Log

- 2026-11-15 ~19:40 UTC: the 8% push ended at about 95% weekly.
  - Landed:
    - D1 complete apart from a shift act: b935a6cab, 5d259c7a2, af8606722.
    - D3's Attend verb: 11c00073a.
    - D4's Gu tab: 5b72e15ad.
    - Box tabs and the Character home: 5c9592b37, 64952f26f, ae6fb5e04.
    - The crossing gate: 46eddef3e, with the headless fix e4c24f514.
    - The day-strip gate: 8d1713dd9.
    - knownNumber: 4a65f23ec, used on fight cards in e829434a0.
    - Losing terms: 27b3057d2.
    - D6 first slice: 6a362b11a.
  - The fight slot is retired (both fights already take column 2).
  - Open after the reset:
    - D2;
    - D4's Refine bench;
    - D3's exams-in-Quests part;
    - D5;
    - D6's ally cards and fixed Withdraw;
    - the Journal tabs for Knows, Notebook, People, Worlds and Beginning;
    - PS192's Here box;
    - box fit;
    - areas.
  - Unpushed since 44cca6fb3. The push gate needs `check:rules` clean; the save-architecture checkpoint is missing its build SHA, and that chat owns it.
- 2026-11-15: Weibao said "Build both" for the areas mock and drafts D1–D6. Dispatch at the reset:
  - Areas: a new lane on `travel_legs` areas, with ui-cohesion for the location box arrows.
  - D1 and D3 go to feature-ui; D4 to feature-ui with ui-cohesion's Skills box tabs; D2 to ui-cohesion's Skills tab with feature-ui's content.
  - D5 goes to daily-loops, after PS2/PS3.
  - D6 goes to combat, on ui-cohesion's fight-slot fix.
- 2026-11-15 ~10:00 UTC: weekly usage reached the 95% stop, and every lane has stopped until the reset at 2026-11-16 18:00 UTC.
  - Origin is at 44cca6fb3 after a green gate: 7,694 of 7,706 pass, 0 fail, 12 skipped. Since then, round 19 (a4788cc2d), the fight slot (4757435a5) and its bundle (2d663b839) are committed and not pushed.
  - Resume order:
    1. ui-cohesion slice 4: the fight slot shows during a tempo fight, the Journal and Skills box tabs, and round 18's Here box in column 3. Then slice 5, the knownNumber "?" renderer (PS130).
    2. Round 19's crossing gate (PS196) and day-strip gate (PS199).
    3. Combat's losing terms (PS45–PS52).
    4. Klein's acting slice (foundation run, resume block c4bc8f279).
    5. discord-features from PS167.
    6. feel-finish PS186–PS189.
    7. ui-drafting batch 2.
  - Waiting on Weibao: build the areas mock and drafts D1–D6.
- 2026-11-15 ~08:30 UTC: landing gate on 15af661c1 from a clean archive. Build, `check:arch` and `check:rules` pass. Full suite: 7,693 of 7,706 pass, 12 skipped, 1 fail: `tests/cheat_cards.test.js` "cheat old-save load and real create_save encode import round trip". Cause: `placeClassicOptions()` (`src/ui/feel_finish.js:102`, from 2148b0f13) moves `#options_panel` into the Feel settings group, which can drop it, and `load()` then reads a null `#options_textsize` (`src/main.js:2925`). Sent to feel-finish. The next push waits on that fix. Klein's acting default went to the foundation run's resume block (c4bc8f279), to start after the weekly reset.
- 2026-11-15 ~07:20 UTC, resume point (5-hour usage 93%, weekly 91%, weekly reset 2026-11-16 18:00 UTC). All lanes are idle.
  - Origin is at 6b9f623ea; everything after it is unpushed and needs a landing gate. Run the full suite from a clean tree, rebuild the bundle with `scripts/clean_bundle.sh` (discord-features left `dist/` unbuilt), and fix the failing `check:rules` receipt in `save-architecture-2026-11-15/CHECKPOINT.md`, which belongs to another chat.
  - Accepted direction: round 14 (YAIR's four columns), with slices 1 and 2 built. Slice 3 (modes replace the actions box; the fight slot) and slice 4 (Journal and Skills box tabs, fit to content) are next in ui-cohesion. The shared "?" renderer (PS130) and drag layout (PS179) follow.
  - Waiting on Weibao: build the areas mock (6708ffb4c) and drafts D1–D6 (af44e5786, 001c2a0d8, f833a3a8b).
  - Lanes and next items:
    - feel-finish: PS153–PS159 built (2148b0f13); PS186–PS189 and DU39/41/42 next.
    - discord-features: PS160, PS161 and DU40 built; PS167 next.
    - ui-drafting: kit pages 1 and 2 done; batch 2 next.
    - feature-ui: verbs, why-this-number and the craft details built.
    - combat: yield, fallen rows and the attack timer built; column 2 waits on slice 3.
    - daily-loops: Harry's week, tide, PS143 built.
    - foundation-run: waits on Klein's acting-method authoring decision.
- 2026-11-15: the Fang Yuan freeze was found by feature-ui: structuredCampaignView built the simulation facts about 200 times per read. Fixed in 81babde33 (UIC207); daily-loops' Chrome repro passes on 561b0348e in 37 s. The day-strip chat, the one pusher (Weibao: "work with the other chats, push accordingly"; "Yes, after freeze fix"), pushed origin 1225b97da..561b0348e. Gate: 7,639 of 7,651 pass, 11 skipped, 1 fail (`tests/procedural_reports.test.js:23`, which fails on HEAD as well and is being traced). `tests/headless/village_wave2.test.js` "rival recipe reaches study" also fails outside the suite, and is being traced too.
- 2026-11-15 ~01:40 UTC: feature-ui ran `pkill -f "npm run test:changed"` to stop a duplicate of its own run (against the stop-by-PID rule). Any lane whose `test:changed` died around then with no output reruns it. Separately, daily-loops found Fang Yuan's ch140 save freezing headless Chrome from 9093652ec on (fine at da06a080b). A bisect is running, feature-ui's UIC207 (the life view in one facts frame) is a likely fix, and the push waits for it.
- 2026-11-15 01:30 UTC: Weibao accepted UR88's notice tiers ([log](../../USER_VISION_LOG_2026-11.md#notice-tiers-adopted-2026-11-14), PS89, LLR28) and kept coordination in this chat after compaction (PS92 not needed now). ui-cohesion applies the tiers to Ready now, cues and the fight stops.
- 2026-11-15 00:18–00:20 UTC: daily-loops truncated `src/main.js` in the shared checkout (a script opened it for writing before reading it), then restored it from the headless runner's cached bundle source map. The coordinator checked the result: it parses, it has the same line count as HEAD (10,115), and the diff holds the G18 session's two hunks and daily-loops' PS33 lines. Builds and tests run in that window may have failed spuriously; the G18 session and ui-cohesion were told to recheck. Lesson: scripts that edit shared files read before they write, or edit in place with a backup (proposal).
- 2026-11-15 00:15 UTC: a full-suite run had held the machine-wide test slot for 1h34m. Two of its test processes (`tests/cheat_awakening.test.js`, `tests/cheat_cards.test.js`) sat at 0% CPU, and five more suites were queued behind it. The coordinator stopped the two by PID (SIGTERM, then SIGKILL) and the queue moved. `tests/cheat_cards.test.js` passes on its own (4/4, 12 s), so the hang came from that run, not the test. Gap: the limiter has no per-file timeout, so a hung file blocks every lane; a `--test-timeout` in the suite command would bound it (proposal).
- 2026-11-14: the parent combat chat was found frozen on an old question (master was already pushed), so the combat build went to its idle child, combat-design (`local_2359a5ca`), and started there.
- 2026-11-14: direction recorded; feature-ui and daily-loops started; the combat brief was queued to the combat chat; the day-strip chat was told the boundaries.

## Push 44cca6fb3..c063b3183, 2026-11-15

The first gate on 4e3fd82e2 was red, with four items. Each was fixed by its owning chat:
- the save-architecture receipt: cacf91368;
- the number-format ratchet: combat 7191134db, plus ui-cohesion cd9bf9f44;
- the clear_bonus "???" placeholder: 7191134db;
- seven oversized boxes: cd9bf9f44 and 77042d979, with the threshold unchanged;
- the stale bundle: c063b3183.

The second gate ran on a clean checkout of c063b3183. The bundle matches. arch, rules and docs exit 0. Flow has only the known no-rain finding. npm test: 7,724 tests, 7,712 pass, 0 fail, 12 skipped. The pusher (local_2ce54229) pushed a fast-forward. Rounds 20–22 (PS203–PS242, proposals) are in this push. The lanes resume after the 2026-11-16 18:00 UTC reset in the saved order, with the round 21 prototype lane (PS216, PS217, PS219, as flag variants per PS232) added.
