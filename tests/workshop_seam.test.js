import assert from 'node:assert/strict';
import test from 'node:test';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {readMaterialLineage} from '../src/material_lineage.js';
import {bindGearWard, gearWardShared, settleGearHit, startWardAssemblyHandoff, startWardSocketWork, WARD_MOUNT_REMAINING, WARD_SOCKET, WARD_SOCKET_LAW,
    wearGearWard} from '../src/world_packs/gear_ward.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {beginContest, defineContestLaw, runContest} from '../src/contest.js';
import {bindStrikeEnchantment, startStrikeWeaponService, STRIKE_REPAIR_LAW, STRIKE_REPAIR_MATERIAL, STRIKE_REPAIR_STOCK,
    STRIKE_SERVICE_LINEAGE, strikeEnchantmentPorts, strikeEnchantmentShared, strikeWeaponWearPack, STRIKE_WEAR,
    wearStrikeWeapon} from '../src/world_packs/strike_enchantment.js';
import {BEDDING_KEY, BLOCKAGE_STOCK, BLOCKED_LINK, CARGO_WEIGHT, CRACKED_AT, DISASSEMBLY_SUPPLY, EXTRACTION_GRADE_LOSS, FITTED_BILLET, FRAGMENT_STOCK, GRIP_SCRAP,
    GRIP_STOCK, MORTAR_STOCK, PICK_INK, RECOVERED_IRON,
    SEAM_GRADE, SEAM_LOAD, SEAM_STOCK, SEAT_CONDITION, SEAT_SHIMS, SMELTED_MATERIAL, SMELTED_STOCK, SMELTING_FUEL, startBilletFitting, startFittedExtraction,
    startHeadAttunement, startHeadInscription, startHeadPatternRestore, startHeadRecast, startHeadTracing,
    startPassageBlockReplacement, startPassageMaintenance, startPassageRebedding, startPassageRepair, startPassageSupportSalvage,
    startPickHandoff, startPickInscription, startPickRecall, startRockPassageCrossing, startRouteClearing, startSeamExtraction, startSeamSmelting,
    startStoneDressing, startToolDisassembly, startToolProof, startToolSeatService, STONE_GRADE, STONE_KEY, STONE_STOCK,
    SUPPORT_BED, SUPPORT_CHIP_LOAD, SUPPORT_CONDITION,
    startBladeServiceLotForging, startIronBlend, startWardMountForging, startWardMountSalvage,
    WARD_MOUNT_MATERIAL, workshopSeamConfig} from '../src/world_packs/workshop_seam.js';

const config = {...workshopSeamConfig, packs: ['n.knowledge'],
    host: {...workshopSeamConfig.host, laws: [...workshopSeamConfig.host.laws, WARD_SOCKET_LAW]},
    shared: {
        quantities: [...new Set([...workshopSeamConfig.shared.quantities, ...gearWardShared.quantities, WORLD_QUANTITIES.vitality])],
        properties: [...workshopSeamConfig.shared.properties, ...gearWardShared.properties],
    }};
const place = 'mine', miner = 'maker', seam = 'ore', pick = 'pick';
const restore = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
const advance = (engine, at) => advanceEngineWorld(engine, at).engine;

function setup(grade, socket = 'square-socket', fuel = 1, ink = 2, hostConfig = config) {
    return createEngineWorld({...hostConfig, drawRoot: 'workshop-ore',
        links: [{id: 'passage', kind: 'rock-passage', from: place, to: 'store', cost: 2, state: 'closed'}], holders: [
        {id: place, kind: 'place'}, {id: miner, kind: 'body', place,
            quantities: {[PICK_INK]: ink, [DISASSEMBLY_SUPPLY]: 2, [MORTAR_STOCK]: 1}},
        {id: 'borrower', kind: 'body', place, quantities: {[DISASSEMBLY_SUPPLY]: 1, [PICK_INK]: 1}},
        {id: 'third-party', kind: 'body', place},
        {id: pick, kind: 'thing', as: ['workshop_pick'], place,
            properties: {'workshop.held_by': miner}},
        {id: seam, kind: 'thing', as: ['workshop_seam'], place, quantities: {[SEAM_STOCK]: 5},
            properties: grade == null ? {} : {[SEAM_GRADE]: grade}},
        {id: 'new-vein', kind: 'thing', as: ['workshop_seam'], place, quantities: {[SEAM_STOCK]: 5}},
        {id: 'store', kind: 'place'},
        {id: 'support', kind: 'thing', as: ['workshop_passage_support'], place,
            properties: {[BLOCKED_LINK]: 'passage', [SUPPORT_BED]: 'flat-bed'}},
        {id: 'freight', kind: 'thing', as: ['workshop_freight'], place,
            properties: {'workshop.held_by': miner, [CARGO_WEIGHT]: 11}},
        {id: 'rubble', kind: 'thing', as: ['workshop_blockage'], place, properties: {[BLOCKED_LINK]: 'passage'},
            quantities: {[BLOCKAGE_STOCK]: 4}},
        ...[['stones', 'stone_basket'], ['other-stones', 'stone_basket'], ['block', 'dressed_stone'], ['chips', 'stone_chips']].map(
            ([id, kind]) => ({id, kind: 'thing', as: [`workshop_${kind}`], place,
                quantities: {[STONE_STOCK]: 0}, properties: {'workshop.held_by': miner}})),
        {id: 'furnace', kind: 'thing', as: ['workshop_furnace'], place, quantities: {[SMELTING_FUEL]: fuel}},
        {id: 'grip', kind: 'thing', as: ['workshop_grip'], place, quantities: {[GRIP_STOCK]: 1},
            properties: {'workshop.held_by': miner, 'workshop.grip_socket': socket}},
        {id: 'replacement', kind: 'thing', as: ['workshop_grip'], place, quantities: {[GRIP_STOCK]: 1},
            properties: {'workshop.held_by': miner, 'workshop.grip_socket': 'square-socket'}},
        {id: 'tool', kind: 'thing', as: ['workshop_fitted_tool'], place, properties: {'workshop.held_by': miner}},
        {id: 'sheet', kind: 'thing', as: ['workshop_head_pattern'], place, properties: {'workshop.held_by': miner}},
        ...['billet', 'slag'].map(id => ({id, kind: 'thing', as: [`workshop_${id}`], place,
            quantities: {[SMELTED_STOCK]: 0}, properties: {'workshop.held_by': miner}})),
        ...['first', 'third'].map(id => ({id, kind: 'thing', as: ['fragment_lot'], place,
            quantities: {[FRAGMENT_STOCK]: 0}, properties: {'workshop.held_by': miner}})),
        {id: 'borrower-basket', kind: 'thing', as: ['fragment_lot'], place,
            quantities: {[FRAGMENT_STOCK]: 0}, properties: {'workshop.held_by': 'borrower'}},
        {id: 'borrower-head', kind: 'thing', as: ['workshop_billet'], place,
            quantities: {[SMELTED_STOCK]: 0}, properties: {'workshop.held_by': 'borrower'}},
        {id: 'borrower-grip', kind: 'thing', as: ['workshop_grip'], place,
            quantities: {[GRIP_STOCK]: 0}, properties: {'workshop.held_by': 'borrower'}},
    ]});
}

test('a paid pick inscription changes the ore available to smelt from the same finite seam', () => {
    const start = (engine, output) => startSeamExtraction(engine, {id: `cut-${output}`, miner, seam, pick, output});
    const count = (engine, output) => engine.world.holders[output].quantities[FRAGMENT_STOCK];
    const material = (engine, output) => JSON.parse(engine.world.holders[output].properties['workshop.fragment_material']);
    const base = setup();
    const mark = startPickInscription(base, {id: 'mark-pick', miner, pick});
    const marked = advance(restore(mark), 3);
    assert.equal(marked.world.holders[miner].quantities[PICK_INK], 1);
    const ordinary = advance(start(advance(base, 3), 'first'), 6);
    const pending = start(marked, 'first');
    const enhanced = advance(restore(advance(pending, 5)), 6);
    assert.deepEqual(serializeEngineWorld(enhanced), serializeEngineWorld(advance(pending, 6)));
    assert.deepEqual([count(ordinary, 'first'), count(enhanced, 'first')], [2, 4]);
    assert.deepEqual(material(ordinary, 'first'), material(enhanced, 'first'));
    assert.equal(material(enhanced, 'first').seam, seam);

    const smelt = engine => startSeamSmelting(engine, {id: 'smelt', miner, fragments: 'first', furnace: 'furnace', billet: 'billet', slag: 'slag'});
    const insufficient = advance(restore(smelt(ordinary)), 9);
    assert.equal(insufficient.records.workings.smelt.record.status, 'interrupted');
    assert.equal(insufficient.world.holders.furnace.quantities[SMELTING_FUEL], 1);
    assert.equal(count(insufficient, 'first'), 2);
    const smelting = smelt(enhanced);
    const moved = applyEngineOps(advance(smelting, 7), [{op: 'move', holder: 'first', to: 'store'}], 'fixture:move-ore');
    const interrupted = advance(restore(moved), 9);
    assert.equal(interrupted.records.workings.smelt.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.furnace.quantities[SMELTING_FUEL], 1);
    assert.equal(count(interrupted, 'first'), 4);

    const smelted = advance(restore(advance(smelting, 7)), 9);
    assert.deepEqual(serializeEngineWorld(smelted), serializeEngineWorld(advance(smelting, 9)));
    assert.equal(count(smelted, 'first'), 0);
    assert.equal(smelted.world.holders.first.properties['workshop.fragment_material'], undefined);
    assert.equal(smelted.world.holders.furnace.quantities[SMELTING_FUEL], 0);
    assert.deepEqual(smelted.records.workings.smelt.record.receipts[0].observed.balance,
        {unit: 'ore unit', input: 4, output: 4, loss: 0});
    for (const id of ['billet', 'slag']) {
        const part = smelted.world.holders[id];
        assert.equal(part.quantities[SMELTED_STOCK], 1);
        const [input] = readMaterialLineage(part.properties[SMELTED_MATERIAL]).history[0].inputs;
        assert.deepEqual(JSON.parse(input.item_key), {id: 'Workshop ore fragments', quality: 50, lot: 'first',
            material: material(enhanced, 'first').material.id, seam});
        assert.equal(input.count, 4);
    }

    const competing = startSeamExtraction(smelted, {id: 'cut-again', miner, seam, pick, output: 'first'});
    const depleted = advance(restore(start(competing, 'third')), 12);
    assert.deepEqual([count(depleted, 'first'), count(depleted, 'third')], [1, 0]);
    assert.equal(depleted.world.holders[seam].quantities[SEAM_STOCK], 0);
    assert.equal(depleted.records.workings['cut-third'].record.status, 'interrupted');
});

test('an inscribed head opens a real route sooner and its crossing settles from the live link', () => {
    const args = {miner, tool: 'tool', route: 'passage'};
    const clear = (engine, id) => startRouteClearing(engine, {id, blockage: 'rubble', ...args});
    const cross = (engine, id) => startRockPassageCrossing(engine, {id, ...args});
    const base = smelt(72);
    const plain = advance(fit(advance(base, 12)), 15);
    const marked = advance(startHeadInscription(base, {id: 'mark-head', miner, billet: 'billet'}), 12);
    const inscribed = advance(fit(marked), 15);
    const ordinary = advance(clear(plain, 'clear'), 18);
    assert.equal(ordinary.world.holders.rubble.quantities[BLOCKAGE_STOCK], 2);
    assert.throws(() => cross(ordinary, 'cross'), /open rock passage/);
    assert.equal(advance(clear(ordinary, 'clear-again'), 21).world.links[0].state, 'open');
    const clearing = clear(inscribed, 'clear');
    const opened = advance(restore(advance(clearing, 16)), 18);
    assert.deepEqual(serializeEngineWorld(opened), serializeEngineWorld(advance(clearing, 18)));
    assert.equal(opened.world.holders.rubble.quantities[BLOCKAGE_STOCK], 0);
    const crossing = cross(opened, 'cross');
    const midway = advance(crossing, 19);
    const closed = applyEngineOps(midway, [{op: 'link_set', id: 'passage', state: 'closed'}], 'fixture:close-passage');
    const interrupted = advance(restore(closed), 20);
    assert.equal(interrupted.records.workings.cross.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.maker.place, place);
    assert.equal(interrupted.world.holders.tool.place, place);
    const arrived = advance(restore(midway), 20);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(crossing, 20)));
    assert.equal(arrived.world.holders.maker.place, 'store');
    assert.equal(arrived.world.holders.tool.place, 'store');
});

