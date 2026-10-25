// A named physical carrier can retain one already-paid path preparation while
// attention changes. It neither creates reserve nor duplicates the charge.
import {check,natural} from './basics.js';
export const threadBinding=body=>JSON.stringify([body.id,body.instanceId??null,body.form,...(body.continuationBodyId?[body.continuationBodyId]:[])]);
export function validateThread(t){if(t===undefined)return;check(t&&Object.keys(t).sort().join(',')==='at,body,schema'&&t.schema===1&&typeof t.body==='string'&&t.body.length<=300&&natural(t.at),'Invalid vessel-thread binding.');}
export function fittedThread(equipment,naming,body){return Object.values(equipment||{}).map(item=>{if(!item)return null;let id;try{id=JSON.parse(item.getInventoryKey()).e2_instance;}catch{return null;}const t=naming?.named?.[id]?.vesselThread;return t?.body===threadBinding(body)?id:null;}).find(Boolean)||null;}
export function threadRecord(record,body,clock){check(record&&typeof record.name==='string','Name this actual equipped instance before weaving it.');const next=structuredClone(record);next.vesselThread={schema:1,body:threadBinding(body),at:clock};validateThread(next.vesselThread);return next;}
