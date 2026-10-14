# Addendum 1 (2026-10-14): REA, Ghidra and blueprint tools

Weibao asked: "Use REA accordingly? Does it need to? other stuff and more?"
This extends ASSIGNMENT.md; where they differ, this wins.

## Correction

Ghidra IS installed (`/opt/homebrew/bin/ghidraRun`; find `analyzeHeadless`
under the brew Ghidra prefix). REA is not installed.

## REA: conditional, as the parked D2 trial

Read `docs/research/REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md` first.
REA (`morluto/rea`, last inspected at `bb540826d65316c164d2de8ba4ef10f81a8ad073`)
is an agent interface over Ghidra/IDA/Hopper, not a new decompiler.

- Most Hogwarts Legacy mechanics should live in data (DataTables,
  CurveTables, SQLite, StringTables) and Blueprint bytecode. Answer from
  those first. Don't run REA or Ghidra by default.
- If, after the data and blueprint pass, a named question is still open
  because the logic is native C++ (candidates: damage or XP formulas,
  stealth/detection, care timers, Ancient Magic meter), pick ONE function
  chain and run the D2 trial: Ghidra headless alone vs REA over Ghidra on
  the same chain, with the public SDK dump (below) to name symbols.
  Record evidence quality, elapsed time, disk/RAM and agent effort in
  `docs/research/hogwarts-legacy/REA_TRIAL.md`, plus exact exe hash,
  build 20773316 and tool versions. A verdict either way is fine; also
  write one line for `REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md` as a
  proposal in your REPORT (don't edit that file).
- If no native question remains, skip the trial and say why in CHECKPOINT.
- Install REA user-locally only if the trial runs; read its source first,
  pin the commit, no global npm/sudo.

## Other tools to add

- **Blueprint bytecode:** `trumank/kismet-analyzer` (Rust) to turn
  Kismet bytecode into readable flow. Use it on the blueprints that hold
  lesson, puzzle, vivarium, Room of Requirement and companion logic.
- **Public SDK / header dump** (Dumper-7 or similar, matched to the build)
  for class, field and function names. It anchors both asset reading and
  any Ghidra work. Record source and build match.
- **UAssetAPI/UAssetGUI source** as a fallback parser if CUE4Parse fails.
- **StringTables / localization** for player-facing names and
  descriptions, so digests use the game's own terms (paraphrased).
- **Universal-modder reverse-engineering guide** (`rehan-remade/universal-modder`,
  `skills/reverse-engineering/SKILL.md`) for target selection only; do not
  install its game-driving stack.

## More

- Write TOOLING.md as a reusable **UE4 IoStore recipe** (containers to
  JSON to digest, blueprint pass, optional native pass) that a later lane
  can apply to another Unreal game Weibao owns, with the Hogwarts-specific
  settings separated out.
- Add a short "what else this data could answer later" list to REPORT
  (ranked, at most ten), covering questions outside the five groups that
  the extracted data could answer cheaply.
