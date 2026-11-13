import {attackWindow, resolveWindowApproach, settleWindowFight} from './window_attack_draft.js';
import {captureFleeingGu, fleeingGu, startGuFlight} from '../../gu_flight.js';

const width = 4;
const height = 3;
const tools = ['Inspect', 'Wall', 'Door', 'Window', 'Shutter', 'Roof', 'Bed', 'Bench', 'Orchid bed', 'Drying rack',
    'Raise ground', 'Dig trench', 'Move', 'Remove'];
const fittingNames = new Set(['Bed', 'Bench', 'Orchid bed', 'Drying rack']);
const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const cellId = (x, y) => y * width + x;
const inside = (x, y) => x >= 0 && x < width && y >= 0 && y < height;
const edgeId = (x, y, direction) => [
    `h:${x}:${y}`, `v:${x + 1}:${y}`, `h:${x}:${y + 1}`, `v:${x}:${y}`,
][direction];

function startingPlot() {
    const tiles = Array.from({length: width * height}, (_, i) => ({
        ground: i >= width * 2 ? 'Low ground' : 'Firm ground', roof: i < 2, fitting: null,
    }));
    tiles[0].fitting = 'Bed';
    return {tiles, edges: {
        'h:0:0': 'Wall', 'h:1:0': 'Wall', 'h:0:1': 'Door', 'h:1:1': 'Wall', 'v:0:0': 'Wall', 'v:2:0': 'Wall',
    }};
}

function connections(id, edges, doorsPass) {
    const x = id % width, y = Math.floor(id / width);
    return directions.flatMap(([dx, dy], direction) => {
        const barrier = edges[edgeId(x, y, direction)];
        if (barrier && (!doorsPass || barrier !== 'Door')) return [];
        return [inside(x + dx, y + dy) ? cellId(x + dx, y + dy) : -1];
    });
}

function flood(start, next) {
    const visited = new Set(start);
    for (const id of visited) for (const neighbor of next(id)) {
        if (neighbor >= 0) visited.add(neighbor);
    }
    return visited;
}

function stepsToYard(plot) {
    const distance = new Map([[0, 0]]);
    for (const [id, steps] of distance) {
        for (const next of connections(id, plot.edges, true)) {
            if (next === -1) return steps + 1;
            if (!distance.has(next)) distance.set(next, steps + 1);
        }
    }
    return Infinity;
}

function readPlot({tiles, edges}) {
    const ids = tiles.map((_, id) => id);
    const floodFromOutside = doorsPass => {
        const next = id => connections(id, edges, doorsPass);
        return flood(ids.filter(id => next(id).includes(-1)), next);
    };
    const outside = floodFromOutside(false);
    const accessible = floodFromOutside(true);
    const rooms = new Map();
    for (const id of ids) {
        if (outside.has(id) || rooms.has(id)) continue;
        const cells = [...flood([id], cell => connections(cell, edges, false))];
        const room = {number: new Set(rooms.values()).size + 1, cells, roofed: cells.every(cell => tiles[cell].roof)};
        cells.forEach(cell => rooms.set(cell, room));
    }
    return {rooms, accessible};
}

function useAt(plot, view, id) {
    const {fitting, ground, roof} = plot.tiles[id];
    if (!fitting) return null;
    if (!view.accessible.has(id)) return [fitting, 'Add a door or open a route from outside.'];
    if (ground === 'Trench') return [fitting, 'Fill the trench or move the fitting.'];
    if (fitting === 'Orchid bed') {
        const x = id % width, y = Math.floor(id / width);
        const drained = ground !== 'Low ground' || directions.some(([dx, dy]) =>
            inside(x + dx, y + dy) && plot.tiles[cellId(x + dx, y + dy)].ground === 'Trench');
        return ['Grow Moon Orchids', roof ? 'The bed needs daylight.' : drained ? '' : 'Raise the bed or dig an adjacent trench.'];
    }
    if (fitting === 'Bed') return ['Rest', view.rooms.get(id)?.roofed ? '' : 'Enclose and roof the room.'];
    if (fitting === 'Bench') return ['Make and repair', roof ? '' : 'Cover the bench with a roof.'];
    return ['Dry Gu feed', roof && ground !== 'Low ground' ? '' : 'Put the rack on dry ground under cover.'];
}

