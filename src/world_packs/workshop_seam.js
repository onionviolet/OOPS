// ENF4. Extraction uses the gathering law with the seam's live stock.
import {frontierCatalogue} from '../craft_content_frontier.js';
import {carryLoad, fitJoin, loadLimit, planPartitionProcess, planSalvage, wearFromUse} from '../craft_assembly.js';
import {defineSourceTable, harvest} from '../craft_sources.js';
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {planMaterialPartition, readMaterialLineage} from '../material_lineage.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';
import {linkDistance, linkExits, resolveRef, worldLinks} from '../world_substrate.js';
import {carriesMountedWard, WARD_MOUNT_STRENGTH, WARD_SOCKET, wardMountIsLoose} from './gear_ward.js';
import {STRIKE_REPAIR_MATERIAL, STRIKE_REPAIR_STOCK, STRIKE_SERVICE_LINEAGE, STRIKE_SERVICE_YIELD} from './strike_enchantment.js';

export const SEAM_STOCK = 'stock:workshop_seam';
export const FRAGMENT_STOCK = 'stock:workshop_fragments';
export const PICK_INK = 'stock:workshop_pick_ink';
export const SMELTING_FUEL = 'stock:workshop_smelting_fuel';
export const SMELTED_STOCK = 'stock:workshop_smelted';
export const SMELTED_MATERIAL = 'workshop.smelted_material';
export const WARD_MOUNT_MATERIAL = 'workshop.ward_mount_material';
export const SEAM_GRADE = 'workshop.seam_grade';
export const EXTRACTION_GRADE_LOSS = 'workshop.extraction_grade_loss';
export const GRIP_STOCK = 'stock:workshop_grip';
export const FITTED_BILLET = 'workshop.fitted_billet';
export const CRACKED_AT = 'workshop.cracked_at';
export const SEAT_CONDITION = 'workshop.seat_condition';
export const SEAM_LOAD = 'workshop.seam_load';
export const SEAT_SHIMS = 'stock:workshop_seat_shims';
export const DISASSEMBLY_SUPPLY = 'stock:workshop_disassembly_supply';
export const RECOVERED_IRON = 'stock:workshop_recovered_iron';
export const GRIP_SCRAP = 'stock:workshop_grip_scrap';
export const BLOCKAGE_STOCK = 'stock:workshop_blockage';
export const BLOCKED_LINK = 'workshop.blocked_link';
export const STONE_STOCK = 'stock:workshop_stone';
export const STONE_KEY = 'workshop.stone_key';
export const STONE_GRADE = 'workshop.stone_grade';
export const BEDDING_KEY = 'workshop.bedding_key';
export const SUPPORT_CONDITION = 'workshop.support_condition';
export const SUPPORT_CHIP_LOAD = 'workshop.support_chip_load';
const SUPPORT_STONE_LOSS = 'workshop.support_stone_loss';
export const MORTAR_STOCK = 'stock:workshop_mortar';
export const SUPPORT_BED = 'workshop.support_bed';
export const CARGO_WEIGHT = 'workshop.cargo_weight';
const OWNER = 'workshop.held_by';
const TOOL_LENDER = 'workshop.tool_lender';
const RECALL_TERM = 'workshop.pick_recall_term';
const SPLIT = 'workshop.split_along_grain';
const PRESERVE_ORE = 'workshop.preserve_ore';
const SPLIT_BEARER = 'workshop.split_bearer';
const MATERIAL = 'workshop.fragment_material';
const source = 'workshop-seam';
const capacity = 30;
const sourceTable = (units, grade) => defineSourceTable(frontierCatalogue, {id: 'workshop.extraction', revision: 1, sources: [{
    id: source, kind: 'mine', capacity, variants: {hillore: 1}, quality: [grade, grade],
    yields: [{family: 'hillore', tool: 'pick', qty: [units, units]}],
}]});
const roles = {miner: 'body', pick: 'workshop_pick', seam: 'workshop_seam', output: 'fragment_lot'};
const inscriptionRoles = {miner: roles.miner, pick: roles.pick};
const smeltRoles = {miner: roles.miner, fragments: roles.output, furnace: 'workshop_furnace', billet: 'workshop_billet', slag: 'workshop_slag'};
const fitRoles = {miner: roles.miner, billet: smeltRoles.billet, grip: 'workshop_grip', tool: 'workshop_fitted_tool'};
const proofRoles = {miner: roles.miner, tool: fitRoles.tool};
const handoffRoles = {from: roles.miner, to: roles.miner, tool: fitRoles.tool};
const clearingRoles = {...proofRoles, blockage: 'workshop_blockage', route: 'workshop_blocked_route'};
const recoveryRoles = {...clearingRoles, basket: 'workshop_stone_basket'};
const dressingRoles = {miner: roles.miner, basket: recoveryRoles.basket, block: 'workshop_dressed_stone', chips: 'workshop_stone_chips'};
const mixedDressingRoles = {...dressingRoles, supplement: recoveryRoles.basket};
const passageRoles = {...proofRoles, route: clearingRoles.route};
const freightRoles = {...passageRoles, cargo: 'workshop_freight'};
const wardTravelRoles = {...passageRoles, mount: 'thing', insert: 'thing'};
const wardFreightRoles = {...wardTravelRoles, cargo: freightRoles.cargo};
const supportRoles = {miner: roles.miner, route: clearingRoles.route, support: 'workshop_passage_support'};
const repairRoles = {...supportRoles, block: dressingRoles.block, chips: dressingRoles.chips};
const rebedRoles = {...supportRoles, chips: dressingRoles.chips, removed: dressingRoles.chips};
const replaceBlockRoles = {...supportRoles, block: dressingRoles.block, basket: recoveryRoles.basket};
const stripSupportRoles = {...supportRoles, basket: recoveryRoles.basket};
const rockPassage = (world, id) => worldLinks(world).find(row => row.id === id && row.kind === 'rock-passage');
const recallRoute = (links, from, to) => linkDistance(links, from, to, {kinds: ['rock-passage'], maxCost: 10});
const headRoles = {miner: roles.miner, billet: smeltRoles.billet};
const forgeMountRoles = {...headRoles, furnace: smeltRoles.furnace, mount: 'workshop_ward_mount'};
const salvageMountRoles = {...headRoles, mount: forgeMountRoles.mount};
const traceRoles = {...proofRoles, note: 'workshop_head_pattern'};
const restorePatternRoles = {...headRoles, note: traceRoles.note};
const fittedExtractRoles = {...roles, pick: fitRoles.tool};
const recastRoles = {miner: roles.miner, billet: smeltRoles.billet, furnace: smeltRoles.furnace};
const serviceLotRoles = {...recastRoles, supply: 'workshop_blade_service_lot'};
const blendIronRoles = {...recastRoles, fresh: smeltRoles.billet};
const poolIronRoles = {...blendIronRoles, third: smeltRoles.billet};
const ore = 'Workshop ore fragments', iron = 'Workshop iron billet';
const recoveredIron = 'Workshop recovered iron';
const looseStone = 'Workshop loose stone', dressedStone = 'Workshop dressed stone', stoneChips = 'Workshop stone chips';
const clearingProcess = 'workshop.recover_rubble';
const dressingProcess = 'workshop.dress_stone';
const stripSupportProcess = 'workshop.strip_passage_support';
const stripBlockProcess = 'workshop.strip_passage_block';
const stripProcess = 'workshop.strip_tool', recastProcess = 'workshop.recast_head';
const forgeMountProcess = 'workshop.forge_ward_mount', salvageMountProcess = 'workshop.salvage_ward_mount';
const blendIronProcess = 'workshop.blend_iron';
const serviceLotProcess = 'workshop.forge_blade_service_lot';
const looseIronProcesses = [stripProcess, salvageMountProcess, blendIronProcess];
const ironUnits = 3;
const smeltRow = {id: 'workshop.smelt_fragments', revision: 1, route: 'recipe', unit: 'ore unit',
    yields: {[ore]: iron}, unitsPerInput: 1, product: {family: 'iron', unitsPerItem: ironUnits},
    remainders: [{id: 'Workshop slag', family: 'slag', unitsPerItem: 1}]};
const heldHere = (miner, item) => item.place === miner.place && item.properties[OWNER] === miner.holder;
const GRIP_SOCKET = 'workshop.grip_socket';
const FITTED_SOCKET = 'workshop.fitted_socket';
const HEAD_TRACE = 'workshop.head_trace';
const TRACE_KEYED = 'workshop.trace_keyed';
const TRACE_SPLIT = 'workshop.trace_split';
const TRACE_PRESERVE = 'workshop.trace_preserve_ore';
const headMarks = [SPLIT, PRESERVE_ORE];
const hasHeadMark = part => headMarks.some(mark => part.properties[mark]);
const headMarkEffects = (target, source) => [...headMarks, SPLIT_BEARER].map(property =>
    ({op: 'property', holder: target.holder, property, value: source?.properties[property] ?? null}));