test('cleared rubble becomes a conserved batch of dressed stone and chips', () => {
    const base = smelt(72);
    const marked = advance(startHeadInscription(base, {id: 'mark-head', miner, billet: 'billet'}), 12);
    const fitted = advance(fit(marked), 15);
    const recover = (engine, id, basket) => startRouteClearing(engine,
        {id, miner, tool: 'tool', route: 'passage', blockage: 'rubble', basket});
    const dressing = engine => startStoneDressing(engine, {id: 'dress', miner, basket: 'stones', block: 'block', chips: 'chips'});
    const plain = advance(fit(advance(base, 12)), 15);
    const partial = advance(recover(plain, 'recover', 'stones'), 18);
    const shortBatch = advance(restore(dressing(partial)), 21);
    assert.equal(shortBatch.records.workings.dress.record.status, 'interrupted');
    assert.equal(shortBatch.world.holders.stones.quantities[STONE_STOCK], 2);
    assert.equal(shortBatch.world.holders.block.quantities[STONE_STOCK], 0);

    const pending = recover(fitted, 'recover', 'stones');
    const moved = applyEngineOps(advance(pending, 16), [{op: 'move', holder: 'stones', to: 'store'}], 'fixture:move-basket');
    const interrupted = advance(restore(moved), 18);
    assert.equal(interrupted.world.holders.rubble.quantities[BLOCKAGE_STOCK], 4);
    assert.equal(interrupted.world.links[0].state, 'closed');
    assert.equal(interrupted.records.workings.recover.record.status, 'interrupted');

    const queued = recover(pending, 'recover-second', 'other-stones');
    const recovered = advance(restore(advance(queued, 16)), 18);
    assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(queued, 18)));
    assert.equal(recovered.world.links[0].state, 'open');
    assert.equal(recovered.world.holders.rubble.quantities[BLOCKAGE_STOCK], 0);
    assert.equal(recovered.world.holders.stones.quantities[STONE_STOCK], 4);
    assert.equal(recovered.world.holders['other-stones'].quantities[STONE_STOCK], 0);
    assert.equal(recovered.records.workings['recover-second'].record.status, 'interrupted');
    const recoveredKey = recovered.world.holders.stones.properties[STONE_KEY];
    assert.deepEqual(JSON.parse(readMaterialLineage(recoveredKey).history[0].inputs[0].item_key),
        {id: 'Passage rubble', blockage: 'rubble', route: 'passage'});

    const job = dressing(recovered);
    const dressed = advance(restore(advance(job, 19)), 21);
    assert.deepEqual(serializeEngineWorld(dressed), serializeEngineWorld(advance(job, 21)));
    assert.equal(dressed.world.holders.stones.quantities[STONE_STOCK], 0);
    assert.equal(dressed.world.holders.stones.properties[STONE_KEY], undefined);
    assert.deepEqual(dressed.records.workings.dress.record.receipts[0].observed.balance,
        {unit: 'stone unit', input: 4, output: 4, loss: 0});
    for (const [id, family] of [['block', 'stone-block'], ['chips', 'stone-chips']]) {
        const part = dressed.world.holders[id];
        const lineage = readMaterialLineage(part.properties[STONE_KEY]);
        assert.equal(part.quantities[STONE_STOCK], 1);
        assert.equal(lineage.family, family);
        assert.deepEqual(lineage.history[0].inputs.map(({item_key, count}) => [item_key, count]), [[recoveredKey, 4]]);
    }

    const travel = (engine, id) => startRockPassageCrossing(engine, {id, miner, route: 'passage', tool: 'tool', cargo: 'freight'});
    const before = advance(restore(travel(advance(dressed, 24), 'loaded')), 26);
    assert.equal(before.records.workings.loaded.record.status, 'interrupted');
    assert.equal(before.world.holders.maker.place, place);
    const repair = engine => startPassageRepair(engine, {id: 'repair', miner, route: 'passage',
        support: 'support', block: 'block', chips: 'chips'});
    const wrongBed = applyEngineOps(dressed, [{op: 'property', holder: 'support', property: SUPPORT_BED, value: 'round-bed'}],
        'fixture:round-bed');
    const refused = advance(restore(repair(wrongBed)), 24);
    assert.equal(refused.records.workings.repair.record.status, 'interrupted');
    assert.equal(refused.world.holders.block.quantities[STONE_STOCK], 1);
    assert.equal(refused.world.holders.chips.quantities[STONE_STOCK], 1);

    const repairing = repair(dressed);
    const repaired = advance(restore(advance(repairing, 22)), 24);
    assert.deepEqual(serializeEngineWorld(repaired), serializeEngineWorld(advance(repairing, 24)));
    assert.equal(repaired.world.holders.block.quantities[STONE_STOCK], 0);
    assert.equal(repaired.world.holders.chips.quantities[STONE_STOCK], 0);
    assert.equal(repaired.world.holders.support.properties[STONE_KEY], dressed.world.holders.block.properties[STONE_KEY]);
    assert.equal(repaired.world.holders.support.properties[BEDDING_KEY], dressed.world.holders.chips.properties[STONE_KEY]);
    const underway = advance(travel(repaired, 'loaded'), 25);
    const crossed = advance(restore(underway), 26);
    assert.deepEqual(crossed.records.workings.loaded.record.receipts[0].observed, {load: 12, limit: 16});
    assert.equal(crossed.world.holders.maker.place, 'store');
    assert.equal(crossed.world.holders.tool.place, 'store');
    assert.equal(crossed.world.holders.freight.place, 'store');
    const heavier = applyEngineOps(underway, [{op: 'property', holder: 'freight', property: CARGO_WEIGHT, value: 16}],
        'fixture:load-freight');
    const tooHeavy = advance(restore(heavier), 26);
    assert.equal(tooHeavy.records.workings.loaded.record.status, 'interrupted');
    assert.equal(tooHeavy.world.holders.maker.place, place);
    assert.equal(tooHeavy.world.holders.support.properties[SUPPORT_CONDITION], 100);

    assert.equal(crossed.world.holders.support.properties[SUPPORT_CONDITION], 85);
    const returned = advance(restore(travel(crossed, 'return')), 28);
    assert.equal(returned.world.holders.support.properties[SUPPORT_CONDITION], 67);
    const heavierFreight = applyEngineOps(returned, [{op: 'property', holder: 'freight', property: CARGO_WEIGHT, value: 12}],
        'fixture:increase-freight');
    const blockedByWear = advance(restore(travel(heavierFreight, 'worn')), 30);
    assert.equal(blockedByWear.records.workings.worn.record.status, 'interrupted');
    assert.equal(blockedByWear.world.holders.support.properties[SUPPORT_CONDITION], 67);
    const maintain = (engine, id) => startPassageMaintenance(engine, {id, miner, route: 'passage', support: 'support'});
    const maintenance = maintain(blockedByWear, 'maintain');
    const maintained = advance(restore(advance(maintenance, 31)), 33);
    assert.deepEqual(serializeEngineWorld(maintained), serializeEngineWorld(advance(maintenance, 33)));
    assert.equal(maintained.world.holders.support.properties[SUPPORT_CONDITION], 97);
    assert.equal(maintained.world.holders.maker.quantities[MORTAR_STOCK], 0);
    assert.equal(maintained.world.holders.support.properties[STONE_KEY], repaired.world.holders.support.properties[STONE_KEY]);
    const noMortar = advance(restore(maintain(maintained, 'again')), 36);
    assert.equal(noMortar.records.workings.again.record.status, 'interrupted');
    const through = advance(restore(travel(maintained, 'maintained')), 35);
    assert.deepEqual(through.records.workings.maintained.record.receipts[0].observed, {load: 13, limit: 15});
    assert.equal(through.world.holders.freight.place, 'store');
});

test('stone grade survives dressing and the weaker installed part limits freight', () => {
    const mark = startHeadInscription(smelt(72), {id: 'mark-head', miner, billet: 'billet'});
    const fitted = advance(fit(advance(mark, 12)), 15);
    const dress = quality => {
        const vein = applyEngineOps(fitted, [{op: 'property', holder: 'rubble', property: STONE_GRADE, value: quality}],
            'fixture:graded-rubble');
        const cutting = startRouteClearing(vein,
            {id: 'recover-stone', miner, tool: 'tool', route: 'passage', blockage: 'rubble', basket: 'stones'});
        const recovered = advance(restore(cutting), 18);
        const dressing = startStoneDressing(recovered, {id: 'dress-stone', miner, basket: 'stones', block: 'block', chips: 'chips'});
        const dressed = advance(restore(advance(dressing, 19)), 21);
        for (const id of ['block', 'chips']) {
            const lineage = readMaterialLineage(dressed.world.holders[id].properties[STONE_KEY]);
            assert.equal(lineage.facts.quality, quality);
            assert.equal(lineage.history[0].inputs[0].facts.quality, quality);
        }
        return dressed;
    };
    const weak = dress(20), strong = dress(80);
    const mixed = applyEngineOps(strong, [{op: 'property', holder: 'chips', property: STONE_KEY,
        value: weak.world.holders.chips.properties[STONE_KEY]}], 'fixture:weaker-bedding');
    const cross = (engine, limit, status) => {
        const bedding = startPassageRepair(engine, {id: 'bed-support', miner, route: 'passage', support: 'support', block: 'block', chips: 'chips'});
        const repaired = advance(restore(bedding), 24);
        const crossing = startRockPassageCrossing(repaired, {id: 'cross-loaded', miner, route: 'passage', tool: 'tool', cargo: 'freight'});
        const settled = advance(restore(advance(crossing, 25)), 26);
        assert.deepEqual(serializeEngineWorld(settled), serializeEngineWorld(advance(crossing, 26)));
        const result = settled.records.workings['cross-loaded'].record;
        assert.deepEqual(result.receipts[0].observed, {load: 12, limit});
        assert.equal(result.status, status);
        assert.equal(settled.world.holders.freight.place, status === 'complete' ? 'store' : place);
    };
    cross(weak, 10, 'interrupted');
    cross(mixed, 10, 'interrupted');
    cross(strong, 20, 'complete');
});

