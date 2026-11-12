// Potion effects as effect-grammar sentences (chat B, grammar layer GL2; P's
// effect grammar src/effect_grammar.js, PGC13-PGC18). Two worlds (EF1):
// Hogwarts potions labelled from the evidence observations, and Lord of the
// Mysteries from the aid preparations' recorded use and the brew law's dose.
// Labels are a model reading of paraphrased evidence (SKR3 layer: model-read),
// each with its evidence id. World words for carriers, costs and limits are
// this pack's; verbs, objects, targets and times are P's shared primitives.
import {defineEffectGrammar, assembleEffect, lowerEffect} from '../effect_grammar.js';

export const HP_POTION_EFFECTS = defineEffectGrammar({
    world: 'book.hp.brewing',
    carriers: {potion: ['ingredients'], topical: ['ingredients'], spray: ['ingredients'], eaten: ['ingredients']},
    limits: ['dose', 'duration', 'donor-sample', 'blood-loss-remains', 'excess-harms', 'painful', 'counter-effect', 'mass'],
});
export const LOTM_POTION_EFFECTS = defineEffectGrammar({
    world: 'book.lotm.brewing',
    carriers: {potion: ['characteristic', 'ingredients'], scent: ['ingredients'], bath: ['ingredients']},
    limits: ['dose', 'digestion', 'loss-of-control', 'excess-harms', 'acting'],
});

const s = (verb, object, target, time, carrier, cost, limits = []) => ({verb, object, target, time, carrier, cost, limits});

// Hogwarts: subject (evidence subject), the potion ledger title it answers to,
// the evidence id and the sentence. Primary effect only; side effects are rows of their own.
export const HP_POTION_SENTENCES = Object.freeze([
    ['polyjuice_potion', 'Polyjuice Potion', 'HPPE108', s('transform', 'form', 'self', 'lasting', 'potion', 'ingredients', ['donor-sample', 'duration'])],
    ['draught_of_living_death', 'Draught of Living Death', 'HPPE012', s('transform', 'mind', 'self', 'lasting', 'potion', 'ingredients', ['dose'])],
    ['cure_for_boils', 'Cure for Boils', 'HPPE111', s('add', 'vitality', 'self', 'instant', 'potion', 'ingredients')],
    ['swelling_solution', 'Swelling Solution', 'HPPE024', s('transform', 'form', 'touched', 'lasting', 'topical', 'ingredients')],
    ['deflating_draught', 'Deflating Draught', 'HPPE025', s('transform', 'form', 'self', 'instant', 'potion', 'ingredients', ['counter-effect'])],
    ['mandrake_restorative_draught', 'Mandrake Restorative Draught', 'HPPE027', s('release', 'form', 'self', 'instant', 'potion', 'ingredients', ['counter-effect'])],
    ['shrinking_solution', 'Shrinking Solution', 'HPPE034', s('transform', 'form', 'touched', 'lasting', 'potion', 'ingredients')],
    ['wolfsbane_potion', 'Wolfsbane Potion', 'HPPE036', s('block', 'mind', 'self', 'sustained', 'potion', 'ingredients', ['dose', 'duration'])],
    ['draught_of_peace', 'Draught of Peace', 'HPPE039', s('transform', 'mind', 'self', 'lasting', 'potion', 'ingredients', ['excess-harms'])],
    ['murtlap_essence', 'Murtlap Essence', 'HPPE054', s('add', 'vitality', 'touched', 'instant', 'topical', 'ingredients')],
    ['skele_gro', 'Skele-Gro', 'HPPE057', s('transform', 'form', 'self', 'lasting', 'potion', 'ingredients', ['painful'])],
    ['blood_replenishing_potion', 'Blood-Replenishing Potion', 'HPPE058', s('add', 'vitality', 'self', 'instant', 'potion', 'ingredients', ['dose'])],
    ['pepperup_potion', 'Pepperup Potion', 'HPPE059', s('add', 'vitality', 'self', 'instant', 'potion', 'ingredients')],
    ['doxycide', 'Doxycide', 'HPPE060', s('remove', 'vitality', 'touched', 'instant', 'spray', 'ingredients')],
    ['calming_draught', 'Calming Draught', 'HPPE061', s('transform', 'mind', 'self', 'lasting', 'potion', 'ingredients')],
    ['sleekeazys_hair_potion', "Sleekeazy's Hair Potion", 'HPPE062', s('transform', 'form', 'self', 'lasting', 'topical', 'ingredients', ['dose'])],
    ['felix_felicis', 'Felix Felicis', 'HPPE064', s('alter', 'law', 'self', 'lasting', 'potion', 'ingredients', ['duration', 'excess-harms'])],
    ['veritaserum', 'Veritaserum', 'HPPE066', s('transform', 'mind', 'self', 'sustained', 'potion', 'ingredients', ['dose'])],
    ['wit_sharpening_potion', 'Wit-Sharpening Potion', 'HPPE110', s('transform', 'mind', 'self', 'lasting', 'potion', 'ingredients')],
    ['dr_ubblys_oblivious_unction', "Dr Ubbly's Oblivious Unction", 'HPPE121', s('add', 'vitality', 'touched', 'lasting', 'topical', 'ingredients', ['dose'])],
    ['dreamless_sleep_potion', 'Potion for Dreamless Sleep', 'HPPE132', s('transform', 'mind', 'self', 'sustained', 'potion', 'ingredients', ['dose'])],
    ['sleeping_draught', 'Sleeping Draught', 'HPPE135', s('transform', 'mind', 'self', 'sustained', 'eaten', 'ingredients')],
    ['dragon_dung_fertiliser', 'Dragon dung fertiliser', 'HPPE124', s('add', 'vitality', 'touched', 'lasting', 'topical', 'ingredients')],
].map(([subject, title, evidence, parts]) => Object.freeze({id: `hp.effect.${subject}`, subject, title, evidence, parts: Object.freeze(parts)})));

