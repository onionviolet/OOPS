import test from 'node:test';
import assert from 'node:assert/strict';
import {createKnownItemHotkeys, validateItemBindings, isTypingTarget} from '../src/absorb_p23/known_detail/hotkeys.js';
import {formatKnownNumber, projectKnownMethodChains, projectObservedDrops, methodRarityWords} from '../src/absorb_p23/known_detail/presentation.js';
import {validateKnownDetailEnvelope} from '../src/absorb_p23/host_joins/known_detail.js';
import {settleObservedDrops} from '../src/absorb_p23/known_detail/observations.js';

// known_detail: original fixture scope retained.
{
const memory = () => {const m = new Map(); return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)};};
function setup() {
    let state = {canWrite:true,items:[{id:'copy:1',label:'Known kit',known:true,owned:true,eligible:true,action:'use',inputFingerprint:'rev1'}]};
    const calls=[],notices=[]; let handler;
    const target={addEventListener:(event,fn)=>handler=fn,removeEventListener:()=>handler=null};
    const controller=createKnownItemHotkeys({read:()=>state,preflight:quote=>({eligible:quote.inputFingerprint==='rev1',command:{type:'native',id:quote.id}}),command:c=>calls.push(c),storage:memory(),target,notice:t=>notices.push(t),reserved:['f']});
    const key=(options={})=>{let prevented=false;handler({key:'k',preventDefault:()=>prevented=true,...options});return prevented;};
    return {controller,calls,notices,key,state,setState:s=>state=s};
}
test('binding, rebind, use and unbind retain the exact owned identity',()=>{
 const s=setup();s.controller.bind('copy:1','K');assert.equal(s.key(),true);assert.deepEqual(s.calls,[{type:'native',id:'copy:1'}]);
 s.controller.bind('copy:1','j');s.key();assert.equal(s.calls.length,1);s.key({key:'j'});assert.equal(s.calls.length,2);
 s.controller.unbind('copy:1');s.key({key:'j'});assert.equal(s.calls.length,2);
});
test('typing, composition, held keys, modifiers and handled events cannot fire',()=>{
 const s=setup();s.controller.bind('copy:1','k');
 for(const options of [{target:{closest:()=>true}},{repeat:true},{isComposing:true},{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{defaultPrevented:true}])assert.equal(s.key(options),false);
 assert.equal(s.calls.length,0);assert.equal(isTypingTarget({closest:()=>true}),true);
});
test('lost custody, hidden and stale items never substitute a spare or mutate',()=>{
 const s=setup();s.controller.bind('copy:1','k');
 for(const patch of [{owned:false},{known:false},{eligible:false},{inputFingerprint:'rev2'}]){s.state.items=[{id:'copy:1',known:true,owned:true,eligible:true,action:'use',inputFingerprint:'rev1',...patch}];s.key();}
 s.state.items=[];s.key();s.state.canWrite=false;s.key();assert.equal(s.calls.length,0);assert.equal(s.notices.length,6);
});
test('conflicting keys, duplicate identity, invalid schema and reserved keys reject',()=>{
 const s=setup();assert.throws(()=>s.controller.bind('copy:1','f'));assert.throws(()=>s.controller.bind('unknown','k'));
 s.controller.bind('copy:1','k');s.state.items.push({...s.state.items[0],id:'copy:2'});assert.throws(()=>s.controller.bind('copy:2','k'));
 assert.throws(()=>validateItemBindings({schema:2,bindings:{}}));assert.throws(()=>validateItemBindings({schema:1,bindings:{k:'x',j:'x'}}));
 s.state.items.push({...s.state.items[0]});s.key();assert.equal(s.calls.length,0);s.controller.destroy();
});
test('number formatting preserves exact values and rarity never derives from mastery',()=>{
 for(const value of [10000,-1234567,Number.MAX_SAFE_INTEGER,0.1])for(const mode of ['exact','compact','scientific'])assert.equal(formatKnownNumber(value,mode).exact,String(value));
 assert.equal(formatKnownNumber(9999,'compact').text,'9999');assert.throws(()=>formatKnownNumber(Infinity));
 assert.equal(methodRarityWords({known:false,text:'Secret'}),'');assert.equal(methodRarityWords({known:true,text:'Common'}),'Common');
});
test('known chains reuse native preview gates and do not create hidden descendants',()=>{
 const view={families:[{id:'hidden',learned:false},{id:'known',learned:true,mastery:2,row:{label:'Method'},milestones:[{at:2,label:'Known benefit',met:true}],actions:[{id:'action',row:{label:'Use',control:{enabled:false},surfaces:{preview:['Four played minutes']},reasons:['Missing known tool']}}]}]};
 const [chain]=projectKnownMethodChains(view);assert.equal(chain.id,'known');assert.equal(chain.actions[0].ready,false);assert.deepEqual(chain.actions[0].reasons,['Missing known tool']);assert.equal(chain.rarity,'');
});
test('drop details require creature-specific player observation; private odds stay absent',()=>{
 const fact={id:'drop',known:true,recipientId:'player',observed:true,label:{known:true,text:'Observed material'},count:1,rank:{known:false,text:'hidden'},chance:{known:false,text:'hidden'}};
 assert.deepEqual(projectObservedDrops([fact,{...fact,id:'unseen',observed:false},{...fact,recipientId:'npc'}]),[{id:'drop',label:'Observed material',count:1,rank:'',chance:''}]);
});
test('optional settings snapshot validates before mutation and preserves local keys',async()=>{
 globalThis.localStorage=memory();const d=await import('../src/display_settings.js');
 d.setDisplaySettings({numberFormat:'scientific',semGain:'#aabbcc'});const snapshot=d.exportDisplayPreferences();
 localStorage.removeItem(d.DISPLAY_KEY);assert.ok(d.adoptDisplayPreferences(snapshot).adopted.includes('numberFormat'));assert.equal(d.getDisplaySetting('numberFormat'),'scientific');
 localStorage.setItem(d.DISPLAY_KEY,JSON.stringify({numberFormat:'exact'}));d.adoptDisplayPreferences(snapshot);assert.equal(d.getDisplaySetting('numberFormat'),'exact');assert.equal(d.getDisplaySetting('semGain'),'#aabbcc');
 const before=localStorage.getItem(d.DISPLAY_KEY);assert.throws(()=>d.adoptDisplayPreferences({schema:2,settings:{}}));assert.equal(localStorage.getItem(d.DISPLAY_KEY),before);
 assert.throws(()=>d.validateDisplayPreferences({schema:1,settings:{hidden:'truth'}}));assert.deepEqual(d.adoptDisplayPreferences(undefined),{adopted:[]});
});

test('actual drop associations settle once per native kill and continue on later kills',async()=>{
 const {settleObservedDrops,validateDropObservations}=await import('../src/absorb_p23/known_detail/observations.js');
 const event={recipientId:'player',creatureId:'known-creature',killOrdinal:7,drops:[{itemId:'found-material',count:2}]};
 const first=settleObservedDrops(undefined,event);assert.equal(first.state.creatures['known-creature'].drops['found-material'],2);
 const duplicate=settleObservedDrops(JSON.parse(JSON.stringify(first.state)),event);assert.equal(duplicate.changed,false);
 const later=settleObservedDrops(first.state,{...event,killOrdinal:8});assert.equal(later.state.creatures['known-creature'].drops['found-material'],4);
 assert.equal(first.state.creatures['known-creature'].drops['found-material'],2);
 assert.throws(()=>validateDropObservations({schema:2,creatures:{}}));assert.throws(()=>settleObservedDrops(first.state,{...event,drops:[{itemId:'bad',count:-1}]}));
 assert.equal(settleObservedDrops(later.state,event).changed,false);assert.deepEqual(validateDropObservations(undefined),{schema:1,creatures:{}});
});

test('readiness uses the actual skill presenter and native preview without restating gates',async()=>{
 const {createExpansionState}=await import('../src/expansion_engine.js');
 const {expeditionRegistry:registry,initializeExpedition}=await import('../src/expedition_content.js');
 const {enrollSimulation,previewSimulationCommand}=await import('../src/simulation.js');
 const {skillExpansionPresentation,skillExpansionContext}=await import('../src/skill_expansion_host.js');
 const {SKILL_IDS}=await import('../src/skill_expansion_content.js');
 const context={actorId:'player',external:{money:30},gameplay:{player:{inventory:{},skills:{},reputation:{Village:0}}},facts:{location:'Village','village.craftsmanMet':true,'village.shackUnlocked':true},vitals:{player:{health:30,max_health:30,stamina:30,max_stamina:30}}};
 const plan=enrollSimulation(initializeExpedition(createExpansionState(17)),registry,context);
 plan.state.simulation.powers.player={[SKILL_IDS.trail]:{owned:true,mastery:2,fragments:[]}};
 const view=skillExpansionPresentation(plan.state,registry,context),chains=projectKnownMethodChains(view);
 const chain=chains.find(c=>c.id===SKILL_IDS.trail);assert.ok(chain);assert.equal(chain.mastery,2);assert.equal(chain.milestones[0].met,true);
 for(const a of chain.actions){
  const source=view.families.find(f=>f.id===chain.id).actions.find(row=>row.id===a.id);
  const native=previewSimulationCommand(plan.state,registry,a.id,{...skillExpansionContext(plan.state,context),targetId:source.targetId});
  assert.equal(a.ready,native.visible&&native.eligible);assert.deepEqual(a.reasons,source.row.reasons);
 }
 assert.ok(chain.actions.length>0);assert.equal(chains.some(c=>c.id===SKILL_IDS.brace),false);
});

}

