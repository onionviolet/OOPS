// Design record (E3, PC97; proposal under AD56). One view over what a thing is
// made from or by: a creature's genes, a potion's recipe row, a spell's effect
// sentence, a move's role record and a made thing's process method. Each keeps
// its native shape and its native law. This module reads any of them as a
// design with addressable parts and writes a changed design back, so an
// operator written once against the parts reaches every kind.
//
// Design: {kind, id, from?, parts: [{id, role, value, couples}], base}
//   part id   `<group>:<key>`: the address an operator names (gene:fleece, step:3).
//   role      what the part does in its design (a locus, a main ingredient, a slot).
//   value     the part's native value, copied; an operator changes this and nothing else.
//   couples   what the part touches outside itself, as `<type>:<name>` strings read
//             from the native rows (a constituent, a medium, a quantity). Read-only.
//   base      the native record the parts came from; what is not a part is kept here.
//
// A kind is a list of groups. Each group names one container in the native
// record (a map, or a list keyed by a field or by position), so reading and
// writing are the same few lines for every kind. Names no world and holds no
// numbers; the five kinds below describe shapes that already exist.
import {check, object} from './basics.js';

const clone = value => structuredClone(value);
const at = (root, path) => path.reduce((node, key) => node?.[key], root);
const names = value => object(value) ? Object.keys(value) : [];
const tagged = (type, list) => (list ?? []).filter(name => typeof name === 'string' && name).map(name => `${type}:${name}`);

const kinds = new Map();

// groups: [{group, at: [path], key?, role, couples?}]
//   at       path to the container inside the native record.
//   at       ... An empty path means the record itself is the container.
//   key      a list container's key field; omit for a list addressed by position.
//            A map container needs no key. A missing container has no parts.
//   list     true when the container is a list, so parts added to a record
//            that had none are written as a list.
//   role     a string, or (value, key) => string.
//   couples  (value, key, context) => [strings]; `context` is what the caller knows
//            beside the record (a genome row for genes), never written back.
// idAt: path to the record's own id, when it has one.
export function defineDesignKind({kind, groups, idAt = null}) {
    check(typeof kind === 'string' && kind && Array.isArray(groups) && groups.length > 0, 'A design kind needs a name and part groups.');
    const seen = new Set();
    for (const group of groups) {
        check(object(group) && typeof group.group === 'string' && !group.group.includes(':') && !seen.has(group.group) &&
            Array.isArray(group.at), `Design kind ${kind} has an invalid group.`);
        seen.add(group.group);
    }
    kinds.set(kind, {kind, groups, idAt});
    return kind;
}

const kindOf = kind => { check(kinds.has(kind), `No design kind ${kind}.`); return kinds.get(kind); };
export const designKinds = () => [...kinds.keys()];

function entries(group, container) {
    if (Array.isArray(container)) return container.map((entry, index) => {
        return [String(group.key ? entry[group.key] : index), entry];
    });
    return object(container) ? Object.entries(container) : [];
}

/** Native record -> design. `context` only feeds `couples`. */
export function readDesign(kind, native, {id, context = {}} = {}) {
    const def = kindOf(kind);
    check(object(native), 'A design is read from a native record.');
    const parts = [];
    for (const group of def.groups) for (const [key, value] of entries(group, at(native, group.at))) {
        parts.push({id: `${group.group}:${key}`, role: typeof group.role === 'function' ? group.role(value, key) : group.role,
            value: clone(value), couples: group.couples ? group.couples(value, key, context) : []});
    }
    return {kind, id: id ?? (def.idAt ? at(native, def.idAt) : null) ?? null, parts, base: clone(native)};
}

/** Design -> native record. Parts are written in their listed order, so a
 * design read and written unchanged gives back an equal record. A part an
 * operator removed or added is removed or added in its container. */
