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
