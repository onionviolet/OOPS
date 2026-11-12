// E2: one knowledge record in the engine world, with a believed side and a
// true side. Three consumers settle against the true side: a fixture move law
// (activation), the brewing law and the process law (a made thing).
// Every scene below is a data row list played by one runner; no scene has code
// of its own. Every number is fixture data, a dial with its reason beside it.
import assert from 'node:assert/strict';
import test from 'node:test';

import {beginWorking, defineWorkingLaw, nextWorkingDeadline, restoreWorking, serializeWorking, settleWorking, viewWorking} from '../src/kernel_working.js';
import {defineComposition} from '../src/kernel_compose.js';
import {BREW_LAW, BREW_PUBLISHES, unfinishedBatch} from '../src/brew_law.js';
import {PROCESS_LAW, processMethod} from '../src/process_law.js';
import {advanceEngineWorld, applyEngineOps, createEngineWorld, restoreEngineWorld, serializeEngineWorld} from '../src/engine_world.js';
import {substratePort} from '../src/world_substrate.js';
import {WORLD_QUANTITIES} from '../src/world_quantities.js';
import {KNOWLEDGE_KINDS, KNOWLEDGE_LAW, KNOWLEDGE_PACK, beginRecord, bindRecord, checkMethod, closeMethod, conditionAuthority, defineRecord,
    knowledgeDraw, knowledgeRead, quoteRecord, recordGaps, recordsOf, teachMethod, viewRecord} from '../src/knowledge_record.js';
import {steelPack} from './fixtures/process_craft_packs.js';

// ---------- the world's vocabulary ----------
const level = id => ({id, type: 'level', min: 0, max: 1000});
const config = {packs: ['a.mind', KNOWLEDGE_PACK], shared: {
    quantities: [WORLD_QUANTITIES.vitality, WORLD_QUANTITIES.stock, {id: 'impact', unit: 'force'}, {id: 'coin', unit: 'coin'}, {id: 'asking', unit: 'coin'}],
    properties: ['output', 'capacity', 'absorbs', 'thermalMass', 'hardness', 'toughness'].map(level), effectKinds: [...BREW_PUBLISHES]}};
const place = (id, quantities = {}, properties = {}) => ({id, kind: 'place', quantities, properties});
const mind = (id, at, quantities = {vitality: 100}) => ({id, kind: 'body', place: at, as: ['person', 'mind'], quantities,
    properties: {mind_awake: true, mind_memory: []}});
const core = (id, at, properties) => ({id, kind: 'thing', place: at, as: ['core'], properties});

// ---------- consumer 1: a move law. Gathered charge has to go somewhere. ----
// draw gathers a core's output and leaves half of it as loose strain; fold
// multiplies the charge through a second core and binds the strain, and what
// that core cannot hold turns on the operator; release lets the charge go into
// the ground, and loose strain goes into the operator. `scale` (permille) is
// how hard the operator pushes; a place absorbs a share of what turns back.
const scaled = (n, facts) => Math.floor(n * (facts.scale ?? 1000) / 1000);
const kept = (n, ground) => Math.ceil(n * (1000 - (ground.properties.absorbs ?? 0)) / 1000);
const moveLaw = defineWorkingLaw({id: 'fixture.move', revision: 1, operations: {
    draw: {roles: {operator: 'person', core: 'core'}, minutes: 1, settle({bound, facts}) {
        const n = scaled(bound.core.properties.output, facts);
        return {ok: true, facts: {charge: (facts.charge ?? 0) + n, strain: (facts.strain ?? 0) + Math.ceil(n / 2)}};
    }},
    fold: {roles: {operator: 'person', core: 'core', ground: 'place'}, minutes: 1, settle({bound, facts, options}) {
        const next = (facts.charge ?? 0) * options.times + scaled(options.plus ?? 0, facts), cap = scaled(bound.core.properties.capacity, facts);
        if (next > cap) return {ok: false, reason: 'overload', observed: {over: next - cap},
            costs: [{holder: bound.operator.id, quantity: 'vitality', amount: kept(next - cap, bound.ground)}]};
        return {ok: true, facts: {charge: next, strain: 0}};
    }},
    release: {roles: {operator: 'person', ground: 'place'}, minutes: 1, settle({bound, facts}) {
        const effects = [{op: 'add', holder: bound.ground.id, quantity: 'impact', amount: facts.charge ?? 0}];
        const harm = kept(facts.strain ?? 0, bound.ground);
        if (harm > 0) effects.push({op: 'add', holder: bound.operator.id, quantity: 'vitality', amount: -harm});
        return {ok: true, facts: {charge: 0, strain: 0}, effects};
    }},
    // A second everyday act for the rumour scene: goods sent to a market sell at its asking price.
    sell: {roles: {seller: 'person', market: 'place'}, minutes: 30, settle({bound, options}) {
        return {ok: true, effects: [{op: 'add', holder: bound.seller.id, quantity: 'stock:grain', amount: -options.units},
            {op: 'add', holder: bound.seller.id, quantity: 'coin', amount: options.units * bound.market.quantities.asking}]};
    }},
}});
const same = roles => Object.fromEntries(Object.keys(roles).map(k => [k, k]));
const part = (law, id, roles, steps, conditions) => ({law, method: {id, revision: 1, law: law.ref, roles, steps}, ...(conditions ? {conditions} : {})});
const P = {operator: 'person'}, PC = {...P, core: 'core'}, PCG = {...PC, ground: 'place'}, PG = {...P, ground: 'place'}, SM = {seller: 'person', market: 'place'};
const fold = (id, options, conditions) => part(moveLaw, id, PCG, [{op: 'fold', bindings: same(PCG), options}], conditions);
// Closing a condition costs the closer attention for as long as it is held (GKM250).
const attention = amount => ({costs: [{quantity: 'attention', amount}], minutes: 5});

// ---------- consumer 2: a potion formula on the brewing law ------------------
const VL = {vessel: 'vessel'}, BASE = {vessel: 'vessel', herb: 'lot', salt: 'lot'};
const react = (id, reaction) => part(BREW_LAW, id, VL, [{op: 'react', bindings: same(VL), minutes: 5, options: {reactions: [reaction]}}]);
const pour = (id, doses) => part(BREW_LAW, id, VL, [{op: 'divide', bindings: same(VL), minutes: 1, options: {doses}}]);

