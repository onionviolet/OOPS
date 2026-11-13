// PC95 / ENF17. The enchanted blade improves the quality and time of an
// existing harvest. The carcass holder owns availability and the output
// holder keeps the exact item key from the harvest/lineage owner.
import {drawSpecimen, gradedKey, planHarvest, validateGradedKey, validateSpecimen} from '../harvest.js';
import {harvestedMaterialOutput} from '../processed_materials.js';
import {planProcessedMaterial, readMaterialLineage} from '../material_lineage.js';
import {KNOWLEDGE_KINDS} from '../knowledge_record.js';
import {applyEngineOps, startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {substratePort} from '../world_substrate.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const CARCASS_STOCK = 'stock:workshop_carcass';
export const HARVEST_STOCK = 'stock:workshop_harvest';
export const COATING_STOCK = 'stock:workshop_edge_coating';
export const MENDING_FUEL = 'energy:workshop_mending';
export const PRESERVATION_INK = 'stock:workshop_preservation_ink';
export const HANDLING_LOSS = 'workshop.harvest_handling_loss';
export const TANNING_STOCK = 'stock:workshop_tanning';
const PRESERVES = 'workshop.harvest_preserves';
const EDGE = 'workshop.harvest_edge';
const COATING = 'workshop.harvest_coating';
const SELF_MENDING = 'workshop.harvest_self_mending';
const EDGE_WORN = 'workshop.harvest_edge_worn';
export const HARVEST_KEY = 'workshop.harvest_key';
const KEY = HARVEST_KEY;
const SPECIES = 'workshop.harvest_species';
const BORN = 'workshop.harvest_born';
const SPECIMEN = 'workshop.harvest_specimen';
const OWNER = 'workshop.held_by';
const roles = {harvester: 'body', tool: 'harvest_tool', carcass: 'harvest_carcass', output: 'harvest_output'};
const treatmentRoles = {harvester: roles.harvester, tool: roles.tool};
const studyRoles = {harvester: roles.harvester, output: roles.output};
const tanningRoles = {harvester: roles.harvester, pelt: roles.output, output: roles.output};
const edgeOf = tool => Math.floor((tool.properties[EDGE] ?? 0) * (tool.quantities.condition ?? 100) / 100);
const held = (tool, harvester) => tool.properties[OWNER] === harvester.holder && tool.place === harvester.place;
const repairAmount = condition => Math.min(25, WORLD_QUANTITIES.condition.max - condition);
const restoreEdge = (holder, amount) => ({op: 'add', holder, quantity: 'condition', amount});
const matches = ({harvester, tool, carcass, output}) => tool.holder !== output.holder &&
    held(tool, harvester) && tool.quantities.condition !== 0 && carcass.place === harvester.place &&
    output.place === harvester.place && output.properties[OWNER] === harvester.holder &&
    carcass.quantities[CARCASS_STOCK] === 1 && output.quantities[HARVEST_STOCK] === 0 && !output.properties[KEY];

// Older carcasses were authored with a fixed draw. New wild remains carry the
// specimen drawn at death, including its original creature key.
function plan(carcass, tool, at) {
    const saved = carcass.properties[SPECIMEN];
    const specimen = saved ? validateSpecimen(JSON.parse(saved), at) :
        drawSpecimen({species: carcass.properties[SPECIES], key: carcass.holder, clock: carcass.properties[BORN]}, () => .5);
    const context = {clock: at, skill: 0, tool: edgeOf(tool)};
    const harvest = planHarvest(specimen, 'pelt', context);
    const [pelt] = harvest.outputs;
    const loss = tool.properties[PRESERVES] ? 0 : carcass.properties[HANDLING_LOSS] ?? 0;
    const integrity = Math.max(0, pelt.integrity - loss);
    // Handling can lower the carcass grade. A preservation mark cannot mend old damage.
    let completeness = pelt.completeness;
    if (loss && integrity < 40) completeness = 'scraps';
    else if (loss && integrity < 75 && completeness === 'whole') completeness = 'damaged';
    const key = gradedKey('Rat pelt', pelt.quality, completeness);
    return {...harvest, outputs: [harvestedMaterialOutput(specimen,
        {...pelt, integrity, completeness, item_key: key}, context)]};
}

export function harvestableRemains({id, clock, draw}, species) {
    const specimen = drawSpecimen({species, key: id, clock, damage: {hits: 0, crits: 0, overkill: 0, type: 'physical'}}, draw);
    return {id: `${id}.remains`, as: [roles.carcass], retain: [CARCASS_STOCK],
        properties: {[SPECIMEN]: JSON.stringify(specimen)}};
}

const law = defineWorkingLaw({id: 'workshop.enchanted_harvest', revision: 1, operations: {
    preserve: {roles: treatmentRoles, settle({bound: {harvester, tool}}) {
        if (!held(tool, harvester) || tool.quantities.condition === 0 || tool.properties[PRESERVES] ||
            !(harvester.quantities[PRESERVATION_INK] >= 1))
            return {ok: false, reason: 'Bring an unmarked, usable blade and preservation ink.'};
        return {ok: true, costs: [{quantity: PRESERVATION_INK, payer: harvester.holder, amount: 1}],
            effects: [{op: 'property', holder: tool.holder, property: PRESERVES, value: true}]};
    }},
    study: {roles: studyRoles, settle({bound: {harvester, output}, options: {key}, at}) {
        if (!held(output, harvester) || output.quantities[HARVEST_STOCK] < 1 || !key || output.properties[KEY] !== key)
            return {ok: false, reason: 'Keep the same pelt with you until the study is finished.'};
        const item = validateGradedKey(key);
        const specimen = readMaterialLineage(key)?.history.at(-1)?.inputs[0]?.facts.evidence?.specimen;
        if (item.id !== 'Rat pelt' || item.completeness !== 'whole' || !specimen)
            return {ok: false, reason: 'An intact pelt is needed to trace the whole coat.'};
        return {ok: true, observed: {specimen: specimen.key}, effects: [{
            op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: harvester.place, by: harvester.holder,
            detail: {owner: 'N', knowledge: {to: harvester.holder, record: {
                id: `workshop.coat:${specimen.key}`, subject: {kind: 'fact', id: specimen.key},
                true: {holder: output.holder, property: KEY}, believed: {value: key},
                source: {kind: 'observation', by: harvester.holder, from: output.holder, at},
            }}}},
        ]};
    }},
    tanWhole: {roles: tanningRoles, settle({bound: {harvester, pelt, output}, options: {key}, at}) {
        if (pelt.holder === output.holder || !held(pelt, harvester) || !held(output, harvester) ||
            pelt.quantities[HARVEST_STOCK] !== 1 || !key || pelt.properties[KEY] !== key ||
            output.quantities[HARVEST_STOCK] !== 0 || output.properties[KEY] || !(harvester.quantities[TANNING_STOCK] >= 1))
            return {ok: false, reason: 'Bring the same pelt, an empty rest and tanning supplies.'};
        const item = validateGradedKey(key);
        if (item.id !== 'Rat pelt' || item.completeness !== 'whole')
            return {ok: false, reason: 'This treatment needs a whole pelt.'};
        const product = planProcessedMaterial({stock: {[key]: 1}, inputs: [{item_key: key, count: 1}],
            output: {id: 'Processed rat pelt', family: 'animal-hide', count: 1, quality: item.quality},
            process: {id: 'workshop.tan_whole_pelt', revision: 1, at, world_id: 'workshop'}});
        return {ok: true, observed: {source: pelt.holder, output: output.holder}, costs: [
            {quantity: HARVEST_STOCK, payer: pelt.holder, amount: 1},
            {quantity: TANNING_STOCK, payer: harvester.holder, amount: 1},
        ], effects: [
            {op: 'property', holder: pelt.holder, property: KEY, value: null},
            {op: 'property', holder: output.holder, property: KEY, value: product.item_key},
            {op: 'add', holder: output.holder, quantity: HARVEST_STOCK, amount: 1},
        ]};
    }},
    coat: {roles: treatmentRoles, settle({bound: {harvester, tool}}) {
        if (!held(tool, harvester) || !(tool.quantities.condition > 0) || tool.properties[COATING] ||
            !(harvester.quantities[COATING_STOCK] >= 1))
            return {ok: false, reason: 'Bring coating stock and a working, uncoated edge.'};
        return {ok: true, costs: [{quantity: COATING_STOCK, payer: harvester.holder, amount: 1}],
            effects: [{op: 'property', holder: tool.holder, property: COATING, value: true}]};
    }},
    mend: {roles: treatmentRoles, settle({bound: {harvester, tool}}) {
        const condition = tool.quantities.condition;
        if (!held(tool, harvester) || condition === undefined)
            return {ok: false, reason: 'Keep the blade in your custody to mend it.'};
        const restored = repairAmount(condition);
        if (!restored) return {ok: true, observed: {restored: 0}};
        if (!(tool.quantities[MENDING_FUEL] >= 1))
            return {ok: false, reason: 'The blade has no mending fuel left.'};
        return {ok: true, observed: {restored}, costs: [{quantity: MENDING_FUEL, payer: tool.holder, amount: 1}],
            effects: [restoreEdge(tool.holder, restored)]};
    }},
    harvest: {roles, settle({bound, options: {edge, condition}, at}) {
        const {tool, carcass, output} = bound;
        if (!matches(bound) || (tool.properties[EDGE] ?? 0) !== edge ||
            (condition !== undefined && tool.quantities.condition !== condition))
            return {ok: false, reason: 'The tool, carcass or empty harvest holder changed.'};
        const [pelt] = plan(carcass, tool, at).outputs;
        const conditionNow = tool.quantities.condition;
        const wear = conditionNow === undefined ? [] : tool.properties[COATING]
            ? [{op: 'property', holder: tool.holder, property: COATING, value: null}]
            : [restoreEdge(tool.holder, -Math.min(conditionNow, 25)),
                ...(tool.properties[SELF_MENDING] ? [{op: 'publish', kind: EDGE_WORN, place: tool.place, by: tool.holder}] : [])];
        return {ok: true, observed: {tool: tool.holder, carcass: carcass.holder, quality: pelt.quality, completeness: pelt.completeness},
            costs: [{quantity: CARCASS_STOCK, payer: carcass.holder, amount: 1}],
            effects: [{op: 'property', holder: output.holder, property: KEY, value: pelt.item_key},
                {op: 'add', holder: output.holder, quantity: HARVEST_STOCK, amount: pelt.count}, ...wear]};
    }},
}});

export const harvestMendingPack = {
    id: 'workshop.harvest_mending', revision: 1,
    properties: [{id: SELF_MENDING, type: 'flag'}], hears: [EDGE_WORN], writes: ['condition', 'energy'],
    reactors: [{id: 'mend-edge', on: [EDGE_WORN], appliesTo: holder => holder.as.includes(roles.tool),
        react(view, id, event) {
            if (event.by !== id || !view.property(id, SELF_MENDING) ||
                !view.has(id, 'condition') || !view.has(id, MENDING_FUEL) || view.amount(id, MENDING_FUEL) < 1) return [];
            const restored = repairAmount(view.amount(id, 'condition'));
            return restored ? [{op: 'add', holder: id, quantity: MENDING_FUEL, amount: -1}, restoreEdge(id, restored)] : [];
        },
    }],
};

export const enchantedHarvestConfig = {ownPacks: [harvestMendingPack], shared: {quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.condition, WORLD_QUANTITIES.energy], properties: [
    {id: OWNER, type: 'label'}, {id: KEY, type: 'label'}, {id: SPECIES, type: 'label'}, {id: SPECIMEN, type: 'label'},
    {id: BORN, type: 'level', min: 0, max: Number.MAX_SAFE_INTEGER}, {id: EDGE, type: 'level', min: 0, max: 150},
    {id: COATING, type: 'flag'}, {id: PRESERVES, type: 'flag'}, {id: HANDLING_LOSS, type: 'level', min: 0, max: 100},
]}, host: {laws: [law]}};

