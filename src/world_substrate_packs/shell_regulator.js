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
import {WORLD_QUANTITIES as Q, WORLD_EFFECT_KINDS as K} from '../world_quantities.js';

const scaled = (view, id, amount) => view.lawFields(view.placeOf(id), 'airflow.scale')
    .reduce((n, f) => Math.floor(n * f.params.numerator / f.params.denominator), amount);

export function createShellRegulatorPack(law) {
    const {delay, draft, recharge, closeBelow, openAbove, startleMinutes = 0, onLeave = 'drop'} = law;
    for (const n of [delay, draft, recharge, closeBelow, openAbove, startleMinutes])
        if (!Number.isSafeInteger(n) || n < 0) throw new Error('Shell regulator: law values are whole numbers.');
    if (!(delay >= 1 && closeBelow < openAbove && ['drop', 'finish'].includes(onLeave))) throw new Error('Shell regulator: delay >= 1, closeBelow < openAbove, onLeave drop or finish.');
    const isBody = h => h.kind === 'body' && h.tags.includes('shell.body');
    const isInlet = h => h.kind === 'thing' && h.tags.includes('shell.inlet');
    const pull = (place, position) => ({op: 'publish', kind: 'shell.pull', place, detail: {position}});
    return {
        id: 'l.shell_regulator', revision: 0,
        quantities: [Q.humidity], reads: ['humidity'], writes: ['humidity'],
        publishes: ['shell.pull', 'draft.opened', 'draft.closed'],
        hears: [K.smoke.id],
        laws: [{
            id: 'shell', appliesTo: isBody,
            watches: (view, id) => {
                const place = view.placeOf(id);
                return view.has(place, 'humidity') ? [{holder: place, quantity: 'humidity', op: 'lt', value: closeBelow},
                    {holder: place, quantity: 'humidity', op: 'gte', value: openAbove}] : [];
            },
            horizon: (view, id) => { const s = view.state(id); return s.startledUntil > view.clock ? s.startledUntil - view.clock : Infinity; },
            decide: (view, id) => {
                const place = view.placeOf(id), s = view.state(id);
                if (!view.has(place, 'humidity')) return [];
                let shell = s.shell;
                const startled = s.startledUntil > view.clock;
                if (startled) shell = 'closed';
                else {
                    const h = view.amount(place, 'humidity');
                    if (h < closeBelow) shell = 'closed';
                    if (h >= openAbove) shell = 'open';
                }
                const next = {shell, ...(startled ? {startledUntil: s.startledUntil} : {})};
                if (shell === s.shell && JSON.stringify(next) === JSON.stringify(s)) return [];
                return [{op: 'state', holder: id, value: next}, ...(shell !== s.shell ? [pull(place, shell)] : [])];
            },
        }, {
            id: 'inlet', appliesTo: isInlet,
            rates: (view, id) => {
                const place = view.placeOf(id), s = view.state(id);
                if (!view.has(place, 'humidity')) return [];
                return [{holder: place, quantity: 'humidity', perMinute: s.position === 'open' ? -scaled(view, id, draft) : recharge}];
            },
            horizon: (view, id) => { const p = view.state(id).pending; return p ? p.at - view.clock : Infinity; },
            decide: (view, id) => {
                const s = view.state(id), place = view.placeOf(id);
                let position = s.position, pending = s.pending;
                if (s.mode !== 'linked') { position = s.mode; pending = null; }
                else {
                    if (pending?.at === view.clock) { position = pending.position; pending = null; }
                    if (!pending && s.wanted && s.wanted !== position) pending = {position: s.wanted, at: view.clock + delay};
                }
                if (position === s.position && JSON.stringify(pending) === JSON.stringify(s.pending)) return [];
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
                const next = {shell: 'closed', startledUntil: view.clock + startleMinutes};
                return [{op: 'state', holder: id, value: next}, ...(s.shell !== 'closed' ? [pull(place, 'closed')] : [])];
            },
        }],
    };
}

/** Holder state for a shell and its inlet, matching openLivingRegulator's start. */
export const shellBodyState = (shell = 'open') => ({shell});
export const shellInletState = ({mode = 'open', position = mode === 'linked' ? 'open' : mode, wanted = 'open', follows = null} = {}) =>
    ({mode, position, pending: null, wanted, follows});
