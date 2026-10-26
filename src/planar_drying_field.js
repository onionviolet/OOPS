// ORIGINAL contained apparatus law. This is neither outdoor weather nor a clock.
import {check,natural} from './basics.js';
export const PLANAR_DRYING_LAW=Object.freeze({id:'original.planar-stave-pulse',revision:1,warmup:2,duration:10,dryingPerMinute:500,chargePerMinute:100});
export const FIELD_METHODS=Object.freeze({observation:{horizon:2,uncertainty:2},instrument:{horizon:6,uncertainty:1},calibrated:{horizon:12,uncertainty:1}});
const exact=(v,keys)=>v&&Object.keys(v).sort().join(',')===keys.split(',').sort().join(',');
export function validatePlanarEvent(e){
    const L=PLANAR_DRYING_LAW;
    check(exact(e,'id,lawId,revision,worldId,instanceId,location,start,activeFrom,end,sequence')&&typeof e.id==='string'&&e.id.length<240&&e.lawId===L.id&&e.revision===L.revision&&
        [e.worldId,e.instanceId,e.location].every(s=>typeof s==='string'&&s.length>0&&s.length<160)&&natural(e.sequence)&&e.sequence>0&&natural(e.start)&&natural(e.end)&&
        e.activeFrom===e.start+L.warmup&&e.end===e.start+L.duration&&e.id===`${e.instanceId}:pulse:${e.sequence}`,'Invalid retained planar pulse.');
    return e;
}
export function createPlanarEvent({worldId,instanceId,location,at,sequence}){
    return validatePlanarEvent({id:`${instanceId}:pulse:${sequence}`,lawId:PLANAR_DRYING_LAW.id,revision:1,worldId,instanceId,location,
        start:at,activeFrom:at+PLANAR_DRYING_LAW.warmup,end:at+PLANAR_DRYING_LAW.duration,sequence});
}
export function readPlanarEvent(settings){return settings?.['field.event']==null?null:validatePlanarEvent(JSON.parse(settings['field.event']));}
export function planarEmission(event,{worldId,instanceId,from,to},closure){
    if(!event)return {drying:0,charge:0};validatePlanarEvent(event);
    check(event.worldId===worldId&&event.instanceId===instanceId&&natural(from)&&natural(to)&&to>=from&&['open','sealed'].includes(closure),'Planar emission needs its owning local receiver interval.');
    const minutes=closure==='sealed'?0:Math.max(0,Math.min(to,event.end)-Math.max(from,event.activeFrom));
    const drying=minutes*PLANAR_DRYING_LAW.dryingPerMinute,charge=minutes*PLANAR_DRYING_LAW.chargePerMinute;
    check(Number.isSafeInteger(drying)&&Number.isSafeInteger(charge),'Planar exposure overflow.');return {drying,charge};
}
export function nextPlanarBoundary(event,at,end){
    if(!event)return end;validatePlanarEvent(event);return Math.min(end,...[event.activeFrom,event.end].filter(n=>n>at));
}
export function validateFieldSample(s){
    check(exact(s,'schema,eventId,lawId,revision,worldId,instanceId,location,observer,method,observedAt,expiresAt,uncertainty,predictedFrom,predictedEnd,receiverClosure')&&s.schema===1&&s.lawId===PLANAR_DRYING_LAW.id&&s.revision===1&&
        typeof s.eventId==='string'&&s.eventId.length<240&&[s.worldId,s.instanceId,s.location].every(v=>typeof v==='string'&&v.length>0&&v.length<160)&&s.observer==='player'&&['open','sealed'].includes(s.receiverClosure)&&Object.hasOwn(FIELD_METHODS,s.method)&&natural(s.observedAt)&&
        natural(s.expiresAt)&&s.expiresAt===s.observedAt+FIELD_METHODS[s.method].horizon&&s.uncertainty===FIELD_METHODS[s.method].uncertainty&&natural(s.predictedFrom)&&natural(s.predictedEnd)&&s.predictedEnd>s.predictedFrom,'Invalid attributed field forecast.');return s;
}
export function recordFieldForecast(event,context,method){
    validatePlanarEvent(event);const m=FIELD_METHODS[method];
    check(m&&event.worldId===context.worldId&&event.instanceId===context.instanceId&&event.location===context.location&&natural(context.at)&&context.at>=event.start&&
        (method==='observation'||context.meter===true)&&(method!=='calibrated'||context.calibrated===true),'Use actual local signs, your fitted meter, and earned calibration knowledge.');
    // The paid apparatus publicly announces its committed cycle; no hidden future
    // weather or RNG is read. Uncertainty qualifies interpretation of that cycle.
    return validateFieldSample({schema:1,eventId:event.id,lawId:event.lawId,revision:event.revision,worldId:event.worldId,instanceId:event.instanceId,location:event.location,
        observer:'player',method,observedAt:context.at,expiresAt:context.at+m.horizon,uncertainty:m.uncertainty,receiverClosure:context.closure||'open',predictedFrom:event.activeFrom,predictedEnd:event.end});
}
export function fieldForecastStatus(sample,event,context){
    if(!sample)return {current:false,reason:'Record a dated local observation first.'};validateFieldSample(sample);
    const reason=sample.worldId!==context.worldId||sample.instanceId!==context.instanceId||sample.location!==context.location?'The observation belongs to another place or instance.':
        !event||sample.eventId!==event.id?'A different pulse is now committed.':!natural(context.at)||context.at<sample.observedAt||context.at>=sample.expiresAt?'The observation window expired; inspect and record again.':
        sample.method!=='observation'&&!context.meter?'The fitted meter is unavailable.':sample.method==='calibrated'&&!context.calibrated?'The calibration knowledge is unavailable.':'';
    return {current:!reason,reason};
}

// An explicit comparison retains the old forecast as evidence. A changed
// receiver/source qualifies the comparison; it cannot rewrite the paid pulse.
export function validateFieldOutcome(o){
    check(exact(o,'schema,sample,observedAt,eventId,receiverClosure,assessment')&&o.schema===1&&natural(o.observedAt)&&
        (o.eventId===null||typeof o.eventId==='string'&&o.eventId.length<240)&&['open','sealed'].includes(o.receiverClosure)&&
        ['source_changed','receiver_changed','window_consistent'].includes(o.assessment),'Invalid retained forecast comparison.');
    validateFieldSample(o.sample);check(o.observedAt>=o.sample.observedAt,'Backdated forecast comparison.');return o;
}
export function recordFieldOutcome(sample,event,context){
    validateFieldSample(sample);check(sample.worldId===context.worldId&&sample.instanceId===context.instanceId&&sample.location===context.location&&
        natural(context.at)&&context.at>=sample.observedAt&&['open','sealed'].includes(context.closure),'Compare the actual local receiver with its attributed sample.');
    if(event)validatePlanarEvent(event);
    return validateFieldOutcome({schema:1,sample:structuredClone(sample),observedAt:context.at,eventId:event?.id||null,receiverClosure:context.closure,
        assessment:sample.eventId!==event?.id?'source_changed':sample.receiverClosure!==context.closure?'receiver_changed':'window_consistent'});
}
