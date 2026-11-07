// OB10 (LARGER_FOUNDATIONS round 4): authority's reach is people, so strength can refuse it. When the landlady's collector waits at the door
// (heat.js collector state), the player may turn him away by force instead of paying. The collector is an ordinary hired man, not a Beyonder.
// The fight is a tempo opener; its result comes back as known acts through heat.recordAct and as a choice the authority makes by dial.
// No end-of-fight hook exists for openers, so the result is read from the fight's own log line (title + result, cause = the session id) on the
// next opener quote, once per fight (the handled ids are the slice `collector_fight@1`). Nothing here runs on the clock: money moves only
// in the read that follows a fight the player chose (OB4), and a read-only or paused host leaves the fight unhandled for the next read.
// Every number is an authored dial with its reason (WPR5/AD49); no source figure exists for any of them.
import {registerTempoOpener} from './tempo_starters.js';
import {registerDomain, domainRegistry} from './domain_registry.js';
import {registerConsequence} from './consequences.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {LOTM_RENT, LOTM_RENT_ID} from './book_world_lotm_duties.js';

export const COLLECTOR_FAMILY = 'collector_fight@1';
export const COLLECTOR_TITLE = 'The landlady\'s collector at the door';
export const COLLECTOR_DIALS = Object.freeze({
    foeHp: {value: 45, why: 'A hired man a little sturdier than the street robber (40): he does this for a living and expects doors to open, but he is no Beyonder.'},
    foeBody: {value: Object.freeze({attack: 6, agility: 5, dexterity: 5, intuition: 5, attack_speed: .8, defense: 2, crit_rate: .05, crit_multiplier: 1.3, attack_count: 1}),
        why: 'An ordinary adult with a collector\'s habit of leaning on people; one point more attack and defense than the robber.'},
    landladyResponse: {value: 'sends_for_police', why: 'An ordinary landlady with a violated door and a man hurt in her pay reports it; a different woman might let it lie or send heavier men. The next step is hers.'},
    policeWeight: {value: 1.5, why: 'One known assault gives the police your name (level 1 at 1.0) and a second inside the month reaches wanted (4.0 needs more): felt, not instant.'},
    loseSurcharge: {value: 60, why: 'One more week of rent (60 pence) on the fine for the collector\'s trouble: a beating costs the loser, never ruinously.'}
});
// Withdrawing from the fight changes nothing: no blow was reported and the debt stands (a result with no line).
// What an authority does after you beat its collector. Keyed by the dial value; each is the authority's own choice, not a draw.
const RESPONSES = Object.freeze({
    sends_for_police: ({record, at, cause}) => {
        record({authority: 'tingen_police', weight: COLLECTOR_DIALS.policeWeight.value, id: `collector-assault:${cause}`, at, known: true, witness: 'landlady'});
        return 'You drove the collector off. The landlady saw it and has sent for the Tingen police, who now have your name. The arrears still stand.';
    },
    lets_it_lie: () => 'You drove the collector off. The landlady says nothing to the police, for now. The arrears still stand.'
});
export const COLLECTOR_RESPONSES = Object.freeze(Object.keys(RESPONSES));

const fresh = () => ({family: COLLECTOR_FAMILY, handled: [], lines: []});
const HANDLED_CAP = 40, LINES_CAP = 6;
let slice = fresh();
export function migrateCollector(s) {
    if(!s || s.family !== COLLECTOR_FAMILY) return fresh();
    const lines = (Array.isArray(s.lines) ? s.lines : []).filter(l => l && typeof l.id === 'string' && typeof l.text === 'string' && Number.isFinite(l.at)).map(l => ({id: l.id, at: l.at, text: l.text})).slice(-LINES_CAP);
    return {family: COLLECTOR_FAMILY, handled: (Array.isArray(s.handled) ? s.handled : []).filter(x => typeof x === 'string').slice(-HANDLED_CAP), lines};
}
registerDomain({id: 'collector_fight', deps: ['heat', 'duties'], initialState: fresh,
    save: () => slice.handled.length || slice.lines.length ? structuredClone(slice) : undefined,
    validate: s => { if(s != null && s.family !== COLLECTOR_FAMILY) throw Error('Collector fight: wrong family.'); },
    migrate: migrateCollector, load: s => { slice = migrateCollector(s); }, projection: () => structuredClone(slice)});
registerConsequence({id: 'collector.fight', read: () => slice.lines.map(l => ({id: l.id, at: l.at, text: l.text, cause: `collector.fight:${l.id}`, observerSafe: true}))});

const project = id => { try { return domainRegistry.project(id) ?? null; } catch { return null; } };
const cmd = (id, name) => domainRegistry.command(id, name);
const dues = LOTM_RENT[0].dues.amount;
// The collector's state now: the heat projection says whether he waits, the duties projection how many weeks.
function atTheDoor() {
    const step = project('heat')?.steps?.find(s => s.kind === 'collector' && s.authority === 'landlady');
    if(!step) return null;
    const missed = project('duties')?.items?.find(i => i.id === LOTM_RENT_ID)?.missed ?? 0;
    return {step, missed, owed: missed * dues, coins: project('heat')?.coins ?? null};
}

