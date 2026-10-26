// Sequence 9 and 8 abilities as ability descriptors (B-abilities, 2026-10-23), on the structured ability engine (compileStructuredAbilities):
// each ability is a row (acquisition 'acquired', a held source, a native command with a real cost, and a drawback) and compiles into an
// ordinary command. The same row binds any holder of the source, the player or a hostile Beyonder, so a hostile uses exactly the records the player does.
// Abilities named here are the source's own Sequence 9 and 8 abilities for each pathway [LOTM_PATHWAYS A/B]; their costs, durations, drawbacks and
// looks are authored proposals (WPR5). A `look` is concealed by default and shows only to an observer who could see it (character_bio reveal).
import {compileStructuredAbilities} from './structured_ability_runtime.js';
import {eq} from './basics.js';
import {LOTM_IDS as I} from './book_world_lotm_ids.js';
import {pathwaySources} from './book_world_lotm_pathways.js';
import {pathwayRows} from './book_world_lotm_rows.js';
const U='understood';
const stamina=n=>({type:'vital',key:'stamina',amount:-n}),cond=(id,duration)=>({type:'condition',id,operation:'apply',duration});
const note=(key,value)=>({type:'knowledge',key:`book.lotm.${key}`,stage:U,value});
// Conditions the abilities and their drawbacks apply. `look` rows are concealed unless an observer could see them.
export const abilityConditions=[
 {id:'book.lotm.cold_ward',revision:1,label:'Cold-warded',stacking:'max',bioVisible:true,bioDetail:'The cold and rot of the dead rooms slide off you for a while.'},
 {id:'book.lotm.pallor',revision:1,label:'Deathly pallor',stacking:'max',bioVisible:true,bioDetail:'Your skin has gone pale and cold after using the dead-room gift.',look:{slot:'skin',rank:3,concealed:true,seenBy:['beyonder','undead'],text:'Your skin is too pale and too cold; the dead do not flinch from you.'}},
 {id:'book.lotm.grave_strength',revision:1,label:'Grave strength',stacking:'max',bioVisible:true,bioDetail:'Your body is quicker and stronger than a clerk\'s for a while.'},
 {id:'book.lotm.sturdy_frame',revision:1,label:'Sturdy frame',stacking:'max',bioVisible:true,bioDetail:'A tougher body for a while, the archaeologist\'s.'},
 {id:'book.lotm.spirit_chill',revision:1,label:'Spirit chill',stacking:'max',bioVisible:true,bioDetail:'Seeing the near dead leaves a chill behind the eyes.'},
 {id:'book.lotm.recall_haze',revision:1,label:'Recall haze',stacking:'max',bioVisible:true,bioDetail:'Everything you studied is still pressing on you.',look:{slot:'bearing',rank:3,concealed:true,seenBy:['beyonder'],text:'You stare a half-second too long at things, as if reading them.'}},
 {id:'book.lotm.ruin_dust',revision:1,label:'Ruin dust',stacking:'max',bioVisible:true,bioDetail:'Old ruin lore leaves you restless and dusty-handed.'},
 {id:'book.lotm.steady_face',revision:1,label:'Steady face',stacking:'max',bioVisible:true,bioDetail:'Your face holds whatever you set on it.'},
 {id:'book.lotm.sea_legs',revision:1,label:'Sea legs',stacking:'max',bioVisible:true,bioDetail:'Your balance holds on any moving floor for a while.'},
 {id:'book.lotm.slick_scales',revision:1,label:'Slick scales',stacking:'max',bioVisible:true,bioDetail:'Fine scales raise on your skin and make you hard to grip.',look:{slot:'marks',rank:3,concealed:true,seenBy:['beyonder'],text:'Fine pale scales stand along your forearms and are gone again by evening.'}},
 {id:'book.lotm.long_breath',revision:1,label:'Long breath',stacking:'max',bioVisible:true,bioDetail:'You can stay under water for about ten minutes.'},
 {id:'book.lotm.rage_burst',revision:1,label:'Rage burst',stacking:'max',bioVisible:true,bioDetail:'Anger arrives with speed and strength attached.'},
 {id:'book.lotm.rage_residue',revision:1,label:'Rage residue',stacking:'max',bioVisible:true,bioDetail:'The anger takes longer to cool than it should.',look:{slot:'bearing',rank:3,concealed:true,seenBy:['beyonder'],text:'Your jaw stays set long after the thing that set it is gone.'}},
 {id:'book.lotm.persona_slip',revision:1,label:'Persona slip',stacking:'max',bioVisible:true,bioDetail:'The role you held does not quite come off.',look:{slot:'bearing',rank:3,concealed:true,seenBy:['beyonder'],text:'Your expression is a half-beat late, like someone wearing a part.'}}];
