// Care access record (audit M2, detail pass J8/CW04). Leaf: imports nothing.
// Default: a gate of price. Dial: a world picks the gate kind (price, rank,
// favor), the cost and the duration. Reason: care is a service with a
// provider, a gate and limits, not a free heal. Limits are adjectives (AD22),
// so `doesNotRestore` names what this care leaves alone and is surfaced to the
// player, never applied. Output uses the storylet effect shapes that already
// exist (fact effect, cost list as {type:'money'-style native key}); no new op.
// Credit (audit F5): default, a provider lets care ride as a coin debt up to a limit; dial, `min` is the limit for a stranger and
// optional `known` the larger limit for a neighbour; reason, a healer who knows you can wait for the coins, one who does not
// cannot. The gate takes no coins and returns an obligations@1 row for the caller to save in its own owner.
import {obligation} from './obligations_ledger.js';
export const CARE_GATE_KINDS = Object.freeze(['price', 'rank', 'favor', 'credit']);

export function validateCareRecord(r) {
    const errors = [];
    if (!r || typeof r !== 'object') return ['care record must be an object'];
    if (!r.provider || typeof r.provider !== 'string') errors.push('provider is required');
    if (!r.who || typeof r.who !== 'string') errors.push('who is required');
    const g = r.gate ?? {kind: 'price'};
    if (!CARE_GATE_KINDS.includes(g.kind)) errors.push(`gate kind must be one of ${CARE_GATE_KINDS.join(', ')}`);
    if (g.kind !== 'price' && !(Number.isFinite(g.min) && g.min >= 0)) errors.push(`${g.kind} gate needs a non-negative min`);
    if (!Number.isFinite(r.cost) || r.cost < 0) errors.push('cost must be a non-negative number');
    if (!Number.isFinite(r.duration) || r.duration < 0) errors.push('duration must be a non-negative number of minutes');
    if (g.kind === 'credit' && g.known !== undefined && !(Number.isFinite(g.known) && g.known >= g.min)) errors.push('credit known limit must be at least min');
    for (const k of ['restores', 'doesNotRestore'])
        if (!Array.isArray(r[k]) || r[k].some(x => typeof x !== 'string' || !x)) errors.push(`${k} must be a list of keys`);
    return errors;
}

export function careRecord(fields) {
    const r = {gate: {kind: 'price'}, duration: 0, restores: [], doesNotRestore: [], ...fields};
    const errors = validateCareRecord(r);
    if (errors.length) throw new Error(`Invalid care record: ${errors.join('; ')}`);
    return r;
}

export const careLabel = (base, record) => record.gate.kind === 'price' && record.cost > 0
    ? `${base} · ${record.cost} ${record.cost === 1 ? 'coin' : 'coins'}` : base;

// Pure. `character` = {rank, favor, money, owed (coins already owed this provider), known (a neighbour), now} (missing rank/favor count as 0; a price gate refuses only when `money` is supplied and short). `moneyCost(n)` builds
// the host's native cost entry. Refusal leaves state alone: no effects, no costs.
export function applyCare(record, character = {}, {moneyCost, extraEffects = [], restoreEffect} = {}) {
    const errors = validateCareRecord(record);
    if (errors.length) throw new Error(`Invalid care record: ${errors.join('; ')}`);
    const notRestored = [...record.doesNotRestore];
    const g = record.gate;
    const have = g.kind === 'rank' ? (character.rank ?? 0) : g.kind === 'favor' ? (character.favor ?? 0) : null;
    if (have !== null && have < g.min)
        return {ok: false, reason: `${record.provider} will not treat you yet: needs ${g.kind} ${g.min}, you have ${have}.`, effects: [], costs: [], notRestored, duration: 0};
    if(g.kind === 'price' && Number.isFinite(character.money) && character.money < record.cost)
        return {ok: false, reason: `${record.provider} asks ${record.cost} coins; you have ${character.money}.`, effects: [], costs: [], notRestored, duration: 0};
    if(g.kind === 'credit') {
        const owed = character.owed ?? 0, limit = character.known && g.known !== undefined ? g.known : g.min;
        if(owed + record.cost > limit)
            return {ok: false, reason: `${record.provider} will carry ${limit} coins for ${character.known ? 'a neighbour' : 'a stranger'}; you owe ${owed}, and this is ${record.cost} more.`, effects: [], costs: [], notRestored, duration: 0};
    }
    const mk = restoreEffect || (key => ({type: 'fact', scope: 'actor', key, value: true}));
    const costs = record.gate.kind === 'price' && record.cost > 0 ? [moneyCost(-record.cost)] : [];
    const result = {ok: true, reason: '', effects: [...record.restores.map(mk), ...extraEffects], costs, notRestored, duration: record.duration};
    if(g.kind === 'credit' && record.cost > 0) result.obligation = obligation({id: `care:${record.provider}:${character.now ?? 0}`, kind: 'coin', debtor: 'player',
        creditor: record.provider, amount: record.cost, why: `Care from the ${record.provider}, owed`, source: 'care_access', since: character.now ?? 0, eases: 0, carries: true});
    return result;
}
