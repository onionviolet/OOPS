// ORIGINAL Village trial. Uses the engine's composition law, not the older mixture law.
import {frontierCatalogue as catalogue,frontierBrewLaw as law} from './craft_content_frontier.js';
import {defineSourceTable,forecastHarvest,harvest,nodeKey} from './craft_sources.js';
import {createCraftState,freezeMaterials,setSourceNode,recordProduct,observe,projectProduct,projectMaterial,validateCraftState} from './craft_state.js';
import {resolveBatch,BATCH_FAMILY} from './craft_resolver.js';
import {classifyProductKey,keyForProduct,resolveProductKey} from './craft_product_registry.js';
export {catalogue,law};
export const MATERIAL_CARRIER='Gathered herb',PRODUCT_CARRIER=law.carrier,EFFECT_ID='Crafted herbal preparation';
export const villageSources=defineSourceTable(catalogue,{id:'village.trial-sources',revision:1,sources:[
 {id:'village-herbs',name:'Village common herb verge',kind:'gather',at:'village',capacity:12,regenPerDay:12,
  variants:{reedherb:2},quality:[40,60],yields:[{family:'reedherb',qty:[1,2]}]}
]});
export const materialKey=(material,quality)=>JSON.stringify({id:MATERIAL_CARRIER,materialRef:material.id,quality});
const fail=m=>{throw Error(m);};
const natural=n=>Number.isSafeInteger(n)&&n>=0;
export let craftingOwner=null;
export function setCraftingOwner(value){craftingOwner=value??null;}
export function materialFromKey(key,owner=craftingOwner) {
 const k=JSON.parse(key);if(k.id!==MATERIAL_CARRIER)return null;
 const material=owner?.materials?.[k.materialRef]??catalogue.materials[k.materialRef];
 if(!material||!natural(k.quality)||k.quality>100||materialKey(material,k.quality)!==key)fail('Invalid gathered material reference.');
 return {material,quality:k.quality};
}
export function productFromNativeKey(key,owner=craftingOwner) {
 const hit=classifyProductKey(key);if(hit?.family!==BATCH_FAMILY)return null;
 return resolveProductKey(key,{crafting:owner}).product;
}
export function isCraftedKey(key){return classifyProductKey(key)?.family===BATCH_FAMILY;}
export function validateOwner(owner) {
 if(owner==null)return null;
 if(owner.scope?.world!=='base.frontier'||!natural(owner.scope?.life))fail('Unsupported crafting scope.');
 return validateCraftState(owner,{catalogues:{[catalogue.ref]:catalogue},laws:{[law.ref]:law},sourceTables:{[villageSources.ref]:villageSources}});
}
export function craftedExposure(product,at) {
 if(!product||product.law!==law.ref||!natural(at))fail('Invalid herbal preparation.');
 const oral=product.outputs.oral??{},duration=12;
 return {id:EFFECT_ID,name:EFFECT_ID,description:'An observed original herbal preparation; a new dose replaces the old one.',duration,
  effects:{stats:{health_regeneration_flat:{flat:(oral.health??0)/10},stamina_regeneration_flat:{flat:(oral.stamina??0)/10},health_loss_flat:{flat:-(oral.poison??0)/10}},bonus_skill_levels:{}},
  tags:{effect:true},group_tags:{},affected_by_travel:true,base_xp_value:1,potency:0,
  craftExposure:{revision:1,product:product.id,appliedAt:at,expiresAt:at+duration,policy:'replace'}};
}
export function validateCraftedExposure(saved,product,id=EFFECT_ID) {
 const x=saved?.craftExposure;if(!x||id!==EFFECT_ID||!natural(x.appliedAt)||x.revision!==1||x.policy!=='replace'||x.product!==product?.id)fail('Dangling crafted exposure.');
 const expected=craftedExposure(product,x.appliedAt);
 if(JSON.stringify(x)!==JSON.stringify(expected.craftExposure)||!Number.isFinite(saved.duration)||saved.duration<=0||saved.duration>expected.duration||
    JSON.stringify(saved.effects)!==JSON.stringify(expected.effects)||saved.name!==expected.name||saved.id!==expected.id||
    saved.affected_by_travel!==true||saved.base_xp_value!==1||saved.potency!==0||JSON.stringify(saved.group_tags)!=='{}'||JSON.stringify(saved.tags)!=='{"effect":true}')fail('Invalid crafted exposure.');
 return saved;
}
export function validateCraftingEnvelope(slice,envelope) {
 validateOwner(slice);
 function walk(value){if(!value||typeof value!=='object')return;for(const [key,row]of Object.entries(value)){
  if(key.startsWith('{')){const k=JSON.parse(key);if(k.id===MATERIAL_CARRIER)materialFromKey(key,slice);else if(classifyProductKey(key)?.family===BATCH_FAMILY)productFromNativeKey(key,slice);}
  else walk(row);
 }}
 walk(envelope.inventories);walk(envelope.inventory);
 const at=envelope['current time'];
 // Native calendar validation owns the calendar itself. Future-node checks happen in the domain validator.
 for(const [id,e]of Object.entries(envelope.active_effects??{}))if(e.craftExposure)validateCraftedExposure(e,slice?.products?.[e.craftExposure.product],id);
 return slice;
}
export function projectCrafting(owner,inventory) {
 return {materials:Object.entries(inventory).filter(([key])=>{try{return JSON.parse(key).id===MATERIAL_CARRIER;}catch{return false;}}).map(([key,count])=>({key,count,...projectMaterial(owner,catalogue,materialFromKey(key,owner).material.id,'player')})),
  products:Object.entries(inventory).filter(([key])=>isCraftedKey(key)).map(([key,count])=>{const p=productFromNativeKey(key,owner);return {key,count,...projectProduct(owner,catalogue,p.id,'player')};})};
}
function eligibility(context){return context.ready&&context.world==='base.frontier'&&context.location==='Village'?'':'Return free and alive to Village, with saving available.';}
function inputLots(request,owner,inventory) {
 if(!Array.isArray(request.inputs)||!request.inputs.length||request.inputs.length>12)fail('Select at least one carried material for an experiment.');
 const unique=new Set();return request.inputs.map(({key,qty})=>{
  if(unique.has(key)||!Number.isSafeInteger(qty)||qty<1||qty>999||qty>(inventory[key]??0))fail('The selected material stock changed.');unique.add(key);
  const record=materialFromKey(key,owner);if(!record)fail('Select a gathered material.');return {key,qty,material:record.material};
 });
}
export function quoteCrafting(owner,inventory,request,context) {
 let reason=eligibility(context);
 if(!reason)try{
  validateOwner(owner);
  if(request.type==='harvest'){
   const source=request.source??'village-herbs';if(!villageSources.sources[source])fail('Unknown Village source.');
   const forecast=forecastHarvest(villageSources,source,{at:context.clock,actor:{skill:0},node:owner?.sources.nodes[nodeKey(context.world,context.location,source)]});
   if(!forecast.stock)fail('This verge is depleted; regrowth uses played time.');
  }else if(request.type==='craft'){
   const lots=inputLots(request,owner,inventory);
   resolveBatch(law,{inputs:lots.map(({material,qty})=>({material,qty})),process:request.process??[{op:'steep',level:1}],stations:[]});
  }else if(request.type==='use'){
   if(!(inventory[request.key]>0))fail('You no longer carry this preparation.');productFromNativeKey(request.key,owner)??fail('Choose a crafted herbal preparation.');
  }else fail('Unknown crafting command.');
 }catch(e){reason=e.message;}
 const token=JSON.stringify([owner?.sequence??null,inventory,context.clock,context.world,context.location,context.ready,request]);
 return {eligible:!reason,reason,token,request:structuredClone(request)};
}
export function stageCrafting(owner,inventory,quoted,context) {
 const fresh=quoteCrafting(owner,inventory,quoted.request,context);
 if(!fresh.eligible)fail(fresh.reason);if(fresh.token!==quoted.token)fail('This quote changed. Review the current materials and place again.');
 const request=fresh.request,at=context.clock;
 let next=owner?structuredClone(owner):createCraftState({world:'base.frontier',life:0});
 const items=[];let effect=null;
 if(request.type==='harvest'){
  const source=request.source??'village-herbs',key=nodeKey(context.world,context.location,source);
  const result=harvest(villageSources,{root:context.root,world:context.world,location:context.location,source,at,actor:{skill:0},node:next.sources.nodes[key]});
  if(!result.result.items.length)fail(result.result.reason);
  next=freezeMaterials(next,catalogue,result.result.items.map(i=>i.material));next=setSourceNode(next,key,result.node);
  for(const i of result.result.items)items.push({key:materialKey(i.material,i.quality),amount:i.qty});
 }else if(request.type==='craft'){
  const lots=inputLots(request,next,inventory),result=resolveBatch(law,{inputs:lots.map(({material,qty})=>({material,qty})),process:request.process??[{op:'steep',level:1}],stations:[]});
  next=recordProduct(next,result.product);for(const i of lots)items.push({key:i.key,amount:-i.qty});
  items.push({key:keyForProduct(BATCH_FAMILY,result.product),amount:1});
 }else {
  const p=productFromNativeKey(request.key,next);effect=craftedExposure(p,at);items.push({key:request.key,amount:-1});
  next=observe(next,'player',p.id,Object.keys(p.outputs.oral??{}).map(e=>`effect:oral.${e}`),at);
 }
 next.sequence++;validateOwner(next);
 return {state:next,items,effect};
}
