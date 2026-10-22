// Seer pathway as an ascension path (ASC19). The descriptor is data over facts the
// LOTM owners already emit (lotmFacts); position and progress are never saved here.
// An ingest crossing is met by holding the dose: drinking it is the crossing itself.
// The ceiling stops the slice at Sequence 8.
import {definePath,pathView} from './ascension_paths.js';
import {LOTM_DIGEST_ACTS} from './book_world_lotm_ids.js';
export const seerPathway=definePath({id:'lotm.seer',world:'book.lotm.tingen',label:'Seer pathway',shape:'ladder',stages:[
 {id:'ordinary',label:'Ordinary clerk',crossings:[],grants:['No Beyonder source']},
 {id:'seq9',label:'Sequence 9 · Seer',crossings:[{id:'seer_dose',type:'ingest',label:'Hold the allocated Seer dose, then drink it',fact:'heldSeer',need:true,irreversible:true}],
  grants:['Spirituality pool','Material perception once taught']},
 {id:'seq8',label:'Sequence 8 · Clown',crossings:[
  {id:'acting',type:'digest',label:'Acts performed in the Seer role',fact:'acting',need:LOTM_DIGEST_ACTS},
  {id:'assessment',type:'recognition',label:'Warden Hale assesses the digestion',fact:'assessed',need:true},
  {id:'clown_dose',type:'ingest',label:'Hold the released Clown dose, then drink it',fact:'heldClown',need:true,irreversible:true}],
  grants:['Fine body coordination','Combat intuition','Facial control'],
  failure:{signs:'Whispers, headaches and a persona that slips off-stage',outcome:'Loss of control if a potion is drunk undigested or out of order'}},
 {id:'seq7',label:'Sequence 7',crossings:[{id:'unknown',type:'ingest',label:'Not offered in this slice',fact:'never',need:true}],grants:[]},
]});
const SETTLE=['unsettled','settling','settled'];
export function lotmPathView(state,f){
 const flag=k=>f[`lotm.flag.${k}`]===true,position=flag('promoted')?2:flag('ingested')?1:0;
 const v=pathView(seerPathway,position,{heldSeer:(f['lotm.holds.dose']||0)>0,acting:f['lotm.acting']||0,assessed:flag('assessed'),heldClown:(f['lotm.holds.clownDose']||0)>0},{known:3,ceiling:2});
 // Canon: you know a potion is digested by feel, so the felt state is words; the act count is a plain record of what you did.
 const felt=position!==1?null:f['lotm.digested']?SETTLE[2]:(f['lotm.acting']||0)>0?SETTLE[1]:SETTLE[0];
 return {...v,felt};
}
