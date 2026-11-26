import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createContentRegistry,createExpansionState,advanceSimulation,loadExpansionState} from '../../src/expansion_engine.js';
import {compileStructuredPack,mergeStructuredPack,registerStructuredCommandExtension} from '../../src/structured_pack_definitions.js';
import {beginStructuredCampaign,planStructuredSelection,adoptStructuredExtension,structuredCampaignView} from '../../src/structured_pack_runtime.js';
import {commitSimulationCommand,cancelSimulationJob,previewSimulationCommand} from '../../src/simulation.js';
import {requireStructuredContent} from '../../src/structured_pack_state.js';
import {jsonData} from '../../src/simulation_contracts.js';
import {domainRegistry} from '../../src/domain_registry.js';
import {stageSea} from '../../src/ri_lead_sea_domain.js';
import {guLeadLife,riLeadId as id} from '../../src/world_packs/book_gu_lead_life.js';
import {guLeadSelection,leadMoonlightKey} from '../../src/world_packs/book_gu_lead_selection.js';
import {guLeadRefinement,guLeadRefinementStatus} from '../../src/world_packs/book_gu_lead_refinement.js';
import {guLeadVital} from '../../src/world_packs/book_gu_lead_vital.js';
import {guLeadBreakfast} from '../../src/world_packs/book_gu_lead_breakfast.js';
import {guLeadBreakfastAfterwards} from '../../src/world_packs/book_gu_lead_breakfast_afterwards.js';
import {guLeadHalfStone} from '../../src/world_packs/book_gu_lead_half_stone.js';
import {guLeadHalfStonePiece} from '../../src/world_packs/book_gu_lead_half_stone_piece.js';
import {registerRiStonePieces,planRiStoneSelection} from '../../src/ri_stone_pieces.js';
import {configureRiBreakfast} from '../../src/ri_breakfast.js';
import {guLeadFirstNightChoice,guFirstNightDrawnKey} from '../../src/world_packs/book_gu_lead_first_night_choice.js';
import {guLeadEarlyRecovery,guLeadEarlyRecoveryClockRequest} from '../../src/world_packs/book_gu_lead_early_recovery.js';
const hash=x=>'sha256:'+createHash('sha256').update(JSON.stringify(x)).digest('hex');
const stone=JSON.stringify({id:id('refinement.primeval_stone')}),drawn=JSON.stringify({id:id('refinement.drawn_stone')});
function start(install=true) {
 domainRegistry.initialize();
 const registry=createContentRegistry({worlds:[{id:'base.frontier',label:'Home'}]});
 const compiled=compileStructuredPack(guLeadLife,registry);mergeStructuredPack(compiled,registry);
 const d={...compiled.definition,contentHash:hash(guLeadLife),starts:guLeadLife.starts.map(s=>({...s,snapshotHash:hash(s)}))};
 const defs=[guLeadSelection,guLeadRefinement,guLeadVital,...(install?[guLeadEarlyRecovery]:[])];
 const ext=defs.map((raw,i)=>registerStructuredCommandExtension(raw,hash(raw),d,registry,undefined,{bundledInstant:i===3}));
 for(const command of registry.simulation.commands.values())jsonData(command);
 let nativeMinute=0,breakfast,halfStone,pieces,afterwards;
 const initial={registry,actorId:'player',worldId:'base.frontier',nativeAlive:true,nativeReady:true,busy:false,nativeBody:{id:'native.body',ownerId:'player',controllerId:'player',form:'human',lifeStage:'adult'},facts:{location:'Village'},external:{money:0},gameplay:{player:{inventory:{},skills:{Weightlifting:{xp:0,enabled:true}},reputation:{}}},vitals:{player:{health:60,max_health:60,stamina:40,max_stamina:40}},equipment:{player:{}}};
 const selection=planStructuredSelection(createExpansionState(717),d,initial);let {plan,record}=beginStructuredCampaign(selection.plan.state,d,initial,null,selection.selection);
 const ctx=name=>({...initial,worldId:d.world.id,nativeBody:plan.state.simulation.people.player.body,facts:{location:plan.state.simulation.people.player.location,calendarMinute:nativeMinute},external:plan.external,gameplay:plan.gameplay,targetId:registry.simulation.commands.get(id(name))?.targetId,structuredNative:{...record,bound:true,bodyId:plan.state.simulation.people.player.body.id}});
 const settle=()=>domainRegistry.stage(plan);
 return {get state(){return plan.state;},get record(){return record;},get energy(){return plan.state.simulation.energies.player[id('primeval')];},get stock(){return plan.gameplay.player.inventory;},get pocket(){return plan.state.simulation.owners['book.ri.lead.breakfast.fang_zheng']||{};},get known(){return plan.state.simulation.knowledge.player;},
 pace(){return guLeadEarlyRecoveryClockRequest(plan.state,record,ext[3]);},
 quote:n=>previewSimulationCommand(plan.state,registry,id(n),ctx(n)),
 act(n){const q=this.quote(n);assert.equal(q.eligible,true,n+': '+JSON.stringify(q));plan=commitSimulationCommand(plan.state,registry,{id:id(n)},ctx(n));settle();},
 step(n){nativeMinute+=n;plan=advanceSimulation(plan.state,registry,n,plan.external,plan.gameplay,{player:ctx()});settle();},
 cancel(){plan=cancelSimulationJob(plan.state,registry,plan.state.simulation.jobs[0].id,ctx());settle();},
 setNativeMinute(n){nativeMinute=n;},
 observe(){settle();},
 installBreakfast(){breakfast=registerStructuredCommandExtension(guLeadBreakfast,hash(guLeadBreakfast),d,registry,undefined,{bundledInstant:true});configureRiBreakfast({state:()=>plan.state,calendarMinute:()=>nativeMinute});settle();},
 admitBreakfast(){const next=adoptStructuredExtension(plan.state,d,record,breakfast,ctx());record=next.record;plan={...plan,...next.plan};},
 installBreakfastAfterwards(raw=guLeadBreakfastAfterwards){afterwards=registerStructuredCommandExtension(raw,hash(raw),d,registry,undefined,{bundledInstant:true});},
 admitBreakfastAfterwards(){const next=adoptStructuredExtension(plan.state,d,record,afterwards,ctx());record=next.record;plan={...plan,...next.plan};},
 installHalfStone(){halfStone=registerStructuredCommandExtension(guLeadHalfStone,hash(guLeadHalfStone),d,registry,undefined,{bundledInstant:true});},
 admitHalfStone(){const next=adoptStructuredExtension(plan.state,d,record,halfStone,ctx());record=next.record;plan={...plan,...next.plan};},
 installPieces(){pieces=registerStructuredCommandExtension(guLeadHalfStonePiece,hash(guLeadHalfStonePiece),d,registry,undefined,{bundledInstant:true});registerRiStonePieces();settle();},
 admitPieces(){const next=adoptStructuredExtension(plan.state,d,record,pieces,ctx());record=next.record;plan={...plan,...next.plan};settle();},
 selectPiece(key){plan=planRiStoneSelection(plan.state,ctx(),key);settle();},
 installFirstNight(){ext.push(registerStructuredCommandExtension(guLeadFirstNightChoice,hash(guLeadFirstNightChoice),d,registry,undefined,{bundledInstant:true}));},
 validateState(state){requireStructuredContent(record,new Map([[d.id,d]]),state);},
 installRecovery(){ext.push(registerStructuredCommandExtension(guLeadEarlyRecovery,hash(guLeadEarlyRecovery),d,registry,undefined,{bundledInstant:true}));},
 admit(i){const next=adoptStructuredExtension(plan.state,d,record,ext[i],ctx());record=next.record;plan={...plan,...next.plan};},
 validate(r=record){requireStructuredContent(r,new Map([[d.id,d]]),plan.state);},
 view(){return structuredCampaignView(plan.state,d,record,ctx());},
 trace(){return guLeadRefinementStatus(plan.state,record,ctx()).at(-1).value;},
 roundTrip(){const saved=domainRegistry.save({expansion:plan.state,content_packs:{structured:record},character:{health:60},'current location':plan.state.simulation.people.player.location}); const copy=JSON.parse(JSON.stringify(saved));requireStructuredContent(copy.content_packs.structured,new Map([[d.id,d]]),copy.expansion);plan={...plan,state:loadExpansionState(copy.expansion,registry)};record=copy.content_packs.structured;domainRegistry.load(copy);settle();return copy;}}
}
function earned(install=true) {
 const life=start(install),work=(n,t)=>{life.act(n);life.step(t);};
 work('muster',2);work('cross',5);work('circulate',5);life.admit(0);work('selection.week',10075);work('selection.take_moonlight',2);life.admit(1);work('refinement.go_home',120);work('refinement.search',360);work('refinement.storm_wait',4320);work('refinement.infuse',30);
 assert.equal(life.energy.reserve,14);assert.equal(life.stock[stone],6);assert.equal(life.stock[leadMoonlightKey],1);return life;
}

export {start,earned,hash,id,stone,drawn};
