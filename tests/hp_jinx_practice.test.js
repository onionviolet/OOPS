// Harry's duel jinxes: read up in the library, practised on Ron, and the practice reaching the corridor duel's hit (hp_lead_spells.js,
// hp_duel_mastery.js). One pack start per file, cloned per test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {packNative} from '../src/world_pack_registry.js';
import {createContentRegistry,createExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,advanceSimulationBoundary,previewSimulationCommand} from '../src/simulation.js';
import {hpLeadJinxReadCommands,hpLeadJinxCommands,hpLeadJinxChances,hpLeadSpellFacts,HP_JINX} from '../src/hp_lead_spells.js';
import {hpLibraryReason} from '../src/book_world_hp_lessons.js';
import {hpSpellPower,duelHit,practisedKitRow} from '../src/hp_duel_mastery.js';
const P='book.hp.lead',DAY=1440,WAND=JSON.stringify({id:'book.hp.lead.spell_practice.class_wand'});
const READ_LEG=`${HP_JINX}.leg_lock.read`,USE_LEG=`${HP_JINX}.use.leg_lock`,READ_BIND=`${HP_JINX}.body_bind.read`,USE_BIND=`${HP_JINX}.use.body_bind`;
const hash=v=>'sha256:'+createHash('sha256').update(JSON.stringify(v)).digest('hex');
const raw=packNative(P),registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Frontier'}]}),compiled=compileStructuredPack(raw,registry);
mergeStructuredPack(compiled,registry);
const d={...compiled.definition,contentHash:hash(raw),starts:compiled.definition.starts.map(b=>({...b,snapshotHash:hash(b)}))};
const context={registry,actorId:'player',worldId:'base.frontier',external:{money:0},gameplay:{player:{inventory:{},skills:{},reputation:{}}},vitals:{player:{health:100,stamina:100,max_health:100,max_stamina:100}},nativeAlive:true,nativeReady:true,nativeBody:{form:'human',ownerId:'player',controllerId:'player',lifeStage:'adult',hands:2,mobile:true}};
const ctxFor=(f,plan=f.plan)=>({...context,worldId:P+'.world',gameplay:plan.gameplay,external:plan.external,vitals:plan.vitals,structuredNative:{...f.record,bound:true},facts:{location:plan.state.simulation.people.player.location}});
const atDay=(f,day,min=1)=>{f.plan.state.clock=f.opening+day*DAY-480+min;};
const preview=(f,id)=>previewSimulationCommand(f.plan.state,registry,id,ctxFor(f));
// The panel's row: the campaign view names the first unmet mechanism (structured_action_reasons.js).
const row=(f,id)=>structuredCampaignView(f.plan.state,d,f.record,ctxFor(f)).actions.find(a=>a.id===id);
function run(f,id){
 const started=commitSimulationCommand(f.plan.state,registry,{id},ctxFor(f));
 const job=started.state.simulation.jobs.find(j=>j.commandId===id);
 if(job){started.state.clock=job.due;advanceSimulationBoundary(started,registry,{player:ctxFor(f,started)});}
 f.plan=started;return started.state;
}
// One shared start: arrived on 1 September and sorted.
const shared=(()=>{
 const sel=planStructuredSelection(createExpansionState(123),d,context),begun=beginStructuredCampaign(sel.plan.state,d,context,null,sel.selection);
 const f={record:begun.record,plan:begun.plan,opening:begun.plan.state.simulation.knowledge.player[P+'.opening'].at};
 atDay(f,32,10);run(f,P+'.arrive_school');run(f,P+'.sorting');atDay(f,34,120);return f;
})();
const fresh=()=>({...shared,plan:structuredClone(shared.plan)});
const mastery=(f,row)=>f.plan.state.simulation.powers.player?.[hpSpellPower(row)]?.mastery;
const stamina=f=>f.plan.vitals?.player?.stamina;

test('failure scenario: a jinx not yet read up stays visible and blocked, and trying it spends nothing',()=>{
 const f=fresh();f.plan.gameplay.player.inventory[WAND]=1;
 for(const [id,words] of [[USE_LEG,'Locomotor Mortis'],[USE_BIND,'Petrificus Totalus']]){
  const p=row(f,id);assert.ok(p,'the row is visible');assert.equal(p.eligible,false);assert.match(p.reasons.join(' '),new RegExp(`Read up ${words} first`));
 }
 const before=structuredClone(f.plan);
 assert.throws(()=>commitSimulationCommand(f.plan.state,registry,{id:USE_LEG},ctxFor(f)));
 assert.deepEqual(f.plan,before,'no stamina, practice or clock spent');
});

test('reading up teaches the jinx once; practice on Ron needs a class wand and adds one step a try, landed or not',()=>{
 const f=fresh();
 {const r=row(f,READ_LEG);assert.equal(r.eligible,true,JSON.stringify(r.reasons)+JSON.stringify(preview(f,READ_LEG).reasons));}
 run(f,READ_LEG);
 assert.equal(f.plan.state.simulation.powers.player[hpSpellPower('leg-lock')].owned,true);
 assert.equal(mastery(f,'leg-lock'),0);
 assert.equal(preview(f,READ_LEG).eligible,false,'read once');
 assert.equal(mastery(f,'body-bind'),undefined,'the body-bind is its own record');
 const noWand=row(f,USE_LEG);assert.equal(noWand.eligible,false);assert.match(noWand.reasons.join(' '),/class wand/);
 f.plan.gameplay.player.inventory[WAND]=1;
 const s0=stamina(f);
 for(let i=1;i<=3;i++){run(f,USE_LEG);assert.equal(mastery(f,'leg-lock'),i);}
 assert.equal(stamina(f),s0-3,'1 stamina a try');
 assert.equal(f.plan.state.simulation.powers.player[P+'.levitation'],undefined,'no carry-over to or from the charm');
 const chances=hpLeadJinxChances(f.plan.state);
 assert.ok(Math.abs(chances[USE_LEG]-0.3)<1e-9,'60% at no practice, 10 points off per step');
 // The duel reads the same number.
 const kitRow=practisedKitRow({label:'Locomotor Mortis',text:'x',cost:4,power:0,hit:1.2},f.plan.state,'leg-lock');
 assert.equal(kitRow.hit,duelHit(1.2,3));
 const reloaded=loadExpansionState(JSON.parse(JSON.stringify(f.plan.state)),registry);
 assert.equal(reloaded.simulation.powers.player[hpSpellPower('leg-lock')].mastery,3,'practice survives save and reload');
});

test('the library rule matches hpLibraryReason across term, holidays and exams; the body-bind starts harder',()=>{
 const f=fresh();
 for(const day of [34,100,145,160,250,300,322,330]){
  atDay(f,day,120);
  const open=hpLeadSpellFacts(f.plan.state)['hp.lead.jinx.term'];
  assert.equal(open,!hpLibraryReason(f.plan.state),`day ${day}`);
  if(!open)assert.match(row(f,READ_BIND).reasons.join(' '),/library is shut/);
 }
 assert.equal(hpLeadJinxChances(f.plan.state)[USE_BIND],0.7);
 assert.equal(hpLeadJinxReadCommands.length,2);assert.equal(hpLeadJinxCommands.length,2);
 for(const c of hpLeadJinxCommands){assert.deepEqual(c.participants,['player',P+'.ron']);assert.deepEqual(c.costs,[{type:'vital',key:'stamina',amount:-1}]);}
});