const seatedJoint = {id: 'seat', needs: {head: ['square-tang'], grip: ['square-socket']}};
const toolPath = {geometry: 'direct', paths: {load: ['head', 'seat', 'grip']}};
const passageJoint = {id: 'passage-seat', needs: {support: ['flat-bed'], block: ['flat-base']}};
const blockFitsSupport = support => fitJoin(passageJoint, {
    support: {id: 'Passage support', interfaces: support.properties[SUPPORT_BED] ? [support.properties[SUPPORT_BED]] : []},
    block: {id: 'Dressed stone', interfaces: ['flat-base']},
}).ok;
const passagePath = {geometry: 'direct', paths: {load: ['floor', 'seat']}};

function ironGrade(key, allowedProcesses, family = 'iron') {
    try {
        const lineage = readMaterialLineage(key);
        const last = lineage?.history.at(-1);
        if (lineage?.family !== family || !allowedProcesses.includes(last?.process_id)) return null;
        // Older smelts recorded the grade on the input alone.
        const grade = lineage.facts.quality ?? last.inputs[0]?.facts.quality;
        return Number.isInteger(grade) && grade >= 0 && grade <= 100 ? grade : null;
    } catch {
        return null;
    }
}

const billetGrade = key => ironGrade(key, [smeltRow.id, recastProcess]);
const soundTool = tool => !tool.properties[CRACKED_AT] && billetGrade(tool.properties[FITTED_BILLET]) !== null;
const seatCondition = tool => tool.properties[SEAT_CONDITION] ?? 100;
const toolElements = (tool, grade) => ({head: {capacity: 40},
    seat: {capacity: Math.max(1, Math.floor((10 + Math.floor(grade / 4)) * seatCondition(tool) / 100))},
    grip: {capacity: 32}});
const cutYield = (tool, miner) => tool.properties[SPLIT] &&
    (!tool.properties[SPLIT_BEARER] || tool.properties[SPLIT_BEARER] === miner.holder) ? 4 : 2;
const soundBillet = billet => billet.quantities[SMELTED_STOCK] === 1 &&
    billetGrade(billet.properties[SMELTED_MATERIAL]) !== null;
const emptyBilletRest = billet => billet.quantities[SMELTED_STOCK] === 0 &&
    !billet.quantities[RECOVERED_IRON] && !billet.properties[SMELTED_MATERIAL] &&
    !hasHeadMark(billet) && !billet.properties[SPLIT_BEARER] && billet.properties[SEAT_CONDITION] === undefined;

function recastParent(key) {
    try {
        const cast = readMaterialLineage(key)?.history.at(-1);
        if (cast?.process_id !== recastProcess) return null;
        const scrap = readMaterialLineage(cast.inputs[0].item_key)?.history.at(-1);
        return scrap?.process_id === stripProcess ? scrap.inputs[0].item_key : null;
    } catch {
        return null;
    }
}

function extractOre({bound: {miner, pick, seam, output}, options: {root}, at}, fitted = false) {
    const stock = seam.quantities[SEAM_STOCK];
    if (new Set([miner.holder, pick.holder, seam.holder, output.holder]).size !== 4 ||
        !heldHere(miner, pick) || seam.place !== miner.place || !heldHere(miner, output) ||
        output.quantities[FRAGMENT_STOCK] !== 0 || output.properties[MATERIAL] || !(stock > 0 && stock <= capacity))
        return {ok: false, reason: 'Bring your pick and an empty basket to a vein that still holds ore.'};
    if (fitted && !soundTool(pick))
        return {ok: false, reason: 'Fit a sound head and grip before mining.'};
    const load = fitted ? seam.properties[SEAM_LOAD] : undefined;
    const wear = [];
    let joint;
    if (load !== undefined) {
        const elements = toolElements(pick, billetGrade(pick.properties[FITTED_BILLET]));
        const demand = {load};
        const result = carryLoad(toolPath, elements, demand);
        const limit = loadLimit(toolPath, elements, demand).total;
        if (!result.ok) return {ok: true,
            observed: {seam: seam.holder, taken: 0, remaining: stock, joint: {load, limit, failedAt: result.failedAt}},
            effects: [{op: 'property', holder: pick.holder, property: CRACKED_AT, value: result.failedAt}]};
        const loss = Math.ceil(wearFromUse(toolPath, elements, demand, {wearPerFullLoad: 20}).seat);
        const condition = Math.max(0, seatCondition(pick) - loss);
        joint = {load, limit, condition};
        wear.push({op: 'property', holder: pick.holder, property: SEAT_CONDITION, value: condition});
        if (condition === 0) wear.push({op: 'property', holder: pick.holder, property: CRACKED_AT, value: 'seat'});
    }
    const seamGrade = seam.properties[SEAM_GRADE] ?? 50;
    const ordinaryGrade = Math.max(0, seamGrade - (seam.properties[EXTRACTION_GRADE_LOSS] ?? 0));
    const recoveredGrade = pick.properties[PRESERVE_ORE] ? seamGrade : ordinaryGrade;
    const table = sourceTable(cutYield(pick, miner), recoveredGrade);
    const run = harvest(table, {root, world: 'workshop', location: seam.holder,
        source, at, actor: {tools: ['pick']}, node: {stock, updatedAt: at, harvests: 0, misses: 0}});
    const [{material, qty, quality}] = run.result.items;
    return {ok: true, observed: {seam: seam.holder, taken: qty, remaining: run.node.stock, quality,
        ...(joint ? {joint} : {})},
        costs: [{payer: seam.holder, quantity: SEAM_STOCK, amount: qty}], effects: [
            {op: 'property', holder: output.holder, property: MATERIAL, value: JSON.stringify({material, quality, seam: seam.holder})},
            {op: 'add', holder: output.holder, quantity: FRAGMENT_STOCK, amount: qty},
            ...wear,
        ]};
}

function inscribePickMarks(miner, carrier, marks) {
    if (!heldHere(miner, carrier) || !marks.length || marks.some(mark => carrier.properties[mark]) ||
        !(miner.quantities[PICK_INK] >= marks.length))
        return {ok: false, reason: 'Bring an unmarked iron surface in your custody and inscription ink.'};
    return {ok: true, costs: [{payer: miner.holder, quantity: PICK_INK, amount: marks.length}],
        effects: marks.map(property => ({op: 'property', holder: carrier.holder, property, value: true}))};
}

function clearPassage({bound: {miner, tool, blockage, route, basket}, at}) {
    const exit = route.link && linkExits([route.link], miner.place, {closed: 'any'})[0];
    const stock = blockage.quantities[BLOCKAGE_STOCK];
    if (!heldHere(miner, tool) || !soundTool(tool) || blockage.place !== miner.place ||
        blockage.properties[BLOCKED_LINK] !== route.id || !exit?.forced || !(stock > 0))
        return {ok: false, reason: 'Bring a sound pick to the rock blocking this path.'};
    if (basket && (![tool, blockage].every(item => item.holder !== basket.holder) || !emptyStoneRest(miner, basket)))
        return {ok: false, reason: 'Bring an empty stone basket in your custody.'};
    const removed = Math.min(cutYield(tool, miner), stock);
    const effects = removed === stock ? [{op: 'link_set', id: route.id, state: 'open'}] : [];
    if (basket) {
        const quality = blockage.properties[STONE_GRADE];
        const grade = quality === undefined ? {} : {quality};
        const key = JSON.stringify({id: 'Passage rubble', blockage: blockage.holder, route: route.id, ...grade});
        const recovered = planMaterialPartition({stock: {[key]: stock}, inputs: [{item_key: key, count: removed}],
            unit: 'stone unit', unitsPerInput: () => 1,
            outputs: [{output: {id: looseStone, family: 'stone', count: removed, ...grade}, unitsPerItem: 1}],
            process: {id: clearingProcess, revision: 1, at, world_id: 'workshop'}});
        effects.push(...stoneGrant(basket, recovered.outputs[0]));
    }
    return {ok: true, observed: {removed, remaining: stock - removed}, costs: [
        {payer: blockage.holder, quantity: BLOCKAGE_STOCK, amount: removed},
    ], effects};
}

const emptyStoneRest = (miner, rest) => heldHere(miner, rest) && rest.quantities[STONE_STOCK] === 0 && !rest.properties[STONE_KEY];
const stoneGrant = (rest, output) => [
    {op: 'property', holder: rest.holder, property: STONE_KEY, value: output.item_key},
    {op: 'add', holder: rest.holder, quantity: STONE_STOCK, amount: output.count},
];

function stoneProduct(key, family, process) {
    try {
        const lineage = readMaterialLineage(key);
        return lineage?.family === family && lineage.history.at(-1)?.process_id === process ? lineage : null;
    } catch {
        return null;
    }
}

function installedSupport(support) {
    const block = stoneProduct(support?.properties[STONE_KEY], 'stone-block', dressingProcess);
    const bedding = stoneProduct(support?.properties[BEDDING_KEY], 'stone-chips', dressingProcess);
    if (!block || !bedding) return null;
    return {grade: Math.min(block.facts.quality ?? 50, bedding.facts.quality ?? 50)};
}

