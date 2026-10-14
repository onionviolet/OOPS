import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {once} from 'node:events';
import {slice,step,clock,stats,measure,save,environment,WARM,SAMPLES} from './common.mjs';
const result={environment:environment(),rows:[],startupMs:[]};
const encoder=new TextEncoder(),decoder=new TextDecoder();
let worker;
for(let i=0;i<5;i++){
  const t=clock();const w=new Worker(new URL('./worker.mjs',import.meta.url));
  const [msg]=await once(w,'message');assert(msg.ready);result.startupMs.push(clock()-t);
  if(i===4)worker=w;else await w.terminate();
}
let id=0;
async function request(msg,list=[]){const next=once(worker,'message');worker.postMessage({...msg,id:++id},list);const [reply]=await next;assert.equal(reply.id,id);return reply;}
try {
for(const n of [1000,10000]){
  const state=slice(n),bytes=encoder.encode(JSON.stringify(state));
  const expected=step(structuredClone(state)),expectedText=JSON.stringify(expected);
  const dimensions={n,inputUTF8Bytes:bytes.byteLength,resultUTF8Bytes:encoder.encode(JSON.stringify(expected)).length};
  result.rows.push({...dimensions,case:'structuredClone-state-local',...measure(()=>structuredClone(state))});
  result.rows.push({...dimensions,case:'single-thread-clone-plus-step',...measure(()=>step(structuredClone(state)))});
  result.rows.push({...dimensions,case:'json-pack-only',...measure(()=>encoder.encode(JSON.stringify(state)))});
  result.rows.push({...dimensions,case:'json-unpack-result-only',...measure(()=>JSON.parse(expectedText))});
  const cases=['object','json-clone','json-transfer'].map(mode=>({mode,raw:[],compute:[],echo:[],detachChecks:0}));
  for(let r=-WARM;r<SAMPLES;r++)for(let j=0;j<cases.length;j++){
    const c=cases[((r+WARM)+j)%cases.length];
    // Echo: prepacked input, transport only, both directions, no step or parsing.
    const input=c.mode==='object'?state:new Uint8Array(bytes);
    const t=clock();
    const echo=await request({echo:true,transfer:c.mode==='json-transfer',...(c.mode==='object'?{state:input}:{bytes:input})},c.mode==='json-transfer'?[input.buffer]:[]);
    const elapsed=clock()-t;
    if(c.mode==='json-transfer'){assert.equal(input.buffer.byteLength,0);c.detachChecks++;assert.deepEqual(echo.bytes,bytes);}
    else if(c.mode==='object')assert.deepEqual(echo.state,state);
    else assert.deepEqual(echo.bytes,bytes);
    if(r>=0)c.echo.push(elapsed);
    // End-to-end: sender packing, post, worker decoding/step/encoding, return and receiver unpack.
    const begin=clock();
    const packed=c.mode==='object'?null:encoder.encode(JSON.stringify(state));
    const reply=await request({mode:c.mode,...(packed?{bytes:packed}:{state})},c.mode==='json-transfer'?[packed.buffer]:[]);
    const out=c.mode==='object'?reply.result:JSON.parse(decoder.decode(reply.bytes));
    const total=clock()-begin;
    assert.deepEqual(out,expected);
    if(c.mode==='json-transfer'){assert.equal(packed.buffer.byteLength,0);c.detachChecks++;}
    if(r>=0){c.raw.push(total);c.compute.push(reply.workerMs);}
  }
  for(const c of cases){
    result.rows.push({...dimensions,case:`${c.mode}-echo-prepacked`,...stats(c.echo)});
    result.rows.push({...dimensions,case:`${c.mode}-step-end-to-end`,workerStage:stats(c.compute),detachChecks:c.detachChecks,...stats(c.raw)});
  }
  console.log(`Verified n=${n}: object and both byte modes equal the single-thread result.`);
}
} finally {await worker.terminate();}
result.correctness='Every echo verified, every step result equals single-thread result, both transfer directions used transfer lists; sender detachment asserted';
result.endEnvironment=environment();save('workers-results.json',result);
