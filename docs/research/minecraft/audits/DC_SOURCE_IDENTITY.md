# DC: Source identity and decompile ledger (Minecraft corpus, 2026-10-14)

Lane DC of the Minecraft corpus audit. Read-only: JARs were decompiled with Vineflower and never run. Claims are shown (read from jar metadata, git remote listings) unless marked inferred. No code or prose is copied here.

## Tools

- OpenJDK 27 (Homebrew keg, run by full path, not linked system-wide), Vineflower 1.12.0. CFR was not needed.
- Command shape: `java -jar vineflower.jar -dgs=1 -log=WARN <jar> <out>`. Logs sit beside each output as `decompile.log`.
- No `gh` CLI exists here. Tag checks used `git ls-remote --tags` on public GitHub repos (no API quota). A "tag match" means a tag name equals the jar version. It does not prove the tag builds byte-identical code (inferred equivalence).

## Counts

- 40 `release`/`curseforge_release` targets: 38 JARs and 2 CurseForge pack zips (vault-hunters, ultimate-alchemy).
- Source class: 25 open (OSS license plus public repo), 9 source-available (public repo but custom or all-rights-reserved license, so reference reading only), 6 closed or no usable public source (thaumcraft, vault-hunters pack, ultimate-alchemy pack, mana-and-artifice (repo exists, contents unchecked), modular-golems, hexerei).
- Tag name matches the jar version: 17 of 38 JARs.
- Decompiled: all 38 JARs (not only unconfirmed ones; it cost minutes). 0 classes failed. Warnings are Kotlin metadata notes (hex-casting, bountiful), duplicate lambda notes and similar.
- Not decompiled: vault-hunters and ultimate-alchemy (zips contain no JARs), cabricality and prominence-ii (`.mrpack`, pack archives, not single mods; they hold 11 and 37 embedded mod JARs under `overrides/mods`, plus 51 and 563 indexed remote files). Embedded pack JARs were not decompiled; ask if wanted.

## Pack findings

- vault-hunters 3.21.7: CurseForge manifest (MC 1.18.2, Forge 40.3.11, 168 mod references). Overrides hold configs, including the whole `config/the_vault` tree (gen templates, loot tables, themes). The core `the_vault` mod JAR is NOT embedded, so there is no code to decompile. Data and config are the readable source for Vault systems. Fetching the JAR from CurseForge would need a separate OK.
- ultimate-alchemy 0.1.0: CurseForge manifest (MC 1.12.2, Forge 14.23.5.2796, 73 references), overrides are configs and resource textures only. No code.

## Ledger

