# Lane TRIAGE: surface types and drawing board

Read `COMMON.md` in this folder first and check its precondition.

1. **Runtime census.** List every block mounted into the main surfaces (`location_actions_div`, location column, right column, `message_box_div`, left column), with source file and line. Start from `grep "getElementById('location_actions_div')" src/*.js` (about 28 modules) and the panel kit registry. Join it with `docs/gm/dispatch/ui-at-scale-2026-10-14/SURFACE_INVENTORY.md` where a family matches.
2. **Assign** each block a surface type (ST1–ST9) and a verdict (TR1 keep/restyle, TR2 rehome, TR3 drawing board into the Projects drawer with a one-line design note, TR4 retire only with a source check showing no player value). Write `TRIAGE_REPORT.md` here with the table before moving anything.
3. **Apply TR2 and TR3.** Rehome through `definePanel` homes and the foundation lane's drawers. Routine Local actions stays at about seven visible entries, one level deep. Settings such as Optional pacing go to settings. Reference material goes to journal tabs. Every move gets an unlock announcement (one log line plus a dot on the drawer) so nothing disappears silently.
4. **World start (ST3).** Move Optional worlds and Your beginning out of the side column into one full-screen threshold screen: preview, what you keep and leave, the world's rules, confirm, "Not now". Reuse existing world-entry commands and their checks; this is presentation and placement, not new travel rules. Leave room for future rebirth/prestige and the parked hero creation, but do not build them.
5. **Leave the mixing counter in place** for the APOTHECARY lane.
6. Checks: `node build.js`; `npm test` counts with pre-existing failures named; browser driver on a fresh origin: fresh game, populated fixture, each rehomed feature still reachable and working, world-entry threshold screen preview/cancel/confirm with a disposable save, save/reload, Export and literal-file Import. Before/after screenshots at the three sizes.
7. Report: `TRIAGE_REPORT.md` with census, verdicts, what moved, evidence and open items.
