// L2b / CL94. Private, local worksheet generator; source rows stay verbatim.
// node scripts/lead_run/cast_worksheet.mjs <mergedDir> --crosswalk <file> --world lotm|mol --from <locator> --to <locator> --out <privateDir>/cast-worksheets/
import {readFileSync, mkdirSync, writeFileSync, realpathSync} from 'node:fs';
import {resolve, relative, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseLocator} from './world_profiles.mjs';

const KINDS = new Set(['person', 'place', 'organization']);
const isList = value => Array.isArray(value) ? value : [];
const parse = locator => {
    const value = parseLocator(locator);
    return value ? [value.lang, value.book, value.ch, value.p] : null;
};
const cmpLoc = (a, b) => {
    const x = parse(a), y = parse(b);
    if (!x || !y) return String(a ?? '').localeCompare(String(b ?? ''));
    return x[0].localeCompare(y[0]) || x[1] - y[1] || x[2] - y[2] || x[3] - y[3];
};
function inSlice(locator, from, to) {
    const v = parse(locator), lo = parse(from), hi = parse(to);
    if (!v || !lo || !hi || v[0] !== lo[0] || v[0] !== hi[0] || v[1] !== lo[1] || v[1] !== hi[1]) return false;
    const compare = (a, b) => a[2] - b[2] || a[3] - b[3];
    return compare(v, lo) >= 0 && compare(v, hi) <= 0;
}
function firstLocator(row) {
    const values = [row?.locator, row?.firstMention, ...isList(row?.evidence).map(e => e?.locator)].filter(Boolean);
    return values.sort(cmpLoc)[0] ?? null;
}
function ordered(rows) {
    return rows.sort((a, b) => cmpLoc(a.locator, b.locator));
}
function readJsonl(path) {
    return readFileSync(path, 'utf8').split('\n').filter(line => line.trim()).map(JSON.parse);
}
function minute(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return null;
    const text = value.trim().toLowerCase();
    const bands = {night: [0, 360], dawn: [360, 480], morning: [480, 720], noon: [720, 840], afternoon: [840, 1080], evening: [1080, 1440]};
    if (bands[text]) return bands[text];
    const clock = text.match(/^(\d{1,2}):(\d{2})$/);
    if (clock) return Number(clock[1]) * 60 + Number(clock[2]);
    const ampm = text.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
    if (ampm) return ((Number(ampm[1]) % 12) + (ampm[3] === 'pm' ? 12 : 0)) * 60 + Number(ampm[2] ?? 0);
    return null;
}
function timeFields(row) {
    const fromRaw = row.from ?? row.window?.from ?? row.time?.from ?? row.timeOfDay?.from;
    const toRaw = row.to ?? row.window?.to ?? row.time?.to ?? row.timeOfDay?.to;
    if (fromRaw != null && toRaw != null) {
        const from = minute(fromRaw), to = minute(toRaw);
        if (typeof from === 'number' && typeof to === 'number' && from < to) return {from, to, gap: null};
    }
    const value = row.timeOfDay?.value ?? row.timeOfDay ?? row.time?.value ?? row.time ?? row.at ?? row.start;
    const parsed = minute(value);
    if (Array.isArray(parsed)) return {from: parsed[0], to: parsed[1], gap: null};
    return {from: null, to: null, gap: 'no usable time window in source row'};
}
function scheduleRow(id, row, source) {
    const time = timeFields(row);
    return {
        actor: id,
        place: row.place ?? null,
        day: row.day ?? null,
        from: time.from,
        to: time.to,
        recurrence: row.recurrence ?? (source === 'canon' ? 'once' : null),
        until: row.until ?? null,
        source,
        label: row.label ?? null,
        locator: row.locator ?? null,
        ...(row.status != null ? {status: row.status} : {}),
        ...(time.gap ? {gap: time.gap} : {}),
        ...(row.date != null ? {date: row.date} : {}),
    };
}

