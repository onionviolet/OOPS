// Contest contract v0 (chat C, docs/CONTEST_CONTRACT.md, CFC1-CFC16).
// A contest is several actors' workings meeting. Each move an entrant makes is
// a kernel working (kernel_working.js, KW1-KW14) whose last step releases it
// against a target; the contest only orders those workings on one readiness
// clock, decides each meeting through a resolver the world pack names, lands
// what hits on the bodies (W substrate holders) and ends with typed outcomes.
// SC9: it never says what a Gu, a spell or a bite does. Moves are rows the
// world pack supplies. Pure: every call returns new values and keeps nothing.
import {check, natural, object} from './basics.js';
import {drawFraction} from './gen_kit.js';
import {checkKey} from './check_keys.js';
import {defineWorkingLaw, beginWorking, settleWorking, nextWorkingDeadline, interruptWorking,
    validateWorkingRecord} from './kernel_working.js';
import {applyWorldOps, readQuantity} from './world_substrate.js';
import {CONTEST_RESOLVERS} from './contest_resolvers.js';

export const CONTEST_CONTRACT_VERSION = '0.1';
export const CONTEST_SCHEMA = 'conflict.contest@1';
// Contest time is counted in ticks of a tenth of a second. Kernel arithmetic is
// unit-free whole numbers, so a move's steps are kernel steps measured in ticks.
export const TICKS_PER_SECOND = 10;
// Loser outcomes are the defeat publisher's own list (defeat_domain DEFEAT_OUTCOMES,
// CBR2); winner outcomes follow CBR3. A test keeps the two lists in step.
export const LOSER_OUTCOMES = Object.freeze(['unconscious', 'knocked_out', 'yielded', 'routed', 'captured', 'withdrew', 'escaped', 'killed']);
export const WINNER_OUTCOMES = Object.freeze(['killed', 'knocked_out', 'let_go', 'surrender_accepted', 'captured', 'drove_off']);

export const CONTEST_DIALS = Object.freeze({
    surpriseDelay: {value: 20, why: 'A side caught unaware loses about two seconds before it can answer (tempo surprise, LSD341).'},
    noticeSpread: {value: 10, why: 'Noticing is perception plus up to ten points of luck against the best stealth on the other side.'},
    interruptShare: {value: 0.15, why: 'A blow that takes about a seventh of a body breaks a working that has not finished (CFC6).'},
    leaveBase: {value: 0.55, why: 'Walking away from an even match works a little more often than not (tempo_exit leaveBase).'},
    leaveSpeed: {value: 0.004, why: 'Each point of speed over the fastest opponent helps slip away.'},
    leaveTicks: {value: 10, why: 'Breaking away takes about a second of turning and running.'},
    yieldTicks: {value: 5, why: 'Calling out a surrender takes half a second.'},
    maxMeetings: {value: 400, why: 'Budget (CX5): a contest that has not ended by then breaks off as a stalemate.'},
    impairment: {value: [1, 0.9, 0.75, 0.5, 0.2, 0.1],
        why: 'Control by fifths of vitality lost, the same ladder as harm_state part defaults (CBR22: injury lowers control before it stops a verb).'},
    logLines: {value: 24, why: 'Enough lines to read a fight back; older lines live in the world chain.'},
    crowd: {value: 3, why: 'Only about three bodies can strike at one target at the same moment; the rest wait for an opening.'},
    kiteCrowd: {value: 1, why: 'A target that keeps moving out of reach and is faster than its attackers meets them about one at a time.'},
    waitTicks: {value: 5, why: 'An attacker with no opening circles for half a second before looking again.'},
    oddsSamples: {value: 24, why: 'Odds for a chooser come from running the same rule on this many keyed seeds.'},
});
const dial = (law, name) => law.dials[name]?.value ?? CONTEST_DIALS[name].value;

const ID = /^[a-z][a-z0-9_.:-]*$/i;
const idOk = v => typeof v === 'string' && ID.test(v) && !['__proto__', 'constructor', 'prototype'].includes(v);
const clone = v => v === undefined ? undefined : structuredClone(v);

