// Shared fight view (proposal, CBD192 and CBD202; docs/audits/FIGHT_VIEW_PROJECTION_2026-11-13.md).
// One shape that each fight engine projects onto: aim, you and your means,
// people by spot, things, around, coming, choices, log (CBD75). The engines are
// left alone. A part an engine does not model comes back absent or reduced and
// is named in `missing`; nothing is made up to fill it. Pure and headless: no
// UI, no save data, no write to either engine's record.
import {check, object} from './basics.js';
import {tempoView, actingOrder, policyMove, TEMPO_MOVES, TEMPO_POLICIES} from './tempo_fight.js';
import {entrantView, defaultChoice, CONTEST_DIALS, CONTEST_SCHEMA, TICKS_PER_SECOND} from './contest.js';
import {hasMeans, canUseAtPosition} from './contest_position.js';
import {nextWorkingDeadline, quoteWorking} from './kernel_working.js';

export const FIGHT_VIEW_SCHEMA = 'fight.view@1';
export const FIGHT_VIEW_PARTS = Object.freeze(['aim', 'you', 'people', 'things', 'around', 'coming', 'choices', 'log']);
export const FIGHT_VIEW_STATES = Object.freeze(['filled', 'reduced', 'absent']);

// Stance names from CBD109 mapped onto what each engine has today (CBD194, CBD204).
// `tempo` is a TEMPO_POLICIES name or null when no policy fits. `contest` is a
// patch over an entrant's `wants`, or null. The numbers are proposal dials:
// 0.35 is the health share at which tempo's safe policy backs away.
export const FIGHT_STANCES = Object.freeze({
    careful: {tempo: 'safe', contest: {fleeAt: 0.35, guards: true, pursues: false}},
    steady: {tempo: 'steady', contest: {}},
    'all in': {tempo: 'aggressive', contest: {fleeAt: 0, yieldAt: 0, guards: false, pursues: true}},
    quiet: {tempo: null, contest: null},
    sparing: {tempo: null, contest: null},
    merciful: {tempo: null, contest: {acceptsSurrender: true, pursues: false}},
});

const text = v => typeof v === 'string' && v.length > 0;
const textOrNull = v => v === null || text(v);
const list = v => Array.isArray(v);

