// PC95. An authored Gu activation ends one addressed field through the effect host.
import {resolveGuActivation} from '../gu_activation.js';
import {guWorldUseReason} from '../gu_world_use.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {stableId} from '../simulation_ids.js';

const fuel = 'energy:primeval.rank1';
const roles = {operator: 'operator', specimen: 'gu', target: 'creature'};
const reportRoles = {observer: 'operator', recipient: 'operator', target: 'creature'};
const attention = 'energy:mental';
const ability = {fuel: 'primeval', cost: 2};
const refuse = reason => ({ok: false, reason});
const wardNotes = 'gu_ward_notes';
export const GU_WARD_EVIDENCE = [{id: 'gu_seen_ward', type: 'label'}, {id: 'gu_seen_ward_subject', type: 'label'},
    {id: wardNotes, type: 'set'}];

function wardPrefix(subject, layer) {
    return `${subject}/${layer ? `${layer}/` : ''}`;
}

function notedWard(properties, subject, layer) {
    const prefix = wardPrefix(subject, layer);
    return properties[wardNotes]?.find(note => note.slice(0, note.lastIndexOf('/') + 1) === prefix)?.slice(prefix.length) ??
        (!layer && properties.gu_seen_ward_subject === subject ? properties.gu_seen_ward : undefined);
}

export function rememberWard(holder, properties, subject, field, layer) {
    return rememberWards(holder, properties, subject, [{field, layer}]);
}

export function rememberWards(holder, properties, subject, observations) {
    if (!observations.length) return [];
    const notes = [...(properties[wardNotes] ?? [])];
    const previous = properties.gu_seen_ward_subject;
    if (stableId(previous) && stableId(properties.gu_seen_ward) && !notedWard({[wardNotes]: notes}, previous)) {
        notes.push(`${previous}/${properties.gu_seen_ward}`);
    }
    const updates = new Map(observations.map(({field, layer}) => [wardPrefix(subject, layer), field]));
    const value = [...notes.filter(note => !updates.has(note.slice(0, note.lastIndexOf('/') + 1))),
        ...Array.from(updates, ([prefix, field]) => `${prefix}${field}`)];
    const primary = updates.get(wardPrefix(subject));
    return [
        {op: 'property', holder, property: wardNotes, value},
        ...(primary ? [
            {op: 'property', holder, property: 'gu_seen_ward', value: primary},
            {op: 'property', holder, property: 'gu_seen_ward_subject', value: subject},
        ] : []),
    ];
}

export const GU_WARD_BREAK_LAW = defineWorkingLaw({id: 'gu.ward-break', revision: 1, operations: {
    report: {roles: reportRoles, minutes: 1, settle({bound: {observer, recipient, target}, options: {layer}}) {
        const field = notedWard(observer.properties, target.holder, layer);
        if (observer.properties.alive !== true || recipient.properties.alive !== true || observer.id === recipient.id ||
            !observer.place || observer.place !== recipient.place ||
            !stableId(field) || !(observer.quantities[attention] >= 1)) {
            return refuse('Reporting needs a known ward, mental energy and a listener within reach.');
        }
        return {ok: true, costs: [{quantity: attention, payer: observer.holder, amount: 1}],
            effects: rememberWard(recipient.holder, recipient.properties, target.holder, field, layer)};
    }},
    sever: {roles, minutes: 1, settle({bound: {operator, specimen, target}, options, at}) {
        const p = specimen.properties;
        const field = options.learned ? notedWard(operator.properties, target.holder, options.layer) : options.field;
        if (operator.properties.alive !== true || !operator.place || target.place !== operator.place ||
            p.gu_kind !== 'ward-cutter' || !stableId(field)) return refuse('The counter needs an addressed field within reach.');
        const reason = guWorldUseReason(specimen, operator.id, operator.place, at);
        if (reason) return refuse(reason);
        const gu = {id: specimen.holder, kind: p.gu_kind, alive: p.alive === true, injured: p.injured,
            fedThrough: specimen.quantities.satiety > 0 ? at : at - 1};
        const cast = resolveGuActivation({stages: [{gu, operator: operator.id, ability}], day: at,
            reserves: {[operator.id]: {primeval: operator.quantities[fuel] ?? 0}}});
        if (cast.outcome !== 'complete') return refuse(cast.reason);
        return {ok: true, costs: [{quantity: fuel, payer: operator.holder, amount: cast.activations[0].cost}],
            effects: [{
                sentence: {verb: 'end', object: 'law', target: 'bound', time: 'instant', carrier: 'gu', cost: 'none', limits: []},
                details: {target: {shape: 'holder', id: target.holder}, field},
            }]};
    }},
}});

export const guWardReportWorking = {id: 'gu.ward-break.report', revision: 1, law: GU_WARD_BREAK_LAW.ref, roles: reportRoles,
    steps: [{op: 'report', bindings: {observer: 'observer', recipient: 'recipient', target: 'target'}}]};

export function guWardLayerReportWorking(layer) {
    return {...guWardReportWorking, steps: [{...guWardReportWorking.steps[0], options: {layer}}]};
}

export const guWardBreakWorking = (field, {layer} = {}) => ({id: 'gu.ward-break.sever', revision: 1, law: GU_WARD_BREAK_LAW.ref, roles,
    steps: [{op: 'sever', bindings: {operator: 'operator', specimen: 'specimen', target: 'target'},
        options: field === undefined ? {learned: true, ...(layer && {layer})} : {field}}]});