const BUILT_IN = name => ({id: name, kind: name, target: 'self', resolver: null, steps: [1], costs: {}, requires: {}});
const BUILT_INS = ['withdraw', 'yield', 'wait'];

// ---------- the law ----------

function validateMove(id, move, resolvers) {
    check(idOk(id) && object(move), `Move ${id} needs an id and a row.`);
    check(Array.isArray(move.steps) && move.steps.length > 0 && move.steps.every(t => natural(t) && t > 0),
        `Move ${id} needs steps of whole ticks.`);
    check(['foe', 'self'].includes(move.target ?? 'foe'), `Move ${id} targets a foe or itself.`);
    check(move.kind === 'guard' || resolvers[move.resolver], `Move ${id} names an unknown resolver.`);
    for (const table of [move.costs ?? {}, move.requires ?? {}]) for (const [q, n] of Object.entries(table))
        check(idOk(q) && natural(n), `Move ${id} has an invalid cost or requirement.`);
    if (move.kind === 'guard') check(object(move.block), `Guard ${id} needs what it blocks.`);
}

/** A contest law: the moves a world allows, how endings map to outcomes, and dials. */
export function defineContestLaw({id, revision, moves, endings = {}, lethal = false, dials = {}, resolvers = {}}) {
    check(idOk(id) && natural(revision) && object(moves), 'A contest law needs an id, a revision and moves.');
    const table = {...CONTEST_RESOLVERS, ...resolvers};
    for (const [moveId, move] of Object.entries(moves)) validateMove(moveId, move, table);
    const ends = {vitality: lethal ? 'killed' : 'knocked_out', noMeans: 'yielded', ...endings};
    for (const outcome of Object.values(ends)) check(LOSER_OUTCOMES.includes(outcome), `Unknown ending ${outcome}.`);
    const all = {...Object.fromEntries(Object.entries(moves).map(([k, m]) => [k, {...m, id: k}])), withdraw: BUILT_IN('withdraw'), yield: BUILT_IN('yield'), wait: BUILT_IN('wait')};
    const law = {id, revision, ref: `${id}@${revision}`, moves: all, endings: ends, lethal, dials, resolvers: table};
    law.working = defineWorkingLaw({id: `${id}.meeting`, revision, operations: {
        ready: {roles: {actor: 'entrant'}, settle: ({bound}) => bound.actor.able
            ? {ok: true} : {ok: false, reason: 'The mover can no longer act.', observed: {stopped: true}}},
        release: {roles: {actor: 'entrant', target: 'entrant'}, settle: args => release(law, args)},
    }});
    return Object.freeze(law);
}

// The meeting itself (CFC1, CFC2). The kernel rereads both entrants at the step's time.
function release(law, {bound, options, address, facts}) {
    const move = law.moves[options.move], {actor, target} = bound;
    if (!actor.able) return {ok: false, reason: 'The mover can no longer act.', observed: {stopped: true}};
    if (move.kind === 'guard' || BUILT_INS.includes(move.kind))
        return {ok: true, effects: [{kind: `contest.${move.kind}`, actor: actor.id, move: move.id}]};
    if (!target.able) return {ok: true, effects: [{kind: 'contest.meet', actor: actor.id, target: target.id, move: move.id,
        outcome: 'wasted', landed: [], chance: 0}], observed: {outcome: 'wasted'}};
    const draw = name => drawFraction(facts.seed, checkKey({subject: address, method: `contest.${name}`}));
    const result = law.resolvers[move.resolver]({actor, target, move, draw, dials: law.dials});
    return {ok: true, effects: [{kind: 'contest.meet', actor: actor.id, target: target.id, move: move.id, ...result}],
        observed: {outcome: result.outcome}};
}

