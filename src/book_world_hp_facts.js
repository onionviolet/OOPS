import {hpSchoolLife,hpTradeLife} from './world_packs/book_hp_life_data.js';
// HP-local clock projection. Shared simulation owns all elapsed time, jobs and skill settlement.
import {recurringWindow} from './world_rhythm.js';
export function hpSchoolCalendar(state){
 const P='book.hp.school',opening=state.simulation?.knowledge?.player?.[P+'.opening'];
 if(state.actors?.player?.worldId!==P+'.world'||!opening)return null;
 const elapsed=Math.max(0,state.clock-opening.at),day=Math.floor((elapsed+540)/1440),minute=(elapsed+540)%1440;
 const teaching=day<70&&day%7<5;
 return {day:day+1,minute,hour:Math.floor(minute/60),teaching,
  label:`Term day ${day+1} · ${String(Math.floor(minute/60)).padStart(2,'0')}:${String(minute%60).padStart(2,'0')} · ${day>=70?'term break':day%7>=5?'weekend':'teaching day'}`,
  charms:teaching&&recurringWindow({period:1440,opens:540,closes:660},elapsed+540).open,
  plants:teaching&&recurringWindow({period:1440,opens:780,closes:900},elapsed+540).open};
}
export function hpFacts(state,context={}){
 const world=state.actors?.player?.worldId,trade=world==='book.hp.trade.world',c=hpSchoolCalendar(state);
 if(trade)return {'hp.trade.wandReady':(context.gameplay?.player?.inventory?.[JSON.stringify({id:'book.hp.trade.wand'})]||0)>0};
 if(!c)return {};
 const inv=context.gameplay?.player?.inventory||{},P='book.hp.school',held=n=>(inv[JSON.stringify({id:P+'.'+n})]||0)>0;
 return {'hp.school.wandReady':held('wand')||held('practice_wand'),'hp.school.charmsOpen':c.charms,'hp.school.plantsOpen':c.plants,
  'hp.school.charmsStart':c.charms&&c.minute+30<660,'hp.school.plantsStart':c.plants&&c.minute+30<900};
}

export function hpLifeStatus(state,context={}){
 const P=state.actors?.player?.worldId?.replace(/\.world$/,''),a=state.actors?.player;
 if(!['book.hp.school','book.hp.trade'].includes(P))return [];
 const r=a.resources,unit=P.endsWith('school')?'allowance':'coins';
 const rows=[{label:'Current local means',value:`${r[P+'.'+unit]||0} local units · ${r[P+'.debt']||0} debt units`}];
 if(P.endsWith('trade'))rows.push({label:'Counter till',value:`${state.actors[P+'.merchant']?.resources[P+'.coins']||0} trade units`});
 const inv=context.gameplay?.player?.inventory||{},count=n=>inv[JSON.stringify({id:P+'.'+n})]||0;
 if(P.endsWith('trade'))rows.push({label:'Owned stock',value:`${count('glass_shards')} complete fragment sets · ${count('glass_pane')} repaired panes`});
 for(const [id,p]of Object.entries(state.simulation.powers.player||{}))if(id.startsWith(P+'.'))rows.push({label:id.endsWith('levitation')?'Feather levitation':'Glass repair',value:`${p.owned?'learned':'not learned'} · ${p.mastery} practice steps · ${p.executions} executions`});
 return rows;
}

export function hpCalendarBinding(state){
 const life=[hpSchoolLife,hpTradeLife].find(l=>state?.actors?.player?.worldId===l.world.id);
 const opening=life&&state.simulation?.knowledge?.player?.[life.id+'.opening'];
 const instance=life&&state.worlds?.[life.world.id]?.facts?.[life.id+'.instance'];
 return opening&&instance?{profile:life.calendarProfile,instanceId:instance,elapsed:Math.max(0,state.clock-opening.at)}:null;
}
