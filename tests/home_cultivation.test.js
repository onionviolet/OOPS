import '../src/home_domain.js';
import {domainRegistry} from '../src/domain_registry.js';
import {migrateFortunes} from '../src/household_fortunes_domain.js';
import {stagePersonalLegacies} from '../src/home_personal_legacy.js';
import {createChronicle,advanceChronicle,lifespanDeadline,GAME_YEAR} from '../src/chronicle.js';
import {deriveHeirLeftovers,applyHeirLeftovers} from '../src/heir_inheritance.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createExpansionState,createContentRegistry,advanceSimulation,validateExpansionState,loadExpansionState} from '../src/expansion_engine.js';
import {planHome,emptyHomes,settleHomes,validateHomes,homeBenefits,homeRestable} from '../src/home_model.js';
import {homeWorkDefinitions,BUILDER,STEWARD,COOK,KEEPER,progressKey} from '../src/home_work_content.js';
import {ensureHomeSimulation,applyHomeSimulationEffects,stageHomeJob} from '../src/home_work.js';
import {applyGameplayEffect} from '../src/gameplay_transactions.js';
import {homeKey as k,HOME_PLACES as P,HOME_SITE,PACKED_TENT} from '../src/home_content.js';
import {isRainingOnDay} from '../src/weather_calendar.js';
import {settleHouseholdRest} from '../src/home_household.js';
import {TUTOR,SUPPLIER} from '../src/home_household_content.js';
import {deriveHomeEstate,applyHomeEstate} from '../src/home_inheritance.js';
const registry=createContentRegistry({worlds:[{id:'base.frontier'}],simulation:homeWorkDefinitions});
function rig(){
 let p={state:createExpansionState(19),external:{money:100},gameplay:{player:{inventory:{},skills:{Literacy:{xp:0,enabled:true},Meditation:{xp:0,enabled:true}},reputation:{}}}},s={...emptyHomes(),beginning:true},location='Village',rain=false;
 const body={id:'native.player.body',form:'human',hands:2,mobile:true,ownerId:'player',controllerId:'player'};
 const context=()=>({facts:{'cultivation.awakened':!!domainRegistry.command('household_fortunes','observedAwakened')?.(KEEPER)},world:'base.frontier',location,clock:p.state.clock,sequence:p.state.sequence,body:p.state.simulation?.people.player?.body||body,ready:!p.state.simulation?.jobs.some(j=>(j.participants||[j.actorId]).includes('player')),writable:true,alive:true,fresh:true,money:p.external.money,inventory:p.gameplay.player.inventory,unspendable:[],weatherAt:()=>({raining:rain}),resources:p.state.actors.player.resources,conditions:p.state.simulation?.conditions||{},people:p.state.simulation?.people||{},jobs:p.state.simulation?.jobs||[],staffResources:Object.fromEntries(Object.entries(p.state.actors).map(([id,a])=>[id,a.resources])),staffStock:p.state.simulation?.owners||{},staffFacts:Object.fromEntries(Object.entries(p.state.actors).map(([id,a])=>[id,a.facts])),playerFacts:p.state.actors.player.facts,warehouseCompleted:p.state.actors[SUPPLIER]?.completed?.[WAREHOUSE_JOB]||0});
 const settle=()=>{stagePersonalLegacies(p,context(),e=>applyHomeSimulationEffects(p,e,registry,context()));s=settleHomes(s,context(),null,e=>applyHomeSimulationEffects(p,e,registry,context()));if(s.properties.manor?.warehouse)stageWarehouse(p,context(),s,{applyEffects:e=>applyHomeSimulationEffects(p,e,registry,context()),stageJob:j=>stageHomeJob(p,j,registry,context())});validateHomes(s,context());validateExpansionState(p.state,registry);};
 const advance=n=>{const contexts=Object.fromEntries(Object.entries(p.state.simulation?.people||{}).map(([id,h])=>[id,{actorId:id,worldId:'base.frontier',facts:{location:id==='player'?location:h.location}}]));const previous=p.state;p=advanceSimulation(p.state,registry,n,p.external,p.gameplay,contexts);settleHouseholdRest(p,previous);settle();};
 return {get p(){return p;},get s(){return s;},context,advance,settle,go:l=>{location=l;if(p.state.simulation)p.state.simulation.people.player.location=l;},rain:v=>{rain=v;},materials:()=>{for(const id of ['Home fallen twigs','Home fallen poles','Home dry grass'])p.gameplay.player.inventory[k(id)]=30;},
 run(r){const c=context(),q=planHome(s,r,c);p=structuredClone(p);p.state.sequence++;for(const i of q.items)applyGameplayEffect(p.gameplay,{type:'item',key:i.key,amount:Math.abs(i.amount)},'player',i.amount<0);p.external.money+=q.money-c.money;applyHomeSimulationEffects(p,q.simEffects,registry,c);if(q.body){ensureHomeSimulation(p,location);p.state.simulation.people.player.body=q.body;}if(q.job)stageHomeJob(p,q.job,registry,c);s=q.state;if(q.location){location=q.location;if(p.state.simulation)p.state.simulation.people.player.location=location;}if(q.minutes)advance(q.minutes);else settle();return q;},
 reload(){p={...p,state:loadExpansionState(JSON.parse(JSON.stringify(p.state)),registry)};s=JSON.parse(JSON.stringify(s));settle();},
 };
}

