import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, writeFileSync, unlinkSync, rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {digestWorld} from '../prototypes/world-atlas/reader-findings.mjs';
import {createBookOutputReader,readOutputRecords} from '../prototypes/world-atlas/output-records.mjs';
import {OUTPUT_KINDS} from '../prototypes/world-atlas/batch-output-index.mjs';

const loc = 'en b1 c1 p2';
const source = {prefix: 'xc001', census: [
    {id: 'w.item.ticket', kind: 'item', label: 'Public ticket', note: 'PRIVATE CENSUS NOTE'},
    {id: 'w.person.guide', kind: 'person', label: 'Public guide'}, {id: 'w.place.market', kind: 'place', label: 'Public market'},
], rules: [{id: 'w.rule.ticket', name: 'Public ticket making', kind: 'craft', locator: loc}],
scenes: [{beat: 'w.scene.market', evidence: [{locator: loc}], steps: [{verb: 'PRIVATE SCENE RAW PROSE'}]}],
fills: [{id: 'w.fill.market', what: 'Public proposed queue', for: 'w.scene.market', status: 'authored-proposal', basis: [loc]}],
people: [{id: 'w.person.guide', routine: [{what: 'Work in the market', place: 'w.place.market'}]}], places: [{id: 'w.place.market', hours: 'Noon'}],
texture: {services: [{what: 'Public cart fare', place: 'w.place.market', amount: 2, unit: 'coins', label: 'T', locator: loc}],
    news: [{what: 'Public market notice', scope: 'public', label: 'T', locator: loc}],
    customs: [{what: 'Public greeting', applies: 'w.place.market', label: 'S', locator: loc}]},
other: Object.fromEntries(['rules', 'people', 'texture'].map(pass => [pass, [{what: 'Public ' + pass + ' observation', about: ['w.item.ticket'], label: 'T', locator: loc}]]))};

function fixture(t, shard = source) {
    const directory = mkdtempSync(join(tmpdir(), 'atlas-output-records-'));
    const files = new Set();
    const write = (name, rows) => {files.add(name); writeFileSync(join(directory, name), rows.map(row => JSON.stringify(row)).join('\n'));};
    write('shard_x_ch001-001.txt', []);
    for (const {pass, kind} of OUTPUT_KINDS) {
        const name = ['census', 'scenes'].includes(pass) ? 'xc001m_' + kind + '.jsonl' : 'xc001_' + (kind === 'other' ? pass + '_other' : kind) + '.jsonl';
        const values = kind === 'other' ? shard.other?.[pass] : shard[kind] || shard.texture?.[kind];
        write(name, values || []);
    }
    t.after(() => {for (const name of files) unlinkSync(join(directory, name)); rmdirSync(directory);});
    const book = {key: 'x', world: 'w', dir: pathToFileURL(directory).href};
    return {book, directory, write, files, digest: digestWorld({world: 'w', shards: [shard]})};
}
const run = (f, pass, kind, extra = {}, options = {}) => readOutputRecords(f.book, {prefix: 'xc001', pass, kind, ...extra},
    {directory: f.directory, digest: f.digest, registry: [f.book], ...options});

test('all twelve logical output kinds open exact admitted record targets', t => {
    const f = fixture(t);
    const reader = createBookOutputReader(f.book,{directory:f.directory,digest:f.digest,registry:[f.book]});
    assert.deepEqual(reader.prefixes,['xc001']);
    assert.equal(OUTPUT_KINDS.length, 12);
    for (const {pass, kind} of OUTPUT_KINDS) {
        const result = run(f, pass, kind);
        assert.deepEqual(reader.read({prefix:'xc001',pass,kind}),result);
        assert.equal(result.status, 'collected', pass + '/' + kind);
        assert.equal(result.total, kind === 'census' ? 3 : 1, pass + '/' + kind);
        assert.equal(result.counts.unindexed, 0);
        for (const record of result.records) {
            assert.ok(record.href.startsWith('#world/w/'));
            assert.ok(record.label);
        }
        assert.doesNotMatch(JSON.stringify(result), /PRIVATE|atlas-output-records|\.jsonl/);
    }
    assert.equal(run(f, 'rules', 'rules').records[0].focus, 'working:w.rule.ticket');
    assert.equal(run(f, 'scenes', 'scenes').records[0].view, 'reader-scenes');
    const note = run(f, 'rules', 'other').records[0].focus;
    const service = run(f, 'texture', 'services').records[0].focus;
    assert.match(note, /^note:ref-[a-f0-9]{64}$/);
    assert.match(service, /^life:ref-[a-f0-9]{64}$/);
    f.digest.notes.reverse();
    f.digest.life.reverse();
    assert.equal(run(f, 'rules', 'other').records[0].focus, note);
    assert.equal(run(f, 'texture', 'services').records[0].focus, service);
});

