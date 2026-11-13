// PC95 / ENF8. Original workshop trial. The liner is fitted to one actual
// breastplate and the plate contributes protection through its worn slot.
import {fitJoin, planSalvage} from '../craft_assembly.js';
import {expose, exposuresVia} from '../affliction_track.js';
import {typedHit} from '../damage_types.js';
import {createRuneRecord, defineRuneGrammar, readTalisman, recordPair} from '../rune_grammar.js';
import {KNOWLEDGE_KINDS, KNOWLEDGE_PACK, recordsOf} from '../knowledge_record.js';
import {advanceEngineWorld, applyEngineOps, engineDraw, startEngineWorking} from '../engine_world.js';
import {indexFromU32} from '../gen_kit.js';
import {defineWorkingLaw, quoteWorking} from '../kernel_working.js';
import {linkExits, substratePort, worldLinks} from '../world_substrate.js';
import {WORLD_PROPERTIES, WORLD_QUANTITIES} from '../world_quantities.js';
import {workshopLightAt} from './workshop_light_ring.js';
import {HARVEST_KEY, HARVEST_STOCK} from './enchanted_harvest_tool.js';
import {planMaterialPartition, planProcessedMaterial, readMaterialLineage} from '../material_lineage.js';

export const LINING_STOCK = 'stock:heatproof_lining';
export const INSCRIPTION_STOCK = 'stock:lining_ink';
export const REPAIR_STOCK = 'stock:lining_thread';
export const SALVAGE_STOCK = 'stock:lining_scrap';
export const WORKSHOP_COIN = 'stock:workshop_coin';

const FITTED = 'workshop.fitted_lining';
const INSERT = 'workshop.fitted_insert';
const TORSO = 'workshop.worn_torso';
const OWNER = 'workshop.held_by';
const ARMOR = 'workshop.base_armor';
const RESISTANCE = 'workshop.fire_resistance';
const INSULATION = 'workshop.heat_insulation';
const MATERIAL_INSULATION = 'workshop.fiber_insulation';
const HIDE_SOURCE = 'workshop.lining_hide_source';
export const LINING_MATERIAL = 'workshop.lining_material';
const OUTER_WEAR = 'workshop.lining_outer_wear';
const OUTER_PATCH = 'workshop.lining_outer_patch';
export const PATCH_COVERAGE = 'workshop.lining_patch_coverage';
const outerIntegrity = part => 1 - (part.properties[OUTER_WEAR] ?? 0) / 100;
const outerPatch = part => {
    const key = part.properties[OUTER_PATCH];
    const event = key && readMaterialLineage(key)?.history.at(-1);
    const insulation = event?.parameters.insulation;
    return event?.process_id === 'workshop.patch_outer' && Number.isFinite(insulation) &&
        insulation >= 0 && insulation <= 100 ? event.parameters : null;
};
const hideRoles = {wearer: 'body', hide: 'harvest_output'};
const FIBER_DENSITY = 'workshop.fiber_density';
const FIBER_UNITS = 'workshop.fiber_units';
const INSTALLED = 'workshop.installed_in';
const RUNES = 'workshop.inscribed_runes';
const COUNTER_FIELD = 'workshop.counter_field';
const LENDER = 'workshop.lender';
const ROUTE_HEAT = 'workshop.route_heat';
const ROUTE_WEAR = 'workshop.route_lining_wear';
const BARRIER = 'workshop.blocks_exposure';
const NOTE_PAIR = 'workshop.note_pair';
const grammar = defineRuneGrammar({id: 'workshop.lining_patterns', revision: 1,
    runes: ['ember', 'weave', 'veil', 'mirror'], maxLength: 3, perRuneCost: 1,
    pairs: [{a: 'ember', b: 'weave', effect: 'fire', power: 40}, {a: 'weave', b: 'veil', effect: 'heat', power: 20},
        {a: 'ember', b: 'mirror', ordered: true, effect: 'counterfire', power: 40}],
    discord: {effect: 'discord', power: 1, reason: 'These marks disturb the weave.'}});
const PATTERNS = {fireproof: ['ember', 'weave', 'veil'], sparkproof: ['ember', 'weave']};
const recoveredPatterns = [PATTERNS.sparkproof, ['weave', 'veil'], PATTERNS.fireproof];
const roles = {wearer: 'body', armor: 'breastplate', lining: 'heatproof_lining'};
const refitRoles = {...roles, previous: roles.lining};
const liningRoles = {wearer: roles.wearer, lining: roles.lining};
const noteRoles = {wearer: roles.wearer, note: 'rune_note'};
const lessonRoles = {teacher: 'body', student: 'body'};
const lessonFee = 2;
const copyRoles = {...liningRoles, source: roles.lining};
const commissionRoles = {...liningRoles, maker: roles.wearer};
const salvageRoles = {wearer: roles.wearer, scrap: 'lining_scrap'};
const blendRoles = {...salvageRoles, second: salvageRoles.scrap};
const patchRoles = {...roles, scrap: salvageRoles.scrap};
const liningLotKey = lot => lot.properties[LINING_MATERIAL] ?? lot.properties[HIDE_SOURCE] ??
    JSON.stringify({id: 'Recovered lining cloth', lot: lot.holder});
const commissionOffers = {sparkproof: 3, fireproof: 5};
const commissionEffects = {fire: RESISTANCE, heat: INSULATION};
const slots = {
    lining: {property: FITTED, join: {id: 'breastplate lining', needs: {armor: ['lining-seams'], lining: ['matching-seams']}}},
    insert: {property: INSERT, join: {id: 'breastplate insert', needs: {armor: ['insert-pocket'], lining: ['matching-insert']}}},
};

const heldBy = (item, wearer) => item?.place === wearer.place && item.properties[OWNER] === wearer.holder;
const prop = (holder, property, value) => ({op: 'property', holder, property, value});
const stock = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const refuse = reason => ({ok: false, reason});
const cost = (payer, quantity, amount = 1) => ({payer, quantity, amount});
const clothAmount = amount => Number.isSafeInteger(amount) && amount > 0 && amount <= WORLD_QUANTITIES.stock.max;
const clothDensity = lot => lot.properties[FIBER_DENSITY] ?? (lot.properties.marks?.includes('dense-weave') ? 100 : 0);
const publishKnowledge = (kind, holder, knowledge) => ({op: 'publish', kind, place: holder.place, by: holder.holder,
    detail: {owner: 'N', knowledge}});
const lessonEffects = (teacher, student, record, at) => [
    publishKnowledge(KNOWLEDGE_KINDS.learn, teacher, {to: teacher.holder, record}),
    publishKnowledge(KNOWLEDGE_KINDS.teach, teacher, {from: teacher.holder, to: student.holder, record: record.id, at}),
];
const together = (teacher, student) => teacher && student && teacher.holder !== student.holder && teacher.place === student.place;
const isInstalled = (lining, armor) => lining?.quantities[LINING_STOCK] === 0 &&
    (lining.properties[INSTALLED] === armor.holder || lining.properties[INSTALLED] === undefined);
const recover = (lining, wearer) => [stock(lining.holder, LINING_STOCK, 1), prop(lining.holder, INSTALLED, null),
    prop(lining.holder, OWNER, wearer.holder), {op: 'move', holder: lining.holder, to: wearer.place}];

function inscriptionProperties(runes, reading) {
    const strength = (reading.effects.fire ?? 0) - (reading.effects.counterfire ?? 0);
    return {[RUNES]: runes.join(','), [RESISTANCE]: Math.abs(strength), [INSULATION]: reading.effects.heat ?? 0,
        ...(strength < 0 ? {[COUNTER_FIELD]: true} : {})};
}

function fitLining({bound: {wearer, armor, lining, previous}, options: {slot = 'lining'}}) {
    const socket = Object.hasOwn(slots, slot) && slots[slot];
    if (!socket) return refuse('Choose a slot on the breastplate.');
    if (!heldBy(armor, wearer) || armor.properties[LENDER] || !heldBy(lining, wearer) ||
        armor.holder === lining.holder || lining.quantities.condition === 0 ||
        lining.quantities[LINING_STOCK] !== 1 || lining.properties[INSTALLED])
        return refuse('Bring a separate unused lining and a breastplate.');
    if (previous ? armor.properties[socket.property] !== previous.holder || !isInstalled(previous, armor) : armor.properties[socket.property])
        return refuse('The fitted lining has changed.');
    const fit = fitJoin(socket.join, Object.fromEntries(Object.entries({armor, lining})
        .map(([role, item]) => [role, {id: item.holder, interfaces: item.properties.marks}])));
    if (!fit.ok) return refuse(fit.reason);
    const recovered = previous ? recover(previous, wearer) : [];
    return {ok: true, observed: {armor: armor.holder, lining: lining.holder, ...(previous ? {recovered: previous.holder} : {})},
        costs: [cost(lining.holder, LINING_STOCK)], effects: [...recovered,
            prop(armor.holder, socket.property, lining.holder), prop(lining.holder, INSTALLED, armor.holder)]};
}