| Target | Mod id | Version | Loader / MC | License | Class | Source route | Tag match |
|---|---|---|---|---|---|---|---|
| thaumcraft | thaumcraft | 6.1.BETA26 (1.12.2-6.1.BETA26) | forge / 1.12.2 | not stated in jar (author Azanor; all rights reserved by practice) | closed | none | no |
| factory-tech | factorytech | 1.7.2 file (mcmod.info says 1.7.1) | forge / 1.12.2 | none in jar | source-available | https://github.com/dalapo/FactoryTech | no |
| vault-hunters | the_vault (external) | 3.21.7 pack | forge 40.3.11 / 1.18.2 | pack; core mod jar not embedded | closed | none | no |
| ultimate-alchemy | (pack) | 0.1.0 pack | forge 14.23.5.2796 / 1.12.2 | pack | closed | none | no |
| eidolon-repraised | eidolon_repraised | 0.5.0.6 | neoforge / 1.21.1 | All rights reserved | source-available | https://github.com/Alexthw46/Eidolon-Repraised | no |
| malum | malum | 1.8.2 | neoforge / 1.21.1 | All Rights Reserved | source-available | https://github.com/SammySemicolon/Malum-Mod | no |
| mana-and-artifice | mna | 3.1.11 | forge / 1.20.1 | All rights reserved | closed | https://github.com/Mithion/Mana-And-Artifice | no |
| modular-golems | modulargolems | 2.7.4 | forge / 1.20.1 | All rights reserved | closed | none | no |
| productive-bees | productivebees | 1.21.1-13.13.0 | neoforge / 1.21.0 | All Rights Reserved | source-available | https://github.com/JDKDigital/productive-bees | no |
| tetra | tetra | 6.17.0 | forge / 1.20.1 | ARR | source-available | https://github.com/mickelus/tetra | no |
| prodigy-tech | prodigytech | 1.12.2-1.3.4 | forge / 1.12.2 | not stated in jar | source-available | https://github.com/Lykrast/ProdigyTech | 1.3.4 |
| botania | botania | 456 | forge / 1.20.1 | Botania License (custom, source public) | source-available | https://github.com/VazkiiMods/Botania | release-1.20.1-456 |
| psi | psi | 1.21.1-110 | neoforge / 1.21.1 | Psi License (custom, source public) | source-available | https://github.com/VazkiiMods/Psi | release-1.21.1-110 |
| apotheosis | apotheosis | 9.1.0 | neoforge / 26.1.2 | MIT (code) / ARR (assets) | open | https://github.com/Shadows-of-Fire/Apotheosis | no |
| ars-nouveau | ars_nouveau | 5.13.3 | neoforge / 1.21.1 | GPL | open | https://github.com/baileyholl/Ars-Nouveau | no |
| biomancy | biomancy | 2.9.0.1-alpha.0 | forge / 1.20.1 | MIT & CC-BY-NC-4.0 | open | https://github.com/Elenterius/Biomancy | 1.20.1-v2.9.0.1-alpha.0 |
| bountiful | bountiful | 6.0.4+1.20.1 | fabric / 1.20.1 | GPL 3.0 | open | https://github.com/ejektaflex/Bountiful-Fabric | no |
| create | create | 6.0.10 | neoforge / 1.21.1 | custom LICENSE.md (source public) | source-available | https://github.com/Creators-of-Create/Create | mc1.21.1-6.0.10 |
| crossroads | crossroads | 1.21.1-2.12.0 | neoforge / 1.21.1 | MIT | open | https://github.com/Da-Technomancer/Crossroads | 1.21.1-2.12.0 |
| deep-resonance | deepresonance | 6.0.2 | neoforge / 1.21 | MIT | open | https://github.com/McJtyMods/DeepResonance | no |
| dimensional-doors | dimdoors | 5.4.4 | fabric / 1.20.1 | MIT | open | https://github.com/DimensionalDevelopment/DimDoors | no |
| elementalcraft | elementalcraft | 5.8.5 | forge / 1.19.2 | LGPL 2.1 | open | https://github.com/Sirttas/ElementalCraft | 5.8.5 |
| embers-rekindled | embers | 1.20.1-1.4.7 | forge / 1.20.1 | MIT | open | https://github.com/RCXcrafter/EmbersRekindled | no |
| gateways-to-eternity | gateways | 6.0.2 | neoforge / 26.1.2 | MIT | open | https://github.com/Shadows-of-Fire/GatewaysToEternity | no |
| goety | goety | 2.5.59.2 | forge / 1.20.1 | MIT | open | https://github.com/Polarice3/Goety-2 | no |
| hex-casting | hexcasting | 0.11.4 | forge / 1.20.1 | MIT | open | https://github.com/gamma-delta/HexMod | v0.11.4 |
| hexerei | hexerei | 0.5.0.3 | neoforge / 1.21.1 | MIT in toml; Modrinth page says LGPL-3.0 | closed | none | no |
| integrated-dynamics | integrateddynamics | 1.36.1 | neoforge / 26.1.2 | MIT | open | https://github.com/CyclopsMC/IntegratedDynamics | 26.1.2-1.36.1 |
| integrated-tunnels | integratedtunnels | 1.13.1 | neoforge / 26.1.2 | MIT | open | https://github.com/CyclopsMC/IntegratedTunnels | 26.1.2-1.13.1 |
| lootr | lootr | 1.24.41.124 | fabric / 26.2 | MIT | open | https://github.com/noobanidus/Lootr | no |
| modern-industrialization | modern_industrialization | 2.5.10 | neoforge / 1.21.1 | MIT | open | https://github.com/AztechMC/Modern-Industrialization | 2.5.10 |
| natures-aura | naturesaura | 41.10 | neoforge / 1.21.1 | MIT | open | https://github.com/Ellpeck/NaturesAura | 41.10 |
| occultism | occultism | 1.259.1 | neoforge / 26.3 | MIT | open | https://github.com/klikli-dev/occultism | release/v26.3-1.259.1 |
| pneumaticcraft-repressurized | pneumaticcraft | 8.2.23 | neoforge / 1.21.1 | GPLv3 | open | https://github.com/TeamPneumatic/pnc-repressurized | v8.2.23 |
| primal-magick | primalmagick | 6.0.7 | neoforge / 1.21.1 | MIT | open | https://github.com/daedalus4096/PrimalMagick | 6.0.7 |
| silent-gear | silentgear | 4.2.3 | neoforge / 26.1.2 | MIT | open | https://github.com/SilentChaos512/Silent-Gear | no |
| spectrum | spectrum | 1.12.9-1.21.1-neo | neoforge / 1.21.1 | LGPL3 | open | https://github.com/DaFuqs/Spectrum | no |
| terrafirmacraft | tfc | 3.2.27 | forge / 1.20.1 | EUPL-1.2 | open | https://github.com/TerraFirmaCraft/TerraFirmaCraft | v3.2.27 |
| tinkers-construct | tconstruct | 3.11.2.166 | forge / 1.20.1 | MIT | open | https://github.com/SlimeKnights/TinkersConstruct | v3.11.2.166 |
| treasure2 | treasure2 | 4.0.6 | forge / 1.20.1 | OSL-3.0 | open | https://github.com/gottsch/gottsch-minecraft-neoforge-Treasure | no |

