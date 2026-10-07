// Pure eligibility and exact retained-evidence validation. The scheduler can
// import this module without importing its executor, UI or native publisher.
import {GAME_ABSORPTION_ASSAY_IDS as I, GAME_ABSORPTION_ASSAY_KEYS as K, gameAbsorptionAssayDefinitions as D} from './game_absorption_assay_content.js';
import {NETHACK_FIELDCRAFT_IDS as N, nethackFieldcraftDefinitions as ND} from './nethack_fieldcraft_content.js';
import {nethackFieldcraftFacts} from './nethack_fieldcraft_facts.js';
import {statusCareSupportedBody} from './status_care_facts.js';
import {assert, natural, record} from './simulation_contracts.js';

const definitions = new Map(D.commands.map(d => [d.id, d]));
const count = value => value == null ? 0 : value;
export function sameAssayData(a, b) {
    if(a === b) return true;
    if(Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => sameAssayData(v, b[i]));
    if(!record(a) || !record(b)) return false;
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every(k => Object.hasOwn(b, k) && sameAssayData(a[k], b[k]));
}
const sequenceOf = cause => /^simulation:[1-9][0-9]*$/.test(cause || '') ? Number(cause.slice(11)) : NaN;
const controlDefinition = ND.commands.find(d => d.id === N.assay).effects.find(e => e.type === 'knowledge' && e.key === N.oil);
function decodeControl(value, beforeSequence, beforeAt) {
    let r;
    try {r = JSON.parse(value);} catch {return null;}
    return record(r) && Object.keys(r).length === 6 && ['id', 'cause', 'at', 'stage', 'value', 'basis'].every(k => Object.hasOwn(r, k)) &&
        r.id === N.oil && natural(r.at) && r.at <= beforeAt && natural(sequenceOf(r.cause)) && sequenceOf(r.cause) > 0 && sequenceOf(r.cause) < beforeSequence &&
        r.stage === controlDefinition.stage && r.value === controlDefinition.value && sameAssayData(r.basis, controlDefinition.basis) ? r : null;
}
// The host freezes only a provenance copy of earned knowledge into this
// command's ordinary knowledge effect. No stock, clock or publisher is copied.
export function freezeGameAbsorptionAssayEffects(state, commandId) {
    const d = definitions.get(commandId);
    assert(d, 'Choose a declared batch action.');
    if(commandId !== I.compare) return structuredClone(d.effects);
    assert(controlKnown(state), 'Acquire the actual reed-oil control first.');
    const r = state.simulation.knowledge.player[N.oil];
    const value = JSON.stringify({id: N.oil, cause: r.cause, at: r.at, stage: r.stage, value: r.value, basis: r.basis});
    return d.effects.map(e => e.key === `${I.prefix}control` ? {...structuredClone(e), value} : structuredClone(e));
}
function exactEffects(job, d) {
    if(d.id !== I.compare) return sameAssayData(job.effects, d.effects);
    if(!Array.isArray(job.effects) || job.effects.length !== d.effects.length) return false;
    const value = job.effects.find(e => e.key === `${I.prefix}control`)?.value;
    return !!decodeControl(value, job.sequence, job.due - d.duration) &&
        sameAssayData(job.effects, d.effects.map(e => e.key === `${I.prefix}control` ? {...e, value} : e));
}
const participantBusy = (state, actor) => (state.simulation?.jobs || []).some(j => (j.participants || [j.actorId]).includes(actor)) ||
    Object.entries(state.simulation?.sessions || {}).some(([id, session]) => (session.participants || [id]).includes(actor)) ||
    (state.pending || []).some(j => j.context?.actorId === actor) || Object.values(state.actors?.[actor]?.techniques || {}).some(t => t.practice) ||
    Object.values(state.simulation?.pursuits || {}).some(p => [p.actorId, p.targetId].includes(actor) && ['moving', 'searching', 'waiting', 'sheltered', 'encounter'].includes(p.status));

