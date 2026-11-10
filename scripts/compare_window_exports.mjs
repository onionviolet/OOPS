// Prove a structural window move (AR9, LAYM1): compare every exported window definition
// of two module versions by JSON.stringify, which is what the structured runtime hashes.
// Usage: node scripts/compare_window_exports.mjs <original.js> <moved.js>
// Exit 0 when every window is byte-identical; 1 with the first differing text otherwise.
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const [before, after] = process.argv.slice(2);
if (!before || !after) { console.error('Usage: compare_window_exports.mjs <original.js> <moved.js>'); process.exit(2); }
const load = p => import(pathToFileURL(resolve(p)).href);
const [a, b] = await Promise.all([load(before), load(after)]);
const hash = x => 'sha256:' + createHash('sha256').update(JSON.stringify(x)).digest('hex');
let windows = 0, failed = 0;
for (const [name, value] of Object.entries(a)) {
    if (!value || typeof value !== 'object' || !Array.isArray(value.commands)) continue;
    windows++;
    const x = JSON.stringify(value), y = JSON.stringify(b[name]);
    if (x === y) { console.log(`${name}: ${value.commands.length} commands identical, ${hash(value)}`); continue; }
    failed++;
    let i = 0; while (x[i] === y?.[i]) i++;
    console.log(`${name}: DIFFERENT at character ${i}\n  before: ${x.slice(Math.max(0, i - 100), i + 100)}\n  after:  ${(y ?? 'missing').slice(Math.max(0, i - 100), i + 100)}`);
}
if (!windows) { console.error('No exported window definitions (objects with a commands array) found.'); process.exit(2); }
process.exit(failed ? 1 : 0);
