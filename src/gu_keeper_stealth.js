import {guCatalogue} from './gu_catalogue.js';
import {observeGuCloak, resolveGuCloak} from './gu_concealment.js';
import {resolveGuActivation} from './gu_activation.js';
import {beginGuRefinement, cancelGuRefinement, stepGuRefinement} from './gu_refinement.js';
import {validateGuClaims} from './gu_world_claims.js';

export const keeperStealth = 'book.ri.keeper.stealth_fusion';
export const keeperScaleArmor = 'book.ri.keeper.scale_armor';
export const stoneHollow = `${keeperStealth}.hollow`;
export const farScreen = `${keeperStealth}.screen`;
export const farStoneRun = `${keeperScaleArmor}.far_run`;
export const cloakSettleMinutes = 15;
export const stoneImpact = 3;
const glade = 'book.ri.keeper.hosted_wolf.glade';
const world = 'book.ri.keeper.world';
const key = `${keeperStealth}.work`;
const rockId = `${keeperStealth}.rock`;
const fishId = `${keeperStealth}.fish`;
const scalesId = `${keeperStealth}.scales`;
const armorId = `${keeperScaleArmor}.armor`;
export function controlledScaleArmor(state) {
    const row = read(state);
    return row && specimen(row, armorId);
}
const branches = {
    cloak: {recipe: guCatalogue['stealth-scales'].recipe.value, output: scalesId, minutes: cloakSettleMinutes},
    armor: {recipe: guCatalogue['scale-armor'].recipe.value, output: armorId, minutes: 20},
};
export const armorSettleMinutes = branches.armor.minutes;
const branchOf = job => Object.values(branches).find(branch => branch.recipe.id === job?.recipe?.id);
const fishIdentity = index => index === 0 ? fishId : `${fishId}.${index + 1}`;
export const stealthOperations = ['take_rock', 'bind_rock', 'buy_fish', 'trade_fish', 'test_rock', 'prepare_cloak',
    'finish_cloak', 'cancel_cloak', 'test_scales', 'cross_screen'];
export const scaleArmorOperations = ['prepare_armor', 'finish_armor', 'cancel_armor', 'guard_run'];
export const stealthEffectPack = operation => scaleArmorOperations.includes(operation) ? keeperScaleArmor : keeperStealth;
const done = (state, name) => state.actors.player.completed[`${stealthEffectPack(name)}.${name}`] ?? 0;
const pinned = (record, pack) => record?.extensions?.some(pin => pin.id === pack);
export const stealthPlace = operation => operation === 'take_rock' ? stoneHollow : glade;
const latest = row => row?.world.attempts.at(-1);
const specimen = (row, id) => row?.world.gu.find(gu => gu.id === id && gu.alive);
const fishHeld = row => row?.world.gu.find(gu => gu.kind === 'fish-scale' && gu.alive);

function read(state) {
    const raw = state.worlds[world]?.facts?.[key];
    if (raw === undefined) return null;
    if (typeof raw !== 'string') throw Error('Invalid Fish Scale refinement record.');
    return JSON.parse(raw);
}

export function controlledStealthScales(state) {
    return specimen(read(state), scalesId);
}

function actions(state, row) {
    const job = latest(row);
    const working = job?.status === 'working';
    const rock = specimen(row, rockId);
    const fish = fishHeld(row);
    const cloak = specimen(row, scalesId);
    const armor = specimen(row, armorId);
    const ready = working && state.clock >= row.startedAt + branchOf(job).minutes;
    const available = !fish && !(cloak && armor);
    const rockBound = working && job.ingredients.rock === rockId;
    return {take_rock: !done(state, 'take_rock'), bind_rock: !!rock && !done(state, 'bind_rock'),
        buy_fish: available, trade_fish: available, test_rock: !rockBound && !!rock && done(state, 'bind_rock') === 1,
        prepare_cloak: !working && !cloak && !!rock && !!fish && done(state, 'bind_rock') === 1,
        finish_cloak: ready && job.productId === scalesId, cancel_cloak: working && job.productId === scalesId,
        test_scales: !!cloak, cross_screen: !!cloak,
        prepare_armor: !working && !armor && !!fish, finish_armor: ready && job.productId === armorId,
        cancel_armor: working && job.productId === armorId, guard_run: !!armor};
}

export function stealthFacts(state) {
    return Object.fromEntries(Object.entries(actions(state, read(state)))
        .map(([name, ready]) => [`${stealthEffectPack(name)}.can_${name}`, ready]));
}

