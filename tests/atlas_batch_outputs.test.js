import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, writeFileSync, unlinkSync, rmdirSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {EXTRA_PASSES} from '../scripts/lead_run/batch_lib.mjs';
import {readBatchOutputs, OUTPUT_KINDS, selectCollectedOutput} from '../prototypes/world-atlas/batch-output-index.mjs';
import {legacyReaderSlices,orphanReaderSlices,ownsRegistryOutputName} from '../prototypes/world-atlas/reader-slices.mjs';
import {readFindings} from '../prototypes/world-atlas/reader-findings.mjs';

function fixture(t, content) {
    const directory = mkdtempSync(join(tmpdir(), 'atlas-batch-index-'));
    for (const [name, text] of Object.entries(content)) writeFileSync(join(directory, name), text);
    t.after(() => {for (const name of Object.keys(content)) unlinkSync(join(directory, name)); rmdirSync(directory);});
    return {directory, names: Object.keys(content), shards: [{prefix: 'xc001', chapters: '1-2'}]};
}
const get = (inventory, pass, kind) => inventory.shards[0].passes.find(p => p.pass === pass).outputs.find(o => o.kind === kind);
const header=(prefix,grade='B',chapters='1-3')=>JSON.stringify({schema:'shard-header/1.3',shard:prefix,readerModel:'fixture',sourceHash:'0123456789abcdef',
    date:'2026-11-25',lint:'pass',grade,chapters});

test('output contract includes all extra-pass arrays, distinct other files and scenes fills', () => {
    for (const [pass, keys] of Object.entries(EXTRA_PASSES))
        assert.deepEqual(OUTPUT_KINDS.filter(o => o.pass === pass).map(o => o.kind), keys);
    assert.deepEqual(OUTPUT_KINDS.filter(o => o.pass === 'scenes').map(o => o.kind), ['scenes', 'fills']);
    const files = new Set(['xc001_rules_other.jsonl', 'xc001_people_other.jsonl']);
    assert.equal(selectCollectedOutput(files, 'xc001', 'rules', 'other').name, 'xc001_rules_other.jsonl');
    assert.equal(selectCollectedOutput(files, 'xc001', 'people', 'other').name, 'xc001_people_other.jsonl');
});

test('missing, empty, salvaged partial and malformed rows remain distinguishable and private', t => {
    const options = fixture(t, {
        'xc001m_census.jsonl': '{"id":"PRIVATE SOURCE"}\n{bad\nnull\n[]\n',
        'xc001m_scenes.jsonl': '',
        'xc001_rules.jsonl': '{"id":"x.rule.a"}\n',
        'xc001_rules.partial': 'private marker',
        'xc001_people_other.jsonl': '',
    });
    const inventory = readBatchOutputs({key: 'x'}, options);
    assert.equal(get(inventory, 'census', 'census').status, 'invalid');
    assert.equal(get(inventory, 'census', 'census').rows, 1);
    assert.equal(get(inventory, 'census', 'census').parseFailures, 3);
    assert.equal(get(inventory, 'scenes', 'scenes').status, 'empty');
    assert.equal(get(inventory, 'scenes', 'fills').status, 'missing');
    assert.equal(get(inventory, 'rules', 'rules').status, 'partial');
    assert.equal(get(inventory, 'rules', 'other').status, 'partial');
    assert.equal(get(inventory, 'rules', 'other').collected, false);
    assert.equal(inventory.totals.rows, 2);
    assert.equal(inventory.totals.files, 4);
    assert.doesNotMatch(JSON.stringify(inventory), /PRIVATE SOURCE|private marker|xc001m_census\.jsonl|atlas-batch-index/);
});

