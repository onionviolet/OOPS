// Capability start after the academy has taught Moonblade and Fang Yuan has
// refined both Gu. RI vol. 1 ch. 23 (food) and ch. 34 (essence and Moonblade).
import {beginContest, defineContestLaw, runContest, stepContest} from '../contest.js';
import {CONTEST_RESOLVERS} from '../contest_resolvers.js';
import {contestBody} from '../contest_bodies.js';
import {GU_CONTEST, GU_ESSENCE, guBridge} from '../contest_packs/gu_world.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld} from '../engine_world.js';
import {guBodyHolder} from '../gu_living_body.js';
import {guCatalogue} from '../gu_catalogue.js';
import {guLivingRows} from '../living_kinds.js';
import {guMethods} from '../gu_working_law.js';
import {runGuStep} from '../gu_working_host.js';
import {WORLD_QUANTITIES} from '../world_quantities.js';

const fang = 'fang_yuan', place = 'academy', rival = 'sparring_partner';
const moon = 'moonlight', worm = 'liquor-worm';
const initial = GU_ESSENCE.id, middle = 'middle_essence';
const poolInitial = 'primeval.r1.initial', poolMiddle = 'primeval.r1.middle';
const guState = 'g.academy', practiceState = 'c.academy';
const diets = {
    [moon]: {stock: 'stock:moon-orchid-petals', amount: 2, duration: guCatalogue[moon].body.interval.days * 1440},
    [worm]: {stock: 'stock:green-bamboo-wine', amount: guCatalogue[worm].body.ration.amount,
        duration: guCatalogue[worm].body.ration.days * 1440},
};
const bodies = guLivingRows(guCatalogue).filter(row => Object.hasOwn(diets, row.id));
const {cost, yield: gained} = guCatalogue[worm].conversion.value;
const blade = guCatalogue[moon].ability.value;
// Compare at equal raw essence: two batches supply the stronger blade. The
// added force sits below Little Light's doubling in the contest calibration.
const academyBlade = {...blade, stageFuel: {...blade.stageFuel, middle: {costFactor: 0.5, magnitudeFactor: 1.5}}};
const refinedCost = academyBlade.cost * academyBlade.stageFuel.middle.costFactor;
const practiceVitality = 100;
const academyDamage = 30; // Authored: an exposed opponent takes a serious cut from an ordinary blade.
// Ch. 35: middle-stage Moonlight breaks the mortal's intercepting forearm.
// Ch. 83/85: timely Jade Skin is expected to stop the cut. Ch. 64/108:
// reinforcement is supported by statements and analogues. Values are authored.
const matchups = [
    {label: 'Mortal · forearm intercept', vitality: 45, guard: 0, bone: 40},
    {label: 'Gu Master · Jade Skin ready', vitality: 100, guard: 45, bone: 40},
    {label: 'Reinforced higher-rank body', vitality: 180, guard: 35, bone: 55},
];
const bleedingPerMinute = 4;
const replayState = 'c.moonblade_injuries';
const config = {packs: ['l.living_body', 'c.contest'], shared: {quantities: [GU_ESSENCE,
    {...GU_ESSENCE, id: middle}, WORLD_QUANTITIES.stock]}};
const read = (engine, id) => engine.world.holders[id];
const reserve = engine => read(engine, fang).quantities;
const fed = (engine, kind) => read(engine, kind).quantities.satiety > 0;
const controlled = (engine, kind) => read(engine, kind).state[guState]?.controller === fang && read(engine, kind).place === read(engine, fang).place;
const specimen = (engine, kind) => ({id: kind, kind, rank: 1, alive: true, fedThrough: fed(engine, kind) ? engine.world.clock : -1});

// The contest consumes the same activation law. This bridge maps the graded
// reserve on the entrant's body to the named pool for that working.
const refinedMethod = guMethods(moon).activate;
refinedMethod.steps[0].options = {ability: academyBlade, pool: poolMiddle, stage: 'middle', rank: 1, source: 'aperture'};
const practiceBridge = method => ({...guBridge(method), effects: rows => rows.filter(row => row.kind === 'damage')
    .map(row => ({verb: 'remove', object: 'vitality', amount: Math.round(row.magnitude * academyDamage)}))});
