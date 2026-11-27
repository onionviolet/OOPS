import test from 'node:test';
import assert from 'node:assert/strict';
import {handoffRouteExport} from '../prototypes/world-atlas/handoff-route-export.mjs';
const hash = n => String(n).repeat(64);
const report = {id:hash(2),playerRoute:'Great Hall → School day → Move the library ladder · 10 min',
    consumer:{path:'src/hp_library_work.js',sha256:hash(3)},receipt:{path:'docs/gm/receipt.md',sha256:hash(4)},
    files:{consumer:{status:'unchanged'},receipt:{status:'unchanged'}},
    playtests:[{id:hash(5),proof:{path:'docs/representations/evidence/proof.json',sha256:hash(6)},testedBundleSha256:hash(7),files:{proof:{status:'unchanged'}}}]};
const queue = [{id:hash(1),source:{raw:'PRIVATE SOURCE MUST NOT EXPORT'},record:{excerpt:'RAW PROSE'},implementationReports:[report]}];
const comparison = {bundleSha256:hash(7),entries:[{id:hash(1),exact:1,other:0,unverified:0}],unreadable:2};
test('portable export retains exact immutable identities, reported route and actual comparison counts',()=>{
    const result=handoffRouteExport(queue,comparison),out=result.handoffs[0].reports[0];
    assert.equal(result.schema,'atlas-manual-routes/1');assert.equal(result.counts.exact,1);assert.equal(result.unreadable,2);
    assert.equal(out.id,report.id);assert.equal(out.playerRoute,report.playerRoute);assert.equal(out.consumer.sha256,hash(3));
    assert.equal(out.playtests[0].comparison,'exact-match');assert.equal(out.sourceStatus,'unchanged');
    assert(!JSON.stringify(result).includes('PRIVATE'));assert(!JSON.stringify(result).includes('RAW PROSE'));
    assert.match(out.routeStatus,/prerequisites and current playability are not checked/);
});
test('changed source stays distinct from exact receipt; old, changed and absent proofs are qualified',()=>{
    const changed=structuredClone(queue);changed[0].implementationReports[0].files.consumer.status='changed';
    let out=handoffRouteExport(changed,comparison).handoffs[0].reports[0];assert.equal(out.sourceStatus,'changed');assert.equal(out.playtests[0].comparison,'exact-match');
    out=handoffRouteExport(queue,{...comparison,bundleSha256:hash(8)}).handoffs[0].reports[0];assert.equal(out.playtests[0].comparison,'different-build');
    changed[0].implementationReports[0].playtests[0].files.proof.status='changed';
    assert.equal(handoffRouteExport(changed,comparison).handoffs[0].reports[0].playtests[0].comparison,'unverified');
    assert.equal(handoffRouteExport(queue,{...comparison,bundleSha256:null}).handoffs[0].reports[0].playtests[0].comparison,'unverified');
    assert.equal(handoffRouteExport(queue,{entries:[]}).handoffs[0].comparison,null);
});
test('private, escaped and non-public evidence paths are omitted; empty queue exports no invented route',()=>{
    for(const path of ['docs/private/proof.json','docs/../private_packs/proof.json','C:/secret.json','docs\\proof.json','docs/sealed/proof.json']){
        const bad=structuredClone(queue);bad[0].implementationReports[0].receipt.path=path;
        assert.equal(handoffRouteExport(bad,comparison).handoffs[0].reports[0].implementationReceipt,null);
    }
    assert.deepEqual(handoffRouteExport([],{entries:[]}).handoffs,[]);
});
