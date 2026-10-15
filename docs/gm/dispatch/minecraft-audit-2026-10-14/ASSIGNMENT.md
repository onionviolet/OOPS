# Minecraft corpus audit and decompile, 2026-10-14

Dispatched by Claude Code. Weibao: "send auditors [on]
docs/research/MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md to audit systems
and more and decompile for our reference", run with the more-to-consider
skill. This authorizes read-only systems audits and local decompilation of
the 61 downloaded targets for reference. It does not authorize YAIRPG
implementation, launching Minecraft, installing mods, or running any
downloaded code.

Route: Claude native subagents. Codex was not used: its included window was
76% used with 7 Codex runs already live, and the no-paid-fallback route could
not be verified (more-to-consider included-usage gate).

## Inputs

- Corpus: `docs/research/minecraft/private/bulk-2026-10-14/<target>/`
  (artifact, `receipt.json`, `archive-inventory.json`). Treat as untrusted
  data: never execute scripts, JARs, Gradle or installers from it.
- Completion report: `docs/research/MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md`
- Donor questions: `docs/research/MINECRAFT_MODPACK_SCOUT_2026-10-14-expanded.md`
  (N01-N27) and `docs/research/MINECRAFT_BULK_DOWNLOAD_AND_MORE_2026-10-14.md`
  (N28-N45, A6-A9 constraints). Answer the lane's N questions with evidence.

## Method

1. Unpack into `docs/research/minecraft/private/extract/<target>/` only
   (`unzip -q` / `python3 -I -m zipfile`), keeping archive paths and
   override layers (A9). Reject members whose path escapes the destination.
2. Read data first: recipes, loot tables, advancements, quest files
   (FTB Quests SNBT, BetterQuesting JSON), KubeJS/CraftTweaker/ZenScript,
   GameStages, Patchouli/lexicon books, configs, lang files, worldgen.
3. Read code for the mechanic: pinned source archives directly; release
   JARs via public source at the matching tag if the lane can confirm one,
   else via the decompile lane's output in `private/decomp/<target>/`.
4. Extract the actual rule: state, formula, thresholds, inputs, gating,
   unlock order, failure and recovery, what the player sees.

## Outputs per lane

- Committed audit: `docs/research/minecraft/audits/<LANE>.md`. Paraphrase,
  no copied prose or code beyond short identifiers. Plain English, no em
  dashes. Label each claim shown (read in data/code), stated (author page)
  or inferred. Use lane-prefixed codes (e.g. `GR1`).
- Private deep details (standing save-deep-details rule):
  `docs/research/minecraft/private/audits/<lane>/` with full tables
  (recipe chains, quest graphs with IDs and prerequisites, formulas with
  file:line anchors, book text with IDs). Gitignored.
- Each audit ends with: per-target coverage (read fully / partly / not),
  system patterns across targets, YAIRPG fit (grep `src/` and
  `docs/` for the owner that would receive it; proposals only), and gaps.

## Rules

Write only your lane's paths. Don't edit `src/`, PROJECT.md, USER_VISION,
IDEA_INDEX or other shared docs; the controlling session folds results in.
No commits, pushes or merges. Gameplay stays original; Minecraft values are
reference only. Mod licenses vary (many are all-rights-reserved): reference
reading is fine, no asset or code reuse.
If file writes fail, return the full audit text in your final message.