test('clean Luna wins over partial canonical, canonical wins when both are clean, no duplicate rows', t => {
    const options = fixture(t, {
        'xc001m_census.jsonl': '{"id":"cut-off"}\n', 'xc001_census.partial': '',
        'xc001Lm_census.jsonl': '{"id":"complete"}\n{"id":"second"}\n',
        'xc001m_scenes.jsonl': '{"id":"canonical"}\n',
        'xc001Lm_scenes.jsonl': '{"id":"duplicate"}\n',
        'xc001m_fills.jsonl': '',
    });
    let reads = 0;
    const inventory = readBatchOutputs({key: 'x'}, {...options, readFile: path => {reads++; return readFileSync(path, 'utf8');}});
    assert.equal(get(inventory, 'census', 'census').source, 'luna');
    assert.equal(get(inventory, 'scenes', 'scenes').source, 'canonical');
    assert.equal(inventory.totals.rows, 3);
    assert.equal(reads, 3);
    assert.equal(inventory.shards[0].passes.find(p => p.pass === 'scenes').complete, true);
});

test('full and unmigrated files are qualified; historic unindexed output is reported', t => {
    const options = fixture(t, {
        'xc001m_census.jsonl': '{}\n', 'xc001_full.partial': '',
        'xc001_scenes.jsonl': '{}\n', 'xc001_fills.jsonl': '',
        'xhistoricm_scenes.jsonl': '{}\n', 'xc009x2m_scenes.jsonl':'{}\n',
    });
    const inventory = readBatchOutputs({key: 'x'}, options);
    assert.equal(get(inventory, 'census', 'census').status, 'partial');
    assert.equal(get(inventory, 'scenes', 'scenes').source, 'unmigrated');
    assert.equal(get(inventory, 'scenes', 'fills').status, 'partial');
    assert.equal(inventory.coverage.unindexedFiles, 1);
    assert.equal(inventory.supportedPasses.includes('full'), true);
    assert.equal(inventory.shards[0].passes.some(p => p.pass === 'full'), false);
});

test('unreadable file errors are counted without leaking error messages', t => {
    const options = fixture(t, {'xc001m_census.jsonl': '{}\n'});
    const inventory = readBatchOutputs({key: 'x'}, {...options, readFile: () => {throw new Error('SECRET PATH');}});
    assert.equal(get(inventory, 'census', 'census').status, 'invalid');
    assert.equal(inventory.totals.readFailures, 1);
    assert.doesNotMatch(JSON.stringify(inventory), /SECRET PATH/);
});

test('historic slice aliases and trials use the digest selection, with separate registry totals', t => {
    const options = fixture(t, {'xc001m_census.jsonl': '{}\n',
        'b4s42m_census.jsonl': '{}\n', 'c4s42m_census.jsonl': '{}\n{}\n', 'b4s42m_scenes.jsonl': '{}\n',
        'b4s42_rules.jsonl': '{}\n', 'w6s3m_census.jsonl': '{}\n', 'b4s42x2m_census.jsonl': '{}\n'});
    const book = {key: 'x', world: 'w', dir: pathToFileURL(options.directory).href};
    const registry = [book, {...book, key: 'y'}];
    const inventory = readBatchOutputs(book, {...options, registry});
    assert.equal(inventory.totals.files, 1);
    assert.equal(inventory.totals.rows, 1);
    assert.equal(inventory.totals.missing, OUTPUT_KINDS.length - 1);
    assert.deepEqual(inventory.legacy.shards.map(s => s.prefix), ['b4s42', 'w6s3']);
    assert.deepEqual(inventory.legacy.shards.map(s => s.prefix), legacyReaderSlices(book, registry, options.names).slices.map(s => s.prefix));
    assert.equal(inventory.legacy.totals.files, 4);
    assert.equal(inventory.legacy.totals.rows, 4);
    assert.equal(inventory.legacy.totals.missing, 2 * OUTPUT_KINDS.length - 4);
    assert.ok(inventory.legacy.shards.every(s => s.scope === 'legacy' && s.chapters === null));
    const other = readBatchOutputs(registry[1], {...options, shards: [], registry});
    assert.equal(other.legacy.shards.length, 0);
    assert.equal(other.legacy.totals.rows, 0);
    assert.equal(other.coverage.legacyOwnerKey, 'x');
});

