# Qualified native logistics and heat review

Completed bounded review, 2026-10-07T06:00:07.723789+00:00. **43 complete generated C bodies read; 11 native claims.** No native/game execution or gameplay edit. Full both-slice recovery and whole-game semantic reading remain parent work.

Evidence uses actual installed Factorio **2.0.77 / Steam23347942 / arm64**. The slice SHA256 was reread as `9e1d7571e0284bb4c4e0e12716143752c893cb79b266038e64d0ee41f54aab93`. Qualified closed chunks4–6 were reread and all250 record counts, compressed hashes, C hashes and raw-body hashes matched. Selected exact bodies are frozen privately under `/Users/weiwei/.codex/research/factorio/native-23347942/reader-work/logistics-heat/`; no recovered code enters Git. [FINDINGS.json](FINDINGS.json) records each entry/name, body/C hash, chunk/line, exact C bounds, instructions, source hashes and API JSON pointers.

Generated C is a guide to machine behavior, not the original C++ source. This review found **three concrete type/lowering limits**: HeatBuffer energy fields printed as `long` are loaded/stored as doubles; HeatEnergySource conditional extraction prints a void signature while the instructions set a boolean in `w0`; ElectricEnergySource partial extraction C omits the `fmax` source used by the final store. The latter would falsely imply a negative stored buffer. At `1005df25c` and `1005df268`, the instructions clamp the remainder to zero before storage. Finite nonnegative requests are the supported interpretation here; NaN/negative contracts are not claimed.

## Consequential native chains

### NLH-01: Inventory admission includes stack identity, quality, metadata and owner rules

canInsert obtains virtual slot limits, scans admitted slots, accepts empty slots or compatible nonfull item/quality stacks, and invokes InventoryOwnerSpecification::canInsertAt when a specification exists. This is a boolean opportunity to insert, not proof the entire incoming count fits.

**Exact body evidence:** `1005217e4` C19–94 (100521810: virtual offset0x170, 100521820: virtual offset0x120, 100521898: call101416074, 1005218f8/10052196c: metadata virtual offset0x40).

**Limits:** Exact meaning of virtual limits and special item metadata requires their implementations. No inventory batch reservation or concurrency guarantee is established.

### NLH-02: Inventory pickup separates receiver eligibility, selection, hand limits and transfer

transferFromInventory first has a burner-fuel pickup branch, then dispatches by spoil-priority mode. Both ordinary and priority scans require held item/quality compatibility and receiver admission through virtual offset0x188 before ItemStack::transferReal. Transfer size is bounded by the item limit and current live hand count; successful transfer records the current map tick.

**Exact body evidence:** `1007f6d50` C21–152 (1007f6d50..1007f70c0: complete bounded body); `1007f74a0` C39–112 (receiver virtual0x188; direct transferReal target10083b770); `1007f70c4` C42–204 (1007f730c: receiver blr, 1007f73cc/1007f73f0: transferReal10083b770); `1007f6c24` C19–52 (1007f6cc4/1007f6d18: transferReal10083b770).

**Limits:** Numeric pickup result values0/1/2 are not assigned original enum names; receiver admission is not an irrevocable later-delivery promise.

### NLH-03: Spoil priority is explicit selection policy with invalid-input exceptions

parseSpoilPriority maps none->0, fresh_first->1 and spoiled_first->2, rejecting unknown input with ScriptException. Priority selection reverses its comparison orientation by mode, examines a prototype byte at0x431 when identities differ, then nonzero item metadata at0x40. The comparator asserts if either item identity is empty.

**Exact body evidence:** `1007f827c` C16–39 (1007f827c..1007f83e4: bounded parse body); `1007f7728` C12–70 (1007f7830/1007f7848: assertion calls100153cc4); `1007f784c` C12–40 (1007f784c..1007f7904: bounded comparator body); `1007f70c4` C105–145 (comparison branches within body).

**Limits:** Prototype byte0x431 and metadata0x40 are not given original member names; no global freshness algorithm, preserved deadline transfer or enabled DLC state is proved.

### NLH-04: Blocked delivery preserves held material and registers a wake dependency

dropHeldItem treats machine receivers, belts and ground/space as distinct destinations. Machine transfer is virtual0x1c0; a remaining held stack can registerSleeper and deactivate. Belt delivery calls tryToInsert and, after rejection on an inactive line, registers the wakeable on line+0xa0 and deactivates. Empty held identity is required before the ordinary dropped-state flag is set.

