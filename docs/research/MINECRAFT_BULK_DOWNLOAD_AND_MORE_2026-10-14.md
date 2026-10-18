> **Execution update, 2026-10-14:** All 61 research targets are now downloaded and archive-verified. [Completion report](MINECRAFT_DOWNLOAD_COMPLETION_2026-10-14.md) and [receipts](MINECRAFT_DOWNLOAD_RECEIPTS_2026-10-14.json) supersede the acquisition-state statements below. The earlier scout text records the pre-download state.

# Minecraft research: more donors and fast bulk acquisition

October 14, 2026. Applies the explicitly requested [more-to-consider skill](/Users/weiwei/Documents/Dev/agent-skills/skills/more-to-consider/SKILL.md), especially content pipelines, identity, versioning, failed acquisition and research-versus-runtime evidence. This adds 18 donor candidates and prepares a **61-target acquisition index** spanning the preceding catalog and the additions below. It is not an exhaustive census of every title mentioned anywhere in a research brief.

**F9: use a research corpus for breadth, and separate compatible packs for play.** Modrinth is a useful bulk route, but no single modpack was established to contain all targets. The references span incompatible Minecraft versions/loaders and different editions. For static study, pinned source files, actual quest/script overrides and selected JAR resources can coexist in a corpus without loading any of them into Minecraft.

**F10: `.mrpack` is a ZIP-based manifest plus optional overrides, not necessarily all its mods.** The official format lists download URLs, hashes, sizes, environments and dependencies; overrides supply pack-authored files. Fetching the archive can yield usable research files before fetching its external dependencies. [Official format](https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack).

**F11: the practical route is hybrid.** A bounded Modrinth search of 59 original/additional targets returned 38 exact title matches, all individual mods in this result, and 21 unresolved/nonexact cases. Exact title does not verify the original publisher, selected edition or compatibility. Top-five search nonmatches are not proof that a project is absent from Modrinth. Many results were addons, translations or distinct inspired packs, and were not substituted. The 21 cases retain official source/project fallback links. Two specifically inspected packs, Cabricality and Prominence II, bring the index to 61. [Acquisition index](MINECRAFT_BULK_ACQUISITION_2026-10-14.json).

## Fast acquisition choices

