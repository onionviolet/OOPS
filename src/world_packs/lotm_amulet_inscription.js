// PC95, LOTM English v1 ch83 P033–P047. The inscription resolver owns the
// two faces. The engine holds the workpiece and pays the binding cost.
import {startEngineWorking} from '../engine_world.js';
import {defineWorkingLaw} from '../kernel_working.js';
import {readItemKey} from '../inventory_key.js';
import {
    boundAmuletMinute, MARKED_TRIAL_SILVER, TINGEN_AMULET_FAMILY, TINGEN_TRIAL_BLANK, isTingenAmulet,
    resolveAmuletInscription,
} from '../lotm_amulet_crafting.js';
import {resolveTingenMishap} from '../lotm_amulet_protection.js';
import {LOTM_IDS} from '../book_world_lotm_ids.js';
import {planMaterialPartition} from '../material_lineage.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

export const TINGEN_SILVER = 'stock:tingen_silver';
export const TINGEN_SPIRITUALITY = 'energy:spirituality';

const PRICE = 1;
const KEY = 'tingen.item_key';
const OWNER = 'tingen.held_by';
const DESK = 'tingen.engraving_desk';
const roles = {maker: 'body', silver: 'tingen.silver', knife: 'tingen.knife', desk: 'place'};
const steps = {
    mark: {input: TINGEN_TRIAL_BLANK, operations: ['engrave-first-face'], minutes: 4, process: 'lotm.mark-silver'},
    bind: {input: MARKED_TRIAL_SILVER, operations: ['engrave-second-face', 'complete-inscription'],
        minutes: 6, process: 'lotm.bind-amulet'},
};
const materialId = key => readItemKey(key)?.id;
const refused = reason => ({ok: false, reason});

function inscribe(stage, {bound: {maker, silver, knife, desk}, at, address}) {
    if (knife.holder === silver.holder || maker.place !== desk.holder || !desk.properties[DESK] || knife.place !== desk.holder ||
        knife.properties[OWNER] !== maker.holder)
        return refused('The maker needs the engraving knife at the prepared desk.');
    const key = silver.properties[KEY];
    if (silver.place !== desk.holder || silver.properties[OWNER] !== maker.holder ||
        silver.quantities[TINGEN_SILVER] !== 1 || materialId(key) !== materialId(stage.input))
        return refused('The maker needs the matching silver workpiece.');
    const bind = stage === steps.bind;
    const spirituality = maker.quantities[TINGEN_SPIRITUALITY] ?? 0;
    if (bind && spirituality < PRICE) return refused('There is too little spirituality to join both faces.');

    const trial = resolveAmuletInscription({blankKey: stage.input, stock: {[stage.input]: 1},
        steps: stage.operations, clock: at, atDesk: true, knifeReady: true, spirituality, keepMarkedPiece: true});
    const id = materialId(trial.resultKey);
    if (bind ? !trial.finished : trial.resultKey !== MARKED_TRIAL_SILVER)
        return refused('The inscription did not reach the intended state.');

    // The resolver works on a material profile. Record the transition from
    // the actual item key and leave the physical unit on its existing holder.
    const {outputs: [product]} = planMaterialPartition({
        stock: {[key]: 1}, inputs: [{item_key: key, count: 1}], unit: 'silver workpiece', unitsPerInput: () => 1,
        outputs: [{output: {id, family: TINGEN_AMULET_FAMILY, count: 1}, unitsPerItem: 1}],
        process: {id: stage.process, revision: 1, world_id: LOTM_IDS.world, at, parameters: {cause: address}},
    });
    return {ok: true, observed: {itemKey: product.item_key},
        costs: bind ? [{quantity: TINGEN_SPIRITUALITY, amount: PRICE, payer: maker.holder}] : [],
        effects: [{op: 'property', holder: silver.holder, property: KEY, value: product.item_key}]};
}

const law = defineWorkingLaw({id: 'lotm.silver-inscription', revision: 1, operations: {
    mark: {roles, settle: args => inscribe(steps.mark, args)},
    bind: {roles, settle: args => inscribe(steps.bind, args)},
}});

export const tingenInscriptionConfig = {
    shared: {quantities: [WORLD_QUANTITIES.stock, WORLD_QUANTITIES.energy],
        properties: [{id: KEY, type: 'label'}, {id: OWNER, type: 'label'}, {id: DESK, type: 'flag'}]},
    host: {laws: [law]},
};

export function startTingenInscription(engine, {id, maker, silver, knife, desk}) {
    const key = engine.world.holders[silver]?.properties[KEY];
    const pending = materialId(key) === materialId(TINGEN_TRIAL_BLANK) ? ['mark', 'bind']
        : materialId(key) === materialId(MARKED_TRIAL_SILVER) ? ['bind'] : [];
    if (!pending.length) throw new Error('Choose a silver blank or an unfinished marked piece.');
    const holders = {maker, silver, knife, desk};
    const bindings = Object.fromEntries(Object.entries(roles).map(([role, kind]) => [role, {kind, id: holders[role]}]));
    const method = {id: pending.length === 2 ? 'lotm.silver-carving' : 'lotm.silver-rework', revision: 1, law: law.ref, roles,
        steps: pending.map(op => ({op, minutes: steps[op].minutes,
            bindings: {maker: 'maker', silver: 'silver', knife: 'knife', desk: 'desk'}}))};
    return startEngineWorking(engine, {law, method, id, bindings});
}

export function checkTingenAmulet(engine, {wearer, amulet, incident}) {
    const actor = engine.world.holders[wearer], silver = engine.world.holders[amulet];
    if (actor?.kind !== 'body') throw new Error('The mishap needs a wearer.');
    const key = silver?.properties[KEY];
    const worn = silver?.properties[OWNER] === wearer && silver.place === actor.place &&
        silver.quantities[TINGEN_SILVER] === 1 && isTingenAmulet(materialId(key)) && boundAmuletMinute(key) !== undefined;
    const worldId = LOTM_IDS.world, clock = engine.world.clock;
    return resolveTingenMishap({
        state: {clock, actors: {player: {worldId}}}, equipment: {player: worn ? {amulet: key} : {}}, incident,
        drawAddress: {root: engine.draws.root, worldId, lifeId: wearer, gameTime: clock, eventId: incident.id},
    });
}