export function stealthView(state, record) {
    const row = read(state);
    if (!pinned(record, keeperStealth) || !row) return null;
    const job = latest(row);
    const status = job?.status ?? null;
    return {rock: !!specimen(row, rockId), fish: !!fishHeld(row), controlled: done(state, 'bind_rock') > 0,
        cloak: !!specimen(row, scalesId), armor: !!specimen(row, armorId), armorJob: job?.productId === armorId,
        status, remaining: status === 'working' ? Math.max(0, row.startedAt + branchOf(job).minutes - state.clock) : 0,
        testedRock: row.testedRock, testedScales: row.testedScales, crossed: row.crossed, armorGuarded: !!row.armorGuarded};
}

function validAttempt(job, index, gu, count) {
    const branch = branchOf(job);
    if (!branch || job.id !== `stealth-cloak-${index + 1}` || job.refiner !== 'player' || job.productId !== branch.output ||
        JSON.stringify(job.recipe) !== JSON.stringify(branch.recipe) || !['working', 'cancelled', 'complete'].includes(job.status) ||
        job.cursor !== (job.status === 'complete' ? 2 : 1) || index < count - 1 && job.status === 'working') return false;
    const bindings = Object.entries(job.ingredients ?? {});
    return bindings.length === Object.keys(branch.recipe.ingredients).length && bindings.every(([role, id]) => {
        const specimen = gu.find(gu => gu.id === id);
        return !!specimen && specimen.kind === branch.recipe.ingredients[role] && specimen.holder === 'player' &&
            (job.status !== 'working' || specimen.alive);
    });
}

export function validateStealth(state, record) {
    const row = read(state);
    const armorUsed = scaleArmorOperations.some(name => done(state, name));
    if (!row && !armorUsed && !stealthOperations.some(name => done(state, name))) return;
    if (!row || !pinned(record, keeperStealth) || armorUsed && !pinned(record, keeperScaleArmor)) {
        throw Error('The Fish Scale work needs its hunter and refinement ledger.');
    }
    const {gu, attempts} = validateGuClaims(row.world);
    const fish = gu.filter(entry => entry.kind === 'fish-scale');
    const rock = gu.find(entry => entry.id === rockId);
    const countFish = done(state, 'buy_fish') + done(state, 'trade_fish');
    const finished = attempts.filter(job => job.status === 'complete');
    const consumed = new Set(finished.flatMap(job => Object.values(job.ingredients ?? {})));
    const expectedGu = [rockId, ...fish.map((_, index) => fishIdentity(index)), scalesId, armorId];
    const outcomes = Object.entries(branches).every(([name, branch]) => {
        const jobs = attempts.filter(job => job.productId === branch.output);
        const complete = jobs.filter(job => job.status === 'complete');
        const output = gu.find(entry => entry.id === branch.output);
        return jobs.length === done(state, `prepare_${name}`) &&
            jobs.filter(job => job.status === 'cancelled').length === done(state, `cancel_${name}`) &&
            complete.length === done(state, `finish_${name}`) && complete.length <= 1 && !!output === !!complete.length &&
            (!output || output.kind === branch.recipe.kind && output.rank === branch.recipe.rank && output.alive &&
                output.provenance?.recipe === branch.recipe.id && output.provenance.revision === branch.recipe.revision &&
                JSON.stringify(output.provenance.ingredients) === JSON.stringify(complete[0].ingredients));
    });
    if (!outcomes || done(state, 'take_rock') > 1 || !!rock !== !!done(state, 'take_rock') || done(state, 'bind_rock') > Number(!!rock) ||
        rock && (rock.kind !== 'stealth-rock' || rock.rank !== 1 || rock.origin !== 'take_rock') ||
        fish.length !== countFish || countFish > 2 || fish.filter(entry => entry.alive).length > 1 ||
        fish.some((entry, index) => entry.id !== fishIdentity(index) || entry.rank !== 1 || !['trade_fish', 'buy_fish'].includes(entry.origin)) ||
        fish.filter(entry => entry.origin === 'trade_fish').length !== done(state, 'trade_fish') ||
        consumed.size !== finished.reduce((sum, job) => sum + Object.keys(job.ingredients ?? {}).length, 0) ||
        gu.some(entry => !expectedGu.includes(entry.id) || entry.holder !== 'player' || entry.alive === consumed.has(entry.id) ||
            entry.fate !== (consumed.has(entry.id) ? 'consumed' : undefined)) ||
        attempts.some((job, index) => !validAttempt(job, index, gu, attempts.length)) ||
        (attempts.length === 0 ? row.startedAt !== null : !Number.isSafeInteger(row.startedAt) ||
            row.startedAt < record.initializedAt || row.startedAt > state.clock) ||
        row.testedRock !== (done(state, 'test_rock') > 0) || row.testedRock && !done(state, 'bind_rock') ||
        row.testedScales !== (done(state, 'test_scales') > 0) || row.crossed !== (done(state, 'cross_screen') > 0) ||
        (row.testedScales || row.crossed) && !specimen(row, scalesId) ||
        (row.armorGuarded ?? false) !== (done(state, 'guard_run') > 0) || row.armorGuarded && !specimen(row, armorId)) {
        throw Error('The Fish Scale ledger and its acquisition, refinement or activation receipts disagree.');
    }
}

