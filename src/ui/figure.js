// MDL2 figure primitive. One declarative spec becomes inline SVG; rituals, relationship webs,
// meridians, maps, timelines and boards are data for it, never kind-specific drawing code.
// Spec: {id, title, summary?, size?, rings[], nodes[], slots[], tracks[], edges[], notes[], legend[]}
//   ring   {id, label, radius 0..1, segments:[{label,state,effect}] | slots:N | count:N, labels:'out'|'in', rotate, visible, state}
//   node   {id, label, glyph, state, effect, at:'center'|[x,y] | ring + index}      (x, y in -1..1 of the figure radius)
//   slot   {id, label, ring, index, state, effect}      a node on a ring that is drawn as a place to fill
//   track  {id, label, progress, orient:'horizontal'|'vertical', steps:[{label,state,effect,fill,note}]}
//          progress is counted from the steps' states unless progress (words) is given; a vertical track runs bottom (first step) to top (a ladder).
//          fill 0..1 draws a partial ring round the pip (digestion, mastery); note is its words, and the text form
//          reads the note, or the fill as a percentage when there is no note, so the drawing never holds a fact alone.
//   edge   {from, to, kind, label, state}                kinds take distinct line patterns in order of first use
//   note   {text, state}                                 plain words, e.g. a risk line
//   legend [{state|kind, label}]                         optional; derived from what is drawn when absent
// States carry a mark glyph and a word, so no fact lives in shape or color alone (UR37). Effects (MDL8,
// UR38) are CSS classes only: glow and pulse never move layout and styles/figure.css switches them off
// under data-effects off and reduced. The node's own document draws the figure, so it works in pop-outs.
const SVG_NS = 'http://www.w3.org/2000/svg';
export const FIGURE_STATES = {filled: '●', empty: '○', broken: '✕', strained: '!', active: '◆', done: '✓', current: '▶', pending: '·', guessed: '~', unknown: '?'};
export const FIGURE_EFFECTS = ['glow', 'pulse'];
const EDGE_STYLES = 4;
const DEFAULT_SIZE = 560, MARKER_R = 18, PIP_R = 12, TRACK_H = 92, NOTE_H = 20, PAD = 56, RUNG_H = 64, RUNG_TOP = 40;

const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const list = (spec, key) => spec[key] === undefined ? [] : spec[key];
const word = state => state.charAt(0).toUpperCase() + state.slice(1);

