import {check} from './basics.js';
import {tempoOpeners} from './tempo_starters.js';
import {address, drawFraction} from './gen_kit.js';
import {checkKey} from './check_keys.js';
import {rollCombatStrike, mitigateCombatDamageFromStats} from './combat_math.js';
import {typedHit} from './damage_types.js';
import {runConflictFrame} from './conflict_frame.js';
import {validateExpansionState} from './expansion_engine.js';
import {savedBattleLoss} from './defeat_domain.js';
import {finishRoadContest} from './native_battle.js';
import {applySimulationEffects} from './simulation_effects.js';
import {allyMove, hearOrder, coverChance, activeOrder, orderChance, oddsWord, ALLY_ORDERS, ALLY_ORDER_IDS, ALLY_DIALS} from './tempo_allies.js';
import {SLOTS, SLOT_IDS, LOCATION_DIALS, weights as slotWeights, pickSlot, defenceAt, oddsOf, injuryFor, partLabel} from './tempo_location.js';
import {leaveChance, yieldChance, followers, EXIT_DIALS} from './tempo_exit.js';
import {winChance} from './notch_contest.js';
import {stockEdge, stockKindLabel} from './stock_kinds.js';
import {tempoStakes, kitWhy, kitCostText, kitDetail} from './tempo_kit.js';
import {TEMPO_SCHEMA, TEMPO_LOG_LINES, TEMPO_MOVE_IDS, TEMPO_ALLOWED_MOVE_IDS, TEMPO_FACT_HELD, recordTempoHold, takeTempoHold, validateTempoBattle} from './tempo_fight_contract.js';
export {TEMPO_SCHEMA, TEMPO_FACT_HELD, recordTempoHold, takeTempoHold, validateTempoBattle};