**Exact body evidence:** `1007f8448` C26–155 (1007f8510: tryToInsert100401454, 1007f85c4: receiver offset0x1c0, 1007f85e8: receiver offset0xc8, 1007f85a0/1007f8604/1007f877c: deactivate1006176f4, 1007f884c: wake-list capacity error1000f1948); `1007f8a4c` C80–163 (1007f8bbc/1007f8e30: dropHeldItem1007f8448).

**Limits:** Machine transfer, surface createItemEntity, dropItemIntoSpace and actual wake callback implementations remain callees; no launch/runtime observation.

### NLH-05: Transport insertion is spatial admission before item construction

tryToInsert rejects invalid/out-of-line positions, evaluates0x40 fixed-point spacing and neighboring-line gaps, then constructs/emplace items only on an admitted path. It delegates exact-back positions to tryToInsertAtBack. The back method can return false on cramped spacing; null item payload can probe a successful position without item construction. Successful real insertion may attach the line to active work and notify its wake-list owner.

**Exact body evidence:** `100401454` C30–280 (100401454..1004019e7: complete body, tryToInsertAtBack direct target1004011e0); `1004011e0` C19–126 (1004012e4: CompactDeque grow101e946f0, 10040131c: ItemOnTransportLine constructor1004091d8).

**Limits:** FixedPointNumberTemplate with8fractional bits is in the symbol, but complete geometric conversion, constructor custody and API-wrapper call graph are not read. No direct count throughput claim.

### NLH-06: Conveyor scheduling and spoil notifications react to concrete state

TransportLine::update returns when depth>999 or its stored full tick already matches, delegates splitter work when present, marks the tick before recursively updating a linked line, and calls move. An unsuccessful move result unlinks active work; a successful result can reactivate neighboring lines and invoke wake notifications. Spoil notification removes the specific stack when its item ID became empty, otherwise can activate a nonempty moving line and drains a wake-list callback loop. Container shrink explicitly refreshes both wake-list regions.

**Exact body evidence:** `1003fde70` C19–125 (1003fdee8: splitter update1003fd9cc, 1003fdf10: recursive update, 1003fdf34: move1003fd4b4, 1003fe19c: unresolved indirect callback); `1004087b0` C16–65 (1004088f8: remove1003ff7ec); `1004080f8` C9–33 (WakeUpList::updateTransportBeltWakeables calls); `10040ace0` C5–7 (BeltReaderState::add direct downstream instrumentation).

**Limits:** move, splitter, remove and WakeUpList callback internals are not semantically read. No all-network deadlock or ordering guarantee.

### NLH-07: Wake registrations are rebuilt when belt dependencies change; spoiled hand has its own notification

updateTransportBeltWakeUpLists removes matching references from old lists whose type values are4/5, clears old list pointers and reconstructs pickup/drop lists from current target geometry. It falls back to alarm when targets are absent and aborts/throws if all3slots are used. Inserter::onStackSpoiled handles only its actual held stack and sets bit9 according to whether its new identity is nonempty.

**Exact body evidence:** `1007fc1c4` C24–263 (1007fc650/1007fc6d8/1007fc76c: wakeable push1003817f8, 1007fc5c0/1007fc79c: alarm1004c64c8, 1007fc7d8: logging1000f1948); `1007fddd4` C5–10 (1007fddec..1007fde20: held identity and flag update); `1007f8850` C14–48 (drop target geometry refresh); `1007f8960` C13–41 (pickup target geometry refresh).

**Limits:** List type values4/5 are not assigned original enum names; bit9 does not alone prove the complete drop-mode transition consumer. Alarm/virtual target callbacks unreviewed.

### NLH-08: Temperature is derived from a stored double, not integer energy

HeatBuffer::getTemperature computes stored value at0x60 divided by prototype coefficient0x88 plus baseline0x80. setTemperature bounds the temperature to baseline0x80 and ceiling0x70 and stores coefficient*(boundedTemperature-baseline). transferEnergy adds no more than remaining capacity0x78. setAvailableEnergy stores the input clamped to0..capacity; it does not add the reserve used by getAvailableEnergy.

