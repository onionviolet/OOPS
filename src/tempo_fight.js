import {check} from './basics.js';
import {address, drawFraction} from './gen_kit.js';
import {checkKey} from './check_keys.js';
import {rollCombatStrike, mitigateCombatDamageFromStats} from './combat_math.js';
import {runConflictFrame} from './conflict_frame.js';
import {validateExpansionState} from './expansion_engine.js';
import {savedBattleLoss} from './defeat_domain.js';
import {finishRoadContest} from './native_battle.js';
import {applySimulationEffects} from './simulation_effects.js';
import {allyMove, hearOrder, coverChance, activeOrder, orderChance, oddsWord, ALLY_ORDERS, ALLY_ORDER_IDS, ALLY_DIALS} from './tempo_allies.js';
import {TEMPO_SCHEMA, TEMPO_LOG_LINES, TEMPO_MOVE_IDS, TEMPO_FACT_HELD, recordTempoHold, takeTempoHold, validateTempoBattle} from './tempo_fight_contract.js';
export {TEMPO_SCHEMA, TEMPO_FACT_HELD, recordTempoHold, takeTempoHold, validateTempoBattle};

// Tempo fights (LSD307-LSD317, LSD341-LSD343): every move costs time units, the
// earliest-ready fighter acts, and a fight waits for the player with no clock.
// One runner (conflict_frame) drives it; numbers below are defaults with a dial,
// not laws. Draws are keyed (LSD139): same situation, same result on replay.
export const TEMPO_DIALS = {
    heldCapMinutes: {value: 7 * 24 * 60, why: 'Away time is kept, but a week is the longest one fight can bank.'},
    surpriseDelay: {value: 8, why: 'A surprised side loses about two quick moves before it can act.'},
    mishapCap: {value: .35, why: 'Even the worst conditions leave most moves working.'},
    guardBonus: {value: 2, why: 'A braced fighter takes a little less from the next blow.'},
    logLines: {value: TEMPO_LOG_LINES, why: 'The log is a short readable tail, not history.'}
};
// Costs are time units (about seconds). Power scales the existing strike math;
// safe moves are the only ones an opt-in hand-over may choose (LSD316).
export const TEMPO_MOVES = {
    jab: {label: 'Quick strike', kind: 'strike', cost: 3, power: .7, safe: false, text: 'A fast, light blow. Cheap in time, small in harm.'},
    swing: {label: 'Heavy swing', kind: 'strike', cost: 6, power: 1.4, safe: false, text: 'A slow, hard blow. Leaves you open longer.'},
    guard: {label: 'Brace', kind: 'guard', cost: 2, safe: true, text: 'Take the next blow better. Costs a little time.'},
    tend: {label: 'Tend a wound', kind: 'remedy', cost: 5, heal: .15, stamina: 2, safe: true, text: 'Stop the worst of the bleeding. Needs two stamina.'},
    withdraw: {label: 'Back away', kind: 'withdraw', cost: 4, safe: true, text: 'Leave the fight. Ends it for you; injuries remain.'},
    yield: {label: 'Yield', kind: 'yield', cost: 2, safe: true, text: 'Give up the contest while you can still stand.'},
    order: {label: 'Give an order', kind: 'order', cost: 2, safe: false, text: 'Say it to an ally. Costs a little time and may not be heard.'}
};
const KEEP = TEMPO_MOVE_IDS.filter(m => m !== 'order');
const natural = n => Number.isSafeInteger(n) && n >= 0;
const sideOf = (b, id) => b.fighters[id].side;
const active = (b, side) => Object.keys(b.fighters).filter(id => b.fighters[id].status === 'active' && (!side || b.fighters[id].side === side)).sort();
const round1 = n => Math.round(n * 10) / 10;
const scaled = (move, f) => Math.max(1, Math.round(move.cost * 100 / f.speed));

export function nextActor(b) {
    return active(b).sort((x, y) => b.fighters[x].ready - b.fighters[y].ready || b.fighters[y].speed - b.fighters[x].speed || (x < y ? -1 : 1))[0] || null;
}
export function actingOrder(b, count = 3) {
    return active(b).sort((x, y) => b.fighters[x].ready - b.fighters[y].ready || b.fighters[y].speed - b.fighters[x].speed || (x < y ? -1 : 1)).slice(0, count);
}
const draw = (b, method, subject, extra = {}) => drawFraction(b.seed, checkKey({subject: `${b.id}:${subject}`, method, period: {at: b.actions}, targetState: extra, attemptState: {now: b.now}}));

