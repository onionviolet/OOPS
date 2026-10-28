// P1: sequence the existing lead-run stages and write a hash receipt.
import {createHash} from 'node:crypto';
import {cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {basename, dirname, join, relative, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {worldProfile} from './world_profiles.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const NOVELS = resolve(ROOT, 'docs/research/novels');
const digest = data => createHash('sha256').update(data).digest('hex');
const hashPath = p => statSync(p).isDirectory()
    ? digest(filesUnder(p).map(file => `${relative(p, file)}\0${digest(readFileSync(file))}`).join('\n'))
    : digest(readFileSync(p));
const filesUnder = p => {
    if (!existsSync(p)) return [];
    if (!statSync(p).isDirectory()) return [p];
    return readdirSync(p).sort().flatMap(name => filesUnder(join(p, name)));
};
const hashesUnder = p => Object.fromEntries(filesUnder(p).map(file => [relative(p, file), hashPath(file)]));

function parseArgs(args) {
    const [book, ...rest] = args;
    if (!book) throw new Error('usage: world_lead_pipeline.mjs <book> --from <locator> --to <locator> [--out <dir>] [--input <privateDir>] [--match <regex>] [--overlay <file>] [--review <file>]');
    const value = key => { const i = rest.indexOf(key); return i < 0 ? null : rest[i + 1]; };
    const from = value('--from'), to = value('--to');
    if (!from || !to) throw new Error('Expected --from and --to locators');
    return {book, from, to, out: value('--out'), input: value('--input'), match: value('--match'), overlay: value('--overlay'), review: value('--review')};
}

function locateInput(book, explicit) {
    if (explicit) return resolve(explicit);
    const profile = worldProfile(book);
    const slug = profile.name.toLowerCase().replace(/\b(?:the|a|an)\b/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const novel = join(NOVELS, slug, 'private');
    if (!existsSync(novel)) throw new Error(`No private research folder found for profile ${book} (${slug}); pass --input`);
    const candidates = readdirSync(novel).filter(name => name.startsWith('lead-run-')).sort().reverse()
        .map(name => join(novel, name)).filter(dir => existsSync(join(dir, 'L1_overlay_reviewed.json')));
    if (!candidates.length) throw new Error(`No reviewed lead-run input found for ${book}; pass --input`);
    return candidates[0];
}

function runStage(stage, command, args, inputs, outputs) {
    const started = performance.now();
    const result = spawnSync(command, args, {cwd: ROOT, encoding: 'utf8'});
    const seconds = Number(((performance.now() - started) / 1000).toFixed(3));
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error || result.status !== 0) {
        const detail = result.error?.message || `exit ${result.status}${result.signal ? ` (${result.signal})` : ''}`;
        throw new Error(`Stage ${stage} failed: ${detail}`);
    }
    return {stage, command: [command, ...args], inputs: Object.fromEntries(inputs.filter(existsSync).map(p => [relative(ROOT, p), hashPath(p)])), outputs: Object.fromEntries(outputs.filter(existsSync).map(p => [relative(ROOT, p), hashPath(p)])), seconds};
}

export function run(argv) {
    const options = parseArgs(argv);
    const profile = worldProfile(options.book);
    if (!['lotm', 'mol'].includes(options.book)) throw new Error(`No lead-run world option is available for ${options.book}`);
    const input = locateInput(options.book, options.input);
    if (!existsSync(input)) throw new Error(`Input directory does not exist: ${input}`);
    const rootRel = relative(NOVELS, input);
    if (rootRel.startsWith('..') || !rootRel.split(/[\\/]/).includes('private')) throw new Error('Input must be under a novel private directory');
    const overlay = resolve(options.overlay || join(input, 'L1_overlay_reviewed.json'));
    const mergedBaseline = readdirSync(input).filter(n => n.startsWith('merged-cast-')).sort().reverse().map(n => join(input, n)).find(p => existsSync(join(p, 'scenes.jsonl')));
    let match = options.match;
    if (!match && mergedBaseline) {
        const shards = new Set(['registry.jsonl', 'scenes.jsonl', 'fills.jsonl', 'extras.jsonl'].flatMap(n => readFileSync(join(mergedBaseline, n), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line).shard).filter(Boolean)));
        if (shards.size) match = `^(?:${[...shards].sort().map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})$`;
    }
    const review = resolve(options.review || join(input, 'L1_crosswalk_review.json'));
    const output = resolve(options.out || join(input, `pipeline-${Date.now()}`));
    const outputRel = relative(NOVELS, output);
    if (!outputRel.startsWith('..') && outputRel.split(/[\\/]/).includes('private')) throw new Error('--out must be outside the private source tree');
    const scratch = mkdtempSync(join(input, '.world-lead-pipeline-'));
    const merged = join(scratch, 'merged');
    const worksheets = join(scratch, 'cast-worksheets');
    const report = {schema: 'world-lead-pipeline/1.0', book: options.book, world: profile.world, slice: {from: options.from, to: options.to}, input: relative(ROOT, input), output, stages: []};
    try {
        const mergeScript = join(ROOT, 'scripts/lead_run/merge_shards.mjs');
        const mergeArgs = [mergeScript, input, '--out', merged, '--overlay', overlay];
        if (match) mergeArgs.push('--match', match);
        const mergeOutputs = ['registry.jsonl', 'scenes.jsonl', 'fills.jsonl', 'extras.jsonl', 'affordance.json', 'overlay_proposed.json', 'merge_report.json'].map(n => join(merged, n));
        const sourceInputs = filesUnder(input).filter(p => /_m_(?:header\.json|census\.jsonl|scenes\.jsonl|fills\.jsonl)$/.test(p) || /_(?:rules|people|places|services|news|customs|rules_other|people_other|texture_other)\.jsonl$/.test(p));
        report.stages.push(runStage('merge_shards', process.execPath, mergeArgs, [mergeScript, overlay, ...sourceInputs], mergeOutputs));

        const crossScript = join(ROOT, 'scripts/lead_run/build_crosswalk.mjs');
        const crossArgs = [crossScript, merged, '--world', options.book, '--from', options.from, '--to', options.to, '--report'];
        if (existsSync(review)) crossArgs.push('--review', review);
        report.stages.push(runStage('build_crosswalk', process.execPath, crossArgs, [crossScript, ...mergeOutputs, ...(existsSync(review) ? [review] : [])], [join(merged, 'crosswalk.json'), join(merged, 'consumer_fitness.json')]));

        const crosswalk = join(merged, 'crosswalk.json');
        const worksheetScript = join(ROOT, 'scripts/lead_run/cast_worksheet.mjs');
        const worksheetArgs = [worksheetScript, merged, '--crosswalk', crosswalk, '--world', options.book, '--from', options.from, '--to', options.to, '--out', worksheets];
        report.stages.push(runStage('cast_worksheet', process.execPath, worksheetArgs, [worksheetScript, ...mergeOutputs, crosswalk], [worksheets]));

        const contractScript = join(ROOT, 'scripts/lead_run/conflict_contracts.mjs');
        const contracts = join(merged, 'conflict_contracts.jsonl');
        report.stages.push(runStage('conflict_contracts', process.execPath, [contractScript, merged, contracts, '--from', options.from, '--to', options.to], [contractScript, join(merged, 'scenes.jsonl')], [contracts]));
        const afterScript = join(ROOT, 'scripts/lead_run/after_actions.mjs');
        const after = join(merged, 'after_actions.jsonl');
        report.stages.push(runStage('after_actions', process.execPath, [afterScript, options.book, merged, after], [afterScript, join(merged, 'scenes.jsonl'), join(merged, 'extras.jsonl')], [after]));
        const fitness = join(merged, 'consumer_fitness.json');
        report.stages.push({stage: 'fitness_report', command: ['read generated consumer_fitness.json'], inputs: {[relative(ROOT, fitness)]: hashPath(fitness)}, outputs: {[relative(ROOT, fitness)]: hashPath(fitness)}, seconds: 0});

        mkdirSync(output, {recursive: true});
        cpSync(merged, join(output, 'merged'), {recursive: true});
        cpSync(worksheets, join(output, 'cast-worksheets'), {recursive: true});
        report.outputs = hashesUnder(output);
        writeFileSync(join(output, 'pipeline_receipt.json'), `${JSON.stringify(report, null, 2)}\n`);
        console.log(`pipeline complete: ${options.book}; stages=${report.stages.length}; output=${output}`);
        return report;
    } catch (error) {
        if (error.message.startsWith('Stage ')) throw error;
        throw error;
    } finally {
        rmSync(scratch, {recursive: true, force: true});
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try { run(process.argv.slice(2)); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
}
