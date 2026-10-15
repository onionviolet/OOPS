# Minecraft corpus audit: cross-lane synthesis (2026-10-14)

Seven lanes read the [61-target corpus](../../MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md)
by data, public source at matching tags, and local Vineflower decompiles.
Nothing was run or played. Everything below is a reference palette, not a spec
or an accepted decision: each idea needs a fitting world, actor and moment.
[Assignment](../../../gm/dispatch/minecraft-audit-2026-10-14/ASSIGNMENT.md).

| Lane | Audit | Scope |
|---|---|---|
| DC | [DC_SOURCE_IDENTITY](DC_SOURCE_IDENTITY.md) | License and source route ledger; 38 JARs decompiled, plus 146 embedded JARs in pass 2 |
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

## Pass 2 code read (2026-10-14)

A second pass decompiled the embedded JARs and read the code each lane had
listed as unread. Lane audits were updated in place; claims below are shown in
code unless marked.

- **X10. The outcome is fixed before the player sees the roll.** Apotheosis
  reforge options are seeded per player and change only after one is taken, so
  reopening the table does not reroll (GL63); Prominence lootboxes pick the
  prize before the spin animation (WC50). Silent Gear grades only go up and a
  failed attempt still eats the catalyst (GL60); bee breeding can never make
  temper worse (WC64). Fits fair-randomness rules in `src/` loot and crafting
  owners.
- **X11. One local capacity shared by good and bad residue.** Thaumcraft 6 flux
  and vis compete for the same chunk cap and rifts open above 75 percent of it
  (MR14, MR15); Blightfall cleans one chunk at a time and its taint spread runs
  about 200 times the default rate (WC38 to WC41); Nature's Aura deficit (MR7).
  Extends X8.
- **X12. Affinity from several buckets on one ladder.** Primal Magick
  attunement adds permanent, induced and temporary buckets against thresholds
  of 30, 60 and 90, unlocking passive perks only (MR10 to MR12). Pairs with X4.
- **Corrections to pass 1.** Primal Magick attunement is a real mechanic
  (MR10); Thaumcraft 6 taint spreads from live seeds, not as a biome (MR16);
  Tetra settling restores integrity rather than costing durability (GL62);
  Treasure2 lock stripping costs the well plus an explosion, not coins (GL35,
  GL66); Occultism idle workers pause seconds, not minutes (SR9, SR21); Malum
  stone ward reads as an 80 percent cut, not 20 (SR20; one uncertain reading,
  SRG13).
- **Blightfall campaign decoded.** The HQM file parsed fully: 420 quests and
  513 prerequisites in ten NPC trees joined through the Scout, with a
  spendable supply budget and reputation that pushes curing over killing (WC44
  to WC46). Table in `private/audits/wc/blightfall_hqm_decoded.tsv`.

## Gaps that limit this pass

- **G1.** Vault Hunters and Ultimate Alchemy are manifest-only; the core
  `the_vault` mod is not on disk. Fetching it is new acquisition and needs
  Weibao's yes.
- **G2. Closed in pass 2.** All 141 embedded JARs were decompiled (Blightfall
  93, Cabricality 11, Prominence II 37), plus 5 nested ones (four inside
  Prominent-GLOBAL, RebornCore inside TechReborn). Three hold no classes (a
  native library and two datapack jars); one is Kotlin. The other 28 nested
  jars are libraries and stay packed. The Forge server jar in Blightfall was
  skipped as loader code. Blightfall's quest file is fully decoded (WC44).
- **G3. Closed in pass 2 for every listed item.** Each lane read its code and
  rewrote its own Gaps list: GL59 to GL66, MR10 to MR20, TA12 to TA21, SR18 to
  SR25, WC38 to WC65, EP16 to EP19. Still unread, by reason:
  - Missing from the corpus: the Placebo library behind Apotheosis value
    curves and XP charge (GL59, GL63 keep those inferred); Puffish Skills and
    Eldritch End for Prominence (not embedded); Embers 1.4.7 has no steam
    engine code at all.
  - Scope or time, readable later: Primal Magick shards, Thaumcraft warp
    events past tier 32, Create train physics, single drone actions, MI
    nuclear and fusion, Goety altar rituals and lich form, TFC husbandry and
    crops, MineColonies ranged and druid guards, Prominence mythic challenges
    and weekly quests.
  - Needs play or a source build (ruled out): Malum stone ward and the
    Biomancy decomposer cache (SRG13), Botania lossless burst reach (inferred
    from tick counts).
- **G4.** GTNH and Cabricality recipe logic lives in mod code outside their
  archives. Pass 2 confirmed it for Cabricality: the pack's own mod is a
  Modrinth download listed in the index, not one of its 11 embedded JARs
  (EP16).
- **G5.** Several sources are branch heads whose version string matches, not
  tags (Spectrum, Eidolon, Crossroads, Embers); Malum's public branch is newer
  than the jar.

Private deep tables: `docs/research/minecraft/private/audits/<lane>/`;
decompiles: `private/decomp/` (index `INDEX.json`). Both gitignored.