// LOTM: the six aid preparations, labelled from their recorded use.
export const LOTM_AID_SENTENCES = Object.freeze([
    ['amanda-distillate', 'Amanda distillate', s('transform', 'mind', 'area', 'sustained', 'scent', 'ingredients')],
    ['eye-of-spirit', 'Eye of Spirit', s('transform', 'mind', 'area', 'sustained', 'scent', 'ingredients')],
    ['ritual-oil-bath', 'Ritual oil bath', s('transform', 'mind', 'self', 'sustained', 'bath', 'ingredients')],
    ['craggy-oil', 'Craggy oil', s('transform', 'mind', 'self', 'instant', 'scent', 'ingredients')],
    ['folk-herbal-remedy', 'Folk herbal remedy', s('add', 'vitality', 'self', 'lasting', 'potion', 'ingredients', ['dose'])],
    ['calm-potion', 'Calm potion', s('transform', 'mind', 'self', 'sustained', 'potion', 'ingredients')],
].map(([id, title, parts]) => Object.freeze({id: `lotm.effect.aid.${id}`, title, evidence: `lotm.aid.${id}`, parts: Object.freeze(parts)})));

/** A pathway potion as two sentences from the brew law: the bound charge binds
 * the Sequence's characteristic to the drinker (R digests it), and unbound
 * charge reaches the mind as the hazard. Generated by construction from the
 * law, so not part of the held-out test. */
export function lotmPathwaySentences(row) {
    return [
        {id: `lotm.effect.${row.id}.power`, title: row.name, parts: s('bind', 'thing', 'self', 'lasting', 'potion', 'characteristic', ['digestion', 'acting'])},
        {id: `lotm.effect.${row.id}.hazard`, title: row.name, parts: s('transform', 'mind', 'self', 'delayed', 'potion', 'characteristic', ['excess-harms', 'loss-of-control'])},
    ];
}

// What each title-only family predicts about a sentence (the comparison the
// labels never read). A family names a mechanism owner; here it implies the
// object a potion's sentence should act on, or the verb for verb-led families.
export const FAMILY_PREDICTS = Object.freeze({
    'body-door': {objects: ['vitality']}, 'mind-state': {objects: ['mind']}, 'body-form': {objects: ['form']},
    'plant-or-creature-target': {objects: ['vitality'], targets: ['touched', 'bound', 'area']}, 'object-surface': {objects: ['thing']},
    'conceal-or-sense': {verbs: ['conceal', 'sense']}, 'place-release': {verbs: ['release']}, 'protection-field': {verbs: ['block']},
    'luck-field': {verbs: ['alter'], objects: ['law']},
});

export function predictionHolds(family, parts) {
    const p = FAMILY_PREDICTS[family];
    if (!p) return null;
    return (!p.objects || p.objects.includes(parts.object)) && (!p.verbs || p.verbs.includes(parts.verb))
        && (!p.targets || p.targets.includes(parts.target));
}

export function assemblePotionEffect(grammar, parts) {
    const result = assembleEffect(grammar, parts);
    return {...result, lowered: lowerEffect(parts)};
}
