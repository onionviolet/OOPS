// ORIGINAL physical drying law, not an outdoor climate or a clock owner.
// Moisture is retained work units; humidity/airflow/rain/cover are per-mille.
import {check} from './basics.js';
export const DRYING_LAW = Object.freeze({id:'ordinary.stave.drying',revision:1,capacity:6000,denominator:1000});
const natural=n=>Number.isSafeInteger(n)&&n>=0;
const axis=n=>natural(n)&&n<=1000;
// Numerator in millionths. Both the legacy clay rack and retained timber
// consume this geometry without claiming a shared humidity or material law.
export function receivedRainDose(rainPermille,coverPermille,closure='open'){
    check((rainPermille===null||axis(rainPermille))&&axis(coverPermille)&&['open','sealed'].includes(closure),'Unsupported received rain path.');
    return closure==='sealed'?0:(rainPermille??0)*(1000-coverPermille);
}
export function validateDryingLot(lot){
    check(lot&&Object.keys(lot).sort().join(',')==='at,cohort,dryDose,instanceId,moisture,provenanceKey,rainDose,remainder,revision,sourceKey,worldId', 'Unsupported drying lot fields.');
    check(lot.revision===1&&typeof lot.cohort==='string'&&lot.cohort.length>0&&lot.cohort.length<160&&
        typeof lot.worldId==='string'&&typeof lot.instanceId==='string'&&natural(lot.at)&&
        natural(lot.moisture)&&lot.moisture<=DRYING_LAW.capacity&&Number.isSafeInteger(lot.remainder)&&Math.abs(lot.remainder)<1000&&
        natural(lot.rainDose)&&natural(lot.dryDose)&&typeof lot.sourceKey==='string'&&
        (lot.provenanceKey===null||typeof lot.provenanceKey==='string'&&lot.provenanceKey.length<24000),'Invalid retained drying lot.');
    return lot;
}
export function createDryingLot({cohort,worldId,instanceId,at,sourceKey,provenanceKey=null,moisture=6000}){
    return validateDryingLot({revision:1,cohort,worldId,instanceId,at,sourceKey,provenanceKey,moisture,remainder:0,rainDose:0,dryDose:0});
}
export function advanceDryingExposure(lot,interval,apparatus){
    validateDryingLot(lot);
    check(interval&&interval.worldId===lot.worldId&&interval.instanceId===lot.instanceId&&interval.from===lot.at&&
        natural(interval.to)&&interval.to>=interval.from,'Drying needs its next owning local interval.');
    check(apparatus&&['open','sealed'].includes(apparatus.closure)&&axis(apparatus.coverPermille)&&
        axis(apparatus.airflowPermille)&&axis(apparatus.heatPermille),'Unsupported drying apparatus.');
    check((interval.rainPermille===null||axis(interval.rainPermille))&&
        (interval.humidityPermille===null||axis(interval.humidityPermille)),'Unsupported received moisture source.');
    const out=structuredClone(lot),minutes=interval.to-interval.from,sealed=apparatus.closure==='sealed';
    const rain=receivedRainDose(interval.rainPermille,apparatus.coverPermille,apparatus.closure);
    const dry=sealed||interval.humidityPermille===null?0:apparatus.airflowPermille*(1000-interval.humidityPermille+apparatus.heatPermille);
    // One signed retained remainder; no per-call floor loss. Constant-source
    // intervals commute with partitioning, including saturation at either end.
    const total=out.remainder+minutes*(2*rain-dry);
    check(Number.isSafeInteger(total)&&Number.isSafeInteger(out.rainDose+minutes*rain)&&Number.isSafeInteger(out.dryDose+minutes*dry),'Drying exposure exceeds supported arithmetic.');
    const change=Math.trunc(total/1000),next=out.moisture+change;
    out.moisture=Math.max(0,Math.min(6000,next));
    out.remainder=next<0||next===0&&total<=0||next>6000||next===6000&&total>=0?0:total-change*1000;
    out.rainDose+=minutes*rain;out.dryDose+=minutes*dry;out.at=interval.to;
    return validateDryingLot(out);
}
