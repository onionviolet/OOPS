// MDL2 figure primitive. One declarative spec becomes inline SVG; rituals, relationship webs,
// meridians, maps, timelines and boards are data for it, never kind-specific drawing code.
// Spec: {id, title, summary?, size?, rings[], nodes[], slots[], tracks[], edges[], notes[], legend[]}
// Non-node forms (table, card, band, chips, bars) are specified in the forms section at the end of this file and share this spec.
//   ring   {id, label, radius 0..1, segments:[{label,state,effect}] | slots:N | count:N, labels:'out'|'in', rotate, visible, state}
//   node   {id, label, glyph, state, effect, at:'center'|[x,y] | ring + index}      (x, y in -1..1 of the figure radius)
//   slot   {id, label, ring, index, state, effect}      a node on a ring that is drawn as a place to fill
//   track  {id, label, progress, orient:'horizontal'|'vertical', steps:[{label,state,effect,fill,ghost,note}]}
//          progress is counted from the steps' states unless progress (words) is given; a vertical track runs bottom (first step) to top (a ladder).
//          fill 0..1 draws a partial ring round the pip (digestion, mastery); note is its words, and the text form
//          reads the note, or the fill as a percentage when there is no note, so the drawing never holds a fact alone.
//          ghost 0..1 (at least fill) draws a dashed arc past the fill: what a planned act would add, said in the note.
//   edge   {from, to, kind, label, state, detail?}       kinds take distinct line patterns in order of first use;
//                                                        detail is plain words for the text form and hover only
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
            if (step.ghost !== undefined && !(Number.isFinite(step.ghost) && step.ghost >= (step.fill ?? 0) && step.ghost <= 1)) fail(`${where} ghost must be a number from its fill to 1`);
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
    validateForms(input, spec, fail, checkState);
    return spec;
}

const stepProgress = track => track.progress || `${track.steps.filter(step => step.state === 'done').length} of ${track.steps.length} done`;
const tag = state => state ? ` (${state})` : '';
const stepTag = step => {
    const parts = [step.state, step.note || [step.fill !== undefined ? `${Math.round(step.fill * 100)}% filled` : null, step.ghost !== undefined ? `${Math.round(step.ghost * 100)}% after the planned act` : null].filter(Boolean).join(', ') || undefined].filter(Boolean);
    return parts.length ? ` (${parts.join('; ')})` : '';
};
// Horizontal labels wrap to the space between steps (end labels turn inward, so they get half of it);
// the track grows to fit its tallest label.
const stepWords = step => step.note ? `${step.label} · ${step.note}` : step.label;
const wrapChars = (track, size, i) => {
    const n = track.steps.length, gap = n > 1 ? (size - 2 * PAD) / (n - 1) : size - 2 * PAD, edge = n > 1 && (i === 0 || i === n - 1);
    return Math.max(6, Math.floor(gap * (edge ? .5 : .9) / 9));
};
// Vertical rungs: the label wraps beside the pip and the note wraps under it; a rung grows past RUNG_H to fit both.
const rungRows = (step, size) => {
    const chars = Math.floor((size - 2 * PAD - PIP_R - 16) / 9);
    return {label: wrap(step.label, chars), note: step.note ? wrap(step.note, chars) : []};
};
const rungHeights = (track, size) => track.steps.map(step => { const r = rungRows(step, size); return Math.max(RUNG_H, (r.label.length + r.note.length) * 16 + 32); });
const trackHeight = (track, size) => track.orient === 'vertical' ? RUNG_TOP + rungHeights(track, size).reduce((a, b) => a + b, 0)
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
    lines.push(...formsText(spec));
    for (const edge of spec.edges) lines.push(`${name.get(edge.from)} to ${name.get(edge.to)}: ${edge.kind}${edge.label ? `, ${edge.label}` : ''}${tag(edge.state)}.${edge.detail ? ` ${edge.detail}` : ''}`);
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

