// ORIGINAL measured workshop water and damp preparation. Native counts and
// simulation jobs own custody/time; G3 partitions matter, G5 retains history.
import {PARADISE_IDS as P,PARADISE_LOCATIONS as L,PARADISE_KEYS as K} from './book_world_paradise_ids.js';
import {PARADISE_DRYING as D,wrapDryingProvenance,readDryingKey} from './book_world_paradise_drying.js';
import {planProcessedMaterial,readMaterialLineage} from './material_lineage.js';
import {defineSeparationLaw,separateProcessBatch,validateProcessBatch} from './craft_process_separation.js';
import {registerDomain} from './domain_registry.js';
import {artifactEquipmentReasons} from './artifact_collection.js';
const check=(ok,message)=>{if(!ok)throw Error(message);},same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),nat=n=>Number.isSafeInteger(n)&&n>=0;
export const PARADISE_ENVIRONMENT=Object.freeze({prefix:'book.paradise.campaign.hub.environment_',cloth:JSON.stringify({id:'Linen cloth'}),revision:1});
const E=PARADISE_ENVIRONMENT;
const names={clear:'Clear workshop water',cloudy:'Cloudy workshop water',brackish:'Brackish workshop water',filteredCloudy:'Strained cloudy workshop water',filteredBrackish:'Strained brackish workshop water',cake:'Spent workshop filter',emptyCake:'Spent salt-water filter'};
const row=(id,phase,amount)=>({id,phase,amount});
const isResidue=kind=>['cake','emptyCake'].includes(kind);
const batch=(kind)=>({volume:isResidue(kind)?0:1,constituents:kind==='emptyCake'?[]:kind==='cake'?[row('grit','suspended',40)]:[
    ...(kind==='brackish'||kind==='filteredBrackish'?[row('contaminant','dissolved',5)]:[]),
    ...(kind==='cloudy'?[row('grit','suspended',40)]:[]),
    ...(kind==='brackish'||kind==='filteredBrackish'?[row('salt','dissolved',30)]:[]),row('water','dissolved',1000)]});
export const workshopWaterLaw=defineSeparationLaw({id:'paradise.workshop-water',revision:1,constituents:{water:{},grit:{particleSize:20},salt:{},contaminant:{}},
    costs:Object.fromEntries(['strain','decant','skim','distill','divide'].map(op=>[op,{secondsPerVolume:120,workPerVolume:1,fuelPerVolume:0}])),
    filmRetainPermille:0,filmReleasePerVolume:0,cleanWaterPerAmount:1,cleanWorkPerAmount:1});
const filterVessel={id:'paradise.workshop-cloth-filter',material:'cloth',capacity:1,closure:'open',condenserPermille:0,meshSize:10,thermalMass:0,heatTransfer:0,films:[]};
export const PARADISE_ENVIRONMENT_ITEM_SPECIFICATIONS=Object.entries(names).map(([kind,id])=>({id,name:id,value:0,tags:{book_world_paradise:true,expedition:true},
    description:isResidue(kind)?'The actual cloth retained after workshop filtering, with any captured suspended grit. Spent filter material; it is not clean water.':
        `One sealed local wash portion. ${kind.includes('Brackish')||kind==='brackish'?'Dissolved salt and contamination remain; cloth straining does not remove them.':kind==='cloudy'?'Suspended grit needs a real filter before fine stave preparation.':'Measured free of the grit, salt and contamination this ordinary preparation checks.'} Original workshop units and process law; not drinking-water certification.`}));