export function exactGameAbsorptionAssayJob(state, job) {
    const d = definitions.get(job?.commandId);
    return !!d?.duration && job.actorId === 'player' && job.revision === d.revision && job.targetId === null &&
        natural(job.sequence) && job.sequence > 0 && job.sequence <= state.sequence && job.id === `simulation:${job.sequence}` &&
        natural(job.due) && job.due >= state.clock && job.due <= state.clock + d.duration &&
        job.cancellation === 'refund' && job.reservationReturns === 1 && job.claim === null && job.siteId === I.site &&
        state.simulation?.sites?.[I.site]?.reservations?.[job.id] === 'player' && sameAssayData(job.costs, d.costs) && exactEffects(job, d) &&
        sameAssayData(job.participants, ['player']) && Array.isArray(job.context?.partyIds) &&
        sameAssayData(job.context, {actorId: 'player', targetId: null, partyIds: job.context.partyIds}) &&
        sameAssayData(job.completionSupport, {schema: 1, requires: d.completionRequires, coLocated: false, location: 'Village', failure: 'refund'});
}
const unencumbered = (state, context, actor, key) =>
    !Object.values(state.simulation?.custody || {}).some(c => (c.holder === actor || c.owner === actor) && c.key === key) &&
    !Object.values(context.equipment?.[actor] || state.simulation?.equipment?.[actor] || {}).includes(key);
function own(state, context, actor, key, job) {
    if(!unencumbered(state, context, actor, key)) return false;
    const stock = state.simulation?.people?.[actor]?.inventory === 'simulation' ? state.simulation.owners?.[actor] : context.gameplay?.[actor]?.inventory;
    return natural(stock?.[key]) && stock[key] > 0 || actor === 'player' && !!job && job.costs.some(c => c.type === 'item' && c.actor === actor && c.key === key && c.amount === -1);
}
function controlKnown(state) {
    const a = state.actors?.player, r = state.simulation?.knowledge?.player?.[N.oil];
    const applied = [N.assay, N.trialPlain, N.trialFine].some(id => count(a?.completed?.[id]) > 0);
    // Kind knowledge is retained. Its latest timestamp can be updated by
    // another useful application, so it must not invalidate an earlier
    // deduction. Freeze the supporting actual receipt in the comparison job.
    return state.referenceGameplay?.fieldcraft?.schema === 1 && a?.facts?.['nethack_fieldcraft.opened'] === true && applied &&
        r?.stage === controlDefinition.stage && r.value === controlDefinition.value && sameAssayData(r.basis, controlDefinition.basis) && natural(r.at) && r.at <= state.clock &&
        natural(sequenceOf(r.cause)) && sequenceOf(r.cause) > 0 && sequenceOf(r.cause) <= state.sequence;
}
const observedNegative = state => {
    const kind = state.actors?.player?.facts?.[`${I.prefix}negativeTrial`], r = state.simulation?.knowledge?.player?.[`${I.prefix}negative`];
    const expected = knowledgeEffect(`${I.prefix}trial_${kind}`, `${I.prefix}negative`);
    return ['dull', 'fineDull'].includes(kind) && state.actors?.player?.completed?.[`${I.prefix}trial_${kind}`] === 1 &&
        !!expected && r?.stage === expected.stage && r.value === expected.value && sameAssayData(r.basis, expected.basis) &&
        natural(r.at) && r.at <= state.clock && natural(sequenceOf(r.cause)) && sequenceOf(r.cause) > 0 && sequenceOf(r.cause) <= state.sequence;
};
export function gameAbsorptionAssayIdentified(state) {
    const done = state.actors?.player?.completed || {}, r = state.simulation?.knowledge?.player?.[I.identity];
    if(!r || r.stage !== 'understood' || r.basis?.attributedTo !== 'player' || !natural(r.at) || r.at > state.clock ||
        !natural(sequenceOf(r.cause)) || sequenceOf(r.cause) <= 0 || sequenceOf(r.cause) > state.sequence) return false;
    if(r.basis.kind === 'inference') {
        const expected = knowledgeEffect(I.compare, I.identity), control = state.simulation?.knowledge?.player?.[`${I.prefix}control`];
        return done[I.compare] === 1 && observedNegative(state) && controlKnown(state) && r.value === expected.value && sameAssayData(r.basis, expected.basis) &&
            control?.cause === r.cause && control.at === r.at && !!decodeControl(control.value, sequenceOf(r.cause), r.at - 1);
    }
    const expected = knowledgeEffect(I.examine, I.identity);
    return r.basis.kind === 'observation' && (done[I.examine] === 1 || count(done[I.rinse]) > 0) && r.value === expected.value && sameAssayData(r.basis, expected.basis);
}
// The finite catalogue comes from disclosed terms. Reduce only with acquired
// evidence; neither seller stock nor private truth supplies a guessed answer.
export function gameAbsorptionAssayCandidates(state) {
    const a = state.actors?.player;
    if(a?.facts?.[`${I.prefix}opened`] !== true || a.completed?.[I.open] !== 1) return [];
    if(gameAbsorptionAssayIdentified(state) || observedNegative(state) && controlKnown(state)) return ['gum_wash'];
    return ['reed_oil', 'gum_wash'];
}
export function gameAbsorptionAssayFacts(state, context = {}, registry) {
    const s = state.simulation, a = state.actors?.player, f = a?.facts || {}, done = a?.completed || {};
    const previous = nethackFieldcraftFacts(state, context, registry), enabled = state.referenceGameplay?.schema === 1;
    const opened = enabled && f[`${I.prefix}opened`] === true && f[`${I.prefix}termsRevision`] === 1 && done[I.open] === 1;
    const bench = s?.sites?.[I.site], terms = s?.knowledge?.player?.[`${I.prefix}terms`];
    const site = !!bench && bench.owner === I.eda && bench.capacity === 1 && s?.people?.[I.eda]?.definitionId === I.eda &&
        previous['fieldcraft.opened'] === true && (!opened || terms?.stage === 'understood');
    const reserved = context.gameAbsorptionReservation || (s?.jobs || []).find(j => j.actorId === 'player' && definitions.has(j.commandId));
    const job = exactGameAbsorptionAssayJob(state, reserved) ? reserved : null;
    const facts = {
        'absorption.assay.canMeet': enabled && previous['fieldcraft.opened'] === true && !opened,
        'absorption.assay.opened': opened,
        'absorption.assay.supported': previous['fieldcraft.supported'] === true && statusCareSupportedBody(state, context),
        'absorption.assay.handsUsable': previous['fieldcraft.handsUsable'] === true && statusCareSupportedBody(state, context),
        'absorption.assay.siteSupported': site,
        'absorption.assay.edaSupported': previous['fieldcraft.edaSupported'] === true && !participantBusy(state, I.eda),
        'absorption.assay.controlKnown': opened && controlKnown(state),
        'absorption.assay.negativeObserved': opened && observedNegative(state),
        'absorption.assay.identified': opened && gameAbsorptionAssayIdentified(state),
    };
    for(const kind of ['full', 'dirty', 'dull', 'fineDull']) facts[`absorption.assay.own.${kind}`] = opened && previous['fieldcraft.supported'] === true && own(state, context, 'player', K[kind], job);
    for(const kind of ['full', 'dirty']) facts[`absorption.assay.stock.${kind}`] = opened && own(state, context, I.eda, K[kind], null);
    return facts;
}