import {QI_CRADLE,SEALED_CONDENSATE,QI_FIELD} from '../src/cultivation_items.js';
import {activeHouseholdField,householdFieldPower,CRADLE_FILM} from '../src/home_cultivation_content.js';
import {fieldOf,freshLayout} from '../src/home_layout.js';
function prepared(){const r=rig();r.run({type:'institution_join'});r.go('Village');r.run({type:'buy',item:QI_CRADLE});r.p.gameplay.player.inventory[k(SEALED_CONDENSATE)]=1;r.go(P.manor.location);r.run({type:'install',home:'manor',key:k(QI_CRADLE)});return r;}
test('physical qi uses one paid packet, shared jobs, earned NPC study and real native lesson XP',()=>{
 const r=prepared(),funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];
 assert.throws(()=>r.run({type:'cultivation_order',service:'study'}),/sealed packet/);
 r.run({type:'cultivation_order',service:'release'});assert.equal(r.p.gameplay.player.inventory[k(SEALED_CONDENSATE)]||0,0);
 assert.throws(()=>r.run({type:'remove',home:'manor',slot:'qi'}),/appointment|free body/);r.reload();r.advance(5);assert.equal(activeHouseholdField(r.context()),true);
 assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-2);
 assert.throws(()=>r.run({type:'cultivation_order',service:'lesson'}),/two actual circulation/);
 for(let i=0;i<2;i++){r.run({type:'cultivation_order',service:'study'});r.reload();r.advance(30);r.advance(20);}
 assert.equal(r.p.state.actors[KEEPER].resources['home.cultivationPractice'],2);
 r.run({type:'cultivation_order',service:'lesson'});r.reload();r.advance(30);
 assert.equal(r.p.gameplay.player.skills.Meditation.xp,12);assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],1);
 r.advance(30);assert.equal(r.p.gameplay.player.skills.Meditation.xp,12);
 const fixtures=r.s.properties.manor.fixtures,l=freshLayout('manor');
 assert.equal(fieldOf(l,fixtures,'manor','base.frontier').qi.flat().every(n=>n===0),true);
 assert.ok(fieldOf(l,fixtures,'manor','base.frontier',activeHouseholdField(r.context())).qi[2][2]>1);
 r.run({type:'remove',home:'manor',slot:'qi'});assert.equal(activeHouseholdField(r.context()),false);
});
test('packet cancellation refunds custody; expiry invalidates unfinished learning and refunds unearned wages',()=>{
 const r=prepared();r.run({type:'cultivation_order',service:'release'});r.run({type:'cultivation_cancel',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.gameplay.player.inventory[k(SEALED_CONDENSATE)],1);
 r.run({type:'cultivation_order',service:'release'});r.advance(5);r.advance(220);const funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];
 r.run({type:'cultivation_order',service:'study'});r.reload();r.advance(30);
 assert.equal(r.p.state.actors[KEEPER].resources['home.cultivationPractice']||0,0);assert.equal(activeHouseholdField(r.context()),false);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds);
});
test('distance and removing the actual cradle change its qi field without changing the Frontier sleep dial',()=>{
 const l=freshLayout('manor'),fixtures={bed:{},qi:{}};
 const far=fieldOf(l,fixtures,'manor','base.frontier',true).qi[0][0];l.at.qi=[1,0];const near=fieldOf(l,fixtures,'manor','base.frontier',true).qi[0][0];assert.ok(near>far);
 assert.equal(fieldOf(l,{bed:{}},'manor','base.frontier',true).qi.flat().every(n=>n===0),true);
});
import {frontierCatalogue as cat} from '../src/craft_content_frontier.js';
import {generateMaterial} from '../src/craft_materials.js';
import {freezeMaterials,createCraftState} from '../src/craft_state.js';
import {materialKey,quoteCrafting,stageCrafting,setCraftingOwner} from '../src/crafting_frontier_runtime.js';
import {householdTreatment,householdEnergyCap,householdLongevity} from '../src/home_medicine.js';
function tablet(){const material=generateMaterial(cat,'reedherb',{root:4,scope:'village',index:0}).value,owner=freezeMaterials(createCraftState({world:'base.frontier',life:0}),cat,[material]),key=materialKey(material,50),inventory={[key]:3,'{"id":"Charcoal"}':1},context={world:'base.frontier',location:'Village',clock:0,root:4,mind:60},req={type:'craft',layered:true,tablet:true,inputs:[{key,qty:3}],process:[{op:'heat',level:2}]};const p=stageCrafting(owner,inventory,quoteCrafting(owner,inventory,req,context),context);setCraftingOwner(p.state);return p.items.find(i=>i.amount>0).key;}
test('recipient tablets spend an actual resolved product, bind its benefit to that person and reserve real purge/capacity work',()=>{
 const r=prepared(),key=tablet();r.p.gameplay.player.inventory[key]=10;r.p.gameplay.player.inventory[k('Charcoal')]=12;
 const before=r.p.state.actors[KEEPER].resources['home.energy'];r.run({type:'medicine_dose',actor:KEEPER,key});const b=householdTreatment(r.context(),KEEPER);assert.ok(b.conditioning>0);assert.ok(b.impurity>0);assert.equal(r.p.gameplay.player.inventory[key],9);assert.equal(r.p.state.actors[KEEPER].resources['home.energy'],before,'dose does not refill current energy');
 assert.equal(householdEnergyCap(r.context(),KEEPER),60+Math.floor(b.conditioning/5));assert.equal(householdLongevity(r.context(),KEEPER),Math.floor(b.conditioning/20));r.reload();assert.deepEqual(householdTreatment(r.context(),KEEPER),b);
 r.run({type:'medicine_purge',actor:KEEPER});assert.equal(r.p.gameplay.player.inventory[k('Charcoal')],10);assert.throws(()=>r.run({type:'medicine_dose',actor:KEEPER,key}),/actual work/);r.reload();r.advance(12);assert.equal(householdTreatment(r.context(),KEEPER).impurity,Math.max(0,b.impurity-5));
 r.run({type:'medicine_capacity',actor:KEEPER});r.run({type:'medicine_cancel',job:r.p.state.simulation.jobs[0].id});assert.equal(householdTreatment(r.context(),KEEPER).capacity,20);assert.equal(r.p.gameplay.player.inventory[k('Charcoal')],10);
 r.run({type:'medicine_capacity',actor:KEEPER});r.reload();r.advance(24);assert.equal(householdTreatment(r.context(),KEEPER).capacity,25);r.advance(24);assert.equal(householdTreatment(r.context(),KEEPER).capacity,25);r.advance(100);assert.equal(r.p.state.actors[KEEPER].resources['home.energy'],householdEnergyCap(r.context(),KEEPER));
 const original=r.p.state.simulation.people[KEEPER].body;r.p.state.simulation.people[KEEPER].body={...original,instanceId:'different-body'};assert.equal(householdEnergyCap(r.context(),KEEPER),60);assert.equal(householdLongevity(r.context(),KEEPER),0);r.run({type:'medicine_dose',actor:KEEPER,key});assert.equal(householdTreatment(r.context(),KEEPER).conditioning,b.conditioning);
 setCraftingOwner(null);
});

