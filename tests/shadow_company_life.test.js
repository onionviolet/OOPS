import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {shadowCompanyLife as raw,companyId as id,companyKey as key,COMPANY_RANKS} from '../src/world_packs/book_shadow_company_life.js';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack} from '../src/structured_pack_definitions.js';
import {planStructuredSelection,beginStructuredCampaign,structuredCampaignView} from '../src/structured_pack_runtime.js';
import {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand} from '../src/simulation.js';
import {validateStructuredEnvelope} from '../src/structured_pack_state.js';
import {validateShadowCompanyEnvelope} from '../src/book_world_shadow_company_domain.js';
import {writeGameplayToEnvelope} from '../src/gameplay_transactions.js';
const hash=o=>'sha256:'+createHash('sha256').update(JSON.stringify(o)).digest('hex');
function setup(){
    const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});const compiled=compileStructuredPack(raw,registry);mergeStructuredPack(compiled,registry);
    const d={...compiled.definition,contentHash:hash(raw),starts:raw.starts.map(b=>({...b,snapshotHash:hash(b)}))};
    const context={registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,busy:false,nativeBody:{id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'},facts:{location:'Village'},external:{money:0},equipment:{player:{}},
        gameplay:{player:{inventory:{},skills:{Perception:{xp:0,enabled:false}},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}}};
    const selected=planStructuredSelection(createExpansionState(719),d,context),start=beginStructuredCampaign(selected.plan.state,d,context,null,selected.selection);let p=start.plan;
    const publish=out=>{p={...out,vitals:out.vitals||p.vitals};for(const e of out.unlocks||[])if(e.kind==='skill')p.gameplay.player.skills[e.id].enabled=true;
        if(out.native?.hpToFull!=null)p.vitals.player.health=p.vitals.player.max_health-out.native.hpToFull;
        if(out.native?.staminaToFull!=null)p.vitals.player.stamina=p.vitals.player.max_stamina-out.native.staminaToFull;};publish(p);
    const ctx=()=>({...context,worldId:d.world.id,nativeBody:p.state.simulation.people.player.body,facts:{location:p.state.simulation.people.player.location},external:p.external,gameplay:p.gameplay,vitals:p.vitals,
        structuredNative:{bound:true,worldId:d.world.id,bodyId:p.state.simulation.people.player.body.id,locationIds:d.locations.map(l=>l.id)}});
    return{registry,d,record:start.record,ctx,get p(){return p;},
        start(n){const command=d.simulation.commands.find(c=>c.id===id(n));publish(commitSimulationCommand(p.state,registry,{id:id(n)},{...ctx(),targetId:command?.targetId}));},
        quote(n){const c=d.simulation.commands.find(c=>c.id===id(n));return previewSimulationCommand(p.state,registry,id(n),{...ctx(),targetId:c?.targetId});},
        step(n){publish(advanceSimulation(p.state,registry,n,p.external,p.gameplay,{player:{...ctx(),vitals:p.vitals.player,equipment:{}}}));},
        cancel(){const j=p.state.simulation.jobs.find(j=>j.actorId==='player');publish(cancelSimulationJob(p.state,registry,j.id,ctx()));},
        envelope(){const save={character:{money:0,equipment:{}},expansion:p.state,content_packs:{schema:1,packs:{},structured:start.record},'current location':p.state.simulation.people.player.location,inventories:{person:{main_character:{}}},levels:{person:{main_character:{}}}};writeGameplayToEnvelope(save,p.gameplay,{player:{category:'person',id:'main_character'}});return save;}
    };
}
const hound=f=>f.p.state.simulation.people[id('hound')];
const bag=(f,n)=>f.p.gameplay.player.inventory[key(n)]||0;
const stock=(f,who,n)=>f.p.state.simulation.owners[id(who)][key(n)]||0;
const phase=f=>f.p.state.actors.player.facts[id('phase')];
function valid(f){validateStructuredEnvelope(f.envelope());validateShadowCompanyEnvelope(f.envelope());}
function campReady(){const f=setup();f.step(10);return f;}
function prepared(f,methods=[]){f.start('manifest');f.start('prepare');f.step(5);for(const n of methods){f.start('prepare_'+n);f.step(3);}f.start('enter');f.step(5);}