/** Throws a readable Error for a malformed spec; returns a normalized copy (arrays defaulted, ring counts resolved). */
export function validateFigureSpec(input) {
    const fail = message => { throw new Error(`Figure spec${input && input.id ? ` "${input.id}"` : ''}: ${message}`); };
    if (!input || typeof input !== 'object') fail('must be an object');
    if (typeof input.id !== 'string' || !input.id) fail('needs an id');
    if (typeof input.title !== 'string' || !input.title) fail('needs a title');
    const spec = {...input};
    for (const key of ['rings', 'nodes', 'slots', 'tracks', 'edges', 'notes', 'legend']) {
        spec[key] = list(input, key);
        if (!Array.isArray(spec[key])) fail(`${key} must be an array`);
    }
    spec.size = input.size === undefined ? DEFAULT_SIZE : input.size;
    if (!Number.isFinite(spec.size) || spec.size < 200) fail('size must be a number of at least 200');
    const checkState = (state, where) => { if (state !== undefined && !own(FIGURE_STATES, state)) fail(`${where} has unknown state "${state}"`); };
    const checkEffect = (effect, where) => { if (effect !== undefined && !FIGURE_EFFECTS.includes(effect)) fail(`${where} has unknown effect "${effect}"`); };
    const ringIds = new Set();
    spec.rings = spec.rings.map(ring => {
        if (!ring || typeof ring.id !== 'string' || !ring.id) fail('every ring needs an id');
        if (ringIds.has(ring.id)) fail(`duplicate ring id "${ring.id}"`);
        ringIds.add(ring.id);
        if (!(ring.radius > 0 && ring.radius <= 1)) fail(`ring "${ring.id}" radius must be above 0 and at most 1`);
        const segments = ring.segments === undefined ? [] : ring.segments;
        if (!Array.isArray(segments)) fail(`ring "${ring.id}" segments must be an array`);
        if (ring.labels !== undefined && !['out', 'in'].includes(ring.labels)) fail(`ring "${ring.id}" labels must be out or in`);
        checkState(ring.state, `ring "${ring.id}"`);
        segments.forEach((segment, i) => {
            if (!segment || typeof segment.label !== 'string') fail(`ring "${ring.id}" segment ${i + 1} needs a label`);
            checkState(segment.state, `ring "${ring.id}" segment ${i + 1}`); checkEffect(segment.effect, `ring "${ring.id}" segment ${i + 1}`);
        });
        return {...ring, segments, label: ring.label || ring.id, labels: ring.labels || 'out', rotate: ring.rotate || 0, visible: ring.visible !== false};
    });
    const rings = new Map(spec.rings.map(ring => [ring.id, ring]));
    const markerIds = new Set();
    const asMarker = (item, kind) => {
        if (!item || typeof item.id !== 'string' || !item.id) fail(`every ${kind} needs an id`);
        if (markerIds.has(item.id)) fail(`duplicate node or slot id "${item.id}"`);
        markerIds.add(item.id);
        if (typeof item.label !== 'string' || !item.label) fail(`${kind} "${item.id}" needs a label`);
        checkState(item.state, `${kind} "${item.id}"`); checkEffect(item.effect, `${kind} "${item.id}"`);
        const onRing = item.ring !== undefined;
        if (kind === 'slot' && !onRing) fail(`slot "${item.id}" needs a ring`);
        if (onRing) {
            if (!rings.has(item.ring)) fail(`${kind} "${item.id}" uses unknown ring "${item.ring}"`);
            if (!Number.isInteger(item.index) || item.index < 0) fail(`${kind} "${item.id}" needs a whole-number index`);
        } else if (!(item.at === 'center' || (Array.isArray(item.at) && item.at.length === 2 && item.at.every(v => Number.isFinite(v) && Math.abs(v) <= 1)))) {
            fail(`${kind} "${item.id}" needs a ring and index, or at: 'center' or [x, y] within -1..1`);
        }
        return {...item, kind};
    };
    spec.nodes = spec.nodes.map(node => asMarker(node, 'node'));
    spec.slots = spec.slots.map(slot => asMarker(slot, 'slot'));
    const markers = new Map([...spec.nodes, ...spec.slots].map(marker => [marker.id, marker]));
    spec.rings = spec.rings.map(ring => {
        const used = [...markers.values()].filter(marker => marker.ring === ring.id).map(marker => marker.index + 1);
        const declared = Math.max(ring.count || 0, ring.slots || 0, ring.segments.length), count = Math.max(declared, ...used);
        if (!Number.isInteger(count) || count < 1) fail(`ring "${ring.id}" has no segments, slots or members`);
        if (declared && used.some(n => n > declared)) fail(`ring "${ring.id}" has a member beyond its ${declared} positions`);
        return {...ring, count};
    });
    const trackIds = new Set();
    spec.tracks.forEach(track => {
        if (!track || typeof track.id !== 'string' || !track.id) fail('every track needs an id');
        if (trackIds.has(track.id)) fail(`duplicate track id "${track.id}"`);
        trackIds.add(track.id);
        if (!Array.isArray(track.steps) || !track.steps.length) fail(`track "${track.id}" needs steps`);
        if (track.progress !== undefined && (typeof track.progress !== 'string' || !track.progress)) fail(`track "${track.id}" progress must be words`);
        if (track.orient !== undefined && !['horizontal', 'vertical'].includes(track.orient)) fail(`track "${track.id}" orient must be horizontal or vertical`);
        track.steps.forEach((step, i) => {
            const where = `track "${track.id}" step ${i + 1}`;
            if (!step || typeof step.label !== 'string') fail(`${where} needs a label`);
            checkState(step.state, where); checkEffect(step.effect, where);
            if (step.fill !== undefined && !(Number.isFinite(step.fill) && step.fill >= 0 && step.fill <= 1)) fail(`${where} fill must be a number from 0 to 1`);
            if (step.note !== undefined && (typeof step.note !== 'string' || !step.note)) fail(`${where} note must be words`);
        });
    });
    spec.edges.forEach((edge, i) => {
        if (!edge || !markers.has(edge.from) || !markers.has(edge.to)) fail(`edge ${i + 1} must join two known nodes or slots`);
        if (typeof edge.kind !== 'string' || !edge.kind) fail(`edge ${i + 1} needs a kind`);
        checkState(edge.state, `edge ${i + 1}`);
    });
    spec.notes.forEach((note, i) => { if (!note || typeof note.text !== 'string' || !note.text) fail(`note ${i + 1} needs text`); checkState(note.state, `note ${i + 1}`); });
    spec.legend.forEach((entry, i) => { if (!entry || typeof entry.label !== 'string' || (entry.state === undefined) === (entry.kind === undefined)) fail(`legend entry ${i + 1} needs a label and exactly one of state or kind`); checkState(entry.state, `legend entry ${i + 1}`); });
    return spec;
}

