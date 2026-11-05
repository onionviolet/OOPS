// Pathway-and-sequence stat bands on an open notch scale (L1 then LCB1-LCB3, WA33/WA50/D1, 2026-11-03). A person (cast, hostile, crowd) reads a band from
// their pathway and sequence, never from a per-person stat. Scale: signed notches on a log scale, a reference adult at 0, no maximum and no minimum (a
// child or an exhausted person can be negative, a Seq 0 adds notches without a redesign). One notch multiplies effective magnitude by the gain
// BAND_DIALS.gain. Toughness is counted in revolver hits: hits-to-down = gain^(toughness - force), floored at one; a revolver has force 0.
// EVERY number here is an authored proposal (WPR5/AD49), not a canon claim; calibration targets LCT1-LCT4 live in tests/lotm_calibration.test.js and the
// reasons in docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_COMBAT_DEEP_DIVE_2026-11-03.md (branch claude/gifted-bardeen-7bdcdd). Evidence 'I' = inferred.
// Sequences 4 and below are carried open (no band) until a scene needs them (LCQ2). Shown, believed and actual strength stay separate (WA50): actual bands only.
import {LOTM_HOSTILES} from './book_world_lotm_abilities.js';
import {hitsToDown as coreHitsToDown,winChance as coreWinChance,contest as coreContest} from './notch_contest.js';
export const BAND_AXES=Object.freeze(['strength','speed','toughness','endurance','perception','spirituality','force','control']);
// The two dials. gain: one notch multiplies magnitude by this (set by LCT4: 1.5^4 is about 5 hits). logistic: steepness of a contest on the notch gap
// (set by LCT2/LCT6: about 0.90 at +2 notches, about 0.99 at +4). Both are per-world dials; tests assert inequalities, not exact values (LCR1).
export const BAND_DIALS=Object.freeze({gain:1.5,logistic:1.1});
export const BAND_SCALE=Object.freeze({referenceAdult:0,signed:true,openEnded:true,unit:'notch',proposal:true,note:'Authored proposal (WPR5/AD49). The reference adult is the zero of a log scale, calibrated to stated outcomes, not a fact; axes have no maximum or minimum.'});
// Pure notch formulas (LCD1a/LCD1b). `dials` is injectable so a world can move them.
// The formulas live in the world-neutral notch_contest.js (FD2); LOTM passes its calibrated dials.
export const hitsToDown=(toughness,force=0,dials=BAND_DIALS)=>coreHitsToDown(toughness,force,dials);
export const winChance=(delta,dials=BAND_DIALS)=>coreWinChance(delta,dials);
// Probabilistic contest: the side with `delta` notches over the other wins with winChance(delta). `rng` is a required () => [0,1) (the game rng, or a fixed one in tests); no built-in default, so the core debt ceiling holds.
export const contest=(delta,rng,dials=BAND_DIALS)=>coreContest(delta,rng,dials);
// Hook, not implemented (LCD2 reach kinds): a 'fate' / probability reach kind would turn luck into a notch source, adding notches to an exchange's delta
// before contest() is called. Nothing reads this yet; it only records where that source plugs in so the contest signature does not change.
export const REACH_NOTCH_SOURCES=Object.freeze({fate:Object.freeze({implemented:false,note:'Luck as a notch source: a fate-kind effect would add its luck notches to the delta passed to contest(). Not built (LCB-later).'})});
const OPEN='open';
// Sequence curve (LCD1c): a signature axis gains +1 per Sequence from Seq 9 (+1) to Seq 5 (+5); a supporting axis sits one notch lower (never below 0); a weak or
// unlisted axis stays at the reference. Seq 4 and below are open.
export const SEQUENCE_CURVE=Object.freeze({firstSeq:9,lastSeq:5,perSequence:1,supportingDrop:1});
export const sequenceNotch=seq=>(Number.isInteger(seq)&&seq<=SEQUENCE_CURVE.firstSeq&&seq>=SEQUENCE_CURVE.lastSeq)?(SEQUENCE_CURVE.firstSeq-seq+1)*SEQUENCE_CURVE.perSequence:null;
const lean=(signature,supporting,weak)=>Object.freeze({signature:Object.freeze(signature),supporting:Object.freeze(supporting),weak:Object.freeze(weak)});
// Leans for the 22 pathways (deep dive section 5, keys are the PATHWAYS_DEEP_DIVE_2026-10-10 names). All leans are evidence 'I' until a paragraph is pinned.
export const PATHWAY_LEANS=Object.freeze({
 'Fool':lean(['control','perception'],['speed','spirituality'],['strength','toughness']),
 'Error':lean(['control','perception'],['speed'],['strength']),
 'Door':lean(['control','force'],['speed','perception'],['toughness']),
 'Visionary':lean(['control','spirituality'],['perception'],['strength','toughness','endurance']),
 'Sun':lean(['force','endurance'],['spirituality'],['speed']),
 'Tyrant':lean(['strength','force'],['toughness','endurance'],['control']),
 'White Tower':lean(['perception','control'],['spirituality'],['strength']),
 'Hanged Man':lean(['spirituality','force'],['endurance'],['speed']),
 'Darkness':lean(['spirituality','endurance'],['perception','control'],['strength']),
 'Death':lean(['spirituality','toughness'],['strength'],['speed']),
 'Twilight Giant':lean(['strength','toughness','speed'],['endurance'],['control']),
 'Red Priest':lean(['speed','strength'],['force'],['spirituality']),
 'Demoness':lean(['speed','control'],['force'],['toughness']),
 'Paragon':lean(['force','perception'],['toughness'],['speed']),
 'Hermit':lean(['spirituality','perception'],['control'],['strength']),
 'Mother':lean(['endurance','spirituality'],['toughness'],['speed']),
 'Moon':lean(['endurance','speed'],['strength'],['control']),
 'Black Emperor':lean(['control'],['spirituality'],['strength']),
 'Justiciar':lean(['control','force'],['perception'],['speed']),
 'Abyss':lean(['strength','perception'],['toughness'],['control']),
 'Chained':lean(['toughness','strength'],['spirituality'],['control']),
 'Wheel of Fortune':lean(['control'],['perception'],['strength'])});
