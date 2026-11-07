import test from 'node:test';
import assert from 'node:assert/strict';
import {scan,familyOf,importSpecs,renderBlock,replaceBlock,isStale,BEGIN,END} from '../scripts/seam_register.mjs';

const seams=[
 {id:'alpha',files:['alpha'],purpose:'fake seam one'},
 {id:'orphan',files:['orphan'],purpose:'fake seam with no importers'}
];
const files={
 'src/alpha.js':'export const a=1;\n',
 'src/orphan.js':'export const o=1;\n',
 'src/book_world_lotm_x.js':"import {a} from './alpha.js';\n",
 'src/hp_y.js':"import './alpha.js';\n",
 'src/main.js':"import {\n a\n} from './alpha';\nexport {a} from './alpha.js';\n",
 'tests/alpha.test.js':"import {a} from '../src/alpha.js';\n"
};

test('counts distinct importers, families, and tests', () => {
 const {rows,missing}=scan(files,seams);
 const a=rows.find(r=>r.id==='alpha');
 assert.deepEqual(missing,[]);
 assert.equal(a.src,3);
 assert.equal(a.tests,1);
 assert.equal(a.shared,1);
 assert.deepEqual(a.worlds.map(([f])=>f).sort(),['hp','lotm']);
 assert.equal(a.families,2);
 assert.equal(a.state,'unknown');
});

test('a seam with zero importers is reported as 0, not omitted', () => {
 const {rows}=scan(files,seams);
 const o=rows.find(r=>r.id==='orphan');
 assert.ok(o);
 assert.equal(o.src,0);
 assert.equal(o.families,0);
 assert.match(renderBlock(rows),/\| orphan \|.*\| 0 \| 0 \/ 0 \|/);
});

test('a missing seam file is reported', () => {
 const {missing}=scan({'src/main.js':''},seams);
 assert.deepEqual(missing.sort(),['src/alpha.js','src/orphan.js']);
});

test('import parsing covers side-effect imports, re-exports and ignores comments', () => {
 const specs=importSpecs("// import x from './no.js'\n/* import './no2.js' */\nimport './a.js';\nexport * from './b.js';\nimport {q} from './c.js';\n");
 assert.deepEqual(specs.sort(),['./a.js','./b.js','./c.js']);
});

test('family classifier', () => {
 assert.equal(familyOf('world_packs/book_hp_x.js'),'hp');
 assert.equal(familyOf('frontier_map.js'),'village');
 assert.equal(familyOf('main.js'),'shared');
 assert.equal(familyOf('tempo_fight_domain.js'),'shared');
});

test('stale check flips when the code changes', () => {
 const doc=`# t\n${BEGIN}\n${END}\n`;
 const {rows}=scan(files,seams);
 const fresh=replaceBlock(doc,renderBlock(rows));
 assert.equal(isStale(fresh,rows),false);
 const changed=scan({...files,'src/dnd_z.js':"import './alpha.js';"},seams).rows;
 assert.equal(isStale(fresh,changed),true);
 assert.throws(()=>replaceBlock('no markers',renderBlock(rows)));
});