export function writeDesign(design) {
    const def = kindOf(design.kind);
    let native = clone(design.base);
    for (const group of def.groups) {
        if (!group.at.length) { native = Object.fromEntries(design.parts.map(part => [part.id.slice(group.group.length + 1), clone(part.value)])); continue; }
        const parent = at(native, group.at.slice(0, -1)), last = group.at.at(-1);
        const mine = design.parts.filter(part => part.id.startsWith(`${group.group}:`))
            .map(part => [part.id.slice(group.group.length + 1), clone(part.value)]);
        const was = parent?.[last];
        if (was === undefined && !mine.length) continue;
        check(object(parent), `Design ${design.id ?? design.kind} has no place for ${group.group} parts.`);
        if (Array.isArray(was) || (was === undefined && group.list)) {
            // The key field stays where the entry had it; the part id decides its value.
            parent[last] = mine.map(([key, value]) => !group.key || String(value[group.key]) === key ? value : {...value, [group.key]: key});
        } else parent[last] = Object.fromEntries(mine);
    }
    if (def.idAt && design.id != null) at(native, def.idAt.slice(0, -1))[def.idAt.at(-1)] = design.id;
    return native;
}

export const designPart = (design, partId) => design.parts.find(part => part.id === partId) ?? null;
/** Every part that touches the named thing (`constituent:charge`, `medium:oven`). */
export const partsCoupledTo = (design, name) => design.parts.filter(part => part.couples.includes(name));

// --- Operators (PC97). Two of the six; the rest are a later wave on this record.
// An operator is a plain change to parts. It does not judge the result: the
// native law does, when the written design runs, and that is where a changed
// design earns a different outcome or a fault. Price and skill belong to the
// working that carries the operator, not to this module.

/** Edit one part. `change` is the new value or (old, part) => new value.
 * Naming a part the design lacks changes nothing and says so (`missed`). */
export function editPart(design, partId, change) {
    const index = design.parts.findIndex(part => part.id === partId);
    if (index < 0) return {design, receipt: {op: 'edit', design: design.id, part: partId, missed: true}};
    const part = design.parts[index], before = clone(part.value);
    const after = clone(typeof change === 'function' ? change(clone(part.value), part) : change);
    const parts = design.parts.map((p, i) => i === index ? {...p, value: after} : p);
    return {design: {...design, parts}, receipt: {op: 'edit', design: design.id, part: partId, before, after}};
}

/** Copy a design. The copy has every part of the original, so it has every
 * strength and every weakness of it; `from` keeps the line back to the source. */
export function copyDesign(design, {id = design.id} = {}) {
    return {design: {...clone(design), id, from: design.id},
        receipt: {op: 'copy', design: id, from: design.id, parts: design.parts.length}};
}

// --- The five native shapes.

// A creature: {genes: {locus: [allele, allele]}, breeding?: {trait: value}}, the
// two heritable fields of a lifecycle individual (heredity.js). context.genome
// is the kind's genome row; it says what each locus affects and needs to show.
defineDesignKind({kind: 'creature', groups: [
    {group: 'gene', at: ['genes'], role: 'locus', couples(value, key, {genome}) {
        const locus = genome?.loci?.[key];
        if (!locus) return [];
        return [...tagged('trait', [locus.affects]), ...tagged('quantity', [locus.shows?.needs?.quantity]),
            ...tagged('condition', locus.shows?.suppressedBy), ...(locus.shows?.mature ? ['growth:mature'] : [])];
    }},
    {group: 'breeding', at: ['breeding'], role: 'breeding-value', couples: (value, key) => [`trait:${key}`]},
]});

// A potion: a brew pack row {id, slots: [{id, role, material, amount, properties}],
// method: {steps: [{op, bindings, minutes, options}]}, ...} (brew_law.js brewMethod
// and its packs). An ingredient couples to the constituents it carries; a step
// couples to the constituents its reactions and rules read and make.
const stepConstituents = options => [...new Set([
    ...(options?.reactions ?? []).flatMap(r => [...names(r.reactants), ...names(r.products), ...(r.catalyst ? [r.catalyst] : [])]),
    ...[options?.active, options?.extract, options?.degraded, options?.solvent, options?.reversal?.from, options?.reversal?.to,
        options?.cadence?.from, options?.cadence?.to].filter(Boolean)])];
