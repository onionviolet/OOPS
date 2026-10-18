# Magical production: code inspection and YAIR possibilities

**Further requested pass:** [current YAIR support, 30 system interactions, 18 cheat combinations and nine world joins](YAIR_INTERACTIONS.md). That follow-up refreshes live source rather than treating this report's application examples as the entire design space. All added gameplay remains proposed.

2026-10-15. Research only. User first requested play and deeper mechanics/progression/automation, then explicitly redirected the work to downloaded code/binary inspection instead of browser grinding. [Earlier comparison](../MAGICAL_PRODUCTION_REFERENCES_2026-10-15.md). All YAIR designs below are proposals, not accepted direction or dispatched implementation.

## F1: Acquisition and evidence boundary

| Reference | Acquired evidence | Qualification |
|---|---|---|
| [Alterhistorian](https://dystopia-user181.itch.io/the-alterhistorians-conquest) | Developer-account [public repository](https://github.com/Dystopia-user181/The-Second-Alterhistorian), commit `53e9b29209a458028252f9d450eb4acd3558fb3c`; shipped HTML and 161,348-byte JS | Full source checkout retained privately. Eight selected shipped-code correspondence checks cover timing, cap, pipes, clay, prepared iron, catalyst threshold and post-ending production. This is not a byte-identical rebuilt-source proof or proof of every current repository behavior. |
| [Immortality Factory](https://korbohned.itch.io/immortality-incremental) | Shipped HTML and 2,560,842-byte GameMaker-generated JS | Recovered named game functions and decoded catalogues directly from the executable browser payload. No native binary or external decompiler was necessary for the selected mechanics. No public editable GameMaker project found in the bounded search. Developer itch profile checked; linked personal site was unavailable through web fetch, so absence is not established. |

Browser payloads: [Alterhistorian HTML](https://html-classic.itch.zone/html/12468069/index.html), [JS](https://html-classic.itch.zone/html/12468069/assets/index.54dbcd9d.js); [Factory HTML](https://html-classic.itch.zone/html/16185036/index.html), [JS](https://html-classic.itch.zone/html/16185036/html5game/Immortality.js?cachebust=107879438).

Raw inputs, source checkout, exact hashes, function byte ranges, full source dialogue, descriptions, all research callbacks, all recipe-display definitions and cost tiers are retained in gitignored [private evidence](private/README.md). No third-party source/assets were copied into YAIR gameplay. Neither a public repository nor a browser download is being treated as permission to redistribute the code.

**Hands-on extent:** Alterhistorian: observed fresh four-machine opening, produced and extracted Earth, sold a batch for $1.09, inspected Shoveller upgrades and global pipe/end-goal costs. Factory: viewed intro, workshop opening and initial research menu, including a native private-window check. No automated factory, late-game route, ending or persistence roundtrip was completed in play. Initial hidden-browser input attempts were unreliable; they are not success evidence. The source pass below replaces further grinding at the user's request. Temporary research tabs/private window were closed; personal saves and existing YAIR tabs were not changed.

## F2: Alterhistorian progression is an interdependent process network

Source owners below are relative to the pinned source checkout; exact machine definitions remain in `src/js/machines/database/data/`.

| Stage | Verified source behavior | Why it matters |
|---|---|---|
| Bootstrap | Shoveller produces Earth at base 0.3/s into capacity 16. Cistern unlock costs $1, wood access $40; basic upgrades separately change capacity and velocity. | Supply, throughput and buffer size are different capabilities. Selling stock competes with using it. |
| Construction and first automation | Mixer costs $6, furnace 12 Wood. Earth + Water produces Clay; fuel-fired Clay produces Bricks. Global pipes cost 30 Bricks. | Automation is reached through an actual construction-material chain. It does not appear merely because a task has been repeated. |
| Industrial transition | Coal discovery exposes Steam Engine ($800). Water heating supplies Steam; engine produces Energy and returned Water. Energy exposes Pulverizer and Arc Furnace; Fire is a separate extracted resource. | A higher processing tier changes fuel, support infrastructure and available transformations. |
| Separation | Essence Purifier needs a 150-Energy activation payment. Energy can feed Essence extraction; subsequent Essence upgrades expose Lava→Vitriol and Glass→Purity. | Unlocking a machine, powering it and improving its supported processes are separate gates. |
| Transmutation | Vitriol enables Transmuter access. Chain: Stone or Stone Dust→Iron→Lead→Copper→Silver→Gold→Quicksilver. Stone preparation improves the first conversion. | Upstream preparation remains relevant after a new machine appears. |
| Final synthesis | Elixir Maker bought for 20 Gold. Six inputs: Quicksilver, Wood, Water, Fire, Earth, Purity. Consumption coefficients are 1 of each of the first five plus 0.1 Purity per simulated second; output is 0.1 Elixir/s before the end cutscene. | The final goal reconnects early sources with advanced processing. Those coefficients are rates, not a one-of-each batch. |

**Prepared input example:** direct Stone conversion uses 0.5 Stone and 0.4 Vitriol for 0.08 Iron; prepared Stone Dust uses 0.5 dust and 0.2 Vitriol for 0.25 Iron. This is a meaningful technique/processing improvement with its own pulverizing cost, not a cosmetic recipe rename.

**Catalysis example:** Arc Furnace's Fire slot activates its catalyst at at least 5 Fire. It multiplies material input and output by 1.6, while the separate catalyst consumption is 0.02 Fire/s. That is higher throughput relative to Energy, not free material yield; the Fire drain is not bounded to successful output production. Follow operations rather than infer behavior from the word “catalyst.”

**Other non-ideal behavior worth retaining:** Mixer consumes 0.1 Water/s when output progress is zero. Pulverizer uses a wall-clock `tan((Date.now()/1000)%1.293)` force term, with additional force factors in consumption/requirements. Its literal recipe coefficients alone cannot predict a stable measured per-second ratio. These are source observations, not verified runtime balance or defects to copy.

### Automation, information and time

`src/js/machines/logic.ts` caps a town at 50 machines. Each machine processes before its outgoing pipes are ticked. Pipes transfer a fraction of the receiving input's capacity per simulated second: base 2%, multiplied by ×4 and ×2 upgrades. Thus capacity also changes transport rate. Full or incompatible recipients affect allocation; the loop includes receiver capacity in its denominator even when its ratio is zero from being capped, so do not assume unused share is completely redistributed.

Stacks preserve layers of materials and consume the last item. Mixing resources into a shared stream can create obstruction and tiny-stack cleanup work. Input Merger chooses a resource through an update-count-based rotating preference, combines matching inputs and periodically removes tiny remnants. It is not the same policy as Factory's fixed priority routing.

Source/UI distinguishes an upgrade that can accept a partial material payment from one fully affordable. Material upgrades consume held stock and retain partial prepayment. Machine statistics and recipe/hint reference views are present. Helpful knowledge comes from showing admissible inputs and explaining blocked progress, rather than revealing every transformation as a free unlock.

The time bank is exact in `logic.ts` and the shipped bundle: unused elapsed time is banked; 40% of banked seconds become additional simulated duration. Extra speed factor is 2 below 180 banked seconds, otherwise `min(bank/90,9)`, giving up to 10× total speed including ordinary time. The bank is spent as the process network runs. Do not interpret this as full-efficiency offline production, or copy its 40% into YAIR's accepted means-dependent time policy.

Source end-state behavior: buying the 0.5-Elixir goal pauses machine progression until the cutscene is finished; continued Elixir output is then 0.01/s. No prestige/reset design is inferred from the title. Ending presentation is retained privately and was not played.

## F3: Factory progression changes topology, efficiency and material economy

Decoded **26 resources, 14 machine types, 25 recipe-display definitions and 40 research entries**. The full entries, costs, descriptions and callback effects are in private JSON/Markdown tables. Research is fed physical inputs through a Laboratory; it is not a separate research-point currency.

| Phase | Actual gates and available behavior |
|---|---|
| Start and transfer | Start Factory consumes 4 **Gold** Coins, unlocks Air Pump and Single Storage. Refine Resource consumes 4 Rich Air and unlocks Refinery, its first crystal recipe and machine movement. Automation consumes 2 Mana Crystals and unlocks connector transport. Splitter/Merger follows at 6 Crystals. |
| Decomposition | Destroy Stuff costs 16 Crystals and introduces Disharmonizer. Four Crystals produce 2 Mana Dust, 1 Liquid Curse, 1 Silica. Research exposes disposal, larger storage and combination. |
| Recombination | 2 Dust + 1 Silica→Weak Gem; 2 Silica→Obsidian. Refining Weak Gems produces Pure Gems. Breaking Obsidian supplies Gloom Shards and recycled Silica. Research improves existing formulas as well as exposing new ones. |
| Economy and branches | Markets sell products into physical coin outputs. Coins also become recipe materials: Copper + 2 Tainted Water→Blood; Silver + Gloom→Bright Shard; Copper + Silver + Gold→Adamantine. Material, money and life-related branches interact. |
| Final assembly | Astral Sheets feed Chassis; Pure Gems + Orbs + Life Force feed Sparks; Sentient Meat decomposition feeds Souls and recoverable material. The ritual converges these branches. |

Research efficiency replacements lock the old recipe and unlock its successor: Rich Air 3→2 per Crystal; Crystal decomposition 4→3 for the same outputs; Weak Gems 10→5 per Pure Gem; Blood 6→3 per Fleshmatter. Curse decomposition 3→2 also changes Tainted Water output from 3→2, so it is not a uniform improvement for every downstream consumer. Recipe revision can shift an existing plant's balance.

Research unlock edges are not necessarily AND prerequisites. Chassis, Sparks or Soul Magic each independently exposes The Ritual via `unlock_research`, which sets a boolean. Actual ritual completion still needs every input branch. A visible project is not necessarily executable yet.

Machine purchase prices follow authored resource/amount tiers indexed by current machine count and clamp at the final tier. This is not indefinite exponential growth. More capacity can demand a new material before settling into a repeatable terminal cost. Storage inventory, resource removal and the held-item path need to be distinguished when interpreting affordability.

### F4: Backpressure and priority are the main automation game

Every ordinary connection moves a discrete item into an empty recipient slot in the generic machine End Step. Timed processing, transport, storage and overflow are separate concerns. Disharmonizer waits for **all four output slots** to clear before it can run another batch. An unwanted co-product can therefore stop production of the one wanted product.

Five-way Big Splitter and Big Merger use fixed ordered slot checks, with the lower slot first, not equal distribution. This supports a useful topology: reserve/buffer first, production next, sell surplus next, discard last. Overflow handling is an actual production requirement, not only housekeeping. Ordinary splitters have different logic; no claim that every router is equivalent.

Storage Vault starts at 10 items; Storage Use expands both existing and new vaults to 16. Purchasing and research make storage part of progression. Right-click movement destroys the old machine instance after disconnecting it and picks up its type; it does not carry a complete machine-state object. That explains why rearrangement cannot be assumed to preserve contents or work. No such destructive movement policy is proposed for YAIR.

Market denominations matter: Copper, Silver and Gold are physical outputs, corresponding to 1/10/50 internal coin value. The output checks allocate Copper before Silver before Gold when the slots are free. Taking low denomination coins continually can interfere with accumulation of higher denominations. Richer stock need not mean the currently required denomination is available.

### F5: Runtime consumers change the final bottleneck

The recipe display defines the ritual using one Soul, Spark and Chassis. The actual Ritual Infuser `Create_0`/`Step_0` instead accumulates **100 Chassis + 50 Souls + 200 Sparks** for one Phylactery. The arrays used for this final accumulation live on the game controller and are saved under `Final`, rather than being unique per infuser. A later YAIR communal project could intentionally share contributions, but this reference does not prove independent per-machine ritual buffers.

One Chassis needs **5** Astral Sheets although its historical recipe key says `10-Astral>>>Chassis`. Blood recipe keys similarly say 8/4 although definitions and actual Refinery arrays use 6/3. These are concrete reasons to retain IDs and separately inspect operational arrays.

Derived lower bound from the inspected recipes, excluding buildings and research: one ritual needs 500 Astral Sheets for its Chassis, hence 500 Pure Gems, and another 200 Pure Gems for Sparks. That is at least **700 Pure Gems**, or 3,500 Weak Gems after the 5:1 upgrade. This is a dependency calculation, not a measured completion time; routing, research, recycling, machine speeds and support branches add constraints.

After one Phylactery the immortality research consumes it to trigger an ending. An optional 30-Phylactery research is explicitly framed as an optimization challenge without substantial reward. The acquisition of an end-goal item and the continued scaling challenge are different progression horizons. Native consequences for a living RPG character were not demonstrated by this factory game.

## Beyond the apothecary: original YAIR proposals

These extend [CA8–CA11 research direction](../../USER_VISION.md#ca8-original-answer-reconciled-2026-10-15), existing crafting/method consumers and the [prior ingredient/process synthesis](../procedural-crafting-ui-2026-10-15/DEEPER_SYNTHESIS.md). They do not resume paused world work or replace the live priorities in [PROJECT](../../../PROJECT.md).

| Code | Lane and concrete player journey | Disposition and fit |
|---|---|---|
| P6 | **Expedition outfitting and fort provisioning.** Salvage→prepare metal→make useful gear or repair stock→reserve personal supplies→fulfil a funded order. A recycled fraction can feed the next repair. Better preparation trades process time/equipment for scarce inputs. | LATER. Reuse native salvage/smelting, equipment custody and existing finite Fort supply consumers. Good first non-apothecary candidate because the output already has a purpose. Do not add a parallel universal logistics ledger. |
| P7 | **Farming, household and seasonal supply.** Grain feeds seed reserve, meals and sale; stalks feed bedding or fuel where local rules allow. Choose seed/household priority before a standing sale order. Bottlenecks might be drying, milling or storage rather than raw growth. | LATER. Connect existing household/food direction. Seasons, spoilage and upkeep apply only where accepted local systems support them; this proposal does not enable hunger or force survival chores. |
| P8 | **Magical infrastructure and ritual projects.** Produce a battery, ward component, construct part or anchor-compatible component; assemble it; charge it through actual means; test a real ability; repair, resupply or improve it. A communal ritual can accept staged contributions with clear custody. | LATER. Distinguish material fabrication, pattern/knowledge, assembly, energy and activation. Existing item/ability/world/continuity rules decide portability and effects. A phylactery item must have an actual supported death/identity consequence before it counts as immortality. |
| P9 | **Institutional production and trade.** A guild workshop accepts a finite commission, allocates stock, pays capable people under an explicit arrangement and chooses standard versus higher-quality output. Keep physical denominations relevant only when they change an actual transaction. | LATER. Reuse careers, jobs, NPC agency, agreements and trade. Delegation can arise from a skilled person or existing apparatus; personal mastery is not an invented universal prerequisite. Avoid reducing people to interchangeable factory modules. |
| P10 | **Computing and conditional automation.** Build a supported measuring/control device or instruction carrier; have it sense a real value, choose a supported action and run an existing procedure. Example: reserve ward charge, trigger a compatible recharger, stop at an unsupported choice, report the last blocked stage. | LATER. This is a control layer over real capabilities, not an interpreter that grants arbitrary world effects. Suitable cheats can bypass ordinary limitations where their actual rules allow. No universal circuit system is selected. |

**ACCOUNT FOR NOW across all five:** make reserve, production, overflow and interrupt policy explicit; distinguish buffer size, processing rate, transport rate and yield; show the next missing capability and the stage that stalled. Permit reversible reconfiguration preserving custody and meaningful progress. Present a compact process view by default; use spatial construction when geometry changes behavior. Keep local time, choice stops, bank spending and inactive-world freeze under their current owners. Saved method knowledge, physical machinery and local stock need separate continuity treatment.

The stronger common journey is **want a capability → discover or obtain a method → assemble available means → produce and use output → identify a bottleneck → revise or scale the method**. Research can improve an existing production line or reveal a new use, rather than only introduce another item tier. Optional automation should remove repeated handling while leaving meaningful goals and allocation choices.

## Preservation, checks and remaining limits

Saved raw payload hashes and URL receipts; pinned source commit plus 90 source-file hashes; recovered 269 named Factory function files with exact bundle byte-range index; extracted and count-checked the complete selected catalogues; retained all original ending/intro text privately. Eight selected Alterhistorian shipped fragments corroborate the source analysis. The extractor reads text and does not evaluate third-party code.

Checks validate acquisition integrity, extraction counts, referential joins and selected source statements. They do not establish source-to-binary parity for a Windows build, late-game pacing, an automated factory in play, persistence compatibility or YAIR implementation. No dependencies installed, native binary launched, YAIR build/tests run, personal save read, commit or push. The latest source-directed request makes further manual grinding unnecessary for this pass.
