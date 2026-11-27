// Every registered location the Village walk does not reach, grouped by owner.
import {boxCanvas, element as el} from '/canvas.mjs';

const residents = {key: 'people', icon: 'group', label: 'Residents'};
const activity = {key: 'activity', icon: 'explore', label: 'Activities'};
const station = {key: 'station', icon: 'handyman', label: 'Work station'};
export const otherMarks = [residents, activity, station,
    {key: 'combat', label: 'Combat area'}, {key: 'route', label: 'Route'}, {key: 'selected', label: 'Selected'}];

export function otherDiagram(rows) {
    const groups = [...Map.groupBy(rows, r => r.group)].sort((a, b) => b[1].length - a[1].length);
    const nodes = [], captions = [];
    const per = 3, boxW = 150, boxH = 62, gap = 60, blocksPerRow = 3;
    const rowHeights = [];
    groups.forEach(([, items], i) => {
        const r = Math.floor(i / blocksPerRow);
        rowHeights[r] = Math.max(rowHeights[r] || 0, Math.ceil(items.length / per));
    });
    groups.forEach(([name, items], i) => {
        const r = Math.floor(i / blocksPerRow), c = i % blocksPerRow;
        const ox = c * (per * boxW + gap);
        const oy = rowHeights.slice(0, r).reduce((s, h) => s + h * boxH + 70, 0);
        captions.push({label: `${name} · ${items.length}`, x: ox + boxW, y: oy});
        items.forEach((p, j) => {
            const marks = [];
            if (p.people.length) marks.push(residents);
            if (p.activities.length) marks.push(activity);
            if (p.stations.length) marks.push(station);
            nodes.push({...p, x: ox + (j % per) * boxW, y: oy + 34 + Math.floor(j / per) * boxH, w: 136, h: 44, marks, group: 'Locations'});
        });
    });
    const shown = new Set(nodes.map(n => n.id)), edges = new Map();
    for (const p of rows) for (const to of p.routes) {
        if (!shown.has(to)) continue;
        const key = [p.id, to].sort().join('|');
        if (!edges.has(key)) edges.set(key, {from: p.id, to});
        else if (edges.get(key).from !== p.id) edges.get(key).both = true;
    }
    return {nodes, edges: [...edges.values()], captions};
}

export function otherPlaces({main, data, controls, finder, list, closeCanvas, group, title = 'Other game places'}) {
    main.replaceChildren();
    const rows = (data.others || []).filter(r => !group || r.group === group);
    const bar = controls();
    bar.append(el('small', group ? `${rows.length} registered locations, not reached from the Village walk` : `${rows.length} registered places outside the Village walk. Book worlds walk through their own hosts.`));
    const byId = new Map(rows.map(r => [r.id, r]));
    const board = boxCanvas({
        parent: main, title, ...otherDiagram(rows), marks: otherMarks, kind: 'village', close: closeCanvas,
        select(id, side) {
            const p = byId.get(id);
            side.append(el('small', p.group + (p.combat ? ' · Combat area' : '')), el('h2', p.label), el('p', 'Location id: ' + p.id));
            side.append(el('p',p.playStatus+' · '+p.playGap));
            for (const [label, values] of [['Residents', p.people], ['Activities', p.activities], ['Work stations', p.stations]]) {
                if (!values.length) continue;
                const d = el('details');
                d.open = true;
                d.append(el('summary', label + ' · ' + values.length), list(values));
                side.append(d);
            }
        },
    });
    finder(bar, rows, r => board.select(r.id, true));
}
