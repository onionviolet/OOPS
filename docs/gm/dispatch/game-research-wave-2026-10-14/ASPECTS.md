# Aspect pass standard, 2026-10-14

Weibao, 2026-10-14: "save aspects like dialogue, impletation and more? deeper
systems and other stiff?" Every game in this wave gets an aspect pass on top
of its mechanic dossier. COMMON.md rules still apply.

## Output (per game)

Under the game's dossier: `docs/research/<game>/aspects-2026-10-14/`

- **ASPECTS.md**: one section per aspect below. Each says what the game does,
  how it is implemented (files, tables, classes, script formats), what is
  shown / stated / inferred, and one or two YAIRPG takeaways with the owner
  system they touch. Write "not present" or "unread, because ..." rather
  than skipping a row.
- **ASPECTS.json**: fixed keys `A01`..`A12`, each
  `{status: covered|partial|unread|absent, sources: [...], summary, yairpg: [...]}`,
  so the cross-game synthesis can roll them up.
- **SYSTEM_INVENTORY.md**: every distinct system or subsystem found in the
  build (name, where it lives, size signal such as table rows or class
  count, whether any lane documented it). Mark the undocumented ones and dig
  into the top three by payoff in a short `DEEPER_SYSTEMS.md`.
- Update nothing outside that folder. Reuse prior private work areas
  read-only.

## Aspects

| Code | Aspect | Look for |
| --- | --- | --- |
| A01 | Dialogue and conversation | Dialogue trees or graphs, barks, NPC small talk, conditions and flags on lines, speaker and portrait data, relationship-gated lines, generated text, how dialogue changes state |
| A02 | Narrative delivery | Event text, quest journals, logs, letters, codex entries, how story beats are scheduled and recalled, branching and closure |
| A03 | Implementation architecture | Engine, module layout, data-driven versus code-driven content, script languages or interpreters, main loop and tick, event bus or signals, performance tricks |
| A04 | Save and persistence | Format, versioning and migration, what is saved versus derived, autosave, offline time, corruption and rejection handling |
| A05 | AI and NPC behavior | Planners, utility weights, schedules, autonomous lives, factions, how AI reads the same rules as the player |
| A06 | UI and information design | Screens, tooltips, notifications, logs, number formatting, how many systems share one desktop screen, keyboard use |
| A07 | Content authoring and modding | How designers add content (tables, editors, scripts), mod API and load order, validation |
| A08 | Balance and numbers | Curves, formulas, RNG and seeding, pity or bad-luck protection, big-number handling |
| A09 | Time and scheduling | Calendar, ticks, queues, cooldowns, offline catch-up, aging |
| A10 | Onboarding and reveal | Unlock order, tutorials, staged UI, how complexity is introduced |
| A11 | Little touches | Juice, feedback, flavor, accessibility, quality-of-life details |
| A12 | Other systems | Anything the rows above miss (economy sinks, achievements, collections, minigames, meta progression) |

## Text rules

Dialogue and story text is someone's writing. Record structure, counts,
conditions and short paraphrase. Quote at most a few words to name a line.
No raw dialogue or prose dumps in the repo. Sealed-secret rule applies to
anything YAIRPG designs from it.

## Done check

ASPECTS.md, ASPECTS.json (all twelve keys), SYSTEM_INVENTORY.md and
DEEPER_SYSTEMS.md exist per assigned game, and the lane CHECKPOINT (in the
first game's aspects folder for grouped lanes) says COMPLETE or PARTIAL with
an unread table.