// Mishaps come from conditions, never a flat roll (LSD343).
export function mishapChance(b, f) {
    const c = b.conditions, hp = f.hp / f.maxHp, st = f.stamina / Math.max(1, f.maxStamina);
    let p = 0;
    if(st < .25) p += .06;
    const pain = hp < .25 ? .08 : hp < .5 ? .04 : 0;
    p += b.now < f.adrenalineUntil ? 0 : pain;
    if(f.tool === 'unfamiliar') p += .06;
    if(c.footing === 'bad') p += .05;
    if(c.light === 'dark') p += .05;
    if(c.weather === 'rain') p += .03;
    return Math.min(TEMPO_DIALS.mishapCap.value, p);
}

function say(b, text) {
    b.last = text; b.log.push(text); b.log = b.log.slice(-TEMPO_DIALS.logLines.value);
}
function target(b, actorId, wanted) {
    const foes = active(b).filter(id => sideOf(b, id) !== sideOf(b, actorId));
    if(wanted && foes.includes(wanted)) return wanted;
    return foes.sort((x, y) => b.fighters[x].hp - b.fighters[y].hp || (x < y ? -1 : 1))[0] || null;
}

// Named policies choose a move for any fighter. Headless drivers and foes use
// them; a player-facing fight asks the player (LSD315, LSD323).
export const TEMPO_POLICIES = ['aggressive', 'steady', 'safe'];
export function policyMove(b, actorId, policy) {
    const f = b.fighters[actorId], hp = f.hp / f.maxHp, has = id => f.moves.includes(id);
    const foe = target(b, actorId);
    if(f.ally && policy === 'steady') return allyMove(b, actorId, {target});
    const pick = id => ({moveId: id, targetId: id === 'jab' || id === 'swing' ? foe : null});
    if(policy === 'safe') {
        if(hp < .35 && has('withdraw')) return pick('withdraw');
        if(hp < .7 && has('tend') && f.stamina >= TEMPO_MOVES.tend.stamina) return pick('tend');
        return pick(has('guard') ? 'guard' : 'withdraw');
    }
    if(policy === 'aggressive') return pick(has('swing') && f.stamina > f.maxStamina * .4 ? 'swing' : 'jab');
    if(hp < .3 && has('withdraw') && f.side === 'b') return pick('withdraw');
    if(hp < .5 && has('tend') && f.stamina >= TEMPO_MOVES.tend.stamina) return pick('tend');
    return pick(has('swing') && draw(b, 'choice', actorId) < .3 ? 'swing' : 'jab');
}

function finishFight(plan, registry, result) {
    const state = plan.state, session = state.simulation.sessions.player, b = session.nativeBattle;
    b.result = result;
    for(const [id, f] of Object.entries(b.fighters)) {
        const vitals = id === 'player' ? plan.vitals.player : state.simulation.people[id]?.vitals;
        if(vitals) {vitals.health = Math.max(1, Math.min(vitals.max_health ?? f.maxHp, f.hp)); vitals.stamina = Math.min(vitals.max_stamina ?? f.maxStamina, f.stamina);}
    }
    plan.native = {hpToFull: plan.vitals.player.max_health - plan.vitals.player.health, staminaToFull: plan.vitals.player.max_stamina - plan.vitals.player.stamina};
    const held = Math.min(TEMPO_DIALS.heldCapMinutes.value, (b.held || 0) + takeTempoHold());
    const facts = state.actors.player.facts;
    facts[TEMPO_FACT_HELD] = Math.min(TEMPO_DIALS.heldCapMinutes.value, (facts[TEMPO_FACT_HELD] || 0) + held);
    facts['tempo.lastResult'] = result;
    if(result === 'lost') plan.defeat = savedBattleLoss(Object.keys(b.fighters).filter(id => b.fighters[id].side === 'b').map(id => b.fighters[id].name));
    // Allies who fought write the bond (LSD331) and are named in a fact the party route already reads.
    const allies = Object.entries(b.fighters).filter(([id, f]) => f.ally && state.simulation.people[id]);
    if(allies.length) applySimulationEffects(plan, allies.flatMap(([id, f]) => [{type: 'fact', scope: 'actor', key: 'party.lastResult', value: result === 'yielded' ? 'withdrawn' : result},
        {type: 'relationship', target: id, axis: 'familiarity', amount: 1, text: f.status === 'left' ? `${f.name} left the contest before its end.` : `${f.name} fought beside you in the road contest.`}]), {actorId: 'player'}, registry, `tempo-allies:${state.sequence}`);
    // A tempo contest standing in for the road duel closes that pursuit exactly as the native duel does.
    if(session.definitionId === 'rival.native_duel') return finishRoadContest(plan, registry, result === 'yielded' ? 'withdrawn' : result);
    state.simulation.log.push({at: state.clock, text: `${b.title}: ${result}.`, cause: session.id});
    state.simulation.log = state.simulation.log.slice(-100);
    delete state.simulation.sessions.player;
}
const publishers = {won: finishFight, lost: finishFight, withdrawn: finishFight, yielded: finishFight};