function writeInscription({wearer, lining, maker = wearer}, runes, source) {
    if (!runes || runes.length < 2 || runes.length > grammar.maxLength || runes.some(rune => !grammar.runes.includes(rune)) ||
        !heldBy(lining, wearer) || lining.quantities[LINING_STOCK] !== 1 ||
        lining.properties[RESISTANCE] !== undefined || lining.properties[INSULATION] !== undefined)
        return refuse('Bring a blank lining, ink and a pattern of known marks.');
    const reading = readTalisman(grammar, runes);
    if (!(maker.quantities[INSCRIPTION_STOCK] >= reading.cost)) return refuse('There is too little ink for those marks.');
    const costs = [cost(maker.holder, INSCRIPTION_STOCK, reading.cost)];
    if (reading.discords) return {ok: false, reason: 'The marks interfere.', observed: reading, costs};
    return {ok: true, observed: {...reading, ...(source ? {source} : {})}, costs,
        effects: Object.entries(inscriptionProperties(runes, reading)).map(([key, value]) => prop(lining.holder, key, value))};
}

function reweaveLining({bound: {wearer, scrap, second}, options: {output, shares, layered}, at}) {
    const lots = [scrap, second].filter(Boolean);
    const cloth = lots.length ? lots : [wearer];
    const parents = lots.map(lot => lot.holder);
    const amounts = shares ?? cloth.map(() => 1);
    if (lots.some(lot => lot.properties[PATCH_COVERAGE] !== undefined))
        return refuse('Use measured offcuts for patching. Reweaving needs full cloth units.');
    if (!Array.isArray(amounts) || amounts.length !== cloth.length || !amounts.every(clothAmount) ||
        new Set(parents).size !== parents.length || lots.some(lot => !heldBy(lot, wearer)) ||
        cloth.some((lot, index) => !(lot.quantities[SALVAGE_STOCK] >= amounts[index])) || !(wearer.quantities[REPAIR_STOCK] >= 1))
        return refuse('Bring recovered lining cloth and fresh thread.');
    const total = amounts.reduce((sum, amount) => sum + amount, 0);
    if (!clothAmount(total)) return refuse('The cloth exceeds one lining’s stock capacity.');
    const weighted = read => lots.reduce((sum, lot, index) => sum + read(lot) * amounts[index], 0) / total;
    const density = weighted(clothDensity);
    const condition = 75 + Math.round(15 * density / 100);
    const fiberInsulation = lots.some(lot => lot.properties[MATERIAL_INSULATION] !== undefined)
        ? Math.round(weighted(lot => lot.properties[MATERIAL_INSULATION] ?? 0))
        : undefined;
    const hideSource = lots[0]?.properties[HIDE_SOURCE];
    let material;
    if (layered || lots.some(lot => lot.properties[LINING_MATERIAL] || lot.properties[HIDE_SOURCE])) {
        const selected = new Map();
        const keys = lots.map(liningLotKey);
        for (const [index, key] of keys.entries()) {
            selected.set(key, (selected.get(key) ?? 0) + amounts[index]);
        }
        material = planProcessedMaterial({stock: Object.fromEntries(selected),
            inputs: [...selected].map(([item_key, count]) => ({item_key, count})),
            output: {id: 'Workshop lining', family: 'lining', count: 1},
            process: {id: 'workshop.rework_lining', revision: 1, at, world_id: 'workshop',
                parameters: {lots: parents, shares: amounts,
                    ...(layered ? {layers: lots.map((lot, index) => ({
                        key: keys[index],
                        hide: lot.properties[HIDE_SOURCE] ?? null,
                        insulation: lot.properties[MATERIAL_INSULATION] ?? 0,
                        density: clothDensity(lot),
                    }))} : {})}}}).item_key;
    }
    const lineage = scrap ? {act: 'create', parents, note: second ? 'Rewoven from two identified cloth lots.' : 'Rewoven from an identified cloth lot.'}
        : {act: 'create', note: 'Rewoven from pooled lining scrap.'};
    return {ok: true, observed: {output, condition, ...(scrap ? {scrap: scrap.holder} : {}),
        ...(second ? {lots: parents, shares: amounts} : {})},
        costs: [...cloth.map((lot, index) => cost(lot.holder, SALVAGE_STOCK, amounts[index])), cost(wearer.holder, REPAIR_STOCK)],
        effects: [{op: 'holder_add', lineage, value: {
            id: output, kind: 'thing', as: [roles.lining], place: wearer.place,
            properties: {[OWNER]: wearer.holder, marks: density === 100 ? ['matching-seams', 'dense-weave'] : ['matching-seams'],
                [FIBER_UNITS]: total,
                ...(density > 0 && density < 100 ? {[FIBER_DENSITY]: Math.round(density)} : {}),
                ...(fiberInsulation !== undefined ? {[MATERIAL_INSULATION]: fiberInsulation} : {}),
                ...(hideSource && lots.every(lot => lot.properties[HIDE_SOURCE] === hideSource) ? {[HIDE_SOURCE]: hideSource} : {}),
                ...(material ? {[LINING_MATERIAL]: material} : {})},
            quantities: {[LINING_STOCK]: 1, condition},
        }}]};
}

const validClothBatch = units => Number.isSafeInteger(units) && units >= 1 && units <= 16;
const joinedClothIds = (output, units) => Array.from({length: units}, (_, index) =>
    units === 1 ? output : `${output}.${index + 1}`);

function joinOffcuts({bound: {wearer, scrap, second, third}, options: {output, counts, remnant, units = 1}, at}) {
    const lots = [scrap, second, third].filter(Boolean);
    const parents = lots.map(lot => lot.holder);
    if (!validClothBatch(units) || new Set(parents).size !== lots.length || !Array.isArray(counts) || counts.length !== lots.length ||
        !counts.every(clothAmount) || lots.some((lot, index) => !heldBy(lot, wearer) || !lot.properties[PATCH_COVERAGE] ||
            !(lot.quantities[SALVAGE_STOCK] >= counts[index])) || !(wearer.quantities[REPAIR_STOCK] >= units))
        return refuse('Bring measured offcut lots and fresh thread.');
    const areas = lots.map((lot, index) => lot.properties[PATCH_COVERAGE] * counts[index]);
    const total = areas.reduce((sum, area) => sum + area, 0);
    const excess = total - 100 * units;
    const last = lots.at(-1);
    if (excess < 0 || (excess > 0 && (!remnant || excess >= last.properties[PATCH_COVERAGE])))
        return refuse('Choose enough cloth for the requested units, with any excess on the last piece.');

    const keys = lots.map(liningLotKey);
    const allocations = shares => {
        const selected = new Map();
        for (const [index, key] of keys.entries())
            if (shares[index]) selected.set(key, (selected.get(key) ?? 0) + shares[index]);
        return {stock: Object.fromEntries(selected), inputs: [...selected].map(([item_key, count]) => ({item_key, count}))};
    };
    const usedAreas = [...areas];
    usedAreas[usedAreas.length - 1] -= excess;
    const plan = planMaterialPartition({...allocations(areas),
        unit: 'cloth area point', unitsPerInput: () => 1,
        outputs: [{output: {id: 'Joined lining cloth', family: 'lining', count: units}, unitsPerItem: 100},
            ...(excess ? [{output: {id: 'Offcut trimming', family: 'lining', count: 1}, unitsPerItem: excess}] : [])],
        process: {id: 'workshop.join_offcuts', revision: 1, at, world_id: 'workshop',
            parameters: {lots: parents, counts, areas, ...(excess ? {usedAreas, remnantArea: excess} : {})}}});
    let lotStart = 0;
    const spans = usedAreas.map(area => {
        const span = [lotStart, lotStart + area];
        lotStart += area;
        return span;
    });
    const effects = joinedClothIds(output, units).map((id, index) => {
        const from = index * 100, to = from + 100;
        const shares = spans.map(([start, end]) => Math.max(0, Math.min(end, to) - Math.max(start, from)));
        const sources = parents.filter((_, source) => shares[source]);
        const material = units === 1 && !excess ? plan.outputs[0].item_key : planProcessedMaterial({...allocations(shares),
            output: {id: 'Joined lining cloth', family: 'lining', count: 1},
            process: {id: 'workshop.join_offcuts', revision: 1, at, world_id: 'workshop',
                parameters: {lots: sources, areas: shares.filter(Boolean)}}}).item_key;
        const weighted = read => Math.round(lots.reduce((sum, lot, source) => sum + read(lot) * shares[source], 0) / 100);
        return {op: 'holder_add', lineage: {act: 'create', parents: sources}, value: {
            id, kind: 'thing', as: [salvageRoles.scrap], place: wearer.place, quantities: {[SALVAGE_STOCK]: 1},
            properties: {[OWNER]: wearer.holder, [LINING_MATERIAL]: material,
                [MATERIAL_INSULATION]: weighted(lot => lot.properties[MATERIAL_INSULATION] ?? 0),
                [FIBER_DENSITY]: weighted(clothDensity)},
        }};
    });
    if (excess) effects.push({op: 'holder_add', lineage: {act: 'create', parents: [last.holder]}, value: {
        id: remnant, kind: 'thing', as: [salvageRoles.scrap], place: wearer.place, quantities: {[SALVAGE_STOCK]: 1},
        properties: {[OWNER]: wearer.holder, [LINING_MATERIAL]: keys.at(-1), [PATCH_COVERAGE]: excess,
            [MATERIAL_INSULATION]: last.properties[MATERIAL_INSULATION] ?? 0, [FIBER_DENSITY]: clothDensity(last),
            ...(last.properties[HIDE_SOURCE] ? {[HIDE_SOURCE]: last.properties[HIDE_SOURCE]} : {})},
    }});
    return {ok: true, observed: {output, balance: plan.balance, ...(units > 1 ? {outputs: joinedClothIds(output, units)} : {}),
        ...(excess ? {remnant, remnantArea: excess} : {})},
        costs: [...lots.map((lot, index) => cost(lot.holder, SALVAGE_STOCK, counts[index])), cost(wearer.holder, REPAIR_STOCK, units)],
        effects};
}