// Ability rows. stage 'base' needs the Sequence 9 source; 'next' the Sequence 8 source. fn: the engine's functional class (it must have a consumer effect).
const ROWS={
 cc:[
  {key:'cold_ward',stage:'base',fn:'physical',kind:'body-faculty',label:'Walk through the cold room unbothered',desc:'Shrug off cold and rot for a while. The body pays with a pallor.',costs:[stamina(2)],effects:[cond('book.lotm.cold_ward',240)],drawback:{id:'chill_price',price:[cond('book.lotm.pallor',480)]}},
  {key:'dead_regard',stage:'base',fn:'perception',kind:'body-faculty',label:'Let the dead take you for one of their own',desc:'Stand still among the dead and read how they regard you.',costs:[stamina(1)],effects:[note('ability.dead_regard','The dead around you did not notice you as a living thing. It holds only while you stay quiet.')],drawback:{id:'cold_price',price:[cond('book.lotm.pallor',240)]}},
  {key:'spirit_sight',stage:'next',fn:'perception',kind:'body-faculty',label:'Look at the near dead with better spirit vision',desc:'See the spirits close by.',costs:[stamina(1)],effects:[note('ability.spirit_sight','Faint shapes stood near you. You can say they are there, not who they were.')],drawback:{id:'sight_price',price:[cond('book.lotm.spirit_chill',240)]}},
  {key:'grave_strength',stage:'next',fn:'physical',kind:'body-faculty',label:'Lean on a gravedigger\'s strength',desc:'A stronger, quicker body for a while.',costs:[stamina(3)],effects:[cond('book.lotm.grave_strength',240)],drawback:{id:'strength_price',price:[cond('book.lotm.pallor',240)]}}],
 sv:[
  {key:'full_recall',stage:'base',fn:'perception',kind:'body-faculty',label:'Recall everything you studied',desc:'Full recall of what you studied, understood.',costs:[stamina(1)],effects:[note('ability.full_recall','Every page you studied came back whole and ordered.')],drawback:{id:'recall_price',price:[cond('book.lotm.recall_haze',240)]}},
  {key:'ruin_lore',stage:'next',fn:'perception',kind:'body-faculty',label:'Recall forbidden-ruin and survival lore',desc:'Ancient and survival knowledge comes unasked.',costs:[stamina(1)],effects:[note('ability.ruin_lore','You knew which stones in an old ruin to avoid, and why.')],drawback:{id:'ruin_price',price:[cond('book.lotm.ruin_dust',240)]}},
  {key:'survival_body',stage:'next',fn:'physical',kind:'body-faculty',label:'Call on an archaeologist\'s stronger body',desc:'A tougher body for a while.',costs:[stamina(3)],effects:[cond('book.lotm.sturdy_frame',240)],drawback:{id:'survival_price',price:[cond('book.lotm.ruin_dust',240)]}}],
 sa:[
  {key:'storm_balance',stage:'base',fn:'physical',kind:'body-faculty',label:'Keep your feet on a heaving deck',desc:'Excellent balance and a strong body for a while.',costs:[stamina(1)],effects:[cond('book.lotm.sea_legs',240)],drawback:{id:'balance_price',price:[cond('book.lotm.slick_scales',120)]}},
  {key:'scale_slick',stage:'base',fn:'physical',kind:'body-faculty',label:'Raise your scales and slip any grip',desc:'Hidden scales make you hard to grip.',costs:[stamina(2)],effects:[cond('book.lotm.slick_scales',180)],drawback:{id:'scale_price',price:[cond('book.lotm.rage_residue',120)]}},
  {key:'deep_breath',stage:'base',fn:'physical',kind:'body-faculty',label:'Take the long breath under water',desc:'About ten minutes under water.',costs:[stamina(2)],effects:[cond('book.lotm.long_breath',60)],drawback:{id:'breath_price',price:[cond('book.lotm.slick_scales',60)]}},
  {key:'fury_burst',stage:'next',fn:'physical',kind:'body-faculty',label:'Let your anger burst out',desc:'A burst of attack and speed when angry.',costs:[stamina(3)],effects:[cond('book.lotm.rage_burst',60)],drawback:{id:'fury_price',price:[cond('book.lotm.rage_residue',240)]}}],
 seer:[
  {key:'face_hold',stage:'next',fn:'physical',kind:'body-faculty',label:'Hold whatever face you set',desc:'Facial control for a while.',costs:[stamina(1)],effects:[cond('book.lotm.steady_face',120)],drawback:{id:'face_price',price:[cond('book.lotm.persona_slip',240)]}}]};