function methodFor(law, moveId, speed) {
    const move = law.moves[moveId], last = move.steps.length - 1;
    const scale = t => Math.max(1, Math.round(t * 100 / (speed || 100)));
    return {id: `${law.id}.${moveId}`, revision: law.revision, law: law.working.ref,
        roles: {actor: 'entrant', target: 'entrant'},
        steps: move.steps.map((t, i) => i < last
            ? {op: 'ready', bindings: {actor: 'actor'}, minutes: scale(t), options: {move: moveId}}
            : {op: 'release', bindings: {actor: 'actor', target: 'target'}, minutes: scale(t), options: {move: moveId}})};
}

// ---------- reading entrants through the world ----------

const BODY_QUANTITIES = ['vitality', 'stamina'];
function quantity(record, world, entrant, name) {
    const base = readQuantity(world, entrant.body, name);
    if (base === null) return null;
    return Math.max(0, base + (record.pending[entrant.body]?.[name] ?? 0));
}
function rungIndex(fraction) {return fraction >= 1 ? 0 : 1 + Math.min(4, Math.floor((1 - fraction) * 5));}

function runningMove(law, e) {
    return e.working?.status === 'running' ? law.moves[e.working.method.steps[0].options.move] : null;
}

/** What an entrant is at this moment, read from its body in the world. */
export function entrantView(law, record, world, id) {
    const e = record.entrants[id];
    const quantities = Object.fromEntries([...new Set([...BODY_QUANTITIES, ...Object.keys(law.endings).filter(k => k !== 'noMeans'),
        ...e.reads])].map(q => [q, quantity(record, world, e, q)]).filter(([, v]) => v !== null));
    const max = e.max.vitality || 1, fraction = (quantities.vitality ?? max) / max;
    const ends = Object.keys(law.endings).filter(k => k !== 'noMeans' && k in quantities);
    const able = e.status === 'in' && ends.every(q => quantities[q] > 0);
    const guarding = runningMove(law, e);
    return {kind: 'entrant', id, side: e.side, body: e.body, profile: clone(e.profile), able, quantities,
        fraction, impair: dial(law, 'impairment')[rungIndex(fraction)],
        guard: guarding?.kind === 'guard' ? clone(guarding.block) : {},
        busy: e.working?.status === 'running' ? e.working.method.steps[0].options.move : null};
}

// ---------- beginning ----------

/** Begin a contest. `entrants`: [{id, side, body, profile, moves, speed, perception, stealth, wants, lifecycle}]. */
export function beginContest(law, {id, seed, place, entrants, sides = {}, detail = 'near', at = 0, limits = {}}, world) {
    check(idOk(id) && natural(seed) && natural(at) && typeof place === 'string', 'A contest needs an id, a seed, a place and a start.');
    check(['near', 'far'].includes(detail), 'Detail is near or far.');
    check(Array.isArray(entrants) && new Set(entrants.map(e => e.side)).size >= 2, 'A contest needs at least two sides.');
    const table = {};
    for (const e of [...entrants].sort((x, y) => (x.id < y.id ? -1 : 1))) {
        check(idOk(e.id) && !table[e.id] && idOk(e.side) && world.holders[e.body]?.kind === 'body', `Entrant ${e.id} needs a body in the world.`);
        check(Array.isArray(e.moves) && e.moves.every(m => law.moves[m]), `Entrant ${e.id} names a move this law does not have.`);
        table[e.id] = {side: e.side, body: e.body, profile: clone(e.profile ?? {}), moves: [...e.moves], speed: e.speed ?? 100,
            perception: e.perception ?? 5, stealth: e.stealth ?? 0, wants: {fleeAt: 0, yieldAt: 0, acceptsSurrender: true,
                pursues: false, guards: true, ...clone(e.wants ?? {})}, reads: [...(e.reads ?? [])],
            max: {vitality: e.maxVitality ?? readQuantity(world, e.body, 'vitality') ?? 0},
            lifecycle: clone(e.lifecycle ?? null), ready: at, status: 'in', outcome: null, working: null, yieldRefused: false, moveCount: 0};
    }
    const record = {schema: CONTEST_SCHEMA, id, law: law.ref, seed, place, detail, startedAt: at, clock: at, meetings: 0,
        sides: clone(sides), limits: clone(limits), landed: 0, entrants: table, pending: {}, pursuits: [], log: [], result: null, surprised: null};
    // CFC5: the opening comes from who notices first.
    const sideIds = [...new Set(Object.values(table).map(e => e.side))].sort();
    const best = (side, key) => Math.max(...Object.values(table).filter(e => e.side === side).map(e => e[key]));
    const aware = side => best(side, 'perception') + dial(law, 'noticeSpread') *
        drawFraction(seed, checkKey({subject: `${id}:notice`, method: 'contest.notice', targetState: {side}})) >=
        Math.max(...sideIds.filter(s => s !== side).map(s => best(s, 'stealth')));
    const unaware = sideIds.filter(s => !aware(s));
    if (unaware.length && unaware.length < sideIds.length) {
        record.surprised = unaware;
        for (const e of Object.values(table)) if (unaware.includes(e.side)) e.ready += dial(law, 'surpriseDelay');
    }
    return record;
}

