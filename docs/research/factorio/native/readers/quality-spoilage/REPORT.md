# Fresh native quality and spoilage review

The fresh arm64 bodies connect **real ingredient consumption, quality-dependent lifetime, timed output identity and changed material custody**. A product can become spoilage before it reaches its output slot; pentapod eggs instead dispatch a spoil trigger. The two paths are consequentially different. Admission and product creation also use different spoil-offset arithmetic, so this review does not claim a universal shared prediction formula.

This reader fully read **11 generated native bodies**, containing **1,515 decoded instructions and 1,271 C lines**, and produced **11 reviewed claims**. One parent-owned helper received scoped inspection. Fourteen exact installed Lua/API/info files were rehashed against their live installed counterparts; all matched. Twenty-seven selected API contract entries were read. [FINDINGS.json](FINDINGS.json) owns every full C/body/file hash, C-line range, instruction address, call/xref locator, API JSON pointer and limit. This is useful bounded reading within the continuing full recovery goal, not whole-native, full-DLC, both-architecture or runtime coverage.

## Evidence identity and qualification

Installed Factorio is **2.0.77 / Steam build 23347942**. This reader independently rehashed the private 101,254,464-byte arm64 input: `9e1d7571e0284bb4c4e0e12716143752c893cb79b266038e64d0ee41f54aab93`, matching [native intake](../../INTAKE.json). It used Ghidra 12.1.4 schema2 records from the fresh partial-analysis qualification, not the historical merged-tail priority output. All selected C hashes and complete ordered raw-body-piece hashes matched. Compressed chunks 4, 5 and 6 matched the [qualification receipts](../../SCHEMA2_QUALIFICATION.json). The extra parent helper's chunk 7 matched its separate closed-chunk receipt.

The five assigned frozen C/JSON views were identical to the referenced chunk records. Extra stack/setup/deadline bodies were extracted through a SQLite connection opened with `mode=ro`, into this reader's private reservation. Neither the index nor analysis project was mutated. Raw C, bytes and disassembly remain private at `/Users/weiwei/.codex/research/factorio/native-23347942/reader-work/quality-spoilage/`; repo artifacts contain analytical summaries and locators.

Names are retained release-binary symbols. Signatures, integer types, anonymous offsets and generated comments are inferred views, not the original C++ declarations. Important arithmetic was checked against instructions: in particular the deadline conversion uses unsigned `fcvtzu`, and the selected admission body contains no hidden floating addition. Incoming data references do not establish runtime calls. Array counts of 33 direct-call rows, 274 outgoing xrefs and 265 incoming xrefs are generated evidence counts, with cross-record duplicates possible.

| Complete body | Entry | Chunk / line | C SHA256 prefix |
|---|---|---|---|
| QualityPrototype::rollQuality | `100354a90` | 4 / 54 | `cb65fe4853cc` |
| QualityPrototype::postLoadSetup | `1003587ac` | 5 / 71 | `7ed32c3da3a3` |
| ItemPrototype::computeTicksToSpoil | `1001ae42c` | 4 / 40 | `56fafe975d5c` |
| ItemPrototype::computeSpoilTick | `101420cdc` | 5 / 41 | `16d75f52f123` |
| ProductionHelper::takeIngredients | `10073f398` | 4 / 37 | `aa3679370304` |
| ProductionHelper::giveProducts | `10073ec44` | 4 / 36 | `816503ce0750` |
| ProductionHelper::canGiveItemProduct | `101559374` | 4 / 38 | `c9aa4c87a7ba` |
| ItemStack::setSpoilTick | `1001aed64` | 4 / 1 | `f8272d5d425b` |
| ItemStack::spoil | `10141f538` | 5 / 39 | `a84b0af88396` |
| ItemStack::isMoreSpoiledThan | `1007f784c` | 5 / 8 | `f77c4d66d35e` |
| ItemStack::setSpoilPercent | `101429ea4` | 5 / 44 | `a3b5c7fb3909` |

`ProductionHelper::canGiveProducts`, `100741abc`, chunk 7 / line 78, C SHA256 `7e4553857c040144671b5493d4d4fea482c8fb340a4d857d04e4b29fdf27a753`, was inspected only at C lines 21–37 and instruction addresses `100741afc`–`100741b50`. Its complete semantic review belongs to the parent; it is excluded from the eleven-body count.

