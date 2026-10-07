// Pure current-owner projection and strict optional-reader checks. No imports
// of simulation.js, native combat, publisher, persistence or UI.
import {REMAINDER_COMBAT_FIT_IDS as I, REMAINDER_COMBAT_FIT_KEYS as K,
    REMAINDER_COMBAT_FIT_PROFILES as P, REMAINDER_GRIP_PREPARATION_LIFETIME,
    remainderCombatFitDefinitions} from './audit_remainder_combat_fit_content.js';

export const combatFitAssert = (ok, message) => {if(!ok) throw new Error(message);};
export const combatFitNatural = n => Number.isSafeInteger(n) && n >= 0;
export const combatFitRecord = v => v != null && typeof v === 'object' && !Array.isArray(v);
export const combatFitSame = (a, b) => {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => combatFitSame(v, b[i]));
    if(!combatFitRecord(a) || !combatFitRecord(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && combatFitSame(a[k], b[k]));
};
const A = combatFitAssert, N = combatFitNatural;
export const remainderCombatFitEnrolled = state => state?.schema === 11 && state.auditRemainder?.schema === 1;
const sequenceOf = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
const definition = id => remainderCombatFitDefinitions.commands.find(d => d.id === id);
const prefix = 'remainder_combat_fit.';
export function remainderCombatFitTermsAccepted(state) {
    const actor = state.actors?.player, r = state.simulation?.knowledge?.player?.[`${prefix}terms`];
    const expected = definition(I.terms).effects.find(e => e.type === 'knowledge');
    return remainderCombatFitEnrolled(state) && actor?.facts?.[`${prefix}terms`] === true && actor.facts[`${prefix}termsRevision`] === 1 &&
        actor.completed?.[I.terms] === 1 && r?.stage === 'understood' && r.value === expected.value;
}
export function remainderCombatFitActiveSource(state, actorId, sourceId, origin = null) {
    const source = state.actors?.[actorId]?.sources?.[sourceId], faculty = state.simulation?.faculties?.[actorId]?.[sourceId];
    return !!source && source.worldId === I.world && (!origin || source.origin === origin) &&
        (source.expiresAt == null || source.expiresAt > state.clock) && faculty?.awakened === true && faculty.active === true && faculty.suppressed !== true;
}
export function remainderCombatFitHandsUsable(state, actorId = 'player') {
    const s = state.simulation, p = s?.people?.[actorId];
    const active = id => {
        const c = s?.conditions?.[actorId]?.[id];
        return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
    };
    // Native player anatomy uses the same implicit two-hands baseline as the
    // existing originalFrontier.playerHandsUsable projection.
    return !!p && p.life === 'alive' && (p.body?.hands ?? 2) >= 2 && !active(I.sore) && !active(I.scraped);
}
const vitalsValid = v => !!v && ['health', 'max_health', 'stamina', 'max_stamina'].every(k => Number.isFinite(v[k]) && v[k] >= 0) &&
    v.max_health > 1 && v.health > 1 && v.health <= v.max_health && v.stamina <= v.max_stamina;