// ---------- consumer 3: a blade on the process law ---------------------------
const S = steelPack.steps;
function stage(id, step, finish = false) {
    const method = processMethod({id, rows: steelPack.rows, projection: steelPack.projection, steps: [step]});
    method.steps[0].options.finish = finish; // the piece's properties land once, when the last stage ends
    return {law: PROCESS_LAW, method};
}
const BLADE = {piece: 'piece', forge: 'medium', hammer: 'tool', water: 'medium', oven: 'medium'};
const slot = (name, needs) => ({name, needs, bindings: same(needs), facts: 'shared'});

const book = {
    compositions: {
        'move.tally': defineComposition({id: 'move.tally', revision: 1, roles: {operator: 'person', a: 'core', b: 'core', ground: 'place'}, slots: [
            {name: 'gather', needs: PC, bindings: {operator: 'operator', core: 'a'}, facts: 'shared'},
            {name: 'join', needs: PCG, bindings: {operator: 'operator', core: 'b', ground: 'ground'}, facts: 'shared'},
            {name: 'release', needs: PG, bindings: {operator: 'operator', ground: 'ground'}, facts: 'shared'}]}),
        'trade.consign': defineComposition({id: 'trade.consign', revision: 1, roles: SM, slots: [slot('sell', SM)]}),
        'potion.calm': defineComposition({id: 'potion.calm', revision: 1, roles: BASE, slots: [slot('base', BASE), slot('bind', VL), slot('pour', VL)]}),
        'blade.plain': defineComposition({id: 'blade.plain', revision: 1, roles: BLADE, slots: [slot('heat', {piece: 'piece', forge: 'medium'}),
            slot('forge', {piece: 'piece', forge: 'medium', hammer: 'tool'}), slot('quench', {piece: 'piece', water: 'medium'}), slot('temper', {piece: 'piece', oven: 'medium'})]}),
    },
    fillers: {
        'gather.plain': part(moveLaw, 'gather.plain', PC, [{op: 'draw', bindings: same(PC)}]),
        // The disciple's own way to gather: a spoken trigger and a feeling let go.
        // The trigger can be done without, at a steep price in essence.
        'gather.spoken': part(moveLaw, 'gather.spoken', PC, [{op: 'draw', bindings: same(PC)}], [
            {id: 'spoken-trigger', kind: 'utterance', role: 'operator', deny: attention(3), forgo: {costs: [{quantity: 'essence', amount: 40}]}},
            {id: 'feeling-released', kind: 'state', role: 'operator', deny: attention(6)}]),
        'join.official': fold('join.official', {times: 8}),            // 8 x 8 = 64, under the core's 70
        'join.false': fold('join.false', {times: 11}),                 // 88: the wrong sum, 18 over
        'join.annotated': fold('join.annotated', {times: 8, plus: 6}), // a margin note fills the core to 70
        // Works like the official step, with a mark its author can close cheaply.
        'join.marked': fold('join.marked', {times: 8}, [{id: 'maker-mark', kind: 'state', role: 'operator',
            deny: attention(1), lapse: {costs: [{quantity: 'vitality', amount: 30}]}}]),
        'release.plain': part(moveLaw, 'release.plain', PG, [{op: 'release', bindings: same(PG)}]),
        'sell.grain': part(moveLaw, 'sell.grain', SM, [{op: 'sell', bindings: same(SM), options: {units: 10}}]),
        'base.both': part(BREW_LAW, 'base.both', BASE, [{op: 'admit', bindings: {vessel: 'vessel', lot: 'herb'}}, {op: 'admit', bindings: {vessel: 'vessel', lot: 'salt'}}]),
        'bind.true': react('bind.true', {id: 'xy', reactants: {x: 1, y: 1}, products: {z: 2}}),
        'bind.wrong': react('bind.wrong', {id: 'xx', reactants: {x: 2}, products: {w: 2}}), // the herb alone, turned to dross
        'pour.two': pour('pour.two', 2),
        'pour.lost': pour('pour.lost', 0), // a copy whose dose count was lost
        'heat.forge': stage('heat.forge', S.heat), 'forge.hammer': stage('forge.hammer', S.forge), 'quench.water': stage('quench.water', S.quench),
        'temper.full': stage('temper.full', S.temper, true),                  // forty minutes in the low oven
        'temper.brief': stage('temper.brief', {...S.temper, minutes: 4}, true), // a copy that lost a digit
    },
};
const conditionOf = id => Object.values(book.fillers).flatMap(filler => filler.conditions ?? []).find(row => row.id === id);

// Prices of knowing. Thinking costs mental effort and an hour and misses three
// times in ten; a trial costs a little essence on top of what the trial itself
// does; a second copy costs a favour; watching costs an afternoon; going to see
// costs the walk.
const routes = {
    think: {id: 'think', kind: 'dry', costs: [{quantity: 'mental', amount: 12}], minutes: 60, missPermille: 300},
    weigh: {id: 'weigh', kind: 'trial', costs: [{quantity: 'essence', amount: 2}], minutes: 5, missPermille: 0},
    ask: {id: 'ask', kind: 'second', costs: [{quantity: 'favour', amount: 1}], minutes: 30, missPermille: 100},
    watch: {id: 'watch', kind: 'watch', costs: [{quantity: 'attention', amount: 4}], minutes: 10, missPermille: 0},
    visit: {id: 'visit', kind: 'look', costs: [{quantity: 'stamina', amount: 5}], minutes: 90, missPermille: 0},
};
const lessons = {drill: {id: 'drill', minutes: 30, costs: [{quantity: 'attention', amount: 2}]}};

