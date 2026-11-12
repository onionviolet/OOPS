// Proposal (AD32), PC94/95/98/99, PFP3/10: one law, caller-authored carriers and prices.
import {validateAlterationRow, pressurePermille, crowdedLoad} from '../body_alteration.js';
const families = ['alteration_capacity', 'alteration_load', 'alteration_course', 'alteration_relief'];
const q = (family, key) => `alteration_${family}:${key}`;
const add = (holder, quantity, amount) => ({op: 'add', holder, quantity, amount});
const state = (holder, value) => ({op: 'state', holder, value});
const empty = () => ({installed: [], stages: {}, next: 0});
export function createBodyAlterationPack({rows = [], budgets = {}, slots = {}, courses = {}} = {}) {
    const byId = Object.fromEntries(rows.map(row => [validateAlterationRow(row).id, row]));
    if (Object.keys(byId).length !== rows.length) throw Error('Body alteration: duplicate row.');
    for (const row of rows) for (const key of Object.keys(row.load))
        if (!budgets[key]) throw Error('Body alteration: missing budget.');
    for (const row of rows) if (!courses[row.course.key]) throw Error('Body alteration: missing course.');
    const whole = n => Number.isSafeInteger(n) && n >= 0;
    for (const b of Object.values(budgets)) pressurePermille(0, b.capacity, b.curve);
    for (const slot of Object.values(slots)) if (!whole(slot.room) || !whole(slot.crowdPermille))
        throw Error('Body alteration: malformed slot.');
    for (const c of Object.values(courses)) {
        if (!whole(c.recoverPerMinute) || (c.relief && (!whole(c.relief.blocksPermille) ||
            c.relief.blocksPermille > 1000 || !whole(c.relief.decayPerMinute))) ||
            !(c.stages ?? []).every((x, i, xs) => typeof x.id === 'string' && whole(x.at) && (!i || xs[i - 1].at < x.at)))
            throw Error('Body alteration: malformed course.');
    }
    const external = rows.flatMap(r => [...(r.upkeep ?? []).map(x => x.quantity), ...(r.grants?.quantities ?? []).map(x => x.quantity)]);
    const vocabulary = [...new Set([...families, ...external])];
    const amount = (v, id, name) => v.has(id, name) ? v.amount(id, name) : 0;
    const ensure = (v, id, entries) => [...new Map(entries)].filter(([name]) => !v.has(id, name))
        .map(([quantity, value]) => ({op: 'carry', holder: id, quantity, amount: value}));
    const support = (v, id) => ensure(v, id, [
        ...Object.entries(budgets).flatMap(([k, b]) => [[q('capacity', k), b.capacity], [q('load', k), 0]]),
        ...Object.keys(courses).flatMap(k => [[q('course', k), 0], [q('relief', k), 0]]),
    ]);
    const pressure = (v, item) => Math.max(1000, ...Object.keys(item.load).map(k =>
        pressurePermille(amount(v, item.bearer, q('load', k)), amount(v, item.bearer, q('capacity', k)), budgets[k].curve)));
    const held = (v, item, k) => {
        const row = byId[item.row];
        return row.settles ? Math.max(Math.min(item.load[k], row.settles.floor),
            item.load[k] - row.settles.perMinute * (v.clock - item.at)) : item.load[k];
    };
    const reverse = (v, id, item) => [
        ...Object.keys(item.load).filter(() => v.holder(item.bearer)).map(k => add(item.bearer, q('load', k), -held(v, item, k))),
        ...(byId[item.row].grants?.quantities ?? []).map(x => add(id, x.quantity, -x.amount)),
    ];
    return {id: 'l.body_alteration', revision: 0,
        quantities: families.map(id => ({id, keyed: true, unit: 'alteration-unit', min: 0, max: Number.MAX_SAFE_INTEGER})),
        reads: vocabulary, writes: vocabulary,
        hears: ['alteration.install', 'alteration.remove'],
        publishes: ['alteration.stage', ...new Set(Object.values(courses).flatMap(c => (c.stages ?? []).flatMap(s => s.publish ? [s.publish.kind] : [])))],
        reactors: [{id: 'installation', on: ['alteration.install', 'alteration.remove'], appliesTo: () => true,
            react: (v, id, effect) => {
                if (effect.detail?.target !== id) return [];
                const {row: key, bearer = id} = effect.detail, row = byId[key], s = v.state(id) ?? empty();
                if (!row || !v.holder(bearer)) throw Error('Body alteration: unknown row or bearer.');
                if (effect.kind === 'alteration.remove') {
                    const item = s.installed.find(x => x.row === key);
                    return item ? [...reverse(v, id, item), state(id, {...s, installed: s.installed.filter(x => x !== item)})] : [];
                }
                const load = crowdedLoad(row, s.installed.filter(x => byId[x.row].slot === row.slot).length, slots[row.slot]);
                const grants = row.grants?.quantities ?? [], carries = support(v, bearer);
                carries.push(...ensure(v, bearer, (row.upkeep ?? []).filter(x => !carries.some(c => c.quantity === x.quantity)).map(x => [x.quantity, 0])));
                const planned = new Set(carries.filter(x => x.holder === id).map(x => x.quantity));
                return [...carries,
                    ...ensure(v, id, grants.filter(x => !planned.has(x.quantity)).map(x => [x.quantity, 0])),
                    ...Object.entries(load).map(([k, n]) => add(bearer, q('load', k), n)),
                    ...grants.map(x => add(id, x.quantity, x.amount)),
                    ...(bearer !== id && !v.state(bearer) ? [state(bearer, empty())] : []),
                    state(id, {...s, next: s.next + 1, installed: [...s.installed, {row: key, bearer, load, at: v.clock, serial: s.next}]})];
            }}],
        laws: [{id: 'courses', appliesTo: h => !!h.state['l.body_alteration'],
            // Whole-minute rates can change with any upstream budget or upkeep flow, so a body with
            // something installed or a course still running settles a minute at a time. A quiet body
            // costs no segments. Dial for later: predict the next breakpoint for long far settlement.
            horizon: (v, id) => v.state(id).installed.length || Object.keys(courses).some(k =>
                amount(v, id, q('course', k)) > 0 || amount(v, id, q('relief', k)) > 0) ? 1 : Infinity,
            rates: (v, id) => {
                const s = v.state(id), rates = [], drive = {};
                for (const item of s.installed) {
                    if (!v.holder(item.bearer)) continue;
                    const row = byId[item.row], p = pressure(v, item), key = `${item.bearer}\u0000${row.course.key}`;
                    drive[key] = (drive[key] ?? 0) + row.course.perMinute + Math.floor(row.course.overPerMinute * (p - 1000) / 1000) +
                        ((row.upkeep ?? []).some(x => amount(v, item.bearer, x.quantity) <= 0) ? row.unmetPerMinute ?? 0 : 0);
                    for (const x of row.upkeep ?? []) rates.push({holder: item.bearer, quantity: x.quantity, perMinute: -Math.floor(x.perMinute * p / 1000)});
                    if (row.settles) for (const k of Object.keys(item.load)) {
                        const remaining = held(v, item, k), floor = Math.min(item.load[k], row.settles.floor);
                        rates.push({holder: item.bearer, quantity: q('load', k), perMinute: -Math.min(row.settles.perMinute, remaining - floor)});
                    }
                }
                for (const [key, n] of Object.entries(drive)) {
                    const [holder, course] = key.split('\u0000'), c = courses[course];
                    rates.push({holder, quantity: q('course', course), perMinute: Math.floor(n *
                        (amount(v, holder, q('relief', course)) > 0 ? 1000 - (c.relief?.blocksPermille ?? 0) : 1000) / 1000)});
                }
                for (const [key, c] of Object.entries(courses)) if (v.has(id, q('course', key))) {
                    const recovery = v.lawFields(v.placeOf(id), 'alteration.care').reduce((n, f) =>
                        Math.floor(n * f.params.numerator / f.params.denominator), c.recoverPerMinute);
                    rates.push({holder: id, quantity: q('course', key), perMinute: -recovery});
                    if (amount(v, id, q('relief', key)) > 0) rates.push({holder: id, quantity: q('relief', key), perMinute: -(c.relief?.decayPerMinute ?? 0)});
                }
                return rates;
            },
            decide: (v, id) => {
                const s = v.state(id), ops = [], installed = s.installed.filter(item => {
                    const row = byId[item.row], gone = !v.holder(item.bearer) || v.placeOf(item.bearer) !== v.placeOf(id);
                    if (!gone && (row.lasts === undefined || v.clock < item.at + row.lasts)) return true;
                    ops.push(...reverse(v, id, item)); return false;
                });
                const stages = {...s.stages};
                for (const [key, c] of Object.entries(courses)) {
                    const stage = (c.stages ?? []).filter(x => amount(v, id, q('course', key)) >= x.at).at(-1)?.id ?? null;
                    if ((stages[key] ?? null) === stage) continue;
                    stages[key] = stage;
                    ops.push({op: 'publish', kind: 'alteration.stage', place: v.placeOf(id), detail: {target: id, course: key, stage}});
                    const extra = c.stages?.find(x => x.id === stage)?.publish;
                    if (extra) ops.push({op: 'publish', ...extra, place: v.placeOf(id), detail: {target: id, ...extra.detail}});
                }
                if (ops.length) ops.push(state(id, {...s, installed, stages}));
                return ops;
            }}]};
}
