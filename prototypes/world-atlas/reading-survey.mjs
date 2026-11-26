import {readFileSync} from 'node:fs';
import {readinessPath} from './reading-readiness.mjs';
import {OUTPUT_KINDS} from './batch-output-index.mjs';

const columns = ['parsedRows','matchedRows','withheldRows','unindexedRows','missing','unattested'];

// Read the saved measurements only. World → Reading checks live input freshness.
export function savedReadingSurvey(registry,snapshot) {
    const worlds = [...new Set(registry.map(book => book.world))].sort();
    return worlds.map(world => {
        try {
            const report = JSON.parse(readFileSync(readinessPath(snapshot,world),'utf8'));
            if (report.schema !== 'atlas-reading-readiness/1' || report.world !== world ||
                report.scope !== 'world' || !Number.isFinite(Date.parse(report.measuredAt))) throw Error();
            const totals = Object.fromEntries(columns.map(key => [key,0]));
            for (const {pass,kind} of OUTPUT_KINDS) {
                const rows = report.outputs.filter(row => row.pass === pass && row.kind === kind);
                if (rows.length !== 1) throw Error();
                for (const key of columns) {
                    const n = rows[0][key];
                    if (!Number.isSafeInteger(n) || n < 0 || !Number.isSafeInteger(totals[key]+n)) throw Error();
                    totals[key] += n;
                }
            }
            let prefixes=0;
            for (const book of report.books) {
                if (!Number.isSafeInteger(book.prefixes) || book.prefixes<0) throw Error();
                prefixes+=book.prefixes;
            }
            return {world,measuredAt:new Date(report.measuredAt).toISOString(),prefixes,totals};
        } catch (error) {
            return {world,status:error.code === 'ENOENT' ? 'missing' : 'unavailable'};
        }
    });
}
