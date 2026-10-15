# Travel, resources and continuing growth

Official source only. All source claims below are **SHOWN** in [S04, S06-S09, S11-S19, S21-S24](SOURCES.md); design uses are **INFERRED PROPOSALS**.

## T1: The traveler persists while geography changes the problem

`SIS_STATE` and the campaign queues retain the same ship position, fuel, crew, mineral categories, biological cargo, module/drive/jet slots, landers, escorts and acquired state. This is a continuing expedition, not one new avatar per star. `sis.h` declares 16 module slots, 11 drive slots, 8 jet slots and a 12-escort maximum. Those are source design limits, not suitable universal YAIRPG lifetime limits.

Growth comes from useful capabilities and access: more reach/cargo/protection, new modules or lander upgrades, allies and escort designs, known destinations, evidence and devices. Refitting trades available slots and money against the next trip's needs. This inspected carrier progression is not evidence for a generalized individual magic/skill transfer system. YAIRPG must still declare body, source, fuel, method, custody, credential jurisdiction and ally passage per actual edge.

## T2: Quote the route without pretending the map is the route

`hyper.c:MoveSIS` accumulates absolute displacement components, converts to universe coordinates, uses integer square-root distance and subtracts fuel ticks only on the HyperSpace side. Remainders prevent losing all small movements to rounding. This is implementation-specific displacement accounting, not a guarantee that a straight-line estimate prices arbitrary detours exactly.

`planets/pstarmap.c:UpdateFuelRequirement` quotes distance to the cursor, with a small fixed allowance, and gives zero in the alternate-space state. The map also draws fuel reach and known fleet influence. It uses known location/strength for that presentation, not a claim that every actual fleet fact has been revealed. A visible reachable point does not include all landing costs or safe-return guarantees.

`scan.c:getLandingFuelNeeded` computes `min(2 * SurfaceGravity, 3 * FUEL_TANK_SCALE)` in native units and the landing path checks fuel and lander availability. The same destination can therefore be cheap to reach and costly to exploit. **YAIRPG:** UQM-P3 joins a known route estimate, arrival commitment, cargo and return means in a readable desktop view; revalidate before paying.

## T3: Layers change traversal, not only palette

`hyper.c` branches on `ARILOU_SPACE_SIDE`, with QuasiSpace exits mapped to HyperSpace coordinates. Fuel behavior differs across the layer. `gameev.c` opens the natural portal, schedules closure three days later and schedules the next monthly opening on the seventeenth. This is a recurring date rule, not a world reset.

`arilouc.c:ArilouHome` exchanges a carried key into portal-spawner possession. `planets/devices.c` supplies the missing useful consumer: the device succeeds only in HyperSpace with at least ten scaled fuel units, subtracts that cost and starts `PORTAL_COUNTER`. Entering a layer can cost fuel even though moving within it does not follow ordinary HyperSpace fuel consumption. Do not summarize the whole route as free travel.

**YAIRPG:** UQM-P6 extends P14/P05 with explicit connection endpoints, entry/exit policy, body/cargo and a local rule. The nested-world owner already distinguishes layer, world, region, visit and mission. Neither star nor portal implies a new independent universe.

## T4: Local environment changes useful equipment

`lander.c:GetThermalHazardRating` bins temperature; `GetHazardChance` has distinct earthquake, lightning and fire tables; `PlanetSide` reads actual planetary weather/tectonics/temperature. `DeltaLanderCrew` checks the matching shield bit and retains a failure branch. Protection is not universal immunity. Local conditions change risk and the value of preparation.

The landing hold is capped by both per-lander capacity and free flagship storage; an upgrade raises the former. Mineral pickups check capacity and show actual collected amounts, and a full hold has distinct feedback. A counterexample is visible in the default mineral path: `pickupMineralNode` caps the accepted amount to free hold space and returns success; `callPickupForScanType` calls `GenerateDefault_pickupMinerals`, which returns true, and the caller marks the whole node retrieved/disappearing. No remainder quantity is retained in that inspected path. This is a static source finding, not an executed loss test. YAIRPG should conserve remaining native stock rather than inherit that behavior.

**YAIRPG:** source-qualified K28 weather and K9 equipment should affect actual actions. K15 passage and P17 resource claims need real consumers. Never copy UQM crew death or timed loss into ordinary YAIRPG away play.

## T5: Generated initial content and saved changes are different owners

`GenerateDefault_generateOrbital` performs analysis and captures scan seeds around life/mineral generation. `scan.c` tests and sets per-scan retrieval bits; `state.c:GetPlanetInfo/PutPlanetInfo` reads/writes those masks. `save.c:SaveStarInfo` includes them in the campaign. Special GenerateFunctions replace selected default hooks. `genspa.c`, for example, changes shielded presentation/contact and supplies explicit local conditions and alternate discovery text based on campaign state.

A deterministic place can be rebuilt without making its removed contents return. A seed alone cannot encode who owns the returned object, depleted stock, a changed alliance or an observer's memory. **YAIRPG:** UQM-P4 extends P15/P12 with a stable place identity and explicit saved deltas, using native custody and typed effects. Any later generation-revision change needs K33 compatibility; the fact that a seed repeats is insufficient.

## T6: Different buyers make different expeditions useful

Starbase mineral sale removes category amounts and adds `amount * ElementWorth[category]` resource units. Fuel, crew and refit then spend campaign resources. Melnorme instead converts biological data and newly reportable special-world discoveries to credits. Report progress prevents re-selling the same recorded discoveries through that offer path; this is a source-specific unique discovery, not a solo-player ban on future ordinary trades.

Credits buy fuel, technology and information. Technology can change module availability, specific lander state or shield bits. Information can change an actual second encounter. Rescue pricing computes homeward fuel and negotiates stripping actual fittings, with accept/refuse branches. This joins travel, earned kit, scarcity and recovery, but it does not prove every loss state has a safe guaranteed exit.

**YAIRPG:** P02/P18 can preserve distinct materials, currencies, purchasers and actual downstream uses. New candidate UQM-N1 is a bounded expedition refit only where a real carrier already exists; it is not permission to build a general fleet game.

## T7: Politics moves on the campaign clock

`clock.c` queues events by due date and invokes handlers as played days advance or explicit day jumps occur. `gameev.c` changes fleet strength/alliance, mission movement and local availability. Some effects defer if the player is currently at the affected system. This is bespoke authored scheduling with local interruption exceptions, not a simulation of everyone's daily career.

**YAIRPG:** P10/P13 need declared same-boundary order and local/transit/absence policy. UQM crisis deadlines, irreversible faction loss and ending behavior are not automatically accepted YAIRPG rules. K16 continuing life after closure remains owned by YAIRPG, not proven by this source.