// ---------- choosing ----------

function affordable(law, record, world, e, moveId) {
    const move = law.moves[moveId];
    for (const [q, n] of Object.entries({...move.requires, ...move.costs})) {
        const have = quantity(record, world, e, q);
        if (have === null || have < (move.requires?.[q] ?? 0) || have < (move.costs?.[q] ?? 0)) return false;
    }
    return true;
}

/** The default chooser (PFP11: the same for the player's auto-play and every other actor). A's chooser replaces it through ports.choose. */
export function defaultChoice(law, record, world, id) {
    const e = record.entrants[id], me = entrantView(law, record, world, id);
    const foes = Object.keys(record.entrants).filter(o => record.entrants[o].side !== e.side)
        .map(o => entrantView(law, record, world, o)).filter(v => v.able);
    if (!foes.length) return null;
    if (me.fraction <= e.wants.fleeAt) return {move: 'withdraw', target: id, why: 'hurt past what it will risk'};
    if (me.fraction <= e.wants.yieldAt && !e.yieldRefused) return {move: 'yield', target: id, why: 'hurt enough to give up'};
    // Morale read from the own side: enough of it cut or down and this one gives up.
    if (e.wants.yieldAtSideHurt !== undefined && !e.yieldRefused) {
        const side = Object.values(record.entrants).filter(o => o.side === e.side);
        if (side.filter(o => o.status === 'out' || (o.lost ?? 0) > 0).length / side.length >= e.wants.yieldAtSideHurt)
            return {move: 'yield', target: id, why: 'its side has been cut'};
    }
    const threatened = foes.some(f => f.busy && record.entrants[f.id].working?.bindings.target.id === id &&
        law.moves[f.busy].kind !== 'guard');
    // Crowding: a target only takes so many attackers at once; a faster, moving target takes fewer.
    const open = foes.filter(f => {
        const fe = record.entrants[f.id];
        const cap = fe.wants.kite && fe.speed > e.speed ? dial(law, 'kiteCrowd') : dial(law, 'crowd');
        const on = Object.entries(record.entrants).filter(([oid, o]) => oid !== id && o.status === 'in' && o.side === e.side &&
            o.working?.status === 'running' && o.working.bindings.target.id === f.id).length;
        return on < cap;
    });
    const attackable = open.length ? open : [];
    const pick = e.wants.target && attackable.find(f => f.id === e.wants.target)
        || [...attackable].sort((x, y) => x.fraction - y.fraction || (x.id < y.id ? -1 : 1))[0];
    for (const moveId of e.moves) {
        const move = law.moves[moveId];
        if (move.kind === 'guard' && !(threatened && e.wants.guards)) continue;
        if (move.kind !== 'guard' && move.target !== 'self' && !pick) return {move: 'wait', target: id, why: 'no opening'};
        if (!affordable(law, record, world, e, moveId)) continue;
        return {move: moveId, target: move.target === 'self' ? id : pick.id, why: move.kind === 'guard' ? 'an attack is coming' : 'best open move'};
    }
    return null;
}

