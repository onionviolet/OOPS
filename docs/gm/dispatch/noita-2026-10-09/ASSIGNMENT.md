# Noita source pass, 2026-10-09

Dispatched 2026-10-09 by Claude Code at Weibao's request: "yes, feel free to
decompile accordingly once its done installing, and send out codex stuff to
do accordingly". Personal-use reconstruction is authorized (vault
`Game_Idea_Bank.md`, 2026-10-05). Weibao bought Noita (app 881100).

## State at dispatch

- Steam on macOS first "installed" Noita with 0 depots (Windows-only).
  Claude mapped 881100 to the CrossOver `notproton` tool in Steam's
  `config.vdf` (backup `~/Documents/Backups/steam-config.vdf.2026-10-09-noita.bak`),
  restarted Steam and sent `steam://validate/881100`. At 20:58 local the
  content log showed a ~1.39 GB download starting into
  `~/Library/Application Support/Steam/steamapps/common/Noita`.
- Another Codex lane (novel wave 2026-10-09b) is running. Don't touch its
  files.

## Method

Follow [library-games-2026-10-09](../library-games-2026-10-09/ASSIGNMENT.md)
and its referenced methods: read-only on the install, never launch the game,
never touch saves, never click Steam dialogs, log in, accept terms or buy.
Copy only what the audit needs to `~/.codex/research/noita/` with hashes. No
YAIR `src/` edits, builds, saves or commits. Raw game data and extracted
files stay out of git; the repo gets only your analysis and short excerpts
(paraphrase; tiny identifiers and field names are fine).

1. **Wait for the install.** Poll `steamapps/appmanifest_881100.acf`
   (`SizeOnDisk` > 0, `InstalledDepots` not empty) and
   `logs/content_log.txt` every few minutes, up to 90 minutes. Don't poll in
   a tight loop. If it never installs, record why in CHECKPOINT and stop.
2. **Extract.** Game data is in `data/data.wak` (a simple archive: header,
   file table of offset/size/name, then contents). Write a small read-only
   extractor in `~/.codex/research/noita/tools/` (or use a known public
   tool, recorded in TOOLING), extract to `~/.codex/research/noita/data/`,
   and hash it. Also note the `mods/` examples and any `.xml`/`.lua` outside
   the archive.
3. **Read, in this priority order:**
   1. `materials.xml`: material properties (cell type, density, burn,
      conductivity, tags, stains/ingestion status) and the **reaction**
      rules (inputs, outputs, probability, conditions). Count them; extract
      the full reaction structure and the tag vocabulary it uses.
   2. Status effects: stains and ingestion (`status_effects` data and
      scripts): how a material becomes a status, durations, stacking,
      cancellation (wet vs fire), and drink effects.
   3. Alchemy: how the two seeded secret recipes are generated (if it is in
      Lua; if it is engine-side, record that and summarize the public
      community knowledge, labeled as such).
   4. Spells and wands (`gun_actions.lua`, wand generation): the spell
      types, modifiers, triggers, multicast, wand stats and how composition
      evaluates. This is the model for composable techniques.
   5. Perks: especially world-rule rewrites (fungal shift), personal
      physics (immunities, blood material), and stacking rules.
   6. Polymorph, creature factions/herds (who fights whom and why), and
      how enemies use the same physics.
   7. Secrets and progression gates (orbs, tablets, hidden recipes) in
      brief.
4. **Map to our design.** Our design owners are
   `docs/emergent/E4_TAGS_AND_RULES.md`,
   `docs/emergent/E4B_MATERIALS_AND_NOITA.md` (Claude's from-memory Noita
   summary, codes N1-N11: confirm or correct each with evidence) and
   `docs/emergent/SHARED_VOCABULARY.md`. Read them first. Don't edit them;
   propose changes in your report.

## Output (in `docs/research/noita/`)

INTAKE, REPORT, FINDINGS, COVERAGE, IMPLEMENTATION_PACKETS, CHECKPOINT,
like other game passes:
- **REPORT.md** first: short plain language. Then a table confirming or
  correcting N1-N11 with file evidence, five to ten ranked proposals for
  the emergent-systems docs, and twenty or more small touches.
- **A material and reaction digest** suited to our tag system: Noita's
  material property fields and reaction shape mapped to our tag/rule shape,
  a count of reactions by kind, and 30 or so representative reactions
  paraphrased as our rule data.
- **A composition digest:** how wand/spell evaluation works, written as a
  model for composable techniques (slots, parts, modifiers, triggers).
- **Substitution note:** anything Noita does that bears on Weibao's
  request that materials with the same tags and characteristics serve as
  substitutes in recipes, and on power/quality axes.
- Plain English, short words, no em dashes. Mark adaptations as proposals.

Don't uninstall Noita: Weibao may want to play it. Record disk use in
CHECKPOINT.
