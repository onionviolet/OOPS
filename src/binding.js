// PC98, PC32c, KW22-KW26, KW35-KW39, PFP3, PFP11: proposal, engine fixtures.
// The host owns publication, custody and receipts. This reader stores none.
import {check, natural, object, copy, deepFreeze} from './basics.js';
import {defineOath, dueOathBreaches, oathAuthority} from './kernel_oath.js';

export const BINDING_SCHEMA = 'kernel.binding@1';
const id = x => typeof x === 'string' && /^[a-z][a-z0-9_.:/-]*$/i.test(x);
const side = x => x === 'a' || x === 'b';
const live = s => ['held', 'strained'].includes(s.status);
const ordered = rows => rows.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
const matches = (m, r) => (m.method === undefined || m.method === (typeof r.method === 'string' ? r.method : r.method?.id)) &&
    (m.op === undefined || m.op === r.op) && Object.entries(m.roles ?? {}).every(([k, v]) => r.bindings?.[k]?.id === v);
const priceOk = p => object(p) && Array.isArray(p.effects) && p.effects.every(object) &&
    (p.costs === undefined || (Array.isArray(p.costs) && p.costs.every(object))) && typeof p.cause === 'string' && p.cause.length;
const matchOk = m => object(m) && (m.method === undefined || id(m.method)) && (m.op === undefined || id(m.op)) &&
    (m.roles === undefined || (object(m.roles) && Object.values(m.roles).every(id)));

export function defineBinding(data) {
    check(object(data) && (data.schema === undefined || data.schema === BINDING_SCHEMA) && id(data.id) &&
        object(data.sides) && id(data.sides.a) && id(data.sides.b) && natural(data.madeAt), 'Invalid binding.');
    check(data.endsAt === undefined || (natural(data.endsAt) && data.endsAt >= data.madeAt), 'Invalid ending.');
    check(data.enforce === undefined || ['penalize', 'prevent'].includes(data.enforce), 'Invalid enforcement.');
    check(Object.keys(data).every(k => ['schema', 'id', 'sides', 'madeAt', 'endsAt', 'price', 'enforce', 'terms', 'upkeep',
        'standing', 'channel', 'onDeath', 'exits'].includes(k)), 'Unknown binding field.');
    const b = {...copy(data), schema: BINDING_SCHEMA, terms: copy(data.terms ?? []), upkeep: copy(data.upkeep ?? []),
        channel: copy(data.channel ?? {}), onDeath: copy(data.onDeath ?? {}), exits: copy(data.exits ?? [])};
    for (const rows of [b.terms, b.upkeep, b.exits, b.channel.shares ?? [], b.channel.answers ?? []])
        check(Array.isArray(rows) && rows.every(r => object(r) && id(r.id)) && new Set(rows.map(r => r.id)).size === rows.length, 'Invalid rows.');
    for (const t of b.terms) check(side(t.owes) && ['forbid', 'require'].includes(t.kind) && matchOk(t.match) &&
        (t.kind !== 'require' || (natural(t.by) && t.by >= b.madeAt)) && (t.penalty === undefined || priceOk(t.penalty)), 'Invalid term.');
    for (const u of b.upkeep) check(side(u.owes) && matchOk(u.match) && natural(u.every) && u.every > 0 &&
        (u.from === undefined || (natural(u.from) && u.from >= b.madeAt)) && natural(u.gain) && natural(u.loss), 'Invalid upkeep.');
    if (b.standing !== undefined) {
        const s = b.standing;
        check(object(s) && natural(s.start) && natural(s.max) && s.start <= s.max &&
            ['strainAt', 'lapseAt'].every(k => s[k] === undefined || (natural(s[k]) && s[k] <= s.max)) &&
            (s.breachLoss === undefined || s.breachLoss === 'all' || natural(s.breachLoss)) &&
            (s.of === undefined || side(s.of)), 'Invalid standing.');
    }
    check(!b.upkeep.length || b.standing !== undefined, 'Upkeep needs standing.');
    check(object(b.channel) && object(b.onDeath), 'Invalid channel or aftermath.');
    for (const [s, fields] of Object.entries(b.channel.senses ?? {})) check(side(s) && Array.isArray(fields) && fields.every(id), 'Invalid senses.');
    for (const r of b.channel.shares ?? []) check(side(r.from) && side(r.to) && id(r.what) && natural(r.num) && natural(r.den) && r.den > 0, 'Invalid share.');
    for (const r of b.channel.answers ?? []) check(matchOk(r.match) && id(r.role) && side(r.to) &&
        (r.bonus === undefined || Array.isArray(r.bonus)) && priceOk(r.otherwise) &&
        (r.otherwise.enforce === undefined || ['prevent', 'penalize'].includes(r.otherwise.enforce)), 'Invalid answer.');
    for (const [s, r] of Object.entries(b.onDeath)) check(side(s) && priceOk(r) && (r.passesTo === undefined || id(r.passesTo)), 'Invalid aftermath.');
    for (const e of b.exits) check(['transfer', 'break', 'buyout', 'release', 'remove'].includes(e.kind) &&
        (id(e.by) || (Array.isArray(e.by) && e.by.every(id))) && Array.isArray(e.consent) && e.consent.every(side) &&
        priceOk(e) && (e.kind !== 'transfer' || (side(e.side ?? (Array.isArray(e.by) ? undefined : e.by)) && id(e.to))), 'Invalid exit.');
    return deepFreeze(b);
}

