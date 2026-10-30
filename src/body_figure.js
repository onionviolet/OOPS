// RPX4/RPX9/RPX10 body representations as MDL2 figure specs. Pure: state in, spec out; no DOM, clock or save.
// Regions come from the `look.slot` the body owner already gives its traits and conditions, so a new
// trait or condition appears here without figure code. Facts sit in labels and notes, never in color
// alone (UR37); effects only mark a subject's settled state and the text form is identical without them (UR38).
import {bodyViewFromHarm} from './read_models/body_bridge.js';
import {bodySources, bodyConditions} from './body_progression.js';
import {observerView} from './observer_view.js';

// Figure coordinates (-1..1) for a standing body. A slot nobody placed falls back to the side column.
const REGIONS = {bearing: {label: 'Face and bearing', at: [0, -.9]}, build: {label: 'Build', at: [0, -.2]},
    hands: {label: 'Hands', at: [.8, .1]}, marks: {label: 'Marks', at: [.8, .8]}, skin: {label: 'Skin', at: [-.8, .1]}};
const BASE = ['bearing', 'build', 'hands', 'skin'];
const fallback = i => [-.8, Math.min(.95, .6 + i * .3)];
const lower = text => text.charAt(0).toLowerCase() + text.slice(1);
const plural = (n, word) => `${n} ${word}${n === 1 || word === 'min' ? '' : 's'}`;

// Recovery and conditioning milestones (BHR19, BHR29): the next useful step from saved counts.
const MILESTONES = [
    {id: 'grip', label: 'Conditioned grip', resource: 'grip_practice', need: 2, done: 'body.gripLearned', step: 'Drill', keep: 'Keep the grip'},
    {id: 'cold', label: 'Weathered skin', resource: 'cold_practice', need: 3, done: 'body.coldLearned', step: 'Soak', keep: 'Keep the skin'},
    {id: 'walk', label: 'Steadier frame', resource: 'steady_walks', need: 3, done: 'body.steadied', step: 'Walk', keep: 'Keep the frame', when: 'body.frailStart'},
];

/** The controlled body as a figure spec, or null before a body record exists. */
export function bodyFigureSpec(state, {sources = bodySources, conditions = bodyConditions} = {}) {
    const seat = observerView(state), actor = state?.actors?.[seat.actorId];
    if (!actor?.facts?.['body.enrolled']) return null;
    const clock = state.clock ?? 0, live = state.simulation?.conditions?.[seat.actorId] || {};
    const current = x => x && (x.expiresAt == null || x.expiresAt > clock);
    // BHR6: only conditions the body owner marks as showable; a hidden one waits for its sign or test.
    const active = conditions.filter(c => c.bioVisible === true && current(live[c.id]) && live[c.id].intensity > 0)
        .map(c => ({...c, minutesLeft: live[c.id].expiresAt == null ? null : live[c.id].expiresAt - clock}));
    const held = sources.filter(s => s.look && current(actor.sources?.[s.id]) && !(s.supersededBy && current(actor.sources?.[s.supersededBy])));
    const slots = [...new Set([...BASE, ...held.map(s => s.look.slot), ...active.map(c => c.look?.slot || 'hands')])];
    const extra = slots.filter(slot => !REGIONS[slot]);
    const nodes = slots.map(slot => {
        const here = active.filter(c => (c.look?.slot || 'hands') === slot), traits = held.filter(s => s.look.slot === slot);
        const region = REGIONS[slot] || {label: slot.charAt(0).toUpperCase() + slot.slice(1), at: fallback(extra.indexOf(slot))};
        return {id: `region-${slot}`, label: region.label, at: region.at,
            ...(here.length ? {state: 'strained', effect: 'pulse'} : traits.length ? {state: 'filled'} : {})};
    });
    const regionOf = slot => (REGIONS[slot] || {label: slot}).label.toLowerCase();
    const notes = [
        ...active.map(c => ({state: 'strained', text: `${c.label} (${regionOf(c.look?.slot || 'hands')}${c.minutesLeft == null ? ', until treated' : `, ${plural(c.minutesLeft, 'min')} left`}): ${c.bioDetail}`})),
        ...held.map(s => ({state: 'filled', text: `${s.label} (${regionOf(s.look.slot)}, ${s.origin}): ${s.look.text}`})),
    ];
    const tracks = MILESTONES.filter(m => !actor.facts[m.done] && (!m.when || actor.facts[m.when]) && (actor.resources?.[m.resource] || 0) > 0).map(m => {
        const n = Math.min(m.need, actor.resources[m.resource]);
        return {id: m.id, label: m.label, steps: [...Array.from({length: m.need}, (_, i) => ({label: `${m.step} ${i + 1}`, state: i < n ? 'done' : i === n ? 'current' : 'pending'})),
            {label: m.keep, state: n >= m.need ? 'current' : 'pending'}]};
    });
    const summary = active.length ? `Now: ${active.map(c => lower(c.label)).join(', ')}.` : 'Nothing is troubling this body right now.';
    return {id: 'body-record', size: 520, title: 'Your body', summary, nodes, tracks, notes,
        legend: [{state: 'strained', label: 'condition now'}, {state: 'filled', label: 'lasting change'}, {state: 'done', label: 'step done'}, {state: 'current', label: 'next step'}]};
}

