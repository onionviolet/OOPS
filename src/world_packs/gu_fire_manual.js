// PC95. The manual names a technique independently of what either side says
// about its order. Each step binds the same physical set of Gu.
import {applyEngineOps, startEngineWorking} from '../engine_world.js';
import {stableId} from '../simulation_ids.js';
import {defineComposition} from '../kernel_compose.js';
import {bindRecord, checkMethod, closeMethod, conditionAuthority, knowledgeRead, KNOWLEDGE_LAW,
    quoteRecord, recordsOf} from '../knowledge_record.js';
import {linkDistance, substratePort, worldLinks} from '../world_substrate.js';
import {concealedFrom} from '../world_effects.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {GU_REHEARSAL_FUEL, GU_REHEARSAL_LAW} from './gu_rehearsal_working.js';

export const FIRE_MANUAL_SUBJECT = 'gu.fire.kiln-manual';
const roles = {operator: 'operator', target: 'place', economy: 'gu', size: 'gu', core: 'gu'};
const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
const slots = ['first', 'second', 'third'].map(name => ({name, needs: roles, bindings, facts: 'shared'}));
const composition = defineComposition({id: FIRE_MANUAL_SUBJECT, revision: 1, roles, slots});
const makerMark = {id: 'kiln-maker-mark', kind: 'mark', role: 'operator',
    deny: {minutes: 4, costs: [{quantity: 'energy:attention', amount: 1}]},
    lapse: {costs: [{quantity: GU_REHEARSAL_FUEL, amount: 1}]}};
const trialReview = {id: 'gu.fire.trial-review', kind: 'trial', minutes: 1, missPermille: 0,
    costs: [{quantity: 'energy:attention', amount: 1}]};
const testimony = 'gu.fire.testimony';
const watching = 'gu.fire.watching';
const witnessed = 'gu.fire.witnessed';
const watchReview = {...trialReview, id: 'gu.fire.watch-review', kind: 'watch'};
const witnesses = {caster: 'operator', listener: 'operator'};
const forwardingRoles = {...witnesses, report: 'testimony'};
const remoteRoles = {observer: 'operator'};
const remoteSense = 'spirit';
const remoteReach = 2;
function tell(roles) {
    return {roles, minutes: 1, settle({bound: {caster, listener, report}, options, at, address}) {
        if (!canAttend(caster) || !listener.properties.alive || !caster.place || caster.place !== listener.place) {
            return {ok: false, reason: 'Testimony needs an attentive caster and a listener at the same place.'};
        }
        if (report && (report.holder !== caster.holder || report.cast !== options.cast ||
            report.participants.includes(listener.holder))) return {ok: false, reason: 'That report cannot be forwarded to this listener.'};
        const watch = report?.watch ?? options.watch;
        return {ok: true, costs: [{...trialReview.costs[0], payer: caster.holder}], effects: [
            {op: 'law_add', field: {id: testimony + '.' + address.replaceAll('/', '.'), scope: listener.holder,
                kind: testimony, params: {cast: options.cast, caster: caster.holder, record: options.record,
                    ...(watch && {watch}), ...(report && {parent: report.id})},
                until: Math.min(at + 10, report?.until ?? Infinity)}},
        ]};
    }};
}
export const FIRE_TESTIMONY_LAW = defineWorkingLaw({id: testimony, revision: 1, operations: {
    tell: tell(witnesses),
    forward: tell(forwardingRoles),
    'focus-watch': {roles: remoteRoles, minutes: 0, settle({bound: {observer}, options}) {
        if (!canAttend(observer) || !observer.place || !observer.properties.senses?.includes(remoteSense)) {
            return {ok: false, reason: 'A spirit watch needs attention and an available spirit sense.'};
        }
        const {id, cast, record} = options;
        return {ok: true, costs: [{...trialReview.costs[0], payer: observer.holder}],
            effects: [{op: 'law_add', field: {id, scope: observer.holder, kind: watching,
                params: {cast, record, channel: remoteSense}}}]};
    }},
}});
const book = {compositions: {[FIRE_MANUAL_SUBJECT]: composition}, fillers: Object.fromEntries([
    ['economy', 'fire-source'], ['size', 'enlarge'], ['core', 'red-fire'], ['marked-core', 'red-fire', 'core'],
].map(([filler, kind, role = filler]) => [filler, {law: GU_REHEARSAL_LAW, method: {id: 'gu.manual.' + filler, revision: 1,
    law: GU_REHEARSAL_LAW.ref, roles,
    steps: [{op: 'activate', bindings: {operator: 'operator', gu: role, target: 'target'}, options: {kind}}]},
    ...(filler === 'marked-core' && {conditions: [makerMark]}),
}]))};
function ordersWith(core) {
    const steps = ['economy', 'size', core];
    return steps.flatMap(first => steps.filter(second => second !== first).map(second =>
        ({first, second, third: steps.find(last => last !== first && last !== second)})));
}
const orders = [...ordersWith('core'), ...ordersWith('marked-core')];

