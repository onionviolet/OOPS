// Known, fixed batches over the existing recipe, process and simulation owners.
// Stock is the actor's inventory. No seed, purse, clock or product store is added.
import {defineCatalogue} from './craft_materials.js';
import {defineCraftLaw,resolveBatch} from './craft_resolver.js';
import {defineRecipe,recognizeRecipe} from './craft_recipes.js';
import {classifyProductKey} from './craft_product_registry.js';
import {validateItemKey} from './inventory_key.js';
import {defineProcess} from './dose_process.js';
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9_.:-]*$/i.test(x)&&!['__proto__','constructor','prototype'].includes(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const pos=x=>Number.isSafeInteger(x)&&x>0;
const eq=(fact,value,reason)=>({fact,op:'eq',value,...(reason?{reason}:{})});

// making: {schema:1,catalogue:<defineCatalogue spec>,laws:[<defineCraftLaw spec>],
// rows:[{id,revision,label,description,report,place,minutes,knowledgeKey,law,
// recipe:<defineRecipe spec>,inputs:[{key,material,qty,role?}],process:[{op,level}],
// stations:[],requires?,product:{key,label},use:{label,description,report,minutes,
// effects:[<simulation effect>]}}]}. All quantities and outputs must be authored.
// One output inventory unit represents the entire resolved batch. A dose may
// omit `use` when product.consumer names an existing ingestion command.
export function defineCastMaking(data,{worldId,actorId='player',group,situationId,requires=null}={}){
 if(![worldId,actorId,group,situationId].every(id))throw Error('Invalid making binding.');
 if(data==null)return [];
 if(data.schema!==1||!Array.isArray(data.rows)||!Array.isArray(data.laws))throw Error('Invalid making pack.');
 const catalogue=defineCatalogue(data.catalogue),laws=new Map(),seen=new Set(),commands=[];
 for(const spec of data.laws){const law=defineCraftLaw({...spec,catalogue});if(laws.has(law.ref))throw Error('Duplicate making law.');laws.set(law.ref,law);}
 for(const row of data.rows){
  if(!id(row.id)||seen.has(row.id)||!pos(row.revision)||!id(row.place)||!id(row.knowledgeKey)||
   ![row.label,row.description,row.report,row.product?.key,row.product?.label].every(text)||!pos(row.minutes)||
   !Array.isArray(row.inputs)||!row.inputs.length||!Array.isArray(row.process)||!Array.isArray(row.stations)||
   !row.use&&!id(row.product?.consumer))throw Error('Invalid making row or missing product consumer.');
  seen.add(row.id);
  validateItemKey(row.product.key);
  if(classifyProductKey(row.product.key))throw Error('Generated products need their existing frozen-product host binding.');
  const law=laws.get(row.law);if(!law)throw Error('Making law revision is not bound.');
  const keys=new Set();
  const inputs=row.inputs.map(x=>{
   if(!text(x.key)||keys.has(x.key)||!pos(x.qty)||!catalogue.materials[x.material]||x.role!=null&&!['consumed','catalyst'].includes(x.role))throw Error('Invalid making input.');
   validateItemKey(x.key);
   keys.add(x.key);return {...x,material:catalogue.materials[x.material]};
  });
  // One item key denotes one physical material across the pack, including output.
  // Reusing an output key for a different resolved batch would erase identity.
  const recipe=defineRecipe(catalogue,row.recipe);
  if(recipe.law!==law.ref)throw Error('Making recipe needs the bound law revision.');
  const fit=recognizeRecipe(catalogue,recipe,inputs,{process:row.process,law:law.ref,stations:row.stations});
  if(!fit.ok)throw Error('Making inputs or process do not fit the known recipe.');
  const result=resolveBatch(law,{inputs:inputs.map(({material,qty,role})=>({material,qty,...(role?{role}:{})})),process:row.process,stations:row.stations,recipe});
  const envelope=defineProcess({id:row.id,world:worldId,name:row.label,minutes:row.minutes,
   slots:inputs.map((x,i)=>({id:`slot.${i}`,role:x.role||'consumed',select:{material:x.material.id},key:x.key,qty:x.qty})),product:{key:row.product.key,kind:'batch'}});
  const support={all:[...(requires?[requires]:[]),...(row.requires?[row.requires]:[]),
   eq(`knowledge.${row.knowledgeKey}.seen`,true,'Learn the preparation first.'),
   ...inputs.filter(x=>x.role==='catalyst').map(x=>({fact:`item.${x.key}`,op:'gte',value:x.qty,reason:'Keep the required apparatus at hand.'}))]};
  const allocation=structuredClone(row.product.effects||[]);
  if(allocation.some(e=>e.type!=='fact'||e.scope!=='actor'||e.actor&&e.actor!==actorId))throw Error('Product allocation needs the existing actor fact owner.');
  for(const e of allocation)e.actor=actorId;
  const receipt=`making.${row.id}`,basis={kind:'observation',attributedTo:actorId,situationId};
  const note=(key,value)=>({type:'knowledge',actor:actorId,key,stage:'seen',value,basis:{...basis}});
  const base={revision:row.revision,group,actorId,worldId,location:row.place,once:false,
   visibleWhen:requires||eq('actor.life','alive'),requires:support,completionRequires:support,
   completionCoLocated:true,completionFailure:'refund',cancellation:'refund'};
  commands.push({...base,id:row.id,label:row.label,description:row.description,duration:envelope.minutes,
   costs:fit.debits.map(x=>({type:'item',actor:actorId,key:x.key,amount:-x.qty})),
   effects:[{type:'item',actor:actorId,key:row.product.key,amount:1},...allocation,note(receipt,row.report)],
   making:{rowId:row.id,stage:'prepare',costText:inputs.filter(x=>x.role!=='catalyst').map(x=>`${x.qty} ${x.label||x.material.name}`).join('; '),receiptKey:receipt,productKey:row.product.key,productId:result.product.id,law:law.ref,...(row.product.consumer?{consumer:row.product.consumer}:{})}});
  if(row.use){
   const use=row.use;
   if(![use.label,use.description,use.report].every(text)||!pos(use.minutes)||!Array.isArray(use.effects)||!use.effects.length)throw Error('Making use needs an authored consumer.');
   const effects=structuredClone(use.effects);
   // Explicit use effects bind to existing owners. Output-derived vital effects
   // read the resolved law, rather than minting a second formula for potency.
   for(const e of effects){
    if(e.output){
     if(e.type!=='vital'||!text(e.output.route)||!text(e.output.effect))throw Error('Invalid making output binding.');
     e.amount=result.product.outputs[e.output.route]?.[e.output.effect]??0;delete e.output;
    }
    if(!['vital','fact','knowledge','condition'].includes(e.type)||e.actor&&e.actor!==actorId)throw Error('Making use needs a bound actor effect owner.');
    e.actor=actorId;
    if(e.type==='knowledge'){if(!e.basis)throw Error('Making knowledge needs attribution.');e.basis.situationId??=situationId;}
   }
   const useSupport={all:[...(requires?[requires]:[]),...(use.requires?[use.requires]:[]),eq(`knowledge.${receipt}.seen`,true,'Prepare this batch first.')]};
   commands.push({...base,id:`${row.id}.use`,label:use.label,description:use.description,duration:use.minutes,
    requires:useSupport,completionRequires:useSupport,
    costs:[{type:'item',actor:actorId,key:row.product.key,amount:-1}],effects:[...effects,note(`${receipt}.used`,use.report)],
    making:{rowId:row.id,stage:'use',costText:`1 ${row.product.label}`,receiptKey:`${receipt}.used`,productKey:row.product.key,productId:result.product.id,law:law.ref}});
  }
 }
 const physical=new Map(),products=new Map(),commandIds=new Set();
 for(const row of data.rows){
  for(const input of row.inputs){const prior=physical.get(input.key);if(prior&&prior!==input.material)throw Error('Making item key has conflicting material bindings.');physical.set(input.key,input.material);}
  const product=commands.find(d=>d.id===row.id).making.productId,prior=products.get(row.product.key);
  if(prior&&prior!==product)throw Error('Making product key has conflicting batch identities.');products.set(row.product.key,product);
 }
 for(const d of commands){if(commandIds.has(d.id))throw Error('Duplicate making command.');commandIds.add(d.id);}
 for(const key of products.keys())if(physical.has(key))throw Error('Intermediate material needs an explicit product adapter.');
 return commands;
}
export function quoteCastMaking(state,commands,preview,{blocked='',decide=()=>({allowed:true})}={}){
 const place=state.simulation?.people?.player?.location,pending=new Set((state.simulation?.jobs||[]).map(j=>j.commandId));
 return commands.filter(d=>d.location===place||pending.has(d.id)).flatMap(d=>{
  const q=preview(d);if(!q.visible)return [];
  const decision=decide(d),reasons=[...(q.reasons||[]),...(blocked?[blocked]:[]),...(!decision.allowed?[decision.reason]:[])];
  return [{id:d.id,label:`${d.label} · ${q.duration??d.duration} min`,description:d.description,perspective:'Your preparation',
   duration:q.duration??d.duration,costText:d.making.costText,
   eligible:!!q.eligible&&!blocked&&decision.allowed,reasons}];
 });
}

// The host resolves a named existing consumer after its ordinary registration.
// Naming an ingestion command is insufficient unless it spends this product.
export function validateCastMakingConsumers(commands,lookup){
 for(const d of commands){
  if(!d.making.consumer)continue;
  const consumer=lookup(d.making.consumer);
  if(!consumer||consumer.actorId!==d.actorId||!(consumer.costs||[]).some(e=>e.type==='item'&&e.key===d.making.productKey&&e.amount===-1))throw Error('Making product needs its real consuming command.');
 }
}
