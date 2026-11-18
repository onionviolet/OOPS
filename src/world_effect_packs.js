// The effect-pack manifest (PSA24, proposal): the one list of what the effect grammars, the derived
// LOTM formulas and the substrate packs that are not in the engine's registry bring to a played life.
// A pack here is definitions only (AR3): no state, tick or UI. `world_packs/effects_workshop.js` is its
// caller and `capability_runs_domain.js` registers that run, so `main.js` gains no line (AR1).
//
// Two kinds of seam, on purpose. Plain-data world packs go through `world_pack_registry.js` and
// `world_pack_manifest.js`; an effect grammar or a substrate pack is code with parameters (a brew's
// constituents, a world's law), so it joins an engine world as an own pack (E11) or is read by a caller.
import {createBrewCloudPack, createBrewVaporPack} from './world_substrate_packs/brew_vapor.js';
import {createBrewSplashPack} from './world_substrate_packs/brew_splash.js';
import {createGuAperturePack} from './world_substrate_packs/gu_aperture.js';
import {createLayeredProtectionPack} from './world_substrate_packs/layered_protection.js';
import {BREATHING_PACK} from './world_substrate_packs/breathing.js';
import {FIENDFYRE_PACK} from './world_substrate_packs/fiendfyre.js';
import {SPELL_SUSTAIN_PACK} from './world_substrate_packs/spell_sustain.js';
import {CREATURE_FORM_PACK} from './creature_evolution.js';
import {BREW_PUBLISHES} from './brew_law.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from './world_quantities.js';
import {HP_POTION_EFFECTS, HP_POTION_SENTENCES, LOTM_POTION_EFFECTS, assemblePotionEffect, lotmPathwaySentences} from './world_packs/brew_effects_pack.js';
import {guEffects, labelGuEffect} from './world_packs/gu_effect_pack.js';
import {HP_KEYS, hpEffects, labelHpEffect} from './world_packs/hp_effect_pack.js';
import {LOTM_PATHWAYS, derivedBrewRow} from './lotm_derived_formulas.js';
import {coverageCase as lotmDerivedCase} from './world_packs/lotm_derived_cases.js';
import {fitCostCurve, knowledgeFrom, searchEffectsForGoal, worldLaws} from './effect_checks.js';
import {searchForActor} from './kernel_search.js';
import {fitGrammar} from './procedural_grammar.js';
import {guCatalogue} from './gu_catalogue.js';

export {HP_KEYS, lotmDerivedCase, searchForActor};

// Grammars by world: the grammar, how a row of that world is read as parts, and a sample row to read.
export const EFFECT_GRAMMARS = Object.freeze({
    'hp.potion': Object.freeze({grammar: HP_POTION_EFFECTS, sentences: HP_POTION_SENTENCES}),
    'lotm.potion': Object.freeze({grammar: LOTM_POTION_EFFECTS}),
    gu: Object.freeze({grammar: guEffects, read: id => labelGuEffect({parts: guCatalogue[id]?.parts}).parts}),
    hp: Object.freeze({grammar: hpEffects, read: lead => labelHpEffect({lead, family: ''}).parts}),
});
export {assemblePotionEffect};

// Ask the Gu grammar for an effect (PM3): what an actor who has seen a few Gu can say they want. The
// canon is the catalogue read through the Gu labeller; every part's world word is its own name until a
// world writes better ones (default, dial: the `words` table).
export function guEffectSearch(goal, seen = ['stealth-scales', 'moonlight', 'earth-communication-ear-grass', 'white-jade', 'vitality-leaf']) {
    const canon = Object.entries(guCatalogue).map(([id, v]) => ({id: `gu:${id}`, parts: labelGuEffect({parts: v.parts}).parts})).filter(r => r.parts);
    const fitted = fitGrammar(guEffects, canon);
    const parts = canon.map(c => c.parts);
    const words = {};
    for (const p of parts) for (const [slot, value] of Object.entries(p)) if (typeof value === 'string') (words[slot] ??= {})[value] = value;
    const knows = knowledgeFrom(canon.filter(c => seen.includes(c.id.slice(3))).map(c => c.parts));
    delete knows.target; delete knows.time;
    return searchEffectsForGoal(fitted, goal, {actor: {knows, owns: {carrier: ['gu'], cost: ['essence-primeval']}},
        world: {laws: worldLaws(parts), curve: fitCostCurve(canon), words, forbid: []}, answers: 3});
}

// A derived LOTM formula as a brew row and the two sentences its law gives it (power, hazard).
export function derivedFormula(pathway = LOTM_PATHWAYS[0], seq = 9) {
    const row = derivedBrewRow(pathway, seq);
    return {row, sentences: lotmPathwaySentences(row)};
}

// Substrate packs a world opts into. `create` takes the world's own law values (PFP3).
export const SUBSTRATE_OWN_PACKS = Object.freeze({
    vapor: settings => createBrewVaporPack(settings),
    cloud: settings => createBrewCloudPack(settings),
    splash: settings => createBrewSplashPack(settings),
    aperture: law => createGuAperturePack(law),
    protection: () => createLayeredProtectionPack(),
    breathing: () => BREATHING_PACK,
    fiendfyre: () => FIENDFYRE_PACK,
    sustain: () => SPELL_SUSTAIN_PACK,
    form: () => CREATURE_FORM_PACK,
});

// Shared vocabulary every one of these packs reads or writes.
export const EFFECT_SHARED = Object.freeze({quantities: Object.values(WORLD_QUANTITIES),
    properties: Object.values(WORLD_PROPERTIES), effectKinds: BREW_PUBLISHES});

export const EFFECT_PACK_IDS = Object.freeze(['b.vapor', 'b.splash', 'g.aperture', 'c.layered_protection', 'l.breathing',
    'hp.fiendfyre', 's.focus', 'l.creature_form']);
