// Reusable install/remove service for implants and borrowed-body support (G4).
// Generalizes the one-specimen brass-lung proof in backlog_expansion_body.js.
// An implant definition is data: {id, slot, forms, requires, sourceId,
// skillIds, shifts, bodyFlag}. Default: it fits a body whose form is listed,
// whose required properties are true and whose slot is free; installing adds
// the implant as a *supplier* of its source and of each skill it supports, and
// removing drops only that supplier. A skill therefore stays while any support
// remains (another implant, a lesson, a temporary copy) and its shifts clear
// with its last supplier (source_suppliers.js). Dial: worlds author the
// definitions; the in-world reason for a non-fit is the returned message.
import {check} from './basics.js';
import {grantSource, removeSource} from './source_suppliers.js';

export const implantSupplier = implantId => `implant:${implantId}`;
export const equipSupplier = key => `equip:${key}`;

/** Why this implant does not fit this body, or [] when it fits. Pure. */
export function implantFitReasons(body, implant) {
    const reasons = [];
    if(!body) return ['There is no physical body to fit this to.'];
    if(implant.forms && !implant.forms.includes(body.form)) reasons.push(`${implant.id} fits only ${implant.forms.join(' or ')} bodies.`);
    for(const prop of implant.requires || []) if(body[prop] !== true) reasons.push(`The body lacks ${prop}.`);
    const taken = body.implants?.[implant.slot] ?? (implant.bodyFlag && body[implant.bodyFlag]);
    if(taken) reasons.push(`The ${implant.slot} slot is already taken.`);
    return reasons;
}

const definitionFor = (implant, id) => ({id, revision: implant.sourceRevision ?? 1});

/**
 * Install onto a body that belongs to actorId. Mutates plan.state only.
 * `active`/`awakened` set the supported source's starting state (an unlearned
 * implant can sit dormant). Returns the body.
 */
export function installImplant(plan, {actorId, implant, body, cause, active = true}) {
    const reasons = implantFitReasons(body, implant);
    check(!reasons.length, reasons[0] || 'This implant does not fit.');
    const state = plan.state, supplier = implantSupplier(implant.id);
    (body.implants ||= {})[implant.slot] = implant.id;
    if(implant.bodyFlag) body[implant.bodyFlag] = implant.id;
    for(const [index, sourceId] of [implant.sourceId, ...(implant.skillIds || [])].filter(Boolean).entries()) {
        const existing = state.actors[actorId].sources[sourceId];
        check(index === 0 ? !existing || existing.suppliers : true, 'This physical source is already present.');
        grantSource(state, actorId, definitionFor(implant, sourceId), {supplier, origin: 'acquired', receiptId: cause, awakened: active, active,
            shifts: index === 0 ? implant.shifts : null});
    }
    return body;
}

/** Remove the implant. Each supported source loses only this supplier. */
export function removeImplant(plan, {actorId, implant, body}) {
    check(body?.implants?.[implant.slot] === implant.id, 'That implant is not installed here.');
    delete body.implants[implant.slot];
    if(!Object.keys(body.implants).length) delete body.implants;
    if(implant.bodyFlag) delete body[implant.bodyFlag];
    const gone = [];
    for(const sourceId of [implant.sourceId, ...(implant.skillIds || [])].filter(Boolean))
        if(removeSource(plan.state, actorId, sourceId, {supplier: implantSupplier(implant.id)})) gone.push(sourceId);
    return gone;
}

/**
 * Equip-time hook. A source definition lists `onEquip: [itemKey, ...]`; equipping
 * a listed item adds an `equip:<key>` supplier, unequipping drops it. Call with
 * the slot's old and new item keys after the slot has changed.
 */
export function syncEquipSources(state, actorId, registry, oldKey, newKey, receiptId) {
    if(oldKey === newKey || !registry?.sources) return;
    for(const definition of registry.sources.values()) {
        const keys = definition.onEquip;
        if(!Array.isArray(keys)) continue;
        if(oldKey != null && keys.includes(oldKey)) removeSource(state, actorId, definition.id, {supplier: equipSupplier(oldKey)});
        if(newKey != null && keys.includes(newKey)) grantSource(state, actorId, definition, {supplier: equipSupplier(newKey), origin: 'acquired', receiptId, awakened: true, active: true});
    }
}

/** Public lines for the existing body panel: installed implants and what each supports. */
export function implantRecords(state, actorId = 'player') {
    const body = state.simulation?.people[actorId]?.body, sources = state.actors[actorId]?.sources || {};
    return Object.entries(body?.implants || {}).sort(([a], [b]) => a.localeCompare(b)).map(([slot, implantId]) => {
        const supports = Object.entries(sources).filter(([, instance]) => instance.suppliers?.[implantSupplier(implantId)])
            .map(([sourceId, instance]) => `${sourceId}${Object.keys(instance.suppliers).length > 1 ? ` (${Object.keys(instance.suppliers).length} supports)` : ''}`);
        return `Implant ${implantId} in your ${slot}: ${supports.length ? `supports ${supports.join(', ')}` : 'supports nothing yet'}.`;
    });
}
