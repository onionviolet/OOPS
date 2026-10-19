// Original opt-in Village reader. No native owners or DOM are imported here.
import {check, natural, sameJson as same} from './basics.js';
import {TagRegistry} from './tag_store.js';
import {address,drawU32,pickWeighted,hash64} from './gen_kit.js';
import {createStreams,validateStreams} from './seeded_streams.js';
import {RULE_TARGET,rational,createRuleLock,validateRuleLock,compileRuleModules,resolveRuleEffects} from './rule_modules.js';
export const RESPONSIVE_METHOD='responsive@2';
export const VILLAGE_RULE_SCOPE=Object.freeze({worldId:'base.frontier',instanceId:'frontier.main',continuityId:'frontier.branch'});
export const VILLAGE_LAW_ID='rule:village.response';
export const villageRuleTags=new TagRegistry([
    {id:'village.plant',kind:'material',revision:1},
    {id:'village.restorative',kind:'material',parents:['village.plant'],revision:1},
    {id:'village.fluid',kind:'material',revision:1},{id:'village.salt',kind:'material',revision:1},
]);
const tags={'River bellleaf':['village.restorative'],Emberseed:['village.plant'],'Spring water':['village.fluid'],'Mellow salt':['village.salt']};
const fields=(v,ks)=>check(v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join()===ks.sort().join(),'Unsupported Village rule fields.');
const options={registry:villageRuleTags};
const module=(id,revision,process,value,kind='world_law')=>({schema:1,id,revision,resolver:'village.mix@2',kind,scope:{...VILLAGE_RULE_SCOPE},selector:{routes:['mix'],subjects:[{role:'input',quantifier:'some',query:{tag:'village.restorative'}}],requires:process?{fact:'procedure.process',op:'eq',value:process}:{all:[]}},priority:{layer:'world',depth:0,value:0,specificity:0,order:0},effects:[{id:'response',channel:'physics',kind:'parameter',target:RULE_TARGET,combine:process?'replace':'multiply',value,overrides:[]}]});
export function villageRuleRoot(expansion,seed){return expansion?.streams?validateStreams(expansion.streams).root:createStreams(expansion?.rng??seed).root;}
// Retained grammar/table revision 1. Keep this interpreter when future tables change.
function interpretVillageLawV1(root,epoch=0){
    check(Number.isInteger(root)&&root>=0&&root<=0xffffffff&&natural(epoch),'Invalid law generation address.');
    const key=address('craft:village.rules@1',VILLAGE_RULE_SCOPE,{epoch,generatorRevision:1,tableRevision:1,slot:'response',attempt:0});
    const draw=drawU32(root,key),rows=[{id:'response:a',value:rational(4,5)},{id:'response:b',value:rational(1)},{id:'response:c',value:rational(6,5)}];
    const pick=pickWeighted(rows,()=>({weight:1,reason:'admitted useful response'}),draw);
    return {schema:1,revision:1,id:VILLAGE_LAW_ID,epoch,address:key,
        module:module(VILLAGE_LAW_ID,epoch+1,null,pick.value.value,'generated_law'),
        receipt:{generator:'village.response@1',table:'village.response@1',tagRevision:1,address:key,draw,pick:pick.receipt,attempt:0,fallback:null},
        witness:{station:'Village mixing counter',inputs:{'River bellleaf':1,'Spring water':1},processes:['steep','boil'],consumer:'oral-village@2'}};
}
export function generateVillageLaw(root,epoch=0){return interpretVillageLawV1(root,epoch);}
export function createVillageRuleOwner(root){return {schema:1,revision:1,root,scope:{...VILLAGE_RULE_SCOPE},epoch:0,laws:{},receipts:{},lastReceipt:null};}
export function currentVillageLaw(owner,root){return owner?.laws?.[owner.epoch]?.law??generateVillageLaw(owner?.root??root,owner?.epoch??0);}
export function resolveResponsiveMixture(base,law){
    check(base.inputs['River bellleaf']>0,'The responsive method needs River bellleaf and water.');
    const world=module('rule:village.process_response',1,base.process,base.process==='boil'?rational(6,5):rational(4,5));
    const lock=createRuleLock([world,law.module],options);return resolveResponsiveLock(base,lock);
}
export function resolveResponsiveLock(base,lock){
    validateRuleLock(lock,options);
    const world=lock.modules.find(m=>m.id==='rule:village.process_response'),generated=lock.modules.find(m=>m.id===VILLAGE_LAW_ID);
    check(lock.modules.length===2&&world&&generated,'Missing retained Village law dependency.');
    // Revision-2 only admits this registered grammar/interpreter. Future changes
    // use a new reader, rather than silently accepting arbitrary saved programs.
    check(same(world,module('rule:village.process_response',1,base.process,base.process==='boil'?rational(6,5):rational(4,5)))&&generated.kind==='generated_law','Unsupported Village law dependency.');
    const allowed=[rational(4,5),rational(1),rational(6,5)];check(allowed.some(v=>same(generated,module(VILLAGE_LAW_ID,generated.revision,null,v,'generated_law'))),'Unsupported generated response grammar.');
    const context={...VILLAGE_RULE_SCOPE,route:'mix',roles:{input:Object.keys(base.inputs).map(id=>({tags:tags[id]}))},facts:{'procedure.process':base.process,'input.mass':base.mass}};
    const resolved=resolveRuleEffects(compileRuleModules(lock.modules,options),context,options);
    check(!resolved.blocked.length&&base.inputs['River bellleaf']>0,'Responsive mix is not admitted.');
    const factor=resolved.value.numerator/resolved.value.denominator;
    const dose={...base.dose,health:base.fractions.restore*factor/100*2000/base.mass};
    const identity={revision:2,process:base.process,inputs:base.inputs,fractions:base.fractions,mass:base.mass,lawRefs:lock.refs,fingerprint:lock.fingerprint};
    return {...base,id:'m2:'+JSON.stringify(identity),revision:2,consumer:'oral-village@2',lawLock:structuredClone(lock),dose,ruleReceipt:resolved.receipt};
}
export function quoteResponsiveMixture(base,{owner,root}){
    const law=currentVillageLaw(owner,root),product=resolveResponsiveMixture(base,law);
    return {product,law,token:hash64('village.quote@1',address(product.id,owner?.epoch??0))};
}
export function freezeVillageLaw(owner,law,{clock,sequence,reason='causal_mix',product}){
    check(['causal_mix','reveal'].includes(reason)&&natural(clock)&&natural(sequence),'Invalid law freeze event.');
    const previous=owner.laws[law.epoch];if(previous)check(same(previous.law,law),'Frozen law cannot be replaced.');
    else owner.laws[law.epoch]={law:structuredClone(law),frozenAt:clock,reason};
    if(product){const id=`rule.mix:${sequence}`;check(!owner.receipts[id],'Duplicate rule settlement.');owner.receipts[id]={schema:1,sequence,at:clock,product:product.id,lawEpoch:law.epoch,trace:structuredClone(product.ruleReceipt)};owner.lastReceipt=id;}
    return owner;
}
export function validateVillageRuleOwner(owner,products,sequence){
    fields(owner,['schema','revision','root','scope','epoch','laws','receipts','lastReceipt']);
    check(owner.schema===1&&owner.revision===1&&natural(owner.epoch)&&same(owner.scope,VILLAGE_RULE_SCOPE),'Unsupported Village rule owner revision.');
    check(Number.isInteger(owner.root)&&owner.root>=0&&owner.root<=0xffffffff&&owner.laws&&typeof owner.laws==='object'&&!Array.isArray(owner.laws)&&owner.receipts&&typeof owner.receipts==='object'&&!Array.isArray(owner.receipts),'Invalid retained law maps/root.');
    for(const [epoch,entry]of Object.entries(owner.laws)){
        fields(entry,['law','frozenAt','reason']);check(String(entry.law?.epoch)===epoch&&Number(epoch)<=owner.epoch&&natural(entry.frozenAt)&&['causal_mix','reveal'].includes(entry.reason),'Invalid frozen law event.');
        check(same(entry.law,interpretVillageLawV1(owner.root,Number(epoch))),'Unresolved frozen law dependency.');
    }
    for(const [id,r]of Object.entries(owner.receipts)){
        fields(r,['schema','sequence','at','product','lawEpoch','trace']);const p=products[r.product],law=owner.laws[r.lawEpoch]?.law;
        check(r.schema===1&&id===`rule.mix:${r.sequence}`&&natural(r.sequence)&&r.sequence>0&&r.sequence<=sequence&&natural(r.at)&&p?.revision===2&&law&&r.at>=owner.laws[r.lawEpoch].frozenAt&&same(r.trace,p.ruleReceipt)&&same(p.lawLock.modules.find(m=>m.id===VILLAGE_LAW_ID),law.module),'Dangling rule receipt.');
    }
    check(owner.lastReceipt===null?Object.keys(owner.receipts).length===0:!!owner.receipts[owner.lastReceipt],'Dangling latest rule trace.');
    for(const p of Object.values(products))if(p.revision===2){const generated=p.lawLock.modules.find(m=>m.id===VILLAGE_LAW_ID),law=owner.laws[generated.revision-1]?.law;check(law&&same(generated,law.module)&&Object.values(owner.receipts).some(r=>r.product===p.id),'Dangling product law reference.');}
    return owner;
}