test('mixed-world legacy directories preserve first-entry ownership and expose ambiguity', t => {
    const options = fixture(t, {'b4s42m_census.jsonl': '{}\n'});
    const book = {key: 'x', world: 'first', dir: pathToFileURL(options.directory).href};
    const registry = [book, {...book, key: 'y', world: 'second'}];
    const first = readBatchOutputs(book, {...options, shards: [], registry});
    const second = readBatchOutputs(registry[1], {...options, shards: [], registry});
    assert.equal(first.legacy.shards.length, 1);
    assert.equal(second.legacy.shards.length, 0);
    assert.deepEqual(first.coverage.ambiguousWorlds, ['first', 'second']);
    assert.deepEqual(second.coverage.ambiguousWorlds, ['first', 'second']);
    assert.equal(second.coverage.legacyOwnerWorld, 'first');
});

test('exact registry orphan stems stay separate from prepared totals and do not borrow neighbouring book keys',t=>{
    const options=fixture(t,{'hp1c002m_census.jsonl':'{"id":"PRIVATE ROW"}\n',
        'hp1c002Lm_census.jsonl':'{}\n{}\n','hp1c002_rules.jsonl':'{}\n','hp1c002_rules.partial':'PRIVATE MARKER',
        'hp10c002m_census.jsonl':'{}\n','hp1c002x2m_census.jsonl':'{}\n','hp1c0002m_scenes.jsonl':'{}\n',
        'hp1historicm_census.jsonl':'{}\n','hp1c003_scenes.jsonl':'{}\n'});
    const book={key:'hp1',world:'one',dir:pathToFileURL(options.directory).href},registry=[book,{...book,key:'hp10',world:'ten'}];
    const inventory=readBatchOutputs(book,{...options,shards:[],registry});
    assert.equal(inventory.totals.files,0);assert.equal(inventory.totals.missing,0);
    assert.deepEqual(inventory.orphans.shards.map(s=>s.prefix),['hp1c002','hp1c003']);
    assert.equal(inventory.orphans.totals.files,3);assert.equal(inventory.orphans.totals.rows,3);
    assert.equal(inventory.orphans.totals.missing,0);assert.equal(inventory.orphans.totals.partial,2);
    assert.equal(inventory.orphans.shards[0].passes.find(p=>p.pass==='census').outputs[0].source,'canonical');
    assert.ok(inventory.orphans.shards.every(s=>s.chapters===null&&s.scope==='orphan'&&s.passes.every(p=>p.complete===null)));
    assert.equal(ownsRegistryOutputName(book,'hp10c002m_census.jsonl'),false);
    assert.equal(orphanReaderSlices(book,registry,options.names,[{prefix:'hp1c002'}]).length,1);
    assert.deepEqual(orphanReaderSlices(book,[book,book],options.names,[]),[],'ambiguous exact registry entries do not grant ownership');
    assert.doesNotMatch(JSON.stringify(inventory),/PRIVATE ROW|PRIVATE MARKER|atlas-batch-index|m_census\.jsonl/);
});

test('orphan partial selection prefers clean Luna and full markers qualify both census and scenes',t=>{
    const options=fixture(t,{'hp1c009m_census.jsonl':'{}\n','hp1c009_full.partial':'',
        'hp1c009Lm_census.jsonl':'{}\n{}\n','hp1c009m_scenes.jsonl':'{}\n',
        'hp1c009m_fills.jsonl':'','hp1c009Lm_fills.jsonl':''});
    const book={key:'hp1',world:'w',dir:pathToFileURL(options.directory).href};
    const inventory=readBatchOutputs(book,{...options,shards:[],registry:[book]});
    const pass=inventory.orphans.shards[0].passes;
    assert.equal(pass.find(p=>p.pass==='census').outputs[0].source,'luna');
    assert.equal(pass.find(p=>p.pass==='census').outputs[0].rows,2);
    assert.equal(pass.find(p=>p.pass==='scenes').outputs.find(o=>o.kind==='scenes').status,'partial');
    assert.equal(pass.find(p=>p.pass==='scenes').outputs.find(o=>o.kind==='fills').source,'luna');
});

