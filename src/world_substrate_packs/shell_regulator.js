// Reference contact pack, living regulator (W v0; ownership passes to chat L at
// embed). The same law as living_regulator.js and the meadow shell, expressed on
// the substrate: a shell body answers the place's humidity with hysteresis, and
// an inlet fixture (open drafts the air dry, closed lets it recharge) follows the
// shell through a fitted link after a delay. Here humidity is the place's shared
// quantity, so anything else in the room that adds or removes moisture counts.
// Smoke published into the place startles the shell shut for a while.
// When the body the inlet follows leaves, `onLeave` decides a correction still
// under way: 'drop' (default) leaves it unsettled, because the shell's push was
// what drove it (LT31 row 1); 'finish' is for an actuator that has the means to
// complete the stroke on its own (a spring or a counterweight). Either way the
// inlet then stays where it is: nothing is left for it to follow.
// tests/world_substrate.test.js holds the minute-by-minute parity with advanceLivingRegulator.
//
// `settle` is how a shell and its inlet are settled over a stretch (a dial):
//   'switch' (default): every pull and every draft is a published effect, and the
//     settlement is cut at each one. Use it where something listens for a draft.
//   'rate': a place with one shell and one inlet settles a whole undisturbed
//     stretch in one segment. The same minute-by-minute decisions are replayed
//     inside the pack (whole periods of the wave are multiplied, not walked), the
//     humidity and its ledger come out the same, and switches made by humidity
//     are counted in holder state (`pulls`, `opened`, `closed`) instead of being
//     published. Its price: nothing can hear those switches. A startle is still
//     published in both forms. Anything else acting on the humidity cuts the
//     stretch to single minutes, so the answer stays the per-minute one.
import {WORLD_QUANTITIES as Q, WORLD_EFFECT_KINDS as K} from '../world_quantities.js';

const scaled = (view, id, amount) => view.lawFields(view.placeOf(id), 'airflow.scale')
    .reduce((n, f) => Math.floor(n * f.params.numerator / f.params.denominator), amount);