defineDesignKind({kind: 'recipe', idAt: ['id'], groups: [
    {group: 'slot', at: ['slots'], key: 'id', list: true, role: value => value.role ?? 'ingredient',
        couples: value => [...tagged('material', [value.material]), ...tagged('constituent', names(value.properties))]},
    {group: 'step', at: ['method', 'steps'], list: true, role: value => value.op,
        couples: value => [...tagged('slot', [value.bindings?.lot]), ...tagged('constituent', stepConstituents(value.options))]},
]});

// A spell: one effect sentence {verb, object, target, time, carrier, cost,
// direction?, limits} (effect_grammar.js, spell_effects.js). Every field is a
// slot. Couplings are the grammar's own: object, target and time are given by
// the verb, cost by the carrier, and reach, time and limits set the scope.
const SLOT_COUPLES = {verb: ['slot:object', 'slot:target', 'slot:time'], object: ['slot:verb'], direction: ['slot:verb'],
    target: ['derived:scope'], time: ['derived:scope'], limits: ['derived:scope'], carrier: ['slot:cost'], cost: ['slot:carrier']};
defineDesignKind({kind: 'spell', groups: [
    {group: 'slot', at: [], role: (value, key) => key, couples: (value, key) => SLOT_COUPLES[key] ?? []},
]});

// A move: a role record {id, roles: [{id, kind | function, type?, minutes?}],
// operator?, ordered?, grammar?} (gu_move_roles.js compileGuMove). A role couples
// to the thing kind or the function that can fill it.
defineDesignKind({kind: 'move', idAt: ['id'], groups: [
    {group: 'role', at: ['roles'], key: 'id', list: true, role: value => value.type ?? (value.kind ? 'filler' : 'context'),
        couples: value => [...tagged('kind', [value.kind]), ...tagged('function', [value.function ?? value.fn])]},
]});

// A composition definition {id, revision, roles, slots: [{name, needs, bindings,
// facts}]} (kernel_compose.js defineComposition): the same idea one level down.
defineDesignKind({kind: 'composition', idAt: ['id'], groups: [
    {group: 'slot', at: ['slots'], key: 'name', list: true, role: value => value.hold ? 'held' : 'part',
        couples: value => [...tagged('role', Object.values(value.bindings ?? {})), `facts:${value.facts}`]},
]});

// A made thing: a process method's input {id, revision, steps: [{op, medium,
// tool?, minutes}], rows, projection} (process_law.js processMethod), with the
// starting piece beside it as `piece` when the caller keeps one blueprint.
defineDesignKind({kind: 'made', idAt: ['id'], groups: [
    {group: 'step', at: ['steps'], list: true, role: value => value.op,
        couples: value => [...tagged('medium', [value.medium]), ...tagged('tool', [value.tool])]},
    {group: 'row', at: ['rows'], key: 'id', list: true, role: value => value.scalar ? 'drift' : 'transfer',
        couples: value => [...tagged('share', [value.from, value.to]), ...tagged('scalar', [value.scalar]),
            ...tagged('tool-property', [value.driveBy]), ...tagged('medium-property', names(value.needs?.medium))]},
    {group: 'property', at: ['projection'], role: 'projection',
        couples: value => [...tagged('share', names(value.shares)), ...tagged('scalar', names(value.scalars))]},
    {group: 'share', at: ['piece', 'shares'], role: 'material', couples: (value, key) => [`share:${key}`]},
    {group: 'scalar', at: ['piece', 'scalars'], role: 'material', couples: (value, key) => [`scalar:${key}`]},
]});