// p23-host-joins-known-detail: original fixture scope retained.
{
test('legacy absence preserves the envelope; invalid optional schemas reject without mutation',()=>{
 const save={enemy_killcount:{Rat:99}},before=structuredClone(save);validateKnownDetailEnvelope(save);assert.deepEqual(save,before);
 for(const patch of [{display_preferences:{schema:2,settings:{}}},{p23_drop_observations:{schema:2,creatures:{}}}]){
  const envelope={...save,...patch},before=structuredClone(envelope);assert.throws(()=>validateKnownDetailEnvelope(envelope),/schema/);assert.deepEqual(envelope,before);
 }
});
test('actual loot associates only its own creature and cannot exceed native settlement history',()=>{
 const event={recipientId:'player',creatureId:'Rat',killOrdinal:1,drops:[{itemId:'Rat tail',count:2}]};
 const state=settleObservedDrops(undefined,event).state;
 validateKnownDetailEnvelope({enemy_killcount:{Rat:1},p23_drop_observations:state});
 assert.throws(()=>validateKnownDetailEnvelope({enemy_killcount:{Rat:0},p23_drop_observations:state}),/native kill/);
 assert.deepEqual(settleObservedDrops(state,event).state,state);
 const empty=settleObservedDrops(state,{...event,creatureId:'Wolf',killOrdinal:1,drops:[]}).state;
 assert.deepEqual(empty.creatures.Wolf.drops,{});assert.deepEqual(empty.creatures.Rat.drops,{'Rat tail':2});
});

}