test('unindexed, withheld and ambiguous matches are counted without exposing source values', t => {
    const f = fixture(t);
    f.write('xc001m_census.jsonl', [{id: 'w.item.ticket'}, {id: 'w.item.unknown', label: 'PRIVATE UNKNOWN'},
        {id: 'w.item.ticket', label: 'PRIVATE SEALED', sealed: ['S1']}]);
    const result = run(f, 'census', 'census');
    assert.equal(result.total, 1);
    assert.deepEqual([result.counts.matchedRows, result.counts.unindexed, result.counts.noPublicMatch], [1, 1, 1]);
    assert.doesNotMatch(JSON.stringify(result), /PRIVATE|w\.item\.unknown|SEALED/);
    const duplicate = {...f.digest.entities.find(row => row.id === 'w.item.ticket'), label: 'Other admitted ticket'};
    const ambiguous = run(f, 'census', 'census', {}, {digest: {...f.digest, entities: [...f.digest.entities, duplicate]}});
    assert.equal(ambiguous.status, 'ambiguous');
    assert.equal(ambiguous.total, 2);
    assert.equal(ambiguous.counts.ambiguous, 1);
});

test('on-demand unindexed explanations retain exact joins, exclude private rows and reconcile independently of pagination',t=>{
    const f=fixture(t);
    f.write('xc001m_census.jsonl',[
        {id:'w.item.ticket',kind:'item'},
        {id:'w.rule.ticket',kind:'ability',label:'PRIVATE RULE LABEL'},
        {id:'w.item.unknown',kind:'note',note:'PRIVATE UNKNOWN PROSE'},
        {kind:'PRIVATE KIND'},
        {id:'w.secret',kind:'ability',private:true},
        {id:'w.secret2',kind:'note',scope:'private'},
        {id:'w.secret3',kind:'note',sealed:['S1']},
    ]);
    const plain=run(f,'census','census');assert.equal(plain.unindexedExplanation,undefined);
    assert.equal(run(f,'census','census',{explain:'true'}).unindexedExplanation,undefined);
    const explained=run(f,'census','census',{explain:true,size:1,offset:100});
    assert.deepEqual(explained.counts,plain.counts);assert.deepEqual(explained.records,plain.records);
    assert.equal(explained.counts.noPublicMatch,3);assert.equal(explained.counts.unindexed,3);
    const d=explained.unindexedExplanation;assert.equal(d.total,3);
    assert.deepEqual(d.reasons.map(r=>[r.id,r.rows]),[['identity-not-qualified',1],['missing-identity',1],['no-public-identity',1]]);
    for(const rows of [d.groups,d.kinds,d.reasons])assert.equal(rows.reduce((n,r)=>n+r.rows,0),3);
    assert.doesNotMatch(JSON.stringify(explained),/PRIVATE|w\.secret|w\.item\.unknown/);
    f.write('xc001m_census.jsonl',[{id:'w.item.ticket'}]);assert.equal(run(f,'census','census',{explain:true}).unindexedExplanation.total,0);
    assert.equal(run(f,'census','census',{prefix:'xc999',explain:true}).unindexedExplanation,undefined);
    assert.equal(run(f,'census','census',{explain:true},{digest:null}).unindexedExplanation,undefined);
    assert.equal(run(f,'census','census',{explain:true},{readFile:()=>{throw Error('private path');}}).unindexedExplanation,undefined);
});