function separateLining({bound: {wearer, scrap}, options: {outputs, key}, at}) {
    if (!heldBy(scrap, wearer) || !key || scrap.properties[LINING_MATERIAL] !== key || !(wearer.quantities[REPAIR_STOCK] >= 1))
        return refuse('Bring the same recovered lining and fresh thread.');
    const {shares, layers} = readStitchedLayers(key) ?? {};
    const units = scrap.quantities[SALVAGE_STOCK];
    const patch = outerPatch(scrap);
    if (!layers || units !== shares[0] + shares[1])
        return refuse('The recovered lining needs two measured layers and its full stock.');
    const partition = planMaterialPartition({stock: {[key]: units}, inputs: [{item_key: key, count: units}],
        unit: 'lining unit', unitsPerInput: () => 1,
        outputs: shares.map((count, index) => ({output: {id: `Separated lining layer ${index + 1}`, family: 'lining', count},
            unitsPerItem: 1})),
        process: {id: 'workshop.separate_lining', revision: 1, at, world_id: 'workshop',
            ...(patch ? {parameters: {outerPatch: scrap.properties[OUTER_PATCH]}} : {})}});
    return {ok: true, observed: {balance: partition.balance}, costs: [
        cost(scrap.holder, SALVAGE_STOCK, units), cost(wearer.holder, REPAIR_STOCK),
    ], effects: outputs.map((id, index) => {
        const layer = layers[index];
        const insulation = index === 0 ? Math.round((patch?.insulation ?? layer.insulation) * outerIntegrity(scrap)) : layer.insulation;
        return {op: 'holder_add', lineage: {act: 'create', parents: [scrap.holder]}, value: {
            id, kind: 'thing', as: [salvageRoles.scrap], place: wearer.place, quantities: {[SALVAGE_STOCK]: shares[index]},
            properties: {[OWNER]: wearer.holder, [MATERIAL_INSULATION]: insulation, [FIBER_DENSITY]: layer.density,
                [LINING_MATERIAL]: partition.outputs[index].item_key,
                ...(layer.hide && !(index === 0 && patch) ? {[HIDE_SOURCE]: layer.hide} : {})},
        }};
    })};
}

function readStitchedLayers(key) {
    if (!key) return null;
    const event = readMaterialLineage(key)?.history.at(-1);
    const {shares, layers} = event?.parameters ?? {};
    if (event?.process_id !== 'workshop.rework_lining' || !Array.isArray(shares) || shares.length !== 2 ||
        !shares.every(clothAmount) || !Array.isArray(layers) || layers.length !== 2 ||
        layers.some(layer => !layer || !event.inputs.some(input => input.item_key === layer.key) ||
            ![layer.insulation, layer.density].every(value => Number.isSafeInteger(value) && value >= 0 && value <= 100)))
        return null;
    return {shares, layers};
}

function repairLining({wearer, lining}) {
    const condition = lining.quantities.condition;
    if (condition === undefined || condition >= 100 || !(wearer.quantities[REPAIR_STOCK] >= 1))
        return refuse('Bring a damaged lining and repair thread.');
    return {ok: true, costs: [cost(wearer.holder, REPAIR_STOCK)],
        effects: [stock(lining.holder, 'condition', Math.min(25, 100 - condition))]};
}