/** Check a view against the shared shape. Throws on the first fault and returns the view. */
export function validateFightView(view) {
    check(object(view) && view.schema === FIGHT_VIEW_SCHEMA && text(view.engine) && text(view.id), 'A fight view needs a schema, an engine and an id.');
    check(['seat', 'engine'].includes(view.knowledge), 'A view says whose knowledge it shows: the seat\'s, or the engine\'s own truth.');
    check(textOrNull(view.title) && typeof view.yourTurn === 'boolean' && (view.result === null || text(view.result)), 'Invalid fight view header.');
    check(object(view.parts) && FIGHT_VIEW_PARTS.every(p => FIGHT_VIEW_STATES.includes(view.parts[p])) &&
        Object.keys(view.parts).length === FIGHT_VIEW_PARTS.length, 'Every view part needs a state: filled, reduced or absent.');
    check(list(view.missing) && view.missing.every(m => FIGHT_VIEW_PARTS.includes(m.part) && text(m.what)), 'Invalid missing list.');
    for (const part of FIGHT_VIEW_PARTS) {
        const named = view.missing.some(m => m.part === part), state = view.parts[part];
        check(named === (state !== 'filled'), `Part ${part} is ${state} but the missing list ${named ? 'names' : 'does not name'} it.`);
        if (state === 'absent') check(view[part] === null, `Absent part ${part} must be null, never a made-up value.`);
        else check(view[part] !== null && view[part] !== undefined, `Part ${part} is ${state} but has no value.`);
    }
    if (view.aim) check(textOrNull(view.aim.text) && list(view.aim.ends) &&
        view.aim.ends.every(e => text(e.when) && text(e.outcome)), 'Invalid aim.');
    if (view.you) check(text(view.you.id) && list(view.you.means) && view.you.means.every(m => text(m.id) && text(m.label) &&
        Number.isFinite(m.amount) && (m.max === null || Number.isFinite(m.max))) &&
        list(view.you.held) && view.you.held.every(h => text(h.slot) && text(h.thing)) &&
        list(view.you.wounds) && view.you.wounds.every(w => text(w.part) && text(w.state)) && textOrNull(view.you.doing), 'Invalid you part.');
    if (view.people) {
        check(list(view.people) && view.people.every(s => text(s.spot) && textOrNull(s.label) && list(s.who)), 'People are grouped by spot.');
        const everyone = view.people.flatMap(s => s.who);
        check(everyone.every(p => text(p.id) && text(p.name) && ['you', 'ally', 'foe'].includes(p.relation) && textOrNull(p.state) &&
            textOrNull(p.doing) && list(p.known) && p.known.every(k => text(k.what) && text(k.value) && text(k.how))), 'Invalid person line.');
        check(new Set(everyone.map(p => p.id)).size === everyone.length, 'A person stands in one spot.');
    }
    if (view.things) check(list(view.things) && view.things.every(t => text(t.id) && text(t.label) && textOrNull(t.spot)), 'Invalid things.');
    if (view.around) check(list(view.around.conditions) && view.around.conditions.every(c => text(c.what) && text(c.value)) &&
        (view.around.onlookers === null || list(view.around.onlookers)), 'Invalid around part.');
    if (view.coming) check(list(view.coming) && view.coming.every(c => text(c.who) && text(c.name) && Number.isFinite(c.seconds) && c.seconds >= 0 &&
        textOrNull(c.what) && textOrNull(c.target)), 'Invalid coming strip.');
    if (view.choices) {
        check(list(view.choices), 'Choices are a list.');
        for (const c of view.choices) {
            check(text(c.id) && text(c.what) && textOrNull(c.text), 'A choice says what it is.');
            check(object(c.time) && Number.isFinite(c.time.seconds) && c.time.seconds > 0, `Choice ${c.id} needs a time.`);
            check(c.cost === null || (list(c.cost) && c.cost.every(x => text(x.what) && Number.isFinite(x.amount))), `Choice ${c.id} has an invalid cost.`);
            check(textOrNull(c.likely) && textOrNull(c.blocked) && typeof c.policy === 'boolean' && list(c.subjects), `Choice ${c.id} is incomplete.`);
            check(object(c.answer) && text(c.answer.verb) && ['subject', 'means', 'manner'].every(k => textOrNull(c.answer[k])), `Choice ${c.id} needs an answer shape.`);
        }
        check(new Set(view.choices.map(c => c.id)).size === view.choices.length, 'Choice ids repeat.');
        check(view.choices.filter(c => c.policy).length <= 1, 'At most one choice is the policy pick.');
        check(list(view.manners) && view.manners.every(m => text(m.id) && text(m.label)), 'Invalid manners.');
    }
    if (view.log) check(list(view.log) && view.log.every(l => textOrNull(l.text) && (l.data === null || object(l.data)) && (l.text !== null || l.data !== null)), 'Invalid log.');
    return view;
}

/** One row per part: its state and what is missing. The table CBD202 asks the test to print. */
export function fightViewCoverage(view) {
    return Object.fromEntries(FIGHT_VIEW_PARTS.map(part => [part, {state: view.parts[part],
        missing: view.missing.filter(m => m.part === part).map(m => m.what)}]));
}

const finish = (view, gaps) => validateFightView({...view,
    parts: Object.fromEntries(FIGHT_VIEW_PARTS.map(p => [p, view[p] === null ? 'absent' : gaps.some(([part]) => part === p) ? 'reduced' : 'filled'])),
    missing: gaps.map(([part, what]) => ({part, what}))});

// ---------- tempo (LOTM street fights) ----------

const TEMPO_VERBS = {strike: 'strike', shoot: 'shoot', guard: 'guard', remedy: 'tend', withdraw: 'leave', yield: 'yield', reload: 'reload', order: 'order'};

/**
 * Project an open tempo battle (the saved `nativeBattle`) through `tempoView`.
 * `stance` names the policy whose pick is marked on the choice rows.
 */
