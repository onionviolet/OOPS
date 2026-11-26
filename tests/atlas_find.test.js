import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {projectFindSubjects, readFindSubjects, buildFindIndex, searchAtlas} from '../prototypes/world-atlas/atlas-find.mjs';

test('subject projection uses admitted labels and stable exact routes without private content or guessed whereabouts', () => {
    const subjects = projectFindSubjects({
        digests: [{world: 'lotm', entities: [
            {id: 'klein', label: 'Klein', col: 'people', kind: 'person', privateNote: 'PRIVATE RAW'},
            {id: 'secret', label: 'SECRET', sealed: ['S1']},
            {id: 'private', label: 'PRIVATE', private: true},
        ]}],
        books: {lotm: {people: [{id: 'cast.klein', indexId: 'klein', name: 'Klein cast'}], places: [
            {id: 'place/one', name: 'Known place', currentOccupants: ['PRIVATE RAW']},
        ]}},
        library: [{id: 'home:one', label: 'Home', world: 'Frontier', group: 'Locations'}],
    });
    assert.equal(subjects.length, 3);
    assert.equal(subjects.find(row => row.id === 'klein').origin, 'reader');
    assert.equal(subjects.find(row => row.id === 'klein').href, '#world/lotm/things/klein');
    assert.equal(subjects.find(row => row.id === 'place/one').href, '#world/lotm/places/place%2Fone');
    assert.equal(subjects.find(row => row.id === 'home:one').href, '#creatures/kinds/home%3Aone');
    assert.doesNotMatch(JSON.stringify(subjects), /SECRET|PRIVATE RAW|currentOccupants/);
});

test('grouped search ranks exact names/IDs, retains scopes and pages, and returns only bounded public summaries', () => {
    const subjects = Array.from({length: 19}, (_, i) => ({
        id: 'magic.' + i, label: i ? 'Magic method ' + i : 'Magic', world: 'lotm',
        kind: 'item', status: 'Admitted reader record', summary: 'A recorded subject', href: '#world/lotm/things/magic.' + i,
    }));
    const rules = {worlds: [{id: 'dnd_srd', label: 'D&D 5.2.1 SRD'}], records: [{
        id: 'rule.magic', name: 'Magic rule', world: 'dnd_srd', sourceKind: 'source-paraphrase',
        statement: 'A recorded magic rule. ' + 'Qualified source detail. '.repeat(15),
        key: 'stable', sources: {books: ['SRD'], locators: ['p10']},
        implementation: {state: 'catalogued'},
    }]};
    const cheats = [{name: 'Engine-aware', examples: [{
        ordinary: 'CTC64 · Accept the ordinary draw.', advantage: 'The processed pelt changes.', evidence: 'Observed sample.',
    }], cheats: [{
        id: 'CTC64', name: 'Magic dice', effect: 'A proposed reroll', status: '**N** [observed proof](safe-link)',
        hooks: 'Seeded streams',
    }]}];
    const index = buildFindIndex({subjects, rules, cheats});
    const first = searchAtlas(index, {q: 'magic'});
    assert.equal(first.total, 21);
    assert.equal(first.groups[0].total, 19);
    assert.equal(first.groups[0].rows.length, 8);
    assert.equal(first.groups[0].rows[0].label, 'Magic');
    assert.equal(first.groups[1].rows[0].href, '#library/rules/dnd_srd/stable');
    assert.equal(first.groups[1].rows[0].status, 'Recorded ledger: catalogued');
    assert.equal(first.groups[1].rows[0].summary, rules.records[0].statement.trim());
    const exact = searchAtlas(index, {q: 'CTC64'});
    assert.equal(exact.groups[2].rows[0].href, '#library/cheats/CTC64');
    assert.equal(exact.groups[2].rows[0].status, 'N observed proof');
    assert.equal(searchAtlas(index, {q: 'pelt'}).groups[2].rows[0].id, 'CTC64');
    assert.equal(searchAtlas(index, {q: 'seeded streams'}).groups[2].rows[0].id, 'CTC64');
    const page = searchAtlas(index, {q: 'magic', world: 'lotm', type: 'subjects', page: 3});
    assert.equal(page.total, 19);
    assert.equal(page.groups[0].rows.length, 3);
    assert.equal(page.world, 'lotm');
    assert.equal(page.page, 3);
    assert.ok(!JSON.stringify(page).includes('labelSearch'));
    assert.equal(searchAtlas(index, {q: 'nothing matches'}).total, 0);
    assert.equal(searchAtlas(index).total, 0);
    assert.match(page.scope, /vision themes/);
    for (const invalid of [{q: 'x'.repeat(161)}, {type: 'raw'}, {page: -1}, {limit: 1000}]) {
        assert.throws(() => searchAtlas(index, invalid));
    }
});

