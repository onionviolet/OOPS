# Minecraft research downloads, 2026-10-14

> **Audit dispatch, 2026-10-14:** seven auditor lanes (decompile plus six system families) are reading this corpus. [Assignment](../gm/dispatch/minecraft-audit-2026-10-14/ASSIGNMENT.md) · [lanes](../gm/dispatch/minecraft-audit-2026-10-14/SESSIONS.md). Outputs land in `docs/research/minecraft/audits/`.

**D2: downloaded all 61 targets, 2,116,396,698 bytes (2.12 GB).** Each target has a real local artifact, a receipt with origin and SHA-256/SHA-512/SHA-1, and an archive member inventory. All archives passed CRC verification; 38 also matched published Modrinth hashes.

**D3: research corpus.** This collection contains selected release JARs, official pack exports, Blightfall’s official server archive and pinned source snapshots. Source snapshots use each repository’s default branch at the recorded commit and need not correspond to a released pack. They are usable for static research but are not launcher-ready exports. External manifest dependencies were not recursively fetched. Nothing was installed, built or launched. Full reading and YAIRPG adoption remain separate work.

**D4: identity choices.** Roguelike Dungeons and Totemic use their original linked source repositories instead of uncertain Modrinth matches. MineColonies, Antimatter Chemistry, Cuboid Outpost and MeatballCraft use verified official source links. Factory Tech uses its official CurseForge release; its Source link points to GitLab, correcting the earlier guessed GitHub route. Blightfall uses the server archive linked directly from its official Technic page. No unrelated inspired pack was used to replace an original target.

Local corpus: `docs/research/minecraft/private/bulk-2026-10-14/`. It is ignored by Git. Every target folder contains `receipt.json`, the artifact, and `archive-inventory.json`. Research-entry counts are filename heuristics, not proof of complete semantic coverage.

[Machine-readable receipt and hashes](MINECRAFT_DOWNLOAD_RECEIPTS_2026-10-14.json) · [Updated acquisition index](MINECRAFT_BULK_ACQUISITION_2026-10-14.json)