const STAGE={sa:{base:I.sailor,next:I.folk},cc:{base:I.corpse,next:I.gravedigger},sv:{base:I.savant,next:I.archaeologist},seer:{base:I.source,next:I.clown}};
// Hostile Beyonders (original, unnamed, not enrolled by default): the same ability rows bound to another actor. ids are definition ids only.
export const LOTM_HOSTILES=Object.freeze([
 {id:'book.lotm.rogue.cc',key:'cc',label:'Unlicensed corpse-handler (original, hostile)',holds:['base','next']},
 {id:'book.lotm.rogue.sv',key:'sv',label:'Unlicensed archivist (original, hostile)',holds:['base','next']},
 {id:'book.lotm.rogue.sa',key:'sa',label:'Unlicensed deckhand (original, hostile)',holds:['base','next']},
 {id:'book.lotm.rogue.seer',key:'seer',label:'Unlicensed fortune-teller (original, hostile)',holds:['base','next']}]);
const ownerOf=(actor,key)=>actor==='player'?`book.lotm.ab.${key}`:`book.lotm.ab.${key}.${actor.slice('book.lotm.rogue.'.length)}`;
function definitionFor(actors){
 const rows=[],commands=[],sources=[...pathwayRows.flatMap(pathwaySources),
  {id:I.source,revision:1,label:'Seer source (initiated)',kind:'trait',origin:'acquired',grants:[],bioDetail:'One consumed supervised dose.'},
  {id:I.clown,revision:1,label:'Clown source (Sequence 8)',kind:'trait',origin:'acquired',grants:[],bioDetail:'A second consumed dose after an assessed digestion.'}];
 for(const actor of actors)for(const [pk,list] of Object.entries(ROWS))for(const a of list){
  const id=ownerOf(actor,a.key);
  commands.push({id,revision:1,label:a.label,description:a.desc,group:actor==='player'?'book_lotm':'book_lotm_hostile',worldId:I.world,actorId:actor,audience:['$actor'],costs:structuredClone(a.costs),effects:structuredClone(a.effects)});
  rows.push({id:`${id}.row`,commandId:id,sourceId:STAGE[pk][a.stage],function:a.fn,acquisition:'acquired',executionKind:a.kind,control:eq('actor.life','alive'),target:null,counters:[],carriers:[],
   conditions:[{id:`${id}.${a.drawback.id}`,price:structuredClone(a.drawback.price)}]});
 }
 return {id:'book.lotm',world:{id:I.world},sources,abilities:rows,simulation:{powers:[],commands}};
}
const definition=definitionFor(['player',...LOTM_HOSTILES.map(h=>h.id)]);
// The same binding rows drive execution and the host's known-source offers.
export const abilitySourceOf=Object.freeze(Object.fromEntries(definition.abilities.map(a=>[a.commandId,a.sourceId])));
const compiled=compileStructuredAbilities(definition);
export const abilityCommands=compiled.commands.filter(c=>c.group==='book_lotm');
export const hostileAbilityCommands=compiled.commands.filter(c=>c.group==='book_lotm_hostile');
export const abilityIds=(pathKey)=>ROWS[pathKey].map(a=>ownerOf('player',a.key));
export const abilityRows=ROWS;
// Concealed looks: a source's own look is declared on the source row; the abilities above add condition looks. Who could see a look:
// observers by kind. A Beyonder (Hale, an officer, another Beyonder) sees a 'beyonder' look; the dead and spirits see an 'undead' look.
export const LOTM_OBSERVERS=Object.freeze({[I.supervisor]:['beyonder'],[I.stormOfficer]:['beyonder'],[I.machineryOfficer]:['beyonder'],[I.seniorDeacon]:['beyonder'],[I.member]:['beyonder'],
 ...Object.fromEntries(LOTM_HOSTILES.map(h=>[h.id,['beyonder']])),'book.lotm.dead':['undead']});
export function lotmReveal(observerId,registry,state){
 const kinds=LOTM_OBSERVERS[observerId]||[],out=[];if(!kinds.length)return out;
 const lookOf=d=>d?.look?.concealed&&(d.look.seenBy||[]).some(k=>kinds.includes(k));
 for(const id of Object.keys(state.actors.player.sources||{}))if(lookOf(registry.sources.get(id)))out.push(id);
 for(const [id,c] of Object.entries(state.simulation?.conditions?.player||{}))if(c.intensity>0&&lookOf(registry.simulation.conditions.get(id)))out.push(id);
 return out;
}