export function projectTempoFight(b, {stance = 'steady'} = {}) {
    check(object(FIGHT_STANCES[stance]), `Unknown stance ${stance}.`);
    const tv = tempoView(b), policy = FIGHT_STANCES[stance].tempo;
    check(policy === null || TEMPO_POLICIES.includes(policy), 'The stance table names a tempo policy that no longer exists.');
    const pick = tv.yourTurn && policy ? policyMove(b, 'player', policy) : null;
    const foeIds = tv.foes.map(f => f.id);
    const you = {id: 'player', name: 'You',
        means: [{id: 'health', label: 'Health', amount: tv.you.hp, max: tv.you.maxHp}, {id: 'stamina', label: 'Stamina', amount: tv.you.stamina, max: tv.you.maxStamina},
            ...(tv.you.stock ? [{id: 'loaded', label: `Loaded rounds (${tv.you.stock.kindLabel})`, amount: tv.you.stock.loaded, max: tv.you.stock.capacity},
                {id: 'carried', label: `Carried rounds (${tv.you.stock.kindLabel})`, amount: tv.you.stock.carried, max: null}] : [])],
        held: [], wounds: tv.hurt.map(h => ({part: h.label, state: h.rung})), doing: null};
    const who = [{id: 'player', name: 'You', relation: 'you', state: null, doing: null, known: []},
        ...tv.allies.map(a => ({id: a.id, name: a.name, relation: 'ally', state: a.hurt, doing: a.order, known: []})),
        ...tv.foes.map(f => ({id: f.id, name: f.name, relation: 'foe', state: f.hurt, doing: null,
            known: [...Object.entries(f.learned).map(([what, value]) => ({what: `takes ${what}`, value, how: 'seen in this fight'})),
                ...f.injuries.map(i => ({what: i.label, value: i.rung, how: 'seen in this fight'}))]}))];
    // tempoView does not carry the conditions line, so it is read from the saved battle (request T1).
    const c = b.conditions ?? {};
    const conditions = ['light', 'footing', 'weather', 'visibility'].filter(k => text(c[k])).map(k => ({what: k, value: c[k]}));
    const coming = actingOrder(b).map(id => ({who: id, name: id === 'player' ? 'You' : b.fighters[id].name,
        seconds: Math.max(0, b.fighters[id].ready - b.now), what: null, target: null}));
    const cost = id => id === 'tend' ? [{what: 'stamina', amount: TEMPO_MOVES.tend.stamina}] : id === 'shoot' ? [{what: 'loaded round', amount: 1}]
        : TEMPO_MOVES[id].kind === 'strike' ? null : [];
    const choices = [...tv.moves.map(m => ({id: m.id, what: m.label, text: m.text, time: {seconds: m.cost}, cost: cost(m.id),
        likely: m.odds, blocked: m.usable ? null : (m.why || 'Not usable now.'), policy: pick?.moveId === m.id,
        subjects: ['strike', 'shoot'].includes(TEMPO_MOVES[m.id].kind) ? foeIds : [],
        answer: {verb: TEMPO_VERBS[TEMPO_MOVES[m.id].kind], subject: ['strike', 'shoot'].includes(TEMPO_MOVES[m.id].kind) ? (pick?.moveId === m.id ? pick.targetId : null) : null,
            means: m.id, manner: null}})),
    ...tv.orders.map(o => ({id: `order:${o.allyId}:${o.orderId}`, what: o.label, text: o.text, time: {seconds: o.cost}, cost: [],
        likely: o.odds, blocked: null, policy: false, subjects: [o.allyId], answer: {verb: 'order', subject: o.allyId, means: null, manner: o.orderId}}))];
    const strikes = tv.moves.some(m => TEMPO_MOVES[m.id].kind === 'strike');
    return finish({schema: FIGHT_VIEW_SCHEMA, engine: 'tempo', knowledge: 'seat', id: b.id, title: tv.title, yourTurn: tv.yourTurn, result: tv.result,
        aim: {text: tv.title, ends: []}, you,
        people: [{spot: 'here', label: text(c.place) ? c.place : null, who}],
        things: null,
        around: {conditions, onlookers: null},
        coming, choices, manners: tv.aims.map(a => ({id: a.id, label: a.label, text: a.text})),
        log: tv.lines.map(line => ({text: line, data: null}))},
    [['aim', 'the fight title alone; the battle keeps no objective line and no wanted ending'],
        ['people', 'one spot; fighters have no place inside the scene'],
        ['things', 'no things in the scene; rounds are a means of yours, shown under you'],
        ['around', 'conditions line alone; no onlookers or arrivals while the fight runs'],
        ['coming', 'who acts next and when; what they will do is not known ahead'],
        ...(strikes ? [['choices', 'strike rows carry no odds word and no stamina cost']] : []),
        ...(policy ? [] : [['choices', `no tempo policy for the ${stance} stance, so no row is marked`]])]);
}