const stepProgress = track => track.progress || `${track.steps.filter(step => step.state === 'done').length} of ${track.steps.length} done`;
const tag = state => state ? ` (${state})` : '';
const stepTag = step => {
    const parts = [step.state, step.note || (step.fill !== undefined ? `${Math.round(step.fill * 100)}% filled` : undefined)].filter(Boolean);
    return parts.length ? ` (${parts.join('; ')})` : '';
};
// Horizontal labels wrap to the space between steps (end labels turn inward, so they get half of it);
// the track grows to fit its tallest label.
const stepWords = step => step.note ? `${step.label} · ${step.note}` : step.label;
const wrapChars = (track, size, i) => {
    const n = track.steps.length, gap = n > 1 ? (size - 2 * PAD) / (n - 1) : size - 2 * PAD, edge = n > 1 && (i === 0 || i === n - 1);
    return Math.max(6, Math.floor(gap * (edge ? .5 : .9) / 9));
};
const trackHeight = (track, size) => track.orient === 'vertical' ? RUNG_TOP + track.steps.length * RUNG_H
    : Math.max(TRACK_H, 38 + PIP_R + 30 + Math.max(...track.steps.map((step, i) => wrap(stepWords(step), wrapChars(track, size, i)).length)) * 16);

/** The same facts as the drawing, as plain lines: the accessible description and the effects-off reading. */
export function figureText(input) {
    const spec = validateFigureSpec(input);
    const name = new Map([...spec.nodes, ...spec.slots].map(marker => [marker.id, marker.label]));
    const lines = [spec.title];
    if (spec.summary) lines.push(spec.summary);
    for (const ring of spec.rings) {
        const members = [...spec.slots, ...spec.nodes].filter(marker => marker.ring === ring.id).sort((a, b) => a.index - b.index);
        const parts = [
            ...ring.segments.map(segment => `${segment.label}${tag(segment.state)}`),
            ...members.map(marker => `${marker.index + 1}. ${marker.label}${tag(marker.state)}`),
        ];
        const count = ring.segments.length ? `${ring.segments.length} segments` : `${ring.count} places`;
        lines.push(`Ring ${ring.label}${tag(ring.state)}, ${count}: ${parts.length ? parts.join('; ') : 'nothing placed'}.`);
    }
    const loose = spec.nodes.filter(node => node.ring === undefined);
    if (loose.length) lines.push(`Nodes: ${loose.map(node => `${node.label}${tag(node.state)}`).join('; ')}.`);
    for (const track of spec.tracks) lines.push(`Track ${track.label || track.id}, ${stepProgress(track)}: ${track.steps.map((step, i) => `${i + 1}. ${step.label}${stepTag(step)}`).join('; ')}.`);
    for (const edge of spec.edges) lines.push(`${name.get(edge.from)} to ${name.get(edge.to)}: ${edge.kind}${edge.label ? `, ${edge.label}` : ''}${tag(edge.state)}.`);
    for (const note of spec.notes) lines.push(`${note.state ? `${word(note.state)}: ` : ''}${note.text}`);
    for (const entry of spec.legend) lines.push(`Key: ${entry.state ? `${FIGURE_STATES[entry.state]} ${entry.state}` : entry.kind} means ${entry.label}.`);
    return lines.join('\n');
}

