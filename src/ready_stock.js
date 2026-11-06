// FD3: a counted stock of one kind, carried, with an optional ready slot of fixed capacity (B8's revolver is the first consumer; progress atlas
// "Shared foundations"). Pure leaf module: no world imports, no DOM, no clock, no save slice. The stock lives in the host's own actor resources;
// this file only builds the resource keys, effects, predicates, facts and save assertions so each world does not re-spell the same arithmetic.
// A spec is plain data: {prefix, carried, ready, kinds, capacity, actor, unit, kindLabel, factPrefix, readyFact, useKey}. Numbers a spec carries are
// the consumer's proposals (the default is a dial, set per world); nothing here fixes a capacity, a kind list or a reload time.
const nat=x=>Number.isSafeInteger(x)&&x>=0;
const pos=n=>Number.isInteger(n)&&n>0;
const gte=(fact,value,reason)=>({fact,op:'gte',value,reason});
const slot=s=>{if(!s.ready)throw Error('This stock has no ready slot.');return s.ready;};
export const stockKey=(s,base,kind)=>`${s.prefix}${base}.${kind}`;
export const stockKeys=s=>Object.freeze({carried:kind=>stockKey(s,s.carried,kind),ready:kind=>stockKey(s,slot(s),kind),use:s.useKey||null});
export const stockKind=(s,kind)=>{if(!s.kinds.includes(kind))throw Error(`Unknown ${s.kindLabel||'stock kind'} ${kind}.`);return kind;};
const res=(s,key,amount)=>({type:'resource',actor:s.actor||'player',key,amount});
// Stock in: n arrives in the carried count (the host's own acts carry cost and form).
export const stockInEffects=(s,kind,n)=>{stockKind(s,kind);if(!pos(n))throw Error(`Stock a positive whole number of ${s.unit||'units'}.`);return [res(s,stockKey(s,s.carried,kind),n)];};
// Ready: move n from carried into the ready slot. The engine refuses a negative carried count; capacity is the `free` fact (readyRequires) and the assertion.
export const readyEffects=(s,kind,n)=>{stockKind(s,kind);slot(s);if(!pos(n))throw Error(`Load a positive whole number of ${s.unit||'units'}.`);return [res(s,stockKey(s,s.carried,kind),-n),res(s,stockKey(s,s.ready,kind),n)];};
// Unready: n goes back to carried; nothing is lost.
export const unreadyEffects=(s,kind,n)=>{stockKind(s,kind);slot(s);if(!pos(n))throw Error(`Unload a positive whole number of ${s.unit||'units'}.`);return [res(s,stockKey(s,s.ready,kind),-n),res(s,stockKey(s,s.carried,kind),n)];};
// Spend exactly one ready unit; `counter` also moves the use counter (s.useKey, e.g. practice rounds) by one.
export const spendEffects=(s,kind,{counter=false}={})=>{stockKind(s,kind);slot(s);if(counter&&!s.useKey)throw Error('This stock has no use counter.');return [res(s,stockKey(s,s.ready,kind),-1),...(counter?[res(s,s.useKey,1)]:[])];};
// Spend that cannot go below zero: with an empty ready slot it yields no effects (the caller reads the count from the facts projection).
export const spendIfReadyEffects=(s,kind,readyCount,opts)=>(readyCount||0)<1?[]:spendEffects(s,kind,opts);
// Predicates (place-act `requires`). `before` conditions (e.g. "you hold the launcher") lead; reasons are the consumer's text.
const fn=(s,name)=>`${s.factPrefix}.${name}`;
export const spendRequires=(s,kind,{before=[],reason='Nothing is ready.'}={})=>({all:[...before,gte(`${fn(s,s.readyFact)}.${kind}`,1,reason)]});
export const readyRequires=(s,kind,n=1,{before=[],reasons={}}={})=>({all:[...before,gte(`${fn(s,s.carried)}.${kind}`,n,reasons.carried||'You have too few to ready.'),gte(fn(s,'free'),n,reasons.free||'The ready slot cannot take more.')]});
// Facts projection into `f`: carried and ready per kind, total ready, free capacity. Returns the total ready count.
export function stockFacts(s,resources,f,{capacity=s.capacity}={}){
 const r=resources||{};let total=0;
 for(const kind of s.kinds){
  if(s.ready){const v=r[stockKey(s,s.ready,kind)]||0;total+=v;f[`${fn(s,s.readyFact)}.${kind}`]=v;}
  f[`${fn(s,s.carried)}.${kind}`]=r[stockKey(s,s.carried,kind)]||0;}
 if(s.ready){f[fn(s,s.readyFact)]=total;f[fn(s,'free')]=Math.max(0,capacity-total);}
 return total;
}
// Save assertions, split so a consumer can interleave its own checks. `mine` = resource keys this stock owns (kinds, unknown kinds, the use counter).
export const stockOwnedKeys=(s,resources)=>Object.keys(resources||{}).filter(k=>k===s.useKey||k.startsWith(`${s.prefix}${s.carried}.`)||(s.ready&&k.startsWith(`${s.prefix}${s.ready}.`)));
export const stockReadyTotal=(s,resources)=>s.ready?s.kinds.reduce((n,kind)=>n+((resources||{})[stockKey(s,s.ready,kind)]||0),0):0;
export function assertWhole(s,resources,assert,msg='Stock counts are whole numbers, never negative.'){for(const k of stockOwnedKeys(s,resources))assert(nat(resources[k]),msg);}
export function assertCapacity(s,resources,assert,{capacity=s.capacity,msg='More are ready than the slot holds.'}={}){if(s.ready)assert(stockReadyTotal(s,resources)<=capacity,msg);}
export function assertKnownKeys(s,resources,assert,msg='Unknown stock count.'){
 for(const k of stockOwnedKeys(s,resources))assert(k===s.useKey||s.kinds.some(kind=>k===stockKey(s,s.carried,kind)||(s.ready&&k===stockKey(s,s.ready,kind))),msg);}
export function stockAssertions(s,resources,assert,{capacity=s.capacity,messages={}}={}){
 assertWhole(s,resources,assert,messages.whole);assertCapacity(s,resources,assert,{capacity,msg:messages.capacity});assertKnownKeys(s,resources,assert,messages.unknown);
}
// Count of repetitions to a graded step (FD5): steps ascend as [{count, step}]; returns the step of the last one whose count is reached, 0 below the first.
export const countToStep=(count,steps)=>steps.reduce((n,s)=>count>=s.count?s.step:n,0);
