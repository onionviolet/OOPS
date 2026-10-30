// Seer pathway as an ascension path (ASC19). The descriptor is data over facts the
// LOTM owners already emit (lotmFacts); position and progress are never saved here.
// An ingest crossing is met by holding the dose: drinking it is the crossing itself.
// The ceiling stops the slice at Sequence 8.
import {definePath} from './ascension_paths.js';
import {ladderViewFromRecord} from './read_models/ability_ladder_bridge.js';
import {LOTM_DIGEST_ACTS} from './book_world_lotm_ids.js';
import {rowDescriptor,pathwayView,flagOf} from './book_world_lotm_pathways.js';
import {pathwayRows,ccRow} from './book_world_lotm_rows.js';
import {generatedRows} from './book_world_lotm_generated.js';
import {advanceLadders} from './lotm_advancement.js';
export const seerPathway=definePath({id:'lotm.seer',world:'book.lotm.tingen',label:'Seer pathway',shape:'ladder',stages:[
 {id:'ordinary',label:'Ordinary clerk',crossings:[],grants:['No Beyonder source']},
 {id:'seq9',label:'Sequence 9 · Seer',crossings:[{id:'seer_dose',type:'ingest',label:'Hold the allocated Seer dose, then drink it',fact:'heldSeer',need:true,irreversible:true}],
  grants:['Spirituality pool','Material perception once taught']},
 {id:'seq8',label:'Sequence 8 · Clown',crossings:[
  {id:'acting',type:'digest',label:'Acts performed in the Seer role',fact:'acting',need:LOTM_DIGEST_ACTS},
  {id:'assessment',type:'recognition',label:'Warden Hale pre-screens the digestion',fact:'assessed',need:true},
  {id:'exam',type:'trial',label:'The Nighthawk senior deacon examines the candidate',fact:'examined',need:true},
  {id:'clown_dose',type:'ingest',label:'Hold the released Clown dose, then drink it',fact:'heldClown',need:true,irreversible:true}],
  grants:['Fine body coordination','Combat intuition','Facial control'],
  failure:{signs:'Whispers, headaches and a persona that slips off-stage',outcome:'Loss of control if a potion is drunk undigested or out of order'}},
 {id:'seq7',label:'Sequence 7',crossings:[{id:'unknown',type:'ingest',label:'Not offered in this slice',fact:'never',need:true}],grants:[]},
]});
// Other pathways are descriptors built from rows (book_world_lotm_pathways.js, Q1 onward).
export const corpsePathway=rowDescriptor(ccRow);
const SETTLE=['unsettled','settling','settled'];
// L10: the ladder above Sequence 8 comes from the private advancement pack (fetch-if-present). With no pack the ceiling stays
// at Sequence 8 and play is unchanged. Rung facts the host cannot supply yet read as zero, so each blocker shows unmet and typed.
const ADVANCEMENT='lotm-advancement/advancement.json';
let ladder=null;
export function setAdvancement(pack){ladder=pack?.rungs?advanceLadders(seerPathway,pack):null;}
export const advancementRungs=()=>ladder?.rungs??null;
// RPX5: the typed ability records (L10 cards) of the Seer rung at a position and the next one, for the ladder figure's
// per-ability lines (costs the source does not state read as inferred). Empty without the pack.
export function lotmRungAbilities(position){const stages=ladder?.path.stages,cards=i=>Object.values(ladder?.rungs?.[stages?.[i]?.id]?.abilities?.cards??{});return {here:cards(position),next:cards(position+1)};}
export async function loadAdvancement(fetchFile=globalThis.fetch){
 try{
  const manifest=await fetchFile('private_packs/manifest.json');if(!manifest.ok)return null;
  const data=await manifest.json();if(data.schema!==1||!data.supplements?.includes(ADVANCEMENT))return null;
  const file=await fetchFile('private_packs/'+ADVANCEMENT);return file.ok?await file.json():null;
 }catch{return null;}
}
loadAdvancement().then(pack=>{if(pack&&!ladder)setAdvancement(pack);});
// Seer is the default view (existing saves, tests). A row's view applies once its allocation exists.
export function lotmPathView(state,f){
 const flag=k=>f[`lotm.flag.${k}`]===true;
 const row=[...pathwayRows,...generatedRows].find(r=>flag(flagOf(r,'allocated'))||flag(flagOf(r,'ingested')));
 if(row)return {...pathwayView(row,f,flag),chosen:true,others:[]};
 const homeRows=pathwayRows.filter(r=>f[`lotm.home.${r.church}`]!==false&&(f[`lotm.home.${r.church}`]===true||!f['lotm.enrolled']));
 const seerHome=f['lotm.home.evernight']===true||!f['lotm.enrolled'];
 // Before any choice, a life offers the ladders its church holds: the Evernight team's Seer and Corpse Collector, or the Machinery team's Savant.
 if(!seerHome&&homeRows.length&&!flag('allocated')&&!flag('ingested')){const [first,...rest]=homeRows;return {...pathwayView(first,f,flag),chosen:false,others:rest.map(r=>pathView(rowDescriptor(r),0,{},{known:3,ceiling:2}))};}
 const position=flag('promoted')?2:flag('ingested')?1:0;
  const rungFacts=ladder?{acting7:position>=2?f['lotm.acting']||0:0,heldMagician:(f['lotm.holds.magicianDose']||0)>0}:{};
 const v=ladderViewFromRecord(ladder?ladder.path:seerPathway,{position,facts:{heldSeer:(f['lotm.holds.dose']||0)>0,acting:f['lotm.acting']||0,assessed:flag('assessed'),examined:flag('examined')||flag('assessed')&&!flag('exam.required'),heldClown:(f['lotm.holds.clownDose']||0)>0,...rungFacts},known:ladder?Math.min(Math.max(3,position+2),ladder.path.stages.length):3,ceiling:ladder?ladder.path.stages.length-1:2});
 // Canon: you know a potion is digested by feel, so the felt state is words; the act count is a plain record of what you did.
 const felt=position!==1?null:f['lotm.digested']?SETTLE[2]:(f['lotm.acting']||0)>0?SETTLE[1]:SETTLE[0];
 const chosen=flag('allocated')||flag('ingested');
 // Before any dose is accepted every ladder this life's church holds is offered; once one is taken the others are not shown as paths.
 const others=chosen?[]:homeRows.map(r=>ladderViewFromRecord(rowDescriptor(r),{position:0,facts:{},known:3,ceiling:2}));
 return {...v,crossings:v.crossings.map(c=>flag('assessed')&&!flag('exam.required')&&c.id==='exam'?{...c,label:'Historical promotion-dose release retained'}:c),felt,potion:'Seer',chosen,others};
}