test('every standing vision heading is searchable with a coverage status and direct address', () => {
    const owner = readFileSync(new URL('../docs/USER_VISION.md', import.meta.url), 'utf8');
    const expected = [...owner.split('## Request log index')[0].matchAll(/^## (.+)\r?$/gm)]
        .map(([, title]) => title.replace(/[’']/g, '').toLowerCase().replace(/[,]/g, '').trim().replace(/\s+/g, '-'));
    const index = buildFindIndex();
    assert.deepEqual(index.rows.filter(row => row.type === 'vision').map(row => row.id), expected);
    for (const id of expected) {
        const result = searchAtlas(index, {q: id, type: 'vision'}).groups[0].rows[0];
        assert.equal(result.href, `#progress/vision/${id}`);
        assert.match(result.status, /^(Playable|Partial|Reading-only)$/);
        assert.ok(result.summary);
    }
});

test('reader indexing reads only admitted JSON projections and reports unreadable scope', async () => {
    const root = mkdtempSync(join(tmpdir(), 'atlas-find-'));
    try {
        mkdirSync(join(root, 'readers'));
        writeFileSync(join(root, 'readers/lotm.json'), JSON.stringify({world: 'lotm', entities: [{id: 'klein', label: 'Klein'}]}));
        writeFileSync(join(root, 'readers/broken.json'), '{broken');
        writeFileSync(join(root, 'readers/raw.txt'), 'PRIVATE RAW');
        const result = await readFindSubjects({readers: join(root, 'readers'), library: [], books: {}});
        assert.equal(result.rows.length, 1);
        assert.equal(result.files, 1);
        assert.equal(result.unreadable, 1);
        const missing = await readFindSubjects({readers: join(root, 'absent'), library: [{id: 'known', label: 'Known'}]});
        assert.equal(missing.rows.length, 1);
        assert.equal(missing.unreadable, 1);
    } finally {
        rmSync(root, {recursive: true, force: true});
    }
});

test('reader scene metadata is discoverable by exact ID and any valid locator without indexing plot text',()=>{
    const subjects=projectFindSubjects({digests:[{world:'wus',entities:[{id:'shared',label:'Public subject'}],scenes:[
        {id:'lr.wus.shane.803802',locator:'en b8 c38 p29',locators:['en b8 c38 p33','PRIVATE PLOT LOCATOR'],place:'PRIVATE PLACE',detail:{actions:[{text:'PRIVATE PLOT'}]}},
        {id:'shared',locator:'en b8 c37 p1'},
        {id:'hidden',locator:'en b8 c37 p2',sealed:['S1']},
        {id:'private',locator:'en b8 c37 p3',scope:'private'},
        {id:'private2',locator:'en b8 c37 p4',private:true},
    ]}]});
    assert.equal(subjects.length,3);assert.equal(subjects.filter(r=>r.id==='shared').length,2);
    assert.doesNotMatch(JSON.stringify(subjects),/PRIVATE|hidden|private2/);
    const index=buildFindIndex({subjects});
    for(const q of ['lr.wus.shane.803802','en b8 c38 p29','en b8 c38 p33']){
        const found=searchAtlas(index,{q});assert.equal(found.total,1);
        const group=found.groups.find(g=>g.id==='scenes');assert.equal(group.total,1);assert.equal(group.rows[0].label,'Scene at en b8 c38 p29');
        assert.equal(group.rows[0].href,'#world/wus/reader-scenes/lr.wus.shane.803802');assert.match(group.rows[0].status,/no playable proof inferred/);
        assert.doesNotMatch(JSON.stringify(found),/PRIVATE|labelSearch|"terms"/);
    }
    assert.equal(searchAtlas(index,{q:'PRIVATE PLOT'}).total,0);
    const shared=searchAtlas(index,{q:'shared'});assert.equal(shared.groups.find(g=>g.id==='subjects').total,1);assert.equal(shared.groups.find(g=>g.id==='scenes').total,1);
});

test('reader scenes use independent category/world pagination and preserve direct destination identity',()=>{
    const subjects=projectFindSubjects({digests:[{world:'wus',scenes:Array.from({length:19},(_,i)=>({id:'lr.wus.scene.'+i,locator:'en b8 c38 p'+(i+1)}))},{world:'mol',scenes:[{id:'lr.mol.scene.1',locator:'en b1 c1 p1'}]}]});
    const index=buildFindIndex({subjects}),ids=[];
    for(const page of [1,2,3]){const result=searchAtlas(index,{q:'lr.wus.scene',type:'scenes',world:'wus',page});assert.equal(result.total,19);assert.equal(result.groups.length,1);ids.push(...result.groups[0].rows.map(r=>r.id));}
    assert.equal(new Set(ids).size,19);assert.equal(ids.length,19);assert.equal(searchAtlas(index,{q:'lr.wus.scene',type:'subjects'}).total,0);assert.equal(searchAtlas(index,{q:'lr.wus.scene',world:'mol'}).total,0);
});
