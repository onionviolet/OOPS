import {registerDomain} from './domain_registry.js';
import {beginNativeCraftTransaction} from './native_craft_transaction.js';
import {active_effects} from './runtime_state.js';
import {ActiveEffect} from './active_effects.js';
import {calendarMinutes} from './world_rhythm.js';
import {craftingOwner,setCraftingOwner,validateOwner,validateCraftingEnvelope,isCraftedKey,quoteCrafting,stageCrafting,projectCrafting,EFFECT_ID} from './crafting_frontier_runtime.js';
import {createCraftingHome} from './crafting_home.js';
let native,panel;
// Each operation has one native owner. This domain never receives the game object.
export function configureCraftingDomain(operations){native=operations;}
function read(){return native.read();}
function quote(request){const c=read();return quoteCrafting(craftingOwner,c.inventory,request,c);}
export function commitCraftingQuote(quoted){
 const c=read(),plan=stageCrafting(craftingOwner,c.inventory,quoted,c);
 for(const item of plan.items)if(item.amount<0)native.assertSpend(item.key);
 const transaction=beginNativeCraftTransaction({owners:[...native.itemOwners(),active_effects],bindings:[{get:()=>craftingOwner,set:setCraftingOwner}]});
 try{
  // Publish tentatively inside the existing native rollback boundary. create_save resolves item references against this owner.
  setCraftingOwner(plan.state);
  for(const item of plan.items)if(item.amount<0)native.removeItem(item.key,-item.amount);else native.addItem(item.key,item.amount);
  if(plan.effect){const effect=new ActiveEffect(plan.effect);effect.craftExposure=structuredClone(plan.effect.craftExposure);active_effects[EFFECT_ID]=effect;}
  native.persist(()=>transaction.markDurable());
 }catch(error){if(transaction.status==='pending')transaction.rollback();throw error;}
 finally{native.refresh();panel?.render();}
 return plan;
}
const useItem={accepts:isCraftedKey,quote:key=>quote({type:'use',key}),execute:commitCraftingQuote};
registerDomain({id:'crafting',initialState:()=>null,
 save:()=>craftingOwner?structuredClone(validateOwner(craftingOwner)):undefined,
 validate:(slice,envelope)=>{
  validateCraftingEnvelope(slice,envelope);
  if(slice&&envelope['current time']){const now=calendarMinutes(envelope['current time']);
   for(const node of Object.values(slice.sources.nodes))if(node.updatedAt>now)throw Error('Crafting source is ahead of the native calendar.');
   for(const e of Object.values(envelope.active_effects??{}))if(e.craftExposure?.appliedAt>now)throw Error('Crafting exposure is ahead of the native calendar.');
  }
 },migrate:slice=>slice==null?null:structuredClone(validateOwner(slice)),load:setCraftingOwner,
 commands:{quote,execute:commitCraftingQuote,useItem},
 projection:()=>{const c=read();return {...projectCrafting(craftingOwner,c.inventory),ready:c.ready,location:c.location,world:c.world,discovered:craftingOwner!==null||c.world==='base.frontier'&&c.location==='Village'};},
 tick:()=>panel?.render(),panels:[()=>{panel=createCraftingHome({quote,execute:commitCraftingQuote,read:()=>{const c=read();return {...projectCrafting(craftingOwner,c.inventory),ready:c.ready,location:c.location,world:c.world,discovered:craftingOwner!==null||c.world==='base.frontier'&&c.location==='Village'};}});}]
});