// ---------- landing ----------

function land(law, record, world, rules, ops, cause) {
    if (!ops.length) return world;
    if (record.detail === 'far') {
        for (const op of ops) if (op.op === 'add') {
            const row = record.pending[op.holder] ??= {};
            row[op.quantity] = (row[op.quantity] ?? 0) + op.amount;
        }
        return world;
    }
    return applyWorldOps(rules, world, ops, cause);
}

function say(law, record, line) {
    if (record.detail === 'far') return;
    record.log.push(line);
    if (record.log.length > dial(law, 'logLines')) record.log.splice(0, record.log.length - dial(law, 'logLines'));
}

function applyMeeting(law, record, world, rules, effect, at) {
    const cause = `contest:${record.id}:${record.meetings}`;
    if (effect.kind === 'contest.withdraw') return leave(law, record, world, rules, effect.actor, at);
    if (effect.kind === 'contest.yield') return surrender(law, record, world, effect.actor, at);
    if (effect.kind !== 'contest.meet') return world;
    const target = record.entrants[effect.target];
    const ops = [];
    let vitalityLost = 0;
    for (const {verb, object: q, amount} of effect.landed) {
        if (quantity(record, world, target, q) === null) continue;
        ops.push({op: 'add', holder: target.body, quantity: q, amount: verb === 'add' ? amount : -amount, source: cause});
        if (q === 'vitality' && verb !== 'add') vitalityLost += amount;
    }
    if (ops.length && record.detail === 'near') ops.push({op: 'publish', kind: 'contest.blow', place: record.place,
        detail: {actor: effect.actor, target: effect.target, move: effect.move, landed: effect.landed}});
    world = land(law, record, world, rules, ops, cause);
    if (effect.landed.length) record.landed += 1;
    say(law, record, {at, actor: effect.actor, move: effect.move, target: effect.target, outcome: effect.outcome,
        landed: effect.landed.map(l => `${l.object} ${l.verb === 'add' ? '+' : '-'}${l.amount}`).join(', ')});
    // CFC6: a hard enough blow cuts a working the target has not finished.
    const move = law.moves[effect.move];
    target.lost = (target.lost ?? 0) + vitalityLost;
    if (target.lost >= 0.25 * (target.max.vitality || 1)) target.hurt = true;
    if (target.working?.status === 'running' && target.working.method.steps.length > 1) {
        if (move.staggers || vitalityLost >= dial(law, 'interruptShare') * (target.max.vitality || 1)) {
            target.working = interruptWorking(target.working, {at, reason: 'Hit before it finished.'});
            target.ready = at;
            say(law, record, {at, actor: effect.target, move: 'interrupted', by: effect.actor});
        }
    }
    if (effect.landed.length) target.lastHitBy = {actor: effect.actor, move: effect.move};
    return world;
}

function opponents(record, id) {
    return Object.entries(record.entrants).filter(([o, e]) => e.side !== record.entrants[id].side && e.status === 'in');
}

// CFC11: leaving is an attempt with a price.
function leave(law, record, world, rules, id, at) {
    const e = record.entrants[id], foes = opponents(record, id);
    const fastest = Math.max(0, ...foes.map(([, f]) => f.speed));
    const chance = Math.min(0.95, Math.max(0.05, dial(law, 'leaveBase') + dial(law, 'leaveSpeed') * (e.speed - fastest)));
    const roll = drawFraction(record.seed, checkKey({subject: `${record.id}:leave:${id}:${record.meetings}`, method: 'contest.leave'}));
    if (roll < chance) {
        e.status = 'out'; e.outcome = 'withdrew';
        for (const [fid, f] of foes) if (f.wants.pursues) record.pursuits.push({by: fid, of: id, at});
        say(law, record, {at, actor: id, move: 'withdraw', outcome: 'got away', chance});
    } else {
        // The price of a failed try: the nearest opponent gets a free blow.
        const [fid, f] = [...foes].sort(([a, x], [b, y]) => y.speed - x.speed || (a < b ? -1 : 1))[0] ?? [];
        if (f && f.working?.status !== 'running') f.ready = Math.min(f.ready, at);
        e.wants.fleeAt = -1; // having failed once, it fights on rather than trying again at once
        say(law, record, {at, actor: id, move: 'withdraw', outcome: 'caught', chance, by: fid ?? null});
    }
    return world;
}

