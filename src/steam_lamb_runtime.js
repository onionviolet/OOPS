// Pure admission and accepted-work views. No executor, host or save IO.
import {check} from './basics.js';
import {STEAM_LAMB_IDS as I, STEAM_LAMB_KEYS as K, steamLambDefinitions as D} from './steam_lamb_content.js';
import {featureObjectDefinitions as O} from './feature_expansion_objects.js';
import {statusCareSupportedBody, statusCareCondition} from './status_care_facts.js';
export const steamLambNatural = n => Number.isSafeInteger(n) && n >= 0;
export const steamLambRecord = v => v != null && typeof v === 'object' && !Array.isArray(v);
export function sameSteamLambData(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => sameSteamLambData(v, b[n]));
    return steamLambRecord(a) && steamLambRecord(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameSteamLambData(a[k], b[k]));
}
export const steamLambCauseSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
const definition = id => D.commands.find(d => d.id === id);
const completed = (state, id) => state.actors?.player?.completed?.[id] === 1;
function exactPriorKnowledge(state, id, actor, key) {
    const e = O.commands.find(d => d.id === id)?.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === key);
    const k = state.simulation?.knowledge?.[actor]?.[key], seq = steamLambCauseSequence(k?.cause);
    return !!e && steamLambRecord(k) && sameSteamLambData(Object.keys(k).sort(), ['at', 'basis', 'cause', 'stage', 'value']) &&
        k.stage === e.stage && k.value === e.value && sameSteamLambData(k.basis, e.basis) && steamLambNatural(k.at) && k.at <= state.clock &&
        steamLambNatural(seq) && seq > 0 && seq <= state.sequence ? k : null;
}
export function steamLambQualified(state) {
    if (!completed(state, I.observe) || !completed(state, I.learn)) return false;
    const seen = exactPriorKnowledge(state, I.observe, 'player', 'feature_objects.alignment');
    const demonstrated = exactPriorKnowledge(state, I.observe, I.owner, 'feature_objects.demonstration');
    const learned = exactPriorKnowledge(state, I.learn, 'player', 'feature_objects.method');
    return !!seen && !!demonstrated && !!learned && seen.at === demonstrated.at && seen.cause === demonstrated.cause &&
        learned.at >= seen.at + 3 && steamLambCauseSequence(learned.cause) > steamLambCauseSequence(seen.cause);
}
export const steamLambOffice = state => state.actors?.[I.owner]?.facts?.[I.office] === true && completed(state, I.appoint) && !completed(state, I.end);
export const steamLambInspectionDone = state => completed(state, I.inspectFine) || completed(state, I.inspectFineDull);
export const steamLambApproval = state => state.actors?.player?.facts?.[I.approval] === true && steamLambInspectionDone(state) && !completed(state, I.deliver);
export const steamLambInspectionAvailable = state => !steamLambInspectionDone(state) && state.actors?.player?.facts?.[I.approval] == null && !completed(state, I.deliver);
export const steamLambUnappointed = state => !completed(state, I.appoint) && state.actors?.[I.owner]?.facts?.[I.office] == null && !completed(state, I.end);
export function steamLambSupport(state, context = {}) {
    const s = state.simulation, player = state.actors?.player, person = s?.people?.[I.owner], eda = state.actors?.[I.owner];
    const location = context.facts?.location || s?.people?.player?.location;
    const vitals = context.vitalsByActor?.player || context.vitals?.player || (context.vitals?.health != null ? context.vitals : null);
    const stock = context.gameplay?.player?.inventory, frame = context.nativeCareFrame;
    const native = steamLambRecord(stock) && Object.values(stock).every(steamLambNatural) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const body = statusCareSupportedBody(state, context);
    const supported = (context.actorId || 'player') === 'player' && player?.worldId === I.world && location === 'Village' && native && body && vitals.health > 1 &&
        steamLambNatural(frame?.clock) && frame.clock <= state.clock && steamLambNatural(frame?.calendarMinute) && frame.battleRunning === false &&
        !state.realmPrototype?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null && !s?.sessions?.player;
    const usable = actor => !['body.sore_hands', 'body.scraped_hands'].some(k => statusCareCondition(state, k, actor));
    const handsUsable = body && usable('player');
    const source = eda?.sources?.[I.method], faculty = s?.faculties?.[I.owner]?.[I.method];
    const trained = source?.origin === 'trained' && (source.expiresAt == null || source.expiresAt > state.clock) &&
        faculty?.awakened === true && faculty.active === true && faculty.suppressed === false && s?.powers?.[I.owner]?.[I.method]?.owned === true;
    const ownerSupported = !!person && person.definitionId === I.owner && person.inventory === 'simulation' && person.life === 'alive' &&
        eda?.worldId === I.world && person.location === location && person.body?.hands >= 2 && person.vitals?.health > 1 && usable(I.owner) &&
        eda.facts?.['feature_objects.willing'] === true && trained && steamLambRecord(s?.owners?.[I.owner]);
    const bench = s?.sites?.[I.site];
    const benchSupported = player?.facts?.['feature_objects.introduced'] === true && !!bench && bench.owner === I.owner && bench.capacity === 1 && steamLambRecord(bench.reservations);
    const custody = Object.values(s?.custody || {}), equipment = actor => Object.values(context.equipment?.[actor] || s?.equipment?.[actor] || {});
    const ownMatched = native && (stock[K.matched] || 0) >= 1 && !custody.some(c => c.holder === 'player' && c.key === K.matched) && !equipment('player').includes(K.matched);
    const guide = name => (s?.owners?.[I.owner]?.[K[name]] || 0) >= 1 && steamLambNatural(s.owners[I.owner][K[name]]) &&
        !custody.some(c => (c.holder === I.owner || c.owner === I.owner) && [K.fine, K.fineDull].includes(c.key)) && !equipment(I.owner).includes(K[name]);
    return {supported, handsUsable, ownerSupported, benchSupported, ownMatched, guide,
        purseReady: Number.isFinite(eda?.resources?.coins) && eda.resources.coins >= 3};
}
export function validSteamLambWork(state, job) {
    const d = definition(job?.commandId), w = job?.steamLambWork;
    return !!d?.duration && steamLambRecord(w) && sameSteamLambData(Object.keys(w).sort(), ['acceptedAt', 'agreementVersion', 'guideVariant', 'schema']) &&
        w.schema === 1 && w.agreementVersion === I.version && w.guideVariant === (job.commandId === I.inspectFine ? 'fine' : job.commandId === I.inspectFineDull ? 'fineDull' : null) &&
        steamLambNatural(w.acceptedAt) && w.acceptedAt <= state.clock && job.due === w.acceptedAt + d.duration &&
        job.revision === d.revision && job.actorId === 'player' && job.targetId === I.owner && job.siteId === I.site &&
        sameSteamLambData(job.costs, d.costs) && sameSteamLambData(job.effects, d.effects) && sameSteamLambData(job.participants, ['player', I.owner]) &&
        sameSteamLambData(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: true, location: 'Village', failure: 'refund'});
}
export const steamLambWorkCurrent = (state, job) => validSteamLambWork(state, job) && state.simulation?.sites?.[I.site]?.reservations?.[job.id] === 'player';
export function guardSteamLambAdmission(state, d, context = {}) {
    if (d?.group !== I.group) return;
    check(sameSteamLambData(d, definition(d.id)), 'Choose an action from the current fitting agreement.');
    check(context.steamLambHost === true && context.actorId === 'player' && (context.targetId || null) === (d.targetId || null), 'Use your current fitting agreement controls.');
    const support = steamLambSupport(state, context);
    check(support.supported, 'Return to the Village with your living body before changing the fitting agreement.');
    if (d.id === I.end) {check(steamLambOffice(state), 'This fitting agreement is already ended or unmade.'); return;}
    check(support.handsUsable && support.ownerSupported && support.benchSupported && steamLambQualified(state), 'Eda needs your completed demonstration and practice, her consent, body, trained method and actual bench.');
    if (d.id === I.appoint) check(steamLambUnappointed(state), 'The fitting appointment can be agreed only once.');
    else check(steamLambOffice(state), 'Eda no longer holds the fitting appointment.');
    if ([I.inspectFine, I.inspectFineDull].includes(d.id)) check(steamLambInspectionAvailable(state) && support.ownMatched && support.guide(d.id === I.inspectFine ? 'fine' : 'fineDull'), 'Reserve your own matched stave and Eda’s own available guide for the one inspection.');
    if (d.id === I.deliver) check(steamLambApproval(state) && support.ownMatched && support.purseReady, 'The unsettled approved order needs one owned matched stave and three real Eda coins.');
}
export function stampSteamLambAcceptedJob(state, job, context = {}) {
    const d = definition(job.commandId);
    if (!d?.duration) return;
    check(context.steamLambHost === true && job.actorId === 'player' && job.targetId === I.owner, 'Fitting work needs its currently admitted agreement.');
    job.steamLambWork = {schema: 1, acceptedAt: state.clock, agreementVersion: I.version,
        guideVariant: d.id === I.inspectFine ? 'fine' : d.id === I.inspectFineDull ? 'fineDull' : null};
    check(validSteamLambWork(state, job), 'The fitting job differs from the exact work and items set aside.');
}
export function steamLambCompletionContext(state, job, context = {}) {
    if (!definition(job?.commandId)?.duration) return context;
    return {...context, steamLambWork: job, facts: {...context.facts, 'steamLamb.workCurrent': steamLambWorkCurrent(state, job)}};
}
