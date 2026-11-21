export const creatureMarks = [
    {key: 'kind', label: 'Individual → Kind'},
    {key: 'prey', label: 'Predator → Prey'},
    {key: 'start', label: 'Individual → Starting place'},
    {key: 'related', label: 'Other relationship'},
    {key: 'selected', label: 'Selected'},
];

const primaryKinds = new Map([['Kind', 'kind'], ['Body kind', 'kind'], ['Prey', 'prey'], ['Starting location', 'start']]);
const inverseKinds = new Set(['Individual', 'Predator', 'Starts here']);

export function libraryEdges(records, {primaryOnly = false} = {}) {
    const included = new Set(records.map(r => r.id));
    const edges = new Map();
    for (const rec of records) {
        for (const link of rec.links) {
            if (!included.has(link.id) || inverseKinds.has(link.relation)) continue;
            const kind = primaryKinds.get(link.relation) || 'related';
            if (primaryOnly && kind === 'related') continue;
            const key = JSON.stringify([kind, ...[rec.id, link.id].sort()]);
            if (edges.has(key)) {
                const edge = edges.get(key);
                if (edge.from !== rec.id) edge.both = true;
            } else edges.set(key, {from: rec.id, to: link.id, kind});
        }
    }
    return [...edges.values()];
}

const sized = (record, x, y, w = 148) => ({...record, x, y, w, h: 50});

export function creatureOverview(records) {
    const edges = libraryEdges(records, {primaryOnly: true});
    const byId = new Map(records.map(rec => [rec.id, rec]));
    const placements = new Map();
    const put = (id, x, y, w) => placements.set(id, sized(byId.get(id), x, y, w));

    const people = edges.filter(edge => edge.kind === 'start');
    const personIds = new Set(people.map(e => e.from));
    const personKinds = new Set(edges.filter(e => e.kind === 'kind' && personIds.has(e.from)).map(e => e.to));
    const wildlife = [
        ...edges.filter(e => e.kind === 'kind' && !personIds.has(e.from)),
        ...edges.filter(e => e.kind === 'prey'),
    ];
    const starts = Map.groupBy(people, edge => edge.to);
    const width = Math.max(starts.size * 170, Math.min(wildlife.length, 3) * 390);

    const captions = [{label: 'Household & wildlife', x: width / 2, y: 0}];
    const wildlifeColumns = Math.min(wildlife.length || 1, 3);
    for (const [i, edge] of wildlife.entries()) {
        const center = (i % wildlifeColumns + .5) * width / wildlifeColumns;
        const y = 65 + Math.floor(i / wildlifeColumns) * 90;
        put(edge.from, center - 105, y);
        put(edge.to, center + 105, y);
    }

    const peopleTop = 135 + Math.max(0, Math.ceil(wildlife.length / wildlifeColumns) - 1) * 90;
    captions.push({label: 'People & starting places', x: width / 2, y: peopleTop});
    const nodeW = 142;
    for (const [i, id] of [...personKinds].entries()) {
        put(id, (i + .5) * width / personKinds.size, peopleTop + 62, nodeW);
    }
    const startRow = peopleTop + 158 + Math.max(0, ...[...starts.values()].map(group => group.length - 1)) * 89 + 104;
    for (const [i, [placeId, group]] of [...starts].entries()) {
        const x = (i + .5) * width / starts.size;
        put(placeId, x, startRow, nodeW);
        for (const [j, e] of group.entries()) {
            put(e.from, x, peopleTop + 158 + j * 89, nodeW);
        }
    }
    return {nodes: [...placements.values()], edges, captions};
}

export function creatureShelf(records) {
    if (records.length === 1) return [sized(records[0], 0, 0, 220)];
    const columns = Math.min(10, Math.ceil(Math.sqrt(records.length * 1.8)));
    const chipW = columns <= 3 ? 176 : 126;
    return records.map((r, i) => sized(r, i % columns * (chipW + 48), Math.floor(i / columns) * 82, chipW));
}

export function creatureNeighborhood(record, records) {
    if (records.length === 1) return creatureShelf(records);
    const peers = records.filter(r => r !== record);
    const columns = Math.min(8, Math.ceil(peers.length / 2));
    return [sized(record, (columns - 1) * 104, 150, 176), ...peers.map((r, i) =>
        sized(r, (i % columns) * 208 + (peers.length === 1 ? 208 : 0), i < columns ? 0 : 300, 176))];
}