function resolveEnd(b, publish, mover, moverId) {
    const theirs = active(b, 'b').length;
    if(!theirs) publish('won'); else if(b.fighters.player.status === 'down') publish('lost');
    else if(mover && mover.status === 'left' && (moverId === 'player' || mover.side === 'b')) publish(mover.side === 'a' ? 'withdrawn' : 'won');
}

function runMove(plan, registry, command, publish) {
    const b = plan.state.simulation.sessions.player.nativeBattle;
    const id = nextActor(b);
    check(id && (command.actorId ?? id) === id, 'It is not that fighter\'s turn.');
    const f = b.fighters[id], move = TEMPO_MOVES[command.moveId];
    check(move && f.moves.includes(command.moveId), 'That fighter cannot make that move.');
    const name = id === 'player' ? 'You' : f.name;
    b.now = f.ready; b.actions++;
    let cost = scaled(move, f);
    if(command.why) say(b, command.why);
    const mishap = move.kind !== 'order' && draw(b, 'mishap', id) < mishapChance(b, f);
    f.guard = false;
    if(mishap) {
        cost += 2; f.stamina = Math.max(0, f.stamina - 1);
        say(b, `${name} ${id === 'player' ? 'stumble' : 'stumbles'}; the move comes to nothing.`);
    } else if(move.kind === 'strike') {
        let foeId = target(b, id, command.targetId);
        check(foeId, 'No one is left to strike.');
        // A covering ally may take the blow meant for the player (LSD319): keyed chance on bond, discipline and fear.
        if(foeId === 'player') {
            const guard = active(b, 'a').find(x => x !== 'player' && activeOrder(b, b.fighters[x])?.id === 'cover' && b.fighters[x].hp > 0);
            if(guard && draw(b, 'cover', guard, {foe: id}) < coverChance(b, b.fighters[guard])) {foeId = guard; say(b, `${b.fighters[guard].name} steps into the blow.`);}
        }
        const foe = b.fighters[foeId], had = f.stamina > 0;
        f.stamina = Math.max(0, f.stamina - Math.min(f.stamina, 1 / (f.profile.stats.stamina_efficiency || 1)));
        let k = 0;
        const random = () => drawFraction(b.seed, checkKey({subject: `${b.id}:strike`, method: 'strike', period: {at: b.actions}, targetState: {draw: k++}, attemptState: {actor: id, foe: foeId}}));
        const strike = rollCombatStrike({attackPower: move.power * f.profile.attackPower * (had && f.stamina === 0 ? (f.profile.emptyStaminaMultiplier || .5) : 1),
            attacker: f.profile.stats, target: foe.profile.stats, shield: foe.profile.shield, shieldSkill: foe.profile.shieldSkill, random});
        const dmg = strike.kind === 'hit' ? mitigateCombatDamageFromStats(strike.values, foe.profile.stats, foe.guard ? TEMPO_DIALS.guardBonus.value : 0, f.profile.stats.armor_penetration ?? 0) : 0;
        if(dmg) {
            foe.hp = Math.max(b.floor, round1(foe.hp - dmg)); foe.guard = false; foe.adrenalineUntil = b.now + 10;
            if(foe.hp <= b.floor) foe.status = 'down';
        }
        // P6 hook: a damaging strike is seen. The crowd leaves a group impression and one promoted witness remembers the striker.
        if(dmg) (plan.memoryEffects ||= []).push({holder: foeId, subject: id, cause: `battle:${b.id}:${b.actions}`, axis: 'respect', amount: -Math.max(1, Math.round(dmg)),
            text: 'Struck in a public fight.', clock: plan.state.clock, scene: {place: b.conditions.place || 'Road', severity: Math.min(4, 1 + Math.floor(dmg * 4 / Math.max(1, foe.hp + dmg)))}});
        const foeName = foeId === 'player' ? 'you' : foe.name;
        say(b, `${name} ${strike.kind === 'hit' ? `hit${id === 'player' ? '' : 's'} ${foeName} for ${round1(dmg)}${strike.critted ? ' (critical)' : ''}` : strike.kind === 'blocked' ? `meet${id === 'player' ? '' : 's'} a full block` : `miss${id === 'player' ? '' : 'es'}`}.`);
    } else if(move.kind === 'order') {
        const ally = b.fighters[command.allyId];
        check(ally?.ally && ally.status === 'active' && ally.side === f.side && ALLY_ORDER_IDS.includes(command.orderId), 'No such ally or order.');
        const heard = hearOrder(b, ally, command.orderId, draw);
        if(heard.ok) {
            ally.ally.order = {id: command.orderId, targetId: command.orderId === 'focus' ? target(b, id) : null, until: b.now + ALLY_DIALS.orderMemory.value};
            say(b, `You tell ${ally.name}: "${ALLY_ORDERS[command.orderId].label}." ${ally.name} nods.`);
        } else say(b, `You tell ${ally.name}: "${ALLY_ORDERS[command.orderId].label}." ${ally.name} ${heard.reason}.`);
    } else if(move.kind === 'guard') {
        f.guard = true; say(b, `${name} brace${id === 'player' ? '' : 's'}.`);
    } else if(move.kind === 'remedy') {
        check(f.stamina >= move.stamina, 'Tending a wound needs two stamina.');
        f.stamina -= move.stamina; f.hp = Math.min(f.maxHp, round1(f.hp + f.maxHp * move.heal));
        say(b, `${name} tend${id === 'player' ? '' : 's'} a wound.`);
    } else if(move.kind === 'withdraw') {
        f.status = 'left'; say(b, `${name} back${id === 'player' ? '' : 's'} away.`);
    } else {
        f.status = 'left'; f.yielded = true; say(b, `${name} yield${id === 'player' ? '' : 's'}.`);
    }
    f.ready += cost; b.seconds += cost; plan.state.sequence++;
    if(move.kind === 'yield' && !mishap) publish(f.side === 'a' ? 'yielded' : 'won');
    else resolveEnd(b, publish, f, id);
}

