# itch.io decode wave: shared brief, 2026-10-22

Coordinator: the chat that wrote [the itch screen](../ITCH_IO_IDLE_SCREEN_2026-10-22.md).
Weibao asked to decode every screened game, consider more games, and use the
project toolset on obfuscated builds, with individual sonnet chats as needed.
Every decode chat reads this brief first.

## What YAIR is (enough to judge usefulness)

A browser/Electron life-sim idle RPG: one continuing person living across many
mechanically different worlds (book worlds, cultivation worlds, originals).
Current systems include body progression and cultivation, home building,
household staff and inheritance (`src/home_staff.js`, `src/heir_inheritance.js`,
`src/home_inheritance.js`), crafting with material lineage, expeditions and
sites, a branch/offline clock, a chronicle and lore history, companions. Accepted
direction lives in `docs/RULES_INDEX.md` (AD1-AD41). Cite AD codes when mapping.
Things already found and not to re-report: see the screen report's I1-I12.

## Allowed route (hard limits)

- **Static reads only.** Fetch exactly the files a browser loads for an HTML5
  build (the `html-classic.itch.zone/html/<id>/...` iframe and the assets it
  references, or the external host it iframes). Read them; never execute game
  code (no `node game.js`, no deobfuscators that evaluate the bundle such as
  webcrack/synchrony sandboxes, no opening the game in a browser).
- **Formatters and parsers are fine**: `node_modules/.bin/esbuild <file>
  --format=iife --outfile=...` as a pretty-printer, grep, python string
  extraction, source maps if served.
- **Engine builds**: Godot PCK via
  `~/.codex/research/idle-reincarnator/tools/extract_pck.py` and `decode_gdc.py`
  (reuse, do not rewrite). Unity WebGL via `python3 scripts/toolsets.py show
  unitypy` / `il2cpp-dumper` / `cpp2il` (run `doctor --probe` first; UnityPy
  for assets and text, Il2CppDumper on wasm + global-metadata for type and
  method names). Decompress `.br`/`.gz` with standard tools.
- **No native downloads** (Windows .exe/.zip, Android .apk), no accounts, no
  purchases, no visible windows.
- **Be polite to itch**: at least 4 s between requests to `*.itch.io` pages.
  On HTTP 429, wait 90 s once, then continue; do not hammer. The CDN
  (`html-classic.itch.zone`) is less sensitive but still sequential.
- Commit nothing. Edit no file outside your own paths below. Several sessions
  share this checkout.

## Output (per chat)

- Raw files and per-game notes: `docs/research/itch-io-2026-10-22/private/<slug>/`
  (gitignored). Notes include served URL, bytes, SHA-256, and line locators for
  every claim.
- One committable batch summary: `docs/research/itch-io-2026-10-22/BATCH_<name>.md`.
  Paraphrase only, no code or prose copied beyond a few identifiers. For each
  game: build identity, engine, readability (plain / minified / obfuscated /
  engine-compiled), and then:
  - **Systems**: mechanisms that exist in code, labeled `source`; claims you
    could not find, labeled `stated-not-found`. Note retired or dead code.
  - **Representations**: UI and presentation ideas visible in markup/strings.
  - **Improvements**: design corrections the developers explain in comments or
    changelogs.
  - **YAIR mapping**: owner file or AD code, and whether YAIR `src` already has
    it (grep before claiming a gap).
  - License if stated (no license = ideas only).
- End the summary with "Top findings" (at most 5 across the batch) and a
  verification line (what was read, what was not, tool calls used).
- Plain style, no em dashes. Everything is a proposal (AD32).

## Budget

Each chat: at most about 80 tool calls. Decode depth scales with value: a thin
game gets a five-minute check and one line; a rich one gets systems traced to
code. If a build is unreachable or native-only, say so in one line and move on.