test('worn passage stone is recovered once and replacement restores freight travel after restore', () => {
    const marked = advance(startHeadInscription(smelt(72), {id: 'mark-head', miner, billet: 'billet'}), 12);
    const fitted = advance(fit(marked), 15);
    const repair = (engine, id, block, chips) => startPassageRepair(engine,
        {id, miner, route: 'passage', support: 'support', block, chips});
    const recover = (engine, id, route, blockage, basket) => startRouteClearing(engine,
        {id, miner, tool: 'tool', route, blockage, basket});
    const dress = (engine, id, basket, block, chips) => startStoneDressing(engine,
        {id, miner, basket, block, chips});
    const first = advance(recover(fitted, 'clear', 'passage', 'rubble', 'stones'), 18);
    const installed = advance(repair(advance(dress(first, 'dress', 'stones', 'block', 'chips'), 21),
        'install', 'block', 'chips'), 24);
    const old = installed.world.holders.support.properties;
    const withQuarry = applyEngineOps(installed, [
        {op: 'link_add', link: {id: 'quarry-link', kind: 'rock-passage', from: place, to: 'quarry', cost: 2, state: 'closed'}},
        {op: 'holder_add', value: {id: 'quarry', kind: 'place'}},
        {op: 'holder_add', value: {id: 'quarry-stone', kind: 'thing', as: ['workshop_blockage'], place,
            properties: {[BLOCKED_LINK]: 'quarry-link', [STONE_GRADE]: 80}, quantities: {[BLOCKAGE_STOCK]: 4}}},
    ], 'fixture:fresh-stone-source');
    const worn = applyEngineOps(withQuarry, [
        {op: 'property', holder: 'support', property: SUPPORT_CONDITION, value: 0},
    ], 'fixture:spent-seat');
    const strip = (engine, id) => startPassageSupportSalvage(engine,
        {id, miner, route: 'passage', support: 'support', basket: 'other-stones'});
    const brittle = applyEngineOps(withQuarry, [{op: 'property', holder: 'support', property: SUPPORT_CHIP_LOAD, value: 12}],
        'fixture:brittle-seat');
    const travel = (engine, id = 'freight-crossing') => startRockPassageCrossing(engine,
        {id, miner, route: 'passage', tool: 'tool', cargo: 'freight'});
    const loaded = travel(brittle, 'chip-seat');
    const chipped = advance(restore(advance(loaded, 25)), 26);
    assert.deepEqual(serializeEngineWorld(chipped), serializeEngineWorld(advance(loaded, 26)));
    assert.deepEqual(chipped.records.workings['chip-seat'].record.receipts[0].observed, {load: 12, limit: 16, stoneLost: 1});
    const tooHeavy = advance(restore(travel(chipped, 'chipped-return')), 28);
    assert.deepEqual(tooHeavy.records.workings['chipped-return'].record.receipts[0].observed, {load: 12, limit: 11});
    assert.equal(tooHeavy.world.holders.freight.place, 'store');
    const returnedOnFoot = advance(startRockPassageCrossing(tooHeavy,
        {id: 'walk-return', miner, route: 'passage', tool: 'tool'}), 30);
    const mortared = advance(startPassageMaintenance(returnedOnFoot,
        {id: 'mortar-chipped', miner, route: 'passage', support: 'support'}), 33);
    assert.equal(mortared.world.holders.support.properties[SUPPORT_CONDITION], 100);
    const heavierBlockRun = applyEngineOps(mortared, [
        {op: 'property', holder: 'freight', property: CARGO_WEIGHT, value: 12},
    ], 'fixture:heavier-freight-for-block-swap');
    const blockStock = advance(restore(recover(heavierBlockRun, 'quarry-block', 'quarry-link', 'quarry-stone', 'stones')), 36);
    const blockReady = advance(restore(dress(blockStock, 'dress-block', 'stones', 'block', 'chips')), 39);
    const replace = (engine, id) => startPassageBlockReplacement(engine,
        {id, miner, route: 'passage', support: 'support', block: 'block', basket: 'other-stones'});
    const replacing = replace(replace(blockReady, 'replace-block'), 'replace-block-again');
    const wrongFit = applyEngineOps(replacing, [{op: 'property', holder: 'support', property: SUPPORT_BED, value: 'round-bed'}],
        'fixture:mismatched-replacement-bed');
    const fitRefused = advance(restore(wrongFit), 42);
    assert.equal(fitRefused.records.workings['replace-block'].record.status, 'interrupted');
    assert.equal(fitRefused.world.holders.block.quantities[STONE_STOCK], 1);
    assert.equal(fitRefused.world.holders[miner].quantities[DISASSEMBLY_SUPPLY], 2);
    const replacedBlock = advance(restore(advance(replacing, 40)), 42);
    assert.deepEqual(serializeEngineWorld(replacedBlock), serializeEngineWorld(advance(replacing, 42)));
    assert.equal(replacedBlock.records.workings['replace-block-again'].record.status, 'interrupted');
    assert.equal(replacedBlock.world.holders[miner].quantities[DISASSEMBLY_SUPPLY], 1);
    assert.deepEqual(replacedBlock.records.workings['replace-block'].record.receipts[0].observed.balance,
        {unit: 'stone unit', input: 3, output: 2, loss: 1});
    const recoveredBlock = replacedBlock.world.holders['other-stones'];
    assert.equal(recoveredBlock.quantities[STONE_STOCK], 2);
    const blockParent = readMaterialLineage(recoveredBlock.properties[STONE_KEY]).history[0].inputs;
    assert.deepEqual(blockParent.map(row => row.item_key), [old[STONE_KEY]]);
    assert.equal(replacedBlock.world.holders.support.properties[BEDDING_KEY], old[BEDDING_KEY]);
    assert.equal(replacedBlock.world.holders.chips.quantities[STONE_STOCK], 1);
    const getFreight = (engine, id) => {
        const atFreight = advance(startRockPassageCrossing(engine,
            {id: 'walk-to-stranded', miner, route: 'passage', tool: 'tool'}), 44);
        return advance(restore(travel(atFreight, id)), 46);
    };
    const stillChipped = getFreight(advance(blockReady, 42), 'before-block-swap');
    assert.equal(stillChipped.records.workings['before-block-swap'].record.status, 'interrupted');
    const freed = getFreight(replacedBlock, 'after-block-swap');
    assert.deepEqual(freed.records.workings['after-block-swap'].record.receipts[0].observed, {load: 13, limit: 16, stoneLost: 1});
    assert.equal(freed.world.holders.freight.place, place);
    const partial = advance(restore(strip(mortared, 'strip-chipped')), 36);
    assert.deepEqual(partial.records.workings['strip-chipped'].record.receipts[0].observed.balance,
        {unit: 'stone unit', input: 4, output: 3, loss: 1});
    assert.equal(partial.world.holders['other-stones'].quantities[STONE_STOCK], 3);
    const short = advance(restore(dress(partial, 'redress-chipped', 'other-stones', 'block', 'chips')), 39);
    assert.equal(short.records.workings['redress-chipped'].record.status, 'interrupted');
    assert.equal(short.world.holders['other-stones'].quantities[STONE_STOCK], 3);
    const toppedStock = advance(restore(recover(short, 'top-up-stone', 'quarry-link', 'quarry-stone', 'stones')), 42);
    const blend = startStoneDressing(toppedStock, {id: 'dress-blend', miner, basket: 'other-stones',
        supplement: 'stones', firstUnits: 3, block: 'block', chips: 'chips'});
    const missing = applyEngineOps(blend, [{op: 'move', holder: 'stones', to: 'store'}], 'fixture:move-stone-supplement');
    const refused = advance(restore(missing), 45);
    assert.equal(refused.records.workings['dress-blend'].record.status, 'interrupted');
    assert.equal(refused.world.holders['other-stones'].quantities[STONE_STOCK], 3);
    assert.equal(refused.world.holders.stones.quantities[STONE_STOCK], 4);
    const blended = advance(restore(advance(blend, 43)), 45);
    assert.deepEqual(serializeEngineWorld(blended), serializeEngineWorld(advance(blend, 45)));
    assert.equal(blended.world.holders.stones.quantities[STONE_STOCK], 3);
    assert.equal(blended.world.holders.stones.properties[STONE_KEY], toppedStock.world.holders.stones.properties[STONE_KEY]);
    assert.equal(blended.world.holders['other-stones'].quantities[STONE_STOCK], 0);
    for (const part of ['block', 'chips']) {
        const lineage = readMaterialLineage(blended.world.holders[part].properties[STONE_KEY]);
        assert.equal(lineage.facts.quality, 57);
        assert.deepEqual(lineage.history[0].inputs.map(input => input.count).sort(), [1, 3]);
    }
    const refittedBlend = advance(restore(repair(blended, 'install-blend', 'block', 'chips')), 48);
    const backAcross = advance(startRockPassageCrossing(refittedBlend,
        {id: 'walk-to-freight', miner, route: 'passage', tool: 'tool'}), 50);
    const freightRestored = advance(restore(travel(backAcross, 'fetch-freight')), 52);
    assert.deepEqual(freightRestored.records.workings['fetch-freight'].record.receipts[0].observed, {load: 12, limit: 17, stoneLost: 1});
    assert.equal(freightRestored.world.holders.freight.place, place);
    const separate = startStoneDressing(toppedStock, {id: 'dress-separate', miner, basket: 'other-stones',
        supplement: 'stones', firstUnits: 3, beddingFrom: 'basket', block: 'block', chips: 'chips'});
    const separated = advance(restore(advance(separate, 43)), 45);
    assert.deepEqual(serializeEngineWorld(separated), serializeEngineWorld(advance(separate, 45)));
    const block = readMaterialLineage(separated.world.holders.block.properties[STONE_KEY]);
    const chips = readMaterialLineage(separated.world.holders.chips.properties[STONE_KEY]);
    assert.equal(block.facts.quality, 60);
    assert.equal(chips.facts.quality, 50);
    assert.deepEqual(block.history[0].inputs.map(input => [input.facts.quality, input.count]), [[50, 2], [80, 1]]);
    assert.deepEqual(chips.history[0].inputs.map(input => [input.facts.quality, input.count]), [[50, 1]]);
    assert.equal(separated.world.holders.stones.quantities[STONE_STOCK], 3);
    const separatedSupport = advance(restore(repair(separated, 'install-separate', 'block', 'chips')), 48);
    const separatedReturn = advance(startRockPassageCrossing(separatedSupport,
        {id: 'walk-to-freight', miner, route: 'passage', tool: 'tool'}), 50);
    const separatedFreight = advance(restore(travel(separatedReturn, 'fetch-freight')), 52);
    assert.deepEqual(separatedFreight.records.workings['fetch-freight'].record.receipts[0].observed,
        {load: 12, limit: 16, stoneLost: 1});
    const freshBedding = advance(restore(startStoneDressing(toppedStock, {id: 'dress-fresh-bedding', miner,
        basket: 'other-stones', supplement: 'stones', beddingFrom: 'supplement', block: 'block', chips: 'chips'})), 45);
    assert.deepEqual(['block', 'chips'].map(part =>
        readMaterialLineage(freshBedding.world.holders[part].properties[STONE_KEY]).facts.quality), [50, 80]);

    const rebedReady = applyEngineOps(separatedSupport, [
        {op: 'holder_add', value: {id: 'new-chips', kind: 'thing', as: ['workshop_stone_chips'], place,
            quantities: {[STONE_STOCK]: 1}, properties: {'workshop.held_by': miner,
                [STONE_KEY]: freshBedding.world.holders.chips.properties[STONE_KEY]}}},
        {op: 'property', holder: 'freight', property: CARGO_WEIGHT, value: 17},
        {op: 'property', holder: 'support', property: SUPPORT_CHIP_LOAD, value: null},
        {op: 'add', holder: miner, quantity: MORTAR_STOCK, amount: 1},
    ], 'fixture:replacement-bedding-and-freight');
    const rebed = (engine, id) => startPassageRebedding(engine, {id, miner, route: 'passage', support: 'support',
        chips: 'new-chips', removed: 'chips'});
    const pendingBedding = rebed(rebed(rebedReady, 'rebed'), 'rebed-again');
    const lostRest = applyEngineOps(pendingBedding, [{op: 'move', holder: 'chips', to: 'store'}], 'fixture:move-chip-rest');
    const stoppedRebed = advance(restore(lostRest), 51);
    assert.equal(stoppedRebed.records.workings.rebed.record.status, 'interrupted');
    assert.equal(stoppedRebed.world.holders['new-chips'].quantities[STONE_STOCK], 1);
    assert.equal(stoppedRebed.world.holders[miner].quantities[MORTAR_STOCK], 1);
    const rebedded = advance(restore(advance(pendingBedding, 49)), 51);
    assert.deepEqual(serializeEngineWorld(rebedded), serializeEngineWorld(advance(pendingBedding, 51)));
    assert.equal(rebedded.records.workings.rebed.record.status, 'complete');
    assert.equal(rebedded.records.workings['rebed-again'].record.status, 'interrupted');
    assert.equal(rebedded.world.holders[miner].quantities[MORTAR_STOCK], 0);
    assert.equal(rebedded.world.holders.support.properties[STONE_KEY], separatedSupport.world.holders.support.properties[STONE_KEY]);
    assert.equal(rebedded.world.holders.chips.properties[STONE_KEY], separatedSupport.world.holders.support.properties[BEDDING_KEY]);
    assert.equal(rebedded.world.holders.chips.quantities[STONE_STOCK], 1);
    assert.equal(rebedded.world.holders['new-chips'].quantities[STONE_STOCK], 0);
    const fetch = engine => {
        const atFreight = advance(startRockPassageCrossing(engine, {id: 'walk-to-heavy', miner, route: 'passage', tool: 'tool'}), 53);
        return advance(restore(travel(atFreight, 'fetch-heavy')), 55);
    };
    const beforeRebed = fetch(advance(rebedReady, 51));
    assert.equal(beforeRebed.records.workings['fetch-heavy'].record.status, 'interrupted');
    const afterRebed = fetch(rebedded);
    assert.deepEqual(afterRebed.records.workings['fetch-heavy'].record.receipts[0].observed, {load: 18, limit: 18});
    assert.equal(afterRebed.world.holders.freight.place, place);

    const pending = strip(worn, 'strip');
    const moved = applyEngineOps(pending, [{op: 'move', holder: 'other-stones', to: 'store'}], 'fixture:move-salvage-basket');
    const stopped = advance(restore(moved), 27);
    assert.equal(stopped.records.workings.strip.record.status, 'interrupted');
    assert.equal(stopped.world.holders.support.properties[STONE_KEY], old[STONE_KEY]);
    assert.equal(stopped.world.holders[miner].quantities[DISASSEMBLY_SUPPLY], 2);
    const competing = strip(pending, 'strip-again');
    const stripped = advance(restore(advance(competing, 25)), 27);
    assert.deepEqual(serializeEngineWorld(stripped), serializeEngineWorld(advance(competing, 27)));
    assert.equal(stripped.records.workings['strip-again'].record.status, 'interrupted');
    assert.equal(stripped.world.holders[miner].quantities[DISASSEMBLY_SUPPLY], 1);
    assert.equal(stripped.world.holders.support.properties[STONE_KEY], undefined);
    const basket = stripped.world.holders['other-stones'];
    assert.equal(basket.quantities[STONE_STOCK], 4);
    assert.deepEqual(readMaterialLineage(basket.properties[STONE_KEY]).history[0].inputs.map(input => input.item_key).sort(),
        [old[STONE_KEY], old[BEDDING_KEY]].sort());
    assert.equal(advance(restore(travel(stripped)), 29).records.workings['freight-crossing'].record.status, 'interrupted');
    const redressed = advance(restore(dress(stripped, 'redress', 'other-stones', 'block', 'chips')), 30);
    assert.equal(readMaterialLineage(redressed.world.holders.block.properties[STONE_KEY]).facts.quality, 50);
    const reused = advance(restore(repair(redressed, 'reuse', 'block', 'chips')), 33);
    const reusedCrossing = advance(restore(travel(reused)), 35);
    assert.deepEqual(reusedCrossing.records.workings['freight-crossing'].record.receipts[0].observed, {load: 12, limit: 16});
    assert.equal(reusedCrossing.world.holders.freight.place, 'store');

    const quarried = advance(recover(stripped, 'quarry', 'quarry-link', 'quarry-stone', 'stones'), 30);
    const fresh = advance(dress(quarried, 'dress-fresh', 'stones', 'block', 'chips'), 33);
    const replaced = advance(restore(repair(fresh, 'replace', 'block', 'chips')), 36);
    const crossed = advance(restore(travel(replaced)), 38);
    assert.deepEqual(crossed.records.workings['freight-crossing'].record.receipts[0].observed, {load: 12, limit: 20});
    assert.equal(crossed.world.holders.freight.place, 'store');
});