function dressStone({bound: {miner, basket, supplement, block, chips}, options: {firstUnits = 4, beddingFrom} = {}, at}) {
    const inputs = [{holder: basket, count: firstUnits}];
    if (supplement) {
        if (!Number.isInteger(firstUnits) || firstUnits < 1 || firstUnits > 3)
            return {ok: false, reason: 'Choose how many of the four stones to take from the first basket.'};
        inputs.push({holder: supplement, count: 4 - firstUnits});
    }
    const lots = inputs.map(({holder, count}) => {
        const key = holder.properties[STONE_KEY];
        const material = stoneProduct(key, 'stone', clearingProcess) ?? stoneProduct(key, 'stone', stripSupportProcess) ??
            stoneProduct(key, 'stone', stripBlockProcess);
        return {holder, count, key, material, stock: holder.quantities[STONE_STOCK]};
    });
    const parts = [miner, ...inputs.map(row => row.holder), block, chips];
    if (new Set(parts.map(part => part.holder)).size !== parts.length ||
        (!supplement && firstUnits !== 4) || (beddingFrom !== undefined && (!supplement ||
            !['basket', 'supplement'].includes(beddingFrom))) || lots.some(({holder, count, material, stock}) =>
            !Number.isInteger(count) || count < 1 || !(stock >= count) || !material || !heldHere(miner, holder)) ||
        ![block, chips].every(rest => emptyStoneRest(miner, rest)))
        return {ok: false, reason: 'Bring four pieces of recovered stone and two empty rests.'};
    const blockProduct = {id: dressedStone, family: 'stone-block', units: 3};
    const chipsProduct = {id: stoneChips, family: 'stone-chips', units: 1};
    const partition = (sources, products) => {
        const stock = {}, selected = {};
        for (const lot of sources) {
            stock[lot.key] = (stock[lot.key] ?? 0) + lot.stock;
            selected[lot.key] = (selected[lot.key] ?? 0) + lot.count;
        }
        const units = products.reduce((total, product) => total + product.units, 0);
        const quality = sources.length === 1 ? sources[0].material.facts.quality : Math.floor(sources.reduce((total, lot) =>
            total + lot.count * (lot.material.facts.quality ?? 50), 0) / units);
        return planMaterialPartition({stock, inputs: Object.entries(selected).map(([item_key, count]) => ({item_key, count})),
            unit: 'stone unit', unitsPerInput: () => 1, outputs: products.map(({id, family, units}) =>
                ({output: {id, family, count: 1, quality}, unitsPerItem: units})),
            process: {id: dressingProcess, revision: 1, at, world_id: 'workshop',
                ...(supplement ? {parameters: {lots: sources.map(lot => ({holder: lot.holder.holder, count: lot.count}))}} : {})}});
    };
    let outputs, balance;
    if (beddingFrom === undefined) {
        ({outputs, balance} = partition(lots, [blockProduct, chipsProduct]));
    } else {
        const beddingLot = lots[beddingFrom === 'basket' ? 0 : 1];
        const blockLots = lots.map(lot => ({...lot, count: lot.count - Number(lot === beddingLot)})).filter(lot => lot.count);
        const dressed = partition(blockLots, [blockProduct]);
        const bedding = partition([{...beddingLot, count: 1}], [chipsProduct]);
        outputs = [...dressed.outputs, ...bedding.outputs];
        balance = {...dressed.balance, input: dressed.balance.input + bedding.balance.input,
            output: dressed.balance.output + bedding.balance.output};
    }
    const effects = [...stoneGrant(block, outputs[0]), ...stoneGrant(chips, outputs[1])];
    for (const lot of lots) if (lot.stock === lot.count)
        effects.push({op: 'property', holder: lot.holder.holder, property: STONE_KEY, value: null});
    return {ok: true, observed: {balance},
        costs: lots.map(lot => ({payer: lot.holder.holder, quantity: STONE_STOCK, amount: lot.count})), effects};
}
const supportCondition = support => support.properties[SUPPORT_CONDITION] ?? 100;
const supportStoneLoss = support => support.properties[SUPPORT_STONE_LOSS] ?? 0;

function crossPassage({bound: {miner, tool, route, cargo, mount, insert}, options: {from, to, cost}}) {
    const exit = route.link && linkExits([route.link], miner.place)[0];
    if (!heldHere(miner, tool) || !exit || miner.place !== from || exit.to !== to || exit.cost !== cost)
        return {ok: false, reason: 'The path or the pick is no longer where you left it.'};
    if (cargo && (cargo.holder === tool.holder || !heldHere(miner, cargo) || !(cargo.properties[CARGO_WEIGHT] > 0)))
        return {ok: false, reason: 'Bring your freight to the entrance.'};
    const travelers = [miner, tool, cargo, mount, insert].filter(Boolean);
    if (mount && (!carriesMountedWard(miner, mount, insert) ||
        new Set(travelers.map(item => item.holder)).size !== travelers.length))
        return {ok: false, reason: 'Wear the ward with its insert still fitted before crossing.'};
    const load = 1 + (cargo?.properties[CARGO_WEIGHT] ?? 0) + (mount ? 2 : 0);
    const support = route.support;
    const repaired = installedSupport(support);
    const condition = repaired ? supportCondition(support) : 0;
    const lost = repaired ? supportStoneLoss(support) : 0;
    const addedCapacity = repaired ? Math.floor(repaired.grade * condition * (3 - lost) / 1500) : 0;
    const capacity = 6 + addedCapacity;
    const demand = {load}, elements = {floor: {capacity: 20}, seat: {capacity}};
    const result = carryLoad(passagePath, elements, demand);
    const observed = {load, limit: loadLimit(passagePath, elements, demand).total};
    if (!result.ok) return {ok: false, reason: 'The passage support cannot carry that load.', observed};
    const effects = travelers.map(({holder}) => ({op: 'move', holder, to}));
    if (repaired && load > 6 && condition > 0) {
        const wear = wearFromUse(passagePath, elements, demand, {wearPerFullLoad: 20});
        effects.push({op: 'property', holder: support.id, property: SUPPORT_CONDITION,
            value: Math.max(0, condition - Math.ceil(wear.seat))});
    }
    const chipLoad = support?.properties[SUPPORT_CHIP_LOAD];
    if (repaired && !lost && chipLoad !== undefined && load >= chipLoad) {
        observed.stoneLost = 1;
        effects.push({op: 'property', holder: support.id, property: SUPPORT_STONE_LOSS, value: 1});
    }
    return {ok: true, observed, effects};
}

