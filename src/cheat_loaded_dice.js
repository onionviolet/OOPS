import {scopedStream} from './seeded_streams.js';
import {HARVEST_PARTS} from './harvest.js';
// The endpoints of the existing native uint32 unit draw, not new randomness.
export const LOADED_DICE_VALUES=Object.freeze({low:0,high:0xffffffff/0x100000000});
export function loadedDiceValue(direction='low'){
 if(typeof direction!=='string'||!Object.hasOwn(LOADED_DICE_VALUES,direction))throw Error('Choose a low or high loot roll.');
 return LOADED_DICE_VALUES[direction];
}
// A paid pending value is known to its holder. Reading it draws nothing.
export function loadedDiceCall(save){
 if(!save.cheats?.held?.['loaded-dice'])return null;
 const world=save.expansion?.actors?.player?.worldId??'base.frontier';
 const call=save.expansion?.streams?.cells?.[scopedStream('loot',world)]?.call;
 if(call?.via!=='loaded-dice')return null;
 return {direction:call.value===LOADED_DICE_VALUES.low?'low':call.value===LOADED_DICE_VALUES.high?'high':'chosen'};
}
// Completed overrides are durable. Their object order selects one display row,
// not a claim about when keyed replay last occurred. Never peek or draw here.
export function loadedDiceCompletedCall(save){
 if(!save.cheats?.held?.['loaded-dice'])return null;
 const world=save.expansion?.actors?.player?.worldId??'base.frontier',stream=scopedStream('loot',world),streams=save.expansion?.streams;
 let receipt=null;
 for(const r of Object.values(streams?.cells?.[stream]?.overrides||{}))if(r.s===stream&&r.via==='loaded-dice')receipt=r;
 // Older saves may retain a completed call in the bounded audit log alone.
 if(!receipt)for(const r of streams?.log||[])if(r.s===stream&&r.via==='loaded-dice')receipt=r;
 if(!receipt)return null;
 const direction=receipt.u===LOADED_DICE_VALUES.low?'Low':receipt.u===LOADED_DICE_VALUES.high?'High':'Chosen';
 const harvest=world==='base.frontier'?save.harvest:null,last=harvest?.last;
 const matches=s=>s&&receipt.k===`harvest:${s.key}:specimen`;
 const specimen=matches(last?.specimen)?last.specimen:matches(harvest?.job?.specimen)?harvest.job.specimen:
  Object.values(harvest?.lots||{}).flat().find(matches);
 const outputs=matches(last?.specimen)?(last.outputs||[]).flatMap(o=>HARVEST_PARTS[o.part]?[{name:HARVEST_PARTS[o.part].id,count:o.count,quality:o.quality,completeness:o.completeness}]:[]):[];
 return {direction,subject:specimen?`${specimen.species} carcass`:'a loot decision here',outputs};
}
