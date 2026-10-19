// Inert module admission and pure matching. Existing rules.js callers retain
// their contract. Only resolveRuleEffects applies admitted effect proposals.
import {check, positive} from './basics.js';
import {evaluateRule} from './rules.js';
import {tagFacts} from './tag_store.js';
import {address,hash64,compareCodePoints} from './gen_kit.js';
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
const text=v=>typeof v==='string'&&v.length>0;
const same=(a,b)=>address(a)===address(b);
function shape(v,allowed,required=allowed){check(object(v)&&Object.keys(v).every(k=>allowed.includes(k))&&required.every(k=>Object.hasOwn(v,k)),'Unsupported rule fields.');}
export const RULE_FACTS=Object.freeze({'procedure.process':'string','input.mass':'number','source.ready':'boolean','station.owned':'boolean','evidence.witnessed':'boolean'});
export const RULE_TARGET='oral.restore_availability';
const layers=['core','world','region','actor','director'];
export function rational(numerator,denominator=1){
    check(Number.isSafeInteger(numerator)&&positive(denominator),'Invalid rational parameter.');
    let a=BigInt(Math.abs(numerator)),b=BigInt(denominator);while(b){[a,b]=[b,a%b];}
    return {numerator:numerator/Number(a||1n),denominator:denominator/Number(a||1n)};
}
function ratio(v){shape(v,['numerator','denominator']);const r=rational(v.numerator,v.denominator);check(r.numerator>=0&&same(v,r),'Noncanonical parameter.');return r;}
function arithmetic(a,b,multiply){
    const an=BigInt(a.numerator),ad=BigInt(a.denominator),bn=BigInt(b.numerator),bd=BigInt(b.denominator);
    let n=multiply?an*bn:an*bd+bn*ad,d=ad*bd,x=n,y=d;while(y){[x,y]=[y,x%y];}n/=x||1n;d/=x||1n;
    check(n<=BigInt(Number.MAX_SAFE_INTEGER)&&d<=BigInt(Number.MAX_SAFE_INTEGER),'Rule arithmetic budget exceeded.');return rational(Number(n),Number(d));
}
const cmp=(a,b)=>{const d=BigInt(a.numerator)*BigInt(b.denominator)-BigInt(b.numerator)*BigInt(a.denominator);return d<0n?-1:d>0n?1:0;};
function predicate(p,facts,depth=0){
    check(depth<=16,'Rule AST budget exceeded.');check(object(p),'Invalid predicate.');
    const ops=['all','any','not'].filter(k=>Object.hasOwn(p,k));
    if(ops.length){check(ops.length===1&&Object.keys(p).length===1,'Ambiguous predicate.');const op=ops[0];if(op==='not')predicate(p.not,facts,depth+1);else{check(Array.isArray(p[op])&&p[op].length<=64,'Invalid predicate children.');p[op].forEach(x=>predicate(x,facts,depth+1));}return;}
    shape(p,['fact','op','value']);check(Object.hasOwn(facts,p.fact)&&['eq','gte','lte'].includes(p.op),'Unknown rule fact or opcode.');
    check(typeof p.value===facts[p.fact]&&(typeof p.value!=='number'||Number.isFinite(p.value))&&(p.op==='eq'||facts[p.fact]==='number'),'Unknown rule units or value.');
}
export function compileTagQuery(q,registry,prefix='subject',depth=0){
    check(depth<=16,'Tag query budget exceeded.');check(object(q)&&Object.keys(q).length===1,'Unsupported tag query.');
    if(Object.hasOwn(q,'tag')){check(registry.has(q.tag),'Unknown rule tag.');return {fact:`${prefix}.tag.${q.tag}`,op:'eq',value:true};}
    if(Object.hasOwn(q,'not'))return {not:compileTagQuery(q.not,registry,prefix,depth+1)};
    const op=Object.keys(q)[0];check(['all','any'].includes(op)&&Array.isArray(q[op])&&q[op].length<=64,'Unsupported tag query.');return {[op]:q[op].map(x=>compileTagQuery(x,registry,prefix,depth+1))};
}
export function validateRuleModule(m,{registry,facts=RULE_FACTS}={}){
    shape(m,['schema','id','revision','resolver','kind','scope','selector','priority','effects']);
    check(m.schema===1&&text(m.id)&&positive(m.revision)&&m.resolver==='village.mix@2'&&['world_law','generated_law','institution_policy','cheat_overlay','learned_technique'].includes(m.kind),'Unsupported rule module revision.');
    shape(m.scope,['worldId','instanceId','continuityId']);check(Object.values(m.scope).every(text),'Invalid rule scope.');
    shape(m.selector,['routes','subjects','requires']);check(Array.isArray(m.selector.routes)&&m.selector.routes.length>0&&m.selector.routes.every(text)&&Array.isArray(m.selector.subjects)&&m.selector.subjects.length<=16,'Invalid rule selector.');
    for(const s of m.selector.subjects){shape(s,['role','quantifier','query']);check(['input','actor','station','product'].includes(s.role)&&['some','all'].includes(s.quantifier),'Unsupported subject domain.');compileTagQuery(s.query,registry);}
    predicate(m.selector.requires,facts);
    shape(m.priority,['layer','depth','value','specificity','order']);check(layers.includes(m.priority.layer)&&['depth','value','specificity','order'].every(k=>Number.isSafeInteger(m.priority[k]))&&m.priority.depth>=0&&m.priority.specificity>=0,'Invalid rule priority.');
    check(Array.isArray(m.effects)&&m.effects.length>0&&m.effects.length<=32,'Invalid rule effects.');const ids=new Set();
    for(const e of m.effects){
        shape(e,['id','channel','kind','target','combine','value','overrides','sourceFact'],['id','channel','kind','target','combine','value','overrides']);
        check(text(e.id)&&!ids.has(e.id)&&['physics','institution','knowledge'].includes(e.channel)&&Array.isArray(e.overrides)&&e.overrides.every(text),'Invalid effect identity/channel.');ids.add(e.id);
        if(e.kind==='parameter'){check(e.channel==='physics'&&e.target===RULE_TARGET&&['replace','add','multiply','min','max'].includes(e.combine),'Unsupported parameter opcode/units.');ratio(e.value);check(!e.overrides.length,'Parameters cannot grant exemptions.');}
        else if(e.kind==='gate'){check(['veto','permit','exempt'].includes(e.combine)&&['physical','means','access','selection','obligation'].includes(e.target)&&e.value===true&&e.channel!=='knowledge','Unsupported gate.');
            check((e.target!=='obligation'||e.channel==='institution')&&(e.channel!=='institution'||['access','obligation'].includes(e.target)),'Invalid gate authority.');
            if(e.combine==='exempt')check(e.overrides.length>0&&facts[e.sourceFact]==='boolean','Exemption needs named permission and source.');else check(!e.overrides.length&&e.sourceFact===undefined,'Unexpected override permission.');}
        else check(['observation','consequence'].includes(e.kind)&&e.channel===(e.kind==='observation'?'knowledge':'institution')&&e.combine==='record'&&text(e.target)&&text(e.value)&&!e.overrides.length,'Unsupported effect opcode.');
    }
    return m;
}
export function matchRuleModule(m,context,{registry,observer={omniscient:true}}){
    const scoped=m.selector.routes.includes(context.route)&&Object.entries(m.scope).every(([k,v])=>context[k]===v);
    if(!scoped)return {met:false,known:true,reasons:['Outside operation scope.']};
    const results=[evaluateRule(m.selector.requires,context.facts)];
    for(const subject of m.selector.subjects){const domain=context.roles[subject.role]||[];
        if(!domain.length){results.push({met:false,known:true,reasons:['Empty subject domain.']});continue;}
        const children=domain.map(entity=>evaluateRule(compileTagQuery(subject.query,registry),tagFacts({registry,tags:entity.tags},observer,{prefix:'subject'})));
        // Reuse the existing evaluator's missing-aware all/any semantics.
        const facts={};children.forEach((r,i)=>{if(r.known)facts[String(i)]=r.met;});
        results.push(evaluateRule({[subject.quantifier==='all'?'all':'any']:children.map((_,i)=>({fact:String(i),op:'eq',value:true}))},facts));
    }
    const facts={};results.forEach((r,i)=>{if(r.known)facts[i]=r.met;});return evaluateRule({all:results.map((_,i)=>({fact:String(i),op:'eq',value:true}))},facts);
}
function anchors(q){if(q.tag)return [q.tag];if(q.not)return [];
    const children=(q.all||q.any).map(anchors);if(q.any&&children.some(x=>!x.length))return [];
    return [...new Set(children.flat())];
}
export function compileRuleModules(modules,{registry,facts=RULE_FACTS}={}){
    check(Array.isArray(modules)&&modules.length<=10000,'Rule pack budget exceeded.');const unique=new Map(),buckets=new Map();
    for(const m of modules){validateRuleModule(m,{registry,facts});const old=unique.get(m.id);if(old){check(same(old,m),'Conflicting active rule revisions.');continue;}unique.set(m.id,structuredClone(m));}
    for(const m of unique.values())for(const route of m.selector.routes){const scope=address(route,m.scope),bucket=buckets.get(scope)||{fallback:new Set(),tags:new Map()};buckets.set(scope,bucket);
        // One required subject domain suffices as a safe candidate anchor.
        const s=m.selector.subjects.find(s=>anchors(s.query).length);if(!s)bucket.fallback.add(m.id);else for(const tag of anchors(s.query)){const key=`${s.role}:${tag}`,set=bucket.tags.get(key)||new Set();set.add(m.id);bucket.tags.set(key,set);}}
    return Object.freeze({candidates(context){const b=buckets.get(address(context.route,{worldId:context.worldId,instanceId:context.instanceId,continuityId:context.continuityId}));if(!b)return [];
        const ids=new Set(b.fallback);for(const [role,entities]of Object.entries(context.roles))for(const e of entities)for(const tag of registry.expand(e.tags))for(const id of b.tags.get(`${role}:${tag}`)||[])ids.add(id);
        return [...ids].sort(compareCodePoints).map(id=>structuredClone(unique.get(id)));},
        all:()=>[...unique.values()].map(m=>structuredClone(m))});
}
const rank=m=>[layers.indexOf(m.priority.layer),m.priority.depth,m.priority.value,m.priority.specificity,m.priority.order];
function order(a,b){const x=rank(a),y=rank(b);for(let i=0;i<x.length;i++)if(x[i]!==y[i])return x[i]-y[i];return 0;}
export function createRuleLock(modules,options){
    const pack=compileRuleModules(modules,options),values=pack.all().sort((a,b)=>compareCodePoints(a.id,b.id));
    return {schema:1,resolver:'village.mix@2',refs:values.map(m=>`${m.id}@${m.revision}`),fingerprint:hash64('rule-lock@1',address(values)),modules:values};
}
export function validateRuleLock(lock,options){shape(lock,['schema','resolver','refs','fingerprint','modules']);check(lock.schema===1&&same(lock,createRuleLock(lock.modules,options)),'Unsupported or inconsistent rule lock.');return lock;}
// This is the operation resolver, not evaluateRule or the tag matcher. It
// produces detached arithmetic/gate/evidence proposals, never owner writes.
export function resolveRuleEffects(pack,context,options){
    const candidates=pack.candidates(context),matched=candidates.filter(m=>matchRuleModule(m,context,options).met);
    const effects=matched.flatMap(m=>m.effects.map(e=>({m,e,ref:`${m.id}@${m.revision}/${e.id}`}))).sort((a,b)=>compareCodePoints(a.ref,b.ref));
    const exemptions=effects.filter(x=>x.e.kind==='gate'&&x.e.combine==='exempt'&&context.facts[x.e.sourceFact]===true);
    const bypass=x=>exemptions.some(a=>a.e.channel===x.e.channel&&a.e.target===x.e.target&&a.e.overrides.includes(x.ref));
    const gates=effects.filter(x=>x.e.kind==='gate'&&x.e.combine==='veto'&&!bypass(x));
    const blocked=gates.filter(x=>x.e.channel==='physics'||x.e.target==='access');
    const params=effects.filter(x=>x.e.kind==='parameter'),replacements=params.filter(x=>x.e.combine==='replace').sort((a,b)=>order(b.m,a.m));
    const winner=replacements[0];if(winner)for(const other of replacements.slice(1))if(order(winner.m,other.m)===0)check(same(winner.e.value,other.e.value),'Conflicting equal-rank replacements.');
    let value=winner?.e.value||rational(1);
    for(const x of params.filter(x=>x.e.combine==='add'))value=arithmetic(value,x.e.value,false);
    for(const x of params.filter(x=>x.e.combine==='multiply'))value=arithmetic(value,x.e.value,true);
    let lo=rational(0),hi=null;for(const {e}of params){if(e.combine==='min'&&cmp(e.value,lo)>0)lo=e.value;if(e.combine==='max'&&(!hi||cmp(e.value,hi)<0))hi=e.value;}
    check(!hi||cmp(lo,hi)<=0,'Conflicting parameter bounds.');if(cmp(value,lo)<0)value=lo;if(hi&&cmp(value,hi)>0)value=hi;
    return {value,blocked:blocked.map(x=>x.ref),obligations:gates.filter(x=>x.e.target==='obligation').map(x=>x.ref),
        proposals:effects.filter(x=>['observation','consequence'].includes(x.e.kind)&&(x.e.kind!=='consequence'||context.facts['evidence.witnessed']===true)).map(x=>({ref:x.ref,value:x.e.value})),
        receipt:{schema:1,resolver:'village.mix@2',candidateCount:candidates.length,matched:matched.map(m=>`${m.id}@${m.revision}`),effects:effects.map(x=>({ref:x.ref,channel:x.e.channel,kind:x.e.kind,combine:x.e.combine,status:bypass(x)?'exempted':x.e.kind==='parameter'&&x.e.combine==='replace'&&x!==winner?'superseded':'applied'})),value:structuredClone(value)}};
}
// Explicit finite claim allocation for admission fixtures. No reaction executor
// is admitted: full extent is required, and an unresolved shared claim refuses.
export function allocateRuleClaims(stock,candidates,{selected}={}){
    check(object(stock)&&Object.values(stock).every(n=>Number.isSafeInteger(n)&&n>=0)&&Array.isArray(candidates),'Invalid claim ledger.');
    for(const c of candidates)check(text(c.id)&&Number.isSafeInteger(c.priority)&&object(c.claims)&&Object.keys(c.claims).length&&Object.values(c.claims).every(positive),'Invalid full-extent claim.');
    const feasible=candidates.filter(c=>Object.entries(c.claims).every(([id,n])=>(stock[id]||0)>=n)&&(selected===undefined||c.id===selected)).sort((a,b)=>b.priority-a.priority||compareCodePoints(a.id,b.id));
    check(feasible.length,'Missing full reaction means.');const first=feasible[0];check(selected!==undefined||!feasible.slice(1).some(c=>c.priority===first.priority&&Object.keys(c.claims).some(id=>first.claims[id])),'Conflicting reaction claims.');
    return {selected:first.id,debits:structuredClone(first.claims),remaining:Object.fromEntries(Object.entries(stock).map(([id,n])=>[id,n-(first.claims[id]||0)]))};
}