| Code | Goal | Fastest useful route | Boundary |
|---|---|---|---|
| O1 | Read authored mechanics across all targets | Use the acquisition index: pinned GitHub source/data where available, official pack exports for overrides, Modrinth artifacts for selected packaged resources | Download availability, full source access and completed semantic reading differ |
| O2 | Obtain one pack's exact mod set | Import that official `.mrpack` into Modrinth App or another compatible launcher, letting it resolve the manifest | A chosen pack's versions, not a universal collection; manual dependencies may remain |
| O3 | Reproduce and maintain a chosen compatible pack | Use [packwiz](https://packwiz.infra.link/) for declared files and versions, or the pack's existing manifest | A pack-authoring tool, not an automatic compatibility solver or an answer to historical source coverage |
| O4 | Deploy a selected Modrinth server pack | [mrpack-install](https://github.com/nothub/mrpack-install) is an existing server deployment tool | Not the preferred read-only research route; downloading/installing server runtime is a different task |

For our current goal, **O1 is the recommendation**. It avoids treating Minecraft installation as necessary to read quest graphs. A pack's recipes may live in scripts, generated data or a custom core mod, so a quest folder alone does not close the mechanic question.

## Concrete `.mrpack` proof

**V6:** downloaded [Cabricality](https://modrinth.com/modpack/cabricality) version `0.3.1-patch1` from its Modrinth-listed CDN artifact. It is an Above and Beyond-inspired Quilt 1.18.2 pack, not the original Above and Beyond. The 6,903,439-byte archive passed its published SHA-512 check. Reading its ZIP index found 53 members, including **16 quest-data entries**, and 51 external file entries totaling **121,025,151 bytes**. Its path patterns found no standalone KubeJS/ZenScript or Patchouli JSON files; that is not proof it lacks custom behavior, which may live in referenced JARs or other files. Nothing was extracted into a Minecraft instance, installed or run.

[Proof receipt](MINECRAFT_MRPACK_PROOF_2026-10-14.json) includes hash, URL and file-list examples. The archive is local-only at `docs/research/minecraft/private/modrinth/Cabricality-0.3.1-patch1.mrpack`. Its author page additionally asks players to install FTB Library, FTB Quests, FTB Teams and Quest Additions manually. Therefore the manifest should not be described as a verified complete playable installation. The quest files are still directly readable. [Author page](https://modrinth.com/modpack/cabricality).

Prominence II's selected `4.1.3` `.mrpack` is listed at 423,424,621 bytes before external dependencies. Only metadata was retrieved; the size check stopped the proposed small sample before download. A `.mrpack` is not inherently tiny. The 38 individual-mod candidate artifacts total 528,114,888 listed bytes, excluding dependencies and author/edition review. These are measured metadata totals, not bytes downloaded, elapsed-time estimates or a runnable set.

## Eighteen additional donors

Rows N28–N45 extend N01–N27 in the [previous catalog](MINECRAFT_MODPACK_SCOUT_2026-10-14-expanded.md). Source pages/metadata support the stated basis; the receiving questions are original proposals. None is a build assignment.

| Code | Donor / primary source | Supported basis and useful next question |
|---|---|---|
| N28 | [Modern Industrialization](https://www.curseforge.com/minecraft/mc-mods/modern-industrialization) | Author emphasizes early automation and fewer repetitive crafting tools/tiers. Compare earned convenience with maintaining meaningful preparation |
| N29 | [Factory Tech](https://www.curseforge.com/minecraft/mc-mods/factory-tech) | Historical niche technology lead. Exact component/maintenance mechanics remain unverified; investigate whether upkeep creates a useful replacement choice rather than routine busywork. First guessed source repo failed; do not treat it as confirmed source access |
| N30 | [Prodigy Tech](https://modrinth.com/mod/prodigy-tech) | Hot-air power, unusual materials and a progressively unlocked book. What makes operating conditions and research order legible? |
| N31 | [Deep Resonance](https://modrinth.com/mod/deep-resonance) | Crystal-based power generation with early and advanced processing. Investigate how preparation changes one retained crystal, capacity and useful output; formulas unread |
| N32 | [Integrated Dynamics](https://modrinth.com/mod/integrated-dynamics) | Logic/network-based automation. Can a player inspect the actual predicate preventing a saved plan from advancing? |
| N33 | [Integrated Tunnels](https://modrinth.com/mod/integrated-tunnels) | Transfers items/fluids/energy using conditional filters. Compare exact custody and stock predicates rather than adding another scheduler |
| N34 | [Alchemistry](https://github.com/SmashingMods/Alchemistry) | Public chemistry-mod source. Read a decomposition/recombination path for alternative material sourcing and conservation; not an exact Modrinth match in this scan |
| N35 | [ElementalCraft](https://modrinth.com/mod/elemental-craft) | Element collection, infusion, binding, shrines and tool abilities. Compare environmental support and useful element-specific processing; selected Modrinth edition is older, not current parity |
| N36 | [Totemic](https://www.curseforge.com/minecraft/mc-mods/totemic) | Totems, nearby boons and instrument-driven ceremonies. Can supported group participation change an effect and what remains after performance stops? The Modrinth match's publisher/edition requires review |
| N37 | [Eidolon: Repraised](https://modrinth.com/mod/eidolonrepraised) | A distinct continuation with recharge rituals and other additions. Compare charged objects and ritual recovery; the author's plans for more usable research are not delivered-feature evidence |
| N38 | [Mana and Artifice](https://modrinth.com/mod/mana-and-artifice) | Shape/component/modifier spell composition. Compare it with Hex/Psi/Ars for different constraints and accessible authoring choices |
| N39 | [The Betweenlands](https://github.com/Angry-Pixel/The-Betweenlands) | A separate authored environment. Investigate one local rule affecting imported equipment or field preparation; exact rule and edition still need reading |
| N40 | [Dimensional Doors](https://modrinth.com/mod/dimensionaldoors) | Door-linked pocket spaces with different exploration structures. Read access, return and retained-place rules without copying traps or story solutions |
| N41 | [Treasure2](https://modrinth.com/mod/treasure2) | Locked treasure with matching keys. Can an origin-qualified key change access while preserving actual object custody? |
| N42 | [Modular Golems](https://modrinth.com/mod/modular-golems) | Different metal parts, upgrades and equipment-bearing golems; humanoids consume item durability. Compare constructed companions with distinct material, gear and support roles |
| N43 | [Hexerei](https://modrinth.com/mod/hexerei) | Cauldron recipes, exploration and witchcraft presentation. Read one preparation/use loop; the page lists coven alignment/NPC tasks/rituals as future plans, not implemented claims |
| N44 | [Cabricality](https://modrinth.com/modpack/cabricality) | Main/optional technology threads, profession/trade systems and quest overview. Compare its reimplementation with original Above and Beyond; actual quest payload downloaded |
| N45 | [Prominence II](https://modrinth.com/modpack/prominence-2-fabric) | Author describes talent choices, artifact upgrade trees, NPC campaign progression and appearance changes separate from stats. Inspect a specific progression consumer; pack content not downloaded |

## More-to-consider dispositions

**ACT NOW, A5: completed.** Broadened the donor set, saved the 61-target acquisition index with fallbacks, verified a small real `.mrpack`, and retained raw descriptions/metadata in the existing gitignored private area. No additional downloader package or launcher was installed. The one-off inventory used the documented public Modrinth search/project/version API with three request workers; it stopped after a single bounded identity search per target rather than cycling guessed slugs. [API](https://docs.modrinth.com/api/).

**ACCOUNT FOR NOW, A6:** pin project, edition, file version, hash, origin and content role. An original project, its port, inspired pack, compatibility addon and translation are separate candidates. The inventory deliberately labels exact-title matches as not yet author-verified. Do not execute the whole index as though those identity checks were complete.

**ACCOUNT FOR NOW, A7:** keep world rules and timing local. Minecraft tick behavior, automation, repeated quest rewards and real-time maintenance do not automatically fit played-time/away-time semantics here. A pack's universal progression stage should not override what a particular YAIRPG actor legitimately knows or can do. Reuse current stock/job/item/discovery owners and qualify one actual consumer before adding state.

**ACCOUNT FOR NOW, A8:** deduplicate bytes by hash, not just filename, and keep separate version manifests. A source snapshot need not match the released binary. Quest definitions, localization, recipe overrides and runtime code should remain distinguishable. Hash verification proves downloaded bytes; it does not prove completeness, licensing for reuse or gameplay.

**ACCOUNT FOR NOW, A9:** retain zip paths and override layers when inspecting packs. The Modrinth specification defines base, client and server overrides with different precedence. Inspect archive members without flattening them; any later extraction must keep paths inside its destination. Keep unresolved manual dependencies explicit. [Format](https://support.modrinth.com/en/articles/8802351-modrinth-modpack-format-mrpack).

**LATER, A10:** full bulk acquisition can use the existing source/project routes in the index after edition matching, with a separate status for each successful, unavailable or manual-download artifact. A playable comparison should use several selected instances by Minecraft version/loader rather than one universal pack. It needs a chosen playable subset, not an artificial five-reference cap. Full deep reading, decompilation, gameplay installation and YAIRPG implementation were not dispatched by this research pass.

## Limits and saved outputs

This pass established metadata/download routes and read a small pack's archive index. No Minecraft processes, installers, downloaded scripts, servers, builds, tests or private saves were used. No commits, pushes or publishing occurred. Earlier failed guessed URLs remain failures, not missing-project conclusions. The inventory is a reproducible acquisition plan, not a claim that all 61 targets have been downloaded or fully researched.

Raw public project descriptions, version lists and the sample archive are in `docs/research/minecraft/private/modrinth/`. Public/paraphrased owners are this report, [acquisition index](MINECRAFT_BULK_ACQUISITION_2026-10-14.json), [sample receipt](MINECRAFT_MRPACK_PROOF_2026-10-14.json) and the earlier [expanded catalog](MINECRAFT_MODPACK_SCOUT_2026-10-14-expanded.md).
