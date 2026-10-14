# Engine runtime dispatch, common rules (2026-10-14)

Request (Weibao): "engine level stuff, runtime, performance, and tech stack
stuff, more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful?"

Root palette (Claude owns it; read only for you):
`docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md`.
Also read `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md` (E1-E10) and
`docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md` (F1-F9).
Extend them; do not restate their rows.

Rules for every lane:
- Read `AGENTS.md`, `PROJECT.md` and `~/.claude/user-preferences.md` first.
- Read-only on `src/`, `tests/`, `dist/`, `index.html`, `build.js`,
  `package.json`, saves and private packs. No commits, pushes or installs
  into the repo. Scratch work (metafiles, benchmark scripts, temp builds)
  goes under your lane folder `docs/gm/dispatch/engine-runtime-2026-10-14/<lane>/`
  or `/tmp`; never overwrite `dist/`. Write only your owned files.
- Never open files named `SECRETS*`. Never use Weibao's personal saves; build
  synthetic fixtures if you need data.
- Style: plain short words, no em dashes and no " -- ", short codes on rows
  (lane prefix plus number, e.g. ER1-F3). Proposals, not specs.
- Label evidence: MEASURED (you ran it; give command and numbers), READ
  (source file:line), STATED (external doc with URL and date checked),
  INFERRED (your reasoning). A number without a command is not MEASURED.
- Recommendations rank by value per effort, name cost once, and say which
  root-palette code (RT, PF, DA, TS, CH, OS) they inform. Add new codes for
  anything the palette missed.
- Keep a short CHECKPOINT section at the top of your output so a resumed run
  continues. Finish with a REPORT file in your lane folder: files written,
  commands run, open questions.

## Round 2 (ER5-ER8), same rules

Weibao's follow-up: "Better options and more? Proper game engine and stuff to
incorporate and more?" Root palette sections G-J (EG, LB, AI, OS7-OS12) are
the new input. ER1-ER4 outputs may appear while you run; read them if present
and link rather than duplicate (especially ER3 tech stack options).

## Round 3 (ER9-ER11), same rules

Weibao: "Subtle micro stuff too?" Root palette section K (MC1-MC34) is the
input. ER1 (hotspots) and ER3 (stack) are finished; link them. Each finding
gets: severity for a long campaign (data loss, wrong outcome, annoyance),
file:line, a minimal reproduction idea, and a smallest fix proposal.

## Round 4 (ER12-ER14), same rules

Weibao: "Consider better engine options, building our own game engine, other
stuff and more? existing engines to use and more?" Root palette sections L
(OE), M (XE), N (SB) are the input. Finished outputs to build on: ER1
hotspots, ER2 structure (import cycles, host/content/facts pattern), ER3
stack. ER5 (engine options) and ER6 (libraries) may land while you run;
link rather than duplicate.

## Round 5 (ER15-ER16), same rules

Weibao: "Cheats that would show stuff like these and more? Overarching stuff?
Implementation implications?" Root palette sections O (CX), P (OV), Q (IM).
Cheat work follows the user's standing rules: per-world dials, no fixed
"once" limits, considerations not specs, sealed secrets by ID only.

## Round 6 (ER17-ER18), same rules

Weibao: "Considering comic worlds and stuff? Abstraction that's needed?"
Root palette sections R (CE, CX19-CX23, MC35-MC37) and S (AB1-AB15).
Comic world design is owned by docs/COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md
and its K lanes; read, link, never edit. Canon-first order is unchanged.

## Status

Folded 2026-10-14 into the root palette, section U. No lanes running.