import {schoolRankQuote} from '../src/home_school.js';
test('school members learn concurrently, earn examined authority and spend merit on real instruction',()=>{
 const r=prepared();r.p.gameplay.player.inventory[k('Charcoal')]=12;r.run({type:'school_fund',amount:20});
 const purse=r.p.external.money;assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],52);r.run({type:'cultivation_order',service:'release'});r.advance(5);
 assert.throws(()=>r.run({type:'school_promote',actor:COOK}),/studies|reports/);
 for(let i=0;i<2;i++){for(const actor of [COOK,TUTOR])r.run({type:'school_study',actor});assert.equal(r.p.state.simulation.jobs.length,2);r.reload();r.advance(30);r.advance(20);}
 assert.equal(r.p.state.actors[COOK].resources['home.cultivationPractice'],2);assert.equal(r.p.state.actors[TUTOR].resources['home.cultivationPractice'],2);assert.equal(r.p.gameplay.player.skills.Meditation.xp,0);
 r.run({type:'school_survey',actor:COOK});r.run({type:'school_survey',actor:TUTOR});r.run({type:'school_survey',actor:'player'});r.reload();r.advance(45);
 for(const actor of [COOK,TUTOR]){assert.equal(r.p.state.actors[actor].resources['home.schoolReports'],1);assert.deepEqual(schoolRankQuote(r.context(),actor).reasons,[]);r.run({type:'school_promote',actor});}
 assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],3);assert.equal(r.p.state.actors.player.resources['home.schoolReports'],1);
 assert.equal(r.p.gameplay.player.inventory[k('Charcoal')],9);assert.equal(r.p.external.money,purse);
 r.run({type:'school_lesson',actor:COOK});r.reload();r.advance(30);assert.equal(r.p.gameplay.player.skills.Meditation.xp,18);assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],2);assert.equal(r.p.state.actors[COOK].resources['home.schoolLessons'],1);
 r.advance(30);assert.equal(r.p.gameplay.player.skills.Meditation.xp,18);
});
test('hosted comparisons snapshot actual practice, reserve both people, retain cooldown and refund cancellation',()=>{
 const r=prepared();r.run({type:'school_fund',amount:20});r.p.state.actors[KEEPER].resources['home.cultivationPractice']=4;r.p.state.actors[COOK].resources['home.cultivationPractice']=1;
 const funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];r.run({type:'school_meet',actor:KEEPER,other:COOK});assert.throws(()=>r.run({type:'staff_order',service:'cook'}),/busy|occupied|already|activity/);
 r.reload();r.advance(30);assert.equal(r.p.state.actors[KEEPER].resources['home.schoolMeetScore'],4);assert.equal(r.p.state.actors[COOK].resources['home.schoolMeetScore'],1);assert.equal(r.p.state.actors[COOK].resources['home.schoolMeets'],1);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-4);
 assert.throws(()=>r.run({type:'school_meet',actor:KEEPER,other:COOK}),/played day/);r.advance(1440);r.run({type:'school_meet',actor:KEEPER,other:COOK});const j=r.p.state.simulation.jobs[0];r.run({type:'school_cancel',job:j.id});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-4);assert.equal(r.p.state.actors[COOK].resources['home.schoolMeets'],1);assert.throws(()=>r.run({type:'school_meet',actor:KEEPER,other:COOK}),/played day/);
});
test('senior recognition follows each actual teacher and is granted once, with no copied bodily XP',()=>{
 const r=prepared();r.run({type:'school_fund',amount:60});r.p.gameplay.player.inventory[k('Charcoal')]=8;r.p.gameplay.player.inventory[k(SEALED_CONDENSATE)]=3;
 const startField=()=>{if(!activeHouseholdField(r.context())){r.run({type:'cultivation_order',service:'release'});r.advance(5);}};startField();
 for(let i=0;i<6;i++){if((r.context().conditions[KEEPER]?.[QI_FIELD]?.expiresAt||0)-r.context().clock<30){r.advance(60);startField();}r.run({type:'school_study',actor:COOK});r.advance(30);r.advance(20);}
 for(let i=0;i<3;i++){r.run({type:'school_survey',actor:COOK});r.advance(45);r.advance(20);}startField();
 r.run({type:'school_promote',actor:COOK});r.run({type:'school_promote',actor:COOK});assert.equal(r.p.state.actors[COOK].resources['home.schoolRank'],2);
 assert.throws(()=>r.run({type:'school_milestone',actor:COOK}),/two completed lessons/);
 for(let i=0;i<2;i++){startField();r.run({type:'school_lesson',actor:COOK});r.advance(30);r.advance(20);}
 r.run({type:'school_milestone',actor:COOK});r.reload();assert.ok(r.p.state.simulation.titles[COOK]['arlmere.circulation.mentor']);assert.throws(()=>r.run({type:'school_milestone',actor:COOK}),/claimed/);assert.equal(r.p.gameplay.player.skills.Meditation.xp,36);assert.equal(r.p.state.simulation.titles[TUTOR],undefined);
});
test('an actual personal station report causes a delayed named thank-you funded once from the sender’s own wages',()=>{
 const r=prepared();r.p.gameplay.player.inventory[k('Charcoal')]=3;const purse=r.p.external.money;
 r.run({type:'school_survey',actor:'player'});r.advance(45);const check=Object.values(r.p.state.simulation.checks).find(c=>c.definitionId==='home.contacts.report_return');assert.ok(check);r.reload();r.advance(1440);assert.equal(r.p.external.money,purse,'an unfunded sender does not mint a gift');
 r.run({type:'school_survey',actor:TUTOR});r.advance(45);assert.equal(r.p.state.actors[TUTOR].resources['home.wages'],2);r.reload();r.advance(1440);assert.equal(r.p.external.money,purse+1);assert.equal(r.p.state.actors[TUTOR].resources['home.wages'],1);assert.equal(r.p.state.actors.player.resources['home.receivedReportLetters'],1);assert.equal(r.p.state.simulation.relationships[TUTOR].player.axes.gratitude,1);
 r.reload();r.advance(2880);assert.equal(r.p.external.money,purse+1);assert.equal(r.p.state.actors.player.resources['home.receivedReportLetters'],1);
});