// Edge labels: greedy, deterministic placement from estimated boxes (no layout reads). Each label tries points
// along its own edge, then a small sideways shift, and takes the first that clears every marker and every label
// already placed; when none is clear it takes the least overlapped one. Draw order decides who yields. Widths
// assume the widest shipped face (Luminous bitmap, about 8.4 units a character), so narrower themes only gain room.
const LABEL_CHAR_W = 8.5, LABEL_H = 16, LABEL_TS = [0, -.1, .1, -.2, .2, -.3, .3, -.4], LABEL_SIDE = [0, 13, -13, 26, -26, 40, -40];
function edgeLabelPlacer(markerPoints, fixedBoxes = []) {
    const boxes = [...fixedBoxes], pad = MARKER_R + 4;
    const overlap = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
    const cost = box => markerPoints.reduce((sum, m) => sum + overlap(box, {x0: m.x - pad, x1: m.x + pad, y0: m.y - pad, y1: m.y + pad}), 0) +
        boxes.reduce((sum, other) => sum + overlap(box, other), 0);
    return ({x1, y1, x2, y2, t, words}) => {
        const w = words.length * LABEL_CHAR_W + 6, len = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
        const at = (dt, side) => { const s = Math.min(.85, Math.max(.15, t + dt)); return {x: x1 + (x2 - x1) * s + nx * side, y: y1 + (y2 - y1) * s + ny * side}; };
        const box = p => ({x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y - LABEL_H / 2, y1: p.y + LABEL_H / 2});
        // First clear candidate in preference order; otherwise the least overlapped one.
        let best = null;
        search: for (const side of LABEL_SIDE) for (const dt of LABEL_TS) {
            const p = at(dt, side), c = cost(box(p));
            if (!best || c < best.c) best = {p, c};
            if (c === 0) break search;
        }
        boxes.push(box(best.p));
        return best.p;
    };
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
    const formsH = formsHeight(spec, S, wrap);
    const height = radialH + tracksH + formsH + spec.notes.reduce((sum, note) => sum + wrap(note.text, noteWidth).length * NOTE_H, 0) + (spec.notes.length ? NOTE_H : 0);
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
    // Loose markers put their label under themselves, often where spokes meet; keep edge labels off it.
    const looseLabels = markers.filter(({marker}) => marker.ring === undefined).map(({marker, at: p}) => {
        const w = Math.max(...wrap(marker.label, 14).map(row => row.length)) * LABEL_CHAR_W + 6, rows = wrap(marker.label, 14).length;
        return {x0: p.x - w / 2, x1: p.x + w / 2, y0: p.y + MARKER_R + 4, y1: p.y + MARKER_R + 6 + rows * LABEL_H};
    });
    const placeLabel = edgeLabelPlacer(markers.map(entry => entry.at), looseLabels);
    for (const group of pairs.values()) group.forEach((edge, i) => {
        const a = at.get(edge.from), b = at.get(edge.to), dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
        const t = .55 + (i - (group.length - 1) / 2) * .3, ux = dx / len, uy = dy / len, shift = (i - (group.length - 1) / 2) * 24, nx = -uy * shift, ny = ux * shift;
        const x1 = a.x + ux * MARKER_R + nx, y1 = a.y + uy * MARKER_R + ny, x2 = b.x - ux * MARKER_R + nx, y2 = b.y - uy * MARKER_R + ny;
        const g = make('g', {class: `fig-edge ${kindClass(edge.kind)}${stateClass(edge.state)}`, 'data-kind': edge.kind, 'data-from': edge.from, 'data-to': edge.to});
        g.append(make('title', {}, `${edge.kind}${edge.label ? `: ${edge.label}` : ''}${tag(edge.state)}${edge.detail ? `. ${edge.detail}` : ''}`));
        g.append(make('line', {class: 'fig-edge-line', x1: round1(x1), y1: round1(y1), x2: round1(x2), y2: round1(y2)}));
        if (edge.label || edge.state) {
            const words = `${edge.state ? FIGURE_STATES[edge.state] + ' ' : ''}${edge.label || edge.kind}`, p = placeLabel({x1, y1, x2, y2, t, words});
            g.append(make('text', {class: 'fig-edge-label', x: round1(p.x), y: round1(p.y + 4), 'text-anchor': 'middle'}, words));
        }
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
        const centred = marker.ring === undefined, outward = marker.kind !== 'slot', a = anchorFor(p.deg, outward);
        // A label beside its marker wraps to the room left before the figure's edge, so wide faces never clip.
        const room = a.dx > 0 ? S - (p.x + MARKER_R + 8) : a.dx < 0 ? p.x - MARKER_R - 8 : Infinity;
        const rows = wrap(marker.label, Math.max(5, Math.min(marker.kind === 'slot' ? 9 : 14, Math.floor(room / LABEL_CHAR_W))));
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
        const from = step.fill ?? 0;
        if (step.ghost > from) s.append(make('path', {class: 'fig-ghost', d: arc(px, py, PIP_R + 5, -90 + 360 * from, -90 + 360 * Math.min(step.ghost, .9999))}));
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
            // Rungs stack from the top in reverse order (first step lowest); each is centred in its own height.
            const heights = rungHeights(track, S), tops = [];
            for (let i = n - 1, top = y + RUNG_TOP; i >= 0; top += heights[i], i--) tops[i] = top;
            const px = x0, rungY = i => tops[i] + heights[i] / 2;
            g.append(make('line', {class: 'fig-track-line', x1: px, y1: rungY(n - 1), x2: px, y2: rungY(0)}));
            if (last > 0) g.append(make('line', {class: 'fig-track-progress', x1: px, y1: rungY(0), x2: px, y2: rungY(last)}));
            track.steps.forEach((step, i) => {
                const s = pip(g, step, px, rungY(i)), {label: rows, note} = rungRows(step, S), top = rungY(i) + 5 - (rows.length + note.length - 1) * 8;
                lines(s, px + PIP_R + 16, top, rows, {class: 'fig-label', 'text-anchor': 'start'});
                if (note.length) lines(s, px + PIP_R + 16, top + rows.length * 16, note, {class: 'fig-step-note', 'text-anchor': 'start'});
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
    drawForms(svg, spec, radialH + tracksH, {make, lines, wrap, states: FIGURE_STATES, stateClass, fx, S});
    let noteY = radialH + tracksH + formsH + NOTE_H;
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
            ...[...new Set([...spec.nodes, ...spec.slots, ...spec.rings, ...spec.tracks.flatMap(track => track.steps), ...spec.rings.flatMap(ring => ring.segments), ...formStates(spec).map(state => ({state}))].map(item => item.state).filter(Boolean))].map(state => ({state, label: word(state)})),
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

// ---- Non-node forms of the shared figure grammar (COV4, UR79). Graph layouts live in figure_graph.js, not here. A figure spec may carry, besides rings, nodes and tracks:
//   tables [{id, label, columns:[{id?, label, weight?}], rows:[{id?, cells:[words], state?, bar?, barNote?}], barLabel?}]
//          a ledger: one row per account, a word per cell; bar 0..1 draws the share left beside the words (barNote says it).
//   cards  [{id, label, summary?, state?, groups:[{id?, label, state?, rows:[{label, text}]}]}]
//          a threshold card: a titled sheet of grouped facts (what crosses, what stays, what waits).
//   bands  [{id, label, axis:{from, to, ticks?:[{at, label}], mark?:{at, label}}, lanes?:[label], spans:[{from, to, label, lane?, state?, level?, note?}]}]
//          a time or intensity band along an axis; level 0..1 darkens the span and note says it in words.
//   chips  [{id, label, items:[{label, state?, note?}]}]   a row of small tags, wrapping
//   bars   [{id, label, rows:[{label, value, max, words, state?}]}]   one bar per row, the words always beside it
// Every fact is also in formsText(), so the drawing never holds a fact alone (UR37). Only rects, lines and text are drawn.
const FORM_KEYS = ['tables', 'cards', 'bands', 'chips', 'bars'];
const CW = 8.5, LINE = 16, X0 = 28, TITLE_H = 24, GAP = 14;
const isWords = v => typeof v === 'string' && v.length > 0;
const pct = v => `${Math.round(v * 100)}%`;
const tagOf = state => state ? ` (${state})` : '';
const round = n => Math.round(n * 10) / 10;

function validateForms(input, spec, fail, checkState) {
    const ids = new Set();
    for (const key of FORM_KEYS) {
        spec[key] = input[key] === undefined ? [] : input[key];
        if (!Array.isArray(spec[key])) fail(`${key} must be an array`);
        const kind = key.slice(0, -1);
        for (const item of spec[key]) {
            if (!item || !isWords(item.id)) fail(`every ${kind} needs an id`);
            if (ids.has(item.id)) fail(`duplicate ${kind} id "${item.id}"`);
            ids.add(item.id);
            if (!isWords(item.label)) fail(`${kind} "${item.id}" needs a label`);
            checkState(item.state, `${kind} "${item.id}"`);
        }
    }
    for (const t of spec.tables) {
        if (!Array.isArray(t.columns) || !t.columns.length || t.columns.some(c => !c || !isWords(c.label))) fail(`table "${t.id}" needs labelled columns`);
        if (!Array.isArray(t.rows) || !t.rows.length) fail(`table "${t.id}" needs rows`);
        t.rows.forEach((r, i) => {
            if (!r || !Array.isArray(r.cells) || r.cells.length !== t.columns.length || r.cells.some(c => typeof c !== 'string')) fail(`table "${t.id}" row ${i + 1} needs one word per column`);
            checkState(r.state, `table "${t.id}" row ${i + 1}`);
            if (r.bar !== undefined && !(Number.isFinite(r.bar) && r.bar >= 0 && r.bar <= 1)) fail(`table "${t.id}" row ${i + 1} bar must be 0 to 1`);
            if (r.bar !== undefined && !isWords(r.barNote)) fail(`table "${t.id}" row ${i + 1} bar needs a barNote in words`);
        });
    }
    for (const c of spec.cards) {
        if (!Array.isArray(c.groups) || !c.groups.length) fail(`card "${c.id}" needs groups`);
        for (const g of c.groups) {
            if (!g || !isWords(g.label) || !Array.isArray(g.rows) || !g.rows.length) fail(`card "${c.id}" groups need a label and rows`);
            checkState(g.state, `card "${c.id}" group "${g.label}"`);
            if (g.rows.some(r => !r || !isWords(r.label) || !isWords(r.text))) fail(`card "${c.id}" rows need a label and text`);
        }
    }
    for (const b of spec.bands) {
        const a = b.axis;
        if (!a || !Number.isFinite(a.from) || !Number.isFinite(a.to) || !(a.to > a.from)) fail(`band "${b.id}" needs an axis from below to`);
        for (const t of [...(a.ticks || []), ...(a.mark ? [a.mark] : [])]) if (!Number.isFinite(t.at) || t.at < a.from || t.at > a.to || !isWords(t.label)) fail(`band "${b.id}" ticks need an at within the axis and a label`);
        if (!Array.isArray(b.spans) || !b.spans.length) fail(`band "${b.id}" needs spans`);
        const lanes = b.lanes || [];
        for (const s of b.spans) {
            if (!s || !isWords(s.label) || !Number.isFinite(s.from) || !Number.isFinite(s.to) || s.from < a.from || s.to > a.to || !(s.to > s.from)) fail(`band "${b.id}" span "${s && s.label}" must lie within the axis`);
            if (s.lane !== undefined && !(Number.isInteger(s.lane) && s.lane >= 0 && s.lane < Math.max(1, lanes.length))) fail(`band "${b.id}" span "${s.label}" uses an unknown lane`);
            if (s.level !== undefined && !(Number.isFinite(s.level) && s.level >= 0 && s.level <= 1)) fail(`band "${b.id}" span "${s.label}" level must be 0 to 1`);
            if (s.level !== undefined && !isWords(s.note)) fail(`band "${b.id}" span "${s.label}" level needs a note in words`);
            checkState(s.state, `band "${b.id}" span "${s.label}"`);
        }
    }
    for (const c of spec.chips) {
        if (!Array.isArray(c.items) || !c.items.length || c.items.some(i => !i || !isWords(i.label))) fail(`chips "${c.id}" need labelled items`);
        c.items.forEach(i => checkState(i.state, `chips "${c.id}" item "${i.label}"`));
    }
    for (const b of spec.bars) {
        if (!Array.isArray(b.rows) || !b.rows.length) fail(`bars "${b.id}" need rows`);
        for (const r of b.rows) {
            if (!r || !isWords(r.label) || !isWords(r.words) || !Number.isFinite(r.value) || !(r.max > 0) || r.value < 0 || r.value > r.max) fail(`bars "${b.id}" rows need a label, words and a value within 0 and max`);
            checkState(r.state, `bars "${b.id}" row "${r.label}"`);
        }
    }
}

function formsText(spec) {
    const lines = [];
    for (const t of spec.tables) {
        lines.push(`Table ${t.label}: ${t.columns.map(c => c.label).join(' | ')}.`);
        t.rows.forEach((r, i) => lines.push(`${i + 1}. ${r.cells.join(' | ')}${r.bar !== undefined ? ` | ${r.barNote} (${pct(r.bar)} left)` : ''}${tagOf(r.state)}`));
    }
    for (const c of spec.cards) {
        lines.push(`Card ${c.label}${tagOf(c.state)}.${c.summary ? ` ${c.summary}` : ''}`);
        for (const g of c.groups) lines.push(`${g.label}${tagOf(g.state)}:`, ...g.rows.map(r => `- ${r.label}. ${r.text}`));
    }
    for (const b of spec.bands) {
        const a = b.axis, lanes = b.lanes || [];
        lines.push(`Band ${b.label}, from ${a.from} to ${a.to}${a.mark ? `, ${a.mark.label} at ${a.mark.at}` : ''}: ${b.spans.map(s => {
            const extra = [s.state, s.note].filter(Boolean).join('; ');
            return `${s.label} ${s.from}-${s.to}${lanes.length ? ` on ${lanes[s.lane || 0]}` : ''}${extra ? ` (${extra})` : ''}`;
        }).join('; ')}.`);
    }
    for (const c of spec.chips) lines.push(`Chips ${c.label}: ${c.items.map(i => { const extra = [i.state, i.note].filter(Boolean).join('; '); return `${i.label}${extra ? ` (${extra})` : ''}`; }).join('; ')}.`);
    for (const b of spec.bars) lines.push(`Bars ${b.label}: ${b.rows.map(r => `${r.label}, ${r.words} (${r.value} of ${r.max}${r.state ? `; ${r.state}` : ''})`).join('; ')}.`);
    return lines;
}

const formStates = spec => [
    ...spec.tables.flatMap(t => t.rows), ...spec.cards.flatMap(c => [c, ...c.groups]), ...spec.bands.flatMap(b => b.spans),
    ...spec.chips.flatMap(c => c.items), ...spec.bars.flatMap(b => b.rows),
].map(item => item.state);

// ---- layout ----
const inner = S => S - X0 * 2;
const nrows = (text, chars, wrap) => wrap(text, Math.max(4, Math.floor(chars))).length;
function tableCols(t, S) {
    const hasBar = t.rows.some(r => r.bar !== undefined), barW = hasBar ? 110 : 0, total = inner(S) - barW;
    const weights = t.columns.map(c => c.weight || 1), sum = weights.reduce((a, b) => a + b, 0);
    let x = X0;
    const cols = t.columns.map((c, i) => { const w = total * weights[i] / sum, col = {x, w}; x += w; return col; });
    return {cols, hasBar, bar: {x, w: barW}};
}
const tableRowH = (t, r, S, wrap) => {
    const {cols, hasBar} = tableCols(t, S);
    return Math.max(30, 14 + LINE * Math.max(...r.cells.map((c, i) => nrows(c, (cols[i].w - 16) / CW, wrap)), hasBar && r.bar !== undefined ? nrows(r.barNote, 12, wrap) + 1 : 1));
};
const cardRowH = (r, S, wrap) => Math.max(24, 8 + LINE * Math.max(nrows(r.label, 17, wrap), nrows(r.text, (inner(S) - 40 - 150) / CW, wrap)));
const cardSummaryRows = (c, S, wrap) => c.summary ? wrap(c.summary, Math.floor((inner(S) - 32) / CW)) : [];
const bandLanes = b => Math.max(1, (b.lanes || []).length);
// A note rides on the chip only while it is short; a longer one stays in the hover title and the text form.
const chipNote = i => i.note && i.label.length + i.note.length <= 36 ? ` · ${i.note}` : '';
const chipText = i => (i.state ? '? ' : '') + i.label + chipNote(i);
const chipWidth = i => Math.ceil(chipText(i).length * CW) + 22;
function chipRows(c, S) {
    const out = [[]]; let x = 0;
    for (const item of c.items) { const w = chipWidth(item); if (x && x + w > inner(S)) { out.push([]); x = 0; } out[out.length - 1].push({item, x, w}); x += w + 8; }
    return out;
}
const barRowH = (r, S, wrap) => Math.max(26, 10 + LINE * Math.max(nrows(r.label, 142 / CW, wrap), nrows(r.words, 178 / CW, wrap)));

function formHeight(kind, item, S, wrap) {
    if (kind === 'tables') return TITLE_H + 28 + item.rows.reduce((s, r) => s + tableRowH(item, r, S, wrap), 0) + GAP;
    if (kind === 'cards') return 4 + TITLE_H + 6 + cardSummaryRows(item, S, wrap).length * LINE + item.groups.reduce((s, g) => s + 26 + g.rows.reduce((t, r) => t + cardRowH(r, S, wrap), 0), 0) + 8 + GAP;
    if (kind === 'bands') return TITLE_H + 6 + bandLanes(item) * 34 + 34 + GAP;
    if (kind === 'chips') return TITLE_H + chipRows(item, S).length * 32 + GAP;
    return TITLE_H + item.rows.reduce((s, r) => s + barRowH(r, S, wrap), 0) + GAP;
}
const formsHeight = (spec, S, wrap) => FORM_KEYS.reduce((sum, key) => sum + spec[key].reduce((s, item) => s + formHeight(key, item, S, wrap), 0), 0);

// ---- drawing ----
/** Draws every form from y downward into svg; ctx = {make, lines, wrap, states, stateClass, fx, S}. Returns the y below the last. */
function drawForms(svg, spec, y, ctx) {
    const {make, lines, wrap, states, stateClass, fx, S} = ctx, W = inner(S);
    const mark = state => state ? `${states[state]} ` : '';
    const title = (g, label, yy) => g.append(make('text', {class: 'fig-track-title', x: X0, y: yy + 14}, label));
    const rect = (g, cls, x, yy, w, h, extra = {}) => g.append(make('rect', {class: cls, x: round(x), y: round(yy), width: round(Math.max(0, w)), height: round(h), ...extra}));
    for (const t of spec.tables) {
        const g = make('g', {class: 'fig-table', 'data-table': t.id}), {cols, hasBar, bar} = tableCols(t, S);
        title(g, t.label, y); let yy = y + TITLE_H;
        rect(g, 'fig-cell fig-cell--head', X0, yy, W, 28);
        t.columns.forEach((c, i) => g.append(make('text', {class: 'fig-cell-head', x: round(cols[i].x + 8), y: yy + 18}, c.label)));
        if (hasBar) g.append(make('text', {class: 'fig-cell-head', x: round(bar.x + 8), y: yy + 18}, t.barLabel || ''));
        yy += 28;
        t.rows.forEach(r => {
            const h = tableRowH(t, r, S, wrap), rg = make('g', {class: `fig-row${stateClass(r.state)}${fx(r)}`, 'data-row': r.id});
            rg.append(make('title', {}, `${r.cells.join(', ')}${tagOf(r.state)}`));
            rect(rg, 'fig-cell fig-body', X0, yy, W, h);
            r.cells.forEach((c, i) => lines(rg, cols[i].x + 8, yy + 20, wrap(i === 0 ? mark(r.state) + c : c, Math.max(4, Math.floor((cols[i].w - 16) / CW))), {class: i === 0 ? 'fig-label' : 'fig-cell-text'}));
            if (r.bar !== undefined) {
                rect(rg, 'fig-bar-track', bar.x + 8, yy + 8, bar.w - 16, 8);
                rect(rg, 'fig-bar-fill', bar.x + 8, yy + 8, (bar.w - 16) * r.bar, 8);
                lines(rg, bar.x + 8, yy + 32, wrap(r.barNote, 12), {class: 'fig-step-note'});
            }
            g.append(rg); yy += h;
        });
        svg.append(g); y += formHeight('tables', t, S, wrap);
    }
    for (const c of spec.cards) {
        const g = make('g', {class: `fig-card${stateClass(c.state)}`, 'data-card': c.id}), h = formHeight('cards', c, S, wrap) - GAP;
        rect(g, 'fig-body fig-card-sheet', X0, y + 4, W, h - 4);
        g.append(make('text', {class: 'fig-card-title', x: X0 + 16, y: y + 4 + 22}, mark(c.state) + c.label));
        let yy = y + 4 + TITLE_H + 2;
        const sum = cardSummaryRows(c, S, wrap); if (sum.length) { lines(g, X0 + 16, yy + 10, sum, {class: 'fig-step-note'}); yy += sum.length * LINE; }
        for (const grp of c.groups) {
            const gg = make('g', {class: `fig-card-group${stateClass(grp.state)}`, 'data-group': grp.id || grp.label});
            rect(gg, 'fig-cell fig-cell--head', X0 + 8, yy + 4, W - 16, 22);
            gg.append(make('text', {class: 'fig-cell-head', x: X0 + 16, y: yy + 19}, mark(grp.state) + grp.label));
            yy += 26;
            for (const r of grp.rows) {
                lines(gg, X0 + 16, yy + 18, wrap(r.label, 17), {class: 'fig-label'});
                lines(gg, X0 + 16 + 150, yy + 18, wrap(r.text, Math.floor((W - 40 - 150) / CW)), {class: 'fig-cell-text'});
                yy += cardRowH(r, S, wrap);
            }
            g.append(gg);
        }
        svg.append(g); y += h + GAP;
    }
    for (const b of spec.bands) {
        const g = make('g', {class: 'fig-band', 'data-band': b.id}), a = b.axis, labelW = (b.lanes || []).length ? 96 : 0, ax0 = X0 + labelW, ax1 = X0 + W;
        const at = v => ax0 + (ax1 - ax0) * (v - a.from) / (a.to - a.from);
        title(g, b.label, y); const top = y + TITLE_H + 6, n = bandLanes(b);
        (b.lanes || []).forEach((l, i) => g.append(make('text', {class: 'fig-step-note', x: X0, y: top + i * 34 + 19}, l)));
        for (let i = 0; i < n; i++) rect(g, 'fig-band-lane', ax0, top + i * 34, ax1 - ax0, 28);
        for (const s of b.spans) {
            const lane = s.lane || 0, sx = at(s.from), sw = at(s.to) - sx, sy = top + lane * 34, sg = make('g', {class: `fig-span${stateClass(s.state)}${fx(s)}`});
            sg.append(make('title', {}, `${s.label} ${s.from}-${s.to}${tagOf(s.state)}${s.note ? `. ${s.note}` : ''}`));
            rect(sg, 'fig-body fig-span-rect', sx, sy + 2, sw, 24, s.level !== undefined ? {'fill-opacity': round(.35 + .65 * s.level)} : {});
            // Inside the span when it fits; just after it when the lane is free there; otherwise cut to fit (the full words stay in the hover title and the text form).
            const full = mark(s.state) + s.label, room = Math.floor((sw - 10) / CW), fits = full.length <= room;
            const nextStart = Math.min(ax1, ...b.spans.filter(o => (o.lane || 0) === lane && o !== s && o.from >= s.to).map(o => at(o.from)));
            const after = !fits && sx + sw + 6 + full.length * CW <= nextStart;
            const words = fits || after ? full : room >= 3 ? `${full.slice(0, room - 1)}…` : '';
            if (words) sg.append(make('text', {class: 'fig-label', x: round(after ? sx + sw + 6 : sx + 6), y: sy + 19, 'text-anchor': 'start'}, words));
            g.append(sg);
        }
        const axisY = top + n * 34 - 2;
        g.append(make('line', {class: 'fig-track-line', x1: ax0, y1: axisY, x2: ax1, y2: axisY}));
        for (const t of a.ticks || []) g.append(make('line', {class: 'fig-track-line', x1: round(at(t.at)), y1: axisY, x2: round(at(t.at)), y2: axisY + 5}), make('text', {class: 'fig-step-note', x: round(at(t.at)), y: axisY + 19, 'text-anchor': 'middle'}, t.label));
        if (a.mark) { const mx = round(at(a.mark.at)); g.append(make('line', {class: 'fig-track-progress', x1: mx, y1: top - 4, x2: mx, y2: axisY + 5}), make('text', {class: 'fig-label', x: mx, y: top - 6, 'text-anchor': 'middle'}, a.mark.label)); }
        svg.append(g); y += formHeight('bands', b, S, wrap);
    }
    for (const c of spec.chips) {
        const g = make('g', {class: 'fig-chips', 'data-chips': c.id});
        title(g, c.label, y);
        chipRows(c, S).forEach((row, ri) => row.forEach(({item, x, w}) => {
            const cg = make('g', {class: `fig-chip${stateClass(item.state)}`}), cy = y + TITLE_H + ri * 32;
            cg.append(make('title', {}, `${item.label}${tagOf(item.state)}${item.note ? `. ${item.note}` : ''}`));
            rect(cg, 'fig-body', X0 + x, cy, w, 24);
            cg.append(make('text', {class: 'fig-label', x: round(X0 + x + 11), y: cy + 16}, mark(item.state) + item.label + chipNote(item)));
            g.append(cg);
        }));
        svg.append(g); y += formHeight('chips', c, S, wrap);
    }
    for (const b of spec.bars) {
        const g = make('g', {class: 'fig-bars', 'data-bars': b.id}), tx = X0 + 150, tw = W - 150 - 190;
        title(g, b.label, y); let yy = y + TITLE_H;
        for (const r of b.rows) {
            const h = barRowH(r, S, wrap), rg = make('g', {class: `fig-barrow${stateClass(r.state)}`});
            rg.append(make('title', {}, `${r.label}: ${r.words}${tagOf(r.state)}`));
            lines(rg, X0, yy + 17, wrap(r.label, Math.floor(142 / CW)), {class: 'fig-label'});
            rect(rg, 'fig-bar-track', tx, yy + 8, tw, 10);
            rect(rg, 'fig-bar-fill', tx, yy + 8, tw * r.value / r.max, 10);
            lines(rg, tx + tw + 12, yy + 17, wrap(mark(r.state) + r.words, Math.floor(178 / CW)), {class: 'fig-cell-text'});
            g.append(rg); yy += h;
        }
        svg.append(g); y += formHeight('bars', b, S, wrap);
    }
    return y;
}
