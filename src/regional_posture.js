// A chosen internal approach to a known place. No invented encounters or rewards.
import {check} from './basics.js';
export const REGIONAL_POSTURES=Object.freeze({quiet:'Keep a quiet pace',curious:'Attend to small details',company:'Look for company'});
export const REGION_POSTURE_LIMIT=256;
const validWorld=id=>typeof id==='string'&&id.length<=96&&/^[a-zA-Z0-9_.:-]+$/.test(id);
const validPlace=id=>typeof id==='string'&&id.length>0&&id.length<=160;
export function validateRegionPostures(rows){
 if(rows===undefined)return;
 check(Array.isArray(rows)&&rows.length<=REGION_POSTURE_LIMIT&&rows.every(r=>r&&Object.keys(r).sort().join(',')==='place,posture,world'&&validWorld(r.world)&&validPlace(r.place)&&Object.hasOwn(REGIONAL_POSTURES,r.posture))&&new Set(rows.map(r=>JSON.stringify([r.world,r.place]))).size===rows.length,'Invalid regional journal posture.');
}
export function regionPosture(j,world,place){return j?.regions?.find(r=>r.world===world&&r.place===place)?.posture||null;}
export function chooseRegionPosture(j,{world,place,posture}){
 validateRegionPostures(j.regions);check(validWorld(world)&&validPlace(place)&&(posture===null||Object.hasOwn(REGIONAL_POSTURES,posture)),'Choose a known approach to your actual current place.');
 const regions=(j.regions||[]).filter(r=>r.world!==world||r.place!==place);if(posture!==null)regions.push({world,place,posture});const next={...j};if(regions.length)next.regions=regions.slice(-REGION_POSTURE_LIMIT);else delete next.regions;return next;
}
export function postureMemory(id,locale){
 return (locale==='chinese'?{quiet:'你选择在这里放慢心绪。',curious:'你选择留意这里容易错过的细节。',company:'你选择在这里寻找可以相伴的人。'}:{quiet:'You chose a quiet pace here.',curious:'You chose to notice the small details here.',company:'You chose to look for company here.'})[id]||'';
}