function smelt(grade, socket, fuel, ink, hostConfig) {
    const marked = advance(startPickInscription(setup(grade, socket, fuel, ink, hostConfig), {id: 'mark', miner, pick}), 3);
    const gathered = advance(startSeamExtraction(marked, {id: 'extract', miner, pick, seam, output: 'first'}), 6);
    return advance(startSeamSmelting(gathered, {id: 'smelt', miner, fragments: 'first',
        furnace: 'furnace', billet: 'billet', slag: 'slag'}), 9);
}

const assembly = {miner, billet: 'billet', grip: 'grip', tool: 'tool'};
const fit = (engine, id = 'fit') => startBilletFitting(engine, {id, ...assembly});

test('recovered iron becomes a graded service supply that affects the next enchanted blow', () => {
    const serviceConfig = {...config, packs: [...config.packs, 'c.contest', strikeWeaponWearPack.id], ownPacks: [strikeWeaponWearPack],
        shared: {...config.shared, properties: [...config.shared.properties, ...strikeEnchantmentShared.properties]},
        host: {...config.host, laws: [...config.host.laws, STRIKE_REPAIR_LAW],
            ports: {...config.host.ports, stored: strikeEnchantmentPorts}}};
    const reload = engine => restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), serviceConfig);
    const supply = 'service-lot', weapon = 'blade', foe = 'borrower', inscription = 'blade-mark';
    const bout = defineContestLaw({id: 'workshop.service_bout', revision: 1, moves: {
        strike: {resolver: 'strike', steps: [3], power: 20},
    }});
    for (const [grade, restored, extra] of [[32, 9, 0], [72, 19, 5]]) {
        const smelted = smelt(grade, 'square-socket', 2, 2, serviceConfig);
        const fitted = advance(fit(smelted), 12);
        const cracked = advance(startToolProof(fitted, {id: 'crack-source', miner, tool: 'tool', load: 30}), 15);
        const stripped = advance(startToolDisassembly(cracked, {id: 'strip-source', ...assembly}), 18);
        const scrapKey = stripped.world.holders.billet.properties[SMELTED_MATERIAL];
        const ready = applyEngineOps(stripped, [
            ...[miner, foe].map(holder => ({op: 'carry', holder, quantity: 'vitality', amount: 100})),
            {op: 'holder_add', value: {id: supply, kind: 'thing', as: ['workshop_blade_service_lot'], place,
                properties: {'workshop.held_by': miner}, quantities: {[STRIKE_REPAIR_STOCK]: 0}}},
            {op: 'holder_add', value: {id: weapon, kind: 'thing', as: ['weapon'], place, quantities: {condition: 8},
                properties: {'workshop.held_by': miner, [STRIKE_REPAIR_MATERIAL]: 'iron', [STRIKE_WEAR]: 20}}},
        ], 'fixture:service-from-recovered-iron');
        const forging = startBladeServiceLotForging(ready, {id: 'forge-service', miner, billet: 'billet', furnace: 'furnace', supply});
        const moved = applyEngineOps(forging, [{op: 'move', holder: supply, to: 'store'}], 'fixture:move-service-rest');
        const refused = advance(reload(moved), 21);
        assert.equal(refused.records.workings['forge-service'].record.status, 'interrupted');
        assert.equal(refused.world.holders.billet.quantities[RECOVERED_IRON], 3);
        assert.equal(refused.world.holders.furnace.quantities[SMELTING_FUEL], 1);
        const forged = advance(reload(advance(forging, 19)), 21);
        assert.deepEqual(serializeEngineWorld(forged), serializeEngineWorld(advance(forging, 21)));
        assert.equal(forged.world.holders.billet.quantities[RECOVERED_IRON], 2);
        const lot = forged.world.holders[supply].properties[STRIKE_SERVICE_LINEAGE];
        assert.equal(readMaterialLineage(lot).history[0].inputs[0].item_key, scrapKey);
        const marked = bindStrikeEnchantment(forged, {id: inscription, weapon, bearer: miner, charge: 1, power: 5});
        const job = startStrikeWeaponService(marked, {id: 'service-blade', weapon, bearer: miner, supply});
        if (grade === 32) {
            const secondBlade = 'second-blade';
            const prepared = applyEngineOps(marked, [
                {op: 'holder_add', value: {id: secondBlade, kind: 'thing', as: ['weapon'], place, quantities: {condition: 8},
                    properties: {'workshop.held_by': miner, [STRIKE_REPAIR_MATERIAL]: 'iron'}}},
                {op: 'add', holder: 'furnace', quantity: SMELTING_FUEL, amount: 1},
            ], 'fixture:reuse-service-rest');
            const consuming = startStrikeWeaponService(prepared, {id: 'a-use-first-lot', weapon: secondBlade, bearer: miner, supply});
            const nextForge = startBladeServiceLotForging(consuming,
                {id: 'b-forge-second-lot', miner, billet: 'billet', furnace: 'furnace', supply});
            const competing = startStrikeWeaponService(nextForge, {id: 'c-use-first-lot', weapon, bearer: miner, supply});
            const stopped = advance(reload(advance(competing, 22)), 24);
            const nextLot = stopped.world.holders[supply].properties[STRIKE_SERVICE_LINEAGE];
            assert.equal(stopped.records.workings['a-use-first-lot'].record.status, 'complete');
            assert.equal(stopped.records.workings['b-forge-second-lot'].record.status, 'complete');
            assert.notEqual(nextLot, lot);
            assert.equal(stopped.records.workings['c-use-first-lot'].record.status, 'interrupted');
            assert.equal(stopped.world.holders[weapon].quantities.condition, 8);
            assert.equal(stopped.world.holders[supply].quantities[STRIKE_REPAIR_STOCK], 1);
        }
        const serviced = advance(reload(job), 24);
        assert.equal(serviced.world.holders[weapon].quantities.condition, 8 + restored);
        assert.equal(serviced.world.holders[supply].properties[STRIKE_SERVICE_LINEAGE], undefined);
        assert.equal(serviced.records.workings['service-blade'].record.receipts[0].observed.lineage, lot);
        const worn = wearStrikeWeapon(serviced, {weapon, bearer: miner});
        const record = beginContest(bout, {id: 'blade-proof', seed: 7, place, limits: {landed: 1}, entrants: [
            {id: miner, body: miner, side: 'maker', profile: {attack: 100}, moves: ['strike']},
            {id: foe, body: foe, side: 'borrower', profile: {evasion: 1}, moves: ['wait']},
        ]}, worn.world);
        const hit = {...worn, world: runContest(bout, record, worn.rules, worn.world).world};
        const settled = advance(reload(hit), 25);
        assert.equal(hit.world.holders[foe].quantities.vitality - settled.world.holders[foe].quantities.vitality, extra);
    }
});

