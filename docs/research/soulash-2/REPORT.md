# Soulash 2: bounded public-demo data audit

The free Windows demo contains substantial readable rule data. This audit identifies four connected mechanisms in the `0.9.19.7` snapshot and stops at the native executable boundary. It does not claim that current retail gameplay was recovered. The private ZIP has SHA-256 `aecc5886a9a6f710388867a9ee28e404f6df764bc60bd35be9ee8c1c65e8dc72`; `version.txt` explicitly says `0.9.19.7`. The executable is an x86-64 PE file with a 2026-03-04 COFF timestamp, and the download response gives 2026-03-04 as Last-Modified. See [INTAKE.json](INTAKE.json) for byte counts and executable hash.

The current public [v0.10.0 Living World devlog](https://wizardsofthecode.itch.io/soulash-2/devlog/1609597/update-v0100-the-living-world) describes settlement and wilderness events and moving weather. The later [v0.10.3 Economy devlog](https://wizardsofthecode.itch.io/soulash-2/devlog/1674437/soulash-2-v0103-economy) describes economic skill, resource-flow reporting, buy orders and caravans. Those are creator descriptions of later versions, not semantics recovered from this demo. Its free archive is from March 2026 and cannot establish how either July or September 2026 implementation works.

## Data findings

**F1, timber:** `natural_resources.json#/boreal_forest/wood` lists Pine Log `2092` as a possible wood result with `chance: 0.75`, `rolls: 3`, `weight: 0.5` inside a wood group with `chance: 1.0`. Woodcutter building `10` lists one `2092` per day with no input. Carpenters building `102` lists ten Pine Wood `2093` daily while taking one `2092`. The Pine Log entity separately defines processing action `1` to output 8 to 12 `2093` at `percent_chance: 100` and action `core_2_woodbend` to output 10 to 14, both under `producer.time: 30`. This exposes distinct gathering, building and direct-processing data routes. It does not tell us whether a daily building rate applies per worker, which stock it uses, or how time units map to play. [Exact member hashes and pointers](FINDINGS.json).

**F2, material and mastery:** The Adventuring Adamantine Ingot milestone requires skill 48 and rewards recipe `2116`. Entity `2116` declares two Adamantine Ore `2113`, tool `10`, and time `2` to craft an ingot, whose resource metadata records quality `4`. This is an explicit milestone-to-output-to-input link. We did not recover the executable check that grants the recipe or subtracts ore. [Evidence](FINDINGS.json).

**F3, ability progression:** Ball of Fire requires Pyromancy 15 and rewards ability `15`. Ability `15` is Fireball, with stamina cost `10`, cast time `1.2`, cooldown `5`, fire damage range `[4,8]`, area range `6`, and magic-power factor `0.25`. The Pyromancy skill entry lists ability use as an experience source at rate `2`. These files connect skill training, unlock, cost and an effect definition; actual targeting and damage resolution remain unknown. [Evidence](FINDINGS.json).

**F4, transformation:** `craftables.json` lists four recipes, each costing one elemental core, tool `15` and time `30`. The output/input graph is Water `2532` to Fire `2531`, Wind `2533` to Water, Earth `2534` to Wind, and Fire to Earth. The cycle creates a choice about which material property to preserve or change, but neither discovery nor availability is shown. [Evidence](FINDINGS.json).

## Decision for YAIRPG

The useful reference is the connection of resource provenance, workshop conversion and skill gates. The dossier supports testing an original local supply chain in the existing home world, with concrete inputs and an inspectable outcome. It does not authorize importing Soulash assets, rules verbatim, or expanding the current milestone. See [implementation proposals](IMPLEMENTATION_PACKETS.md). These are proposals, not accepted design or implemented gameplay.

## Audit gate

The finite source gate is met: the actual public ZIP and version were verified, selected JSON was parsed and linked by IDs, member hashes are recorded, and the native/retail boundary is explicit. No game execution, decompilation, full JSON read, UI playtest, save check, installation, purchase or gameplay edit occurred. A future native/retail study would need its own scope; it is not a prerequisite to use these four data observations as inspiration.
