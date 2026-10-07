import {steamDFContext, commitSteamDFCommand, steamDFPresentation} from './steam_df_host.js';
import {steamBOHContext, commitSteamBOHCommand, steamBOHPresentation} from './steam_boh_host.js';
import {steamONIContext, commitSteamONICommand, steamONIPresentation} from './steam_oni_host.js';
import {steamLambContext, commitSteamLambCommand, steamLambPresentation} from './steam_lamb_host.js';

const hosts = Object.freeze({
    steam_df: {context: steamDFContext, commit: commitSteamDFCommand, presentation: steamDFPresentation},
    steam_boh: {context: steamBOHContext, commit: commitSteamBOHCommand, presentation: steamBOHPresentation},
    steam_oni: {context: steamONIContext, commit: commitSteamONICommand, presentation: steamONIPresentation},
    steam_lamb: {context: steamLambContext, commit: commitSteamLambCommand, presentation: steamLambPresentation},
});

export function steamAbsorptionContext(state, registry, context = {}) {
    return Object.values(hosts).reduce((current, host) => host.context(state, registry, current), context);
}

export function commitSteamAbsorptionCommand(state, registry, command, context, sequence = state.sequence) {
    const host = hosts[command.type];
    if (!host) throw new Error('Choose a current workshop or resident action.');
    return host.commit(state, registry, command, context, sequence);
}

export function steamAbsorptionPresentation(state, registry, context = {}) {
    return {sections: Object.values(hosts).flatMap(host => host.presentation(state, registry, context).sections)};
}