const law = defineWorkingLaw({id: 'workshop.extract_seam', revision: 1, operations: {
    forgeWardMount: {roles: forgeMountRoles, settle({bound: {miner, billet, furnace, mount}, options: {breakLoss = 0}, at}) {
        const key = billet.properties[SMELTED_MATERIAL], grade = billetGrade(key);
        if (new Set([miner, billet, furnace, mount].map(item => item.holder)).size !== 4 ||
            !heldHere(miner, billet) || mount.properties.holder !== miner.holder || mount.place !== miner.place ||
            furnace.place !== miner.place || !(furnace.quantities[SMELTING_FUEL] >= 1) ||
            billet.quantities[SMELTED_STOCK] !== 1 || grade === null || hasHeadMark(billet) ||
            mount.properties[WARD_SOCKET] || mount.properties[WARD_MOUNT_MATERIAL] || mount.properties.broken || mount.properties.lost ||
            !Number.isInteger(breakLoss) || breakLoss < 0 || breakLoss >= ironUnits)
            return {ok: false, reason: 'Bring a plain iron billet, fuel and an empty mount rest.'};
        const plan = planMaterialPartition({stock: {[key]: 1}, inputs: [{item_key: key, count: 1}],
            unit: 'ore unit', unitsPerInput: () => ironUnits,
            outputs: [{output: {id: 'Workshop ward mount', family: 'iron-mount', count: 1, quality: grade}, unitsPerItem: ironUnits}],
            process: {id: forgeMountProcess, revision: 1, at, world_id: 'workshop',
                ...(breakLoss ? {parameters: {breakLoss}} : {})}});
        const strength = Math.max(1, Math.floor(grade / 8));
        return {ok: true, observed: {balance: plan.balance, strength}, costs: [
            {payer: billet.holder, quantity: SMELTED_STOCK, amount: 1},
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects: [
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: null},
            {op: 'property', holder: billet.holder, property: SEAT_CONDITION, value: null},
            {op: 'property', holder: mount.holder, property: WARD_MOUNT_MATERIAL, value: plan.outputs[0].item_key},
            {op: 'property', holder: mount.holder, property: WARD_SOCKET, value: 'ward-recess'},
            {op: 'property', holder: mount.holder, property: WARD_MOUNT_STRENGTH, value: strength},
        ]};
    }},
    salvageWardMount: {roles: salvageMountRoles, settle({bound: {miner, billet, mount}, at}) {
        const key = mount.properties[WARD_MOUNT_MATERIAL];
        const grade = ironGrade(key, [forgeMountProcess], 'iron-mount');
        if (new Set([miner, billet, mount].map(item => item.holder)).size !== 3 ||
            !heldHere(miner, billet) || !emptyBilletRest(billet) || mount.properties.holder !== miner.holder ||
            mount.place !== miner.place || !mount.properties.broken || mount.properties.lost || !wardMountIsLoose(mount.properties) ||
            grade === null || !(miner.quantities[DISASSEMBLY_SUPPLY] >= 1))
            return {ok: false, reason: 'Bring a broken empty mount, pry supplies and a rest for the recovered iron.'};
        const loss = readMaterialLineage(key).history.at(-1).parameters.breakLoss ?? 0;
        if (!Number.isInteger(loss) || loss < 0 || loss >= ironUnits)
            return {ok: false, reason: 'The mount has lost its metal record.'};
        const plan = planMaterialPartition({stock: {[key]: 1}, inputs: [{item_key: key, count: 1}],
            unit: 'ore unit', unitsPerInput: () => ironUnits,
            outputs: [{output: {id: recoveredIron, family: 'iron', count: ironUnits - loss, quality: grade}, unitsPerItem: 1}],
            losses: loss ? [{reason: 'Metal scattered when the mount broke', amount: loss}] : [],
            process: {id: salvageMountProcess, revision: 1, at, world_id: 'workshop', parameters: {mount: mount.holder}}});
        const output = plan.outputs[0];
        return {ok: true, observed: {balance: plan.balance}, costs: [
            {payer: miner.holder, quantity: DISASSEMBLY_SUPPLY, amount: 1},
        ], effects: [
            {op: 'property', holder: mount.holder, property: WARD_MOUNT_MATERIAL, value: null},
            {op: 'property', holder: mount.holder, property: 'lost', value: true},
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: output.item_key},
            {op: RECOVERED_IRON in billet.quantities ? 'add' : 'carry', holder: billet.holder, quantity: RECOVERED_IRON, amount: output.count},
        ]};
    }},
    handoff: {roles: handoffRoles, settle({bound: {from, to, tool}, options: {mode, recallTerm}}) {
        const lender = tool.properties[TOOL_LENDER];
        const allowed = mode === 'return' ? lender === to.holder : !lender && ['loan', 'gift'].includes(mode);
        if (!allowed || from.holder === to.holder || !from.place || from.place !== to.place ||
            !heldHere(from, tool) || billetGrade(tool.properties[FITTED_BILLET]) === null)
            return {ok: false, reason: 'Meet the other bearer with the fitted pick and honor its loan.'};
        return {ok: true, observed: {tool: tool.holder, from: from.holder, to: to.holder, mode}, effects: [
            {op: 'property', holder: tool.holder, property: OWNER, value: to.holder},
            {op: 'property', holder: tool.holder, property: TOOL_LENDER, value: mode === 'loan' ? from.holder : null},
            {op: 'property', holder: tool.holder, property: RECALL_TERM, value: mode === 'loan' ? recallTerm ?? null : null},
        ]};
    }},
    recallPick: {roles: handoffRoles, settle({bound: {from, to, tool}, options: {term, origin, destination, quoted}}) {
        const route = recallRoute(tool.links ?? [], from.place, to.place);
        if (!term || tool.properties[RECALL_TERM] !== term || tool.properties[TOOL_LENDER] !== to.holder ||
            !heldHere(from, tool) || from.place !== origin || to.place !== destination ||
            route?.cost !== quoted.cost || JSON.stringify(route.route) !== JSON.stringify(quoted.route) ||
            !(to.quantities[PICK_INK] >= 1))
            return {ok: false, reason: 'The recall needs ink, the agreed loan, and an open return path.'};
        return {ok: true, observed: {tool: tool.holder, path: route.route}, costs: [
            {payer: to.holder, quantity: PICK_INK, amount: 1},
        ], effects: [
            {op: 'move', holder: tool.holder, to: destination},
            {op: 'property', holder: tool.holder, property: OWNER, value: to.holder},
            {op: 'property', holder: tool.holder, property: TOOL_LENDER, value: null},
            {op: 'property', holder: tool.holder, property: RECALL_TERM, value: null},
        ]};
    }},
    inscribe: {roles: inscriptionRoles, settle: ({bound: {miner, pick}}) => inscribePickMarks(miner, pick, [SPLIT])},
    preserveOre: {roles: inscriptionRoles, settle: ({bound: {miner, pick}}) => inscribePickMarks(miner, pick, [PRESERVE_ORE])},
    inscribeHead: {roles: headRoles, settle({bound: {miner, billet}, options: {keyed, preserveOre}}) {
        if (!soundBillet(billet)) return {ok: false, reason: 'Bring a sound iron head to inscribe.'};
        const result = inscribePickMarks(miner, billet, [preserveOre ? PRESERVE_ORE : SPLIT]);
        if (result.ok && !preserveOre && keyed === true)
            result.effects.push({op: 'property', holder: billet.holder, property: SPLIT_BEARER, value: miner.holder});
        return result;
    }},
    attuneHead: {roles: proofRoles, settle({bound: {miner, tool}}) {
        const prior = tool.properties[SPLIT_BEARER];
        if (!heldHere(miner, tool) || !soundTool(tool) || !tool.properties[SPLIT] ||
            !prior || prior === miner.holder || tool.properties[TOOL_LENDER] || !(miner.quantities[PICK_INK] >= 1))
            return {ok: false, reason: 'Bring ink and a sound pick you own that still answers to another bearer.'};
        return {ok: true, costs: [{payer: miner.holder, quantity: PICK_INK, amount: 1}],
            effects: [{op: 'property', holder: tool.holder, property: SPLIT_BEARER, value: miner.holder}]};
    }},
    traceHead: {roles: traceRoles, settle({bound: {miner, tool, note}}) {
        const key = tool.properties[FITTED_BILLET];
        if (tool.holder === note.holder || ![tool, note].every(item => heldHere(miner, item)) ||
            note.properties[HEAD_TRACE] || !hasHeadMark(tool) || tool.properties[CRACKED_AT] ||
            billetGrade(key) === null || !(miner.quantities[PICK_INK] >= 1))
            return {ok: false, reason: 'Bring a sound inscribed pick, a blank sheet, and ink.'};
        return {ok: true, costs: [{payer: miner.holder, quantity: PICK_INK, amount: 1}],
            observed: {source: tool.holder, note: note.holder},
            effects: [
                {op: 'property', holder: note.holder, property: HEAD_TRACE, value: key},
                {op: 'property', holder: note.holder, property: TRACE_KEYED, value: !!tool.properties[SPLIT_BEARER]},
                {op: 'property', holder: note.holder, property: TRACE_SPLIT, value: !!tool.properties[SPLIT]},
                {op: 'property', holder: note.holder, property: TRACE_PRESERVE, value: !!tool.properties[PRESERVE_ORE]},
            ]};
    }},
    restorePattern: {roles: restorePatternRoles, settle({bound: {miner, billet, note}}) {
        const trace = note.properties[HEAD_TRACE];
        if (billet.holder === note.holder || !heldHere(miner, note) || !trace || !soundBillet(billet) ||
            recastParent(billet.properties[SMELTED_MATERIAL]) !== trace)
            return {ok: false, reason: 'Bring the tracing of this head and its recast iron.'};
        // Tracings saved before preservation existed record the split mark.
        const marks = [note.properties[TRACE_SPLIT] !== false && SPLIT, note.properties[TRACE_PRESERVE] && PRESERVE_ORE]
            .filter(mark => mark && !billet.properties[mark]);
        const result = inscribePickMarks(miner, billet, marks);
        if (result.ok && marks.includes(SPLIT) && note.properties[TRACE_KEYED])
            result.effects.push({op: 'property', holder: billet.holder, property: SPLIT_BEARER, value: miner.holder});
        return result.ok ? {...result, observed: {restoredFrom: note.holder}} : result;
    }},
    extract: {roles, settle: context => extractOre(context)},
    extractFitted: {roles: fittedExtractRoles, settle: context => extractOre(context, true)},
    clearRoute: {roles: clearingRoles, settle: clearPassage},
    recoverRubble: {roles: recoveryRoles, settle: clearPassage},
    dressStone: {roles: dressingRoles, settle: dressStone},
    dressMixedStone: {roles: mixedDressingRoles, settle: dressStone},
    repairPassage: {roles: repairRoles, settle({bound: {miner, route, support, block, chips}}) {
        const exit = route.link && linkExits([route.link], miner.place)[0];
        const stone = block.properties[STONE_KEY], bedding = chips.properties[STONE_KEY];
        if (!exit || route.support?.id !== support.holder || support.place !== miner.place ||
            support.properties[STONE_KEY] || support.properties[BEDDING_KEY] ||
            new Set([miner, support, block, chips].map(item => item.holder)).size !== 4 ||
            ![block, chips].every(item => heldHere(miner, item) && item.quantities[STONE_STOCK] === 1) ||
            !stoneProduct(stone, 'stone-block', dressingProcess) || !stoneProduct(bedding, 'stone-chips', dressingProcess))
            return {ok: false, reason: 'Bring a dressed block and bedding chips to the open passage.'};
        if (!blockFitsSupport(support)) return {ok: false, reason: 'The stone does not sit flat in the support.'};
        return {ok: true, costs: [block, chips].map(item => ({payer: item.holder, quantity: STONE_STOCK, amount: 1})),
            effects: [
                ...[block, chips].map(item => ({op: 'property', holder: item.holder, property: STONE_KEY, value: null})),
                {op: 'property', holder: support.holder, property: STONE_KEY, value: stone},
                {op: 'property', holder: support.holder, property: BEDDING_KEY, value: bedding},
                {op: 'property', holder: support.holder, property: SUPPORT_CONDITION, value: 100},
                {op: 'property', holder: support.holder, property: SUPPORT_STONE_LOSS, value: null},
            ]};
    }},
    rebedPassage: {roles: rebedRoles, settle({bound: {miner, route, support, chips, removed}, options: {stone, bedding}}) {
        const exit = route.link && linkExits([route.link], miner.place)[0];
        const replacement = chips.properties[STONE_KEY];
        if (!exit || route.support?.id !== support.holder || support.place !== miner.place ||
            !installedSupport(support) || support.properties[STONE_KEY] !== stone || support.properties[BEDDING_KEY] !== bedding ||
            new Set([miner, support, chips, removed].map(item => item.holder)).size !== 4 ||
            !heldHere(miner, chips) || chips.quantities[STONE_STOCK] !== 1 ||
            !stoneProduct(replacement, 'stone-chips', dressingProcess) || !emptyStoneRest(miner, removed) ||
            !(miner.quantities[MORTAR_STOCK] >= 1))
            return {ok: false, reason: 'Bring replacement chips, mortar, and an empty rest to the installed support.'};
        return {ok: true, observed: {removed: bedding, installed: replacement}, costs: [
            {payer: chips.holder, quantity: STONE_STOCK, amount: 1},
            {payer: miner.holder, quantity: MORTAR_STOCK, amount: 1},
        ], effects: [
            {op: 'property', holder: chips.holder, property: STONE_KEY, value: null},
            {op: 'property', holder: support.holder, property: BEDDING_KEY, value: replacement},
            ...stoneGrant(removed, {item_key: bedding, count: 1}),
        ]};
    }},
    replacePassageBlock: {roles: replaceBlockRoles, settle({bound: {miner, route, support, block, basket}, options: {stone, bedding}, at}) {
        const exit = route.link && linkExits([route.link], miner.place)[0];
        const replacement = block.properties[STONE_KEY];
        const oldBlock = stoneProduct(stone, 'stone-block', dressingProcess);
        if (!exit || route.support?.id !== support.holder || support.place !== miner.place ||
            !oldBlock || support.properties[STONE_KEY] !== stone || support.properties[BEDDING_KEY] !== bedding ||
            !stoneProduct(bedding, 'stone-chips', dressingProcess) ||
            new Set([miner, support, block, basket].map(item => item.holder)).size !== 4 ||
            !heldHere(miner, block) || block.quantities[STONE_STOCK] !== 1 ||
            !stoneProduct(replacement, 'stone-block', dressingProcess) || !emptyStoneRest(miner, basket) ||
            !(miner.quantities[DISASSEMBLY_SUPPLY] >= 1))
            return {ok: false, reason: 'Bring a replacement block, pry supplies, and an empty basket to the installed support.'};
        if (!blockFitsSupport(support)) return {ok: false, reason: 'The stone does not sit flat in the support.'};
        const loss = supportStoneLoss(support);
        const plan = planMaterialPartition({
            stock: {[stone]: 1}, inputs: [{item_key: stone, count: 1}],
            unit: 'stone unit', unitsPerInput: () => 3,
            outputs: [{output: {id: looseStone, family: 'stone', count: 3 - loss,
                quality: oldBlock.facts.quality}, unitsPerItem: 1}],
            losses: loss ? [{amount: loss, reason: 'Stone broken away in the passage'}] : [],
            process: {id: stripBlockProcess, revision: 1, at, world_id: 'workshop',
                parameters: {support: support.holder}},
        });
        return {ok: true, observed: {balance: plan.balance}, costs: [
            {payer: miner.holder, quantity: DISASSEMBLY_SUPPLY, amount: 1},
            {payer: block.holder, quantity: STONE_STOCK, amount: 1},
        ], effects: [
            {op: 'property', holder: block.holder, property: STONE_KEY, value: null},
            {op: 'property', holder: support.holder, property: STONE_KEY, value: replacement},
            {op: 'property', holder: support.holder, property: SUPPORT_STONE_LOSS, value: null},
            ...stoneGrant(basket, plan.outputs[0]),
        ]};
    }},
    stripPassageSupport: {roles: stripSupportRoles, settle({bound: {miner, route, support, basket}, options: {stone, bedding}, at}) {
        const exit = route.link && linkExits([route.link], miner.place)[0];
        const installed = installedSupport(support);
        if (!exit || route.support?.id !== support.holder || support.place !== miner.place || !installed ||
            support.properties[STONE_KEY] !== stone || support.properties[BEDDING_KEY] !== bedding ||
            support.holder === basket.holder || !emptyStoneRest(miner, basket) ||
            !(miner.quantities[DISASSEMBLY_SUPPLY] >= 1))
            return {ok: false, reason: 'Bring pry supplies and an empty basket to the installed support.'};
        const loss = supportStoneLoss(support);
        const plan = planMaterialPartition({
            stock: {[stone]: 1, [bedding]: 1},
            inputs: [{item_key: stone, count: 1}, {item_key: bedding, count: 1}],
            unit: 'stone unit', unitsPerInput: key => key === stone ? 3 : 1,
            outputs: [{output: {id: looseStone, family: 'stone', count: 4 - loss, quality: installed.grade}, unitsPerItem: 1}],
            losses: loss ? [{amount: loss, reason: 'Stone broken away in the passage'}] : [],
            process: {id: stripSupportProcess, revision: 1, at, world_id: 'workshop',
                parameters: {support: support.holder, ...(loss ? {stoneLost: loss} : {})}},
        });
        return {ok: true, observed: {balance: plan.balance}, costs: [
            {payer: miner.holder, quantity: DISASSEMBLY_SUPPLY, amount: 1},
        ], effects: [
            ...stoneGrant(basket, plan.outputs[0]),
            ...[STONE_KEY, BEDDING_KEY, SUPPORT_CONDITION, SUPPORT_STONE_LOSS].map(property =>
                ({op: 'property', holder: support.holder, property, value: null})),
        ]};
    }},
    maintainPassage: {roles: supportRoles, settle({bound: {miner, route, support}}) {
        const exit = route.link && linkExits([route.link], miner.place)[0];
        const condition = supportCondition(support);
        if (!exit || route.support?.id !== support.holder || support.place !== miner.place ||
            !installedSupport(support) || condition >= 100 || !(miner.quantities[MORTAR_STOCK] >= 1))
            return {ok: false, reason: 'Bring mortar to a worn stone support at this passage.'};
        const restored = Math.min(100, condition + 30);
        return {ok: true, observed: {before: condition, after: restored},
            costs: [{payer: miner.holder, quantity: MORTAR_STOCK, amount: 1}],
            effects: [{op: 'property', holder: support.holder, property: SUPPORT_CONDITION, value: restored}]};
    }},
    crossRoute: {roles: passageRoles, settle: crossPassage},
    crossWithFreight: {roles: freightRoles, settle: crossPassage},
    crossWithWard: {roles: wardTravelRoles, settle: crossPassage},
    crossWithWardAndFreight: {roles: wardFreightRoles, settle: crossPassage},
    smelt: {roles: smeltRoles, settle({bound: {miner, fragments, furnace, billet, slag}, at}) {
        if (new Set([miner, fragments, furnace, billet, slag].map(item => item.holder)).size !== 5 ||
            [fragments, furnace, billet, slag].some(item => item.place !== miner.place) ||
            [fragments, billet, slag].some(item => item.properties[OWNER] !== miner.holder) ||
            [billet, slag].some(item => !emptyBilletRest(item)) ||
            !(furnace.quantities[SMELTING_FUEL] >= 1) || !(fragments.quantities[FRAGMENT_STOCK] >= 4) || !fragments.properties[MATERIAL])
            return {ok: false, reason: 'Bring four ore fragments, fuel in the furnace, and two empty containers.'};
        let batch;
        try {
            batch = JSON.parse(fragments.properties[MATERIAL]);
        } catch {
            return {ok: false, reason: 'The ore lot has lost its material record.'};
        }
        const {material, quality, seam} = batch ?? {};
        if (material?.family !== 'hillore' || typeof material.id !== 'string' ||
            !Number.isInteger(quality) || quality < 0 || quality > 100 || typeof seam !== 'string' || !seam)
            return {ok: false, reason: 'The ore lot has lost its material record.'};
        const key = JSON.stringify({id: ore, quality, lot: fragments.holder, material: material.id, seam});
        const plan = planPartitionProcess(smeltRow, {resultId: iron, allocations: [{item_key: key, count: 4}], crafted: {[quality]: 1},
            stock: {[key]: fragments.quantities[FRAGMENT_STOCK]}, clock: at, world: 'workshop'});
        const spent = plan.inputs[0].count;
        const effects = [billet, slag].flatMap((holder, index) => [
            {op: 'property', holder: holder.holder, property: SMELTED_MATERIAL, value: plan.outputs[index].item_key},
            {op: 'add', holder: holder.holder, quantity: SMELTED_STOCK, amount: plan.outputs[index].count},
        ]);
        if (spent === fragments.quantities[FRAGMENT_STOCK])
            effects.push({op: 'property', holder: fragments.holder, property: MATERIAL, value: null});
        return {ok: true, observed: {fragments: fragments.holder, balance: plan.balance}, costs: [
            {payer: fragments.holder, quantity: FRAGMENT_STOCK, amount: spent},
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects};
    }},
    fit: {roles: fitRoles, settle({bound: {miner, billet, grip, tool}}) {
        const key = billet.properties[SMELTED_MATERIAL];
        if (new Set([miner, billet, grip, tool].map(item => item.holder)).size !== 4 ||
            ![billet, grip, tool].every(item => heldHere(miner, item)) || billet.quantities[SMELTED_STOCK] !== 1 ||
            !(grip.quantities[GRIP_STOCK] >= 1) || tool.properties[FITTED_BILLET] || tool.properties[CRACKED_AT] ||
            hasHeadMark(tool) || tool.properties[SPLIT_BEARER] || billetGrade(key) === null)
            return {ok: false, reason: 'Bring a sound iron billet, a grip, and an empty tool rest.'};
        const fit = fitJoin(seatedJoint, {
            head: {id: 'Iron head', interfaces: ['square-tang']},
            grip: {id: 'Grip', interfaces: grip.properties[GRIP_SOCKET] ? [grip.properties[GRIP_SOCKET]] : []},
        });
        if (!fit.ok) return {ok: false, reason: 'The grip socket does not fit the square tang.'};
        return {ok: true, costs: [
            {payer: billet.holder, quantity: SMELTED_STOCK, amount: 1},
            {payer: grip.holder, quantity: GRIP_STOCK, amount: 1},
        ], effects: [
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: null},
            ...headMarkEffects(billet),
            {op: 'property', holder: billet.holder, property: SEAT_CONDITION, value: null},
            {op: 'property', holder: tool.holder, property: FITTED_BILLET, value: key},
            {op: 'property', holder: tool.holder, property: SEAT_CONDITION, value: billet.properties[SEAT_CONDITION] ?? null},
            ...headMarkEffects(tool, billet),
            {op: 'property', holder: tool.holder, property: FITTED_SOCKET, value: grip.properties[GRIP_SOCKET]},
        ]};
    }},
    proof: {roles: proofRoles, settle({bound: {miner, tool}, options: {load}}) {
        const grade = billetGrade(tool.properties[FITTED_BILLET]);
        if (!heldHere(miner, tool) || grade === null || tool.properties[CRACKED_AT] || !Number.isSafeInteger(load) || load <= 0)
            return {ok: false, reason: 'Bring a fitted tool with no cracks and choose a positive load.'};
        const elements = toolElements(tool, grade);
        const demand = {load};
        const result = carryLoad(toolPath, elements, demand);
        return {ok: true, observed: {...result, limit: loadLimit(toolPath, elements, demand).total},
            effects: result.ok ? [] : [{op: 'property', holder: tool.holder, property: CRACKED_AT, value: result.failedAt}]};
    }},
    serviceSeat: {roles: proofRoles, settle({bound: {miner, tool}, options: {head}}) {
        const before = seatCondition(tool);
        if (!heldHere(miner, tool) || !soundTool(tool) || tool.properties[FITTED_BILLET] !== head ||
            before === 100 || !(miner.quantities[SEAT_SHIMS] >= 1))
            return {ok: false, reason: 'Bring the same worn, uncracked pick and a fresh shim.'};
        return {ok: true, observed: {before, after: 100},
            costs: [{payer: miner.holder, quantity: SEAT_SHIMS, amount: 1}],
            effects: [{op: 'property', holder: tool.holder, property: SEAT_CONDITION, value: 100}]};
    }},
    strip: {roles: fitRoles, settle({bound: {miner, billet, grip, tool}, at}) {
        const key = tool.properties[FITTED_BILLET];
        const grade = billetGrade(key);
        if (new Set([miner, billet, grip, tool].map(item => item.holder)).size !== 4 ||
            ![billet, grip, tool].every(item => heldHere(miner, item)) || tool.properties[TOOL_LENDER] || !emptyBilletRest(billet) ||
            grip.quantities[GRIP_STOCK] !== 0 || grip.quantities[GRIP_SCRAP] ||
            !(miner.quantities[DISASSEMBLY_SUPPLY] >= 1) || grade === null)
            return {ok: false, reason: 'Bring your fitted tool, pry supplies, and empty rests for the head and grip.'};
        const crack = tool.properties[CRACKED_AT];
        const metalCracked = crack === 'seat' || crack === 'head';
        const gripCracked = crack === 'grip';
        const recovery = planSalvage({cutLoss: {num: 0, den: 1}}, {units: ironUnits, condition: metalCracked ? 67 : 100});
        const gripRecovery = planSalvage({cutLoss: {num: 0, den: 1}}, {units: 1, condition: gripCracked ? 0 : 100});
        const recovered = metalCracked ? planMaterialPartition({
            stock: {[key]: 1}, inputs: [{item_key: key, count: 1}], unit: smeltRow.unit, unitsPerInput: () => ironUnits,
            outputs: [{output: {id: recoveredIron, family: 'iron', quality: grade, count: ironUnits}, unitsPerItem: 1}],
            process: {id: stripProcess, revision: 1, at, world_id: 'workshop', parameters: {tool: tool.holder, ...recovery}},
        }).outputs[0].item_key : key;
        const ironStock = metalCracked ? RECOVERED_IRON : SMELTED_STOCK;
        const gripStock = gripCracked ? GRIP_SCRAP : GRIP_STOCK;
        return {ok: true, observed: {iron: recovery, grip: gripRecovery}, costs: [
            {payer: miner.holder, quantity: DISASSEMBLY_SUPPLY, amount: 1},
        ], effects: [
            {op: 'property', holder: tool.holder, property: FITTED_BILLET, value: null},
            {op: 'property', holder: tool.holder, property: FITTED_SOCKET, value: null},
            {op: 'property', holder: tool.holder, property: CRACKED_AT, value: null},
            {op: 'property', holder: tool.holder, property: SEAT_CONDITION, value: null},
            ...headMarkEffects(tool),
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: recovered},
            {op: 'property', holder: billet.holder, property: SEAT_CONDITION,
                value: metalCracked ? null : tool.properties[SEAT_CONDITION] ?? null},
            ...headMarkEffects(billet, metalCracked ? null : tool),
            {op: ironStock in billet.quantities ? 'add' : 'carry', holder: billet.holder, quantity: ironStock,
                amount: metalCracked ? recovery.reusable + recovery.scrap : 1},
            {op: 'property', holder: grip.holder, property: GRIP_SOCKET,
                value: gripCracked ? null : tool.properties[FITTED_SOCKET] ?? 'square-socket'},
            {op: gripStock in grip.quantities ? 'add' : 'carry', holder: grip.holder, quantity: gripStock, amount: 1},
        ]};
    }},
    forgeServiceLot: {roles: serviceLotRoles, settle({bound: {miner, billet, furnace, supply}, options: {sourceKey} = {}, at}) {
        const key = billet.properties[SMELTED_MATERIAL];
        const grade = ironGrade(key, looseIronProcesses);
        const stock = billet.quantities[RECOVERED_IRON];
        if (new Set([miner, billet, furnace, supply].map(item => item.holder)).size !== 4 ||
            !heldHere(miner, billet) || !heldHere(miner, supply) || furnace.place !== miner.place ||
            !(furnace.quantities[SMELTING_FUEL] >= 1) || grade === null || !(stock >= 1) ||
            (sourceKey !== undefined && sourceKey !== key) ||
            billet.quantities[SMELTED_STOCK] !== 0 || supply.quantities[STRIKE_REPAIR_STOCK] !== 0 ||
            supply.properties[STRIKE_SERVICE_LINEAGE] || supply.properties[STRIKE_REPAIR_MATERIAL] ||
            supply.properties[STRIKE_SERVICE_YIELD])
            return {ok: false, reason: 'Bring recovered iron, a fuelled furnace and an empty repair-lot rest.'};
        const plan = planMaterialPartition({
            stock: {[key]: stock}, inputs: [{item_key: key, count: 1}], unit: smeltRow.unit, unitsPerInput: () => 1,
            outputs: [{output: {id: 'Workshop blade repair iron', family: 'blade-service-iron',
                quality: grade, count: 1}, unitsPerItem: 1}],
            process: {id: serviceLotProcess, revision: 1, at, world_id: 'workshop', parameters: {source: billet.holder}},
        });
        const restored = 1 + Math.floor(grade / 4);
        return {ok: true, observed: {balance: plan.balance, restored}, costs: [
            {payer: billet.holder, quantity: RECOVERED_IRON, amount: 1},
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects: [
            {op: 'property', holder: supply.holder, property: STRIKE_SERVICE_LINEAGE, value: plan.outputs[0].item_key},
            {op: 'property', holder: supply.holder, property: STRIKE_REPAIR_MATERIAL, value: 'iron'},
            {op: 'property', holder: supply.holder, property: STRIKE_SERVICE_YIELD, value: restored},
            {op: 'add', holder: supply.holder, quantity: STRIKE_REPAIR_STOCK, amount: 1},
            ...(stock === 1 ? [{op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: null}] : []),
        ]};
    }},
    recast: {roles: recastRoles, settle({bound: {miner, billet, furnace}, at}) {
        const key = billet.properties[SMELTED_MATERIAL];
        const grade = ironGrade(key, looseIronProcesses);
        if (new Set([miner, billet, furnace].map(item => item.holder)).size !== 3 || !heldHere(miner, billet) ||
            furnace.place !== miner.place || !(furnace.quantities[SMELTING_FUEL] >= 1) || grade === null ||
            billet.quantities[RECOVERED_IRON] !== ironUnits || billet.quantities[SMELTED_STOCK] !== 0)
            return {ok: false, reason: 'Bring a full lot of recovered iron and fuel for the furnace.'};
        const plan = planMaterialPartition({
            stock: {[key]: ironUnits}, inputs: [{item_key: key, count: ironUnits}], unit: smeltRow.unit, unitsPerInput: () => 1,
            outputs: [{output: {id: iron, family: 'iron', quality: grade, count: 1}, unitsPerItem: ironUnits}],
            process: {id: recastProcess, revision: 1, at, world_id: 'workshop'},
        });
        return {ok: true, observed: {balance: plan.balance}, costs: [
            {payer: billet.holder, quantity: RECOVERED_IRON, amount: ironUnits},
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects: [
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: plan.outputs[0].item_key},
            {op: 'add', holder: billet.holder, quantity: SMELTED_STOCK, amount: 1},
        ]};
    }},
    blendIron: {roles: blendIronRoles, settle({bound: {miner, billet, fresh, furnace}, at}) {
        const scrap = billet.properties[SMELTED_MATERIAL], stock = fresh.properties[SMELTED_MATERIAL];
        const scrapGrade = ironGrade(scrap, looseIronProcesses);
        const freshCount = fresh.quantities[RECOVERED_IRON] ?? 0;
        const cutBillet = freshCount === 0;
        const freshGrade = cutBillet ? billetGrade(stock) : ironGrade(stock, looseIronProcesses);
        const recovered = billet.quantities[RECOVERED_IRON];
        const topUp = ironUnits - recovered;
        if (new Set([miner, billet, fresh, furnace].map(item => item.holder)).size !== 4 ||
            ![billet, fresh].every(item => heldHere(miner, item)) || furnace.place !== miner.place ||
            !(furnace.quantities[SMELTING_FUEL] >= 1) || !(recovered > 0 && recovered < ironUnits) ||
            billet.quantities[SMELTED_STOCK] !== 0 || hasHeadMark(fresh) ||
            (cutBillet ? !soundBillet(fresh) : fresh.quantities[SMELTED_STOCK] !== 0 || freshCount < topUp) ||
            scrapGrade === null || freshGrade === null)
            return {ok: false, reason: 'Bring a partial lot of iron, enough plain iron to fill it and furnace fuel.'};
        const quality = Math.floor((recovered * scrapGrade + topUp * freshGrade) / ironUnits);
        const cut = cutBillet && planMaterialPartition({stock: {[stock]: 1}, inputs: [{item_key: stock, count: 1}],
            unit: smeltRow.unit, unitsPerInput: () => ironUnits,
            outputs: [{output: {id: recoveredIron, family: 'iron', count: ironUnits, quality: freshGrade}, unitsPerItem: 1}],
            process: {id: blendIronProcess, revision: 1, at, world_id: 'workshop', parameters: {lot: fresh.holder}}});
        const freshUnits = cutBillet ? cut.outputs[0].item_key : stock;
        const available = cutBillet ? ironUnits : freshCount;
        const offcut = available - topUp;
        const sameLot = scrap === freshUnits;
        const inputs = sameLot ? [{item_key: scrap, count: ironUnits}] :
            [{item_key: scrap, count: recovered}, {item_key: freshUnits, count: topUp}];
        const blend = planMaterialPartition({
            stock: sameLot ? {[scrap]: recovered + available} : {[scrap]: recovered, [freshUnits]: available},
            inputs, unit: smeltRow.unit, unitsPerInput: () => 1,
            outputs: [{output: {id: iron, family: 'iron', quality, count: 1}, unitsPerItem: ironUnits}],
            process: {id: recastProcess, revision: 1, at, world_id: 'workshop'},
        });
        const effects = [
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: blend.outputs[0].item_key},
            {op: 'add', holder: billet.holder, quantity: SMELTED_STOCK, amount: 1},
        ];
        if (cutBillet) effects.push(
            {op: 'property', holder: fresh.holder, property: SMELTED_MATERIAL, value: freshUnits},
            {op: 'property', holder: fresh.holder, property: SEAT_CONDITION, value: null},
            {op: RECOVERED_IRON in fresh.quantities ? 'add' : 'carry', holder: fresh.holder, quantity: RECOVERED_IRON, amount: offcut},
        );
        else if (!offcut) effects.push({op: 'property', holder: fresh.holder, property: SMELTED_MATERIAL, value: null});
        return {ok: true, observed: {quality, recovered, fresh: topUp, offcut,
            balance: cutBillet
                ? {unit: smeltRow.unit, input: recovered + available, output: blend.balance.output + offcut, loss: 0}
                : blend.balance}, costs: [
            {payer: billet.holder, quantity: RECOVERED_IRON, amount: recovered},
            {payer: fresh.holder, quantity: cutBillet ? SMELTED_STOCK : RECOVERED_IRON, amount: cutBillet ? 1 : topUp},
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects};
    }},
    poolIron: {roles: poolIronRoles, settle({bound: {miner, billet, fresh, third, furnace}, at}) {
        const lots = [billet, fresh, third].map(holder => {
            const key = holder.properties[SMELTED_MATERIAL];
            return {holder, key, grade: ironGrade(key, looseIronProcesses), stock: holder.quantities[RECOVERED_IRON]};
        });
        if (new Set([miner, billet, fresh, third, furnace].map(item => item.holder)).size !== 5 ||
            furnace.place !== miner.place || !(furnace.quantities[SMELTING_FUEL] >= 1) || lots.some(({holder, grade, stock}) =>
                !heldHere(miner, holder) || holder.quantities[SMELTED_STOCK] !== 0 ||
                grade === null || !(stock >= 1)) || lots[0].stock !== 1)
            return {ok: false, reason: 'Bring three loose iron lots, one unit in the billet rest, and furnace fuel.'};
        // One unit per holder fills the three-unit billet. Equal material keys
        // share a lineage allocation while the costs still debit each holder.
        const counts = {};
        for (const {key} of lots) counts[key] = (counts[key] ?? 0) + 1;
        const quality = Math.floor(lots.reduce((sum, lot) => sum + lot.grade, 0) / ironUnits);
        const plan = planMaterialPartition({
            stock: counts, inputs: Object.entries(counts).map(([item_key, count]) => ({item_key, count})),
            unit: smeltRow.unit, unitsPerInput: () => 1,
            outputs: [{output: {id: iron, family: 'iron', quality, count: 1}, unitsPerItem: ironUnits}],
            process: {id: recastProcess, revision: 1, at, world_id: 'workshop',
                parameters: {lots: lots.map(lot => lot.holder.holder)}},
        });
        return {ok: true, observed: {quality, balance: plan.balance}, costs: [
            ...lots.map(({holder}) => ({payer: holder.holder, quantity: RECOVERED_IRON, amount: 1})),
            {payer: furnace.holder, quantity: SMELTING_FUEL, amount: 1},
        ], effects: [
            ...lots.slice(1).filter(lot => lot.stock === 1).map(({holder}) =>
                ({op: 'property', holder: holder.holder, property: SMELTED_MATERIAL, value: null})),
            {op: 'property', holder: billet.holder, property: SMELTED_MATERIAL, value: plan.outputs[0].item_key},
            {op: 'add', holder: billet.holder, quantity: SMELTED_STOCK, amount: 1},
        ]};
    }},
}});

