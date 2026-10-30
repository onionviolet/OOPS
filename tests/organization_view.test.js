import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,advanceSimulation} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement} from '../src/management/host.js';
import {I} from '../src/management/shared.js';
import {courtyardOrganization} from '../src/management/organization_source.js';
import {organizationView,organizationText,ORG_KINDS,standingTrack} from '../src/organization_view.js';
import {FIGURE_FIXTURES_ORGANIZATIONS} from '../src/ui/preview/fixtures/organizations.js';
import {figureText} from '../src/ui/figure.js';

const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=(p,extra={})=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:p.vitals||{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village'},nativeBody:body,nativeAlive:true,nativeReady:true,managementPlayerLocation:'Village',managementPlayerAlive:true,managementHost:true,...extra});
const act=(p,c)=>{const o=commitManagement(p.state,registry,c,ctx(p),p.state.sequence);return {...o,vitals:o.vitals||p.vitals};};
const start=()=>act({state:initializeExpedition(createExpansionState(17)),external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{Village:12}}}},{id:I.begin});
const org=p=>courtyardOrganization(p.state,registry,ctx(p));

test('ORG a fresh life has no organization until the courtyard is visited',()=>{
 const p={state:initializeExpedition(createExpansionState(17)),external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{}}}};
 assert.equal(org(p),null);
});
test('ORG courtyard overview lists people, an idle empty state and standing words',()=>{
 const v=organizationView(org(start()));
 assert.deepEqual(v.members.map(m=>m.name),['Mira','Orin','Sela','Bram']);
 assert.equal(v.members[0].role,'courtyard concessioner');
 assert.equal(v.operations.length,0);assert.match(v.empty,/Nothing is running/);
 assert.equal(v.standing.rank,'Known Face');assert.equal(v.standing.next.name,'Neighbour');
 assert.equal(v.money.onHand,102);
 assert.match(organizationText(v),/Village standing: Known Face/);
});
test('ORG a running job shows its owner, held inputs and time left, and clears when it ends',()=>{
 let p=start();for(let i=0;i<2;i++)p=act(p,{id:'mg.supply.log'});
 p=act(p,{id:'mg.workshop.bram_ordinary'});
 const v=organizationView(org(p));
 assert.equal(v.operations.length,1);
 const o=v.operations[0];assert.equal(o.who,'you');assert.equal(o.timeLeft,4);assert.deepEqual(o.held,['2 Rough wood log']);
 assert.match(organizationText(v),/4 played minutes left/);
 assert.equal(v.members.find(m=>m.id===I.bram).doing,o.label);
 const c=ctx(p),others=Object.fromEntries(Object.keys(p.state.simulation.people).filter(id=>id!=='player').map(id=>[id,{...c,actorId:id,vitals:p.state.simulation.people[id].vitals,facts:{...c.facts,location:undefined}}]));
 const out=advanceSimulation(p.state,registry,4,p.external,p.gameplay,{player:{...c,vitals:c.vitals.player},...others});
 assert.equal(organizationView(courtyardOrganization(out.state,registry,c)).operations.length,0);
});
test('ORG every kind has nouns; missing parts are absent, not zero',()=>{
 for(const kind of Object.keys(ORG_KINDS)){
  const v=organizationView({id:'x',name:'The Test',kind,members:[{id:'a',name:'A',role:'r'}]});
  assert.equal(v.money,null);assert.equal(v.standing,null);assert.ok(v.rosterLabel);assert.match(v.summary,new RegExp(ORG_KINDS[kind].noun));
 }
 assert.throws(()=>organizationView({}),/needs an id/);
 assert.equal(standingTrack(organizationView({id:'x',name:'N'})),null);
});
test('ORG gallery fixtures validate and carry a text form',()=>{
 assert.ok(FIGURE_FIXTURES_ORGANIZATIONS.length>=2);
 for(const f of FIGURE_FIXTURES_ORGANIZATIONS)assert.ok(figureText(f).includes(f.title));
});