/** RPX4: a body's channel affinities (cultivation root {flow, still, tested}) as a channel ring. */
export function channelFigureSpec(root, {name = 'Channels'} = {}) {
    const known = root?.tested === true;
    const slots = ['flow', 'still'].flatMap((channel, c) => Array.from({length: 4}, (_, i) => ({
        id: `${channel}-${i + 1}`, ring: 'channels', index: c * 4 + i, label: `${channel === 'flow' ? 'Flow' : 'Still'} ${i + 1}`,
        state: !known ? 'unknown' : i < root[channel] ? 'filled' : 'empty', ...(known && i < root[channel] && i === root[channel] - 1 ? {effect: 'glow'} : {})})));
    return {id: 'body-channels', size: 520, title: name,
        summary: known ? `Flow ${root.flow} of 4, still ${root.still} of 4, measured.` : 'Not yet measured. The affinity is real and already shapes your work; a test reveals it.',
        rings: [{id: 'channels', label: 'Channels', radius: .8, slots: 8}],
        nodes: [{id: 'core', label: 'Core', glyph: '◎', at: 'center'}], slots,
        edges: [{from: 'core', to: 'flow-1', kind: 'flow'}, {from: 'core', to: 'still-1', kind: 'still'}],
        legend: [{state: 'filled', label: 'open'}, {state: 'empty', label: 'not open'}, {state: 'unknown', label: 'not measured'}, {kind: 'flow', label: 'breath methods draw on flow'}, {kind: 'still', label: 'sitting methods draw on stillness'}]};
}

/** RPX10: a borrowed face over your own body, from the Polyjuice view ({effect, condition}). Null when nothing is borrowed. */
export function secondBodyFigureSpec(view) {
    const fx = view?.effect, animal = view?.condition?.id === 'animal_features';
    if (!animal && !(fx && ['transform', 'thin'].includes(fx.kind))) return null;
    const face = animal ? {label: 'Animal features', state: 'strained'} : {label: `Appearing as ${fx.donorName}`, state: 'active', effect: 'pulse'};
    const time = animal ? `${plural(view.condition.daysLeft, 'day')} to clear` : `${plural(fx.minutesLeft, 'min')} left${fx.kind === 'thin' ? ', thin brew' : ''}`;
    return {id: 'body-second', size: 520, title: 'Who sees which body',
        summary: animal ? 'The wrong hair: part animal, and it will take days to clear.' : `Others see ${fx.donorName}. You know it is you.`,
        nodes: [{id: 'own', label: 'Your own body', glyph: 'Y', at: [-.55, 0], state: 'pending'}, {id: 'face', label: face.label, glyph: animal ? '?' : fx.donorName.charAt(0), at: [.55, 0], state: face.state, ...(face.effect ? {effect: face.effect} : {})},
            {id: 'others', label: 'People around you', glyph: '…', at: [.55, -.75]}, {id: 'you', label: 'You', glyph: '◆', at: [-.55, -.75]}],
        edges: [{from: 'others', to: 'face', kind: 'sees'}, {from: 'you', to: 'own', kind: 'knows'}, {from: 'own', to: 'face', kind: 'worn over', label: time}],
        notes: [{text: 'Your memory, skills and knowledge stay yours under the borrowed face; only appearance and voice change.'}],
        legend: [{kind: 'sees', label: 'what they see'}, {kind: 'knows', label: 'what you know'}, {kind: 'worn over', label: 'time left'}, {state: 'active', label: 'borrowed now'}, {state: 'pending', label: 'hidden underneath'}]};
}