## What the bodies establish

**Quality roll, QS-01/02.** A zero effect returns the supplied quality before updating RNG state. A nonzero effect updates the generator once, forms one sample, and reuses it while walking the linked quality chain. Each transition requires a next ID and an unlocked byte, multiplies the threshold by the current prototype's probability, and stops if the sample exceeds it. A global byte limits traversal. Exact fixed-point effect encoding and that cap's field name/value remain unknown here. Setup writes a reverse link when absent, follows a logging branch for conflicting predecessors, and calls the named cycle-check helper without this reader claiming that helper's full algorithm.

Installed Base defines normal quality with `next_probability = 0.1`; Quality patches its next link to uncommon. Quality defines uncommon → rare → epic → legendary, with probabilities 0.1 on the nonterminal tiers. Modules supply quality effects 0.1, 0.2 and 0.25 with a speed penalty of 0.05. The stable API says nominal module quality effect is multiplied by `next_probability`. Technology unlocks and Space Age's changed science prerequisites supply an acquisition route; their definitions do not prove which profile is active. These are exact installed stable files, not the experimental 2.1.21 tree.

**Lifetime and paid input freshness, QS-03/04.** A nonperishable item's duration is zero. A perishable duration uses base ticks, a map multiplier unless the item flag bypasses it, and an internal quality float. Finite positive durations are truncated with a minimum of one tick; invalid/nonpositive values fall back to one and overflow saturates. The absolute-deadline method adds current map time. Stable `spoil_time_modifier`, `ignore-spoil-time-modifier`, and the quality argument to `get_spoil_ticks` support the field interpretation. The internal quality factor's numerical values or formula are not established by the selected bodies.

Before removing ingredients, `takeIngredients` computes their spoil fraction from remaining time and effective lifetime, weighted by the **recipe amounts of perishable ingredients only**. It records nonzero ingredient deadlines, reduces input quality IDs and calls the real removal primitive with the required quantity. Nonperishable ingredients do not enlarge the freshness denominator. Fluid branches subtract bounded amounts and clear exhausted identities. Input eligibility and positive-energy ordering come from the separately parent-reviewed caller chain; this helper alone does not promise pre-payment output reservation.

**Output admission and creation, QS-05/06/07.** An empty slot passes. An occupied slot must match the prospective item, or its `spoil_result` if the supplied spoil fraction predicts expiry. Specified quality must match; a requested quality argument of zero bypasses that equality check. The capacity bound includes the maximum product count plus one if `extra_count_fraction` is nonzero. Metadata-bearing stacks require an additional float condition and unresolved virtual compatibility check.

`giveProducts` performs ordinary output admission before collecting or transferring products; an explicit overload-ignore argument can bypass it. Product creation adds `percent_spoiled` to the supplied ingredient fraction, caps the sum at one, and derives a deadline from remaining effective lifetime plus the supplied tick. A recipe byte strongly aligned with `reset_freshness_on_craft` refreshes a result whose computed deadline is at or after current time. An already-earlier deadline remains earlier. The setter runs before transfer into output custody. Original member declarations were not recovered, so these field labels remain API-supported interpretations of checked offsets and callers.

The asymmetry is exact: `canGiveProducts` restores the incoming spoil scalar unchanged before its call at `100741b48`; all 129 instructions of `canGiveItemProduct` contain no product-offset read or addition. `giveProducts` reads and adds the product offset at `10073ef78`–`10073ef84`. Thus these helpers do not themselves guarantee identical predicted and created spoil deadlines for nonzero product offsets. No runtime bug or universal failed-output behavior is inferred from that observation.

**Changed stacks and priority, QS-08/09/10/11.** A deadline in the past can repeatedly call `Item::spoil` and add the next material's lifetime, allowing a multi-step spoil chain to catch up. A deadline equal to current time also spoils immediately; a future deadline is stored and queued. `ItemStack::spoil` dispatches a trigger first and rereads the current prototype. With no result it clears the stack; with a result it constructs replacement material retaining quality and count, except an observed flag path forces count one. Owner notifications are present but virtual details remain unknown.