export function createPlotDraft() {
    const plot = startingPlot();
    const root = document.createElement('div');
    root.className = 'plot-draft';
    const make = (tag, text) => {
        const element = document.createElement(tag);
        if (text) element.textContent = text;
        return element;
    };
    const style = make('style', `
        .plot-draft { display:grid; gap:var(--ui-space-3); }
        .plot-draft .draft-tools { display:flex; flex-wrap:wrap; gap:var(--ui-space-2); }
        .plot-draft .draft-workspace { display:grid; grid-template-columns:minmax(0,3fr) minmax(13rem,2fr); gap:var(--ui-space-4); }
        .plot-draft .draft-map { display:grid; grid-template-columns:1.7rem repeat(4,minmax(0,1fr) 1.7rem);
            grid-template-rows:1.7rem repeat(3,minmax(4.9rem,auto) 1.7rem); align-self:start; }
        .plot-draft .draft-map button { min-width:0; padding:var(--ui-space-1); overflow-wrap:anywhere; }
        .plot-draft .draft-cell { display:grid; place-content:center; gap:var(--ui-space-1); text-align:center; }
        .plot-draft .draft-cell[data-roof="true"] { background:color-mix(in srgb,var(--ui-teal) 35%,var(--workspace-surface)) !important; }
        .plot-draft .draft-edge[data-kind="Wall"] { background:var(--workspace-border,var(--ui-hairline)) !important; }
        .plot-draft .draft-edge[data-kind="Door"] { border:2px solid var(--ui-accent); }
        .plot-draft [aria-pressed="true"] { outline:2px solid var(--ui-accent); outline-offset:-2px; }
        .plot-draft .draft-notes { border-inline-start:1px solid var(--workspace-border); padding-inline-start:var(--ui-space-3); }
        .plot-draft .draft-notes p { margin-block:var(--ui-space-2); }
        .plot-draft .draft-incident { border-top:1px solid var(--workspace-border); padding-top:var(--ui-space-3); }
        .plot-draft .draft-incident button { margin:0 var(--ui-space-2) var(--ui-space-2) 0; }
        @media(max-width:900px) { .plot-draft .draft-workspace { grid-template-columns:minmax(0,1fr); } }
    `);
    const bar = make('div');
    bar.className = 'draft-tools';
    const workspace = make('div');
    workspace.className = 'draft-workspace';
    const map = make('div');
    map.className = 'draft-map';
    map.setAttribute('aria-label', 'Plot plan');
    const notes = make('div');
    notes.className = 'draft-notes';
    const status = make('p');
    status.setAttribute('role', 'status');
    const incident = make('section');
    incident.className = 'draft-incident';
    const incidentText = make('p');
    incidentText.setAttribute('role', 'status');
    const incidentActions = make('div');
    incident.append(make('h3', 'A visitor after dark'), incidentText, incidentActions);
    const escape = make('section');
    escape.className = 'draft-incident';
    const escapeText = make('p');
    escapeText.setAttribute('role', 'status');
    const escapeActions = make('div');
    escape.append(make('h3', 'A Gu slips its keeper'), escapeText, escapeActions);
    let flight = null;
    let escapeReport = '';
    const flightKind = 'moth';
    const flightSite = 'yard';
    let attempt = null;
    let tool = 'Inspect', selected = 0, moving = null;
    const toolButtons = new Map();
    const mapButtons = [];
    function button(parent, label, click) {
        const element = make('button', label);
        element.type = 'button';
        element.addEventListener('click', click);
        parent.append(element);
        return element;
    }
    function drawIncident(focus = false) {
        incidentActions.replaceChildren();
        if (!attempt) {
            incidentText.textContent = 'Try a window attack at the upper-left edge of the plot.';
            const setup = button(incidentActions, 'Set up window trial', () => {
                plot.edges[attackWindow] = 'Window';
                attempt = {report: 'You hear a scrape outside the bedroom window.', pending: true};
                update('');
                drawEscape();
                incidentActions.firstElementChild?.focus();
            });
            setup.disabled = flight !== null || escapeReport !== '';
        } else {
            incidentText.textContent = attempt.report;
            if (attempt.pending) {
                const respond = (label, response) => button(incidentActions, label, () => {
                    attempt = resolveWindowApproach(plot, response);
                    update('');
                    drawIncident(true);
                });
                if (plot.edges[attackWindow] === 'Window') respond('Close the shutter', 'shutter');
                if (readPlot(plot).accessible.has(0)) respond('Leave for the yard', 'leave');
                respond('Stay by the bed', 'stay');
            } else if (attempt.fight) {
                incidentText.textContent += ` Vitality ${attempt.vitality}/20.`;
                button(incidentActions, 'Fight back', () => {
                    const result = settleWindowFight(attempt.fight);
                    const outcome = result.winner === 'household' ? 'You drive off the attacker.'
                        : result.winner === 'intruder' ? 'The attacker overpowers you.' : 'The fight ends without a clear winner.';
                    attempt = {report: `${outcome} Vitality ${result.vitality}/20.`};
                    drawIncident(true);
                });
            } else {
                button(incidentActions, 'End trial', () => {
                    attempt = null;
                    drawIncident(true);
                    drawEscape();
                });
            }
        }
        if (focus) incidentActions.firstElementChild?.focus();
    }

    function drawEscape(focus = false) {
        escapeActions.replaceChildren();
        const steps = stepsToYard(plot);
        if (escapeReport) {
            escapeText.textContent = escapeReport;
            button(escapeActions, 'End escape trial', () => {
                flight = null;
                escapeReport = '';
                drawEscape(true);
                drawIncident();
            });
        } else if (flight) {
            const contact = {site: flightSite, clock: steps};
            const canCatch = Boolean(fleeingGu(flight, flightKind, contact));
            const route = !Number.isFinite(steps) ? 'Your way to the yard is blocked.'
                : canCatch ? 'You can reach the yard before it takes off.'
                : 'The way around is too long to reach it in time.';
            escapeText.textContent = 'The Gu slips through the opening and settles in the yard. ' + route;
            if (canCatch) button(escapeActions, 'Go around and recapture it', () => {
                captureFleeingGu(flight, flightKind, contact);
                escapeReport = 'You reach the yard in time and recapture the same Gu.';
                drawEscape(true);
            });
            button(escapeActions, 'Let it go', () => {
                escapeReport = 'The Gu takes off beyond the yard.';
                drawEscape(true);
            });
        } else {
            const opening = plot.edges[attackWindow];
            const passes = opening === 'Window' || opening === 'Cracked shutter' || !opening;
            escapeText.textContent = passes
                ? 'The upper-left opening admits a small flying Gu. The keeper needs a separate way to the yard.'
                : 'The upper-left edge blocks the Gu. Try a window, then change the doorway to compare recovery routes.';
            const start = button(escapeActions, 'Try Gu escape', () => {
                if (passes) flight = startGuFlight({host: 'draft.enclosure', clock: 0,
                    routes: {[flightKind]: {site: flightSite, minutes: 3}}});
                else escapeReport = 'During handling, the Gu slips free but stays inside. You secure it again.';
                drawEscape(true);
                drawIncident();
            });
            start.disabled = attempt !== null;
        }
        if (focus) escapeActions.firstElementChild?.focus();
    }
    for (const name of tools) {
        toolButtons.set(name, button(bar, name, () => {
            tool = name;
            moving = null;
            update(name === 'Move' ? 'Choose a fitting, wall or door to move.' : '');
        }));
    }
    for (let row = 0; row <= height * 2; row++) for (let col = 0; col <= width * 2; col++) {
        if (row % 2 === 0 && col % 2 === 0) continue;
        const tile = row % 2 && col % 2;
        const x = Math.floor(col / 2), y = Math.floor(row / 2);
        const key = tile ? cellId(x, y) : `${row % 2 === 0 ? 'h' : 'v'}:${x}:${y}`;
        const element = button(map, '', () => useTool(tile ? 'cell' : 'edge', key));
        element.className = tile ? 'draft-cell' : 'draft-edge';
        element.style.gridArea = `${row + 1} / ${col + 1}`;
        element.dataset.plotTarget = key;
        mapButtons.push({element, tile, key, x, y});
    }

    function move(kind, key) {
        const value = kind === 'cell' ? plot.tiles[key].fitting : plot.edges[key];
        if (!moving) {
            if (!value) return 'Choose a fitting or built edge.';
            moving = {kind, key, value};
            return kind === 'cell' ? 'Choose an empty square.' : 'Choose an empty edge.';
        }
        if (moving.kind !== kind || value || (kind === 'cell' && plot.tiles[key].ground === 'Trench'))
            return 'Choose an empty destination that can hold it.';
        if (kind === 'cell') {
            plot.tiles[moving.key].fitting = null;
            plot.tiles[key].fitting = moving.value;
        } else {
            delete plot.edges[moving.key];
            plot.edges[key] = moving.value;
        }
        moving = null;
        return 'Moved.';
    }

    function useTool(kind, key) {
        if ((flight || escapeReport) && tool !== 'Inspect') return update('End the escape trial before editing the plot.');
        if (attempt?.fight && tool !== 'Inspect') return update('Finish the fight before editing the plot.');
        if (kind === 'cell') selected = key;
        if (tool === 'Inspect') {
            update(kind === 'edge' ? (plot.edges[key] || 'Open edge') : '');
            return;
        }
        if (tool === 'Move') {
            update(move(kind, key));
            return;
        }
        if (kind === 'edge') {
            if (tool === 'Remove') delete plot.edges[key];
            else if (['Wall', 'Door', 'Window', 'Shutter'].includes(tool)) plot.edges[key] = tool;
            else return update('Choose a square for this tool.');
        } else {
            const tile = plot.tiles[key];
            if (tool === 'Roof') tile.roof = !tile.roof;
            else if (tool === 'Raise ground') tile.ground = 'Raised ground';
            else if (tool === 'Dig trench') {
                if (tile.fitting) return update('Move or remove the fitting before digging.');
                tile.ground = 'Trench';
            } else if (tool === 'Remove') {
                if (tile.fitting) tile.fitting = null;
                else if (tile.roof) tile.roof = false;
                else return update('Use Raise ground to fill a trench.');
            } else if (fittingNames.has(tool)) {
                if (tile.fitting || tile.ground === 'Trench') return update('Choose clear ground for the fitting.');
                tile.fitting = tool;
            } else return update('Choose an edge for this tool.');
        }
        update('');
    }

    function update(message) {
        for (const [name, element] of toolButtons) element.setAttribute('aria-pressed', String(tool === name));
        const view = readPlot(plot);
        for (const {element, tile, key, x, y} of mapButtons) {
            if (tile) {
                const cell = plot.tiles[key];
                element.replaceChildren(make('strong', cell.fitting || cell.ground),
                    make('small', cell.roof ? 'Roofed' : 'Open sky'));
                element.dataset.roof = String(cell.roof);
                element.setAttribute('aria-label', `${x + 1}, ${y + 1} · ${cell.fitting || cell.ground} · ${cell.roof ? 'Roofed' : 'Open sky'}`);
            } else {
                const edge = plot.edges[key];
                element.textContent = {Door: '▯', Wall: '■', Window: '◇', Shutter: '▧', 'Cracked shutter': '×'}[edge] || '·';
                element.dataset.kind = edge || '';
                element.setAttribute('aria-label', `${edge || 'Open edge'} · ${key.startsWith('h') ? 'horizontal' : 'vertical'} ${x + 1}, ${y + 1}`);
                element.title = edge || 'Open edge';
            }
            element.setAttribute('aria-pressed', String(moving ? moving.key === key : tile && key === selected));
        }
        const room = view.rooms.get(selected);
        const cells = room?.cells || [selected];
        const uses = cells.map(id => useAt(plot, view, id)).filter(Boolean);
        notes.replaceChildren(make('h3', room ? `Room ${room.number}` : 'Open ground'),
            make('p', [plot.tiles[selected].ground, view.accessible.has(selected) ? 'Reachable' : 'Closed off',
                room ? room.roofed ? 'Fully roofed' : 'Open to rain' : plot.tiles[selected].roof ? 'Under cover' : 'Open sky'].join(' · ')));
        if (!uses.length) notes.append(make('p', 'Place a fitting to give this space a use.'));
        for (const [name, reason] of uses) {
            const row = make('p');
            row.append(make('strong', name), document.createTextNode(reason ? ` · ${reason}` : ' · Ready'));
            notes.append(row);
        }
        status.textContent = message;
        if (attempt?.pending) drawIncident();
        if (!flight && !escapeReport) drawEscape();
    }

    workspace.append(map, notes);
    root.append(style, make('h2', 'Plot plan'), make('p',
        'Practice plot · Pick a tool, then a square or an edge. Inspect a room to see what it can do.'), bar, workspace, status, incident, escape);
    update('');
    drawIncident();
    return root;
}