// Every nonempty subset can be taught and attempted. The host registers each
// distinct law ref so a partial working also survives restore.
const slotSets = slots.reduce((sets, {name}) => [...sets, ...sets.map(set => [...set, name])], [[]]).slice(1);
const laws = new Map();
const conditionsByLaw = new Map();
for (const order of orders) {
    for (const names of slotSets) {
        const fillers = Object.fromEntries(names.map(name => [name, order[name]]));
        const key = JSON.stringify(fillers);
        if (laws.has(key)) continue;
        const {law, conditions} = bindRecord(book, {subject: {kind: 'composition', id: FIRE_MANUAL_SUBJECT},
            true: {fillers}, believed: {conditions: []}});
        laws.set(key, law);
        if (conditions.length) conditionsByLaw.set(law.ref, conditions);
    }
}
export const FIRE_MANUAL_LAWS = [...laws.values()];

function canWitness(world, observer, caster, channel) {
    if (!observer?.place || !observer.properties.alive || !observer.properties.senses?.includes(channel) ||
        concealedFrom(world, caster.id, channel)) return false;
    if (observer.place === caster.place) return true;
    return channel === remoteSense && linkDistance(worldLinks(world), observer.place, caster.place,
        {kinds: ['spirit'], maxCost: remoteReach}) !== null;
}

export function fireManualAuthority(request, {world, law}) {
    const conditions = conditionsByLaw.get(law);
    const result = conditions ? conditionAuthority(world, conditions)(request) : {ok: true};
    if (!result.ok) return result.costs?.length
        ? {...result, costs: result.costs.map(({holder, ...cost}) => ({...cost, payer: holder}))} : result;
    if (!FIRE_MANUAL_LAWS.some(row => row.ref === law)) return result;
    const caster = world.holders[request.bindings.operator.id];
    if (!caster?.place) return result;
    const effects = world.laws.filter(field => field.kind === watching && field.params.cast === request.working &&
        canWitness(world, world.holders[field.scope], caster, field.params.channel ?? 'sight'))
        .map(field => ({op: 'law_add', field: {id: field.id + '.' + request.step, kind: witnessed, scope: field.scope,
        params: {...field.params, step: request.step}}}));
    return {...result, effects: [...(result.effects ?? []), ...effects]};
}

function witnessedTrial(world, records, watchId) {
    const watch = world.laws.find(field => field.kind === watching && field.id === watchId);
    if (!watch) return null;
    const trial = records.workings[watch.params.cast]?.record;
    if (!trial || trial.status === 'running') return null;
    const caster = trial.bindings.operator?.id;
    const theirs = manualOf(world, caster, trial.facts.manualRecord);
    if (!theirs || !validFillers(theirs.true) || bindRecord(book, theirs).law.ref !== trial.law) return null;
    const receipts = trial.receipts.filter(row => row.ok && world.laws.some(field => field.kind === witnessed &&
        field.scope === watch.scope && field.id === watch.id + '.' + row.step && field.params.cast === watch.params.cast));
    return receipts.length ? {watch, other: {holder: caster, record: theirs.id}, working: {...trial, receipts}} : null;
}

function testimonyChain(world, report, watch) {
    const reports = new Set();
    const participants = new Set([report.scope]);
    const {cast} = report.params;
    let until = report.until;
    let current = report;
    for (;;) {
        const {caster, parent} = current.params;
        if (reports.has(current.id) || participants.has(caster) || current.params.watch !== watch.id ||
            current.params.cast !== cast || !(current.until > world.clock)) return null;
        reports.add(current.id);
        participants.add(caster);
        until = Math.min(until, current.until);
        if (!parent) return caster === watch.scope ? {participants: [...participants], until} : null;
        current = world.laws.find(field => field.kind === testimony && field.id === parent && field.scope === caster);
        if (!current) return null;
    }
}