// CFC11: surrender is accepted or refused by the other side's wants.
function surrender(law, record, world, id, at) {
    const e = record.entrants[id], foes = opponents(record, id);
    if (foes.length && foes.every(([, f]) => f.wants.acceptsSurrender)) {
        e.status = 'out'; e.outcome = 'yielded';
        say(law, record, {at, actor: id, move: 'yield', outcome: 'accepted'});
    } else {
        e.yieldRefused = true;
        say(law, record, {at, actor: id, move: 'yield', outcome: 'refused'});
    }
    return world;
}

function checkEnds(law, record, world, rules, at) {
    const ops = [];
    for (const [id, e] of Object.entries(record.entrants)) {
        if (e.status !== 'in') continue;
        const view = entrantView(law, record, world, id);
        const spent = Object.keys(law.endings).find(q => q !== 'noMeans' && q in view.quantities && view.quantities[q] <= 0);
        if (!spent) continue;
        const lethalBlow = law.lethal && law.moves[e.lastHitBy?.move]?.lethal;
        e.status = 'out';
        e.outcome = spent === 'vitality' ? (lethalBlow ? 'killed' : law.lethal ? 'knocked_out' : law.endings.vitality) : law.endings[spent];
        if (e.working?.status === 'running') e.working = interruptWorking(e.working, {at, reason: 'Down.'});
        ops.push({op: 'publish', kind: 'contest.down', place: record.place, detail: {entrant: id, outcome: e.outcome, by: e.lastHitBy ?? null}});
        say(law, record, {at, actor: id, move: 'down', outcome: e.outcome});
    }
    // A side breaks when enough of it has fallen (a pack pulls away).
    for (const [side, rule] of Object.entries(record.sides)) {
        if (!rule?.breakAt) continue;
        const members = Object.values(record.entrants).filter(e => e.side === side);
        const fallen = members.filter(e => e.status === 'out' && ['killed', 'knocked_out', 'unconscious'].includes(e.outcome)).length;
        if (fallen / members.length < rule.breakAt) continue;
        for (const [id, e] of Object.entries(record.entrants)) if (e.side === side && e.status === 'in') {
            e.status = 'out'; e.outcome = 'routed';
            if (e.working?.status === 'running') e.working = interruptWorking(e.working, {at, reason: 'The side broke.'});
            say(law, record, {at, actor: id, move: 'break', outcome: 'routed'});
        }
    }
    world = land(law, record, world, rules, record.detail === 'near' ? ops : [], `contest:${record.id}:ends`);
    // A referee or a rule of the bout stops it after enough clean hits (a club duel, a spar).
    if (record.limits.landed && record.landed >= record.limits.landed) {finish(law, record, null, at, 'stopped'); return world;}
    const standing = [...new Set(Object.values(record.entrants).filter(e => e.status === 'in').map(e => e.side))];
    if (standing.length <= 1) finish(law, record, standing[0] ?? null, at, 'decided');
    return world;
}

function winnerOutcome(losers) {
    const set = new Set(losers.map(e => e.outcome));
    return set.has('killed') ? 'killed' : set.has('knocked_out') || set.has('unconscious') ? 'knocked_out'
        : set.has('yielded') ? 'surrender_accepted' : set.has('captured') ? 'captured' : 'drove_off';
}