export function buildWorksheets({registry, scenes, extras, crosswalk, world = crosswalk?.world, from, to}) {
    if (crosswalk?.schema !== 'cast-crosswalk/1.0' || !['lotm', 'mol'].includes(world) || crosswalk.world !== world) throw new Error('Expected a matching LOTM or MoL cast-crosswalk/1.0 file from L1');
    if (!parse(from) || !parse(to) || cmpLoc(from, to) > 0) throw new Error('Expected ordered --from and --to locators in one source volume');
    const fromKey = parse(from), toKey = parse(to);
    if (fromKey[0] !== toKey[0] || fromKey[1] !== toKey[1]) throw new Error('Expected ordered --from and --to locators in one source volume');
    const sceneRows = scenes.filter(scene => scene.pov === 'lead' && inSlice(firstLocator(scene), from, to));
    const registryById = new Map(registry.map(row => [row.id, row]));
    const extrasById = new Map();
    for (const row of extras) if (['people', 'people_other'].includes(row.extra)) {
        if (!extrasById.has(row.id)) extrasById.set(row.id, []);
        extrasById.get(row.id).push(row);
    }

    const worksheets = [];
    for (const [id, target] of Object.entries(crosswalk.mapping)) {
        const kind = crosswalk.entities?.[id]?.kind;
        if (!KINDS.has(kind) || target.startsWith('skip:')) continue;
        const registryRow = registryById.get(id);
        const extraRows = extrasById.get(id) ?? [];
        const entityScenes = sceneRows.filter(scene => scene.place === id ||
            isList(scene.touched).some(t => t.id === id && ['present', 'partial'].includes(t.status)) || isList(scene.present).includes(id));
        const entityLocators = isList(crosswalk.entities?.[id]?.locators).filter(locator => inSlice(locator, from, to));
        const hasSliceCrosswalkLocator = entityLocators.length > 0;
        if (!entityScenes.length && !hasSliceCrosswalkLocator && !extraRows.some(r => isList(r.routine).some(slot => inSlice(slot.locator ?? r.locator, from, to)))) continue;

        const presence = entityScenes.map(scene => ({scene, touched: isList(scene.touched).find(t => t.id === id)}));
        const present = presence.filter(x => x.touched?.status === 'present' || isList(x.scene.present).includes(id)).length;
        const partial = presence.filter(x => x.touched?.status === 'partial').length;
        const scenesForEntity = ordered(entityScenes.map(scene => ({
            beat: scene.beat,
            locator: firstLocator(scene),
            place: scene.place ?? null,
            date: scene.date ?? null,
            outcomes: isList(scene.outcomes),
            ...(scene.pov === id || (scene.pov === 'lead' && (id === 'lotm.person.klein-moretti' || /\blead\b/i.test([registryRow?.label, ...isList(registryRow?.aliases)].join(' '))))
                ? {choices: isList(scene.choices), motives: isList(scene.motives)} : {}),
        })));
        const rowValues = field => ordered(extraRows.flatMap(row => isList(row[field])
            .filter(item => inSlice(item?.locator ?? row.locator, from, to))
            .map(item => item && typeof item === 'object'
                ? {...item, label: item.label ?? row.label ?? null, locator: item.locator ?? row.locator ?? null}
                : {value: item, label: row.label ?? null, locator: row.locator ?? null})));
        const whereabouts = ordered(isList(registryRow?.whereabouts)
            .filter(item => inSlice(item.locator, from, to))
            .map(item => ({...item, label: item.label ?? registryRow?.label ?? null, locator: item.locator ?? registryRow?.firstMention ?? null})));
        const routine = rowValues('routine');
        const forward = [], anchorsOtherLoops = [];
        for (const item of isList(registryRow?.whereabouts)) {
            if (!item.locator || !parse(item.locator) || cmpLoc(item.locator, to) <= 0) continue;
            const anchor = {actor: id, place: item.place ?? null, locator: item.locator};
            // MoL's chapter sequence crosses restarts. Only explicitly same-loop
            // rows are forward anchors; absent/other loop evidence stays separate.
            const loop = item.loop ?? item.date?.loop ?? item.cycle ?? item.date?.cycle;
            if (world === 'mol' && loop !== 'same' && loop !== 'first' && loop !== 1 && loop !== '1') anchorsOtherLoops.push({...anchor, loop: loop ?? null});
            else forward.push(anchor);
        }
        const anchors = ordered(forward).slice(0, 3);
        const candidateRows = [
            ...routine.map(row => scheduleRow(id, row, 'routine')),
            ...whereabouts.map(row => scheduleRow(id, row, 'canon')),
        ];
        const sliceLocators = [...entityScenes.map(firstLocator), ...entityLocators].filter(Boolean).sort(cmpLoc);
        worksheets.push({
            id,
            runtimeId: target,
            kind,
            label: registryRow?.label ?? extraRows[0]?.label ?? id,
            tierHint: {present, partial},
            firstLocator: sliceLocators[0] ?? null,
            lastLocator: sliceLocators.at(-1) ?? null,
            scenes: scenesForEntity,
            whereabouts,
            routine,
            relations: rowValues('relations'),
            knows: rowValues('knows'),
            reacts: rowValues('reacts'),
            wants: rowValues('wants'),
            candidateRows: ordered(candidateRows),
            anchors,
            ...(world === 'mol' ? {anchorsOtherLoops: ordered(anchorsOtherLoops)} : {}),
            // Preserve all source fields, including optional schema 1.4 fields, unchanged.
            sourceRows: {registry: registryRow ?? null, extras: extraRows},
        });
    }
    return worksheets.sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
}