// One fight's outcome, applied once. Returns the line the player reads.
function apply(result, {at, cause}, opts) {
    const record = cmd('heat', 'recordAct');
    if(result === 'won') return RESPONSES[opts.response ?? COLLECTOR_DIALS.landladyResponse.value]?.({record, at, cause}) ?? RESPONSES.sends_for_police({record, at, cause});
    if(result === 'withdrawn') return '';
    const r = cmd('duties', 'settleArrears')({dutyId: LOTM_RENT_ID});
    if(result === 'yielded') {
        if(r.paid) return `You gave in and paid the collector ${r.amount} pence, ${r.missed} ${r.missed === 1 ? 'week' : 'weeks'} of rent. The rent is square.`;
        return r.missed ? `You gave in, but your purse could not cover the ${r.amount} pence. He leaves, and the arrears stand.` : 'You gave in. He finds nothing owed and leaves.';
    }
    if(r.paid) return `He beat you at the door and took the ${r.amount} pence you owed from your purse. The rent is square.`;
    const raised = cmd('heat', 'raiseFine')({authority: 'landlady', dutyId: LOTM_RENT_ID, add: COLLECTOR_DIALS.loseSurcharge.value, at});
    return raised != null ? `He beat you at the door. Your purse could not cover the arrears, so the fine is now ${raised} pence. It waits in Ledger → Owed; nothing more is taken while you are away.`
        : 'He beat you at the door and left the debt standing.';
}
// Read the fight log for finished collector fights not yet handled. Idempotent: a fight's session id is recorded before its effects run, and put back
// if the host cannot take them now. Returns the lines produced this call.
export function resolveCollectorFights(state, opts = {}) {
    const log = state?.simulation?.log, out = [];
    if(!Array.isArray(log)) return out;
    for(const e of log) {
        if(!e || typeof e.cause !== 'string' || typeof e.text !== 'string' || !e.text.startsWith(`${COLLECTOR_TITLE}: `) || slice.handled.includes(e.cause)) continue;
        const result = e.text.slice(COLLECTOR_TITLE.length + 2).replace(/\.$/, '');
        if(!['won', 'lost', 'withdrawn', 'yielded'].includes(result)) continue;
        const before = slice, at = Number.isFinite(e.at) ? e.at : 0;
        slice = {...slice, handled: [...slice.handled, e.cause].slice(-HANDLED_CAP)};
        try {
            const text = apply(result, {at, cause: e.cause}, opts);
            if(text) { const line = {id: `collectorfight:${e.cause}`, at, text}; slice = {...slice, lines: [...slice.lines, line].slice(-LINES_CAP)}; out.push(line); }
        } catch { slice = before; break; }
    }
    return out;
}

export function collectorQuote(state) {
    try { resolveCollectorFights(state); } catch { /* a paused host retries on the next read */ }
    if(state.actors?.player?.worldId !== I.world || !state.lotm) return {visible: false};
    const door = atTheDoor();
    if(!door) return {visible: false};
    if(state.simulation?.sessions?.player) return {visible: true, eligible: false, reason: 'Another encounter is already open.'};
    const lose = door.coins != null && door.coins >= door.owed ? `he takes the ${door.owed} pence from your purse` : 'the fine on you rises';
    return {visible: true, eligible: true, reason: `${door.missed} weeks behind (${door.owed} pence). Win and the landlady may send for the police; the debt stands. Lose and ${lose}. Yield and you pay it.`};
}
export function collectorSpec(state, context, helpers) {
    const {me, vitals, parts, enemyProfile} = helpers, hp = COLLECTOR_DIALS.foeHp.value, id = 'book.lotm.collector';
    return {id: 'lotm-collector', title: COLLECTOR_TITLE, floor: 1, conditions: {place: 'Your lodging door'},
        fighters: [
            {id: 'player', name: 'You', side: 'a', speed: 100, parts, hp: vitals.health, maxHp: vitals.max_health, stamina: vitals.stamina, maxStamina: vitals.max_stamina,
                profile: me, perception: me.stats.intuition ?? 5, stealth: me.stats.agility ?? 5, moves: ['jab', 'swing', 'guard', 'tend', 'withdraw', 'yield']},
            {id, name: 'The collector', side: 'b', speed: 100, hp, maxHp: hp, stamina: 10, maxStamina: 10,
                profile: enemyProfile({...COLLECTOR_DIALS.foeBody.value, health: hp, max_stamina: 10}, 'The collector', id), perception: 5, stealth: 5, goals: {survive: .6, aim: .4}}
        ]};
}
registerTempoOpener({id: 'lotm.collector.door', label: 'Turn the collector away',
    text: 'The landlady\'s collector will not leave without the arrears. Send him off by force, if you can carry what follows.',
    quote: collectorQuote, spec: collectorSpec});