// ---------- contest (Gu rows, Hogwarts rows) ----------

const BUILT_INS = ['withdraw', 'yield', 'wait'];
const BUILT_IN_TICKS = {withdraw: 'leaveTicks', yield: 'yieldTicks', wait: 'waitTicks'};
const dial = (law, name) => law.dials[name]?.value ?? CONTEST_DIALS[name].value;
const seconds = ticks => Math.round(ticks * 10 / TICKS_PER_SECOND) / 10;
const nextTime = e => e.working?.status === 'running' ? nextWorkingDeadline(e.working) : e.ready;
const runningMove = e => e.working?.status === 'running' ? e.working.method.steps[0].options?.move ?? null : null;
const CONTEST_VERBS = {guard: 'guard', withdraw: 'leave', yield: 'yield', wait: 'wait', advance: 'move', cross: 'move', drop: 'drop'};

// Why a move cannot start now. The contest keeps this test private (`affordable`),
// so the reason is put together here from exported parts (request C1).
function contestBlock(law, me, foes, move) {
    if (BUILT_INS.includes(move.id)) return null;
    if (move.tool && !me.held?.[move.tool]) return `needs a ${move.tool} in hand`;
    if (move.freeHand && me.held?.[move.freeHand]) return `needs a free hand (holding ${move.freeHand})`;
    if (!hasMeans(me, move)) return `${move.partRequired} too hurt`;
    for (const q of Object.keys({...move.requires, ...move.costs})) {
        const need = Math.max(move.requires?.[q] ?? 0, move.costs?.[q] ?? 0), have = me.quantities[q];
        if (have === undefined || have < need) return `needs ${need} ${q}, has ${have ?? 'none'}`;
    }
    if (move.bridge) {
        const quote = quoteWorking(move.bridge.law, move.bridge.method, {id: 'fight.view.quote', bindings: move.bridge.bindings(me),
            facts: move.bridge.facts(me), at: 0, ports: move.bridge.ports(me)});
        // The working's own reason when it reads as words ("needs more essence"); a bare code is not player text (CBD299).
        if (!quote.ok) return typeof quote.reason === 'string' && /\s/.test(quote.reason) ? quote.reason : 'something it needs is missing';
    }
    if (move.target !== 'self' && move.kind !== 'guard' && !foes.some(f => canUseAtPosition(me, f, move))) return foes.length ? 'no one in position for it' : 'no one left to use it on';
    return null;
}

/**
 * Project a contest record through `entrantView` and its running workings.
 * `seat` is the entrant the view is for. `wants` on that entrant is the stance.
 * `choose` is the chooser the fight is really run with (the `ports.choose` of stepContest);
 * it is asked on a copy, because a policy chooser keeps its cursor on the record.
 */