export function createShellRegulatorPack(law) {
    const {delay, draft, recharge, closeBelow, openAbove, startleMinutes = 0, onLeave = 'drop', settle = 'switch'} = law;
    for (const n of [delay, draft, recharge, closeBelow, openAbove, startleMinutes])
        if (!Number.isSafeInteger(n) || n < 0) throw new Error('Shell regulator: law values are whole numbers.');
    if (!(delay >= 1 && closeBelow < openAbove && ['drop', 'finish'].includes(onLeave))) throw new Error('Shell regulator: delay >= 1, closeBelow < openAbove, onLeave drop or finish.');
    if (!['switch', 'rate'].includes(settle)) throw new Error('Shell regulator: settle is switch or rate.');
    const isBody = h => h.kind === 'body' && h.tags.includes('shell.body');
    const isInlet = h => h.kind === 'thing' && h.tags.includes('shell.inlet');
    const pull = (place, position) => ({op: 'publish', kind: 'shell.pull', place, detail: {position}});
    // The two decisions, shared by the laws below and by the rate form's replay.
    const shellAt = (shell, humidity, startled) => startled ? 'closed' : humidity < closeBelow ? 'closed' : humidity >= openAbove ? 'open' : shell;
    const inletAt = (s, clock) => {
        let position = s.position, pending = s.pending;
        if (s.mode !== 'linked') { position = s.mode; pending = null; }
        else {
            if (pending?.at === clock) { position = pending.position; pending = null; }
            if (!pending && s.wanted && s.wanted !== position) pending = {position: s.wanted, at: clock + delay};
        }
        return {position, pending};
    };

    // ----- rate form: one shell and one inlet on a place's humidity -----
    const {min, max} = Q.humidity;
    const pair = (view, id) => {
        if (settle !== 'rate') return null;
        const place = view.placeOf(id);
        if (!place || !view.has(place, 'humidity')) return null;
        const here = view.present(place).map(x => view.holder(x));
        const bodies = here.filter(isBody), inlets = here.filter(isInlet);
        return bodies.length === 1 && inlets.length === 1 ? {place, body: bodies[0].id, inlet: inlets[0].id} : null;
    };
    const start = (view, p) => {
        const b = view.state(p.body), i = view.state(p.inlet);
        return {clock: view.clock, h: view.amount(p.place, 'humidity'), raw: 0, moved: false, shell: b.shell, startled: b.startledUntil > view.clock,
            inlet: i, pulls: 0, opened: 0, closed: 0, down: scaled(view, p.inlet, draft)};
    };
    const rateOf = a => a.inlet.position === 'open' ? -a.down : recharge;
    const flow = a => { const r = rateOf(a); a.raw += r; a.moved ||= r !== 0; a.h = Math.min(max, Math.max(min, a.h + r)); a.clock++; };
    const decideBoth = (a, body) => {
        const shell = shellAt(a.shell, a.h, a.startled);
        if (shell !== a.shell) { a.shell = shell; a.pulls++; a.inlet = {...a.inlet, wanted: shell, follows: body}; }
        const next = inletAt(a.inlet, a.clock);
        if (next.position !== a.inlet.position) a[next.position === 'open' ? 'opened' : 'closed']++;
        a.inlet = {...a.inlet, ...next};
    };
    const keyOf = a => [a.h, a.shell, a.inlet.position, a.inlet.wanted, a.inlet.follows, a.inlet.pending?.position, a.inlet.pending ? a.inlet.pending.at - a.clock : ''].join();
    // `minutes` of flow with a decision after each but the last (the world's own
    // decision follows that one). Once a state repeats, the period is known:
    // the remaining whole periods add their counts and move the clock, nothing else.
    const replay = (a, minutes, body) => {
        let seen = new Map(), left = minutes - 1;
        while (left > 0) {
            flow(a); decideBoth(a, body); left--;
            if (!seen) continue;
            const key = keyOf(a), was = seen.get(key);
            if (!was) { seen.set(key, {clock: a.clock, raw: a.raw, pulls: a.pulls, opened: a.opened, closed: a.closed}); continue; }
            const period = a.clock - was.clock, times = Math.floor(left / period);
            for (const k of ['raw', 'pulls', 'opened', 'closed']) a[k] += (a[k] - was[k]) * times;
            if (a.inlet.pending) a.inlet = {...a.inlet, pending: {...a.inlet.pending, at: a.inlet.pending.at + period * times}};
            a.clock += period * times; left -= period * times; seen = null;
        }
        flow(a);
        return a;
    };
    // How far the replay holds with nothing else looking. Leaving a bound is its own
    // minute, because a flow from another pack that the bound was hiding shows then.
    const leaving = a => (a.h === max && rateOf(a) < 0) || (a.h === min && rateOf(a) > 0);
    const reach = (view, p) => {
        const a = start(view, p), seen = new Set();
        if (leaving(a)) return 1;
        for (let n = 1; ; n++) {
            flow(a); decideBoth(a, p.body);
            if (leaving(a)) return n;
            const key = keyOf(a);
            if (seen.has(key)) return Infinity;
            seen.add(key);
        }
    };
    const count = (s, tally) => {
        const out = {...s};
        for (const [k, n] of Object.entries(tally)) if (n) out[k] = (out[k] ?? 0) + n;
        return out;
    };
    return {
        id: 'l.shell_regulator', revision: 0,
        quantities: [Q.humidity], reads: ['humidity'], writes: ['humidity'],
        publishes: ['shell.pull', 'draft.opened', 'draft.closed'],
        hears: [K.smoke.id],
        laws: [{
            id: 'shell', appliesTo: isBody,
            watches: (view, id) => {
                const place = view.placeOf(id);
                // Rate form: the wave is replayed inside the pack, so the cut is any other flow on this air.
                if (pair(view, id)) return [{holder: place, quantity: 'humidity', op: 'eq', value: view.amount(place, 'humidity')}];
                return view.has(place, 'humidity') ? [{holder: place, quantity: 'humidity', op: 'lt', value: closeBelow},
                    {holder: place, quantity: 'humidity', op: 'gte', value: openAbove}] : [];
            },
            horizon: (view, id) => { const s = view.state(id); return s.startledUntil > view.clock ? s.startledUntil - view.clock : Infinity; },
            decide: (view, id) => {
                const place = view.placeOf(id), s = view.state(id);
                if (!view.has(place, 'humidity')) return [];
                const startled = s.startledUntil > view.clock;
                const shell = shellAt(s.shell, view.amount(place, 'humidity'), startled);
                const p = pair(view, id);
                if (p) {
                    // Counted, and handed to the inlet directly: what the pull and its link do in the switch form.
                    const {startledUntil, ...rest} = s;
                    const next = {...(shell !== s.shell ? count(rest, {pulls: 1}) : rest), shell, ...(startled ? {startledUntil} : {})};
                    if (JSON.stringify(next) === JSON.stringify(s)) return [];
                    return [{op: 'state', holder: id, value: next},
                        ...(shell !== s.shell ? [{op: 'state', holder: p.inlet, value: {...view.state(p.inlet), wanted: shell, follows: id}}] : [])];
                }
                const next = {shell, ...(startled ? {startledUntil: s.startledUntil} : {})};
                if (shell === s.shell && JSON.stringify(next) === JSON.stringify(s)) return [];
                return [{op: 'state', holder: id, value: next}, ...(shell !== s.shell ? [pull(place, shell)] : [])];
            },
        }, {
            id: 'inlet', appliesTo: isInlet,
            rates: (view, id) => {
                const place = view.placeOf(id), s = view.state(id);
                if (!view.has(place, 'humidity') || pair(view, id)) return [];
                return [{holder: place, quantity: 'humidity', perMinute: s.position === 'open' ? -scaled(view, id, draft) : recharge}];
            },
            horizon: (view, id) => {
                const p = pair(view, id);
                if (p) return reach(view, p);
                const pending = view.state(id).pending; return pending ? pending.at - view.clock : Infinity;
            },
            // Rate form. The total joins the other rates on this air before the bound clamps, so a
            // single minute beside another pack's flow comes out as the switch form's would. A stretch
            // longer than a minute has no other flow (the shell's watch), so the replay is the whole story.
            advance: (view, id, minutes) => {
                const p = pair(view, id);
                if (!p) return [];
                const a = replay(start(view, p), minutes, p.body), b = view.state(p.body);
                // A wave that nets nothing still moved the air: one unit each way keeps its ledger line, as the switch form does.
                const net = a.raw ? [a.raw] : a.moved ? [1, -1] : [];
                const body = {...count(b, {pulls: a.pulls}), shell: a.shell};
                const inlet = count(a.inlet, {opened: a.opened, closed: a.closed});
                return [...net.map(amount => ({op: 'add', holder: p.place, quantity: 'humidity', amount})),
                    ...(JSON.stringify(body) !== JSON.stringify(b) ? [{op: 'state', holder: p.body, value: body}] : []),
                    ...(JSON.stringify(inlet) !== JSON.stringify(view.state(id)) ? [{op: 'state', holder: id, value: inlet}] : [])];
            },
            decide: (view, id) => {
                const s = view.state(id), place = view.placeOf(id);
                const {position, pending} = inletAt(s, view.clock);
                if (position === s.position && JSON.stringify(pending) === JSON.stringify(s.pending)) return [];
                if (pair(view, id)) return [{op: 'state', holder: id,
                    value: {...(position !== s.position ? count(s, {[position === 'open' ? 'opened' : 'closed']: 1}) : s), position, pending}}];
                return [{op: 'state', holder: id, value: {...s, position, pending}},
                    ...(position !== s.position ? [{op: 'publish', kind: position === 'open' ? 'draft.opened' : 'draft.closed', place}] : [])];
            },
        }],
        reactors: [{
            id: 'inlet-link', on: ['shell.pull'], appliesTo: isInlet,
            react: (view, id, e) => {
                const s = view.state(id);
                return s.wanted === e.detail.position && s.follows === e.by ? []
                    : [{op: 'state', holder: id, value: {...s, wanted: e.detail.position, follows: e.by}}];
            },
        }, {
            id: 'inlet-leave', on: ['departed'], appliesTo: isInlet,
            react: (view, id, e) => {
                const s = view.state(id);
                if (!s.follows || s.follows !== e.by) return [];
                const pending = onLeave === 'finish' ? s.pending : null;
                return [{op: 'state', holder: id, value: {...s, pending, wanted: pending?.position ?? s.position, follows: null}}];
            },
        }, {
            id: 'startle', on: [K.smoke.id], appliesTo: isBody,
            react: (view, id) => {
                if (!startleMinutes) return [];
                const s = view.state(id), place = view.placeOf(id);
                const next = {...(settle === 'rate' ? s : {}), shell: 'closed', startledUntil: view.clock + startleMinutes};
                return [{op: 'state', holder: id, value: next}, ...(s.shell !== 'closed' ? [pull(place, 'closed')] : [])];
            },
        }],
    };
}

/** Holder state for a shell and its inlet, matching openLivingRegulator's start. */
export const shellBodyState = (shell = 'open') => ({shell});
export const shellInletState = ({mode = 'open', position = mode === 'linked' ? 'open' : mode, wanted = 'open', follows = null} = {}) =>
    ({mode, position, pending: null, wanted, follows});
