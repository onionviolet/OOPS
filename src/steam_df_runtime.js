// Pure scheduler/effect hooks. No executor, host, UI, native publisher or save IO.
import {check} from './basics.js';
import {STEAM_DF_IDS as I, steamDFDefinitions as D} from './steam_df_content.js';
import {statusCareSupportedBody, statusCareCondition} from './status_care_facts.js';

export const steamDFNatural = n => Number.isSafeInteger(n) && n >= 0;
export const steamDFRecord = v => v != null && typeof v === 'object' && !Array.isArray(v);
const id = v => typeof v === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
export function sameSteamDFData(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => sameSteamDFData(v, b[n]));
    return steamDFRecord(a) && steamDFRecord(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameSteamDFData(a[k], b[k]));
}
export function decodeSteamDFJSON(value) {
    try {const parsed = JSON.parse(value); return steamDFRecord(parsed) && JSON.stringify(parsed) === value ? parsed : null;} catch {return null;}
}
export const steamDFStockCount = state => state.simulation?.owners?.[I.owner]?.[I.item] ?? 0;
export function steamDFStockWitness(state) {
    const value = state.actors?.[I.owner]?.facts?.[I.witness];
    return value == null ? {revision: 0, at: 0, cause: 'steam.df.stock.origin'} : decodeSteamDFJSON(value);
}
export function validSteamDFWitness(w, clock, {origin = true} = {}) {
    return steamDFRecord(w) && Object.keys(w).length === 3 && steamDFNatural(w.revision) && steamDFNatural(w.at) && w.at <= clock && id(w.cause) &&
        (w.revision > 0 ? w.cause !== 'steam.df.stock.origin' : origin && w.at === 0 && w.cause === 'steam.df.stock.origin');
}
export function recordSteamDFStockMutation(state, beforeCount, cause) {
    const afterCount = steamDFStockCount(state);
    check(steamDFNatural(beforeCount) && steamDFNatural(afterCount), 'Eda stock mutation needs actual nonnegative stave counts.');
    if (beforeCount === afterCount) return false;
    const prior = steamDFStockWitness(state);
    check(state.actors?.[I.owner] && validSteamDFWitness(prior, state.clock) && id(cause) && cause !== 'steam.df.stock.origin' && steamDFNatural(prior.revision + 1), 'Unsupported Eda stock-mutation witness.');
    state.actors[I.owner].facts[I.witness] = JSON.stringify({revision: prior.revision + 1, at: state.clock, cause});
    return true;
}
export function steamDFSupport(state, context = {}) {
    const s = state.simulation, player = state.actors?.player, eda = state.actors?.[I.owner], p = s?.people?.[I.owner];
    const location = context.facts?.location || s?.people?.player?.location;
    const vitals = context.vitalsByActor?.player || context.vitals?.player || (context.vitals?.health != null ? context.vitals : null);
    const stock = context.gameplay?.player?.inventory, frame = context.nativeCareFrame;
    const native = steamDFRecord(stock) && Object.values(stock).every(steamDFNatural) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const hands = statusCareSupportedBody(state, context) && !['body.sore_hands', 'body.scraped_hands'].some(k => statusCareCondition(state, k));
    const supported = (context.actorId || 'player') === 'player' && player?.worldId === I.world && location === 'Village' && native && hands && vitals.health > 1 &&
        steamDFNatural(frame?.clock) && frame.clock <= state.clock && steamDFNatural(frame?.calendarMinute) && frame.battleRunning === false &&
        !state.realmPrototype?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null && !s?.sessions?.player;
    const ownerSupported = !!p && p.definitionId === I.owner && p.inventory === 'simulation' && p.life === 'alive' && eda?.worldId === I.world &&
        p.location === location && p.body?.hands >= 2 && p.vitals?.health > 1 && eda.facts?.['feature_objects.willing'] === true &&
        steamDFRecord(s?.owners?.[I.owner]) && steamDFNatural(steamDFStockCount(state));
    const bench = s?.sites?.[I.site];
    return {supported, ownerSupported, benchSupported: !!bench && bench.owner === I.owner && bench.capacity === 1 && steamDFRecord(bench.reservations)};
}
export function steamDFReportFromSample(sample, precision, sampledCause) {
    const result = {schema: 1, observerId: 'player', ownerId: I.owner, itemKey: I.item, precision,
        sampledAt: sample.sampledAt, sampledCause, witness: structuredClone(sample.witness)};
    if (precision === 'exact') result.amount = sample.amount;
    else {result.lower = Math.floor(sample.amount / 3) * 3; result.upper = Math.min(Number.MAX_SAFE_INTEGER, result.lower + 2);}
    return result;
}
export function legacySteamDFReportText(r) {
    return `Eda's ${r.precision === 'exact' ? 'full count' : 'quick estimate'} of offered Sound repair staves: ${r.precision === 'exact' ? r.amount : `${r.lower}–${r.upper}`} at played minute ${r.sampledAt}. This dated sample is not a promise of unchanged stock.`;
}
export function steamDFReportText(r) {
    return r.precision === 'exact'
        ? `Eda counted ${r.amount} sound stave${r.amount === 1 ? '' : 's'} on her shelf. You wrote the number down before another order could change it.`
        : `"Somewhere between ${r.lower} and ${r.upper} sound staves," Eda reckons. You jot down her estimate. A pair needs a proper count.`;
}
export function steamDFReportTextMatches(r, value) {
    return value === steamDFReportText(r) || value === legacySteamDFReportText(r);
}
export function steamDFReportEffects(sample, definition, sampledCause, {legacy = false} = {}) {
    const receipt = steamDFReportFromSample(sample, definition.steamDFPrecision, sampledCause);
    return [...structuredClone(definition.effects), {type: 'fact', scope: 'actor', actor: 'player', key: I.report, value: JSON.stringify(receipt)},
        {type: 'knowledge', actor: 'player', key: I.report, stage: 'seen', value: legacy ? legacySteamDFReportText(receipt) : steamDFReportText(receipt),
            basis: {kind: 'observation', attributedTo: I.owner, situationId: I.situation}}];
}
export function steamDFCurrentReport(state) {
    const r = decodeSteamDFJSON(state.actors?.player?.facts?.[I.report]);
    const known = state.simulation?.knowledge?.player?.[I.report];
    const current = !!r && !!known && known.cause === r.sampledCause && steamDFReportTextMatches(r, known.value) &&
        sameSteamDFData(r.witness, steamDFStockWitness(state));
    return {report: r, knowledge: known, current, currentPair: current && r.precision === 'exact' && steamDFNatural(r.amount) && r.amount >= 2 &&
        steamDFStockCount(state) === r.amount && steamDFNatural(steamDFStockCount(state))};
}
export function guardSteamDFAdmission(state, definition, context = {}) {
    if (definition?.group !== I.group) return;
    check(context.steamDFHost === true && context.actorId === 'player' && context.targetId === I.owner, 'Use the current offered-stock service controls.');
    const support = steamDFSupport(state, context);
    check(support.supported && support.ownerSupported && support.benchSupported, 'The offered-stock service lost its current body, bench or willing participant.');
    if (definition.id !== I.begin) check(state.actors.player.facts[I.enrolled] === true, 'Ask Eda about offered-stock reports first.');
    if (definition.id === I.buy) check(steamDFCurrentReport(state).currentPair, 'This pair needs a current exact report and two actual offered staves.');
}
export function stampSteamDFAcceptedJob(state, job, context = {}) {
    const d = D.commands.find(d => d.id === job.commandId);
    if (!d?.steamDFPrecision) return;
    guardSteamDFAdmission(state, d, context);
    const sample = {schema: 1, amount: steamDFStockCount(state), sampledAt: state.clock, witness: structuredClone(steamDFStockWitness(state))};
    check(steamDFNatural(sample.amount) && validSteamDFWitness(sample.witness, state.clock), 'The report needs the actual accepted stock sample.');
    job.steamDFSample = sample;
    job.effects = steamDFReportEffects(sample, d, job.id);
}
export function steamDFCompletionContext(state, job, context = {}) {
    if (!D.commands.some(d => d.id === job.commandId && d.steamDFPrecision)) return context;
    const sample = job.steamDFSample;
    const sampleCurrent = !!sample && sample.amount === steamDFStockCount(state) && sameSteamDFData(sample.witness, steamDFStockWitness(state));
    return {...context, steamDFSample: sample, facts: {...context.facts, 'steamDF.sampleCurrent': sampleCurrent}};
}
