// Read-only 'hp' panel projection for the HP lead life: the shape the slice runner and the native route
// driver read (`arc.next`, `arc.done`), built by the shared sequence owner (place_act_sequence.js), as the
// LOTM host does. No state, tick or save of its own. registerBookBeginnings passes the ports; the panel mounts
// with the other domains. The act data is the private cast when present, else the public stub.
import {placeActSequenceView} from './place_act_sequence.js';
import {hpLeadHouseholdActs} from './world_packs/book_hp_lead_life_data.js';
import {getHpLeadCast} from './book_world_hp_lead_pack.js';
import {createHpLeadPanel} from './book_world_hp_lead_ui.js';
import {registerOwnHoldings,lifeHoldings} from './own_holdings.js';
import {ladderLabel} from './coin_ladder.js';
import {readPort} from './ui_ports.js';
import {registerHpPeopleSource} from './book_world_hp_people_source.js';
import {registerLocalClockSource} from './today_strip.js';
import {resolveWorldCalendar,formatCalendar} from './world_calendar.js';
const LEAD_ID='book.hp.lead';
const EMPTY_ARC=Object.freeze({id:`${LEAD_ID}.arc`,title:'Nothing authored yet',completed:0,total:0,done:false,next:null,aftermath:null,conclusion:null});
const actData=()=>getHpLeadCast()?.householdActs??hpLeadHouseholdActs;
export function hpLeadProjection(state,data=actData(),locked=getHpLeadCast()?.lockedOptions??{}){
    if(!state?.simulation?.people?.player)return null;
    const arc=placeActSequenceView(state,data)??{...EMPTY_ARC};
    // Untaken options of the act that is current (or the last one done) show locked, never actionable.
    const shown=arc.next?.id??data.acts?.at(-1)?.id;
    return {enrolled:state.actors?.player?.worldId===`${LEAD_ID}.world`,arc,locked:structuredClone(locked[shown]??[]),jobs:structuredClone(state.simulation.jobs||[])};
}
// Live holdings: the purse is the player's own resource under the pack's currency key (one integer in the smallest coin,
// shown on the pack's ladder); other holders (a vault, another person's coins) are different actors and never show here.
// Items are the life's own item ids in the native stock. Absent pack data or an absent resource falls back to the static text.
export function hpLeadHoldingsReaders(cast=()=>getHpLeadCast()){
    return {
        purse(state){const c=cast()?.currency,n=c&&lifeHoldings(state).resources[c.resource];
            return typeof n==='number'?ladderLabel(n,c.ladder,'an empty purse'):undefined;},
        items(){const labels=new Map((cast()?.items||[]).map(i=>[i.id,i.label])),rows=readPort('character')?.getItems?.()??{},out=[];
            for(const [key,row] of Object.entries(rows)){let id;try{id=JSON.parse(key)?.id;}catch{continue;}
                if(labels.has(id)&&(row?.count??1)>0)out.push(`${labels.get(id)}${(row?.count??1)>1?` x${row.count}`:''}`);}
            return out;},
    };
}
export function registerHpLeadDomain(register,getState,ports=null,data){
    let panel=null;
    // The Reports 'Now' line reads the life's own calendar (same projection as the scene header), not the home clock.
    if(ports)registerLocalClockSource(()=>{const state=getState(),view=state?.actors?.player?.worldId===`${LEAD_ID}.world`?resolveWorldCalendar(state):null;
        return view?{clock:formatCalendar(view,{time:true}),date:view.label}:null;});
    // The life holds nothing of its own to spend or carry (hpLeadLife.items is empty, no resources), so the shell says so.
    if(ports)registerOwnHoldings(`${LEAD_ID}.world`,{purse:'no money of your own',items:'You carry nothing of your own.',body:'Your body here is not the Village hero\'s sheet.'},hpLeadHoldingsReaders());
    registerHpPeopleSource();
    return register({id:'hp',deps:[],projection:()=>hpLeadProjection(getState(),data),refresh:()=>panel?.render(),
        panels:ports?[()=>{panel=createHpLeadPanel({project:()=>hpLeadProjection(getState(),data),read:ports.read,command:ports.command});}]:[]});
}