const refinedBridge = {...practiceBridge(refinedMethod),
    facts: actor => ({reserves: {[actor.id]: {[poolMiddle]: actor.quantities[middle]}}}),
    spent: (actor, facts) => ({[middle]: actor.quantities[middle] - facts.reserves[actor.id][poolMiddle]}),
};
const practiceLaw = defineContestLaw({id: 'c.academy_moonblade', revision: 1, moves: {
    moonblade: {...GU_CONTEST.moves.moonlight_gu, bridge: practiceBridge(guMethods(moon).activate)},
    refined_moonblade: {...GU_CONTEST.moves.moonlight_gu, bridge: refinedBridge},
    practice_strike: GU_CONTEST.moves.fist,
}, resolvers: {
    layers(args) {
        const strike = CONTEST_RESOLVERS.layers(args);
        if (!args.target.profile.forearm || strike.outcome !== 'hit') return strike;
        // The same residual cut drives tissue penetration and pool loss.
        // This authored forearm dial keeps a fractured defender able to flee.
        return {...strike, landed: strike.landed.map(row => ({...row, amount: Math.ceil(row.amount / 2)}))};
    },
}});

function start() {
    return createEngineWorld({...config, holders: [
        {id: place, kind: 'place'},
        contestBody(fang, place, {vitality: 100, stamina: 20, [initial]: 12, [middle]: 0}),
        contestBody(rival, place, {vitality: practiceVitality, stamina: 20}),
        ...bodies.map(row => {
            const body = guBodyHolder(row, {id: row.id, place, satiety: 0});
            body.state[guState] = {controller: fang};
            return body;
        }),
        {id: 'supplies', kind: 'thing', place, quantities: {[diets[moon].stock]: 4, [diets[worm].stock]: 2}},
    ]});
}

function exchange(engine, move, target = {}) {
    const entrants = [
        {id: fang, side: fang, body: fang, speed: 120, profile: {attack: 50, gu: [specimen(engine, moon)]}, moves: [move]},
        {id: rival, side: rival, body: rival, speed: 75, profile: {evasion: 2, ...target}, moves: ['practice_strike']},
    ];
    const record = beginContest(practiceLaw, {id: 'academy_exchange', seed: 2, place, entrants, limits: {landed: 1}}, engine.world);
    if (!target.forearm) return runContest(practiceLaw, record, engine.rules, engine.world);
    // Inspect the first resolved throw, including a fully blocked one. A later
    // counterattack or another paid cast would change the comparison.
    let out = {record, world: engine.world};
    while (!out.record.result && !out.record.log.some(row => row.actor === fang && row.move === move)) {
        out = stepContest(practiceLaw, out.record, engine.rules, out.world);
    }
    return out;
}

function spar(engine, id) {
    const move = id === 'cast-refined' ? 'refined_moonblade' : 'moonblade';
    const out = exchange(engine, move);
    const spent = reserve(engine)[id === 'cast-refined' ? middle : initial] - out.world.holders[fang].quantities[id === 'cast-refined' ? middle : initial];
    const damage = read(engine, rival).quantities.vitality - out.world.holders[rival].quantities.vitality;
    const history = read(engine, fang).state[practiceState] ?? [];
    const result = {refined: id === 'cast-refined', spent, damage};
    return advanceEngineWorld(applyEngineOps({...engine, world: out.world}, [
        {op: 'state', holder: fang, pack: practiceState, value: [...history.slice(-7), result]},
    ], id), engine.world.clock + 1).engine;
}