// ---------- the runner: one host for every scene -----------------------------
// mode 'jump' goes straight to each step's minute, 'minute' walks there a minute
// at a time, 'restore' saves and reloads the world and every working after
// every change.
function play(scene, mode = 'jump') {
    let engine = createEngineWorld({...config, holders: scene.holders});
    const things = scene.things ?? {}, jobs = [], uses = {}, costs = [], declined = [], quotes = {};
    const reader = () => { const port = substratePort(engine.world); return ref => things[ref.id] ? {...things[ref.id], ...(port(ref) ?? {})} : port(ref); };
    const reload = () => {
        if (mode !== 'restore') return;
        engine = restoreEngineWorld(JSON.parse(JSON.stringify(serializeEngineWorld(engine))), config);
        for (const job of jobs) job.working = JSON.parse(JSON.stringify(serializeWorking(job.working)));
    };
    const advance = at => {
        if (mode === 'minute') for (let c = engine.world.clock + 1; c <= at; c += 1) engine = advanceEngineWorld(engine, c).engine;
        else engine = advanceEngineWorld(engine, at).engine;
        reload();
    };
    const land = (ops, cause) => { engine = applyEngineOps(engine, ops, cause); reload(); };
    const evidenceOf = job => Object.fromEntries(Object.entries(job.evidence ?? {}).map(([id, {use, ...row}]) =>
        [id, use ? {...row, working: uses[use].job.working, promise: uses[use].promise} : row]));
    const pump = to => {
        for (;;) {
            const job = jobs.filter(j => j.working.status === 'running' && nextWorkingDeadline(j.working) <= to)
                .sort((a, b) => nextWorkingDeadline(a.working) - nextWorkingDeadline(b.working))[0];
            if (!job) break;
            if (nextWorkingDeadline(job.working) > engine.world.clock) advance(nextWorkingDeadline(job.working));
            // A use binds the record's true side as the world holds it now; settlement never reads the believed side.
            const bound = job.record ? bindRecord(book, recordsOf(engine.world, job.by)[job.record], 'true') : {law: KNOWLEDGE_LAW};
            const ports = job.record ? {read: reader(), authority: conditionAuthority(engine.world, bound.conditions, {forgo: job.forgo})}
                : {read: knowledgeRead(engine.world, {book, read: reader(), evidence: evidenceOf(job)})};
            const settled = settleWorking(bound.law, restoreWorking(bound.law, job.working), {now: engine.world.clock, ports, maxSteps: 1});
            job.working = settled.record;
            for (const row of job.working.receipts.at(-1).truth.costs ?? []) costs.push({working: job.working.id, ...row});
            // The brewing law also asks its stock owner to debit a lot; that is not a world op and waits for that owner.
            land(settled.effects.map(row => row.effect).filter(effect => effect.op !== 'debit'), job.working.id);
        }
        if (to > engine.world.clock) advance(to);
    };
    const m = id => ({kind: 'mind', id});
    const know = (row, method, bindings, extra = {}) => jobs.push({...extra, working: beginWorking(KNOWLEDGE_LAW, method, {id: row.id, bindings, at: row.at})});
    for (const row of scene.timeline) {
        pump(row.at);
        if (row.act === 'learn') land([{op: 'publish', kind: KNOWLEDGE_KINDS.learn, place: engine.world.holders[row.to].place, by: row.by ?? row.to,
            detail: {knowledge: {to: row.to, record: row.record}}}], row.id);
        // The mind owner's own effect: a memory is taken (mind.js, effect.transform.memory).
        else if (row.act === 'forget') land([{op: 'publish', kind: 'effect.transform.memory', place: engine.world.holders[row.to].place, by: row.by,
            detail: {parts: {time: 'instant'}, application: {targets: [row.to], mind: {faculty: 'memory', record: row.record}}}}], row.id);
        else if (row.act === 'teach') know(row, teachMethod(lessons[row.lesson], row.what), {teacher: m(row.by), student: m(row.to)});
        else if (row.act === 'close') know(row, closeMethod(conditionOf(row.condition)), {closer: m(row.by), target: m(row.target)});
        else if (row.act === 'check') know(row, checkMethod(routes[row.route], {record: row.record, seed: row.seed}),
            {checker: m(row.by), evidence: {kind: 'evidence', id: `${row.id}.evidence`}},
            {evidence: {[`${row.id}.evidence`]: {...row.evidence, holder: row.by, record: row.record}}});
        else {
            // A holder acts on the believed side: he takes the first option whose own quote holds.
            const asked = row.options.map(option => ({...option, quote: quoteRecord(book, engine.world, row.by, option.record,
                {id: row.id, bindings: row.bindings, facts: row.facts, read: reader(), forgo: option.forgo})}));
            quotes[row.id] = asked.map(({record, quote}) => ({record, ok: quote.ok, reason: quote.reason ?? null}));
            const chosen = asked.find(option => option.quote.ok);
            if (!chosen) { declined.push(row.id); continue; }
            const job = {by: row.by, record: chosen.record, forgo: chosen.forgo,
                working: beginRecord(book, engine.world, row.by, chosen.record, {id: row.id, bindings: row.bindings, facts: row.facts}).working};
            jobs.push(job);
            uses[row.id] = {job, promise: chosen.quote};
        }
        pump(row.at);
    }
    pump(scene.until);
    const world = engine.world, workings = Object.fromEntries(jobs.map(job => [job.working.id, job.working]));
    return {world, workings, uses, costs, declined, quotes, saved: serializeEngineWorld(engine),
        amount: (holder, quantity) => world.holders[holder].quantities[quantity],
        record: (holder, id) => recordsOf(world, holder)[id]};
}
const paid = (run, working) => run.costs.filter(row => row.working === working).map(({working: _, ...row}) => row);

// ---------- scene data --------------------------------------------------------
const official = {gather: 'gather.plain', join: 'join.official', release: 'release.plain'};
const move = (id, fillers, extra = {}) => ({id, subject: {kind: 'composition', id: 'move.tally'}, true: {fillers}, ...extra});
const OWN = move('own', {...official, gather: 'gather.spoken'},
    {believed: {fillers: {...official, gather: 'gather.spoken'}, conditions: ['spoken-trigger', 'feeling-released']}});
const tally = (ground = 'field', operator = 'disciple') => ({operator: {kind: 'person', id: operator}, a: {kind: 'core', id: 'core.a'},
    b: {kind: 'core', id: 'core.b'}, ground: {kind: 'place', id: ground}});
const yard = (at = 'field') => [place('field', {impact: 0}, {absorbs: 0}), place('cell', {impact: 0}, {absorbs: 800}), place('cave', {impact: 0}, {absorbs: 0}),
    mind('disciple', at), mind('teacher', 'field'), mind('peer', at), mind('author', 'field'),
    core('core.a', at, {output: 8}), core('core.b', at, {capacity: 70})];
const learn = (to, record, at = 0) => ({at, id: `learn.${to}.${record.id}`, act: 'learn', to, record});
const strike = (id, at, records, extra = {}) => ({at, id, act: 'use', by: 'disciple', bindings: tally(), options: records.map(record => ({record})), ...extra});