import {stageWarehouse,WAREHOUSE_JOB,WOOD} from '../src/home_warehouse.js';
function warehouseRig(logs=3){const r=rig();r.run({type:'institution_join'});r.go('Village');r.run({type:'buy',item:'Home storage box'});r.go(P.manor.location);r.run({type:'install',home:'manor',key:k('Home storage box')});r.p.gameplay.player.inventory[WOOD]=logs;for(let i=0;i<logs;i++)r.run({type:'deposit',home:'manor',key:WOOD});r.p.state.actors.player.facts['home.maraTradeIntroduced']=true;return r;}
test('opted warehouse assessments use the existing queue, move conserved home goods and buyer funds, and stop at the reserve',()=>{
 const r=warehouseRig();r.run({type:'pantry_order'});r.advance(20);assert.equal(r.p.state.simulation.people[SUPPLIER].location,P.manor.location);assert.equal(r.p.state.actors[SUPPLIER].resources['home.wages'],8);const money=r.p.external.money,stock=r.p.state.simulation.owners[SUPPLIER][WOOD];
 r.run({type:'warehouse_start'});assert.ok(r.p.state.simulation.jobs.some(j=>j.commandId===WAREHOUSE_JOB));r.reload();r.advance(60);assert.equal(r.p.external.money,money+1);assert.equal(r.s.properties.manor.stock[WOOD],2);assert.equal(r.p.state.simulation.owners[SUPPLIER][WOOD],stock+1);assert.equal(r.p.state.actors[SUPPLIER].resources['home.wages'],7);
 r.reload();r.advance(60);assert.equal(r.p.external.money,money+2);assert.equal(r.s.properties.manor.stock[WOOD],1);assert.equal(r.p.state.actors[SUPPLIER].resources['home.wages'],6);assert.equal(r.p.state.simulation.jobs.some(j=>j.commandId===WAREHOUSE_JOB),false);r.advance(600);assert.equal(r.p.external.money,money+2);
});
test('withdrawn stock and an empty buyer purse hold goods without a phantom payout; stop cancels the real appointment',()=>{
 const r=warehouseRig();r.run({type:'pantry_order'});r.advance(20);r.run({type:'warehouse_start'});const money=r.p.external.money;r.run({type:'withdraw',home:'manor',key:WOOD});r.run({type:'withdraw',home:'manor',key:WOOD});r.advance(60);assert.equal(r.p.external.money,money);assert.equal(r.s.properties.manor.stock[WOOD],1);assert.equal(r.s.properties.manor.warehouse.last.outcome,'held');
 r.run({type:'deposit',home:'manor',key:WOOD});r.run({type:'warehouse_start'});r.run({type:'warehouse_stop'});r.advance(60);assert.equal(r.p.external.money,money);assert.equal(r.s.properties.manor.stock[WOOD],2);assert.equal(r.p.state.simulation.jobs.some(j=>j.commandId===WAREHOUSE_JOB),false);
 r.p.state.actors[SUPPLIER].resources['home.wages']=1;r.run({type:'warehouse_keep',keep:0});r.run({type:'warehouse_start'});r.advance(60);assert.equal(r.p.external.money,money+1);assert.equal(r.p.state.actors[SUPPLIER].resources['home.wages'],0);assert.equal(r.s.properties.manor.stock[WOOD],1);assert.equal(r.p.state.simulation.jobs.some(j=>j.commandId===WAREHOUSE_JOB),false);
});
test('contended warehouse wood rotates fairly into actual work buffers, whose normal jobs consume it',()=>{
 const r=warehouseRig(2);delete r.p.state.simulation.owners[COOK][WOOD];delete r.p.state.simulation.owners[KEEPER][WOOD];r.run({type:'warehouse_keep',keep:0});r.run({type:'withdraw',home:'manor',key:WOOD});r.run({type:'warehouse_allocate'});assert.equal(r.p.state.simulation.owners[COOK][WOOD],1);assert.equal(r.p.state.simulation.owners[KEEPER][WOOD]||0,0);
 r.run({type:'staff_order',service:'cook'});r.advance(10);assert.equal(r.p.state.simulation.owners[COOK][WOOD]||0,0);assert.equal(r.p.state.simulation.owners[COOK][k('Roasted rat meat')],2);r.run({type:'deposit',home:'manor',key:WOOD});r.run({type:'warehouse_allocate'});assert.equal(r.p.state.simulation.owners[KEEPER][WOOD],1);assert.equal(r.p.state.simulation.owners[COOK][WOOD]||0,0,'the still-needy cook waits for the other station’s saved turn');const integrity=r.s.properties.manor.condition.integrity;r.run({type:'staff_order',service:'repair'});r.advance(15);assert.ok(r.s.properties.manor.condition.integrity>integrity);assert.equal(r.s.properties.manor.stock[WOOD],undefined);
 const both=warehouseRig(2);delete both.p.state.simulation.owners[COOK][WOOD];delete both.p.state.simulation.owners[KEEPER][WOOD];both.run({type:'warehouse_keep',keep:0});both.run({type:'warehouse_allocate'});assert.equal(both.p.state.simulation.owners[COOK][WOOD],1);assert.equal(both.p.state.simulation.owners[KEEPER][WOOD],1);
});

