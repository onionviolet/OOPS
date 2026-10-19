// Views and admission over the existing actors, jobs, custody and knowledge.
// No read creates stock, refunds money, expires a duty or grants a procedure.
import {check, natural, object as record, sameStructural as same} from './basics.js';
import {WORLD_COMPLETION_LENS_IDS as I, WORLD_COMPLETION_LENS_KEYS as K, WORLD_COMPLETION_LENS_POLICY as P,
    worldCompletionLensDefinitions as D, worldCompletionLensCommand, worldCompletionLensIsMeasurement,
    worldCompletionLensFrozenDefinition} from './world_completion_lens_content.js';

const causeSequence = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.split(':')[1]) : NaN;
const count = (state, id) => state.actors?.player?.completed?.[id] || 0;
const value = (context, key) => context.worldCompletion?.[key] ?? context.facts?.[`worldCompletion.${key}`];
export const worldCompletionLensAdapterValue = value;
export function worldCompletionLensRootEnrolled(state) {
    return state.schema >= 11 && state.simulation?.schema >= 5 && state.actors?.player?.facts?.['world.completion.enrolled'] === true &&
        count(state, 'world.completion.begin') === 1;
}
export function worldCompletionLensEnrolled(state) {
    return worldCompletionLensRootEnrolled(state) && state.actors.player.facts[I.prefix + 'enrolled'] === true &&
        state.actors.player.facts[I.prefix + 'revision'] === P.revision && count(state, I.open) === 1;
}
export function worldCompletionLensBody(state, context = {}) {
    const body = context.nativeBody || state.simulation?.people?.player?.body;
    return body && typeof body.id === 'string' && body.ownerId === 'player' && body.controllerId === 'player' &&
        String(body.form).toLowerCase() === 'human' && body.mobile === true && body.hands >= 2 ? body : null;
}
export function worldCompletionLensClockSupported(state, context = {}) {
    return worldCompletionLensRootEnrolled(state) && state.actors.player.worldId === I.world && !state.realmPrototype?.activeVisitId &&
        context.nativeAlive === true && !!worldCompletionLensBody(state, context) && state.simulation.people.player.life === 'alive' &&
        !state.chronicle?.session && state.chronicle?.life?.endedAt == null;
}
const activeCondition = (state, actor, id) => {
    const c = state.simulation?.conditions?.[actor]?.[id];
    return !!c && c.intensity > 0 && (c.expiresAt == null || c.expiresAt > state.clock);
};
const usableHands = (state, actor) => !['body.sore_hands', 'body.scraped_hands', 'field.care.open_cut']
    .some(id => activeCondition(state, actor, id));
