import {parentPort} from 'node:worker_threads';
import {step,clock} from './common.mjs';
const encoder=new TextEncoder(),decoder=new TextDecoder();
parentPort.on('message',msg=>{
  if(msg.echo){parentPort.postMessage(msg,msg.transfer?[msg.bytes.buffer]:[]);return;}
  const start=clock();
  const state=msg.mode==='object'?msg.state:JSON.parse(decoder.decode(msg.bytes));
  const result=step(state);
  const reply=msg.mode==='object'?{id:msg.id,result}:{id:msg.id,bytes:encoder.encode(JSON.stringify(result))};
  reply.workerMs=clock()-start;
  parentPort.postMessage(reply,msg.mode==='json-transfer'?[reply.bytes.buffer]:[]);
});
parentPort.postMessage({ready:true});
