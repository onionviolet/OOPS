// The aperture on the world substrate (Gu law pack, proposal under AD32 and AD56, 2026-11-12).
// A body whose state carries an aperture record keeps its primeval sea as energy pools by rank
// and stage. This pack is the one owner of how that sea changes over time:
//   recovery   the body makes essence of its own stage while there is room; fresh essence
//              pushes out weaker essence once the sea is full (RIG2, RIG9)
//   stones     an absorbing master opens one stone at a time and draws it in (RIG2)
//   nurture    poured essence wears the wall toward the next stage (RIG5)
//   the break  at the peak, a strike must outrun the crystal wall's healing (RIG6)
//   holds      essence promised to a working in flight is moved to its own account
//              (`aperture_held:<id>`), so nothing else can pour or pay it and anyone can see it
//   strain     a price the sea cannot cover is paid by the aperture itself, which can crack (ch193)
//   foreign    another master's essence fills the sea and slows the wall until cleansed (ch50, ch111)
// The numbers are gu_aperture.js APERTURE_LAW unless the world passes its own. No other pack
// is imported (PFP10): the sea is `energy`, stones are `stock`, and the rest is published and heard.
import {APERTURE_LAW, APERTURE_STAGES, apertureAbsorbRate, apertureCapacity, aperturePool, aperturePools,
    apertureRecovery, checkAperture, conditionFor, essencePotency, motesFor, nurturePermille, openAperture, payFromSea} from '../gu_aperture.js';
import {WORLD_QUANTITIES as Q} from '../world_quantities.js';

export const GU_APERTURE = 'g.aperture';
export const MORTAL_APERTURE_RELEASE = 'aperture.release-for-ascension';
export const MORTAL_APERTURE_RELEASED = 'aperture.released-for-ascension';
export const MORTAL_APERTURE_RELEASE_REFUSED = 'aperture.release-refused';
const BIG = 1_000_000_000;
const mote = (id, unit) => ({id, unit, min: 0, max: BIG});
const OWN = [mote('aperture_wall', 'mote'), mote('aperture_break', 'mote'), mote('aperture_strain', 'mote'),
    mote('aperture_foreign', 'mote'), mote('aperture_draw', 'rank-one mote'), {...mote('aperture_held', 'mote'), keyed: true}];
const heldKey = id => `aperture_held:${id}`;
const KINDS = {focus: 'aperture.focus', spend: 'aperture.spend', hold: 'aperture.hold', release: 'aperture.release',
    pour: 'aperture.pour', cleanse: 'aperture.cleanse', temper: 'aperture.temper'};
const PEAK = APERTURE_STAGES.length - 1;
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const whole = n => Number.isSafeInteger(n) && n >= 0;

/** A body holder with an open aperture. `essence` is own-stage motes to start with (default a full sea). */
export function apertureHolder({id, place, aptitude, rank = 1, stage = 0, essence, stones = 0, tags = [], quantities = {}, state = {}}, law = APERTURE_LAW) {
    const s = openAperture({aptitude, rank, stage}, law);
    return {id, kind: 'body', place, tags: ['gu.aperture', ...tags],
        quantities: {[aperturePool(s.rank, s.stage)]: essence ?? apertureCapacity(law, s), aperture_wall: 0, aperture_break: 0,
            aperture_strain: 0, aperture_foreign: 0, aperture_draw: 0, [`stock:${law.stone.good}`]: stones, ...quantities},
        state: {...state, [GU_APERTURE]: s}};
}