// Tempo fights (LSD307-LSD317, LSD341-LSD343): every move costs time units, the
// earliest-ready fighter acts, and a fight waits for the player with no clock.
// One runner (conflict_frame) drives it; numbers below are defaults with a dial,
// not laws. Draws are keyed (LSD139): same situation, same result on replay.
export const TEMPO_DIALS = {
    heldCapMinutes: {value: 7 * 24 * 60, why: 'Away time is kept, but a week is the longest one fight can bank.'},
    surpriseDelay: {value: 3, why: 'A surprised side loses about one quick move before it can act. Calibration (P8) found two moves made an ambush a near-certain loss.'},
    mishapCap: {value: .35, why: 'Even the worst conditions leave most moves working.'},
    guardBonus: {value: 2, why: 'A braced fighter takes a little less from the next blow.'},
    logLines: {value: TEMPO_LOG_LINES, why: 'The log is a short readable tail, not history.'},
    fogMishap: {value: .03, why: 'Fog hides footing and the mark a little; less than full dark, which also hides the hands.'},
    shotDamage: {value: 'maxHp / downIn', why: 'Bridge from a world scale (e.g. LOTM hits-to-down) to tempo health: each hit takes an equal share, so downIn hits drop the target. Authored dial.'},
    stallActions: {value: 30, why: 'AT21: when two weak fighters cannot hurt each other (a hit chance near zero, or blows that do almost nothing), the fight would run forever. After this many moves in a row with no harm to anyone, both sides are spent and break off (ends as withdrawn, no grudge, no one follows). About a ten percent shooter still lands one in thirty about 96 times in 100. Set to 0 to turn it off.'},
    channelNotice: {value: 'winChance(perceive - conceal)', why: 'A concealed effect (conceal above 0) is seen only by an observer with a perceive value, by one keyed draw on the notch scale: an equal noticer catches it half the time, each notch of edge moves that by roughly a quarter, and no perceive value means nothing is shown and no draw is made. An effect in the open (conceal 0) is always logged. The holder always sees their own effect.'},
    holdFailBase: {value: .05, why: 'CBD213: holding back is a skill with a failure. One downing blow in twenty slips past restraint even when the force was right.'},
    holdFailForce: {value: .8, why: 'CBD213: a means too strong for the occasion. Each share of the body\'s health a blow carries beyond what downed it adds this much to the slip (a Gu blade held back on a wolf fails far more often than a fist).'},
    outright: {value: .5, why: 'CBC4: a blow carrying half a body\'s health past the point that downed it leaves no window to decide in.'},
    pleaBase: {value: .25, why: 'A plea to stop short of killing is heard about one time in four from someone set on harm, more as their aim softens (their goals) and as they are hurt.'},
    wardCast: {value: .6, why: 'A held ward (a shield charm, a guarding Gu) makes a cast at its holder about four in ten less likely to land, beside taking the edge off a blow.'},
    witnessPerStrike: {value: false, why: 'A witness remembers a fight as one event (LSD351); one memory per strike would fill their record. Tests or a world that wants every blow remembered can turn this on.'}
};
// Costs are time units (about seconds). Power scales the existing strike math;
// safe moves are the only ones an opt-in hand-over may choose (LSD316).
export const TEMPO_MOVES = {
    jab: {label: 'Quick strike', kind: 'strike', cost: 3, power: .7, safe: false, text: 'A fast, light blow. Cheap in time, small in harm.'},
    swing: {label: 'Heavy swing', kind: 'strike', cost: 6, power: 1.4, safe: false, text: 'A slow, hard blow. Leaves you open longer.'},
    guard: {label: 'Brace', kind: 'guard', cost: 2, safe: true, text: 'Take the next blow better. Costs a little time.'},
    tend: {label: 'Tend a wound', kind: 'remedy', cost: 5, heal: .15, stamina: 2, safe: true, text: 'Stop the worst of the bleeding. Needs two stamina.'},
    withdraw: {label: 'Back away', kind: 'withdraw', cost: 4, safe: true, text: 'Try to leave. A miss costs a free blow; a clean exit can still leave a friend behind or a grudge following.'},
    yield: {label: 'Yield', kind: 'yield', cost: 2, safe: true, text: 'Offer to give up while you can still stand. The other side may refuse.'},
    // Stakes and fate moves (Weibao, 2026-11-14: "it all depends, maybe its a choice? like result of fight? more? Can change mid way through"):
    // offered by the fight's stakes, not carried in a fighter's move list, so saved fights and move lists are unchanged.
    plead: {label: 'Ask them not to kill', kind: 'plead', cost: 2, safe: true, text: 'Call for an end short of killing. They may agree; then a downing blow only knocks out, for both sides.'},
    escalate: {label: 'Go for the kill', kind: 'escalate', cost: 1, safe: false, text: 'Make it plain you mean to kill. From now a downing blow can kill, for both sides.'},
    finish: {label: 'Finish them', kind: 'fate', cost: 2, safe: false, text: 'They are down and helpless. End it.'},
    spare: {label: 'Spare them', kind: 'fate', cost: 1, safe: true, text: 'They are down. Leave them alive.'},
    order: {label: 'Give an order', kind: 'order', cost: 2, safe: false, text: 'Say it to an ally. Costs a little time and may not be heard.'},
    // Stock moves (FD3/FD17): only fighters granted them and carrying stock see them. Odds come from the world's own scale, set when the fight begins.
    shoot: {label: 'Fire', kind: 'shoot', cost: 3, safe: false, text: 'Spend one loaded round on the nearest foe. Misses still spend it.'},
    reload: {label: 'Reload', kind: 'reload', cost: 6, safe: true, text: 'Load carried rounds into the empty chambers. Slow, and you are open while you do it.'}
};
const KEEP = TEMPO_MOVE_IDS.filter(m => m !== 'order');
const natural = n => Number.isSafeInteger(n) && n >= 0;
const sideOf = (b, id) => b.fighters[id].side;
const active = (b, side) => Object.keys(b.fighters).filter(id => b.fighters[id].status === 'active' && (!side || b.fighters[id].side === side)).sort();
const round1 = n => Math.round(n * 10) / 10;
const scaled = (move, f) => Math.max(1, Math.round(move.cost * 100 / (f.speed * oddsOf(f).speed)));
// A fighter's own kit rows (tempo_kit.js) sit beside the shared moves; `kind` is derived from what the row does, never from its label.
// Moves the fight itself offers: the fate of a body you downed, and changing the stakes (a plea while it can kill, going for the kill while it cannot).
export const STAKES_MOVE_IDS = ['plead', 'escalate', 'finish', 'spare'];
// What follows each choice, as the character would know it (PS22, PRS1). An opener may give a foe its own `fateText`; a beast and a person differ.
const isBeast = f => !!f?.tags?.includes('beast');
export function fateText(f) {
    const own = f.fateText || {};
    return {finish: own.finish ?? (isBeast(f) ? 'It dies.' : 'They die here, by your hand.'),
        spare: own.spare ?? (isBeast(f) ? 'It limps away.' : 'They live. They will remember this.'), ...(own.detail ? {detail: own.detail} : {})};
}
// Why a plea cannot work, by mechanism (PS25): a beast does not bargain.
const pleaWhy = b => { const them = active(b, 'b').map(id => b.fighters[id]); return them.length && them.every(isBeast) ? `${them[0].name.replace(/^A /, 'The ')} does not bargain.` : ''; };
// A shift in stakes is an event the card shows once (PS23): the new state and one line of why.
const shift = (b, cue) => { b.stakes.cue = cue.slice(0, 300); };
const fates = (b, actorId) => Object.entries(b.fate || {}).filter(([, by]) => by === actorId).map(([id]) => id);
export function offered(b, actorId) {
    if(!b.stakes || b.fighters[actorId]?.status !== 'active') return [];
    return [...(fates(b, actorId).length ? ['finish', 'spare'] : []), ...(actorId === 'player' && active(b, 'b').length ? [b.stakes.lethal ? 'plead' : 'escalate'] : [])];
}
export const moveRow = (f, id) => TEMPO_MOVES[id] ?? (f.kit?.[id] ? {...f.kit[id], kind: f.kit[id].ward ? 'ward' : 'kit', safe: !!f.kit[id].ward || !!f.kit[id].safe} : null);
const isAttack = row => row && (row.kind === 'strike' || (row.kind === 'kit' && ((row.power ?? 0) > 0 || row.force > 0 || row.binds || row.stun || Object.keys(row.takes || {}).length)));
// How strongly a policy wants a usable attack row: binding or disarming ends a fight cleanly, then raw harm.
const kitScore = r => (r.binds ? 30 : 0) + (Object.keys(r.takes || {}).length ? 20 : 0) + (r.force ?? (r.power ?? 0) * 10) + (r.stun ? 5 : 0);
function kitPick(b, f, actorId, {ward = false} = {}) {
    // `whenHurt`: a row kept back until the fighter is hurt below that share (a temper lost, a knife drawn).
    const rows = Object.entries(f.kit || {}).filter(([id, r]) => f.moves.includes(id) && !kitWhy(f, r) && (ward ? !!r.ward : isAttack(moveRow(f, id))) && !(r.whenHurt && f.hp / f.maxHp > r.whenHurt));
    return rows.sort(([x, a], [y, c]) => kitScore(c) - kitScore(a) || (x < y ? -1 : 1))[0]?.[0] ?? null;
}
// A body that goes down: in a lethal fight any downing blow can kill (CFC9, Weibao 2026-11-14: "fists can kill too"), unless the striker
// holds back or the move cannot kill. The player is never killed in this slice (AD50: a run-ending threat needs its announcement and exits).
// Since the 2026-11-14 follow-up a downing blow in a lethal fight leaves a window (CBC4): the striker decides, with a move, whether to finish or spare.
// A blow far past what downed the body leaves no window (outright); holding back can slip (CBD213), more often with a means too strong for it.
function downed(b, foeId, strikerId, row, over = 0) {
    const foe = b.fighters[foeId];
    foe.status = 'down';
    if(!b.stakes) return;
    const striker = b.fighters[strikerId];
    if(!b.stakes.lethal || foeId === 'player' || row?.lethal === false) { foe.end = 'knocked_out'; return; }
    const share = Math.max(0, over) / Math.max(1, foe.maxHp);
    if(striker?.holdBack) {
        const slip = Math.min(.9, TEMPO_DIALS.holdFailBase.value + TEMPO_DIALS.holdFailForce.value * share);
        if(draw(b, 'restraint', strikerId, {foe: foeId}) < slip) { foe.end = 'killed'; shift(b, `${strikerId === 'player' ? 'Your' : `${striker.name}'s`} restraint slipped.`); say(b, `${strikerId === 'player' ? 'You could not' : `${striker.name} could not`} hold that blow back.`); }
        else foe.end = 'knocked_out';
        return;
    }
    if(share >= TEMPO_DIALS.outright.value) { foe.end = 'killed'; return; }
    foe.end = 'downed';
    if(striker?.side === 'a' && strikerId === 'player') (b.fate ||= {})[foeId] = strikerId;
    else foe.end = draw(b, 'fate', strikerId, {foe: foeId}) < (striker?.goals?.aim ?? .3) * .5 ? 'killed' : 'knocked_out'; // others decide at once, by how set on harm they are
}

// Equal ready time and speed is settled by a per-fight shuffle, never by name: calibration (P8) showed an id-order tie handed the first blow to the foe every time.
const tieRank = (b, id) => { let h = (b.seed ^ 0x9e3779b9) >>> 0; for(const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0; return h; };
const byTurn = b => (x, y) => b.fighters[x].ready - b.fighters[y].ready || b.fighters[y].speed - b.fighters[x].speed || tieRank(b, x) - tieRank(b, y) || (x < y ? -1 : 1);
export function nextActor(b) {
    return active(b).sort(byTurn(b))[0] || null;
}
export function actingOrder(b, count = 3) {
    return active(b).sort(byTurn(b)).slice(0, count);
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
    if(c.visibility === 'fog') p += TEMPO_DIALS.fogMishap.value;
    return Math.min(TEMPO_DIALS.mishapCap.value, p);
}

const witnessEffect = (plan, b, holder, subject, amount, severity, place, cause) => ({holder, subject, cause, axis: 'respect', amount: -amount,
    text: 'Struck in a public fight.', clock: plan.state.clock, scene: {place, severity}});
function say(b, text) {
    b.last = text; b.log.push(text); b.log = b.log.slice(-TEMPO_DIALS.logLines.value);
}
// Channel effects (lane W7-B, N3): the log is the player's view, so the player is the one observer. The line is decided here, when written, so a concealed
// effect that was not noticed never reaches b.log or b.last. One keyed draw per use, and none when no contest exists (open, own, or no perceive value).
function channelLine(b, actorId, f, moveId) {
    const c = f.channels?.[moveId];
    if(!c) return;
    const me = b.fighters.player, conceal = c.conceal ?? 0;
    const seen = actorId === 'player' || conceal <= 0 || (me.perceive !== undefined && draw(b, 'perceive', actorId, {move: moveId, channel: c.channel}) < winChance(me.perceive - conceal));
    if(seen) say(b, c.text); else if(c.neutral) say(b, c.neutral);
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
    const pick = policyChoice(b, actorId, policy), f = b.fighters[actorId];
    // An injury that stops striking (the extreme rung only) leaves the safe moves.
    if(isAttack(moveRow(f, pick.moveId)) && !oddsOf(f).allowed) return {moveId: f.moves.includes('guard') ? 'guard' : 'withdraw', targetId: null, why: ''};
    return pick;
}
function policyChoice(b, actorId, policy) {
    const f = b.fighters[actorId], hp = f.hp / f.maxHp, has = id => f.moves.includes(id);
    const foe = target(b, actorId);
    if(f.ally && policy === 'steady') return allyMove(b, actorId, {target});
    const pick = id => ({moveId: id, targetId: id === 'jab' || id === 'swing' || id === 'shoot' || isAttack(moveRow(f, id)) && moveRow(f, id).kind === 'kit' ? foe : null});
    // A body down at this fighter's feet is decided first: a careful policy spares; a hunt or skirmish finishes, anything else spares.
    if(fates(b, actorId).length) return {moveId: policy !== 'safe' && ['hunt', 'skirmish'].includes(b.stakes?.preset) ? 'finish' : 'spare', targetId: fates(b, actorId)[0]};
    // Kit first when it can be used (a spell, a Gu): a fighter fights with what it carries; the fists are what is left (SF6).
    if(policy !== 'safe' && f.kit) {
        const w = hp < .5 && !f.guard ? kitPick(b, f, actorId, {ward: true}) : null;
        if(w) return pick(w);
        const k = kitPick(b, f, actorId);
        if(k && (policy === 'aggressive' || draw(b, 'kit', actorId) < .8)) return pick(k);
    }
    if(policy !== 'safe' && has('shoot') && f.stock) {
        if(f.stock.loaded > 0 && f.stock.vs[foe]) return pick('shoot');
        if(has('reload') && f.stock.carried > 0 && f.stock.loaded < f.stock.capacity) return pick('reload');
    }
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
    // A body still waiting when the fight ends was left lying: it lives (CBC4's window closes on nobody's decision).
    for(const id of Object.keys(b.fate || {})) if(b.fighters[id].end === 'downed') b.fighters[id].end = 'knocked_out';
    delete b.fate;
    // The player's injuries go to the harm ladder through its one door; the host applies them after the commit (L9 owns the ladder).
    const hurt = Object.entries(b.fighters.player.parts || {});
    if(hurt.length) plan.harmEffects = hurt.map(([partId, rung]) => ({partId, rung, cause: `fight:${b.id}`}));
    for(const w of Object.values(b.worst || {})) (plan.memoryEffects ||= []).push(witnessEffect(plan, b, w.holder, w.subject, Math.max(1, Math.round(w.amount)), w.severity, w.place, `battle:${b.id}`));
    for(const [id, f] of Object.entries(b.fighters)) {
        const vitals = id === 'player' ? plan.vitals.player : state.simulation.people[id]?.vitals;
        if(vitals) {vitals.health = Math.max(1, Math.min(vitals.max_health ?? f.maxHp, f.hp)); vitals.stamina = Math.min(vitals.max_stamina ?? f.maxStamina, f.stamina);}
    }
    stagePlayerVitals(plan);
    // Rounds spent or loaded go back to the player's own stock counts once, in the same commit as the result (FD3).
    const st = b.fighters.player.stock;
    if(st?.keys) {
        const moved = [[st.keys.loaded, st.loaded - st.start.loaded], [st.keys.carried, st.carried - st.start.carried]].filter(([, n]) => n);
        if(moved.length) applySimulationEffects(plan, moved.map(([key, amount]) => ({type: 'resource', actor: 'player', key, amount})), {actorId: 'player'}, registry, `tempo-stock:${state.sequence}`);
    }
    // A world's opener may settle what the fight changed in its own world (a counted population, say) inside this same commit.
    for(const o of tempoOpeners()) if(o.after && o.owns?.(b.id)) o.after(plan, result, b);
    const held = Math.min(TEMPO_DIALS.heldCapMinutes.value, (b.held || 0) + takeTempoHold());
    const facts = state.actors.player.facts;
    facts[TEMPO_FACT_HELD] = Math.min(TEMPO_DIALS.heldCapMinutes.value, (facts[TEMPO_FACT_HELD] || 0) + held);
    facts['tempo.lastResult'] = result;
    // How each opposing fighter ended, for the host's result block (not saved: the host turns it into player text).
    plan.fightEnd = Object.values(b.fighters).filter(f => f.side === 'b').map(f => ({name: f.name, end: f.end ?? (f.status === 'down' ? 'down' : f.yielded ? 'yielded' : f.status === 'left' ? 'withdrew' : 'stood')}));
    if(b.fighters.player.end) plan.playerEnd = b.fighters.player.end;
    if(result === 'lost') plan.defeat = savedBattleLoss(Object.keys(b.fighters).filter(id => b.fighters[id].side === 'b').map(id => b.fighters[id].name));
    // Allies who fought write the bond (LSD331) and are named in a fact the party route already reads.
    const allies = Object.entries(b.fighters).filter(([id, f]) => f.ally && state.simulation.people[id]);
    if(allies.length) applySimulationEffects(plan, allies.flatMap(([id, f]) => [{type: 'fact', scope: 'actor', key: 'party.lastResult', value: result === 'yielded' ? 'withdrawn' : result},
        {type: 'relationship', target: id, axis: 'familiarity', amount: 1, text: f.status === 'left' ? `${f.name} left the contest before its end.` : `${f.name} fought beside you in the road contest.`}]), {actorId: 'player'}, registry, `tempo-allies:${state.sequence}`);
    // The price of leaving (LSD368): allies left behind, a follower, and a grudge (LSD331).
    if(b.exit && b.fighters.player.status === 'left') {
        const left = b.exit.leftBehind.filter(id => state.simulation.people[id]).map(id => ({type: 'relationship', target: id, axis: 'familiarity', amount: -1, text: `You left ${b.fighters[id].name} in the contest when you ${b.exit.kind === 'yielded' ? 'yielded' : 'backed out'}.`}));
        const facts = b.exit.followedBy.length ? [{type: 'fact', scope: 'actor', key: 'tempo.followed_by', value: b.exit.followedBy.join(',')}] : [];
        if(left.length || facts.length) applySimulationEffects(plan, [...left, ...facts], {actorId: 'player'}, registry, `tempo-exit:${state.sequence}`);
    }
    // A tempo contest standing in for the road duel closes that pursuit exactly as the native duel does.
    if(session.definitionId === 'rival.native_duel') return finishRoadContest(plan, registry, result === 'yielded' ? 'withdrawn' : result);
    state.simulation.log.push({at: state.clock, text: `${b.title}: ${result}.`, cause: session.id});
    state.simulation.log = state.simulation.log.slice(-100);
    delete state.simulation.sessions.player;
}
const publishers = {won: finishFight, lost: finishFight, withdrawn: finishFight, yielded: finishFight};

// The existing native transaction writes these offsets into the save before
// publishing them to the live character. Stage them for every visible turn,
// as well as settlement, so the fight and the character share one health.
function stagePlayerVitals(plan) {
    const v = plan.vitals.player;
    plan.native = {...plan.native, hpToFull: v.max_health - v.health, staminaToFull: v.max_stamina - v.stamina};
}

function resolveEnd(b, publish, mover, moverId) {
    const theirs = active(b, 'b').length;
    if(!theirs && fates(b, 'player').length && b.fighters.player.status === 'active') return; // the window: the player decides before the fight ends
    if(!theirs) publish('won'); else if(b.fighters.player.status === 'down') publish('lost');
    else if(mover && mover.status === 'left' && (moverId === 'player' || mover.side === 'b')) publish(mover.side === 'a' ? 'withdrawn' : 'won');
}

const END_LINE = {downed: 'is down and helpless', killed: 'is dead', knocked_out: 'is out cold', disarmed: 'has lost the wand', bound: 'is bound and cannot fight on'};
const endLine = (id, f) => `${id === 'player' ? 'You are' : f.name} ${id === 'player' ? (f.end === 'disarmed' ? 'disarmed' : f.end === 'bound' ? 'bound' : 'down') : END_LINE[f.end] ?? 'goes down'}.`;
// A kit row cast at a foe (tempo_kit.js): spend, roll to land on the shared strike math, then harm, take, hold or bind by what the row says.
function runKit(b, id, f, name, command, move) {
    const why = kitWhy(f, move); check(!why, why);
    const foeId = target(b, id, command.targetId); check(foeId, 'No one is left to aim at.');
    const odds = oddsOf(f); check(odds.allowed, `${odds.blockedBy?.reason || 'An injury'} stops you.`);
    for(const [q, n] of Object.entries(move.spends || {})) f.means[q] -= n;
    const foe = b.fighters[foeId], foeName = foeId === 'player' ? 'you' : foe.name, s = id === 'player' ? '' : 's';
    let k = 0;
    const random = () => drawFraction(b.seed, checkKey({subject: `${b.id}:kit`, method: 'kit', period: {at: b.actions}, targetState: {draw: k++}, attemptState: {actor: id, foe: foeId, move: command.moveId}}));
    const power = (move.power ?? 0) > 0 ? move.power : .7; // a cast with no harm still lands like a quick blow would
    const strike = rollCombatStrike({attackPower: move.force ?? power * f.profile.attackPower, attacker: f.profile.stats, target: foe.profile.stats, shield: foe.profile.shield, shieldSkill: foe.profile.shieldSkill, random,
        hitModifier: odds.accuracy * (move.hit ?? 1) * (foe.guard && foe.ward ? TEMPO_DIALS.wardCast.value : 1), evasionModifier: oddsOf(foe).evasion});
    if(strike.kind !== 'hit') { say(b, `${name} use${s} ${move.label} on ${foeName}, ${strike.kind === 'blocked' ? 'and it is blocked' : 'and it misses'}.`); return false; }
    const bits = [];
    let dmg = 0, over = 0;
    if((move.power ?? 0) > 0 || move.force > 0) {
        dmg = mitigateCombatDamageFromStats(strike.values, foe.profile.stats, foe.guard ? (foe.ward ?? TEMPO_DIALS.guardBonus.value) : 0, f.profile.stats.armor_penetration ?? 0, 1);
        if(dmg) { over = dmg - (foe.hp - b.floor); foe.hp = Math.max(b.floor, round1(foe.hp - dmg)); foe.adrenalineUntil = b.now + 10; bits.push(`for ${round1(dmg)}${strike.critted ? ' (critical)' : ''}`); }
    }
    foe.guard = false; delete foe.ward;
    for(const [q, n] of Object.entries(move.takes || {})) if((foe.means?.[q] ?? 0) > 0) {
        foe.means[q] = Math.max(0, foe.means[q] - n);
        bits.push(q === 'wand' ? `${foeId === 'player' ? 'your' : 'the'} wand flies out of ${foeId === 'player' ? 'your' : 'their'} hand` : `${foeId === 'player' ? 'you lose' : 'they lose'} ${q.replace(/_/g, ' ')}`);
        if(b.stakes?.disarm === q && foe.means[q] <= 0) { foe.status = 'down'; foe.end = 'disarmed'; }
    }
    if(move.stun && foe.status === 'active') { foe.ready = Math.max(foe.ready, b.now) + move.stun; bits.push(`${foeId === 'player' ? 'you are' : 'they are'} held in place`); }
    if(move.binds && foe.status === 'active') { foe.status = 'down'; foe.end = 'bound'; }
    if(foe.status === 'active' && foe.hp <= b.floor) downed(b, foeId, id, move, over);
    // A temper lost or a knife drawn (row `escalates`): from this move on the fight can kill.
    if(move.escalates && b.stakes && !b.stakes.lethal) { b.stakes.lethal = true; shift(b, `${name} drew a ${move.label.split(' ')[0].toLowerCase()}.`); say(b, `${name === 'You' ? 'You make' : `${name} makes`} it a fight to the death.`); }
    say(b, `${name} use${s} ${move.label} on ${foeName}: it lands${bits.length ? `, ${bits.join(', ')}` : ''}.`);
    if(foe.status === 'down') say(b, endLine(foeId, foe));
    return true; // a landed cast is progress even without harm (the stall count, AT21)
}

function runMove(plan, registry, command, publish) {
    const b = plan.state.simulation.sessions.player.nativeBattle;
    const id = nextActor(b);
    check(id && (command.actorId ?? id) === id, 'It is not that fighter\'s turn.');
    const f = b.fighters[id], move = moveRow(f, command.moveId);
    check(move && (f.moves.includes(command.moveId) || offered(b, id).includes(command.moveId)), 'That fighter cannot make that move.');
    const name = id === 'player' ? 'You' : f.name;
    b.now = f.ready; b.actions++;
    let cost = scaled(move, f);
    if(command.why) say(b, command.why);
    let harmed = false;
    const mishap = move.kind !== 'order' && draw(b, 'mishap', id) < mishapChance(b, f);
    f.guard = false; delete f.ward;
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
        const odds = oddsOf(f), foeOdds = oddsOf(foe), aim = SLOT_IDS.includes(command.aim) ? command.aim : null;
        check(odds.allowed, `${odds.blockedBy?.reason || 'An injury'} stops you striking.`);
        if(aim) cost += LOCATION_DIALS.aimCost.value;
        f.stamina = Math.max(0, f.stamina - Math.min(f.stamina, 1 / (f.profile.stats.stamina_efficiency || 1)));
        let k = 0;
        const random = () => drawFraction(b.seed, checkKey({subject: `${b.id}:strike`, method: 'strike', period: {at: b.actions}, targetState: {draw: k++}, attemptState: {actor: id, foe: foeId}}));
        const strike = rollCombatStrike({attackPower: move.power * f.profile.attackPower * (had && f.stamina === 0 ? (f.profile.emptyStaminaMultiplier || .5) : 1),
            attacker: f.profile.stats, target: foe.profile.stats, shield: foe.profile.shield, shieldSkill: foe.profile.shieldSkill, random,
            hitModifier: odds.accuracy * (aim ? LOCATION_DIALS.aimHitPenalty.value : 1), evasionModifier: foeOdds.evasion});
        // Where it landed, what the armour on that slot stopped, and the harm to the part (G6).
        let slot = null, stopped = 0, injury = null, dmg = 0, typed = null;
        if(strike.kind === 'hit') {
            slot = pickSlot(slotWeights(f, foe, {id: command.moveId}, aim, odds.precision), draw(b, 'location', id, {foe: foeId}));
            // Damage types (COMBAT.md round 3): the attack mix against the defender's per-type map, both read from the live actors at the start.
            // A fight saved before types has neither and reads as untyped physical (x1).
            typed = f.profile.types || foe.profile.types ? typedHit(f.profile.types?.attack, foe.profile.types?.defense) : null;
            const def = defenceAt(foe.profile, slot, typed), guardMod = foe.guard ? (foe.ward ?? TEMPO_DIALS.guardBonus.value) : 0, pen = f.profile.stats.armor_penetration ?? 0, scale = SLOTS[slot].scale * (typed?.multiplier ?? 1);
            dmg = mitigateCombatDamageFromStats(strike.values, {...foe.profile.stats, defense: def.total}, guardMod, pen, scale);
            if(def.worn > 0) stopped = round1(Math.max(0, mitigateCombatDamageFromStats(strike.values, {...foe.profile.stats, defense: def.base}, guardMod, pen, scale) - dmg));
        }
        if(dmg) {
            harmed = true;
            const over = dmg - (foe.hp - b.floor);
            foe.hp = Math.max(b.floor, round1(foe.hp - dmg)); foe.guard = false; delete foe.ward; foe.adrenalineUntil = b.now + 10;
            if(foe.hp <= b.floor) downed(b, foeId, id, move, over);
            const part = SLOTS[slot].part, next = part ? injuryFor(foe.parts?.[part], dmg, foe.maxHp, strike.critted) : null;
            if(next) {(foe.parts ||= {})[part] = next; injury = `${partLabel(part)}: ${next}`;}
        }
        // The player's side learns how this foe takes the blow's main type by seeing it land.
        if(typed && f.side === 'a' && foe.side === 'b') (foe.learned ||= {})[typed.kind] = typed.note || 'normal';
        if(slot) b.hits = [...(b.hits || []), {actor: id, target: foeId, slot, dmg: round1(dmg), stopped, multiplier: typed?.multiplier ?? 1, split: typed?.split ?? {physical: 1}, ...(injury ? {injury} : {})}].slice(-TEMPO_DIALS.logLines.value);
        // P6 hook: a damaging strike is seen. By default the fight keeps only its worst moment per pair and writes one witnessed memory at the end;
        // the crowd then leaves a group impression and one promoted witness remembers the striker.
        if(dmg) {
            const severity = Math.min(4, 1 + Math.floor(dmg * 4 / Math.max(1, foe.hp + dmg))), place = b.conditions.place || 'Road';
            if(TEMPO_DIALS.witnessPerStrike.value) (plan.memoryEffects ||= []).push(witnessEffect(plan, b, foeId, id, Math.max(1, Math.round(dmg)), severity, place, `battle:${b.id}:${b.actions}`));
            else {
                const w = (b.worst ||= {})[`${foeId}>${id}`] ||= {holder: foeId, subject: id, severity: 0, amount: 0, place};
                w.amount = round1(w.amount + dmg); w.severity = Math.max(w.severity, severity);
            }
        }
        const foeName = foeId === 'player' ? 'you' : foe.name;
        say(b, `${name} ${strike.kind === 'hit' ? `hit${id === 'player' ? '' : 's'} ${foeName} ${slot === 'head' ? 'in the head' : slot === 'torso' ? 'in the body' : `on the ${SLOTS[slot].label}`} for ${round1(dmg)}${typed ? ` ${typed.kind}` : ''}${strike.critted ? ' (critical)' : ''}${typed?.note ? `, ${typed.note}` : ''}${stopped ? `, armour stopped ${stopped}` : ''}` : strike.kind === 'blocked' ? `meet${id === 'player' ? '' : 's'} a full block` : `miss${id === 'player' ? '' : 'es'}`}.`);
        if(injury) say(b, `${foeId === 'player' ? 'Your' : `${foe.name}'s`} ${injury.replace(': ', ' are ').toLowerCase()}.`);
        if(foe.status === 'down') say(b, endLine(foeId, foe));
    } else if(move.kind === 'fate') {
        const foeId = fates(b, id).includes(command.targetId) ? command.targetId : fates(b, id)[0];
        check(foeId, 'No one is down at your feet.');
        const foe = b.fighters[foeId]; delete b.fate[foeId];
        foe.end = command.moveId === 'finish' ? 'killed' : 'knocked_out';
        say(b, command.moveId === 'finish' ? `${name} finish${id === 'player' ? '' : 'es'} ${foe.name}.` : `${name} spare${id === 'player' ? '' : 's'} ${foe.name}, who lies still.`);
    } else if(move.kind === 'plead') {
        // Heard by the other side's goals: someone set on harm rarely agrees, someone hurt or wavering more often.
        const them = active(b, 'b').map(x => b.fighters[x]), aim = them.length ? them.reduce((a, x) => a + (x.goals?.aim ?? .5), 0) / them.length : 0;
        const hurt = them.length ? them.reduce((a, x) => a + (1 - x.hp / x.maxHp), 0) / them.length : 1;
        const p = Math.min(.9, TEMPO_DIALS.pleaBase.value + .4 * (1 - aim) + .3 * hurt);
        check(!pleaWhy(b), pleaWhy(b));
        if(draw(b, 'plea', id, {tries: f.pleas || 0}) < p) { b.stakes.lethal = false; shift(b, `${name === 'You' ? 'Your' : `${name}'s`} plea was heard: no killing.`); say(b, `${name} call${id === 'player' ? '' : 's'} for no killing, and they agree. A downing blow only knocks out now.`); }
        else { f.pleas = (f.pleas || 0) + 1; say(b, `${name} call${id === 'player' ? '' : 's'} for no killing. They do not answer.`); }
    } else if(move.kind === 'escalate') {
        b.stakes.lethal = true; delete f.holdBack; shift(b, `${name === 'You' ? 'You' : name} went for the kill.`);
        say(b, `${name === 'You' ? 'You make' : `${name} makes`} it plain: this is to the death now.`);
    } else if(move.kind === 'kit') {
        harmed = runKit(b, id, f, name, command, move) || harmed;
    } else if(move.kind === 'ward') {
        const why = kitWhy(f, move); check(!why, why);
        for(const [q, n] of Object.entries(move.spends || {})) f.means[q] -= n;
        f.guard = true; f.ward = move.ward; say(b, `${name} ${id === 'player' ? 'raise' : 'raises'} ${move.label.toLowerCase()}.`);
    } else if(move.kind === 'shoot') {
        const st = f.stock, foeId = target(b, id, command.targetId);
        check(st && st.loaded > 0, 'The chamber is empty.');
        check(foeId && st.vs[foeId], 'No one is in your sights.');
        const foe = b.fighters[foeId], odds = stockEdge(st.kind, foe.tags, st.vs[foeId]);
        st.loaded--;
        const hit = draw(b, 'shot', id, {foe: foeId}) < odds.chance;
        const foeName = foeId === 'player' ? 'you' : foe.name;
        if(hit) {
            harmed = true;
            const dmg = round1(foe.maxHp / odds.downIn);
            const over = dmg - (foe.hp - b.floor);
            foe.hp = Math.max(b.floor, round1(foe.hp - dmg)); foe.guard = false; delete foe.ward; foe.adrenalineUntil = b.now + 10;
            if(foe.hp <= b.floor) downed(b, foeId, id, move, over);
            say(b, `${name} fire${id === 'player' ? '' : 's'} and hit${id === 'player' ? '' : 's'} ${foeName}.${foe.status === 'down' ? ` ${foeId === 'player' ? 'You go' : `${foe.name} goes`} down.` : ''}${odds.notes.length ? ` (${odds.notes.join(', ')})` : ''}`);
        } else say(b, `${name} fire${id === 'player' ? '' : 's'} and miss${id === 'player' ? '' : 'es'}.`);
        if(!st.loaded) say(b, `${id === 'player' ? 'Your' : `${f.name}'s`} chambers are empty.`);
    } else if(move.kind === 'reload') {
        const st = f.stock, n = st ? Math.min(st.batch, st.capacity - st.loaded, st.carried) : 0;
        check(n > 0, st && st.loaded >= st.capacity ? 'Every chamber is already loaded.' : 'You have no rounds to load.');
        st.loaded += n; st.carried -= n;
        say(b, `${name} load${id === 'player' ? '' : 's'} ${n} round${n === 1 ? '' : 's'}.`);
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
        // Backing out is an attempt (LSD368): a keyed draw on speed, tiredness, light, footing and the rivals' resolve.
        if(draw(b, 'leave', id, {tries: f.tries || 0}) < leaveChance(b, f, x => oddsOf(x).speed)) {
            f.status = 'left'; say(b, `${name} back${id === 'player' ? '' : 's'} away.`);
            b.exit = {kind: 'withdrawn', followedBy: followers(b, f, draw), leftBehind: id === 'player' ? active(b, 'a').filter(x => x !== 'player' && b.fighters[x].ally) : []};
        } else {
            f.tries = (f.tries || 0) + 1; f.guard = false; cost += EXIT_DIALS.turnPenalty.value;
            say(b, `${name} ${id === 'player' ? 'try to back away, but are cut off' : 'tries to back away, but is cut off'}; the turn costs a free blow.`);
        }
    } else {
        // A surrender can be refused by the other side's goals.
        if(draw(b, 'yield', id, {tries: f.tries || 0}) < yieldChance(b, f)) {
            f.status = 'left'; f.yielded = true; say(b, `${name} yield${id === 'player' ? '' : 's'}.`);
            b.exit = {kind: 'yielded', followedBy: [], leftBehind: id === 'player' ? active(b, 'a').filter(x => x !== 'player' && b.fighters[x].ally) : []};
        } else {
            f.tries = (f.tries || 0) + 1; f.guard = false;
            say(b, `${name} ${id === 'player' ? 'offer to yield, but it is refused' : 'offers to yield, but it is refused'}.`);
        }
    }
    if(!mishap) channelLine(b, id, f, command.moveId);
    f.ready += cost; b.seconds += cost; plan.state.sequence++;
    // One home for the player's contest vitals (R3-C11): every view reads the same value while the fight is open.
    const mine = b.fighters.player, pv = plan.vitals.player;
    pv.health = Math.max(1, Math.min(pv.max_health ?? mine.maxHp, mine.hp)); pv.stamina = Math.min(pv.max_stamina ?? mine.maxStamina, mine.stamina);
    stagePlayerVitals(plan);
    if(move.kind === 'yield' && !mishap && f.status === 'left') publish(f.side === 'a' ? 'yielded' : 'won');
    else resolveEnd(b, publish, f, id);
    // Someone in the frame steps in (WS1: a teacher arrives; a drill is called off): the fight ends with everyone still standing stopped.
    if(b.result === null && b.stakes?.stopAt > 0 && b.seconds >= b.stakes.stopAt) {
        for(const x of Object.values(b.fighters)) if(x.status === 'active') x.end = 'stopped';
        say(b, b.stakes.stopText || 'Someone steps in and stops the fight.'); publish('withdrawn');
    }
    // A fight nobody can win ends by exhaustion (AT21): the count resets on any harm and is kept in the saved fight.
    if(b.result === null) {
        b.lull = harmed ? 0 : (b.lull || 0) + 1;
        const limit = TEMPO_DIALS.stallActions.value;
        if(limit > 0 && b.lull >= limit) {say(b, 'Neither of you can hurt the other any more. Spent, you both break off.'); publish('withdrawn');}
    }
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
            profile: structuredClone(f.profile), moves: (f.moves || [...KEEP, ...Object.keys(f.kit || {})]).filter(m => KEEP.includes(m) || (f.stock && TEMPO_ALLOWED_MOVE_IDS.includes(m) && !TEMPO_MOVE_IDS.includes(m)) || !!f.kit?.[m]), perception: f.perception ?? 5, stealth: f.stealth ?? 5,
            tool: f.tool || 'familiar', ...(f.goals ? {goals: {...f.goals}} : {}), ...(f.parts && Object.keys(f.parts).length ? {parts: {...f.parts}} : {}), ...(f.ally ? {ally: {...structuredClone(f.ally), order: null}} : {}), ...(f.stock ? {stock: {...structuredClone(f.stock), holder: f.id}} : {}), ...(f.channels ? {channels: structuredClone(f.channels)} : {}), ...(f.tags?.length ? {tags: [...f.tags]} : {}), ...(Number.isFinite(f.perceive) ? {perceive: f.perceive} : {}), ...(f.kit ? {kit: structuredClone(f.kit)} : {}), ...(f.means ? {means: {...f.means}} : {}), ...(f.meansLabels ? {meansLabels: {...f.meansLabels}} : {}), ...(f.holdBack ? {holdBack: true} : {}), ...(f.fateText ? {fateText: {...f.fateText}} : {}), guard: false, adrenalineUntil: 0, status: 'active', yielded: false};
    }
    if(Object.values(fighters).some(f => f.side === 'a' && f.ally)) fighters.player.moves.push('order');
    const b = {schema: TEMPO_SCHEMA, id: spec.id, title: spec.title || 'A fight', seed, actions: 0, now: 0, seconds: 0, held: 0, floor: spec.floor ?? 0,
        conditions: {light: 'day', footing: 'firm', weather: 'clear', ...spec.conditions}, fighters, log: [], last: '', result: null, surprised: null, ...(spec.stakes ? {stakes: tempoStakes(spec.stakes)} : {})};
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

// How likely holding back is to slip against the foe in front, from the player's heaviest attack (PS24, CBD213). Kit rows with `force` carry
// their own harm; a plain blow is read from its power on the player's attack. An estimate for the tooltip; the draw happens at the blow.
export function holdRisk(b) {
    const me = b.fighters.player, foe = active(b, 'b').map(id => b.fighters[id])[0];
    if(!foe || !b.stakes?.lethal) return 0;
    const blows = [...me.moves.filter(id => TEMPO_MOVES[id]?.kind === 'strike').map(id => TEMPO_MOVES[id].power * me.profile.attackPower), ...Object.values(me.kit || {}).map(r => r.force ?? (r.power ?? 0) * me.profile.attackPower)];
    const heaviest = Math.max(0, ...blows), over = Math.max(0, heaviest - foe.maxHp * .1); // a downing blow usually finds a tenth or less left
    return Math.min(.9, TEMPO_DIALS.holdFailBase.value + TEMPO_DIALS.holdFailForce.value * over / Math.max(1, foe.maxHp));
}
// The player's own restraint (CBC32): holding back turns a downing blow into a knockout in a lethal fight. Free, no time.
export function setTempoHoldBack(b, on) { check(b?.fighters?.player && !b.result, 'No tempo fight is waiting.'); b.fighters.player.holdBack = !!on; if(!on) delete b.fighters.player.holdBack; return b; }

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
    const mix = me.profile.types?.attack || null, st = me.stock, foe0 = st && active(b, 'b').find(id => st.vs[id]);
    const stockWhy = id => id === 'shoot' ? (!st?.loaded ? 'The chamber is empty.' : !foe0 ? 'No one is in your sights.' : '') : id === 'reload' ? (!st?.carried ? 'You have no rounds to load.' : st.loaded >= st.capacity ? 'Every chamber is already loaded.' : '') : '';
    const kitRow = id => me.kit?.[id] ? moveRow(me, id) : null;
    return {title: b.title, lines: [...b.log], next, ...(b.stakes ? {stakes: {...b.stakes}} : {}), holdBack: !!me.holdBack,
        you: {hp: me.hp, maxHp: me.maxHp, stamina: me.stamina, maxStamina: me.maxStamina, mix, ...(me.means ? {means: Object.entries(me.means).map(([id, n]) => ({id, n, label: me.meansLabels?.[id] ?? id.replace(/_/g, ' ')}))} : {}), ...(st ? {stock: {loaded: st.loaded, carried: st.carried, capacity: st.capacity, kind: st.kind, kindLabel: stockKindLabel(st.kind)}} : {})}, hits: [...(b.hits || [])], yourTurn: mine && !b.result, result: b.result,
        // Fate and stakes moves the fight offers now, one row per body waiting on a decision.
        fates: fates(b, 'player').map(id => ({id, name: b.fighters[id].name})),
        moves: mine ? [...me.moves.filter(id => id !== 'order'), ...offered(b, 'player').filter(id => id !== 'finish' && id !== 'spare')].map(id => kitRow(id) ? {id, label: kitRow(id).label, text: kitRow(id).text, cost: scaled(kitRow(id), me), safe: kitRow(id).safe, kit: true,
            usable: !kitWhy(me, kitRow(id)) && oddsOf(me).allowed, why: kitWhy(me, kitRow(id)), price: kitCostText(me, kitRow(id)), detail: kitDetail(me, kitRow(id), b.stakes), odds: null} : ({id, label: TEMPO_MOVES[id].label, ...(TEMPO_MOVES[id].kind === 'strike' && mix ? {mix} : {}), text: TEMPO_MOVES[id].text, cost: scaled(TEMPO_MOVES[id], me), safe: TEMPO_MOVES[id].safe,
            usable: (id !== 'tend' || me.stamina >= TEMPO_MOVES.tend.stamina) && (TEMPO_MOVES[id].kind !== 'strike' || oddsOf(me).allowed) && !stockWhy(id) && !(id === 'plead' && pleaWhy(b)),
            odds: id === 'withdraw' ? oddsWord(leaveChance(b, me, x => oddsOf(x).speed)) : id === 'yield' ? oddsWord(yieldChance(b, me)) : id === 'shoot' && foe0 ? oddsWord(st.vs[foe0].chance) : null,
            ...(id === 'shoot' || id === 'reload' ? {text: `${TEMPO_MOVES[id].text} ${st.loaded} of ${st.capacity} loaded, ${st.carried} carried (${stockKindLabel(st.kind)}).`} : {}),
            why: id === 'plead' && pleaWhy(b) ? pleaWhy(b) : stockWhy(id) ? stockWhy(id) : id === 'tend' && me.stamina < TEMPO_MOVES.tend.stamina ? 'Needs two stamina.' : TEMPO_MOVES[id].kind === 'strike' && !oddsOf(me).allowed ? `${oddsOf(me).blockedBy.reason} stops you striking.` : '',
            ...(TEMPO_MOVES[id].kind === 'strike' && b.stakes ? {detail: `${TEMPO_MOVES[id].text} ${b.stakes.lethal ? (me.holdBack ? 'You are holding back: a downing blow knocks out.' : 'In this fight a downing blow can kill, a fist included.') : 'A downing blow knocks out.'}`} : {})})) : [],
        ...(mine ? {fateMoves: fates(b, 'player').flatMap(foeId => ['finish', 'spare'].map(m => ({id: m, targetId: foeId, name: b.fighters[foeId].name, label: m === 'finish' ? 'Finish' : 'Spare',
            text: fateText(b.fighters[foeId])[m], ...(m === 'finish' && fateText(b.fighters[foeId]).detail ? {detail: fateText(b.fighters[foeId]).detail} : {}), cost: scaled(TEMPO_MOVES[m], me), safe: TEMPO_MOVES[m].safe, usable: true, why: '', odds: null})))} : {fateMoves: []}),
        place: b.conditions.place || null, holdRisk: holdRisk(b),
        aims: mine ? SLOT_IDS.map(id => ({id, label: SLOTS[id].label === 'body' ? 'Body' : SLOTS[id].label[0].toUpperCase() + SLOTS[id].label.slice(1), text: SLOTS[id].why})) : [],
        hurt: Object.entries(me.parts || {}).map(([id, rung]) => ({id, label: partLabel(id), rung, shift: oddsOf({parts: {[id]: rung}}).shift})),
        orders: mine && me.moves.includes('order') ? active(b, 'a').filter(id => b.fighters[id].ally).flatMap(id => ALLY_ORDER_IDS.map(o => ({allyId: id, orderId: o, label: `${b.fighters[id].name}: ${ALLY_ORDERS[o].label}`,
            text: ALLY_ORDERS[o].text, cost: scaled(TEMPO_MOVES.order, me), odds: oddsWord(orderChance(b, b.fighters[id]))}))) : [],
        allies: active(b, 'a').filter(id => b.fighters[id].ally).map(id => ({id, name: b.fighters[id].name, hurt: b.fighters[id].hp / b.fighters[id].maxHp > .66 ? 'steady' : b.fighters[id].hp / b.fighters[id].maxHp > .33 ? 'hurt' : 'barely standing',
            order: activeOrder(b, b.fighters[id])?.id ? ALLY_ORDERS[activeOrder(b, b.fighters[id]).id].label : null})),
        // A body waiting on your decision stays on the card, down, so the choice has a place to be made (CBC4).
        foes: [...active(b, 'b'), ...fates(b, 'player')].map(id => ({id, name: b.fighters[id].name, ...(b.fighters[id].status === 'down' ? {down: true} : {}), hp: b.fighters[id].hp, maxHp: b.fighters[id].maxHp, stamina: b.fighters[id].stamina, maxStamina: b.fighters[id].maxStamina,
            ...(b.fighters[id].means && Object.keys(b.fighters[id].means).length ? {means: Object.entries(b.fighters[id].means).map(([q, n]) => ({id: q, n, label: b.fighters[id].meansLabels?.[q] ?? q.replace(/_/g, ' ')}))} : {}), learned: {...b.fighters[id].learned}, injuries: Object.entries(b.fighters[id].parts || {}).map(([p, rung]) => ({label: partLabel(p), rung})), hurt: b.fighters[id].status === 'down' ? 'down and helpless' : b.fighters[id].hp / b.fighters[id].maxHp > .66 ? 'fresh' : b.fighters[id].hp / b.fighters[id].maxHp > .33 ? 'hurt' : 'barely standing'}))};
}

export const tempoKey = address;