export function readFireManualKnowledge(ref, _at, world, records) {
    if (ref.kind === 'mind') return knowledgeRead(world)(ref);
    if (!['evidence', 'testimony'].includes(ref.kind)) return null;
    const report = world.laws.find(field => field.kind === testimony && field.id === ref.id);
    const observed = witnessedTrial(world, records, report?.params.watch ?? ref.id);
    if (observed) {
        const {watch, other, working} = observed;
        const chain = report && testimonyChain(world, report, watch);
        if (report && (!chain || report.params.cast !== watch.params.cast)) return null;
        if (ref.kind === 'testimony') return chain ? {kind: ref.kind, id: ref.id, holder: report.scope,
            cast: watch.params.cast, watch: watch.id, ...chain} : null;
        const holder = report?.scope ?? watch.scope;
        const record = manualOf(world, holder, report?.params.record ?? watch.params.record);
        if (!record || !canReview(world, holder)) return null;
        return knowledgeRead(world, {book, evidence: {[ref.id]: {kind: 'watch', holder, record: record.id, other, working}}})(ref);
    }
    if (ref.kind === 'testimony' || report?.params.watch) return null;
    const cast = report?.params.cast ?? ref.id;
    const trial = records.workings[cast]?.record;
    const recordId = trial?.facts.manualRecord;
    const promise = trial?.facts.manualPromise;
    if (!recordId || !(trial.status === 'interrupted' || trial.status === 'complete' && promise)) return null;
    const caster = trial.bindings.operator.id;
    if (report && report.params.caster !== caster) return null;
    const holder = report?.scope ?? caster;
    const reviewed = report?.params.record ?? recordId;
    const record = manualOf(world, holder, reviewed);
    if (!record || !validFillers(record.true) || bindRecord(book, record).law.ref !== trial.law || !canReview(world, holder)) return null;
    // The forecast describes the operation's facts, excluding the evidence
    // references we store beside them on the real cast.
    const {manualRecord, manualPromise, ...facts} = trial.facts;
    const evidence = {kind: 'trial', holder, record: reviewed, working: {...trial, facts}, promise};
    return knowledgeRead(world, {book, evidence: {[ref.id]: evidence}})(ref);
}

export function closeFireManualMark(engine, {id, author, operator}) {
    const {world} = engine;
    const cost = makerMark.deny.costs[0];
    if ((world.holders[author]?.quantities[cost.quantity] ?? 0) < cost.amount ||
        world.laws.some(field => field.id === `closed.${operator}.${makerMark.id}.${world.clock}`)) {
        return engine;
    }
    return startEngineWorking(engine, {id, law: KNOWLEDGE_LAW, method: closeMethod(makerMark),
        payer: author,
        bindings: {closer: {kind: 'mind', id: author}, target: {kind: 'mind', id: operator}}});
}

function manualOf(world, operator, record) {
    const manual = recordsOf(world, operator)[record];
    return manual?.subject.kind === 'composition' && manual.subject.id === FIRE_MANUAL_SUBJECT ? manual : null;
}

function canAttend(operator) {
    const cost = trialReview.costs[0];
    return operator?.properties.alive === true && (operator.quantities[cost.quantity] ?? 0) >= cost.amount;
}
const canReview = (world, holder) => canAttend(world.holders[holder]);