export function bindHarvestMending(engine, {harvester, tool}) {
    const read = substratePort(engine.world);
    const blade = read({kind: roles.tool, id: tool}), bearer = read({kind: roles.harvester, id: harvester});
    if (!engine.rules.packs.includes(harvestMendingPack.id) || !blade || !bearer || !held(blade, bearer) ||
        blade.quantities.condition === undefined || blade.quantities[MENDING_FUEL] === undefined)
        throw Error('Bind mending to a held blade with a condition and fuel account.');
    return applyEngineOps(engine, [{op: 'property', holder: blade.holder, property: SELF_MENDING, value: true}], 'workshop:bind-mending');
}

export function startEnchantedHarvest(engine, {id, harvester, tool, carcass, output}) {
    const holders = {harvester, tool, carcass, output};
    const bindings = Object.fromEntries(Object.entries(roles).map(([role, kind]) => [role, {kind, id: holders[role]}]));
    const read = substratePort(engine.world);
    const bound = Object.fromEntries(Object.entries(bindings).map(([role, ref]) => [role, read(ref)]));
    if (!Object.values(bound).every(Boolean) || !matches(bound)) throw Error('Bring the tool, carcass and empty harvest holder.');
    const minutes = plan(bound.carcass, bound.tool, engine.world.clock).minutes;
    const method = {id: law.id, law: law.ref, revision: 1, roles, steps: [{op: 'harvest', minutes,
        options: {edge: bound.tool.properties[EDGE] ?? 0, ...(bound.tool.quantities.condition !== undefined
            ? {condition: bound.tool.quantities.condition} : {})},
        bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
    return startEngineWorking(engine, {id, law, method, bindings});
}

export function startHarvestCoating(engine, {id, harvester, tool}) {
    return startHarvestTreatment(engine, {id, harvester, tool, op: 'coat', pulses: 1});
}

export function startHarvestPreservation(engine, {id, harvester, tool}) {
    return startHarvestTreatment(engine, {id, harvester, tool, op: 'preserve', pulses: 1});
}

export function startPeltStudy(engine, {id, harvester, output}) {
    const key = engine.world.holders[output]?.properties[KEY] ?? null;
    return startEngineWorking(engine, {id, law,
        method: {id: law.id, law: law.ref, revision: 1, roles: studyRoles,
            steps: [{op: 'study', minutes: 2, options: {key}, bindings: {harvester: 'harvester', output: 'output'}}]},
        bindings: {harvester: {kind: 'body', id: harvester}, output: {kind: roles.output, id: output}}});
}

export function startWholePeltTanning(engine, {id, harvester, pelt, output}) {
    const key = engine.world.holders[pelt]?.properties[KEY] ?? null;
    return startEngineWorking(engine, {id, law,
        method: {id: law.id, law: law.ref, revision: 1, roles: tanningRoles,
            steps: [{op: 'tanWhole', minutes: 3, options: {key}, bindings: {harvester: 'harvester', pelt: 'pelt', output: 'output'}}]},
        bindings: {harvester: {kind: 'body', id: harvester}, pelt: {kind: roles.output, id: pelt},
            output: {kind: roles.output, id: output}}});
}

export function startHarvestMending(engine, {id, harvester, tool, pulses = 1}) {
    if (!Number.isSafeInteger(pulses) || pulses < 1 || pulses > 4) throw Error('Choose one to four mending pulses.');
    return startHarvestTreatment(engine, {id, harvester, tool, op: 'mend', pulses});
}

function startHarvestTreatment(engine, {id, harvester, tool, op, pulses}) {
    const steps = Array.from({length: pulses}, () => ({op, minutes: 2, bindings: {harvester: 'harvester', tool: 'tool'}}));
    const method = {id: law.id, law: law.ref, revision: 1, roles: treatmentRoles, steps};
    return startEngineWorking(engine, {id, law, method,
        bindings: {harvester: {kind: 'body', id: harvester}, tool: {kind: 'harvest_tool', id: tool}}});
}