test('the digest admits exact clean orphan inputs without increasing prepared or legacy denominators',t=>{
    const content={
        'registry.json':'{}','shard_hp1_ch001-001.txt':'PRIVATE SOURCE',
        'hp1c001m_census.jsonl':'{"id":"one.item.prepared","kind":"item","label":"Prepared item"}\n',
        'hp1c002m_census.jsonl':JSON.stringify({id:'one.item.orphan',kind:'item',label:'Observed orphan',note:'PRIVATE NOTE'})+'\n'+JSON.stringify({id:'one.item.secret',kind:'item',label:'SEALED LABEL',sealed:['hidden']})+'\n',
        'hp1c003_rules.jsonl':'{"id":"one.rule.partial","kind":"custom","name":"PARTIAL LABEL"}\n','hp1c003_rules.partial':'',
        'hp1c004_scenes.jsonl':'{"beat":"one.scene.unmigrated","place":"one.place.room"}\n',
        'hp1c005m_census.jsonl':'{"id":"one.item.invalid","kind":"item","label":"INVALID FILE LABEL"}\n{bad\n',
        'hp1c006_rules.jsonl':'null\n',
        'hp10c002m_census.jsonl':'{"id":"ten.item.other","kind":"item","label":"Other book"}\n'};
    const options=fixture(t,content),book={key:'hp1',world:'one',dir:pathToFileURL(options.directory).href};
    const registryFile=join(options.directory,'registry.json');
    writeFileSync(registryFile,JSON.stringify({books:[book,{...book,key:'hp10',world:'ten'}]}));
    const digest=readFindings({registry:registryFile}).find(d=>d.world==='one');
    assert.equal(digest.planned,1);assert.equal(digest.registryRead,1);assert.equal(digest.extraSlices,0);assert.equal(digest.orphanSlices,1);
    assert.ok(digest.entities.some(e=>e.id==='one.item.orphan'));
    assert.equal(digest.orphanInputs.length,1);
    const input=digest.orphanInputs[0];assert.deepEqual({...input,contentHash:null},{key:'hp1',prefix:'hp1c002',pass:'census',kind:'census',source:'canonical',contentHash:null});
    assert.match(input.contentHash,/^sha256:[a-f0-9]{64}$/);
    assert.equal(input.contentHash,'sha256:'+createHash('sha256').update(content['hp1c002m_census.jsonl']).digest('hex'));
    assert.doesNotMatch(JSON.stringify(digest),/PRIVATE SOURCE|PRIVATE NOTE|SEALED LABEL|PARTIAL LABEL|INVALID FILE LABEL|ten\.item\.other|unmigrated/);
});

test('historic LOTM stages retain separate identities and grades, including original headers and Luna selections',t=>{
    const options=fixture(t,{
        's2m_census.jsonl':'{}\n','s2_header.json':header('s2','A','1-3'),
        's2rm_census.jsonl':'{}\n','s2rm_header.json':header('s2r','B','4-6'),
        's3rm_census.jsonl':'{}\n','s3rm_header.json':header('s3r','C','7-8'),
        's4r_rules.jsonl':'{}\n',
        's5rm_census.jsonl':'{}\n','s5rm_header.json':'{"grade":"A","chapters":"12-14"}',
        's6rm_census.jsonl':'{}\n','s6rm_header.json':header('s6r','A','15'),'s6r_full.partial':'',
        's7vm_census.jsonl':'{}\n','s7v_census.partial':'','s7vm_header.json':header('s7v','C','16-18'),
        's7vLm_census.jsonl':'{}\n','s7vLm_header.json':header('s7vL','B','16-18'),
        's9vm_header.json':header('s9v','A','22-24'),
        'w1s16Lm_census.jsonl':'{}\n','w1s16Lm_header.json':header('w1s16L','B','43-45'),
        'b4s42m_census.jsonl':'{}\n','b4s42m_header.json':header('b4s42','C','121-123'),
        'c4s42m_census.jsonl':'{}\n','c4s42m_header.json':header('c4s42','A','121-123')});
    const book={key:'lotm2',world:'lotm',dir:pathToFileURL(options.directory).href};
    const registry=[book,{...book,key:'lotm3'},{key:'lotm1',world:'lotm',dir:pathToFileURL(join(options.directory,'separate')).href}];
    const inventory=readBatchOutputs(book,{...options,shards:[],registry}),byId=new Map(inventory.legacy.shards.map(s=>[s.prefix,s]));
    assert.equal(byId.get('s2').chapters,'1-3');assert.equal(byId.get('s2r').chapters,'4-6');
    assert.equal(byId.get('s2').admitted,true);assert.equal(byId.get('s3r').grade,'C');assert.equal(byId.get('s3r').admitted,false);
    assert.equal(byId.get('s4r').gradingStatus,'header-missing');assert.equal(byId.get('s5r').gradingStatus,'header-invalid');
    assert.ok(!byId.has('s9v'),'header alone does not create an observed output slice');
    assert.equal(byId.get('s7v').grade,'B');assert.equal(byId.get('s7v').passes.find(p=>p.pass==='census').outputs[0].source,'luna');
    assert.equal(byId.get('s6r').passes.find(p=>p.pass==='census').outputs[0].status,'partial');
    assert.equal(byId.get('w1s16').grade,'B','Luna-only historic waves are observed');
    assert.equal(byId.get('b4s42').admitted,true,'late compatibility selection is retained');
    assert.deepEqual(byId.get('b4s42').aliases.map(a=>[a.prefix,a.grade]),[['c4s42','A']]);
    assert.equal(inventory.totals.files,0);assert.equal(inventory.orphans.shards.length,0);
});

