import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, rmSync, writeFileSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {run} from '../scripts/lead_run/world_lead_pipeline.mjs';

const fixtureRoot = resolve('docs/research/novels/test/private');
function fixture() {
    const input = mkdtempSync(join(fixtureRoot, 'pipeline-fixture-'));
    writeFileSync(join(input, 'a1m_header.json'), JSON.stringify({chapters: '1-2', grade: 'B'}));
    const census = [{schema: 'census/1.3', id: 'test.person.ada', label: 'Ada', zh: 'Ada', kind: 'person', rung: 'M1', whereabouts: [], firstMention: 'zh 第1章 p1', touchedByLead: true, aliases: [], claimant: 'narration', note: ''}];
    const scenes = [1, 2].map(ch => ({schema: 'lead-run/1.3', beat: `lr.test.${ch}`, order: ch, pov: 'lead', date: {value: `day-${ch}`}, timeOfDay: {value: 'morning'}, place: null, deps: [], steps: [], touched: [{id: 'test.person.ada', kind: 'person', status: 'present'}], present: ['test.person.ada'], options: [], footprint: null, evidence: [{label: 'S', locator: `zh 第${ch}章 p1`, kind: 'narration'}], outcomes: [{fact: 'routine', value: 'shown'}]}));
    writeFileSync(join(input, 'a1m_census.jsonl'), census.map(JSON.stringify).join('\n') + '\n');
    writeFileSync(join(input, 'a1m_scenes.jsonl'), scenes.map(JSON.stringify).join('\n') + '\n');
    writeFileSync(join(input, 'a1m_fills.jsonl'), '');
    writeFileSync(join(input, 'L1_overlay_reviewed.json'), '{}\n');
    writeFileSync(join(input, 'L1_crosswalk_review.json'), '{}\n');
    return input;
}
const argsFor = (input, out, extra = []) => ['lotm', '--input', input, '--match', '^a1m$', '--from', 'zh 第1章 p1', '--to', 'zh 第2章 p999', '--out', out, ...extra];

test('pipeline runs every stage in order and writes a seven-stage receipt on a synthetic two-chapter fixture', () => {
    mkdirSync(fixtureRoot, {recursive: true});
    const input = fixture(), out = mkdtempSync(join(tmpdir(), 'lead-pipeline-out-'));
    try {
        const report = run(argsFor(input, join(out, 'result')));
        assert.deepEqual(report.stages.map(s => s.stage), ['schema_union', 'merge_shards', 'build_crosswalk', 'cast_worksheet', 'conflict_contracts', 'after_actions', 'fitness_report']);
        const receipt = JSON.parse(readFileSync(join(out, 'result/pipeline_receipt.json'), 'utf8'));
        assert.equal(receipt.stages.length, 7);
        assert.ok(receipt.stages.every(stage => Object.keys(stage.inputs).length && Object.keys(stage.outputs).length));
    } finally { rmSync(input, {recursive: true, force: true}); rmSync(out, {recursive: true, force: true}); }
});

test('pipeline stops at the first failing stage and names it', () => {
    mkdirSync(fixtureRoot, {recursive: true});
    const input = fixture(), out = mkdtempSync(join(tmpdir(), 'lead-pipeline-fail-'));
    try {
        assert.throws(() => run(argsFor(input, join(out, 'result'), ['--overlay', join(input, 'missing-overlay.json')])), /Stage merge_shards failed/);
    } finally { rmSync(input, {recursive: true, force: true}); rmSync(out, {recursive: true, force: true}); }
});