| Target | Artifact role | Bytes | SHA-256 (prefix) |
|---|---|---:|---|
| Silent Gear | release | 3,270,401 | `2e08d9822ccf78fa` |
| Tetra | release | 4,109,300 | `ed5f79f430277aff` |
| Tinkers Construct | release | 21,572,031 | `653b49d73481a132` |
| Create | release | 19,123,767 | `ef87fe5709f1ba1f` |
| Create Above and Beyond | pinned_source_archive | 3,005,581 | `35e13ce566cb58c6` |
| Enigmatica 6 | pinned_source_archive | 22,298,326 | `f2be3308e79c2c3b` |
| Apotheosis | release | 7,150,433 | `e350c6461741469b` |
| Vault Hunters | curseforge_release | 34,795,140 | `e3f8c18c66bad07f` |
| Roguelike Dungeons | pinned_source_archive | 477,724 | `9a3284795f0cd0ae` |
| Botania | release | 12,226,445 | `3cf540357c9cb5e4` |
| Hex Casting | release | 4,131,835 | `038ede2a5db9206d` |
| Ars Nouveau | release | 19,841,105 | `45c1b6022d8e6346` |
| Nomifactory | pinned_source_archive | 28,071,702 | `8d81c7c6403e486a` |
| GregTech New Horizons | pinned_source_archive | 166,134,375 | `fbd949bbbd03c91c` |
| Thaumcraft | curseforge_release | 11,360,786 | `9425f8643581b27f` |
| Blightfall | official_server_pack_archive | 340,675,823 | `cac19f658aded53e` |
| Spectrum | release | 99,606,323 | `5500211aed0a40ed` |
| Primal Magick | release | 9,408,493 | `f78cab2206b5c05c` |
| Malum | release | 33,585,331 | `38f4fa53e8da9e3d` |
| Occultism | release | 10,262,417 | `a993d0e786e72883` |
| Natures Aura | release | 1,553,371 | `5401704e76fb5971` |
| Roots Classic | pinned_source_archive | 579,025 | `f982a868b92033ab` |
| Psi | release | 2,553,645 | `25b2e19bb9433bf5` |
| Goety | release | 92,894,855 | `d8136cfb7ef70736` |
| Biomancy | release | 5,830,129 | `2ac4465fe05f4c57` |
| Crossroads | release | 5,758,368 | `5ba36b84e88d00ce` |
| PneumaticCraft Repressurized | release | 11,884,697 | `647ce20d52cf139f` |
| Embers Rekindled | release | 15,572,517 | `d119455e74a8976a` |
| TerraFirmaCraft | release | 47,433,654 | `8e493c970c6fb188` |
| Productive Bees | release | 5,212,932 | `4bc29d101f2cabdb` |
| Bountiful | release | 503,384 | `e1fc030ed37cd23f` |
| MineColonies | pinned_source_archive | 71,934,944 | `0f0243d887ad7a78` |
| Gateways to Eternity | release | 674,427 | `311b592b9c9d6679` |
| Lootr | release | 1,584,138 | `6669f8415aa4280e` |
| SevTech Ages | pinned_source_archive | 7,570,059 | `00813baa8dc2fcd3` |
| Floramancer | pinned_source_archive | 27,571,252 | `af6c2e42e02beada` |
| Ultimate Alchemy | curseforge_release | 5,427,702 | `e324db06834ca61c` |
| Antimatter Chemistry | pinned_source_archive | 25,185,984 | `695f8f4b318f63fa` |
| Cuboid Outpost | pinned_source_archive | 11,534,156 | `2ce7caa8e563d63e` |
| Divine Journey 2 | pinned_source_archive | 35,323,783 | `ade8eb35ae2b0249` |
| MeatballCraft | pinned_source_archive | 161,617,369 | `90260225a3cdab75` |
| Monifactory | pinned_source_archive | 58,419,202 | `6218f5365a065937` |
| FTB Interactions | pinned_source_archive | 259,615 | `f70b52c49b1409ba` |
| Modern Industrialization | release | 7,292,458 | `94e391b5a4432ec6` |
| Factory Tech | curseforge_release | 2,655,021 | `342f455532159fce` |
| Prodigy Tech | release | 792,768 | `eaf78c59294889b9` |
| Deep Resonance | release | 843,025 | `119075d1fb37a707` |
| Integrated Dynamics | release | 4,998,005 | `42e963f8875395a2` |
| Integrated Tunnels | release | 789,985 | `c8b5fe3d53d7ae91` |
| Alchemistry | pinned_source_archive | 4,479,569 | `463a2e3320020f4f` |
| ElementalCraft | release | 2,627,579 | `780e7c0e4304f243` |
| Totemic | pinned_source_archive | 1,356,507 | `57f1e95d1308a606` |
| Eidolon Repraised | release | 4,055,600 | `a2453d6f9d416081` |
| Mana and Artifice | release | 32,388,968 | `6bda8e55a9492ea1` |
| The Betweenlands | pinned_source_archive | 139,150,991 | `06d90230cc4063ee` |
| Dimensional Doors | release | 18,034,363 | `80caebb1152e0ae5` |
| Treasure2 | release | 3,586,156 | `37ff142be15c2879` |
| Modular Golems | release | 4,603,087 | `5b0ebe47674f65af` |
| Hexerei | release | 10,428,010 | `743e80cb0526fa5f` |
| Cabricality | release | 6,903,439 | `ed0d00fe8c1b7bfb` |
| Prominence™ II: Hasturian Era | release | 423,424,621 | `9a6def75904d3461` |

Official acquisition evidence for resolved fallbacks: [Vault Hunters file](https://www.curseforge.com/minecraft/modpacks/vault-hunters-1-18-2/files/8527845), [Thaumcraft file](https://www.curseforge.com/minecraft/mc-mods/thaumcraft/files/2629023), [Ultimate Alchemy file](https://www.curseforge.com/minecraft/modpacks/ultimate-alchemy/files/2653867), [Factory Tech file](https://www.curseforge.com/minecraft/mc-mods/factory-tech/files/3845293), [Blightfall official page](https://www.technicpack.net/modpack/blightfall.592618). Other origins and pinned commits are recorded per artifact.

Checks: 61 target-to-receipt matches, on-disk lengths, published hashes where supplied, ZIP CRC checks at download, local hash records, and Git-ignore confirmation. No runtime/gameplay verification is claimed.