// GKM247, GKM249. The teacher holds the real move, a forgery he wrote himself
// and what he has seen of the disciple's own move. He drills the forgery into
// the disciple as the real one, then under pressure closes the spoken trigger.
// `prepared` rows are what a careful disciple adds before that day.
const falseMove = (prepared = []) => ({holders: yard(), until: 130, timeline: [
    learn('disciple', OWN), learn('teacher', move('tally', official)),
    learn('teacher', move('tally.forged', {...official, join: 'join.false'}, {source: {kind: 'inference'}})),
    learn('teacher', {...OWN, id: 'pupil.move', source: {kind: 'observation', by: 'disciple'}}),
    {at: 0, id: 'lesson', act: 'teach', by: 'teacher', to: 'disciple', lesson: 'drill', what: {record: 'tally.forged', cover: 'tally', as: 'taught'}},
    ...prepared,
    {at: 110, id: 'press', act: 'close', by: 'teacher', target: 'disciple', condition: 'spoken-trigger'},
    {at: 111, id: 'strike', act: 'use', by: 'disciple', bindings: tally(),
        options: [{record: 'own'}, {record: 'taught'}, {record: 'own', forgo: ['spoken-trigger']}]},
]});
const thinks = (seed = 0) => [{at: 40, id: 'think', act: 'check', by: 'disciple', record: 'taught', route: 'think', seed, evidence: {kind: 'dry', scene: {bindings: tally()}}}];
// The draw a check makes for one thing it saw: its address is the seed, the working's step and what was seen.
const drawOf = (seed, check, slot, kind, condition = '') => knowledgeDraw([seed, `${check}/0`, slot, kind, condition].join('/'));
const seedFor = (hit, miss, ...seen) => Array.from({length: 200}, (_, seed) => seed).find(seed => (drawOf(seed, ...seen) >= miss) === hit);
const drawFor = seed => drawOf(seed, 'think', 'join', 'step');
const seedWhere = hit => seedFor(hit, routes.think.missPermille, 'think', 'join', 'step');

