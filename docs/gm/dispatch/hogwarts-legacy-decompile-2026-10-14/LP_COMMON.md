# LP slices: common rules (LP2-LP8)

Dispatched 2026-10-14 by Claude Code. Weibao, after LP1 launched: "run the
other ones now and more?" This authorizes implementing the remaining
Hogwarts Legacy proposals LP2-LP8 from
`docs/research/hogwarts-legacy/IMPLEMENTATION_PACKETS.md` as labelled,
reversible PROPOSALS in the current playable world. No new world or
prestige layer. Original content only: no Legacy names, assets or text.
Weibao accepts taste later by playing.

## Paths

- Your worktree: `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/hl-<lane>`
  on branch `codex/hl-<lane>`. Write only there. `node_modules` is a
  symlink to the main checkout; don't install packages.
- Main checkout is dirty with other agents' work and many Codex runs are
  live. Never edit it.
- Report: `docs/research/hogwarts-legacy/<LANE>_REPORT.md` in your
  worktree, committed on your branch. Evidence screenshots in
  `docs/research/hogwarts-legacy/<lane>-evidence/`.
- Browser: only your assigned port. Serve with
  `python3 -m http.server <port> --bind 127.0.0.1` from your worktree.
  Playwright: `require('/Users/weiwei/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')`.
  Example harness: `docs/gm/dispatch/vivid-proto23-flow-2026-10-13/checks/browser.cjs`.

## Read first

AGENTS.md, PROJECT.md, the standing UI priority in docs/USER_VISION.md,
`docs/research/hogwarts-legacy/REPORT.md` and `IMPLEMENTATION_PACKETS.md`
(your LP row is the spec and acceptance), the matching earlier packet in
`docs/research/hogwarts-games/IMPLEMENTATION_PACKETS.md` (P1-P5), and the
relevant digest. Grep `src/` for existing seams (teachers, lessons,
knowledge provenance, workshops/stations, scheduler, relationships,
calendar, counters) and reuse them. Don't build a parallel system.

Sibling lanes run at the same time on other worktrees (see SESSIONS.md in
the dispatch folder). Keep your changes local to your feature; avoid
reformatting shared hot files (save schema, main UI shell) beyond the
lines you need, so merges stay small.

## Gates

1. `npm run build`, focused tests, full `npm test` (report the count; name
   pre-existing failures, don't fix unrelated ones).
2. Fresh-origin desktop browser run at 1366x768 that exercises your LP
   row's acceptance path, with screenshots.
3. Persistence: new state optional, absent from old saves; old saves load
   unchanged. Save, reload, Export and literal Import with no duplicated
   rewards or stock. Record the compatibility decision.
4. Anything not exercised is implemented-unverified. Mobile is deferred.

## Rules

Per-world numbers are authored here; Legacy values are reference only. No
fixed "once" limits beyond save safety. Commit on your branch in small
plain commits, no `Co-Authored-By` trailer, no push, no merge. Sealed
secrets apply. Stop and record a blocker rather than guessing on save
formats or a USER_VISION conflict.

## Report

Plain summary first: what the player now does, with the exact UI path to
try it. Then files changed, checks with exact results, compatibility
decision, implemented-unverified items, merge risks against
`codex/gameplay-foundations` and sibling lanes, and the one remaining gate
(Weibao's play and taste). Plain English, no em dashes.