export function readPreparationWater(key){
    let v;try{v=JSON.parse(key);}catch{return null;}if(v.environmentWater==null)return null;
    const w=v.environmentWater;check(Object.keys(v).sort().join(',')==='environmentWater,id'&&JSON.stringify(v)===key,'Unsupported water carrier.');
    check(w&&Object.keys(w).sort().join(',')==='batch,kind,provenanceKey,revision'&&w.revision===1&&Object.hasOwn(names,w.kind)&&v.id===names[w.kind],'Unsupported water profile.');
    const b=validateProcessBatch(w.batch);check(same(b,batch(w.kind)),'Water amounts disagree with their measured profile.');
    const history=readMaterialLineage(w.provenanceKey);check(history&&history.history.at(-1)?.process_id?.startsWith('paradise.environment.'),'Water lost its retained process receipt.');
    return structuredClone(w);
}
function waterKey(kind,provenanceKey){const key=JSON.stringify({id:names[kind],environmentWater:{revision:1,kind,provenanceKey,batch:batch(kind)}});readPreparationWater(key);return key;}
export function preparationWaterAssessment(key){
    const w=readPreparationWater(key);if(!w||isResidue(w.kind))return {usable:false,reason:'Choose an owned wash-water portion, not spent filter material.'};
    const amounts=Object.fromEntries(w.batch.constituents.map(r=>[r.id,r.amount]));
    const reason=amounts.grit?'Strain the suspended grit with one real linen cloth first.':amounts.salt||amounts.contaminant?'Dissolved salt or contamination remains. Use a measured clear portion; cloth filtering cannot remove it.':'';
    return {usable:!reason,reason,volume:w.batch.volume,unit:'local wash portion',amounts,propertyUnit:'local constituent units',sourceRevision:1};
}
const clock=state=>{const i=state.bookWorldCampaign?.instances?.find(i=>i.worldId===P.hub);check(i,'Use the retained district instance.');return {instanceId:i.id,localAt:i.clock.elapsed};};
const item=(key,amount,returned=false)=>({type:'item',actor:'player',key,amount,...(returned?{reservationReturn:true}:{})});
function processReceipt({operation,inputKey,admittedAt,sequence,instanceId,localAt}){
    const parameters={instanceId,localAt,admittedAt,sequence,profileRevision:1};
    if(operation==='buy'){
        const source=JSON.stringify({id:'District supplier sealed wash crate'});
        return planProcessedMaterial({stock:{[source]:1},inputs:[{item_key:source,count:1}],output:{id:'Workshop washing reserve',family:'workshop-water',count:5},
            yieldRatio:{numerator:5,denominator:1},process:{id:'paradise.environment.buy',revision:1,at:admittedAt+2,world_id:P.hub,parameters},
            sourceFacts:{[source]:{origin_world:P.hub,evidence:{source:'finite paid district offer',portionCounts:{clear:2,cloudy:2,brackish:1},closure:'sealed'}}}});
    }
    const wash=operation==='soften',primary=wash?K.log:inputKey,supports=wash?[{item_key:inputKey,count:1,disposition:'consumed'},{item_key:K.kit,count:1,disposition:'retained'}]:[{item_key:E.cloth,count:1,disposition:'consumed'}];
    return planProcessedMaterial({stock:Object.fromEntries([primary,...supports.map(s=>s.item_key)].map(k=>[k,1])),inputs:[{item_key:primary,count:1}],supportInputs:supports,
        output:{id:wash?'Wet repair stave':names[readPreparationWater(inputKey).kind==='cloudy'?'filteredCloudy':'filteredBrackish'],family:wash?'workshop-wood':'workshop-water',count:wash?2:1},
        yieldRatio:{numerator:wash?2:1,denominator:1},process:{id:'paradise.environment.'+operation,revision:1,at:admittedAt+(wash?4:2),world_id:P.hub,parameters}});
}
function derivedTerms(definition,{inputKey,admittedAt,sequence,instanceId,localAt}){
    const operation=definition.id.slice(E.prefix.length),receipt=processReceipt({operation,inputKey,admittedAt,sequence,instanceId,localAt});
    if(operation==='buy')return {...definition,effects:[...definition.effects,...[['clear',2],['cloudy',2],['brackish',1]].map(([kind,n])=>item(waterKey(kind,receipt.item_key),n))]};
    const w=readPreparationWater(inputKey);check(w,'Choose an exact owned water portion.');
    if(operation==='soften'){
        const a=preparationWaterAssessment(inputKey);check(a.usable,a.reason);
        const key=wrapDryingProvenance({cohort:`environment.${sequence}`,worldId:P.hub,instanceId,at:localAt,provenanceKey:receipt.item_key});
        return {...definition,costs:[item(K.log,-1),item(inputKey,-1),item(K.kit,-1),{type:'vital',actor:'player',key:'stamina',amount:-1}],effects:[...definition.effects,item(key,2)]};
    }
    check(operation==='filter'&&['cloudy','brackish'].includes(w.kind),'Choose an unstrained cloudy or brackish portion.');
    const separation=separateProcessBatch(workshopWaterLaw,w.batch,{op:'strain',volume:1},filterVessel),kind=w.kind==='cloudy'?'filteredCloudy':'filteredBrackish';
    check(same(separation.product,batch(kind)),'Workshop filter output disagrees with its actual separation.');
    const effects=[...definition.effects,item(waterKey(kind,receipt.item_key),1)];
    const residueKind=separation.residue.constituents.length?'cake':'emptyCake';
    check(same(separation.residue,batch(residueKind)),'Workshop filter residue is unaccounted.');effects.push(item(waterKey(residueKind,receipt.item_key),1));
    return {...definition,costs:[item(inputKey,-1),item(E.cloth,-1),{type:'vital',actor:'player',key:'stamina',amount:-1}],effects};
}
export function preparationRegistry(state,registry,context,command){
    if(!command.id?.startsWith(E.prefix))return registry;
    const definition=registry.simulation.commands.get(command.id);check(definition,'Choose a declared environmental preparation.');
    if(!command.id.endsWith('_buy'))check(typeof command.inputKey==='string'&&(context.gameplay?.player?.inventory[command.inputKey]||0)>0,'That exact owned water portion changed.');
    const c=clock(state),derived=derivedTerms(definition,{inputKey:command.inputKey,admittedAt:state.clock,sequence:state.sequence+1,instanceId:c.instanceId,localAt:c.localAt+definition.duration});
    const commands=new Map(registry.simulation.commands);commands.set(derived.id,derived);return {...registry,simulation:{...registry.simulation,commands}};
}
export function validPreparationJob(job,definition,state){
    try{
        const outputs=job.effects.filter(e=>e.type==='item'&&e.amount>0&&!e.reservationReturn),key=outputs.find(e=>readPreparationWater(e.key)||readDryingKey(e.key))?.key;
        const w=readPreparationWater(key),provenance=w?.provenanceKey||readDryingKey(key)?.provenanceKey,history=readMaterialLineage(provenance),event=history.history.at(-1),p=event.parameters;
        const c=clock(state);check(event.revision===1&&event.world_id===P.hub&&p.profileRevision===1&&p.instanceId===c.instanceId&&nat(p.localAt)&&p.localAt>=definition.duration&&p.localAt<=c.localAt+definition.duration&&p.admittedAt===job.due-definition.duration&&p.sequence===job.sequence&&event.at===job.due,'Changed preparation process boundary.');
        const inputKey=job.costs.find(e=>e.type==='item'&&readPreparationWater(e.key))?.key;
        const expected=derivedTerms(definition,{inputKey,admittedAt:p.admittedAt,sequence:job.sequence,instanceId:p.instanceId,localAt:p.localAt});
        return same(job.costs,expected.costs)&&same(job.effects,expected.effects);
    }catch{return false;}
}
export function paradiseEnvironmentDefinitions(h){
    const {command,timed,bench,item,stamina,know,purse,contact}=h;
    return [command('hub.environment_buy','Order the finite sealed wash crate · 3 credits · 2 min',P.hub,L.hub,{...contact(P.employee),requires:{all:[bench,{fact:`paradise.support.${P.employee}`,op:'eq',value:true}]},...timed(2,bench,true),
        costs:[purse('player',-3,true)],effects:[purse(P.employee,3,true),know('environment_supply','Bought the supplier’s finite sealed crate: two clear, two cloudy and one brackish local wash portions. Original measured workshop stock; no rain or drinking-water claim.')],
        description:'Pay the present district supplier for their one offered five-portion crate. Two clear portions work directly. Filtering cloudy portions can recover more usable water; brackish dissolved material remains. The completed order consumes this finite offer; returning does not refill it.'}),
        command('hub.environment_filter','Strain one exact water portion · linen + 1 stamina · 2 min',P.hub,L.hub,{once:false,requires:bench,...timed(2,bench),costs:[item('player',E.cloth,-1),stamina('player',-1)],
            effects:[know('environment_filter','Strained one exact water portion through one actual linen cloth. Suspended grit stayed with the spent filter; dissolved salt and contamination stayed in the water. No general purification or free cloth restoration occurred.')],
            description:'A real cloth captures coarse suspended grit. It leaves dissolved salt and contamination in the same counted water portion. Two played minutes and one stamina remain spent after completion.'}),
        command('hub.environment_soften','Wash and soften two staves · log + water + held kit + 1 stamina · 4 min',P.hub,L.hub,{once:false,requires:bench,...timed(4,bench),costs:[item('player',K.log,-1),item('player',K.kit,-1),stamina('player',-1)],effects:[item('player',K.kit,1,true),know('environment_softened','One real log and a suitable measured water portion became two damp repair staves. Paid washing softened the preparation, saving one stamina against ordinary cutting. The exact water, timber and held kit remain in the preparation receipt. Dry the actual pieces before binding a usable kit.')],
            description:'Use suitable damp preparation to save effort: one stamina instead of the ordinary two. Four played minutes and the actual water stay spent. The two retained wet staves still need drying, then feed the existing survey-kit and paid repair-order route.'})];
}
export function paradiseEnvironmentActions(state,registry,context,projectCommands){
    const defs=[...registry.simulation.commands.values()].filter(d=>d.id.startsWith(E.prefix)),actions=[];
    for(const definition of defs){
        const operation=definition.id.slice(E.prefix.length),keys=operation==='buy'?[null]:Object.keys(context.gameplay?.player?.inventory||{}).filter(k=>{const w=readPreparationWater(k);return w&&!isResidue(w.kind)&&(operation!=='filter'||['cloudy','brackish'].includes(w.kind));});
        if(operation!=='buy'&&!keys.length)keys.push(null);
        for(const [i,inputKey]of keys.entries()){
            const command={type:'book_paradise_campaign',id:definition.id,...(inputKey?{inputKey}:{}),sequence:state.sequence};
            try{
                const selected=preparationRegistry(state,registry,context,command),d=selected.simulation.commands.get(definition.id),a=projectCommands(state,selected,context,{groups:[definition.group],commandType:'book_paradise_campaign'}).find(a=>a.id===definition.id);
                if(a){const reasons=artifactEquipmentReasons(d.costs,state,context);const id=a.id+'.'+i,label=a.label+(inputKey?' · '+JSON.parse(inputKey).id:'');actions.push({...a,id,label,legibility:a.legibility?{...a.legibility,id,label}:undefined,eligible:a.eligible&&!reasons.length,reasons:[...(a.reasons||[]),...reasons],command});}
            }catch(e){
                if(state.actors.player.worldId===P.hub&&state.simulation?.people.player.location===L.hub&&context.facts?.['paradiseCampaign.bench']===true){
                    const reason=inputKey?e.message:'Order a measured water portion, or recover a cloudy portion through filtering.',id=definition.id+'.'+i,label=definition.label+(inputKey?' · '+JSON.parse(inputKey).id:'');
                    // A rejected input still has its real fixed work/cost terms.
                    // Use the shared projection rather than the legacy fallback's
                    // zero-minute default. This projection grants no output.
                    const costs=operation==='soften'?[item(K.log,-1),...(inputKey?[item(inputKey,-1)]:[]),item(K.kit,-1),{type:'vital',actor:'player',key:'stamina',amount:-1}]:[...(inputKey?[item(inputKey,-1)]:[]),...definition.costs];
                    const commands=new Map(registry.simulation.commands);commands.set(definition.id,{...definition,costs});
                    const a=projectCommands(state,{...registry,simulation:{...registry.simulation,commands}},context,{groups:[definition.group],commandType:'book_paradise_campaign'}).find(a=>a.id===definition.id);
                    if(a)actions.push({...a,id,label,eligible:false,reasons:[reason],command,legibility:{...a.legibility,id,label,status:'blocked',control:{visible:true,enabled:false},costKind:'terms',duration:{minutes:definition.duration,kind:'terms',text:`${definition.duration} played minutes under the known terms.`},blockers:[{id:'preparation-water',text:reason}]}});
                }
            }
        }
    }
    const records=Object.entries(context.gameplay?.player?.inventory||{}).flatMap(([key,count])=>{const w=readPreparationWater(key);return w?[{id:'environment.water.'+actions.length+'.'+key,text:`${JSON.parse(key).id}: ${count} sealed ${isResidue(w.kind)?'spent filters':'local portions'}. ${isResidue(w.kind)?'Retained cloth and any actual filtered grit; no water volume.':preparationWaterAssessment(key).reason||'Suitable for this ordinary stave preparation.'}`}]:[];});
    return {actions,records};
}
registerDomain({id:'paradisePreparationWater',ownsItemKey:key=>readPreparationWater(key)!==null,validate:(_,envelope)=>{
    const visit=value=>{if(!value||typeof value!=='object')return;for(const [key,row]of Object.entries(value)){if(key.startsWith('{'))readPreparationWater(key);if(row&&typeof row==='object')visit(row);}};
    visit(envelope.inventories);visit(envelope.expansion?.simulation?.owners);
}});