function finish(law, record, winner, at, reason) {
    const losers = Object.values(record.entrants).filter(e => e.side !== winner && e.outcome);
    record.result = {winner, reason, at, ticks: at - record.startedAt,
        winnerOutcome: winner === null ? null : winnerOutcome(losers),
        outcomes: Object.fromEntries(Object.entries(record.entrants).map(([id, e]) => [id, e.status === 'in' ? 'stood' : e.outcome]))};
}

// ---------- stepping ----------

function readPort(law, record, world) {
    return {read: ref => ref.kind === 'entrant' && record.entrants[ref.id] ? entrantView(law, record, world, ref.id) : null};
}

const nextTime = e => e.working?.status === 'running' ? nextWorkingDeadline(e.working) : e.ready;

/** One step: the next entrant on the readiness clock acts or finishes a step. Returns new values. */
export function stepContest(law, record0, rules, world0, ports = {}) {
    check(record0.schema === CONTEST_SCHEMA && record0.law === law.ref, 'This contest belongs to a different law.');
    if (record0.result) return {record: record0, world: world0};
    const record = clone(record0);
    let world = world0;
    const order = Object.entries(record.entrants).filter(([, e]) => e.status === 'in')
        .sort(([a, x], [b, y]) => nextTime(x) - nextTime(y) || (a < b ? -1 : 1));
    if (!order.length) {finish(law, record, null, record.clock, 'empty'); return {record, world};}
    const [id, e] = order[0];
    const at = Math.max(record.clock, nextTime(e));
    record.clock = at;
    record.steps = (record.steps ?? 0) + 1;
    if (record.meetings >= dial(law, 'maxMeetings') || record.steps >= 50 * dial(law, 'maxMeetings')) {
        finish(law, record, null, at, 'stalemate');
        return {record, world};
    }
    if (e.working?.status === 'running') {
        const {record: done, effects} = settleWorking(law.working, e.working, {now: at, ports: readPort(law, record, world)});
        e.working = done;
        if (done.status !== 'running') {e.ready = at; e.working = null;}
        for (const {effect} of effects) {
            if (!['contest.wait', 'contest.guard'].includes(effect.kind)) record.meetings += 1;
            world = applyMeeting(law, record, world, rules, effect, at);
            if (record.result) break;
        }
        world = checkEnds(law, record, world, rules, at);
        return {record, world};
    }
    const choice = (ports.choose ?? defaultChoice)(law, record, world, id);
    if (!choice) {
        e.status = 'out'; e.outcome = law.endings.noMeans;
        say(law, record, {at, actor: id, move: 'none', outcome: e.outcome});
        world = checkEnds(law, record, world, rules, at);
        return {record, world};
    }
    check(e.moves.includes(choice.move) || BUILT_INS.includes(choice.move), `${id} cannot use ${choice.move}.`);
    check(affordable(law, record, world, e, choice.move), `${id} cannot pay for ${choice.move}.`);
    const move = law.moves[choice.move];
    // Costs are paid as the working begins (KB3 on the kernel side); the refund policy is none by default.
    const costs = Object.entries(move.costs ?? {}).filter(([, n]) => n > 0)
        .map(([q, n]) => ({op: 'add', holder: e.body, quantity: q, amount: -n, source: `contest:${record.id}:${id}:${choice.move}`}));
    world = land(law, record, world, rules, costs, `contest:${record.id}:cost`);
    const builtInTicks = {withdraw: 'leaveTicks', yield: 'yieldTicks', wait: 'waitTicks'}[move.kind];
    const method = builtInTicks ? {...methodFor(law, move.kind, 100), steps: [{op: 'release',
        bindings: {actor: 'actor', target: 'target'}, minutes: dial(law, builtInTicks), options: {move: move.kind}}]}
        : methodFor(law, choice.move, e.speed);
    e.moveCount += 1;
    e.working = beginWorking(law.working, method, {id: `${record.id}:${id}:${e.moveCount}`, at,
        bindings: {actor: {kind: 'entrant', id}, target: {kind: 'entrant', id: choice.target}}, facts: {seed: record.seed}});
    return {record, world};
}