const law = defineWorkingLaw({id: 'workshop.fit_heatproof_lining', revision: 1, operations: {
    fit: {roles, settle: fitLining},
    refit: {roles: refitRoles, settle: fitLining},
    detach: {roles, settle({bound: {wearer, armor, lining}, options: {slot = 'lining'}}) {
        const socket = Object.hasOwn(slots, slot) && slots[slot];
        if (!socket || !heldBy(armor, wearer) || armor.properties[LENDER] ||
            armor.properties[socket.property] !== lining.holder || !isInstalled(lining, armor))
            return refuse('That lining is no longer fitted to your breastplate.');
        return {ok: true, effects: [prop(armor.holder, socket.property, null), ...recover(lining, wearer)]};
    }},
    inscribe: {roles: liningRoles, settle({bound: {wearer, lining}, options: {pattern}}) {
        const runes = Array.isArray(pattern) ? pattern : Object.hasOwn(PATTERNS, pattern) && PATTERNS[pattern];
        return writeInscription({wearer, lining}, runes);
    }},
    'write-note': {roles: noteRoles, settle({bound: {wearer, note}, options: {record}}) {
        if (!heldBy(note, wearer) || note.properties[NOTE_PAIR] || !(wearer.quantities[INSCRIPTION_STOCK] >= 1))
            return refuse('Bring a blank note in your custody and ink.');
        return {ok: true, costs: [cost(wearer.holder, INSCRIPTION_STOCK)], effects: [
            prop(note.holder, NOTE_PAIR, record.id),
            publishKnowledge(KNOWLEDGE_KINDS.learn, wearer, {to: note.holder, record}),
        ]};
    }},
    'read-note': {roles: noteRoles, settle({bound: {wearer, note}, at}) {
        const record = note.properties[NOTE_PAIR];
        if (!heldBy(note, wearer) || !record) return refuse('Keep the written note in your custody to read it.');
        return {ok: true, effects: [publishKnowledge(KNOWLEDGE_KINDS.teach, wearer,
            {from: note.holder, to: wearer.holder, record, at})]};
    }},
    'paid-lesson': {roles: lessonRoles, settle({bound: {teacher, student}, options: {record}, at}) {
        if (!together(teacher, student)) return refuse('The teacher and student must finish the lesson together.');
        if (!(student.quantities[WORKSHOP_COIN] >= lessonFee) ||
            !(teacher.quantities[WORKSHOP_COIN] <= WORLD_QUANTITIES.stock.max - lessonFee))
            return refuse('The lesson needs the agreed fee and a purse to receive it.');
        return {ok: true, costs: [cost(student.holder, WORKSHOP_COIN, lessonFee)],
            effects: [...lessonEffects(teacher, student, record, at), stock(teacher.holder, WORKSHOP_COIN, lessonFee)]};
    }},
    recover: {roles: liningRoles, settle({bound: {wearer, lining}}) {
        if (lining.place !== wearer.place || lining.properties[OWNER] !== undefined || lining.properties[INSTALLED] ||
            lining.quantities[LINING_STOCK] !== 1 || !lining.properties.marks?.includes('recoverable-lining'))
            return refuse('Find the loose lining before someone else takes it.');
        return {ok: true, observed: {lining: lining.holder}, effects: [prop(lining.holder, OWNER, wearer.holder)]};
    }},
    copy: {roles: copyRoles, settle({bound: {wearer, lining, source}}) {
        if (!heldBy(source, wearer) || source.holder === lining.holder || source.quantities[LINING_STOCK] !== 1)
            return refuse('Bring a separate loose inscription to copy.');
        return writeInscription({wearer, lining}, source.properties[RUNES]?.split(','), source.holder);
    }},
    commission: {roles: commissionRoles, settle({bound: {wearer, maker, lining}, options: {pattern = 'fireproof', demand}}) {
        if (maker.holder === wearer.holder || maker.place !== wearer.place || !maker.properties.marks?.includes('fireproof-inscriber'))
            return refuse('Bring the lining to a maker who knows the fireproof pattern.');
        if (!Object.hasOwn(commissionOffers, pattern)) return refuse('Choose a pattern this workshop offers.');
        const fee = commissionOffers[pattern];
        if (!(wearer.quantities[WORKSHOP_COIN] >= fee) ||
            !(maker.quantities[WORKSHOP_COIN] <= WORLD_QUANTITIES.stock.max - fee))
            return refuse('The commission needs the agreed fee and a purse to receive it.');
        const work = writeInscription({wearer, maker, lining}, PATTERNS[pattern]);
        if (!work.ok) return work;
        const condition = lining.quantities.condition ?? 100;
        if (demand && (fee > demand.maxFee || Object.keys(commissionEffects).some(effect =>
            (work.observed.effects[effect] ?? 0) * condition / 100 < (demand[effect] ?? 0))))
            return refuse('The quoted work no longer meets the requested protection and price.');
        return {...work, observed: {...work.observed, maker: maker.holder, lining: lining.holder},
            costs: [...work.costs, cost(wearer.holder, WORKSHOP_COIN, fee)],
            effects: [...work.effects, stock(maker.holder, WORKSHOP_COIN, fee)]};
    }},
    repair: {roles: liningRoles, settle({bound: {wearer, lining}}) {
        if (!heldBy(lining, wearer) || lining.quantities[LINING_STOCK] !== 1 || lining.properties[INSTALLED])
            return refuse('Bring a loose lining in your custody.');
        return repairLining({wearer, lining});
    }},
    'repair-fitted': {roles, settle({bound: {wearer, armor, lining}, options: {slot}}) {
        const socket = Object.hasOwn(slots, slot) && slots[slot];
        if (!socket || !heldBy(armor, wearer) || !heldBy(lining, wearer) ||
            armor.properties[socket.property] !== lining.holder || !isInstalled(lining, armor))
            return refuse('Bring the same breastplate with the lining still fitted.');
        return repairLining({wearer, lining});
    }},
    'patch-outer': {roles: patchRoles, settle({bound: {wearer, armor, lining, scrap},
        options: {slot, key, patchKey, substitute, remnant}, at}) {
        const socket = Object.hasOwn(slots, slot) && slots[slot];
        if (!socket || ![armor, lining, scrap].every(item => heldBy(item, wearer)) ||
            armor.properties[socket.property] !== lining.holder || !isInstalled(lining, armor) ||
            scrap.holder === lining.holder || scrap.holder === armor.holder ||
            lining.properties[LINING_MATERIAL] !== key || liningLotKey(scrap) !== patchKey)
            return refuse('Keep the lining fitted and bring the same patch cloth.');
        const outer = readStitchedLayers(key)?.layers[0];
        const wear = lining.properties[OUTER_WEAR] ?? 0;
        const strength = scrap.properties[MATERIAL_INSULATION] ?? 0;
        const matching = outer && outer.key === patchKey && outer.insulation === strength && outer.density === clothDensity(scrap);
        if (!outer || (!matching && !substitute) || !wear || !(scrap.quantities[SALVAGE_STOCK] >= 1) ||
            !(wearer.quantities[REPAIR_STOCK] >= 1))
            return refuse('Bring matching cloth and thread for the worn outer layer.');
        const prior = outerPatch(lining);
        const base = prior?.insulation ?? outer.insulation;
        const measured = scrap.properties[PATCH_COVERAGE];
        const coverage = Math.min(wear, measured ?? 100);
        const offcut = remnant && measured > coverage ? measured - coverage : 0;
        const remaining = wear - coverage;
        // The saved rating is for intact area. Heat applies the uncovered share separately.
        const rating = (base * (100 - wear) + strength * coverage) / (100 - remaining);
        const insulation = remaining ? rating : Math.round(rating);
        const patch = !matching || prior ? planProcessedMaterial({stock: {[patchKey]: 1},
            inputs: [{item_key: patchKey, count: 1}], output: {id: 'Workshop outer patch', family: 'lining', count: 1},
            process: {id: 'workshop.patch_outer', revision: 1, at, world_id: 'workshop',
                parameters: {insulation, coverage, previous: lining.properties[OUTER_PATCH] ?? null}}}).item_key : null;
        const leftover = offcut ? [{op: 'holder_add', lineage: {act: 'create', parents: [scrap.holder]}, value: {
            id: remnant, kind: 'thing', as: [salvageRoles.scrap], place: wearer.place, quantities: {[SALVAGE_STOCK]: 1},
            properties: {[OWNER]: wearer.holder, [MATERIAL_INSULATION]: strength, [FIBER_DENSITY]: clothDensity(scrap),
                [LINING_MATERIAL]: patchKey, [PATCH_COVERAGE]: offcut,
                ...(scrap.properties[HIDE_SOURCE] ? {[HIDE_SOURCE]: scrap.properties[HIDE_SOURCE]} : {})},
        }}] : [];
        return {ok: true, observed: {lining: lining.holder, patch: scrap.holder, patchKey, before: wear, after: remaining,
            coverage, insulation, ...(offcut ? {remnant, remnantCoverage: offcut} : {})},
            costs: [cost(scrap.holder, SALVAGE_STOCK), cost(wearer.holder, REPAIR_STOCK)],
            effects: [prop(lining.holder, OUTER_WEAR, remaining || null),
                ...(patch ? [prop(lining.holder, OUTER_PATCH, patch)] : []), ...leftover]};
    }},
    unequip: {roles: {wearer: roles.wearer, armor: roles.armor}, settle({bound: {wearer, armor}}) {
        if (!heldBy(armor, wearer) || wearer.properties[TORSO] !== armor.holder)
            return refuse('The same plate must still be worn to take it off.');
        return {ok: true, effects: [prop(wearer.holder, TORSO, null)]};
    }},
    reweave: {roles: {wearer: roles.wearer}, settle: reweaveLining},
    'reweave-lot': {roles: salvageRoles, settle: reweaveLining},
    'reweave-blend': {roles: blendRoles, settle: reweaveLining},
    'join-offcuts': {roles: blendRoles, settle: joinOffcuts},
    'join-three-offcuts': {roles: {...blendRoles, third: salvageRoles.scrap}, settle: joinOffcuts},
    'separate-lining': {roles: salvageRoles, settle: separateLining},
    'line-with-hide': {roles: hideRoles, settle({bound: {wearer, hide}, options: {output, key}}) {
        if (!heldBy(hide, wearer) || hide.quantities[HARVEST_STOCK] !== 1 || hide.properties[HARVEST_KEY] !== key ||
            !key || !(wearer.quantities[REPAIR_STOCK] >= 1))
            return refuse('Bring the same tanned hide and fresh thread.');
        const lineage = readMaterialLineage(key);
        if (lineage?.family !== 'animal-hide' || lineage.history.at(-1)?.process_id !== 'workshop.tan_whole_pelt')
            return refuse('This lining needs a whole tanned hide.');
        const insulation = Math.min(40, Math.floor(lineage.facts.quality / 4));
        if (!Number.isSafeInteger(insulation) || insulation < 0) return refuse('The hide has no measured quality.');
        return {ok: true, observed: {output, insulation},
            costs: [cost(hide.holder, HARVEST_STOCK), cost(wearer.holder, REPAIR_STOCK)],
            effects: [
                prop(hide.holder, HARVEST_KEY, null),
                {op: 'holder_add', lineage: {act: 'create', parents: [hide.holder], note: 'Cut from the tanned hide.'}, value: {
                    id: output, kind: 'thing', as: [roles.lining], place: wearer.place,
                    properties: {[OWNER]: wearer.holder, marks: ['matching-seams'],
                        [MATERIAL_INSULATION]: insulation, [HIDE_SOURCE]: key},
                    quantities: {[LINING_STOCK]: 1, condition: 100},
                }},
            ]};
    }},
}});

export const fireLiningConfig = {
    shared: {quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.condition], properties: [
        WORLD_PROPERTIES.marks,
        {id: BARRIER, type: 'set', values: ['contact', 'inhaled']},
        {id: COUNTER_FIELD, type: 'flag'},
        ...[FITTED, INSERT, TORSO, OWNER, INSTALLED, RUNES, LENDER, NOTE_PAIR, HIDE_SOURCE, LINING_MATERIAL, OUTER_PATCH].map(id => ({id, type: 'label'})),
        {id: ARMOR, type: 'level', min: 0, max: 100},
        {id: RESISTANCE, type: 'level', min: 0, max: 100},
        {id: INSULATION, type: 'level', min: 0, max: 100},
        {id: MATERIAL_INSULATION, type: 'level', min: 0, max: 100},
        {id: OUTER_WEAR, type: 'level', min: 0, max: 100},
        {id: PATCH_COVERAGE, type: 'level', min: 1, max: 100},
        {id: FIBER_DENSITY, type: 'level', min: 0, max: 100},
        {id: FIBER_UNITS, type: 'level', min: 1, max: WORLD_QUANTITIES.stock.max},
        {id: ROUTE_HEAT, type: 'level', min: 0, max: 100},
        {id: ROUTE_WEAR, type: 'level', min: 0, max: 100},
    ]},
    host: {laws: [law]},
};

function workshopWorking({id, op, holders, options = {}}) {
    const roles = law.operations[op].roles;
    const bindings = Object.fromEntries(Object.entries(roles).map(([role, kind]) => [role, {kind, id: holders[role]}]));
    const method = {id: law.id, revision: 1, law: law.ref, roles,
        steps: [{op, minutes: 3, options, bindings: Object.fromEntries(Object.keys(roles).map(role => [role, role]))}]};
    return {law, method, id, bindings};
}