export function remainderCombatFitPlayerSupported(state, context = {}, {work = false} = {}) {
    const s = state.simulation, a = state.actors?.player, p = s?.people?.player;
    const stock = context.gameplay?.player?.inventory;
    return (context.actorId || 'player') === 'player' && a?.worldId === I.world && p?.inventory === 'native' && p.life === 'alive' &&
        p.location === 'Village' && (context.facts?.location || p.location) === 'Village' && context.nativeAlive !== false &&
        combatFitRecord(stock) && Object.values(stock).every(N) && vitalsValid(context.vitals?.player) &&
        !state.realmPrototype?.activeVisitId && state.chronicle?.life?.endedAt == null &&
        (!work || !s.sessions?.player && !state.chronicle?.session);
}
export function remainderCombatFitUnencumbered(state, context, actorId, key, {unequipped = false} = {}) {
    const p = state.simulation?.people?.[actorId];
    const inventory = p?.inventory === 'simulation' ? state.simulation?.owners?.[actorId] : context.gameplay?.[actorId]?.inventory;
    const equipment = p?.inventory === 'native' ? context.equipment?.[actorId] || state.simulation?.equipment?.[actorId] : state.simulation?.equipment?.[actorId];
    return N(inventory?.[key]) && inventory[key] > 0 &&
        !Object.values(state.simulation?.custody || {}).some(c => c.holder === actorId && c.key === key) &&
        (!unequipped || !Object.values(equipment || {}).includes(key));
}
export function remainderCombatFitLioSupported(state) {
    const s = state.simulation, a = state.actors?.player, holder = state.actors?.[I.lio], p = s?.people?.[I.lio];
    return a?.facts?.['party.met'] === true && holder?.facts?.['party.willing'] === true && holder.worldId === I.world && a.worldId === I.world &&
        p?.life === 'alive' && p.location === 'Village' && p.inventory === 'simulation' && p.body?.can_brace === true &&
        remainderCombatFitHandsUsable(state, I.lio) && vitalsValid(p.vitals) &&
        remainderCombatFitActiveSource(state, I.lio, I.guardSource, 'trained') &&
        remainderCombatFitUnencumbered(state, {}, I.lio, K.kit);
}
export function remainderCombatFitCurrentHarness(state, actorId) {
    if(![I.lio, I.shield].includes(actorId)) return null;
    const s = state.simulation, p = s?.people?.[actorId], key = s?.equipment?.[actorId]?.field_frame;
    const profile = Object.values(P).find(v => v.key === key);
    if(!profile || !remainderCombatFitUnencumbered(state, {}, actorId, key) || p?.body?.can_brace !== true ||
        p.life !== 'alive' || p.location !== 'Village' || state.actors?.[actorId]?.worldId !== I.world || !vitalsValid(p.vitals) ||
        !remainderCombatFitHandsUsable(state, actorId) || actorId === I.lio && !remainderCombatFitLioSupported(state)) return null;
    // Fixed tollkeepers keep their authored original apparatus.
    if(actorId === I.shield && profile.id !== 'original') return null;
    return profile;
}
export function remainderCombatFitEarnedGrip(state) {
    return state.actors?.player?.facts?.['body.gripLearned'] === true && state.simulation?.people?.player?.body?.['palms.callused'] === true &&
        remainderCombatFitActiveSource(state, 'player', I.grip, 'trained');
}
export function remainderCombatFitLatestPractice(state) {
    const a = state.actors?.player, r = state.simulation?.knowledge?.player?.[`${prefix}grip_practice`];
    const expected = definition(I.practice).effects.find(e => e.type === 'knowledge');
    const number = a?.completed?.[I.practice], sequence = sequenceOf(r?.cause);
    if(!remainderCombatFitTermsAccepted(state) || !N(number) || number < 1 || !r || r.stage !== expected.stage || r.value !== expected.value ||
        !N(r.at) || r.at > state.clock || !N(sequence) || sequence < 1 || sequence > state.sequence) return null;
    return {cause: r.cause, practiceNumber: number, completedAt: r.at, completedSequence: sequence,
        expiresAt: r.at + REMAINDER_GRIP_PREPARATION_LIFETIME};
}
// Ready can be derived at the exact executor completion before the parent
// materializes the record. It is grounded in a paid completed job, never a view.
export function remainderCombatFitGripPreparation(state) {
    const latest = remainderCombatFitLatestPractice(state), saved = state.auditRemainder?.modules?.combat_fit?.grip;
    if(!latest) return null;
    const current = saved?.cause === latest.cause ? saved : {...latest, status: 'ready', sessionId: null, reservedSequence: null,
        spentAction: null, spentSequence: null, endedSequence: null, expiryReason: null};
    if(current.status === 'ready' && (state.clock >= current.expiresAt || state.actors?.player?.worldId !== I.world ||
        Number(state.actors?.player?.facts?.['field.renewed'] === true) > (saved?.renewalCount ?? 0))) return {...current, status: 'expired'};
    return current;
}
export function remainderCombatFitFacts(state, context = {}, registry) {
    const enabled = remainderCombatFitEnrolled(state), accepted = remainderCombatFitTermsAccepted(state), s = state.simulation;
    const prep = remainderCombatFitGripPreparation(state), work = enabled && remainderCombatFitPlayerSupported(state, context, {work: true});
    const ready = !!prep && ['ready', 'reserved'].includes(prep.status);
    const facts = {
        'remainder.combatFit.terms': accepted,
        'remainder.combatFit.workSupported': work,
        'remainder.combatFit.handsUsable': remainderCombatFitHandsUsable(state),
        'remainder.combatFit.benchSupported': work && s?.sites?.[I.bench]?.capacity === 1 && state.worlds?.[I.world]?.facts?.['workbench.wet'] === false,
        'remainder.combatFit.lioSupported': work && remainderCombatFitLioSupported(state),
        'remainder.combatFit.gripActive': enabled && remainderCombatFitEarnedGrip(state),
        'remainder.combatFit.balanceActive': enabled && remainderCombatFitActiveSource(state, 'player', I.balance, 'inherited'),
        'remainder.combatFit.preparationAvailable': !ready,
        'remainder.combatFit.preparationState': prep?.status || 'absent',
    };
    for(const fit of Object.keys(P)) {
        facts[`remainder.combatFit.playerOwn.${fit}`] = enabled && remainderCombatFitUnencumbered(state, context, 'player', K[fit], {unequipped: true});
        facts[`remainder.combatFit.lioOwn.${fit}`] = enabled && remainderCombatFitUnencumbered(state, context, I.lio, K[fit]);
    }
    if(registry && enabled) A(registry.simulation?.commands?.has(I.practice), 'The enrolled combat-fit content is unavailable.');
    return facts;
}

