You are lane `taiwu-2` in the YAIRPG game research wave of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape, done check). It governs this prompt.
Output dir (the only repo path you may write): `docs/research/scroll-of-taiwu/pass-2026-10-14-deep/`
Work area: `~/.codex/research/taiwu-2/`

## Source
The Scroll of Taiwu, Steam 838350, installed. The game logic runs in a managed .NET backend: `Backend/GameData.exe` plus `GameData.*.dll` (ActionPlanning, Adventure and more), with Unity frontend assemblies. Prior lane: `docs/research/scroll-of-taiwu/` (PARTIAL). Read the prior lane's REPORT, CHECKPOINT (its unread table is your task list), TOOLING and FINDINGS first. Reuse its private work area (named in its CHECKPOINT) read-only; don't redo finished reads. Write only your new output dir.

Route: `ilspycmd` on the Backend assemblies (and `CompDevLib.Interpreter.dll` if adventure/event scripts are interpreted), plus the config tables the prior lane mapped. Use REA only if a question lands in native code.

## Questions
1. Close the prior unread table: exact dialogue and event gates, the full inheritance transfer handlers, and the rows it lists.
2. NPC autonomy: the ActionPlanning system (how NPCs choose actions, goals, utility or planner), relationships, marriage, sect politics and aging, in code terms.
3. Adventures: the Adventure module and its script grammar; how adventures are authored, triggered and resolved.
4. Martial art study: reading, comprehension, mastery, internal force, and damaged or incomplete manuals.
5. Compare with Tale of Immortal (`docs/research/tale-of-immortal/pass-2026-10-14/`) and Immortal Life.