export function reportFireManualTrial(engine, {id, caster, listener, cast, record, watch, parent}) {
    const trial = engine.records.workings[cast]?.record;
    const manual = manualOf(engine.world, listener, record);
    const observed = watch && witnessedTrial(engine.world, engine.records, watch);
    const source = parent && readFireManualKnowledge({kind: 'testimony', id: parent}, engine.world.clock, engine.world, engine.records);
    const authorized = parent ? !watch && source?.holder === caster && source.cast === cast && !source.participants.includes(listener)
        : watch ? observed?.watch.scope === caster && observed.watch.params.cast === cast
        : trial?.bindings.operator?.id === caster && trial?.facts.manualRecord &&
            ['complete', 'interrupted'].includes(trial.status) && manual && validFillers(manual.true) &&
            bindRecord(book, manual).law.ref === trial.law;
    if (caster === listener || !manual || !authorized) {
        return {engine, reason: 'trial-unavailable'};
    }
    const method = {id: testimony, revision: 1, law: FIRE_TESTIMONY_LAW.ref, roles: parent ? forwardingRoles : witnesses,
        steps: [{op: parent ? 'forward' : 'tell', bindings: {caster: 'caster', listener: 'listener', ...(parent && {report: 'report'})},
            options: {cast, record, ...(watch && {watch})}}]};
    return {engine: startEngineWorking(engine, {id, law: FIRE_TESTIMONY_LAW, method,
        bindings: {caster: {kind: 'operator', id: caster}, listener: {kind: 'operator', id: listener},
            ...(parent && {report: {kind: 'testimony', id: parent}})}})};
}

export function reviewFireManualTrial(engine, {id, operator, cast}) {
    const evidence = {kind: 'evidence', id: cast};
    const trial = readFireManualKnowledge(evidence, engine.world.clock, engine.world, engine.records);
    if (!trial || trial.holder !== operator) return {engine, reason: 'trial-unavailable'};
    const method = checkMethod(trial.route === 'watch' ? watchReview : trialReview, {record: trial.record});
    return {engine: startEngineWorking(engine, {id, law: KNOWLEDGE_LAW, method, payer: operator,
        bindings: {checker: {kind: 'mind', id: operator}, evidence}})};
}

export function watchFireManualTrial(engine, {id, operator, cast, record, channel = 'sight'}) {
    const observer = engine.world.holders[operator];
    const trial = engine.records.workings[cast]?.record;
    if (!stableId(id) || !['sight', remoteSense].includes(channel) ||
        !observer?.properties.alive || !observer.properties.senses?.includes(channel) ||
        trial?.status !== 'running' || trial.bindings.operator?.id === operator ||
        !trial.facts.manualRecord || !manualOf(engine.world, operator, record) ||
        engine.world.laws.some(field => field.id === id) || engine.records.workings[id]) return {engine, reason: 'watch-unavailable'};
    if (channel === remoteSense) {
        const method = {id: 'gu.fire.focus-watch', revision: 1, law: FIRE_TESTIMONY_LAW.ref, roles: remoteRoles,
            steps: [{op: 'focus-watch', minutes: 0, bindings: {observer: 'observer'}, options: {id, cast, record}}]};
        return {engine: startEngineWorking(engine, {id, law: FIRE_TESTIMONY_LAW, method,
            bindings: {observer: {kind: 'operator', id: operator}}})};
    }
    return {engine: applyEngineOps(engine, [{op: 'law_add', field: {id, scope: operator, kind: watching,
        params: {cast, record}}}], 'gu.fire.watch')};
}

function validFillers({fillers}) {
    const selected = slots.filter(({name}) => Object.hasOwn(fillers, name));
    return selected.length > 0 && Object.keys(fillers).length === selected.length &&
        orders.some(order => selected.every(({name}) => fillers[name] === order[name]));
}

export function quoteFireManual(engine, {operator, record, id, bindings}) {
    const manual = manualOf(engine.world, operator, record);
    if (!manual || bindings.operator?.id !== operator) return {ok: false, reason: 'record-unknown'};
    if (!validFillers(manual.believed)) return {ok: false, reason: 'manual-unsupported'};
    return quoteRecord(book, engine.world, operator, record, {id, bindings, read: substratePort(engine.world)});
}

export function startFireManual(engine, {operator, record, id, bindings}) {
    const manual = manualOf(engine.world, operator, record);
    if (!manual || bindings.operator?.id !== operator) return {engine, reason: 'record-unknown'};
    const preview = quoteFireManual(engine, {operator, record, id, bindings});
    if (!preview.ok) return {engine, reason: preview.reason};
    if (!validFillers(manual.true)) return {engine, reason: 'manual-unsupported'};
    const bound = bindRecord(book, manual);
    if (bound.conditions.length && !engine.host.ports.authority) throw Error('The marked manual needs its host authority.');
    const facts = {manualRecord: record, manualPromise: {facts: preview.facts, effects: preview.effects}};
    return {engine: startEngineWorking(engine, {...bound, id, bindings, facts})};
}
