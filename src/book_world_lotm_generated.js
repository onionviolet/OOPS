// Pathway-row generator (DWF139, DWF135): a brewed dose becomes drinkable. A generated row is derived from the potion-table formula rows
// (names, Sequences and the dose item keys of lotm_formula_rows.js) plus a small authored overlay, and then runs through the same shared facts,
// flags, sources, validators and views as the hand-written rows (book_world_lotm_pathways.js). Only the commands differ: with no church
// officer there is no allocation, pre-screen or examiner. The player brewed the dose, drinks it, acts the role and judges the digestion by feel
// (canon: a drinker knows a potion is digested by feel, the notes' own wording). Switching, wrong-pathway and rushed drinking stay stated causes.
// Provenance is per field: 'table' (the potion table), 'proposal' (WPR5, authored here) or 'gap' (the notes say nothing, DWF72). Leaf module:
// it imports no other pathway code, so rows.js, actions.js and state.js can all depend on it.
import {LOTM_KEYS as K,LOTM_IDS as I} from './book_world_lotm_ids.js';
import {eq,gte,all,not,af,has,no,item,know,cmd} from './book_world_lotm_kit.js';
import {LOTM_CAUSES} from './book_world_lotm_causes.js';
import {drunkEffect} from './book_world_lotm_bench.js';
import {rowById} from './lotm_formula_rows.js';
const U='understood';
const grant=sourceId=>({type:'source',actor:'player',sourceId,operation:'grant',origin:'acquired',awakened:true,active:true});
const press=amount=>({type:'resource',actor:'player',key:'book.lotm.pressure',amount});
const causesOf=(...ids)=>ids.map(id=>LOTM_CAUSES.find(c=>c.id===id));
// Authored overlay for the Visionary line. Table facts used: names and Sequences (4. Visionary line), the Sequence 9 acting principle (T Alger 0035, 0034;
// S 0299) and the formula/dose rows. Everything else is a labelled proposal or a gap.
export const SPECTATOR_SPEC=Object.freeze({
 key:'vi',pid:'visionary',slug:'visionary',prefix:'vi',baseFormula:'visionary_9',nextFormula:'visionary_8',holds:{base:'spectatorDose',next:'telepathistDose'},
 baseSource:I.spectator,nextSource:I.telepathist,digest:4,
 principle:{text:'be an absolutely neutral spectator, never an actor',evidence:'T Alger 0035, 0034; a dog digested it by watching, S 0299',table:'PATHWAY_POTION_TABLE.md section 4, Visionary line'},
 acts:[
  {id:'act_watch',once:false,minutes:20,label:'Sit at the quay and watch a quarrel play out without taking a side · 20 min',
   know:['vi.acting.watch','You watched two carters settle a dispute and kept your hands and opinions out of it. Seeing without joining in, as a spectator does, settles something in you a little more each time.']},
  {id:'act_abstain',once:true,flag:'abstained',minutes:30,label:'Hear out a friend\'s grievance and give no advice, only notice what you see · 30 min',
   know:['vi.acting.abstain','You listened to a whole grievance and stayed out of it. Keeping your own feelings from tilting what you see, the point of the role, counted.']}],
 know:{
  ingest:['vi.stabilized','The dose is gone for good. The room sharpened, then went strangely flat: you could see people without being pulled in by them. You hold a Spectator source. Nobody supervised this; you were told only to stay neutral, and that the potion settles by watching, not by waiting.','observation'],
  assess:['vi.assessment','You judge by feel that the potion has settled: you watch people without being pulled in. No examiner asked you to prove it, and nobody will.','instruction'],
  promote:['vi.promoted','The Telepathist potion is gone for good. Other people\'s moods arrive as plain fact now, without your asking. This Sequence needs digesting in turn, by its own role.','observation'],
  rushed:['vi.rushed','The Telepathist potion took, but the Spectator potion was not settled. Other people\'s moods arrive unasked and tangled with your own, and a hum behind the eyes does not stop.','observation']},
 sources:{base:{label:'Spectator source (initiated)',bioDetail:'One consumed brewed dose. Source ownership is separate from digestion. The notes list no Spectator abilities, so none is granted here (gap).'},
  next:{label:'Telepathist source (Sequence 8)',bioDetail:'A second consumed brewed dose. The notes list no Telepathist abilities, so none is granted here (gap).'}},
 ladder:{s9:['A neutral, steadier view of people (proposal; canon abilities are not in the notes)'],s8:['Others\' moods read plainly (proposal; canon abilities are not in the notes)'],
  failure:{signs:'Emotional involvement skews what you see, and moods that are not yours crowd in',outcome:'Loss of control if a potion is drunk undigested, out of order or from another pathway'}}});