test('qualified school offices reserve finite monthly stipends, retain personal cooldowns and never mint absent practice',()=>{
 const r=prepared();r.run({type:'school_fund',amount:40});r.p.gameplay.player.inventory[k('Charcoal')]=2;
 assert.throws(()=>r.run({type:'school_appoint',office:'records',actor:COOK}),/qualification/);
 // Qualifications are isolated controls here; their earned producer is covered above.
 Object.assign(r.p.state.actors[COOK].resources,{'home.schoolRank':2,'home.schoolReports':2});
 const funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];
 r.run({type:'school_appoint',office:'records',actor:COOK});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-3);
 assert.throws(()=>r.run({type:'school_appoint',office:'survey',actor:COOK}),/One local office/);
 const credits=r.p.state.actors.player.resources['home.cultivationContributions']||0,wages=r.p.state.actors[COOK].resources['home.wages'];
 r.run({type:'school_month',office:'records',actor:COOK});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-8);assert.equal(r.p.state.actors[COOK].resources['home.wages'],wages);
 r.reload();r.advance(59);assert.equal(r.p.state.actors.player.resources['home.cultivationContributions']||0,credits);r.advance(1);
 assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],credits+1);assert.equal(r.p.state.actors[COOK].resources['home.wages'],wages+5);
 assert.throws(()=>r.run({type:'school_month',office:'records',actor:COOK}),/school month/);r.advance(30*1440);assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],credits+1,'unattended months earn nothing');
 r.run({type:'school_month',office:'records',actor:COOK});const j=r.p.state.simulation.jobs.find(j=>j.commandId.startsWith('home.school.month.'));r.run({type:'school_cancel',job:j.id});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-8);assert.throws(()=>r.run({type:'school_month',office:'records',actor:COOK}),/school month/);
 r.run({type:'school_dismiss',office:'records',actor:COOK});assert.throws(()=>r.run({type:'school_appoint',office:'survey',actor:COOK}),/played day/);r.advance(1440);r.run({type:'school_appoint',office:'survey',actor:COOK});assert.throws(()=>r.run({type:'school_month',office:'survey',actor:COOK}),/school month/);
});
test('monthly school survey and instruction consume real inputs and share the ordinary work clock',()=>{
 const r=prepared();r.run({type:'school_fund',amount:40});r.p.gameplay.player.inventory[k('Charcoal')]=2;
 for(const actor of [COOK,TUTOR])Object.assign(r.p.state.actors[actor].resources,{'home.schoolRank':1,'home.schoolReports':2});
 r.run({type:'school_appoint',office:'survey',actor:COOK});r.run({type:'school_month',office:'survey',actor:COOK});r.advance(60);assert.equal(r.p.state.actors[COOK].resources['home.schoolReports'],3);assert.equal(r.p.gameplay.player.inventory[k('Charcoal')],1);
 r.run({type:'school_appoint',office:'instruction',actor:TUTOR});assert.throws(()=>r.run({type:'school_month',office:'instruction',actor:TUTOR}),/field|condition/i);
 r.run({type:'cultivation_order',service:'release'});r.advance(5);r.run({type:'school_month',office:'instruction',actor:TUTOR});r.reload();r.advance(60);
 assert.equal(r.p.gameplay.player.skills.Meditation.xp,24);assert.equal(r.p.state.actors.player.resources['home.cultivationContributions'],0);assert.equal(r.p.state.actors[TUTOR].resources['home.schoolMonths'],1);
});