export function run(argv) {
    const merged = argv[0];
    const value = key => { const index = argv.indexOf(key); return index < 0 ? null : argv[index + 1]; };
    if (!merged) throw new Error('Expected merged directory');
    const actual = realpathSync(merged);
    const novelsRoot = realpathSync(resolve(fileURLToPath(new URL('../../docs/research/novels/', import.meta.url))));
    const rel = relative(novelsRoot, actual);
    if (rel.startsWith('..') || !rel.split(/[\\/]/).includes('private')) throw new Error('Merged input must be under a novel private directory');
    const crosswalkPath = value('--crosswalk'), world = value('--world'), from = value('--from'), to = value('--to'), outArg = value('--out');
    if (!crosswalkPath || !outArg || !['lotm', 'mol'].includes(world) || !from || !to) throw new Error('Expected --crosswalk <file> --world lotm|mol --from <locator> --to <locator> --out <privateDir>/cast-worksheets/');
    const crosswalk = JSON.parse(readFileSync(crosswalkPath, 'utf8'));
    const worksheets = buildWorksheets({registry: readJsonl(resolve(actual, 'registry.jsonl')), scenes: readJsonl(resolve(actual, 'scenes.jsonl')),
        extras: readJsonl(resolve(actual, 'extras.jsonl')), crosswalk, world, from, to});
    const out = resolve(outArg), outRel = relative(novelsRoot, out);
    if (outRel.startsWith('..') || !outRel.split(/[\\/]/).includes('private')) throw new Error('Output must be under a novel private directory');
    mkdirSync(out, {recursive: true});
    let rows = 0, usable = 0;
    for (const sheet of worksheets) {
        const name = `${sheet.id.replace(/[^a-zA-Z0-9._-]/g, '_')}.json`;
        writeFileSync(resolve(out, name), `${JSON.stringify(sheet, null, 2)}\n`);
        rows += sheet.candidateRows.length;
        usable += sheet.candidateRows.filter(row => row.from != null && row.to != null).length;
        console.log(`${sheet.id}: scenes=${sheet.scenes.length} rows=${sheet.candidateRows.length} timed=${sheet.candidateRows.filter(row => row.from != null && row.to != null).length}`);
    }
    console.log(`TOTAL entities=${worksheets.length} rows=${rows} usable-time=${usable}`);
    return {worksheets, totals: {entities: worksheets.length, rows, usableTime: usable}, out, crosswalk: basename(crosswalkPath)};
}
if (process.argv[1] === fileURLToPath(import.meta.url)) run(process.argv.slice(2));
