// Pure current support and frozen-job checks. No save IO or native publication.
import {check} from './basics.js';
import {STEAM_ONI_IDS as I, STEAM_ONI_KEYS as K, steamONIDefinitions as D} from './steam_oni_content.js';
import {statusCareSupportedBody, statusCareCondition} from './status_care_facts.js';
export const steamONINatural = n => Number.isSafeInteger(n) && n >= 0;
export const steamONIRecord = v => v != null && typeof v === 'object' && !Array.isArray(v);
export function sameSteamONIData(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => sameSteamONIData(v, b[n]));
    return steamONIRecord(a) && steamONIRecord(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameSteamONIData(a[k], b[k]));
}
const definition = id => D.commands.find(d => d.id === id);
export function steamONITrayPresent(state) {
    const player = state.actors?.player, site = state.simulation?.sites?.[I.site];
    return player?.facts?.[I.built] === true && player.completed?.[I.build] === 1 &&
        steamONIRecord(site) && site.owner === 'player' && site.capacity === 1 && steamONIRecord(site.reservations);
}
export function steamONISupport(state, context = {}) {
    const s = state.simulation, player = state.actors?.player;
    const location = context.facts?.location || s?.people?.player?.location;
    const vitals = context.vitalsByActor?.player || context.vitals?.player || (context.vitals?.health != null ? context.vitals : null);
    const stock = context.gameplay?.player?.inventory, frame = context.nativeCareFrame;
    const native = steamONIRecord(stock) && Object.values(stock).every(steamONINatural) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const body = statusCareSupportedBody(state, context);
    const supported = (context.actorId || 'player') === 'player' && player?.worldId === I.world && location === 'Shack' && native && body && vitals.health > 1 &&
        context.facts?.['village.shackUnlocked'] === true && frame?.underRoof === true &&
        steamONINatural(frame?.clock) && frame.clock <= state.clock && steamONINatural(frame?.calendarMinute) && frame.battleRunning === false &&
        !state.realmPrototype?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null && !s?.sessions?.player;
    const handsUsable = body && !['body.sore_hands', 'body.scraped_hands'].some(k => statusCareCondition(state, k));
    const owns = (name, count = 1) => native && (stock[K[name]] || 0) >= count &&
        !Object.values(s?.custody || {}).some(c => c.holder === 'player' && c.key === K[name]) &&
        !Object.values(context.equipment?.player || s?.equipment?.player || {}).includes(K[name]);
    return {supported, handsUsable, owns};
}
export function validSteamONIWork(state, job) {
    const d = definition(job?.commandId), w = job?.steamONIWork;
    return !!d?.duration && steamONIRecord(w) && sameSteamONIData(Object.keys(w).sort(), ['acceptedAt', 'schema', 'trayVersion']) &&
        w.schema === 1 && w.trayVersion === I.version && steamONINatural(w.acceptedAt) && w.acceptedAt <= state.clock &&
        job.due === w.acceptedAt + d.duration && sameSteamONIData(job.costs, d.costs) && sameSteamONIData(job.effects, d.effects);
}
export function guardSteamONIAdmission(state, d, context = {}) {
    if (d?.group !== I.group) return;
    check(sameSteamONIData(d, definition(d.id)), 'Choose a nursery action from your current Shack controls.');
    check(context.steamONIHost === true && context.actorId === 'player' && (context.targetId || null) === null, 'Use your current nursery controls.');
    const support = steamONISupport(state, context);
    check(support.supported && support.handsUsable, 'Return beneath the Shack roof with recovered hands before nursery work.');
    if (d.id !== I.begin) check(state.actors.player.facts[I.enrolled] === true, 'Consider the nursery plan first.');
    if (d.id === I.build) check(!steamONITrayPresent(state) && support.owns('log', 2), 'The tray needs two owned logs, and you can build it only once.');
    if (d.id === I.cycle) check(steamONITrayPresent(state) && support.owns('herbs') && support.owns('sap'), 'Use your completed tray with both an owned Cooking herbs bundle and Tree sap.');
}
export function stampSteamONIAcceptedJob(state, job, context = {}) {
    const d = definition(job.commandId);
    if (!d?.duration) return;
    check(context.steamONIHost === true && job.actorId === 'player' && job.targetId == null, 'Nursery work needs its current admitted plan.');
    job.steamONIWork = {schema: 1, acceptedAt: state.clock, trayVersion: I.version};
    check(validSteamONIWork(state, job), 'The nursery job differs from the work you set aside.');
}
export function steamONICompletionContext(state, job, context = {}) {
    if (!definition(job?.commandId)?.duration) return context;
    return {...context, steamONIWork: job, facts: {...context.facts, 'steamONI.workCurrent': validSteamONIWork(state, job)}};
}
