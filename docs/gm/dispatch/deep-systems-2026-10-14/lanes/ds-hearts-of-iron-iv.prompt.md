You are lane `ds-hearts-of-iron-iv` in the YAIRPG deep systems sweep of 2026-10-14.
Repo: /Users/weiwei/code/yet-another-idle-rpg (main checkout, read-only for you except your output dir).
Read first: docs/gm/dispatch/game-research-wave-2026-10-14/COMMON.md (hard rules, output shape) and docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md. They govern this prompt.
Output dir (the only repo path you may write): `docs/research/hearts-of-iron-iv/pass-2026-10-14-systems/`
Work area: `~/.codex/research/ds-hearts-of-iron-iv/` (read earlier work areas read-only).
Weibao, 2026-10-14: "send deeper dives into deeper games and save accordingly?"

## Source
Hearts of Iron IV (Steam 394360, Clausewitz script, installed). Reuse hoi4 and asp-hoi4 work areas.
Prior outputs (read all first, don't redo): every folder under `docs/research/hearts-of-iron-iv/` (REPORT, CHECKPOINT unread tables, `aspects-2026-10-14/SYSTEM_INVENTORY.md` and `DEEPER_SYSTEMS.md`, and any `pass-2026-10-14*` folder). Never run the game or a Windows executable.

## Task: sweep the undocumented systems
1. From SYSTEM_INVENTORY and every prior unread table, list each system still undocumented or only named. Group them into families (for example economy, social, body, knowledge, combat, world simulation, events, UI, content authoring, save).
2. Go deep on the top 12 to 15 systems by payoff for YAIRPG (life sim, many worlds, bodies and lineage, knowledge and technology, production chains, companions, events and dialogue). For each: data model (tables, fields, classes), the rules in exact terms (formulas, conditions, timers), how it connects to other systems, how it is authored, and how it saves. Cite files, tables or functions; label shown / stated / inferred.
3. Close any prior unread row you can reach cheaply; keep a fresh unread table for the rest.
4. Map each system to YAIRPG owners (world core kit K codes, synthesis packets P01-P25 in `docs/research/cross-game-synthesis-2026-10-14/PACKETS.md`, topic palettes) and mark the ones no YAIRPG owner covers yet.

Write in your output dir: REPORT.md (plain summary, ranked proposals, corrections to prior passes first), SYSTEMS.md (one section per deep system), FAMILY_MAP.json (every inventoried system with family, status and owner mapping), SMALL_TOUCHES.md, TOOLING.md, CHECKPOINT.md (COMPLETE or PARTIAL with unread table). End with a short final message.