function knowledgeEffect(commandId, key, actor = 'player') {
    return definitions.get(commandId)?.effects.find(e => e.type === 'knowledge' && e.actor === actor && e.key === key);
}
function receipt(state, commandIds, key, actor = 'player') {
    const r = state.simulation?.knowledge?.[actor]?.[key], sequence = sequenceOf(r?.cause);
    const matching = commandIds.filter(id => count(state.actors?.player?.completed?.[id]) > 0).map(id => knowledgeEffect(id, key, actor));
    assert(r && natural(r.at) && r.at <= state.clock && natural(sequence) && sequence > 0 && sequence <= state.sequence &&
        matching.some(e => e && r.stage === e.stage && r.value === e.value && sameAssayData(r.basis, e.basis)), 'The batch lost its actual attributed evidence receipt.');
    return {...r, sequence};
}
export function validateGameAbsorptionAssay(state, registry, nativeContext) {
    const s = state.simulation, a = state.actors?.player, f = a?.facts || {}, done = a?.completed || {};
    const namespaced = obj => Object.keys(obj || {}).filter(k => k.startsWith(I.prefix));
    const jobs = (s?.jobs || []).filter(j => j.commandId?.startsWith(I.prefix));
    assert(!Object.values(s?.programs || {}).some(p => p.commandId?.startsWith(I.prefix)),
        'Choose each batch action through its current bench controls; no batch routine is registered.');
    const actorKeys = namespaced(f), completions = namespaced(done);
    const knowledge = Object.entries(s?.knowledge || {}).flatMap(([actor, rows]) => namespaced(rows).map(key => [actor, key]));
    const seeded = [K.full, K.dirty].some(key => (s?.owners?.[I.eda]?.[key] || 0) > 0 || Object.values(nativeContext?.gameplay || {}).some(p => (p.inventory?.[key] || 0) > 0));
    if(!actorKeys.length && !completions.length && !knowledge.length && !jobs.length && !seeded) return;
    assert([9, 10, 11].includes(state.schema) && state.referenceGameplay?.schema === 1 && state.referenceGameplay.fieldcraft?.schema === 1 && s?.schema >= 4,
        'The optional batch needs its matching current native content and existing fieldcraft reader. Preserve unsupported saves.');
    assert(actorKeys.every(key => ['opened', 'termsRevision', 'negativeTrial'].map(name => `${I.prefix}${name}`).includes(key)) &&
        f[`${I.prefix}opened`] === true && f[`${I.prefix}termsRevision`] === 1 && done[I.open] === 1, 'The batch requires exact deliberate opening terms.');
    assert(Object.values(state.actors || {}).every(actor => actor === a || !namespaced(actor.facts).length && !namespaced(actor.completed).length) &&
        Object.values(state.worlds || {}).every(w => !namespaced(w.facts).length), 'Batch evidence belongs only to the actual player and attributed knowledge owners.');
    assert(completions.every(id => definitions.has(id) && natural(done[id]) && (!definitions.get(id).once || done[id] === 1)), 'Unsupported batch completion or duplicated once action.');
    assert(a.completed[N.open] === 1 && s.people?.[I.eda]?.definitionId === I.eda && s.people[I.eda].inventory === 'simulation' &&
        state.actors?.[I.eda]?.worldId === I.world && record(s.owners?.[I.eda]) && natural(state.actors[I.eda].resources?.coins) &&
        s.sites?.[I.site]?.owner === I.eda && s.sites[I.site].capacity === 1, 'The batch requires its real retained fitter, purse, stock and bench.');
    if(registry) for(const d of D.commands) assert(sameAssayData(registry.simulation?.commands?.get(d.id), d), 'Unsupported current batch command definition.');
    const terms = receipt(state, [I.open], `${I.prefix}terms`), consignment = receipt(state, [I.open], `${I.prefix}consignment`, I.eda);
    assert(terms.cause === consignment.cause && terms.at === consignment.at, 'Packing-case stock needs the actual shared opening and consent cause.');
    const expectedKnowledge = new Set([`player:${I.prefix}terms`, `${I.eda}:${I.prefix}consignment`]);
    for(const kind of ['full', 'dirty']) {
        const bought = count(done[`${I.prefix}buy_${kind}`]);
        assert(natural(bought) && bought <= 2 && count(s.owners[I.eda][K[kind]]) === 2 - bought, 'The once-only consignment cannot refill or exceed its actual stock transfers.');
        if(bought) {
            const r = receipt(state, [`${I.prefix}buy_${kind}`], `${I.prefix}purchase_${kind}`);
            assert(r.sequence > terms.sequence && r.at >= terms.at, 'A purchase must follow the actual stock opening.');
            expectedKnowledge.add(`player:${I.prefix}purchase_${kind}`);
        }
    }
    const trials = ['dull', 'fineDull'].map(kind => `${I.prefix}trial_${kind}`), scrapes = ['dull', 'fineDull'].map(kind => `${I.prefix}scrape_${kind}`);
    const negativeCount = trials.reduce((n, id) => n + count(done[id]), 0), examinations = count(done[I.examine]), washes = count(done[I.rinse]);
    const scraped = scrapes.reduce((n, id) => n + count(done[id]), 0), used = negativeCount + examinations + washes;
    assert(negativeCount <= 1 && used <= count(done[`${I.prefix}buy_full`]) && washes + scraped <= count(done[`${I.prefix}buy_dirty`]), 'Every charge and cleaned pin requires its actual purchased material; failed trials spend a charge too.');
    let negative;
    if(negativeCount) {
        const kind = f[`${I.prefix}negativeTrial`], id = `${I.prefix}trial_${kind}`;
        assert(['dull', 'fineDull'].includes(kind) && done[id] === 1, 'A failed trial retains its exact unchanged knife variant.');
        negative = receipt(state, [id], `${I.prefix}negative`);
        assert(negative.sequence > terms.sequence && negative.at >= terms.at + 2, 'The failed trial must finish its actual paid two-minute attempt.');
        expectedKnowledge.add(`player:${I.prefix}negative`);
    } else assert(f[`${I.prefix}negativeTrial`] == null, 'No failed experiment has occurred.');
    for(const [id, key] of [[I.examine, 'examination'], [I.rinse, 'washing'], ...['dull', 'fineDull'].map(kind => [`${I.prefix}scrape_${kind}`, `scraping_${kind}`])]) {
        if(!count(done[id])) continue;
        const r = receipt(state, [id], `${I.prefix}${key}`), duration = definitions.get(id).duration;
        assert(r.sequence > terms.sequence && r.at >= terms.at + duration, 'Bench evidence must follow an actual timed completion.');
        expectedKnowledge.add(`player:${I.prefix}${key}`);
    }
    if(done[I.compare]) {
        assert(negative && controlKnown(state), 'A failed trial without actual oil evidence cannot become an identification.');
        const r = receipt(state, [I.compare], `${I.prefix}comparison`);
        assert(r.sequence > negative.sequence && r.at >= negative.at + 1,
            'Deduction must finish after the negative observation and recheck actual oil knowledge at admission and completion.');
        const control = s.knowledge.player[`${I.prefix}control`], expected = knowledgeEffect(I.compare, `${I.prefix}control`);
        assert(control?.cause === r.cause && control.at === r.at && control.stage === expected.stage && sameAssayData(control.basis, expected.basis) &&
            decodeControl(control.value, r.sequence, r.at - 1), 'Deduction lost its frozen actual oil-control source, earned before the comparison job.');
        expectedKnowledge.add(`player:${I.prefix}comparison`);
        expectedKnowledge.add(`player:${I.prefix}control`);
    }
    if(count(done[I.compare]) + examinations + washes) {
        const identity = receipt(state, [I.compare, I.examine, I.rinse], I.identity);
        assert(gameAbsorptionAssayIdentified(state) && identity.sequence > terms.sequence, 'Substance identity needs actual observation or a complete elimination chain.');
        expectedKnowledge.add(`player:${I.identity}`);
    }
    assert(knowledge.length === expectedKnowledge.size && knowledge.every(([actor, key]) => expectedKnowledge.has(`${actor}:${key}`)), 'Unsupported, leaked or missing batch knowledge.');
    assert(jobs.length <= 1, 'Only one player job can reserve the fitting bench.');
    for(const job of jobs) {
        assert(exactGameAbsorptionAssayJob(state, job) && job.sequence > terms.sequence && job.due >= terms.at + definitions.get(job.commandId).duration,
            'Bench work lost its exact paid inputs, unchanged returned tool or refundable support.');
        const d = definitions.get(job.commandId);
        assert(!d.once || !done[d.id], 'A once-only batch action cannot be repeated.');
        if(trials.includes(d.id)) assert(!negativeCount && !gameAbsorptionAssayIdentified(state), 'A trial cannot repeat or claim to remain unidentified after the evidence is complete.');
        if(d.id === I.compare) assert(negative && controlKnown(state) && !gameAbsorptionAssayIdentified(state), 'Pending comparison needs both actual evidence sources and an unknown batch.');
        if(d.id === I.examine) assert(!gameAbsorptionAssayIdentified(state), 'An already identified batch needs no disposable assay.');
        const vial = job.costs.some(c => c.type === 'item' && c.key === K.full), dirty = job.costs.some(c => c.type === 'item' && c.key === K.dirty);
        assert(used + (vial ? 1 : 0) <= count(done[`${I.prefix}buy_full`]) && washes + scraped + (dirty ? 1 : 0) <= count(done[`${I.prefix}buy_dirty`]),
            'Reserved work also needs an actually acquired full charge and pin.');
    }
    if(nativeContext) for(const [kind, consumed] of [['full', used], ['dirty', washes + scraped]]) {
        const key = K[kind], stock = nativeContext.gameplay?.player?.inventory?.[key];
        const reserved = jobs.reduce((n, j) => n + j.costs.filter(c => c.type === 'item' && c.actor === 'player' && c.key === key).reduce((total, c) => total - c.amount, 0), 0);
        assert(stock == null || natural(stock) && stock <= count(done[`${I.prefix}buy_${kind}`]) - consumed - reserved, 'The native bag exceeds its actual unspent and unreserved purchased batch stock.');
    }
}