function guardWithArmor(gu, clock) {
    const ability = guCatalogue['scale-armor'].ability.value;
    const result = resolveGuActivation({stages: [{gu: {...gu, fedThrough: clock}, operator: 'player', ability,
        supply: {pool: 'essence', family: 'primeval', rank: 1, source: 'aperture'}}],
    reserves: {player: {essence: 2}}, day: clock});
    return result.effects.find(effect => effect.kind === 'impact-guard')?.magnitude ?? 0;
}

export function applyStealth(state, record, operation) {
    if (!pinned(record, stealthEffectPack(operation))) throw Error('Take up the hunter’s Fish Scale lesson.');
    const row = read(state) ?? {world: {gu: [], attempts: [], stocks: {player: {}}}, startedAt: null,
        testedRock: false, testedScales: false, crossed: false};
    if (!actions(state, row)[operation]) throw Error('The Fish Scale work is unavailable.');
    const clock = state.clock;
    const job = latest(row);
    if (operation === 'take_rock' || operation === 'buy_fish' || operation === 'trade_fish') {
        const rock = operation === 'take_rock';
        const id = rock ? rockId : fishIdentity(row.world.gu.filter(gu => gu.kind === 'fish-scale').length);
        row.world.gu.push({id, kind: rock ? 'stealth-rock' : 'fish-scale', rank: 1, holder: 'player', alive: true, origin: operation});
    } else if (operation.startsWith('prepare_')) {
        const branch = branches[operation.slice('prepare_'.length)];
        const ingredients = {scales: fishHeld(row).id, ...(branch.output === scalesId && {rock: rockId})};
        const materials = Object.fromEntries(branch.recipe.stages[0].inputs.map(({material, amount}) => [material, amount]));
        const prepared = beginGuRefinement({...row.world, stocks: {player: materials}}, {
            id: `stealth-cloak-${row.world.attempts.length + 1}`, refiner: 'player', recipe: branch.recipe,
            ingredients, productId: branch.output,
        });
        row.world = stepGuRefinement(prepared, prepared.attempts.at(-1).id);
        row.startedAt = clock;
    } else if (operation.startsWith('finish_')) row.world = stepGuRefinement(row.world, job.id);
    else if (operation.startsWith('cancel_')) row.world = cancelGuRefinement(row.world, job.id);
    else if (operation === 'guard_run') {
        if (guardWithArmor(specimen(row, armorId), clock) < stoneImpact) throw Error('The armor could not stop the falling stone.');
        row.armorGuarded = true;
    } else if (['test_rock', 'test_scales', 'cross_screen'].includes(operation)) {
        const testingRock = operation === 'test_rock';
        const gu = specimen(row, testingRock ? rockId : scalesId);
        const cloak = resolveGuCloak({gu, clock, reserve: testingRock ? 1 : 2});
        const observer = {sight: {reach: 1}, scent: {reach: 0}};
        const seen = observeGuCloak({senses: observer, cloak});
        if (testingRock) {
            if (seen?.surfaces.join() !== 'clothing') throw Error('The watcher could not isolate the exposed clothes.');
            row.testedRock = true;
        } else {
            if (seen) throw Error('The watch spotted the cloak.');
            if (operation === 'cross_screen') row.crossed = true;
            else {
                const hound = observeGuCloak({senses: {...observer, scent: {reach: 1}}, cloak});
                if (hound?.channel !== 'scent') throw Error('The hound could not follow the scent.');
                row.testedScales = true;
            }
        }
    }
    state.worlds[world].facts[key] = JSON.stringify(row);
}
