import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadWorldRules,queryWorldRules,flattenRuleRecords} from '../prototypes/world-atlas/world-rules.mjs';
test('nested public rules keep exact locators, edition, distinct records and interpretation separate',()=>{
 const root=mkdtempSync(join(tmpdir(),'atlas-rules-'));try{const dir=join(root,'docs/coverage');mkdirSync(dir,{recursive:true});
 const row={id:'dnd.rule.test',world:'dnd2014',statement:'A sourced paraphrase.',locators:['PHB 2014 p10'],speaker:'rulebook'};
 writeFileSync(join(dir,'dnd_rules.json'),JSON.stringify({meta:{books:['PHB 2014'],licence:['design reference'],note:'Proposals: reader output, not human checked'},chapters:[{rules:[row,{...row,statement:'A distinct recorded variant.'},{...row,id:'private',refs:[{private:true,text:'PRIVATE RAW'}]},{sealed:true,rules:[{...row,id:'sealed',statement:'SECRET'}]}]}]}));
 writeFileSync(join(dir,'hp_rules.json'),JSON.stringify({meta:{note:'Proposals, agent-written inference; no canon line states this rule.'},rules:[{id:'hp.inference',world:'hp',statement:'An inferred proposal.',locators:['C:/private/book.txt','public locator']},{...row,id:'cross-reference',derives:['sealed']}]}));
 const c=loadWorldRules(root);assert.equal(c.records.length,3);assert.equal(new Set(c.records.map(r=>r.key)).size,3);assert.equal(c.records[0].sourceKind,'source-paraphrase');assert.equal(c.records[2].sourceKind,'interpretation');
 assert.deepEqual(c.records[0].sources.books,['PHB 2014']);assert.match(c.records[0].sources.sha256,/^[a-f0-9]{64}$/);assert.equal(c.records[0].sources.pointer,'/chapters/0/rules/0');assert.deepEqual(c.records[2].sources.locators,['public locator']);assert.doesNotMatch(JSON.stringify(c),/PRIVATE RAW|SECRET|C:\//);
 const first=queryWorldRules(c,{world:'dnd2014',limit:1}),second=queryWorldRules(c,{world:'dnd2014',limit:1,offset:1});assert.equal(first.total,2);assert.notEqual(first.records[0].key,second.records[0].key);assert.equal(queryWorldRules(c,{q:'distinct'}).total,1);assert.equal(queryWorldRules(c,{kind:'interpretation'}).total,1);assert.equal(queryWorldRules(c,{record:second.records[0].key}).records[0].statement,'A distinct recorded variant.');assert.throws(()=>queryWorldRules(c,{offset:-1}));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('coverage ledger joins nested exact-ID label sheet without calling an old test current playable proof',()=>{
 const root=mkdtempSync(join(tmpdir(),'atlas-rules-'));try{const dir=join(root,'docs/coverage');mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'warhammer_40k_rules.jsonl'),JSON.stringify({id:'warhammer-40k.rule.warp',source:'core9 p22',state:'runs:old-claim',test:'tests/old.test.js'})+'\n{broken\n');
 writeFileSync(join(dir,'warhammer_40k_labels.json'),JSON.stringify({meta:{setting:'Warhammer 40,000 9th edition',licence:'design reference'},sheets:{warhammer_40k_rules:{'warhammer-40k.rule.warp':{name:'Warp travel',effect:{summary:'A recorded warp rule.'},cost_or_limit:'Real cost',mechanism:'travel'}}}}));
 const c=loadWorldRules(root),r=c.records[0];assert.equal(c.records.length,1);assert.equal(r.world,'warhammer-40k');assert.equal(r.statement,'A recorded warp rule.');assert.equal(r.sources.detail.pointer,'/sheets/warhammer_40k_rules/warhammer-40k.rule.warp');assert.equal(r.implementation.state,'runs:old-claim');assert.equal(r.implementation.status,'ledger-claim');assert.match(r.implementation.note,/no current playable proof/);assert.equal(c.issues.length,1);assert.equal(c.issues[0].line,2);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('actual coverage includes edition-separated D&D, nested Warhammer and several other worlds without invented completeness',()=>{
 const c=loadWorldRules(process.cwd());assert.ok(c.records.length>1000);for(const world of ['dnd_srd','dnd5e_2014','warhammer-40k','lotm','ars_magica'])assert.ok(c.worlds.some(w=>w.id===world));
 const dnd=queryWorldRules(c,{world:'dnd_srd',q:'D20 test'});assert.ok(dnd.total>0);assert.ok(dnd.records.some(r=>r.sources.books.includes('D&D 5.2.1 SRD')));const wh=queryWorldRules(c,{world:'warhammer-40k',q:'warp-dependent'});assert.ok(wh.records.some(r=>r.sources.detail&&r.sources.locators.some(x=>x.includes('core9 p22'))));assert.match(c.coverage,/completeness.*not inferred/);
 assert.deepEqual(flattenRuleRecords({sealed:true,nested:{id:'x',statement:'hidden'}}),[]);
 assert.deepEqual(flattenRuleRecords({id:'parent',statement:'public',children:[{id:'child',statement:'also public'}]}).map(r=>r.row.id),['parent','child']);
});
