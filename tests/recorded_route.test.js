import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {emptyRoute,readRoute,nextRouteLeg,recordArrival} from '../src/recorded_route.js';
test('old saves have no route, recorded stops persist in order',()=>{
 const legacy=JSON.parse(readFileSync(new URL('./fixtures/skill-evolution-legacy.json',import.meta.url)));
 const start=readRoute(legacy.recorded_route);
 assert.deepEqual(start,emptyRoute());
 let row={...start,mode:'recording',life:'one',places:['Village']};
 row=recordArrival(row,'Village','Shack');
 assert.deepEqual(readRoute(JSON.parse(JSON.stringify(row))).places,['Village','Shack']);
 assert.equal(recordArrival(row,'Village','Shack').mode,'ready');
 assert.throws(()=>readRoute({...row,mode:'replaying',cursor:99}));
});
test('the idle step stops for hostiles, weather, closed places or a changed origin',()=>{
 const row={...emptyRoute(),mode:'replaying',life:'one',places:['Village','Shack'],cursor:1};
 const ctx={place:'Village',open:true};
 assert.equal(nextRouteLeg(row,ctx).to,'Shack');
 for(const change of [{hostile:true},{rain:true},{open:false},{place:'Forest'}])assert.ok(nextRouteLeg(row,{...ctx,...change}).reason);
});
