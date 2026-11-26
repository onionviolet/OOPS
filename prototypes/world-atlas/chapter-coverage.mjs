// Requested chapter summaries use the same exact, public joins as individual output pages.
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
import {readerDirectory} from './library-reading.mjs';
import {bookShards} from '../../scripts/lead_run/make_book_plans.mjs';
import {OUTPUT_KINDS} from './batch-output-index.mjs';
import {createBookOutputReader} from './output-records.mjs';

export const COVERAGE_BYTE_LIMIT = 8 * 1024 * 1024;
export function readChapterCoverage(book, prefix, options = {}) {
    if (typeof prefix !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(prefix)) return null;
    const directory = options.directory ?? readerDirectory(book);
    const names = options.names ?? readdirSync(directory);
    const shards = options.shards ?? bookShards(book, names);
    const reader = createBookOutputReader(book,{...options,directory,names,shards});
    // Each selected output is read once, only for the requested prefix. No partial counts on limit.
    const selected = OUTPUT_KINDS.map(def => reader.selected(prefix,def.pass,def.kind).name).filter(Boolean);
    const cache = new Map(), failures = new Map();
    let bytes = 0;
    const read = options.readFile ?? readFileSync;
    const boundedRead = path => {
        path = resolve(path);
        if (failures.has(path)) throw failures.get(path);
        if (!cache.has(path)) {
            if (bytes + (options.statFile ?? statSync)(path).size > (options.byteLimit ?? COVERAGE_BYTE_LIMIT)) throw Error('coverage-limit');
            const content = read(path);
            bytes += Buffer.byteLength(content);
            if (bytes > (options.byteLimit ?? COVERAGE_BYTE_LIMIT)) throw Error('coverage-limit');
            cache.set(path, content);
        }
        return cache.get(path);
    };
    // Preload only the twelve selected files, so an oversized request cannot yield a partial summary.
    for (const name of options.complete ? [] : selected) {
        const path=resolve(directory,name);
        try {boundedRead(path);}
        catch (error) {
            if (error.message === 'coverage-limit') return {key:book.key, prefix, status:'limit', expected:12};
            failures.set(path,error);
        }
    }
    const outputs = OUTPUT_KINDS.map(def => {
        const page = reader.read({prefix,pass:def.pass,kind:def.kind,size:1},options.complete ? read : boundedRead);
        return {pass:def.pass, kind:def.kind, label:def.label, status:page.status, inspected:page.inspected,
            counts:page.counts, linkedRecords:page.total};
    });
    const counts = Object.fromEntries(Object.keys(outputs[0].counts).map(key => [key, outputs.reduce((n,o) => n + o.counts[key],0)]));
    return {key:book.key, prefix, status:'inspected', measurement:options.complete?'serial-complete':'bounded', expected:OUTPUT_KINDS.length,
        examined:outputs.filter(o=>o.inspected).length, empty:outputs.filter(o=>o.status==='empty').length,
        counts, outputs, note:'Source rows matched to this Atlas snapshot. Withheld rows reveal no private details. These counts do not establish implemented gameplay.'};
}
