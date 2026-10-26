import {treatmentNow,finishTreatment,bodyKey,treatmentCapacity} from './craft_body_treatment.js';
import {registerDomain,domainRegistry} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {active_effects} from './runtime_state.js';
import {ActiveEffect} from './active_effects.js';
import {calendarMinutes} from './world_rhythm.js';
import {depthOwner,setDepthOwner,depthView} from './craft_depth_domain.js';
import {craftingOwner,setCraftingOwner,validateOwner,validateCraftingEnvelope,validateFiring,isCraftedKey,quoteCrafting,stageCrafting,projectCrafting,EFFECT_ID,MATERIAL_CARRIER,REFERENCE_CARRIER,BIND_ID,OVERDOSE_ID,shortenPoison} from './crafting_frontier_runtime.js';
import {standingState,setStandingState,chargeCraftGrudge,craftGrudge} from './economy_standing_domain.js';
import {createCraftingHome} from './crafting_home.js';
import {ledgerOwner,setLedgerOwner,noteBatch,ledgerStamp,forecastCraft} from './craft_ledger_domain.js';
let native,panel;
// Each operation has one native owner. This domain never receives the game object.
export function configureCraftingDomain(operations){native=operations;}
function read(){return {...native.read(),depth:depthOwner(),temperingStage:domainRegistry.project('pledges')?.state.trial.stage||0};}
function applyConditioning(){const actor=native.actor?.();if(!actor?.getLevelableComponent)return;const b=depthOwner().body,c=read(),amount=b?.binding===bodyKey(c)?b.conditioning:0;const stats=actor.getLevelableComponent().stats,wanted=amount?{max_stamina:1+amount/100}:{};if(JSON.stringify(stats.multiplier.herbal_conditioning||{})===JSON.stringify(wanted))return;const full=actor.getFullStats(),hp=full.health,sp=full.stamina;stats.multiplier.herbal_conditioning=wanted;actor.updateStatsAndDisplay();const now=actor.getFullStats();now.health=Math.min(now.max_health,hp);now.stamina=Math.min(now.max_stamina,sp);}
// The panel view keys on the same native gate the quote reads, so a changed reason redraws (UIE16).
function project(){const c=read();return {...projectCrafting(craftingOwner,c.inventory),failures:ledgerStamp(),grudge:craftGrudge(),depth:depthView(c.clock,craftingOwner),treatment:treatmentNow(depthOwner().body,c),firing:depthOwner().firing?structuredClone(depthOwner().firing):null,clock:c.clock,temperingStage:c.temperingStage,blocked:c.blocked,location:c.location,world:c.world,discovered:craftingOwner!==null||c.world==='base.frontier'&&c.location==='Village'};}
function quote(request){const c=read();return quoteCrafting(craftingOwner,c.inventory,request,c);}
export function commitCraftingQuote(quoted){
 const c=read(),plan=stageCrafting(craftingOwner,c.inventory,quoted,c,depthOwner());
 for(const item of plan.items)if(item.amount<0)native.assertSpend(item.key);
 const transaction=beginNativeCraftTransaction({owners:[...native.itemOwners(),active_effects],bindings:[{get:()=>craftingOwner,set:setCraftingOwner},{get:ledgerOwner,set:setLedgerOwner},{get:depthOwner,set:setDepthOwner},{get:standingState,set:setStandingState}]});
 try{
  // Publish tentatively inside the existing native rollback boundary. create_save resolves item references against this owner.
  setCraftingOwner(plan.state);
  if(plan.batch)noteBatch(plan.batch);
  if(plan.failure){noteBatch(plan.failure.result,[plan.failure.code]);chargeCraftGrudge();}
  if(plan.depth)setDepthOwner(plan.depth);
  for(const item of plan.items)if(item.amount<0)native.removeItem(item.key,-item.amount);else native.addItem(item.key,item.amount);
   if(plan.grant){if(plan.grant.kind!=='skill')throw Error('This build can only grant skill experience.');native.addSkillXp(plan.grant.id,plan.grant.points);}
  if(plan.binding){
   for(const {id,duration} of shortenPoison(active_effects,plan.binding.strength))if(duration===null)delete active_effects[id];else active_effects[id].duration=duration;
   const mark=new ActiveEffect(plan.binding.effect);mark.craftExposure=structuredClone(plan.binding.effect.craftExposure);active_effects[BIND_ID]=mark;
  }
  if(plan.overdose){const mark=new ActiveEffect(plan.overdose);mark.craftExposure=structuredClone(plan.overdose.craftExposure);active_effects[OVERDOSE_ID]=mark;}
  if(plan.effect){const effect=new ActiveEffect(plan.effect);effect.craftExposure=structuredClone(plan.effect.craftExposure);active_effects[EFFECT_ID]=effect;}
  native.persist(()=>transaction.markDurable());
 }catch(error){if(transaction.status==='pending')transaction.rollback();throw error;}
 finally{applyConditioning();native.refresh();panel?.render();}
 return plan;
}
const useItem={accepts:isCraftedKey,quote:key=>quote({type:'use',key}),execute:commitCraftingQuote};
registerDomain({id:'crafting',initialState:()=>null,
 ownsItemKey:key=>isCraftedKey(key)||[MATERIAL_CARRIER,REFERENCE_CARRIER].includes(JSON.parse(key).id),
 save:()=>craftingOwner?structuredClone(validateOwner(craftingOwner)):undefined,
 validate:(slice,envelope)=>{
  validateCraftingEnvelope(slice,envelope);
  if(slice&&envelope['current time']){const now=calendarMinutes(envelope['current time']);validateFiring(envelope.craftDepth?.firing,slice,now);
   for(const node of Object.values(slice.sources.nodes))if(node.updatedAt>now)throw Error('Crafting source is ahead of the native calendar.');
   for(const e of Object.values(envelope.active_effects??{}))if(e.craftExposure?.appliedAt>now)throw Error('Crafting exposure is ahead of the native calendar.');
  }
 },migrate:slice=>slice==null?null:structuredClone(validateOwner(slice)),load:setCraftingOwner,
 commands:{planMedicinalResidue:amount=>{if(!native||!Number.isSafeInteger(amount)||amount<1)throw Error('Use an actual positive medicinal residue.');const d=structuredClone(depthOwner()),b=treatmentNow(d.body,native.read());if(b.job)throw Error('Finish the actual bodily treatment before retuning.');if(b.impurity+amount>treatmentCapacity(b))throw Error('Purge medicinal residue or expand this body’s vessel before retuning.');d.body={...b,impurity:b.impurity+amount};return d;},bodyChannels:()=>native?(treatmentNow(depthOwner().body,native.read()).channels||0):0,observedEffects:()=>[...new Set(Object.entries(craftingOwner?.knowledge?.player||{}).filter(([id])=>craftingOwner.products[id]).flatMap(([,k])=>k.facts.filter(f=>f.startsWith('effect:oral.'))))],quote,execute:commitCraftingQuote,useItem},
 projection:project,
 tick:minutes=>{if(!native||!(minutes>0))return;const d=depthOwner();if(d.body?.job&&d.body.binding===bodyKey(read()))setDepthOwner({...d,body:finishTreatment(d.body,read())});applyConditioning();if(d.firing)panel?.render();},
 refresh:()=>{if(native)applyConditioning();panel?.render();},panels:[()=>{panel=createCraftingHome({quote,execute:commitCraftingQuote,read:project,forecast:request=>forecastCraft({...request,control:Math.min(100,Math.floor((read().mind||0)+10*treatmentNow(depthOwner().body,read()).apparatus))})});}]
});