test('people outputs link cross-kind subjects only with unique same-world and same-slice public provenance', t => {
    const group={id:'w.organization.carriers',kind:'organization',label:'Public carriers'};
    const creature={id:'w.creature.helper',kind:'creature',label:'Public helper'};
    const f=fixture(t,{prefix:'xc001',census:[group,creature],people:[{id:group.id},{id:creature.id}]});
    const accepted=run(f,'people','people');
    assert.equal(accepted.counts.matchedRows,2);
    assert.deepEqual(accepted.records.map(r=>r.focus),[group.id,creature.id]);
    assert.ok(accepted.records.every(r=>r.view==='things'));
    assert.equal(accepted.counts.unindexed,0);
    const rejected=entities=>run(f,'people','people',{}, {digest:{...f.digest,entities}});
    f.write('xc001m_census.jsonl',[{id:'w.organization.other-slice',kind:'organization'}]);
    assert.equal(run(f,'people','people').counts.unindexed,2,'unrelated slice');
    f.write('xc001m_census.jsonl',[]);
    assert.equal(run(f,'people','people').counts.unindexed,2,'missing provenance');
    f.write('xc001m_census.jsonl',[group,creature]);
    assert.equal(rejected(f.digest.entities.map(e=>({...e,private:true}))).counts.unindexed,2,'private target');
    assert.equal(rejected([...f.digest.entities,...f.digest.entities]).counts.unindexed,2,'duplicate identity');
    for(const family of ['rules','scenes','fills']){
        const page=run(f,'people','people',{}, {digest:{...f.digest,[family]:[{id:group.id,name:'Collision',kind:'ability'}]}});
        assert.equal(page.counts.unindexed,1,'ambiguous '+family+' identity');
        assert.equal(page.records[0].focus,creature.id);
    }
    const foreign={id:'elsewhere.organization.carriers',kind:'organization',label:'Unrelated world'};
    f.write('xc001_people.jsonl',[{id:foreign.id},{id:group.id,sealed:['S1']}]);
    const foreignEntity={...f.digest.entities[0],id:foreign.id};
    const refused=run(f,'people','people',{}, {digest:{...f.digest,entities:[foreignEntity,...f.digest.entities]}});
    assert.equal(refused.counts.unindexed,1);
    assert.equal(refused.counts.noPublicMatch,1);
    assert.equal(refused.total,0);
    assert.doesNotMatch(JSON.stringify(refused),/Unrelated world|elsewhere|carriers/);
});

test('precise note, fill and life joins reject similar titles and unrelated provenance', t => {
    const f = fixture(t);
    f.write('xc001_rules_other.jsonl', [{what: 'Public rules observation plus PRIVATE', about: ['w.item.ticket'], label: 'T', locator: loc}]);
    assert.equal(run(f, 'rules', 'other').status, 'unindexed');
    f.write('xc001_rules_other.jsonl', [{...source.other.rules[0], about: ['w.person.hidden']}]);
    assert.equal(run(f, 'rules', 'other').total, 0);
    f.write('xc001m_fills.jsonl', [{...source.fills[0], for: 'w.scene.other'}]);
    assert.equal(run(f, 'scenes', 'fills').total, 0);
    f.write('xc001_services.jsonl', [{...source.texture.services[0], amount: 99}]);
    assert.equal(run(f, 'texture', 'services').total, 0);
    f.write('xc001_news.jsonl', [{what: 'PRIVATE NEWS PROSE', scope: 'private'}]);
    const privateOnly = run(f, 'texture', 'news');
    assert.equal(privateOnly.status, 'no-public-match');
    assert.equal(privateOnly.counts.noPublicMatch, 1);
    assert.doesNotMatch(JSON.stringify(privateOnly), /PRIVATE NEWS PROSE/);
});

test('a selected fill variant opens only its exact admitted provenance under the shared fill id', t => {
    const alternate = {...source.fills[0], what: 'An alternate public proposal', basis: ['en b1 c2 p3']};
    const f = fixture(t, {...source, fills: [source.fills[0], alternate]});
    f.write('xc001m_fills.jsonl', [alternate]);
    const result = run(f, 'scenes', 'fills');
    assert.equal(result.total, 1);
    assert.equal(result.records[0].label, alternate.what);
    assert.equal(result.records[0].focus, alternate.id);
    assert.match(result.records[0].key, /variant:1$/);
    assert.deepEqual(result.records[0].fileLocators, alternate.basis);
});