export function generatePathwayRow(spec){
 const base=rowById(spec.baseFormula),next=rowById(spec.nextFormula),need=(r,id)=>{if(!r||r.status!=='brewable')throw Error(`Generated row needs a brewable formula row: ${id}.`);return r;};
 need(base,spec.baseFormula);need(next,spec.nextFormula);
 for(const r of [base,next])if(r.ritual?.needed)throw Error(`${r.name} has a rite; the ritual mechanism (DWF149) owns it, not this generator.`);
 for(const [r,name] of [[base,'base'],[next,'next']])if(K[spec.holds[name]]!==r.product.key)throw Error(`The ${r.name} dose key must equal its bench product key.`);
 const cause=(...ids)=>causesOf(...ids);
 const gaps=[`The notes record no acting principle for Sequence 8 ${next.name} (M); only the Sequence 9 principle is used, and Sequence 8 digestion is not offered.`,
  'No Tingen church holds the Visionary line (Psychology Alchemists are the canon holder); nobody supervises or examines. The Alchemists contact is not written (LATER).',
  `Taking ${next.name} without a Spectator source has no cause row yet; the drink is refused with a stated reason.`,
  'The notes list no Sequence 9 or 8 abilities for this pathway, so the sources grant none yet.'];
 return Object.freeze({key:spec.key,pid:spec.pid,slug:spec.slug,prefix:spec.prefix,generated:true,church:null,potion:base.name,next:next.name,base:spec.baseSource,nextSource:spec.nextSource,
  holds:spec.holds,digest:spec.digest,acts:spec.acts,know:spec.know,sources:spec.sources,ladder:spec.ladder,principle:spec.principle,
  formulaIds:{base:base.id,next:next.id},assessLabel:'You judge the digestion by feel',crossings:{base:`Brew or buy a ${base.name} dose, then drink it`,next:`Brew or buy a ${next.name} dose, then drink it`},
  causes:{foreign:cause('wrong_pathway','switching'),rush:cause('skip','rushed')},gaps:Object.freeze(gaps),
  provenance:Object.freeze({potion:'table',next:'table',sequences:'table',doseKeys:'table (formula rows)',principle9:'table',principle8:'gap',digest:'proposal',acts:'proposal (from the table principle)',
   place:'proposal (anywhere people are)',supervision:'proposal (self-directed, no examiner)',texts:'proposal',abilities:'gap'})});
}
export const spectatorRow=generatePathwayRow(SPECTATOR_SPEC);
export const generatedRows=Object.freeze([spectatorRow]);
const notes=cs=>cs.map(c=>c.text).join(' ');
const total=cs=>cs.reduce((n,c)=>n+c.pressure,0);
const kn=(row,which)=>{const [key,text,kind]=row.know[which];return know(key,text,'player','player',kind,U);};
// Commands: drink (clean or already on another pathway), acts, the feel check, the next drink (settled or rushed). Doses come from the bench ledger.
export function generatedCommands(row){
 const f=n=>`${row.prefix}.${n}`,k=row.key,supported=`lotm.${k}Supported`,undigested=not(gte(`lotm.${k}.acting`,row.digest));
 const track=eq('lotm.beyonderTrack'),acted={type:'resource',actor:'player',key:`book.lotm.${k}.acting`,amount:1};
 const holds=h=>gte(`lotm.holds.${h}`,1),took=[grant(row.base),af(f('allocated')),af(f('ingested')),af(f('stabilized'))];
 const baseId=row.formulaIds.base,nextId=row.formulaIds.next,causes=row.causes;
 return [
  cmd(`drink_${k}9`,`Drink the brewed ${row.potion} dose (irreversible)`,null,{alone:true,visibleWhen:all(eq('lotm.enrolled'),track,no(f('ingested')),holds(row.holds.base)),
   requires:all(track,no(f('ingested')),eq('lotm.pathChosen',false),holds(row.holds.base)),costs:[item('player',K[row.holds.base],-1)],effects:[...took,drunkEffect(baseId),kn(row,'ingest')]}),
  cmd(`drink_${k}9_foreign`,`Drink the brewed ${row.potion} dose although you already hold another pathway (switching; a stated cause of loss of control)`,null,{alone:true,
   visibleWhen:all(eq('lotm.enrolled'),track,no(f('ingested')),eq('lotm.pathChosen'),holds(row.holds.base)),requires:all(track,no(f('ingested')),eq('lotm.pathChosen'),holds(row.holds.base)),costs:[item('player',K[row.holds.base],-1)],
   effects:[...took,drunkEffect(baseId),...causes.foreign.map(c=>af(`cause.${c.id}`)),press(total(causes.foreign)),
    know(`cause.foreign.${k}`,`${notes(causes.foreign)} The potion took. Whispers pressed in at once and did not ease: this is how a wrong potion on top of another pathway ends.`,'player','player','observation',U)]}),
  ...row.acts.map(a=>cmd(a.id,a.label,null,{alone:true,...(a.once===false?{once:false}:{}),visibleWhen:all(eq('lotm.enrolled'),has(f('stabilized'))),
   requires:all(eq(supported),has(f('stabilized')),...(a.flag?[no(f(a.flag))]:[]),undigested),duration:a.minutes,cancellation:'forfeit',
   effects:[...(a.flag?[af(f(a.flag))]:[]),acted,know(a.know[0],a.know[1],'player','player','observation',U)]})),
  cmd(`judge_${k}`,`${row.assessLabel}: has the ${row.potion} potion settled?`,null,{alone:true,visibleWhen:all(eq('lotm.enrolled'),has(f('stabilized')),no(f('promoted'))),
   requires:all(eq(`lotm.${k}.digested`),no(f('assessed')),no(f('promoted'))),effects:[af(f('assessed')),kn(row,'assess')]}),
  // Digestion is the gate, not the free feel check: a settled potion drinks cleanly whether or not the player clicked it, and the drink records the judgement.
  cmd(`drink_${k}8`,`Drink the brewed ${row.next} dose (irreversible: Sequence 8)`,null,{alone:true,visibleWhen:all(eq('lotm.enrolled'),has(f('ingested')),eq(`lotm.${k}.digested`),no(f('promoted')),holds(row.holds.next)),
   requires:all(has(f('ingested')),no(f('promoted')),eq(`lotm.${k}.digested`),eq(supported),holds(row.holds.next)),costs:[item('player',K[row.holds.next],-1)],
   effects:[grant(row.nextSource),af(f('assessed')),af(f('promoted')),drunkEffect(nextId),kn(row,'promote')]}),
  cmd(`drink_${k}8_rushed`,`Drink the brewed ${row.next} dose before the ${row.potion} potion has settled (skipping and rushing; stated causes of loss of control)`,null,{alone:true,
   visibleWhen:all(eq('lotm.enrolled'),has(f('ingested')),undigested,no(f('promoted')),holds(row.holds.next)),requires:all(has(f('ingested')),eq(supported),undigested,no(f('promoted')),holds(row.holds.next)),
   costs:[item('player',K[row.holds.next],-1)],effects:[grant(row.nextSource),af(f('promoted')),drunkEffect(nextId),...causes.rush.map(c=>af(`cause.${c.id}`)),press(total(causes.rush)),
    know(`cause.rush.${k}`,`${notes(causes.rush)} ${row.know.rushed[1]}`,'player','player','observation',U)]})];
}
// Which bench formula ids a generated row can drink, with their command ids (the host previews these instead of the "not yet written" marker).
export const generatedDrinkIds=Object.freeze(Object.fromEntries(generatedRows.flatMap(r=>[[r.formulaIds.base,[`book.lotm.drink_${r.key}9`,`book.lotm.drink_${r.key}9_foreign`]],[r.formulaIds.next,[`book.lotm.drink_${r.key}8`,`book.lotm.drink_${r.key}8_rushed`]]])));
