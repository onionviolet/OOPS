// Allies in a tempo fight (LSD318-LSD334): people with ranked goals, acting within
// their means, who hear orders by chance. Weights reorder a few existing rules (LSD334);
// no planner, no search. Every number is a default with a dial and an in-world reason.
export const ALLY_DIALS = {
    orderBase: {value: .3, why: 'A stranger shouting in a fight is heard about a third of the time.'},
    orderBond: {value: .45, why: 'A friend listens harder than a stranger.'},
    orderDiscipline: {value: .3, why: 'Trained people follow orders under noise.'},
    orderFear: {value: .5, why: 'Fear shuts out instructions.'},
    orderNoise: {value: .2, why: 'Din and distance cost a little hearing.'},
    orderMemory: {value: 30, why: 'An order holds for about half a minute of fight time, then people fall back on themselves.'},
    fleeAt: {value: .45, why: 'Past this score a person leaves rather than stay.'},
    coverBase: {value: .2, why: 'Stepping into a blow is hard even for a willing friend.'}
};
export const ALLY_ORDERS = {
    cover: {label: 'Cover me', text: 'Asks them to stand between you and the next blow.'},
    focus: {label: 'Take the same foe', text: 'Asks them to hit whoever you are hitting.'},
    fall_back: {label: 'Fall back', text: 'Asks them to leave the fight.'}
};
export const ALLY_ORDER_IDS = Object.keys(ALLY_ORDERS);
const clamp = (n, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));
const side = (b, f) => Object.values(b.fighters).filter(x => x.side === f.side);

// Fear is derived each turn from what is happening (LSD325), never stored.
export function allyFear(b, f) {
    const down = side(b, f).filter(x => x !== f && x.status === 'down').length;
    return clamp(.1 + (1 - f.hp / f.maxHp) * .5 + down * .2 - f.ally.discipline * .3 + (b.conditions.light === 'dark' ? .05 : 0));
}
const orderOf = (b, f) => f.ally.order && f.ally.order.until > b.now ? f.ally.order : null;
export const activeOrder = orderOf;

// A keyed check on real factors (LSD327, LSD363): same situation, same answer; time passing is a new draw.
export function orderChance(b, ally) {
    const noise = b.conditions.noise ?? 0, far = b.conditions.distance ?? 0, A = ALLY_DIALS;
    return clamp(A.orderBase.value + A.orderBond.value * ally.ally.bond + A.orderDiscipline.value * ally.ally.discipline - A.orderFear.value * allyFear(b, ally) - A.orderNoise.value * (noise + far), .05, .95);
}
export const oddsWord = p => p >= .75 ? 'likely' : p >= .5 ? 'fair' : p >= .3 ? 'uncertain' : 'a long shot';
export function hearOrder(b, ally, orderId, draw) {
    const p = orderChance(b, ally), ok = draw(b, 'order', `${ally.name}:${orderId}`, {ally: ally.name}) < p;
    const fear = allyFear(b, ally), noisy = (b.conditions.noise ?? 0) + (b.conditions.distance ?? 0) > .5;
    return {ok, chance: p, reason: ok ? '' : fear > .5 ? 'too shaken to listen' : noisy ? 'cannot hear over the din' : 'does not take it in'};
}
// Chance a covering ally takes a blow aimed at the player (LSD319 "cover me").
export const coverChance = (b, ally) => clamp(ALLY_DIALS.coverBase.value + .4 * ally.ally.bond + .3 * ally.ally.discipline - .3 * allyFear(b, ally), .05, .9);

// Goals are weights over rules (LSD324): survive, protect, aim, pay. The highest score acts; ties keep rule order.
export function allyMove(b, id, {target}) {
    const f = b.fighters[id], g = f.ally.goals, has = m => f.moves.includes(m), hp = f.hp / f.maxHp, fear = allyFear(b, f), order = orderOf(b, f);
    const guarded = b.fighters[f.ally.protectId], guardedHp = guarded && guarded.status === 'active' ? guarded.hp / guarded.maxHp : 1;
    const foe = order?.id === 'focus' && order.targetId && b.fighters[order.targetId]?.status === 'active' ? order.targetId : target(b, id);
    const swingOk = has('swing') && f.stamina > f.maxStamina * .4;
    const rules = [
        {score: has('withdraw') ? fear * (.5 + g.survive) - g.pay * .3 - f.ally.bond * g.protect * .5 + (order?.id === 'fall_back' ? 1 : 0) : -1, moveId: 'withdraw',
            why: order?.id === 'fall_back' ? `${f.name} falls back, as asked.` : `${f.name} hangs back, pale.`},
        {score: has('tend') && f.stamina >= 2 && hp < .6 ? (1 - hp) * (.4 + g.survive) * (1 - fear) : -1, moveId: 'tend', why: ''},
        {score: has('guard') ? g.protect * f.ally.bond * (1 - guardedHp) + (order?.id === 'cover' ? .6 : 0) : -1, moveId: 'guard', why: order?.id === 'cover' ? `${f.name} moves to cover you.` : ''},
        {score: has('jab') && foe ? .25 + g.aim * .6 + (order?.id === 'focus' ? .3 : 0) : -1, moveId: swingOk ? 'swing' : 'jab', why: ''}
    ];
    let best = rules[0];
    for(const r of rules) if(r.score > best.score) best = r;
    if(best.moveId === 'withdraw' && best.score < ALLY_DIALS.fleeAt.value) best = rules.slice(1).reduce((a, r) => r.score > a.score ? r : a);
    return {moveId: best.moveId, targetId: best.moveId === 'jab' || best.moveId === 'swing' ? foe : null, why: best.why};
}

// Ally block saved on a fighter: {goals:{survive,protect,aim,pay}, bond, discipline, protectId, order}.
export function validateAlly(a) {
    const unit = n => Number.isFinite(n) && n >= 0 && n <= 1;
    return !!a && ['survive', 'protect', 'aim', 'pay'].every(k => unit(a.goals?.[k])) && unit(a.bond) && unit(a.discipline) && typeof a.protectId === 'string' &&
        (a.order === null || (ALLY_ORDER_IDS.includes(a.order?.id) && Number.isSafeInteger(a.order.until) && (a.order.targetId === null || typeof a.order.targetId === 'string')));
}