test('one target retains its physical batch lines and separates local evidence from other record locators', t => {
    const f = fixture(t);
    const ticket = source.census[0];
    const other = 'en b1 c7 p10';
    f.digest.entities.find(row => row.id === ticket.id).locators = [loc, other];
    const row = JSON.stringify({...ticket, firstMention: loc});
    const withheld = JSON.stringify({...ticket, sealed: ['S1'], firstMention: other});
    writeFileSync(join(f.directory, 'xc001m_census.jsonl'), [row, row, '', 'invalid', withheld, row].join('\n'));
    const result = run(f, 'census', 'census');
    assert.equal(result.total, 1);
    assert.deepEqual(result.records[0].fileLines, [[1, 2], [6, 6]]);
    assert.deepEqual(result.records[0].fileLocators, [loc]);
    assert.deepEqual(result.records[0].locators, [loc, other]);
    assert.equal(result.counts.parseFailures, 1);
});

test('an orphan file must still match the digest bytes even when it repeats a known public ID', t => {
    const f = fixture(t);
    const prefix = 'xc777', name = prefix + 'm_census.jsonl';
    f.write(name, [source.census[0]]);
    const query = () => run(f, 'census', 'census', {prefix,explain:true});
    assert.equal(query().scope, 'orphan');
    assert.equal(query().total, 0);
    assert.equal(query().unindexedExplanation,undefined);
    f.digest.orphanInputs = [{key: f.book.key, prefix, pass:'census', kind:'census', source:'canonical',
        contentHash:'sha256:' + createHash('sha256').update(readFileSync(join(f.directory, name))).digest('hex')}];
    assert.equal(query().total, 1);
    f.write(name, [{...source.census[0], aliases:['Updated']}]);
    const stale = query();
    assert.equal(stale.inspected, false);
    assert.equal(stale.total, 0);
    assert.match(stale.coverage.note, /changed since the snapshot/);
    assert.equal(stale.fieldCoverage, undefined);
    assert.equal(stale.unindexedExplanation,undefined);
});

test('pagination covers every distinct target while repeated input rows do not inflate targets', t => {
    const census = Array.from({length: 45}, (_, n) => ({id: 'w.item.ticket-' + n, kind: 'item', label: 'Ticket ' + n}));
    const f = fixture(t, {...source, census: [...census, census[0]]});
    const first = run(f, 'census', 'census', {size: 20});
    const second = run(f, 'census', 'census', {size: 20, offset: 20});
    const third = run(f, 'census', 'census', {size: 20, offset: 40});
    assert.equal(first.total, 45);
    assert.equal(first.counts.matchedRows, 46);
    assert.equal(new Set([...first.records, ...second.records, ...third.records].map(row => row.key)).size, 45);
});

test('canonical Luna selection, legacy ownership and query scoping match the inventory', t => {
    const f = fixture(t);
    f.write('xc001_census.partial', []);
    f.write('xc001Lm_census.jsonl', [source.census[0]]);
    let reads = 0;
    const result = run(f, 'census', 'census', {}, {readFile: path => {reads++; return readFileSync(path, 'utf8');}});
    assert.equal(result.source, 'luna');
    assert.equal(result.total, 1);
    assert.equal(reads, 1);
    assert.equal(run(f, 'census', 'census', {prefix: '../private'}).status, 'unindexed');
    f.write('b4s42m_census.jsonl', [source.census[0]]);
    const legacy = run(f, 'census', 'census', {prefix: 'b4s42'});
    assert.equal(legacy.scope, 'legacy');
    assert.equal(legacy.total, 1);
    const other = {...f.book, key: 'y'};
    const notOwned = readOutputRecords(other, {prefix: 'b4s42', pass: 'census', kind: 'census'}, {digest: f.digest, registry: [f.book, other]});
    assert.equal(notOwned.scope, null);
    assert.equal(notOwned.total, 0);
});

test('missing public digest, empty file and parse/read failures remain explicit', t => {
    const f = fixture(t);
    assert.equal(run(f, 'census', 'census', {}, {digest: null}).total, 0);
    f.write('xc001m_census.jsonl', []);
    assert.equal(run(f, 'census', 'census').status, 'empty');
    writeFileSync(join(f.directory, 'xc001m_census.jsonl'), '{}\n{bad\nnull\n');
    const invalid = run(f, 'census', 'census');
    assert.equal(invalid.status, 'invalid');
    assert.equal(invalid.counts.parseFailures, 2);
    const unreadable = run(f, 'census', 'census', {}, {readFile: () => {throw Error('PRIVATE PATH');}});
    assert.equal(unreadable.counts.readFailures, 1);
    assert.doesNotMatch(JSON.stringify(unreadable), /PRIVATE PATH/);
});

