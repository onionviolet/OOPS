// LOTM rites on the shared ritual mechanism (DWF160, ritual_conditions.js): Sun 5 Priest of Light (solitary: buried in non-melting ice in pure darkness) and
// Visionary 5 Dreamwalker (creature: a contracted spirit-world harpy's tail feather, drunk in intense joy or anger). The conditions are rule predicates over
// facts this branch already tracks (place, branch-day time, holdings, flags, a timed note). The goods, contracts and prices below are authored PROPOSALS
// (WPR5): canon names the rite, not where a Tingen probationer gets the ice or the harpy. Nothing here is consumed, because Seq 5 doses are not drinkable
// yet: the grade is shown at the bench (a preview) and by `gradeRiteAtTransition`, the hook a future ingestion command calls at the moment of drinking.
import {LOTM_IDS as I,LOTM_LOCATIONS as L,LOTM_PENCE as P} from './book_world_lotm_ids.js';
import {eq,gte,all,af,has,no,item,know,money,cmd} from './book_world_lotm_kit.js';
import {defineRitual,gradeRitual,describeGrade,ritualDial} from './ritual_conditions.js';
import {itemKey} from './lotm_formula_rows.js';

export const LOTM_RITUAL_DIAL=ritualDial('lotm',{floor:0.5,baseOdds:5,maxOdds:90,recoveryDays:7,
 why:'PROPOSAL. A met rite leaves a small baseline risk, a stand-in adds its missing share, an absent condition adds the most, and the ceiling stays under certain loss of control. Pre-signs stay reversible for about a week (DWF149, canon leeway).'});
export const RITE_EMOTION_MINUTES=60,RITE_DARK_FROM=960; // proposal: the last 8 hours of the branch day are night (the district shift covers the first 16)
const ITEM_NAMES={nonMelting:'Block of non-melting ice',ice:'Block of ordinary ice',canvas:'Blackout canvas',harpyFeather:'Spirit-world harpy tail feather',messengerFeather:'Spirit messenger feather'};
export const RITE_KEYS=Object.freeze(Object.fromEntries(Object.entries(ITEM_NAMES).map(([k,n])=>[k,itemKey(n)])));
export const RITE_ITEMS=Object.freeze([
 [ITEM_NAMES.nonMelting,'Ice that does not melt at ordinary warmth, ordered through the broker. Authored proposal: canon names non-melting ice for the Priest of Light rite but gives no seller.'],
 [ITEM_NAMES.ice,'An ordinary block of ice from the docks ice-house. It melts, so it only stands in for a burial.'],
 [ITEM_NAMES.canvas,'Heavy blackout canvas that shuts out every trace of light. Authored proposal.'],
 [ITEM_NAMES.harpyFeather,'A tail feather given by a spirit-world harpy you have a contract with. Authored proposal (canon: the Dreamwalker drinks with a contracted harpy feather).'],
 [ITEM_NAMES.messengerFeather,'A feather from a lesser spirit-world messenger you bargained with. It is a weaker stand-in for a harpy\'s feather.']]);

// Rules are evaluateRule shapes over the facts below. Fit comes from the traits, so adding a stand-in is data (DWF146).
export const LOTM_RITUALS=Object.freeze([
 defineRitual({id:'sun_5',world:'lotm',formula:'sun_5',scale:'solitary',label:'Priest of Light rite',
  evidence:['S 0706','Potion table row Sun.5'],proposals:['Ice, canvas and the stand-ins are authored; fit values come from the trait lists.'],
  conditions:[
   {id:'cold_burial',label:'Buried in non-melting ice',principle:{id:'cold_that_holds',text:'sustained deep cold around the whole body',wants:{physical:['frozen'],functional:['holds_cold'],symbolic:[]}},
    exact:{rule:eq('lotm.rit.nonMeltingIce'),text:'you hold a block of non-melting ice'},
    substitutes:[{id:'ordinary_ice',rule:eq('lotm.rit.ice'),tags:{physical:['frozen'],functional:[],symbolic:[]},text:'ordinary ice, which melts over the hours of the rite'}]},
   {id:'pure_darkness',label:'In pure darkness',principle:{id:'no_light',text:'no light reaches the body',wants:{physical:['no_light'],functional:['unseen'],symbolic:['night']}},
    exact:{rule:eq('lotm.rit.canvas'),text:'you hold blackout canvas'},
    substitutes:[{id:'night',rule:eq('lotm.rit.night'),tags:{physical:[],functional:['unseen'],symbolic:['night']},text:'the night hours, with some light still leaking in'},
     {id:'shuttered_room',rule:eq('lotm.at.lodging'),tags:{physical:['no_light'],functional:['unseen'],symbolic:[]},text:'your shuttered lodging room by day'}]}]}),
 defineRitual({id:'visionary_5',world:'lotm',formula:'visionary_5',scale:'creature',label:'Dreamwalker rite',
  evidence:['S 1045','Potion table row Visionary.5'],proposals:['The harpy bargain, the messenger bargain and the two ways to rouse a feeling are authored routes.'],
  conditions:[
   {id:'contracted_creature',label:'A contracted spirit-world harpy\'s tail feather',principle:{id:'bound_spirit_bird',text:'a spirit-world bird bound by contract gives a feather',wants:{physical:['feather'],functional:['contracted','spirit_creature'],symbolic:[]}},
    exact:{rule:all(eq('lotm.flag.rit.harpyContract'),gte('lotm.rit.harpyFeather',1)),text:'you hold the feather your harpy contract gave'},
    substitutes:[{id:'messenger_pact',rule:all(eq('lotm.flag.rit.messengerPact'),gte('lotm.rit.messengerFeather',1)),tags:{physical:['feather'],functional:['contracted'],symbolic:[]},text:'a lesser spirit messenger\'s feather, bargained for'}]},
   {id:'strong_feeling',label:'Drunk in intense joy or anger',principle:{id:'intense_feeling',text:'the body is gripped by joy or anger',wants:{physical:[],functional:['intense_feeling'],symbolic:[]}},
    exact:{rule:eq('lotm.rit.feeling'),text:`you stirred a strong feeling within the last ${RITE_EMOTION_MINUTES} minutes`},substitutes:[]}]})]);
