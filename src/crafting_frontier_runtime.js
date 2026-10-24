// ORIGINAL Village trial. Uses the engine's composition law, not the older mixture law.
import {natural} from './basics.js';
import {frontierCatalogue as catalogue,frontierBrewLaw as law} from './craft_content_frontier.js';
import {defineSourceTable,forecastHarvest,harvest,nodeKey} from './craft_sources.js';
import {createCraftState,freezeMaterials,setSourceNode,recordProduct,observe,projectProduct,projectMaterial,validateCraftState} from './craft_state.js';
import {resolveBatch,BATCH_FAMILY} from './craft_resolver.js';
import {formatBatchName} from './craft_item_name.js';
import {frontierDoseRules as doseRules} from './craft_content_frontier.js';
import {cancelOutputs,deriveProductName,applyDose,createDoseState} from './craft_dose_rules.js';
import {createExperimentLog,recordTrial,propertyView} from './craft_experiment_log.js';
import {classifyProductKey,keyForProduct,resolveProductKey} from './craft_product_registry.js';
export {catalogue,law};
export const MATERIAL_CARRIER='Gathered herb',PRODUCT_CARRIER=law.carrier,EFFECT_ID='Crafted herbal preparation',BIND_ID='Toxin binding',BIND_DURATION=60,OVERDOSE_ID='Herbal overdose';
export const villageSources=defineSourceTable(catalogue,{id:'village.trial-sources',revision:1,sources:[
 {id:'village-herbs',name:'Village common herb verge',kind:'gather',at:'village',capacity:12,regenPerDay:12,
  variants:{reedherb:2,riversalt:1},quality:[40,60],yields:[{family:'reedherb',weight:3,qty:[1,2]},{family:'riversalt',weight:1,qty:[1,2]}]}
]});
export const materialKey=(material,quality)=>JSON.stringify({id:MATERIAL_CARRIER,materialRef:material.id,quality});
const fail=m=>{throw Error(m);};
export const freshDepth=()=>({dose:createDoseState(),log:createExperimentLog()});
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
// IM25 composition name with the player-facing material names; the stored product keeps the exact ids.
export function compositionName(product,carrier,owner=craftingOwner) {
 const name=id=>owner?.materials?.[id]?.name??catalogue.materials[id]?.name??id;
 return formatBatchName({...product,carrier,inputs:product.inputs.map(([role,id,revision,qty])=>[role,name(id),revision,qty])});
}
export function isCraftedKey(key){return classifyProductKey(key)?.family===BATCH_FAMILY;}
export function validateOwner(owner) {
 if(owner==null)return null;
 if(owner.scope?.world!=='base.frontier'||!natural(owner.scope?.life))fail('Unsupported crafting scope.');
 return validateCraftState(owner,{catalogues:{[catalogue.ref]:catalogue},laws:{[law.ref]:law},sourceTables:{[villageSources.ref]:villageSources}});
}
const bindOf=product=>product?.law===law.ref?(product.outputs.oral?.bind??0):0;
// Revision 2 reads the product through the cancel table and any tolerance scales (permille per effect);
// revision 1 exposures from older saves keep the raw reading so they still validate.
export function craftedExposure(product,at,scales=null,revision=2) {
 if(!product||product.law!==law.ref||!natural(at))fail('Invalid herbal preparation.');
 const oral=(revision===1?product.outputs:cancelOutputs(doseRules,product.outputs).outputs).oral??{},duration=12,k=id=>revision===1?1:(scales?.[id]??1000)/1000;
 const mark={revision,product:product.id,appliedAt:at,expiresAt:at+duration,policy:'replace'};
 if(revision>1&&scales&&Object.keys(scales).length)mark.scales={...scales};
 return {id:EFFECT_ID,name:EFFECT_ID,description:'An observed original herbal preparation; a new dose replaces the old one.',duration,
  effects:{stats:{health_regeneration_flat:{flat:(oral.health??0)*k('health')/10},stamina_regeneration_flat:{flat:(oral.stamina??0)*k('stamina')/10},health_loss_flat:{flat:-(oral.poison??0)/10}},bonus_skill_levels:{}},
  tags:{effect:true},group_tags:{},affected_by_travel:true,base_xp_value:1,potency:0,craftExposure:mark};
}
// Taking more while the body is still dulled costs health: a condition, never a refusal (craft_dose_rules).
export function overdoseExposure(product,at,amount) {
 if(!product||!natural(at)||!natural(amount)||!amount)fail('Invalid overdose.');
 return {id:OVERDOSE_ID,name:OVERDOSE_ID,description:'The body was still full of the last preparation. The sourness passes with time.',duration:12,
  effects:{stats:{health_loss_flat:{flat:-amount/10}},bonus_skill_levels:{}},tags:{effect:true,poison:true},group_tags:{},affected_by_travel:true,base_xp_value:1,potency:0,
  craftExposure:{revision:2,product:product.id,appliedAt:at,expiresAt:at+12,policy:'replace',overdose:amount}};
}
// A salty preparation binds toxin: the saved mark records the dose; shortenPoison() is what changes conditions.
export function bindingExposure(product,at) {
 const strength=bindOf(product);if(!strength||!natural(at))fail('Invalid binding preparation.');
 return {id:BIND_ID,name:BIND_ID,description:`Bound toxin: poison conditions ran ${strength} minutes shorter. This mark changes no other stat.`,duration:BIND_DURATION,
  effects:{stats:{},bonus_skill_levels:{}},tags:{effect:true},group_tags:{},affected_by_travel:true,base_xp_value:1,potency:0,
  craftExposure:{revision:1,product:product.id,appliedAt:at,expiresAt:at+BIND_DURATION,policy:'replace',binds:strength}};
}
// Pure: each poison-tagged condition with its remaining minutes after binding; null means the condition ends.
export function shortenPoison(effects,strength) {
 return Object.entries(effects).filter(([,e])=>e?.tags?.poison&&e.duration>0).map(([id,e])=>({id,duration:e.duration>strength?e.duration-strength:null}));
}
export function validateCraftedExposure(saved,product,id=EFFECT_ID) {
 const x=saved?.craftExposure;if(!x||(id!==EFFECT_ID&&id!==BIND_ID&&id!==OVERDOSE_ID)||!natural(x.appliedAt)||(x.revision!==1&&!(x.revision===2&&id!==BIND_ID))||x.policy!=='replace'||x.product!==product?.id)fail('Dangling crafted exposure.');
 const expected=id===BIND_ID?bindingExposure(product,x.appliedAt):id===OVERDOSE_ID?overdoseExposure(product,x.appliedAt,x.overdose):craftedExposure(product,x.appliedAt,x.scales,x.revision);
 if(JSON.stringify(x)!==JSON.stringify(expected.craftExposure)||!Number.isFinite(saved.duration)||saved.duration<=0||saved.duration>expected.duration||
    JSON.stringify(saved.effects)!==JSON.stringify(expected.effects)||saved.name!==expected.name||saved.id!==expected.id||saved.description!==expected.description||
    saved.affected_by_travel!==true||saved.base_xp_value!==1||saved.potency!==0||JSON.stringify(saved.group_tags)!=='{}'||JSON.stringify(saved.tags)!==JSON.stringify(expected.tags))fail('Invalid crafted exposure.');
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
 const lots=Object.entries(inventory).filter(([key])=>{try{return JSON.parse(key).id===MATERIAL_CARRIER;}catch{return false;}});
 return {materials:lots.map(([key,count])=>{
   const {material}=materialFromKey(key,owner),subject=owner?.materials?.[material.id]?material.id:`authored:${material.id}`;
   return {key,count,...projectMaterial(owner,catalogue,material.id,'player'),props:propertyView(catalogue,material,owner?.knowledge?.player?.[subject]?.facts??[])};}),
  products:Object.entries(inventory).filter(([key])=>isCraftedKey(key)).map(([key,count])=>{
   const p=productFromNativeKey(key,owner),view=projectProduct(owner,catalogue,p.id,'player');
   const seen=new Set((owner?.knowledge?.player?.[p.id]?.facts??[]).filter(f=>f.startsWith('effect:')).map(f=>f.slice(7)));
   return {key,count,...view,composition:compositionName(p,view.name,owner),derived:deriveProductName(doseRules,p,{known:seen})};})};
}
// A steep that leaves no oral effect at the floor is too thin to be a preparation: the lots are spent and nothing comes of
// them. This follows from the batch's own numbers (salt thins sap by mass, a weak lot carries little); no lot is refused.
export const ROUGH_BATCH={floor:14,code:'thin',reason:'The steep came out too thin: too little sap or oil in the water to hold, so the lots were wasted.'};
export function roughBatch(product){return Math.max(0,...Object.values(product.outputs.oral??{}))<ROUGH_BATCH.floor?ROUGH_BATCH:null;}
// The first failing native gate leads; place comes after it.
function eligibility(context){return context.blocked||(context.world==='base.frontier'&&context.location==='Village'?'':'Return to Village to experiment.');}
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
 const token=JSON.stringify([owner?.sequence??null,inventory,context.clock,context.world,context.location,context.blocked,request]);
 return {eligible:!reason,reason,token,request:structuredClone(request)};
}
export function stageCrafting(owner,inventory,quoted,context,depth=freshDepth()) {
 const fresh=quoteCrafting(owner,inventory,quoted.request,context);
 if(!fresh.eligible)fail(fresh.reason);if(fresh.token!==quoted.token)fail('This quote changed. Review the current materials and place again.');
 const request=fresh.request,at=context.clock;
 let next=owner?structuredClone(owner):createCraftState({world:'base.frontier',life:0});
 const items=[];let effect=null,binding=null,batch=null,overdose=null,failure=null,nextDepth=depth;
 if(request.type==='harvest'){
  const source=request.source??'village-herbs',key=nodeKey(context.world,context.location,source);
  const result=harvest(villageSources,{root:context.root,world:context.world,location:context.location,source,at,actor:{skill:0},node:next.sources.nodes[key]});
  if(!result.result.items.length)fail(result.result.reason);
  next=freezeMaterials(next,catalogue,result.result.items.map(i=>i.material));next=setSourceNode(next,key,result.node);
  for(const i of result.result.items)items.push({key:materialKey(i.material,i.quality),amount:i.qty});
 }else if(request.type==='craft'){
  const lots=inputLots(request,next,inventory),result=resolveBatch(law,{inputs:lots.map(({material,qty})=>({material,qty})),process:request.process??[{op:'steep',level:1}],stations:[]});
  for(const i of lots)items.push({key:i.key,amount:-i.qty});
  const rough=roughBatch(result.product);
  if(rough)failure={code:rough.code,reason:rough.reason,result:{...result,product:{...result.product,outputs:{}}}};
  else{next=recordProduct(next,result.product);items.push({key:keyForProduct(BATCH_FAMILY,result.product),amount:1});batch=result;}
 }else {
  const p=productFromNativeKey(request.key,next),raw=p.outputs.oral??{},oral=cancelOutputs(doseRules,p.outputs).outputs.oral??{},binds=bindOf(p)>0;
  // Tolerance dulls a repeat dose of the same effect; past the overdose line the excess is a poison condition.
  let dose=depth.dose,over=0;const scales={};
  for(const e of ['health','stamina'])if(oral[e]>0){const r=applyDose(doseRules,dose,e,oral[e],at);dose=r.state;if(r.effective<oral[e])scales[e]=Math.floor(r.effective*1000/oral[e]);if(r.overdose)over+=r.overdose.amount;}
  // A purely binding preparation carries no tonic dose, so it leaves the tonic effect alone.
  if(!binds||['health','stamina','poison'].some(k=>raw[k]>0))effect=craftedExposure(p,at,scales);
  if(over)overdose=overdoseExposure(p,at,over);
  if(binds)binding={effect:bindingExposure(p,at),strength:bindOf(p)};
  items.push({key:request.key,amount:-1});
  next=observe(next,'player',p.id,Object.keys(oral).map(e=>`effect:oral.${e}`),at);
  const consumed=p.inputs.filter(i=>i[0]==='consumed').map(i=>i[1]),seen=Object.keys(oral).filter(e=>(scales[e]??1000)>0).map(e=>`oral.${e}`);
  // A solo preparation teaches its own ingredient: an effect seen means that axis is there; an effect absent with nothing cancelled means none.
  if(new Set(consumed).size===1){
   const id=consumed[0],material=next.materials[id]??catalogue.materials[id],touched=new Set(cancelOutputs(doseRules,p.outputs).cancelled.flatMap(c=>[c.a,c.b])),facts=[];
   for(const o of law.outputs)if(o.route==='oral'&&catalogue.axes[o.axis].kind==='fraction'&&!catalogue.axes[o.axis].hidden){
    const has=(material.properties[o.axis]??0)>0;
    if(oral[o.effect]>0)facts.push(`axis:${o.axis}`);else if(!has&&!touched.has(o.effect))facts.push(`none:${o.axis}`);
   }
   if(facts.length)next=observe(next,'player',next.materials[id]?id:`authored:${id}`,facts,at);
  }
  nextDepth={dose,log:recordTrial(depth.log,{materials:consumed,process:p.process,seen,at})};
 }
 next.sequence++;validateOwner(next);
 return {state:next,items,effect,binding,batch,overdose,failure,depth:nextDepth};
}

// Display names for ids in the experiment log; the log itself keeps exact ids.
export const materialName=(id,owner=craftingOwner)=>owner?.materials?.[id]?.name??catalogue.materials[id]?.name??id;
