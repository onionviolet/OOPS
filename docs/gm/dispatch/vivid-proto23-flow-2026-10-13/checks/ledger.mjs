// READ-ONLY gate. Every "## " heading in the Proto23 reader reports and the two 2026-10-13
// source reports must map to a ledger entry with a valid disposition and real owner/evidence paths.
import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../../../..');
const L = path.join(ROOT, 'docs/gm/dispatch/vivid-proto23-flow-2026-10-13/PROTO23_ABSORPTION_LEDGER.json');
const SOURCES = [...fs.readdirSync(path.join(ROOT, 'docs/research/proto23/readers-2026-10-10')).map(f => 'docs/research/proto23/readers-2026-10-10/' + f),
  'docs/research/proto23/UI_SOURCE_ABSORPTION_2026-10-13.md', 'docs/research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md'];
const DISP = ['adopted', 'adapt-next', 'parked', 'rejected', 'not-applicable'];
let entries; try { entries = JSON.parse(fs.readFileSync(L, 'utf8')); } catch (e) { console.log('FAIL L1_ledger missing or invalid JSON'); process.exit(1); }
const bad = [];
for (const src of SOURCES) for (const h of fs.readFileSync(path.join(ROOT, src), 'utf8').split('\n').filter(l => l.startsWith('## ')).map(l => l.slice(3).trim()))
  if (!entries.some(e => e.source === src && e.heading === h)) bad.push(`unmapped: ${path.basename(src)} :: ${h}`);
for (const e of entries) {
  if (!DISP.includes(e.disposition)) bad.push(`bad disposition ${e.heading}`);
  if (!e.mechanism || e.mechanism.length < 20) bad.push(`thin mechanism ${e.heading}`);
  if (!['not-applicable'].includes(e.disposition) && !(e.owner && fs.existsSync(path.join(ROOT, e.owner.split('#')[0])))) bad.push(`owner path missing ${e.heading}`);
  if (e.disposition === 'adopted' && !(e.evidence && fs.existsSync(path.join(ROOT, e.evidence.split('#')[0])))) bad.push(`adopted without evidence ${e.heading}`);
  if (['parked', 'rejected', 'not-applicable'].includes(e.disposition) && !(e.reason && e.reason.length > 10)) bad.push(`no reason ${e.heading}`);
}
console.log(`${bad.length ? 'FAIL' : 'PASS'} L1_ledger ${bad.length ? bad.length + ' problems: ' + JSON.stringify(bad.slice(0, 8)) : entries.length + ' entries cover all headings'}`);
process.exit(bad.length ? 1 : 0);
