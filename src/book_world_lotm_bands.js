// Pathway-and-sequence stat bands (L1, WA33/WA50/D1, 2026-11-03). One row per pathway and sequence; a person (cast, hostile, crowd) reads a band from
// their pathway and sequence, never from a per-person stat. Shapes differ by pathway: a 'physical' band (strength, speed, toughness, endurance) for
// body pathways, a 'perceptual' band (perception, spirit, tools, force) for pathways that act through sight, mind or tools. Scale: the world's own
// ordinary adult is 2 on every axis, a Sequence 9 Beyonder is 3 to 5, higher sequences rise from there. EVERY number is an authored proposal (WPR5/AD49),
// not a canon claim. Evidence: 'I' (inferred from the pathway's named Sequence 9 and 8 abilities in book_world_lotm_abilities.js); the locator names that
// source and the paragraph is still to be pinned from the novel text (unverified). A sequence nobody states is carried as 'open', never guessed.
// Shown, believed and actual strength stay separate (WA50): these are actual bands only.
import {LOTM_HOSTILES} from './book_world_lotm_abilities.js';
export const BAND_SHAPES=Object.freeze({physical:['strength','speed','toughness','endurance'],perceptual:['perception','spirit','tools','force']});
export const BAND_SCALE=Object.freeze({ordinaryAdult:2,proposal:true,note:'Authored proposal (WPR5/AD49); 0 to 10 per axis.'});
const OPEN='open';
const ev=(path,seq)=>Object.freeze({label:'I',locator:`${path} Sequence ${seq} abilities, src/book_world_lotm_abilities.js; novel paragraph unpinned`});
const row=(pathway,sequence,shape,values,evidence,proposal=true)=>Object.freeze({pathway,sequence,shape,values:Object.freeze(Object.fromEntries(BAND_SHAPES[shape].map((k,i)=>[k,values[i]]))),evidence,proposal});
// Pathway names follow src/lotm_formula_rows.js.
export const LOTM_BAND_ROWS=Object.freeze([
 row('Tyrant',9,'physical',[4,4,4,5],ev('Sailor',9)),row('Tyrant',8,'physical',[6,5,5,6],ev('Folk of Rage',8)),
 row('Death',9,'physical',[3,3,5,5],ev('Corpse Collector',9)),row('Death',8,'physical',[5,4,6,6],ev('Gravedigger',8)),
 row('Fool',9,'perceptual',[4,4,3,2],ev('Seer',9)),row('Fool',8,'perceptual',[4,5,4,2],ev('Clown',8)),
 row('Visionary',9,'perceptual',[5,3,2,1],ev('Spectator',9)),row('Visionary',8,'perceptual',[5,5,2,2],ev('Telepathist',8)),
 row('Door',9,'perceptual',[3,3,5,1],ev('Apprentice',9)),row('Door',8,'perceptual',[3,3,6,2],ev('Trickmaster',8))]);
// A person with a known pathway but unknown sequence reads the pathway's lowest published row marked open (a floor, not a guess). A person whose
// pathway is also unknown reads the generic open Beyonder floor: a Beyonder is above an ordinary adult on strength and toughness only.
const GENERIC=Object.freeze({pathway:OPEN,sequence:OPEN,shape:'physical',values:Object.freeze({strength:3,speed:3,toughness:3,endurance:3}),evidence:Object.freeze({label:'I',locator:'Nighthawk Beyonder with pathway and sequence unstated; floor only'}),proposal:true,open:true});
export function bandFor(subject){
 if(!subject||!subject.pathway||subject.pathway===OPEN)return subject&&subject.beyonder?GENERIC:null;
 const rows=LOTM_BAND_ROWS.filter(r=>r.pathway===subject.pathway);if(!rows.length)return null;
 if(subject.sequence===OPEN||subject.sequence==null){const f=rows.reduce((a,b)=>b.sequence>a.sequence?b:a);return Object.freeze({...f,sequence:OPEN,open:true});}
 return rows.find(r=>r.sequence===subject.sequence)||null;
}
// Subjects. A hostile reads the pathway of its ability key and the lowest sequence it holds; a cast person reads the table below by index id.
const HOSTILE_PATHWAY={sa:'Tyrant',cc:'Death',seer:'Fool',sv:null};
export function hostileSubject(h){return {pathway:HOSTILE_PATHWAY[h.key],sequence:h.holds.includes('next')?8:9,beyonder:true};}
// Old Neil is a Nighthawk Beyonder (ch32 P041); his own pathway and sequence are not stated in this repo, so they stay open.
export const LOTM_CAST_SUBJECTS=Object.freeze({'lotm.person.old-neil':{pathway:OPEN,sequence:OPEN,beyonder:true},'lotm.person.dunn-smith':{pathway:OPEN,sequence:OPEN,beyonder:true},'lotm.person.leonard-mitchell':{pathway:OPEN,sequence:OPEN,beyonder:true}});
export function subjectOf(id){
 const h=LOTM_HOSTILES.find(x=>x.id===id);if(h)return hostileSubject(h);
 return LOTM_CAST_SUBJECTS[id]||null;
}
// The gate: a fight window needs a band. Without one the encounter stays a card.
export function fightWindow(id){
 const band=bandFor(subjectOf(id));
 return band?{ok:true,id,band}:{ok:false,id,reason:'no_band',message:'No pathway-and-sequence band for this person; the encounter stays a card.'};
}