// Round 2 (BC7): the body by part, health-panel style. One row per part that has something to say, with
// what is wrong now, how far recovery has come and which known verb clears it, beside what others can see.
// Durations and cures are read from the commands that apply or remove each condition, so new body
// content shows its own recovery and treatment without view code.
const effectsOf = d => d.effects || [];
// `cureCommands` narrows the listed cures to verbs the showing surface can run (default: every command).
export function bodyViewModel(state, {commands = [], cureCommands = commands, sources = bodySources, conditions = bodyConditions, harm = null} = {}) {
    const seat = observerView(state), actor = state?.actors?.[seat.actorId];
    if (!actor?.facts?.['body.enrolled']) return null;
    const clock = state.clock ?? 0, live = state.simulation?.conditions?.[seat.actorId] || {};
    const current = x => x && (x.expiresAt == null || x.expiresAt > clock);
    const slotOf = c => c.look?.slot || 'hands';
    const now = conditions.filter(c => c.bioVisible === true && current(live[c.id]) && live[c.id].intensity > 0).map(c => {
        const record = live[c.id], left = record.expiresAt == null ? null : record.expiresAt - clock;
        const lengths = [...new Set(commands.flatMap(d => effectsOf(d).filter(e => e.type === 'condition' && e.id === c.id && e.operation === 'apply' && e.duration).map(e => e.duration)))];
        const total = lengths.length === 1 && left != null && left <= lengths[0] ? lengths[0] : null;
        const cures = cureCommands.filter(d => effectsOf(d).some(e => e.type === 'condition' && e.id === c.id && e.operation === 'remove')).map(d => ({id: d.id, label: d.label}));
        return {id: c.id, label: c.label, slot: slotOf(c), level: record.intensity > 1 ? record.intensity : null,
            time: left == null ? 'until treated' : `${left} min left`, recovered: total ? {done: total - left, of: total} : null,
            felt: c.bioDetail, seen: c.look?.text || null, cures, waits: left != null};
    });
    const held = sources.filter(s => s.look && current(actor.sources?.[s.id]) && !(s.supersededBy && current(actor.sources?.[s.supersededBy])))
        .map(s => ({id: s.id, label: s.label, slot: s.look.slot, origin: s.origin, seen: s.look.text, felt: s.bioDetail}));
    const order = [...Object.keys(REGIONS)];
    const slots = [...new Set([...now.map(c => c.slot), ...held.map(s => s.slot)])].sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99));
    const parts = slots.map(slot => ({slot, label: (REGIONS[slot] || {label: slot.charAt(0).toUpperCase() + slot.slice(1)}).label,
        now: now.filter(c => c.slot === slot), lasting: held.filter(s => s.slot === slot)}));
    const milestones = MILESTONES.filter(m => !actor.facts[m.done] && (!m.when || actor.facts[m.when]) && (actor.resources?.[m.resource] || 0) > 0)
        .map(m => ({id: m.id, label: m.label, done: Math.min(m.need, actor.resources[m.resource]), need: m.need, step: m.step, keep: m.keep}));
    // Harm (the L9 ladder, parts and carriers) is felt and owned by the seat alone: the bridge builds its groups from harmView(save).
    const hurt = harm ? bodyViewFromHarm(harm) : null, glance = now.map(({id, label, slot, time, level}) => ({id, label, slot, time, level}));
    if (hurt) { parts.push(...hurt.parts.filter(p => !parts.some(q => q.slot === p.slot))); glance.push(...hurt.glance); }
    return {title: 'Your body', glance, parts, milestones,
        empty: parts.length ? null : 'Nothing is troubling this body right now. Training, work and injuries will show here by body part.'};
}