export function worldCompletionLensCurrentSample(state, context = {}) {
    const cause = value(context, 'sampleCause'), r = state.simulation?.knowledge?.player?.['lore.warning.sample'];
    return typeof cause === 'string' && Number.isSafeInteger(causeSequence(cause)) && causeSequence(cause) <= state.sequence && r?.cause === cause &&
        r.stage === 'seen' && r.basis?.kind === 'observation' && r.basis.attributedTo === 'player' &&
        r.basis.situationId === 'lore.warning.rain' && natural(r.at) && r.at <= state.clock &&
        ['lore.warning.begin', 'lore.warning.inspect_outside', 'lore.warning.inspect_room'].some(id => count(state, id) > 0) ? r : null;
}
export function worldCompletionLensLoan(state) {
    const s = state.simulation, f = state.actors?.player?.facts || {}, loan = s?.custody?.[I.loanId];
    return loan && loan.owner === I.maker && loan.holder === 'player' && loan.key === K.amber && loan.count === 1 &&
        Object.keys(loan).length === 6 && ['owner', 'holder', 'key', 'count', 'at', 'cause'].every(k => Object.hasOwn(loan, k)) &&
        loan.cause === f[I.prefix + 'loanCause'] && loan.at === f[I.prefix + 'loanAt'] && f[I.prefix + 'loanHeld'] === true &&
        state.actors.player.resources[I.deposit] === P.deposit && count(state, I.borrow) === 1 ? loan : null;
}
const participants = d => d.targetId ? ['player', d.targetId] : ['player'];
export function exactWorldCompletionLensJob(state, job) {
    const original = worldCompletionLensCommand(job?.commandId), meta = job?.worldCompletionLens;
    if(!original?.duration || !meta || meta.schema !== 1 || meta.commandId !== original.id || !natural(meta.acceptedAt) ||
        meta.acceptedAt > state.clock || typeof meta.bodyId !== 'string' || !meta.bodyId.length) return false;
    const measuring = worldCompletionLensIsMeasurement(original.id), loan = original.id.includes('measure_loan_');
    const d = worldCompletionLensFrozenDefinition(original, meta.loanCause ?? null);
    const keys = ['schema', 'commandId', 'acceptedAt', 'pausedMinutes', 'bodyId', ...(measuring ? ['sampleCause', 'sampleAt'] : []), ...(loan ? ['loanCause'] : [])];
    return Object.keys(meta).length === keys.length && Object.keys(meta).every(k => keys.includes(k)) &&
        (!measuring || Number.isSafeInteger(causeSequence(meta.sampleCause)) && causeSequence(meta.sampleCause) < job.sequence && natural(meta.sampleAt) && meta.sampleAt <= meta.acceptedAt) &&
        (!loan || meta.loanCause === state.actors.player.facts[I.prefix + 'loanCause'] && Number.isSafeInteger(causeSequence(meta.loanCause)) && causeSequence(meta.loanCause) < job.sequence) &&
        job.id === `simulation:${job.sequence}` && natural(job.sequence) && job.sequence > 0 && job.sequence <= state.sequence &&
        job.label === d.label && job.audience == null && job.revision === P.revision && job.actorId === 'player' && job.targetId === (d.targetId || null) &&
        natural(meta.pausedMinutes) && job.due === meta.acceptedAt + d.duration + meta.pausedMinutes && job.reservationReturns === 1 && job.cancellation === 'refund' &&
        same(job.costs, d.costs) && same(job.effects, d.effects) && same(job.participants, participants(d)) &&
        job.siteId === (d.siteId || null) && job.claim === null && job.roll === null && job.outcomeId === null &&
        job.context?.actorId === 'player' && job.context.targetId === (d.targetId || null) && Array.isArray(job.context.partyIds) &&
        Object.keys(job.context).every(k => ['actorId', 'targetId', 'partyIds'].includes(k)) &&
        same(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: !!d.completionCoLocated, location: d.location, failure: 'refund'}) &&
        (!d.siteId || state.simulation?.sites?.[d.siteId]?.reservations?.[job.id] === 'player');
}
function free(state, actor, job) {
    return !(state.simulation?.jobs || []).some(j => j.id !== job?.id && (j.participants || [j.actorId]).includes(actor)) &&
        !Object.entries(state.simulation?.sessions || {}).some(([id, s]) => (s.participants || [id]).includes(actor)) &&
        !(state.pending || []).some(j => j.context?.actorId === actor) &&
        !Object.values(state.actors?.[actor]?.techniques || {}).some(t => t.practice);
}
export function worldCompletionLensFacts(state, context = {}) {
    const s = state.simulation, f = state.actors?.player?.facts || {}, location = context.facts?.location || s?.people?.player?.location;
    const candidate = context.worldCompletionLensReservation || (s?.jobs || []).find(j => j.commandId?.startsWith(I.prefix));
    const job = exactWorldCompletionLensJob(state, candidate) ? candidate : null;
    const stock = context.gameplay?.player?.inventory, vitals = context.vitals?.player, body = worldCompletionLensBody(state, context);
    const local = worldCompletionLensClockSupported(state, context) && record(stock) && record(vitals) && vitals.health > 1;
    const sameBody = !job || body?.id === job.worldCompletionLens.bodyId;
    const hands = local && sameBody && usableHands(state, 'player');
    const maker = s?.people?.[I.maker], ma = state.actors?.[I.maker];
    const makerAvailable = maker?.life === 'alive' && maker.inventory === 'simulation' && maker.definitionId === I.maker &&
        maker.definitionRevision === 1 && (!maker.body?.form || maker.body.form.toLowerCase() === 'human') &&
        (!maker.body?.ownerId || maker.body.ownerId === I.maker) && (!maker.body?.controllerId || maker.body.controllerId === I.maker) && ma?.worldId === I.world && maker.vitals?.health > 1 && free(state, I.maker, job);
    const makerPresent = local && makerAvailable && maker.location === location;
    const makerHands = makerPresent && maker.body?.hands >= 2 && usableHands(state, I.maker);
    const equipped = actor => Object.values(actor === 'player' ? context.equipment?.player || {} : s?.equipment?.[actor] || {}).includes(K.amber);
    const held = actor => !!job && job.costs.some(e => e.type === 'item' && e.actor === actor && e.key === K.amber && e.amount === -1);
    const owned = actor => !equipped(actor) && !Object.values(s?.custody || {}).some(c => c.holder === actor && c.key === K.amber) &&
        ((actor === 'player' ? stock : s?.owners?.[actor])?.[K.amber] >= 1 || held(actor));
    const loan = worldCompletionLensLoan(state), overdue = f[I.prefix + 'overdue'] === true;
    const validLoan = !!loan && !equipped('player') && ((stock?.[K.amber] || 0) >= 1 || held('player'));
    const current = worldCompletionLensCurrentSample(state, context), sameSample = !job || !worldCompletionLensIsMeasurement(job.commandId) ||
        current?.cause === job.worldCompletionLens.sampleCause && current.at === job.worldCompletionLens.sampleAt;
    const roomPermission = value(context, 'roomPermission') === true;
    const room = s?.sites?.[I.room], dryRoom = roomPermission && value(context, 'dryRoom') === true && location === 'Shack' && room?.owner === 'player' && room.capacity === 1 &&
        Object.entries(room.reservations).every(([id]) => id === job?.id);
    return {'worldCompletionLens.rootEnrolled': worldCompletionLensRootEnrolled(state), 'worldCompletionLens.enrolled': worldCompletionLensEnrolled(state),
        'worldCompletionLens.local': local && sameBody, 'worldCompletionLens.hands': hands,
        'worldCompletionLens.makerPresent': makerPresent, 'worldCompletionLens.makerHands': makerHands,
        'worldCompletionLens.makerMobile': makerPresent && maker.body?.mobile !== false,
        'worldCompletionLens.makerWilling': !overdue, 'worldCompletionLens.currentSample': !!current && sameSample,
        'worldCompletionLens.unmeasuredSample': !!current && f[I.prefix + 'sampleCause'] !== current.cause,
        'worldCompletionLens.ownedLens': hands && owned('player'), 'worldCompletionLens.serviceLens': makerHands && owned(I.maker),
        'worldCompletionLens.loanLens': hands && validLoan && !overdue && f[I.prefix + 'loanDue'] > state.clock,
        'worldCompletionLens.loanRoomTime': !!loan && f[I.prefix + 'loanDue'] > (job?.commandId === I.prefix + 'measure_loan_room' ? job.due : state.clock + 2),
        'worldCompletionLens.loanOutsideTime': !!loan && f[I.prefix + 'loanDue'] > (job?.commandId === I.prefix + 'measure_loan_outside' ? job.due : state.clock + 4),
        'worldCompletionLens.returnLens': !!loan && !equipped('player') && (stock?.[K.amber] || 0) >= 1 && !held('player'),
        'worldCompletionLens.loanHeld': !!loan, 'worldCompletionLens.loanNotTaken': count(state, I.borrow) === 0,
        'worldCompletionLens.overdue': overdue, 'worldCompletionLens.roomPermission': roomPermission, 'worldCompletionLens.dryRoom': dryRoom,
        // False until root installs and truthfully marks the exact native consumer.
        'worldCompletionLens.custodySupported': context.worldCompletionLensCustody === 1};
}