export const riteByFormula=id=>LOTM_RITUALS.find(r=>r.formula===id)||null;
export const ritualFlags=['rit.harpyContract','rit.messengerPact'];
// Every rite command needs the branch's situation to exist, which reporting in opens.
const R=has('reportedIn');
const buy=(id,label,at,pence,key,text,extra={})=>cmd(`rit_${id}`,`${label} · ${pence} pence (a proposal)`,at,{alone:true,once:false,...extra,requires:extra.requires?all(R,extra.requires):R,costs:[money(-pence),...(extra.costs||[])],
 effects:[item('player',key,1),know(`rit.${id}`,text,'player','player','observation','understood')]});
export const ritualCommands=[
 buy('buy_ice','Buy a block of ordinary ice from the docks ice-house',L.docks,2*P.soli,RITE_KEYS.ice,'The ice-house sold you a block. It will melt well before a long rite is over.'),
 buy('buy_canvas','Buy blackout canvas at the docks',L.docks,5*P.soli,RITE_KEYS.canvas,'Heavy canvas, lined twice. Wrapped in it you cannot tell day from night.'),
 buy('buy_nonmelting','Order non-melting ice through the broker',L.docks,P.pound,RITE_KEYS.nonMelting,'The broker took your pounds and a day later produced a block that stayed hard in a warm hand. He would not say where it came from.',{requires:eq('lotm.brokerHere'),visibleWhen:all(eq('lotm.enrolled'),R,eq('lotm.brokerHere')),targetId:I.broker}),
 cmd('rit_harpy_contract','Call a spirit-world harpy and strike a contract · 4 pounds of offerings (a proposal)',L.lodging,{alone:true,requires:all(R,no('rit.harpyContract')),visibleWhen:all(eq('lotm.enrolled'),R,no('rit.harpyContract')),costs:[money(-4*P.pound)],
  effects:[af('rit.harpyContract'),item('player',RITE_KEYS.harpyFeather,1),know('rit.harpyContract','The harpy took the offering, named its price in years of dreams you will not get back, and let a tail feather fall. The contract holds while you keep the feather.','player','player','observation','understood')]}),
 cmd('rit_messenger_pact','Bargain with a lesser spirit-world messenger · 1 pound of offerings (a proposal)',L.lodging,{alone:true,requires:all(R,no('rit.messengerPact')),visibleWhen:all(eq('lotm.enrolled'),R,no('rit.messengerPact')),costs:[money(-P.pound)],
  effects:[af('rit.messengerPact'),item('player',RITE_KEYS.messengerFeather,1),know('rit.messengerPact','The small thing across the border agreed to a lesser bargain and left a feather. It is not a harpy.','player','player','observation','understood')]}),
 ...[['anger','Dwell on an old injury until your hands shake','Anger came easily. It will not last the hour.'],['joy','Play the song you love loudly until you laugh','Joy came easily. It will not last the hour.']].map(([k,label,text])=>
  cmd(`rit_stir_${k}`,`${label} · 10 min`,L.lodging,{alone:true,once:false,requires:R,duration:10,cancellation:'none',effects:[know('rit.feeling',text,'player','player','observation','seen')]}))];
// Facts: holdings, flags, branch-day night and a fresh feeling (a timed note), all computed from state the save already holds.
export function ritualFacts(state,f,{inv}){
 const clock=state.clock||0,note=state.simulation?.knowledge?.player?.['book.lotm.rit.feeling'];
 f['lotm.rit.nonMeltingIce']=(inv[RITE_KEYS.nonMelting]||0)>=1;f['lotm.rit.ice']=(inv[RITE_KEYS.ice]||0)>=1;f['lotm.rit.canvas']=(inv[RITE_KEYS.canvas]||0)>=1;
 f['lotm.rit.harpyFeather']=inv[RITE_KEYS.harpyFeather]||0;f['lotm.rit.messengerFeather']=inv[RITE_KEYS.messengerFeather]||0;
 f['lotm.rit.night']=clock%1440>=RITE_DARK_FROM;f['lotm.rit.feeling']=!!note&&clock-note.at<=RITE_EMOTION_MINUTES;
}
// The hook a drinking command calls at the moment of transition (stand-in today: the bench preview). `f` is the lotm fact map of that moment.
export function gradeRiteAtTransition(formulaId,f,dial=LOTM_RITUAL_DIAL){
 const rite=riteByFormula(formulaId);if(!rite)return null;
 const result=gradeRitual(rite,f,dial);return {...result,label:rite.label,scale:rite.scale,evidence:rite.evidence,proposals:rite.proposals,text:describeGrade(result)};
}