Notes per target (only where something needs saying) are in `docs/research/minecraft/private/decomp/INDEX.json` (`note` field).

## Which route other lanes should read

- Decompile only (no public source): thaumcraft (903 files), factory-tech (376; a GitHub repo `dalapo/FactoryTech` exists but has no tags and an unchecked license, so prefer the decompile for exact 1.7.2 behavior), mana-and-artifice (1871), modular-golems (831), hexerei. Vault Hunters and Ultimate Alchemy: read config and data overrides, there is no code.
- Public repo exists but ARR or custom license (reference reading allowed, no reuse): eidolon-repraised, malum, productive-bees, tetra, prodigy-tech, botania, psi, create. For eidolon, malum, productive-bees and tetra there is no tag for this version, so the decompile is the exact-version authority.
- Tag-matched open source (read the public tag, decompile as cross-check): biomancy, botania, create, crossroads, elementalcraft, hex-casting, integrated-dynamics, integrated-tunnels, modern-industrialization, natures-aura, occultism, pneumaticcraft-repressurized, primal-magick, prodigy-tech, psi, terrafirmacraft, tinkers-construct.
- Open source but version unmatched (use the decompile for the exact jar): apotheosis, ars-nouveau, bountiful, deep-resonance, dimensional-doors, embers-rekindled, gateways-to-eternity, goety, lootr (fabric jar vs NeoForge tags), silent-gear, spectrum, treasure2.

## Paths

Decompiled sources: `docs/research/minecraft/private/decomp/<target>/src/` (gitignored), logs at `.../<target>/decompile.log`, machine index at `docs/research/minecraft/private/decomp/INDEX.json`.

## Gaps and cautions

- G1: Hexerei license is inconsistent (toml says MIT, Modrinth listing says LGPL-3.0) and no repo was found. Treat as closed.
- G2: mana-and-artifice repo `Mithion/Mana-And-Artifice` exists with master and 1.20 branches but the jar is licensed all rights reserved; contents not inspected.
- G3: Source-available means readable, not reusable. Gameplay stays original.
- G4: embers-rekindled repo URL came from a web search hit plus a working `git ls-remote`, not the jar metadata.
- G5: Apotheosis, Gateways, Silent Gear, Integrated mods target MC "26.1.x" per their own metadata. That is what the files say; not verified against Mojang versioning.
