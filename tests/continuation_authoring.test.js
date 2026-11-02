import test from 'node:test';import assert from 'node:assert/strict';import {checkContinuation} from '../scripts/playtest/check-continuation.mjs';
const row={id:'fixture.read',operation:'read',place:'fixture.room',minutes:1,label:'Read a record',description:'Read the record here.',report:'You read an attributed record.',knowledgeKey:'fixture.read.seen',locator:'fixture paragraph 1',timing:{label:'fill',basis:'Authored handling time.'},costLabel:'no stock spent'};
test('authoring checks reject mistyped retained keys and orphaned visit edges before browser work',()=>{
 const data={acts:[row,{...row,id:'fixture.use',knowledgeKey:'fixture.used',requires:{fact:'knowledge.fixture.read.seen.seen',op:'eq',value:true}}]};assert.equal(checkContinuation(data,{prefix:'fixture.'}).commands,2);
 const broken=structuredClone(data);broken.acts[1].requires.fact='knowledge.fixture.read.seen';assert.throws(()=>checkContinuation(broken,{prefix:'fixture.'}),/Unbound retained/);
 assert.throws(()=>checkContinuation({...data,visits:[{arrival:'fixture.read',departure:'fixture.missing'}]}),/unknown command/);
});