const scenes = {
    'false move, trusted': falseMove(),
    'false move, checked': falseMove(thinks(seedWhere(true))),
    'false move, check missed': falseMove(thinks(seedWhere(false))),
    // A quarter push in a warded cell: the backlash is real and small.
    'small trial in a safe place': {holders: yard('cell'), until: 80, timeline: [
        learn('teacher', move('tally', official)), learn('teacher', move('tally.forged', {...official, join: 'join.false'})),
        {at: 0, id: 'lesson', act: 'teach', by: 'teacher', to: 'disciple', lesson: 'drill', what: {record: 'tally.forged', cover: 'tally', as: 'taught'}},
        {at: 40, id: 'trial', act: 'use', by: 'disciple', bindings: tally('cell'), facts: {scale: 250}, options: [{record: 'taught'}]},
        {at: 50, id: 'weigh', act: 'check', by: 'disciple', record: 'taught', route: 'weigh', evidence: {kind: 'trial', use: 'trial'}},
        {at: 60, id: 'again', act: 'use', by: 'disciple', bindings: tally('cell'), options: [{record: 'taught'}]},
    ]},
    // A second source, a copy from the same forger, and watching the teacher use the real thing.
    'second source and watching': {holders: yard(), until: 200, timeline: [
        learn('teacher', move('tally', official)), learn('teacher', move('tally.forged', {...official, join: 'join.false'})),
        learn('peer', move('peer-copy', official)),
        {at: 0, id: 'lesson', act: 'teach', by: 'teacher', to: 'disciple', lesson: 'drill', what: {record: 'tally.forged', cover: 'tally', as: 'taught'}},
        {at: 30, id: 'lesson2', act: 'teach', by: 'teacher', to: 'author', lesson: 'drill', what: {record: 'tally.forged', cover: 'tally', as: 'sibling-copy'}},
        {at: 60, id: 'ask.sibling', act: 'check', by: 'disciple', record: 'taught', route: 'ask', evidence: {kind: 'second', other: {holder: 'author', record: 'sibling-copy'}}},
        {at: 100, id: 'ask.peer', act: 'check', by: 'disciple', record: 'taught', route: 'ask', seed: seedFor(true, 100, 'ask.peer', 'join', 'differs'), evidence: {kind: 'second', other: {holder: 'peer', record: 'peer-copy'}}},
        {at: 140, id: 'demo', act: 'use', by: 'teacher', bindings: tally('field', 'teacher'), options: [{record: 'tally'}]},
        {at: 150, id: 'watch', act: 'check', by: 'disciple', record: 'taught', route: 'watch', evidence: {kind: 'watch', use: 'demo', other: {holder: 'teacher', record: 'tally'}}},
    ]},
    // Better than the official one: a margin note the reader takes for the plain method.
    // Handed on as it is, the note travels; retold from understanding, it is lost.
    'annotated recipe': {holders: yard(), until: 120, timeline: [
        learn('disciple', move('annotated', {...official, join: 'join.annotated'}, {believed: {fillers: official}, source: {kind: 'instruction', from: 'manual.margin'}})),
        strike('use', 1, ['annotated']),
        {at: 10, id: 'retell', act: 'teach', by: 'disciple', to: 'peer', lesson: 'drill', what: {record: 'annotated', side: 'believed', as: 'retold'}},
        {at: 10, id: 'hand-on', act: 'teach', by: 'disciple', to: 'peer', lesson: 'drill', what: {record: 'annotated', as: 'copied'}},
        {at: 50, id: 'peer.retold', act: 'use', by: 'peer', bindings: tally('field', 'peer'), options: [{record: 'retold'}]},
        {at: 60, id: 'peer.copied', act: 'use', by: 'peer', bindings: tally('field', 'peer'), options: [{record: 'copied'}]},
    ]},
    // A fragment with no join, used in a cave a hermit said swallows what turns back (it does not).
    'fragment and a rumour about a place': {holders: yard(), until: 200, timeline: [
        learn('disciple', move('fragment', {gather: 'gather.plain', release: 'release.plain'}, {source: {kind: 'instruction', from: 'manual.torn'}})),
        learn('disciple', {id: 'cave.ward', subject: {kind: 'fact', id: 'cave.absorbs'}, true: {holder: 'cave', property: 'absorbs'},
            believed: {value: 1000}, source: {kind: 'instruction', by: 'hermit'}}),
        {at: 5, id: 'use', act: 'use', by: 'disciple', bindings: tally('cave'), options: [{record: 'fragment'}]},
        {at: 20, id: 'visit', act: 'check', by: 'disciple', record: 'cave.ward', route: 'visit', evidence: {kind: 'look'}},
        {at: 120, id: 'later', act: 'use', by: 'disciple', bindings: tally('cave'), options: [{record: 'fragment'}]},
    ]},
    // Works until its author closes the mark, for one point of attention.
    backdoored: (knowing = false) => ({holders: yard(), until: 100, timeline: [
        learn('author', move('tally', official)),
        learn('author', move('gift.made', {...official, join: 'join.marked'}, {believed: {fillers: {...official, join: 'join.marked'}, conditions: ['maker-mark']}})),
        {at: 0, id: 'gift', act: 'teach', by: 'author', to: 'disciple', lesson: 'drill', what: {record: 'gift.made', cover: 'tally', as: 'gift'}},
        ...(knowing ? [{at: 31, id: 'think', act: 'check', by: 'disciple', record: 'gift', route: 'think', seed: seedFor(true, 300, 'think', 'join', 'condition', 'maker-mark'),
            evidence: {kind: 'dry', scene: {bindings: tally()}}}] : []),
        strike('first', 92, ['gift']),
        // The second use begins at minute 95; its author closes the mark at 96; the join is due at 97.
        strike('second', 95, ['gift']),
        {at: 96, id: 'spring', act: 'close', by: 'author', target: 'disciple', condition: 'maker-mark'},
        strike('third', 98, ['gift']),
    ]}),
    // The last step is kept back and the scroll is presented as whole; a second scroll supplies it.
    'withheld last step': {holders: yard(), until: 100, timeline: [
        learn('teacher', move('tally', official)),
        {at: 0, id: 'first-scroll', act: 'teach', by: 'teacher', to: 'disciple', lesson: 'drill', what: {record: 'tally', cover: 'tally', slots: ['gather', 'join'], as: 'scroll'}},
        strike('held', 40, ['scroll']),
        learn('disciple', move('scroll', {release: 'release.plain'}, {source: {kind: 'instruction', from: 'second-scroll'}}), 50),
        strike('whole', 60, ['scroll']),
    ]},
    // A peddler who knows the far market asks 12 a measure says 30; the merchant sends ten measures on that word.
    'rumour about a price': {until: 400, holders: [place('town'), place('far-market', {asking: 12}),
        mind('merchant', 'town', {vitality: 100, coin: 0, 'stock:grain': 40}), mind('peddler', 'town'), mind('carter', 'town')],
    timeline: [
        learn('merchant', {id: 'consign', subject: {kind: 'composition', id: 'trade.consign'}, true: {fillers: {sell: 'sell.grain'}}}),
        learn('peddler', {id: 'far-price', subject: {kind: 'fact', id: 'far-market.asking'}, true: {holder: 'far-market', quantity: 'asking'}, believed: {value: 12}}),
        learn('carter', {id: 'far-price', subject: {kind: 'fact', id: 'far-market.asking'}, true: {holder: 'far-market', quantity: 'asking'}, believed: {value: 12}}),
        {at: 0, id: 'unknown', act: 'use', by: 'merchant', bindings: {seller: {kind: 'person', id: 'merchant'}, market: {kind: 'place', id: 'far-market'}}, options: [{record: 'consign'}]},
        {at: 1, id: 'gossip', act: 'teach', by: 'peddler', to: 'merchant', lesson: 'drill', what: {record: 'far-price', say: 30}},
        {at: 40, id: 'send', act: 'use', by: 'merchant', bindings: {seller: {kind: 'person', id: 'merchant'}, market: {kind: 'place', id: 'far-market'}}, options: [{record: 'consign'}]},
        {at: 80, id: 'ask', act: 'check', by: 'merchant', record: 'far-price', route: 'ask', seed: seedFor(true, 100, 'ask', '', 'differs'), evidence: {kind: 'second', other: {holder: 'carter', record: 'far-price'}}},
        {at: 120, id: 'visit', act: 'check', by: 'merchant', record: 'far-price', route: 'visit', evidence: {kind: 'look'}},
        {at: 220, id: 'send-again', act: 'use', by: 'merchant', bindings: {seller: {kind: 'person', id: 'merchant'}, market: {kind: 'place', id: 'far-market'}}, options: [{record: 'consign'}]},
    ]},
    // A copied formula with a wrong binding step, taken for the right one; then a torn copy that cannot be poured.
    'potion with a wrong step': {until: 100, holders: [place('workroom'), mind('brewer', 'workroom')],
        things: {cauldron: {kind: 'vessel', id: 'cauldron', place: 'workroom', retainPermille: 0, closure: 'open'},
            'lot.herb': {kind: 'lot', id: 'lot.herb', material: 'herb', amount: 1000, properties: {x: 1000}},
            'lot.salt': {kind: 'lot', id: 'lot.salt', material: 'salt', amount: 1000, properties: {y: 1000}}},
        timeline: (brew => [
            learn('brewer', {id: 'calm', subject: {kind: 'composition', id: 'potion.calm'}, true: {fillers: {base: 'base.both', bind: 'bind.wrong', pour: 'pour.two'}},
                believed: {fillers: {base: 'base.both', bind: 'bind.true', pour: 'pour.two'}}, source: {kind: 'instruction', from: 'copied-formula'}}),
            learn('brewer', {id: 'torn', subject: {kind: 'composition', id: 'potion.calm'}, true: {fillers: {base: 'base.both', bind: 'bind.true', pour: 'pour.lost'}},
                believed: {fillers: {base: 'base.both', bind: 'bind.true', pour: 'pour.two'}}, source: {kind: 'instruction', from: 'torn-formula'}}),
            brew('batch', 1, 'calm'),
            {at: 10, id: 'taste', act: 'check', by: 'brewer', record: 'calm', route: 'weigh', evidence: {kind: 'trial', use: 'batch'}},
            brew('batch2', 20, 'calm'), brew('stuck', 30, 'torn'),
            {at: 40, id: 'reread', act: 'check', by: 'brewer', record: 'torn', route: 'weigh', evidence: {kind: 'trial', use: 'stuck'}},
            brew('stuck2', 50, 'torn'),
        ])((id, at, record) => ({at, id, act: 'use', by: 'brewer', options: [{record}],
            bindings: {vessel: {kind: 'vessel', id: 'cauldron'}, herb: {kind: 'lot', id: 'lot.herb'}, salt: {kind: 'lot', id: 'lot.salt'}}}))},
    // A blade made from a blueprint whose tempering time lost a digit.
    'blade from a miscopied blueprint': {until: 100, holders: [place('workshop'), mind('smith', 'workshop'),
        {id: 'sample', kind: 'thing', place: 'workshop', as: ['piece'], properties: {thermalMass: 1}}],
    things: {sample: steelPack.piece, forge: steelPack.media.forge, water: steelPack.media.water, oven: steelPack.media.oven, hammer: steelPack.tools.hammer},
    timeline: [
        learn('smith', {id: 'blueprint', subject: {kind: 'composition', id: 'blade.plain'},
            true: {fillers: {heat: 'heat.forge', forge: 'forge.hammer', quench: 'quench.water', temper: 'temper.brief'}},
            believed: {fillers: {heat: 'heat.forge', forge: 'forge.hammer', quench: 'quench.water', temper: 'temper.full'}}, source: {kind: 'instruction', from: 'copied-blueprint'}}),
        {at: 1, id: 'make', act: 'use', by: 'smith', options: [{record: 'blueprint'}], bindings: {piece: {kind: 'piece', id: 'sample'},
            forge: {kind: 'medium', id: 'forge'}, hammer: {kind: 'tool', id: 'hammer'}, water: {kind: 'medium', id: 'water'}, oven: {kind: 'medium', id: 'oven'}}},
        {at: 70, id: 'test-edge', act: 'check', by: 'smith', record: 'blueprint', route: 'weigh', evidence: {kind: 'trial', use: 'make'}},
    ]},
    // The mind owner takes the memory; the record goes with it.
    'a memory taken': {holders: yard(), until: 20, timeline: [
        learn('disciple', move('plain', official)), strike('before', 1, ['plain']),
        {at: 10, id: 'taken', act: 'forget', to: 'disciple', by: 'teacher', record: 'plain'},
        strike('after', 11, ['plain']),
    ]},
};
const sceneOf = name => typeof scenes[name] === 'function' ? scenes[name]() : scenes[name];
const status = (run, id) => run.workings[id].status;
const effectsOf = working => working.receipts.flatMap(row => row.truth.effects);

