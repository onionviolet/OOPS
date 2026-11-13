// Fixture row. Ch. 167 P002-P006, gu-identity-evidence.json (iceblade-storm).
export const icebladeStormBeat = {
    id: 'iceblade-storm',
    revision: 1,
    evidence: {chapter: 167, paragraphs: 'P002-P006', status: 'demonstrated'},
    // The blade forms before the storm grows. Swirl and Fierce Wind activate
    // together. The moving storm attacks, defends and freezes the ground.
    effect: {kind: 'iceblade-storm', attack: true, defense: true, freezesGround: true, moving: true},
    // Authored: one 2-minute deadline, a radius of 3 local units and primeval
    // costs of 2/1/2. The source establishes the three kinds, not these dials.
    minutes: 2,
    scope: {radius: 3},
    participants: [
        {id: 'blade', kind: 'ice-blade', fuel: 'primeval', cost: 2},
        {id: 'swirl', kind: 'swirl', fuel: 'primeval', cost: 1},
        {id: 'wind', kind: 'fierce-wind', fuel: 'primeval', cost: 2},
    ],
};

// Opt-in headless scale. The ground and opponent are bound at the destination
// of one advance. Temperature, harm and guard duration are authored dials.
export const icebladeStormWorldBeat = {
    ...icebladeStormBeat,
    id: 'iceblade-storm-world',
    world: {
        position: 'track_position',
        fuelAccounts: {primeval: 'energy:primeval.rank1'},
        effects: [
            ...['operator', 'blade', 'swirl', 'wind'].map(role =>
                ({verb: 'move', object: 'position', role, details: {}})),
            {verb: 'block', object: 'vitality', role: 'operator', details: {minutes: 3}},
            {verb: 'remove', object: 'vitality', role: 'target', details: {amount: 4}},
            {verb: 'remove', object: 'heat', role: 'place', details: {amount: 10}},
        ],
    },
};

export const icebladeStormRouteBeat = {
    ...icebladeStormWorldBeat,
    id: 'iceblade-storm-route',
    world: {
        ...icebladeStormWorldBeat.world,
        route: {kind: 'storm-track', side: 'contest_side'},
        effects: icebladeStormWorldBeat.world.effects.map(row => ({...row,
            role: row.role === 'target' ? 'foes' : row.role === 'place' ? 'ground' : row.role})),
    },
};