function startWorkshop(engine, request) {
    return startEngineWorking(engine, workshopWorking(request));
}

export function startFireLining(engine, {id, wearer, armor, lining, previous, slot = 'lining'}) {
    return startWorkshop(engine, {id, op: previous ? 'refit' : 'fit', holders: {wearer, armor, lining, previous}, options: {slot}});
}

export function startLiningInscription(engine, {id, wearer, lining, pattern}) {
    return startWorkshop(engine, {id, op: 'inscribe', holders: {wearer, lining}, options: {pattern}});
}

export function liningTrialRecord(engine, wearer) {
    let record = createRuneRecord();
    const observations = Object.values(engine.records.workings)
        .filter(entry => entry.law === law.ref && entry.record.bindings.wearer?.id === wearer)
        .flatMap(entry => entry.record.receipts.map(receipt => ({...receipt, working: entry.record.id})))
        .filter(receipt => receipt.op === 'inscribe' && (receipt.ok || receipt.cause === 'operation') &&
            Array.isArray(receipt.observed?.steps))
        .sort((a, b) => a.at - b.at || (a.working < b.working ? -1 : Number(a.working > b.working)));
    for (const {at, observed} of observations) {
        for (const {pair: [a, b], effect} of observed.steps) record = recordPair(record, a, b, effect, at);
    }
    return record;
}

const lessonPrefix = `${grammar.id}.r${grammar.revision}.pair.`;

function observedLiningPair(engine, wearer, effect) {
    if (!Object.hasOwn(commissionEffects, effect)) throw Error('Choose a lining effect to record.');
    const pair = liningTrialRecord(engine, wearer).pairs.find(pair => pair.effect === effect);
    if (!pair) throw Error('The maker needs to have observed that pair in a trial.');
    const {a, b, at} = pair;
    const id = `${lessonPrefix}${a}.${b}`;
    return {id, subject: {kind: 'composition', id}, true: {fillers: {a, b, effect}},
        source: {kind: 'observation', by: wearer, at}};
}

function liningLessons(world, wearer) {
    return Object.values(recordsOf(world, wearer)).filter(record =>
        record.subject.kind === 'composition' && record.subject.id.startsWith(lessonPrefix))
        .map(record => record.believed.fillers)
        .filter(({a, b, effect}) => grammar.runes.includes(a) && grammar.runes.includes(b) &&
            Object.hasOwn(commissionEffects, effect));
}

export function teachLiningPair(engine, {teacher, student, effect}) {
    const read = substratePort(engine.world);
    const tutor = read({kind: 'body', id: teacher}), learner = read({kind: 'body', id: student});
    if (!together(tutor, learner)) throw Error('Bring the teacher and student together.');
    const record = observedLiningPair(engine, tutor.holder, effect);
    return applyEngineOps(engine, lessonEffects(tutor, learner, record, engine.world.clock), 'workshop:rune-lesson');
}

export function startPaidLiningLesson(engine, {id, teacher, student, effect}) {
    if (!engine.rules.packs.includes(KNOWLEDGE_PACK)) throw Error('Rune lessons need the world’s knowledge records.');
    const read = substratePort(engine.world);
    const tutor = read({kind: 'body', id: teacher}), learner = read({kind: 'body', id: student});
    if (!together(tutor, learner)) throw Error('Bring the teacher and student together.');
    const record = observedLiningPair(engine, tutor.holder, effect);
    return startWorkshop(engine, {id, op: 'paid-lesson', holders: {teacher: tutor.holder, student: learner.holder}, options: {record}});
}

export function startLiningNote(engine, {id, wearer, note, effect}) {
    if (!engine.rules.packs.includes(KNOWLEDGE_PACK)) throw Error('Rune notes need the world’s knowledge records.');
    const record = observedLiningPair(engine, wearer, effect);
    return startWorkshop(engine, {id, op: 'write-note', holders: {wearer, note}, options: {record}});
}

export function startReadingLiningNote(engine, {id, wearer, note}) {
    if (!engine.rules.packs.includes(KNOWLEDGE_PACK)) throw Error('Rune notes need the world’s knowledge records.');
    return startWorkshop(engine, {id, op: 'read-note', holders: {wearer, note}});
}

export function giveLiningNote(engine, {note, from, to}) {
    const read = substratePort(engine.world);
    const page = read({kind: 'rune_note', id: note});
    const giver = read({kind: 'body', id: from}), recipient = read({kind: 'body', id: to});
    if (!giver || !recipient || giver.holder === recipient.holder || giver.place !== recipient.place || !heldBy(page, giver))
        throw Error('Bring the note and both makers together.');
    return applyEngineOps(engine, [prop(page.holder, OWNER, recipient.holder)], 'workshop:give-note');
}

export function startLiningFromTrials(engine, {id, wearer, lining, effects}) {
    if (!Array.isArray(effects) || effects.length < 1 || effects.length >= grammar.maxLength ||
        effects.some(effect => !Object.hasOwn(commissionEffects, effect))) throw Error('Choose one or two lining effects.');
    const pairs = [...liningTrialRecord(engine, wearer).pairs, ...liningLessons(engine.world, wearer)];
    let patterns = [[]];
    for (const effect of effects) {
        // Workshop pairs are symmetric. Only the pair's observed effect is used.
        const known = pairs.filter(pair => pair.effect === effect).flatMap(({a, b}) => [[a, b], [b, a]]);
        patterns = patterns.flatMap(pattern => known.filter(([first]) => !pattern.length || pattern.at(-1) === first)
            .map(([first, last]) => pattern.length ? [...pattern, last] : [first, last]));
    }
    const [pattern] = patterns;
    if (!pattern) throw Error('Try the marks or learn them from a maker before combining them.');
    return startLiningInscription(engine, {id, wearer, lining, pattern});
}

export function startLiningRecovery(engine, {id, wearer, lining}) {
    return startWorkshop(engine, {id, op: 'recover', holders: {wearer, lining}});
}

// The find's source and place address the draw. Recovery reads the committed
// object, so changes to discovery order or the recipient cannot reroll it.
export function placeRecoveredLining(engine, {source, place}) {
    if (typeof source !== 'string' || !/^[a-z0-9][a-z0-9_-]*$/i.test(source) || engine.world.holders[place]?.kind !== 'place')
        throw Error('A lining find needs a stable source and a place.');
    const id = `workshop.found.${place}.${source}`;
    if (Object.hasOwn(engine.world.holders, id) || Object.hasOwn(engine.world.identity?.entries ?? {}, id))
        return {engine, id};
    const draw = engineDraw(engine, 'workshop.found-lining', grammar.revision, place, source);
    const runes = recoveredPatterns[indexFromU32(draw, recoveredPatterns.length)];
    const properties = inscriptionProperties(runes, readTalisman(grammar, runes));
    const next = applyEngineOps(engine, [{op: 'holder_add', lineage: {act: 'create', note: 'Recovered workshop stock.'}, value: {
        id, kind: 'thing', as: [roles.lining], place, quantities: {[LINING_STOCK]: 1, condition: 100},
        properties: {...properties, marks: ['recoverable-lining', 'matching-seams']},
    }}], `workshop:find:${source}`);
    return {engine: next, id};
}

export function startLiningCopy(engine, {id, wearer, lining, source}) {
    return startWorkshop(engine, {id, op: 'copy', holders: {wearer, lining, source}});
}

export function quoteLiningCommission(engine, {id, wearer, lining, maker, demand}) {
    const {fire = 0, heat = 0, maxFee = WORLD_QUANTITIES.stock.max} = demand ?? {};
    if (![fire, heat].every(value => Number.isSafeInteger(value) && value >= 0 && value <= 100) ||
        !Number.isSafeInteger(maxFee) || maxFee < 0 || !(fire || heat)) throw Error('Request a measurable protection and price.');
    const read = substratePort(engine.world);
    const condition = read({kind: 'heatproof_lining', id: lining})?.quantities.condition ?? 100;
    for (const [pattern, fee] of Object.entries(commissionOffers)) {
        const request = {id, op: 'commission', holders: {wearer, lining, maker},
            options: {pattern, demand: {fire, heat, maxFee}, quotedCondition: condition}};
        const {method, bindings} = workshopWorking(request);
        const quote = quoteWorking(law, method, {id, bindings, at: engine.world.clock, ports: {read: ref => read(ref)}});
        if (quote.ok) {
            const protection = Object.fromEntries(Object.entries(commissionEffects).map(([effect, property]) => [effect,
                (quote.effects.find(row => row.property === property)?.value ?? 0) * condition / 100]));
            return {ok: true, pattern, fee, protection, condition, endsAt: quote.endsAt, fingerprint: quote.fingerprint};
        }
    }
    return {ok: false, reason: 'No available offer meets the requested protection and price.'};
}