test('the taught false move: the trusting disciple takes the backlash, the one who checked first does not', () => {
    const trusted = play(scenes['false move, trusted']);
    // One record, two sides, with where it came from.
    const taught = trusted.record('disciple', 'taught');
    assert.deepEqual([taught.true.fillers.join, taught.believed.fillers.join], ['join.false', 'join.official']);
    assert.deepEqual(taught.source, {by: 'teacher', kind: 'instruction', from: 'tally.forged', at: 30});
    assert.deepEqual(trusted.world.holders.disciple.properties.mind_memory, ['own', 'taught'], 'the mind owner holds the record ids');
    // The teacher pays to teach and to close the trigger he has seen (GKM250).
    assert.deepEqual(paid(trusted, 'lesson'), [{holder: 'teacher', quantity: 'attention', amount: 2}]);
    assert.deepEqual(paid(trusted, 'press'), [{holder: 'teacher', quantity: 'attention', amount: 3}]);
    assert.deepEqual(trusted.world.laws, [], 'the closure lapsed with its five minutes');
    // His own move is closed and he knows it; the taught one looks sound to him; it fails on its second step.
    assert.deepEqual(trusted.quotes.strike, [{record: 'own', ok: false, reason: 'condition-denied'}, {record: 'taught', ok: true, reason: null},
        {record: 'own', ok: true, reason: null}]);
    assert.equal(trusted.uses.strike.job.record, 'taught');
    assert.equal(trusted.uses.strike.promise.effects[0].amount, 64, 'what he was shown came from the believed side');
    assert.deepEqual(trusted.workings.strike.receipts.map(r => [r.op, r.at, r.ok]), [['gather/draw', 112, true], ['join/fold', 113, false]]);
    assert.deepEqual(paid(trusted, 'strike'), [{holder: 'disciple', quantity: 'vitality', amount: 18}]);
    assert.equal(trusted.amount('field', 'impact'), 0);
    assert.deepEqual(viewWorking(trusted.workings.strike).steps[1].observed, {over: 18}, 'he sees what the failed step showed, not the record');

    // The same day with one more row: an hour of thought beforehand.
    const checked = play(scenes['false move, checked']);
    assert.deepEqual(paid(checked, 'think'), [{holder: 'disciple', quantity: 'mental', amount: 12}]);
    assert.deepEqual(checked.record('disciple', 'taught').checks, [{id: 'think/0', route: 'think', kind: 'dry', at: 100,
        found: [{slot: 'join', kind: 'step', is: 'join.false', reason: 'overload'}]}]);
    assert.equal(checked.record('disciple', 'taught').believed.fillers.join, 'join.false', 'belief moved to the truth');
    assert.deepEqual(checked.quotes.strike.map(q => q.ok), [false, false, true]);
    assert.deepEqual([checked.uses.strike.job.record, checked.uses.strike.job.forgo, status(checked, 'strike')], ['own', ['spoken-trigger'], 'complete']);
    assert.deepEqual(paid(checked, 'strike'), [{holder: 'disciple', quantity: 'essence', amount: 40}], 'he pays to work without the trigger, and nothing turns back');
    assert.equal(checked.amount('field', 'impact'), 64);

    // Thinking misses three times in ten. A miss costs the same and leaves the belief where it was.
    const missed = play(scenes['false move, check missed']);
    assert.ok(drawFor(seedWhere(false)) < 300 && drawFor(seedWhere(true)) >= 300);
    assert.deepEqual(paid(missed, 'think'), [{holder: 'disciple', quantity: 'mental', amount: 12}]);
    assert.deepEqual([missed.record('disciple', 'taught').checks[0].found, missed.workings.think.facts.missed.length], [[], 1]);
    assert.deepEqual(viewWorking(missed.workings.think).steps[0].observed, {found: []}, 'the holder sees a clean result');
    assert.deepEqual(paid(missed, 'strike'), [{holder: 'disciple', quantity: 'vitality', amount: 18}]);
});