export function projectContest(law, record, world, {seat, title = null, choose = defaultChoice} = {}) {
    check(record?.schema === CONTEST_SCHEMA && record.law === law.ref && object(record.entrants[seat]), 'A contest view needs its law, its record and a seat in it.');
    const e = record.entrants[seat], me = entrantView(law, record, world, seat);
    const views = Object.fromEntries(Object.keys(record.entrants).map(id => [id, entrantView(law, record, world, id)]));
    const foes = Object.values(views).filter(v => v.side !== e.side && v.able);
    const order = Object.entries(record.entrants).filter(([, x]) => x.status === 'in').sort(([a, x], [b, y]) => nextTime(x) - nextTime(y) || (a < b ? -1 : 1));
    const yourTurn = !record.result && order[0]?.[0] === seat && e.working?.status !== 'running';
    const ends = [...Object.entries(law.endings).map(([q, outcome]) => ({when: q === 'noMeans' ? 'no move left to make' : `${q} runs out`, outcome})),
        ...(record.limits?.landed ? [{when: `${record.limits.landed} clean hits land`, outcome: 'stopped'}] : []),
        ...Object.entries(record.sides ?? {}).filter(([, rule]) => rule?.breakAt).map(([side, rule]) => ({when: `${Math.round(rule.breakAt * 100)}% of side ${side} has fallen`, outcome: 'routed'}))];
    const wounds = v => Object.entries(v.harm?.parts ?? {}).filter(([, p]) => p?.rung).map(([part, p]) => ({part, state: p.rung}));
    const you = {id: seat, name: seat,
        means: Object.entries(me.quantities).map(([q, amount]) => ({id: q, label: q, amount, max: q === 'vitality' ? e.max.vitality || null : null})),
        held: Object.entries(me.held ?? {}).map(([slot, thing]) => ({slot, thing})), wounds: wounds(me), doing: me.busy};
    // No knowledge layer: what is shown about another entrant is the engine's own truth, kept coarse here.
    const truth = 'engine truth, no knowledge filter';
    const person = v => ({id: v.id, name: v.id, relation: v.id === seat ? 'you' : v.side === e.side ? 'ally' : 'foe',
        state: record.entrants[v.id].status === 'in' ? (v.able ? 'in the fight' : 'cannot act') : record.entrants[v.id].outcome,
        doing: v.busy, known: v.id === seat ? [] : [...Object.entries(v.held ?? {}).map(([slot, thing]) => ({what: `holds ${slot}`, value: thing, how: truth})),
            ...wounds(v).map(w => ({what: w.part, value: w.state, how: truth}))]});
    const spots = new Map();
    for (const v of Object.values(views)) {
        const key = v.position === undefined ? 'here' : `line:${v.position}`;
        if (!spots.has(key)) spots.set(key, {spot: key, label: null, at: v.position ?? 0, who: []});
        spots.get(key).who.push(person(v));
    }
    const people = [...spots.values()].sort((x, y) => x.at - y.at).map(({at, ...spot}) => spot);
    const things = Object.entries(record.dropped ?? {}).map(([id, position]) => ({id, label: id, spot: position === undefined ? null : `line:${position}`}));
    const conditions = [{what: 'place', value: record.place},
        ...(me.sunlight !== undefined ? [{what: 'sunlight', value: String(me.sunlight)}] : []),
        ...(record.sunDirection !== undefined ? [{what: 'sun side', value: record.sunDirection > 0 ? 'up the line' : 'down the line'}] : [])];
    const coming = order.map(([id, x]) => ({who: id, name: id, seconds: seconds(Math.max(0, nextTime(x) - record.clock)), what: runningMove(x),
        target: x.working?.status === 'running' ? x.working.bindings.target?.id ?? null : null}));
    const pick = yourTurn ? choose(law, structuredClone(record), world, seat) : null;
    const choices = !yourTurn ? [] : [...e.moves, ...BUILT_INS.filter(m => !e.moves.includes(m))].map(id => {
        const move = law.moves[id], open = foes.filter(f => move.target !== 'self' && move.kind !== 'guard' && canUseAtPosition(me, f, move)).map(f => f.id);
        const ticks = BUILT_IN_TICKS[id] ? dial(law, BUILT_IN_TICKS[id]) : move.steps.reduce((sum, t) => sum + Math.max(1, Math.round(t * 100 / (e.speed || 100))), 0);
        return {id, what: id, text: move.why ?? null, time: {seconds: seconds(ticks)},
            cost: Object.entries(move.costs ?? {}).filter(([, n]) => n > 0).map(([what, amount]) => ({what, amount})),
            likely: null, blocked: contestBlock(law, me, foes, move), policy: pick?.move === id, subjects: open,
            answer: {verb: CONTEST_VERBS[move.kind] ?? 'strike', subject: pick?.move === id && pick.target !== seat ? pick.target : null, means: move.tool ?? id, manner: null}};
    });
    return finish({schema: FIGHT_VIEW_SCHEMA, engine: 'contest', knowledge: 'engine', id: record.id, title, yourTurn, result: record.result ? `${record.result.reason}: ${record.result.outcomes[seat]}` : null,
        aim: {text: null, ends}, you, people, things, around: {conditions, onlookers: null}, coming, choices, manners: [],
        log: record.log.map(line => ({text: null, data: structuredClone(line)}))},
    [['aim', 'endings as data; no sentence, and no objective beyond the law\'s endings'],
        ['you', 'quantities, held things and wounds; Gu and other carried powers sit in the pack\'s own profile and are not listed'],
        ['people', 'numbered positions on one line, ids for names, and no filter for what the seat knows'],
        ['things', 'dropped items alone; nothing else in the scene is a thing'],
        ['around', 'place and sunlight alone; no onlookers or arrivals'],
        ['choices', 'no likely result per move, no labels, and blocked reasons are worked out in the projection'],
        ['log', 'structured rows; no sentence in the world\'s voice']]);
}
