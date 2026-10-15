# Lane TA: technology and automation mods (audit, 2026-10-14)

Labels: shown = read in data or code; stated = author guide text; inferred = my reading. Source route: public repos cloned at the matching tag or branch head whose mod_version equals the jar (confirmed by reading gradle properties and `git ls-remote`; the `gh` CLI is not installed, so plain git was used). Factory Tech and Prodigy Tech used the sibling decompile output. Private tables: `private/audits/ta/create_mi_pnc.md` and `private/audits/ta/others.md`. Minecraft values are reference only; nothing here authorizes implementation.

## Top findings

- TA1 (shown, Embers) Alchemy is a hidden-code puzzle. A world-seed-derived code assigns an aspect to each input slot. A wrong attempt yields a waste item that records right-aspect-right-slot and right-aspect-wrong-slot counts plus what was tried. Failure is the clue source, not a loss. Answers N12 (partly) and is the best "informative failure" pattern in the lane.
- TA2 (shown, Factory Tech) Upkeep is a compounding-risk part, not a timer. Each part has a fixed operation lifetime, then a break roll whose chance multiplies each survived operation. A broken part halts the machine. Parts have quality variants (cheap, short-lived, slow versus long-lived, fast), a spare-part reserve auto-installs, and breaks can return salvage. This is a real replacement choice (answers N29): choose faster-but-brittle against slow-and-durable, and stock spares. It becomes busywork only if the reserve does not auto-install.
- TA3 (shown, Create) One shared budget with a readable cause. Network capacity (declared capacity times rpm) versus summed impact (impact times rpm); overstress zeroes speed. Goggles and the stressometer show impact at current speed. Boilers show the same pattern with three separate caps (heat, tank size, water), engine efficiency = min over those, and each cap is printed. Best "why is it stalled" display in the lane.
- TA4 (shown, PneumaticCraft) Readiness uses operating conditions, not only total energy (answers N11). Air stored is volume times pressure; operations consume air but gate on pressure. Recipes carry minimum pressure, temperature windows (min and max), speed and air multipliers. Over danger pressure while air is still rising, explosion chance climbs with the excess, preceded by a creak; a safety valve vents and clamps. Equalisation splits air by volume, no backflow.
- TA5 (shown, Modern Industrialization) A recipe is a fixed energy bill (eu times duration). Power draw can exceed the recipe rate to finish sooner, ramped by an efficiency counter that climbs by one per finished batch and decays on any under-powered tick. Manual boosts: a catalyst item for timed speed, lubricant at 25 mb per efficiency tick. Tier is gated by hull casing (right-click to upgrade in place) and cable tier (32, 128, 1024, 8192 EU/t). Answers N28: convenience is earned by a ladder of machines (bronze 2 EU/t recipes, then electric), and the guide itself says automate machine parts early so crafting becomes cheap.
- TA6 (shown, Crossroads) Two supports for one process compete through physics. Rotary power is a conserved energy pool (sum of energy, sum of inertia, gear ratios change speed and inertia), heat is a separate conserved quantity with equalisation, and a Stirling engine converts a heat difference to rotary at 0.8 x dT/2000 efficiency. A machine can need both heat tier and spin. That is more than a second fuel currency (answers N10): each side has different loss, storage and failure behavior. Progression is gated by discovering beam alignments (11 colors), then a path choice (alchemy, technomancy, witchcraft), each with a capstone.
- TA7 (shown, Integrated Dynamics and Tunnels) Part state stores evaluation errors, deactivates the part, and re-activates when the offending variable changes. Slot-level messages (invalid value, wrong type) sync to the client. So yes, a player can see the failing predicate's message at the part (answers N32), though not a full trace. Tunnels (N33): the criterion for each import or export is one of: all, amount per tick, single item, list, predicate operator, NBT; stock is readable as variables (network count, max count, per-item count, interface count), so custody and stock predicates are separate readers and writers on a channel, with priority/round robin.
- TA8 (shown, Deep Resonance) One retained object with four numbers (answers N31). Total energy scales with strength and (purity+30)/130; rate with efficiency and (purity+2)/102; low purity raises radiation radius and strength. Preparation: laser converts the crystal to liquid with stats, infusing items add bounded stat bonuses capped by the liquid quality, the crystalizer rebuilds. Generator warnings are plain broadcast messages (no collector, too many, too strong).
- TA9 (shown, Prodigy Tech) Operating conditions are legible: temperature in, temperature out shown in the GUI; machine speed is linear in supplied temperature over required; air only rises, loses temperature per working machine, so stacking order is the puzzle. The book unlocks entries by advancement in order (explosion furnace, aeroheater, grinder, solderer, energion, primordium). Answers N30. Explosion furnace is a one-shot batch where over- or under-damping costs output.
- TA10 (shown, Alchemistry) Conservation is exact only at the nuclear tier: fusion (3481 pair recipes) sums atomic numbers; fission (117) splits one into two. Item tier is not mass-balanced: ores give 32 element units, storage blocks 144, rocks roll a weighted mix (some rolls give nothing). Combiner and compactor reverse selected dissolutions. Answers N34 with a caveat: ChemLib elements are not in the archive, so the element table was not read.
- TA11 (shown) Teaching styles differ: Create uses 179 Ponder scenes plus an advancement chain 35 deep (stressometer at depth 10); PneumaticCraft a Patchouli book of ~230 entries with a programming tutorial and in-world drone debugging; MI a GuideME book (steam, electric, midgame, lategame); Embers a node-tree codex with prerequisites and per-player checkmarks; Prodigy gated Patchouli; Factory Tech plain text pages; Integrated Dynamics a single info book.

