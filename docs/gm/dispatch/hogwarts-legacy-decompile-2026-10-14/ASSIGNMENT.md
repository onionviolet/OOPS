# Hogwarts Legacy decompile pass, 2026-10-14

Dispatched 2026-10-14 by Claude Code at Weibao's request: "send out decompile
workflow with relevant repos on hogwarts legacy ... use codex accordingly".
Standing authorization: decompile or source-read owned reference games
(2026-10-13). Personal-use reconstruction is authorized (vault
`Game_Idea_Bank.md`, 2026-10-05).

## State at dispatch

- Steam app 990080 installed: `~/Library/Application Support/Steam/steamapps/common/Hogwarts Legacy`,
  build 20773316, about 71 GB, StateFlags 4. Unreal Engine 4 (Phoenix project),
  IoStore containers (`Phoenix/Content/Paks/*.utoc/.ucas` plus `.pak`) and
  `Phoenix/Binaries/Win64/HogwartsLegacy.exe`.
- Prior public-page research (no install, no decompile):
  `docs/research/hogwarts-games/` (REPORT, FINDINGS F1-F15, packets P1-P5,
  CHECKPOINT with an explicit unread table). This pass closes that table's
  Legacy rows with file evidence.
- Local tools: python3, git, cargo/rustc, brew. No dotnet, Ghidra, repak or
  retoc installed. About 400 GB free.
- Other Codex lanes are running in this repo. Touch only the paths listed
  under Output.

## Rules

- Read-only on the install. Never launch the game, never run UE4SS or any
  injector, never touch saves (`~/Library/.../Hogwarts Legacy` save folders,
  CrossOver bottles), never click Steam dialogs, log in, accept terms or buy.
  Don't uninstall.
- Work area: `~/.codex/research/hogwarts-legacy/` (`repos/`, `tools/`,
  `extract/`, `notes/`). Hash what you extract (`extract/HASHES.txt`).
  Extract targeted subsets, not all 71 GB.
- Raw game data, extracted assets, decompiled code and cloned repos stay out
  of git. The repo gets only analysis, short paraphrase and tiny identifiers
  or field names.
- No YAIR `src/` edits, builds, saves or commits. No git add/commit/push.
- Toolchains: user-local installs are fine (cargo install, dotnet-install.sh
  into `~/.dotnet`, brew install of a CLI). No sudo. Record every install in
  TOOLING.
- Untrusted downloads: clone into its own empty dir under `repos/`, read
  before running, run Python with `-I`, pass paths as arguments. Prefer
  building from source over running prebuilt binaries. Never run Windows
  executables from these repos.
- After one failed fetch of a page or repo, switch routes; don't retry
  variants.

## Relevant repos (clone into `repos/`, record commit hashes)

Verify each exists and fits before relying on it; substitute a better
maintained equivalent if one is dead. Record what you used and why.

1. **IoStore and pak:** `trumank/retoc` (IoStore to legacy pak and listing,
   Rust) and `trumank/repak` (pak read, Rust). Build with cargo.
2. **Asset parsing:** `FabianFG/CUE4Parse` (C#; parse uasset/uexp
   DataTables, CurveTables, StringTables, blueprint exports to JSON). Needs
   dotnet 8 user-local. FModel is a Windows GUI: use its source only as a
   reference for game/version settings (`4sval/FModel`).
   Alternative if dotnet is a dead end: `trumank/jmap` or a Rust/Python
   uasset parser, or `atenfyr/UAssetAPI` (C#).
3. **Mappings/SDK:** Hogwarts Legacy is UE4.27-era unversioned; find a
   public `.usmap` mappings file or a public SDK/header dump for this game
   (search GitHub and the Hogwarts Legacy modding wiki/Nexus pages; record
   build match). No account logins.
4. **Game database:** the game ships SQLite data (community mods edit a
   `PhoenixShipData`-style `.sqlite` inside the paks). Find it in the file
   list, extract it and read it with `sqlite3`. Find public repos or docs
   that describe its tables (modding wiki, database editor mods' source).
5. **AES key:** check whether containers are encrypted. If so, use the
   publicly posted key for this build (record source); if no key is public,
   record that and continue with unencrypted parts.
6. **Executable (optional, last):** strings/symbol skim of
   `HogwartsLegacy.exe` only if a question can't be answered from data.
   Ghidra full decompile is out of scope unless a named question needs it.

## Questions, in priority order

Read first: `docs/research/hogwarts-games/REPORT.md`, `CHECKPOINT.md`,
`IMPLEMENTATION_PACKETS.md`; `PROJECT.md` top 60 lines; the relevant parts of
`docs/USER_VISION.md` and the Harry Potter world owners found by grepping
`docs/worlds` and `docs/research/power-systems` for Hogwarts. Don't edit them;
propose changes in your report.

1. **Spells and lessons:** spell list and data fields (cooldown, category,
   tags, combo/break rules, shield color counters); how a spell is learned
   (class assignment, quest, lesson) and the assignment data that gates it.
   Answer the open question: does a learned lesson have noncombat uses in
   data (puzzles, environment interactions), and how are those wired?
2. **Progression:** XP sources and level curve, talent trees (all nodes,
   costs, gates), Field Guide pages and Challenges tiers, gear traits,
   upgrade/enchant slots, loom/gear stat tables.
3. **Care to craft:** Room of Requirement stations, potion and plant
   timers, vivarium beast care states, breeding, products (hair, feathers)
   and what they craft into. Exact recipe tables.
4. **School life:** house points or Cup data, schedule or term/season
   state, companion availability rules, relationship quests, OWL handling.
5. **World and enemies:** enemy factions, AI archetypes and resistances,
   Merlin Trials and Demiguise statue puzzle families, collection counts,
   ancient magic and its sealed/hidden progression gates (refer to any
   game secret by ID only in summaries).

For each answer cite file paths inside the extracted tree (asset path or
SQLite table plus column), and label shown / stated / inferred.

## Output (in `docs/research/hogwarts-legacy/`)

INTAKE, REPORT, FINDINGS (JSON), COVERAGE (JSON), IMPLEMENTATION_PACKETS,
SMALL_TOUCHES, TOOLING, CHECKPOINT, like other game passes:

- **REPORT.md** first: short plain language. Then a table that confirms,
  corrects or extends each Legacy-related F1-F15 and P1-P5 from
  `docs/research/hogwarts-games/`, five to ten ranked proposals for YAIRPG
  (mark as PROPOSALS), and twenty or more small touches.
- **Digests** (one file each, paraphrased data, not raw dumps): spell and
  lesson digest, progression digest, care-to-craft recipe digest.
- **TOOLING.md:** repos with commit hashes, installs, commands that worked,
  dead ends. Written so a later rerun on a new build is mechanical.
- **CHECKPOINT.md:** keep it current as you go (done, next pending item,
  unread table, disk used in `~/.codex/research/hogwarts-legacy/`). A
  restart resumes from it.
- Plain English, short words, no em dashes.

## Done means

All five question groups answered with file evidence or an explicit
"not in data, here is where I looked" row; TOOLING lets a rerun repeat the
extraction; CHECKPOINT unread table is honest. No gameplay implementation.
