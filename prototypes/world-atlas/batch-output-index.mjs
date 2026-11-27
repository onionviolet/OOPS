// Development-only metadata inventory. Never return source text, row content or private paths.
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
import {readerDirectory} from './library-reading.mjs';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {EXTRA_PASSES, extraFile} from '../../scripts/lead_run/batch_lib.mjs';
import {legacyReaderSlices,orphanReaderSlices,ownsRegistryOutputName} from './reader-slices.mjs';

export const STANDARD_PASSES = Object.freeze(['census', 'scenes', ...Object.keys(EXTRA_PASSES)]);
export const SUPPORTED_PASSES = Object.freeze([...STANDARD_PASSES, 'full']);
const labels = {census: 'Census', scenes: 'Scenes', fills: 'Authored fills', rules: 'Rules', people: 'People', places: 'Places', services: 'Services and prices', news: 'News', customs: 'Customs', other: 'Other observations'};
export const OUTPUT_KINDS = Object.freeze(STANDARD_PASSES.flatMap(pass =>
    (pass === 'census' ? ['census'] : pass === 'scenes' ? ['scenes', 'fills'] : EXTRA_PASSES[pass])
        .map(kind => Object.freeze({pass, kind, label: labels[kind], standard: true}))));
const isMigrated = pass => pass === 'census' || pass === 'scenes';
const stem = (prefix, pass, kind, migrated) => isMigrated(pass)
    ? `${prefix}${migrated ? 'm' : ''}_${kind}.jsonl` : `${prefix}_${extraFile(pass, kind)}.jsonl`;
const marked = (files, prefix, pass) => files.has(`${prefix}_${pass}.partial`)
    || (isMigrated(pass) && files.has(`${prefix}_full.partial`));

/** Same canonical preference as reading_review: clean plain prefix, then clean Luna.
 * Keep salvaged and unmigrated output visible, with its qualification, when no clean file exists. */
export function selectCollectedOutput(files, prefix, pass, kind) {
    const lanes = [prefix, `${prefix}L`];
    for (const partial of [false, true]) for (const p of lanes) {
        const name = stem(p, pass, kind, true);
        if (files.has(name) && marked(files, p, pass) === partial)
            return {name, partial, migrated: true, source: p === prefix ? 'canonical' : 'luna'};
    }
    if (isMigrated(pass)) for (const p of lanes) {
        const name = stem(p, pass, kind, false);
        if (files.has(name)) return {name, partial: true, migrated: false, source: 'unmigrated'};
    }
    return {name: null, partial: lanes.some(p => marked(files, p, pass)), migrated: false, source: null};
}

const emptyCounts = () => ({files: 0, rows: 0, parseFailures: 0, readFailures: 0, missing: 0, partial: 0, empty: 0, invalid: 0, collected: 0});
function addCounts(target, output) {
    target.files += Number(output.collected);
    target.rows += output.rows;
    target.parseFailures += output.parseFailures;
    target.readFailures += output.readFailures;
    target[output.status]++;
}

/** Read a book on demand. Each selected file is read at most once per call.
 * `full` batches produce the same census/scenes/fills files, so are not a second denominator.
 * Completion requires every contracted output file, including empty arrays written as empty JSONL.
 * This inventory establishes file/row availability, not semantic quality or source truth. */
