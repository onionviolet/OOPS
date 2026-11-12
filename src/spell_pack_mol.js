// Mother of Learning world pack for the spell grammar (chat S, MC9 second consumer).
// Canon from the author's chapters: Torch and direct shaping (ch 2), Magic
// Missile and the reduced-output trial (ch 46). Draw sizes and durations in play
// are authored (mol_light_research.js); the grammar carries only what the source
// fixes. The low-angle light is an original variant and is not a canon row.
const truth = text => { const [verb, object, target, time, direction = null] = text.split(' '); return Object.freeze({verb, object, target, time, direction}); };

export const MOL_SPELL_WORLD = Object.freeze({world: 'cyoria', carrier: 'attuned_mana', cost: 'mana', access: 'studied',
    costSource: {account: 'mana', word: 'mana', recovers: 'ambient mana over hours'}});

export const MOL_SPELL_ROWS = Object.freeze([
    Object.freeze({id: 'mol.torch', family: 'light', forms: ['Torch invocation'], roots: [], intent: 'light', target: 'place', execution: 'timed',
        delivery: 'formula', gesture: 'unrecorded', locator: 'MoL ch 2', truth: truth('add light place timed')}),
    Object.freeze({id: 'mol.direct_light', family: 'light', forms: ['Direct light shaping'], roots: [], intent: 'light', target: 'place', execution: 'timed',
        delivery: 'direct', gesture: 'none', locator: 'MoL ch 2', truth: truth('add light place timed')}),
    Object.freeze({id: 'mol.magic_missile', family: 'force', forms: ['Magic Missile'], roots: [], intent: 'hurt', target: 'creature', execution: 'instant',
        delivery: 'formula', gesture: 'unrecorded', locator: 'MoL ch 46', truth: truth('remove vitality creature instant')}),
]);