test('a jointly recorded personal bequest settles actual wages once, holds for absence, and preserves institutional custody',()=>{
 const r=prepared();r.p.state.actors[COOK].resources['home.wages']=7;
 const sourceStock=structuredClone(r.p.state.simulation.owners[COOK]),funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];
 r.run({type:'legacy_agree',actor:COOK,next:TUTOR});assert.equal(r.p.state.actors[COOK].facts['home.legacy.beneficiary'],undefined);r.reload();r.advance(15);
 assert.equal(r.p.state.actors[COOK].facts['home.legacy.beneficiary'],TUTOR);assert.equal(r.p.state.simulation.relationships[COOK][TUTOR].axes.familiarity,1);
 r.p.state.simulation.people[TUTOR].location='Village';r.p.state.simulation.people[COOK].life='dead';r.settle();assert.equal(r.p.state.actors[COOK].resources['home.wages'],7);assert.equal(r.p.state.actors[COOK].facts['home.legacy.settled'],undefined);
 r.reload();r.p.state.simulation.people[TUTOR].location=P.manor.location;r.settle();assert.equal(r.p.state.actors[COOK].resources['home.wages'],0);assert.equal(r.p.state.actors[TUTOR].resources['home.wages'],7);assert.equal(r.p.state.actors[COOK].facts['home.legacy.settled'],true);assert.deepEqual(r.p.state.simulation.owners[COOK],sourceStock);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds);
 assert.match(r.p.state.simulation.knowledge[TUTOR]['home.legacy.receipt.'+COOK].value,/7 earned coins/);r.reload();r.advance(2);assert.equal(r.p.state.actors[TUTOR].resources['home.wages'],7);
});
test('cancelled or invalid bequests award no beneficiary and preserve the living person’s agency and effort',()=>{
 const r=prepared(),before=r.p.state.actors[COOK].resources['home.energy'];r.run({type:'staff_leave',actor:TUTOR});assert.throws(()=>r.run({type:'legacy_agree',actor:COOK,next:TUTOR}),/required|circumstances/);r.run({type:'staff_return',actor:TUTOR});r.run({type:'legacy_agree',actor:COOK,next:TUTOR});const j=r.p.state.simulation.jobs.find(j=>j.commandId.startsWith('home.legacy.'));r.run({type:'legacy_cancel',job:j.id});assert.equal(r.p.state.actors[COOK].resources['home.energy'],before);assert.equal(r.p.state.actors[COOK].facts['home.legacy.beneficiary'],undefined);
});

