// PC95. A nested Formation Plate working writes a shelter that a separate
// unloading procedure checks against the live world before transferring stock.
import {composeWorking, defineComposition} from '../kernel_compose.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {GU_FORMATION_PLATE_LAW, guFormationPlateMethod} from './gu_formation_plate.js';

const stock = 'stock:provisions';
const unload = 'gu.formation.unload';
const plateRoles = {operator: 'operator', plate: 'gu', site: 'place'};
const unloadRoles = {operator: 'operator', site: 'place', wagon: 'supply'};
const unloadLaw = defineWorkingLaw({id: 'gu.sheltered-unload', revision: 1, operations: {
    unload: {roles: unloadRoles, minutes: 2, settle({bound: {operator, site, wagon}, facts}) {
        if (!facts.formationField || operator.place !== site.holder || wagon.place !== site.holder) {
            return {ok: false, reason: 'The operator and wagon need to be at the shelter.'};
        }
        return {ok: true, effects: [{op: 'publish', kind: unload, place: site.holder, by: operator.holder,
            detail: {field: facts.formationField, wagon: wagon.holder}}]};
    }},
}});

const slot = (name, needs) => ({name, needs, facts: 'shared',
    bindings: Object.fromEntries(Object.keys(needs).map(role => [role, role]))});

export function shelteredSupplyWorking(duration) {
    const parts = ['inscribe', 'erect'];
    const install = composeWorking(defineComposition({id: 'gu.install-shelter', revision: 1, roles: plateRoles,
        slots: parts.map(name => slot(name, plateRoles))}), Object.fromEntries(parts.map(operation => [operation, {
        law: GU_FORMATION_PLATE_LAW, method: guFormationPlateMethod({operation, layout: 'shelter', previous: 'teleport', duration}),
    }])));
    const roles = {...plateRoles, ...unloadRoles};
    const loading = {law: unloadLaw, method: {id: 'gu.sheltered-unload', revision: 1, law: unloadLaw.ref,
        roles: unloadRoles, steps: [{op: 'unload', bindings: slot('unload', unloadRoles).bindings}]}};
    return composeWorking(defineComposition({id: 'gu.sheltered-supply', revision: 1, roles,
        slots: [slot('shelter', plateRoles), slot('supply', unloadRoles)]}), {shelter: install, supply: loading});
}

export const guFormationSupplyPack = {
    id: 'g.formation-supply', revision: 1, reads: [stock], writes: [stock],
    publishes: [unload, 'gu.formation.unloaded', 'gu.formation.unload-refused'], hears: [unload],
    reactors: [{
        id: 'shelter-unloading', on: [unload], appliesTo: holder => holder.kind === 'place',
        react(view, id, event) {
            if (event.place !== id) return [];
            const {field, wagon} = event.detail;
            const active = view.lawFields(id, 'block').some(row => row.id === field && row.scope === id &&
                row.params.verb === 'remove' && row.params.object === 'vitality');
            const report = (kind, detail) => ({op: 'publish', kind, place: id, detail});
            if (!active || wagon === id || view.holder(wagon)?.place !== id ||
                !view.has(wagon, stock) || view.amount(wagon, stock) < 1 || !view.has(id, stock) || view.amount(id, stock) >= WORLD_QUANTITIES.stock.max) {
                return [report('gu.formation.unload-refused', {field, wagon})];
            }
            return [{op: 'add', holder: wagon, quantity: stock, amount: -1}, {op: 'add', holder: id, quantity: stock, amount: 1},
                report('gu.formation.unloaded', {field, wagon})];
        },
    }],
};
