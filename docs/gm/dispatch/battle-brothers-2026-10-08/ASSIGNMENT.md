# Battle Brothers: extract and audit for followers, factions and a harsh world

Queued 2026-10-08 by Claude Code at Weibao's request ("queue battle brothers
after"): start only after the Tale of Immortal lane
(`docs/gm/dispatch/tale-of-immortal-2026-10-08/`) has reported. Personal-use
reconstruction is authorized (vault `Game_Idea_Bank.md`, 2026-10-05).

Follow the method in
[tale-of-immortal-2026-10-08](../tale-of-immortal-2026-10-08/ASSIGNMENT.md):
read-only on the install, never launch the game or touch saves, **no
uninstall**, copy only what the audit needs to
`~/.codex/research/battle-brothers/` with hashes, no `src/` edits, builds
or commits.

## The install (checked 2026-10-08)

Steam app 365360, `~/Library/Application Support/Steam/steamapps/common/Battle Brothers`,
about 1.6 GB. The game's logic is largely Squirrel script (often in `.cnut`
compiled form inside `.dat` archives); community tools exist to unpack and
decompile them. Record which tool and version you used.

## Audit lens

Use [LIFE_SIM_NORTH_STAR.md](../../../LIFE_SIM_NORTH_STAR.md), especially
"Followers and factions", "Work", "Enemy powers" and "Ancient monsters".

1. **Followers as people:** backgrounds, traits, recruitment, wages, mood
   and loyalty, desertion, injuries that stay, aging out, death, and how the
   game makes you care.
2. **The company as a faction:** reputation, renown, contracts, money,
   supplies, retinue, how a company grows and fails.
3. **World factions:** noble houses, cities, their relations, and how the
   player's standing changes.
4. **Late-game crises:** world-scale invasions or ancient threats and how
   they are scheduled and paced.
5. **Events:** camp and travel events, their triggers and text style.
6. **Harsh-world design:** permadeath, ironman, difficulty settings, and
   what makes loss feel fair.
7. **Twenty or more small touches,** each mapped to vanilla YAIR.

## Output

Under `docs/research/battle-brothers/`: a short plain-language REPORT first,
findings, coverage, five to ten ranked proposals for the north star
(proposals are not decisions), and a CHECKPOINT.
