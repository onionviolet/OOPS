import {hpLeadTrialJournal} from './hp_lead_spells.js';
// Read-only 'hp' panel projection for the HP lead life: the shape the slice runner and the native route
// driver read (`arc.next`, `arc.done`), built by the shared sequence owner (place_act_sequence.js), as the
// LOTM host does. No state, tick or save of its own. registerBookBeginnings passes the ports; the panel mounts
// with the other domains. The act data is the private cast when present, else the public stub.
import {placeActSequenceView} from './place_act_sequence.js';
import {reputationView} from './reputation_view.js';
import {tieShownView} from './person_ties.js';
import {hpLeadHomeView} from './hp_lead_home.js';
import {hpLeadHouseholdActs,hpLeadSchoolLocked} from './world_packs/book_hp_lead_life_data.js';
import {getHpLeadCast,hpSchoolWeekArc} from './book_world_hp_lead_pack.js';
import {getHpLeadFlight,hpLeadFlightArc} from './book_world_hp_lead_flight.js';
import {getHpLeadDuel} from './book_world_hp_lead_duel.js';
import {getHpLeadHalloween,hpHalloweenHousePoints,HP_LEAD_HALLOWEEN} from './book_world_hp_lead_halloween.js';
import {getHpLeadQuidditch,hpQuidditchMatch} from './book_world_hp_lead_quidditch.js';
import {getHpLeadMirror} from './book_world_hp_lead_mirror.js';
import {getHpLeadFlamel} from './book_world_hp_lead_flamel.js';
import {getHpLeadNorbert,HP_LEAD_NORBERT} from './book_world_hp_lead_norbert.js';
import {getHpLeadFinale,getHpLeadFarewell,HP_LEAD_FINALE} from './book_world_hp_lead_finale.js';
import {createHpLeadPanel} from './book_world_hp_lead_ui.js';
import {registerOwnHoldings,lifeHoldings} from './own_holdings.js';
import {ladderLabel} from './coin_ladder.js';
import {readPort} from './ui_ports.js';
import {registerHpPeopleSource} from './book_world_hp_people_source.js';
import {registerLocalClockSource} from './today_strip.js';
import {resolveWorldCalendar,formatCalendar} from './world_calendar.js';
import {schoolYearText} from './book_world_hp_school_calendar.js';
import {registerDutySet} from './duties_domain.js';
import {hpDutySet} from './book_world_hp_duties.js';
import {HP_AT_SCHOOL_FACT} from './book_world_hp_duties.js';
import {hpLessonView,keepClassSlot} from './book_world_hp_lessons.js';
import {hpExamView} from './book_world_hp_exams.js';
import {domainRegistry} from './domain_registry.js';
import {hpStudyRows,hpStudyStart,hpStudyWriteNote} from './book_world_hp_inquiry.js';
import {hpPositions,hpPositionLine,HP_HOUSE_FACT,HP_HOUSES} from './book_world_hp_positions.js';
const LEAD_ID='book.hp.lead';
const EMPTY_ARC=Object.freeze({id:`${LEAD_ID}.arc`,title:'Nothing authored yet',completed:0,total:0,done:false,next:null,aftermath:null,conclusion:null});
const actData=()=>getHpLeadCast()?.householdActs??hpLeadHouseholdActs;
// W8-A route to the school: the next step is the arrival command until hp.lead.atSchool is set, then the Sorting until a house is
// set, then nothing. Both facts live on the player's actor facts (the saved actor record); nothing here is stored.
const SCHOOL_STEPS=[['arrive_school','Take the train to Hogwarts'],['sorting','Put on the Sorting Hat']];
export function hpSchoolRoute(state){
    const f=state?.actors?.player?.facts||{};
    const next=!f[HP_AT_SCHOOL_FACT]?SCHOOL_STEPS[0]:!f[HP_HOUSE_FACT]?SCHOOL_STEPS[1]:null;
    return {atSchool:f[HP_AT_SCHOOL_FACT]===true,house:HP_HOUSES[f[HP_HOUSE_FACT]]??null,
        next:next?{id:`${LEAD_ID}.${next[0]}`,label:next[1]}:null,
        locked:next?.[0]==='sorting'?structuredClone(hpLeadSchoolLocked[`${LEAD_ID}.sorting`]):[]};
}
export function hpLeadProjection(state,data=actData(),locked=getHpLeadCast()?.lockedOptions??{},week=getHpLeadCast()?.schoolWeek,flight=getHpLeadFlight(),duel=getHpLeadDuel(),halloween=getHpLeadHalloween(),quidditch=getHpLeadQuidditch(),mirror=getHpLeadMirror(),flamel=getHpLeadFlamel(),norbert=getHpLeadNorbert(),finale=getHpLeadFinale(),farewell=getHpLeadFarewell()){
    if(!state?.simulation?.people?.player)return null;
    const household=placeActSequenceView(state,data)??{...EMPTY_ARC};
    const schoolArc=household.done&&week?hpSchoolWeekArc(state,week):household;
    const flightArc=schoolArc.done&&week?hpLeadFlightArc(state,flight):null;
    const duelArc=flightArc?.done&&duel?placeActSequenceView(state,duel.data):null;
    const halloweenArc=duelArc?.done&&halloween?placeActSequenceView(state,halloween.data):null;
    const matchArc=halloweenArc?.done&&quidditch?placeActSequenceView(state,quidditch.data):null;
    const mirrorArc=matchArc?.done&&mirror?placeActSequenceView(state,mirror.data):null;
    const flamelArc=mirrorArc?.done&&flamel?placeActSequenceView(state,flamel.data):null;
    const norbertArc=flamelArc?.done&&norbert?placeActSequenceView(state,norbert.data):null;
    const finaleArc=norbertArc?.done&&finale?placeActSequenceView(state,finale.data):null;
    const farewellArc=finaleArc?.done&&farewell?placeActSequenceView(state,farewell.data):null;
    const excursions=[[flightArc,flight],[duelArc,duel],[halloweenArc,halloween],[matchArc,quidditch],[mirrorArc,mirror],[flamelArc,flamel],[norbertArc,norbert],[finaleArc,finale],[farewellArc,farewell]].filter(([arc])=>arc);
    const excursion=excursions.at(-1)?.[1]??null;
    const arc=excursions.reduce((prior,[current])=>({...current,aftermath:current.aftermath??prior.aftermath}),schoolArc);
    const venue=excursion?.data.acts.find(a=>a.id===arc.next?.id)?.venue;
    // Untaken options of the act that is current (or the last one done) show locked, never actionable.
    const shown=arc.next?.id??(excursion?.data??data).acts?.at(-1)?.id;
    const halloweenCharms=!!state.actors?.player?.completed?.[HP_LEAD_HALLOWEEN+'.charms'];
    const hufflepuffResult=state.simulation.knowledge?.player?.[HP_LEAD_NORBERT+'.match-result']?.value??null;
    const termResults=state.simulation.knowledge?.player?.[HP_LEAD_FINALE+'.cup-result']?.value??null;
    return {enrolled:state.actors?.player?.worldId===`${LEAD_ID}.world`,arc,schoolWeek:!!week,halloweenCharms,
        termResults,hufflepuffResult,excursion:excursion?{id:arc.id,venue}:null,housePoints:halloweenArc?hpHalloweenHousePoints(state):null,match:matchArc?hpQuidditchMatch(state):null,reputation:reputationView(state,{known:id=>id==='book.hp.lead.ron'&&!!hpSchoolRoute(state).house}),school:hpSchoolRoute(state),ties:hpSchoolRoute(state).house?tieShownView(state):[],home:hpLeadHomeView(state,{homes:domainRegistry.project('homes'),quote:domainRegistry.command('homes','quote')??null}),lessons:hpLessonView(state),atCharmsBench:state.simulation.people.player.location===LEAD_ID+'.school_hall',trialJournal:hpLeadTrialJournal(state),boardResult:state.simulation.knowledge?.player?.[LEAD_ID+'.spell_practice.last']?.value??null,exams:hpExamView(state),locked:structuredClone((excursion?excursion.locked?.[shown]:locked[shown])??[]),jobs:structuredClone(state.simulation.jobs||[])};
}
// Live holdings: the purse is the player's own resource under the pack's currency key (one integer in the smallest coin,
// shown on the pack's ladder); other holders (a vault, another person's coins) are different actors and never show here.
// Items are the life's own item ids in the native stock. Absent pack data or an absent resource falls back to the static text.
export function hpLeadHoldingsReaders(cast=()=>getHpLeadCast()){
    return {
        purse(state){const c=cast()?.currency,n=c&&lifeHoldings(state).resources[c.resource];
            return typeof n==='number'?ladderLabel(n,c.ladder,'an empty purse'):undefined;},
        items(){const labels=new Map([...(cast()?.items||[]),...(getHpLeadHalloween()?.items||[]),...(getHpLeadMirror()?.items||[]),...(getHpLeadFlamel()?.items||[]),...(getHpLeadNorbert()?.items||[]),...(getHpLeadFinale()?.items||[])].map(i=>[i.id,i.label])),rows=readPort('character')?.getItems?.()??{},out=[];
            for(const [key,row] of Object.entries(rows)){let id;try{id=JSON.parse(key)?.id;}catch{continue;}
                if(labels.has(id)&&(row?.count??1)>0)out.push(`${labels.get(id)}${(row?.count??1)>1?` x${row.count}`:''}`);}
            return out;},
    };
}
export function registerHpLeadDomain(register,getState,ports=null,data){
    let panel=null;
    // The Reports 'Now' line reads the life's own calendar (same projection as the scene header), not the home clock.
    if(ports)registerLocalClockSource(()=>{const state=getState(),view=state?.actors?.player?.worldId===`${LEAD_ID}.world`?resolveWorldCalendar(state):null;
        return view?{clock:formatCalendar(view,{time:true}),date:view.label,note:[schoolYearText(view.absoluteLocalDay),hpPositionLine(hpPositions(state))].filter(Boolean).join(' ')||undefined}:null;});
    registerDutySet('hp',hpDutySet(getState)); // FD8: inactive until a later act sets hp.lead.atSchool

    // The life holds nothing of its own to spend or carry (hpLeadLife.items is empty, no resources), so the shell says so.
    if(ports)registerOwnHoldings(`${LEAD_ID}.world`,{purse:'no money of your own',items:'You carry nothing of your own.',body:'Your body here is not the Village hero\'s sheet.'},hpLeadHoldingsReaders());
    registerHpPeopleSource();
    return register({id:'hp',deps:[],projection:()=>hpLeadProjection(getState(),data),refresh:()=>panel?.render(),
        panels:ports?[()=>{panel=createHpLeadPanel({project:()=>hpLeadProjection(getState(),data),read:ports.read,command:ports.command,keepSlot:()=>keepClassSlot(domainRegistry),homeAct:request=>domainRegistry.command('homes','execute')(domainRegistry.command('homes','quote')(request)),study:{rows:()=>hpStudyRows(domainRegistry),start:id=>hpStudyStart(domainRegistry,id),writeNote:id=>hpStudyWriteNote(domainRegistry,id)}});}]:[]});
}