export const LOTM_PATHWAYS=Object.freeze(Object.keys(PATHWAY_LEANS));
// Band-table pathway key -> src/lotm_formula_rows.js pathway key (null where the formula table has no rows yet: Darkness, among others).
const FORMULA_KEYED=['Fool','Door','Visionary','Sun','Tyrant','Death','Red Priest','Demoness','Hermit','Moon','Black Emperor','Justiciar'];
export const PATHWAY_FORMULA_KEY=Object.freeze(Object.fromEntries(LOTM_PATHWAYS.map(p=>[p,FORMULA_KEYED.includes(p)?p:null])));
const axisClass=(pathway,axis)=>{const l=PATHWAY_LEANS[pathway];return l.signature.includes(axis)?'signature':l.supporting.includes(axis)?'supporting':'weak';};
const curveValue=(pathway,seq,axis)=>{const s=sequenceNotch(seq),c=axisClass(pathway,axis);return c==='signature'?s:c==='supporting'?Math.max(0,s-SEQUENCE_CURVE.supportingDrop):0;};
const evCurve=(pathway,seq)=>Object.freeze({label:'I',locator:`${pathway} lean (deep dive section 5, inferred) on the Sequence curve at Sequence ${seq}; novel paragraph unpinned`});
const zero=()=>Object.fromEntries(BAND_AXES.map(a=>[a,0]));
const mk=(pathway,sequence,values,evidence,extra={})=>Object.freeze({pathway,sequence,shape:'notch',values:Object.freeze(values),evidence,proposal:true,...extra});
const curveRow=(pathway,seq)=>mk(pathway,seq,Object.fromEntries(BAND_AXES.map(a=>[a,curveValue(pathway,seq,a)])),evCurve(pathway,seq),{source:'curve'});
// Authored rows from L1, re-based. The ten L1 rows were written on a shifted placeholder scale (reference adult 2). Conversion: subtract the old reference
// (2), clip every non-signature axis to at most +1 (LCT3), and cap a signature axis at the curve value for that Sequence (an extra step beyond the
// brief, needed so Seq 9 stays within LCT1's three revolver hits). Old 'tools' maps to control and old 'spirit' to spirituality; axes the old shape
// lacked read 0. Raw legacy values stay below for audit.
const L1_OLD_REFERENCE=2;
const L1_AXES={physical:['strength','speed','toughness','endurance'],perceptual:['perception','spirituality','control','force']};
const l1=(pathway,seq,shape,raw,ability)=>({pathway,seq,shape,raw,ability});
const L1_ROWS=Object.freeze([
 l1('Tyrant',9,'physical',[4,4,4,5],'Sailor'),l1('Tyrant',8,'physical',[6,5,5,6],'Folk of Rage'),
 l1('Death',9,'physical',[3,3,5,5],'Corpse Collector'),l1('Death',8,'physical',[5,4,6,6],'Gravedigger'),
 l1('Fool',9,'perceptual',[4,4,3,2],'Seer'),l1('Fool',8,'perceptual',[4,5,4,2],'Clown'),
 l1('Visionary',9,'perceptual',[5,3,2,1],'Spectator'),l1('Visionary',8,'perceptual',[5,5,2,2],'Telepathist'),
 l1('Door',9,'perceptual',[3,3,5,1],'Apprentice'),l1('Door',8,'perceptual',[3,3,6,2],'Trickmaster')]);