export const workshopSeamConfig = {shared: {quantities: [WORLD_QUANTITIES.stock], properties: [
    {id: OWNER, type: 'label'}, {id: MATERIAL, type: 'label'}, {id: SPLIT, type: 'flag'}, {id: SMELTED_MATERIAL, type: 'label'},
    {id: SEAM_GRADE, type: 'level', min: 0, max: 100}, {id: GRIP_SOCKET, type: 'label'},
    {id: EXTRACTION_GRADE_LOSS, type: 'level', min: 0, max: 100}, {id: PRESERVE_ORE, type: 'flag'},
    {id: SEAM_LOAD, type: 'level', min: 1}, {id: SEAT_CONDITION, type: 'level', min: 0, max: 100},
    {id: FITTED_BILLET, type: 'label'}, {id: FITTED_SOCKET, type: 'label'}, {id: CRACKED_AT, type: 'label'},
    {id: HEAD_TRACE, type: 'label'}, {id: BLOCKED_LINK, type: 'label'}, {id: STONE_KEY, type: 'label'},
    {id: BEDDING_KEY, type: 'label'}, {id: SUPPORT_BED, type: 'label'}, {id: CARGO_WEIGHT, type: 'level', min: 1, max: 100},
    {id: SUPPORT_CONDITION, type: 'level', min: 0, max: 100},
    {id: SUPPORT_CHIP_LOAD, type: 'level', min: 7, max: 20},
    {id: SUPPORT_STONE_LOSS, type: 'level', min: 0, max: 1},
    {id: STONE_GRADE, type: 'level', min: 0, max: 100},
    {id: TOOL_LENDER, type: 'label'}, {id: RECALL_TERM, type: 'label'}, {id: SPLIT_BEARER, type: 'label'},
    {id: TRACE_KEYED, type: 'flag'}, {id: TRACE_SPLIT, type: 'flag'}, {id: TRACE_PRESERVE, type: 'flag'},
    {id: WARD_MOUNT_MATERIAL, type: 'label'},
    {id: STRIKE_REPAIR_MATERIAL, type: 'label'}, {id: STRIKE_SERVICE_YIELD, type: 'level', min: 1, max: 100},
    {id: STRIKE_SERVICE_LINEAGE, type: 'label'},
]}, host: {laws: [law], ports: {readThing(ref, at, world) {
    if (ref.kind === fitRoles.tool && resolveRef(world, ref))
        return {links: worldLinks(world).filter(link => link.kind === 'rock-passage')};
    if (ref.kind !== clearingRoles.route) return null;
    const link = rockPassage(world, ref.id);
    if (!link) return null;
    const supports = Object.values(world.holders).filter(holder => holder.as.includes(repairRoles.support) &&
        holder.properties[BLOCKED_LINK] === link.id && [link.from, link.to].includes(holder.place));
    return {link, support: supports.length === 1 ? supports[0] : null};
}}}};