export function createGuAperturePack(law = APERTURE_LAW) {
    const stone = `stock:${law.stone.good}`;
    const every = aperturePools(law);
    const has = h => !!h.state[GU_APERTURE];

    // The sea as the view shows it now: pools strongest first, with what is held.
    function sea(v, id) {
        const s = v.state(id), own = aperturePool(s.rank, s.stage);
        const q = name => v.has(id, name) ? v.amount(id, name) : 0;
        const pools = every.filter(p => v.has(id, p.key)).map(p => ({...p, amount: v.amount(id, p.key), free: v.amount(id, p.key)}));
        const holds = Object.entries(s.holds).map(([hold, h]) => ({id: hold, pool: h.pool, key: heldKey(hold), amount: q(heldKey(hold)),
            potency: every.find(p => p.key === h.pool).potency}));
        return {s, own, pools, ownPool: pools.find(p => p.key === own) ?? {key: own, amount: 0, free: 0},
            potency: essencePotency(law, s.rank, s.stage), capacity: apertureCapacity(law, s),
            total: pools.reduce((n, p) => n + p.amount, 0) + holds.reduce((n, h) => n + h.amount, 0), holds, q};
    }

    // One minute's flows and how many minutes they hold. Every limit here is essence that is or
    // is not there, so one jump and many steps settle the same totals.
    function plan(v, id) {
        const a = sea(v, id), {s, own, potency} = a, rates = {}, flow = (kind, quantity, n) => {
            if (n) (rates[kind] ??= []).push({holder: id, quantity, perMinute: n});
        };
        let horizon = Infinity;
        const limit = n => { horizon = Math.min(horizon, Math.max(1, n)); };
        const hasOwn = v.has(id, own);

        // Wanted in: recovery, then the open stone. Wanted out of the own pool: the strike, then the wall.
        let recover = hasOwn ? apertureRecovery(law, s) : 0;
        const draw = a.q('aperture_draw');
        let absorb = hasOwn && s.absorb ? Math.min(apertureAbsorbRate(law, s), Math.floor(draw / potency)) : 0;
        const from = s.nurture?.pool && s.nurture.pool !== own ? a.pools.find(p => p.key === s.nurture.pool) ?? null : null;
        const wantStrike = s.strike && s.stage === PEAK ? s.strike.perMinute : 0;
        const wantNurture = s.nurture && s.stage < PEAK && !from ? s.nurture.perMinute : 0;
        const leaving = incoming => {
            const available = a.ownPool.free + incoming, strike = Math.min(wantStrike, available);
            return {strike, nurture: Math.min(wantNurture, available - strike)};
        };
        let out = leaving(recover + absorb);
        // Room is the empty part of the sea plus what leaves this minute. Past that, fresh essence
        // pushes out the weakest free essence; past that, it does not form.
        const space = Math.max(0, a.capacity - a.total);
        const weakest = a.pools.filter(p => p.potency < potency && p.free > 0).at(-1) ?? null;
        let room = space + out.strike + out.nurture, displaced = 0;
        if (recover + absorb > room) {
            displaced = Math.min(recover + absorb - room, weakest?.free ?? 0);
            room += displaced;
            if (recover + absorb > room) {
                recover = Math.min(recover, room); absorb = Math.min(absorb, room - recover);
                out = leaving(recover + absorb);
            }
        }
        const incoming = recover + absorb, {strike, nurture} = out;
        const rising = incoming - displaced - strike - nurture;
        if (rising > 0) limit(Math.floor(space / rising));
        if (displaced > 0) limit(Math.floor(weakest.free / displaced));
        if (strike + nurture > incoming) limit(Math.floor(a.ownPool.free / (strike + nurture - incoming)));
        if (absorb > 0) limit(Math.floor(draw / (absorb * potency)));
        const aside = from && s.nurture && s.stage < PEAK ? Math.min(s.nurture.perMinute, from.free) : 0;
        if (aside > 0) limit(Math.floor(from.free / aside));

        flow('recovery', own, recover);
        flow('stones', own, absorb);
        flow('stones', 'aperture_draw', -absorb * potency);
        if (displaced) flow('recovery', weakest.key, -displaced);
        flow('nurture', own, -nurture);
        if (aside) flow('nurture', from.key, -aside);
        const permille = nurturePermille(law, s, a.q('aperture_foreign'));
        flow('nurture', 'aperture_wall', Math.floor((nurture + (aside ? Math.floor(aside * from.potency / potency) : 0)) * permille / 1000));
        flow('strike', own, -strike);
        const broken = a.q('aperture_break');
        if (strike) flow('strike', 'aperture_break', strike - law.break.healStruck);
        else if (broken > 0) { const heal = Math.min(broken, law.break.healIdle); flow('strike', 'aperture_break', -heal); limit(Math.floor(broken / heal)); }
        const strain = a.q('aperture_strain');
        if (strain > 0 && !strike && a.total > 0) { const ease = Math.min(strain, law.strain.easePerMinute); flow('strain', 'aperture_strain', -ease); limit(Math.floor(strain / ease)); }
        return {rates, horizon, a};
    }

    const part = kind => ({id: kind, appliesTo: has, rates: (v, id) => plan(v, id).rates[kind] ?? []});

    function decide(v, id) {
        const a = sea(v, id), ops = [], s = a.s;
        let next = s, own = a.own, potency = a.potency;
        const here = v.placeOf(id), say = (kind, detail) => ops.push({op: 'publish', kind, place: here, detail: {target: id, ...detail}});
        const change = patch => { next = {...next, ...patch}; };

        if (s.stage < PEAK && a.q('aperture_wall') >= law.wallNeed[s.stage]) {
            ops.push(add(id, 'aperture_wall', -law.wallNeed[s.stage]));
            change({stage: s.stage + 1, ...(s.stage + 1 === PEAK ? {nurture: null} : {})});
            say('aperture.stage', {rank: s.rank, stage: APERTURE_STAGES[s.stage + 1], wall: law.walls[s.stage + 1]});
        } else if (s.stage === PEAK && s.rank < law.maxRank && a.q('aperture_break') >= law.break.need) {
            ops.push({op: 'set', holder: id, quantity: 'aperture_break', amount: 0}, {op: 'set', holder: id, quantity: 'aperture_wall', amount: 0});
            change({rank: s.rank + 1, stage: 0, strike: null});
            say('aperture.rank', {rank: s.rank + 1, essence: law.essence[s.rank + 1]});
        }
        if (next !== s) {
            own = aperturePool(next.rank, next.stage); potency = essencePotency(law, next.rank, next.stage);
            if (!v.has(id, own)) ops.push({op: 'carry', holder: id, quantity: own, amount: 0});
        }
        if (next.strike && next.stage !== PEAK) change({strike: null});
        if (next.nurture && next.stage === PEAK) change({nurture: null});

        // A strike the sea can no longer feed ends, and the wall closes (ch90).
        if (next.strike && a.ownPool.free <= 0) { change({strike: null}); say('aperture.strike_ended', {reason: 'dry', progress: a.q('aperture_break')}); }

        // Stones: open the next one when the last is spent. What a full sea leaves in an open stone stays in it.
        if (next.absorb && a.q('aperture_draw') < potency) {
            if (!v.has(id, stone) || v.amount(id, stone) < 1) { change({absorb: false}); say('aperture.stones_out', {}); }
            else ops.push(add(id, stone, -1), add(id, 'aperture_draw', law.stone.motes));
        }

        const condition = conditionFor(law, next, a.q('aperture_strain'));
        if (condition !== next.condition) { change({condition}); say('aperture.condition', {condition, was: s.condition}); }

        // Essence past the cap is lost, weakest first (RIG2, RIG38). A cracked aperture holds less.
        let over = a.total - apertureCapacity(law, next), lost = 0;
        for (const pool of [...a.pools].reverse()) {
            if (over <= 0) break;
            const spill = Math.min(pool.amount, over);
            if (spill > 0) { ops.push(add(id, pool.key, -spill)); over -= spill; lost += spill; }
        }
        for (const hold of [...a.holds].sort((x, y) => x.potency - y.potency)) {
            if (over <= 0) break;
            const spill = Math.min(hold.amount, over);
            if (spill > 0) { ops.push(add(id, hold.key, -spill)); over -= spill; lost += spill; }
        }
        if (lost) say('aperture.overflow', {lost});
        // A hold that has been paid out in full (by a price or a spill) is over.
        const live = a.holds.filter(h => h.amount > 0 && !ops.some(op => op.quantity === h.key && op.amount === -h.amount));
        if (live.length !== a.holds.length) change({holds: Object.fromEntries(live.map(h => [h.id, next.holds[h.id]]))});
        if (next !== s) ops.push({op: 'state', holder: id, value: next});
        return ops;
    }

    // What a price takes from this sea: its own hold if it names one, the named pool, then the rest strongest first.
    function charge(a, detail) {
        const first = detail.pool ?? a.own, hold = detail.hold ? a.holds.find(h => h.id === detail.hold) : null;
        const pools = [...(hold ? [{key: hold.key, potency: hold.potency, free: hold.amount}] : []),
            ...a.pools.filter(p => p.key === first), ...(detail.only ? [] : a.pools.filter(p => p.key !== first))];
        const firstPotency = every.find(p => p.key === first)?.potency ?? a.potency;
        const price = whole(detail.price) ? detail.price : whole(detail.motes) ? detail.motes * firstPotency : null;
        if (price === null) throw new Error('Aperture: a price is whole rank-one motes (`price`) or whole motes of the pool (`motes`).');
        return {price, hold, ...payFromSea(price, pools)};
    }

    const mine = (effect, id) => effect.detail?.target === id;
    const reactors = [{
        id: 'release-for-ascension', on: [MORTAL_APERTURE_RELEASE], appliesTo: has,
        react(v, id, effect) {
            const s = v.state(id);
            if (!mine(effect, id) || effect.by !== id || effect.place !== v.placeOf(id)) return [];
            if (s.rank !== law.maxRank || s.stage !== PEAK || s.condition !== 'intact' || Object.keys(s.holds).length) {
                return [{op: 'publish', kind: MORTAL_APERTURE_RELEASE_REFUSED, place: effect.place, by: id,
                    detail: {source: effect.detail.source}}];
            }
            const quantities = [...every.map(pool => pool.key), ...OWN.filter(q => !q.keyed).map(q => q.id)];
            return [...quantities.filter(key => v.has(id, key) && v.amount(id, key) > 0)
                .map(quantity => ({op: 'set', holder: id, quantity, amount: 0})),
                {op: 'state', holder: id, value: null},
                {op: 'publish', kind: MORTAL_APERTURE_RELEASED, place: effect.place, by: id,
                    detail: {source: effect.detail.source, rank: s.rank, aptitude: s.aptitude}}];
        },
    }, {
        id: 'focus', on: [KINDS.focus], appliesTo: has,
        // What the master is doing with the sea. Each key is optional: nurture and strike take motes
        // a minute (0 stops), absorb is on or off. The strike is capped at what the wall can take.
        react: (v, id, effect) => {
            if (!mine(effect, id)) return [];
            const s = v.state(id), d = effect.detail, next = {...s};
            if ('nurture' in d) next.nurture = d.nurture > 0 ? {perMinute: d.nurture, ...(d.pool ? {pool: d.pool} : {})} : null;
            if ('strike' in d) next.strike = d.strike > 0 ? {perMinute: Math.min(d.strike, law.break.strikeMax)} : null;
            if ('absorb' in d) next.absorb = d.absorb === true;
            checkAperture(next, law);
            return [{op: 'state', holder: id, value: next}];
        },
    }, {
        id: 'spend', on: [KINDS.spend], appliesTo: has,
        // A settled cost. What the sea cannot cover is not refused: the aperture pays it as strain.
        react: (v, id, effect) => {
            if (!mine(effect, id)) return [];
            const a = sea(v, id), {price, hold, taken, owed} = charge(a, effect.detail), ops = taken.map(t => add(id, t.key, -t.amount));
            if (hold) { // the working is done with its hold: what it did not use goes back to the pool
                const left = hold.amount - (taken.find(t => t.key === hold.key)?.amount ?? 0);
                if (left > 0) ops.push(add(id, hold.key, -left), add(id, hold.pool, left));
                const holds = {...a.s.holds}; delete holds[hold.id];
                ops.push({op: 'state', holder: id, value: {...a.s, holds}});
            }
            if (owed > 0) {
                const strain = motesFor(owed, a.potency);
                ops.push(add(id, 'aperture_strain', strain),
                    {op: 'publish', kind: 'aperture.short', place: v.placeOf(id), detail: {target: id, price, owed, strain}});
            }
            return ops;
        },
    }, {
        id: 'hold', on: [KINDS.hold, KINDS.release], appliesTo: has,
        // A working in flight sets essence aside under its own id; a release gives it back unspent.
        react: (v, id, effect) => {
            if (!mine(effect, id)) return [];
            const key = effect.detail.id;
            if (typeof key !== 'string' || !/^[a-z0-9][a-z0-9_.-]*$/i.test(key)) throw new Error('Aperture: a hold needs a plain id.');
            const a = sea(v, id), holds = {...a.s.holds}, mineNow = a.holds.find(h => h.id === key);
            if (effect.kind === KINDS.release) {
                if (!mineNow) return [];
                delete holds[key];
                return [...(mineNow.amount > 0 ? [add(id, mineNow.key, -mineNow.amount), add(id, mineNow.pool, mineNow.amount)] : []),
                    {op: 'state', holder: id, value: {...a.s, holds}}];
            }
            if (mineNow) return [];
            const pool = a.pools.find(p => p.key === (effect.detail.pool ?? a.own));
            const want = whole(effect.detail.price) ? motesFor(effect.detail.price, pool?.potency ?? a.potency) : effect.detail.motes;
            if (!whole(want) || want === 0) throw new Error('Aperture: a hold is whole rank-one motes (`price`) or whole motes of the pool (`motes`).');
            const amount = Math.min(want, pool?.free ?? 0);
            const ops = amount > 0 ? [...(v.has(id, heldKey(key)) ? [] : [{op: 'carry', holder: id, quantity: heldKey(key), amount: 0}]),
                add(id, pool.key, -amount), add(id, heldKey(key), amount),
                {op: 'state', holder: id, value: {...a.s, holds: {...holds, [key]: {pool: pool.key}}}}] : [];
            if (amount < want) ops.push({op: 'publish', kind: 'aperture.short', place: v.placeOf(id),
                detail: {target: id, hold: key, wanted: want, held: amount}});
            return ops;
        },
    }, {
        id: 'pour', on: [KINDS.pour], appliesTo: has,
        // One master pours own essence into another's sea. The giver loses what they give; the
        // receiver gains its worth in their own essence up to the cap, and it stays as foreign essence.
        react: (v, id, effect) => {
            const {target, from, motes} = effect.detail ?? {};
            if ((id !== target && id !== from) || target === from || !whole(motes) || !v.state(from) || !v.state(target)) return [];
            const giver = sea(v, from), given = Math.min(motes, giver.ownPool.free);
            if (given <= 0) return [];
            if (id === from) return [add(id, giver.own, -given)];
            const a = sea(v, id), got = Math.min(Math.floor(given * giver.potency / a.potency), Math.max(0, a.capacity - a.total));
            return got > 0 && v.has(id, a.own) ? [add(id, a.own, got), add(id, 'aperture_foreign', got)] : [];
        },
    }, {
        id: 'cleanse', on: [KINDS.cleanse], appliesTo: has,
        react: (v, id, effect) => {
            if (!mine(effect, id)) return [];
            const foreign = v.amount(id, 'aperture_foreign'), gone = Math.min(foreign, effect.detail.motes ?? foreign);
            return gone > 0 ? [add(id, 'aperture_foreign', -gone)] : [];
        },
    }, {
        id: 'temper', on: [KINDS.temper], appliesTo: has,
        // Outside means change the aperture itself (RIG1, RIG5, RIG7): `aptitude` moves the sea's share
        // by whole points (a Blood Skull Gu up, a burial recipe down); `stages` lifts the small realm
        // without the wall's time (a relic Gu), stopping at the peak. What they cost is their owner's.
        react: (v, id, effect) => {
            if (!mine(effect, id)) return [];
            const s = v.state(id), {aptitude = 0, stages = 0} = effect.detail, ops = [];
            if (!Number.isSafeInteger(aptitude) || !whole(stages)) throw new Error('Aperture: tempering takes whole aptitude points and whole stages.');
            const next = {...s, aptitude: Math.max(law.grades[0].from, Math.min(100, s.aptitude + aptitude)), stage: Math.min(PEAK, s.stage + stages)};
            if (next.aptitude === s.aptitude && next.stage === s.stage) return [];
            if (next.stage !== s.stage) {
                if (next.stage === PEAK) next.nurture = null;
                ops.push({op: 'set', holder: id, quantity: 'aperture_wall', amount: 0});
                if (!v.has(id, aperturePool(next.rank, next.stage))) ops.push({op: 'carry', holder: id, quantity: aperturePool(next.rank, next.stage), amount: 0});
                ops.push({op: 'publish', kind: 'aperture.stage', place: v.placeOf(id),
                    detail: {target: id, rank: next.rank, stage: APERTURE_STAGES[next.stage], wall: law.walls[next.stage], by: 'temper'}});
            }
            return [...ops, {op: 'state', holder: id, value: next}];
        },
    }];

    return {
        id: GU_APERTURE, revision: 0,
        quantities: [Q.energy, Q.stock, ...OWN],
        reads: ['energy', stone, ...OWN.map(q => q.id)],
        writes: ['energy', stone, ...OWN.map(q => q.id)],
        hears: [...Object.values(KINDS), MORTAL_APERTURE_RELEASE],
        publishes: [MORTAL_APERTURE_RELEASED, MORTAL_APERTURE_RELEASE_REFUSED, 'aperture.stage', 'aperture.rank', 'aperture.condition',
            'aperture.overflow', 'aperture.short', 'aperture.stones_out', 'aperture.strike_ended'],
        laws: [
            {...part('recovery'), horizon: (v, id) => plan(v, id).horizon,
                watches: (v, id) => {
                    const s = v.state(id);
                    return [...(s.stage < PEAK ? [{holder: id, quantity: 'aperture_wall', op: 'gte', value: law.wallNeed[s.stage]}] : []),
                        ...(s.stage === PEAK ? [{holder: id, quantity: 'aperture_break', op: 'gte', value: law.break.need}] : []),
                        {holder: id, quantity: 'aperture_strain', op: 'gte', value: law.strain.crackAt},
                        {holder: id, quantity: 'aperture_strain', op: 'gte', value: law.strain.shatterAt},
                        {holder: id, quantity: 'aperture_strain', op: 'lte', value: 0}];
                },
                decide},
            part('stones'), part('nurture'), part('strike'), part('strain'),
        ],
        reactors,
    };
}
