// Original proposal packs (AD32, PFP3). Temperatures are authored degree units,
// time is minutes, structure uses a thousand-part whole. No real alloy calibration.
// Zero shares mean absent structure; zero scalar targets mean complete drying.
const whole = 1000; // A thousand-part whole makes structure and projection weights readable.
const low = -100, high = 2000; // These band ends bracket this pack's apparatus temperatures.

export const steelPack = {
    id: 'original.workshop', revision: 1, // First fixture revision freezes these dials in method data.
    piece: {kind: 'piece', id: 'sample', properties: {thermalMass: 1}, // A thin sample responds quickly to contact.
        temperature: 20, shares: {soft: whole, hot: 0, hard: 0, tempered: 0}, // Room-cold, untreated stock.
        scalars: {grain: 10}}, // Coarse starting grain gives mechanical work something to refine.
    rows: [
        // Above 750, each starting structure approaches the hot structure in 0.15 minutes.
        ...['soft', 'hard', 'tempered'].map(from => ({id: `heat-${from}`, band: {min: 750, max: high},
            from, to: 'hot', tauMinutes: 0.15, cause: 'Sustained high heat replaces the earlier structure.'})),
        // Minutes in the middle band let the hot structure relax before it can harden.
        {id: 'soften', band: {min: 350, max: 750}, from: 'hot', to: 'soft', tauMinutes: 2,
            cause: 'Time in the middle band lets the hot structure soften.'},
        // A hundredth-minute tau approximates the rapid low-temperature structure change.
        {id: 'harden', band: {min: low, max: 350}, from: 'hot', to: 'hard', tauMinutes: 0.01,
            cause: 'The remaining hot structure hardens below the low band edge.'},
        // A twenty-minute tau gives low-oven residence a measurable toughness trade.
        {id: 'temper', band: {min: 150, max: 350}, from: 'hard', to: 'tempered', tauMinutes: 20,
            cause: 'Gentle heat relaxes the hard structure into a tougher structure.'},
        // Very hot soaking coarsens grain toward 20 over ten minutes.
        {id: 'coarsen', band: {min: 1000, max: high}, scalar: 'grain', toward: 20, tauMinutes: 10,
            cause: 'Very hot residence lets grain grow.'},
        // Full-impact blows approach grain 1 in four minutes; weaker blows take longer.
        {id: 'refine', band: {min: 750, max: 1000}, scalar: 'grain', toward: 1, tauMinutes: 4, driveBy: 'impact',
            cause: 'Delivered impacts break up coarse grain while the piece is workable.'},
    ],
    projection: {
        // Hard structure carries a hard edge; relaxed structure trades edge hardness for toughness.
        hardness: {shares: {soft: 30 / whole, hot: 10 / whole, hard: 100 / whole, tempered: 75 / whole}, base: 0},
        // Each grain unit costs one toughness unit, representing coarse fracture paths.
        toughness: {shares: {soft: 55 / whole, hot: 5 / whole, hard: 15 / whole, tempered: 90 / whole}, scalars: {grain: -1}, base: 0},
    },
    media: {
        forge: {kind: 'medium', id: 'forge', properties: {temperature: 950, exchange: 1}}, // Hot enough to work, below coarsening.
        water: {kind: 'medium', id: 'water', properties: {temperature: 20, exchange: 12}}, // Strong contact crosses the softening band quickly.
        oil: {kind: 'medium', id: 'oil', properties: {temperature: 20, exchange: 0.8}}, // Slower cooling permits more softening.
        air: {kind: 'medium', id: 'air', properties: {temperature: 20, exchange: 0.08}}, // Sparse contact makes air cooling much slower.
        oven: {kind: 'medium', id: 'oven', properties: {temperature: 250, exchange: 12}}, // A strongly circulated low oven stays in the tempering band.
        veryHot: {kind: 'medium', id: 'very-hot', properties: {temperature: 1200, exchange: 1}}, // Overheating reaches the coarsening band.
    },
    tools: {
        hammer: {kind: 'tool', id: 'hammer', properties: {impact: whole}}, // Reference delivered work per minute.
        stone: {kind: 'tool', id: 'stone', properties: {impact: 250}}, // Quarter-impact substitute takes four times the work time.
    },
    steps: {
        heat: {op: 'hold', medium: 'forge', minutes: 5}, // Five minutes nearly equilibrates a thin piece.
        forge: {op: 'work', medium: 'forge', tool: 'hammer', minutes: 8}, // Two grain-relaxation times under reference impacts.
        quench: {op: 'hold', medium: 'water', minutes: 3}, // Contact lasts beyond the rapid structure change.
        temper: {op: 'hold', medium: 'oven', minutes: 40}, // About two tempering relaxation times.
        oil: {op: 'hold', medium: 'oil', minutes: 12}, // Slower contact gets enough time to cool through the low band.
        air: {op: 'hold', medium: 'air', minutes: 100}, // Long air exposure provides a route without a liquid medium.
    },
};