const knowledgeReceipt = (state, id, key) => {
    const expected = definition(id)?.effects.find(e => e.type === 'knowledge' && e.key === key);
    const r = state.simulation?.knowledge?.player?.[key], sequence = sequenceOf(r?.cause);
    A(expected && r?.stage === expected.stage && r.value === expected.value && r.basis == null && N(r.at) && r.at <= state.clock &&
        N(sequence) && sequence > 0 && sequence <= state.sequence, 'Combat-fit completion lost its exact paid result/cause receipt.');
    return {...r, sequence};
};
export function validateRemainderCombatFit(state, registry) {
    const s = state.simulation, actor = state.actors?.player, facts = actor?.facts || {}, done = actor?.completed || {};
    const keys = Object.keys(facts).filter(k => k.startsWith(prefix));
    const completed = Object.keys(done).filter(k => k.startsWith(prefix));
    const knowledge = Object.keys(s?.knowledge?.player || {}).filter(k => k.startsWith(prefix));
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(prefix));
    const module = state.auditRemainder?.modules?.combat_fit;
    const otherKnowledge = Object.entries(s?.knowledge || {}).some(([id, entries]) => id !== 'player' && Object.keys(entries).some(k => k.startsWith(prefix)));
    const otherFacts = Object.entries(state.actors || {}).some(([id, a]) => id !== 'player' &&
        [...Object.keys(a.facts || {}), ...Object.keys(a.completed || {})].some(k => k.startsWith(prefix))) ||
        Object.values(state.worlds || {}).some(w => Object.keys(w.facts || {}).some(k => k.startsWith(prefix)));
    if(!keys.length && !completed.length && !knowledge.length && !jobs.length && module == null && !otherKnowledge && !otherFacts) return;
    A(!otherKnowledge && !otherFacts, 'Combat-fit receipts and terms belong only to their actual player owner.');
    A(remainderCombatFitEnrolled(state) && s?.schema >= 4 && remainderCombatFitTermsAccepted(state), 'Combat-fit state requires explicit expansion11/auditRemainder1 terms.');
    A(keys.length === 2 && keys.every(k => ['terms', 'termsRevision'].map(k => prefix + k).includes(k)), 'Unsupported combat-fit actor fact.');
    A(completed.every(id => !!definition(id) && N(done[id])) && knowledge.every(k => remainderCombatFitDefinitions.commands.some(d => d.effects.some(e => e.type === 'knowledge' && e.key === k))), 'Unsupported combat-fit command or knowledge receipt.');
    const terms = knowledgeReceipt(state, I.terms, `${prefix}terms`);
    for(const d of remainderCombatFitDefinitions.commands) {
        if(registry) A(combatFitSame(registry.simulation?.commands?.get(d.id), d), 'Changed combat-fit frozen command/cost policy.');
        if((done[d.id] || 0) > 0) {
            for(const e of d.effects.filter(e => e.type === 'knowledge')) {
                const r = knowledgeReceipt(state, d.id, e.key);
                if(d.id !== I.terms) A(r.sequence > terms.sequence && r.at >= terms.at + d.duration && done[d.id] <= Math.floor((r.at - terms.at) / d.duration), 'Each combat-fit result needs a later paid job and its full duration.');
            }
        } else for(const e of d.effects.filter(e => e.type === 'knowledge')) A(!s.knowledge?.player?.[e.key], 'An unfinished combat-fit job granted a result.');
    }
    A(jobs.length <= 1, 'Only one actual player combat-fit job may run.');
    for(const j of jobs) {
        const d = definition(j.commandId);
        A(d && d.id !== I.terms && j.actorId === 'player' && j.revision === 1 && j.targetId === (d.targetId || null) &&
            j.siteId === (d.siteId || null) && j.cancellation === d.cancellation && j.reservationReturns === 1 &&
            combatFitSame(j.costs, d.costs) && combatFitSame(j.effects, d.effects) &&
            combatFitSame(j.participants, d.targetId ? ['player', I.lio] : ['player']) && N(j.sequence) && j.sequence === sequenceOf(j.id) &&
            j.sequence > terms.sequence && j.sequence <= state.sequence && N(j.due) && j.due >= state.clock && j.due <= state.clock + d.duration &&
            j.due >= terms.at + d.duration && combatFitSame(j.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: 'Village', failure: d.completionFailure}),
            'Combat-fit work lost its exact paid materials, actor, timing, occupation or completion support.');
        A(j.context?.actorId === 'player' && j.context?.targetId === (d.targetId || null) && Array.isArray(j.context.partyIds), 'Combat-fit job changed its frozen actors.');
        if(d.siteId) A(s.sites?.[I.bench]?.capacity === 1 && s.sites[I.bench].reservations?.[j.id] === 'player', 'Harness work lost its actual reserved Village bench.');
    }
    if(remainderCombatFitLatestPractice(state)) A(module != null, 'Completed paid grip practice lost its retained preparation record.');
    if(module != null) validateRemainderGripModule(module, state);
    const soreness = s.conditions?.player?.[I.sore], practice = remainderCombatFitLatestPractice(state);
    if(soreness && practice && soreness.cause === practice.cause) A(soreness.intensity === 1 && soreness.expiresAt === practice.completedAt + 12,
        'Brace practice changed the existing twelve-minute hand soreness.');
}
export function validateRemainderGripModule(module, state) {
    A(combatFitRecord(module) && Object.keys(module).sort().join(',') === 'grip,schema' && module.schema === 1, 'Unsupported combat-fit module fields.');
    const g = module.grip;
    const allowed = ['cause', 'practiceNumber', 'completedAt', 'completedSequence', 'expiresAt', 'status', 'sessionId', 'reservedSequence', 'spentAction', 'spentSequence', 'endedSequence', 'expiryReason', 'sourceReceiptId', 'renewalCount'];
    A(combatFitRecord(g) && Object.keys(g).sort().join(',') === allowed.sort().join(',') && ['ready', 'reserved', 'spent', 'expired'].includes(g.status), 'Unsupported prepared-grip record.');
    A(N(g.practiceNumber) && g.practiceNumber > 0 && g.practiceNumber <= (state.actors?.player?.completed?.[I.practice] || 0) &&
        N(g.completedAt) && g.completedAt <= state.clock && N(g.completedSequence) && g.completedSequence === sequenceOf(g.cause) && g.completedSequence > 0 && g.completedSequence <= state.sequence &&
        g.expiresAt === g.completedAt + REMAINDER_GRIP_PREPARATION_LIFETIME && N(sequenceOf(g.sourceReceiptId)) && sequenceOf(g.sourceReceiptId) > 0 && sequenceOf(g.sourceReceiptId) <= g.completedSequence &&
        [0, 1].includes(g.renewalCount), 'Prepared grip lost its completed effort, trained source or bounded lifetime.');
    const latest = remainderCombatFitLatestPractice(state);
    A(latest && (g.cause === latest.cause ? ['practiceNumber', 'completedAt', 'completedSequence', 'expiresAt'].every(k => g[k] === latest[k]) :
        ['spent', 'expired'].includes(g.status) && g.practiceNumber < latest.practiceNumber && g.completedSequence < latest.completedSequence), 'Prepared grip mismatches its actual completed practice.');
    const sequence = n => N(n) && n >= g.completedSequence && n <= state.sequence;
    const session = id => typeof id === 'string' && /^simulation:[1-9][0-9]*$/.test(id) && sequence(sequenceOf(id));
    if(g.status === 'ready') A(g.sessionId === null && g.reservedSequence === null && g.spentAction === null && g.spentSequence === null && g.endedSequence === null && g.expiryReason === null, 'Ready grip cannot have a battle-spend receipt.');
    if(g.status === 'reserved') {
        const parent = state.simulation?.sessions?.player, b = parent?.nativeBattle;
        A(session(g.sessionId) && sequence(g.reservedSequence) && g.reservedSequence === sequenceOf(g.sessionId) && g.reservedSequence > g.completedSequence && g.spentAction === null && g.spentSequence === null &&
            g.endedSequence === null && g.expiryReason === null && parent?.id === g.sessionId && b?.schema === 5 && b.combatFit?.gripPractice === g.cause,
            'Reserved grip must belong to exactly one actual schema5 sluice attempt.');
    }
    if(g.status === 'spent') {
        A(session(g.sessionId) && sequence(g.reservedSequence) && g.reservedSequence === sequenceOf(g.sessionId) && g.reservedSequence > g.completedSequence && N(g.spentAction) && g.spentAction > 0 &&
            sequence(g.spentSequence) && g.spentSequence > g.reservedSequence && g.expiryReason === null && (g.endedSequence === null || sequence(g.endedSequence) && g.endedSequence >= g.spentSequence), 'Spent grip lacks its unique accepted guard/action receipt.');
        const parent = state.simulation?.sessions?.player;
        if(parent?.id === g.sessionId) {
            const b = parent.nativeBattle;
            A(b?.schema === 5 && b.combatFit?.gripPractice === g.cause && g.spentAction <= b.actions, 'Spent grip mismatches the actual current attempt.');
            const r = b.receipts?.find(r => r.action === g.spentAction);
            if(r) A(r.type === 'guard' && r.actorId === 'player' && combatFitSame(r.targets, ['player']) && r.combatFit?.some(x => x.kind === 'prepared_guard' && x.preparationCause === g.cause), 'Prepared grip was spent outside its accepted ordinary self-guard.');
        }
    }
    if(g.status === 'expired') A(g.spentAction === null && g.spentSequence === null && sequence(g.endedSequence) &&
        ['timeout', 'left_frontier', 'field_renewal', 'session_finish'].includes(g.expiryReason) &&
        (g.sessionId === null ? g.reservedSequence === null && g.expiryReason !== 'session_finish' : session(g.sessionId) && sequence(g.reservedSequence) && g.reservedSequence === sequenceOf(g.sessionId)), 'Expired grip lost its retained unused-charge end receipt.');
}