export function startSeamExtraction(engine, {id, miner, pick, seam, output}) {
    return startSeamWork(engine, id, 'extract', {miner, pick, seam, output}, {root: engine.draws.root});
}

export function startPickInscription(engine, {id, miner, pick, preserveOre = false}) {
    return startSeamWork(engine, id, preserveOre ? 'preserveOre' : 'inscribe', {miner, pick});
}

export function startHeadInscription(engine, {id, miner, billet, keyed = false, preserveOre = false}) {
    return startSeamWork(engine, id, 'inscribeHead', {miner, billet}, {keyed, preserveOre});
}

export function startHeadAttunement(engine, {id, miner, tool}) {
    return startSeamWork(engine, id, 'attuneHead', {miner, tool});
}

export function startHeadTracing(engine, {id, miner, tool, note}) {
    return startSeamWork(engine, id, 'traceHead', {miner, tool, note});
}

export function startHeadPatternRestore(engine, {id, miner, billet, note}) {
    return startSeamWork(engine, id, 'restorePattern', {miner, billet, note});
}

export function startFittedExtraction(engine, {id, miner, tool, seam, output}) {
    return startSeamWork(engine, id, 'extractFitted', {miner, pick: tool, seam, output}, {root: engine.draws.root});
}

export function startPickHandoff(engine, {id, from, to, tool, mode, recall = false}) {
    return startSeamWork(engine, id, 'handoff', {from, to, tool}, {mode, recallTerm: recall ? id : null});
}