export function validateWorldCompletionLensState(state, registry) {
    const s = state.simulation, player = state.actors?.player, f = player?.facts || {};
    const factRows = Object.entries(state.actors || {}).flatMap(([id, a]) => Object.keys(a.facts || {}).filter(k => k.startsWith(I.prefix)).map(k => [id, k]));
    const completions = Object.entries(state.actors || {}).flatMap(([id, a]) => Object.keys(a.completed || {}).filter(k => k.startsWith(I.prefix)).map(k => [id, k]));
    const resources = Object.entries(state.actors || {}).flatMap(([id, a]) => Object.keys(a.resources || {}).filter(k => k.startsWith(I.prefix)).map(k => [id, k]));
    const known = Object.entries(s?.knowledge || {}).flatMap(([id, a]) => Object.keys(a).filter(k => k.startsWith(I.prefix)).map(k => [id, k]));
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(I.prefix) || j.worldCompletionLens);
    const situation = s?.situations?.[I.situation], custody = s?.custody?.[I.loanId];
    if(!factRows.length && !completions.length && !resources.length && !known.length && !jobs.length && !situation && !custody) return;
    check(worldCompletionLensEnrolled(state) && situation?.revision === P.revision && situation.cause === s.knowledge.player?.[I.prefix + 'terms']?.cause,
        'Lens records require explicit world-completion schema5 enrollment and actual Vela terms.');
    const sd = D.situations[0];
    check(situation.definitionId === I.situation && same(situation.context, sd.context) && same(situation.participants, sd.participants) &&
        same(situation.privateTruth, sd.privateTruth) && same(situation.phases, sd.phases) && situation.deadline === null &&
        situation.receipts.length === (situation.phase === 'offered' ? 1 : situation.phase === 'borrowed' ? 2 : 3), 'Lens terms preserve their exact actual participants and finite phase history.');
    check(s.people[I.maker]?.definitionId === I.maker && s.people[I.maker].definitionRevision === 1 && state.actors[I.maker], 'Lens work preserves the actual existing Vela owner.');
    const allowed = ['enrolled', 'revision', 'loanHeld', 'returned', 'loanAt', 'loanDue', 'loanCause', 'loanPause', 'overdue', 'overdueAt', 'overdueCause',
        'returnAt', 'returnCause', 'sampleCause', 'sampleAt', 'measurementCause', 'measurementAt', 'measurementCommand', 'measurementBodyId'];
    check(factRows.every(([id, k]) => id === 'player' && allowed.includes(k.slice(I.prefix.length))), 'Unsupported lens fact or actor.');
    check(Object.entries(state.worlds || {}).every(([, w]) => !Object.keys(w.facts).some(k => k.startsWith(I.prefix))), 'Lens obligations are actor records, not mirrored world facts.');
    for(const [id, k] of completions) {
        const d = worldCompletionLensCommand(k), n = state.actors[id].completed[k];
        check(id === 'player' && d && natural(n) && n > 0 && (!d.once || n === 1), 'Unsupported lens completion.');
    }
    check(resources.every(([id, k]) => id === 'player' && k === I.deposit), 'Lens deposit has one explicit escrow owner.');
    for(const [id, k] of known) {
        const r = s.knowledge[id][k], name = k.slice(I.prefix.length);
        const candidates = D.commands.filter(d => count(state, d.id) > 0).flatMap(d => d.effects.filter(e => e.type === 'knowledge' && e.key === k));
        check(id === 'player' && candidates.some(e => e.value === r.value && e.stage === r.stage &&
            same(e.basis, name === 'measurement' ? Object.fromEntries(Object.entries(r.basis || {}).filter(([key]) => !['sampleCause', 'sampleAt', 'bodyId', 'commandId'].includes(key))) : r.basis)) &&
            natural(r.at) && r.at <= state.clock && Number.isSafeInteger(causeSequence(r.cause)) && causeSequence(r.cause) <= state.sequence,
            'Lens knowledge needs an actual committed observation or present attributed contact.');
    }
    check(!Object.values(s.programs).some(p => p.commandId?.startsWith(I.prefix)), 'No automated lens program is admitted.');
    check(!Object.keys(s.conditions).some(id => Object.keys(s.conditions[id]).some(k => k.startsWith(I.prefix))) &&
        !Object.values(state.actors).some(a => Object.keys(a.sources).some(k => k.startsWith(I.prefix))), 'Lens use grants no body condition or donor source.');
    const borrowed = count(state, I.borrow) === 1, returned = ['return_village', 'return_room'].reduce((n, name) => n + count(state, I.prefix + name), 0);
    check(count(state, I.prefix + 'late_terms_village') + count(state, I.prefix + 'late_terms_room') === 0 || f[I.prefix + 'overdue'] === true, 'Late-service refusal needs its actual overdue obligation.');
    check(returned <= 1 && (!returned || borrowed), 'The exact lens and deposit return only once.');
    if(borrowed) {
        check(natural(f[I.prefix + 'loanAt']) && f[I.prefix + 'loanAt'] <= state.clock && natural(f[I.prefix + 'loanPause']) &&
            f[I.prefix + 'loanDue'] === f[I.prefix + 'loanAt'] + P.duration + f[I.prefix + 'loanPause'] &&
            f[I.prefix + 'loanCause'] === s.knowledge.player[I.prefix + 'loan']?.cause && situation.receipts[1]?.cause === f[I.prefix + 'loanCause'] &&
            situation.receipts[1].at === f[I.prefix + 'loanAt'] && situation.receipts[1].to === 'borrowed', 'Lens duty needs actual acceptance, supported pause and exact cause.');
        check((f[I.prefix + 'loanHeld'] === true) === !returned && (player.resources[I.deposit] || 0) === (returned ? 0 : P.deposit), 'Original deposit and live custody must remain conserved.');
        if(returned) check(!custody && f[I.prefix + 'returned'] === true && natural(f[I.prefix + 'returnAt']) &&
            f[I.prefix + 'returnAt'] >= f[I.prefix + 'loanAt'] && f[I.prefix + 'returnAt'] <= state.clock &&
            f[I.prefix + 'returnCause'] === s.knowledge.player[I.prefix + 'return']?.cause && situation.phase === 'returned' &&
            situation.receipts[2]?.cause === f[I.prefix + 'returnCause'] && situation.receipts[2].at === f[I.prefix + 'returnAt'], 'Exact return must remove custody and refund the unchanged deposit once.');
        else check(!!worldCompletionLensLoan(state) && situation.phase === 'borrowed' && f[I.prefix + 'returned'] == null && f[I.prefix + 'returnCause'] == null && f[I.prefix + 'returnAt'] == null, 'Held loan lost its exact owner, carrier or escrow.');
    } else check(!custody && !resources.length && !Object.keys(f).some(k => k.startsWith(I.prefix + 'loan') || k === I.prefix + 'returned' || k.startsWith(I.prefix + 'return')) && situation.phase === 'offered', 'No loan or deposit may precede actual consent.');
    if(f[I.prefix + 'overdue'] != null) check(borrowed && f[I.prefix + 'overdue'] === true && natural(f[I.prefix + 'overdueAt']) &&
        f[I.prefix + 'overdueAt'] >= f[I.prefix + 'loanDue'] && f[I.prefix + 'overdueAt'] <= state.clock &&
        /^world\.completion\.lens\.overdue:[1-9][0-9]*$/.test(f[I.prefix + 'overdueCause'] || '') &&
        Number(f[I.prefix + 'overdueCause'].split(':').at(-1)) <= state.sequence &&
        Number(f[I.prefix + 'overdueCause'].split(':').at(-1)) > causeSequence(f[I.prefix + 'loanCause']) &&
        (!returned || f[I.prefix + 'overdueAt'] <= f[I.prefix + 'returnAt'] && Number(f[I.prefix + 'overdueCause'].split(':').at(-1)) < causeSequence(f[I.prefix + 'returnCause'])), 'Lateness needs an actual supported played boundary.');
    else check(f[I.prefix + 'overdueAt'] == null && f[I.prefix + 'overdueCause'] == null, 'Orphan overdue record.');
    const measurement = s.knowledge.player[I.prefix + 'measurement'];
    const measuredKeys = ['sampleCause', 'sampleAt', 'measurementCause', 'measurementAt', 'measurementCommand', 'measurementBodyId'];
    if(measurement) {
        const d = worldCompletionLensCommand(f[I.prefix + 'measurementCommand']);
        check(d && worldCompletionLensIsMeasurement(d.id) && count(state, d.id) > 0 && measurement.cause === f[I.prefix + 'measurementCause'] &&
            measurement.at === f[I.prefix + 'measurementAt'] && measurement.basis.commandId === d.id &&
            measurement.basis.sampleCause === f[I.prefix + 'sampleCause'] && measurement.basis.sampleAt === f[I.prefix + 'sampleAt'] &&
            measurement.basis.bodyId === f[I.prefix + 'measurementBodyId'] && typeof f[I.prefix + 'measurementBodyId'] === 'string' &&
            natural(f[I.prefix + 'sampleAt']) && measurement.at >= f[I.prefix + 'sampleAt'] + d.duration &&
            Number.isSafeInteger(causeSequence(f[I.prefix + 'sampleCause'])) && causeSequence(f[I.prefix + 'sampleCause']) < causeSequence(measurement.cause),
            'Measurement needs the exact performed current-sample, body and job provenance.');
    } else check(measuredKeys.every(k => f[I.prefix + k] == null), 'No measurement may precede completed paid work.');
    for(const job of jobs) {
        check(exactWorldCompletionLensJob(state, job), 'Saved lens work differs from its exact revision, causes, participants, site, costs or held returns.');
        if(registry) check(registry.simulation.commands.get(job.commandId)?.group === I.group, 'Saved lens job lost its registered consumer.');
        if(job.commandId.includes('measure_loan_')) check(!!worldCompletionLensLoan(state), 'Reserved borrowed work needs its unchanged exact custody and deposit.');
    }
}