**Exact body evidence:** `1001e8af4` C7–9 (1001e8af4..1001e8b08: floating temperature); `10029a590` C8–16 (10029a598: ldp d2,d3 baseline/coefficient, 10029a5b4: str d0,[x0,#0x60]); `10029a42c` C10–21 (10029a42c..10029a45c: floating capacity/add); `10029bccc` C5–11 (10029bcd8: fmaxnm, 10029bce4: str d0).

**Limits:** Generated C wrongly models some energy fields as long with casts; LDR/STR d and arithmetic prove floating storage. Named field mapping is structural inference without prototype loader read; set/getAvailableEnergy are not assumed mathematical inverses.

### NLH-09: Usable heat has a reserve and a per-call extraction cap; full requests fail atomically

HeatBuffer available energy is max(E-reserve0xb0,0). extractEnergy returns and spends min(request,available,cap0x90). extractEnergyIfAvailable spends only when that bounded amount covers the request and is nonzero, otherwise leaves E unchanged. HeatEnergySource accesses the buffer through source+0x18 and repeats that extraction rule. hasEnergyPotentially compares actual derived temperature strictly above prototype0xa8.

**Exact body evidence:** `10029bc88` C8–13 (10029bc94/10029bc9c: fsub/fmaxnm); `10029bcec` C9–25 (10029bd10: cap load, 10029bd28..10029bd30: subtract/store/result); `10029bd38` C9–24 (10029bd74..10029bd84: conditional store); `1005fce08` C10–27 (1005fce30: cap load, 1005fce4c: conditional store); `1005fcf68` C9–23 (1005fcfa4: boolean result w0 despite void C signature, 1005fcfb4: guarded store); `1005fcfbc` C8–14 (buffer surplus); `1005fd680` C7–10 (1005fd698..1005fd6a0: strict temperature comparison).

**Limits:** No NaN/negative-input contract is claimed. Original names/units for offsets are inferred from helpers plus API; no loader-derived rate conversion or global per-tick sum proof.

### NLH-10: Heat transfer is constrained equalization with separate consumer reserves

transferEnergyTo bounds positive transfer by donor raw E, receiver headroom, requested amount and donor cap0x90 before paired addition/subtraction. transferTo compares prototype identity; same-prototype transfer takes0.2*(Esource-Ereceiver-gradient0xa0) when positive, while different prototypes use both0x88coefficients and0x80baselines then divide the excess by2.5. Both paths also respect donor E, recipient capacity and donor rate. These transfers do not read consumer reserve0xb0.

**Exact body evidence:** `10029a460` C8–22 (10029a49c..10029a4ac: paired receiver/source mutations); `10029a4b4` C12–50 (10029a4c4..10029a510: different-prototype arithmetic, 10029a51c..10029a548: same-prototype coefficient, 10029a578..10029a588: paired stores).

**Limits:** 0.2/2.5 are observed native constants, not YAIR balance recommendations. Full physical conservation/float error and global ordering are untested.

### NLH-11: Heat scheduling guards recursion and keeps smoothed display separate from usable energy

HeatBuffer::update compares the low8bits of the supplied tick to a visited byte, marks before recursion, visits a colder neighbor first and then transfers to it. It accumulates stored E as float and every tick whose low5bits are0 writes accumulator/32 and clears it. The vector overload also appends the visited buffer index. HeatEnergySource::calculateAvailableEnergyToExtract caps only by surplus, without reading rate0x90; later extraction is stricter. Electric extraction has partial-clamped and full-conditional variants.

**Exact body evidence:** `10029b984` C11–32 (10029b99c/10029b9a8: lowbyte guard/mark, 10029ba00/10029ba0c: recursion/transfer, 10029ba1c..10029ba4c: float aggregate); `10029ba64` C7–13 (10029ba78..10029ba90:32boundary average/reset); `10029ba98` C21–88 (vector append, allocation guards, recursion/transfer); `1005fd074` C9–18 (1005fd074..1005fd098: surplus-only preflight; no0x90read); `1005df238` C8–12 (electric preflight); `1005df250` C9–16 (1005df25c: fmax d3,d2,0, 1005df268: str d3 clamped result); `1005df350` C5–9 (1005df35c: failed conditional request skips store).

**Limits:** The32boundary output is accumulator/32, not proof of32actual samples if caller skips updates. Ghidra C for electric extract omits the fmax store source; instruction evidence wins. HeatEnergySource conditional C signature says void but arm64 sets w0 boolean. Electric zero request can succeed while heat zero request fails. No full heat/freezing simulation coverage.

## Installed source and API joins

All12 selected snapshot files were hashed again. Known installed-review hashes matched; the three module info files each declare2.0.77. Exact source intervals and JSON pointers are in findings. No experimental2.1.21comparison is used. Base, Space Age and Quality data being present does not establish activation or entitlement.

| Consumer | Exact stable2.0.77 evidence | Native connection and limit |
|---|---|---|
| Belt insertion | Base `transport-belts.lua149–184`, speed at180; `LuaTransportLine.can_insert_at_back`, `insert_at`, `insert_at_back`, optional `belt_stack_size` | Spatial admission/boolean return and real item construction agree structurally; API wrapper bodies and complete throughput remain unread. |
| Inserter custody and modes | Base `entities.lua5487–5520`; Space Age `entities.lua2521–2561`; `LuaEntity.held_stack`, `inserter_spoil_priority`, `inserter_target_pickup_count` | Item/quality matching, receiver preflight and real held transfer are distinct. Stack inserter declares bonus4, stack4, partial-grab, wait-full and spoiled-held exception; native flag consumers are only partly traced. Prototype `hand_size` is explicitly graphical, not inventory capacity. |
| Perishables and Quality | Space Age `item.lua791–822`; Quality `quality.lua1–58`; runtime `SpoilPriority` | Nutrients5*minute and mash3*minute produce spoilage. Quality identities1/2/3/5 remain different; no quality generation or complete deadline-transfer behavior proved by these pickup methods. |
| Heat buffers and useful heat | Base `entities.lua8647–8659`, `9045–9059`, `9427–9438`; Space Age `entities.lua2138–2148`; API `HeatBuffer`/`HeatEnergySource` | Reactor10MJ, pipe1MJ, heating tower5MJ; exchanger working500 and2GW transfer are separate fields. Mapping named fields to prototype offsets is inferred until loader recovery; native capacity/rate/reserve/temperature formulas are directly supported. |
| Environmental support | Space Age `base-data-updates.lua85–130`, stack-inserter heating at2558, Aquilo `planet.lua599–633,660–673` with heating flag at668; API `EntityPrototype.heating_energy` | Cold-environment operating cost is a prototype layer distinct from heat stored/consumed. Freeze engine/threshold and heating network consumer remain unread. |

## Original YAIR use

Current dirty source was read at `factorio_retort_content.js24–26,40–44,58–97`, `factorio_retort_facts.js9–41`, and selected host validation bounds. Hashes are retained as a dated source observation. The original discrete retort reserves sap, one fuel log, stamina and both physical empty trays for one finite batch; collection clears each receiver separately. Current predicates recheck actual owned stock, rack/bench/body and local support. Shared registry/clock/publisher/build integration belongs to the parent and leased integrator. This leaf changed none of it.

The native review supports keeping receiver capacity, physical custody, useful support, scheduling and actual spend separate. Complete tray reservation is deliberately stricter than native `canInsert`, which only finds an opportunity. Refunds before settlement, one-minute disposal, resin/residue fiction and3-minute batches are original authored proposals; native running heat is not paused or refunded by the helpers reviewed here. Current retort does not simulate conveyors, heat buffers, progressive fuel burn, spoil deadlines or copied Factorio balance.

Four useful future directions, still proposals: retain full receiver reservation for accepted batch work; show concrete receiver/support block reasons; separate perishable selection policy from custody/deadline; separate heat storage/reserve/rate/temperature/display if a warm process is authored. These belong in existing one-inventory/body/played-clock/durable-publisher owners, without touching vanilla or adding prestige.

## Remaining acceptance boundary

This packet closes its bounded static semantic review. Callee/virtual/loader gaps are explicitly listed in findings; arbitrary imported data xrefs are not called vtables or observed calls. There is no all-native/all-DLC/all-callee/type/comment/buildable-project claim. x86_64 cross-check, full export, wider mechanics and original playable implementation acceptance remain parent objectives. Native/game execution, browser/unit/save/failure/regression suites were not run; current project deferral remains in force. The selected retort source is not gameplay verification. Writer ownership of both leaf directories is released on delivery.