export function startLiningCommission(engine, {id, wearer, lining, maker, demand, fingerprint}) {
    let options = {};
    if (demand !== undefined) {
        const quote = quoteLiningCommission(engine, {id, wearer, lining, maker, demand});
        if (!quote.ok || quote.fingerprint !== fingerprint) throw Error(quote.reason ?? 'The workshop quote has changed.');
        options = {pattern: quote.pattern, quotedCondition: quote.condition, demand: {fire: demand.fire ?? 0, heat: demand.heat ?? 0,
            maxFee: demand.maxFee ?? WORLD_QUANTITIES.stock.max}};
    }
    return startWorkshop(engine, {id, op: 'commission', holders: {wearer, lining, maker}, options});
}

const appraisalId = lining => `workshop.appraisal.${lining}`;
const fieldAppraisalId = lining => `workshop.field-appraisal.${lining}`;
const heatAppraisalId = lining => `workshop.heat-appraisal.${lining}`;

function latestObservation(records, subject, prefix) {
    return Object.values(records).filter(record => record.subject.id === subject &&
        record.source.kind === 'observation' && record.id.startsWith(prefix))
        .sort((a, b) => Number(b.id.slice(prefix.length)) - Number(a.id.slice(prefix.length)))[0];
}

function forecastHeat(parts, observer, records) {
    const observations = parts.map(part => part.place === observer.place &&
        latestObservation(records, part.holder, `${heatAppraisalId(part.holder)}:`));
    const multipliers = observations.map(record => Number(record?.believed.value ?? NaN));
    if (multipliers.some(value => !Number.isFinite(value) || value < 0 || value > 1)) return {known: false};
    return {known: true, heatMultiplier: multipliers.reduce((remaining, value) => remaining * value, 1),
        observedAt: observations.length ? Math.min(...observations.map(record => record.source.at)) : null};
}

export function appraiseLining(engine, {observer, lining}) {
    const read = substratePort(engine.world);
    const body = read({kind: 'body', id: observer}), part = read({kind: 'heatproof_lining', id: lining});
    if (!body || part?.place !== body.place)
        throw Error('Inspect a lining within reach.');
    const light = workshopLightAt(engine.world, body.place);
    if (light !== undefined && light < 2) throw Error('Bring more light to read the marks.');
    const source = {kind: 'observation', by: body.holder, from: part.holder, at: engine.world.clock};
    const observations = part.properties[RESISTANCE] === undefined ? [] : [
        [appraisalId(part.holder), RESISTANCE, part.properties[RESISTANCE]],
        [fieldAppraisalId(part.holder), COUNTER_FIELD, !!part.properties[COUNTER_FIELD]],
    ];
    observations.push([`${heatAppraisalId(part.holder)}:${engine.world.seq}`, 'workshop.heat_observation',
        String(heatAfterLayers([part]))]);
    return applyEngineOps(engine, observations.map(([id, property, value]) => publishKnowledge(KNOWLEDGE_KINDS.learn, body, {
        to: body.holder, record: {id, subject: {kind: 'fact', id: part.holder},
            true: {holder: part.holder, property}, believed: {value}, source},
    })), 'workshop:appraise');
}

export const knownLiningResistance = (world, observer, lining) =>
    recordsOf(world, observer)[appraisalId(lining)]?.believed.value;

export function forecastLiningFit(world, {observer, armor, lining, slot = 'lining', exposure = 'fire'}) {
    const read = substratePort(world);
    const body = read({kind: 'body', id: observer});
    const plate = read({kind: 'breastplate', id: armor});
    const candidate = read({kind: 'heatproof_lining', id: lining});
    const socket = Object.hasOwn(slots, slot) && slots[slot];
    if (!body || !plate || !candidate || !socket || !['fire', 'heat'].includes(exposure)) return {known: false};
    const current = plate.properties[socket.property];
    const previous = current ? read({kind: 'heatproof_lining', id: current}) : undefined;
    const fit = fitLining({bound: {wearer: body, armor: plate, lining: candidate, previous}, options: {slot}});
    if (!fit.ok) return {known: false, reason: fit.reason};
    const parts = [...fittedParts(read, plate).filter(part => part.holder !== current), candidate];
    const records = recordsOf(world, body.holder);
    if (exposure === 'heat') return forecastHeat(parts, body, records);
    const observed = parts.map(part => {
        const resistance = records[appraisalId(part.holder)]?.believed.value;
        const counter = records[fieldAppraisalId(part.holder)]?.believed.value;
        if (typeof resistance !== 'number' || typeof counter !== 'boolean' || part.place !== body.place) return null;
        return {...part, properties: {[RESISTANCE]: resistance, [COUNTER_FIELD]: counter}};
    });
    if (observed.some(part => !part)) return {known: false};
    return {known: true, fireMultiplier: fireAfterLayers(observed),
        opposing: observed.length === 2 && observed[0].properties[COUNTER_FIELD] !== observed[1].properties[COUNTER_FIELD]};
}

export function startLiningDetachment(engine, {id, wearer, armor, lining, slot = 'lining'}) {
    return startWorkshop(engine, {id, op: 'detach', holders: {wearer, armor, lining}, options: {slot}});
}

export function startLiningRepair(engine, {id, wearer, lining, armor, slot = 'lining'}) {
    return startWorkshop(engine, {id, op: armor === undefined ? 'repair' : 'repair-fitted',
        holders: {wearer, lining, armor}, options: armor === undefined ? {} : {slot}});
}

export function startOuterLiningPatch(engine, {id, wearer, lining, armor, scrap, slot = 'lining', substitute = false}) {
    const part = engine.world.holders[lining], patch = engine.world.holders[scrap];
    const key = part?.properties[LINING_MATERIAL] ?? null;
    const remnant = `workshop.patch-remnant.${id}`;
    if (Object.hasOwn(engine.world.holders, remnant) || Object.hasOwn(engine.world.identity?.entries ?? {}, remnant))
        throw Error('That patch job already has a remnant.');
    return startWorkshop(engine, {id, op: 'patch-outer', holders: {wearer, armor, lining, scrap},
        options: {slot, key, patchKey: patch ? liningLotKey({...patch, holder: scrap}) : null, substitute, remnant}});
}

export function startLiningReweave(engine, {id, wearer, scrap, second, shares, layered = false}) {
    // A job's id is unique in the working host, so it also names its product.
    const output = `workshop.rewoven.${id}`;
    if (Object.hasOwn(engine.world.holders, output) || Object.hasOwn(engine.world.identity?.entries ?? {}, output))
        throw Error('That reweaving already produced a lining.');
    if (second !== undefined && (!scrap || !second || second === scrap)) throw Error('Choose two distinct cloth lots.');
    if (layered && !second) throw Error('Choose two lots to stitch as layers.');
    if (shares !== undefined && (!second || !Array.isArray(shares) || shares.length !== 2 || !shares.every(clothAmount)))
        throw Error('Choose a positive whole stock amount for each cloth lot.');
    const op = second ? 'reweave-blend' : scrap ? 'reweave-lot' : 'reweave';
    return startWorkshop(engine, {id, op, holders: {wearer, scrap, second},
        options: {output, ...(shares ? {shares} : {}), ...(layered ? {layered: true} : {})}});
}

export function startHideLining(engine, {id, wearer, hide}) {
    const output = `workshop.hide-lining.${id}`;
    if (Object.hasOwn(engine.world.holders, output) || Object.hasOwn(engine.world.identity?.entries ?? {}, output))
        throw Error('That job already has a lining.');
    const key = engine.world.holders[hide]?.properties[HARVEST_KEY] ?? null;
    return startWorkshop(engine, {id, op: 'line-with-hide', holders: {wearer, hide}, options: {output, key}});
}

export function startLiningOffcutJoin(engine, {id, wearer, scrap, second, third, counts = third ? [1, 1, 1] : [1, 1], units = 1}) {
    if (!validClothBatch(units)) throw Error('Choose one to sixteen cloth units for this job.');
    const output = `workshop.joined-offcuts.${id}`, remnant = `${output}.remnant`;
    if ([...joinedClothIds(output, units), remnant].some(holder => Object.hasOwn(engine.world.holders, holder) ||
        Object.hasOwn(engine.world.identity?.entries ?? {}, holder)))
        throw Error('That job already has a joined cloth lot or remnant.');
    const lots = third ? [scrap, second, third] : [scrap, second];
    if (new Set(lots).size !== lots.length || !Array.isArray(counts) || counts.length !== lots.length || !counts.every(clothAmount))
        throw Error('Choose distinct offcut lots and whole amounts.');
    return startWorkshop(engine, {id, op: third ? 'join-three-offcuts' : 'join-offcuts',
        holders: {wearer, scrap, second, third}, options: {output, counts, remnant, units}});
}