const definition = {
    id: 'tempo.fight', revision: 1, sides: [['a'], ['b']], objective: 'yield', results: publishers, validate: validateExpansionState,
    prepare({command, plan, publishResult, registry}) {
        return {moves: [{id: 'move', types: ['move'], apply: () => runMove(plan, registry, command, publishResult)}]};
    }
};
function step(state, registry, context, command) {
    const session = state.simulation?.sessions.player, b = session?.nativeBattle;
    check(b?.schema === TEMPO_SCHEMA && !b.result, 'No tempo fight is waiting.');
    return runConflictFrame(definition, {state, registry, context, command: {type: 'move', ...command}});
}

// Foes and allies act on their own until the player is next to act or the fight ends.
function settleAuto(plan, registry, context, driver = null, limit = 400) {
    // Each step builds a fresh plan, so witness memories are carried across steps by hand.
    const carried = [...(plan.memoryEffects || [])], done = p => {if(carried.length) p.memoryEffects = carried; return p;};
    for(let n = 0; n < limit; n++) {
        const b = plan.state.simulation.sessions.player?.nativeBattle;
        if(!b) return done(plan);
        const id = nextActor(b);
        if(!id || (id === 'player' && !driver)) return done(plan);
        const pick = id === 'player' ? policyMove(b, id, driver) : policyMove(b, id, 'steady');
        plan = step(plan.state, registry, context, {actorId: id, ...pick});
        carried.push(...(plan.memoryEffects || []));
    }
    throw new Error('Tempo fight did not settle within its step budget.');
}
function withHold(plan) {
    const b = plan.state.simulation.sessions.player?.nativeBattle;
    if(b) b.held = Math.min(TEMPO_DIALS.heldCapMinutes.value, (b.held || 0) + takeTempoHold());
    return plan;
}