test('new historic stage admission requires recorded A/B and source ownership; pilots and split reruns stay residual',t=>{
    const content={'registry.json':'{}',
        's2m_census.jsonl':'{"id":"lotm.item.stage","kind":"item","label":"Recorded stage"}\n','s2m_header.json':header('s2','A','1-3'),
        's2rm_census.jsonl':'{"id":"lotm.item.stage2","kind":"item","label":"Distinct stage"}\n','s2rm_header.json':header('s2r','B','4-6'),
        's3rm_census.jsonl':'{"id":"lotm.item.gradec","kind":"item","label":"GRADE_C"}\n','s3rm_header.json':header('s3r','C','7-8'),
        's6rm_census.jsonl':'{"id":"lotm.item.partial","kind":"item","label":"PARTIAL_STAGE"}\n','s6rm_header.json':header('s6r','A','15'),'s6r_full.partial':'',
        'p25m_census.jsonl':'{}\n','p25m_header.json':header('p25','B','70-72'),
        'b5s53c155m_census.jsonl':'{}\n','b5s53c155m_header.json':header('b5s53c155','B','155'),
        'b4s42x2m_census.jsonl':'{}\n','zw3s33cm_census.jsonl':'{}\n','w3s33xm_census.jsonl':'{}\n'};
    const options=fixture(t,content),book={key:'lotm2',world:'lotm',dir:pathToFileURL(options.directory).href};
    const registryFile=join(options.directory,'registry.json');writeFileSync(registryFile,JSON.stringify({books:[book]}));
    const digest=readFindings({registry:registryFile})[0];
    assert.equal(digest.planned,0);assert.equal(digest.registryRead,0);assert.equal(digest.extraSlices,2);
    assert.ok(digest.entities.some(e=>e.id==='lotm.item.stage'));assert.ok(digest.entities.some(e=>e.id==='lotm.item.stage2'));
    assert.deepEqual(digest.legacyInputs.map(i=>i.prefix),['s2','s2r']);
    assert.ok(digest.legacyInputs.every(i=>/^sha256:[a-f0-9]{64}$/.test(i.contentHash)));
    assert.doesNotMatch(JSON.stringify(digest),/GRADE_C|PARTIAL_STAGE/);
    const selection=legacyReaderSlices(book,[book],options.names);
    const inventory=readBatchOutputs(book,{...options,shards:[],registry:[book]});
    assert.equal(inventory.legacy.totals.missing,0,'new graded stages count observed outputs without predicting sibling files');
    assert.ok(inventory.legacy.shards.every(s=>s.passes.every(p=>p.complete===null)));
    assert.deepEqual(new Set(selection.residuals.map(r=>r.family)),new Set(['pilot-comparison','split-reread','rerun','sonnet-comparison','ab-comparison']));
    const local={...book,key:'lotm1'},unassigned=legacyReaderSlices(local,[local],options.names);
    assert.ok(unassigned.slices.filter(s=>s.family==='graded-stage').every(s=>s.admitted===false&&s.ownership==='unassigned-stage-owner'));
});