export function startLiningSeparation(engine, {id, wearer, scrap}) {
    const outputs = [1, 2].map(index => `workshop.separated.${id}.${index}`);
    if (outputs.some(output => Object.hasOwn(engine.world.holders, output) || Object.hasOwn(engine.world.identity?.entries ?? {}, output)))
        throw Error('That job already has recovered layers.');
    const key = engine.world.holders[scrap]?.properties[LINING_MATERIAL] ?? null;
    return startWorkshop(engine, {id, op: 'separate-lining', holders: {wearer, scrap}, options: {outputs, key}});
}

export function wearBreastplate(engine, wearerId, armorId = null) {
    const read = substratePort(engine.world);
    const wearer = read({kind: 'body', id: wearerId});
    const armor = armorId === null ? null : read({kind: 'breastplate', id: armorId});
    if (!wearer || (armorId !== null && !heldBy(armor, wearer))) throw Error('Wear a breastplate you have with you.');
    return applyEngineOps(engine, [{op: 'property', holder: wearer.holder, property: TORSO, value: armor?.holder ?? null}], 'workshop:wear');
}

export function startBreastplateRemoval(engine, {id, wearer, armor}) {
    return startWorkshop(engine, {id, op: 'unequip', holders: {wearer, armor}});
}

function handoff(engine, {from, to, armor: armorId}, mode) {
    const read = substratePort(engine.world);
    const giver = read({kind: 'body', id: from}), receiver = read({kind: 'body', id: to});
    const armor = read({kind: 'breastplate', id: armorId});
    if (!giver || !receiver || from === to || giver.place !== receiver.place || !heldBy(armor, giver))
        throw Error('Bring the breastplate and both people together.');
    const lender = armor.properties[LENDER];
    if (mode === 'return' ? lender !== receiver.holder : lender)
        throw Error('Return borrowed armor to its lender.');
    const ops = [prop(armor.holder, OWNER, receiver.holder)];
    if (mode === 'lend') ops.push(prop(armor.holder, LENDER, giver.holder));
    if (mode === 'return') ops.push(prop(armor.holder, LENDER, null));
    if (giver.properties[TORSO] === armor.holder) ops.push(prop(giver.holder, TORSO, null));
    for (const part of fittedParts(read, armor)) ops.push(prop(part.holder, OWNER, receiver.holder));
    return applyEngineOps(engine, ops, `workshop:${mode}`);
}

export const giveBreastplate = (engine, transfer) => handoff(engine, transfer, 'give');
export const lendBreastplate = (engine, transfer) => handoff(engine, transfer, 'lend');
export const returnBreastplate = (engine, transfer) => handoff(engine, transfer, 'return');

function wornParts(world, wearerId) {
    return readWornParts(substratePort(world), wearerId);
}

function readWornParts(read, wearerId) {
    const wearer = read({kind: 'body', id: wearerId});
    const armorId = wearer?.properties[TORSO];
    const armor = armorId && read({kind: 'breastplate', id: armorId});
    if (!armor || !heldBy(armor, wearer)) return {parts: []};
    return {armor, parts: fittedParts(read, armor)};
}

function fittedParts(read, armor) {
    // Fitting spends the loose stock unit, while the exact component stays
    // addressable through the plate's fitted-part link.
    const ids = new Set(Object.values(slots).map(slot => armor.properties[slot.property]).filter(Boolean));
    return [...ids].map(id => read({kind: 'heatproof_lining', id})).filter(part => isInstalled(part, armor));
}

const effectiveStrength = (part, property) => (part.properties[property] ?? 0) * (part.quantities.condition ?? 100) / 10000;

function afterLayers(parts, property) {
    // Each fitted layer acts on what passes through the previous one.
    return parts.reduce((fraction, part) => fraction * (1 - effectiveStrength(part, property)), 1);
}

function fireAfterLayers(parts) {
    const [first, second] = parts;
    if (!second || !!first.properties[COUNTER_FIELD] === !!second.properties[COUNTER_FIELD])
        return afterLayers(parts, RESISTANCE);
    // Opposing fields cancel the equal portion. The remaining field still protects.
    return 1 - Math.abs(effectiveStrength(first, RESISTANCE) - effectiveStrength(second, RESISTANCE));
}

export function wornBreastplateProfile(world, wearerId) {
    const {armor, parts} = wornParts(world, wearerId);
    if (!armor) return {};
    const multiplier = fireAfterLayers(parts);
    return {armor: armor.properties[ARMOR] ?? 0,
        ...(multiplier !== 1 ? {defenseTypes: {fire: multiplier}} : {})};
}

export function settleHeatExposure(engine, {wearer, dose}) {
    const body = substratePort(engine.world)({kind: 'body', id: wearer});
    if (!body || body.quantities.vitality === undefined || !Number.isSafeInteger(dose) || dose < 0)
        throw Error('Heat exposure needs a body and a whole heat dose.');
    return applyHeatDamage(engine, body, Math.round(dose * heatMultiplier(engine.world, wearer)));
}

function heatMultiplier(world, wearer) {
    return heatAfterLayers(wornParts(world, wearer).parts);
}

function heatAfterLayers(parts) {
    const material = parts.reduce((fraction, part) => {
        const layers = readStitchedLayers(part.properties[LINING_MATERIAL])?.layers;
        if (!layers) return fraction * (1 - effectiveStrength(part, MATERIAL_INSULATION));
        const condition = part.quantities.condition ?? 100;
        const outerInsulation = (outerPatch(part)?.insulation ?? layers[0].insulation) * outerIntegrity(part);
        return fraction * (1 - outerInsulation * condition / 10000) * (1 - layers[1].insulation * condition / 10000);
    }, 1);
    const multiplier = material * afterLayers(parts, INSULATION);
    return typedHit({fire: 1}, {fire: multiplier}).multiplier;
}

function applyHeatDamage(engine, body, dose) {
    const damage = Math.min(body.quantities.vitality, dose);
    return {damage, engine: applyEngineOps(engine, [stock(body.holder, 'vitality', -damage)], 'workshop:heat-exposure')};
}

export function readGearExposure(world, {wearer, via, carries, catalogue, total, natural}) {
    const {parts} = wornParts(world, wearer);
    return exposeThroughParts(parts, {via, carries, catalogue, total, natural, at: world.clock});
}

function exposeThroughParts(parts, {via, carries, catalogue, total, natural, at}) {
    const barriers = parts.filter(part => (part.quantities.condition ?? 100) === 100)
        .map(part => ({blocks: part.properties[BARRIER]}));
    return exposuresVia({via, carries, barriers}, catalogue)
        .map(def => ({id: def.id, ...expose(def, {at, total, natural})}));
}

export function readArrivalGearExposure(view, wearer, exposure) {
    const read = ({id, kind}) => {
        const holder = view.holder(id);
        if (!holder || (holder.kind !== kind && !holder.as.includes(kind))) return null;
        return {...holder, holder: id, properties: view.properties(id), quantities: Object.fromEntries(
            [LINING_STOCK, 'condition'].filter(name => view.has(id, name)).map(name => [name, view.amount(id, name)]))};
    };
    return exposeThroughParts(readWornParts(read, wearer).parts, {...exposure, at: view.clock});
}

function heatedExit(engine, wearer, link) {
    const read = substratePort(engine.world);
    const body = read({kind: 'body', id: wearer});
    const exit = body && linkExits(worldLinks(engine.world), body.place, {kinds: ['heated-path']}).find(row => row.link === link);
    return {body, exit};
}

const routeSurveyPrefix = (link, from) => {
    const encode = id => Array.from(id, char => char.codePointAt(0).toString(16)).join('-');
    return `workshop.heat-route.${encode(link)}.${encode(from)}:`;
};

export function surveyHeatedLink(engine, {wearer, link}) {
    const {body, exit} = heatedExit(engine, wearer, link);
    if (!exit) throw Error('Survey an open heated path from its entrance.');
    const destination = engine.world.holders[exit.to];
    const value = JSON.stringify({to: exit.to, minutes: exit.cost, heat: destination.properties[ROUTE_HEAT] ?? 0});
    const record = {id: `${routeSurveyPrefix(link, body.place)}${engine.world.seq}`,
        subject: {kind: 'fact', id: exit.to}, true: {holder: exit.to, property: ROUTE_HEAT}, believed: {value},
        source: {kind: 'observation', by: wearer, from: body.place, at: engine.world.clock}};
    return applyEngineOps(engine, [publishKnowledge(KNOWLEDGE_KINDS.learn, body, {to: wearer, record})], 'workshop:survey-heat');
}

