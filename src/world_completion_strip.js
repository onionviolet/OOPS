// One measured-material identity, carried by the existing native inventory key.
// This is metadata on an item, never another inventory or custody publisher.
import {check} from './basics.js';
const sequence=c=>/^simulation:[1-9][0-9]*$/.test(c||'')?Number(c.slice(11)):NaN;
export function worldCompletionStripKey({sampleCause,measuredCause,productionCause,makerId}){
    const values=[sampleCause,measuredCause,productionCause].map(sequence);
    check(values.every(n=>Number.isSafeInteger(n)&&n>0)&&values[0]<values[1]&&values[1]<values[2]&&
        ['player','remainder_home.neri'].includes(makerId),'A measured strip needs its actual earlier sample, measurement and maker production.');
    return JSON.stringify({id:'Measured drain strip',datum:{schema:1,sampleCause,measuredCause,productionCause,makerId}});
}
export function worldCompletionStripStamp(key){
    if(typeof key!=='string')return null;
    let value;try{value=JSON.parse(key);}catch{return null;}
    if(!value||value.id!=='Measured drain strip'||Object.keys(value).length!==2||!value.datum||Object.keys(value.datum).length!==5||value.datum.schema!==1)return null;
    try{if(worldCompletionStripKey(value.datum)!==key)return null;}catch{return null;}
    return structuredClone(value.datum);
}
export function isWorldCompletionStripKey(key){return worldCompletionStripStamp(key)!==null;}
