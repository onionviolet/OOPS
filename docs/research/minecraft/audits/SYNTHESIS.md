# Minecraft corpus audit: cross-lane synthesis (2026-10-14)

Seven lanes read the [61-target corpus](../../MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md)
by data, public source at matching tags, and local Vineflower decompiles.
Nothing was run or played. Everything below is a reference palette, not a spec
or an accepted decision: each idea needs a fitting world, actor and moment.
[Assignment](../../../gm/dispatch/minecraft-audit-2026-10-14/ASSIGNMENT.md).

| Lane | Audit | Scope |
|---|---|---|
| DC | [DC_SOURCE_IDENTITY](DC_SOURCE_IDENTITY.md) | License and source route ledger; 38 JARs decompiled |
| GL | [GL_GEAR_LOOT](GL_GEAR_LOOT.md) | Part tools, affixes, golems, keyed and per-player loot, bounties, wave trials |
| TA | [TA_TECH_AUTOMATION](TA_TECH_AUTOMATION.md) | Power models, upkeep, logic networks, chemistry |
| EP | [EP_PACK_PROGRESSION](EP_PACK_PROGRESSION.md) | Quest graph shapes, stage gating, script rewrites |
| MR | [MR_MAGIC_RESEARCH](MR_MAGIC_RESEARCH.md) | Research currencies, hidden knowledge, mana economies, warp |
| SR | [SR_SPELLS_RITUALS](SR_SPELLS_RITUALS.md) | Spell grammars, rituals, spirits and servants |
| WC | [WC_WORLDS_COLONIES](WC_WORLDS_COLONIES.md) | Survival realism, colonies, roguelite runs, local world rules |

## Patterns found in several lanes

Convergence across unrelated mods is the strongest signal in this pass.

- **X1. Unlock by doing, not by points.** Spectrum and Botania gate knowledge on
  advancements (MR4), Hex on failing then nearly dying (SR1), Psi on first
  execution (SR5), Crossroads and Embers on discovery (TA SP5), SevTech and E6
  on actions that fire stages (EP5, EP6). Receiving owners: `src/skill_discovery.js`,
  `src/world_knowledge.js`, `src/native_unlock_transaction.js`.
- **X2. Informative-failure puzzles, seeded per world.** Embers alchemy (TA1)
  and CAB Chaotic Alchemy (EP3) independently use a hidden per-world code where a
  failed attempt yields an object recording right-and-placed versus
  right-but-misplaced. Hex great-spell patterns are also per-world (SR2).
  Fits `src/mixture_rules.js` and sealed-secret discovery routes.
- **X3. Show the bottleneck by name.** Create boilers print each cap (TA3),
  Psi shows five compile stats before casting (SR5), Totemic shows a music bar
  (SR15), Integrated Dynamics stores the failing message on the part (TA7),
  MineColonies raises tool-level alerts (WC12). Fits `src/action_legibility.js`.
- **X4. Small typed budgets cap growth.** Tetra integrity, Tinkers slots, golem
  upgrade slots (GL46), Psi CAD caps (SR5), Prominence talent cap and exclusive
  roots (WC34), Ars tier caps. Growth comes from filling budget, not a global
  level.
- **X5. Workers with rank, custody and fallbacks.** Occultism job spirits scale
  speed and output by rank and get an assigned area, deposit and owner (SR8-SR10);
  MineColonies resolves missing inputs through a fixed chain ending with the
  player (WC12); humanoid golems wear their real gear (GL58). Fits
  `src/npc_lives.js` and the work ledger.
- **X6. Worlds assert local law on imported things.** Betweenlands slows and
  rots outside gear with toggles and whitelists (WC29), Blightfall bans the
  Nether and tunes research (WC26, MR), Vault Hunters blacklists items. Fits
  `docs/worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md` and per-world adjectives.
- **X7. Commitments are recoverable at a price.** Salvage and strip mechanics
  (GL49), Treasure2 wishing well, Dimensional Doors pocket regeneration (WC32),
  Gateways keeping already-dropped wave rewards (GL54).
- **X8. Wear and debt as compounding risk.** Factory Tech part break chance
  grows past a lifetime with spares auto-installing (TA2); Thaumcraft warp is
  three debt buckets rolled against total (MR8); Nature's Aura deficit escalates
  to explosions (MR7); Vault Hunters crystals gain instability as modified (WC20).
- **X9. Quest book as market and as graph.** Coin shops in CAB, Nomi and Moni
  (EP2, EP8), Bountiful worth-balanced tasks scaled by reputation (GL53);
  graph shape ranges from wide and shallow (E6) to braided with hub quests
  (Moni) (EP15).

## Gaps that limit this pass

- **G1.** Vault Hunters and Ultimate Alchemy are manifest-only; the core
  `the_vault` mod is not on disk. Fetching it is new acquisition and needs
  Weibao's yes.
- **G2.** Embedded JARs in Cabricality (11), Prominence II (37) and Blightfall
  are not decompiled; Blightfall's binary quest file is only partly decoded.
- **G3.** Unread code is listed per lane (Silent Gear grader, Apotheosis affix
  rolls, Tetra honing, Primal Magick attunement, Thaumcraft flux, Botania
  spreader rates, Create trains, PneumaticCraft drones, Goety spell mapping,
  TFC climate, MineColonies builder and guard).
- **G4.** GTNH and Cabricality recipe logic lives in mod code outside their
  archives.
- **G5.** Several sources are branch heads whose version string matches, not
  tags (Spectrum, Eidolon, Crossroads, Embers); Malum's public branch is newer
  than the jar.

Private deep tables: `docs/research/minecraft/private/audits/<lane>/`;
decompiles: `private/decomp/` (index `INDEX.json`). Both gitignored.