export function readBatchOutputs(book, options = {}) {
    const directory = options.directory ?? readerDirectory(book);
    const names = options.names ?? (existsSync(directory) ? readdirSync(directory) : []);
    const files = new Set(names);
    const shards = options.shards ?? bookShards(book, names);
    const readFile = options.readFile ?? (path => readFileSync(path, 'utf8'));
    const cache = new Map(), accounted = new Set();
    const totals = emptyCounts();
    const outputs = OUTPUT_KINDS.map(def => ({...def, ...emptyCounts()}));
    const project = (items, totals, outputs, scope,observedOnly=false) => items.map(shard => ({prefix: shard.prefix, chapters: shard.chapters, scope,
        ...(shard.family?{family:shard.family,grade:shard.grade,gradingStatus:shard.gradingStatus,admitted:shard.admitted,ownership:shard.ownership,...(shard.aliases?{aliases:shard.aliases}:{})}:{}),
        passes: STANDARD_PASSES.map(pass => {
            const passOutputs = OUTPUT_KINDS.filter(def => def.pass === pass).map(def => {
                const selected = selectCollectedOutput(files, shard.prefix, pass, def.kind);
                // All alternatives belong to this shard, though only one is counted.
                for (const p of [shard.prefix, `${shard.prefix}L`]) for (const migrated of [true, false])
                    accounted.add(stem(p, pass, def.kind, migrated));
                if((observedOnly||shard.family==='graded-stage')&&!selected.name)return null;
                if (selected.name && !cache.has(selected.name)) {
                    const counts = {rows: 0, parseFailures: 0, readFailures: 0};
                    try {
                        for (const line of String(readFile(join(directory, selected.name))).split(/\r?\n/)) {
                            if (!line.trim()) continue;
                            try {
                                const value = JSON.parse(line);
                                if (!value || typeof value !== 'object' || Array.isArray(value)) counts.parseFailures++;
                                else counts.rows++;
                            } catch {counts.parseFailures++;}
                        }
                    } catch {counts.readFailures++;}
                    cache.set(selected.name, counts);
                }
                const counts = cache.get(selected.name) ?? {rows: 0, parseFailures: 0, readFailures: 0};
                const status = selected.partial ? 'partial' : !selected.name ? 'missing'
                    : counts.parseFailures || counts.readFailures ? 'invalid' : counts.rows ? 'collected' : 'empty';
                const result = {kind: def.kind, label: def.label, status, collected: Boolean(selected.name),
                    ...counts, source: selected.source};
                addCounts(totals, result);
                addCounts(outputs.find(row => row.pass === pass && row.kind === def.kind), result);
                return result;
            }).filter(Boolean);
            return {pass, complete:observedOnly||shard.family==='graded-stage'?null:passOutputs.every(o => ['collected', 'empty'].includes(o.status)), outputs: passOutputs};
        }).filter(pass=>!(observedOnly||shard.family==='graded-stage')||pass.outputs.length)}));
    const rows = project(shards, totals, outputs, 'registry');
    const legacySelection = options.registry ? legacyReaderSlices(book, options.registry, names)
        : {slices: [], ownerKey: null, ownerWorld: null, ambiguousWorlds: []};
    const legacyTotals = emptyCounts(), legacyOutputs = OUTPUT_KINDS.map(def => ({...def, ...emptyCounts()}));
    const legacy = {shards: project(legacySelection.slices.filter(slice => !shards.some(shard => shard.prefix === slice.prefix)), legacyTotals, legacyOutputs, 'legacy'),
        totals: legacyTotals, outputs: legacyOutputs,residuals:legacySelection.residuals||[]};
    const orphanTotals=emptyCounts(),orphanOutputs=OUTPUT_KINDS.map(def=>({...def,...emptyCounts()}));
    const orphans={shards:project(orphanReaderSlices(book,options.registry||[book],names,shards),orphanTotals,orphanOutputs,'orphan',true),
        totals:orphanTotals,outputs:orphanOutputs};
    const suffixes = OUTPUT_KINDS.map(({pass, kind}) => `_${isMigrated(pass) ? kind : extraFile(pass, kind)}.jsonl`);
    const unindexedFiles = names.filter(name => ownsRegistryOutputName(book,name) && suffixes.some(suffix => name.endsWith(suffix)) && !accounted.has(name)).length;
    return {key: book.key, standardPasses: STANDARD_PASSES, supportedPasses: SUPPORTED_PASSES,
        outputKinds: OUTPUT_KINDS, totals, outputs, shards: rows, legacy,orphans,
        coverage: {scope: 'registry-prepared-shards', shards: shards.length, unindexedFiles,
            legacySlices: legacy.shards.length,orphanSlices:orphans.shards.length, legacyOwnerKey: legacySelection.ownerKey, legacyOwnerWorld: legacySelection.ownerWorld,
            ambiguousWorlds: legacySelection.ambiguousWorlds,
            note: 'Registry totals and missing-output counts cover prepared registry shards. Orphan totals count selected observed output files with exact registry chapter stems; absent shard text leaves chapter range coverage unknown, and missing sibling outputs are not a planned denominator. Legacy slice totals remain separate observed historic slices. A missing legacy output means no file was found, not that this pass was planned. Full batches share census, scenes and fills outputs. Availability does not establish source accuracy.'}};
}
