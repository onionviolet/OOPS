import {steamDFFacts, validateSteamDFState} from './steam_df_facts.js';
import {steamBOHFacts, validateSteamBOHState} from './steam_boh_facts.js';
import {steamONIFacts, validateSteamONIState} from './steam_oni_facts.js';
import {steamLambFacts, validateSteamLambState} from './steam_lamb_facts.js';

export function steamAbsorptionFacts(state, context = {}, registry) {
    return {...steamDFFacts(state, context, registry), ...steamBOHFacts(state, context, registry), ...steamONIFacts(state, context, registry), ...steamLambFacts(state, context, registry)};
}

export function validateSteamAbsorptionState(state, registry) {
    validateSteamDFState(state, registry);
    validateSteamBOHState(state, registry);
    validateSteamONIState(state, registry);
    validateSteamLambState(state, registry);
}