The incoming direct call `10141f470` identifies `Item::spoil` → `ItemStack::spoil`, but the complete `Item::spoil` body was not read. Likewise the trigger dispatch is verified without claiming full trigger execution or spawn success. Spoil priority first compares `spoil_level` for different items, then deadlines when levels tie. Installed spoilage has level one even though it has no spoil timer. The percent setter's exact value 1.0 directly spoils; other values delegate to an unread helper, so broad clamping behavior is unproved.

## One consequential installed chain

| Join | Observed source and native evidence | Consequence |
|---|---|---|
| Guard | Ordinary `giveProducts` calls output admission at `10073ecdc`; admission reaches the item guard at `100741b48`. Native caller eligibility, energy and progress joins are parent-owned. | Existing identity, quality, capacity and metadata can block completed output. This is not universal admission before paying the first batch. |
| Paid material and time | Installed `nutrients-from-spoilage`, recipe lines 323–340, requires ten spoilage, nominal `energy_required = 2`, and produces one nutrient with spoil offset 0.5. `takeIngredients` removes recipe amounts at `10073f718`. | Bootstrap output is weak and already half-spoiled in its effective lifetime calculation; the inputs are still real expenditure. |
| Changed material | Nutrients have five-minute base duration and become spoilage, item lines 790–804. Product setter call `10073efbc` precedes transfer call `10073f038`. | Waiting consumes the same material's remaining usable time. Expired output can change identity rather than stay as nutrients. |
| Changed consumer | Biochamber has four module slots, quality effects, crafting speed two, nutrient burner, 500 kW energy use and organic categories, entity lines 93–121. Nutrients carry 2 MJ fuel value. | Actual output can feed further production; expired spoilage does not satisfy the nutrient fuel category. Full burner behavior is not claimed from these definitions. |
| Exception | Egg recipe lines 378–414 pays one egg, thirty nutrients and sixty water, takes nominal fifteen work units and sets `reset_freshness_on_craft`. Egg item lines 1148–1212 has a fifteen-minute spoil trigger requesting an enemy spawn per egg, with a fallback. Native trigger dispatch is `10141f598`. | Freshness reset and trigger consequences make eggs distinct from ordinary spoilage conversion. Successful spawn and ecological aftermath remain unobserved. |

Time units are pinned by installed `core/lualib/util.lua` lines 883–885: 60 ticks per second, 3,600 per minute and 216,000 per hour. These are definition units; actual craft completion depends on native work/energy/speed and current state. For the bootstrap, half of the **effective** nutrient lifetime follows from its 0.5 offset; this reader does not substitute an unproved normal-quality factor value to claim an exact runtime expiry moment.

## Original YAIR use and remaining work

The existing original retort can use the supported custody principle: actual inputs are paid once, all physical products need compatible owned space, and their later consumers use actual output. The retort's two trays, resin/residue recipe, sap/fuel/stamina costs and pre-batch reservation remain authored YAIR choices. None comes from this native quality/spoilage reading.

If later perishable production is selected, the useful extension is one frozen material/deadline contract shared by admission, publication, collection and reload, with explicit refresh and spoil-result exceptions. Preserve one inventory, body, clock and durable publisher. A new random-quality catalogue, numerical lifetime formula, direct Factorio setting or additional prestige is not selected by this report. This reader changes no gameplay; current implemented gameplay remains implemented-unverified under the active deferred acceptance phase.

The remaining semantic gaps are the parent-owned CraftingMachine start/captured-tick/always-fresh/blocked-progress caller joins; product-generator probabilities and inlined quality variants; removal/transfer primitives; quality-factor initialization and effect encoding; Item/trigger/queue internals; and unknown virtual callbacks. Full both-slice export/reconciliation continues under the parent. Later playable, browser, save/reload, import/failure and regression checks remain deferred, separate from completed source reading.

Installed Quality and Space Age payload metadata is present at 2.0.77. It does not establish enabled mods, profile state or entitlement. No game or recovered code was executed; no saves, profiles, entitlements, install/library files, canonical owners, shared index, exporter, build, commit or publication was changed.
