// The spellbook's physical cases, for HP_CASE_SCENES. The source locators are
// owned by HP_SPELL_ROWS. All accounts, magnitudes, grip/attachment labels,
// destinations and resolved target/output details are authored calibration.
// Localized condition loss represents the break itself at this resolution.
const at = id => ({shape: 'holder', id});
const room = id => ({id, kind: 'place'});
const changed = (holder, property, to) => ({holder, property, direction: 'changed', to});
const moved = (holder, to) => ({holder, position: true, direction: 'changed', to});
const created = holder => ({holder, exists: true, direction: 'changed', to: true});

function loss(seen, place, id, kind, quantity, before, amount) {
    const target = {id, kind, quantities: {[quantity]: before}};
    const holders = kind === 'place' ? [target] : [room(place), {...target, place}];
    return {seen, holders, details: {target: at(id), quantity, amount},
        expect: [{holder: id, quantity, direction: 'down', amount, to: before - amount}]};
}

function treatment(seen, place, before, delta) {
    return {seen, holders: [room(place), {id: 'patient', kind: 'body', place, quantities: {vitality: before}}],
        details: {target: at('patient'), delta},
        expect: [{holder: 'patient', quantity: 'vitality', direction: 'up', amount: delta, to: before + delta}]};
}

export const HP_PRIMITIVE_SCENES = Object.freeze({
    relash: {
        seen: 'the cuffs release their grip',
        holders: [room('vault'), {id: 'cuffs', kind: 'thing', place: 'vault',
            properties: {marks: ['fastened:prisoner', 'maker-mark']}}],
        details: {target: at('cuffs'), mark: 'fastened:prisoner'},
        expect: [changed('cuffs', 'marks', ['maker-mark'])],
    },
    disarm: {
        seen: 'the duellist loses his grip on the wand, which leaves his reach',
        holders: [room('duelling-platform'), room('beyond-reach'),
            {id: 'duellist', kind: 'body', place: 'duelling-platform'},
            {id: 'wand', kind: 'thing', place: 'duelling-platform', properties: {marks: ['grip:duellist', 'maker-mark']}}],
        details: {target: at('wand'), mark: 'grip:duellist', to: 'beyond-reach'},
        expect: [changed('wand', 'marks', ['maker-mark']), moved('wand', 'beyond-reach')],
    },
    sever: loss('the struck ice cracks open', 'frozen-pool', 'ice-seam', 'thing', 'condition', 35, 35),
    duro: {
        seen: 'the tapestry becomes hard stone before the pursuers collide with it',
        holders: [room('stairwell'),
            {id: 'tapestry', kind: 'thing', place: 'stairwell', properties: {material: 'cloth', hardness: 8}}],
        details: {target: at('tapestry'), properties: {material: 'stone', hardness: 80}},
        expect: [changed('tapestry', 'material', 'stone'), changed('tapestry', 'hardness', 80)],
    },
    duplicate: {
        seen: 'a replacement with the original object’s appearance is produced',
        holders: [room('copy-site'),
            {id: 'original', kind: 'thing', place: 'copy-site', properties: {form: 'locket'}}],
        details: {target: at('copy-site'), from: 'original', create: {id: 'replacement', kind: 'thing'}},
        expect: [created('replacement'),
            changed('replacement', 'form', 'locket'), moved('replacement', 'copy-site')],
    },
    defodio: loss('ceiling rock is gouged out of the escape passage', 'escape-passage', 'escape-passage', 'place', 'stock:ceiling-rock', 60, 20),
    deprimo: loss('the struck patch of flooring breaks through', 'upper-floor', 'upper-floor', 'place', 'condition', 40, 40),
    reducto: loss('the struck shelving collapses under the volley', 'shelf-room', 'shelves', 'thing', 'condition', 50, 50),
    blasting: loss('the struck mirror shatters', 'mirror-room', 'mirror', 'thing', 'condition', 30, 30),
    expulso: loss('the struck café table blows apart', 'cafe', 'table', 'thing', 'condition', 45, 45),
    clean: loss('feathers and droppings are removed from the cage', 'bedroom', 'cage', 'thing', 'residue:cage-litter', 12, 12),
    wipe: loss('dust disappears from the photographs', 'house', 'photographs', 'thing', 'residue:dust', 7, 7),
    // The source implies local repair. It gives neither the final appearance
    // nor the magnitude, so this probe records an authored partial recovery.
    episkey: treatment('the injured lip receives treatment and the player returns to practice', 'pitch', 9, 2),
    flowers: {
        seen: 'a bouquet appears at the caster’s wand',
        holders: [room('weighing-room'), {id: 'wand', kind: 'thing', place: 'weighing-room'}],
        details: {target: at('wand'), create: {id: 'bouquet', kind: 'thing', properties: {form: 'bouquet'}}},
        expect: [created('bouquet'), moved('bouquet', 'weighing-room'), changed('bouquet', 'form', 'bouquet')],
    },
    ferula: {
        seen: 'bandages and a splint appear around the injured leg',
        holders: [room('shrieking-shack'), {id: 'patient', kind: 'body', place: 'shrieking-shack', quantities: {vitality: 9}}],
        details: {target: at('patient'), create: {id: 'splint-dressing', kind: 'thing',
            properties: {form: 'bandages-and-splint', marks: ['applied:patient:leg']}}},
        expect: [created('splint-dressing'), moved('splint-dressing', 'shrieking-shack'), changed('splint-dressing', 'form', 'bandages-and-splint'),
            changed('splint-dressing', 'marks', ['applied:patient:leg']),
            {holder: 'patient', quantity: 'vitality', direction: 'unchanged'}],
    },
    // The record shows repeated passes. This models the net treatment, with no
    // invented duration, words or per-minute recovery schedule.
    'wound-countercurse': treatment('bleeding eases and the cuts start to close over repeated passes', 'bathroom', 6, 4),
});