test('a beneficiary taking leave during a bequest appointment prevents completion and refunds the joint effort',()=>{
 const r=prepared();const before=r.p.state.actors[COOK].resources['home.energy'];r.run({type:'legacy_agree',actor:COOK,next:TUTOR});
 // The actual target changes their agreement while work is pending.
 r.p.state.actors[TUTOR].facts['home.leave']=true;r.reload();r.advance(15);assert.equal(r.p.state.actors[COOK].facts['home.legacy.beneficiary'],undefined);assert.equal(r.p.state.actors[COOK].resources['home.energy'],before);assert.equal(r.p.state.simulation.jobs.length,0);
});

test('six actual pair appointments form a complete conserved circuit with deterministic shared tiers and once-keyed person titles',()=>{
 const r=prepared();r.run({type:'school_fund',amount:60});for(const id of [KEEPER,COOK,STEWARD,TUTOR])r.p.state.actors[id].resources['home.cultivationPractice']=1;
 const before=r.p.state.actors[STEWARD].resources['home.estateFunds'],wages=Object.fromEntries([KEEPER,COOK,STEWARD,TUTOR].map(id=>[id,r.p.state.actors[id].resources['home.wages']||0]));r.run({type:'school_circuit_start'});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],before-36);assert.equal(r.p.state.actors[STEWARD].resources['home.schoolMatchFund'],24);assert.equal(r.p.state.actors[STEWARD].resources['home.schoolPrizeFund'],12);
 for(let i=0;i<6;i++){r.run({type:'school_circuit_next'});if(i===0){assert.throws(()=>r.run({type:'school_study',actor:KEEPER}),/appointment|occupied/);assert.throws(()=>r.run({type:'school_circuit_record'}),/finish/);}r.reload();r.advance(30);r.run({type:'school_circuit_record'});assert.equal(r.s.properties.manor.circuit.results.length,i+1);assert.throws(()=>r.run({type:'school_circuit_record'}),/actual|circuit|finish/);}
 assert.equal(r.s.properties.manor.circuit.status,'done');assert.equal(r.p.state.actors[STEWARD].resources['home.schoolMatchFund'],0);assert.equal(r.p.state.actors[STEWARD].resources['home.schoolPrizeFund'],0);
 for(const id of [KEEPER,COOK,STEWARD,TUTOR]){assert.equal(r.p.state.actors[id].resources['home.wages'],wages[id]+9);assert.equal(r.p.state.actors[id].resources['home.schoolCircuitWins'],1);assert.ok(r.p.state.simulation.titles[id]['arlmere.circulation.circuit-winner']);}
 r.reload();assert.throws(()=>r.run({type:'school_circuit_start'}),/week/);
});
test('cancelling an actual tournament pair returns reservations; retry and closure settle only actual unearned escrow',()=>{
 const r=prepared();r.run({type:'school_fund',amount:40});for(const id of [KEEPER,COOK,STEWARD,TUTOR])r.p.state.actors[id].resources['home.cultivationPractice']=2;const before=r.p.state.actors[STEWARD].resources['home.estateFunds'];r.run({type:'school_circuit_start'});r.run({type:'school_circuit_next'});assert.throws(()=>r.run({type:'school_circuit_close'}),/Cancel/);let j=r.p.state.simulation.jobs.find(j=>j.commandId.startsWith('home.school.tournament.'));r.run({type:'school_cancel',job:j.id});assert.equal(r.p.state.actors[STEWARD].resources['home.schoolMatchFund'],24);assert.throws(()=>r.run({type:'school_circuit_record'}),/cancelled|interrupted/);r.run({type:'school_circuit_next'});r.advance(30);r.run({type:'school_circuit_record'});r.run({type:'school_circuit_close'});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],before-4);assert.equal(r.p.state.actors[STEWARD].resources['home.schoolPrizeFund'],0);assert.equal(r.p.state.actors[STEWARD].resources['home.schoolMatchFund'],0);assert.equal(r.p.state.actors[COOK].resources['home.wages'],2);assert.equal(r.p.state.actors[COOK].facts['home.schoolCircuitWinner'],undefined);
});