## Donor questions
- N10 TA6. N11 TA4. N12 TA1 plus ember flow: the emitter pulls 10 per 5 ticks into 200 capacity and fires a 40-ember packet every 20 ticks only if the target has room, so transport has a rate limit and a back-pressure check; activator yields per item (crystal 2400, cluster 4400, shard 400); whether the power source changes choices is inferred yes (ember moves by line-of-sight packets, not pipes).
- N28 TA5. N29 TA2. N30 TA9. N31 TA8. N32 and N33 TA7. N34 TA10.

## Per-target coverage
- Create: read fully for stress, boiler, ponder count, advancement chain; recipes by type counts only; trains, packages and logistics not read.
- Modern Industrialization: read crafter component, overclock, cable tiers, guide pages for steam and electric; multiblocks, nuclear, fusion not read.
- Factory Tech: read machine base, part class, part list; individual machines and lang text not read in full.
- Prodigy Tech: read guide fully and hot-air classes in part; recipes and explosion-furnace constants partly.
- Deep Resonance: read crystal, generator collector, radiation, infusion; laser/purifier timing partly.
- Integrated Dynamics / Tunnels: read error handling, operator counts, tunnel aspects; logic programmer UI and book text not read.
- PneumaticCraft: read air handler, tiers, sample recipes, book structure; drone execution and heat classes not read.
- Crossroads: read heat util, firebox, rotary energy, stirling, progress graph, data samples; beam/alchemy code and the Patchouli text not read.
- Embers: read emitter, capability, alchemy base, activation data, research tree; upgrades, steam engine and tinker mechanics not read.
- Alchemistry: read recipe data and counts; machine energy, dissolver code, ChemLib not read.

## System patterns across targets
- SP1 Bottleneck is min over named caps and the UI prints each cap (Create boiler, PNC gauge, Prodigy temperature in/out).
- SP2 Failure leaves evidence (Embers waste pins, ID part error text, DR broadcasts, Create overstress effect).
- SP3 Fixed energy bill, variable rate (MI), versus rate-limited transfer with back-pressure (Embers emitter, PNC air).
- SP4 Wear as compounding risk with replaceable quality tiers (Factory Tech) versus none elsewhere; every other mod has no upkeep.
- SP5 Unlock by discovery rather than by points (Crossroads alignments, Create advancements, Embers codex checkmarks).
- SP6 One retained object with a few numbers, edited by consumables up to a cap (Deep Resonance).

## YAIRPG fit (proposals only, no implementation)
Grep of src/ shows existing owners: `systems_workshop_content.js`, `systems_workshop_runtime.js`, `systems_workshop_ui.js`, `systems_workshop_validation.js`, `field_workshop.js`, `artifact_workshop_*`, `work_ledger_system.js`, `native_craft_transaction.js`, `mixture_rules.js` and `mixture_state.js`, `action_legibility.js`.
- F1 SP1/TA3 stall reasons belong with `action_legibility.js` and the systems workshop UI: show each limiting cap, not one number.
- F2 TA1 informative-failure alchemy fits `mixture_rules.js` (per-save hidden recipe code, feedback counts on the waste result); keep per-world, per the standing no-fixed-once rule.
- F3 TA2 part wear fits `work_ledger_system.js` or the workshop runtime as an optional per-station part with lifetime and compounding break chance; needs a design owner decision before anything is built, and an auto-restock option to avoid chores.
- F4 TA4/TA9 operating-condition gates (min pressure, temperature window) map to station recipes with condition fields rather than just resource totals.
- F5 TA5 fixed-bill/variable-rate can be a station rule: same total work, more throughput if inputs allow, ramp with consecutive batches.

## Gaps
- Embers upgrade and steam engine, Create trains and packages, MI multiblocks, Crossroads beam and alchemy code, PNC drone VM and heat, ChemLib element table, ID logic programmer UI: unread. No game was run; all claims are from static data and code. Crossroads 2.12.0 and Embers 1.4.7 sources are branch heads whose version string matches, not tags.