test('a quote comes from the believed side and cannot show what the true side would do', () => {
    const run = play(scenes['false move, trusted']);
    const reader = substratePort(run.world), read = ref => reader(ref);
    const quote = quoteRecord(book, run.world, 'disciple', 'taught', {id: 'q', bindings: tally(), read});
    assert.deepEqual([quote.ok, quote.effects[0].amount, quote.costs], [true, 64, []]);
    // The truth side knows better; it is read by a check, at a price.
    assert.deepEqual(recordGaps(book, run.world, run.record('disciple', 'taught')), [{slot: 'join', kind: 'step', is: 'join.false'}]);
    assert.equal(quote.steps.some(step => step.op.startsWith('join/') && !step.ok), false);
    assert.deepEqual(Object.keys(viewRecord(run.record('disciple', 'taught'))), ['id', 'subject', 'believed', 'source', 'doubts', 'checks']);
    // Someone who holds no such record is told only that.
    assert.deepEqual(quoteRecord(book, run.world, 'peer', 'taught', {id: 'q', bindings: tally(), read}), {ok: false, reason: 'record-unknown'});
    assert.throws(() => beginRecord(book, run.world, 'peer', 'taught', {id: 'u', bindings: tally()}), /holds no record/);
    // A thing he cannot see and has no record of is unknown to his quote, though it is there.
    const far = quoteRecord(book, run.world, 'disciple', 'own', {id: 'q', bindings: {...tally(), b: {kind: 'core', id: 'core.far'}}, read});
    assert.deepEqual([far.ok, far.reason], [false, 'role-unavailable']);
    assert.throws(() => defineRecord({id: 'x', subject: {kind: 'fact', id: 'f'}, true: {holder: 'cave', property: 'absorbs'}}), /believes/);
    assert.throws(() => checkMethod({...routes.think, missPermille: undefined}, {record: 'taught'}), /miss rate/);
});

test('checking by a small trial, a second source and watching another use it', () => {
    const cell = play(scenes['small trial in a safe place']);
    // The trial is an ordinary use, begun on a clean quote; five over, and the cell takes four fifths.
    assert.deepEqual(paid(cell, 'trial'), [{holder: 'disciple', quantity: 'vitality', amount: 1}]);
    assert.deepEqual(paid(cell, 'weigh'), [{holder: 'disciple', quantity: 'essence', amount: 2}]);
    assert.deepEqual(cell.record('disciple', 'taught').checks[0].found, [{slot: 'join', kind: 'step', is: 'join.false', reason: 'overload'}]);
    assert.deepEqual([cell.quotes.again[0].ok, cell.declined], [false, ['again']], 'he does not use it at full strength');

    const run = play(scenes['second source and watching']);
    const [sibling, peer, watched] = run.record('disciple', 'taught').checks;
    assert.deepEqual(sibling.found, [], 'a copy from the same forger agrees with the lie');
    // A second source shows where two copies differ and leaves which is right open: doubt, not truth.
    assert.deepEqual(peer.found, [{slot: 'join', kind: 'differs', other: 'peer'}]);
    assert.deepEqual(watched.found, [{slot: 'join', kind: 'differs', other: 'teacher'}]);
    assert.deepEqual([run.record('disciple', 'taught').doubts, run.record('disciple', 'taught').believed.fillers.join], [['join'], 'join.official']);
    assert.deepEqual(paid(run, 'ask.peer'), [{holder: 'disciple', quantity: 'favour', amount: 1}]);
    assert.equal(run.amount('field', 'impact'), 64, 'the teacher\'s own use was the real move');
});

test('an annotated recipe is better than its reader thinks; handed on it keeps the note, retold it loses it', () => {
    const run = play(scenes['annotated recipe']);
    assert.equal(run.uses.use.promise.effects[0].amount, 64);
    assert.equal(effectsOf(run.workings.use)[0].amount, 70);
    assert.deepEqual([run.record('peer', 'copied').true.fillers.join, run.record('peer', 'retold').true.fillers.join], ['join.annotated', 'join.official']);
    assert.deepEqual([effectsOf(run.workings['peer.copied'])[0].amount, effectsOf(run.workings['peer.retold'])[0].amount, run.amount('field', 'impact')], [70, 64, 204]);
});

test('an incomplete recipe runs at part strength, and a rumour about a place is acted on until someone goes to look', () => {
    const run = play(scenes['fragment and a rumour about a place']);
    // He was shown eight of force and nothing turned back, because he believes the cave takes it.
    assert.deepEqual(run.uses.use.promise.effects, [{op: 'add', holder: 'cave', quantity: 'impact', amount: 8}]);
    assert.deepEqual(effectsOf(run.workings.use), [{op: 'add', holder: 'cave', quantity: 'impact', amount: 8}, {op: 'add', holder: 'disciple', quantity: 'vitality', amount: -4}]);
    assert.deepEqual(paid(run, 'visit'), [{holder: 'disciple', quantity: 'stamina', amount: 5}]);
    assert.deepEqual(run.record('disciple', 'cave.ward').believed, {value: 0});
    assert.deepEqual(run.record('disciple', 'cave.ward').source, {kind: 'instruction', by: 'hermit'});
    assert.deepEqual(run.uses.later.promise.effects, effectsOf(run.workings.later), 'after the visit the quote and the outcome agree');
    assert.deepEqual([run.amount('cave', 'impact'), run.amount('disciple', 'vitality')], [16, 92]);
    assert.deepEqual(bindRecord(book, run.record('disciple', 'fragment')).missing, ['join']);
});

test('a backdoored recipe works until its author closes the mark; knowing of the mark lets the holder see it closed', () => {
    const run = play(scenes.backdoored());
    assert.deepEqual([run.record('disciple', 'gift').true.fillers.join, run.record('disciple', 'gift').believed], ['join.marked', {fillers: official, conditions: []}]);
    assert.equal(status(run, 'first'), 'complete');
    // The second use was already under way when the mark closed.
    assert.deepEqual(paid(run, 'spring'), [{holder: 'author', quantity: 'attention', amount: 1}]);
    assert.deepEqual([run.workings.second.receipts.at(-1).op, run.workings.second.receipts.at(-1).reason], ['join/fold', 'condition-denied']);
    assert.deepEqual(paid(run, 'second'), [{holder: 'disciple', quantity: 'vitality', amount: 30}]);
    // He cannot see why, so he tries again and pays again.
    assert.deepEqual([run.quotes.third[0].ok, paid(run, 'third')], [true, [{holder: 'disciple', quantity: 'vitality', amount: 30}]]);
    assert.equal(run.amount('field', 'impact'), 64);

    // Reading the method closely finds the mark.
    const scene = scenes.backdoored(true);
    const knowing = play(scene);
    assert.deepEqual(knowing.record('disciple', 'gift').believed, {fillers: {...official, join: 'join.marked'}, conditions: ['maker-mark']});
    assert.deepEqual([knowing.quotes.third[0], knowing.declined], [{record: 'gift', ok: false, reason: 'condition-denied'}, ['third']]);
    // A trial in which nobody closed the mark shows nothing.
    const blind = play({...scene, timeline: [...scene.timeline.filter(row => row.at < 31),
        strike('trial', 40, ['gift']), {at: 50, id: 'weigh', act: 'check', by: 'disciple', record: 'gift', route: 'weigh', evidence: {kind: 'trial', use: 'trial'}}], until: 60});
    assert.deepEqual(blind.record('disciple', 'gift').checks[0].found, []);
    // The author has to know of a condition to close it.
    const stranger = play({...scene, until: 5, timeline: [learn('disciple', OWN), {at: 1, id: 'grab', act: 'close', by: 'peer', target: 'disciple', condition: 'spoken-trigger'}]});
    assert.deepEqual([status(stranger, 'grab'), stranger.workings.grab.receipts[0].reason, stranger.world.laws], ['interrupted', 'condition-unknown', []]);
});