test('preserving fragile ore makes a stronger ward mount, and its salvaged iron can carry the same insert again', () => {
    const mount = 'mount', insert = 'insert', id = 'fire-ward';
    const fragile = applyEngineOps(setup(72, 'square-socket', 4, 3), [
        {op: 'property', holder: seam, property: EXTRACTION_GRADE_LOSS, value: 40},
    ], 'fixture:fragile-ore');
    const cuttingPick = advance(startPickInscription(fragile, {id: 'split', miner, pick}), 3);
    const mark = (engine, id) => startPickInscription(engine, {id, miner, pick, preserveOre: true});
    const pendingMark = mark(cuttingPick, 'preserve');
    const competingMark = mark(pendingMark, 'preserve-again');
    const preserved = advance(restore(advance(competingMark, 4)), 6);
    assert.equal(preserved.records.workings['preserve-again'].record.status, 'interrupted');
    assert.equal(preserved.world.holders[miner].quantities[PICK_INK], 1);

    const results = [];
    for (const [grade, tool] of [[32, advance(cuttingPick, 6)], [72, preserved]]) {
        const extraction = startSeamExtraction(tool, {id: 'extract', miner, pick, seam, output: 'first'});
        const gathered = advance(restore(advance(extraction, 7)), 9);
        assert.deepEqual(serializeEngineWorld(gathered), serializeEngineWorld(advance(extraction, 9)));
        assert.equal(gathered.world.holders.first.quantities[FRAGMENT_STOCK], 4);
        assert.equal(gathered.world.holders[seam].quantities[SEAM_STOCK], 1);
        const smelting = startSeamSmelting(gathered, {id: 'smelt', miner, fragments: 'first',
            furnace: 'furnace', billet: 'billet', slag: 'slag'});
        const smelted = advance(restore(smelting), 12);
        const afterSmelt = smelted.world.clock;
        const input = smelted.world.holders.billet.properties[SMELTED_MATERIAL];
        const ready = applyEngineOps(smelted, [
            {op: 'carry', holder: miner, quantity: 'vitality', amount: 100},
            {op: 'carry', holder: place, quantity: 'noise', amount: 0},
            {op: 'holder_add', value: {id: mount, kind: 'thing', as: ['workshop_ward_mount'], place, properties: {holder: miner}}},
            {op: 'holder_add', value: {id: 'replacement-mount', kind: 'thing', as: ['workshop_ward_mount'], place, properties: {holder: miner}}},
            {op: 'holder_add', value: {id: insert, kind: 'thing', place, properties: {holder: miner, [WARD_SOCKET]: 'ward-tongue'}}},
        ], 'fixture:ward-assembly');
        const forge = startWardMountForging(ready, {id: 'forge', miner, billet: 'billet', furnace: 'furnace', mount});
        const halfway = advance(forge, afterSmelt + 1);
        const moved = applyEngineOps(halfway, [{op: 'move', holder: 'furnace', to: 'store'}], 'fixture:move-furnace');
        const interrupted = advance(restore(moved), afterSmelt + 3);
        assert.equal(interrupted.records.workings.forge.record.status, 'interrupted');
        assert.equal(interrupted.world.holders.billet.quantities[SMELTED_STOCK], 1);
        const fuel = ready.world.holders.furnace.quantities[SMELTING_FUEL];
        assert.equal(interrupted.world.holders.furnace.quantities[SMELTING_FUEL], fuel);
        const forged = advance(restore(halfway), afterSmelt + 3);
        assert.deepEqual(serializeEngineWorld(forged), serializeEngineWorld(advance(forge, afterSmelt + 3)));
        assert.equal(forged.world.holders.billet.quantities[SMELTED_STOCK], 0);
        assert.equal(forged.world.holders.furnace.quantities[SMELTING_FUEL], fuel - 1);
        const mountKey = forged.world.holders[mount].properties[WARD_MOUNT_MATERIAL];
        const history = readMaterialLineage(mountKey);
        assert.equal(history.facts.quality, grade);
        assert.equal(history.history[0].inputs[0].item_key, input);
        assert.deepEqual(forged.records.workings.forge.record.receipts[0].observed.balance,
            {unit: 'ore unit', input: 3, output: 3, loss: 0});
        const bound = bindGearWard(forged, {id, carrier: insert, bearer: miner, type: 'fire', phase: 'contact', charge: 12, per: 4});
        const fitted = advance(startWardSocketWork(bound, {id: 'install', mount, insert, bearer: miner, action: 'install'}), afterSmelt + 6);
        const hit = engine => settleGearHit(restore(engine), {id, wearer: miner, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
        const first = hit(wearGearWard(fitted, miner, mount));
        const second = hit(first.engine);
        results.push([first.damage, first.engine.world.holders[mount].properties[WARD_MOUNT_REMAINING],
            second.damage, second.engine.records.stored[id].charge.now]);
        if (grade !== 32) continue;
        const salvage = (engine, id) => startWardMountSalvage(engine, {id, miner, billet: 'billet', mount});
        const attached = advance(restore(salvage(second.engine, 'attached')), afterSmelt + 9);
        assert.equal(attached.records.workings.attached.record.status, 'interrupted');
        assert.equal(attached.world.holders.maker.quantities[DISASSEMBLY_SUPPLY], 2);
        const detached = advance(startWardSocketWork(attached, {id: 'detach', mount, insert, bearer: miner, action: 'detach'}), afterSmelt + 12);
        const pending = salvage(salvage(detached, 'recover'), 'recover-again');
        const recovered = advance(restore(advance(pending, afterSmelt + 13)), afterSmelt + 15);
        assert.deepEqual(serializeEngineWorld(recovered), serializeEngineWorld(advance(pending, afterSmelt + 15)));
        assert.equal(recovered.records.workings['recover-again'].record.status, 'interrupted');
        assert.equal(recovered.world.holders.maker.quantities[DISASSEMBLY_SUPPLY], 1);
        assert.equal(recovered.world.holders[mount].properties.lost, true);
        assert.equal(recovered.world.holders.billet.quantities[RECOVERED_IRON], 3);
        const scrap = recovered.world.holders.billet.properties[SMELTED_MATERIAL];
        assert.equal(readMaterialLineage(scrap).history[0].inputs[0].item_key, mountKey);

        const cast = advance(restore(startHeadRecast(recovered, {id: 'recast', miner, billet: 'billet', furnace: 'furnace'})), afterSmelt + 18);
        const castKey = cast.world.holders.billet.properties[SMELTED_MATERIAL];
        assert.equal(readMaterialLineage(castKey).history[0].inputs[0].item_key, scrap);
        const reforged = advance(startWardMountForging(cast,
            {id: 'forge-replacement', miner, billet: 'billet', furnace: 'furnace', mount: 'replacement-mount'}), afterSmelt + 21);
        const refitted = advance(restore(startWardSocketWork(reforged,
            {id: 'refit', mount: 'replacement-mount', insert, bearer: miner, action: 'install'})), afterSmelt + 24);
        const replacement = hit(wearGearWard(refitted, miner, 'replacement-mount'));
        assert.equal(replacement.damage, 3);
        assert.equal(replacement.engine.records.stored[id].charge.now, 4);
        assert.equal(replacement.engine.records.stored[id].carrier, insert);
    }
    assert.deepEqual(results, [[3, 0, 7, 8], [3, 5, 3, 4]]);
});

test('iron lost from a broken mount is accounted for and fresh iron tops up the replacement', () => {
    const mount = 'mount', insert = 'insert', id = 'fire-ward', furnace = 'furnace', billet = 'billet';
    const ready = applyEngineOps(smelt(32, 'square-socket', 7), [
        {op: 'carry', holder: miner, quantity: 'vitality', amount: 100},
        {op: 'carry', holder: place, quantity: 'noise', amount: 0},
        {op: 'property', holder: 'new-vein', property: SEAM_GRADE, value: 80},
        ...['mount', 'replacement-mount', 'offcut-mount'].map(id => ({op: 'holder_add', value: {id, kind: 'thing',
            as: ['workshop_ward_mount'], place, properties: {holder: miner}}})),
        {op: 'holder_add', value: {id: insert, kind: 'thing', place, properties: {holder: miner, [WARD_SOCKET]: 'ward-tongue'}}},
        ...[['fresh', 'workshop_billet'], ['fresh-slag', 'workshop_slag']].map(([id, kind]) => ({op: 'holder_add',
            value: {id, kind: 'thing', as: [kind], place, quantities: {[SMELTED_STOCK]: 0}, properties: {'workshop.held_by': miner}}})),
    ], 'fixture:lossy-mount');
    const forge = advance(startWardMountForging(ready, {id: 'forge', miner, billet, furnace, mount, breakLoss: 1}), 12);
    const bound = bindGearWard(forge, {id, carrier: insert, bearer: miner, type: 'fire', phase: 'contact', charge: 20, per: 4});
    const socket = (engine, id, mount, action) => startWardSocketWork(engine, {id, mount, insert, bearer: miner, action});
    const fitted = advance(socket(bound, 'install', mount, 'install'), 15);
    const hit = engine => settleGearHit(restore(engine), {id, wearer: miner, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    const broken = hit(wearGearWard(fitted, miner, mount)).engine;
    const detached = advance(socket(broken, 'detach', mount, 'detach'), 18);
    const recovered = advance(restore(startWardMountSalvage(detached, {id: 'recover', miner, billet, mount})), 21);
    assert.equal(recovered.world.holders[billet].quantities[RECOVERED_IRON], 2);
    assert.deepEqual(recovered.records.workings.recover.record.receipts[0].observed.balance,
        {unit: 'ore unit', input: 3, output: 2, loss: 1});
    const incomplete = advance(startHeadRecast(recovered, {id: 'short-recast', miner, billet, furnace}), 24);
    assert.equal(incomplete.records.workings['short-recast'].record.status, 'interrupted');
    const gathered = advance(startSeamExtraction(incomplete, {id: 'mine-fresh', miner, pick, seam: 'new-vein', output: 'third'}), 27);
    const fresh = advance(startSeamSmelting(gathered, {id: 'smelt-fresh', miner, fragments: 'third',
        furnace, billet: 'fresh', slag: 'fresh-slag'}), 30);
    const blend = startIronBlend(fresh, {id: 'blend', miner, billet, fresh: 'fresh', furnace});
    const halfway = advance(blend, 31);
    const moved = applyEngineOps(halfway, [{op: 'move', holder: 'fresh', to: 'store'}], 'fixture:remove-top-up');
    const stopped = advance(restore(moved), 33);
    assert.equal(stopped.records.workings.blend.record.status, 'interrupted');
    assert.equal(stopped.world.holders[billet].quantities[RECOVERED_IRON], 2);
    assert.equal(stopped.world.holders.fresh.quantities[SMELTED_STOCK], 1);
    assert.equal(stopped.world.holders[furnace].quantities[SMELTING_FUEL], 4);
    const blended = advance(restore(halfway), 33);
    assert.deepEqual(serializeEngineWorld(blended), serializeEngineWorld(advance(blend, 33)));
    const observed = blended.records.workings.blend.record.receipts[0].observed;
    assert.deepEqual(observed, {quality: 48, recovered: 2, fresh: 1, offcut: 2,
        balance: {unit: 'ore unit', input: 5, output: 5, loss: 0}});
    assert.equal(blended.world.holders.fresh.quantities[RECOVERED_IRON], 2);
    assert.equal(readMaterialLineage(blended.world.holders.fresh.properties[SMELTED_MATERIAL]).facts.quality, 80);
    assert.deepEqual(readMaterialLineage(blended.world.holders[billet].properties[SMELTED_MATERIAL]).history[0].inputs
        .map(({count, facts}) => [count, facts.quality]), [[2, 32], [1, 80]]);
    const replacement = advance(startWardMountForging(blended,
        {id: 'replace', miner, billet, furnace, mount: 'replacement-mount', breakLoss: 2}), 36);
    const installed = advance(socket(replacement, 'refit', 'replacement-mount', 'install'), 39);
    const first = hit(wearGearWard(installed, miner, 'replacement-mount'));
    assert.equal(first.engine.world.holders['replacement-mount'].properties[WARD_MOUNT_REMAINING], 2);
    const second = hit(first.engine);
    assert.equal(second.damage, 3);
    const freed = advance(socket(second.engine, 'detach-replacement', 'replacement-mount', 'detach'), 42);
    const reclaimed = advance(startWardMountSalvage(freed, {id: 'reclaim', miner, billet, mount: 'replacement-mount'}), 45);
    const offcutKey = reclaimed.world.holders.fresh.properties[SMELTED_MATERIAL];
    const reuse = startIronBlend(reclaimed, {id: 'reuse-offcut', miner, billet, fresh: 'fresh', furnace});
    const reused = advance(restore(advance(reuse, 46)), 48);
    assert.deepEqual(serializeEngineWorld(reused), serializeEngineWorld(advance(reuse, 48)));
    assert.deepEqual(reused.records.workings['reuse-offcut'].record.receipts[0].observed,
        {quality: 69, recovered: 1, fresh: 2, offcut: 0, balance: {unit: 'ore unit', input: 3, output: 3, loss: 0}});
    assert.equal(reused.world.holders.fresh.quantities[RECOVERED_IRON], 0);
    assert.equal(reused.world.holders.fresh.properties[SMELTED_MATERIAL], undefined);
    const recast = readMaterialLineage(reused.world.holders[billet].properties[SMELTED_MATERIAL]);
    assert.equal(recast.history[0].inputs[1].item_key, offcutKey);
    const split = applyEngineOps(reclaimed, [
        {op: 'add', holder: 'fresh', quantity: RECOVERED_IRON, amount: -1},
        {op: 'holder_add', value: {id: 'third-lot', kind: 'thing', as: ['workshop_billet'], place,
            quantities: {[SMELTED_STOCK]: 0, [RECOVERED_IRON]: 1},
            properties: {'workshop.held_by': miner, [SMELTED_MATERIAL]: offcutKey}}},
    ], 'fixture:split-offcuts');
    const pool = startIronBlend(split, {id: 'pool-offcuts', miner, billet, fresh: 'fresh', third: 'third-lot', furnace});
    const halfwayPool = advance(pool, 46);
    const displaced = applyEngineOps(halfwayPool, [{op: 'move', holder: 'third-lot', to: 'store'}], 'fixture:move-offcut');
    const failedPool = advance(restore(displaced), 48);
    assert.equal(failedPool.records.workings['pool-offcuts'].record.status, 'interrupted');
    for (const lot of [billet, 'fresh', 'third-lot']) assert.equal(failedPool.world.holders[lot].quantities[RECOVERED_IRON], 1);
    assert.equal(failedPool.world.holders[furnace].quantities[SMELTING_FUEL], 2);
    const pooled = advance(restore(halfwayPool), 48);
    assert.deepEqual(serializeEngineWorld(pooled), serializeEngineWorld(advance(pool, 48)));
    for (const lot of [billet, 'fresh', 'third-lot']) assert.equal(pooled.world.holders[lot].quantities[RECOVERED_IRON], 0);
    const pooledLineage = readMaterialLineage(pooled.world.holders[billet].properties[SMELTED_MATERIAL]);
    assert.equal(pooledLineage.facts.quality, 69);
    assert.deepEqual(pooledLineage.history[0].parameters.lots, [billet, 'fresh', 'third-lot']);
    assert.equal(pooledLineage.history[0].inputs[1].count, 2);
    const finalMount = advance(startWardMountForging(pooled, {id: 'forge-offcut', miner, billet, furnace, mount: 'offcut-mount'}), 51);
    const finalFit = advance(socket(finalMount, 'seat-offcut', 'offcut-mount', 'install'), 54);
    const finalHit = hit(wearGearWard(finalFit, miner, 'offcut-mount'));
    assert.equal(finalHit.damage, 3);
    assert.equal(finalHit.engine.world.holders['offcut-mount'].properties[WARD_MOUNT_REMAINING], 4);
});

test('a borrowed ward crosses with its mount and intercepts a hit at the destination', () => {
    const mount = 'shield', insert = 'insert', bearer = 'borrower', id = 'travel-ward';
    const fitted = advance(fit(smelt(72)), 12);
    const cleared = advance(startRouteClearing(fitted, {id: 'clear-one', miner, tool: 'tool', route: 'passage', blockage: 'rubble'}), 15);
    const opened = advance(startRouteClearing(cleared, {id: 'clear-two', miner, tool: 'tool', route: 'passage', blockage: 'rubble'}), 18);
    const ready = applyEngineOps(opened, [
        {op: 'carry', holder: bearer, quantity: 'vitality', amount: 100},
        {op: 'carry', holder: 'store', quantity: 'noise', amount: 0},
        ...[[mount, 'ward-recess'], [insert, 'ward-tongue']].map(([id, socket]) => ({op: 'holder_add', value: {
            id, kind: 'thing', place, properties: {holder: miner, [WARD_SOCKET]: socket},
        }})),
    ], 'fixture:travel-ward');
    const bound = bindGearWard(ready, {id, carrier: insert, bearer: miner, type: 'fire', phase: 'contact',
        charge: 8, per: 4, decay: {every: 3, amount: 1}});
    const installed = advance(startWardSocketWork(bound, {id: 'install', mount, insert, bearer: miner, action: 'install'}), 21);
    const loan = startWardAssemblyHandoff(installed, {id: 'lend', mount, insert, from: miner, to: bearer, mode: 'loan'});
    const lent = advance(startPickHandoff(loan, {id: 'lend-pick', from: miner, to: bearer, tool: 'tool', mode: 'loan'}), 24);
    const equipped = wearGearWard(lent, bearer, mount);
    const freight = applyEngineOps(equipped, [
        {op: 'property', holder: 'freight', property: 'workshop.held_by', value: bearer},
        {op: 'property', holder: 'freight', property: CARGO_WEIGHT, value: 4},
    ], 'fixture:ward-freight');
    const overloaded = advance(restore(startRockPassageCrossing(freight, {id: 'heavy-ward', miner: bearer, tool: 'tool',
        route: 'passage', cargo: 'freight', ward: {mount, insert}})), 26);
    assert.equal(overloaded.records.workings['heavy-ward'].record.status, 'interrupted');
    for (const holder of [bearer, mount, insert, 'freight']) assert.equal(overloaded.world.holders[holder].place, place);
    const crossing = startRockPassageCrossing(equipped, {id: 'carry-ward', miner: bearer, tool: 'tool', route: 'passage', ward: {mount, insert}});
    const halfway = advance(crossing, 25);
    const removed = advance(restore(wearGearWard(halfway, bearer)), 26);
    assert.equal(removed.records.workings['carry-ward'].record.status, 'interrupted');
    for (const holder of [bearer, mount, insert]) assert.equal(removed.world.holders[holder].place, place);
    const arrived = advance(restore(halfway), 26);
    assert.deepEqual(serializeEngineWorld(arrived), serializeEngineWorld(advance(crossing, 26)));
    assert.deepEqual(arrived.records.workings['carry-ward'].record.receipts[0].observed, {load: 3, limit: 6});
    for (const holder of [bearer, 'tool', mount, insert]) assert.equal(arrived.world.holders[holder].place, 'store');
    for (const holder of [mount, insert]) assert.equal(arrived.world.holders[holder].properties['workshop.ward_assembly_lender'], miner);
    const caught = settleGearHit(restore(arrived), {id, wearer: bearer, packets: [{type: 'fire', phase: 'contact', amount: 7}]});
    assert.equal(caught.damage, 3);
    assert.equal(caught.engine.records.stored[id].charge.now, 2);
});

test('a fitted pick keeps its mark through a timed loan, use, and return', () => {
    const borrower = 'borrower', tool = 'tool';
    const marked = advance(startHeadInscription(smelt(72), {id: 'mark-head', miner, billet: 'billet'}), 12);
    const fitted = advance(fit(marked), 15);
    const key = fitted.world.holders.tool.properties[FITTED_BILLET];
    const loan = startPickHandoff(fitted, {id: 'lend', from: miner, to: borrower, tool, mode: 'loan'});
    const moved = applyEngineOps(advance(loan, 16), [{op: 'move', holder: borrower, to: 'store'}], 'fixture:leave-before-loan');
    const refused = advance(restore(moved), 18);
    assert.equal(refused.records.workings.lend.record.status, 'interrupted');
    assert.equal(refused.world.holders.tool.properties['workshop.held_by'], miner);
    const lent = advance(restore(advance(loan, 16)), 18);
    assert.deepEqual(serializeEngineWorld(lent), serializeEngineWorld(advance(loan, 18)));

    const stale = startFittedExtraction(lent, {id: 'stale', miner, tool, seam: 'new-vein', output: 'third'});
    const dig = startFittedExtraction(stale, {id: 'borrowed-cut', miner: borrower, tool, seam: 'new-vein', output: 'borrower-basket'});
    const gift = startPickHandoff(dig, {id: 'gift', from: borrower, to: 'third-party', tool, mode: 'gift'});
    const wrongReturn = startPickHandoff(gift, {id: 'wrong-return', from: borrower, to: 'third-party', tool, mode: 'return'});
    const strip = startToolDisassembly(wrongReturn, {id: 'strip', miner: borrower, billet: 'borrower-head', grip: 'borrower-grip', tool});
    const used = advance(restore(advance(strip, 19)), 21);
    assert.equal(used.records.workings.stale.record.status, 'interrupted');
    assert.equal(used.records.workings.gift.record.status, 'interrupted');
    assert.equal(used.records.workings['wrong-return'].record.status, 'interrupted');
    assert.equal(used.records.workings.strip.record.status, 'interrupted');
    assert.equal(used.world.holders.borrower.quantities[DISASSEMBLY_SUPPLY], 1);
    assert.equal(used.world.holders['borrower-basket'].quantities[FRAGMENT_STOCK], 4);
    assert.equal(used.world.holders.tool.properties[FITTED_BILLET], key);

    const returning = startPickHandoff(used, {id: 'return', from: borrower, to: miner, tool, mode: 'return'});
    const returned = advance(restore(advance(returning, 22)), 24);
    assert.deepEqual(serializeEngineWorld(returned), serializeEngineWorld(advance(returning, 24)));
    assert.equal(returned.world.holders.tool.properties['workshop.held_by'], miner);
    const clear = startRouteClearing(returned, {id: 'clear-after-return', miner, tool, route: 'passage', blockage: 'rubble'});
    assert.equal(advance(restore(clear), 27).world.links[0].state, 'open');
    const given = advance(restore(startPickHandoff(returned, {id: 'give', from: miner, to: borrower, tool, mode: 'gift'})), 27);
    const nextLoan = startPickHandoff(given, {id: 'lend-onward', from: borrower, to: 'third-party', tool, mode: 'loan'});
    assert.equal(advance(restore(nextLoan), 30).world.holders.tool.properties['workshop.held_by'], 'third-party');
});

test('an agreed recall spends ink once and returns the same pick through an open route', () => {
    const borrower = 'borrower', tool = 'tool';
    const marked = advance(startHeadInscription(smelt(72, 'square-socket', 1, 3), {id: 'mark-head', miner, billet: 'billet'}), 12);
    const fitted = advance(fit(marked), 15);
    const opened = advance(startRouteClearing(fitted, {id: 'open', miner, tool, route: 'passage', blockage: 'rubble'}), 18);
    const abroad = recall => {
        const loan = startPickHandoff(opened, {id: 'loan', from: miner, to: borrower, tool, mode: 'loan', recall});
        const lent = advance(loan, 21);
        return advance(startRockPassageCrossing(lent, {id: 'travel', miner: borrower, tool, route: 'passage'}), 23);
    };
    const call = (engine, id, lender = miner) => startPickRecall(engine, {id, lender, borrower, tool});
    const ordinary = advance(restore(call(abroad(false), 'unagreed')), 26);
    assert.equal(ordinary.records.workings.unagreed.record.status, 'interrupted');
    assert.equal(ordinary.world.holders.maker.quantities[PICK_INK], 1);

    const remote = abroad(true);
    const unauthorized = advance(restore(call(remote, 'wrong-lender', 'third-party')), 26);
    assert.equal(unauthorized.records.workings['wrong-lender'].record.status, 'interrupted');
    const pending = call(remote, 'recall');
    const closed = applyEngineOps(advance(pending, 24), [{op: 'link_set', id: 'passage', state: 'closed'}], 'fixture:close-return');
    const interrupted = advance(restore(closed), 26);
    assert.equal(interrupted.records.workings.recall.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.tool.place, 'store');
    assert.equal(interrupted.world.holders.maker.quantities[PICK_INK], 1);

    const competing = call(pending, 'recall-again');
    const recalled = advance(restore(advance(competing, 24)), 26);
    assert.deepEqual(serializeEngineWorld(recalled), serializeEngineWorld(advance(competing, 26)));
    assert.equal(recalled.records.workings.recall.record.status, 'complete');
    assert.equal(recalled.records.workings['recall-again'].record.status, 'interrupted');
    assert.equal(recalled.world.holders.maker.quantities[PICK_INK], 0);
    assert.equal(recalled.world.holders.tool.place, place);
    assert.equal(recalled.world.holders.borrower.place, 'store');
    assert.equal(recalled.world.holders.tool.properties[FITTED_BILLET], fitted.world.holders.tool.properties[FITTED_BILLET]);
    const dig = startFittedExtraction(recalled, {id: 'cut-recalled', miner, tool, seam: 'new-vein', output: 'third'});
    assert.equal(advance(restore(dig), 29).world.holders.third.quantities[FRAGMENT_STOCK], 4);
});

test('an attuned head still cuts in a new bearer’s hands and regains its bonus after paid retuning', () => {
    const borrower = 'borrower', tool = 'tool';
    const keyed = startHeadInscription(smelt(72), {id: 'key-head', miner, billet: 'billet', keyed: true});
    const fitted = advance(fit(advance(keyed, 12)), 15);
    const dig = (engine, miner, output) => startFittedExtraction(engine, {id: 'dig', miner, tool, seam: 'new-vein', output});
    assert.equal(advance(dig(fitted, miner, 'third'), 18).world.holders.third.quantities[FRAGMENT_STOCK], 4);
    const handoff = (mode) => advance(startPickHandoff(fitted, {id: 'handoff', from: miner, to: borrower, tool, mode}), 18);
    const retune = (engine, id) => startHeadAttunement(engine, {id, miner: borrower, tool});
    const loan = advance(restore(retune(handoff('loan'), 'retune')), 21);
    assert.equal(loan.records.workings.retune.record.status, 'interrupted');
    assert.equal(loan.world.holders.borrower.quantities[PICK_INK], 1);
    assert.equal(advance(dig(loan, borrower, 'borrower-basket'), 24).world.holders['borrower-basket'].quantities[FRAGMENT_STOCK], 2);
    const gift = handoff('gift');
    assert.equal(advance(dig(advance(gift, 21), borrower, 'borrower-basket'), 24).world.holders['borrower-basket'].quantities[FRAGMENT_STOCK], 2);
    const job = retune(retune(gift, 'retune'), 'retune-again');
    const tuned = advance(restore(advance(job, 19)), 21);
    assert.deepEqual(serializeEngineWorld(tuned), serializeEngineWorld(advance(job, 21)));
    assert.equal(tuned.records.workings['retune-again'].record.status, 'interrupted');
    assert.equal(tuned.world.holders.borrower.quantities[PICK_INK], 0);
    assert.equal(tuned.world.holders.tool.properties[FITTED_BILLET], fitted.world.holders.tool.properties[FITTED_BILLET]);
    assert.equal(advance(restore(dig(tuned, borrower, 'borrower-basket')), 24).world.holders['borrower-basket'].quantities[FRAGMENT_STOCK], 4);
});

test('the grade of the actual billet changes whether a fitted tool cracks under the same proof load', () => {
    const misfit = advance(restore(fit(smelt(72, 'round-socket'))), 12);
    assert.equal(misfit.records.workings.fit.record.status, 'interrupted');
    assert.equal(misfit.world.holders.billet.quantities[SMELTED_STOCK], 1);
    assert.equal(misfit.world.holders.grip.quantities[GRIP_STOCK], 1);
    assert.equal(misfit.world.holders.tool.properties[FITTED_BILLET], undefined);

    for (const [grade, limit, crackedAt] of [[32, 18, 'seat'], [72, 28, undefined]]) {
        const smelted = smelt(grade);
        const billetKey = smelted.world.holders.billet.properties[SMELTED_MATERIAL];
        const fitting = fit(smelted);
        const fitted = advance(restore(advance(fitting, 10)), 12);
        assert.deepEqual(serializeEngineWorld(fitted), serializeEngineWorld(advance(fitting, 12)));
        assert.equal(fitted.world.holders.tool.properties[FITTED_BILLET], billetKey);
        assert.equal(readMaterialLineage(billetKey).facts.quality, grade);
        assert.equal(fitted.world.holders.billet.quantities[SMELTED_STOCK], 0);
        assert.equal(fitted.world.holders.grip.quantities[GRIP_STOCK], 0);
        const proof = startToolProof(fitted, {id: 'proof', miner, tool: 'tool', load: 24});
        const proved = advance(restore(advance(proof, 13)), 15);
        assert.deepEqual(serializeEngineWorld(proved), serializeEngineWorld(advance(proof, 15)));
        const {observed} = proved.records.workings.proof.record.receipts[0];
        assert.equal(observed.limit, limit);
        assert.equal(observed.ok, crackedAt === undefined);
        assert.equal(restore(proved).world.holders.tool.properties[CRACKED_AT], crackedAt);
        if (crackedAt) {
            const retry = advance(startToolProof(proved, {id: 'retry', miner, tool: 'tool', load: 1}), 18);
            assert.equal(retry.records.workings.retry.record.status, 'interrupted');
        }

        const legacyKey = JSON.parse(billetKey);
        delete legacyKey.quality;
        delete legacyKey.lineage.facts.quality;
        const legacy = applyEngineOps(smelted, [{op: 'property', holder: 'billet', property: SMELTED_MATERIAL,
            value: JSON.stringify(legacyKey)}], 'fixture:legacy-billet');
        const olderFit = advance(fit(restore(legacy)), 12);
        const olderProof = advance(startToolProof(olderFit, {id: 'legacy-proof', miner, tool: 'tool', load: 24}), 15);
        assert.deepEqual(olderProof.records.workings['legacy-proof'].record.receipts[0].observed, observed);
    }
});

test('repeated mining weakens the fitted seat until the same load cracks it after restore', () => {
    const vein = 'new-vein', tool = 'tool';
    const dig = (engine, id, output) => startFittedExtraction(engine, {id, miner, tool, seam: vein, output});
    const setupLoad = grade => applyEngineOps(advance(fit(smelt(grade)), 12), [
        {op: 'property', holder: vein, property: SEAM_LOAD, value: 12},
        {op: 'set', holder: vein, quantity: SEAM_STOCK, amount: 10},
        ...['cycle-basket-2', 'cycle-basket-3', 'cycle-basket-4'].map(id => ({op: 'holder_add', value: {
            id, kind: 'thing', as: ['fragment_lot'], place,
            properties: {'workshop.held_by': miner}, quantities: {[FRAGMENT_STOCK]: 0},
        }})),
    ], 'fixture:loaded-seam');
    const cycle = (engine, n, output) => advance(dig(engine, `cycle-${n}`, output), 12 + 3 * n);
    const work = grade => ['third', 'cycle-basket-2', 'cycle-basket-3']
        .reduce((engine, output, index) => cycle(engine, index + 1, output), setupLoad(grade));
    const worn = work(32);
    assert.deepEqual([1, 2, 3].map(n => worn.records.workings[`cycle-${n}`].record.receipts[0].observed.joint.condition), [86, 70, 50]);
    const basket = 'cycle-basket-4';
    const pending = advance(dig(worn, 'break-under-load', basket), 22);
    const moved = applyEngineOps(pending, [{op: 'move', holder: tool, to: 'store'}], 'fixture:remove-tool');
    const stopped = advance(restore(moved), 24);
    assert.equal(stopped.records.workings['break-under-load'].record.status, 'interrupted');
    assert.equal(stopped.world.holders[tool].properties[SEAT_CONDITION], 50);
    const cracked = advance(restore(pending), 24);
    assert.deepEqual(serializeEngineWorld(cracked), serializeEngineWorld(advance(pending, 24)));
    assert.equal(cracked.world.holders[tool].properties[CRACKED_AT], 'seat');
    assert.equal(cracked.world.holders[vein].quantities[SEAM_STOCK], 4);
    assert.equal(cracked.world.holders[basket].quantities[FRAGMENT_STOCK], 0);
    const retry = advance(dig(restore(cracked), 'retry', basket), 27);
    assert.equal(retry.records.workings.retry.record.status, 'interrupted');

    const stripped = advance(restore(startToolDisassembly(retry, {id: 'strip-cracked-seat', ...assembly})), 30);
    assert.equal(stripped.world.holders[tool].properties[SEAT_CONDITION], undefined);
    assert.equal(stripped.world.holders.billet.quantities[RECOVERED_IRON], 3);
    assert.equal(stripped.world.holders.grip.quantities[GRIP_STOCK], 1);

    const takeApart = startToolDisassembly(worn, {id: 'strip-worn-seat', ...assembly});
    const loose = advance(restore(advance(takeApart, 22)), 24);
    assert.equal(loose.world.holders.billet.properties[SEAT_CONDITION], 50);
    assert.equal(loose.world.holders[tool].properties[SEAT_CONDITION], undefined);
    const refitting = startBilletFitting(loose, {id: 'replace-grip', ...assembly, grip: 'replacement'});
    const refitted = advance(restore(advance(refitting, 25)), 27);
    assert.deepEqual(serializeEngineWorld(refitted), serializeEngineWorld(advance(refitting, 27)));
    assert.equal(refitted.world.holders.billet.properties[SEAT_CONDITION], undefined);
    assert.equal(refitted.world.holders[tool].properties[FITTED_BILLET], worn.world.holders[tool].properties[FITTED_BILLET]);
    assert.equal(refitted.world.holders[tool].properties[SEAT_CONDITION], 50);
    const refitCut = advance(dig(restore(refitted), 'dig-after-refit', basket), 30);
    assert.equal(refitCut.world.holders[tool].properties[CRACKED_AT], 'seat');
    assert.equal(refitCut.world.holders[vein].quantities[SEAM_STOCK], 4);

    const strong = cycle(work(72), 4, basket);
    assert.equal(strong.world.holders[tool].properties[CRACKED_AT], undefined);
    assert.equal(strong.world.holders[vein].quantities[SEAM_STOCK], 2);
    assert.equal(strong.world.holders[basket].quantities[FRAGMENT_STOCK], 2);

    const stockShims = engine => applyEngineOps(engine, [
        {op: 'carry', holder: miner, quantity: SEAT_SHIMS, amount: 2},
    ], 'fixture:seat-shims');
    const service = (engine, id = 'service-seat') => startToolSeatService(engine, {id, miner, tool});
    const broken = advance(restore(service(stockShims(cracked))), 27);
    assert.equal(broken.records.workings['service-seat'].record.status, 'interrupted');
    assert.equal(broken.world.holders[miner].quantities[SEAT_SHIMS], 2);

    const supplied = stockShims(worn);
    const scheduled = advance(service(service(supplied), 'service-seat-again'), 22);
    const absent = applyEngineOps(scheduled, [{op: 'move', holder: tool, to: 'store'}], 'fixture:remove-pick');
    const refused = advance(restore(absent), 24);
    assert.equal(refused.world.holders[miner].quantities[SEAT_SHIMS], 2);
    assert.equal(refused.world.holders[tool].properties[SEAT_CONDITION], 50);
    const serviced = advance(restore(scheduled), 24);
    assert.deepEqual(serializeEngineWorld(serviced), serializeEngineWorld(advance(scheduled, 24)));
    assert.equal(serviced.records.workings['service-seat-again'].record.status, 'interrupted');
    assert.equal(serviced.world.holders[miner].quantities[SEAT_SHIMS], 1);
    assert.equal(serviced.world.holders[tool].properties[SEAT_CONDITION], 100);
    assert.equal(serviced.world.holders[tool].properties[FITTED_BILLET], worn.world.holders[tool].properties[FITTED_BILLET]);
    const next = advance(dig(restore(serviced), 'dig-after-service', basket), 27);
    assert.equal(next.world.holders[tool].properties[CRACKED_AT], undefined);
    assert.equal(next.world.holders[tool].properties[SEAT_CONDITION], 86);
    assert.equal(next.world.holders[basket].quantities[FRAGMENT_STOCK], 2);
});

test('disassembly and recasting preserve actual recovered iron through refit after restore', () => {
    const fitted = advance(fit(smelt(32, 'square-socket', 2)), 12);
    const originalKey = fitted.world.holders.tool.properties[FITTED_BILLET];
    const cracked = advance(startToolProof(fitted, {id: 'crack', miner, tool: 'tool', load: 24}), 15);
    const stripping = startToolDisassembly(cracked, {id: 'strip', ...assembly});
    const moved = applyEngineOps(advance(stripping, 16), [{op: 'move', holder: 'grip', to: 'store'}], 'fixture:move-rest');
    const interrupted = advance(restore(moved), 18);
    assert.equal(interrupted.records.workings.strip.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.tool.properties[FITTED_BILLET], originalKey);
    assert.equal(interrupted.world.holders.maker.quantities[DISASSEMBLY_SUPPLY], 2);

    const competing = startToolDisassembly(stripping, {id: 'strip-again', ...assembly});
    const stripped = advance(restore(advance(competing, 16)), 18);
    assert.deepEqual(serializeEngineWorld(stripped), serializeEngineWorld(advance(competing, 18)));
    assert.equal(stripped.records.workings['strip-again'].record.status, 'interrupted');
    assert.equal(stripped.world.holders.maker.quantities[DISASSEMBLY_SUPPLY], 1);
    assert.deepEqual(stripped.records.workings.strip.record.receipts[0].observed, {
        iron: {reusable: 2, scrap: 1, loss: 0}, grip: {reusable: 1, scrap: 0, loss: 0},
    });
    assert.equal(stripped.world.holders.tool.properties[FITTED_BILLET], undefined);
    assert.equal(stripped.world.holders.grip.quantities[GRIP_STOCK], 1);
    const scrapKey = stripped.world.holders.billet.properties[SMELTED_MATERIAL];
    assert.equal(stripped.world.holders.billet.quantities[RECOVERED_IRON], 3);
    assert.equal(readMaterialLineage(scrapKey).history[0].inputs[0].item_key, originalKey);
    const unfit = advance(fit(stripped, 'raw-refit'), 21);
    assert.equal(unfit.records.workings['raw-refit'].record.status, 'interrupted');
    assert.equal(unfit.world.holders.grip.quantities[GRIP_STOCK], 1);

    const recasting = startHeadRecast(unfit, {id: 'recast', miner, billet: 'billet', furnace: 'furnace'});
    const recast = advance(restore(advance(recasting, 22)), 24);
    assert.deepEqual(serializeEngineWorld(recast), serializeEngineWorld(advance(recasting, 24)));
    assert.equal(recast.world.holders.furnace.quantities[SMELTING_FUEL], 0);
    assert.equal(recast.world.holders.billet.quantities[RECOVERED_IRON], 0);
    assert.deepEqual(recast.records.workings.recast.record.receipts[0].observed.balance,
        {unit: 'ore unit', input: 3, output: 3, loss: 0});
    const refitted = advance(fit(recast, 'refit'), 27);
    assert.equal(refitted.world.holders.grip.quantities[GRIP_STOCK], 0);
    const installed = readMaterialLineage(refitted.world.holders.tool.properties[FITTED_BILLET]);
    assert.equal(installed.history[0].inputs[0].item_key, scrapKey);
    const proof = advance(startToolProof(restore(refitted), {id: 'refit-proof', miner, tool: 'tool', load: 18}), 30);
    assert.equal(proof.records.workings['refit-proof'].record.receipts[0].observed.ok, true);
    assert.equal(proof.world.holders.tool.properties[CRACKED_AT], undefined);
    const overload = advance(startToolProof(proof, {id: 'refit-overload', miner, tool: 'tool', load: 24}), 33);
    assert.equal(overload.world.holders.tool.properties[CRACKED_AT], 'seat');
});

test('a failed grip yields grip scrap while its sound iron returns unchanged', () => {
    const fitted = advance(fit(smelt(100)), 12);
    const originalKey = fitted.world.holders.tool.properties[FITTED_BILLET];
    const cracked = advance(startToolProof(fitted, {id: 'crack', miner, tool: 'tool', load: 34}), 15);
    assert.equal(cracked.world.holders.tool.properties[CRACKED_AT], 'grip');
    const stripped = advance(restore(startToolDisassembly(cracked, {id: 'strip', ...assembly})), 18);
    assert.equal(stripped.world.holders.billet.properties[SMELTED_MATERIAL], originalKey);
    assert.equal(stripped.world.holders.billet.quantities[SMELTED_STOCK], 1);
    assert.equal(stripped.world.holders.grip.quantities[GRIP_SCRAP], 1);
    assert.equal(stripped.world.holders.grip.quantities[GRIP_STOCK], 0);
});

test('a head inscription survives grip replacement and burns away when the head is recast', () => {
    const mark = engine => startHeadInscription(engine, {id: 'mark-head', miner, billet: 'billet'});
    const dig = (engine, id) => startFittedExtraction(engine, {id, miner, tool: 'tool', seam: 'new-vein', output: 'third'});
    const count = engine => engine.world.holders.third.quantities[FRAGMENT_STOCK];
    const high = smelt(100);
    const pending = mark(high);
    const marked = advance(restore(advance(pending, 10)), 12);
    assert.deepEqual(serializeEngineWorld(marked), serializeEngineWorld(advance(pending, 12)));
    assert.equal(marked.world.holders.maker.quantities[PICK_INK], 0);
    const plain = advance(dig(advance(fit(advance(high, 12)), 15), 'plain-cut'), 18);
    const fitted = advance(fit(marked), 15);
    assert.equal(count(plain), 2);
    assert.equal(count(advance(dig(fitted, 'marked-cut'), 18)), 4);

    const badGrip = advance(startToolProof(fitted, {id: 'break-grip', miner, tool: 'tool', load: 34}), 18);
    const refused = advance(restore(dig(badGrip, 'broken-cut')), 21);
    assert.equal(refused.records.workings['broken-cut'].record.status, 'interrupted');
    assert.equal(refused.world.holders['new-vein'].quantities[SEAM_STOCK], 5);
    const stripped = advance(restore(startToolDisassembly(refused, {id: 'strip', ...assembly})), 24);
    const refit = startBilletFitting(stripped, {id: 'refit', ...assembly, grip: 'replacement'});
    const newGrip = advance(restore(advance(refit, 25)), 27);
    const gathered = advance(restore(dig(newGrip, 'refitted-cut')), 30);
    assert.equal(count(gathered), 4);
    assert.equal(gathered.world.holders['new-vein'].quantities[SEAM_STOCK], 1);

    const low = advance(fit(advance(mark(smelt(32, 'square-socket', 2)), 12)), 15);
    const badHead = advance(startToolProof(low, {id: 'break-head', miner, tool: 'tool', load: 24}), 18);
    const scrap = advance(startToolDisassembly(badHead, {id: 'strip', ...assembly}), 21);
    const cast = advance(restore(startHeadRecast(scrap, {id: 'recast', miner, billet: 'billet', furnace: 'furnace'})), 24);
    const newHead = advance(fit(cast, 'refit'), 27);
    assert.equal(count(advance(restore(dig(newHead, 'recast-cut')), 30)), 2);
});

test('a paid tracing reconstructs the mark on its recast head after save and restore', () => {
    const marked = advance(startHeadInscription(smelt(32, 'square-socket', 2, 4),
        {id: 'mark-head', miner, billet: 'billet'}), 12);
    const fitted = advance(fit(marked), 15);
    const tracing = startHeadTracing(fitted, {id: 'trace', miner, tool: 'tool', note: 'sheet'});
    const finishedTrace = advance(restore(advance(tracing, 16)), 18);
    assert.deepEqual(serializeEngineWorld(finishedTrace), serializeEngineWorld(advance(tracing, 18)));
    const traced = applyEngineOps(finishedTrace, ['workshop.trace_split', 'workshop.trace_preserve_ore'].map(property =>
        ({op: 'property', holder: 'sheet', property, value: null})), 'fixture:legacy-split-tracing');
    assert.equal(traced.world.holders.maker.quantities[PICK_INK], 1);
    assert.equal(traced.world.holders.sheet.properties['workshop.head_trace'], fitted.world.holders.tool.properties[FITTED_BILLET]);
    const cracked = advance(startToolProof(traced, {id: 'crack', miner, tool: 'tool', load: 24}), 21);
    const stripped = advance(startToolDisassembly(cracked, {id: 'strip', ...assembly}), 24);
    const recast = advance(startHeadRecast(stripped, {id: 'recast', miner, billet: 'billet', furnace: 'furnace'}), 27);

    const reconstruct = (engine, id) => startHeadPatternRestore(engine, {id, miner, billet: 'billet', note: 'sheet'});
    const pending = reconstruct(recast, 'reconstruct');
    const moved = applyEngineOps(advance(pending, 28), [{op: 'move', holder: 'sheet', to: 'store'}], 'fixture:move-tracing');
    const interrupted = advance(restore(moved), 30);
    assert.equal(interrupted.records.workings.reconstruct.record.status, 'interrupted');
    assert.equal(interrupted.world.holders.maker.quantities[PICK_INK], 1);

    const different = applyEngineOps(recast, [{op: 'property', holder: 'sheet', property: 'workshop.head_trace',
        value: smelt(72).world.holders.billet.properties[SMELTED_MATERIAL]}], 'fixture:different-tracing');
    const mismatch = advance(restore(reconstruct(different, 'wrong')), 30);
    assert.equal(mismatch.records.workings.wrong.record.status, 'interrupted');
    assert.equal(mismatch.world.holders.maker.quantities[PICK_INK], 1);

    const restored = advance(restore(advance(pending, 28)), 30);
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(advance(pending, 30)));
    assert.equal(restored.world.holders.maker.quantities[PICK_INK], 0);
    assert.equal(restored.world.holders.sheet.properties['workshop.head_trace'], traced.world.holders.sheet.properties['workshop.head_trace']);
    const refitted = advance(fit(restored, 'refit'), 33);
    const dig = startFittedExtraction(refitted, {id: 'dig', miner, tool: 'tool', seam: 'new-vein', output: 'third'});
    assert.equal(advance(restore(dig), 36).world.holders.third.quantities[FRAGMENT_STOCK], 4);
    const clear = startRouteClearing(refitted, {id: 'clear', miner, tool: 'tool', route: 'passage', blockage: 'rubble'});
    const cleared = advance(restore(clear), 36);
    assert.equal(cleared.world.links[0].state, 'open');
});

test('a preservation-only head keeps its mark through refit and needs its tracing after recasting', () => {
    const billet = 'billet', tool = 'tool', note = 'sheet';
    const ready = applyEngineOps(smelt(32, 'square-socket', 2, 5), [
        {op: 'property', holder: 'new-vein', property: SEAM_GRADE, value: 72},
        {op: 'property', holder: 'new-vein', property: EXTRACTION_GRADE_LOSS, value: 40},
    ], 'fixture:fragile-head-vein');
    const inscription = startHeadInscription(ready, {id: 'preserve-head', miner, billet, preserveOre: true});
    const fitted = advance(fit(advance(restore(inscription), 12)), 15);
    const dig = (engine, at) => {
        const pending = startFittedExtraction(engine, {id: 'compare-ore', miner, tool, seam: 'new-vein', output: 'third'});
        const gathered = advance(restore(pending), at);
        const {observed} = gathered.records.workings['compare-ore'].record.receipts[0];
        return [observed.taken, observed.quality];
    };
    assert.deepEqual(dig(fitted, 18), [2, 72]);
    const tracing = startHeadTracing(fitted, {id: 'trace-preserve', miner, tool, note});
    const traced = advance(restore(advance(tracing, 16)), 18);
    const sound = advance(restore(startToolDisassembly(traced, {id: 'strip-sound', ...assembly})), 21);
    const refitted = advance(startBilletFitting(sound, {id: 'refit-grip', ...assembly, grip: 'replacement'}), 24);
    assert.deepEqual(dig(refitted, 27), [2, 72]);
    const cracked = advance(startToolProof(refitted, {id: 'crack-seat', miner, tool, load: 24}), 27);
    const scrap = advance(restore(startToolDisassembly(cracked,
        {id: 'strip-cracked', ...assembly, grip: 'replacement'})), 30);
    const cast = advance(restore(startHeadRecast(scrap, {id: 'recast-preserve', miner, billet, furnace: 'furnace'})), 33);
    const refit = engine => advance(startBilletFitting(engine,
        {id: 'refit-cast', ...assembly, grip: 'replacement'}), 39);
    assert.deepEqual(dig(refit(advance(cast, 36)), 42), [2, 32]);

    const reconstruct = startHeadPatternRestore(cast, {id: 'reconstruct-preserve', miner, billet, note});
    const competing = startHeadPatternRestore(reconstruct, {id: 'reconstruct-preserve-again', miner, billet, note});
    const restored = advance(restore(advance(competing, 34)), 36);
    assert.deepEqual(serializeEngineWorld(restored), serializeEngineWorld(advance(competing, 36)));
    assert.equal(restored.records.workings['reconstruct-preserve-again'].record.status, 'interrupted');
    assert.equal(restored.world.holders[miner].quantities[PICK_INK], 1);
    assert.deepEqual(dig(refit(restored), 42), [2, 72]);
});