const convertL1=r=>{const values=zero();
 L1_AXES[r.shape].forEach((axis,i)=>{const v=r.raw[i]-L1_OLD_REFERENCE;values[axis]=axisClass(r.pathway,axis)==='signature'?Math.min(v,sequenceNotch(r.seq)):Math.min(v,1);});
 return mk(r.pathway,r.seq,values,Object.freeze({label:'I',locator:`${r.pathway} Sequence ${r.seq} (${r.ability}) abilities, src/book_world_lotm_abilities.js; L1 row re-based to notches; novel paragraph unpinned`}),{source:'l1'});};
export const LOTM_BAND_ROWS=Object.freeze(L1_ROWS.map(convertL1));
// Every pathway at Sequences 9 to 5 on the curve; an authored row replaces the curve row for the same pathway and Sequence.
const CURVE_ROWS=Object.freeze(LOTM_PATHWAYS.flatMap(p=>{const out=[];for(let s=SEQUENCE_CURVE.firstSeq;s>=SEQUENCE_CURVE.lastSeq;s--)out.push(curveRow(p,s));return out;}));
export const LOTM_ALL_BAND_ROWS=Object.freeze(CURVE_ROWS.map(c=>LOTM_BAND_ROWS.find(r=>r.pathway===c.pathway&&r.sequence===c.sequence)||c));
// A person with a known pathway but unknown sequence reads that pathway's Sequence 9 row marked open (a floor, not a guess). A person whose pathway is also
// unknown but who is a Beyonder reads the generic open floor: above an ordinary adult on strength and toughness only.
const GENERIC=mk(OPEN,OPEN,{...zero(),strength:1,toughness:1},Object.freeze({label:'I',locator:'Nighthawk Beyonder with pathway and sequence unstated; floor only'}),{open:true});
export function bandFor(subject){
 if(!subject||!subject.pathway||subject.pathway===OPEN)return subject&&subject.beyonder?GENERIC:null;
 if(!PATHWAY_LEANS[subject.pathway])return null;
 if(subject.sequence===OPEN||subject.sequence==null){const f=LOTM_ALL_BAND_ROWS.find(r=>r.pathway===subject.pathway&&r.sequence===SEQUENCE_CURVE.firstSeq);return Object.freeze({...f,sequence:OPEN,open:true});}
 return LOTM_ALL_BAND_ROWS.find(r=>r.pathway===subject.pathway&&r.sequence===subject.sequence)||null;
}
// Subjects. A hostile reads the pathway of its ability key and the lowest sequence it holds; a cast person reads the table below by index id.
const HOSTILE_PATHWAY={sa:'Tyrant',cc:'Death',seer:'Fool',sv:null};
export function hostileSubject(h){return {pathway:HOSTILE_PATHWAY[h.key],sequence:h.holds.includes('next')?8:9,beyonder:true};}
// Dated cast subjects (WA50 "as of"; LCF4). The values are as of the lead window, v1 ch101-210 of the official English Webnovel; later chapters advance Dunn and
// Leonard and are not read here. Pathway and sequence are text-derived (label S/T where a paragraph states them; the paragraphs are in the deep dive's
// notes, not pinned in this file). Old Neil's pathway is read (Mystery Pryer, Hermit) but his Sequence is unstated, so it stays open.
const ASOF='v1 ch101-210';
export const LOTM_CAST_SUBJECTS=Object.freeze({
 'lotm.person.old-neil':Object.freeze({pathway:'Hermit',sequence:OPEN,beyonder:true,asOf:ASOF,title:'Mystery Pryer'}),
 'lotm.person.dunn-smith':Object.freeze({pathway:'Darkness',sequence:7,beyonder:true,asOf:ASOF,title:'Nightmare'}),
 'lotm.person.leonard-mitchell':Object.freeze({pathway:'Darkness',sequence:8,beyonder:true,asOf:ASOF,title:'Midnight Poet'})});
export function subjectOf(id){
 const h=LOTM_HOSTILES.find(x=>x.id===id);if(h)return hostileSubject(h);
 return LOTM_CAST_SUBJECTS[id]||null;
}
// The gate: a fight window needs a band. Without one the encounter stays a card. Unknown people return no_band.
export function fightWindow(id){
 const subject=subjectOf(id),band=bandFor(subject);
 return band?{ok:true,id,band,...(subject.asOf?{asOf:subject.asOf}:{})}:{ok:false,id,reason:'no_band',message:'No pathway-and-sequence band for this person; the encounter stays a card.'};
}
