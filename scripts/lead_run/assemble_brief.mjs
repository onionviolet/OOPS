// Assembles one reader brief per shard (protocol v2): the public template, the schema card, the glossary entries
// whose names occur in this shard, and the deterministic candidates. The reader reads this file and the shard in
// one call. Output goes to the private folder given. Usage:
//   node scripts/lead_run/assemble_brief.mjs <template.md> <schema.md> <shard.txt> <out.md> --wiki <wiki.json>
//       --census <dir> --prefix s7v --base 701
import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {parseShard} from './lint_lead_run.mjs';
import {extractCandidates, buildGlossary, glossaryHits} from './shard_tools.mjs';

const args = process.argv.slice(2);
const flag = name => { const i = args.indexOf(name); return i >= 0 ? args.splice(i, 2)[1] : null; };
const wiki = flag('--wiki'), censusDir = flag('--census'), prefix = flag('--prefix'), base = flag('--base');
// Only graded shards feed the glossary (PL-A47), so a wrong row in an ungraded or grade-C shard does not propagate.
const censusMatch = new RegExp(flag('--census-match') || '_census\\.jsonl$');
const [templatePath, schemaPath, shardPath, outPath] = args;
if (!templatePath || !schemaPath || !shardPath || !outPath || !prefix || !base) {
    console.error('usage: assemble_brief.mjs <template> <schema> <shard> <out> --prefix p --base n [--wiki f] [--census dir]');
    process.exit(2);
}
const shardText = readFileSync(shardPath, 'utf8');
const censusRows = censusDir ? readdirSync(censusDir).filter(f => /_census\.jsonl$/.test(f) && censusMatch.test(f) && !f.startsWith('sample'))
    .flatMap(f => readFileSync(join(censusDir, f), 'utf8').split('\n').filter(l => l.trim()).map(l => JSON.parse(l))) : [];
const glossary = buildGlossary({wikiPages: wiki ? JSON.parse(readFileSync(wiki, 'utf8')).pages : [], censusRows});
const hits = glossaryHits(glossary, shardText);
const candidates = extractCandidates(parseShard(shardText));
const brief = [
    readFileSync(templatePath, 'utf8').replaceAll('{{PREFIX}}', prefix).replaceAll('{{BASE}}', base).replaceAll('{{SHARD}}', resolve(shardPath)).replaceAll('{{BRIEF}}', resolve(outPath)),
    '\n\n# Schema card\n\n', readFileSync(schemaPath, 'utf8'),
    '\n\n# Known names in this shard (reuse these ids and labels)\n\n| zh | id | label | kind | source |\n| --- | --- | --- | --- | --- |\n',
    hits.map(h => `| ${h.zh} | ${h.id || ''} | ${h.label} | ${h.kind || ''} | ${h.source} |`).join('\n'),
    '\n\n# Candidates found by script (label each: keep as a census row, attach to a scene, or skip with a reason)\n\n| kind | value | locator |\n| --- | --- | --- |\n',
    candidates.map(c => `| ${c.kind} | ${c.value} | ${c.locator} |`).join('\n'), '\n'].join('');
writeFileSync(outPath, brief);
console.log(JSON.stringify({out: outPath, glossaryHits: hits.length, candidates: candidates.length, chars: brief.length}));