// spec: {id,title,fighters:[{id,name,side,speed,hp,maxHp,stamina,maxStamina,profile,moves,perception,stealth,tool}],conditions,floor}
// An open encounter session (for example the road duel's) may be adopted by passing its plan as spec.adopt.
export function beginTempoFight(state, registry, context, spec) {
    const adopt = spec.adopt || null;
    if(!adopt) check(state.simulation && !Object.keys(state.simulation.sessions).length, 'Another encounter is already open.');
    check(Array.isArray(spec.fighters) && spec.fighters.some(f => f.id === 'player' && f.side === 'a') && spec.fighters.some(f => f.side === 'b'), 'A tempo fight needs the player and an opposing side.');
    const base = adopt ? adopt.state : structuredClone(state), cause = `tempo:${++base.sequence}`;
    const seed = (base.simulation.seed ^ base.sequence ^ 0x7e3d1) >>> 0 || 1;
    const fighters = {};
    for(const f of [...spec.fighters].sort((x, y) => (x.id < y.id ? -1 : 1))) {
        fighters[f.id] = {name: f.name, side: f.side, speed: f.speed ?? 100, ready: 0, hp: f.hp, maxHp: f.maxHp ?? f.hp, stamina: f.stamina ?? 10, maxStamina: f.maxStamina ?? f.stamina ?? 10,
            profile: structuredClone(f.profile), moves: (f.moves || KEEP).filter(m => KEEP.includes(m)), perception: f.perception ?? 5, stealth: f.stealth ?? 5,
            tool: f.tool || 'familiar', ...(f.ally ? {ally: {...structuredClone(f.ally), order: null}} : {}), guard: false, adrenalineUntil: 0, status: 'active', yielded: false};
    }
    if(Object.values(fighters).some(f => f.side === 'a' && f.ally)) fighters.player.moves.push('order');
    const b = {schema: TEMPO_SCHEMA, id: spec.id, title: spec.title || 'A fight', seed, actions: 0, now: 0, seconds: 0, held: 0, floor: spec.floor ?? 0,
        conditions: {light: 'day', footing: 'firm', weather: 'clear', ...spec.conditions}, fighters, log: [], last: '', result: null, surprised: null};
    // Who notices first sets the opening (LSD341): aware side vs the other's best stealth.
    const best = (side, key) => Math.max(...Object.values(fighters).filter(f => f.side === side).map(f => f[key]));
    const aware = side => best(side, 'perception') + 10 * drawFraction(seed, checkKey({subject: `${b.id}:notice`, method: 'notice', period: {at: 0}, targetState: {side}})) >= best(side === 'a' ? 'b' : 'a', 'stealth');
    const [a, bb] = [aware('a'), aware('b')];
    if(a !== bb) {
        const slow = a ? 'b' : 'a'; b.surprised = slow;
        for(const f of Object.values(fighters)) if(f.side === slow) f.ready += TEMPO_DIALS.surpriseDelay.value;
        say(b, slow === 'a' ? 'You are caught off guard.' : 'They are caught off guard.');
    } else say(b, 'Both sides see each other at once.');
    if(adopt) adopt.state.simulation.sessions.player.nativeBattle = b;
    else base.simulation.sessions.player = {id: cause, definitionId: 'tempo.fight', revision: 1, targetId: null, commandId: 'tempo.fight', claim: null, turns: [{responses: []}], turn: 0, lethal: false, settlement: [], answers: [], partyIds: [], participants: Object.keys(fighters).filter(id => id === 'player' || base.simulation.people[id]), nativeBattle: b};
    const plan = adopt || {state: base, external: structuredClone(context.external), gameplay: structuredClone(context.gameplay), vitals: structuredClone(context.vitals), acquisitions: [], unlocks: []};
    validateTempoBattle(b, plan.state.simulation.sessions.player);
    return withHold(settleAuto(plan, registry, adopt ? {...context, external: adopt.external, gameplay: adopt.gameplay, vitals: adopt.vitals} : context));
}