const events = (b, log, at) => ordered(log.filter(r => r.binding === b.id && r.at >= b.madeAt && r.at <= at)
    .map((r, n) => ({...r, id: r.id ?? `${b.id}/log/${n}`})));
const exitData = (b, r) => b.exits.find(e => e.id === r.exit);
const transfer = (b, r) => r.kind === 'transfer' || (r.kind === 'exit' && exitData(b, r)?.kind === 'transfer');
function move(b, sides, r) {
    if (transfer(b, r)) {const e = exitData(b, r); sides[r.side ?? e?.side ?? e?.by] = r.to ?? e?.to;}
    if (r.kind === 'death' && b.onDeath[r.side]?.passesTo) sides[r.side] = b.onDeath[r.side].passesTo;
}
export function bindingSides(b, log = [], at) {
    check(natural(at), 'Read sides at a whole minute.');
    const sides = {...b.sides};
    for (const r of events(b, log, at)) move(b, sides, r);
    return sides;
}
const rematch = (b, m, sides) => ({...copy(m), ...(m.roles ? {roles: Object.fromEntries(Object.entries(m.roles)
    .map(([k, v]) => [k, v === b.sides.a ? sides.a : v === b.sides.b ? sides.b : v]))} : {})});
const emptyPrice = () => ({effects: [], cause: 'binding-term'});
function compile(b, log, until) {
    const changes = events(b, log, until).filter(r => transfer(b, r) || (r.kind === 'death' && b.onDeath[r.side]?.passesTo));
    const out = [];
    for (const s of ['a', 'b']) {
        const segments = [{at: b.madeAt, sides: {...b.sides}}];
        for (const r of changes) {
            const sides = bindingSides(b, log, r.at);
            if (sides[s] !== segments.at(-1).sides[s]) segments.push({at: r.at, sides});
        }
        const groups = new Map();
        for (const t of b.terms.filter(t => t.owes === s)) {
            const key = JSON.stringify(t.penalty ?? emptyPrice()); groups.set(key, [...(groups.get(key) ?? []), t]);
        }
        for (const [i, segment] of segments.entries()) for (const [n, [p, rows]] of [...groups].entries()) {
            const through = segments[i + 1]?.at;
            const terms = rows.filter(t => t.kind !== 'require' || (t.by >= segment.at && (through === undefined || t.by < through)));
            if (!terms.length) continue;
            out.push({oath: defineOath({id: `${b.id}/${s}/${i}/${n}`, vower: segment.sides[s], madeAt: segment.at,
                enforce: b.enforce, terms: terms.map(t => ({...t, match: rematch(b, t.match, segment.sides)})), penalty: JSON.parse(p)}), through});
        }
    }
    for (const u of b.upkeep) for (let n = 1, start = u.from ?? b.madeAt; start + n * u.every <= until; n++) {
        const end = start + n * u.every, from = end - u.every, sides = bindingSides(b, log, from);
        out.push({oath: defineOath({id: `${b.id}/${u.id}/${n}`, vower: sides[u.owes], madeAt: n === 1 ? from : from + 1,
            terms: [{id: u.id, kind: 'require', match: rematch(b, u.match, sides), by: end}], penalty: emptyPrice()}), u, end});
    }
    return out;
}
function history(b, {now, receipts = [], log = []}) {
    check(natural(now) && Array.isArray(receipts) && Array.isArray(log), 'Read bindings at a whole minute against records.');
    const seen = receipts.filter(r => r.at >= b.madeAt && r.at <= now), rows = [];
    const compiled = compile(b, log, Math.min(now, b.endsAt ?? now));
    for (const c of compiled) {
        const deadlines = c.oath.terms.filter(t => t.kind === 'require' && t.by <= now).map(t => t.by).sort((a, z) => a - z);
        const missing = deadlines.flatMap(at => dueOathBreaches([c.oath], {now: at,
            receipts: seen.filter(r => r.at <= at)}))
            .filter(r => c.through === undefined || r.at < c.through).slice(0, 1);
        if (c.u) rows.push({id: c.oath.id, at: c.end, kind: missing.length ? 'upkeep-missed' : 'upkeep-kept',
            delta: missing.length ? -c.u.loss : c.u.gain, ...(missing[0] ?? {}), side: c.u.owes});
        else for (const r of missing) rows.push({...r, id: `${c.oath.id}/${r.term}`, kind: 'duty-missed'});
    }
    const marked = new Set();
    for (const r of seen.toSorted((a, z) => a.at - z.at)) {
        const ref = r.truth?.breach?.oath;
        if (!marked.has(ref) && compiled.some(c => c.oath.id === ref)) {
            marked.add(ref); rows.push({id: `${ref}/breach`, at: r.at, kind: 'breach', oath: ref, cause: r.truth.cause});
        }
    }
    rows.push(...events(b, log, now));
    if (b.endsAt !== undefined && b.endsAt <= now) rows.push({id: `${b.id}/expired`, kind: 'expired', at: b.endsAt, cause: 'binding-expired'});
    let standing = b.standing?.start, status = 'held', since = b.madeAt, cause = 'binding-made';
    const sides = {...b.sides}, published = [], failed = new Set();
    // Whose standing this is, so who leaves at a lapse. Default: the bound side b; dial: standing.of.
    const leaver = b.standing?.of ?? 'b';
    const classify = () => b.standing?.lapseAt !== undefined && standing <= b.standing.lapseAt ? 'lapsed'
        : b.standing?.strainAt !== undefined && standing <= b.standing.strainAt ? 'strained' : 'held';
    status = classify();
    if (status === 'lapsed') cause = 'binding-lapsed';
    if (status === 'lapsed' && now >= b.madeAt) published.push({id: `${b.id}/lapsed`, binding: b.id, kind: 'lapsed', at: since, side: leaver, by: sides[leaver], cause: 'binding-lapsed'});
    for (const r of ordered(rows)) {
        if (!live({status})) break;
        const prior = status;
        if (r.delta !== undefined) standing = Math.max(0, Math.min(b.standing.max, standing + r.delta));
        if (['breach', 'duty-missed'].includes(r.kind)) {
            if (failed.has(r.oath)) continue;
            failed.add(r.oath);
        }
        if (['breach', 'duty-missed'].includes(r.kind) && b.standing?.breachLoss !== undefined) {
            if (b.standing.breachLoss === 'all') status = 'broken';
            else standing = Math.max(0, standing - b.standing.breachLoss);
        }
        move(b, sides, r);
        if (r.kind === 'exit' && !transfer(b, r)) status = exitData(b, r)?.kind === 'break' ? 'broken' : 'ended';
        if (r.kind === 'expired' || (r.kind === 'death' && !b.onDeath[r.side]?.passesTo)) status = 'ended';
        if (live({status})) status = classify();
        if (status !== prior) {since = r.at; cause = r.cause ?? r.kind;}
        if (r.kind === 'death') {
            const p = b.onDeath[r.side];
            if (p) published.push({...copy(p), id: `${r.id}/aftermath`, binding: b.id, at: r.at,
                kind: p?.passesTo ? 'transfer' : 'death-aftermath', side: r.side, ...(p?.passesTo ? {to: p.passesTo} : {})});
        }
        if (['expired', 'upkeep-missed', 'duty-missed'].includes(r.kind)) published.push({...r, binding: b.id});
        if (status === 'lapsed') published.push({id: `${b.id}/lapsed`, binding: b.id, kind: 'lapsed', at: r.at, side: leaver, by: sides[leaver], cause: 'binding-lapsed'});
    }
    return {state: {status, standing, sides, since, cause}, published: ordered(published)};
}
export const bindingState = (b, options) => history(b, options).state;
export function bindingOaths(b, {log = [], receipts = [], until}) {
    const current = history(b, {now: until, log, receipts}).state;
    const cutoff = Math.min(until, b.endsAt ?? until, live(current) ? until : current.since);
    return compile(b, log, cutoff).filter(c => c.oath.madeAt <= cutoff &&
        (c.through === undefined || c.through > c.oath.madeAt)).map(c => c.oath);
}
export function bindingAuthority(bindings, {log = [], receipts = [], inner} = {}) {
    return request => {
        let answer = inner ? inner(request) : {ok: true};
        if (!answer.ok) return answer;
        for (const b of bindings) {
            const state = bindingState(b, {now: request.at, receipts, log});
            if (request.at < b.madeAt || !live(state)) continue;
            const compiled = compile(b, log, request.at).filter(c => !c.u);
            const previous = answer, priorCosts = answer.costs ?? [];
            answer = oathAuthority(compiled.map(c => c.oath), {inner: () => answer, brokenBefore: (o, at) => {
                const c = compiled.find(row => row.oath.id === o.id);
                return (c.through !== undefined && at >= c.through) || receipts.some(r => r.at <= at && r.truth?.breach?.oath === o.id) ||
                    dueOathBreaches([o], {now: at, receipts: receipts.filter(r => r.at <= at)}).some(r => r.at < at);
            }})(request);
            if (answer !== previous && answer.breach) answer = {...answer, costs: [...copy(priorCosts), ...(answer.costs ?? [])]};
            if (!answer.ok) return answer;
            for (const row of b.channel.answers ?? []) if (matches(row.match, request)) {
                const holder = request.bindings?.[row.role]?.id === state.sides[row.to];
                if (holder) {if (state.status === 'held') answer = {...answer, effects: [...(answer.effects ?? []), ...copy(row.bonus ?? [])]};}
                else {
                    const p = row.otherwise;
                    if (p.enforce === 'prevent') return {...copy(p), ok: false, reason: 'binding-answers-another'};
                    answer = {...answer, effects: [...(answer.effects ?? []), ...copy(p.effects)],
                        costs: [...(answer.costs ?? []), ...copy(p.costs ?? [])], cause: p.cause};
                }
            }
        }
        return answer;
    };
}
export function senseThrough(b, state, s, read, at) {
    if (!live(state) || at < b.madeAt || !side(s) || !b.channel.senses?.[s]) return null;
    const other = read(state.sides[s === 'a' ? 'b' : 'a'], at);
    return object(other) ? Object.fromEntries(b.channel.senses[s].filter(k => Object.hasOwn(other, k)).map(k => [k, copy(other[k])])) : null;
}
export function sharedEffects(b, state, effect) {
    return live(state) ? (b.channel.shares ?? []).filter(r => r.what === effect.kind && state.sides[r.from] === effect.target)
        .map(r => ({...copy(effect), target: state.sides[r.to], amount: Math.floor(effect.amount * r.num / r.den), cause: 'binding-share', binding: b.id})) : [];
}
export function takeExit(b, state, {exit, by, at, consents = []}) {
    check(natural(at), 'Take an exit at a whole minute.');
    const e = b.exits.find(r => r.id === exit), allowed = e && (Array.isArray(e.by) ? e.by : [e.by]);
    if (!e || !live(state) || at < b.madeAt || !allowed.some(s => by === (side(s) ? state.sides[s] : s))) return {ok: false, reason: 'binding-exit-unavailable', missing: []};
    const missing = e.consent.filter(s => !consents.includes(s) && !consents.includes(state.sides[s]));
    if (missing.length) return {ok: false, reason: 'binding-consent-missing', missing};
    return {ok: true, event: {id: `${b.id}/exit/${e.id}/${at}`, binding: b.id, kind: 'exit', exit: e.id, by, at,
        ...(e.kind === 'transfer' ? {side: e.side ?? e.by, to: e.to} : {})}, costs: copy(e.costs ?? []), effects: copy(e.effects), cause: e.cause};
}
export function dueBindingEvents(b, {published = [], ...options}) {
    const ids = new Set(published.map(r => typeof r === 'string' ? r : r.id));
    return history(b, options).published.filter(r => !ids.has(r.id));
}
export function boundSideOptions(b, state, s, condition = {}) {
    return {leaning: state.status === 'lapsed' ? 'leave' : state.status === 'strained' ? (condition.pressed ? 'resist' : 'bargain') : 'stay',
        exits: live(state) ? b.exits.filter(e => (Array.isArray(e.by) ? e.by : [e.by]).some(who => who === s || who === state.sides[s]))
            .map(e => ({id: e.id, costs: copy(e.costs ?? []), needs: copy(e.consent)})) : []};
}
export function restoreBindings(raw) {
    check(object(raw) && raw.schema === BINDING_SCHEMA && Array.isArray(raw.bindings) && Array.isArray(raw.log), 'Unsupported bindings save.');
    const bindings = raw.bindings.map(defineBinding);
    check(new Set(bindings.map(b => b.id)).size === bindings.length, 'Duplicate binding.');
    for (const r of raw.log) {
        const b = bindings.find(row => row.id === r.binding);
        check(object(r) && b && natural(r.at) && r.at >= b.madeAt && (r.id === undefined || id(r.id)) &&
            ((r.kind === 'death' && side(r.side)) || (r.kind === 'exit' && exitData(b, r) && id(r.by) &&
                (exitData(b, r).kind !== 'transfer' || (side(r.side) && id(r.to)))) ||
             (r.kind === 'transfer' && side(r.side) && id(r.to))), 'Invalid binding event.');
    }
    return {bindings, log: copy(raw.log)};
}
export const serializeBindings = value => ({schema: BINDING_SCHEMA, ...copy(restoreBindings({schema: BINDING_SCHEMA, ...value}))});
export const carriedReader = (bindings, {log = [], receipts = []} = {}) => (key, at) => {
    const b = bindings.find(r => r.id === key);
    if (!b || at < b.madeAt) return null;
    const state = bindingState(b, {now: at, receipts, log});
    return live(state) ? {host: state.sides.a, status: state.status} : null;
};
