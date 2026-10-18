import test from 'node:test';
import assert from 'node:assert/strict';
import {projectNearbyContext} from '../src/nearby_context_view.js';

const frame=()=>({place:'Village',people:[{id:'elder',name:'Village elder',role:'Neighbor',met:true,traits:['patient']},{id:'visitor',name:'Unmet traveler',met:false,traits:['private trait'],relationship:'private relationship'}],services:[{id:'clerk',name:'Supply clerk'}],things:[{id:'mixing',name:'Mixing counter',description:'Mix ingredients.'},{id:'projects',name:'Projects'},{id:'hidden',name:'Sealed subject',known:false}],actions:[{id:'talk:elder',target:'elder',label:'Talk with elder'},{id:'mixing',target:'mixing',label:'Open mixing',disabled:true,reason:'Busy'}]});
test('nearby representation separates admitted people and stations without changing source or executing commands',()=>{
 const input=frame(),before=structuredClone(input),view=projectNearbyContext(input,'mixing','A quiet village. Paths lead outward.');
 assert.deepEqual(view.people.map(p=>p.id),['elder','visitor']);assert.deepEqual(view.services.map(p=>p.id),['clerk','mixing']);
 assert.equal(view.subject.actions[0],input.actions[1]);assert.equal(view.subject.actions[0].disabled,true);
 assert.equal(view.descriptionLead,'A quiet village.');assert.equal(view.selectedId,'mixing');assert.deepEqual(input,before);
 assert.doesNotMatch(JSON.stringify(view),/private trait|private relationship|Sealed subject|Projects/);
});
test('a disappearing selection is reconciled without selecting or acting on a sibling',()=>{
 const input=frame();assert.equal(projectNearbyContext(input,'elder').selectedId,'elder');
 input.people=input.people.filter(p=>p.id!=='elder');const view=projectNearbyContext(input,'elder');
 assert.equal(view.selectedId,null);assert.equal(view.subject,null);assert.equal(view.missing,true);
 assert.equal(view.people[0].id,'visitor');
});
test('admitted conversation owns inspection while native work remains untouched',()=>{
 const input=frame();input.dialogue='elder';input.work={id:'native-job',remaining:17};const before=structuredClone(input);
 assert.equal(projectNearbyContext(input,'mixing').selectedId,'elder');assert.deepEqual(input,before);
 assert.equal(projectNearbyContext({...input,dialogue:null},'mixing').selectedId,'mixing');
});
test('service identities deduplicate and no absent routes, hours or danger are manufactured',()=>{
 const input=frame();input.things.push({id:'clerk',name:'Duplicate clerk'});
 const view=projectNearbyContext(input);assert.equal(view.services.filter(s=>s.id==='clerk').length,1);
 assert.equal(view.subject,null);assert.doesNotMatch(view.summary,/way|night|open|danger/);
});