/** Run until the contest ends or the clock passes `until` ticks. Far detail lands its totals at the end. */
export function runContest(law, record, rules, world, ports = {}, {until = Infinity} = {}) {
    let state = {record, world};
    while (!state.record.result && state.record.clock <= until) state = stepContest(law, state.record, rules, state.world, ports);
    return state.record.result ? flushContest(law, state.record, rules, state.world) : state;
}

// Far detail (CFC12): the same rule and the same draws; hits accumulate per body and land once, with one summary effect.
export function flushContest(law, record0, rules, world) {
    if (record0.detail !== 'far' || !Object.keys(record0.pending).length) return {record: record0, world};
    const record = clone(record0), ops = [];
    for (const [holder, row] of Object.entries(record.pending).sort(([a], [b]) => (a < b ? -1 : 1)))
        for (const [q, amount] of Object.entries(row).sort(([a], [b]) => (a < b ? -1 : 1)))
            if (amount) ops.push({op: 'add', holder, quantity: q, amount, source: `contest:${record.id}`});
    ops.push({op: 'publish', kind: 'contest.settled', place: record.place, detail: {result: clone(record.result)}});
    record.pending = {};
    return {record, world: applyWorldOps(rules, world, ops, `contest:${record.id}:far`)};
}

/** Odds for a chooser (A) or a quote: the same rule on keyed seeds, far detail, nothing kept. */
export function quoteContestOdds(law, spec, rules, world, {samples, ports = {}} = {}) {
    const n = samples ?? dial(law, 'oddsSamples'), wins = {}, outcomes = {};
    for (let s = 0; s < n; s += 1) {
        const seed = (spec.seed * 31 + s * 2654435761) >>> 0;
        const begun = beginContest(law, {...spec, id: `${spec.id}.odds${s}`, seed, detail: 'far'}, world);
        const {record} = runContest(law, begun, rules, world, ports);
        const w = record.result.winner ?? 'none';
        wins[w] = (wins[w] ?? 0) + 1;
        for (const [id, o] of Object.entries(record.result.outcomes)) {
            const row = outcomes[id] ??= {};
            row[o] = (row[o] ?? 0) + 1;
        }
    }
    return {samples: n, sides: Object.fromEntries(Object.entries(wins).map(([k, v]) => [k, v / n])), outcomes};
}

// ---------- saves (OS8) ----------

export const serializeContest = record => JSON.parse(JSON.stringify(record));

export function restoreContest(law, raw) {
    check(object(raw) && raw.schema === CONTEST_SCHEMA, 'Unsupported contest save version.');
    check(raw.law === law.ref && idOk(raw.id) && natural(raw.seed) && natural(raw.clock), 'This contest belongs to a different law.');
    for (const [id, e] of Object.entries(raw.entrants ?? {})) {
        check(idOk(id) && ['in', 'out'].includes(e.status), 'Invalid contest entrant.');
        if (e.working) validateWorkingRecord(law.working, e.working);
    }
    return clone(raw);
}

/** What a winner or loser's body owners should do after the fight (L's doors; see contest_bodies.js). */
export function contestBodyIntents(record) {
    const out = [];
    for (const [id, e] of Object.entries(record.entrants).sort(([a], [b]) => (a < b ? -1 : 1))) {
        if (!e.lifecycle) continue;
        const fallen = ['killed', 'knocked_out', 'unconscious'].includes(e.outcome);
        if (e.lifecycle.cohortId && fallen) out.push({door: 'cohort', entrant: id, cohortId: e.lifecycle.cohortId, delta: -1, outcome: e.outcome});
        if (e.lifecycle.individualId && (fallen || e.hurt)) out.push({door: 'injure', entrant: id, id: e.lifecycle.individualId,
            kind: 'contest_wound', recoveryMinutes: e.lifecycle.recoveryMinutes ?? 720});
    }
    return out;
}