// Geometry. Items sit at -90 degrees (top) plus their index step, clockwise.
const polar = (cx, cy, r, deg) => ({x: cx + r * Math.cos(deg * Math.PI / 180), y: cy + r * Math.sin(deg * Math.PI / 180)});
const round1 = n => Math.round(n * 10) / 10;
const arc = (cx, cy, r, from, to) => {
    const a = polar(cx, cy, r, from), b = polar(cx, cy, r, to);
    return `M${round1(a.x)} ${round1(a.y)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${round1(b.x)} ${round1(b.y)}`;
};
function wrap(text, max) {
    const lines = [];
    for (const word of String(text).split(/\s+/)) {
        if (lines.length && lines[lines.length - 1].length + word.length < max) lines[lines.length - 1] += ` ${word}`; else lines.push(word);
    }
    return lines;
}
// Text anchor and baseline nudge for a label that sits outside (or, inverted, inside) a point on a circle.
function anchorFor(deg, outward) {
    const cos = Math.cos(deg * Math.PI / 180), sin = Math.sin(deg * Math.PI / 180), s = outward ? 1 : -1;
    return {anchor: cos * s > .3 ? 'start' : cos * s < -.3 ? 'end' : 'middle', dy: sin * s > .3 ? 1 : sin * s < -.3 ? -1 : 0, dx: cos * s > .3 ? 1 : cos * s < -.3 ? -1 : 0};
}

/**
 * Draw `spec` into `node` (replacing its children) with node's own document.
 * options: {idPrefix, legend = true, text = false (append the text form), document}
 * Returns {svg, text}.
 */