// Optional exact shared-executor join. This permits only the paired item debit
// / restore authored by one of this revision's two borrowed sample jobs. It is
// never a general possession, transfer, equipment or destructive-use override.
export function worldCompletionLensCustodyUseAllowed(state, effect, context = {}) {
    const c = effect?.custodyUse, loan = worldCompletionLensLoan(state);
    if(!worldCompletionLensRootEnrolled(state) || !loan || effect.type !== 'item' || effect.actor !== 'player' ||
        effect.key !== K.amber || Math.abs(effect.amount) !== 1 || effect.breakCustody ||
        effect.amount > 0 && effect.reservationReturn !== true || !record(c) ||
        Object.keys(c).length !== 7 || !['schema', 'loanId', 'owner', 'holder', 'key', 'count', 'cause'].every(k => Object.hasOwn(c, k)) ||
        !same(c, {schema: 1, loanId: I.loanId, owner: I.maker, holder: 'player', key: K.amber, count: 1, cause: loan.cause})) return false;
    const candidate = context.worldCompletionLensReservation;
    if(candidate) {
        if(!exactWorldCompletionLensJob(state, candidate) || !candidate.commandId.includes('measure_loan_')) return false;
        const declared = [...candidate.costs, ...candidate.effects].filter(e => e.custodyUse);
        if(declared.some(e => same(e, effect))) return true;
        // The common cancellation/support refund restores the same exact item
        // with the same marker, while preserving the outstanding custody.
        return candidate.costs.some(e => e.custodyUse && same({...e, amount: -e.amount, reservationReturn: true}, effect));
    }
    if(context.worldCompletionLensHost !== true) return false;
    const ids = ['measure_loan_outside', 'measure_loan_room'].map(id => I.prefix + id);
    const admitted = ids.filter(id => context.worldCompletionLensCommandId === id || context.worldCompletionLensPreview === true && context.worldCompletionLensCommandId == null);
    return admitted.some(id => {
        const d = worldCompletionLensFrozenDefinition(worldCompletionLensCommand(id), loan.cause);
        return [...d.costs, ...d.effects].some(e => e.custodyUse && same(e, effect));
    });
}
export function worldCompletionLensCustodyReturnAllowed(state, effect, context = {}) {
    if(effect?.type !== 'custody' || effect.loanId !== I.loanId || !effect.returning || effect.breakCustody ||
        context.worldCompletionLensHost !== true) return false;
    const loan = worldCompletionLensLoan(state);
    if(!loan || effect.loanCause !== loan.cause) return false;
    const ids = ['return_village', 'return_room'].map(id => I.prefix + id);
    return ids.filter(id => context.worldCompletionLensCommandId === id || context.worldCompletionLensPreview === true && context.worldCompletionLensCommandId == null).some(id => {
        const d = worldCompletionLensFrozenDefinition(worldCompletionLensCommand(id), loan.cause);
        return d.costs.some(e => e.type === 'custody' && same(e, effect));
    });
}
