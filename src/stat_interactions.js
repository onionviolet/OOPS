// Cross-system stat report (author/dev only, pure). Given the content registries that grant stats and
// the source text of the engine, list which stats are granted by what, which code names them, and which
// stacks look runaway. Static and heuristic by design: a name match is evidence of a reader, not proof,
// and a generic loop over all stats names nothing. The CLI (scripts/stat_report.mjs) loads the inputs.

/** Walk any registry and collect {stat, source, flat, multiplier} for every `stats: {name: {flat, multiplier}}`. */
export function collectStatGrants(registries) {
    const grants = [];
    const walk = (value, path, source, seen) => {
        if (!value || typeof value !== 'object' || seen.has(value)) return;
        seen.add(value);
        if (!Array.isArray(value) && path.at(-1) === 'stats') {
            for (const [stat, v] of Object.entries(value)) {
                if (v && typeof v === 'object' && (typeof v.flat === 'number' || typeof v.multiplier === 'number'))
                    grants.push({stat, source, flat: v.flat ?? 0, multiplier: v.multiplier ?? 1});
                else if (typeof v === 'number') grants.push({stat, source, flat: v, multiplier: 1});
            }
            return;
        }
        for (const [k, v] of Object.entries(value)) if (typeof v === 'object') walk(v, [...path, k], source, seen);
    };
    for (const [kind, registry] of Object.entries(registries))
        for (const [id, def] of Object.entries(registry)) walk(def, [], `${kind}:${id}`, new WeakSet());
    return grants;
}

const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Files whose text names the stat as a property read or quoted index. Declarations (`key:`) are not reads. */
export function scanStatReaders(stat, files) {
    const k = escape(stat);
    const read = new RegExp(`(?:\\.${k}\\b(?!\\s*[:=](?!=)))|(?:\\[['"\`]${k}['"\`]\\])`);
    const hits = {};
    for (const [file, text] of Object.entries(files)) {
        let n = 0;
        for (const line of text.split('\n')) if (read.test(line)) n++;
        if (n) hits[file] = n;
    }
    return hits;
}

// Files that only show or describe stats; a name here is a label, not behavior.
const PRESENTATION = /(?:^|\/)(?:display|misc|tooltip|status_window|character_sheet|statistics_panel|combat_display|equipment_compar|item_card)/;

export function buildStatReport({statKeys, grants, files, runawayMultiplier = 3, runawayStack = 20}) {
    const keys = [...new Set([...statKeys, ...grants.map(g => g.stat)])].sort();
    const rows = keys.map(stat => {
        const mine = grants.filter(g => g.stat === stat);
        const readers = scanStatReaders(stat, files);
        const behavior = Object.keys(readers).filter(f => !PRESENTATION.test(f));
        const mults = mine.map(g => g.multiplier).filter(m => m !== 1);
        const maxSingle = mults.length ? Math.max(...mults) : 1;
        const stacked = mults.filter(m => m > 1).reduce((a, b) => a * b, 1);
        return {stat, writers: mine.length, writerKinds: [...new Set(mine.map(g => g.source.split(':')[0]))],
            readerFiles: Object.keys(readers).length, behaviorReaders: behavior.length, behaviorFiles: behavior.slice(0, 6),
            maxSingleMultiplier: +maxSingle.toFixed(3), worstCaseStack: +stacked.toFixed(3),
            maxFlat: mine.length ? Math.max(...mine.map(g => g.flat)) : 0, minFlat: mine.length ? Math.min(...mine.map(g => g.flat)) : 0};
    });
    return {
        stats: rows,
        noReader: rows.filter(r => r.writers > 0 && r.readerFiles === 0).map(r => r.stat),
        displayOnly: rows.filter(r => r.writers > 0 && r.readerFiles > 0 && r.behaviorReaders === 0).map(r => r.stat),
        noWriter: rows.filter(r => r.writers === 0 && r.behaviorReaders > 0).map(r => r.stat),
        unused: rows.filter(r => r.writers === 0 && r.readerFiles === 0).map(r => r.stat),
        runaway: rows.filter(r => r.maxSingleMultiplier >= runawayMultiplier || r.worstCaseStack >= runawayStack)
            .map(r => ({stat: r.stat, maxSingle: r.maxSingleMultiplier, worstCaseStack: r.worstCaseStack})),
        totals: {stats: rows.length, grants: grants.length},
    };
}
