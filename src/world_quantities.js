// World substrate vocabulary v1 (chat W, SB2). Packs import names from here so
// two domains that touch "humidity" or "energy:primeval.rank1" mean the same
// unit and bounds. An entry is shared when two chats read or write it (PFP5);
// `askedBy` records who, from the phase-1 checkpoints. Anything one chat alone
// uses stays in that chat's pack. Units are authored game units, not physics.
//
// Keyed quantities are families: the holder carries `family:key` (energy by
// kind, stock by good, light by kind), and the family fixes unit and bounds.
const q = (id, unit, min, max, askedBy, keyed = false) => Object.freeze({id, unit, min, max, keyed, askedBy: Object.freeze(askedBy)});
const BIG = 1_000_000_000;

export const WORLD_QUANTITIES = Object.freeze({
    // Air, warmth, light and sound of a place (and the things in it).
    humidity: q('humidity', 'percent', 0, 100, ['L', 'B', 'F']),
    temperature: q('temperature', 'degree', -273, 10000, ['B', 'F', 'L', 'C']),
    light: q('light', 'light grade', 0, 100, ['L', 'G', 'C', 'S'], true),          // light:sun, light:moon, light:star, light:lamp
    noise: q('noise', 'loudness grade', 0, 100, ['G', 'C', 'L']),
    scent: q('scent', 'scent grade', 0, 100, ['L', 'C'], true),                     // scent:blood, scent:smoke
    cover: q('cover', 'percent', 0, 100, ['C', 'G']),
    // Bodies and things.
    vitality: q('vitality', 'vitality', 0, BIG, ['L', 'C', 'S']),
    condition: q('condition', 'percent', 0, 100, ['F', 'B']),                      // wear of a tool, vessel or part
    residue: q('residue', 'trace unit', 0, BIG, ['L', 'B'], true),                  // residue:<substance> in tissue, soil, a vessel
    // Accounts that workings spend (K costs draw from these, C's W3).
    energy: q('energy', 'energy unit', 0, BIG, ['G', 'S', 'C', 'F', 'R'], true),   // energy:primeval.rank1, energy:spirituality, energy:mana, energy:stamina
    // Goods and wants (scarcity is read from these, never stored: readScarcity).
    stock: q('stock', 'good unit', 0, BIG, ['M', 'A', 'L', 'F', 'G'], true),        // stock:bread, stock:fuel, stock:liquor
    want: q('want', 'good unit per day', 0, BIG, ['M', 'A'], true),                 // want:bread on a household or a body
    // Sky (OS6).
    daylight: q('daylight', 'flag', 0, 1, ['G', 'L', 'B', 'S']),
    moon_phase: q('moon_phase', 'eighth', 0, 7, ['B', 'G', 'S']),
    rain: q('rain', 'flag', 0, 1, ['L', 'C', 'F']),
    day: q('day', 'day', 0, BIG, ['B', 'S', 'R']),
    season: q('season', 'quarter', 0, 3, ['B', 'M', 'L']),                         // 0 spring to 3 winter, where the calendar has seasons
});

const p = (id, type, askedBy, extra = {}) => Object.freeze({id, type, ...extra, askedBy: Object.freeze(askedBy)});

// Properties: what a thing is, read by laws instead of categories (PFP22). A
// cauldron reads `temperature`; a fire reads `flammable`; nothing reads "is a Gu".
export const WORLD_PROPERTIES = Object.freeze({
    alive: p('alive', 'flag', ['L', 'G', 'C']),
    material: p('material', 'label', ['F', 'B']),                                  // world catalogue id: iron, oak, glass
    aspects: p('aspects', 'set', ['G', 'S', 'B']),                                 // moon, fire, star, blood: moon-aspected and the like
    flammable: p('flammable', 'flag', ['F', 'B', 'C']),
    ignites_at: p('ignites_at', 'level', ['F', 'B'], {min: -273, max: 10000}),     // degrees
    hardness: p('hardness', 'level', ['F', 'C'], {min: 0, max: 100}),
    senses: p('senses', 'set', ['G', 'C', 'L', 'S']),                              // channels a body senses with: sight, hearing, smell, spirit
    concealed: p('concealed', 'set', ['G', 'C', 'S']),                             // channels a holder is hidden from
    marks: p('marks', 'set', ['G', 'S', 'R']),                                     // what a holder is bound to: a mark, a pact, a dao imprint
    form: p('form', 'label', ['B', 'S', 'L']),                                     // the shape a body wears (Polyjuice copies it)
});

// Effect kinds two chats publish and answer (W-B8). A pack names the kinds it
// publishes in `publishes` and the ones it answers from other packs in `hears`,
// taking them from here, so a misspelled kind is refused at composition instead
// of reaching no reactor. A kind one pack both publishes and answers stays in it.
const k = (id, askedBy) => Object.freeze({id, askedBy: Object.freeze(askedBy)});
export const WORLD_EFFECT_KINDS = Object.freeze({
    smoke: k('smoke', ['B', 'L', 'F']),
    heat_released: k('heat.released', ['B', 'F', 'L']),
    vapor_released: k('vapor.released', ['B', 'L']),
    water_poured: k('water.poured', ['B', 'L']),
    noise_made: k('noise.made', ['C', 'G', 'L']),
    scent_left: k('scent.left', ['C', 'L']),
    light_given: k('light.given', ['G', 'L']),
    blow_landed: k('blow.landed', ['C', 'L']),
    body_down: k('body.down', ['C', 'L']),
    delivery_made: k('delivery.made', ['M', 'L']),
});
export const effectKind = name => WORLD_EFFECT_KINDS[name]?.id;

export const sharedQuantities = names => names.map(n => WORLD_QUANTITIES[n.split(':')[0]]);
export const sharedProperties = names => names.map(n => WORLD_PROPERTIES[n]);
