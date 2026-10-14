import {performance} from 'node:perf_hooks';
import {writeFileSync} from 'node:fs';
import os from 'node:os';
export const WARM = 5, SAMPLES = 31;
export const clock = () => performance.now();
export function stats(raw, divisor=1) {
  const sorted=raw.map(x=>x/divisor).sort((a,b)=>a-b);
  return {medianMs:sorted[Math.floor(sorted.length/2)],p95Ms:sorted[Math.ceil(.95*sorted.length)-1],minMs:sorted[0],maxMs:sorted.at(-1),samples:raw.length,rawMs:raw,divisor};
}
export function measure(fn, warm=WARM, samples=SAMPLES) {
  for(let i=0;i<warm;i++) fn();
  const raw=[];
  for(let i=0;i<samples;i++){const t=clock();fn();raw.push(clock()-t);}
  return stats(raw);
}
export async function measureAsync(fn, warm=WARM, samples=SAMPLES) {
  for(let i=0;i<warm;i++) await fn();
  const raw=[];
  for(let i=0;i<samples;i++){const t=clock();await fn();raw.push(clock()-t);}
  return stats(raw);
}
export function environment() {
  return {at:new Date().toISOString(),node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0].model,logicalCPUs:os.cpus().length,load:os.loadavg(),memory:process.memoryUsage(),warmups:WARM,samples:SAMPLES,forcedGC:false};
}
export function save(name,result){writeFileSync(name,JSON.stringify(result,null,2)+'\n');}
export function actor(i){return {id:`actor.${i}`,worldId:`world.${i%8}`,needs:{food:40+i%40,rest:30+i%50,social:20+i%60},weights:{food:1+(i%3)*.1,rest:1,social:.8},facts:{role:i%7,knownWork:i%11},action:0};}
export function tickActor(a) {
  const n=a.needs;
  n.food=Math.max(0,n.food-.05); n.rest=Math.max(0,n.rest-.03); n.social=Math.max(0,n.social-.02);
  const food=(100-n.food)*a.weights.food, rest=(100-n.rest)*a.weights.rest, social=(100-n.social)*a.weights.social;
  a.action=food>=rest && food>=social?1:rest>=social?2:3;
  if(a.action===1)n.food=Math.min(100,n.food+.12);
  else if(a.action===2)n.rest=Math.min(100,n.rest+.12);
  else n.social=Math.min(100,n.social+.12);
}
export function slice(n){return {schema:1,sequence:100,clock:12000,rng:123456,actors:Array.from({length:n},(_,i)=>actor(i)),pending:Array.from({length:Math.max(10,n/20)},(_,i)=>({id:`job.${i}`,actorId:`actor.${i}`,due:12030+i%60,kind:'work',inputs:{material:2},output:{money:5}})),worlds:Array.from({length:8},(_,i)=>({id:`world.${i}`,clock:{elapsed:12000,observedAt:12000,absence:'freeze'},facts:{season:'spring',market:.9+i*.01}}))};}
export function step(state){for(const a of state.actors)tickActor(a);state.clock++;state.sequence++;return {state,events:state.actors.slice(0,16).map(a=>({actorId:a.id,action:a.action,at:state.clock})),remaining:0};}