export function forecastHeatedCrossing(engine, {wearer, link, includeHeatRate = false}) {
    const {body, exit} = heatedExit(engine, wearer, link);
    if (!exit) return {known: false};
    const records = recordsOf(engine.world, wearer);
    const survey = latestObservation(records, exit.to, routeSurveyPrefix(link, body.place));
    if (!survey) return {known: false};
    let route;
    try {
        route = JSON.parse(survey.believed.value);
    } catch {
        return {known: false};
    }
    if (route?.to !== exit.to || route.minutes !== exit.cost ||
        !Number.isSafeInteger(route.heat) || route.heat < 0 || route.heat > 100) return {known: false};
    const dose = route.minutes * route.heat;
    if (!Number.isSafeInteger(dose)) return {known: false};
    const protection = forecastHeat(wornParts(engine.world, wearer).parts, body, records);
    if (!protection.known) return {known: false};
    return {known: true, minutes: route.minutes, dose, damage: Math.round(dose * protection.heatMultiplier),
        ...(includeHeatRate ? {heatPerMinute: route.heat * protection.heatMultiplier} : {}),
        routeObservedAt: survey.source.at, liningObservedAt: protection.observedAt};
}

// Forecasts and stepped crossings use the same cumulative rounding.
export function nextHeatExposure(exposure, dose) {
    const total = exposure + dose;
    return {total, amount: Math.round(total) - Math.round(exposure)};
}

export function crossHeatedLink(engine, {wearer, link}) {
    const {body, exit} = heatedExit(engine, wearer, link);
    if (!exit || !Number.isSafeInteger(engine.world.clock + exit.cost)) throw Error('Choose an open heated path.');
    const advanced = advanceEngineWorld(engine, engine.world.clock + exit.cost);
    if (advanced.pending) throw Error('The world clock has more work before this crossing can settle.');
    const current = advanced.engine;
    if (!sameHeatedRoute(current, {wearer, link, from: body.place, to: exit.to, cost: exit.cost}))
        return {engine: current, crossed: false, damage: 0};
    const dosePerMinute = current.world.holders[exit.to].properties[ROUTE_HEAT] ?? 0;
    const harm = settleHeatExposure(current, {wearer, dose: exit.cost * dosePerMinute});
    return finishHeatedCrossing(harm.engine, {wearer: body.holder, from: body.place, to: exit.to, damage: harm.damage});
}

function sameHeatedRoute(engine, {wearer, link, from, to, cost}) {
    const {body, exit} = heatedExit(engine, wearer, link);
    return body?.place === from && exit?.to === to && exit.cost === cost;
}

// Keep this record alongside the engine save while a crossing is underway.
// Each step advances one minute and settles that minute's exposure.
export function beginHeatedCrossing(engine, {wearer, link}) {
    const {body, exit} = heatedExit(engine, wearer, link);
    const at = engine.world.clock;
    if (!exit || exit.cost < 1 || !Number.isSafeInteger(at + exit.cost) || !(body.quantities.vitality > 0))
        throw Error('Choose an open path with time to cross and a wearer able to travel.');
    return {wearer: body.holder, link, from: body.place, to: exit.to, cost: exit.cost,
        at, remaining: exit.cost, exposure: 0, damage: 0};
}

export function stepHeatedCrossing(engine, crossing, {intercept, carriedGear} = {}) {
    const {wearer, to, at, remaining, exposure, damage} = crossing;
    if (engine.world.clock !== at || remaining < 1) throw Error('Resume the crossing at its saved minute.');
    if (!sameHeatedRoute(engine, crossing)) return {engine, crossing: null, crossed: false, damage};
    const advanced = advanceEngineWorld(engine, at + 1);
    if (advanced.pending) throw Error('The world clock has more work before this crossing can settle.');
    const current = advanced.engine;
    const {body} = heatedExit(current, wearer, crossing.link);
    if (!sameHeatedRoute(current, crossing) || !(body?.quantities.vitality > 0))
        return {engine: current, crossing: null, crossed: false, damage};
    const dose = current.world.holders[to].properties[ROUTE_HEAT] ?? 0;
    const {total, amount} = nextHeatExposure(exposure, dose * heatMultiplier(current.world, wearer));
    const impact = intercept && amount ? intercept(current, wearer, amount) : {engine: current, amount};
    const exposed = substratePort(impact.engine.world)({kind: 'body', id: wearer});
    if (!exposed || !sameHeatedRoute(impact.engine, crossing))
        return {engine: impact.engine, crossing: null, crossed: false, damage};
    const harm = applyHeatDamage(impact.engine, exposed, impact.amount);
    const taken = damage + harm.damage;
    if (harm.engine.world.holders[wearer].quantities.vitality === 0)
        return {engine: harm.engine, crossing: null, crossed: false, damage: taken};
    if (remaining === 1) return {...finishHeatedCrossing(harm.engine, {...crossing, damage: taken},
        carriedGear?.(harm.engine, wearer)), crossing: null};
    return {engine: harm.engine, crossing: {...crossing, at: at + 1, remaining: remaining - 1, exposure: total, damage: taken},
        crossed: false, damage: taken};
}

function finishHeatedCrossing(engine, {wearer, from, to, damage}, gear = []) {
    const wear = engine.world.holders[to].properties[ROUTE_WEAR] ?? 0;
    const {parts} = wornParts(engine.world, wearer);
    const outermost = parts[0];
    if (wear && outermost?.quantities.condition !== undefined) {
        const abrasion = readStitchedLayers(outermost.properties[LINING_MATERIAL])
            ? prop(outermost.holder, OUTER_WEAR, Math.min(100, (outermost.properties[OUTER_WEAR] ?? 0) + wear))
            : stock(outermost.holder, 'condition', -Math.min(wear, outermost.quantities.condition));
        engine = applyEngineOps(engine, [abrasion], 'workshop:lining-wear');
    }
    if (engine.world.holders[wearer].quantities.vitality === 0) return {engine, crossed: false, damage};
    const carried = Object.values(engine.world.holders).filter(item => item.kind === 'thing' &&
        item.properties[OWNER] === wearer && item.place === from);
    const ops = [...new Set([wearer, ...carried.map(item => item.id), ...gear])].map(holder => ({op: 'move', holder, to}));
    return {damage, crossed: true, engine: applyEngineOps(engine, ops, 'workshop:heated-crossing')};
}

export function salvageLooseLining(engine, {wearer, lining, scrapId}) {
    const read = substratePort(engine.world);
    const owner = read({kind: 'body', id: wearer}), part = read({kind: 'heatproof_lining', id: lining});
    if (!owner || !heldBy(part, owner) || part.quantities[LINING_STOCK] !== 1 || part.properties[INSTALLED])
        throw Error('Salvage needs a loose lining in your custody.');
    const units = part.properties[FIBER_UNITS] ?? 1;
    const result = planSalvage({cutLoss: {num: 0, den: 1}}, {units, condition: part.quantities.condition ?? 100});
    if (result.reusable === units) return {engine, result};
    // The workshop reweaves either grade of recovered cloth from a retired part.
    const recovered = result.reusable + result.scrap;
    const retire = [stock(part.holder, LINING_STOCK, -1), {op: 'holder_remove', holder: part.holder}];
    if (scrapId !== undefined) {
        if (Object.hasOwn(engine.world.holders, scrapId) || Object.hasOwn(engine.world.identity?.entries ?? {}, scrapId))
            throw Error('Choose a new identity for the recovered cloth.');
        const marks = part.properties.marks?.includes('dense-weave') ? ['dense-weave'] : [];
        const fiberInsulation = part.properties[MATERIAL_INSULATION];
        const density = part.properties[FIBER_DENSITY];
        return {result, engine: applyEngineOps(engine, [...retire, {
            op: 'holder_add', lineage: {act: 'create', parents: [part.holder], note: 'Cloth recovered from a retired lining.'}, value: {
                id: scrapId, kind: 'thing', as: [salvageRoles.scrap], place: owner.place,
                properties: {[OWNER]: owner.holder, marks,
                    ...(density !== undefined ? {[FIBER_DENSITY]: density} : {}),
                    ...(fiberInsulation !== undefined ? {[MATERIAL_INSULATION]: fiberInsulation} : {}),
                    ...(part.properties[LINING_MATERIAL] ? {[LINING_MATERIAL]: part.properties[LINING_MATERIAL]} : {}),
                    ...(part.properties[OUTER_WEAR] !== undefined ? {[OUTER_WEAR]: part.properties[OUTER_WEAR]} : {}),
                    ...(part.properties[OUTER_PATCH] ? {[OUTER_PATCH]: part.properties[OUTER_PATCH]} : {}),
                    ...(part.properties[HIDE_SOURCE] ? {[HIDE_SOURCE]: part.properties[HIDE_SOURCE]} : {})},
                quantities: {[SALVAGE_STOCK]: recovered},
            },
        }], 'workshop:salvage')};
    }
    if ((owner.quantities[SALVAGE_STOCK] ?? 0) > WORLD_QUANTITIES.stock.max - recovered)
        throw Error('Make room for the recovered lining cloth.');
    const carry = owner.quantities[SALVAGE_STOCK] === undefined ? [{op: 'carry', holder: owner.holder, quantity: SALVAGE_STOCK}] : [];
    return {result, engine: applyEngineOps(engine, [...retire, ...carry,
        stock(owner.holder, SALVAGE_STOCK, recovered)], 'workshop:salvage')};
}