test('census can link one exact hash-attested same-slice public rule without changing census field provenance', t => {
    const f=fixture(t),prefix='xc777',id='w.ability.float';
    const census={id,kind:'ability',label:'Census label stays private',zh:'Original name',touchedByLead:false,amount:{value:0,unit:'coins'}};
    const rule={id,kind:'ability',name:'Public float',label:'T',locator:loc};
    f.write(prefix+'m_census.jsonl',[census]);f.write(prefix+'_rules.jsonl',[rule]);
    f.digest.rules=digestWorld({world:'w',shards:[{prefix,rules:[rule]}]}).rules;
    const attest=()=>{f.digest.orphanInputs=['census','rules'].map(kind=>({key:f.book.key,prefix,pass:kind,kind,source:'canonical',contentHash:'sha256:'+createHash('sha256').update(readFileSync(join(f.directory,prefix+(kind==='census'?'m_census':'_rules')+'.jsonl'))).digest('hex')}));};attest();
    const query=(digest=f.digest)=>run(f,'census','census',{prefix},{digest});
    const page=query();assert.equal(page.counts.matchedRows,1);assert.equal(page.records[0].type,'rule');assert.equal(page.records[0].sourceKind,'census');assert.equal(page.records[0].focus,id);assert.equal(page.records[0].origin.contentHash,f.digest.orphanInputs[1].contentHash);
    assert.equal(page.fieldCoverage.kind,'census');assert.equal(page.fieldCoverage.fields.find(f=>f.id==='lead-contact').rows,1);assert.equal(page.fieldCoverage.fields.find(f=>f.id==='amount').rows,1);
    assert.doesNotMatch(JSON.stringify(page),/Census label stays private|Original name/);
    assert.equal(query({...f.digest,orphanInputs:f.digest.orphanInputs.slice(0,1)}).counts.unindexed,1,'missing rules origin');
    f.write(prefix+'_rules.jsonl',[{...rule,name:'Changed file'}]);assert.equal(query().counts.unindexed,1,'changed origin bytes');
    f.write(prefix+'_rules.jsonl',[]);attest();assert.equal(query().counts.unindexed,1,'same-slice file empty');
    f.write(prefix+'_rules.jsonl',[rule]);attest();
    for(const family of ['scenes','fills'])assert.equal(query({...f.digest,[family]:[{id}]}).counts.unindexed,1,'cross-family '+family);
    assert.equal(query({...f.digest,rules:[...f.digest.rules,...f.digest.rules]}).counts.unindexed,1,'duplicate rule ID');
    assert.equal(query({...f.digest,rules:f.digest.rules.map(r=>({...r,private:true}))}).counts.unindexed,1,'private target');
    const savedOrigins=f.digest.orphanInputs;f.digest.orphanInputs=savedOrigins.map(i=>i.kind==='rules'?{...i,prefix:'xc999'}:i);assert.equal(query().counts.unindexed,1,'unrelated source slice');f.digest.orphanInputs=savedOrigins;
    f.write(prefix+'_rules.jsonl',[{...rule,private:true}]);attest();assert.equal(query().counts.unindexed,1,'private origin row');
    f.write(prefix+'_rules.jsonl',[rule]);attest();
    const foreignId='elsewhere.ability.float';f.write(prefix+'m_census.jsonl',[{...census,id:foreignId}]);f.write(prefix+'_rules.jsonl',[{...rule,id:foreignId}]);attest();assert.equal(query({...f.digest,rules:[{...f.digest.rules[0],id:foreignId}]}).counts.unindexed,1,'foreign world identity');
    f.write(prefix+'m_census.jsonl',[census]);f.write(prefix+'_rules.jsonl',[rule]);attest();
    const collision=query({...f.digest,entities:[...f.digest.entities,{id,kind:'item',col:'items',label:'Existing public entity'}]});assert.equal(collision.records[0].type,'entity','existing census identity is preserved');assert.equal(collision.records[0].origin,undefined,'no cross-family substitution');
    f.write(prefix+'m_census.jsonl',[{...census,sealed:['S1']}]);attest();assert.equal(query().counts.noPublicMatch,1,'private source');
});
