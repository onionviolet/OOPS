// Disposable ER14 kernel, API 1. No DOM or game names. Trusted modules only.
import {createHash} from 'node:crypto';
const copy = structuredClone;
const check = (ok, msg) => {if (!ok) throw Error(msg);};
const nat = n => Number.isSafeInteger(n) && n >= 0;
const key = s => typeof s === 'string' && /^[a-z][a-z0-9_.:-]*$/i.test(s) && !['__proto__','constructor','prototype'].includes(s);
const freeze = v => {if (v && typeof v === 'object' && !Object.isFrozen(v)) {Object.values(v).forEach(freeze);Object.freeze(v);}return v;};
const hash = s => createHash('sha256').update(s).digest('hex');
const cmp = (a,b) => a.due-b.due || a.rank-b.rank || a.id.localeCompare(b.id,'en') || a.seq-b.seq;
function push(h,v) {h.push(v);let i=h.length-1;while(i){const p=(i-1)>>1;if(cmp(h[p],v)<=0)break;h[i]=h[p];i=p;}h[i]=v;}
function pop(h) {const first=h[0],last=h.pop();if(h.length){let i=0;while(2*i+1<h.length){let c=2*i+1;if(c+1<h.length && cmp(h[c+1],h[c])<0)c++;if(cmp(last,h[c])<=0)break;h[i]=h[c];i=c;}h[i]=last;}return first;}
function order(modules) {
 const by=new Map();for(const m of modules){check(key(m.id)&&!by.has(m.id),'module collision');check(m.version===1,'module version');by.set(m.id,m);}
 const out=[],done=new Set(),active=new Set();
 function visit(id){check(by.has(id),'missing dependency');check(!active.has(id),'dependency cycle');if(done.has(id))return;active.add(id);for(const d of [...(by.get(id).depends||[])].sort())visit(d);active.delete(id);done.add(id);out.push(by.get(id));}
 [...by.keys()].sort().forEach(visit);return out;
}
export class Kernel {
 #modules; #state; #schemas=new Map(); #handlers=new Map(); #systems=[]; #dirty=new Set(); #saved=new Map(); #cache=new Map(); #seed; #rank=new Map(); #backend;
 constructor(modules,seeds={default:42}) {
  this.#seed=freeze(copy(seeds));this.#modules=order(modules);
  this.#state={core:{clock:0,heap:[],seq:0,rng:{},seen:{},log:[]},slices:{}};
  this.#modules.forEach((m,rank)=>{this.#rank.set(m.id,rank);
   for(const [id,s] of Object.entries(m.slices||{})){check(key(id)&&!this.#schemas.has(id),'slice collision');this.#schemas.set(id,s);this.#state.slices[id]=freeze(copy(s.initial));}
   for(const [id,h] of Object.entries(m.commands||{})){check(key(id)&&!this.#handlers.has(id)&&id!=='advance','command collision');this.#handlers.set(id,{h,rank});}
   for(const s of m.systems||[])this.#systems.push({...s,rank,module:m.id});
  });
  this.#systems.sort((a,b)=>a.rank-b.rank||a.id.localeCompare(b.id,'en'));
  for(const id of this.#schemas.keys())this.#dirty.add(id);this.#validate(this.#state,this.#dirty);
 }
 get clock(){return this.#state.core.clock;}
 view(id){check(this.#schemas.has(id),'unknown slice');return this.#state.slices[id];}
 snapshot(){return copy(this.#state);}
 #validate(st,dirty){
  const affected=new Set(dirty);
  // Validation dependencies must name every slice read by a cross-domain validator.
  let changed=true;while(changed){changed=false;for(const [id,s]of this.#schemas)if(!affected.has(id)&&(s.validateDepends||[]).some(d=>affected.has(d))){affected.add(id);changed=true;}}
  for(const id of affected){const s=this.#schemas.get(id);check(s,'unknown validation slice');check(s.validate(st.slices[id],st.slices)!==false,'slice validation: '+id);}
  return [...affected];
 }
 #coreValid(c){
  check(nat(c.clock)&&nat(c.seq)&&Array.isArray(c.heap)&&Array.isArray(c.log),'bad core');
  for(const e of c.heap)check(nat(e.due)&&e.due>=c.clock&&nat(e.seq)&&nat(e.rank)&&key(e.id)&&this.#handlers.has(e.type),'bad scheduled event');
  for(let i=1;i<c.heap.length;i++)check(cmp(c.heap[(i-1)>>1],c.heap[i])<=0,'bad heap');
  check(c.rng&&c.seen&&typeof c.rng==='object'&&typeof c.seen==='object','bad core maps');
  for(const [id,v]of Object.entries(c.rng))check(key(id)&&nat(v)&&v<=0xffffffff,'bad stream');
  for(const [id,v]of Object.entries(c.seen))check(key(id)&&typeof v==='string','bad command receipt');
 }
 #transaction(fn){
  const st={core:copy(this.#state.core),slices:{...this.#state.slices}},dirty=new Set();
  const api={
   get clock(){return st.core.clock;},
   read:id=>{check(this.#schemas.has(id),'unknown read slice');return st.slices[id];},
   write:(id,value)=>{check(this.#schemas.has(id),'unknown write slice');st.slices[id]=freeze(copy(value));dirty.add(id);},
   schedule:(type,id,due,payload)=>{check(this.#handlers.has(type)&&key(id)&&nat(due)&&due>=st.core.clock,'bad schedule');push(st.core.heap,{type,id,due,payload:copy(payload),rank:this.#handlers.get(type).rank,seq:st.core.seq++});},
   random:name=>{check(key(name),'bad stream name');let x=st.core.rng[name];if(x===undefined){check(nat(this.#seed[name]??this.#seed.default),'missing seed');x=parseInt(hash(name+':'+(this.#seed[name]??this.#seed.default)).slice(0,8),16)||1;}x^=x<<13;x^=x>>>17;x^=x<<5;st.core.rng[name]=x>>>0;return (x>>>0)/4294967296;}
  };
  fn(st,api);this.#coreValid(st.core);this.#validate(st,dirty);this.#state=st;for(const id of dirty)this.#dirty.add(id);this.#cache.delete('core');
 }
 command(command){
  check(key(command.id)&&this.#handlers.has(command.type),'bad command');const c=copy(command),fingerprint=hash(JSON.stringify(c));
  if(Object.hasOwn(this.#state.core.seen,c.id)){check(this.#state.core.seen[c.id]===fingerprint,'command id reused with other payload');return false;}
  this.#transaction((st,api)=>{this.#handlers.get(c.type).h(api,c.payload);st.core.seen[c.id]=fingerprint;st.core.log.push({at:st.core.clock,command:c});});return true;
 }
 advance(minutes){
  check(nat(minutes)&&nat(this.clock+minutes),'bad advance');
  this.#transaction((st,api)=>{
   const target=st.core.clock+minutes;let events=0;
   const move=to=>{const from=st.core.clock;st.core.clock=to;if(to>from)for(const s of this.#systems)s.run(api,to-from,from,to);};
   while(st.core.heap.length&&st.core.heap[0].due<=target){check(++events<=10000,'event budget exceeded');move(st.core.heap[0].due);const e=pop(st.core.heap);this.#handlers.get(e.type).h(api,e.payload);}
   move(target);st.core.log.push({advance:minutes});
  });
 }
 replay(log){for(const row of log){if('advance'in row)this.advance(row.advance);else{check(row.at===this.clock,'replay clock');this.command(row.command);}}}
 // State equality excludes the advance partition log, but includes receipts, RNG and heap.
 gameplay(){const s=this.snapshot();delete s.core.log;return s;}
 save(backend){
  if(this.#backend!==backend){this.#saved.clear();this.#backend=backend;}
  const validated=this.#validate(this.#state,this.#dirty);this.#coreValid(this.#state.core);
  const refs={},writes=[];const candidates=['core',...this.#schemas.keys()].sort();
  for(const id of candidates){
   const schema=id==='core'?1:this.#schemas.get(id).schema;
   let item=this.#cache.get(id);
   if(!item||id==='core'||this.#dirty.has(id)){const data=JSON.stringify({schema,value:id==='core'?this.#state.core:this.#state.slices[id]});item={data,digest:hash(data)};this.#cache.set(id,item);}
   const name=`chunk.${id}.${item.digest}`;refs[id]={key:name,schema,digest:item.digest};
   if(this.#saved.get(id)!==item.digest){const result=backend.write(name,item.data);writes.push({id,bytes:Buffer.byteLength(item.data),...result});}
  }
  const manifest=JSON.stringify({api:1,seeds:this.#seed,modules:this.#modules.map(m=>({id:m.id,version:m.version})),refs});
  const result=backend.write('manifest',manifest);writes.push({id:'manifest',bytes:Buffer.byteLength(manifest),...result});
  for(const [id,r]of Object.entries(refs))this.#saved.set(id,r.digest);this.#dirty.clear();
  return {validated,writes,totalBytes:Object.values(refs).reduce((n,r)=>n+Buffer.byteLength(backend.read(r.key)),Buffer.byteLength(manifest))};
 }
 load(backend){
  const m=JSON.parse(backend.read('manifest'));check(m.api===1&&JSON.stringify(m.seeds)===JSON.stringify(this.#seed),'save API/seeds');
  check(JSON.stringify(m.modules)===JSON.stringify(this.#modules.map(x=>({id:x.id,version:x.version}))),'module revision mismatch');
  const ids=['core',...this.#schemas.keys()].sort();check(JSON.stringify(Object.keys(m.refs).sort())===JSON.stringify(ids),'save domain mismatch');
  const st={core:null,slices:{}};
  for(const id of ids){const r=m.refs[id],data=backend.read(r.key);check(hash(data)===r.digest,'chunk hash');const p=JSON.parse(data);check(p.schema===(id==='core'?1:this.#schemas.get(id).schema)&&r.schema===p.schema,'chunk schema');if(id==='core')st.core=p.value;else st.slices[id]=freeze(p.value);}
  this.#coreValid(st.core);this.#validate(st,new Set(this.#schemas.keys()));this.#state=st;this.#saved=new Map(Object.entries(m.refs).map(([id,r])=>[id,r.digest]));this.#cache.clear();this.#dirty.clear();this.#backend=backend;
 }
}