export const kitchenPack = {
    id: 'original.kitchen', revision: 1, // Independent pack using the same exposure operations.
    piece: {kind: 'piece', id: 'meal', properties: {thermalMass: 1}, // Small portion warms quickly.
        temperature: 20, shares: {raw: whole, cooked: 0, charred: 0}, scalars: {moisture: 100}}, // Fresh, room-temperature portion.
    rows: [
        // Heat above 60 cooks with an eight-minute relaxation time, including excessive heat.
        {id: 'cook', band: {min: 60, max: high}, from: 'raw', to: 'cooked', tauMinutes: 8,
            cause: 'Warm residence changes the raw interior.'},
        // Above 180, cooked structure chars in three minutes.
        {id: 'char', band: {min: 180, max: high}, from: 'cooked', to: 'charred', tauMinutes: 3,
            cause: 'Excess heat chars the cooked portion.'},
        // Warm exposure dries toward zero with a twenty-five-minute relaxation time.
        {id: 'dry', band: {min: 60, max: high}, scalar: 'moisture', toward: 0, tauMinutes: 25,
            cause: 'Warm contact drives moisture from the portion.'},
    ],
    // Cooked share raises nourishment; charred share lowers it; moisture contributes a little juiciness.
    projection: {nourishment: {shares: {raw: 10 / whole, cooked: 100 / whole, charred: -20 / whole}, base: 20},
        juiciness: {scalars: {moisture: 1}, base: 0}},
    media: {
        oven: {kind: 'medium', id: 'kitchen-oven', properties: {temperature: 160, exchange: 0.5}}, // Moderate baking avoids the charring band.
        scorch: {kind: 'medium', id: 'scorch', properties: {temperature: 260, exchange: 0.5}}, // An overheated oven crosses into charring.
    },
    tools: {},
    steps: {
        bake: {op: 'hold', medium: 'oven', minutes: 30}, // Several cooking relaxation times cook most of the portion.
        scorch: {op: 'hold', medium: 'scorch', minutes: 20}, // Sustained excessive heat destroys most cooked structure.
    },
};

// The same physical test for every submitted thing: force bends, shock fractures.
export const loadPack = {
    load: {force: 40, shock: 50}, // A moderate steady demand with a sharp impact distinguishes brittle samples.
    thresholds: {force: {property: 'hardness', perUnit: 1}, shock: {property: 'toughness', perUnit: 1}}, // Unit-scaled capacities make the fixture inspectable.
    plainThing: {properties: {hardness: 65, toughness: 70}}, // Unprocessed material with sufficient capacities holds the stated load.
};

// Mechanism probes use neutral quantities so row-order and admission behavior
// can be tested independently of either craft pack's illustrative calibration.
export const exposureProbe = {
    id: 'original.exposure-probe', revision: 1, // First saved probe method revision.
    piece: {kind: 'piece', id: 'probe', properties: {thermalMass: 1}, temperature: 0,
        shares: {a: 100, b: 0, c: 0}, scalars: {x: 10, gate: 0}}, // One conserved pool with two initially absent destinations.
    media: {contact: {kind: 'medium', id: 'contact', properties: {temperature: 100, exchange: 1, helper: 0}}}, // Unit-rate warming crosses 50 at log(2) minutes.
    tools: {driver: {kind: 'tool', id: 'driver', properties: {effort: 0}}}, // A tool that contributes no measured drive still binds.
    rows: [
        {id: 'to-b', band: {min: 0, max: 100}, from: 'a', to: 'b', tauMinutes: 1,
            cause: 'Contact moves the available structure along the first route.'}, // Reference depletion rate.
        {id: 'to-c', band: {min: 0, max: 100}, from: 'a', to: 'c', tauMinutes: 2,
            cause: 'The slower route competes for the same structure.'}, // Half-rate competing route.
        {id: 'needs-contact', band: {min: 0, max: 100}, from: 'a', to: 'c', tauMinutes: 1,
            needs: {medium: {helper: 1}}, cause: 'A carried helper assists the contact route.'}, // One helper unit activates the row.
        {id: 'needs-structure', band: {min: 0, max: 100}, from: 'b', to: 'c', tauMinutes: 1,
            needs: {shares: {b: 1000}}, cause: 'Existing changed structure starts a later route.'}, // More than the whole pool, so this route stays shut in the probe.
        {id: 'needs-scalar', band: {min: 0, max: 100}, scalar: 'x', toward: 0, tauMinutes: 1,
            needs: {scalars: {gate: 1}}, cause: 'The local state supports this drift.'}, // A unit of the scalar gate activates the row.
        {id: 'driven', band: {min: 0, max: 100}, scalar: 'x', toward: 0, tauMinutes: 1, driveBy: 'effort',
            cause: 'Delivered tool effort changes the scalar.'}, // Zero effort records a cause without moving state.
    ],
    projection: {total: {shares: {a: 1, b: 1, c: 1}, base: 0}}, // Unit weights expose the conserved total.
    step: {op: 'work', medium: 'contact', tool: 'driver', minutes: 2}, // A two-minute exposure is long enough to measure competition.
    bandRow: {id: 'band', band: {min: 0, max: 50}, from: 'a', to: 'b', tauMinutes: 1,
        cause: 'The change stops above the contact band.'}, // The crossing supplies an analytic residence check.
};