export function renderFigure(node, input, options = {}) {
    const spec = validateFigureSpec(input);
    const doc = options.document || node.ownerDocument;
    const prefix = options.idPrefix || spec.id;
    const text = figureText(spec);
    const make = (name, attrs = {}, content) => {
        const el = doc.createElementNS(SVG_NS, name);
        for (const [key, value] of Object.entries(attrs)) if (value !== undefined && value !== false) el.setAttribute(key, String(value));
        if (content !== undefined) el.textContent = content;
        return el;
    };
    const lines = (parent, x, y, rows, attrs) => {
        const label = make('text', {...attrs, x: round1(x), y: round1(y)});
        rows.forEach((row, i) => label.append(make('tspan', {x: round1(x), dy: i ? '1.15em' : 0}, row)));
        parent.append(label); return label;
    };
    const fx = item => item.effect ? ` fig-fx--${item.effect}` : '';
    const stateClass = state => state ? ` fig-state--${state}` : '';

    const radial = spec.rings.length > 0 || spec.nodes.length > 0 || spec.slots.length > 0;
    const S = spec.size, R = S / 2 - PAD - 54, cx = S / 2, cy = S / 2, noteWidth = Math.floor((S - PAD) / 9);
    const radialH = radial ? S : 0;
    const tracksH = spec.tracks.reduce((sum, track) => sum + trackHeight(track, S), 0);
    const height = radialH + tracksH + spec.notes.reduce((sum, note) => sum + wrap(note.text, noteWidth).length * NOTE_H, 0) + (spec.notes.length ? NOTE_H : 0);
    const svg = make('svg', {class: 'fig-svg', xmlns: SVG_NS, viewBox: `0 0 ${S} ${height}`, width: S, height, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, focusable: 'false'});
    svg.style.setProperty('--fig-units', String(round1(S / 12))); // styles/figure.css scales the drawing with the small type size
    svg.append(make('title', {id: `${prefix}-title`}, spec.title), make('desc', {id: `${prefix}-desc`}, text));

    const ringMap = new Map(spec.rings.map(ring => [ring.id, ring]));
    const place = marker => {
        if (marker.ring !== undefined) {
            const ring = ringMap.get(marker.ring), deg = -90 + marker.index * 360 / ring.count + ring.rotate;
            return {...polar(cx, cy, ring.radius * R, deg), deg};
        }
        if (marker.at === 'center') return {x: cx, y: cy, deg: 90};
        return {x: cx + marker.at[0] * R, y: cy + marker.at[1] * R, deg: 90};
    };
    const markers = [...spec.nodes, ...spec.slots].map(marker => ({marker, at: place(marker)}));
    const at = new Map(markers.map(entry => [entry.marker.id, entry.at]));

    // Rings first, so edges and markers sit on top.
    const rings = make('g', {class: 'fig-rings'});
    for (const ring of spec.rings) {
        const r = ring.radius * R, g = make('g', {class: `fig-ring${stateClass(ring.state)}`, 'data-ring': ring.id});
        g.append(make('title', {}, `${ring.label}${tag(ring.state)}`));
        if (ring.segments.length) {
            const step = 360 / ring.segments.length;
            ring.segments.forEach((segment, i) => {
                const mid = -90 + i * step + ring.rotate;
                const arcNode = make('path', {class: `fig-segment${stateClass(segment.state)}${fx(segment)}`, d: arc(cx, cy, r, mid - step / 2 + 2, mid + step / 2 - 2)});
                arcNode.append(make('title', {}, `${segment.label}${tag(segment.state)}`));
                g.append(arcNode);
                const outward = ring.labels === 'out', pos = polar(cx, cy, r + (outward ? 18 : -16), mid), a = anchorFor(mid, outward);
                const row = make('text', {class: `fig-segment-label${stateClass(segment.state)}`, x: round1(pos.x), y: round1(pos.y + a.dy * 5 + 4), 'text-anchor': a.anchor}, `${segment.state ? FIGURE_STATES[segment.state] + ' ' : ''}${segment.label}`);
                g.append(row);
            });
        } else if (ring.visible) {
            g.append(make('circle', {class: 'fig-ring-base', cx, cy, r}));
        }
        rings.append(g);
    }
    svg.append(rings);

    // Edges: kinds take a line pattern in order of first use; parallel edges between one pair fan out.
    const kinds = [...new Set(spec.edges.map(edge => edge.kind))];
    const kindClass = kind => `fig-edge--k${kinds.indexOf(kind) % EDGE_STYLES}`;
    const edgeLayer = make('g', {class: 'fig-edges'});
    const pairs = new Map();
    for (const edge of spec.edges) { const key = [edge.from, edge.to].sort().join('|'); pairs.set(key, [...(pairs.get(key) || []), edge]); }
    for (const group of pairs.values()) group.forEach((edge, i) => {
        const a = at.get(edge.from), b = at.get(edge.to), dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const t = .55 + (i - (group.length - 1) / 2) * .3, ux = dx / len, uy = dy / len, shift = (i - (group.length - 1) / 2) * 24, nx = -uy * shift, ny = ux * shift;
        const x1 = a.x + ux * MARKER_R + nx, y1 = a.y + uy * MARKER_R + ny, x2 = b.x - ux * MARKER_R + nx, y2 = b.y - uy * MARKER_R + ny;
        const g = make('g', {class: `fig-edge ${kindClass(edge.kind)}${stateClass(edge.state)}`, 'data-kind': edge.kind});
        g.append(make('title', {}, `${edge.kind}${edge.label ? `: ${edge.label}` : ''}${tag(edge.state)}`));
        g.append(make('line', {class: 'fig-edge-line', x1: round1(x1), y1: round1(y1), x2: round1(x2), y2: round1(y2)}));
        if (edge.label || edge.state) g.append(make('text', {class: 'fig-edge-label', x: round1(x1 + (x2 - x1) * t), y: round1(y1 + (y2 - y1) * t + 4), 'text-anchor': 'middle'}, `${edge.state ? FIGURE_STATES[edge.state] + ' ' : ''}${edge.label || edge.kind}`));
        edgeLayer.append(g);
    });
    svg.append(edgeLayer);

    // Markers: nodes and slots share one path; a slot only differs by class and label side.
    const markerLayer = make('g', {class: 'fig-markers'});
    for (const {marker, at: p} of markers) {
        const g = make('g', {class: `fig-marker fig-marker--${marker.kind}${stateClass(marker.state)}${fx(marker)}`, 'data-id': marker.id});
        g.append(make('title', {}, `${marker.label}${tag(marker.state)}`));
        g.append(make('circle', {class: 'fig-halo', cx: round1(p.x), cy: round1(p.y), r: MARKER_R + 6}));
        g.append(make('circle', {class: 'fig-body', cx: round1(p.x), cy: round1(p.y), r: MARKER_R}));
        g.append(make('text', {class: 'fig-glyph', x: round1(p.x), y: round1(p.y + 5), 'text-anchor': 'middle'}, marker.glyph || (marker.state ? FIGURE_STATES[marker.state] : '')));
        if (marker.glyph && marker.state) g.append(make('text', {class: 'fig-badge', x: round1(p.x + MARKER_R - 2), y: round1(p.y - MARKER_R + 4), 'text-anchor': 'middle'}, FIGURE_STATES[marker.state]));
        const rows = wrap(marker.label, marker.kind === 'slot' ? 9 : 14);
        const centred = marker.ring === undefined, outward = marker.kind !== 'slot', a = anchorFor(p.deg, outward);
        if (centred) lines(g, p.x, p.y + MARKER_R + 16, rows, {class: 'fig-label', 'text-anchor': 'middle'});
        else {
            const gap = MARKER_R + 8, top = a.dy === 0 ? p.y + 4 - (rows.length - 1) * 8 : a.dy > 0 ? p.y + gap + 8 : p.y - gap - (rows.length - 1) * 16;
            lines(g, p.x + a.dx * gap, a.dx !== 0 ? p.y + 4 - (rows.length - 1) * 8 : top, rows, {class: 'fig-label', 'text-anchor': a.anchor});
        }
        markerLayer.append(g);
    }
    svg.append(markerLayer);

    // Tracks: ordered steps along a line; the filled stretch runs to the last done or current step.
    // Horizontal tracks run left to right with labels below; vertical tracks climb from the bottom with labels beside.
    const pip = (parent, step, px, py) => {
        const s = make('g', {class: `fig-step${stateClass(step.state)}${fx(step)}`});
        s.append(make('title', {}, `${step.label}${stepTag(step)}`));
        s.append(make('circle', {class: 'fig-halo', cx: round1(px), cy: round1(py), r: PIP_R + 5}), make('circle', {class: 'fig-body', cx: round1(px), cy: round1(py), r: PIP_R}));
        if (step.fill > 0) s.append(step.fill >= 1 ? make('circle', {class: 'fig-fill', cx: round1(px), cy: round1(py), r: PIP_R + 5})
            : make('path', {class: 'fig-fill', d: arc(px, py, PIP_R + 5, -90, -90 + 360 * step.fill)}));
        s.append(make('text', {class: 'fig-glyph', x: round1(px), y: round1(py + 5), 'text-anchor': 'middle'}, step.state ? FIGURE_STATES[step.state] : ''));
        parent.append(s); return s;
    };
    let trackY = radialH;
    spec.tracks.forEach(track => {
        const y = trackY, n = track.steps.length, x0 = PAD, x1 = S - PAD;
        trackY += trackHeight(track, S);
        const g = make('g', {class: `fig-track${track.orient === 'vertical' ? ' fig-track--vertical' : ''}`, 'data-track': track.id});
        g.append(make('text', {class: 'fig-track-title', x: x0 - PAD / 2, y: y + 14}, `${track.label || track.id}: ${stepProgress(track)}`));
        const last = track.steps.reduce((acc, step, i) => step.state === 'done' || step.state === 'current' ? i : acc, -1);
        if (track.orient === 'vertical') {
            const px = x0, rungY = i => y + RUNG_TOP + (n - 1 - i) * RUNG_H + RUNG_H / 2;
            g.append(make('line', {class: 'fig-track-line', x1: px, y1: rungY(n - 1), x2: px, y2: rungY(0)}));
            if (last > 0) g.append(make('line', {class: 'fig-track-progress', x1: px, y1: rungY(0), x2: px, y2: rungY(last)}));
            track.steps.forEach((step, i) => {
                const s = pip(g, step, px, rungY(i)), rows = wrap(step.label, Math.floor((x1 - px) / 9));
                lines(s, px + PIP_R + 16, rungY(i) + (step.note ? -4 : 5) - (rows.length - 1) * 8, rows, {class: 'fig-label', 'text-anchor': 'start'});
                if (step.note) s.append(make('text', {class: 'fig-step-note', x: px + PIP_R + 16, y: round1(rungY(i) + 12 + (rows.length - 1) * 8)}, step.note));
            });
        } else {
            const gap = n > 1 ? (x1 - x0) / (n - 1) : 0, rowY = y + 38;
            g.append(make('line', {class: 'fig-track-line', x1: x0, y1: rowY, x2: x1, y2: rowY}));
            if (last > 0) g.append(make('line', {class: 'fig-track-progress', x1: x0, y1: rowY, x2: x0 + gap * last, y2: rowY}));
            track.steps.forEach((step, i) => {
                const px = n > 1 ? x0 + gap * i : (x0 + x1) / 2;
                const edge = n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'; // end labels turn inward so they never clip
                lines(pip(g, step, px, rowY), px + (edge === 'start' ? -PIP_R : edge === 'end' ? PIP_R : 0), rowY + PIP_R + 16, wrap(stepWords(step), wrapChars(track, S, i)), {class: 'fig-label', 'text-anchor': edge});
            });
        }
        svg.append(g);
    });

    // Notes: plain-words lines (a risk line, a caveat) with their state mark.
    let noteY = radialH + tracksH + NOTE_H;
    for (const note of spec.notes) {
        const rows = wrap(`${note.state ? FIGURE_STATES[note.state] + ' ' : ''}${note.text}`, noteWidth);
        const g = make('g', {class: `fig-note${stateClass(note.state)}`});
        rows.forEach((row, i) => g.append(make('text', {class: 'fig-note-text', x: PAD / 2, y: noteY + i * NOTE_H}, row)));
        noteY += rows.length * NOTE_H;
        svg.append(g);
    }

    const children = [svg];
    if (options.legend !== false) {
        const entries = spec.legend.length ? spec.legend : [
            ...[...new Set([...spec.nodes, ...spec.slots, ...spec.rings, ...spec.tracks.flatMap(track => track.steps), ...spec.rings.flatMap(ring => ring.segments)].map(item => item.state).filter(Boolean))].map(state => ({state, label: word(state)})),
            ...kinds.map(kind => ({kind, label: word(kind)})),
        ];
        if (entries.length) {
            const legend = doc.createElement('ul'); legend.className = 'fig-legend';
            for (const entry of entries) {
                const item = doc.createElement('li'); item.className = 'fig-legend-item';
                if (entry.state) {
                    const mark = doc.createElement('span'); mark.className = `fig-legend-mark fig-state--${entry.state}`; mark.textContent = FIGURE_STATES[entry.state];
                    item.append(mark);
                } else {
                    const swatch = make('svg', {class: `fig-legend-swatch fig-edge ${kindClass(entry.kind)}`, viewBox: '0 0 32 8', width: 32, height: 8, 'aria-hidden': 'true', focusable: 'false'});
                    swatch.append(make('line', {class: 'fig-edge-line', x1: 0, y1: 4, x2: 32, y2: 4}));
                    item.append(swatch);
                }
                item.append(doc.createTextNode(entry.label));
                legend.append(item);
            }
            children.push(legend);
        }
    }
    if (options.text) { const pre = doc.createElement('pre'); pre.className = 'fig-text'; pre.textContent = text; children.push(pre); }
    node.classList.add('fig');
    node.dataset.figure = spec.id;
    node.replaceChildren(...children);
    return {svg, text};
}