function compareMatchups(engine) {
    const rows = matchups.flatMap(({label, vitality, guard, bone}) => {
        const layers = guard ? [{id: 'slashing_guard', type: 'slashing', capacity: guard}] : [];
        const prepared = applyEngineOps(engine, [
            {op: 'set', holder: fang, quantity: 'vitality', amount: 100},
            {op: 'set', holder: fang, quantity: initial, amount: blade.cost},
            {op: 'set', holder: fang, quantity: middle, amount: refinedCost},
            {op: 'set', holder: rival, quantity: 'vitality', amount: vitality},
        ], 'comparison:prepare');
        return [['Initial', 'moonblade', initial, academyDamage],
            ['Middle', 'refined_moonblade', middle, academyDamage * academyBlade.stageFuel.middle.magnitudeFactor]]
            .map(([grade, move, pool, force]) => {
                const {record, world} = exchange(prepared, move, {layers, forearm: true});
                const remaining = world.holders[rival].quantities.vitality;
                const hit = record.log.find(row => row.actor === fang && row.move === move);
                const spent = reserve(prepared)[pool] - world.holders[fang].quantities[pool];
                const residual = hit?.outcome === 'hit' ? Math.max(0, force - guard) : 0;
                const fractured = residual >= bone;
                const outcome = fractured ? 'Forearm fracture · rush stopped · can flee'
                    : residual ? 'Flesh cut · standing' : hit?.outcome === 'blocked' ? 'Blocked · no wound' : 'Missed';
                return {label, grade, spent, guard, lost: vitality - remaining, remaining, vitality, outcome,
                    bleeding: fractured, fractured, observed: false};
            });
    });
    return applyEngineOps(engine, [{op: 'state', holder: fang, pack: replayState, value: rows}], 'comparison:record');
}

function followWound(engine, action, rows) {
    const next = rows.map(row => {
        if (!row.fractured) return row;
        if (action === 'stabilize') return {...row, bleeding: false};
        const remaining = row.bleeding ? Math.max(0, row.remaining - bleedingPerMinute) : row.remaining;
        return {...row, remaining, lost: row.vitality - remaining, observed: true};
    });
    return applyEngineOps(engine, [{op: 'state', holder: fang, pack: replayState, value: next}], action);
}