test('a withheld last step: the charge is gathered and never let go, until a second scroll supplies the step', () => {
    const run = play(scenes['withheld last step']);
    assert.equal(run.uses.held.promise.effects[0].amount, 64, 'he was told the scroll was whole');
    assert.deepEqual([status(run, 'held'), effectsOf(run.workings.held), run.workings.held.facts.charge], ['complete', [], 64]);
    assert.deepEqual(run.record('disciple', 'scroll').true.fillers, official);
    assert.deepEqual(run.record('disciple', 'scroll').source, {by: 'teacher', kind: 'instruction', from: 'tally', at: 30}, 'the first scroll keeps its own provenance');
    assert.equal(run.amount('field', 'impact'), 64);
});

test('a rumour about a price: unknown, then believed and acted on, then doubted, then seen', () => {
    const run = play(scenes['rumour about a price']);
    assert.deepEqual([run.quotes.unknown, run.declined], [[{record: 'consign', ok: false, reason: 'role-unavailable'}], ['unknown']], 'a market he knows nothing of cannot be planned on');
    assert.deepEqual(run.record('peddler', 'far-price').believed, {value: 12}, 'the peddler knew better than he said');
    assert.equal(run.uses.send.promise.effects[1].amount, 300);
    assert.equal(effectsOf(run.workings.send)[1].amount, 120);
    const price = run.record('merchant', 'far-price');
    assert.deepEqual(price.checks.map(row => row.found), [[{kind: 'differs', other: 'carter'}], [{kind: 'value', is: 12}]]);
    assert.deepEqual([price.believed, price.doubts, price.source.by], [{value: 12}, [], 'peddler']);
    assert.equal(run.uses['send-again'].promise.effects[1].amount, 120);
    assert.deepEqual([run.amount('merchant', 'coin'), run.amount('merchant', 'stock:grain')], [240, 20]);
});

test('the same record on a potion formula: a wrong step makes dross, a lost step leaves the batch in the vessel', () => {
    const run = play(scenes['potion with a wrong step']);
    const dose = facts => facts.brew.doses[0].contents;
    assert.deepEqual([dose(run.uses.batch.promise.facts).z, dose(run.uses.batch.promise.facts).w], [1000, undefined]);
    // The wrong step settles under the brewing law like any step: the brew finishes and what it makes is dross.
    assert.deepEqual([status(run, 'batch'), dose(run.workings.batch.facts).z, dose(run.workings.batch.facts).w, dose(run.workings.batch.facts).y], ['complete', undefined, 500, 500]);
    assert.deepEqual(run.record('brewer', 'calm').checks[0].found, [{slot: 'bind', kind: 'step', is: 'bind.wrong'}]);
    assert.deepEqual(run.uses.batch2.promise.facts, run.workings.batch2.facts, 'once he has tasted it, his quote says dross');
    // A step that cannot be done at all fails as a step.
    assert.equal(status(run, 'stuck'), 'interrupted');
    assert.deepEqual([unfinishedBatch(run.workings.stuck).settledSteps, unfinishedBatch(run.workings.stuck).batch.z], [3, 2000]);
    assert.deepEqual(run.record('brewer', 'torn').checks[0].found, [{slot: 'pour', kind: 'step', is: 'pour.lost', reason: 'Choose how many doses to pour.'}]);
    assert.deepEqual(run.declined, ['stuck2']);
});

test('the same record on a made thing: the blade is what the blueprint really says, not what the smith read', () => {
    const run = play(scenes['blade from a miscopied blueprint']);
    const promised = Object.fromEntries(run.uses.make.promise.effects.map(e => [e.property, e.value]));
    const made = run.world.holders.sample.properties;
    assert.equal(status(run, 'make'), 'complete');
    assert.ok(made.hardness > promised.hardness && made.toughness < promised.toughness, JSON.stringify({promised, made}));
    assert.deepEqual(run.record('smith', 'blueprint').checks[0].found, [{slot: 'temper', kind: 'step', is: 'temper.brief'}]);
});

test('a record lives with the mind owner: when the memory is taken, the knowledge cannot be used', () => {
    const run = play(scenes['a memory taken']);
    assert.equal(status(run, 'before'), 'complete');
    assert.deepEqual([run.world.holders.disciple.properties.mind_memory, run.quotes.after, run.declined], [[], [{record: 'plain', ok: false, reason: 'record-unknown'}], ['after']]);
    assert.ok(run.world.holders.disciple.state[KNOWLEDGE_PACK].records.plain, 'the record is kept, so a memory given back gives it back');
});

test('one jump equals minute by minute, and a save and restore after every change reaches the same end', () => {
    for (const name of Object.keys(scenes)) {
        const scene = sceneOf(name), jump = play(scene, 'jump');
        for (const mode of ['minute', 'restore']) {
            const other = play(scene, mode);
            assert.deepEqual(other.saved, jump.saved, `${name}: ${mode} world`);
            assert.deepEqual(other.workings, jump.workings, `${name}: ${mode} workings`);
            assert.deepEqual([other.costs, other.quotes, other.declined], [jump.costs, jump.quotes, jump.declined], `${name}: ${mode} costs and quotes`);
        }
        assert.deepEqual(restoreEngineWorld(JSON.parse(JSON.stringify(jump.saved)), config).world, jump.world, `${name}: restored world`);
    }
});