test('stored same-body recovery retains identity; manifest stops it, recall waits a full minute',()=>{
    const f=setup(),identity=hound(f).body.id;valid(f);assert.equal(hound(f).vitals.health,10);f.step(2);assert.equal(hound(f).vitals.health,12);
    f.start('manifest');assert(f.p.state.simulation.party.includes(id('hound')));f.step(3);assert.equal(hound(f).vitals.health,12);f.start('recall');f.step(1);assert.equal(hound(f).vitals.health,13);assert.equal(hound(f).body.id,identity);valid(f);
});
test('commission and cancellation conserve actual gem; independent sleep blocks companion while player completes useful work',()=>{
    const f=setup(),identity=hound(f).body.id;f.start('commission');assert.equal(bag(f,'gem'),1);assert.equal(stock(f,'hound','gem'),1);assert.equal(f.quote('manifest').eligible,false);valid(f);
    f.start('cancel_commission');assert.equal(bag(f,'gem'),2);assert.equal(stock(f,'hound','gem'),0);f.start('commission');f.step(1);
    const job=f.p.state.simulation.jobs.find(j=>j.actorId===id('hound'));assert.equal(job.due,31);assert.deepEqual(job.participants,[id('hound')]);assert.equal(stock(f,'hound','gem'),0);assert.equal(f.quote('cancel_commission').eligible,false);assert.equal(f.quote('commission').eligible,false);valid(f);
    f.start('camp_work');f.step(5);assert.equal(f.p.gameplay.player.skills.Perception.xp,1);assert.equal(f.p.state.simulation.jobs.length,1);
    f.step(25);assert.equal(hound(f).body.id,identity);assert.equal(hound(f).body.rank,1);assert.equal(hound(f).vitals.health,29);assert.equal(hound(f).vitals.max_health,29);assert.equal(hound(f).body.strike,6.75);assert.equal(bag(f,'gem'),1);valid(f);
});
test('broken, dead, wrong-controlled or manifested companion cannot receive gem',()=>{
    const f=setup();hound(f).body.broken=true;assert.equal(f.quote('commission').eligible,false);hound(f).body.broken=false;hound(f).body.controllerId='elsewhere';assert.equal(f.quote('commission').eligible,false);hound(f).body.controllerId='player';hound(f).life='dead';assert.equal(f.quote('manifest').eligible,false);hound(f).life='alive';
    f.start('manifest');assert.equal(f.quote('commission').eligible,false);assert.equal(bag(f,'gem'),2);
});
test('actual preparation and same-body rank change a played stage; two participants return and report pays allocated stock once',()=>{
    const rope=campReady();prepared(rope,['rope']);assert.equal(phase(rope),2);assert.equal(hound(rope).location,id('ruin'));valid(rope);rope.start('ledge_0');rope.step(10);assert.equal(hound(rope).vitals.health,19);assert.equal(phase(rope),3);rope.start('report');valid(rope);rope.step(5);assert.equal(phase(rope),4);assert.equal(bag(rope,'badge'),1);assert.equal(stock(rope,'warden','badge'),5);assert.equal(hound(rope).location,id('camp'));assert.equal(rope.p.state.simulation.people.player.location,id('camp'));assert.equal(rope.quote('report').eligible,false);valid(rope);
    const brace=campReady();prepared(brace,['brace']);brace.start('breach_0');brace.step(5);assert.equal(hound(brace).vitals.health,14.5);assert.equal(brace.p.vitals.player.health,57);brace.start('report');brace.step(5);assert.equal(brace.p.state.actors.player.facts[id('injury')],1);brace.start('manifest');assert.equal(brace.quote('prepare').eligible,false);brace.start('treat');brace.step(5);assert.equal(brace.p.vitals.player.health,60);valid(brace);
    const grown=campReady();grown.start('commission');grown.step(31);prepared(grown,['brace']);grown.start('breach_1');grown.step(5);assert.equal(hound(grown).vitals.health,24.375);valid(grown);
});
test('combined preparations work together; weak unsupported attempt fails and withdrawal returns escrow without payment',()=>{
    const both=campReady();prepared(both,['rope','brace']);both.start('supported_0');both.step(5);assert.equal(hound(both).vitals.health,19);assert.equal(both.p.vitals.player.health,60);valid(both);
    const weak=campReady();prepared(weak);weak.start('unprepared_0');weak.step(5);assert.equal(weak.p.state.actors.player.facts[id('report')],false);assert.equal(weak.quote('report').eligible,false);assert.equal(hound(weak).vitals.health,13);assert.equal(weak.p.vitals.player.health,55);
    weak.start('withdraw');weak.step(5);assert.equal(bag(weak,'badge'),0);assert.equal(stock(weak,'warden','badge'),6);assert.equal(phase(weak),4);assert.equal(bag(weak,'ration'),6);valid(weak);
    const strong=campReady();strong.start('commission');strong.step(31);prepared(strong);strong.start('unprepared_1');strong.step(5);assert.equal(strong.p.state.actors.player.facts[id('report')],true);valid(strong);
});
test('preparation/return cancellation refunds exact allocated badge and reserves actual participant attention',()=>{
    const f=campReady();f.start('manifest');f.start('prepare');valid(f);assert.equal(stock(f,'hound','badge'),1);assert.equal(bag(f,'ration'),6);assert.equal(f.quote('recall').eligible,false);f.cancel();assert.equal(stock(f,'warden','badge'),6);assert.equal(stock(f,'hound','badge'),0);assert.equal(bag(f,'ration'),8);valid(f);
    f.start('prepare');f.step(5);f.start('prepare_rope');f.step(3);f.start('enter');f.step(5);f.start('ledge_0');f.step(10);f.start('report');assert.equal(bag(f,'badge'),1);valid(f);f.cancel();assert.equal(bag(f,'badge'),0);assert.equal(stock(f,'hound','badge'),1);assert.equal(phase(f),3);assert.equal(hound(f).location,id('ruin'));valid(f);
});
test('pending sleep and travel retain exact deadlines, stocks and body through serialization; corrupted clocks/gems/escrow refuse',()=>{
    const f=setup();f.start('commission');f.step(8);const save=JSON.parse(JSON.stringify(f.envelope()));validateShadowCompanyEnvelope(save);assert.deepEqual(loadExpansionState(save.expansion,f.registry),f.p.state);assert.equal(save.expansion.simulation.jobs[0].due-save.expansion.clock,23);
    for(const change of [s=>s.expansion.simulation.jobs[0].due++,s=>delete s.expansion.simulation.controllers[id('shadow_work')],s=>s.inventories.person.main_character[key('gem')].count++,s=>s.expansion.simulation.checks[id('recover_0')].due++]){const bad=structuredClone(save);change(bad);assert.throws(()=>validateShadowCompanyEnvelope(bad));}
    const t=campReady();prepared(t,['rope']);t.start('ledge_0');t.step(3);const field=JSON.parse(JSON.stringify(t.envelope()));validateShadowCompanyEnvelope(field);assert.deepEqual(loadExpansionState(field.expansion,t.registry),t.p.state);assert.equal(field.expansion.simulation.jobs[0].due-field.expansion.clock,7);
});
test('coarse and fine recovery/sleep advancement is identical; view projects actual saved wake deadline',()=>{
    const a=setup(),b=setup();a.start('commission');b.start('commission');a.step(31);for(let i=0;i<31;i++)b.step(1);assert.deepEqual(a.p.state,b.p.state);valid(a);valid(b);
    const f=setup();f.start('commission');f.step(4);const view=structuredCampaignView(f.p.state,f.d,f.record,f.ctx());assert(view.status.some(r=>r.value.includes('27 played minutes remaining')));assert.equal(f.quote('camp_work').eligible,true);
});
test('lost binding support refunds the companion-held catalyst without growth or a second charge',()=>{
    const f=setup();f.start('commission');f.step(1);f.p.state.simulation.faculties.player[id('shadow_binding')].suppressed=true;f.step(30);
    assert.equal(hound(f).body.rank,0);assert.equal(stock(f,'hound','gem'),1);assert.equal(bag(f,'gem'),1);assert.equal(f.p.state.simulation.jobs.length,0);valid(f);
    f.p.state.simulation.faculties.player[id('shadow_binding')].suppressed=false;f.start('cancel_commission');assert.equal(bag(f,'gem'),2);valid(f);
});
test('earned reports buy finite real gems and all six rises retain identity up to actual highest-rank refusal',()=>{
    const f=campReady(),identity=hound(f).body.id;
    for(const method of ['rope','rope','brace','brace']){
        prepared(f,[method]);f.start(method==='rope'?'ledge_0':'breach_0');f.step(method==='rope'?10:5);f.start('report');f.step(5);
        if(method==='brace'){f.start('treat');f.step(5);}valid(f);
    }
    assert.equal(bag(f,'badge'),4);for(let i=0;i<4;i++)f.start('buy_gem');assert.equal(bag(f,'gem'),6);assert.equal(stock(f,'warden','gem'),0);
    for(const r of COMPANY_RANKS.slice(0,-1)){f.start('commission');f.step(r.sleep+1);assert.equal(hound(f).body.rank,r.index+1);assert.equal(hound(f).body.id,identity);valid(f);}
    assert.equal(bag(f,'gem'),0);assert.equal(f.quote('commission').eligible,false);assert.equal(hound(f).vitals.health,COMPANY_RANKS.at(-1).health);
});