// The player's own move. Everyone else then acts until the player is next.
export function commitTempoMove(state, registry, context, command, expectedSequence = state.sequence) {
    check(state.sequence === expectedSequence, 'This combat action is stale.');
    check(nextActor(state.simulation.sessions.player?.nativeBattle ?? {fighters: {}}) === 'player', 'It is not your turn.');
    return withHold(settleAuto(step(state, registry, context, {actorId: 'player', ...command}), registry, context));
}

// Headless and test drivers name who decides; the wait is a player rule (LSD323).
export function driveTempoFight(state, registry, context, policy) {
    check(TEMPO_POLICIES.includes(policy), 'A driver must name a policy.');
    const plan = {state, external: structuredClone(context.external), gameplay: structuredClone(context.gameplay), vitals: structuredClone(context.vitals), acquisitions: [], unlocks: []};
    return withHold(settleAuto(plan, registry, context, policy));
}
// Opt-in hand-over: the player's policy plays only safe moves (LSD316), never a new attack.
export function handOverTempoFight(state, registry, context, {steps = 1} = {}) {
    let plan = null, s = state;
    for(let n = 0; n < steps; n++) {
        const b = s.simulation.sessions.player?.nativeBattle;
        if(!b || nextActor(b) !== 'player') break;
        const pick = policyMove(b, 'player', 'safe');
        check(TEMPO_MOVES[pick.moveId].safe, 'Hand-over may only choose safe moves.');
        plan = commitTempoMove(s, registry, context, pick); s = plan.state;
    }
    check(plan, 'Nothing to hand over.');
    return plan;
}

// Text-first view (LSD314): one line per step and a who-acts-next strip.
export function tempoView(b) {
    const next = actingOrder(b).map(id => id === 'player' ? 'You' : b.fighters[id].name);
    const mine = nextActor(b) === 'player';
    const me = b.fighters.player;
    return {title: b.title, lines: [...b.log], next, yourTurn: mine && !b.result, result: b.result,
        moves: mine ? me.moves.filter(id => id !== 'order').map(id => ({id, label: TEMPO_MOVES[id].label, text: TEMPO_MOVES[id].text, cost: scaled(TEMPO_MOVES[id], me), safe: TEMPO_MOVES[id].safe,
            usable: id !== 'tend' || me.stamina >= TEMPO_MOVES.tend.stamina, why: id === 'tend' && me.stamina < TEMPO_MOVES.tend.stamina ? 'Needs two stamina.' : ''})) : [],
        orders: mine && me.moves.includes('order') ? active(b, 'a').filter(id => b.fighters[id].ally).flatMap(id => ALLY_ORDER_IDS.map(o => ({allyId: id, orderId: o, label: `${b.fighters[id].name}: ${ALLY_ORDERS[o].label}`,
            text: ALLY_ORDERS[o].text, cost: scaled(TEMPO_MOVES.order, me), odds: oddsWord(orderChance(b, b.fighters[id]))}))) : [],
        allies: active(b, 'a').filter(id => b.fighters[id].ally).map(id => ({id, name: b.fighters[id].name, hurt: b.fighters[id].hp / b.fighters[id].maxHp > .66 ? 'steady' : b.fighters[id].hp / b.fighters[id].maxHp > .33 ? 'hurt' : 'barely standing',
            order: activeOrder(b, b.fighters[id])?.id ? ALLY_ORDERS[activeOrder(b, b.fighters[id]).id].label : null})),
        foes: active(b, 'b').map(id => ({id, name: b.fighters[id].name, hurt: b.fighters[id].hp / b.fighters[id].maxHp > .66 ? 'fresh' : b.fighters[id].hp / b.fighters[id].maxHp > .33 ? 'hurt' : 'barely standing'}))};
}

export const tempoKey = address;
