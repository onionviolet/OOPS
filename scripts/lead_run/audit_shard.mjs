// CLI for the shard audit gate (WA30, WA31). Writes `<prefix>_header.json` (shard-header/1.3) beside the shard
// files and prints the audit summary. Usage:
//   node scripts/lead_run/audit_shard.mjs <dir> <prefix> <shard.txt> --model haiku --chapters 16-18 [--spot-checked 5]
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {parseShard} from './lint_lead_run.mjs';
import {auditShard} from './shard_tools.mjs';

const args = process.argv.slice(2);
const flag = (name, dflt = null) => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : dflt; };
const model = flag('--model', 'unknown'), chapters = flag('--chapters', 'unknown'), spot = Number(flag('--spot-checked', '0'));
const [dir, prefix, shardPath] = args;
if (!dir || !prefix || !shardPath) {
    console.error('usage: node scripts/lead_run/audit_shard.mjs <dir> <prefix> <shard.txt> [--model m] [--chapters a-b] [--spot-checked n]');
    process.exit(2);
}
const jsonl = p => existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l)) : [];
const shardText = readFileSync(shardPath, 'utf8');
const result = auditShard({scenes: jsonl(join(dir, `${prefix}_scenes.jsonl`)), census: jsonl(join(dir, `${prefix}_census.jsonl`)),
    fills: jsonl(join(dir, `${prefix}_fills.jsonl`)), shardMap: parseShard(shardText), spotChecked: spot});
const header = {schema: 'shard-header/1.3', shard: prefix, readerModel: model, chapters,
    sourceHash: createHash('sha256').update(shardText).digest('hex').slice(0, 16), date: new Date().toISOString().slice(0, 10),
    lint: result.lintOk ? 'pass' : 'fail', grade: result.grade, locatorValid: result.locatorValid,
    nameAccuracy: Number(result.nameAccuracy.toFixed(3)), spotChecked: spot, counts: result.counts};
writeFileSync(join(dir, `${prefix}_header.json`), JSON.stringify(header, null, 1) + '\n');
console.log(JSON.stringify({...header, issues: result.issues}, null, 1));
process.exit(result.grade === 'C' ? 1 : 0);
