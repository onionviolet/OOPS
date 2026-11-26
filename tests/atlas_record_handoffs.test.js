import test from 'node:test';
import assert from 'node:assert/strict';
import {recordHandoffQuery,handoffsForRecord} from '../prototypes/world-atlas/record-handoffs.mjs';
const target={world:'w',view:'things',focus:'w.ability.light',type:'rule'};
const entry={id:'a'.repeat(64),source:{world:'w',book:'w1',prefix:'w1c001',pass:'rules',kind:'rules'},
    record:{label:'Same displayed name',type:'rule',route:'#world/w/things/w.ability.light'}};
test('record trail matches exact canonical route, world and family rather than IDs or labels alone',()=>{
    const entries=[entry,{...entry,id:'b',record:{...entry.record,type:'entity'}},{...entry,id:'c',record:{...entry.record,route:'#world/w/making/w.ability.light'}},
        {...entry,id:'d',source:{...entry.source,world:'elsewhere'}},{...entry,id:'e',record:{...entry.record,route:'#world/w/things/w.ability.other'}}];
    assert.deepEqual(handoffsForRecord(entries,target).map(e=>e.id),[entry.id]);
    assert.equal(handoffsForRecord([entry],{...target,type:'entity'}).length,0);
    assert.equal(handoffsForRecord([entry],{...target,world:'elsewhere'}).length,0);
    assert.equal(handoffsForRecord([entry],{...target,focus:'w.ability.absent'}).length,0);
    assert.equal(recordHandoffQuery({...target,view:'making',focus:'working:w.rule.light'}).route,'#world/w/making/working%3Aw.rule.light');
});
test('private/sealed records stay out and only recognized report/proof metadata is returned',()=>{
    const proof={id:'proof',proposalId:entry.id,reportId:'report',testedBundleSha256:'1'.repeat(64),proof:{path:'docs/proof.json',resolvedPath:'docs/proof.json',sha256:'2'.repeat(64),hidden:'OMIT'},
        files:{proof:{status:'unchanged',hidden:'OMIT'}},entry:{route:'Normal entry',viewport:{width:1920,height:1080},fixture:'Named later fixture',hidden:'OMIT'},hidden:'OMIT'};
    const report={id:'report',proposalId:entry.id,consumer:{name:'Native light',path:'src/light.js',hidden:'OMIT'},playerRoute:'Make light',receipt:{path:'docs/light.md'},files:{consumer:{status:'unchanged'},receipt:{status:'changed'}},playtests:[proof],hidden:'OMIT'};
    const projected=handoffsForRecord([{...entry,implementationReports:[report,{...report,private:true}]},
        {...entry,private:true},{...entry,record:{...entry.record,sealed:['S1']}},{...entry,source:{...entry.source,scope:'private'}}],target);
    assert.equal(projected.length,1);assert.equal(projected[0].implementationReports.length,1);
    assert.equal(projected[0].implementationReports[0].playtests[0].entry.fixture,'Named later fixture');
    assert.equal(projected[0].implementationReports[0].files.receipt.status,'changed');
    assert.doesNotMatch(JSON.stringify(projected),/OMIT|hidden/);
    assert.deepEqual(handoffsForRecord([entry],target)[0].implementationReports,[],'a draft is not implementation proof');
});
test('record addresses reject traversal, URL fragments and unknown families',()=>{
    for(const invalid of [{world:'../w'},{view:'reader-scenes'},{type:'any'},{focus:'https://example.com'},{focus:'w.id#other'},{focus:''}])
        assert.throws(()=>recordHandoffQuery({...target,...invalid}),/exact public/);
});