export function startPickRecall(engine, {id, lender, borrower, tool}) {
    const world = engine.world;
    const origin = world.holders[resolveRef(world, {kind: handoffRoles.from, id: borrower})]?.place;
    const destination = world.holders[resolveRef(world, {kind: handoffRoles.to, id: lender})]?.place;
    const quoted = origin && destination && origin !== destination && recallRoute(worldLinks(world), origin, destination);
    if (!quoted) throw Error('Choose an open return path within ten minutes.');
    const carrier = resolveRef(world, {kind: handoffRoles.tool, id: tool});
    const term = world.holders[carrier]?.properties[RECALL_TERM] ?? null;
    return startSeamWork(engine, id, 'recallPick', {from: borrower, to: lender, tool},
        {term, origin, destination, quoted}, 1 + quoted.cost);
}

export function startRouteClearing(engine, {id, miner, tool, blockage, route, basket}) {
    const holders = {miner, tool, blockage, route};
    return basket === undefined ? startSeamWork(engine, id, 'clearRoute', holders)
        : startSeamWork(engine, id, 'recoverRubble', {...holders, basket});
}

export function startStoneDressing(engine, {id, miner, basket, block, chips, supplement, firstUnits = 3, beddingFrom}) {
    const holders = {miner, basket, block, chips};
    return supplement === undefined ? startSeamWork(engine, id, 'dressStone', holders,
        beddingFrom === undefined ? {} : {beddingFrom})
        : startSeamWork(engine, id, 'dressMixedStone', {...holders, supplement},
            {firstUnits, ...(beddingFrom === undefined ? {} : {beddingFrom})});
}

