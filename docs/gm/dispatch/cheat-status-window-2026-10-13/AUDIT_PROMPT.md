# Audit prompt: status window, optional start and stage 1 readiness

Paste everything below the line into a new chat opened in
`/Users/weiwei/code/yet-another-idle-rpg`.

---

Audit the cheat status window work in YAIRPG and judge whether stage 1 is
ready to build. You are an independent auditor: report what is true, with
evidence, including contradictions. Do not fix anything, commit, push or
change gates unless I ask after reading your report.

## Read first

- `AGENTS.md` (sealed secrets rule, verification rules, UI priority:
  desktop/laptop first, mobile deferred) and `PROJECT.md`.
- `docs/USER_VISION.md`: the 2026-10-13 entries on cheat acquisition,
  progression, the status window, what counts as a cheat, and the UI lane.
- `docs/CHEAT_LIBRARY.md`: every 2026-10-13 section (acquisition AQ, unlock
  gates US, dormant starts ST11-ST17, status window SW, unlock progress UP,
  random starts RS, standing WR, library tab LB, extra types CT, and
  "status window stage 1" S1).
- `docs/PANEL_KIT.md` and `docs/gm/dispatch/panel-kit-2026-10-13/CHEAT_PANEL_CARDS.json` (CH1).
- `docs/gm/dispatch/cheat-status-window-2026-10-13/`: `GOAL.md`, `progress.json`,
  `C0_REPORT.md`, `CH1_REPORT.md`, `checks/c0_gate.cjs`, `checks/ch1_gate.cjs`,
  `check_ch1.sh`, `fixtures/README.md`, `runs/SESSIONS.md`.
- Research drafts: `docs/gm/dispatch/cheat-considerations-2026-10-13/W1-W3`.

## What was shipped (claims to verify)

On `master` (merge `4af280e7`, bundle `8d3f8edb` or later):

1. **C0 cheat save field:** optional `save.cheats = {schema:1, held, known}`;
   old saves load with it empty; invalid cards are refused at import with a
   message; `src/cheat_cards.js` holds the closed card/state contract.
2. **Optional start:** hero creation offers "Optional beginning" (No system,
   Begin with a system, Surprise me), default none. A chosen system is held
   **dormant** and wakes on the first won fight or day 3, writing its first
   system message to the log.
3. **Status window (CH1):** a panel-kit panel that does not exist, by name or
   label anywhere, until awakening; then reveals once (never on reload or
   import); shows level, stats, titles, points (0) and an empty quests line;
   has a row-density setting and Appearance support.
4. Main.js hunks are listed in `CH1_REPORT.md` and `C0_REPORT.md`.

## Audit questions

Label every finding F1, F2 and so on, each with evidence (file:line, command
output, screenshot path) and one label: **natural** (reached by ordinary play
from a new game), **seeded-native** (fixture built by real game code, then
exercised in a browser on the rebuilt bundle) or **source** (code reading or
Node tests only).

1. **Correctness:** do the shipped claims hold on a clean build of the
   current `master`? Rebuild (`node build.js`), serve the repo root on a free
   port, and run `checks/ch1_gate.cjs` and `checks/c0_gate.cjs` with
   `REPO=<repo root>` and `URL=<your port>`; then `npm test`.
2. **Gate honesty:** could each gate item pass while missing the intent?
   Earlier gates in this lane missed things (bar text contrast, a combat
   animation counted as a reveal), so look for similar gaps: what does H1-H6
   or Z1-Z5 not measure?
3. **Natural play:** from a fresh origin at 1366x768, start a new game with
   "Begin with a system" and play to the awakening without fixtures. Measure
   how long day 3 takes in real time. Is the dormant period sensible for an
   idle game, and does anything leak the cheat's name before awakening
   (picker, labels, titles, tooltips, settings, Appearance module list, save
   export text shown to the player)?
4. **Progression:** does the optional start give power too early, contrary to
   Weibao's concern? Does stage 0 stay informational?
5. **Persistence:** save, reload, Export and literal-file Import into a new
   origin, before and after awakening. Old saves (`docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/fixtures/*.save.txt`) still load.
6. **Shared-code risk:** review each main.js and save_files.js hunk for side
   effects on other systems (heir requests, content packs, import probe,
   read-only tabs, foundation save blocking).
7. **UI quality:** fit, contrast and keyboard (F6, focus ring) at 1366x768,
   1440x900 and 1920x1080 in Vivid and Standard; the status window's look
   against the rest of the panel kit.
8. **Consistency with direction:** do the docs and build agree with
   USER_VISION (optional start first, everything possible, rarity per world,
   status window is a cheat only where it goes beyond the world's baseline)?
   Note anything that contradicts accepted direction.
9. **Stage 1 readiness:** given `src/quests.js`, `src/titles.js` and the S1
   considerations, what is the smallest safe stage 1 slice, what existing
   owners should it reuse, what save shape would it need inside the held
   card, and which considerations conflict or are underspecified? Propose
   a done check for that slice (items, measurements, fixtures), without
   building it.

## Constraints

- Sealed secrets: never state a sealed world truth; refer by ID and status.
- Keep user saves private and untouched; use fresh browser origins.
- Do not edit gates, source or docs during the audit.
- Separate verified facts from inference.

## Deliverable

Write `docs/gm/dispatch/cheat-status-window-2026-10-13/AUDIT_REPORT.md`:

1. A one-paragraph verdict.
2. Findings F1… ranked by severity, each with evidence and label.
3. Gate gaps (what to add to the checks), as proposals.
4. Stage 1: recommended slice, reused owners, save shape, proposed done
   check, open questions for Weibao (at most three).
5. What was not checked and why.

Then reply in chat with the verdict, the top five findings and the link.
