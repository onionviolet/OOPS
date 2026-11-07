import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState} from '../src/expansion_engine.js';
import {initializeExpedition,expeditionRegistry as registry} from '../src/expedition_content.js';
import {commitManagement} from '../src/management/host.js';
import {I} from '../src/management/shared.js';
import '../src/management/group_source.js';
import {bare,hostOver} from './lotm_helpers.js';
import {LOTM_IDS} from '../src/book_world_lotm_ids.js';
import '../src/book_world_lotm_organizations.js';
import {setCities} from '../src/book_world_lotm_cities.js';
import {defineGathering} from '../src/gatherings.js';
import {groupsOf,registerGroupSource,groupLines,GROUP_KINDS} from '../src/organizations.js';

const body={id:'native.player.body',form:'human',ownerId:'player',controllerId:'player',hands:2,mobile:true};
const ctx=p=>({actorId:'player',external:p.external,gameplay:p.gameplay,vitals:{player:{health:100,max_health:100,stamina:100,max_stamina:100}},
 facts:{location:'Village'},nativeBody:body,nativeAlive:true,nativeReady:true,managementPlayerLocation:'Village',managementPlayerAlive:true,managementHost:true});
const fresh=()=>({state:initializeExpedition(createExpansionState(17)),external:{money:102},gameplay:{player:{inventory:{},skills:{},reputation:{Village:12}}}});
const opened=()=>{const p=fresh(),o=commitManagement(p.state,registry,{id:I.begin},ctx(p),p.state.sequence);return {...p,state:o.state};};
const lotm=key=>{const o=hostOver(bare(50));o.host.enroll(key);return o.box.p.state;};
const row=()=>defineGathering({id:'fix.meeting',world:'fixture',label:'SECRET LABEL',schedule:{everyDays:3,offset:2,hour:20},dial:{secrecy:0.5},
 seats:[{id:'north',personaId:'mask.north'},{id:'south',personaId:'mask.south'}]});

test('GRP Frontier: an unopened courtyard has no group; the opened one projects as a household business',()=>{
 assert.deepEqual(groupsOf(fresh().state),[]);
 const gs=groupsOf(opened().state);
 assert.equal(gs.length,1);
 const g=gs[0];
 assert.equal(g.id,'base.frontier.group.courtyard');assert.equal(g.world,I.world);assert.equal(g.kind,'household_business');assert.equal(g.status,'active');
 assert.deepEqual(g.members.map(m=>m.name),['Mira','Orin','Sela','Bram']);
 assert.equal(g.members[0].rank,'courtyard concessioner');
 assert.deepEqual(g.standing,{owner:'faction_rank',region:'Village'});
 assert.equal('treasury' in g,false,'fields with no owner are omitted, not invented');
 assert.match(groupLines(gs)[0],/^Market courtyard, a household business \(active\)\. People: Mira \(courtyard concessioner\)/);
});
test('GRP LOTM: the entry profile projects its church team, member pointing at the position row',()=>{
 for(const [key,team] of [['probationer','Nighthawks'],['machinery','the Machinery team'],['storm','the Mandated Punishers']]){
  const gs=groupsOf(lotm(key));
  assert.equal(gs.length,1);
  assert.equal(gs[0].world,LOTM_IDS.world);assert.equal(gs[0].kind,'church_cell');assert.equal(gs[0].name,team);
  assert.equal(gs[0].members[0].positionId,`lotm.position.${key}.probationer`);
 }
});
test('GRP LOTM: a loaded hidden gathering is left out by default and never names personas or its label',()=>{
 const state=lotm('probationer');
 setCities([{region:{id:'fix.city'},gathering:row()}]);
 try{
  assert.equal(groupsOf(state).length,1,'hidden until a knowing owner exists');
  const all=groupsOf(state,{includeHidden:true});
  assert.equal(all.length,2);
  const g=all.find(x=>x.kind==='secret_society');
  assert.equal(g.hidden,true);assert.deepEqual(g.meeting,{everyDays:3,offset:2,hour:20,secrecy:0.5});
  assert.deepEqual(g.members,[{seatId:'north'},{seatId:'south'}]);
  const text=JSON.stringify(all);
  assert.equal(/mask\.|SECRET LABEL/.test(text),false);
 }finally{setCities([]);}
});
test('GRP worlds do not leak: each world sees only its own records',()=>{
 const f=opened().state,l=lotm('probationer');
 assert.ok(groupsOf(f).every(g=>g.world===I.world));
 assert.ok(groupsOf(l).every(g=>g.world===LOTM_IDS.world));
 assert.deepEqual(groupsOf(f,{world:LOTM_IDS.world}),[],'a Frontier state yields no LOTM record');
 assert.deepEqual(groupsOf(l,{world:I.world}),[],'a LOTM state yields no Frontier record');
 assert.equal(groupsOf({actors:{player:{worldId:'nowhere'}}}).length,0);
 registerGroupSource('fix.leaky',()=>[{id:'x',world:I.world,kind:'club',status:'active'}]);
 assert.throws(()=>groupsOf({},{world:'fix.leaky'}),/malformed/);
});
test('GRP projecting writes nothing: no new save key, fact or mutation',()=>{
 for(const state of [opened().state,lotm('civil'),lotm('probationer')]){
  const before=JSON.stringify(state),keys=Object.keys(state).join();
  groupsOf(state);groupsOf(state,{includeHidden:true});
  assert.equal(JSON.stringify(state),before);assert.equal(Object.keys(state).join(),keys);
  assert.equal('organizations' in state,false);
 }
});
test('GRP kind palette labels every row authored, palette or missing',()=>{
 for(const k of Object.values(GROUP_KINDS))assert.ok(['authored','palette','missing'].includes(k.basis),k.id);
 assert.equal(GROUP_KINDS.household_business.basis,'authored');assert.equal(GROUP_KINDS.cooperative.basis,'missing');
});
