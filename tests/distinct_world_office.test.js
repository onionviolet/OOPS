import test from 'node:test';
import assert from 'node:assert/strict';
import {planHome} from '../src/home_model.js';
import {planHomeOffice,officeDecision} from '../src/home_office.js';
import {STEWARD,COOK,KEEPER} from '../src/home_work_content.js';
import {SUPPLIER} from '../src/home_household_content.js';
import {HOME_PLACES as P} from '../src/home_content.js';
const k=id=>JSON.stringify({id});
const base=()=>({world:'base.frontier',location:P.manor.location,body:{id:'native.player.body',form:'human',hands:2,ownerId:'player',controllerId:'player'},playerFacts:{'home.institutionWorker':true,'home.familyDutyKept':true},resources:{'home.readingPractice':12},people:Object.fromEntries([STEWARD,COOK,KEEPER,SUPPLIER].map(id=>[id,{life:'alive',location:id===SUPPLIER?'Village':P.manor.location}])),staffFacts:{[STEWARD]:{'home.employed':true},[KEEPER]:{'home.employed':true,'home.officeQualified':true}},staffResources:{[STEWARD]:{'home.estateFunds':32,'home.energy':60,'home.wages':7},[KEEPER]:{'home.energy':60,'home.wages':11}},staffStock:{[COOK]:{},[SUPPLIER]:{[k('Rat meat chunks')]:12,[k('Rough wood log')]:8}},jobs:[]});
const home={properties:{manor:{access:true}}};
function run(c,type){const out={simEffects:[]};planHomeOffice(home,{type},c,out);for(const e of out.simEffects){if(e.type==='fact')(e.actor==='player'?c.playerFacts:(c.staffFacts[e.actor]||={}))[e.key]=e.value;else if(e.type==='resource')(c.staffResources[e.actor]||={})[e.key]=(c.staffResources[e.actor]?.[e.key]||0)+e.amount;}return out;}
test('W2 earned permission, reserve floor and living qualified succession retain actual holders and require successor review',()=>{
 const c=base();assert.throws(()=>run(c,'office_establish'),/Earn/);run(c,'office_earn');assert.equal(c.playerFacts['home.provisionOfficer'],true);run(c,'office_establish');
 assert.equal(c.staffResources[STEWARD]['home.estateFunds'],16);assert.equal(c.staffResources[STEWARD]['home.officeFunds'],16);assert.equal(officeDecision(c).status,'order');
 c.staffFacts[STEWARD]['home.leave']=true;assert.equal(officeDecision(c).status,'paused');
 const before=structuredClone(c);run(c,'office_succeed');assert.equal(c.staffResources[STEWARD]['home.officeFunds'],0);assert.equal(c.staffResources[KEEPER]['home.officeFunds'],16);
 assert.equal(c.staffResources[STEWARD]['home.wages'],7);assert.equal(c.staffResources[KEEPER]['home.wages'],11);assert.deepEqual(c.people,before.people);assert.deepEqual(c.staffStock,before.staffStock);assert.equal(c.resources['home.readingPractice'],12);
 assert.match(officeDecision(c).reason,/review/);const review=run(c,'office_review');assert.ok(review.simEffects.some(e=>e.type==='knowledge'&&e.actor===KEEPER));assert.equal(officeDecision(c).status,'order');
 c.staffResources[KEEPER]['home.officeFunds']=8;assert.match(officeDecision(c).reason,/reserve/);c.staffResources[KEEPER]['home.officeFunds']=16;c.people[KEEPER].life='dead';assert.equal(officeDecision(c).status,'paused');
 const voluntary=base();voluntary.playerFacts['home.provisionOfficer']=true;run(voluntary,'office_establish');run(voluntary,'office_succeed');assert.equal(voluntary.staffFacts[KEEPER]['home.officeReviewRequired'],true,'An available holder can voluntarily hand an earned mandate to a qualified living successor');
 const bad=base();bad.playerFacts['home.provisionOfficer']=true;run(bad,'office_establish');bad.staffFacts[STEWARD]['home.leave']=true;delete bad.staffFacts[KEEPER]['home.officeQualified'];assert.throws(()=>run(bad,'office_succeed'),/instruction/);
});
