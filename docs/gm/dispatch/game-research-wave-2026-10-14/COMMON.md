# Game research wave, 2026-10-14: common rules

## Authorization

Weibao, 2026-10-14, after a status answer on remaining games to absorb:

> do both, also work through partial lanes too? we dont mind going through
> path of the idle cultivator, we dont need to copy code, just go through how
> things are implmented and more? https://en.wikipedia.org/wiki/Discworld_MUD
> Some stuff should be installed now, make sure the province war is able to
> refer and use the audits too? More to consider? ... Send out the stuff for
> all the free stuff too? Go ahead, should we do reaudits of prior stuff and
> more?

The standing decompile task also applies: source-read every queued game he
owns, read-only ([queue](../../../research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md)).
Personal-use reconstruction is authorized. Reading obfuscated or minified
code to learn *how things are implemented* is authorized. Copying code or
assets into YAIRPG is not.

## Hard rules

1. **Never edit the main checkout** except your own output directory, which
   your lane prompt names. About 20 other Codex runs are live. No `src/`,
   `tests/`, `dist/`, PROJECT.md, USER_VISION.md or IDEA_INDEX.md edits. Put
   proposed owner edits in your report.
2. **No git add, commit or push.** The coordinator commits your output dir.
3. **Installs:** read-only. Never launch a game, run an injector, touch saves
   or CrossOver bottles, click Steam dialogs, log in, accept terms or buy.
   Don't uninstall.
4. **Work area:** `~/.codex/research/<lane>/` (`repos/`, `tools/`, `extract/`,
   `notes/`). Raw game data, decompiled code, deobfuscated bundles, wiki dumps
   and clones stay there, out of git. The repo gets analysis, short
   paraphrase, and tiny identifiers or field names only. Hash extracts in
   `extract/HASHES.txt`.
5. **Tools already here:** `~/.dotnet/dotnet` (SDK 10.0.402) with
   `~/.dotnet/tools/ilspycmd` 11.1 (set `DOTNET_ROOT=$HOME/.dotnet` and put
   both on PATH), Ghidra 12.1.4 (Homebrew), Java, python3, cargo, node, brew.
   User-local installs are fine (cargo install, dotnet tool, pip into a
   venv under your work area, brew CLI). No sudo. Record every install in
   your TOOLING.md.
6. **Untrusted downloads:** clone or unpack each into its own empty dir
   under `repos/`. Read before running. Python with `-I`, paths as args.
   Prefer building from source. Never run Windows executables.
7. **Fetching:** after one failed fetch of a page or repo (403, login wall,
   TLS), switch routes (archive.org snapshot, MediaWiki API, official mirror,
   source repo). Don't retry variants. No account logins. Polite rate: one
   request per second or slower for wikis.
8. **Sealed secrets:** public franchise twists are fine. If you design a
   YAIRPG secret, refer to it by ID only outside sealed files
   ([rule](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10)).
9. **Unbiased lens:** report the source as it is, contradictions included.
   Label each claim shown / stated / inferred, and cite file paths, table
   names or page URLs.
10. **Standing direction:** read PROJECT.md (top 80 lines) and the relevant
    parts of `docs/USER_VISION.md`. Proposals are labelled PROPOSALS. Keep
    every reasonable option reachable ("everything possible, reasonably"),
    no fixed "once" limits for a solo player, desktop first.
11. Plain English, short words, no em dashes.

## Output shape (game lanes)

In your output directory, like other game passes (see
`docs/research/hogwarts-legacy/` for a recent full example):

- **REPORT.md** first: short plain-language summary, then ranked PROPOSALS
  (five to ten) for YAIRPG with the owner system each touches, then a table
  that confirms, corrects or extends any prior lane's findings.
- **FINDINGS.json**, **IMPLEMENTATION_PACKETS.md**, **SMALL_TOUCHES.md**
  (twenty or more), **TOOLING.md** (repos with commits, installs, commands
  that worked, dead ends, so a rerun is mechanical), **CHECKPOINT.md**.
- Digests where the data is rich (one file per system, paraphrased).
- **CHECKPOINT.md** stays current as you go: done, next pending item,
  unread table, disk used. A restart resumes from it.

## Done check

Your lane is done when CHECKPOINT.md says `Status: COMPLETE` or
`Status: PARTIAL` with an unread table naming each gap and why. End with a
short final message: what you answered, the top three proposals, the gaps.
