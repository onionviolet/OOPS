# Steam library wave 2026-10-10: targeted game audits

Dispatched 2026-10-10 by Claude Code at Weibao's request: "I am installing
a bunch of games now so send out targeted codex accordingly." Personal-use
reconstruction is authorized (vault `Game_Idea_Bank.md`, 2026-10-05).
Each Codex run is told which section below is its own. One writer per
game folder.

Read first: AGENTS.md, PROJECT.md, `docs/RULES_FROM_SCRATCH.md` (the
accepted rulebook), and the north-star sections named in your section of
`docs/LIFE_SIM_NORTH_STAR.md`. Follow the method of
`docs/gm/dispatch/tale-of-immortal-2026-10-08/ASSIGNMENT.md` for
extraction, hashes and outputs, with the changes below.

## Shared rules

- **Read-only on installs.** Never launch a game, never touch saves or
  settings, never modify the install folder.
- **Disk is very tight (about 6.6 GB free on 2026-10-10 while downloads
  run).** Read files in place. Copy or extract only what the audit needs to
  `~/.codex/research/<game>/` (hash it). Before writing more than 200 MB,
  check `df -h ~`; if free space is under 3 GB, stop extracting, write the
  CHECKPOINT and wait 15 minutes before checking again. Delete your own
  temporary extracts once the text you need is saved.
- **Waiting for a download.** If your game isn't fully installed, check
  its manifest `~/Library/Application Support/Steam/steamapps/appmanifest_<appid>.acf`
  every 10 minutes (no tight loop). Fully installed means `"StateFlags"
  "4"`. Give up after 12 hours and record that in the CHECKPOINT.
- **Uninstall:** don't uninstall. Weibao is managing installs; record in
  the CHECKPOINT when your pass is complete so he can remove the game.
- **No YAIR source edits, builds or commits.** Write only in
  `docs/research/<game>/` and `~/.codex/research/<game>/`.
- **Outputs** in `docs/research/<game>/`: INTAKE, REPORT (short and plain
  first), FINDINGS (with file or table locators), COVERAGE (what was read,
  what stayed opaque), IMPLEMENTATION_PACKETS (five to ten ranked
  proposals mapped to existing YAIR systems and the north star), SMALL
  TOUCHES (twenty or more), CHECKPOINT (kept current).

## The unbiased lens (applies to every section)

Weibao asked for an unbiased lens. Report the source as it is, not as our
docs would like it to be:
- Record what the game actually does, including things that contradict or
  don't fit our north-star ideas. Contradictions are findings.
- Label every claim: **seen in data or code**, **seen in text**, or
  **inferred**. Don't present inference as fact.
- Don't rank games against each other or invent general rules from one
  game. A pattern is a pattern only when you name the evidence.
- Proposals are proposals. Only PROJECT.md accepted decisions and
  Weibao's quoted words bind; the rulebook says each world makes its own
  rules, so frame proposals as options, not bans or musts.
- Note what the game does badly or what players complain about, if the
  source shows it.

## Sections (one Codex run each)

### A. Increlution (app 1593350, installed)

Topics: random rebirth, persistence across runs, idle life sim. Expected
Unity. Questions: what carries between lives and why; how a life is
structured (age, stages, death); automation and the idle loop; how skills
grow across lives; pacing of the first life versus later ones; UI for a
life in text. North-star sections: "What persists across runs, and the
gameplay loop", "The next life is random unless you planned it",
"Heirs, families and life beyond the first character".

### B. Sunless Sea, then Sunless Skies (apps 304650 installed, 596970 downloading)

Topics: succession and legacy, storylets and qualities. Questions: what
a dying captain passes to the successor (and how the player chooses);
the storylet and quality model (how text events are gated and chained);
death, terror and hunger as pressures; how legacy changes the next run;
what Skies changed from Sea. North-star sections: heirs and lone wolves,
"Same player, related character", events and storyteller sections.
Audit Sea first; start Skies only when it's installed.

### C. Planescape: Torment: Enhanced Edition (app 466300, downloading)

Topics: an immortal who keeps dying and meets the traces of past
incarnations; death as a mechanic. Infinity Engine: dialogue files (DLG),
strings (TLK), scripts (BCS) and items; use a reader such as NearInfinity
or a Python IEDB parser installed under `~/.codex/research/tools/`.
Questions: how death and return work in play; how past incarnations are
represented (journals, NPCs who knew them, items, legends); how memory
returns; how the world reacts to an immortal; alignment and identity
change. North-star sections: "Same player, related character",
"Fragments, legends, enemies and obscure routes", "Who or what you start
as".

### D. Citizen Sleeper, then Citizen Sleeper 2 (apps 1578650, 2442460, downloading)

Topics: a construct start (an emulated mind in a decaying artificial
body), daily dice, progress clocks, a crew in the sequel. Expected Unity,
likely ink scripts. Questions: how the body's decay and maintenance work;
the daily dice economy; clocks and how they're shown; ownership and
freedom of an artificial person; what the sequel adds. North-star
sections: "Who or what you start as" (construct), idle and offline, UI
sections.

### E. Disco Elysium (app 632470, downloading; about 10 GB, may not fit)

Topics: skills as inner voices, the thought cabinet, text UI. If the
download can't complete for disk reasons, record that and stop. Questions:
how skills speak and check; thoughts as researched ideas with effects;
failure as content; how identity and memory loss shape play (the
amnesiac start). North-star sections: "Who the player is", memory-loss
mode, "How to represent powers and hidden things in text".

### F. Vagrus: The Riven Realms (app 909660, downloading; about 4 GB)

Topics: text caravan and company management, companions with their own
minds. Questions: company and crew management; travel and supply; text
events and choices; companions' loyalty and departure. North-star
sections: followers and factions, heirs (loyalty), work.

## After all sections

The last run to finish writes `docs/research/steam-library-wave-2026-10-10/REPORT.md`:
what each game adds to the north star, contradictions found, and the
install state of each game.