export function startPassageRepair(engine, {id, miner, route, support, block, chips}) {
    return startSeamWork(engine, id, 'repairPassage', {miner, route, support, block, chips});
}

export function startPassageRebedding(engine, {id, miner, route, support, chips, removed}) {
    const properties = engine.world.holders[support]?.properties;
    return startSeamWork(engine, id, 'rebedPassage', {miner, route, support, chips, removed},
        {stone: properties?.[STONE_KEY] ?? null, bedding: properties?.[BEDDING_KEY] ?? null});
}

export function startPassageBlockReplacement(engine, {id, miner, route, support, block, basket}) {
    const properties = engine.world.holders[support]?.properties;
    return startSeamWork(engine, id, 'replacePassageBlock', {miner, route, support, block, basket},
        {stone: properties?.[STONE_KEY] ?? null, bedding: properties?.[BEDDING_KEY] ?? null});
}

export function startPassageMaintenance(engine, {id, miner, route, support}) {
    return startSeamWork(engine, id, 'maintainPassage', {miner, route, support});
}

export function startPassageSupportSalvage(engine, {id, miner, route, support, basket}) {
    const properties = engine.world.holders[support]?.properties;
    return startSeamWork(engine, id, 'stripPassageSupport', {miner, route, support, basket},
        {stone: properties?.[STONE_KEY] ?? null, bedding: properties?.[BEDDING_KEY] ?? null});
}

export function startRockPassageCrossing(engine, {id, miner, tool, route, cargo, ward}) {
    const from = engine.world.holders[miner]?.place;
    const link = rockPassage(engine.world, route);
    const exit = link && linkExits([link], from)[0];
    if (!exit) throw Error('Choose an open rock passage from your current place.');
    const options = {from, to: exit.to, cost: exit.cost};
    if (ward !== undefined) {
        const {mount, insert} = ward;
        return cargo === undefined
            ? startSeamWork(engine, id, 'crossWithWard', {miner, tool, route, mount, insert}, options, exit.cost)
            : startSeamWork(engine, id, 'crossWithWardAndFreight', {miner, tool, route, mount, insert, cargo}, options, exit.cost);
    }
    return cargo === undefined ? startSeamWork(engine, id, 'crossRoute', {miner, tool, route}, options, exit.cost)
        : startSeamWork(engine, id, 'crossWithFreight', {miner, tool, route, cargo}, options, exit.cost);
}

export function startSeamSmelting(engine, {id, miner, fragments, furnace, billet, slag}) {
    return startSeamWork(engine, id, 'smelt', {miner, fragments, furnace, billet, slag});
}

export function startBilletFitting(engine, {id, miner, billet, grip, tool}) {
    return startSeamWork(engine, id, 'fit', {miner, billet, grip, tool});
}

export function startWardMountForging(engine, {id, miner, billet, furnace, mount, breakLoss = 0}) {
    return startSeamWork(engine, id, 'forgeWardMount', {miner, billet, furnace, mount}, {breakLoss});
}

export function startWardMountSalvage(engine, {id, miner, billet, mount}) {
    return startSeamWork(engine, id, 'salvageWardMount', {miner, billet, mount});
}

export function startToolProof(engine, {id, miner, tool, load}) {
    return startSeamWork(engine, id, 'proof', {miner, tool}, {load});
}

export function startToolSeatService(engine, {id, miner, tool}) {
    const head = engine.world.holders[tool]?.properties[FITTED_BILLET] ?? null;
    return startSeamWork(engine, id, 'serviceSeat', {miner, tool}, {head});
}

export function startToolDisassembly(engine, {id, miner, billet, grip, tool}) {
    return startSeamWork(engine, id, 'strip', {miner, billet, grip, tool});
}

export function startHeadRecast(engine, {id, miner, billet, furnace}) {
    return startSeamWork(engine, id, 'recast', {miner, billet, furnace});
}

export function startBladeServiceLotForging(engine, {id, miner, billet, furnace, supply}) {
    const sourceKey = engine.world.holders[billet]?.properties[SMELTED_MATERIAL] ?? null;
    return startSeamWork(engine, id, 'forgeServiceLot', {miner, billet, furnace, supply}, {sourceKey});
}

export function startIronBlend(engine, {id, miner, billet, fresh, third, furnace}) {
    const holders = {miner, billet, fresh, furnace};
    return third === undefined ? startSeamWork(engine, id, 'blendIron', holders)
        : startSeamWork(engine, id, 'poolIron', {...holders, third});
}

function startSeamWork(engine, id, op, holders, options = {}, minutes = 3) {
    const {roles} = law.operations[op];
    const bindings = Object.fromEntries(Object.keys(roles).map(role => [role, role]));
    return startEngineWorking(engine, {id, law,
        method: {id: law.id, law: law.ref, revision: 1, roles,
            steps: [{op, minutes, bindings, options}]},
        bindings: Object.fromEntries(Object.entries(roles).map(([role, kind]) => [role, {kind, id: holders[role]}]))});
}