const fedText = (engine, kind) => `${controlled(engine, kind) ? 'Refined · under your control' : 'Outside your control'} · ${fed(engine, kind) ? `${read(engine, kind).quantities.satiety} min of food left` : 'Needs food'}`;
const castResult = row => `${row.refined ? 'Middle-stage' : 'Initial-stage'} Moonblade spent ${row.spent} parts and took ${row.damage} of the partner’s ${practiceVitality} vitality.`;
const stock = (engine, kind) => read(engine, 'supplies').quantities[diets[kind].stock];
function view(engine) {
    const funds = reserve(engine);
    const history = read(engine, fang).state[practiceState] ?? [];
    const actions = [[moon, 'Feed Moonlight Gu', '2 moon orchid petals'], [worm, 'Feed Liquor Worm', '1 jar of green bamboo wine']]
        .map(([kind, label, detail]) => ({id: `feed-${kind}`, label, detail: `Spend ${detail}.`, reason: !controlled(engine, kind) ? 'This Gu is outside your control.' :
            fed(engine, kind) ? 'This Gu has already eaten.' : stock(engine, kind) < diets[kind].amount ? 'You lack its food.' : undefined}));
    actions.push({id: 'refine', label: 'Refine green-copper essence', detail: `Liquor Worm converts ${cost} initial-stage parts into ${gained} middle-stage part. Takes 1 minute.`,
        reason: !controlled(engine, worm) || !fed(engine, worm) ? 'Feed the Liquor Worm in your care first.' : funds[initial] < cost ? 'You lack initial-stage essence.' : undefined});
    for (const [id, key, amount, grade] of [['cast-basic', initial, blade.cost, 'initial'], ['cast-refined', middle, refinedCost, 'middle']]) {
        const rawCost = key === middle ? amount * cost / gained : amount;
        actions.push({id, label: `Spar with ${grade}-stage essence`, detail: `Spend ${amount} ${grade}-stage parts per Moonblade${key === middle ? `, made from ${rawCost} initial-stage parts` : ''}.`,
            reason: !controlled(engine, moon) || !fed(engine, moon) ? 'Feed the Moonlight Gu in your care first.' :
                funds[key] < amount ? `You lack ${grade}-stage essence.` : read(engine, rival).quantities.vitality === 0 || funds.vitality === 0 ? 'The sparring session is over.' : undefined});
    }
    actions.push({id: 'compare', label: 'Test Moonblade against three targets',
        detail: 'Replay the same throw from full vitality with each essence grade. This rehearsal supplies its own essence. Guard and body values are provisional.',
        reason: !controlled(engine, moon) || !fed(engine, moon) ? 'Feed the Moonlight Gu in your care first.' : undefined});
    const rows = read(engine, fang).state[replayState];
    const wound = rows?.find(row => row.fractured);
    if (wound) {
        actions.push({id: 'stabilize', label: 'Stabilize the forearm wound',
            detail: 'Stop further blood loss. The fracture still needs treatment.', reason: wound.bleeding ? undefined : 'Bleeding is already stopped.'});
        actions.push({id: 'observe-wound', label: 'Observe the wound after a minute',
            detail: 'An untreated fracture wound costs 4 vitality from bleeding in this replay.',
            reason: wound.observed ? 'You observed this minute. Replay the matchups to try another path.' : undefined});
    }
    return {facts: [['Moonlight Gu', fedText(engine, moon)], ['Liquor Worm', fedText(engine, worm)],
        ['Food on hand', `${stock(engine, moon)} petals · ${stock(engine, worm)} wine jars`],
        ['Primeval essence', `${funds[initial]} initial-stage · ${funds[middle]} middle-stage`],
        ['Sparring vitality', `${funds.vitality} yours · ${read(engine, rival).quantities.vitality} partner`]], actions,
        result: history.length ? castResult(history.at(-1)) : undefined, history: history.map(castResult),
        comparison: rows && {title: 'Moonblade matchups · forearm contact',
            columns: ['Target', 'Essence', 'Parts', 'Guard', 'Vitality lost', 'Vitality left', 'Outcome'],
            rows: rows.map(row => [row.label, row.grade, row.spent, row.guard, row.lost,
                `${row.remaining} / ${row.vitality}`, row.outcome + (row.fractured ? (row.bleeding ? ' · bleeding' : ' · stabilized') : '')])}};
}

function act(engine, id) {
    const offer = view(engine).actions.find(row => row.id === id);
    if (!offer || offer.reason) throw Error(offer?.reason ?? 'That action is unavailable.');
    if (id === 'stabilize' || id === 'observe-wound') return followWound(engine, id, read(engine, fang).state[replayState]);
    if (id === 'compare') return compareMatchups(engine);
    if (id.startsWith('feed-')) {
        const kind = id.slice(5);
        const diet = diets[kind];
        return applyEngineOps(engine, [
            {op: 'add', holder: 'supplies', quantity: diet.stock, amount: -diet.amount},
            {op: 'set', holder: kind, quantity: 'satiety', amount: diet.duration},
        ], id);
    }
    if (id !== 'refine') return spar(engine, id);
    const before = reserve(engine);
    const result = runGuStep(worm, 'convert', {at: engine.world.clock, specimen: specimen(engine, worm),
        facts: {reserves: {player: {[poolInitial]: before[initial], [poolMiddle]: before[middle]}}}});
    const refined = result.facts.reserves.player;
    return advanceEngineWorld(applyEngineOps(engine, [
        {op: 'set', holder: fang, quantity: initial, amount: refined[poolInitial]},
        {op: 'set', holder: fang, quantity: middle, amount: refined[poolMiddle]},
    ], 'liquor_worm_refines'), engine.world.clock + 1).engine;
}

export const fangLiquorWormRun = {
    title: 'Fang Yuan · Liquor Worm', introduction: 'Academy sparring. Your refined Moonlight Gu and Liquor Worm need food. Prepare their meals, then compare what two grades of essence do in a spar.',
    create: start, restore: saved => restoreEngineWorld(saved, config), view, act,
};