test('an observed awakening qualifies a distinct paid finer lesson; cancellation and expiry conserve its reservations',()=>{
 const fortunes=domainRegistry.list().find(d=>d.id==='household_fortunes');fortunes.load(null);const r=prepared();r.run({type:'school_fund',amount:20});r.run({type:'cultivation_order',service:'release'});r.advance(5);r.p.state.actors[KEEPER].resources['home.cultivationPractice']=2;assert.throws(()=>r.run({type:'cultivation_order',service:'awakened_lesson'}),/awakening/);fortunes.load(migrateFortunes({lastDay:0,members:{[KEEPER]:{fed:1,tended:1,lack:0,signs:0,since:0,awakened:{day:0}}}}));
 const funds=r.p.state.actors[STEWARD].resources['home.estateFunds'],xp=r.p.gameplay.player.skills.Meditation.xp;r.run({type:'cultivation_order',service:'awakened_lesson'});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-3);r.run({type:'cultivation_cancel',job:r.p.state.simulation.jobs[0].id});assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds);assert.equal(r.p.gameplay.player.skills.Meditation.xp,xp);r.run({type:'cultivation_order',service:'awakened_lesson'});r.reload();r.advance(30);assert.equal(r.p.gameplay.player.skills.Meditation.xp,xp+18);assert.equal(r.p.state.actors.player.resources['home.awakenedLessons'],1);r.advance(1);assert.equal(r.p.state.actors.player.resources['home.awakenedLessons'],1);r.advance(300);assert.throws(()=>r.run({type:'cultivation_order',service:'awakened_lesson'}),/sealed packet/);fortunes.load(null);
});

// A revision changes newly accepted work; an old job keeps its actual frozen contract.
import fs from 'node:fs';
test('revision-one in-flight circulation loads under revision two and completes with its original paid effects, without invented film',()=>{
 const old=JSON.parse(fs.readFileSync(new URL('../docs/gm/dispatch/cultivation-absorption-2026-10-24/checks/fixtures/awakening-command-golden.json',import.meta.url))).commands.find(d=>d.id==='home.cultivation.release'),current=registry.simulation.commands.get(old.id),r=prepared();
 try{registry.simulation.commands.set(old.id,old);r.run({type:'cultivation_order',service:'release'});}finally{registry.simulation.commands.set(old.id,current);}
 const frozen=structuredClone(r.p.state.simulation.jobs[0]);assert.equal(frozen.revision,1);r.reload();assert.deepEqual(r.p.state.simulation.jobs[0],frozen);r.advance(5);assert.equal(activeHouseholdField(r.context()),true);assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM]||0,0);assert.equal(householdFieldPower(r.context()),1);
});
test('actual packet use gradually attenuates the same physical field, and paid maintenance restores output only on completion',()=>{
 const r=prepared();r.run({type:'cultivation_order',service:'release'});r.advance(5);assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],1);const dirty=householdFieldPower(r.context());assert.equal(dirty,1/1.05);const home=r.s.properties.manor,l=freshLayout('manor'),field=()=>fieldOf(l,home.fixtures,'manor','base.frontier',householdFieldPower(r.context())).qi[2][2],before=field(),funds=r.p.state.actors[STEWARD].resources['home.estateFunds'],wages=r.p.state.actors[KEEPER].resources['home.wages'];r.p.gameplay.player.inventory[k('Charcoal')]=1;r.run({type:'cultivation_order',service:'clean'});assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],1);assert.equal(field(),before);r.advance(14);assert.equal(field(),before);r.advance(1);assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],0);assert.equal(householdFieldPower(r.context()),1);assert.ok(field()>before);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds-2);assert.equal(r.p.state.actors[KEEPER].resources['home.wages'],wages+2);assert.equal(r.p.gameplay.player.inventory[k('Charcoal')]||0,0);r.reload();assert.equal(householdFieldPower(r.context()),1);
});
test('canceling release/maintenance preserves actual residue and packing the portable cradle does not clean its estate feed-space',()=>{
 const r=prepared();r.run({type:'cultivation_order',service:'release'});let job=r.p.state.simulation.jobs.find(j=>j.commandId==='home.cultivation.release');r.run({type:'cultivation_cancel',job:job.id});assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM]||0,0);r.run({type:'cultivation_order',service:'release'});r.advance(5);r.p.gameplay.player.inventory[k('Charcoal')]=1;const funds=r.p.state.actors[STEWARD].resources['home.estateFunds'];r.run({type:'cultivation_order',service:'clean'});job=r.p.state.simulation.jobs.find(j=>j.commandId==='home.cultivation.clean');r.run({type:'cultivation_cancel',job:job.id});assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],1);assert.equal(r.p.gameplay.player.inventory[k('Charcoal')],1);assert.equal(r.p.state.actors[STEWARD].resources['home.estateFunds'],funds);r.run({type:'remove',home:'manor',slot:'qi'});assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],1);assert.equal(activeHouseholdField(r.context()),false);r.run({type:'install',home:'manor',key:k(QI_CRADLE)});assert.equal(r.p.state.actors[STEWARD].resources[CRADLE_FILM],1);
});
