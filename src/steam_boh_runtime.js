// Pure admission/frozen-work helpers. No executor, native publisher or save IO.
import {check} from './basics.js';
import {STEAM_BOH_IDS as I, STEAM_BOH_KEYS as K, steamBOHDefinitions as D} from './steam_boh_content.js';
import {statusCareSupportedBody, statusCareCondition} from './status_care_facts.js';

export const steamBOHNatural = n => Number.isSafeInteger(n) && n >= 0;
export const steamBOHRecord = v => v != null && typeof v === 'object' && !Array.isArray(v);
export function sameSteamBOHData(a, b) {
    if (a === b) return true;
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, n) => sameSteamBOHData(v, b[n]));
    return steamBOHRecord(a) && steamBOHRecord(b) && Object.keys(a).length === Object.keys(b).length && Object.keys(a).every(k => Object.hasOwn(b, k) && sameSteamBOHData(a[k], b[k]));
}
const definition = id => D.commands.find(d => d.id === id);
export function steamBOHSupport(state, context = {}) {
    const s = state.simulation, player = state.actors?.player, p = s?.people?.[I.owner], eda = state.actors?.[I.owner];
    const location = context.facts?.location || s?.people?.player?.location;
    const vitals = context.vitalsByActor?.player || context.vitals?.player || (context.vitals?.health != null ? context.vitals : null);
    const stock = context.gameplay?.player?.inventory, frame = context.nativeCareFrame;
    const native = steamBOHRecord(stock) && Object.values(stock).every(steamBOHNatural) && !!vitals &&
        ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(vitals[k]) && vitals[k] >= 0) &&
        vitals.health <= vitals.max_health && vitals.stamina <= vitals.max_stamina;
    const body = statusCareSupportedBody(state, context);
    const supported = (context.actorId || 'player') === 'player' && player?.worldId === I.world && location === 'Village' && native && body && vitals.health > 1 &&
        steamBOHNatural(frame?.clock) && frame.clock <= state.clock && steamBOHNatural(frame?.calendarMinute) && frame.battleRunning === false &&
        !state.realmPrototype?.activeVisitId && !state.chronicle?.session && state.chronicle?.life?.endedAt == null && !s?.sessions?.player;
    const handsUsable = body && !['body.sore_hands', 'body.scraped_hands'].some(k => statusCareCondition(state, k));
    const source = eda?.sources?.[I.authorMethod], faculty = s?.faculties?.[I.owner]?.[I.authorMethod];
    const trained = !!source && (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true && faculty.active === true &&
        faculty.suppressed !== true && s?.powers?.[I.owner]?.[I.authorMethod]?.owned === true;
    const authorSupported = !!p && p.definitionId === I.owner && p.inventory === 'simulation' && p.life === 'alive' && eda?.worldId === I.world &&
        p.location === location && p.body?.hands >= 2 && p.vitals?.health > 1 && eda.facts?.['feature_objects.willing'] === true && trained && steamBOHRecord(s?.owners?.[I.owner]);
    const bench = s?.sites?.[I.site];
    const benchSupported = player?.facts?.['feature_objects.introduced'] === true && !!bench && bench.owner === I.owner && bench.capacity === 1 && steamBOHRecord(bench.reservations);
    const owns = name => native && (stock[K[name]] || 0) >= 1 &&
        !Object.values(s?.custody || {}).some(c => c.holder === 'player' && c.key === K[name]) &&
        !Object.values(context.equipment?.player || s?.equipment?.player || {}).includes(K[name]);
    return {supported, handsUsable, authorSupported, benchSupported, owns};
}
export function steamBOHLearned(state) {
    const f = state.actors?.player?.facts, k = state.simulation?.knowledge?.player?.[`${I.prefix}procedure`];
    return f?.[I.procedure] === I.version && k?.stage === 'understood' && k.value === definition(I.read).effects.find(e => e.type === 'knowledge').value &&
        state.actors.player.completed?.[I.read] === 1;
}
export function validSteamBOHWork(state, job) {
    const d = definition(job?.commandId), w = job?.steamBOHWork;
    return !!d?.duration && steamBOHRecord(w) && sameSteamBOHData(Object.keys(w), ['schema', 'acceptedAt', 'manualVersion']) &&
        w.schema === 1 && w.manualVersion === I.version && steamBOHNatural(w.acceptedAt) && w.acceptedAt <= state.clock &&
        job.due === w.acceptedAt + d.duration && sameSteamBOHData(job.costs, d.costs) && sameSteamBOHData(job.effects, d.effects);
}
export function guardSteamBOHAdmission(state, d, context = {}) {
    if (d?.group !== I.group) return;
    check(sameSteamBOHData(d, definition(d.id)), 'Choose a clearance action from the current bench controls.');
    check(context.steamBOHHost === true && context.actorId === 'player' && (context.targetId || null) === (d.targetId || null), 'Use the current clearance-manual controls.');
    const support = steamBOHSupport(state, context);
    check(support.supported && (d.id === I.rest || support.handsUsable && support.benchSupported), 'Return to the Village and recover before this clearance work. Bench work also needs usable hands and access to Eda’s bench.');
    if (d.targetId) check(support.authorSupported, 'Eda lost her current consent, body or trained fitting method.');
    if (d.id !== I.begin) check(state.actors.player.facts[I.enrolled] === true, 'Ask Eda about the clearance manual first.');
    if (![I.begin, I.copy, I.rest].includes(d.id)) check(support.owns('manual'), 'Bring your own clearance manual, put it away from equipment and return any borrowed copy first.');
    if ([I.trial, I.compare, I.guided].includes(d.id)) check(support.owns('sound'), 'Reserve an actual owned Sound repair stave sample.');
    if (d.id.startsWith(`${I.prefix}kits_`)) check(steamBOHLearned(state) && support.owns(d.id.endsWith('_fine') ? 'fine' : 'sharp'), 'Learn the clearance-check method and bring your own sharp fitting knife.');
}
// Called by the normal scheduler after admission/cost reservation, before enqueue.
export function stampSteamBOHAcceptedJob(state, job, context = {}) {
    const d = definition(job.commandId);
    if (!d?.duration) return;
    check(context.steamBOHHost === true && job.actorId === 'player' && (job.targetId || null) === (d.targetId || null), 'Clearance work needs its admitted host quote.');
    job.steamBOHWork = {schema: 1, acceptedAt: state.clock, manualVersion: I.version};
    check(validSteamBOHWork(state, job), 'The clearance job differs from the actual accepted work.');
}
export function steamBOHCompletionContext(state, job, context = {}) {
    if (!definition(job?.commandId)?.duration) return context;
    return {...context, steamBOHWork: job, facts: {...context.facts, 'steamBOH.workCurrent': validSteamBOHWork(state, job)}};
}
