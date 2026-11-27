const SVG = 'http://www.w3.org/2000/svg';

export function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = text;
    if (className) node.className = className;
    return node;
}

function control(label, action, accessibleLabel = label) {
    const node = element('button', label);
    node.type = 'button';
    node.setAttribute('aria-label', accessibleLabel);
    node.addEventListener('click', action);
    return node;
}

function shape(tag, attributes) {
    const node = document.createElementNS(SVG, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
}

function marker({symbol, icon, label, key}) {
    const dot = element('span', icon || symbol, 'canvas-dot');
    if (icon) dot.classList.add('material-icons');
    dot.dataset.mark = key;
    dot.title = label;
    dot.setAttribute('aria-hidden', 'true');
    return dot;
}

function port(box, toward, inset = 0) {
    const dx = toward.x - box.x, dy = toward.y - box.y;
    const t = 1 / Math.max(Math.abs(dx) / (box.w / 2 + inset), Math.abs(dy) / (box.h / 2 + inset));
    return {x: box.x + dx * t, y: box.y + dy * t};
}

function hits(a, b, box) {
    // Clip the segment against the padded box on each axis.
    let enter = 0, exit = 1;
    for (const [axis, dim] of [['x', 'w'], ['y', 'h']]) {
        const low = box[axis] - box[dim] / 2 - 4, high = box[axis] + box[dim] / 2 + 4;
        const d = b[axis] - a[axis];
        if (!d) {
            if (a[axis] < low || a[axis] > high) return false;
            continue;
        }
        const first = (low - a[axis]) / d, last = (high - a[axis]) / d;
        enter = Math.max(enter, Math.min(first, last));
        exit = Math.min(exit, Math.max(first, last));
    }
    return enter <= exit;
}

function route(from, to, nodes, corridor) {
    const obstacles = nodes.filter(box => box !== from && box !== to);
    const candidates = corridor == null ? [[], [{x: from.x, y: to.y}], [{x: to.x, y: from.y}]] :
        [[{x: from.x, y: corridor}, {x: to.x, y: corridor}]];
    const midX = (from.x + to.x) / 2, midY = (from.y + to.y) / 2;
    for (const offset of corridor == null ? [0, -18, 18, -36, 36, -57, 57, -81, 81] : []) {
        candidates.push([{x: midX + offset, y: from.y}, {x: midX + offset, y: to.y}]);
        candidates.push([{x: from.x, y: midY + offset}, {x: to.x, y: midY + offset}]);
    }
    let best, bestCost = Infinity;
    for (const bends of candidates) {
        const points = [from, ...bends, to].filter((p, i, all) => !i || p.x !== all[i - 1].x || p.y !== all[i - 1].y);
        // Ignore bends that lie inside an endpoint box.
        if (points.length > 2 && (hits(points[1], points[1], from) || hits(points.at(-2), points.at(-2), to))) continue;
        points[0] = port(from, points[1], 3);
        points[points.length - 1] = port(to, points.at(-2), 3);
        let cost = bends.length * 12;
        for (let i = 1; i < points.length; i++) {
            const a = points[i - 1], b = points[i];
            cost += Math.hypot(a.x - b.x, a.y - b.y);
            for (const box of obstacles) if (hits(a, b, box)) cost += 1000;
        }
        if (cost < bestCost) {
            best = points;
            bestCost = cost;
        }
    }
    if (!best && corridor != null) return route(from, to, nodes);
    return best.map(({x, y}, i) => (i ? 'L' : 'M') + x + ' ' + y).join(' ');
}

export function boxCanvas({parent, title, nodes, edges, marks, select: inspect, activate, initial, close, captions = [], kind, straightEdges = false}) {
    const frame = element('section', null, 'box-canvas');
    if (kind) frame.dataset.canvasKind = kind;
    frame.setAttribute('aria-label', title);
    const map = element('div', null, 'canvas-map');
    const viewport = element('div', null, 'canvas-viewport');
    const plane = element('div', null, 'canvas-plane');
    const inspector = element('aside', null, 'canvas-inspector');
    inspector.setAttribute('aria-label', 'Selection');
    const toolbar = element('div', null, 'canvas-toolbar');
    const legend = element('div', null, 'canvas-legend');
    legend.setAttribute('aria-label', 'Map key');
    const svg = shape('svg', {'aria-hidden': 'true'});

    const centered = element('output');
    centered.setAttribute('aria-label', 'Map scale');
    toolbar.append(element('h2', title), control('−', () => zoomBy(1 / 1.25), 'Zoom out'),
        centered, control('+', () => zoomBy(1.25), 'Zoom in'),
        control('Fit', fit, 'Fit whole canvas'), ...(close ? [control('×', close, 'Close canvas')] : []));
    legend.append(element('strong', 'Map key'));
    for (const mark of marks) {
        const entry = element('span', null, 'canvas-key');
        if (mark.symbol || mark.icon) entry.append(marker(mark), element('span', mark.label));
        else entry.append(element('i', null, 'canvas-swatch ' + mark.key), element('span', mark.label));
        legend.append(entry);
    }

    const left = nodes.length ? Math.min(...nodes.map(n => n.x - n.w / 2)) - 24 : 0;
    const top = nodes.length ? Math.min(...nodes.map(n => n.y - n.h / 2), ...captions.map(c => c.y - 9)) - 32 : 0;
    const width = nodes.length ? Math.max(...nodes.map(n => n.x + n.w / 2)) - left + 24 : 640;
    const height = nodes.length ? Math.max(...nodes.map(n => n.y + n.h / 2)) - top + 32 : 360;
    svg.setAttribute('viewBox', [left, top, width, height].join(' '));
    const defs = shape('defs', {});
    for (const key of new Set(edges.map(e => e.kind || 'route'))) {
        const arrow = shape('marker', {id: 'canvas-arrow-' + key, viewBox: '0 0 10 10',
            markerWidth: 7, markerHeight: 7, refX: 9, refY: 5, orient: 'auto-start-reverse'});
        arrow.append(shape('path', {d: 'M 0 1 L 10 5 L 0 9 Z', class: 'arrow-' + key}));
        defs.append(arrow);
    }
    const byId = new Map(nodes.map(n => [n.id, n]));
    const paths = edges.map(edge => {
        const {from, to, kind = 'route', both, corridor} = edge;
        const arrow = 'url(#canvas-arrow-' + kind + ')';
        const a = byId.get(from), b = byId.get(to);
        const d = straightEdges ? `M${a.x} ${a.y}L${b.x} ${b.y}` : route(a, b, nodes, corridor);
        const path = shape('path', {d, class: 'canvas-edge edge-' + kind, 'marker-end': straightEdges ? '' : arrow});
        if (both) path.setAttribute('marker-start', arrow);
        return {from, to, path};
    });
    svg.append(defs, ...paths.map(e => e.path));
    plane.append(svg);

    for (const caption of captions) {
        const label = element('span', caption.label, 'canvas-caption');
        label.style.left = (caption.x - left) + 'px';
        label.style.top = (caption.y - top) + 'px';
        plane.append(label);
    }

    const buttons = new Map();
    for (const node of nodes) {
        const tags = node.marks || [];
        const danger = node.danger;
        const rank = danger?.rank;
        const risk = danger ? [danger.challenge ? 'Challenge' : 'Combat area', rank == null ? '' : 'Enemy rank ' + rank].filter(Boolean).join(' · ') : '';
        const label = [node.label, node.current ? 'You are here' : '', risk, ...tags.map(mark => mark.label)].filter(Boolean).join(' · ');
        const box = control('', () => activate ? activate(node.id, select) : select(node.id), label);
        box.className = 'canvas-box';
        box.dataset.id = node.id;
        if (node.group) box.dataset.group = node.group;
        if (node.label.length > (node.w < 110 ? 25 : 38)) box.classList.add('long-label');
        if (node.current) box.classList.add('is-current');
        if (node.combat) box.classList.add('is-combat');
        box.style.left = (node.x - left) + 'px';
        box.style.top = (node.y - top) + 'px';
        box.style.width = node.w + 'px';
        box.style.height = node.h + 'px';
        if (tags.length) {
            const dots = element('span', null, 'canvas-dots');
            dots.append(...tags.map(marker));
            box.append(dots);
        }
        box.append(element('span', node.label, 'canvas-label'));
        if (node.subtitle) box.append(element('small', node.subtitle, 'canvas-subtitle'));
        if (danger) {
            const badge = element('span', (danger.challenge ? '◆' : '▲') + (rank ?? ''), 'canvas-danger');
            badge.title = risk;
            badge.setAttribute('aria-hidden', 'true');
            box.append(badge);
        }
        if (node.current) box.append(element('small', 'You are here', 'canvas-current'));
        plane.append(box);
        buttons.set(node.id, box);
    }

    let scale = 1, x = 0, y = 0, fitted = true;
    function paint() {
        plane.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        centered.textContent = Math.round(scale * 100) + '%';
    }

    function fit() {
        const w = viewport.clientWidth, h = viewport.clientHeight;
        scale = Math.min(w / width, h / height, 1.24);
        x = (w - width * scale) / 2;
        y = (h - height * scale) / 2;
        fitted = true;
        paint();
    }

    function zoomBy(factor, px = viewport.clientWidth / 2, py = viewport.clientHeight / 2) {
        const next = Math.min(3.5, Math.max(Math.min(.25, scale), scale * factor));
        x = px - (px - x) * next / scale;
        y = py - (py - y) * next / scale;
        scale = next;
        fitted = false;
        paint();
    }

    function select(id, reveal = false) {
        for (const [key, box] of buttons) box.setAttribute('aria-pressed', String(key === id));
        for (const edge of paths) {
            const linked = (kind !== 'village' || !byId.get(id)?.current) && (edge.from === id || edge.to === id);
            edge.path.classList.toggle('is-linked', linked);
            if (linked) svg.append(edge.path);
        }
        inspector.replaceChildren();
        inspect(id, inspector, select);
        inspector.scrollTop = 0;
        if (reveal) {
            const n = byId.get(id);
            const screenX = x + (n.x - left) * scale, screenY = y + (n.y - top) * scale;
            const halfW = n.w * scale / 2, halfH = n.h * scale / 2;
            if (screenX - halfW < 0 || screenX + halfW > viewport.clientWidth ||
                screenY - halfH < 0 || screenY + halfH > viewport.clientHeight) {
                x += viewport.clientWidth / 2 - screenX;
                y += viewport.clientHeight / 2 - screenY;
                fitted = false;
                paint();
            }
            buttons.get(id).focus({preventScroll: true});
        }
    }

    let pan;
    viewport.addEventListener('pointerdown', event => {
        if (event.button !== 0 || event.target.closest('button')) return;
        pan = {dx: x - event.clientX, dy: y - event.clientY};
        viewport.setPointerCapture(event.pointerId);
    });
    viewport.addEventListener('pointermove', event => {
        if (!pan) return;
        x = event.clientX + pan.dx;
        y = event.clientY + pan.dy;
        fitted = false;
        paint();
    });
    viewport.addEventListener('lostpointercapture', () => { pan = null; });
    viewport.addEventListener('wheel', event => {
        event.preventDefault();
        const bounds = viewport.getBoundingClientRect();
        zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, event.clientX - bounds.left, event.clientY - bounds.top);
    }, {passive: false});
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', 'Canvas. Arrow keys pan, plus and minus zoom, Home fits.');
    viewport.addEventListener('keydown', event => {
        if (event.target !== viewport) return;
        const moves = {ArrowUp: [0, 48], ArrowDown: [0, -48], ArrowLeft: [48, 0], ArrowRight: [-48, 0]};
        if (Object.hasOwn(moves, event.key)) {
            const [dx, dy] = moves[event.key];
            x += dx;
            y += dy;
            fitted = false;
            paint();
        } else if (event.key === '+' || event.key === '=') zoomBy(1.25);
        else if (event.key === '-') zoomBy(1 / 1.25);
        else if (event.key === 'Home') fit();
        else return;
        event.preventDefault();
    });
    // Keep keyboard-selected boxes in frame at the current zoom.
    viewport.addEventListener('focusin', event => {
        const node = byId.get(event.target.dataset.id);
        if (!node) return;
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
        const px = x + (node.x - left) * scale, py = y + (node.y - top) * scale;
        const marginX = node.w * scale / 2 + 6, marginY = node.h * scale / 2 + 6;
        const dx = Math.max(marginX, Math.min(viewport.clientWidth - marginX, px)) - px;
        const dy = Math.max(marginY, Math.min(viewport.clientHeight - marginY, py)) - py;
        if (dx || dy) {
            x += dx;
            y += dy;
            paint();
        }
    });
    plane.style.width = width + 'px';
    plane.style.height = height + 'px';
    viewport.append(plane);
    map.append(toolbar, viewport, legend);
    frame.append(map, inspector);
    parent.append(frame);
    const observer = new ResizeObserver(() => {
        if (!frame.isConnected) observer.disconnect();
        else if (fitted) fit();
    });
    observer.observe(viewport);
    fit();
    if (nodes.length) select(initial || nodes[0].id);
    else inspector.append(element('p', 'No connected nodes in this view.'));
    return {select, has: id => byId.has(id)};
}
